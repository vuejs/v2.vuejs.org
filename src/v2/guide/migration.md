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

## Lifecycle Hooks

### `beforeCompile` <sup>removed</sup>

Use the `created` hook instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find all examples of this hook.</p>
</div>
{% endraw %}

### `compiled` <sup>replaced</sup>

Use the new `mounted` hook instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find all examples of this hook.</p>
</div>
{% endraw %}

### `attached` <sup>removed</sup>

Use a custom in-DOM check in other hooks. For example, to replace:

``` js
attached: function () {
  doSomething()
}
```

You could use:

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find all examples of this hook.</p>
</div>
{% endraw %}

### `detached` <sup>removed</sup>

Use a custom in-DOM check in other hooks. For example, to replace:

``` js
detached: function () {
  doSomething()
}
```

You could use:

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find all examples of this hook.</p>
</div>
{% endraw %}

### `init` <sup>renamed</sup>

Use the new `beforeCreate` hook instead, which is essentially the same thing. It was renamed for consistency with other lifecycle methods.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find all examples of this hook.</p>
</div>
{% endraw %}

### `ready` <sup>replaced</sup>

Use the new `mounted` hook instead. It should be noted though that with `mounted`, there's no guarantee to be in-document. For that, also include `Vue.nextTick`/`vm.$nextTick`. For example:

