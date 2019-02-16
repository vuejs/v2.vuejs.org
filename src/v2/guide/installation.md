---
title: Pemasangan
type: guide
order: 1
vue_version: 2.5.16
gz_size: "30.90"
---

### Catatan Kompatibilitas

Vue **tidak** mendukung IE8 kebawah, karena Vue menggunakan fitur ECMAScript 5 yang tidak bisa digunakan di IE8. Vue mendukung semua browser yang mendukung [ECMAScript 5](https://caniuse.com/#feat=es5).

### Catatan Rilis

Versi Stabl Terakhir: {{vue_version}}

Catatan rilis yang mendetail untuk tiap versi tersedia di [GitHub](https://github.com/vuejs/vue/releases). 

## Vue Devtools

Ketika menggunakan Vue, kami sarankan kalian menggunakan [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools). Vue Devtools adalah alat pendukung pengembangan yang bisa dipasang di browser yang akan membantu kalian memeriksa dan mendebug aplikasi Vue kalian dengan antar muka yang lebih mudah digunakan.


## Menggunakan Vue Langsung Melalui `<script>`

Vue bisa digunakan langsung dengan memanggilnya melalui tag script. `Vue` akan didaftarkan sebagai variable global. Cukup unduh Vue dan panggil menggunakan tag script.

<p class="tip">Jangan gunakan versi Vue yang sudah dikecilkan untuk tahap pengembangan, kalian akan melewatkan peringatan-peringatan penting yang bisa membantu kalian menghindari kesalahan yang umum dihadapi saat menggunakan Vue!</p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>Versi Pengembangan</a><span class="light info"> Lengkap dengan peringatan dan mode debug.</span>

  <a class="button" href="/js/vue.min.js" download>Versi Produksi</a><span class="light info"> Tanpa peringatan, ukuran {{gz_size}}KB min+gzip</span>
</div>s

### CDN

Untuk kebutuhan pembuatan purwarupa dan pembelajaran, kalian bisa menggunakan:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Untuk produksi, kita sarankan untuk menggunakan versi tertentu untuk menghindari kesalahan yang tidak bisa diprediksi dari versi baru.

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.js"></script>
```

Jika kalian menggunakan _ES modules_ alami, ada juga versi yang cocok dengan _ES modules_:

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js'
</script>
```

Kalian bisa melihat sumber dari paket NPM di [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue juga tersedia melalui [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) dan [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (cdnjs butuh waktu untuk memproses versi terbaru, sehingga bisa terjadi keterbelakangan versi cdnjs dengan versi lainnya).

Pastikan untuk membaca tentang [berbagai jenis edisi Vue](#Berbagai-Jenis-Edisi-Vue) dan gunakan **versi produksi** di situs kalian, ganti `vue.js` dengan `vue.min.js`. Edisi ini lebih kecil dan dioptimalkan untuk kecepatan dibandingkan edisi development.

## NPM

NPM adalah cara pemasangan yang direkomendasikan ketika membuat aplikasi skala besar menggunakan Vue. Cocok digunakan dengan penggabung modul seperti [Webpack](https://webpack.js.org/) atau [Browserify](http://browserify.org/). Vue juga memberikan alat untuk membuat [Komponen Satu Berkas](single-file-components.html).

``` bash
# versi stabil terakhir
$ npm install vue
```

## CLI

Vue menyediakan alat [konsol resmi Vue CLI](https://github.com/vuejs/vue-cli) yang bisa digunakan untuk membuat aplikasi satu halaman dengan praktis. Vue CLI berisi konfigurasi yang sesuai dengan alur kerja modern. Dalam beberapa menit, kalian sudah bisa memiliki fitur _hot-reload_, _lint-on-save_, dan edisi yang siap digunakan untuk produksi. Lihat [dokumentasi Vue CLI](https://cli.vuejs.org) untuk informasi lebih lanjut.

<p class="tip">VueCLI berasumsi bahwa kalian paham dengan dasar-dasar Node.js dan _build tools_ yang terkait. Jika kalian masih baru menggunakan Vue atau baru dengan _build tools_ _front-end_, kami sarankan kalian untuk mengikuti <a href="./">panduan</a> tanpa menggunakan _build tools_ sebelum menggunakan Vue CLI.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="noopener" title="Vue CLI">Lihat Video Penjelasan di Vue Mastery</a></div>

## Berbagai Jenis Edisi Vue

Di direktori [`dist/` paket NPM](https://cdn.jsdelivr.net/npm/vue/dist/) kalian akan menemukan berbagai
edisi _build_ dari Vue.js. Berikut sedikit penjelasan tentang perbedaannya:

| | UMD | CommonJS | ES Module (untuk penggabung) | ES Module (untuk browser) |
| --- | --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| **Hanya Runtime** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| **Full (produksi)** | vue.min.js | - | - | vue.esm.browser.min.js |
| **Hanya Runtime(produksi)** | vue.runtime.min.js | - | - | - |

### Penjelasan

- **Full**: Edisi yang berisi _compiler_ dan _runtime_.

- **Compiler**: Kode yang berfungsi untuk merubah templat string menjadi fungsi pelukis di JavaScript.

- **Runtime**: Kode yang berfungsi untuk membuat instan Vue, melukis dan menambal _virtual DOM_, dsb. Intinya apapun selain dari _compiler_.

- **[UMD](https://github.com/umdjs/umd)**: Edisi UMD bisa digunakan langsun di browser menggunakan tag `<script>`. Berkas dasar dari jsDelivr CDN di [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) adalah edisi _Runtime_ + _Compiler_ (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: Edisi CommonJS ditujukan untuk digunakan bersamaan dengan penggabung generasi lama seperti [browserify](http://browserify.org/) atau [webpack 1](https://webpack.github.io). Berkas dasar dari penggabung tersebut (`pkg.main`) adalah versi _Runtime_ saja (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: Mulai dari versi 2.6, Vue menyediakan dua edisi _ES Modules_ (ESM):

  - ESM untuk penggabug: ditujukan untuk digunakan dengan penggabung generasi baru seperti [webpack 2](https://webpack.js.org) atau [Rollup](https://rollupjs.org/). Format ESM didesain untuk bisa dianalisa secara statis sehingga pembungkus bisa melakukan _"tree-shaking"_ untuk menghilangkan kode yang tidak terpakai di hasil akhir _build_. Berkas dasar dari penggabung tersebut (`pkg.module`) adalah versi _Runtime_ saja(`vue.runtime.esm.js`).

  - ESM untuk browsers (hanya 2.6 keatas): ditujukan untuk _import_ langsung dari browser modern menggunakan `<script type="module">`.

### Runtime + Compiler atau Runtime saja?

Jika kalian butuh melakukan kompilasi tempplat di browser (contoh. menggunakan opsi `template`, atau memasang ke elemen menggunakan DOM HTML di dalamnya sebagai templat), kalian akan membutuhkan _compiler_.

``` js
// yang seperti ini butuh compiler
new Vue({
  template: '<div>{{ hi }}</div>'
})

// yang ini tidak
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

Ketika menggunakan `vue-loader` atau `vueify`, template di dalam berkas `*.vue` akan dirubah ke dalam bentuk JavaScript terlebih dahulu. Sehingga kalian tidak butuh menggunakan edisi yang ada _compiler_-nya, cukup edisi _runtime_ saja.

Karena edisi runtime 30% lebih ringan dibandingkan edisi yang ada _compiler_-nya, disarankan untuk selalu menggunakannya sebisa mungkin. Jika kalian masih tetap ingin menggunakan edisi _full_, kalian harus melakukan konfigurasi alias di penggabung kalian.

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' untuk webpack 1
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

Tambahkan ke `package.json` proyek kalian:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Tambahkan ke `package.json` proyek kalian:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Mode Pengembangan atau Mode Produksi

Mode pengembangan/produksi sudah di _hard-code_ untuk edisi UMD: versi sebelum dikecilkan untuk pengembangan, dan versi yang dikecilkan untuk produksi.

Edisi CommonJS dan ESM ditujukan untuk bundler, sehingga kami tidak menyediakan versi kecilnya. Kalian yang bertanggung jawab untuk mengecilkan hasil penggabungannya sendiri.

Edisi CommonJS dan ESM juga mempertahankan pengecekan mentah untuk `process.env.NODE_ENV` untuk menentukan dalam mode apa mereka harus berjalan. Kalian harus menggunakan konfigurasi penggabung yang sesuai untuk mengganti variable lingkungan tersebut untuk mengatur dalam mode apa Vue harus berjalan. Mengganti `process.env.NODE_ENV` dengan string juga akan membuat pengecil seperti UglifyJS untuk menghilangkan bagian kode untuk pengembangan, sehingga ukuran hasil akhirnya bisa lebih kecil

#### Webpack

Di Webpack 4+, kalian bisa menggunakan opsi `mode`:

``` js
module.exports = {
  mode: 'production'
}
```

Tapi di versi Webpack 3 dan sebelumnya, kalian harus menggunakan [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

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

Gunakan [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

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

Terapkan global [envify](https://github.com/hughsk/envify) transform ke penggabungan kalian.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Lihat juga [Tips Untuk Peluncuran Produksi](deployment.html).

### Lingkungan CSP

Untuk beberapa environment, seperti Google Chrome Apps, menerapkan Content Security Policy (CSP), yang melarang penggunaan `New Function()` for mengevaluasi ekspresi. Edisi full bergantung dengan fitur ini untuk melakukan kompilasi templat, jadi tidak bisa digunakan di lingkungan ini.

Di sisi lain, edisi _runtime_ sepenuhnya kompatible dengan CSP. Dengan menggunakan edisi _runtime_ saja dengan [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) atau [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), templat kalian akan dikompilasi menjadi fungsi `render` yang akan bekerja dengan baik dengan CSP.

## Dev Build

**Penting**: Berkas yang dihasilkan di direktori `/dist` di GitHub hanya diperbarui ketika rilis. Untuk menggunakan Vue dari sumber kode yang ada di GitHub, kalian harus mem-`build`-nya sendiri.

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Hanya edisi UMD yang tersedia di Bower.

``` bash
# versi stabil terakhir
$ bower install vue
```

## Pemuat Modul AMD Module

Semua edisi UMD bisa digunakan langsung dengan modul AMD