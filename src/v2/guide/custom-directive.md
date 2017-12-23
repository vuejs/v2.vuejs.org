---
title: 自定义指令
type: guide
order: 302
---

## 简介

除了 Vue 核心携带着的一些默认指令（`v-model` 和 `v-show`）之外，Vue 还允许你注册自己的自定义指令。请注意，在 Vue 2.0 中，代码重用和抽象(reuse and abstraction)的主要是以组件的形式 - 但是，可能某些情况下，还是需要对普通元素进行一些底层 DOM 访问，这也是自定义指令仍然有其使用场景之处。接着来看一个在输入元素获取焦点的示例，如下：

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

当页面加载时，元素将获取焦点（注意：`自动获取焦点`在 Safari 手机上无法运行）。事实上，在访问页面时，如果你还没有点击任何地方，上面的输入框现在应该处于获取焦点的状态。现在让我们构建指令以完成此效果：

``` js
// 注册一个名为 `v-focus` 的全局自定义指令
Vue.directive('focus', {
  // 当绑定的元素插入到 DOM 时调用此函数……
  inserted: function (el) {
    // 元素调用 focus 获取焦点
    el.focus()
  }
})
```

如果你想要注册一个局部指令，也可以通过设置组件的 `directives` 选项：

``` js
directives: {
  focus: {
    // 指令定义对象
    inserted: function (el) {
      el.focus()
    }
  }
}
```

然后在模板中，你可以在任何元素上使用新增的 `v-focus` 属性，就像这样：

``` html
<input v-focus>
```

## 钩子函数

指令的定义对象提供了几个钩子函数（全部可选）：

- `bind`：在指令第一次绑定到元素时调用，只会调用一次。可以在此钩子函数中，执行一次性的初始化设置。

- `inserted`：在已绑定的元素插入到父节点时调用（只能保证父节点存在，不一定存在于 document 中）。

- `update`：在包含指令的组件的 VNode 更新后调用，__但可能之前其子组件已更新__。指令的值可能更新或者还没更新，然而可以通过比较绑定的当前值和旧值，来跳过不必要的更新（参考下面的钩子函数）。

- `componentUpdated`：在包含指令的组件的 VNode 更新后调用，并且其子组件的 VNode 已更新。

- `unbind`：在指令从元素上解除绑定时调用，只会调用一次。

我们将在下一节中，探讨传入这些钩子函数的参数（例如 `el`, `binding`, `vnode` 和 `oldVnode`）。

## 指令钩子函数参数

指令钩子函数可传入以下参数：

- `el`：指令绑定的元素。可以用于直接操作 DOM。
- `binding`：一个对象，包含以下属性：
  - `name`：指令的名称，不包括 `v-` 前缀。
  - `value`：向指令传入的值。例如，在 `v-my-directive="1 + 1"` 中，传入的值是 `2`。
  - `oldValue`：之前的值，只在 `update` 和 `componentUpdated` 钩子函数中可用。无论值是否发生变化，都可以使用。
  - `expression`：指令绑定的表达式(expression)，以字符串格式。例如，在 `v-my-directive="1 + 1"` 中，表达式是 `"1 + 1"`。
  - `arg`：向指令传入的参数，如果有的话。例如，在 `v-my-directive:foo` 中，参数是 `"foo"`。
  - `modifiers`：一个对象，包含修饰符，如果有的话。例如，在 `v-my-directive.foo.bar` 中，修饰符是 `{ foo: true, bar: true }`。
- `vnode`：由 Vue 编译器(Vue's compiler)生成的虚拟 Node 节点(virtual node)。更多细节请查看 [VNode API](../api/#VNode-Interface)。
- `oldVnode`：之前的虚拟 Node 节点(virtual node)，只在 `update` 和 `componentUpdated` 钩子函数中可用。

<p class="tip">除了 `el` 之外的其他参数，都应该是只读的，并且永远不要去修改它们。如果你需要通过钩子函数共享信息数据，推荐通过元素的 [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) 来实现。</p>

下面是使用这些属性的自定义指令的示例：

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
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
<div id="hook-arguments-example" v-demo:foo.a.b="message" class="demo"></div>
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

## 函数简写(Function Shorthand)

在许多情况下，可能只需要在 `bind` 和 `update` 钩子函数上定义过相同的行为就足够了，而无需关心其他钩子函数。例如：

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## 对象字面量(Object Literals)

如果指令需要多个值，你还可以向指令传入 JavaScript 对象字面量(object literal)。记住，指令能够接收所有有效的 JavaScript 表达式。

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```

***

> 原文：https://vuejs.org/v2/guide/custom-directive.html

***
