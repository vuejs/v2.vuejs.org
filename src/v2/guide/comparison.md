---
title: 다른 프레임워크와의 비교
type: guide
order: 29
---

이 섹션은 작성하기 가장 까다로운 페이지이지만, 중요하다고 생각합니다. 당신은 해결하려는 문제가 있었을 것이고 문제를 해결하기 위해 다른 라이브러리를 사용했을 것입니다. 그리고 Vue가 특정 문제를 더 잘 해결할 수 있는지 알고 싶기 때문에 이 것을 보고 있을 것입니다. 이것이 우리가 당신을 위해 말하고자하는 것입니다.

우리는 편견을 피하려고 아주 열심히 하고 있습니다. 코어 팀으로서 우리는 Vue를 좋아합니다. 우리는 우리가 더 잘 해결할 수 있다고 생각하는 몇 가지 문제가 있습니다. 이를 믿지 않는다면, 우리는 더 이상 연구하지 않을 것입니다. 우리는 공정하고 정확하기를 원합니다. React의 대체 렌더러에 대한 React의 광범위한 생태계 또는 Knockout의 IE6에 대한 브라우저 지원과 같은 다른 라이브러리가 중요한 이점을 제공하는 등이 우리가 다루려는 것 입니다.

자바 스크립트 세계가 빠르게 움직이기 때문에 이 문서를 최신 상태로 유지하는 **당신의** 도움을 받길 바랍니다. 정확하지 않다고 생각되는 부분이나 잘못된 부분이 있으면 [문제 제기](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide)로 알려주십시오.).

## React

React와 Vue는 많은 공통점을 공유합니다.

- 가상 DOM을 활용합니다.
- 반응적이고 조합 가능한 컴포넌트를 제공합니다.
- 코어 라이브러리에만 집중하고 있고 라우팅 및 전역 상태를 관리하는 컴패니언 라이브러리가 있습니다.

범위가 너무 비슷하기 때문에 이 비교를 다른 어떤 것보다 자세하게 보는데 더 많은 시간을 투자했습니다. 우리는 기술적 정확성뿐만 아니라 균형을 유지하기를 원합니다. React가 Vue보다 더 빛나는 곳, 예를 들어 생태계가 풍부하고 커스텀 렌더러가 풍부하다는 점을 지적합니다.

그렇다고해서 비교 대상이 일부 React 사용자에게 Vue에 편향된 것처럼 보이는 것은 피할 수 없는 사실입니다. 많은 주제가 탐구되는 것은 어느 정도 주관적입니다. 우리는 다양한 기술적 취향의 존재를 인정합니다. 이 비교는 Vue가 우리의 환경 설정과 일치 할 가능성이있을 때 Vue가 잠재적으로 더 적합할 수있는 이유를 대략적으로 설명하기위한 것입니다.

