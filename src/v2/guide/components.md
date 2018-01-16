---
title: Component
type: guide
order: 11
---

## Component là gì?

Component là một trong những tính năng mạnh nhất của Vue. Với component, chúng ta có thể mở rộng những phần tử HTML cơ bản để đóng gói (encapsulate) code có thể tái sử dụng. Nói một cách tổng quát, component là những phần tử web tùy biến (custom element) đã được trình biên dịch của Vue đính kèm các hành vi (behavior) vào. Trong một số trường hợp, component cũng có thể xuất hiện dưới dạng một phần tử HTML bình thường với một thuộc tính `is` đặc biệt.

Mỗi component đều là một đối tượng Vue, và do đó sẽ nhận cùng một object `options` (trừ một số tùy chọn dành riêng cho root) và cung cấp cùng một hệ thống hook vòng đời. 

## Sử dụng component

### Đăng kí ở cấp toàn cục

Ở các phần trước, chúng ta đã biết rằng một đối tượng Vue có thể được khởi tạo bằng cách sau:

``` js
new Vue({
  el: '#some-element',
  // các tùy chọn
})
```

Để đăng kí một component ở cấp toàn cục, bạn có thể dùng cú pháp `Vue.component(tagName, options)`. Ví dụ:

``` js
Vue.component('my-component', {
  // các tùy chọn
})
```

<p class="tip">Vue không bắt buộc phải theo [các quy ước W3C](https://www.w3.org/TR/custom-elements/#concepts) về tên thẻ tùy biến (viết thường toàn bộ, phải sử dụng dấu gạch ngang) tuy rằng bạn cũng nên tuân thủ các quy tắc này.</p>

Một khi đã đăng kí, component có thể được sử dụng dưới dạng một phần tử tùy biến trong template của một đối tượng Vue: `<my-component></my-component>`. Bạn nhớ đăng kí component **trước khi** khởi tạo đối tượng Vue gốc. Sau đây là ví dụ hoàn chỉnh:

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// đăng kí
Vue.component('my-component', {
  template: '<div>Đây là một component!</div>'
})

// tạo đối tượng Vue gốc
new Vue({
  el: '#example'
})
```

Kết quả render ra sẽ là:

``` html
<div id="example">
  <div>Đây là một component!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>Đây là một component!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### Đăng kí ở cấp cục bộ

Bạn không nhất thiết phải đăng kí toàn bộ các compoent ở cấp toàn cục. Thay vào đó, bạn có thể đăng kí một component bằng cách dùng tùy chọn `components` khi khởi tạo một đối tượng Vue. Với cách làm này, chỉ đối tượng Vue này mới có thể truy xuất đến component vừa đăng kí.

``` js
var Child = {
  template: '<div>Đây là một component!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> chỉ hợp lệ trong template của đối tượng cha
    'my-component': Child
  }
})
```

Cách đóng gói (encapsulation) như trên cũng áp dụng với các tính năng có thể đăng kí của Vue, ví dụ như directive.

### Lưu ý về việc parse DOM template

Khi sử dụng DOM làm template (ví dụ dùng tùy chọn `el` để gắn một phần tử web đã có sẵn nội dung), bạn sẽ phải gặp phải một số hạn chế vốn có của HTML, vì Vue chỉ có thể nhận vào nội dung của template **sau khi** trình duyệt đã parse (phân tích) và normalize (bình thường hóa) template này. Đáng lưu ý nhất, bên trong các phần tử như `<ul>`, `<ol>`, `<table>` và `<select>` chúng ta chỉ có thể chứa một số phần tử nhất định (chẳng hạn `<ul>` chỉ chấp nhận `<li>`), trong khi đó các phần tử như `<option>` lại chỉ có thể được đặt trong một số phần tử nhất định khác như `<select>`, `<optgroup>`, hay `<datalist>`.

  Điều này sẽ dẫn đến một số vấn đề khi dùng component với các phần tử có những hạn chế vừa nêu, ví dụ:

``` html
<table>
  <my-row>...</my-row>
</table>
```

Ở đây component `<my-row>` sẽ bị xem là một phần tử không hợp lệ bên trong `<table>` và bị đẩy ra ngoài (hoisted out), dẫn đến lỗi khi render. Để giải quyết vấn đề này, ta có thể dùng thuộc tính đặc biệt `is`:

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**Cũng cần lưu ý rằng những hạn chế nêu trên không tồn tại nếu bạn sử dụng string template từ một trong các nguồn sau**:

- `<script type="text/x-template">`
- Template string bên trong JavaScript
- Component dạng `.vue`

Vì thế, hãy dùng string template bất cứ khi nào có thể.

### `data` phải là một hàm

Đa số các tùy chọn có thể truyền vào hàm dựng của Vue đều có thể dùng trong component, với một trường hợp đặc biệt: `data` phải là một hàm. Nếu bạn thử chạy ví dụ sau:

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'Xin chào'
  }
})
```

thì Vue sẽ ngừng thực thi và hiển thị cảnh báo trong console, thông báo rằng `data` trong các đối tượng component thì `data` phải là một hàm. Dĩ nhiên nếu chúng ta hiểu lí do tại sao thì tốt hơn, nên hãy thử chơi gian một chút:

``` html
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
```

``` js
var data = { counter: 0 }

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // ở đây `data` về nguyên tắc vẫn là một hàm,
  // nên Vue sẽ không phàn nàn gì, nhưng ta sẽ
  // trả lại cùng một tham chiếu đến object `data`
  // cho mỗi đối tượng component
  data: function () {
    return data
  }
})

