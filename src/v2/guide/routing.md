---
title: Routage
type: guide
order: 21
---

## Routeur officiel

Pour la plupart des applications monopages, il est recommandé d'utiliser la bibliothèque officiellement supportée [vue-router](https://github.com/vuejs/vue-router). Pour plus de détails, voir la [documentation](https://router.vuejs.org/) de vue-router.

## Du routage simple en partant de zéro

Si vous avez simplement besoin d'un routage très simple et ne souhaitez pas ajouter une bibliothèque riche en fonctionnalités, vous pouvez le faire en déclenchant dynamiquement le rendu d'un composant de page de cette manière :

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
Combiné à l'API HTML5 History, vous pouvez construire un routeur client basique mais parfaitement fonctionnel.
Pour en voir une démonstration, faites un checkout [de cette application d'exemple](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).

## Intégrer des routeurs tierce-partie

S'il y a un routeur tierce-partie que vous préférez utiliser, tel que [Page.js](https://github.com/visionmedia/page.js) ou [Director](https://github.com/flatiron/director),  l'intégration est [tout aussi simple](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Voici [un exemple complet](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) qui utilise Page.js.
