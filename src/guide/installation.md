---
title: Instalasi
type: guide
order: 0
vue_version: 1.0.26
dev_size: "266.44"
min_size: "75.01"
gz_size: "26.03"
---

### Catatan Kompatibilitas

<!-- Vue.js does **not** support IE8 and below, because Vue.js uses ECMAScript 5 features that are un-shimmable in IE8. However Vue.js supports all [ECMAScript 5 compliant browsers](http://caniuse.com/#feat=es5). -->
Vue.js **tidak mendukung** IE8 dan di bawahnya, karena Vue.js memakai fitur ECMAScript 5 yang dapat berjalan di IE8. Akan tetapi, Vue.js mendukung semua [browser yang dapat menjalankan ECMAScript 5](http://caniuse.com/#feat=es5).

### Catatan Rilis

<!-- Detailed release notes for each version are available on [GitHub](https://github.com/vuejs/vue/releases). -->
Detil catatan rilis untuk setiap versi tersedia di [GitHub](https://github.com/vuejs/vue/releases).

## Standalone

<!-- Simply download and include with a script tag. `Vue` will be registered as a global variable. **Pro tip: don't use the minified version during development. you will miss out all the nice warnings for common mistakes.** -->
Download dengan mudah dan cukup masukkan ke dalam tag `<script>`. `Vue` akan ter-register sebagai variabel global. **Tips: jangan menggunakan versi minified (versi produksi) selama proses pengembangan aplikasi, karena anda tidak dapat melihat semua peringatan maupun pesan error jika terdapat kesalahan.**

<div id="downloads">
<a class="button" href="/js/vue.js" download>Versi Pengembangan</a><span class="light info">dengan full warnings dan debug mode</span>

<a class="button" href="/js/vue.min.js" download>Versi Produksi</a><span class="light info">Tanpa warning, {{gz_size}}kb min+gzip</span>
</div>

### CDN (Content Delivery Network)

<!-- Available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet). -->
Tersedia di [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) atau [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (membutuhkan beberapa saat untuk sinkronasi, jadi versi terbaru mungkin belum tersedia)

<!-- Also available on [npmcdn](https://npmcdn.com/vue/dist/vue.min.js), which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at [npmcdn.com/vue/](https://npmcdn.com/vue/). -->
Juga tersedia di [npmcdn](https://npmcdn.com/vue/dist/vue.min.js), yang secara otomatis tersedia versi terakhir ketika versi tersebut baru dirilis di npm. Anda juga dapat melihat-lihat sumber package npm di [npmcdn.com/vue/](https://npmcdn.com/vue/).

### CSP-compliant build

<!-- Some environments, such as Google Chrome Apps, enforces Content Security Policy (CSP) and does not allow the use of `new Function()` for evaluating expressions. In these cases you can use the [CSP-compliant build](https://github.com/vuejs/vue/tree/csp/dist) instead. -->
Beberapa environment, seperti Google Chrome Apps, memaksa Content Security Policy (CSP) dan tidak memperbolehkan penggunaan `new Function()` untuk meng-evaluasi expressions. Dalam kasus ini maka Anda harus menggunakan [CSP-compliant build](https://github.com/vuejs/vue/tree/csp/dist) sebagai gantinya.

## NPM

<!-- NPM is the recommended installation method when building large scale apps with Vue.js. It pairs nicely with a CommonJS module bundler such as [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). Vue.js also provides accompanying tools for authoring [Single File Components](application.html#Single-File-Components). -->
NPM adalah metode instalasi yang direkomendasikan ketika membangun sebuah aplikasi berskala besar menggunakan Vue.js. Ia berpasangan dengan baik dengan CommonJS module bundler seperti [Webpack](http://webpack.github.io/) atau [Browserify](http://browserify.org/). Vue.js juga menyediakan accompanying tools untuk authoring [Single File Components](application.html#Single-File-Components)

``` bash
# versi stabil terbaru
$ npm install vue
# versi stabil terbaru + CSP-compliant
$ npm install vue@csp
```

## CLI (Command Line Interface)

<!-- Vue.js provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides battery-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save and production-ready builds: -->
Vue.js menyediakan sebuah [CLI resmi](https://github.com/vuejs/vue-cli) untuk mempercepat pembangunan Single Page Applications. Hanya membutuhkan beberapa menit untuk memasang dan menjalankan dengan hot-reload, lint-on-save dan production-ready builds.

``` bash
# install vue-cli
$ npm install -g vue-cli
# buat sebuah project menggunakan boilerplate "webpack"
$ vue init webpack my-project
# install dependencies dan siap dijalankan!
$ cd my-project
$ npm install
$ npm run dev
```

## Dev Build
<!-- **Important**: the CommonJS bundle distributed on NPM (`vue.common.js`) is only checked-in during releases on the `master` branch, so the file in the `dev` branch is the same as the stable release. To use Vue from the latest source code on GitHub, you will have to build it yourself! -->

**Penting**: the CommonJS bundle distributed on NPM (`vue.common.js`) is only checked-in during releases on the `master` branch, so the file in the `dev` branch is the same as the stable release. Untuk menggunakan Vue dari source code terbaru di GitHub, Anda harus membuatnya sendiri!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# versi stabil terbaru
$ bower install vue
```

## AMD Module Loaders

<!-- The standalone downloads or versions installed via Bower are wrapped with UMD so they can be used directly as an AMD module. -->

Versi standalone download maupun versi yang terinstall melalui Bower adalah di-wrap dengan UMD, jadi dapat langsung digunakan sebagai modul AMD.
