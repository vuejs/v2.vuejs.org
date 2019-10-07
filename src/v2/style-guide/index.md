---
title: Style Guide
type: style-guide
---

Ini adalah panduan resmi gaya menulis kode yang spesifik untuk Vue . Jika kamu menggunakan Vue pada sebuah proyek, ini adalah referensi yang bagus untuk menghindari _error_/kesalahan, menghabiskan waktu pada hal remeh, dan pola-pola yang buruk. Meskipun begitu, kami tidak menganggap panduan gaya(_style-guide_) dalam kode apapun selalu bisa sesuai dengan setiap tim atau proyek, maka penyelewengan yang hati-hati dianjurkan berdasarkan pengalaman, teknologi penunjang lain yang digunakan, dan nilai yang dijunjung.

Secara umum, kami menghindari saran tentang JavaScript atau HTML. Tidak masalah kamu menggunakan `;` atau `,`, apakah petik tunggal: `''`, atau ganda: `""` untuk nilai atribut. Meskipun beberapa pengecualian akan tetap ada, dimana kami dapati pola tertentu lebih membantu dalam konteks Vue.

> **Segera, kami juga akan menyediakan tips penunjang.** Terkadang kamu perlu disiplin, tapi sebisa mungkin, kami tunjukan bagaimana menggunakan ESLint dan proses otomasi lainnya untuk mempermudah.

Terakhir, kami akan membagi aturannya ke 4 kategori:



## Kategori Aturan

### Prioritas A: Essential(Mendasar)

Aturan-aturan ini membantu mencegah kesalahan, jadi pelajari dan patuhi dengan cara apa pun. Pengecualian mungkin ada, tetapi harus sangat jarang dan hanya dilakukan oleh mereka yang memiliki pengetahuan mendalam tentang JavaScript dan Vue.

### Prioritas B: Sangat Dianjurkan

Aturan-aturan ini didapati dapat meningkatkan keterbacaan(_readability_) dan / atau memudahkan developer di sebagian besar proyek. Kode akan tetap berjalan jika Kamu melanggarnya, tetapi pelanggaran harus jarang dan memiliki alasan yang dibenarkan.

### Prioritas C: Disarankan

Dimana terdapat banyak opsi yang sama-sama baik, opsi manapun dapat diterima selama dipastikan konsisten. Dalam aturan ini, kami menjelaskan setiap opsi yang dapat diterima dan menyarankan pilihan default. Itu berarti kamu bebas untuk membuat pilihan yang berbeda dalam basis kode kamu sendiri, selama kamu konsisten dan memiliki alasan yang bagus. Harap punya alasan yang bagus ya! Dengan beradaptasi dengan standar komunitas, kamu akan:

1. melatih otak kamu untuk lebih mudah menguraikan sebagian besar kode dari komunitas yang kamu temui
2. dapat menyalin dan menempelkan(_copy and paste_) sebagian besar contoh kode dari komunitas tanpa modifikasi
3. sering menemukan karyawan baru sudah terbiasa dengan gaya pengkodean pilihan kamu, setidaknya dalam hal Vue

### Prioritas D: Gunakan dengan Hati-hati

Beberapa fitur Vue ada untuk mengakomodasi kasus yang langka atau migrasi yang lebih lancar dari basis kode lawas. Namun ketika digunakan secara berlebihan, mereka dapat membuat kode Kamu lebih sulit untuk dirawat(_maintain_) atau bahkan menjadi sumber bug. Aturan-aturan ini menerangkan fitur-fitur yang berpotensi berisiko, menjelaskan kapan dan mengapa mereka harus dihindari.



## Aturan Prioritas A : Essential (Mencegah _Error_)



### Nama komponen dengan lebih dari satu kata <sup data-p="a">essential</sup>

**Nama komponen harus selalu multi-kata, kecuali untuk komponen root `App`.**

Ini [mencegah konflik](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name) dengan elemen HTML yang ada dan yang akan datang, karena semua elemen HTML adalah satu kata.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
Vue.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
Vue.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Komponen data <sup data-p="a">essential</sup>

**Komponen `data` harus berupa fungsi(_function_).**

Saat menggunakan properti `data` pada komponen (contoh. Di mana saja kecuali pada `new Vue`), nilai harus berupa fungsi yang mengembalikan objek.

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Ketika nilai `data` adalah objek, itu dibagi di semua _instance_ komponen. Bayangkan, misalnya, komponen `TodoList` dengan data ini:

``` js
data: {
  listTitle: '',
  todos: []
}
```

Kita mungkin ingin menggunakan lagi komponen ini, untuk memungkinkan pengguna(_user_) mempertahankan beberapa daftar (contoh. Untuk belanja, daftar harapan(_wishlists_), tugas harian, dll). Tapi ada masalah. Karena setiap _instance_ komponen merujuk ke objek data yang sama, mengubah judul satu daftar juga akan mengubah judul setiap daftar lainnya. Hal yang sama berlaku untuk menambahkan / mengedit / menghapus todo.

