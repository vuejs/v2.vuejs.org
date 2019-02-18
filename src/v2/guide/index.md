---
title: Pengantar
type: guide
order: 2
---

## Apa itu Vue.js?

Vue (diucapkan /vjuː/, seperti **view**) adalah sebuah **framework progressive** untuk membangun antar muka pengguna. Tidak seperti framework monolitik, Vue didesain untuk bisa diadopsi secara bertahap. Untuk Library utama fokus hanya pada layer view, dan mudah untuk mengambil dan mengintegrasikannya dengan library lain atau proyek yang sudah ada. Di sisi lain, Vue juga memiliki kapabilitas yang hebat dan mumpuni untuk menerapkan Aplikasi Single-Page (SPA) saat dikombinasikan dengan [peralatan modern](single-file-components.html) dan [library pendukung](https://github.com/vuejs/awesome-vue#components--libraries).

Jika Anda tertarik mempelajari sebelum terjun untuk mendalaminya, kami telah <a id="modal-player"  href="#">membuat video</a> yang akan memandu menggunakan prinsip dasar beserta contoh proyek.

jika Anda adalah seorang frontend developer berpengalaman dan ingin tau bagaimana perbandingan Vue dengan library/framework lainnya. Silahkan lihat di [Perbandingan dengan Framework lainnya](comparison.html).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Free Vue.js Course">Lihat sebuah video pelatihan secara gratis di Vue Mastery</a></div>

## Mulai

<p class="tip">Panduan resmi ini dibuat dengan asumsi bahwa Anda mempunyai pengetahuan dasar tentang HML, CSS, Javascript. Jika Anda benar-benar baru di dunia frontend, ini mungkin bukan ide yang bagus untuk langsung terjun ke framework sebagai langkah awal. Silahkan pahami dasar itu dahulu! Berpengalaman dengan framework lain mungkin cukup membantu, namun tidak diharuskan.</p>

Cara paling mudah untuk mencoba Vue.js adalah melalui [contoh di JSFiddle Hello World](https://jsfiddle.net/chrisvfritz/50wL7mdz/). Kalian bebas untuk membukanya di tab lainnya dan mengikuti apa yang kami contohkan di contoh dasar. Atau Anda bisa <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer">membuat sebuah <code>index.html</code> berkas</a> dan memasukkan Vue dengan:

```html
<!-- versi pengembangan, berisi peringatan-peringatan yang kan ditampilkan di konsol -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

or:

```html
<!-- versi produksi, dioptimasi untuk ukuran dan kecepatan -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Di halaman [Instalasi](installation.html) dijelaskan lebih lanjut terkait pilihan untuk Instalasi Vue. Catatan: Kita **tidak** merekomendasikan pemula untuk menggunakan `vue-cli`, terutama jika Anda belum cukup familiar dengan build tools berbasis Node.js

Jika Anda mengutamakan lebih interaktif, Anda juga bisa cek [di seri tutorial di Scrimba](https://scrimba.com/playlist/pXKqta), yang akan memberikan Anda sebuah himpunan dari screencast dan kode playground yang bisa Anda jeda dan mainkan kapanpun.

## Perenderan Deklaratif

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank" rel="noopener noreferrer">Coba pelajaran ini di Scrimba</a></div>

Inti dari Vue.js adalah sebuah sistem yang memungkinkan kita untuk menampilkan data secara deklaratif ke DOM menggunakan templat sintaks dengan mudah:

```html
<div id="app">
  {{ message }}
</div>
```

```js
var app = new Vue({
  el: "#app",
  data: {
    message: "Halo Vue!"
  }
});
```

{% raw %}

<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Halo Vue!'
  }
})
</script>
{% endraw %}

Kita telah membuat aplikasi Vue pertama kita! Ini terlihat sangat mirip dengan rendering template string, tetapi Vue telah melakukan banyak pekerjaan di balik layar. Data dan DOM sekarang ditautkan, dan semuanya sekarang **reaktif** .
Bagaimana kita bisa tahu? Buka konsol JavaScript browser kita (sekarang, di halaman ini) dan ubah `app.message` ke nilai yang berbeda. Kalian harus melihat contoh yang diberikan di atas sesuai pembaruan.

Selain interpolasi teks, kita juga dapat mengikat atribut elemen seperti ini:

```html
<div id="app-2">
  <span v-bind:title="message">
    Arahkan kursor Anda kesini selama beberapa detik untuk melihat judul secara
    dinamis!
  </span>
</div>
```

```js
var app2 = new Vue({
  el: "#app-2",
  data: {
    message: "Kamu memuat halaman ini pada " + new Date().toLocaleString()
  }
});
```

{% raw %}

