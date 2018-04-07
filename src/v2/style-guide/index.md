---
title: Hướng dẫn về phong cách viết
type: style-guide
---

Đây là bản hướng dẫn về phong cách viết (style guide) chính thức dành cho code Vue. Nếu bạn dùng Vue trong dự án của mình, bản hướng dẫn này sẽ là một tham chiếu hữu ích giúp tránh xảy ra lỗi, anti-pattern, hoặc phí thời gian vào những tranh cãi không đáng có. Tất nhiên, chúng tôi cũng tin rằng không có style guide nào là hoàn hảo cho tất cả các team hoặc dự án, vì thế bạn nên điều chỉnh tùy theo kinh nghiệm, thiết lập kĩ thuật, và khả năng cá nhân của từng người.  

Chúng tôi cũng sẽ tránh các đề nghị về JavaScript và HTML nói chung. Việc bạn dùng hay không dùng dấu chấm phẩy, dùng nháy đơn hay dấu kép cho thuộc tính HTML, đối với chúng tôi là không quan trọng. Tuy nhiên cũng sẽ có một số ngoại lệ khi chúng tôi nhận thấy một kiểu mẫu (pattern) cụ thể nào đó có thể có ích hơn trong ngữ cảnh của Vue.

> **Sắp tới chúng tôi cũng sẽ cung cấp gợi ý về các quy định bắt buộc.** Đôi khi bạn cần kỉ luật trong dự án của mình, nhưng bất cứ khi nào có thể, chúng tôi sẽ cố gắng hướng dẫn cách sử dụng ESLint và các quy trình tự động khác để đơn giản hóa việc bảo đảm tuân thủ các quy định này.

Cuối cùng, chúng tôi cũng đã chia các quy tắc thành 4 loại:


## Phân loại quy tắc

### Mức ưu tiên A: Thiết yếu

Các quy tắc này giúp tránh xảy ra lỗi, vì vậy hãy học và làm theo bằng bất cứ giá nào. Ngoại lệ nếu có cũng sẽ rất hiếm, và chỉ có thể xảy ra với những ai có kiến thức sâu sắc về cả JavaScript và Vue.

### Mức ưu tiên B: Rất khuyết khích

Các quy tắc này giúp code dễ đọc hơn và/hoặc tăng cường trải nghiệm của lập trình viên trong phần lớn các dự án. Nếu bạn vi phạm các quy tắc này, code vẫn sẽ chạy, tuy nhiên nên tránh vi phạm trừ phi có lí do chính đáng.

### Mức ưu tiên C: Khuyến khích

Chúng ta có thể tự ý chọn một trong nhiều lựa chọn tốt ngang nhau để bảo đảm tính nhất quán. Trong các quy tắc này, chúng tôi sẽ mô tả từng lựa chọn được chấp nhận và đề nghị chọn một lựa chọn mặc định. Điều này có nghĩa là bạn hoàn toàn có thể chọn một lựa chọn khác cho dự án của mình, miễn là đảm bảo thống nhất và có lí do chính đáng. Việc có lí do chính đáng là rất quan trọng, vì khi tuân thủ theo tiêu chuẩn chung, bạn sẽ:

1. hiểu nhanh hơn khi đọc code của mọi người 
2. có thể copy và paste phần lớn code của cộng đồng mà không cần phải chỉnh sửa gì
3. dễ tuyển được người đã quen với phong cách viết code mà bạn muốn, ít nhất là khi dùng Vue

### Mức ưu tiên D: Thận trọng khi dùng

Một số tính năng của Vue được phát triển để hỗ trợ trong những tình huống hiếm gặp (edge case) hoặc để giúp cho việc nâng cấp một dự án cũ được dễ dàng hơn. Những tính năng này nếu lạm dụng có thể làm cho code của bạn trở nên khó bảo trì, hoặc thậm chí trở thành nguồn gây ra lỗi. Các quy tắc trong mức ưu tiên D giải thích thêm về những tính năng có nguy cơ rủi ro này, đồng thời hướng dẫn cho bạn biết nên tránh ở đâu và lúc nào.


## Các quy tắc mức A: Thiết yếu (tránh lỗi)

### Đặt tên component dùng nhiều từ <sup data-p="a">thiết yếu</sup>

**Tên component nên dùng hai từ (đơn) trở lên, ngoại trừ component gốc `App`.**

Việc này giúp [tránh xung đột](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name) với các phần tử HTML hiện tại và tương lai, vì tất cả các phần tử HTML đều là từ đơn. 

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
Vue.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
Vue.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
{% raw %}</div>{% endraw %}



### `data` trong component <sup data-p="a">thiết yếu</sup>

**Tùy chọn `data` trong một component phải là một hàm.**

Khi dùng thuộc tính `data` trong một component (nghĩa là ở bất cứ đâu trừ `new Vue`), giá trị của nó phải là một hàm trả về một object.

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Nếu là một object, giá trị của `data` sẽ được dùng chung bởi tất cả các đối tượng khởi tạo của component. Thử tưởng tượng, chúng ta có một component `TodoList` với `data` như sau:

``` js
data: {
  listTitle: '',
  todos: []
}
```

Chúng ta muốn tái sử dụng component này, cho phép người dùng quản lí nhiều danh sách (mua hàng, kế hoạch chi tiêu, thời khóa biểu vân vân). Tuy nhiên, ở đây có một vấn đề. Vì tất cả các đối tượng khởi tạo của `TodoList` đều tham chiếu đến cùng một object `data`, thay đổi tiêu đề của danh sách này sẽ làm toàn bộ tiêu đề của các danh sách khác thay đổi theo. Điều tương tự cũng sẽ xảy ra khi bạn thêm/sửa/xóa mục nào đó trong một danh sách bất kì.