``` js
mounted: function () {
  this.$nextTick(function () {
    // code that assumes this.$el is in-document
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find all examples of this hook.</p>
</div>
{% endraw %}

## `v-for`

### `v-for` Argument Order for Arrays <sup>changed</sup>

When including an `index`, the argument order for arrays used to be `(index, value)`. It is now `(value, index)` to be more consistent with JavaScript's native array methods such as `forEach` and `map`.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete argument order. Note that if you name your index arguments something unusual like <code>position</code> or <code>num</code>, the helper will not flag them.</p>
</div>
{% endraw %}

### `v-for` Argument Order for Objects <sup>changed</sup>

When including a `key`, the argument order for objects used to be `(key, value)`. It is now `(value, key)` to be more consistent with common object iterators such as lodash's.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete argument order. Note that if you name your key arguments something like <code>name</code> or <code>property</code>, the helper will not flag them.</p>
</div>
{% endraw %}

### `$index` and `$key` <sup>removed</sup>

The implicitly assigned `$index` and `$key` variables have been removed in favor of explicitly defining them in `v-for`. This makes the code easier to read for developers less experienced with Vue and also results in much clearer behavior when dealing with nested loops.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of these removed variables. If you miss any, you should also see <strong>console errors</strong> such as: <code>Uncaught ReferenceError: $index is not defined</code></p>
</div>
{% endraw %}

### `track-by` <sup>replaced</sup>

`track-by` has been replaced with `key`, which works like any other attribute: without the `v-bind:` or `:` prefix, it is treated as a literal string. In most cases, you'd want to use a dynamic binding which expects a full expression instead of a key. For example, in place of:

{% codeblock lang:html %}
<div v-for="item in items" track-by="id">
{% endcodeblock %}

You would now write:

{% codeblock lang:html %}
<div v-for="item in items" v-bind:key="item.id">
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>track-by</code>.</p>
</div>
{% endraw %}

### `v-for` Range Values <sup>changed</sup>

Previously, `v-for="number in 10"` would have `number` starting at 0 and ending at 9. Now it starts at 1 and ends at 10.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Search your codebase for the regex <code>/\w+ in \d+/</code>. Wherever it appears in a <code>v-for</code>, check to see if you may be affected.</p>
</div>
{% endraw %}

## Props

### `coerce` Prop Option <sup>removed</sup>

If you want to coerce a prop, setup a local computed value based on it instead. For example, instead of:

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

You could write:

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

There are a few advantages:

- You still have access to the original value of the prop.
- You are forced to be more explicit, by giving your coerced value a name that differentiates it from the value passed in the prop.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>coerce</code> option.</p>
</div>
{% endraw %}

### `twoWay` Prop Option <sup>removed</sup>

Props are now always one-way down. To produce side effects in the parent scope, a component needs to explicitly emit an event instead of relying on implicit binding. For more information, see:

- [Custom component events](components.html#Custom-Events)
- [Custom input components](components.html#Form-Input-Components-using-Custom-Events) (using component events)
- [Global state management](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>twoWay</code> option.</p>
</div>
{% endraw %}

### `.once` and `.sync` Modifiers on `v-bind` <sup>removed</sup>

Props are now always one-way down. To produce side effects in the parent scope, a component needs to explicitly emit an event instead of relying on implicit binding. For more information, see:

- [Custom component events](components.html#Custom-Events)
- [Custom input components](components.html#Form-Input-Components-using-Custom-Events) (using component events)
- [Global state management](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>.once</code> and <code>.sync</code> modifiers.</p>
</div>
{% endraw %}

### Prop Mutation <sup>deprecated</sup>

Mutating a prop locally is now considered an anti-pattern, e.g. declaring a prop and then setting `this.myProp = 'someOtherValue'` in the component. Due to the new rendering mechanism, whenever the parent component re-renders, the child component's local changes will be overwritten.

Most use cases of mutating a prop can be replaced by one of these options:

- a data property, with the prop used to set its default value
- a computed property

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about prop mutations.</p>
</div>
{% endraw %}

### Props on a Root Instance <sup>replaced</sup>

On root Vue instances (i.e. instances created with `new Vue({ ... })`), you must use `propsData` instead of `props`.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to the fact that props passed to root instances are no longer working.</p>
</div>
{% endraw %}

## Computed properties

### `cache: false` <sup>deprecated</sup>

Caching invalidation of computed properties will be removed in future major versions of Vue. Replace any uncached computed properties with methods, which will have the same result.

For example:

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

Or with component methods:

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
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>cache: false</code> option.</p>
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
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">bantuan migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh atribut <code>*debounce*</code>.</p>
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
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">bantuan migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh atribut .</p>
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
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">bantuan migrasi</a> pada baris kode Anda menemukan contoh-contoh dengan ikatan gaya  <code>*!important*</code> dalam objek.</p>
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
  <p>Jalankan<a href="https://github.com/vuejs/vue-migration-helper">bantuan migrasi</a> dari <i>codebase</i> untuk mencari contoh-contoh <code>v-el</code> dan <code>v-ref</code>.</p>
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
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">bantuan migrasi</a> dari <i>codebase</i> untuk mencari contoh-contoh <code>v-else</code> dengan <code>v-show</code>.</p>
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
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">bantuan migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh pada direktif. <i>Helper</i> akan menandai mereka semua, karena dalam kebanyakan kasus yang ingin Anda <i>refactory</i> ke dalam komponen.</p>
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
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">bantuan migrasi</a> dari <i>codebase</i> Anda untuk mencari contoh-contoh pada direktif modifikasi `.literal`.</p>
</div>
{% endraw %}

## Transitions

### `transition` Attribute <sup>replaced</sup>

Vue's transition system has changed quite drastically and now uses `<transition>` and `<transition-group>` wrapper elements, rather than the `transition` attribute. It's recommended to read the new [Transitions guide](transitions.html) to learn more.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>transition</code> attribute.</p>
</div>
{% endraw %}

### `Vue.transition` for Reusable Transitions <sup>replaced</sup>

With the new transition system, you can now [use components for reusable transitions](transitions.html#Reusable-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.transition</code>.</p>
</div>
{% endraw %}

### Transition `stagger` Attribute <sup>removed</sup>

If you need to stagger list transitions, you can control timing by setting and accessing a `data-index` (or similar attribute) on an element. See [an example here](transitions.html#Staggering-List-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>transition</code> attribute. During your update, you can transition (pun very much intended) to the new staggering strategy as well.</p>
</div>
{% endraw %}

## Events

### `events` option <sup>removed</sup>

The `events` option has been removed. Event handlers should now be registered in the `created` hook instead. Check out the [`$dispatch` and `$broadcast` migration guide](#dispatch-and-broadcast-replaced) for a detailed example.

### `Vue.directive('on').keyCodes` <sup>replaced</sup>

The new, more concise way to configure `keyCodes` is through `Vue.config.keyCodes`. For example:

``` js
// enable v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the the old <code>keyCode</code> configuration syntax.</p>
</div>
{% endraw %}

### `$dispatch` and `$broadcast` <sup>replaced</sup>

