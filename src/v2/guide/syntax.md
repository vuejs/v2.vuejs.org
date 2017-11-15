---
title: Cú pháp template
type: guide
order: 4
---

Vue.js sử dụng một cú pháp template dựa trên HTML, cho phép bạn ràng buộc (bind) một cách minh bạch cấu trúc DOM được render với dữ liệu của đối tượng Vue bên dưới. Tất cả các template của Vue đều là code HTML hợp lệ và có thể được parse bởi các trình duyệt và parser chuẩn.

Bên dưới, Vue biên dịch template thành các hàm render Virtual DOM (DOM ảo). Kết hợp với hệ thống reactivity (phản ứng), Vue có thể xác định một cách thông minh số lượng tối thiểu các component cần phải render lại, và áp dụng số lượng tối thiểu các hiệu chỉnh về DOM khi trạng thái của ứng dụng thay đổi.

Nếu đã quen thuộc với các khái niệm của Virtual DOM và muốn trực tiếp sử dụng sức mạnh của JavaScript, bạn có thể [viết thẳng các hàm render](render-function.html) cùng với JSX (không bắt buộc), thay vì sử dụng template.

## Nội suy

### Văn bản

Hình thức ràng buộc dữ liệu cơ bản nhất là nội suy văn bản (text interpolation) sử dụng cú pháp "mustache" ("ria mép" – hai dấu ngoặc nhọn):

``` html
<span>Thông điệp: {{ msg }}</span>
```

Thẻ mustache sẽ được thay thế bằng giá trị của thuộc tính `msg` trên object data tương ứng, và cũng sẽ được cập nhật bất cứ khi nào thuộc tính này thay đổi.

