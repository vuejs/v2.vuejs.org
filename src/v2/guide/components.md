---
title: Komponen Dasar
type: guide
order: 11
---

## Contoh Dasar

Berikut ini adalah contoh Vue komponen:

``` js
// Mendefinisikan komponen baru dengan nama button-counter
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">Anda mengklik saya {{ count }} kali.</button>'
})
```

Komponen adalah Vue _instance_ yang dapat digunakan kembali dengan nama: pada kasus ini, `<button-counter>`. Kita bisa menggunakan komponen ini sebagai kustom elemen di dalam _instance_ root Vue yang dibuat dengan `new Vue`:

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

{% codeblock lang:js %}
new Vue({ el: '#components-demo' })
{% endcodeblock %}

{% raw %}
<div id="components-demo" class="demo">
  <button-counter></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">You clicked me {{ count }} times.</button>'
})
new Vue({ el: '#components-demo' })
</script>
{% endraw %}

Karena komponen adalah Vue _instance_ yang bisa digunakan kembali, mereka menerima opsi yang sama dengan `new Vue`, seperti `data`, `computed`, `watch`, `methods`, dan kait siklus hidup (_lifecycle hooks_). Satu-satunya pengecualian adalah beberapa opsi khusus seperti `el`.

## Menggunakan Kembali Komponen

Komponen dapat digunakan kembali sebanyak yang Anda inginkan:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

{% raw %}
<div id="components-demo2" class="demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
<script>
new Vue({ el: '#components-demo2' })
</script>
{% endraw %}

Perhatikan ketika mengklik tombol, masing-masing mempertahankan `count` itu sendiri secara terpisah. Itu karena setiap kali Anda menggunakan komponen, **_instance_** baru akan dibuat.

### `data` Harus Berupa Fungsi

Ketika kita mendefinisikan komponen `<button-counter>`, Anda mungkin memperhatikan bahwa `data` secara tidak langsung berupa sebuah objek, seperti ini:

```js
data: {
  count: 0
}
```

Sebagai gantinya, **opsi `data` pada komponen harus berupa fungsi**, sehingga setiap _instance_ dapat mempertahankan salinan independen dari objek data yang dikembalikan:

```js
data: function () {
  return {
    count: 0
  }
}
```

Jika Vue tidak memiliki aturan ini, maka ketika mengklik satu tombol akan mempengaruhi semua data, seperti di bawah ini:

{% raw %}
<div id="components-demo3" class="demo">
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
</div>
<script>
var buttonCounter2Data = {
  count: 0
}
Vue.component('button-counter2', {
  data: function () {
    return buttonCounter2Data
  },
  template: '<button v-on:click="count++">Anda mengklik saya {{ count }} kali.</button>'
})
new Vue({ el: '#components-demo3' })
</script>
{% endraw %}

## Pengorganisasian Komponen

Biasanya aplikasi diorganisasikan ke dalam kumpulan komponen bersarang:

![Komponen Bersarang](/images/components.png)

Sebagai contoh, Anda mungkin memiliki komponen _header_, bilah samping (_sidebar_), dan area konten, masing-masing biasanya berisi komponen lain untuk tautan navigasi, posting blog, dan sebagainya.

Untuk menggunakan komponen ini dalam templat, mereka harus didaftarkan agar Vue tahu tentang mereka. Ada dua tipe untuk mendaftarkan: **global** dan **local**. Sejauh ini, Kita hanya mendaftarkan komponen secara global, menggunakan `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... opsi ...
})
```

Komponen yang terdaftar secara global dapat digunakan dalam templat dari _instance_ Vue Root (`new Vue`) yang dibuat setelahnya -- dan bahkan di dalam semua sub komponen dari pohon komponen Vue _instance_.

Itu saja yang perlu Anda ketahui tentang pendaftaran untuk saat ini, tetapi setelah selesai membaca halaman ini dan merasa nyaman dengan isinya, kami sarankan untuk kembali lagi nanti untuk membaca panduan lengkap tentang [Mendaftarkan Komponen](components-registration.html).

## Mengoper Data ke Anak Komponen dengan Props

Sebelumnya, kita membuat contoh komponen untuk posting blog. Masalahnya adalah, komponen itu tidak akan berguna kecuali Anda dapat mengoper data ke dalamnya, seperti judul dan konten dari pos tertentu yang ingin kita tampilkan. Di situlah kegunaan _props_.

_Props_ adalah kustom atribut yang dapat Anda daftarkan pada suatu komponen. Ketika nilai diopen ke atibut prop, itu menjadi properti pada _instance_ komponen itu. Untuk mengoper judul ke komponen posting blog, kita dapat memasukannya dalam daftar properti yang diterima komponen ini, menggunakan opsi `props`:

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

