---
title: Announcing Vue.js 2.0
date: 2016-04-27 13:33:00
---

Hari ini saya senang mengumumkan preview publik pertama dari Vue.js 2.0, yang membawa banyak perbaikan menarik dan fitur baru. Mari kita intip apa yang ada di toko!

<!-- more -->

## Even Leaner, Even Faster

Vue.js selalu fokus untuk tetap ringan dan cepat, tetapi 2.0 mendorongnya lebih jauh. Lapisan rendering sekarang didasarkan pada implementasi DOM virtual-ringan (berdasarkan [Snabbdom] (https://github.com/paldepind/snabbdom)) yang meningkatkan kecepatan rendering awal dan konsumsi memori hingga 2 ~ 4x dalam sebagian besar skenario (lihat [tolak ukur ini] (https://github.com/vuejs/vue/tree/next/benchmark)). Kompiler template-to-virtual-DOM dan runtime dapat dipisahkan, sehingga Anda dapat melakukan pra-kompilasi template dan mengirimkan aplikasi Anda hanya dengan runtime, yang kurang dari 12KB min + gzip (sebagai referensi, Bereaksi 15 adalah 44KB min + gzip). Kompiler juga berfungsi di browser, yang berarti Anda masih dapat memasukkan satu tag skrip dan mulai meretas, seperti sebelumnya. Bahkan dengan kompiler yang disertakan, build berada di 17KB min + gzip, masih lebih ringan dari versi 1.0 saat ini.

## Not Your Average Virtual-DOM

Sekarang, hanya virtual-DOM yang terdengar membosankan karena ada begitu banyak implementasi di luar sana - tetapi yang ini berbeda. Dikombinasikan dengan sistem reaktivitas Vue, Vue memberikan proses rendering ulang yang dioptimalkan tanpa Anda harus melakukan apa pun. Setiap komponen melacak dependensi reaktif selama render, sehingga sistem tahu persis kapan harus merender ulang, dan komponen mana yang akan dirender ulang. Tidak perlu untuk `shouldComponentUpdate` atau struktur data yang tidak dapat diubah - ** itu hanya berfungsi **.

Selain itu, Vue 2.0 menerapkan beberapa optimasi lanjutan selama fase kompilasi template-to-virtual-DOM:

1. Mendeteksi nama dan atribut kelas statis sehingga tidak pernah berbeda setelah render di awal.

2. Mendeteksi sub trees statis maksimum (sub trees tanpa ikatan dinamis) dan mengeluarkannya dari fungsi render. Jadi pada setiap re-render, secara langsung menggunakan kembali node virtual yang sama persis dan melewatkan diffing.

Optimalisasi lanjutan ini biasanya hanya dapat dicapai melalui plugin Babel saat menggunakan JSX, tetapi dengan Vue 2.0 Anda bisa mendapatkannya bahkan menggunakan kompiler dalam browser.

Sistem rendering baru juga memungkinkan Anda untuk menonaktifkan konversi reaktif hanya dengan membekukan data Anda dan secara manual memaksa pembaruan, pada dasarnya memberi Anda kontrol penuh atas proses rendering ulang.

Dengan teknik-teknik ini digabungkan, Vue 2.0 memastikan kinerja yang sangat cepat dalam setiap skenario yang mungkin sambil memerlukan upaya optimasi minimal dari pengembang.

## Templates, JSX, or Hyperscript?

Pengembang cenderung memiliki pendapat yang kuat tentang template vs JSX. Di satu sisi, templat lebih dekat ke HTML - templat lebih baik pada struktur semantik aplikasi Anda dan membuatnya lebih mudah untuk berpikir secara visual tentang desain, tata letak, dan gaya. Di sisi lain, template terbatas pada DSL sementara sifat program JSX / hyperscript memberikan kekuatan ekspresif penuh dari bahasa turing-complete.

Menjadi hibrida desainer / pengembang, saya lebih suka menulis sebagian besar antarmuka saya di templat, tetapi dalam kasus tertentu saya kehilangan fleksibilitas JSX / hyperscript. Contohnya adalah menulis komponen yang secara terprogram menangani anak-anaknya, sesuatu yang tidak layak hanya dengan mekanisme slot berbasis template.

Nah, mengapa tidak memiliki keduanya? Dalam Vue 2.0, Anda dapat terus menggunakan sintaks template yang sudah dikenal, atau drop-down ke lapisan virtual-DOM setiap kali Anda merasa terkendala oleh template DSL. Alih-alih opsi `template`, ganti saja dengan fungsi` render`. Anda bahkan dapat menanamkan fungsi render dalam templat Anda menggunakan tag `<render>` khusus! Yang terbaik dari kedua dunia, dalam kerangka yang sama.

## Streaming Server-side Rendering

Dengan migrasi ke virtual-DOM, Vue 2.0 secara alami mendukung rendering sisi server dengan hidrasi sisi klien. Salah satu titik sakit dari implementasi render server utama saat ini, seperti React's, adalah renderingnya sinkron sehingga dapat memblokir loop acara server jika aplikasinya kompleks. Render sisi server yang sinkron bahkan dapat mempengaruhi waktu-ke-konten pada klien. Vue 2.0 menyediakan rendering sisi server streaming internal, sehingga Anda dapat merender komponen Anda, mendapatkan aliran yang dapat dibaca kembali dan langsung menyalurkannya ke respons HTTP. Ini memastikan server Anda responsif, dan membuat konten yang diberikan kepada pengguna Anda lebih cepat.

## Unlocking More Possibilities

Dengan arsitektur baru, bahkan ada lebih banyak kemungkinan untuk dijelajahi - misalnya, rendering ke antarmuka asli di seluler. Saat ini, kami sedang mengeksplorasi port Vue.js 2.0 yang menggunakan [weex] (http://alibaba.github.io/weex/) sebagai backend rendering asli, sebuah proyek yang dikelola oleh para insinyur di Alibaba Group, perusahaan teknologi terbesar dari Cina. Secara teknis juga memungkinkan untuk mengadaptasi virtual-DOM Vue 2.0 untuk dijalankan di dalam ReactNative. Kami sangat senang melihat hasilnya!

## Compatibility and What to Expect Next

Vue.js 2.0 masih dalam pra-alfa, tetapi Anda dapat checkout kode sumber [di sini] (https://github.com/vuejs/vue/tree/next/). Meskipun menjadi penulisan ulang penuh, API sebagian besar kompatibel dengan 1.0 dengan pengecualian beberapa penghentian yang disengaja. Lihat [contoh resmi yang sama yang ditulis dalam 2.0] (https://github.com/vuejs/vue/tree/next/examples) - Anda akan melihat bahwa tidak banyak yang berubah!

Penghentian fitur adalah bagian dari upaya berkelanjutan kami untuk menyediakan API sesederhana mungkin untuk produktivitas pengembang maksimum. Anda dapat memeriksa perbandingan fitur 1.0 vs. 2.0 [di sini] (https://github.com/vuejs/vue/wiki/2.0-features). Ini berarti perlu upaya untuk memigrasikan aplikasi yang ada jika Anda sering menggunakan beberapa fitur yang sudah usang ini, tetapi kami akan memberikan panduan pemutakhiran terperinci di masa mendatang.

Masih banyak pekerjaan yang harus dilakukan. Kami akan merilis alpha pertama setelah kami mencapai cakupan tes yang memuaskan, dan kami menargetkan beta pada akhir Mei / awal Juni. Selain lebih banyak tes, kami juga perlu memperbarui perpustakaan pendukung (vue-router, Vuex, vue-loader, vueify ...). Saat ini hanya Vuex bekerja dengan 2.0 di luar kotak, tetapi kami akan memastikan bahwa semuanya bekerja dengan lancar saat 2.0 dikirimkan.

Kami juga tidak melupakan tentang 1.x! 1.1 akan dirilis bersamaan dengan 2.0 beta, dengan periode LTS perbaikan bug kritis 6 bulan dan pembaruan keamanan 9 bulan. Ini juga akan dikirimkan dengan peringatan penghentian opsional untuk membuat Anda siap untuk meningkatkan ke 2.0. Tetap disini!