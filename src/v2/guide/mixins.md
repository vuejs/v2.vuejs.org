---
title: Mixins
type: guide
order: 301
---

## Introdução

Mixins são uma forma flexível de distribuir funcionalidade reutilizável em diversos componentes Vue. Um objeto _mixin_ pode conter quaisquer opções de componente. Quando um componente utiliza um _mixin_, todas as opções deste serão misturadas (em inglês, _mixed in_) com as opções do próprio componente.

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

var component = new Component() // => "Bem-vindo ao mixin!"
```

## Mesclagem de Opções

Quando um _mixin_ e o próprio componente contêm opções que se sobrepõem, eles serão mesclados usando estratégias apropriadas. Por exemplo, funções de gatilho com nome equivalente serão mescladas em um Array de modo que ambas as funções sejam executadas. As funções de gatilho declaradas no _mixin_ serão executadas **antes** dos gatilhos declarados no próprio componente:

``` js
var mixin = {
  created: function () {
    console.log('gatilho do mixin')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('gatilho do componente')
  }
})

// => "gatilho do mixin"
// => "gatilho do componente"
```

Opções que aceitam objetos, como `methods`, `components` e `directives`, serão mescladas em um único objeto. As opções do próprio componente terão prioridade, caso ocorra algum conflito nas chaves desses objetos:

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('algo')
    },
    conflicting: function () {
      console.log('escrito pelo mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('outra coisa')
    },
    conflicting: function () {
      console.log('escrito pelo componente')
    }
  }
})

vm.foo() // => "algo"
vm.bar() // => "outra coisa"
vm.conflicting() // => "escrito pelo componente"
```

Observe que são as mesmas estratégias utilizadas em `Vue.extend()`.

## Mixin Global

Você também pode aplicar um _mixin_ globalmente. Use com cautela! Assim que aplicar um _mixin_ globalmente, isto irá afetar **todas** as instâncias Vue criadas depois. Quando utilizado apropriadamente, permite injetar lógica de processamento para opções customizadas:

``` js
// injeta um manipulador para a opção customizada `myOption`
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

// => "beleza!"
```

<p class="tip">Utilize _mixins_ globais raramente e cuidadosamente, porque eles afetam cada uma das instâncias Vue criadas, incluindo os componentes de terceiros. Na maioria dos casos, você deveria utilizá-los somente para tratar opções customizadas, como demonstrado no exemplo acima. É também uma boa ideia disponibilizá-los como [Plugins](plugins.html), para evitar uso duplicado.</p>

## Estratégias de Mesclagem de Opções Customizadas

<<<<<<< HEAD
Quando opções customizadas são mescladas, elas usam a estratégia padrão, que simplesmente sobrepõe o valor existente. Se você quiser que uma opção seja mesclada usando uma lógica customizada, você precisa vincular uma função em `Vue.config.optionMergeStrategies`:
=======
When custom options are merged, they use the default strategy which overwrites the existing value. If you want a custom option to be merged using custom logic, you need to attach a function to `Vue.config.optionMergeStrategies`:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

<<<<<<< HEAD
Para a maioria das opções baseadas em objetos, você pode simplesmente utilizar a mesma estratégia usada por `methods`:
=======
For most object-based options, you can use the same strategy used by `methods`:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

Um exemplo mais avançado pode ser encontrado nesta estratégia de mesclagem do [Vuex 1.x](https://github.com/vuejs/vuex):

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
