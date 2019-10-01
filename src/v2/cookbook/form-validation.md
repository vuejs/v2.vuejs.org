---
title: Validasi Form
type: cookbook
order: 3
---

## Contoh Dasar

Validasi *Form* pada dasarnya didukung oleh browser, Tetapi kadang-kadang browser yang berbeda akan menangani hal tersebut dengan cara yang membuatnya rumit. Bahkan ketika validasi didukung dengan sempurna, mungkin akan ada saatnya validasi khusus dan manual lebih diperlukan, solusi berbasis Vue mungkin akan lebih tepat. mari kita mulai dengan contoh sederhana.

Diberikan tiga bidang *Form*, buat dua bidang diwajibkan. Marki kita lihat kode HTML dibawah:

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Name</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="age">Age</label>
    <input
      id="age"
      v-model="age"
      type="number"
      name="age"
      min="0">
  </p>

  <p>
    <label for="movie">Favorite Movie</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

Mari kita mulai dari kode teratas. Tag `<form>` memiliki ID yang akan kita gunakan untuk komponen Vue. Ada *submit handler* yang terlihat sedikit, dan `action` adalah *URL* sementara yang akan merujuk ke sebuah halaman yang nyata pada server di suatu tempat(di mana Anda tentu saja memiliki validasi *server-side* cadangan).

Di bawahnya ada paragraf yang tampil atau tersembunyi berdasarkan status kesalahan. Ini akan membuat daftar kesalahan yang sederhana di atas *form*. Perhatikan juga kita menggunakan validasi ketika tersumbit karena setiap bidang dimodifikasi.

Hal terakhir yang perlu diperhatikan adalah bahwa masing-masing dari tiga bidang memiliki `v-model` yang sesuai untuk menghubungkannya dengan nilai yang akan kita gunakan dalam Javascript. Sekarang mari kita lihat hal itu.

``` js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    age: null,
    movie: null
  },
  methods:{
    checkForm: function (e) {
      if (this.name && this.age) {
        return true;
      }

      this.errors = [];

      if (!this.name) {
        this.errors.push('Name required.');
      }
      if (!this.age) {
        this.errors.push('Age required.');
      }

      e.preventDefault();
    }
  }
})
```

Cukup singkat dan sederhana. Kita mendefinisikan *array* untuk meng-*handle* kesalahan dan menetapkan nilai `null` untuk tiga bidang *form*. Logika `checkForm` (yang dijalankan ketika disubmit) memeriksa bidang nama dan umur saja karena bidang film bersifat opsional. Jika kosong, maka kita periksa masing-masing dan atur pesan kesalahan spesifik untuk masing-masing. Dan itu yang sebenarnya terjadi. Anda dapat menjalankan demo di bawah ini. Jangan lupa bahwa pada pengiriman yang berhasil, itu akan di **POST** ke *URL* sementara.

<p data-height="265" data-theme-id="0" data-slug-hash="GObpZM" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 1" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/GObpZM/">form validation 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Menggunakan Validasi Kustom

Untuk contoh kedua, bidang teks kedua (umur) diganti ke email yang mana akan divalidasi dengan sedikit logika khusus. Kode diambil dari pertanyaan di StackOverflow,[How to validate email address in JavaScript?](https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript). Ini adalah pertanyaan yang luar biasa karena membuat argumen politik/agama Facebook Anda yang paling intens terlihat seperti sedikit perbedaan tentang siapa yang membuat bir terbaik. Serius - ini gila. Ini adalah HTML, meskipun sangat mirip dengan contoh yang pertama.

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Name</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="email">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      name="email"
    >
  </p>

  <p>
    <label for="movie">Favorite Movie</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

Sementara perubahan di sini kecil, perhatikan `novalidate="true"` di atas. Ini penting karena browser akan berusaha untuk memvalidasi alamat email di bidang ketika `type="email"`. Terus terang mungkin lebih masuk akal untuk mempercayai browser dalam kasus ini, tetapi karena kita ingin contoh dengan validasi khusus, Kita menonaktifkannya. Inilah Javascript yang diperbarui.

``` js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    email: null,
    movie: null
  },
  methods: {
    checkForm: function (e) {
      this.errors = [];

      if (!this.name) {
        this.errors.push("Name required.");
      }
      if (!this.email) {
        this.errors.push('Email required.');
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Valid email required.');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
})
```

Seperti yang Anda lihat, Kita telah menambahkan `validEmail` sebagai *method* baru dan hanya dipanggil dari `checkFrom`. Anda dapat bermain dengan contoh ini di sini:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqNXZ" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/vWqNXZ/">form validation 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Contoh Lain dari Validasi Form

Untuk contoh ketiga, Kita telah membuat sesuatu yang mungkin Anda lihat di aplikasi survei. Pengguna diminta untuk menghabiskan "anggaran" untuk serangkaian fitur untuk model *Star Destroyer* baru. Totalnya harus sama dengan 100. Pertama, HTML-nya.

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    Given a budget of 100 dollars, indicate how much
    you would spend on the following features for the
    next generation Star Destroyer. Your total must sum up to 100.
  </p>

  <p>
    <input
      v-model.number="weapons"
      type="number"
      name="weapons"
    > Weapons <br/>
    <input
      v-model.number="shields"
      type="number"
      name="shields"
    > Shields <br/>
    <input
      v-model.number="coffee"
      type="number"
      name="coffee"
    > Coffee <br/>
    <input
      v-model.number="ac"
      type="number"
      name="ac"
    > Air Conditioning <br/>
    <input
      v-model.number="mousedroids"
      type="number"
      name="mousedroids"
    > Mouse Droids <br/>
  </p>

  <p>
    Current Total: {{total}}
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