Sebagai gantinya, kita ingin setiap _instance_ komponen hanya mengelola datanya sendiri. Agar itu terjadi, setiap _instance_ harus menghasilkan objek data yang unik. Dalam JavaScript, ini dapat dilakukan dengan suatu fungsi yang mengembalikan(_return_) objek:

``` js
data: function () {
  return {
    listTitle: '',
    todos: []
  }
}
```
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

``` js
export default {
  data: {
    foo: 'bar'
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus
``` js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

``` js
// In a .vue file
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

``` js
// Tidak masalah menggunakan objek langsung di 
// _instance_ root Vue, karena hanya akan ada
// satu _instance_.
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}



### Definisi prop <sup data-p="a">essential</sup>

**Definisi prop harus sedetail mungkin.**

Dalam kode yang dikomit, definisi prop harus selalu sedetail mungkin, setidaknya menentukan jenis(_type_).

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

[definisi prop](https://vuejs.org/v2/guide/components.html#Prop-Validation) yang detail memiliki dua keuntungan:

- Mereka mendokumentasikan API dari komponen, sehingga mudah untuk melihat bagaimana komponen itu dimaksudkan untuk digunakan.
- Dalam pengembangan(_development_), Vue akan memperingatkan kamu jika suatu komponen menyediakan prop yang diformat salah, membantu kamu menangkap sumber kesalahan potensial.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
// Hanya boleh ketika _prototyping_
props: ['status']
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
props: {
  status: String
}
```

``` js
// Lebih bagus lagi!
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}



### `v-for` dengan key <sup data-p="a">essential</sup>

**Selalu gunakan `v-for` dengan `key`.**

`v-for` dengan `key` _selalu_ digandengkan pada komponen, untuk mempertahankan status internal komponen di bawah subtree. Bahkan untuk elemen, ini adalah praktik yang baik untuk mempertahankan perilaku yang dapat diprediksi, seperti [konstanta objek](https://bost.ocks.org/mike/constancy/) dalam animasi.

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Katakanlah kamu memiliki daftar todos:

``` js
data: function () {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

Kemudian kamu mengurutkannya berdasarkan abjad. Saat memperbarui DOM, Vue akan mengoptimalkan rendering untuk melakukan mutasi DOM se-efisien mungkin. Itu mungkin berarti menghapus elemen todo pertama, lalu menambahkannya lagi di akhir daftar.

Masalahnya adalah, ada kasus di mana penting untuk tidak menghapus elemen yang akan tetap ada di DOM. Misalnya, kamu mungkin ingin menggunakan `<transition-group>` untuk animasi penyortiran daftar, atau mempertahankan fokus jika elemen yang diberikan adalah `<input>`. Dalam kasus ini, menambahkan kunci unik untuk setiap item (contoh. `:key="todo.id"`) akan memberi tahu Vue bagaimana berperilaku lebih dapat diprediksi.

Dalam pengalaman kami, lebih baik untuk _selalu_ menambahkan kunci unik, sehingga kamu dan tim kamu tidak perlu khawatir tentang kasus kecil ini. Kemudian dalam skenario langka, performa-kritis di mana konstansi objek tidak diperlukan, kamu dapat membuat pengecualian secara sadar.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}



### Hindari `v-if` dengan `v-for` <sup data-p="a">essential</sup>

**Jangan pernah gunakan `v-if` dan `v-for` pada satu elemen yang sama.**

Ada dua kasus umum di mana ini bisa menggoda:

- Untuk memfilter item dalam daftar (contoh. `v-for="user in users" v-if="user.isActive"`). Dalam kasus ini, ganti `users` dengan properti baru yang mengembalikan daftar yang telah difilter (contoh.`activeUsers`).

- Untuk menghindari render daftar jika harus disembunyikan (contoh. `v-for="user in users" v-if="shouldShowUsers"`). Dalam kasus ini, pindahkan `v-if` kedalam wadah elemen lain (contoh.` ul`, `ol`).

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Ketika Vue memproses direktif, `v-for` memiliki prioritas lebih daripada `v-if`, maka templat ini:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Akan dievaluasi serupa dengan:

``` js
this.users.map(function (user) {
  if (user.isActive) {
    return user.name
  }
})
```

Jadi, bahkan jika kita hanya membuat elemen untuk sebagian kecil pengguna, kita harus mengiterasi seluruh daftar setiap kali kita merender ulang, apakah set pengguna aktif telah berubah atau tidak.

Alih-alih dengan mengiterasi properti yang telah dikomputasi, seperti ini:

``` js
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
      return user.isActive
    })
  }
}
```

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Kita mendapatkan keuntungan berikut:

- Daftar yang difilter akan dievaluasi kembali hanya jika ada perubahan yang relevan pada array `users`, membuat penyaringan/filter jauh lebih efisien.
- Menggunakan `v-for="user in activeUsers"`, kita _hanya_ mengiterasi pengguna aktif(`activeUsers`) selama render, menjadikan rendering jauh lebih efisien.
- Logika sekarang dipisahkan dari lapisan presentasi, membuat pemeliharaan (perubahan / perluasan logika) jauh lebih mudah.

Kita mendapatkan manfaat serupa dari memperbarui:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

ke:

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Dengan memindahkan `v-if` ke elemen wadah lain, kita tidak melakukan pengecekan `shouldShowUsers` untuk _setiap_ pengguna dalam daftar. Alih-alih, kita mengecek sekali and tidak mengevaluasi `v-for` jika `shouldShowUsers` bernilai false.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}



### Lingkup komponen gaya(_style_) <sup data-p="a">essential</sup>

**Untuk aplikasi, gaya dalam komponen tingkat atas `App` dan komponen tata letak(_layout_) mungkin bersifat global, tetapi semua komponen lainnya harus selalu dilingkup(_scoped_).**

Untuk [single-file components](../guide/single-file-components.html). _tidak_ harus menggunakan [`scoped` atribut](https://vue-loader.vuejs.org/en/features/scoped-css.html). membuat lingkupan bisa melalui [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html), strategi berbasis kelas seperti [BEM](http://getbem.com/), atau pustaka(_library/convention_) lainnya.

**Catatan, Pustaka komponen, harus lebih memilih strategi berbasis kelas daripada menggunakan atribut `scoped`.**

Ini akan memudahkan untuk mengesampingkan(_overriding_) gaya internal, dengan nama kelas yang dapat dibaca manusia , tidak terlalu spesifik, tetapi cukup untuk menghindari konflik.

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Jika kamu mengembangkan proyek besar, bekerja dengan pengembang lain, atau terkadang menyertakan HTML / CSS pihak ketiga (contoh. Dari Auth0), pelingkupan yang konsisten akan memastikan bahwa gaya kamu hanya berlaku untuk komponen yang dimaksudkan untuknya.

Di luar atribut `scoped`, menggunakan nama kelas unik dapat membantu memastikan bahwa CSS pihak ketiga tidak berlaku untuk HTML milikmu. Misalnya, banyak proyek menggunakan nama kelas `button`,`btn`, atau `icon`, jadi walaupun tidak menggunakan strategi seperti BEM, menambahkan awalan unik-aplikasi dan / atau komponen-spesifik (contoh.`ButtonClose-icon`) dapat memberikan perlindungan.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<template>
  <button class="button button-close">X</button>
</template>

<!-- menggunakan `scoped` atribut -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">X</button>
</template>

<!-- menggunakan CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">X</button>
</template>

<!-- menggunakan konvensi BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Nama properti pribadi <sup data-p="a">essential</sup>

**Selalu gunakan awalan `$_` properti pribadi khusus dalam plugin, mixin, dll. Kemudian untuk menghindari konflik dengan kode oleh penulis lain, sertakan juga lingkup bernama(_name scoped_) (contoh. `$_namaPluginMu`).**

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Vue menggunakan awalan `_` untuk mendefinisikan properti pribadinya sendiri, jadi menggunakan awalan yang sama (contoh.`_update`) berisiko menimpa properti _instance_. Bahkan jika kamu memeriksa dan Vue saat ini tidak menggunakan nama properti tertentu, tidak ada jaminan konflik tidak akan muncul di versi yang lebih baru.

Sedangkan untuk awalan `$`, tujuannya dalam ekosistem Vue adalah properti _instance_ khusus yang diekspos kepada pengguna, jadi menggunakannya untuk properti pribadi(_private_) tidak akan sesuai.

Sebagai gantinya, kami menyarankan untuk menggabungkan dua awalan menjadi `$_`, sebagai konvensi untuk properti pribadi yang ditentukan pengguna yang menjamin tidak ada konflik dengan Vue.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
var myGreatMixin = {
  // ...
  methods: {
    update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    _update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_update: function () {
      // ...
    }
  }
}
```