<div id="app-2" class="demo">
  <span v-bind:title="message">
    Arahkan kursor Anda kesini selama beberapa detik untuk melihat judul secara dinamis!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Kamu memuat halaman ini pada ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Di sini kita menemukan sesuatu yang baru. The `v-bind` atribut yang Anda lihat disebut **direktif** . Direktif diawali dengan `v-` untuk menunjukkan bahwa mereka adalah atribut khusus yang disediakan oleh Vue, dan seperti yang Anda duga, mereka menerapkan perilaku reaktif khusus untuk DOM yang diberikan. Di sini, ini pada dasarnya mengatakan "perbolehkan elemen atribut `title` up-to-date dengan `message` properti pada instance Vue."

Jika Anda membuka konsol JavaScript Anda lagi dan masuk `app2.message = 'some new message'` , Anda akan sekali lagi melihat bahwa HTML yang terikat - dalam hal ini `title` atribut - telah diperbarui.

## Kondisi dan Perulangan

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank" rel="noopener noreferrer">Coba pelajaran ini di Scrimba</a></div>

Sangat mudah untuk mengubah kehadiran elemen, juga:

```html
<div id="app-3">
  <span v-if="seen">Sekarang kamu melihat ini</span>
</div>
```

```js
var app3 = new Vue({
  el: "#app-3",
  data: {
    seen: true
  }
});
```

{% raw %}

<div id="app-3" class="demo">
  <span v-if="seen">Sekarang kamu melihat ini</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Silakan masuk `app3.seen = false` di konsol. Anda seharusnya akan melihat pesannya hilang.

Contoh ini menunjukkan bahwa kita dapat mengikat data tidak hanya teks dan atribut, tetapi juga **struktur** DOM. Selain itu, Vue juga menyediakan sistem efek transisi yang kuat yang dapat secara otomatis menerapkan [efek transisi](transitions.html) ketika elemen dimasukkan/diperbarui/dihapus oleh Vue.

Ada beberapa direktif lain, yang masing-masing memiliki fungsi masing-masing. Misalnya, `v-for` yang dapat digunakan untuk menampilkan daftar item menggunakan data dari Array:

```html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```

```js
var app4 = new Vue({
  el: "#app-4",
  data: {
    todos: [
      { text: "Belajar JavaScript" },
      { text: "Belajar Vue" },
      { text: "Membangun sesuatu yang menakjubkan" }
    ]
  }
});
```

{% raw %}

<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Belajar JavaScript' },
      { text: 'Belajar Vue' },
      { text: 'Membangun sesuatu yang menakjubkan' }
    ]
  }
})
</script>
{% endraw %}

Di konsol, masukkan `app4.todos.push({ text: 'New item' })`. Anda akan melihat item baru ditambahkan ke daftar.

## Menangani Masukan Pengguna

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Coba pelajaran ini di Scrimba</a></div>

Untuk memungkinkan pengguna berinteraksi dengan aplikasi, kita bisa menggunakan `v-on` untuk melampirkan pendengar acara yang memanggil metode pada instance Vue kita:

```html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Kembalikan Pesan</button>
</div>
```

```js
var app5 = new Vue({
  el: "#app-5",
  data: {
    message: "Halo Vue.js!"
  },
  methods: {
    reverseMessage: function() {
      this.message = this.message
        .split("")
        .reverse()
        .join("");
    }
  }
});
```

{% raw %}

<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Kembalikan Pesan</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Halo Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Perhatikan bahwa dalam metode ini kami memperbarui keadaan aplikasi tanpa menyentuh DOM - semua manipulasi DOM ditangani oleh Vue, dan kode yang Anda tulis difokuskan pada logika yang mendasarinya.

Vue juga memberikan `v-model` yang membuat pengikatan dua arah antara input formulir dan status aplikasi menjadi mudah:

```html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message" />
</div>
```

```js
var app6 = new Vue({
  el: "#app-6",
  data: {
    message: "Halo Vue!"
  }
});
```

{% raw %}

<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Halo Vue!'
  }
})
</script>
{% endraw %}

## Menulis dengan Komponen

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Coba pelajaran ini di Scrimba</a></div>

Sistem komponen adalah konsep penting lainnya dalam Vue, karena ini adalah abstraksi yang memungkinkan kita untuk membangun aplikasi skala besar yang terdiri dari komponen kecil, berdiri sendiri, dan dapat digunakan ulang. Jika dipikir-pikir, hampir semua jenis antarmuka aplikasi dapat diabstraksi menjadi sekumpulan komponen:

![Sekumpulan Komponen](/images/components.png)

