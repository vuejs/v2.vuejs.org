---
title: Menambah Properti Instance
type: cookbook
order: 2
---

## Contoh Dasar

Mungkin ada data/utilitas yang ingin anda gunakan di banyak komponen, tetapi anda tidak ingin [mencemari scope global](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch3.md). Dalam kasus ini, anda dapat membuatnya tersedia untuk setiap *instance* Vue dengan mendefinisikannya pada *prototype*:


```js
Vue.prototype.$appName = 'Aplikasi saya'
```

Sekarang `$appName` tersedia di semua *instance* Vue, bahkan sebelum pembuatan. Jika kita jalankan:

```js
new Vue({
  beforeCreate: function() {
    console.log(this.$appName)
  }
})
```

Kemudian `"Aplikasi saya"` akan tercatat pada konsol!

## *Scoping* Properti *Instance*

Anda mungkin bertanya:

> "Mengapa `appName` dimulai dengan `$`? Apakah itu penting? Apa fungsinya?

Tidak ada keajaiban yang terjadi disini. `$` adalah konvensi yang digunakan Vue untuk properti yang tersedia untuk semua *instance*. Ini menghindari konflik dengan data yang didefinisikan, properti yang dihitung, atau metode.

> "Konflik? Apa yang anda maksud?"

Pertanyaan bagus lainnya! Jika Anda menetapkan:

```js
Vue.prototype.appName = 'Aplikasi saya'
```

Lalu apa yang anda harapkan untuk tercatat di bawah ini?

```js
new Vue({
  data: {
    // Uh oh - appName adalah nama properti 
    // *instance* juga yang kita definisikan!
    appName: 'Nama aplikasi lain'
  },
  beforeCreate: function() {
    console.log(this.appName)
  },
  created: function() {
    console.log(this.appName)
  }
})
```

Ini akan menjadi `"Aplikasi saya"`, lalu `"Nama aplikasi lain"`, karena `this.appName` ditimpa ([semacam](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md)) oleh `data` saat instance dibuat. Kami memberi *scope* properti *instance* dengan `$` untuk menghindari hal ini. Anda bahkan dapat menggunakan konvensi anda sendiri jika ingin, seperti `$ _appName` atau` ΩappName`, untuk mencegah konflik bahkan dengan *plugin* atau fitur-fitur masa depan.

## Contoh Dunia Nyata: Mengganti Sumber Vue dengan Axios

Katakanlah anda mengganti [Sumber Vue yang sekarang sudah pensiun](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4). Anda benar-benar menikmati mengakses metode *request* melalui `this.$http` dan anda ingin melakukan hal yang sama dengan Axios sebagai gantinya.

Yang harus anda perlu lakukan adalah memasukkan axios dalam proyek Anda:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.2/axios.js"></script>

<div id="app">
  <ul>
    <li v-for="user in users">{{ user.name }}</li>
  </ul>
</div>
```

Memberi alias `axios` ke `Vue.prototype.$http`:

```js
Vue.prototype.$http = axios
```

Maka anda akan dapat menggunakan metode seperti ini `this.$http.get` dalam setiap *instance* Vue:

```js
new Vue({
  el: '#app',
  data: {
    users: []
  },
  created() {
    var vm = this
    this.$http
      .get('https://jsonplaceholder.typicode.com/users')
      .then(function(response) {
        vm.users = response.data
      })
  }
})
```

## Konteks Metode Prototype

Jika anda tidak menyadari, metode yang ditambahkan ke *prototype* dalam JavaScript memperoleh konteks *instance*. Itu berarti mereka dapat menggunakan `this` untuk mengakses data, properti yang dihitung (computed properties), metode, atau apa pun yang didefinisikan pada *instance*.

Mari kita manfaatkan ini dalam sebuah metode `$reverseText`:

```js
Vue.prototype.$reverseText = function(propertyName) {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}

