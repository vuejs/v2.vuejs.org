---
title: Perkenalan
type: guide
order: 2
---

## Apa itu Vue.js?

Vue (cara pengucapannya /vjuː/, seperti **view**) adalah sebuah kerangka kerja nan progresif untuk membangun antarmuka pengguna. Tidak seperti beberapa kerangka kerja monolitik yang lain, Vue dirancang dari dasar sekali agar dapat diadopsi secara bertahap. Pustaka intinya difokuskan pada layer tampilan saja, dan sangat mudah untuk diintegrasikan dengan pustaka yang lain atau dengan proyek yang sudah ada. Di sisi lain, Vue sangat mampu memberikan dan mendukung `Single Page Application` yang canggih ketika dikombinasikan dengan [perkakas modern](single-file-components.html) dan [dukungan pustaka](https://github.com/vuejs/awesome-vue#components--libraries).

Jika anda ingin mempelajari lebih lanjut tentang Vue, kami <a id="modal-player"  href="#">membuat sebuah video</a> tentang prinsip - prinsip inti dan contoh proyek.


Jika anda adalah seorang *frontend developer* yang berpengalaman dan ingin tahu bagaimana Vue dibandingkan dengan pustaka/kerangka kerja yang lain, silakan kunjungi [Perbandingan dengan kerangka kerja yang lain](comparison.html).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Free Vue.js Course">Tonton video kursus gratis di Vue Mastery</a></div>

## Memulai

<p class="tip">Panduan resmi ini mengasumsikan bahwa pengetahuan Anda berada di tingkat menengah tentang HTML, CSS, dan Javascript. Jika anda benar - benar baru di pengembangan aplikasi frontend, ini mungkin bukan keputusan yang tepat untuk langsung mencoba kerangka kerja sebagai langkah pertama anda. Pelajari terlebih dahulu dasar - dasar nya, kemudian kembali kesini!! Pengalaman menggunakan kerangka kerja yang lain sangat membantu, tapi bukan sebuah kewajiban.</p>

Cara yang paling mudah untuk mencoba Vue.js adalah dengan menggunakan [JSFiddle Contoh Hello World](https://jsfiddle.net/chrisvfritz/50wL7mdz/). Jangan ragu untuk mencobanya di tab lain dan ikuti bagaimana kami memberikan contoh dasar. Atau, anda bisa <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer">membuat sebuah file<code>index.html</code></a> dan isikan script dibawah ini:

``` html
<!-- versi development, berisi peringatan yang sangat membantu -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

atau:

``` html
<!-- versi production, ukuran lebih optimal dan kecepatan yang telah ditingkatkan -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Pada halaman [Instalasi](installation.html) tersedia lebih banyak opsi ketika memulai instalasi Vue. Catatan: Kami **tidak** menyarankan para pemula untuk memulai proyek dengan menggunakan `vue-cli`, terlebih lagi jika anda masih belum terbiasa / familiar dengan *build tools* yang berbasiskan Node.js.

Jika anda lebih tertarik dengan hal hal yang lebih interaktif, anda bisa melihat [seri tutorial ini di Scrimba](https://scrimba.com/playlist/pXKqta), yang mana akan memberikan anda campuran beberapa screencast dan `code playground` yang bisa anda jeda dan mainkan kapan saja.

## *Render Secara Deklaratif*

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank" rel="noopener noreferrer">Coba tutorial ini di Scrimba</a></div>

Inti dari Vue.js adalah sistem yang mampu membantu kita dalam me *render* data kedalam DOM secara deklaratif menggunakan sintaks *template* yang mudah dan jelas:

``` html
<div id="app">
  {{ pesan }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    pesan: 'Hai, ini Vue!'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ pesan }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    pesan: 'Hai, ini Vue!'
  }
})
</script>
{% endraw %}

Kita telah berhasil membuat aplikasi Vue pertama kita! Jika kita perhatikan proses *rendering* nya masih sama seperti *string template* yang biasa, tetapi Vue disini sudah membantu banyak pekerjaan kita secara ajaib. Data yang ditampilkan sudah terhubung dengan DOM, dan semuanya bersifat reaktif. Bagaimana kita bisa tahu hal tersebut? Silakan buka JavaScript konsol pada peramban anda (di halaman yang anda baca sekarang ini) dan *set* `app.pesan` dengan nilai yang berbeda. Anda akan langsung melihat perubahan pesan yang baru saja Anda ketikkan/ubah.

Selain interpolasi teks, kita juga bisa langsung *binding* attribute pada elemen seperti dibawah ini:

``` html
<div id="app-2">
  <span v-bind:title="pesan">
    Arahkan mouse Anda kesini dan tunggu dalam beberapa detik
    untuk melihat judul pesan yang dinamis
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    pesan: 'Anda memuat halaman ini pada jam ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="pesan">
    Arahkan mouse Anda kesini dan tunggu dalam beberapa detik untuk melihat judul pesan yang dinamis
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    pesan: 'Anda memuat halaman ini pada jam ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Sekarang kita telah mempelajari hal baru. Atribut `v-bind` yang telah Anda lihat dinamakan **directive**. **Directive** diawali dengan huruf `v-` untuk mengindikasikan/menginformasikan bahwa dia adalah atribut spesial yang dibawa oleh Vue, dan seperti yang bisa anda tebak, dia menerapkan perilaku yang reaktif di DOM yang sudah dirender. Ibarat kata, "Jaga atribut `title` ini agar tetap *update* dengan properti `pesan`".

Jika Anda buka JavaScript konsol lagi dan tekan enter `app2.pesan = 'ini adalah pesan baru'`, maka Anda akan melihat atribute `title` telah terupdate dengan pesan baru tersebut.

## Kondisi dan Perulangan

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank" rel="noopener noreferrer">Pelajari ini di Scrimba</a></div>

Sangat mudah untuk menerapkan pengkondisian pada suatu elemen:


``` html
<div id="app-3">
  <span v-if="terlihat">Saya bisa dilihat</span>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    terlihat: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="terlihat">Saya bisa dilihat</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    terlihat: true
  }
})
</script>
{% endraw %}

Cobalah buka konsol di peramban Anda sekali lagi, dan ketikkan `app3.terlihat = false` kemudian tekan enter. Maka pesan yang tadi akan hilang

Contoh ini mendemonstrasikan kepada kita bahwa tidak hanya teks dan atribut yang bisa kita *binding*, tetapi juga struktur dari DOM. Bahkan, Vue juga mampu menyediakan transisi yang keren pada sistem efek yang secara otomatis bisa dipakai di [efek transisi](transitions.html) ketika elemen ditambahkan/diperbaharui/dihapus oleh Vue.

Selain itu juga terdapat *directive* yang lain, masing - masing memiliki fungsi yang spesial. Contohnya seperti, *directive* `v-for` bisa digunakan untuk menampilkan daftar *item* yang didapatkan dari data *Array*:

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.teks }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { teks: 'Belajar JavaScript' },
      { teks: 'Belajar Vue' },
      { teks: 'Buat proyek keren' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.teks }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { teks: 'Belajar JavaScript' },
      { teks: 'Belajar Vue' },
      { teks: 'Buat proyek keren' }
    ]
  }
})
</script>
{% endraw %}

Di konsol, ketik dan enter `app4.todos.push({ text: 'Hasilkan uang' })`. Maka anda akan melihat *item* baru akan muncul dalam daftar.

## Menangani Inputan Pengguna

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Pelajari ini di Scrimba</a></div>

Untuk mencoba para pengguna berinteraksi dengan aplikasi Anda, kita bisa menggunakan *directive* `v-on` untuk melampirkan *event listener* yang bisa menjalankan suatu fungsi/metode pada *instance* Vue kita.

``` html
<div id="app-5">
  <p>{{ pesan }}</p>
  <button v-on:click="balikkanPesan">Balikkan Pesan</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    pesan: 'Hai Vue.js!'
  },
  methods: {
    balikkanPesan: function () {
      this.pesan = this.pesan.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ pesan }}</p>
  <button v-on:click="balikkanPesan">Balikkan Pesan</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    pesan: 'Hai Vue.js!'
  },
  methods: {
    balikkanPesan: function () {
      this.pesan = this.pesan.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Perlu diingat bahwa metode ini memperbaharui *state* di aplikasi kita tanpa menyentuh DOM sama sekali. Semua proses manipulasi DOM ditangani oleh Vue, dan kode yang Anda tulis hanya berfokus pada logika saja.

Vue juga menyediakan *directive* `v-model` yang mampu melakukan *binding* secara dua arah antara pengisian formulir dengan *state* pada aplikasi:

``` html
<div id="app-6">
  <p>{{ pesan }}</p>
  <input v-model="pesan">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    pesan: 'Hai Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ pesan }}</p>
  <input v-model="pesan">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    pesan: 'Hai Vue!'
  }
})
</script>
{% endraw %}

## Menyusun Komponen

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Pelajari ini di Scrimba</a></div>

Sistem komponen juga termasuk salah satu hal penting yang ada di konsep Vue, karena komponen tersebut adalah sebuah abstraksi yang memudahkan kita untuk membangun aplikasi skala besar dengan menyusun komponen menjadi bagian yang lebih kecil, mandiri, dan bisa digunakan kembali. Jika kita pikirkan lebih lanjut, hampir semua tipe aplikasi antarmuka bisa kita abstraksikan menjadi komponen diagram pohon:

![Komponen Diagram Pohon](/images/components.png)

In Vue, a component is essentially a Vue instance with pre-defined options. Registering a component in Vue is straightforward:
Di Vue, pada dasarnya komponen adalah *instance* Vue yang sudah dilengkapi dengan opsi yang telah di definisikan sebelumnya. Mendaftarkan sebuah komponen di Vue sangatlah mudah:

``` js
// Definisikan komponen baru yang bernama todo-item
Vue.component('todo-item', {
  template: '<li>Ini adalah hal hal yang harus dilakukan</li>'
})
```

Sekarang kita bisa pasang ke templat komponen yang lain:

``` html
<ol>
  <!-- Buat komponen todo-item -->
  <todo-item></todo-item>
</ol>
```

Tetapi ini hanya akan merender sebuah teks yang sama di setiap komponen todo, yang mana hal ini sama sekali tidak menarik. Kita harus bisa menyematkan data dari komponen *parent* ke komponen *child*. Mari kita coba modifikasi komponen tersebut agar bisa menerima [prop](components.html#Props):

``` js
Vue.component('todo-item', {
  // Komponen todo-item sekarang bisa menerima
  // "prop", yang mana ini adalah atribut kustom.
  // Prop ini kita namakan todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Sekarang kita bisa menyematkan todo di masing - masing komponen menggunakan `v-bind`:

``` html
<div id="app-7">
  <ol>
    <!--
      Sekarang kita sematkan masing - masing todo-item dengan todo obyek,
      sehingga isinya bisa menjadi dinamis.
      Kita juga perlu untuk menyematkan "key" di masing - masing komponen,
      yang mana akan dijelaskan lebih lanjut nantinya.
    -->
    <todo-item
      v-for="item in barangBelanjaan"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.barang }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    barangBelanjaan: [
      { id: 0, barang: 'Sayuran' },
      { id: 1, barang: 'Keju' },
      { id: 2, barang: 'Makanan yang lain' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in barangBelanjaan" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.barang }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    barangBelanjaan: [
      { id: 0, barang: 'Sayuran' },
      { id: 1, barang: 'Keju' },
      { id: 2, barang: 'Makanan yang lain' }
    ]
  }
})
</script>
{% endraw %}

Ini salah satu contoh untuk percobaan, tetapi kita coba untuk memisahkan aplikasi kita menjadi dua *unit* yang lebih kecil, dan komponen *child* dipisahkan dari *parent* melalui penghubung *props*. Sekarang kita bisa memperbaiki komponen `<todo-item>` kita menjadi templat yang lebih kompleks dan logika yang kita buat di *child* tidak mempengarahui komponen *parent*.

di Aplikasi yang berskala besar, sangat penting untuk membagi keseluruhan aspek aplikasi menjadi komponen mandiri agar proses developmen semakin mudah untuk di kelola. Kita akan banyak membahas tentang komponen [nanti di panduan](components.html). Berikut ini adalah salah satu contoh seperti apa bentuk suatu templat menggunakan komponen:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Relasi untuk Elemen Kustom

Anda pasti menyadari bahwa komponen pada Vue sangat mirip dengan **Elemen Kustom**, yang mana adalah bagian dari [Spesifikasi Web Components](https://www.w3.org/wiki/WebComponents/). Hal itu dikarenakan sintaks di komponen Vue sangatlah fleksibel. Sebagai contoh, komponen Vue mengimplementasikan [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) dan atribut spesial `is`. Tetapi bagaimanapun, terdapat perbedaan di beberapa sisi:

1. Spesifikasi dari *Web Components* sudah final, tetapi dia masih belum tersedia / bisa diimplementasikan di setiap peramban secara *native*. Safari 10.1+, Chrome 54+ dan Firefox 63+ sudah mendukung *Web Components* secara *native*. Jika dibandingkan, komponen pada Vue tidak membutuhkan *polyfill* apapun dan bekerja secara konsisten di semua peramban (IE9 keatas). Ketika dibutuhkan, komponen pada Vue juga bisa di bungkus kedalam *native* elemen kustom.

2. Komponen pada vue menyediakan fitur penting yang tidak tersedia di elemen kustom murni, terutama pada komponen lintas data, komunikasi *event* kustom dan integrasi *build tool*.

Meskipun Vue tidak menggunakan elemen khusus secara internal, Vue memiliki interopabilitas yang sangat baik dalam hal mengkonsumsi atau mendistribusikan elemen kustom. Vue CLI juga mendukung pengembangan Komponen Vue yang didaftarkan sebagai elemen kustom secara *native*.

## Siap untuk belajar lebih?

Kita telah memperkenalkan secara singkat fitur - fitur dasar yang ada di Vue.js - sisanya akan dipandu melalui dokumentasi ini dan fitur yang lebih lanjut akan dijelaskan secara rinci, jadi pastikan untuk membaca semuanya!!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Video by <a href="https://www.vuemastery.com" target="_blank" rel="noopener" title="Vue.js Courses on Vue Mastery">Vue Mastery</a>. Watch Vue Mastery’s free <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Vue.js Courses on Vue Mastery">Intro to Vue course</a>.</div>
