---
title: Plugins
type: guide
order: 18
---

## Écrie un plugin

Les plugins sont habituellement ajouté au niveau des fonctionnalités globales de Vue. Il y a un cadre strictement défini pour un plugin, et il y a divers types de plugins que vous pouvez écrire :

1. Ajouter plusieurs méthodes globales ou propriétés. Par ex. [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. Ajouter une ou plusieurs ensemble de fonctionnalités : directives/filters/transitions, etc. Par ex. [vue-touch](https://github.com/vuejs/vue-touch)

3. Ajouter plusieurs options de composant avec un mixin global. Par ex. [vuex](https://github.com/vuejs/vuex)

4. Ajouter plusieurs méthodes d'instance de Vue attachées au prototype de Vue.

5. Une bibliothèque fournissant sa propre API, qui inject en même temps plusieurs des éléments précédemment cités. Par ex. [vue-router](https://github.com/vuejs/vue-router)

Un plugin Vue.js doit exposer une méthode `install`. Cette méthode va être appelée avec le constructeur de `Vue` en tant que premier argument, avec les options possibles suivantes :

``` js
MyPlugin.install = function (Vue, options) {
  // 1. ajouter une méthode globale ou une propriété
  Vue.myGlobalMethod = function () {
    // de la logique de code...
  }

  // 2. ajouter des fonctionnalités
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // de la logique de code...
    }
    ...
  })

  // 3. injecter des options de composant
  Vue.mixin({
    created: function () {
      // de la logique de code...
    }
    ...
  })

  // 4. ajouter des méthodes d'instance
  Vue.prototype.$myMethod = function (options) {
    // de la logique de code...
  }
}
```

## Utiliser un plugin

Utiliser un plugin en appelant la méthode globale `Vue.use()` :

``` js
// appeler `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```

Vous pouvez optionnellement passer plusieurs options :

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` va automatiquement vous empécher d'utiliser plusieurs fois le même plugin, ainsi appeler de multiple fois le même plugin ne l'installera qu'une fois.

Plusieurs plugins fournient officiellement par Vue.js comme `vue-router` appel `Vue.use()` si `Vue` est disponible en tant que variable globale. Cependant, dans un environnement par module comme avec CommonJS, vous devrez toujours manuellement appeler `Vue.use()` :

``` js
// En utilisant CommonJS depuis Browserify ou webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// N'oubliez pas de l'appeler
Vue.use(VueRouter)
```

Consultez [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) pour une large collection de plugin et bibliothèque fournis par la contribution de la communauté.
