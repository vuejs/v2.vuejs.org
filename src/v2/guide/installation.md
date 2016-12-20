---
title: Installation
type: guide
order: 1
vue_version: 2.1.6
dev_size: "212.24"
min_size: "69.33"
gz_size: "25.39"
ro_gz_size: "17.67"
---

### Compatibilité

Vue ne supporte **pas** IE8 et les versions antérieures, car il utilise des fonctionnalités ECMAScript 5 qui sont inconcevables avec IE8. Cela dit, Vue supporte tous les [navigateurs compatibles ECMAScript 5](http://caniuse.com/#feat=es5).

### Notes de version

Les notes de version détaillées pour chaque version sont disponibles sur [GitHub](https://github.com/vuejs/vue/releases).

## Autonome

Il suffit de télécharger et d'inclure une balise script. `Vue` sera déclaré comme une variable globale.

<p class="tip">N'utilisez pas la version minifiée pendant le développement car vous ne bénéficierez pas des avertissements pour les erreurs courantes !</p>

<div id="downloads">
<a class="button" href="./js/vue.js" download>Version de développement</a><span class="light info">Avec tous les avertissements et le mode de débogage</span>

<a class="button" href="./js/vue.min.js" download>Version de production</a><span class="light info">Avertissements retirés, {{gz_size}}ko min+gzip</span>
</div>

### CDN

Recommandé: [unpkg](https://unpkg.com/vue/dist/vue.js), qui reflète la dernière version aussitôt qu'elle est publiée sur npm. Vous pouvez également parcourir la source du package npm à [unpkg.com/vue/](https://unpkg.com/vue/).

Également disponible sur [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) ou [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), mais ces deux services mettent du temps à se synchroniser ce qui signifie que la dernière version peut ne pas être encore disponible.

## NPM

NPM est la méthode d'installation recommandée lors du développement d'applications à grande échelle avec Vue. Il s'associe bien avec des modules d'empaquetage comme [Webpack](http://webpack.github.io/) ou [Browserify](http://browserify.org/). Vue fournit également des outils d'accompagnement pour la rédaction de [Composants Monofichier](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

### Autonomie vs. Minimum utile

Il y a deux builds disponibles, le build autonome (dit *standalone*) et le build minimal (dit *runtime-only*). La différence vient du fait que le premier inclut le **compilateur de template** et que le second ne l'inclut pas.

Le compilateur de template se charge de compiler les chaînes littérales de template Vue en pure fonction de rendu JavaScript. Si vous souhaitez utiliser l'option `template`, alors vous aurez besoin du compilateur.

- Le build autonome inclut le compilateur et supporte l'option `template`. **Il s'appuie également sur les APIs navigateurs, ce qui signifie que vous ne pouvez pas l'utiliser pour du rendu côté serveur.**

- Le build minimal n'inclut pas le compitateur de template, et ne supporte pas l'option `template`. Vous pouvez seulement utiliser l'option `render` quand vous utilisez le build minimal, mais il fonctionne avec des composants monofichier, car les templates de composants monofichier sont pré-compilé dans `render` pendant l'étape de build. Le build minimal est à peu près 30% plus léger que le build autonome, l'amenant seulement à {{ro_gz_size}}ob min+gzip.

Par défaut, c'est le build **minimal** qui est exporté par le package NPM. Pour utiliser le build autonome, il faut ajouter l'alias suivant dans la configuration Webpack :

``` js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.common.js'
  }
}
```

Pour Browserify, vous pouvez ajouter l'alias dans votre package.json :

``` js
"browser": {
  "vue": "vue/dist/vue.common"
},
```

<p class="tip">Ne faites PAS `import Vue from 'vue/dist/vue.js'` — 
bien que certains outils ou bibliothèques tierces peuvent également importer vue, cela peut forcer l'app à charger conjointement le build minimal et autonome en même temps et mener à des erreurs.</p>

### Environnements CSP

Certains environnements, tels que les Applications de Google Chrome, font respecter la politique de sécurité de contenu (Content Security Policy - CSP), qui ne permet pas l'utilisation de `new Function()` pour évaluer les expressions. Le build autonome a besoin de cette fonctionnalité pour compiler les templates, elle n'est donc pas utilisable dans ces environnements.

D'un autre côté, le build minimal respecte pleinement CSP. Quand vous utilisez le build minimal avec [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) ou [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), vos templates vont être pré-compilé dans les fonctions `render` qui fonctionnent parfaitement dans des environnements CSP.

## CLI

Vue.js offre une [interface en ligne de commande officielle](https://github.com/vuejs/vue-cli) pour mettre rapidement en place les bases d'Applications Monofichier ambitieuses. Il offre une série de builds pré-configurés pour un workflow Front-end moderne. Cela ne prends que quelques minutes pour commencer et lancer des rechargements à chaud, de l'analyse syntaxique à la sauvegarde, et des builds prêt pour la production :

``` bash
# installer vue-cli
$ npm install --global vue-cli
# créer un nouveau projet en utilisant le template « webpack »
$ vue init webpack my-project
# installer les dépendances et go !
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">Utiliser le CLI présupose des connaissances en Node.js et les outils de build associés. Si vous êtes nouveau sur Vue ouIf you are new to Vue or front-end build tools, we strongly suggest going through <a href="./">the guide</a> without any build tools before using the CLI.</p>

## Build de développement

**Important**: les fichiers générés dans le dossier `/dist` sur GitHub sont seulement pris en compte pendant la releases. Pour utiliser la dernière version du code source de Vue sur GitHub, vous devrez le construire vous-même !

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# latest stable
$ bower install vue
```

## Chargeurs de module AMD

Les téléchargements seuls ou les versions installées via Bower sont encapsulées selon UMD ce qui permet de directement les utiliser sous forme de module AMD.
