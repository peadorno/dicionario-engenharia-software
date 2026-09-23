const elements = {
  appStatus: document.querySelector("#app-status"),
  emptyDetails: document.querySelector("#empty-details"),
  results: document.querySelector("#search-results"),
  resultsSummary: document.querySelector("#results-summary"),
  termAliases: document.querySelector("#term-aliases"),
  termCategory: document.querySelector("#term-category"),
  termDefinition: document.querySelector("#term-definition"),
  termDetails: document.querySelector("#term-details"),
  termExample: document.querySelector("#term-example"),
  termExplanation: document.querySelector("#term-explanation"),
  termName: document.querySelector("#term-name"),
};

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

export function renderTermList(terms, selectedTermId, onSelect) {
  const fragment = document.createDocumentFragment();

  for (const term of terms) {
    fragment.append(createResultButton(term, selectedTermId, onSelect));
  }

  elements.results.replaceChildren(fragment);
  elements.resultsSummary.textContent = `${terms.length} termos disponíveis.`;
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

export function setLoadingState() {
  elements.appStatus.dataset.state = "loading";
  elements.appStatus.textContent = "Carregando os conceitos…";
  elements.resultsSummary.textContent = "Carregando…";
}

export function setReadyState(termCount) {
  elements.appStatus.dataset.state = "ready";
  elements.appStatus.textContent = `${termCount} termos carregados. Selecione um conceito para começar.`;
}

export function setErrorState(message) {
  elements.appStatus.dataset.state = "error";
  elements.appStatus.textContent = message;
  elements.resultsSummary.textContent = "Não foi possível exibir os termos.";
}
