---
title: 템플릿 문법
type: guide
order: 4
---

Vue.js는 렌더링 된 DOM을 기본 Vue 인스턴스의 데이터에 선언적으로 바인딩 할 수있는 HTML 기반 템플릿 구문을 사용합니다. 모든 Vue.js 템플릿은 스펙을 호환하는 브라우저 및 HTML 파서로 구문 분석 할 수있는 유효한 HTML입니다.

내부적으로 Vue는 템플릿을 가상 DOM 렌더링 함수로 컴파일 합니다. 반응형 시스템과 결합된 Vue는 앱 상태가 변경 될 때 최소한으로 DOM을 조작하고 다시 적용할 수 있는 최소한의 컴포넌트를 지능적으로 파악할 수 있습니다.

가상 DOM 개념에 익숙하고 JavaScript의 기본 기능을 선호하는 경우 템플릿 대신 [렌더링 함수를 직접 작성](render-function.html)할 수 있으며 선택사항으로 JSX를 지원합니다.

## 보간법(Interpolation)

### 문자열

데이터 바인딩의 가장 기본 형태는 "Mustache" 구문(이중 중괄호)을 사용한 텍스트 보간입니다.

``` html
<span>메시지: {{ msg }}</span>
```

Mustache 태그는 해당 데이터 객체의 `msg` 속성 값으로 대체됩니다. 또한 데이터 객체의 `msg` 속성이 변경될 때 마다 갱신됩니다.

