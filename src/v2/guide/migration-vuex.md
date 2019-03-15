---
title: Migrasi dari Vuex 0.6.x ke 1.0
type: guide
order: 703
---


> Vuex 2.0 sudah di-release, tapi kenapa petunjuk ini hanya mencakup migrasi ke 1.0? Apakah itu typo? Dan sepertinya Vuex 1.0 dan 2.0 di-release bersamaan. Apa yang terjadi? Yang mana yang harus saya pakai dan apa saja yang cocok dengan Vue 2.0?

Baik Vuex 1.0 atau 2.0 sama-sama:

- secara penuh mendukung Vue 1.0 dan 2.0
- akan dimaintain untuk waktu yang terjangkau

Namun keduanya memiliki sedikit perbedaan pada target pengguna.

__Vuex 2.0__ berisi perubahan radikal terhadap desain dan simplifikasi API, untuk mereka yang memulai proyek baru atau ingin performa yang lebih baik dalam manajemen *state* di sisi client. __ Hal tersebut tidak dibahas dalam petunjuk migrasi ini__, jadi Anda harus mengecek [the Vuex 2.0 docs](https://vuex.vuejs.org/en/index.html) jika Anda ingin mempelajarinya lebih lanjut.


Kebanyakan API __Vuex 1.0__  sudah kompatibel kebelakang, jadi hanya butuh sedkit perubahan untuk melakukan *upgrade*. __Vuex 1.0__ direkomendasikan untuk mereka yang memiliki basis kode yang besar atau mereka yang ingin -*upgrade* ke Vue 2.0 dengan proses yang lebih mulus. Petunjuk ini didedikasikan untuk memfasilitasi proses tersebut, namun hanya mencantumkan catatan migrasi. Untuk petunjuk penggunaan yang lebih lengkap, lihat [the Vuex 1.0 docs](https://github.com/vuejs/vuex/tree/1.0/docs/en).


## `store.watch` dengan Properti String Path <sup>diganti</sup>

`store.watch` sekarang hanya menerima fungsi. Sebagai contoh, Anda harus mengganti:

``` js
store.watch('user.notifications', callback)
```

dengan:

``` js
store.watch(
  // Saat hasil yang dikembalikan berganti...
  function (state) {
    return state.user.notifications
  },
  // Jalankan callback ini
  callback
)
```

Hal ini memberikan Anda kontrol yang lebih lengkap terhapdap properti yang reaktif yang ingin Anda amati (*watch*):

{% raw %}
<div class="upgrade-path">
  <h4>Jalan *Upgrade*</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>store.watch</code> with a string as the first argument.</p>
</div>
{% endraw %}

## Emiter Event Store <sup>dihapus</sup>


*Instance* dari store tidak lagi mengekspos interface "event emitter" (`on`, `off`, `emit`). Jika Anda menggunakan store sebagai *global event bus*, [lihat bagian ini](migration.html#dispatch-and-broadcast-removed)  untuk instruksi migrasi.

Ketimbang menggunakan interface ini untuk memantau even yang dikeluarkan oleh store (contoh: `store.on('mutation', callback)`), Vue menganalkan sebuah method baru `store.subscribe`. Penggunaan umum dalam sebuah plugin akan seperti:

``` js
var myPlugin = store => {
  store.subscribe(function (mutation, state) {
    // Lakukan sesuatu...
  })
}

```

Lihat contoh [dokumentasi plugins](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md) untuk info lebih lanjut.


{% raw %}
<div class="upgrade-path">
  <h4>Jalur *Upgrade*</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> dalam basis kode anda untuk menemukan contoh dari <code>store.on</code>, <code>store.off</code>, dan <code>store.emit</code>.</p>
</div>
{% endraw %}

## Middlewares <sup>diganti</sup>

*Middlewares* digantikan dengan plugins. Sebuah plugin adalah fungsi yang menerima store sebagai satu-satunya argumen, dan dapat mendengarkan perubahan *event* yang terjadi dalam store.

``` js
const myPlugins = store => {
  store.subscribe('mutation', (mutation, state) => {
    // Lakukan sesuatu...
  })
}
```

Untuk detail yang lebih jelas, lihat [dokumentasi plugins](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md).


{% raw %}
<div class="upgrade-path">
  <h4>Jalur Upgrade</h4>
  <p>Jalankan <a href="https://github.com/vuejs/vue-migration-helper">pembantu migrasi</a> dalam basis kode Anda untuk menemukan contoh dari opsi <code>middlewares</code> di atas "store".</p>
</div>
{% endraw %}
