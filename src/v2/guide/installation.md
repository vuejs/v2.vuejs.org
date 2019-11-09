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

Vue를 사용할 때, 브라우저에 [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools)를 설치 하는것이 좋습니다. Vue 앱을 보다 사용자 친화적인 인터페이스에서 검사하고 디버깅할 수 있습니다.

## 직접 `<script>`에 추가

다운로드 받아 script 태그에 추가하기만 하면 됩니다. `Vue`는 전역 변수로 등록됩니다.

<p class = "tip">개발 중에는 프로덕션 버전을 사용하지 마십시오. 경고 및 일반적인 실수를 놓칠 수 있습니다! </p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>개발 버전</a><span class="light info">모든 오류 메시지 및 디버그 모드</span>

  <a class="button" href="/js/vue.min.js" download>프로덕션 버전</a><span class="light info">오류 메시지 없음, {{gz_size}}kb min+gzip</span>
</div>

### CDN

프로토 타이핑또는 학습 목적이라면, 아래 코드로 최신 버전을 사용할 수 있습니다.

``` html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

프로덕션 환경인 경우 새 버전에서 예상치 못한 오류를 방지하려면 특정 버전의 빌드 파일을 추가하는것을 추천합니다.

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0"></script>
```

기본 ES 모듈을 사용하는 경우 이를 지원 하는 ES 모듈 호환 빌드 파일도 있습니다.

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js'
</script>
```

[cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/)에서 NPM 패키지의 소스를 둘러볼 수도 있습니다..

Vue는 [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) 와 [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js)에서도 사용할 수도 있습니다. (cdnjs는 동기화하는데 시간이 걸리므로 최신버전을 사용하지 못할 수 있습니다).

[각 다른 빌드간 차이점](#각-다른-빌드간-차이점)에 대해 읽어보고 배포된 사이트에서는 프로덕션 버젼을 사용하여 `vue.js`를 `vue.min.js`로 대체해주세요. 이는 개발 경험보다는 속도에 최적화된 빌드입니다.

## NPM

Vue를 사용하여 대규모 애플리케이션을 구축할 때 NPM를 이용한 설치를 권장하고 있습니다. NPM은 [Webpack](https://webpack.js.org/) 또는 [Browserify](http://browserify.org/)와 같은 모듈 번들러와 잘 작동합니다. Vue는 [싱글 파일 컴포넌트](single-file-components.html)를 만들기 위한 도구도 제공합니다.

``` bash
# 최신 안정화 버전
$ npm install vue
```

## CLI

Vue.js는 단일 페이지 애플리케이션를 빠르게 구축할 수 있는 [공식 CLI](https://github.com/vuejs/vue-cli)를 제공합니다. 최신 프론트엔드 워크 플로우를 위해 사전 구성된 빌드 설정을 제공합니다. 핫 리로드, 저장시 린트 체크 및 프로덕션 준비가 된 빌드로 시작하고 실행하는데 몇 분 밖에 걸리지 않습니다. 상세한 내용은 [Vue CLI 문서](https://cli.vuejs.org)에서 찾아보실 수 있습니다.

<p class="tip">
CLI는 Node.js 및 관련 빌드 도구에 대한 사전 지식을 전제로 하고 있습니다. Vue 또는 프런트엔드 빌드 도구를 처음 사용하는 경우 CLI를 사용하기 전에 빌드 도구없이 <a href="./">가이드</a>를 읽어 보시기 바랍니다.
</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="sponsored noopener" title="Vue CLI">Watch a video explanation on Vue Mastery</a></div>

## 각 다른 빌드간 차이점
[NPM 패키지의 `dist/` 디렉터리](https://unpkg.com/vue@latest/dist/)에는 Vue.js의 다양한 빌드가 있습니다. 다음은 그 차이점에 대한 개요입니다.

| | UMD | CommonJS | ES Module (for bundlers) | ES Module (for browsers) |
| --- | --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| **Full (production)** | vue.min.js | - | - | vue.esm.browser.min.js |
| **Runtime-only (production)** | vue.runtime.min.js | - | - | - |

### 용어

- **Full**: 컴파일러 및 런타임 버전을 모두 포함합니다.

- **Compiler**: 템플릿 문자열을 JavaScript 렌더링 함수로 컴파일하는 코드입니다.

- **Runtime**: Vue 인스턴스 생성, 가상 DOM 렌더링 및 업데이트 등을 담당하는 코드. 기본적으로 모든 컴파일러를 제외한 것입니다.

- **[UMD](https://github.com/umdjs/umd)**: UMD 빌드는 `<script>`태그를 통해 브라우저에서 직접 사용할 수 있습니다. [https://unpkg.com/vue](https://unpkg.com/vue)의 Unpkg CDN의 기본 파일은 Runtime + Compiler UMD 빌드 (`vue.js`)입니다.

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS 빌드는 [browserify](http://browserify.org/) 또는 [webpack 1](https://webpack.github.io)와 같은 이전 번들과 함께 사용하기 위한 것입니다. 이러한 번들(`pkg.main`)의 기본 파일은 런타임 전용 CommonJS 빌드(`vue.runtime.common.js`)입니다.

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES 모듈 빌드는 [webpack 2](https://webpack.js.org) 또는 [rollup](http://rollupjs.org/)과 같은 최신 번들과 함께 사용하기 위한 것입니다. 이러한 번들(`pkg.module`)의 기본 파일은 런타임 전용 ES 모듈 빌드(`vue.runtime.esm.js`)입니다.
  - 번들러용 ESM:  [webpack 2](https://webpack.js.org) 또는 [Rollup](https://rollupjs.org/)과 같은 최신 번들러와 함께 사용하도록 설계되었습니다. ESM 형식은 정적으로 구문 분석이 가능하도록 설계되었으므로 번들러을 활용하여 트리 쉐이킹을 실행하여 사용하지 않는 코드를 최종 패키지에서 제거할 수 있습니다. 이러한 번들러의 제공되는 기본 파일(`pkg.module`)은 ES 모듈 빌드의 런타임(`vue.runtime.esm.js`) 전용입니다.
  
  - 브라우저 ESM (2.6+ 만 해당): 최신 브라우저에서는 `<script type="module">`를 이용하여 직접 가져올 수 있습니다.

### 런타임 + 컴파일러와 런타임의 차이

템플릿을 실시간으로 컴파일 해야하는 경우(예 : 문자열을 `template` 옵션에 전달하거나 템플릿으로 in-DOM HTML을 사용하여 요소에 마운트하는 경우) 컴파일러와 전체 빌드가 필요합니다.

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

`vue-loader` 또는 `vueify`를 사용할 때 `*.vue` 파일의 템플릿은 빌드시 JavaScript로 미리 컴파일됩니다. 최종 번들에는 실제로 컴파일러가 필요하지 않으므로 런타임 전용 빌드를 사용할 수 있습니다.
런타임 전용 빌드는 전체 빌드보다 약 30% 정도 가벼우므로 언제든지 사용할 수 있습니다. 하지만 전체 빌드를 사용하려면 번들러에서 별칭을 구성해야합니다.

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
      'vue': require.resolve('vue/dist/vue.esm.js')
    })
  ]
})
```

