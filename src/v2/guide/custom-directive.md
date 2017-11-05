---
title: Directive tùy biến
type: guide
order: 302
---

## Giới thiệu

Bên cạnh những directive được cung cấp mặc định (`v-model` và `v-show`), Vue cũng cho phép bạn đăng kí các directive tùy biến của riêng mình. Lưu ý là trong phiên bản Vue 2.0, cách tốt nhất để sử dụng lại và trừu tượng hóa code là dùng [component](components.html), tuy nhiên có thể có những lúc bạn cần một số truy xuất cấp thấp đến các phần tử web, và trong những trường hợp này thì directive tùy biến sẽ trở nên hữu ích. Ví dụ, đây là một phần tử input được focus tự động:

{% raw %}
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
{% endraw %}

Khi trang này được tải, phần tử trên đây sẽ được focus (lưu ý: tính năng focus tự động không được hỗ trợ trên mobile Safari). Nếu bạn chưa hề bấm vào bất kì đâu khác trên trang, ngay lúc này phần tử input sẽ có focus. Giờ chúng ta hãy viết directive hỗ trợ cho tính năng này:

``` js
// Đăng kí một directive tùy biến cấp toàn cục với tên là `v-focus`
Vue.directive('focus', {
  // Khi phần tử liên quan được thêm vào DOM...
  inserted: function (el) {
    // Ta gán focus vào phần tử đó
    el.focus()
  }
})
```

Nếu muốn đăng kí directive ở cấp cục bộ thay vì toàn cục, bạn có thể dùng tùy chọn `directives` khi khai báo component:

``` js
directives: {
  focus: {
    // định nghĩa cho directive
    inserted: function (el) {
      el.focus()
    }
  }
}
```

Sau đó trong template, bạn có thể dùng thuộc tính `v-focus` trên bất kì phần tử nào, như sau:

``` html
<input v-focus>
```

## Các hàm hook

Một object khai báo directive có thể cung cấp một số hàm hook (tất cả các hàm này đều không bắt buộc):

- `bind`: chỉ được gọi một lần, khi directive được bind (ràng buộc) vào phần tử. Đây là nơi bạn có thể thực hiện các thao tác cài đặt một lần.

- `inserted`: được gọi khi element đã được chèn (insert) vào phần tử cha (điều này chỉ bảo đảm là phần tử cha đã được tạo ra chứ không chắc là nó đã tồn tại trong DOM).

- `update`: được gọi sau khi VNode của phần tử chứa đã cập nhật, __nhưng có thể là trước khi các phần tử con được cập nhật__. Giá trị của directive lúc này có thể đã thay đổi hoặc chưa, nhưng bạn có thể bỏ qua các thay đổi không cần thiết bằng cách so sánh hai giá trị cũ và mới (xem thông tin về tham số của hàm hook ở bên dưới).

- `componentUpdated`: được gọi sau khi VNode của phần tử chứa __và VNode của toàn bộ các phần tử con__ đã cập nhật.

- `unbind`: chỉ được gọi một lần, khi directive được unbind khỏi phần tử.

Chúng ta sẽ tìm hiểu về các tham số được truyền vào các hàm hook này trong phần tiếp theo.

## Tham số của các hàm hook

Các hàm hook cho directive được truyền vào các tham số sau đây:

- **el**: Phần tử được directive bind vào. Tham số này có thể được dùng để thay đổi DOM một cách trực tiếp.
- **binding**: Một object chứa những thuộc tính sau:
  - **name**: Tên của directive, không có tiếp đầu ngữ `v-`.
  - **value**: Gái trị được truyền vào directive. Ví dụ với `v-my-directive="1 + 1"` thì `value` sẽ là `2`.
  - **oldValue**: Giá trị trước đây, chỉ tồn tại trong các hook `update` và `componentUpdated`. `oldValue` sẽ luôn có cho dù giá trị có được thay đổi hay không.
  - **expression**: Biểu thức của binding dưới dạng chuỗi. Ví dụ với `v-my-directive="1 + 1"`, thì `expression` sẽ là `"1 + 1"`.
  - **arg**: Tham số được truyền vào directive, nếu có. Ví dụ với `v-my-directive:foo` thì `arg` sẽ là `"foo"`.
  - **modifiers**: Một object chứa các modifier, nếu có. Ví dụ với `v-my-directive.foo.bar`, thì `modifiers` sẽ là `{ foo: true, bar: true }`.
- **vnode**: Vnode được trình biên dịch của Vue tạo ra. Xem thêm chi tiết tại [VNode API](../api/#Giao-dien-cua-VNode).
- **oldVnode**: VNode trước đây, chỉ tồn tại trong các hook `update` và `componentUpdated`.

<p class="tip">Ngoài `el`, bạn nên coi là read-only (chỉ đọc) và đừng bao giờ chỉnh sửa các tham số này. Nếu muốn chia sẻ thông tin giữa các hook với nhau, bạn nên dùng [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).</p>

Sau đây là ví dụ về một directive tùy biến với các thuộc tính này:

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

``` js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'Cà rốt'
  }
})
```

{% raw %}
<div id="hook-arguments-example" v-demo:foo.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'Cà rốt'
  }
})
</script>
{% endraw %}

## Cách khai báo rút gọn

Trong nhiều trường hợp, có thể bạn muốn `bind` và `update` có chung một hành vi và không quan tâm đến các hook khác. Những lúc này bạn có thể dùng cách khai báo directive rút gọn, ví dụ:

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Truyền object trực tiếp

Nếu directive của bạn cần nhiều giá trị cùng một lúc, bạn có thể trực tiếp truyền vào một object. Nhớ là directive trong Vue có thể nhận bất kì biểu thức JavaScript hợp lệ nào.

``` html
<div v-demo="{ color: 'white', text: 'Su hào' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "Su hào"
})
```