Perhatikan serangkaian input yang mencakup lima fitur berbeda. Perhatikan penambahan `.number` ke atribut `v-model`. Ini memberitahu Vue untuk mengubah nilai menjadi angka ketika kita Anda menggunakannya. Namun, ada *bug* dengan fitur ini sehingga ketika nilainya kosong, itu berubah menjadi *string*. Anda akan melihat solusinya di bawah. Untuk membuatnya lebih mudah bagi pengguna, Kita juga menambahkan total saat ini di bawah sehingga mereka dapat melihat, secara *real time*, berapa total mereka. Sekarang mari kita lihat Javascript-nya.

``` js
const app = new Vue({
  el: '#app',
  data:{
    errors: [],
    weapons: 0,
    shields: 0,
    coffee: 0,
    ac: 0,
    mousedroids: 0
  },
  computed: {
     total: function () {
       // harus parse karena Vue mengubah nilai kosong menjadi String
       return Number(this.weapons) +
         Number(this.shields) +
         Number(this.coffee) +
         Number(this.ac+this.mousedroids);
     }
  },
  methods:{
    checkForm: function (e) {
      this.errors = [];

      if (this.total != 100) {
        this.errors.push('Total must be 100!');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    }
  }
})
```

Kita mengatur nilai total sebagai nilai yang dihitung, dan di luar bug yang saya temui, itu cukup sederhana untuk diatur. *checkForm method* saya sekarang hanya perlu melihat apakah totalnya 100 dan hanya itu. Anda dapat bermain dengan ini di sini:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqGoy" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 3" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/vWqGoy/">form validation 3</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Validasi di sisi Server

Dalam contoh terakhir saya, Kita membuat sesuatu yang menggunakan *Ajax* untuk memvalidasi di server. *Form* akan meminta Anda untuk memberi nama produk baru dan kemudian akan memeriksa untuk memastikan bahwa nama itu unik. Kami menulis [OpenWhisk](http://openwhisk.apache.org/) tindakan tanpa server untuk melakukan validasi. Meskipun tidak terlalu penting, inilah logikanya:

``` js
function main(args) {
    return new Promise((resolve, reject) => {
        // bad product names: vista, empire, mbp
        const badNames = ['vista', 'empire', 'mbp'];

        if (badNames.includes(args.name)) {
          reject({error: 'Existing product'});
        }

        resolve({status: 'ok'});
    });
}
```

Pada dasaranya nama apapun selain "vista", "empire", dan "mbp" dapat diterima. Ok, jadi mari kita lihat *form*-nya.

``` html
<form
  id="app"
  @submit="checkForm"
  method="post"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">New Product Name: </label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

Tidak ada yang istimewa di sini. Jadi mari kita lanjutkan ke JavaScript.

``` js
const apiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/rcamden%40us.ibm.com_My%20Space/safeToDelete/productName.json?name=';

const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: ''
  },
  methods:{
    checkForm: function (e) {
      e.preventDefault();

      this.errors = [];

      if (this.name === '') {
        this.errors.push('Product name is required.');
      } else {
        fetch(apiUrl + encodeURIComponent(this.name))
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.errors.push(res.error);
          } else {
            // alihkan ke URL yang baru, atau lakukan sesuatu ketika berhasil
            alert('ok!');
          }
        });
      }
    }
  }
})
```

Kita memulai dengan variabel yang mewakili *URL API* yang berjalan di OpenWhisk. Sekarang lihat `checkForm`. Dalam versi ini, Kita selalu mencegah pengiriman *form* (yang, ngomong-ngomong, dapat dilakukan dalam HTML dengan Vue juga). Anda dapat melihat pemeriksaan dasar pada `this.name` yang kosong, dan kemudian kita *hit* API. Jika gagal, kita menambahkan pesan kesalahan seperti sebelumnya. Jika berhasil, saat ini kita tidak melakukan apa-apa (hanya peringatan), tetapi Anda dapat mengarahkan pengguna ke halaman baru dengan nama produk di URL, atau melakukan tindakan lain juga. Anda dapat menjalankan demo ini di bawah:

<p data-height="265" data-theme-id="0" data-slug-hash="BmgzeM" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 4" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/BmgzeM/">form validation 4</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Pola Alternatif

Sementara entri *cookbook* ini berfokus pada melakukan validasi *form* "manual", tentu saja ada beberapa *library* Vue yang akan menangani banyak tentang ini untuk Anda. Beralih ke perpaket *library* dapat mempengaruhi ukuran akhir aplikasi Anda, tetapi manfaatnya bisa luar biasa. Anda memiliki kode yang (kemungkinan besar) sangat diuji dan juga diperbarui secara berkala. Beberapa contoh *library* validasi *form* untuk Vue termasuk:

* [vuelidate](https://github.com/monterail/vuelidate)
* [VeeValidate](http://vee-validate.logaretm.com/)
