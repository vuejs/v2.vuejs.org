---
title: 서버사이드 렌더링
type: guide
order: 24
---

## 서버사이드 렌더링이 필요하십니까?

SSR을 알아보기 전에 SSR이 무엇을 필요하고 언제 필요한지 알아봅시다.

### SEO

Google과 Bing은 동기식 자바스크립트 애플리케이션을 색인할 수 있습니다. __동기__ 가 핵심 단어입니다. 앱 로딩 스피너가 시작한 다음 Ajax를 통해 컨텐츠를 가져오면 크롤러가 완료될 때까지 기다리지 않습니다.

즉, SEO가 중요한 페이지에서 비동기적으로 내용을 가져오는 경우 SSR이 필요할 수 있습니다.

### 느린 인터넷 클라인트

사용자는 인터넷이 느린 원격 지역 또는 좋지 않은 환경에서 사이트를 방문할 수 있습니다. 이 경우 사용자가 기본 컨텐츠를 보는 데 필요한 요청의 수와 크기를 최소화 하여야 합니다.

[Webpack의 코드 분할](https://webpack.js.org/guides/code-splitting-require/)을 사용하면 사용자가 전체 응용 프로그램을 다운로드하여 단일 페이지를 볼 수 없도록 방지할 수 있지만 여전히 하나의 HTML파일로 사전에 렌더링 된 파일을 다운로드 합니다.

### 오래된 (또는 없는) 자바스크립트 엔진으로 만든 클라이언트

일부 지역 또는 1998년의 컴퓨터를 이용해 인터넷을 이용할 수 밖에 없는 곳이 있을 수 있습니다. Vue는 IE 9 이상에서만 작동하지만 더 오래된 브라우저 또는 힙스터 해커들이 터미널에서 [Lynx](http://lynx.browser.org/)를 사용하여 기본 컨텐츠를 볼 수 있도록 합니다.

### 서버사이드 렌더링 vs 사전 렌더링

소수의 마케팅 용 페이지 (예: `/`, `/about`, `/contact` 등)의 검색 엔진 최적화를 개선하기 위해 SSR을 알아보는 중이면 대신에 __사전 렌더링__ 을 원할 것 입니다. HTML을 즉석에서 컴파일 하기 위해 웹 서버를 사용하는 대신 사전 렌더링은 빌드 시 특정 경로에 대한 정적 HTML 파일을 생성합니다. 이 것의 장점은 사전 렌더링이 훨씬 간단하고 프론트엔드를 완전히 정적인 사이트로 유지할 수 있다는 점입니다.

웹팩을 사용하는 경우 [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)과 함께 사전 렌더링을 쉽게 추가할 수 있습니다 Vue 앱으로 광범위하게 테스트 되었습니다. 제작자는 실제로 Vue 코어 팀의 멤버입니다.

## Hello World


지금까지 보셨다면 SSR을 볼 준비가 되셨습니다. 복잡하게 들리지만 기능을 보여주는 간단한 Node.js 스크립트는 3단계밖에 필요하지 않습니다.

``` js
// 1 단계: Vue 인스턴스 만들기
var Vue = require('vue')
var app = new Vue({
  render: function (h) {
    return h('p', 'hello world')
  }
})

// 2 단계: 렌더러 만들기
var renderer = require('vue-server-renderer').createRenderer()

// 3 단계: Vue 인스턴스를 HTML로 렌더링 합니다.
renderer.renderToString(app, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">hello world</p>
})
```

해보는데 두렵지 않지요? 물론 이 예제는 대부분의 애플리케이션보다 훨씬 간단합니다. 우리는 아직 걱정할 필요가 없습니다.

- 웹서버
- 응답 스트리밍
- 컴포넌트 캐싱
- 빌드 프로세스
- 라우팅
- Vuex 상태 관리

이 가이드의 나머지 부분에서는 이러한 기능 중 일부를 사용하는 방법을 살펴 보겠습니다. 기본 사항을 이해하면 더 고급 사례를 처리하는데 도움이 되는 자세한 설명 및 고급 예제를 알아보겠습니다.

## Express 웹서버와 간단한 SSR

우리가 실제로 웹 서버를 가지고 있지 않을 때 "서버사이드 렌더링"이라고 부르는 것을 해보겠습니다. 간단히 고칠 것이 있습니다. 우리는 매우 간단한 SSR 앱을 만들기 위해 ES5를 사용하며 빌드 단계나 Vue 플러그인을 사용하지 않습니다.

먼저 페이지에 몇 초 동안 있었는지 사용자에게 알려주는 앱부터 시작해 보겠습니다.

``` js
new Vue({
  template: '<div>You have been here for {{ counter }} seconds.</div>',
  data: {
    counter: 0
  },
  created: function () {
    var vm = this
    setInterval(function () {
      vm.counter += 1
    }, 1000)
  }
})
```

SSR을 적용하기 위해 몇가지 수정해야 브라우저와 node 에서 모두 작동합니다.

- 브라우저에서 앱의 인스턴스를 전역 컨텍스트 (예: `window`)에 추가하면 마운트 할 수 있습니다.
- node에서 모든 요청에 대해 앱의 새로운 인스턴스를 만들 수 있도록 팩토리 함수를 export 합니다.

이 작업을 완료하려면 약간의 보일러플레이트가 필요 합니다.

``` js
// assets/app.js
(function () { 'use strict'
  var createApp = function () {
    // ---------------------
    // 일반 앱 코드 시작
    // ---------------------
    // Main Vue 인스턴스가 반환되어야 하며 id가 "app"인 루트 노드가 필요합니다.
    // 그러면 클라이언트 사이드 버전을 이용할 수 있습니다.
    return new Vue({
      template: '<div id="app">You have been here for {{ counter }} seconds.</div>',
      data: {
        counter: 0
      },
      created: function () {
        var vm = this
        setInterval(function () {
          vm.counter += 1
        }, 1000)
      }
    })

    // -------------------
    // 일반 앱 코드 종료
    // -------------------
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createApp
  } else {
    this.app = createApp()
  }
}).call(this)
```

이제 애플리케이션 코드가 생겼으므로 `index.html` 파일을 작성해 보겠습니다.

``` html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>My Vue App</title>
  <script src="/assets/vue.js"></script>
</head>
<body>
  <div id="app"></div>
  <script src="/assets/app.js"></script>
  <script>app.$mount('#app')</script>
</body>
</html>
```

참조된 `assets` 디렉토리에 이전에 생성한 `app.js` 파일과 Vue가 있는 `vue.js` 파일이 포함되어 있다면, 이제는 한 페이지짜리 애플리케이션을 사용해야 합니다!

그 다음 서버사이드 렌더링을 사용하여 작업하려면 다음 단계 - 웹서버로 나아가야 합니다.

``` js
// server.js
'use strict'

var fs = require('fs')
var path = require('path')

// app.js 서버 사이드 앱 정의를 위한 전역 Vue
global.Vue = require('vue')

// HTML 레이아웃 가져오기
var layout = fs.readFileSync('./index.html', 'utf8')

// 렌더러 생성
var renderer = require('vue-server-renderer').createRenderer()

// express server 생성
var express = require('express')
var server = express()

// assets 디렉터리에서 파일 제공하기
server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

// 모든 GET 요청 처리
server.get('*', function (request, response) {
  // Vue 앱을 문자열로 전달
  renderer.renderToString(
    // app 인스턴스 생성
    require('./assets/app')(),
    // 렌더링한 결과 조작
    function (error, html) {
      // 렌더링 중 에러가 발생하면...
      if (error) {
        // 콘솔에 에러 출력
        console.error(error)
        // 클라이언트에 에러 발생을 알림
        return response
          .status(500)
          .send('Server Error')
      }
      // 레이아웃과 app의 HTML을 전달
      response.send(layout.replace('<div id="app"></div>', html))
    }
  )
})

// 5000번 포트를 엽니다
server.listen(5000, function (error) {
  if (error) throw error
  console.log('Server is running at localhost:5000')
})
```

이게 다입니다! [전체 애플리케이션](https://github.com/chrisvfritz/vue-ssr-demo-simple)을 클론하여 사용할 수 있습니다. 일단 로컬에서 실행하면 페이지를 마우스 오른쪽 버튼으로 클릭하고 `페이지 소스 보기`(와 유사한) 선택을 하여 서버 측 렌더링이 실제로 작동하는지 확인할 수 있습니다. 당신은 body 에서 이것을 확인해야 합니다.

``` html
<div id="app"></div>
```

대신에

``` html
<div id="app" server-rendered="true">You have been here for 0 seconds&period;</div>
```


## 응답 스트리밍


Vue는 또한 스트리밍을 지원하는 웹 서버에 선호되는 __stream__ 에 렌더링 하는 것을 지원합니다. HTML이 생성되는 즉시 응답이 아닌 응답에 __HTML을 쓸 수 있습니다__. 결과는 단점도 없고 요청이 더 빨리 전달됩니다!

스트리밍을 위한 이전 섹션에서 우리의 애플리케이션을 대응하기 위해 단순히 `server.get('*', ...)` 블록을 다음으로 대체할 수 있습니다.

``` js
// 레이아웃을 HTML의 두 섹션으로 나눕니다.
var layoutSections = layout.split('<div id="app"></div>')
var preAppHTML = layoutSections[0]
var postAppHTML = layoutSections[1]

// 모든 GET 요청을 다룹니다.
server.get('*', function (request, response) {
  // Vue app을 스트림으로 렌더링 합니다.
  var stream = renderer.renderToStream(require('./assets/app')())

  // 응답에 app 이전의 HTML을 작성합니다.
  response.write(preAppHTML)

  // 새로운 덩어리가 렌더링 될 때마다...
  stream.on('data', function (chunk) {
    // 응답에 덩러리 쓰기
    response.write(chunk)
  })

  // 모든 렌더링이 끝났을 때
  stream.on('end', function () {
    // app 렌더링 이후의 HTML을 응답으로 전달
    response.end(postAppHTML)
  })

  // 렌더링 중 에러가 발생하면...
  stream.on('error', function (error) {
    // 콘솔에 에러 출력
    console.error(error)
    // 클라이언트에 에러 발생을 알림
    return response
      .status(500)
      .send('Server Error')
  })
})
```

보시다시피 스트림이 개념적으로 새롭다 하여도 이전 버전보다 훨씬 복잡한 것은 아닙니다. 단순하게,

1. 스트림을 설정합니다.
2. 응답 전 상황의 앱의 HTML을 작성합니다.
3. 사용할 수 있게 되면 앱 HTML을 응답에 씁니다.
4. 응답 후에 앱 뒤에 오는 HTML을 작성하고 종료합니다.
5. 오류 처리 합니다.

## 컴포넌트 캐싱

Vue의 SSR은 기본적으로 매우 빠르지만 렌더링된 컴포넌트를 캐싱하여 성능을 더욱 향상시킬 수 있습니다. 그러나 잘못된 컴포넌트를 캐싱하거나 잘못된 키를 사용하여 올바른 컴포넌트를 캐싱하면 앱을 잘못 렌더링 할 수 있어 이 기능을 고급 기능으로 간주합니다. 구체적으로는:

<p class="tip">전역 상태(예: vuex 저장소)에 의존하는 하위 컴포넌트가 포함된 컴포넌트는 캐시하지 않아야 합니다. 그렇게 하면 하위 컴포넌트(실은 하위 컴포넌트 트리 전체)도 캐시 됩니다. slot/자식을 허용하는 컴포넌트에 특히 주의하십시오.</p>

### 설정

경고가 나오는 경우에 컴포넌트를 캐시하는 방법이 있습니다.

먼저 렌더러에 [캐시 객체](https://www.npmjs.com/package/vue-server-renderer#cache)를 제공해야 합니다. 다음은 [lru-cache](https://github.com/isaacs/node-lru-cache)를 사용하는 간단한 예제입니다.

``` js
var createRenderer = require('vue-server-renderer').createRenderer
var lru = require('lru-cache')

var renderer = createRenderer({
  cache: lru(1000)
})
```

그러면 최대 1000개의 고유한 렌더링이 캐시 됩니다. 메모리 사용과 밀접하게 관련된 다른 구성에 대해서는 [the lru-cache options](https://github.com/isaacs/node-lru-cache#options)를 참조하십시오.

그런 다음 캐시하려는 컴포넌트에 다음을 제공해야 합니다.

- 유일한 `name`
- `serverCacheKey` 함수는 컴포넌트에 적용되는 고유 키를 반환합니다.

예제:

``` js
Vue.component({
  name: 'list-item',
  template: '<li>{{ item.name }}</li>',
  props: ['item'],
  serverCacheKey: function (props) {
    return props.item.type + '::' + props.item.id
  }
})
```

### 캐싱에 이상적인 컴포넌트

모든 "순수한" 컴포넌트는 안전하게 캐시될 수 있습니다. 즉, 같은 props가 주어진 같은 HTML을 생성하도록 보장되는 컴포넌트 입니다. 이들의 일반적인 예는 다음과 같습니다.

- 정적 컴포넌트 (즉, 항상 같은 HTML을 생성하므로 `serverCacheKey` 함수는 `true`를 반환할 수 있습니다.)
- 리스트 항목 컴포넌트 (큰 목록의 일부분을 캐싱하면 성능이 크게 향상될 수 있습니다.)
- 일반 UI 구성요소 (예: 버튼, 경고 등 - 최소한 slot / 자식보다는 props를 통해 컨텐츠를 받는 경우)

## 빌드 프로세스, 라우팅 그리고 Vuex 상태 관리

지금까지 서버사이드 렌더링의 기본 개념을 이해해야 합니다. 그러나 빌드 프로세스, 라우팅 및 vuex를 소개할 때마다 자체적으로 고려해야할 사항이 있습니다.

복잡한 응용 프로그램에서 서버 사이드 렌더링을 마스터하려면 다음 자료를 자세히 살펴보는 것이 좋습니다.

- [vue-server-renderer docs](https://www.npmjs.com/package/vue-server-renderer#api): 여기에서 언급 한 내용에 대한 자세한 설명과 더불어 [교차 요청에 따른 위험 방지](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) 및 [별도의 서버 빌드 추가](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle) 등 응용적인 주제를 소개하고 있습니다.
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): Vue의 주요 라이브러리와 개념을 응용 프로그램으로 정리 한 예제입니다.

## Nuxt.js

배포 준비 완료 상태의 서버측 렌더링을 사용하는 애플리케이션을 올바르게 구성하는 것은 어려운 작업입니다. 다행히 이 모든 것을보다 쉽게하기 위한 훌륭한 커뮤니티 프로젝트가 있습니다. [Nuxt.js](https://nuxtjs.org/)입니다. Nuxt.js는 Vue 생태계 위에 만들어진 상위 수준의 범용 Vue 애플리케이션을 작성하는 데 매우 간소화 된 개발 환경을 제공합니다. 더 나아가 정적 사이트 생성기(단일 파일 Vue 컴포넌트로 작성된 페이지 포함)로 사용할 수도 있습니다. 한번 시도해보세요
