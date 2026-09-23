import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  loadKnowledgeBase,
  validateCatalog,
  validateKnowledgeBase,
} from "../src/data-service.js";

const termsUrl = new URL("../data/terms.json", import.meta.url);
const relationsUrl = new URL("../data/relations.json", import.meta.url);
const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const terms = JSON.parse(await readFile(termsUrl, "utf8"));
const relations = JSON.parse(await readFile(relationsUrl, "utf8"));
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));

test("aceita a base de conhecimento atual", () => {
  assert.doesNotThrow(() => validateKnowledgeBase(terms, relations));
  assert.doesNotThrow(() => validateCatalog(catalog));
});

test("mantém o catálogo importado separado dos verbetes curados", () => {
  assert.ok(catalog.length >= 400);
  assert.ok(catalog.some((entry) => entry.source.includes("AkitaOnRails")));
  assert.ok(catalog.some((entry) => entry.source.includes("governança de metadados")));
  assert.ok(catalog.every((entry) => entry.status === "catalogado"));
});

test("não publica nomes identificados como internos", () => {
  const catalogNames = new Set(catalog.map((entry) => entry.term));

  for (const internalName of ["GMC", "Portal GMC", "Webmedia API", "MediaHub"]) {
    assert.ok(!catalogNames.has(internalName), `Nome interno publicado: ${internalName}`);
  }
});

test("rejeita fonte de catálogo com URL insegura", () => {
  const invalidCatalog = structuredClone(catalog);
  invalidCatalog[0].sourceUrl = "javascript:alert(1)";

  assert.throws(() => validateCatalog(invalidCatalog), /deve usar HTTPS/);
});

test("rejeita termos duplicados no catálogo", () => {
  const invalidCatalog = structuredClone(catalog);
  invalidCatalog[1].term = invalidCatalog[0].term.toLocaleUpperCase("pt-BR");

  assert.throws(() => validateCatalog(invalidCatalog), /Termo duplicado no catálogo/);
});

test("mantém uma base ampla de termos conectados", () => {
  assert.ok(terms.length >= 60);

  const relatedTermIds = new Set(
    relations.flatMap((relation) => [relation.source, relation.target]),
  );

  for (const term of terms) {
    assert.ok(relatedTermIds.has(term.id), `Termo sem relação: ${term.id}`);
  }
});

test("inclui o fluxo essencial de Git e GitHub como verbetes curados", () => {
  const termIds = new Set(terms.map((term) => term.id));
  const relatedTermIds = new Set(
    relations.flatMap((relation) => [relation.source, relation.target]),
  );
  const essentialIds = [
    "repositorio",
    "staging-area",
    "remote",
    "fetch",
    "pull",
    "push",
    "rebase",
    "git-revert",
    "github",
    "issue",
    "github-actions",
    "github-pages",
    "branch-protegida",
    "personal-access-token",
  ];

  for (const id of essentialIds) {
    assert.ok(termIds.has(id), `Termo Git/GitHub ausente: ${id}`);
    assert.ok(relatedTermIds.has(id), `Termo Git/GitHub sem relação: ${id}`);
  }
});

test("informa claramente quando os arquivos de dados não carregam", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => ({ ok: false, status: 404 });

  try {
    await assert.rejects(
      loadKnowledgeBase(),
      /Não foi possível carregar (os termos|as relações) \(404\)/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejeita termo com campo obrigatório vazio", () => {
  const invalidTerms = structuredClone(terms);
  invalidTerms[0].definition = "";

  assert.throws(
    () => validateKnowledgeBase(invalidTerms, relations),
    /campo obrigatório "definition"/,
  );
});

test("rejeita IDs duplicados de termos", () => {
  const invalidTerms = [...structuredClone(terms), structuredClone(terms[0])];

  assert.throws(
    () => validateKnowledgeBase(invalidTerms, relations),
    /ID duplicado em termos/,
  );
});

test("rejeita ID de termo fora do formato definido", () => {
  const invalidTerms = structuredClone(terms);
  invalidTerms[0].id = "Git Inválido";

  assert.throws(
    () => validateKnowledgeBase(invalidTerms, relations),
    /possui um ID inválido/,
  );
});

test("rejeita relação que aponta para termo inexistente", () => {
  const invalidRelations = structuredClone(relations);
  invalidRelations[0].target = "termo-inexistente";

  assert.throws(
    () => validateKnowledgeBase(terms, invalidRelations),
    /aponta para um termo inexistente/,
  );
});

test("rejeita autorrelações", () => {
  const invalidRelations = structuredClone(relations);
  invalidRelations[0].target = invalidRelations[0].source;

  assert.throws(
    () => validateKnowledgeBase(terms, invalidRelations),
    /não pode ligar um termo a ele próprio/,
  );
});

test("rejeita IDs duplicados de relações", () => {
  const invalidRelations = [
    ...structuredClone(relations),
    structuredClone(relations[0]),
  ];

  assert.throws(
    () => validateKnowledgeBase(terms, invalidRelations),
    /ID duplicado em relações/,
  );
});

test("rejeita relações semanticamente duplicadas", () => {
  const duplicate = structuredClone(relations[0]);
  duplicate.id = "commit-git-duplicada";
  duplicate.source = relations[0].target;
  duplicate.target = relations[0].source;
  const invalidRelations = [...structuredClone(relations), duplicate];

  assert.throws(
    () => validateKnowledgeBase(terms, invalidRelations),
    /Relação duplicada/,
  );
});
