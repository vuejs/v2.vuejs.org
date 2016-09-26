---
title: 自定义指令
type: guide
order: 16
---

## 简介

除了默认设置的核心指令(`v-model`和`v-show`),Vue也允许注册自定义指令。注意，在vue2.0里面，代码复用的主要形式和抽象是组件——然而可能有情况下,你只需要一些低级的DOM访问纯元素,这就是自定义指令仍将是有用的。下面这个例子聚集一个input元素，像这样：

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

页面加载时，元素将获得焦点。事实上，你访问后还没点击任何内容，input就被聚焦了。现在让我们完善这个指令：

``` js
// 注册一个全局自定义指令叫做 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到DOM中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

也可以注册局部指令，组件中接受一个 `directives`的选项：

``` js
directives: {
  focus: {
    // 指令的定义
  }
}
```

然后你可以在模板中任何元素上使用新的`v-focus`属性：

``` html
<input v-focus>
```

## 钩子函数

A directive definition object can provide several hook functions (all optional):

- `bind`: called only once, when the directive is first bound to the element. This is where you can do one-time setup work.

- `inserted`: called when the bound element has been inserted into its parent node (this only guarantees parent node presence, not necessarily in-document).

- `update`: called whenever the bound element's containing component is updated. The directive's value may or may not have changed. You can skip unnecessary updates by comparing the binding's current and old values (see below on hook arguments).

- `componentUpdated`: called after the containing component has completed an update cycle.

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
- **vnode**: The virtual node produced by Vue's compiler.<!--See the [VNode API]([!!TODO: Add link to the VNode API doc when it exists]) for full details.-->
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
