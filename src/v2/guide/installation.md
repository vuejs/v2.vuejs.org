---
title: 설치방법
type: guide
order: 1
vue_version: 2.5.16
gz_size: "30.67"
---

### 호환성 정보

Vue는 ECMAScript 5 기능을 사용하기 때문에 IE8 이하 버전을 **지원하지 않습니다.** 하지만 모든 [ECMAScript 5 호환 브라우저](http://caniuse.com/#feat=es5)를 지원합니다

### 릴리즈 노트

최신 안정 버전: {{vue_version}}

각 버전에 대한 자세한 릴리즈 노트는 [GitHub](https://github.com/vuejs/vue/releases)에서 보실 수 있습니다.


## Vue Devtools

Vue를 사용할 때, 브라우저에 [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools)를 설치하세요. Vue 앱을 보다 사용자 친화적으로 검사하고 디버그할 수 있습니다.

## 직접 `<script>`에 추가

다운로드 받아 script 태그에 추가하기만 하면 됩니다. `Vue`는 전역 변수로 등록됩니다.

<p class = "tip">개발 중에는 최소화 버전을 사용하지 마십시오. 일반적인 실수에 대한 모든 훌륭한 경고를 놓치게됩니다! </p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>개발용 버전</a><span class="light info">모든 경고 및 디버그 모드 포함</span>

<a class="button" href="/js/vue.min.js" download>배포용 버전</a><span class="light info">경고가 제거 되고, {{gz_size}}kb min+gzip 로 압축하였습니다.</span>
</div>

### CDN

추천 : [https://unpkg.com/vue](https://unpkg.com/vue)는 npm에 올라간 최신 버전을 반영합니다. [https://unpkg.com/vue/](https://unpkg.com/vue/)에서 npm 패키지의 원본을 찾아 볼 수도 있습니다.

또한 [jsDelivr](//cdn.jsdelivr.net/vue/latest/vue.js)와 [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js)를 사용할 수 있으나, 두 서비스는 동기화에 시간이 걸리므로 아직 최신 버전을 사용지 못할 수 있습니다.

## NPM

Vue로 대규모 응용 프로그램을 빌드할 때 NPM을 권장합니다. [Webpack](https://webpack.js.org/) 또는 [Browserify](http://browserify.org/)와 같은 모듈 번들러와 잘 작동합니다. Vue는 [싱글 파일 컴포넌트](single-file-components.html)를 만들기 위한 도구도 제공합니다.

``` bash
# 최신 안정화 버전
$ npm install vue
```

## CLI

Vue.js는 단일 페이지 응용 프로그램을 빠르게 스캐폴딩하기 위한 [공식 CLI](https://github.com/vuejs/vue-cli)를 제공합니다. 현대적인 프론트엔드 워크플로우를 위해 잘 구성된 빌드 설정을 제공합니다. 핫 리로드, lint-on-save 및 프로덕션 준비가 된 빌드로 시작하고 실행하는데 몇 분 밖에 걸리지 않습니다. 상세한 내용은 [Vue CLI 문서](https://cli.vuejs.org) 를 참고하기 바랍니다.

<p class="tip">
CLI는 Node.js 및 관련 빌드 도구에 대한 사전 지식을 필요로 합니다. Vue 또는 프런트엔드 빌드 도구를 처음 사용하는 경우 CLI를 사용하기 전에 빌드 도구없이 <a href="./">가이드</a>를 읽어 보시기 바랍니다.
</p>

## 각 다른 빌드간 차이점
[NPM 패키지의 `dist/` 디렉터리](https://unpkg.com/vue@latest/dist/)에는 Vue.js의 다양한 빌드가 있습니다. 다음은 그 차이점에 대한 개요입니다.

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | - | - |
| **Runtime-only (production)** | vue.runtime.min.js | - | - |

### 용어

- **Full**: 컴파일러와 런타임을 포함.

- **Compiler**: 템플릿 문자열을 JavaScript 렌더링 함수로 컴파일하는 코드입니다.

- **Runtime**: Vue 인스턴스 생성, 가상 DOM 렌더링 및 패치 등을 담당하는 코드. 기본적으로 모든 컴파일러를 제외한 것입니다.

- **[UMD](https://github.com/umdjs/umd)**: UMD 빌드는 `<script>`태그를 통해 브라우저에서 직접 사용할 수 있습니다. [https://unpkg.com/vue](https://unpkg.com/vue)의 Unpkg CDN의 기본 파일은 Runtime + Compiler UMD 빌드 (`vue.js`)입니다.

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS 빌드는 [browserify](http://browserify.org/) 또는 [webpack 1](https://webpack.github.io)와 같은 이전 번들과 함께 사용하기 위한 것입니다. 이러한 번들(`pkg.main`)의 기본 파일은 런타임 전용 CommonJS 빌드(`vue.runtime.common.js`)입니다.

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES 모듈 빌드는 [webpack 2](https://webpack.js.org) 또는 [rollup](http://rollupjs.org/)과 같은 최신 번들과 함께 사용하기 위한 것입니다. 이러한 번들(`pkg.module`)의 기본 파일은 런타임 전용 ES 모듈 빌드(`vue.runtime.esm.js`)입니다.

### Runtime + Compiler vs. Runtime-only

템플릿을 즉석에서 컴파일 해야하는 경우(예 : 문자열을 `template` 옵션에 전달하거나 템플릿으로 in-DOM HTML을 사용하여 요소에 마운트하는 경우) 컴파일러가 필요하므로 전체 빌드가 필요합니다.

``` js
// 아래 내용은 컴파일러가 필요합니다
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 아래는 필요하지 않습니다
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

`vue-loader` 또는 `vueify`를 사용할 때 `*.vue` 파일의 템플릿은 빌드시 JavaScript로 미리 컴파일됩니다. 최종 번들에 컴파일러가 실제로 필요하지 않으므로 런타임 전용 빌드를 사용할 수 있습니다.
런타임 전용 빌드는 전체 빌드보다 약 30% 정도 작아서 언제든지 사용할 수 있습니다. 하지만 전체 빌드를 사용하려면 번들러에서 별칭을 구성해야합니다.

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js'  webpack 1용 입니다
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

프로젝트의 `package.json`에 추가하세요

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### 개발 vs. 배포 모드

개발/배포 모드는 UMD 빌드에 대해 하드 코딩되어 있습니다. 최소화되지 않은 파일은 개발 용이고 최소화 파일은 제작용입니다.

CommonJS 및 ES 모듈 빌드는 번들용으로 제작되었으므로 최소화 버전을 제공하지 않습니다. 최종 번들을 직접 최소화할 책임은 사용자에 있습니다.

CommonJS 및 ES 모듈 빌드는 `process.env.NODE_ENV`에 대한 원시 검사를 유지하여 실행 모드를 결정합니다. 적절한 모드를 사용하여 Vue가 실행될 모드를 제어하려면 이러한 번들 변수를 조작해야 합니다. `process.env.NODE_ENV`와 문자열 리터럴을 함께 사용하면 UglifyJS와 같은 minifier가 개발 전용 코드 블록을 완전히 삭제하여 최종 파일 크기를 줄일 수 있습니다.

#### Webpack

Webpack의 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)을 사용하세요

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

[rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)을 사용하세요

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

전역 [envify](https://github.com/hughsk/envify)을 적용하여 번들하세요

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

[배포 관련 팁](deployment.html)을 참고하세요.

### CSP 환경

Google 크롬 앱과 같은 일부 환경에서는 CSP(컨텐츠 보안 정책)를 적용하여 표현식을 평가하는 데 `new Function()` 을 사용할 수 없습니다. 전체 빌드는이 기능을 사용하여 템플릿을 컴파일하므로 이러한 환경에서는 사용할 수 없습니다.

반면 런타임 전용 빌드는 CSP와 완벽하게 호환됩니다. [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) 또는 [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple)로 런타임 전용 빌드를 사용하는 경우 템플릿은 CSP 환경에서 완벽하게 작동하는 `render` 함수로 미리 컴파일됩니다.

## 개발용 빌드

**중요합니다** : Github의 `/dist` 폴더에 있는 빌드된 파일은 릴리즈 중에만 체크인 됩니다. Github의 최신 코드에서 Vue를 사용하려면 직접 빌드해야 합니다.

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Bower 에서는 UMD 빌드만 사용 가능합니다.

``` bash
# 최신 안정판
$ bower install vue
```

## AMD 모듈 로더

모든 UMD 빌드는 AMD 모듈로 직접 사용할 수 있습니다.
