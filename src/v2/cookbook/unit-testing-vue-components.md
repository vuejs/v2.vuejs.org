---
title: Unit Tes Komponen Vue
type: cookbook
order: 6
---

## Contoh Dasar

Unit testing merupakan bagian dasar dalam pengembangan perangkat lunak. Unit tests menjalankan unit terkecil pada sebuah kode dalam kondisi terisolasi, bertujuan untuk meningkatkan kemudahan di dalam penambahan fitur-fitur baru dan melacak _bug_. [Single-file components](../guide/single-file-components.html) Vue memudahkan untuk menulis unit tests komponen dalam kondisi terisolasi. Hal ini membuat anda percaya diri dalam mengembangakan fitur-fitur baru tanpa menggangu kode yang ada dan membantu pengembang lainnya memahami apa yang komponen anda lakukan.

Ini contoh tes sederhana apakah beberapa text di-_render_:

```html
<template>
  <div>
    <input v-model="username">
    <div 
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
        ? 'Please enter a longer username'
        : ''
    }
  }
}
</script>
```

```js
import { shallowMount } from '@vue/test-utils'
import Hello from './Hello.vue'

test('Hello', () => {
  // render the component
  const wrapper = shallowMount(Hello)

  // should not allow for `username` less than 7 characters, excludes whitespace
  wrapper.setData({ username: ' '.repeat(7) })

  // assert the error is rendered
  expect(wrapper.find('.error').exists()).toBe(true)

  // update the name to be long enough
  wrapper.setData({ username: 'Lachlan' })

  // assert the error has gone away
  expect(wrapper.find('.error').exists()).toBe(false)
})
```

Cuplikan kode diatas menunjukan bagaimana melakukan tes apakah pesan galat di-_render_ berdasarkan panjang dari username. Itu menampilkan ide umum dari unit tes pada komponen Vue: me-_render_ komponen dan menegaskan bahwa markup cocok dengan kondisi komponen.

## Kenapa melakukan tes?

Komponen unit test memiliki banyak keuntungan:

- Menyediakan dokumentasi bagaimana perilaku komponen seharusnya
- Menghemat waktu terhadap test secara manual
- Mengurangi _bug_ pada fitur-fitur baru
- Meningkatkan rancangan
- Memfasilitasi refaktor kode

Tes terautomasi mengizinkan tim pengembang memelihara basis kode yang komplek.

#### Panduan memulai

