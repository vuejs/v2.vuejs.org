---
title: Mixins
type: guide
order: 17
---

## Bases

<p class="tip">**Cette page est en cours de traduction française. Revenez une autre fois pour lire une traduction achevée ou [participez à la traduction française ici](https://github.com/vuejs-fr/vuejs.org).**</p>

Les mixins offrent une manière flexible de créer des fonctionnalités réutilisables par les composants de Vue. Un objet mixin peut contenir toute option valide pour un composant. Quand un composant utilise un mixin, toutes les options du mixin seront "fusionnées" avec les options du composant.

Exemple:

``` js
// define a mixin object
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// définition d'un composant qui utilise ce mixin
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // -> "hello from mixin!"
```

## Fusion des options

Quand un mixin et un composant définissent les mêmes options, elles seront fusionnées en utilisant la stratégie appropriée. Par exemple, les fonctions de hook avec le même nom seront fusionnées dans un tableau afin qu'elles soient toutes appelées. De plus, les hooks des mixins seront appelés **avant** les hooks du composant:

``` js
var mixin = {
  created: function () {
    console.log('mixin hook called')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('component hook called')
  }
})

// -> "mixin hook called"
// -> "component hook called"
```

Les options qui attendent un objet, par exemple `methods`, `components` et `directives`, seront fusionnées dans le même objet. Les options du composant auront la priorité en cas de confit sur les clef d'un de ces objets.

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
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
      console.log('from self')
    }
  }
})

vm.foo() // -> "foo"
vm.bar() // -> "bar"
vm.conflicting() // -> "from self"
```

Notez que les mêmes stratégies de fusion sont utilisée par `Vue.extend()`.

## Mixin global

Vous pouvez aussi appliquer un mixin de manière globale. A utiliser avec prudence ! Une fois que vous appliquez un mixin globalement, il modifiera **toutes** les instances de vues créees ensuite. Bien utilisé, cela peut être exploité pour injecter de la logique pour des options custom :

``` js
// injection d'une fonction pour l'option custom `myOption`
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// -> "hello!"
```

<p class="tip">Utilisez les mixins globaux prudemment et rarement, parce qu'ils affectent chacune des Vue créees, y compris celles des librairies tierces. Dans la plupart des cas, vous devriez uniquement vous en servir pour la gestion des options custom comme illustré dans l'exemple ci-dessus. C'est aussi une bonne idée de les encapsuler dans des [Plugins](plugins.html) pour éviter de les appliquer plusieurs fois par erreur. </p>

## Stratégie de fusion des options custom

Quand les options custom sont fusionnées, elles utilisent la stratégie par défaut, qui est simplement d'écraser la valeur existante. Si vous souhaitez appliquer une stratégie de fusion custom pour une option custom, vous devez attacher une nouvelle fonction à `Vue.config.optionMergeStrategies`:

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

Pour la plupart des options qui attendent des objets, vous pouvez simplement utiliser la stratégie de fusion utilisée par `methods`:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

Un exemple plus avancé peut être trouvé dans la stratégie de fusion de [Vuex](https://github.com/vuejs/vuex) 1.x:

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
