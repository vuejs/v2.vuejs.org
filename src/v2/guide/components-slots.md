---
title: 슬롯(Slots)
type: guide
order: 104
---

> 이 페이지는 여러분이 이미 [컴포넌트 기초](components.html)를 읽었다고 가정하고 쓴 내용입니다. 컴포넌트가 처음이라면 기초 문서를 먼저 읽으시기 바랍니다.

> 2.6.0 버전에서 '이름이 있는 슬롯'과 '범위를 가지는 슬롯'을 위한 새로운 통합 문법('v-slot' 디렉티브)을 도입했습니다. 새 디렉티브가 `slot`과 `slot-scope` 속성을 대체하고 두 속성은 이제 사라질 예정입니다. 아직 삭제된 건 아니고 문서는 [여기](#삭제될-문법)에서 볼 수 있습니다. 새 문법이 도입된 이유는 이 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md)에서 찾아볼 수 있습니다.(역자 주: 간략히 설명드리자면 기존 문법이 혼란스러운 부분이 있기 때문입니다. '이름이 있는 슬롯'과 '범위를 가지는 슬롯'을 동시에 쓸 때 좀 더 간결해지긴 하는데 슬롯 자체가 이해가 쉽지는 않습니다.)

## 슬롯에 들어가는 내용(Slot Content)

Vue에 있는 컨텐트 배포 API는 `<slot>` 요소를 컨텐트 배포 통로로 사용하는 [Web Components spec draft](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)에서 영향을 받았습니다.(역자 주: 웹컴포넌트는 2011년에 최초로 제안된 개념으로 구글에서 주로 밀고 있습니다. 표준안만 나오면 가장 가볍고 보편적인 웹 프레임워크가 되었겠지만 브라우저 제작사들이 아직 표준안을 도출하지 못하고 있습니다. 대신 논의 과정에서 나온 여러 개념들이 리액트, 앵귤러, 뷰 등의 웹 프레임워크에 도입되어서 사용되고 있습니다.)

그래서 아래와 같은 컴포넌트를 만들 수 있습니다.

``` html
<navigation-link url="/profile">
  Your Profile
</navigation-link>
```

그리고 `<navigation-link>` 템플릿을 아래와 같이 만들 수 있습니다.

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

컴포넌트를 렌더링할 때 `<slot></slot>`이 "Your Profile"로 교체됩니다. 슬롯에는 HTML 같은 템플릿 코드를 포함시킬 수 있기 때문입니다.

``` html
<navigation-link url="/profile">
  <!-- Font Awesome 아이콘을 추가합시다 -->
  <span class="fa fa-user"></span>
  Your Profile
</navigation-link>
```

다른 컴포넌트(역자 주: `<font-awesome-icon>`)도 가능합니다.

``` html
<navigation-link url="/profile">
  <!-- 컴포넌트로 아이콘을 추가해봅시다 -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Your Profile
</navigation-link>
```

만약 `<navigation-link>` 템플릿이 `<slot>` 요소를 가지고 있지 **않다면** 그 자리에 들어갔어야 할 모든 내용이 무시될 것입니다.

## 컴파일될 때의 범위(Compilation Scope)

슬롯 안에 데이터 옵션을 사용하고 싶을 수 있습니다. 아래의 예를 봅시다.

``` html
<navigation-link url="/profile">
  Logged in as {{ user.name }}
</navigation-link>
```

여기서 슬롯은 같은 템플릿의 나머지와 똑같은 인스턴스 속성(즉 같은 "범위")에 연결되어 있습니다. 슬롯이 `<navigation-link>`의 범위에 연결된 것이 아닌 거죠. 예를 들어 `url`에 접근하려고 하면 작동하지 않을 것입니다.

``` html
<navigation-link url="/profile">
  Clicking here will send you to: {{ url }}
  <!--
  `url`은 undefined로 나올 겁니다. 이 데이터는 <navigation-link>_로_
  넘어가지만 <navigation-link> 컴포넌트 _안에_ 정의되어 있지는 
  않으니까요.
  -->
</navigation-link>
```

이 규칙을 기억하세요.

> 부모 템플릿 안에 있는 것들은 부모 컴포넌트의 범위에 컴파일되고 자식 템플릿 안에 있는 것들은 자식 컴포넌트의 범위에 컴파일됩니다.

## 기본값 지정(Fallback Content)

아무 컨텐트도 전달되지 않았을 때 슬롯에 렌더링시킬 대비책(즉 기본값)을 지정해놓는 것이 유용한 경우가 있을 수 있습니다. `<submit-button>` 컴포넌트의 예를 살펴봅시다.

```html
<button type="submit">
  <slot></slot>
</button>
```

보통은 `<button>` 안에 "Submit" 텍스트가 들어가기를 원할 때가 많습니다. "Submit"을 기본값으로 만들기 위해서는 `<slot>` 태그 사이에 넣어야 합니다.

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

이제 부모 컴포넌트의 `<submit-button>`를 사용할 때 아래와 같이 슬롯에 해당하는 아무 내용을 전달하지 않으면

```html
<submit-button></submit-button>
```

기본값인 "Submit"이 렌더링될 것입니다.

```html
<button type="submit">
  Submit
</button>
```

하지만 슬롯에 어떤 내용을 전달하면

```html
<submit-button>
  Save
</submit-button>
```

전달된 내용이 렌더링되겠죠.

```html
<button type="submit">
  Save
</button>
```

## 이름이 있는 슬롯(Named Slots)

> 2.6.0+에서 업데이트가 있었습니다. [여기](#삭제될-문법)에서 `slot` 속성을 사용하는 기존의 문법을 보실 수 있습니다.

여러 개의 슬롯을 쓰면 더 유용할 때가 있습니다. 예를 들어 `<base-layout>` 컴포넌트의 아래 템플릿을 봅시다.

``` html
<div class="container">
  <header>
    <!-- 헤더는 여기에 넣을 겁니다 -->
  </header>
  <main>
    <!-- 본문은 여기에 넣을 겁니다 -->
  </main>
  <footer>
    <!-- 푸터는 여기에 넣을  -->
  </footer>
</div>
```

이런 경우를 위해서 `<slot>` 요소는 서로 다른 슬롯들을 정의할 때 쓸 수 있는 `name`이라는 특별한 속성을 가지고 있습니다.

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

`name`이 지정되지 않은 `<slot>`에는 암묵적으로 "default" 값이 사용됩니다.

이름이 있는 슬롯에 내용을 전달하려면 `<template>`에 `v-slot` 디렉티브를 쓰고 그 속성에 앞에서 지정한 'name'을 넣으면 됩니다.

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

이제 `<template>` 요소들의 모든 내용물이 적절한 슬롯으로 전달되었습니다. `v-slot`을 쓴 `<template>`으로 싸여있지 않은  내용물들은 디폴트 슬롯에 해당되는 것으로 간주합니다.

하지만 원한다면 명시적으로 `<template>`에 'default'를 표시하고 그 안에 내용을 넣을 수도 있습니다.

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

양쪽 모두 렌더링된 HTML은 아래와 같게 됩니다.

``` html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

삭제될 예정인 [`slot` 속성](#삭제될-문법)과 다르게 **`v-slot`만 `<template>` 태그에 추가할 수 있다는 점**을 유의하시기 바랍니다.(예외가 [하나](#단독-디폴트-슬롯을-위한-축약-문법) 있기는 합니다)

## 범위가 있는 슬롯(Scoped Slots)

> 2.6.0+에서 업데이트가 있었습니다. [여기](#삭제될-문법)에서 `slot-scope` 속성을 사용하는 기존의 문법을 보실 수 있습니다.

어떨 때는 자식 컴포넌트에서만 접근할 수 있는 데이터에서 슬롯에 필요한 내용을 가져와야 할 수 있습니다. 아래 템플릿의 `<current-user>` 컴포넌트의 예를 살펴봅시다.

```html
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```

아래와 같이 기본값을 사용자의 성말고 이름으로 바꾸고 싶을 수도 있습니다.

``` html
<current-user>
  {{ user.firstName }}
</current-user>
```

하지만 이 파일은 작동하지 않습니다. 왜냐하면 `<current-user>` 컴포넌트만 `user`에 접근할 수 있는데 슬롯에 제공되는 내용들은 부모 컴포넌트에서 렌더링되기 때문입니다.

부모 컴포넌트의 슬롯에서 `user`를 쓸려면 `user`를 `<slot>` 요소에 속성으로 연결해야 합니다.

``` html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

`<slot>` 요소에 연결된 속성을 **슬롯 속성(slot props)**라고 합니다. 이제 부모 컴포넌트의 범위(scope)에서 `v-slot`에 연결한 '슬롯 속성(slotProps)'를 쓸 수 있습니다.

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

이번 사례에서 모든 '슬롯 속성'의 이름을 'slotProps'라고 썼는데 이 이름은 당연히 사용자가 원하는 대로 바꿀 수 있습니다.

### 단독 디폴트 슬롯을 위한 축약 문법(Abbreviated Syntax for Lone Default Slots)

위의 사례와 같이 제공된 내용이 디폴트 슬롯 _밖에_ 없으면 컴포넌트의 태그를 슬롯의 템플릿으로 바로 쓸 수 있습니다. 즉 `v-slot`을 컴포넌트에다 쓸 수 있다는 것입니다.(역자 주: 바로 위의 <current-user> 컴포넌트 코드와 비교하세요.)

``` html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

더 짧게도 만들 수 있습니다. 앞에서 다뤘듯이 특정되지 않은 내용은 디폴트 슬롯에 해당하는 것으로 간주하기 때문에, 속성이 없는 `v-slot`도 디폴트 슬롯으로 간주합니다.(역자 주: 위의 코드에서는 'default'가 'name'속성입니다.)

``` html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

범위를 모호하게 만들기 때문에 디폴트 슬롯을 위한 축약 문법은 이름이 있는 슬롯들과 함께 쓸 수 **없습니다**.

``` html
<!-- 불가. 경고가 뜰 겁니다 -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    slotProps is NOT available here
  </template>
</current-user>
```

여러 개의 슬롯이 있을 때는 `<template>`에 기초한 문법 전체를 _모든_ 슬롯에 쓰기 바랍니다.

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

### 슬롯 속성 구조분해(Destructuring Slot Props)

프레임워크 내부에서 '범위가 있는 슬롯'은 하나의 인수(역자 주: 슬롯 속성)를 가지는 함수로 슬롯에 들어가는 내용을 감싸는 방식으로 작동합니다.

```js
function (slotProps) {
  // ... slot content ...
}
```

`v-slot`의 값은 함수 정의식의 인수 위치에서 가능한 어떤 종류의 자바스크립트 표현식도 다 가능합니다. 그러므로 ([싱글 파일 컴포넌트](single-file-components.html)나 [모던 브라우저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)처럼) 지원되는 모든 환경에서 아래와 같이 특정 슬롯 속성을 추출하는 [ES2015 구조분해](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring)를 할 수 있다는 뜻입니다.

``` html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

이를 통해서 템플릿을 더 깨끗하게 만들 수 있습니다. 특히 슬롯에서 다양한 슬롯 속성들을 쓸 경우에 그렇습니다. 또 다른 기능으로 `user`를 `person`으로 바꾸는 것처럼 속성의 이름을 다시 정할 수도 있죠.

``` html
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
```

속성이 undefined이면 슬롯 슬롯에 들어갈 기본값을 정할 수도 있습니다.

``` html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

## 가변 슬롯 이름(Dynamic Slot Names)

> 2.6.0+ 에서 추가

[가변 디렉티브 인수](syntax.html#가변-인수)는 가변 슬롯 이름을 정의하는 방식으로 `v-slot`에서도 작동합니다.

``` html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## 이름이 있는 슬롯 디렉티브의 단축표기(Named Slots Shorthand)

> 2.6.0+ 에서 추가

`v-on`과 `v-bind`처럼 `v-slot`도 단축표기를 가지고 있습니다. 인수 앞에 쓰는 부분(`v-slot:`)을 특수 기호인 `#`으로 대체하는 것입니다. 예를 들어 `v-slot:header`는 `#header`로 쓸 수도 있습니다.

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

하지만 다른 디렉티브와 마찬가지로 단축 표기는 오직 인수가 있을 때만 가능합니다. 즉 아래와 같은 문법은 불가능합니다.

``` html
<!-- 이런 문법을 쓰면 경고가 나올 겁니다 -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
```

그리고 단축 표기를 쓰려면 반드시 슬롯의 이름을 특정해야 합니다.

``` html
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
```

## 다른 사례들(Other Examples)

**슬롯 속성을 통해 슬롯을 입력되는 속성에 따라 다른 내용을 렌더링할 수 있는 재사용가능한 템플릿으로 변환할 수 있습니다.** 부모 컴포넌트를 레이아웃 용도로만 사용하고 데이터 로직을 캡슐화한 재사용가능 컴포넌트를 디자인할 때 가장 유용한 방법입니다.

아래에서 목록의 레이아웃과 필터링 로직을 담은 `<todo-list>` 컴포넌트를 쓸 것입니다.

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

각각의 할 일에 대해서 하드코딩된 내용을 쓰는 대신 모든 할일 들을 슬롯으로 만들어서 부모 컴포넌트가 관리할 수 있게 만들 수 있습니다. 그리고 `todo`를 슬롯 속성으로 연결시키는 거죠.

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    각 할일에 대해 슬롯을 만들고
    `todo` 객체를 슬롯 속성으로 보냅니다.
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- 기본값 -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

이제 `<todo-list>` 컴포넌트를 쓸 때 할일 아이템들을 위해서 자식 컴포넌트의 데이터에도 접근할 수 있는 대체 `<template>`을 따로 정의할 수도 있습니다.

```html
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

하지만 이 정도는 범위가 있는 슬롯으로 무엇을 할 수 있는지 아주 조금 살펴본 것에 불과합니다. 실제로 범위가 있는 슬롯의 사용 예시를 보시려면 [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller), [Vue Promised](https://github.com/posva/vue-promised), [Portal Vue](https://github.com/LinusBorg/portal-vue)같은 라이브러리들을 둘러볼 것을 추천드립니다.

## 삭제될 문법

> `v-slot` 디렉티브는 `slot`과 `slot-scope` 인수들을 대체하는, 더 발전된 API로 Vue 2.6.0에 도입되었습니다. 새 문법이 도입된 이유는 이 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md)에서 찾아볼 수 있습니다. `slot`과 `slot-scope` 인수는 앞으로도 2.x 버전에서는 계속 지원될 것입니다. 하지만 Vue 3에서는 공식적으로 삭제될 예정입니다.

### `slot` 인수를 사용하는 이름이 있는 슬롯

> 2.6.0+ 부터 <abbr title="모든 Vue 2.x 버전에서 지원되고 있으나 사용을 추천하지 않습니다.">지원 중단 예정</abbr>. [여기](#이름이-있는-슬롯(Named-Slots))에서 권장되는 새 문법을 확인하세요.

내용물을 부모 컴포넌트에서 이름이 있는 슬롯에 보내려면 `slot` 인수를 `<template>`에서 사용해야 합니다.([여기](#이름이-있는-슬롯(Named-Slots))에서 예시로 사용했던 `<base-layout>` 컴포넌트를 사용하겠습니다.)

```html
<base-layout>
  <template slot="header">
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template slot="footer">
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

혹은 `slot` 인수를 일반 요소(element)에 바로 사용할 수도 있습니다.

``` html
<base-layout>
  <h1 slot="header">Here might be a page title</h1>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</base-layout>
```

여전히 이름이 없는 슬롯이 하나 있는데 이를 **디폴트 슬롯**이라고 하고 해당하는 슬롯이 없는 모든 내용들이 여기에 들어갑니다. 위의 두 예시 모두 HTML로 렌더링하면 아래와 같습니다.

``` html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

### `slot-scope` 인수를 사용하는 범위가 있는 슬롯

> 2.6.0+ 부터 <abbr title="모든 Vue 2.x 버전에서 지원되고 있으나 사용을 추천하지 않습니다.">지원 중단 예정</abbr>. [여기](#범위가-있는-슬롯(Scoped-Slots))에서 권장되는 새 문법을 확인하세요.

슬롯으로 전달된 속성들을 받기 위해서 부모 컴포넌트는 `slot-scope` 인수와 함께 `<template>`을 사용할 수 있습니다.([여기](#범위가-있는-슬롯(Scoped-Slots))에서 예시로 사용했던 `<slot-example>` 컴포넌트를 사용하겠습니다.)

``` html
<slot-example>
  <template slot="default" slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

여기서 `slot-scope`은 넘겨받은 속성들을 `slotProps` 변수로 선언하고 `<template>` 범위 안에서 사용할 수 있도록 만들었습니다. `slotProps`라는 이름은 자바스크립트에서 함수의 인수 이름을 정하듯이 자유롭게 정할 수 있습니다.

`slot="default"`는 생략할 수도 있습니다.

``` html
<slot-example>
  <template slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

`slot-scope` 인수는 컴포넌트와 같이 `<template>` 요소가 아닌 곳에 바로 사용될 수도 있습니다.

``` html
<slot-example>
  <span slot-scope="slotProps">
    {{ slotProps.msg }}
  </span>
</slot-example>
```

`v-slot`의 값은 함수 정의식의 인수 위치에서 가능한 어떤 종류의 자바스크립트 표현식도 다 가능합니다. 그러므로 ([싱글 파일 컴포넌트](single-file-components.html)나 [모던 브라우저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)처럼) 지원되는 모든 환경에서 아래와 같이 특정 슬롯 속성을 추출하는 [ES2015 구조분해](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring)를 할 수 있다는 뜻입니다.

``` html
<slot-example>
  <span slot-scope="{ msg }">
    {{ msg }}
  </span>
</slot-example>
```

아래는 [여기](#다른-사례들(Other-Examples))에서 사례로 설명한 `<todo-list>`와 똑같은 사례입니다.

``` html
<todo-list v-bind:todos="todos">
  <template slot="todo" slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```
