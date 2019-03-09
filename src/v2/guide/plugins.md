---
title: Plugin
type: guide
order: 304
---

Biasanya plugin menambahkan kefungsionalan level-global ke dalam Vue. Tidak ada ruang lingkup yang didefinisikan secara ketat untuk sebuah plugin - Ada beberapa tipe plugin:

1. Menambahkan beberapa metode global atau properti. Sebagai contoh [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. Menambahkan satu atau lebih aset global: direktif/filter/transisi dan lain-lain. Sebagai contoh [vue-touch](https://github.com/vuejs/vue-touch)

3. Menambahkan beberapa opsi komponen oleh *mixin* global. Sebagai contoh [vue-router](https://github.com/vuejs/vue-router)

4. Menambahkan beberapa metode *instance* Vue dengan melampirkannya ke dalam Vue.prototype.

5. Pustaka yang menyediakan API dari dirinya sendiri, dalam waktu yang sama menginjeksi beberapa kombinasi di atas. Sebagai contoh [vue-router](https://github.com/vuejs/vue-router)

## Menggunakan Plugin

Menggunakan plugin dengan memanggil metode global `Vue.use()`. Ini harus dilakukan sebelum Anda memulai aplikasi Anda dengan memanggil `new Vue()`:

``` js
// memanggil `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  //... pilihan
})
```

Secara Opsional, Anda bisa mengoper beberapa opsi:

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` secara otomatis mencegah Anda dari menggunakan plugin yang sama lebih dari satu kali, jadi memanggil plugin yang sama beberapa kali hanya akan menginstal plugin satu kali.

Beberapa plugin disediakan oleh plugin Vue.js resmi seperti `vue-router` secara otomatis memanggil `Vue.use()` jika `Vue` tersedia sebagai variabel global. Bagaimanapun dalam linkungan modul seperti CommonJS, Anda selalu butuh memanggil `Vue.use()` secara eksplisit:

``` js
// Ketika menggunakan CommonJS via Browserify atau Webpack
var Vue = require('vue')
var VueRouter = require('vue-router')

// Jangan lupa untuk memanggil fungsi ini
Vue.use(VueRouter)
```

Cek [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) untuk koleksi yang banyak dari kontribusi plugin dan pustaka komunitas.

## Menulis Plugin

Plugin Vue.js harus membuka metode `install`. Metode akan dipanggil dengan konstruktor `Vue` sebagai argumen pertama, bersama dengan opsi yang memungkinkan:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. tambahkan metode global atau properti
  Vue.myGlobalMethod = function () {
    // logika ...
  }

  // 2. tambahkan aset global
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // logika ...
    }
    ...
  })

  // 3. injeksi beberapa opsi komponen
  Vue.mixin({
    created: function () {
      // logika ...
    }
    ...
  })

  // 4. tambahkan metode instance
  Vue.prototype.$myMethod = function (methodOptions) {
    // logika ...
  }
}
```
