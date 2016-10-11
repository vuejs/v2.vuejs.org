---
title: 混合
type: guide
order: 17
---

## 基础

混合是一种灵活的分布式复用 Vue 组件的方式。混合对象可以包含任意组件选项。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。

例子：

``` js
// 定义一个混合对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混合对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // -> "hello from mixin!"
```

## 选项合并

当组件和混合对象含有同名选项时, 这些选项将以恰当的方式混合。比如，同名钩子函数将混合为一个数组，因此都将被调用。另外，混合对象的 钩子将在组件自身钩子 **之前** 调用 ：

``` js
var mixin = {
  created: function () {
    console.log('mixin hook called')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('component hook called')
  }
})

// -> "混合对象的钩子被调用"
// -> "组件钩子被调用"
```

值为对象的选项, 例如 `methods`, `components` 和 `directives`，将被混合为同一个对象。 两个对象键名冲突时，取组件对象的键值对。

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

vm.foo() // -> "foo"
vm.bar() // -> "bar"
vm.conflicting() // -> "from self"
```

注意： `Vue.extend()` 也使用同样的策略进行合并。

## 全局混合

也可以全局注册混合对象。 注意使用！ 一旦使用全局混合对象，将会影响到 **所有** 之后创建的 Vue 实例。使用恰当时，可以为自定义对象注入处理逻辑。

``` js
// 为自定义的选项 'myOption' 注入一个处理器。 
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
// -> "hello!"
```

<p class="tip">谨慎使用全局混合对象，因为会影响到每个单独创建的 Vue 实例（包括第三方模板）。大多数情况下，只应当应用于自定义选项，就像上面示例一样。 也可以将其用作 [Plugins](/guide/plugins.html) 以避免产生重复应用</p>

## 自定义选项混合策略

自定义选项将使用默认策略，即简单地覆盖已有值。 如果想让自定义选项以自定义逻辑混合，可以向 `Vue.config.optionMergeStrategies` 添加一个函数：

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

对于大多数对象选项，可以使用 `methods` 的合并策略:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

更多高级的例子可以在 [Vuex](https://github.com/vuejs/vuex) 1.x的混合策略里找到:

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

> 原文： http://vuejs.org/guide/mixins.html

***
