---
<<<<<<< HEAD
title: 프로덕션으로 배포하기
=======
title: Production Deployment Tips
>>>>>>> vuejs/master
type: guide
order: 20
---

<<<<<<< HEAD
## 경고 제거하기

Vue의 최소화된 독립 실행 형 빌드는 이미 작은 파일 크기에 대한 모든 경고를 제거했지만 Webpack 또는 Browserify와 같은 도구를 사용하는 경우이를 수행하기 위해 몇 가지 추가 구성이 필요합니다.
=======
## Turn on Production Mode

During development, Vue provides a lot of warnings to help you with common errors and pitfalls. However, these warning strings become useless in production and bloat your app's payload size. In addition, some of these warning checks have small runtime costs that can be avoided in production mode.
>>>>>>> vuejs/master

### Without Build Tools

If you are using the standalone build, i.e. directly including Vue via a script tag without a build tool, make sure to use the minified version (`vue.min.js`) for production.

### With Build Tools

When using a build tool like Webpack or Browserify, the production mode will be determined by `process.env.NODE_ENV` inside Vue's source code, and it will be in development mode by default. Both build tools provide ways to overwrite this variable to enable Vue's production mode, and warnings will be stripped by minifiers during the build. All `vue-cli` templates have these pre-configured for you, but it would be beneficial to know how it is done:

#### Webpack

배포 환경을 인지하기 위해 Webpack의 [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin)을 사용하여 최소화 중에 UglifyJS에 의해 경고 블록을 자동으로 삭제할 수 있습니다.

구성 예 :

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
}
```

#### Browserify

- Run your bundling command with the actual `NODE_ENV` environment variable set to `"production"`. This tells `vueify` to avoid including hot-reload and development related code.

<<<<<<< HEAD
-`NODE_ENV`가 `"production"`으로 설정하여 번들링 명령을 실행하십시오. 이렇게하면 핫 리로드 및 개발 관련 코드가 포함되지 않도록 `vueify`에 알립니다.
- 번들에 전역 [envify](https://github.com/hughsk/envify) 변형을 적용하십시오. 이렇게하면 minifier가 env 변수 조건부 블록에 래핑 된 Vue 소스 코드의 모든 경고를 제거 할 수 있습니다.
예 :
=======
- Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle. This allows the minifier to strip out all the warnings in Vue's source code wrapped in env variable conditional blocks. For example:

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```
>>>>>>> vuejs/master

#### Rollup

<<<<<<< HEAD
- 별도의 CSS 파일에 스타일을 추출하려면 vueify에 포함 된 extract-css 플러그인을 사용하십시오.
=======
Use [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):
>>>>>>> vuejs/master

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

<<<<<<< HEAD
## 런타임 에러 추적

구성 요소의 렌더링 중에 런타임 오류가 발생하면 전역 `Vue.config.errorHandler` config 함수가 전달되면 전달됩니다. 이 훅을 [Sentry](https://sentry.io)와 같은 오류 추적 서비스와 함께 사용하면 좋습니다. Vue 를 위한[공식 통합](https://sentry.io/for/vue)을 제공합니다.
=======
## Pre-Compiling Templates

When using in-DOM templates or in-JavaScript template strings, the template-to-render-function compilation is performed on the fly. This is usually fast enough in most cases, but is best avoided if your application is performance-sensitive. The easiest way to pre-compile templates is using [Single-File Components](./single-file-components.html) - the associated build setups automatically performs pre-compilation for you, so the built code contains the already compiled render functions instead of raw template strings.
>>>>>>> vuejs/master

## Extracting Component CSS

<<<<<<< HEAD
[Single-File Components](./ single-file-components.html)을 사용하는 경우 개발 중에 런타임에`<style>`태그가 동적으로 삽입됩니다. 프로덕션에서는 모든 구성 요소의 스타일을 단일 CSS 파일로 추출 할 수 있습니다. 이에 대한 자세한 내용은 [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) 및 [vueify](https://github.com/vuejs/vueify#css-extraction)을 확인하십시오.

`vue-cli`의 공식 `webpack` 템플릿에는 이미 구성되어 있습니다.
=======
When using Single-File Components, the CSS inside components are injected dynamically as `<style>` tags via JavaScript. This has a small runtime cost, and if you are using server-side rendering it will cause a "flash of unstyled content". Extracting the CSS across all components into the same file and avoid these issues, and also result in better CSS minification and caching.

Refer to the respective build tool documentations to see how it's done:

- [Webpack + vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack template has this pre-configured)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue#options)

## Tracking Runtime Errors

If a runtime error occurs during a component's render, it will be passed to the global `Vue.config.errorHandler` config function if it has been set. It might be a good idea to leverage this hook together with an error-tracking service like [Sentry](https://sentry.io), which provides [an official integration](https://sentry.io/for/vue/) for Vue.
>>>>>>> vuejs/master