Sebuah komponen dapat memiliki dapat memiliki banyak props seperti yang Anda inginkan dan secara default, nilai apa pun dapat diteruskan ke prop apa pun. Dalam templat di atas, Anda akan melihat bahwa kami dapat mengakses nilai ini pada _instance_ komponen, sama seperti dengan `data`.

Setelah prop terdaftar, Anda dapat mengoper data sebagai atribut khusus, seperti ini:

```html
<blog-post title="Perjalanan saya dengan Vue"></blog-post>
<blog-post title="Blogging dengan Vue"></blog-post>
<blog-post title="Kenapa Vue sangat menyenangkan"></blog-post>
```

{% raw %}
<div id="blog-post-demo" class="demo">
  <blog-post1 title="Perjalanan saya dengan Vue"></blog-post1>
  <blog-post1 title="Blogging dengan Vue"></blog-post1>
  <blog-post1 title="Mengapa Vue sangat menyenangkan"></blog-post1>
</div>
<script>
Vue.component('blog-post1', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#blog-post-demo' })
</script>
{% endraw %}

Namun, dalam aplikasi yang khas, Anda kemungkinan akan memiliki serangkaian pos dalam `data`:

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'Perjalanan saya dengan Vue' },
      { id: 2, title: 'Blogging dengan Vue' },
      { id: 3, title: 'Mengapa Vue sangat menyenangkan' }
    ]
  }
})
```

Lalu ingin me-rendernya untuk setiap komponen:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

Di atas, Anda akan melihat bahwa kita dapat menggunakan `v-bind` secara dinamis menggunakan prop. Ini sangat berguna ketika Anda tidak tahu konten pasti yang akan Anda render sebelumnya, seperti saat [mengambil posting dari API](https://jsfiddle.net/chrisvfritz/sbLgr0ad).

Itu saja yang perlu Anda ketahui tentang _props_ untuk saat ini, tetapi setelah selesai membaca halaman ini dan merasa nyaman dengan isinya, kami sarankan untuk kembali lagi nanti untuk membaca panduan lengkap tentang [_Props_](components-props.html).

## Elemen Root Tunggal

Saat membuat komponen `<blog-post>`, templat Anda pada akhirnya akan berisi lebih dari sekedar judul:

```html
<h3>{{ title }}</h3>
```

Setidaknya, Anda ingin memasukan posting konten:

```html
<h3>{{ title }}</h3>
<div v-html="content"></div>
```

Jika Anda mencoba ini di templat Anda, Vue akan memunculkan kesalahan, menjelaskan bahwa **setiap komponen harus memiliki elemen root tunggal**. Anda bisa memperbaiki kesalahan ini dengan membungkus templat dalam elemen induk, seperti:

```html
<div class="blog-post">
  <h3>{{ title }}</h3>
  <div v-html="content"></div>
</div>
```

Seiring komponen tumbuh, kemungkinan kita tidak hanya membutuhkan judul dan konten dari sebuah posting, tetapi juga tanggal diterbitkan, komentar, dan lainnya. Mendefinisikan _prop_ untuk setiap informasi terkait bisa menjadi sangat menjengkelkan:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
  v-bind:content="post.content"
  v-bind:publishedAt="post.publishedAt"
  v-bind:comments="post.comments"
></blog-post>
```

Jadi ini mungkin saat yang tepat untuk memperbaiki komponen `<blog-post>` untuk menerima _prop_ `post` tunggal sebagai gantinya:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:post="post"
></blog-post>
```

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <div v-html="post.content"></div>
    </div>
  `
})
```

<p class="tip">Contoh di atas dan beberapa yang akan datang menggunakan [templat _literal_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) JavaScript untuk membuat templat beberapa baris sehingga lebih mudah dibaca. Ini tidak didukung oleh Internet Explorer (IE), jadi jika Anda harus mendukung IE dan tidak mentranspeksi (contohnya Babel atau TypeScript), gunakan [lolos baris baru](https://css-tricks.com/snippets/javascript/multiline-string-variables-in-javascript/) sebagai gantinya.</p>

Sekarang, properti baru apapun akan di tambahkan ke objek `post`, itu akan otomatis ada didalam `<blog-post>`.

## Memantau _Events_ untuk Anak Komponen 

Saat kita mengembangkan komponen `<blog-post>`, beberapa fitur mungkin membutuhkan komunikasi kembali ke induk. Sebagai contoh, kita mungkin memutuskan untuk memasukan  fitur aksesibilitas untuk memperbesar text posting blog, sambil membiarkan sisa halaman ukuran defaultnya:

Didalam induk, kita akan mendukung fitur ini dengan menambahkan properti data `postFontSize`:

```js
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [/* ... */],
    postFontSize: 1
  }
})
```

Yang dapat digunakan dalam templat untuk mengontrol ukuran font semua posting blog:

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
    ></blog-post>
  </div>
</div>
```

