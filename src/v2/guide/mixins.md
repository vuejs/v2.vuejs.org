---
title: Mixins
type: guide
order: 301
---

## Lo esencial

Los mixins son una forma flexible de distribuir funcionalidades reutilizables para componentes de Vue. Un objeto mixin puede contener cualquier opción de componente. Cuando un componente usa un mixin, todas las opciones en el mixins se "mezclan" en las propias opciones del componente.

Ejemplo:

``` js
// definir un objeto mixin
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hola desde el mixin!')
    }
  }
}

// define a component that uses this mixin
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hola desde el mixin!"
```

## Opción de Fusión

Cuando un _mixin_ y el componente en sí contienen opciones superpuestas, se "fusionarán" utilizando estrategias apropiadas.

Por ejemplo, los objetos de datos se someten a una fusión superficial (profundidad de una propiedad), y los datos del componente tienen prioridad en caso de conflictos.

``` js
var mixin = {
  data: function () {
    return {
      message: 'hola',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'adiós',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "adiós", foo: "abc", bar: "def" }
  }
})
```

Las funciones _hook_ se combinan con el mismo nombre en una matriz para que se llame a todas ellas. Los _hooks_ del _mixin_ se llamarán **antes** de los _hooks_ propios del componente.

``` js
var mixin = {
  created: function () {
    console.log('hook del mixin')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('hook del componente')
  }
})

// => "hook del mixin"
// => "hook del componente"
```

Las opciones que esperan valores de objeto, por ejemplo, `methods`, `components` and `directives`, se fusionarán en el mismo objeto. Las opciones de los componentes seguirán teniendo prioridad en caso de que haya algún conflicto en las claves de estos objetos:

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('algo')
    },
    conflicting: function () {
      console.log('escrito desde el mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('otra cosa')
    },
    conflicting: function () {
      console.log('escrito desde el componente')
    }
  }
})

vm.foo() // => "algo"
vm.bar() // => "otra cosa"
vm.conflicting() // => "escrito desde el componente"
```

Observe que las mismas estrategias de fusión se utilizan en `Vue.extend()`.

## Mixin Global

También puede aplicar un mixin globalmente. Utilícelo con precaución! Una vez que aplique un mixin globalmente, afectará a **cada** instancia de Vue creada posteriormente. Cuando se usa correctamente, se puede usar para inyectar lógica de procesamiento para opciones personalizadas:

``` js
// inyectar un controlador para la opción personalizada `myOption`
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hola!'
})
// => "hola!"
```

<p class="tip">Utilice los mixins globales lo menos posible y con cuidado, ya que afecta a cada instancia creada de Vue, incluidos los componentes de terceros. En la mayoría de los casos, solo debe usarlos para el manejo de opciones personalizadas como se muestra en el ejemplo anterior. También es buena idea dejarlos disponibles como [Plugins](plugins.html) para evitar su uso duplicado.</p>

## Combinación de Opciones Personalizadas

Cuando las opciones personalizadas se combinan, utilizan la estrategia predeterminada que sobrescribe el valor existente. Si desea que una opción personalizada se fusione usando lógica personalizada, debe agregar una función en `Vue.config.optionMergeStrategies`:

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

Para la mayoría de las opciones basadas en objetos, puede usar la misma estrategia que usa `methods`:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

Un ejemplo más avanzado se puede encontrar en esta estrategia de fusión [Vuex 1.x](https://github.com/vuejs/vuex):

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
