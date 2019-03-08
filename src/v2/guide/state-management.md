---
title: Pengelolaan State
type: guide
order: 502
---

## Implementasi Seperti Flux Resmi

Aplikasi besar bisa tumbuh menjadi sangat kompleks, dikarnakan banyak sekali bagian dari state yang tersebar ke components dan berinteraksi dengan mereka. Untuk mengatasi masalah ini, Vue menawarkan [vuex](https://github.com/vuejs/vuex): Library pengelolaan state milik kami sendiri. Ia bahkan terintegrasi ke [vue-devtools](https://github.com/vuejs/vue-devtools), dan juga tidak perlu mempersiapkan apa-apa untuk mengakses [time travel debugging](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/mastering-vuex/intro-to-vuex/" target="_blank" rel="noopener" title="Vuex Tutorial">Lihatlah sebuah video yang menjelaskan tentang Vue Mastery</a></div>

### Informasi untuk Developer React

Jika kamu pernah menggunakan React, kamu mungkin ingin tahu perbandingan vuex dan [redux](https://github.com/reactjs/redux), Libary untuk implementasi Flux yang paling populer. Redux sebenarnya hanya sebatas lapisan tampilan saja, jadi bisa digunakan bersama Vue dengan mudah dengan cara via [simple bindings](https://yarnpkg.com/en/packages?q=redux%20vue&p=1). Vuex berbeda karna ia langsung terhubung dengan Aplikasi milik Vue. Jadi karna ini ia terintegrasi lebih baik dengan Vue, dan juga Vuex menawarkan API yang lebih intuitif dan meningkatkan pengalaman pengembangan.

## Pengelolaan State dari Awal Dengan Mudah

Sering diabaikan bahwa sumber kebenaran di aplikasi Vue adalah `data` objek yang mentah - sebuah instance Vue hanya wakil untuk mengakasesnya. Karna itu, jika kamu memiliki bagian state yang ingin di bagikan pada beberapa instance, kamu bisa membaginya dengan identitas:

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Sekarang saat `Sumber Kebenaran` dirubah, kedua `vmA` dan `vmB` akan merubah tampilan mereka secara otomatis. Subcomponents dalam beberapa instance ini juga perlu mengaksesnya dengan `this.$root.$data`. Sekarang kita punya satu sumber kebenaran, namun melakukan debugging akan sangat sulit sekali. Setiap bagian dari data bisa berubah dengan setiap bagian dari aplikasi kita setiap waktunya, tanpa meninggalkan bekas.

Untuk membantu memecahkan masalah ini, kita bisa mengambil **pola penyimpanan**:

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

Perhatikan semua action yang merubah state dari store diletakkan didalam store itu sendiri. Tipe pengelolaan state yang terpusat ini membuat semakin mudah untuk mengerti bahwa tipe perubahan apa yang bisa terjadi dan bagaimana mereka dijalankan. Sekarang saat terjadi kesalahan, kita juga memiliki sebuah catatan kenapa bisa terjadi bug.

Sebagai tambahan, setiap instance/component tetap bisa memiliki dan mengelola state milik mereka sendiri:

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

<p class="tip">Sangat penting untuk mencatat bahwa kamu jangan pernah menggantikan state sebenarnya pada action mu - component dan store harus berbagi acuan objek yang sama supaya perubahan bisa diamati.</p>

Saat kita melanjutkan pengembangan ketentuannya dimana component tidak boleh merubah state yang dimiliki oleh store secara langsung, tapi sebagai gantinya kita harus mengirim event untuk memberitahu store untuk menjalankan action, akhirnya kami bertemu dengan [Flux](https://facebook.github.io/flux/) arsiktektur. Keuntungan menggunakan ketentuan ini adalah kita bisa merekam semua perubahan state yang terjadi pada store dan sudah terimplement alat debugging seperti catatan perubahan, snapshot/potretan, dan bisa melakukan pengulangan sejarah/perjalanan waktu

Ini membawa kita kembali ke [vuex](https://github.com/vuejs/vuex), jadi jika kamu telah membacanya sejauh ini mungkin saatnya mencobanya!
