---
title: Perbandingan dengan Kerangka Kerja yang Lain
type: guide
order: 801
---

Ini pastinya halaman yang paling sulit untuk ditulis di dokumentasi ini, tetapi kita rasa hal ini sangatlah penting untuk dibahas. Kemungkinan yang ada adalah, Anda mencoba untuk menyelesaikan suatu masalah menggunakan pustaka yang lain. Anda berada di halaman ini karena Anda ingin tahu lebih jauh apakah dengan Vue bisa menyelesaikan masalah yang lebih spesifik dengan baik. Itulah yang kita harapkan untuk menjawab pertanyaan Anda.

Kita juga berusaha dengan keras untuk menghindari bias. Sebagai tim inti, sudah jelas kita sangat mencintai Vue. Ada beberapa permasalahan yang bisa diselesaikan oleh Vue, daripada menggunakan pustaka lain di luar sana. Jika kita tidak percaya dengan hal tersebut, maka kita tidak akan bekerja untuk membangun Vue. Kita ingin berlaku adil dan seakurat mungkin. Dimana pada kerangka kerja yang lain menawarkan kelebihan/keuntungan yang lebih, contohnya seperti React yang memiliki ekosistem yang sangat luas sebagai alternatif pe-*render* antarmuka atau mengembalikan dukungan peramban untuk IE6, kita akan mencoba untuk menaruh hal-hal seperti ini kedalam daftar dengan sebaik mungkin.

