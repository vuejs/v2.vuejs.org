---
title: Giới thiệu
type: guide
order: 2
---

## Vue.js là gì?

Gọi tắt là Vue (phát âm là /vjuː/, giống như **view** trong tiếng Anh), Vue.js là một **framework linh động** (nguyên bản tiếng Anh: progressive – tiệm tiến) dùng để xây dựng giao diện người dùng (user interfaces). Khác với các framework nguyên khối (monolithic), Vue được thiết kế từ đầu theo hướng cho phép và khuyến khích việc phát triển ứng dụng theo từng bước. Khi phát triển lớp giao diện (view layer), người dùng chỉ cần dùng thư viện lõi (core library) của Vue, vốn rất dễ học và tích hợp với các thư viện hoặc dự án có sẵn. Cùng lúc đó, nếu kết hợp với những kĩ thuật hiện đại như [SFC (single file components)](single-file-components.html) và [các thư viện hỗ trợ](https://github.com/vuejs/awesome-vue#components--libraries), Vue cũng đáp ứng được dễ dàng nhu cầu xây dựng những ứng dụng một trang (SPA - Single-Page Applications) với độ phức tạp cao hơn nhiều.

Nếu bạn muốn tìm hiểu thêm về Vue, chúng tôi đã <a id="modal-player" href="#">tạo một video clip</a> về những nguyên tắc cốt lõi và một dự án mẫu.

Nếu bạn là một lập trình viên front-end giàu kinh nghiệm và muốn hiểu hơn về tương quan giữa Vue và các thư viện hay framework khác, hãy xem phần [So sánh với các framework khác](comparison.html).

## Bắt đầu

<p class="tip">Nếu bạn chưa quen với lập trình front-end, không nên bắt đầu bằng việc sử dụng một framework – hãy trang bị cho mình vốn kiến thức cơ bản trước đã. Đồng thời, nếu bạn đã có sẵn kinh nghiệm với các framework khác như React hoặc Angular thì tốt, nhưng nếu không thì cũng không sao cả.</p>

Để dùng thử Vue.js, không gì dễ hơn là bắt đầu với một [ví dụ Hello World trên JSFiddle](https://jsfiddle.net/vuejs/bc5rzva3/). Hãy mở ví dụ này trong một tab khác và làm theo những ví dụ cơ bản mà chúng tôi sẽ nhắc đến dần sau đây. Bạn cũng có thể <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html">tạo một file <code>index.html</code></a> và nhúng thư viện Vue vào:

``` html
<!-- bản phát triển (development), bao gồm những cảnh báo hữu ích trong console -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

hoặc:

``` html
<!-- bản production, được tối ưu về dung lượng và tốc độ -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Trang [Cài đặt](installation.html) sẽ cung cấp cho bạn nhiều lựa chọn hơn để cài đặt Vue. Lưu ý rằng chúng tôi **không** khuyến khích việc dùng `vue-cli` khi bạn chỉ mới bắt đầu, nhất là nếu bạn chưa quen với các công cụ xây dựng (build tools) trên nền tảng Node.js.

## Render theo hướng khai báo

Tại trung tâm của Vue.js là một hệ thống cho phép chúng ta render (kết xuất) dữ liệu lên DOM theo hướng khai báo (declarative, thay vì hướng mệnh lệnh – imperative) sử dụng một cú pháp đơn giản:

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Do you wanna build a Vue app?'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Do you wanna build a Vue app?'
  }
})
</script>
{% endraw %}

Vậy là chúng ta đã viết xong một ứng dụng bằng Vue! Tuy rằng kết quả trên đây nhìn đơn giản chỉ như render một chuỗi kí tự ra màn hình, thật sự Vue đã thực hiện khá nhiều việc đằng sau hậu trường. Dữ liệu và DOM đã được liên kết với nhau, và mọi thứ giờ đây đã trở nên **reactive** (hiểu nôm na là "phản ứng," chúng tôi sẽ giải thích sâu hơn trong các chương kế tiếp). Để kiểm chứng, hãy mở console của trình duyệt và gán cho `app.message` một giá trị khác, ví dụ `app.message = 'OK bye'`. Bạn sẽ thấy ví dụ trên thay đổi tương ứng.

