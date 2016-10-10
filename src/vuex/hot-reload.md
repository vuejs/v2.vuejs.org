---
title: 热重载
type: vuex
order: 14
---

Vuex 支持在开发中使用webpack的[Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html) 热重载 mutations，modules ，actions 和 getters，你也可以在 Browserify 里使用  [browserify-hmr](https://github.com/AgentME/browserify-hmr/) 插件来实现同样的功能。

对于mutations 和 modules，你只需要简单地调用 store.hotUpdate():

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // 使 actions 和 mutations 成为可热重载模块
  module.hot.accept(['./mutations', './modules/a'], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 .default
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // 成新的 mutation 和 mudule
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

查看[热重载的例子](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) 来开始使用热重载
