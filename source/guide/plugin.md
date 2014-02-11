title: Plugins
type: guide
order: 12
---

*This is a very early preview for the plugin API and this may change in furture versions. You might want to wait for a few official plugins as reference before writing your own.*

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

## Plugin Implementation

``` js
exports.install = function (Vue) {
    // use Vue.require to access internal modules
    var utils = Vue.require('utils')
}
```