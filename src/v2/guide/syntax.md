---
title: Sintaks Templat
type: guide
order: 4
---
Vue.js menggunakan sintaks templat berbasis HTML yang memungkinkan Anda secara deklaratif untuk binding hasil render DOM yang mendasari data dari Vue instance. Semua templat Vue.js adalah HTML yang valid yang dapat diuraikan oleh browser yang sesuai spesifikasi dan pengurai HTML.

Pada dasarnya, Vue mengkompilasi templat ke dalam fungsi render DOM Virtual. Dikombinasikan dengan sistem reaktivitas, Vue mampu secara cerdas mencari tahu jumlah minimum komponen untuk render ulang dan menerapkan jumlah minimal manipulasi DOM ketika state pada app berubah.

Jika Anda terbiasa dengan konsep DOM Virtual dan lebih suka native JavaScript, Anda juga dapat [menulis langsung fungsi render](render-function.html) sebagai pengganti templat, dengan opsi dukungan JSX.

## Interpolasi

### Teks

Bentuk paling mendasar dari data binding adalah interpolasi teks menggunakan sintaksis "Mustache" (kurung kurawal ganda):

```html
<span>Pesan: {{ msg }}</span>
```

Tag mustache akan di ganti dengan nilai property `msg` pada objek data yang sesuai. Ini juga akan diperbarui setiap kali properti objek data `msg` berubah.

Anda juga dapat melakukan interpolasi satu kali yang tidak memperbarui pada perubahan data dengan menggunakan direktif [v-once](../api/#v-once), tetapi perlu diingat ini juga akan mempengaruhi binding lain pada node yang sama:

```html
<span v-once>Ini tidak akan pernah berubah: {{ msg }}</span>
```

### Raw HTML

Tanda mustache menerjemahkan data sebagai teks biasa, bukan HTML. Untuk menghasilkan HTML asli, gunakan direktif `v-html`:

```html
<p>Menggunakan tanda mustache: {{ rawHtml }}</p>
<p>Menggunakan direktif v-html: <span v-html="rawHtml"></span></p>
```

{% raw %}

<div id="example1" class="demo">
  <p>Menggunakan tanda mustache: {{ rawHtml }}</p>
  <p>Menggunakan direktif v-html: <span v-html="rawHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
    return {
      rawHtml: '<span style="color: red">Ini berwarna merah.</span>'
    }
  }
})
</script>
{% endraw %}

Konten `span` akan diganti dengan nilai properti `rawHtml`, diterjemahkan sebagai HTML biasa - binding data diabaikan. Perhatikan bahwa Anda tidak dapat menggunakan `v-html` untuk membuat parsial templat, karena Vue bukan mesin templating berbasis String. Sebaliknya, komponen lebih disukai sebagai unit dasar UI yang bisa digunakan kembali dan komposisi.

