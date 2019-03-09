---
title: Custom Events
type: guide
order: 103
---

> Halaman ini berasumsi Anda telah membaca [dasar-dasar komponen](components.html). Baca halaman itu terlebih dahulu bila Anda belum mengerti komponen.

## Nama *Event*

Tidak seperti komponen dan props, nama *event* tidak menyediakan transofrmasi kata secara otomatis.
Sebaliknya, nama event yang di *emit* harus sama dengan nama *event* yang didengarkan. Sebagai contoh jika melakukan *emit* pada *event* dengan *camelCase*:
 

```js
this.$emit('myEvent')
```

Mendengarkan menggunakan *kebab-cased* tidak akan memberikan efek

```html
<!-- Won't work -->
<my-component v-on:my-event="doSomething"></my-component>
```

Tidak seperti komponen dan props, nama *event* tidak akan pernah digunakan sebagai nama variabel atau properti di dalam JavaScript, jadi tidak ada alasan untuk menggunakan kata dengan *camelCase* atau *PascalCase*. Selain itu, *listener* *event* `v-on` di dalam *template* DOM akan secara otomatis diubah menjadi huruf kecil (karena HTML tidak peka terhadap besar kecil huruf), jadi `v-on:myEvent` akan menjadi `v-on:myevent` -- membuat `myEvent` tidak mungkin untuk didengarkan

Karena alasan tersebut, kami merekomendasikan kamu  **selalu gunakan *kebab-case* untuk nama *event***

## Menyesuaikan Komponen `v-model`

> Baru di 2.2.0+

Secara standar, `v-model` pada sebuah komponen menggunakan `value` sebagai prop dan `input` sebagai *event*, tetapi beberapa tipe *input* seperti *checkbox* dan *radio button* mungkin menggunakan atribut `value` untuk sebuah [different purpose] (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value). Menggunakan opsi `model` dapat menghindari konflik dalam kasus-kasus seperti:

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

Sekarang ketika menggunakan `v-model` pada komponen ini

```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```

nilai dari `lovingVue` akan dioper ke prop `checked`. Properti `lovingVue` kemudian akan diperbarui ketika `<base-checkbox>` melakukan *emit* pada sebuah *event* bernama `change` dengan nilai yang baru.

<p class="tip">Catatan bahwa anda masih harus mendeklarasikan<code>checked</code> prop di dalam opsi <code>props</code> komponen.</p>

## *Binding Native Events* ke Komponen

Mungkin ada saat-saat anda ingin mendengarkan secara langsung ke *native event* pada sebuah elemen utama dari sebuah komponen. Dalam kasus ini, anda dapat menggunakan `.native` *modifier* untuk `v-on`

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

Terkadang ini berguna, tetapi ini bukan ide yang bagus ketika kamu mencoba untuk mendengarkan sebuah elemen khusus, seperti `<input>`. Sebagai contoh, komponen `<base-input>` diatas mungkin harus diperbaiki agar elemen akar yang sebenarnya adalah elemen `<label>` 

```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

Dalam kasus ini, *listener* `.native` dalam induk komponen akan diam-diam berhenti. Tidak akan terjadi kesalahan, tetapi *handler* `onFocus` tidak akan dipanggil ketika kita mengharapkannya.

Untuk mengatasi masalah ini, Vue menyediakan properti `$listeners` yang berisi objek *listener* yang digunakan pada komponen. Sebagai contoh :

```js
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

Menggunakan properti `$listeners`, kamu dapat meneruskan semua *listener* *event* pada komponen ke elemen anak khusus dengan `v-on="$listeners"`. Sebagai contoh seperti `<input>`, bahwa kamu juga ingin bekerja dengan `v-model`, ini akan sering berguna untuk membuat sebuah *computed* properti baru untuk *listener*, seperti `inputListener` dibawah ini :

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` menggabungkan objek bersama untuk membentuk objek baru
      return Object.assign({},
        // Kita menambahkan semua pendengar dari induk
        this.$listeners,
        // Kemudian kita bisa menambahkan *listener* modifikasi atau mengesampingkan kebiasaan
        // dari beberapa *listener*
        {
          // Ini memastikan komponen bekerja dengan v-model
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

Sekarang komponen `<base-input>` adalah sebuah **pembungkus yang sepenuhnya transparan**, artinya dapat digunakan persis seperti elemen `<input>` normal: semua atribut dan *listener* akan bekerja, tanpa *modifier* `.native`

## *Modifier* `.sync`

> Baru di 2.3.0+

Dalam beberapa kasus, kita mungkin memerlukan *binding* dua arah untuk sebuah prop. sayangnya *binding* dua arah yang benar dapat menciptakan pemeliharaan masalah, karena komponent anak dapat mengubah induk tanpa sumber perubahan itu menjadi jelas di induk dan di anak

Karena itu, kami merekomendasikan dalam melakukan *emit* pada sebuah *event* dalam pola `update:myPropName`. Sebagai contoh, dalam sebuah komponen hipotesis dengan sebuah `title` prop, kita tidak dapat menyampaikan maksud pemberian nilai baru dengan :

```js
this.$emit('update:title', newTitle)
```

Kemudian induk akan mendengarkan ke *event* tersebut dan memperbarui properti data lokal, jika diinginkan. Sebagai contoh :

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

Untuk kenyamanan, kami menawarkan singkatan untuk pola ini dengan `.sync` *modifier*

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

<p class="tip">Catatan <code>v-bind</code> dengan *modifier* <code>.sync</code> <strong>tidak</strong> bekerja dengan ekspresi (e.g. <code>v-bind:title.sync="doc.title + '!'"</code> adalah tidak valid). Sebaliknya, Anda hanya harus memberikan nama dari properti yang anda ingin *bind*, mirip dengan <code>v-model</code>.</p>

Pengubah `.sync` dapat juga digunakan dengan `v-bind` ketika menggunakan sebuah objek untuk mengatur beberapa props sekaligus

```html
<text-document v-bind.sync="doc"></text-document>
```

Ini meneruskan setiap properti di objek `doc` (Contoh. `title`) sebagai sebuah prop individu, 
kemudian tambahkan `v-on` perbarui untuk masing-masing

<p class="tip">Menggunakan <code>v-bind.sync</code> dengan objek literal, seperti di <code>v-bind.sync="{ title: doc.title }"</code>, tidak akan berfungsi, karena ada terlalu banyak kasus baru untuk dipertimbangkan dalam menguraikan ekspresi kompleks seperti ini</p>
