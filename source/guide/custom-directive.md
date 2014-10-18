title: Custom Directives
type: guide
order: 9
---

## The Basics

Vue.js allows you to register custom directives, essentially enabling you to teach Vue new tricks on how to map data changes to DOM behavior. You can register a global custom directive with the `Vue.directive(id, definition)` method, passing in a **directive id** followed by a **definition object**. A definition object can provide several hook functions (all optional):

- **bind**: called only once, when the directive is first bound to the element.
- **update**: called when the binding value changes. The new value is provided as the argument.
- **unbind**: called only once, when the directive is unbound from the element.

**Example**

``` js
Vue.directive('my-directive', {
  bind: function (value) {
    // do preparation work
    // e.g. add event listeners or expensive stuff
    // that needs to be run only once
    // `value` is the initial value
  },
  update: function (value) {
    // do something based on the updated value
    // this will also be called for the initial value
  },
  unbind: function () {
    // do clean up work
    // e.g. remove event listeners added in bind()
  }
})
```

Once registered, you can use it in Vue.js templates like this (you need to add the Vue.js prefix to it):

``` html
<div v-my-directive="someValue"></div>
```

When you only need the `update` function, you can pass in a single function instead of the definition object:

``` js
Vue.directive('my-directive', function (value) {
  // this function will be used as update()
})
```

All the hook functions will be copied into the actual **directive object**, which you can access inside these functions as their `this` context. The directive object exposes some useful properties:

- **el**: the element the directive is bound to.
- **vm**: the context ViewModel that owns this directive.
- **expression**: the expression of the binding, excluding arguments and filters.
- **arg**: the argument, if present.
- **raw**: the raw, unparsed expression.
- **name**: the name of the directive, without the prefix.

<p class="tip">You should treat all these properties as read-only and refrain from changing them. You can attach custom properties to the directive object too, but be careful not to accidentally overwrite existing internal ones.</p>

An example of a custom directive using some of these properties:

``` html
<div id="demo" v-demo="LightSlateGray : msg"></div>
```

``` js
Vue.directive('demo', {
  bind: function () {
    this.el.style.color = '#fff'
    this.el.style.backgroundColor = this.arg
  },
  update: function (value) {
    this.el.innerHTML =
      'name - '       + this.name + '<br>' +
      'raw - '        + this.raw + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - '   + this.arg + '<br>' +
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

<div id="demo" v-demo="LightSlateGray : msg"></div>
<script>
Vue.directive('demo', {
  bind: function () {
    this.el.style.color = '#fff'
    this.el.style.backgroundColor = this.arg
  },
  update: function (value) {
    this.el.innerHTML =
      'name - ' + this.name + '<br>' +
      'raw - ' + this.raw + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - ' + this.arg + '<br>' +
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

## Literal Directives

If you pass in `isLiteral: true` when creating a custom directive, the attribute value will be taken as a literal string and assigned as that directive's `expression`. The directive will not attempt to setup data observation.

Example:

``` html
<div v-literal-dir="foo"></div>
```

``` js
Vue.directive('literal-dir', {
  isLiteral: true,
  bind: function () {
    console.log(this.expression) // 'foo'
  }
})
```

However, in the case that the literal directive contains mustache tags, the directive will:

- If no `update` function is provided, the mustache expression will be evaluated only once and assigned to `this.expression`. No data observation happens.

- If an `update` function is provided, the directive **will** setup data observation for that expression and call `update` when the evaluated result changes.

## Function Directives

Vue.js encourages the developer to separate data from behavior, so instance methods are expected to be contained in the `methods` option and not inside data objects. As a result, functions inside data objects are ignored and normal directives will not be able to bind to them.

To gain access to functions inside `methods` in your custom directive, you need to pass in the `isFn` option:

``` js
Vue.directive('my-handler', {
  isFn: true, // important!
  bind: function () {
    // ...
  },
  update: function (handler) {
    // the passed in value is a function
  },
  unbind: function () {
    // ...
  }
})
```

Passing in `isFn:true` also enables your custom directive to accept inline expressions like `v-on` does. For more comprehensive examples, check out `src/directives/` in the source code.

Next: [Filters in Depth](/guide/filters.html).

## Two-way Directives

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

Next, we'll see how to [write a custom filter](/guide/custom-filter.html).