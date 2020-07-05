---
title: Fungsi Render & JSX
type: guide
order: 303
---

## Basics

Pada banyak kasus, Vue menganjurkan penggunaan templat untuk membuat HTML. Tetapi, ada beberapa situasi di mana anda butuh menggunakan Javascript secara penuh. Anda bisa menggunakan **fungsi render**, sebagai alternatif dari templat.

Mari Lihat contoh sederhana di mana fungsi 'render' terlihat praktis. Katakanlah anda ingin menghasilkan *anchored headings*:

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

Dari HTML di atas, anda memutuskan untuk menggunakan komponen di atas seperti:

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

Ketika anda mulai dengan komponen yang hanya membuat *heading* berdasarkan properti `level`, hasilnya akan seperti ini:

``` html
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>
```

``` js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

Templat di atas tidak telihat bagus, dan banyak sekali duplikasi di dalamnya seperti penggunaan `<slot></slot>` di setiap level heading dan harus melakukan hal yang sama ketika kita menambahkan elemen *anchor*.

Sementara templat bekerja dengan baik untuk sebagian besar komponen, jelas penggunaanya masih kurang tepat. Mari kita coba tulis ulang dengan menggunakan fungsi `render`:


``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // nama tag
      this.$slots.default // isi dari komponen
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

Lebih sederhana! kodenya lebih pendek, tapi kita juga harus terbiasa dengan properti yang ada di dalam *Vue instance*.  Dalam kasus ini, anda harus tahu bahwa isi dari komponen yang tidak di tandai direktif `v-slot`, seperti `Hello World!` di dalam `anchored-heading`, isi tersebut disimpan di `$slots.default`. Jika anda masih belum paham, **direkomendasikan untuk membaca [instance properties API](../api/#Instance-Properties) sebelum mempelajari lebih dalam tentang fungsi render.**

## Nodes, Trees, dan Virtual DOM

Sebelum kita lanjut lebih dalam tentang fungsi *render*, penting untuk sedikit mengetahui tentang bagaimana _browsers_ bekerja. Lihat contoh HTML di bawah ini:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline  -->
</div>
```

