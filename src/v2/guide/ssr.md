---
title: Rendu côté serveur
type: guide
order: 24
---

## Avez-vous besoin d'un rendu côté serveur ?

Avant de plonger dans le SRR (pour *Server-side Rendering* soit « Rendu côté serveur »), explorons en quoi cela pourrait vous être utile et quand l'utiliser.

### La SEO

Google et Bing peuvent parfaitement indexer les applications JavaScript synchrones. _Synchrone_ est le mot-clé important ici. Si votre application démarre avec une animation de chargement, puis charge le contenu via des requêtes Ajax, les moteurs d'indexation n'attendront pas que ces opérations soient finies.

Cela signifie que si vous avez du contenu qui s'affiche de manière asynchrone sur des pages où la SEO (pour *Search Engine Optimization* soit « Optimisation pour les moteurs de recherche ») est importante, le SSR devient nécessaire.

### Clients avec une connexion bas-débit

Les utilisateurs pourraient visiter votre site depuis des lieux avec une connexion Internet bas-débit – ou juste depuis une mauvaise connexion cellulaire. Dans ces cas, vous souhaitez minimiser le nombre et la taille des requêtes nécessaires à l'utilisateur pour voir le contenu de base.

Vous pouvez utiliser l'[outil Webpack de *code splitting*](https://webpack.js.org/guides/code-splitting-require/) pour ne pas forcer l'utilisateur à télécharger votre application entière pour voir une seule page, mais cela ne sera jamais aussi performant que de télécharger une seule page HTML pré-rendue.

### Clients avec un vieux (ou juste sans) moteur JavaScript

Pour certaines populations ou endroits du monde, utiliser un ordinateur de 1998 pour accéder à Internet pourrait être la seule option. Puisque Vue ne fonctionne qu'avec IE9+, vous pourriez vouloir délivrer un contenu de base à ceux sur des anciens navigateurs — ou pour les hackers hipsters utilisant [Lynx](http://lynx.browser.org/) depuis un terminal.

### SSR vs. Pré-rendu

Si vous étudiez le SSR uniquement pour améliorer la SEO d'une poignée de pages vitrines (ex. : `/`, `/about`, `/contact`, etc), alors vous voudriez probablement utiliser du __pré-rendu__ à la place. Au lieu d'utiliser un serveur web pour compiler le HTML à la volée, le pré-rendu génère simplement des fichiers HTML statiques pour des routes spécifiques lors de la phase de *build*. L'avantage est que mettre en place le pré-rendu est beaucoup plus simple et vous permet de garder la partie frontale d'un site complètement statique.

Si vous utilisez Webpack, vous pouvez facilement ajouter le pré-rendu avec le plugin [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin). Il a beaucoup été testé avec des applications Vue — en fait, son créateur est un membre de l'équipe du coeur de Vue.

## Hello World

Si vous êtes arrivé jusqu'ici, vous êtes prêt pour voir le SSR en action. Cela semble complexe, mais un simple script Node.js peut présenter la fonctionnalité en seulement 3 étapes :

``` js
// Étape 1: Créer une instance de Vue
var Vue = require('vue')
var app = new Vue({
  render: function (h) {
    return h('p', 'hello world')
  }
})

// Étape 2: Créer un moteur de rendu
var renderer = require('vue-server-renderer').createRenderer()

// Étape 3: Faire le rendu de l'instance de Vue en HTML
renderer.renderToString(app, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">hello world</p>
})
```

Pas si effrayant, non ? Bien sûr, cet exemple est plus simple que pour la plupart des applications. Nous n'avons pas encore à nous préoccuper de :

- du serveur web
- de la réponse streamée
- de la mise en cache des composants
- du processus de build
- du routage
- de l'hydratation d'état avec Vuex

Dans la suite de ce guide, nous allons voir comment travailler avec certaines de ces fonctionnalités. Une fois que vous comprendrez les bases, nous vous orienterons vers de la documentation plus détaillée et des exemples avancés pour vous aider à gérer les cas particuliers.

## SSR simple avec le serveur web Express

C'est un peu abuser que d'appeler ça du « Server-side Rendering » quand nous n'avons pas de serveur web, alors réglons ça. Nous allons créer une application très simple avec du SSR, en utilisant uniquement une syntaxe ES5 sans aucune étape de *build* ou plugin Vue.

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

