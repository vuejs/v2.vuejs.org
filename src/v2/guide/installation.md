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
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Untuk masa produksi, kami menyarankan untuk menggunakan angka versi dan bundel untuk menghindari perubahan signifikan pada versi terbaru:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.js"></script>
```

Jika kamu menggunakan ES Module asli, disediakan juga bundel kompatibel dengan ES Modules:

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js'
</script>
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

Vue menyediakan sebuah [CLI ofisial](https://github.com/vuejs/vue-cli) untuk perancah cepat Aplikasi Laman Tunggal. Ini menyediakan termasuk baterai membangun persiapan untuk alur kerja _frontend_ modern. Ini hanya memakan beberapa waktu untuk bangun dan berjalan dengan _hot-reload_, _lint-on-save_, dan _production-ready_ _builds_. Lihat [dokument Vue CLI](https://cli.vuejs.org) untuk lebih detil.

<p class="tip">CLI mengasumsikan pengetahuan sebelumnya tentang Node.js dan alat pembangun yang terkait. Jika Anda baru dalam Vue atau perangkat pembangun _front-end_, kami sangat menyarankan pergi ke <a href="./">petunjuk</a> tanpa perangkat pembangun apapun sebelum menggunakan CLI.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="noopener" title="Vue CLI">Watch a video explanation on Vue Mastery</a></div>

## Explanation of Different Builds

Di dalam [direktori `dist/` dari paket NPM](https://cdn.jsdelivr.net/npm/vue/dist/) Anda akan menemukan banyak perbedaan pembangun Vue.js. Ini gambaran umum dari perbedaan antara mereka:

| | UMD | CommonJS | ES Module (for bundlers) | ES Module (for browsers) |
| --- | --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| **Full (production)** | vue.min.js | - | - | vue.esm.browser.min.js |
| **Runtime-only (production)** | vue.runtime.min.js | - | - | - |

### Istilah

- **Full**: pembangun yang berisi semua _compiler_ dan _runtime_.

- **Compiler**: kode yang bertanggung jawab untuk mengkompilasi string templat menjadi fungsi render _Javascript_.

- **Runtime**: kode yang bertanggung jawab untuk membuat instan Vue, _rendering_, dan _patching_ DOM virtual, dll. Pada dasarnya semua kecuali _compiler_.

- **[UMD](https://github.com/umdjs/umd)**: Bundel UMD dapat digunakan langsung pada browser dengan *tag* `<script>`. file standart dari jsDelivr CDN  [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) merupakan *Runtime* + *Compiler* bundel UMD (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: Bundel CommonJS ditargetkan untuk digunakan oleh *bundler* lama seperti [browserify](http://browserify.org/) atau [webpack 1](https://webpack.github.io). Standar pada *bundler* ini (`pkg.main`) merupakan  *Runtime only CommonJS* bundel (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: mulai pada 2.6 Vue menyediakan dua bundel ES Modules (ESM):

  - ESM untuk *bundlers*: dimaksudkan untuk digunakan dengan *bundler* modern seperti [webpack 2](https://webpack.js.org) atau [Rollup](https://rollupjs.org/). Format ESM didesain secara statis dan dapat di analisis, sehingga *bundler* dapat mengambil keuntungan dari hal tersebut untuk melakukan [*tree-shaking*](https://www.keycdn.com/blog/tree-shaking) dan meng-eliminasi kode yang tidak digunakan dari bundel finalmu. File standar untuk bundel ini (`pkg.module`) adalah *Runtime only ES Module* bundel (`vue.runtime.esm.js`).

  - ESM untuk browser (2.6+ only): dimaksudkan untuk impor modul langsung di browser modern  `<script type="module">`.

### Runtime + Compiler vs. Runtime-only

If you need to compile templates on the client (e.g. passing a string to the `template` option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:

Jika kamu membutuhkan untuk menyusun (*compile*) templat pada sisi klien (contoh: menggunakan *string*  pada opsi `template`, atau  memasang pada element menggukana *in-DOM HTML* sebagai templat), kamu membutuhkan penyusun (*compiler*) dan dengan demikian juga bundel penuh (*full-build*).

``` js
// Ini membutuhkan kompiler
new Vue({
  template: '<div>{{ hi }}</div>'
})

