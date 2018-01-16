---
title: Render danh sách
type: guide
order: 8
---

## Map một mảng thành các phần tử web với `v-for`

<p class="tip">Một số tài liệu kĩ thuật dịch "map" thành "ánh xạ" hoặc "đối ứng." Để đơn giản, trong bảng hướng dẫn này chúng tôi sẽ giữ nguyên từ tiếng Anh là "map."</p>

Chúng ta có thể dùng directive `v-for` để render một danh sách các item dựa trên một mảng. Directive `v-for` đòi hỏi một cú pháp đặc biệt dưới dạng `item in items`, trong đó `items` là mảng dữ liệu nguồn và `item` trỏ đến phần tử mảng đang được duyệt đến:

``` html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.name }}
  </li>
</ul>
```

``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { name: 'Cà phê' },
      { name: 'Trà đặc' },
      { name: 'Bò húc' }
    ]
  }
})
```

Kết quả:

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.name}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { name: 'Cà phê' },
      { name: 'Trà đặc' },
      { name: 'Bò húc' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-1'))
    }
  }
})
</script>
{% endraw %}

Bên trong vòng lặp `v-for` chúng ta có toàn quyền truy xuất đến các thuộc tính của scope cha. `v-for` cũng hỗ trợ một tham số thứ hai (không bắt buộc) chỉ số thứ tự (index) của phần tử mảng hiện hành.

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.name }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { name: 'Cà phê' },
      { name: 'Trà đặc' },
      { name: 'Bò húc' }
    ]
  }
})
```

Result:

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.name }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { name: 'Cà phê' },
      { name: 'Trà đặc' },
      { name: 'Bò húc' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-2'))
    }
  }
})
</script>
{% endraw %}

Bạn cũng có thể dùng `of` để phân cách thay vì `in`. Cách này cũng gần hơn với cú pháp vòng lặp trong JavaScript.

``` html
<div v-for="item of items"></div>
```

## Dùng `v-for` với một object

Bạn cũng có thể dùng `v-for` để duyệt qua các thuộc tính của một object.

``` html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      // tất nhiên chúng ta đều biết ông Bành Tổ không phải
      // họ Bành tên Tổ, nhưng đây chỉ là một ví dụ…
      'họ': 'Bành',
      'tên': 'Tổ',
      'tuổi': 800
    }
  }
})
```

Result:

{% raw %}
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      'họ': 'Bành',
      'tên': 'Tổ',
      'tuổi': 800
    }
  }
})
</script>
{% endraw %}

Bạn cũng có thể cung cấp tham số thứ hai dùng cho khóa (key) của thuộc tính:

``` html
<div v-for="(value, key) in object">
  {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key" class="demo">
  <div v-for="(value, key) in object">
    {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key',
  data: {
    object: {
      'họ': 'Bành',
      'tên': 'Tổ',
      'tuổi': 800
    }
  }
})
</script>
{% endraw %}

Tham số thứ ba chỉ thứ tự của thuộc tính:

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key-index" class="demo">
  <div v-for="(value, key, index) in object">
    {{ index }}. {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key-index',
  data: {
    object: {
      'họ': 'Bành',
      'tên': 'Tổ',
      'tuổi': 800
    }
  }
})
</script>
{% endraw %}

<p class="tip">Khi duyệt qua một object, thứ tự các thuộc tính được dựa trên kết quả trả về của `Object.keys()`. Kết quả này **không đảm bảo** được đồng nhất giữa các engine JavaScript khác nhau.</p>

## `key`

Khi cập nhật một danh sách các phần tử được render với `v-for`, mặc định Vue sẽ sử dụng kĩ thuật "inline patch" (hiểu nôm na là "vá tại chỗ"). Điều này có nghĩa là nếu thứ tự của các item thay đổi, thay vì dịch chuyển các phần tử web theo thứ tự tương ứng, Vue sẽ patch mỗi phần tử tại chỗ và bảo đảm phản ánh đúng những gì cần phải render tại vị trí đó. Cách xử lí này tương tự với `track-by="$index"` trong Vue 1.x.

Kĩ thuật nói trên rất hiệu quả, nhưng chỉ thích hợp **khi danh sách cần render không phụ thuộc vào trạng thái của component con (child component state) hay trạng thái DOM tạm thời (ví dụ như thông tin người dùng nhập vào form)**.

Để Vue có thể nhận ra từng node và nhờ đó có thể tái sử dụng và sắp xếp các phần tử, bạn cần cung cấp một thuộc tính `key` với giá trị độc nhất cho từng item (ví dụ, `id` sẽ là một giá trị `key` lí tưởng). `key` tương đương với `track-by` trong 1.x, nhưng vì nó là một thuộc tính, bạn cần dùng `v-bind` để bind nó vào các giá trị động như sau:

``` html
<!-- ở đây ta dùng shorthand `:key` thay vì `v-bind:key` -->
<div v-for="item in items" :key="item.id">
  <!-- nội dung -->
