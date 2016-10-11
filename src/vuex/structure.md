---
title: 应用结构
type: vuex
order: 9
---

实际上，Vuex 在怎么组织你的代码结构上面没有任何限制，相反，它强制规定了一系列高级的原则：

1. 应用级的状态集中放在 store 中。

2. 改变状态的唯一方式是提交**mutations**，这是个同步的事务。

3. 异步逻辑应该封装在**action** 中。

只要你遵循这些规则，怎么构建你的项目的结构就取决于你了。如果你的 store 文件非常大，仅仅拆分成 action、mutation 和 getter 多个文件即可。

对于稍微复杂点的应用，我们可能都需要用到模块。下面是一个简单的项目架构：

``` bash
├── index.html
├── main.js
├── api
│   └── ... # 这里发起 API 请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 组合 modules 、export store
    ├── actions.js        # 根 action
    ├── mutations.js      # 根 mutations
    └── modules
        ├── cart.js       # cart 模块
        └── products.js   # products 模块
```

关于更多，查看 [购物车实例](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart)。