Ngoài việc quản lí và chỉnh sửa văn bản, chúng ta cũng có thể bind (ràng buộc) các thuộc tính của phần tử web, như sau:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Rê chuột lên đây một vài giây để xem thuộc tính `title` được bind!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Bạn đã mở trang này vào ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Rê chuột lên đây một vài giây để xem thuộc tính `title` được bind!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Bạn đã mở trang này vào ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Thuộc tính `v-bind` mà bạn thấy trên đây được gọi là một **directive**. Một directive trong Vue được bắt đầu với `v-` để chỉ định rõ rằng đây là một thuộc tính riêng do Vue cung cấp, đồng thời thuộc tính này sẽ áp dụng một hành vi (behavior) đặc biệt lên kết quả DOM được render ra. Trong ví dụ này, directive `v-bind` về cơ bản là đang giữ thuộc tính `title` của phần tử web luôn luôn đồng nhất với property `message` của đối tượng Vue được khởi tạo.

Bây giờ nếu bạn mở console JavaScript lần nữa và nhập vào `app2.message = 'Cái gì đó khác'`, bạn sẽ thấy HTML được bind – trong trường hợp này là thuộc tính `title` – được cập nhật tương ứng.

## Điều kiện và vòng lặp

Giấu hoặc hiện một phần tử web với Vue cũng rất dễ dàng:

``` html
<div id="app-3">
  <span v-if="seen">Thoắt ẩn thoắt hiện</span>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Thoắt ẩn thoắt hiện</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Bây giờ nếu nhập `app3.seen = false` vào console, bạn sẽ thấy thông điệp trên đây biến mất.

Ví dụ này cho thấy rằng chúng ta có thể bind dữ liệu vào không chỉ văn bản và thuộc tính, mà còn cả vào **cấu trúc** của DOM. Hơn thế nữa, Vue còn cung cấp một hệ thống mạnh mẽ để áp dụng các [hiệu ứng chuyển đổi](transitions.html) khi một phần tử web được thêm vào, cập nhật, hoặc gỡ bỏ khỏi DOM.

Ngoài `v-bind` và `v-if` chúng ta còn có thêm nhiều directive nữa, với các tính năng đặc biệt khác nhau. Ví dụ, directive `v-for` có thể được dùng để trình bày một danh sách các item sử dụng dữ liệu từ một mảng:

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Học JavaScript' },
      { text: 'Học Vue' },
      { text: 'Xây dựng cái gì đó hay ho' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Học JavaScript' },
      { text: 'Học Vue' },
      { text: 'Xây dựng cái gì đó hay ho' }
    ]
  }
})
</script>
{% endraw %}

Bây giờ nếu nhập `app4.todos.push({ text: 'Nghỉ ngơi' })`, bạn sẽ thấy danh sách có thêm một mục mới.

## Xử lí thông tin đầu vào của người dùng

Để người dùng tương tác với ứng dụng, chúng ta có thể dùng directive `v-on` để đính kèm các event listener (phần tử lắng nghe sự kiện) và gọi các method (phương thức) trên đối tượng Vue.

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'qua lại khách chờ sông lặng sóng'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split(' ').reverse().join(' ')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Đảo ngược thông điệp</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'qua lại khách chờ sông lặng sóng'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split(' ').reverse().join(' ')
    }
  }
})
</script>
{% endraw %}

Nếu để ý bạn sẽ thấy trong method này chúng ta đã thay đổi trạng thái của ứng dụng (app state) mà không hề động đến DOM - mọi thao tác trên DOM đều được Vue xử lí một cách hoàn toàn tự động, và code bạn viết chỉ cần tập trung vào phần logic bên dưới.

Vue cũng cung cấp directive `v-model` giúp cho việc ràng buộc hai chiều (two-way binding) giữa form input và trạng thái ứng dụng trở nên vô cùng dễ dàng:

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hãy sửa thông điệp này'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hãy sửa thông điệp này'
  }
})
</script>
{% endraw %}

## Biên soạn với các component

Hệ thống component (phần tử cấu thành) là một khái niệm quan trọng trong Vue, vì nó cho phép chúng ta xây dựng những ứng dụng quy mô lớn được tạo thành từ những phần tử nhỏ, độc lập, và thường là tái sử dụng được. Nếu bạn để ý, gần như bất kì một loại giao diện ứng dụng nào cũng có thể được trừu tượng hóa thành một tập hợp dạng cây của các phần tử con:

![Cây phần tử](/images/components.png)

Một component trong Vue về bản chất là một đối tượng Vue với các tùy chọn cho trước. Đăng kí một component trong Vue rất đơn giản: 

``` js
// Định nghĩa một component todo-item
Vue.component('todo-item', {
  template: '<li>Đây là một đề mục todo</li>'
})
```

Giờ thì bạn có thể sử dụng component `todo-item` trong template của các component khác:

``` html
<ol>
  <!-- Tạo một đối tượng của component todo-item -->
  <todo-item></todo-item>
