---
title: Pengenalan
type: guide
order: 2
---

## Apa itu Vue.js ?

Vue (diucap /vjuː/, seperti **view**) adalah sebuah **progressive framework** untuk membangun tampilan antarmuka (UI). Tidak seperti framework lainnya, Vue dirancang/didesain agar bisa diadopsi dan beradaptasi dengan mudah. Pada bagian inti Vue sendiri hanya fokus pada bagian `View` saja, dan Vue juga sangat mudah untuk diintergrasikan dengan library atau proyek-proyek yang telah ada. Di sisi lain, Vue juga sangat bagus untuk membuat Single-Page Applications yang dikombinasikan dengan [Komponen Vue](single-file-components.html) dan [pustaka-pustaka pendukung Vue](https://github.com/vuejs/awesome-vue#components--libraries).

Jika Anda ingin tahu tentang Vue sebelum kita lanjut, kami telah <a id="modal-player"  href="#">membuat sebuah video</a> tentang gambaran besar, prinsip utama, dan contoh-contoh proyek Vue.

Jika Anda adalah seorang front-end developer yang sudah berpengalaman dan ingin tahu bagaimana perbandingan antara Vue dengan library atau framework lainnya, silahkan lihat pada bagian [Perbandingan Vue dengan framework lain](comparison.html).

## Ayo Mulai Belajar

<p class="tip">
Panduan ini menganggap Anda telah memiliki sedikit pengetahuan akan HTML, CSS, dan JavaScript tingkat lanjut.
Jika Anda masih baru dalam dunia frontend development, ini bukanlah suatu cara yang baik jika Anda langsung belajar tentang framework sebagai langkah awal Anda - kami sarankan agar Anda mempelajari dulu dasar-dasar front-end lalu kembali lagi untuk pelajari Vue!
Mungkin pengalaman Anda dengan framework lain mungkin bisa membantu, tapi itu tidak membantu Anda banyak dalam pelajari Vue.js.</p>

Cara termudah untuk mencoba dan bermain-main dengan Vue.js adalah dengan mencoba [Contoh Hello World di JSFiddle](https://jsfiddle.net/chrisvfritz/50wL7mdz/). 
Jangan ragu untuk buka link tersebut dan ikuti contoh-contoh dasar selama kita belajar. Atau, Anda bisa
<a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html">buat file <code>index.html</code></a> lalu sisipkan Vue dengan cara berikut  :

``` html
<!-- versi pengembangan, berisi console peringatan yang sangat membantu -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

atau :

``` html
<!-- versi produksi, dioptimalkan untuk ukuran file dan kecepatan -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Pada Halaman [Instalasi](installation.html) akan menjelaskan banyak pilihan-pilihan lainnya untuk menginstal Vue. 

Catatan: Kami tidak merekomendasikan bagi pemula untuk memulai dengan `vue-cli`, apa lagi jika Anda belum terbiasa menggunakan build tool yang ada di Node.js.


## Declarative Rendering


Di dalam sistem Core Vue.js, Vue.js membolehkan kita untuk me-render data ke DOM dengan sintaks template yang deklaratif :

``` html
<div id="app">
  {{ pesan }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    pesan: 'Halo Vue!'
  }
})
```
``` html
<div id="app" class="demo">
  {{ pesan }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    pesan: 'Halo Vue!'
  }
})
</script>
```

Kita telah membuat aplikasi Vue pertama kita! Ini sangat mirip dengan me-render template string, tapi Vue telah menyelesaikan banyak tugas di belakang layar.
Data dan DOM kini sudah tertaut, dan sekarang semua sudah **reactive**. Bagaimana kita tahu? Buka konsol javascript browser Anda (sekarang, di halaman ini) dan ubah `app.pesan` dengan nilai yang berbeda. Anda akan melihat contoh di atas akan ter-update juga.

Tambahan untuk interpolasi teks, kita juga dapat bind`('menimpa'/'menggantikan')` atribut dari sebuah elemen HTML seperti ini:

``` html
<div id="app-2">
  <span v-bind:title="pesan">
    Arahkan mouse di sini beberapa detik
    untuk melihat attribut judul dinamis yang baru!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    pesan: 'Halaman ini dimuat pada ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="pesan">
    Arahkan mouse di sini beberapa detik untuk melihat attribut judul dinamis yang baru!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    pesan: 'Halaman ini dimuat pada ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Anda telah mendapat sebuah pelajaran baru. Atribut `v-bind` yang baru saja Anda lihat itu disebut **directive**. `Directive` diawali dengan `v-` untuk mengindikasikan bahwa atribut2 itu adalah atribut2 spesial yang disediakan oleh Vue, dan seperti yang Anda kira, mereka menerapkan special reactive behavior pada DOM. Di sini, seperti Anda memerintahkan "Pastikan nilai atribut `title` pada elemen ini up-to-date sesuai dengan nilai properti `pesan` pada Vue instance".

Jika Anda membuka konsol javascript Anda dan mengetik `app2.pesan = 'sebuah pesan baru'`, Anda akan melihat lagi HTML bound - dalam kasus ini atribut `title` - telah ter-update
<!-- If you open up your JavaScript console again and enter `app2.message = 'some new message'`, you'll once again see that the bound HTML - in this case the `title` attribute - has been updated. -->

## Kondisional and Perulangan

It's easy to toggle the presence of an element, too:

``` html
<div id="app-3">
  <span v-if="terlihat">Sekarang Anda melihat Saya</span>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    terlihat: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="terlihat">Sekarang Anda melihat Saya</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    terlihat: true
  }
})
</script>
{% endraw %}

