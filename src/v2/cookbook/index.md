---
title: Pengantar
type: cookbook
order: 0
---

## Buku Pedoman vs Panduan

Bagaimana buku pedoman bisa berbeda dengan Panduan? Mengapa hal ini perlu?

* **Fokus yang Lebih Baik**: Dalam panduan, pada dasarnya kita menceritakan sebuah cerita. Dalam panduan ini, pada dasarnya kami sedang bercerita.Setiap bagian dibangun di atas dan mengasumsikan pengetahuan dari setiap bagian sebelumnya. Dalam buku pedoman, setiap petunjuk dapat dan harus berdiri sendiri. Ini berarti buku pedoman dapat fokus pada satu aspek spesifik Vue, daripada harus memberikan gambaran umum. 

* **Kedalaman yang Lebih Baik**: Untuk menghindari membuat Panduan terlalu lama, kami mencoba menyertakan hanya contoh sederhana untuk membantu anda memahami setiap fitur. Kemudian kita melanjutkan. Dalam buku pedoman, kita dapat memasukkan contoh yang lebih kompleks, menggabungkan fitur dengan cara yang menarik. Setiap petunjuk juga bisa sepanjang dan sedetail yang dibutuhkan, sesuai yang dibutuhkan, untuk sepenuhnya menjelajahi ceruknya.

* **Mengajarkan JavaScript**: Dalam Panduan ini, kami mengasumsikan setidaknya mengenal ES5 JavaScript secara menengah. Sebagai contoh, kami tidak akan menjelaskan bagaimana `Array.prototype.filter` bekerja pada properti komputasi yang memfilter daftar. Namun dalam buku pedoman, fitur JavaScript penting (termasuk ES6/2015 ) dapat dieksplorasi dan dijelaskan dalam konteks bagaimana mereka membantu kita membangun aplikasi Vue yang lebih baik.

* **Menjelajahi Ekosistem**: Untuk fitur tingkat lanjut, kami mengasumsikan beberapa pengetahuan ekosistem. Misalnya, jika Anda ingin menggunakan komponen file tunggal di Webpack, kami tidak menjelaskan cara mengonfigurasi bagian non-Vue dari konfigurasi Webpack.Dalam buku masak, kami memiliki ruang untuk menjelajahi perpustakaan ekosistem ini secara lebih mendalam - setidaknya sejauh yang secara universal berguna bagi pengembang Vue.

Dengan semua perbedaan ini, harap dicatat bahwa buku pedoman masih bukan manual langkah demi langkah. Untuk sebagian besar kontennya, Anda diharapkan memiliki pemahaman dasar tentang konsep-konsep seperti HTML, CSS, JavaScript, npm/yarn, dll.

## Kontribusi buku pedoman

### Apa yang kami cari

buku pedoman memberikan contoh kepada pengembang untuk mengatasi kasus penggunaan umum atau menarik, dan juga secara progresif menjelaskan detail yang lebih kompleks. Tujuan kami adalah untuk bergerak melampaui contoh pengantar sederhana, dan menunjukkan konsep-konsep yang lebih luas berlaku, serta beberapa peringatan untuk pendekatan tersebut.

Jika Anda tertarik untuk berkontribusi, silakan mulai kolaborasi dengan mengajukan masalah di bawah **ide buku pedoman** dengan konsep anda sehingga kami dapat membantu memandu Anda untuk melakukan _pull request_ dengan sukses. Setelah ide anda disetujui, silakan ikuti template dibawah ini sebanyak mungkin. Beberapa bagian diperlukan, dan beberapa opsional. Mengikuti urutan numerik sangat disarankan, tetapi tidak diperlukan.

Instruksi umumnya harus:

> * Menyelesaikan masalah umum, secara spesifik
> * Mulai dengan contoh yang paling sederhana
> * Mengenalkan kompleksitas satu per satu
> * Menautkan ke dokumentasi lain, daripada menjelaskan kembali konsep 
> * Mendeskripsikan masalah, daripada mengasumsikan keakraban
> * Menjelaskan prosesnya, daripada hanya memberikan hasil akhir
> * Menjelaskan kelebihan dan kekurangan dari strategi anda, termasuk ketika tepat atau tidak tepat
> * Menyebutkan solusi alternatif, jika relevan, tetapi berikan penjelajahan mendalam untuk instruksi terpisah

