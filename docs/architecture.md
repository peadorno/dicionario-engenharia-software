# Arquitetura inicial

## 1. Contexto

O projeto é um dicionário técnico voltado para estudo e consulta rápida. Além de apresentar conceitos isolados, deverá mostrar como eles participam do mesmo fluxo, processo ou arquitetura.

A primeira versão precisa funcionar como site estático e não deve depender de framework, backend, banco de dados ou serviço de inteligência artificial.

## 2. Decisão arquitetural

A aplicação será uma página estática composta por:

- HTML semântico como estrutura;
- CSS responsável pela apresentação responsiva;
- módulos JavaScript responsáveis por estado, busca, relações e renderização;
- arquivos JSON responsáveis pelo conteúdo;
- funções puras para as regras que serão testadas automaticamente.

```text
terms.json ─────┐
relations.json ─┼──> carregamento e validação ──> estado da aplicação
catalog.json ───┘                                      │
                                                       ├──> busca
                                                       ├──> termo selecionado
                                                       └──> relação entre termos
```

Essa solução atende ao MVP e mantém um caminho simples para uma futura visualização em grafo: os termos já serão nós e as relações já serão conexões explícitas.

## 3. Modelo de dados

### 3.1 Termos

Cada termo terá o seguinte formato conceitual:

```json
{
  "id": "deploy",
  "term": "Deploy",
  "category": "DevOps",
  "aliases": ["implantação"],
  "definition": "Definição curta e objetiva.",
  "explanation": "Explicação didática mais detalhada.",
  "example": "Exemplo do conceito usado em uma frase."
}
```

Regras:

- `id` será único, estável, minúsculo e sem acentos;
- `term`, `category`, `definition`, `explanation` e `example` serão obrigatórios;
- `aliases` será sempre uma lista, mesmo quando vazia;
- texto preparado para busca não será armazenado, mas calculado ao carregar os dados;
- categorias permanecerão como texto no MVP.

### 3.2 Relações

Cada relação terá o seguinte formato conceitual:

```json
{
  "id": "ci-deploy",
  "source": "ci",
  "target": "deploy",
  "type": "precedes",
  "explanation": "O CI executa verificações automatizadas antes do deploy."
}
```

Regras:

- `id` será único;
- `source` e `target` deverão apontar para termos existentes;
- relações não poderão ligar um termo a ele próprio;
- duplicatas entre os mesmos termos e tipo serão rejeitadas;
- `explanation` conterá uma frase didática pronta para apresentação.

Os termos relacionados serão derivados desse arquivo. Não haverá um segundo cadastro de `relatedTerms` dentro dos termos.

### 3.3 Catálogo para curadoria

Termos identificados em fontes externas ou em bases de trabalho ficam em
`catalog.json` até receberem definição, explicação, exemplo e relações revisadas.
Eles participam da busca, mas aparecem com o estado “Em curadoria” e não são
apresentados como verbetes completos.

```json
{
  "id": "catalogo-governanca-de-metadados",
  "term": "Governança de Metadados",
  "category": "Governança de dados e metadados",
  "aliases": [],
  "status": "catalogado",
  "source": "Base profissional de governança de metadados, mídia e TI"
}
```

Essa separação evita definições genéricas, preserva a procedência e permite que
a curadoria avance por lotes sem reduzir a confiabilidade dos 112 verbetes já
concluídos. Nomes marcados como internos não entram no repositório público.

## 4. Responsabilidades dos módulos

| Módulo | Responsabilidade |
|---|---|
| `app.js` | Inicializar a aplicação, manter o estado mínimo e coordenar os demais módulos |
| `data-service.js` | Carregar termos, catálogo e relações; validar campos, IDs e referências |
| `search.js` | Normalizar, expandir e ranquear consultas híbridas |
| `relations.js` | Encontrar e ordenar relações entre os termos selecionados |
| `theme.js` | Resolver, aplicar e persistir a preferência de tema |
| `ui.js` | Registrar eventos e renderizar estados da interface no DOM |

As regras de busca e relacionamento não acessarão diretamente o DOM. Isso permite testá-las sem navegador e evita misturar lógica com apresentação.

## 5. Estado da aplicação

O estado permanecerá em memória e conterá somente:

