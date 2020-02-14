---
judul: Rintangan Umum Bagi Pemula
tanggal: 2016-02-06 10:00:00
---

Ada beragam pertanyaan yang sering dijumpai oleh pengguna yang baru mengenal Vue.js. Sekalipun semua itu telah dijelaskan pada panduan, itu mudah terlewati dan menjadi sulit untuk dicari ketika anda sudah berhadapan dengan rintangan. Oleh karena itu kami mengumpulkan semuanya dalam pembahasan ini dan semoga dapat mempersingkat waktu anda.
<!-- more -->

### Kenapa DOM tidak berubah?

Sebagian besar, ketika anda merubah data pada sebuah Vue instance, tampilan akan diperbaharui. Tetapi ada dua kasus berbeda:

1. Saat anda **menambahkan properti baru** lalu tidak tersedia ketika data diamati. Disebabkan keterbatasan pada ES5 dan untuk memastikan agar perilaku konsisten disemua browser, Vue.js tidak dapat mendeteksi penambahan/penghapusan properti. Cara terbaik adalah selalu mendeklarasikan properti yang dibutuhkan agar reaktif diawal. Pada beberapa kejadian ketika benar-benar perlu menambah atau menghapus properti saat runtime, gunakan global method [`Vue.set`](/api/#Vue-set) atau [`Vue.delete`](/api/#Vue-delete).

2. Saat anda mengubah sebuah Array secara langsung menggunakan sebuah index (contoh `arr[0] = val`) atau mengubah dengan properti `length`. Demikian pula, Vue.js tidak akan melakukan perubahan. Selalu lakukan perubahan array menggunakan Array instance method, atau ganti seluruhnya. Vue menyediakan convenience method `arr.$set(index, value)` yang merupakan syntax sugar dari `arr.splice(index, 1, value)`.

Baca lebih lanjut: [Reactivity in Depth](/guide/reactivity.html) dan [Array Change Detection](http://vuejs.org/guide/list.html#Array-Change-Detection).

### Kapan DOM diperbaharui?

Vue.js menggunakan antrian asinkron untuk mengumpulkan perubahan DOM. Ini berarti saat anda memperbaharui beberapa data, Dom tidak diperbaharui secara langsung: mereka diterapkan secara tidak sinkron ketika antriannya diproses. Jadi, bagaimana anda tahu kapan DOM telah diperbaharui? Gunakan `Vue.nextTick` tepat setelah anda memperbaharui data. Callback function yang diberikan akan dipanggil sekali setelah antrian diproses.

Baca lebih lanjut: [Async Update Queue](/guide/reactivity.html#Async-Update-Queue).

### Kenapa `data` harus sebuah function?

Dalam contoh dasar, kita mendeklarasikan `data` secara langsung sebagai sebuah plain objek. Ini dikarenakan kita hanya membuat sebuah instance tungal dengan `new Vue()`. Namun, ketika mendefinisikan sebuah **komponen**, `data` harus dideklarasikan sebagai sebuah function yang mengembalikan data objek awal. Kenapa? Karena akan banyak instance yang dibuat menggunakan definisi yang sama. Jika kita tetap menggunakan sebuah plain objek untuk `data`, itu objek sama yang akan menjadi **shared by reference** disemua instance yang dibuat! Dengan menyediakan sebuah `data` function, setiap kali sebuah instance baru dibuat kita dapat memanggilnya untuk mengembalikan salinan baru dari data awal.

Baca lebih lanjut: [Component Option Caveats](/guide/components.html#Component-Option-Caveats).

### HTML case insensitivity

Semua templat Vue.js valid, HTML markup dapat diparse, dan Vue.js bergantung pada parser yang memenuhi spesifikasi untuk memproses templatnya. Namun, seperti yang telah ditentukan dalam standar, HTML case-insensitive ketika mencocokan tag dan nama attribut. Ini berarti attribut camelCase seperti `:myProp="123"` akan cocok dengan `:myprop="123"`. Sebagai aturan praktis, anda harus menggunakan camelCase di JavaScript dan kebab-case di templat. Sebagai contoh sebuah prop didefinisikan di JavaScript sebagai `myProp` dan dihubungkan di templat sebagai `:my-prop`. 

Baca lebih lanjut: [camelCase vs. kebab-case](http://vuejs.org/guide/components.html#camelCase-vs-kebab-case).

Kita juga mendiskusikan kemungkinan menghilangkan ketidakkonsistenan ini dengan memperbaiki props dan komponen dengan cara case-insensitive. Gabung dengan percakapannya [disini](https://github.com/vuejs/vue/issues/2308).
