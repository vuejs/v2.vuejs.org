title: Global API
type: api
order: 5
---

### Vue.config

`Vue.config` is an object containing Vue's global settings. Here are the list of all the avaiable settings with their default values:

``` js
{
  // print stack trace for warnings?
  debug: true,
  // attribute prefix for directives
  prefix: 'v-',
  // interpolation delimiters
  // for HTML interpolations, add
  // 1 extra outer-most character.
  delimiters: ['{&#123;', '&#125;}'],
  // suppress warnings?
  silent: false,
  // interpolate mustache bindings?
  interpolate: true,
  // use async updates (for directives & watchers)?
  async: true,
  // allow altering observed Array's prototype chain?
  proto: true
}
```

You can modify them directly, for example:

``` js
Vue.config.debug = true // turn on debugging mode
```

Example for changing interpolation delimiters:

``` js
Vue.config.delimiters = ['(%', '%)']
// tags now are (% %) for text
// and ((% %)) for HTML
```

### Vue.extend( options )

- **options** `Object`

Create a "subclass" of the base Vue constructor. All [instantiation options](/api/options.html) can be used here. The special cases to note here are `el` and `data`, which must be functions in this case.

Internally, `Vue.extend()` is called on all component options before instantiating the components. For more details regarding components, see [Component System](/guide/components.html).

**Example**

``` js
var Profile = Vue.extend({
  el: function () {
    return document.createElement('p')
  },
  template: '&#123;&#123;firstName&#125;&#125; &#123;&#123;lastName&#125;&#125; aka &#123;&#123;alias&#125;&#125;'
})
var profile = new Profile({
  data: {
    firstName : 'Walter',
    lastName  : 'White',
    alias     : 'Heisenberg'
  }  
})
profile.$appendTo('body')
```

Will result in:

``` html
<p>Walter White aka Heisenberg</p>
```

### Vue.directive( id, [definition] )

- **id** `String`
- **definition** `Function` or `Object` *optional*

Register or retrieve a global custom directive. For more details see [Writing Custom Directives](/guide/custom-directive.html).

### Vue.filter( id, [definition] )

- **id** `String`
- **definition** `Function` *optional*

Register or retrieve a global custom filter. For more details see [Writing Custom Filters](/guide/custom-filter.html).

### Vue.component( id, [definition] )

- **id** `String`
- **definition** `Function Constructor` or `Object` *optional*

Register or retrieve a global component. For more details see [Component System](/guide/components.html).

### Vue.transition( id, [definition] )

- **id** `String`
- **definition** `Object` *optional*

Register or retrieve a global JavaScript transition effect definition. For more details see the guide for [JavaScript Transitions](/guide/transitions.html#JavaScript_Functions).

### Vue.partial( id, [definition] )

- **id** `String`
- **definition** `String | Node` *optional*

Register or retrieve a global partial. The definition can be a template string, a querySelector that starts with `#`, a DOM element (whose innerHTML will be used as the template string), or a DocumentFragment.

**Example**

HTML

``` html
<div id="demo">
  &#123;&#123;> avatar&#125;&#125;
</div>
```

JavaScript

``` js
Vue.partial('avatar', '&lt;img v-attr="src:avatarURL"&gt;')

new Vue({
  el: '#demo',
  data: {
    avatarURL: '/images/avatar.jpg'
  }    
})
```

Will result in:

``` html
<div id="demo">
  <img src="/images/avatar.jpg">
</div>
```

### Vue.nextTick( callback )

- **callback** `Function`

Vue.js batches view updates and executes them all asynchronously. It uses `requestAnimationFrame` if available and falls back to `setTimeout(fn, 0)`. This method calls the callback after the next view update, which can be useful when you want to wait until the view has been updated.

### Vue.use( plugin, [args...] )

- **plugin** `Object` or `Function`
- **args...** *optional*

Mount a Vue.js plugin. If the plugin is an Object, it must have an `install` method. If it is a function itself, it will be treated as the install method. The install method will be called with Vue as the argument. For more details, see [Plugins](/guide/extending.html#Extend_with_Plugins).

### Vue.util

Exposes the internal `util` module, which contains a number of utility methods. This is intended for advanced plugin/directive authoring, so you will need to look at the source code to see what's available.