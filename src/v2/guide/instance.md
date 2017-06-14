---
title: Vue 实例
type: guide
order: 3
---

## 构造函数

每个 Vue ViewModel 都是通过 `Vue` 构造函数创建出一个 **Vue 根实例**来引导辅助的：

``` js
var vm = new Vue({
  // 选项
})
```

尽管没有完全遵循 [MVVM 模式](https://en.wikipedia.org/wiki/Model_View_ViewModel)，但是 Vue 的设计仍然受到了它的启发。作为约定，通常我们使用变量 `vm` (ViewModel 的简称) 来表示 Vue 实例。

在实例化 Vue 实例时，你需要传入一个**选项对象**，它可以包含数据(data)、模板(template)、挂载元素(element to mount on)、方法(methods)、生命周期函数(lifecycle callbacks)和其他选项。全部选项列表可以在 [API 参考文档](../api)中查看。

可以通过预先定义选项扩展 `Vue` 构造函数，从而创建可复用的**组件构造函数**：

``` js
var MyComponent = Vue.extend({
  // 扩展选项
})

// `MyComponent` 的所有实例，都将由预先定义的扩展选项来创建
var myComponentInstance = new MyComponent()
```

尽管可以命令式地创建扩展实例，不过，在多数情况下，推荐声明式地注册组件，并在模板中作为自定义元素组合在一起。我们将在后面详细说明[组件系统](components.html)。现在，你只需知道所有的 Vue 组件，本质上都是 Vue 对象扩展后的实例。

## 属性与方法

每个 Vue 实例都会**代理**其 `data` 对象的所有属性：

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// 设置属性也会影响到原始数据
vm.a = 2
data.a // -> 2

// ... 反之亦然
data.a = 3
vm.a // -> 3
```

应当注意，只有这些以上这种代理属性是**响应式**的。如果在实例创建之后，再对实例添加新的属性，将不会触发任何视图更新。之后我们将详细讨论响应式系统。

除了 data 属性， Vue 实例还暴露了一些有用的实例属性和方法。这些属性与方法都具有前缀 `$`，以便与所代理的 data 属性有所区分。例如：

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch 是一个实例方法
vm.$watch('a', function (newVal, oldVal) {
  // 这个回调函数将在 `vm.a` 改变后调用
})
```

<p class="tip">不要在实例属性或者回调函数中（例如，`vm.$watch('a', newVal => this.myMethod())`）使用[箭头函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。因为箭头函数会绑定父级上下文，所以 `this` 不会按照预期指向 Vue 实例，然后 `this.myMethod` 将是被定义。</p>

实例属性和方法的完整列表，请查阅 [API 参考文档](../api)。

## 实例生命周期钩子函数

每个 Vue 实例在被创建之前，都要经过一系列的初始化过程 - 例如，Vue 实例需要配置数据观察(data observation)、编译模版(compile the template)、在 DOM 挂载实例(mount the instance to the DOM)，以及在数据变化时更新 DOM(update the DOM when data change)。在这个过程中，Vue 实例还会调用执行一些**生命周期钩子函数**，这就为我们提供了执行自定义逻辑的时机。例如，在实例创建后将调用 [`created`](../api/#created) 钩子函数：

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// -> "a is: 1"
```

也有一些其它的钩子，在实例生命周期的不同阶段调用，如 [`mounted`](../api/#mounted)、[`updated`](../api/#updated) 和 [`destroyed`](../api/#destroyed)。钩子的 `this` 指向调用它的 Vue 实例。一些用户可能会问 Vue.js 是否有“控制器(controller)”的概念？答案是，没有。组件的自定义逻辑可以分布在这些钩子中。

## 生命周期示意图

下面是实例生命周期示意图。你不需要现在就完全明白一切，不过这些示意图在之后会对你有所帮助。

![Lifecycle](/images/lifecycle.png)

***

> 原文：https://vuejs.org/v2/guide/instance.html

***
