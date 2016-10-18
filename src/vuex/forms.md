---
title: 表单处理
type: vuex
order: 12
---

严格模式下的Vuex，在属于 Vuex 的 state （状态）上使用 `v-model`时会比较棘手：

``` html
<input v-model="obj.message">
```


假设 `obj` 计算的属中返回一个对象，在用户输入时，`v-modle`会尝试直接修改`obj.message`。在严格模式下，因为修改不在Vuex mutation handler中执行,将会抛出一个错误。

用“Vuex思维”去处理是给`<input>`绑定value（值），然后帧听`<input>`或`change`事件，并在回调中调用action：

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

在这里使用 mutation handler(变更句柄):

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### 双向计算属性

必须承认，上述比`v-modle`+本机状态(local state)啰嗦得多，以及从`v-modle`中弃用了一些有用的功能。使用 setter 双向计算属性的另一种方法：

``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```

