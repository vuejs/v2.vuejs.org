---
title: Vue Instance
type: guide
order: 3
---

## Membuat *Vue Instance*

Setiap aplikasi Vue dimulai dengan membuat **Vue Instance** dengan fungsi `Vue` seperti berikut :

```js
var vm = new Vue({
  // pilihan
})
```

Meskipun tidak terkait ketat dengan [Pola MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), desain yang dimiliki Vue sebagian terinspirasi oleh konsep tersebut. Sebagai ketentuan, kita kadang menggunakan variabel `vm` ( kependekan dari ViewModel ) untuk mengacu pada *Vue Instance* kami.


Ketika Anda membuat *Vue Instance*, Anda mengirimkan **obyek pilihan**. Sebagian besar dari panduan ini menjelaskan bagaimana Anda bisa menggunakan pilihan ini untuk membuat tindakan yang Anda inginkan. Sebagai contoh, Anda juga bisa melihat lihat daftar lengkap dari pilihan ini di [Contoh API](../api/#Options-Data).


Sebuah aplikasi Vue terdiri dari ***instance* dasar Vue** yang dibuat dengan `new Vue`, secara opsional di atur ke dalam akar (root) *Vue Instance*, komponen yang bisa digunakan ulang. Sebagai contoh, komponen aplikasi pengingat mungkin terlihat seperti ini :


```
Root Instance
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

Kita akan membicarakan tentang [sistem komponen](components.html) pada detail selanjutnya. Sekarang, dengan hanya mengetahui bahwa semua komponen Vue juga adalah *Vue Instance*, dan juga menerima pilihan objek yang sama (kecuali untuk beberapa pilihan *tree of nested*).


## Data dan Metode

Ketika *Vue Instance* dibuat, ini menambah semua properti yang ditemukan di dalam objek `data` ke **sistem reaktif** milik Vue. Ketika nilai dari properti tersebut berubah, tampilanya akan "bereaksi", memperbarui untuk mencocokan dengan nilai yang baru.


```js
// Objek data kita
var data = { a: 1 }

// Objek ditambahkan kedalam Vue Instance
var vm = new Vue({
  data: data
})

// Mendapat properti dari instance
// lalu mengembalikan dari data asli
vm.a == data.a // => true

// Mengatur properti pada instance
// yang juga berdampak pada data asli
vm.a = 2
data.a // => 2

// ... dan kebalikanya
data.a = 3
vm.a // => 3
```

Ketika data ini berubah, tampilanya akan berubah. Itu harus dicatat bahwa properti di `data` adalah yang satu satunya **reaktif** jika mereka ada pada saat *instance* dibuat. Itu berarti kamu harus menambah properti baru, seperti:


```js
vm.b = 'halo'
```

Lalu mengubah ke `b` tidak akan memicu perubahan lain pada tampilan. Jika Anda mengetahui bahwa Anda memerlukan properti nanti, tapi ini dimulai dengan kosong atau tidak ada, Anda harus memberi beberapa nilai awal. Sebagai contoh:


```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

Satu satunya pengecualian untuk ini adalah menggunakan `Object.freeze()`, yang mencegah properti untuk diubah, yang juga berarti reaktifitas sistem yang tidak bisa _melacak_ perubahan.


```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- ini tidak akan lagi mengubah `foo`! -->
  <button v-on:click="foo = 'baz'">Change it</button>
</div>
```

Untuk tambahan ke data properti, *Vue Instance* menunjukan sejumlah properti *instance* dan metode yang berguna. Ini juga diawalai dengan `$` untuk membedakan mereka dari properti yang ditetapkan pengguna. Sebagai contoh:


```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch adalah metode instance
vm.$watch('a', function (newValue, oldValue) {
  // Panggilan balik (callback) ini akan di panggil ketika `vm.a` berubah
})
```

Selanjutnya, Anda bisa berkonsultasi ke [Referensi API](../api/#Instance-Properties) untuk daftar lengkap dari metode dan properti instance.


## Siklus Hidup Pengait (Lifecycle Hook) *instance*

Setiap *Vue Instance* melewati beberapa serangkaian langkan inisiasi pada saat dibuat - sebagai contoh, ini perlu diatur observasi data, memproses templat, memasang *instance* ke DOM, dan memperbarui DOM ketika data berubah. Sepanjang proses, ini juga berjalan dengan fungsi bernama **siklus hidup pengait (Lifecycle Hook)**, memberi pengguna kesempatan untuk menambah kode mereka sendiri pada tahapan tertentu.

Sebagai contoh, pengait [`created`](../api/#created) bisa digunakan untuk menjalankan kode setelah *instance* ini dibuat:

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` menunjuk ke poin instance vm
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

Ada juga pengait lain yang akan dipanggil pada tahapan berbeda di siklus hidup *instance*, seperti [`mounted`](../api/#mounted), [`updated`](../api/#updated), dan [`destroyed`](../api/#destroyed). Semua siklus hidup pengait (Lifecycle Hook) dipanggil dengan konteks `this` mereka yang menunjuk ke konteks *Vue Instance* yang menjalankanya.

<p class="tip">Jangan menggunakan [fungsi panah](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) pada pilihan properti atau pemanggilan ulang, seperti `created: () => console.log(this.a)` or `vm.$watch('a', newValue => this.myMethod())`. Sejak fungsi panah terikat dengan konteks induk, `this` tidak akan menjadi *Vue Instance* seperti yang Anda harapkan, kadang menyebabkan kesalahan seperti `Uncaught TypeError: Cannot read property of undefined` atau `Uncaught TypeError: this.myMethod is not a function`.</p>

## Diagram Siklus Hidup

Dibawah ini adalah diagram dari siklus hidup *instance*. Anda tidak perlu memahami dengan penuh apapun yang terjadi sekarang, tapi selama Anda belajar dan terus membuat, ini akan menjadi referensi yang berguna


![The *Vue Instance* Lifecycle](/images/lifecycle.png)
