---
title: 컴포넌트
type: guide
order: 11
---

## 컴포넌트가 무엇인가요?

컴포넌트는 Vue의 가장 강력한 기능 중 하나입니다. 기본 HTML 엘리먼트를 확장하여 재사용 가능한 코드를 캡슐화하는 데 도움이 됩니다. 상위 수준에서 컴포넌트는 Vue의 컴파일러에 의해 동작이 추가된 사용자 지정 엘리먼트입니다. 경우에 따라 특별한 `is` 속성으로 확장 된 원시 HTML 엘리먼트로 나타날 수도 있습니다.

## 컴포넌트 사용하기

### 전역 등록

이전 섹션에서 다음을 사용하여 새 Vue 인스턴스를 만들 수 있음을 알게되었습니다.

``` js
new Vue({
  el: '#some-element',
  // 옵션
})
```

전역 컴포넌트를 등록하려면, `Vue.component(tagName, options)`를 사용합니다.

``` js
Vue.component('my-component', {
  // 옵션
})
```

<p class="tip">Vue는 사용자 지정 태그 이름에 대해 [W3C 규칙](http://www.w3.org/TR/custom-elements/#concepts)을 적용하지 않습니다 (모두 소문자이어야 하고 하이픈을 포함해야합니다). 그러나 이 규칙을 따르는 것이 좋습니다.</p>

일단 등록되면, 컴포넌트는 인스턴스의 템플릿에서 커스텀 엘리먼트,`<my-component></my-component>`로 사용할 수 있습니다. 루트 Vue 인스턴스를 인스턴스화하기 **전에** 컴포넌트가 등록되어 있는지 확인하십시오. 전체 예제는 다음과 같습니다.

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// 등록
Vue.component('my-component', {
  template: '<div>사용자 정의 컴포넌트 입니다!</div>'
})

// 루트 인스턴스 생성
new Vue({
  el: '#example'
})
```

아래와 같이 렌더링 됩니다.

``` html
<div id="example">
  <div>사용자 정의 컴포넌트 입니다!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>사용자 정의 컴포넌트 입니다!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### 지역 등록

모든 컴포넌트를 전역으로 등록 할 필요는 없습니다. 컴포넌트를 `components` 인스턴스 옵션으로 등록함으로써 다른 인스턴스/컴포넌트의 범위에서만 사용할 수있는 컴포넌트를 만들 수 있습니다:

``` js
var Child = {
  template: '<div>사용자 정의 컴포넌트 입니다!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> 는 상위 템플릿에서만 사용할 수 있습니다.
    'my-component': Child
  }
})
```

동일한 캡슐화는 디렉티브와 같은 다른 등록 가능한 Vue 기능에도 적용됩니다.

### DOM 템플릿 구문 분석 경고

DOM을 템플릿으로 사용할 때 (예 : `el` 옵션을 사용하여 기존 콘텐츠가 있는 엘리먼트를 마운트하는 경우), Vue는 템플릿 콘텐츠만 가져올 수 있기 때문에 HTML이 작동하는 방식에 고유한 몇 가지 제한 사항이 적용됩니다. 이는 브라우저가 구문 분석과 정규화한 후에 작동합니다. 가장 중요한 것은`<ul>`,`<ol>`,`<table>`과`<select>`와 같은 일부 엘리먼트는 그 안에 어떤 엘리먼트가 나타날 수 있는지에 대한 제한을 가지고 있으며,`<option>`과 같이 특정 다른 엘리먼트 안에만 나타날 수 있습니다.

이러한 제한이 있는 엘리먼트가 있는 사용자 지정 컴포넌트를 사용하면 다음과 같은 문제가 발생할 수 있습니다.

``` html
<table>
  <my-row>...</my-row>
</table>
```

사용자 지정 컴포넌트 `<my-row>` 는 잘못 된 컨텐츠가 되어, 결과적으로 렌더링시 에러를 발생시킵니다. 해결 방법은 `is` 특수 속성을 사용하는 것입니다 :

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**다음 소스 중 하나에 포함되면 문자열 템플릿을 사용하는 경우에는 이러한 제한 사항이 적용되지 않습니다.**:

- `<script type="text/x-template">`
- JavaScript 인라인 템플릿 문자열
- `.vue` 컴포넌트

따라서 가능한 경우 항상 문자열 템플릿을 사용하는 것이 좋습니다.

### `data` 는 반드시 함수여야합니다.

Vue 생성자에 사용할 수 있는 대부분의 옵션은 컴포넌트에서 사용할 수 있습니다. 한가지 특별한 경우가 있습니다. `data` 는 함수여야 합니다. 실제로 이를 사용하는 경우에:

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
```

그런 다음 Vue는 중단하고 콘솔에서 경고를 합니다. `data`는 컴포넌트 인스턴스의 함수여야합니다. 규칙이 존재하는 이유를 이해하는 것이 좋습니다. 따라서 다음과 같이 사용하십시오.


``` html
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
```

``` js
var data = { counter: 0 }

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // 데이터는 기술적으로 함수이므로 Vue는 따지지 않지만
  // 각 컴포넌트 인스턴스에 대해 같은 객체 참조를 반환합니다.
  data: function () {
    return data
  }
})