{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update: function () {
      // ...
    }
  }
}
```
{% raw %}</div>{% endraw %}



## Aturan Prioritas B: Sangat dianjurkan (Meningkatkan Keterbacaan/_Readability_)



### File komponen <sup data-p="b">sangat dianjurkan</sup>

**Setiap kali sistem build tersedia untuk menggabungkan file, setiap komponen harus dalam file sendiri.**

Ini membantu kamu untuk lebih cepat menemukan komponen ketika kamu perlu mengeditnya atau meninjau cara menggunakannya.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
{% raw %}</div>{% endraw %}



### Aturan huruf nama file single-file komponen <sup data-p="b">sangat dianjurkan</sup>

**Nama file [komponen file tunggal](../guide/single-file-components.html) harus selalu PascalCase atau kebab-case.**

PascalCase bekerja paling baik dengan pelengkapan otomatis dalam editor kode, karena konsisten dengan bagaimana kita mereferensikan komponen dalam JS (X) dan templat. Namun, nama file dengan campuran huruf kapital dan tidak kadang-kadang dapat membuat masalah pada sistem file yang tidak sensitif terhadap huruf kapital, yang mengapa penggunaan kebab-case juga dapat diterima.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
{% raw %}</div>{% endraw %}



### Nama komponen dasar <sup data-p="b">sangat dianjurkan</sup>

**Komponen dasar (contoh. komponen presentasi, bodoh(_dumb_), atau murni) yang menerapkan gaya dan konvensi khusus aplikasi semua harus dimulai dengan awalan tertentu, seperti `Base`,`App`, atau `V`.**

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Komponen-komponen ini menjadi dasar untuk gaya dan perilaku yang konsisten dalam aplikasi kamu. Komponen ini **hanya** mungkin tersusun dari:

- Elemen HTML,
- komponen dasar lainnya, dan
- Komponen UI pihak ketiga.

Tetapi mereka **tidak boleh** memiliki keadaan(_state_) global (contoh. Dari toko(_store_) Vuex).

Nama mereka sering menyertakan nama elemen yang mereka bungkus (contoh. `BaseButton`,`BaseTable`), kecuali tidak ada elemen untuk tujuan spesifik mereka (contoh. `BaseIcon`). Jika kamu membuat komponen serupa untuk konteks yang lebih spesifik, mereka akan hampir selalu mengkonsumsi komponen-komponen ini (contoh. `BaseButton` dapat digunakan dalam `ButtonSubmit`).

Beberapa keuntungan dari konvensi ini:

- Ketika disusun menurut abjad dalam editor, komponen dasar aplikasi kamu semuanya terdaftar bersama, sehingga lebih mudah diidentifikasi.

- Karena nama komponen harus selalu multi-kata, konvensi ini mencegah kamu dari keharusan memilih awalan acak untuk pembungkus komponen sederhana (contoh. `MyButton`, `VueButton`).

- Karena komponen ini sangat sering digunakan, kamu mungkin ingin membuatnya menjadi global alih-alih mengimpornya ke mana-mana. Awalan memungkinkan ini dengan memanfaatkan Webpack:

  ``` js
  var requireComponent = require.context("./src", true, /^Base[A-Z]/)
  requireComponent.keys().forEach(function (fileName) {
    var baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    var baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    Vue.component(baseComponentName, baseComponentConfig)
  })
  ```

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
{% raw %}</div>{% endraw %}



### Nama komponen single-instance <sup data-p="b">sangat dianjurkan</sup>

**Komponen yang seharusnya hanya memiliki satu _instance_ aktif harus dimulai dengan awalan `The`, untuk menyatakan bahwa hanya akan ada satu.**

Ini tidak berarti komponen hanya digunakan dalam satu halaman, tetapi hanya akan digunakan sekali _per halaman_. Komponen-komponen ini tidak pernah menerima prop, karena mereka khusus untuk aplikasi kamu, bukan konteksnya dalam aplikasi kamu. Jika kamu merasa perlu menambahkan prop, ini merupakan indikasi yang baik bahwa ini sebenarnya komponen yang dapat digunakan kembali yang hanya digunakan sekali per halaman _untuk saat ini_.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

```
components/
|- Heading.vue
|- MySidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
{% raw %}</div>{% endraw %}



