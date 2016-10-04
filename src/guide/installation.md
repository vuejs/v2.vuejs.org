---
title: Instalação
type: guide
order: 1
vue_version: 2.0.1
dev_size: "184.49"
min_size: "61.72"
gz_size: "22.58"
---

### Nota sobre compatibilidade

Vue **não** suporta IE8 e versões anteriores, porque são usadas funcionalidades ECMAScript 5 que são incompatíveis com o IE8. Entretanto, suporta todos os [navegadores compatíveis com ECMAScript 5](http://caniuse.com/#feat=es5).

### Notas de lançamento

Notas detalhadas para cada versão lançada estão disponíveis no [GitHub](https://github.com/vuejs/vue/releases).

## Versão standalone

Simplesmente faça o download e inclua a tag script. `Vue` será registrado como uma variável global.

<p class="tip">Não use a versão minificada durante a fase de desenvolvimento. Você irá perder avisos interessantes para os erros mais comuns!</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Versão de desenvolvimento</a><span class="light info">Com mensagens de erro completas e modo debug</span>

<a class="button" href="/js/vue.min.js" download>Versão de produção</a><span class="light info">Sem mensagens de erro, {{gz_size}}kb min+gzip</span>
</div>

### CDN

Recomendado: [unpkg](https://unpkg.com/vue/dist/vue.js), que reflete a última versão assim que é disponível no npm. Você pode inclusive navegar pelo código fonte do pacote npm em [unpkg.com/vue/](https://unpkg.com/vue/).

Também disponível em [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) ou [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), mas estes dois serviços levam um tempo para sincronizar com a última versão disponível.

## NPM

NPM é o método de instalação recomendada para aplicações em larga escala com o Vue. Ele combina perfeitamente com *module bundlers* tais como [Webpack](http://webpack.github.io/) o [Browserify](http://browserify.org/). Vue also provides accompanying tools for authoring [Single File Components](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

### Standalone vs. Runtime-only Build

There are two builds available, the standalone build and the runtime-only build.

- The standalone build includes the compiler and supports the `template` option. **It also relies on the presence of browser APIs so you cannot use it for server-side rendering.**

- The runtime-only build does not include the template compiler, and does not support the `template` option. You can only use the `render` option when using the runtime-only build, but it works with single-file components, because single-file components' templates are pre-compiled into `render` functions during the build step. The runtime-only build is roughly 30% lighter-weight than the standalone build, weighing only 16kb min+gzip.

By default, the NPM package exports the **runtime-only** build. To use the standalone build, add the following alias to your webpack config:

``` js
resolve: {
  alias: {
    vue: 'vue/dist/vue.js'
  }
}
```

For Browserify, you can use [aliasify](https://github.com/benbria/aliasify) to achieve the same.

<p class="tip">Do NOT do `import Vue from 'vue/dist/vue.js'` - since some tools or 3rd party libraries may import vue as well, this may cause the app to load both the runtime and standalone builds at the same time and lead to errors.</p>

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The standalone build depends on this feature to compile templates, so is unusable in these environments.

On the other hand, the runtime-only build is fully CSP-compliant. When using the runtime-only build with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

## CLI

Vue.js provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds:

``` bash
# install vue-cli
$ npm install --global vue-cli
# create a new project using the "webpack" template
$ vue init webpack my-project
# install dependencies and go!
$ cd my-project
$ npm install
$ npm run dev
```

## Dev Build

**Important**: the built files in GitHub's `/dist` folder are only checked-in during releases. To use Vue from the latest source code on GitHub, you will have to build it yourself!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# latest stable
$ bower install vue
```

## AMD Module Loaders

The standalone downloads or versions installed via Bower are wrapped with UMD so they can be used directly as an AMD module.
