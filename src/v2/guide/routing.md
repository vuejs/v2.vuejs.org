---
title: Routing - Чиглүүлэлт
type: guide
order: 501
---

## Албан ёсны Router

Ихэхн Single Page Application-уудын хувьд албан ёсоор дэмжигдсэн [vue-router санг](https://github.com/vuejs/vue-router) ашиглахыг зөвлөж байна. Дэлгэрэнгүй танилцахыг хүсвэл vue-router-ийн [documentation](https://router.vuejs.org/)-руу орно уу.

## Энгийн Routing From Scratch

Хэрэв та маш энгийн чиглүүлэлт хэрэгтэй бөгөөд өргөн боломжтой routing сан ашиглахыг хүсэхгүй байгаа бол хуудсуудаа динамик байдлаар ингэж хийж болно:

``` js
const NotFound = { template: '<p>Хуудас олдсонгүй</p>' }
const Home = { template: '<p>Нүүр хуудас</p>' }
const About = { template: '<p>Бидний тухай</p>' }

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

HTML5 history API-тэй хослуулан та маш энгийн боловч бүрэн ажиллагаатай клиент талын чиглүүлэгчийг бүтээж болно. Практик дээр туршсан [энэхүү жишээг харна уу](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).

## Гуравдагч Router сангууд ашиглах

Та гуравдагч чиглүүлэгч сангууд ашиглахыг хүсч байвал, [Page.js](https://github.com/visionmedia/page.js) болон [Director](https://github.com/flatiron/director), өөрийн аппдаа оруулах [маш амархан](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Энд Page.js ашигласан [бүтэн жишээ байна.](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs).