### Nama komponen yang tergabung dengan erat  <sup data-p="b">sangat dianjurkan</sup>

**Komponen anak yang dipasangkan dengan induknya harus menyertakan nama komponen induk sebagai awalan.**

Jika komponen hanya menjadi jelas / mungkin dalam konteks komponen induk, hubungan itu harus jelas dalam namanya. Karena editor biasanya mengatur file berdasarkan abjad, ini akan membuat file berkaitan bersebelahan.

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Kamu mungkin tergoda untuk memecahkan masalah ini dengan memasukkan komponen anak di direktori yang dinamai dengan induknya. Sebagai contoh:
```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

atau:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Ini tidak direkomendasikan, karena menghasilkan:

- Banyak file dengan nama yang mirip, membuat pengalihan file dengan cepat dalam editor kode lebih sulit.
- Banyak sub-direktori bersarang, yang meningkatkan waktu yang diperlukan untuk menelusuri komponen di bilah sisi(_sidebar_) editor.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
{% raw %}</div>{% endraw %}



### Urutan kata dalam nama komponen <sup data-p="b">sangat dianjurkan</sup>

**Nama-nama komponen harus dimulai dengan kata-kata level tertinggi (seringkali paling umum) dan diakhiri dengan kata-kata pengubah deskriptif.**

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Kamu mungkin bertanya-tanya:

> "Mengapa kita memaksakan nama komponen untuk menggunakan bahasa yang kurang alami?"

Dalam bahasa Inggris alami, kata sifat dan deskriptor lain biasanya muncul sebelum kata benda, sementara pengecualian membutuhkan kata-kata penghubung. Sebagai contoh:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

Kamu pasti dapat memasukkan kata-kata penghubung ini dalam nama komponen jika kamu mau, tetapi urutannya tetap penting.

Juga perhatikan bahwa **apa yang dianggap "level tertinggi" akan kontekstual untuk aplikasi kamu.**Misalnya, bayangkan aplikasi dengan formulir pencarian. Ini mungkin termasuk komponen seperti ini:
:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Seperti yang mungkin kamu perhatikan, sangat sulit untuk melihat komponen mana yang spesifik untuk pencarian(_search_). Sekarang mari kita ganti nama komponen sesuai aturan:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Karena editor biasanya mengatur file secara alfabet, semua hubungan penting antara komponen sekarang terlihat jelas.

Kamu mungkin tergoda untuk memecahkan masalah ini secara berbeda, mengumpulkan semua komponen pencarian di bawah direktori "search", lalu semua komponen pengaturan di bawah direktori "settings". Kami hanya menyarankan mempertimbangkan pendekatan ini di aplikasi yang sangat besar (contoh. 100+ komponen), karena alasan ini:

- Biasanya dibutuhkan lebih banyak waktu untuk menavigasi melalui sub-direktori yang bersarang, daripada menggulir melalui direktori `components` tunggal.
- Konflik nama (contoh. Beberapa komponen `ButtonDelete.vue`) membuatnya lebih sulit untuk bernavigasi dengan cepat ke komponen tertentu dalam editor kode.
- _Refactoring_ menjadi lebih sulit, karena menemukan dan mengganti seringkali tidak cukup untuk memperbarui referensi relatif ke komponen yang dipindahkan.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
{% raw %}</div>{% endraw %}



### Komponen yang dapat ditutup sendiri  <sup data-p="b">sangat dianjurkan</sup>

**Komponen tanpa konten harus ditutup sendiri di [komponen file tunggal](../guide/single-file-components.html), templat string, dan [JSX](../guide/render-function.html#JSX) - tetapi tidak boleh di templat DOM.**

Komponen yang menutup sendiri mengkomunikasin bahwa mereka tidak hanya tidak memiliki konten, tetapi **dimaksudkan** untuk tidak memiliki konten. Seperti perbedaan antara halaman kosong di buku dan yang berlabel "Halaman ini sengaja dikosongkan." Kode kamu juga lebih bersih tanpa tag penutup yang tidak perlu.

Sayangnya, HTML tidak mengizinkan elemen khusus untuk ditutup sendiri - hanya elemen [resmi kekosongan(_"void"_)](https://www.w3.org/TR/html/syntax.html#void-elements). Itulah sebabnya strategi ini hanya mungkin ketika kompiler templat Vue dapat mencapai templat sebelum DOM, kemudian melayani HTML yang memenuhi spesifikasi DOM.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- In DOM templates -->
<my-component/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent/>
```

