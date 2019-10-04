---
title: Introduction
type: cookbook
order: 0
---

## Buku Petunjuk vs Petunjuk

Bagaimana buku petunjuk berbeda dengan petunjuk? Mengapa hal ini penting?

* **Fokus Yang Lebih Baik**: Di dalam petunjuk, kami pada dasarnya bercerita. Setiap bagian dibangun dan diasumsikan dari tiap bagian sebelumnya. Di dalam buku petunjuk, setiap instruksi bisa dan harus berdiri sendiri. Ini berarti instruksi dapat fokus pada satu aspek spesifik Vue, daripada harus memberikan gambaran umum. 

* **Lebih Mendalam**: Untuk menghindari membuat panduan lebih panjang, kami mencoba untuk hanya menyertakan contoh paling sederhana untuk membantu anda memahami setiap fitur. Lalu kami melanjutkan. Di dalam buku petunjuk, kami bisa menyertakan lebih banyak contoh kompleks, menggabungkan fitur dengan cara yang menarik. Setiap instuksi juga bisa menjadi panjang dan rinci sesuai yang dibutuhkan, demi mendalami topik secara menyeluruh.

* **Mengajarkan JavaScript**: Di dalam petunjuk, kami berasumsi bahwa setidaknya sudah terbiasa dengan ES5 JavaScript. Sebagai contoh, kami tidak akan menjelaskan bagaimana `Array.prototype.filter` bekerja pada properti _computed_ yang menyaring sebuah daftar.

* **Menjelajahi Ekosistem**: Untuk fitur tingkat lanjut, kami mengasumsikan beberapa pengetahuan ekosistem. Sebagai contoh, jika anda ingin menggunakan komponen berkas tunggal (single-file components) di Webpack, kami tidak menjelaskan bagaimana cara untuk mengkonfigurasi selain bagian dari Vue pada konfigurasi Webpack. Di dalam buku petunjuk, kami memiliki ruang untuk menjelajahi pustaka ekosistem lebih dalam - setidaknya selama berguna secara universal bagi pengembang Vue.

## Kontribusi Buku Petunjuk

### Apa yang kami cari

Buku petunjuk memberikan contoh kepada pengembang untuk mengatasi kasus penggunaan umum atau menarik, dan juga menjelaskan detail yang lebih kompleks. Tujuan kami adalah untuk melampaui contoh pengantar sederhana, dan menunjukkan konsep yang lebih luas yang bisa diterapkan, dan beberapa peringatan untuk pendekatan.

Jika anda tertarik untuk berkontribusi, silakan mulai kolaborasi dengan cara mengisi sebuah isu dibawah tanda **ide buku petunjuk** dengan konsep anda sehingga kami bisa memandu anda untuk melakukan _pull request_ dengan sukses. Setelah ide anda disetujui, silakan ikuti templat dibawah ini sebanyak mungkin. Beberapa bagian diperlukan, dan lainnya adalah opsional. Mengikuti urutan penomoran sangat disarankan, tetapi tidak diwajibkan. 

Instruksi umumnya harus:

> * Menyelesaikan masalah umum, secara spesifik
> * Mulai dengan contoh yang paling sederhana
> * Mengenalkan kompleksitas satu per satu
> * Menautkan ke dokumentasi lain, daripada menjelaskan kembali konsep 
> * Mendeskripsikan masalah, daripada mengasumsikan keakraban
> * Menjelaskan prosesnya, daripada hanya memberikan hasil akhir
> * Menjelaskan kelebihan dan kekurangan dari strategi anda, termasuk ketika tepat atau tidak tepat
> * Menyebutkan solusi alternatif, jika relevan, tetapi berikan penjelajahan mendalam untuk instruksi terpisah

Kami memohon anda untuk mengikuti templat dibawah ini. Kami mengerti, namun, bahwa ada saat ketika anda perlu menyimpang demi kejelasan maupun aliran. Bagaimanapun juga, semua instruksi pada suatu titik tertentu harus mendiskusikan nuansa pilihan yang dibuat menggunakan pola ini, lebih disukai dalam bentuk bagian pola alternatif.

### Basis Contoh

_diwajibkan_

1.  Mengartikulasikan masalah dalam satu atau dua kalimat.
2.  Menjelaskan cara paling sederhana dalam satu atau dua kalimat.
3.  Menampilkan contoh kecil kode.
4.  Jelaskan apa yang dicapai dalam satu kalimat. 

### Detail tentang Nilai

_diwajibkan_

1.  Jawab pertanyaan umum yang mungkin dimiliki seseorang saat melihat contoh. (Blockquote bagus untuk hal ini)
2.  Tunjukkan contoh kesalahan langkah umum dan bagaimana mereka dapat dihindari.
3.  Perlihatkan contoh kode yang sangat sederhana dari pola yang baik dan buruk.
4.  Diskusikan mengapa ini bisa menjadi pola yang meyakinkan. Tautan untuk referensi tidak diwajibkan tetapi dianjurkan.

### Contoh Nyata

_diwajibkan_

Tunjukkan kode yang akan mendukung kasus penggunaan umum atau menarik, baik dengan:

1.  Melalui beberapa contoh pengaturan yang singkat, atau
2.  Memberikan contoh codepen/jsfiddle

Jika anda memilih untuk melakukan yang terakhir, anda masih harus membicarakan apa itu dan apa yang harus dilakukan.

### Konteks Tambahan

_opsional_

Sangat membantu untuk menuliskan sedikit tentang pola ini, di mana ini akan berlaku, mengapa ini bekerja dengan baik, dan menjalankan sedikit kode saat anda melakukannya atau memberikan orang bahan bacaan lebih lanjut di sini.

### Kapan harus menghindari pola ini

_opsional_

Bagian ini tidak diwajibkan, tetapi sangat direkomendasikan. Tidak masuk akal untuk menuliskan sesuatu yang sangat sederhana seperti mengubah kelas berdasarkan perubahan _state_, tetapi untuk pola tingkat lanjut seperti mixins, ini sangat penting. Jawaban untuk sebagian besar pertanyaan tentang pengembangan adalah ["Tergantung!"](https://codepen.io/rachsmith/pen/YweZbG), bagian ini mencakup itu. Disini, kami akan menilai secara jujur apakah pola ini berguna dan kapan harus dihindari, atau ketika hal lain lebih masuk akal.

### Pola Alternatif

_wajib_

Bagian ini diwajibkan ketika anda telah memberikan bagian diatas tentang penghindaran. Penting untuk mengeksplorasi metode lain sehingga orang-orang mengatakan bahwa sesuatu adalah anti-pola dalam situasi tertentu tidak dibiarkan bertanya-tanya. Dengan demikian, pertimbangkan bahwa web adalah tenda besar dan banyak orang memiliki struktur basis kode yang berbeda dan menyelesaikan tujuan yang berbeda. Apakah aplikasinya besar atau kecil? Apakah mereka mengintegrasikan Vue ke proyek yang ada, atau mereka membangun dari awal? Apakah pengguna mereka hanya berusaha mencapai satu tujuan atau banyak? Apakah ada banyak data yang tidak sinkron? Semua masalah ini akan berdampak pada implementasi alternatif. Buku petunjuk yang bagus memberi konteks ini pada pengembang.

## Terima kasih

Memakan waktu untuk berkontribusi pada dokumentasi, dan jika anda meluangkan waktu untuk mengirimkan PR ke bagian dokumen ini, anda melakukannya dengan rasa terima kasih kami.
