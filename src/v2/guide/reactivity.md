---
title: Reaktivitas Secara Mendalam
type: guide
order: 601
---

Sakarang waktunya untuk pemahaman secara mendalam! Salah satu fitur pembeda Vue adalah sistem reaktivitas yang tidak menyulitkan. Model hanyalah objek JavaScript biasa. Saat Anda memodifikasinya, tampilan diperbarui. Itu membuat manajemen *state* menjadi sederhana dan intuitif, tetapi juga penting untuk memahami cara kerjanya untuk menghindari beberapa kesalahan umum. Pada bagian ini, kita akan menggali beberapa detail sistem reaktivitas Vue pada tingkat yang lebih rendah.

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/advanced-components/build-a-reactivity-system" target="_blank" rel="noopener" title="Vue Reactivity">Tonton video penjelasan tentang Vue Mastery</a></div>

## Bagaimana Perubahan Dilacak

Saat Anda mengoper objek JavaScript biasa ke *instance* Vue sebagai opsi `data`, Vue akan menelusuri semua propertinya dan mengonversinya menjadi [*getter/setters*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Defining_getters_and_setters) menggunakan [*Object.defineProperty*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Ini adalah fitur ES5 dan *un-shimmable*, itulah sebabnya Vue tidak mendukung IE8 dan di bawahnya.

*Getter/setters* tidak terlihat oleh pengguna, tapi memungkinkan Vue untuk melakukan pelacakan *dependency* dan pemberitahuan perubahan saat properti diakses atau diubah. Satu kekurangannya adalah bahwa format *getter/setters* konsol peramban berbeda ketika objek data yang dikonversi dicatat, jadi Anda mungkin ingin memasang [*vue-devtools*](https://github.com/vuejs/vue-devtools) untuk antarmuka yang lebih ramah inspeksi.

Setiap *instance* komponen memiliki **pengamat** yang terhubung, yang merekam properti apa pun yang "disentuh" selama komponen di-*render* sebagai *dependencies*. Kemudian ketika *setter dependencies* dipicu, ia memberi tahu pengamat, yang pada gilirannya menyebabkan komponen untuk me-*render* ulang.


![Siklus Reaktivitas](/images/data.png)

## Kekurangan Deteksi Pengubahan

Karena keterbatasan JavaScript modern (dan ditinggalkannya `Object.observe`), Vue **tidak dapat mendeteksi penambahan atau penghapusan properti**. Karena Vue melakukan proses konversi *getter/setter* selama inisialisasi *instance*, properti harus ada di objek `data` agar Vue dapat mengonversinya dan membuatnya reaktif. Sebagain contoh:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` sekarang reaktif

vm.b = 2
// `vm.b` TIDAK reaktif
```

Vue tidak mengizinkan penambahkan properti reaktif yang baru secara dinamis pada tingkat *root* ke *instance* yang sudah dibuat. Namun, dimungkinkan untuk menambahkan properti reaktif ke objek bersarang menggunakan metode `Vue.set(object, key, value)` 

``` js
Vue.set(vm.someObject, 'b', 2)
```

Anda juga dapat menggunakan metode instance `vm. $ Set`, yang merupakan alias untuk global` Vue.set`:

``` js
this.$set(this.someObject, 'b', 2)
```

Terkadang Anda mungkin ingin menetapkan sejumlah properti ke objek yang ada, sebagai contoh menggunakan `Object.assign()` atau `_.extend()`. Namun, properti baru yang ditambahkan ke objek tidak akan memicu perubahan. Dalam kasus seperti itu, buat objek baru dengan properti dari objek asli dan objek baru:

``` js
// dari pada `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

Ada juga beberapa kekurangan terkait *array*, yang telah dibahas sebelumnya di [daftar bagian *rendering*](list.html#Caveats).

## Deklarasi Properti Reaktif

Karena Vue tidak memungkinkan menambahkan properti reaktif tingkat *root* secara dinamis, Anda harus menginisialisasi *instance* Vue dengan mendeklarasikan semua properti data reaktif tingkat *root* terlebih dahulu, bahkan dengan nilai kosong:

``` js
var vm = new Vue({
  data: {
    // deklarasi `message` dengan nilai kosong
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// set `message` nanti
vm.message = 'Hello!'
```

Jika Anda tidak mendeklarasikan `message` dalam opsi data, Vue akan memperingatkan Anda bahwa fungsi *render* sedang mencoba mengakses properti yang tidak ada.

Ada alasan teknis di balik pembatasan ini - yaitu menghilangkan kelompok kasus khusus dalam sistem pelacakan-*dependency*, dan juga membuat *instance* Vue lebih baik dengan sistem pengecekan tipe. Tapi ada juga pertimbangan penting dalam hal pemeliharaan kode: objek `data` seperti skema untuk *state* komponen Anda. Mendeklarasikan semua properti reaktif terlebih dahulu membuat kode komponen lebih mudah dipahami ketika ditinjau kembali nanti atau dibaca oleh pengembang lain.

## Pembaruan Antrian Async

Jika Anda belum menyadarinya, Vue melakukan pembaruan DOM **asynchronously**. Setiap kali perubahan data diamati, akan membuka antrian dan *buffer* semua perubahan data yang terjadi di *event loop* yang sama. Jika pengamat yang sama dipicu beberapa kali, akan dimasukan ke antrian hanya sekali. Menghilangkan duplikasi *buffered* ini penting dalam menghindari perhitungan yang tidak perlu dan manipulasi DOM. Kemudian pada *"tick"* *event loop* berikutnya, Vue membersihkan antrian dan melakukan pekerjaan yang sebenarnya (duplikasi sudah dihilangkan). Vue secara internal mencoba `Promise.then` dan` MessageChannel` bawaan untuk antrian yang *asynchronous* dan kembali ke `setTimeout (fn, 0)` jika peramban belum mendukung.

Sebagai contoh, ketika Anda menetapkan `vm.someData = 'new value'`, komponen tidak akan segera me-*render* ulang. komponen akan memperbarui dalam *"tick"* berikutnya, ketika antrian dibersihkan. Pada umumnya kita tidak perlu peduli tentang ini, tetapi bisa rumit ketika Anda ingin melakukan sesuatu yang tergantung pada *state* DOM pasca pembaruan. Meskipun Vue.js umumnya mendorong pengembang untuk berpikir dengan cara *"data-driven"* dan menghindari menyentuh DOM secara langsung, kadang-kadang mungkin perlu Anda perlu untuk melakukannya. Untuk menunggu sampai Vue.js selesai memperbarui DOM setelah perubahan data, Anda bisa menggunakan `Vue.nextTick(callback)` segera setelah data diubah. Callback akan dipanggil setelah DOM diperbarui. Sebagai contoh:

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // ubah data
vm.$el.textContent === 'new message' // salah
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // benar
})
```

Ada juga metode *instance* `vm. $ NextTick ()`, yang sangat berguna di dalam komponen, karena tidak memerlukan *global* `Vue` dan konteks `this` pada *callback* akan secara otomatis *bound* ke *instance* Vue saat ini:

``` js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: 'not updated'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'tidak diperbarui'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'diperbarui'
      })
    }
  }
})
```

Sejak nilai kembalian dari `$nextTick()` adalah *promise*, Anda dapat mencapai hal yang sama diatas dengan sintaksis [ES2016 async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax: yang baru

``` js
  methods: {
    updateMessage: async function () {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'tidak diperbaharui'
      await this.$nextTick()
      console.log(this.$el.textContent) // => 'diperbarui'
    }
  }
```
