---
title: Properti Penghitung (Computed) dan Pengamat (Watchers)
type: guide
order: 5
---

## Properti Penghitung 

Pernyataan *In-template* sangatlah mudah, tapi hal tersebut dibuat untuk operasi yang sederhana. Memberikan terlalu banyak logika di *template* anda dapat menyebabkan menjadi berat dan susah untuk dipelihara. Sebagai Contoh :


``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

Pada poin ini, *template* tidak lagi sederhana dan deklaratif. Anda harus melihat itu untuk beberapa saat sebelum menyadari bahwa itu menampilkan *`message`* secara terbalik. Masalahnya diperburuk ketika anda ingin memasukan pesan terbalik itu kedalam *template* anda lebih dari sekali.

Itulah mengapa untuk logika yang kompleks, Anda harus menggunakan **properti penghitung**.

### Contoh Sederhana

``` html
<div id="example">
  <p>Pesan Asli: "{{ message }}"</p>
  <p>Pesan terbalik yang dihitung: "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hai'
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` mengarah ke instance vm
      return this.message.split('').reverse().join('')
    }
  }
})
```

Hasil:

{% raw %}
<div id="example" class="demo">
  <p>Pesan Asli: "{{ message }}"</p>
  <p>Pesan terbalik yang dihitung: "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hai'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Disini kita telah mendeklarasi properti penghitung `reversedMessage`. Fungsi yang kita sediakan akan digunakan sebagai fungsi *getter* untuk properti `vm.reversedMessage`:

``` js
console.log(vm.reversedMessage) // => 'iaH'
vm.message = 'Dah'
console.log(vm.reversedMessage) // => 'haD'
```

Anda dapat membuka konsol *(console)* dan bermain dengan contoh vm sendirian. Nilai dari `vm.reversedMessage` selalu tergantung dengan nilai `vm.message`.

Anda bisa melakukan *data-bind* ke properti penghitung di *template* seperti properti normal. Vue sadar bahwa `vm.reversedMessage` tergantung dengan `vm.message`, jadi itu akan merubah semua yang terkait dengan `vm.reversedMessage` ketika `vm.message` berubah. Dan bagian terbaiknya adalah kita telah membuat hubungan *dependency* secara deklaratif : penghitung fungsi *getter* tidak mempunyai efek samping, yang membuat itu menjadi lebih mudah untuk dicoba dan dipahami.

### Penyimpanan Penghitung (Computed Cache) vs Metode

Anda mungkin telah mengerti kita dapat membuat hasil yang sama dengan cara menjalankan metode ini dalam *expression*:

``` html
<p>Pesan terbalik: "{{ reverseMessage() }}"</p>
```

``` js
// dalam komponen
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

Selain properti penghitung, kita dapat menetapkan fungsi yang sama sebagai metode. Untuk hasil akhirnya, dua pendekatan memang sama persis. Tetapi, perbedaanya adalah **properti penghitung** di simpan berdasarkan *dependencies* mereka.** Sebuah properti penghitung hanya akan mengevaluasi ulang ketika salah satu *dependencies* mereka telah berubah. Ini berarti selama `message` belum berubah, semua akses ke `reversedMessage` properti penghitung akan langsung kembali ke hasil penghitungan sebelumnya tanpa harus menjalankan ulang fungsi tersebut

Ini juga berarti properti penghitung dibawah tidak akan pernah berubah, karena `Date.now()` bukan *dependency* reaktif:

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

Sebagai perbandingan, sebuah pemanggilan metode akan **selalu** menjalankan fungsi kapanpun ketika sebuah render ulang terjadi.

Kenapa kita membutuhkan penyimpanan *(caching)* ? Bayangkan kita mempunyai sebuah *expensive computed property* bernama **A**, yang membutuhkan pengulangan melewati *Array* yang besar dan mengerjakan banyak perhitungan. Lalu kita mungkin mempunyai properti penghitung lainya yang tergantung dari **A**. Tanpa penyimpanan *(caching)*, kita mungkin akan menjalankan *getter* milik **A** lebih dari yang dibutuhkan! Ketika anda tidak butuh penyimpanan *(caching)*, gunakan metode sebagi gantinya.

