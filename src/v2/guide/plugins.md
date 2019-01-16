---
title: Plugins
type: guide
order: 304
---

Los _Plugins_ usualmente agregan funcionalidades globales a Vue. No hay un _scope_ estrictamente definido para un _Plugins_, por lo general hay varios tipos de _Plugins_:

1. Agregar algunos métodos globales o propiedades. Por ejemplo: [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. Agregar uno o más recursos globales: directivas, filtros, transiciones etc. Por ejemplo: [vue-touch](https://github.com/vuejs/vue-touch)

3. Agregar algunas opciones de componentes via mixin global. Por ejemplo: [vue-router](https://github.com/vuejs/vue-router)

4. Agregar algunos métodos de instancia de Vue incluyéndolos en Vue.prototype.

5. Una librería que proporciona una API propia, mientras que al mismo tiempo inyecta alguna combinación de lo anterior. Por ejemplo: [vue-router](https://github.com/vuejs/vue-router)

## Usando un Plugin

Use plugins llamando al metodo global `Vue.use()`. Esto debe hacerse antes de iniciar su aplicación a través de `new Vue()`:

``` js
// llamados a `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  //... opciones
})
```

Opcionalmente puede pasar algunas opciones:

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` evita automáticamente que use el mismo _plugin_ más de una vez, por lo que si lo llama varias veces en el mismo _plugin_ solo instalará el _plugin_ una vez.

Algunos _plugins_ proporcionados por los complementos oficiales de Vue.js como `vue-router` automaticamente llaman a `Vue.use()` si `Vue` está disponible como una variable global. Sin embargo, en un entorno de módulos como CommonJS, siempre necesita llamar a `Vue.use()` explícitamente:

``` js
// Cuando usa CommonJS via Browserify o Webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// No olvide hacer esto
Vue.use(VueRouter)
```

Eche un vistazo a la lista [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) para una gran colección de _plugins_ y librerías aportadas por la comunidad.

## Escribiendo un Plugin

Un _plugin_ de Vue.js debe exponer un método `install`. Este método será llamado teniendo el constructor `Vue` como primer argumento, junto con posibles opciones:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. agregar método global o propiedad
  Vue.myGlobalMethod = function () {
    // algo de lógica...
  }

  // 2. agregar un recurso global
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // algo de lógica...
    }
    ...
  })

  // 3. inyectar algunas opciones de componentes
  Vue.mixin({
    created: function () {
      // algo de lógica...
    }
    ...
  })

  // 4. agregar un método de instancia
  Vue.prototype.$myMethod = function (methodOptions) {
    // algo de lógica...
  }
}
```