Dalam Vue, komponen pada dasarnya adalah instance Vue dengan opsi yang ditentukan sebelumnya. Untuk mendaftarkan komponen di Vue sangatlah mudah:

```js
// Definisikan sebuah komponen baru yang disebut todo-item
Vue.component("todo-item", {
  template: "<li>Ini adalah todo</li>"
});
```

sekarang kamu bisa menggunakannya di templat komponen lainnya:

```html
<ol>
  <!-- Buat sebuah instance dari komponen todo-item -->
  <todo-item></todo-item>
</ol>
```

Tapi ini akan membuat teks yang sama untuk setiap langkah, yang tidak super menarik. Kita harus dapat meneruskan data dari lingkup induk ke komponen turunan. Mari kita modifikasi definisi komponen untuk membuatnya menerima sebuah [prop](components.html#Props):

```js
Vue.component("todo-item", {
  // komponen todo-item sekarang menerima sebuah
  // "prop", yang seperti modifikasi atribut.
  // prop ini disebut sebagai todo.
  props: ["todo"],
  template: "<li>{{ todo.text }}</li>"
});
```

Sekarang kita dapat meluluskan todo ke setiap komponen berulang menggunakan `v-bind`:

```html
<div id="app-7">
  <ol>
    <!--
      Sekarang kita menyediakan setiap todo-item dengan objek
      todo yang diwakilinya, sehingga kontennya bisa dinamis.
      Kita juga perlu menyediakan setiap komponen dengan "kunci",
      yang akan dijelaskan setelah ini.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

```js
Vue.component("todo-item", {
  props: ["todo"],
  template: "<li>{{ todo.text }}</li>"
});

var app7 = new Vue({
  el: "#app-7",
  data: {
    groceryList: [
      { id: 0, text: "Sayuran" },
      { id: 1, text: "Keju" },
      { id: 2, text: "Apapun yang bisa dimakan manusia" }
    ]
  }
});
```

{% raw %}

<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Sayuran' },
      { id: 1, text: 'Keju' },
      { id: 2, text: 'Apapun yang bisa dimakan manusia' }
    ]
  }
})
</script>
{% endraw %}

Ini adalah contoh yang dibuat-buat, tetapi kita telah berhasil memisahkan aplikasi kita menjadi dua unit yang lebih kecil, dan anak tersebut dipisahkan dengan baik dari induk melalui antarmuka alat peraga. Kita sekarang dapat lebih jauh meningkatkan `<todo-item>` komponen kami dengan templat dan logika yang lebih kompleks tanpa memengaruhi aplikasi induk.

Dalam aplikasi besar, perlu untuk membagi seluruh aplikasi menjadi komponen agar pengembangan dapat dikelola. Kami akan berbicara lebih banyak tentang komponen [nanti dalam panduan ini](components.html), tetapi berikut ini adalah contoh (imajiner) tentang bagaimana templat aplikasi mungkin terlihat dengan komponen:

```html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Hubungan dengan Elemen Kustom

Anda mungkin telah memperhatikan bahwa komponen Vue sangatlah mirip dengan **Elemen Kustom**, yang merupakan bagian dari [Spesifikasi Komponen Web](https://www.w3.org/wiki/WebComponents/). Itu karena sintaks komponen Vue secara longgar dimodelkan setelah spesifikasi. Misalnya, komponen Vue menerapkan [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) dan `is` atribut khusus. Namun, ada beberapa perbedaan utama:

1. Spesifikasi Komponen Web telah diselesaikan, tetapi belum semua browser mendukungnya. Safari 10.1+, Chrome 54+ dan Firefox 63+ adalah contoh browser yang sudah mendukung komponen web. Sebagai perbandingan, komponen Vue tidak memerlukan polyfill dan bekerja secara konsisten di semua browser yang didukung (IE9 ke atas). Saat dibutuhkan, komponen Vue juga dapat dibungkus di dalam elemen kustom.

2. Komponen Vue menyediakan fitur-fitur penting yang tidak tersedia dalam elemen kustom biasa, terutama aliran data lintas komponen, komunikasi acara khusus, dan integrasi alat bangun.

## Lagi?

Kami telah memperkenalkan secara singkat fitur-fitur paling mendasar dari inti Vue.js - selanjutnya kami akan membahas lebih jauh tentang fitur-fitur canggih lainnya dengan detail yang jauh lebih baik, jadi pastikan untuk membaca semuanya!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Video oleh <a href="https://www.vuemastery.com" target="_blank" rel="noopener" title="Pelatihan Vue.js di Vue Mastery">Vue Mastery</a>. Lihat Vue Mastery secara gratis <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Pelatihan Vue.js di Vue Mastery">Pengenalan ke pelatihan Vue</a>.</div>
