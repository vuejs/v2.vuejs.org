---
title: Rendu côté serveur
type: guide
order: 24
---

## Avez-vous besoin d'un rendu côté serveur ?

Avant de plonger dans le SRR (pour *Server-side Rendering* soit Rendu côté serveur), explorons en quoi cela pourrait vous est utile et quand l'utiliser.

### La SEO

Google et Bing peuvent parfaitement indéxer les applications JavaScript synchrones. _Synchrone_ est le mot-clé important ici. Si votre application démarre avec une animation de chargement, puis charge le contenu via des requêtes Ajax, les moteurs d'indexation n'attendrons que ces opérations soit fini.

Cela signifie que si vous avez du contenu qui s'affiche de manière asynchone sur des pages ou la SEO, Le SSR devient nécessaire.

### Navigateurs avec connexion bas-débit

Les utilisateurs pourrait visiter votre site depuis des lieux avec une connexion Interne bas-débit – ou juste depuis une mauvaise connexion cellulaire. Dans ces cas, vous souhaitez mimimiser le nombre et la taille des requêtes nécéssaire à l'utilisateur pour afficher ce contenu minimal.

Vous pouvez utiliser l'[outil Webpack de découpe de code](https://webpack.js.org/guides/code-splitting-require/) pour ne pas forcer l'utilisateur à télécharger votre application entière pour voir une seule page, mais cela ne sera jamais aussi performant que de télécharger une seule page de contenu HTML à rendu statique.

### Navigateurs avec vieux (ou juste sans) moteur JavaScript

