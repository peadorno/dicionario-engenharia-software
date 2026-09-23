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

test("orienta quando o index é aberto diretamente pelo protocolo file", () => {
  assert.match(html, /id="local-file-warning"/);
  assert.match(html, /window\.location\.protocol === "file:"/);
  assert.match(html, /python -m http\.server 8000/);
});

test("configura a busca como uma lista suspensa de sugestões", () => {
  assert.match(html, /class="search-section"/);
  assert.match(html, /class="details-panel"/);
  assert.match(html, /class="relations-panel"/);
  assert.match(html, /role="combobox"/);
  assert.match(html, /aria-autocomplete="list"/);
  assert.match(html, /aria-controls="search-suggestions"/);
  assert.match(html, /id="search-suggestions"[^>]*hidden/);
  assert.match(html, /id="search-results" role="listbox"/);
  assert.match(html, /aria-label="Pesquisar conceitos"/);
  assert.doesNotMatch(html, />Buscar termo</);
  assert.doesNotMatch(html, />\s*O que você quer consultar\?/);
  assert.doesNotMatch(
    html,
    /Os termos cadastrados aparecem enquanto você digita/,
  );
});

test("mantém o menu principal intencionalmente simples", () => {
  assert.match(html, /class="site-brand"[\s\S]*?assets\/favicon\.svg/);
  assert.match(html, /href="#sobre">Sobre<\/a>/);
  assert.match(html, /id="theme-toggle"/);
  assert.match(html, /src="\.\/src\/theme\.js"/);
});

test("documenta objetivo, arquitetura, busca e qualidade na seção Sobre", () => {
  assert.match(html, /id="sobre" class="site-footer"/);
  assert.match(html, /id="about-architecture-heading"/);
  assert.match(html, /id="about-search-heading"/);
  assert.match(html, /id="about-quality-heading"/);
  assert.match(html, /id="about-term-count"/);
  assert.match(html, /id="about-curated-count"/);
  assert.match(html, /id="about-relation-count"/);
  assert.match(html, /HTML semântico/);
  assert.match(html, /GitHub Pages/);
});

test("anuncia atualizações dinâmicas relevantes", () => {
  assert.match(html, /id="app-status" role="status" aria-live="polite"/);
  assert.match(html, /id="results-summary" aria-live="polite"/);
  assert.match(
    html,
    /id="related-relation-output"[\s\S]*?role="status"[\s\S]*?aria-live="polite"/,
  );
  assert.match(
    html,
    /id="relations-output" role="status" aria-live="polite"/,
  );
});
