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

<<<<<<< HEAD
## 독립 실행형
=======
## Direct `<script>` Include
>>>>>>> vuejs/master

다운로드 받아 script 태그에 추가하기만 하면 됩니다. `Vue`는 전역 변수로 등록됩니다.

<p class = "tip">개발 중에는 최소화 버전을 사용하지 마십시오. 일반적인 실수에 대한 모든 훌륭한 경고를 놓치게됩니다! </p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>개발용 버전</a><span class="light info">모든 경고 및 디버그 모드 포함</span>

<a class="button" href="/js/vue.min.js" download>배포용 버전</a><span class="light info">경고가 제거 되고, {{gz_size}}kb min+gzip 로 압축하였습니다.</span>
</div>

### CDN

<<<<<<< HEAD
추천 : [unpkg](https://unpkg.com/vue/dist/vue.js)는 npm에 올라간 최신 버전을 반영합니다. [unpkg.com/vue/](https://unpkg.com/vue/)에서 npm 패키지의 원본을 찾아 볼 수도 있습니다.
=======
Recommended: [https://unpkg.com/vue](https://unpkg.com/vue), which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at [https://unpkg.com/vue/](https://unpkg.com/vue/).
>>>>>>> vuejs/master

또한 [jsDelivr](//cdn.jsdelivr.net/vue/latest/vue.js)와 [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js)를 사용할 수 있으나, 두 서비스는 동기화에 시간이 걸리므로 아직 최신 버전을 사용지 못할 수 있습니다.

## NPM

Vue로 대규모 응용 프로그램을 빌드할 때 NPM을 권장합니다. [Webpack](https://webpack.js.org/) 또는 [Browserify](http://browserify.org/)와 같은 모듈 번들러와 잘 작동합니다. Vue는 [단일 파일 컴포넌트](single-file-components.html)를 만들기 위한 도구도 제공합니다.

``` bash
# 최신 안정화 버전
$ npm install vue
```

<<<<<<< HEAD
### 독립 실행형 vs. 런타임 전용 빌드

두가지 빌드를 사용할 수 있습니다.

- `vue.common.js` - 독립 실행 형 빌드 - 템플릿 컴파일러를 포함하고 `template` 옵션을 지원합니다. **또한 브라우저 API의 존재 여부에 의존하므로 서버 측 렌더링에 사용할 수 없습니다.** 템플릿 컴파일러는 Vue 템플릿 문자열을 순수 JavaScript 렌더링 함수로 컴파일해야합니다. `template` 옵션을 사용하려면, 컴파일러가 필요합니다. `Vuex` 저장소는 독립형 빌드도 필요합니다.

- `vue.js` - (런타임 전용 빌드)는 템플릿 컴파일러를 포함하지 않고 `template` 옵션을 지원하지 않습니다. 런타임 전용 빌드를 사용할 때 `render` 옵션을 사용할 수 있으나, 단일 파일 컴포넌트의 템플릿은 빌드 단계에서 `render` 함수로 사전에 컴파일되기 때문에 단일 파일 컴포넌트에서만 작동합니다. 런타임 전용 빌드는 독립 실행 형 빌드보다 약 30% 가벼우며 {{ro_gz_size}}kb min+gzip 정도 밖에 안됩니다.

기본적으로 NPM 패키지는 **런타임 전용** 빌드입니다. 독립 실행형 빌드를 사용하려면 Webpack 구성에 다음과 같은 별칭을 추가합니다.
=======
## CLI

Vue.js provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds:

``` bash
# install vue-cli
$ npm install --global vue-cli
# create a new project using the "webpack" template
$ vue init webpack my-project
# install dependencies and go!
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">The CLI assumes prior knowledge of Node.js and the associated build tools. If you are new to Vue or front-end build tools, we strongly suggest going through <a href="./">the guide</a> without any build tools before using the CLI.</p>

## Explanation of Different Builds

In the [`dist/` directory of the NPM package](https://unpkg.com/vue@latest/dist/) you will find many different builds of Vue.js. Here's an overview of the difference between them:

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | - | - |
| **Runtime-only (production)** | vue.runtime.min.js | - | - |

### Terms

- **Full**: builds that contains both the compiler and the runtime.

- **Compiler**: code that is responsible for compiling template strings into JavaScript render functions.

- **Runtime**: code that is responsible for creating Vue instances, rendering and patching virtual DOM, etc. Basically everything minus the compiler.

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from Unpkg CDN at [https://unpkg.com/vue](https://unpkg.com/vue) is the Runtime + Compiler UMD build (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](http://rollupjs.org/). The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`vue.runtime.esm.js`).

### Runtime + Compiler vs. Runtime-only

If you need to compile templates on the fly (e.g. passing a string to the `template` option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:
>>>>>>> vuejs/master

``` js
// this requires the compiler
new Vue({
  template: `<div>{{ hi }}</div>`
})

// this does not
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

When using `vue-loader` or `vueify`, templates inside `*.vue` files are pre-compiled into JavaScript at build time. You don't really need the compiler in the final bundle, and can therefore use the runtime-only build.

Since the runtime-only builds are roughly 30% lighter-weight than their full-build counterparts, you should use it whenever you can. If you still wish to use the full build instead, you need to configure an alias in your bundler:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  }
}
```

<<<<<<< HEAD
Browserify의 경우 package.json에 별칭을 추가 할 수 있습니다:
=======
#### Rollup
>>>>>>> vuejs/master

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

<<<<<<< HEAD
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
=======
#### Browserify

Add to your project's `package.json`:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### Development vs. Production Mode

Development/production modes are hard-coded for the UMD builds: the un-minified files are for development, and the minified files are for production.

CommonJS and ES Module builds are intended for bundlers, therefore we don't provide minified versions for them. You will be responsible for minifying the final bundle yourself.

CommonJS and ES Module builds also preserve raw checks for `process.env.NODE_ENV` to determine the mode they should run in. You should use appropriate bundler configurations to replace these environment variables in order to control which mode Vue will run in. Replacing `process.env.NODE_ENV` with string literals also allows minifiers like UglifyJS to completely drop the development-only code blocks, reducing final file size.

#### Webpack

Use Webpack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

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

Use [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

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

Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Also see [Production Deployment Tips](./deployment.html).

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The standalone build depends on this feature to compile templates, so is unusable in these environments.

On the other hand, the runtime-only build is fully CSP-compliant. When using the runtime-only build with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), your templates will be precompiled into `render` functions which work perfectly in CSP environments.
>>>>>>> vuejs/master

## 개발용 빌드

**중요합니다** : Github의 `/dist` 폴더에 있는 빌드된 파일은 릴리즈 중에만 체크인 됩니다. Github의 최신 코드에서 Vue를 사용하려면 직접 빌드해야 합니다.

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Only UMD builds are available from Bower.

``` bash
# 최신 안정판
$ bower install vue
```

## AMD 모듈 로더

<<<<<<< HEAD
Bower를 통해 설치된 독립 실행형 다운로드 또는 버전은 UMD로 랩핑되어 AMD 모듈로 직접 사용될 수 있습니다.
=======
All UMD builds can be used directly as an AMD module.
>>>>>>> vuejs/master
