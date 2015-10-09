type: api
---

## Global Config

`Vue.config` is an object containing Vue's global configurations. You can modify its properties listed below before bootstrapping your application:

### debug

- Default: `false`

- Usage:

  ``` js
  Vue.config.debug = true
  ```

  When in debug mode, Vue will:

  1. Print stack traces for all warnings.

  2. Make all anchor nodes visible in the DOM as Comment nodes. This makes it easier to inspect the structure of the rendered result.

  <p class="tip">Debug mode is only available in development build.</p>

### delimiters

- Default: `{% raw %}["{{", "}}"]{% endraw %}`

- Usage:

  ``` js
  // ES6 template string style
  Vue.config.delimiters = ['${', '}']
  ```

  Change the plain text interpolation delimiters.

### unsafeDelimiters

- Default: `{% raw %}["{{{", "}}}"]{% endraw %}`

- Usage:

  ``` js
  // make it look more dangerous
  Vue.config.delimiters = ['{!!', '!!}']
  ```

  Change the raw HTML interpolation delimiters.

### silent

- Default: `false`

- Usage:

  ``` js
  Vue.config.silent = true
  ```

  Suppress all Vue.js logs and warnings.

### async

- Default: `true`

- Usage:

  ``` js
  Vue.config.async = false
  ```

  When async mode is off, Vue will perform all DOM updates synchronously upon detecting data change. This may help with debugging in some scenarios, but could also cause degraded performance and affect the order in which wathcer callbacks are called. **`async: false` is not recommended in production.**

## Global API

### Vue.extend( options )

- Arguments:
  - `{Object} options`

- Usage:

  Create a "subclass" of the base Vue constructor. The argument should be an object containing component options.

  The special cases to note here are `el` and `data` options - they must be functions when used with `Vue.extend()`.

  ``` html
  <div id="mount-point"></div>
  ```

  ``` js
  // create reusable constructor
  var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>'
  })
  // create an instance of Profile
  var profile = new Profile({
    data: {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }  
  })
  // mount it on an element
  profile.$mount('#mount-point')
  ```

  Will result in:

  ``` html
  <p>Walter White aka Heisenberg</p>
  ```

- See also: [Guide - Components](/guide/components.html)

### Vue.nextTick( callback )

- Arguments:
  - `{Functon} callback`

- Usage:

  Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update.

  ``` js
  // modify data
  vm.msg = 'Hello'
  // DOM not updated yet
  Vue.nextTick(function () {
    // DOM updated
  })
  ```

