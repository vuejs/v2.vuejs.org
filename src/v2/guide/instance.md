---
title: Vue 인스턴스
type: guide
order: 3
---

## Vue 인스턴스 만들기

모든 Vue 앱은 `Vue` 함수로 새 **Vue 인스턴스**를 만드는 것부터 시작합니다.

``` js
var vm = new Vue({
  // 옵션
})
```

엄격히 [MVVM 패턴](https://en.wikipedia.org/wiki/Model_View_ViewModel)과 관련이 없지만 Vue의 디자인은 부분적으로 그것에 영감을 받았습니다. 컨벤션으로, Vue 인스턴스를 참조하기 위해 종종 변수 `vm`(ViewModel의 약자)을 사용합니다.

Vue 인스턴스를 인스턴스화 할 때는 데이터, 템플릿, 마운트할 엘리먼트, 메소드, 라이프사이클 콜백 등의 옵션을 포함 할 수있는 **options 객체**를 전달 해야합니다. 전체 옵션 목록은 [API reference](../api)에서 찾을 수 있습니다.

`Vue` 생성자는 미리 정의 된 옵션으로 재사용 가능한 **컴포넌트 생성자**를 생성하도록 확장 될 수 있습니다
Vue 앱은 `new Vue`를 통해 만들어진 `루트 Vue 인스턴스`로 구성되며 선택적으로 중첩이 가능하고 재사용 가능한 컴포넌트 트리로 구성됩니다. 예를 들어 Todo 앱의 컴포넌트 트리는 다음과 같습니다.

```
Root Instance
|- TodoList
   |- TodoItem
      |- DeleteTodoButton
      |- EditTodoButton
   |- TodoListFooter
      |- ClearTodosButton
      |- TodoListStatistics
```

확장된 인스턴스를 만들수는 있으나 대개 템플릿에서 사용자 지정 엘리먼트로 선언적으로 작성하는 것이 좋습니다. 나중에 [컴포넌트 시스템](components.html)에 대해 자세히 설명합니다. 지금은 모든 Vue 컴포넌트가 본질적으로 확장된 Vue 인스턴스라는 것을 알아야 합니다.

## 속성과 메소드

각 Vue 인스턴스는 `data` 객체에 있는 모든 속성을 **프록시** 처리 합니다.

``` js
// 데이터 객체
var data = { a: 1 }

// Vue인스턴스에 데이터 객체를 추가합니다.
var vm = new Vue({
  data: data
})

// 같은 객체를 참조합니다!
vm.a === data.a // => true

// 속성 설정은 원본 데이터에도 영향을 미칩니다.
vm.a = 2
data.a // => 2

// ... 당연하게도
data.a = 3
vm.a // => 3
```

데이터가 변경되면 화면은 다시 렌더링됩니다. `data`의 속성은 인스턴스가 생성될때 있었다면 **반응형**입니다. 즉 다음과 같이 새 속성을 추가합니다.

``` js
vm.b = 'hi'
```

`b`가 변경되도 화면이 갱신되지 않습니다. 반응형 속성이 필요하면 나중에 이 속성이 필요한 것을 알고, 값을 지정하지 않은채로 초기화만 하면 됩니다.

``` js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

Vue 인스턴스는 데이터 이외에도 많은 인스턴스 속성 및 메소드를 제공합니다. 이는 `$` 접두어로 사용자 정의 속성과 구별합니다.

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 는 인스턴스 메소드 입니다.
vm.$watch('a', function (newVal, oldVal) {
  // `vm.a`가 변경되면 호출 됩니다.
})
```

나중에 [API reference](../api/#Instance-Properties)에서 인스턴스 속성과 메소드 전체 목록을 살펴보세요.

## 인스턴스 라이프사이클 훅

각 Vue 인스턴스는 데이터 관찰을 설정하고, 템플릿을 컴파일하고, 인스턴스를 DOM에 마운트하고, 데이터가 변경 될 때 DOM을 업데이트해야 할 때 일련의 초기화 단계를 거칩니다. 그 과정에서 사용자 정의 로직을 실행할 수있는 **라이프사이클 훅** 도 호출됩니다. 예를 들어, [`created`](../api/#created) 훅은 인스턴스가 생성된 후에 호출됩니다. 예:

``` js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 는 vm 인스턴스를 가리킵니다.
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

인스턴스 라이프사이클의 여러 단계에서 호출될 다른 훅도 있습니다. 그 예로 [`mounted`](../api/#mounted),[`updated`](../api/#updated) 및 [`destroyed`](../api/#destroyed)가 있습니다. 모든 라이프사이클 훅은 `this` 컨텍스트가 호출하는 Vue 인스턴스를 가리키며 호출됩니다. Vue 세계에서 "컨트롤러"의 컨셉이 어디에 있는지 궁금할 수 있습니다. 답은 컨트롤러가 없습니다. 컴포넌트의 사용자 지정 로직은 이러한 라이프사이클 훅으로 분할됩니다.

<p class="tip">
`created: () => console.log(this.a)` 또는 `vm.$watch('a', newValue => this.myMethod())`에 [화살표 함수](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 을 사용지 마세요. 화살표 함수는 부모 컨텍스트에 바인딩 되기 때문에 `this`는 Vue 인스턴스가 아니며 `this.a` 또는 `this.myMethod`는 정의되지 않습니다.
 </p>

## 라이프사이클 다이어그램

아래는 인스턴스 라이프사이클에 대한 다이어그램입니다. 지금 당장 모든 것을 완전히 이해할 필요는 없지만 다이어그램은 앞으로 도움이 될 것입니다.

![The Vue Instance Lifecycle](/images/lifecycle.png)