`$dispatch` and `$broadcast` have been removed in favor of more explicitly cross-component communication and more maintainable state management solutions, such as [Vuex](https://github.com/vuejs/vuex).

The problem is event flows that depend on a component's tree structure can be hard to reason about and are very brittle when the tree becomes large. They don't scale well and only set you up for pain later. `$dispatch` and `$broadcast` also do not solve communication between sibling components.

One of the most common uses for these methods is to communicate between a parent and its direct children. In these cases, you can actually [listen to an `$emit` from a child with `v-on`](components.html#Form-Input-Components-using-Custom-Events). This allows you to keep the convenience of events with added explicitness.

However, when communicating between distant descendants/ancestors, `$emit` won't help you. Instead, the simplest possible upgrade would be to use a centralized event hub. This has the added benefit of allowing you to communicate between components no matter where they are in the component tree - even between siblings! Because Vue instances implement an event emitter interface, you can actually use an empty Vue instance for this purpose.

For example, let's say we have a todo app structured like this:

```
Todos
├─ NewTodoInput
└─ Todo
   └─ DeleteTodoButton
```

We could manage communication between components with this single event hub:

``` js
// This is the event hub we'll use in every
// component to communicate between them.
var eventHub = new Vue()
```

Then in our components, we can use `$emit`, `$on`, `$off` to emit events, listen for events, and clean up event listeners, respectively:

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
// It's good to clean up event listeners before
// a component is destroyed.
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

This pattern can serve as a replacement for `$dispatch` and `$broadcast` in simple scenarios, but for more complex cases, it's recommended to use a dedicated state management layer such as [Vuex](https://github.com/vuejs/vuex).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>$dispatch</code> and <code>$broadcast</code>.</p>
</div>
{% endraw %}

## Filters

### Filters Outside Text Interpolations <sup>removed</sup>

Filters can now only be used inside text interpolations (`{% raw %}{{ }}{% endraw %}` tags). In the past we've found using filters within directives such as `v-model`, `v-on`, etc led to more complexity than convenience. For list filtering on `v-for`, it's also better to move that logic into JavaScript as computed properties, so that it can be reused throughout your component.

In general, whenever something can be achieved in plain JavaScript, we want to avoid introducing a special syntax like filters to take care of the same concern. Here's how you can replace Vue's built-in directive filters:

#### Replacing the `debounce` Filter

Instead of:

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

Use [lodash's `debounce`](https://lodash.com/docs/4.15.0#debounce) (or possibly [`throttle`](https://lodash.com/docs/4.15.0#throttle)) to directly limit calling the expensive method. You can achieve the same as above like this:

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

For more on the advantages of this strategy, see [the example here with `v-model`](#debounce-Param-Attribute-for-v-model-removed).

#### Replacing the `limitBy` Filter

Instead of:

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

Use JavaScript's built-in [`.slice` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples) in a computed property:

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

#### Replacing the `filterBy` Filter

Instead of:

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

Use JavaScript's built-in [`.filter` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples) in a computed property:

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

JavaScript's native `.filter` can also manage much more complex filtering operations, because you have access to the full power of JavaScript within computed properties. For example, if you wanted to find all active users and case-insensitively match against both their name and email:

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

#### Replacing the `orderBy` Filter

Instead of:

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

Use [lodash's `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (or possibly [`sortBy`](https://lodash.com/docs/4.15.0#sortBy)) in a computed property:

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
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters being used inside directives. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Filter Argument Syntax <sup>changed</sup>

Filters' syntax for arguments now better aligns with JavaScript function invocation. So instead of taking space-delimited arguments:

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

We surround the arguments with parentheses and delimit the arguments with commas:

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the old filter syntax. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Built-In Text Filters <sup>removed</sup>

Although filters within text interpolations are still allowed, all of the filters have been removed. Instead, it's recommended to use more specialized libraries for solving problems in each domain (e.g. [`date-fns`](https://date-fns.org/) to format dates and [`accounting`](http://openexchangerates.github.io/accounting.js/) for currencies).

For each of Vue's built-in text filters, we go through how you can replace them below. The example code could exist in custom helper functions, methods, or computed properties.

#### Replacing the `json` Filter

You actually don't need to for debugging anymore, as Vue will nicely format output for you automatically, whether it's a string, number, array, or plain object. If you want the exact same functionality as JavaScript's `JSON.stringify` though, then you can use that in a method or computed property.

#### Replacing the `capitalize` Filter

``` js
text[0].toUpperCase() + text.slice(1)
```

#### Replacing the `uppercase` Filter

``` js
text.toUpperCase()
```

#### Replacing the `lowercase` Filter

``` js
text.toLowerCase()
```

#### Replacing the `pluralize` Filter

The [pluralize](https://www.npmjs.com/package/pluralize) package on NPM serves this purpose nicely, but if you only want to pluralize a specific word or want to have special output for cases like `0`, then you can also easily define your own pluralize functions. For example:

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

For a very naive implementation, you could do something like this:

{% codeblock lang:js %}
'$' + price.toFixed(2)
{% endcodeblock %}

In many cases though, you'll still run into strange behavior (e.g. `0.035.toFixed(2)` rounds up to `0.04`, but `0.045` rounds down to `0.04`). To work around these issues, you can use the [`accounting`](http://openexchangerates.github.io/accounting.js/) library to more reliably format currencies.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete text filters. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Two-Way Filters <sup>replaced</sup>

Some users have enjoyed using two-way filters with `v-model` to create interesting inputs with very little code. While _seemingly_ simple however, two-way filters can also hide a great deal of complexity - and even encourage poor UX by delaying state updates. Instead, components wrapping an input are recommended as a more explicit and feature-rich way of creating custom inputs.

As an example, we'll now walk the migration of a two-way currency filter:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

It mostly works well, but the delayed state updates can cause strange behavior. For example, click on the `Result` tab and try entering `9.999` into one of those inputs. When the input loses focus, its value will update to `$10.00`. When looking at the calculated total however, you'll see that `9.999` is what's stored in our data. The version of reality that the user sees is out of sync!

To start transitioning towards a more robust solution using Vue 2.0, let's first wrap this filter in a new `<currency-input>` component:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This allows us add behavior that a filter alone couldn't encapsulate, such as selecting the content of an input on focus. Now the next step will be to extract the business logic from the filter. Below, we pull everything out into an external [`currencyValidator` object](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e):

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This increased modularity not only makes it easier to migrate to Vue 2, but also allows currency parsing and formatting to be:

- unit tested in isolation from your Vue code
- used by other parts of your application, such as to validate the payload to an API endpoint

Having this validator extracted out, we've also more comfortably built it up into a more robust solution. The state quirks have been eliminated and it's actually impossible for users to enter anything wrong, similar to what the browser's native number input tries to do.

We're still limited however, by filters and by Vue 1.0 in general, so let's complete the upgrade to Vue 2.0:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You may notice that:

- Every aspect of our input is more explicit, using lifecycle hooks and DOM events in place of the hidden behavior of two-way filters.
- We can now use `v-model` directly on our custom inputs, which is not only more consistent with normal inputs, but also means our component is Vuex-friendly.
- Since we're no longer using filter options that require a value to be returned, our currency work could actually be done asynchronously. That means if we had a lot of apps that had to work with currencies, we could easily refactor this logic into a shared microservice.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters used in directives like <code>v-model</code>. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Slots

### Duplicate Slots <sup>removed</sup>

It is no longer supported to have `<slot>`s with the same name in the same template. When a slot is rendered it is "used up" and cannot be rendered elsewhere in the same render tree. If you must render the same content in multiple places, pass that content as a prop.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about duplicate slots <code>v-model</code>.</p>
</div>
{% endraw %}

### `slot` Attribute Styling <sup>removed</sup>

Content inserted via named `<slot>` no longer preserves the `slot` attribute. Use a wrapper element to style them, or for advanced use cases, modify the inserted content programmatically using [render functions](render-function.html).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find CSS selectors targeting named slots (e.g. <code>[slot="my-slot-name"]</code>).</p>
</div>
{% endraw %}

## Special Attributes

### `keep-alive` Attribute <sup>replaced</sup>

`keep-alive` is no longer a special attribute, but rather a wrapper component, similar to `<transition>`. For example:

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

This makes it possible to use `<keep-alive>` on multiple conditional children:

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">When `<keep-alive>` has multiple children, they should eventually evaluate to a single child. Any child other than the first one will be ignored.</p>

When used together with `<transition>`, make sure to nest it inside:

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find <code>keep-alive</code> attributes.</p>
</div>
{% endraw %}

## Interpolation

### Interpolation within Attributes <sup>removed</sup>

Interpolation within attributes is no longer valid. For example:

``` html
<button class="btn btn-{{ size }}"></button>
```

Should either be updated to use an inline expression:

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

Or a data/computed property:

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

### HTML Interpolation <sup>removed</sup>

HTML interpolations (`{% raw %}{{{ foo }}}{% endraw %}`) have been removed in favor of the [`v-html` directive](../api/#v-html).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find HTML interpolations.</p>
</div>
{% endraw %}

### One-Time Bindings <sup>replaced</sup>

One time bindings (`{% raw %}{{* foo }}{% endraw %}`) have been replaced by the new [`v-once` directive](../api/#v-once).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find one-time bindings.</p>
</div>
{% endraw %}

## Reactivity

### `vm.$watch` <sup>changed</sup>

Watchers created via `vm.$watch` are now fired before the associated component rerenders. This gives you the chance to further update state before the component rerender, thus avoiding unnecessary updates. For example, you can watch a component prop and update the component's own data when the prop changes.

If you were previously relying on `vm.$watch` to do something with the DOM after a component updates, you can instead do so in the `updated` lifecycle hook.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to the fact that a watcher was relying on the old behavior.</p>
</div>
{% endraw %}

### `vm.$set` <sup>changed</sup>

`vm.$set` is now an alias for [`Vue.set`](../api/#Vue-set).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `vm.$delete` <sup>changed</sup>

`vm.$delete` is now an alias for [`Vue.delete`](../api/#Vue-delete).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `Array.prototype.$set` <sup>removed</sup>

Use `Vue.set` instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$set</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>removed</sup>

Use `Array.prototype.splice` instead. For example:

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

Or better yet, pass removal methods an index:

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$remove</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Vue.set` and `Vue.delete` on Vue instances <sup>removed</sup>

`Vue.set` and `Vue.delete` can no longer work on Vue instances. It is now mandatory to properly declare all top-level reactive properties in the data option. If you'd like to delete properties on a Vue instance or its `$data`, set it to null.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.set</code> or <code>Vue.delete</code> on a Vue instance. If you miss any, they'll trigger <strong>console warnings</strong>.</p>
</div>
{% endraw %}

### Replacing `vm.$data` <sup>removed</sup>

It is now prohibited to replace a component instance's root $data. This prevents some edge cases in the reactivity system and makes the component state more predictable (especially with type-checking systems).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of overwriting <code>vm.$data</code>. If you miss any, <strong>console warnings</strong> will be emitted.</p>
</div>
{% endraw %}

### `vm.$get` <sup>removed</sup>

Instead, retrieve reactive data directly.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$get</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## DOM-Focused Instance Methods

### `vm.$appendTo` <sup>removed</sup>

Use the native DOM API:

{% codeblock lang:js %}
myElement.appendChild(vm.$el)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$appendTo</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$before` <sup>removed</sup>

Use the native DOM API:

{% codeblock lang:js %}
myElement.parentNode.insertBefore(vm.$el, myElement)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$before</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$after` <sup>removed</sup>

Use the native DOM API:

{% codeblock lang:js %}
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
{% endcodeblock %}

Or if `myElement` is the last child:

{% codeblock lang:js %}
myElement.parentNode.appendChild(vm.$el)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$after</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$remove` <sup>removed</sup>

Use the native DOM API:

{% codeblock lang:js %}
vm.$el.remove()
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$remove</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Meta Instance Methods

### `vm.$eval` <sup>removed</sup>

No real use. If you do happen to rely on this feature somehow and aren't sure how to work around it, post on [the forum](https://forum.vuejs.org/) for ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$eval</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>removed</sup>

No real use. If you do happen to rely on this feature somehow and aren't sure how to work around it, post on [the forum](https://forum.vuejs.org/) for ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$interpolate</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$log` <sup>removed</sup>

Use the [Vue Devtools](https://github.com/vuejs/vue-devtools) for the optimal debugging experience.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$log</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Instance DOM Options

### `replace: false` <sup>removed</sup>

Components now always replace the element they're bound to. To simulate the behavior of `replace: false`, you can wrap your root component with an element similar to the one you're replacing. For example:

``` js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

Or with a render function:

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
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>replace: false</code>.</p>
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

## Global API

### `Vue.extend` with `el` <sup>removed</sup>

The el option can no longer be used in `Vue.extend`. It's only valid as an instance creation option.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about the <code>el</code> option with <code>Vue.extend</code>.</p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>removed</sup>

Use components instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.elementDirective</code>.</p>
</div>
{% endraw %}

### `Vue.partial` <sup>removed</sup>

Partials have been removed in favor of more explicit data flow between components, using props. Unless you're using a partial in a performance-critical area, the recommendation is to use a [normal component](components.html) instead. If you were dynamically binding the `name` of a partial, you can use a [dynamic component](components.html#Dynamic-Components).

If you happen to be using partials in a performance-critical part of your app, then you should upgrade to [functional components](render-function.html#Functional-Components). They must be in a plain JS/JSX file (rather than in a `.vue` file) and are stateless and instanceless, like partials. This makes rendering extremely fast.

A benefit of functional components over partials is that they can be much more dynamic, because they grant you access to the full power of JavaScript. There is a cost to this power however. If you've never used a component framework with render functions before, they may take a bit longer to learn.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.partial</code>.</p>
</div>
{% endraw %}