``` html
<!-- In DOM templates -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Aturan huruf nama komponen dalam templat <sup data-p="b">sangat dianjurkan</sup>

**Dalam kebanyakan proyek, nama komponen harus selalu PascalCase di [komponen file tunggal](../guide/single-file-components.html) dan templat string - tetapi kebab-case dalam templat DOM.**

PascalCase memiliki beberapa keunggulan dibandingkan kebab-case:

- Editor dapat melengkapi nama komponen secara otomatis dalam templat, karena PascalCase juga digunakan dalam JavaScript.
- `<MyComponent>` lebih berbeda secara visual dari elemen HTML yang satu kata daripada `<my-component>`, karena ada dua perbedaan karakter (dua huruf kapital), daripada hanya satu (tanda hubung).
- Jika kamu menggunakan elemen khusus non-Vue dalam templat kamu, seperti komponen web, PascalCase memastikan bahwa komponen Vue kamu tetap terlihat jelas.

Sayangnya, karena ketidakpekaan huruf HTML, templat DOM masih harus menggunakan kebab-case.

Juga perhatikan bahwa jika kamu sudah terlanjur banyak menggunakan kebab-case, konsistensi dengan konvensi HTML dan dapat menggunakan aturan huruf(_casing_) yang sama di semua proyek kamu mungkin lebih penting daripada keuntungan yang tercantum di atas. Dalam kasus tersebut, **menggunakan kebab-case di manapun juga dapat diterima.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<!-- Di single-file components dan string templates -->
<mycomponent/>
```

``` html
<!-- Di single-file components dan string templates -->
<myComponent/>
```

``` html
<!-- Di DOM templates -->
<MyComponent></MyComponent>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<!-- Di single-file components dan string templates -->
<MyComponent/>
```

``` html
<!-- Di DOM templates -->
<my-component></my-component>
```

ATAU

``` html
<!-- Dimanapun -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Aturan huruf nama komponen pada JS/JSX <sup data-p="b">sangat dianjurkan</sup>

**Nama komponen dalam JS / [JSX](../guide/render-function.html#JSX) harus selalu PascalCase, meskipun mereka mungkin kebab-case di dalam string untuk aplikasi yang lebih sederhana yang hanya menggunakan registrasi komponen global melalui `Vue.component`.**

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Dalam JavaScript, PascalCase adalah konvensi untuk kelas dan konstruktor prototipe - pada dasarnya, apa pun yang dapat memiliki _instance_ berbeda. Komponen Vue juga memiliki _instance_, jadi masuk akal juga menggunakan PascalCase. Sebagai manfaat tambahan, menggunakan PascalCase dalam JSX (dan templat) memungkinkan pembaca kode untuk lebih mudah membedakan antara komponen dan elemen HTML.

Namun, untuk aplikasi yang **hanya** menggunakan definisi komponen global melalui `Vue.component`, kami sarankan kebab-case. Alasannya adalah:

- Jarang sekali komponen global direferensikan dalam JavaScript, jadi mengikuti konvensi untuk JavaScript kurang masuk akal.
- Aplikasi ini selalu menyertakan banyak templat di-DOM, yang mana [**harus** menggunakan kebab-case](#Component-name-casing-in-templates-strongly-recommended).

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
Vue.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
Vue.component('MyComponent', {
  // ...
})
```

