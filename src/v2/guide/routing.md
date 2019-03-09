---
title: Routing
type: guide
order: 501
---

## *Router* Resmi

Bagi sebagian besar *Single Page Applications*, direkomendasikan untuk menggunakan [pustaka vue-router](https://github.com/vuejs/vue-router) yang resmi didukung VueJS. Lebih detailnya, lihat pada laman [dokumentasi](https://router.vuejs.org/) vue-router.

## *Routing* Simpel dari Awal

Jika Anda hanya membutuhkan *routing* yang sangat simpel dan tidak melibatkan fitur lengkap dari pustaka *router*, Anda bisa melakukannya dengan me-render secara dinamis sebuah komponen yang berperan sebagai halaman seperti berikut :

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

Dikombinasikan dengan *HTML5 History API*, Anda dapat membuat *client-side router* yang sangat mendasar namun berfungsi penuh. Untuk melihat bagaimana cara mengimplementasikannya, silakan cek [contoh aplikasi ini](https://github.com/chrisvfritz/vue-2.0-simple-routing-example)

## Integrasi dengan *Router* pihak ketiga

Jika Anda lebih nyaman menggunakan pustaka *router* pihak ketiga, seperti [Page.js](https://github.com/visionmedia/page.js) or [Director](https://github.com/flatiron/director), integrasinya [mudah, tidak berbeda jauh](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Berikut ini [contoh lengkap](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) menggunakan *Page.js*.
