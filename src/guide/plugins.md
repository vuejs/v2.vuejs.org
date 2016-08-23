---
title: Plugins
type: guide
order: 18
---

## Writing a Plugin

Plugins usually add global-level functionality to Vue. There is no strictly defined scope for a plugin - there are typically several types of plugins you can write:

1. Add some global methods or properties. e.g. [vue-element](https://github.com/vuejs/vue-element)

2. Add one or more global assets: directives/filters/transitions etc. e.g. [vue-touch](https://github.com/vuejs/vue-touch)

3. Add some component options by global mixin. e.g. [vuex](https://github.com/vuejs/vuex)

4. Add some Vue instance methods by attaching them to Vue.prototype.

5. A library that provides an API of its own, while at the same time injecting some combination of the above. e.g. [vue-router](https://github.com/vuejs/vue-router)

A Vue.js plugin should expose an `install` method. The method will be called with the `Vue` constructor as the first argument, along with possible options:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. add global method or property
  Vue.myGlobalMethod = function () {
    // something logic ...
  }

  // 2. add a global asset
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // something logic ...
    }
    ...
  })

  // 3. inject some component options
  Vue.mixin({
    created: function () {
      // something logic ...
    }
    ...
  })

  // 4. add an instance method
  Vue.prototype.$myMethod = function (options) {
    // something logic ...
  }
}
```

## Using a Plugin

Use plugins by calling the `Vue.use()` global method:

``` js
// calls `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```

You can optionally pass in some options:

``` js
Vue.use(MyPlugin, { someOption: true })
```

Some plugins provided by Vue.js official plugins such as `vue-router` automatically calls `Vue.use()` if `Vue` is available as a global variable. However in a module environment such as CommonJS, you always need to call `Vue.use()` explicitly:

``` js
// When using CommonJS via Browserify or Webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// Don't forget to call this
Vue.use(VueRouter)
```

## Tips for writing a Plugin

### Using Vue Utilities

When you are writing a plaugin with Vue.js API, sometimes may be need the utility library. Vue is exposing the `Vue.util` internaly utilitiy, you can write a plugin by using it, not include the external utility library.

``` js
// Equivalent to `Object.assign`
var a = {}
var b = { foo: 1, bar: 'hello' }
Vue.util.extend(a, b)
console.log(a) // => Object { foo: 1, bar: "hello" }
```

### Modularization

If you want to publish a plugin, you had better implement as the UMD module pattern in order to  corresponding to some use-cases as following example.

``` js
;(function () {
  MyPlugin.install = function (Vue, options) {
    // something impplementation ...
    // ...
  }

  if (typeof exports === 'object') {
    module.exports = MyPlugin // CommonJS
  } else if (typeof define == 'function' && define.amd) {
    define([], function () { return MyPlugin }) // AMD
  } else if (window.Vue) {
    window.MyPlugin = MyPlugin // Browser (not required options)
    Vue.use(MyPlugin)
  }
})()
```

### Minimization

Normally, Vue application or component fetch from HTTP server, and run in the browser. File size directly affect the performance of application, so you had better minify your a plugin with Browserify or Webpack. e.g. the below Webpack

``` sh
webpack plugin.js bundle.js --optimize-minimize
```

## Existing Plugins & Tools

- [vuex](https://github.com/vuejs/vuex): Application architecture for centralized state management in Vue.js application.

- [vue-router](https://github.com/vuejs/vue-router): The official router for Vue.js. Deeply integrated with Vue.js core to make building Single Page Applications a breeze.

- [vue-async-data](https://github.com/vuejs/vue-async-data): Async data loading plugin.

- [vue-validator](https://github.com/vuejs/vue-validator): A plugin for form validations.

- [vue-devtools](https://github.com/vuejs/vue-devtools): A Chrome devtools extension for debugging Vue.js applications.

- [vue-touch](https://github.com/vuejs/vue-touch): Add touch-gesture directives using Hammer.js.

- [vue-element](https://github.com/vuejs/vue-element): Register Custom Elements with Vue.js.

- [vue-animated-list](https://github.com/vuejs/vue-animated-list): A plugin for easily animating `v-for` rendered lists.

- [List of User Contributed Tools](https://github.com/vuejs/awesome-vue#libraries--plugins)