``` js
Vue.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Nama komponen dengan kata lengkap <sup data-p="b">sangat dianjurkan</sup>


**Nama komponen harus lebih mengutamakan kata yang lengkap daripada singkatan.**

Pelengkap otomatis(_autocompletion_) dalam editor membuat 'biaya' penulisan nama yang lebih panjang menjadi sangat rendah, sementara kejelasan yang mereka berikan sangat berharga. Singkatan yang tidak biasa, khususnya, harus selalu dihindari.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
{% raw %}</div>{% endraw %}



### Aturan huruf nama prop <sup data-p="b">sangat dianjurkan</sup>

**Nama prop harus selalu menggunakan camelCase ketika deklarasi, tetapi  menggunakan kebab-case di templat dan [JSX](../guide/render-function.html#JSX).**

Kami hanya mengikuti konvensi masing-masing bahasa. Dalam JavaScript, camelCase lebih alami. Dalam HTML, yang alami adalah kebab-case.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
props: {
  'greeting-text': String
}
```

{% codeblock lang:html %}
<WelcomeMessage greetingText="hi"/>
{% endcodeblock %}
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
props: {
  greetingText: String
}
```

{% codeblock lang:html %}
<WelcomeMessage greeting-text="hi"/>
{% endcodeblock %}
{% raw %}</div>{% endraw %}



### ### Elemen multi-atribut <sup data-p="b">sangat dianjurkan</sup>

**Elemen dengan banyak atribut harus menjangkau beberapa baris, dengan satu atribut per baris.**

Dalam JavaScript, menulis objek dengan beberapa properti pada beberapa baris secara luas dianggap sebagai konvensi yang bagus, karena jauh lebih mudah dibaca. Templat dan [JSX](../guide/render-function.html#JSX) kami pandang layak mendapatkan pertimbangan yang sama.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
{% raw %}</div>{% endraw %}



### Ekspresi sederhana pada templat <sup data-p="b">sangat dianjurkan</sup>

**Templat komponen hanya boleh menyertakan ekspresi sederhana, dengan ekspresi yang lebih kompleks di-_refactor_ menjadi properti atau metode yang yang telah dikomputasi.**

Ekspresi kompleks dalam templat kamu membuatnya kurang deklaratif. Kita harus berusaha menggambarkan _apa_ yang akan muncul, bukan _bagaimana_ kita menghitung nilai itu. Properti dan metode yang dikomputasi juga memungkinkan kode untuk digunakan kembali.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<!-- In a template -->
{{ normalizedFullName }}
```

``` js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```
{% raw %}</div>{% endraw %}



### Properti terkomputasi yang sederhana <sup data-p="b">sangat dianjurkan</sup>


**Properti terkomputasi yang kompleks harus dipecah menjadi properti yang lebih sederhana sebanyak mungkin.**

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Properti dengan penamaan baik, terkomputasi sederhana adalah yang:

- __Lebih mudah untuk diuji__

   Ketika setiap properti yang dikomputasi hanya mengandung ekspresi yang sangat sederhana, dengan sangat sedikit dependensi, akan lebih mudah untuk menulis tes yang mengonfirmasi bahwa itu berfungsi dengan benar.

- __Lebih mudah dibaca__

   Menyederhanakan properti yang dihitung memaksa kamu untuk memberikan setiap nilai nama deskriptif, meskipun itu tidak digunakan kembali. Ini membuatnya lebih mudah bagi pengembang lain (dan masa depan kamu) untuk fokus pada kode yang mereka pedulikan dan mencari tahu apa yang terjadi.

- __Lebih mudah beradaptasi dengan perubahan persyaratan/kebutuhan__

   Nilai apa pun yang dapat dinamai mungkin berguna untuk tampilan. Misalnya, kami mungkin memutuskan untuk menampilkan pesan yang memberi tahu pengguna berapa banyak uang yang mereka simpan. Kami mungkin juga memutuskan untuk menghitung pajak penjualan, tetapi mungkin menampilkannya secara terpisah, bukan sebagai bagian dari harga akhir.

   Properti terkomputasi yang kecil dan terfokus membuat asumsi yang lebih sedikit tentang bagaimana informasi akan digunakan, sehingga memerlukan lebih sedikit _refactoring_ ketika persyaratan/kebutuhan berubah.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```
{% raw %}</div>{% endraw %}



### Nilai atribut yang dikutip <sup data-p="b">sangat dianjurkan</sup>

**Nilai atribut HTML yang tidak kosong harus selalu berada di dalam tanda kutip (tunggal atau ganda, mana saja yang tidak digunakan dalam JS).**

Meskipun nilai atribut tanpa spasi tidak perlu memiliki tanda kutip dalam HTML, praktik ini sering membuat nilai atribut lebih susah terbaca.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
{% raw %}</div>{% endraw %}



### Menulis cepat direktif <sup data-p="b">sangat dianjurkan</sup>

**Tulisan ringkas atau lebih dikenal dengan shorthands dari Direktif (`:` untuk `v-bind:` and `@` untuk `v-on:`) harus selalu digunakan atau tidak sama sekali.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

``` html
<input
  @input="onInput"
  @focus="onFocus"
