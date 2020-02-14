---
title: Mengemas Komponen Vue untuk npm
type: buku masak
order: 12
---

## Contoh Dasar

Komponen Vue secara alami dimaksudkan untuk bisa di gunakan berulang kali. Hal ini mudah saat komponen hanya digunakan dalam satu aplikasi. tetapi bagaimana anda bisa menulis sebuah komponen sekali dan menggunakanya di beberapa situs/aplikasi? mungkin solusi termudah adalah dengan npm.

Dengan mengemas komponen anda untuk dibagikan melalui npm, komponen itu bisa diimpor/diperlukan ke dalam proses pembangunan untuk digunakan dalam aplikasi web lengkap:

```js
import MyComponent from 'my-component';

export default {
  components: {
    MyComponent,
  },
  // sisa dari komponen
}
```

Atau bahkan digunakan melalui `<script>` tag di dalam peramban secara langsung:

```html
  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/my-component"></script>
  ...
  <my-component></my-component>
  ...
```

Hal ini tidak hanya membantu anda menghindari salin/tempel komponen, tetapi juga memungkinkan anda untuk memberikan kontribusi ke komunitas Vue! 

## Tidak bisakah saya berbagi file `.vue` secara langsung?


Vue sudah memungkinkan komponen untuk ditulis sebagai berkas tunggal. Karena sebuah komponen berkas tunggal (SFC) hanya terdiri dari satu file, anda mungkin bertanya:

>"Kenapa orang tidak dapat menggunakan berkas `.vue` saya secara langsung? Bukankan itu adalah cara paling sederhana untuk membagikan komponen?"

