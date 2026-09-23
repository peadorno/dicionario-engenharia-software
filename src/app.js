import { loadKnowledgeBase } from "./data-service.js";
import { findRelatedTerms } from "./relations.js";
import { searchTerms } from "./search.js";
import {
  clearSearchInput,
  enableSearch,
  renderTermDetails,
  renderTermList,
  renderRelatedTerms,
  setErrorState,
  setLoadingState,
  setReadyState,
} from "./ui.js";

const state = {
  terms: [],
  relations: [],
  query: "",
  selectedTermId: null,
};

function renderCurrentResults() {
  const results = searchTerms(state.terms, state.query);
  renderTermList(results, state.selectedTermId, selectTerm, state.query.trim());
}

function selectTerm(termId) {
  const term = state.terms.find((item) => item.id === termId);

  if (!term) {
    return;
  }

  state.selectedTermId = termId;
  renderCurrentResults();
  renderTermDetails(term);
  renderRelatedTerms(
    findRelatedTerms(termId, state.terms, state.relations),
    selectRelatedTerm,
  );
}

function updateSearch(query) {
  state.query = query;
  renderCurrentResults();
}

function selectRelatedTerm(termId) {
  state.query = "";
  clearSearchInput();
  selectTerm(termId);
}

async function initialize() {
  setLoadingState();

  try {
    const knowledgeBase = await loadKnowledgeBase();

    state.terms = knowledgeBase.terms;
    state.relations = knowledgeBase.relations;

    renderCurrentResults();
    enableSearch(updateSearch);
    setReadyState(state.terms.length);
  } catch (error) {
    console.error(error);
    setErrorState("Não foi possível carregar os conceitos. Tente atualizar a página.");
  }
}

initialize();
