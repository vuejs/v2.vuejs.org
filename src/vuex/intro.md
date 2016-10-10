---
title: 什么是 Vuex
type: vuex
order: 2
---

Vuex 是一个专门为 Vue.js 应用设计的 **状态管理模型 + 库**。它为应用内的所有组件提供集中式存储服务，其中的规则确保状态只能按预期方式变更。它可以与 Vue 官方[开发工具扩展(devtools extension)](https://github.com/vuejs/vue-devtools) 集成，提供高级特征，比如 零配置时空旅行般（基于时间轴）调试，以及状态快照 导出/导入。

### 什么是”状态管理模型“？

让我们从一个简单的 Vue 计数器应用开始：

``` js
new Vue({
  // state (状态)
  data () {
    return {
      count: 0
    }
  },
  // view (视图)
  template: `
    <div>{{ count }}</div>
  `,
  // actions (动作)
  methods: {
    increment () {
      this.count++
    }
  }
})
```

这是一个含有以下部分的自包含( self-contained )应用： 

- **state (状态)**，驱动我们应用的真实的源；
- **view (视图)**，对应着 **状态** 的声明式映射；
- **actions (动作)**，用户在 **视图** 上的输入引起状态的更改的可能方式。

这是一个非常简单的“单向数据流”思想的体现：

<p style="text-align: center; margin: 2em">
  <img style="max-width:450px;" src="./images/flow.png">
</p>

不管怎样，当我们有**多组件共享公共状态**时，简单快速地分解如下：

- 多视图可能依赖于同一份状态。
- 来自不同视图的动作可能需要变更同一份状态。

对于问题一，在深层嵌套组件间传递属性过于冗长，并且不能简单地在同级别的组件间传递。对于问题二，我们常常采取这样的解决方案：直接引用 父/子 实例，又或是通过事件来修改和同步多份状态副本。这样的模型是脆弱的，代码很快会变得不可维护。

所以我们为什么不从多个组件中把共享状态提取出来并作为全局单件管理呢？这样的话，我们的组件树就变成了一个大的”视图“，树中的任意一个组件，不管它们在哪个位置，都可以访问状态或者触发动作！

另外，通过定义和分离状态管理中的概念，强制使用某些规则，使得代码更结构化和高可维护性。

这是 Vuex 背后的基本思想，受到了 [Flux](https://facebook.github.io/flux/docs/overview.html)，[Redux](http://redux.js.org/) 和 [The Elm Architecture](https://guide.elm-lang.org/architecture/)的启发。不像其他模型，Vuex 也是一个专门为 Vue.js 设计的库，充分利用了它微妙的响应式机制，从而实现高效更新。

![vuex](./images/vuex.png)

### 什么时候应该使用?

尽管 Vuex 帮助我们处理共享状态管理，但是也带来了更多的思考和样板文件。这是一个短期效益和长期效益的权衡。

如果你没有开发过大型的单页应用(SPA)就立刻上 Vuex，可能会觉得繁琐然后排斥，这是很正常的 —— 如果是个简单的应用，大多数情况下，不用 Vuex 还好，你要的可能就是个简单的 [全局事件总线(global event bus)](../guide/components.html#非父子组件通信)。不过，如果你构建的是一个中到大型单页应用，当你在考虑如何更好的在 Vue 组件外处理状态时，Vuex 自然就是你的下一步选择。Redux 的作者有一句话说的不错：

> 原文：Flux libraries are like glasses: you’ll know when you need them.
> 译文：Flux 库就像眼镜：当你需要它们的时候你会懂的。
