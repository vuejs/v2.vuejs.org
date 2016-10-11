---
title: 插件
type: vuex
order: 10
---

Vuex 的 store 接收 `plugins` 选项，这个选项暴露出每个 mutation 的钩子。一个 Vuex 的插件就是一个简单的方法，接收 sotre 作为唯一参数：

``` js
const myPlugin = store => {
  // 当 store 在被初始化完成时被调用
  store.subscribe((mutation, state) => {
    // mutation 之后被调用
    // mutation 的格式为 {type, payload}。
  })
}
```
然后像这样使用：

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### 在插件内提交 Mutations

插件不能直接修改状态 - 这就像你的组件，它们只能被 mutations 来触发改变。

通过提交 mutations，插件可以用来同步数据源到 store。例如， 为了同步 websocket 数据源到 store (这只是为说明用法的例子，在实际中，`createPlugin` 方法会附加更多的可选项，来完成复杂的任务)。

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### 生成状态快照

有时候插件想获取状态 “快照” 和状态的改变前后的变化。为了实现这些功能，需要对状态对象进行深拷贝：

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // 对比 prevState 和 nextState...

    // 保存状态，用于下一次 mutation
    prevState = nextState
  })
}
```

** 生成状态快照的插件只能在开发阶段使用，使用 Webpack 或 Browserify，让构建工具帮我们处理：

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

插件默认会被起用。为了发布产品，你需要用 Webpack 的 [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) 或者 Browserify 的 [envify](https://github.com/hughsk/envify) 来转换 `process.env.NODE_ENV !== 'production'` 的值为 `false`。

### 内置 Logger 插件

> 如果你正在使用 [vue-devtools](https://github.com/vuejs/vue-devtools)，你可能不需要。

Vuex 带来一个日志插件用于一般的调试:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

`createLogger` 方法有几个配置项：

``` js
const logger = createLogger({
  collapsed: false, // 自动展开记录 mutation
  transformer (state) {
    // 在记录之前前进行转换
    // 例如，只返回指定的子树
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutation 格式 { type, payload }
    // 我们可以按照想要的方式进行格式化
    return mutation.type
  }
})
```

日志插件还可以直接通过 `<script>` 标签, 然后它会提供全局方法 `createVuexLogger` 。

要注意，logger 插件会生成状态快照，所以仅在开发环境使用。
