---
title: Props
type: guide
order: 102
---

> Halaman ini berasumsi Anda telah membaca [dasar-dasar komponen](components.html). Baca halaman itu terlebih dahulu bila Anda belum mengerti komponen.

## Aturan Huruf Prop (camelCase vs kebab-case)

Nama atribut dalam HTML bersifat *case-insensitive*, jadi peramban akan mengartikan semua karakter yang berhuruf besar sebagai karakter yang berhuruf kecil. Itu berarti ketika Anda menggunakan templat di dalam DOM, nama prop yang berformat camelCase perlu menggunakan padanan format kebab-case (dipisahkan dengan tanda hubung) :

``` js
Vue.component('blog-post', {
  // camelCase in JavaScript
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

``` html
<!-- kebab-case in HTML -->
<blog-post post-title="hello!"></blog-post>
```

Dan lagi, jika Anda menggunakan templat string, maka batasan ini tidak berlaku.

## Tipe Prop

Sejauh ini, kita hanya melihat props yang terdaftar sebagai sebuah string di dalam array:

```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

Namun biasanya, Anda ingin setiap prop  memiliki nilai yang spesifik tipenya. Dalam kasus ini, Anda bisa membuat daftar props sebagai sebuah objek, dimana properti nama akan berisi nama dari props sedangkan properti nilai akan berisi tipe data dari props tersebut :

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