Pour plusieurs lieux autour du monde, utiliser un ordinateur avec 1998 pour accéder à Interne est encore la seule option possible. Puisque Vue ne fonctionne que pour des versions de IE9+, vous devez toujours délivrer un contenu minimal pour ses anciens navigateurs — ou pour les hackers hipsters utilisant [Lynx](http://lynx.browser.org/) depuis un terminal.

### SSR vs. Rendu statique

Si vous vous penchez sur le SSR pour améliorer la SEO d'une poignées de pages vitrines (ex. : `/`, `/about`, `/contact`, etc), alors vous voudriez probablement utiliser du __rendu statique__ à la place. Au lieu d'utiliser le serveur pour générer code HTML à la demande, le rendu statique utilise des pages générer en amont lors de la phase de *build* du site. L'avantage est que mettre en place du rendu statique est plus simple et vous permet de garder la partie frontale d'un site complètement statique.

Si vous utilisez Webpack, vous pouvez facilement générer du rendu statique avec [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin). Il a beaucoup été testé avec des apps Vue — en fait, son créateur est un membre de l'équipe offcielle de Vue.

## Hello World

Si vous êtes arrivez jusqu'ici, vous êtes près pour voir le SSR en action. Ça semble complexe, mais un simple script node peut présenter la fonctionnalité en 3 étapes :

``` js
// Étape 1: Créer une instance de Vue
var Vue = require('vue')
var app = new Vue({
  render: function (h) {
    return h('p', 'hello world')
  }
})

// Étape 2: Créer un générateur de rendu
var renderer = require('vue-server-renderer').createRenderer()

// Étape 3: Faire le rendu de l'instance de Vue en HTML
renderer.renderToString(app, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">hello world</p>
})
```

Pas si effrayant, non ? Bien sûr, cette exemple est plus simple que la plupart de ceux des applications. Nous ne nous sommes pas encore préoccupé :

- du serveur web
- de la réponse sous forme de flux
- du cache du composant
- du processus de build
- du routage
- de l'hydratation d'état avec Vuex

Dans la suite de ce guide, nous allons voir comment fonctionne nombre de ces fonctionnalités. Une fois que vous serez familier avec les bases, nous vous orienterons vers de la documentation détaillé et des exemples avancés pour vous aider sur des cas plus concrets.

## SSR simple avec le serveur web Express

C'est un peu simple d'appeler ça du « Server-side Rendering » quand nous n'avons pas de web serveur, alors réglons ça. Nous allons créer une application de SRR vraiment simple, en utilisant uniquement une syntaxe ES5 sans aucune étape de build ou de plugins Vue.

Nous allons commencer avec une application qui va juste dire à l'utilisateur depuis combien de secondes il est sur la page :

``` js
new Vue({
  template: '<div>Vous êtes ici depuis {{ counter }} seconde(s).</div>',
  data: {
    counter: 0
  },
  created: function () {
    var vm = this
    setInterval(function () {
      vm.counter += 1
    }, 1000)
  }
})
```

Pour adapter ça au SSR, il y a quelques modifications à faire, cela permettra au code de fonctionner aussi bien côté navigateur que côté node :

- Quand chargé dans un navigateur : ajoute l'instance de l'application au contexte globale (c-à-d `window`), ainsi nous pouvons le monter.
- Quand chargé dans node : exporte un générateur de fonction permettant de créer une nouvelle instance de Vue pour chaque requête.

Réaliser ces modifications demande un peu de fioritures :

``` js
// assets/app.js
(function () { 'use strict'
  var createApp = function () {
    // ---------------------
    // DÉBUT DU CODE STANDARD
    // ---------------------

    // Main Vue instance must be returned and have a root
    // node with the id "app", so that the client-side
    // version can take over once it loads.
    return new Vue({
      template: '<div id="app">Vous êtes ici depuis {{ counter }} seconde(s).</div>',
      data: {
        counter: 0
      },
      created: function () {
        var vm = this
        setInterval(function () {
          vm.counter += 1
        }, 1000)
      }
    })

    // --------------------
    // FIN DU CODE STANDARD
    // --------------------
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createApp
  } else {
    this.app = createApp()
  }
}).call(this)
```

Maintenant que nous avons le code de notre application, mettons tout cela dans un fichier `index.html` :

``` html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Mon application Vue</title>
  <script src="/assets/vue.js"></script>
</head>
<body>
  <div id="app"></div>
  <script src="/assets/app.js"></script>
  <script>app.$mount('#app')</script>
</body>
</html>
```

À supposer que le dossier `assets` contienne le fichier `app.js` créer précédemment, et que le fichier `vue.js` contiennent Vue, nous devrions avoir une application monopage fonctionnelle !

Maintenant, pour que cela fonctionne avec du rendu côté serveur, il y a juste une étape de plus — le serveur web :

``` js
// server.js
'use strict'

var fs = require('fs')
var path = require('path')

// Définir Vue de manière globale pour app.js côté serveur
global.Vue = require('vue')

// Obtenir la présentation HTML
var layout = fs.readFileSync('./index.html', 'utf8')

// Créer un générateur de rendu
var renderer = require('vue-server-renderer').createRenderer()

// Créer un serveur express
var express = require('express')
var server = express()

// Fournir les fichiers depuis le dossier des assets
server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

// Prendre en charge toutes les requêtes GET
server.get('*', function (request, response) {
  // Faire le rendu de notre app Vue sous forme de chaîne de caractère
  renderer.renderToString(
    // Créer une instance d'application
    require('./assets/app')(),
    // Prendre en charge le rendu généré
    function (error, html) {
      // Si une erreur c'est produite pendant le rendu...
      if (error) {
        // Logguer l'erreur dans la console
        console.error(error)
        // Puis dire au client que quelque chose c'est mal passé
        return response
          .status(500)
          .send('Server Error')
      }
      // Sinon envoyé la page HTML de l'application générée
      response.send(layout.replace('<div id="app"></div>', html))
    }
  )
})

// Écouter sur le port 5000
server.listen(5000, function (error) {
  if (error) throw error
  console.log('Le serveur est lancé sur localhost:5000')
})
```

Et c'est tout ! Vous trouverez ici l'[application complète](https://github.com/chrisvfritz/vue-ssr-demo-simple), au cas ou vous souhaiteriez en faire un clone et de faire plus de tests. Une fois que vous l'aurez fait tourner dans votre environnement local, vous pourrez vérifier que le rendu côté serveur fonctionne réellement en faisant un clique droit sur la page et en sélectionnant « Afficher la source » (ou quelque chose d'équivalent). Vous devriez voir cela dans le corps de la réponse :

``` html
<div id="app" server-rendered="true">Vous êtes ici depuis {{ counter }} seconde(s).</div>
```

au lieu de :

``` html
<div id="app"></div>
```

## Réponse envoyée par flux

Vue supporte également le rendu sous forme de __flux__ (__stream__), ce qui est préférable pour les serveurs web supportant l'envoi par flux. Cela permet au HTML d'être écrit dans la réponse _aussitôt que généré_, au lieu de tout fournir à la fin de la réponse. Le résultat des requêtes est ainsi ré-envoyé plus vite, sans délais !

Pour adapter le code de notre précédente application pour une réponse sous forme de flux, nous pouvons simplement remplacé la structure `server.get('*', ...)` par le code suivant :

``` js
// Fragmenter la présentation en trois parties distinctes
var layoutSections = layout.split('<div id="app"></div>')
var preAppHTML = layoutSections[0]
var postAppHTML = layoutSections[1]

// Prendre en charge toutes les requêtes GET
server.get('*', function (request, response) {
  // Faire le rendu de notre app Vue sous forme de chaîne de caractère
  var stream = renderer.renderToStream(require('./assets/app')())

  // Écrire la partie avant-application de notre réponse HTML
  response.write(preAppHTML)

  // Dès que le rendu d'un nouveau morceau a été fait...
  stream.on('data', function (chunk) {
    // Ajouter ce morceau dans la réponse
    response.write(chunk)
  })

  // Si une erreur c'est produite pendant le rendu...
  stream.on('end', function () {
    // Écrire la partie après-application de notre réponse HTML
    response.end(postAppHTML)
  })

  // If an error occurs while rendering...
  stream.on('error', function (error) {
    // Logguer l'erreur dans la console
    console.error(error)
    // Puis dire au client que quelque chose c'est mal passé
    return response
      .status(500)
      .send('Server Error')
  })
})
```

Comme vous pouvez le voir, ce n'est pas plus compliqué que la version précédente, même si le concepte de réponse sous forme de flux est nouveau pour vous. Nous avons juste :

1. Initialiser un flux
2. Écrit le HTML à placer avant la réponse de l'application
3. Écrit le HTML de l'application chaque fois que celui-ci est disponible
4. Écrit le HTML à placer après la réponse de l'application et finir l'envoi
5. Prendre en charge les éventuelles erreurs

## Component Caching

Vue's SSR is very fast by default, but you can further improve performance by caching rendered components. This should be considered an advanced feature however, as caching the wrong components (or the right components with the wrong key) could lead to misrendering your app. Specifically:

<p class="tip">You should not cache a component containing child components that rely on global state (e.g. from a vuex store). If you do, those child components (and in fact, the entire sub-tree) will be cached as well. Be especially wary with components that accept slots/children.</p>

### Setup

With that warning out of the way, here's how you cache components.

First, you'll need to provide your renderer with a [cache object](https://www.npmjs.com/package/vue-server-renderer#cache). Here's a simple example using [lru-cache](https://github.com/isaacs/node-lru-cache):

``` js
var createRenderer = require('vue-server-renderer').createRenderer
var lru = require('lru-cache')

var renderer = createRenderer({
  cache: lru(1000)
})
```

That will cache up to 1000 unique renders. For other configurations that more closely align to memory usage, see [the lru-cache options](https://github.com/isaacs/node-lru-cache#options).

Then for components you want to cache, you must provide them with:

- a unique `name`
- a `serverCacheKey` function, returning a unique key scoped to the component

For example:

``` js
Vue.component({
  name: 'list-item',
  template: '<li>{{ item.name }}</li>',
  props: ['item'],
  serverCacheKey: function (props) {
    return props.item.type + '::' + props.item.id
  }
})
```

### Ideal Components for Caching

Any "pure" component can be safely cached - that is, any component that is guaranteed to generate the same HTML given the same props. Common examples of these include:

- Static components (i.e. they always generate the same HTML, so the `serverCacheKey` function can just return `true`)
- List item components (when part of large lists, caching these can significantly improve performance)
- Generic UI components (e.g. buttons, alerts, etc - at least those that accept content through props rather than slots/children)

## Build Process, Routing, and Vuex State Hydration

By now, you should understand the fundamental concepts behind server-side rendering. However, as you introduce a build process, routing, and vuex, each introduces its own considerations.

To truly master server-side rendering in complex applications, we recommend a deep dive into the following resources:

- [vue-server-renderer docs](https://www.npmjs.com/package/vue-server-renderer#api): more details on topics covered here, as well as documentation of more advanced topics, such as [preventing cross-request contamination](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) and [adding a separate server build](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): the definitive example of integrating all major Vue libraries and concepts in a single application

## Nuxt.js

Properly configuring all the discussed aspects of a production-ready server-rendered app can be a daunting task. Luckily, there is an excellent community project that aims to make all of this easier: [Nuxt.js](https://nuxtjs.org/). Nuxt.js is a higher-level framework built on top of the Vue ecosystem which provides an extremely streamlined development experience for writing universal Vue applications. Better yet, you can even use it as a static site generator (with pages authored as single-file Vue components)! We highly recommend giving it a try.
