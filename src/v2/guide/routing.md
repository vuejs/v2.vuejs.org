---
title: 라우팅
type: guide
order: 501
---

## 공식 라우터

대부분의 단일 페이지 애플리케이션의 경우 공식적으로 지원되는 [vue-router library](https://github.com/vuejs/vue-router)를 사용하는 것이 좋습니다. 자세한 내용은 vue-router의 [문서](https://router.vuejs.org/)를 참조하십시오.

## 단순한 라우팅 시작하기

매우 단순한 라우팅만 필요하고 완전한 기능을 갖춘 라우터 라이브러리를 사용하지 않으려면 다음과 같이 페이지 수준 컴포넌트를 동적으로 렌더링하면됩니다.

``` js
const NotFound = { template: '<p>Page not found</p>' }
const Home = { template: '<p>home page</p>' }
const About = { template: '<p>about page</p>' }

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

HTML5 History API와 결합하여 매우 기본적이지만 기능이 완벽한 클라이언트측 라우터를 구축할 수 있습니다. 이를 실제로 보려면 [예제 앱](https://github.com/chrisvfritz/vue-2.0-simple-routing-example)을 확인하십시오.

## 써드파티 라우터 목록

써드파티 라우터를 사용하기 위해서, 예를 들어 [Page.js](https://github.com/visionmedia/page.js) 또는 [Director](https://github.com/flatiron/director)는 [쉽습니다.](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs) 여기에 Page.js를 사용하는 [완벽한 예제](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs)가 있습니다.
