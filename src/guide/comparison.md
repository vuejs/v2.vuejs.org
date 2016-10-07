---
title: Comparação com Outros Frameworks
type: guide
order: 26
---

Esta é definitivamente a página mais difícil de ser escrito do guia, mas sentimos que é importante. É muito provável que você já teve problemas, tentou resolvê-los e já usou outra biblioteca para resolvê-los. Você está aqui pois quer saber se Vue pode resolver seus problemas específicos de uma forma melhor. É isto que esperamos lhe responder.

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

### Perfis de Desempenho

Em todos os cenários de mundo real que testamos até agora, Vue supera React por uma margem justa (normalmente entre 20% a 50% mais rápido, embora em alguns casos, muito mais do que isso). Neste momento poderíamos referenciar *benchmarks* - mas, francamente, todos eles são falhos de alguma forma, e poucos se lembram do que você escreveria em uma aplicação real. Em vez disso, vamos dividir a análise em partes.

#### Desempenho de Renderização

Ao renderizar uma interface, manipulação do DOM é normalmente a operação mais custosa e, infelizmente, nenhuma biblioteca pode fazer essas operações brutas mais rápido. O melhor que podemos fazer é:

1. Minimizar o número de mutações DOM necessárias. Tanto React quanto Vue usam abstrações de DOM virtual para isto, ambos com implementações igualmente boas.
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
    </tr>
  </tbody>
</table>
{% endraw %}

#### Desempenho de Atualização

No React, você precisa implementar `shouldComponentUpdate` em todo lugar e usar estruturas de dados imutáveis para obter reprocessamentos totalmente otimizados. No Vue, as dependências de um componente são automaticamente rastreadas a ele, de forma que só se atualize quando uma dessas dependências se modificar. A única otimização adicional que pode ser útil no Vue, às vezes, é adicionar um atributo `key` aos itens em listas longas.

Significa que atualizações não otimizadas no Vue serão muito mais rápidas do que React não otimizado. Na verdade, devido ao desempenho de renderização superior do Vue, mesmo React totalmente otimizado geralmente será mais lento que Vue sem otimizações manuais.

#### No Desenvolvimento

Obviamente, o desempenho em produção é o mais importante e é sobre isso que estivemos discutindo até agora. Todavia, desempenho durante o desenvolvimento ainda importa. A boa notícia é que tanto Vue quanto React permanecem rápidos o suficiente em desenvolvimento para a maioria das aplicações comuns.

No entanto, se estiver prototipando visualizações de dados de alto desempenho ou animações, você pode achar útil saber que, em cenários críticos onde Vue não consegue lidar com mais de 10 quadros por segundo em desenvolvimento, temos visto React desacelerar para cerca de 1 quadro por segundo.

Isto ocorre devido às muitas checagens de invariantes pesadas do React, que o ajudam a fornecer vários avisos e mensagens de erro excelentes. Concordamos que estes também são importantes no Vue, mas temos tentado ficar de olho no desempenho enquanto implementamos tais verificações.

### HTML & CSS

No React, tudo é somente JavaScript, o que soa muito simples e elegante - até você se aprofundar mais. A triste realidade é que reinventar HTML e CSS dentro do JavaScript pode causar muita dor. No Vue, simplesmente abraçamos as tecnologias Web e construímos em cima delas. Para mostrar o que significa, mergulharemos em alguns exemplos.

#### JSX vs Templates

No React, todos os componentes expressam sua interface com funções `render` usando JSX, uma sintaxe declarativa inspirada em XML, embutida dentro do JavaScript. Aqui está um exemplo, [conferido pela comunidade React](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684):

``` jsx
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

``` html
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items">
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

``` html
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

- Não permite nenhuma configuração durante a geração do projeto, enquanto os templates de projeto Vue permitem personalização no estilo Yeoman.
- Oferece um modelo simples assumindo que você está criando uma aplicação *single-page*, enquanto Vue oferece muita variedade, para vários propósitos e sistemas de *build*.
- Não permite criar projetos a partir de modelos feitos por outros desenvolvedores, o que pode ser muito útil, especialmente em ambientes empresariais com padrões estabelecidos.

É importante notar, no entanto, que muitas dessas limitações são decisões de projeto intencionais tomadas pela equipe do create-react-app, as quais têm suas vantagens. Por exemplo, enquanto as necessidades de seu projeto são bem simples e você não precisa "ejetar" para customizar seu processo de *build*, é possível mantê-lo atualizado como uma dependência. Você pode ler mais sobre esta [filosofia diferente aqui](https://github.com/facebookincubator/create-react-app#philosophy).

#### Reduzindo a Escala

React é conhecido por sua curva de aprendizagem. Antes que você possa realmente começar, você precisa saber sobre JSX e provavelmente ES2015+, uma vez que muitos exemplos React usam sintaxe de classes. Você também precisa aprender sobre processos de transpilação, pois embora você pudesse tecnicamente usar Babel Standalone para compilar código em tempo real, não é algo recomendado para a produção.

Enquanto Vue escala ascendentemente tão bem quanto, se não até melhor que o React, ele também é capaz de reduzir a escala tão bem quanto jQuery. É isso mesmo - tudo que você precisa fazer é colocar uma única *tag script* na página:

``` html
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

