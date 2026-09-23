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

export function findRelationsBetween(selectedTermIds, relations) {
  const uniqueTermIds = [...new Set(selectedTermIds)];
  const selectedIds = new Set(uniqueTermIds);
  const selectedOrder = new Map(uniqueTermIds.map((id, index) => [id, index]));
  const relationKeys = new Set();
  const matchedRelations = [];

  for (const relation of relations) {
    if (!selectedIds.has(relation.source) || !selectedIds.has(relation.target)) {
      continue;
    }

    const relationKey = `${relation.source}|${relation.target}|${relation.type}`;

    if (relationKeys.has(relationKey)) {
      continue;
    }

    relationKeys.add(relationKey);
    matchedRelations.push(relation);
  }

  matchedRelations.sort((first, second) => {
    const firstStart = Math.min(
      selectedOrder.get(first.source),
      selectedOrder.get(first.target),
    );
    const secondStart = Math.min(
      selectedOrder.get(second.source),
      selectedOrder.get(second.target),
    );
    const firstEnd = Math.max(
      selectedOrder.get(first.source),
      selectedOrder.get(first.target),
    );
    const secondEnd = Math.max(
      selectedOrder.get(second.source),
      selectedOrder.get(second.target),
    );

    return firstStart - secondStart || firstEnd - secondEnd || first.id.localeCompare(second.id);
  });

  const connectedIds = new Set(
    matchedRelations.flatMap((relation) => [relation.source, relation.target]),
  );

  return {
    relations: matchedRelations,
    disconnectedTermIds: uniqueTermIds.filter((id) => !connectedIds.has(id)),
  };
}
