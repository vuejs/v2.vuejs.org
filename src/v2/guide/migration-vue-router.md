---
title: Migration depuis Vue Router 0.7.x
type: guide
order: 702
---

> Seul Vue Router 2 est compatible avec Vue 2, donc si vous mettez à jour Vue, vous devez mettre à jour Vue Router également. C'est pourquoi nous avons inclus des détails de migration ici dans les documentations principales. Pour un guide complet sur l'utilisation du nouveau Vue Router, consultez [la documentation Vue Router](https://router.vuejs.org/fr/).

## Initialisation du Routeur

### `router.start` <sup>remplacée</sup>

Il n'y a plus d'API dédiée pour initialiser Vue Router. Cela signifie qu'à la place d'utiliser :

``` js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

Vous avez juste à passer la propriété `router` à l'instance de Vue :

``` js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

Ou, si vous utilisez le build runtime de Vue :

``` js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'appel de <code>router.start</code>.</p>
</div>
{% endraw %}

## Définition des routes

### `router.map` <sup>remplacée</sup>

Les routes sont maintenant définies dans un tableau dans [une option `routes`](https://router.vuejs.org/fr/essentials/getting-started.html#javascript) lors de l'instanciation du routeur. Donc ces routes par exemple :

``` js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

Seront à présent définies ainsi :

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

La syntaxe par tableau permet une plus grande prédictibilité de la concordance des routes, puisque l'itération sur un objet ne garantit pas le même ordre d'affichage sur tous les navigateurs.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'appel de <code>router.map</code>.</p>
</div>
{% endraw %}

### `router.on` <sup>supprimée</sup>

Si vous avez besoin programmatiquement de générer les routes au démarrage de votre application, vous pouvez le faire dynamiquement en ajoutant les définitions de route dans votre tableau. Par exemple :

``` js
// Base de routes normale
var routes = [
  // ...
]

// Routes générées dynamiquement
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

Si vous avez besoin d'ajouter une nouvelle route après que le routeur soit instancié, vous pouvez remplacer l'objet de concordance des routes du routeur par un nouveau contenant la route que vous souhaitez ajouter :

``` js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'appel de <code>router.on</code>.</p>
</div>
{% endraw %}

### `router.beforeEach` <sup>changée</sup>

`router.beforeEach` fonctionne maintenant de manière asynchrone et prend une fonction de rappel `next` en tant que troisième argument.

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

``` js
router.beforeEach(function (to, from, next) {
  if (to.path === '/forbidden') {
    next(false)
  } else {
    next()
  }
})
```

### `subRoutes` <sup>renommée</sup>

[Renommée en `children`](https://router.vuejs.org/fr/essentials/nested-routes.html) pour plus de consistance entre Vue et les autres bibliothèques de routage.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>subRoutes</code>.</p>
</div>
{% endraw %}

### `router.redirect` <sup>remplacée</sup>

C'est maintenant [une option des définitions de route](https://router.vuejs.org/fr/essentials/redirect-and-alias.html). Ainsi par exemple, vous devez mettre à jour :

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

par une définition comme ci-dessous dans votre configuration de `routes` :

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'appel de <code>router.redirect</code>.</p>
</div>
{% endraw %}

### `router.alias` <sup>remplacée</sup>

C'est maintenant [une option des définitions de route](https://router.vuejs.org/fr/essentials/redirect-and-alias.html) que vous devrez mettre sous alias. Ainsi par exemple, vous devez mettre à jour :

``` js
router.alias({
  '/manage': '/admin'
})
```

par une définition comme ci-dessous dans votre configuration de `routes` :

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

Si vous avez besoin de plusieurs alias, vous pouvez aussi utiliser la syntaxe de tableau :

``` js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'appel de <code>router.alias</code>.</p>
</div>
{% endraw %}

### Propriétés de route personnalisées <sup>remplacées</sup>

Les propriétés de route personnalisées doivent maintenant être imbriquées dans une nouvelle propriété meta pour éviter les conflits avec les fonctionnalités futures. Ainsi par exemple, si vous aviez défini :

``` js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

Et bien vous devrez définir maintenant :

``` js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```

Puis quand vous accéderez à cette propriété pour une route, vous pourrez toujours y accéder via `meta`. Par exemple :

``` js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de propriétés personnalisées non imbriquées dans meta.</p>
</div>
{% endraw %}

### Syntaxe `[]` pour les tableaux dans les QueryString <sup>retirée</sup>

Quand vous passez des tableaux à des paramètres de QueryString la syntaxe `/foo?users[]=Tom&users[]=Jerry` ne fonctionne plus. À la place, la nouvelle syntaxe sera `/foo?users=Tom&users=Jerry`. En interne `$route.query.users` sera toujours un tableau, mais s'il n'y a qu'un seul paramètre dans la query `/foo?users=Tom`, quand vous accéderez à cette route, il n'y aura aucun moyen pour le routeur de savoir si nous souhaitons que `users` soit un tableau. À cause de cela, il faut ajouter une propriété calculée et remplacer toutes les références de `$route.query.users` par cela :


```javascript
export default {
  // ...
  computed: {
    // `users` sera toujours un tableau
    users () {
      const users = this.$route.query.users
      return Array.isArray(users) ? users : [users]
    }
  }
}
```

## Concordance de routes

La concordance de routes utilise maintenant [path-to-regexp](https://github.com/pillarjs/path-to-regexp) pour fonctionner, ce qui la rend plus flexible que précédemment.

### Un ou plusieurs paramètres nommés <sup>changés</sup>

La syntaxe a quelque peu changée, ainsi `/category/*tags` par exemple, doit être mis à jour pour `/category/:tags+`.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de syntaxe de route obsolète.</p>
</div>
{% endraw %}

## Liens

### `v-link` <sup>remplacée</sup>

La directive `v-link` a été remplacée par le [composant `<router-link>`](https://router.vuejs.org/fr/api/router-link.html) car ce type de travail relève du domaine des composants dans Vue 2. Cela signifie que chaque fois que vous avez un lien comme celui-ci :

``` html
<a v-link="'/about'">À propos</a>
```

Vous devez le mettre à jour ainsi :

``` html
<router-link to="/about">À propos</router-link>
```

Notez que `target="_blank"` n'est pas supporté sur `<router-link>` donc si vous avez besoin d'ouvrir un lien dans un nouvel onglet, vous devez utiliser `<a>` à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de directive <code>v-link</code>.</p>
</div>
{% endraw %}

### `v-link-active` <sup>remplacée</sup>

La directive `v-link-active` a été remplacée par un attribut de balise sur [le composant `<router-link>`](https://router.vuejs.org/fr/api/router-link.html). Donc par exemple, vous devez mettre à jour ceci :

``` html
<li v-link-active>
  <a v-link="'/about'">À propos</a>
</li>
```

par ceci :

``` html
<router-link tag="li" to="/about">
  <a>À propos</a>
</router-link>
```

Le `<a>` sera dans ce cas le lien (et amènera sur l'adresse correcte), mais la classe active sera appliquée sur le `<li>` extérieur.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de directive <code>v-link-active</code>.</p>
</div>
{% endraw %}

## Navigation programmatique

### `router.go` <sup>changée</sup>

Pour plus de consistance avec l'[API HTML5 History](https://developer.mozilla.org/fr-FR/docs/Web/API/History_API) `router.go` est maintenant utilisé pour [la navigation en arrière où en avant](https://router.vuejs.org/fr/essentials/navigation.html#routergon) alors que [`router.push`](https://router.vuejs.org/fr/essentials/navigation.html#routerpushlocation) est utilisé pour naviguer vers une page spécifique.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'utilisation de <code>router.go</code> là où <code>router.push</code> devrait être utilisé.</p>
</div>
{% endraw %}

## Options de Router : Modes

### `hashbang: false` <sup>supprimée</sup>

Les hashbangs ne sont plus requis par Google pour le parcours d'URL, il ne sont donc plus l’utilisation par défaut (ou même une option) pour la stratégie de hash.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>hashbang: false</code>.</p>
</div>
{% endraw %}

### `history: true` <sup>replacée</sup>

Tous les options de mode ont été condensées dans un seule [option `mode`](https://router.vuejs.org/fr/api/options.html#mode). Mettez à jour :

``` js
var router = new VueRouter({
  history: 'true'
})
```

avec :

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>history: true</code>.</p>
</div>
{% endraw %}

### `abstract: true` <sup>remplacée</sup>

Tous les options de mode ont été condensées dans un seule [option `mode`](https://router.vuejs.org/fr/api/options.html#mode). Mettez à jour :

``` js
var router = new VueRouter({
  abstract: 'true'
})
```

avec :

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>abstract: true</code>.</p>
</div>
{% endraw %}

## Options de Route

### `saveScrollPosition` <sup>remplacée</sup>

Ceci a été remplacé par l'[option `scrollBehavior`](https://router.vuejs.org/fr/advanced/scroll-behavior.html) qui accepte une fonction, ainsi le comportement de défilement est complètement personnalisable, même par route. Ceci ouvre de nouvelles possibilités, mais pour simplement reproduire les anciens comportements :

``` js
saveScrollPosition: true
```

vous pouvez remplacer ça par :

``` js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>saveScrollPosition: true</code>.</p>
</div>
{% endraw %}

### `root` <sup>renommée</sup>

Renommée par `base` pour plus de consistance avec l'[élément HTML `<base>`](https://developer.mozilla.org/fr-FR/docs/Web/HTML/Element/base).

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>root</code>.</p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>supprimée</sup>

Cette option n'est plus nécessaire maintenant que le système de transition de Vue a un [contrôle de transition `appear`](transitions.html#Transitions-sur-le-rendu-initial) explicite.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>transitionOnLoad: true</code>.</p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>supprimée</sup>

Supprimée grâce à une simplification des hooks. Si vous devez réellement supprimer les erreurs de transition, vous pouvez utiliser [`try`...`catch`](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Statements/try...catch) à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'options <code>suppressTransitionError: true</code>.</p>
</div>
{% endraw %}

## Hooks de Route

### `activate` <sup>remplacée</sup>

Utilisez [`beforeRouteEnter`](https://router.vuejs.org/fr/advanced/navigation-guards.html#interception-par-composant) dans le composant à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de hook <code>beforeRouteEnter</code>.</p>
</div>
{% endraw %}

### `canActivate` <sup>remplacée</sup>

Utilisez [`beforeEnter`](https://router.vuejs.org/fr/advanced/navigation-guards.html#interception-par-route) dans le composant à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de hook <code>canActivate</code>.</p>
</div>
{% endraw %}

### `deactivate` <sup>remplacée</sup>

Utilisez le [`beforeDestroy`](../api/#beforeDestroy) du composant ou le hook [`destroyed`](../api/#destroyed) à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de hook <code>deactivate</code>.</p>
</div>
{% endraw %}

### `canDeactivate` <sup>remplacée</sup>

Utilisez [`beforeRouteLeave`](https://router.vuejs.org/fr/advanced/navigation-guards.html#interception-par-composant) dans le composant à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de hook <code>canDeactivate</code>.</p>
</div>
{% endraw %}

### `canReuse: false` <sup>remplacée</sup>

Il n'existe plus de cas comme celui-ci dans le nouveau Vue Router.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'option <code>canReuse: false</code>.</p>
</div>
{% endraw %}

### `data` <sup>remplacée</sup>

La propriété `$route` est maintenant réactive donc vous pouvez juste utiliser un observateur pour réagir au changement de route comme ceci :

``` js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de hook <code>data</code>.</p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>supprimée</sup>

Définissez votre propre propriété (par ex . `isLoading`) quand vous mettez à jour l'état de chargement d'un observateur sur une route. Par exemple, si vous récupérez les données avec [axios](https://github.com/mzabriskie/axios) :

``` js
data: function () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': function () {
    var self = this
    self.isLoading = true
    self.fetchData().then(function () {
      self.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    var self = this
    return axios.get('/api/posts')
      .then(function (response) {
        self.posts = response.data.posts
      })
      .catch(function (error) {
        self.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de propriété meta <code>$loadingRouteData</code>.</p>
</div>
{% endraw %}
