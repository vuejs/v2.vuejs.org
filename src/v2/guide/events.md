---
title: 이벤트 핸들링
type: guide
order: 9
---

## 이벤트 청취

`v-on` 디렉티브를 사용하여 DOM 이벤트를 듣고 트리거 될 때 JavaScript를 실행할 수 있습니다.

예제:

``` html
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>위 버튼을 클릭한 횟수는 {{ counter }} 번 입니다.</p>
</div>
```
``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

결과:

{% raw %}
<div id="example-1" class="demo">
  <button v-on:click="counter += 1">Add 1</button>
  <p>위 버튼을 클릭한 횟수는 {{ counter }} 번 입니다.</p>
</div>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
</script>
{% endraw %}

## 메소드 이벤트 핸들러

많은 이벤트 핸들러의 로직은 더 복잡할 것이므로, JavaScript를 `v-on` 속성 값으로 보관하는 것은 간단하지 않습니다. 이 때문에 `v-on`이 호출하고자 하는 메소드의 이름을 받는 이유입니다.

예제:

``` html
<div id="example-2">
  <!-- `greet`는 메소드 이름으로 아래에 정의되어 있습니다 -->
  <button v-on:click="greet">Greet</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // 메소드는 `methods` 객체 안에 정의합니다
  methods: {
    greet: function (event) {
      // 메소드 안에서 사용하는 `this` 는 Vue 인스턴스를 가리킵니다
      alert('Hello ' + this.name + '!')
      // `event` 는 네이티브 DOM 이벤트입니다
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// 또한 JavaScript를 이용해서 메소드를 호출할 수 있습니다.
example2.greet() // => 'Hello Vue.js!'
```

결과:

{% raw %}
<div id="example-2" class="demo">
  <button v-on:click="greet">Greet</button>
