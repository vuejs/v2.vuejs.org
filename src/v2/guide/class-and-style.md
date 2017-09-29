---
title: 클래스와 스타일 바인딩
type: guide
order: 6
---


데이터 바인딩은 엘리먼트의 클래스 목록과 인라인 스타일을 조작하기 위해 일반적으로 사용됩니다. 이 두 속성은 `v-bind`를 사용하여 처리할 수 있습니다. 우리는 표현식으로 최종 문자열을 계산하면 됩니다. 그러나 문자열 연결에 간섭하는 것은 짜증나는 일이며 오류가 발생하기 쉽습니다. 이러한 이유로, Vue는 `class`와 `style`에 `v-bind`를 사용할 때 특별히 향상된 기능을 제공합니다. 표현식은 문자열 이외에 객체 또는 배열을 이용할 수 있습니다.

## HTML 클래스 바인딩하기

### 객체 구문

클래스를 동적으로 토글하기 위해 `v-bind:class`에 객체를 전달할 수 있습니다.

``` html
<div v-bind:class="{ active: isActive }"></div>
```

위 구문은 `active` 클래스의 존재 여부가 데이터 속성 `isActive` 의 [참 속성](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)에 의해 결정되는 것을 의미합니다.

객체에 필드가 더 있으면 여러 클래스를 토글 할 수 있습니다. 또한`v-bind:class` 디렉티브는 일반 `class` 속성과 공존할 수 있습니다. 그래서 다음과 같은 템플릿이 가능합니다:

``` html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```

그리고 데이터는:

``` js
data: {
  isActive: true,
  hasError: false
}
```

아래와 같이 렌더링 됩니다:

``` html
<div class="static active"></div>
```

`isActive` 또는 `hasError` 가 변경되면 클래스 목록도 그에 따라 업데이트됩니다. 예를 들어, `hasError` 가 `true` 가 되면 클래스 목록은 `"static active text-danger"` 가됩니다.

바인딩 된 객체는 인라인 일 필요는 없습니다.

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

같은 결과로 렌더링 됩니다. 또한 객체를 반환하는 [계산된 속성](computed.html)에도 바인딩 할 수 있습니다. 이것은 일반적이며 강력한 패턴입니다.

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### 배열 구문

우리는 배열을 `v-bind:class` 에 전달하여 클래스 목록을 지정할 수 있습니다.

``` html
<div v-bind:class="[activeClass, errorClass]"></div>
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

아래와 같이 렌더링 됩니다:

``` html
<div class="active text-danger"></div>
```

목록에 있는 클래스를 조건부 토글하려면 삼항 연산자를 이용할 수 있습니다.

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

이것은 항상 `errorClass`를 적용하지만 `isActive`가 `true`일 때 `activeClass`만 적용됩니다.

그러나 여러 조건부 클래스가 있는 경우 장황해질 수 있습니다. 그래서 배열 구문 내에서 객체 구문을 사용할 수 있습니다.

``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### 컴포넌트와 함께 사용하는 방법

> 이 섹션은 [Vue 컴포넌트](components.html)에 대해 안다고 가정합니다. 부담없이 건너 뛰고 나중에 다시 봐도 됩니다.


사용자 정의 컴포넌트로 `class` 속성을 사용하면, 클래스가 컴포넌트의 루트 엘리먼트에 추가 됩니다. 이 엘리먼트는 기존 클래스는 덮어쓰지 않습니다.


예를 들어, 이 컴포넌트를 선언하는 경우에:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

사용할 클래스 일부를 추가하십시오:

``` html
<my-component class="baz boo"></my-component>
```

렌더링 된 HTML 입니다:

``` html
<p class="foo bar baz boo">Hi</p>
```

클래스 바인딩도 동일합니다:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

`isActive`가 참일 때 렌더링 된 HTML은 다음과 같습니다:

``` html
<p class="foo bar active">Hi</p>
```

## 인라인 스타일 바인딩

### 객체 구문

`v-bind:style` 객체 구문은 매우 직설적입니다. 거의 CSS 처럼 보이지만 JavaScript 객체입니다. 속성 이름에 camelCase와 kebab-case (따옴표를 함께 사용해야 합니다)를 사용할 수 있습니다.

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

스타일 객체에 직접 바인딩 하여 템플릿이 더 간결하도록 만드는 것이 좋습니다.

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

다시, 객체 구문은 종종 객체를 반환하는 계산된 속성과 함께 사용합니다.

### 배열 구문

`v-bind:style`에 대한 배열 구문은 같은 스타일의 엘리먼트에 여러 개의 스타일 객체를 사용할 수 있게 합니다.

``` html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### 자동 접두사

`v-bind:style` 에 브라우저 [벤더 접두어](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)가 필요한 CSS 속성 (예: `transform`)을 사용하면 Vue는 자동으로 해당 접두어를 감지하여 스타일을 적용합니다

### 다중 값 제공

> 2.3.0+

2.3버전 부터 스타일 속성에 접두사가 있는 여러 값을 배열로 전달할 수 있습니다. 예제입니다.

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

브라우저가 지원하는 배열의 마지막 값만 렌더링합니다. 이 예제에서는 flexbox의 접두어가 붙지않은 버전을 지원하는 브라우저에 대해 `display : flex`를 렌더링합니다.
