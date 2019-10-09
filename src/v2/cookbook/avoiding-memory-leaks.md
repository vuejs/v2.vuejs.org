---
judul: Menghindari Kebocoran Memori
tipe: cookbook
urutan: 10
---

## Pengantar

Jika Anda mengembangkan aplikasi dengan Vue, maka Anda harus berhati-hati terhadap kebocoran memori. Masalah ini sangat penting dalam Aplikasi Halaman Tunggal (SPA) karena secara desain, pengguna tidak perlu me-refresh browser mereka ketika menggunakan SPA, jadi itu tergantung pada aplikasi JavaScript untuk membersihkan komponen dan memastikan bahwa pengumpulan sampah berlangsung sebagai diharapkan.

Kebocoran memori dalam aplikasi Vue biasanya tidak berasal dari Vue itu sendiri, melainkan dapat terjadi ketika menggabungkan pustaka lain ke dalam suatu aplikasi.

## Contoh Sederhana

Contoh berikut memperlihatkan kebocoran kehabisan memori yang disebabkan oleh penggunaan pustaka [Choices.js](https://github.com/jshjohnson/Choices) di komponen Vue dan tidak membersihkannya dengan benar. Nanti, kami akan menunjukkan cara menghapus jejak Choices.js dan menghindari kebocoran memori.

Pada contoh di bawah ini, kami memuatkan pilihan dengan banyak opsi dan kemudian kami menggunakan tombol show / hide dengan arahan [v-if](/v2/guide/conditional.html) untuk menambahkan dan menghapusnya dari DOM virtual. Masalah dengan contoh ini adalah bahwa arahan `v-if` menghapus elemen induk dari DOM, tetapi kami tidak membersihkan potongan DOM tambahan yang dibuat oleh Choices.js, yang menyebabkan kebocoran memori.

```html
<link rel='stylesheet prefetch' href='https://joshuajohnson.co.uk/Choices/assets/styles/css/choices.min.css?version=3.0.3'>
<script src='https://joshuajohnson.co.uk/Choices/assets/scripts/dist/choices.min.js?version=3.0.3'></script>

<div id="app">
  <button
    v-if="showChoices"
    @click="hide"
  >Hide</button>
  <button
    v-if="!showChoices"
    @click="show"
  >Show</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>
```

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      // lets load up our select with many choices
      // so it will use a lot of memory
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      this.showChoices = false
    }
  }
})
```
Untuk melihat kebocoran memori ini dalam aksi, buka [contoh CodePen](https://codepen.io/freeman-g/pen/qobpxo) menggunakan Chrome dan kemudian buka Chrome Task Manager. Untuk membuka Chrome Task Manager di Mac, pilih Chrome Top Navigation> Window> Task Manager atau di Windows, gunakan pintasan Shift + Esc. Sekarang, klik tombol show / hide 50 atau lebih kali. Anda akan melihat penggunaan memori dalam Chrome Task Manager meningkat dan tidak pernah direklamasi.

![Memory Leak Example](/images/memory-leak-example.png)

## Mengatasi Kebocoran Memori

Pada contoh di atas, kita dapat menggunakan metode `hide ()` untuk melakukan pembersihan dan menyelesaikan kebocoran memori sebelum menghapus pemilihan dari DOM. Untuk mencapai hal ini, kami akan menyimpan properti dalam objek data instance Vue kami dan kami akan menggunakan metode [Choices API](https://github.com/jshjohnson/Choices) `destroy ()` untuk melakukan pembersihan.

Periksa penggunaan memori lagi dengan [contoh CodePen yang diperbarui](https://codepen.io/freeman-g/pen/mxWMor).

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true,
      choicesSelect: null
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      // Set a reference to our choicesSelect in our Vue instance's data object
      this.choicesSelect = new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      // now we can use the reference to Choices to perform clean up here
      // prior to removing the elements from the DOM
      this.choicesSelect.destroy()
      this.showChoices = false
    }
  }
})
```

