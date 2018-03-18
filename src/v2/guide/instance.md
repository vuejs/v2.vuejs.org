---
title: Vue 实例
type: guide
order: 3
---

## 创建一个 Vue 实例

每个 Vue 应用程序都是通过 `Vue` 函数创建出一个新的 **Vue 实例**开始的：

```js
var vm = new Vue({
  // 选项
})
```

尽管没有完全遵循 [MVVM 模式](https://en.wikipedia.org/wiki/Model_View_ViewModel)，但是 Vue 的设计仍然受到了它的启发。作为约定，通常我们使用变量 `vm` (ViewModel 的简称) 来表示 Vue 实例。

在创建一个 Vue 实例时，你会传入一个**选项对象(options object)**。本指南的大部分内容描述了，如果使用选项来达成预期的行为。可以在 [API 参考文档](../api/#Options-Data)中浏览选项(options)的完整列表。

Vue 应用程序由「一个使用 `new Vue` 创建的 **Vue 根实例**」、「嵌套的树结构（可选）」和「可复用的组件」组成。例如，一个 todo 应用程序的组件树可能如下所示：

```
根实例(Root Instance)
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

稍后，我们将详细介绍[组件系统](components.html)。现在，只需要知道，所有 Vue 组件，都是 Vue 实例，并且组件都接收相同的选项对象（除了一些根实例特有(root-specific)的选项）。

## data 和 methods

在创建 Vue 实例时，会将所有在 `data` 对象中找到的属性，都添加到 Vue 的**响应式系统**中。每当这些属性的值发生变化时，视图都会“及时响应”，并更新相应的新值。

```js
// data 对象
var data = { a: 1 }

// 此对象将会添加到 Vue 实例上
var vm = new Vue({
  data: data
})

// 在实例上获取属性
// 将返回原始数据中的属性
vm.a == data.a // => true

// 设置实例上的属性，
// 也会影响原始数据
vm.a = 2
data.a // => 2

// ... 反之亦然
data.a = 3
vm.a // => 3
```

每当 data 对象发生变化，都会触发视图重新渲染。值得注意的是，如果实例已经创建，那么只有那些 `data` 中的原本就已经存在的属性，才是**响应式**的。也就是说，如果在实例创建之后，添加一个新的属性，例如：

```js
vm.b = 'hi'
```

然后，修改 `b` 不会触发任何视图更新。如果你已经提前知道，之后将会用到一个开始是空的或不存在的属性，你需要预先设置一些初始值。例如：

```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

这里唯一的例外是，使用 `Object.freeze()` 来防止已有属性被修改，这也意味着响应式系统无法_追踪_变化。

```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- 这将不再更新 `foo`! -->
  <button @click="foo = 'baz'">点我修改</button>
</div>
```

除了 data 属性， Vue 实例还暴露了一些有用的实例属性和方法。这些属性与方法都具有前缀 `$`，以便与用户定义(user-defined)的属性有所区分。例如：

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 此回调函数将在 `vm.a` 改变后调用
})
```

稍后，可以查阅 [API 参考文档](../api/#Instance-Properties)，来获取实例属性(instance property)和方法(methods)的完整列表。

## 实例生命周期钩子函数

每个 Vue 实例在被创建之前，都要经过一系列的初始化过程 - 例如，Vue 实例需要设置数据观察(set up data observation)、编译模板(compile the template)、在 DOM 挂载实例(mount the instance to the DOM)，以及在数据变化时更新 DOM(update the DOM when data change)。在这个过程中，Vue 实例还会调用执行一些**生命周期钩子函数**，这样用户能够在特定阶段添加自己的代码。

例如，在实例创建后将调用 [`created`](../api/#created) 钩子函数：

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

也有一些其它的钩子，会在实例生命周期的不同阶段调用，如 [`mounted`](../api/#mounted)、[`updated`](../api/#updated) 和 [`destroyed`](../api/#destroyed)。所有的钩子函数在调用时，其 `this` 上下文都会指向调用它的 Vue 实例。

<p class="tip">不要在选项属性或者回调函数中使用[箭头函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)（例如，`created: () => console.log(this.a)` 或 `vm.$watch('a', newValue => this.myMethod())`）。因为箭头函数会绑定父级上下文，所以 `this` 不会按照预期指向 Vue 实例，经常会产生一些错误，例如 `Uncaught TypeError: Cannot read property of undefined` 或者 `Uncaught TypeError: this.myMethod is not a function`。</p>

## 生命周期示意图

下面是实例生命周期示意图。你不需要现在就完全明白一切，但是，当你深入学习和组织架构的时候，这个示意图会是很有帮助的参考。

![Vue 实例的生命周期](/images/lifecycle.png)

***

> 原文：https://vuejs.org/v2/guide/instance.html

***