new Vue({
  data: {
    message: 'Halo'
  },
  created: function() {
    console.log(this.message) // => "Halo"
    this.$reverseText('message')
    console.log(this.message) // => "olaH"
  }
})
```

Perhatikan bahwa pengikatan (binding) konteks **tidak** berfungsi jika anda menggunakan fungsi panah (arrow function) ES6/2015, karena mereka secara implisit mengikat (bind) ke *scope* induk. Itu berarti versi fungsi panah berikut:

```js
Vue.prototype.$reverseText = propertyName => {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}
```

Akan melempar galat:

```log
Uncaught TypeError: Cannot read property 'split' of undefined
```

## Kapan Harus Menghindari Pola Ini

Selama anda waspada dalam *scoping* pada properti *prototype*, menggunakan pola ini cukup aman - seperti pada, tidak mungkin mengasilkan *bugs*.

Namun, terkadang dapat menyebabkan kebingungan dengan pengembang lain. Mereka mungkin melihat `this.$http`, sebagai contoh, dan berpikir, "Oh, saya tidak tahu tentang fitur Vue ini!" Kemudian mereka pindah ke proyek lain dan bingung ketika `this.$http` tidak terdefisini (undefined). Atau, mungkin mereka ingin mencari di Google cara melakukan sesuatu, tetapi tidak dapat menemukan hasil karena mereka tidak menyadari bahwa mereka benar-benar menggunakan Axios dengan alias.

**Kemudahan datang dengan harga kesederhanaan.** Ketika melihat pada sebuah komponen, tidak mungkin untuk mengetahui dari mana `$http` berasal. Vue sendiri? *Plugin*? Rekan kerja?

Jadi apa saja alternatifnya?

## Pola Alternatif

### Ketika Tidak Menggunakan Sebuah Sistem Modul

Dalam aplikasi **tanpa** sistem modul (mis. Via Webpack atau Browserify), ada pola yang sering digunakan dengan Frontend yang disempurnakan dengan JavaScript (JavaScript-enhanced frontend) apapun: objek `App` global.

Jika yang ingin anda tambahkan tidak ada hubungannya dengan Vue secara khusus, ini mungkin merupakan alternatif yang baik untuk dicapai. Berikut sebuah contoh:

```js
var App = Object.freeze({
  name: 'Aplikasi saya',
  version: '2.1.4',
  helpers: {
    // Ini adalah versi fungsional murni dari
    // metode $reverseText yang kita lihat sebelumnya
    reverseText: function(text) {
      return text
        .split('')
        .reverse()
        .join('')
    }
  }
})
```

<p class="tip">Jika Anda mengangkat alis pada `Object.freeze`, yang dilakukannya adalah mencegah objek diubah di masa mendatang. Ini pada dasarnya membuat semua properti miliknya konstan, melindungi anda dari kondisi *bug* di masa depan.</p>

Sekarang sumber dari properti yang dibagikan ini lebih jelas: ada objek `App` yang didefinisikan di suatu tempat dalam aplikasi. Untuk menemukannya, pengembang dapat melakukan pencarian di seluruh proyek.

Keuntungan lain adalah bahwa `App` sekarang dapat digunakan _di manapun_ dalam kode Anda, apakah itu terkait Vue atau tidak. Itu termasuk melampirkan nilai secara langsung ke opsi *instance*, daripada harus memasukkan fungsi untuk mengakses properti di `this`:

```js
new Vue({
  data: {
    appVersion: App.version
  },
  methods: {
    reverseText: App.helpers.reverseText
  }
})
```

### Ketika Menggunakan Sebuah Sistem Modul

Ketika Anda memiliki akses ke sistem modul, anda dapat dengan mudah mengatur kode bersama ke dalam modul, kemudian `require`/`import` modul-modul tersebut di manapun dibutuhkan. Ini adalah lambang kesederhanaan, karena dalam setiap berkas anda mendapatkan daftar dependensi (dependencies). Anda tahu _persis_ tepatnya di mana masing-masing berkas tersebut berasal.

Meskipun tentu saja lebih bertele-tele, pendekatan ini jelas yang paling bisa dipelihara, terutama ketika bekerja dengan pengembang lain dan/atau membangun sebuah aplikasi besar.
