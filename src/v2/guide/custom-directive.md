---
title: Direktif Kustom
type: guide
order: 302
---

## Pendahuluan

Selain kumpulan direktif standard (`v-model` dan `v-show`), Vue juga memperbolehkan Anda untuk mendaftarkan direktif kustom milik Anda. Perhatikan bahwa dalam Vue 2.0, bentuk utama dari penggunaan kembali dan abstraksi kode adalah komponen - namun mungkin ada kasus dimana Anda memerlukan akses DOM tingkat rendah pada elemen polos, dan di sini dimana direktif kustom akan tetap bermanfaat. Contoh fokus kepada elemen input, seperti satu ini:

{% raw %}
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
{% endraw %}

Saat halaman dimuat, elemen tersebut akan mendapatkan fokus (perhatikan: `autofocus` tidak bekerja pada Safari seluler). Faktanya, jika Anda belum mengklik hal lain sejak mengunjungi halaman ini, input di atas seharusnya sudah fokus sekarang. Sekarang mari kita bangung direktif yang mencapai hal ini:

``` js
// Mendaftarkan sebuah direktif kustom dengan nama `v-focus`
Vue.directive('focus', {
  // Saat elemen yang terikat dimasukan ke dalam DOM...
  inserted: function (el) {
    // Fokus terhadap elemen
    el.focus()
  }
})
```

Jika Anda ingin mendaftarkan direktif secara lokal, komponen juga menerima opsi `directives`:

``` js
directives: {
  focus: {
    // definisi direktif
    inserted: function (el) {
      el.focus()
    }
  }
}
```

Kemudian di templat, Anda dapat menggunakan atribut `v-focus` baru pada elemen apa pun, seperti ini:


``` html
<input v-focus>
```
 
## Fungsi Kait

Objek definisi direktif dapat menyediakan beberapa fungsi kait (semua opsional):


- `bind`: dipanggil hanya sekali, saat direktif partama kali terikat dengan elemen. Di sini Anda dapat melakukan pekerjaan pengaturan satu kali.

- `inserted`: dipanggil ketika elemen terikat telah dimasukkan ke dalam *node* induknya (ini hanya menjamin keberadaan *node* induknya, tidak harus dalam dokumen).

- `update`: dipanggil ketika komponen yang memuat *VNode* telah diperbarui, __tetapi mungkin sebelum anak-anaknya diperbarui__. Nilai direktif ini mungkin berubah atau mungkin tidak berubah, tetapi Anda dapat melewati pembaruan yang tidak perlu dengan membandingkan nilai saat ini dan lama (lihat di bawah ini pada argumen hook).

<p class="tip">Kami akan membahas VNodes secara lebih rinci [nanti](./render-function.html#The-Virtual-DOM), ketika kita membahas [fungsi render](./render-function.html).</p>

- `componentUpdated`: dipanggil setelah komponen yang memuat *VNode* __dan *VNodes* anak-anaknya__ telah diperbarui.

- `unbind`: dipanggil hanya sekali, ketika direktif terlepas dari elemennya.

Kita akan menjelajahi argumen yang dioper ke kait ini (mis. `el`,` binding`, `vnode`, dan` oldVnode`) di bagian berikutnya.


## Argumen Kait Direktif

Kait direktif dioper argumen ini:

- `el`: Elemen dimana direktif terikat. Ini dapat digunakan secara langsung untuk memanipulasi DOM.
- `binding`: Objek yang berisi properti berikut.
  - `name`: Nama direktif, tanpa awalan `v-`.
  - `value`: Nilai yang dioper ke direktif. Misalnya pada `v-my-directive="1 + 1"`, nilainya akan menjadi `2`.
  - `oldValue`: Nilai sebelumnya, hanya tersedia pada `update` dan `componentUpdated`. Tersedia apakah nilai telah berubah atau tidak.
  - `expression`: Ekspresi dari *binding* sebagai *string*. Misalnya pada `v-my-directive="1 + 1"`, ekspresi akan menjadi `"1 + 1"`.
  - `arg`: Argumen yang dioper ke direktif, jika ada. Misalnya pada `v-my-directive:foo`, argumen akan menjandi `"foo"`.
  - `modifiers`: Objek yang memuat pengubah, jika ada. Misalnya pada `v-my-directive.foo.bar`, objek pengubah menjadi `{ foo: true, bar: true }`.
- `vnode`: *Node* virtual yang dibuat oleh penyusun Vue. Lihat [API VNode](../api/#VNode-Interface) untuk detil lebih lengkap.
- `oldVnode`: Virtual *node* sebelumnya, hanya tersedia pada kait `update` dan `componentUpdated`.

<p class="tip">Terlepas dari `el`, Anda harus memperlakukan argumen ini sebagai hanya-baca dan tidak pernah memodifikasinya. Jika Anda perlu berbagi informasi lintas kait, direkomendasikan untuk melakukannya memlalui elemen [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).</p>

Contoh direktif kustom menggunakan beberapa properti ini:

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

``` js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

{% raw %}
<div id="hook-arguments-example" v-demo:foo.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
</script>
{% endraw %}

## Fungsi Singkatan

Dalam banyak kasus, Anda mungkin menginginkan perilaku yang sama pada `bind` dan` update`, tetapi tidak peduli dengan kait lainnya. Sebagai contoh:

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Objek Literal

Jika direktif yang Anda perlukan memerlukan beberapa nilai, Anda dapat mengirimkan objek JavaScript literal. Ingat, direktif dapat mengambil ekspresi JavaScript yang valid.

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