Some of Vue's syntax will look very similar to Angular (e.g. `v-if` vs `ng-if`). This is because there were a lot of things that Angular got right and these were an inspiration for Vue very early in its development. There are also many pains that come with Angular however, where Vue has attempted to offer a significant improvement.

### Complexity

Vue is much simpler than Angular 1, both in terms of API and design. Learning enough to build non-trivial applications typically takes less than a day, which is not true for Angular 1.

### Flexibility and Modularity

Angular 1 has strong opinions about how your applications should be structured, while Vue is a more flexible, modular solution. While this makes Vue more adaptable to a wide variety of projects, we also recognize that sometimes it's useful to have some decisions made for you, so that you can just get started coding.

That's why we offer a [Webpack template](https://github.com/vuejs-templates/webpack) that can set you up within minutes, while also granting you access to advanced features such as hot module reloading, linting, CSS extraction, and much more.

### Data binding

Angular 1 uses two-way binding between scopes, while Vue enforces a one-way data flow between components. This makes the flow of data easier to reason about in non-trivial applications.

### Directives vs Components

Vue has a clearer separation between directives and components. Directives are meant to encapsulate DOM manipulations only, while components are self-contained units that have their own view and data logic. In Angular, there's a lot of confusion between the two.

### Performance

Vue has better performance and is much, much easier to optimize because it doesn't use dirty checking. Angular 1 becomes slow when there are a lot of watchers, because every time anything in the scope changes, all these watchers need to be re-evaluated again. Also, the digest cycle may have to run multiple times to "stabilize" if some watcher triggers another update. Angular users often have to resort to esoteric techniques to get around the digest cycle, and in some situations, there's simply no way to optimize a scope with many watchers.

Vue doesn't suffer from this at all because it uses a transparent dependency-tracking observation system with async queueing - all changes trigger independently unless they have explicit dependency relationships.

Interestingly, there are quite a few similarities in how Angular 2 and Vue are addressing these Angular 1 issues.

## Angular 2

We have a separate section for Angular 2 because it really is a completely new framework. For example, it features a first-class component system, many implementation details have been completely rewritten, and the API has also changed quite drastically.

### TypeScript

While Angular 1 could be used for smaller applications, Angular 2 has shifted focus to best facilitate large enterprise applications. As part of this, it almost requires TypeScript, which can be very useful for developers that desire the type safety of languages such as Java and C#.

