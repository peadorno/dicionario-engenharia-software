# Dicionário de Engenharia de Software e Tecnologia

Aplicação web estática para estudar e consultar conceitos técnicos, suas definições, exemplos e relações com outros conceitos.

> **Estado atual:** arquitetura e dados iniciais definidos. A interface responsiva já carrega e apresenta os termos. Busca e relacionamento múltiplo ainda não foram implementados.

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

## Estrutura planejada

```text
.
├── assets/
│   └── css/
│       └── styles.css
├── data/
│   ├── relations.json
│   └── terms.json
├── docs/
│   └── architecture.md
├── src/
│   ├── app.js
│   ├── data-service.js
│   ├── relations.js
│   ├── search.js
│   └── ui.js
├── tests/
│   ├── relations.test.js
│   └── search.test.js
├── .gitignore
├── index.html
├── package.json
└── README.md
```

Os diretórios e arquivos da aplicação serão adicionados somente quando suas respectivas etapas forem implementadas. A estrutura não será preenchida antecipadamente com arquivos vazios.

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

## Sequência de implementação

1. Preparar o repositório e documentar as decisões iniciais.
2. Definir os primeiros termos e relações em JSON.
3. Construir a estrutura semântica da interface.
4. Criar o estilo responsivo.
5. Carregar e apresentar os termos.
6. Implementar a busca.
7. Implementar a navegação entre termos relacionados.
8. Implementar a seleção e relação de múltiplos termos.
9. Adicionar testes automatizados e uma lista de testes manuais.
10. Revisar acessibilidade, documentação e publicação.

Cada etapa deverá resultar em uma mudança pequena, verificável e documentada.

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

Ainda não definida. A licença será escolhida antes da primeira publicação pública.
