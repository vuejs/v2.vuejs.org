---
title: Custom Directives
type: guide
order: 14
---

## Basics

In addition to the default set of directives shipped in core, Vue.js also allows you to register custom directives. Custom directives provide a mechanism for mapping data changes to arbitrary DOM behavior.

You can register a global custom directive with the `Vue.directive(id, definition)` method, passing in a **directive id** followed by a **definition object**. You can also register a local custom directive by including it in a component's `directives` option.

### Hook Functions

A definition object can provide several hook functions (all optional):

- **bind**: called only once, when the directive is first bound to the element.

- **update**: called for the first time immediately after `bind` with the initial value, then again whenever the binding value changes. The new value and the previous value are provided as the argument.

- **unbind**: called only once, when the directive is unbound from the element.

**Example**

``` js
Vue.directive('my-directive', {
  bind: function () {
    // do preparation work
    // e.g. add event listeners or expensive stuff
    // that needs to be run only once
  },
  update: function (newValue, oldValue) {
    // do something based on the updated value
    // this will also be called for the initial value
  },
  unbind: function () {
    // do clean up work
    // e.g. remove event listeners added in bind()
  }
})
```

Once registered, you can use it in Vue.js templates like this (remember to add the `v-` prefix):

``` html
<div v-my-directive="someValue"></div>
```

When you only need the `update` function, you can pass in a single function instead of the definition object:

``` js
Vue.directive('my-directive', function (value) {
  // this function will be used as update()
})
```

### Directive Instance Properties

All the hook functions will be copied into the actual **directive object**, which you can access inside these functions as their `this` context. The directive object exposes some useful properties:

