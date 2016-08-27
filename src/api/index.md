---
type: api
---

## Global Config

`Vue.config` is an object containing Vue's global configurations. You can modify its properties listed below before bootstrapping your application:

### debug

- **Type:** `Boolean`

- **Default:** `false`

- **Usage:**

  ``` js
  Vue.config.debug = true
  ```

  When in debug mode, Vue will:

  1. Print stack traces for all warnings.

  2. Make all anchor nodes visible in the DOM as Comment nodes. This makes it easier to inspect the structure of the rendered result.

  <p class="tip">Debug mode is only available in development build.</p>

### delimiters

- **Type:** `Array<String>`

- **Default:** `{% raw %}["{{", "}}"]{% endraw %}`

- **Usage:**

  ``` js
  // ES6 template string style
  Vue.config.delimiters = ['${', '}']
  ```

  Change the plain text interpolation delimiters.

### unsafeDelimiters

- **Type:** `Array<String>`

- **Default:** `{% raw %}["{{{", "}}}"]{% endraw %}`

- **Usage:**

  ``` js
  // make it look more dangerous
  Vue.config.unsafeDelimiters = ['{!!', '!!}']
  ```

  Change the raw HTML interpolation delimiters.

### silent

- **Type:** `Boolean`

- **Default:** `false`

- **Usage:**

  ``` js
  Vue.config.silent = true
  ```

  Suppress all Vue.js logs and warnings.

### async

- **Type:** `Boolean`

- **Default:** `true`

- **Usage:**

  ``` js
  Vue.config.async = false
  ```

  When async mode is off, Vue will perform all DOM updates synchronously upon detecting data change. This may help with debugging in some scenarios, but could also cause degraded performance and affect the order in which watcher callbacks are called. **`async: false` is not recommended in production.**

### devtools

- **Type:** `Boolean`

- **Default:** `true` (`false` in production builds)

