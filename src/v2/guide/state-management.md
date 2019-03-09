---
title: Pengelolaan State
type: guide
order: 502
---

## Implementasi Flux-Like (Sejenis Flux) Resmi

Aplikasi besar bisa tumbuh menjadi sangat kompleks, dikarenakan banyak sekali bagian dari state yang tersebar ke seluruh komponen dan berinteraksi dengan mereka. Untuk mengatasi masalah ini, Vue menawarkan [vuex](https://github.com/vuejs/vuex): Sebuah pustaka yang berfungsi untuk mengelola state buatan kami sendiri. Ia bahkan mampu terintegrasi dengan [vue-devtools](https://github.com/vuejs/vue-devtools), dan juga kita tidak perlu mempersiapkan apa-apa (tidak perlu melakukan konfigurasi khusus) untuk bisa mengakses [time travel debugging](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/mastering-vuex/intro-to-vuex/" target="_blank" rel="noopener" title="Vuex Tutorial">Tonton video penjelasannya di Vue Mastery</a></div>

### Informasi untuk Developer React

Jika Anda pernah menggunakan React, Anda mungkin ingin tahu perbandingan antara vuex dengan [redux](https://github.com/reactjs/redux), sebuah pustaka untuk implementasi Flux yang paling populer. Redux sebenarnya tidak tergantung pada suatu lapisan tampilan, jadi bisa digunakan bersama - sama dengan Vue secara mudah melalui [simple bindings](https://yarnpkg.com/en/packages?q=redux%20vue&p=1). Vuex berbeda karena ia langsung terhubung dengan aplikasi Vue. Oleh karena itu, Vuex lebih cocok jika di integrasikan dengan Vue, dan juga Vuex menawarkan API yang lebih intuitif dan mampu meningkatkan pengalaman para pengembang.

## Pengelolaan State Sederhana dari Awal

Hal ini seringkali diabaikan bahwa sumber kebenaran di aplikasi Vue adalah objek `data` yang mentah - hanya *instance* Vue yang boleh mengaksesnya. Oleh karena itu, jika Anda memiliki beberapa state yang ingin di bagikan ke beberapa *instance*, Anda bisa membaginya dengan identitas:

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Sekarang saat `sourceOfTruth` dirubah, kedua `vmA` dan `vmB` akan mengubah tampilan mereka secara otomatis. Sub komponen dalam beberapa *instance* ini juga perlu mengaksesnya dengan cara menggunakan perintah `this.$root.$data`. Sekarang kita punya satu sourceOfTruth, namun melakukan debugging akan sangat sulit sekali. Setiap data bisa dirubah oleh setiap bagian dari aplikasi kita setiap waktunya, tanpa meninggalkan jejak.

Untuk memecahkan masalah ini, kita bisa menggunakan **pola penyimpanan**:

``` js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```

Perhatikan semua *action* yang mengubah *state* dari *store* diletakkan didalam *store* itu sendiri. Tipe pengelolaan state yang terpusat ini membuatnya semakin mudah untuk dimengerti bahwa tipe perubahan apa saja yang bisa terjadi dan bagaimana mereka dijalankan. Sekarang saat terjadi kesalahan, kita juga memiliki sebuah catatan kenapa bisa terjadi bug.

Sebagai tambahan, setiap *instance*/komponen tetap bisa memiliki dan mengelola state milik mereka sendiri:

``` js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![Pengelolaan State](/images/state.png)

<p class="tip">Sebagai catatan penting, Anda jangan pernah menggantikan state asli pada *action* yang Anda buat - komponen dan *store* perlu untuk berbagi data referensi kedalam objek yang sama supaya perubahan bisa diamati.</p>

Saat kita melanjutkan pengembangan, ketentuannya adalah komponen tidak boleh merubah *state* yang ada di dalam *store* secara langsung, tetapi kita harus mengirim sebuah *event* untuk memberitahu *store* bahwa dia harus menjalankan sebuah *action*, yang pada akhirnya kita akan merasakan proses seperti ini sama dengan dengan arsitektur milik [Flux](https://facebook.github.io/flux/). Keuntungan menggunakan aturan ini adalah kita bisa merekam semua perubahan *state* yang terjadi pada *store* dan bisa mengimplementasikan proses *debugging helpers* seperti catatan perubahan, *snapshot*, dan bisa melihat perubahan data secara historis/*time travel*.

Mari kembali lagi ke [vuex](https://github.com/vuejs/vuex), jadi jika Anda telah membaca panduan pengelolaan *state* sampai sejauh ini, mungkin sekarang saatnya mencoba!
