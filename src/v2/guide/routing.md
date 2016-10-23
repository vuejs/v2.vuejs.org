---
title: Routing
type: guide
order: 21
---

## Router Oficial

Para a maioria das Single Page Applications, é recomendado usar a biblioteca oficialmente suportada [vue-router](https://github.com/vuejs/vue-router). Para mais detalhes, veja a [documentação](http://vuejs.github.io/vue-router/) do vue-router.

## Criando Rotas Simples

Se você precisa apenas de rotas muito simples e não deseja adicionar uma biblioteca completa de rotas, você pode renderizar componentes/páginas dinamicamente deste modo:

``` js
const NotFound = { template: '<p>Página não encontrada</p>' }
const Home = { template: '<p>Página Inicial</p>' }
const About = { template: '<p>Sobre</p>' }

const routes = {
  '/': Home,
  '/sobre': About
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

Combinado com a API de histórico do HTML5, você pode criar um router do lado do cliente muito básico, porém totalmente funcional. Para ver isso na prática, confira este [aplicativo de exemplo](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).

## Integração com routers de terceiros

Se há uma bliblioteca de terceiros para rotas que você prefira usar, como [Page.js](https://github.com/visionmedia/page.js) ou [Director](https://github.com/flatiron/director), a integração é [igualmente fácil](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Aqui está um [exemplo completo](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) usando Page.js.