Sekarang mari kita tambahkan tombol untuk memperbesar teks tepat sebelum konten posting:

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button>
        Memperbesar teks
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
```

Masalahnya adalah, tombol ini tidak mendapatkan apa-apa:

```html
<button>
  Memperbesar teks
</button>
```

Ketika kita mengklik tombol, kita perlu untuk berkomunikasi dengan induk bahwa itu harus memperbesar tulisan teks pada semua posting. Untung, Vue _instances_ menyediakan sistem kustom _events_ untuk menyelesaikan masalah ini. Induk dapat memilih untuk memantau _event_ apa pun dengan _instance_ anak komponen dengan `v-on`, sama seperti yang kita lakukan pada _event_ DOM asli:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

Kemudian anak komponen dapat _emit_ (mengeluarkan output) suatu _event_ pada dirinya sendiri dengan memanggil [metode **`$emit`**](../api/#vm-emit) bawaan, mengoper nama dari _event_:

```html
<button v-on:click="$emit('enlarge-text')">
  Enlarge text
</button>
```

Terima kasih kepada _listener_ `v-on:enlarge-text="postFontSize += 0.1"`, induk akan menerima _event_ dan perbaruan isi `postFontSize`.

{% raw %}
<div id="blog-posts-events-demo" class="demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
      v-on:enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
<script>
Vue.component('blog-post', {
  props: ['post'],
  template: '\
    <div class="blog-post">\
      <h3>{{ post.title }}</h3>\
      <button v-on:click="$emit(\'enlarge-text\')">\
        Enlarge text\
      </button>\
      <div v-html="post.content"></div>\
    </div>\
  '
})
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [
      { id: 1, title: 'Perjalanan saya dengan Vue', content: '...content...' },
      { id: 2, title: 'Blogging dengan Vue', content: '...content...' },
      { id: 3, title: 'Mengapa Vue sangat menyenangkan', content: '...content...' }
    ],
    postFontSize: 1
  }
})
</script>
{% endraw %}

### Meng-_Emit_ Nilai dengan _Event_

Ini terkadang berguna untuk meng-_emit_ nilai spesifik dengan _event_. Sebagai contohnya, kita mungkin menginginkan komponen `<blog-post>` bertanggung jawab atas seberapa banyak teks akan diperbesar. Dalam hal itu, kita akan menggunakan parameter ke-2 `$emit` untuk meng-_emit_ nilai ini:

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Memperbesar teks
</button>
```

Kemudian ketika kita memantau _event_ di induk, kita dapat mengakses nilai _event_ yang di berikan dengan `$event`:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

Atau, jika _event handler_ adalah metode:

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

Kemudian nilai akan dikirimkan sebagai parameter pertama dari metode itu:

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Menggunakan `v-model` pada Komponent

Kustom _events_ juga dapat digunakan untuk membuat kustom _input_ yang berkerja dengan `v-model`. Ingat bahwa:

```html
<input v-model="searchText">
```

hal yang sama dengan:

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

Saat digunakan pada komponen, sebagai ganti `v-model` gunakan seperti ini:

``` html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

Agar ini benar-benar berfungsi, `<input>` di dalam komponen harus:

- Mengikat atribut `value` ke `nilai` _prop_
- Pada `input`, _emit event_ kustom `input` dengan nilai baru

Di sinilah beraksi:

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

Sekarang `v-model` seharusnya bekerja dengan sempurna dengan komponen ini:

```html
<custom-input v-model="searchText"></custom-input>
```

Itu saja yang perlu Anda ketahui tentang kustom _events_ komponen untuk saat ini, tetapi setelah selesai membaca halaman ini dan merasa nyaman dengan isinya, kami sarankan untuk kembali lagi nanti untuk membaca panduan lengkap tentang [Custom Events](components-custom-events.html).

## Distribusi Konten dengan Slots

Sama seperti dengan elemen HTML, seringkali berguna untuk dapat mengoper konten ke komponen, seperti ini:

``` html
<alert-box>
  Sesuatu yang buruk telah terjadi.
