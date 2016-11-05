---
title: 从 Vuex 0.6.x 迁移到 1.0
type: guide
order: 27
---

> Vuex 2.0 已经发布了，但是这份指南只涵盖迁移到 1.0？这是打错了吗？此外，似乎 Vuex 1.0 和 2.0 也同时发布。这是怎么回事？我该用哪一个并且哪一个兼容 Vue 2.0呢？

Vuex 1.0 和 2.0 如下：

- 都完全支持 Vue 1.0 和 2.0
- 将在可预见的未来保留支持

然而它们的目标用户稍微有所不同。

__Vuex 2.0__ 从根本上重新设计并且提供简洁的 API，用于帮助正在开始一个新项目的用户，或想要用客户端状态管理前沿技术的用户。__此迁移指南不涵盖 Vuex 2.0 相关内容__，因此如果你想了解更多，请查阅 [Vuex 2.0 文档](https://vuex.vuejs.org/en/index.html)。

__Vuex 1.0__ 主要是向下兼容，所以升级只需要很小的改动。推荐拥有大量现存代码库的用户，或只想尽可能平滑升级 Vue 2.0 的用户。这份指南致力促进这一过程，但仅包括迁移说明。完整使用指南请查阅 [Vuex 1.0 文档](https://github.com/vuejs/vuex/tree/1.0/docs/en)。

## 带字符串属性路径的 `store.watch` <sup>替换</sup>

## 传入字符串属性路径的 `store.watch` <sup>废弃</sup>


`store.watch` 现在只接受函数。因此，下面例子你需要替换：

``` js
store.watch('user.notifications', callback)
```

为：

``` js
store.watch(
  // 当返回结果改变...
  function (state) {
    return state.user.notifications
  },
  // 执行回调函数
  callback
)
```

这帮助你更加完善的控制那些需要监听的响应式属性。

{% raw %}
<div class="upgrade-path">
  <h4>升级方法</h4>
  <p>在代码库运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>，查找在 <code>store.watch</code> 中使用字符串作为第一个参数的事例。</p>
</div>
{% endraw %}

## Store 的事件触发器 <sup>移除</sup>

store 实例不再暴露事件触发器(event emitter)接口(`on`, `off`, `emit`)。如果你之前使用 store 作为全局的 event bus，迁移说明相关内容请查阅[此章节](migration.html#dispatch-and-broadcast-removed)。

为了替换正在使用观察 store 自身触发事件的这些接口，（例如：`store.on('mutation', callback)`），我们引入新的方法 `store.subscribe`。在插件中的典型使用方式如下：

``` js
var myPlugin = store => {
  store.subscribe(function (mutation, state) {
    // Do something...
  })
}

```

更多信息请查阅[插件文档](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md)的示例。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>，查找使用了 <code>store.on</code>, <code>store.off</code>, <code>store.emit</code> 的事例。</p>
</div>
{% endraw %}

## 中间件 <sup>替换</sup>

中间件被替换为插件。插件是接收 store 作为仅有参数的基本函数，能够监听 store 中的 mutation 事件：

``` js
const myPlugins = store => {
  store.subscribe('mutation', (mutation, state) => {
    // Do something...
  })
}
```

更多详情, 请查阅 [插件文档](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方法</h4>
  <p>在代码库运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>，查找使用了 <code>middlewares</code> 选项的事例。</p>
</div>
{% endraw %}
