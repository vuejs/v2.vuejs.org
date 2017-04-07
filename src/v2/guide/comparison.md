---
title: Comparação com Outros Frameworks
type: guide
order: 29
---

Esta é definitivamente a página mais difícil de ser escrita do guia, mas sentimos que é importante. É muito provável que você já teve problemas, tentou resolvê-los e já usou outra biblioteca para resolvê-los. Você está aqui pois quer saber se Vue pode resolver seus problemas específicos de uma forma melhor. É isto que esperamos lhe responder.

Nós também tentamos arduamente evitar arbitrariedade. Como parte da equipe responsável, obviamente gostamos muito do Vue. Há problemas que acreditamos que ele resolva melhor do que qualquer outra opção existente. Se não acreditássemos nisso, não estaríamos trabalhando nele. Entretanto, queremos ser justos e precisos. Nos esforçamos para listar também onde outras bibliotecas oferecem vantagens significativas, como o vasto ecossistema React de renderizadores alternativos ou o suporte retroativo do Knockout até IE6.

Nós também gostaríamos de **sua** ajuda para manter este documento atualizado, afinal o mundo JavaScript se move rápido! Se você perceber alguma inconsistência ou algo que não parece estar certo, por favor, nos mantenha a par [informando um problema](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React e Vue compartilham muitas similaridades. Ambos:

- utilizam a abordagem de DOM virtual
- provêm componentes visuais reativos e combináveis
- mantêm o foco na biblioteca principal, com preocupações como roteamento e gerenciamento de estado global tratadas por bibliotecas companheiras

Sendo tão similares em escopo, desprendemos mais tempo para refinar esta comparação em relação às outras. Queremos garantir não somente precisão técnica, mas também equilíbrio. Apontamos onde React supera Vue, por exemplo, na riqueza de seu ecossistema e na abundância de renderizadores personalizados.

A comunidade React [tem sido fundamental](https://github.com/vuejs/vuejs.org/issues/364) para nos ajudar a alcançar tal equilíbrio, com agradecimento especial a Dan Abramov da equipe React. Ele foi extremamente generoso com seu tempo e considerável experiência, nos ajudando a aperfeiçoar este documento até que ambos os lados [estivessem felizes](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740) com o resultado final.

Com isso dito, esperamos que você possa se sentir confiante na equidade da análise abaixo enquanto exploramos as diferenças entre estas duas bibliotecas.

### Desempenho

Em todos os cenários de mundo real que testamos até agora, Vue supera React por uma margem justa (normalmente entre 20% a 50% mais rápido, embora em alguns casos, muito mais do que isso). Neste momento poderíamos referenciar *benchmarks* - mas, francamente, todos eles são falhos de alguma forma, e poucos se lembram do que você escreveria em uma aplicação real. Em vez disso, vamos dividir a análise em partes.

#### Desempenho de Renderização

Ao renderizar uma interface, manipulação do DOM é normalmente a operação mais custosa e, infelizmente, nenhuma biblioteca pode fazer essas operações brutas mais rápido. O melhor que podemos fazer é:

1. Minimizar o número de mutações DOM necessárias. Tanto React quanto Vue usam abstrações de DOM Virtual para isto, ambos com implementações igualmente boas.
2. Adicionar a menor sobrecarga possível sobre essas manipulações do DOM. Já esta é uma área onde Vue e React diferem.

No React, digamos que a sobrecarga de renderizar um elemento é 1 e a sobrecarga de um componente mediano é 2. No Vue, a sobrecarga de um elemento seria mais para 0,1 enquanto a sobrecarga de um componente mediano seria 4, devido à configuração exigida para nosso sistema de reatividade.

Isto significa que em aplicações típicas, quando ouver mais elementos do que componentes sendo renderizados, Vue superará React por uma margem significativa. Em casos extremos, no entanto, tais como utilizar um componente para renderizar cada elemento, Vue será geralmente mais lento. Contudo, este não é o fim da história.

Tanto Vue quanto React também oferecem componentes funcionais, os quais não possuem estado e instância - e, portanto, geram menos sobrecarga. Quando estes são utilizados em situações de desempenho crítico, Vue é novamente mais rápido. Para demonstrar, construímos um [projeto para medição](https://github.com/chrisvfritz/vue-render-performance-comparisons) simples, que renderiza 10.000 itens de lista 100 vezes. Encorajamos você a experimentar por si próprio, já que os resultados irão variar dependendo do *hardware* e do navegador utilizado - de fato, eles vão variar até mesmo entre as execuções, devido à natureza dos motores JavaScript.

Porém, se você estiver se sentindo preguiçoso, abaixo estão os números da execução no Chrome 52 em um MacBook Air de 2014. Para evitar coincidências, ambos os *benchmarks* foram executados 20 vezes, com os resultados estatisticamente agrupados abaixo:

{% raw %}
<table class="benchmark-table">
  <thead>
    <tr>
      <th></th>
      <th>Vue</th>
      <th>React</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Mais rápido</th>
      <td>23ms</td>
      <td>63ms</td>
    </tr>
    <tr>
      <th>Mediana</th>
      <td>42ms</td>
      <td>81ms</td>
    </tr>
    <tr>
      <th>Média</th>
      <td>51ms</td>
      <td>94ms</td>
    </tr>
    <tr>
      <th>Percentil 95</th>
      <td>73ms</td>
      <td>164ms</td>
    </tr>
    <tr>
      <th>Mais lento</th>
      <td>343ms</td>
      <td>453ms</td>
    </tr>
  </tbody>
</table>
{% endraw %}

#### Desempenho de Atualização

No React, você precisa implementar `shouldComponentUpdate` em todo lugar e usar estruturas de dados imutáveis para obter reprocessamentos totalmente otimizados. No Vue, as dependências de um componente são automaticamente rastreadas a ele, de forma que só se atualize quando uma dessas dependências se modificar. A única otimização adicional que pode ser útil no Vue, às vezes, é adicionar um atributo `key` aos itens em listas longas.

Significa que atualizações não otimizadas no Vue serão muito mais rápidas do que React não otimizado. Na verdade, devido ao desempenho de renderização superior do Vue, mesmo React totalmente otimizado geralmente será mais lento que Vue sem otimizações manuais.

#### No Desenvolvimento

O desempenho em produção é a métrica mais importante, uma vez que está diretamente relacionada à experiência de uso do _framework_ por parte do usuário final. Todavia, desempenho durante o desenvolvimento ainda importa, uma vez que está relacionado à experiência de uso por parte do desenvolvedor.

Tanto Vue quanto React se mostram rápidos o suficiente no desenvolvimento da maioria das aplicações corriqueiras. No entanto, se o caso for prototipação de visualizações de dados de alto desempenho ou animações, chegamos a ver cenários com Vue entregando mais de 10 quadros por segundo, enquanto React entregava cerca de 1 quadro por segundo.

Isto ocorre devido às muitas checagens de invariantes pesadas do React, que o ajudam a fornecer vários avisos e mensagens de erro excelentes. Concordamos que estes também são importantes no Vue, mas temos tentado ficar de olho no desempenho enquanto implementamos tais verificações.

### HTML & CSS

No React, tudo é exclusivamente JavaScript, o que soa muito simples e elegante - até você se aprofundar mais. A triste realidade é que reinventar HTML e CSS dentro do JavaScript, enquanto até pode resolver alguns problemas do modelo tradicional, também pode causar muita dor. No Vue, abraçamos as tecnologias Web e construímos em cima delas. Para mostrar o que isso significa, mergulharemos em alguns exemplos.

#### JSX vs. Templates

No React, todos os componentes expressam sua interface com funções `render` usando JSX, uma sintaxe declarativa estilo XML, embutida dentro do JavaScript. Aqui está um exemplo, [conferido pela comunidade React](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684):

```js
render () {
  let { items } = this.props

  let children
  if (items.length > 0) {
    children = (
      <ul>
        {items.map(item =>
          <li key={item.id}>{item.name}</li>
        )}
      </ul>
    )
  } else {
    children = <p>Nenhum item encontrado.</p>
  }

  return (
    <div className='list-container'>
      {children}
    </div>
  )
}
```

A utilização de *render functions* com JSX oferece algumas vantagens:

- Você pode usar o poder de uma linguagem de programação completa (JavaScript) para construir sua camada visual.
- Ferramentas de suporte (como *linting*, checagem de tipos, *autocomplete* de código) para JSX estão um pouco mais avançadas do que está atualmente disponível com *templates* Vue.

No Vue, também temos [render functions](render-function.html) e até mesmo [suporte a JSX](render-function.html#JSX), afinal às vezes você precisa deste poder. Entretanto, elas não são recomendadas para a maioria dos componentes.

Em seu lugar, oferecemos *templates* como uma alternativa mais simples:

```html
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    <p v-else>Nenhum item encontrado.</p>
  </div>
</template>
```

Algumas vantagens neste caso:

- Bem menos decisões de implementação e estilização precisam ser feitas enquanto se escreve um *template*
- Um *template* sempre será declarativo
- Qualquer HTML válido também é válido em um *template*
- É legível como uma frase em inglês (exemplo: "para cada item em itens")
- Versões avançadas de JavaScript não são necessárias para melhorar a legibilidade

Não é apenas muito mais fácil para o desenvolvedor que está escrevendo, mas designers ou desenvolvedores menos experientes também se sentirão muito mais confortáveis analisando e contribuindo com o código.

Mas não termina aqui. Ao abraçar o HTML ao invés de tentar reinventá-lo com JavaScript, Vue também permite o uso de pré-processadores como Pug (anteriormente conhecido como Jade) em seus *templates*.

O ecossistema React também possui [um projeto](https://wix.github.io/react-templates/) que permite escrever *templates*, mas existem algumas desvantagens:

- Não é nem de perto tão rico em recursos quanto o sistema de *templates* Vue
- Requer separar seu HTML dos arquivos de seus componentes
- Por ser uma biblioteca de terceiros ao invés de oficialmente suportada, pode ou não ser mantida atualizada em relação à evolução do React no futuro.

#### CSS com Escopo por Componente

A menos que distribua componentes por vários arquivos (por exemplo, com [CSS Modules](https://github.com/gajus/react-css-modules)), CSS com escopo no React vem com ressalvas. CSS realmente básico funciona muito bem por padrão, mas recursos um pouco mais complexos, como  estados `:hover`, `@media`, e pseudo-seletores, requerem dependências pesadas para reinventar o que o CSS já faz - ou simplesmente não funcionam.

Por outro lado, Vue proporciona acesso completo ao CSS com [single-file components](single-file-components.html):

```html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

O atributo opcional `scoped` automaticamente cria escopo ao CSS de seu componente adicionando um atributo único (por exemplo, `data-v-1`) aos elementos e compilando `.list-container:hover` para algo como `.list-container[data-v-1]:hover`.

Finalmente, assim como no HTML, você também tem a opção de escrever seu CSS utilizando qualquer pré-processador (ou pós-processador) de sua preferência. Isto permite realizar operações centradas no design, como manipulação de cores durante o processo de *build*, ao invés de precisar importar bibliotecas JavaScript especializadas que aumentariam o tamanho de seu pacote compilado e a complexidade de sua aplicação.

### Escalabilidade

#### Ampliando a Escala

Para aplicações grandes, tanto Vue quanto React oferecem soluções de roteamento robustas. A comunidade React também tem sido muito inovadora em termos de soluções de gerenciamento de estado (com Flux/Redux). Esses padrões de gerenciamento de estado e até [o próprio Redux](https://github.com/egoist/revue) podem ser integrados facilmente em aplicações Vue. Na verdade, neste modelo, Vue até deu um passo adiante com o [Vuex](https://github.com/vuejs/vuex), uma solução de gerenciamento de estado ispirada em Elm, que se integra profundamente com o Vue, a qual nós acreditamos que oferece uma experiência de desenvolvimento superior.

Outra importante diferença entre os dois ecossistemas é que as bibliotecas companheiras do Vue para gerenciamento de estado e roteamento (dentre [outras preocupações](https://github.com/vuejs)) são oficialmente suportadas e mantidas sempre atualizadas em relação à biblioteca principal. Ao contrário disso, React escolhe deixar tais preocupações para a comunidade, criando um ecossistema mais fragmentado. Por outro lado, por ser mais popular, o ecossistema React é consideravelmente mais rico do que o do Vue.

Por fim, Vue oferece um [CLI gerador de projetos](https://github.com/vuejs/vue-cli) que torna trivialmente simples iniciar um novo projeto usando o sistema de *build* de sua escolha, incluindo [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), ou mesmo [nenhum](https://github.com/vuejs-templates/simple). React também está fazendo avanços nesta área com o [create-react-app](https://github.com/facebookincubator/create-react-app), mas atualmente tem algumas limitações:

- Não permite nenhuma configuração durante a geração do projeto, enquanto os _templates_ de projeto Vue permitem personalização no estilo [Yeoman](http://yeoman.io/).
- Oferece um modelo simples assumindo que você está criando uma aplicação *single-page*, enquanto Vue oferece muita variedade, para vários propósitos e sistemas de *build*.
- Não permite criar projetos a partir de modelos feitos por outros desenvolvedores, o que pode ser muito útil especialmente em ambientes empresariais com padrões estabelecidos.

É importante notar, no entanto, que muitas dessas limitações são decisões de projeto intencionais tomadas pela equipe do create-react-app, as quais têm suas vantagens. Por exemplo, enquanto as necessidades de seu projeto são bem simples e você não precisa "ejetar" para customizar seu processo de *build*, é possível mantê-lo atualizado como uma dependência. Você pode ler mais sobre esta [filosofia diferente aqui](https://github.com/facebookincubator/create-react-app#philosophy).

#### Reduzindo a Escala

React é conhecido por sua curva de aprendizado. Antes que você possa realmente começar, você precisa saber sobre JSX e provavelmente ES2015+, uma vez que muitos exemplos React usam sintaxe de classes. Você também precisa aprender sobre processos de transpilação, pois embora você pudesse tecnicamente usar Babel Standalone para compilar código em tempo real, não é algo recomendado para a produção.

Enquanto Vue escala ascendentemente tão bem quanto, se não até melhor que o React, ele também é capaz de reduzir a escala tão bem quanto jQuery. É isso mesmo - tudo que você precisa fazer é colocar uma única *tag script* na página:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

Então você pode começar a escrever código Vue e ainda distribuir a versão minificada em produção sem se sentir culpado ou ter que se preocupar sobre problemas de performance.

E já que você não precisa obrigatoriamente saber sobre JSX, ES2015 ou sistemas de *build* para começar com o Vue, leva tipicamente menos de um dia para os desenvolvedores lerem os pontos mais importantes [no guia](/guide) e aprenderem o suficiente para criar aplicações não triviais.

### Renderização Nativa

ReactNative lhe permite escrever aplicativos nativamente renderizados para iOS e Android usando o mesmo modelo de componentes do React. É ótimo que, como desenvolvedor, você possa aplicar o conhecimento de um framework entre múltiplas plataformas. Nesta frente, Vue possui uma colaboração oficial com [Weex](https://alibaba.github.io/weex/), um framework de UI multiplataforma desenvolvido por Alibaba Group, o qual utiliza Vue como seu JavaScript framework runtime. Isso significa que, com Weex, você pode utilizar a mesma sintaxe de componentes Vue para criar componentes que podem ser renderizados não apenas no navegador, mas também nativamente em iOS e Android!

No presente momento, Weex ainda é um projeto em desenvolvimento ativo e não está tão maduro e testado na prática quanto o ReactNative, mas o desenvolvimento é dirigido às necessidades de produção do maior negócio de comércio eletrônico do mundo, e a equipe Vue colaborará ativamente com a equipe Weex para garantir a experiência mais suave possível aos desenvolvedores Vue.

### React + MobX

MobX se tornou bem popular na comunidade React e, de fato, utiliza um sistema de reatividade quase idêntico ao Vue. De forma simplista, o fluxo de trabalho React + MobX pode ser pensado como um Vue com código mais prolixo. Por isso, se você estiver usando essa combinação e estiver gostando, saltar para o Vue é, provavelmente, o próximo passo lógico.

## Angular 1

Um pouco da sintaxe Vue é muito similar ao Angular (por exemplo, `v-if` vs. `ng-if`). Isto ocorre pois acreditamos que há muitas coisas que o Angular resolveu corretamente, as quais serviram de inspiração para o Vue bem no início de seu desenvolvimento. Entretanto, também há muitas dores que vêm com o Angular, onde o Vue tentou oferecer melhorias significativas.

### Complexidade

Vue é muito mais simples que o Angular 1, tanto em termos de API quanto de design. Aprender o suficiente para construir aplicações não triviais tipicamente leva menos de um dia, o que não é verdade para o Angular 1.

### Flexibilidade e Modularidade

Angular 1 possui fortes opiniões sobre como as aplicações devem ser estruturadas, enquanto Vue é uma solução mais flexível e modular. Ainda que isto torne Vue mais adaptável a uma ampla variedade de projetos, reconhecemos que às vezes é útil ter algumas decisões já tomadas para você, para que possa simplesmente sair codificando.

É por isso que oferecemos o [modelo de projeto com Webpack](https://github.com/vuejs-templates/webpack) que você pode configurar dentro de poucos minutos, ainda assim concedendo-lhe acesso a recursos avançados como *hot module reloading*, *linting*, extração de CSS, e muito mais.

### Interligação com Dados

Angular 1 adota a abordagem de *two-way binding* entre escopos, enquanto Vue força um fluxo de dados de mão única entre componentes. Isto permite que o fluxo de dados seja mais compreensível em aplicações não triviais.

### Diretivas vs. Componentes

Vue possui clara separação entre diretivas e componentes. Diretivas são feitas exclusivamente para encapsular lógica de manipulação do DOM, enquanto componentes são unidades auto-contidas que possuem sua própria lógica de dados e de apresentação. Com Angular, existe uma confusão considerável entre os dois.

### Desempenho

Vue tem melhor desempenho e é muito, muito mais fácil de otimizar, por não utilizar verificação suja de alterações de dados no escopo (*dirty checking*). Angular 1 torna-se lento quando há um grande número de observadores (*watchers*), pois a cada vez que qualquer coisa muda no escopo, todos esses observadores precisam ser reavaliados. Além disso, este laço de verificação suja do Angular (chamado *digest cycle*), pode ter que executar várias vezes para "estabilizar" se algum observador aciona outra atualização. Usuários do Angular por vezes têm de recorrer a técnicas esotéricas para contornar este ciclo e, em algumas situações, não há simplesmente nenhuma maneira de otimizar um escopo com muitos observadores.

O Vue definitivamente não sofre com isso, pois usa um sistema de observação por rastreamento de dependências transparente, com enfileiramento assíncrono - todas as alterações disparam de forma independente, a menos que tenham dependências explícitas.

Curiosamente, há algumas semelhanças na forma como Angular 2 e Vue estão lidando com estes problemas existentes no Angular 1.

## Angular 2

Temos uma seção separada para Angular 2, por ser de fato um framework completamente novo. Por exemplo, possui um sistema de componentes de primeira classe, muitos detalhes de implementação foram totalmente reescritos, e a API também mudou drasticamente.

### TypeScript

Enquanto Angular 1 poderia ser usado para aplicações menores, Angular 2 mudou o foco para grandes aplicações coorporativas. Como parte disto, ele praticamente exige TypeScript, o que pode ser muito útil para desenvolvedores que desejam a segurança de tipos de dados de linguagens como Java e C#.

Vue também é adequado para [ambientes coorporativos](https://github.com/vuejs/awesome-vue#enterprise-usage) e pode até mesmo utilizar TypeScript através de nossa [tipagem oficial](https://github.com/vuejs/vue/tree/dev/types) e [decoradores criados pela comunidade](https://github.com/itsFrank/vue-typescript), entretanto isto é definitivamente opcional em nosso caso.

### Tamanho e Desempenho

Em termos de desempenho, ambos os frameworks são excepcionalmente rápidos e não há dados suficientes a partir de casos do mundo real para oferecer um veredito. No entanto, se você está determinado a ver alguns números, Vue 2 parece estar à frente do Angular 2 de acordo com este [benchmark conduzido por terceiros](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

No que tange tamanho, Angular 2 oferece mecanismo de compilação *offline* e algoritmo de *tree-shaking* que podem reduzir o tamanho consideravelmente. Ainda assim, uma versão completa do Vue 2 com compilador incluído (23kb) ainda é mais leve do que um exemplo esqueleto otimizado do Angular 2 (50kb). E observe que o tamanho do aplicativo Angular 2 é pequeno graças ao *tree-shaking*, já que remove código referente a recursos que você não está usando. Ele acabará por crescer de volta ao seu tamanho real tão logo você importar e usar mais recursos do framework.

### Flexibilidade

Vue é muito menos opinativo que Angular 2, oferecendo suporte oficial a vários sistemas de *build*, sem restrições sobre como você estrutura sua aplicação. Muitos desenvolvedores gostam desta liberdade, enquanto outros preferem ter somente um "Jeito Certo" de construir qualquer aplicação.

### Curva de Aprendizado

Para começar com Vue, tudo que você precisa é familiaridade com HTML e JavaScript versão ES5 (ou seja, JavaScript puro). Com estas habilidades básicas, você pode começar a construir aplicações não triviais com menos de um dia de leitura [do guia](/guide).

A curva de aprendizado do Angular 2 é muito mais acentuada. Mesmo sem TypeScript, seu [guia de Início Rápido](https://angular.io/docs/js/latest/quickstart.html) começa com um aplicativo que usa JavaScript versão ES2015, NPM com 18 dependências, 4 arquivos e mais de 3.000 palavras para explicar tudo - apenas para dizer "Olá Mundo". É um eufemismo dizer que nosso [Olá Mundo com Vue](index.html#Primeiros-Passos) é consideravelmente mais simples. Na verdade é tão trivial que nem dedicamos uma página inteira no guia para ele.

## Ember

Ember é um framework completo projetado para ser altamente opinativo. Ele fornece uma série de convenções estabelecidas e, uma vez que você fique bastante familiarizado com elas, pode se tornar muito produtivo. No entanto, também significa que a curva de aprendizado é elevada e a flexibilidade é sofrível. É uma escolha para você colocar na balança entre adotar um framework fortemente opinativo ou uma biblioteca com um conjunto de ferramentas de baixo acoplamento que funcionam em conjunto. Este último cenário lhe dá mais liberdade, mas também requer que você tome mais decisões arquitetônicas.

Com isto dito, seria provavelmente mais adequado uma comparação entre o núcleo do Vue e as camadas de [templates](https://guides.emberjs.com/v2.7.0/templates/handlebars-basics/) e de [modelo de objetos](https://guides.emberjs.com/v2.7.0/object-model/) do Ember:

- Vue oferece reatividade não obstrusiva em objetos JavaScript tradicionais e propriedades computadas totalmente automáticas. No Ember, você precisa envolver qualquer coisa em Objetos Ember e manualmente declarar dependências para propriedades computadas.

- A sintaxe de *templates* do Vue se arma com o poder total de expressões JavaScript, enquanto a sintaxe de expressões e *helpers* do Handlebars é bastante limitada.

- Em termos de performance, Vue supera Ember por uma margem justa, mesmo após a atualização mais recente do motor Glimmer no Ember 2. Vue realiza atualizações em lote automaticamente, enquanto no Ember você precisa lidar manualmente com laços de execução em situações de desempenho crítico.

## Knockout

Knockout foi um pioneiro nas áreas de MVVM e rastreamento de dependências e seu sistema de reatividade é muito semelhante ao Vue. O [suporte a navegadores](http://knockoutjs.com/documentation/browser-support.html) é muito impressionante considerando tudo o que faz, suportante retroativamente até o IE6! Vue, por outro lado, suporta apenas IE9 e superiores.

Com o tempo, porém, o desenvolvimento do Knockout começou a diminuir e está começando a dar sinais de sua idade. Por exemplo, seu sistema de componentes carece de um conjunto completo de eventos de ciclo de vida e, embora seja um caso muito comum, a interface para passagem de elementos filhos a um componente pai se mostra um pouco desajeitada em comparação com o [Vue](components.html#Content-Distribution-with-Slots).

Nos parece que existem também diferenças filosóficas na concepção da API que, se você estiver curioso, podem ser demonstradas pela forma como cada um lida com a criação de uma [lista de tarefas simples](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). É definitivamente um tanto subjetivo, mas muitos consideram a API do Vue menos complexo e melhor estruturada.

## Polymer

Polymer é outro projeto patrocinado por Google e, de fato, também foi uma fonte de inspiração para o Vue. Componentes Vue podem ser vagamente comparados com elementos customizados Polymer, e ambos fornecem um estilo de desenvolvimento semelhante. A maior diferença é que o Polymer é construído sobre os mais recentes recursos de Web Components e, portanto, requer *polyfills* não triviais para funcionar (com um desempenho degradado) em navegadores que não suportam esses recursos de forma nativa. Em contraste, Vue funciona sem qualquer dependência externa ou *polyfills* até o IE9.

No Polymer 1.0, a equipe fez também um sistema de *data-binding* muito limitado, a fim de compensar o desempenho. Por exemplo, as únicas expressões suportados em *templates* Polymer são de negação booleana e chamadas simples de métodos. Sua implementação de propriedades computadas também não é muito flexível.

Elementos customizados do Polymer são autorados em arquivos HTML, o que limita a JavaScript/CSS puro (e a recursos suportados pelos navegadores atuais). Em comparação, *single-file components* Vue permitem facilmente usar ES2015+ e pré-processadores HTML/CSS.

Após a implantação, Polymer recomenda o carregamento de tudo sob demanda com importações HTML, o que assume navegadores adequados a esta especificação e suporte HTTP/2 tanto no servidor quanto no cliente. Isto pode ou não ser viável, dependendo de seu público-alvo e ambiente de implantação. Nos casos em que não é desejável, você terá que usar uma ferramenta especial chamada Vulcanizer para agrupar seus elementos Polymer. Nesta frente, Vue pode combinar sua característica de componentes assíncronos com o recurso de *code-splitting* do Webpack para dividir facilmente a aplicação em partes, com pacotes carregados somente quando requeridos. Isso garante compatibilidade com navegadores mais antigos, mantendo excelente desempenho no carregamento.

Também é totalmente viável oferecermos integração mais profunda entre o Vue e as especificações de Web Componentes, como elementos customizados e encapsulamento de estilos com Shadow DOM - no entanto, neste momento, estamos esperando as especificações amadurecerem e se tornarem amplamente implementadas em todos os navegadores convencionais antes de nos comprometermos a fundo com isso.

## Riot

Riot 2.0 fornece um modelo de desenvolvimento baseado em componentes muito similar (os quais são chamados de "tag" no Riot), com uma API mínima e bem concebida. Riot e Vue provavelmente compartilham muitas filosofias de design. No entanto, apesar de ser um pouco mais pesado que Riot, Vue oferece algumas vantagens significativas:

- Verdadeira renderização condicional. Riot renderiza todos os nós e apenas exibe/oculta eles.
- Um roteador muito mais poderoso. No Riot, a API de rotas é extremamente mínima.
- Mais maturidade no suporte a ferramentas de *build*. Vue oferece suporte oficial a [Webpack](https://github.com/vuejs/vue-loader), [Browserify](https://github.com/vuejs/vueify), e [SystemJS](https://github.com/vuejs/systemjs-plugin-vue), enquanto Riot conta com o apoio da comunidade para integração com sistemas de *build*.
- [Sistema de efeitos de transição](transitions.html). Riot não tem nenhum.
- Melhor desempenho. [Apesar de anunciar](https://github.com/vuejs/vuejs.org/issues/346) o uso de DOM Virtual, a verdade é que Riot utiliza *dirty checking* e, portanto, sofre dos mesmos problemas de desempenho do Angular 1.
