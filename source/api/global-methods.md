title: Global Methods
type: api
order: 5
---

### Vue.extend( options )

- **options** `Object`

Create a subclass of the Vue class. Most [instantiation options](/api/instantiation-options.html) can be used here, with the exception of the `el` option because you can't create multiple ViewModel instances on the same element. Also see [Composing ViewModels](/guide/composition.html).

**Example**

``` js
var Profile = Vue.extend({
    tagName: 'P',
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

### Vue.config( options | key, [value] )

- **options** `Object`
- **key** `String`
- **value** `*` *optional*

Configure global settings. This function is overloaded:

```js
// get the `debug` value
Vue.config('debug') // false
// set the `debug` value
Vue.config('debug', true)
// set multiple options
Vue.config({
    debug: true,
    prefix: 'my'
}) 
```

Here are all the options with their default values:

```js
{
    // prefix for directives
    prefix: 'v',

    // log debug info
    debug: false,

    // suppress warnings
    silent: false,

    // CSS class attached for entering transition
    enterClass: 'v-enter',

    // CSS class attached for leaving transition
    leaveClass: 'v-leave',

    // Interpolate mustache bindings
    interpolate: true,

    // Interpolation delimiters
    // default value translates to {&#123; &#125;} and {&#123;{ }&#125;}
    delimiters: ['{', '}']
}
```

### Vue.directive( id, [definition] )

- **id** `String`
- **definition** `Function` or `Object` *optional*

Register or retrieve a global custom directive. For more details see [Writing Custom Directives](/guide/directives.html#Writing_a_Custom_Directive).

### Vue.filter( id, definition )

- **id** `String`
- **definition** `Function` *optional*

Register or retrieve a global custom filter. For more details see [Writing Custom Filters](/guide/filters.html#Writing_a_Custom_Filter).

### Vue.component( id, definition )

- **id** `String`
- **definition** `Function Constructor` or `Object` *optional*

Register or retrieve a global component. For more details see [Composing ViewModels](/guide/composition.html).

### Vue.effect( id, definition )

- **id** `String`
- **definition** `Object` *optional*

Register or retrieve a global JavaScript transition effect definition. For more details see [Adding Transition Effects](/guide/transitions.html#JavaScript_Functions).

### Vue.partial( id, definition )

- **id** `String`
- **definition** `String` or `HTMLElement` *optional*

Register or retrieve a global partial. The definition can be a template string, a querySelector that starts with `#`, or a DOM element (whose innerHTML will be used as the template string.)

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

Vue.js batches view updates and execute them all asynchronously. It uses `requestAnimationFrame` if available and fallsback to `setTimeout(fn, 0)`. This method calls the callback after the next view update, which can be useful when you want to wait until the view has been updated.

### Vue.require( module )

- **module** `String`

Get access to Vue.js' internal modules. This is intended for plugin authors and only the following modules are exposed:

- `utils`
- `config`
- `transition`
- `observer`.

### Vue.use( plugin, [args...] )

- **plugin** `Object` or `Function`
- **args...** *optional*

Mount a Vue.js plugin. If the plugin is an Object, it must have an `install` method. If it is a function itself, it will be treated as the install method. The install method will be called with Vue as the argument. For more details, see [Plugins](/guide/plugin.html).