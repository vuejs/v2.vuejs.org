---
title: Editable SVG Icon Systems
type: cookbook
order: 4
---

## Contoh Dasar

Ada banyak cara untuk membuat Sistem Ikon SVG, tetapi satu metode yang memanfaatkan kemampuan Vue adalah membuat ikon inline yang dapat diedit sebagai komponen. Beberapa keuntungan dari cara kerja ini adalah:

* mudah diedit dengan cepat
* animatable
* Anda dapat menggunakan alat peraga standar dan standar untuk menjaganya tetap pada ukuran tipikal atau mengubahnya jika perlu
* sebaris, sehingga tidak ada permintaan HTTP yang diperlukan
* dapat diakses secara dinamis

Pertama, kami akan membuat folder untuk semua ikon, dan menamainya dengan cara yang terstandarisasi untuk pengambilan yang mudah:

> components/icons/IconBox.vue
> components/icons/IconCalendar.vue
> components/icons/IconEnvelope.vue

Berikut ini contoh repo untuk memulai, tempat Anda dapat melihat seluruh pengaturan: [https://github.com/sdras/vue-sample-svg-icons/](https://github.com/sdras/vue-sample-svg-icons/)

![Documentation site](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/screendocs.jpg 'Docs demo')

Kami akan membuat komponen ikon dasar  (`IconBase.vue`)  yang menggunakan slot.

```html
<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
```
Anda dapat menggunakan ikon dasar ini sebagai- satu-satunya hal yang perlu Anda perbarui adalah `viewBox` tergantung pada` viewBox` ikon Anda. Di Base Source Code, kami membuat `width`,` height`, `iconColor`, dan nama ikon alat peraga sehingga dapat diperbarui secara dinamis dengan alat peraga. Nama akan digunakan untuk konten `<title>` dan `id` untuk aksesibilitas.

Skrip kami akan terlihat seperti ini, kami akan memiliki beberapa default sehingga ikon kami akan ditampilkan secara konsisten kecuali kami menyatakan sebaliknya:

```js
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
```

Properti `currentColor` yang merupakan default pada form isian akan membuat ikon mewarisi warna teks apa pun yang mengelilinginya. Kita juga bisa memberikan warna berbeda sebagai penyangga jika kita mau.

Kita dapat menggunakannya seperti itu, dengan satu-satunya konten `IconWrite.vue` yang berisi path di dalam ikon:

```html
<icon-base icon-name="write"><icon-write /></icon-base>
```

Sekarang, jika kita ingin membuat banyak ukuran untuk ikon, kita dapat melakukannya dengan sangat mudah:

```html
<p>
  <!-- you can pass in a smaller `width` and `height` as props -->
  <icon-base
    width="12"
    height="12"
    icon-name="write"
  ><icon-write /></icon-base>
  <!-- or you can use the default, which is 18 -->
  <icon-base icon-name="write"><icon-write /></icon-base>
  <!-- or make it a little bigger too :) -->
  <icon-base
    width="30"
    height="30"
    icon-name="write"
  ><icon-write /></icon-base>
</p>
```

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/Screen%20Shot%202018-01-01%20at%204.51.40%20PM.png" width="450" />

## Ikon Beranimasi

Menyimpan ikon dalam komponen sangat berguna ketika Anda ingin menghidupkannya, terutama pada saat interaksi. SVG sebaris memiliki dukungan tertinggi untuk interaksi metode apa pun. Berikut adalah contoh yang sangat mendasar dari ikon yang dianimasikan saat klik:

```html
<template>
  <svg
    @click="startScissors"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    aria-labelledby="scissors"
    role="presentation"
  >
    <title
      id="scissors"
      lang="en"
    >Scissors Animated Icon</title>
    <path
      id="bk"
      fill="#fff"
      d="M0 0h100v100H0z"/>
    <g ref="leftscissor">
      <path d="M..."/>
      ...
    </g>
    <g ref="rightscissor">
      <path d="M..."/>
      ...
    </g>
  </svg>
</template>
```

```js
import { TweenMax, Sine } from 'gsap'

export default {
  methods: {
    startScissors() {
      this.scissorAnim(this.$refs.rightscissor, 30)
      this.scissorAnim(this.$refs.leftscissor, -30)
    },
    scissorAnim(el, rot) {
      TweenMax.to(el, 0.25, {
        rotation: rot,
        repeat: 3,
        yoyo: true,
        svgOrigin: '50 45',
        ease: Sine.easeInOut
      })
    }
  }
}
```

Kami menerapkan `refs` ke grup jalur yang perlu kami pindahkan, dan karena kedua sisi gunting harus bergerak bersamaan, kami akan membuat fungsi yang dapat kami gunakan kembali di mana kami akan melewati` refs`. Penggunaan GreenSock membantu menyelesaikan dukungan animasi dan masalah `transformasi-origin` di seluruh browser.

<p data-height="300" data-theme-id="0" data-slug-hash="dJRpgY" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Editable SVG Icon System: Animated icon" class="codepen">Lihat the Pen <a href="https://codepen.io/team/Vue/pen/dJRpgY/">Sistem Ikon SVG yang Dapat Diedit: Ikon animasi</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) di <a href="https://codepen.io">CodePen</a>.</p><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

<p style="margin-top:-30px">Sangat mudah dicapai! Dan mudah untuk memperbarui dengan cepat Saat Berjalan(Eksekusi).</p>

Anda dapat melihat lebih banyak contoh animasi di repo [here](https://github.com/sdras/vue-sample-svg-icons/)

## Catatan Tambahan

Desainer dapat berubah pikiran. Persyaratan produk berubah. Menyimpan logika untuk seluruh sistem ikon dalam satu komponen dasar berarti Anda dapat dengan cepat memperbarui semua ikon Anda dan menyebarkannya ke seluruh sistem. Bahkan dengan penggunaan ikon loader, beberapa situasi mengharuskan Anda untuk membuat ulang atau mengedit setiap SVG untuk membuat perubahan global. Metode ini dapat menghemat waktu dan rasa sakit Anda.

## Kapan Harus Menghindari Pola Ini

Jenis sistem ikon SVG ini sangat berguna ketika Anda memiliki sejumlah ikon yang digunakan dengan berbagai cara di seluruh situs Anda. Jika Anda mengulangi ikon yang sama berkali-kali pada satu halaman (misalnya tabel raksasa ikon hapus di setiap baris), mungkin lebih masuk akal untuk membuat semua sprite dikompilasi menjadi sprite sheet dan menggunakan tag `<use>` tag untuk memuatnya.

## Pola Alternatif

Perkakas lain untuk membantu mengelola ikon SVG termasuk:

* [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)
* [svgo-loader](https://github.com/rpominov/svgo-loader)

Alat-alat ini membundel SVG pada saat waktu kompilasi, tetapi membuatnya sedikit lebih sulit untuk diedit saat runtime, karena tag `<use>` dapat memiliki masalah lintas-browser yang aneh ketika melakukan sesuatu yang lebih kompleks. Mereka juga meninggalkan Anda dengan dua properti `viewBox` yang bersarang dan dengan demikian dua sistem koordinat. Ini membuat implementasinya sedikit lebih kompleks.