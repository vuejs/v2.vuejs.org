---
title: Menangani Kasus Langka
type: guide
order: 106
---

> Halaman ini menganggap Anda sudah membaca [Dasar Komponen](components.html). Baca dulu jika Anda baru mengenal komponen.

<p class="tip">Semua fitur pada halaman ini mendokumentasikan penanganan kasus langka, berarti situasi yang tidak biasa yang kadang-kadang membutuhkan sedikit mengubah aturan Vue. Namun perhatikan, bahwa semua fitur memiliki kelemahan atau situasi di mana mereka bisa berbahaya. Semua itu dicatat dalam setiap kasus, jadi ingatlah ketika memutuskan untuk menggunakan setiap fitur.</p>


## Akses Elemen & Komponen

Dalam kebanyakan kasus, yang terbaik adalah menghindari menjangkau ke instance komponen lainnya atau memanipulasi elemen DOM secara manual. Namun, ada kasus-kasus di mana itu harus dilakukan.

### Mengakses Instance Root

Dalam setiap subkomponen dari *instance* `new Vue`, *instance* *root* ini dapat diakses dengan properti `$root`. Misalnya, dalam *instance* *root* ini:

```js
// Contoh root Vue
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

Semua subkomponen sekarang dapat mengakses instance ini dan menggunakannya sebagai *store* global:

```js
// Mendapatkan data root
this.$root.foo

// Menetapkan data root
this.$root.foo = 2

// Akses root computed properties
this.$root.bar

