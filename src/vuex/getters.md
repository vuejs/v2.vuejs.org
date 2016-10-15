---
title: Getters
type: vuex
order: 5
---

有时，我们可能需要基于 store 中的状态来计算推导状态，例如过滤一个项目列表，并对过滤结果进行计数：

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

如果多个组件需要用到这个推导后的状态，那我们就必须到处重复写该计算属性函数；或者将其提取到一个公共的工具函数中，并将公共函数多处导入 - 两者都不太理想。

Vuex 允许我们在 store 定义 "getters" （将它们视为 store 的计算属性）。getter 函数将接收 state 作为第一个参数：

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

这些 getter 函数将导出在 `store.getters` 对象上：

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

getter 函数也接收其他 getter 作为第二个参数：

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

现在我们可以轻松地在任意组件中使用 getter 了：

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

### `mapGetters` 工具函数

`mapGetters` 工具函数会将 store 中的 getter 映射到局部计算属性中。

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象扩展操作符把 getter 混入到 computed 中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

如果你要将 getter 映射为不同的名称，请使用一个对象：

``` js
mapGetters({
  // 映射 this.doneCount 到 store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```
