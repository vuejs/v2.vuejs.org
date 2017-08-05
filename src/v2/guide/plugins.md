---
title: Plugins
type: guide
order: 18
---

## Escrevendo um Plugin

Plugins geralmente acrescentam funcionalidade ao Vue em nível global. Não há um escopo estrito definido para um _plugin_. Existem vários tipos que você pode escrever:

1. Adicionar alguns métodos e propriedades globais. Exemplo: [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. Adicionar um ou mais recursos globais: diretivas/filtros/transições etc. Exemplo: [vue-touch](https://github.com/vuejs/vue-touch)

3. Adicionar algumas opções de componente via _mixin_ global. Exemplo: [vue-router](https://github.com/vuejs/vue-router)

4. Adicionar métodos para instâncias Vue incluindo-os em `Vue.prototype`.

5. Uma biblioteca com uma API própria, que ao mesmo tempo injeta alguma combinação dos anteriores. Exemplo: [vue-router](https://github.com/vuejs/vue-router)

Um _plugin_ do Vue deve expor um método `install`. Esse método será chamado tendo o construtor `Vue` como primeiro argumento, junto com possíveis `options`:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. adicionar método ou propriedade global
  Vue.myGlobalMethod = function () {
    // alguma lógica ...
  }

  // 2. adicionar um recurso global
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // alguma lógica ...
    }
    ...
  })

  // 3. adicionar algumas opções de componente
  Vue.mixin({
    created: function () {
      // alguma lógica ...
    }
    ...
  })

  // 4. adicionar um método de instância
  Vue.prototype.$myMethod = function (methodOptions) {
    // algo lógico ...
  }
}
```

## Usando um Plugin

Use _plugins_ chamando o método global `Vue.use()`:

``` js
// irá chamar `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```

Você pode opcionalmente passar algumas opções:

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` automaticamente previne que você instale o mesmo _plugin_ mais que uma vez, portanto chamar `Vue.use` várias vezes para o mesmo _plugin_ irá instalá-lo uma única vez.

Alguns _plugins_ disponibilizados como oficiais do Vue, como o `vue-router`, automaticamente chamam `Vue.use()` se `Vue` estiver acessível como uma variável global. No entanto, num ambiente de módulos como o CommonJS, você sempre precisa chamar `Vue.use()` explicitamente:

``` js
// Quando estiver usando CommonJS via Browserify ou Webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// Não se esqueça de chamar Vue.use
Vue.use(VueRouter)
```

Confira [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) para uma enorme coleção de _plugins_ e bibliotecas contribuídas pela comunidade.
