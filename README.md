# Dicionário de Engenharia de Software e Tecnologia

Aplicação web estática para estudar e consultar conceitos técnicos, suas definições, exemplos e relações com outros conceitos.

> **Estado atual:** MVP funcional, licenciado e revisado localmente. Resta ativar e validar o GitHub Pages.

## Objetivo

Construir gradualmente uma base pessoal de conhecimento técnico que seja:

- simples de consultar;
- didática para quem está aprendendo;
- estruturada para evitar conteúdo duplicado na interface;
- adequada como projeto público de portfólio;
- fácil de manter e evoluir.

## Escopo do MVP

A primeira versão deverá oferecer:

- aproximadamente 12 termos iniciais;
- busca por nome, alias, categoria, definição e explicação;
- lista de resultados ordenada por relevância;
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
- busca fuzzy;
- favoritos, comentários ou analytics.

## Termos iniciais

- Git
- Commit
- Branch
- Merge
- Pull Request
- CI
- CD
- Deploy
- Staging
- Produção
- Rollback
- Feature Flag

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
│   └── terms.json
├── docs/
│   ├── architecture.md
│   └── manual-testing.md
├── src/
│   ├── app.js
│   ├── data-service.js
│   ├── relations.js
│   ├── search.js
│   └── ui.js
├── tests/
│   ├── data-service.test.js
│   ├── html.test.js
│   ├── relations.test.js
│   └── search.test.js
├── .gitignore
├── index.html
├── package.json
└── README.md
```

Os dados iniciais já estão disponíveis em:

- [`data/terms.json`](data/terms.json): definições e exemplos dos termos;
- [`data/relations.json`](data/relations.json): conexões e explicações entre conceitos.

## Arquitetura

As decisões iniciais de arquitetura, modelo de dados, busca, relações e testes estão descritas em [`docs/architecture.md`](docs/architecture.md).

## Executar localmente

Como a aplicação usa módulos JavaScript e carrega arquivos JSON, execute-a por um servidor HTTP local. Na pasta do projeto:

```powershell
python -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

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
- [ ] Ativar e validar a publicação no GitHub Pages.

## Publicação

O projeto está preparado para ser publicado diretamente da raiz da branch `main`, sem etapa de build. Depois que o GitHub Pages for ativado, a URL esperada será:

`https://peadorno.github.io/dicionario-engenharia-software/`

A ativação será feita após o envio desta preparação final para o repositório.

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
