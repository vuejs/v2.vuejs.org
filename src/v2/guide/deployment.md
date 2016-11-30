---
title: Deploying For Production
type: guide
order: 20
---

## 경고 제거하기

Vue의 최소화된 독립 실행 형 빌드는 이미 작은 파일 크기에 대한 모든 경고를 제거했지만 Webpack 또는 Browserify와 같은 도구를 사용하는 경우이를 수행하기 위해 몇 가지 추가 구성이 필요합니다.

### Webpack

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
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
```

### Browserify

-`NODE_ENV`가 `"production"`으로 설정하여 번들링 명령을 실행하십시오. 이렇게하면 핫 리로드 및 개발 관련 코드가 포함되지 않도록 `vueify`에 알립니다.
- 번들에 전역 [envify](https://github.com/hughsk/envify) 변형을 적용하십시오. 이렇게하면 minifier가 env 변수 조건부 블록에 래핑 된 Vue 소스 코드의 모든 경고를 제거 할 수 있습니다.
예 :

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

- 별도의 CSS 파일에 스타일을 추출하려면 vueify에 포함 된 extract-css 플러그인을 사용하십시오.

``` bash
NODE_ENV=production browserify -g envify -p [ vueify/plugins/extract-css -o build.css ] -e main.js | uglifyjs -c -m > build.js
```

## 런타임 에러 추적

구성 요소의 렌더링 중에 런타임 오류가 발생하면 전역 `Vue.config.errorHandler` config 함수가 전달되면 전달됩니다. 이 훅을 [Sentry](https://sentry.io)와 같은 오류 추적 서비스와 함께 사용하면 좋습니다. Vue 를 위한[공식 통합](https://sentry.io/for/vue)을 제공합니다.

## Extracting CSS

When using [Single-File Components](./single-file-components.html), the `<style>` tags are injected dynamically at runtime during development. In production you may want to extract the styles across all components into a single CSS file. For details on how to achieve this, consult the respective documentation for [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) and [vueify](https://github.com/vuejs/vueify#css-extraction).

[Single-File Components](./ single-file-components.html)을 사용하는 경우 개발 중에 런타임에`<style>`태그가 동적으로 삽입됩니다. 프로덕션에서는 모든 구성 요소의 스타일을 단일 CSS 파일로 추출 할 수 있습니다. 이에 대한 자세한 내용은 [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) 및 [vueify](https://github.com/vuejs/vueify#css-extraction)을 확인하십시오.

`vue-cli`의 공식 `webpack` 템플릿에는 이미 구성되어 있습니다.
