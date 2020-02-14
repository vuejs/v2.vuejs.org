---
title: Transisi Masuk/Keluar & Daftar Transisi
type: guide
order: 201
---

## Ikhtisar

Vue menyediakan berbagai cara untuk menerapkan efek transisi ketika ada item yang dimasukan, diubah, atau dikeluarkan dari DOM. Hal ini termasuk alat untuk:

- secara otomatis menerapkan kelas untuk transisi dan animasi CSS
- Mengintegrasikan pustaka (*library*) CSS untuk animasi yang berasal dari pihak-ketiga, seperti Animate.css
- menggunakan JavaScript untuk memanipulasi DOM pada waktu transisi *hook* secara langsung
- Mengintegrasikan pustaka (*library*) JavaScript untuk animasi yang berasal dari pihak-ketiga, seperti Velocity.js

Pada halaman ini, kita hanya akan membahas tentang transisi masuk, keluar, dan daftar, tetapi Anda bisa melihat bagian berikutnya untuk [mengatur transisi dari state](transitioning-state.html).

## Transisi Elemen/Komponen Tunggal

Vue menyediakan komponen pembungkus transisi (*transition wrapper component*), yang memperbolehkan Anda untuk menambahkan transisi masuk/keluar di setiap elemen atau komponen dalam konteks berikut:

- Me-*render* sesuai kondisi (menggunakan `v-if`)
- Menampilkan sesuai dengan kondisi (menggunakan `v-show`)
- Komponen dinamis (Dynamic components)
- komponen pada *root nodes*

Berikut ini adalah sebuah contoh transisi:

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

Ketika sebuah elemen yang dibungkus di dalam komponen transisi dimasukkan atau dikeluarkan, inilah yang akan terjadi:

1. Vue akan secara otomatis memeriksa apakah elemen sasaran telah menerapkan transisi atau animasi CSS.

