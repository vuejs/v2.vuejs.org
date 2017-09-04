---
title: Componentes Single-File
type: guide
order: 402
---

## Introdução

Em muitos projetos Vue, componentes globais serão definidos com `Vue.component`, seguidos por `new Vue({ el: '#container '})` para atingir um *container* no corpo de cada página.

Isto pode funcionar bem em projetos pequenos e médios, onde o JavaScript só é utilizado para incrementar certas interfaces. No entanto, em projetos mais complexos ou quando o *frontend* é totalmente dirijido pelo JavaScript, tais desvantagens se tornam aparentes:

- **Definições globais** forçam nomes únicos para cada componente
- **Templates com Strings** não têm *syntax highlighting* e são difíceis de ler em múltiplas linhas
- **Sem suporte ao CSS**, enquanto HTML e JavaScript são modularizados em componentes, CSS é notavelmente deixado de fora
- **Sem processamento no build**, ou seja, nos restringindo a HTML e JavaScript ES5, ao invés de preprocessadores como Pug (anteriormente Jade) e Babel

Tudo isso é resolvido através dos **Componentes Single-File** com a extensão `.vue`, possibilitados graças a ferramentas de *build* como Webpack ou Browserify.

Aqui está um simples exemplo de um arquivo que chamaremos de `Hello.vue`:

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

Agora nós obtivemos:

- [Syntax highlighting completo](https://github.com/vuejs/awesome-vue#source-code-editing)
- [Modularização com CommonJS](https://webpack.github.io/docs/commonjs.html)
- [Escopo de CSS por componente](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

Como prometido, podemos também utilizar pré-processadores como Pug (Jade), Babel (com módulos ES2015+) e Stylus para componentes mais limpos e mais ricos em recursos.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

Estas linguagens específicas são meros exemplos. Poderíamos tão facilmente usar Buble, TypeScript, SCSS, PostCSS - ou qualquer outro que acreditarmos nos tornar mais produtivos. Se usar Webpack com `vue-loader`, também há suporte de primeira classe a CSS Modules.

### E a Separação de Responsabilidades?

Uma coisa importante a observar é que **separação de responsabilidades não é igual a separação de tipos de arquivo**. No desenvolvimento moderno de interfaces, chegamos à conclusão que, ao invés de dividir a base de código em três grandes camadas que se entrelaçam umas com as outras, faz muito mais sentido dividir em componentes fracamente acoplados e utilizá-los para composição. Dentro de um componente, seu _template_, sua lógica e seus estilos são inerentemente acoplados, e encará-los dessa forma realmente torna os componentes mais coesos e manuteníveis.

Se mesmo assim não gostar da ideia de Componentes _Single-File_, você ainda pode tirar vantagem de seus recursos de _hot-reloading_ (recompilação e atualização em tempo real ao salvar o código) e de pré-compilação, separando JavaScript e CSS em arquivos distintos:

``` html
<!-- my-component.vue -->
<template>
  <div>Isso será pré-compilado</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Primeiros Passos

### Iniciante em Sistemas de Build

Com componentes `.vue`, estamos entrando no reino das aplicações JavaScript avançadas. Significa aprender a utilizar algumas ferramentas adicionais se ainda não teve oportunidade:

- **Node Package Manager (NPM)**: Leia o guia [Getting Started](https://docs.npmjs.com/getting-started/what-is-npm) do NPM até a seção _10: Uninstalling global packages_.

- **JavaScript Moderno com ES2015+**: Leia o guia [Learn ES2015](https://babeljs.io/docs/learn-es2015/) do Babel. Não é necessário memorizar cada recurso agora, mas mantenha esta página como referência.

Depois que tiver tirado um dia para mergulhar nestes tópicos, dê uma olhada no modelo de projeto [webpack-simple](https://github.com/vuejs-templates/webpack-simple). Seguindo as instruções, você terá em mãos um projeto Vue com componentes `.vue`, ES2015 e _hot-reloading_, rodando em pouquíssimo tempo!

Este modelo de projeto utiliza o [Webpack](https://webpack.js.org/), um "empacotador de módulos" (*module bundler*) que pega vários módulos (arquivos JavaScript diversos) e então os combina em uma aplicação final. Para aprender mais sobre o Webpack em si, dê uma olhada em sua [documentação oficial](https://webpack.js.org/configuration/) e na [Academia Webpack](https://webpack.academy/p/the-core-concepts).

No Webpack, cada módulo pode ser transformado por um _plugin_ "carregador" (*loader*) antes de ser incluído no pacote. Para isso, Vue oferece o _plugin_ [vue-loader](https://github.com/vuejs/vue-loader), responsável por cuidar da transformação dos arquivos `.vue` em JavaScript carregável pelo empacotador. O modelo de projeto [webpack-simple](https://github.com/vuejs-templates/webpack-simple) já possui tudo configurado para você, mas se estiver interessado em entender mais a fundo como os componentes `.vue` funcionam com o Webpack, sugerimos que leia a [documentação do vue-loader](https://vue-loader.vuejs.org).

### Para Usuários Avançados

Independetemente de sua preferência por Webpack ou por Browserify, temos modelos de projeto documentados para ambos, tanto para projetos simples quanto para mais complexos. Recomendados que vasculhe o repositório [github.com/vuejs-templates](https://github.com/vuejs-templates), escolhendo o *template* que considerar mais adequado para o seu caso, seguindo as instruções de cada README para gerar um novo projeto com ajuda da ferramenta [vue-cli](https://github.com/vuejs/vue-cli).