Bạn cũng có thể thực hiện các phép nội suy một lần (không cập nhật lại khi dữ liệu thay đổi) bằng cách sử dụng [directive v-once](../api/#v-once), nhưng nhớ là làm như vậy sẽ ảnh hưởng đến tất cả các ràng buộc khác trên cùng một node:

``` html
<span v-once>Thông điệp này sẽ không bao giờ thay đổi: {{ msg }}</span>
```

### HTML thuần túy

Cú pháp mustache sẽ thông dịch dữ liệu ra thành văn bản thuần túy (plain text), nghĩa là các kí tự HTML đặc biệt như `<>&"'` sẽ được mã hóa. Để xuất ra HTML thuần túy, bạn sẽ cần đến directive `v-html`.

``` html
<p>Sử dụng cú pháp mustache: {{ rawHtml }}</p>
<p>Sử dụng directive v-html: <span v-html="rawHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>Sử dụng cú pháp mustache: {{ rawHtml }}</p>
  <p>Sử dụng directive v-html: <span v-html="rawHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
  	return {
  	  rawHtml: '<span style="color: red"></span>'
  	}
  }
})
</script>
{% endraw %}

Nội dung của thẻ `span` sẽ được thay thế bằng giá trị của thuộc tính `rawHtml` dưới dạng HTML thuần túy - tất cả các ràng buộc dữ liệu sẽ không được xử lí. Lưu ý rằng bạn không thể dùng `v-html` để viết template partial, vì Vue không phải là một template engine dựa trên chuỗi. Thay vào đó, hãy dùng component cho mục đích biên soạn và tái sử dụng UI.

<p class="tip">Render HTML động trên trang web của bạn có thể dẫn đến [các lỗ hổng XSS](https://en.wikipedia.org/wiki/Cross-site_scripting), vì thế chỉ dùng `v-html` với các nội dung đáng tin tưởng, **đừng bao giờ** dùng với các nội dung được người dùng cung cấp.</p>

### Các thuộc tính HTML

Cú pháp mustache không dùng được bên trong các thuộc tính HTML. Thay vào đó, bạn hãy dùng [directive v-bind](../api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

Directive này cũng hoạt động với các thuộc tính boolean như `disabled` và `selected` - các thuộc tính này sẽ được bỏ đi khi biểu thức được tính toán trả về kết quả sai (falsy):

``` html
<button v-bind:disabled="isButtonDisabled">Hòn Vọng Phu</button>
```

{% raw %}
<div id="example2" class="demo">
  <p>Giá trị của <code>isButtonDisabled</code>: {{ isButtonDisabled }}</p>
  <button @click="toggleDisabledProperty">Kích hoạt</button>
  <button v-bind:disabled="isButtonDisabled">Hòn Vọng Phu</button>
</div>
<script>
new Vue({
  el: '#example2',
  data: function () {
  	return {
  	  isButtonDisabled: true
  	}
  },
  methods: {
  	toggleDisabledProperty: function () {
  	  this.isButtonDisabled = !this.isButtonDisabled
  	}
  }
})
</script>
{% endraw %}


### Sử dụng các biểu thức JavaScript

Cho đến nay chúng ta chỉ mới bind vào các khóa thuộc tính dơn giản trong template. Tuy nhiên, thật ra Vue hỗ trợ sức mạnh toàn diện của các biểu thức JavaScript bên trong toàn bộ các ràng buộc dữ liệu (data binding):

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Các biểu thức này sẽ được tính toán dưới dạng JavaScript trong scope của đối tượng Vue hiện hành. Một hạn chế ở đây là mỗi ràng buộc chỉ có thể chứa **một biểu thức đơn lẻ**, vì thế các trường hợp sau sẽ **không** hoạt động:

``` html
<!-- đây là một khai báo, không phải biểu thức: -->
{{ var a = 1 }}

<!--
  các lệnh quản lí luồng (flow control) cũng sẽ không hoạt động,
  thay vào đó bạn hãy dùng toán tử ba ngôi (ternary operator):
-->
{{ if (ok) { return message } }}
```

<p class="tip">Các biểu thức template hoạt động trong môi trường cách li (sandboxed) và chỉ có quyền truy xuất đến một danh sách các hàm / đối tượng cấp toàn cục như `Math` và `Date`. Bạn không nên thử truy xuất đến các giá trị cấp toàn cục khác do người dùng tự định nghĩa bên trong các biểu thức template.</p>

## Directive

Directive là các thuộc tính đặc biệt với prefix (tiếp đầu ngữ) `v-`. Giá trị của thuộc tính directive phải là **một biểu thức JavaScript đơn lẻ** (ngoại trừ `v-for` mà chúng ta sẽ đề cập sau). Nhiệm vụ của một directive là áp dụng các hiệu ứng phụ vào DOM khi giá trị của biểu thức thay đổi. Hãy xem lại ví dụ chúng ta đã thấy trong phần giới thiệu:

``` html
<p v-if="seen">Thoắt ẩn thoắt hiện</p>
```

Ở đây, directive `v-if` sẽ thêm vào hoặc bỏ đi phần tử `<p>` dựa trên tính đúng sai của giá trị của biểu thức `seen`.

### Tham số

Một số directive có thể nhận vào một tham số, đánh dấu bằng một dấu hai chấm theo sau tên của directive. Ví dụ, directive `v-bind` được dùng để cập nhật động  một thuộc tính HTML:

``` html
<a v-bind:href="url"> ... </a>
```

Ở đây `href` là tham số hướng dẫn directive `v-bind` ràng buộc thuộc tính `href` vào giá trị của biểu thức `url`.

Một ví dụ khác là directive `v-on`. Directive này lắng nghe các sự kiện DOM:

``` html
<a v-on:click="doSomething"> ... </a>
```

Tham số ở đây là tên của sự kiện để lắng nghe (`click`). Chúng ta cũng sẽ bàn sâu về [quản lí sự kiện](events.html) sau.

### Modifier

Modifier là các hậu tố (postfix) đặc biệt được đánh dấu bằng một dấu chấm, chỉ rõ rằng một directive phải được ràng buộc theo một cách đặc biệt nào đó. Ví dụ, modifier `.prevent` hướng dẫn directive `v-on` gọi `event.preventDefault()` khi sự kiện được kích hoạt:

``` html
<form v-on:submit.prevent="onSubmit"> ... </form>
```

Sau này bạn sẽ gặp thêm các ví dụ khác về modifier cho [`v-on`](events.html#Event-modifier) và [`v-model`](forms.html#Modifier), khi chúng ta bàn đến các tính năng này.

## Cú pháp rút gọn

Prefix `v-` đóng vai trò gợi ý trực quan để nhận ra các thuộc tính riêng của Vue trong template. Điều này có ích khi bạn sử dụng Vue vào các dự án có sẵn, tuy nhiên đối với các directive được dùng thường xuyên thì `v-` có thể trông hơi rườm rà. Thêm vào đó `v-` trở nên kém quan trọng hơn khi bạn xây dựng [các ứng dụng một trang](https://en.wikipedia.org/wiki/Single-page_application), trong đó Vue quản lí toàn bộ các template. Vì thế Vue cung cấp dạng rút gọn (shorthand) đặc biệt cho hai trong số các directive được dùng nhiều nhất, `v-bind` và `v-on`:

### `v-bind`

``` html
<!-- cú pháp đầy đủ -->
<a v-bind:href="url"> ... </a>

<!-- cú pháp rút gọn: dùng dấu hai chấm -->
<a :href="url"> ... </a>
```

### `v-on`

``` html
<!-- cú pháp đầy đủ -->
<a v-on:click="doSomething"> ... </a>

<!-- cú pháp rút gọn: dùng kí tự @ -->
<a @click="doSomething"> ... </a>
```

Tuy nhìn có vẻ khác với HTML thông thường, `:` và `@` là các kí tự hợp lệ cho các thuộc tính HTML, và các trình duyệt hỗ trợ Vue đều có thể parse được hai kí tự này. Thêm vào đó, các directive không xuất hiện trong code HTML được render ra. Cú pháp rút gọn là hoàn toàn không bắt buộc, nhưng có lẽ là bạn sẽ thích dùng sau khi biết thêm về cách dùng của chúng.
