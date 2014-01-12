title: Global Methods
type: api
order: 5
---

# {{title}}

### Vue.extend( options )

- **options** `Object`

Create a subclass of the Vue class. Most [instantiation options](/api/instantiation-options.html) can be used here, with the exception of the `el` option because you can't create multiple ViewModel instances on the same element. For more details see [Extending and Composing ViewModels](/guide/composition.html).

**Example**

``` js
var Avatar = Vue.extend(options)
var avatar = new Avatar() // you can pass more options here
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

Here are the options with their default values:

```js
{
    // prefix for directives
    prefix: 'v',
    // batch DOM updates and render async
    async: true,
    // log debug info
    debug: false,
    // supress warnings
    silent: false,
    // CSS class attached when entering view
    enterClass: 'v-enter',
    // CSS class attached when leaving view
    leaveClass: 'v-leave'
}
```

### Vue.directive( id, [definition] )

- **id** `String`
- **definition** `Function` or `Object` *optional*

Register or retrieve a global custom directive. For more details see [Writing Custom Directives](/guide/custom-directive.html).

### Vue.filter( id, definition )

- **id** `String`
- **definition** `Function` *optional*

Register or retrieve a global custom filter. For more details see [Writing Custom Filters](/guide/custom-filter.html).

### Vue.component( id, definition )

- **id** `String`
- **definition** `Function Constructor` or `Object` *optional*

Register or retrieve a global component. For more details see [Extending and Composing ViewModels](/guide/composition.md).

### Vue.transition( id, definition )

- **id** `String`
- **definition** `Object` *optional*

Register or retrieve a global transition definition. For more details see [Using Transition Effects](/guide/transitions.html).

### Vue.partial( id, definition )

- **id** `String`
- **definition** `String` or `HTMLElement` *optional*

Register or retrieve a global partial. The definition can be a template string, a querySelector that starts with `#`, or a DOM element (whose innerHTML will be used as the template string.)

**Example**

JavaScript

``` js
Vue.partial('avatar', '&lt;div class="avatar"&gt;&lt;/div&gt;')
```

HTML

``` html
<div>&#123;&#123;> avatar&#125;&#125;</div>
```