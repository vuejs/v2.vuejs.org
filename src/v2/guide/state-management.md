---
title: Quản lí trạng thái
type: guide
order: 502
---

## Giải pháp chính thức theo kiến trúc Flux

Các ứng dụng lớn có xu hướng ngày càng trở nên phức tạp do có nhiều thành phần trạng thái (state) khác nhau và các giao tiếp giữa các thành phần ấy. Để giải quyết vấn đề này, Vue cung cấp [vuex](https://github.com/vuejs/vuex): thư viện quản lí trạng thái chính thức, lấy cảm hứng từ [Elm](http://elm-lang.org/). Vuex thậm chí còn được tích hợp vào [vue-devtools](https://github.com/vuejs/vue-devtools), cung cấp tính năng [time-travel debugging](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif) mà không cần phải cài đặt gì thêm.

### Thông tin dành cho các lập trình viên React

Nếu đến từ React, có thể bạn đang thắc mắc không biết vuex và [redux](https://github.com/reactjs/redux), giải pháp quản lí trạng thái theo kiến trúc Flux phổ biến nhất trong hệ sinh thái của React, giống và khác nhau như thế nào. Thật ra, Redux độc lập với view layer, và vì thế có thể dùng với Vue thông qua [các ràng buộc đơn giản](https://yarnpkg.com/en/packages?q=redux%20vue&p=1). Trong khi đó, vuex _biết rằng_ nó đang được sử dụng trong một ứng dụng Vue. Điều này giúp vuex tích hợp tốt hơn với Vue, cung cấp API trực quan hơn và nâng cao trải nghiệp của lập trình viên.

## Xây dựng bộ quản lí trạng thái đơn giản

Chúng ta thường quên rằng "source of truth" (nguồn chân lí, một khái niệm chỉ việc dữ liệu được truy xuất từ một nguồn duy nhất) trong một ứng dựng Vue là object `data` – một đối tượng Vue đơn giản chỉ proxy các truy xuất đến object này. Vì thế, nếu muốn có một trạng thái được chia sẻ giữa các đối tượng Vue khác nhau, bạn có thể làm như sau:  

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Trong ví dụ này, mỗi khi `sourceOfTruth` được thay đổi, cả `vmA` và `vmB` đều sẽ cập nhật view một cách tự động. Các component bên trong hai đối tượng này cũng sẽ truy xuất được đến `sourceOfTruth` thông qua `this.$root.$data`. Bây giờ chúng ta đã có một "single source of truth," tuy nhiên việc dò lỗi sẽ là ác mộng, vì bất cứ phần nào của ứng dụng cũng có thể chỉnh sửa được bất cứ dữ liệu nào vào bất kì lúc nào mà không để lại chút tung tích nào cả.

Để giải quyết vấn đề này, chúng ta sử dụng một **store pattern**:

``` js
var store = {
  debug: true,
  state: {
    message: 'Xin chào!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction được gọi với giá trị', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction được gọi')
    this.state.message = ''
  }
}
```

Lưu ý việc tất cả các hành động (action) làm thay đổi trạng thái của store được chứa trong chính store. Cách quản lí trạng thái theo kiểu tập trung này giúp chúng ta hiểu được dạng thay đổi nào có thể xảy ra và được chúng gọi đến như thế nào. Bây giờ nếu có gì bất ổn, chúng ta cũng sẽ có log.

Thêm vào đó, mỗi đối tượng / component cũng có thể sở hữu và quản lí trạng thái cho riêng mình: 

``` js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![State Management](/images/state.png)

<p class="tip">Đừng bao giờ thay thế object trạng thái ban đầu trong các hành động – các component và store cần chia sẻ chung một tham chiếu đến object này để có thể theo dõi các thay đổi.</p>

Khi tiếp tục phát triển quy ước không cho phép component được trực tiếp thay đổi trạng thái thuộc về store mà thay vào đó chỉ nên gửi sự kiện để thông báo cho store thực hiện các hành động, cuối cùng chúng ta sẽ tiến đến kiến trúc [Flux](https://facebook.github.io/flux/). Lợi ích của quy ước này là chúng ta có thể ghi lại tất cả các thay đổi xảy ra với store và dựa vào đó phát triển các tính năng debug nâng cao như log, snapshot, time travel…

Điều này lại dẫn chúng ta quay lại với [vuex](https://github.com/vuejs/vuex), vì thế nếu bạn đã đọc đến đây thì có lẽ đã đến lúc thử qua thư viện này.