Thay vào đó, chúng ta muốn cho mỗi đối tượng component quản lí một dữ liệu riêng. Để làm việc này, mỗi đối tượng phải tạo một object `data` độc nhất. Trong JavaScript, chúng ta có thể đạt được điều này bằng cách trả về một object từ một hàm:

``` js
data: function () {
  return {
    listTitle: '',
    todos: []
  }
}
```
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

``` js
export default {
  data: {
    foo: 'bar'
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên
``` js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

``` js
// Trong một file .vue
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

``` js
// Với đối tượng Vue gốc, bạn có thể dùng object,
// vì chỉ có một đối tượng như thế này trong toàn bộ app.
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}



### Định nghĩa cho prop <sup data-p="a">thiết yếu</sup>

**Định nghĩa cho prop càng chi tiết càng tốt.**

Trong code được commit, định nghĩa cho prop nên chi tiết đến mức có thể. Ít nhất bạn phải chỉ định kiểu dữ liệu của prop.

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

[Định nghĩa prop](https://vi.vuejs.org/v2/guide/components.html#Kiem-chung-prop) chi tiết có hai lợi ích: 

- API của component được document, giúp hiểu dễ dàng hơn về cách dùng component.
- Khi code ở chế độ development, Vue sẽ cảnh báo nếu prop được truyền vào không đúng định dạng, giúp bạn phát hiện các lỗi có thể xảy ra.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
// Như thế này chỉ OK khi viết prototype
props: ['status']
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
props: {
  status: String
}
```

``` js
// Càng tốt hơn! 
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}



### Dùng `key` cho `v-for` <sup data-p="a">thiết yếu</sup>

**Luôn dùng `key` với `v-for`.**

`key` cho `v-for` _luôn luôn_ là bắt buộc với component, để bảo đảm trạng thái bên trong của component và các component con. Ngay cả đối với các phần tử, việc này cũng giúp bảo đảm hành vi có thể đoán định được, ví dụ [tính bất biến của object](https://bost.ocks.org/mike/constancy/) trong animation.

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Ví dụ chúng ta có một danh sách todo:

``` js
data: function () {
  return {
    todos: [
      {
        id: 1,
        text: 'Học cách dùng v-for'
      },
      {
        id: 2,
        text: 'Học cách dùng key'
      }
    ]
  }
}
```

Sau đó bạn sắp xếp danh sách này theo thứ tự chữ cái. Khi cập nhật DOM, Vue sẽ tối ưu việc render để thực hiện những thay đổi DOM ít tốn kém nhất. Điều này có thể có nghĩa là xóa đi mục todo đầu tiên, rồi thêm nó vào lại ở cuối danh sách. 

Vấn đề là, có những trường hợp chúng ta không muốn xóa đi những phần tử mà cuối cùng vẫn sẽ tồn tại trong DOM. Ví dụ, bạn có thể muốn sử dụng `<transition-group>` để animate việc sắp xếp danh sách, hoặc muốn giữ focus nếu phần tử được render là một `<input>`. Trong những trường hợp này, thêm vào một `key` không trùng lặp cho mỗi item (ví dụ `:key="todo.id"`) sẽ hướng dẫn cho Vue xử lí theo hướng dễ đoán hơn.

Theo kinh nghiệm của chúng tôi, tốt nhất là _luôn luôn_ dùng một `key` không trùng lặp, sau đó đơn giản là bạn sẽ không bao giờ phải quan tâm đến các trường hợp hiếm gặp nữa. Sau đó, đối với những trường hợp mà hiệu suất là tối quan trọng và tính bất biến của object là không cần thiết, bạn có thể tạo ngoại lệ một cách có ý thức.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}


### Tránh dùng `v-if` chung với `v-for` <sup data-p="a">thiết yếu</sup>

**Đừng bao giờ dùng `v-if` trên cùng một phần tử với `v-for`.**

Có hai trường hợp thường gặp mà chúng ta có xu hướng làm như vậy:

- Để lọc các item từ một danh sách (ví dụ `v-for="user in users" v-if="user.isActive"`). Trong những trường hợp này, hãy thay thế `users` bằng một computed property trả về danh sách đã được lọc (ví dụ `activeUsers`).

- Để tránh hiển thị một danh sách mà ta muốn giấu (ví dụ `v-for="user in users" v-if="shouldShowUsers"`). Trong những trường hợp này, hãy chuyển `v-if` lên một phần tử cha (ví dụ `ul`, `ol`).

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Khi Vue xử lí các directive, `v-for` có độ ưu tiên cao hơn `v-if`, vì thế template sau đây:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

sẽ được phân tích như sau:

``` js
this.users.map(function (user) {
  if (user.isActive) {
    return user.name
  }
})
```

Vì thế cho dù có muốn render các phần tử cho một lượng nhỏ người dùng, chúng ta cũng sẽ phải duyệt qua toàn bộ danh sách mỗi khi render lại, bất kể số người dùng còn hoạt động (`isActive == true`) có thay đổi hay không.

Thay vào đó, bằng cách duyệt qua một computed property như sau:

``` js
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
      return user.isActive
    })
  }
}
```

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

chúng ta sẽ nhận được những lợi ích sau:

