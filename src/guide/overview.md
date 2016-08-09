---
title: Selayang Pandang
type: guide
order: 2
---

<!-- Vue.js (pronounced /vjuː/, like **view**) is a library for building interactive web interfaces. The goal of Vue.js is to provide the benefits of **reactive data binding** and **composable view components** with an API that is as simple as possible. -->
Vue.js (baca /vjuː/, seperti pada **view**) adalah sebuah library (pustaka) yang digunakan untuk membangun sebuah halaman web yang interaktif. Tujuan dari Vue.js adalah untuk memberikan kelebihan dari **reactive data binding** dan **composable view components** dengan sebuah API (Application Programming Interface) yang sesimpel mungkin.

<!-- Vue.js itself is not a full-blown framework - it is focused on the view layer only. It is therefore very easy to pick up and to integrate with other libraries or existing projects. On the other hand, when used in combination with proper tooling and supporting libraries, Vue.js is also perfectly capable of powering sophisticated Single-Page Applications. -->
Vue.js sendiri bukanlah sebuah framework yang utuh, namun ia hanya fokus pada layer (lapisan) view. Karenanya sangat mudah untuk mengambil dan mengintegrasikannya dengan library lain maupun project lain yang sudah ada. Di sisi lain, ketika digunakan di dalam kombinasi dengan tool dan library yang tepat, Vue.js juga mampu digunakan untuk membuat Single-Page Application.

<!-- If you are an experienced frontend developer and want to know how Vue.js compares to other libraries/frameworks, check out the [Comparison with Other Frameworks](comparison.html); if you are more interested about how Vue.js approaches larger-scale applications, check out the section on [Building Larger-Scale Applications](application.html). -->
Jika Anda adalah seorang frontend developer berpengalaman dan ingin mengetahui perbandingan Vue.js dengan library/framework lainnya, silakan baca [Perbandingan dengan Framework Lain](comparison.html); dan jika Anda lebih tertarik mengenai bagaimana pendekatan Vue.js pada larger-scale applications (aplikasi berskala besar), silakan baca halaman [Membangun Aplikasi Berskala Besar](application.html).

## Reactive Data Binding

<!-- At the core of Vue.js is a reactive data-binding system that makes it extremely simple to keep your data and the DOM in sync. When using jQuery to manually manipulate the DOM, the code we write is often imperative, repetitive and error-prone. Vue.js embraces the concept of **data-driven view**. In plain words, it means we use special syntax in our normal HTML templates to "bind" the DOM to the underlying data. Once the bindings are created, the DOM will then be kept in sync with the data. Whenever you modify the data, the DOM updates accordingly. As a result, most of our application logic is now directly manipulating data, rather than messing around with DOM updates. This makes our code easier to write, easier to reason about and easier to maintain. -->
Inti dari Vue.js adalah sistem reactive data-binding yang sangat memudahkan untuk menjaga data Anda dan DOM (Document Object Model) agar tetap tersinkronisasi. Ketika menggunakan jQuery untuk memanipulasi DOM secara manual, kode yang kita tulis seringkali imperatif, repetitif dan (cenderung) rentan error. Vue.js menggunakan konsep **data-driven view**. Dengan kata lain, dengan Vue.js kita dapat menggunakan sintaks khusus di dalam template HTML kita untuk mem-"bind" (mengikat) DOM dengan data pokok. Sekali binding (ikatan) dibuat, maka DOM akan tetap tersinkronisasi dengan data. Kapanpun Anda mengubah data tersebut, maka DOM juga ikut terupdate. Sebagai hasilnya, logic aplikasi kita sekarang dapat digunakan untuk memanipulasi data secara langsung, bukan lagi mengotak-atik update DOM. Hal ini membuat kode kita lebih mudah untuk ditulis, dibaca dan di-maintain (dirawat).

![MVVM](/images/mvvm.png)

<!-- For the simplest possible example: -->
Contoh yang paling sederhana

``` html
<!-- this is our View -->
<div id="example-1">
  Hello {{ name }}!
</div>
```

