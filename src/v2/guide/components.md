---
title: Cơ bản về component
type: guide
order: 11
---

## Ví dụ cơ bản

Đây là ví dụ về một component trong Vue:

``` js
// Định nghĩa một component với tên là "button-counter"
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">Bạn đã bấm {{ count }} lần.</button>'
})
```

Component là các đối tượng Vue có thể sử dụng lại được với một cái tên: trong trường hợp này là `<button-counter>`. Chúng ta có thể dùng component này như là một phần tử bên trong đối tượng Vue gốc được tạo bởi `new Vue`:

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
new Vue({ el: '#components-demo' })
```

{% raw %}
<div id="components-demo" class="demo">
  <button-counter></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">Bạn đã bấm {{ count }} lần.</button>'
})
new Vue({ el: '#components-demo' })
</script>
{% endraw %}

Vì là những đối tượng Vue tái sử dụng được, các component cùng nhận các tùy chọn như `new Vue`, ví dụ `data`, `computed`, `watch`, `methods`, và các hook vòng đời. Các ngoại lệ duy nhất là một số ít tùy chọn đặc biệt cho root như `el`.

## Tái sử dụng component

Bạn có thể tái sử dụng component bao nhiêu lần tùy ý:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

{% raw %}
<div id="components-demo2" class="demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
<script>
new Vue({ el: '#components-demo2' })
</script>
{% endraw %}

Để ý là khi bấm các nút trên đây, mỗi nút giữ một giá trị `count` riêng hoàn toàn tách biệt. Điều này là vì mỗi khi bạn dùng một component, một **đối tượng** của component đó được tạo mới.

### `data` phải là một hàm

Bạn có thể cũng đã để ý thấy rằng khi định nghĩa component `<button-counter>`, chúng ta không truyền thẳng một object vào `data` như thế này:

```js
data: {
  count: 0
}
```

Thay vào đó, **tùy chọn `data` của component phải là một hàm**. Bằng cách này, mỗi đối tượng của component có thể duy trì một bản sao riêng biệt của đối tượng data được trả về:

```js
data: function () {
  return {
    count: 0
  }
}
```

Nếu Vue không có quy tắc này, bấm một nút sẽ ảnh hưởng đến dữ liệu của _toàn bộ các đối tượng khác_, như thế này:

{% raw %}
<div id="components-demo3" class="demo">
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
</div>
<script>
var buttonCounter2Data = {
  count: 0
}
Vue.component('button-counter2', {
  data: function () {
    return buttonCounter2Data
  },
  template: '<button v-on:click="count++">Bạn đã bấm {{ count }} lần.</button>'
})
new Vue({ el: '#components-demo3' })
</script>
{% endraw %}

## Tổ chức component

Một ứng dụng thường được tổ chức dưới dạng một cây component lồng nhau:

![Cây component](/images/components.png)

Ví dụ, bạn có thể có các component cho header, sidebar, khu vực nội dung, mỗi component này lại chứa các component dành cho trình đơn, blog post, vân vân.

Để có thể được sử dụng trong các template, component phải được đăng kí. Có hai cách đăng kí component: **toàn cục** và **cục bộ**. Trên đây chúng ta chỉ mới đăng kí component ở cấp toàn cục với `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... tùy chọn ...
})
```

Component đăng kí ở cấp toàn cục có thể được dùng trong template của bất kì đối tượng Vue gốc (`new Vue`) nào được tạo ra sau đó -- và trong tất cả các component con trên cây component của đối tượng đó.

Hiện giờ thì đó là tất cả những gì bạn cần biết về đăng kí component, nhưng sau khi đọc xong trang này và hiểu thêm về component, bạn nên quay lại và đọc bản hướng dẫn đầy đủ về [đăng kí component](dang-ki-component.html).

## Truyền dữ liệu xuống component con bằng prop

Trên đây chúng ta có nhắc đến việc tạo component cho các bài viết trên blog. Vấn đề là, component không có ích gì nếu không có dữ liệu truyền vào, ví dụ tựa đề và nội dung của bài đăng. Đó là lúc chúng ta cần đến prop.

Prop là các thuộc tính tùy chỉnh mà bạn có thể đăng kí trên một component. Khi một giá trị được truyền vào một prop, nó trở thành một "_prop_erty" của đối tượng component đó. Để truyền tựa đề (`title`) vào component bài viết (`blog-post`), chúng ta sử dụng tùy chọn `props`:

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

Một component có thể có bao nhiêu prop tùy ý, và prop có thể nhận bất kì giá trị gì. Trong template trên đây, bạn có thể thấy là chúng ta có thể truy xuất giá trị này trên đối tượng component, giống như với `data`.

Một khi prop đã được đăng kí, bạn có thể truyền dữ liệu vào như một thuộc tính tùy chỉnh, ví dụ:

```html
<blog-post title="Giới thiệu về Vue"></blog-post>
<blog-post title="Các khái niệm trong Vue"></blog-post>
<blog-post title="Vue căn bản và vô cùng nâng cao"></blog-post>
```

{% raw %}
<div id="blog-post-demo" class="demo">
  <blog-post1 title="Giới thiệu về Vue"></blog-post1>
  <blog-post1 title="Các khái niệm trong Vue"></blog-post1>
  <blog-post1 title="Vue căn bản và vô cùng nâng cao"></blog-post1>
</div>
<script>
Vue.component('blog-post1', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#blog-post-demo' })
</script>
{% endraw %}

Tuy nhiên, trong một ứng dụng điển hình, bạn có lẽ sẽ có một mảng các bài viết trong `data`:

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'Giới thiệu về Vue' },
      { id: 2, title: 'Các khái niệm trong Vue' },
      { id: 3, title: 'Vue căn bản và vô cùng nâng cao' }
    ]
  }
})
```