- Danh sách đã lọc sẽ _chỉ_ được tính toán lại nếu có thay đổi liên quan xảy ra với mảng `users`, nhờ đó giúp việc lọc danh sách trở nên hiệu quả hơn nhiều.
- Bằng việc dùng `v-for="user in activeUsers"`, chúng ta _chỉ_ duyệt qua danh sách những người dùng còn đang hoạt động, nhờ đó giúp việc render trở nên hiệu quả hơn nhiều.
- Logic được tách khỏi lớp giao diện người dùng (presentation layer) , giúp cho việc bảo trì (thay đổi / mở rộng logic) trở nên dễ dàng hơn nhiều.

Chúng ta cũng nhận được những lợi ích tương tự khi thay đổi:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

trở thành:

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Bằng cách chuyển `v-if` lên phần tử cha (`ul`), chúng ta không còn kiểm tra `shouldShowUsers` cho _mỗi_ người dùng trong danh sách nữa. Thay vào đó, chúng ta chỉ kiểm tra biến này đúng một lần, và nếu giá trị trả về là `false` thì khỏi phải chạy vòng lặp `v-for` làm gì cho mỏi.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}



### Thiết lập phạm vi cho `style` của component <sup data-p="a">thiết yếu</sup>

**Đối với các ứng dụng Vue, `style` trong component `App` cấp cao nhất và các component layout có thể có ảnh hưởng toàn cục, nhưng tất cả các component khác luôn luôn nên được thiết lập phạm vi.**