</div>
```

Chúng tôi khuyến khích sử dụng `key` bất cứ khi nào bạn dùng `v-for`, trừ phi nội dung DOM được duyệt qua quá đơn giản hoặc bạn đang cố ý sử dụng behavior mặc định của Vue để tăng tốc cho ứng dụng.

Vì đây là cơ chế chung để Vue nhận dạng các node, `key` còn có một số cách dùng khác không thật liên quan `v-for`. Chúng ta sẽ bàn về vấn đề này ở một phần sau.

## Phát hiện thay đổi trong mảng

### Các phương thức biến đổi

Vue wrap các phương thức biến đổi (mutation method) của một mảng được quan sát (observe) để việc gọi phương thức này cũng sẽ kích hoạt thay đổi trên view. Các phương thức được wrap gồm có:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Bạn có thể mở console và thử thay đổi mảng `items` trong các ví dụ trên đây bằng cách thực thi các phương thức biến đổi, ví dụ `example1.items.push({ name: 'Nước chanh' })`.

### Thay thế mảng

Các phương thức biến đổi, như tên gọi cho thấy, _biến đổi_ nội dung của mảng. Chúng ta cũng có những phương thức không biến đổi (non-mutating method) như `filter()`, `concat()`, `slice()`… Thay vì biến đổi nội dung của mảng gốc, các phương thức này **luôn trả về một mảng mới**. Khi làm việc với các phương thức này, bạn có thể thay mảng cũ bằng mảng mới:

``` js
example1.items = example1.items.filter(function (item) {
  return item.name.match(/à/)
})
```

Có thể bạn sẽ nghĩ là làm thế này Vue sẽ bỏ đi toàn bộ DOM có sẵn và render lại từ đầu, nhưng không phải thế. Vue thực hiện một số phỏng đoán thông minh để dùng lại DOM đến mức tối đa, vì thế thay thế một mảng bằng một mảng khác chứa các object chồng nhau là một cách làm rất hiệu quả.

### Một số điểm cần lưu ý

Do một số hạn chế của JavaScript, Vue **không thể** phát hiện thấy những thay đổi sau đây đối với mảng:

1. Khi bạn gán một phần tử trực tiếp vào một index, ví dụ `vm.items[index] = newValue`
2. Khi bạn thay đổi kích thước của mảng, ví dụ `vm.items.length = newLength`

Để khắc phục điểm thứ nhất, bạn có thể dùng một trong hai cách sau đây. Cả hai cách đều đạt được kết quả như `vm.items[indexOfItem] = newValue`, nhưng đồng thời cũng kích hoạt cập nhật trạng thái trong hệ thống reactivity của Vue:

``` js
// Vue.set
Vue.set(example1.items, index, newValue)
```
``` js
// Array.prototype.splice
example1.items.splice(index, 1, newValue)
```

Để khắc phục điểm thứ hai, bạn có thể dùng `splice`:

``` js
example1.items.splice(newLength)
```

## Lưu ý về phát hiện thay đổi trong object

Một lần nữa, cũng do hạn chế của JavaScript, **Vue không thể phát hiện việc thêm hay xóa thuộc tính của object**. Ví dụ:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` reactive

vm.b = 2
// `vm.b` KHÔNG reactive
```

Vue không hỗ trợ việc thêm thuộc tính reactive ở cấp root cho một đối tượng Vue đã được khởi tạo. Tuy nhiên, chúng ta có thể thêm thuộc tính reactive vào một object con với phương thức `Vue.set(object, key, value)`. Ví dụ, nếu chúng ta có:

``` js
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Bành Tổ'
    }
  }
})
```

Bạn có thể thêm một thuộc tính `age` vào object `userProfile` như sau:

``` js
Vue.set(vm.userProfile, 'age', 800)
```

Bạn cũng có thể dùng phương thức đối tượng (instance method) `vm.$set`, một alias cho phương thức toàn cục `Vue.set`:

``` js
vm.$set(this.userProfile, 'age', 800)
```

Đôi khi bạn cũng muốn thêm vài thuộc tính cùng lúc vào một object có sẵn, sử dụng `Object.assign()` hoặc `_.extend()`. Trong những trường hợp này, nên tạo một object mới với các thuộc tính từ hai object kia. Có nghĩa là thay vì:

``` js
Object.assign(this.userProfile, {
  age: 800,
  favoriteColor: 'Tím mộng mơ'
})
```

bạn sẽ thêm thuộc tính reactive mới bằng như sau:

``` js
this.userProfile = Object.assign({}, this.userProfile, {
  age: 800,
  favoriteColor: 'Tím mộng mơ'
})
```

## Hiển thị kết quả đã được lọc hoặc sắp xếp

Đôi khi chúng ta muốn hiển thị một phiên bản đã được lọc (filter) hoặc sắp xếp (sort) của một mảng mà không thay đổi mảng đó. Trong trường hợp này, bạn có thể tạo một computed property trả về mảng đã được lọc hoặc sắp xếp. Ví dụ:

``` html
<li v-for="n in evenNumbers">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},

computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

Trong trường hợp không dùng được computed property (ví dụ trong các vòng lặp `v-for`), ta có thể dùng một phương thức:

``` html
<li v-for="n in even(numbers)">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},

methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

## `v-for` dùng với một dãy

`v-for` cũng có thể nhận một số nguyên `n`. Trong trường hợp này, template sẽ được lặp lại `n` lần:

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

Kết quả

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
  new Vue({ el: '#range' })
</script>
{% endraw %}

## `v-for` dùng với thẻ `<template>`

Tương tự với `v-if`, bạn có thể dùng `v-for` trên một thẻ `<template>` để render một lúc nhiều phần tử. Ví dụ:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

## `v-for` dùng với `v-if`

Khi được dùng trên dùng một node, `v-for` có độ ưu tiên cao hơn `v-if`, có nghĩa là `v-if` sẽ được thực thi một cách riêng biệt trên mỗi vòng lặp của `v-for`. Điều này có thể có ích khi bạn muốn render cho chỉ _một số_ item, như trong ví dụ sau:

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

Ví dụ trên sẽ chỉ render những todo chưa hoàn thành.

Ngược lại, nếu bạn muốn bỏ qua việc thực thi vòng lặp `v-for` theo điều kiện, hãy dùng `v-if` trên một phần tử wrapper (hoặc [`<template>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt)). Ví dụ:

``` html
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>Mọi việc đã hoàn thành.</p>
```

## `v-for` dùng với component

> Phần này giả định rằng bạn đã có kiến thức về [Components](components.html). Nếu chưa, bạn có thể bỏ qua và quay lại sau.

Bạn có thể dùng `v-for` trực tiếp trên một component như một phần tử bình thường:

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> Từ bản 2.2.0 trở đi, thuộc tính [`key`](list.html#key) là bắt buộc khi dùng `v-for` với một component,

Tuy nhiên trong ví dụ trên, dữ liệu sẽ không được tự động truyền vào component, vì mỗi commponent có scope (phạm vi) độc lập. Để truyền dữ liệu trên mỗi vòng lặp vào component, chúng ta dùng thêm `props`:

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

Lí do `item` không được truyền tự động vào component là bởi vì nếu làm vậy component sẽ bị gắn chặt vào `v-for`. Bằng cách bắt buộc khai báo nguồn dữ liệu một cách minh bạch (explicit), chúng ta có thể sử dụng lại component trong các tình huống khác.

Dưới đây là một ví dụ hoàn chỉnh của một ứng dụng todo:

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Thêm việc cần làm"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

<p class="tip">Lưu ý thuộc tính `is="todo-item"`. Điều này là cần thiết trong DOM template, vì chỉ có thẻ `<li>` là hợp lệ trong `<ul>`. Cách khai báo `<li is="todo-item">` có cùng kết quả như `<todo-item>`, nhưng tránh được lỗi có thể xảy trình duyệt parse (phân tích) template. Xem thêm [Lưu ý về việc parse DOM template](components.html#Luu-y-ve-viec-parse-DOM-template).</p>

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'luộc khoai',
      },
      {
        id: 2,
        title: 'cùng chị giã gạo',
      },
      {
        id: 3,
        title: 'thổi cơm'
      },
      {
        id: 4,
        title: 'nhổ cỏ vườn'
      }
    ],
    nextTodoId: 5
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <p>Khi mẹ vắng nhà, em:</p>
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Thêm việc cần làm"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'luộc khoai',
      },
      {
        id: 2,
        title: 'cùng chị giã gạo',
      },
      {
        id: 3,
        title: 'thổi cơm'
      },
      {
        id: 4,
        title: 'nhổ cỏ vườn'
      }
    ],
    nextTodoId: 5
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}