và sau đó render một component cho mỗi bài viết:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

Trên đây, bạn có thể thấy là chúng ta dùng `v-bind` để truyền động prop. Cách làm này đặc biệt hữu ích khi bạn không biết trước được chính xác nội dung bạn sẽ render, như khi [lấy bài viết từ một API](https://jsfiddle.net/chrisvfritz/sbLgr0ad).

Hiện giờ thì đó là tất cả những gì bạn cần biết về prop, nhưng sau khi đọc xong trang này và hiểu thêm về component, bạn nên quay lại và đọc bản hướng dẫn đầy đủ về [prop](component-prop.html).

## Một phần tử gốc đơn lập

Khi xây dựng component `<blog-post>` cho bài viết, thế nào rồi template của bạn cũng sẽ chứa nhiều thứ hơn là mỗi  `title`. Ít nhất bạn cũng sẽ có thêm nội dung bài viết: 

```html
<h3>{{ post.title }}</h3>
<div v-html="post.content"></div>
```

Nhưng nếu bạn sử dụng template này, Vue sẽ thông báo lỗi **every component must have a single root element** (mỗi component phải có một phần tử gốc đơn lập). Bạn có thể sửa lỗi này bằng cách bọc template trong một phần tử cha, ví dụ:

```html
<div class="blog-post">
  <h3>{{ post.title }}</h3>
  <div v-html="post.content"></div>
</div>
```

## Gửi thông tin đến đối tượng cha bằng sự kiện

Khi xây dựng component `<blog-post>`, một số tính năng có thể cần giao tiếp ngược lên đối tượng cha. Ví dụ, chúng ta muốn thêm tính năng phóng to font chữ của bài viết mà vẫn giữ nguyên các thành phần khác trên trang. 

Chúng ta có thể hỗ trợ tính năng này bằng cách thêm thuộc tính `postFontSize` trong `data` của đối tượng cha:

```js
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [/* ... */],
    postFontSize: 1
  }
})
```

Thuộc tính này có thể được dùng trong template để quản lí cỡ chữ của tất cả các bài viết:

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
    ></blog-post>
  </div>
</div>
```

Bây giờ hãy thêm một nút để tăng cỡ chữ ngay trước nội dung của mỗi bài viết:

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button>
        Phóng to
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
```

<p class="tip">Ví dụ trên đây và một số ví dụ tiếp theo sử dụng [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) để giúp template nhiều dòng dễ đọc hơn. Tính năng này không hoạt động trên Internet Explorer (IE), vì thế nếu phải hỗ trợ IE và không sử dụng các thư viện hoặc ngôn ngữ biên dịch (như Babel hoặc TypeScript), bạn có thể dùng [dấu chéo ngược](https://css-tricks.com/snippets/javascript/multiline-string-variables-in-javascript/) thay thế.</p>

Tuy nhiên, nút này hiện không làm gì cả:

```html
<button>
  Phóng to
</button>
```

Khi nút Phóng to được bấm, chúng ta muốn yêu cầu đối tượng cha phóng to cỡ chữ của tất cả các bài viết. May thay, các đối tượng Vue cung cấp một hệ thống sự kiện tùy biến để giải quyết vấn đề này. Để phát ra (emit) một sự kiện, chúng ta có thể gọi phương thức [**`$emit`**](../api/#Cac-phuong-thuc-su-kien-cua-doi-tuong) cho sẵn và truyền vào tên của sự kiện:

```html
<button v-on:click="$emit('enlarge-text')">
  Phóng to
</button>
```

Sau đó trong component `<blog-post>`, chúng ta có thể lắng nghe sự kiện này bằng `v-on` giống như với các sự kiện DOM:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

{% raw %}
<div id="blog-posts-events-demo" class="demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
      v-on:enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
<script>
Vue.component('blog-post', {
  props: ['post'],
  template: '\
    <div class="blog-post">\
      <h3>{{ post.title }}</h3>\
      <button v-on:click="$emit(\'enlarge-text\')">\
        Phóng to\
      </button>\
      <div v-html="post.content"></div>\
    </div>\
  '
})
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    postFontSize: 1,
    posts: [
      { id: 1, title: 'Giới thiệu về Vue', content: '...nội dung...' },
      { id: 2, title: 'Các khái niệm trong Vue', content: '...nội dung...' },
      { id: 3, title: 'Vue cơ bản và vô cùng nâng cao', content: '...nội dung...' }
    ],
  }
})
</script>
{% endraw %}