- **el**: the element the directive is bound to.
- **vm**: the context ViewModel that owns this directive.
- **expression**: the expression of the binding, excluding arguments and filters.
- **arg**: the argument, if present.
- **name**: the name of the directive, without the prefix.
- **modifiers**: an object containing modifiers, if any.
- **descriptor**: an object that contains the parsing result of the entire directive.
- **params**: an object containing param attributes. [Explained below](#params).

<p class="tip">You should treat all these properties as read-only and never modify them. You can attach custom properties to the directive object too, but be careful not to accidentally overwrite existing internal ones.</p>

An example of a custom directive using some of these properties:

``` html
<div id="demo" v-demo:hello.a.b="msg"></div>
```

``` js
Vue.directive('demo', {
  bind: function () {
    console.log('demo bound!')
  },
  update: function (value) {
    this.el.innerHTML =
      'name - '       + this.name + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - '   + this.arg + '<br>' +
      'modifiers - '  + JSON.stringify(this.modifiers) + '<br>' +
      'value - '      + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
```

**Result**

<div id="demo" v-demo:hello.a.b="msg"></div>
<script>
Vue.directive('demo', {
  bind: function () {
    console.log('demo bound!')
  },
  update: function (value) {
    this.el.innerHTML =
      'name - ' + this.name + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - ' + this.arg + '<br>' +
      'modifiers - '  + JSON.stringify(this.modifiers) + '<br>' +
      'value - ' + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
</script>

### Object Literals

If your directive needs multiple values, you can also pass in a JavaScript object literal. Remember, directives can take any valid JavaScript expression:

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (value) {
  console.log(value.color) // "white"
  console.log(value.text) // "hello!"
})
```

### Literal Modifier

When a directive is used with the literal modifier, its attribute value will be interpreted as a plain string and passed directly into the `update` method. The `update` method will also be called only once, because a plain string cannot be reactive.

``` html
<div v-demo.literal="foo bar baz">
```
``` js
Vue.directive('demo', function (value) {
  console.log(value) // "foo bar baz"
})
```

### Element Directives

In some cases, we may want our directive to be used in the form of a custom element rather than as an attribute. This is very similar to Angular's notion of "E" mode directives. Element directives provide a lighter-weight alternative to full-blown components (which are explained earlier in the guide). You can register a custom element directive like so:

``` js
Vue.elementDirective('my-directive', {
  // same API as normal directives
  bind: function () {
    // manipulate this.el...
  }
})
```

Then, instead of:

``` html
<div v-my-directive></div>
```

We can write:

``` html
<my-directive></my-directive>
```

Element directives cannot accept arguments or expressions, but it can read the element's attributes to determine its behavior.

A big difference from normal directives is that element directives are **terminal**, which means once Vue encounters an element directive, it will completely skip that element - only the element directive itself will be able to manipulate that element and its children.

## Advanced Options

### params

Custom directive can provide a `params` array, and the Vue compiler will automatically extract these attributes on the element that the directive is bound to. Example:

``` html
<div v-example a="hi"></div>
```
``` js
Vue.directive('example', {
  params: ['a'],
  bind: function () {
    console.log(this.params.a) // -> "hi"
  }
})
```

This API also supports dynamic attributes. The `this.params[key]` value is automatically kept up-to-date. In addition, you can specify a callback when the value has changed:

``` html
<div v-example v-bind:a="someValue"></div>
```
``` js
Vue.directive('example', {
  params: ['a'],
  paramWatchers: {
    a: function (val, oldVal) {
      console.log('a changed!')
    }
  }
})
```

<p class="tip">Note that similar to props, directive params follow the same camelCase <=> kebab case mapping between JavaScript and HTML. For example, for a param used as `disable-effect` in the template, you need to access it as `disableEffect` in JavaScript.</p>

### deep

If your custom directive is expected to be used on an Object, and it needs to trigger `update` when a nested property inside the object changes, you need to pass in `deep: true` in your directive definition.

``` html
<div v-my-directive="obj"></div>
```

``` js
Vue.directive('my-directive', {
  deep: true,
  update: function (obj) {
    // will be called when nested properties in `obj`
    // changes.
  }
})
```

### twoWay

If your directive expects to write data back to the Vue instance, you need to pass in `twoWay: true`. This option allows the use of `this.set(value)` inside the directive:

``` js
Vue.directive('example', {
  twoWay: true,
  bind: function () {
    this.handler = function () {
      // set data back to the vm.
      // If the directive is bound as v-example="a.b.c",
      // this will attempt to set `vm.a.b.c` with the
      // given value.
      this.set(this.el.value)
    }.bind(this)
    this.el.addEventListener('input', this.handler)
  },
  unbind: function () {
    this.el.removeEventListener('input', this.handler)
  }
})
```

### acceptStatement

Passing in `acceptStatement:true` enables your custom directive to accept inline statements like `v-on` does:

``` html
<div v-my-directive="a++"></div>
```

``` js
Vue.directive('my-directive', {
  acceptStatement: true,
  update: function (fn) {
    // the passed in value is a function which when called,
    // will execute the "a++" statement in the owner vm's
    // scope.
  }
})
```

Use this wisely though, because in general you want to avoid side-effects in your templates.

### terminal

> 1.0.19+

Vue compiles templates by recursively walking the DOM tree. However when it encounters a **terminal** directive, it will stop walking that element's children. The terminal directive takes over the job of compiling the element and its children. For example, `v-if` and `v-for` are both terminal directives.

Writing a custom terminal directive is an advanced topic and requires decent knowledge of Vue's compilation pipeline, but it's possible. You can specify a custom terminal directive by specifying `terminal: true`. You will also likely need to use `Vue.FragmentFactory` for partial compilation. Here's an example of a custom terminal directive that compiles and "injects" its content template to another location on the page:

``` js
var FragmentFactory = Vue.FragmentFactory
var remove = Vue.util.remove
var createAnchor = Vue.util.createAnchor

Vue.directive('inject', {
  terminal: true,
  bind: function () {
    var container = document.getElementById(this.arg)
    this.anchor = createAnchor('v-inject')
    container.appendChild(this.anchor)
    remove(this.el)
    var factory = new FragmentFactory(this.vm, this.el)
    this.frag = factory.create(this._host, this._scope, this._frag)
    this.frag.before(this.anchor)
  },
  unbind: function () {
    this.frag.remove()
    remove(this.anchor)
  }
})
```

``` html
<div id="modal"></div>
...
<div v-inject:modal>
  <h1>header</h1>
  <p>body</p>
  <p>footer</p>
</div>
```

If you want to write a custom terminal directive, it is recommend that you read through the source code of built-in terminal directives like `v-if` and `v-for` to get a better understanding of Vue internals.

### priority

You can optionally provide a priority number for your directive. If no priority is specified, a default priority will be used - `1000` for normal directives and `2000` for terminal directives. A directive with a higher priority will be processed earlier than other directives on the same element. Directives with the same priority will be processed in the order they appear in the element's attribute list, although that order is not guaranteed to be consistent in different browsers.

You can checkout the priorities for some built-in directives in the [API reference](/api/#Directives). Additionally, flow control directives `v-if` and `v-for` always have the highest priority in the compilation process.
