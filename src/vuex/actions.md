---
title: Actions
type: vuex
order: 7
---

action 和 mutation 类似，区别在于：

- action 不改变状态，只提交(commit) mutation。
- action 可以包含任意异步操作。

让我们注册一个简单的 action：

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 处理函数接收一个上下文对象(context object)，该对象提供了跟 store 实例相同的方法/属性，因此你可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 和 `context.getters` 访问 state 和 getters。稍后我们会介绍 [Modules](modules.html)，我们将看到为什么上下文对象 (context object) 不是 store 实例自身。

在实践中，我们经常用到 ES2015 [参数解构](https://github.com/lukehoban/es6features#destructuring) 来简化代码（特别是我们要多次调用 `commit` 的时候）：

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### 分发(Dispatch) Action

使用 `store.dispatch` 方法触发 action。

``` js
store.dispatch('increment')
```

这看起来很蠢：如果我们想增加 count，为什么我们不直接调用 `store.commit('increment')`？回想起**mutation 必须是同步函数** 了吗？action 可以不是同步函数。我们可以在 action 回调函数中执行 **异步操作**：

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

action 同样支持 payload 格式和对象风格的 dispatch：

``` js
// dispatch 传入 payload
store.dispatch('incrementAsync', {
  amount: 10
})

// dispatch 传入一个对象
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

日常生活行为中，更实际的例子是购物车结帐，涉及**调用异步 API**和**分发多重 mutations**：

``` js
actions: {
  checkout ({ commit, state }, payload) {
    // 把当前购物车的商品备份起来
    const savedCartItems = [...state.cart.added]
    // 发送结帐请求，并愉快地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接收一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

注意，我们执行的是一个异步操作的流程，并通过提交 action 来记录其副作用（状态变化）。

### 组件中分发 Action

使用 `this.$store.dispatch('xxx')`（需要根组件中注入 `store` ）在组件中分发 action，使用 `mapActions` 工具函数，映射组件方法到调用 `store.dispatch`：

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // 映射 this.increment() 到 this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // map this.add() to this.$store.dispatch('increment')
    })
  }
}
```

### 组合多个 Action

Action 通常是异步的，所以我们如何知道一个 action 何时完成？更重要的是，我们如何组合多个 action 一起操作复杂的异步流程？

第一件事是知道 `store.dispatch` 返回『action 回调函数被触发后的返回值』，所以你可以在 action 中返回一个 Promise 对象。

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

现在你可以这么做：

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

然后在另一个 action ：

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

最后，如果我们使用 [async / await](https://tc39.github.io/ecmascript-asyncawait/)，很快落地的 JavaScript 特性，我们可以这样组合我们的 action：

``` js
// 假定 getData() and getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 结束
    commit('gotOtherData', await getOtherData())
  }
}
```

> `store.dispatch` 可能会在不同模块中，触发多个 action 回调函数。在这种情况下，返回值是一个 Promise 对象，该对象在所有被触发的回调都 resolve 之后自己再 resolve。