### Gửi giá trị khi phát ra sự kiện

Đôi khi bạn cần gửi một giá trị cụ thể nào đó kèm với một sự kiện. Ví dụ, chúng ta có thể cho `<blog-post>` quyền quyết định mức độ phóng đại của cỡ chũ. Trong những trường hợp này, ta có thể dùng tham số thứ hai của `$emit`:

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Phóng to
</button>
```

Sau đó, khi lắng nghe sự kiện này ở đối tượng cha, chúng ta có thể truy xuất đến giá trị của sự kiện được phát ra với `$event`:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

Hoặc, nếu đó là một phương thức xử lí sự kiện: 

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

thì giá trị sẽ được truyền vào dưới dạng tham số đầu tiên của phương thức đó:

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Sử dụng `v-model` với component

Các sự kiện tùy biến có thể được sử dụng để tạo ra các `<input>` tùy biến hoạt động với `v-model`. Nhớ rằng:

```html
<input v-model="searchText">
```

là hoàn toàn tương đồng với:

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

Khi sử dụng trên một component, `v-model` là tương đồng với:

```html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

Tuy nhiên để hoạt động được, phần tử `<input>` trong component phải:

- Ràng buộc thuộc tính `value` với một prop `value`
- Trong sự kiện `input`, phát ra sự kiện `input` tùy biến với giá trị mới

Một đoạn code hoàn chỉnh nhìn tương tự như thế này: 

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)
    >
  `
})
```

Giờ thì `v-model` sẽ hoạt động ổn thỏa:

```html
<custom-input v-model="searchText"></custom-input>
```

Hiện giờ thì đó là tất cả những gì bạn cần biết về các sự kiện tùy biến của component, nhưng sau khi đọc xong trang này và hiểu thêm về component, bạn nên quay lại và đọc bản hướng dẫn đầy đủ về [sự kiện tùy biến](su-kien-tuy-bien-cua-component.html).

## Phân phối nội dung với slot

Cũng như đối với các phần tử HTML, việc có thể truyền nội dung vào một component thường là rất hữu ích, ví dụ:

``` html
<alert-box>
  Đã xảy ra cái gì gì đó.
</alert-box>
```

có thể render thành:

{% raw %}
<div id="slots-demo" class="demo">
  <alert-box>
    Đã xảy ra cái gì gì đó.
  </alert-box>
</div>
<script>
Vue.component('alert-box', {
  template: '\
    <div class="demo-alert-box">\
      <strong>Lỗi!</strong>\
      <slot></slot>\
    </div>\
  '
})
new Vue({ el: '#slots-demo' })
</script>
<style>
.demo-alert-box {
  padding: 10px 20px;
  background: #f3beb8;
  border: 1px solid #f09898;
}
</style>
{% endraw %}

