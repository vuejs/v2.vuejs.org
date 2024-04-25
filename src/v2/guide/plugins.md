---
title: Plugins
type: guide
order: 304
---

Plugins usually add global-level functionality to Vue. There is no strictly defined scope for a plugin - there are typically several types of plugins:

1. Add some global methods or properties e.g. [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. Add one or more global assets: directives/filters/transitions etc e.g. [vue-touch](https://github.com/vuejs/vue-touch)

3. Add some component options by global mixin e.g. [vue-router](https://github.com/vuejs/vue-router)

4. Add some Vue instance methods by attaching them to `Vue.prototype`.

5. A library that provides an API of its own, while at the same time injecting some combination of the above e.g. [vue-router](https://github.com/vuejs/vue-router)

## Using a Plugin

Use plugins by calling the `Vue.use()` global method. This has to be done before you start your app by calling `new Vue()`:

``` js
// calls `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  //... options
})
```

You can optionally pass in some options:

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` automatically prevents you from using the same plugin more than once, so calling it multiple times on the same plugin will install the plugin only once.

Some plugins provided by Vue.js official plugins such as `vue-router` automatically calls `Vue.use()` if `Vue` is available as a global variable. However in a module environment such as CommonJS, you always need to call `Vue.use()` explicitly:

``` js
// When using CommonJS via Browserify or Webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// Don't forget to call this
Vue.use(VueRouter)
```

Checkout [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) for a huge collection of community-contributed plugins and libraries.

## Writing a Plugin

A Vue.js plugin should expose an `install` method. The method will be called with the `Vue` constructor as the first argument, along with possible options:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. add global method or property
  Vue.myGlobalMethod = function () {
    // some logic ...
  }

  // 2. add a global asset
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // some logic ...
    }
    ...
  })

  // 3. inject some component options
  Vue.mixin({
    created: function () {
      // some logic ...
    }
    ...
  })

  // 4. add an instance method
  Vue.prototype.$myMethod = function (methodOptions) {
    // some logic ...
  }
}
```
