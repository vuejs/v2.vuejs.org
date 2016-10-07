---
title: 深入响应式原理
type: guide
order: 15
---

大部分的基础内容我们已经讲到了，现在讲点底层内容。Vue.js 最显著的一个功能是响应系统 —— 模型只是普通对象，修改它则更新视图。这让状态管理非常简单且直观，不过理解它的原理也很重要，可以避免一些常见问题。下面我们开始深挖 Vue.js 响应系统的底层细节。

## 如何追踪变化

把一个普通对象传给 Vue 实例作为它的 `data` 选项，Vue.js 将遍历它的属性，用 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 将它们转为 `getter/setter`。这是 ES5 特性，不能打补丁实现，这便是为什么 Vue.js 不支持 IE8 及更低版本。

用户看不到 getter/setters，但是在内部它们让 Vue.js 追踪依赖，在属性被访问和修改时通知变化。一个问题是在浏览器控制台打印数据对象时 `getter/setter` 的格式化不同，使用 `vm.$log()` 实例方法可以得到更友好的输出。

模板中每个指令/数据绑定都有一个对应的 **watcher** 对象，在计算过程中它把属性记录为依赖。之后当依赖的 `setter` 被调用时，会触发 **watcher** 重新计算 ，也就会导致它的关联指令更新 DOM。

> !!TODO: 因为vdom层的引入，这里可能会更新。

![data](/images/data.png)

## 变化检测问题

受 ES5 的限制，Vue.js 不能检测到对象属性的添加或删除。因为 Vue.js 在初始化实例时将属性转为 `getter/setter`，所以属性必须在 `data` 对象上才能让 Vue.js 转换它，才能让它是响应的。例如：

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})
// `vm.a` and `data.a` 现在是响应的

vm.b = 2
// `vm.b` 不是响应的

data.b = 2
// `data.b` 不是响应的
```

不过，有办法在实例创建之后**添加属性并且让它是响应的**。

对于 Vue 实例，可以使用 `Vue.$set(key, value)` 实例方法：

``` js
Vue.set(data, 'c', 3)
// `vm.c` and `data.c` 现在是响应的
```

有时你想向已有对象上添加一些属性，例如使用 `Object.assign()` 或 `_.extend()`添加属性。但是，添加到对象上的新属性不会触发更新。这时可以创建一个新的对象，包含原对象的属性和新的属性：

``` js
// 不使用 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

