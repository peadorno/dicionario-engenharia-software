const DATA_URLS = {
  terms: new URL("../data/terms.json", import.meta.url),
  relations: new URL("../data/relations.json", import.meta.url),
};

const REQUIRED_TERM_FIELDS = [
  "id",
  "term",
  "category",
  "aliases",
  "definition",
  "explanation",
  "example",
];

const REQUIRED_RELATION_FIELDS = ["id", "source", "target", "type", "explanation"];
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function fetchJson(url, label) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Não foi possível carregar ${label} (${response.status}).`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`O arquivo de ${label} não contém JSON válido.`);
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`O arquivo de ${label} deve conter uma lista.`);
  }
}

function assertRequiredFields(item, fields, label) {
  for (const field of fields) {
    const value = item[field];
    const isEmptyString = typeof value === "string" && value.trim() === "";

    if (value === undefined || value === null || isEmptyString) {
      throw new Error(`${label} sem o campo obrigatório "${field}".`);
    }
  }
}

function assertUniqueIds(items, label) {
  const seenIds = new Set();

  for (const item of items) {
    if (seenIds.has(item.id)) {
      throw new Error(`ID duplicado em ${label}: "${item.id}".`);
    }

    seenIds.add(item.id);
  }
}

function assertValidId(id, label) {
  if (typeof id !== "string" || !ID_PATTERN.test(id)) {
    throw new Error(`${label} possui um ID inválido: "${id}".`);
  }
}

function assertStringFields(item, fields, label) {
  for (const field of fields) {
    if (typeof item[field] !== "string") {
      throw new Error(`${label} deve possuir texto no campo "${field}".`);
    }
  }
}

function validateTerms(terms) {
  assertArray(terms, "termos");

  for (const term of terms) {
    assertRequiredFields(term, REQUIRED_TERM_FIELDS, `Termo "${term.id ?? "desconhecido"}"`);
    assertStringFields(
      term,
      ["id", "term", "category", "definition", "explanation", "example"],
      `Termo "${term.id}"`,
    );
    assertValidId(term.id, `Termo "${term.term}"`);

    if (!Array.isArray(term.aliases)) {
      throw new Error(`Os aliases do termo "${term.id}" devem formar uma lista.`);
    }

    if (term.aliases.some((alias) => typeof alias !== "string" || alias.trim() === "")) {
      throw new Error(`Os aliases do termo "${term.id}" devem conter apenas textos.`);
    }
  }

  assertUniqueIds(terms, "termos");
}

function validateRelations(relations, termIds) {
  assertArray(relations, "relações");
  assertUniqueIds(relations, "relações");
  const relationKeys = new Set();

  for (const relation of relations) {
    assertRequiredFields(
      relation,
      REQUIRED_RELATION_FIELDS,
      `Relação "${relation.id ?? "desconhecida"}"`,
    );
    assertStringFields(
      relation,
      REQUIRED_RELATION_FIELDS,
      `Relação "${relation.id}"`,
    );
    assertValidId(relation.id, `Relação entre "${relation.source}" e "${relation.target}"`);

    if (!termIds.has(relation.source) || !termIds.has(relation.target)) {
      throw new Error(`A relação "${relation.id}" aponta para um termo inexistente.`);
    }

    if (relation.source === relation.target) {
      throw new Error(`A relação "${relation.id}" não pode ligar um termo a ele próprio.`);
    }

    const endpoints = [relation.source, relation.target].sort().join("|");
    const relationKey = `${endpoints}|${relation.type}`;

    if (relationKeys.has(relationKey)) {
      throw new Error(
        `Relação duplicada entre "${relation.source}" e "${relation.target}" do tipo "${relation.type}".`,
      );
    }

    relationKeys.add(relationKey);
  }

}

export function validateKnowledgeBase(terms, relations) {
  validateTerms(terms);

  const termIds = new Set(terms.map((term) => term.id));
  validateRelations(relations, termIds);
}

export async function loadKnowledgeBase() {
  const [terms, relations] = await Promise.all([
    fetchJson(DATA_URLS.terms, "os termos"),
    fetchJson(DATA_URLS.relations, "as relações"),
  ]);

  validateKnowledgeBase(terms, relations);

  return {
    terms: [...terms].sort((first, second) =>
      first.term.localeCompare(second.term, "pt-BR"),
    ),
    relations,
  };
}
