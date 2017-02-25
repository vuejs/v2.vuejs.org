---
title: Installation
type: guide
order: 1
vue_version: 2.1.10
dev_size: "218.92"
min_size: "70.99"
gz_size: "25.86"
ro_gz_size: "18.01"
---

### Compatibilité

Vue **ne** supporte **pas** IE8 et les versions antérieures, car il utilise des fonctionnalités ECMAScript 5 qui ne peuvent pas être émulées sur IE8. Cela dit, Vue supporte tous les [navigateurs compatibles ECMAScript 5](http://caniuse.com/#feat=es5).

### Notes de version

Les notes de version détaillées pour chaque version sont disponibles sur [GitHub](https://github.com/vuejs/vue/releases).

## *Standalone*

Il suffit de télécharger et de l'inclure avec une balise script. `Vue` sera déclaré comme une variable globale.

<p class="tip">N'utilisez pas la version minifiée pendant le développement car vous ne bénéficieriez alors pas des avertissements pour les erreurs courantes !</p>

<div id="downloads">
<a class="button" href="./js/vue.js" download>Version de développement</a><span class="light info">Avec tous les avertissements et le mode de débogage</span>

<a class="button" href="./js/vue.min.js" download>Version de production</a><span class="light info">Avertissements retirés, {{gz_size}}ko min+gzip</span>
</div>

### CDN

Recommandé : [unpkg](https://unpkg.com/vue/dist/vue.js), qui reflète la dernière version aussitôt qu'elle est publiée sur NPM. Vous pouvez également parcourir la source du package NPM sur [unpkg.com/vue/](https://unpkg.com/vue/).

Également disponible sur [jsDelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) ou [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), mais ces deux services mettent du temps à se synchroniser ce qui signifie que la dernière version peut ne pas être encore disponible.

## NPM

NPM est la méthode d'installation recommandée lors du développement de grosses applications avec Vue. Il s'associe bien avec des empaqueteurs de modules comme [Webpack](https://webpack.js.org/) ou [Browserify](http://browserify.org/). Vue fournit également des outils d'accompagnement pour la rédaction de [Composants Mono-fichier](single-file-components.html).

``` bash
# dernière version stable
$ npm install vue
```

### *Standalone* vs. *Runtime*

Il y a deux *builds* disponibles le *build standalone* et le *build runtime*. La différence vient du fait que le premier inclut le **compilateur de template** alors que le second ne l'inclut pas.

Le compilateur de template se charge de compiler les chaînes littérales de template Vue en pure fonction de rendu JavaScript. Si vous souhaitez utiliser l'option `template`, alors vous aurez besoin du compilateur.

- Le *build standalone* inclut le compilateur et supporte l'option `template`. **Il s'appuie également sur les APIs navigateurs, ce qui signifie que vous ne pouvez pas l'utiliser pour du rendu côté serveur.**

- Le *build runtime* n'inclut pas le compilateur de template, et ne supporte pas l'option `template`. Vous pouvez seulement utiliser l'option `render` quand vous utilisez le build runtime, mais il fonctionne avec des composants mono-fichier, car les templates de composants mono-fichier sont pré-compilés dans `render` pendant l'étape de *build*. Le *build runtime* est à peu près 30% plus léger que le *build standalone*, l'amenant seulement à {{ro_gz_size}}ko min+gzip.

Par défaut, c'est le _build **runtime**_ qui est exporté par le package NPM. Pour utiliser le *build standalone*, il faut ajouter l'alias suivant dans la configuration Webpack :

``` js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.common.js'
  }
}
```

Pour Browserify, vous pouvez ajouter un alias dans votre package.json :

``` js
"browser": {
  "vue": "vue/dist/vue.common"
},
```

<p class="tip">NE faites PAS `import Vue from 'vue/dist/vue.js'` (en effet, certains outils ou bibliothèques tierces peuvent également importer Vue, ce qui peut forcer l'app à charger conjointement les *builds runtime* et *standalone* et créer des erreurs).</p>

### Environnements CSP

Certains environnements, tels que les Applications de Google Chrome, font respecter la politique de sécurité de contenu (*Content Security Policy* - CSP), qui ne permet pas l'utilisation de `new Function()` pour évaluer les expressions. Le *build standalone* a besoin de cette fonctionnalité pour compiler les templates, elle n'est donc pas utilisable dans ces environnements.

D'un autre côté, le *build runtime* respecte pleinement les CSP. Quand vous utilisez le *build runtime* avec [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) ou [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), vos templates vont être pré-compilé dans les fonctions `render` qui fonctionnent parfaitement dans des environnements CSP.

## CLI

Vue.js offre une [interface en ligne de commande officielle](https://github.com/vuejs/vue-cli) pour mettre rapidement en place les bases d'une application monopage ambitieuse. Il offre une série de *builds* pré-configurés pour un *workflow frontend* moderne. Cela ne prend que quelques minutes pour commencer et lancer des rechargements à chaud, de l'analyse syntaxique à la sauvegarde, et des *builds* prêts pour la production :

``` bash
# installer vue-cli
$ npm install --global vue-cli
# créer un nouveau projet en utilisant le template "webpack"
$ vue init webpack my-project
# installer les dépendances et go !
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">Utiliser la CLI nécessite des connaissances préalables en Node.js et les outils de *build* associés. Si vous êtes nouveau sur Vue ou les outils de *build front-end*, nous vous recommandons fortement de parcourir <a href="./">le guide</a> sans aucun outil de *build* avant d'utiliser l'interface CLI.</p>

## Build de développement

**Important**: les fichiers générés dans le dossier `/dist` sur GitHub sont seulement vérifiés lors des releases. Pour utiliser la dernière version du code source de Vue sur GitHub, vous aurez à lancer le *build* vous-même !

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# dernière version stable
$ bower install vue
```

## Chargeurs de module AMD

Les versions *standalone* ou installées via Bower sont encapsulées selon UMD ce qui permet de directement les utiliser sous forme de module AMD.
