---
title: mixin
type: guide
order: 301
---

## 基础

mixin 是分发 Vue 组件的可复用功能的一种非常灵活方式。每个 mixin 对象可以包含全部组件选项。当组件使用 mixin 对象时，mixin 对象中的全部选项，都会被“混入(mix)”到组件自身的选项当中。

例如：

``` js
// 定义一个 mixin 对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('来自 mixin 对象的 hello！')
    }
  }
}

// 定义一个使用以上 mixin 对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "来自 mixin 对象的 hello！"
```

## 选项合并(option merging)

当 mixin 对象和组件自身的选项对象，在二者选项名称相同时，Vue 会选取合适的“合并(merge)”策略。

例如，对 data 对象进行浅合并（单个属性深合并），在冲突情况下，优先使用组件的 data。

``` js
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

具有相同名称的钩子函数，将合并到一个数组中，最终它们会被依次调用。此外，需要注意，mixin 对象中的同名钩子函数，会在组件自身的钩子函数**之前**调用。

``` js
var mixin = {
  created: function () {
    console.log('mixin 对象的钩子函数被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件的钩子函数被调用')
  }
})

// => "mixin 对象的钩子函数被调用"
// => "组件的钩子函数被调用"
```

例如，`methods`, `components` 和 `directives`，这些值为对象的选项(option)，则会被合并到相应的选项对象上。但是，在二者的键名(key)发生冲突时，就会优先使用组件选项对象中键值对：

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

注意，在 `Vue.extend()` 中，Vue 也使用了与此相同的合并策略。

## 全局 mixin(global mixin)

也可以在全局使用 mixin。请谨慎使用！一旦在全局中使用了 mixin，就会影响到之后创建的**每个**实例。在用法正确时，可以为自定义选项注入处理逻辑：

``` js
// 为自定义选项 `myOption` 注入一个处理函数
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

<p class="tip">请少量且小心谨慎地使用全局 mixin，因为这会影响到之后创建的每个 Vue 实例，包括第三方组件也会受到影响。在多数情况下，如同以上示例中所演示的，你应该只将全局 mixin，用于自定义选项的处理逻辑。还有一个比较不错的做法，就是在[插件](plugins.html)中使用全局 mixin，然后通过调用插件来复用组件功能，以避免应用程序中的重复部分。</p>

## 自定义选项的合并策略(custom option merge strategies)

在合并自定义选项(custom option)时，Vue 会使用默认策略，即覆盖已有值。如果想要定制自定义选项的合并逻辑，则需要向 `Vue.config.optionMergeStrategies` 添加一个函数：

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

对于大多数基于对象(object-based)的选项，可以使用 `methods` 的合并策略：

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

可以在 [Vuex](https://github.com/vuejs/vuex) 1.x 的合并策略里，找到一个高级用法示例：

``` js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
  if (!toVal) return fromVal
  if (!fromVal) return toVal
  return {
    getters: merge(toVal.getters, fromVal.getters),
    state: merge(toVal.state, fromVal.state),
    actions: merge(toVal.actions, fromVal.actions)
  }
}
```

***

> 原文：https://vuejs.org/v2/guide/mixins.html

***
