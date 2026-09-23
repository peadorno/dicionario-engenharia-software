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

function validateTerms(terms) {
  assertArray(terms, "termos");

  for (const term of terms) {
    assertRequiredFields(term, REQUIRED_TERM_FIELDS, `Termo "${term.id ?? "desconhecido"}"`);

    if (!Array.isArray(term.aliases)) {
      throw new Error(`Os aliases do termo "${term.id}" devem formar uma lista.`);
    }
  }

  assertUniqueIds(terms, "termos");
}

function validateRelations(relations, termIds) {
  assertArray(relations, "relações");

  for (const relation of relations) {
    assertRequiredFields(
      relation,
      REQUIRED_RELATION_FIELDS,
      `Relação "${relation.id ?? "desconhecida"}"`,
    );

    if (!termIds.has(relation.source) || !termIds.has(relation.target)) {
      throw new Error(`A relação "${relation.id}" aponta para um termo inexistente.`);
    }

    if (relation.source === relation.target) {
      throw new Error(`A relação "${relation.id}" não pode ligar um termo a ele próprio.`);
    }
  }

  assertUniqueIds(relations, "relações");
}

export async function loadKnowledgeBase() {
  const [terms, relations] = await Promise.all([
    fetchJson(DATA_URLS.terms, "os termos"),
    fetchJson(DATA_URLS.relations, "as relações"),
  ]);

  validateTerms(terms);

  const termIds = new Set(terms.map((term) => term.id));
  validateRelations(relations, termIds);

  return {
    terms: [...terms].sort((first, second) =>
      first.term.localeCompare(second.term, "pt-BR"),
    ),
    relations,
  };
}
