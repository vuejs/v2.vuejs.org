---
title: Membuat Blog Bertenaga CMS
type: cookbook
order: 5
---

Jadi Anda baru saja meluncurkan website Vue.js Anda, selamat! Sekarang Anda ingin menambahkan sebuah blog yang cepat terhubung ke dalam website Anda dan Anda tidak ingin harus merubah seluruh server hanya untuk menjadi *host* Wordpress *instance* (atau CMS dilengkapi DB untuk hal ini). Anda hanya ingin bisa menambahkan beberapa komponen blog Vue.js dan beberapa rute dan membuatnya berfungsi, bukan? Apa yang Anda cari adalah blog yang sepenuhnya di didukung oleh API yang dapat Anda konsumsi secara langsung dari aplikasi Vue.js Anda. Tutorial ini akan mengajarkan Anda bagaimana melakukannya. Mari menyelaminya.

Kita akan membangun dengan cepat sebuah blog bertenaga CMS dengan Vue.js. Ini menggunakan [ButterCMS](https://buttercms.com/), sebuah CMS yang mengutamakan API, yang mengijinkan Anda mengelola konten menggunakan ButterCMS dasbor dan mengintegrasikan API konten ke dalam aplikasi Vue.js Anda. Anda dapat menggunakan ButterCMS untuk proyek Vue.js baru maupun yang sudah ada.

![Butter Dashboard](https://user-images.githubusercontent.com/160873/36677285-648798e4-1ad3-11e8-9454-d22fca8280b7.png "Butter Dashboard")

## Memasang

Jalankan perintah berikut pada *commandline*:

```bash
npm install buttercms --save
```

Butter juga dapat di muat menggunakan CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
```

## Memulai Cepat

Atur token API Anda:

```javascript
var butter = require('buttercms')('your_api_token');
```

Menggunakan ES6:

```javascript
import Butter from 'buttercms';
const butter = Butter('your_api_token');
```

Menggunakan CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
<script>
  var butter = Butter('your_api_token');
</script>
```

Impor file ini ke dalam komponen dimana Anda ingin menggunakan ButterCMS. Kemudian dari konsol jalankan:

```javascript
butter.post.list({page: 1, page_size: 10}).then(function(response) {
  console.log(response)
})
```

Permintaan API ini mengambil pos blog Anda. Akun Anda dilengkapi dengan sebuah contoh pos yang akan Anda lihat di dalam respon.

## Menampilkan pos

Untuk menampilkan pos-pos, kita buat sebuah rute `/blog` (menggunakan Vue Router) di dalam aplikasi kita dan mengambil pos blog dari API Butter, serta rute `/blog/:slug` untuk menangani masing-masing pos.

Lihat [Referensi API](https://buttercms.com/docs/api/?javascript#blog-posts) ButterCMS untuk opsi tambahan seperti filter berdasar kategori atau penulis. Respon juga termasuk beberapa *metadata* yang akan kita gunakan untuk *pagination*.

`router/index.js:`

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import BlogHome from '@/components/BlogHome'
import BlogPost from '@/components/BlogPost'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/blog/',
      name: 'blog-home',
      component: BlogHome
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost
    }
  ]
})
```

Kemudian buat `components/BlogHome.vue` yang akan menjadi halaman utama blog Anda yang menampilkan daftar pos Anda paling baru.

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-home',
    data() {
      return {
        page_title: 'Blog',
        posts: []
      }
    },
    methods: {
      getPosts() {
        butter.post.list({
          page: 1,
          page_size: 10
        }).then(res => {
          this.posts = res.data.data
        })
      }
    },
    created() {
      this.getPosts()
    }
  }
</script>

<template>
  <div id="blog-home">
      <h1>{{ page_title }}</h1>
      <!-- Create `v-for` and apply a `key` for Vue. Here we are using a combination of the slug and index. -->
      <div
        v-for="(post,index) in posts"
        :key="post.slug + '_' + index"
      >
        <router-link :to="'/blog/' + post.slug">
          <article class="media">
            <figure>
              <!-- Bind results using a `:` -->
              <!-- Use a `v-if`/`else` if their is a `featured_image` -->
              <img
                v-if="post.featured_image"
                :src="post.featured_image"
                alt=""
              >
              <img
                v-else
                src="http://via.placeholder.com/250x250"
                alt=""
              >
            </figure>
            <h2>{{ post.title }}</h2>
            <p>{{ post.summary }}</p>
          </article>
        </router-link>
      </div>
  </div>
</template>
```

