---
title: Komponen yang Dinamis & Async
type: guide
order: 105
---

> Sebelum mulai membaca halaman ini, kami berasumsi bahwa Anda telah membaca [Dasar-Dasar Komponen](components.html). Baca halaman itu terlebih dahulu bila Anda belum mengerti tentang komponen.

## `keep-alive` dengan Komponen yang Dinamis

Sebelumnya, kami menggunakan atribut `is` untuk berpindah antar komponen di dalam antarmuka tab:

{% codeblock lang:html %}
<component v-bind:is="currentTabComponent"></component>
{% endcodeblock %}

Saat berpindah antar komponen, terkadang Anda ingin mempertahankan *state*nya atau menghindari *render* ulang dengan alasan kinerja yang lebih baik (performa). Sebagai contoh, saat kami memperluas antarmuka yang ada di dalam tab:

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-posts', {
  data: function () {
    return {
      posts: [
        {
          id: 1,
          title: 'Cat Ipsum',
          content: '<p>Dont wait for the storm to pass, dance in the rain kick up litter decide to want nothing to do with my owner today demand to be let outside at once, and expect owner to wait for me as i think about it cat cat moo moo lick ears lick paws so make meme, make cute face but lick the other cats. Kitty poochy chase imaginary bugs, but stand in front of the computer screen. Sweet beast cat dog hate mouse eat string barf pillow no baths hate everything stare at guinea pigs. My left donut is missing, as is my right loved it, hated it, loved it, hated it scoot butt on the rug cat not kitten around</p>'
        },
        {
          id: 2,
          title: 'Hipster Ipsum',
          content: '<p>Bushwick blue bottle scenester helvetica ugh, meh four loko. Put a bird on it lumbersexual franzen shabby chic, street art knausgaard trust fund shaman scenester live-edge mixtape taxidermy viral yuccie succulents. Keytar poke bicycle rights, crucifix street art neutra air plant PBR&B hoodie plaid venmo. Tilde swag art party fanny pack vinyl letterpress venmo jean shorts offal mumblecore. Vice blog gentrify mlkshk tattooed occupy snackwave, hoodie craft beer next level migas 8-bit chartreuse. Trust fund food truck drinking vinegar gochujang.</p>'
        },
        {
          id: 3,
          title: 'Cupcake Ipsum',
          content: '<p>Icing dessert soufflé lollipop chocolate bar sweet tart cake chupa chups. Soufflé marzipan jelly beans croissant toffee marzipan cupcake icing fruitcake. Muffin cake pudding soufflé wafer jelly bear claw sesame snaps marshmallow. Marzipan soufflé croissant lemon drops gingerbread sugar plum lemon drops apple pie gummies. Sweet roll donut oat cake toffee cake. Liquorice candy macaroon toffee cookie marzipan.</p>'
        }
      ],
      selectedPost: null
    }
  },
  template: '\
    <div class="dynamic-component-demo-posts-tab">\
      <ul class="dynamic-component-demo-posts-sidebar">\
        <li\
          v-for="post in posts"\
          v-bind:key="post.id"\
          v-bind:class="{ \'dynamic-component-demo-active\': post === selectedPost }"\
          v-on:click="selectedPost = post"\
        >\
          {{ post.title }}\
        </li>\
      </ul>\
      <div class="dynamic-component-demo-post-container">\
        <div \
          v-if="selectedPost"\
          class="dynamic-component-demo-post"\
        >\
          <h3>{{ selectedPost.title }}</h3>\
          <div v-html="selectedPost.content"></div>\
        </div>\
        <strong v-else>\
          Click on a blog title to the left to view it.\
        </strong>\
      </div>\
    </div>\
  '
})
Vue.component('tab-archive', {
  template: '<div>Archive component</div>'
})
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button.dynamic-component-demo-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
.dynamic-component-demo-posts-tab {
  display: flex;
}
.dynamic-component-demo-posts-sidebar {
  max-width: 40vw;
  margin: 0 !important;
  padding: 0 10px 0 0 !important;
  list-style-type: none;
  border-right: 1px solid #ccc;
}
.dynamic-component-demo-posts-sidebar li {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.dynamic-component-demo-posts-sidebar li:hover {
  background: #eee;
}
.dynamic-component-demo-posts-sidebar li.dynamic-component-demo-active {
  background: lightblue;
}
.dynamic-component-demo-post-container {
  padding-left: 10px;
}
.dynamic-component-demo-post > :first-child {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style>
{% endraw %}

Jika Anda memilih salah satu postingan di tab _Posts_, kemudian pindah ke tab _Archive_, kemudian pindah lagi ke tab _Posts_, Anda akan melihat bahwa tab _Posts_ tidak lagi menampilkan postingan yang Anda pilih sebelumnya. Itu karena setiap kali Anda berpindah ke tab baru, Vue akan membuat *Instance* baru dari `currentTabComponent`.

Membuat kembali komponen yang dinamis merupakan tindakan yang bermanfaat, tapi dalam kasus ini, kami ingin sekali *Instance* komponen tab di-*cache* setelah dibuat pertama kali. Untuk mengatasi masalah ini, Kami akan membungkus komponen dinamis kami dengan elemen `<keep-alive>`:

``` html
<!-- Komponen yang tidak aktif akan di-*cache*! -->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

Lihat hasilnya di bawah ini:

{% raw %}
<div id="dynamic-component-keep-alive-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <keep-alive>
    <component
      v-bind:is="currentTabComponent"
      class="dynamic-component-demo-tab"
    ></component>
  </keep-alive>
</div>
<script>
new Vue({
  el: '#dynamic-component-keep-alive-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
{% endraw %}

Sekarang tab _Posts_ bisa mempertahankan *state*nya (postingan yang telah dipilih) bahkan saat tidak di-*render*. Lihat di [fiddle](https://jsfiddle.net/chrisvfritz/Lp20op9o/) untuk kode lengkapnya.

<p class="tip">Perhatikan bahwa `<keep-alive>` membutuhkan nama untuk semua komponen yang akan dipindahkan, baik menggunakan opsi `name` pada komponen, atau menggunakan nama dari komponen yang telah didaftarkan secara lokal/global.</p>

Lihat detail selengkapnya tentang `<keep-alive>` di [API reference](../api/#keep-alive).

## Komponen Async

Di sebuah aplikasi yang besar, mungkin kami perlu membagi aplikasi kami menjadi beberapa bagian kecil, dan hanya memuat komponen dari server saat kami membutuhkannya. Untuk membuatnya lebih mudah, Vue memungkinkan Anda untuk mendefinisikan komponen Anda sebagai *factory function* yang secara asinkron menyelesaikan pendefinisian komponen Anda. Vue hanya akan memicu *factory function* saat komponen perlu di-*render* dan akan di-*cache* hasilnya untuk di-*render* kembali di masa mendatang. Misalnya:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Lewati pendefinisian komponen ke *resolve callback*
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

Seperti yang Anda lihat, *factory function* akan menerima `resolve` *callback*, yang harus dipanggil saat Anda telah mengambil definisi komponen Anda dari server. Anda juga bisa memanggil `reject(reason)` untuk menunjukkan bahwa pemuatan komponen Anda telah gagal. `setTimeout` di sini hanya untuk demonstrasi; bagaimana cara mengambil komponen, itu terserah Anda. Salah satu opsi yang kami sarankan adalah menggunakan komponen *async* dengan [Fitur *code-splitting* Webpack](https://webpack.js.org/guides/code-splitting/):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Sintaks khusus ini akan memberikan instruksi ke webpack untuk
  // membagi kode *built* Anda menjadi *bundles* secara otomatis
  // yang akan di muat oleh *Ajax requests*.
  require(['./my-async-component'], resolve)
})
```

Anda juga bisa mengembalikan `Promise` di *factory function*, jadi dengan sintaks Webpack 2 dan ES2015 yang bisa Anda lakukan adalah:

``` js
Vue.component(
  'async-webpack-example',
  // *function* `import` akan mengembalikan *Promise*.
  () => import('./my-async-component')
)
```

Saat menggunakan [pendaftaran lokal](components-registration.html#Local-Registration), Anda juga bisa langsung menyediakan *function* yang akan mengembalikan `Promise`:

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">Jika Anda pengguna <strong>Browserify</strong> yang ingin menggunakan komponen *async*, sayangnya pembuat Browserify [telah menjelaskan](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) secara resmi bahwa memuat *async* di Browserify itu tidak didukung. Komunitas Browserify telah menemukan [beberapa solusi](https://github.com/vuejs/vuejs.org/issues/620) yang mungkin bermanfaat untuk aplikasi yang sudah ada dan kompleks. Untuk semua skenario lainnya, kami sarankan untuk menggunakan webpack untuk sistem *build* yang mendukung *async*.</p>

### Menangani Pemuatan State

> Baru di versi 2.3.0+

*Async component factory* juga bisa mengembalikan objek dengan menggunakan format berikut:

``` js
const AsyncComponent = () => ({
  // Komponen yang dimuat (harus *Promise*)
  component: import('./MyComponent.vue'),
  // Komponen yang akan di gunakan saat komponen *async* sedang dimuat
  loading: LoadingComponent,
  // Komponen yang digunakan jika memuat gagal
  error: ErrorComponent,
  // Jeda sebelum menampikan komponen yang sedang dimuat. Default: 200ms.
  delay: 200,
  // Komponen *error* akan ditampilkan jika batas waktu
  // yang disediakan telah dilampaui. Default: Infinity.
  timeout: 3000
})
```

> Perhatikan bahwa Anda harus menggunakan [Vue Router](https://github.com/vuejs/vue-router) 2.4.0+ jika Anda ingin menggunakan sintaks di atas untuk *route* komponen.
