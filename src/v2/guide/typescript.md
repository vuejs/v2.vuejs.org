---
title: Dukungan TypeScript
type: guide
order: 403
---

> [Vue CLI](https://cli.vuejs.org) menyediakan dukungan perkakas TypeScript bawaan. Pada versi mayor Vue yang akan datang (3.x), kami juga berencana untuk meningkatkan dukungan TypeScript dengan *built-in class* berbasis komponen API dan dukungan TSX.

## Deklarasi Resmi dalam NPM Package

Sistem tipe statis dapat membantu mencegah banyak kesalahan *runtime* yang potensial, terutama jika aplikasi bertumbuh. Itulah mengapa Vue dibekali dengan [deklarasi tipe resmi](https://github.com/vuejs/vue/tree/dev/types) untuk [TypeScript](https://www.typescriptlang.org/) - bukan hanya dalam inti Vue, tetapi juga untuk [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) serta untuk [vuex](https://github.com/vuejs/vuex/tree/dev/types).
 

Karena [dimuat dalam NPM](https://cdn.jsdelivr.net/npm/vue/types/), dan TypeScript terbaru tahu cara memutuskan deklarasi tipe dalam NPM package, ini berarti ketika melakukan instalasi melalui NPM, Anda tidak perlu perkakas tambahan apapun untuk menggunakan TypeScript dengan Vue.

## Konfigurasi yang Disarankan

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ini sejalan dengan dukungan browser Vue
    "target": "es5",
    // ini mengaktifkan stricter inference untuk properti data pada `this`
    "strict": true,
    // jika menggunakan webpack 2+ atau rollup, untuk memanfaatkan tree shaking:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Harap diperhatikan bahwa Anda perlu menyertakan `strict: true` (atau setidaknya `noImplicitThis: true` yang merupakan bagian dari penanda `strict`) untuk meningkatkan pemeriksaan tipe dari `this` dalam *component method*, jika tidak maka selalu dianggap sebagai tipe `any`.

Untuk lebih jelasnya, lihat [dokumentasi opsi kompilator TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

## Perkakas Pengembangan

### Pembuatan Proyek

[Vue CLI 3](https://github.com/vuejs/vue-cli) dapat membuat proyek baru menggunakan TypeScript. Untuk memulai:

```bash
# 1. Memasang Vue CLI, jika belum pernah melakukan instalasi sebelumnya
npm install --global @vue/cli

# 2. Buat sebuah proyek baru, kemudian pilih opsi "Manually select features"
vue create my-project-name
```

### Dukungan Editor

Untuk mengembangkan aplikasi Vue dengan TypeScript, kami sangat menyarankan Anda menggunakan [Visual Studio Code](https://code.visualstudio.com/), yang menyediakan dukungan luar biasa untuk TypeScript. Jika Anda menggunakan [komponen file tunggal](./single-file-components.html) (SFC), gunakan [ekstensi Vetur](https://github.com/vuejs/vetur) yang mengagumkan, yang menyediakan penyaranan TypeScript di dalam SFC and banyak fitur luar biasa lainnya.

[WebStorm](https://www.jetbrains.com/webstorm/) juga menyediakan dukungan yang tak kalah menakjubkan untuk TypeScript maupun Vue.

## Penggunaan Dasar

Agar TypeScript menyimpulkan tipe dengan tepat di dalam pilihan Vue *component*, Anda perlu mendefinisikan komponen dengan `Vue.component` atau `Vue.extend`:

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // penyimpulan tipe (type inference) diaktifkan
})

const Component = {
  // ini TIDAK akan memiliki penyimpulan tipe
  // sebab TypeScript tidak dapat memberitahu pilihan ini untuk Vue component.
}
```

## Komponen Class-Style Vue

Jika Anda lebih memilih sebuah *class* berbasis API ketika mendeklarasikan komponen, Anda bisa menggunakan [vue-class-component](https://github.com/vuejs/vue-class-component) *decorator* yang diurus secara resmi:

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// @Component decorator menandakan class adalah sebuah Vue component
@Component({
  // Semua pilihan komponen diperbolehkan di sini
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Data awal dapat dideklarasi sebagai instance property
  message: string = 'Hello!'

  // Component method dapat dideklarasi sebagai instance method
  onClick (): void {
    window.alert(this.message)
  }
}
```

## Augmentasi Tipe untuk Penggunakan dengan Plugin

*Plugin* dapat menambahkan ke properti *global/instance* dan pilihan komponen Vue. Dalam kasus ini, deklarasi tipe diperlukan untuk membuat *plugin* dikompilasi dalam TypeScript. Kabar baiknya, terdapat sebuah fitur TypeScript untuk melakukan augmentasi tipe yang telah ada bernama [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

Sebagai contoh, berikut deklarasi sebuah *instance property* `$myProperty` dengan tipe `string`:

``` ts
// 1.Patikan melakukan import 'vue' sebelum mendeklarasi augmented type
import Vue from 'vue'

// 2. Tentukan sebuah file dengan tipe yang Anda ingin augmentasi
//    Vue memiliki tipe constructor pada types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Deklarasi augmentasi untuk Vue
  interface Vue {
    $myProperty: string
  }
}
```

Setelah menambahkan kode di atas sebagai *file* deklarasi  (seperti `my-property.d.ts`) dalam proyek Anda, Anda dapat menggunakan `$myProperty` pada *Vue instance*.

```ts
var vm = new Vue()
console.log(vm.$myProperty) // Ini harusnya berhasil dikompilasi
```

Anda juga dapat mendeklarasikan properti global dan pilihan komponen tambahan:

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // Properti global harus dideklarasikan
  // pada interface `VueConstructor` 
  interface VueConstructor {
    $myGlobal: string
  }
}

// ComponentOptions dideklarasikan pada types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

Deklarasi di atas memungkinkan kode berikut untuk dikompilasi:

```ts
// Properti global
console.log(Vue.$myGlobal)

// Pilihan komponen tambahan
var vm = new Vue({
  myOption: 'Hello'
})
```

## Menganotasi Tipe Kembalian

Karena sifat *circular* dari *file* deklarasi Vue, TypeScript mungkin mengalami kesulitan menyimpulkan tipe *method* tertentu. Untuk alasan ini, Anda mungkin perlu membuat anotasi tipe kembalian pada beberapa *method* seperti `render` dan `computed`.

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    // perlu anotasi tergantung `this` dalam tipe kembalian
    greet (): string {
      return this.msg + ' world'
    }
  },
  computed: {
    // perlu anotasi
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement` disimpulkan, tetapi `render` perlu tipe kembalian
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

Jika menemukan penyimpulan tipe atau *member completion* tidak bekerja, melakukan anotasi *method* tertentu mungkin dapat membantu menyelesaikan masalah. Gunakan opsi `--noImplicitAny` akan membantu menemukan banyak dari *method* tanpa anotasi tersebut.