</div>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
      alert('Hello ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
{% endraw %}

## 인라인 메소드 핸들러

메소드 이름을 직접 바인딩 하는 대신 인라인 JavaScript 구문에 메소드를 사용할 수도 있습니다.

``` html
<div id="example-3">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
```
``` js
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

결과:

{% raw %}
<div id="example-3" class="demo">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
<script>
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
</script>
{% endraw %}

때로 인라인 명령문 핸들러에서 원본 DOM 이벤트에 액세스 해야할 수도 있습니다. 특별한 `$event` 변수를 사용해 메소드에 전달할 수도 있습니다.

``` html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // 이제 네이티브 이벤트에 액세스 할 수 있습니다
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## 이벤트 수식어

이벤트 핸들러 내부에서 `event.preventDefault()` 또는 `event.stopPropagation()`를 호출하는 것은 매우 보편적인 일입니다. 메소드 내에서 쉽게 이 작업을 할 수 있지만, DOM 이벤트 세부 사항을 처리하는 대신 데이터 로직에 대한 메소드만 사용할 수 있으면 더 좋을 것입니다.

이 문제를 해결하기 위해, Vue는 `v-on` 이벤트에 **이벤트 수식어**를 제공합니다. 수식어는 점으로 표시된 접미사 입니다.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

``` html
<!-- 클릭 이벤트 전파가 중단됩니다 -->
<a v-on:click.stop="doThis"></a>

<!-- 제출 이벤트가 페이지를 다시 로드 하지 않습니다 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 수식어는 체이닝 가능합니다 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 단순히 수식어만 사용할 수 있습니다 -->
<form v-on:submit.prevent></form>

<!-- 이벤트 리스너를 추가할 때 캡처모드를 사용합니다 -->
<!-- 즉, 내부 엘리먼트를 대상으로 하는 이벤트가 해당 엘리먼트에서 처리되기 전에 여기서 처리합니다. -->
<div v-on:click.capture="doThis">...</div>


<!-- event.target이 엘리먼트 자체인 경우에만 트리거를 처리합니다 -->
<!-- 자식 엘리먼트에서는 안됩니다 -->
<div v-on:click.self="doThat">...</div>
```

<p class="tip">관련 코드가 동일한 순서로 생성되므로 수식어를 사용할 때 순서를 지정하세요. 다시말해 `@click.prevent.self`를 사용하면 **모든 클릭**을 막을 수 있으며 `@click.self.prevent`는 엘리먼트 자체에 대한 클릭만 방지합니다.</p>

> 2.1.4에 새로 추가됨

``` html
<!-- 클릭 이벤트는 최대 한번만 트리거 됩니다. -->
<a v-on:click.once="doThis"></a>
```

네이티브 DOM 이벤트에 독점적인 다른 수식어와 달리,`.once` 수식어는 [컴포넌트 이벤트](components.html#Using-v-on-with-Custom-Events)에서도 사용할 수 있습니다. 아직 컴포넌트에 대해 읽지 않았더라도 지금 당장은 걱정하지 마십시오.

> 2.3.0+ 이후 추가됨

``` html
<!-- 스크롤의 기본 이벤트를 취소할 수 없습니다. -->
<div v-on:scroll.passive="onScroll">...</div>
```

추가로, Vue는 `.passive` 수식어를 제공합니다. 특히 모바일 환경에서 성능향상에 도움이 됩니다. 예를 들어, 브라우저는 핸들러가 `event.preventDefault()`를 호출할지 알지 못하므로 프로세스가 완료된 후 스크롤 합니다. `.passive` 수식어는 이 이벤트가 기본 동작을 멈추지 않는다는 것을 브라우저에 알릴 수 있습니다.

<p class="tip">`.passive`와 `.prevent`를 함께 사용하지 마세요. 패시브 핸들러는 기본 이벤트를 막지 않습니다.</p>

## 키 수식어

키보드 이벤트를 청취할 때, 종종 공통 키 코드를 확인해야 합니다. Vue는 키 이벤트를 수신할 때 `v-on`에 대한 키 수식어를 추가할 수 있습니다.

``` html
<!-- keyCode가 13일 때만 `vm.submit()`을 호출합니다  -->
<input v-on:keyup.13="submit">
```

`keyCode`를 모두 기억하는 것은 힘듭니다. 그래서 Vue는 자주 사용하는 키의 알리아스를 제공합니다.

``` html
<!-- 위와 같습니다 -->
<input v-on:keyup.enter="submit">

<!-- 약어 사용도 가능합니다 -->
<input @keyup.enter="submit">
```

키 수식어 별칭의 전체 목록입니다.

- `.enter`
- `.tab`
- `.delete` ("Delete" 와 "Backspace" 키 모두를 캡처합니다)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

또한 전역 `config.keyCodes` 객체를 통해 [사용자 지정 키 수식어 별칭을 지정할 수 있습니다.](../api/#keyCodes)

``` js
// `v-on:keyup.f1`을 사용할 수 있습니다.
Vue.config.keyCodes.f1 = 112
```

### 오토매틱 키 수식어

> 2.5.0+에서 추가됨

[`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)를 통해 노출된 유효 키 이름을 수식어로 직접 사용할 수 있습니다.


``` html
<input @keyup.page-down="onPageDown">
```

위의 예제에서 핸들러는 `$event.key === 'PageDown'` 만 호출됩니다.

<p class="tip">일부 키(`.esc`와 모든 화살표 키)는 IE9에서 일관성 없는 `key` 값을 가지고 있습니다. IE9를 지원해야하는 경우 내장 알리아스가 선호됩니다.</p>

## 시스템 수식어 키 목록

> 2.1.0+에서 추가됨

다음 수식어를 사용해 해당 수식어 키가 눌러진 경우에만 마우스 또는 키보드 이벤트 리스너를 트리거 할 수 있습니다.

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> 참고 : 매킨토시 키보드에서 meta는 command 키 입니다 (⌘). Windows 키보드에서 meta는 windows 키 (⊞) 입니다. Sun Microsystems 키보드에서 meta는 단색의 다이아몬드 (◆)로 표시됩니다. 특정 키보드의 경우, 특히 MIT 및 Lisp 시스템 키보드와 Knight 키보드, space-cadet 키보드와 같은 제품에는 "META" 레이블이 지정됩니다. Symbolics 키보드에서 메타는 "META" 또는 "Meta"로 표시됩니다.

예제:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

<p class="tip">
수식어 키는 일반 키와 다르며 `keyup` 이벤트와 함께 사용되면 이벤트가 발생할 때 수식어 키가 눌려있어야 합니다. 즉,`keyup.ctrl`는 `ctrl`을 누른 상태에서 키를 놓으면 트리거됩니다. `ctrl` 키만 놓으면 트리거되지 않습니다.
</p>

### `.exact` 수식어

> 2.5.0+에서 추가됨

`.exact` 수식어는 다른 시스템 수식어와 조합해 그 핸들러가 실행되기 위해 정확한 조합이 눌러야하는 것을 보여줍니다.

``` html
<!-- Alt 또는 Shift와 함께 눌린 경우에도 실행됩니다. -->
<button @click.ctrl="onClick">A</button>

<!-- Ctrl 키만 눌려있을 때만 실행됩니다. -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 아래 코드는 시스템 키가 눌리지 않은 상태인 경우에만 작동합니다. -->
<button @click.exact="onClick">A</button>
```

### 마우스 버튼 수식어

> 2.2.0 버전에서 추가됨

- `.left`
- `.right`
- `.middle`

위 수식어는 특정 마우스 버튼에 의해 트리거 된 이벤트로 핸들러를 제한합니다.

## 왜 HTML로 된 리스너를 사용합니까

이 모든 이벤트 청취 접근 방법이 우려 사항 분리("separation of concerns")에 대한 오래된 규칙을 어긴다고 생각할 수 있습니다. 모든 뷰 핸들러 함수와 표현식은 현재 뷰 처리 하는 ViewModel에 엄격히 바인딩 되기 때문에 유지보수가 어렵지 않습니다. 실제로 `v-on`을 사용하면 몇가지 이점이 있습니다.

1. HTML 템플릿을 간단히 하여 JavaScript 코드 내에서 핸들러 함수 구현을 찾는 것이 더 쉽습니다.

2. JavaScript에서 이벤트 리스너를 수동으로 연결할 필요가 없으므로 ViewModel 코드는 순수 로직과 DOM이 필요하지 않습니다. 이렇게 하면 테스트가 쉬워집니다.

3. ViewModel이 파기되면 모든 이벤트 리스너가 자동으로 제거 됩니다. 이벤트 제거에 대한 걱정이 필요 없어집니다.