#### Browserify

프로젝트의 `package.json`에 추가하십시오.

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

프로젝트의 `package.json`에 추가하십시오.

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### 개발모드와 프로덕션 모드 차이

개발/배포 모드는 UMD 빌드에 대해 하드 코딩되어 있습니다. 압축되지 않는 코드는 개발 환경에서 사용되고 압축된 코드는 파일은 프로덕션 환경에서 사용됩니다.

CommonJS 및 ES 모듈 빌드는 번들러용으로 제작되었으므로 압축된 버전을 제공하지 않습니다. 최종 번들을 직접 압축해야할 책임은 개발자에게 있습니다.

CommonJS 및 ES 모듈 빌드는 `process.env.NODE_ENV`에 대한 원시 검사를 유지하여 프로덕션 모드를 결정합니다. 적절한 모드를 사용하여 Vue가 실행될 모드를 제어하려면 이러한 번들 변수를 조작해야 합니다. `process.env.NODE_ENV`와 문자열 리터럴을 함께 사용하면 UglifyJS와 같은 minifier가 개발 전용 코드 블록을 완전히 삭제하여 최종 파일 크기를 줄일 수 있습니다.

#### Webpack

Webpack 4+인 경우, `mode` 옵션을 사용하세요:

``` js
module.exports = {
  mode: 'production'
}
```

하지만, Webpack 3 혹은 이전 버전이라면, [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)을 사용해야합니다.

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

[rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)를 이용하여 다음과 같이 사용하십시오.

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

글로벌 [envify](https://github.com/hughsk/envify)을 적용하여 번들러에 적용하십시오.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

[배포 관련 팁](deployment.html)을 참고하세요.

### CSP 환경

Chrome 앱과 같은 일부 환경에서는 CSP(컨텐츠 보안 정책)를 적용하여 식을 평가하므로 `new Function()`을 사용할 수 없습니다. 템플릿의 컴파일은 전체 빌드에 의존하기 때문에 이러한 환경에서는 사용할 수 없습니다.

반면 런타임 전용 빌드는 CSP와 완전히 호환됩니다. [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) 또는 [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple)로 런타임 전용 빌드를 사용하는 경우 템플릿은 CSP 환경에서 완벽하게 작동하는 `render` 함수로 미리 컴파일됩니다.

## 개발용 빌드

**중요합니다** : Github의 `/dist` 폴더에 있는 빌드된 파일은 릴리즈 중에만 체크인 됩니다. Github의 최신 코드에서 Vue를 사용하려면 직접 빌드해야 합니다.

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Bower는 UMD 빌드에서만 사용 가능합니다.

``` bash
# 최신 안정판
$ bower install vue
```

## AMD 모듈 로더

모든 UMD 빌드는 AMD 모듈로 직접 사용할 수 있습니다.
