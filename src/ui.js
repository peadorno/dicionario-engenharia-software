const elements = {
  appStatus: document.querySelector("#app-status"),
  emptyDetails: document.querySelector("#empty-details"),
  relatedSection: document.querySelector("#related-section"),
  relatedTerms: document.querySelector("#related-terms"),
  relateButton: document.querySelector("#relate-button"),
  relationsForm: document.querySelector("#relations-form"),
  relationsOutput: document.querySelector("#relations-output"),
  results: document.querySelector("#search-results"),
  resultsSummary: document.querySelector("#results-summary"),
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#search-input"),
  selectedTerms: document.querySelector("#selected-terms"),
  selectionToggle: document.querySelector("#selection-toggle"),
  termAliases: document.querySelector("#term-aliases"),
  termCategory: document.querySelector("#term-category"),
  termDefinition: document.querySelector("#term-definition"),
  termDetails: document.querySelector("#term-details"),
  termExample: document.querySelector("#term-example"),
  termExplanation: document.querySelector("#term-explanation"),
  termName: document.querySelector("#term-name"),
};

function createSelectedTermItem(term, onRemove) {
  const item = document.createElement("li");
  const name = document.createElement("span");
  const removeButton = document.createElement("button");

  item.className = "selected-term";
  name.textContent = term.term;

  removeButton.type = "button";
  removeButton.textContent = "Remover";
  removeButton.setAttribute("aria-label", `Remover ${term.term} da seleção`);
  removeButton.addEventListener("click", () => onRemove(term.id));

  item.append(name, removeButton);
  return item;
}

function createRelatedTermButton(related, onSelect) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  const name = document.createElement("span");
  const explanation = document.createElement("span");

  button.type = "button";
  button.dataset.termId = related.term.id;
  button.addEventListener("click", () => onSelect(related.term.id));

  name.className = "related-term__name";
  name.textContent = related.term.term;

  explanation.className = "related-term__explanation";
  explanation.textContent = related.relations
    .map((relation) => relation.explanation)
    .join(" ");

  button.append(name, explanation);
  item.append(button);

  return item;
}

function createResultButton(term, selectedTermId, onSelect) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  const name = document.createElement("span");
  const category = document.createElement("span");
  const definition = document.createElement("span");

  button.type = "button";
  button.dataset.termId = term.id;
  button.setAttribute("aria-current", String(term.id === selectedTermId));
  button.addEventListener("click", () => onSelect(term.id));

  name.className = "term-result__name";
  name.textContent = term.term;

  category.className = "term-result__category";
  category.textContent = term.category;

  definition.className = "term-result__definition";
  definition.textContent = term.definition;

  button.append(name, category, definition);
  item.append(button);

  return item;
}

export function renderTermList(terms, selectedTermId, onSelect, query = "") {
  const fragment = document.createDocumentFragment();

  for (const term of terms) {
    fragment.append(createResultButton(term, selectedTermId, onSelect));
  }

  elements.results.replaceChildren(fragment);

  if (query === "") {
    elements.resultsSummary.textContent = `${terms.length} termos disponíveis.`;
  } else if (terms.length === 0) {
    elements.resultsSummary.textContent = `Nenhum termo encontrado para “${query}”.`;
  } else if (terms.length === 1) {
    elements.resultsSummary.textContent = `1 termo encontrado para “${query}”.`;
  } else {
    elements.resultsSummary.textContent = `${terms.length} termos encontrados para “${query}”.`;
  }
}

export function renderTermDetails(term) {
  elements.termCategory.textContent = term.category;
  elements.termName.textContent = term.term;
  elements.termDefinition.textContent = term.definition;
  elements.termExplanation.textContent = term.explanation;
  elements.termExample.textContent = term.example;

  if (term.aliases.length > 0) {
    elements.termAliases.textContent = `Também conhecido como: ${term.aliases.join(", ")}.`;
    elements.termAliases.hidden = false;
  } else {
    elements.termAliases.textContent = "";
    elements.termAliases.hidden = true;
  }

  elements.emptyDetails.hidden = true;
  elements.termDetails.hidden = false;
  elements.termDetails.focus({ preventScroll: true });
}

export function renderRelatedTerms(relatedTerms, onSelect) {
  const fragment = document.createDocumentFragment();

  for (const related of relatedTerms) {
    fragment.append(createRelatedTermButton(related, onSelect));
  }

  elements.relatedTerms.replaceChildren(fragment);
  elements.relatedSection.hidden = relatedTerms.length === 0;
}

export function setLoadingState() {
  elements.appStatus.dataset.state = "loading";
  elements.appStatus.textContent = "Carregando os conceitos…";
  elements.resultsSummary.textContent = "Carregando…";
}

export function setReadyState(termCount) {
  elements.appStatus.dataset.state = "ready";
  elements.appStatus.textContent = `${termCount} termos carregados. Selecione um conceito para começar.`;
}

export function enableSearch(onSearch) {
  elements.searchInput.disabled = false;

  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  elements.searchInput.addEventListener("input", (event) => {
    onSearch(event.currentTarget.value);
  });
}

export function clearSearchInput() {
  elements.searchInput.value = "";
}

export function enableRelationControls(onToggle, onRelate) {
  elements.selectionToggle.addEventListener("click", onToggle);
  elements.relationsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    onRelate();
  });
}

export function renderSelectionToggle(term, isSelected) {
  elements.selectionToggle.hidden = false;
  elements.selectionToggle.setAttribute("aria-pressed", String(isSelected));
  elements.selectionToggle.textContent = isSelected
    ? `Remover ${term.term} da relação`
    : `Adicionar ${term.term} à relação`;
}

export function renderSelectedTerms(terms, onRemove) {
  const fragment = document.createDocumentFragment();

  for (const term of terms) {
    fragment.append(createSelectedTermItem(term, onRemove));
  }

  elements.selectedTerms.replaceChildren(fragment);
  elements.relateButton.disabled = terms.length < 2;
}

export function clearRelationsOutput() {
  elements.relationsOutput.replaceChildren();
  elements.relationsOutput.hidden = true;
}

export function renderRelationsOutput(result, termsById) {
  const heading = document.createElement("h3");
  const explanation = document.createElement("p");

  heading.textContent = "Como estes termos se relacionam";

  if (result.relations.length > 0) {
    explanation.textContent = result.relations
      .map((relation) => relation.explanation)
      .join(" ");
  } else {
    explanation.textContent =
      "Não há uma relação direta cadastrada entre os termos selecionados.";
  }

  elements.relationsOutput.replaceChildren(heading, explanation);

  if (result.disconnectedTermIds.length > 0 && result.relations.length > 0) {
    const disconnected = document.createElement("p");
    const names = result.disconnectedTermIds
      .map((id) => termsById.get(id)?.term)
      .filter(Boolean)
      .join(", ");

    disconnected.className = "relations-output__note";
    disconnected.textContent = `Sem ligação direta neste conjunto: ${names}.`;
    elements.relationsOutput.append(disconnected);
  }

  elements.relationsOutput.hidden = false;
}

export function setErrorState(message) {
  elements.appStatus.dataset.state = "error";
  elements.appStatus.textContent = message;
  elements.resultsSummary.textContent = "Não foi possível exibir os termos.";
}
