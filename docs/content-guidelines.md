# Padrão editorial dos verbetes

Este documento define como escrever, revisar e aprovar o conteúdo do dicionário. O objetivo é atender leitores iniciantes sem perder a precisão necessária para leitores intermediários e avançados.

## 1. Princípio central

Cada verbete completo possui três camadas complementares:

1. **Definição direta:** responde o que é o conceito sem exigir contexto anterior.
2. **Como funciona:** explica finalidade, mecanismo, contexto e uma ressalva importante.
3. **Exemplo prático:** mostra o conceito em uma situação concreta.

A definição não precisa ensinar tudo. Ela deve permitir que alguém reconheça o conceito. A explicação acrescenta profundidade, e o exemplo transforma a abstração em uso observável.

## 2. Públicos atendidos

### Iniciante

Precisa entender a categoria geral, a finalidade do conceito e siglas ou palavras estrangeiras essenciais.

### Intermediário

Precisa saber onde o conceito aparece, com quais elementos se relaciona e quais problemas resolve.

### Avançado

Precisa encontrar precisão, limites, trade-offs e diferenças em relação a conceitos próximos.

O texto deve ser progressivo: começar concreto e acrescentar nuance. Não deve simplificar a ponto de ficar incorreto nem usar jargão como substituto de explicação.

## 3. Definição direta

### Requisitos

- Uma frase autossuficiente.
- Entre 8 e 30 palavras como referência editorial.
- Começar pela classe do conceito: processo, técnica, ferramenta, sistema, modelo, prática, ambiente ou estrutura.
- Explicar siglas na primeira ocorrência.
- Informar a finalidade ou característica que distingue o termo.
- Evitar exemplos, história e listas longas nessa camada.

### Exemplo

Fraco:

> API é uma API usada por sistemas.

Problemas: definição circular, sigla não explicada e ausência de finalidade.

Adequado:

> Interface de Programação de Aplicações (API) é um contrato que permite a comunicação entre sistemas por operações, formatos e regras definidos.

## 4. Como funciona

### Requisitos

- Entre 15 e 70 palavras como referência editorial.
- Explicar como ou por que o conceito é usado.
- Introduzir termos técnicos somente quando ajudam a compreensão.
- Acrescentar pelo menos uma nuance, condição, limitação ou trade-off quando relevante.
- Diferenciar conceitos que costumam ser confundidos.
- Não repetir a definição com outras palavras.

### Estrutura recomendada

1. Primeira frase: funcionamento ou contexto.
2. Segunda frase: benefício, limitação ou comparação.

Exemplo:

> Uma API expõe capacidades de um software sem exigir que o consumidor conheça sua implementação interna. Bons contratos são consistentes, documentados e versionados.

## 5. Exemplo prático

### Requisitos

- Frase completa, normalmente entre 7 e 35 palavras.
- Situação específica e plausível.
- Mostrar uma ação ou consequência observável.
- Evitar exemplos que apenas repitam o termo.
- Não introduzir mais dificuldade do que a explicação.

Exemplo:

> O aplicativo consulta uma API para obter a previsão do tempo.

## 6. Siglas, inglês e aliases

- Expandir a sigla na definição quando ela for o nome principal do verbete.
- Apresentar o nome em português e, quando útil, o original em inglês.
- Manter traduções, grafias alternativas e abreviações em `aliases` para melhorar a busca.
- Não traduzir nomes próprios de produtos.
- Quando uma palavra inglesa for amplamente usada, explicar sua função em português em vez de forçar uma tradução pouco natural.

Exemplo:

> Geração Aumentada por Recuperação (Retrieval-Augmented Generation, ou RAG) combina busca em fontes externas com a geração de respostas por um modelo.

## 7. Precisão e linguagem

### Preferir

- verbos concretos: armazena, valida, transforma, envia, compara;
- frases na voz ativa;
- nomes consistentes com a documentação oficial;
- ressalvas específicas;
- exemplos compatíveis com a definição.

### Evitar

- “é quando” sem indicar a classe do conceito;
- “tecnologia que faz coisas”;
- superlativos como “revolucionário”, “melhor” ou “perfeito”;
- afirmações absolutas sem condição;
- definir um termo usando o próprio termo;
- apresentar ferramenta e conceito como sinônimos;
- afirmar que uma sigla possui uma única expansão quando existem usos diferentes;
- misturar opinião, propaganda ou instrução operacional com definição.

## 8. Verbetes completos e catálogo

`terms.json` contém apenas verbetes completos e aprovados. Todos devem possuir definição, explicação e exemplo revisados.

`catalog.json` é uma fila de curadoria. Seus itens podem aparecer na busca para registrar cobertura, mas a interface os identifica como “Em curadoria”. Um item não deve ser promovido para `terms.json` apenas para aumentar a contagem.

Para promover um item:

1. consultar uma fonte primária ou documentação oficial quando existir;
2. confirmar o significado no contexto da categoria;
3. escrever as três camadas;
4. adicionar aliases úteis;
5. cadastrar pelo menos uma relação quando houver conexão relevante;
6. executar os testes;
7. revisar clareza, precisão e procedência.

Produtos, serviços, padrões recentes e termos ambíguos exigem verificação atualizada. Nesses casos, conhecimento lembrado não substitui pesquisa em fonte oficial.

## 9. Critérios automatizados

`tests/content-quality.test.js` verifica continuamente que:

- as três camadas existem e permanecem em faixas didáticas de tamanho;
- verbetes completos não contêm marcadores provisórios;
- siglas essenciais são expandidas na definição;
- exemplos começam e terminam como frases completas.

Esses testes detectam problemas estruturais, mas não conseguem provar que uma explicação está correta. Revisão editorial continua obrigatória.

## 10. Checklist de revisão

Antes de aprovar um verbete, responda:

- Uma pessoa iniciante entende que tipo de coisa o termo representa?
- Toda sigla essencial foi explicada?
- A definição funciona sem depender do exemplo?
- A explicação acrescenta mecanismo ou contexto?
- Existe uma limitação ou distinção importante que deveria aparecer?
- O exemplo é concreto e coerente?
- Um leitor avançado encontraria alguma imprecisão?
- O texto diferencia conceito, produto, ferramenta e implementação?
- A fonte é apropriada e atual?
- Os aliases realmente ajudam a busca?

Se alguma resposta for negativa, o verbete permanece em curadoria.

## 11. Regra de manutenção

Qualquer mudança de significado deve atualizar, no mesmo commit:

- o verbete;
- aliases afetados;
- relações correspondentes;
- testes relevantes;
- documentação, quando a decisão editorial mudar.

Clareza e precisão têm prioridade sobre quantidade. Um catálogo extenso mostra cobertura de pesquisa; somente um verbete revisado representa conhecimento publicado.
