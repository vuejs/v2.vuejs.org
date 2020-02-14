---
title: Penyimpanan Data di Sisi Klien
type: cookbook
order: 11
---

## Contoh Dasar

Penyimpanan data di sisi klien (_client-side_) merupakan salah satu cara terbaik untuk menigkatkan performa aplikasi secara cepat. Dengan menyimpan data pada peramban (_browser_), Anda tidak perlu lagi mengambil informasi dari peladen (_server_) setiap kali pengguna membutuhkannya. Ini tidak hanya berguna ketika kondisi luring (_offline_), pengguna dalam kondisi daring (_online_) pun akan merasakan manfaat lebih dari penggunaan data secara lokal dibanding. Penyimpanan data di sisi klien dapat menggunakan [_cookies_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [_Local Storage_](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (_"Web Storage"_ secara teknis), [_IndexedDB_](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), dan [_WebSQL_](https://www.w3.org/TR/webdatabase/) (metode usang (_deprecated_) yang sebaiknya jangan digunakan di proyek baru).

Di kesempatan ini kita akan berfokus pada _Local Storage_, yang mana merupakan mekanisme penyimpanan paling sederhana. _Local Storage_ menggunakan model kunci/nilai (_key/value_) untuk menyimpan data. Namun ia hanya dapat menyimpan nilai yang sederhana, seperti _string_ atau angka. Nilai yang kompleks seperti _array_ atau _object_ dapat disimpan dengan cara mengubahnya menjadi JSON. Secara umum, _Local Storage_ cocok untuk menyimpan data dengan ukuran kecil, seperti preferensi pengguna atau data formulir (_form_). Data dengan ukuran yang lebih besar dan memiliki struktur yang kompleks dapat menggunakan _IndexedDB_.

Mari kita mulai dengan contoh sederhana berbasis masukan dari pengguna:

``` html
<div id="app">
  Namaku adalah <input v-model="nama">
</div>
```

Contoh ini memiliki satu masukan formulir yang dihubungkan dengan data di Vue bernama `nama`. JavaScript-nya seperti berikut:

``` js
const app = new Vue({
  el: '#app',
  data: {
    nama: ''
  },
  mounted() {
    if (localStorage.nama) {
      this.nama = localStorage.nama;
    }
  },
  watch: {
    nama(namaBaru) {
      localStorage.name = namaBaru;
    }
  }
});
```

Coba lihat pada bagian `mounted` dan `watch`. Kita menggunakan `mounted` untuk mengambil nilai dari _Local Storage_. Untuk menangani penyimpanannya, kita memantau perubahan pada `nama` melalui `watch`, dan ketika nilainya berubah, maka nilai yang baru akan segera disimpan.

Anda dapat menjalankannya sendiri di sini:
<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="rizqyhi" data-slug-hash="RwwrRxb" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="mencoba localstorage">
  <span>Lihat Pen <a href="https://codepen.io/rizqyhi/pen/RwwrRxb">
  mencoba localstorage</a> oleh Rizqy Hidayat (<a href="https://codepen.io/rizqyhi">@rizqyhi</a>)
  di <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Ketikkan sesuatu pada formulir dan muat ulang halaman ini. Anda akan mendapati bahwa nilai yang Anda ketikkan sebelumnya akan muncul secara otomatis. Jangan lupa, peramban Anda sudah menyediakan alat bagi pengembang untuk memerika penyimpanan sisi klien. Ini adalah contoh di Firefox:

![Alat pengembang untuk penyimpanan di sisi klien pada Firefox](/images/devtools-storage.png)

Lalu yang ini di Chrome:

![Alat pengembang untuk penyimpanan di sisi klien pada Chrome](/images/devtools-storage-chrome.png)

Dan yang terakhir di Microsoft Edge. Anda dapat menemukannya di bawah tab _Debugger_.

![Alat pengembang untuk penyimpanan di sisi klien pada Edge](/images/devtools-storage-edge.png)

<p class="tip">Sebagai catatan, alat pengembang ini juga memberikan fitur untuk menghapus nilai yang disimpan. Ini akan sangat berguna ketika melakukan percobaan.</p>

Hal yang perlu diperhatikan adalah sebaiknya jangan langsung menyimpan data pada saat terjadi perubahan. Mari kita buat contoh yang lebih baik. Mula-mula perbaiki dulu formulirnya.

``` html
<div id="app">
  <p>
    Namaku adalah <input v-model="nama">
    dan usiaku <input v-model="umur"> tahun.
  </p>
  <p>
    <button @click="simpanData">Simpan</button>
  </p>
</div>
```

Sekarang kita memiliki 2 masukan yang sama-sama tertaut ke instance Vue. Perbedaannya sekarang ada sebuah tombol yang akan menjalankan metode `simpanData` ketika diklik. Mari kita lihat JavaScript-nya.

``` js
const app = new Vue({
  el: '#app',
  data: {
    nama: '',
    umur: 0
  },
  mounted() {
    if (localStorage.nama) {
      this.nama = localStorage.nama;
    }
    if (localStorage.umur) {
      this.umur = localStorage.umur;
    }
  },
  methods: {
    simpanData() {
      localStorage.nama = this.nama;
      localStorage.umur = this.umur;
      console.log('bayangkan hal-hal lainnya yang perlu dilakukan...');
    }
  }
})
```

Seperti sebelumnya, metode `mounted` digunakan untuk memuat data yang tersimpan jika ada. Bedanya, kali ini datanya hanya akan tersimpan ketika tombolnya diklik. Kita juga dapat melakukan validasi atau memproses data di sini sebelum menyimpannya. Anda juga bisa menyimpan tanggal yang menunjukkan kapan data tersebut disimpan. Dengan metadata ini, metode `mounted` dapat memutuskan apakah datanya perlu disimpan lagi atau tidak. Anda dapat mencoba versi ini secara langsung di bawah ini.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="rizqyhi" data-slug-hash="WNNrxMp" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="mencoba localstorage 2">
  <span>Lihat Pen <a href="https://codepen.io/rizqyhi/pen/WNNrxMp">
  mencoba localstorage 2</a> oleh Rizqy Hidayat (<a href="https://codepen.io/rizqyhi">@rizqyhi</a>)
  di <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Bekerja dengan Data yang Kompleks

Seperti yang sudah disebutkan sebelumnya, _Local Storage_ hanya dapat digunakan untuk menyimpan data sederhana. Untuk menyimpan data yang kompleks, seperti objek dan _array_, Anda harus melakukan serialisasi dan deserialisasi datanya menggunakan JSON. Di bawah ini adalah contoh yang lebih kompleks yang menyimpan sekumpulan data kucing (contoh data yang paling keren :).

``` html
<div id="app">
  <h2>Keluarga Kucing</h2>
  <div v-for="(kucing, n) in dataKucing">
    <p>
      <span class="kucing">{{ kucing }}</span>
      <button @click="hapusKucing(n)">Hapus</button>
    </p>
  </div>

  <p>
    <input v-model="kucingBaru">
    <button @click="tambahKucing">Tambah Kucing</button>
  </p>
</div>
```

Aplikasi ini terdiri dari daftar sederhana di bagian atas (dengan tombol untuk menghapus seekor kucing) dan sebuah formulir kecil di bawahnya untuk menambahkan kucing baru. Sekarang kita lihat JavaScript-nya.

``` js
const app = new Vue({
  el: '#app',
  data: {
    dataKucing: [],
    kucingBaru: null
  },
  mounted() {
    if (localStorage.getItem('kucing')) {
      try {
        this.dataKucing = JSON.parse(localStorage.getItem('kucing'));
      } catch(e) {
        localStorage.removeItem('kucing');
      }
    }
  },
  methods: {
    tambahKucing() {
      // pastikan nama kucing sudah diisi
      if (!this.kucingBaru) {
        return;
      }

      this.dataKucing.push(this.kucingBaru);
      this.kucingBaru = '';
      this.simpanKucing();
    },
    hapusKucing(x) {
      this.dataKucing.splice(x, 1);
      this.simpanKucing();
    },
    simpanKucing() {
      // dataKucing diserialisasi menjadi string JSON
      const parsed = JSON.stringify(this.dataKucing);
      localStorage.setItem('kucing', parsed);
    }
  }
})
```

Pada aplikasi ini, kita sudah beralih menggunakan _API Local Storage_ (lihat penggunaan `setItem`, `getItem`, dan `deleteItem`) dibanding sebelumnya yang menggunakan akses langsung. Sebenarnya keduanya dapat digunakan, tapi metode API lebih disarankan. Kemudian metode `mounted` sekarang harus mengambil dan melakukan _parsing_ (proses deserialisasi) untuk mengubah string JSON menjadi array yang dikenali JavaScript. Jika terjadi kesalahan, kita mengasumsikan bahwa data yang tersimpan sudah tidak valid dan menghapusnya. (Perlu diingat, ketika aplikasi Anda menggunakan penyimpanan di sisi klien, pengguna juga memiliki akses ke data tersebut dan dapat mengubahnya sendiri.)

Sekarang kita memiliki 3 metode untuk bekerja dengan data kucing. Metode `tambahKucing` dan `hapusKucing` menangani pembaruan data pada Vue yang disimpan di `this.dataKucing`. Lalu keduanya menjalankan metode `simpanKucing` yang akan menangani serialisasi dan penyimpanan data. Anda dapat mencoba versi ini di bawah:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="rizqyhi" data-slug-hash="abbdZqR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="localstorage, kompleks">
  <span>See the Pen <a href="https://codepen.io/rizqyhi/pen/abbdZqR">
  localstorage, kompleks</a> by Rizqy Hidayat (<a href="https://codepen.io/rizqyhi">@rizqyhi</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Pola Alternatif

_API Local Storage_ dapat dibilang sederhana, tapi memiliki beberapa kekurangan fitur yang dapat berguna di banyak aplikasi. Beberapa _plugin_ di bawah ini membungkus akses ke _Local Storage_ untuk mempermudah penggunaannya, serta menambahkan fungsionalitas baru, seperti nilai _default_.
While the Local Storage API is relatively simple, it is missing some basic features that would be useful in many applications. The following plugins wrap Local Storage access and make it easier to use, while also adding functionality like default values.

* [vue-local-storage](https://github.com/pinguinjkeke/vue-local-storage)
* [vue-reactive-storage](https://github.com/ropbla9/vue-reactive-storage)
* [vue2-storage](https://github.com/yarkovaleksei/vue2-storage)

## Penutup

Meskipun peramban tidak akan pernah menggantikan sistem persistensi peladen, dengan menerapkan berbagai cara untuk menyimpan data di lokal secara sementara (_cache_) tentunya dapat meningkatkan performa secara signifikan untuk aplikasi Anda. Dan dengan menggunakan Vue.js akan membuatnya menjadi lebih hebat.
