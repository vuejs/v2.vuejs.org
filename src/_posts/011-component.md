---
title: 0.11 Component Tips
date: 2014-12-08 15:02:14
tags:
---

<p class="tip">Note: post ini berisi informasi untuk versi lama 0.11. Silahkan lihat [0.12 release notes](https://github.com/yyx990803/vue/releases) untuk melihat perubahan pada API.</p>

Perilisan dari 0.11 memperkenalkan [banyak perubahan](https://github.com/yyx990803/vue/blob/master/changes.md), tapi yang paling penting adalah bagaimana cara ruang lingkup komponen baru bekerja. Sebelumnya di 0.10.x, komponen mempunyai ruang linkup yang diwariskan sebagai settingan awal. Itu berarti di sebuah template child komponen kalian bisa menghubungkan properti ruang lingkup parent. Ini biasanya berakhir pada komponen dengan hubungan erat, dimana child komponen mengira-ngira pengetahuan dari properti apa yang ada di ruang lingkup parent. Ada juga kemungkinan untuk properti ruang lingkup parent tidak sengaja merujuk di komponen child.

<!-- lebih banyak -->

### Isolasi Ruang Lingkup dan Pengiriman Data

Dimulai di 0.11, semua komponen child punya ruang lingkup terisolasi sebagai settingan awal, dan cara yang disarankan untuk mengendalikan kompenen akses data adalah lewat [Pengiriman Data Jelas](/guide/components.html#Explicit_Data_Passing) menggunakan [`v-with`](/api/directives.html#v-with) atau [`paramAttributes`](/api/options.html#paramAttributes).

`paramAttributes` memperbolehkan kita untuk menulis template komponen tampilan web:

``` js
Vue.component('my-component', {
  paramAttributes: ['params'],
  compiled: function () {
    console.log(this.params) // diwariskan dari parent
  }
})
```

``` html
<my-component params="{{params}}"></my-component>
```

### Darimana Asalnya?

Sebelumnya di 0.10, semua arahan pada elemen wadah komponen dikompilasi di komponen ruang lingkup child. Karena mewariskan ruang lingkup parent, hal ini sering bekerja di beberapa situasi. Dimulai di 0.11.1, kita ingin menyediakan pemisahan yang lebih rapi antara komponen ruang lingkup. Peraturan thumbs adalah: jika sesuatu muncul di template parent, itu akan dikompilasi di ruang lingkup parent; jika itu muncul di template child, itu akan dikompilasi di ruang lingkup child. Sebagai contoh:

``` html
<!-- template parent -->
<div v-component="child" v-on="click:onParentClick">
  <p>{{Pesanparent}}</p>
</div>
```

``` html
<!-- template child, dengan pergantian: true -->
<div v-on="click:onChildClick">
  <h1>{{Pesanchild}}</h1>
  <content></content>
</div>
```

Segala hal yang ada di template parent akan dikompilasi di ruang lingkup parent, termasuk konten yang akan dimasukkan ke dalam komponen child.

Satu-satunya pengecualian pada peraturannya adalah `v-with` (dan `paramAttributes` yang dikompilasi menjadi `v-with`), dimana bekerja di kedua tempat - jadi kalian tidak perlu terlalu mencemaskannya.

### Komunikasi Event yang Lebih Rapi

Sebelumnya cara standar untuk sebuah komponen child untuk berkomunikasi dengan parent adalah lewat event pelepasan. Namun, dengan cara ini, pendengar event di komponen parent tidak terjamin untuk hanya mendengarkan komponen child yang diinginkan. Dan juga berkemungkinan untuk memicu pendengar yang tidak diinginkan masuk lebih dalam jika kita tidak membatalkan the event.

Kasus penggunaan yang paling umum adalah untuk parent bereaksi ke events dari sebuah spesifik, komponen child langsung. Jadi di 0.11.4, [arahan baru `v-events`](/api/directives.html#v-events) telah diperkenalkan untuk mengaktifkan perilaku ini.

0.11.4 sudah rilis, cobalah!
