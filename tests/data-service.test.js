import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { validateKnowledgeBase } from "../src/data-service.js";

const termsUrl = new URL("../data/terms.json", import.meta.url);
const relationsUrl = new URL("../data/relations.json", import.meta.url);
const terms = JSON.parse(await readFile(termsUrl, "utf8"));
const relations = JSON.parse(await readFile(relationsUrl, "utf8"));

test("aceita a base de conhecimento atual", () => {
  assert.doesNotThrow(() => validateKnowledgeBase(terms, relations));
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
