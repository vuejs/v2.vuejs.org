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
  Vue.config.delimiters = ['{!!', '!!}']
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

  When async mode is off, Vue will perform all DOM updates synchronously upon detecting data change. This may help with debugging in some scenarios, but could also cause degraded performance and affect the order in which wathcer callbacks are called. **`async: false` is not recommended in production.**

## Global API

### Vue.extend( options )

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

### Vue.nextTick( callback )

- **Arguments:**
  - `{Functon} callback`

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

- **See also:** [Async Update Queue](/guide/reactivity.html#Async_Update_Queue)

### Vue.directive( id, [definition] )

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

### Vue.elementDirective( id, [definition] )

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

- **See also:** [Element Directives](/guide/custom-directive.html#Element_Directives)

### Vue.filter( id, [definition] )

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

### Vue.component( id, [definition] )

- **Arguments:**
  - `{String} id`
  - `{Function | Object} [definition]`

- **Usage:**

  Register or retrieve a global component.

  ``` js
  // register an extended constructor
  Vue.component('my-component', Vue.extend({ /* ... */}))

  // register an options object (automatically call Vue.extend)
  Vue.component('my-component', { /* ... */ })

  // retrive a registered component (always return constructor)
  var MyComponent = Vue.component('my-component')
  ```

- **See also:** [Components](/guide/components.html).

### Vue.transition( id, [hooks] )

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

### Vue.partial( id, [partial] )

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

### Vue.use( plugin, [options] )

- **Arguments:**
  - `{Object | Function} plugin`
  - `{Object} [options]`

- **Usage:**

  Install a Vue.js plugin. If the plugin is an Object, it must expose an `install` method. If it is a function itself, it will be treated as the install method. The install method will be called with Vue as the argument.

- **See also:** [Plugins](/guide/plugins.html).

### Vue.mixin( mixin )

- **Arguments:**
  - `{Object} mixin`

- **Usage:**

  Apply a mixin globally, which affects every Vue instance created afterwards. This can be used by plugin authors to inject custom behavior into components. **Not recommended in application code**.

- **See also:** [Global Mixins](/guide/mixins.html#Global_Mixin)

## Options / Data

### data

- **Type:** `Object | Function`

- **Restricton:** Only accepts `Function` when used in `Vue.extend()`.

- **Details:**

  The data object for the Vue instance. Vue.js will recursively convert its properties into getter/setters to make it "reactive". **The object must be plain**: native objects, existing getter/setters and prototype properties are ignored. It is not recommended to observe complex objects.

  Once the instance is created, the original data object can be accessed as `vm.$data`. The Vue instance also proxies all the properties found on the data object.

  Properties that start with `_` or `$` will **not** be proxied on the Vue instance because they may conflict with Vue's internal properties and API methods. You will have to access them as `vm.$data._property`.

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
        required: true
      }
    }
  })
  ```

- **See also:** [Props](/guide/components.html#Props)

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
  - [Reactivity in Depth: Inside Computed Properties](/guide/reactivity.html#Inside_Computed_Properties)

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

- **Restriction:** only accepts type `Function` when used in `Vue.extend()`.

- **Details:**

  Provide the Vue instance an existing DOM element to mount on. It can be a CSS selector string, an actual HTMLElement, or a function that returns an HTMLElement. Note that the provided element merely serves as a mounting point; it will be replaced if a template is also provided, unless `replace` is set to false. The resolved element will be accessible as `vm.$el`.

  When used in `Vue.extend`, a function must be provided so each instance gets a separately created element.

  If this option is available at instantiation, the instance will immediately enter compilation; otherwise, the user will have to explicitly call `vm.$mount()` to manually start the compilation.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)

### template

- **Type:** `String`

- **Details:**

  A string template to be used as the markup for the Vue instance. By default, the template will **replace** the mounted element. When the `replace` option is set to `false`, the template will be inserted into the mounted element instead. In both cases, any existing markup inside the mounted element will be ignored, unless content distribution slots are present in the template.

  If the string starts with `#` it will be used as a querySelector and use the selected element's innerHTML as the template string. This allows the use of the common `<script type="x-template">` trick to include templates.

  Note that under certain situations, for example when the template contains more than one top-level element, or contains only plain text, the instance will become a fragment instance - i.e. one that manages a list of nodes rather than a single node. Non flow-control directives on the mount point for fragment instances are ignored.

- **See also:**
  - [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)
  - [Content Distribution](/guide/components.html#Content_Distribution_with_Slots)
  - [Fragment Instance](/guide/components.html#Fragment_Instance)

### replace

- **Type:** `Boolean`  

- **Default:** `true`

- **Restriction:** only respected if the **template** option is also present.

- **Details:**

  Determines whether to replace the element being mounted on with the template. If set to `false`, the template will overwrite the element's inner content without replacing the element itself.

- **Example**:

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

### created

- **Type:** `Function`

- **Details:**
  
  Called synchronously after the instance is created. At this stage, the instance has finished processing the options which means the following have been set up: data observation, computed properties, methods, watch/event callbacks. However, DOM compilation has not been started, and the `$el` property will not be available yet.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)

### beforeCompile

- **Type:** `Function`

- **Details:**
  
  Called right before the compilation starts.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)

### compiled

- **Type:** `Function`

- **Details:**

  Called after the compilation is finished. At this stage all directives have been linked so data changes will trigger DOM updates. However, `$el` is not guaranteed to have been inserted into the document yet.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)

### ready

- **Type:** `Function`

- **Details:**

  Called after compilation **and** the `$el` is **inserted into the document for the first time**, i.e. right after the first `attached` hook. Note this insertion must be executed via Vue (with methods like `vm.$appendTo()` or as a result of a directive update) to trigger the `ready` hook.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)

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

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)

