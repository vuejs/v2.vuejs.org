---
title: 路由
type: guide
order: 20
---

## 官方路由

对于大多数单页面应用，都推荐使用官方支持的[vue-router库](https://github.com/vuejs/vue-router)。更多细节可以看[vue-router文档](http://vuejs.github.io/vue-router/)。

## 从零开始简单的路由

如果需要非常简单的路由，可以动态渲染一个页面级的组件像这样：

``` js
const NotFound = { template: '<p>Page not found</p>' }
const Home = { template: '<p>home page</p>' }
const About = { template: '<p>about page</p>' }

const routes = {
  '/': Home,
  '/about': About
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
```
结合HTML5 History API，你可以建立一个非常基本但功能齐全的客户端路由器。可以直接看[实例应用](https://github.com/chrisvfritz/vue-2.0-simple-routing-example)

## 整合第三方路由

如果有非常喜欢的第三方路由，如[Page.js](https://github.com/visionmedia/page.js)或者 [Director](https://github.com/flatiron/director), 整合[很简单](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs)。 这有个用了Page.js的[复杂示例](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) 。

***

> 原文： http://vuejs.org/guide/routing.html

***
