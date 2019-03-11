---
title: Transisi Masuk/Pergi & Daftar
type: guide
order: 201
---

## Ikhtisar

Vue menyediakan berbagai cara untuk menerapkan efek transisi ketika ada item yang dimasukan, diubah, atau dikeluarkan dari DOM. Hal ini termasuk alat untuk:

- secara otomatis menerapkan kelas untuk transisi dan animasi CSS
- Mengintegrasikan pustaka (_library_) CSS untuk animasi yang berasal dari pihak-ketiga, seperti Animate.css
- menggunakan JavaScript untuk secara langsung memanipulasi DOM pada waktu _hook_ transisi
- Mengintegrasikan pustaka (_library_) JavaScript untuk animasi yang berasal dari pihak-ketiga, seperti Velocity.js

Pada halaman ini, kita hanya akan membahas tentang transisi masuk, keluar, dan daftar, tetapi anda dapat melihat bahian berikutnya untuk [mengatur transisi state](transitioning-state.html).

## Transisi Elemen/Komponen Tunggal

Vue menyediakan komponen pembungkus transisi (`transition` wrapper component), yang memperbolehkan anda untuk menambahkan transisi masuk/keluar untuk setiap elemen atau komponen dalam konteks berikut:

- Me-render sesuai kondisi (menggunakan `v-if`)
- Menampilkan sesuai kondisi (menggunakan `v-show`)
- Komponen dinamis (Dynamic components)
- Root node komponen

Berikut ini adalah sebuah contoh transisi dalam aksinya:

``` html
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
```

``` css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active di bawah versi 2.1.8 */ {
  opacity: 0;
}
```

{% raw %}
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="demo-transition">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>
<style>
.demo-transition-enter-active, .demo-transition-leave-active {
  transition: opacity .5s
}
.demo-transition-enter, .demo-transition-leave-to {
  opacity: 0
}
</style>
{% endraw %}

Ketika sebuah elemen yang dibungkus di dalam komponen transisi dimasukkan atau dikeluarkan, inilah yang terjadi:

1. Vue akan secara otomatis memeriksa apakah elemen sasaran telah menerapkan transisi atau animasi CSS.

