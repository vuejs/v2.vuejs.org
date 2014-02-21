title: Plugins
type: guide
order: 12
---

> *This is a very early preview for the plugin API and this may change in furture versions. You might want to wait for a few official plugins as reference before writing your own.*

## Using a Plugin

### Verbose version

``` js
// assuming using a CommonJS build system
var vueTouch = require('vue-touch')
Vue.use(vueTouch)
```

### Shorthand equivalent

``` js
// will auto require('vue-touch')
Vue.use('vue-touch')
```

<p class="tip">The shorthand only works in Component, not in Browserify! Browserify uses static parsing to extract dependencies and cannot handle dynamic `require()`.</p>

### Optional arguments

```js
// every additional argument will be passed to the plugin
Vue.use('vue-touch', { moveTolerance: 12 })
```

## Plugin Implementation

``` js
exports.install = function (Vue, options) {
    // use Vue.require to access internal modules
    var utils = Vue.require('utils')
}
```