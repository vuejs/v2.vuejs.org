title: 事件监听
type: guide
order: 6
---

你可以使用 `v-on` 指令来绑定并监听 DOM 事件。绑定的内容可以是一个事件句柄函数 (后面无需跟括号) 或一个内联表达式。如果提供的是一个句柄函数，则原来的 DOM event 对象会被作为第一个参数传入，同时这个 event 对象会附带 `targetVM` 属性，指向触发该事件的相应的 ViewModel：

``` html
<div id="demo">
  <a v-on="click: onClick">Trigger a handler</a>
  <a v-on="click: n++">Trigger an expression</a>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    n: 0
  },
  methods: {
    onClick: function (e) {
      console.log(e.target.tagName) // "A"
      console.log(e.targetVM === this) // true
    }
  }
})
```

## 执行表达式句柄

`targetVM` 在 `v-repeat` 里使用 `v-on` 时显得特别有用，因为 `v-repeat` 会创建大量子 ViewModel。这样的话，通过执行表达式的方式，把代表当前上下文 ViewModel 的 `this` 传进去，就显得非常方便。

``` html
<ul id="list">
  <li v-repeat="items" v-on="click: toggle(this)">{{text}}</li>
</ul>
```

``` js
new Vue({
  el: '#list',
  data: {
    items: [
      { text: 'one', done: true },
      { text: 'two', done: false }
    ]
  },
  methods: {
    toggle: function (item) {
      item.done = !item.done
    }
  }
})
```

当你想要在表达式句柄中访问原来的 DOM event，你可以传递一个 `$event` 参数进去：

``` html
<button v-on="click: submit('hello!', $event)">Submit</button>
```

``` js
/* ... */
{
  methods: {
    submit: function (msg, e) {
      e.stopPropagation()
    }
  }
}
/* ... */
```

## 特殊的 `key` 过滤器

当监听键盘事件时，我们常常需要判断常用的 key code。Vue.js 提供了一个特殊的只能用在 `v-on` 指令的过滤器：`key`。它接收一个表示 key code 的参数并完成判断：

```
<!-- only call vm.submit() when the keyCode is 13 -->
<input v-on="keyup:submit | key 13">
```

它也预置了一些常用的按键名：

```
<!-- same as above -->
<input v-on="keyup:submit | key enter">
```

API 索引中有 [key 过滤器预置的完整列表](../api/filters.html#key).

## 为什么要在 HTML 中写监听器？

你可能会注意到整个事件监听的方式违背了“separation of concern”的传统理念。不必担心，因为所有的 Vue.js 句柄函数和表达式都严格绑定在当前视图的 ViewModel 上，它不会导致任何维护困难。实际上，使用 `v-on` 还有更多好处：

1. 它便于在 HTML 模板中轻松定位 JS 代码里的句柄函数实现。
2. 因为你无须在 JS 里手动绑定事件，你的 ViewModel 代码可以是非常纯粹的逻辑而和 DOM 无关。这会更易于测试。
3. 当一个 ViewModel 被销毁时，所有的事件监听都会被自动移除。你无须担心如何自行清理它们。

接下来：[处理表单](../guide/forms.html).