2. Jika komponen transisi menyediakan [hook JavaScript](#JavaScript-Hooks), hook ini akan dipanggil pada waktu yang telah seuaikan.

3. Jika tidak ada transisi/animasi CSS yang terdeteksi dan tidak ada hook JavaScript yang tersedia, operasi DOM untuk memasukan dan/atau mengeluarkan akan dieksekusi secepatnya pada _frame_ berikutnya. (Catat: ini adalah frame animasi dari browser, berbeda dengan konsep `nextTick` pada Vue).

### Kelas-kelas Transisi

Ada enam kelas yang diterapkan untuk transisi masuk/pergi.

1. `v-enter`: _State_ (keadaan) awal untuk proses masuk. Ditambahkan sebelum elemen dimasukkan, dilepaskan satu frame setelah elemen dimasukkan.

2. `v-enter-active`: state aktif untuk proses masuk. Diaplikasikan selama seluruh fase proses memasukkan. Ditambahkan sebelum elemen dimasukkan, dilepaskan ketika transisi/animasi selesai. Kelas ini dapat digunakan untuk menentukan durasi, penundaan (delay) dan kurva pelonggaran (easing curve) untuk transisi masuk.

3. `v-enter-to`: **hanya tersedia pada versi 2.1.8+.** state akhir untuk proses masuk. Ditambahkan satu frame setelah elemen dimasukkan (pada saat yang sama `v-enter` dilepaskan), dilepaskan ketika transisi/animasi selesai.

4. `v-leave`: State awal untuk proses pergi. Ditambahkan secepatnya ketika transisi pergi dipicu, dilepaskan setelah satu frame.

5. `v-leave-active`: State aktif untuk proses pergi. Diaplikasikan selama seluruh fase proses pergi. Ditambahkan secepatnya ketika transisi pergi dipicu, dilepaskan ketika transisi/animasi selesai. Kelas ini dapat digunakan untuk menentukan durasi, penundaan (delay) dan kurva pelonggaran (easing curve) untuk transisi pergi.

6. `v-leave-to`: **hanya tersedia pada versi 2.1.8+.** State akhir untuk proses pergi. Ditambahkan satu frame setelah transisi pergi dipicu (pada saat yang sama `v-leave` dilepaskan), dilepaskan ketika transisi/animasi selesai.

![Transition Diagram](/images/transition.png)

Setiap kelas ini akan diawali dengan nama transisi. Di sini awalan `v-` adalah default jika anda menggunakan elemen `<transition>` tanpa nama. Sebagai contoh jika anda menggunakan `<transition name="my-transition">`, maka sebagi gantinya kelas `v-enter` akan menjadi `my-transition-enter`.

`v-enter-active` dan `v-leave-active` memberikan anda kemampuan untuk menentukan kurva pelonggaran yang berbeda untuk transisi masuk/pergi, yang mana akan dapat anda lihat contohnya pada bagian berikutnya.

### Transisi CSS

Salah satu dari banyak tipe transisi yang umum menggunakan transisi CSS. Inilah salah satu contohnya:

``` html
<div id="example-1">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
```

``` css
/* Animasi Masuk dan Pergi dapat menggunakan fungsi */
/* durasi dan pengaturan waktu yang berbeda.        */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active di bawah versi 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
```

{% raw %}
<div id="example-1" class="demo">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
{% endraw %}

### Animasi CSS

Animasi CSS diaplikasikan dengan cara yang sama seperti transisi CSS, perbedaannya adalah bahwa `v-enter` tidak dilepaskan secepatnya setelah elemen dimasukkan, tetapi pada sebuah event `animationend`.

Berikut ini adalah sebuah contoh, menghilangkan aturan prefix CSS supaya ringkas:

``` html
<div id="example-2">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
```

``` css
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

{% raw %}
<div id="example-2" class="demo">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-show="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>

<style>
  .bounce-enter-active {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    -webkit-animation: bounce-in .5s reverse;
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
<script>
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### Kelas Transisi _Custom_

Anda juga dapat menentukan kelas transisi custom dengan menyediakan atribut-atribut berikut:

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

Atribut - atribut ini akan mengabaikan nama kelas konvensional. Ini terutama berguna ketika anda ingin mengkombinasikan sistem transisi Vue dengan sebuah pustaka animasi CSS yang sudah ada, seperti [Animate.css](https://daneden.github.io/animate.css/).

Berikut contohnya:

``` html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
```

{% raw %}
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
<div id="example-3" class="demo">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### Menggunakan Transisi dan Animasi Bersama

Vue perlu melampirkan pendengar event (event listener) agar dapat mengetahui ketika sebuah event telah selesai. Hal ini dapat berupa salah satu antara `transitionend` atau `animationend`, tergantung dari tipe aturan css yang diterapkan. Jika anda hanya menggunakan salah satu atau yang lain, Vue dapat secara otomatis mendeteksi tipe yang tepat.

Namun, pada beberapa kasus anda mungkin ingin menggunakan keduanya dalam elemen yang sama, sebagai contoh memiliki sebuah animasi CSS yang dipicu oleh Vue, bersamaan dengan efek transisi CSS saat event _hover_. Pada kasus ini, anda harus secara eksplisit mendeklarasikan tipe yang anda ingin dipedulikan oleh Vue pada attribut `type`, dengan nilai antara `animation` atau `transition`.

### Durasi Transisi yang Eksplisit

> Baru di 2.2.0+

Pada banyak kasus, Vue dapat secara otomatis mengetahui ketika transisi telah selesai. Secara default, Vue menunggu event `transitionend` atau `animationend` yang pertama pada elemen transisi root. Namun, ini mungkin tidak selalu diharapkan - sebagai contoh, kita mungkin memiliki urutan koreografi transisi dimana beberapa elemen dalam bersarang memiliki transisi yang tertunda atau durasi transisi yang lebih lama dibanding elemen transisi root.

Pada kasus seperti itu anda dapat menentukan durasi transisi yang eksplisit (dalam milliseconds) menggunakan prop `duration` pada komponen `<transition>`:

``` html
<transition :duration="1000">...</transition>
```

Anda juga dapat menentukan nilai terpisah antara durasi masuk dan pergi:

``` html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### Hook JavaScript

Anda juga dapat mendefinisikan hook JavaScript pada atribut:

``` html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

``` js
// ...
methods: {
  // --------
  // MASUK
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // callback done opsional ketika
  // digunakan dalam kombinasi dengan CSS
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // PERGI
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // callback done opsional ketika
  // digunakan dalam kombinasi dengan CSS
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled hanya tersedia dengan v-show
  leaveCancelled: function (el) {
    // ...
  }
}
```

Hook-hook ini dapat digunakan dalam kombinasi dengan transisi/animasi CSS atau digunakan sendiri.

<p class="tip">Ketika menggunakan transisi yang hanya-JavaScript, **callback `done` diwajibkan untuk hook `enter` dan `leave`**. Jika tidak, hook akan dipanggil secara sinkronis dan transisi akan selesai secepatnya.</p>

<p class="tip">Adalah ide bagus untuk secara eksplisit menambahkan `v-bind:css="false"` untuk transisi yang hanya-JavaScript sehingga Vue dapat melewatkan deteksi CSS. Ini juga dapat menghindarkan aturan CSS dari secara tidak sengaja ikut campur dalam transisi.</p>

Sekarang mari terjun dalam sebuah contoh. Ini adalah sebuah transisi JavaScript menggunakan Velocity.js:

``` html
<!--
Velocity bekerja hampir seperti jQuery.animate dan merupakah
opsi yang hebat untuk animasi JavaScript
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="example-4">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
```

{% raw %}
<div id="example-4" class="demo">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script>
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
</script>
{% endraw %}

## Transisi pada Render Awal

Jika anda juga ingin menerapkan transisi pada render awal sebuah node, anda dapat menambahkan atribut `appear`:

``` html
<transition appear>
  <!-- ... -->
</transition>
```

Secara default, ini akan menggunakan transisi yang ditentukan untuk masuk dan pergi. Namun jika anda mau, anda juga dapat menentukan kelas CSS custom:

``` html
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (2.1.8+)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```

dan hook JavaScript custom:

``` html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

## Transisi Antar Elemen

Kita membahas [transisi antar komponen](#Transitioning-Between-Components) nanti, tetapi anda juga dapat melakukan transisi antar elemen mentah menggunakan `v-if`/`v-else`. Satu dari banyak transisi antara dua-elemen yang umum adalah antara penampung daftar (list container) dan pesan yang menjelaskan daftar kosong:

``` html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```

Ini bekerja dengan baik, tetapi ada satu peringatan yang harus kita sadari:

<p class="tip">Ketika berpindah antar elemen yang memiliki **tag nama yang sama**, anda harus memberi tahu Vue bahwa mereka adalah elemen yang berbeda dengan memberikan mereka atribut `key` yang unik. Jika tidak, kompiler Vue hanya mengganti isi dari elemen untuk efisiensi. Meskipun secara teknis tidak perlu, **dianggap sebagai praktek yang baik untuk selalu memberikan kunci (key) pada banyak item di dalam komponen `<transition>`.**</p>

Sebagai contoh:

``` html
<transition>
  <button v-if="isEditing" key="save">
    Save
  </button>
  <button v-else key="edit">
    Edit
  </button>
</transition>
```

Dalam Kasus ini, anda juga dapat menggunakan atribut `key` untuk bertransisi antara state yang berbeda pada elemen yang sama. Daripada menggunakan `v-if` dan `v-else`, contoh di atas dapat ditulis ulang menjadi:

``` html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Save' : 'Edit' }}
  </button>
</transition>
```

Sebenarnya mungkin untuk melakukan transisi antara elemen berapapun jumlahnya, baik dengan menggunakan banyak `v-if` atau menautkan elemen tunggal pada properti dinamis. Sebagai contoh:

``` html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

Yang bisa ditulis ulang menjadi:

``` html
<transition>
  <button v-bind:key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

``` js
// ...
computed: {
  buttonMessage: function () {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```

### Mode Transisi

Meskipun demikian masih ada satu masalah. Coba tekan (click) tombol di bawah:

{% raw %}
<div id="no-mode-demo" class="demo">
  <transition name="no-mode-fade">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#no-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-fade-enter-active, .no-mode-fade-leave-active {
  transition: opacity .5s
}
.no-mode-fade-enter, .no-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

Selama proses transisi antara tombol "on" dan tombol "off", kedua tombol di-render - satu bertransisi keluar sementara yang lain bertransisi ke dalam. ini merupakan perilaku default dari `<transition>` - masuk dan pergi terjadi secara bersamaan.

Kadang ini bekerja dengan baik, Seperti ketika item yang bertransisi benar-benar diposisikan satu di atas yang lain:

{% raw %}
<div id="no-mode-absolute-demo" class="demo">
  <div class="no-mode-absolute-demo-wrapper">
    <transition name="no-mode-absolute-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-absolute-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-absolute-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-absolute-demo-wrapper button {
  position: absolute;
}
.no-mode-absolute-fade-enter-active, .no-mode-absolute-fade-leave-active {
  transition: opacity .5s;
}
.no-mode-absolute-fade-enter, .no-mode-absolute-fade-leave-active {
  opacity: 0;
}
</style>
{% endraw %}

