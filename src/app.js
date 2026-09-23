import { loadKnowledgeBase } from "./data-service.js";
import {
  renderTermDetails,
  renderTermList,
  setErrorState,
  setLoadingState,
  setReadyState,
} from "./ui.js";

const state = {
  terms: [],
  relations: [],
  selectedTermId: null,
};

function selectTerm(termId) {
  const term = state.terms.find((item) => item.id === termId);

  if (!term) {
    return;
  }

  state.selectedTermId = termId;
  renderTermList(state.terms, state.selectedTermId, selectTerm);
  renderTermDetails(term);
}

async function initialize() {
  setLoadingState();

  try {
    const knowledgeBase = await loadKnowledgeBase();

    state.terms = knowledgeBase.terms;
    state.relations = knowledgeBase.relations;

    renderTermList(state.terms, state.selectedTermId, selectTerm);
    setReadyState(state.terms.length);
  } catch (error) {
    console.error(error);
    setErrorState("Não foi possível carregar os conceitos. Tente atualizar a página.");
  }
}

initialize();
