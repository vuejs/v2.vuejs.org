---
title: Routing
type: guide
order: 21
---

## Official Router

For most Single Page Applications, it's recommended to use the officially-supported [vue-router library](https://github.com/vuejs/vue-router). For more details, see vue-router's [documentation](http://vuejs.github.io/vue-router/).

## Simple Routing From Scratch

If you just need very simple routing and do not wish to involve a full-featured router library, you can do so by dynamically rendering a page-level component like this:

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

Combined with the HTML5 History API, you can build a very basic but fully-functional client-side router. To see that in practice, check out [this example app](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).

## Integrating 3rd-Party Routers

If there's a 3rd-party router you prefer to use, such as [Page.js](https://github.com/visionmedia/page.js) or [Director](https://github.com/flatiron/director), integration is [similarly easy](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Here's a [complete example](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) using Page.js.
