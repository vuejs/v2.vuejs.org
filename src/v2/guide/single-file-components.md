---
title: Componentes Single-File
type: guide
order: 19
---

## Introdução

Em muitos projetos Vue, componentes globais serão definidos com `Vue.component`, seguidos por `new Vue({ el: '#container '})` para atingir um *container* no corpo de cada página.

Isto pode funcionar bem em projetos pequenos e médios, onde o JavaScript só é utilizado para incrementar certas interfaces. No entanto, em projetos mais complexos ou quando o *frontend* é totalmente dirijido pelo JavaScript, tais desvantagens se tornam aparentes:

- **Definições globais** forçam nomes únicos para cada componente
- **Templates com Strings** não têm *syntax highlighting* e são difíceis de ler em múltiplas linhas
- **Sem suporte ao CSS**, enquanto HTML e JavaScript são modularizados em componentes, CSS é notavelmente deixado de fora
- **Sem processamento no build**, ou seja, nos restringindo a HTML e JavaScript ES5, ao invés de preprocessadores como Pug (anteriormente Jade) e Babel

Tudo isso é resolvido através dos **Componentes Single-File** com a extensão `.vue`, possibilitados graças a ferramentas de *build* como Webpack ou Browserify.

Aqui está um simples exemplos de um arquivo que chamaremos de `Hello.vue`:

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

Agora nós obtivemos:

- [Syntax highlighting completo](https://github.com/vuejs/awesome-vue#syntax-highlighting)
- [Modularização com CommonJS](https://webpack.github.io/docs/commonjs.html)
- [Escopo de CSS por componente](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

Como prometido, podemos também utilizar pré-processadores como Pug (Jade), Babel (com módulos ES2015+) e Stylus para componentes mais limpos e mais ricos em recursos.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

Estas linguagens específicas são meros exemplos. Poderíamos tão facilmente usar Buble, TypeScript, SCSS, PostCSS - ou qualquer outro que acreditarmos nos tornar mais produtivos.

### What About Separation of Concerns?

One important thing to note is that **separation of concerns is not equal to separation of file types.** In modern UI development, we have found that instead of dividing the codebase into three huge layers that interweaves with one another, it makes much more sense to divide them into loosely-coupled components and compose them. Inside a component, its template, logic and styles are inherently coupled, and collocating them actually makes the component more cohesive and maintainable.

Even if you don't like the idea of Single-File Components, you can still leverage its hot-reloading and pre-compilation features by separating your JavaScript and CSS into separate files:

``` html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Primeiros Passos

### Não Acostumado a Sistemas de Build

Com componentes `.vue`, estamos entrando no reino das aplicações JavaScript avançadas. Significa aprender a utilizar algumas ferramentas adicionais se ainda não teve oportunidade:

- **Node Package Manager (NPM)**: Leia o guia [Getting Started](https://docs.npmjs.com/getting-started/what-is-npm) do NPM até a seção _10: Uninstalling global packages_.

- **JavaScript moderno com ES2015/16**: Leia o guia [Learn ES2015](https://babeljs.io/docs/learn-es2015/) do Babel. Não é necessário memorizar cada recurso agora, mas mantenha esta página como referência.

Depois que tiver tirado um dia para mergulhar nestes tópicos, recomendamos que dê uma olhada no modelo de projeto [webpack-simple](https://github.com/vuejs-templates/webpack-simple). Seguindo as instruções, você terá em mãos um projeto Vue com componentes `.vue`, ES2015 e `hot-reloading` (recompilação e atualização em tempo real ao salvar o código), tudo rodando em pouquíssimo tempo!

Este modelo de projeto utiliza o [Webpack](https://webpack.github.io/), um "empacotador de módulos" (*module bundler*), que pega vários módulos (arquivos JavaScript diversos) e então os combina em uma aplicação final. Para aprender mais sobre o próprio Webpack, [este vídeo](https://www.youtube.com/watch?v=WQue1AN93YU) pode ser uma boa introdução. Depois que você passar do básico, talvez queira conferir este [curso avançado de Webpack em Egghead.io](https://egghead.io/courses/using-webpack-for-production-javascript-applications).

No Webpack, cada módulo pode ser transformado por um plugin "carregador" (*loader*) antes de ser incluído no pacote. Para isso, Vue oferece o plugin [vue-loader](https://github.com/vuejs/vue-loader), responsável por cuidar da transformação dos arquivos `.vue` em JavaScript carregável pelo empacotador. O modelo de projeto [webpack-simple](https://github.com/vuejs-templates/webpack-simple) já possui tudo configurado para você, mas se estiver interessado em entender mais a fundo como os componentes `.vue` funcionam com o Webpack, sugerimos que leia a [documentação do vue-loader](https://vue-loader.vuejs.org).

### Usuário Avançado de Sistemas de Build

Independetemente de sua preferência por Webpack ou por Browserify, temos modelos de projeto documentados para ambos, tanto para projetos simples ou mais complexos. Recomendados que vasculhe o repositório [github.com/vuejs-templates](https://github.com/vuejs-templates), escolhendo o *template* que considerar mais adequado para o seu caso, seguindo as instruções de cada README para gerar um novo projeto com ajuda da ferramenta [vue-cli](https://github.com/vuejs/vue-cli).
