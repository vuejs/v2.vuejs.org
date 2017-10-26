---
title: 조건부 렌더링
type: guide
order: 7
---

## `v-if`

Handlebars와 같은 문자열 템플릿에서 다음과 같은 조건부 블록을 작성할 수 있습니다.

``` html
<!-- Handlebars 템플릿 -->
{{#if ok}}
  <h1>Yes</h1>
{{/if}}
```

Vue에서는 `v-if` 디렉티브를 사용하여 같은 결과를 얻을 수 있습니다.

``` html
<h1 v-if="ok">Yes</h1>
```

`v-else`와 함께 "else" 블록을 추가하는 것도 가능합니다.

``` html
<h1 v-if="ok">Yes</h1>
<h1 v-else>No</h1>
```

### `<template>`에 `v-if`을 갖는 조건부 그룹 만들기

`v-if`는 디렉티브기 때문에 하나의 엘리먼트에 추가해야합니다. 하지만 하나 이상의 엘리먼트를 전환하려면 어떻게 해야할까요? 이 경우 우리는 보이지 않는 래퍼 역할을 하는 `<template>` 엘리먼트에 `v-if`를 사용할 수 있습니다. 최종 렌더링 결과에는 `<template>` 엘리먼트가 포함되지 않습니다.

``` html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `v-else`

`v-else` 디렉티브를 사용하여 `v-if`에 대한 "else 블록"을 나타낼 수 있습니다

``` html
<div v-if="Math.random() > 0.5">
  이제 나를 볼 수 있어요
</div>
<div v-else>
  이제는 안보입니다
</div>
```

`v-else` 엘리먼트는 `v-if` 엘리먼트 또는 `v-else-if` 엘리먼트 바로 뒤에 있어야 합니다. 그렇지 않으면 인식할 수 없습니다.

### `v-else-if`

> 2.1.0부터 새롭게 추가됨

`v-else-if`는 이름에서 알 수 있듯, `v-if`에 대한 "else if 블록" 역할을 합니다. 또한 여러 개를 사용할 수 있습니다.

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

`v-else`와 마찬가지로, `v-else-if` 엘리먼트는 `v-if` 또는 `v-else-if` 엘리먼트 바로 뒤에 와야 합니다.

### `key`를 이용한 재사용 가능한 엘리먼트 제어

Vue는 가능한 한 효율적으로 엘리먼트를 렌더링하려고 시도하며 종종 처음부터 렌더링을 하지않고 다시 사용합니다. Vue를 매우 빠르게 만드는데 도움이 되는 것 이외에 몇가지 유용한 이점이 있습니다. 예를 들어 사용자가 여러 로그인 유형을 전환할 수 있도록 허용하는 경우입니다.

``` html
<template v-if="loginType === 'username'">
  <label>사용자 이름</label>
  <input placeholder="사용자 이름을 입력하세요">
</template>
<template v-else>
  <label>이메일</label>
  <input placeholder="이메일 주소를 입력하세요">
</template>
```

위 코드에서 `loginType`을 바꾸어도 사용자가 이미 입력한 내용은 지워지지 않습니다. 두 템플릿 모두 같은 요소를 사용하므로 `<input>`은 대체되지 않고 단지 `placeholder`만 변경됩니다.

폼 인풋에 텍스트를 입력하고 토글 버튼을 눌러 직접 확인하십시오.

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>사용자 이름</label>
      <input placeholder="사용자 이름을 입력하세요">
    </template>
    <template v-else>
      <label>이메일</label>
      <input placeholder="이메일 주소를 입력하세요">
    </template>
  </div>
  <button @click="toggleLoginType">로그인 유형 변경</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

이것은 항상 바람직하지는 않습니다. 때문에 "이 두 엘리먼트는 완전히 별개이므로 다시 사용하지 마십시오."라고 알리는 방법을 제공합니다. 유일한 값으로 `key` 속성을 추가하십시오.

``` html
<template v-if="loginType === 'username'">
  <label>사용자 이름</label>
  <input placeholder="사용자 이름을 입력하세요" key="username-input">
</template>
<template v-else>
  <label>이메일</label>
  <input placeholder="이메일 주소를 입력하세요" key="email-input">
</template>
```

이제 전환 할 때마다 입력이 처음부터 렌더링됩니다. 직접 확인해보세요.

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>사용자 이름</label>
      <input placeholder="사용자 이름을 입력하세요" key="username-input">
    </template>
    <template v-else>
      <label>이메일</label>
      <input placeholder="이메일 주소를 입력하세요" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">로그인 유형 변경</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

`<label>` 엘리먼트는 `key` 속성이 없기 때문에 여전히 효율적으로 재사용 됩니다.

## `v-show`

엘리먼트를 조건부로 표시하기 위한 또 다른 옵션은 `v-show` 디렉티브입니다. 사용법은 거의 동일합니다.

``` html
<h1 v-show="ok">안녕하세요!</h1>
```

차이점은 `v-show`가 있는 엘리먼트는 항상 렌더링 되고 DOM에 남아있다는 점입니다. `v-show`는 단순히 엘리먼트에 `display` CSS 속성을 토글합니다.

<p class="tip">`v-show`는 `<template>` 구문을 지원하지 않으며 `v-else`와도 작동하지 않습니다.</p>

## `v-if` vs `v-show`

`v-if`는 조건부 블럭 안의 이벤트 리스너와 자식 컴포넌트가 토글하는 동안 적절하게 제거되고 다시 만들어지기 때문에 "진짜" 조건부 렌더링 입니다

`v-if`는 또한 **게으릅니다** 초기 렌더링에서 조건이 거짓인 경우 아무것도 하지 않습니다. 조건 블록이 처음으로 참이 될 때 까지 렌더링 되지 않습니다.

비교해보면, `v-show`는 훨씬 단순합니다. CSS 기반 토글만으로 초기 조건에 관계 없이 엘리먼트가 항상 렌더링 됩니다.

일반적으로 `v-if`는 토글 비용이 높고 `v-show`는 초기 렌더링 비용이 더 높습니다. 매우 자주 바꾸기를 원한다면 `v-show`를, 런타임 시 조건이 바뀌지 않으면 `v-if`를 권장합니다.

## `v-if` 와 `v-for`

`v-if`와 함께 사용하는 경우, `v-for`는  `v-if`보다 높은 우선순위를 갖습니다. 자세한 내용은 <a href="../guide/list.html#v-for-with-v-if">리스트 렌더링 가이드</a>를 확인하십시오.
