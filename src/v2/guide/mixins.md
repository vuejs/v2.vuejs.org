---
title: Mixins
type: guide
order: 17
---

## Introdução

Mixins são uma forma flexível de distribuir funcionalidade reutilizável em diversos componentes Vue. Um objeto mixin pode conter quaisquer opções de componente. Quando um componente utiliza um mixin, todas as opções do mixin irão ser combinadas ("mixed") com as opções do próprio componente.

Exemplo:

``` js
// define um objeto mixin
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('Bem-vindo ao mixin!')
    }
  }
}

// define um componente que usa esse mixin
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // -> "Bem-vindo ao mixin!"
```

## Mesclagem de Opções

Quando um mixin e o próprio componente contêm opções que se sobrepõem, eles serão mesclados ("merged") usando estratégias apropriadas. Por exemplo, funções hook com o mesmo nome serão mescladas em uma array de modo que ambas as funções sejam chamadas. As funções hook declaradas no mixin serão chamadas **antes** dos hooks declarados no próprio componente:

``` js
var mixin = {
  created: function () {
    console.log('hook do mixin')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('hook do componente')
  }
})

// -> "hook do mixin"
// -> "hook do component"
```

Opções que aceitam objetos, por exemplo `methods`, `components` e `directives`, serão mescladas num único objeto. As opções do próprio componente terão prioridade quando houver conflito nas chaves desses objetos:

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('no mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('no componente')
    }
  }
})

vm.foo() // -> "foo"
vm.bar() // -> "bar"
vm.conflicting() // -> "no componente"
```

Note que são as mesmas estratégias utilizadas em `Vue.extend()`.

## Mixin Global

Você também pode aplicar um mixin globalmente. Use com cautela! Quando você aplicar um mixin globalmente, ele irá afetar **todas** as instâncias Vue criadas depois. Quando utilizado apropriadamente, isto pode ser usado para injetar lógica de processamento para opções customizadas:

``` js
// injeta um handler para a opção customizada `myOption`
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'beleza!'
})
// -> "beleza!"
```

<<<<<<< HEAD:src/guide/mixins.md
<p class="tip">Use mixins globais raramente e cuidadosamente, porque eles afetam cada uma das instâncias Vue criadas, incluindo os componentes de terceiros. Na maioria dos casos, você deveria utilizá-los somente para tratar opções customizadas, como demonstrado no exemplo acima. É também uma boa ideia disponibilizá-los como [Plugins](/guide/plugins.html), para evitar uso duplicado.</p>
=======
<p class="tip">Use global mixins sparsely and carefully, because it affects every single Vue instance created, including third party components. In most cases, you should only use it for custom option handling like demonstrated in the example above. It's also a good idea to ship them as [Plugins](plugins.html) to avoid duplicate application.</p>
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/mixins.md

## Estratégias de Mesclagem de Opções Customizadas

Quando opções customizadas são mescladas, elas usam a estratégia padrão, que simplesmente sobrepõe o valor existente. Se você quiser que uma opção seja mesclada usando uma lógica customizada, você precisa vincular uma função em `Vue.config.optionMergeStrategies`:

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

Para a maioria das opções baseadas em objetos, você pode simplesmente utilizar a mesma estratégia usada por `methods`:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

Um exemplo mais avançado pode ser encontrado na estratégia de mesclagem do [Vuex 1.x](https://github.com/vuejs/vuex):

``` js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
  if (!toVal) return fromVal
  if (!fromVal) return toVal
  return {
    getters: merge(toVal.getters, fromVal.getters),
    state: merge(toVal.state, fromVal.state),
    actions: merge(toVal.actions, fromVal.actions)
  }
}
```