</ol>
```

Có điều ví dụ này chưa được thú vị cho lắm, vì các đề mục todo hiện đang giống nhau hoàn toàn. Chúng ta có thể truyền dữ liệu từ scope (phạm vi) cha vào các component con bằng cách sử dụng một [prop](components.html#Props):

``` js
Vue.component('todo-item', {
  // Ở đây chúng ta khai báo cho component todo-item 
  // nhận một "prop" (có thể hiểu là một thuộc tính tùy biến) 
  // có tên là "todo".
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Bây giờ chúng ta có thể truyền `todo` vào mỗi component bằng cách sử dụng `v-bind`:

``` html
<div id="app-7">
  <p>Những thứ họ mua:</p>
  <ol>
    <!--
      Ở đây chúng ta cung cấp một object "todo" cho mỗi component
      "todo-item". Bằng cách này nội dung của từng component trở nên động.
      Mỗi component cũng sẽ nhận một thuộc tính "key". Chúng ta sẽ
      nói thêm về thuộc tính này sau.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id">
    </todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Cà pháo' },
      { id: 1, text: 'Mắm tôm' },
      { id: 2, text: 'Miễn ăn được là được' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <p>Những thứ họ mua:</p>
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Cà pháo' },
      { id: 1, text: 'Mắm tôm' },
      { id: 2, text: 'Miễn ăn được là được' }
    ]
  }
})
</script>
{% endraw %}

Tất nhiên ví dụ trên không có nhiều ý nghĩa thực tiễn, nhưng điều quan trọng là chúng ta đã biết cách chia ứng dụng thành hai đơn vị nhỏ hơn, đồng thời phần tử con được tách rời khỏi phần tử cha và chỉ giao tiếp bằng `prop`. Bây giờ thì chúng ta đã có thể phát triển component `<todo-item>` thêm lên với nhiều template và logic phức tạp hơn mà không làm ảnh hưởng đến ứng dụng cha.

Trong một ứng dụng lớn, việc chia thành các component nhỏ hơn để dễ quản lí việc phát triển ứng dụng là rất cần thiết. Chúng ta sẽ bàn thêm nhiều về component [trong một hướng dẫn sau này](components.html), nhưng hiện tại thì bạn có thể xem một ví dụ (tưởng tượng) về một template của ứng dụng khi sử dụng components:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Mối quan hệ với Custom Element

Bạn có thể để ý thấy là component trong Vue rất giống với **Custom Element**, một phần của [chỉ dẫn kĩ thuật về Web Components](https://www.w3.org/wiki/WebComponents/). Lí do là cú pháp của component trong Vue mô phỏng theo chỉ dẫn này. Ví dụ, component trong Vue phát triển [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) và thuộc tính đặc biệt `is`. Tuy nhiên, giữa web component và Vue component có một số khác biệt mấu chốt:

1. Chỉ dẫn kĩ thuật về web component vẫn còn ở dạng sơ thảo, chưa được phát triển trong toàn bộ các trình duyệt. Ngược lại, Vue component hoạt động một cách thống nhất trên các trình duyệt được Vue hỗ trợ (từ IE9 trở lên) mà không cần polyfill. Ngoài ra, Vue component cũng có thể được gói (wrap) trong một custom element nếu cần.

2. Vue component cung cấp một số chức năng quan trọng không có trong custom element đơn thuần, trong đó đáng lưu ý nhất là quản lí luồng dữ liệu giữa các component, giao tiếp bằng các sự kiện tùy biến (custom event) và tích hợp với các công cụ xây dựng.

## Bạn đã sẵn sàng để đọc thêm chưa?

Trên đây chúng ta đã lược qua những tính năng cơ bản nhất của Vue.js. Phần còn lại của bản hướng dẫn sẽ đi sâu vào những tính năng này, đồng thời đề cập một cách chi tiết đến những tính năng cao cấp hơn. Bạn nhớ đọc cho hết và đọc cho kĩ vào nhé!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script></div>
