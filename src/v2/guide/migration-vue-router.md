---
judul: Migrasi dari Vue Router 0.7.x
tipe: panduan
urutan: 702
---

> Hanya Vue Router 2 yang cocok dengan Vue 2, jadi jika Anda memperbarui Vue, Anda diharuskan memperbarui Vue Router juga. Itulah sebabnya kami menyertakan rincian tentang jalur migrasi disini di dokumen utama. Untuk panduan lengkap penggunaan Vue Router yang baru, silakan lihat [Dokumen Vue Router](https://router.vuejs.org/en/)

## Inisialisasi Router

### `router.start` <sup>diganti</sup>

Tidak ada lagi API spesial untuk menginisialisasi sebuah aplikasi dengan Vue Router. Itu berarti bukannya:

``` js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

Anda mengoper properti router ke sebuah *instance* Vue:

``` js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

Atau, jika Anda menggunakan *build* khusus *runtime* Vue:

``` js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pemanggilan <code>router.start</code></p>
</div>
{% endraw %}

## Definisi Rute

### `router.map` <sup>diganti</sup>

Kini rute didefinisikan sebagai *array* pada [opsi `routes`](https://router.vuejs.org/en/essentials/getting-started.html#javascript) pada saat instansiasi router. Jadi rute berikut sebagai contoh:

``` js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

Sebagai gantinya akan didefinisikan dengan:

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

Sintaksis array memungkinkan pencocokan rute yang lebih mudah diprediksi, sejak mengulang-ulang sebuah objek tidak dijamin untuk menggunakan urutan *Key* yang sama di seluruh peramban.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pemanggilan <code>router.map</code></p>
</div>
{% endraw %}

### `router.on` <sup>dihapus</sup>

Jika Anda perlu membuat rute secara terprogram saat memulai aplikasi Anda, Anda bisa melakukan hal tersebut dengan cara mendorong definisi ke sebuah *routes array* secara dinamis. Sebagai contoh:

``` js
// Basis rute normal
var routes = [
  // ...
]

// Rute yang dibuat secara dinamis
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

Jika Anda hendak menambahkan rute baru setelah *router* diinstansiasi, Anda dapat mengganti pencocokan router dengan yang baru yang menyertakan rute yang ingin Anda tambahkan:

``` js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pemanggilan <code>router.on</code></p>
</div>
{% endraw %}

### `router.beforeEach` <sup>berubah</sup>

`router.beforeEach` sekarang berfungsi secara tidak sinkron dan menggunakan fungsi `next` sebagai argumen ketiga.

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

``` js
router.beforeEach(function (to, from, next) {
  if (to.path === '/forbidden') {
    next(false)
  } else {
    next()
  }
})
```

### `subRoutes` <sup>berubah nama</sup>

[Berubah nama menjadi `children`](https://router.vuejs.org/en/essentials/nested-routes.html) untuk konsistensi dalam Vue dan dengan pustaka perutean lainnya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh pemanggilan <code>subRoutes</code></p>
</div>
{% endraw %}

### `router.redirect` <sup>diganti</sup>

Sekarang ini merupakan sebuah [opsi pada definisi rute](https://router.vuejs.org/en/essentials/redirect-and-alias.html). Jadi sebagai contoh, Anda akan memperbarui:

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

ke sebuah definisi seperti dibawah ini pada konfigurasi `routes` Anda:

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh pemanggilan <code>router.redirect</code></p>
</div>
{% endraw %}

### `router.alias` <sup>diganti</sup>

Sekarang ini merupakan sebuah [opsi pada definisi untuk rute](https://router.vuejs.org/en/essentials/redirect-and-alias.html) yang ingin Anda berikan alias. Jadi sebagai contoh, Anda akan memperbarui:

``` js
router.alias({
  '/manage': '/admin'
})
```

ke sebuah definisi seperti dibawah ini pada konfigurasi `routes` Anda:

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

Jika Anda menginginkan lebih dari satu alias, Anda dapat juga menggunakan sintaksis array:

{% codeblock lang:js %}
``` js
alias: ['/manage', '/administer', '/administrate']
```
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh pemanggilan <code>router.alias</code></p>
</div>
{% endraw %}

### Properti Rute Kewenangan <sup>diganti</sup>

Properti rute kewenangan sekarang harus dicakup dalam properti meta baru, untuk menghindari konflik dengan fitur yang akan datang. Jadi sebagai contoh, jika Anda mendefinisikan:

``` js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

Maka sekarang Anda memperbaruinya menjadi:

``` js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```

Lalu ketika nanti mengakses properti ini pada sebuah rute, Anda akan tetap melewati meta. Sebagai contoh:

``` js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh properti rute kewenangan yang tidak tercakup pada meta.</p>
</div>
{% endraw %}

### [] Sintaksis untuk Array pada *Query* <sup>dihapus</sup>

Ketika mengoper satu atau lebih *array* ke parameter *query*, sintaksis QueryString tidak lagi `/foo?users[]=Tom&users[]=Jerry`, tetapi sintaksis yang baru adalah `/foo?users=Tom&users=Jerry`. Secara internal, `$route.query.users` akan tetap menjadi sebuah Array, tapi jika hanya ada satu parameter pada query: `/foo?users=Tom`, lalu mengakses rute ini secara langsung, maka tidak ada cara untuk router mengetahui bahwa kita mengharapkan `users` menjadi sebuah Array. Dikarenakan hal ini, pertimbangkan untuk menambahkan properti terhitung dan mengganti setiap referensi dari `$route.query.users` dengan:

```javascript
export default {
  // ...
  computed: {
    // users will always be an array
    users () {
      const users = this.$route.query.users
      return Array.isArray(users) ? users : [users]
    }
  }
}
```

## Pencocokan Rute

Pencocokan rute sekarang pada dasarnya menggunakan [path-to-regexp](https://github.com/pillarjs/path-to-regexp), membuat hal ini menjadi lebih fleksibel daripada sebelumnya.

### Satu atau lebih parameter bernama <sup>berubah</sup>

Sintaksis berubah sedikit, jadi sebagai contoh `/category/*tags`, perlu diperbarui menjadi `/category/:tags+`.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh sintaksis rute yang sudah usang.</p>
</div>
{% endraw %}

## Tautan

### `v-link` <sup>diganti</sup>

Direktif `v-link` diganti dengan [komponen `<router-link>`](https://router.vuejs.org/en/api/router-link.html) yang baru, karena jenis pekerjaan ini sekarang hanya menjadi tanggung jawab dari komponen di Vue 2. Ini berarti kapanpun dan dimanapun Anda memiliki tautan seperti ini:

``` html
<a v-link="'/about'">About</a>
```

Anda harus memperbaruinya menjadi seperti ini:

``` html
<router-link to="/about">About</router-link>
```

Perlu dicatat bahwa `target="_blank"` tidak didukung pada `<router-link>`, jadi jika Anda menginginkan untuk membuka tautan pada *tab* baru, Anda harus menggunakan `<a>` sebagai gantinya. 

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari direktif <code>v-link</code>.</p>
</div>
{% endraw %}

### `v-link-active` <sup>diganti</sup>

Direktif `v-link-active` juga telah digantikan dengan atribut `tag` pada [komponen `<router-link>`](https://router.vuejs.org/en/api/router-link.html). Jadi sebagai contoh, Anda memperbarui ini:

``` html
<li v-link-active>
  <a v-link="'/about'">About</a>
</li>
```

menjadi ini:

``` html
<router-link tag="li" to="/about">
  <a>About</a>
</router-link>
```

`<a>` akan menjadi tautan yang sebenarnya (dan akan mendapat href yang tepat), tapi kelas yang aktif akan diaplikasikan ke `<li>` yang diluar.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari direktif <code>v-link-active</code>.</p>
</div>
{% endraw %}

## Navigasi Terprogram

### `router.go` <sup>diganti</sup>

Untuk konsistensi dengan [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API), sekarang `router.go` hanya digunakan untuk [navigasi back/forward](https://router.vuejs.org/en/essentials/navigation.html#routergon), sedangkan [`router.push`](https://router.vuejs.org/en/essentials/navigation.html#routerpushlocation) digunakan untuk menavigasikan ke halaman tertentu.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari penggunaan <code>router.go</code> dimana <code>router.push</code> harus digunakan sebagai gantinya.</p>
</div>
{% endraw %}

## Opsi Router: Mode

### `hashbang: false` <sup>dihapus</sup>

Hashbangs tidak lagi dibutuhkan oleh Google untuk merayapi sebuah URL, jadi mereka tidak lagi menjadi bawaan (atau bahkan sebuah opsi) untuk strategi hash.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari opsi <code>hashbang: false</code>.</p>
</div>
{% endraw %}

### `history: true` <sup>diganti</sup>

Semua opsi mode perutean telah diringkas menjadi [opsi `mode`](https://router.vuejs.org/en/api/options.html#mode) tunggal. Pembaruan:

``` js
var router = new VueRouter({
  history: 'true'
})
```

menjadi:

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari opsi <code>history: true</code>.</p>
</div>
{% endraw %}

### `abstract: true` <sup>diganti</sup>

Semua opsi mode perutean telah diringkas menjadi [opsi `mode`](https://router.vuejs.org/en/api/options.html#mode) tunggal. Pembaruan:

``` js
var router = new VueRouter({
  abstract: 'true'
})
```

to:

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari opsi <code>abstract: true</code>.</p>
</div>
{% endraw %}

## Opsi Rute: Lain-ain

### `saveScrollPosition` <sup>diganti</sup>

Hal ini telah digantikan dengan [opsi `scrollBehavior`](https://router.vuejs.org/en/advanced/scroll-behavior.html) yang menerima sebuah *function*, jadi perilaku gulir sepenuhnya dapat disesuaikan walaupun tiap rute. Ini membuka banyak kemungkinan baru, tapi untuk mengulang perilaku lama dari:

``` js
saveScrollPosition: true
```

Anda dapat menggantikannya dengan:

``` js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari opsi <code>saveScrollPosition: true</code>.</p>
</div>
{% endraw %}

### `root` <sup>berubah nama</sup>

Berubah nama menjadi `base` untuk konsistensi dengan [elemen HTML `<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari opsi <code>root</code>.</p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>dihapus</sup>

This option is no longer necessary now that Vue's transition system has explicit [`appear` transition control](transitions.html#Transitions-on-Initial-Render).

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari opsi <code>transitionOnLoad: true</code>.</p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>dihapus</sup>

Dihapus dikarenakan untuk penyederhanaan kait. Jika Anda benar-benar ingin menekan kesalahan transisi, Anda bisa menggunakan [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) sebagai gantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari opsi <code>suppressTransitionError: true</code>.</p>
</div>
{% endraw %}

## Pengait Rute

### `activate` <sup>diganti</sup>

Gunakan [`beforeRouteEnter`](https://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) di dalam komponen sebagai gantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pengait <code>beforeRouteEnter</code>.</p>
</div>
{% endraw %}

### `canActivate` <sup>diganti</sup>

Gunakan [`beforeEnter`](https://router.vuejs.org/en/advanced/navigation-guards.html#perroute-guard) di dalam rute sebagai gantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pengait <code>canActivate</code>.</p>
</div>
{% endraw %}

### `deactivate` <sup>dihapus</sup>

Gunakan pengait komponen [`beforeDestroy`](../api/#beforeDestroy) atau [`destroyed`](../api/#destroyed) sebagai gantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pengait <code>deactivate</code>.</p>
</div>
{% endraw %}

### `canDeactivate` <sup>diganti</sup>

Gunakan [`beforeRouteLeave`](https://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) di dalam komponen sebagai gantinya.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pengait <code>canDeactivate</code>.</p>
</div>
{% endraw %}

### `canReuse: false` <sup>dihapus</sup>

Tidak ada lagi kasus penggunaan seperti ini di dalam Vue Router yang baru.

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh opsi <code>canReuse: false</code>.</p>
</div>
{% endraw %}

### `data` <sup>diganti</sup>

Properti `$route` sekarang reaktif, jadi Anda dapat menggunakan sebuah *watcher* untuk memberi reaksi pada perubahan rute, seperti ini:

``` js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari pengait <code>data</code>.</p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>dihapus</sup>

Definisikan sendiri properti Anda (cth: `isLoading`), kemudian perbarui *state* pemuatan di dalam sebuah *watcher* pada rute. Sebagai contoh, jika sedang mengambil data dengan [axios](https://github.com/mzabriskie/axios):

``` js
data: function () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': function () {
    var self = this
    self.isLoading = true
    self.fetchData().then(function () {
      self.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    var self = this
    return axios.get('/api/posts')
      .then(function (response) {
        self.posts = response.data.posts
      })
      .catch(function (error) {
        self.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Jalur Peningkatan</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> pada basis kode Anda untuk mencari contoh dari properti meta <code>$loadingRouteData</code>.</p>
</div>
{% endraw %}