// Memanggil root methods
this.$root.baz()
```

<p class="tip">Ini dapat memudahkan untuk demo atau aplikasi yang sangat kecil dengan beberapa komponen. Namun cara ini tidak berskala dengan baik ke aplikasi skala menengah atau besar, jadi kami sangat menyarankan menggunakan <a href="https://github.com/vuejs/vuex">Vuex</a> Untuk mengelola state pada umumnya.</p>

### Mengakses *instance* induk komponen

Mirip dengan `$root`, properti `$parent` dapat digunakan untuk mengakses *instance* induk dari anak. Sebagai alternatif untuk yang malas mengoper data dengan props.

<p class="tip">Dalam kebanyakan kasus, menjangkau komponen induk membuat aplikasi Anda lebih sulit untuk di-<i>debug</i> dan dipahami, terlebih jika Anda mutasi data dalam induk. Saat melihat komponen itu nanti, akan sangat sulit untuk mencari tahu dari mana asal mutasi itu.</p>

Namun ada beberapa kasus, khususnya pustaka komponen yang dibagikan, saat ini _mungkin_ tepat. Misalnya, dalam komponen abstrak yang berinteraksi dengan API JavaScript alih-alih merender HTML, seperti komponen Google Maps untuk hipotetis ini:

```html
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```

Komponen `<google-map>` mungkin mendefinisikan properti `map` yang aksesnya diperlukan oleh semua subkomponen. Dalam kasus ini `<google-map-markers>` mungkin ingin mengakses `map` itu dengan sesuatu seperti `this.$parent.getMap`, untuk menambahkan satu set *markers* ke dalamnya. Anda dapat melihat pola ini [beraksi di sini](https://jsfiddle.net/chrisvfritz/ttzutdxh/).

Ingatlah, komponen yang dibangun dengan pola ini masih rapuh. Sebagai contoh, bayangkan kita menambahkan komponen `<google-map-region>` baru dan ketika `<google-map-markers>` muncul di dalamnya, komponen tersebut seharusnya hanya *render* *markers* yang terdapat di wilayah tersebut.

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

Kemudian di dalam `<google-map-markers>` Anda mungkin akan melakukan hack seperti ini:

```js
var map = this.$parent.map || this.$parent.$parent.map
```

Hal ini dengan cepat tak terkendali. Oleh sebab itu untuk menyediakan konteks informasi yang diturunkan ke komponen semaunya, kami menawarkan [*dependency injection*](#Dependency-Injection).

### Mengakses *Instance* Komponen Anak & Elemen Anak

Meskipun ada *props* dan *events*, terkadang Anda mungkin masih perlu mengakses langsung komponen anak dalam JavaScript. Untuk mencapai ini, Anda dapat menetapkan ID referensi ke komponen anak menggunakan atribut `ref`. Sebagai contoh:

```html
<base-input ref="usernameInput"></base-input>
```

Sekarang di komponen tempat Anda mendefinisikan `ref`, Anda dapat menggunakannya:

```js
this.$refs.usernameInput
```

Untuk mengakses instance `<base-input>`. Hal ini mungkin berguna saat Anda mau, sebagai contoh, secara terprogram memfokuskan input dari induk. Dalam kasus ini, komponen `<base-input>` juga dapat menggunakan `ref` untuk menyediakan akses ke elemen tertentu di dalamnya, seperti:

```html
<input ref="input">
```

Dan bahkan mendefinisikan metode untuk digunakan oleh induk:

```js
methods: {
  // Digunakan untuk memfokuskan input dari induk
  focus: function () {
    this.$refs.input.focus()
  }
}
```

Dengan demikian memungkinkan komponen induk untuk memfokuskan input di dalam `<base-input>` dengan:

```js
this.$refs.usernameInput.focus()
```

Ketika `ref` digunakan bersama dengan `v-for`, referensi yang Anda dapatkan akan berupa array yang mengandung komponen turunan yang mencerminkan sumber data.
<p class="tip"><code>$refs</code> hanya diisi setelah komponen telah di-render, dan mereka tidak reaktif. Ini hanya dimaksudkan sebagai jalan keluar untuk manipulasi komponen anak secara langsung - Anda harus menghindari mengakses <code>$refs</code> dari dalam templat dan properti computed.</p>

### Dependency Injection

Sebelumnya, ketika kami jelaskan [Mengakses *instance* induk komponen](#Mengakses-*instance*-induk-komponen), kami menunjukkan contoh seperti ini:

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

Dalam komponen ini, semua keturunan dari `<google-map>` membutuhkan akses ke metode `getMap`, untuk mengetahui peta mana yang harus berinteraksi. Sayangnya, menggunakan properti `$parent` tidak berskala dengan baik untuk komponen yang bersarang lebih dalam. Di situlah *dependency injection* dapat bermanfaat, menggunakan dua opsi baru *instance*: `provide` dan` inject`.

Opsi `provide` memungkinkan kita untuk menentukan data/metode yang ingin kita **berikan** untuk komponen turunan. Dalam kasus ini, itulah metode `getMap` di dalam` <google-map> `:

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

Kemudian pada keturunannya, kita bisa menggunakan opsi `inject` untuk menerima properti tertentu yang ingin kita tambahkan ke *instance* tersebut:

```js
inject: ['getMap']
```

Anda dapat melihat [contoh lengkap disini](https://jsfiddle.net/chrisvfritz/tdv8dt3s/). Keuntungan dibanding menggunakan `$parent` adalah bahwa kita dapat mengakses `getMap` dalam _semua_ komponen turunan, tanpa memaparkan seluruh instance dari `<google-map>`. Ini memungkinkan kita lebih aman untuk terus mengembangkan komponen tersebut, tanpa ada rasa takut kita dapat mengubah/menghapus sesuatu yang digunakan komponen anak. Antarmuka antara komponen ini tetap jelas, sama seperti dengan `props`.

Bahkan, Anda bisa menganggap *dependency injection* sebagai semacam *"props jarak jauh"*, kecuali:

* komponen leluhur tidak perlu tahu keturunan mana yang menggunakan properti yang disediakannya
* komponen turunan tidak perlu tahu dari mana properti yang dioper berasal

<p class="tip">Namun, ada kelemahan untuk <i>dependency injection</i>. <i>Dependency injection</i> memasangkan komponen dalam aplikasi Anda dengan cara mereka saat diatur, membuat <i>refactoring</i> menjadi lebih sulit. Properti yang disediakan juga tidak reaktif. Hal ini dengan sengaja dilakukan, karena perkembangan menggunakan mereka untuk membuat data <i>store</i> terpusat sama buruknya dengan <a href="#Mengakses-Instance-Root">menggunakan <code>$root</code></a> untuk tujuan yang sama. Jika properti yang ingin Anda bagikan spesifik untuk applikasi Anda, atau jika Anda ingin memperbarui data yang disediakan di dalam leluhur, maka itu pertanda baik bahwa Anda mungkin membutuhkan solusi manajemen <i>state</i> seperti <a href="https://github.com/vuejs/vuex">Vuex</a> sebagai gantinya.</p>

Belajar lebih tentang *dependency injection* di [the API doc](https://vuejs.org/v2/api/#provide-inject).

## *Event Listeners* Terprogram

Sejauh ini, Anda telah melihat penggunaan `$emit`, dipantau dengan `v-on`, tetapi *instance* Vue juga menawarkan metode lain di antarmuka *event*. Kita dapat:

- Pantau sebuah *event* dengan `$on(eventName, eventHandler)`
- Pantau sekali *event* dengan`$once(eventName, eventHandler)`
- Berhenti pantau *event* dengan `$off(eventName, eventHandler)`

Anda biasanya tidak harus menggunakan ini, tetapi mereka tersedia untuk kasus-kasus ketika Anda perlu secara manual mendengarkan *event* pada instance komponen. Mereka juga dapat berguna sebagai alat organisasi kode. Sebagai contoh, Anda mungkin sering melihat pola ini untuk diintegrasikan dengan pustaka pihak ke-3:

```js
// Pasang datepicker ke input sekali
// pasang ke DOM.
mounted: function () {
  // Pikaday adalah pustaka data pihak ketiga
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// Tepat sebelum komponen dihancurkan,
// juga menghancurkan datepicker.
beforeDestroy: function () {
  this.picker.destroy()
}
```

Ini memiliki dua masalah potensial:

- Membutuhkan penyimpanan `picker` ke instance komponen, bila memungkinkan, hanya kait siklus hidup [(lifecycle hooks)](https://docs.vuejs.id/v2/api/#Options-Lifecycle-Hooks) yang memerlukan akses ke sana. Ini tidak buruk, tetapi bisa dianggap berantakan.
- Kode pengaturan kita disimpan terpisah dari kode pembersihan kita, membuatnya lebih sulit untuk secara terprogram membersihkan apa pun yang kita atur.

Anda bisa menyelesaikan kedua masalah dengan *Event Listeners* Terprogram:

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

Dengan menggunakan strategi ini, kita bahkan dapat menggunakan Pikaday dengan beberapa elemen input, dengan setiap instance baru secara otomatis membersihkannya sendiri:

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

Lihat [fiddle ini](https://jsfiddle.net/chrisvfritz/1Leb7up8/) untuk kode lengkap. Perhatikan, namun, bahwa jika Anda harus melakukan banyak pengaturan dan pembersihan dalam satu komponen, solusi terbaik biasanya adalah membuat lebih banyak komponen modular. Dalam hal ini, kami sarankan untuk membuat komponen `<input-datepicker>` yang dapat digunakan kembali.

Untuk mempelajari lebih lanjut tentang *Listeners* Terprogram, lihat API untuk [Metode *Events Instance*](https://vuejs.org/v2/api/#Instance-Methods-Events).

<p class="tip">Perhatikan bahwa sistem <i>event</i> Vue berbeda dari <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">API EventTarget browser</a>. Walaupun mereka bekerja dengan cara yang sama, <code>$emit</code>, <code>$on</code>, dan <code>$off</code> <strong>bukan</strong> alias untuk <code>dispatchEvent</code>, <code>addEventListener</code>, dan <code>removeEventListener</code>.</p>

## Komponen Sirkuler (Circular Component)

### Komponen Rekursif (Recursive Component)

Komponen dapat secara rekursif memanggil dirinya sendiri dalam templatnya sendiri. Namun, mereka hanya dapat melakukannya dengan opsi `name`:

``` js
name: 'unique-name-of-my-component'
```

Ketika Anda mendaftarkan komponen secara global menggunakan `Vue.component`, ID global secara otomatis ditetapkan sebagai opsi `nama` komponen.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

Jika Anda tidak hati-hati, komponen rekursif juga dapat menyebabkan loop tak terbatas:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

Komponen seperti di atas akan menghasilkan kesalahan ["max stack size exceeded"](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack), jadi pastikan pemanggilan rekursif bersifat kondisional (yaitu menggunakan `v-if` yang akhirnya akan menjadi `false`).

### *Circular References* Antara Komponen

Katakanlah Anda sedang membangun pohon direktori file, seperti di *Finder* atau File *Explorer*. Anda mungkin memiliki komponen `tree-folder` dengan templat ini:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Kemudian komponen `tree-folder-content` dengan templat ini:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

Ketika Anda teliti, Anda akan melihat bahwa komponen ini sebenarnya akan menjadi keturunan _dan_ leluhur satu sama lain di pohon *render* - sebuah paradoks! Saat mendaftarkan komponen secara global dengan `Vue.component`, Paradoks ini secara otomatis deselesaikan untuk anda. Jika itu Anda, maka Anda bisa berhenti membaca disini

Namun, jika Anda melakukan *requiring/importing* komponen menggunakan __sistem modul__, misalnya melalui *Webpack* atau *Browserify*, Anda akan mendapatkan kesalahan:

```
Failed to mount component: template or render function not defined.
```

Untuk menjelaskan apa yang terjadi, sebut saja komponen kita A dan B. Sistem modul melihat bahwa ia membutuhkan A, tetapi pertama A membutuhkan B, tetapi B membutuhkan A, tetapi A membutuhkan B, dan seterusnya. komponen tersebut terjebak dalam satu lingkaran, tidak tahu bagaimana menyelesaikan kedua komponen tanpa terlebih dahulu menyelesaikan yang lain. Untuk memperbaikinya, kita perlu memberikan sistem modul titik di mana ia dapat mengatakan, "_Pada akhirnya_ A membutuhkan B, tapi kita tidak perlu menyelesaikan B dulu."

Dalam kasus kita, mari kita buat titk itu menjadi komponen `tree-folder`. Kita tahu anak yang menciptakan paradoks adalah komponen `tree-folder-contents`, jadi kita akan menunggu sampai kait siklus hidup *(lifecycle hooks)* `beforeCreate` untuk mendaftarkannya:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

Atau sebagai alternatif, Anda bisa menggunakan `Import` asinkron *Webpack* ketika Anda mendaftarkan komponen secara lokal:

``` js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

Masalah terpecahkan!

## Definisi Templat Alternatif

### Templat *Inline*

Ketika atribut khusus `inline-template` ada pada komponen turunan, komponen akan menggunakan konten dalamnya sebagai templatnya, dari pada memperlakukannya sebagai konten yang didistribusikan. Ini memungkinkan pembuatan template yang lebih fleksibel.

``` html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

Template *inline* Anda harus didefinisikan di dalam elemen DOM yang dilampirkan Vue.

<p class="tip">Namun, <code>inline-template</code> membuat cakupan template Anda lebih sulit untuk dipikirkan. Sebagai praktik terbaik, kita lebih suka mendefinisikan templat di dalam komponen menggunakan opsi <code>template</code> atau dalam <code>&lt;elemen templat&gt;</code> dalam file <code>.vue</code>.</p>

### X-Templates

Cara lain untuk mendefinisikan template adalah di dalam elemen skrip dengan tipe `text/x-template`, lalu merujuk template dengan id. Sebagai contoh:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

*x-template* Anda harus didefinisikan di luar elemen DOM yang dilampirkan Vue.

<p class="tip">Ini dapat berguna untuk demo dengan template besar atau dalam aplikasi yang sangat kecil, tetapi sebaliknya harus dihindari, karena mereka memisahkan templat dari sisa definisi komponen.</p>

## Mengontrol Pembaruan

Berkat sistem Reaktivitas Vue, Vue selalu tahu kapan harus memperbarui (jika Anda menggunakannya dengan benar). Namun ada kasus langka, ketika Anda mungkin ingin memaksakan pembaruan, meskipun faktanya tidak ada data reaktif yang berubah. Lalu ada kasus lain ketika Anda mungkin ingin mencegah pembaruan yang tidak perlu.

### Memaksa Pembaruan

<p class="tip">Jika Anda merasa perlu memaksakan pembaruan di Vue, dalam 99,99% kasus, Anda membuat kesalahan di suatu tempat.</p>

Anda mungkin tidak memperhitungkan perubahan peringatan [dengan array](https://vuejs.org/v2/guide/list.html#Caveats) atau [objek](https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats), atau Anda mungkin mengandalkan *state* yang tidak dilacak oleh sistem reaktivitas Vue, misalnya dengan `data`.

Namun, jika Anda telah mengesampingkan hal di atas dan menemukan diri Anda dalam situasi yang sangat langka karena harus memaksa pembaruan secara manual, Anda dapat melakukannya dengan [`$forceUpdate`](../api/#vm-forceUpdate).

### Komponen Statis Murah dengan `v-once`

*Rendering* elemen HTML biasa sangat cepat di Vue, tetapi terkadang Anda mungkin memiliki komponen yang mengandung **banyak** konten statis. Dalam kasus ini, Anda dapat memastikan bahwa itu hanya dievaluasi sekali dan kemudian di-*cache* dengan menambahkan direktif `v-once` ke elemen root, seperti ini:

``` js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```

<p class="tip">Sekali lagi, cobalah untuk tidak terlalu sering menggunakan pola ini. Meskipun nyaman dalam kasus-kasus langka ketika Anda harus membuat banyak konten statis, hal ini tidak perlu kecuali Anda benar-benar melihat rendering lambat -- ditambah, itu bisa menyebabkan banyak kebingungan nantinya. Sebagai contoh, bayangkan pengembang lain yang tidak terbiasa dengan <code>v-once</code> atau hanya melewatkannya di templat. Mereka mungkin menghabiskan waktu berjam-jam untuk mencari tahu mengapa templat tidak diperbarui dengan benar.</p>