- termos e relações carregados;
- texto atual da pesquisa;
- ID do termo exibido;
- IDs selecionados para relacionamento;
- estado de carregamento ou erro.

Não será criada uma biblioteca própria de gerenciamento de estado.

## 6. Fluxo principal

1. Carregar termos, catálogo e relações.
2. Validar os dados e suas referências.
3. Manter as sugestões fechadas até que exista uma consulta.
4. Preparar e reutilizar o índice de busca em memória.
5. Expandir, filtrar e ordenar resultados conforme a pesquisa.
6. Abrir os detalhes do termo selecionado.
7. Derivar seus termos relacionados das conexões cadastradas.
8. Permitir a seleção de dois ou mais termos.
9. Filtrar relações cujas duas extremidades estejam selecionadas.
10. Exibir as explicações encontradas ou informar que a relação não está cadastrada.

## 7. Estratégia de busca

Antes da comparação, textos serão:

- convertidos para minúsculas;
- normalizados para remover acentos;
- tratados para remover espaços excedentes.

A busca combina quatro sinais:

1. correspondência de frase em nome, aliases, categoria e conteúdo;
2. pesos diferentes por campo, priorizando nome e aliases;
3. tolerância controlada a flexões e pequenos erros de digitação;
4. expansão semântica de intenções para conceitos relacionados.

Por exemplo, “publicar aplicação” expande a consulta para conceitos de entrega e
prioriza **Deploy**; “desfazer versão com problema” prioriza **Rollback**. A
expansão é um vocabulário local, explícito e testável. Ela não envia a consulta a
um serviço externo e não depende de um modelo de linguagem.

Os campos normalizados e seus tokens são armazenados em cache por objeto durante
a sessão. Verbetes em curadoria usam somente nome, aliases e categoria, evitando
que o texto padrão de curadoria contamine os resultados. Uma consulta vazia
mantém a ordenação alfabética.

## 8. Estratégia de relacionamento

Os termos selecionados formarão um subconjunto do grafo. O módulo de relações:

1. criará um conjunto com os IDs selecionados;
2. filtrará relações que tenham `source` e `target` nesse conjunto;
3. eliminará duplicatas;
4. aplicará uma ordem determinística;
5. devolverá as explicações cadastradas;
6. identificará termos desconectados.

As frases serão escritas no próprio cadastro da relação. Isso produz resultados previsíveis e didáticos sem exigir regras frágeis de geração de linguagem.

O MVP considerará apenas relações diretas. Cálculo de caminhos e geração automática de narrativas ficam para uma evolução futura.

## 9. Estratégia de testes

Será utilizado o test runner nativo do Node.js. Não será adotado framework de testes inicialmente.

Cobertura automatizada atual:

- normalização de texto;
- busca por cada campo suportado;
- ordenação por relevância;
- consultas vazias e sem resultados;
- validação de IDs únicos e campos obrigatórios;
- validação de referências das relações;
- descoberta e ordenação de relações;
- eliminação de duplicatas;
- detecção de termos desconectados;
- unicidade de IDs no HTML;
- referências ARIA e caminhos de arquivos locais no HTML.

Uma lista manual cobrirá:

- navegação por teclado;
- foco visível;
- contraste e legibilidade;
- comportamento responsivo;
- carregamento e mensagens de erro;
- funcionamento publicado no GitHub Pages.

Testes automatizados de DOM serão avaliados somente se a interface crescer a ponto de justificá-los.

## 10. Publicação

O projeto é publicado como site estático pelo GitHub Pages diretamente da raiz da branch `main`, sem workflow de build. O endereço público é `https://peadorno.github.io/dicionario-engenharia-software/`.

Antes de cada nova publicação relevante:

- executar todos os testes;
- revisar o diff e o histórico;
- confirmar a ausência de dados sensíveis;
- validar a aplicação em tela pequena e grande;
- verificar links e arquivos JSON;
- confirmar que a licença e a documentação continuam atualizadas.

## 11. Decisões adiadas

As seguintes decisões serão tomadas apenas quando houver necessidade concreta:

- visualização do knowledge graph;
- persistência de preferências;
- edição de conteúdo pela interface;
- suporte a mais idiomas;
- busca fuzzy;
- integração com LLM;
- backend e banco de dados;
- framework de interface;
- ferramenta de build.