[v-once 디렉티브](../api/#v-once)를 사용하여 데이터 변경 시 업데이트 되지 않는 일회성 보간을 수행할 수 있지만, 같은 노드의 바인딩에도 영향을 미친다는 점을 유의해야 합니다.

``` html
<span v-once>다시는 변경하지 않습니다: {{ msg }}</span>
```

### 원시 HTML

이중 중괄호(mustaches)는 HTML이 아닌 일반 텍스트로 데이터를 해석합니다. 실제 HTML을 출력하려면 `v-html` 디렉티브를 사용해야 합니다.

``` html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>Using mustaches: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
  	return {
  	  rawHtml: '<span style="color: red">This should be red.</span>'
  	}
  }
})
</script>
{% endraw %}

`span`의 내용은 `rawHtml`로 대체됩니다. 이 때 데이터 바인딩은 무시됩니다. Vue는 문자열 기반 템플릿 엔진이 아니기 때문에 `v-html`을 이용해 템플릿을 사용할 수 없습니다. 이와 달리 컴포넌트는 UI 재사용 및 구성을 위한 기본 단위로 사용하는 것을 추천합니다.

<p class="tip">웹사이트에서 임의의 HTML을 동적으로 렌더링하려면 [XSS 취약점](https://en.wikipedia.org/wiki/Cross-site_scripting)으로 쉽게 이어질 수 있으므로 매우 위험할 가능성이 있습니다. 신뢰할 수 있는 콘텐츠에서만 HTML 보간을 사용하고 사용자가 제공한 콘텐츠에서는 **절대** 사용하면 안됩니다.</p>

### 속성

Mustaches는 HTML 속성에서 사용할 수 없습니다. 대신 [v-bind 디렉티브](../api/#v-bind)를 사용하세요:

``` html
<div v-bind:id="dynamicId"></div>
```

boolean 속성을 사용할 때 단순히 `true`인 경우 `v-bind`는 조금 다르게 작동합니다.

``` html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

`isButtonDisabled`가 `null`, `undefined` 또는`false`의 값을 가지면 `disabled` 속성은 렌더링 된`<button>`엘리먼트에 포함되지 않습니다.

### JavaScript 표현식 사용

지금까지 템플릿의 간단한 속성 키에만 바인딩했습니다. 그러나 실제로 Vue.js는 모든 데이터 바인딩 내에서 JavaScript 표현식의 모든 기능을 지원합니다.

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

이 표현식은 Vue 인스턴스 데이터 범위 내에서 JavaScript로 계산됩니다. 한가지 제한사항은 각 바인딩에 **하나의 단일 표현식** 만 포함될 수 있으므로 아래처럼 작성하면 **안됩니다**

``` html
<!-- 아래는 구문입니다, 표현식이 아닙니다. -->
{{ var a = 1 }}

<!-- 조건문은 작동하지 않습니다. 삼항 연산자를 사용해야 합니다. -->
{{ if (ok) { return message } }}
```

<p class="tip">템플릿 표현식은 샌드박스 처리되며 `Math`와 `Date` 같은 전역으로 사용 가능한 것에만 접근할 수 있습니다. 템플릿 표현식에서 사용자 정의 전역에 액세스 하지 마십시오.</p>

## 디렉티브

디렉티브는 `v-` 접두사가 있는 특수 속성입니다. 디렉티브 속성 값은 **단일 JavaScript 표현식** 이 됩니다. (나중에 설명할 `v-for`는 예외입니다.) 디렉티브의 역할은 표현식의 값이 변경될 때 사이드이펙트를 반응적으로 DOM에 적용하는 것 입니다. 아래 예제에서 살펴보겠습니다.

``` html
<p v-if="seen">이제 나를 볼 수 있어요</p>
```

여기서, `v-if` 디렉티브는 `seen` 표현의 진실성에 기반하여 `<p>` 엘리먼트를 제거 또는 삽입합니다.

### 전달인자

일부 디렉티브는 콜론으로 표시되는 "전달인자"를 사용할 수 있습니다. 예를 들어, `v-bind` 디렉티브는 반응적으로 HTML 속성을 갱신하는데 사용됩니다.

``` html
<a v-bind:href="url"> ... </a>
```

여기서 `href`는 전달인자로, 엘리먼트의 `href` 속성을 표현식 `url`의 값에 바인드하는 `v-bind` 디렉티브에게 알려줍니다.

또 다른 예로 DOM 이벤트를 수신하는 `v-on` 디렉티브입니다.

``` html
<a v-on:click="doSomething"> ... </a>
```

전달인자는 이벤트를 받을 이름입니다. 우리는 이벤트 핸들링에 대해 더 자세하게 살펴 볼 것입니다.

### 수식어

수식어는 점으로 표시되는 특수 접미사로, 디렉티브를 특별한 방법으로 바인딩 해야 함을 나타냅니다. 예를 들어, `.prevent` 수식어는 트리거된 이벤트에서 `event.preventDefault()`를 호출하도록 `v-on` 디렉티브에게 알려줍니다.

``` html
<form v-on:submit.prevent="onSubmit"> ... </form>
```

나중에 [`v-on`](https://vuejs.org/v2/guide/events.html#Event-Modifiers)과 [`v-model`](https://vuejs.org/v2/guide/forms.html#Modifiers)을 더 자세히 살펴볼 때 수식어를 더 많이 사용할 것 입니다.

## 약어

`v-` 접두사는 템플릿의 Vue 특정 속성을 식별하기 위한 시각적인 신호 역할을 합니다. 이 기능은 Vue.js를 사용하여 기존의 마크업에 동적인 동작을 적용할 때 유용하지만 일부 자주 사용되는 디렉티브에 대해 너무 장황하다고 느껴질 수 있습니다. 동시에 Vue.js가 모든 템플릿을 관리하는 [SPA](https://en.wikipedia.org/wiki/Single-page_application)를 만들 때 `v-` 접두어의 필요성이 떨어집니다. 따라서 가장 자주 사용되는 두개의 디렉티브인 `v-bind`와 `v-on`에 대해 특별한 약어를 제공합니다.

### `v-bind` 약어

``` html
<!-- 전체 문법 -->
<a v-bind:href="url"> ... </a>

<!-- 약어 -->
<a :href="url"> ... </a>
```

### `v-on` 약어

``` html
<!-- 전체 문법 -->
<a v-on:click="doSomething"> ... </a>

<!-- 약어 -->
<a @click="doSomething"> ... </a>
```

이들은 일반적인 HTML과 조금 다르게 보일 수 있습니다. 하지만 `:`와 `@`는 속성 이름에 유효한 문자이며 Vue.js를 지원하는 모든 브라우저는 올바르게 구문 분석을 할 수 있습니다. 또한 최종 렌더링 된 마크업에는 나타나지 않습니다. 약어는 완전히 선택사항이지만 나중에 익숙해지면 편할 것 입니다.
