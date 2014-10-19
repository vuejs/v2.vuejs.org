title: Tools & Plugins
type: guide
order: 14
---

- [vue-devtools](https://github.com/vuejs/vue-devtools): A Chrome devtools extension for debugging Vue.js applications.
- [vue-touch](https://github.com/vuejs/vue-touch): Add touch-gesture directives using Hammer.js.
- [vue-element](https://github.com/vuejs/vue-element): Register Custom Elements with Vue.js.
- [List of User Contributed Tools](https://github.com/yyx990803/vue/wiki/User-Contributed-Components-&-Tools)

## Using a Plugin

Assuming using a CommonJS build system:

``` js
var vueTouch = require('vue-touch')
// use the plugin globally
Vue.use(vueTouch)
```

Extended components can use plugins too:

``` js
var awesomePlugin = require('vue-awesome')
var MyComponent = Vue.extend({})
MyComponent.use(awesomePlugin)
```

You can also pass in additional options to the plugin:

```js
Vue.use('my-plugin', {
  /* pass in additional options */
})
```

## Writing a Plugin

There are typically several types of plugins you can write:

1. Add one or more global methods. e.g. [vue-element](https://github.com/vuejs/vue-element)
2. Add one or more global assets: directives/filters/transitions etc. e.g. [vue-touch](https://github.com/vuejs/vue-touch)
3. Add some Vue instance methods by attaching them to Vue.prototype. The convention here is Vue instance methods should be prefixed with `$`, so that they don't conflict with user data and methods.

``` js
exports.install = function (Vue, options) {
  Vue.myGlobalMethod = ...          // 1
  Vue.directive('my-directive', {}) // 2
  Vue.prototype.$myMethod = ...     // 3
}
```

There is, however, no hard rules on how you implement your plugin internals. The patterns listed here are just conventions to encourage a consistent interface for all plugins.
