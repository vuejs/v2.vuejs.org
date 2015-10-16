---
title: Plugins
type: guide
order: 17
---



## Writing a Plugin

Plugins usually add global-level functionality to Vue. There is no strictly defined scope for a plugin - there are typically several types of plugins you can write:

1. Add some global methods or properties. e.g. [vue-element](https://github.com/vuejs/vue-element)

2. Add one or more global assets: directives/filters/transitions etc. e.g. [vue-touch](https://github.com/vuejs/vue-touch)

3. Add some Vue instance methods by attaching them to Vue.prototype.

4. A library that provides an API of its own, while at the same time injecting some combination of the above. e.g. [vue-router](https://github.com/vuejs/vue-router)

A Vue.js plugin should expose an `install` method. The method will be called with the `Vue` constructor as the first argument, along with possible options:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. add global method or property
  Vue.myGlobalMethod = ...
  // 2. add a global asset
  Vue.directive('my-directive', {})
  // 3. add an instance method
  Vue.prototype.$myMethod = ...
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

Some plugins such as `vue-router` automatically calls `Vue.use()` if `Vue` is available as a global variable. However in a module environment you always need to call `Vue.use()` explicitly:

``` js
// When using CommonJS via Browserify or Webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// Don't forget to call this
Vue.use(VueRouter)
```

## Existing Plugins & Tools

- [vue-router](https://github.com/vuejs/vue-router): The official router for Vue.js. Deeply integrated with Vue.js core to make building Single Page Applications a breeze.

- [vue-resource](https://github.com/vuejs/vue-resource): A plugin that provides services for making web requests and handle responses using a XMLHttpRequest or JSONP.

- [vue-async-data](https://github.com/vuejs/vue-async-data): Async data loading plugin.

- [vue-validator](https://github.com/vuejs/vue-validator): A plugin for form validations.

- [vue-devtools](https://github.com/vuejs/vue-devtools): A Chrome devtools extension for debugging Vue.js applications.

- [vue-touch](https://github.com/vuejs/vue-touch): Add touch-gesture directives using Hammer.js. (outdated)

- [vue-element](https://github.com/vuejs/vue-element): Register Custom Elements with Vue.js.

- [List of User Contributed Tools](https://github.com/yyx990803/vue/wiki/User-Contributed-Components-&-Tools)