[Vue Test Utils](https://github.com/vuejs/vue-test-utils) merupakan _library_ resmi untuk unit tes pada komponen Vue. [Vue-cli](https://github.com/vuejs/vue-cli) `webpack` templat hadir baik dengan Karma atau Jest, keduanya mendukung _test runners_ dan ada beberapa [panduan](https://vue-test-utils.vuejs.org/guides/) pada dokumentasi Utilitas Vue Tes.

## Contoh Nyata 

Unit tes seharusnya:

- Cepat saat dijalankan
- Mudah dipahami
- Hanya melakukan tes _single unit of work_

Mari kita lanjutkan pengembangan pada contoh sebelumnya, disamping memperkenalkan ide dari <a href="https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)">factory function</a> untuk membuat tes kita lebih tersusun rapat dan mudah dibaca. Komponen tersebut seharusnya:

- Menampilkan salam 'Welcome to the Vue.js cookbook'.
- Meminta pengguna memasukan username mereka.
- Menampilkan sebuah pesan galat jika username yang dimasukkan kurang dari tujuh kata.

Mari kita lihat kode komponen dibawah:

```html
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
    Enter your username: <input v-model="username">
    <div 
      v-if="error"
      class="error"
    >
      Please enter a username with at least seven letters.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Foo',

  data () {
    return {
      message: 'Welcome to the Vue.js cookbook',
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
    }
  }
}
</script>
```

Hal-hal yang seharusnya kita tes adalah:

- Apakah variabel message di-_render_?
- Jika `error` bernilai `true`, `<div class="error">` harusnya muncul
- Jika `error` bernilai `false`, `<div class="error">` harusnya tidak muncul

Dan percobaan pertama pada tes:

```js
import { shallowMount } from '@vue/test-utils'
import Foo from './Foo.vue'

describe('Foo', () => {
  it('renders a message and responds correctly to user input', () => {
    const wrapper = shallowMount(Foo, {
      data: {
        message: 'Hello World',
        username: ''
      }
    })

    // see if the message renders
    expect(wrapper.find('.message').text()).toEqual('Hello World')

    // assert the error is rendered
    expect(wrapper.find('.error').exists()).toBeTruthy()

    // update the `username` and assert error is no longer rendered
    wrapper.setData({ username: 'Lachlan' })
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

Ada beberapa masalah dengan code di atas:

- Sebuah tes tunggal membuat _assertions_ tentang banyak hal berbeda
- Sulit menunjukkan perbedaan kondisi komponen yang dapat masuk serta apa yang seharusnya di-_render_

Contoh di bawah ini memperbaiki tes dengan cara:

- Hanya membuat satu _assertion_ tiap blok `it`
- Memiliki deskripsi tes yang singkat dan jelas
- Menyediakan hanya data minimal yang diperlukan untuk tes
- Merefaktor logika ganda (membuat  `wrapper` dan menata variabel `username`) kedalam _factory function_

*tes terbaru*:
```js
import { shallowMount } from '@vue/test-utils'
import Foo from './Foo'

const factory = (values = {}) => {
  return shallowMount(Foo, {
    data: { ...values  }
  })
}

describe('Foo', () => {
  it('renders a welcome message', () => {
    const wrapper = factory()

    expect(wrapper.find('.message').text()).toEqual("Welcome to the Vue.js cookbook")
  })

  it('renders an error when username is less than 7 characters', () => {
    const wrapper = factory({ username: ''  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('renders an error when username is whitespace', () => {
    const wrapper = factory({ username: ' '.repeat(7) })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('does not render an error when username is 7 characters or more', () => {
    const wrapper = factory({ username: 'Lachlan'  })

    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

poin-poin catatan:

Pada contoh di atas, kita mendeklarasikan factory function yang mengabungkan objek `values` ke dalam `data` dan mengembalikan `wrapper` _instance_ baru. Dengan cara ini, kita tidak perlu menduplikasi `const wrapper = shallowMount(Foo)` pada tiap tes. Keuntungan besar lainnya ialah saat komplek komponen dengan metode atau _computed property_ yang ingin Anda _mock_ atau _stub_ dalam tiap tes, Anda hanya perlu mendeklarasikannya satu kali.

## Konteks Tambahan

Tes di atas cukup sederhana, namun dalam parkteknya komponen Vue sering memiliki perilaku berbeda yang ingin Anda tes, seperti:

- Membuat pemanggilang API
- _Committing_ atau _dispatching mutations_ atau _actions_ dengan `Vuex` store
- Tes interaksi

Ada contoh lebih lengkap yang menampilkan tes tersebut dalam Utilitas Vue Tes [panduan](https://vue-test-utils.vuejs.org/guides/).

Utilitas Vue Tes dan ekosistem JavaScript yang sangat besar menyediakan banyak perkakas untuk memfasilitasi hampir 100% cakupan tes. Bagaimanapun Unit tes hanya merupakan salah satu bagian dari piramida tes. Beberapa tipe tes lainnya mencakup e2e (end to end) tes, dan _snapshot_ tes. Unit tes merupakan test paling kecil dan paling simpel - Unit tes membuat _assertions_ di dalam unit terkecil pada kerja kode, mengisolasi tiap bagian komponen tunggal.

_Snapshot_ tes menyimpan markup dari komponen Vue Anda, dan membandingkan dengan yang baru dibuat tiap tes dijalankan. Jika sesuatu berubah, pengembang diinformasikan, dan dapat memutuskan jika perubahan memang diperlukan (komponen diperbarui) atau secara sengaja (komponen berperilaku tidak semestinya).

End to end tes memastikan beberapa komponen berinteraksi dengan semestinya secara bersama-sama. End to end tes merupakan tingkat yang lebih tinggi. Beberapa contoh mungkin melakukan tes apakah pengguna dapat _sign up_, _login_, dan memperbarui username mereka. Hal itu lebih lambat dijalankan daripada unit tes atau _snapshot_ tes.

Unit tes merupakan yang paling berguna saat pengembangan, baik membantu pengembang berfikit bagaimana merancang komponen atau merefaktor komponen yang ada, dan sering dijalankan setiap terdapat perubahan kode.

Tes dengan tingkat yang lebih tinggi, seperti end to end tes, berjalan lebih lambat. Hal ini biasanya berjalan saat _pre-deploy_ untuk memastikan tiap bagian dari sistem berkerja dengan semestinya bersama-sama.

Informasi lebih lanjut tentang tes komponen Vue dapat ditemukan pada [Tes Aplikasi Vue.js](https://www.manning.com/books/testing-vuejs-applications) dibuat oleh anggota tim inti [Edd Yerburgh](https://eddyerburgh.me/).

## Kapan Menghidari Pola ini

Unit tes merupakan bagian penting dari aplikasi serius. Awalnya, saat visi aplikasi tidak jelas, unit tes mungkin saja meperlambat pengembangan, namun sekali visi dibangun dan pengguna nyata akan berinteraksi dengan aplikasi tersebut, unit tes (dan tipe automasi tes lainnya) sangatlah penting untuk memastikan basis kode terpelihara dan _scalable_.
