export function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
    .replace(/\s+/g, " ");
}

function scoreText(value, query, scores) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue === query) {
    return scores.exact;
  }

  if (normalizedValue.startsWith(query)) {
    return scores.prefix;
  }

  if (normalizedValue.includes(query)) {
    return scores.includes;
  }

  return 0;
}

function calculateScore(term, query) {
  const nameScore = scoreText(term.term, query, {
    exact: 120,
    prefix: 100,
    includes: 80,
  });

  const aliasScore = Math.max(
    0,
    ...term.aliases.map((alias) =>
      scoreText(alias, query, {
        exact: 110,
        prefix: 75,
        includes: 60,
      }),
    ),
  );

  const categoryScore = scoreText(term.category, query, {
    exact: 45,
    prefix: 40,
    includes: 35,
  });

  const definitionScore = normalizeText(term.definition).includes(query) ? 20 : 0;
  const explanationScore = normalizeText(term.explanation).includes(query) ? 10 : 0;

  return Math.max(
    nameScore,
    aliasScore,
    categoryScore,
    definitionScore,
    explanationScore,
  );
}

export function searchTerms(terms, rawQuery) {
  const query = normalizeText(rawQuery);

  if (query === "") {
    return [...terms].sort((first, second) =>
      first.term.localeCompare(second.term, "pt-BR"),
    );
  }

  return terms
    .map((term) => ({ term, score: calculateScore(term, query) }))
    .filter((result) => result.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.term.term.localeCompare(second.term.term, "pt-BR"),
    )
    .map((result) => result.term);
}
