import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  findRelatedTerms,
  findRelationsBetween,
} from "../src/relations.js";

const termsUrl = new URL("../data/terms.json", import.meta.url);
const relationsUrl = new URL("../data/relations.json", import.meta.url);
const terms = JSON.parse(await readFile(termsUrl, "utf8"));
const relations = JSON.parse(await readFile(relationsUrl, "utf8"));

test("descobre relações de entrada e saída e ordena os termos", () => {
  const related = findRelatedTerms("deploy", terms, relations);
  const names = related.map(({ term }) => term.term);

  assert.deepEqual(names, [
    "CD",
    "CI",
    "Feature Flag",
    "Produção",
    "Rollback",
    "Staging",
  ]);
});

test("ignora referências a termos inexistentes e elimina relações duplicadas", () => {
  const baseRelation = relations.find((relation) => relation.id === "ci-deploy");
  const invalidRelation = {
    id: "deploy-inexistente",
    source: "deploy",
    target: "inexistente",
    type: "unknown",
    explanation: "Esta relação deve ser ignorada.",
  };
  const related = findRelatedTerms("deploy", terms, [
    baseRelation,
    baseRelation,
    invalidRelation,
  ]);

  assert.equal(related.length, 1);
  assert.equal(related[0].term.id, "ci");
  assert.equal(related[0].relations.length, 1);
});

test("encontra e ordena relações diretas entre os termos selecionados", () => {
  const result = findRelationsBetween(["ci", "deploy", "rollback"], relations);

  assert.deepEqual(
    result.relations.map((relation) => relation.id),
    ["ci-deploy", "deploy-rollback"],
  );
  assert.deepEqual(result.disconnectedTermIds, []);
});

test("elimina relações duplicadas e IDs de seleção repetidos", () => {
  const relation = relations.find((item) => item.id === "ci-deploy");
  const result = findRelationsBetween(
    ["ci", "deploy", "ci"],
    [relation, relation],
  );

  assert.deepEqual(result.relations.map((item) => item.id), ["ci-deploy"]);
  assert.deepEqual(result.disconnectedTermIds, []);
});

test("identifica termos selecionados sem relação direta", () => {
  const result = findRelationsBetween(["ci", "deploy", "git"], relations);

  assert.deepEqual(result.relations.map((relation) => relation.id), ["ci-deploy"]);
  assert.deepEqual(result.disconnectedTermIds, ["git"]);
});
