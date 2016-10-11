---
title: 起步
type: vuex
order: 3
---

所有 Vuex 应用的中心就是 store（状态存储）。"store" 本质上是一个保存应用状态的容器。这里有两件要点，让 Vuex store 区别于普通全局对象：

1. Vuex store 是响应式的。当 Vue 组件从 store 读取状态，如果 store 中的状态更新，它们也会高效地响应更新。

2. 你不能直接更改 store 中的状态。更改状态的唯一的方法就是显式 **提交更改 (committing mutations)**。这样可以确保每次状态更改都留有可追踪的记录，并且可以使用工具帮助我们更好地理解我们的应用。

### 最简单的 Store

> **NOTE:** 我们将会在以后的示例代码中使用 ES2015 语法。如果你还没有用过，[你应该看看](https://babeljs.io/docs/learn-es2015/)！

[安装](installation.html) Vuex 之后，我们来创建一个 store。这是一个非常易懂的例子 - 只含有一个初始化状态对象，以及一些更改：

``` js
// 如果使用模块系统，确保之前调用过 Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

现在，你可以通过 `store.state` 访问状态对象，以及通过 `store.commit` 触发状态的更改：

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

再次说明，我们提交 mutation 而不是直接更改 `store.state.count`，是想要显式地追踪它。这个简单的转换使你的意图更加明显。当你阅读代码时，可以更好地了解应用中的状态更改。另外，这也让我们有机会去实现一些工具，记录修改日志、保存状态快照、甚至是进行基于时间轴的调试。

因为 store 的状态是响应式的，要在组件中使用 store 的状态，只需在 computed 属性中返回 store 的状态就行。而触发状态改变可以简单的理解为在组件方法中提交 mutation。

这是一个 [最基本的 Vuex 计数应用](https://jsfiddle.net/yyx990803/n9jmu5v7/) 的例子。

接下来，我们将在更多的细微细节中讨论每个核心思想，让我们从 [State](state.html) 开始吧。