Vue is also well-suited to [enterprise environments](https://github.com/vuejs/awesome-vue#enterprise-usage) and can even be used with TypeScript via our [official typings](https://github.com/vuejs/vue/tree/dev/types) and [user-contributed decorators](https://github.com/itsFrank/vue-typescript), though it's definitely optional in our case.

### Size and Performance

In terms of performance, both frameworks are exceptionally fast and there isn't enough data from real world use cases to make a verdict. However if you are determined to see some numbers, Vue 2.0 seems to be ahead of Angular 2 according to this [3rd party benchmark](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

Size wise, although Angular 2 with offline compilation and tree-shaking is able to get its size down considerably, a full-featured Vue 2.0 with compiler included (23kb) is still lighter than a tree-shaken bare-bone example of Angular 2 (50kb). And do note the Angular 2 app's size is small due to tree-shaking, which removes code for features that you are not using. It will eventually grow back to its actual size as you import and use more features from the framework.

### Flexibility

Vue is much less opinionated than Angular 2, offering official support for a variety of build systems, with no restrictions on how you structure your application. Many developers enjoy this freedom, while some prefer having only one Right Way to build any application.

### Learning Curve

To get started with Vue, all you need is familiarity with HTML and ES5 JavaScript (i.e. plain JavaScript). With these basic skills, you can start building non-trivial applications within less than a day of reading [the guide](/guide).

Angular 2's learning curve is much steeper. Even without TypeScript, their [Quickstart guide](https://angular.io/docs/js/latest/quickstart.html) starts out with an app that uses ES2015 JavaScript, NPM with 18 dependencies, 4 files, and over 3,000 words to explain it all - just to say Hello World. It's an understatement to say that [Vue's Hello World](index.html#Hello-World) is considerably simpler. It's so trivial in fact, that we don't even dedicate a whole page in the guide to it.

## Ember

Ember is a full-featured framework that is designed to be highly opinionated. It provides a lot of established conventions and once you are familiar enough with them, it can make you very productive. However, it also means the learning curve is high and flexibility suffers. It's a trade-off when you try to pick between an opinionated framework and a library with a loosely coupled set of tools that work together. The latter gives you more freedom but also requires you to make more architectural decisions.

That said, it would probably make a better comparison between Vue core and Ember's [templating](https://guides.emberjs.com/v2.7.0/templates/handlebars-basics/) and [object model](https://guides.emberjs.com/v2.7.0/object-model/) layers:

- Vue provides unobtrusive reactivity on plain JavaScript objects and fully automatic computed properties. In Ember, you need to wrap everything in Ember Objects and manually declare dependencies for computed properties.

- Vue's template syntax harnesses the full power of JavaScript expressions, while Handlebars' expression and helper syntax is quite limited in comparison.

- Performance-wise, Vue outperforms Ember by a fair margin, even after the latest Glimmer engine update in Ember 2.0. Vue automatically batches updates, while in Ember you need to manually manage run loops in performance-critical situations.

## Knockout

Knockout was a pioneer in the MVVM and dependency tracking spaces and its reactivity system is very similar to Vue's. Its [browser support](http://knockoutjs.com/documentation/browser-support.html) is also very impressive considering everything it does, with support back to IE6! Vue on the other hand only supports IE9+.

Over time though, Knockout development has slowed and it's begun to show its age a little. For example, its component system lacks a full set of lifecycle hooks and although it's a very common use case, the interface for passing children to a component feels a little clunky compared to [Vue's](components.html#Content-Distribution-with-Slots).

There also seem to be philosophical differences in the API design which if you're curious, can be demonstrated by how each handles the creation of a [simple todo list](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). It's definitely somewhat subjective, but many consider Vue's API to be less complex and better structured.

## Polymer

Polymer is yet another Google-sponsored project and in fact was a source of inspiration for Vue as well. Vue's components can be loosely compared to Polymer's custom elements and both provide a very similar development style. The biggest difference is that Polymer is built upon the latest Web Components features and requires non-trivial polyfills to work (with degraded performance) in browsers that don't support those features natively. In contrast, Vue works without any dependencies or polyfills down to IE9.

In Polymer 1.0, the team has also made its data-binding system very limited in order to compensate for the performance. For example, the only expressions supported in Polymer templates are boolean negation and single method calls. Its computed property implementation is also not very flexible.

Polymer custom elements are authored in HTML files, which limits you to plain JavaScript/CSS (and language features supported by today's browsers). In comparison, Vue's single file components allows you to easily use ES2015+ and any CSS preprocessors you want.

When deploying to production, Polymer recommends loading everything on-the-fly with HTML Imports, which assumes browsers implementing the spec, and HTTP/2 support on both server and client. This may or may not be feasible depending on your target audience and deployment environment. In cases where this is not desirable, you will have to use a special tool called Vulcanizer to bundle your Polymer elements. On this front, Vue can combine its async component feature with Webpack's code-splitting feature to easily split out parts of the application bundle to be lazy-loaded. This ensures compatibility with older browsers while retaining great app loading performance.

It is also totally feasible to offer deeper integration between Vue with Web Component specs such as Custom Elements and Shadow DOM style encapsulation - however at this moment we are still waiting for the specs to mature and be widely implemented in all mainstream browsers before making any serious committments.

## Riot

Riot 2.0 provides a similar component-based development model (which is called a "tag" in Riot), with a minimal and beautifully designed API. Riot and Vue probably share a lot in design philosophies. However, despite being a bit heavier than Riot, Vue does offer some significant advantages:

- True conditional rendering. Riot renders all if branches and simply shows/hides them.
- A far more powerful router. Riot’s routing API is extremely minimal.
- More mature tooling support. Vue provides official support for [Webpack](https://github.com/vuejs/vue-loader), [Browserify](https://github.com/vuejs/vueify), and [SystemJS](https://github.com/vuejs/systemjs-plugin-vue), while Riot relies on community support for build system integration.
- [Transition effect system](transitions.html). Riot has none.
- Better performance. [Despite advertising](https://github.com/vuejs/vuejs.org/issues/346) use of a virtual DOM, Riot in fact uses dirty checking and thus suffers from the same performance issues as Angular 1.
