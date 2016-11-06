---
type: api
---

## Global Config

`Vue.config` is an object containing Vue's global configurations. You can modify its properties listed below before bootstrapping your application:

### silent

- **Type:** `boolean`

- **Default:** `false`

- **Usage:**

  ``` js
  Vue.config.silent = true
  ```

  Suppress all Vue logs and warnings.

### optionMergeStrategies

- **Type:** `{ [key: string]: Function }`

- **Default:** `{}`

- **Usage:**

  ``` js
  Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
    return child + 1
  }

  const Profile = Vue.extend({
    _my_option: 1
  })

  // Profile.options._my_option = 2
  ```

  Define custom merging strategies for options.

  The merge strategy receives the value of that option defined on the parent and child instances as the first and second arguments, respectively. The context Vue instance is passed as the third argument.

- **See also:** [Custom Option Merging Strategies](../guide/mixins.html#Custom-Option-Merge-Strategies)

### devtools

- **Type:** `boolean`

- **Default:** `true` (`false` in production builds)

- **Usage:**

  ``` js
  // make sure to set this synchronously immediately after loading Vue
  Vue.config.devtools = true
  ```

  Configure whether to allow [vue-devtools](https://github.com/vuejs/vue-devtools) inspection. This option's default value is `true` in development builds and `false` in production builds. You can set it to `true` to enable inspection for production builds.

### errorHandler

- **Type:** `Function`

- **Default:** Error is thrown in place

- **Usage:**

  ``` js
  Vue.config.errorHandler = function (err, vm) {
    // handle error
  }
  ```

  Assign a handler for uncaught errors during component render and watchers. The handler gets called with the error and the Vue instance.

  > [Sentry](https://sentry.io), an error tracking service, provides [official integration](https://sentry.io/for/vue/) using this option.

### ignoredElements

- **Type:** `Array<string>`

- **Default:** `[]`

- **Usage:**

  ``` js
  Vue.config.ignoredElements = [
    'my-custom-web-component', 'another-web-component'
  ]
  ```

  Make Vue ignore custom elements defined outside of Vue (e.g., using the Web Components APIs). Otherwise, it will throw a warning about an `Unknown custom element`, assuming that you forgot to register a global component or misspelled a component name.

### keyCodes

- **Type:** `{ [key: string]: number }`

- **Default:** `{}`

- **Usage:**

  ``` js
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    mediaPlayPause: 179
  }
  ```

  Define custom key alias(es) for v-on.

## Global API

<h3 id="Vue-extend">Vue.extend( options )</h3>

- **Arguments:**
  - `{Object} options`

- **Usage:**

  Create a "subclass" of the base Vue constructor. The argument should be an object containing component options.

  The special case to note here is the `data` option - it must be a function when used with `Vue.extend()`.

  ``` html
  <div id="mount-point"></div>
  ```

  ``` js
  // create constructor
  var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
    data: function () {
      return {
        firstName: 'Walter',
        lastName: 'White',
        alias: 'Heisenberg'
      }
    }
  })
  // create an instance of Profile and mount it on an element
  new Profile().$mount('#mount-point')
  ```

  Will result in:

  ``` html
  <p>Walter White aka Heisenberg</p>
  ```

- **See also:** [Components](../guide/components.html)

<h3 id="Vue-nextTick">Vue.nextTick( callback, [context] )</h3>

- **Arguments:**
  - `{Function} callback`
  - `{Object} [context]`

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

- **See also:** [Async Update Queue](../guide/reactivity.html#Async-Update-Queue)

<h3 id="Vue-set">Vue.set( object, key, value )</h3>

- **Arguments:**
  - `{Object} object`
  - `{string} key`
  - `{any} value`

- **Returns:** the set value.

- **Usage:**

  Set a property on an object. If the object is reactive, ensure the property is created as a reactive property and trigger view updates. This is primarily used to get around the limitation that Vue cannot detect property additions.

  **Note the object cannot be a Vue instance, or the root data object of a Vue instance.**

- **See also:** [Reactivity in Depth](../guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( object, key )</h3>

- **Arguments:**
  - `{Object} object`
  - `{string} key`

- **Usage:**

  Delete a property on an object. If the object is reactive, ensure the deletion triggers view updates. This is primarily used to get around the limitation that Vue cannot detect property deletions, but you should rarely need to use it.

  **Note the object cannot be a Vue instance, or the root data object of a Vue instance.**

- **See also:** [Reactivity in Depth](../guide/reactivity.html)

<h3 id="Vue-directive">Vue.directive( id, [definition] )</h3>

- **Arguments:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Usage:**

  Register or retrieve a global directive.

  ``` js
  // register
  Vue.directive('my-directive', {
    bind: function () {},
    inserted: function () {},
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {}
  })

  // register (simple function directive)
  Vue.directive('my-directive', function () {
    // this will be called as `bind` and `update`
  })

  // getter, return the directive definition if registered
  var myDirective = Vue.directive('my-directive')
  ```

- **See also:** [Custom Directives](../guide/custom-directive.html)

<h3 id="Vue-filter">Vue.filter( id, [definition] )</h3>

- **Arguments:**
  - `{string} id`
  - `{Function} [definition]`

- **Usage:**

  Register or retrieve a global filter.

  ``` js
  // register
  Vue.filter('my-filter', function (value) {
    // return processed value
  })

  // getter, return the filter if registered
  var myFilter = Vue.filter('my-filter')
  ```

<h3 id="Vue-component">Vue.component( id, [definition] )</h3>

- **Arguments:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Usage:**

  Register or retrieve a global component. Registration also automatically sets the component's `name` with the given `id`.

  ``` js
  // register an extended constructor
  Vue.component('my-component', Vue.extend({ /* ... */ }))

  // register an options object (automatically call Vue.extend)
  Vue.component('my-component', { /* ... */ })

  // retrieve a registered component (always return constructor)
  var MyComponent = Vue.component('my-component')
  ```

- **See also:** [Components](../guide/components.html)

<h3 id="Vue-use">Vue.use( plugin )</h3>

- **Arguments:**
  - `{Object | Function} plugin`

- **Usage:**

  Install a Vue.js plugin. If the plugin is an Object, it must expose an `install` method. If it is a function itself, it will be treated as the install method. The install method will be called with Vue as the argument.

  When this method is called on the same plugin multiple times, the plugin will be installed only once.

- **See also:** [Plugins](../guide/plugins.html)

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **Arguments:**
  - `{Object} mixin`

- **Usage:**

  Apply a mixin globally, which affects every Vue instance created afterwards. This can be used by plugin authors to inject custom behavior into components. **Not recommended in application code**.

- **See also:** [Global Mixins](../guide/mixins.html#Global-Mixin)

<h3 id="Vue-compile">Vue.compile( template )</h3>

- **Arguments:**
  - `{string} template`

- **Usage:**

  Compiles a template string into a render function. **Only available in the standalone build.**

  ``` js
  var res = Vue.compile('<div><span>{{ msg }}</span></div>')

  new Vue({
    data: {
      msg: 'hello'
    },
    render: res.render,
    staticRenderFns: res.staticRenderFns
  })
  ```

- **See also:** [Render Functions](../guide/render-function.html)

## Options / Data

### data

- **Type:** `Object | Function`

- **Restriction:** Only accepts `Function` when used in a component definition.

- **Details:**

  The data object for the Vue instance. Vue will recursively convert its properties into getter/setters to make it "reactive". **The object must be plain**: native objects such as browser API objects and prototype properties are ignored. A rule of thumb is that data should just be data - it is not recommended to observe objects with its own stateful behavior.

  Once observed, you can no longer add reactive properties to the root data object. It is therefore recommended to declare all root-level reactive properties upfront, before creating the instance.

  After the instance is created, the original data object can be accessed as `vm.$data`. The Vue instance also proxies all the properties found on the data object, so `vm.a` will be equivalent to `vm.$data.a`.

  Properties that start with `_` or `$` will **not** be proxied on the Vue instance because they may conflict with Vue's internal properties and API methods. You will have to access them as `vm.$data._property`.

  When defining a **component**, `data` must be declared as a function that returns the initial data object, because there will be many instances created using the same definition. If we still use a plain object for `data`, that same object will be **shared by reference** across all instances created! By providing a `data` function, every time a new instance is created, we can simply call it to return a fresh copy of the initial data.

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

  <p class="tip">Note that __you should not use an arrow function with the `data` property__ (e.g. `data: () => { return { a: this.myProp }}`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.myProp` will be undefined.</p>

- **See also:** [Reactivity in Depth](../guide/reactivity.html)

### props

- **Type:** `Array<string> | Object`

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
      height: Number,
      // type check plus other validations
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: function (value) {
          return value >= 0
        }
      }
    }
  })
  ```

- **See also:** [Props](../guide/components.html#Props)

### propsData

- **Type:** `{ [key: string]: any }`

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

- **Type:** `{ [key: string]: Function | { get: Function, set: Function } }`

- **Details:**

  Computed properties to be mixed into the Vue instance. All getters and setters have their `this` context automatically bound to the Vue instance.

  <p class="tip">Note that __you should not use an arrow function to define a computed property__ (e.g. `aDouble: () => this.a * 2`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.a` will be undefined.</p>

  Computed properties are cached, and only re-computed on reactive dependency changes.

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
  - [Computed Properties](../guide/computed.html)

### methods

- **Type:** `{ [key: string]: Function }`

- **Details:**

  Methods to be mixed into the Vue instance. You can access these methods directly on the VM instance, or use them in directive expressions. All methods will have their `this` context automatically bound to the Vue instance.

  <p class="tip">Note that __you should not use an arrow function to define a method__ (e.g. `plus: () => this.a++`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.a` will be undefined.</p>

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

- **See also:** [Methods and Event Handling](../guide/events.html)

### watch

- **Type:** `{ [key: string]: string | Function | Object }`

- **Details:**

  An object where keys are expressions to watch and values are the corresponding callbacks. The value can also be a string of a method name, or an Object that contains additional options. The Vue instance will call `$watch()` for each entry in the object at instantiation.

- **Example:**

  ``` js
  var vm = new Vue({
    data: {
      a: 1,
      b: 2,
      c: 3
    },
    watch: {
      a: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
      // string method name
      b: 'someMethod',
      // deep watcher
      c: {
        handler: function (val, oldVal) { /* ... */ },
        deep: true
      }
    }
  })
  vm.a = 2 // -> new: 2, old: 1
  ```

  <p class="tip">Note that __you should not use an arrow function to define a watcher__ (e.g. `searchQuery: newValue => this.updateAutocomplete(newValue)`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.updateAutocomplete` will be undefined.</p>

- **See also:** [Instance Methods - vm.$watch](#vm-watch)

## Options / DOM

### el

- **Type:** `string | HTMLElement`

- **Restriction:** only respected in instance creation via `new`.

- **Details:**

  Provide the Vue instance an existing DOM element to mount on. It can be a CSS selector string or an actual HTMLElement.

  After the instance is mounted, the resolved element will be accessible as `vm.$el`.

  If this option is available at instantiation, the instance will immediately enter compilation; otherwise, the user will have to explicitly call `vm.$mount()` to manually start the compilation.

  <p class="tip">The provided element merely serves as a mounting point. Unlike in Vue 1.x, the mounted element will be replaced with Vue-generated DOM in all cases. It is therefore not recommended to mount the root instance to `<html>` or `<body>`.</p>

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### template

- **Type:** `string`

- **Details:**

  A string template to be used as the markup for the Vue instance. The template will **replace** the mounted element. Any existing markup inside the mounted element will be ignored, unless content distribution slots are present in the template.

  If the string starts with `#` it will be used as a querySelector and use the selected element's innerHTML as the template string. This allows the use of the common `<script type="x-template">` trick to include templates.

  <p class="tip">From a security perspective, you should only use Vue templates that you can trust. Never use user-generated content as your template.</p>

- **See also:**
  - [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)
  - [Content Distribution](../guide/components.html#Content-Distribution-with-Slots)

### render

  - **Type:** `Function`

  - **Details:**

    An alternative to string templates allowing you to leverage the full programmatic power of JavaScript. The render function receives a `createElement` method as it's first argument used to create `VNode`s.

    If the component is a functional component, the render function also receives an extra argument `context`, which provides access to contextual data since functional components are instance-less.

  - **See also:**
    - [Render Functions](../guide/render-function)

## Options / Lifecycle Hooks

All lifecycle hooks automatically have their `this` context bound to the instance, so that you can access data, computed properties, and methods. This means __you should not use an arrow function to define a lifecycle method__ (e.g. `created: () => this.fetchTodos()`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.fetchTodos` will be undefined.

### beforeCreate

- **Type:** `Function`

- **Details:**

  Called synchronously after the instance has just been initialized, before data observation and event/watcher setup.

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### created

- **Type:** `Function`

- **Details:**

  Called synchronously after the instance is created. At this stage, the instance has finished processing the options which means the following have been set up: data observation, computed properties, methods, watch/event callbacks. However, the mounting phase has not been started, and the `$el` property will not be available yet.

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### beforeMount

- **Type:** `Function`

- **Details:**

  Called right before the mounting begins: the `render` function is about to be called for the first time.

  **This hook is not called during server-side rendering.**

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### mounted

- **Type:** `Function`

- **Details:**

  Called after the instance has just been mounted where `el` is replaced by the newly created `vm.$el`. If the root instance is mounted to an in-document element, `vm.$el` will also be in-document when `mounted` is called.

  **This hook is not called during server-side rendering.**

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### beforeUpdate

- **Type:** `Function`

- **Details:**

  Called when the data changes, before the virtual DOM is re-rendered and patched.

  You can perform further state changes in this hook and they will not trigger additional re-renders.

  **This hook is not called during server-side rendering.**

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### updated

- **Type:** `Function`

- **Details:**

  Called after a data change causes the virtual DOM to be re-rendered and patched.

  The component's DOM will be in updated state when this hook is called, so you can perform DOM-dependent operations in this hook. However, in most cases you should avoid changing state in this hook, because it may lead to an infinite update loop.

  **This hook is not called during server-side rendering.**

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### activated

- **Type:** `Function`

- **Details:**

  Called when a kept-alive component is activated.

  **This hook is not called during server-side rendering.**

- **See also:**
  - [Built-in Components - keep-alive](#keep-alive)
  - [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### deactivated

- **Type:** `Function`

- **Details:**

  Called when a kept-alive component is deactivated.

  **This hook is not called during server-side rendering.**

- **See also:**
  - [Built-in Components - keep-alive](#keep-alive)
  - [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### beforeDestroy

- **Type:** `Function`

- **Details:**

  Called right before a Vue instance is destroyed. At this stage the instance is still fully functional.

  **This hook is not called during server-side rendering.**

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

### destroyed

- **Type:** `Function`

- **Details:**

  Called after a Vue instance has been destroyed. When this hook is called, all directives of the Vue instance have been unbound, all event listeners have been removed, and all child Vue instances have also been destroyed.

  **This hook is not called during server-side rendering.**

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

## Options / Assets

### directives

- **Type:** `Object`

- **Details:**

  A hash of directives to be made available to the Vue instance.

- **See also:**
  - [Custom Directives](../guide/custom-directive.html)
  - [Assets Naming Convention](../guide/components.html#Assets-Naming-Convention)

### filters

- **Type:** `Object`

- **Details:**

  A hash of filters to be made available to the Vue instance.

- **See also:**
  - [`Vue.filter`](#Vue-filter)

### components

- **Type:** `Object`

- **Details:**

  A hash of components to be made available to the Vue instance.

- **See also:**
  - [Components](../guide/components.html)

## Options / Misc

### parent

- **Type:** `Vue instance`

- **Details:**

  Specify the parent instance for the instance to be created. Establishes a parent-child relationship between the two. The parent will be accessible as `this.$parent` for the child, and the child will be pushed into the parent's `$children` array.

  <p class="tip">Use `$parent` and `$children` sparringly - they mostly serve as an escape-hatch. Prefer using props and events for parent-child communication.</p>

### mixins

- **Type:** `Array<Object>`

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

- **See also:** [Mixins](../guide/mixins.html)

### name

- **Type:** `string`

- **Restriction:** only respected when used as a component option.

- **Details:**

  Allow the component to recursively invoke itself in its template. Note that when a component is registered globally with `Vue.component()`, the global ID is automatically set as its name.

  Another benefit of specifying a `name` option is debugging. Named components result in more helpful warning messages. Also, when inspecting an app in the [vue-devtools](https://github.com/vuejs/vue-devtools), unnamed components will show up as `<AnonymousComponent>`, which isn't very informative. By providing the `name` option, you will get a much more informative component tree.

### extends

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

### delimiters

- **Type:** `Array<string>`

- **default:** `{% raw %}["{{", "}}"]{% endraw %}`

- **Details:**

  Change the plain text interpolation delimiters. **This option is only available in the standalone build.**

- **Example:**

  ``` js
  new Vue({
    delimiters: ['${', '}']
  })

  // Delimiters changed to ES6 template string style
  ```

### functional

- **Type:** `boolean`

- **Details:**

  Causes a component to be stateless (no `data`) and instanceless (no `this` context). They are simply a `render` function that returns virtual nodes making them much cheaper to render.

- **See also:** [Functional Components](../guide/render-function.html#Functional-Components)

## Instance Properties

### vm.$data

- **Type:** `Object`

- **Details:**

  The data object that the Vue instance is observing. The Vue instance proxies access to the properties on its data object.

- **See also:** [Options - data](#data)

### vm.$el

- **Type:** `HTMLElement`

- **Read only**

- **Details:**

  The root DOM element that the Vue instance is managing.

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

  The direct child components of the current instance. **Note there's no order guarantee for `$children`, and it is not reactive.** If you find yourself trying to use `$children` for data binding, consider using an Array and `v-for` to generate child components, and use the Array as the source of truth.

### vm.$slots

- **Type:** `Object`

- **Read only**

- **Details:**

  Used to access content [distributed by slots](../guide/components.html#Content-Distribution-with-Slots). Each [named slot](../guide/components.html#Named-Slots) has its own corresponding property (e.g. the contents of `slot="foo"` will be found at `vm.$slots.foo`). The `default` property contains any nodes not included in a named slot.

  Accessing `vm.$slots` is most useful when writing a component with a [render function](../guide/render-function.html).

- **Example:**

  ```html
  <blog-post>
    <h1 slot="header">
      About Me
    </h1>

    <p>Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.</p>

    <p slot="footer">
      Copyright 2016 Evan You
    </p>

    <p>If I have some content down here, it will also be included in vm.$slots.default.</p>.
  </blog-post>
  ```

  ```js
  Vue.component('blog-post', {
    render: function (createElement) {
      var header = this.$slots.header
      var body   = this.$slots.default
      var footer = this.$slots.footer
      return createElement('div', [
        createElement('header', header)
        createElement('main', body)
        createElement('footer', footer)
      ])
    }
  })
  ```

- **See also:**
  - [`<slot>` Component](#slot)
  - [Content Distribution with Slots](../guide/components.html#Content-Distribution-with-Slots)
  - [Render Functions](../guide/render-function.html)

### vm.$refs

- **Type:** `Object`

- **Read only**

- **Details:**

  An object that holds child components that have `ref` registered.

- **See also:**
  - [Child Component Refs](../guide/components.html#Child-Component-Refs)
  - [ref](#ref)

### vm.$isServer

- **Type:** `boolean`

- **Read only**

- **Details:**

  Whether the current Vue instance is running on the server.

- **See also:** [Server-Side Rendering](../guide/ssr.html)

## Instance Methods / Data

<h3 id="vm-watch">vm.$watch( expOrFn, callback, [options] )</h3>

- **Arguments:**
  - `{string | Function} expOrFn`
  - `{Function} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **Returns:** `{Function} unwatch`

- **Usage:**

  Watch an expression or a computed function on the Vue instance for changes. The callback gets called with the new value and the old value. The expression only accepts simple dot-delimited paths. For more complex expression, use a function instead.

<p class="tip">Note: when mutating (rather than replacing) an Object or an Array, the old value will be the same as new value because they reference the same Object/Array. Vue doesn't keep a copy of the pre-mutate value.</p>

- **Example:**

  ``` js
  // keypath
  vm.$watch('a.b.c', function (newVal, oldVal) {
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

<h3 id="vm-set">vm.$set( object, key, value )</h3>

- **Arguments:**
  - `{Object} object`
  - `{string} key`
  - `{any} value`

- **Returns:** the set value.

- **Usage:**

  This is the **alias** of the global `Vue.set`.

- **See also:** [Vue.set](#Vue-set)

<h3 id="vm-delete">vm.$delete( object, key )</h3>

- **Arguments:**
  - `{Object} object`
  - `{string} key`

- **Usage:**

  This is the **alias** of the global `Vue.delete`.

- **See also:** [Vue.delete](#Vue-delete)

## Instance Methods / Events

<h3 id="vm-on">vm.$on( event, callback )</h3>

- **Arguments:**
  - `{string} event`
  - `{Function} callback`

- **Usage:**

  Listen for a custom event on the current vm. Events can be triggered by `vm.$emit`. The callback will receive all the additional arguments passed into these event-triggering methods.

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
  - `{string} event`
  - `{Function} callback`

- **Usage:**

  Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

<h3 id="vm-off">vm.$off( [event, callback] )</h3>

- **Arguments:**
  - `{string} [event]`
  - `{Function} [callback]`

- **Usage:**

  Remove event listener(s).

  - If no arguments are provided, remove all event listeners;

  - If only the event is provided, remove all listeners for that event;

  - If both event and callback are given, remove the listener for that specific callback only.

<h3 id="vm-emit">vm.$emit( event, [...args] )</h3>

- **Arguments:**
  - `{string} event`
  - `[...args]`

  Trigger an event on the current instance. Any additional arguments will be passed into the listener's callback function.

## Instance Methods / Lifecycle

<h3 id="vm-mount">vm.$mount( [elementOrSelector] )</h3>

- **Arguments:**
  - `{Element | string} [elementOrSelector]`
  - `{boolean} [hydrating]`

- **Returns:** `vm` - the instance itself

- **Usage:**

  If a Vue instance didn't receive the `el` option at instantiation, it will be in "unmounted" state, without an associated DOM element. `vm.$mount()` can be used to manually start the mounting of an unmounted Vue instance.

  If `elementOrSelector` argument is not provided, the template will be rendered as an off-document element, and you will have to use native DOM API to insert it into the document yourself.

  The method returns the instance itself so you can chain other instance methods after it.

- **Example:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // create and mount to #app (will replace #app)
  new MyComponent().$mount('#app')

  // the above is the same as:
  new MyComponent({ el: '#app' })

  // or, render off-document and append afterwards:
  var component = new MyComponent().$mount()
  document.getElementById('app').appendChild(component.$el)
  ```

- **See also:**
  - [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)
  - [Server-Side Rendering](../guide/ssr.html)

<h3 id="vm-forceUpdate">vm.$forceUpdate()</h3>

- **Usage:**

  Force the Vue instance to re-render. Note it does not affect all child components, only the instance itself and child components with inserted slot content.

<h3 id="vm-nextTick">vm.$nextTick( callback )</h3>

- **Arguments:**
  - `{Function} callback`

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
  - [Async Update Queue](../guide/reactivity.html#Async-Update-Queue)

<h3 id="vm-destroy">vm.$destroy()</h3>

- **Usage:**

  Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives, turn off all event listeners.

  Triggers the `beforeDestroy` and `destroyed` hooks.

  <p class="tip">In normal use cases you shouldn't have to call this method yourself. Prefer controlling the lifecycle of child components in a data-driven fashion using `v-if` and `v-for`.</p>

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

## Directives

### v-text

- **Expects:** `string`

- **Details:**

  Updates the element's `textContent`. If you need to update the part of `textContent`, you should use `{% raw %}{{ Mustache }}{% endraw %}` interpolations.

- **Example:**

  ```html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **See also:** [Data Binding Syntax - interpolations](../guide/syntax.html#Text)

### v-html

- **Expects:** `string`

- **Details:**

  Updates the element's `innerHTML`. **Note that the contents are inserted as plain HTML - they will not be compiled as Vue templates**. If you find yourself trying to compose templates using `v-html`, try to rethink the solution by using components instead.

  <p class="tip">Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `v-html` on trusted content and **never** on user-provided content.</p>

- **Example:**

  ```html
  <div v-html="html"></div>
  ```
- **See also:** [Data Binding Syntax - interpolations](../guide/syntax.html#Raw-HTML)

### v-if

- **Expects:** `any`

- **Usage:**

  Conditionally render the element based on the truthy-ness of the expression value. The element and its contained directives / components are destroyed and re-constructed during toggles. If the element is a `<template>` element, its content will be extracted as the conditional block.

  This directive triggers transitions when its condition changes.

- **See also:** [Conditional Rendering - v-if](../guide/conditional.html)

### v-show

- **Expects:** `any`

- **Usage:**

  Toggle's the element's `display` CSS property based on the truthy-ness of the expression value.

  This directive triggers transitions when its condition changes.

- **See also:** [Conditional Rendering - v-show](../guide/conditional.html#v-show)

### v-else

- **Does not expect expression**

- **Restriction:** previous sibling element must have `v-if`.

- **Usage:**

  Denote the "else block" for `v-if`.

  ```html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **See also:**
  - [Conditional Rendering - v-else](../guide/conditional.html#v-else)

### v-for

- **Expects:** `Array | Object | number | string`

- **Usage:**

  Render the element or template block multiple times based on the source data. The directive's value must use the special syntax `alias in expression` to provide an alias for the current element being iterated on:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  The default behavior of `v-for` will try to patch the elements in-place without moving them. To force it to reorder elements, you need to provide an ordering hint with the `key` special attribute:

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  The detailed usage for `v-for` is explained in the guide section linked below.

- **See also:**
  - [List Rendering](../guide/list.html)
  - [key](../guide/list.html#key)

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
  - `.native` - listen for a native event on the root element of component.

- **Usage:**

  Attaches an event listener to the element. The event type is denoted by the argument. The expression can either be a method name or an inline statement, or simply omitted when there are modifiers present.

  When used on a normal element, it listens to **native DOM events** only. When used on a custom element component, it also listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

- **Example:**

  ```html
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

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- inline statement -->
  <my-component @my-event="handleThis(123, $event)"></my-component>

  <!-- native event on component -->
  <my-component @click.native="onClick"></my-component>
  ```

- **See also:**
  - [Methods and Event Handling](../guide/events.html)
  - [Components - Custom Events](../guide/components.html#Custom-Events)

### v-bind

- **Shorthand:** `:`

- **Expects:** `any (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers:**
  - `.prop` - Used for binding DOM attributes.

- **Usage:**

  Dynamically bind one or more attributes, or a component prop to an expression.

  When used to bind the `class` or `style` attribute, it supports additional value types such as Array or Objects. See linked guide section below for more details.

  When used for prop binding, the prop must be properly declared in the child component.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Example:**

  ```html
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

  <!-- DOM attribute binding with prop modifier -->
  <div v-bind:text-content.prop="text"></div>

  <!-- prop binding. "prop" must be declared in my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

- **See also:**
  - [Class and Style Bindings](../guide/class-and-style.html)
  - [Components - Component Props](../guide/components.html#Props)

### v-model

- **Expects:** varies based on value of form inputs element or output of components

- **Limited to:**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **Modifiers:**
  - [`.lazy`](../guide/forms.html#lazy) - listen to `change` events instead of `input`
  - [`.number`](../guide/forms.html#number) - cast input string to numbers
  - [`.trim`](/guild/forms.html#trim) - trim input

- **Usage:**

  Create a two-way binding on a form input element or a component. For detailed usage, see guide section linked below.

- **See also:**
  - [Form Input Bindings](../guide/forms.html)
  - [Components - Form Input Components using Custom Events](../guide/components.html#Form-Input-Components-using-Custom-Events)

### v-pre

- **Does not expect expression**

- **Usage:**

  Skip compilation for this element and all its children. You can use this for displaying raw mustache tags. Skipping large numbers of nodes with no directives on them can also speed up compilation.

- **Example:**

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
   ```

### v-cloak

- **Does not expect expression**

- **Usage:**

  This directive will remain on the element until the associated Vue instance finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the Vue instance is ready.

- **Example:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.

### v-once

- **Does not expect expression**

- **Details:**

  Render the element and component **once** only. On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  <!-- v-for directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

- **See also:**
  - [Data Binding Syntax - interpolations](../guide/syntax.html#Text)
  - [Components - Cheap Static Components with v-once](../guide/components.html#Cheap-Static-Components-with-v-once)

## Special Attributes

### key

- **Expects:** `string`

  The `key` special attribute is primarily used as a hint for Vue's virtual DOM algorithm to identify VNodes when diffing the new list of nodes against the old list. Without keys, Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed/destroyed.

  Children of the same common parent must have **unique keys**. Duplicate keys will cause render errors.

  The most common use case is combined with `v-for`:

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  It can also be used to force replacement of an element/component instead of reusing it. This can be useful when you want to:

  - Properly trigger lifecycle hooks of a component
  - Trigger transitions

  For example:

  ``` html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  When `text` changes, the `<span>` will always be replaced instead of patched, so a transition will be triggered.

### ref

- **Expects:** `string`

  `ref` is used to register a reference to an element or a child component. The reference will be registered under the parent component's `$refs` object. If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be component instance:

  ``` html
  <!-- vm.$refs.p will the DOM node -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child will be the child comp instance -->
  <child-comp ref="child"></child-comp>
  ```

  When used on elements/components with `v-for`, the registered reference will be an Array containing DOM nodes or component instances.

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you cannot access them on the initial render - they don't exist yet! `$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **See also:** [Child Component Refs](../guide/components.html#Child-Component-Refs)

### slot

- **Expects:** `string`

  Used on content inserted into child components to indicate which named slot the content belongs to.

  For detailed usage, see the guide section linked below.

- **See also:** [Named Slots](../guide/components.html#Named-Slots)

## Built-In Components

### component

- **Props:**
  - `is` - string | ComponentDefinition | ComponentConstructor
  - `inline-template` - boolean

- **Usage:**

  A "meta component" for rendering dynamic components. The actual component to render is determined by the `is` prop:

  ```html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>

  <!-- can also render registered component or component passed as prop -->
  <component :is="$options.components.child"></component>
  ```

- **See also:** [Dynamic Components](../guide/components.html#Dynamic-Components)

### transition

- **Props:**
  - `name` - string, Used to automatically generate transition CSS class names. e.g. `name: 'fade'` will auto expand to `.fade-enter`, `.fade-enter-active`, etc. Defaults to `"v"`.
  - `appear` - boolean, Whether to apply transition on initial render. Defaults to `false`.
  - `css` - boolean, Whether to apply CSS transition classes. Defaults to `true`. If set to `false`, will only trigger JavaScript hooks registered via component events.
  - `type` - string, Specify the type of transition events to wait for to determine transition end timing. Available values are `"transition"` and `"animation"`. By default, it will automatically detect the type that has a longer duration.
  - `mode` - string, Controls the timing sequence of leaving/entering transitions. Available modes are `"out-in"` and `"in-out"`; defaults to simultaneous.
  - `enter-class` - string
  - `leave-class` - string
  - `enter-active-class` - string
  - `leave-active-class` - string
  - `appear-class` - string
  - `appear-active-class` - string

- **Events:**
  - `before-enter`
  - `enter`
  - `after-enter`
  - `before-leave`
  - `leave`
  - `after-leave`
  - `before-appear`
  - `appear`
  - `after-appear`

- **Usage:**

  `<transition>` serve as transition effects for **single** element/component. The `<transition>` does not render an extra DOM element, nor does it show up in the inspected component hierarchy. It simply applies the transition behavior to the wrapped content inside.

  ```html
  <!-- simple element -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- dynamic component -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- event hooking -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">toggled content</div>
    </transition>
  </div>
  ```

  ``` js
  new Vue({
    ...
    methods: {
      transitionComplete: function (el) {
        // for passed 'el' that DOM element as the argument, something ...
      }
    }
    ...
  }).$mount('#transition-demo')
  ```

- **See also:** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### transition-group

- **Props:**
  - `tag` - string, defaults to `span`.
  - `move-class` - overwrite CSS class applied during moving transition.
  - exposes the same props as `<transition>` except `mode`.

- **Events:**
  - exposes the same events as `<transition>`.

- **Usage:**

  `<transition-group>` serve as transition effects for **multiple** elements/components. The `<transition-group>` renders a real DOM element. By default it renders a `<span>`, and you can configure what element is should render via the `tag` attribute.

  Note every child in a `<transition-group>` must be **uniquely keyed** for the animations to work properly.

  `<transition-group>` supports moving transitions via CSS transform. When a child's position on screen has changed after an updated, it will get applied a moving CSS class (auto generated from the `name` attribute or configured with the `move-class` attribute). If the CSS `transform` property is "transition-able" when the moving class is applied, the element will be smoothly animated to its destination using the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **See also:** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### keep-alive

- **Usage:**

  When wrapped around a dynamic component, `<keep-alive>` caches the inactive component instances without destroying them. Similar to `<transition>`, `<keep-alive>` is an abstract component: it doesn't render a DOM element itself, and doesn't show up in the component parent chain.

  When a component is toggled inside `<keep-alive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly.

  Primarily used with preserve component state or avoid re-rendering.

  ```html
  <!-- basic -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- multiple conditional children -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- used together with <transition> -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  <p class="tip">`<keep-alive>` does not work with functional components because they do not have instances to be cached.</p>

- **See also:** [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### slot

- **Props:**
  - `name` - string, Used for named slot.

- **Usage:**

  `<slot>` serve as content distribution outlets in component templates. `<slot>` itself will be replaced.

  For detailed usage, see the guide section linked below.

- **See also:** [Content Distribution with Slots](../guide/components.html#Content-Distribution-with-Slots)

## VNode Interface

- Please refer to the [VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js).

## Server-Side Rendering

- Please refer to the [vue-server-renderer package documentation](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer).