2. Jika komponen transisi menyediakan [*hook* JavaScript](#JavaScript-Hooks), *hook* ini akan dipanggil pada waktu yang telah ditentukan.

3. Jika tidak ada transisi/animasi CSS yang terdeteksi dan tidak ada *hook* JavaScript yang tersedia, maka operasi DOM untuk memasukan dan/atau mengeluarkan akan dieksekusi secepatnya pada *frame* berikutnya. (Catatan: ini adalah *frame* animasi dari browser, berbeda dengan konsep `nextTick` pada Vue).

### Kelas-kelas Transisi

Ada enam kelas yang diterapkan untuk transisi masuk/keluar.

1. `v-enter`: *State* (keadaan) awal untuk proses masuk. Ditambahkan sebelum elemen dimasukkan, dilepaskan satu *frame* setelah elemen dimasukkan.

2. `v-enter-active`: *State* aktif untuk proses masuk. Diaplikasikan ketika seluruh fase proses transisi masuk. Ditambahkan sebelum elemen dimasukkan, dilepaskan ketika transisi/animasi selesai. Kelas ini dapat digunakan untuk menentukan durasi, penundaan (*delay*) dan kurva pelonggaran (*easing curve*) untuk transisi masuk.

3. `v-enter-to`: **Hanya tersedia pada versi 2.1.8+.** *State* akhir untuk proses masuk. Ditambahkan satu *frame* setelah elemen dimasukkan (pada saat yang sama `v-enter` dilepaskan), dilepaskan ketika transisi/animasi selesai.

4. `v-leave`: *State* awal untuk proses keluar. Ditambahkan secepatnya ketika transisi keluar dipicu, dilepaskan setelah satu *frame*.

5. `v-leave-active`: *State* aktif untuk proses keluar. Diaplikasikan ketika seluruh proses transisi keluar. Ditambahkan secepatnya ketika transisi keluar dipicu, dilepaskan ketika transisi/animasi selesai. Kelas ini dapat digunakan untuk menentukan durasi, penundaan (*delay*) dan kurva pelonggaran (*easing curve*) untuk transisi kaluar.

6. `v-leave-to`: **Hanya tersedia pada versi 2.1.8+.** *State* akhir untuk proses keluar. Ditambahkan satu frame setelah transisi keluar dipicu (pada saat yang sama `v-leave` dilepaskan), dilepaskan ketika transisi/animasi selesai.

![Transition Diagram](/images/transition.png)

Setiap kelas ini akan diawali dengan nama transisi. Di sini awalan `v-` adalah default jika Anda menggunakan elemen `<transition>` tanpa nama. Sebagai contoh jika Anda menggunakan `<transition name="my-transition">`, maka sebagai gantinya kelas `v-enter` akan menjadi `my-transition-enter`.

`v-enter-active` dan `v-leave-active` memberikan Anda kemampuan untuk menentukan kurva pelonggaran yang berbeda untuk transisi masuk/keluar, yang mana akan dapat Anda lihat contohnya pada bagian berikutnya.

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
/* Animasi Masuk dan Keluar bisa menggunakan fungsi */
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

### Kelas Transisi Kustom

Anda juga bisa menentukan kelas transisi kustom dengan cara menyediakan atribut-atribut berikut:

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

Atribut-atribut ini akan mengabaikan nama kelas konvensional. Hal ini berguna ketika Anda ingin mengkombinasikan sistem transisi Vue dengan sebuah pustaka animasi CSS yang sudah ada, seperti [Animate.css](https://daneden.github.io/animate.css/).

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

Vue perlu melampirkan pendengar event (*event listener*) agar bisa mengetahui ketika ada sebuah *event* yang telah selesai. Hal ini dapat berupa salah satu di antara `transitionend` atau `animationend`, tergantung dari tipe aturan css yang diterapkan. Jika Anda hanya menggunakan salah satu atau yang lain, Vue dapat secara otomatis mendeteksi tipe yang tepat.

Bagaimanapun, dalam beberapa kasus Anda mungkin ingin menggunakan keduanya ke dalam elemen yang sama, sebagai contoh sebuah animasi CSS yang dipicu oleh Vue, bersamaan dengan efek transisi CSS saat *event* *hover*. Pada kasus ini, Anda harus secara eksplisit mendeklarasikan tipe yang Anda inginkan agar dapat dipantau oleh Vue pada attribut `type`, dengan nilai antara `animation` atau `transition`.

### Durasi Transisi yang Eksplisit

> Baru di 2.2.0+

Di banyak kasus, Vue secara otomatis bisa mengetahui apakah transisi telah selesai. Secara default, Vue menunggu *event* `transitionend` atau `animationend` yang pertama pada elemen transisi *root*. Namun, hal ini mungkin tidak selalu diharapkan - sebagai contoh, kita mungkin memiliki urutan koreografi transisi dimana beberapa elemen bersarang memiliki transisi yang tertunda atau durasi transisi yang lebih lama dibanding elemen transisi *root*.

Pada kasus seperti itu Anda bisa menentukan durasi transisi yang eksplisit (dalam milliseconds) menggunakan prop `duration` pada komponen `<transition>`:

``` html
<transition :duration="1000">...</transition>
```

Anda juga bisa menentukan nilai terpisah antara durasi masuk dan keluar:

``` html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### Hook JavaScript

Anda juga bisa mendefinisikan *hook* JavaScript pada atribut:

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
  // KETIKA MASUK
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // *callback done* opsional ketika
  // digunakan ketika dikombinasikan dengan CSS
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
  // KETIKA KELUAR
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // *callback done* opsional ketika
  // digunakan ketika dikombinasikan dengan CSS
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

Hook-hook ini dapat dikombinasikan dengan transisi/animasi CSS atau digunakan sendiri.

<p class="tip">Ketika hanya menggunakan transisi dari JavaScript, **callback `done` diwajibkan untuk hook `enter` dan `leave`**. Jika tidak, hook akan dipanggil secara sinkronis dan transisi akan selesai secepatnya.</p>

<p class="tip">Salah satu ide yang bagus untuk secara eksplisit menambahkan `v-bind:css="false"` untuk transisi yang dibuat hanya dengan JavaScript sehingga Vue dapat melewati proses  pendeteksian CSS. Hal ini juga bisa menghindari aturan CSS yang secara tidak sengaja ikut tercampur ke dalam transisi.</p>

Sekarang mari belajar lebih dalam melalui sebuah contoh. Ini adalah sebuah transisi JavaScript yang menggunakan Velocity.js:

``` html
<!--
Velocity bekerja hampir seperti jQuery.animate dan merupakan
opsi yang bagus untuk animasi menggunakan JavaScript
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

Jika Anda juga ingin menerapkan transisi pada *render* awal pada sebuah node, Anda bisa menambahkan atribut `appear`:

``` html
<transition appear>
  <!-- ... -->
</transition>
```

Secara default, ini akan menggunakan transisi yang telah ditentukan untuk masuk dan keluar. Namun jika Anda mau, Anda juga bisa menentukan kelas CSS kustom:

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

dan hook JavaScript kustom:

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

Kita membahas [transisi antar komponen](#Transitioning-Between-Components) nanti, tetapi Anda juga bisa melakukan transisi antar elemen mentah menggunakan `v-if`/`v-else`. Satu dari banyak transisi antara dua-elemen yang umum adalah antara penampung daftar (*list container*) dan pesan yang menjelaskan daftar kosong:

``` html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```

Ini bekerja dengan baik, tetapi ada satu peringatan yang harus kita perhatikan:

<p class="tip">Ketika berpindah antar elemen yang memiliki **nama tag yang sama**, Anda harus memberi tahu Vue bahwa mereka adalah elemen yang berbeda dengan memberikan mereka atribut `key` yang unik. Jika tidak, kompiler Vue hanya mengganti isi dari elemen. Meskipun secara teknis tidak perlu, **dianggap sebagai praktek yang baik untuk selalu memberikan kunci (key) pada banyak item di dalam komponen `<transition>`.**</p>

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

Dalam Kasus ini, Anda juga bisa menggunakan atribut `key` untuk bertransisi antara state yang berbeda pada elemen yang sama. Daripada menggunakan `v-if` dan `v-else`, contoh di atas bisa ditulis ulang menjadi:

``` html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Save' : 'Edit' }}
  </button>
</transition>
```

Sebenarnya sangat memungkinkan untuk melakukan transisi antara elemen berapapun jumlahnya, baik dengan menggunakan banyak `v-if` atau menautkan elemen tunggal pada properti dinamis. Sebagai contoh:

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

Selama proses transisi antara tombol "on" dan tombol "off", kedua tombol di-render - satu bertransisi keluar sementara yang lain bertransisi ke dalam. ini merupakan perilaku default dari `<transition>` - masuk dan keluar terjadi secara bersamaan.

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

Dan nanti mungkin juga ditranslasikan sehingga mereka terlihat seperti transisi *slide*.

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

Meskipun demikian transisi masuk dan keluar tidak selalu dibutuhkan, sehingga vue hanya menawarkan **mode transisi** sebagai alternatif:

- `in-out`: Elemen baru melakukan transisi masuk terlebih dahulu, lalu ketika selesai, elemen ini melakukan transisi keluar.

- `out-in`: Elemen ini melakukan transisi keluar terlebih dahulu, lalu ketika selesai, elemen baru melakukan transisi masuk.

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

Transisi antar komponen bahkan lebih sederhana - kita bahkan tidak membutuhkan atribut `key`. Sebagai gantinya, kita membungkusnya dengan sebuah [komponen dinamis](components.html#Dynamic-Components):

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
Sebelum kita masuk pada sebuah contoh, ada beberapa hal yang penting untuk diketahui mengenai komponen ini:

- Tidak seperti `<transition>`, komponen ini me-render elemen yang nyata: secara default elemen `<span>`. Anda bisa mengganti elemen yang di-render dengan atribut `tag`.
- [Mode transisi](#Transition-Modes) tidak tersedia, karena kita sedang melakukan transisi antar elemen yang bertransisi secara eksklusif.
- Elemen-elemen di dalamnya **selalu diwajibkan** untuk memiliki atribut `key` yang unik.

### Transisi Masuk/Keluar dan Daftar

Sekarang mari masuk pada sebuah contoh, bertransisi masuk dan keluar menggunakan kelas CSS yang sama seperti yang kita gunakan sebelumnya:

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

Ada satu masalah dengan contoh ini. Ketika Anda menambahkan atau menghapus item, item disekitarnya malah secara instan bergerak langsung ke tempatnya yang baru dan tidak bertransisi secara mulus. Kita akan memperbaikinya nanti.

### Transisi Daftar Bergerak

Komponen `<transition-group>` memiliki trik lainnya. Ia tidak hanya menganimasi masuk dan keluar, tetapi juga mengganti posisi. Satu-satunya konsep baru yang perlu Anda ketahui untuk menggunakan fitur ini adalah tambahan **kelas `v-move`**, yang mana ditambahkan ketika item berganti posisi. Seperti kelas yang lainnya, Prefixnya akan disesuaikan dengan nilai dari atribut `name` yang disediakan dan Anda juga bisa secara manual menentukan kelas dengan atribut `move-class`.

Kelas ini berguna terutama untuk memnentukan pengaturan waktu transisi dan kurva pelonggaran, seperti yang akan Anda lihat di bawah:

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

Ini mungkin terlihat seperti sihir, tetapi dengan kemampuannya, Vue menggunakan teknik animasi yang disebut [FLIP](https://aerotwist.com/blog/flip-your-animations/) agar secara halus melakukan transisi elemen dari posisi lama ke posisi baru menggunakan perubahan bentuk.

Kita dapat mengkombinasikan teknik ini dengan implementasi kita sebelumnya untuk menganimasikan setiap perubahan yang terjadi pada daftar kita!

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

<p class="tip">Satu catatatn penting, bahwa transisi FLIP ini tidak bekerja dengan elemen-elemen yang diatur pada `display: inline`. Sebagai alternatif, Anda bisa menggunakan `display: inline-block` atau menempatkan elemen di dalam  konteks *flex*.</p>

Animasi FLIP ini juga tidak terbatas pada sumbu tunggal. Item-item dalam *grid* multidimensi bisa [ditransisikan juga](https://jsfiddle.net/chrisvfritz/sLrhk1bc/):

{% raw %}
<div id="sudoku-demo" class="demo">
  <strong>Lazy Sudoku</strong>
  <p>Terus tekan tombol shuffle sampai Anda menang.</p>
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

### Menggoyangkan Transisi Daftar

Dengan berkomunikasi dengan transisi JavaScript, melalui atribut-atribut data, memungkinkan juga untuk menggoyang transisi dalam sebuah daftar:

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

## Transisi yang Dapat Digunakan Kembali (Reusable)

Transisi dapat digunakan kembali melalui sistem komponen Vue. Untuk membuat transisi yang dapat digunakan kembali, semua yang perlu Anda lakukan adalah menempatkan komponen `<transition>` atau `<transition-group>` pada root, lalu mengirimkan anak manapun ke dalam komponen transisi.

Berikut sebuah contoh menggunakan komponen templat:

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

Dan [komponen fungsional](render-function.html#Functional-Components) adalah yang paling cocok untuk tugas ini:

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

## Transisi Dinamis

Ya, bahkan transisi pada Vue digerakkan oleh data (data-driven)! Contoh paling dasar dari sebuah transisi dinamis adalah menautkan atribut `name` pada suatu properti dinamis.

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

Hal ini sangat berguna ketika Anda telah mendefinisikan transisi/animasi CSS menggunakan konvensi kelas transisi Vue dan ingin bertukar dengan mereka.

Setiap atribut transisi dapat terikat secara dinamis. Dan tidak hanya atribut. karena *hook* adalah sebuah *method*, mereka memiliki akses pada data apapun di dalam konteks. Itu berarti tergantung pada *state* komponen Anda, transisi JavaScript Anda bisa berperilaku berbeda.

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

Akhirnya, cara paling pamungkas untuk membuat transisi dinamis adalah melalui komponen yang menerima *props* untuk mengubah sifat alami dari transisi-transisi yang digunakan. Mungkin terdengar berlebihan, tetapi satu-satunya pembatas yang sesungguhnya hanyalah imajinasi Anda.

