---
title: Membuat Scroll Directives Khusus
type: cookbook
order: 7
---

## Contoh Dasar

Ada kalanya kita ingin menambahkan sedikit perilaku, terutama animasi, untuk melakukan *scroll* di situs. Ada banyak cara untuk melakukannya, tetapi jalur dengan jumlah kode dan dependensi yang paling sedikit adalah menggunakan [*custom directive*](https://vuejs.org/v2/guide/custom-directive.html) untuk membuat kail/*hook* untuk apapun yang memicu *scroll event* tertentu.

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// main app
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        el.setAttribute(
          'style',
          'opacity: 1; transform: translate3d(0, -10px, 0)'
        )
      }
      return window.scrollY > 100
    }
  }
})
```

```html
<div id="app">
  <h1 class="centered">Scroll me</h1>
  <div
    v-scroll="handleScroll"
    class="box"
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

<p class="tip">Ingat! <em>Directive</em> harus didaftarkan sebelum <em>Vue instance</em>.</p>

Kita juga membutuhkan *style property* yang akan mentransiisikan nilai perentara di sini, pada kasus ini:

```css
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="450" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Custom Scroll Directive- CSS Transition" class="codepen">Lihat Pen <a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">Custom Scroll Directive- CSS Transition</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Atau, dengan *GreenScok(GSAP)* atau pustaka animasi *JavaScript* lainnya, kodenya akan menjadi lebih simpel.

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// main app
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        TweenMax.to(el, 1.5, {
          y: -10,
          opacity: 1,
          ease: Sine.easeOut
        })
      }
      return window.scrollY > 100
    }
  }
})
```

Meskipun kita akan menghapus CSS transisi sebelumnya dari impplementasi ini karena sekarang sudah ditangani oleh *JavaScript*

## Manfaat Menggunakan *Custom Directives*

Vue kaya akan pilihan untuk *directives*, sebagian besar mencakup kasus penggunaan yang sangat umum, yang dapat mencipatakan pengalaman pengembang yang sangat produktif. Tetapi jika kamu memiliki *edge case* yang tidak tercakup pada *framework*, Vue dapat mencakup dalam kasus ini juga, karena kamu dapat dengan mudah membuat *custom directive* yang sesuai dengan kebutuhan kamu.

Menambahkan dan menghapus *scroll event* ke elemen adalah kasus penggunaan yang sangat baik untuk teknik ini, karena sama seperti *directive* yang kita pakai, mereka harus dipasangkan ke elemen dan sebaliknya, kita harus menemukan refrensi untuk di DOM. Pola ini menghindari *DOM traversal*, dan membuat logika *event* dipasangkan dengan *node* yamg mengacu padanya.

## Contoh Dunia Nyata: Menggunakan Custom Scroll Directive Untuk Animasi Cascading

Dalam rangka membuat situs yang kohesif, kamu mungkin menemukan bahwa kamu menggunakan kembali tipe animasi dan logika yang sama dibeberapa tempat. Itu terlihat simpel, kita akan membuat *custom directive* yang sangat spesifi, benar? Biasanya, jika kau menggunakan kembali, kamu harus mengubahnya *sedikit* untuk setiap penggunaan.

Untuk membantu kode kita tetap ringkas dan mudah untuk dibaca, kta akan memberikan beberapa argumen yang sudah ditentukan sebelumnya, seperti titik awal dan akhir dari animasi saat kita melakukan *scroll* ke bawah.

**Contoh ini lebih baik dilihat dalam [versi layar penuh](https://s.codepen.io/sdras/debug/078c19f5b3ed7f7d28584da450296cd0).**

<p data-height="500" data-theme-id="5162" data-slug-hash="c8c55e3e0bba997350551dd747119100" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Scrolling Example- Using Custom Directives in Vue" class="codepen">Lihat Pen <a href="https://codepen.io/sdras/pen/c8c55e3e0bba997350551dd747119100/">Scrolling Example- Using Custom Directives in Vue</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Pada demo di atas, masing-masing bagian memiliki dua jenis animasi yang dipicu ketika *scroll*: perubahan animasi, dan animasi gambar yang menggerakkan beberapa *path* di SVG. Kita menggunakan kembali kedua animasi tersebut, sehingga kita dapat membuat *custom directive* masing-masing. Argumen yang kita masukkan akan membantu menjaga semuanya tetap simpel dan dapat digunakan kembali.

Untuk menunjukka bagaimana kita melakukan ini, kita akan meliha pada contoh perubahan bentuk, di mana kita akan membutuhkan *state* mulai dan akhir, serta memberikan nilai pada *path* yang akan kita ubah. Argumen ini masing-masing didefiniskan sebagai `binding.value.foo`:

```js
Vue.directive('clipscroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      var hasRun = false
      if (!hasRun && window.scrollY > binding.value.start) {
        hasRun = true
        TweenMax.to(el, 2, {
          morphSVG: binding.value.toPath,
          ease: Sine.easeIn
        })
      }
      if (window.scrollY > binding.value.end) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})
```

Kita kemudian dapat menggunakan animasi pada *template*, pada kasus ini kita menambahkan *directive* pada `clipPath` *element*, dan memasukkan semua argumen ke *directives* dalam objek.

```html
<clipPath id="clip-path">
  <path
    v-clipscroll="{ start: '50', end: '100', toPath: 'M0.39 0.34H15.99V22.44H0.39z' }"
    id="poly-shapemorph"
    d="M12.46 20.76L7.34 22.04 3.67 18.25 5.12 13.18 10.24 11.9 13.91 15.69 12.46 20.76z"
  />
</clipPath>
```

## Pola Alternatif

*Custom directives* sangatlah berguna, tetapi kamu akan menemukan situasi dimana kamu mebutuhkan sesuatu yang sangat sepesifik yang sudah ada pada *scrolling libraries* sehingga kamu tidak perlu lagi untuk membuatnya dari awal.

[Scrollmagic](http://scrollmagic.io/) memiliki ekosistem yang sangat kaya untuk digunakan, serta dokumentasi yang bagus dan demo yang baik untuk dijelajahi. Ini termasuk, tetapi tidah terbatas pada hal-hal seperti [*parallax*](http://scrollmagic.io/examples/advanced/parallax_scrolling.html), [*cascading pinning*](http://scrollmagic.io/examples/expert/cascading_pins.html), [*section wipes*](http://scrollmagic.io/examples/basic/section_wipes_natural.html), dan [*responsive duration*](http://scrollmagic.io/examples/basic/responsive_duration.html).