</alert-box>
```

Yang mungkin me-render sesuatu seperti:

{% raw %}
<div id="slots-demo" class="demo">
  <alert-box>
    Sesuatu yang buruk telah terjadi.
  </alert-box>
</div>
<script>
Vue.component('alert-box', {
  template: '\
    <div class="demo-alert-box">\
      <strong>Kesalahan!</strong>\
      <slot></slot>\
    </div>\
  '
})
new Vue({ el: '#slots-demo' })
</script>
<style>
.demo-alert-box {
  padding: 10px 20px;
  background: #f3beb8;
  border: 1px solid #f09898;
}
</style>
{% endraw %}

Untungnya, tugas ini dibuat sangat sederhana oleh Vue kustom elemen `<slot>`:

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Kesalahan!</strong>
      <slot></slot>
    </div>
  `
})
```

Sama seperti yang Anda lihat di atas, kita hanya menambahkan _slot_ ke tempat yang kita inginkan -- dan hanya itu. Dilakukan!

Itu saja yang perlu Anda ketahui tentang _slots_ untuk saat ini, tetapi setelah selesai membaca halaman ini dan merasa nyaman dengan isinya, kami sarankan untuk kembali lagi nanti untuk membaca panduan lengkap tentang [Slots](components-slots.html).

## Komponen Dinamis

Terkadang, berguna untuk secara dinamis beralih antar komponen, seperti di antarmuka tab. 

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    class="dynamic-component-demo-tab-button"
    v-bind:class="{ 'dynamic-component-demo-tab-button-active': tab === currentTab }"
    v-on:click="currentTab = tab"
  >
    {{ tab }}
  </button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-rumah', { template: '<div>Komponen rumah</div>' })
Vue.component('tab-posting', { template: '<div>Komponen posting</div>' })
Vue.component('tab-arsip', { template: '<div>Komponen arsip</div>' })
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Rumah',
    tabs: ['Rumah', 'Posting', 'Arsip']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
{% endraw %}

Hal di atas dimungkinkan oleh elemen `<component>` Vue dengan spesial atribut `is`:

```html
<!-- Komponen berubah ketika currentTabComponent berubah -->
<component v-bind:is="currentTabComponent"></component>
```

Dalam contoh di atas, `currentTabComponent` dapat berisi:

- nama komponen yang terdaftar, atau
- opsi objek komponen

Lihat [_fiddle_ ini](https://jsfiddle.net/chrisvfritz/o3nycadu/) untuk bereksperimen dengan kode lengkap, atau [versi ini](https://jsfiddle.net/chrisvfritz/b2qj69o1/) untuk contoh yang mengikat ke opsi objek komponen, bukan nama yang terdaftar.

Itu saja yang perlu Anda ketahui tentang komponen dinamis untuk saat ini, tetapi setelah selesai membaca halaman ini dan merasa nyaman dengan isinya, kami sarankan untuk kembali lagi nanti untuk membaca panduan lengkap tentang [Dinamis & Async Komponen](components-dynamic-async.html).

## Peringatan Parsing Templat DOM

Beberapa elemen HTML, seperti `<ul>`, `<ol>`, `<table>` dan `<select>` memiliki batasan pada elemen apa yang dapat muncul di dalamnya, dan beberapa elemen seperti `<li>`, `<tr>`, dan `<option>` hanya dapat muncul di dalam elemen lain tertentu.

ini akan menyebabkan masalah ketika menggunakan komponen dengan elemen yang memiliki batasan seperti itu. Sebagai contoh:

``` html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Komponen khusus `<blog-post-row>` akan diangkat sebagai konten tidak valid, menyebabkan kesalahan pada hasil akhir yang diberikan. Untungnya, atribut spesial `is` menawarkan solusi:

``` html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

Perlu dicatat bahwa **keterbatasan ini tidak berlaku jika Anda menggunakan templat string dari salah satu sumber berikut**:

- String templat (contohnya `template: '...'`)
- [Komponen file tunggal (`.vue`)](single-file-components.html)
- [`<script type="text/x-template">`](components-edge-cases.html#X-Templates)

Itu saja yang perlu Anda ketahui tentang peringatan parsing DOM templat untuk saat ini -- dan sebenarnya, akhir dari hal-hal penting Vue. Selamat! Masih banyak yang harus dipelajari, tetapi pertama-tama, kami sarankan untuk beristirahat sejenak untuk bermain dengan Vue sendiri dan membuat sesuatu yang menyenangkan.

Setelah Anda merasa nyaman dengan pengetahuan yang baru saja Anda cerna, kami sarankan kembali untuk membaca panduan lengkap tentang [Dinamis & Async Komponen](components-dynamic-async.html), serta halaman lain di bagian _in-Depth_ Komponen di bilah samping.