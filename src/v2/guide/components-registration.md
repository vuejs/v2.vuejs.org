---
title: Registrasi Komponen
type: guide
order: 101
---

> Halaman ini berasumsi Anda telah membaca [dasar-dasar komponen](components.html). Baca halaman itu terlebih dahulu bila Anda belum mengerti komponen.

## Nama Komponen

Ketika mendaftarkan sebuah komponen, selalu berikan nama. Misalnya, untuk sebuah registrasi global kita akan melihat seperti berikut:

```js
Vue.component('my-component-name', { /* ... */ })
```

Nama komponen adalah argumen pertama dari `Vue.component`.

Nama yang Anda berikan ke komponen mungkin tergantung pada dimana Anda akan menggunakannya. Ketika menggunakan komponen secara langsung di dalam DOM ( sebagai lawan di dalam *template string* atau [berkas komponen tunggal *(single-file component)*](single-file-components.html)), kita sangat merekomendasikan untuk mengikuti [Panduan W3C](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) untuk membuat nama tag *custom* (semuanya huruf kecil, harus berisi tAnda penghubung). Ini membantu Anda untuk menghindari konflik dengan elemen HTML sekarang dan kedepanya.

Anda bisa melihat rekomendasi lainya untuk nama nama komponen di [Panduan Gaya](../style-guide/#Base-component-names-strongly-recommended).

### Aturan Huruf Nama (Name Casing)

Anda mempunyai dua pilihan ketika mendefinisikan nama komponen:

#### Dengan *kebab-case*

```js
Vue.component('nama-komponen-saya', { /* ... */ })
```

Ketika mendefinisikan komponen dengan *kebab-case*, Anda juga harus menggunakan *kebab-case* ketika memberi referensi ke elemen *custom*, seperti di `<nama-komponen-saya>`.

#### Dengan *PascalCase*

```js
Vue.component('NamaKomponenSaya', { /* ... */ })
```

Ketika mendefinisikan komponen dengan *PascalCase*, Anda dapat menggunakan kedua hal ketika memberi referensi ke *custom* elemenya. Itu berarti, kedua `<nama-komponen-saya>` dan `<NamaKomponenSaya>` dapat diterima. Catatan, meskipun hanya nama *kebab-case* yang valid secara langsung di DOM (contoh : *templates non-string*).

## Registrasi Global

Sejauh ini, kita hanya membuat komponen menggunakan `Vue.component`:

```js
Vue.component('nama-komponen-saya', {
  // ... pilihan ...
})
```

Komponen ini **teregistrasi secara global**. Itu berarti mereka dapat digunakan di dalam *template* dari semua *root Vue Instance* (`new Vue`) dibuat setelah diregistrasi. Sebagai contoh:

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

Ini bahkan berlaku kepada semua sub komponen, berarti tiga komponen tersebut juga tersedia _di dalam satu sama lain_.

## Registrasi Lokal

Registrasi global jarang menjadi ideal. Sebagai contoh, ketika Anda menggunakan *build system* seperti Webpack, meregistrasi global semua komponen berarti ketika Anda berhenti menggunakan sebuah komponen, itu juga masih termasuk di *final build* Anda. Ketidakperluan ini menambah banyak Javascript yang harus di unduh oleh pengguna Anda.

Pada kasus ini, Anda bisa menetapkan komponen Anda sebagai objek Javascript sederhana:

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

Lalu tetapkan komponen komponen yang akan Anda gunakan di opsi `komponen`

```js
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

Untuk setiap properti di dalam objek `components`, kuncinya akan menjadi nama dari elemen *custom*, ketika nilai akan berisi pilihan objek dari komponen tersebut.

Catat bahwa **komponen yang terdaftar secara lokal juga _tidak_ terdapat di dalam _sub komponen_**. Sebagai contoh, jika Anda ingin `Component A` terdapat di dalam `Component B`, Anda harus menggunakan:

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

Atau jika Anda menggunakan modul ES2015, seperti menggunakan Babel dan Webpack, itu akan lebih terlihat seperti:

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

Catat bahwa di ES2015+, menempatkan nama variabel seperti `ComponentA` di dalam *shorthand* objek untuk`ComponentA: ComponentA`, berarti nama dari kedua variabel adalah:

- nama elemen *custom* yang digunakan di *template*, dan
- nama dari variabel berisi pilihan komponen

## Sistem Modul

Ketika Anda tidak menggunakan sistem modul dengan `import`/`require`, Anda mungkin bisa melewati bagian ini untuk sekarang. Jika Anda menggunakanya, kita punya beberapa arahan spesial dan tips khusus untukmu.

### Registrasi Lokal di dalam Sistem Modul

Jika Anda masih disini, berarti sepertinya Anda menggunakan sistem modul, seperti Babel dan Webpack. Pada kasus ini, kita merekomendasi membuat sebuah direktori `komponen`, dengan setiap komponen memiliki filenya sendiri.

Lalu Anda harus memasukan setiap komponen yang akan Anda gunakan, sebelum Anda mendaftarkanya secara lokal. Sebagai contoh, di sebuah *hypothetical* `ComponentB.js` atau `ComponentB.vue` file:

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

Sekarang kedua `ComponentA` Dan `ComponentC` dapat digunakan di dalam *template* `ComponentB`.

### Registrasi Otomatis Global dari Komponen Dasar

Banyak dari komponen Anda akan generik secara relatif, mungkin hanya membungkus elemen seperti sebuah tombol atau *input*. Kita terkadang mengacu pada ini sebagai [komponen dasar](../style-guide/#Base-component-names-strongly-recommended) dan mereka cenderung sering digunakan di beberapa komponen Anda.

Hasilnya adalah banyak komponen mungkin memasukan daftar panjang dari komponen dasar:

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

Hanya untuk membantu sedikit *markup* yang sama di sebuah *template*:

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

Untungnya, jika Anda menggunakan Webpack (atau [Vue CLI 3+](https://github.com/vuejs/vue-cli), yang menggunakan Webpack di dalamnya), Anda bisa menggunakan `require.context` untuk mendaftarkan secara global komponen dasar yang paling umum. Berikut ini adalah contoh dari kode yang mungkin Anda gunakan secara global untuk memasukan komponen dasar di awalan file aplikasi milik Anda (contohnya `src/main.js`):

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )


  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
```

Harap diingat bahsaw **pendaftaran global harus terjadi sebelum _root instance Vue_ dibuat (dengan `new Vue`)**. [ Berikut contohnya](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js) dari pola ini di dalam konteks proyek sungguhan.