Ketika *browser* membaca kode di atas, *browser* akan membuat [pohon yang terdiri atas *DOM nodes*](https://javascript.info/dom-nodes) untuk membantu mencatat isi HTML tersebut, sama seperti jika anda membuat silsilah pohon keluarga untuk mencatat isi dari keluarga anda.

Bentuk pohon dari *DOM nodes* untuk HTML di atas terlihat seperti:

![Visualisasi pohon *DOM*](/images/dom-tree.png)

Setiap elemen adalah *node*. Setiap teks adalah *node*. Bahkan komentar juga *node*!. Dan sama seperti silsilah keluarga, setiap *node* bisa memiliki anak (misalnya setiap *node* mengandung *node* lainnya).

Memperbarui *node* yang banyak ini secara efisien tidaklah mudah, tapi untungnya, anda tidak harus melakukannya secara manual. Sebaliknya, gunakan Vue untuk membuat HTML yang Anda inginkan melalui templat:

```html
<h1>{{ blogTitle }}</h1>
```

Atau fungsi *render*:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

Dalam kedua kasus di atas, Vue secara otomatis akan memastikan bahwa tampilannya diperbarui dengan benar, seperti ketika `blogTitle` berubah.

### Virtual DOM

Vue melakukannya dengan cara membuat **virtual DOM** untuk mencatat perubahan yang dibutuhkan untuk merekonstruksi DOM yang sebenarnya. Lihat baris kode di bawah :

``` js
return createElement('h1', this.blogTitle)
```

Apa yang sebenarnya `createElement` kembalikan? hal itu bukanlah elemen DOM yang benar-benar diproses oleh browser. Secara teknis, lebih akurat jika dinamakan `createNodeDescription`, karena berisi informasi yang dibutuhkan oleh Vue, jenis *node* apa yang harus ditampilkan; termasuk deskripsi ini dari *node* tersebut. Deskripsi *node* ini diistilahkan dengan "virtual *node*", biasanya disingkat **VNode**. Sedangkan "Virtual DOM" digunakan untuk merujuk ke kumpulan dari VNode secara keseluruhan.

## Argumen `createElement`

Untuk lebih mendalami bagaimana cara penggunaan fitur templat di fungsi `createElement`, berikut beberapa argumen yang dapat diterima oleh `createElement`:

``` js
// @returns {VNode}
createElement(
  // {String | Obyek | Function}
  // Nama tag HTML, opsi komponen, atau fungsi asinkronus
  // Fungsi resolving ke salah satu. Wajib.
  'div',

  // {Obyek}
  // Objek data yang terkait dengan atribut
  // Anda akan gunakan dalam templat. Opsional.
  {
    // (lihat detil di bagian selanjutnya)
  },

  // {String | Array}
  // Isi VNode, bisa dengan `createElement()`,
  // atau string sepert 'text VNodes'. Opsional.
  [
    'Some text comes first.',
    createElement('h1', 'A headline'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### Obyek Data Secara Mendalam

Penting untuk dicatat, sama halnya `v-bind:class` dan `v-bind:style` diperlakukan secara khusus di templat, mereka punya tempat tersendiri juga di objek data dari VNode. Lewat objek ini Anda juga melakukan proses *binding* ke atribut bawaan HTML juga properti DOM seperti `innerHTML` (menggantikan direktif `v-html`):

``` js
{
  // Sama seperti `v-bind:class`, bisa diisi dengan
  // string, objek, atau array dari string dan objek
  class: {
    foo: true,
    bar: false
  },
  // Sama seperti `v-bind:style`, bisa diisi dengan
  // string, objek, atau array dari objek
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Atribut bawaan HTML
  attrs: {
    id: 'foo'
  },
  // properti komponen
  props: {
    myProp: 'bar'
  },
  // properti DOM
  domProps: {
    innerHTML: 'baz'
  },
  // Event handler diletakkan di dalam `on`, meskipun
  // modifier sepeti `v-on:keyup.enter` tidak
  // didukung. Anda harus melakukan pemeriksaan manual
  // untuk keyCodenya.
  on: {
    click: this.clickHandler
  },
  // Hanya untuk komponen, digunakan untuk memperhatikan
  // event bawaan, selain dari event yang dihasilkan oleh
  // komponen yang menggunakan `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
// Direktif kustom. Ingat bahwa `oldValue` tidak bisa diisi secara manual
// Karena Vue akan mengaturnya sendiri.
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Scoped slots dalam bentuk
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // Nama dari slot, jika komponen ini
  // anak dari komponen lain
  slot: 'name-of-slot',
  // Properti khusus lainnya
  key: 'myKey',
  ref: 'myRef',
  // Jika Anda menggunakan nama ref yang sama
  // di beberapa tempat, nilai dari `$refs.myRef` akan berbentuk
  // array
  refInFor: true
}
```

### Contoh Lengkap

Dengan informasi di atas, kita bisa melanjutkan komponen yang tadi kita buat:

``` js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // membuat id kebab-case
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^-|-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### Keterbatasan

#### VNode harus unik

Semua VNode yang ada di silsilah pohon komponen harus unik. Artinya, contoh di bawah salah:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Yikes - duplicate VNodes!
    myParagraphVNode, myParagraphVNode
  ])
}
```

Jika Anda memang ingin menduplikasi elemen/komponen yang sama beberapa kali, Anda bisa menggunakan fungsi *factory*. Di bawah ini adalah contoh yang valid untuk menampilkan 20 paragraf yang sama:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Mengganti Fitur Templat Dengan JavaScript

### `v-if` dan `v-for`

Jika ada hal sederhana yang bisa dicapai dengan mudah menggunakan JavaScript, fungsi render Vue tidak menyediakan cara khusus untuk melakukannya. Contohnya, penggunaan `v-if` dan `v-for` di templat:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

Bisa ditulis dengan `if`/`else` dan `map` bawaan dari JavaScript:

``` js
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

### `v-model`

Tidak ada fitur yang mirip `v-model` di fungsi render, Anda harus menerapkannya sendiri:

``` js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

Mungkin terasa lebih susah, tapi Anda punya kendali penuh dibandingkan `v-model`.

### Event & Key Modifiers

Untuk modifier event seperti `.passive`, `.capture`, dan `.once`; Vue memberikan prefix yang bisa digunakan dengan `on`:

| Modifier(s) | Prefix |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` or<br>`.once.capture` | `~!` |

Contoh:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

Untuk event dan key modifier lainnya, tidak ada prefix yang dibutuhkan, cukup gunakan event metode-nya di handler:

