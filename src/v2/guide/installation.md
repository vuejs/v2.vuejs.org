---
title: Installation
type: guide
order: 1
vue_version: 2.3.0
dev_size: "247.31"
min_size: "76.64"
gz_size: "28.03"
ro_gz_size: "19.54"
---

### Compatibilité

Vue **ne** supporte **pas** IE8 et les versions antérieures, car il utilise des fonctionnalités ECMAScript 5 qui ne peuvent pas être émulées sur IE8. Cela dit, Vue supporte tous les [navigateurs compatibles ECMAScript 5](http://caniuse.com/#feat=es5).

### Notes de version

Les notes de version détaillées pour chaque version sont disponibles sur [GitHub](https://github.com/vuejs/vue/releases).

## Inclusion directe `<script>`

Il suffit de télécharger et de l'inclure avec une balise script. `Vue` sera déclaré comme une variable globale.

<p class="tip">N'utilisez pas la version minifiée pendant le développement. Vous ne bénéficieriez alors pas des avertissements pour les erreurs courantes !</p>

<div id="downloads">
<a class="button" href="../../js/vue.js" download>Version de développement</a><span class="light info">Avec tous les avertissements et le mode de débogage</span>

<a class="button" href="../../js/vue.min.js" download>Version de production</a><span class="light info">Avertissements retirés, {{gz_size}}ko min+gzip</span>
</div>

### CDN

Recommandé : [https://unpkg.com/vue](https://unpkg.com/vue), qui reflète la dernière version aussitôt qu'elle est publiée sur npm. Vous pouvez également parcourir la source du package npm sur [https://unpkg.com/vue/](https://unpkg.com/vue/).

Également disponible sur [jsDelivr](//cdn.jsdelivr.net/vue/latest/vue.js) ou [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), mais ces deux services mettent du temps à se synchroniser ce qui signifie que la dernière version peut ne pas être encore disponible.

## npm

npm est la méthode d'installation recommandée lors du développement de grosses applications avec Vue. Il s'associe bien avec des empaqueteurs de modules comme [webpack](https://webpack.js.org/) ou [Browserify](http://browserify.org/). Vue fournit également des outils d'accompagnement pour la rédaction de [Composants Mono-fichier](single-file-components.html).

``` bash
# dernière version stable
$ npm install vue
```

## CLI

Vue.js offre une [CLI](https://github.com/vuejs/vue-cli) (interface en ligne de commande) officielle pour mettre rapidement en place les bases d'une application monopage ambitieuse. Il offre une série de *builds* pré-configurés pour un *workflow frontend* moderne. Cela ne prend que quelques minutes pour commencer et lancer des rechargements à chaud, de l'analyse syntaxique à la sauvegarde, et des *builds* prêts pour la production :

``` bash
# installer vue-cli
$ npm install --global vue-cli
# créer un nouveau projet en utilisant le template "webpack"
$ vue init webpack my-project
# installer les dépendances et c'est parti !
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">Utiliser la CLI nécessite des connaissances préalables en Node.js et les outils de *build* associés. Si vous êtes nouveau sur Vue ou les outils de *build front-end*, nous vous recommandons fortement de parcourir <a href="./">le guide</a> sans aucun outil de *build* avant d'utiliser l'interface CLI.</p>

## Explication des différents *builds*

Dans le [dossier `dist/` du package npm](https://unpkg.com/vue@latest/dist/) vous trouverrez plusieurs *builds* différents de Vue.js. Voici un aperçu des différences entre chacun d'eux :

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | - | - |
| **Runtime-only (production)** | vue.runtime.min.js | - | - |

### Termes

- **Full**: des *builds* qui contiennent la partie Compiler ainsi que la version Runtime.

- **Compiler**: le code qui est responsable de la compilation des chaînes de caractère de template en des fonctions de rendu en JavaScript.

- **Runtime**: le code qui est responsable de la création des instances de Vue, de faire le rendu et les modifications du DOM virtuel. C'est à dire tout, sauf ce que fait la partie Compiler.

- **[UMD](https://github.com/umdjs/umd)**: Les *builds* UMD peuvent être utilisés directement dans un navigateur directement avec la balise `<script>`. Le fichier par défaut du CDN Unpkg à l'adresse [https://unpkg.com/vue](https://unpkg.com/vue) est le *build* UMD Runtime + Compiler (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: Les *builds* CommonJS sont prévus pour une utilisation avec les vieux outils de *bundle* comme [browserify](http://browserify.org/) ou [webpack 1](https://webpack.github.io). Le fichier par défaut pour ces outils (`pkg.main`) est le *build* CommonJS Runtime (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: Les *builds* ES module sont prévus pour une utilisation avec les outils de *bundle* modernes comme [webpack 2](https://webpack.js.org) ou [rollup](http://rollupjs.org/). Le fichier par défaut pour ces outils (`pkg.module`) est le *build* ES Module Runtime (`vue.runtime.esm.js`).

### Runtime + Compiler vs. Runtime seul

Si vous avez besoin de compiler des templates en temps réel (ex. : passer une chaîne de caractère à l'option `template`, ou monter un élément en vous servant de sa représentation HTML dans le DOM comme template) vous aurez besoin du compilateur et donc du *build* Full :

``` js
// ceci a besoin d'un compilateur
new Vue({
  template: '<div>{{ hi }}</div>'
})

// ceci n'en a pas besoin
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

En utilisant `vue-loader` ou `vueify`, les templates à l'intérieur des fichiers `*.vue` sont pré-compilés en JavaScript pendant l'étape de *build*. Vous n'avez donc pas réellement besoin du compilateur dans le *bundle* final et pouvez dans ce cas utiliser la version du *build* Runtime.

Puisque le *build* Runtime est approximativement 30% plus léger que son homologue le *build* Full, vous devriez l'utiliser autant que possible. Si vous souhaitez toujours utiliser le *build* Full à la place, vous avez besoin de configurer un alias dans votre outil de *bundle* :

#### webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' pour webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

Ajoutez au fichier `package.json` de votre projet :

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### Mode dévelopement vs. mode production

Les modes développement et production sont écrits en dur dans les *builds* UMD : les fichiers non minifiés sont pour le développement, et les fichier minifiés sont pour la production.

Les *builds* CommonJS et ES Module sont prévus pour les outils de *bundle*, donc nous ne fournissons pas de version minifié pour eux. Vous aurez à votre charge de minifier le *bundle* final vous-même.

Les *builds* CommonJS et ES Module contiennent une utilisation de `process.env.NODE_ENV` pour déterminer le mode qu'ils doivent suivre. Vous devriez utiliser une configuration d'outil de *bundle* appropriée pour remplacer ces d'environnements afin de contrôler lequel des modes Vue exécutera. Remplacer `process.env.NODE_ENV` avec une chaîne de caractère littérale permet aux outils de minification comme UglifyJS de complètement retirer les pends de code réservés au développement, réduisant ainsi la taille du fichier final.

#### webpack

Utiliser la fonction [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) de webpack :

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

Utilisez le [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace) :

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Appliquez une transformation [envify](https://github.com/hughsk/envify) globale à votre *bundle*.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Référez vous également aux [conseils de déploiment en production](deployment.html).

### Environnements CSP

Certains environnements, tels que les Applications de Google Chrome, font respecter la politique de sécurité de contenu (*Content Security Policy* - CSP), qui ne permet pas l'utilisation de `new Function()` pour évaluer les expressions. Le *build complet* a besoin de cette fonctionnalité pour compiler les templates, elle n'est donc pas utilisable dans ces environnements.

D'un autre côté, le *build runtime* respecte pleinement les CSP. Quand vous utilisez le *build runtime* avec [webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) ou [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), vos templates vont être pré-compilés dans les fonctions `render` qui fonctionnent parfaitement dans des environnements CSP.

## Build de développement

**Important**: les fichiers générés dans le dossier `/dist` sur GitHub sont seulement vérifiés lors des releases. Pour utiliser la dernière version du code source de Vue sur GitHub, vous aurez à lancer le *build* vous-même !

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Seulement les *builds* UMD sont disponibles depuis Bower.

``` bash
# dernière version stable
$ bower install vue
```

## Chargeurs de module AMD

Les versions *standalone* ou installées via Bower sont encapsulées selon UMD ce qui permet de directement les utiliser sous forme de module AMD.
