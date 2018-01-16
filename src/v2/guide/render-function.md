---
title: Các hàm render & JSX
type: guide
order: 303
---

## Cơ bản

Trong đại đa số các trường hợp, Vue khuyến khích sử dụng template để xây dựng HTML. Tuy nhiêu có một số trường hợp bạn cần dùng đến sức mạnh của JavaScript. Những lúc này bạn có thể dùng **hàm render** (render function), một giải pháp gần hơn với trình biên dịch, để thay thế cho template.

Chúng ta hãy xem một ví dụ đơn giản trong đó một hàm `render` trở nên hữu ích. Chẳng hạn, bạn muốn tạo các tiêu đề `h1`, `h2`, `h3`… chứa liên kết, như sau:

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

Từ đoạn HTML trên, bạn quyết định tạo một giao diện component như sau:

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

Khi bắt đầu với một component chỉ tạo thẻ tiêu đề dựa trên prop `level` được truyền vào, bạn sẽ nhanh chóng đi đến một kết quả trông như thế này:

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

Rõ ràng đây không phải là một template tốt. Chẳng những nó quá rườm rà, mà ở đây chúng ta còn lặp lại `<slot></slot>` cho mỗi level, và lại phải thực hiện một quá trình tương tự khi thêm phần tử `<a>`. Vì thế, hay thử viết lại với một hàm `render`:

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tên thẻ
      this.$slots.default // mảng các phần tử con
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