>
```

``` html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```
{% raw %}</div>{% endraw %}




## Aturan Prioritas C : Dianjurkan (Mengurangi Pilihan Asal dan Kelelahan Kognitif)



### Urutan pilihan komponen/_instance_ <sup data-p="c">dianjurkan</sup>

**Pilihan komponen/_instance_ harus diurutkan secara konsisten.**

Ini adalah urutan default yang kami sarankan untuk pilihan komponen. Mereka dibagi menjadi beberapa kategori, jadi kamu akan tahu di mana menambahkan properti baru dari plugin.

1. **Efek Samping** (memicu efek di luar komponen)
  - `el`

2. **Kesadaran Global** (membutuhkan pengetahuan di luar komponen)
  - `name`
  - `parent`

3. **Tipe Komponen** (mengubah jenis komponen)
  - `functional`

4. **Pengubah Template** (mengubah cara templat dikompilasi)
  - `delimiters`
  - `comments`

5. **Ketergantungan Templat** (aset yang digunakan dalam templat)
  - `components`
  - `directives`
  - `filters`

6. **Komposisi** (menggabungkan properti ke dalam pilihan)
  - `extends`
  - `mixins`

7. **Antarmuka(_Interface_)** (antarmuka ke komponen)
  - `inheritAttrs`
  - `model`
  - `props`/`propsData`

8. **State Lokal** (properti reaktif lokal)
  - `data`
  - `computed`

9. **_Events_** (panggilan balik dipicu oleh _event_ reaktif)
  - `watch`
  - Siklus Hidup _Event_ (dalam urutan yang disebut)
    - `beforeCreate`
    - `created`
    - `beforeMount`
    - `mounted`
    - `beforeUpdate`
    - `updated`
    - `activated`
    - `deactivated`
    - `beforeDestroy`
    - `destroyed`

10. **Properti Non-Reaktif** (properti _instance_ tidak tergantung pada sistem reaktivitas)
  - `methods`

11. **Rendering** (deskripsi deklaratif dari output komponen)
  - `template` /`render`
  - `renderError`



### Urutan atribut elemen <sup data-p="c">dianjurkan</sup>

**Atribut dari elemen (termasuk komponen) harus diurutkan secara konsisten.**

Ini adalah urutan default yang kami sarankan untuk pilihan komponen. Mereka dibagi menjadi beberapa kategori, jadi kamu akan tahu di mana menambahkan atribut dan direktif khusus.

1. **Definisi** (memberikan pilihan komponen)
   - `is`

2. **Daftar Penyajian** (membuat beberapa variasi elemen yang sama)
   - `v-for`

3. **Persyaratan** (apakah elemen diberikan / ditampilkan)
   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Render Modifiers** (mengubah cara elemen merender)
   - `v-pre`
   - `v-once`

5. **Kesadaran Global** (membutuhkan pengetahuan di luar komponen)
   - `id`

6. **Atribut Unik** (atribut yang membutuhkan nilai unik)
   - `ref`
   - `key`
   - `slot`

7. **Pengikatan Dua Arah** (menggabungkan pengikatan(_binding_) dan _event_)
   - `v-model`

8. **Atribut Lainnya** (semua atribut terikat & terikat tidak ditentukan)

9. **_Event_** (pendengar(_listener_) _event_ komponen)
   - `v-on`

10. **Konten** (menimpa konten elemen)
  - `v-html`
  - `v-text`



### Baris kosong pada pilihan komponen/_instance_ <sup data-p="c">dianjurkan</sup>

**Kamu boleh menambahkan satu baris kosong di antara properti multi-baris, terutama jika pilihan tidak dapat lagi masuk ke layar kamu tanpa menggulir(_scroll_).**

Ketika komponen mulai terasa penuh atau sulit dibaca, menambahkan ruang di antara properti multi-garis dapat membuatnya lebih mudah untuk dibaca sekilas. Di beberapa editor, seperti Vim, opsi pemformatan seperti ini juga dapat membuatnya lebih mudah dinavigasi dengan keyboard.

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue: function () {
    // ...
  },

  inputClasses: function () {
    // ...
  }
}
```

``` js
// Tanpa spasi pun tak mengapa selama komponen
// masih mudah dibaca dan navigasi.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue: function () {
    // ...
  },
  inputClasses: function () {
    // ...
  }
}
```
{% raw %}</div>{% endraw %}



### Urutan elemen tingkat atas komponen file tunggal <sup data-p="c">dianjurkan</sup>

**[Komponen file tunggal](../guide/single-file-components.html) harus selalu mengurutkan tag `<script>`, `<template>`, dan `<style>` secara konsisten, dengan `<style >` terakhir, karena setidaknya satu dari dua lainnya selalu diperlukan.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

