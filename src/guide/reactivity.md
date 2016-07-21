---
title: Reactivity in Depth
type: guide
order: 15
---

We've covered most of the basics - now it's time to take a deep dive! One of Vue's most distinct features is the unobtrusive reactivity system. Models are just plain JavaScript objects. When you modify them, the view updates. It makes state management very simple and intuitive, but it's also important to understand how it works to avoid some common gotchas. In this section, we are going to dig into some of the lower-level details of Vue's reactivity system.

## How Changes Are Tracked

When you pass a plain JavaScript object to a Vue instance as its `data` option, Vue will walk through all of its properties and convert them to getter/setters using [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). This is an ES5-only and un-shimmable feature, which is why Vue doesn't support IE8 and below.

The getter/setters are invisible to the user, but under the hood they enable Vue to perform dependency-tracking and change-notification when properties are accessed or modified. One caveat is that browser consoles format getter/setters differently when converted data objects are logged, so you may want to install [vue-devtools](https://github.com/vuejs/vue-devtools) for a more inspection-friendly interface.

For every data binding in the template, there will be a corresponding **watcher** object, which records any properties "touched" during its evaluation as dependencies. Later on when a dependency's setter is called, it triggers the watcher to re-evaluate, and in turn causes its associated directive to perform DOM updates.

> !!TODO: Not sure if this should be updated, since there is now the vdom layer between updates and the DOM.

![data](/images/data.png)

## Change Detection Caveats

Due to the limitations of modern JavaScript (and the abandonment of `Object.observe`), Vue **cannot detect property addition or deletion**. Since Vue performs the getter/setter conversion process during instance initialization, a property must be present in the `data` object in order for Vue to convert it and make it reactive. For example:

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})
// `vm.a` and `data.a` are now reactive

vm.b = 2
// `vm.b` is NOT reactive

data.b = 2
// `data.b` is NOT reactive
```

However, there are ways to **add a property and make it reactive** after an instance has been created.

You can use the `Vue.set(object, key, value)` method:

``` js
Vue.set(data, 'c', 3)
// `vm.c` and `data.c` are now reactive
```

Sometimes you may want to assign a number of properties to an existing object, for example using `Object.assign()` or `_.extend()`. However, new properties added to the object will not trigger changes. In such cases, create a fresh object with properties from both the original object and the mixin object:

``` js
// instead of `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

There are also a few array-related caveats, which were discussed earlier in the [list rendering section](/guide/list.html#Caveats).

## Initialize Your Data

Although Vue provides the API to dynamically add reactive properties on the fly, it is recommended to declare all reactive properties upfront in the `data` option.

Instead of this:

``` js
var vm = new Vue({
  template: '<div>{{ message }}</div>'
})
// add `message` later
Vue.set(vm.$data, 'message', 'Hello!')
```

Prefer this:

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

There are two reasons behind this pattern:

1. The `data` object is like the schema for your component's state. Declaring all reactive properties upfront makes the component code easier to understand and reason about.

2. Adding a top level reactive property on a Vue instance will force all the watchers in its scope to re-evaluate, because it didn't exist before and no watcher could have tracked it as a dependency. The performance hit is usually acceptable (essentially the same as Angular 1's dirty checking), but can be avoided when you initialize the data properly.

## Async Update Queue

!!TODO: I believe much of this is no longer true, but Evan is probably the one to rewrite it.

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