Hal ini tidak hanya akan mendokumentasikan komponen Anda, tapi juga akan memperingatkan pengguna di konsol Javascript sebuah peramban jika mereka mengoper tipe data yang salah. Anda akan lebih banyak belajar tentang [pengecekan tipe data dan validasi prop lainnya](#Prop-Validation) lebih lanjut di halaman ini.

## Mengoper(*Passing*) Props Statis atau Dinamis

Sejauh ini, Anda telah melihat props yang dimasukkan dengan sebuah nilai statis, seperti berikut:

```html
<blog-post title="My journey with Vue"></blog-post>
```

Anda juga telah melihat props yang secara dinamis ditetapkan dengan `v-bind`, seperti berikut:

```html
<!-- Secara dinamis menetapkan nilai dari sebuah variabel -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- Secara dinamis menetapkan nilai dari sebuah ekspresi kompleks -->
<blog-post
  v-bind:title="post.title + ' by ' + post.author.name"
></blog-post>
```

Dari dua contoh di atas, kita telah mengoper nilai string, tapi sebenarnya _semua_ tipe nilai dapat dimasukkan ke dalam sebuah prop.

### Mengoper sebuah Angka

```html
<!-- Walaupun objek bersifat statis, kita perlu v-bind untuk memberi tahu Vue hal itu -->
<!-- berikut ini adalah sebuah ekspresi Javascript daripada sebuah string -->
<blog-post v-bind:likes="42"></blog-post>

<!-- Secara dinamis menetapkan nilai dari sebuah variabel. -->
<blog-post v-bind:likes="post.likes"></blog-post>
```

### Mengoper sebuah Boolean

```html
<!-- Memuat sebuah prop yang tidak memiliki nilai akan menghasilkan nilai `true`. -->
<blog-post is-published></blog-post>

<!-- Walaupun objek bersifat statis, kita perlu v-bind untuk memberi tahu Vue hal itu -->
<!-- berikut ini adalah sebuah ekspresi Javascript daripada sebuah string -->
<blog-post v-bind:is-published="false"></blog-post>

<!-- Secara dinamis menetapkan nilai dari sebuah variabel. -->
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```

### Mengoper sebuah Array

```html
<!-- Walaupun objek bersifat statis, kita perlu v-bind untuk memberi tahu Vue hal itu -->
<!-- berikut ini adalah sebuah ekspresi Javascript daripada sebuah string -->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- Secara dinamis menetapkan nilai dari sebuah variabel. -->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```

### Mengoper sebuah Objek

```html
<!-- Walaupun objek bersifat statis, kita perlu v-bind untuk memberi tahu Vue hal itu -->
<!-- berikut ini adalah sebuah ekspresi Javascript daripada sebuah string -->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- Secara dinamis menetapkan nilai dari sebuah variabel. -->
<blog-post v-bind:author="post.author"></blog-post>
```

### Mengoper nilai Properti dari sebuah Objek

Jika Anda ingin mengoper semua nilai properti dari sebuah objek sebagai props, Anda dapat menggunakan `v-bind` tanpa sebuah argumen (`v-bind` sebagai ganti `v-bind:prop-name`). Misalnya, sebuah objek ditaruh dalam `post`:

``` js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

Templatnya adalah sebagai berikut:

``` html
<blog-post v-bind="post"></blog-post>
```

Akan menjadi sama dengan:

``` html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

## Alur Data Satu-Jalur

Semua props berasal dari **binding satu-jalur-menurun(one-way-down)** di antara properti anak dan induknya: ketika Properti induk diperbarui, maka itu akan mengalir turun ke anak, namun tidak sebaliknya. Hal ini mencegah komponen anak secara tidak sengaja memutasi keadaan induknya, yang mana dapat membuat aplikasi Anda lebih sulit untuk dipahami.

Selain itu, setiap saat komponen induk diperbarui, maka semua props yang ada di dalam komponen anak akan diperbarui dengan nilai yang terbaru. Ini berarti Anda **tidak** boleh mencoba memutasi sebuah prop di dalam komponen anak. Jika Anda melakukannya, Vue akan memperingatkan Anda dalam konsol.

Biasanya ada dua kasus dimana itu menggoda untuk memutasi sebuah prop:

1. **Prop dipakai untuk mengoper sebuah nilai awal; kemudian komponen anak ingin menggunakannya sebagai properti data lokal.** Dalam hal ini, cara yang terbaik adalah mendefinisikan properti data lokal yang menggunakan prop sebagai nilai awalnya:

  ``` js
  props: ['initialCounter'],
  data: function () {
    return {
      counter: this.initialCounter
    }
  }
  ```

2. **Prop ditetapkan sebagai sebuah data mentah yang perlu untuk diubah.** Dalam kasus ini, cara yang terbaik adalah mendefiniskan sebuah properti computed dengan menggunakan nilai dari prop.

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Perhatikan bahwa objek dan array dalam Javascript ditetapkan berdasarkan referensi, jadi jika prop adalah sebuah array atau objek, memutasi objek atau array itu sendiri di dalam komponen anak **akan** mempengaruhi keadaan induk.</p>

## Validasi Prop

Komponen dapat menentukan persyaratan untuk prop miliknya, seperti tipe yang pernah Anda lihat. Jika suatu persyaratan tidak terpenuhi, Vue akan memperingatkan Anda di konsol Javascript Peramban. Hal ini sangat berguna terutama saat pengembangan sebuah komponen yang ditujukan untuk dipakai oleh orang lain.

Untuk menentukan validasi props, Anda dapat membuat sebuah objek dengan syarat-syarat validasi ke dalam nilai `props`, daripada hanya sebuah string di dalam array. sebagai contoh:

``` js
Vue.component('my-component', {
  props: {
    // Pengecekan dasar (nilai `null` dan `undefinied` akan diloloskan oleh semua tipe validasi)
    propA: Number,
    // Multiple possible types
    propB: [String, Number],
    // Membutuhkan String
    propC: {
      type: String,
      required: true
    },
    // Angka dengan sebuah nilai dasar
    propD: {
      type: Number,
      default: 100
    },
    // Objek dengan sebuah nilai dasar
    propE: {
      type: Object,
      // Objek atau array dasar harus dikembailkan dari 
      // sebuah factory function
      default: function () {
        return { message: 'hello' }
      }
    },
    // Fungsi validasi yang disesuaikan
    propF: {
      validator: function (value) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

Jika validasi prop gagal, Vue akan membuat sebuah pesan peringatan di konsol (Jika menggunakan development build).

<p class="tip">Perhatikan bahwa props telah divalidasi **sebelum** sebuah komponen instance dibuat, jadi properti instance (misalnya `data`, `computed`, dll) tidak akan bisa dipakai di fungsi `default` atau `validator`</p>

### Pengecekan Tipe Data

Sebuah `tipe` bisa jadi adalah salah satu dari konstruktor-konstruktor asli sebagai berikut:

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

Selain itu, sebuah `tipe` bisa juga merupakan sebuah fungsi konstruktor yang disesuaikan dan pernyataannya akan dibuat dengan pemeriksaan `instanceof`. Sebagai contoh, berikut ada sebuah konstruktor:

```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

Anda juga bisa menggunakan:

```js
Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

untuk memvalidasi bahwa nilai dari prop `author` dibuat dengan `new Person`.

## Atribut Non-Prop

Sebuah atribut non-prop merupakan sebuah atribut yang telah dimasukkan ke dalam sebuah component, tapi tidak memiliki prop yang didefiniskan dengan sesuai.

Sementara props yang telah didefinisikan secara eksplisit lebih diutamakan untuk mengoper informasi ke dalam komponen anak, pembuat pustaka komponen tidak dapat selalu melihat konteks dimana saja komponen milik mereka bisa digunakan. Itulah sebabnya komponen dapat menerima atribut semaunya, yang mana ditambahkan ke elemen komponen root.

Sebagai contoh, seumpama kita menggunakan komponen pihak ketiga `bootstrap-date-input` dengan sebuah plugin Bootstrap yang membutuhkan atribut `data-date-picker` di dalam `input`. Kita bisa menambahkan atribut ini ke dalam komponen instance kita : 

``` html
<bootstrap-date-input data-date-picker="activated"></bootstrap-date-input>
```

Dan atribut `data-date-picker="activated"` akan secara otomatis ditambahkan ke dalam elemen root dari `bootstrap-date-input`.

### Mengganti/Menyatukan dengan Atribut yang sudah ada

Umpamanya ini adalah template untuk `bootstrap-date-input`:

``` html
<input type="date" class="form-control">
```

Untuk menentukan sebuah tema untuk plugin date picker kita, kita perlu menambah class yang spesifik, seperti ini :

``` html
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>
```

Dalam kasus ini, dua nilai yang berbeda untuk `class` didefinisikan sebagai berikut:

- `form-control`, dimana diatur oleh komponen dalam templatnya
- `date-picker-theme-dark`, dimana dimasukkan ke komponen oleh induknya

Untuk sebagian besar atribut, nilai yang diberikan ke komponen akan menggantikan nilai yang ditetapkan oleh komponen. Jadi misalnya, mengoper `type =" text "` akan menggantikan `type =" date "` dan mungkin merusaknya! Untungnya, atribut `class` dan` style` sedikit lebih pintar, sehingga ketika kedua nilai digabungkan, akan membuat nilai akhir: `form-control date-picker-theme-dark`.

### Menonaktifkan Pewarisan Atribut

Jika Anda **tidak** ingin elemen root dari sebuah komponen mewariskan atribut, Anda dapat mengatur `inheritAttrs:false` di dalam pengaturan komponen. Misalnya:

```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```

Hal ini bisa sangat berguna dalam kombinasi dengan properti instance `$attrs`, yang mana berisikan nama dan nilai atribut yang telah dimasukkan ke sebuah komponen, seperti:

```js
{
  required: true,
  placeholder: 'Enter your username'
}
```

Dengan `inheritAttrs: false` dan `$attrs`, Anda secara manual dapat memutuskan elemen mana yang Anda ingin teruskan ke atribut, yang mana sering diperlukan sekali untuk [dasar-dasar komponen](../style-guide/#Base-component-names-strongly-recommended):

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

<p class="tip">Perhatikan bahwa pengaturan `inheritAttrs: false` **tidak** mempengaruhi binding `style` dan `class`.</p>

Pola ini membolehkan Anda untuk menggunakan komponen-komponen dasar seperti elemen HTML mentah, tanpa harus peduli elemen mana yang sebenarnya berada di root:

```html
<base-input
  v-model="username"
  required
  placeholder="Enter your username"
></base-input>
```
