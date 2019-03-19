---
title: Penempatan Produksi
type: guide
order: 404
---

> Sebagian besar tips di bawah ini sudah ada secara standar jika Anda menggunakan [Vue CLI](https://cli.vuejs.org). Bagian ini hanya relevan jika Anda menggunakan penyiapan _build_ khusus.

## Mengaktifkan Mode Produksi

Selama proses pengembangan, Vue memberikan banyak peringatan untuk membantu Anda terhadap kesalahan umum dan perangkap. Namun, dalam mode produksi peringatan ini tidak muncul dan mencegah pembengkakan ukuran muatan aplikasi Anda. Selain itu, beberapa pemeriksaan peringatan ini memiliki biaya runtime yang kecil.

### Tanpa Alat Build

Jika Anda menggunakan _build_ lengkap, misal, langsung memasukkan Vue melalui tag skrip tanpa alat _build_, pastikan untuk menggunakan versi _minified_ (`vue.min.js`) untuk produksi. Kedua versi dapat ditemukan di [Panduan Instalasi](installation.html#Direct-lt-script-gt-Include).

### Dengan Alat Build

Ketika menggunakan alat _build_ seperti Webpack atau Browserify, mode produksi akan ditentukan oleh `process.env.NODE_ENV` di dalam kode sumber Vue, dan itu akan berada dalam mode pengembangan secara standar. Kedua alat _build_ tersebut menyediakan cara untuk menimpa variabel ini untuk mengaktifkan mode produksi Vue, dan peringatan akan dihapus oleh _minifiers_ selama _build_. Semua templat `vue-cli` memiliki pra-konfigurasi ini untuk Anda, tetapi akan bermanfaat jika mengetahui cara melakukannya:

#### Webpack

Di Webpack 4+, Anda dapat menggunakan opsi `mode`:

```js
module.exports = {
  mode: "production"
}
```

Tetapi di Webpack 3 dan sebelumnya, Anda harus menggunakan [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js
var webpack = require("webpack")

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
}
```

#### Browserify

- Jalankan perintah _bundling_ Anda dengan variabel lingkungan `NODE_ENV` aktual yang disetel ke `"production"`. Ini memberitahu `vueify` untuk menghindari hot-reload dan pengembangan kode terkait.

- Terapkan transformasi global [envify](https://github.com/hughsk/envify) ke bundel Anda. Ini memungkinkan minifier untuk menghapus semua peringatan dalam kode sumber Vue yang dibungkus dengan blok bersyarat variabel env. Sebagai contoh:

  ```bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- Atau, menggunakan [envify](https://github.com/hughsk/envify) dengan Gulp:

  ```js
  // Gunakan modul envify/custom untuk menentukan variabel lingkungan
  var envify = require("envify/custom")

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Diperlukan untuk memproses file node_modules
      { global: true },
      envify({ NODE_ENV: "production" })
    )
    .bundle()
  ```

- Atau, menggunakan [envify](https://github.com/hughsk/envify) dengan Grunt dan [grunt-browserify](https://github.com/jmreidy/grunt-browserify):

  ```js
  // Gunakan modul envify/custom untuk menentukan variabel lingkungan
  var envify = require("envify/custom")

  browserify: {
    dist: {
      options: {
        // Berfungsi untuk menyimpang dari urutan standar grunt-browserify
        configure: b =>
          b
            .transform("vueify")
            .transform(
              // Diperlukan untuk memproses file node_modules
              { global: true },
              envify({ NODE_ENV: "production" })
            )
            .bundle()
      }
    }
  }
  ```

#### Rollup

Gunakan [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

```js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## Templat Pra-Kompilasi

Ketika menggunakan templat in-DOM atau string templat dalam JavaScript, kompilasi template-to-render-function dilakukan dengan cepat. Ini biasanya cukup cepat dalam banyak kasus, tetapi sebaiknya dihindari jika aplikasi Anda sensitif terhadap kinerja.

Cara termudah untuk melakukan pra-kompilasi templat menggunakan [Single-File Components](single-file-components.html) - setup _build_ yang terkait secara otomatis melakukan pra-kompilasi untuk Anda, sehingga kode yang dibangun berisi fungsi render yang sudah dikompilasi alih-alih string templat mentah.

Jika Anda menggunakan Webpack, dan lebih suka memisahkan file JavaScript dan templat, Anda dapat menggunakan [vue-template-loader](https://github.com/ktsn/vue-template-loader), yang juga mengubah file template menjadi fungsi render JavaScript selama _build_ berlangsung.

## Mengekstraksi Komponen CSS

Ketika menggunakan Komponen File Tunggal (Single-File Components), komponen di dalam CSS disuntikkan secara dinamis sebagai tag `<style>` melalui JavaScript. Ini memiliki biaya runtime yang kecil, dan jika Anda menggunakan rendering sisi-server, hal itu akan menyebabkan "flash of unstyled content" atau konten tanpa gaya. Mengekstrak CSS di semua komponen ke dalam file yang sama akan menghindari masalah ini, dan juga menghasilkan minifikasi dan caching CSS yang lebih baik.

Rujuk ke dokumentasi alat _build_ terkait untuk melihat bagaimana melakukannya:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (templat webpack `vue-cli` memiliki pra-konfigurasi ini)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## Melacak Kesalahan Runtime

Jika kesalahan runtime terjadi selama render komponen, ini akan diteruskan ke fungsi konfigurasi global `Vue.config.errorHandler` jika telah ditetapkan. Mungkin ide yang bagus untuk meningkatkan kaitan ini bersama dengan servis error-tracking seperti [Sentry](https://sentry.io), yang menyediakan [integrasi resmi](https://sentry.io/for/vue/) untuk Vue.