new Vue({
  el: '#example-2'
})
```

{% raw %}
<div id="example-2" class="demo">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
<script>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
</script>
{% endraw %}

이런! 세 개의 컴포넌트 인스턴스가 모두 같은 `data` 객체를 공유하므로 하나의 카운터를 증가 시키면 모두 증가합니다! 대신 새로운 데이터 객체를 반환하여 이 문제를 해결합시다.

``` js
data: function () {
  return {
    counter: 0
  }
}
```

이제 모든 카운터에는 각각 고유한 내부 상태가 있습니다.

{% raw %}
<div id="example-2-5" class="demo">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  }
})
new Vue({
  el: '#example-2-5'
})
</script>
{% endraw %}

### 컴포넌트 작성

컴포넌트는 부모-자식 관계에서 가장 일반적으로 함께 사용하기 위한 것입니다. 컴포넌트 A는 자체 템플릿에서 컴포넌트 B를 사용할 수 있습니다. 그들은 필연적으로 서로 의사 소통이 필요합니다. 부모는 자식에게 데이터를 전달해야 할 수도 있으며, 자식은 자신에게 일어난 일을 부모에게 알릴 필요가 있습니다. 그러나 부모와 자식이 명확하게 정의된 인터페이스를 통해 가능한한 분리된 상태로 유지하는 것도 매우 중요합니다. 이렇게하면 각 컴포넌트의 코드를 상대적으로 격리 할 수 있도록 작성하고 추론할 수 있으므로 유지 관리가 쉽고 잠재적으로 쉽게 재사용 할 수 있습니다.

Vue.js에서 부모-자식 컴포넌트 관계는 **props는 아래로, events 위로** 라고 요약 할 수 있습니다. 부모는 **props**를 통해 자식에게 데이터를 전달하고 자식은 **events**를 통해 부모에게 메시지를 보냅니다. 어떻게 작동하는지 보겠습니다.

<p style="text-align: center;">
  <img style="width: 300px;" src="/images/props-events.png" alt="props down, events up">
</p>

## Props

### Props로 데이터 전달하기

모든 컴포넌트 인스턴스에는 자체 **격리 된 범위** 가 있습니다. 즉, 하위 컴포넌트의 템플릿에서 상위 데이터를 직접 참조 할 수 없으며 그렇게 해서는 안됩니다. 데이터는 [`props` 옵션](../api/#props) 을 사용하여 하위 컴포넌트로 전달 될 수 있습니다.

prop는 상위 컴포넌트의 정보를 전달하기위한 사용자 지정 특성입니다. 하위 컴포넌트는`props` 옵션을 사용하여 수신 할 것으로 기대되는 props를 명시적으로 선언해야합니다

``` js
Vue.component('child', {
  // props 정의
  props: ['message'],
  // 데이터와 마찬가지로 prop은 템플릿 내부에서 사용할 수 있으며
  // vm의 this.message로 사용할 수 있습니다.
  template: '<span>{{ message }}</span>'
})
```

그런 다음 일반 문자열을 다음과 같이 전달할 수 있습니다.

``` html
<child message="안녕하세요!"></child>
```

결과:

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="안녕하세요!"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['message'],
      template: '<span>{{ message }}</span>'
    }
  }
})
</script>
{% endraw %}

### camelCase vs. kebab-case

HTML 속성은 대소 문자를 구분하지 않으므로 문자열이 아닌 템플릿을 사용할 때 camelCased prop 이름에 해당하는 kebab-case(하이픈 구분)를 사용해야 합니다.

``` js
Vue.component('child', {
  // JavaScript는 camelCase
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- HTML는 kebab-case -->
<child my-message="안녕하세요!"></child>
```

문자열 템플릿을 사용하는 경우에도 이 제한이 적용되지 않습니다.

### 동적 Props

정규 속성을 표현식에 바인딩하는 것과 비슷하게, `v-bind`를 사용하여 부모의 데이터에 props를 동적으로 바인딩 할 수 있습니다. 데이터가 상위에서 업데이트 될 때마다 하위 데이터로도 전달됩니다.

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

`v-bind`에 대한 단축 구문을 사용하는 것이 더 간단합니다.

``` html
<child :my-message="parentMsg"></child>
```

결과:

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: '부모로부터 전달 받은 메시지'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

객체의 모든 속성을 props로 전달하려면, 인자없이 `v-bind`를 쓸 수 있습니다. (`v-bind:prop-name` 대신 `v-bind`). 예를 들어 `todo` 객체가 있다면,

``` js
todo: {
  text: 'Learn Vue',
  isComplete: false
}
```

그런 다음,

``` html
<todo-item v-bind="todo"></todo-item>
```

이것은 다음과 같은 동작을합니다.:

``` html
<todo-item
  v-bind:text="todo.text"
  v-bind:is-complete="todo.isComplete"
></todo-item>
```

### 리터럴 vs. 동적

초보자가 흔히 범하는 실수는 리터럴 구문을 사용하여 숫자를 전달하려고 시도하는 것입니다.

``` html
<!-- 이것은 일반 문자열 "1"을 전달합니다. -->
<comp some-prop="1"></comp>
```

그러나 이것은 리터럴 prop이기 때문에 그 값은 실제 숫자가 아닌 일반 문자열 `"1"` 로 전달됩니다. 실제 JavaScript 숫자를 전달하려면 값이 JavaScript 표현식으로 평가되도록 `v-bind`를 사용해야합니다.

``` html
<!-- 이것은 실제 숫자로 전달합니다. -->
<comp v-bind:some-prop="1"></comp>
```

### 단방향 데이터 흐름

모든 props는 하위 속성과 상위 속성 사이의 **단방향** 바인딩을 형성합니다. 상위 속성이 업데이트되면 하위로 흐르게 되지만 그 반대는 안됩니다. 이렇게하면 하위 컴포넌트가 실수로 부모의 상태를 변경하여 앱의 데이터 흐름을 추론하기 더 어렵게 만드는 것을 **방지할 수** 있습니다.

일반적으로 prop을 변경시키고 싶은 유혹을 불러 일으킬 수있는 두 가지 경우가 있습니다.

1. 이 prop는 초기 값을 전달 하는데만 사용되며 하위 컴포넌트는 이후에 이를 로컬 데이터 속성으로 사용하기만 합니다.

2. prop는 변경되어야 할 원시 값으로 전달됩니다.


이러한 사용 사례에 대한 적절한 대답은 다음과 같습니다.

1. prop의 초기 값을 초기 값으로 사용하는 로컬 데이터 속성을 정의 하십시오.

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. prop 값으로 부터 계산된 속성을 정의 합니다.

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">자바 스크립트의 객체와 배열은 참조로 전달되므로 prop가 배열이나 객체인 경우 하위 객체 또는 배열 자체를 부모 상태로 변경하면 부모 상태에 **영향을 줍니다**.</p>

### Prop 검증

컴포넌트가 받는 중인 prop에 대한 요구사항을 지정할 수 있습니다. 요구사항이 충족 되지 않으면 Vue에서 경고를 내보냅니다. 이 기능은 다른 사용자가 사용할 컴포넌트를 제작할 때 특히 유용합니다.

props를 문자열 배열로 정의하는 대신 유효성 검사 요구사항이 있는 객체를 사용할 수 있습니다.

``` js
Vue.component('example', {
  props: {
    // 기본 타입 확인 (`null` 은 어떤 타입이든 가능하다는 뜻입니다)
    propA: Number,
    // 여러개의 가능한 타입
    propB: [String, Number],
    // 문자열이며 꼭 필요합니다
    propC: {
      type: String,
      required: true
    },
    // 숫자이며 기본 값을 가집니다
    propD: {
      type: Number,
      default: 100
    },
    // 객체/배열의 기본값은 팩토리 함수에서 반환 되어야 합니다.
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // 사용자 정의 유효성 검사 가능
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

`type`은 다음 네이티브 생성자 중 하나를 사용할 수 있습니다.

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

또한, `type` 은 커스텀 생성자 함수가 될 수 있고, assertion은 `instanceof` 체크로 만들어 질 것입니다.

props 검증이 실패하면 Vue는 콘솔에서 경고를 출력합니다(개발 빌드를 사용하는 경우). props는 컴포넌트 인스턴스가 __생성되기 전__에 검증되기 때문에 `default` 또는 `validator` 함수 내에서 `data`, `computed` 또는 `methods`와 같은 인스턴스 속성을 사용할 수 없습니다.

## Props가 아닌 속성

Props가 아닌 속성은 컴포넌트로 전달되지만 해당 props는 정의되지 않은 속성입니다.

명시적으로 정의된 props는 하위 컴포넌트에 정보를 전달하는데 적절하지만 컴포넌트 라이브러리를 만드는 경우 컴포넌트가 사용될 수있는 상황을 항상 예측할 수는 없습니다. 이것이 컴포넌트가 컴포넌트의 루트 요소에 추가되는 임의의 속성을 허용해야하는 이유입니다.

예를 들어, 우리가 `input`에 `data-3d-date-picker` 속성을 요구하는 부트스트랩 플러그인으로 써드 파티 `bs-date-input` 컴포넌트를 사용하고 있다고 상상해보세요. 이 속성을 컴포넌트 인스턴스에 추가 할 수 있습니다.

``` html
<bs-date-input data-3d-date-picker="true"></bs-date-input>
```

그리고 `data-3d-date-picker="true"`속성은 `bs-date-input`의 루트 엘리먼트에 자동으로 추가 될 것입니다.

### 존재하는 속성 교체/병합

이 파일이 `bs-date-input`의 템플릿이라고 가정합니다:

``` html
<input type="date" class="form-control">
```

데이트피커 플러그인의 테마를 추가하려면 다음과 같이 특정 클래스를 추가해야 할 수도 있습니다.

``` html
<bs-date-input
  data-3d-date-picker="true"
  class="date-picker-theme-dark"
></bs-date-input>
```

이 경우 `class`에 대한 두 개의 서로 다른 값이 정의됩니다.

- 템플릿의 컴포넌트에 의해 설정된 `form-control`
- `date-picker-theme-dark`는 부모에 의해 컴포넌트로 전달됩니다.

대부분의 속성의 경우 컴포넌트에 제공된 값은 컴포넌트에서 설정된 값을 대체합니다. 예를 들어, `type="large"`가 전달되면 `type="date"`를 대체할 것이고 아마도 망가뜨릴 것입니다! 다행스럽게도 `class`와 `style` 속성은 똑똑하기 때문에 두 값이 합쳐져서 최종 값인 `form-control date-picker-theme-dark`를 만듭니다.

우리는 부모가 prop을 사용하여 자식에게 데이터를 전달할 수 있다는 것을 알았지만, 문제가 발생했을 때 어떻게 부모에게 다시 알릴까요? 바로 Vue의 사용자 정의 이벤트 시스템이 들어오는 곳입니다.

### `v-on`을 이용한 사용자 지정 이벤트

모든 Vue 인스턴스는 다음과 같은 [이벤트 인터페이스](../api/#Instance-Methods-Events)를 구현합니다.

- `$on(eventName)`을 사용하여 이벤트를 감지 하십시오.
- `$emit(eventName)`을 사용하여 이벤트를 트리거 하십시오.

<p class="tip">Vue의 이벤트 시스템은 브라우저의 [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)와 별개입니다. 비슷하게 작동하지만 `$on` 과 `$emit` 는 `addEventListener` 와 `dispatchEvent`의 별칭이 __아닙니다__.</p>

또한, 부모 컴포넌트는 자식 컴포넌트가 사용되는 템플릿에서 직접 `v-on` 을 사용하여 자식 컴포넌트에서 보내진 이벤트를 청취할 수 있습니다.


<p class="tip">`$on`은 자식에서 호출한 이벤트는 감지하지 않습니다. `v-on`을 템플릿에 반드시 지정해야 합니다. 아래의 예제를 보십시오.</p>

예제:

``` html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

``` js
Vue.component('button-counter', {
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

{% raw %}
<div id="counter-event-example" class="demo">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1
      this.$emit('increment')
    }
  }
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
</script>
{% endraw %}

이 예제에서는 하위 컴포넌트가 외부에서 발생 하는 것과 완전히 분리 된다는 점에 유의해야 합니다. 부모 컴포넌트가 신경 쓸 수 있는 경우를 대비하여 자체 활동에 대한 정보를 보고 하는 것뿐입니다.

#### 컴포넌트에 네이티브 이벤트 바인딩

컴포넌트의 루트 엘리먼트에서 네이티브 이벤트를 수신하려는 경우가 있을 수 있습니다. 이러한 경우 `v-on` 에 `.native` 수식자를 사용할 수 있습니다. 예 :

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### `.sync` 수식어

> 2.3.0+

일부 경우에 속성에 "양방향 바인딩"이 필요할 수 있습니다. Vue 1버전에 있던 `.sync` 수식어와 동일합니다. 자식 컴포넌트가 `.sync`를 가지는 속성을 변경하면 값의 변경이 부모에 반영됩니다. 편리하지만 단방향 데이터 흐름이 아니기 때문에 장기적으로 유지보수에 문제가 생깁니다. 자식 속성을 변경하는 코드는 부모의 상태에 영향을 미칩니다.

이 때문에 `.sync`는 2.0버전에서 삭제되었습니다. 그러나 재사용 가능한 컴포넌트를 만들 때 유용할 수 있다는 점을 알게 되었습니다. **부모 상태에 영향을 미치는 코드를 더욱 일관적이고 명백하게 만들어야합니다.**

2.3 버전에서 속성을 위한 `.sync` 수식어를 다시 만들었습니다. 자동으로 `v-on`로 확장되는 신택스 슈가입니다.

따라서 아래 코드는

``` html
<comp :foo.sync="bar"></comp>
```

아래와 같습니다.

``` html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

하위 컴포넌트가 `foo`를 갱신하려면 속성을 변경하는 대신 명시적으로 이벤트를 보내야합니다.

``` js
this.$emit('update:foo', newValue)
```

### 사용자 정의 이벤트를 사용하여 폼 입력 컴포넌트 만들기

사용자 정의 이벤트는 `v-model` 에서 작동하는 사용자 정의 입력을 만드는데에도 사용할 수 있습니다. 기억하세요.

``` html
<input v-model="something">
```

위 문장은 아래와 같습니다.

``` html
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

컴포넌트와 함께 사용하면 다음과 같이 간단해집니다.

``` html
<custom-input
  :value="something"
  @input="value => { something = value }">
</custom-input>
```

따라서 `v-model`을 사용하는 컴포넌트는 (2.2.0버전 이상에서 설정을 조작할 수 있습니다.)
- `value` prop를 가집니다.
- 새로운 값으로 `input` 이벤트를 내보냅니다.

매우 간단한 통화 입력을 사용하는 모습을 보겠습니다.

``` html
<currency-input v-model="price"></currency-input>
```

``` js
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)">\
    </span>\
  ',
  props: ['value'],
  methods: {
    // 값을 직접 업데이트하는 대신 이 메소드를 사용하여
    // 입력 값에 대한 서식을 지정하고 배치 할 수 있습니다
    updateValue: function (value) {
      var formattedValue = value
        // 공백을 제거합니다.
        .trim()
        // 소수 자릿수 2자리로 줄입니다
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      // 값이 아직 정규화 되지 않은 경우
      // 이를 수동으로 재정의하여 조건을 충족시킵니다.
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // 입력 이벤트를 통해 숫자 값을 내보냅니다.
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

{% raw %}
<div id="currency-input-example" class="demo">
  <currency-input v-model="price"></currency-input>
</div>
<script>
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    updateValue: function (value) {
      var formattedValue = value
        .trim()
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      this.$emit('input', Number(formattedValue))
    }
  }
})
new Vue({
  el: '#currency-input-example',
  data: { price: '' }
})
</script>
{% endraw %}

위의 구현은 꽤 단순합니다. 예를 들어, 사용자는 때때로 여러 마침표와 글자를 입력 할 수 있습니다. 그렇기 때문에 보다 강력한 통화 필터를 사용할 수 있습니다.

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



### 컴포넌트의 `v-model` 사용자 정의

> 2.2.0 버전에서 추가됨

기본적으로 컴포넌트의 `v-model`은 `value`를 보조 변수로 사용하고 `input`을 이벤트로 사용하지만 체크 박스와 라디오 버튼과 같은 일부 입력 타입은 다른 목적으로 `value` 속성을 사용할 수 있습니다. `model` 옵션을 사용하면 다음 경우에 충돌을 피할 수 있습니다:

``` js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    // 다른 목적을 위해 `value` prop를 사용할 수 있습니다.
    checked: Boolean,
    value: String
  },
  // ...
})
```

``` html
<my-checkbox v-model="foo" value="some value"></my-checkbox>
```

아래와 같습니다


``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```

<p class="tip">`checked` prop를 명시적으로 선언해야 합니다.</p>

### 비 부모-자식간 통신

때로는 두 컴포넌트가 서로 통신 할 필요가 있지만 서로 부모/자식이 아닐 수도 있습니다. 간단한 시나리오에서는 비어있는 Vue 인스턴스를 중앙 이벤트 버스로 사용할 수 있습니다.

``` js
var bus = new Vue()
```
``` js
// 컴포넌트 A의 메소드
bus.$emit('id-selected', 1)
```
``` js
// 컴포넌트 B의 created 훅
bus.$on('id-selected', function (id) {
  // ...
})
```

보다 복잡한 경우에는 전용 [상태 관리 패턴](state-management.html)을 고려해야합니다

## 슬롯을 사용한 컨텐츠 배포

컴포넌트를 사용할 때 다음과 같이 컴포넌트를 구성하는 것이 좋습니다.

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

주목해야할 두가지 사항이 있습니다.

1. `<app>` 컴포넌트는 어떤 컨텐츠를 받을지 모릅니다. 그것은 컴포넌트에 의해 `<app>` 결정됩니다.

2. `<app>` 컴포넌트에는 자체 템플릿이 있을 가능성이 큽니다.

위 구성으로 작동하도록 하려면 부모 "content"와 컴포넌트의 자체 템플릿을 섞는 방법이 필요합니다. 이것은 **콘텐츠 배포** (또는 Angular에 익숙한 경우 "transclusion") 프로세스입니다. Vue.js는 현재 [웹 컴포넌트 사양 초안](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)을 모델로 한 콘텐츠 배포 API를 구현하며 원본 콘텐츠의 배포판 역할을하기 위해 특수한 `<slot>` 엘리먼트를 사용합니다.

### 범위 컴파일

API를 파헤치기 전에 먼저 내용이 컴파일되는 범위를 명확히 해야합니다. 다음과 같은 템플릿이 있다고 상상해보겠습니다.

``` html
<child-component>
  {{ message }}
</child-component>
```

`message`가 부모 데이터 또는 자식 데이터중 어디에 바인딩되어야 할까요? 대답은 부모입니다. 컴포넌트 범위에 대한 간단한 법칙은 다음과 같습니다.

> 상위 템플릿의 모든 내용은 상위 범위로 컴파일됩니다. 하위 템플릿의 모든 내용은 하위 범위에서 컴파일됩니다.

일반적인 실수는 부모 템플릿의 하위 속성/메소드에 디렉티브를 바인딩하려고하는 것입니다.

``` html
<!-- 작동하지 않습니다 -->
<child-component v-show="someChildProperty"></child-component>
```

`someChildProperty`가 자식 컴포넌트의 속성이라고 가정하면, 위의 예제는 작동하지 않을 것입니다. 상위 템플릿은 하위 컴포넌트의 상태를 인식하지 못합니다.

컴포넌트 루트 노드에서 하위 범위 디렉티브를 바인딩 해야하는 경우 하위 컴포넌트의 자체 템플릿에서 하위 범위 디렉티브를 바인딩해야합니다.

``` js
Vue.component('child-component', {
  // 이제 작동합니다. 올바른 위치에 놓여 있습니다.
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

마찬가지로 분산된 콘텐츠는 상위 범위에서 컴파일됩니다.

### 단일 슬롯

하위 컴포넌트 템플릿에 최소한 하나의 `<slot>` 콘텐츠가 포함되어 있지 않으면 부모 콘텐츠가 **삭제** 됩니다. 속성이 없는 슬롯이 하나 뿐인 경우 전체 내용 조각이 DOM의 해당 위치에 삽입되어 슬롯 자체를 대체합니다.

원래 `<slot>` 태그 안에 있는 내용은 **대체 콘텐츠** 로 간주됩니다. 대체 콘텐츠는 하위 범위에서 컴파일되며 호스팅 엘리먼트가 비어 있고 삽입할 콘텐츠가 없는 경우에만 표시됩니다.

다음 템플릿으로 `my-component`라는 컴포넌트가 있다고 가정하십시오.

``` html
<div>
  <h2>나는 자식 컴포넌트의 제목입니다</h2>
  <slot>
    제공된 컨텐츠가 없는 경우에만 보실 수 있습니다.
  </slot>
</div>
```

그리고 그 컴포넌트를 사용하는 부모는

``` html
<div>
  <h1>나는 부모 컴포넌트의 제목입니다</h1>
  <my-component>
    <p>이것은 원본 컨텐츠 입니다.</p>
    <p>이것은 원본 중 추가 컨텐츠 입니다</p>
  </my-component>
</div>
```

아래처럼 렌더링 됩니다.

``` html
<div>
  <h1>나는 부모 컴포넌트의 제목입니다</h1>
  <div>
    <h2>나는 자식 컴포넌트의 제목 입니다</h2>
    <p>이것은 원본 컨텐츠 입니다.</p>
    <p>이것은 원본 중 추가 컨텐츠 입니다</p>
  </div>
</div>
```

### 이름을 가지는 슬롯

`<slot>` 엘리먼트는 특별한 속성 인 `name` 을 가지고 있습니다. 이 속성은 어떻게 내용을 배포해야 하는지를 더 커스터마이징하는 데 사용할 수 있습니다. 이름이 다른 슬롯이 여러 개 있을 수 있습니다. 이름을 가진 슬롯은 내용 조각에 해당 `slot` 속성이 있는 모든 엘리먼트와 일치합니다.

명명되지 않은 슬롯이 하나 있을 수 있습니다. **기본 슬롯** 은 일치하지 않는 콘텐츠의 포괄적인 컨텐츠 역할을 합니다. 기본 슬롯이 없으면 일치하지 않는 콘텐츠가 삭제됩니다.

예를 들어, 다음과 같은 템플릿을 가진`app-layout` 컴포넌트가 있다고 가정 해보십시오 :

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

부모 마크업

``` html
<app-layout>
  <h1 slot="header">여기에 페이지 제목이 위치합니다</h1>

  <p>메인 컨텐츠의 단락입니다.</p>
  <p>하나 더 있습니다.</p>

  <p slot="footer">여기에 연락처 정보입니다.</p>
</app-layout>
```

아래와 같이 렌더링 됩니다.

``` html
<div class="container">
  <header>
    <h1>여기에 페이지 제목이 위치합니다</h1>
  </header>
  <main>
    <p>메인 컨텐츠의 단락입니다.</p>
    <p>하나 더 있습니다.</p>
  </main>
  <footer>
    <p>여기에 연락처 정보입니다.</p>
  </footer>
</div>
```

콘텐츠 배포 API는 함께 구성할 컴포넌트를 디자인 할 때 매우 유용한 메커니즘입니다.

### 범위를 가지는 슬롯

> 2.1.0에 새롭게 추가됨.

범위가 지정된 슬롯은 이미 렌더링 된 엘리먼트 대신 재사용 가능한 템플릿(데이터를 전달할 수 있음)으로 작동하는 특별한 유형의 슬롯입니다.

prop을 컴포넌트에게 전달하는 것처럼, 하위 컴포넌트에서 단순히 데이터를 슬롯에 전달하면 됩니다.


``` html
<div class="child">
  <slot text="hello from child"></slot>
</div>
```

부모에서, 특별한 속성 `scope-scope`를 가진 `<template>` 엘리먼트가 있어야 합니다. 이것은 범위를 가지는 슬롯을 위한 템플릿임을 나타냅니다. `slot-scope`의 값은 자식으로부터 전달 된 props 객체를 담고있는 임시 변수의 이름입니다:

``` html
<div class="parent">
  <child>
    <template slot-scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```

위를 렌더링하면 출력은 다음과 같습니다.

``` html
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>
```

> 2.5.0+에서, `slot-scope` 는 더이상 `<template>` 뿐 아니라 컴포넌트나 엘리먼트에서도 사용할 수 있습니다.

범위가 지정된 슬롯의 보다 일반적인 사용 사례는 컴포넌트 사용자가 리스트의 각 항목을 렌더링하는 방법을 사용자 정의할 수 있는 리스트 컴포넌트입니다.

``` html
<my-awesome-list :items="items">
  <!-- scoped slot 역시 이름을 가질 수 있습니다 -->
  <li
    slot="item"
    slot-scope="props"
    class="my-fancy-item">
    {{ props.text }}
  </li>
</my-awesome-list>
```

그리고 리스트 컴포넌트의 템플릿 :

``` html
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- 대체 컨텐츠는 여기입니다. -->
  </slot>
</ul>
```

#### 디스트럭처링

`slot-scope` 값은 실제로 함수 서명의 인수 위치에 나타날 수 있는 유효한 JavaScript 표현식입니다. 이는 지원되는 환경 (싱글 파일 컴포넌트 또는 최신 브라우저)에서 ES2015 디스트럭처를 사용할 수 있다는 것을 의미합니다.


``` html
<child>
  <span slot-scope="{ text }">{{ text }}</span>
</child>
```

## 동적 컴포넌트

같은 마운트 포인트를 사용하고 예약된 `<component>` 엘리먼트를 사용하여 여러 컴포넌트 간에 동적으로 전환하고 `is` 속성에 동적으로 바인드 할 수 있습니다.

``` js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component v-bind:is="currentView">
  <!-- vm.currentView가 변경되면 컴포넌트가 변경됩니다! -->
</component>
```

원하는 경우 컴포넌트 객체에 직접 바인딩 할 수도 있습니다.

``` js
var Home = {
  template: '<p>Welcome home!</p>'
}

var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

### `keep-alive`

전환된 컴포넌트를 메모리에 유지하여 상태를 보존하거나 다시 렌더링하지 않도록하려면 동적 컴포넌트를 `<keep-alive>` 엘리먼트에 래핑 할 수 있습니다.

``` html
<keep-alive>
  <component :is="currentView">
    <!-- 비활성화 된 컴포넌트는 캐시 됩니다! -->
  </component>
</keep-alive>
```

[API 참조](../api/#keep-alive)에서 `<keep-alive>` 에 대한 자세한 내용을 확인하십시오.

## 기타

### 재사용 가능한 컴포넌트 제작하기

컴포넌트를 작성할 때 나중에 다른 곳에서 다시 사용할 것인지에 대한 여부를 명심하는 것이 좋습니다. 일회용 컴포넌트가 단단히 결합 되어도 상관 없지만 재사용 가능한 컴포넌트는 깨끗한 공용 인터페이스를 정의 해야하며 사용된 컨텍스트에 대한 가정을 하지 않아야합니다.

Vue 컴포넌트의 API는 prop, 이벤트 및 슬롯의 세 부분으로 나뉩니다.

- **Props** 는 외부 환경이 데이터를 컴포넌트로 전달하도록 허용합니다.

- **이벤트**를 통해 컴포넌트가 외부 환경에서 사이드이펙트를 발생할 수 있도록 합니다.

- **슬롯** 을 사용하면 외부 환경에서 추가 컨텐츠가 포함 된 컴포넌트를 작성할 수 있습니다.

`v-bind` 와 `v-on` 을 위한 전용 약어문을 사용하여 의도를 명확하고 간결하게 템플릿에 전달할 수 있습니다.

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

### 자식 컴포넌트 참조

props나 이벤트가 있었음에도 불구하고 때때로 JavaScript로 하위 컴포넌트에 직접 액세스 해야 할 수도 있습니다. 이를 위해 `ref` 를 이용하여 참조 컴포넌트 ID를 자식 컴포넌트에 할당해야 합니다. 예:

``` html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// 자식 컴포넌트 인스턴스에 접근합니다.
var child = parent.$refs.profile
```

`ref`가 `v-for`와 함께 사용될 때, 얻을 수 있는 ref는 데이터 소스를 미러링하는 자식 컴포넌트를 포함하는 배열이 될 것입니다.

<p class="tip">`$refs` 는 컴포넌트가 렌더링 된 후에만 채워지며 반응적이지 않습니다. 그것은 직접 자식 조작을 위한 escape 해치를 의미합니다 - 템플릿이나 계산 된 속성에서 `$refs`를 사용하지 말아야합니다.</p>

### 비동기 컴포넌트

대규모 응용 프로그램에서는 응용 프로그램을 더 작은 덩어리로 나누고 실제로 필요할 때만 서버에서 컴포넌트를 로드해야 할 수도 있습니다. Vue를 사용하면 컴포넌트 정의를 비동기식으로 해결하는 팩토리 함수로 컴포넌트를 정의 할 수 있습니다. Vue는 컴포넌트가 실제로 렌더링되어야 할 때만 팩토리 기능을 트리거하고 이후의 리렌더링을 위해 결과를 캐시합니다. 예 :

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 컴포넌트 정의를 resolve 콜백에 전달합니다.
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

팩토리 함수는 `resolve` 콜백을 받습니다. 이 콜백은 서버에서 컴포넌트 정의를 가져 왔을 때 호출 되어야 합니다. 또한 `reject (reason)` 을 호출하여 로드가 실패 했음을 알릴 수 있습니다. 여기서 `setTimeout` 은 데모 용입니다. 컴포넌트를 검색하는 방법은 전적으로 귀하에게 달려 있습니다. 권장되는 접근법 중 하나는 [Webpack의 코드 분할 기능](https://webpack.js.org/guides/code-splitting/)과 함께 비동기 컴포넌트를 사용하는 것입니다.

``` js
Vue.component('async-webpack-example', function (resolve) {
  // 이 특별한 require 구문은 Webpack이 Ajax 요청을 통해
  // 로드되는 번들로 작성된 코드를 자동으로 분리하도록 지시합니다.
  require(['./my-async-component'], resolve)
})
```

factory 함수에서 `Promise`를 반환할 수도 있습니다. 그래서 Webpack 2 + ES2015 구문을 사용하면 다음을 할 수 있습니다 :


``` js
Vue.component(
  'async-webpack-example',
  // `import` 함수는 `Promise`를 반환합니다.
  () => import('./my-async-component')
)
```

[지역 등록](components.html#Local-Registration)을 사용하는 경우, `Promise`를 반환하는 함수를 제공할 수 있습니다.

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">비동기 컴포넌트를 사용하려는 <strong>Browserify</strong> 사용자인 경우, 작성자는 불행히도 비동기로드가 Browserify에서 지원하지 않는 것이라고 [분명하게 주장합니다.](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) 적어도 공식적으로. Browserify 커뮤니티는 기존 및 복잡한 응용 프로그램에 도움이 될 수있는 [몇 가지 해결 방법](https://github.com/vuejs/vuejs.org/issues/620)을 발견했습니다. 다른 모든 시나리오의 경우 기본 제공되는 비동기식 지원을 위해 Webpack을 사용하는 것이 좋습니다.</p>

### 고급 비동기 컴포넌트

> 2.3.0버전에서 추가

2.3 버전부터 비동기 컴포넌트 팩토리는 다음 형태의 객체를 반환할 수 있습니다.

``` js
const AsyncComp = () => ({
  // 로드하는 컴포넌트입니다. 반드시 Promise이어야합니다.
  component: import('./MyComp.vue'),
  // 비동기 컴포넌트가 로드되는 동안 사용할 컴포넌트
  loading: LoadingComp,
  // 실패했을 경우 사용하는 컴포넌트
  error: ErrorComp,
  // 로딩 컴포넌트를 보여주기전 지연하는 정도. 기본값: 200ms.
  delay: 200,
  // 시간이 초과되면 에러용 컴포넌트가 표시됩니다
  // 기본값: Infinity.
  timeout: 3000
})
```

`vue-router`에서 라우트 컴포넌트로 사용하는 경우 라우트 네비게이션이 발생하기전에 비동기 컴포넌트가 먼저 작동하기때문에 이러한 특성은 무시됩니다. 라우트 컴포넌트에서 위의 문법을 사용하려면 `vue-router` 2.4.0 이상을 사용해야합니다.

### 컴포넌트 이름 규약

컴포넌트 (또는 prop)를 등록 할 때 kebab-case, camelCase 또는 PascalCase를 사용할 수 있습니다.

``` js
// 컴포넌트 정의에서
components: {
  // kebab-case를 사용한 등록
  'kebab-cased-component': { /* ... */ },
  // camelCase를 사용한 등록
  'camelCasedComponent': { /* ... */ },
  // PascalCase를 사용한 등록
  'PascalCasedComponent': { /* ... */ }
}
```

HTML 템플릿 내에서 kebab-case와 동등한 것을 사용해야합니다.

``` html
<!-- HTML 템플릿에서 항상 kebab-case를 사용하세요 -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<pascal-cased-component></pascal-cased-component>
```

그러나 _문자열_ 템플릿을 사용할 때 HTML의 대소문자를 구분하지 않습니다. 즉, 템플릿에서도 CamelCase, PascalCase 또는 kebab-case를 사용하여 컴포넌트와 prop을 참조할 수 있습니다.

- kebab-case
- camelCase를 사용하여 컴포넌트가 정의된 경우 camelCase 또는 kebab-case
- PascalCase를 사용하여 컴포넌트가 정의된 경우 kebab-case, camelCase or PascalCase

``` js
components: {
  'kebab-cased-component': { /* ... */ },
  camelCasedComponent: { /* ... */ },
  PascalCasedComponent: { /* ... */ }
}
```

``` html
<kebab-cased-component></kebab-cased-component>

<camel-cased-component></camel-cased-component>
<camelCasedComponent></camelCasedComponent>

<pascal-cased-component></pascal-cased-component>
<pascalCasedComponent></pascalCasedComponent>
<PascalCasedComponent></PascalCasedComponent>
```


이것은 PascalCase가 가장 보편적 인 _선언적 컨벤션_임을 의미하며 케밥 케이스는 가장 보편적으로 사용하는 _컨벤션_입니다.

컴포넌트가 `slot` 엘리먼트를 통해 내용을 전달받지 못하면 이름 뒤에 `/`를 사용하여 자체적으로 닫을 수도 있습니다.

``` html
<my-component/>
```

다시 말하지만, 이것은 자기 닫는 사용자 정의 엘리먼트가 유효한 HTML이 아니므로 문자열 템플릿내에서만 작동하며 브라우저의 기본 파서는 이를 이해하지 못합니다.

### 재귀 컴포넌트

컴포넌트는 자신의 템플릿에서 재귀적으로 호출할 수 있습니다. 그러나, 그들은 `name` 옵션으로만 가능합니다.

``` js
name: 'unique-name-of-my-component'
```

`Vue.component`를 사용하여 컴포넌트를 전역적으로 등록하면, 글로벌 ID가 컴포넌트의 `name` 옵션으로 자동 설정됩니다.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

주의하지 않으면 재귀적 컴포넌트로 인해 무한 루프가 발생할 수도 있습니다.

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

위와 같은 컴포넌트는 "최대 스택 크기 초과" 오류가 발생하므로 재귀 호출이 조건부 (즉, 마지막에 `false`가 될 `v-if`를 사용하세요)인지 확인하십시오.

### 컴포넌트 사이의 순환 참조

Finder나 파일 탐색기와 같이 파일 디렉토리 트리를 작성한다고 가정해 보겠습니다. 이 템플릿을 가지고 `tree-folder` 컴포넌트를 가질 수 있습니다.

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

그런 다음이 템플릿이 있는 `tree-folder-contents` 컴포넌트 :

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

자세히 살펴보면이 컴포넌트가 실제로 렌더링 트리에서 서로의 자식 및 조상인 패러독스라는 것을 알 수 있습니다! `Vue.component`를 이용해 전역으로 컴포넌트 등록할 때, 이 패러독스는 자동으로 해결됩니다. 그런 경우에 처해있으면 한번 읽어보세요.

그러나 __모듈 시스템__ 을 사용하여 컴포넌트를 필요로하거나 가져오는 경우. Webpack 또는 Browserify를 통해 오류가 발생합니다.

```
컴포넌트를 마운트하지 못했습니다 : 템플릿 또는 렌더링 함수가 정의되지 않았습니다.
```

무슨 일이 일어나고 있는지 설명하기 위해 모듈 A와 B를 호출 할 것입니다. 모듈 시스템은 A가 필요합니다 하지만 A는 B를 우선적으로 필요로 합니다 게다가 B는 A를 필요로 하는 것을 알 수 있습니다. 먼저 서로 다른 컴포넌트를 해결하지 않고 두 컴포넌트를 완전히 해결하는 방법을 알지 못합니다. 이를 해결하려면 모듈 시스템에 "A는 B를 필요로 하나 B를 __먼저__ 해결할 필요가 없습니다."라고 말할 수있는 지점을 제공해야합니다.

여기에서는 `tree-folder` 컴포넌트로 삼을 것입니다. 패러독스를 만드는 자식은 `tree-folder-contents` 컴포넌트이므로, `beforeCreate` 라이프 사이클 훅이 등록 될 때까지 기다릴 것입니다.

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

문제가 해결되었습니다!

### 인라인 템플릿

하위 컴포넌트에 `inline-template` 이라는 특수한 속성이 존재할 때, 컴포넌트는 그 내용을 분산 된 내용으로 취급하지 않고 템플릿으로 사용합니다. 따라서 보다 유연한 템플릿 작성이 가능합니다.

``` html
<my-component inline-template>
  <div>
    <p>이것은 컴포넌트의 자체 템플릿으로 컴파일됩니다.</p>
    <p>부모가 만들어낸 내용이 아닙니다.</p>
  </div>
</my-component>
```

그러나, `inline-template` 은 템플릿의 범위를 추론하기 더 어렵게 만듭니다. 가장 좋은 방법은 `template` 옵션을 사용하거나`.vue` 파일의`template` 엘리먼트를 사용하여 컴포넌트 내부에 템플릿을 정의하는 것입니다.

### X-Templates

템플리트를 정의하는 또 다른 방법은 `text/x-template` 유형의 스크립트 엘리먼트 내부에 ID로 템플릿을 참조하는 것입니다. 예:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

이 기능은 큰 템플릿이나 매우 작은 응용 프로그램의 데모에는 유용 할 수 있지만 템플릿을 나머지 컴포넌트 정의와 분리하기 때문에 피해야합니다.

### `v-once`를 이용한 비용이 적게드는 정적 컴포넌트

일반 HTML 엘리먼트를 렌더링하는 것은 Vue에서 매우 빠르지만 가끔 정적 콘텐츠가 **많이** 포함 된 컴포넌트가 있을 수 있습니다. 이런 경우,`v-once` 디렉티브를 루트 엘리먼트에 추가함으로써 캐시가 한번만 실행되도록 할 수 있습니다.

``` js
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Terms of Service</h1>\
      ... a lot of static content ...\
    </div>\
  '
})
```