也有一些数组相关的问题，之前已经在[列表渲染](/guide/list.html#Caveats)中讲过。

## 初始化数据

尽管 Vue.js 提供了 API 动态地添加响应属性，还是推荐在 `data` 对象上声明所有的响应属性。

不这么做：

不这么做:

``` js
var vm = new Vue({
  template: '<div>{{ message }}</div>'
})
// 之后设置 `message`
Vue.set(vm.$data, 'message', 'Hello!')
```

这么做:

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

这么做有两个原因：

1. `data` 对象就像组件状态的模式（schema）。在它上面声明所有的属性让组件代码更易于理解。

2.添加一个顶级响应属性会强制所有的 watcher 重新计算，因为它之前不存在，没有 watcher 追踪它。这么做性能通常是可以接受的（特别是对比 Angular 的脏检查），但是可以在初始化时避免

## 异步更新队列

> !!TODO: 我认为这里很大部分已经失效，需要尤小右来重写

By default, Vue performs DOM updates **asynchronously**. Whenever a data change is observed, it will open a queue and buffer all the data changes that happen in the same event loop. If the same watcher is triggered multiple times, it will be pushed into the queue only once. Then, in the next event loop "tick", Vue flushes the queue and performs only the necessary DOM updates. Internally Vue uses `MutationObserver` if available for the asynchronous queuing and falls back to `setTimeout(fn, 0)`.

For example, when you set `vm.someData = 'new value'`, the DOM will not update immediately. It will update in the next "tick", when the queue is flushed. Most of the time we don't need to care about this, but it can be tricky when you want to do something that depends on the post-update DOM state. Although Vue.js generally encourages developers to think in a "data-driven" fashion and avoid touching the DOM directly, sometimes it might be necessary to get your hands dirty. In order to wait until Vue.js has finished updating the DOM after a data change, you can use `Vue.nextTick(callback)` immediately after the data is changed. The callback will be called after the DOM has been updated. For example:

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // change data
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

There is also the `vm.$nextTick()` instance method, which is especially handy inside components, because it doesn't need global `Vue` and its callback's `this` context will be automatically bound to the current Vue instance:

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

## Inside Computed Properties

It should be noted that Vue's computed properties are **not** simple getters. Each computed property keeps track of its own reactive dependencies. When a computed property is evaluated, Vue updates its dependency list and caches the returned value. The cached value is only invalidated when one of the tracked dependencies have changed. Therefore, as long as the dependencies did not change, accessing the computed property will directly return the cached value instead of calling the getter.

Why do we need caching? Imagine we have an expensive computed property **A**, which requires looping through a huge Array and doing a lot of computations. Then we may have other computed properties that in turn depend on **A**. Without caching, we would be executing **A**’s getter many more times than necessary!

Because of computed property caching, the getter function is not always called when you access a computed property. Consider the following example:

``` js
var vm = new Vue({
  data: {
    message: 'hi'
  },
  computed: {
    example: function () {
      return Date.now() + this.message
    }
  }
})
```

The computed property `example` has only one dependency: `vm.message`. `Date.now()` is **not** a reactive dependency, because it has nothing to do with Vue's data observation system. Therefore, when you programmatically access `vm.example`, you will find the timestamp remains the same unless `vm.message` triggers a re-evaluation.

In some use cases, you may want to preserve the simple getter-like behavior, where every time you access `vm.example` it simply calls the getter again. You can do that by turning off caching for a specific computed property:

``` js
computed: {
  example: {
    cache: false,
    get: function () {
      return Date.now() + this.message
    }
  }
}
```

Now, every time you access `vm.example`, the timestamp will be up-to-date. **However, note this only affects programmatic access inside JavaScript; data-bindings are still dependency-driven.** When you bind to a computed property in the template as `{% raw %}{{ example }}{% endraw %}`, the DOM will only be updated when a reactive dependency has changed.

We've covered most of the basics - now it's time to take a deep dive! One of Vue's most distinct features is the unobtrusive reactivity system. Models are just plain JavaScript objects. When you modify them, the view updates. It makes state management very simple and intuitive, but it's also important to understand how it works to avoid some common gotchas. In this section, we are going to dig into some of the lower-level details of Vue's reactivity system.

## How Changes Are Tracked

When you pass a plain JavaScript object to a Vue instance as its `data` option, Vue will walk through all of its properties and convert them to getter/setters using [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). This is an ES5-only and un-shimmable feature, which is why Vue doesn't support IE8 and below.

The getter/setters are invisible to the user, but under the hood they enable Vue to perform dependency-tracking and change-notification when properties are accessed or modified. One caveat is that browser consoles format getter/setters differently when converted data objects are logged, so you may want to install [vue-devtools](https://github.com/vuejs/vue-devtools) for a more inspection-friendly interface.

Every component instance has a corresponding **watcher** instance, which records any properties "touched" during the component's render as dependencies. Later on when a dependency's setter is triggered, it notifies the watcher, which in turn causes the component to re-render.

![Reactivity Cycle](/images/data.png)

## Change Detection Caveats

Due to the limitations of modern JavaScript (and the abandonment of `Object.observe`), Vue **cannot detect property addition or deletion**. Since Vue performs the getter/setter conversion process during instance initialization, a property must be present in the `data` object in order for Vue to convert it and make it reactive. For example:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` is now reactive

vm.b = 2
// `vm.b` is NOT reactive
```

Vue does not allow dynamically adding new root-level reactive properties to an already created instance. However, it's possible to add reactive properties to a nested object using the `Vue.set(object, key, value)` method:

``` js
Vue.set(vm.someObject, 'b', 2)
```

You can also use the `vm.$set` instance method, which is just an alias to the global `Vue.set`:

``` js
this.$set(this.someObject, 'b', 2)
```

Sometimes you may want to assign a number of properties to an existing object, for example using `Object.assign()` or `_.extend()`. However, new properties added to the object will not trigger changes. In such cases, create a fresh object with properties from both the original object and the mixin object:

``` js
// instead of `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

There are also a few array-related caveats, which were discussed earlier in the [list rendering section](/guide/list.html#Caveats).

## Declaring Reactive Properties

Since Vue doesn't allow dynamically adding root-level reactive properties, this means you have to initialize you instances by declaring all root-level reactive data properties upfront, even just with an empty value:

``` js
var vm = new Vue({
  data: {
    // declare message with an empty value
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// set `message` later
vm.message = 'Hello!'
```

If you don't declare `message` in the data option, Vue will warn you that the render function is trying to access a property that doesn't exist.

There are technical reasons behind this restriction - it eliminates a class of edge cases in the dependency tracking system, and also makes Vue instances play nicer with type checking systems. But there is also an important consideration in terms of code maintainability: the `data` object is like the schema for your component's state. Declaring all reactive properties upfront makes the component code easier to understand when revisited later or read by another developer.

## Async Update Queue

In case you haven't noticed yet, Vue performs DOM updates **asynchronously**. Whenever a data change is observed, it will open a queue and buffer all the data changes that happen in the same event loop. If the same watcher is triggered multiple times, it will be pushed into the queue only once. This buffered de-duplication is important in avoiding unnecessary calculations and DOM manipulations. Then, in the next event loop "tick", Vue flushes the queue and performs the actual (already de-duped) work. Internally Vue uses `MutationObserver` if available for the asynchronous queuing and falls back to `setTimeout(fn, 0)`.

For example, when you set `vm.someData = 'new value'`, the component will not re-render immediately. It will update in the next "tick", when the queue is flushed. Most of the time we don't need to care about this, but it can be tricky when you want to do something that depends on the post-update DOM state. Although Vue.js generally encourages developers to think in a "data-driven" fashion and avoid touching the DOM directly, sometimes it might be necessary to get your hands dirty. In order to wait until Vue.js has finished updating the DOM after a data change, you can use `Vue.nextTick(callback)` immediately after the data is changed. The callback will be called after the DOM has been updated. For example:

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // change data
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

There is also the `vm.$nextTick()` instance method, which is especially handy inside components, because it doesn't need global `Vue` and its callback's `this` context will be automatically bound to the current Vue instance:

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
