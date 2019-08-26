title: Migrasi dari Vue 1.x
type: guide
order: 701
---

## FAQ

> Woah - halaman ini sangat panjang! Apakah ini berarti 2.0 benar-benar beda, Saya harus mempelajari semua dasarnya dari awal lagi, dan migrasi tidak mungkin dilakukan?

Saya senang Anda bertanya! Jawabannya adalah tidak. Sekitar 90% API masih sama dan konsep inti tidaklah berubah. Halaman ini panjang karena kami ingin memberikan penjelasan yang sangat mendetil dan berisikan banyak contoh-contoh. Tenanglah, __ini bukan sesuatu yang Anda harus baca dari atas kebawah!__

> Darimana saya harus memulai sebuah migrasi?

1. Awali dengan menjalankan [pembantu migrasi](https://github.com/vuejs/vue-migration-helper) dalam project saat ini. Kami telah berhati-hati untuk mengecilkan dan memampatkan pengembangan Vue menjadi sebuah command line interface sederhana. Kapan pun mereka mendeteksi adanya fitur yang usang, mereka akan memberitahu Anda, memberikan nasihat, dan menyediakan *links* ke lebih banyak informasi.


2. Setelah itu, lihatlah daftar isi dari halaman ini yang ada di *sidebar*. Jika Anda melihat topik yang mungkin mempengaruhi migrasi Anda, namun tidak diberitahukan oleh "pembantu migrasi", coba lihatlah topik tersebut.

3. Jika Anda mempunyai sebuah tes, jalankan mereka dan amati apa saja yang masih gagal. Jika Anda tidak punya tes, bukalah aplikasi Anda di peramban (*browser*) dan periksalah peringatan-peringatan dan galat-galat (*error*) selagi anda bernavigasi di aplikasi Anda.


4. Pada tahap ini, aplikasi Anda seharusnya sudah sepenuhnya termigrasi. Jika Anda masih ingin tahu lebih banyak lagi, Anda dapat membaca sisa dari halaman ini - atau menyelam ke petunjuk [the begining](index.html) yang baru dan lebih baik. Banyak bagian yang bisa di *skim*, karena Anda sudah familiar dengan konsep-konsep inti.


> Berapa lama waktu yang dibutuhkan untuk memigrasi aplikasi Vue 1.x ke 2.0?

Ini bergantung pada beberapa faktor:

- Ukuran dari aplikasi anda (aplikasi kecil sampai menengan mungkin butuh kurang dari sehari)

- Berapa kali anda terganggu dan bermain dengan sebuah fitur baru yang lebih keren. 😉 &nbsp; Tidak menghakimi, ini juga terjadi kepada kami saat kami membangun 2.0.

- Fitur-fitur usang apa saja yang Anda gunakan. Kebanyakan dapat ditingkatkan dan ditemukan penggantinya, tapi beberapa dapat menyita beberapa menit. Jika Anda tidak sedang mengikuti praktik terbaik (*best practice*), Vue 2.0 akan mencoba lebih keras untuk mengharuskan Anda mengikutinya. Hal ini merupakan hal yang baik untuk jangka panjang, tapi dapat juga berarti *refactor* yang signifikan (meski bisa jadi terlambat).


> Jika Saya upgrade ke Vue 2, akankah Saya juga harus meng-upgrade Vuex dan Vue Router?

Hanya Vue Router 2 yang cocok dengan Vue 2, jadi ya, anda juga harus mengikuti [jalur migrasi untuk Vue Router](migration-vue-router.html). Untungnya, kebanyakan aplikasi tidak memiliki banyak kode router, jadi melakukan hal ini sepertinya tidak akan memakan waktu lebih dari satu jam.

Untuk Vuex, versi 0.8 saja sudah cocok dengan Vue 2, jadi anda tidak dipaksa untu melakukan *upgrade*. Satu-satunya alasan anda jika ingin melakukan upgrade secepatnya adalah untuk mendapatkan manfaat dari fitur-fitur baru di Vuex 2, seperti modules dan boilerplate yang dikurangi.

## Templat

### Fragment Instances <sup>dihapus</sup>


Setiap komponen harus memiliki sebuah elemen root. *Fragment instance* tidak lagi diperbolehkan. Jika Anda memiliki templat seperti ini:

``` html
<p>foo</p>
<p>bar</p>
```

Disarankan untuk membungkus seluruh konten dalam sebuah elemen baru, seperti ini:

``` html
<div>
  <p>foo</p>
  <p>bar</p>
</div>
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan rangkaian tes atau aplikasi Anda setelah melakukan peningkatan dan carilah <strong> peringatan konsol</strong> mengenai beberapa elemen root dalam sebuah templat. </p>
</div>
{% endraw %}

## Kait Siklus Hidup (Lifecycle Hooks)

### `beforeCompile` <sup>dihapuskan</sup>

Gunakan kait `created` sebagai penggantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk melihat contoh kait berikut.</p>
</div>
{% endraw %}

### `compiled` <sup>digantikan</sup>

Gunakan kait `mounted` sebagai penggantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk melihat contoh kait berikut.</p>
</div>
{% endraw %}

### `attached` <sup>dihapuskan</sup>

Gunakan kastem *in-DOM* cek di dalam kait lain. Dengan contoh, untuk menggantikan:

``` js
attached: function () {
  doSomething()
}
```

Kamu bisa menggunakan:

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk melihat contoh kait berikut.</p>
</div>
{% endraw %}

### `detached` <sup>dihapuskan</sup>

Gunakan kastem *in-DOM* cek di dalam kait lain. Dengan contoh, untuk menggantikan:

``` js
detached: function () {
  doSomething()
}
```

Kamu bisa menggunakan:

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk melihat contoh kait berikut.</p>
</div>
{% endraw %}

### `init` <sup>diubah nama</sup>

Gunakan kait `beforeCreate` sebagai pengganti, dimana merupakan hal yang sama. Digantikan nama dikarenakan merujuk pada konsistensi penamaan *methods* siklus hidup yang lain.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk melihat contoh kait berikut.</p>
</div>
{% endraw %}

### `ready` <sup>digantikan</sup>

Gunakan kait baru `mounted` sebagai pengganti. Harus menjadi perhatian bahwa dengan `mounted`, tidak ada garansi untuk bahwa page sudah benar benar di load oleh browser. Untuk itu, gunakan `Vue.nextTick`/`vm.$nextTick`. Sebagai contoh

``` js
mounted: function () {
  this.$nextTick(function () {
    // kode anda dimana memastikan bahwa element sudah di load oleh browser
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk melihat contoh kait berikut.</p>
</div>
{% endraw %}

## `v-for`

### `v-for` Argumen Persoalan Order Dalam Array <sup>diubah</sup>

Saat menggunakan `index`, argumen order dalam array dulunya `(index, value)`. Sekarang `(value, index)` untuk menjaga konsistensi dengan methods array JavaScript's seperti `forEach` dan `map`.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk menemukan contoh argumen order yang lama. Perlu diperhatikan jika anda menamai index dengan <code>position</code> atau <code>num</code>, alat bantu tidak akan memberikan peringatan.</p>
</div>
{% endraw %}

### `v-for` Argumen Order Tentang Objek <sup>diubah</sup>

Saat menggunakan `key` sebagai argumen order pada objek dulunya`(key, value)`. Sekarang menjadi `(value, key)` untuk lebih konsisten dengan objek iterator pada umumnya seperti `lodash`.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk menemukan contoh argumen order yang lama. Perlu diperhatikan jika anda menamai kunci argumen anda dengan <code>name</code> atau <code>property</code> alat bantu tidak akan memberikan peringatan.</p>
</div>
{% endraw %}

### `$index` and `$key` <sup>dihapuskan</sup>

Secara implisit variabel `$index` dan `$key` dihapuskan karena secara explisit didefinisikan kedalam `v-for`. Ini membuat kode lebih gampang di baca untuk developer yang kurang berpengalaman dengan Vue dan juga membuat perilaku yang lebih jelas saat berkerja dengan *nested loops*.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk menemukan variabel yang telah dihapuskan berikut. Jika kamu lupa untuk menhapusnya, kamu akan melihat <strong>console errors</strong> seperti: <code>Uncaught ReferenceError: $index is not defined</code></p>
</div>
{% endraw %}

### `track-by` <sup>digantikan</sup>

`track-by` has been replaced with `key`, which works like any other attribute: without the `v-bind:` or `:` prefix, it is treated as a literal string. In most cases, you'd want to use a dynamic binding which expects a full expression instead of a key. For example, in place of:
`track-by` telah diganti dengan `key`, dimana berkerja seperti attribut lain: tanpa `v-bind:` atau `:` sebagai prefix, `key` di perlakukan sebagai *literal string*. DI banyak kasus, kamu mungkin ingin menggunakan *binding* dinamis dimana mengharapakan suatu *full expression*  daripada kunci saja. Sebagai contoh :

{% codeblock lang:html %}
<div v-for="item in items" track-by="id">
{% endcodeblock %}

Kamu sekarang menuliskan :

{% codeblock lang:html %}
<div v-for="item in items" v-bind:key="item.id">
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> untuk menemukan contoh dari pada <code>track-by</code>.</p>
</div>
{% endraw %}

### `v-for` Nila Rentang <sup>diubah</sup>

Dulunya, `v-for="number in 10"` dengan `number` dimulai dari 0 ke 9. Sekarang dimulai dari 1 sampai dengan 10.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Cari di kodebase anda <code>/\w+ in \d+/</code>. Dimana ini muncul pada <code>v-for</code>, lalu cek jika mungkin memberikan efek pada kode anda.</p>
</div>
{% endraw %}

## Props

### `coerce` Opsi Pada Props <sup>dihapuskan</sup>

Jika kamu ingin memaksakan sebuah *prop*, gunakan nilai hitung berdasarkan prop tersebut. Sebagai contoh, daripada :

``` js
props: {
  username: {
    type: String,
    coerce: function (value) {
      return value
        .toLowerCase()
        .replace(/\s+/, '-')
    }
  }
}
```

Anda dapat menuliskan:

``` js
props: {
  username: String,
},
computed: {
  normalizedUsername: function () {
    return this.username
      .toLowerCase()
      .replace(/\s+/, '-')
  }
}
```

Disini ada beberapa keuntungan:

- Kamu tetap mendapatkan akses pada nilai original pada prop.
- Kamu dipaksa untuk lebih eksplisit, dimana kamu dipaksa memberikan nilai pada nama yang membedakan prop tersebut dari nilai yang di masukan pada prop.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk menemukan opsi <code>coerce</code>.</p>
</div>
{% endraw %}

### `twoWay` Prop Option <sup>dihapus</sup>

Prop sekarang selalu satu jalur ke bawah. Untuk menimbulkan efek pada scope induk, komponen harus secara explisit memberikan event daripada harus bergantung pada binding implisit. Untuk informasi selanjutnya, lihat:

- [event kastem komponen](components.html#Custom-Events)
- [kastem komponen input](components.html#Form-Input-Components-using-Custom-Events) (using component events)
- [Pengelolaan global state](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk menemukan opsi <code>twoWay</code>.</p>
</div>
{% endraw %}

### `.once` and `.sync` Modifiers on `v-bind` <sup>dihapus</sup>

Prop sekarang selalu satu jalur ke bawah. Untuk menimbulkan efek pada scope induk, komponen harus secara explisit memberikan event daripada harus bergantung pada binding implisit. Untuk informasi selanjutnya, lihat:

- [event kastem komponen](components.html#Custom-Events)
- [kastem komponen input](components.html#Form-Input-Components-using-Custom-Events) (using component events)
- [Pengelolaan global state](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di dalam kode anda untuk menemukan contoh pengubah <code>.once</code> dan <code>.sync</code></p>
</div>
{% endraw %}

### Mutasi Prop <sup>usang</sup>

Mengubah prop sekarang merupakan sebuah *anti-pattern* (tidak disarankan dilakukan), contoh mendeklarasikan prop dan men-set prop `this.myProp = 'someOtherValue'` pada komponen. Dikarenakan mekanisame *rendering* yang baru, setiap komponen induk melakukan *re-render*, perubahan lokal komponen tersebut akan ditimpa.

Sebagian besar kasus penggunaan mutasi pada props dapat diganti dengan salah satu opsi ini:

- sebuah properti data, dengan prop di set pada nilai standar
- sebuah computed properti

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Upgrade Vue lalu jalankan *end-to-end* testing kamu, cari <strong>console warnings</strong> tentang mutasi prop.</p>
</div>
{% endraw %}

### Prop pada Akar Instance <sup>digantikan</sup>

Pada akar *instances* Vue (contoh, instances yang dibuat dengan `new Vue({ ... })`) kamu harus menggunakan `propsData` sebagai ganti `props`

{% raw %}
<div class="upgrade-path">
  <h4>Jalankan</h4>
  <p>Jalankan *end-to-end* tes, jika kamu mempunyainya. <strong>tes gagal</strong> akan memberikan peringatan bahwa prop yang dimasukan pada akar instances Vue sudah tidak berkerja lagi.</p>
</div>
{% endraw %}

## Properti Computed (Computed properties)

### `cache: false` <sup>deprecated</sup>

Caching invalidation of computed properties will be removed in future major versions of Vue. Replace any uncached computed properties with methods, which will have the same result.

Pembatalan chaching dari senuah properti computed akan dihapuskan pada versi major Vue selanjutnya. Ganti semua *uncached* properti computed dengan method, dimana akan menghasailakn hal yang sama

Contoh:

``` js
template: '<p>message: {{ timeMessage }}</p>',
computed: {
  timeMessage: {
    cache: false,
    get: function () {
      return Date.now() + this.message
    }
  }
}
```

atau dengan komponen method:

``` js
template: '<p>message: {{ getTimeMessage() }}</p>',
methods: {
  getTimeMessage: function () {
    return Date.now() + this.message
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda dan anda akan menemukan opsi <code>cache: false</code></p>
</div>
{% endraw %}

## Direktif Bawaan

### _Truthiness/Falsiness_ dengan `v-bind` <sup>diubah</sup>

Ketika digunakan dengan  `v-bind`, nilai yang bernilai _false_ sekarang hanya: `null`, `undefined`, dan `false`. ini berarti `0` dan _string_ kosong akan bernilai _true_. Contohnya, `v-bind:draggable="''"` diperbaiki menjadi `draggable="true"`.


Untuk atribut yang disebutkan, selain nilai-nilai palsu diatas, nilai _string_ `"false"`  akan di-_render_ sebagai `attr="false"`.

<p class="tip">Catatan untuk direktif lainnya (e.g. `v-if` and `v-show`), nilai-nilai *truthiness* JavaScript masih berlaku.</p>

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p> Jalankan *end-to-end test suite* Anda, Jika Anda memilikinya. Bagian <strong>*failed tests*</strong> akan memperingatkan Anda terhadap bagian-bagian dari aplikasi yang terkena dampak oleh perubahan ini.</p>
</div>
{% endraw %}

### Mengetahui nilai asli dengan `v-on` <sup>diubah/sup>

Ketika digunakan pada sebuah komponen, `v-on` hanya akan mendengarkan _event-event_ yang ter- `$emit` oleh komponen tersebut. Untuk mendengarkan _event DOM_ bawaan pada elemen root, Anda dapat menggunakan *modifier* `.native`. Contohnya:


{% codeblock lang:html %}
<my-component v-on:click.native="doSomething"></my-component>
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <i>end-to-end</i>, jika Anda memilikinya. Bagian <strong>*failed tests*</strong> akan memperingatkan Anda terhadap bagian-bagian dari aplikasi yang terkena dampak oleh perubahan ini.</p>
</div>
{% endraw %}

### `debounce` Atribut Param untuk `v-model` <sup>dihapus</sup>

Vue's `debounce` parameter atribut untuk `v-model` membuat mudah untuk kasus - kasus sederhana, tetapi operasi ini sebenarnya ditolak oleh *__state updates__* daripada operasi yang mahal itu sendiri. Ini sebuah perbedaan yang halus, namun akan ada keterbatasan jika aplikasi tersebut tumbuh.

Keterbatasan itu akan muncul ketika merancang indikator pencarian, Seperti:

{% raw %}
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo" class="demo">
  <input v-model="searchQuery" placeholder="Tulis Sesuatu">
  <strong>{{ Pencarian indikator }}</strong>
</div>
<script>
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
</script>
{% endraw %}

Menggunakan atribut `debounce`, tidak ada cara untuk mengenali "Tipe" *state*, karena kita kehilangan akses pada *input real-time state*. Namun memisahkan fungsi *debounce* dari Vue, kami hanya dapat *debounce* pada operasi yang kami ingin batasi, menghapus keterbatasan pada fitur dapat dikembangkan sebagai berikut:


``` html
<!--
Dengan menggunakan fungsi debounce dari lodash atau perpustakaan utilitas khusus lainnya, kami tahu implementasi debounce spesifik yang kami gunakan akan menjadi yang terbaik di kelasnya - dan kita dapat menggunakannya dimana saja. Tidak hanya di template kami.
-->
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
```

``` js
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    // This is where the debounce actually belongs.
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
```

Keuntungan lain dari pendekatan ini adalah akan ada waktu ketika *debouncing* tidak cukup sebagai fungsi *wrapper*. Misalnya, saat memanggil API untuk pencarian saran, menunggu untuk menawarkan saran sampai setelah pengguna berhenti mengetik untuk jangka waktu tertentu bukanlah pengalaman yang ideal. Yang mungkin Anda inginkan adalah fungsi __throttling__. Sekarang karena Anda sudah menggunakan pustaka utilitas seperti lodash, refactoring untuk menggunakan fungsi `throttle` sebagai gantinya hanya membutuhkan beberapa detik.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh atribut <code>*debounce*</code>.</p>
</div>
{% endraw %}

### `lazy` atau `number` Atribut Param untuk `v-model` <sup>diganti</sup>

`lazy` dan `number` param atribut dapat di modifikasi, untuk membuat lebih jelas, artinya:

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

Kamu dapat menggunakan:

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh atribut .</p>
</div>
{% endraw %}

### `value` Atribut dengan `v-model` <sup>dihapus</sup>

`v-model` tidak peduli dengan nilai awal dari barisan atribut `value`. Untuk bisa diprediksi, `v-model` akan memperlakukan data dari Vue *intance* sebagai sumber kebenaran.

Maksud dari elemen ini:

``` html
<input v-model="text" value="foo">
```

Didukung dengan data ini:

``` js
data: {
  text: 'bar'
}
```

Akan *render* dengan nilai "bar" daripada "foo". Hal yang sama berlaku untuk `<textarea>` dengan konten yang ada. Daripada:

``` html
<textarea v-model="text">
  hello world
</textarea>
```

Anda harus memastikan nilai awal `text` adalah "hello world".

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan *end-to-end test suite* atau  peningkatan setelah pengujian aplikasi dan mencari <strong><i>console warnings<i></strong> tentang kebenaran nilai dalam atribut <code>v-model</code>.</p>
</div>
{% endraw %}

### `v-model` dengan `v-for` Nilai Primtif Iterasi<sup>dihapus</sup>

Kasus seperti ini tidak berfungsi lagi pada:

``` html
<input v-for="str in strings" v-model="str">
```

Alasannya adalah kesetaraan Javascript yang akan di *compile</i> dari `<input>` tersebut:

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

Seperti yang Anda lihat, `v-model` pengikatan dua arah ini tidak masuk akal . Menetapkan `str` menjadi nilai lain dalam fungsi iterasi tetapi tidak akan melakukan apa-apa karena itu hanya variabel lokal yang berada dalam cakupan fungsi.

Sebagai gantinya, Anda seharusnya menggunakan *array __objects__* sehingga `v-model` bisa memperbaharui *field* dalam *object* tersebut. Seperti:

{% codeblock lang:html %}
<input v-for="obj in objects" v-model="obj.str">
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade></h4>
  <p>Jalankan *your test suite*, jika Anda memilikinya. Bagian <strong>*failed tests*</strong> akan memperingatkan Anda terhadap bagian-bagian dari aplikasi yang terkena dampak oleh perubahan ini.</p>
</div>
{% endraw %}

### `v-bind:style` dengan *Object Syntax* dan `!important` <sup>dihapus</sup>

Konsep ini tidak lagi berfungsi:

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hello</p>
```

Jika Anda ingin menimpa `!important` lainnya, Anda harus menggunakan <i>string syntax</i>:

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hello</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada baris kode Anda menemukan contoh-contoh dengan ikatan gaya  <code>*!important*</code> dalam objek.</p>
</div>
{% endraw %}

### `v-el` and `v-ref` <sup>diganti</sup>

Untuk kesederhanaan, `v-el` dan `v-ref` sudah digabungkan menjadi atribut `ref` , dapat diakses melalui komponen <i>instance</i> `$refs`. Maksudnya `v-el:my-element` akan muncul `ref="myElement"` dan `v-ref:my-component` nampak `ref="myComponent"`.Ketika digunakan pada elemen normal,   `ref` akan ke DOM elemen, dan ketika menggunakan dalam komponen tersebut , `ref` akan kembali menggunakan komponen <i>instance</i>.

Karena `v-ref` bukan lagi sebuah direktif, tetapi adalah atribut spesial, dapat juga didefinisikan secara dinamis. Ini sangat berguna dalam kombinasi dengan `v-for`. Seperti:

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

Sebelumnya, `v-el`/`v-ref` kombinasi dengan `v-for` akan menghasilkan *array* pada elemen/komponen, karena tidak ada cara memberi nama yang unik pada setiap item. Anda masih dapat mencapai ini dengan memberikan *item* `ref` yang sama:

``` html
<p v-for="item in items" ref="items"></p>
```

Tidak seperti 1.x, `$refs` ini tidak *reactive*, karena mereka sudah terdaftar/diperbaharui selama proses *render* itu sendiri. Membuat mereka *reactive* akan membutuhkan duplikasi *render* pada setiap perubahan.

Disamping itu, `$refs` dirancang untuk program dalam javascript - Tidak disaranakan penggunaan dalam tampilan, karena akan merujuk pada negara bukan pada instance itu sendiri. Akan terkana pelanggaran dalam tampilan model Vue js sendiri.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan<a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> dari <i>codebase</i> untuk mencari contoh-contoh <code>v-el</code> dan <code>v-ref</code>.</p>
</div>
{% endraw %}

### `v-else` with `v-show` <sup>di hapus</sup>

`v-else` tidak lagi berfungsi dengan `v-show`. Menggunakan `v-if` dengan sebuah ekpresi negasi sebagai gantinya. Untuk contohnya, daripada:

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">Not foo, but bar</p>
```

Anda dapat menggunakan:

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">Not foo, but bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> dari <i>codebase</i> untuk mencari contoh-contoh <code>v-else</code> dengan <code>v-show</code>.</p>
</div>
{% endraw %}

## Direktif Kustom <sup>yang disederhanakan</sup>

Direktif-direktif memiliki cakupan tanggung jawab yang sangat dikurangi: mereka sekarang hanya digunakan untuk menerapkan manipulasi DOM pada <i>low level</i> secara langsung. Umumnya, Anda seharusnya menggunakan komponen sebagai abtraksi utama <i>code-reuse</i>.

Beberapa perbedaan yang paling menonjol termasuk:

- Direkftif tidak lagi memiliki _instance_. Maksudnya tidak lagi memiliki `this` dalam _directive hooks_. Sebaliknya, mereka menerima semua yang mungkin dibutuhkan sebagai argumen-argumen. Jika anda benar-benar harus mempertahankan dalam _state_ lintas _hooks_, Anda dapat menggunakan `el`.
- Opsi-opsi seperti `acceptStatement`, `deep`, `priority`, dll telah dihapus. Pengganti direktif `twoWay` , perhatikan [contoh ini](#Two-Way-Filters-replaced).
- Beberapa _hooks_ saat ini memiliki perbedaan perilaku dan juga beberapa _hooks_ baru.

Untungnya, karena direktif-direktif baru jauh lebih sederhana, maka kamu dapat menguasainya lebih mudah. Baca [Panduan direktif kustom](custom-directive.html) untuk mempelajari lebih lanjut.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh pada direktif. <i>Helper</i> akan menandai mereka semua, karena dalam kebanyakan kasus yang ingin Anda <i>refactory</i> ke dalam komponen.</p>
</div>
{% endraw %}

### Direktif Pengubah `.literal` <sup>dihapus</sup>

Pengubah `.literal` sudah dihapus, karena hal yang sama dapat dilakukan dengan mudah memberikan *strings literal* sebagai nilainya.

Sebagai contoh, Anda bisa memperbaharui:

``` html
<p v-my-directive.literal="foo bar baz"></p>
```

Jadi:

``` html
<p v-my-directive="'foo bar baz'"></p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh pada direktif modifikasi `.literal`.</p>
</div>
{% endraw %}

## Transisi

### Atribut `transition` <sup>diubah</sup>

Vue's transition system has changed quite drastically and now uses `<transition>` and `<transition-group>` wrapper elements, rather than the `transition` attribute. It's recommended to read the new [Transitions guide](transitions.html) to learn more.

Sistem transisi sistem sekarang sudah berganti cukup drastis dan sekarang menggunakan `<transition>` dan `<transition-group>` elemen pembungkus, daripada memakai atribut `transisi`. Di rekomendasikan untuk membaca dokumentasi terbaru [tentang transisi](transitions.html) untuk info lebih lanjut.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk menemukan contoh penggunaan attribut <code>transition</code>.</p>
</div>
{% endraw %}

### `Vue.transition` untuk transisi yang dapat digunakan kembali <sup>diubah</sup>

Dengan sistem transisi yang terbaru anda [dapat menggunakan komponen](transitions.html#Reusable-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di kode anda untuk menemukan contoh penggunaan attribut <code>Vue.transition</code>.</p>
</div>
{% endraw %}

### Transition `stagger` Attribute <sup>removed</sup>

Jika kamu ingin membuat transisi list *stagger* kamu dapat mengontrol timing dengan menyeting dan meng-akses `data-index` (atau attribut yang sama lain-nya) di dalam elemen. Lihat contoh [disini](transitions.html#Staggering-List-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di dalam kode anda untuk menemukan contoh pneggunaan atribut <code>transition</code>. Saat aplikasi ter-update, kamu dapat mentransisikan ke dalam strategi `stagger` terbaru juga.</p>
</div>
{% endraw %}

## Events

### opsi `events` <sup>dihapus</sup>

The `events` option has been removed. Event handlers should now be registered in the `created` hook instead. Check out the [`$dispatch` and `$broadcast` migration guide](#dispatch-and-broadcast-replaced) for a detailed example.

Opsi `events` telah dihapuskan. Event handler untuk sekarang harus di registrasikan pada kait `created`. Cek [ dokumentasi migrasi `$dispatch` dan `$broadcast`](#dispatch-and-broadcast-replaced)

### `Vue.directive('on').keyCodes` <sup>diganti</sup>

Cara baru dan ringkas untuk mengatur `keyCodes` ini adalah melalui `Vue.config.keyCodes`. Contoh :

``` js
// izinkan v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di dalam kode anda untuk menemukan sintaks konfigurasi lama <code>keyCode</code>.</p>
</div>
{% endraw %}

### `$dispatch` dan `$broadcast` <sup>digantikan</sup>

`$dispatch` dan `$broadcast` sudah dihapuskan untuk lebih explisit saat melakukan komunikasi antar komponen dan menghasilakn *state management* yang lebih dapat di pelihara, contoh [Vuex](https://github.com/vuejs/vuex)

Masalahnya adalah event yang mengalir tergantung pada struktur pohon komponen sangat sangatlah sulit untuk dipikirkan, sangat rapuh saat pohon komponen menjadi besar. Hal tersebut sangat susah untuk di-*scaling* dan hanya membuat sakit kepala pada nantinya. `$dispatch` dan `$broadcast` tidak juga menyelesaikan masalah *sibling* komponen (komponen yang menggunakan props value sama).

Salah satu contoh yang biasa digunakan pada methods ini adalah untuk berkomunikasi antara induk komponen dengan anak langsung induk komponen tersebut. Pada kasus berikut, kamu dapat menggunakan *event* [`$emit` dari komponen anak menggunakan `v-on`](components.html#Form-Input-Components-using-Custom-Events). Ini membuatmu menjaga kenyamanan pada *event* dengan menambah secara ekplisit pada *event* tersebut.

Bagaimanapun itu, saat berkomunikasi antar komponen induk/anak yang jauh, `$emit` tidak dapat menolongmu. Untuk itu, solusi paling simple adalah dengan menggunakan *event hub* yang ter-sentralisasi. Cara ini menambahkan keuntungan dengan mengizinkan komunikasi antar komponen, dimanapun posisi komponen itu berada dalam struktur pohon komponen, dikarenakan *instance* Vue meng-implementasikan antar muka *event emitter*, kamu sebenarnya dapat menggunakan *instance* Vue kosong untuk hal ini.

Contoh, katakanlah kita mempunyai sebuah *todo app* terstruktur seperti berikut:

```
Todos
├─ NewTodoInput
└─ Todo
   └─ DeleteTodoButton
```

Kita dapat mengelola komunikasi antar komponen dengan satu *event hub*:

``` js
// Ini adalah event hub yang kita
// gunakan untuk berkomunu kasi antar komponen
var eventHub = new Vue()
```

Then in our components, we can use `$emit`, `$on`, `$off` to emit events, listen for events, and clean up event listeners, respectively:

Lalu di dalam komponen, kita dapat menggunakan `$emit`, `$on`, `$off` untuk memasukan *event*, mendengar *event*, dan menghapus *event*, dengan benar:

``` js
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
```

``` js
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```

``` js
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// Sangat disarankan untuk menghapus *Event.listener* sebelum \
// komponen di hancurkan (sebelum kait `destroyed`)
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

Pola ini dapat digunakan sebagai ganti `$dispatch` dan `$broadcast` pada skenario yang mudah, untuk kasus yang lebih komplex, direkomendasikan menggunakan *state management* sendiri seperti [Vuex](https://github.com/vuejs/vuex).

{% raw %}
<div class="upgrade-path">
  <h4>jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a>di dalam kode anda untuk menemukan sintaks <code>$dispatch</code> dan <code>$broadcast</code>.</p>
</div>
{% endraw %}

## Filter

### Filter di Luar Interpolasi Teks  <sup>dihapuskan</sup>

Filter sekarang hanya dapat digunakan dalam interpolasi text (`{% raw %}{{ }}{% endraw %}` tags). Pada dulunya kita menemukan bahwa menggunakan filter didalam *directive* seperti `v-model`, `v-on`, etc malah mendatangkan kompleksitas daripada kenyamanan. Untuk filter list pada `v-for` juga lebih baik memindahkan filter sebagai *computed properties*, jadi dapat digunakan kembali di seluruh komponen.

Secara umum, dimana sesuatu dapat dicapai dengan Javascript biasa, kita ingin menghindari sintaks spesial seperti filter untuk menangani hal yang secara umum sama. Berikut adalah cara bagaimana kamu dapat mengganti filter *directive* bawaan pada Vue:

#### Menggantikan Filter `debounce`

Daripada menggunakan:

``` html
<input v-on:keyup="doStuff | debounce 500">
```

``` js
methods: {
  doStuff: function () {
    // ...
  }
}
```

Gunakan [lodash's `debounce`](https://lodash.com/docs/4.15.0#debounce) (atau mungkin [`throttle`](https://lodash.com/docs/4.15.0#throttle)) untuk melimitasi memanggil method yang berat. Kamu dapat menggunakan ini untuk mendapatkan hasil sama seperti diatas:

``` html
<input v-on:keyup="doStuff">
```

``` js
methods: {
  doStuff: _.debounce(function () {
    // ...
  }, 500)
}
```

Untuk lebih lanjut tentang kelebihan strategi ini, lihat  [the example here with `v-model`](#debounce-Param-Attribute-for-v-model-removed).

#### Menggantikan filter `limitBy`

Daripada menggunakan:

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

gunakan Javascript [`.slice` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples) pada *computed property*:


``` html
<p v-for="item in filteredItems">{{ item }}</p>
```

``` js
computed: {
  filteredItems: function () {
    return this.items.slice(0, 10)
  }
}
```

#### Menggantikan filter `filterBy`

Daripada menggunakan:

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

Gunakan Javascript [`.filter` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples) pada *computed property*:

``` html
<p v-for="user in filteredUsers">{{ user.name }}</p>
```

``` js
computed: {
  filteredUsers: function () {
    var self = this
    return self.users.filter(function (user) {
      return user.name.indexOf(self.searchQuery) !== -1
    })
  }
}
```

*Method* Javascript `.filter` juga dapat mengelola operasi penyaringan yang lebih kompleks. Sebagai contoh, jika kamu ingin menemukan setiap user
 yang aktif secara *case-sensitive* cocok dengan nama dan email mereka:
``` js
var self = this
self.users.filter(function (user) {
  var searchRegex = new RegExp(self.searchQuery, 'i')
  return user.isActive && (
    searchRegex.test(user.name) ||
    searchRegex.test(user.email)
  )
})
```

#### Menggantikan filter `orderBy`

Daripada menggunakan:

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

Gunakan [lodash's `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (atau [`sortBy`](https://lodash.com/docs/4.15.0#sortBy)) pada *computed property*:

``` html
<p v-for="user in orderedUsers">{{ user.name }}</p>
```

``` js
computed: {
  orderedUsers: function () {
    return _.orderBy(this.users, 'name')
  }
}
```

You can even order by multiple columns:

{% codeblock lang:js %}
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a>di dalam kode anda untuk menemukan contoh filter yang digunakan dalam direktif. Jika kamu melupakan salah satu lihat juga <strong>konsol galat</strong>
</div>
{% endraw %}

### Filter Argumen Sintaks <sup>diganti</sup>

Sintaks filters untuk argumen sekarang lebih selaras dengan fungsi invokasi pada Javascript.

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

kita kelilingi argumen dengan tanda kurung dan membatasi argumen dengan koma:

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> di dalam kode anda untuk menemukan filter. Jika kamu melewatkannya , silahkan lihat pada <strong>konsol galat</strong>.</p>
</div>
{% endraw %}

### Filter text bawaan <sup>dihapuskan</sup>

Walaupun filter pada interpolasi teks masih diperbolehkan, semua filter telah dihapuskan. Sebagai gantinya, sangat di rekomendasikan untuk menggunakan pustaka khusus untuk memecahkan problem pada setiap domain (contoh: [`date-fns`](https://date-fns.org/) untuk men-format tanggal dan [`accounting`](http://openexchangerates.github.io/accounting.js/) untuk mata uang)

For each of Vue's built-in text filters, we go through how you can replace them below. The example code could exist in custom helper functions, methods, or computed properties.

Untuk setiap direktif filter bawaan Vue, kita mambahas bagaimana kamu dapat menggantinya dibawah ini. Contoh kode dapat ada pada fungsi kastem, *method*, ataupun *computed properties*

#### Menggantikan Filter `json`

Kamu sebenarnya tidak membuhtukan ini untuk debugging lagi, Vue otomatis akan mem-format output baik itu teks, angka, *array*, maupun sebuah objek. Jika kamu ingin mendapatkan fungsionalitas yang sama maka fungsi `JSON.stringify` dapat membantu, dan kamu dapat menggunakannya pada *method* atau *computed properties*

#### Menggantikan Filter `capitalize`

``` js
text[0].toUpperCase() + text.slice(1)
```

#### Menggantikan Filter `uppercase`

``` js
text.toUpperCase()
```

#### Menggantikan Filter `lowercase`

``` js
text.toLowerCase()
```

#### Menggantikan Filter `pluralize`

Paket [pluralize](https://www.npmjs.com/package/pluralize) di NPM dapat digunakan untuk tujuan ini, tapi jika kamu ingin menjamakkan beberapa kata spesifik atau sebuah keluaran khusus seperti saat mendapatkan 0, maka kamu dapat mendefinisikan fungsi jamak-mu sendiri:

``` js
function pluralizeKnife (count) {
  if (count === 0) {
    return 'no knives'
  } else if (count === 1) {
    return '1 knife'
  } else {
    return count + 'knives'
  }
}
```

#### Replacing the `currency` Filter

Untuk implementasi yang sangat naif, kamu dapat melakukan dengan cara ini

{% codeblock lang:js %}
'$' + price.toFixed(2)
{% endcodeblock %}

Walau di banyak kasus, kamu akan menemukan perilaku aneh (contoh: `0.035.toFixed(2)` dibulatkan ke atas menjadi `0.04`, tapi `0.045` dibulatkan kebawah menjadi `0.04`), Untuk itu kamu dapat menggunakan pustaka [`accounting`](http://openexchangerates.github.io/accounting.js/) untuk menformat mata uang.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a>di dalam kode anda dan temukan filter text yang dihapuskan. Jika kamu melewatkan sesuatu, lihatlah pada <strong>konsol galat</strong>.</p>
</div>
{% endraw %}

### Filter Dua Arah <sup>diganti</sup>

Beberapa pengguna nyaman menggunakan filter 2 arah dengan `v-model` untuk membuat isian unik dengan kode yang sedikit. Walaupun kelihatannya mudah tetapi, filter 2 arah juga menyembunyikan kompleksitas yang besar - dan bahkan mendukung UX yang sangat buruk dengan menunda memperbaharui *state*. Sebagai gantinya, komponen yang membungkus isian sangat di rekomendasikan sebagai cara eksplisit dan kaya fitur untuk membuat isian kastem.

Sebagai contoh, kita akan melakukan migrasi filter dua arah pada mata uang:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Contoh itu hampir berkerja dengan baik, tapi penundaan pembaharuan *state* dapat menyebabkan perilaku aneh. Contoh, klik pada tab `Result` dan coba isikan `9.999` pada salah satu isian tersebut. Pada saat isian hilang fokus-nya, nilai pdaa isian akan berubah ke `$10.00`. Tapi pada saat melihat total kalkulasi yang tersimpan pada data menunjukan '9.999'. Versi realitas yang dilihat user kita tidak sinkron.

Untuk memulai transisi kedepannya dengan solusi yang lebih mudah di Vue 2.0 mari kira bungkus filter ini pada komponen `<currency-input>`:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This allows us add behavior that a filter alone couldn't encapsulate, such as selecting the content of an input on focus. Now the next step will be to extract the business logic from the filter. Below, we pull everything out into an external [`currencyValidator` object](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e):

Ini memungkinkan kita untuk menambahkan perilaku yang tidak dapat diringkas, seperti memilih konten dari sebuah isian yang sedang kondisi fokus. Langkah selanjutnya adalah meng-ekstrak logis bisnis pada filter. Dibawah, ini kita menarik keluar semuanya menjadi [objek `currencyValidator`](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e):

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Ini menambahkan modularitas, tidak hanya membuat mudah untuk migrasi ke Vue 2, tapi juga memungkinkan penguraian mata uang dan format dapat:

- *unit testing* dalam isolasi dari kode Vue
- digunakan pada bagaian lain dari aplikasi, seperti untuk memvalidasi muatan ke titik akhir API

Setelah validator ini diekstrak, kita juga dapat menggunakannya untuk memecahnkan solusi solusi yang lain. Keanehan pada *state* sudah dieliminasi dan sebenarnya ini tidak memungkinkan pengguna untuk memasukan isian yang salah, seperti pada isian asli browser.

Kita masih terbatas, dengan filter dan Vue 1.0 secara umum, jadi mari kita selesaikan upgrade ke Vue 2.0:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Kamu mungkin memperhatikan bahwa:

- Setiap aspek pada isian lebih eksplisit, menggunakan kait siklus hidup dan event pada DOM sebagai ganti filter dua arah.
- Kita sekarang dapat menggunakan `v-model` langsung pada isian kastem, dimana tidak hanya lebih konsisten sama seperti isian normal, tapi juga dapat membuat komponen kita enak digunakan dengan Vuex.
- Karena kita tidak lagi menggunakan opsi filter yang memerlukan nilai untuk dikembalikan, kerja fungsi mata uang yang kita buat dapat diselesaikan secara tidak sinkron (*asyncronously*). Berarti jika kita mempunyai banyak sekali aplikasi yang harus berkerja dengan mata uang, kita dapat meringkas logika ini sebagai *microservice* untuk digunakan bersama.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a>di dalam kode anda dan temukan filter text yang dihapuskan. Jika kamu melewatkan sesuatu, lihatlah pada <strong>konsol galat</strong>.</p>
</div>
{% endraw %}

## Slot

### Slot Duplikat <sup>dihapuskan</sup>

It is no longer supported to have `<slot>`s with the same name in the same template. When a slot is rendered it is "used up" and cannot be rendered elsewhere in the same render tree. If you must render the same content in multiple places, pass that content as a prop.

Vue tidak lagi mendukung adanya `<slot>` dengan nama yang sama di template yang sama. Saat slot di *render* slot akan "terpakai" dan tidak dapat di *render* kembali pada pohon *render* yang sama. Jika kamu harus merender konten yang sama di beberapa tempat, lempar konten tersebut sebagai prop.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan *end-to-end* tes kamu atau aplikasimu setelah upgrade dan cari   <strong>peringatan pada konsol</strong> tentang duplikat slot <code>v-model</code>.</p>
</div>
{% endraw %}

### Atribut gaya pada `slot` <sup>removed</sup>

Konten yang dimasukan lewat `<slot>` bernama sudah tidak lagi menjaga atribut `slot`. Gunakan elemen pembungkus untuk memberikan gaya, atau untuk kasus penggunaan lanjutan, ubah konten yang dimasukan secara terprogram dengan [render functions](render-function.html).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> dalam kode anda find untuk menemukan gaya CSS yang menargetkan slot bernama (contoh: <code>[slot="my-slot-name"]</code>).</p>
</div>
{% endraw %}

## Attribut Spesial

### `keep-alive` Attribute <sup>replaced</sup>

`keep-alive` is no longer a special attribute, but rather a wrapper component, similar to `<transition>`. For example:

`keep-alive` sekarang sudah tidak termasuk attribut spesial, tetapi sebuah komponen pembungkus, sama halnya seperti `<transition>`. Contoh:

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

Ini membuat attribut `keep-alive` dapat digunakan pada banyak komponen anak berkondisi:

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">Saat `<keep-alive>` mempunyai banyak komponen anak, mereka pada akhirnya harus mengevaluasi pada satu anak komponen. Komponen anak mana pun selain yang pertama akan diabaikan.</p>

Saat digunakan bersama `<transition>`, pastikan ada di dalam komponen tersebut:

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan atribut<code>keep-alive</code>.</p>
</div>
{% endraw %}

## interpolasi

### Interpolasi diantara atribut <sup>dihapuskan</sup>

Interpolasi diantara atribut sudah tidak lagi valid. Sebagai contoh:

``` html
<button class="btn btn-{{ size }}"></button>
```

Harus diperbaharui untuk menggunakan ekspresi sebaris:

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

Atau sebagai data/properti *computed*

``` html
<button v-bind:class="buttonClasses"></button>
```

``` js
computed: {
  buttonClasses: function () {
    return 'btn btn-' + size
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of interpolation used within attributes.</p>
</div>
{% endraw %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh interpolasi yang digunakan diantara atribut.</p>
</div>
{% endraw %}

### Interpolasi HTML <sup>dihapuskan</sup>

Interpolasi (`{% raw %}{{{ foo }}}{% endraw %}`) telah dihapuskan demi [`v-html` directive](../api/#v-html).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh interpolasi pada HTML.</p>
</div>
{% endraw %}

### Satu kali *binding* <sup>digantikan</sup>

Satu kali *binding* (`{% raw %}{{* foo }}{% endraw %}`) telah digantikan oleh [`v-once` directive](../api/#v-once).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan <i>binding</i> satu kali.</p>
</div>
{% endraw %}

## Reaktifitas

### `vm.$watch` <sup>digantikan</sup>

Pengamat (*Watchers*) yang dibuat dengan `vm.$watch` sekarang terpanggil sebelum komponen yang terasosiasi di render. Ini memberikanmu untuk lebih lanjut memperbaharui *state* sebelum komponen di render, sehingga menghindari pembaharuan yang tidak perlu. Contoh, kamu dapat memantau properti (*prop*) sebuah komponen dan memperbaharui data saat properti komponen berubah.

Jika kamu sebelumnya bergantung pada `vm.$watch` untuk melakukan sesuatu dalam DOM setelah komponen diperbaharui, kamu dapat juga melakukannya pada `updated` kait suklus hidup Vue.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <i>end-to-end test</i> anda, jika kamu memilikinya. <strong>Tes yang gagal</strong> akan memperingatkanmu jika pengamat <i>(watcher)</i> masih bergantung/menggunakan cara lama.</p>
</div>
{% endraw %}

### `vm.$set` <sup>digantikan</sup>

`vm.$set` sekarang adalah padanan dari [`Vue.set`](../api/#Vue-set).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode untuk menemukan contoh penggunaan yang sudah usang.</p>
</div>
{% endraw %}

### `vm.$delete` <sup>digantikan</sup>

`vm.$delete` sekarang merupakan padanan dari [`Vue.delete`](../api/#Vue-delete).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode untuk menemukan contoh penggunaan yang sudah usang.</p>
</div>
{% endraw %}


### `Array.prototype.$set` <sup>dihapuskan</sup>

Gunakan `Vue.set` sebagai gantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>.$set</code> pada <i>array</i>. Jika kamu melewatkannya , silahkan lihat pada <strong>konsol galat</strong> dari metode yang hilang.</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>dihapuskan</sup>

Gunakan `Array.prototype.splice` sebagai gantinya. Contoh:

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

Atau lebih baik, berikan parameter index pada *method* hapus:

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>.$remove</code> pada <i>array</i>. Jika kamu melewatkan sesuatu, coba lihat <strong>konsol galat</strong> dari <i>method</i> yang kamu lewatkan.</p>
</div>
{% endraw %}


### `Vue.set` dan `Vue.delete` pada *instance* Vue <sup>dihapuskan</sup>

`Vue.set` dan `Vue.delete` tidak dapat berkerja lagi pada *instance* Vue. Sekarang merupakan sebuah kewajiban untuk mendeklarasikan dengan benar properti reaktif tingkat-atas pada opsi data. Jika kamu ingin menghapus properti pada *instance* Vue atau `$data` setel ke nol (*null*).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>Vue.set</code> atau <code>Vue.delete</code> pada <i>instance</i> Vue. Jika kamu melewatkan sesuatu, hal tersebut akan menimbulkan <strong>peringatan pada konsol</strong>.</p>
</div>
{% endraw %}

###  `vm.$data` <sup>dihapuskan</sup>

Mengantikan *instance* komponen pada akar `$data` sekarang telah dilarang. Ini mencegah beberapa kasus langka pada sistem reaktifitas Vue dan membuat *state* pada komponen lebih dapat di prediksi (khususnya dengan sistem pengecekan-tipe).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh penimpaan <code>vm.$data</code>. Jika kamu melewatkannya, <strong>peringatan pada konsol</strong> akan dimunculkan.</p>
</div>
{% endraw %}


### `vm.$get` <sup>dihapuskan</sup>

Sebagai gantinya, mengambil data reaktif secara langsung.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>vm.$get</code>. Jika kamu melewatkan sesuatu, kamu akan melihat <strong>konsol galat</strong>.</p>
</div>
{% endraw %}

## Metode *Instance* DOM-terfokus (DOM-Focused Instance Methods)

### `vm.$appendTo` <sup>dihapuskan</sup>

Gunakan API DOM asli (*native*):

{% codeblock lang:js %}
myElement.appendChild(vm.$el)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>vm.$appendTo</code>. Jika kamu melewatkan sesuatu, kamu akan melihat <strong>galat pada konsol</strong>.</p>
</div>
{% endraw %}

### `vm.$before` <sup>dihapuskan</sup>

Gunakan API DOM asli (*native*):

{% codeblock lang:js %}
myElement.parentNode.insertBefore(vm.$el, myElement)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk melihat contoh <code>vm.$before</code>. Jika kamu melewatkan sesuatu, kamu akan melihat <strong>galat pada konsol</strong>.</p>
</div>
{% endraw %}

### `vm.$after` <sup>dihapuskan</sup>

Gunakan API DOM asli (*native*):

{% codeblock lang:js %}
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
{% endcodeblock %}

Atau jika `myElement` merupakan komponen anak terakhir

{% codeblock lang:js %}
myElement.parentNode.appendChild(vm.$el)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk melihat contoh <code>vm.$after</code>. Jika kamu melewatkan sesuatu, kamu kan melihat <strong>galat pada konsol</strong>.</p>
</div>
{% endraw %}

### `vm.$remove` <sup>dihapuskan</sup>

Gunakan API DOM asli (*native*):

{% codeblock lang:js %}
vm.$el.remove()
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh<code>vm.$remove</code>. Jika kamu melewatkan sesuatu, kamu akan melihat <strong>galat pada konsol</strong>.</p>
</div>
{% endraw %}

## Metode pada *Meta Instance* (Meta Instance Methods)

### `vm.$eval` <sup>dihapuskan</sup>

Tidak ada gunanya. Jika kamu ternyata bergantung pada fitur ini dan tidak tahu bagaimana harus menggantinya, silahkan membuka obrolan pada [forum Vue.js](https://forum.vuejs.org/) untuk ide.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>vm.$eval</code>. Jika kamu melewatkan sesuatu, kamu akan melihat <strong>galat pada konsol</strong>.</p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>dihapuskan</sup>

Tidak ada gunanya. Jika kamu ternyata bergantung pada fitur ini dan tidak tahu bagaimana harus menggantinya, silahkan membuka obrolan pada [forum Vue.js](https://forum.vuejs.org/) untuk ide.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>vm.$interpolate</code>. Jika kamu melewatkan sesuatu, kamu akan melihat <strong>galat pada konsol</strong>.</p>
</div>
{% endraw %}

### `vm.$log` <sup>dihapuskan</sup>

Gunakan [Vue Devtools](https://github.com/vuejs/vue-devtools) untuk pengalaman *debugging* yang optimal.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>vm.$log</code>. Jika kamu melewatkan sesuatu, kamu akan melihat <strong>galat pada konsol</strong>.</p>
</div>
{% endraw %}

## Opsi pada *Instance* DOM (Instance DOM Options)

### `replace: false` <sup>dihapuskan</sup>

Tiap - tiap komponen sekarang selalu menggantikan element yang terkait dengan mereka. Untuk mengsimulasikan sifat dari `replace: false`, kamu dapat membungkus akar komponen dengan elemen yang sama terhadap elemen yang kamu ganti. Contoh:

``` js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

Atau menggunakan fungsi *render*:

``` js
new Vue({
  el: '#app',
  render: function (h) {
    h('div', {
      attrs: {
        id: 'app',
      }
    }, /* ... */)
  }
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh <code>replace: false</code>.</p>
</div>
{% endraw %}

## Global Config

### `Vue.config.debug` <sup>removed</sup>

No longer necessary, since warnings come with stack traces by default now.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.debug</code>.</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>removed</sup>

Async is now required for rendering performance.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.async</code>.</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>replaced</sup>

This has been reworked as a [component-level option](../api/#delimiters). This allows you to use alternative delimiters within your app without breaking 3rd-party components.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.delimiters</code>.</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>removed</sup>

HTML interpolation has been [removed in favor of `v-html`](#HTML-Interpolation-removed).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.unsafeDelimiters</code>. After this, the helper will also find instances of HTML interpolation so that you can replace them with `v-html`.</p>
</div>
{% endraw %}

## API Global

### `Vue.extend` dengan `el` <sup>dihapuskan</sup>

Opsi `el` sudah tidak dapat digunakan pada `Vue.extend`. Sekarang hal ini hanay valid sebagai opsi pembuatan *instance*.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <i>end-to-end testing</i> pada aplikasi anda atau setelah anda meng-update Vue cari <strong>peringatan pada konsol</strong> soal penggunaan opsi <code>el</code> dengan <code>Vue.extend</code>.</p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>dihapuskan</sup>

Gunakan komponen sebagai gantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh penggunaan dari <code>Vue.elementDirective</code>.</p>
</div>
{% endraw %}

### `Vue.partial` <sup>dihapuskan</sup>

*Partials* telah dihapus dengan alasan untuk menjaga aliran data antara komponen, menggunakan *props* komponen. Kecuali kamu menggunakan *partial* pada area yang memerlukan performa lebih, rekomendasi untuk masalah tersebut adalah dengan menggunakan [komponen biasa](components.html) sebagai gantinya. Jika kamu secara dinamis mengikat `name` dari sebuah partial, kamu dapat menggunakan [komponen dinamis](components.html#Dynamic-Components).

Jika kamu ternyata menggunakan *partial* di applikasi andad pada tempat yang membutuhkan performa lebih cepat, maka kamu harus ganti dengan [komponen fungsional](render-function.html#Functional-Components). Komponen tersebut harus di deklarasikan dengan JS/JSX file (bukan menggunakan `.vue` file) dan juga *stateless* dan *instanceless*, seperti partials. Ini membuat kecepatan render sangat cepat

Keuntungan menggunakan komponen fungsional daripada *partial* adalah komponen fungsional lebih dinamis, dikarenakan kamu dapat menggunakan javascript seutuhnya pada komponen. Tetapi ada juga hal yang harus di bayar saat menggunakan komponen fungsional. Jika kamu belum pernah menggunakan kerangka kerja dengan fungsi *render* sebelumnya, mungkin kamu perlu waktu agak lama untuk mempelajarinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">alat bantu migrasi</a> pada kode anda untuk menemukan contoh penggunaan <code>Vue.partial</code>.</p>
</div>
{% endraw %}
