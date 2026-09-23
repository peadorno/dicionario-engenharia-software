import assert from "node:assert/strict";
import test from "node:test";

import { getNextTheme, resolveTheme } from "../src/theme.js";

test("respeita um tema salvo pelo usuário", () => {
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
});

test("usa a preferência do sistema quando não há tema salvo", () => {
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
});

test("alterna entre os temas claro e escuro", () => {
  assert.equal(getNextTheme("light"), "dark");
  assert.equal(getNextTheme("dark"), "light");
});