Pour adapter ça au SSR, il y a quelques modifications à faire, afin que cela fonctionne aussi bien dans le navigateur qu'avec Node.js :

- Quand chargé dans un navigateur, ajouter une instance de notre application au contexte global (c-à-d `window`), afin que nous puissions faire le montage.
- Quand chargé avec Node.js, exporter une fonction de fabrique afin que nous puissions créer une nouvelle instance de Vue pour chaque requête.

Réaliser ces modifications nécessite une petite base de code :

``` js
// assets/app.js
(function () { 'use strict'
  var createApp = function () {
    // -------------------------------
    // DEBUT DU CODE NORMAL DE L'APPLI
    // -------------------------------

    // L'instance de Vue principale doit être retournée et avoir
    // un nœud racine avec l'id « app », afin que la version côté
    // client puisse prendre le relais.
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

    // -----------------------------
    // FIN DU CODE NORMAL DE L'APPLI
    // -----------------------------
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

Tant que le répertoire `assets` mentionné contient le fichier `app.js` créé précédemment, ainsi qu'un fichier `vue.js` avec Vue, nous devrions avoir une application monopage fonctionnelle !

Ensuite, pour le faire fonctionner avec du rendu côté serveur, il y a juste une étape de plus — le serveur web :

``` js
// server.js
'use strict'

var fs = require('fs')
var path = require('path')

// Définir Vue de manière globale pour app.js côté serveur
global.Vue = require('vue')

// Récupérer la présentation HTML
var layout = fs.readFileSync('./index.html', 'utf8')