Berikut tampilannya (perhatikan bahwa kita menambahkan CSS dari https://bulma.io/ untuk penataan secara cepat)

![buttercms-bloglist](https://user-images.githubusercontent.com/160873/36868500-1b22e374-1d5e-11e8-82a0-20c8dc312716.png)

Sekarang buat `components/BlogPost.vue` yang akan menjadi halaman pos blog untuk menampilkan sebuah pos.

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: {}
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    created() {
      this.getPost()
    }
  }
</script>

<template>
  <div id="blog-post">
    <h1>{{ post.data.title }}</h1>
    <h4>{{ post.data.author.first_name }} {{ post.data.author.last_name }}</h4>
    <div v-html="post.data.body"></div>

    <router-link
      v-if="post.meta.previous_post"
      :to="/blog/ + post.meta.previous_post.slug"
      class="button"
    >
      {{ post.meta.previous_post.title }}
    </router-link>
    <router-link
      v-if="post.meta.next_post"
      :to="/blog/ + post.meta.next_post.slug"
      class="button"
    >
      {{ post.meta.next_post.title }}
    </router-link>
  </div>
</template>
```

Berikut pratinjaunya:

![buttercms-blogdetail](https://user-images.githubusercontent.com/160873/36868506-218c86b6-1d5e-11e8-8691-0409d91366d6.png)

Sekarang aplikasi kita menarik semua pos blog dan kita dapat menavigasi ke masing-masing pos. Namun, tombol pos berikutnya/ pos sebelumnya tidak berfungsi

Satu hal yang perlu diperhatikan ketika menggunakan rute dengan parameter adalah ketika pengguna menavigasi dari `/blog/foo` ke `/blog/bar`, komponen yang sama akan digunakan kembali. Karena kedua rute me-*render* komponen yang sama, ini lebih efisien daripada menghancurkan *instance* lama kemudian membuat yang baru.

<p class="tip">Perlu dipahami, bahwa menggunakan komponen dengan cara ini berarti bahwa kait siklus hidup komponen tidak akan dipanggil. Kunjungi dokumen Vue Router untuk mempelajari lebih lanjut tentang [Pencocokan Rute Dinamis] (https://router.vuejs.org/en/essentials/dynamic-matching.html)</p>

Untuk memperbaiki ini kita perlu memantau objek `$route` dan memanggil `getPost()` ketika rute berubah.

Bagian `<script>` yang sudah diperbarui di `components/BlogPost.vue`:

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: null
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    watch: {
      $route(to, from) {
        this.getPost()
      }
    },
    created() {
      this.getPost()
    }
  }
</script>
```

Sekarang aplikasi Anda memiliki blog yang berfungsi yang dapat diperbarui dengan mudah di dasbor ButterCMS.

## Kategori, Tag, dan Penulis

Gunakan API Butter untuk kategori, tag dan penulis untuk menampilkan dan memfilter konten di blog Anda.

Lihat Referensi API ButterCMS untuk info lebih lanjut tentang objek ini:

* [Kategori](https://buttercms.com/docs/api/?ruby#categories)
* [Tag](https://buttercms.com/docs/api/?ruby#tags)
* [Penulis](https://buttercms.com/docs/api/?ruby#authors)

Berikut adalah contoh menampilkan daftar semua kategori dan mendapatkan pos berdasar kategori. Panggil method pada kait siklus hidup `created()`:

```javascript
methods: {
  // ...
  getCategories() {
    butter.category.list()
      .then(res => {
        console.log('List of Categories:')
        console.log(res.data.data)
      })
  },
  getPostsByCategory() {
    butter.category.retrieve('example-category', {
        include: 'recent_posts'
      })
      .then(res => {
        console.log('Posts with specific category:')
        console.log(res)
      })
  }
},
created() {
  // ...
  this.getCategories()
  this.getPostsByCategory()
}
```

## Pola Alternatif

Pola alternatif untuk dipertimbangkan, terutama jika Anda lebih suka menulis dengan Markdown, adalah dengan menggunakan sesuatu seperti [Nuxtent](https://nuxtent-module.netlify.com/guide/writing/#async-components). Nuxtent memungkinkan Anda menggunakan `Vue Component` di dalam file Markdown. Pendekatan ini akan mirip dengan pendekatan situs statis (contoh Jekyll) di mana Anda menulis pos blog Anda di dalam file Markdown, Nuxtent menambahkan integrasi yang bagus antara Vue.js dan Markdown memungkinkan Anda untuk hidup di dunia 100% Vue.js.

## Ringkasan

Itulah tutorialnya! Anda sekarang memiliki blog bertenaga CMS yang berfungsi penuh yang berjalan di aplikasi Anda. Kami berharap tutorial ini bermanfaat dan menjadikan pengalaman pengembangan Anda dengan Vue.js semakin menyenangkan :)
