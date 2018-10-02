---
title: Plugins
type: guide
order: 304
---

Les plugins sont habituellement ajoutés au niveau des fonctionnalités globales de Vue. Il y a un cadre strictement défini pour un plugin et il y a divers types de plugins que vous pouvez écrire pour :

1. Ajouter plusieurs méthodes globales ou propriétés. Par ex. [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. Ajouter une ou plusieurs ressources globales : directives, filters, transitions, etc. Par ex. [vue-touch](https://github.com/vuejs/vue-touch)

3. Ajouter plusieurs options de composant avec un mixin global. Par ex. [vue-router](https://github.com/vuejs/vue-router)

4. Ajouter des méthodes d'instance de Vue en les reliant au prototype de Vue.

5. Fournir une bibliothèque qui fournit sa propre API, et qui en même temps injecte une combinaison des points précédents. Par ex. [vue-router](https://github.com/vuejs/vue-router)

## Utiliser un plugin

Utiliser un plugin en appelant la méthode globale `Vue.use()` :

``` js
// appelle `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```

Vous pouvez optionnellement passer certaines options :

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` empêchera automatiquement l'utilisation du même plugin plusieurs fois. Ainsi, appeler cette fonction plusieurs fois sur le même plugin n'installera le plugin qu'une seule fois.

Certains plugins fournis officiellement par Vue.js comme `vue-router` appellent automatiquement `Vue.use()` si `Vue` est disponible en tant que variable globale. Cependant, dans un environnement modulaire comme avec CommonJS, vous devrez toujours appeler explicitement `Vue.use()` :

``` js
// En utilisant CommonJS depuis Browserify ou webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// N'oubliez pas de l'appeler
Vue.use(VueRouter)
```

Consultez [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) pour une large collection de plugins et bibliothèques fournis par la contribution de la communauté.

## Écrire un plugin

Un plugin Vue.js devrait exposer une méthode `install`. Cette méthode sera appelée avec le constructeur de `Vue` en tant que premier argument, avec les options possibles suivantes :

``` js
MyPlugin.install = function (Vue, options) {
  // 1. ajouter une méthode globale ou une propriété
  Vue.myGlobalMethod = function () {
    // de la logique de code...
  }

  // 2. ajouter une ressource globale
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

  // 4. ajouter une méthode d'instance
  Vue.prototype.$myMethod = function (methodOptions) {
    // de la logique de code...
  }
}
```