Hal itu benar, anda dapat berbagi berkas `.vue` secara langsung, dan siapa saja yang menggunakan [Vue build](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds) berisi penghimpun vue dapat menggunakanya dengan segera. selain itu, pembangunan SSR menggunakan untaian rentetan sebagai sebuah optimasi, sehingga berkas `.vue` mungkin lebih disukai dengan sekenario ini (lihat [Pengemasan komponen untuk npm > pengguna SSR](#SSR-Usage) untuk lebih jelasnya).    

Mengemas SFC anda secara benar untuk didistribusikan melalui npm memungkinkan komponen anda dibagikan dengan cara yang dimana siap digunakan dimana saja!

## Pengemasan komponen untuk npm

Untuk keperluan bagian ini, asumsikan struktur berkas berikut:

```
package.json
build/
   rollup.config.js
src/
   wrapper.js
   my-component.vue
dist/
```

<p class="tip">Dalam dokumen ini, referensi dibuat di berkas package.json yang tercantum diatas. berkas yang digunakan di dalam contoh dihasilkan dengan tangan, dan akan mencakup kebutuhan konfigurasi terendah untuk didiskusikan/tugas yang dihadapi. kemungkinan berkas package.json anda sendiri akan mengandung lebih banyak daripada yang tercantum diatas</p>

### Bagaimana npm tahu versi mana yang akan digunakan untuk peramban/proses bangun? 

Berkas package.json yang digunakan oleh npm benar benar hanya membutuhkan satu versi (`main`), tetapi ternyata, kami tidak membatasi itu. kami dapat menunjukan kasus penggunaan paling umum dengan menentukan 2 tambahan versi(`module` dan `unpkg`), dan memberikan akses ke berkas `.vue` itu sendiri menggunakan bagian `browser`. contoh package.json akan terlihat seperti ini: 

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  "browser": {
    "./sfc": "src/my-component.vue"
  },
  ...
}
```

Saat webpack2+, Rollup, atau alat `build` modern lainya digunakan, mereka akan mengambil pembangunan `module`. Aplikasi warisan akan menggunakan pembangunan  `main`, dan pembangunan `unpkg` bisa digunakan secara langsung ke peramban. Faktanya, [unpkg](https://unpkg.com) cdn secara otomatis menggunakan ini saat seseorang memasukan URL untuk modul anda ke dalam layanan mereka.

### Pengunaan SSR

Anda mungkin menyadari sesuatu yang menarik - peramban tidak akan menggunakan versi `browser`. Hal ini karena bagian ini sebenarnya dimaksudkan untuk memungkinkan penulis menyediakan [petunjuk untuk bundel](https://github.com/defunctzombie/package-browser-field-spec#spec) yang pada bagianya membuat paket mereka sendiri untuk digunakan di sisi klien. Dengan sedikit kreatifitas, bidang ini memungkinkan kita untuk memetakan alias ke berkas `.vue` itu sendiri. untuk Contoh: 

```js
import MyComponent from 'my-component/sfc'; // Perhatikan '/sfc'
```

<i>Bundler</i> yang kompatibel melihat definisi `browser` di package.json dan menterjemahkan permintaan untuk `my-component/sfc` kedalam `my-component/src/my-component.vue`, menghasilkan berkas `.vue` asli yang digunakan sebagai gantinya. Sekarang proses SSR bisa menggunakan optimasi untaian rangkaian yang diperlukan untuk meningkatkan kinerja.

<p class="tip">Perhatian: Saat menggunakan komponen `.vue` secara langsung, perhatikan semua jenis pra-pemprosesan yang dibutuhkan oleh tag `script` dan `style`. Ketergantungan ini akan diteruskan ke pengguna. Pertimbangkan untuk menyediakan SFC 'polos' untuk menjaga seringan mungkin.</p>

### Bagaimana Saya membuat beberapa versi dari komponen saya?

Tidak perlu untuk menulis modul anda berkali kali. Dimungkinkan untuk menyiapkan ketiga versi dari modul anda dalam satu langkah, demi memperingkas waktu, Contoh disini menggunakan [Rollup](https://rollupjs.org) karena konfigurasi minimalnya, tetapi konfigurasi serupa mungkin dilakukan dengan alat bangun lain - detail lebih lanjut tentang keputusan ini bisa ditemukan [disini](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c). Bagian `scripts` package.json dapat diperbaharui dengan satu entri untuk setiap target bangun, dan skrip `build` yang lebih umum yang menjalankan semuanya. Contoh berkas package.json sekarang terlihat seperti ini:

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  "browser": {
    "./sfc": "src/my-component.vue"
  },
  "scripts": {
    "build": "npm run build:umd & npm run build:es & npm run build:unpkg",
    "build:umd": "rollup --config build/rollup.config.js --format umd --file dist/my-component.umd.js",
    "build:es": "rollup --config build/rollup.config.js --format es --file dist/my-component.esm.js",
    "build:unpkg": "rollup --config build/rollup.config.js --format iife --file dist/my-component.min.js"
  },
  "devDependencies": {
    "rollup": "^0.57.1",
    "rollup-plugin-buble": "^0.19.2",
    "rollup-plugin-vue": "^3.0.0",
    "vue": "^2.5.16",
    "vue-template-compiler": "^2.5.16",
    ...
  },
  ...
}
```

<p class="tip">Ingat, Jika anda sudah memiliki berkas package.json,Memungkinkan untuk mengandung lebih banyak daripada yang ini. Paket ini hanya menggambarkan sebuah titik awal. Juga <i>packages</i> yang terdaftar di devDependenvies (bukan versi mereka) adalah persyaratan minimum yang dibutuhkan rollup untuk membuat tiga <i>builds</i> yang terpisah (umd,es dan unpkg). Ketika versi baru tersedia, mereka harus diperbaharui seperlunya.</p>

Perubahan package.json telah selesai. Selanjutnya, kita perlu pembungkus kecil untuk mengekspor/instalasi-otomatis berkas file tunggal yang sebenarnya, ditambah paling tidak sebuah konfigurasi Rollup, dan kita siap! 

### Seperti apa paket komponen saya?

Tergantung bagaimana komponen anda digunakan, ini perlu diekspos sebagai [CommonJS/UMD](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#c33a) javascript modul, sebuah [ES6 javascript](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#4f5e) modul, atau dalam kasus tag `<script>`, Secara otomatis dimuat ke Vue melalui `Vue.use(...)` sehingga segera tersedia untuk halaman. Hal ini dapat dicapai dengan berkas wrapper.js sederhana yang menangani ekspor modul dan instalasi-otomatis. Keseluruhan pembungkus terlihat seperti ini:

```js
// Impor vue component
import component from './my-component.vue';

// Deklarasikan fungsi instal yang dijalankan oleh Vue.use ()
export function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('MyComponent', component);
}

// Buat definisi modul untuk Vue.use ()
const plugin = {
	install,
};

// Instal otomatis ketika vue ditemukan (mis. Di peramban melalui tag <script>)
let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

// Untuk mengizinkan penggunaan sebagai komponen ekspor modul (npm / webpack / dll.)
export default component;
```
Perhatikan baris pertama langsung mengimpor SFC anda, dan di baris akhir ekspor tidak berubah. Seperti yang ditunjukan komentar di sisa kode, pembungkus menyediakan sebuah fungsi `install` untuk vue, kemudian mencoba untuk mendeteksi Vue dan secara otomatis menginstall komponen. Dengan 90% dari pekerjaan selesai, sekarang waktunya untuk berlari hingga finish!   

### Bagaimana cara mengkonfigurasi Pembangunan Rollup?

Dengan bagian `scripts` package.json telah siap dan pembungkus SFC ditempat, semua yang tersisa adalah untuk memastikan Rollup dikonfigurasi dengan benar. Untungnya, ini dapat dilakukan dengan 16 baris kecil berkas rollup.config.js:

```js
import vue from 'rollup-plugin-vue'; // Menangani SFC .vue
import buble from 'rollup-plugin-buble'; // Transpile / polyfill dengan dukungan peramban yang masuk akal
export default {
    input: 'src/wrapper.js', // Jalur relatif to package.json
    output: {
        name: 'MyComponent',
        exports: 'named',
    },
    plugins: [
        vue({
            css: true, // Menyuntikkan css secara dinamis sebagai tag <style>
            compileTemplate: true, // Konversi secara eksplisit templat ke render function
        }),
        buble(), // Transpile ke ES5
    ],
};
```

Contoh konfigurasi berkas ini berisi pengaturan terkecil untuk paket SFC anda untuk npm. Ada ruang untuk kostumisasi, seperti mengekstraksi CSS ke berkas terpisah, menggunakan <i>preprocessor</i> CSS, <i>uglifying</i> keluaran JS, dll.

Juga, tidak diperlukan memberikan `name` komponen disini. Nama <i>PascalCase</i> yang akan diberikan ke komponen, dan harus sesuai dengan nama <i>kebab-case</i> yang digunakan ditempat lain di seluruh resep ini.

### Apalah konfigurasi ini akan mengganti proses pengembangan saya saat ini? 

Konfigurasi disini tidak dimaksudkan untuk menggantikan proses pengembangan yang saat ini anda gunakan. Jika saat ini anda memiliki pengaturan webpack dengan <i>hot module reloading (HMR)</i>, tetap gunakan itu! Jika kamu memulai dari awal, silahkan instal [Vue CLI 3](https://github.com/vuejs/vue-cli/), yang akan memberi anda seluruh pengalaman HMR tanpa perlu configurasi:

```bash
vue serve --open src/my-component.vue
```

Dengan kata lain, lakukan seluruh pengembangan anda dengan cara apapun yang anda sukai. Hal yang diuraikan dalam resep ini lebih seperti 'sentuhan akhir' daripada keseluruhan proses pengembangan.

## Kapan Menghindari Pola ini

mengemas SFC dengan cara ini mungkin bukan ide yang baik dalam sekenario tertentu. Resep ini tidak menjelaskan secara rinci bagaimana komponen itu sendiri ditulis. beberapa komponen mungkin memberikan efek samping seperti <i>directives</i>, atau memperluas <i>libraries</i> dengan fungsi tambahan. Dalam hal ini. anda perlu mengevaluasi apakah perubahan yang diperlukan untuk resep terlalu luas.

Sebagai tambahan, perhatikan semua dependensi yang mungkin SFC anda miliki. Misalnya, jika anda memerlukan sebuah <i>library</i> pihak ketiga untuk mensortir atau berkomunikasi dengan API, Rollup mungkin menggulung paket-paket itu ke dalam kode final jika tidak dikonfigurasi dengan benar. Untuk terus menggunakan resep ini, Anda harus mengkonfigurasi Rollup untuk mengecualikan berkas-berkas itu dari keluaran, kemudian memperbarui dokumentasi untuk memberi tahu pengguna anda tentang ketergantungan ini.

##Pola alternatif

Pada saat resep ini ditulis, Vue CLI 3 sendiri dalam versi beta. Versi CLI ini dilengkapi dengan <i>built-in</i> mode pembangunan `library` , yang membuat CommonJS dan versi UMD dari komponen. Ini mungkin cukup untuk kasus anda, meskipun anda masih perlu memastikan berkas package.json anda menunjuk ke `main` dan `unpkg` dengan benar. Juga, tidak ada keluaran ES6 `module` kecuali jika kemampuan itu ditambahkan ke CLI sebelum rilis atau via <i>plugin</i>   

## Ucapan terima kasih

Resep ini adalah hasil dari pembicaraan kilat yang diberikan oleh [Mike Dodge] (https://twitter.com/mgdodgeycode) di VueConf.us pada bulan Maret 2018. Dia telah menerbitkan utilitas ke npm yang akan dengan cepat merancah sampel SFC menggunakan ini. Anda dapat mengunduh utilitas, [vue-sfc-rollup] (https://www.npmjs.com/package/vue-sfc-rollup), mulai dari npm. Anda juga dapat [mengkloning repo] (https://github.com/team-innovation/vue-sfc-rollup) dan menyesuaikannya.