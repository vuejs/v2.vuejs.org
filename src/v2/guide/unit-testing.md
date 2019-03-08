---
title: Unit Testing
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/) memiliki opsi bawaan untuk melakukan *unit testing* menggunakan [Jest](https://github.com/facebook/jest) atau [Mocha](https://mochajs.org/) yang bisa berjalan tanpa penyetelan tambahan. Kami juga memiliki pustaka resmi [Vue Test Utils](https://vue-test-utils.vuejs.org/) yang menyediakan tuntunan lebih detail untuk setelan kustom.


## Pengujian (*Assertion*) Sederhana

Anda tidak perlu melakukan hal khusus untuk membuat komponen-komponen Anda bisa dites (*testable*). Cukup expor opsi sebagai berikut:

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```

Kemudian impor opsi dari komponen tersebut bersama dengan Vue, dan Anda dapat membuat banyak *assertion* umum (disini kita menggunakan gaya Jasmine/Jest `expect` *assertion* sebagai contoh)


``` js
// Impor vue dan komponen yang akan dites
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Berikut adalah Jasmine 2.0 tests, Anda bisa
// menggunakan test runner / pustaka assertion apa pun yang Anda sukai
describe('MyComponent', () => {

  // Periksa komponen raw options 
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // Evaluasi hasil dari beberapa fungsi di
  // komponen raw options
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // Periksa instance dari komponen saat mount
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // Mount sebuah instance dan periksa hasil render
  it('renders the correct message', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Menulis Komponen yang Dapat Dites

Hasil *render* dari sebuah komponen secara utama ditentukan oleh props yang diterima komponen tersebut. Jika hasil *render* dari sebuah komponen hanya bergantung pada props; maka akan mudah untuk mengetesnya, mirip dengan melakukan assertion pada fungsi yang memiliki bermacam-macam argumen. Berikut contoh sederhana:

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

Anda bisa melakukan assertion pada hasil *render* dengan properti yang berbeda-beda menggunakan opsi `propsData`:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// fungsi helper / pembantu yang menjalankan mounts kemudian mengembalikan teks yang di-render
function getRenderedText (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('renders correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

## Melakukan Pengujian/*Assertion* pada Pembaruan Asynchronous

Karena Vue [melakukan pembaruan pada DOM secara asynchronous](reactivity.html#Async-Update-Queue), *assertion* pada *update* DOM yang disebabkan oleh perubahan *state* harus dilakukan dalam callback `Vue.nextTick`:

``` js

// Periksa HTML yang dihasilkan setelah perubahan state
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // Tunggu satu "tick" setelah perubahan state sebelum menguji DOM yang terupdate
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

Untuk informasi yang lebih mendalam untuk *unit testing* di Vue, kunjungi [Vue Test Utils](https://vue-test-utils.vuejs.org/) dan *buku panduan* kami tentang [unit testing vue components](https://vuejs.org/v2/cookbook/unit-testing-vue-components.html)