React 팀의 Dan Abramov 덕분에 React 커뮤니티는 [이러한 균형을 이루는데 도움](https://github.com/vuejs/vuejs.org/issues/364)이 되었습니다. 그는 우리가 최종 결과에 대해 [모두 만족할 때까지](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740)이 문서를 수정하는 데 도움이되는 시간과 상당한 전문성을 지극히 관대했습니다.

### 성능 분석

지금까지 테스트 한 모든 실제 시나리오에서 Vue는 React보다 월등히 우수합니다. 놀라셨다면, 더 읽어보십시오. 우리는 왜 그런지(그리고 심지어는 React 팀과 협력하여 개발 된 벤치 마크를 포함시켰습니다.)를 분석 할 것입니다.

#### 렌더링 성능

UI를 렌더링 할 때 일반적으로 DOM을 조작하는 것이 가장 비용이 많이 드는 작업이며 유감스럽게도 라이브러리는 이러한 원시 작업을 더 빠르게 만들 수 없습니다. 우리가 할 수 있는 최선의 방법은 다음과 같습니다.

1. 필요한 DOM 조작 수를 최소화합니다. React와 Vue는 모두 가상의 DOM 추상화를 사용하여 이 작업을 수행하며 두가지 구현 모두 거의 동일하게 작동합니다.

2. DOM 조작에 가능한 적은 오버헤드(순수 JavaScript 계산)만 가합니다. 이 것은 Vue와 React의 차이입니다.

JavaScript의 오버헤드는 필요한 DOM 작업을 계산하는 메커니즘과 직접적으로 관련이 있습니다. Vue와 React 모두 가상 DOM을 사용하여 이를 구현하지만 Vue의 가상 DOM 구현([snabbdom](https://github.com/snabbdom/snabbdom)의 포크)은 훨씬 가벼우므로 React보다 더 적은 오버 헤드가 발생합니다.

Vue와 React 모두 상태가 없고 및 인스턴스가 없는 컴포넌트를 제공하므로 오버 헤드가 적습니다. 이러한 성능이 중요한 상황에서 사용되면 Vue가 다시 한 번 더 빠릅니다. 이를 입증하기 위해 우리는 10,000 개의 목록 항목을 100 번 렌더링하는 간단한 [벤치 마크 프로젝트](https://github.com/chrisvfritz/vue-render-performance-comparisons)를 만들었습니다. 결과는 하드웨어와 사용되는 브라우저에 따라 다르므로 실제로 시도해 보는 것이 좋습니다. 실제로는 JavaScript 엔진의 특성으로 인해 실행간에 차이는 있습니다.

약간 귀찮더라도, 아래는 2014 년 MacBook Air의 Chrome 52에서 실행 된 숫자입니다. 체리 피킹을 피하기 위해 두 벤치 마크는 실제로 20번의 별도 시간에 실행되었으며 아래에 포함 된 최상의 실행 결과가 있습니다.

{% raw %}
<table class="benchmark-table">
  <thead>
    <tr>
      <th></th>
      <th>Vue</th>
      <th>React</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Fastest</th>
      <td>23ms</td>
      <td>63ms</td>
    </tr>
    <tr>
      <th>Median</th>
      <td>42ms</td>
      <td>81ms</td>
    </tr>
    <tr>
      <th>Average</th>
      <td>51ms</td>
      <td>94ms</td>
    </tr>
    <tr>
      <th>95th Perc.</th>
      <td>73ms</td>
      <td>164ms</td>
    </tr>
    <tr>
      <th>Slowest</th>
      <td>343ms</td>
      <td>453ms</td>
    </tr>
  </tbody>
</table>
{% endraw %}

#### 갱신 성능

React에서는 컴포넌트의 상태가 변경되면 해당 컴포넌트에서 루트로 시작하여 전체 컴포넌트 하위 트리를 다시 렌더링합니다. 불필요한 자식 컴포넌트의 재 렌더링을 피하려면 어디에서나 `shouldComponentUpdate`를 구현하고 변경 불가능한 데이터 구조를 사용해야 합니다. Vue에서 컴포넌트의 종속성은 렌더링 중 자동으로 추적되므로 시스템은 실제로 다시 렌더링해야하는 컴포넌트를 정확히 알고 있습니다.

즉 최적화되지 않은 Vue의 업데이트는 최적화되지 않은 React보다 훨씬 빠르며 실제로 Vue의 렌더링 성능이 향상되므로 완전히 최적화 된 React도 보통 Vue가 기본 제공되는 것보다 느립니다.

#### 개발에 있어서

프로덕션 환경에서의 성능은 최종 사용자 경험과 직접 관련되어 있기 때문에 더 중요한 부분이지만 개발 경험은 개발자 경험과 관련되어 있으므로 여전히 중요합니다.

Vue와 React 모두 거의 대부분의 일반적인 애플리케이션에서 속도가 빠릅니다. 그러나 높은 프레임 속도의 데이터 시각화 또는 애니메이션을 프로토 타이핑 할 때 Vue는 개발시 초당 10 프레임을 처리하는 반면 React는 초당 약 1 프레임으로 떨어지는 경우를 보았습니다.

이것은 많은 우수한 경고와 오류 메시지를 제공하는 데 도움이되는 개발 모드에서의 React의 많은 무질서한 검사 때문입니다. 우리는 이 것들이 Vue에서도 중요하다는 것에 동의하지만, 이를 이행하는 동안 성과를 면밀히 관찰하려고 노력했습니다.

### HTML & CSS

React에서는 모든 것이 JavaScript만으로 매우 심플하고 우아한 느낌을 줍니다. 불행한 현실은 JavaScript내에서 HTML과 CSS를 사용하면서 기존 모델의 일부 문제를 해결 할 때 자체적으로 고통을 초래할 수 있다는 것입니다. Vue에서 대신 우리는 웹 기술을 수용하고 그 위에 구축했습니다. 그 의미를 보여주기 위해 몇 가지 예를 살펴 보겠습니다.

Vue embraces classic web technologies and builds on top of them. To show you what that means, we'll dive into some examples.

React에서 모든 컴포넌트는 JavaScript 내에서 작동하는 선언적 XML 유사 구문 인 JSX를 사용하여 렌더링 함수 내에서 UI를 표현합니다. 다음은 [React 커뮤니티에 의해 심사받은 예](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684) 입니다.

``` jsx
render () {
  let { items } = this.props

  let children
  if (items.length > 0) {
    children = (
      <ul>
        {items.map(item =>
          <li key={item.id}>{item.name}</li>
        )}
      </ul>
    )
  } else {
    children = <p>No items found.</p>
  }

In React, all components express their UI within render functions using JSX, a declarative XML-like syntax that works within JavaScript.

JSX로 렌더하는 경우 몇 가지 장점이 있습니다.

- 전체 프로그래밍 언어 (JavaScript)의 기능을 사용하여 화면를 빌드 할 수 있습니다.
- JSX의 툴링 지원 (예: linting, 형 검사, 에디터 자동완성)은 현재 Vue 템플릿에 사용할 수 있는 것보다 더 진보 된 기능입니다.

Vue에서 우리는 또한 [렌더링 함수](render-function.html)와 심지어 [JSX 지원](render-function.html#JSX)을 가지고 있습니다. 때로는 그 강력함이 필요하기 때문입니다. 그러나 기본적으로 우리는 더 간단한 대안으로 템플릿을 제공합니다.

- For many developers who have been working with HTML, templates simply feel more natural to read and write. The preference itself can be somewhat subjective, but if it makes the developer more productive then the benefit is objective.

몇 가지 장점은 다음과 같습니다.

- 템플릿을 작성하는 동안 구현 및 문법 결정을 줄입니다.
- 템플릿은 항상 선언적입니다.
- 모든 유효한 HTML이 템플릿에서 유효합니다.
- 영어와 비슷합니다 (예: 항목들 중 각 항목).
- 자바 스크립트의 고급 버전은 가독성을 높이기 위해 요구되지 않습니다.

이는 개발자가 작성하는 것이 훨씬 쉬울뿐만 아니라 설계자와 경험이 부족한 개발자도 파싱 및 코드 작성을 훨씬 쉽게 할 수 있습니다.

HTML 호환 템플릿의 또 다른 이점은 Pug(이전에는 Jade로 알려짐)와 같은 전처리기를 사용하여 Vue 템플릿을 제작할 수 있다는 것입니다.

On a higher level, we can divide components into two categories: presentational ones and logical ones. We recommend using templates for presentational components and render function / JSX for logical ones. The percentage of these components depends on the type of app you are building, but in general we find presentational ones to be much more common.

#### 컴포넌트 범위의 CSS

컴포넌트를 여러 파일 (예: [CSS 모듈](https://github.com/gajus/react-css-modules))로 분산하지 않는 한 React의 CSS 범위 지정은 종종 JS 안의 CSS 솔루션을 통해 수행됩니다. 각기 다른 경고가 있는 많은 경쟁 솔루션이 있습니다. 일반적인 문제는 호버 상태, 미디어 쿼리 및 의사 선택기와 같은 기능은 CSS가 이미 수행 한 것을 재 작성하기 위해 많은 의존성이 필요하거나 단순히 지원되지 않는 것입니다. 신중하게 최적화하지 않으면 JS 안의 CSS는 드문 런타임 성능 비용을 도입 할 수 있습니다. 가장 중요한 점은 정상적인 CSS를 작성한 경험에서 벗어나는 것입니다.

반면에 Vue는 [단일 파일 컴포넌트](single-file-components.html) 내에서 CSS에 대한 모든 액세스 권한을 제공합니다.

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

옵션인 `scoped` 속성은 엘리먼트에 유일한 속성(예 : `data-v-21e5b78`)을 추가하고 `.list-container:hover`를 `.list-container[data-v-21e5b78]:hover`로 컴파일 합니다.

이미 CSS 모듈에 익숙하다면, Vue 단일 파일 컴포넌트에도 [1급 클래스](http://vue-loader.vuejs.org/en/features/css-modules.html)가 있습니다.

마지막으로, HTML과 마찬가지로 원하는 프리프로세서 (또는 포스트프로세서)를 사용하여 CSS를 작성하여 해당 생태계의 기존 라이브러리를 활용할 수 있습니다. 또한 빌드 프로세스 동안 색상 조작과 같은 디자인 중심의 작업을 수행 할 수 있습니다. 특수한 JavaScript 라이브러리를 가져 오지 않으면 빌드 크기와 애플리케이션의 복잡성이 증가합니다.

### 규모

#### 규모 확장

대형 애플리케이션의 경우 Vue와 React는 강력한 라우팅 솔루션을 제공합니다. React 커뮤니티는 또한 상태 관리 솔루션 (Flux/Redux 등) 측면에서 매우 혁신적입니다. 이러한 상태 관리 패턴과 [심지어 Redux 자체](https://github.com/egoist/revue)는 Vue 애플리케이션에 쉽게 통합할 수 있습니다. 실제로, Vue는 우수한 모델 개발 경험을 제공한다고 생각하는 Vue에 깊이 통합되어있는 Elm의 영감을받은 상태 관리 솔루션인 [Vuex](https://github.com/vuejs/vuex)를 통해 이 모델을 더욱 발전 시켰습니다.

또 다른 중요한 차이점은 상태 관리 및 라우팅을 위한 Vue의 기타 라이브러리 ([기타 관심사](https://github.com/vuejs) 중)는 모두 공식적으로 지원되며 핵심 라이브러리와 함께 최신 상태로 유지된다는 것입니다. 반대로 React는 커뮤니티에 이러한 결정을 맡기고 더 분열 된 생태계를 만드는 것을 선택했습니다. 그 결과 React의 생태계는 Vue보다 훨씬 풍부합니다.

마지막으로 Vue는 [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify)또는 [빌드 시스템 사용안함](https://github.com/vuejs-templates/simple)을 포함하여 원하는 빌드 시스템을 사용하여 새 프로젝트를 쉽게 시작할 수있게 해주는 [CLI 프로젝트 생성기](https://github.com/vuejs/vue-cli)를 제공합니다. 영역을 "create-react-app"로 설정했지만 현재 몇 가지 제한 사항이 있습니다.

- Vue의 프로젝트 템플릿은 [Yeoman](http://yeoman.io/)과 같은 사용자 정의를 허용하지만 프로젝트 생성 중에는 어떠한 구성도 허용하지 않습니다.
- 단일 페이지 애플리케이션을 작성한다고 가정하는 단일 템플릿만 제공하며, Vue는 다양한 목적을 위해 다양한 템플릿를 제공하고 시스템을 빌드합니다.
- 사용자 정의 템플릿에서 프로젝트를 생성할 수 없으며 사전 정의된 규칙을 사용하는 엔터프라이즈 환경에 특히 유용 할 수 있습니다.

이러한 제한 사항 중 상당수는 create-react-app 팀이 의도적으로 설계한 것입니다. 예를 들어, 프로젝트의 요구가 매우 간단하고 빌드 프로세스를 사용자 정의하기 위해 "추출"할 필요가없는 한, 이를 종속으로 업데이트 할 수 있습니다. 여기에서 [다른 철학](https://github.com/facebookincubator/create-react-app#philosophy)에 대해 더 많이 읽을 수 있습니다.

#### 규모 축소

React는 가파른 학습 곡선으로 유명합니다. 실제로 시작하기 전에 JSX와 아마도 ES2015+에 대해 알아야합니다. 많은 예제가 React의 클래스 구문을 사용하기 때문입니다. Babel Standalone을 기술적으로 사용하여 브라우저에서 코드를 라이브 컴파일 할 수는 있지만 작성에 적합하지 않기 때문에 빌드 시스템에 대해서도 배워야합니다.

Vue는 React보다 좋지는 않지만 잘 확장되지만 jQuery와 마찬가지로 확장됩니다. 그렇습니다. 한 스크립트 태그를 페이지에 드롭하면됩니다.

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

Vue 코드를 작성하고 성능 문제에 대해 걱정할 필요없이 걱정하지 않고 최소화 버전을 배포 버전에 제공 할 수 있습니다.

Vue를 시작하기 위해 JSX, ES2015 또는 빌드 시스템에 대해 알 필요가 없으므로 일반적으로 개발자가 일상적인 애플리케이션을 빌드하는 데 필요한 충분한 지식을 얻기 위해 [가이드](./)를 읽는 데 하루가 걸리지 않습니다.

### 네이티브 렌더링

ReactNative를 사용하면 같은 React 컴포넌트 모델을 사용하여 iOS 및 Android 용 기본 렌더링 애플리케이션을 작성할 수 있습니다. 이것은 개발자로서 여러 플랫폼에서 에 대한 지식을 적용할 수 있다는 점에서 매우 좋습니다. Vue는 Vue를 JavaScript 런타임으로 사용하는 Alibaba Group에서 개발 한 크로스 플랫폼 UI인 [Weex](https://alibaba.github.io/weex/)와 공식 협업을 맺고 있습니다. 즉, Weex를 사용하면 같은 Vue 컴포넌트 문법을 사용하여 브라우저에서 렌더링할 수 있을 뿐만 아니라 iOS 및 Android에서도 렌더링 할 수있는 컴포넌트를 작성할 수 있습니다!

현재 Weex는 아직 개발 중이며 ReactNative만큼 성숙하고 전투적인 테스트를 거치지는 않았지만 개발은 세계 최대의 전자 상거래 비즈니스의 생산 요구에 의해 주도되고 있고 Vue 팀은 적극적으로 협력 할 것입니다. Weex 팀과 함께 Vue 개발자를위한 원활한 경험을 보장합니다.

### MobX과 함께

MobX는 React 커뮤니티에서 꽤 유명해졌고 실제로 Vue와 거의 같은 반응형 시스템을 사용합니다. 제한된 범위 내에서 React + MobX 워크플로우는 좀 더 장황한 Vue로 생각할 수 있습니다. 따라서 이 조합을 사용하고 있고 그것을 즐기고 있다면 Vue로 넘어오는 것이 아마도 다음 단계일 것입니다.

## AngularJS (Angular 1)

일부 Vue의 문법은 Angular와 매우 유사합니다 (예 :`v-if`와`ng-if`). Angular가 제대로 된 많은 것들을 가지고 있었기 때문에 이것은 개발 초기에 Vue에게 영감이 되었습니다. Angular와 함께 제공되는 많은 고통이 있었지만 Vue가 상당한 개선을 제공하려고 시도하였습니다.

### 복잡도

Vue는 API와 디자인면에서 Angular 1보다 훨씬 간단합니다. 평범하지 않은 애플리케이션을 작성하기에 충분한 학습기간은 일반적으로 1 일 미만으로 소요되며 Angular 1에서는 그렇지 않습니다.

### 유연성과 모듈성

Angular 1은 애플리케이션을 어떻게 구성해야 하는지에 대한 강요가 강하고 Vue는 더욱 유연하고 모듈방식의 솔루션입니다. 이로 인해 Vue는 다양한 프로젝트에보다 적합하게 적용될 수 있으며, 때로는 코딩을 시작하기 위해 의사 결정을 내리는데 유용 할 때가 있습니다.

그렇기 때문에 핫 모듈 리로딩, 린트 (linting), CSS 추출과 같은 고급 기능에 대한 액세스 권한을 부여하는 동시에 빠르게 설정할 수있는 [Webpack 템플릿](https://github.com/vuejs-templates/webpack)을 제공합니다.

### 데이터 바인딩

Angular 1은 스코프간 양방향 바인딩을 사용하는 반면 Vue는 컴포넌트 간에 단방향의 데이터 흐름을 사용합니다. 이로 인해 데이터의 흐름이 단순한 애플리케이션에서는 데이터의 흐름을 쉽게 파악할 수 있습니다.

### 디렉티브 vs 컴포넌트

Vue는 디렉티브와 컴포넌트를 명확하게 구분합니다. 지시어는 DOM 조작만 캡슐화 하기 위한 것이고 컴포넌트는 자체 뷰와 데이터 로직이 있는 자체의 포함 단위입니다. Angular에서는 이 둘 사이에 많은 혼란이 있습니다.

### 성능

Vue는 더 나은 성능을 가지며 변경에 대한 검사를 하지 않기 때문에 훨씬 쉽게 최적화 할 수 있습니다. Angular 1은 감시자가 많으면 느려집니다. 범위가 변경 될 때마다 이러한 모든 감시자를 다시 평가해야하기 때문입니다. 또한 일부 감시자가 다른 업데이트를 트리거하는 경우 다이제스트 주기를 여러 번 실행하여 "안정화"해야 할 수도 있습니다. Angular 사용자는 다이제스트 주기를 벗어나기 위해 종종 숨겨진 기술에 의지해야하며 경우에 따라 많은 감시자와 함께 범위를 최적화 할 수있는 방법이 없습니다.

Vue는 비동기 대기열이 있는 투명한 종속성 추적 관찰 시스템을 사용하기 때문에이 문제가 전혀 발생하지 않습니다. 모든 변경 사항은 명시적 종속 관계가 없는 한 독립적으로 트리거됩니다.

흥미롭게도 AngularJS와 Vue가  문제를 해결하는 방법에는 몇 가지 유사점이 있습니다.

## Angular (Formerly known as Angular 2)

Angular 2는 완전히 새로운 것이기 때문에 별도의 섹션을 만들었습니다. 예를 들어, 1급 컴포넌트 시스템이 있으며 많은 구현 세부 사항이 완전히 다시 작성 되었으며 API도 상당히 크게 변경되었습니다.

### TypeScript

Angular 1은 소규모 애플리케이션에 사용할 수 있지만 Angular 2는 대규모 애플리케이션을 쉽게 사용할 수 있도록 초점을 이동했습니다. 이 중 일부는 TypeScript를 필요로 하므로 Java 및 C#과 같은 언어의 타입 안전성을 원하는 개발자에게 매우 유용합니다.

Vue는 [엔터프라이즈 환경](https://github.com/vuejs/awesome-vue#enterprise-usage)에도 매우 적합하며 [공식 Typings](https://github.com/vuejs/vue/tree/dev/types) 및 [공식 decorator](https://github.com/vuejs/vue-class-component)를 통해 TypeScript와 함께 사용할 수도 있습니다.

### 규모와 성능

성능면에서 볼 때 두 프레임워크는 모두 매우 빠르며 실제 사용 사례의 데이터가 충분하지는 않아 결론을 내지 못합니다. 그러나 일부 숫자를 확인하려는 경우 Vue 2.0은 이 [써드파티 벤치 마크](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html)에 따라 Angular 2보다 앞서있는 것으로 보입니다.

규모의 측면에서 Angular 2는 오프라인 컴파일 및 트리셰이킹으로 인해 상당히 작아질 수 있지만 컴파일러가 포함된 완전한 기능을 하는 Vue 2.0이 더 작습니다. (Vue 2.0은 23kb, Angular 2 50kb). 사용하지 않는 기능에 대한 코드를 제거하는 트리셰이킹으로 인해 Angular 2 앱의 크기가 작다는 점에 유의하십시오. 프레임워크에서 더 많은 기능을 가져 와서 사용할 때 결국 실제 크기로 다시 확장됩니다.

### 유연성

Vue는 Angular 2보다 훨씬 덜 강요적이며, 다양한 빌드 시스템에 대한 공식적인 지원을 제공하며 애플리케이션 구조를 제한하지 않습니다. 많은 개발자가 이러한 자유를 누리고 있지만 일부 개발자는 모든 애플리케이션을 빌드하는 데 올바른 방법이 하나만 있는 것을 선호합니다.

### 학습 곡선

Vue를 시작하려면 HTML 및 ES5 JavaScript (즉, 일반 자바 스크립트)에 익숙해야합니다. 이러한 기본 기술을 사용하면 [안내서][the guide](./)를 읽는 하루 만에 작은 애플리케이션을 작성할 수 있습니다.

Angular 2의 학습 곡선은 TypeScript가 없어도 훨씬 가파릅니다. [빠른 시작 가이드](https://angular.io/docs/js/latest/quickstart.html)는 Hello World에 대해 설명하기 위해 ES2015 JavaScript, 18 가지 종속성이있는 NPM, 4 가지 파일 및 3,000 단어를 사용하는 앱으로 시작됩니다. [Vue의 Hello World](https://jsfiddle.net/chrisvfritz/50wL7mdz/)가 조금 더 간단하다고해도 과언이 아닐 것입니다. 아마 그 때문에 우리는 가이드의 전체 페이지를 소모할 필요조차 없습니다.

## Ember

Ember는 높은 찬사를 받는 완전한 기능의 프레임워크입니다. 그것은 많은 기존의 관행을 제공하며, 일단 익숙해지면 생산성을 높일 수 있습니다. 그러나 이는 학습 곡선이 높고 유연성이 떨어지는 것을 의미합니다. 함께 작동하는 느슨하게 결합 된 도구 집합을 사용하여 독창적인 프레임워크와 라이브러리를 선택하려고 하면 트레이드 오프가 있습니다. 후자는 더 많은 자유를 제공하지만 더 많은 구조에 대한 결정을 요구합니다.

즉, Vue 코어와 Ember의 [templating](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/) 및 [객체 모델](https://guides.emberjs.com/v2.10.0/object-model/) 레이어을 비교하면 더 잘 알 수 있습니다.

- Vue는 일반 JavaScript 객체 및 완전히 자동으로 계산된 속성에 대해 눈에 거슬리지 않는 반응형을 제공합니다. Ember에서는 Ember 객체의 모든 것을 랩핑하고 계산된 속성의 종속성을 수동으로 선언 해야합니다.

- Vue의 템플릿 문법은 JavaScript 표현식의 모든 기능을 활용하지만 Handlebars의 표현식 및 헬퍼 문법은 의도적으로 비교할 때 매우 제한적입니다.

- 성능 측면에서 Vue는 Ember 2.0의 최신 Glimmer 엔진 업데이트 이후에도 Ember보다 [월등히](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts/table.html) 뛰어납니다. Vue는 업데이트를 자동으로 일괄 처리하지만 Ember에서는 성능이 중요한 상황에서 실행 루프를 수동으로 관리해야합니다.

## Knockout

Knockout은 MVVM 및 의존성 추적의 개척자였으며 반응형 시스템은 Vue의 그것과 매우 유사합니다. [브라우저 지원](http://knockoutjs.com/documentation/browser-support.html)은 IE6에 대한 지원과 함께 모든 것을 고려하여 매우 인상적입니다! Vue는 IE9+ 만 지원합니다.

하지만 시간이 지남에 따라 개발 속도가 느려졌고 오래되어 보이기 시작했습니다. 예를 들어 컴포넌트 시스템에는 라이프 사이클 훅이 전혀 없으며 매우 일반적인 사용 사례이지만 컴포넌트에 자식을 전달하기위한 인터페이스는 [Vue](components.html#Content-Distribution-with-Slots)에 비해 약간 어색함을 느낄 수 있습니다.

API 디자인에는 철학적인 차이가 있는 것 같아 호기심이 생긴다면 [단순한 할 일 목록](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89)을 어떻게 작성하는지 보여줄 수 있습니다. 분명히 다소 주관적이지만, 많은 사람들은 Vue의 API가 덜 복잡하고 구조가 잘 구성되어 있다고 생각합니다.

## Polymer

Polymer는 Google이 후원하는 또 다른 프로젝트이며 실제로 Vue의 영감의 원천이었습니다. Vue의 컴포넌트는 Polymer의 사용자 지정 엘리먼트와 느슨하게 비교할 수 있으며 둘 다 매우 유사한 개발 스타일을 제공합니다. 가장 큰 차이점은 Polymer는 최신 웹 컴포넌트 기능을 기반으로하며 이러한 기능을 기본적으로 지원하지 않는 브라우저에서는 성능이 저하되는 약간의 폴리필을 요구합니다. 대조적으로, Vue는 IE9에 의존성이나 폴리필이 없이도 작동합니다.

Polymer 1.0에서 팀은 성능을 보완하기 위해 데이터 바인딩 시스템을 매우 제한적으로 만들었습니다. 예를 들어, Polymer 템플릿에서 지원되는 유일한 표현식은 Boolean 부정 및 단일 메소드 호출입니다. 계산된 속성 구현 또한 매우 유연하지 않습니다.

Polymer 사용자 정의 엘리먼트는 HTML 파일로 제작되어 일반 JavaScript/CSS(및 현재 브라우저에서 지원되는 언어 기능)로 제한됩니다. 이에 비해 Vue의 단일 파일 컴포넌트를 사용하면 ES2015+ 및 원하는 모든 CSS 전처리기를 쉽게 사용할 수 있습니다.

프로덕션 환경으로 배포 할 때 Polymer는 브라우저에서 스펙을 구현한다고 가정하는 HTML 가져오기 및 서버와 클라이언트 모두에서 HTTP/2 지원을 사용하여 모든 것을 로드하는 것을 권장합니다. 이는 대상 사용자 및 배포 환경에 따라 가능할 수도 있고 그렇지 않을 수도 있습니다. 이것이 바람직하지 않은 경우에는 Vulcanizer라고하는 특수 도구를 사용하여 폴리머 엘리먼트를 묶어야합니다. 앞에서 볼 때 Vue는 비동기 컴포넌트 기능과 Webpack의 코드 분할 기능을 결합하여 애플리케이션 번들의 일부를 지연 로드 되도록 쉽게 분리 할 수 있습니다. 이를 통해 이전 브라우저와의 호환성을 유지하면서 앱 로드 성능을 높일 수 있습니다.

Vue와 사용자 정의 엘리먼트 및 Shadow DOM 스타일 캡슐화와 같은 웹 컴포넌트 스펙을 더욱 완벽하게 통합하는 것도 가능합니다. 그러나 현재로서는 모든 주요 브라우저에서 사양을 성숙시키고 광범위하게 구현하기를 기다리고 있습니다.

## Riot

Riot 2.0은 작고 아름답게 디자인 된 API를 사용하여 유사한 컴포넌트 기반 개발 모델 (Riot에서 "태그"라고 함)을 제공합니다. Riot과 Vue는 디자인 철학에 많은 부분을 공유합니다. 그러나 Vue는 Riot보다 약간 무겁지만 몇 가지 중요한 이점을 제공합니다.

- [전환 효과 시스템](transitions.html). Riot에는 아무 것도 없습니다.
- 훨씬 강력한 라우터. Riot의 라우팅 API는 극히 약합니다.
- 더 나은 성능. 가상 DOM을 사용하는 것보다 Riot은 [DOM 트리 순회](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding)를 하므로 앵귤러 1과 같은 성능 문제가 있습니다.
- 보다 성숙한 도구 지원. Vue는 [Webpack](https://github.com/vuejs/vue-loader)및 [Browserify](https://github.com/vuejs/vueify)에 대한 공식적으로 지원하지만 Riot는 빌드 시스템 통합을 커뮤니티 지원에 의존합니다.
