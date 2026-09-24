import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const terms = JSON.parse(
  await readFile(new URL("../data/terms.json", import.meta.url), "utf8"),
);

const PLACEHOLDER_PATTERNS = [
  /definição técnica em curadoria/i,
  /exemplo de uso ainda não disponível/i,
  /inserir definição/i,
  /a definir/i,
  /(?:^|\s)TODO(?:\s|:|$)/,
];

const REQUIRED_EXPANSIONS = new Map([
  ["api", ["Interface de Programação de Aplicações", "API"]],
  ["cd", ["Entrega Contínua", "Implantação Contínua", "CD"]],
  ["ci", ["Integração Contínua", "Continuous Integration", "CI"]],
  ["llm", ["Grande Modelo de Linguagem", "Large Language Model", "LLM"]],
  ["nlp", ["Processamento de Linguagem Natural", "Natural Language Processing", "NLP"]],
  ["rag", ["Geração Aumentada por Recuperação", "Retrieval-Augmented Generation", "RAG"]],
  ["rest", ["Transferência de Estado Representacional", "REST"]],
  ["sql", ["Linguagem de Consulta Estruturada", "Structured Query Language", "SQL"]],
  ["tdd", ["Desenvolvimento Orientado por Testes", "Test-Driven Development", "TDD"]],
]);

function countWords(value) {
  return value.trim().split(/\s+/).length;
}

test("mantém cada verbete completo em três camadas didáticas", () => {
  for (const term of terms) {
    assert.ok(
      countWords(term.definition) >= 8 && countWords(term.definition) <= 30,
      `${term.term}: a definição deve ser curta e autossuficiente`,
    );
    assert.ok(
      countWords(term.explanation) >= 15 && countWords(term.explanation) <= 70,
      `${term.term}: a explicação deve acrescentar contexto técnico`,
    );
    assert.ok(
      countWords(term.example) >= 7 && countWords(term.example) <= 35,
      `${term.term}: o exemplo deve ser concreto e conciso`,
    );
  }
});

test("não permite texto provisório nos verbetes completos", () => {
  for (const term of terms) {
    const content = `${term.definition} ${term.explanation} ${term.example}`;

    for (const pattern of PLACEHOLDER_PATTERNS) {
      assert.doesNotMatch(content, pattern, `${term.term}: conteúdo provisório`);
    }
  }
});

test("expande siglas essenciais na própria definição", () => {
  const termsById = new Map(terms.map((term) => [term.id, term]));

  for (const [termId, expectedExpressions] of REQUIRED_EXPANSIONS) {
    const definition = termsById.get(termId)?.definition ?? "";

    for (const expression of expectedExpressions) {
      assert.match(
        definition,
        new RegExp(expression, "i"),
        `${termId}: falta explicar “${expression}”`,
      );
    }
  }
});

test("mantém exemplos como frases completas", () => {
  for (const term of terms) {
    assert.match(term.example, /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ.]/u, `${term.term}: início inválido`);
    assert.match(term.example, /[.!?]$/u, `${term.term}: falta pontuação final`);
  }
});
