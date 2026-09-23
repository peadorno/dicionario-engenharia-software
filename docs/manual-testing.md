# Checklist de testes manuais

Use esta lista antes de publicar uma nova versão. Execute a aplicação por um servidor local e confira os itens em um navegador.

## Busca e conteúdo

- [ ] A página inicia sem exibir a lista de termos cadastrados.
- [ ] As sugestões aparecem em uma lista suspensa enquanto o texto é digitado.
- [ ] Uma busca sem acentos encontra o mesmo resultado que a palavra acentuada.
- [ ] Uma intenção como “publicar aplicação” sugere **Deploy**.
- [ ] Uma intenção como “desfazer versão com problema” sugere **Rollback**.
- [ ] Pequenos erros de digitação não impedem encontrar o conceito esperado.
- [ ] Uma busca inexistente apresenta uma mensagem clara.
- [ ] Limpar a busca fecha a lista de sugestões.
- [ ] As setas para cima e para baixo percorrem as sugestões e `Enter` seleciona o termo.
- [ ] Selecionar um resultado apresenta categoria, aliases, definição, explicação e exemplo.

## Relações

- [ ] Clicar em um termo relacionado exibe uma frase com os dois conceitos.
- [ ] A ação **Consultar** abre os detalhes do termo relacionado.
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
- [ ] A tecla `/`, quando o foco não está em um campo de texto, leva à busca.

## Tema

- [ ] O controle no menu alterna entre os temas claro e escuro.
- [ ] A escolha permanece depois de atualizar a página.
- [ ] A cor da barra do navegador acompanha o tema selecionado.
- [ ] Os dois temas mantêm contraste, foco visível e legibilidade.

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
