const STOP_WORDS = new Set([
  "a", "as", "com", "como", "da", "das", "de", "do", "dos", "e", "em",
  "o", "os", "para", "por", "que", "um", "uma", "conceito", "termo",
]);

const SEMANTIC_CONCEPTS = [
  {
    cues: ["hospedar site", "publicar site", "site estatico"],
    terms: ["github pages", "hospedagem estatica", "deploy"],
  },
  {
    cues: ["proteger branch", "evitar push direto", "exigir revisao"],
    terms: ["branch protegida", "pull request", "codeowners"],
  },
  {
    cues: ["enviar commits", "sincronizar com remoto"],
    terms: ["push", "remote", "origin"],
  },
  {
    cues: ["baixar mudancas", "atualizar repositorio local"],
    terms: ["pull", "fetch", "remote"],
  },
  {
    cues: ["preparar commit", "selecionar mudancas"],
    terms: ["staging area", "git add", "commit"],
  },
  {
    cues: ["publicar", "publicacao", "colocar no ar", "entregar software"],
    terms: ["deploy", "implantacao", "producao", "staging", "release", "cd"],
  },
  {
    cues: ["desfazer", "reverter", "voltar versao", "falha em producao"],
    terms: ["rollback", "reversao", "deploy", "producao"],
  },
  {
    cues: ["historico de codigo", "controlar versoes", "colaborar no codigo"],
    terms: ["git", "commit", "branch", "merge", "pull request", "versionamento"],
  },
  {
    cues: ["garantir qualidade", "verificar codigo", "evitar regressao"],
    terms: ["teste", "tdd", "code review", "qualidade", "integracao continua"],
  },
  {
    cues: ["integrar sistemas", "comunicar sistemas", "expor dados"],
    terms: ["api", "endpoint", "rest", "webhook", "integracao"],
  },
  {
    cues: ["responder perguntas", "consultar documentos", "usar conhecimento externo"],
    terms: ["rag", "grounding", "embedding", "banco vetorial", "recuperacao"],
  },
  {
    cues: ["entender linguagem", "processar texto", "linguagem humana"],
    terms: ["nlp", "llm", "transformer", "token", "linguagem natural"],
  },
  {
    cues: ["automatizar tarefa", "usar ferramentas", "executar acoes"],
    terms: ["agente", "function calling", "tool use", "automacao"],
  },
  {
    cues: ["quem pode acessar", "proteger acesso", "identificar usuario"],
    terms: ["autenticacao", "autorizacao", "controle de acesso", "seguranca"],
  },
  {
    cues: ["acompanhar sistema", "entender falha", "diagnosticar producao"],
    terms: ["observabilidade", "logs", "metricas", "traces", "monitoramento"],
  },
  {
    cues: ["acelerar resposta", "melhorar desempenho", "reduzir latencia"],
    terms: ["cache", "performance", "latencia", "otimizacao"],
  },
  {
    cues: ["empacotar aplicacao", "isolar aplicacao", "executar ambiente"],
    terms: ["container", "docker", "kubernetes", "virtualizacao"],
  },
  {
    cues: ["significado dos dados", "organizar metadados", "catalogar dados"],
    terms: ["metadado", "governanca", "catalogo", "taxonomia", "linhagem"],
  },
  {
    cues: ["ligar conceitos", "representar conhecimento", "modelo semantico"],
    terms: ["ontologia", "grafo de conhecimento", "rdf", "owl", "skos"],
  },
  {
    cues: ["processar video", "processar audio", "distribuir conteudo"],
    terms: ["codec", "encoding", "transcoding", "streaming", "broadcast"],
  },
];

const FIELD_WEIGHTS = {
  term: 100,
  aliases: 90,
  category: 55,
  definition: 35,
  explanation: 22,
  example: 12,
};

const SEARCH_FIELDS_CACHE = new WeakMap();

export function normalizeText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}
function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function stemToken(token) {
  return token
    .replace(/(acoes|icoes)$/u, "cao")
    .replace(/(amentos|imentos)$/u, "")
    .replace(/mente$/u, "")
    .replace(/(ados|adas|idos|idas)$/u, "")
    .replace(/s$/u, "");
}

function editDistance(first, second) {
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index);

  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    const current = [firstIndex];

    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      const substitutionCost = first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1;
      current[secondIndex] = Math.min(
        current[secondIndex - 1] + 1,
        previous[secondIndex] + 1,
        previous[secondIndex - 1] + substitutionCost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[second.length];
}

function tokenSimilarity(queryToken, candidateToken) {
  if (queryToken === candidateToken) {
    return 1;
  }

  if (stemToken(queryToken) === stemToken(candidateToken)) {
    return 0.92;
  }

  if (
    Math.min(queryToken.length, candidateToken.length) >= 4 &&
    (queryToken.startsWith(candidateToken) || candidateToken.startsWith(queryToken))
  ) {
    return 0.78;
  }

  const shortestLength = Math.min(queryToken.length, candidateToken.length);

  if (shortestLength < 4 || Math.abs(queryToken.length - candidateToken.length) > 2) {
    return 0;
  }

  const distance = editDistance(queryToken, candidateToken);

  if (distance === 1) {
    return 0.7;
  }

  if (shortestLength >= 7 && distance === 2) {
    return 0.55;
  }

  return 0;
}

