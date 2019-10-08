---
judul: Perbandingan Kinerja/Performa
---

## Tolok Ukur(_Benchmark_) TodoMVC

> * Terakhir Diperbarui: 2014-10-12 *

Mencari tolok ukur TodoMVC? tolok ukur itu telah dihapus karena setelah diskusi dengan beberapa penulis kerangka kerja lain kami telah sepakat bahwa:

1. Tujuan sebenarnya dari tolok ukur ini adalah untuk membandingkan kinerja Browser dan bukan kinerja kerangka kerja. Pengujian dengan bentuk "memicu tindakan/aksi tertentu xxx kali" tidak mencerminkan tindakan yang bermakna dari pengguna di dunia nyata.

2. Karena perbedaan implementasi internal, kerangka kerja yang menggunakan rendering async (contoh. Vue, Om, Mercury) mendapatkan keuntungan dengan melewati sebagian dari perhitungan yang terjadi dalam perulangan peristiwa(_event_) yang sama. Pengalaman pengguna di dunia nyata tidak menunjukkan perbedaan dramatis seperti itu.

3. Secara keseluruhan rangkaian tolok ukur ini memunculkan lebih banyak kontroversi daripada wawasan yang membangun, sehingga lebih baik dihapus dan saya akan senang untuk menggantinya dengan cara yang lebih bermakna untuk mengukur kinerja program bagian depan(_front-end_)/tampilan.