``` js
// this is our Model
var exampleData = {
  name: 'Vue.js'
}

// create a Vue instance, or, a "ViewModel"
// which links the View and the Model
var exampleVM = new Vue({
  el: '#example-1',
  data: exampleData
})
```

<!-- Result: -->
Hasilnya:
{% raw %}
<div id="example-1" class="demo">Hello {{ name }}!</div>
<script>
var exampleData = {
  name: 'Vue.js'
}
var exampleVM = new Vue({
  el: '#example-1',
  data: exampleData
})
</script>
{% endraw %}

<!-- This looks pretty similar to just rendering a template, but Vue.js has done a lot of work under the hood. The data and the DOM are now linked, and everything is now **reactive**. How do we know? Just open up your browser developer console and modify `exampleData.name`. You should see the rendered example above update accordingly. -->
Hal ini sangat mirip dengan ketika kita hanya me-render sebuah template, namun dibalik itu semua Vue.js melakukan banyak pekerjaan di balik layar. Data tersebut sekarang terhubung langsung dengan DOM, dan semuanya sekarang bersifat **reactive**. Bagaimana kita bisa tahu? Cukup buka browser developer console dan ubah `exampleData.name` dengan value yang kita inginkan. Dan Anda akan melihat contoh yang telah dirender di atas akan ikut terupdate.

<!-- Note that we didn't have to write any DOM-manipulating code: the HTML template, enhanced with the bindings, is a declarative mapping of the underlying data state, which is in turn just plain JavaScript objects. Our view is entirely data-driven. -->
Mohon dicatat bahwasannya kita tidak harus mengetik kode apapun untuk memanipulasi DOM: hanya template HTML, ditambah dengan bindings, adalah sebuah declarative mapping (pemetaan deklaratif / lawan dari imperatif) dari data, yang mana hanya dalam bentuk Object JavaScript. View kita kini sepenuhnya data-driven.

<!-- Let's look at a second example: -->
Mari kita lihat contoh ke-dua:

``` html
<div id="example-2">
  <p v-if="greeting">Hello!</p>
</div>
```

``` js
var exampleVM2 = new Vue({
  el: '#example-2',
  data: {
    greeting: true
  }
})
```

{% raw %}
<div id="example-2" class="demo">
  <span v-if="greeting">Hello!</span>
</div>
<script>
var exampleVM2 = new Vue({
  el: '#example-2',
  data: {
    greeting: true
  }
})
</script>
{% endraw %}

<!-- Here we are encountering something new. The `v-if` attribute you are seeing is called a **Directive**. Directives are prefixed with `v-` to indicate that they are special attributes provided by Vue.js, and as you may have guessed, they apply special reactive behavior to the rendered DOM. Go ahead and set `exampleVM2.greeting` to `false` in the console. You should see the "Hello!" message disappear. -->
Di sini kita menemui sesuatu yang baru. Attribute `v-if` yang saat ini Anda lihat disebut dengan **Directive**. Setiap directive diberi awalan `v-` untuk menunjukkan bahwasannya mereka adalah attribute khusus yang disediakan oleh Vue.js, dan seperti yang Anda tebak, attribute-attribute tersebut memiliki reactive behavior (tingkah laku) khusus untuk me-render DOM. Cobalah untuk mengubah `exampleVM2.greeting` menjadi `false` pada console. Anda pasti akan melihat tulisan "Hello!" menghilang.

<!-- This second example demonstrates that not only can we bind DOM text to the data, we can also bind the **structure** of the DOM to the data. Moreover, Vue.js also provides a powerful transition effect system that can automatically apply transition effects when elements are inserted/removed by Vue. -->
Contoh ke-dua mendemonstrasikan bahwa kita tidak hanya dapat mem-bind teks yang ada pada DOM dengan data kita, namun kita juga dapat mem-bind **structure** (struktur) dari DOM terhadap data. Bahkan, Vue.js juga menyediakan sistem efek transisi yang powerful yang secara otomatis berlaku ketika sebuah elemen baru muncul atau terhapus dari tampilan oleh Vue.