Đơn giản hơn nhiều! Đại để thế. Code trở nên ngắn hơn, nhưng cũng đòi hỏi bạn phải quen thuộc hơn với các thuộc tính của đối tượng Vue. Trong trường hợp này, bạn phải biết rằng khi truyền các phần tử con không có thuộc tính `slot` vào trong một component, ví dụ `Hello world!` trong `anchored-heading`, các phần tử con này được chứa trong đối tượng component tại `$slots.default`. Chúng tôi khuyên bạn **nên đọc về [các API của các thuộc tính của đối tượng Vue](../api/#Thuoc-tinh-cua-doi-tuong) trước khi đi sâu nghiên cứu về các hàm render**.

## Node, tree, và virtual DOM

Trước khi đi sâu vào các hàm render, ít nhiều kiến thức về cách hoạt động của trình duyệt là rất quan trọng. Ví dụ chúng ta có đoạn HTML sau:

```html
<div>
  <h1>Bài đồng dao</h1>
  Năm mới năm me
  <!-- TODO: Hoàn thành bài đồng dao -->
</div>
```

Khi đọc đoạn code này, trình duyệt sẽ xây dựng cấu trúc dạng cây (DOM tree) bao gồm các ["DOM node"](https://javascript.info/dom-nodes) để giúp quản lí mọi thứ, tương tự như việc bạn xây dựng một cây gia phả để giữ thông tin về mọi người trong dòng họ vậy.

Cấu trúc cây của đoạn HTML trên sẽ giống như sau:

![Sơ đồ DOM tree](/images/dom-tree.png)

Mỗi phần tử trên DOM tree là một node. Mỗi text là một node. Ngay cả comment cũng là node! Một node đơn giản chỉ là một "mảnh" trên trang web. Và cũng tương tự như trong một cây gia phả, mỗi node có thể có các node con (nghĩa là một mảnh có thể chứa các mảnh khác).

Cập nhật tất cả các node này một cách hiệu quả có thể là một việc khó khăn, nhưng may thay, bạn không bao giờ phải làm việc này một cách thủ công. Thay vào đó, chỉ cần báo cho Vue biết bạn muốn có HTML gì trên trang, trong một template:

```html
<h1>{{ blogTitle }}</h1>
```

hoặc trong một hàm render:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

Và trong cả hai trường hợp, Vue sẽ tự động giữ cho trang web được cập nhật, ngay cả khi `blogTitle` thay đổi.

### Virtual DOM

Vue làm được điều này nhờ vào việc xây dựng một **virtual DOM** (DOM ảo) để theo dõi tất cả những thay đổi cần thực hiện đối với DOM thật. Bạn hãy nhìn kĩ dòng này:

``` js
return createElement('h1', this.blogTitle)
```

Lệnh `createElement` ở đây thực chất là đang trả về cái gì? _Không hẳn_ là một element (phần tử) DOM thật sự. Nếu nói cho đúng, chúng ta có thể đặt lại tên cho hàm này một cách chính xác hơn là `tạoMôTảChoNode`, vì nó chứa những thông tin mô tả node mà Vue cần biết để render, bao gồm cả mô tả cho các node con. Chúng ta gọi mô tả này là một "virtual node" (node ảo), thường viết tắt là **VNode**. "Virtual DOM" là tên của toàn bộ một cây các VNode, được xây dựng từ một cây các component Vue.

## Các tham số của `createElement`

Điều tiếp theo mà bạn cần thông thạo là cách dùng các tính năng của template trong hàm `createElement`. Đây là danh sách các tham số mà `createElement` nhận:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Một tên thẻ HTML, các tùy chọn cho component, hoặc một hàm
  // trả về một trong những thứ này. Bắt buộc.
  'div',

  // {Object}
  // Một "data object" chứa dữ liệu tương ứng với các thuộc tính
  // mà bạn muốn dùng trong một template. Không bắt buộc.
  {
    // (Xem chi tiết ở phần tiếp theo bên dưới)
  },

  // {String | Array}
  // Các VNode con, được tạo ra bằng cách dùng `createElement()`,
  // hoặc dùng chuỗi để tạo các 'text VNode'. Không bắt buộc.
  [
    'Một ít text trước.',
    createElement('h1', 'Một tiêu đề'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### Chi tiết về data object

Một điểm cần lưu ý: tương tự với việc được [đối xử đặc biệt](class-and-style.html) trong template, `v-bind:class` và `v-bind:style` cũng có các field (trường) riêng ở top-level (cấp cao nhất) trong data object của VNode. Object này cũng cho phép bạn bind (ràng buộc) các thuộc tính HTML thông thường cũng như các thuộc tính DOM như `innerHTML` (thay thế cho directive `v-html`):

``` js
{
  // Có cùng API với `v-bind:class`
  'class': {
    foo: true,
    bar: false
  },
  // Có cùng API với `v-bind:style`
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Các thuộc tính HTML thông thường
  attrs: {
    id: 'foo'
  },
  // Các prop cho component
  props: {
    myProp: 'bar'
  },
  // Các thuộc tính DOM
  domProps: {
    innerHTML: 'baz'
  },
  // Các hàm xử lí sự kiện được lồng vào bên trong `on`,
  // tuy rằng modifier (như trong `v-on:keyup.enter`) không được
  // hỗ trợ. Thay vào đó, bạn sẽ phải tự kiểm tra keyCode bên
  // trong hàm.
  on: {
    click: this.clickHandler
  },
  // Chỉ dành riêng cho component. Cho phép bạn lắng nghe các
  // sự kiện native, thay vì các sự kiện được phát ra từ component
  // bằng cách sử dụng `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Các directive tùy biến. Lưu ý là bạn không thể gán giá trị
  // `oldValue`, vì Vue sẽ tự động quản lí giá trị này thay bạn.
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
  // Các scoped slot dưới dạng
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // Tên của slot, nếu component này là con của một component khác
  // child of another component
  slot: 'name-of-slot',
  // Các thuộc tính top-level khác
  key: 'myKey',
  ref: 'myRef'
}
```

### Ví dụ hoàn chỉnh

Với kiến thức đã học, bây giờ chúng ta đã có thể viết nốt component trên đây:

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
    // tạo id với kebabCase
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^\-|\-$)/g, '')

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

### Một số hạn chế

#### VNode phải là duy nhất

Tất cả các VNode trong cây component phải là duy nhất. Điều này có nghĩa là hàm render sau đây không hợp lệ:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Hai VNode này trùng nhau!
    myParagraphVNode, myParagraphVNode
  ])
}
```

Nếu thật sự muốn dùng cùng một phần tử hoặc component nhiều lần, bạn có thể dùng một hàm factory. Ví dụ, hàm render sau đây là một cách hoàn toàn hợp lệ để render 18 phần tử `<p>` giống nhau:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 18 }).map(function () {
      return createElement('p', 'Hùng Vương')
    })
  )
}
```

## Thay thế các tính năng của template bằng JavaScript đơn thuần

### `v-if` và `v-for`

Bất cứ khi nào một việc gì đó có thể làm được dễ dàng bằng JavaScript đơn thuần, các hàm render của Vue đều _không_ cung cấp một giải pháp thay thế chuyên biệt. Ví dụ, trong một template có sử dụng `v-if` và `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>Không tìm thấy kết quả nào.</p>
```

Ví dụ này có thể được viết lại với `if`/`else` và `map` của JavaScript trong một hàm render:

``` js
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'Không tìm thấy kết quả nào.')
  }
}
```

### `v-model`

Vue không cung cấp tính năng thay thế cho `v-model` trong các hàm render - bạn sẽ phải tự phát triển logic này:

``` js
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.value = event.target.value
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

