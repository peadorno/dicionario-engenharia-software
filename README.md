# Dicionário de Engenharia de Software e Tecnologia

Aplicação web estática para estudar e consultar conceitos técnicos, suas definições, exemplos e relações com outros conceitos.

> **Estado atual:** MVP funcional, licenciado, testado e publicado no GitHub Pages.

**Acesse o projeto:** [peadorno.github.io/dicionario-engenharia-software](https://peadorno.github.io/dicionario-engenharia-software/)

## Objetivo

Construir gradualmente uma base pessoal de conhecimento técnico que seja:

- simples de consultar;
- didática para quem está aprendendo;
- estruturada para evitar conteúdo duplicado na interface;
- adequada como projeto público de portfólio;
- fácil de manter e evoluir.

## Escopo do MVP

A versão atual oferece:

- 526 termos pesquisáveis, sendo 112 verbetes curados e 414 itens catalogados para curadoria;
- busca híbrida por texto, contexto, intenção e pequenas variações de escrita;
- lista suspensa de sugestões ordenadas por relevância durante a digitação;
- visualização de definição, explicação, exemplo e categoria;
- navegação entre termos relacionados;
- seleção de dois ou mais termos;
- explicações baseadas em relações cadastradas explicitamente;
- interface responsiva e acessível;
- estados de carregamento, erro e ausência de resultados;
- testes automatizados para busca, validação e relações;
- publicação como site estático no GitHub Pages.

Não fazem parte do MVP:

- backend ou banco de dados;
- autenticação;
- frameworks JavaScript;
- painel de edição;
- integração com LLM;
- visualização gráfica das relações;
- busca vetorial com embeddings;
- favoritos, comentários ou analytics.

## Cobertura atual

A base começou com 12 conceitos de Git e entrega de software e agora reúne 112
verbetes completos e conectados, além de 414 termos pesquisáveis em processo de
curadoria. Os principais grupos são:

- Git, GitHub, colaboração, segurança e entrega contínua;
- arquitetura e qualidade de software;
- testes automatizados;
- dados, web e segurança;
- containers, nuvem e infraestrutura;
- inteligência artificial, modelos de linguagem, agentes e RAG.
- governança de dados e metadados, semântica e ontologias;
- mídia, broadcast, audiovisual, publicidade e produto.

Os verbetes completos, com definições, aliases e exemplos, estão em
[`data/terms.json`](data/terms.json). Os itens ainda não definidos estão
separados em [`data/catalog.json`](data/catalog.json), identificados na interface
como “Em curadoria”. A procedência e o método de inclusão estão documentados em
[`docs/sources.md`](docs/sources.md).

## Tecnologias

- HTML5 semântico;
- CSS;
- JavaScript com módulos nativos;
- JSON para termos e relações;
- Node.js apenas para executar testes nativos, sem dependências de produção;
- Git e GitHub;
- GitHub Pages para publicação.

## Estrutura do projeto

```text
.
├── assets/
│   └── css/
│       └── styles.css
├── data/
│   ├── relations.json
│   ├── catalog.json
│   └── terms.json
├── docs/
│   ├── architecture.md
│   ├── manual-testing.md
│   ├── project-guide.md
│   └── sources.md
├── src/
│   ├── app.js
│   ├── data-service.js
│   ├── relations.js
│   ├── search.js
│   ├── theme.js
│   └── ui.js
├── tests/
│   ├── data-service.test.js
│   ├── html.test.js
│   ├── relations.test.js
│   ├── search.test.js
│   └── theme.test.js
├── .gitignore
├── index.html
├── package.json
└── README.md
```

Os dados iniciais já estão disponíveis em:

- [`data/terms.json`](data/terms.json): definições e exemplos dos termos;
- [`data/relations.json`](data/relations.json): conexões e explicações entre conceitos.
- [`data/catalog.json`](data/catalog.json): termos identificados e ainda em curadoria.

## Arquitetura

As decisões iniciais de arquitetura, modelo de dados, busca, relações e testes estão descritas em [`docs/architecture.md`](docs/architecture.md).

## Como apresentar e explicar o projeto

O guia [`docs/project-guide.md`](docs/project-guide.md) reúne:

- orientações para apresentar profissionalmente o perfil e o repositório;
- modelos de mensagem para compartilhar o site;
- roteiros de apresentação com diferentes durações;
- uma aula técnica detalhada sobre arquitetura, dados, busca, relações, interface, testes, Git e GitHub Pages;
- um glossário dos principais termos usados na implementação;
- um passo a passo para reconstruir o projeto do zero.

## Executar localmente

Como a aplicação usa módulos JavaScript e carrega arquivos JSON, execute-a por um servidor HTTP local. Na pasta do projeto:

```powershell
python -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

Não abra o arquivo `index.html` diretamente com duplo clique. Nesse caso o navegador usa o protocolo `file://` e bloqueia, por segurança, os módulos JavaScript e o carregamento dos arquivos JSON. A versão publicada e o servidor local não possuem essa limitação.

## Executar os testes

Os testes usam o executor nativo do Node.js e não exigem instalação de dependências. Com Node.js 20 ou superior, execute:

```powershell
npm test
```

Esse comando verifica a busca, as relações entre conceitos, a integridade dos arquivos JSON e referências estruturais do HTML. As verificações que dependem de interação visual estão registradas em [`docs/manual-testing.md`](docs/manual-testing.md).

## Progresso do MVP

- [x] Estruturar e documentar o projeto.
- [x] Cadastrar os termos e suas relações.
- [x] Implementar busca, detalhes e navegação entre conceitos.
- [x] Implementar a relação de múltiplos termos.
- [x] Adicionar testes automatizados e checklist manual.
- [x] Revisar acessibilidade e responsividade localmente.
- [x] Definir a licença do repositório.
- [x] Ativar e validar a publicação no GitHub Pages.

## Publicação

O projeto é publicado diretamente da raiz da branch `main`, sem etapa de build, em:

[https://peadorno.github.io/dicionario-engenharia-software/](https://peadorno.github.io/dicionario-engenharia-software/)

O GitHub Pages está configurado com HTTPS obrigatório. Novos commits enviados à `main` serão publicados automaticamente.

## Princípios do projeto

- simplicidade antes de abstração;
- responsabilidades claras;
- dados separados da apresentação;
- funções pequenas e nomes explícitos;
- ausência de dependências sem benefício concreto;
- acessibilidade e responsividade desde o início;
- documentação atualizada junto com o código;
- commits pequenos e descritivos;
- nenhuma credencial ou informação sensível no repositório.

## Segurança

Este projeto não deve conter tokens, senhas, chaves, credenciais, dados pessoais ou arquivos `.env` reais. Antes de cada commit, o diff deverá ser revisado.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [`LICENSE`](LICENSE) para conhecer os termos.
