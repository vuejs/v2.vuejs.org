---
title: Routing
type: guide
order: 501
---

<p class="tip">Một số tài liệu kĩ thuật dịch "routing" thành "định tuyến" và "router" thành "bộ định tuyến." Chúng tôi cho rằng cách dịch này nghe khá lạ tai và khiên cưỡng, nên sẽ giữ nguyên bản tiếng Anh của hai từ này.</p>

## Thư viện router chính thức

Đối với đa số các ứng dụng một trang (SPA - Single Page Application), chúng tôi khuyến khích sử dụng thư viện chính thức [vue-router](https://github.com/vuejs/vue-router). Để biết thêm chi tiết, hãy xem [tài liệu về vue-router](https://router.vuejs.org/).

## Routing đơn giản

Nếu chỉ cần routing đơn giản và không muốn sử dụng một thư viện đầy đủ tính năng, bạn có thể render động một component ở cấp toàn trang (page-level) như sau:

``` js
const NotFound = { template: '<p>Không tìm thấy</p>' }
const Home = { template: '<p>Trang chủ</p>' }
const About = { template: '<p>Giới thiệu</p>' }

const routes = {
  '/': Home,
  '/about': About
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
```

Bằng việc kết hợp với HTML5 History API, bạn có thể xây dựng cho mình một router phía client hoàn toàn có thể dùng được mặc dù còn rất cơ bản. Đây là [một ví dụ](https://github.com/chrisvfritz/vue-2.0-simple-routing-example) của router dạng này.

## Sử dụng router bên thứ 3

Nếu bạn muốn sử dụng một thư viện router bên thứ 3 như [Page.js](https://github.com/visionmedia/page.js) hoặc [Director](https://github.com/flatiron/director), việc tích hợp [cũng dễ dàng như thế](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Đây là một [ví dụ hoàn chỉnh](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) sử dụng Page.js.