| Modifier(s) | Equivalent in Handler |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Keys:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (change `13` to [another key code](http://keycode.info/) for other key modifiers) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (change `ctrlKey` to `altKey`, `shiftKey`, or `metaKey`, respectively) |

Berikut contoh untuk penggunaan modifier di atas:

```javascript
on: {
  keyup: function (event) {
    // Batalkan jika elemen yang menghasilkan event ini bukan
    // elemen tempat event-nya di pasang
    if (event.target !== event.currentTarget) return
    // Batalkan jika key yang ditekan bukanlah tombol enter,
    // dan tombol shift tidak ditekan
    // di waktu yang sama
    if (!event.shiftKey || event.keyCode !== 13) return
    // Hentikan propagasi event
    event.stopPropagation()
    // Hentikan event handler dasar untuk event ini
    event.preventDefault()
    // ...
  }
}
```

### Slot

Anda bisa mengakses isi slot statik sebagai array VNode dari [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

Dan mengakses slot berlingkup (scoped) sebagai fungsi yang mengembalikan VNode dari [`this.$scopedSlots`](../api/#vm-scopedSlots):

``` js
props: ['message'],
render: function (createElement) {
  // `<div><slot :text="message"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.message
    })
  ])
}
```

Untuk meneruskan slot berlingkup ke komponen di dalamnya melalui fungsi render, gunakan field `scopedSlots` di data VNode:

``` js
render: function (createElement) {
  return createElement('div', [
    createElement('child', {
      // teruskan `scopedSlots` di objek data
      // dalam bentuk { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## JSX

Jika Anda menulis fungsi `render` yang panjang, akan menyusahkan jika Anda harus menulis seperti di bawah:

``` js
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

Terutama jika versi templatnya lebih sederhana:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

Karena itulah ada [plugin Babel](https://github.com/vuejs/jsx) untuk menggunakan JSX dengan Vue, memberikan kita cara penulisan yang sedikit mirip templat:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Menamai `createElement` menjadi `h` adalah aturan umum yang akan Anda sering temukan di ekosistem Vue dan wajib dilakukan untuk menggunakan JSX. Mulai dari plugin Babel untuk Vue [versi 3.4.0](https://github.com/vuejs/babel-plugin-transform-vue-jsx#h-auto-injection), secara otomatis diberikan baris `const h = this.$createElement` di *method* dan *getter* apa saja (selama bukan fungsi atau fungsi panah / *arrow function*), yang dideklarasikan di penulisan kode ES2015 yang berisi JSX, sehingga Anda bisa menghapus bagian parameter `(h)`. Di versi sebelumnya, akan terjadi galat jika tidak ada `h` yang tersedia di lingkup tersebut.</p>

Untuk pelajari lebih lanjut tentang JSX, lihat [dokumentasi penggunaannya](https://github.com/vuejs/jsx#installation).

## Komponen Fungsional

Komponen *anchored heading* yang kita buat sebelumnya relatif sederhana. Tidak ada *state*, *watcher*, dan tidak ada method siklus hidup. Hanya sebuah fungsi dengan beberapa *props*.

Dalam kasus ini, kita bisa menandai komponen ini dengan `functional`, artinya mereka tidak memiliki *state* (tidak ada [reactive data](../api/#Options-Data)) dan tanpa instan (tidak ada konteks `this`). **Komponen fungsional** terlihat seperti ini:

``` js
Vue.component('my-component', {
  functional: true,
  // Props bersifat opsional
  props: {
    // ...
  },
// Karena tidak ada instan,
// konteks diteruskan melalui parameter kedua
  render: function (createElement, context) {
    // ...
  }
})
```

> Catatan: di versi sebelum 2.3.0, opsi `props` harus ditulis jika Anda ingin komponen fungsional Anda menerima props. Di versi 2.3.0 ke atas, Anda tidak perlu menulis opsi `props` dan semua atribut yang ada di *node* komponen tersebut akan secara otomatis diambil sebagai *props*.

Di versi 2.5.0 ke atas, jika Anda menggunakan [komponen satu berkas / single-file components](single-file-components.html), komponen fungsional yang menggunakan templat bisa ditulis seperti di bawah:

``` html
<template functional>
</template>
```

Semua yang dibutuhkan oleh komponen akan diteruskan melalui `context`, sebuah objek yang berisi:

- `props`: objek berisi *props*
- `children`: *Array VNode* yang berisi anak dari komponen tersebut
- `slots`: Fungsi yang mengembalikan objek slot
- `scopedSlots`: (2.6.0+) Objek yang berisi slot berlingkup. Juga menyediakan slot normal sebagai fungsi.
- `data`: [data objek](#The-Data-Object-In-Depth), diteruskan ke komponen sebagai argumen kedua dari `createElement`
- `parent`: Referensi ke komponen di atasnya
- `listeners`: (2.3.0+) Objek yang berisi event listener yang didaftarkan oleh komponen di atasnya. Juga sebagai alias untuk `data.on`
- `injections`: (2.3.0+) jika ada opsi [`inject`](../api/#provide-inject), akan berisi injeksi yang ditemukan/diresolve.

Setelah menuliskan `functional: true`, pembaruan fungsi render dari komponen *anchored heading* yang baru dibuat mengharuskan Anda menambahkan argumen `context`, mengubah `this.$slots.default` menjadi `context.children`, lalu mengubah `this.level` menjadi `context.props.level`.

Karena komponen fungsional hanya sebuah fungsi saja, mereka lebih cepat untuk dirender. Tetapi, karena tidak adanya instan yang bisa dijadikan acuan, komponen fungsional tidak akan muncul di pohon komponen [Vue devtools](https://github.com/vuejs/vue-devtools).

Komponen fungsional sangat bermanfaat jika digunakan sebagai komponen pembungkus. Contohnya:

- Secara program memilih beberapa komponen yang akan didelegasikan
- Memanipulasi isi, *props*, dan data sebelum meneruskannya ke komponen lain di dalamnya

Berikut adalah contoh untuk komponen `smart-list` yang akan mengembalikan komponen yang lebih spesifik, tergantung dari *props* yang diberikan:

``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  },
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  }
})
```

### Meneruskan Atribut dan Event ke Anak Komponen

Umumnya, atribut yang tidak didefinisikan sebagai prop akan otomatis ditambahkan ke elemen akar dari komponen tersebut, menindih atau [menggabungkan dengan seksama](class-and-style.html) atribut yang sudah ada dengan nama yang sama.

Tetapi untuk komponen fungsional, Anda harus secara tertulis mendefinisikannya:

```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // Teruskan atribut, event listener, anak, dan sebagainya.
    return createElement('button', context.data, context.children)
  }
})
```

Dengan meneruskan `context.data` sebagai argumen kedua dari `createElement`, kita juga meneruskan atribut dan event lain yang digunakan di `my-functional-button`. Anda tidak butuh menambahkan modifier `.native`.

Jika Anda menggunakan komponen fungsional berbasis templat, Anda harus meneruskan atribut dan listener secara manual. Anda bisa menggunakan `data.attrs` untuk meneruskan atribut HTML, dan `listeners` _(alias dari `data.on`)_ untuk meneruskan event listener.

```html
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot/>
  </button>
</template>
```

### `slots()` vs `children`

Jika Anda penasaran kenapa kita butuh `slots()` dan `children`. Bukankah `slots().default` sama dengan `children`? Di beberapa kasus, iya - tapi bagaimana jika kita punya komponen fungsional seperti di bawah?

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

Untuk komponen ini, `children` akan mengembalikan kedua paragraf; sedangkan `slots().default` akan mengembalikan yang kedua saja, dan `slots().foo` akan mengembalikan yang pertama saja. Adanya `children` dan `slots()` memungkinkan Anda untuk memilih apakah komponen tahu tentang sistem slot, atau mungkin hanya ingin mendelegasikan tanggung jawab itu ke komponen lain dengan meneruskan `children`.

## Kompilasi Templat

Anda mungkin penasaran, bagaimana caranya templat Vue bisa diubah menjadi fungsi render. Detil implementasi ini tidak wajib untuk diketahui. Tapi jika Anda penasaran, di bawah ini adalah demo menggunakan `Vue.compile` untuk secara langsung mengubah string templat menjadi fungsi render:

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
    <pre v-if="!result.staticRenderFns.length"><code>{{ result.staticRenderFns }}</code></pre>
  </div>
  <div v-else>
    <label>Compilation Error:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
  <header>\n\
    <h1>I\'m a template!</h1>\n\
  </header>\n\
  <p v-if="message">\n\
    {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    No message.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Enter a valid template above'
      }
      try {
        var result = Vue.compile(this.templateText.replace(/\s{2,}/g, ''))
        return {
          render: this.formatFunction(result.render),
          staticRenderFns: result.staticRenderFns.map(this.formatFunction)
        }
      } catch (error) {
        return error.message
      }
    }
  },
  methods: {
    formatFunction: function (fn) {
      return fn.toString().replace(/(\{\n)(\S)/, '$1  $2')
    }
  }
})
console.error = function (error) {
  throw new Error(error)
}
</script>
<style>
#vue-compile-demo {
  -webkit-user-select: inherit;
  user-select: inherit;
}
#vue-compile-demo pre {
  padding: 10px;
  overflow-x: auto;
}
#vue-compile-demo code {
  white-space: pre;
  padding: 0
}
#vue-compile-demo textarea {
  width: 100%;
  font-family: monospace;
}
</style>
{% endraw %}
