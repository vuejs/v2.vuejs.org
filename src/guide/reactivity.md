---
title: 深入响应式原理
type: guide
order: 15
---

大部分的基础内容我们已经讲到了，现在讲点底层内容。Vue 最显著的一个功能是响应系统 —— 模型只是普通对象，修改它则更新视图。这会让状态管理变得非常简单且直观，不过理解它的原理以避免一些常见的陷阱也是很重要的。在本节中，我们将开始深挖 Vue 响应系统的底层细节。

## 如何追踪变化

把一个普通 Javascript 对象传给 Vue 实例来作为它的 `data` 选项，Vue 将遍历它的属性，用 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 将它们转为 getter/setter。这是 ES5 的特性，不能打补丁实现，这便是为什么 Vue 不支持 IE8 以及更低版本浏览器的原因。

用户看不到 getter/setters，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 [vue-devtools](https://github.com/vuejs/vue-devtools) 来获取更加友好的检查接口。
    
每个组件实例都有相应的 **watcher** 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 `setter` 被调用时，会通知 `watcher` 重新计算，从而致使它关联的组件得以更新。

![data](/images/data.png)

## 变化检测问题

受现代 Javascript 的限制(以及 `Object.observe` 的废弃)，Vue **不能检测到对象属性的添加或删除**。因为 Vue 在初始化实例时将属性转为 `getter/setter`，所以属性必须在 `data` 对象上才能让 Vue 转换它，这样才能让它是响应的。例如：

``` js
var vm = new Vue({
  data:{
  a:1
  }
})

// `vm.a` 是响应的

vm.b = 2
// `vm.b` 是非响应的
```

Vue 不允许动态地将新的顶级响应属性添加到已经创建的实例上。然而它可能使用 `Vue.set(object, key, value)` 方法将响应属性添加到嵌套的对象上：

``` js
Vue.set(vm.someObject, 'b', 2)

```
您还可以使用 `vm.$set` 实例方法，这也是全局 `Vue.set` 方法的别名：

``` js
this.$set(this.someObject,'b',2)
```

有时你想向已有对象上添加一些属性，例如使用 `Object.assign()` 或 `_.extend()` 方法来添加属性。但是，添加到对象上的新属性不会触发更新。在这种情况下可以创建一个新的对象，让它包含原对象的属性和新的属性：

``` js
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

也有一些数组相关的问题，之前已经在[列表渲染](/guide/list.html#Caveats)中讲过。

## 声明响应属性
由于 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明根级响应式属性，哪怕只是一个空值:

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
  
如果你不在 data 对象中声明 `message`，Vue 将发出警告表明你的渲染方法正试图访问一个不存在的属性。


这样的限制在背后是有其技术原因的，在依赖项跟踪系统中，它消除了一类边界情况，也使 Vue 实例在类型检查系统的帮助下运行的更高效。在代码可维护性方面上这也是重要的一点：`data` 对象就像组件状态的模式（Schema），在它上面声明所有的属性让组织代码更易于被其他开发者或是自己回头重新阅读时更加快速地理解。

## 异步更新队列

你应该注意到 Vue 执行 DOM 更新是**异步的**，只要观察到数据变化，Vue 就开始一个队列，将同一事件循环内所有的数据变化缓存起来。如果一个 watcher 被多次触发，只会推入一次到队列中。然后，在接下来的事件循环中，Vue 刷新队列并仅执行必要的 DOM 更新。Vue 在内部使用 `Promise.then` 和 `MutationObserver` 为可用的异步队列调用回调 `setTimeout(fn, 0)`.

例如，当你设置 `vm.someData = 'new value'`，该组件不会马上被重新渲染。当刷新队列时，这个组件会在下一次事件循环清空队列时更新。我们基本不用关心这个过程，但是如果你想在 DOM 状态更新后做点什么，这就可能会有些棘手。一般来讲，Vue 鼓励开发者沿着数据驱动的思路，尽量避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 `Vue.nextTick(callback)`。这样回调在 DOM 更新完成后就会调用。例如：

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
`vm.$nextTick()` 这个实例方法在组件内使用特别方便，因为它不需要全局 `Vue`，它的回调 `this` 将自动绑定到当前的 Vue 实例上：
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
