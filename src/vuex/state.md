---
title: State
type: vuex
order: 4
---

### 单一状态树

Vuex 使用 **单一状态树** - 是的，用一个对象就包含了全部的应用层级状态，然后作为一个『唯一数据源(SSOT)』而存在。这也意味着，每一个应用将只有一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

单状态树和模块化并不冲突 - 在后面的章节里我们会讨论如何将状态(state)和状态变更事件(mutation)分布到各个子模块中。

### 在 Vue 组件中获得 Vuex 状态

那么我们如何在 Vue 组件中展示状态呢？由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法，就是在[计算属性](http://vuejs.org/guide/computed.html)的函数中直接返回某个 store 的状态：

``` js
// 创建一个计数器组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

当 `store.state.count` 发生变化，将会引发重新对计算属性取值，并且相关联的 DOM 将触发更新。

然而，这种模式导致组件依赖于全局状态单例。当使用模块系统时，还需要在每个组件都去引入 store，才能使每个组件都能使用 store 的状态，同时测试组件时也需要模拟出 store。

Vuex 提供一个机制，设置 `store` 选项（启用`Vue.use(Vuex)`）将 store 从根组件『注入』到每一个子组件中：

``` js
const app = new Vue({
  el: '#app',
  // 使用 "store" 选项后，可以注册 store 对象。将会把 store 实例注入到所有子组件。
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

通过在根实例中注册 `store` 选项，该 store 实例会被注入到根组件下的所有子组件中，并且子组件可以通过 `this.$store` 来访问。让我们一起调整刚才 `计数器` 的实现：

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### `mapState` 工具

当一个组件需要引用 store 的多个 state 属性或 getter 函数时，声明列举出所有计算属性会变得重复且繁琐。为了解决这个问题，我们可以使用 `mapState` 工具，它为我们生成 computed 所需的很多个 getter 函数，帮助我们节省一些键盘按键(^_^)：

``` js
// vuex 提供了独立的构建工具函数 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可以让代码非常简洁
    count: state => state.count,

    // 传入字符串 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 想访问局部状态，就必须借助于一个普通函数，函数中使用 `this` 获取局部状态
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

当计算属性名称和状态子树名称对应相同时，我们可以向 `mapState` 工具函数传入一个字符串数组。

``` js
computed: mapState([
  // 映射 state.count 到 store.this.count
  'count'
])
```

### 对象扩展运算符

注意，`mapState` 返回一个对象。我们如何使用 mapState 合并其他局部的计算属性呢？通常地，为了将多个对象合并为一个对象，再把这个合并好的最终对象传入到 `computed` 属性去，我们不得不使用一个工具函数来实现。然而有了[对象扩展运算符](https://github.com/sebmarkbage/ecmascript-rest-spread)（ECMAScript 提案 stage-3），我们可以大大简化语法：

``` js
computed: {
  localComputed () { /* ... */ },
  // 使用对象扩展运算符，将 mapState 返回的对象和外层其他计算属性混合起来
  ...mapState({
    // ...
  })
}
```

### 组件仍然可以具有局部状态

使用 Vuex 并不意味你应该把 **所有** 状态都放在 Vuex 中去管理。尽管把更多的状态放到 Vuex 管理，会让状态变化变得更加清晰和可调试，但有时也能使代码变得冗余和不直观。如果某部分状态严格属于一个单独的组件，那就只把这部分状态作为局部状态就好了。你应该权衡利弊，做适合您的 App 开发需求的决策。
