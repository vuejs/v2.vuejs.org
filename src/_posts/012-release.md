---
title: Vue.js 0.12 released!
date: 2015-06-11 17:37:30
---

Saya sangat bersemangat untuk  mengumumkan bahwa [Vue.js 0.12: Dragon Ball](https://github.com/yyx990803/vue/releases/tag/0.12.0) akhirnya selesai. Terima kasih kepada seluruh pihak yang telah mencoba versi beta/rc dan memberikan feedback / laporan bug selama penggunaan.

Ada banyak hal yang harus dibahas pada perilisan ini, dan kami akan berbicara tentang  bebrapa hal-hal yang penting dibawah ini. Namun, alangkah baiknya untuk tetap mengikuti [Catatan Rilis Lengkap](https://github.com/yyx990803/vue/releases/tag/0.12.0) dan perbarui dokumen jika kamu meningkatkan dari 0.11. Kamu dapat melaporkan bug di Github, mengirim pertanyaan ke  [vuejs/Discussion](https://github.com/vuejs/Discussion/issues), atau bergabung dengan kami di  [Gitter chat channel](https://gitter.im/yyx990803/vue).

<!-- more -->

### Komponen Sintaks Lebih Konsisten

Sebelumnya di 0.11 Anda memiliki dua cara untuk menggunakan komponen Vue.js: menggunakan `v-component` secara langsung, atau menggunakan elemen khusus. Terdapat juga dua cara untuk meneruskan data ke komponen child: menggunakan `v-with` secara langsung, atau menggunakan opsi `paramAttributes`. Meskipun kedua elemen khusus dan atribut parameter dapat dikomplikasi, itu membingungkan dan berlebihan untuk memiliki dua set sintaks untuk fungsi yang sama.

Selain itu, perlu dicatat bahwa sistem komponen adalah konsep kelas pertama dalam Vue.js, bahkan lebih penting. Ini mendefinisikan bagaimana kita merangkum logika tampilan tingkat yang lebih tinggi dan menyusun aplikasi kita. Sementara itu, memiliki cara yang jelas dan deklaratif untuk meneruskan data ke dalam komponen tururnan itu juga sangat penting. Komponen dan atribut parameter memilik sintaksis khusus mereka sendiri untuk membedakannya dari yang lainnya.

Hasil dari, `v-component` dan `v-with` sudah tidak digunakan lagi di 0.12. `paramAttributes` juga diubah namanya menjadi `props`, yang lebih pendek dan lebih bersih. Mulai sekarang, kebanyakan komponen Vue.js akan terlihat seperti ini:

``` html
<my-component prop="{{parentData}}"></my-component>
```

Ada juga alat peraga tambahan terkait seperti alat peraga satu kali atau satu arah yang jelas, ekspresi sebagai alat peraga, metode sebagai callback prop dan lebih banyak lagi. Anda dapat mengetahui lebih detail di catatan rilis 0.12 terkait di atas dan perbaruan [Sistem Komponen](/guide/components.html) pada panduan ini.

### Filter Perbaikan Argumen

Di 0,11, filter selalu menerima argumen mereka sebagai string biasa. Argumen dapat diapit dalam tAnda kutip untuk menyertakan spasi putih, tetapi tAnda kutip tidak secara otomatis dihapus ketika diteruskan ke fungsi filter. Beberapa pengguna juga bingung tentang cara mengambil nilai dinamis pada vm bukan string biasa.

Dalam 0,12, sintaks argumen filter mengikuti aturan sederhana: jika argumen diapit oleh tAnda kutip, maka akan dilewatkan sebagai string biasa; jika tidak, ini akan dievaluasi terhadap vm saat ini sebagai nilai dinamis.

Ini berarti penggunaan beberapa filter yang ada harus berubah:

``` html
<a v-on="keyup: onKeyUp | key 'enter'"></a>
{{ items.length | pluralize 'item' }}
```

Tapi itu akan membuat filter khusus yang bergantung pada nilai dinamis jauh lebih mudah untuk ditulis:

``` html
{{ msg | concat otherMsg }}
```

Disini argumen pertama ke filter `concat` akan menjadi nilai dari `this.otherMsg`.

### Komponen Asinkron

Ini adalah praktik khusus untuk menggabungkan seluruh JavaScript kedalam satu file ketika membangun aplikasi satu halaman besar. Tetapi ketika file terlalu besar, kami mungkin ingin menunda memuat bagian dari aplikasi kami untuk beban awal yang lebih cepat. Namun, ini memang menimbulkan beberapa kendala tentang bagaimana arsitektur aplikasi harus dirancang. Itu bisa sangat rumit untuk mencari tahu bagaimana cara yang benar untuk memecah kumpulan JavaScript Anda.

Baik, dengan Vue.js kita sudah dapat membangun aplikasi kita sebagai komponen yang dipisahkan. Jika kita dapat dengan malas memuat komponen dinamis hanya ketika itu dibutuhkan, bukankah itu sangat mengesankan? Faktanya, di 0.12 ini akan sangat mudah dengan adanya fitur komponen asinkron yang baru.

Di 0.12, Anda dapat mendefinisikan sebuah komponen sebagai  you can define a component as a fungsi pabrik yang secara asinkron menyelesaikan definisi komponen (hanya bisa menjadi objek pilihan biasa). Vue.js hanya akan memicu fungsi pabrik ketika komponen tersebut sebenarnya perlu diberikan, dan akan menyimpan hasilnya untuk render selanjutnya:

``` js
Vue.component('contoh-asinkron', function (resolve, reject) {
  setTimeout(function () {
    resolve({
      template: '<div>Aku asinkron!</div>'
    })
  }, 1000)
})
```

Terserah Anda untuk memutuskan bagaimana memuat komponen dari server, misalnya menggunakan `$.getScript()` atau require.js; tetapi penggunaan yang disarankan adalah mengunakan Webpack [Fitur Pembatas Kode](http://webpack.github.io/docs/code-splitting.html):

``` js
Vue.component('contoh-asinkron-webpack', function (resolve, reject) {
  // Di Webpack AMD (Asynchronous Module Definition) seperti sintaks menunjukkan titik perpecahan kode
  require(['./komponen-asinkron'], resolve)
})
```

Itu semua hal yang Anda harus lakukan. Anda dapat menggunakan komonen tersebut seperti sebelumnya, tanpa perlu memikirkan tentang asinkron komponen tersebut. Webpack akan secara otomatis memecah kode akhir JavaScript Anda kedalam berkas terpisah dengan keadaan yang benar, dan otomatis memuat berkas melalui Ajax ketika itu dibutuhkan.Anda dapat melihat contoh yang berfungsi penuh [di sini](https://github.com/vuejs/vue-webpack-example).

### Sistem Transisi Yang Lebih Baik

 Sistem transisi Vue.js' sangat mudah untuk digunakan, tetapi diakhir itu memiliki batasan bahwa Anda tidak bisa menggabungkan transisi CSS dan berbasis JavaScript bersamaan. Di 0.12 itu bukan lagi masalah! Sistem transisi yang ditingkatkan sekarang memungkinkan Anda menambahkan pengait (hook) JavaScript ke transisi berbasis CSS untuk kontrol tambahan. Jumlah kait (hook) yang terpapar juga telah diperluas untuk memberi Anda kontrol yang lebih halus pada setiap tahap transisi.

`v-repeat` sekarang juga didukung dengan dukungan built-in untuk transisi yang membingungkan. Ini semudah menambahkan `stagger="100"` ke elemen berulang Anda. Hal ini juga memungkinkan untuk menentukan keterpisahan untuk masuk dan keluar, atau bahkan secara dinamis menghitung penundaan yang membingungkan dalam pengait (hook) JavaScript.

Untuk perincian lengkap tentang sistem transisi baru, lihat [panduan terbaru](/guide/transitions.html).

### Penyetelan Kinerja

Pelacakan ketergantungan tepat Vue.js membuatnya menjadi salah satu lapisan tampilan paling efisien untuk pembaruan kecil, tetapi selalu ada ruang untuk perbaikan. Di 0.12, kreasi instance internal dan refactor kompilasi telah meningkatkan performa render pertama untuk daftar besar hingga 40%. Dengan penggunaan `track-by` yang tepat, [render ulang dengan kumpulan data baru yang besar](http://vuejs.github.io/js-repaint-perfs/vue/) juga sebanding dengan, atau bahkan lebih cepat daripada kerangka kerja berbasis-Virtual-DOM lainnya.

### Satu Hal Lagi...

Dengan dirilisnya 0.12, lebih banyak upaya sekarang akan dihabiskan pada vue-router resmi, pustaka routing khusus untuk Vue.js dengan menyesuaikan tampilan berlapis, dukungan transisi penuh, dan kait (hook) data asinkron.  Saya telah menyatakan bahwa inti Vue.js bermaksud untuk tetap sesuai dengan kebutuhan, pustaka lapisan tampilan drop-in, dan itu tidak akan berubah. Vue-router akan dikirim secara terpisah dan benar-benar opsional, namun Anda dapat mengharapkannya bekerja secara lancar dengan inti Vue.js saat Anda membutuhkannya.
