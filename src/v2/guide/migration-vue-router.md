---
title: Vue Router 0.7.x으로 부터 마이그레이션
type: guide
order: 602
---

> Vue 2는 Vue 2와 호환되므로 Vue를 업데이트하는 경우 Vue Router도 함께 업데이트해야합니다. 이것이 주요 문서에서 마이그레이션 경로에 대한 세부 정보를 포함시킨 이유입니다. 새 Vue Router 사용에 대한 전체 안내서는 [Vue Router 문서](http://router.vuejs.org/en/)를 참조하십시오.

## 라우터 초기화

### `router.start` <sup>변경</sup>

Vue Router로 앱을 초기화하는 특별한 API는 더 이상 존재하지 않습니다. 그 대신에 다음을 의미합니다:

``` js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

Vue 인스턴스에 라우터 속성 만 전달하면됩니다.

``` js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

또는 Vue의 런타임 전용 빌드를 사용하는 경우

``` js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 호출되는 <code>router.start</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

## 라우터 정의

### `router.map` <sup>변경</sup>

이제 라우트는 라우터 인스턴스화시 [`routes` 옵션](http://router.vuejs.org/en/essentials/getting-started.html#javascript)에 배열로 정의됩니다. 따라서 예를 들어 이러한 라우트는 다음과 같습니다.

``` js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

대신 다음과 같이 정의됩니다.

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

객체를 반복 할 때 브라우저간에 같은 키 순서를 사용하는 것이 보장되지 않기 때문에 배열 구문을 사용하면보다 예측 가능한 경로 일치가 가능합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>router.map</code>가 호출되는 의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `router.on` <sup>제거됨</sup>

앱을 시작할 때 프로그래밍으로 경로를 생성해야하는 경우 라우터 정의를 동적으로 경로 배열에 푸시함으로써 수행 할 수 있습니다. 예 :

``` js
// 기본 라우트
var routes = [
  // ...
]

// 동적으로 생성한 라우트
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

라우터가 인스턴스화 된 후에 새 경로를 추가해야하는 경우 추가하려는 경로가 포함 된 새 라우터로 라우터의 일치자(matcher)를 바꿀 수 있습니다.

``` js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>router.on</code>가 호출되는지 확인하십시오.</p>
</div>
{% endraw %}

### `router.beforeEach` <sup>changed</sup>

`router.beforeEach`는 이제 비동기적으로 작동하며 세번째 전달인자로 `next` 함수를 받습니다.

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

``` js
router.beforeEach(function (to, from, next) {
  if (to.path === '/forbidden') {
    next(false)
  } else {
    next()
  }
})
```

### `subRoutes` <sup>이름 변경</sup>

Vue 및 다른 라우팅 라이브러리와의 일관성을 위해 [자식으로 이름이 변경](http://router.vuejs.org/en/essentials/nested-routes.html) 되었습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>subRoutes</code> 옵션의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `router.redirect` <sup>변경</sup>

[경로 정의에 대한 옵션](http://router.vuejs.org/en/essentials/redirect-and-alias.html)입니다. 예를 들어 다음과 같이 업데이트 할 것입니다.

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

`routes` 설정에서 아래와 같은 정의로 바꿉니다:

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>router.redirect</code>가 호출되는지 확인하십시오.</p>
</div>
{% endraw %}

### `router.alias` <sup>변경</sup>

별칭을 지정하려는 [경로 정의 옵션](http://router.vuejs.org/en/essentials/redirect-and-alias.html)입니다. 예를 들어 다음과 같이 업데이트 할 것입니다.

``` js
router.alias({
  '/manage': '/admin'
})
```

`routes` 설정에서 아래와 같은 정의로 바꿉니다:

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

여러 개의 별칭이 필요한 경우 배열 구문을 사용할 수도 있습니다.

``` js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>router.alias</code>가 호출되는지 확인하십시오.</p>
</div>
{% endraw %}

### 임의 라우트 속성 <sup>변경</sup>

미래의 기능과의 충돌을 피하기 위해 임의의 라우트 속성이 새 메타 속성 아래에서 범위가 지정되어야합니다. 예를 들어, 다음과 같이 정의했다면 :

``` js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

이제 다음과 같이 업데이트 할 것입니다.

``` js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```

그런 다음 경로에서 이 속성에 나중에 액세스하면 mata 예제를 계속 진행합니다.

``` js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 메타에서 범위가 지정되지 않은 임의의 경로 속성의 예를 찾으십시오.</p>
</div>
{% endraw %}

### 쿼리의 배열 구문 <sup>제거됨</sup>

쿼리 전달인자로 배열을 전달할 때 QueryString 문법은 더 이상 `/foo?users[]=Tom&users[]=Jerry`가 아닌 새로운 문법 `/foo?users=Tom&users=Jerry` 입니다.
내부적으로,`$route.query.users`는 여전히 배열이 되지만, 이 경로에 직접 접근 할 때 `/foo?users=Tom` 쿼리에 단 하나의 전달인자가 있다면, 라우터는 `users`가 배열임을 기대합니다.
이 때문에 계산된 속성을 추가하여 `$route.query.users`의 모든 참조를 이 속성으로 대체하는 것을 고려해야합니다.

```javascript
export default {
  // ...
  computed: {
    // users는 항상 배열입니다
    users () {
      const users = this.$route.query.users
      return Array.isArray(users) ? users : [users]
    }
  }
}
```

## 라우트 매칭

라우트 매칭은 이제 [path-to-regexp](https://github.com/pillarjs/path-to-regexp)를 사용해 이전보다 훨씬 유연합니다.

### 하나 이상의 이름을 가지는 인자 <sup>변경</sup>

구문이 약간 변경되었으므로, 예를 들어`/category/*tags` 는 `/category/:tags+` 로 업데이트 되어야 합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 더 이상 사용되지 않는 경로 구문의 예를 찾으십시오.</p>
</div>
{% endraw %}

## 링크

### `v-link` <sup>변경</sup>

`v-link` 디렉티브는 새로운[`<router-link>` 컴포넌트](http://router.vuejs.org/en/api/router-link.html)로 대체되었습니다.이 일은 이제 Vue 2의 컴포넌트의 책임입니다.

``` html
<a v-link="'/about'">About</a>
```

다음과 같이 업데이트해야합니다.

``` html
<router-link to="/about">About</router-link>
```

`target="_blank"` 는 `<router-link>` 에서 지원되지 않으므로 새 탭에서 링크를 열어야 할 경우 대신`<a>`를 사용해야합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>v-link</code> 디렉티브의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `v-link-active` <sup>변경</sup>

`v-link-active` 디렉티브는 [`<router-link>` 컴포넌트](http://router.vuejs.org/en/api/router-link.html)의`tag` 속성으로 대체되었습니다. 예를 들어 다음과 같이 업데이트 할 것입니다.

``` html
<li v-link-active>
  <a v-link="'/about'">About</a>
</li>
```

이는 아래와 같이 변경 되었습니다.

``` html
<router-link tag="li" to="/about">
  <a>About</a>
</router-link>
```

`<a>`는 실제 링크가 될 것이고 올바른 href를 얻을 것이다. 그러나 활성 클래스는 바깥 쪽`<li>`에 적용될 것이다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>v-link-active</code> 디렉티브의 예를 찾으십시오.</p>
</div>
{% endraw %}

## 프로그래밍 방식의 네비게이션

### `router.go` <sup>변경</sup>

[HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)와의 일관성을 위해 `router.go`는 [뒤로 / 앞으로 탐색](https://router.vuejs.org/en/essentials/navigation.html#routergon)에만 사용되며 [`router.push`](http://router.vuejs.org/en/essentials/navigation.html#routerpushlocation)는 특정 페이지로 이동하는 데 사용됩니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>router.go</code>를 사용하고 있고 <code>router.push</code>가 대신 사용되야 하는 예를 찾으십시오.</p>
</div>
{% endraw %}

## 라우터 옵션 : 모드

### `hashbang: false` <sup>제거됨</sup>

Hashbang은 더 이상 Google이 URL을 크롤링하는 데 필요하지 않으므로 더 이상 해시 전략의 기본 (또는 옵션)이 아닙니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>hashbang: false</code> 옵션을 사용하는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `history: true` <sup>변경</sup>

모든 라우팅 모드 옵션은 단일 [모드](http://router.vuejs.org/en/api/options.html#mode) 옵션으로 압축되었습니다.

``` js
var router = new VueRouter({
  history: 'true'
})
```

위를 아래 코드로 변경합니다.

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>history: true</code> 옵션이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `abstract: true` <sup>변경</sup>

모든 라우팅 모드 옵션은 단일 [`mode` 옵션](http://router.vuejs.org/en/api/options.html#mode)으로 압축되었습니다.

``` js
var router = new VueRouter({
  abstract: 'true'
})
```

위를 아래 코드로 변경합니다.

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>abstract: true</code> 옵션이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

## Route 옵션: 기타

### `saveScrollPosition` <sup>변경</sup>

이것은 함수를 받아들이는 [`scrollBehavior` 옵션](http://router.vuejs.org/en/advanced/scroll-behavior.html)으로 대체되었으므로 라우트마다 스크롤 동작을 완벽하게 사용자 정의 할 수 있습니다 . 이것은 많은 새로운 가능성을 열어 놓았지만 단순히 다음과 같은 예전의 행동을 그대로 재현할 수 있습니다.

``` js
saveScrollPosition: true
```

위를 아래 코드로 변경합니다.

``` js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>saveScrollPosition: true</code> 옵션이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `root` <sup>이름 변경</sup>

[HTML`<base>` 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)와의 일관성을 위해 `base`로 이름이 변경되었습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>root</code> 옵션이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>제거됨</sup>

Vue의 전환 시스템에 명시적인 [`appear` 전환 제어](transitions.html#Transitions-on-Initial-Render)가 추가되었으므로이 옵션은 더 이상 필요하지 않습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>transitionOnLoad: true</code> 옵션이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>제거됨</sup>

훅 단순화로 인해 제거되었습니다. 정말로 전환 오류를 억제해야한다면 [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)를 사용할 수 있습니다. 대신.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>suppressTransitionError: true</code> 옵션이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

## 라우트 훅

### `activate` <sup>변경</sup>

대신 컴포넌트에서 [`beforeRouteEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards)를 사용하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>beforeRouteEnter</code> 훅이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `canActivate` <sup>변경</sup>

라우터에서 [`beforeEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#perroute-guard)을 대신 사용하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>canActivate</code> 훅이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `deactivate` <sup>제거됨</sup>

컴포넌트의 [`beforeDestroy`](../api/#beforeDestroy) 또는 [`destroyed`](../api/#destroyed) 훅을 대신 사용하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>deactivate</code> 훅이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `canDeactivate` <sup>대체됨</sup>

컴포넌트의 [`beforeRouteLeave`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards)을 대신 사용하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>canDeactivate</code> 훅이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `canReuse: false` <sup>제거됨</sup>

새로운 Vue Router에는 더 이상 유스 케이스가 없습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>canReuse: false</code> 옵션이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `data` <sup>변경</sup>

이제 `$route` 속성은 반응적입니다. 따라서 감시자를 사용하여 다음과 같이 경로 변경에 반응할 수 있습니다 :

``` js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>data</code> 훅이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>제거됨</sup>

자신의 속성 (예 : `isLoading`)을 정의한 다음 경로의 감시자에서 로드 상태를 업데이트합니다. 예를 들어, [axios](https://github.com/mzabriskie/axios)로 데이터를 가져 오는 경우 :

``` js
data: function () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': function () {
    var self = this
    self.isLoading = true
    self.fetchData().then(function () {
      self.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    var self = this
    return axios.get('/api/posts')
      .then(function (response) {
        self.posts = response.data.posts
      })
      .catch(function (error) {
        self.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>$loadingRouteData</code> 메타 속성이 사용되는 예를 찾으십시오.</p>
</div>
{% endraw %}
