---
title: Fungsi *Render* % JSX
type: guide
order: 303
---

## Basics

Pada banyak kasus, Vue menganjurkan penggunaan templat untuk membuat HTML. Tetapi, ada beberapa situasi di mana anda butuh menggunakan Javascript secara penuh. Kalian bisa menggunakan **fungsi render**, sebagai alternatif dari templat.

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

## *Nodes*, *Trees*, dan *Virtual DOM*

Sebelum kita lanjut lebih dalam tentang fungsi *render*, penting untuk sedikit mengetahui tentang bagaimana _browsers_ bekeerja. Lihat contoh HTM di bawah:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline  -->
</div>
```

Ketika *browser* membaca kode di atas, *browser* akan membuat [pohon yang terdiri atas *DOM nodes*](https://javascript.info/dom-nodes) untuk membantu mencatat isi HTML tersebut, sama seperti jika anda membuat silsilah pohon keluarga untuk mencata isi dari keluarga anda.

Bentuk pohon dari *DOM nodes* untuk HTML di atas terlihat seperti:

![Visualisasi pohon *DOM*](/images/dom-tree.png)

Setiap elemen adalah *node*. Setiap teks adalah node. BAhkan komentar juga *node*!. Dan sama seperti silsilah keluarga, setiap *node* bisa memiliki anak (misalnya setiap node mengandung *node* lainnya).

Memperbarui *node* yang banyak ini secara eisien tidaklah mudah, tapi untungnya, anda tidak harus melakukannya secara manual. Sebaliknya, gunakan Vue untuk membuat HTML yang kalian inginkan melalui templat:

```html
<h1>{{ blogTitle }}</h1>
```

Atau fungsi *render*:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

Dalam kedua kasus, Vue secara otomatis akan memastikan bahwa tampilannya diperbarui dengan benar, seperti ketika `blogTitle` berubah.

### The Virtual DOM

Vue melakukannya dengan cara membuat **virtual DOM** untuk mencatat perubahan yang dibutuhkan untuk merekonstruksi DOM yang sebenarnya. Lihat baris kode di bawah :

``` js
return createElement('h1', this.blogTitle)
```

Apa yang sebenarnya `createElement` kembalikan? hal itu bukanlah elemen DOM yang benar-benar diproses oleh browser. Secara teknis, lebih akurat jika dinamakan `createNodeDescription`, karena berisi informasi yang dibutuhkan oleh Vue, jenis node apa yang harus ditampilkan; termasuk deskripsi ini dari node tersebut. Deskripsi node ini diistilahkan dengan "virtual node", biasanya disingkat **VNode**. Sedangkan "Virtual DOM" digunakan untuk merujuk ke kumpulan dari VNode secara keseluruhan.

## Argumen `createElement`

Untuk lebih mendalami bagaimana cara penggunaan fitur templat di fungsi `createElement`, berikut beberapa argumen yang diterima oleh `createElement`:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Nama tag HTML, opsi komponen, atau fungsi asinkronus
  // Fungsi resolving ke salah satu. Wajib.
  'div',

  // {Object}
  // Objek data yang terkait dengan atribut
  // Anda akan gunakan dalam templat. Opsional.
  {
    // (lihat detail di bagian selanjutnya)
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

### The Data Object In-Depth

Penting untuk dicatat, sama halnya `v-bind:class` dan `v-bind:style` diperlakukan secara khusus di templat, mereka punya tempat tersendiri juga di objek data dari VNode. Lewat objek ini kalian juga melakukan proses *binding* ke atribut bawaan HTML juga properti DOM seperti `innerHTML` (menggantikan direktif `v-html`):

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
  // Jika kalian menggunakan nama ref yang sama
  // di beberapa tempat, nilai dari `$refs.myRef` akan berbentuk
  // array
  refInFor: true
}
```

### Complete Example

With this knowledge, we can now finish the component we started:

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
    // create kebab-case id
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

### Constraints

#### VNodes Must Be Unique

All VNodes in the component tree must be unique. That means the following render function is invalid:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Yikes - duplicate VNodes!
    myParagraphVNode, myParagraphVNode
  ])
}
```

If you really want to duplicate the same element/component many times, you can do so with a factory function. For example, the following render function is a perfectly valid way of rendering 20 identical paragraphs:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Replacing Template Features with Plain JavaScript

### `v-if` and `v-for`

Wherever something can be easily accomplished in plain JavaScript, Vue render functions do not provide a proprietary alternative. For example, in a template using `v-if` and `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

This could be rewritten with JavaScript's `if`/`else` and `map` in a render function:

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

There is no direct `v-model` counterpart in render functions - you will have to implement the logic yourself:

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

This is the cost of going lower-level, but it also gives you much more control over the interaction details compared to `v-model`.

### Event & Key Modifiers

For the `.passive`, `.capture` and `.once` event modifiers, Vue offers prefixes that can be used with `on`:

