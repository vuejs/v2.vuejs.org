---
title: Debug menggunakan VS Code
type: cookbook
order: 8
---

Setiap aplikasi akan mencapai titik di mana perlu untuk memahami galat, kecil atau besar. Di resep ini, kita mengeksplorasi beberapa alur kerja untuk pengguna VS Code yang ingin men-debug aplikasinya di browser.

Resep ini menunjukkan cara untuk men-debug aplikasi [Vue CLI](https://github.com/vuejs/vue-cli) di VS Code saat dijalankan di browser.

<p class="tip">Catatan: Resep ini mencakup peramban Chrome dan Firefox. Jika anda tahu cara mengatur <i>debugger</i> VS Code untuk bekerja diperamban lain, silahkan pertimbangkan untuk berbagi (lihat bagian bawah halaman)</p>

## Prasyarat

Pastikan anda sudah menginstal VS Code dan peramban pilihan anda, juga ekstensi _debugger_-nya sudah dipasang dan diaktifkan.

- [_Debugger_ untuk Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [_Debugger_ untuk Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

Pasang dan buat proyek dengan [vue-cli](https://github.com/vuejs/vue-cli), ikut instruksi [Panduan Vue CLI](https://cli.vuejs.org/). Lalu masuk ke folder proyek yang baru dibuat dan buka di VS Code.

### Menampilkan kode di Browser

Sebelum anda bisa mendebug komponen Vue dari VS Code, anda harus memperbarui konfigurasi Webpack yang barusan dibuat untuk membangun `sourcemaps`. Kita melakukan ini agar _debugger_ yang dipakai bisa memetakan kode didalam berkas yang terkompresi kembali ke berkas aslinya. Ini memastikan bahwa anda dapat men-debug aplikasi bahkan setelah aset atau kode anda sudah di optimisasi oleh Webpack.

Jika anda menggunakan Vue CLI 2, atur atau ubah properti `devtool` didalam berkas `config/index.js`:

```json
devtool: 'source-map',
```

Jika anda menggunakan Vue CLI 3, atur atau ubah properti `devtool` didalam berkas `vue.config.js`:

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```

### Menjalankan aplikasi dari VS Code

Click on the Debugging icon in the Activity Bar to bring up the Debug view, then click on the gear icon to configure a launch.json file, selecting **Chrome/Firefox: Launch** as the environment. Replace content of the generated launch.json with the corresponding configuration:

Klik ikon _debugging_ di _Activity Bar_ VS Code untuk memunculkan tampilan Debug, lalu klik pada ikon roda gigi untuk mengonfigurasi berkas `launch.json`, pilih **Chrome/Firefox: _Launch_**

![Menambahkan konfigurasi Chrome](/images/config_add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///./src/*": "${webRoot}/*"
      }
    },
    {
      "type": "firefox",
      "request": "launch",
      "name": "vuejs: firefox",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }]
    }
  ]
}
```

## Mengatur _Breakpoint_

1.  Atur _breakpoint_ di **src/components/HelloWorld.vue** pada `baris 90` dimana _function_ `data` mengembalikan untaian.

![_Renderer Breakpoint_](/images/breakpoint_set.png)

2.  Buka konsol favorit anda di folder utama aplikasi dan sajikan aplikasi menggunakan Vue CLI:

```
npm start
```

3.  Buka tampilan Debug, pilih konfigurasi **'vuejs: chrome/firefox'**, lalu tekan F5 atau klik tombol mainkan yang berwarna hijau.

4.  _Breakpoint_ anda akan terkena ketika peramban anda membuka `http://localhost:8080`.

![_Breakpoint_ Yang Terkena](/images/breakpoint_hit.png)

## Pola Alternatif

### Menggunakan alat pengembang Vue

Ada cara lain untuk men-debug, kompleksitasnya beragam. Yang paling populer dan mudah adalah menggunakan alat pengembang Vue.js (_Vue.js Devtools_) yang bekerja sangat baik, silahkan pasang di peramban pilihan anda: [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) atau [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/). Beberapa manfaat bekerja dengan alat pengembang adalah memungkinkan anda untuk menyunting langsung properti data dan melihat perubahan yang secara otomatis langsung ditampilkan. Manfaat lain adalah memungkinkan anda untuk melakukan _Time travel debugging_ untuk Vuex.

![_Time Travel Debugger_ Pada Alat Pengembang](/images/devtools-timetravel.gif)

<p class="tip">Harap perhatikan bahwa jika halaman menggunakan paket Vue.js yang disusun untuk dijalankan pada aplikasi produksi atau yang sudah di perkecil (seperti menggunakan tautan dari CDN), inspeksi alat pengembang dinonaktifkan secara standar sehingga panel alat pengembang Vue.js tidak akan muncul. Jika anda beralih ke versi yang tidak diperkecil, anda mungkin harus memuat ulang halaman dengan keras, pada peramban Chrome/Firefox, bisa dengan menekan CTRL/CMD+SHIFT+R.</p>

### Kode _Debugger_ Sederhana

Contoh diatas memiliki alur kerja yang bagus. Namun, ada opsi alternatif di mana anda dapat menggunakan [kode _debugger_ bawaan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) secara langsung. Jika anda memilih untuk bekerja menggunakan cara ini, sangat penting untuk mengingat untuk menghapus kode _debugger_ bawaannya saat anda sudah selesai.

```js
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hello World!'
    debugger
    this.message = hello
  }
};
</script>
```

## Ucapan Terima Kasih

Resep ini berdasar pada kontribusi dari [Kenneth Auchenberg](https://twitter.com/auchenberg), [tersedia disini](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli).
