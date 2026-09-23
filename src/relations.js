export function findRelatedTerms(termId, terms, relations) {
  const termsById = new Map(terms.map((term) => [term.id, term]));
  const relatedById = new Map();

  for (const relation of relations) {
    const isSource = relation.source === termId;
    const isTarget = relation.target === termId;

    if (!isSource && !isTarget) {
      continue;
    }

    const relatedId = isSource ? relation.target : relation.source;
    const relatedTerm = termsById.get(relatedId);

    if (!relatedTerm) {
      continue;
    }

    if (!relatedById.has(relatedId)) {
      relatedById.set(relatedId, {
        term: relatedTerm,
        relations: [],
      });
    }

    const relatedRelations = relatedById.get(relatedId).relations;
    const alreadyIncluded = relatedRelations.some(
      (item) =>
        item.source === relation.source &&
        item.target === relation.target &&
        item.type === relation.type,
    );

    if (!alreadyIncluded) {
      relatedRelations.push(relation);
    }
  }

  return [...relatedById.values()].sort((first, second) =>
    first.term.term.localeCompare(second.term.term, "pt-BR"),
  );
}