function getSearchFields(term) {
  const cachedFields = SEARCH_FIELDS_CACHE.get(term);

  if (cachedFields) {
    return cachedFields;
  }

  const fields = [
    { name: "term", values: [term.term] },
    { name: "aliases", values: term.aliases },
    { name: "category", values: [term.category] },
  ];

  if (term.status !== "catalogado") {
    fields.push(
      { name: "definition", values: [term.definition] },
      { name: "explanation", values: [term.explanation] },
      { name: "example", values: [term.example] },
    );
  }

  const indexedFields = fields.map((field) => ({
    ...field,
    normalizedValues: field.values.map(normalizeText),
    tokens: [...new Set(field.values.flatMap(tokenize))],
  }));

  SEARCH_FIELDS_CACHE.set(term, indexedFields);
  return indexedFields;
}

function scorePhrase(fields, query) {
  let bestScore = 0;

  for (const field of fields) {
    const weight = FIELD_WEIGHTS[field.name];

    for (const value of field.normalizedValues) {
      if (value === query) {
        bestScore = Math.max(bestScore, weight * 15);
      } else if (value.startsWith(query)) {
        bestScore = Math.max(bestScore, weight * 11);
      } else if (value.includes(query)) {
        bestScore = Math.max(bestScore, weight * 8);
      }
    }
  }

  return bestScore;
}

function scoreToken(fields, queryToken) {
  let bestScore = 0;

  for (const field of fields) {
    const weight = FIELD_WEIGHTS[field.name];

    for (const candidateToken of field.tokens) {
      bestScore = Math.max(
        bestScore,
        weight * tokenSimilarity(queryToken, candidateToken),
      );
    }
  }

  return bestScore;
}

function expandQuery(query, queryTokens) {
  const semanticTerms = new Set();

  for (const concept of SEMANTIC_CONCEPTS) {
    const matchesCue = concept.cues.some((cue) => {
      const normalizedCue = normalizeText(cue);
      const cueTokens = tokenize(cue);

      return (
        query.includes(normalizedCue) ||
        cueTokens.every((token) => queryTokens.includes(token))
      );
    });

    if (matchesCue) {
      concept.terms
        .map(normalizeText)
        .forEach((term) => semanticTerms.add(term));
    }
  }

  const semanticTokens = new Set([...semanticTerms].flatMap(tokenize));
  queryTokens.forEach((token) => semanticTokens.delete(token));

  return {
    terms: [...semanticTerms],
    tokens: [...semanticTokens],
  };
}

function calculateScore(term, query, queryTokens, semanticQuery) {
  const fields = getSearchFields(term);
  const phraseScore = scorePhrase(fields, query);
  const directScores = queryTokens.map((token) => scoreToken(fields, token));
  const matchedTokens = directScores.filter((score) => score > 0).length;
  const coverage = queryTokens.length === 0 ? 0 : matchedTokens / queryTokens.length;
  const directScore = directScores.reduce((total, score) => total + score, 0) * coverage;
  const semanticTokenScore = semanticQuery.tokens
    .map(
      (token, index) =>
        scoreToken(fields, token) * (index === 0 ? 0.55 : 0.28),
    )
    .filter((score) => score > 0)
    .sort((first, second) => second - first)
    .slice(0, 3)
    .reduce((total, score) => total + score, 0);
  const semanticPhraseScore = semanticQuery.terms
    .map(
      (semanticTerm, index) =>
        scorePhrase(fields, semanticTerm) * (index === 0 ? 0.3 : 0.12),
    )
    .sort((first, second) => second - first)
    .slice(0, 2)
    .reduce((total, score) => total + score, 0);

  return phraseScore + directScore + semanticTokenScore + semanticPhraseScore;
}

export function searchTerms(terms, rawQuery) {
  const query = normalizeText(rawQuery);

  if (query === "") {
    return [...terms].sort((first, second) =>
      first.term.localeCompare(second.term, "pt-BR"),
    );
  }

  const categoryMatches = terms.filter(
    (term) => normalizeText(term.category) === query,
  );

  if (categoryMatches.length > 0) {
    return categoryMatches.sort((first, second) =>
      first.term.localeCompare(second.term, "pt-BR"),
    );
  }

  const queryTokens = tokenize(query);
  const semanticQuery = expandQuery(query, queryTokens);

  return terms
    .map((term) => ({
      term,
      score: calculateScore(term, query, queryTokens, semanticQuery),
    }))
    .filter((result) => result.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.term.term.localeCompare(second.term.term, "pt-BR"),
    )
    .map((result) => result.term);
}
