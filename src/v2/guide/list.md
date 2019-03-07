---
title: Me-render Daftar
type: guide
order: 8
---

## Memetakan sebuah Array dengan Direktif `v-for`

Kita bisa menggunakan perintah 'v-for' untuk mengeluarkan elemen yang berada didalam sebuah array. Direktif `v-for` ini memerlukan sebuah sintaksis spesial yaitu `item in items`, dimana `items` berarti data awalnya yang berada di dalam array dan `item` ini adalah sebuah **alias** untuk elemen array yang ingin di keluarkan.

``` html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Hasil:

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.message}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-1'))
    }
  }
})
</script>
{% endraw %}

Di dalam direktif `v-for` kita bisa mengakses properti di induknya. Direktif `v-for` juga memiliki argumen kedua untuk menunjukkan indeks dari item sekarang.

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Hasil:

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-2'))
    }
  }
})
</script>
{% endraw %}

Anda juga bisa menggunakan `of` sebagai pembatas dibandingkan dengan `in`, jadi lebih mirip dengan sintaksis perulangan milik JavaScript.

``` html
<div v-for="item of items"></div>
```

## Menggunakan `v-for` pada sebuah Objek

Anda juga bisa menggunakan `v-for` untuk melakukan perulangan kedalam properti dari sebuah objek.

``` html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
```

Hasil:

{% raw %}
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

Anda bisa juga menyediakan argumen kedua untuk *`key`* nya:

``` html
<div v-for="(value, key) in object">
  {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key" class="demo">
  <div v-for="(value, key) in object">
    {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

Dan argumen lainnya untuk indeks:

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key-index" class="demo">
  <div v-for="(value, key, index) in object">
    {{ index }}. {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key-index',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

<p class="tip">Saat sedang melakukan perulangan pada sebuah objek, urutannya berdasarkan *`key`*, yang mana tidak dijamin akan konsisten pada saat diimplementasikan ke setiap mesin JavaScript.</p>

## *`key`*

Saat Vue melakukan update pada sekumpulan elemen yang dikeluarkan dari `v-for`, normalnya ia menggunakan "in-place patch" strategy. Jika urutan item di sekumpulan data berubah, daripada memindahkan elemen DOM untuk menyamakannya dengan urutan item dari data tersebut, Vue akan menambal setiap elemen pada tempatnya dan menyamakan dengan apa yang akan di keluarkan pada indeks tertentu. Ia memiliki sifat yang sama dengan `track-by="$index"` pada Vue 1.x.

Mode bawaan ini efisien, tapi hanya cocok **saat sekumpulan elemen yang dikeluarkan tidak bergantung pada state dari child component atau state sementara dari DOM (contohnya, nilai/value dari form input)**.

Untuk memberikan petunjuk pada Vue supaya ia bisa mengikuti jejak pada setiap elemen yang memiliki identitas, dan hingga elemen yang ada bisa digunakan kembali dan diurutkan, Anda harus menggunakan sebuah *`key`* yang unik sebagai atribut pada setiap elemen. Nilai / value yang disarankan untuk *`key`* harus id yang unik pada setiap elemen. Atribut spesial ini secara kasar setara dengan `track-by` di 1.x, tapi ia bekerja seperti sebuah atribut, jadi Anda perlu menggunakan `v-bind` untuk mengikatnya ke nilai yang dinamis (berikut ini sintaksis singkatnya):

``` html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

Direkomendasikan untuk menggunakan *`key`* saat menggunakan `v-for` jika memungkinkan, kecuali saat content yang dihasilkan dari perulangan sangat sederhana, atau Anda secara sengaja bergantung pada sifat bawaan supaya mendapatkan performa yang lebih baik.

Sejak ini adalah mekanisme yang umum untuk Vue mengenali elemen, *`key`* ini juga memiliki kegunaan yang lain yang tidak secara spesifik terikat di `v-for`, kita akan mempelajarinya nanti di panduan ini.

<p class="tip">Jangan menggunakan nilai non-primitif seperti objek dan array sebagai *`keys`* dari `v-for`. Lebih baik gunakan nilai String atau Numeric</p>

## Deteksi perubahan pada Array

### Methods/Function Perubahan

Vue membungkus pengamat pada methods perubahan milik Array jadi ia akan langsung menjalankan sebuah perubahan tampilan. Methods yang dibungkus antara lain:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Anda bisa membuka console dan bermain dengan contoh-contoh sebelumnya yaitu `items` pada array dengan memanggil methods/function perubahannya. Contohnya: `example1.items.push({ message: 'Baz' })`.

### Menggantikan sebuah Array

Methods perubahan, seperti namanya, merubah array yang memanggil methods ini. Jika dibandingkan, ada juga methods yang tidak melakukan perubahan, contohnya `filter()`, `concat()` dan `slice()`, yang mana tidak merubah array asalnya tetapi **selalu mengembalikan array baru**. Saat menggunakan methods yang tidak melakukan perubahan, Anda bisa menggantikan array lama dengan array yang baru:

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Anda mungkin berfikir kalau ini akan membuat Vue menghilangkan DOM yang telah ada dan mengulang pengeluaran(me-render ulang) sejumlah elemen, untungnya tidak seperti itu. Vue menciptakan mesin yang pintar yang bisa memaksimalkan penggunaan elemen DOM secara berulang, jadi mengganti sebuah array terhadap array yang lain yang berisi objek yang tumpang tindih akan menjadi sangat efisien.

### Peringatan

Karna ada batas di JavaScript sendiri, Vue **tidak bisa** mendeteksi perubahan berikut yang terjadi di array:

1. Saat Anda langsung menetapkan sebuah elemen dengan indeksnya, contohnya `vm.items[indexOfItem] = newValue`
2. Saat Anda mengubah panjang array itu sendiri, contohnya `vm.items.length = newLength`

Contohnya: 

``` js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // is NOT reactive
vm.items.length = 2 // is NOT reactive
```

Untuk mengatasi peringatan pertama, kedua kode dibawah akan menghasilkan sesuatu yang sama dengan `vm.items[indexOfItem] = newValue`, tetapi juga akan menjalankan perubahan state secara reaktif:

``` js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

Anda juga bisa menggunakan [`vm.$set`](https://vuejs.org/v2/api/#vm-set) methods dari instance, yang mana sebagai sebuah alias dari `Vue.set` yang global:

``` js
vm.$set(vm.items, indexOfItem, newValue)
```

Untuk mengatasi peringatan kedua, Anda cukup menggunakan `splice`:

``` js
vm.items.splice(newLength)
```

## Peringatan Mendeteksi Perubahan Objek

Lagi, karna batasan dari JavaScript yang modern, **Vue tidak bisa mendeteksi penambahan ataupun penghapusan sebuah properti**. Contohnya:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` is now reactive

vm.b = 2
// `vm.b` is NOT reactive
```

Vue tidak mengizinkan menambah sebuah properti yang reaktif pada root-level(Tingkat tertinggi) instance yang telah dibuat. Namun, mungkin saja menambah properti reaktif kedalam objek bersarang menggunakan method `Vue.set(object, key, value)`. Contonya:

``` js
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})
```

Anda bisa menambah sebuah properti `umur` baru kedalam objek bersarang `userProfile` dengan cara:

``` js
Vue.set(vm.userProfile, 'age', 27)
```

Anda bisa menggunakan perintah `vm.$set` methods dari instance, yang mana adalah sebuah alias dari `Vue.set` yang global:

``` js
vm.$set(vm.userProfile, 'age', 27)
```

Terkadang Anda mungkin ingin menetapkan beberapa properti baru berisi angka ke dalam objek yang telah ada, contohnya menggunakan perintah `Object.assign()` atau perintah `_.extend()`. Pada beberapa kasus, Anda harus membuat objek baru dengan properti dari kedua objek. Jadi daripada melakukan:

``` js
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

Anda harus membuat baru, properti yang reaktif dengan:

``` js
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

## Menampilkan Hasil yang sudah di Filter/di Urut

Terkadang kita ingin menampilkan sebuah array yang sudah di filter atau di urut tanpa mengubah data yang asli. Pada kasus ini, Anda bisa membuat sesuatu yang bernama computed properti yang mengembalikan array yang sudah di filter ataupun di urut.

Contohnya: 

``` html
<li v-for="n in evenNumbers">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

Pada situasi dimana computed properties tidak layak digunakan (contohnya didalam perulangan bersarang milik `v-for`), Anda bisa menggunakan methods ini:

``` html
<li v-for="n in even(numbers)">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

## Menggunakan `v-for` dengan sebuah Range

`v-for` bisa juga mengambil sebuah angka. pada kasus ini ia akan mengulangi elemen itu sesuai angka yang ditentukan.

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

Hasil:

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
  new Vue({ el: '#range' })
</script>
{% endraw %}

## Menggunakan `v-for` pada sebuah `<template>`

Hampir sama dengan `v-if`, Anda juga bisa menggunakan `v-for` pada tag `<template>` untuk mengeluarkan sejumlah elemen. Contohnya

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## Menggunakan `v-for` dengan `v-if`

<p class="tip">Ketahuilah bahwa **tidak** direkomendasikan untuk menggunakan `v-if` dan `v-for` secara bersamaan. Ini bisa di lihat pada [style guide](/v2/style-guide/#Avoid-v-if-with-v-for-essential)</p>

Pada saat mereka ada dalam elemen yang sama, `v-for` memiliki prioritas yang lebih tinggi daripada `v-if`. Yang mana artinya `v-if` akan dijalankan pada setiap perulangan secara terpisah. Ini bisa berguna saat Anda hanya ingin mengeluarkan beberapa elemen saja, seperti ini:

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

Yang diatas ini hanya mengeluarkan todos yang belum selesai.

Jika sebaliknya, keinginanmu adalah untuk menghentikan perulangan secara bersyarat, Anda bisa meletakkan `v-if` pada pembungkus elemen (atau [`<template>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt)). Contohnya:

``` html
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>No todos left!</p>
```

## Menggunakan `v-for` pada sebuah Component

> Bagian ini diharuskan memahami [Components](components.html). Boleh melewatinya terlebih dahulu dan kembali lagi nanti.

Anda bisa langsung menggunakan `v-for` pada sebuah component yang Anda buat, sama seperti elemen lainnya:

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> Pada versi 2.2.0+, saat menggunakan `v-for` dengan sebuah component, sebuah [`key`](list.html#key) sekarang di haruskan ada.

Namun, ia tidak mengirimkan data secara otomatis ke component itu, karna componentnya memiliki lingkup mereka sendiri. Jika ingin mengirimkan data hasil perulangan kedalam component, kita harus menggunakan props:

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

Alasan untuk tidak langsung memasukkan `item` kedalam component karna itu membuat component tergabung dengan bagaimana `v-for` bekerja. Sedikit lebih jelas untuk dari mana datangnya data membuat component bisa digunakan berkali-kali pada situasi yang lain.

Ada beberapa contoh dari aplikasi sederhana todo list:

``` html
<div id="todo-list-example">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Tambahkan sebuah todo</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="Makan Ayam"
    >
    <button>Tambah</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

<p class="tip">Ketahuilah bahwa atribut `is="todo-item"`. Ini lumayan penting di dalam template DOM, karna hanya sebuah elemen `<li>` itu sah-sah saja didalam elemen `<ul>`. Ia melakukan hal yang sama seperti `<todo-item>`, tapi bisa berpotensi menyebabkan browser mengeluarkan error. Lihat pada [DOM Template Parsing Caveats](components.html#DOM-Template-Parsing-Caveats) untuk mempelajari lebih lanjut</p>

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Do the dishes',
      },
      {
        id: 2,
        title: 'Take out the trash',
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Tambahkan sebuah todo</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="Contohnya: Makan Ayam"
    >
    <button>Tambah</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Do the dishes',
      },
      {
        id: 2,
        title: 'Take out the trash',
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}
