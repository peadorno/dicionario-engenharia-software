import { loadKnowledgeBase } from "./data-service.js";
import { searchTerms } from "./search.js";
import {
  enableSearch,
  renderTermDetails,
  renderTermList,
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
}

function updateSearch(query) {
  state.query = query;
  renderCurrentResults();
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
