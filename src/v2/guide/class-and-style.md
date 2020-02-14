---
title: Kelas and Binding Gaya
type: guide
order: 6
---

Kebutuhan umum untuk data *binding* adalah untuk memanipulasi daftar kelas dan gaya *inline* milik elemen. Karena keduanya adalah atribut, kita bisa menggunakan `v-bind` untuk menanganinya: kita hanya perlu memperhitungkan *string* terakhir dengan ekspresi kita. Namun, bermain dengan rangkaian *string* itu menjengkelkan dan rawan kesalahan. Untuk alasan ini, Vue menyediakan perangkat khusus saat `v-bind` digunakan untuk `class` dan `style`. Selain *string*, ekspresi juga dapat mengevaluasi objek atau array.

## Binding Kelas HTML

### Sintaksis Objek

Kita dapat mengoper sebuah objek ke `v-bind:class` untuk mengubah `class` secara dinamis

``` html
<div v-bind:class="{ active: isActive }"></div>
```

Sintaksis di atas berarti kehadiran `active` akan ditentukan oleh nilai [kebenaran](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) dari properti data `isActive`.

Anda dapat memiliki beberapa kelas yang akan saling menggantikan dengan menambahkan lebih banyak *field* dalam objek. Selain itu, direktif `v-bind:class` dapat berdampingan dengan atribut `class` biasa. Seperti pada templat berikut:

``` html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Dan data berikut:

``` js
data: {
  isActive: true,
  hasError: false
}
```

Akan menghasilkan:

``` html
<div class="static active"></div>
```

Saat `isActive` atau `hasError` berubah, daftar kelas akan diperbarui. Sebagai contoh, jika `hasError` menjadi `true`, daftar kelas akan menjadi `"static active text-danger "`.

Objek terikat tidak harus sebaris:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

Ini akan membuat hasil yang sama. Kita juga bisa *bind* [computed property](computed.html) yang mengembalikan objek. Ini adalah pola umum yang bagus:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### Sintaksis Array

Kita dapat mengoper sebuah array ke `v-bind:class` untuk menerapkan daftar kelas:

``` html
<div v-bind:class="[activeClass, errorClass]"></div>
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

Yang akan menghasilkan:

``` html
<div class="active text-danger"></div>
```

Jika Anda juga ingin mengganti kelas dalam daftar secara kondisional, Anda dapat melakukannya dengan ekspresi *ternary*:

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

Ini akan selalu menerapkan `errorClass`, dan hanya akan menerapkan `activeClass` ketika `isActive` bernilai benar.

Namun, ini bisa menjadi sedikit bertele-tele jika Anda memiliki beberapa kelas kondisional. Itu sebabnya juga boleh untuk menggunakan sintaksis objek di dalam sintaksis *array*:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### Dengan Komponen

> Bagian ini mengasumsikan pengetahuan tentang [Vue Components](components.html). Silakan lewati dan kembali lagi nanti.

Ketika Anda menggunakan atribut `class` pada komponen kustom, kelas-kelas itu akan ditambahkan ke elemen root komponen. Kelas yang ada pada elemen ini tidak akan ditimpa.

Misalnya, jika Anda mendeklarasikan komponen ini:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

Kemudian tambahkan beberapa kelas saat menggunakannya:

``` html
<my-component class="baz boo"></my-component>
```

HTML yang ditampilkan akan menjadi:

``` html
<p class="foo bar baz boo">Hi</p>
```

Hal yang sama berlaku untuk binding kelas:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Ketika `isActive` benar, HTML yang ditampilkan akan menjadi:

``` html
<p class="foo bar active">Hi</p>
```

## Binding Gaya Sebaris

### Sintaksis Objek

Sintaksis objek untuk `v-bind:style` cukup mudah - terlihat hampir seperti CSS, tetapi itu adalah objek JavaScript. Anda dapat menggunakan *camelCase* atau *kebab-case* (gunakan tanda kutip dengan kebab-case) untuk nama properti CSS:

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

Seringkali adalah ide yang baik untuk *bind* gaya objek secara langsung sehingga templatnya lebih bersih:

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

Sekali lagi, sintaksis objek sering digunakan bersama dengan properti *computed*  yang mengembalikan objek.

### Sintaksis Array

Sintaksis array untuk `v-bind:style` memungkinkan Anda menerapkan beberapa gaya objek ke elemen yang sama:

``` html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### Prefiks Otomatis (Auto-prefixing)

Ketika Anda menggunakan properti CSS yang membutuhkan [vendor prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) di `v-bind:style`, misalnya `transform`, Vue akan secara otomatis mendeteksi dan menambahkan prefiks yang sesuai dengan gaya yang diterapkan.

### Banyak Nilai

> 2.3.0+

Mulai 2.3.0+ Anda dapat memberikan array nilai ganda (prefixed) ke properti gaya, misalnya:

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Ini hanya akan membuat nilai terakhir dalam array yang didukung browser. Dalam contoh ini, ini akan membuat `display: flex` untuk browser yang mendukung versi *flexbox* yang tanpa pefiks.
