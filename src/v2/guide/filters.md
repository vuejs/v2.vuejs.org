---
title: Filter
type: guide
order: 305
---

Vue cho phép bạn định nghĩa các filter (bộ lọc) dùng để áp dụng các định dạng văn bản thường gặp. Bạn có thể sử dụng filter ở hai chỗ: **trong thẻ mustache** và **trong các biểu thức `v-bind`** (trường hợp sau này được hỗ trợ từ phiên bản 2.1.0 trở đi). Filter được đặt ở cuối một biểu thức JavaScript,  should be appended to the end of the JavaScript expression, biểu thị bằng kí hiệu `|`:

``` html
<!-- trong thẻ mustache -->
{{ message | capitalize }}

<!-- trong v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

Bạn có thể định nghĩa filter ở cấp cục bộ trong tùy chọn của một component:

``` js
filters: {
  /** Viết hoa chữ đầu tiên */
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

hoặc định nghĩa ở cấp toàn cục trước khi khởi tạo một đối tượng Vue:

``` js
/** Viết hoa chữ đầu tiên */
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

Sau đây là một ví dụ sử dụng filter `capitalize` trên:

{% raw %}
<div id="example_1" class="demo">
  <input type="text" v-model="message" placeholder="Nhập vào một câu">
  <p>{{ message | capitalize }}</p>
</div>
<script>
  new Vue({
    el: '#example_1',
    data: function () {
      return {
        message: 'đầu câu thì viết hoa'
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  })
</script>
{% endraw %}

Hàm filter luôn nhận giá trị của biểu thức làm tham số đầu tiên. Trong ví dụ trên, hàm `capitalize` sẽ nhận tham số đầu tiên là giá trị của `message`.

Ta cũng có thể nối các filter với nhau:

``` html
{{ message | filterA | filterB }}
```

Trong ví dụ này, hàm `filterA` sẽ nhận giá trị của `message` làm tham số, sau đó hàm `filterB` sẽ được gọi với tham số là giá trị trả về của `filterA`.

Vì đơn giản chỉ là hàm JavaScript nên filter có thể nhận tham số:

``` html
{{ message | filterA('value 1', arg2) }}
```

Ở đây `filterA` được định nghĩa dưới dạng một hàm nhận vào ba tham số theo thứ tự sau:

1. Giá trị của `message`
2. Chuỗi `'value 1'`
3. Giá trị của biểu thức `arg2`
