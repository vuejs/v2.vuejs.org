---
title: Komponen Berkas Tunggal
type: guide
order: 401
---

## Pengantar

Pada kebanyakan proyek Vue, komponen global akan didefinisikan menggunakan `Vue.component`, diikuti dengan `new Vue({ el: '#container' })` untuk mengarahkan ke elemen kontainer dalam *body* setiap halaman.

Ini dapat bekerja dengan sangat baik untuk proyek skala kecil hingga menengah, dimana JavaScript hanya digunakan untuk meningkatkan tampilan bagian tertentu saja. Namun di proyek yang lebih komplek, atau ketika *frontend* anda diatur sepenuhnya oleh JavaScript, kekurangan - kekurangan berikut akan muncul:

- **Definisi Global** memaksa setiap komponen mempunyai nama yang unik
- **Templat String** kurangnya *syntax highlighting* dan membutuhkan karakter garis miring (slash) yang jelek untuk HTML multi-baris (*multiline HTML*)
- **Tidak ada dukungan CSS** HTML and JavaScript dapat di-modularisasi-kan ke komponen, namun tidak dengan CSS
- **Tidak ada build step** membatasi kita hanya menggunakan HTML dan JavaScript ES5, *preprocessor* seperti Pug (dulunya Jade) dan Babel tidak bisa kita gunakan

Semua masalah tersebut dapat teratasi dengan **komponen berkas tunggal** (***single-file components***) ber-ektensi `.vue`, memungkinkan kita menggunakan *build tool* seperti Webpack atau Browserify.

Berikut ini contoh dari file `Hello.vue`:

<a href="https://gist.github.com/chrisvfritz/e2b6a6110e0829d78fa4aedf7cf6b235" target="_blank" rel="noopener noreferrer"><img src="/images/vue-component.png" alt="contoh Komponen Berkas Tunggal (klik untuk code berupa text)" style="display: block; margin: 30px auto;"></a>

Sekarang kita mendapatkan:

- [Complete syntax highlighting](https://github.com/vuejs/awesome-vue#source-code-editing)
- [CommonJS modules](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [Component-scoped CSS](https://vue-loader.vuejs.org/en/features/scoped-css.html)

Sesuai yang dijanjikan, kita juga dapat menggunakan *preprocessor* seperti Pug, Babel (dengan modul ES2015), dan Stylus untuk komponen yang lebih rapi dan lebih kaya akan fitur.

<a href="https://gist.github.com/chrisvfritz/1c9f2daea9bc078dcb47e9a82e5f7587" target="_blank" rel="noopener noreferrer"><img src="/images/vue-component-with-preprocessors.png" alt="Contoh Komponen Berkas Tunggal dengan preprocessors (klik untuk code berupa text)" style="display: block; margin: 30px auto;"></a>

Bahasa tersebut hanya sebagai contoh. Anda dapat menggunakan Bublé, TypeScript, SCSS, PostCSS - atau *preprocessor* lainnya yang membantu produktifitas Anda. Jika menggunakan Webpack dengan `vue-loader`, juga akan mendapatkan dukungan terbaik untuk Modul CSS.

### Bagaimana dengan Pembagian Kepentingan (*Separation of Concerns*)?

Satu hal yang perlu dicatat adalah **pembagian kepentingan (*separation of concerns*) tidak sama dengan pembagian tipe file (*separation of file types*).** Di pengembangan UI modern, kami temukan bahwa daripada membagi basis kode menjadi 3 layer raksasa yang saling terikat satu sama lain, lebih masuk akal membaginya ke dalam satu komponen yang terikat longgar (*loosely-coupled*) dan menyusunnya. Di dalam sebuah komponen, templat, logika, dan *style*-nya  digabungkan secara inheren, dan ditempatkan dalam satu tempat membuat komponen lebih kohesif dan *maintainable*.

Jika anda tidak suka dengan konsep dari Komponen Berkas Tunggal, anda masih bisa memanfaatkan fitur *hot-reloading* dan *pre-compilation* dengan memisahkan JavaScript and CSS kedalam file terpisah:

``` html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Memulai

### Sandbox Contoh

Jika Anda ingin langsung terjun dan mulai mencoba Komponen Berkas Tunggal, silahkan lihat [simple todo app](https://codesandbox.io/s/o29j95wx9) di CodeSandbox.

### Untuk Pengguna Baru Module Build Systems di JavaScript

Dengan komponen `.vue`, kita memasuki dunia Aplikasi JavaScript tingkat lanjut. Yang berarti Anda harus memperlajari beberapa *tool* jika Anda belum siap:

- **Node Package Manager (NPM)**: Baca [Panduan Memulai](https://docs.npmjs.com/getting-started/what-is-npm) bab _10: Uninstalling global packages_.

- **JavaScript Modern dengan ES2015/16**: Baca [Panduan Belajar ES2015](https://babeljs.io/docs/learn-es2015/) Babel. Untuk saat ini Anda tidak harus menghafal semua fitur yang ada disana, namun simpan halaman tersebut sebagai referensi kedepannya.

Setelah Anda memperlajari beberapa *resource* tersebut, kami merekomendasi untuk melihat [Vue CLI 3](https://cli.vuejs.org/). Ikuti instruksinya dan anda sudah bisa langsung memulai sebuah Proyek Vue dengan komponen `.vue`, ES2015, Webpack dan *hot-reloading*!

### Untuk Pengguna Tingkat Lanjut

Vue CLI menangani sebagian besar konfigurasi *tool* yang Anda butuhkan, namun tetap bisa dikonstumisasi lewat [opsi konfigurasi](https://cli.vuejs.org/config/).

Namun jika Anda lebih suka membuat *build setup* dari awal, Anda perlu konfigurasi [vue-loader](https://vue-loader.vuejs.org) webpack secara manual. Untuk memperlajari tentang webpack itu sendiri, Silahkan lihat [Dokumentasi Resmi Webpack](https://webpack.js.org/configuration/) dan [Webpack Academy](https://webpack.academy/p/the-core-concepts).