Kami meminta Anda untuk mengikuti template di bawah ini. Kami memahami, bagaimanapun, bahwa ada kalanya Anda mungkin perlu menyimpang untuk kejelasan atau aliran. Bagaimanapun juga, semua petunjuk pada titik tertentu harus membahas nuansa pilihan yang dibuat menggunakan pola ini, lebih disukai dalam bentuk bagian pola alternatif.

### Contoh Dasar

_diwajibkan_

1.  Mengartikulasikan masalah dalam satu atau dua kalimat.
2.  Jelaskan solusi sesederhana mungkin dalam satu atau dua kalimat.
3.  Memperlihatkan contoh kecil kode.
4.  Jelaskan apa yang dicapai dalam sebuah kalimat. 

### Detail tentang Nilai

_diwajibkan_

1.  Jawablah pertanyaan umum yang mungkin dimiliki seseorang saat melihat contoh tersebut. (Blockquotes sangat bagus untuk  ini)
2.  Tunjukkan contoh kesalahan langkah umum dan bagaimana mereka dapat dihindari.
3.  Tampilkan sampel kode yang sangat sederhana dari pola yang baik dan buruk.
4.  Diskusikan mengapa ini mungkin merupakan pola yang menarik. Tautan untuk referensi tidak diwajibkan tetapi dianjurkan.

### Contoh Nyata

_diwajibkan_

Tunjukkan kode yang akan mendukung kasus penggunaan umum atau menarik, baik dengan:

1.  Melalui beberapa contoh pengaturan yang singkat, atau
2.  Memberikan contoh codepen/jsfiddle

Jika anda memilih untuk melakukan yang terakhir, anda masih harus membicarakan apa itu dan apa yang harus dilakukan.

### Konteks Tambahan

_opsional_

Sangat membantu untuk menuliskan sedikit tentang pola ini, di mana lagi itu akan berlaku, mengapa itu bekerja dengan baik, dan menjalankan sedikit kode saat Anda melakukannya atau memberi orang bahan bacaan lebih lanjut di sini.

### Kapan harus menghindari pola ini

_opsional_

Bagian ini tidak diwajibkan, tetapi sangat disarankan. Tidak masuk akal untuk menuliskan sesuatu yang sangat sederhana seperti mengubah kelas berdasarkan perubahan _state_, tetapi untuk pola tingkat lanjut seperti mixins, ini sangat penting. Jawaban untuk sebagian besar pertanyaan tentang pengembangan adalah ["Tergantung!"](https://codepen.io/rachsmith/pen/YweZbG), bagian ini mencakup itu. Disini, kami akan menilai secara jujur apakah pola ini berguna dan kapan harus dihindari, atau ketika hal lain lebih masuk akal.

### Pola Alternatif

_wajib_

Bagian ini diwajibkan ketika anda telah memberikan bagian diatas tentang penghindaran. Penting untuk mengeksplorasi metode lain sehingga orang-orang mengatakan bahwa sesuatu adalah anti-pola dalam situasi tertentu tidak dibiarkan bertanya-tanya. Dengan demikian, pertimbangkan bahwa web adalah tenda besar dan banyak orang memiliki struktur basis kode yang berbeda dan menyelesaikan tujuan yang berbeda. Apakah aplikasinya besar atau kecil? Apakah mereka mengintegrasikan Vue ke proyek yang ada, atau mereka membangun dari awal? Apakah pengguna mereka hanya berusaha mencapai satu tujuan atau banyak? Apakah ada banyak data yang tidak sinkron? Semua masalah ini akan berdampak pada implementasi alternatif. buku pedoman yang bagus memberi konteks ini pada pengembang.

## Terima kasih

butuh waktu untuk berkontribusi pada dokumentasi, dan jika anda meluangkan waktu untuk mengirimkan PR ke bagian dokumen kami ini, anda melakukannya dengan rasa terima kasih kami.