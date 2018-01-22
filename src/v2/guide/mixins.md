---
title: Mixin
type: guide
order: 301
---

## Cơ bản

Mixin là một cách linh hoạt để phân phối những tính năng tái sử dụng được cho component. Một object mixin có thể chứa bất kì những tùy chọn nào của component. Khi một component sử dụng một mixin, tất cả những tùy chọn trong mixin sẽ được "hòa trộn" (mixed) vào trong tùy chọn của component đó.

Ví dụ:

``` js
// định nghĩa một object mixin
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('Mixin xin chào!')
    }
  }
}

// định nghĩa một component sử dụng mixin này
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "Mixin xin chào!"
```

## Hợp nhất các tùy chọn

Khi một mixin và component chứa những tùy chọn trùng nhau, những tùy chọn này sẽ được merge (hợp nhất) bằng cách sử dụng các chiến lược thích hợp. 

Ví dụ, những object `data` sẽ được merge sâu một cấp (shallow merge), và khi có xung đột thì data của component sẽ được ưu tiên.

``` js
var mixin = {
  data: function () {
    return {
      message: 'chào anh',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'chào chị',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "chào chị", foo: "abc", bar: "def" }
  }
})
```

Những hàm hook trùng tên với nhau được merge vào trong một mảng để tất cả những hàm hook đó đều được gọi. Thêm vào đó, những hook trong mixin sẽ được gọi **trước** những hook trong component:

``` js
var mixin = {
  created: function () {
    console.log('hook trong mixin sẽ được gọi trước')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('sau đó đến hook của component')
  }
})

// => "hook trong mixin sẽ được gọi trước"
// => "sau đó đến hook của component"
```

Những tùy chọn có giá trị là object như `methods`, `components` và `directives` sẽ được merge vào chung một object. Nếu khóa (key) của các tùy chọn trùng nhau thì tùy chọn của component sẽ được ưu tiên:

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    hàmTrùngTên: function () {
      console.log('từ mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    hàmTrùngTên: function () {
      console.log('từ component')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.hàmTrùngTên() // => "từ component"
```

Chú ý rằng chiến lược merge này cũng được dùng trong `Vue.extend()`.

## Mixin toàn cục

Bạn cũng có thể áp dụng một mixin ở cấp toàn cục. Nhưng cần cẩn trọng khi sử dụng cách này, vì một mixin toàn cục sẽ tác động tới **tất cả** đối tượng Vue được khởi tạo sau đó. Khi được dùng một cách thích hợp, mixin có thể được sử dụng để chèn những xử lí logic cho các tùy chọn tùy biến:

``` js
// chèn một handler cho option tùy biến `myOption`
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

<p class="tip">Nên hạn chế và cẩn trọng khi sử dụng mixin toàn cục, bởi vì nó sẽ tác động tới tất cả đối tượng Vue được khởi tạo, kể cả những component của bên thứ ba. Trong hầu hết các trường hợp, bạn chỉ nên sử mixin toàn cục cho việc xử lí tùy chọn tùy biến như ví dụ trên. Một ý tưởng hay nữa là chuyển chúng thành [Plugins](plugins.html) để tránh bị trùng lặp.</p>

## Chiến lược merge tùy chọn tùy biến

Khi những tùy chọn tùy biến được merge, chúng sử dụng chiến lược merge mặc định là ghi đè những giá trị đang tồn tại. Nếu muốn một tùy chọn tùy biến được merge bằng cách sử dụng một logic nào khác (không sử dụng chiến lược mặc định), bạn cần đính kèm một hàm vào `Vue.config.optionMergeStrategies`:

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

Đối với hầu hết các tùy chọn dạng object, bạn có thể sử dụng cùng một chiến lược được dùng bởi `methods`:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

Bạn có thể tìm thấy một ví dụ nâng cao hơn qua chiến lược merge của [Vuex](https://github.com/vuejs/vuex) 1.x:

``` js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
  if (!toVal) return fromVal
  if (!fromVal) return toVal
  return {
    getters: merge(toVal.getters, fromVal.getters),
    state: merge(toVal.state, fromVal.state),
    actions: merge(toVal.actions, fromVal.actions)
  }
}
```
