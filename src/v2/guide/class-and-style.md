---
title: Binding cho class và style
type: guide
order: 6
---

Một nhu cầu thường gặp khi thực hiện ràng buộc dữ liệu (data binding) là quản lí danh sách `class` và các `style` của một phần tử web. Vì cả `class` và `style` đều là thuộc tính, chúng ta có thể dùng `v-bind` để xử lí: chỉ cần sử dụng các biểu đạt (expression) để tạo ra một chuỗi. Tuy nhiên, vì can thiệp vào việc nối chuỗi rất phiền phức và dễ mắc lỗi, Vue cung cấp một số tính năng hỗ trợ khi `v-bind` được dùng với `class` và `style`. Không chỉ có chuỗi, các biểu đạt này có thể xử lí cả mảng và object.

## Binding class trong HTML

### Sử dụng cú pháp object

Ta có thể truyền một object vào `v-bind:class` để bật tắt class một cách linh hoạt:

``` html
<div v-bind:class="{ active: isActive }"></div>
```

Cú pháp như trên nghĩa là class `active` sẽ được áp dụng tùy theo [tính đúng sai (truthiness)](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) của thuộc tính dữ liệu `isActive`.

Bạn có thể bật tắt nhiều class bằng cách dùng nhiều field (trường) trong object. Thêm vào đó, directive `v-bind:class` và thuộc tính `class` thông thường có thể được dùng cùng lúc với nhau. Nếu chúng ta có template sau:

``` html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```

và dữ liệu truyền vào như thế này:

``` js
data: {
  isActive: true,
  hasError: false
}
```

thì kết quả render sẽ là:

``` html
<div class="static active"></div>
```

Khi giá trị `isActive` hoặc `hasError` thay đổi, danh sách class sẽ được cập nhật tương ứng. Ví dụ, nếu `hasError` trở thành `true`, danh sách class sẽ trở thành `"static active text-danger"`.

Object được bind cũng không bắt buộc phải khai báo trong template:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

Ví dụ trên sẽ render ra cùng một kết quả. Chúng ta cũng có thể bind vào một [computed property (thuộc tính được tính toán)](computed.html) trả về một object. Dưới đây là một ví dụ điển hình cho kĩ thuật này: 

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},

computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### Sử dụng cú pháp mảng

Chúng ta có thể truyền một mảng vào `v-bind:class` để áp dụng một danh sách class:

``` html
<div v-bind:class="[activeClass, errorClass]"></div>
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

sẽ render ra kết quả sau:

``` html
<div class="active text-danger"></div>
```

Nếu muốn bật tắt theo điều kiện một class trong danh sách, bạn có thể dùng một toán tử ba ngôi (ternary expression):

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

Đoạn code trên sẽ luôn luôn áp dụng class `errorClass`, nhưng chỉ áp dụng `activeClass` khi `isActive` mang giá trị đúng.

Cách làm này có thể hơi dài dòng nếu bạn có nhiều class theo điều kiện. Do đó, bạn có thể dùng cú pháp object bên trong cú pháp mảng, như sau:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### Sử dụng với các component

> Phần này giả định rằng bạn đã có kiến thức về [Vue component](components.html). Nếu chưa, bạn có thể bỏ qua và quay lại sau.

Khi sử dụng thuộc tính `class` trên một component tùy biến, những class được liệt kê trong thuộc tính này sẽ được thêm vào phần tử root của component đó. Những class có sẵn trên phần tử này sẽ được giữ nguyên.

Ví dụ, nếu bạn khai báo một component với một số class có sẵn như sau:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar"></p>'
})
```

sau đó khi dùng component này bạn lại khai báo một số class khác:

``` html
<my-component class="baz qux"></my-component>
```

thì kết quả HTML tạo thành sẽ là:

``` html
<p class="foo bar baz qux"></p>
```

Binding cho class cũng vậy: 

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Khi `isActive` mang giá trị đúng, kết quả HTML sẽ là:

``` html
<p class="foo bar active"></p>
```

## Binding cho inline style

<p class="tip">"Inline style" có thể được hiểu và dịch nôm na là "các thuộc tính CSS được chèn trực tiếp vào thẻ HTML." Do cách hiểu và dịch này quá dài dòng, chúng tôi sẽ dùng nguyên bản tiếng Anh "inline style."</p>

### Sử dụng cú pháp object

Cú pháp object của `v-bind:style` rất đơn giản - trông giống như CSS thông thường, chỉ khác ở chỗ nó là một object JavaScript. Bạn có thể dùng camelCase hoặc kebab-case (đặt trong dấu nháy nếu là kebab-case) đối với tên thuộc tính CSS:

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

Thông thường thì ta nên bind vào một object dành riêng cho style để template được gọn gàng hơn:

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

Một lần nữa, cú pháp object thường được dùng kết hợp với các computed property trả về object.

### Sử dụng cú pháp mảng

Cú pháp mảng của `v-bind:style` giúp bạn áp dụng nhiều object style cho cùng một phần tử web:

``` html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### Tự động thêm prefix

Khi bạn sử dụng một thuộc tính CSS còn khá mới và cần [vendor prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) trong `v-bind:style`, ví dụ `transform`, Vue sẽ tự động phát hiện và thêm prefix thích hợp vào các style được áp dụng.

### Nhiều giá trị

> 2.3.0+

Bắt đầu từ phiên bản 2.3.0+ bạn có thể cung cấp một mảng các giá trị (đã có prefix) cho một thuộc tính CSS, như sau:

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Với kĩ thuật này, Vue sẽ chỉ render ra giá trị cuối cùng trong mảng mà trình duyệt hỗ trợ. Trong ví dụ trên, Vue sẽ render `display: flex` trên các trình duyệt hỗ trợ [flexbox](http://caniuse.com/#feat=flexbox).
