---
title: Rendu côté serveur
type: guide
order: 24
---

## Avez-vous besoin d'un rendu côté serveur ?

Avant de plonger dans le SRR (pour *Server-side Rendering* soit Rendu côté serveur), explorons en quoi cela pourrait vous être utile et quand l'utiliser.

### La SEO

Google et Bing peuvent parfaitement indexer les applications JavaScript synchrones. _Synchrone_ est le mot-clé important ici. Si votre application démarre avec une animation de chargement, puis charge le contenu via des requêtes Ajax, les moteurs d'indexation n'attendront pas que ces opérations soient finies.

Cela signifie que si vous avez du contenu qui s'affiche de manière asynchrone sur des pages ou la SEO est importante, le SSR devient nécessaire.

### Clients avec une connexion bas-débit

Les utilisateurs pourraient visiter votre site depuis des lieux avec une connexion Internet bas-débit – ou juste depuis une mauvaise connexion cellulaire. Dans ces cas, vous souhaitez minimiser le nombre et la taille des requêtes nécessaire à l'utilisateur pour afficher ce contenu minimal.

Vous pouvez utiliser l'[outil Webpack de découpe de code](https://webpack.js.org/guides/code-splitting-require/) pour ne pas forcer l'utilisateur à télécharger votre application entière pour voir une seule page, mais cela ne sera jamais aussi performant que de télécharger une seule page de contenu HTML au rendu statique.

### Clients avec vieux (ou juste sans) moteur JavaScript

