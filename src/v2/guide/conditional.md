---
title: Rendering Bersyarat
type: guide
order: 7
---

## `v-if`

Instruksi `v-if` biasa digunakan untuk melakukan render sebuah blok secara bersyarat. Blok hanya akan di-*render* apabila ekspresi instruksi mengembalikan nilai benar.

``` html
<h1 v-if="awesome">Vue itu mengagumkan!</h1>
```

Juga memungkinkan untuk menambahkan "blok else" dengan `v-else`:

``` html
<h1 v-if="awesome">Vue itu mengagumkan!</h1>
<h1 v-else>Oh tidak 😢</h1>
```

### Pengelompokan Bersyarat dengan `v-if` pada `<template>`

Sebab `v-if` adalah sebuah instruksi, maka ia harus ditempelkan pada sebuah elemen tunggal. Tetapi bagaimana jika kita ingin beralih lebih dari satu elemen? Dalam kasus ini kita dapat menggunakan `v-if` pada sebuah elemen `<template>`, yang akan bertindak sebagai pembungkus yang tak terlihat. Hasil akhir dari *rendering* tidak akan menyertakan elemen `<template>`.

``` html
<template v-if="ok">
  <h1>Judul</h1>
  <p>Paragraf 1</p>
  <p>Paragraf 2</p>
</template>
```

### `v-else`

Anda bisa menggunakan instruksi `v-else` untuk menunjukkan sebuah "blok else" untuk `v-if`:

``` html
<div v-if="Math.random() > 0.5">
  Sekarang Anda dapat melihatku
</div>
<div v-else>
  Sekarang tidak bisa
</div>
```

Sebuah elemen `v-else` harus berada setelah `v-if` atau setelah elemen `v-else-if` - jika tidak maka ia tidak akan dikenali.

### `v-else-if`

> Baru tersedia pada 2.1.0+

`v-else-if`, sesuai namanya, bertindak sebagai "blok else if" untuk `v-if`. Ia juga bisa dirangkai berkali-kali:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Bukan A/B/C
</div>
```

Sama seperti `v-else`, sebuah elemen `v-else-if` harus berada sesudah `v-if` atau sesudah elemen `v-else-if`.

### Mengendalikan Elemen Reusable dengan `key`

Vue mencoba me-*render* elemen seefisien mungkin, lebih sering memakainya kembali dibandingkan melakukan *rendering* dari awal. Itulah mengapa Vue sangat cepat, dimana hal ini memiliki banyak manfaat. Sebagai contoh, jika Anda mengizinkan pengguna untuk beralih antar jenis *login*:

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Masukkan username Anda">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Masukkan alamat surel Anda">
</template>
```

Kemudian peralihan `loginType` pada kode di atas tidak akan menghapus apa yang pengguna telah ketikkan. Karena templat keduanya menggunakan elemen yang sama, `<input>` tidak akan ditimpa - hanya bagian `placeholder`.

Periksa sendiri dengan memasukkan beberapa teks pada kotak isian, lalu tekan tombol alih:

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Masukkan username Anda">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Masukkan alamat surel Anda">
    </template>
  </div>
  <button @click="toggleLoginType">Beralih jenis login</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Hal ini kadang tidak diinginkan, sehingga Vue menawarkan cara bagi Anda yang bilang, "Dua elemen ini sepenuhnya terpisah - jangan gunakan ulang mereka." Tambahkan sebuah atribut `key` dengan nilai yang unik:

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

Sekarang kotak isian tersebut akan di-*render* dari awal tiap kali tombol alih ditekan. Bisa dilihat di bawah:

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Masukkan username Anda" key="username-input">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Masukkan alamat surel Anda" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Beralih jenis login</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Harap diperhatikan bahwa elemen `<label>` masih digunakan ulang secara efisien, sebab tidak memiliki atribut `key`.

## `v-show`

Opsi lain untuk menampilkan elemen secara bersyarat adalah menggunakan instruksi `v-show`. Penggunaannya kurang lebih sama:

``` html
<h1 v-show="ok">Halo!</h1>
```

Perbedaannya adalah `v-show` akan selalu melakukan *rendering* dan tetap berada di DOM; `v-show` hanya mengalihkan properti CSS `display` dari elemen tersebut.

<p class="tip">Sebagai catatan bahwa `v-show` tidak mendukung elemen `<template>`, begitu pula tidak bekerja dengan `v-else`.</p>

## `v-if` vs `v-show`

`v-if` merupakan rendering bersyarat yang "nyata (real)" sebab ia memastikan bahwa penyimak *event* dan komponen anak di dalam blok kondisional benar benar dihancurkan dan dibuat ulang selama peralihan.

`v-if` juga **malas**: jika kondisi bernilai salah pada render awal, maka tidak akan melakukan apa-apa - blok kondisional tidak akan di-*render* hingga kondisi menjadi bernilai benar untuk pertama kali.

Sebagai perbandingan, `v-show` jauh lebih sederhana - elemen akan selalu di-*render* tak terkecuali kondisi awal, dengan melakukan peralihan berbasis CSS.

Secara umum, `v-if` memiliki biaya peralihan yang lebih tinggi sementara `v-show` memiliki biaya *rendering* awal yang lebih tinggi. Jadi lebih baik gunakan `v-show` jika Anda butuh pengalihan yang cukup sering, dan gunakan `v-if` if kondisi tidak mungkin berubah saat *runtime*.

## `v-if` dengan `v-for`

<p class="tip">Menggunakan `v-if` dan `v-for` secara bersama-sama **tidak direkomendasikan**. Lihat  [panduan gaya](/v2/style-guide/#Avoid-v-if-with-v-for-essential) untuk informasi lebih lanjut.</p>

Ketika menggunakan bersama-sama dengan `v-if`, `v-for` memiliki prioritas yang lebih tinggi dibanding `v-if`. Lihat <a href="../guide/list.html#V-for-and-v-if">panduan list rendering</a> untuk detailnya.