// ini tidak
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

Saat kamu menggunakan `vue-loader` atau `vueify`, templat di dalam `*.vue` file sudah dikompilasi ke bentuk JavaScript pada saat built time. Kamu tidak terlalu membutuhkan kompiler dalam bundel akhir, dan hanya menggunakan *runtime-only* bundel.

Dikarenakan bundel *runtime-only* 30% lebih ringan daripada cara lain `full-build`, kamu harus menggunakannya disaat kamu bisa. Tapi jika kamu ingin menggunakan `full-build`, dapat dilakukan dengan menambahkan alias pada bundler.

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' untuk webpack versi 1
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
      'vue': require.resolve('vue/dist/vue.esm.js')
    })
  ]
})
```

#### Browserify

Tambahkan pada `package.json` anda:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Tambahkan pada `package.json` anda:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Masa Pengembangan vs. Masa Produksi (*Development vs. Production Mode*)

Masa pengembangan/produksi merupakan hasil `hard-coded` bundel UMD: bundel yang tidak di minifikasi merupakan bundel masa pengembangan dan yang tidak di minifikasi merupakan bundel masa produksi.

Bundel CommonJS dan ES Module dimaksudkan kepada pembuat bundel (*bundlers*), karena itu kita tidak menyediakan versi minifikasi untuk bundel tersebut (CommonJs dan ES Module). Kamu bertanggunag jawab atas bundel akhir untuk strategi minifikasi tersebut.

Bundel CommonJS dan ES Module juga mempertahankan untuk memeriksa mentah `process.env.NODE_ENV` untuk menentukan mode mana yang digunakan saat apliaksi berjalan. Kamu harus menggunakan konfigurasi pembuat bundel (*bundler*) yang benar untuk menggantikan variabel ekosistem tersebut dikarekan untuk mengontrol di mode manakah Vue harus berjalan (Masa pengembangan/produksi). Mengganti `process.env.NODE_ENV` menggunakan *string literal* juga memungkinkan alat minifikasi (*minifiers*) seperti UglifyJS untuk membuang blok code pada masa pengembangan.

#### Webpack

Di dalam Webpack 4+, kamu dapat menggunakan opsi `mode`:

``` js
module.exports = {
  mode: 'production'
}
```
Untuk Webpack 3 dan sebelumnya, kamu harus menggunakan [*DefinePlugin*](https://webpack.js.org/plugins/define-plugin/):

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

Gunakan [*rollup-plugin-replace*](https://github.com/rollup/rollup-plugin-replace):

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

Gunakan mode global [*envify*](https://github.com/hughsk/envify) untuk merubah bundel.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Lihat juga [tips masa produksi dan pengembangan](deployment.html).

### Ekosistem CSP

Beberapa lingkungan, seperti Google Chrome Apps, mengharuskan Content Security Policy (CSP), dimana melarang penggunakan `new Function()` untuk mengevaluasi ekspresi (dalam hal ini *function expression*). Bundel akhir tergantung pada fitur ini untuk menyusun templat, jadi *bundler* tidak berguna sama sekali dalam ekosistem ini.

Di sisi lain, *runtime-only* bundel merupakan bundel yang sesui untuk ekositem CSP. Saat menggunakan bundel *runtime-only* dengan [Webpack + Vueloader](https://github.com/vuejs-templates/webpack-simple) atau [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple) tempatmu akan disusun kedalam fungsi `render` yang dimana hal ini cocok untuk ekosistem CSP

## Bundel Pengembangan (*Dev Build*)

**Penting**: the built files in GitHub's `/dist` folder are only checked-in during releases. To use Vue from the latest source code on GitHub, you will have to build it yourself!

File bundel pada Github `/dist` folder hanya disusun (*compile*) saat rilis. Untuk menggunakan Vue dari kode sumber terakhir di Github, kamu harus menyusun-nya sendiri.

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Hanya bundel UMD saja yang disediakan dari Bower

``` bash
# versi stabil terakhir
$ bower install vue
```

## AMD Module Loaders

Semua bundel UMD bisa digunakan langsung sebagai modul AMD