<!-- There are quite a few other directives, each with its own special functionality. For example the `v-for` directive for displaying items in an Array, or the `v-bind` directive for binding HTML attributes. We will discuss the full data-binding syntax with more details later. -->
Ada beberapa directive lainya, tiap directive mempunyai fungsi khusus yang berbeda. Sebagai contoh directive `v-for` digunakan untuk menampilkan item yang terdapat di dalam sebuah Array (larik), atau directive `v-bind` untuk mem-bind attribute HTML. Nanti, akan kita diskusikan sintaks data-binding lebih lanjut.

## Component System

<!-- The Component System is another important concept in Vue.js, because it's an abstraction that allows us to build large-scale applications composed of small, self-contained, and often reusable components. If we think about it, almost any type of application interface can be abstracted into a tree of components: -->
Component System adalah konsep penting lainnya yang ada di dalam Vue.js, karena dia adalah abstraction (abstraksi) yang mengizinkan kita untuk membangun large-scale applications yang tersusun dari komponen-komponen kecil, self-contained, dan reusable (dapat dipakai ulang). Jika kita berpikir tentang hal tersebut, hampir semua jenis application interface (antarmuka aplikasi) dapat di-abstraksikan menjadi sebuah pohon component:

![Component Tree](/images/components.png)

<!-- In fact, a typical large application built with Vue.js would form exactly what is on the right - a tree of components. We will talk a lot more about components later in the guide, but here's an (imaginary) example of what an app's template would look like with components: -->
Dalam kenyataanya, sebuah aplikasi skala besar yang dibangun dengan Vue.js akan membentuk sebuah a tree of components (pohon komponen-komponen). Kita akan berbicara lebih lanjut tentang komponen nanti, sementara itu berikut adalah (gambaran) penampakan komponen yang ada dalam sebuah template aplikasi:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

<!-- You may have noticed that Vue.js components are very similar to **Custom Elements**, which is part of the [Web Components Spec](http://www.w3.org/wiki/WebComponents/). In fact, Vue.js' component syntax is loosely modeled after the spec. For example, Vue components implement the [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) and the `is` special attribute. However, there are a few key differences: -->
Anda mungkin memperhatikan bahwa components Vue.js sangat mirip dengan **Custom Elements**, yang mana bagian dari [Web Components Spec](http://www.w3.org/wiki/WebComponents/). Nyatanya, sintaks component milik Vue.js lebih longgar dari spec tadi. Sebagai contoh, components Vue mengimplementasikan [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) dan attribute spesial `is`. Meski demikian, berikut adalah beberapa kunci perbedaannya:

<!-- 1. The Web Components Spec is still very much a work in progress, and is not natively implemented in every browser. In comparison, Vue.js components don't require any polyfills and works consistently in all supported browsers (IE9 and above). When needed, Vue.js components can also be wrapped inside a native custom element. -->
1. Web Components Spec masih dalam masa pengembangan, dan belum diimplementasikan pada setiap browser secara native. Sebagai perbandingan, components Vue.js tidak memerlukan polyfills apapun dan dapat bekerja secara konsisten pada semua browser yang didukung (IE9 ke atas). Jika diperlukan, components Vue.js juga dapat di-wrap (dibungkus) kedalam native custom element.

2. Components Vue.js menyediakan fitur-fitur penting yang tidak tersedia pada custom elements biasa, terutama pada cross-component data flow (alur data antar komponen), custom event communication dan dynamic component switching dengan efek transisi.
<!-- 2. Vue.js components provide important features that are not available in plain custom elements, most notably cross-component data flow, custom event communication and dynamic component switching with transition effects. -->

<!-- The component system is the foundation for building large apps with Vue.js. In addition, the Vue.js ecosystem also provides advanced tooling and various supporting libraries that can be put together to create a more "framework" like system. -->
Component system (sistem komponen) adalah pondasi penting dalam membangun sebuah aplikasi berskala besar denga Vue.js. Sebagai tambahan, ekosistem Vue.js juga menyediakan advanced tooling (perkakas canggih) dan dukungan berbagai macam library-library yang dapat digunakan secara bersamaan untuk membuat Vue.js lebih mirip seperti "framework".
