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
                ├──> carregamento e validação ──> estado da aplicação
relations.json ─┘                                      │
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

## 4. Responsabilidades dos módulos

| Módulo | Responsabilidade |
|---|---|
| `app.js` | Inicializar a aplicação, manter o estado mínimo e coordenar os demais módulos |
| `data-service.js` | Carregar JSON, validar campos, IDs e referências |
| `search.js` | Normalizar consultas, calcular relevância e ordenar resultados |
| `relations.js` | Encontrar e ordenar relações entre os termos selecionados |
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

1. Carregar termos e relações.
2. Validar os dados e suas referências.
3. Preparar um índice de busca em memória.
4. Exibir os termos em ordem alfabética.
5. Filtrar e ordenar resultados conforme a pesquisa.
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

Prioridade dos resultados:

1. nome exatamente igual;
2. alias exatamente igual;
3. nome iniciado pela consulta;
4. alias iniciado pela consulta;
5. ocorrência no nome ou alias;
6. ocorrência na categoria;
7. ocorrência na definição ou explicação.

A ordenação usa a correspondência mais forte encontrada para cada termo. Pontos de campos diferentes não são somados, evitando que várias coincidências fracas superem um nome ou alias mais preciso.

Uma consulta vazia mostrará todos os termos em ordem alfabética. Busca fuzzy e bibliotecas externas não fazem parte do MVP.

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