- **Usage:**

  ``` js
  // make sure to set this synchronously immediately after loading Vue
  Vue.config.devtools = true
  ```

  Configure whether to allow [vue-devtools](https://github.com/vuejs/vue-devtools) inspection. This option's default value is `true` in development builds and `false` in production builds. You can set it to `true` to enable inspection for production builds.

## Global API

<h3 id="Vue-extend">Vue.extend( options )</h3>

- **Arguments:**
  - `{Object} options`

- **Usage:**

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

- **See also:** [Components](/guide/components.html)

<h3 id="Vue-nextTick">Vue.nextTick( callback )</h3>

- **Arguments:**
  - `{Function} callback`

- **Usage:**

  Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update.

  ``` js
  // modify data
  vm.msg = 'Hello'
  // DOM not updated yet
  Vue.nextTick(function () {
    // DOM updated
  })
  ```

- **See also:** [Async Update Queue](/guide/reactivity.html#Async-Update-Queue)

<h3 id="Vue-set">Vue.set( object, key, value )</h3>

- **Arguments:**
  - `{Object} object`
  - `{String} key`
  - `{*} value`

- **Returns:** the set value.

- **Usage:**

  Set a property on an object. If the object is reactive, ensure the property is created as a reactive property and trigger view updates. This is primarily used to get around the limitation that Vue cannot detect property additions.

- **See also:** [Reactivity in Depth](/guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( object, key )</h3>

- **Arguments:**
  - `{Object} object`
  - `{String} key`

- **Usage:**

  Delete a property on an object. If the object is reactive, ensure the deletion triggers view updates. This is primarily used to get around the limitation that Vue cannot detect property deletions, but you should rarely need to use it.

- **See also:** [Reactivity in Depth](/guide/reactivity.html)

<h3 id="Vue-directive">Vue.directive( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Function | Object} [definition]`

- **Usage:**

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

- **See also:** [Custom Directives](/guide/custom-directive.html)

<h3 id="Vue-elementDirective">Vue.elementDirective( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Object} [definition]`

- **Usage:**

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

- **See also:** [Element Directives](/guide/custom-directive.html#Element-Directives)

<h3 id="Vue-filter">Vue.filter( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Function | Object} [definition]`

- **Usage:**

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

- **See also:** [Custom Filter](/guide/custom-filter.html)

<h3 id="Vue-component">Vue.component( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Function | Object} [definition]`

- **Usage:**

  Register or retrieve a global component.

  ``` js
  // register an extended constructor
  Vue.component('my-component', Vue.extend({ /* ... */ }))

  // register an options object (automatically call Vue.extend)
  Vue.component('my-component', { /* ... */ })

  // retrieve a registered component (always return constructor)
  var MyComponent = Vue.component('my-component')
  ```

- **See also:** [Components](/guide/components.html).

<h3 id="Vue-transition">Vue.transition( id, [hooks] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Object} [hooks]`

- **Usage:**

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

- **See also:** [Transitions](/guide/transitions.html).

<h3 id="Vue-partial">Vue.partial( id, [partial] )</h3>

- **Arguments:**
  - `{String} id`
  - `{String} [partial]`

- **Usage:**

  Register or retrieve a global template partial string.

  ``` js
  // register
  Vue.partial('my-partial', '<div>Hi</div>')

  // retrieve registered partial
  var myPartial = Vue.partial('my-partial')
  ```

- **See also:** [Special Elements - &lt;partial&gt;](#partial).

<h3 id="Vue-use">Vue.use( plugin, [options] )</h3>

- **Arguments:**
  - `{Object | Function} plugin`
  - `{Object} [options]`

- **Usage:**

  Install a Vue.js plugin. If the plugin is an Object, it must expose an `install` method. If it is a function itself, it will be treated as the install method. The install method will be called with Vue as the argument.

- **See also:** [Plugins](/guide/plugins.html).

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **Arguments:**
  - `{Object} mixin`

- **Usage:**

  Apply a mixin globally, which affects every Vue instance created afterwards. This can be used by plugin authors to inject custom behavior into components. **Not recommended in application code**.

- **See also:** [Global Mixins](/guide/mixins.html#Global-Mixin)

## Options / Data

### data

- **Type:** `Object | Function`

- **Restriction:** Only accepts `Function` when used in a component definition.

- **Details:**

  The data object for the Vue instance. Vue.js will recursively convert its properties into getter/setters to make it "reactive". **The object must be plain**: native objects, existing getter/setters and prototype properties are ignored. It is not recommended to observe complex objects.

  Once the instance is created, the original data object can be accessed as `vm.$data`. The Vue instance also proxies all the properties found on the data object.

  Properties that start with `_` or `$` will **not** be proxied on the Vue instance because they may conflict with Vue's internal properties and API methods. You will have to access them as `vm.$data._property`.

  When defining a **component**, `data` must be declared as a function that returns the initial data object, because there will be many instances created using the same definition. If we still use a plain object for `data`, that same object will be **shared by reference** across all instance created! By providing a `data` function, every time a new instance is created, we can simply call it to return a fresh copy of the initial data.

  If required, a deep clone of the original object can be obtained by passing `vm.$data` through `JSON.parse(JSON.stringify(...))`.

- **Example:**

  ``` js
  var data = { a: 1 }

  // direct instance creation
  var vm = new Vue({
    data: data
  })
  vm.a // -> 1
  vm.$data === data // -> true

  // must use function when in Vue.extend()
  var Component = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

- **See also:** [Reactivity in Depth](/guide/reactivity.html).

### props

- **Type:** `Array | Object`

- **Details:**

  A list/hash of attributes that are exposed to accept data from the parent component. It has a simple Array-based syntax and an alternative Object-based syntax that allows advanced configurations such as type checking, custom validation and default values.

- **Example:**

  ``` js
  // simple syntax
  Vue.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // object syntax with validation
  Vue.component('props-demo-advanced', {
    props: {
      // just type check
      size: Number,
      // type check plus other validations
      name: {
        type: String,
        required: true,
        // warn if not two way bound
        twoWay: true
      }
    }
  })
  ```

- **See also:** [Props](/guide/components.html#Props)

### propsData

> 1.0.22+

- **Type:** `Object`

- **Restriction:** only respected in instance creation via `new`.

- **Details:**

  Pass props to an instance during its creation. This is primarily intended to make unit testing easier.

- **Example:**

  ``` js
  var Comp = Vue.extend({
    props: ['msg'],
    template: '<div>{{ msg }}</div>'
  })

  var vm = new Comp({
    propsData: {
      msg: 'hello'
    }
  })
  ```

### computed

- **Type:** `Object`

- **Details:**

  Computed properties to be mixed into the Vue instance. All getters and setters have their `this` context automatically bound to the Vue instance.

- **Example:**

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

- **See also:**
  - [Computed Properties](/guide/computed.html)
  - [Reactivity in Depth: Inside Computed Properties](/guide/reactivity.html#Inside-Computed-Properties)

### methods

- **Type:** `Object`

- **Details:**

  Methods to be mixed into the Vue instance. You can access these methods directly on the VM instance, or use them in directive expressions. All methods will have their `this` context automatically bound to the Vue instance.

- **Example:**

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

- **See also:** [Methods and Event Handling](/guide/events.html)

### watch

- **Type:** `Object`

- **Details:**

  An object where keys are expressions to watch and values are the corresponding callbacks. The value can also be a string of a method name, or an Object that contains additional options. The Vue instance will call `$watch()` for each entry in the object at instantiation.

- **Example:**

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

- **See also:** [Instance Methods - vm.$watch](#vm-watch)

## Options / DOM

### el

- **Type:** `String | HTMLElement | Function`

- **Restriction:** only accepts type `Function` when used in a component definition.

- **Details:**

  Provide the Vue instance an existing DOM element to mount on. It can be a CSS selector string, an actual HTMLElement, or a function that returns an HTMLElement. Note that the provided element merely serves as a mounting point; it will be replaced if a template is also provided, unless `replace` is set to false. The resolved element will be accessible as `vm.$el`.

  When used in `Vue.extend`, a function must be provided so each instance gets a separately created element.

  If this option is available at instantiation, the instance will immediately enter compilation; otherwise, the user will have to explicitly call `vm.$mount()` to manually start the compilation.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### template

- **Type:** `String`

- **Details:**

  A string template to be used as the markup for the Vue instance. By default, the template will **replace** the mounted element. When the `replace` option is set to `false`, the template will be inserted into the mounted element instead. In both cases, any existing markup inside the mounted element will be ignored, unless content distribution slots are present in the template.

  If the string starts with `#` it will be used as a querySelector and use the selected element's innerHTML as the template string. This allows the use of the common `<script type="x-template">` trick to include templates.

  Note that under certain situations, for example when the template contains more than one top-level element, or contains only plain text, the instance will become a fragment instance - i.e. one that manages a list of nodes rather than a single node. Non flow-control directives on the mount point for fragment instances are ignored.

- **See also:**
  - [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)
  - [Content Distribution](/guide/components.html#Content-Distribution-with-Slots)
  - [Fragment Instance](/guide/components.html#Fragment-Instance)

### replace

- **Type:** `Boolean`

- **Default:** `true`

- **Restriction:** only respected if the **template** option is also present.

- **Details:**

  Determines whether to replace the element being mounted on with the template. If set to `false`, the template will overwrite the element's inner content without replacing the element itself. If set to `true`, the template will overwrite the element and merge the element's attributes with the attributes of the component's root node.

- **Example**:

  ``` html
  <div id="replace" class="foo"></div>
  ```

  ``` js
  new Vue({
    el: '#replace',
    template: '<p class="bar">replaced</p>'
  })
  ```

  Will result in:

  ``` html
  <p class="foo bar" id="replace">replaced</p>
  ```

  In comparison, when `replace` is set to `false`:

  ``` html
  <div id="insert" class="foo"></div>
  ```

  ``` js
  new Vue({
    el: '#insert',
    replace: false,
    template: '<p class="bar">inserted</p>'
  })
  ```

  Will result in:

  ``` html
  <div id="insert" class="foo">
    <p class="bar">inserted</p>
  </div>
  ```

## Options / Lifecycle Hooks

### init

- **Type:** `Function`

- **Details:**

  Called synchronously after the instance has just been initialized, before data observation and event / watcher setup.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### created

- **Type:** `Function`

- **Details:**

  Called synchronously after the instance is created. At this stage, the instance has finished processing the options which means the following have been set up: data observation, computed properties, methods, watch/event callbacks. However, DOM compilation has not been started, and the `$el` property will not be available yet.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### beforeCompile

- **Type:** `Function`

- **Details:**

  Called right before the compilation starts.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### compiled

- **Type:** `Function`

- **Details:**

  Called after the compilation is finished. At this stage all directives have been linked so data changes will trigger DOM updates. However, `$el` is not guaranteed to have been inserted into the document yet.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### activate

- **Type:** `Function`

- **Details:**

  Called after compilation is finished, right before `ready` hook.

- **See also:** [Guide](/guide/components.html#activate-Hook)

### ready

- **Type:** `Function`

- **Details:**

  Called after compilation **and** the `$el` is **inserted into the document for the first time**, i.e. right after the first `attached` hook. Note this insertion must be executed via Vue (with methods like `vm.$appendTo()` or as a result of a directive update) to trigger the `ready` hook.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### attached

- **Type:** `Function`

- **Details:**

  Called when `vm.$el` is attached to DOM by a directive or a VM instance method such as `$appendTo()`. Direct manipulation of `vm.$el` will **not** trigger this hook.

### detached

- **Type:** `Function`

- **Details:**

  Called when `vm.$el` is removed from the DOM by a directive or a VM instance method. Direct manipulation of `vm.$el` will **not** trigger this hook.

### beforeDestroy

- **Type:** `Function`

- **Details:**

  Called right before a Vue instance is destroyed. At this stage the instance is still fully functional.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### destroyed

- **Type:** `Function`

- **Details:**

  Called after a Vue instance has been destroyed. When this hook is called, all bindings and directives of the Vue instance have been unbound and all child Vue instances have also been destroyed.

  Note if there is a leaving transition, the `destroyed` hook is called **after** the transition has finished.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

## Options / Assets

### directives

- **Type:** `Object`

- **Details:**

  A hash of directives to be made available to the Vue instance.

- **See also:**
  - [Custom Directives](/guide/custom-directive.html)
  - [Assets Naming Convention](/guide/components.html#Assets-Naming-Convention)

### elementDirectives

- **Type:** `Object`

- **Details:**

  A hash of element directives to be made available to the Vue instance.

- **See also:**
  - [Element Directives](/guide/custom-directive.html#Element-Directives)
  - [Assets Naming Convention](/guide/components.html#Assets-Naming-Convention)

### filters

- **Type:** `Object`

- **Details:**

  A hash of filters to be made available to the Vue instance.

- **See also:**
  - [Custom Filters](/guide/custom-filter.html)
  - [Assets Naming Convention](/guide/components.html#Assets-Naming-Convention)

### components

- **Type:** `Object`

- **Details:**

  A hash of components to be made available to the Vue instance.

- **See also:**
  - [Components](/guide/components.html)

### transitions

- **Type:** `Object`

- **Details:**

  A hash of transitions to be made available to the Vue instance.

- **See also:**
  - [Transitions](/guide/transitions.html)

### partials

- **Type:** `Object`

- **Details:**

  A hash of partial strings to be made available to the Vue instance.

- **See also:**
  - [Special Elements - partial](#partial)

## Options / Misc

### parent

- **Type:** `Vue instance`

- **Details:**

  Specify the parent instance for the instance to be created. Establishes a parent-child relationship between the two. The parent will be accessible as `this.$parent` for the child, and the child will be pushed into the parent's `$children` array.

- **See also:** [Parent-Child Communication](/guide/components.html#Parent-Child-Communication)

### events

- **Type:** `Object`

- **Details:**

  An object where keys are events to listen for and values are the corresponding callbacks. Note these are Vue events rather than DOM events. The value can also be a string of a method name. The Vue instance will call `$on()` for each entry in the object at instantiation.

- **Example:**

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

- **See also:**
  - [Instance Methods - Events](#Instance-Methods-Events)
  - [Parent-Child Communication](/guide/components.html#Parent-Child-Communication)

### mixins

- **Type:** `Array`

- **Details:**

  The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options just like normal instance objects, and they will be merged against the eventual options using the same option merging logic in `Vue.extend()`. e.g. If your mixin contains a created hook and the component itself also has one, both functions will be called.

  Mixin hooks are called in the order they are provided, and called before the component's own hooks.

- **Example:**

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

- **See also:** [Mixins](/guide/mixins.html)

### name

- **Type:** `String`

- **Restriction:** only respected when used in `Vue.extend()`.

- **Details:**

  Allow the component to recursively invoke itself in its template. Note that when a component is registered globally with `Vue.component()`, the global ID is automatically set as its name.

  Another benefit of specifying a `name` option is console inspection. When inspecting an extended Vue component in the console, the default constructor name is `VueComponent`, which isn't very informative. By passing in an optional `name` option to `Vue.extend()`, you will get a better inspection output so that you know which component you are looking at. The string will be camelized and used as the component's constructor name.

- **Example:**

  ``` js
  var Ctor = Vue.extend({
    name: 'stack-overflow',
    template:
      '<div>' +
        // recursively invoke self
        '<stack-overflow></stack-overflow>' +
      '</div>'
  })

  // this will actually result in a max stack size exceeded
  // error, but let's assume it works...
  var vm = new Ctor()

  console.log(vm) // -> StackOverflow {$el: null, ...}
  ```

### extends

> 1.0.22+

- **Type:** `Object | Function`

- **Details:**

  Allows declaratively extending another component (could be either a plain options object or a constructor) without having to use `Vue.extend`. This is primarily intended to make it easier to extend between single file components.

  This is similar to `mixins`, the difference being that the component's own options takes higher priority than the source component being extended.

- **Example:**

  ``` js
  var CompA = { ... }

  // extend CompA without having to call Vue.extend on either
  var CompB = {
    extends: CompA,
    ...
  }
  ```

## Instance Properties

### vm.$data

- **Type:** `Object`

- **Details:**

  The data object that the Vue instance is observing. You can swap it with a new object. The Vue instance proxies access to the properties on its data object.

### vm.$el

- **Type:** `HTMLElement`

- **Read only**

- **Details:**

  The DOM element that the Vue instance is managing. Note that for [Fragment Instances](/guide/components.html#Fragment-Instance), `vm.$el` will return an anchor node that indicates the starting position of the fragment.

### vm.$options

- **Type:** `Object`

- **Read only**

- **Details:**

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

- **Type:** `Vue instance`

- **Read only**

- **Details:**

  The parent instance, if the current instance has one.

### vm.$root

- **Type:** `Vue instance`

- **Read only**

- **Details:**

  The root Vue instance of the current component tree. If the current instance has no parents this value will be itself.

### vm.$children

- **Type:** `Array<Vue instance>`

- **Read only**

- **Details:**

  The direct child components of the current instance.

### vm.$refs

- **Type:** `Object`

- **Read only**

- **Details:**

  An object that holds child components that have `v-ref` registered.

- **See also:**
  - [Child Component Refs](/guide/components.html#Child-Component-Refs)
  - [v-ref](#v-ref).

### vm.$els

- **Type:** `Object`

- **Read only**

- **Details:**

  An object that holds DOM elements that have `v-el` registered.

- **See also:** [v-el](#v-el).

## Instance Methods / Data

<h3 id="vm-watch">vm.$watch( expOrFn, callback, [options] )</h3>

- **Arguments:**
  - `{String | Function} expOrFn`
  - `{Function} callback`
  - `{Object} [options]`
    - `{Boolean} deep`
    - `{Boolean} immediate`

- **Returns:** `{Function} unwatch`

- **Usage:**

  Watch an expression or a computed function on the Vue instance for changes. The callback gets called with the new value and the old value. The expression can be a single keypath or any valid binding expressions.

<p class="tip">Note: when mutating (rather than replacing) an Object or an Array, the old value will be the same as new value because they reference the same Object/Array. Vue doesn't keep a copy of the pre-mutate value.</p>

- **Example:**

  ``` js
  // keypath
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // do something
  })

  // expression
  vm.$watch('a + b', function (newVal, oldVal) {
    // do something
  })

  // function
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (newVal, oldVal) {
      // do something
    }
  )
  ```

  `vm.$watch` returns an unwatch function that stops firing the callback:

  ``` js
  var unwatch = vm.$watch('a', cb)
  // later, teardown the watcher
  unwatch()
  ```

- **Option: deep**

  To also detect nested value changes inside Objects, you need to pass in `deep: true` in the options argument. Note that you don't need to do so to listen for Array mutations.

  ``` js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback is fired
  ```

- **Option: immediate**

  Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression:

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // callback is fired immediately with current value of `a`
  ```

<h3 id="vm-get">vm.$get( expression )</h3>

- **Arguments:**
  - `{String} expression`

- **Usage:**

  Retrieve a value from the Vue instance given an expression. Expressions that throw errors will be suppressed and return `undefined`.

- **Example:**

  ``` js
  var vm = new Vue({
    data: {
      a: {
        b: 1
      }
    }
  })
  vm.$get('a.b') // -> 1
  vm.$get('a.b + 1') // -> 2
  ```

<h3 id="vm-set">vm.$set( keypath, value )</h3>

- **Arguments:**
  - `{String} keypath`
  - `{*} value`

- **Usage:**

  Set a data value on the Vue instance given a valid keypath. In most cases you should prefer setting properties using plain object syntax, e.g. `vm.a.b = 123`. This method is only needed in two scenarios:

  1. When you have a keypath string and want to dynamically set the value using that keypath.

  2. When you want to set a property that doesn't exist.

  If the path doesn't exist it will be recursively created and made reactive. If a new root-level reactive property is created due to a `$set` call, the Vue instance will be forced into a "digest cycle", during which all its watchers are re-evaluated.

- **Example:**

  ``` js
  var vm = new Vue({
    data: {
      a: {
        b: 1
      }
    }
  })

  // set an existing path
  vm.$set('a.b', 2)
  vm.a.b // -> 2

  // set a non-existent path, will force digest
  vm.$set('c', 3)
  vm.c // -> 3
  ```

- **See also:** [Reactivity in Depth](/guide/reactivity.html)

<h3 id="vm-delete">vm.$delete( key )</h3>

- **Arguments:**
  - `{String} key`

- **Usage:**

  Delete a root level property on the Vue instance (and also its `$data`). Forces a digest cycle. Not recommended.

<h3 id="vm-eval">vm.$eval( expression )</h3>

- **Arguments:**
  - `{String} expression`

- **Usage:**

  Evaluate a valid binding expression on the current instance. The expression can also contain filters.

- **Example:**

  ``` js
  // assuming vm.msg = 'hello'
  vm.$eval('msg | uppercase') // -> 'HELLO'
  ```

<h3 id="vm-interpolate">vm.$interpolate( templateString )</h3>

- **Arguments:**
  - `{String} templateString`

- **Usage:**

  Evaluate a piece of template string containing mustache interpolations. Note that this method simply performs string interpolation; attribute directives are ignored.

- **Example:**

  ``` js
  // assuming vm.msg = 'hello'
  vm.$interpolate('{{msg}} world!') // -> 'hello world!'
  ```

<h3 id="vm-log">vm.$log( [keypath] )</h3>

- **Arguments:**
  - `{String} [keypath]`

- **Usage:**

  Log the current instance data as a plain object, which is more inspection-friendly than a bunch of getter/setters. Also accepts an optional key.

  ``` js
  vm.$log() // logs entire ViewModel data
  vm.$log('item') // logs vm.item
  ```

## Instance Methods / Events

<h3 id="vm-on">vm.$on( event, callback )</h3>

- **Arguments:**
  - `{String} event`
  - `{Function} callback`

- **Usage:**

  Listen for a custom event on the current vm. Events can be triggered by `vm.$emit`, `vm.$dispatch` or `vm.$broadcast`. The callback will receive all the additional arguments passed into these event-triggering methods.

- **Example:**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'hi')
  // -> "hi"
  ```

<h3 id="vm-once">vm.$once( event, callback )</h3>

- **Arguments:**
  - `{String} event`
  - `{Function} callback`

- **Usage:**

  Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

<h3 id="vm-off">vm.$off( [event, callback] )</h3>

- **Arguments:**
  - `{String} [event]`
  - `{Function} [callback]`

- **Usage:**

  Remove event listener(s).

  - If no arguments are provided, remove all event listeners;

  - If only the event is provided, remove all listeners for that event;

  - If both event and callback are given, remove the listener for that specific callback only.

<h3 id="vm-emit">vm.$emit( event, [...args] )</h3>

- **Arguments:**
  - `{String} event`
  - `[...args]`

  Trigger an event on the current instance. Any additional arguments will be passed into the listener's callback function.

<h3 id="vm-dispatch">vm.$dispatch( event, [...args] )</h3>

- **Arguments:**
  - `{String} event`
  - `[...args]`

- **Usage:**

  Dispatch an event, first triggering it on the instance itself, and then propagates upward along the parent chain. The propagation stops when it triggers a parent event listener, unless that listener returns `true`. Any additional arguments will be passed into the listener's callback function.

- **Example:**

  ``` js
  // create a parent chain
  var parent = new Vue()
  var child1 = new Vue({ parent: parent })
  var child2 = new Vue({ parent: child1 })

  parent.$on('test', function () {
    console.log('parent notified')
  })
  child1.$on('test', function () {
    console.log('child1 notified')
  })
  child2.$on('test', function () {
    console.log('child2 notified')
  })

  child2.$dispatch('test')
  // -> "child2 notified"
  // -> "child1 notified"
  // parent is NOT notified, because child1 didn't return
  // true in its callback
  ```

- **See also:** [Parent-Child Communication](/guide/components.html#Parent-Child-Communication)

<h3 id="vm-broadcast">vm.$broadcast( event, [...args] )</h3>

- **Arguments:**
  - `{String} event`
  - `[...args]`

- **Usage:**

  Broadcast an event that propagates downward to all descendants of the current instance. Since the descendants expand into multiple sub-trees, the event propagation will follow many different "paths". The propagation for each path will stop when a listener callback is fired along that path, unless the callback returns `true`.

- **Example:**

  ``` js
  var parent = new Vue()
  // child1 and child2 are siblings
  var child1 = new Vue({ parent: parent })
  var child2 = new Vue({ parent: parent })
  // child3 is nested under child2
  var child3 = new Vue({ parent: child2 })

  child1.$on('test', function () {
    console.log('child1 notified')
  })
  child2.$on('test', function () {
    console.log('child2 notified')
  })
  child3.$on('test', function () {
    console.log('child3 notified')
  })

  parent.$broadcast('test')
  // -> "child1 notified"
  // -> "child2 notified"
  // child3 is NOT notified, because child2 didn't return
  // true in its callback
  ```

## Instance Methods / DOM

<h3 id="vm-appendTo">vm.$appendTo( elementOrSelector, [callback] )</h3>

- **Arguments:**
  - `{Element | String} elementOrSelector`
  - `{Function} [callback]`

- **Returns:** `vm` - the instance itself

- **Usage:**

  Append the Vue instance's DOM element or fragment to target element. The target can be either an element or a querySelector string. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-before">vm.$before( elementOrSelector, [callback] )</h3>

- **Arguments:**
  - `{Element | String} elementOrSelector`
  - `{Function} [callback]`

- **Returns:** `vm` - the instance itself

- **Usage:**

  Insert the Vue instance's DOM element or fragment before target element. The target can be either an element or a querySelector string. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-after">vm.$after( elementOrSelector, [callback] )</h3>

- **Arguments:**
  - `{Element | String} elementOrSelector`
  - `{Function} [callback]`

- **Returns:** `vm` - the instance itself

- **Usage:**

  Insert the Vue instance's DOM element or fragment after target element. The target can be either an element or a querySelector string. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-remove">vm.$remove( [callback] )</h3>

- **Arguments:**
  - `{Function} [callback]`

- **Returns:** `vm` - the instance itself

- **Usage:**

  Remove the Vue instance's DOM element or fragment from the DOM. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-nextTick">vm.$nextTick( callback )</h3>

- **Arguments:**
  - `{Function} [callback]`

- **Usage:**

  Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update. This is the same as the global `Vue.nextTick`, except that the callback's `this` context is automatically bound to the instance calling this method.

- **Example:**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // modify data
        this.message = 'changed'
        // DOM is not updated yet
        this.$nextTick(function () {
          // DOM is now updated
          // `this` is bound to the current instance
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **See also:**
  - [Vue.nextTick](#Vue-nextTick)
  - [Async Update Queue](/guide/reactivity.html#Async-Update-Queue)

## Instance Methods / Lifecycle

<h3 id="vm-mount">vm.$mount( [elementOrSelector] )</h3>

- **Arguments:**
  - `{Element | String} [elementOrSelector]`

- **Returns:** `vm` - the instance itself

- **Usage:**

  If a Vue instance didn't receive the `el` option at instantiation, it will be in "unmounted" state, without an associated DOM element or fragment. `vm.$mount()` can be used to manually start the mounting/compilation of an unmounted Vue instance.

  If no argument is provided, the template will be created as an out-of-document fragment, and you will have to use other DOM instance methods to insert it into the document yourself. If `replace` option is set to `false`, then an empty `<div>` will be automatically created as the wrapper element.

  Calling `$mount()` on an already mounted instance will have no effect. The method returns the instance itself so you can chain other instance methods after it.

- **Example:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // create and mount to #app (will replace #app)
  new MyComponent().$mount('#app')

  // the above is the same as:
  new MyComponent({ el: '#app' })

  // or, compile off-document and append afterwards:
  new MyComponent().$mount().$appendTo('#container')
  ```

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

<h3 id="vm-destroy">vm.$destroy( [remove] )</h3>

- **Arguments:**
  - `{Boolean} [remove] - default: false`

- **Usage:**

  Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives, turn off all event listeners and, if the `remove` argument is true, remove its associated DOM element or fragment from the DOM.

  Triggers the `beforeDestroy` and `destroyed` hooks.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

## Directives

### v-text

- **Expects:** `String`

- **Details:**

  Updates the element's `textContent`.

  Internally, `{% raw %}{{ Mustache }}{% endraw %}` interpolations are also compiled as a `v-text` directive on a textNode. The directive form requires a wrapper element, but offers slightly better performance and avoids FOUC (Flash of Uncompiled Content).

- **Example:**

  ``` html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

### v-html

- **Expects:** `String`

- **Details:**

  Updates the element's `innerHTML`. The contents are inserted as plain HTML - data bindings are ignored. If you need to reuse template pieces, you should use [partials](#partial).

  Internally, `{% raw %}{{{ Mustache }}}{% endraw %}` interpolations are also compiled as a `v-html` directive using anchor nodes. The directive form requires a wrapper element, but offers slightly better performance and avoids FOUC (Flash of Uncompiled Content).

  <p class="tip">Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `v-html` on trusted content and **never** on user-provided content.</p>

- **Example:**

  ``` html
  <div v-html="html"></div>
  <!-- same as -->
  <div>{{{html}}}</div>
  ```

### v-if

- **Expects:** `*`

- **Usage:**

  Conditionally render the element based on the truthy-ness of the expression value. The element and its contained data bindings / components are destroyed and re-constructed during toggles. If the element is a `<template>` element, its content will be extracted as the conditional block.

- **See also:** [Conditional Rendering](/guide/conditional.html)

### v-show

- **Expects:** `*`

- **Usage:**

  Toggle's the element's `display` CSS property based on the truthy-ness of the expression value. Triggers transitions if present.

- **See also:** [Conditional Rendering - v-show](/guide/conditional.html#v-show)

### v-else

- **Does not expect expression**

- **Restriction:** previous sibling element must have `v-if` or `v-show`.

- **Usage:**

  Denote the "else block" for `v-if` and `v-show`.

  ``` html
  <div v-if="Math.random() > 0.5">
    Sorry
  </div>
  <div v-else>
    Not sorry
  </div>
  ```

- **See also:** [Conditional Rendering - v-else](/guide/conditional.html#v-else)
- **See also:** [Conditional Rendering - Component caveat](/guide/conditional.html#Component-caveat)

### v-for

- **Expects:** `Array | Object | Number | String`

- **Param Attributes:**
  - [`track-by`](/guide/list.html#track-by)
  - [`stagger`](/guide/transitions.html#Staggering-Transitions)
  - [`enter-stagger`](/guide/transitions.html#Staggering-Transitions)
  - [`leave-stagger`](/guide/transitions.html#Staggering-Transitions)

- **Usage:**

  Render the element or template block multiple times based on the source data. The directive's value must use the special syntax `alias (in|of) expression` to provide an alias for the current element being iterated on:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Note using `of` as the delimiter is only supported in 1.0.17+.

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ``` html
  <div v-for="(index, item) in items"></div>
  <div v-for="(key, val) in object"></div>
  ```

  The detailed usage for `v-for` is explained in the guide section linked below.

- **See also:** [List Rendering](/guide/list.html).

### v-on

- **Shorthand:** `@`

- **Expects:** `Function | Inline Statement`

- **Argument:** `event (required)`

- **Modifiers:**
  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyCode | keyAlias}` - only trigger handler on certain keys.

- **Usage:**

  Attaches an event listener to the element. The event type is denoted by the argument. The expression can either be a method name or an inline statement, or simply omitted when there are modifiers present.

  When used on a normal element, it listens to **native DOM events** only. When used on a custom element component, it also listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

  **1.0.11+** When listening the custom events, inline statements have access to the special `$arguments` property, which is an array of the additional arguments passed to the child components' `$emit` call.

- **Example:**

  ``` html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter">

  <!-- key modifier using keyCode -->
  <input @keyup.13="onEnter">
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ``` html
  <my-component @my-event="handleThis"></my-component>

  <!-- inline statement -->
  <my-component @my-event="handleThis(123, $arguments)"></my-component>
  ```

- **See also:** [Methods and Event Handling](/guide/events.html)

### v-bind

- **Shorthand:** `:`

- **Expects:** `* (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers:**
  - `.sync` - make the binding two-way. Only respected for prop bindings.
  - `.once` - make the binding one-time. Only respected for prop bindings.
  - `.camel` - convert the attribute name to camelCase when setting it. Only respected for normal attributes. Used for binding camelCase SVG attributes.

- **Usage:**

  Dynamically bind one or more attributes, or a component prop to an expression.

  When used to bind the `class` or `style` attribute, it supports additional value types such as Array or Objects. See linked guide section below for more details.

  When used for prop binding, the prop must be properly declared in the child component. Prop bindings can specify a different binding type using one of the modifiers.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Example:**

  ``` html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc">

  <!-- shorthand -->
  <img :src="imageSrc">

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop binding. "prop" must be declared in my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- two-way prop binding -->
  <my-component :prop.sync="someThing"></my-component>

  <!-- one-time prop binding -->
  <my-component :prop.once="someThing"></my-component>
  ```

- **See also:**
  - [Class and Style Bindings](/guide/class-and-style.html)
  - [Component Props](/guide/components.html#Props)

### v-model

- **Expects:** varies based on input type

- **Limited to:**
  - `<input>`
  - `<select>`
  - `<textarea>`

- **Param Attributes:**
  - [`lazy`](/guide/forms.html#lazy)
  - [`number`](/guide/forms.html#number)
  - [`debounce`](/guide/forms.html#debounce)

- **Usage:**

  Create a two-way binding on a form input element. For detailed usage, see guide section linked below.

- **See also:** [Form Input Bindings](/guide/forms.html)

### v-ref

- **Does not expect expression**

- **Limited to:** child components

- **Argument:** `id (required)`

- **Usage:**

  Register a reference to a child component on its parent for direct access. Does not expect an expression. Must provide an argument as the id to register with. The component instance will be accessible on its parent's `$refs` object.

  When used on a component together with `v-for`, the registered value will be an Array containing all the child component instances corresponding to the Array they are bound to. If the data source for `v-for` is an Object, the registered value will be an Object containing key-instance pairs mirroring the source Object.

- **Note:**

  Because HTML is case-insensitive, camelCase usage like `v-ref:someRef` will be converted to all lowercase. You can use `v-ref:some-ref` which properly sets `this.$refs.someRef`.

- **Example:**

  ``` html
  <comp v-ref:child></comp>
  <comp v-ref:some-child></comp>
  ```

  ``` js
  // access from parent:
  this.$refs.child
  this.$refs.someChild
  ```

  With `v-for`:

  ``` html
  <comp v-ref:list v-for="item in list"></comp>
  ```

  ``` js
  // this will be an array in parent
  this.$refs.list
  ```

- **See also:** [Child Component Refs](/guide/components.html#Child-Component-Refs)

### v-el

- **Does not expect expression**

- **Argument:** `id (required)`

- **Usage:**

  Register a reference to a DOM element on its owner Vue instance's `$els` object for easier access.

- **Note:**

  Because HTML is case-insensitive, camelCase usage like `v-el:someEl` will be converted to all lowercase. You can use `v-el:some-el` which properly sets `this.$els.someEl`.

- **Example:**

  ``` html
  <span v-el:msg>hello</span>
  <span v-el:other-msg>world</span>
  ```
  ``` js
  this.$els.msg.textContent // -> "hello"
  this.$els.otherMsg.textContent // -> "world"
  ```

### v-pre

- **Does not expect expression**

- **Usage**

  Skip compilation for this element and all its children. You can use this for displaying raw mustache tags. Skipping large numbers of nodes with no directives on them can also speed up compilation.

- **Example:**

  ``` html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

### v-cloak

- **Does not expect expression**

- **Usage:**

  This directive will remain on the element until the associated Vue instance finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the Vue instance is ready.

- **Example:**

  ``` css
  [v-cloak] {
    display: none;
  }
  ```

  ``` html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.

## Special Elements

### component

- **Attributes:**
  - `is`

- **Param Attributes:**
  - [`keep-alive`](/guide/components.html#keep-alive)
  - [`transition-mode`](/guide/components.html#transition-mode)

- **Usage:**

  Alternative syntax for invoking components. Primarily used for dynamic components with the `is` attribute:

  ``` html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>
  ```

- **See also:** [Dynamic Components](/guide/components.html#Dynamic-Components)

### slot

- **Attributes:**
  - `name`

- **Usage:**

  `<slot>` elements serve as content distribution outlets in component templates. The slot element itself will be replaced.

  A slot with the `name` attribute is called a named slot. A named slot will distribute content with a `slot` attribute that matches its name.

  For detailed usage, see the guide section linked below.

- **See also:** [Content Distribution with Slots](/guide/components.html#Content-Distribution-with-Slots)

### partial

- **Attributes:**
  - `name`

- **Usage:**

  `<partial>` elements serve as outlets for registered template partials. Partial contents are also compiled by Vue when inserted. The `<partial>` element itself will be replaced. It requires a `name` attribute which will be used to resolve the partial's content.

- **Example:**

  ``` js
  // registering a partial
  Vue.partial('my-partial', '<p>This is a partial! {{msg}}</p>')
  ```

  ``` html
  <!-- a static partial -->
  <partial name="my-partial"></partial>

  <!-- a dynamic partial -->
  <!-- renders partial with id === vm.partialId -->
  <partial v-bind:name="partialId"></partial>

  <!-- dynamic partial using v-bind shorthand -->
  <partial :name="partialId"></partial>
  ```

## Filters

### capitalize

- **Example:**

  ``` html
  {{ msg | capitalize }}
  ```

  *'abc' => 'Abc'*

### uppercase

- **Example:**

  ``` html
  {{ msg | uppercase }}
  ```

  *'abc' => 'ABC'*

### lowercase

- **Example:**

  ``` html
  {{ msg | lowercase }}
  ```

  *'ABC' => 'abc'*

### currency

- **Arguments:**
  - `{String} [symbol] - default: '$'`
  - **1.0.22+** `{Number} [decimal places] - default: 2`

- **Example:**

  ``` html
  {{ amount | currency }}
  ```

  *12345 => $12,345.00*

  Use a different symbol:

  ``` html
  {{ amount | currency '£' }}
  ```

  *12345 => £12,345.00*

  Some currencies have 3 or 4 decimal places, while some others have none, for example Japanese Yen (¥) or Vietnamese Dong (₫):

  ``` html
  {{ amount | currency '₫' 0 }}
  ```

  *12345 => ₫12,345*

### pluralize

- **Arguments:**
  - `{String} single, [double, triple, ...]`

- **Usage:**

  Pluralizes the argument based on the filtered value. When there is exactly one argument, plural forms simply add an "s" at the end. When there are more than one argument, the arguments will be used as array of strings corresponding to the single, double, triple ... forms of the word to be pluralized. When the number to be pluralized exceeds the length of the arguments, it will use the last entry in the array.

- **Example:**

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

- **Arguments:**
  - `{Number} [indent] - default: 2`

- **Usage:**

  Output the result of calling `JSON.stringify()` on the value instead of outputting the `toString()` value (e.g. `[object Object]`).

- **Example:**

  Print an object with 4-space indent:

  ``` html
  <pre>{{ nestedObject | json 4 }}</pre>
  ```

### debounce

- **Limited to:** directives that expect `Function` values, e.g. `v-on`

- **Arguments:**
  - `{Number} [wait] - default: 300`

- **Usage:**

  Wrap the handler to debounce it for `x` milliseconds, where `x` is the argument. Default wait time is 300ms. A debounced handler will be delayed until at least `x` ms has passed after the call moment; if the handler is called again before the delay period, the delay period is reset to `x` ms.

- **Example:**

  ``` html
  <input @keyup="onKeyup | debounce 500">
  ```

### limitBy

- **Limited to:** directives that expect `Array` values, e.g. `v-for`

- **Arguments:**
  - `{Number} limit`
  - `{Number} [offset]`

- **Usage:**

  Limit the array to the first N items, as specified by the argument. An optional second argument can be provided to set a starting offset.

  ``` html
  <!-- only display first 10 items -->
  <div v-for="item in items | limitBy 10"></div>

  <!-- display items 5 to 15 -->
  <div v-for="item in items | limitBy 10 5"></div>
  ```

### filterBy

- **Limited to:** directives that expect `Array` values, e.g. `v-for`

- **Arguments:**
  - `{String | Function} targetStringOrFunction`
  - `"in" (optional delimiter)`
  - `{String} [...searchKeys]`

- **Usage:**

  Return a filtered version of the source Array. The first argument can either be a string or a function.

  When the first argument is a string, it will be used as the target string to search for in each element of the Array:

  ``` html
  <div v-for="item in items | filterBy 'hello'">
  ```

  In the above example, only items that contain the target string `"hello"` will be displayed.

  If the item is an object, the filter will recursively search every nested property of the object for the target string. To narrow down the search scope, additional search keys can be specified:

  ``` html
  <div v-for="user in users | filterBy 'Jack' in 'name'">
  ```

  In the above example, the filter will only search for `"Jack"` in the `name` field of each user object. **It is a good idea to always limit the search scope for better performance.**

  The examples above are using static arguments - we can, of course, use dynamic arguments as target string or search keys. Combined with `v-model` we can easily implement type-ahead filtering:

  ``` html
  <div id="filter-by-example">
    <input v-model="name">
    <ul>
      <li v-for="user in users | filterBy name in 'name'">
        {{ user.name }}
      </li>
    </ul>
  </div>
  ```

  ``` js
  new Vue({
    el: '#filter-by-example',
    data: {
      name: '',
      users: [
        { name: 'Bruce' },
        { name: 'Chuck' },
        { name: 'Jackie' }
      ]
    }
  })
  ```

  {% raw %}
  <div id="filter-by-example" class="demo">
    <input v-model="name">
    <ul>
      <li v-for="user in users | filterBy name in 'name'">
        {{ user.name }}
      </li>
    </ul>
  </div>
  <script>
  new Vue({
    el: '#filter-by-example',
    data: {
      name: '',
      users: [{ name: 'Bruce' }, { name: 'Chuck' }, { name: 'Jackie' }]
    }
  })
  </script>
  {% endraw %}

- **Additional Examples:**

  Multiple search keys:

  ``` html
  <li v-for="user in users | filterBy searchText in 'name' 'phone'"></li>
  ```

  Multiple search keys with a dynamic Array argument:

  ``` html
  <!-- fields = ['fieldA', 'fieldB'] -->
  <div v-for="user in users | filterBy searchText in fields">
  ```

  Use a custom filter function:

  ``` html
  <div v-for="user in users | filterBy myCustomFilterFunction">
  ```

### orderBy

- **Limited to:** directives that expect `Array` values, e.g. `v-for`

- **Arguments:**
  - `{String | Array<String> | Function} ...sortKeys`
  - `{String} [order] - default: 1`

- **Usage:**

  Return a sorted version of the source Array. You can pass any number of Strings to sort on keys. You can also pass an array containing the sorting keys or a Function if you want to use your own sorting strategy instead. The optional `order` argument specifies whether the result should be in ascending (`order >= 0`) or descending (`order < 0`) order.

  For arrays of primitive values, simply omit `sortKeys` and provide the order, e.g. `orderBy 1`.

- **Example:**

  Sort users by name:

  ``` html
  <ul>
    <li v-for="user in users | orderBy 'name'">
      {{ user.name }}
    </li>
  </ul>
  ```

  In descending order:

  ``` html
  <ul>
    <li v-for="user in users | orderBy 'name' -1">
      {{ user.name }}
    </li>
  </ul>
  ```

  Sort primitive values:

  ``` html
  <ul>
    <li v-for="n in numbers | orderBy true">
      {{ n }}
    </li>
  </ul>
  ```

  Dynamic sort order:

  ``` html
  <div id="orderby-example">
    <button @click="order = order * -1">Reverse Sort Order</button>
    <ul>
      <li v-for="user in users | orderBy 'name' order">
        {{ user.name }}
      </li>
    </ul>
  </div>
  ```

  ``` js
  new Vue({
    el: '#orderby-example',
    data: {
      order: 1,
      users: [{ name: 'Bruce' }, { name: 'Chuck' }, { name: 'Jackie' }]
    }
  })
  ```

  Sort using two keys:

  ``` html
  <ul>
    <li v-for="user in users | orderBy 'lastName' 'firstName'">
      {{ user.lastName }} {{ user.firstName }}
    </li>
  </ul>
  ```

  {% raw %}
  <div id="orderby-example" class="demo">
    <button @click="order = order * -1">Reverse Sort Order</button>
    <ul>
      <li v-for="user in users | orderBy 'name' order">
        {{ user.name }}
      </li>
    </ul>
  </div>
  <script>
  new Vue({
    el: '#orderby-example',
    data: {
      order: 1,
      users: [{ name: 'Bruce' }, { name: 'Chuck' }, { name: 'Jackie' }]
    }
  })
  </script>
  {% endraw %}

  Sort using a Function:

  ``` html
  <div id="orderby-compare-example" class="demo">
    <button @click="order = order * -1">Reverse Sort Order</button>
    <ul>
      <li v-for="user in users | orderBy ageByTen order">
        {{ user.name }} - {{ user.age }}
      </li>
    </ul>
  </div>
  ```

  ``` js
  new Vue({
    el: '#orderby-compare-example',
    data: {
      order: 1,
      users: [
        {
          name: 'Jackie',
          age: 62
        },
        {
          name: 'Chuck',
          age: 76
        },
        {
          name: 'Bruce',
          age: 61
        }
      ]
    },
    methods: {
      ageByTen: function (a, b) {
        return Math.floor(a.age / 10) - Math.floor(b.age / 10)
      }
    }
  })
  ```

  {% raw %}
  <div id="orderby-compare-example" class="demo">
    <button @click="order = order * -1">Reverse Sort Order</button>
    <ul id="orderby-compare-example">
      <li v-for="user in users | orderBy ageByTen order">
        {{ user.name }} - {{ user.age }}
      </li>
    </ul>
  </div>
  <script>
  new Vue({
    el: '#orderby-compare-example',
    data: {
      order: 1,
      users: [
        {
          name: 'Jackie',
          age: 62
        },
        {
          name: 'Chuck',
          age: 76
        },
        {
          name: 'Bruce',
          age: 61
        }
      ]
    },
    methods: {
      ageByTen: function (a, b) {
        return Math.floor(a.age / 10) - Math.floor(b.age / 10)
      }
    }
  })
  </script>
  {% endraw %}

## Array Extension Methods

Vue.js extends `Array.prototype` with two additional methods that makes it easier to perform some common Array operations while ensuring reactive updates are properly triggered.

### array.$set(index, value)

- **Arguments**
  - `{Number} index`
  - `{*} value`

- **Usage**

  Set an element in the array to a value by index and trigger view updates.

  ``` js
  vm.animals.$set(0, { name: 'Aardvark' })
  ```

- **See also:** [Array Detection Caveats](/guide/list.html#Caveats)

### array.$remove(reference)

- **Arguments**
  - `{Reference} reference`

- **Usage**

  Remove an element from an array by reference and trigger view updates. This is a sugar method for first searching for the element in the array, and then if found, calling `array.splice(index, 1)`.

  ``` js
  var aardvark = vm.animals[0]
  vm.animals.$remove(aardvark)
  ```

- **See also:** [Mutation Methods](/guide/list.html#Mutation-Methods)
