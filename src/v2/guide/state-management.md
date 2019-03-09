---
title: Pengelolaan State
type: guide
order: 502
---

## Implementasi Flux-Like (Sejenis Flux) Resmi

Aplikasi besar bisa tumbuh menjadi sangat kompleks, dikarnakan banyak sekali bagian dari state yang tersebar ke berbagai komponen dan berinteraksi dengan mereka. Untuk mengatasi masalah ini, Vue menawarkan [vuex](https://github.com/vuejs/vuex): Pustaka pengelolaan state milik mereka. Ia bahkan terintegrasi ke [vue-devtools](https://github.com/vuejs/vue-devtools), dan juga tidak perlu mempersiapkan apa-apa untuk mengakses [time travel debugging](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/mastering-vuex/intro-to-vuex/" target="_blank" rel="noopener" title="Vuex Tutorial">Tonton video penjelasan di Vue Mastery</a></div>

### Informasi untuk Developer React

Jika anda pernah menggunakan React, anda mungkin ingin tahu perbandingan vuex dan [redux](https://github.com/reactjs/redux), Pustaka untuk implementasi Flux yang paling populer. Redux sebenarnya tidak tergantung pada suatu lapisan tampilan, jadi bisa digunakan bersama Vue dengan mudah dengan cara [binding sederhana](https://yarnpkg.com/en/packages?q=redux%20vue&p=1). Vuex berbeda karna ia langsung terhubung dengan Aplikasi milik Vue. Jadi karna ini ia terintegrasi lebih baik dengan Vue, dan juga Vuex menawarkan API yang lebih intuitif dan sekaligus meningkatkan pengalaman dan kenyamanan pengembangan.

## Pengelolaan State Sederhana dari Awal

Sering diabaikan bahwa sourceOfTruth di aplikasi Vue adalah `data` objek yang mentah - sebuah instance Vue hanya wakil untuk mengakasesnya. Karna itu, jika anda memiliki bagian state yang ingin di bagikan pada beberapa instance, anda bisa membaginya dengan memberi identitas:

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Sekarang saat `sourceOfTruth` dirubah, kedua `vmA` dan `vmB` akan mengubah tampilan mereka secara otomatis. Subkomponen dalam beberapa instance ini juga perlu mengaksesnya dengan cara menggunakan perintah `this.$root.$data`. Sekarang kita punya satu sourceOfTruth, namun melakukan debugging akan sangat sulit sekali. Setiap data bisa dirubah oleh setiap bagian dari aplikasi kita setiap waktunya, tanpa meninggalkan jejak.

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

Perhatikan semua action yang mengubah state dari store diletakkan didalam store itu sendiri. Tipe pengelolaan state yang terpusat ini membuatnya semakin mudah untuk dimengerti bahwa tipe perubahan apa saja yang bisa terjadi dan bagaimana mereka dijalankan. Sekarang saat terjadi kesalahan, kita juga memiliki sebuah catatan kenapa bisa terjadi bug.

Sebagai tambahan, setiap instance/komponen tetap bisa memiliki dan mengelola state milik mereka sendiri:

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

<p class="tip">Sangat penting untuk diketahui bahwa anda jangan pernah menggantikan state sebenarnya pada action mu - komponen dan store harus berbagi acuan objek yang sama supaya perubahan bisa diamati.</p>

Saat kita melanjutkan pengembangan, ada ketentuan dimana komponen tidak boleh mengubah state yang dimiliki oleh store secara langsung, tapi sebagai gantinya kita harus mengirim event untuk memberitahu store untuk menjalankan action, akhirnya kami bertemu dengan [Flux](https://facebook.github.io/flux/) arsiktektur. Keuntungan menggunakan ketentuan ini adalah kita bisa merekam semua perubahan state yang terjadi pada store dan sudah terpasang alat debug seperti catatan perubahan, snapshot/potretan, dan bisa melakukan pengulangan sejarah/perjalanan waktu

Ini membawa kita kembali ke [vuex](https://github.com/vuejs/vuex), jadi jika anda telah membacanya sejauh ini mungkin saatnya mencobanya!
