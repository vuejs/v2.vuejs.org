---
title: Mixins
type: guide
order: 301
---

## Penjelasan Dasar

Mixins adalah sebuah cara yang fleksibel untuk mendistribusikan beberapa fungsi yang bisa dipakai di semua komponen Vue. Object pada mixin bisa berisi beberapa opsi di komponen. Ketika sebuah komponen menggunakan mixin, maka semua opsi yang ada di dalam mixin akan di "mix" (digabungkan) dengan opsi komponen itu sendiri.

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/next-level-vue/mixins" target="_blank" rel="noopener" title="Mixins Tutorial">Tonton video penjelasannya di Vue Mastery</a></div>

Contoh:

``` js
// mendefinisikan object mixin
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hai, ini mixin!')
    }
  }
}

// definisikan sebuah komponen yang menggunakan mixin
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hai, ini mixin!"
```

## Opsi Penggabungan

Ketika mixin dan komponen berisi opsi yang saling tumpang tindih, maka mereka berdua akan digabungkan menggunakan strategi yang tepat.

Sebagai contoh, data object mengalami penggabungan rekursif, maka data pada komponen yang akan diterapkan karena memiliki prioritas yang lebih utama ketika terjadi nya konflik.

``` js
var mixin = {
  data: function () {
    return {
      message: 'hai',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'bye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "bye", foo: "abc", bar: "def" }
  }
})
```

Hook functions dengan nama yang sama akan digabungkan kedalam array, sehingga semua nya bisa dipanggil. Mixin hook akan dipanggil terlebih dahulu sebelum hook milik komponen itu sendiri.

``` js
var mixin = {
  created: function () {
    console.log('ini mixin hook')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('ini component hook')
  }
})

// => "ini mixin hook"
// => "ini component hook"
```

Opsi pada object khusus, contoh nya `methods`, `components` dan `directives` akan digabungkan kedalam object yang sama. Opsi pada komponen akan lebih diutamakan / di prioritaskan ketika terjadi fungsi yang mengalami konflik pada object nya :

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('dari mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('dari komponen')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "dari komponen"
```

Catatan : Strategi penggabungan yang sama telah digunakan di `Vue.extend()`.

## Global Mixin

Anda juga bisa menerapkan mixin secara global. Gunakan dengan hati hati!! Setelah anda menerapkan mixin secara global, ia akan mempengaruhi **setiap** vue instance yang dibuat setelahnya. Jika digunakan secara tepat, mixin ini bisa digunakan untuk menyuntikkan logika pemrosesan pada opsi khusus :

``` js
// inject a handler for `myOption` custom option
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

<p class="tip">Jangan sering sering menggunakan global mixins dan gunakanlah secara hati hati, karena ia bisa mempengaruhi setiap vue instance yang telah dibuat, demikian juga dengan komponen pihak ketiga. Di kebanyakan kasus, Anda hanya boleh menggunakannya untuk menangani opsi khusus seperti yang sudah dicontohkan diatas. Selain itu, mixin ini lebih baik digunakan sebagai [Plugins](plugins.html) untuk menghindari duplikasi pada aplikasi.</p>

## Strategi Penggabungan pada Opsi Khusus

Ketika opsi khusus telah digabungkan, mereka menggunakan strategi default yang akan menimpa nilai yang sudah ada. Jika anda ingin opsi khusus tadi digabungkan menggunakan logika khusus, maka anda harus melampirkan function ke `Vue.config.optionMergeStrategies`:

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

Untuk sebagian besar opsi yang berbasis object, Anda bisa menggunakan strategi yang sama seperti yang telah dipakai oleh `methods` :

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

Contoh lainnya yang lebih lengkap bisa kalian temukan di [Vuex](https://github.com/vuejs/vuex)'s 1.x strategi penggabungan:

``` js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
  if (!toVal) return fromVal
  if (!fromVal) return toVal
  return {
    getters: merge(toVal.getters, fromVal.getters),
    state: merge(toVal.state, fromVal.state),
    actions: merge(toVal.actions, fromVal.actions)
  }
}
```
