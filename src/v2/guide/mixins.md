---
title: Mixins
type: guide
order: 17
---

## Bases

Les mixins offrent une manière flexible de créer des fonctionnalités réutilisables pour les composants de Vue. Un objet mixin peut contenir toute option valide pour un composant. Quand un composant utilise un mixin, toutes les options du mixin seront "fusionnées" avec les options du composant.

Exemple:

``` js
// définir un objet mixin
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

Les options qui attendent un objet, par exemple `methods`, `components` et `directives`, seront fusionnées dans le même objet. Les options du composant auront la priorité en cas de conflit sur une ou plusieurs clés de ces objets.

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

Notez que les mêmes stratégies de fusion sont utilisées par `Vue.extend()`.

## Mixin global

Vous pouvez aussi appliquer un mixin de manière globale. À utiliser avec prudence ! Une fois que vous appliquez un mixin globalement, il modifiera **toutes** les instances de vues créées ensuite. Bien utilisé, cela peut être exploité pour injecter une logique de traitement pour des options personnalisées :

``` js
// injection d'une fonction pour l'option personnalisée `myOption`
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

<p class="tip">Utilisez les mixins globaux prudemment et rarement, parce qu'ils affectent chacune des Vue créées, y compris celles des librairies tierces. Dans la plupart des cas, vous devriez uniquement vous en servir pour la gestion des options personnalisées comme illustré dans l'exemple ci-dessus. C'est aussi une bonne idée de les encapsuler dans des [Plugins](plugins.html) pour éviter de les appliquer plusieurs fois par erreur. </p>

## Stratégie de fusion des options personnalisées

Quand les options personnalisées sont fusionnées, elles utilisent la stratégie par défaut, qui est simplement d'écraser la valeur existante. Si vous souhaitez appliquer une logique personnalisée pour la fusion d'une option personnalisée, vous devez attacher une nouvelle fonction à `Vue.config.optionMergeStrategies`:

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
