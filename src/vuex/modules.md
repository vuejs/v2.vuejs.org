---
title: Modules
type: vuex
order: 8
---

# Modules

由于使用了单一状态树，应用的所有状态都包含在一个大对象内。但是，随着我们应用规模的不断增长，这个Store变得非常臃肿。

为了解决这个问题，Vuex 允许我们把 store 分 module（模块）。每一个模块包含各自的状态、mutation、action 和 getter，甚至是嵌套模块， 如下就是它的组织方式：

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA's state
store.state.b // -> moduleB's state
```

### 模块本地状态

模块的 mutations 和 getters方法第一个接收参数是**模块的本地状态**。

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment: (state) {
      // state 是模块本地的状态。
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

相似地，在模块的 actions 中，`context.state` 暴露的是本地状态， `context.rootState`暴露的才是根状态。

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

在模块的 getters 内，根状态也会作为第三个参数暴露。

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### 命名空间

要注意，模块内的 actions、mutations 以及 getters 依然注册在**全局命名空间**内 —— 这就会让多个模块响应同一种 mutation/action 类型。你可以在模块的名称中加入前缀或者后缀来设定命名空间，从而避免命名冲突。如果你的 Vuex 模块是一个可复用的，执行环境也未知的，那你就应该这么干了。距离，我们想要创建一个 `todos` 模块：

``` js
// types.js

// 定义  getter、 action 和 mutation 的常量名称
// 并且在模块名称上加上 `todos` 前缀 
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

``` js
// modules/todos.js
import * as types from '../types'

// 用带前缀的名称来定义 getters, actions and mutations 
const todosModule = {
  state: { todos: [] },

  getters: {
    [types.DONE_COUNT] (state) {
      // ...
    }
  },

  actions: {
    [types.FETCH_ALL] (context, payload) {
      // ...
    }
  },

  mutations: {
    [types.TOGGLE_DONE] (state, payload) {
      // ...
    }
  }
}
```

### 注册动态模块

你可以用 `store.registerModule` 方法在 store 创建**之后**注册一个模块：

``` js
store.registerModule('myModule', {
  // ...
})
```

模块的 `store.state.myModule` 暴露为模块的状态。

其他的 Vue 插件可以为应用的 store 附加一个模块，然后通过动态注册就可以使用 Vuex 的状态管理功能了。例如，[`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) 库，通过在一个动态注册的模块中管理应用的路由状态，从而将 vue-router 和 vuex 集成。

你也能用 `store.unregisterModule(moduleName)` 移除动态注册过的模块。但是你不能用这个方法移除静态的模块（也就是在 store 创建的时候声明的模块）。
