---
title: Filter
type: guide
order: 305
---

Vue.js memungkinkan Anda untuk menentukan filter yang dapat digunakan untuk memformat tulisan. Filter dapat digunakan di dua tempat: **interpolasi mustache dan ekspresi `v-bind`** (terakhir didukung di 2.1.0+). Filter harus ditambahkan di akhir ekspresi JavaScript dengan simbol "pipe" ( | ):

``` html
<!-- di mustaches -->
{{ message | capitalize }}

<!-- di v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

Anda dapat menentukan filter lokal dalam opsi komponen:

``` js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

atau menentukan filter secara global sebelum membuat Vue instance:

``` js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

Di bawah ini adalah contoh dari filter `capitalize` yang kami gunakan:

{% raw %}
<div id="example_1" class="demo">
  <input type="text" v-model="message">
  <p>{{ message | capitalize }}</p>
</div>
<script>
  new Vue({
    el: '#example_1',
    data: function () {
      return {
        message: 'john'
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  })
</script>
{% endraw %}

Filter selalu menerima nilai ekspresi (hasil dari rantai sebelumnya) sebagai argumen pertama. Dalam contoh di atas, filter `capitalize` akan menerima nilai `message` sebagai argumen.

Filter bisa berantai:

``` html
{{ message | filterA | filterB }}
```

Pasa kasus ini, `filterA`, didefinisikan dengan satu argumen, yang akan menerima nilai `message`, kemudian `filterB` akan dipanggil dengan hasil dari `filterA` yang akan dilanjutkan ke `filterB` sebagai satu argumen.

Filter adalah fungsi JavaScript, oleh karena itu mereka dapat mengambil argumen:

``` html
{{ message | filterA('arg1', arg2) }}
```

Di sini `filterA` didefinisikan sebagai fungsi yang mengambil tiga argumen. Nilai `message` yang akan dilanjutkan ke argumen pertama. String `'arg1'` yang akan di lanjutkan ke `filterA` sebagian argumen kedua, dan nilai dari ekspresi `arg2` akan dievaluasi dan diteruskan sebagai argumen ketiga.
