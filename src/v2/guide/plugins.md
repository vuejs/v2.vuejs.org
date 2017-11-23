---
title: Plugin
type: guide
order: 304
---

## Viết plugin 

Thông thường thì các plugin được dùng để bổ sung tính năng cho Vue ở cấp toàn cục. Không có phạm vi ràng buộc cụ thể nào cho một plugin – nói chung bạn có thể viết một số kiểu plugin khác nhau như sau: 

1. Thêm một số phương thức hoặc thuộc tính toàn cục, ví dụ như [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. Thêm một hoặc nhiều directive/filter/transition vân vân, ví dụ như [vue-touch](https://github.com/vuejs/vue-touch)

3. Thêm tùy chọn cho component thông qua [mixin](mixins.html) cấp toàn cục, ví dụ như [vue-router](https://github.com/vuejs/vue-router)

4. Thêm một số phương thức đối tượng (instance method) bằng cách đính kèm vào `Vue.prototype`.

5. Một thư viện cung cấp API riêng và cùng lúc đó thêm một hoặc vài tính năng được liệt kê trên đây, ví dụ [vue-router](https://github.com/vuejs/vue-router)

Một plugin cho Vue nên cung cấp một phương thức `install`. Phương thức này sẽ được gọi với tham số đầu tiên là hàm dựng `Vue`, cùng với các tùy chọn khác:

``` js
MyPlugin.install = function (Vue, options) {
  // 1. Thêm phương thức hoặc thuộc tính cấp toàn cục
  Vue.myGlobalMethod = function () {
  }

  // 2. Thêm một directive cấp toàn cục
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
    }
    ...
  })

  // 3. Thêm một số tùy chọn cho component
  Vue.mixin({
    created: function () {
    }
    ...
  })

  // 4. Thêm một phương thức đối tượng
  Vue.prototype.$myMethod = function (methodOptions) {
  }
}
```

## Sử dụng plugin

Chúng ta sử dụng một plugin bằng cách gọi phương thức toàn cục `Vue.use()`:

``` js
// dòng code này sẽ gọi `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```

Bạn cũng có thể truyền thêm vào một số tùy chọn:

``` js
Vue.use(MyPlugin, { someOption: true })
```

`Vue.use` tự động ngăn không cho sử dụng một plugin nhiều lần, vì vậy cho dù chúng ta có gọi `Vue.use(MyPlugin)` mười lần thì `MyPlugin` cũng sẽ chỉ được cài đặt một lần thôi.

Một số plugin tự động gọi `Vue.use()` nếu phát hiện thấy biến toàn cục `Vue`. Tuy nhiên trong một môi trường module, ví dụ như CommonJS, bạn cần phải gọi `Vue.use()` một cách tường minh:

``` js
// Khi dùng CommonJS với Browserify hoặc Webpack…
var Vue = require('vue')
var VueRouter = require('vue-router')

// …đừng quên gọi Vue.use()
Vue.use(VueRouter)
```

Repository [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) chứa rất nhiều plugin và thư viện do cộng đồng đóng góp – khi thấy buồn bạn cứ đến chơi.