Dan nanti mungkin juga ditranslasikan sehingga mereka terlihat seperti transisi meluncur.

{% raw %}
<div id="no-mode-translate-demo" class="demo">
  <div class="no-mode-translate-demo-wrapper">
    <transition name="no-mode-translate-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-translate-demo-wrapper button {
  position: absolute;
}
.no-mode-translate-fade-enter-active, .no-mode-translate-fade-leave-active {
  transition: all 1s;
}
.no-mode-translate-fade-enter, .no-mode-translate-fade-leave-active {
  opacity: 0;
}
.no-mode-translate-fade-enter {
  transform: translateX(31px);
}
.no-mode-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

Meskipun demikian transisi masuk dan pergi tidak selalu diharapkan, sehingga vue mengajukan **mode transisi** sebagai alternatif:

- `in-out`: Elemen baru melakukan transisi masuk terlebih dahulu, lalu ketika selesai, elemen saat ini melakukan transisi keluar.

- `out-in`: Elemen saat ini melakukan transisi keluar terlebih dahulu, lalu ketika selesai, elemen baru melakukan transisi masuk.

Sekarang mari ubah transisi untuk tombol on/off kita dengan `out-in`:

``` html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

{% raw %}
<div id="with-mode-demo" class="demo">
  <transition name="with-mode-fade" mode="out-in">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#with-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.with-mode-fade-enter-active, .with-mode-fade-leave-active {
  transition: opacity .5s
}
.with-mode-fade-enter, .with-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

Dengan satu tambahan atribut, kita memperbaiki transisi asli tanpa harus menambahkan suatu gaya (styling) khusus.

Mode `in-out` tidak sering digunakan, namun kadan dapat berguna untuk efek transisi yang sedikit berbeda. Mari kita coba untuk mengkombinasikannya dengan transisi slide-fade yang kita kerjakan sebelumnya:

{% raw %}
<div id="in-out-translate-demo" class="demo">
  <div class="in-out-translate-demo-wrapper">
    <transition name="in-out-translate-fade" mode="in-out">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#in-out-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.in-out-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.in-out-translate-demo-wrapper button {
  position: absolute;
}
.in-out-translate-fade-enter-active, .in-out-translate-fade-leave-active {
  transition: all .5s;
}
.in-out-translate-fade-enter, .in-out-translate-fade-leave-active {
  opacity: 0;
}
.in-out-translate-fade-enter {
  transform: translateX(31px);
}
.in-out-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

Cukup keren, bukan?

## Transisi Antar Komponen 

Transisi antar komponen bahkan lebih sederhana - kita bahkan tidak membutuhkan atribut `key`. Sebagai gantinya, kita membungkus sebuah [komponen dinamis](components.html#Dynamic-Components):

``` html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
```

``` js
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
```

``` css
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active di bawah versi 2.1.8 */ {
  opacity: 0;
}
```

{% raw %}
<div id="transition-components-demo" class="demo">
  <input v-model="view" type="radio" value="v-a" id="a" name="view"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b" name="view"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component v-bind:is="view"></component>
  </transition>
</div>
<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
<script>
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
</script>
{% endraw %}

## Transisi Daftar

Sejauh ini, kita menangani transisi untuk:

- Node individual
- Banyak node dimana hanya 1 yang di-render dalam suatu waktu

Jadi bagaimana ketika kita memiliki keselurahan daftar item yang ingin kita render secara bersamaan, sebagai contoh dengan `v-for`? Dalam kasus ini, kita akan menggunakan komponen `<transition-group>`. 
So what about for when we have a whole list of items we want to render simultaneously, for example with `v-for`? In this case, we'll use the `<transition-group>` component. Bagaimanapun sebelum kita masuk pada sebuah contoh, ada beberapa hal yang penting untuk diketahui mengenai komponen ini:

- Tidak seperti `<transition>`, komponen ini me-render elemen yang nyata: secara default elemen `<span>`. Anda dapat mengganti elemen yang di-render dengan atribut `tag`.
- [Mode transisi](#Transition-Modes) tidak tersedia, karena kita tidak lagi bergantian antar elemen yang saling eksklusif.
- Elemen-elemen di dalamnya **selalu diwajibkan** untuk memiliki atribut `key` yang unik.

### Transisi Masuk/Pergi Daftar

Sekarang mari masuk pada sebuah contoh, bertransisi masuk dan pergi menggunakan kelas CSS yang sama seperti yang kita gunakan sebelumnya:

``` html
<div id="list-demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
```

``` css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active di bawah versi 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
```

{% raw %}
<div id="list-demo" class="demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
{% endraw %}

Ada satu masalah dengan contoh ini. Ketika anda menambahkan atau menghapus item, item disekitarnya malah secara instan bergerak langsung ke tempatnya yang baru dan tidak bertransisi secara mulus. Kita akan memperbaikinya nanti.

### Transisi Daftar Bergerak

Komponen `<transition-group>` memiliki trik lain diatas lengannya. Ia tidak hanya menganimasi masuk dan pergi, tetapi juga mengganti posisi. Satu-satunya konsep baru yang perlu anda ketahui untuk menggunakan fitur ini adalah tambahan **kelas `v-move`**, yang mana ditambahkan ketika item berganti posisi. Seperti kelas yang lainnya, Prefixnya akan disesuaikan dengan nilai dari attribut `name` yang disediakan dan anda juga dapat secara manual menentukan kelas dengan atribut `move-class`.

This class is mostly useful for specifying the transition timing and easing curve, as you'll see below:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" v-bind:key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.flip-list-move {
  transition: transform 1s;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>
{% endraw %}

This might seem like magic, but under the hood, Vue is using an animation technique called [FLIP](https://aerotwist.com/blog/flip-your-animations/) to smoothly transition elements from their old position to their new position using transforms.

We can combine this technique with our previous implementation to animate every possible change to our list!

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list-complete" tag="p">
    <span
      v-for="item in items"
      v-bind:key="item"
      class="list-complete-item"
    >
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list-complete" tag="p">
    <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
{% endraw %}

<p class="tip">One important note is that these FLIP transitions do not work with elements set to `display: inline`. As an alternative, you can use `display: inline-block` or place elements in a flex context.</p>

These FLIP animations are also not limited to a single axis. Items in a multidimensional grid can be [transitioned too](https://jsfiddle.net/chrisvfritz/sLrhk1bc/):

{% raw %}
<div id="sudoku-demo" class="demo">
  <strong>Lazy Sudoku</strong>
  <p>Keep hitting the shuffle button until you win.</p>
  <button @click="shuffle">
    Shuffle
  </button>
  <transition-group name="cell" tag="div" class="sudoku-container">
    <div v-for="cell in cells" :key="cell.id" class="cell">
      {{ cell.number }}
    </div>
  </transition-group>
</div>
<script>
new Vue({
  el: '#sudoku-demo',
  data: {
    cells: Array.apply(null, { length: 81 })
      .map(function (_, index) {
        return {
          id: index,
          number: index % 9 + 1
        }
      })
  },
  methods: {
    shuffle: function () {
      this.cells = _.shuffle(this.cells)
    }
  }
})
</script>
<style>
.sudoku-container {
  display: flex;
  flex-wrap: wrap;
  width: 238px;
  margin-top: 10px;
}
.cell {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 25px;
  height: 25px;
  border: 1px solid #aaa;
  margin-right: -1px;
  margin-bottom: -1px;
}
.cell:nth-child(3n) {
  margin-right: 0;
}
.cell:nth-child(27n) {
  margin-bottom: 0;
}
.cell-move {
  transition: transform 1s;
}
</style>
{% endraw %}

### Staggering List Transitions

By communicating with JavaScript transitions through data attributes, it's also possible to stagger transitions in a list:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="staggered-list-demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#staggered-list-demo',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="example-5" class="demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
</script>
{% endraw %}

## Reusable Transitions

Transitions can be reused through Vue's component system. To create a reusable transition, all you have to do is place a `<transition>` or `<transition-group>` component at the root, then pass any children into the transition component.

Here's an example using a template component:

``` js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      v-on:before-enter="beforeEnter"\
      v-on:after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\
  ',
  methods: {
    beforeEnter: function (el) {
      // ...
    },
    afterEnter: function (el) {
      // ...
    }
  }
})
```

And [functional components](render-function.html#Functional-Components) are especially well-suited to this task:

``` js
Vue.component('my-special-transition', {
  functional: true,
  render: function (createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition',
        mode: 'out-in'
      },
      on: {
        beforeEnter: function (el) {
          // ...
        },
        afterEnter: function (el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

## Dynamic Transitions

Yes, even transitions in Vue are data-driven! The most basic example of a dynamic transition binds the `name` attribute to a dynamic property.

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

This can be useful when you've defined CSS transitions/animations using Vue's transition class conventions and want to switch between them.

Really though, any transition attribute can be dynamically bound. And it's not only attributes. Since event hooks are methods, they have access to any data in the context. That means depending on the state of your component, your JavaScript transitions can behave differently.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">hello</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Start animating</button>
  <button
    v-else
    v-on:click="stop = true"
  >Stop it!</button>
</div>
```

``` js
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="dynamic-fade-demo" class="demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">hello</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Start animating</button>
  <button
    v-else
    v-on:click="stop = true"
  >Stop it!</button>
</div>
<script>
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
</script>
{% endraw %}

Finally, the ultimate way of creating dynamic transitions is through components that accept props to change the nature of the transition(s) to be used. It may sound cheesy, but the only limit really is your imagination.