<p class="tip">Merender HTML yang berubah-ubah secara dinamis di situs web Anda bisa sangat berbahaya karena dapat mudah terserang [kerentanan XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Gunakan interpolasi HTML pada konten yang terpercaya dan **jangan pernah** pada konten yang disediakan pengguna.</p> 

### Atribut

Tanda mustache tidak dapat digunakan di dalam atribut HTML. Sebagai gantinya, gunakan direktif [v-bind](../api/#v-bind):

```html
<div v-bind:id="dynamicId"></div>
```

Pada kasus atribut tipe boolean, di mana keberadaan nilainya `true`, penggunaan `v-bind` sedikit berbeda. Dalam contoh ini:

```html
<button v-bind:disabled="isButtonDisabled">Tombol</button>
```

Jika `isButtonDisabled` bernilai `null`, `undefined`, atau `false`, atribut `disabled` tidak akan dimasukkan ke dalam elemen `<button>`. 

### Menggunakan Ekspresi JavaScript

Sejauh ini kami hanya binding properti sederhana di templat kami. Tetapi Vue.js sebenarnya mendukung penuh ekspresi JavaScript di dalam semua binding data:

```html
{{ number + 1 }} {{ ok ? 'YES' : 'NO' }} {{ message.split('').reverse().join('')
}}

<div v-bind:id="'list-' + id"></div>
```

Ekspresi ini akan dievaluasi sebagai JavaScript dalam scope data dari Vue instance. Satu batasan adalah bahwa setiap binding hanya dapat berisi **satu ekspresi tunggal (one single expression)**, jadi yang berikut ini **TIDAK** akan berfungsi:

```html
<!-- ini adalah sebuah statemen, bukan sebuah ekspresi: -->
{{ var a = 1 }}

<!-- kontrol flow tidak akan bekerja, gunakan ekspresi ternary -->
{{ if (ok) { return message } }}
```

<p class="tip">Ekspresi templat adalah sandboxed dan hanya memiliki akses ke daftar putih global seperti `Matematika` dan `Tanggal`. Anda tidak boleh mencoba mengakses pendefinisian global dalam ekspresi templat.</p>

## Direktif

Direktif adalah atribut khusus dengan awalan `v-`. Nilai atribut direktif diharapkan menjadi **sebuah ekspresi JavaScript tunggal** (dengan pengecualian `v-for`, yang akan dibahas nanti). Tugas direktif adalah menerapkan efek pada DOM secara reaktif ketika nilai ekspresinya berubah. Mari kita lihat pada contoh terdahulu:

```html
<p v-if="seen">Sekarang Anda bisa melihatku</p>
```

Di sini, direktif `v-if` akan menghapus / memasukkan elemen `<p>` berdasarkan kebenaran dari nilai ekspresi `seen`.

### Argumen

Beberapa direktif dapat mengambil sebuah "argumen", dilambangkan dengan tanda titik dua setelah nama direktif. Misalnya, direktif `v-bind` digunakan untuk memperbarui atribut HTML secara reaktif:

```html
<a v-bind:href="url"> ... </a>
```

Di sini `href` adalah argumen, yang memberitahukan direktif `v-bind` untuk mengikat atribut `href` dengan nilai ekspresi `url`.

Contoh lain adalah direktif `v-on`, sebagai listen event pada DOM:

```html
<a v-on:click="doSomething"> ... </a>
```

Di sini argumennya adalah nama event untuk di listen. Kami akan membicarakan event handling secara lebih rinci.

### Argumen Dinamis

> Terbaru di 2.6.0+

Mulai versi 2.6.0, juga dimungkinkan untuk menggunakan ekspresi JavaScript dalam argumen direktif dengan membungkusnya dengan tanda kurung:

```html
<a v-bind:[namaAtribut]="url"> ... </a>
```

Di sini `namaAtribut` akan dievaluasi secara dinamis sebagai ekspresi JavaScript, dan nilainya yang dievaluasi akan digunakan sebagai nilai akhir untuk argumen. Misalnya, jika instance Vue Anda memiliki properti data, `namaAtribut`, yang nilainya `"href"`, maka binding ini setara dengan `v-bind:href`.

Demikian pula, Anda bisa menggunakan argumen dinamis untuk binding sebuah handler pada nama event yang dinamis:

```html
<a v-on:[namaEvent]="doSomething"> ... </a>
```

Demikian pula, ketika nilai dari `namaEvent` adalah `"focus"`, misalnya, `v-on:[namaEvent]` akan setara dengan `v-on:focus`.
 
#### Batasan Nilai Argumen Dinamis

Argumen dinamis diharapkan untuk mengevaluasi ke string, dengan pengecualian `null`. Nilai khusus `null` dapat digunakan untuk menghapus binding secara eksplisit. Nilai non-string lainnya akan memicu sebuah peringatan.

#### Batasan Ekspresi Argumen Dinamis

<p class="tip">Ekspresi argumen dinamis memiliki beberapa batasan sintaksis karena karakter tertentu tidak valid di dalam nama atribut HTML, seperti spasi dan kutipan. Anda juga harus menghindari huruf besar saat menggunakan templat di-DOM</p>

Misalnya, berikut ini tidak valid:

```html
<!-- Ini akan memicu peringatan kompiler. -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

Solusinya adalah menggunakan ekspresi tanpa spasi atau tanda kutip, atau mengganti ekspresi kompleks dengan properti computed.

Selain itu, jika Anda menggunakan templat di-DOM (templat yang langsung ditulis dalam file HTML), Anda harus menyadari bahwa browser akan memaksa nama atribut menjadi huruf kecil:

```html
<!-- Ini akan dikonversi menjadi v-bind: [someattr] di templat di-DOM. -->
<a v-bind:[someAttr]="value"> ... </a>
```

### Modifier

Modifier (pengubah) adalah postfixes khusus yang dilambangkan dengan titik, yang menunjukkan bahwa direktif harus dibinding dengan cara tertentu. Misalnya, pengubah `.prevent` memberitahu direktif `v-on` untuk memanggil `event.preventDefault()` pada event yang dipicu:

```html
<form v-on:submit.prevent="onSubmit">...</form>
```

Anda akan melihat contoh modifier lain nanti, [untuk `v-on`](events.html#Event-Modifiers) dan [untuk `v-model`](forms.html#Modifiers), ketika kami menjelajahi fitur-fitur tersebut.

## Singkatan

Awalan `v-` berfungsi sebagai isyarat visual untuk mengidentifikasi atribut spesifik Vue di templat Anda. Ini sangat berguna ketika Anda menggunakan Vue.js untuk menerapkan perilaku (behavior) yang dinamis pada beberapa markup yang ada, tetapi dapat terasa tepat untuk beberapa direktif yang sering digunakan. Pada saat yang sama, kebutuhan awalan `v-` menjadi kurang penting ketika Anda membangun [SPA](https://en.wikipedia.org/wiki/Single-page_application), di mana Vue mengelola setiap templat. Oleh karena itu, Vue menyediakan singkatan khusus untuk dua direktif yang paling sering digunakan, `v-bind` dan` v-on`:

### Singkatan `v-bind`

```html
<!-- full syntax -->
<a v-bind:href="url"> ... </a>

<!-- singkatan -->
<a :href="url"> ... </a>

<!-- singkatan dengan argumen dinamis (2.6.0+) -->
<a :[key]="url"> ... </a>
```

### Singkatan `v-on`

```html
<!-- full syntax -->
<a v-on:click="doSomething"> ... </a>

<!-- singkatan -->
<a @click="doSomething"> ... </a>

<!-- singkatan argumen dinamis (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

Mereka mungkin terlihat sedikit berbeda dari HTML normal, tetapi `:` dan `@` adalah karakter yang valid untuk nama atribut dan semua browser yang didukung Vue dapat menguraikannya dengan benar. Selain itu, mereka tidak muncul di hasil markup render. Sintaks singkatan benar-benar opsional, tetapi Anda mungkin akan mengapresiasi ketika Anda mempelajari lebih lanjut tentang penggunaannya nanti.
