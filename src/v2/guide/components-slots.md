---
title: Slot
type: guide
order: 104
---

> Sebelum mulai membaca halaman ini, kami berasumsi bahwa Anda telah membaca [Dasar-Dasar Komponen](components.html). Baca halaman itu terlebih dahulu bila Anda belum mengerti tentang komponen.

> Di versi 2.6.0, kami memperkenalkan sintaks baru (direktif `v-slot`) untuk nama dan *slot scope*. Sintaks tersebut menggantikan `slot` dan atribut `slot-scope`, yang sekarang tidak digunakan lagi, tapi masih belum dihapus dan masih didokumentasikan [di sini](#Deprecated-Syntax). Alasan kami untuk memperkenalkan sintaks baru dapat dilihat di [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md).

## Konten Slot

Vue mengimplementasikan *API* distribusi konten yang terinspirasi dari [Draf Spesifikasi Komponen Web](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), dan elemen `<slot>` dapat digunakan sebagai outlet distribusi untuk konten kita.

Ini memungkinkan Anda untuk membuat komponen seperti ini:

``` html
<navigation-link url="/profile">
  Profil Anda
</navigation-link>
```

Kemudian di templat `<navigation-link>`, Anda mungkin memiliki templat seperti ini:

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

Ketika komponen di-*render*, `<slot></slot>` akan menggantinya dengan "Profil Anda". Elemen *slot* dapat berisi kode templat apa saja, termasuk HTML:

``` html
<navigation-link url="/profile">
  <!-- Menambahkan ikon Font Awesome -->
  <span class="fa fa-user"></span>
  Profil Anda
</navigation-link>
```

Atau bahkan dapat berisi komponen lain:

``` html
<navigation-link url="/profile">
  <!-- Menggunakan komponen untuk menambahkan ikon -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Profil Anda
</navigation-link>
```

Jika templat `<navigation-link>` tidak berisi elemen `<slot>`, konten apapun yang kita sediakan di dalam komponen `<navigation-link>` akan di buang.

## Kompilasi Scope

Saat Anda ingin menggunakan data di dalam *slot*, seperti ini:

``` html
<navigation-link url="/profile">
  Masuk sebagai {{ user.name }}
</navigation-link>
```

*Slot* dapat mengakses properti *instance* yang sama (*scope* yang sama). *Slot* **tidak** dapat mengakses ke *scope* `<navigation-link>`. Misalnya, Anda mencoba untuk mengakses data `url` dari *scope* `<navigation-link>`, itu tidak akan bisa:

``` html
<navigation-link url="/profile">
  Klik di sini dan Anda akan diarahkan ke: {{ url }}
  <!--
  Data `url` akan *undefined*, karena tidak di definisikan _di dalam_ komponen
  <navigation-link>, tetapi data `url` akan dioper _ke_ templat <navigation-link>.
  -->
</navigation-link>
```

Ingat, bahwa aturannya:

> Semua yang ada di templat induk, akan dikompilasi di dalam *scope* induk; semua yang ada di templat anak, akan dikompilasi di dalam *scope* anak.

## Konten Fallback

Ada beberapa kasus yang bermanfaat untuk menentukan konten *slot fallback* (*slot default*), yang hanya akan di-*render* ketika tidak ada konten yang tersedia. Misalnya, di dalam komponen `<submit-button>`:

```html
<button type="submit">
  <slot></slot>
</button>
```

Kita mungkin ingin me*render* teks "Submit" di dalam `<button>` setiap saat. Untuk membuatnya, kita dapat menempatkan teks "Submit" di antara tag `<slot>`:

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

Sekarang saat kita menggunakan `<submit-button>` di dalam komponen induk, yang tidak kita sediakan konten di dalamnya:

```html
<submit-button></submit-button>
```

Komponen tersebut akan me*render* konten *fallback* (*default*) yang telah kita sediakan sebelumnya:

```html
<button type="submit">
  Submit
</button>
```

Akan tetapi jika kita menyediakan konten di komponen tersebut:

```html
<submit-button>
  Save
</submit-button>
```

Konten tersebut akan di-*render* sebagai:

```html
<button type="submit">
  Save
</button>
```

## Slot yang Memiliki Nama (Named Slot)

> Diperbarui di versi 2.6.0+. [Lihat di sini](#Deprecated-Syntax) untuk sintaks yang tidak digunakan lagi, yang menggunakan atribut `slot`.

Ada kalanya memiliki banyak slot itu bermanfaat. Misalnya, di dalam komponen `<base-layout>` dengan templat berikut ini:

``` html
<div class="container">
  <header>
    <!-- Kita ingin konten *header* di sini -->
  </header>
  <main>
    <!-- Kita ingin konten *main* di sini -->
  </main>
  <footer>
    <!-- Kita ingin konten *footer* di sini -->
  </footer>
</div>
```

Pada kasus ini, elemen `<slot>` memiliki atribut khusus, `name`, yang dapat digunakan untuk mendefinisikan *slot* tambahan:

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

`<slot>` tanpa menggunakan `name` secara implisit memiliki nama "default".

Untuk menyediakan konten di *slot* yang memiliki nama, kita dapat menggunakan direktif `v-slot` di `<template>` yang menggunakan nama *slot* sebagai argumen `v-slot`:

```html
<base-layout>
  <template v-slot:header>
    <h1>Di sini mungkin untuk judul halaman</h1>
  </template>

  <p>Paragraf untuk konten utama</p>
  <p>Dan satu lagi</p>

  <template v-slot:footer>
    <p>Di sini untuk beberapa info kontak</p>
  </template>
</base-layout>
```

Sekarang semua yang ada di dalam templat `<template>` akan dioper ke *slot* yang sesuai. Konten apa pun yang tidak di bungkus dengan `<template>` yang menggunakan atribut `v-slot`, itu akan diasumsikan sebagai *slot default*.

Namun, jika Anda ingin lebih eksplisit, Anda masih bisa membungkus konten *slot default* di dalam `<template>`:

```html
<base-layout>
  <template v-slot:header>
    <h1>Di sini mungkin untuk judul halaman</h1>
  </template>

  <template v-slot:default>
    <p>Paragraf untuk konten utama</p>
    <p>Dan satu lagi</p>
  </template>

  <template v-slot:footer>
    <p>Di sini untuk beberapa info kontak</p>
  </template>
</base-layout>
```

Jika tidak, HTML yang kita tempatkan di antara templat `<template>` akan di-*render* seperti ini:

``` html
<div class="container">
  <header>
    <h1>Di sini mungkin untuk judul halaman</h1>
  </header>
  <main>
    <p>Paragraf untuk konten utama</p>
    <p>Dan satu lagi</p>
  </main>
  <footer>
    <p>Di sini untuk beberapa info kontak</p>
  </footer>
</div>
```

Perhatikan bahwa **`v-slot` hanya dapat ditambahkan di `<template>`** (dengan [satu pengecualian](#Abbreviated-Syntax-for-Lone-Default-Slots)), tidak seperti [atribut `slot`](#Deprecated-Syntax) yang tidak digunakan lagi.

## Scope Slot

> Diperbarui di versi 2.6.0+. [Lihat di sini](#Deprecated-Syntax) untuk sintaks yang tidak digunakan lagi, yang menggunakan atribut `slot-scope`.

Terkadang, konten *slot* yang hanya memiliki akses ke data yang tersedia di komponen anak, itu sangat berguna. Misalnya, bayangkan jika komponen `<current-user>` dengan templat berikut ini:

```html
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```
Ingin kita ganti dengan komponen *fallback* (*default*) dengan nama depan pengguna, seperti ini:

``` html
<current-user>
  {{ user.firstName }}
</current-user>
```

Itu tidak akan bisa, karena komponen `<current-user>` hanya dapat mengakses data `user` dan konten yang kita sediakan di-*render* di induk.

Untuk membuat data `user` tersedia di induk konten *slot*, kita bisa *bind* data `user` sebagai atribut di elemen `<slot>`:

``` html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

Atribut yang di-*bind* di elemen `<slot>` yang memiliki nama **slot props**. Sekarang di *scope* induk, kita dapat menggunakan `v-slot` dengan nilai untuk mendefinisikan nama *slot props* yang telah kita sediakan:

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

Di contoh ini, kita memilih untuk memberi nama objek yang berisi semua *slot props* `slotProps` kami, tetapi Anda bisa menggunakan nama apa pun yang Anda suka.

### Sintaks yang Disingkat untuk Slot Default yang Sendirian

Pada kasus di atas, ketika *slot default* saja yang _hanya_ disediakan konten, tag komponen dapat digunakan sebagai templat *slot*. Ini memungkinkan kita untuk menggunakan `v-slot` secara langsung di komponen:

``` html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Ini bisa dipersingkat, bahkan bisa lebih. Sama seperti konten yang tidak ditentukan, `v-slot` tanpa argumen dapat diasumsikan merujuk ke *slot default*:

``` html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Perhatikan bahwa sintaks yang disingkat untuk *slot default* yang sendirian **tidak bisa** dicampur dengan *slot* yang memiliki nama, karena akan menyebabkan *scope* yang ambigu:

``` html
<!-- TIDAK VALID, dan akan menghasilkan peringatan -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    slotProps TIDAK tersedia di sini
  </template>
</current-user>
```

Setiap kali ada banyak *slot*, pastikan untuk menggunakan sintaks `<template>` pada _semua_ *slot*:

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

### Destrukturisasi Props Slot

Dibelakang, cara *slot scope* bekerja adalah dengan membungkus konten *slot* Anda di dalam suatu *function* yang melewati satu argumen:

```js
function (slotProps) {
  // ... slot content ...
}
```

Itu berarti, nilai `v-slot` sebenarnya dapat menerima ekspresi JavaScript yang valid yang berada di posisi argumen dari definisi *function*. Jadi, di lingkungan yang didukung ([komponen berkas tunggal (single-file components)](single-file-components.html) atau [browser moderen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)), Anda juga bisa menggunakan [Destrukturisasi ES2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) untuk mengeluarkan *slot props* yang spesifik, seperti ini:

``` html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

Ini bisa membuat templat menjadi lebih bersih, terutama ketika *slot* menyediakan banyak *props*. Ini juga membuka kemungkinan lain, seperti mengganti nama *props*, Contohnya nama `user` diganti menjadi `person`:

``` html
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
```

Anda bahkan dapat mendefinisikan *fallbacks*, untuk di gunakan ketika *slot props* tidak didefinisikan:

``` html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

## Nama Slot yang Dinamis

> Baru di versi 2.6.0+

[Argumen direktif yang dinamis](syntax.html#Dynamic-Arguments) juga bekerja di `v-slot`, itu memungkinkan Anda untuk mendefinisikan nama *slot* secara dinamis:

``` html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## Nama Slot yang Disingkat

> Baru di versi 2.6.0+

Sama seperti `v-on` dan `v-bind`, `v-slot` juga memiliki nama yang disingkat, mengganti semua argumen sebelum (`v-slot:`) dengan simbol khusus `#`. Misalnya, `v-slot:header` bisa ditulis ulang sebagai `#header`:

```html
<base-layout>
  <template #header>
    <h1>Di sini mungkin untuk judul halaman</h1>
  </template>

  <p>Paragraf untuk konten utama</p>
  <p>Dan satu lagi</p>

  <template #footer>
    <p>Di sini untuk beberapa info kontak</p>
  </template>
</base-layout>
```

Namun, seperti halnya dengan direktif, nama yang disingkat hanya tersedia saat argumen telah disediakan. Itu berarti sintaks berikut ini tidak valid:

``` html
<!-- Ini akan memicu peringatan -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
```

Sebagai gantinya, Anda harus selalu menentukan nama *slot* jika Anda ingin menggunakan nama yang disingkat:

``` html
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
```

## Contoh Lainnya

***Slot props* memungkinkan kita untuk mengubah *slot* menjadi templat yang dapat digunakan kembali, dan bisa di-*render* dengan konten yang berbeda, yang berbasis pada input *props*.** Ini sangat berguna ketika Anda mendesain komponen yang dapat digunakan kembali yang merangkum logika data, yang memungkinkan komponen induk untuk mengkonsumsi data tersebut, untuk mengkustomisasi *layout*.

Misalnya, kami sedang mengimplementasikan komponen `<todo-list>` yang berisi *layout* dan logika *filter* untuk *list*:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

Daripada *hard-coding* setiap konten *todo*, kita bisa membiarkan komponen induk untuk membuat setiap *slot todo*, kemudian *bind* `todo` sebagai *slot props*:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    Kita mimiliki *slot* untuk setiap `todo`, kemudian oper objek `todo` sebagai *slot props*.
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- Konten fallback (*default*) -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

Sekarang saat kita menggunakan komponen `<todo-list>`, secara opsional kita bisa mendifinisikan alternatif `<template>` untuk *todo items*, tapi dengan akses ke data dari anak:

```html
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

Namun, ini bahkan nyaris tidak menjelaskan apa saja yang bisa *slot* lakukan. Di dunia nyata, contoh yang bagus untuk penggunaan *slot*, kami sarankan untuk menelusuri pustaka seperti [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller), [Vue Promised](https://github.com/posva/vue-promised), dan [Portal Vue](https://github.com/LinusBorg/portal-vue).

## Sintaks yang tidak digunakan lagi

> Direktif `v-slot` diperkenalkan di Vue versi 2.6.0, menawarkan API alternatif yang telah ditingkatkan, yang masih mendukung atribut `slot` dan `slot-scope`. Alasan lengkap diperkenalkannya `v-slot` dapat dilihat di [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md). Atribut `slot` dan `slot-scope` akan terus didukung di semua rilis Vue 2.x mendatang, tetapi secara resmi tidak digunakan lagi dan akhirnya akan dihapus di Vue 3.

### Slot yang Memiliki Nama dengan Atribut `slot`

> <abbr title="Masih didukung di semua versi Vue 2.x, tapi tidak lagi direkomendasikan.">Tidak digunakan lagi</abbr> di versi 2.6.0+. Lihat [di sini](#Named-Slots) untuk sintaks baru yand direkomendasikan.

Untuk mengoper konten ke *slot* yang memiliki nama dari induk, gunakan atribut khusus `slot` di `<template>` (menggunakan komponen `<base-layout>` yang dijelaskan di bawah [ini](#Named-Slots) sebagai contoh):

```html
<base-layout>
  <template slot="header">
    <h1>Di sini mungkin untuk judul halaman</h1>
  </template>

  <p>Paragraf untuk konten utama</p>
  <p>Dan satu lagi</p>

  <template slot="footer">
    <p>Di sini untuk beberapa info kontak</p>
  </template>
</base-layout>
```

Atau, atribut `slot` yang juga bisa digunakan secara langsung di elemen *normal*:

``` html
<base-layout>
  <h1 slot="header">Di sini mungkin untuk judul halaman</h1>

  <p>Paragraf untuk konten utama</p>
  <p>Dan satu lagi</p>

  <p slot="footer">Di sini untuk beberapa info kontak</p>
</base-layout>
```

Masih ada satu *slot* yang tidak memiliki nama, yang merupakan **slot default**, yang berfungsi untuk menangkap semua konten yang tidak cocok. Di dalam dua contoh di atas, HTML akan di-*render* menjadi:

``` html
<div class="container">
  <header>
    <h1>Di sini mungkin untuk judul halaman</h1>
  </header>
  <main>
    <p>Paragraf untuk konten utama</p>
    <p>Dan satu lagi</p>
  </main>
  <footer>
    <p>Di sini untuk beberapa info kontak</p>
  </footer>
</div>
```

### Scope Slot dengan Atribut `slot-scope`

> <abbr title="Masih didukung di semua versi Vue 2.x, tapi tidak lagi direkomendasikan.">Tidak digunakan lagi</abbr> di versi 2.6.0+. Lihat [di sini](#Scoped-Slots) untuk sintaks baru yand direkomendasikan.

Untuk menerima *props* yang dioper ke *slot*, komponen induk juga bisa menggunakan `<template>` dengan atribut `slot-scope`  (menggunakan `<slot-example>` yang dijelaskan di bawah [ini](#Scoped-Slots) sebagai contoh):

``` html
<slot-example>
  <template slot="default" slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

Di sini, `slot-scope` menerima objek *props* sebagai variabel `slotProps`, dan membuatnya tersedia di dalam *scope* `<template>`. Anda dapat memberi nama `slotProps` apa pun yang Anda suka, sama seperti memberi nama argumen *function* di JavaScript.

Di sini, `slot="default"` dapat dihilangkan karena tersirat:

``` html
<slot-example>
  <template slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

Atribut `slot-scope` juga bisa digunakan secara langsung di elemen yang non-`<template>` (termasuk komponen):

``` html
<slot-example>
  <span slot-scope="slotProps">
    {{ slotProps.msg }}
  </span>
</slot-example>
```

Nilai `slot-scope` dapat menerima ekspresi JavaScript yang valid yang berada di posisi argumen dari definisi *function*. Itu berarti, di lingkungan yang didukung ([komponen berkas tunggal (single-file components)](single-file-components.html) atau [browser moderen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)), Anda juga bisa menggunakan [Destrukturisasi ES2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) di dalam expresi seperti ini:

``` html
<slot-example>
  <span slot-scope="{ msg }">
    {{ msg }}
  </span>
</slot-example>
```

Menggunakan `<todo-list>` yang dijelaskan di bawah [ini](#Other-Examples) sebagai contoh, inilah cara penggunaan `slot-scope`:

``` html
<todo-list v-bind:todos="todos">
  <template slot="todo" slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```
