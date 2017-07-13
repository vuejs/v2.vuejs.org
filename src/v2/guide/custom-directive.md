---
title: 사용자 지정 디렉티브
type: guide
order: 16
---

## 시작

Vue는 코어에 포함된 기본 디렉티브 세트(`v-model`과 `v-show`) 외에도 사용자 정의 디렉티브를 등록할 수 있습니다. Vue 2.0에서 코드 재사용 및 추상화의 기본 형식은 컴포넌트 입니다. 그러나 일반 엘리먼트에 하위 수준의 DOM 액세스가 필요한 경우가 있을 수 있으며 이 경우 사용자 지정 디렉티브가 여전히 유용할 수 있습니다. 다음은 input 엘리먼트와 focusing에 대한 예제입니다.

{% raw %}
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
{% endraw %}

페이지가 로드되면 해당 엘리먼트는 포커스를 얻습니다. 사실, 이 페이지를 방문한 이후 다른것을 클릭하지 않았다면 이 input 엘리먼트에 포커스가 되어 있어야 합니다.(참고: 모바일 사파리에서는 작동하지 않습니다.) 이제 이 작업을 수행하는 디렉티브를 작성하겠습니다.

``` js
// 전역 사용자 정의 디렉티브 v-focus 등록
Vue.directive('focus', {
  // 바인딩 된 엘리먼트가 DOM에 삽입되었을 때...
  inserted: function (el) {
    // 엘리먼트에 포커스를 줍니다
    el.focus()
  }
})
```

지시어를 로컬로 등록하기 위해서 컴포넌트는 `directives` 옵션을 허용합니다.

``` js
directives: {
  focus: {
    // 디렉티브 정의
  }
}
```

그런 다음 템플릿에서 다음과 같이 모든 요소에서 새로운 `v-focus` 속성을 사용할 수 있습니다.

``` html
<input v-focus>
```

## 훅 함수

디렉티브 정의 객체는 여러가지 훅 함수를 제공할 수 있습니다.(모두 선택사항입니다.)

- `bind`: 디렉티브가 처음 엘리먼트에 바인딩 될 때 한번만 호출 됩니다. 이곳에서 일회성 설정을 할 수 있습니다.
- `inserted`: 바인딩 된 엘리먼트가 부모 노드에 삽입 되었을 때 호출 됩니다. (이것은 부모 노드 존재를 보장하며 반드시 document 내에 있는 것은 아닙니다.)
- `update`: 포함하는 컴포넌트가 업데이트 된 후 호출됩니다. __그러나 자식이 업데이트 되기 전일 가능성이 있습니다__ 디렉티브의 값은 변경되었거나 변경되지 않았을 수 있지만 바인딩의 현재 값과 이전 값을 비교하여 불필요한 업데이트를 건너 뛸 수 있습니다. (아래의 훅 전달인자를 참조하세요)
- `componentUpdated`: 포함하고 있는 컴포넌트와 __그 자식들__ 이 업데이트 된 후에 호출됩니다.
- `unbind`: 디렉티브가 엘리먼트로부터 언바인딩된 경우에만 한번 호출됩니다.

다음 섹션에서 이 훅으로 전달된 인자 (예: `binding`, `vnode` 및 `oldVnode`)를 살펴 보겠습니다.

## 디렉티브 훅 전달인자

디렉티브 훅은 다음과 인자들을 전달합니다.

- **el**: 디렉티브가 바인딩 되는 엘리먼트 입니다. 이것은 DOM을 직접 조작하는데 사용할 수 있습니다.
- **binding**: 다음 속성을 포함하는 객체입니다.
  - **name**: `v-` 접두어가 없는 디렉티브의 이름입니다.
  - **value**: 디렉티브에 전달된 값입니다. 예를 들어 `v-my-directive="1 + 1"`에서 값은 `2` 가 됩니다.
  - **oldValue**: 이전 값은 `update`와 `componentUpdated`에서만 가능합니다. 값이 변경되었는지 여부에 관계없이 사용할 수 있습니다.
  - **expression**: 문자열로 바인딩 된 표현식 입니다. `v-my-directive="1 + 1"`에서 표현식은 `"1 + 1"` 입니다.
  - **arg**: 전달인자가 있으면 디렉티브에 전달됩니다. 예를 들어 `v-my-directive: foo`에서 arg는 `"foo"`가 됩니다.
  - **modifiers**: 수정자를 포함한 오브젝트가 존재하는 경우, 예를 들어 `v-my-directive.foo.bar`에서 수정자 객체는 `{ foo: true, bar: true }`가 됩니다.
- **vnode**: Vue 컴파일러가 생성한 가상의 노드 입니다. 자세한 내용은 [VNode API](../api/#VNode-Interface)를 참조하십시오.
- **oldVnode**: 이전의 가상 노드 입니다. 오직 `update`와 `componentUpdated` 훅에서만 사용 가능합니다.

<p class="tip">`el` 이외에 이 인자들을 읽기 전용으로 취급하고 절대 수정하면 안됩니다. 훅에서 정보를 공유해야 하는 경우 엘리먼트의 [데이터셋](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)을 통해 정보를 공유하는 것이 좋습니다.</p>

다음 속성 중 일부를 사용하는 사용자 지정 디렉티브의 예제 입니다.

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

``` js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

{% raw %}
<div id="hook-arguments-example" v-demo:foo.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
</script>
{% endraw %}

## 함수 약어

많은 경우에, `bind`와 `update`에서 같은 동작이 필요할 수 있습니다. 그러나 다른 훅은 신경 쓸 필요가 없습니다. 그 예로

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## 객체 리터럴

디렉티브에 여러 값이 필요한 경우, JavaScript 객체 리터럴을 전달할 수도 있습니다. 디렉티브는 유효한 JavaScript 표현식을 사용할 수 있습니다.

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
