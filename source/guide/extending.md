title: Extending Vue
type: guide
order: 15
---

## Extend with Mixins

Mixins are a flexible way to distribute reusable functionalities for Vue components. You can write a mixin just like a normal Vue component option object:

``` js
// mixin.js
module.exports = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```

``` js
// test.js
var myMixin = require('./mixin')
var Component = Vue.extend({
  mixins: [myMixin]
})
var component = new Component() // -> "hello from mixin!"
```

## Extend with Plugins

Plugins usually adds global-level functionality to Vue.

### Writing a Plugin

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

### Using a Plugin

Assuming using a CommonJS build system:
``` js
var vueTouch = require('vue-touch')
// use the plugin globally
Vue.use(vueTouch)
```

You can also pass in additional options to the plugin:

```js
Vue.use(require('my-plugin'), {
  /* pass in additional options */
})
```

## Existing Plugins & Tools

- [vue-router](https://github.com/vuejs/vue-router): The official router for Vue.js. Deeply integrated with Vue.js core to make building Single Page Applications a breeze. 
- [vue-resource](https://github.com/vuejs/vue-resource): A plugin that provides services for making web requests and handle responses using a XMLHttpRequest or JSONP.
- [vue-async-data](https://github.com/vuejs/vue-async-data): Async data loading plugin.
- [vue-validator](https://github.com/vuejs/vue-validator): A plugin for form validations.
- [vue-devtools](https://github.com/vuejs/vue-devtools): A Chrome devtools extension for debugging Vue.js applications.
- [vue-touch](https://github.com/vuejs/vue-touch): Add touch-gesture directives using Hammer.js.
- [vue-element](https://github.com/vuejs/vue-element): Register Custom Elements with Vue.js.
- [List of User Contributed Tools](https://github.com/yyx990803/vue/wiki/User-Contributed-Components-&-Tools)

Next: [Tips & Best Practices](/guide/best-practices.html).