Đây là cái giá cho việc viết code ở cấp thấp – tuy nhiên bù vào đó thì bạn có gần như toàn quyền điều khiển các tương tác nếu so sánh với `v-model`.

### Event và key modifier

Đối với các [event modifier](events.html#Event-modifier) `.passive`, `.capture` và `.once`, Vue cung cấp các prefix (tiền tố) có thể sử dụng với `on`:

| Modifier | Prefix |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` hoặc<br>`.once.capture` | `~!` |

Ví dụ:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  `~!mouseover`: this.doThisOnceInCapturingMode
}
```

Đối với tất cả các event và key modifier khác, một prefix chuyên biệt là không cần thiết vì bạn có thể dùng các phương thức sự kiện bên trong hàm xử lí:

| Modifier | Giải pháp tương đương trong hàm xử lí |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Phím:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (thay `13` bằng [một mã phím khác](http://keycode.info/) đối với các modifier khác) |
| Modifier cho phím:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (thay `ctrlKey` bằng `altKey`, `shiftKey`, hoặc `metaKey` tương ứng) |

Đây là một ví dụ dùng tất cả các modifier trên cùng một lúc:

```javascript
on: {
  keyup: function (event) {
    // Dừng thực thi nếu phần tử đang phát ra sự kiện
    // không phải là phần tử được bind sự kiện
    if (event.target !== event.currentTarget) return
    // Dừng thực thi nếu phím đang được thả không phải là
    // enter (13) và người dùng không đồng thời nhấn shift
    if (!event.shiftKey || event.keyCode !== 13) return
    // Ngừng lan truyền sự kiện
    event.stopPropagation()
    // Chặn hàm xử lí keyup mặc định dành cho phần tử hiện hành
    event.preventDefault()
    // ...
  }
}
```

### Slot

Bạn có thể truy xuất đến các nội dung tĩnh của [slot](components.html#Phan-bo-noi-dung-voi-slot) dưới dạng các mảng VNode thông qua [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

và truy xuất đến các [scoped slot](components.html#Scoped-slot) dưới dạng các hàm trả về VNode thông qua [`this.$scopedSlots`](../api/#vm-scopedSlots):

``` js
render: function (createElement) {
  // `<div><slot :text="msg"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.msg
    })
  ])
}
```

Để truyền các scoped slot vào một component con bằng hàm render, dùng trường `scopeSlots` trong dữ liệu của VNode:

``` js
render (createElement) {
  return createElement('div', [
    createElement('child', {
      // truyền `scopedSlots` trong object dữ liệu dưới dạng
      // { name: props => VNode | Array<VNode> }
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

Nếu dùng nhiều hàm `render`, có lẽ bạn sẽ cảm thấy khá cực nhọc khi phải viết những đi viết lại những dòng code như thế này:

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

Nhất là khi nếu dùng template thì đơn giản hơn nhiều:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

Đó là lí do Vue cung cấp một [plugin dành cho Babel](https://github.com/vuejs/babel-plugin-transform-vue-jsx) để dùng JSX với Vue, giúp chúng ta quay lại sử dụng một cú pháp gần gũi hơn với template:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Dùng `h` thay cho `createElement` là một quy ước thông dụng trong hệ sinh thái của Vue, đồng thời là bắt buộc đối với JSX. Nếu `h` không tồn tại trong scope, ứng dụng của bạn sẽ xảy ra lỗi.</p>

Để biết thêm chi tiết về cách thức đối chiếu từ JSX sang JavaScript, hãy [đọc kĩ hướng dẫn sử dụng trước khi dùng](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Functional component

Component mà ta vừa viết còn khá đơn giản - nó không quản lí trạng thái, không theo dõi trạng thái được truyền vào, và không có bất kì phương thức vòng đời (life-cycle method) nào. Thật sự nó chỉ là một hàm với vài thuộc tính (prop).

Trong những trường hợp như thế, ta có thể đánh dấu component là `functional`. Một functional component (component thuần chức năng) không có trạng thái (stateless – không có `data`), không có đối tượng (instanceless – không có ngữ cảnh `this`), và trông như thế này:

``` js
Vue.component('my-component', {
  functional: true,
  // Để bù cho việc thiếu một đối tượng, một tham số `context`
  // được truyền vào, tham chiếu đến ngữ cảnh hiện tại.
  render: function (createElement, context) {
    // ...
  },
  // Props là không bắt buộc
  props: {
    // ...
  }
})
```

> Trong các phiên bản trước 2.3.0, tùy chọn `props` là bắt buộc nếu bạn muốn nhận props trong một functional component. Từ phiên bản 2.3.0 trở về sau, bạn có thể bỏ qua tùy chọn `props`, và khi đó tất cả các thuộc tính tìm thấy trên component node sẽ được trích xuất ngầm thành props.

Từ bản 2.5.0 trở đi, nếu bạn đang dùng [single-file component](single-file-components.html), functional component dựa trên template có thể được khai báo như sau:

```js
<template functional>
</template>
```

Mọi thứ mà component cần được truyền vào thông qua `context`, một object chứa:

- `props`: Một object chứa các prop được cung cấp
- `children`: Một mảng các VNode con
- `slots`: Một hàm trả về một object chứa các slot
- `data`: Toàn bộ object data truyền vào component
- `parent`: Trỏ đến component cha
- `listeners`: (2.3.0+) Một object chứa các hàm lắng nghe sự kiện được đăng kí ở component cha. Đây là một tên khác của `data.on`.
- `injections`: (2.3.0+) Chứa các injection đã được resolve (phân giải), nếu sử dụng tùy chọn [`inject`](../api/#provide-inject)

Sau khi thêm `functional: true` vào component `AnchorHeading`, chúng ta cần thêm những thay đổi sau đây vào hàm render của component này: thêm tham số  `context`, thay `this.$slots.default` bằng `context.children`, và thay `this.level` bằng `context.props.level`.

Vì chỉ là hàm đơn thuần, việc render các functional component ít tốn kém nhiều so với component thông thường. Tuy nhiên, việc thiếu một đối tượng bền vững (persistent instance) nghĩa là bạn sẽ không thấy được functional component trong cây component của [Vue devtools](https://github.com/vuejs/vue-devtools).

Functional component cũng rất hữu dụng trong vai trò wrapper component. Ví dụ, khi bạn cần:

- Chọn một trong số vài component khác thông qua code để delegate (ủy nhiệm)
- Chỉnh sửa các phần tử con, props, hoặc data trước khi truyền vào một component con

Sau đây là một ví dụ về một component `smart-list`, component này đóng vai trò "delegate" cho các component cụ thể hơn dựa trên các prop được truyền vào:

``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
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
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  }
})
```

### So sánh giữa `slots()` và `children`

Bạn có thể tự hỏi tại sao chúng ta lại cần cả hai `slots()` và `children`. Chẳng phải `slots().default` và `children` là như nhau hay sao? Trong một số trường hợp thì điều này là đúng, tuy nhiên hãy xem một functional component với các phần tử con như sau:

``` html
<my-functional-component>
  <p slot="foo">
    thứ nhất
  </p>
  <p>thứ hai</p>
</my-functional-component>
```

Trong component này, `children` sẽ chứa cả hai phần tử `<p>`, `slots().default` chỉ chứa phần tử thứ hai, và`slots().foo` chỉ chứa phần tử thứ nhất. Việc có cả hai `children` và `slots()` vì vậy sẽ cho phép bạn quyết định component này có biết về hệ thống slot hay không, hoặc có thể giao phó trách nhiệm này cho một component khác bằng cách truyền `children`.

## Biên dịch template

Có thể bạn muốn biết là các template của Vue thật ra là được biên dịch thành các hàm render. Đây là một chi tiết kĩ thuật nâng cao mà thông thường có lẽ bạn không cần phải quan tâm đến, tuy nhiên nếu muốn xem các tính năng template cụ thể được biên dịch như thế nào thì bạn có thể thấy việc đó khá thú vị. Bên dưới là một ví dụ nhỏ sử dụng `Vue.compile` để biên dịch một chuỗi template thành hàm render tại chỗ:

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render thành:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
    <pre v-if="!result.staticRenderFns.length"><code>{{ result.staticRenderFns }}</code></pre>
  </div>
  <div v-else>
    <label>Lỗi biên dịch:</label>
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
    <h1>Đây là hộp thư thoại</h1>\n\
  </header>\n\
  <p v-if="message">\n\
    Bạn có tin nhắn: {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    Không ai nhắn nhủ gì cả.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Nhập vào một template hợp lệ bên trên.'
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