Go ahead and enter `app3.seen = false` in the console. You should see the message disappear.

This example demonstrates that we can bind data to not only text and attributes, but also the **structure** of the DOM. Moreover, Vue also provides a powerful transition effect system that can automatically apply [transition effects](transitions.html) when elements are inserted/updated/removed by Vue.

There are quite a few other directives, each with its own special functionality. For example, the `v-for` directive can be used for displaying a list of items using the data from an Array:

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})
</script>
{% endraw %}

In the console, enter `app4.todos.push({ text: 'New item' })`. You should see a new item appended to the list.

## Handling User Input

To let users interact with your app, we can use the `v-on` directive to attach event listeners that invoke methods on our Vue instances:

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Note that in this method we update the state of our app without touching the DOM - all DOM manipulations are handled by Vue, and the code you write is focused on the underlying logic.

Vue also provides the `v-model` directive that makes two-way binding between form input and app state a breeze:

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

## Composing with Components

The component system is another important concept in Vue, because it's an abstraction that allows us to build large-scale applications composed of small, self-contained, and often reusable components. If we think about it, almost any type of application interface can be abstracted into a tree of components:

![Component Tree](/images/components.png)

In Vue, a component is essentially a Vue instance with pre-defined options. Registering a component in Vue is straightforward:

``` js
// Define a new component called todo-item
Vue.component('todo-item', {
  template: '<li>This is a todo</li>'
})
```

Now you can compose it in another component's template:

``` html
<ol>
  <!-- Create an instance of the todo-item component -->
  <todo-item></todo-item>
</ol>
```

But this would render the same text for every todo, which is not super interesting. We should be able to pass data from the parent scope into child components. Let's modify the component definition to make it accept a [prop](components.html#Props):

``` js
Vue.component('todo-item', {
  // The todo-item component now accepts a
  // "prop", which is like a custom attribute.
  // This prop is called todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Now we can pass the todo into each repeated component using `v-bind`:

``` html
<div id="app-7">
  <ol>
    <!--
      Now we provide each todo-item with the todo object
      it's representing, so that its content can be dynamic.
      We also need to provide each component with a "key",
      which will be explained later.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id">
    </todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ]
  }
})
</script>
{% endraw %}

This is a contrived example, but we have managed to separate our app into two smaller units, and the child is reasonably well-decoupled from the parent via the props interface. We can now further improve our `<todo-item>` component with more complex template and logic without affecting the parent app.

In a large application, it is necessary to divide the whole app into components to make development manageable. We will talk a lot more about components [later in the guide](components.html), but here's an (imaginary) example of what an app's template might look like with components:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Relation to Custom Elements

You may have noticed that Vue components are very similar to **Custom Elements**, which are part of the [Web Components Spec](https://www.w3.org/wiki/WebComponents/). That's because Vue's component syntax is loosely modeled after the spec. For example, Vue components implement the [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) and the `is` special attribute. However, there are a few key differences:

1. The Web Components Spec is still in draft status, and is not natively implemented in every browser. In comparison, Vue components don't require any polyfills and work consistently in all supported browsers (IE9 and above). When needed, Vue components can also be wrapped inside a native custom element.

2. Vue components provide important features that are not available in plain custom elements, most notably cross-component data flow, custom event communication and build tool integrations.

## Ready for More?

We've briefly introduced the most basic features of Vue.js core - the rest of this guide will cover them and other advanced features with much finer details, so make sure to read through it all!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script></div>