Kita juga menerima dengan terbuka bantuan dari Anda untuk membuat dokumen ini selalu *up-to-date* dikarenakan dunia JavaScript bergerak sangat cepat! Jika Anda menyadari/menemukan beberapa hal yang kurang tepat atau ada sesuatu yang salah, mohon untuk menginformasikan kepada kami dengan cara [membuat *issue*](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React dan Vue mempunyai banyak kesamaan, mereka berdua sama-sama:

- Menggunakan dan memanfaatkan DOM virtual.
- Reaktif dan tampilan yang mudah disusun melalui komponen.
- Lebih fokus kepada inti dari pustaka, seperti lebih memperhatikan sistem *routing* dan pengelolaan *state* secara global yang ditangani oleh beberapa pustaka dari rekan kami sendiri.

Menjadi sesuatu yang sama didalam bidang yang sama pula, kita telah menggunakan banyak waktu untuk membuat perbandingan ini dengan sangat baik dibandingkan dengan yang lainnya. Kita ingin memastikan bahwa tidak hanya ketelitian di bidang teknikal, tetapi juga keseimbangan. Kita menemukan suatu sisi dimana React mampu mengalahkan Vue, sebagai contoh di kekayaan ekosistem dan *renderer* kustom yang melimpah milik mereka.

Dengan demikian, terjadi perbandingan berat sebelah yang tak bisa terhindarkan lagi bagi Vue untuk beberapa pengguna React, dikarenakan banyak subyek yang telah dieksplor tidak bersifat subyektif. Kami mengakui dan menyadari hal ini terjadi karena banyaknya variasi dari sisi teknikal, dan perbandingan ini dibuat dengan tujuan untuk membuat garis besar alasan mengapa Vue lebih berpotensi lebih baik dalam membangun aplikasi berdasarkan dengan preferensi kita.

Some of the sections below may also be slightly outdated due to recent updates in React 16+, and we are planning to work with the React community to revamp this section in the near future.
Beberapa bagian dibawah ini mungkin ada sedikit yang tidak sesuai karena pembaharuan terbaru di React 16+, dan kita berencana untuk berkolaborasi dengan komunitas React untuk merubah bagian ini kedepannya.

### Kinerja/Performa

Perfoma React dan Vue sama-sama luar biasa cepat, jadi kecepatan adalah salah satu faktor penting mengapa kita harus pilih satu diantara keduanya. Untuk metrik yang lebih spesifik, silakan cek berikut ini [*Benchmark* pihak ketika](https://stefankrause.net/js-frameworks-benchmark8/table.html), yang mana lebih berfokus pada kinerja/performa *render*/*update* dengan menggunakan *component trees* yang sederhana.

#### Upaya dalam Mengoptimalkan

Di React, ketika *state* pada komponen berubah, dia memicu untuk me-*render* semua *sub-tree* pada komponen, dimulai dari komponen itu sendiri sebagai awalannya. Untuk menghindari perenderan ulang yang tidak penting pada komponen anak, Anda wajib untuk menggunakan `PureComponent` atau menggunakan `shouldComponentUpdate` dikondisi apapun. Anda mungkin juga perlu untuk menggunakan struktur *immutable data* untuk membuat *state* Anda lebih mudah untuk dioptimalkan. Bagaimanapun, di dalam kasus-kasus tertentu Anda mungkin tidak bisa mengandalkan beberapa optimasi dikarenakan `PureComponent/shoudComponentUpdate` berasumsi bahwa di semua hasil pe-*render*-an pada *sub-tree* ditentukan oleh *props* yang ada di komponen saat ini. Jika permasalahan yang terjadi bukan karena itu, maka beberapa optimasi mungkin malah akan menuntun kita pada *state* DOM yang tidak konsisten.

Di Vue, ketergantungan sebuah komponen secara otomatis sudah terekam ketika proses *render* berlangsung, jadi sistem pada Vue secara tepat bisa mengetahui komponen mana yang benar-benar perlu untuk di *render* ulang ketika *state* berubah. Masing-masing komponen bisa dipertimbangkan untuk bisa mempunyai *method* `shouldComponenUpdate` yang secara otomatis sudah diimplementasikan, tanpa peringatan pada komponen yang bersarang.

Secara keseluruhan, hal ini menghilangkan kebutuhan pengoptimalan kinerja di seluruh kelas dari sudut pandang sang pengembang, dan karenanya para pengembang tinggal fokus untuk membangun aplikasi itu sendiri.

### HTML & CSS

Di React, segalanya berbentuk JavaScript. Tidak hanya struktur HTML saja yang berbentuk JSX, kecenderungan untuk melalukan manajemen CSS juga dilakukan didalam JavaScript. Hal ini punya keuntungan tersendiri, tetapi hal ini juga menimbulkan ketidaknyamanan yang bervariasi bagi beberapa pengembang.

Vue merangkul teknologi web yang klasik dan dibangun diatasnya. Untuk menunjukkan bagaimana maksudnya, kita akan berikan beberapa contohnya.

#### JSX vs Templates

Di React, semua komponen mengekspresikan fungsi pe-*render*-an UI nya menggunakan JSX. JSX merupakan sintaks deklaratif yang menyerupai XML di JavaScript.

Fungsi *render* di JSX mempunyai beberapa kelebihan:

- Anda bisa menggunakan kemampuan bahasa JavaScript sepenuhnya untuk membangun antarmuka web Anda. Termasuk juga variable sementara, dan menggunakan referensi yang ada pada JavaScript.

- Alat pendukung (contohnya *linting*, pemeriksaan tipe data, dan *autocompletion* pada editor) di beberapa pustaka yang tersedia untuk JSX lebih bagus daripada untuk templat Vue.

Di Vue, kita juga mempunyai [fungsi *render*](render-function.html) dan bahkan juga [mendukung JSX](render-function.html#JSX), karena terkadang Anda memerlukan fitur tersebut. Bagaimanapun, kita tetap menawarkan fungsi pe-*render*-an dalam bentuk templat sebagai alternatif yang lebih mudah.

- Bagi mayoritas pengembang yang telah bekerja menggunakan HTML, templat akan terasa lebih natural untuk dibaca dan ditulis. Preferensi itu sendiri bisa jadi bersifat subyektif, tetapi jika hal tersebut bisa membuat para pengembang menjadi lebih produktif, maka keuntungan tersebut bersifat obyektif.

- Templat yang berbasis HTML membuat kita mudah untuk migrasi secara progresif dari aplikasi yang sudah ada untuk mendapatkan kelebihan dari fitur reaktifitasnya Vue.

- Hal tersebut juga sangat mempermudah para desainer dan pengembang pemula untuk berkontribusi kedalam *codebase*.

- Anda bahkan bisa menggunakan *pre-processors* seperti Pug (dulunya ini disebut dengan nama Jade) untuk membangun templat Vue Anda.

Beberapa ada juga yang berkata bahwa Anda harus belajar DSL (*Domain-Specific Language*) secara ekstra agar bisa membuat templat - kita percaya bahwa ini argumen yang tidak beralasan. Pertama, menggunakan JSX bukan berarti pengembang tidak butuh untuk belajar hal lain - JSX hanyalah sintaks tambahan yang digunakan pada JavaScript, jadi hal tersebut bisa sangat mudah untuk dipelajari bagi seseorang yang sudah mengenal/familiar menggunakan JavaScript. Selain itu, templat hanyalah sintaks tambahan yang dibangun diatas HTML, oleh karena itu membuat templat jauh lebih mudah untuk dipelajari bagi orang yang sudah familiar dengan HTML. Dengan adanya DSL, kita juga bisa membantu para pengembang untuk menyelesaikan tugas dengan kode yang lebih sedikit (contohnya menggunakan `v-on` *modifiers*). Dengan tugas yang sama, dengan menggunakan JSX atau fungsi *render* malah bisa membutuhkan lebih banyak kode.

Di tingkat yang lebih tinggi lagi, kita bisa membagi komponen dalam dua kategori: bentuk *presentational* dan *logical*. Kami menyarankan untuk menggunakan templat untuk komponen yang berbentuk *presentational* dan fungsi pe-*render*-an / JSX untuk komponen yang berbentuk *logical*. Persentase pemilihan bentuk komponen ini tergantung dengan tipe aplikasi yang sedang Anda bangun, tetapi pada umumnya kita menjumpai komponen yang berbentuk *presentational* lebih banyak dipakai.

#### Component-Scoped CSS

Jika Anda memecah-mecah komponen menjadi beberapa berkas (sebagai contoh nya menggunakan [Modul CSS](https://github.com/gajus/react-css-modules)), menyematkan CSS di React bisa dilakukan melalui `CSS-in-JS` (contohnya [styled-components](https://github.com/styled-components/styled-components), [glamorous](https://github.com/paypal/glamorous), dan [emotion](https://github.com/emotion-js/emotion)). Beberapa dokumentasi tersebut memperkenalkan kita tentang paradigma *styling* yang berbasis komponen yang berbeda dengan gaya pemrosesan CSS pada umumnya. Selain itu, meskipun sudah mendukung untuk peng-ekstraksi-an CSS menjadi satu berkas CSS ketika proses *build*, ia tetap harus dimasukkan ke dalam *bundle* agar *styling* bisa bekerja dengan baik. Ketika Anda mempunyai hak untuk mendinamiskan JavaScript ketika membangun *style* Anda, sebagai gantinya adalah meningkatnya ukuran *bundle* dan biaya *runtime*.

Jika Anda adalah penggemar dari `CSS-in-JS`, sudah banyak pustaka `CSS-in-JS` populer yang mendukung Vue (contohnya [styled-components-vue](https://github.com/styled-components/vue-styled-components) dan [vue-emotion](https://github.com/egoist/vue-emotion)). Perbedaan utama antara React dan Vue disini adalah metode dasar pada proses *styling* di Vue lebih familiar dengan `style` tag di [single-file components](single-file-components.html).

[Single-file components](single-file-components.html) memberikan Anda akses penuh ke CSS didalam berkas yang sama di komponen Anda.

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

Atribut `scoped` yang bersifat opsional secara otomatis menggabungkan CSS kedalam komponen Anda (hanya di komponen ini saja) dengan cara menambahkan atribut yang unik (seperti `data-v-21e5b78`) dan di-*compile* dari `.list-container:hover` menjadi seperti `.list-container[data-v-21e5b78]:hover`.

Yang terakhir, *styling* pada *single-file component* milik Vue sangat fleksibel. Melalui [vue-loader](https://github.com/vuejs/vue-loader), Anda bisa menggunakan berbagai *pre-processor*, *post-processor*, dan bahkan bisa terintegrasi dengan [Modul CSS](https://vue-loader.vuejs.org/en/features/css-modules.html) -- semua nya hanya ada di dalam elemen `<style>`.

### Skala

#### Meningkatkan Skala Aplikasi

Untuk aplikasi yang besar, Vue dan React menawarkan solusi *routing* yang kuat. Komunitas React juga sangat inovatif dalam menentukan solusi untuk pengelolaan *state* (contohnya Flux/Redux). Pola dari Pengelolaan *state* ini dan [bahkan Redux itu sendiri](https://yarnpkg.com/en/packages?q=redux%20vue&p=1) bisa dengan mudah di integrasikan kedalam aplikasi Vue. Faktanya, Vue sudah menerapkan model ini selangkah lebih maju dengan menggunakan [Vuex](https://github.com/vuejs/vuex), solusi pengelolaan *state* yang terinspirasi dari Elm, yang kami harap bisa meningkatkan pengalaman disisi pengembang.

Informasi penting lainnya selain penawaran ini adalah pustaka Vue untuk pengelolaan *state* dan *routing* ([info lainnya](https://github.com/vuejs)) semuanya didukung secara resmi dan selalu terjaga pembaharuannya dengan inti pustaka. Sebaliknya, React lebih memilih untuk menyerahkan urusan ini kepada komunitas, dengan cara lebih banyak membangun kepingan ekosistem . Dampaknya, React menjadi lebih populer yang mengakibatkan ekosistem React menjadi sangat kaya daripada ekosistem milik Vue.

Yang terakhir, Vue menawarkan [*Generator* proyek CLI](https://github.com/vuejs/vue-cli) yang mampu membuat proyek awal dengan mudah menggunakan *build system* sesuai dengan pilihan Anda, beserta [webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), atau bahkan [tanpa *build system*](https://github.com/vuejs-templates/simple). React juga berhasil membuat hal yang sama dengan menggunakan [create-react-app](https://github.com/facebookincubator/create-react-app), tetapi saat ini masih memiliki keterbatasan sebagai berikut:

- Dia tidak memperbolehkan konfigurasi apapun ketika proses *generate*, sedangkan proyek templat pada Vue memperbolehkannya, seperti kustomisasi milik [Yeoman](http://yeoman.io/)
- Hanya menawarkan templat tunggal, karena *create-react-app* hanya berasumsi bahwa Anda ingin membuat SPA. Sedangkan Vue menawarkan variasi templat yang lebih luas lagi untuk membangun berbagai macam aplikasi dan kondisi.
- *Create-react-app* tidak bisa men-*generate* proyek yang berasal dari templat buatan si pengembang, yang mana hal ini justru sangat berguna bagi lingkungan perusahaan yang menggunakan konvensi *pre-established*.

Sebagai catatan penting, banyaknya keterbatasan ini memang pilihan yang dibuat oleh tim *create-react-app* dan mereka juga membuat apa yang menjadi kelebihannya. Sebagai contoh, selama kebutuhan proyek anda masih sangat sederhana (sedikit) dan Anda tidak membutuhkan untuk kustomisasi proses *build* Anda, maka Anda boleh untuk memperbaharuinya menjadi sebuah *dependency*. Anda bisa baca selengkapnya tentang [Perbedaaan Filosofi disini](https://github.com/facebookincubator/create-react-app#philosophy).

#### Menurunkan Skala Aplikasi

React terkenal dengan pustaka yang susah untuk dipelajari. Sebelum Anda benar - benar ingin mulai memakainya, Anda dituntut untuk paham tentang JSX dan mungkin juga dituntut untuk memahami ES2015+, sejak banyak nya contoh-contoh yang menggunakan sintaks kelas pada React. Anda juga harus mempelajari tentang sistem *build*, karena meski Anda secara teknikal sudah menggunakan Babel untuk mengkompilasi kode ada di peramban, hal tersebut belum tentu cocok untuk digunakan ke tingkat produksi.

Sedangkan Vue mampu menaikkan besaran skala aplikasi dengan kemampuan yang sama dengan React, dia juga bisa menurunkan besaran skala aplikasi sama seperti jQuery. Untuk mulai menggunakan Vue, yang perlu Anda lakukan hanya menyematkan skrip dibawah ini kedalam halaman web Anda.

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Setelah itu Anda bisa langsung menulis kode Vue, dan bahkan Vue tersebut sudah berbentuk versi *minified* yang siap untuk dibawa ke tingkat produksi tanpa khawatir dengan adanya masalah performa.

Since you don't need to know about JSX, ES2015, or build systems to get started with Vue, it also typically takes developers less than a day reading [the guide](./) to learn enough to build non-trivial applications.
Anda tidak perlu memahami apapun tentang JSX, ES2015, atau sistem *build* untuk mulai menggunakan Vue, bahkan biasanya para pengembang hanya perlu membaca [panduan](./) dalam waktu kurang dari sehari untuk mempelajari bagaimana membangun aplikasi yang berskala besar.

### Me-render Secara Native

React Native bisa Anda gunakan untuk membuat aplikasi *native* yang bisa berjalan di iOS dan Android dengan hanya menggunakan model komponen yang sama seperti React. Hal ini sangat positif untuk para pengembang, Anda bisa memanfaatkan pengetahuan yang Anda miliki tentang kerangka kerja untuk membuat aplikasi lintas *platform*. Vue juga secara resmi telah berkolaborasi dengan [Weex](https://weex.apache.org/), sebuah kerangka kerja untuk antarmuka lintas *platform* yang dibuat oleh *Alibaba Group* dan sekarang ini telah diinkubasi oleh Apache Software Foundation (ASF). Anda bisa menggunakan sintaks komponen pada Vue kedalam Weex yang tidak hanya bisa berjalan diatas peramban, melainkan juga bisa berjalan di iOS dan Android secara *native*!

Pada kesempatan ini, Weex masih berada di masa pengembangan dan Weex juga masih belum siap jika dibandingkan dengan React Native, tetapi proses pengembangannya didorong oleh kebutuhan produksi dari bisnis *e-commerce* terbesar di dunia (Alibaba Group), dan tim Vue akan secara aktif berkolaborasi dengan tim Weex untuk memastikan para pengembang Vue memperoleh pengalaman pengembangan yang baik.

Pilihan yang lain adalah menggunakan [NativeScript-Vue](https://nativescript-vue.org/), [NativeScript](https://www.nativescript.org/) adalah sebuah *plugin* untuk membangun aplikasi yang benar-benar *native* dengan menggunakan Vue.js.

### Integrasi dengan MobX

MobX cukup populer dikalangan komunitas React dan MobX ini hampir identik/sama dengan sistem reaktifitasnya Vue. Pada tingkat tertentu, cara kerja React + MobX sama seperti menggunakan Vue tetapi dengan cara yang lebih rumit, jadi jika Anda nyaman menggunakan kombinasi tersebut, melangkah langsung untuk menggunakan Vue mungkin adalah suatu langkah yang logis kedepannya.

### Preact dan Pustaka Mirip React Lainnya

Pustaka yang mirip React biasanya mencoba berbagi API sebanyak mungkin dengan dukungan dari komunitas React yang layak. Dengan alasan tersebut, sebagian besar perbandingan yang kita bahas diatas juga berlaku untuk pustaka ini. Perbedaan yang utama biasanya adalah berkurangnya/kecilnya ekosistem mereka, jarak perbedaannya terbilang sangat signifikan jika dibandingkan dengan ekosistem milik React. Karena pustaka ini tidak sepenuhnya 100% kompatibel dengan apapun yang ada di ekosistem React, beberapa alat pustaka dan pustaka pendamping mungkin tidak bisa digunakan. Atau, bahkan jika pustaka ini berfungsi dengan baik, ia bisa saja mengalami kerusakan (*break*), kecuali pustaka yang spesifik didukung oleh React secara resmi.

## AngularJS (Angular 1)

Beberapa sintaks pada Vue akan terlihat sangat mirip seperti yang ada pada AngularJS (contohnya `v-if` vs `ng-if`). Hal ini dikarenakan banyak kelebihan yang dilakukan oleh Angular sehingga menjadi inspirasi bagi Vue sejak pertama kali dikembangkan. Ada juga beberapa hal buruk yang terjadi/tertanam di AngularJS, dimana Vue berusaha untuk menawarkan peningkatan/perbaikan hal buruk tersebut secara signifikan.

### Kompleksitas

Vue jauh lebih sederhana jika dibandingkan dengan AngularJS, baik dari segi API dan desain. Untuk belajar membangun aplikasi yang besar pun tidak membutuhkan waktu kurang dari sehari, yang mana hal ini tidak berlaku di AngularJS.

### Fleksibilitas dan Modularitas

AngularJS mempunyai pendapat yang kuat tentang bagaimana struktur yang baik untuk aplikasi Anda, sementara Vue adalah solusi modular yang lebih fleksible. Yang mana hal ini membuat Vue lebih bisa dibuat untuk beradaptasi pada berbagai jenis proyek yang bervariasi, Kami juga menyadari bahwa terkadang Anda juga perlu untuk mengambil beberapa keputusan, hingga Anda benar-benar siap untuk mulai menulis kode.

Itulah kenapa kami menawarkan sebuah [templat webpack](https://github.com/vuejs-templates/webpack) sehingga memudahkan mempersiapkan proyek Anda dalam beberapa menit saja, sementara itu templat ini juga memberikan fitur-fitur canggih kepada Anda, seperti *Hot Module Reload*, *linting*, ekstraksi CSS, dan masih banyak lagi.

### Data binding

AngularJS menggunakan data *binding* secara dua arah, sementara pada Vue menggunakan aliran satu arah antar komponen. Hal ini membuat aliran data lebih mudah untuk dikelola di aplikasi berskala besar.

### Direktif vs Komponen

Vue memiliki pemisahan yang lebih jelas antara direktif dengan komponen. Direktif dimaksudkan untuk mengengkapsulasi pemanipulasian DOM saja, sedangkan komponen adalah unit mandiri yang mempunyai tampilan templat dan logika data tersendiri. Di AngularJS, direktif bertugas untuk melakukan apapun dan komponen hanyalah sebuah direktif yang lebih spesifik.

### Kinerja Runtime / Performa

Vue memiliki kinerja yang lebih baik dan lebih mudah untuk dioptimalkan karena Vue tidak menggunakan *dirty checking*. AngularJS bisa menjadi lambat ketika terdapat banyak *watchers*, karena setiap kali terjadi perubahan pada komponen nya, semua *watchers* juga perlu untuk menjalankan proses nya lagi. Selain itu, siklus AngularJS yang lebih dalam mungkin juga akan menjalankan "proses stabilitas" berulang kali jika beberapa *watchers* dipicu oleh perubahan yang lain. Pengguna AngularJS kadang juga harus menggunakan teknik esoterik untuk menyiasati siklus tersebut, dan dalam beberapa kondisi, tidak ada cara untuk mengoptimalkan hal tersebut dengan banyaknya *watchers* yang dipasang.

Vue sangat aman dalam hal ini karena dia mengunakan sistem pengamatan *dependency-tracking* yang transparan dengan *async queueing* - semua perubahan akan memicu secara independen, kecuali jika mereka memiliki ketergantungan yang eksplisit.

Yang menarik adalah, ada beberapa kesamaan bagaimana cara Angular dan Vue mengatasi masalah yang ada pada AngularJS ini.

## Angular (Sebelumnya dikenal dengan nama Angular 2)

Kami akan membagi artikel dibawah ini menjadi beberapa bagian untuk Angular versi baru, karena dia benar-benar kerangka kerja yang berbeda dengan AngularJS. Sebagai contoh, adanya fitur sistem komponen *first-class*, sudah banyak detail implementasi yang ditulis ulang, dan API nya juga telah berubah cukup drastis.

### TypeScript

Angular pada dasarnya membutuhkan TypeScript, mengingat hampir semua dokumentasi dan sumber belajarnya berbasis TypeScript. TypeScript mempunyai kelebihan tersendiri - pengecekan tipe data statis bisa sangat berguna untuk aplikasi berskala besar, dan bisa meningkatkan produktifitas bagi para pengembang dengan latar belakang Java dan C#.

Namun, tidak semua orang mau menggunakan TypeScript. Di banyak kasus yang lebih kecil, memperkenalkan *type system* ke pengembang malah akan membuat pusing daripada peningkatan produktifitas. Dalam kasus tersebut, Anda mungkin lebih baik langsung menggunakan Vue, karena menggunakan Angular tanpa TypeScript bisa menantang/susah.

Yang terakhir, meskipun tidak begitu terintegrasi secara mendalam dengan TypeScript sama seperti Angular, Vue juga menawarkan [*typing* resmi](https://github.com/vuejs/vue/tree/dev/types) dan [dekorator resmi](https://github.com/vuejs/vue-class-component) yang siap digunakan untuk para pengembang yang ingin memakai Typescript dengan Vue. Kita juga secara aktif berkolaborasi dengan TypeScript dan tim VSCode di Microsoft untuk meningkatkan pengalaman TS/IDE untuk para pengguna Vue + TS.

### Kinerja Runtime

Both frameworks are exceptionally fast, with very similar metrics on benchmarks. You can [browse specific metrics](https://stefankrause.net/js-frameworks-benchmark8/table.html) for a more granular comparison, but speed is unlikely to be a deciding factor.
Kedua kerangka kerja ini sangatlah memiliki performa yang kencang, dengan metrik yang sangat mirip ketika di uji coba *benchmark*. Anda bisa [menelusuri metrik tertentu](https://stefankrause.net/js-frameworks-benchmark8/table.html) untuk perbandingan yang lebih terperinci, akan tetapi kecepatan bukanlah faktor utamanya.

### Ukuran

Recent versions of Angular, with [AOT compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) and [tree-shaking](https://en.wikipedia.org/wiki/Tree_shaking), have been able to get its size down considerably. However, a full-featured Vue 2 project with Vuex + Vue Router included (~30KB gzipped) is still significantly lighter than an out-of-the-box, AOT-compiled application generated by `angular-cli` (~65KB gzipped).
Versi terakhir dari Angular, dengan [kompilasi AOT](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) dan [*tree-shaking*](https://en.wikipedia.org/wiki/Tree_shaking), telah mampu menurunkan ukurannya secara signifikan. Namun, proyek Vue 2 yang sudah disematkan fitur Vuex + Vue Router (~ 30KB *gzipped*) masih jauh lebih ringan daripada kompilasi AOT yang dihasilkan oleh `angular-cli` (~65KB *gzipped*).

### Fleksibilitas

Vue jauh lebih dogmatis dibandingkan dengan Angular, Vue menawarkan dukungan resmi untuk berbagai sistem *build* yang bervariasi, dengan tanpa adanya batasan tentang cara bagaimana menyusun aplikasi milik Anda. Banyak pengembang yang menyukai kebebasan ini, sementara beberapa pengembang hanya suka dengan  satu cara membangun sebuah aplikasi.

### Tingkat Belajar

Untuk bisa mulai menggunakan Vue, semua yang Anda butuhkan hanyalah paham/mengenal HTML dan ES5 JavaScript (misalnya seperti JavaScript murni). Dengan keterampilan dasar ini, Anda bisa mulai membangun aplikasi besar dalam waktu kurang dari satu hari untuk mempelajari [panduan ini](./).

Tingkatan belajar pada Angular sedikit lebih susah. lapisan luar API di kerangka kerja ini tergolong besar dan sebagai pengguna Anda harus membiasakan diri dengan banyak konsep sebelum mulai produktif menggunakannya. Kompleksitas Angular sebagian besar didesain untuk aplikasi berskala besar dan aplikasi yang kompleks - tetapi hal itu yang membuat kerangka kerja ini jauh lebih sulit untuk dipakai para pengembang yang kurang berpengalaman.

## Ember

Ember adalah kerangka kerja yang kaya akan fitur dan didesain untuk menjadi kerangka kerja yang *opinionated*. Ember memberikan banyak konvensi yang telah tersedia dan ketika Anda sudah cukup familiar dengan konvensi tersebut, hal tersebut akan membuat Anda menjadi sangat produktif. Namun, hal tersebut juga berarti membutuhkan tingkatan belajar yang tinggi. Ini memang merupakan sebuah resiko ketika Anda mencoba untuk menggunakan salah satu kerangka kerja yang *opinionated* dan sebuah pustaka dengan seperangkat alat yang saling terkait dan saling bekerja sama. Pada akhirnya, hal tersebut memberi Anda lebih banyak kebebasan tetapi juga mengharuskan Anda untuk membuat lebih banyak keputusan arsitektur.

Oleh karenanya, hal itu mungkin akan menjadi sebuah perbandingan antara inti Vue dengan lapisan [templat Ember](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/) dan [model obyek](https://guides.emberjs.com/v2.10.0/object-model/):

- Vue mampu memberikan reaktifitas yang tidak mencolok di obyek JavaScript murni dan *computed properties* yang sepenuhnya otomatis (reaktifitas).

- Sintaks templat pada Vue memanfaatkan kekuatan penuh yang ada pada JavaScript, sedangkan *Handlebars* dan sintaks *helper* sangat terbatas jika dibandingkan dengan Vue.

- Dari segi kinera, Vue mampu mengungguli Ember dengan [margin yang adil](https://stefankrause.net/js-frameworks-benchmark8/table.html), bahkan setelah pembaharuan *Glimmer engine* di Ember 3.x. Vue secara otomatis menumpuk pembaharuan, sementara di Ember Anda perlu mengelola *loop* yang dijalankan secara manual dalam situasi kinerja yang kritis.

## Knockout

Knockout adalah pelopor dalam MVVM dan pelacakan *dependency*. Dan bahkan reaktifitas pada sistem nya sangat mirip dengan yang ada pada Vue. [Dukungan pada peramban](http://knockoutjs.com/documentation/browser-support.html) juga sangat mengesankan, bahkan mendukung di peramban IE6! Sedangkan Vue hanya mendukung IE9+.

Namun dengan seiring berjalannya waktu, pengembangan Knockout mulai melambat dan kelihatan berumur (menua). Sebagai contoh, sistem komponennya tidak memiliki satu set yang lengkap mengenai siklus hidup *hook*nya dan meskipun hal tersebut adalah sesuatu yang sudah umum. Antarmuka untuk mengoper data antar komponen juga terasa sedikit aneh jika dibandingkan dengan Vue.

Nampaknya juga ada perbedaan filosofis di dalam desain API nya, yang jika Anda penasaran bisa dilihat di demonstrasi tentang bagaimana membuat [*todo list* sederhana](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). Memang ini agak subyektif, tetapi banyak yang mengatakan bahwa API pada Vue tidaklah rumit dan terstruktur dengan baik.

## Polymer

Polymer adalah proyek lain yang di sponsori oleh Google dan faktanya adalah Polymer adalah sumber inspirasi bagi Vue. Komponen Vue dapat dibandingkan dengan kustom elemen pada Polymer dan kedua nya memberikan gaya pengembangan yang sangat mirip. Perbedaan terbesarnya adalah Polymer dibangun di atas *Web Components* yang terbaru dan memerlukan *polyfill* untuk bekerja (dengan kinerja yang tergradasi) di peramban yang tidak mendukung fitur-fitur tersebut secara *native*. Sebaliknya, Vue bekerja tanpa adanya ketergantungan atau *polyfill* ke IE9.

Di Polymer, tim juga telah membuat sistem pengikatan data (*data binding*) yang terbatas untuk mengimbangi kinerja Polymer. Misalnya, satu-satunya ekspresi yang di dukung oleh templat Polymer adalah negasi *boolean* dan pemanggilan metode tunggal. Ini seperti halnya pada *computed properties* nya Vue, tetapi tidak terlalu fleksibel.

## Riot

Riot 3.0 menyediakan model pengembangan yang berbasis komponen (yang mana ini disebut dengan "tag" di Riot), dengan API yang dirancang secara indah dan minimalis. Riot dan Vue mungkin saling berbagi dalam hal filosofi desain. Namun, meskipun sedikit lebih berat daripada Riot, Vue memang mampu menawarkan beberapa keuntungan secara signifikan:

- Kinerja yang lebih baik. Riot lebih memilih untuk [menelusuri pohon DOM](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding) daripada menggunakan DOM virtual, sehingga menyebabkan kinerja yang lambat, sama seperti isu yang terdapat di AngularJS.
- Dukungan alat yang lebih matang. Vue memberikan dukungan resmi untuk [webpack](https://github.com/vuejs/vue-loader) dan [Browserify](https://github.com/vuejs/vueify), sedangkan Riot lebih mengandalkan dukungan dari komunitas untuk membangun integrasi sistem.