### Properti Penghitung vs Properti Pengawas

Vue juga menyediakan banyak cara umum untuk mengamati dan beraksi kepada perubahan data pada sebuah *instance* Vue: **Properti Pengawas *(Watch Properties)***. Ketika anda mempunyai beberapa data yang perlu dirubah berdasarkan data lainya, dan sudah terlalu banyak menggunakan `watch` - khususunya jika anda datang dari latar belakang AngularJS. Namun, terkadang ide yang lebih baik adalah untuk menggunakan  properti penghitung daripada sebuah perintah *callback* `watch`. Pertimbangkan contoh ini:

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

Kode diatas sangat berulang ulang. Bandingkan itu dengan versi properti penghitung:

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

Lebih baik, bukan ?

### Computed Setter

Properti penghitung pada dasarnya adalah hanya-*getter*, tapi anda juga bisa menyediakan sebuah *setter* ketika anda membutuhkanya:

``` js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Sekarang ketika anda menjalankan `vm.fullName = 'John Doe'`, Sebuah *setter* akan dijalankan dan `vm.firstName` dan `vm.lastName` akan di ubah secara teratur.

## Pengawas (Watcher)

Ketika properti pengihitung sangat teratur dalam beberapa kasus, ada kalanya sebuah *watcher* kustom dibutuhkan. Itulah kenapa Vue memberikan cara yang lebih umum untuk bereaksi pada saat data berubah melalui pilihan `watch`. Ini sangat berguna ketika anda ingin melakukan operasi *asynchronous* atau operasi *expensive* sebagai balasan perubahan data.


Sebagai Contoh:

``` html
<div id="watch-example">
  <p>
    Tanyakan pertanyaan iya/tidak:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Sejak adanya ekosistem yang kaya dari library ajax -->
<!-- dan koleksi dari metode pembantu untuk tujuan umum, Inti dari Vue -->
<!-- masih dapat untuk tetap kecil dengan tidak memasukan mereka kembali. Ini juga -->
<!-- memberikan anda kebabasan untuk memakai apa yang sudah biasa anda gunakan. -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Saya tidak dapat memberikan jawaban sampai anda bertanya kepada saya!'
  },
  watch: {
    // whenever question changes, this function will run
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    // _.debounce adalah fungsi yang disediakan oleh lodash untuk membatasi caranya
    // sering kali operasi expensive bisa dijalankan.
    // Dalam hal ini, kami ingin membatasi seberapa sering kami mengakses
    // yesno.wtf/api, menunggu hingga pengguna sepenuhnya
    // selesai mengetik sebelum membuat permintaan ajax. Untuk mempelajari
    // lebih lanjut tentang fungsi _.debounce (dan sepupunya
    // _.rottle), kunjungi: https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer:  function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Pertanyaan biasanya berisi tanda tanya. ;-)'
        return
      }
      this.answer = 'Berfikir...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'Error! Tidak dapat meraih API. ' + error
        })
    }
  }
})
</script>
```

Hasil:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Tanyakan pertanyaan iya/tidak:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Saya tidak dapat memberikan jawaban sampai anda bertanya kepada saya!'
  },
  watch: {
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Menunggu anda untuk berhenti mengetik...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer:  function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Pertanyaan biasanya berisi tanda tanya. ;-)'
        return
      }
      this.answer = 'Thinking...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'Error! Tidak dapat meraih API. ' + error
        })
    }
  }
})
</script>
{% endraw %}

Pada kasus ini, menggunakan pilihan `watch` memungkinkan kita untuk melakukan operasi *asynchronous* (Mengakses API), batasi seberapa sering kita melakukan operasi itu, dan atur status sementara hingga kita mendapatkan jawaban akhir. Semua itu tidak mungkin dilakukan dengan properti yang dihitung.

Sebagai tambahan untuk pilihan `watch`, anda juga bisa menggunakan *imperative* [vm.$watch API](../api/#vm-watch).
