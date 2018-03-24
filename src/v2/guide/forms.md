---
title: Ràng buộc form input
type: guide
order: 10
---

## Cách sử dụng cơ bản

Bạn có thể sử dụng directive `v-model` để tạo ràng buộc dữ liệu 2 chiều lên các phần tử form input và textarea. Vue sẽ tự động chọn cách phù hợp để cập nhật phần tử này dựa trên kiểu của input. Có một chút ma thuật, `v-model` là syntax sugar trong việc cập nhật dữ liệu dựa trên các sự kiện input từ người dùng kèm theo một số trường hợp đặc biệt khác.

<p class="tip">`v-model` sẽ bỏ qua giá trị khởi tạo của các thuộc tính `value`, `checked` hoặc `selected` trong mọi phần tử form. Nó luôn luôn xem data trong đối tượng Vue là nguồn đáng tin cậy duy nhất. Bạn nên khai báo các giá trị khởi tạo trong JavaScript, bên trong option `data` của component.</p>

<p class="tip" id="vmodel-ime-tip">Đối với các ngôn ngữ đòi hỏi bộ gõ ([IME](https://en.wikipedia.org/wiki/Input_method)) (tiếng Trung, tiếng Nhật, Tiếng Hàn v.v.), bạn sẽ nhận thấy rằng `v-model` không thay đổi trong quá trình biên soạn của IME. Nếu bạn muốn nhận các thay đổi này thì phải sử dụng sự kiện `input`.</p>

### Văn bản

``` html
<input v-model="message" placeholder="edit me">
<p>Thông điệp: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="Nhập văn bản">
  <p>Thông điệp: {{ message }}</p>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

### Văn bản nhiều dòng

``` html
<span>Thông điệp có nhiều dòng:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="Nhập văn bản có nhiều dòng"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Thông điệp có nhiều dòng:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="Nhập văn bản có nhiều dòng"></textarea>
</div>
<script>
new Vue({
  el: '#example-textarea',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

{% raw %}
<p class="tip">Nội suy (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) không hoạt động với textarea. Hãy sử dụng <code>v-model</code>.</p>
{% endraw %}

### Checkbox

Checkbox đơn, giá trị boolean:

``` html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```
{% raw %}
<div id="example-2" class="demo">
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">{{ checked }}</label>
</div>
<script>
new Vue({
  el: '#example-2',
  data: {
    checked: false
  }
})
</script>
{% endraw %}

Nhiều checkbox, ràng buộc vào cùng một mảng:

``` html
<div id='example-3'>
  <input type="checkbox" id="com-chien-toi" value="Cơm chiên tỏi" v-model="checkedNames">
  <label for="com-chien-toi">Cơm chiên tỏi</label><br>
  <input type="checkbox" id="dot-bi-xao-toi" value="Đọt bí xào tỏi" v-model="checkedNames">
  <label for="dot-bi-xao-toi">Đọt bí xào tỏi</label><br>
  <input type="checkbox" id="canh-rau-rung" value="Canh rau rừng" v-model="checkedNames">
  <label for="canh-rau-rung">Canh rau rừng</label>
  <br>
  <span>Món đã chọn: {{ checkedNames }}</span>
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="com-chien-toi" value="Cơm chiên tỏi" v-model="checkedNames">
  <label for="com-chien-toi">Cơm chiên tỏi</label><br>
  <input type="checkbox" id="dot-bi-xao-toi" value="Đọt bí xào tỏi" v-model="checkedNames">
  <label for="dot-bi-xao-toi">Đọt bí xào tỏi</label><br>
  <input type="checkbox" id="canh-rau-rung" value="Canh rau rừng" v-model="checkedNames">
  <label for="canh-rau-rung">Canh rau rừng</label>
  <br>
  <span>Món đã chọn: {{ checkedNames }}</span>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
</script>
{% endraw %}

### Radio

``` html
<input type="radio" id="cac-mon-rau" value="Các món rau" v-model="picked">
<label for="cac-mon-rau">Các món rau</label><br>
<input type="radio" id="cac-mon-thit" value="Các món thịt" v-model="picked">
<label for="cac-mon-thit">Các món thịt</label><br>
<span>Đã chọn: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="cac-mon-rau" value="Các món rau" v-model="picked">
  <label for="cac-mon-rau">Các món rau</label><br>
  <input type="radio" id="cac-mon-thit" value="Các món thịt" v-model="picked">
  <label for="cac-mon-thit">Các món thịt</label><br>
  <span>Đã chọn: {{ picked }}</span>
</div>
<script>
new Vue({
  el: '#example-4',
  data: {
    picked: ''
  }
})
</script>
{% endraw %}

### Select

Select đơn:

``` html
<select v-model="selected">
  <option disabled value="">Vui lòng chọn món</option>
  <option>Đọt bí xào tỏi</option>
  <option>Canh bông điên điển</option>
  <option>Lẩu nấm</option>
</select>
<span>Món đã chọn: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: ''
  }
})
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
      <option disabled value="">Vui lòng chọn món</option>
      <option>Đọt bí xào tỏi</option>
      <option>Canh bông điên điển</option>
      <option>Lẩu nấm</option>
  </select><br>
  <span>Món đã chọn: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: ''
  }
})
</script>
{% endraw %}

<p class="tip">Nếu giá trị khởi tạo của biểu thức trong `v-model` không khớp với bất kỳ option nào, thì `<select>` sẽ render ở trạng thái "chưa được chọn". Trên iOS nó sẽ làm cho người dùng không thể chọn item đầu tiên bởi vì iOS không gọi sự kiện change trong trường hợp này. Do đó chúng tôi khuyên bạn nên thêm một lựa chọn có giá trị rỗng giống như trong ví dụ trên.</p>

Select nhiều lựa chọn (được ràng buộc với một mảng):

``` html
<select v-model="selected" multiple>
   <option>Đọt bí xào tỏi</option>
   <option>Canh bông điên điển</option>
   <option>Lẩu nấm</option>
</select>
<br>
<span>Món đã chọn: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 150px;">
    <option>Đọt bí xào tỏi</option>
    <option>Canh bông điên điển</option>
    <option>Lẩu nấm</option>
  </select>
  <br>
  <span>Món đã chọn: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-6',
  data: {
    selected: []
  }
})
</script>
{% endraw %}

Render `<option>` với `v-for`:

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Giá tiền: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: '50k',
    options: [
      { text: 'Đọt bí xào tỏi', value: '50k' },
      { text: 'Canh bông điên điển', value: '30k' },
      { text: 'Lẩu nấm', value: '45k' }
    ]
  }
})
```
{% raw %}
<div id="example-7" class="demo">
  <select v-model="selected">
    <option v-for="option in options" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Giá tiền: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: '50k',
    options: [
      { text: 'Đọt bí xào tỏi', value: '50k' },
      { text: 'Canh bông điên điển', value: '30k' },
      { text: 'Lẩu nấm', value: '45k' }
    ]
  }
})
</script>
{% endraw %}

## Ràng buộc giá trị

Đối với radio, checkbox và select option, `v-model` thường ràng buộc giá trị kiểu chuỗi tĩnh (hoặc boolean đối với checkbox):

``` html
<!-- `picked` sẽ là chuỗi "a" khi được check -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` có thể là true hoặc false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` sẽ là chuỗi "abc" khi được chọn -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Nhưng đôi khi chúng ta muốn ràng buộc giá trị với một thuộc tính động trong đối tượng Vue. Chúng ta có thể sử dụng `v-bind` để làm điều này. Thêm nữa, sử dụng `v-bind` còn cho phép ràng buộc giá trị của input với các trị không phải kiểu chuỗi.

### Checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>
```

``` js
// khi được check:
vm.toggle === 'yes'
// khi không được check:
vm.toggle === 'no'
```

<p class="tip">Các thuộc tính `true-value` và `false-value` không ảnh hưởng đến thuộc tính `value` của input, vì trình duyệt không gủi kèm theo các checkbox không được check khi submit form. Để đảm bảo một trong hai giá trị này được submit cùng với form (ví dụ "yes" hoặc "no"), hãy dùng input dạng radio thay thế.</p>

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// khi được check:
vm.pick === vm.a
```

### Select option

``` html
<select v-model="selected">
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// khi được chọn:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Modifier

### `.lazy`

Mặc định, `v-model` đồng bộ giá trị của input với dữ liệu sau sự kiện `input` (có ngoại lệ đối với trường hợp bộ gõ như [đã nói ở trên](#vmodel-ime-tip)). Bạn có thể thêm modifier `lazy` để đồng bộ sau sự kiện `change`:

``` html
<!-- được đồng bộ sau sự kiện "change" thay vì "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Nếu bạn muốn giá trị từ input được tự động chuyển kiểu về kiểu số, bạn có thể thêm modifier `number` vào `v-model`:

``` html
<input v-model.number="age" type="number">
```

Điều này rất hữu ích, vì kể cả khi input có `type="number"` thì giá trị được trả về của nó luôn luôn là chuỗi.

### `.trim`

Dùng để tự động loại bỏ khoảng trắng trước và sau giá trị trong input.

```html
<input v-model.trim="msg">
```

## `v-model` với Component

> Nếu bạn chưa quen với Vue component, bạn có thể bỏ qua phần này.

Không phải lúc nào các kiểu input có sẵn của HTML cũng có thể đáp ứng nhu cầu của bạn. May mắn là các component của Vue cho phép bạn xây dựng các input riêng tái sử dụng được với các hành vi (behavior) được tùy chỉnh hoàn toàn. Các input này thậm chí còn hoạt động với `v-model`.