- See also: [Guide - Async Update Queue](/guide/reactivity.html#Async_Update_Queue)

### Vue.directive( id, [definition] )

- Arguments:
  - `{String} id`
  - `{Function | Object} [definition]`

- Usage:
  
  Register or retrieve a global directive.

  ``` js
  // register
  Vue.directive('my-directive', {
    bind: function () {},
    update: function () {},
    unbind: function () {}
  })

  // register (simple function directive)
  Vue.directive('my-directive', function () {
    // this will be called as `update`
  })

  // getter, return the directive definition if registered
  var myDirective = Vue.directive('my-directive')
  ```

- See also: [Guide - Custom Directives](/guide/custom-directive.html)

### Vue.elementDirective( id, [definition] )

- Arguments:
  - `{String} id`
  - `{Object} [definition]`

- Usage:

  Register or retrieve a global element directive.

  ``` js
  // register
  Vue.elementDirective('my-element', {
    bind: function () {},
    // element directives do not use `update`
    unbind: function () {}
  })

  // getter, return the directive definition if registered
  var myDirective = Vue.elementDirective('my-element')
  ```

- See also: [Guide - Element Directives](/guide/custom-directive.html#Element_Directives)

### Vue.filter( id, [definition] )

- Arguments:
  - `{String} id`
  - `{Function | Object} [definition]`

- Usage:

  Register or retrieve a global filter.

  ``` js
  // register
  Vue.filter('my-filter', function (value) {
    // return processed value
  })

  // two way filter
  Vue.filter('my-filter', {
    read: function () {},
    write: function () {}
  })

  // getter, return the filter if registered
  var myFilter = Vue.filter('my-filter')
  ```

- See also: [Guide - Custom Filter](/guide/custom-filter.html)

### Vue.component( id, [definition] )

- Arguments:
  - `{String} id`
  - `{Function | Object} [definition]`

- Usage:

  Register or retrieve a global component.

  ``` js
  // register an extended constructor
  Vue.component('my-component', Vue.extend({ /* ... */}))

  // register an options object (automatically call Vue.extend)
  Vue.component('my-component', { /* ... */ })

  // retrive a registered component (always return constructor)
  var MyComponent = Vue.component('my-component')
  ```

- See also: [Guide - Components](/guide/components.html).

### Vue.transition( id, [hooks] )

- Arguments:
  - `{String} id`
  - `{Object} [hooks]`

- Usage:

  Register or retrieve a global transition hooks object.

  ``` js
  // register
  Vue.transition('fade', {
    enter: function () {},
    leave: function () {}
  })

  // retrieve registered hooks
  var fadeTransition = Vue.transition('fade')
  ```

- See also: [Guide - Transitions](/guide/transitions.html).

### Vue.partial( id, [partial] )

- Arguments:
  - `{String} id`
  - `{String} [partial]`

- Usage:

  Register or retrieve a global template partial string.

  ``` js
  // register
  Vue.partial('my-partial', '<div>Hi</div>')

  // retrieve registered partial
  var myPartial = Vue.partial('my-partial')
  ```

- See also: [Special Elements - &lt;partial&gt;](#partial).

### Vue.use( plugin, [options] )

- Arguments:
  - `{Object | Function} plugin`
  - `{Object} [options]`

- Usage:

  Install a Vue.js plugin. If the plugin is an Object, it must expose an `install` method. If it is a function itself, it will be treated as the install method. The install method will be called with Vue as the argument.

- See also: [Guide - Plugins](/guide/plugins.html).

### Vue.mixin( mixin )

- Arguments
  - `{Object} mixin`

- Usage:

  Apply a mixin globally, which affects every Vue instance created afterwards. This can be used by plugin authors to inject custom behavior into components. **Not recommended in application code**.

- See also: [Guide - Global Mixins](/guide/mixins.html#Global_Mixin)

## Options / Data

### data

- **Type:** `Object | Function`
- **Restricton:** Only accepts `Function` when used in `Vue.extend()`.

The data object for the Vue instance. It can be accessed as `vm.$data`:

```js
var data = { a: 1 }
var vm = new Vue({
  data: data
})
vm.$data === data // -> true
```

The Vue instance will proxy access to all its properties, therefore you can manipulate the properties on the Vue instance and the changes get synced back to the actual data object:

```js
vm.a   // -> 1
vm.a = 2
data.a // -> 2
data.a = 3
vm.a   // -> 3
```

Note that properties that start with `_` or `$` will not be proxied on the Vue instance because they may conflict with Vue's internal properties and API methods. You will have to access them as `vm.$data._property`.

The object must be JSON-compliant (no circular references). You can use it just like an ordinary object, and it will look exactly the same when serialized with `JSON.stringify`. You can also share it between multiple Vue instances.

A special case here is when using the `data` option in `Vue.extend()`. Since we don't want nested objects to be shared by all instances created from that extended constructor, we must provide a function that returns a fresh copy of the default data:

``` js
var MyComponent = Vue.extend({
  data: function () {
    return {
      message: 'some default data.',
      object: {
        fresh: true
      }
    }
  }
})
```

<p class="tip">Under the hood, Vue.js attaches a hidden property `__ob__` and recursively converts the object's enumerable properties into getters and setters to enable dependency collection.</p>

### props

- **Type:** `Array | Object`

A list/hash of attributes that are exposed to accept data from the parent component. It has a simple Array-based syntax and an alternative Object-based syntax that allows advanced configurations such as type checking, custom validation and default values.

**Example:**

``` js
Vue.component('param-demo', {
  props: ['size', 'myMessage'], // simple syntax
  compiled: function () {
    console.log(this.size)    // -> 100
    console.log(this.myMessage) // -> 'hello!'
  }
})
```

Note that because HTML attributes are case-insensitive, you need to use a prop's hyphenated form when it appears as an attribute in templates:

``` html
<param-demo size="100" my-message="hello!"></param-demo>
```

For more details on data passing, make sure to read the following sections in guide:

- [Prop Binding Types](/guide/components.html#Prop_Binding_Types)
- [Passing Callbacks as Props](/guide/components.html#Passing_Callbacks_as_Props)

The alternative Object-based syntax looks like this:

``` js
Vue.component('prop-validation-demo', {
  props: {
    size: Number,
    name: {
      type: String,
      required: true
    }
  }
})
```

The following component usage will result in two warnings: type mismatch for "size", and missing required prop "name".

``` html
<prop-validation-demo size="hello">
</prop-validation-demo>
```

For more details on the Object-based syntax and prop validation, see [Prop Specification](/guide/components.html#Prop_Specification).

#### Notes on hyphened attributes

HTML attribute names ignore upper and lower case differences, so we usually use hyphened attributes instead of camel case. There are some special cases when using `props` with attributes that contains hyphens:

1. If the attribute is a data attribute, the `data-` prefix will be auto stripped;

2. If the attribute still contains dashes, it will be camelized. This is because it's inconvenient to access top level properties containing dashes in templates: the expression `my-param` will be parsed as a minus expression unless you use the awkward `this['my-param']` syntax.

This means a param attribute `data-hello` will be set on the vm as `vm.hello`; And `my-param` will be set as `vm.myParam`.

### computed

- **Type:** `Object`

Computed properties to be mixed into the Vue instance. All getters and setters have their `this` context automatically bound to the Vue instance.

**Example:**

```js
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // get only, just need a function
    aDouble: function () {
      return this.a * 2
    },
    // both get and set
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // -> 2
vm.aPlus = 3
vm.a       // -> 2
vm.aDouble // -> 4
```

### methods

- **Type:** `Object`

Methods to be mixed into the Vue instance. You can access these methods directly on the VM instance, or use them in directive expressions. All methods will have their `this` context automatically bound to the Vue instance.

**Example:**

```js
var vm = new Vue({
  data: { a: 1 },
  methods: {
    plus: function () {
      this.a++
    }
  }
})
vm.plus()
vm.a // 2
```

### watch

- **Type**: `Object`

An object where keys are expressions to watch and values are the corresponding callbacks. The value can also be a string of a method name, or an Object that contains additional options. The Vue instance will call `$watch()` for each entry in the object at instantiation.

**Example:**

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  watch: {
    'a': function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // string method name
    'b': 'someMethod',
    // deep watcher
    'c': {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    }
  }
})
vm.a = 2 // -> new: 2, old: 1
```

## Options / DOM

### el

- **Type:** `String | HTMLElement | Function`
- **Restriction:** only accepts type `Function` when used in `Vue.extend()`.

Provide the Vue instance with an existing DOM element. It can be a CSS selector string, an actual HTMLElement, or a function that returns an HTMLElement. Note that the provided element merely serves as a mounting point; it will be replaced if a template is also provided, unless `replace` is set to false. The resolved element will be accessible as `vm.$el`.

When used in `Vue.extend`, a function must be provided so each instance gets a separately created element.

If the option is available at instantiation, the instance will immediately enter compilation; otherwise, the user will have to explicitly call `vm.$mount()` to manually start the compilation.

### template

- **Type:** `String`

A string template to be used as the markup for the Vue instance. By default, the template will **replace** the mounted element. When the `replace` option is set to `false`, the template will be inserted into the mounted element instead. In both cases, any existing markup inside the mounted element will be ignored, unless [content insertion points](/guide/components.html#Content_Insertion) are present in the template.

If the string starts with `#` it will be used as a querySelector and use the selected element's innerHTML as the template string. This allows the use of the common `<script type="x-template">` trick to include templates.

Note that if the template contains more than one top-level node, the instance will become a [fragment instance](/guide/best-practices.html#Fragment_Instance) - i.e. one that manages a list of nodes rather than a single node.

<p class="tip">Vue.js uses DOM-based templating. The compiler walks through DOM elements and looks for directives and creates data bindings. This means all Vue.js templates are parsable HTML that can be converted into actual DOM elements by the browser. Vue.js converts string templates into DOM fragments so they can be cloned when creating more Vue instances. If you want your templates to be valid HTML, you can configure the directive prefix to start with `data-`.</p>

### replace

- **Type:** `Boolean`  
- **Default:** `true`
- **Restriction:** only respected if the **template** option is also present.

Whether to replace the element being mounted on with the template. If set to `false`, the template will overwrite the element's inner content without replacing the element itself.

**Example**:

``` html
<div id="replace"></div>
```

``` js
new Vue({
  el: '#replace',
  template: '<p>replaced</p>'
})
```

Will result in:

``` html
<p>replaced</p>
```

In comparison, when `replace` is set to `false`:

``` html
<div id="insert"></div>
```

``` js
new Vue({
  el: '#insert',
  replace: false,
  template: '<p>inserted</p>'
})
```

Will result in:

``` html
<div id="insert">
  <p>inserted</p>
</div>
```

## Options / Lifecycle Hooks

![Lifecycle Hooks](/images/lifecycle.png)

### created

- **Type:** `Function`

Called synchronously after the instance is created. At this stage, the instance has finished processing the options which means the following have been set up: data observation, computed properties, methods, watch/event callbacks. However, DOM compilation has not been started, and the `$el` property will not be available yet.

### beforeCompile

- **Type:** `Function`

Called right before the compilation starts.

### compiled

- **Type:** `Function`

Called after the compilation is finished. At this stage all directives have been linked so data changes will trigger DOM updates. However, `$el` is not guaranteed to have been inserted into the document yet.

### ready

- **Type:** `Function`

Called after compilation **and** the `$el` is **inserted into the document for the first time**, i.e. right after the first `attached` hook. Note this insertion must be executed via Vue (with methods like `vm.$appendTo()` or as a result of a directive update) to trigger the `ready` hook.

### attached

- **Type:** `Function`

Called when `vm.$el` is attached to DOM by a directive or a VM instance method such as `$appendTo()`. Direct manipulation of `vm.$el` will **not** trigger this hook.

### detached

- **Type:** `Function`

Called when `vm.$el` is removed from the DOM by a directive or a VM instance method. Direct manipulation of `vm.$el` will **not** trigger this hook.

### beforeDestroy

- **Type:** `Function`

Called right before a Vue instance is destroyed. At this stage the instance is still fully functional.

### destroyed

- **Type:** `Function`

Called after a Vue instance has been destroyed. When this hook is called, all bindings and directives of the Vue instance have been unbound and all child Vue instances have also been destroyed.

Note if there is a leaving transition, the `destroyed` hook is called **after** the transition has finished.

## Options / Assets

**Assets Naming Convention**

Some assets, such as components and directives, appear in templates in the form of HTML attributes or HTML custom tags. Since HTML attribute names and tag names are **case-insensitive**, we often need to name our assets using dash-case instead of camelCase. **Starting in 0.12.11**, it is now supported to name your assets using camelCase or PascalCase, and use them in templates with dash-case.

**Example**

``` js
// in a component definition
components: {
  // register using camelCase
  myComponent: { /*... */ }
}
```

``` html
<!-- use dash case in templates -->
<my-component></my-component>
```

This works nicely with [ES6 object literal shorthand](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_6):

``` js
// PascalCase
import TextBox from './components/text-box';
import DropdownMenu from './components/dropdown-menu';

export default {
  components: {
    // use in templates as <text-box> and <dropdown-menu>
    TextBox,
    DropdownMenu
  }
}
```

### directives

- **Type:** `Object`

A hash of directives to be made available to the Vue instance. For details on how to write a custom directive, see [Writing Custom Directives](/guide/custom-directive.html).

### elementDirectives

- **Type:** `Object`

A hash of element directives to be made available to the Vue instance. For details on how to write a element directive, see [Element Directives](/guide/custom-directive.html#Element_Directives).

### filters

- **Type:** `Object`

A hash of filters to be made available to the Vue instance. For details on how to write a custom filter, see [Writing Custom Filters](/guide/custom-filter.html).

### components

- **Type:** `Object`

A hash of components to be made available to the Vue instance. For details on how to extend and compose Vue instances, see [Component System](/guide/components.html).

### transitions

- **Type:** `Object`

A hash of transitions to be made available to the Vue instance. For details see the guide on [Transitions](/guide/transitions.html).

### partials

- **Type:** `Object`

A hash of partial strings to be made available to the Vue instance. For details see [Partial](/api/elements.html#partial).

## Options / Misc

### events

An object where keys are events to listen for and values are the corresponding callbacks. Note these are Vue events rather than DOM events. The value can also be a string of a method name. The Vue instance will call `$on()` for each entry in the object at instantiation.

**Example:**

``` js
var vm = new Vue({
  events: {
    'hook:created': function () {
      console.log('created!')
    },
    greeting: function (msg) {
      console.log(msg)
    },
    // can also use a string for methods
    bye: 'sayGoodbye'
  },
  methods: {
    sayGoodbye: function () {
      console.log('goodbye!')
    }
  }
}) // -> created!
vm.$emit('greeting', 'hi!') // -> hi!
vm.$emit('bye')             // -> goodbye!
```

### mixins

- **Type**: `Array`

The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options just like normal instance objects, and they will be merged against the eventual options using the same option merging logic in `Vue.extend()`. e.g. If your mixin contains a created hook and the component itself also has one, both functions will be called.

Mixin hooks are called in the order they are provided, and called before the component's own hooks.

**Example:**

``` js
var mixin = {
  created: function () { console.log(1) }
}
var vm = new Vue({
  created: function () { console.log(2) },
  mixins: [mixin]
})
// -> 1
// -> 2
```

### name

- **Type**: `String`
- **Restrctions:** only respected when used in `Vue.extend()`.

When inspecting an extended Vue component in the console, the default constructor name is `VueComponent`, which isn't very informative. By passing in an optional `name` option to `Vue.extend()`, you will get a better inspection output so that you know which component you are looking at. The string will be camelized and used as the component's constructor name.

**Example:**

``` js
var Ctor = Vue.extend({
  name: 'cool-stuff'
})
var vm = new Ctor()
console.log(vm) // -> CoolStuff {$el: null, ...}
```

## Instance Properties

### vm.$el

- **Type:** `HTMLElement`
- **Read only**

The DOM element that the Vue instance is managing. Note that for [Fragment Instances](/guide/best-practices.html#Fragment_Instance), `vm.$el` will return an anchor node that indicates the starting position of the fragment.

### vm.$data

- **Type:** `Object`

The data object that the Vue instance is observing. You can swap it with a new object. The Vue instance proxies access to the properties on its data object.

### vm.$options

- **Type:** `Object`

The instantiation options used for the current Vue instance. This is useful when you want to include custom properties in the options:

``` js
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // -> 'foo'
  }
})
```

### vm.$parent

- **Type:** `Vue`
- **Read only**

The parent instance, if the current instance has one.

### vm.$root

- **Type:** `Vue`
- **Read only**

The root Vue instance of the current component tree. If the current instance has no parents this value will be itself.

### vm.$children

- **Type:** `Array<Vue>`
- **Read only**

The direct child components of the current instance.

### vm.$refs

- **Type:** `Object`
- **Read only**

An object that holds child components that have `v-ref` registered. For more details see [v-ref](/api/directives.html#v-ref).

### vm.$els

- **Type:** `Object`
- **Read only**

An object that holds DOM elements that have `v-el` registered. For more details see [v-el](/api/directives.html#v-el).

## Instance Methods / Data

> You can observe data changes on a Vue instance. Note that all watch callbacks fire asynchronously. In addition, value changes are batched within an event loop. This means when a value changes multiple times within a single event loop, the callback will be fired only once with the latest value.

### vm.$watch( expOrFn, callback, [options] )

- **expOrFn** `String|Function`
- **callback( newValue, oldValue )** `Function`
- **options** `Object` *optional*
  - **deep** `Boolean`
  - **immediate** `Boolean`
  - **sync** `Boolean`

Watch an expression or a computed function on the Vue instance for changes. The expression can be a single keypath or actual expressions:

``` js
vm.$watch('a + b', function (newVal, oldVal) {
  // do something
})
// or
vm.$watch(
  function () {
    return this.a + this.b
  },
  function (newVal, oldVal) {
    // do something
  }
)
```

To also detect nested value changes inside Objects, you need to pass in `deep: true` in the options argument. Note that you don't need to do so to listen for Array mutations.

``` js
vm.$watch('someObject', callback, {
  deep: true
})
vm.someObject.nestedValue = 123
// callback is fired
```

Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression:

``` js
vm.$watch('a', callback, {
  immediate: true
})
// callback is fired immediately with current value of `a`
```

Finally, `vm.$watch` returns an unwatch function that stops firing the callback:

``` js
var unwatch = vm.$watch('a', cb)
// later, teardown the watcher
unwatch()
```

### vm.$get( expression )

- **expression** `String`

Retrieve a value from the Vue instance given an expression. Expressions that throw errors will be suppressed and return `undefined`.

### vm.$set( keypath, value )

- **keypath** `String`
- **value** `*`

Set a data value on the Vue instance given a valid keypath. If the path doesn't exist it will be created.

### vm.$delete( key )

- **key** `String`

Delete a root level property on the Vue instance (and also its `$data`).

### vm.$eval( expression )

- **expression** `String`

Evaluate an expression that can also contain filters.

``` js
// assuming vm.msg = 'hello'
vm.$eval('msg | uppercase') // -> 'HELLO'
```

### vm.$interpolate( templateString )

- **templateString** `String`

Evaluate a piece of template string containing mustache interpolations. Note that this method simply performs string interpolation; attribute directives are not compiled.

``` js
// assuming vm.msg = 'hello'
vm.$interpolate('{{msg}} world!') // -> 'hello world!'
```

### vm.$log( [keypath] )

- **keypath** `String` *optional*

Log the current instance data as a plain object, which is more console-inspectable than a bunch of getter/setters. Also accepts an optional key.

``` js
vm.$log() // logs entire ViewModel data
vm.$log('item') // logs vm.item
```

## Instance Methods / Events

> Each vm is also an event emitter. When you have multiple nested ViewModels, you can use the event system to communicate between them.

### vm.$dispatch( event, [args...] )

- **event** `String`
- **args...** *optional*

Dispatch an event from the current vm that propagates all the way up to its `$root`. If a callback returns `false`, it will stop the propagation at its owner instance.

### vm.$broadcast( event, [args...] )

- **event** `String`
- **args...** *optional*

Emit an event to all children vms of the current vm, which gets further broadcasted to their children all the way down. If a callback returns `false`, its owner instance will not broadcast the event any further.

### vm.$emit( event, [args...] )

- **event** `String`
- **args...** *optional*

Trigger an event on this vm only.

### vm.$on( event, callback )

- **event** `String`
- **callback** `Function`

Listen for an event on the current vm.

### vm.$once( event, callback )

- **event** `String`
- **callback** `Function`

Attach a one-time only listener for an event.

### vm.$off( [event, callback] )

- **event** `String` *optional*
- **callback** `Function` *optional*

If no arguments are given, stop listening for all events; if only the event is given, remove all callbacks for that event; if both event and callback are given, remove that specific callback only.

## Instance Methods / DOM

> All vm DOM manipulation methods work like their jQuery counterparts - except they also trigger Vue.js transitions if there are any declared on vm's `$el`. For more details on transitions see [Adding Transition Effects](/guide/transitions.html).

### vm.$appendTo( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

Append the vm's `$el` to target element. The argument can be either an element or a querySelector string.

### vm.$before( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

Insert the vm's `$el` before target element.

### vm.$after( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

Insert the vm's `$el` after target element.

### vm.$remove( [callback] )

- **callback** `Function` *optional*

Remove the vm's `$el` from the DOM.

### vm.$nextTick( callback )

- **callback** `Function`

Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update. This is the same as the global `Vue.nextTick`, except that the callback's `this` context is automatically bound to the instance calling this method.

## Instance Methods / Lifecycle

### vm.$mount( [element|selector] )

- **element** `HTMLElement` | **selector** `String` *optional*

If the Vue instance didn't get an `el` option at instantiation, you can manually call `$mount(el)` to start the compilation phase. By default, the mounted element will be replaced by the instance's template. When the `replace` option is set to `false`, the template will be inserted into the mounted element and overwrite any existing inner content, unless the template contains `<content>` outlets.

If no argument is provided, the template will be created as an out-of-document element, and you will have to use other DOM instance methods to insert it into the document yourself. If `replace` option is set to `false`, then an empty `<div>` will be automatically created as the wrapper element. Calling `$mount()` on an already mounted instance will have no effect. The method returns the instance itself so you can chain other instance methods after it.

### vm.$destroy( [remove] )

- **remove** `Boolean` *optional* (Default: `false`)

Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives and optionally remove its `$el` from the DOM. Also, all `$on` and `$watch` listeners will be automatically removed.

### vm.$compile( element )

- **element** `HTMLElement`

Partially compile a piece of DOM (Element or DocumentFragment). The method returns a `decompile` function that tearsdown the directives created during the process. Note the decompile function does not remove the DOM. This method is exposed primarily for writing advanced custom directives.

## Directives

### v-text

Updates the element's `textContent`.

Internally, &#123;&#123; Mustache &#125;&#125; interpolations are also compiled as a `v-text` directive on a textNode.

### v-html

Updates the element's `innerHTML`.

<p class="tip">Using `v-html` with user-supplied data can be dangerous. It is suggested that you only use `v-html` when you are absolutely sure about the security of the data source, or pipe it through a custom filter that sanitizes untrusted HTML.</p>

### v-show

- This directive can trigger transitions.

Set the element's display to `none` or its original value, depending on the truthy-ness of the binding's value.

### v-on

- This directive requires an argument.
- This directive requires the value to be a Function or a statement.

Attaches an event listener to the element. The event type is denoted by the argument. It is also the only directive that can be used with the `key` filter. For more details see [Listening for Events](/guide/events.html).

### v-model

- This directive can only be used on `<input>`, `<select>` or `<textarea>` elements.
- Directive params: [`lazy`](/guide/forms.html#Lazy_Updates), [`number`](/guide/forms.html#Casting_Value_as_Number), [`options`](/guide/forms.html#Dynamic_Select_Options), [`debounce`](/guide/forms.html#Input_Debounce)

Create a two-way binding on a form input element. Data is synced on every `input` event by default. For detailed examples see [Handling Forms](/guide/forms.html).

### v-if

- This directive can trigger transitions.

Conditionally insert / remove the element based on the truthy-ness of the binding value. If the element is a `<template>` element, its content will be extracted as the conditional block.

**Example:**

``` html
<template v-if="test">
  <p>hello</p>
  <p>world</p>
</template>
```

Will render:

``` html
<!--v-if-start-->
<p>hello</p>
<p>world</p>
<!--v-if-end-->
```

### v-for

- This directive creates child Vue instances.
- This directive requires the value to be an Array, Object or Number.
- This directive can trigger transitions.
- This directive accepts an optional argument.
- Directive params: [`track-by`](/guide/list.html#Using_track-by), [`stagger`](/guide/transitions.html#Staggering_Transitions), [`enter-stagger`](/guide/transitions.html#Staggering_Transitions), [`leave-stagger`](/guide/transitions.html#Staggering_Transitions)

Create a child ViewModel for every item in the binding Array or Object. If the value is a whole Number then that many child ViewModels are created. These child ViewModels will be automatically created / destroyed when mutating methods, e.g. `push()`, are called on the Array or Object, or the number is increased or decreased.

When no argument is provided, the child ViewModel will directly use the assigned element in the Array as its `$data`. If the value is not an object, a wrapper data object will be created and the value will be set on that object using the alias key `$value`.

**Example:**

``` html
<ul>
  <li v-repeat="users">
    {{name}} {{email}}
  </li>
</ul>
```

If an argument is provided, a wrapper data object will always be created, using the argument string as the alias key. This allows for more explicit property access in templates:

``` html
<ul>
  <li v-repeat="user : users">
    {{user.name}} {{user.email}}
  </li>
</ul>
```

Starting in 0.12.8, a special alternative is available to make the syntax more natural:

``` html
<ul>
  <li v-repeat="user in users">
    {{user.name}} {{user.email}}
  </li>
</ul>
```

For detailed examples, see [Displaying a List](/guide/list.html).

### v-ref

Register a reference to a child component on its parent for easier access. Only respected when used on a component or with `v-repeat`. The component instance will be accessible on its parent's `$` object. For an example, see [child reference](/guide/components.html#Child_Reference).

When used with `v-repeat`, the value will be an Array containing all the child Vue instances corresponding to the Array they are bound to.

New in 0.12: If the `v-repeat`'s source data is an Object, then `v-ref` will return an Object with instances matching each key in the Object.

### v-el

Register a reference to a DOM element on its owner Vue instance for easier access. e.g. `<div v-el="hi">` will be accessible as `vm.$$.hi`.

### v-pre

Skip compilation for this element and all its children. Skipping large numbers of nodes with no directives on them can speed up compilation.

### v-cloak

This property remains on the element until the associated ViewModel finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the ViewModel is ready.

## Special Elements

### component

Alternative syntax for invoking components. Primarily used for dynamic components with the `is` attribute:

``` html
<!-- a dynamic component controlled by -->
<!-- the `componentId` property on the vm -->
<component is="{{componentId}}"></component>
```

### slot

`<content>` tags serve as content insertion outlets in component templates. The `<content>` element itself will be replaced. It optionally accepts a `select` attribute, which should be a valid CSS selector to be used to match a subset of inserted content to be displayed:

``` html
<!-- only display <li>'s in the inserted content -->
<content select="li"></content>
```

The select attribute can also contain mustache expressions. For more details, see [Content Insertion](/guide/components.html#Content_Insertion).

### partial

`<partial>` tags serve as outlets for registered partials. Partial contents are also compiled by Vue when inserted. The `<partial>` element itself will be replaced. It requires a `name` attribute to be provided. For example:

``` js
// registering a partial
Vue.partial('my-partial', '<p>This is a partial! {{msg}}</p>')
```

``` html
<!-- a static partial -->
<partial name="my-partial"></partial>

<!-- a dynamic partial -->
<partial name="{{partialId}}"></partial>
```

## Filters

### capitalize

*'abc' => 'Abc'*

### uppercase

*'abc' => 'ABC'*

### lowercase

*'ABC' => 'abc'*

### currency

- this filter takes one optional argument

*12345 => $12,345.00*

You can pass an optional argument which will be used as the currency symbol (default is $).

### pluralize

- this filter takes at least one argument

Pluralizes the argument based on the filtered value. When there is exactly one arg, plural forms simply add an "s" at the end. When there are more than one argument, the arguments will be used as array of strings corresponding to the single, double, triple ... forms of the word to be pluralized. When the number to be pluralized exceeds the length of the args, it will use the last entry in the array.

**Example:**

``` html
{{count}} {{count | pluralize 'item'}}
```

*1 => '1 item'*  
*2 => '2 items'*

``` html
{{date}}{{date | pluralize 'st' 'nd' 'rd' 'th'}}
```

Will result in:

*1 => '1st'*  
*2 => '2nd'*
*3 => '3rd'*
*4 => '4th'*
*5 => '5th'*

### json

- this filter takes one optional argument

JSON.stringify() incoming value rather than outputting the string representation (i.e. `[object Object]`). It also takes one optional argument which is the indent level (defaults to 2):

``` html
<pre>{{$data | json 4}}</pre>
```

### debounce

- this filter only works with `v-on`
- this filter takes one optional argument

Wrap the handler to debounce it for X milliseconds, where X is the argument. Default is 300ms. A debounced handler will be delayed until at least X ms has passed after the call moment; if the handler is called again before the delay period, the delay period is reset to X ms.

### filterBy

**Syntax:** `filterBy searchKey [in dataKey...]`.

- this filter only works for Array values

Return a filtered version of the source Array. The `searchKey` argument is a property key on the context ViewModel. The value of that property will be used as the string to search for:

``` html
<input v-model="searchText">
<ul>
  <li v-repeat="users | filterBy searchText">{{name}}</li>
</ul>
```

When the filter is applied, it will filter the `users` Array by recursively searching for the current value of `searchText` on each item in the Array. For example, if an item is `{ name: 'Jack', phone: '555-123-4567' }` and `searchText` has value `'555'`, the item will be considered a match.

Optionally, you can narrow down which specific property to search in with the optional `in dataKey` argument:

``` html
<input v-model="searchText">
<ul>
  <li v-repeat="user in users | filterBy searchText in 'name'">{{name}}</li>
</ul>
```

Now the item will only match if the value of `searchText` is found in its `name` property. Note here we need to quote `name` to indicate it's a literal string argument. With this limitation, `searchText` with value `'555'` will no longer match this item, but `'Jack'` will.

> New in 0.12.11

Starting in 0.12.11 you can pass in multiple data keys:

``` html
<li v-repeat="user in users | filterBy searchText in 'name' 'phone'"></li>
```

Or pass in a dynamic argument with an Array value:

``` html
<!-- fields = ['fieldA', 'fieldB'] -->
<div v-repeat="user in users | filterBy searchText in fields">
```

Or, just pass in a custom filter function:

``` html
<div v-repeat="user in users | filterBy myCustomFilterFunction">
```

### orderBy

**Syntax:** `orderBy sortKey [reverseKey]`.

- this filter only works for Array values

Return a sorted version of the source Array. The `sortKey` argument is a property key on the context ViewModel. The value of that property will be used as the key to sort the Array items with. The optional `reverseKey` argument is also a property key on the context ViewModel, but the value's truthiness will determine whether the result should be reversed.

``` html
<ul>
  <li v-repeat="user in users | orderBy field reverse">{{name}}</li>
</ul>
```

``` js
new Vue({
  /* ... */
  data: {
    field: 'name',
    reverse: false
  }
})
```

You can also use quotes for literal sort key. To indicate a literal reverse, use `-1`:

``` html
<ul>
  <li v-repeat="user in users | orderBy 'name' -1">{{name}}</li>
</ul>
```