``` html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}



## Aturan Prioritas D Rules: Digunakan dengan hati-hati (Pola Berpotensi Membahayakan)



### `v-if`/`v-else-if`/`v-else` tanpa `key` <sup data-p="d">digunakan hati-hati</sup>

**Biasanya lebih baik menggunakan `key` dengan `v-if` + `v-else`, jika keduanya adalah tipe elemen yang sama (contoh. Keduanya `<div>` elemen).**

Secara default, Vue memperbarui DOM seefisien mungkin. Itu berarti ketika beralih di antara elemen-elemen dari tipe yang sama, itu hanya menambal elemen yang ada, daripada menghapusnya dan menambahkan yang baru di tempatnya. Ini dapat memiliki [konsekuensi yang tidak diinginkan](https://jsfiddle.net/chrisvfritz/bh8fLeds/) jika elemen-elemen ini seharusnya tidak dianggap sama.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<div v-if="error">
  Error: {{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<div
  v-if="error"
  key="search-status"
>
  Error: {{ error }}
</div>
<div
  v-else
  key="search-results"
>
  {{ results }}
</div>
```

``` html
<p v-if="error">
  Error: {{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}



### Penyeleksi elemen dalam `scoped` <sup data-p="d">digunakan hati-hati</sup>

**Selektor elemen sebaiknya dihindari dalam `scoped`.**

Utamakan penyeleksi kelas daripada penyeleksi elemen dalam gaya `scoped`, karena sejumlah besar penyeleksi elemen lambat.

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Untuk gaya lingkupan(_scoped_), Vue menambahkan atribut unik ke elemen komponen, seperti `data-v-f3f3eg9`. Kemudian penyeleksi dimodifikasi sehingga hanya elemen yang cocok dengan atribut ini yang dipilih (contoh. Tombol `[data-v-f3f3eg9]`).

Masalahnya adalah sejumlah besar [penyeleksi elemen](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (contoh. `tombol [data-v-f3f3eg9]`) akan jauh lebih lambat dari [penyeleksi kelas](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&isi=latarbelakang%3A+%23CFD&ne=1000) (contoh. `.Btn-close [data-v-f3f3eg9]`), sehingga penyeleksi kelas harus lebih diutamakan jika memungkinkan.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` html
<template>
  <button>X</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Komunikasi orangtua-anak implisit <sup data-p="d">digunakan hati-hati</sup>

**Prop dan _event_ harus dipilih untuk komunikasi komponen orangtua-anak, daripada `this.$parent` atau prop yang bermutasi.**

Aplikasi Vue yang ideal adalah `props down, events up`. Berpegang teguh pada konvensi ini membuat komponen kamu lebih mudah dipahami. Namun, ada kasus kecil dimana mutasi prop atau `this.$parent` dapat menyederhanakan dua komponen yang sudah sangat terikat.

Masalahnya adalah, ada juga banyak kasus _simple_ di mana pola-pola ini menawarkan kenyamanan. Hati-hati: jangan tergoda untuk 'menjual' kemudahan jangka panjang (bisa memahami aliran _state_ kamu) untuk kenyamanan jangka pendek (menulis lebih sedikit kode).

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: '<input v-model="todo.text">'
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeTodo () {
      var vm = this
      vm.$parent.todos = vm.$parent.todos.filter(function (todo) {
        return todo.id !== vm.todo.id
      })
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}



### mengelola _non-flux state_ <sup data-p="d">digunakan hati-hati</sup>

**[Vuex](https://github.com/vuejs/vuex) harus lebih diutamakan untuk mengelola state global, daripada `this.$root` atau global event bus.**

Mengelola _state_ pada `this.$root` dan / atau menggunakan [global event bus](https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced) bisa terasa nyaman untuk kasus yang sangat sederhana, tetapi tidak patut untuk sebagian besar aplikasi. Vuex tidak hanya menawarkan tempat sentral untuk mengelola _state_, tetapi juga alat untuk mengatur, melacak, dan men-debug perubahan _state_.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Buruk

``` js
// main.js
new Vue({
  data: {
    todos: []
  },
  created: function () {
    this.$on('remove-todo', this.removeTodo)
  },
  methods: {
    removeTodo: function (todo) {
      var todoIdToRemove = todo.id
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== todoIdToRemove
      })
    }
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Bagus

``` js
// store/modules/todos.js
export default {
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

``` html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: mapActions(['removeTodo'])
}
</script>
```
{% raw %}</div>{% endraw %}



{% raw %}
<script>
(function () {
  var enforcementTypes = {
    none: '<span title="There is unfortunately no way to automatically enforce this rule.">self-discipline</span>',
    runtime: 'runtime error',
    linter: '<a href="https://github.com/vuejs/eslint-plugin-vue#eslint-plugin-vue" target="_blank" rel="noopener noreferrer">plugin:vue/recommended</a>'
  }
  Vue.component('sg-enforcement', {
    template: '\
      <span>\
        <strong>Enforcement</strong>:\
        <span class="style-rule-tag" v-html="humanType"/>\
      </span>\
    ',
    props: {
      type: {
        type: String,
        required: true,
        validate: function (value) {
          Object.keys(enforcementTypes).indexOf(value) !== -1
        }
      }
    },
    computed: {
      humanType: function () {
        return enforcementTypes[this.type]
      }
    }
  })

  // new Vue({
  //  el: '#main'
  // })
})()
</script>
{% endraw %}
