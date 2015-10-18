---
title: Component Options
type: api
order: 2
---

## Data

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

## DOM

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

## Lifecycle

All lifecycle hooks have their `this` context bound to the Vue instance they belong to. The Vue instance will also fire corresponding events for each hook in the form of `"hook:<hookName>"`. e.g. for `created`, a `"hook:created"` event will be fired.

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

## Assets

These are private assets that will be available only to this Vue instance and its children during compilation.

### Asset Naming Convention

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

## Others

### inherit

- **Type:** `Boolean`
- **Default:** `false`

Whether to inherit parent scope data. Set it to `true` if you want to create a component that inherits parent scope. When `inherit` is set to `true`, you can:

1. Bind to parent scope properties in the component template;
2. Directly access parent properties on the component instance itself, via prototypal inheritance.

One important thing to know when using `inherit: true` is that **the child can also set parent properties**, because all Vue instance data properties are getter/setters.

**Example:**

``` js
var parent = new Vue({
  data: { a: 1 }
})
var child = parent.$addChild({
  inherit: true,
  data: { b: 2 }
})
child.a  // -> 1
child.b  // -> 2
// the following line modifies parent.a
// instead of creating a new property on child:
child.a = 2
parent.a // -> 2
```

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
