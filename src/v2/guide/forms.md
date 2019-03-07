---
title: Form Input Bindings
type: guide
order: 10
---

## Penggunaan Dasar

Anda bisa menggunakan `v-model` untuk membuat *data binding* dua arah di *form input*, *textarea*, dan *select elements*. Hal tersebut secara otomatis akan memilih cara yang tepat untuk memperbarui elemen berdasarkan tipe *input*. Meskipun agak ajaib, `v-model` pada dasarnya adalah *syntax sugar* untuk memperbarui data setiap ada aksi *input* oleh pengguna, Ditambah perawatan khsusus untuk beberapa *edge cases*.

<p class="tip">`v-model` akan mengabaikan atribut `value`, `checked` atau `selected` awal yang ditemukan pada elemen *form* manapun. Hal tersebut akan selalu memperlakukan data *Vue Istance* sebagai *source of truth*. Anda harus mendeklarasikan nilai awal pada sisi *Javascript*, Di dalam opsi `data` dari komponen Anda.</p>

`v-model` secara internal menggunakan properti yang berbeda dan melakukan *emits* pada suatu *event* yang berbeda untuk elemen *input* yang berbeda:
- Elemen *text* dan *textarea* menggunakan properti `value` dan aksi `input`;
- *checkboxes* dan *radiobuttons* menggunakan properti `checked` dan aksi `change`;
- *select fields* menggunakan `value` sebagai *prop* dan `change` sebagai sebuah aksi.

<p class="tip" id="vmodel-ime-tip">Jika Anda memakai bahasa [IME](https://en.wikipedia.org/wiki/Input_method) (Cina,Jepang,Korea dll), Anda akan melihat bahwa `v-model` tidak diperbarui selama komposisi IME. Jika Anda ingin melayani pembaruan ini juga, Gunakan aksi `input` sebagai gantinya.</p>

### Teks

``` html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="edit me">
  <p>Message is: {{ message }}</p>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

### Teks Multiline

``` html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Multiline message is:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="add multiple lines"></textarea>
</div>
<script>
new Vue({
  el: '#example-textarea',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

{% raw %}
<p class="tip">Interpolasi pada *textareas* (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) tidak akan berfungsi. Sebagai gantinya gunakan <code>v-model</code> .</p>
{% endraw %}

### Checkbox

*Checkbox* tunggal, Nilai boolean:

``` html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```
{% raw %}
<div id="example-2" class="demo">
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">{{ checked }}</label>
</div>
<script>
new Vue({
  el: '#example-2',
  data: {
    checked: false
  }
})
</script>
{% endraw %}

*Checkboxes* lebih dari satu, Terikat ke *Array* yang sama:

``` html
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames }}</span>
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames }}</span>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
</script>
{% endraw %}

### Radio

``` html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Picked: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
</div>
<script>
new Vue({
  el: '#example-4',
  data: {
    picked: ''
  }
})
</script>
{% endraw %}

### Select

*Select* tunggal:

``` html
<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: ''
  }
})
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: ''
  }
})
</script>
{% endraw %}

<p class="tip">Jika nilai awal ekspresi `v-model` Anda tidak cocok dengan salah satu opsi, Elemen `<select>` akan merender dalam keadaan "tidak dipilih". Di iOS ini akan menyebabkan pengguna tidak dapat memilih item pertama karena iOS tidak memecat perubahan aksi dalam kasus ini. Oleh karena itu disarankan menyediakan opsi yang dinonaktifkan dengan nilai kosong, Seperti yang ditunjukkan pada contoh diatas.</p>

Select lebih dari satu (terikat ke *Array*):

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selected: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-6',
  data: {
    selected: []
  }
})
</script>
{% endraw %}

Opsi dinamis dengan `v-for`:

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
```
{% raw %}
<div id="example-7" class="demo">
  <select v-model="selected">
    <option v-for="option in options" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## Binding Nilai

Untuk radio, *checkbox* and *select options*, Nilai binding `v-model` biasanya berupa *string* statis ( atau *booleans* untuk *checkbox* ):

``` html
<!-- `picked` adalah sebuah string "a" ketika dicentang -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` adalah antara true or false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` adalah sebuah string "abc" ketika opsi pertama dipilih -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Namun terkadang kita mungkin ingin mengikat nilai ke properti dinamis pada Vue instance. Kita dapat menggunakan `v-bind` untuk mencapai itu. Selain itu, menggunakan `v-bind` memungkinkan kita untuk mengikat nilai *input* ke nilai *non-string*.

### Checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>
```

``` js
// ketika dicentang:
vm.toggle === 'yes'
// ketika tidak dicentang:
vm.toggle === 'no'
```

<p class="tip">Atribut `true-value` dan `false-value` tidak memengaruhi atribut *input* `value`, Karena browser tidak menyertakan kotak yang tidak dicentang dalam pengiriman formulir. Untuk menjamin bahwa salah satu dari dua nilai dikirimkan dalam bentuk (misalnya "Ya" or "Tidak"), Gunakan radio sebagai gantinya.</p>

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// ketika dicentang:
vm.pick === vm.a
```

### Opsi Select

``` html
<select v-model="selected">
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// ketika dipilih:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Modifier

### `.lazy`

Secara default, `v-model` menyinkronkan *input* dengan data setelah setiap aksi `input` (dengan pengecualian komposisi IME seperti [dinyatakan di atas](#vmodel-ime-tip)). Anda dapat menambahkan `lazy` *modifier* sebagai gantinya disinkronkan setelah aksi `change`:

``` html
<!-- synced after "change" instead of "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Jika Anda ingin *input* pengguna diketik secara otomatis sebagai angka, Anda dapat menambahkan `number` *modifier* ke *input* yang dieklola oleh `v-model` Anda:

``` html
<input v-model.number="age" type="number">
```

Hal ini seringkali berguna, Karena, bahkan hanya dengan `type="number"`, nilai elemen *input* HTML selalu dikembalikan dalam bentuk *string*. Jika nilai tidak dapat diuraikan dengan `parseFloat()`, maka nilai asli yang akan dikembalikan.

### `.trim`

Jika Anda ingin menyisipkan spasi kosong dari *input*-an pengguna yang bisa di pangkas secara otomatis, Anda bisa menambahkan `trim` *modifier* ke *input* yang dikelola oleh `v-model` Anda:

```html
<input v-model.trim="msg">
```

## `v-model` dengan Komponen

> Jika Anda belum terbiasa dengan komponen Vue, Anda boleh melewati bagian ini.

Jenis *input* bawaan HTML tidak akan selalu memenuhi kebutuhan Anda. Untungnya, Komponen Vue memungkinkan Anda untuk membuat *input* yang bisa digunakan kembali dengan perilaku yang sepenuhnya bisa disesuaikan. Input ini bahkan bisa bekerja dengan `v-model`! Untuk mempelajari lebih lanjut, baca tentang [input khsusus](components.html#Using-v-model-on-Components) di panduan komponen.