Việc này là rất đơn giản với phần tử tùy biến `<slot>` của Vue:

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Lỗi!</strong>
      <slot></slot>
    </div>
  `
})
```

Như bạn đã thấy trên đây, chúng ta chỉ cần thêm `<slot>` vào nơi cần thể hiện nội dung, và thế là xong!

Hiện giờ thì đó là tất cả những gì bạn cần biết về slot, nhưng sau khi đọc xong trang này và hiểu thêm về component, bạn nên quay lại và đọc bản hướng dẫn đầy đủ về [slot trong component](slot-trong-component.html).

## Component động

Đôi khi bạn muốn chuyển qua lại giữa các component, ví dụ như trên một giao diện tab:

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab.key"
    class="dynamic-component-demo-tab-button"
    v-bind:class="{ 'dynamic-component-demo-tab-button-active': tab.key === currentTabKey }"
    v-on:click="currentTabKey = tab.key"
  >
    {{ tab.label }}
  </button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-home', { template: '<div>Component Trang chủ</div>' })
Vue.component('tab-posts', { template: '<div>Component Bài viết</div>' })
Vue.component('tab-archive', { template: '<div>Component Lưu trữ</div>' })
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTabKey: 'home',
    tabs: [
        { key: 'home', label: 'Trang chủ' },
        { key: 'posts', label: 'Bài viết' },
        { key: 'archive', label: 'Lưu trữ' }
    ]
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTabKey.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
  outline: none;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
{% endraw %}

Ví dụ trên hoạt động nhờ thuộc tính đặc biệt `is` của một component trong Vue:

```html
<!-- Component thay đổi khi currentTabComponent thay đổi -->
<component v-bind:is="currentTabComponent"></component>
```

Trong ví dụ trên, `currentTabComponent` có thể chứa:

- tên của một component đã được đăng kí, hoặc
- object chứa các tùy chọn của một component

Bạn có thể xem và thử thay đổi mã nguồn của ví dụ trên trên [JSFiddle](https://jsfiddle.net/phanan/tekvxocw/). Bạn cũng có thể dùng [phiên bản này](https://jsfiddle.net/phanan/8xg6n73r/) để xem ví dụ về cách ràng buộc vào object tùy chọn thay vì tên của component.

Hiện giờ thì đó là tất cả những gì bạn cần biết về component động, nhưng sau khi đọc xong trang này và hiểu thêm về component, bạn nên quay lại và đọc bản hướng dẫn đầy đủ về [component động và không đồng bộ](component-dong-va-khong-dong-bo.html).

## Lưu ý về việc parse DOM template

Bên trong các phần tử như `<ul>`, `<ol>`, `<table>` và `<select>` chúng ta chỉ có thể chứa một số phần tử nhất định (chẳng hạn `<ul>` chỉ chấp nhận `<li>`), trong khi đó các phần tử như `<option>` lại chỉ có thể được đặt trong một số phần tử nhất định khác như `<select>`, `<optgroup>`, hay `<datalist>`.

Điều này sẽ dẫn đến một số vấn đề khi dùng component với các phần tử có những hạn chế vừa nêu, ví dụ:

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Ở đây component `<blog-post-row>` sẽ bị xem là một phần tử không hợp lệ bên trong `<table>` và bị đẩy ra ngoài (hoisted out), dẫn đến lỗi khi render. Để giải quyết vấn đề này, ta có thể dùng thuộc tính đặc biệt `is`:

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

Cũng nên lưu ý rằng **hạn chế này _không_ tồn tại nếu bạn sử dụng template dạng chuỗi từ một trong các nguồn sau**:

* Template dạng chuỗi, ví dụ `template: '...'`
* [Single file component](single-file-components.html)
* `<script type="text/x-template">`

Hiện giờ thì đó là tất cả những gì bạn cần biết về những lưu ý khi parse DOM template – và cũng là phần cuối của _Cơ bản về component_. Vẫn còn rất nhiều thứ khác để tìm hiểu, nhưng trước tiên bạn nên giải lao một chút và tạo ra cái gì đó vui vui với Vue. Sau khi đã hài lòng với những gì mình học được, bạn hãy quay lại và đọc các hướng dẫn đầy đủ và chuyên sâu hơn về component.

