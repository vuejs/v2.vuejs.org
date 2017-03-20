---
title: 프로덕션 배포 팁
type: guide
order: 20
---

## 프로덕션 모드를 켜세요

개발 과정에서 Vue는 일반적인 오류 및 함정을 해결하는 데 도움이 되는 많은 경고를 제공합니다. 그러나 이러한 경고 문자열은 프로덕션에서는 쓸모 없으며 앱의 페이로드 크기를 키웁니다. 또한 이러한 경고 검사 중 일부는 프로덕션 모드에서 피할 수 있는 런타임 비용이 적습니다.

### 빌드 도구를 사용하지 않는 경우


독립 실행 형 빌드를 사용하는 경우 (즉, 빌드 도구 없이 스크립트 태그를 통해 Vue를 직접 포함하는 경우) 프로덕션 환경을 위해 축소 버전(`vue.min.js`)을 사용해야합니다. 두가지 버전 모두 [설치 안내](installation.html#Direct-lt-script-gt-Include)

### 빌드 도구를 사용하는 경우

Webpack이나 Browserify와 같은 빌드 툴을 사용할 때, 프로덕션 모드는 Vue의 소스 코드 안에있는 `process.env.NODE_ENV`에 의해 결정 될 것이며, 기본적으로 개발 모드가 될 것입니다. 두 빌드 도구 모두 이 변수를 덮어 쓸 수있는 방법을 제공하여 Vue의 프로덕션 모드를 사용할 수있게하고 빌드하는 동안 minifier가 경고를 제거합니다. 모든 `vue-cli` 템플릿에는 다음과 같은 것들이 미리 설정 되어 있습니다. 그러나 어떻게 실행되는지는 유용합니다.

#### Webpack

프로덕션 환경을 알리기 위해 Webpack의[DefinePlugin](https://webpack.js.org/plugins/define-plugin/)을 사용하여 최소화 중에 UglifyJS에 의해 경고 블록이 자동으로 삭제 될 수 있도록합니다.

설정 예제:


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

- `"production "`으로 설정된 실제 `NODE_ENV` 환경 변수로 번들링 명령을 실행하십시오. 이렇게 하면 핫 리로드 및 개발 관련 코드가 포함되지 않도록 `vueify`에 알립니다.

- 번들에 전역 [envify](https://github.com/hughsk/envify) 변형을 적용하십시오. 이렇게하면 minifier가 env 변수 조건부 블록에 래핑 된 Vue 소스 코드의 모든 경고를 제거 할 수 있습니다.

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

#### Rollup

[rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)을 사용하세요.

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

## 사전 컴파일한 템플릿


DOM 안의 템플릿 또는 JavaScript 안의 템플릿 문자열을 사용하면 템플릿에서 렌더 함수로의 컴파일이 즉시 수행됩니다. 일반적으로 대부분의 경우 속도가 빠르지만 애플리케이션이 성능에 민감한 경우에는 사용하지 않는 것이 가장 좋습니다.

템플릿을 미리 컴파일하는 가장 쉬운 방법은 [단일 파일 컴포넌트](single-file-components.html)를 사용하는 것입니다. 관련 빌드 설정은 자동으로 사전 컴파일을 수행하므로 내장 코드에 원시 템플릿 문자열 대신 이미 컴파일 된 렌더링 함수가 포함되어 있습니다.

Webpack을 사용하고 JavaScript 및 템플릿 파일을 분리하는 것을 선호하는 경우에 [vue-template-loader](https://github.com/ktsn/vue-template-loader)를 사용하여 템플릿 파일을 JavaScript로 변환할 수 있습니다 빌드 단계 중 렌더 함수를 수행합니다.

## 컴포넌트의 CSS 추출하기

단일 파일 컴포넌트를 사용할 때, 컴포넌트 내부의 CSS는 JavaScript를 통해 `<style>`태그로 동적으로 삽입됩니다. 런타임 비용이 적고, 서버 측 렌더링을 사용하는 경우 "스타일이없는 내용의 깜빡임"이 발생합니다. CSS를 모든 컴포넌트에서 같은 파일로 추출하고 이러한 문제를 피하고 CSS 축소 및 캐싱을 향상시킵니다.

이를 적용하려면 해당 빌드 도구 문서를 참조하십시오.

- [Webpack + vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack 템플릿은 이미 이 설정이 되어 있습니다)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue#options)

## 런타임 에러 추적하기

구성 요소의 렌더링 중에 런타임 오류가 발생하면 전역 `Vue.config.errorHandler` config 함수로 전달됩니다. 이 훅을 [공식적인 통합](https://sentry.io/for/vue/)을 제공하는 [Sentry](https://sentry.io)와 같은 오류 추적 서비스와 함께 활용하면 좋습니다.
