---
title: Menggunakan Axios untuk Mengkonsumsi API
type: cookbook
order: 9
---

## Contoh Dasar

Seringkali ketika membangun aplikasi untuk web, Anda mungkin ingin menggunakan dan menampilkan data dari sebuah API. Ada beberapa cara untuk melakukannya, namun pendekatan yang sangat populer adalah dengan menggunakan [axios](https://github.com/axios/axios), sebuah _HTTP client_ berbasis promise.

Dalam latihan ini, kita akan menggunakan [CoinDesk API](https://www.coindesk.com/api/) untuk menampilkan harga Bitcoin, yang diperbarui setiap menit. Pertama, kita akan pasang axios dengan npm/yarn atau melalui tautan CDN.

Kita dapat melakukan permintaan informasi dari API dengan beberapa cara, namun sebaiknya kita pahami dulu format data nya, agar kita mengetahui apa yang akan ditampilkan. Untuk melakukan nya, kita akan melakukan panggilan ke API dan menampilkannya sehingga kita dapat melihatnya. Kita dapat melihat pada dokumentasi CoinDesk API, panggilan ini akan dilakukan ke `https://api.coindesk.com/v1/bpi/currentprice.json`. Jadi, pertama, kita akan membuat sebuah properti data yang pada akhirnya akan menyimpan informasi kita, dan kita akan mengambil data dan menetapkannya menggunakan kait siklus hidup `mounted`:

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})
```

```html
<div id="app">
  {{ info }}
</div>
```

Dan kita mendapatkan seperti berikut:

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="First Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">First Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Luar biasa! Kita sudah mendapatkan beberapa data. Namun saat ini data tersebut terlihat berantakan, jadi mari kita tampilkan dengan benar dan kita tambahkan beberapa penanganan kesalahan/galat jika sesuatu tidak berjalan sesuai yang diharapkan atau memerlukan waktu lebih lama dari yang kita pikirkan untuk mendapatkan informasi tersebut.

## Contoh Dunia Nyata: Bekerja dengan Data

### Menampilkan Data dari API

Pada umumnya informasi yang kita perlukan berada dalam respon, dan kita harus menelusuri apa yang baru saja kita simpan untuk dapat mengaksesnya dengan benar. Dalam kasus kita, kita dapat melihat bahwa informasi harga yang kita perlukan ada di `response.data.bpi`. Jika kita menggunakan ini, kita menampilkan sebagai berikut:

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Second Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Second Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Ini jauh lebih mudah bagi kita untuk menampilkannya, jadi sekarang kita dapat melakukan pembaruan HTML kita agar hanya menampilkan informasi yang kita butuhkan dari data yang kita terima, dan kita akan membuat [filter](../api/#Vue-filter) untuk memastikan bahwa nilai desimal juga tepat.

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>
  <div
    v-for="currency in info"
    class="currency"
  >
    {{ currency.description }}:
    <span class="lighten">
      <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
    </span>
  </div>
</div>
```

```js
filters: {
  currencydecimal (value) {
    return value.toFixed(2)
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Third Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Third Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Berurusan dengan Kesalahan

Terkadang kita mungkin tidak mendapatkan data yang kita inginkan dari API. Ada beberapa alasan mengapa panggilan menggunakan axios gagal, termasuk namun tidak terbatas pada:

* API tidak berfungsi.
* Permintaan dibuat dengan tidak benar.
* API tidak memberikan kita informasi dengan format yang kita antisipasi.

Ketika membuat permintaan, kita harus memeriksa kondisi seperti itu, dan memberi diri kita informasi pada setiap kasus sehingga kita tahu cara menangani masalah tersebut. Dalam panggilan axios, kita akan melakukannya dengan `catch`.

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

Ini akan memberi tahu kita jika sesuatu gagal selama permintaan API, namun bagaimana jika datanya rusak atau API tidak berfungsi? Sekarang pengguna tidak akan melihat apa-apa. Kita mungkin ingin membuat _loader_ untuk kasus ini, kemudian memberi tahu pengguna bahwa kita tidak dapat mendapatkan data sama sekali.

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null,
      loading: true,
      errored: false
    }
  },
  filters: {
    currencydecimal (value) {
      return value.toFixed(2)
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
})
```

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>

  <section v-if="errored">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>

  <section v-else>
    <div v-if="loading">Loading...</div>

    <div
      v-else
      v-for="currency in info"
      class="currency"
    >
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

Anda dapat menekan tombol _re-run_ pada _pen_ ini untuk melihat status memuat secara singkat sambil kita mengumpulkan data dari API.

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Fourth Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Fourth Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Ini bahkan dapat lebih ditingkatkan dengan penggunaan komponen untuk bagian-bagian yang berbeda dan pelaporan kesalahan yang lebih jelas, tergantung pada API yang Anda gunakan dan kompleksitas aplikasi Anda.

## Pola Alternatif

### Fetch API

[Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) adalah API _native_ yang bagus untuk jenis permintaan ini. Anda mungkin pernah mendengar bahwa salah satu keuntungan dari Fetch API adalah Anda tidak perlu memuat sumber daya luar untuk menggunakannya, dan itu benar! Tetapi... Fetch API belum di dukung secara penuh, jadi Anda tetap akan perlu menggunakan polyfill. Ada beberapa _gotcha_ saat bekerja dengan API ini, itulah sebabnya banyak orang lebih suka menggunakan axios untuk saat ini. Namun hal ini sangat mungkin untuk berubah di masa depan.

Jika anda tertarik menggunakan Fetch API, ada beberapa [artikel bagus](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api) yang menjelaskan cara menggunakannya.

## Ringkasan

Ada banyak cara untuk bekerja dengan Vue dan axios selain mengkonsumsi dan menampilkan API. Anda juga dapat berkomunikasi dengan _Serverless Functions_, memposting/mengedit/menghapus dari API dimana Anda memiliki hak akses tulis, dan masih banyak lagi manfaatnya. Karena integrasi yang mudah dari kedua pustaka ini, menjadikannya pilihan yang sangat umum bagi pengembang yang memerlukan integrasi _HTTP clients_ ke dalam alur kerja mereka.