### destroyed

- **Type:** `Function`

- **Details:**

  Called after a Vue instance has been destroyed. When this hook is called, all bindings and directives of the Vue instance have been unbound and all child Vue instances have also been destroyed.

  Note if there is a leaving transition, the `destroyed` hook is called **after** the transition has finished.

- **See also:** [Lifecycle Diagram](/guide/instance.html#Lifecycle_Diagram)

## Options / Assets

### directives

- **Type:** `Object`

- **Details:**

  A hash of directives to be made available to the Vue instance.

- **See also:**
  - [Custom Directives](/guide/custom-directive.html)
  - [Assets Naming Convention](/guide/components.html#Assets_Naming_Convention)

### elementDirectives

- **Type:** `Object`

- **Details:**

  A hash of element directives to be made available to the Vue instance.

- **See also:**
  - [Element Directives](/guide/custom-directive.html#Element_Directives)
  - [Assets Naming Convention](/guide/components.html#Assets_Naming_Convention)

### filters

- **Type:** `Object`

- **Details:**

  A hash of filters to be made available to the Vue instance.

- **See also:**
  - [Custom Filters](/guide/custom-filter.html)
  - [Assets Naming Convention](/guide/components.html#Assets_Naming_Convention)

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

- **See also:** [Parent-Child Communication](/guide/components.html#Parent-Child_Communication)

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
  - [Instance Methods - Events](#Instance_Methods_/_Events)
  - [Parent-Child Communication](/guide/components.html#Parent-Child_Communication)

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

- **Restrctions:** only respected when used in `Vue.extend()`.

- **Details:**

  When inspecting an extended Vue component in the console, the default constructor name is `VueComponent`, which isn't very informative. By passing in an optional `name` option to `Vue.extend()`, you will get a better inspection output so that you know which component you are looking at. The string will be camelized and used as the component's constructor name.

- **Example:**

  ``` js
  var Ctor = Vue.extend({
    name: 'cool-stuff'
  })
  var vm = new Ctor()
  console.log(vm) // -> CoolStuff {$el: null, ...}
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

  The DOM element that the Vue instance is managing. Note that for [Fragment Instances](/guide/components.html#Fragment_Instance), `vm.$el` will return an anchor node that indicates the starting position of the fragment.

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
  - [Child Component Refs](/guide/components.html#Child_Component_Refs)
  - [v-ref](#v-ref).

### vm.$els

- **Type:** `Object`

- **Read only**

- **Details:**

  An object that holds DOM elements that have `v-el` registered.

- **See also:** [v-el](#v-el).

## Instance Methods / Data

### vm.$watch( expOrFn, callback, [options] )

- **Arguments:**
  - `{String|Function} expOrFn`
  - `{Function} callback`
  - `{Object} [options]`
    - `{Boolean} deep`
    - `{Boolean} immediate`

- **Returns:** `{Function} unwatch`

- **Usage:**

  Watch an expression or a computed function on the Vue instance for changes. The callback gets called with the new value and the old value. The expression can be a single keypath or any valid binding expressions.

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

### vm.$get( expression )

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

### vm.$set( keypath, value )

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
  vm.c // ->
  ```

- **See also:** [Reactivity in Depth](/guide/reactivity.html)

### vm.$delete( key )

- **Arguments:**
  - `{String} key`

- **Usage:**

  Delete a root level property on the Vue instance (and also its `$data`). Forces a digest cycle. Not recommended.

### vm.$eval( expression )

- **Arguments:**
  - `{String} expression`

- **Usage:**

  Evaluate a valid binding expression on the current instance. The expression can also contain filters.

- **Example:**

  ``` js
  // assuming vm.msg = 'hello'
  vm.$eval('msg | uppercase') // -> 'HELLO'
  ```

### vm.$interpolate( templateString )

- **Arguments:**
  - `{String} templateString`

- **Usage:**

  Evaluate a piece of template string containing mustache interpolations. Note that this method simply performs string interpolation; attribute directives are ignored.

- **Example:**

  ``` js
  // assuming vm.msg = 'hello'
  vm.$interpolate('{{msg}} world!') // -> 'hello world!'
  ```

### vm.$log( [keypath] )

- **Arguments:**
  - `{String} [keypath]`

- **Usage:**

  Log the current instance data as a plain object, which is more console-inspectable than a bunch of getter/setters. Also accepts an optional key.

  ``` js
  vm.$log() // logs entire ViewModel data
  vm.$log('item') // logs vm.item
  ```

## Instance Methods / Events

### vm.$on( event, callback )

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

### vm.$once( event, callback )

- **Arguments:**
  - `{String} event`
  - `{Function} callback`

- **Usage:**

  Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

### vm.$off( [event, callback] )

- **Arguments:**
  - `{String} [event]`
  - `{Function} [callback]`

- **Usage:**

  Remove event listener(s).

  - If no arguments are provided, remove all event listeners;

  - If only the event is provided, remove all listeners for that event;

  - If both event and callback are given, remove the listener for that specific callback only.

### vm.$emit( event, [...args] )

- **Arguments:**
  - `{String} event`
  - `[...args]`

  Trigger an event on the current instance. Any additional arguments will be passed into the listener's callback function.

### vm.$dispatch( event, [...args] )

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

- **See also:** [Parent-Child Communication](/guide/components.html#Parent-Child_Communication)

### vm.$broadcast( event, [...args] )

- **Arguments:**
  - `{String} event`
  - `[...args]`

- **Usage:**

  Broadcast an event that propagates downward to all descendents of the current instance. Since the descendents expand into multiple sub-trees, the event propagation will follow many different "paths". The propagation for each path will stop when a listener callback is fired along that path, unless the callback returns `true`.

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
