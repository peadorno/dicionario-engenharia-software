import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const htmlUrl = new URL("../index.html", import.meta.url);
const html = await readFile(htmlUrl, "utf8");

test("não possui IDs duplicados", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);

  assert.equal(new Set(ids).size, ids.length);
});

test("todas as referências ARIA apontam para IDs existentes", () => {
  const ids = new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
  );
  const referencedIds = [
    ...html.matchAll(/\saria-(?:controls|describedby|labelledby)="([^"]+)"/g),
  ].flatMap((match) => match[1].split(/\s+/));
  const missingIds = referencedIds.filter((id) => !ids.has(id));

  assert.deepEqual(missingIds, []);
});

test("todos os arquivos locais referenciados pelo HTML existem", async () => {
  const localPaths = [
    ...html.matchAll(/\s(?:href|src)="(\.\/[^"#?]+)[^\"]*"/g),
  ].map((match) => match[1]);

  await Promise.all(
    localPaths.map((path) => access(new URL(`../${path.slice(2)}`, import.meta.url))),
  );
});