Il y a encore des endroits autour du monde où utiliser un ordinateur avec 1998 pour accéder à Internet est encore la seule option possible. Puisque Vue ne fonctionne que pour des versions de IE9+, vous devez toujours délivrer un contenu minimal pour ses anciens navigateurs — ou pour les hackers hipsters utilisant [Lynx](http://lynx.browser.org/) depuis un terminal.

### SSR vs. Rendu statique

Si vous vous penchez sur le SSR pour améliorer la SEO d'une poignées de pages vitrines (ex. : `/`, `/about`, `/contact`, etc), alors vous voudriez probablement utiliser du __rendu statique__ à la place. Au lieu d'utiliser le serveur pour générer du code HTML à la demande, le rendu statique utilise des pages générés en amont lors de la phase de *build* du site. L'avantage est que mettre en place du rendu statique est plus simple et vous permet de garder la partie frontale d'un site complètement statique.

Si vous utilisez Webpack, vous pouvez facilement générer du rendu statique avec [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin). Il a beaucoup été testé avec des apps Vue — en fait, son créateur est un membre de l'équipe officielle de Vue.

## Hello World

Si vous êtes arrivez jusqu'ici, vous êtes prèt pour voir le SSR en action. Ça semble complexe, mais un simple script Node.js peut présenter la fonctionnalité en 3 étapes :

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

Pas si effrayant, non ? Bien sûr, cet exemple est plus simple que la plupart de ceux des applications. Nous ne nous sommes pas encore préoccupé :

- du serveur web
- de la réponse sous forme de flux
- du cache du composant
- du processus de build
- du routage
- de l'hydratation d'état avec Vuex

Dans la suite de ce guide, nous allons voir comment fonctionne nombre de ces fonctionnalités. Une fois que vous serez familier avec les bases, nous vous orienterons vers de la documentation détaillée et des exemples avancés pour vous aider sur des cas plus concrets.

## SSR simple avec le serveur web Express

C'est un peu simple d'appeler ça du « Server-side Rendering » quand nous n'avons pas de serveur web, alors réglons ça. Nous allons créer une application avec du SRR vraiment simple, en utilisant uniquement une syntaxe ES5 sans aucune étape de *build* ou de plugins Vue.

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

Pour adapter ça à du SSR, il y a quelques modifications à faire, cela permettra au code de fonctionner aussi bien côté navigateur que côté Node.js :

- Quand chargé dans un navigateur : ajout de l'instance de l'application au contexte globale (c-à-d `window`), ainsi nous pouvons faire le montage.
- Quand chargé avec Node.js : export d'un générateur de fonction permettant de créer une nouvelle instance de Vue pour chaque requête.

Réaliser ces modifications demande un peu de fioritures :

``` js
// assets/app.js
(function () { 'use strict'
  var createApp = function () {
    // ---------------------
    // DÉBUT DU CODE STANDARD
    // ---------------------

    // L'instance de Vue principale doit être retournée ainsi qu'un
    // nœud racine avec l'id « app », ainsi la version côté client
    // peut prendre le relais une fois chargée.
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

À supposer que le dossier `assets` contienne le fichier `app.js` créer précédemment, et que le fichier `vue.js` contienne Vue, nous devrions avoir une application monopage fonctionnelle !

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

// Créer un serveur Express.js
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

Et c'est tout ! Vous trouverez ici l'[application complète](https://github.com/chrisvfritz/vue-ssr-demo-simple), au cas ou vous souhaiteriez en faire un clone et faire plus de tests. Une fois que vous l'aurez fait tourner dans votre environnement local, vous pourrez vérifier que le rendu côté serveur fonctionne réellement en faisant un clique droit sur la page et en sélectionnant « Afficher la source » (ou quelque chose d'équivalent). Vous devriez voir cela dans le corps de la réponse :

``` html
<div id="app" server-rendered="true">Vous êtes ici depuis {{ counter }} seconde(s).</div>
```

au lieu de :

``` html
<div id="app"></div>
```

## Réponse envoyée par flux

Vue supporte également le rendu sous forme de __flux__ (__stream__), ce qui est préférable pour les serveurs web supportant l'envoi par flux. Cela permet au HTML d'être écrit dans la réponse _aussitôt que générée_, au lieu de tout fournir à la fin de la réponse. Le résultat des requêtes est ainsi ré-envoyé plus vite, sans délais !

Pour adapter le code de notre précédente application pour une réponse sous forme de flux, nous pouvons simplement remplacer la structure `server.get('*', ...)` par le code suivant :

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

  // Quand le rendu de tous les morceaux a été fait...
  stream.on('end', function () {
    // Écrire la partie après-application de notre réponse HTML
    response.end(postAppHTML)
  })

  // Si une erreur c'est produite pendant le rendu...
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

1. Initialisé un flux
2. Écrit le HTML à placer avant la réponse de l'application
3. Écrit le HTML de l'application chaque fois que celui-ci est disponible
4. Écrit le HTML à placer après la réponse de l'application et fini l'envoi
5. Prendre en charge les éventuelles erreurs

## Mise en cache de composant

Le SSR de Vue est vraiment rapide par défaut, mais il est possible d'améliorer les performances du rendu des composants. Cela est considéré comme une fonctionnalité avancée cependant, car mettre en cache le mauvais composant (ou le bon composant avec la mauvaise clé) peut mener à de mauvais rendu d'application. Spécifiquement :

<p class="tip">Vous ne devriez pas mettre en cache un composant contenant des composants enfants qui sont relié à l'état global (ex. : le store de vuex). Si vous le faites, ces composants enfants (et en fait, l'ensemble de leurs propre composants enfants) seront mis en cache. Soyez donc particulièrement attentif avec les composants qui accepte des slots/enfants.</p>

### Mise en place

Avec cette avertissement pris en compte, voici comment faire de la mise en cache de composants.

Premièrement, vous devez fournir votre générateur de rendu avec un [objet de mise en cache](https://www.npmjs.com/package/vue-server-renderer#cache). Voici ici un simple exemple utilisant [lru-cache](https://github.com/isaacs/node-lru-cache) :

``` js
var createRenderer = require('vue-server-renderer').createRenderer
var lru = require('lru-cache')

var renderer = createRenderer({
  cache: lru(1000)
})
```

Cela va mettre en cache le résultat pour les 1000 prochains rendus. Pour d'autres configurations plus proche de votre usage de la mémoire, voyez [les options de lru-cache](https://github.com/isaacs/node-lru-cache#options).

Maintenant pour les composants, que vous voulez mettre en cache, vous devez les fournir avec :

- un `name` unique
- une fonction `serverCacheKey`, retournant une clé unique limitée à la portée du composant

Par exemple :

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

### Les composants idéales pour de la mise en cache

N'importe quel composant « pure » peut être mis en cache sans problème — c'est à dire n'importe quel composant qui assure que le HTML généré fournit toujours les mêmes props. Des exemples commun de cela sont :

- Des composants statiques (c-à-d qu'il génère toujours le même HTML, aussi la fonction `serverCacheKey` à juste à retourner `true`)
- Des composants de liste d'élément (dans de large liste, les mettre en cache peut significativement améliorer les performances)
- Des composants d'interface utilisateur générique (c-à-d les boutons, alertes, etc — du moins ceux qui accepte leur contenu à travers les props plutôt que les slots/enfants)

## Processus de build, routage, et hydratation d'état de Vuex

Maintenant, vous devriez comprendre le concept fondamental derrière le rendu côté serveur. Cependant, introduire un processus de build, du routage et vuex introduit également son lot de considérations propres.

Pour réellement maîtriser le rendu côté serveur dans des applications complexes, nous vous recommandons de vous intéresser plus particulièrement aux ressources suivantes :

- [documentations de vue-server-renderer](https://www.npmjs.com/package/vue-server-renderer#api) : plus de détails sur les sujets que nous avons abordés ici, ainsi qu'une documentation de sujets plus avancés, comme [prévenir la contamination entre les requêtes](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) et [l'ajout d'un serveur de build séparé](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): l'exemple définitif intégrant toutes les bibliothèques et concepts majeurs de Vue dans une application unique.

## Nuxt.js

Configurer proprement tous les aspects dont nous avons discuté pour un rendu côté serveur près à la production peut être une tâche qui incombe. Forte heureusement, il y a un excellent projet communautaire dont le but est de rendre tout cela plus simple : [Nuxt.js](https://nuxtjs.org/). Nuxt.js est un framework de haut niveau construit au dessus de l'écosystème de Vue et qui fournit une expérience de développement organisée pour écrire des applications Vue universelle. Encore mieux, vous pouvez vous en servir comme générateur de site web statique (avec des pages réalisées au format monofichier des composants Vue) ! Nous vous recommandons grandement de l'essayer.