| Modifier(s) | Prefix |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` or<br>`.once.capture` | `~!` |

For example:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

For all other event and key modifiers, no proprietary prefix is necessary, because you can use event methods in the handler:

| Modifier(s) | Equivalent in Handler |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Keys:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (change `13` to [another key code](http://keycode.info/) for other key modifiers) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (change `ctrlKey` to `altKey`, `shiftKey`, or `metaKey`, respectively) |

Here's an example with all of these modifiers used together:

```javascript
on: {
  keyup: function (event) {
    // Abort if the element emitting the event is not
    // the element the event is bound to
    if (event.target !== event.currentTarget) return
    // Abort if the key that went up is not the enter
    // key (13) and the shift key was not held down
    // at the same time
    if (!event.shiftKey || event.keyCode !== 13) return
    // Stop event propagation
    event.stopPropagation()
    // Prevent the default keyup handler for this element
    event.preventDefault()
    // ...
  }
}
```

### Slots

You can access static slot contents as Arrays of VNodes from [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

And access scoped slots as functions that return VNodes from [`this.$scopedSlots`](../api/#vm-scopedSlots):

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

To pass scoped slots to a child component using render functions, use the `scopedSlots` field in VNode data:

``` js
render: function (createElement) {
  return createElement('div', [
    createElement('child', {
      // pass `scopedSlots` in the data object
      // in the form of { name: props => VNode | Array<VNode> }
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

If you're writing a lot of `render` functions, it might feel painful to write something like this:

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

Especially when the template version is so simple in comparison:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

That's why there's a [Babel plugin](https://github.com/vuejs/jsx) to use JSX with Vue, getting us back to a syntax that's closer to templates:

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

<p class="tip">Aliasing `createElement` to `h` is a common convention you'll see in the Vue ecosystem and is actually required for JSX. Starting with [version 3.4.0](https://github.com/vuejs/babel-plugin-transform-vue-jsx#h-auto-injection) of the Babel plugin for Vue, we automatically inject `const h = this.$createElement` in any method and getter (not functions or arrow functions), declared in ES2015 syntax that has JSX, so you can drop the `(h)` parameter. With prior versions of the plugin, your app would throw an error if `h` was not available in the scope.</p>

For more on how JSX maps to JavaScript, see the [usage docs](https://github.com/vuejs/jsx#installation).

## Functional Components

The anchored heading component we created earlier is relatively simple. It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's only a function with some props.

In cases like this, we can mark components as `functional`, which means that they're stateless (no [reactive data](../api/#Options-Data)) and instanceless (no `this` context). A **functional component** looks like this:

``` js
Vue.component('my-component', {
  functional: true,
  // Props are optional
  props: {
    // ...
  },
  // To compensate for the lack of an instance,
  // we are now provided a 2nd context argument.
  render: function (createElement, context) {
    // ...
  }
})
```

> Note: in versions before 2.3.0, the `props` option is required if you wish to accept props in a functional component. In 2.3.0+ you can omit the `props` option and all attributes found on the component node will be implicitly extracted as props.

In 2.5.0+, if you are using [single-file components](single-file-components.html), template-based functional components can be declared with:

``` html
<template functional>
</template>
```

Everything the component needs is passed through `context`, which is an object containing:

- `props`: An object of the provided props
- `children`: An array of the VNode children
- `slots`: A function returning a slots object
- `scopedSlots`: (2.6.0+) An object that exposes passed-in scoped slots. Also exposes normal slots as functions.
- `data`: The entire [data object](#The-Data-Object-In-Depth), passed to the component as the 2nd argument of `createElement`
- `parent`: A reference to the parent component
- `listeners`: (2.3.0+) An object containing parent-registered event listeners. This is an alias to `data.on`
- `injections`: (2.3.0+) if using the [`inject`](../api/#provide-inject) option, this will contain resolved injections.

After adding `functional: true`, updating the render function of our anchored heading component would require adding the `context` argument, updating `this.$slots.default` to `context.children`, then updating `this.level` to `context.props.level`.

Since functional components are just functions, they're much cheaper to render. However, the lack of a persistent instance means they won't show up in the [Vue devtools](https://github.com/vuejs/vue-devtools) component tree.

They're also very useful as wrapper components. For example, when you need to:

- Programmatically choose one of several other components to delegate to
- Manipulate children, props, or data before passing them on to a child component

Here's an example of a `smart-list` component that delegates to more specific components, depending on the props passed to it:

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

### Passing Attributes and Events to Child Elements/Components

On normal components, attributes not defined as props are automatically added to the root element of the component, replacing or [intelligently merging with](class-and-style.html) any existing attributes of the same name.

Functional components, however, require you to explicitly define this behavior:

```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // Transparently pass any attributes, event listeners, children, etc.
    return createElement('button', context.data, context.children)
  }
})
```

By passing `context.data` as the second argument to `createElement`, we are passing down any attributes or event listeners used on `my-functional-button`. It's so transparent, in fact, that events don't even require the `.native` modifier.

If you are using template-based functional components, you will also have to manually add attributes and listeners. Since we have access to the individual context contents, we can use `data.attrs` to pass along any HTML attributes and `listeners` _(the alias for `data.on`)_ to pass along any event listeners.

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

You may wonder why we need both `slots()` and `children`. Wouldn't `slots().default` be the same as `children`? In some cases, yes - but what if you have a functional component with the following children?

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

For this component, `children` will give you both paragraphs, `slots().default` will give you only the second, and `slots().foo` will give you only the first. Having both `children` and `slots()` therefore allows you to choose whether this component knows about a slot system or perhaps delegates that responsibility to another component by passing along `children`.

## Template Compilation

You may be interested to know that Vue's templates actually compile to render functions. This is an implementation detail you usually don't need to know about, but if you'd like to see how specific template features are compiled, you may find it interesting. Below is a little demo using `Vue.compile` to live-compile a template string:

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