Quy tắc này chỉ áp dụng cho [single-file component](../guide/single-file-components.html). Chúng ta có thể đạt được điều này bằng cách dùng [thuộc tính `scoped`](https://vue-loader.vuejs.org/en/features/scoped-css.html), [CSS module](https://vue-loader.vuejs.org/en/features/css-modules.html), một kĩ thuật quản lí CSS dựa trên tên class như [BEM](http://getbem.com/), hoặc một quy ước / thư viện khác.

**Tuy vậy, các thư viện component nên sử dụng kĩ thuật quản lí CSS thay vì sử dụng thuộc tính `scoped`.**

Điều này giúp cho việc override các style nội bộ được dễ dàng hơn, với các tên class dễ đọc, không cần phải quá đặc trưng nhưng vẫn rất khó tạo ra xung đột.

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Nếu bạn đang phát triển một dự án lớn, làm việc chung với nhiều lập trình viên, hoặc thỉnh thoảng nhúng HTML/CSS của bên thứ 3 (như Auth0), việc thiết lập phạm vi một cách nhất quán sẽ bảo đảm các style CSS sẽ chỉ được áp dụng cho đúng những component mà ta mong muốn.

Ngoài thuộc tính `scoped`, sử dụng tên class độc nhất cũng giúp đảm bảo CSS của bên thứ ba không ảnh hưởng đến HTML của bạn. Ví dụ, rất nhiều dự án (Bootstrap, Foundation…) sử dụng các tên class như `button`, `btn`, hay `icon`, vì thế cho dù có không dùng một kĩ thuật như BEM, thêm vào một tiền tố riêng cho ứng dụng hoặc component (như `ButtonClose-icon`) cũng sẽ cung cấp thêm một lớp bảo vệ.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<template>
  <button class="button button-close">X</button>
</template>

<!-- Dùng thuộc tính `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">X</button>
</template>

<!-- Dùng CSS module -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">X</button>
</template>

<!-- Dùng quy chuẩn BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Đặc tên cho private property <sup data-p="a">thiết yếu</sup>

**Luôn luôn dùng tiền tố `$_` cho các private property trong một plugin, mixin vân vân. Tiếp theo, để tránh xung đột với code của các tác giả thư viện khác, thêm vào một phạm vi được định danh (ví dụ `$_tênPluginCủaBạn_`).**

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Vue sử dụng tiền tố `_` để định nghĩa private property cho chính nó, vì thế sử dụng cùng tiền tố này (ví dụ `_update`) có nguy cơ ghi đè một thuộc tính có sẵn của đối tượng Vue. Cho dù bạn có kiểm tra và xác định hiện tại Vue không sử dụng một cái tên riêng biệt nào đó, không có gì bảo đảm là xung đột sẽ không xảy ra trong một phiên bản tiếp theo.

Trong khi đó, tiền tố `$` trong hệ sinh thái của Vue thường dùng để đánh dấu các thuộc tính đối tượng đặc biệt mà người dùng có thể sử dụng, vì thế dùng `$` cho các thuộc tính cấp _private_ là không phù hợp.

Thay vào đó, chúng tôi khuyết nghị kết hợp cả hai tiền tố này thành `$_`, một quy chuẩn cho các private property mà người dùng định nghĩa, được bảo đảm là không xảy ra xung đột với Vue.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
var myGreatMixin = {
  methods: {
    update: function () {
    }
  }
}
```

``` js
var myGreatMixin = {
  methods: {
    _update: function () {
    }
  }
}
```

``` js
var myGreatMixin = {
  methods: {
    $update: function () {
    }
  }
}
```

``` js
var myGreatMixin = {
  methods: {
    $_update: function () {
    }
  }
}
```

{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
var myGreatMixin = {
  methods: {
    $_myGreatMixin_update: function () {
    }
  }
}
```
{% raw %}</div>{% endraw %}


## Các quy tắc mức B: Rất khuyết khích (giúp code dễ đọc hơn)

### Các file component <sup data-p="b">rất khuyến khích</sup>

**Nếu hệ thống build hỗ trợ nối file, mỗi component nên nằm trong một file riêng.**

Việc này giúp bạn mau chóng tìm ra một component khi cần chỉnh sửa hoặc xem lại cách dùng component đó.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
{% raw %}</div>{% endraw %}



### Sử dụng quy chuẩn đặt tên cho file component <sup data-p="b">rất khuyến khích</sup>

**Toàn bộ tên của các [file component](../guide/single-file-components.html) chỉ nên được đặt theo quy chuẩn hoặc là PascalCase hoặc là kebab-case.**

PascalCase hoạt động tốt nhất với tính năng tự điền (autocomplete) của các trình soạn thảo, vì nó nhất quán với cách chúng ta tham chiếu đến các component trong JS(X) và template, bất cứ khi nào có thể. Tuy nhiên, vì tên file trộn lẫn cả chữ hoa và chữ thường đôi khi tạo phiền toái trên các hệ thống phân biệt hoa thường, kebab-case cũng hoàn toàn có thể chấp nhận được.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
{% raw %}</div>{% endraw %}



### Tên component nền tảng <sup data-p="b">rất khuyến khích</sup>

**Tên của các component nền tảng (base component), chỉ dùng để áp dụng style và convention cho toàn bộ ứng dụng, nên bắt đầu bằng một tiền tố đặc biệt, chẳng hạn như `Base`, `App`, hoặc `V`.**

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Những component này đặt nền móng cho style và hành vi cho ứng dụng của bạn, và **chỉ có thể** chứa:

- các phần tử HTML,
- các component nền tảng khác, và
- các component UI của bên thứ 3

chứ không bao giờ chứa trạng thái toàn cục (ví dụ từ một store vuex).

Tên của các component này thường chứa tên của phần tử được bọc bên trong (ví dụ `BaseButton`, `BaseTable`), trừ phi không có phần tử nào tồn tại cho mục đích cụ thể của nó (chẳng hạn `BaseIcon` - không có phần tử HTML nào tên là `icon`). Nếu bạn xây dựng các component tương tự dành cho một ngữ cảnh cụ thể nào đó, các component này gần như luôn luôn dùng các base component (ví dụ `BaseButton` có thể được dùng trong `ButtonSubmit`).

Một số lợi thế của quy tắc này:

- Khi xếp theo thứ tự chữ cái trong các trình soạn thảo, base component trong ứng dụng của bạn sẽ nằm cùng một chỗ, giúp bạn dễ xác định hơn.
- Vì tên của component nên là hai từ đơn trở lên, quy tắc này giúp bạn tránh được việc chọn tùy tiện một tiền tố cho các wrapper component (như `MyButton`, `VueButton`).
- Vì các component này được dùng thường xuyên, bạn có thể sẽ muốn chuyển chúng thành component toàn cục thay vì phải `import` khắp nơi. Điều này thực hiện được khá dễ dàng nếu bạn sử dụng một tiền tố kết hợp với Webpack:

  ``` js
  var requireComponent = require.context("./src", true, /^Base[A-Z]/)
  requireComponent.keys().forEach(function (fileName) {
    var baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    var baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    Vue.component(baseComponentName, baseComponentConfig)
  })
  ```

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
{% raw %}</div>{% endraw %}


### Tên của các component dạng single-instance <sup data-p="b">rất khuyến khích</sup>

**Tên của các component dạng single-instance (chỉ có một đối tượng được khởi tạo trong toàn bộ vòng đời của ứng dụng) nên bắt đầu với mạo từ xác định `The`, đánh dấu tính chất "một và chỉ một mà thôi."**

Điều này không có nghĩa là một component dạng này chỉ được dùng trên một trang duy nhất, mà là chỉ được dùng một lần __mỗi trang__. Các component này không bao giờ nhận vào các prop, vì prop là dấu hiệu của một component tái sử dụng lại được. 

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

```
components/
|- Heading.vue
|- MySidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
{% raw %}</div>{% endraw %}


### Tên các component có liên hệ chặt chẽ với nhau <sup data-p="b">rất khuyến khích</sup>

**Tên của component con có mối quan hệ khắng khít (tightly coupled) với component cha nên có tiền tố là tên component cha.**

Nếu một component chỉ có ý nghĩa trong ngữ cảnh của một component cha, mối quan hệ này nên được thể hiện rõ ràng bằng tên của component đó. Vì cách trình soạn thảo thường sắp xếp file theo thứ tự chữ cái, việc này cũng giúp các file liên quan được gần nhau.

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Có thể bạn có xu hướng giải quyết vấn đề này bằng cách lồng các component con vào các thư mục được đặt tên theo tên component cha, chẳng hạn như:

```
components/
|- TodoList/
   |- Item/
      |- Index.vue
      |- Button.vue
   |- index.vue
```

hoặc:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Tuy nhiên, chúng tôi không khuyến khích cách làm này, vì nó tạo ra: 

- Nhiều file có tên trùng nhau hoặc tương tự nhau, khiến cho việc chuyển đổi nhanh file trình soạn thảo trở nên khó khăn hơn.
- Nhiều thư mục lồng nhau, khiến cho việc duyệt qua các component trong sidebar của trình soạn thảo trở nên chậm chạp.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
{% raw %}</div>{% endraw %}


### Thứ tự từ trong tên của component <sup data-p="b">rất khuyến khích</sup>

**Tên của component nên được bắt đầu với những từ cấp cao nhất (thường là chung nhất) và kết thúc bằng những từ mô tả.**

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Có thể bạn đang tự hỏi:

> "Tại sao lại dùng cách nói kém tự nhiên khi đặt tên cho component?"

Trong tiếng Anh tự nhiên, tính từ và các từ mô tả thường đi trước danh từ, trừ phi có những từ nối. Ví dụ: 

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

Tất nhiên bạn có thể bao gồm những từ nối này trong tên của component nếu muốn, nhưng thứ tự của các từ vẫn là rất quan trọng.

Cũng nên lưu ý rằng **cái gì được xem là "cấp cao nhất" là tùy thuộc vào ngữ cảnh của ứng dụng**. Ví dụ, thử lấy một ứng dụng với một form tìm kiếm (search form). Ứng dụng này có thể có các component như sau:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Bạn có thể thấy ngay rằng, rất khó có thể nhận ra component nào là liên quan đến việc tìm kiếm. Bây giờ, chúng ta thử sửa lại tên cho các component dựa trên quy tắc đang bàn đến:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Vì các trình soạn thảo sắp xếp tên file theo thứ tự chữ cái, bây giờ tất cả các mối quan hệ quan trọng giữa các component đều được thể hiện rất rõ ràng.

Có thể bạn sẽ muốn xử lí vấn đề này khác đi, bằng cách lồng các component liên quan đến tìm kiếm vào trong một thư mục tên là "search," rồi tất cả các component cài đặt vào thư mục "settings." Chúng tôi chỉ khuyết khích làm như thế nếu ứng dụng của bạn thật sự lớn (từ 100 component trở đi), vì cùng các lí do đã nói trong quy tắc "Tên các component có liên hệ chặt chẽ với nhau."

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
{% raw %}</div>{% endraw %}



### Thẻ component tự đóng <sup data-p="b">rất khuyến khích</sup>

**Các thẻ component không có nội dung nên tự đóng khi sử dụng trong các [single-file component](../guide/single-file-components.html), string template, và [JSX](../guide/render-function.html#JSX) - nhưng đừng tự đóng trong các DOM template.**

Các component tự đóng cho biết rằng chúng không chỉ là không có nội dung, mà hơn thế nữa còn có **chủ đích** là không có nội dung. Việc này cũng giống như sự khác nhau giữa một trang trống và một trang có dòng chữ "Trang này được cố ý để trống" trong một cuốn sách. Không có thẻ đóng thừa cũng giúp cho code của bạn gọn gàng hơn.

Tuy nhiên, HTML không cho phép phần tử tùy chọn (custom element) được tự đóng - chỉ có các phần tử "trống" ([void element](https://www.w3.org/TR/html/syntax.html#void-elements)) là được phép. Chính vì thế, quy tắc này chỉ áp dụng được khi trình biên dịch của Vue có thể động đến template trước để có thể xử lí và chuyển template thành HTML tương thích.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<!-- Trong single-file component, string template, và JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- Trong DOM templates -->
<my-component/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<!-- Trong single-file component, string template, và JSX -->
<MyComponent/>
```

``` html
<!-- Trong DOM templates -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}


### Cách viết hoa thường cho tên của component trong template <sup data-p="b">rất khuyến khích</sup>

**Trong phần lớn các dự án, tên của component nên luôn là PascalCase trong single-file component và string template, và là kebab-case trong DOM template.**

Sơ với kebab-case thì PascalCase có các thế mạnh sau đây:

- Trình soạn thảo có thể tự điền tên component trong template, vì PascalCase cũng được dùng trong JavaScript.
- Về khía cạnh thị giác, `<MyComponent>` nhìn khác biệt rõ rệt với một thẻ HTML hơn là `<my-component>` vì có hai điểm khác nhau (hai chữ cái viết hoa) so với một (dấu gạch ngang). 
- Nếu bạn sử dụng các phần tử đặc biệt không phải Vue trong template (ví dụ web component), PascalCase vẫn bảo đảm tách biệt component Vue với các phần tử này.

Tuy nhiên, do HTML không phân biệt hoa thường, DOM template vẫn phải dùng kebab-case.

Ngoài ra, lưu ý rằng nếu bạn đã quen sử dụng kebab-case, tính nhất quán với các quy chuẩn HTML và đồng nhất giữa các dự án của bạn có lẽ là quan trọng hơn những thế mạnh vừa nêu. Trong những trường hợp này, **việc tiếp tục sử dụng kebab-case cũng hoàn toàn có thể chấp nhận được.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<!-- Trong single-file component và string template -->
<mycomponent/>
```

``` html
<!-- Trong single-file component và string template -->
<myComponent/>
```

``` html
<!-- Trong DOM template -->
<MyComponent></MyComponent>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<!-- Trong single-file component và string template -->
<MyComponent/>
```

``` html
<!-- Trong DOM template -->
<my-component></my-component>
```

HOẶC

``` html
<!-- ở bất kì đâu -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}


### Cách viết hoa thường cho tên của component trong JS/JSX <sup data-p="b">rất khuyến khích</sup>

**Tên của component trong JS/[JSX](../guide/render-function.html#JSX) nên luôn luôn là PascalCase, tuy rằng bạn cũng có thể dùng kebab-case trong chuỗi nếu là ứng dụng đơn giản chỉ dùng component được đăng kí toàn cục bằng `Vue.component`.**

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Trong JavaScript, PascalCase là quy chuẩn cho class và hàm dựng prototype - về bản chất là bất cứ thứ gì có thể khởi tạo đối tượng riêng biệt. Vue component cũng có thể khởi tạo đối tượng, vì thế dùng PascalCase là hợp lí. Ngoài ra, dùng PascalCase trong JSX (và template) cũng giúp người đọc code phân biệt giữa component và thẻ HTML thường được dễ dàng hơn.

Tuy nhiên, trong những ứng dụng chỉ dùng component toàn cục được định nghĩa bằng `Vue.component`, chúng tôi lại khuyến khích sử dụng kebab-case. Lí do là:

- Component toàn cục hiếm khi được dùng trong JavaScript, vì thế dùng quy ước JavaScript là không hợp lí cho lắm.
- Các ứng dụng này luôn chứa nhiều DOM template, nơi mà việc dùng kebab-case [là bắt buộc](#Cach-viet-hoa-thuong-cho-ten-cua-component-trong-template-rat-khuyen-khich).

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
Vue.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
Vue.component('MyComponent', {
  // ...
})
```

``` js
Vue.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
{% raw %}</div>{% endraw %}


### Tên component đầy đủ <sup data-p="b">rất khuyến khích</sup>

**Component nên có tên đầy đủ thay vì viết tắt.**

Chức năng tự điền trong các trình soạn thảo giúp cho việc viết tên dài tốn rất ít công sức, trong khi sự tường minh mà nó mang lại là rất hữu ích. Đặc biệt, đừng bao giờ dùng những từ viết tắt hiếm gặp.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
{% raw %}</div>{% endraw %}


### Cách viết hoa thường cho tên của prop <sup data-p="b">rất khuyến khích</sup>

**Dùng camelCase khi khai báo prop, kebab-case khi dùng trong template và [JSX](../guide/render-function.html#JSX).**

Chúng ta chỉ đơn giản là đang tuân theo quy ước của từng ngôn ngữ. Trong JavaScript, camelCase nhìn tự nhiên hơn. Trong HTML thì kebab-case lại tự nhiên hơn.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
props: {
  'greeting-text': String
}
```

``` html
<WelcomeMessage greetingText="hi"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
{% raw %}</div>{% endraw %}


### Phần tử có nhiều thuộc tính <sup data-p="b">rất khuyến khích</sup>

**Các phần tử có nhiều thuộc tính nên được viết thành nhiều dòng, mỗi dòng là một thuộc tính.** 

Trong JavaScript, việc viết các object với nhiều property thành nhiều dòng được công nhận rộng rãi vì như thế dễ đọc hơn nhiều. Template và [JSX](../guide/render-function.html#JSX) cũng đáng được xem xét như thế.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
{% raw %}</div>{% endraw %}


### Biểu thức đơn giản trong template <sup data-p="b">rất khuyến khích</sup>

**Template của component chỉ nên chứa những biểu thức đơn giản. Các biểu thức phức tạp hơn nên được viết thành computed property hoặc method.**

Các biểu thức phức tạp làm cho template trở nên kém rõ ràng mạch lạc. Chúng ta nên mô tả _giá trị nào_ cần hiển thị, thay vì mô tả giá trị ấy được tính toán _thế nào_. Computed property và method cũng giúp cho code có thể sử dụng lại được.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<!-- Trong template -->
{{ normalizedFullName }}
```

``` js
// Biểu thức phúc tạp đã được chuyển thành một computed property
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```
{% raw %}</div>{% endraw %}


### Computed property đơn giản <sup data-p="b">rất khuyến khích</sup>

**Các computed property phức tạp nên được tách ra thành càng nhiều property nhỏ hơn càng tốt.**

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Computed property đơn giản và được đặt tên đúng đắn thì:

- __Dễ test hơn__

  Khi mỗi computed property chỉ chứa một biểu thức đơn giản, với rất ít phụ thuộc (dependency), việc viết test để bảo đảm property hoạt động đúng trở nên dễ dàng hơn nhiều.

- __Dễ đọc hơn__

  Việc đơn giản hóa computed property bắt buộc bạn phải đặt cho mỗi giá trị một cái tên có tính mô tả, cho dù property đó có thể không được dùng lại. Điều này giúp cho các lập trình viên khác (và cả bạn trong tương lai) tập trung vào những dòng code họ quan tâm và hiểu được chuyện gì đang xảy ra.

- __Dễ thích nghi hơn với các thay đổi trong yêu cầu kĩ thuật__

  Mỗi giá trị được đặt tên đều có thể trở nên có ích trong view. Ví dụ, chúng ta có thể quyết định hiển thị một thông điệp thông báo cho người dùng biết họ đã tiết kiệm được bao nhiêu tiền. Chúng ta cũng có thể quyết định tính thuế bán hàng, nhưng có lẽ là hiển thị khoản thuế này riêng biệt, thay vì là một phần của tổng giá.

  Với các computed property nhỏ và tập trung, chúng ta đặt ít giả định hơn về cách sử dụng thông tin, nhờ đó cần sửa chữa ít hơn khi yêu cầu kĩ thuật thay đổi.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```
{% raw %}</div>{% endraw %}


### Đặt giá trị của thuộc tính HTML trong dấu nháy <sup data-p="b">rất khuyến khích</sup>

**Các thuộc tính HTML không rỗng nên luôn được đặt trong dấu nháy (nháy đơn nếu JS dùng nháy kép và ngược lại).**

Tuy rằng giá trị của các thuộc tính HTML không cần phải được đặt trong dấu nháy nếu không chứa khoảng trống, cách làm này thường dẫn đến việc _tránh dùng_ khoảng trống, khiến các giá trị này khó đọc hơn.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
{% raw %}</div>{% endraw %}



### Dạng viết tắt của directive <sup data-p="b">rất khuyến khích</sup>

**Bạn nên hoặc luôn dùng, hoặc không bao giờ dùng dạng viết tắt của directive (`:` cho `v-bind:` và `@` cho `v-on:`).**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

``` html
<input
  @input="onInput"
  @focus="onFocus"
>
```

``` html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```
{% raw %}</div>{% endraw %}



## Các quy tắc mức C: Khuyến khích (giảm thiểu các lựa chọn tùy tiện và công sức suy nghĩ)


### Thứ tự của các tùy chọn khởi tạo component/instance <sup data-p="c">khuyến khích</sup>

**Các từ chọn khởi tạo component/instance nên được sắp xếp một cách nhất quán.**

Sau đây là thứ tự mặc định mà chúng tôi khuyết khích áp dụng cho các tùy chọn khởi tạo. Các tùy chọn này được xếp theo thể loại, giúp bạn biết nên thêm property vào đâu.

1. **Hiệu ứng phụ** (kích hoạt các hiệu ứng bên ngoài component)
  - `el`

2. **Nhận thức toàn cục** (cần các kiến thức vượt quá phạm vi của component)
  - `name`
  - `parent`

3. **Loại component** (thay đổi loại component)
  - `functional`

4. **Modifier dành cho template** (thay đổi cách biên dịch một template)
  - `delimiters`
  - `comments`

5. **Thành phần phụ thuộc trong template** (các thành phần được dùng trong template)
  - `components`
  - `directives`
  - `filters`

6. **Biên soạn** (sáp nhập các thuộc tính vào trong các tùy chọn)
  - `extends`
  - `mixins`

7. **Giao diện** (giao diện của component)
  - `inheritAttrs`
  - `model`
  - `props`/`propsData`

8. **Trạng thái cục bộ** (các thuộc tính reactive cấp cục bộ)
  - `data`
  - `computed`

9. **Sự kiện** (các hàm callback được gọi bởi các sự kiện reactive)
  - `watch`
  - Các sự kiện vòng đời (theo thứ tự trong vòng đời)

10. **Thuộc tính không reactive** (các thuộc tính đối tượng độc lập với hệ thống reactive)
  - `methods`

11. **Hiển thị** (mô tả tường minh cho output của component)
  - `template`/`render`
  - `renderError`


### Thứ tự thuộc tính của phần tử <sup data-p="c">khuyến khích</sup>

**Các thuộc tính của phần tử (bao gồm component) nên được sắp xếp một cách nhất quán.**

Sau đây là thứ tự mặc định mà chúng tôi khuyến khích áp dụng cho thuộc tính của các phần tử. Các thuộc tính này được xếp theo thể loại, giúp bạn biết nên thêm thuộc tính và directive vào đâu.

1. **Định nghĩa** (cung cấp tùy chọn cho component)
  - `is`

2. **Render danh sách** (tạo nhiều dạng khác nhau của cùng một phần tử)
  - `v-for`

3. **Điều kiện** (nên hay không hiển thị / render phần tử)
  - `v-if`
  - `v-else-if`
  - `v-else`
  - `v-show`
  - `v-cloak`

4. **Modifier cho render** (thay đổi cách render một element)
  - `v-pre`
  - `v-once`

5. **Nhận thức toàn cục** (cần các kiến thức vượt quá phạm vi của component)
  - `id`

6. **Thuộc tính không trùng lặp** (các thuộc tính cần giá trị không trùng lặp)
  - `ref`
  - `key`
  - `slot`

7. **Ràng buộc hai chiều** (kết hợp ràng buộc và sự kiện)
  - `v-model`

8. **Các thuộc tính khác** (tất cả các thuộc tính ràng buộc và không ràng buộc khác)

9. **Sự kiện** (các hàm xử lí sự kiện cho component)
  - `v-on`

10. **Nội dung** (ghi đè nội dung của phần tử)
  - `v-html`
  - `v-text`



### Dòng trống trong tùy chọn của component/instance <sup data-p="c">khuyến khích</sup>

**Bạn có thể thêm vào một dòng trống giữa các property gồm nhiều dòng, đặc biệt là khi các tùy chọn không còn chứa đủ trên màn hình mà không phải cuộn.** 

Khi các component trở nên chật chội và khó đọc, thêm khoảng trắng giữa các property có thể giúp chúng trở nên dễ đọc trở lại. Trong một số trình soạn thảo, ví dụ Vim, kiểu định dạng như thế này còn có thể giúp việc di chuyển bằng bàn phím được dễ dàng hơn.

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue: function () {
    // ...
  },

  inputClasses: function () {
    // ...
  }
}
```

``` js
// Nếu component vẫn còn dễ đọc và di chuyển
// thì không dùng khoảng trắng cũng không sao.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue: function () {
    // ...
  },
  inputClasses: function () {
    // ...
  }
}
```
{% raw %}</div>{% endraw %}


### Thứ tự của các phần tử cấp cao nhất trong single-file component <sup data-p="c">khuyến khích</sup>

**[Single-file component](../guide/single-file-components.html) nên sắp xếp các thẻ `<script>`, `<template>`, và `<style>` nhất quán, với `<style>` đặt cuối cùng, vì ít nhất một trong hai thẻ `<script>` và `<template>` là bắt buộc.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

``` html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}



## Các quy tắc mức D: Thận trọng khi dùng (có thể gây ra lỗi)



### `v-if`/`v-if-else`/`v-else` không có `key` <sup data-p="d">thận trọng khi dùng</sup>

**Tốt nhất là dùng `key` với `v-if` + `v-else`, nếu các phần tử là cùng loại (ví dụ cùng là `<div>`).**

Mặc định, Vue cố gắng cập nhật DOM càng hiệu quả càng tốt. Điều này có nghĩa là khi chuyển đổi giữa các phần tử cùng loại, Vue đơn giản chỉ chỉnh sửa phần tử hiện tại, thay vì gỡ bỏ rồi thêm một phần tử mới vào thay thế. Điều này có thể tạo ra [các hiệu ứng phụ ngoài ý muốn](https://jsfiddle.net/chrisvfritz/bh8fLeds/) nếu các phần tử này không nên được xem là như nhau. 

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<div v-if="error">
  Lỗi: {{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<div
  v-if="error"
  key="search-status"
>
  Lỗi: {{ error }}
</div>
<div
  v-else
  key="search-results"
>
  {{ results }}
</div>
```

``` html
<p v-if="error">
  Lỗi: {{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}


### Selector dạng phần tử với `scoped` <sup data-p="d">thận trọng khi dùng</sup>

**Khi dùng `scoped`, nên tránh dùng selector dạng phần tử.**

Khi dùng `style` có `scoped`, nên ưu tiên dùng selector dạng class (ví dụ `.btn-close`) thay cho dạng phần tử (ví dụ `button`), vì quá nhiều selector dạng phần tử có thể làm chậm ứng dụng.

{% raw %}
<details>
<summary>
  <h4>Giải thích chi tiết</h4>
</summary>
{% endraw %}

Để tạo phạm vi (scope) cho style, Vue thêm một thuộc tính độc nhất cho các phần tử trong component, ví dụ như `data-v-2cb7c070`. Sau đó các selector được chỉnh sửa sao cho chỉ có những phần tử có thuộc tính này được chọn (ví dụ `button[data-v-2cb7c070]`).

Vấn đề là, nếu dùng ở số lượng lớn, [selector dạng phần tử](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (ví dụ `button[data-v-2cb7c070]`) sẽ chậm hơn nhiều so với [selector dạng class](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (ví dụ `.btn-close[data-v-2cb7c070]`). Vì thế, hãy dùng selector dạng class bất cứ khi nào có thể.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Giao tiếp ngầm giữa cha và con <sup data-p="d">thận trọng khi dùng</sup>

**Giao tiếp giữa các component cha và con nên được thực hiện bằng prop và sự kiện thay vì sử dụng `this.$parent` hoặc thay đổi prop.**

Một ứng dụng Vue lí tưởng tuân thủ quy tắc "props down, events up" (thuộc tính xuống, sự kiện lên). Việc này giúp component của bạn rõ ràng hơn. Tuy nhiên, cũng có những trường hợp ngoại lệ, mà trong đó thay đổi prop hoặc sử dụng `this.$parent` có thể đơn giản hóa hai component đang gắn kết chặt chẽ với nhau.

Vấn đề là, cũng có rất nhiều trường hợp _đơn giản_ mà những cách làm này tỏ ra rất tiện lợi. Hãy cẩn thận: đừng đánh đổi sự đơn giản (khả năng đọc hiểu flow của trạng thái) để lấy sự tiện lợi ngắn hạn (viết ít code) này.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: '<input v-model="todo.text">'
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeTodo () {
      var vm = this
      vm.$parent.todos = vm.$parent.todos.filter(function (todo) {
        return todo.id !== vm.todo.id
      })
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        × 
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}



### Quản lí trạng thái không theo kiến trúc flux <sup data-p="d">thận trọng khi dùng</sup>

**Nên dùng [vuex](https://github.com/vuejs/vuex) để quản lí trạng thái toàn cục thay vì sử dụng `this.$root` hoặc một event bus.**

Quản lí trạng thái của `this.$root` và/hoặc dùng một event bus toàn cục có thể tiện trong những trường hợp đơn giản, nhưng không phù hợp với phần lớn các ứng dụng. Chẳng những cung cấp một địa điểm tập trung để quản lí trạng thái, vuex còn hỗ trợ bạn với các công cụ để quản lí, track, và debug các thay đổi diễn ra.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Không nên

``` js
// main.js
new Vue({
  data: {
    todos: []
  },
  created: function () {
    this.$on('remove-todo', this.removeTodo)
  },
  methods: {
    removeTodo: function (todo) {
      var todoIdToRemove = todo.id
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== todoIdToRemove
      })
    }
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Nên

``` js
// store/modules/todos.js
export default {
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

``` html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: mapActions(['removeTodo'])
}
</script>
```
{% raw %}</div>{% endraw %}



{% raw %}
<script>
(function () {
  var enforcementTypes = {
    none: '<span title="There is unfortunately no way to automatically enforce this rule.">self-discipline</span>',
    runtime: 'runtime error',
    linter: '<a href="https://github.com/vuejs/eslint-plugin-vue#eslint-plugin-vue" target="_blank">plugin:vue/recommended</a>'
  }
  Vue.component('sg-enforcement', {
    template: '\
      <span>\
        <strong>Enforcement</strong>:\
        <span class="style-rule-tag" v-html="humanType"/>\
      </span>\
    ',
    props: {
      type: {
        type: String,
        required: true,
        validate: function (value) {
          Object.keys(enforcementTypes).indexOf(value) !== -1
        }
      }
    },
    computed: {
      humanType: function () {
        return enforcementTypes[this.type]
      }
    }
  })

  // new Vue({
  //  el: '#main'
  // })
})()
</script>
{% endraw %}
