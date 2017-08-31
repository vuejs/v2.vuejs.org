---
title: 路由
type: guide
order: 501
---

## 官方路由

对于大多数单页面应用程序，推荐使用官方支持的 [vue-router 库](https://github.com/vuejs/vue-router)。更多细节请查看 vue-router 的[文档](https://router.vuejs.org/)。

## 从零开始基本路由

如果你只是需要非常基本的路由，而不希望涉及到功能全面路由库，那么你可以通过如下方式动态渲染页面级别组件：

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

结合 HTML5 History API，可以构建出一个非常基本但功能全面的客户端路由器(client-side router)。想要了解实际效果，请查看[示例应用程序](https://github.com/chrisvfritz/vue-2.0-simple-routing-example)。

## 集成第三方路由

如果有个人非常喜欢的第三方路由，如 [Page.js](https://github.com/visionmedia/page.js) 或 [Director](https://github.com/flatiron/director)，与 Vue 集成也[同样轻松](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs)。这里有一个使用 Page.js 的[完整示例](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs)。

***

> 原文：https://vuejs.org/v2/guide/routing.html

***
