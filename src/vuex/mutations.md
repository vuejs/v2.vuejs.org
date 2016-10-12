---
title: Mutations
type: vuex
order: 6
---

在 Vuex store 中，实际改变 状态(state) 的唯一方式是通过 提交(commit) 一个 mutation。 Vuex 的 mutation 和事件系统非常相似：每个 mutation 都有一个字符串 **类型(type)** 和 一个 **回调函数(handler)**。回调函数是我们执行实际修改状态的地方，它将接收 状态(state) 作为第一个参数。

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 改变 state
      state.count++
    }
  }
})
```

你不能直接调用 mutation 的回调函数。选项 mutations 在这里更像是注册事件：“当触发类型为 `increment` 的 mutation 时，执行其回调函数。”所以你需要调用该类型的 **store.commit** 才能执行 mutation 的回调函数。

``` js
store.commit('increment')
```

### Commit 传入 Payload

向 `store.commit` 传递一个额外的参数，这个参数被称为 **payload** ：

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('increment', 10)
```

多数情况下，payload 应该是一个对象，以便它可以包含多个字段，这样 mutation 记录中有了 payload 字段名，可描述性会变得更好。

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
``` js
store.commit('increment', {
  amount: 10
})
```

### 对象风格的 Commit

提交 mutation 的另一种替代方式，是直接使用具有 `type` 属性的对象：

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

当使用对象风格的 commit，整个对象都会被作为 payload 参数传入到对应类型的 mutation 的回调函数中，不过回调函数还保持不变：

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### 静默的 Commit

> 注意：一旦我们实现了 devtools 中过滤 mutation，此特性可能会被弃用。

默认情况下，每个提交过的 mutation 都会被发送到插件（如 devtools）。然而在某些情况下，你可能不希望插件去记录每个状态更改。像是在短时间多次提交到 store 或轮询，并不总是需要跟踪。在这种情况下你可以在 `store.commit` 中传入第三个参数，来指定插件中的 mutation 是否“静默”。

``` js
store.commit('increment', {
  amount: 1
}, { silent: true })

// 使用对象风格的 dispatch
store.commit({
  type: 'increment',
  amount: 1
}, { silent: true })
```

### 遵循 Vue 响应式规则

由于 Vue 中 Vuex store 的状态是响应式的，当我们改变状态，Vue 组件观察到状态改变将自动更新。这也意味着 Vuex mutation 同样遵循纯 Vue 响应式规则。

1. 推荐预先初始化 store 中你所需的初始状态。

2. 向对象添加新的属性时，你应该这样做：

  - 使用 `Vue.set(obj, 'newProp', 123)`, 或 -

  - 用新的对象替换该对象。例如，使用 stage-2 [对象扩展语法](https://github.com/sebmarkbage/ecmascript-rest-spread) 我们可以这样写：

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### 用常量命名 Mutation

在各种 Flux 实现中，使用常量作为 mutation 类型是一种常见的模式。这允许代码利用工具如 linters，将所有常量放在一个单独文件中，尽可能使协作者对整个应用的 mutation 一目了然。

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们能够通过使用“ES2015 属性名表达式”功能，来使用常量作为函数名称
    [SOME_MUTATION] (state) {
      // 改变状态
    }
  }
})
```

是否使用常量在很大程度上是一个偏好 - 在多人合作开发的大型项目中它很有用，但如果你不喜欢使用，它也是完全可选的。

### Mutation 必须是同步函数

一个重要的原则就是牢记 **mutation 必须是同步函数**。为什么？考虑下面的例子：

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

现在想象我们正在调试应用程序，并查看 devtool 的 mutation 记录。每个 mutation 记录，devtool 将需要捕获每个状态“之前”和“之后”的快照。然而，上面的示例中 mutation 内部的异步回调使得这是不可能的：当 mutation 被提交后，回调函数还未被调用，也没有办法让 devtool 知道回调函数在何时被调用 - 即在回调函数中执行任意状态变更，实际上都无法跟踪。

### 组件中提交 Mutation

可以在组件中使用 `this.$store.commit('xxx')` 提交 mutation，或者使用 `mapMutations` 工具遍历组件方法到 `store.commit` 的回调上(需要把 `store` 注入根组件)

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // 映射 this.increment() 到 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // 映射 this.add() 到 this.$store.commit('increment')
    })
  }
}
```

### 下一步：Actions

在 mutation 中混合异步调用会导致你的程序很难调试。例如当你调用两个都含有异步回调的方法去改变状态，你如何知道他们何时被调用和哪个回调被首先调用？这正是我们分离 Mutation 和 Action 这两个概念的原因。在 Vuex，**Mutation 必须是同步事务**：

``` js
store.commit('increment')
// 类型为 "increment" 的 mutation 提交后，可能引起的任意状态变化，都应该在此时同步完成
```

为了处理异步操作，接下来我们介绍 [Actions](actions.html)。
