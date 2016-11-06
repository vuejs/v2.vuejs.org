---
title: Custom Directives
type: guide
order: 16
---

## Intro

In addition to the default set of directives shipped in core (`v-model` and `v-show`), Vue also allows you to register your own custom directives. Note that in Vue 2.0, the primary form of code reuse and abstraction is components - however there may be cases where you just need some low-level DOM access on plain elements, and this is where custom directives would still be useful. An example would be focusing on an input element, like this one:

{% raw %}
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
{% endraw %}

When the page loads, that element gains focus. In fact, if you haven't clicked on anything else since visiting this page, the input above should be focused now. Now let's build the directive that accomplishes this:

``` js
// Register a global custom directive called v-focus
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})
```

If you want to register a directive locally instead, components also accept a `directives` option:

``` js
directives: {
  focus: {
    // directive definition
  }
}
```

Then in a template, you can use the new `v-focus` attribute on any element, like this:

``` html
<input v-focus>
```

## Hook Functions

A directive definition object can provide several hook functions (all optional):

- `bind`: called only once, when the directive is first bound to the element. This is where you can do one-time setup work.

- `inserted`: called when the bound element has been inserted into its parent node (this only guarantees parent node presence, not necessarily in-document).

- `update`: called after the containing component has updated, __but possibly before its children have updated__. The directive's value may or may not have changed, but you can skip unnecessary updates by comparing the binding's current and old values (see below on hook arguments).

- `componentUpdated`: called after the containing component __and its children__ have updated.

- `unbind`: called only once, when the directive is unbound from the element.

We'll explore the arguments passed into these hooks (i.e. `el`, `binding`, `vnode`, and `oldVnode`) in the next section.

## Directive Hook Arguments

Directive hooks are passed these arguments:

- **el**: The element the directive is bound to. This can be used to directly manipulate the DOM.
- **binding**: An object containing the following properties.
  - **name**: The name of the directive, without the `v-` prefix.
  - **value**: The value passed to the directive. For example in `v-my-directive="1 + 1"`, the value would be `2`.
  - **oldValue**: The previous value, only available in `update` and `componentUpdated`. It is available whether or not the value has changed.
  - **expression**: The expression of the binding as a string. For example in `v-my-directive="1 + 1"`, the expression would be `"1 + 1"`.
  - **arg**: The argument passed to the directive, if any. For example in `v-my-directive:foo`, the arg would be `"foo"`.
  - **modifiers**: An object containing modifiers, if any. For example in `v-my-directive.foo.bar`, the modifiers object would be `{ foo: true, bar: true }`.
- **vnode**: The virtual node produced by Vue's compiler. See the [VNode API](../api/#VNode-Interface) for full details.
- **oldVnode**: The previous virtual node, only available in the `update` and `componentUpdated` hooks.

<p class="tip">Apart from `el`, you should treat these arguments as read-only and never modify them. If you need to share information across hooks, it is recommended to do so through element's [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).</p>

An example of a custom directive using some of these properties:

``` html
<div id="hook-arguments-example" v-demo:hello.a.b="message"></div>
```

``` js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

{% raw %}
<div id="hook-arguments-example" v-demo:hello.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
</script>
{% endraw %}

## Function Shorthand

In many cases, you may want the same behavior on `bind` and `update`, but don't care about the other hooks. For example:

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Object Literals

If your directive needs multiple values, you can also pass in a JavaScript object literal. Remember, directives can take any valid JavaScript expression.

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
