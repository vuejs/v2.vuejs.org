---
title: Đối tượng Vue
type: guide
order: 3
---

## Tạo một đối tượng Vue

<p class="tip">Một số tài liệu kĩ thuật ở Việt Nam dịch "instance" là "thể hiện." Chúng tôi cho rằng cách dịch này nghe rất lạ tai với người Việt, nên sẽ dịch "instance" là "đối tượng" và giữ nguyên "object" là "object" như trong bản tiếng Anh.</p>

Một ứng dụng Vue luôn được bắt đầu bằng cách khởi tạo một **đối tượng Vue** (Vue instance) sử dụng hàm `Vue`:

```js
var vm = new Vue({
  // các tùy chọn
})
```

Thiết kế của Vue chịu ảnh hưởng – mặt dù không liên kết chặt chẽ – từ pattern [MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel). Vì thế trong bản hướng dẫn này, chúng tôi quy ước sử dụng tên biến `vm` (viết tắt của ViewModel) cho một đối tượng Vue.

Khi khởi tạo một đối tượng Vue, bạn truyền vào một object **`options`** với các tùy chọn. Phần lớn bản hướng dẫn này sẽ mô tả cách sử dụng các tùy chọn đó để tạo ra behavior (hành vi) mong muốn. Bạn cũng có thể tham khảo danh sách đầy đủ các tùy chọn ở trang [API](../api/#Options-Data).

Một ứng dụng Vue bao gồm một **đối tượng Vue gốc** (**root Vue instance**) được tạo với lệnh `new Vue`. Ứng dụng này cũng thường được sắp xếp thành một cây gồm các component lồng nhau và tái sử dụng được. Ví dụ, cây component của một ứng dụng todo có thể trông như thế này:

```
Root Instance
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

Chúng ta sẽ nói chi tiết về [hệ thống component](components.html) sau. Hiện tại, bạn chỉ cần biết rằng một component Vue cũng là một đối tượng Vue và do đó cũng nhận cùng một object `options` (trừ một số tùy chọn chỉ dành riêng cho root).

## Dữ liệu và phương thức

Khi một đối tượng Vue được khởi tạo, tất cả các thuộc tính (property) được tìm thấy trong object `data` sẽ được thêm vào **reactivity system** (hiểu nôm na là "hệ thống phản ứng") của Vue. Điều này có nghĩa là view sẽ "react" (phản ứng) khi giá trị của các thuộc tính này thay đổi, và tự cập nhật tương ứng với các giá trị mới.

``` js
// Chúng ta khởi tạo một object "data"
var data = { a: 1 }

// Object này được truyền vào một đối tượng Vue
var vm = new Vue({
  data: data
})

// vm.a và data.a cùng trỏ đến một đối tượng!
vm.a === data.a // => true

// Thay đổi thuộc tính của vm cũng
// ảnh hưởng đến dữ liệu ban đầu
vm.a = 2
data.a // => 2

// ... và ngược lại
data.a = 3
vm.a // => 3
```

Khi dữ liệu thay đổi, view sẽ render lại. Cũng nên lưu ý rằng một thuộc tính trong object `data` chỉ trở nên reactive nếu nó đã tồn tại khi chúng ta khởi tạo đối tượng Vue. Có nghĩa là nếu bạn thêm vào một thuộc tính mới như sau:

``` js
vm.b = 'Aloha'
```

thì những thay đổi với `b` sẽ không kích hoạt thay đổi trên view. Vì thế, nếu bạn biết là sau này mình sẽ cần một thuộc tính nào đó nhưng khi khởi tạo Vue thì thuộc tính này là rỗng hoặc chưa tồn tại, bạn cần gán cho nó một giá trị ban đầu, ví dụ như thế này:

```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

Ngoại lệ duy nhất ở đây là việc sử dụng `Object.freeze()`. `Object.freeze()` ngăn không cho những thuộc tính sẵn có bị chỉnh sửa, cũng có nghĩa là hệ thống reactivity không thể _theo dõi_ các thay đổi xảy ra.

```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data () {
    return {
      obj
    }
  }
})
```

```html
<div id="app">
  <p>{{ obj.foo }}</p>
  <!-- obj.foo sẽ không thay đổi -->
  <button @click="obj.foo = 'baz'">Thay đổi</button>
</div>
```

Ngoài `data`, một đối tượng Vue cũng hỗ trợ một số thuộc tính và phương thức đối tượng (instance properties & methods) hữu dụng khác. Các thuộc tính và phương thức này được bắt đầu bằng kí hiệu `$` để phân biệt với thuộc tính và phương thức do người dùng định nghĩa. Ví dụ:

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch là một phương thức của đối tượng Vue
vm.$watch('a', function (newValue, oldValue) {
  // Hàm callback này sẽ được gọi khi `vm.a` thay đổi
})
```

Bạn cũng có thể tham khảo danh sách đầy đủ các thuộc tính và phương thức đối tượng trên trang [API](../api/#Instance-Properties).

## Vòng đời của đối tượng

Khi được khởi tạo, một đối tượng Vue sẽ đi qua nhiều bước khác nhau - cài đặt quan sát dữ liệu (data observation), biên dịch template, gắn kết vào DOM, cập nhật DOM khi dữ liệu thay đổi v.v. Trong suốt tiến trình này, nó cũng sẽ thực thi một số hàm gọi là **lifecycle hook**, giúp người dùng thêm code của mình vào các giai đoạn (stage) cụ thể trong vòng đời của đối tượng.

Ví dụ, hook [`created`](../api/#created) có thể được dùng để thực thi code sau khi một đối tượng được khởi tạo:

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` trỏ đến đối tượng Vue hiện hành
    console.log('giá trị của a là ' + this.a)
  }
})
// => "giá trị của a là 1"
```

Các hook khác như [`mounted`](../api/#mounted), [`updated`](../api/#updated), và [`destroyed`](../api/#destroyed) cũng được gọi vào các giai đoạn khác nhau trong vòng đời của đối tượng. Tất cả các hook này đều được thực thi với ngữ cảnh `this` trỏ đến đối tượng Vue hiện hành.

<p class="tip">Đừng dùng [hàm mũi tên (arrow functions)](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) cho các thuộc tính tùy chọn hoặc callback như là `created: () => console.log(this.a)` hoặc `vm.$watch('a', newValue => this.myMethod())`. Vì hàm mũi tên được bind vào ngữ cảnh cha (parent context), `this` sẽ không trỏ đến đối tượng Vue hiện hành. Do vậy `this.a` hoặc `this.myMethod` sẽ không trả về giá trị mà bạn mong đợi, mà thay vào đó thường là các lỗi `Uncaught TypeError: Cannot read property of undefined` hoặc `Uncaught TypeError: this.myMethod is not a function`.</p>

## Sơ đồ vòng đời

Dưới đây là sơ đồ vòng đời của một đối tượng Vue. Ngay lúc này thì bạn chưa cần hiểu mọi thứ trong đây, nhưng dần dần về sau khi bạn học và xây dựng thêm với Vue, sơ đồ này sẽ là một nguồn tham khảo rất hữu ích.

![Vòng đời của một đối tượng Vue](/images/lifecycle.png)