## Rincian tentang Nilai

Manajemen memori dan pengujian kinerja dapat dengan mudah diabaikan dalam kegembiraan pengiriman dengan cepat, namun, menjaga jejak memori yang kecil masih penting untuk keseluruhan pengalaman pengguna Anda.

Pertimbangkan jenis perangkat yang mungkin digunakan pengguna Anda dan seperti apa aliran normalnya. Bisakah mereka menggunakan laptop atau perangkat seluler yang dibatasi memori? Apakah pengguna Anda biasanya melakukan banyak navigasi dalam aplikasi? Jika salah satu dari ini benar, maka praktik manajemen memori yang baik dapat membantu Anda menghindari skenario terburuk yang menyebabkan browser pengguna rusak. Bahkan jika tidak satu pun dari ini benar, Anda masih dapat berpotensi mengalami penurunan kinerja karena penggunaan aplikasi yang diperpanjang jika Anda tidak berhati-hati.

## Contoh Dunia Nyata

Dalam contoh di atas, kami menggunakan arahan `v-if` untuk menggambarkan kebocoran memori, tetapi skenario dunia nyata yang lebih umum terjadi ketika menggunakan [vue-router](https://router.vuejs.org/en/) untuk merutekan ke komponen dalam Aplikasi Halaman Tunggal.

Seperti halnya arahan `v-if`,` vue-router` menghapus elemen dari DOM virtual dan menggantikannya dengan elemen baru saat pengguna menavigasi aplikasi Anda. Vue `beforeDestroy ()` [hook siklus hidup](/v2/guide/instance.html # Lifecycle-Diagram) adalah tempat yang baik untuk memecahkan masalah yang sama dalam aplikasi berbasis `vue-router`.

Kita dapat memindahkan pembersihan kita ke kait `beforeDestroy ()` seperti ini:

```js
beforeDestroy: function () {
    this.choicesSelect.destroy()
}
```

## Pola Alternatif

Kami telah membahas mengelola memori saat melepas elemen, tetapi bagaimana jika Anda dengan sengaja ingin mempertahankan status dan menyimpan elemen dalam memori? Dalam hal ini, Anda dapat menggunakan komponen bawaan [keep-hidup](/v2/api/#keep-hidup).

Ketika Anda membungkus komponen dengan `keep-hidup`, statusnya akan dipertahankan dan karenanya disimpan dalam memori.

```html
<button @click="show = false">Hide</button>
<keep-alive>
  <!-- my-component will be intentionally kept in memory even when removed -->
  <my-component v-if="show"></my-component>
</keep-alive>
```
Teknik ini dapat bermanfaat untuk meningkatkan pengalaman pengguna. Misalnya, bayangkan seorang pengguna mulai memasukkan komentar ke dalam input teks dan kemudian memutuskan untuk bernavigasi. Jika pengguna kemudian menavigasi kembali, komentar mereka akan tetap dipertahankan.

Setelah Anda menggunakan keep-hidup, maka Anda memiliki akses ke dua kait siklus hidup lagi: `diaktifkan` dan` dinonaktifkan`. Jika Anda ingin membersihkan atau mengubah data saat komponen yang tetap hidup dihapus, Anda dapat melakukannya di kait `dinonaktifkan`.

```js
deactivated: function () {
  // remove any data you do not want to keep alive
}
```

## Kesimpulan

Vue emmudahkan untuk mengembangkan aplikasi JavaScript reaktif yang luar biasa, tetapi Anda masih harus berhati-hati dengan kebocoran memori. Kebocoran ini akan sering terjadi ketika menggunakan perpustakaan Pihak ke-3 tambahan yang memanipulasi DOM di luar Vue. Pastikan untuk menguji aplikasi Anda untuk kebocoran memori dan mengambil langkah-langkah yang tepat untuk membersihkan komponen jika perlu.
