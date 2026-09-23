import { loadKnowledgeBase } from "./data-service.js";
import { findRelatedTerms, findRelationsBetween } from "./relations.js";
import { searchTerms } from "./search.js";
import {
  clearSearchInput,
  clearRelationsOutput,
  enableSearch,
  enableRelationControls,
  renderTermDetails,
  renderTermList,
  renderRelatedTerms,
  renderRelatedRelation,
  renderRelationsOutput,
  renderSelectedTerms,
  renderSelectionToggle,
  setErrorState,
  setLoadingState,
  setReadyState,
  setSearchInputValue,
} from "./ui.js";

const state = {
  terms: [],
  relations: [],
  query: "",
  selectedTermId: null,
  selectedRelationTermIds: new Set(),
};

function renderCurrentResults() {
  const query = state.query.trim();
  const results = query ? searchTerms(state.terms, query).slice(0, 6) : [];
  renderTermList(results, state.selectedTermId, selectTerm, state.query.trim());
}

function selectTerm(termId) {
  const term = state.terms.find((item) => item.id === termId);

  if (!term) {
    return;
  }

  state.selectedTermId = termId;
  state.query = "";
  setSearchInputValue(term.term);
  renderCurrentResults();
  renderTermDetails(term);
  renderRelatedTerms(
    findRelatedTerms(termId, state.terms, state.relations),
    showRelatedRelation,
  );
  renderSelectionToggle(term, state.selectedRelationTermIds.has(termId));
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

function showRelatedRelation(related) {
  const currentTerm = state.terms.find((term) => term.id === state.selectedTermId);

  if (!currentTerm) {
    return;
  }

  renderRelatedRelation(currentTerm, related, selectRelatedTerm);
}

function getSelectedRelationTerms() {
  return [...state.selectedRelationTermIds]
    .map((id) => state.terms.find((term) => term.id === id))
    .filter(Boolean);
}

function renderRelationSelection() {
  renderSelectedTerms(getSelectedRelationTerms(), removeRelationTerm);
  clearRelationsOutput();

  const selectedTerm = state.terms.find((term) => term.id === state.selectedTermId);

  if (selectedTerm) {
    renderSelectionToggle(
      selectedTerm,
      state.selectedRelationTermIds.has(selectedTerm.id),
    );
  }
}

function toggleSelectedTerm() {
  if (!state.selectedTermId) {
    return;
  }

  if (state.selectedRelationTermIds.has(state.selectedTermId)) {
    state.selectedRelationTermIds.delete(state.selectedTermId);
  } else {
    state.selectedRelationTermIds.add(state.selectedTermId);
  }

  renderRelationSelection();
}

function removeRelationTerm(termId) {
  state.selectedRelationTermIds.delete(termId);
  renderRelationSelection();
}

function relateSelectedTerms() {
  if (state.selectedRelationTermIds.size < 2) {
    return;
  }

  const result = findRelationsBetween(
    [...state.selectedRelationTermIds],
    state.relations,
  );
  const termsById = new Map(state.terms.map((term) => [term.id, term]));

  renderRelationsOutput(result, termsById);
}

async function initialize() {
  setLoadingState();

  try {
    const knowledgeBase = await loadKnowledgeBase();

    state.terms = knowledgeBase.terms;
    state.relations = knowledgeBase.relations;

    renderCurrentResults();
    enableSearch(updateSearch);
    enableRelationControls(toggleSelectedTerm, relateSelectedTerms);
    renderRelationSelection();
    setReadyState(state.terms.length);
  } catch (error) {
    console.error(error);
    setErrorState("Não foi possível carregar os conceitos. Tente atualizar a página.");
  }
}

initialize();
