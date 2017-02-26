---
title: 설치방법
type: guide
order: 1
vue_version: 2.2.0
dev_size: "234.23"
min_size: "74.22"
gz_size: "26.87"
ro_gz_size: "18.71"
---

### 호환성 정보

Vue는 ECMAScript 5 기능을 사용하기 때문에 IE8 이하 버전을 **지원하지 않습니다.** 하지만 모든 [ECMAScript 5 호환 브라우저](http://caniuse.com/#feat=es5)를 지원합니다

### 릴리즈 노트

각 버전에 대한 자세한 릴리즈 노트는 [GitHub](https://github.com/vuejs/vue/releases)에서 보실 수 있습니다.

## 독립 실행형

다운로드 받아 script 태그에 추가하기만 하면 됩니다. `Vue`는 전역 변수로 등록됩니다.

<p class = "tip">개발 중에는 최소화 버전을 사용하지 마십시오. 일반적인 실수에 대한 모든 훌륭한 경고를 놓치게됩니다! </p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>개발용 버전</a><span class="light info">모든 경고 및 디버그 모드 포함</span>

<a class="button" href="/js/vue.min.js" download>배포용 버전</a><span class="light info">경고가 제거 되고, {{gz_size}}kb min+gzip 로 압축하였습니다.</span>
</div>

### CDN

추천 : [unpkg](https://unpkg.com/vue/dist/vue.js)는 npm에 올라간 최신 버전을 반영합니다. [unpkg.com/vue/](https://unpkg.com/vue/)에서 npm 패키지의 원본을 찾아 볼 수도 있습니다.

또한 [jsDelivr](//cdn.jsdelivr.net/vue/latest/vue.js)와 [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js)를 사용할 수 있으나, 두 서비스는 동기화에 시간이 걸리므로 아직 최신 버전을 사용지 못할 수 있습니다.

## NPM

Vue로 대규모 응용 프로그램을 빌드할 때 NPM을 권장합니다. [Webpack](https://webpack.js.org/) 또는 [Browserify](http://browserify.org/)와 같은 모듈 번들러와 잘 작동합니다. Vue는 [단일 파일 컴포넌트](single-file-components.html)를 만들기 위한 도구도 제공합니다.

``` bash
# 최신 안정화 버전
$ npm install vue
```

### 독립 실행형 vs. 런타임 전용 빌드

두가지 빌드를 사용할 수 있습니다.

- `vue.common.js` - 독립 실행 형 빌드 - 템플릿 컴파일러를 포함하고 `template` 옵션을 지원합니다. **또한 브라우저 API의 존재 여부에 의존하므로 서버 측 렌더링에 사용할 수 없습니다.** 템플릿 컴파일러는 Vue 템플릿 문자열을 순수 JavaScript 렌더링 함수로 컴파일해야합니다. `template` 옵션을 사용하려면, 컴파일러가 필요합니다. `Vuex` 저장소는 독립형 빌드도 필요합니다.

- `vue.js` - (런타임 전용 빌드)는 템플릿 컴파일러를 포함하지 않고 `template` 옵션을 지원하지 않습니다. 런타임 전용 빌드를 사용할 때 `render` 옵션을 사용할 수 있으나, 단일 파일 컴포넌트의 템플릿은 빌드 단계에서 `render` 함수로 사전에 컴파일되기 때문에 단일 파일 컴포넌트에서만 작동합니다. 런타임 전용 빌드는 독립 실행 형 빌드보다 약 30% 가벼우며 {{ro_gz_size}}kb min+gzip 정도 밖에 안됩니다.

기본적으로 NPM 패키지는 **런타임 전용** 빌드입니다. 독립 실행형 빌드를 사용하려면 Webpack 구성에 다음과 같은 별칭을 추가합니다.

``` js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.common.js'
  }
}
```

Browserify의 경우 package.json에 별칭을 추가 할 수 있습니다:

``` js
"browser": {
  "vue": "vue/dist/vue.common"
},
```

<p class="tip">`import Vue from 'vue/dist/vue.js'`를 하지 마십시오 - 일부 도구나 써드파티 라이브러리에서도 Vue를 가져올 수 있기 때문에 런타임 빌드와 독립실행형 빌드를 동시에 가져와 읽는 오류를 낼 수 있습니다.</p>

### CSP 환경

Google 크롬 앱과 같은 일부 환경에서는 CSP(컨텐츠 보안 정책)를 적용하여 표현식을 평가하는 데 `new Function()` 을 사용할 수 없습니다. 독립 실행형 빌드는이 기능을 사용하여 템플릿을 컴파일하므로 이러한 환경에서는 사용할 수 없습니다.

반면 런타임 전용 빌드는 CSP와 완벽하게 호환됩니다. [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) 또는 [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple)로 런타임 전용 빌드를 사용하는 경우 템플릿은 CSP 환경에서 완벽하게 작동하는 `render` 함수로 미리 컴파일됩니다.

## 커맨드라인 인터페이스

Vue.js는 야심찬 단일 페이지 응용 프로그램을 빠르게 스캐폴딩하기 위한 [공식 커맨드라인 인터페이스](https://github.com/vuejs/vue-cli)를 제공합니다. 현대적인 프론트엔드 작업 방식을 위해 잘 갖춰진 빌드 설정을 제공합니다. 핫 리로드, 저장시 Lint 및 배포 준비된 빌드를 사용해 설치 및 실행하는데 몇분밖에 걸리지 않습니다.

``` bash
# vue-cli 설치
$ npm install --global vue-cli
# "webpack" 템플릿을 사용하여 새 프로젝트 만들기
$ vue init webpack my-project
# 의존성 설치 및 이동!
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">CLI는 Node.js 및 관련 빌드 도구에 대한 사전 지식을 전제로합니다. Vue 또는 프런트 엔드 빌드 도구를 처음 사용하는 경우 CLI를 사용하기 전에 빌드 도구없이 <a href="./">안내서</a>를 읽어 보시기 바랍니다.</p>

## 개발용 빌드

**중요합니다** : Github의 `/dist` 폴더에 있는 빌드된 파일은 릴리즈 중에만 체크인 됩니다. Github의 최신 코드에서 Vue를 사용하려면 직접 빌드해야 합니다.

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# 최신 안정판
$ bower install vue
```

## AMD 모듈 로더

Bower를 통해 설치된 독립 실행형 다운로드 또는 버전은 UMD로 랩핑되어 AMD 모듈로 직접 사용될 수 있습니다.
