---
title: Instalasi
type: guide
order: 1
vue_version: 2.5.16
gz_size: "30.90"
---

### Catatan Kesesuaian

Vue **tidak** mendukung IE8 ke bawah, karena ini menggunakan fitur ECMAScript 5 yang tidak mudah dikenali di IE8. Bagaimanapun ini mendukung semua [ECMAScript 5 peramban yang sesuai](https://caniuse.com/#feat=es5).

### Catatan Rilis

Versi stabil terakhir: {{vue_version}}

Catatan detil rilis untuk setiap versi tersedia di [GitHub](https://github.com/vuejs/vue/releases).

## Vue Devtools

Ketika menggunakan Vue, kami menyarankan untuk menginstal juga [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) di peramban Anda, memungkinkan Anda untuk menginspeksi dan awakutu aplikasi Vue Anda dengan antarmuka yang akrab pengguna.

## Menyertakan `<script>` Langsung (pada HTML)

Unduh dan menyertakan dengan tag script. `Vue` akan teregistrasi sebagai variabel global.

<p class="tip">Jangan gunakan versi yang sudah dikecilkan selama pengembangan. Anda akan melewatkan semua peringatan untuk kesalahan umum!</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Versi Pengembang</a><span class="light info">Dengan peringatan penuh dan mode awakutu</span>

<a class="button" href="/js/vue.min.js" download>Versi Produksi</a><span class="light info">Peringatan dihilangkan, {{gz_size}}KB min+gzip</span>
</div>

### CDN

Kami merekomendasikan untuk versi spesifik yang dapat Anda mutakhirkan secara manual:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>
```

Anda dapat mencari sumber dari paket NPM di [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue juga tersedia di [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) dan [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (cdnjs membutuhkan waktu untuk singkronisasi mungkin rilis terakhir belum tersedia).

Pastikan untuk membaca tentang [perbedaan _build_ Vue](#Explanation-of-Different-Builds) dan gunakan **versi produksi** dalam situs Anda yang telah terbit, mengganti `vue.js` dengan `vue.min.js`. Ini mengoptimalkan _build_ yang lebih kecil untuk kecepatan dari pada pengalaman pengembangan.

## NPM

NPM adalah metode instalasi yang disarankan ketika membangun aplikasi skala besar dengan Vue. Ini bersanding dengan baik dengan modul _bundler_ seperti [Webpack](https://webpack.js.org/) atau [Browserify](http://browserify.org/). Vue juga menyediakan perangkat pendamping untuk pemrograman [Berkas Komponen Tunggal](single-file-components.html).

``` bash
# stabil terakhir
$ npm install vue
```

## CLI

Vue provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds. See [the Vue CLI docs](https://cli.vuejs.org) for more details.

<p class="tip">The CLI assumes prior knowledge of Node.js and the associated build tools. If you are new to Vue or front-end build tools, we strongly suggest going through <a href="./">the guide</a> without any build tools before using the CLI.</p>

## Explanation of Different Builds

In the [`dist/` directory of the NPM package](https://cdn.jsdelivr.net/npm/vue/dist/) you will find many different builds of Vue.js. Here's an overview of the difference between them:

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | - | - |
| **Runtime-only (production)** | vue.runtime.min.js | - | - |

### Terms

- **Full**: builds that contain both the compiler and the runtime.

- **Compiler**: code that is responsible for compiling template strings into JavaScript render functions.

- **Runtime**: code that is responsible for creating Vue instances, rendering and patching virtual DOM, etc. Basically everything minus the compiler.

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from jsDelivr CDN at [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) is the Runtime + Compiler UMD build (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](https://rollupjs.org/). The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`vue.runtime.esm.js`).

### Runtime + Compiler vs. Runtime-only

If you need to compile templates on the client (e.g. passing a string to the `template` option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:

``` js
// this requires the compiler
new Vue({
  template: '<div>{{ hi }}</div>'
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

#### Parcel

Add to your project's `package.json`:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Development vs. Production Mode

Development/production modes are hard-coded for the UMD builds: the un-minified files are for development, and the minified files are for production.

CommonJS and ES Module builds are intended for bundlers, therefore we don't provide minified versions for them. You will be responsible for minifying the final bundle yourself.

CommonJS and ES Module builds also preserve raw checks for `process.env.NODE_ENV` to determine the mode they should run in. You should use appropriate bundler configurations to replace these environment variables in order to control which mode Vue will run in. Replacing `process.env.NODE_ENV` with string literals also allows minifiers like UglifyJS to completely drop the development-only code blocks, reducing final file size.

#### Webpack

In Webpack 4+, you can use the `mode` option:

``` js
module.exports = {
  mode: 'production'
}
```

But in Webpack 3 and earlier, you'll need to use [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

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

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The full build depends on this feature to compile templates, so is unusable in these environments.

On the other hand, the runtime-only build is fully CSP-compliant. When using the runtime-only build with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

## Dev Build

**Important**: the built files in GitHub's `/dist` folder are only checked-in during releases. To use Vue from the latest source code on GitHub, you will have to build it yourself!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Only UMD builds are available from Bower.

``` bash
# latest stable
$ bower install vue
```

## AMD Module Loaders

All UMD builds can be used directly as an AMD module.