new Vue({
  el: '#example-2'
})
```

{% raw %}
<div id="example-2" class="demo">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
<script>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
</script>
{% endraw %}

Vì cả ba đối tượng component dùng chung một object `data` object, tăng giá trị của một bộ đếm số sẽ tăng cả ba! Chúng ta sẽ sửa lại bằng cách trả về một object data mới cho mỗi component:

``` js
data: function () {
  return {
    counter: 0
  }
}
```

Bây giờ thì mỗi bộ đếm của chúng ta sẽ có một state (trạng thái) riêng:

{% raw %}
<div id="example-2-5" class="demo">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  }
})
new Vue({
  el: '#example-2-5'
})
</script>
{% endraw %}

### Biên soạn component

Component được tạo ra là để dùng chung với nhau, thường thấy nhất là trong những mối quan hệ cha-con: component A có thể dùng component B trong template của mình. Chắc chắn hai component này sẽ phải giao tiếp với nhau: đối tượng cha có thể sẽ cần truyền dữ liệu cho đối tượng con, và đối tượng con cũng cần thông báo cho đối tượng cha biết khi có điều gì đó xảy ra. Tuy nhiên, một điều cũng hết sức quan trọng là hai đối tượng cha-con này cũng cần được tách biệt đến mức có thể, thông qua một interface (giao diện) được định nghĩa rõ ràng via a clearly-defined interface. Điều này bảo đảm code của mỗi component được viết và quản lí một cách biệt lập, nhờ đó giúp việc bảo trì và tái sử dụng được dễ dàng hơn.

Trong Vue, mối quan hệ component cha-con có thể được tóm tắt thành **props down, events up** (thuộc tính xuống, sự kiện lên). Component cha truyền data xuống component con bằng **props**, và component con gửi thông điệp cho component cha bằng **sự kiện**. Tiếp theo đây chúng ta sẽ xem chúng hoạt động như thế nào.

<p style="text-align: center;">
  <img style="width: 300px;" src="/images/props-events.png" alt="props down, events up">
</p>

## Prop

### Truyền dữ liệu với prop

Mỗi đối tượng component có một scope được cô lập (isolated) riêng. Điều này có nghĩa là bạn không thể (và cũng không nên) truy xuất đến dữ liệu cha trong template của component con. Thay vào đó, dữ liệu có thể được truyền từ cha xuống con bằng cách sử dụng các **prop**.

Một `prop`là một thuộc tính tùy biến để truyền thông tin từ các component cha. Một component con cần phải khai báo một cách minh bạch (explicitly) các `prop` mà nó trông đợi được nhận bằng [tùy chọn `props`](../api/#props):

``` js
Vue.component('child', {
  // khai báo props
  props: ['message'],
  // giống như `data`, prop này có thể được dùng bên trong template
  // và cũng có thể được truy xuất bên trong vm bằng this.message
  template: '<span>{{ message }}</span>'
})
```

Sau đó chúng ta có thể truyền cho nó một chuỗi con như sau:

``` html
<child message="Xin chào!"></child>
```

Result:

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="Xin chào!"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['message'],
      template: '<span>{{ message }}</span>'
    }
  }
})
</script>
{% endraw %}

### camelCase vs. kebab-case

Các thuộc tính HTML không phân biệt hoa thường, vì vậy khi sử dụng template không phải là string template, tên của prop (được viết theo camelCase JavaScript) nên được chuyển thành dạng kebab-case trong HTML. Để dễ hiểu hơn, bạn có thể xem ví dụ sau đây:

``` js
Vue.component('child', {
  // camelCase trong JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case trong HTML -->
<child my-message="Xin chào!"></child>
```

Một lần nữa, nếu bạn đang dùng string template thì sẽ không tồn tại hạn chế này.

### Prop động

Tương tự như việc bind một thuộc tính thông thường vào một expression, chúng ta cũng có thể dùng `v-bind` để bind động props vào dữ liệu trên component cha. Bất cứ khi nào được cập nhật trong component cha, dữ liệu cũng sẽ được truyền xuống component con:

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

Bạn cũng có thể dùng cú pháp viết tắt của `v-bind`:

``` html
<child :my-message="parentMsg"></child>
```

Kết quả:

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Con ơi nhớ lấy câu này'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

Nếu muốn truyền toàn bộ thuộc tính của một object thành props, bạn có thể dùng `v-bind` không có tham số (`v-bind` thay vì `v-bind:prop-name`). Ví dụ, nếu chúng ta có một object `todo`:

``` js
todo: {
  text: 'Học Vue',
  isComplete: false
}
```

thì

``` html
<todo-item v-bind="todo"></todo-item>
```

là tương đương với

``` html
<todo-item
  v-bind:text="todo.text"
  v-bind:is-complete="todo.isComplete"
></todo-item>
```

### Prop động và prop literal

Một lỗi mà người mới học thường vấp phải là thử truyền xuống một con số sử dụng cú pháp literal (trực tiếp):

``` html
<!-- cách này sẽ truyền xuống chuỗi "1" -->
<comp some-prop="1"></comp>
```

Tuy nhiên, vì đây là một prop literal, giá trị của nó được truyền xuống dưới dạng chuỗi `"1"` thay vì một con số thật sự. Muốn truyền xuống một giá trị kiểu number trong JavaScript, chúng ta cần dùng `v-bind` để cho giá trị của nó được xem như một biểu thức JavaScript:


``` html
<!-- cách này sẽ truyền xuống một con số thật sự -->
<comp v-bind:some-prop="1"></comp>
```

### Luồng dữ liệu một chiều

Tất cả các prop tạo ra một ràng buộc (binding) **đi xuống một chiều** giữa thuộc tính của cha và thuộc tính của con. Khi thuộc tính của cha được cập nhật, sự thay đổi này sẽ được truyền xuống dưới, nhưng không xảy ra điều ngược lại. Điều này ngăn không cho component con vô tình thay đổi trạng thái của cha (và làm luồng dữ liệu trở nên rối loạn).

Thêm vào đó, mỗi khi component cha được cập nhật, toàn bộ prop trong component con sẽ được refresh với giá trị mới nhất. Điều này có nghĩa là bạn **không nên** thay đổi prop bên trong component con. Nếu bạn vẫn cố làm, Vue sẽ hiện cảnh báo trong console.

Thông thường thì có hai trường hợp bạn muốn thay đổi một prop:

1. Prop này được dùng để truyền một giá trị ban đầu, sau đó component con muốn dùng giá trị này như một thuộc tính dữ liệu cục bộ.
2. Prop được truyền xuống dưới dạng giá trị thô (raw value) và cần được chuyển đổi

Cách làm đúng cho hai trường hợp trên là:

1. Định nghĩa một thuộc tính dữ liệu cục bộ và dùng giá trị ban đầu của prop làm giá trị ban đầu của thuộc tính này:

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. Đĩnh nghĩa một [computed property](computed.html) dựa trên giá trị của prop:

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Lưu ý là object và array trong JavaScript được truyền bằng tham chiếu, vì vậy nếu prop là một array hay object, thay đổi array hay object này bên trong component con cũng sẽ ảnh hưởng đến component cha.</p>

### Kiểm chứng prop

Component có thể chỉ định một số yêu cầu (requirement) cho prop. Nếu có yêu cầu nào không được thỏa mãn, Vue sẽ cảnh báo. Điều này trở nên đặc biệt hữu ích khi component bạn đang viết là để cho người khác dùng.

Thay vì định nghĩa các prop dưới dạng một mảng chứa tên prop, bạn có thể dùng một object chứa các yêu cầu kiểm chứng (validation requirement).

``` js
Vue.component('example', {
  props: {
    // kiểm tra kiểu dữ liệu cơ bản (`null` chấp nhận tất cả các kiểu)
    propA: Number,
    // chấp nhận một số kiểu dữ liệu cùng lúc
    propB: [String, Number],
    // một chuỗi bắt buộc
    propC: {
      type: String,
      required: true
    },
    // một con số với giá trị mặc định
    propD: {
      type: Number,
      default: 100
    },
    // giá trị mặc định cho object/array nên được trả về
    // từ một hàm factory
    propE: {
      type: Object,
      default: function () {
        return { message: 'Xin chào' }
      }
    },
    // hàm kiểm tra tùy biến
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

Thuộc tính `type` có thể là một trong các hàm dựng native sau:

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

Ngoài ra, `type` cũng có thể là một hàm dựng tùy biến (custom constructor), và Vue sẽ so sánh bằng lệnh `instanceof`.

Khi prop không thỏa mãn một hay nhiều điều kiện đã đặt ra, Vue sẽ cảnh báo trong console (nếu bạn đang dùng [bản development](installation.html#Che-do-development-va-production)). Lưu ý rằng prop được kiểm chứng __trước khi__ đối tượng component được khởi tạo, vì vậy bên trong các hàm `default` hoặc `validator`, các thuộc tính đối tượng như `data`, `computed`, hay `methods` sẽ không khả dụng.

## Các thuộc tính non-prop

Thuộc tính non-prop là một thuộc tính được truyền vào component mà không có prop tương ứng được định nghĩa sẵn.

Tuy props nên được định nghĩa một cách minh bạch bất cứ khi nào có thể, tác giả của các thư viện component không phải lúc nào cũng có thể thấy trước được ngữ cảnh mà component của mình được sử dụng. Đó là lí do component có thể nhận những giá trị "linh động" hơn, các giá trị này được thêm vào root của component.

Ví dụ, thử tưởng tượng chúng ta sử dụng component bên thứ ba gọi là `bs-date-input` với một plugin Bootstrap. Plugin này yêu cầu một thuộc tính tên là `data-3d-date-picker` trên `input`. Chúng ta có thể thêm thuộc tính này vào đối tượng component của chúng ta như sau:

``` html
<bs-date-input data-3d-date-picker="true"></bs-date-input>
```

Ở đây thuộc tính `data-3d-date-picker="true"` sẽ được tự động gắn vào phần tử root của `bs-date-input`.

### Thay thế / sáp nhập với các thuộc tính sẵn có

Ví dụ đây là template của `bs-date-input`:

``` html
<input type="date" class="form-control">
```

Để chỉ định một theme cho plugin date picker, có thể chúng ta sẽ phải thêm vào một `class` như sau:

``` html
<bs-date-input
  data-3d-date-picker="true"
  class="date-picker-theme-dark"
></bs-date-input>
```

Như vậy ở đây có đến hai giá trị cho thuộc tính `class`:

- `form-control`, gán trong template của component
- `date-picker-theme-dark`, truyền vào component con từ đối tượng cha

Đối với đa số các thuộc tính, giá trị truyền vào sẽ thay thế cho giá trị được gắn sẵn trong component, có nghĩa là truyền vào `type="large"` sẽ thay thế `type="date"` (và có thể là làm hỏng luôn chương trình!) May thay, các thuộc tính `class` và `style` thông minh hơn một chút vã sẽ sáp nhập (merge) các giá trị lại với nhau, tạo thành kết quả cuối cùng: `class="form-control date-picker-theme-dark"`.

## Các sự kiện tùy biến

Chúng ta đã biết rằng đối tượng cha có thể truyền dữ liệu xuống đối tượng con thông qua prop, nhưng nếu có gì đó xảy ra thì chúng ta làm thế nào để giao tiếp ngược lại từ đối tượng con lên đối tượng cha? Câu trả lời là hệ thống các sự kiện tùy biến (custom event) của Vue.

### Sử dụng `v-on` với các sự kiện tùy biến

Mỗi đối tượng Vue đều phát triển một [giao diện sự kiện](../api/#Instance-Methods-Events), có nghĩa là nó có thể:

- Lắng nghe một sự kiện với `$on(eventName)`
- Kích hoạt một sự kiện với `$emit(eventName)`

<p class="tip">Lưu ý rằng hệ thống sự kiện của Vue khác với [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) của trình duyệt. Tuy cách hoạt động có vẻ giống nhau, `$on` và `$emit` __không phải__ là alias của `addEventListener` và `dispatchEvent`.</p>

Thêm vào đó, một component cha có thể lắng nghe các sự kiện được component con phát ra bằng cách sử dụng `v-on` trực tiếp trên template nơi component con được nhúng vào.

<p class="tip">Bạn không thể dùng `$on` để lắng nghe sự kiện được component con phát ra. Thay vào đó, bạn phải dùng `v-on` trực tiếp trong template, như trong ví dụ dưới đây.</p>

Đây là một ví dụ:

``` html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

``` js
Vue.component('button-counter', {
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

{% raw %}
<div id="counter-event-example" class="demo">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1
      this.$emit('increment')
    }
  }
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
</script>
{% endraw %}

Trong ví dụ này, cần lưu ý rằng đối tượng con hoàn toàn không bị ràng buộc gì với thế giới bên ngoài. Nó chỉ làm đúng một việc là thông báo thông tin về hoạt động của chính mình – lắng nghe và xử lí thế nào hoàn toàn là việc của component cha.

### Bind sự kiện native vào component

Đôi khi bạn cũng muốn lắng nghe một sự kiện native trên phần tử root của component. Trong những trường hợp này, bạn có thể sử dụng modifier `.native` cho `v-on`. Ví dụ:

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### Modifier `.sync`

> 2.3.0+

Trong một số trường hợp có thể chúng ta cần "two-way binding" (ràng buộc hai chiều) cho một prop - thật ra, trong 1.x đây chính xác là mục đích của modifier `.sync`. Khi component con thay đổi một prop có modifier `.sync`, giá trị ở parent cũng sẽ thay đổi theo. Điều này tiện thì có tiện nhưng về lâu dài sẽ làm cho việc bảo trì phần mềm gặp khó khăn vì nó phá vỡ luồng dữ liệu một chiều: code thay đổi prop của con cũng lẳng lặng làm ảnh hưởng đến trạng thái của cha. Đây chính là lí do chúng tôi quyết định bỏ modifier `.sync` khi ra mắt phiên bản 2.0.

Tuy nhiên, modifier `.sync` như trên vẫn có giá trị trong một số trường hợp nhất định, đặc biệt là khi ship những component tái sử dụng được. Cái chúng ta cần ở đây là **làm cho những đoạn code trong component con ảnh hưởng đến trạng thái của component cha được minh bạch (explicit) và ổn định (consistent) hơn.**

Từ bản 2.3.0 trở đi, chúng tôi giới thiệu lại modifier `.sync` cho prop, nhưng lần này `.sync` chỉ là một syntactic sugar (cú pháp đẹp/dễ nhìn) tự động mở rộng thêm thành một listener `v-on`:

Đoạn code sau

``` html
<comp :foo.sync="bar"></comp>
```

sẽ được mở rộng ra thành:

``` html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

Để có thể cập nhật giá trị của `foo`, component con phải phát ra một sự kiện một cách minh bạch thay vì trực tiếp thay đổi `foo`:

``` js
this.foo = 'baz' // cách làm sai, và Vue sẽ cảnh báo
this.$emit('update:foo', newValue) // OK
```

### Sử dụng sự kiện tùy biến với form input component

Các sự kiện tùy biến cũng có thể được dùng để tạo custom input hoạt động với `v-model`. Nhớ là:

``` html
<input v-model="something">
```

là syntactic sugar của:

``` html
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

Khi sử dụng với một component, nó được đơn giản hóa thành:

``` html
<custom-input
  :value="something"
  @input="value => { something = value }">
</custom-input>
```

Vì thế để hoạt động với `v-model`, một component cần

- nhận một prop `value`
- `$emit` một sự kiện `input` với giá trị mới

(những giá trị này tùy chỉnh được từ phiên bản 2.2.0 trở đi).

Chúng ta hãy xem ví dụ sau:

``` html
<currency-input v-model="price"></currency-input>
```

``` js
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)">\
    </span>\
  ',
  props: ['value'],
  methods: {
    // Thay vì cập nhật giá trị trực tiếp, phương thức này
    // được dùng để format và đặt một số ràng buộc lên giá trị
    // của input
    updateValue: function (value) {
      var formattedValue = value
        // Bỏ khoảng trắng ở hai bên
        .trim()
        // Rút ngắn lại còn hai chữ số thập phân
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      // Nếu giá trị chưa được chuẩn hóa, ta ghi đè (override)
      // để bắt nó chuẩn không cần chỉnh
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // Phát ra sự kiện input
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

{% raw %}
<div id="currency-input-example" class="demo">
  <currency-input v-model="price"></currency-input>
</div>
<script>
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    updateValue: function (value) {
      var formattedValue = value
        .trim()
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      this.$emit('input', Number(formattedValue))
    }
  }
})
new Vue({
  el: '#currency-input-example',
  data: { price: '' }
})
</script>
{% endraw %}

Ví dụ trên thật ra còn khá sơ sài, đơn cử như người dùng vẫn có thể nhập vào nhiều dấu chấm và đôi khi cả chữ cái. Sau đây là một ví dụ hoàn chỉnh hơn:

<iframe width="100%" height="300" src="//jsfiddle.net/phanan/1oqjojjx/1464/embedded/result,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Tùy biến `v-model` cho component

> 2.2.0+

Mặc định, `v-model` dùng cho một component sử dụng prop tên là `value` và sự kiện tên là `input`. Tuy nhiên, một số kiểu input như checkbox và radio button có thể dùng prop `value` vào mục đích khác. Trong những trường hợp như vậy, tùy chọn `model` sẽ giúp chúng ta tránh được xung đột:

``` js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    // ở đây chúng ta có thể sử dụng prop `value`
    // vào một mục đích khác
    value: String
  },
  // ...
})
```

``` html
<my-checkbox v-model="foo" value="some value"></my-checkbox>
```

Đoạn code trên là tương đồng với đoạn dưới đây:

``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```

<p class="tip">Lưu ý là bạn vẫn phải khai báo prop `checked` một cách minh bạch.</p>

### Giao tiếp giữa hai component không phải cha-con

Đôi lúc hai component cần giao tiếp với nhau nhưng lại không có mối quan hệ cha-con (component không trực tiếp chứa component kia). Trong những trường hợp đơn giản, bạn có thể dùng một đối tượng Vue rỗng để làm một event bus (nôm na là kênh truyền tải sự kiện).

``` js
var bus = new Vue()
```
``` js
// trong phương thức của component A
bus.$emit('id-selected', 1)
```
``` js
// trong hook `created` của component B
bus.$on('id-selected', function (id) {
  // ...
})
```

Trong những trường hợp phức tạp hơn, bạn nên xem xét sử dụng một [pattern quản lí trạng thái](state-management.html).

## Phân bố nội dung với slot

Khi dùng component, thông thường ta sẽ muốn kết hợp như sau:

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

Ở đây có hai điểm cần lưu ý:

1. Component `<app>` không biết nội dung nó nhận được là gì. Thay vào đó, nội dung của `<app>` được quyết định bởi các component con, trong trường hợp này là `<app-header>` và `<app-footer>`.
2. Thường thì component `<app>` có template riêng.

Để đạt được kết quả như trên, chúng ta cần có một cách để trộn lẫn nội dung và template của component cha. Quá trình này gọi là **phân bố nội dung** (content distribution, hay còn gọi là "transclusion" trong Angular). Vue.js phát triển một API phân bố nội dung dựa trên [bản quy tắc về Web Component](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) hiện hành, sử dụng phần tử đặc biệt `<slot>` để làm các _outlet_ phân bố cho nội dung ban đầu.

### Scope khi biên dịch

Trước khi đi sâu vào API, trước tiên chúng ta phải làm rõ: nội dung được biên dịch trong scope nào? Tưởng tượng chúng ta có một template như sau:

``` html
<child-component>
  {{ message }}
</child-component>
```

Trong trường hợp này thì `message` nên là dữ liệu của component cha hay component con? Câu trả lời là component cha. Một quy tắc cơ bản về scope của component là:

> Cái gì trong template của cha thì được biên dịch trong scope của cha, cái gì trong template của con thì được biên dịch trong scope của con.

Một lỗi mà người dùng hay mắc phải là cố bind một directive vào một thuộc tính hay phương thức của component con trong template của cha:

``` html
<!-- cách này KHÔNG HOẠT ĐỘNG -->
<child-component v-show="someChildProperty"></child-component>
```

Giả định `someChildProperty` là một thuộc tính của component con, ví dụ trên sẽ không hoạt động. Template của component cha không biết gì về trạng thái của component con.

Nếu muốn bind các directive với scope con trên node gốc của một component, bạn nên làm thế trong template của chính component con:

``` js
Vue.component('child-component', {
  // cách này sẽ hoạt động, vì chúng ta đang ở đúng scope
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

Tương tự như vậy, nội dung được phân bố sẽ được biên dịch trong scope của cha.

### Slot đơn lẻ

Nội dung của component cha sẽ **bị loại bỏ** trừ phi template của component con chứa ít nhất một `<slot>`. Khi chỉ có một slot và slot này không có thuộc tính gì, toàn bộ phần nội dung sẽ được chèn vào vị trí của slot trong DOM, thay thế cho slot đó.

Mọi thứ bên trong thẻ `<slot>` lúc ban đầu được xem như **nội dung dự phòng**. Nội dung dự phòng được biên dịch trong scope của component con và chỉ được hiển thị nếu phần tử host là rỗng và không có nội dung gì để chèn vào.

Giả sử ta có một component gọi là `child-component` với template như sau:

``` html
<div>
  <h2>Lời của con</h2>
  <slot>
    Dòng này sẽ chỉ được hiển thị nếu không có
    nội dung nào được phân bố.
  </slot>
</div>
```

và một component cha sử dụng `child-component`:

``` html
<div>
  <h1>Lời của cha</h1>
  <p>
    “Theo cánh buồm đi mãi đến nơi xa,
    Sẽ có cây, có cửa, có nhà,
    Vẫn là đất nước của ta
    Những nơi đó cha chưa hề đi đến.”
  </p>
  <child-component>
    <p>
      “Cha mượn cho con buồm trắng nhé
      Để con đi”
    </p>
  </child-component>
</div>
```

Nội dung được render sẽ là:

``` html
<div>
  <h1>Lời của cha</h1>
  <p>
    “Theo cánh buồm đi mãi đến nơi xa,
    Sẽ có cây, có cửa, có nhà,
    Vẫn là đất nước của ta
    Những nơi đó cha chưa hề đi đến.”
  </p>
  <div>
    <h2>Lời của con</h2>
    <p>
      “Cha mượn cho con buồm trắng nhé
      Để con đi”
    </p>
  </div>
</div>
```

### Slot có tên

Các phần tử `<slot>` có một thuộc tính đặc biệt là `name` (tên). Thuộc tính này được dùng để tùy biến thêm về cách phân bố nội dung. Bạn có thể có nhiều slot với các tên khác nhau.  Một slot có tên sẽ khớp với bất kì phần tử nào có thuộc tính `slot` tương ứng nằm trong phần nội dung.

Ngoài ra chúng ta vẫn có thể dùng một slot không có tên để là **slot mặc định**. Những nội dung không khớp với bất kì slot nào sẽ được chèn vào slot này. Nếu trong template không có slot mặc định, bất cứ nội dung nào không khớp sẽ bị bỏ đi.

Ví dụ, giả sử chúng ta có một component gọi là `app-layout` với template như sau:

``` html
<div class="container">
  <header>
    <!-- đây là một slot có tên -->
    <slot name="header"></slot>
  </header>
  <main>
    <!--
      đây là slot mặc định, slot không tên,
      ta cũng có thể gọi là slot của Vũ Thành An
    -->
    <slot></slot>
  </main>
  <footer>
    <!-- đây lại là một slot có tên -->
    <slot name="footer"></slot>
  </footer>
</div>
```

HTML của cha trông như sau:

``` html
<app-layout>
  <!-- nội dung này sẽ được chèn vào slot "header" -->
  <h1 slot="header">Tiêu đề của trang</h1>

  <!-- nội dung này sẽ được chèn vào slot mặc định -->
  <p>Một đoạn nội dung.</p>
  <p>Thêm một đoạn nữa cho dài.</p>

  <!-- nội dung này sẽ được chèn vào slot "footer" -->
  <p slot="footer">Thông tin liên hệ</p>
</app-layout>
```

Kết quả cuối cùng sẽ là:

``` html
<div class="container">
  <header>
    <h1>Tiêu đề của trang</h1>
  </header>
  <main>
    <p>Một đoạn nội dung.</p>
    <p>Thêm một đoạn nữa cho dài.</p>
  </main>
  <footer>
    <p>Thông tin liên hệ</p>
  </footer>
</div>
```

API phân bố nội dung là một cơ chế rất mạnh dùng để biên soạn những component được dùng chung với nhau.

### Scoped slot

> 2.1.0+

Scoped slot (slot có phạm vi) là một loại slot đặc biệt, hoạt động như một tempate tái sử dụng được (và có thể nhận dữ liệu tùy biến) thay vì một phần tử đã render sẵn.

Trong một component con, bạn có thể truyền dữ liệu vào slot giống như truyền prop vào component:

``` html
<div class="child">
  <slot text="Con chào cha"></slot>
</div>
```

Trong đối tượng cha, một phần tử `<template>` với thuộc tính đặc biệt `slot-scope` phải được khai báo, chỉ rõ rằng đây là template cho một scoped slot. Giá trị của `slot-scope` sẽ được dùng làm tên của một biến tạm chứa object props được truyền từ component con:

``` html
<div class="parent">
  <child>
    <!-- ở đây ta đặt tên biến tạm là `props` -->
    <template scope="props">
      <span>Cha chào con</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```

Kết quả được render của ví dụ trên sẽ là:

``` html
<div class="parent">
  <div class="child">
    <span>Cha chào con</span>
    <span>Con chào cha</span>
  </div>
</div>
```

> Từ bản 2.5.0 trở đi, `slot-scope` có thể được dùng trên bất kì phần tử web hoặc component nào, không chỉ `<template>`.

Một ví dụ điển hình hơn cho scoped slot là một danh sách các component cho phép người dùng tùy biến hiển thị của từng item:

``` html
<my-awesome-list :items="items">
  <!-- scoped slot cũng có thể có tên -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```

Và đây là template của component `my-awesome-list`:

``` html
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- nội dung dự phòng -->
  </slot>
</ul>
```

#### Destructure

Giá trị của `slot-scope` thật ra là một biểu thức JavaScript hợp lệ – có thể dùng làm tham số cho một hàm. Điều này có nghĩa là trong các môi trường được hỗ trợ (như single-file component hay các trình duyệt hiện đại) bạn có thể dùng tính năng destructure của ES2015 trong biểu thức:

``` html
<child>
  <span slot-scope="{ text }">{{ text }}</span>
</child>
```

## Component động

Dùng một phần tử `<component>` và thuộc tính `is` được bind động, bạn có thể chuyển đổi một cách linh hoạt giữa nhiều component.

``` js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component v-bind:is="currentView">
  <!-- component thay đổi khi vm.currentView thay đổi! -->
</component>
```

Nếu muốn, bạn cũng có thể bind trực tiếp vào các object component:

``` js
var Home = {
  template: '<p>Đã bấy lâu nay bác tới nhà</p>'
}

var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

### `keep-alive`

Khi chuyển đổi giữa các component, giữ các component đã bị thay thế trong bộ nhớ để bảo lưu trạng thái hoặc tránh phải render lại, bạn có thể chứa một component động bên trong thẻ `<keep-alive>`:

``` html
<keep-alive>
  <component :is="currentView">
    <!-- component bị thay thế sẽ được cache lại -->
  </component>
</keep-alive>
```

Đọc thêm về `<keep-alive>` trong phần [API](../api/#keep-alive).

## Khác

### Viết component sử dụng lại được

Khi viết một component, hãy luôn nghĩ đến việc bạn có muốn sử dụng lại component đó ở một nơi nào khác sau này hay không. Nếu chỉ để dùng một lần thì component bạn đang viết có thể được gắn chặt (tightly coupled) với ngữ cảnh hiện hành, nhưng nếu để dùng lại về sau thì component cần phải định nghĩa một giao diện (interface) rõ ràng và không có bất cứ giả định nào về ngữ cảnh xung quanh.

API dành cho một component trong Vue gồm có ba phần - prop, sự kiện, và slot:

- **Prop** cho phép môi trường bên ngoài truyền dữ liệu vào trong component.

- **Sự kiện** cho phép component kích hoạt side effect (hiệu ứng lề) ở môi trường bên ngoài.

- **Slot** cho phép môi trường bên ngoài thêm nội dung vào component.

Với cú pháp tắt cho `v-bind` và `v-on`, những mục tiêu này có thể được truyền tải một cách rõ ràng và súc tích trong template:

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Xin chào!</p>
</my-component>
```

### Ref cho component con

Mặc dù đã có prop và sự kiện, đôi khi bạn vẫn cần truy xuất trực tiếp đến một component trong JavaScript. Để làm điều này, bạn cần gán một tham chiếu cho component con với thuộc tính `ref`. Ví dụ:

``` html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// truy xuất đến component con
var child = parent.$refs.profile
```

Khi dùng chung với `v-for`, giá trị ref bạn nhận được sẽ là một mảng chứa các component con tương ứng với nguồn dữ liệu.

<p class="tip">`$refs` sẽ chỉ có giá trị sau khi component đã được render, và giá trị này không reactive. Bạn chỉ nên sử dụng `$refs` như là một biện pháp bất đắc dĩ để truy xuất đến component con.</p>

### Component không đồng bộ

Trong những ứng dụng lớn, chúng ta có thể phải chia ứng dụng ra thành nhiều phần nhỏ và chỉ tải một component từ server xuống khi cần thiết. Để hỗ trợ điều này, Vue cho phép bạn định nghĩa component bằng một hàm factory, hàm này sẽ chịu trách nhiệm resolve (phân giải) một cách không đồng bộ (async) định nghĩa về component của bạn. Vue sẽ chỉ kích hoạt hàm factory này khi component thật sự cần được render, và sẽ cache lại kết quả cho những lần render tiếp theo. Ví dụ:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Truyền định nghĩa của component cho hàm callback
    resolve({
      template: '<div>Nội dung này được tải không đồng bộ.</div>'
    })
  }, 1000)
})
```

Như trên cho thấy, hàm factory nhận vào một hàm callback `resolve`. Bạn sẽ gọi hàm `resolve` sau khi tải xong định nghĩa của component từ server về. Bạn cũng có thể gọi `reject(reason)` để chỉ định là việc tải từ server đã thất bại. Hàm `setTimeout` ở đây chỉ có ý nghĩa demo; bạn có thể tải component theo bất kì cách nào mình muốn. Một hướng tiếp cận mà chúng tôi khuyên dùng là sử dụng component không đồng bộ với tính năng [code-splitting](https://webpack.js.org/guides/code-splitting/) của Webpack:

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Cú pháp `require` đặc biệt này sẽ hướng dẫn cho Webpack
  // tự động chia code được build của bạn ra thành các gói nhỏ hơn
  // (bundle) để tải về bằng AJAX.
  require(['./my-async-component'], resolve)
})
```

Bạn cũng có thể trả về một `Promise` bên trong hàm factory, nên với cú pháp Webpack 2 + ES2015 bạn có thể viết như sau:

``` js
Vue.component(
  'async-webpack-example',
  // Hàm `import` trả về một `Promise`.
  () => import('./my-async-component')
)
```

Khi [đăng kí component ở cấp cục bộ](components.html#Dang-ki-o-cap-cuc-bo), bạn cũng có thể cung cấp một hàm trả về `Promise` một cách trực tiếp:

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">Nếu bạn sử dụng <strong>Browserify</strong> và muốn dùng component không đồng bộ, đáng tiếc là tác giả của Browserify đã [nói rõ](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) rằng tải không đồng bộ "sẽ không bao giờ được Browserify chính thức hỗ trợ." Cộng đồng Browserify đã tìm ra [một vài cách giải quyết](https://github.com/vuejs/vuejs.org/issues/620) có thể có ích cho những ứng dụng có sẵn và phức tạp. Trong những trường hợp khác (viết ứng dụng mới, hoặc ứng dụng sẵn có đủ đơn giản), chúng tôi khuyên bạn nên sử dụng Webpack.</p>

### Component không đồng bộ nâng cao

> 2.3.0+

Bắt đầu từ bản 2.3.0, factory cho component không đồng bộ có thể trả về một object với định dạng sau:

``` js
const AsyncComp = () => ({
  // Component cần tải. Nên là một Promise
  component: import('./MyComp.vue'),
  // Component để dùng khi đang tải component không đồng bộ trên đây,
  // tạm gọi là "component tải"
  loading: LoadingComp,
  // Component dùng khi tải bị lỗi, tạm gọi là "component lỗi"
  error: ErrorComp,
  // Khoảng thời gian đợi (delay) trước khi hiển thị component tải
  // Mặc định là 200ms.
  delay: 200,
  // Thời gian đợi trước khi hiện component lỗi
  // Mặc định là Infinity
  timeout: 3000
})
```

Lưu ý rằng khi dùng như một route component trong `vue-router`, những thuộc tính này sẽ bị bỏ qua vì component không đồng bộ sẽ được resolve trước khi việc chuyển route xảy ra. Bạn cũng cần phiên bản `vue-router` 2.4.0 trở đi nếu muốn sử dụng cú pháp trên đây cho route component.

### Quy chuẩn đặt tên cho component

Khi đăng kí component (hoặc prop), bạn có thể dùng kebab-case, camelCase, hoặc PascalCase.

``` js
components: {
  // dùng kebab-case
  'kebab-cased-component': { /* ... */ },
  // dùng camelCase
  'camelCasedComponent': { /* ... */ },
  // dùng PascalCase
  'PascalCasedComponent': { /* ... */ }
}
```

Tuy nhiên, trong template HTML, bạn phải dùng phiên bản kebab-case cho tên component:

``` html
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<pascal-cased-component></pascal-cased-component>
```

Khi sử dụng _string_ template, chúng ta không bị hạn chế bởi đặc tính không phân biệt hoa thường của HTML. Điều này có nghĩa là ngay cả trong template, bạn vẫn có thể tham chiếu đến component bằng:

- kebab-case
- camelCase hoặc kebab-case nếu component được định nghĩa bằng camelCase
- kebab-case, camelCase hoặc PascalCase nếu component đã được định nghĩa bằng PascalCase

``` js
components: {
  'kebab-cased-component': { /* ... */ },
  camelCasedComponent: { /* ... */ },
  PascalCasedComponent: { /* ... */ }
}
```

``` html
<kebab-cased-component></kebab-cased-component>

<camel-cased-component></camel-cased-component>
<camelCasedComponent></camelCasedComponent>

<pascal-cased-component></pascal-cased-component>
<pascalCasedComponent></pascalCasedComponent>
<PascalCasedComponent></PascalCasedComponent>
```

Điều này có nghĩa là PascalCase là _quy chuẩn khai báo_ thông dụng nhất, và kebab-case là _quy chuẩn sử dụng_ thông dụng nhất.

Nếu component của bạn không nhận nội dung thông qua `slot`, bạn còn có thể dùng dưới dạng thẻ tự đóng (self-closed) bằng kí tự `/`:

``` html
<my-component/>
```

Một lần nữa, cách này chỉ hoạt động với string template, vì trình duyệt không chấp nhận và sẽ không hiểu định dạng tự đóng đối với các phần tử tùy biến.

### Component đệ quy

Một component có thể tự chứa và gọi bản thân một cách đệ quy nếu bạn khai báo cho nó một thuộc tính `name`:

``` js
name: 'con-kien-ma-leo-canh-da'
```

Khi bạn đăng kí component ở cấp toàn cục bằng lệnh `Vue.component`, một ID toàn cục sẽ được tự động gán vào `name`.

``` js
Vue.component('con-kien-ma-leo-canh-da', {
  // ...
})
```

Nếu bạn không cẩn thận, component đệ quy có thể dẫn đến lặp vô tận.

``` js
name: 'bi-ngo-la-co-dau-nanh',
template: '<div><bi-ngo-la-co-dau-nanh/></div>'
```

Một component như trên sẽ gây ra lỗi "max stack size exceeded", vì vậy hãy bảo đảm việc gọi đệ quy là có điều kiện (ví dụ sử dụng `v-if` và đến một lúc nào đó thì trả về `false`).

### Tham chiếu xoay vòng giữa các component

Giả sử bạn bạn đang xây dựng một cây thư mục tương tự như File Explorer của Windows hoặc Finder của Mac. Bạn có lẽ sẽ có một component `tree-folder` với template sau:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

và một component `tree-folder-contents` component với template sau:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

Nếu nhìn kĩ, bạn sẽ nhận ra rằng các component này thực tế sẽ _chứa lẫn nhau_ trong cây thư mục được render - điều này có thể coi là một nghịch lí (paradox). Nếu bạn đăng kí component ở cấp toàn cục với `Vue.component`, nghịch lí này sẽ được Vue giải quyết một cách tự động, và bạn có thể ngừng đọc tiếp ở đây.

Tuy nhiên, nếu đang nhúng component bằng lệnh `require` hoặc `import` trong một __hệ thống module__ bằng Webpack hoặc Browserify, bạn sẽ bị báo lỗi:

```
Failed to mount component: template or render function not defined.
```

Để hiểu việc gì đang xảy ra, hãy gọi hai component ta đang có là A và B. Hệ thống module thấy rằng nó cần A, nhưng A lại cần B, nhưng B lại cần A, nhưng A lại cần B, và cứ thế mãi. Thành ra hệ thống này bị kẹt trong một vòng lặp vô tận, không biết phải resolve component nào trước. Để giải quyết vấn đề này, ta cần cung cấp cho hệ thống một điểm quyết định mà tại đó nó có thể nhận ra rằng "_Cuối cùng thì_ A sẽ cần B, nhưng hiện thì chưa cần phải resolve B trước."

Trở lại ví dụ của chúng ta, hãy tạo điểm quyết định đó trong component `tree-folder`. Biết rằng component con sẽ tạo nên nghịch lí là `tree-folder-contents`, chúng ta sẽ đợi đến hook vòng đời `beforeCreate` để đăng kí component này thay vì đăng kí ngay từ đầu:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

Thế là vấn đề đã được giải quyết!

### Inline Template

Khi ta đặt thuộc tính đặc biệt `inline-template` vào một component con, component này sẽ dùng nội dung của nó làm template thay vì coi là nội dung được phân phối. Điều này giúp cho việc biên soạn template được linh hoạt hơn.

``` html
<my-component inline-template>
  <div>
    <p>Những nội dung này được dùng làm template.</p>
  </div>
</my-component>
```

Tuy nhiên, `inline-template` khiến cho scope của template khó quản lí và theo dõi hơn. Tốt nhất hãy luôn định nghĩa component với tùy chọn `template` hoặc sử dụng thẻ `template` trong một file `.vue`.

### X-Template

Một cách nữa để định nghĩa template là chứa trong một thẻ `<script>` có thuộc tính `type` là `text/x-template`, sau đó tham chiếu đến template này bằng ID. Ví dụ:

``` html
<script type="text/x-template" id="teen-spirit-template">
  <p>Hello hello hello how low</p>
</script>
```

``` js
Vue.component('teen-spirit', {
  template: '#teen-spirit-template'
})
```

Cách này có thể hữu ích cho những demo có template lớn hoặc cho những ứng dụng vô cùng nhỏ, nhưng với những trường hợp khác thì nên tránh,  vì template bị tách riêng ra khỏi phần còn lại của định nghĩa cho component.

### Component với `v-once`

Vue render các phần tử HTML rất nhanh, nhưng đôi khi bạn muốn một component chứa **rất nhiều** nội dung tĩnh. Những lúc này, bạn có thể bảo đảm component được xử lí chỉ một lần rồi cache lại, bằng cách thêm directive `v-once` vào phần tử gốc của component như sau:

``` js
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Điều khoản dịch vụ</h1>\
      ... Rất nhiều nội dung tĩnh ...\
      ... mà thật sự ...\
      ... không có ai ...\
      ... buồn ...\
      ... đọc ...\
      ... cả ...\
    </div>\
  '
})
```
