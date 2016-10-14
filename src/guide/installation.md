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

NPM é o método de instalação recomendada para aplicações em larga escala com o Vue. Ele combina perfeitamente com *module bundlers*, tais como [Webpack](http://webpack.github.io/) o [Browserify](http://browserify.org/). Vue também possui ferramentas para a criação de [componentes em um único arquivo](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

### Execução Standalone vs. Runtime-only 

Existem dois tipos de builds disponíveis, a *standalone* e a *runtime-olny*.

- A *standalone* inclui o compilador e dá suporte ao sistema de templates. **Ele também conta com a presença de APIs do navegador, então você não pode usá-la para execução no lado do servidor (server-side rendering).**

- A versão *runtime-only* não inclui o compilador de templates, e não dá suporte ao sistema de templates. Você pode usar a opção *render* somente enquanto estiver usando o modo *runtime*, mas ela funciona com componentes do tipo *single-file*, já que estes componentes são pré compilados na renderização durante o build da aplicação. O modo *runtime-only* é cerca de 30% mais leve que a versão *standalone*, com 16Kb min+gzip.

Por padrão, o NPM exporta a versão de build **runtime-only**. Para usar a versão **standalone**, adicione a seguinte configuração na configuração do seu *webpack*:

``` js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.js'
  }
}
```

Para o Browserify, pode-se usar o [aliasify](https://github.com/benbria/aliasify) para alcançar o mesmo resultado.

<p class="tip">Não faça `import Vue from 'vue/dist/vue.js'` - uma vez que algumas ferramentas ou bibliotecas de terceiros podem importar o vue de outra forma, fazendo com que a aplicação carregue os dois modos, runtime e standalone, ocasionando em erros.</p>

### Ambientes CSP 

Em alguns ambientes, tais como o Google Chrome Apps, é necessário cumprir a `Content Security Policy` (CSP), no qual proíbe o uso do `new Function()` para avaliar expressões. A versão *standalone* depende desta funcionalidade para compilar os templates, então este recurso é inviável nestes ambientes.

Por outro lado, a versão *runtime-only* é 100% compatível com CSP. Quando usamos a versão *runtime-only* com [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) ou [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), seus templates serão pré compilados em uma função `render`, que funciona perfeitamente em ambientes CSP.

## CLI

Vue.js provê um  [CLI oficial](https://github.com/vuejs/vue-cli) para rapidamente construir aplicações chamadas de *Single Page Applications*. Ele inclui uma série de funcionalidades e configurações prontas para uso, para o desenvolvimento de aplicações frontend. Leva somente alguns poucos minutos para se obter uma aplicação pronta para ser executada, inclusive com hot-reload, lint ao salvar, e uma build pronta para o servidor de produção. 

``` bash
# instakar vue-cli
$ npm install --global vue-cli
# cria um novo projeto com o template "webpack" 
$ vue init webpack my-project
# instalar as dependências e executar!
$ cd my-project
$ npm install
$ npm run dev
```

## Dev Build

**Importante**: Os arquivos do GitHub no diretório `/dist` são somente usados na fase de release. Para usar o vue através da última versão dispoível no GitHub, você mesmo deverá compilar as fontes:

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

A versão standalone ou a versão instalada via Bower são compilados com UMD, então podem ser usados diretamente como um módulo AMD. 
