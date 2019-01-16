---
title: Enrutamiento
type: guide
order: 501
---

## Router Oficial

Para la mayorias de las SPAs, es recomendado utilizar la librería con soporte oficial [vue-router](https://github.com/vuejs/vue-router). Por más detalles, ver la [documentación](https://router.vuejs.org/) de vue-router.

## Routeo simple desde cero

Si usted solo necesitar un enrutamiento muy simple y no deseas utilizar una librería de enrutamiento con todas las funcionalidades, usted puede hacerlo de renderizando dinamicamente un componente de nivel página como este:

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

Combinado con la API HTML5 History, usted puede construir un muy básico pero totalmente funcional enrutador del lado del cliente. Para ver esto en practica, visita [esta app de ejemplo](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).

## Integrando Enrutadores de terceros

Si hay algun enrutador de terceros que usted prefier utilizar, como [Page.js](https://github.com/visionmedia/page.js) o [Director](https://github.com/flatiron/director), la integracion es [igualmente fácil](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Aquí hay un [ejemplo completo](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) utilizando Page.js.