// Créer un moteur de rendu
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
  // Faire le rendu de notre application Vue sous forme de chaîne de caractères
  renderer.renderToString(
    // Créer une instance d'application
    require('./assets/app')(),
    // Prendre en charge le rendu généré
    function (error, html) {
      // Si une erreur s'est produite pendant le rendu...
      if (error) {
        // Loguer l'erreur dans la console
        console.error(error)
        // Puis dire au client que quelque-chose s'est mal passé
        return response
          .status(500)
          .send('Server Error')
      }
      // Sinon envoyer la page HTML de l'application générée
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

Et c'est tout ! Vous trouverez ici l'[application complète](https://github.com/chrisvfritz/vue-ssr-demo-simple), au cas ou vous souhaiteriez en faire un clone et faire plus de tests. Une fois que vous l'aurez fait tourner dans votre environnement local, vous pourrez vérifier que le rendu côté serveur fonctionne en faisant un clic droit sur la page et en sélectionnant « Afficher la source » (ou quelque chose d'équivalent). Vous devriez voir cela dans le corps de la réponse :

``` html
<div id="app" server-rendered="true">Vous êtes ici depuis {{ counter }} seconde(s).</div>
```

au lieu de :

``` html
<div id="app"></div>
```

## Réponse streamée

Vue supporte également le rendu sous forme de __flux__ (__stream__), ce qui est préférable pour les serveurs web supportant l'envoi par flux. Cela permet au HTML d'être écrit dans la réponse _dès qu'il est généré_, au lieu de tout fournir à la fin de la réponse. Le résultat est que les requêtes sont servies plus rapidement, sans inconvénients !

Pour streamer notre application de la section précédente, nous pouvons simplement remplacer la structure `server.get('*', ...)` par le code suivant :

``` js
// Séparer la présentation en trois parties distinctes
var layoutSections = layout.split('<div id="app"></div>')
var preAppHTML = layoutSections[0]
var postAppHTML = layoutSections[1]

// Prendre en charge toutes les requêtes GET
server.get('*', function (request, response) {
  // Faire le rendu de notre app Vue sous forme de chaîne de caractères
  var stream = renderer.renderToStream(require('./assets/app')())

  // Écrire le HTML pré-applicatif dans la réponse
  response.write(preAppHTML)

  // À chaque fois que de nouveaux fragments ont été rendus...
  stream.on('data', function (chunk) {
    // Ajouter ce fragment dans la réponse
    response.write(chunk)
  })

  // Quand le rendu de tous les morceaux a été fait...
  stream.on('end', function () {
    // Écrire le HTML post-applicatif dans la réponse
    response.end(postAppHTML)
  })

  // Si une erreur s'est produite pendant le rendu...
  stream.on('error', function (error) {
    // Loguer l'erreur dans la console
    console.error(error)
    // Puis dire au client que quelque-chose s'est mal passé
    return response
      .status(500)
      .send('Server Error')
  })
})
```

Comme vous pouvez le voir, ce n'est pas plus compliqué que la version précédente, même si le concept de streams puisse être nouveau pour vous. Nous avons juste :

1. Initialisé un flux
2. Écrit le HTML à placer avant la réponse de l'application
3. Écrit le HTML de l'application chaque fois que celui-ci est disponible
4. Écrit le HTML à placer après la réponse de l'application et fini l'envoi
5. Pris en charge des éventuelles erreurs

## Mise en cache de composant

Le SSR de Vue est très rapide par défaut, mais vous pouvez encore améliorer la performance en mettant en cache les composants après rendu. Cela peut être considéré comme une fonctionnalité avancée cependant, car mettre en cache le mauvais composant (ou le bon composant avec la mauvaise clé) peut amener à des erreurs de rendu de votre application. En particulier :

<p class="tip">Vous ne devriez pas mettre en cache un composant contenant des composants enfants qui dépendent de l'état global (ex. : un store vuex). Si vous le faites, ces composants enfants (et en fait, toute l'arborescence sous-jacente) sera également mise en cache. Soyez donc particulièrement attentif avec les composants qui acceptent des slots/enfants.</p>

### Mise en place

Avec cet avertissement pris en compte, voici comment vous mettez en cache des composants.

Premièrement, vous devez fournir votre moteur de rendu avec un [objet de cache](https://www.npmjs.com/package/vue-server-renderer#cache). Voici un simple exemple utilisant [lru-cache](https://github.com/isaacs/node-lru-cache) :

``` js
var createRenderer = require('vue-server-renderer').createRenderer
var lru = require('lru-cache')

var renderer = createRenderer({
  cache: lru(1000)
})
```

Cela va mettre en cache jusqu'à 1000 rendus uniques. Pour d'autres configurations s'alignant au plus proche avec l'utilisation de la mémoire, voyez [les options de lru-cache](https://github.com/isaacs/node-lru-cache#options).

Ensuite, pour les composants que vous voulez mettre en cache, vous devez leur fournir :

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

### Les composants idéaux pour de la mise en cache

N'importe quel composant « pur » peut être mis en cache sans problème — c'est-à-dire n'importe quel composant qui garantit de générer le même HTML avec les mêmes props données. Des exemples classiques de ce type de composants :

- Des composants statiques (c-à-d. qui génèrent toujours le même HTML, et donc la fonction `serverCacheKey` peut toujours retourner `true`)
- Des composants d'éléments de liste (dans de longues listes, les mettre en cache peut significativement améliorer les performances)
- Des composants génériques d'interface utilisateur (c-à-d les boutons, alertes, etc. — du moins ceux qui acceptent du contenu via les props plutôt que les slots/enfants)

## Processus de build, routage, et hydratation d'état de Vuex

À présent, vous devriez comprendre les concepts fondamentaux derrière le rendu côté serveur. Cependant, à mesure que vous introduisez un processus de *build*, du routage ou vuex, cela introduit son propre lot de considérations.

Pour réellement maîtriser le rendu côté serveur dans des applications complexes, nous vous recommandons de vous intéresser plus particulièrement aux ressources suivantes :

- [Documentation de vue-server-renderer](https://www.npmjs.com/package/vue-server-renderer#api) : plus de détails sur les sujets que nous avons abordés ici, ainsi qu'une documentation sur les sujets plus avancés, comme [empêcher la contamination entre les requêtes](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) et [ajouter un serveur de build séparé](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): l'exemple final intégrant toutes les bibliothèques et concepts majeurs de Vue dans une seule application.

## Nuxt.js

Configurer proprement tous les aspects dont nous avons discuté pour un rendu côté serveur près à la production peut être intimidant. Fort heureusement, il y a un excellent projet communautaire dont le but est de rendre tout cela plus simple : [Nuxt.js](https://nuxtjs.org/). Nuxt.js est un framework de haut niveau construit par-dessus l'écosystème de Vue et qui fournit une expérience de développement toute tracée pour écrire des applications Vue universelle. Encore mieux, vous pouvez vous en servir comme générateur de sites web statiques (avec des pages écrites comme composants Vue monofichiers) ! Nous vous recommandons grandement de l'essayer.
