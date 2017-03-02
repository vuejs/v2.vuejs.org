---
title: Installation
type: guide
order: 1
vue_version: 2.2.0
dev_size: "234.23"
min_size: "74.22"
gz_size: "26.87"
ro_gz_size: "18.71"
---

### Compatibilité

Vue **ne** supporte **pas** IE8 et les versions antérieures, car il utilise des fonctionnalités ECMAScript 5 qui ne peuvent pas être émulées sur IE8. Cela dit, Vue supporte tous les [navigateurs compatibles ECMAScript 5](http://caniuse.com/#feat=es5).

### Notes de version

Les notes de version détaillées pour chaque version sont disponibles sur [GitHub](https://github.com/vuejs/vue/releases).

## Inclusion directe `<script>`

Il suffit de télécharger et de l'inclure avec une balise script. `Vue` sera déclaré comme une variable globale.

<p class="tip">N'utilisez pas la version minifiée pendant le développement car vous ne bénéficieriez alors pas des avertissements pour les erreurs courantes !</p>

<div id="downloads">
<a class="button" href="./js/vue.js" download>Version de développement</a><span class="light info">Avec tous les avertissements et le mode de débogage</span>

<a class="button" href="./js/vue.min.js" download>Version de production</a><span class="light info">Avertissements retirés, {{gz_size}}ko min+gzip</span>
</div>

### CDN

Recommandé : [https://unpkg.com/vue](https://unpkg.com/vue), qui reflète la dernière version aussitôt qu'elle est publiée sur NPM. Vous pouvez également parcourir la source du package NPM sur [https://unpkg.com/vue/](https://unpkg.com/vue/).

Également disponible sur [jsDelivr](//cdn.jsdelivr.net/vue/latest/vue.js) ou [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), mais ces deux services mettent du temps à se synchroniser ce qui signifie que la dernière version peut ne pas être encore disponible.

## NPM

NPM est la méthode d'installation recommandée lors du développement de grosses applications avec Vue. Il s'associe bien avec des empaqueteurs de modules comme [Webpack](https://webpack.js.org/) ou [Browserify](http://browserify.org/). Vue fournit également des outils d'accompagnement pour la rédaction de [Composants Mono-fichier](single-file-components.html).

``` bash
# dernière version stable
$ npm install vue
```

## CLI

Vue.js provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds:

``` bash
# install vue-cli
$ npm install --global vue-cli
# create a new project using the "webpack" template
$ vue init webpack my-project
# install dependencies and go!
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">The CLI assumes prior knowledge of Node.js and the associated build tools. If you are new to Vue or front-end build tools, we strongly suggest going through <a href="./">the guide</a> without any build tools before using the CLI.</p>

## Explanation of Different Builds

In the [`dist/` directory of the NPM package](https://unpkg.com/vue@latest/dist/) you will find many different builds of Vue.js. Here's an overview of the difference between them:

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | - | - |
| **Runtime-only (production)** | vue.runtime.min.js | - | - |

### Terms

- **Full**: builds that contains both the compiler and the runtime.

- **Compiler**: code that is responsible for compiling template strings into JavaScript render functions.

- **Runtime**: code that is responsible for creating Vue instances, rendering and patching virtual DOM, etc. Basically everything minus the compiler.

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from Unpkg CDN at [https://unpkg.com/vue](https://unpkg.com/vue) is the Runtime + Compiler UMD build (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](http://rollupjs.org/). The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`vue.runtime.esm.js`).

### Runtime + Compiler vs. Runtime-only

If you need to compile templates on the fly (e.g. passing a string to the `template` option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:

``` js
// this requires the compiler
new Vue({
  template: `<div>{{ hi }}</div>`
})

// this does not
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

When using `vue-loader` or `vueify`, templates inside `*.vue` files are pre-compiled into JavaScript at build time. You don't really need the compiler in the final bundle, and can therefore use the runtime-only build.

Since the runtime-only builds are roughly 30% lighter-weight than their full-build counterparts, you should use it whenever you can. If you still wish to use the full build instead, you need to configure an alias in your bundler:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
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

Add to your project's `package.json`:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### Development vs. Production Mode

Development/production modes are hard-coded for the UMD builds: the un-minified files are for development, and the minified files are for production.

CommonJS and ES Module builds are intended for bundlers, therefore we don't provide minified versions for them. You will be responsible for minifying the final bundle yourself.

CommonJS and ES Module builds also preserve raw checks for `process.env.NODE_ENV` to determine the mode they should run in. You should use appropriate bundler configurations to replace these environment variables in order to control which mode Vue will run in. Replacing `process.env.NODE_ENV` with string literals also allows minifiers like UglifyJS to completely drop the development-only code blocks, reducing final file size.

#### Webpack

Use Webpack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

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

Use [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

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

Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Also see [Production Deployment Tips](deployment.html).

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The standalone build depends on this feature to compile templates, so is unusable in these environments.

On the other hand, the runtime-only build is fully CSP-compliant. When using the runtime-only build with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

## Build de développement

**Important**: les fichiers générés dans le dossier `/dist` sur GitHub sont seulement vérifiés lors des releases. Pour utiliser la dernière version du code source de Vue sur GitHub, vous aurez à lancer le *build* vous-même !

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Only UMD builds are available from Bower.

``` bash
# dernière version stable
$ bower install vue
```

## Chargeurs de module AMD

Les versions *standalone* ou installées via Bower sont encapsulées selon UMD ce qui permet de directement les utiliser sous forme de module AMD.
