# Checklist de testes manuais

Use esta lista antes de publicar uma nova versão. Execute a aplicação por um servidor local e confira os itens em um navegador.

## Busca e conteúdo

- [ ] A página informa que 12 termos foram carregados.
- [ ] Uma busca sem acentos encontra o mesmo resultado que a palavra acentuada.
- [ ] Uma busca inexistente apresenta uma mensagem clara.
- [ ] Limpar a busca restaura todos os termos em ordem alfabética.
- [ ] Selecionar um resultado apresenta categoria, aliases, definição, explicação e exemplo.

## Relações

- [ ] Os termos relacionados abrem seus respectivos detalhes.
- [ ] É possível selecionar e remover conceitos da relação.
- [ ] O botão **Relacionar termos** permanece desabilitado com menos de dois conceitos.
- [ ] Selecionar CI, Deploy e Rollback apresenta duas explicações diretas.
- [ ] Um conceito desconectado é identificado na resposta.
- [ ] Alterar a seleção limpa a explicação anterior.

## Acessibilidade e teclado

- [ ] A tecla `Tab` percorre controles e links em uma ordem lógica.
- [ ] Todos os controles interativos exibem foco visível.
- [ ] `Enter` ou `Espaço` ativa resultados, termos relacionados e botões.
- [ ] O link **Ir para o conteúdo principal** aparece ao receber foco e funciona.
- [ ] As mensagens de busca, carregamento e relações são anunciadas por leitor de tela.
- [ ] O conteúdo mantém contraste e legibilidade em todas as seções.

## Responsividade

- [ ] Em largura próxima de 320 px, não existe rolagem horizontal.
- [ ] Textos e botões não se sobrepõem em tela pequena.
- [ ] Em tela larga, busca, detalhes e relações permanecem visualmente organizados.
- [ ] O zoom de 200% não impede o uso das funcionalidades.

## Falhas e publicação

- [ ] Um JSON indisponível apresenta uma mensagem de erro compreensível.
- [ ] Não existem erros nem avisos inesperados no console do navegador.
- [ ] Todos os arquivos carregam corretamente na URL publicada pelo GitHub Pages.
- [ ] Os links da documentação funcionam no GitHub.
