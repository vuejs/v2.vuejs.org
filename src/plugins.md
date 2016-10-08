---
title: 插件
type: guide
order: 18
---

## 开发插件


插件通常会为Vue添加全局功能。插件的范围没有限制--一般有下面几种：

1. 添加全局方法或者属性，如: [vue-element](https://github.com/vuejs/vue-element) 

2. 添加全局资源：指令/过滤器/过渡等。如 vue-touch [vue-touch](https://github.com/vuejs/vue-touch)

3. 通过全局 mixin方法 添加一些组件选项。 如: [vuex](https://github.com/vuejs/vuex)

4. 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。

5. A一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)

Vue.js 的插件应当有一个公开方法 `install` 。这个方法的第一个参数是 `Vue` 构造器 , 第二个参数是一个可选的选项对象:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // something logic ...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // something logic ...
    }
    ...
  })

  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // something logic ...
    }
    ...
  })

  // 4. 添加事例方法
  Vue.prototype.$myMethod = function (options) {
    // something logic ...
  }
}
```

## 使用插件

通过 Vue.use() 全局方法使用插件:

``` js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```

也可以传入一个选项对象:

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` 会自动阻止注册相同插件多次，届时只会注册一次该插件。

一些插件，如  `vue-router` 如果 `Vue` 是全局变量则自动调用`Vue.use()` 。不过在模块环境中应当始终显式调用  `Vue.use()` :

``` js
// 通过 Browserify 或 Webpack 使用 CommonJS 兼容模块
var Vue = require('vue')
var VueRouter = require('vue-router')

// 不要忘了调用此方法
Vue.use(VueRouter)
```

[awesome-vue](https://github.com/vuejs/awesome-vue#libraries--plugins) 集合了来自社区贡献的数以千计的插件和库。



