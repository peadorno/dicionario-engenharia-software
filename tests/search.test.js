import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { normalizeText, searchTerms } from "../src/search.js";

const termsUrl = new URL("../data/terms.json", import.meta.url);
const terms = JSON.parse(await readFile(termsUrl, "utf8"));

test("normaliza acentos, maiúsculas e espaços repetidos", () => {
  assert.equal(normalizeText("  Integração   CONTÍNUA  "), "integracao continua");
});

test("ordena todos os termos alfabeticamente quando a consulta está vazia", () => {
  const results = searchTerms(terms, "   ");
  const names = results.map((term) => term.term);
  const sortedNames = [...names].sort((first, second) =>
    first.localeCompare(second, "pt-BR"),
  );

  assert.deepEqual(names, sortedNames);
});

test("encontra termos por nome, alias, categoria, definição e explicação", () => {
  assert.equal(searchTerms(terms, "rollback")[0].id, "rollback");
  assert.equal(searchTerms(terms, "integração contínua")[0].id, "ci");
  assert.ok(searchTerms(terms, "devops").every((term) => term.category === "DevOps"));
  assert.equal(searchTerms(terms, "sistema distribuído")[0].id, "git");
  assert.equal(searchTerms(terms, "observável e reversível")[0].id, "deploy");
});

test("prioriza o nome exato em relação a ocorrências menos relevantes", () => {
  const results = searchTerms(terms, "produção");

  assert.equal(results[0].id, "producao");
});

test("retorna uma lista vazia quando nada corresponde à consulta", () => {
  assert.deepEqual(searchTerms(terms, "conceito inexistente"), []);
});
