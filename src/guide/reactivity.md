---
title: 深入响应式原理
type: guide
order: 15
---

大部分的基础内容我们已经讲到了，现在讲点底层内容。Vue.js 最显著的一个功能是响应系统,只是普通的JavaScript对象模型，修改它则更新视图。这让状态管理非常简单且直观，不过理解它的原理也很重要，可以避免一些常见问题。本节中，下面我们开始深挖 Vue.js 响应系统的底层细节。

## 如何追踪变化

把一个普通Javascript对象传给 Vue 实例作为它的 `data` 选项，Vue.js 将遍历它的属性，用 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 将它们转为 `getter/setter`。这是 ES5 特性，不能打补丁实现，这便是为什么 Vue.js 不支持 IE8 及更低版本。

用户看不到 getter/setters，但是在内部它们让 Vue.js追踪依赖，在属性被访问和修改时通知变化。一个问题是在浏览器控制台打印数据对象时 getter/setter 的格式化不同，使用 `vm.$log()` 实例方法可以得到更友好的输出。所以你可能想要安装`vue-devtools`更多的检查接口。

模板中每个指令/数据绑定都有一个对应的 **watcher** 对象，在计算过程中它把属性记录为依赖。之后当依赖的 `setter` 被调用时，会触发 **watcher** 重新计算 ，也就会导致它的关联指令更新 DOM。

![data](/images/data.png)

## 变化检测问题

受 ES5 的限制，Vue.js **不能检测到对象属性的添加或删除**。因为 Vue.js 在初始化实例时将属性转为 `getter/setter`，所以属性必须在 `data` 对象上才能让 Vue.js 转换它，才能让它是响应的。例如：

``` js
var vm = new Vue({
  data:{
  a:1
  }
})
//`vm.a`是响应

vm.b = 2
// `vm.b` 是非响应
```

Vue 不允许动态地将新的顶级响应属性添加到已经创建的实例。然而，它是可能将响应属性添加到嵌套的对象，可以使用 `Vue.$set(key, value)` 实例方法：

``` js
Vue.set(vm.someObject, 'b', 2)

```
您还可以使用`vm.$set`实例方法，也是全局 `Vue.set`的别名：
```js
this.$set(this.someObject,'b',2)
```

有时你想向已有对象上添加一些属性，例如使用 `Object.assign()` 或 `_.extend()`添加属性。但是，添加到对象上的新属性不会触发更新。这时可以创建一个新的对象，包含原对象的属性和新的属性：

``` js
// 不使用 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

也有一些数组相关的问题，之前已经在[列表渲染](/guide/list.html#Caveats)中讲过。

## 初始化数据

由于 Vue 不允许动态添加顶级响应属性，这意味着你必须初始化声明的所有顶级响应前期数据属性，哪怕是有空值的实例：
``` js
var vm = new Vue({
  data: {
    // 声明 message 为一个空值字符串
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// 之后设置 `message` 
vm.message = 'Hello!'
```

如果你不声明中数据选项的消息，Vue 将警告你的渲染功能试图访问一个不存在的属性。

这种限制背后是有技术的原因，它消除了边缘情况下依赖项跟踪系统中一类，也使得 Vue 实例和类型检查系统发挥。但也是一个重要的考虑，在代码可维护性方面：数据对象就像组件状态的模式（Schema），在它上面声明所有的属性让组织代码更易于其他开发者阅读理解。

## 异步更新队列

默认情况下，Vue 执行 DOM 更新**异步**，只要观察到的数据更改，它将打开一个队列和缓冲区发生的所有数据更改在相同的事件循环。如果相同的观察者多次触发，它将会只有一次推送到队列。然后，在接下来的事件循环"时钟"中，Vue 刷新队列并执行仅有必要的 DOM 更新。Vue内部使用`MutationObserver` 如果可用的异步队列调用回调`setTimeout(fn, 0)`.

例如，当你设置`vm.someData = 'new value'`,该组件不会马上被重新渲染。当刷新队列时，这个组件将会在下一个的'时钟'中更新。很多时候我们不需要关心这个，但可可能会非常的棘手，当你要执行某个动作的时候，将会取决于后更新的DOM状态。一般地，Vue.js鼓励开发人员用“数据驱动”的方式，尽量避免直接接触DOM，因为有时是完全没有必要。等待Vue.js已完成DOM数据更改后，可以使用`Vue.nextTick(callback)`实时更改数据，之后更新DOM会调用回调。例如：
```html
<div id="example">{{message}}</div>
```
``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```
这也是`vm.$nextTick()`实例方法，是在组件内特别方便，因为它不需要全局`Vue`和其回调`this`上下文将自动绑定到当前的Vue实例：
``` js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: 'not updated'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'updated'
      })
    }
  }
})
```

***

> 原文： http://vuejs.org/guide/reactivity.html

***
