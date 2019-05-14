---
type: style-guide
---

# 스타일 가이드 <sup class="beta">베타</sup>

이 문서는 Vue 코드에 대한 공식 스타일 가이드입니다. 만약 현재 Vue를 사용하여 프로젝트를 진행중이라면 이 문서는 에러와 바이크쉐딩(bikeshedding), 안티패턴을 피하는 좋은 참조가 될것 입니다. 그러나 무조건 이 문서에서 제시하는 스타일 가이드가 당신의 프로젝트에 적합한 것은 아닙니다. 그러므로 당신의 경험과 기술스택, 개인적 통찰력을 바탕으로 이 스타일 가이드가 적용되는 것을 권장해드립니다.

대부분의 경우 우리는 HTML과 자바스크립트에 대한 제안은 일반적으로 피합니다. 우리는 당신이 세미콜론이나 쉼표(trailing commas)에 대한 사용여부는 신경쓰지 않습니다. 우리는 당신이 HTML의 속성값을 위해 작음따옴표를 사용하지는 큰따옴표를 사용하는지 신경쓰지 않습니다. 그러나 특정 패턴이 뷰 컨텍스트에서 유용하다고 발견된 경우 예외가 존재합니다.

> **Soon, we'll also provide tips for enforcement.** Sometimes you'll simply have to be disciplined, but wherever possible, we'll try to show you how to use ESLint and other automated processes to make enforcement simpler.

마지막으로, 우리는 규칙을 4가지 범주로 분류하였습니다.



## 규칙 분류

### 우선순위 A: 필수

이 규칙은 오류를 예방하는데 도움을 주기 때문에 모든 비용을 통해서 학습하고 준수하여야 합니다. 예외상황이 존재하겠지만 매우 드물며 자바스크립트와 뷰에 대한 전문 지식이 있어야 만들 수 있습니다.

### 우선순위 B: 매우 추천함

이 규칙은 대부분의 프로젝트에서 가독성 그리고 개발자경험을 향상시키는 것으로 발견되었습니다. 해당 규칙을 위반해도 코드는 여전히 실행되지만 위반은 드물고 정당합니다.

### 우선순위 C: 추천함

동일하게 좋은 여러가지 옵션이 존재하는 경우, 일관성을 보장하기 위해 임의의 선택을 할 수 있습니다. 이 규칙은 각각의 수용가능한 옵션을 설명하고 기본 선택을 제안합니다. 즉, 일관성 있고 좋은 이유가 있으면 당신의 코드베이스에서 자유롭게 다른 선택을 할 수 있습니다. 좋은 이유가 있어야 합니다! 커뮤니티 표준에 적응되기 위해서 당신은 다음과 같이 해야합니다.

1. 당신이 마주하는 대부분의 커뮤니티 코드를 더 쉽게 분석할 수 있도록 훈련하세요
2. 커뮤니티 코드 예제를 수정하기 한고 복사 그리고 붙혀넣기 할 수 있어야 합니다
3. 적어도 뷰에 있어서는 당신이 선호하는 코딩 스타일을 수용하는 새로운 직원을 자주 찾을 것입니다

### 우선순위 D: 주의요함

뷰의 몇 가지 은 특성은 드문 엣지 케이스 또는 레거시 코드로의 부터 마이크레이션을 위해 존재합니다. 그러나 그것들을 남용하면 당신의 코드를 유지보수하기 어렵게만들거나 버그를 발생시키는 원인이 될 수 있습니다. 이 규칙은 잠재적 위험요소를 인식시켜주고 언제 그리고 왜 피해야되는지 설명해 줍니다.



## 우선순위 A 규칙: 필수 (에러 방지)



### 컴포넌트 이름에 합성어 사용 <sup data-p="a">필수</sup>

**root 컴포넌트인 `App` 컴포넌트를 제외하고 컴포넌트의 이름은 항상 합성어를 사용해야한다.**

모든 HTML 엘리먼트의 이름은 한 단어이기 때문에 합성어를 사용하는 것은 기존 그리고 향후 HTML엘리먼트와의 [충돌을 방지해줍니다](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name).

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
Vue.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
Vue.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
{% raw %}</div>{% endraw %}



### 컴포넌트 데이터 <sup data-p="a">필수</sup>

**컴포넌트의 `data` 는 반드시 함수여야 합니다.**

컴포넌트(i.e. `new Vue`를 제외한 모든곳)의 `data` 프로퍼티의 값은 반드시 객체(object)를 반환하는 함수여야 한다.

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

`data` 의 값이 오브젝트일 경우, 컴포넌트의 모든 인스턴스가 공유한다. 예를 들어, 다음 data 를 가진 `TodoList` 컴포넌트를 상상해보자.

``` js
data: {
  listTitle: '',
  todos: []
}
```

이 컴포넌트는 재사용하여 사용자가 여러 목록(e.g. 쇼핑, 소원, 오늘 할일 등)을 유지할 수 있도록 해야 할 수 있다. 컴포넌트의 모든 인스턴스가 동일한 data 객체를 참조하므로, 하나의 목록의 타이틀을 변경할 때 다른 모든 리스트의 타이틀도 변경될 것이다. Todo를 추가/수정/삭제하는 경우에도 마찬가지다.

대신 우리는 각 컴포넌트의 인스턴스 자체 data만을 관리하기를 원한다. 이렇게 하려면 각 인스턴스는 고유한 data 객체를 생성해야 한다. JavaScript에서는 함수안에서 객체를 반환하는 방법으로 해결할 수 있다:

``` js
data: function () {
  return {
    listTitle: '',
    todos: []
  }
}
```
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

``` js
export default {
  data: {
    foo: 'bar'
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음
``` js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

``` js
// In a .vue file
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

``` js
// It's OK to use an object directly in a root
// Vue instance, since only a single instance
// will ever exist.
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}



### Props 정의 <sup data-p="a">필수</sup>

**Prop은 가능한 상세하게 정의되어야 합니다.**

커밋 된 코드에서, prop 정의는 적어도 타입은 명시되도록 가능한 상세하게 정의되어야 합니다.

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

자세한 [prop definitions](https://vuejs.org/v2/guide/components.html#Prop-Validation) 두 가지 이점을 갖는다:

- 이 API는 컴포넌트의 API를 문서화하므로 컴포넌트의 사용 방법을 쉽게 알 수 있다.
- 개발 중에, Vue는 컴포넌트의 타입이 잘못 지정된 props를 전달하면 경고 메시지를 표시하여 오류의 잠재적 원인을 파악할 수 있도록 도와준다.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
// This is only OK when prototyping
props: ['status']
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
props: {
  status: String
}
```

``` js
// Even better!
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}



### `v-for` 에 `key` 지정  <sup data-p="a">필수</sup>

**`v-for`는 `key`와 항상 함께 사용합니다.**

서브트리의 내부 컴포넌트 상태를 유지하기 위해 `v-for`는 _항상_ `key`와 함께 요구됩니다. 비록 엘리먼트이긴 하지만 에니메이션의 [객체 불변성](https://bost.ocks.org/mike/constancy/)과 같이 예측 가능한 행동을 유지하는것은 좋은 습관입니다.

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

할일 목록이 있다고 가정 해보자:

``` js
data: function () {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

그 다음 알파벳순으로 정렬한다. DOM 이 업데이트될 때, Vue는 가능한 적은 DOM 전이(mutations)를 수행하기 위해 렌더링을 최적화한다. 즉, 첫번째 할일 엘리먼트를 지우고, 리스트의 마지막에 다시 추가한다.

The problem is, there are cases where it's important not to delete elements that will remain in the DOM. For example, you may want to use `<transition-group>` to animate list sorting, or maintain focus if the rendered element is an `<input>`. In these cases, adding a unique key for each item (e.g. `:key="todo.id"`) will tell Vue how to behave more predictably.

In our experience, it's better to _always_ add a unique key, so that you and your team simply never have to worry about these edge cases. Then in the rare, performance-critical scenarios where object constancy isn't necessary, you can make a conscious exception.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}



### `v-if`와 `v-for`를 동시에 사용하지 마세요 <sup data-p="a">필수</sup>

**`v-for`가 사용된 엘리먼트에 절대 `v-if`를 사용하지 마세요.**

사용 가능해 보이는 두 가지 일반적인 경우가 있습니다:

- 리스트 목록을 필터링하기 위해서 입니다 (e.g. `v-for="user in users" v-if="user.isActive"`).  이 경우 users을 새로운 computed 속성으로 필더링된 목록으로 대체하십시오(e.g. `activeUsers`).

- 숨기기 위해 리스트의 랜더링을 피할 때 입니다 (e.g. `v-for="user in users" v-if="shouldShowUsers"`). 이 경우 `v-if`를 컨테이너 엘리먼트로 옮기세요 (e.g. `ul`, `ol`).

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

When Vue processes directives, `v-for` has a higher priority than `v-if`, so that this template:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Will be evaluated similar to:

``` js
this.users.map(function (user) {
  if (user.isActive) {
    return user.name
  }
})
```

So even if we only render elements for a small fraction of users, we have to iterate over the entire list every time we re-render, whether or not the set of active users has changed.

By iterating over a computed property instead, like this:

``` js
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
      return user.isActive
    })
  }
}
```

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

다음과 같은 이점을 얻을 수 있다:

- The filtered list will _only_ be re-evaluated if there are relevant changes to the `users` array, making filtering much more efficient.
- Using `v-for="user in activeUsers"`, we _only_ iterate over active users during render, making rendering much more efficient.
- Logic is now decoupled from the presentation layer, making maintenance (change/extension of logic) much easier.

We get similar benefits from updating:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

to:

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

By moving the `v-if` to a container element, we're no longer checking `shouldShowUsers` for _every_ user in the list. Instead, we check it once and don't even evaluate the `v-for` if `shouldShowUsers` is false.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}



### 컴포넌트 스타일 스코프 <sup data-p="a">필수</sup>

**For applications, styles in a top-level `App` component and in layout components may be global, but all other components should always be scoped.**

This is only relevant for [single-file components](../guide/single-file-components.html). It does _not_ require that the [`scoped` attribute](https://vue-loader.vuejs.org/en/features/scoped-css.html) be used. Scoping could be through [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html), a class-based strategy such as [BEM](http://getbem.com/), or another library/convention.

**Component libraries, however, should prefer a class-based strategy instead of using the `scoped` attribute.**

This makes overriding internal styles easier, with human-readable class names that don't have too high specificity, but are still very unlikely to result in a conflict.

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

If you are developing a large project, working with other developers, or sometimes include 3rd-party HTML/CSS (e.g. from Auth0), consistent scoping will ensure that your styles only apply to the components they are meant for.

Beyond the `scoped` attribute, using unique class names can help ensure that 3rd-party CSS does not apply to your own HTML. For example, many projects use the `button`, `btn`, or `icon` class names, so even if not using a strategy such as BEM, adding an app-specific and/or component-specific prefix (e.g. `ButtonClose-icon`) can provide some protection.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<template>
  <button class="button button-close">X</button>
</template>

<!-- Using the `scoped` attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">X</button>
</template>

<!-- Using CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">X</button>
</template>

<!-- Using the BEM convention -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Private 속성 이름 <sup data-p="a">필수</sup>

**플러그인, mixin 등에서 커스텀 사용자 private 프로터피에는 항상 접두사 `$_`를 사용하라. 그 다음 다른 사람의 코드와 충돌을 피하려면 named scope를 포함하라. (e.g. `$_yourPluginName_`).**

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

Vue uses the `_` prefix to define its own private properties, so using the same prefix (e.g. `_update`) risks overwriting an instance property. Even if you check and Vue is not currently using a particular property name, there is no guarantee a conflict won't arise in a later version.

As for the `$` prefix, it's purpose within the Vue ecosystem is special instance properties that are exposed to the user, so using it for _private_ properties would not be appropriate.

Instead, we recommend combining the two prefixes into `$_`, as a convention for user-defined private properties that guarantee no conflicts with Vue.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
var myGreatMixin = {
  // ...
  methods: {
    update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    _update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_update: function () {
      // ...
    }
  }
}
```

{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update: function () {
      // ...
    }
  }
}
```
{% raw %}</div>{% endraw %}



## 우선순위 B 규칙: 매우 추천함 (가독성 향상을 위함)



### 컴포넌트 파일 <sup data-p="b">매우 추천함</sup>

**Whenever a build system is available to concatenate files, each component should be in its own file.**

This helps you to more quickly find a component when you need to edit it or review how to use it.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
{% raw %}</div>{% endraw %}



### 싱글 파일 컴포넌트 이름 규칙 지정(casing) <sup data-p="b">매우 추천함</sup>

**Filenames of [single-file components](../guide/single-file-components.html) should either be always PascalCase or always kebab-case.**

PascalCase works best with autocompletion in code editors, as it's consistent with how we reference components in JS(X) and templates, wherever possible. However, mixed case filenames can sometimes create issues on case-insensitive filesystems, which is why kebab-case is also perfectly acceptable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
{% raw %}</div>{% endraw %}



### 베이스 컴포넌트 이름 <sup data-p="b">매우 추천함</sup>

**Base components (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with a specific prefix, such as `Base`, `App`, or `V`.**

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

These components lay the foundation for consistent styling and behavior in your application. They may **only** contain:

- HTML elements,
- other `Base`-prefixed components, and
- 3rd-party UI components.

But they'll **never** contain global state (e.g. from a Vuex store).

Their names often include the name of an element they wrap (e.g. `BaseButton`, `BaseTable`), unless no element exists for their specific purpose (e.g. `BaseIcon`). If you build similar components for a more specific context, they will almost always consume these components (e.g. `BaseButton` may be used in `ButtonSubmit`).

Some advantages of this convention:

- When organized alphabetically in editors, your app's base components are all listed together, making them easier to identify.

- Since component names should always be multi-word, this convention prevents you from having to choose an arbitrary prefix for simple component wrappers (e.g. `MyButton`, `VueButton`).

- Since these components are so frequently used, you may want to simply make them global instead of importing them everywhere. A prefix makes this possible with Webpack:

  ``` js
  var requireComponent = require.context("./src", true, /^Base[A-Z]/)
  requireComponent.keys().forEach(function (fileName) {
    var baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    var baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    Vue.component(baseComponentName, baseComponentConfig)
  })
  ```

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
{% raw %}</div>{% endraw %}



### 싱글 인스턴스 컴포넌트 이름 <sup data-p="b">매우 추천함</sup>

**Components that should only ever have a single active instance should begin with the `The` prefix, to denote that there can be only one.**

This does not mean the component is only used in a single page, but it will only be used once _per page_. These components never accept any props, since they are specific to your app, not their context within your app. If you find the need to add props, it's a good indication that this is actually a reusable component that is only used once per page _for now_.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

```
components/
|- Heading.vue
|- MySidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
{% raw %}</div>{% endraw %}



### 강한 연관성을 가진 컴포넌트 이름 <sup data-p="b">매우 추천함</sup>

**Child components that are tightly coupled with their parent should include the parent component name as a prefix.**

If a component only makes sense in the context of a single parent component, that relationship should be evident in its name. Since editors typically organize files alphabetically, this also keeps these related files next to each other.

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

You might be tempted to solve this problem by nesting child components in directories named after their parent. For example:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

or:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

This isn't recommended, as it results in:

- Many files with similar names, making rapid file switching in code editors more difficult.
- Many nested sub-directories, which increases the time it takes to browse components in an editor's sidebar.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
{% raw %}</div>{% endraw %}



### 컴포넌트 이름의 단어 순서 정렬 <sup data-p="b">매우 추천함</sup>

**Component names should start with the highest-level (often most general) words and end with descriptive modifying words.**

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

You may be wondering:

> "Why would we force component names to use less natural language?"

In natural English, adjectives and other descriptors do typically appear before the nouns, while exceptions require connector words. For example:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

You can definitely include these connector words in component names if you'd like, but the order is still important.

Also note that **what's considered "highest-level" will be contextual to your app**. For example, imagine an app with a search form. It may include components like this one:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

As you might notice, it's quite difficult to see which components are specific to the search. Now let's rename the components according to the rule:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Since editors typically organize files alphabetically, all the important relationships between components are now evident at a glance.

You might be tempted to solve this problem differently, nesting all the search components under a "search" directory, then all the settings components under a "settings" directory. We only recommend considering this approach in very large apps (e.g. 100+ components), for these reasons:

- It generally takes more time to navigate through nested sub-directories, than scrolling through a single `components` directory.
- Name conflicts (e.g. multiple `ButtonDelete.vue` components) make it more difficult to quickly navigate to a specific component in a code editor.
- Refactoring becomes more difficult, because find-and-replace often isn't sufficient to update relative references to a moved component.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
{% raw %}</div>{% endraw %}



### 셀프 클로징 컴포넌트 <sup data-p="b">매우 추천함</sup>

**Components with no content should be self-closing in [single-file components](../guide/single-file-components.html), string templates, and [JSX](../guide/render-function.html#JSX) - but never in DOM templates.**

Components that self-close communicate that they not only have no content, but are **meant** to have no content. It's the difference between a blank page in a book and one labeled "This page intentionally left blank." Your code is also cleaner without the unnecessary closing tag.

Unfortunately, HTML doesn't allow custom elements to be self-closing - only [official "void" elements](https://www.w3.org/TR/html/syntax.html#void-elements). That's why the strategy is only possible when Vue's template compiler can reach the template before the DOM, then serve the DOM spec-compliant HTML.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- In DOM templates -->
<my-component/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent/>
```

``` html
<!-- In DOM templates -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### 템플릿에서 컴포넌트 이름 규칙 지정(casing) <sup data-p="b">매우 추천함</sup>

**In most projects, component names should always be PascalCase in [single-file components](../guide/single-file-components.html) and string templates - but kebab-case in DOM templates.**

PascalCase has a few advantages over kebab-case:

- Editors can autocomplete component names in templates, because PascalCase is also used in JavaScript.
- `<MyComponent>` is more visually distinct from a single-word HTML element than `<my-component>`, because there are two character differences (the two capitals), rather than just one (a hyphen).
- If you use any non-Vue custom elements in your templates, such as a web component, PascalCase ensures that your Vue components remain distinctly visible.

Unfortunately, due to HTML's case insensitivity, DOM templates must still use kebab-case.

Also note that if you've already invested heavily in kebab-case, consistency with HTML conventions and being able to use the same casing across all your projects may be more important than the advantages listed above. In those cases, **using kebab-case everywhere is also acceptable.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<!-- In single-file components and string templates -->
<mycomponent/>
```

``` html
<!-- In single-file components and string templates -->
<myComponent/>
```

``` html
<!-- In DOM templates -->
<MyComponent></MyComponent>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<!-- In single-file components and string templates -->
<MyComponent/>
```

``` html
<!-- In DOM templates -->
<my-component></my-component>
```

OR

``` html
<!-- Everywhere -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### JS/JSX에서 컴포넌트 이름 규칙 지정(casing) <sup data-p="b">매우 추천함</sup>

**Component names in JS/[JSX](../guide/render-function.html#JSX) should always be PascalCase, though they may be kebab-case inside strings for simpler applications that only use global component registration through `Vue.component`.**

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

In JavaScript, PascalCase is the convention for classes and prototype constructors - essentially, anything that can have distinct instances. Vue components also have instances, so it makes sense to also use PascalCase. As an added benefit, using PascalCase within JSX (and templates) allows readers of the code to more easily distinguish between components and HTML elements.

However, for applications that use **only** global component definitions via `Vue.component`, we recommend kebab-case instead. The reasons are:

- It's rare that global components are ever referenced in JavaScript, so following a convention for JavaScript makes less sense.
- These applications always include many in-DOM templates, where [kebab-case **must** be used](#Component-name-casing-in-templates-strongly-recommended).

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
Vue.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
Vue.component('MyComponent', {
  // ...
})
```

``` js
Vue.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
{% raw %}</div>{% endraw %}



### 전체 이름 컴포넌트 이름 <sup data-p="b">매우 추천함</sup>

**Component names should prefer full words over abbreviations.**

The autocompletion in editors make the cost of writing longer names very low, while the clarity they provide is invaluable. Uncommon abbreviations, in particular, should always be avoided.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
{% raw %}</div>{% endraw %}



### Prop 이름 규칙 지정(casing) <sup data-p="b">매우 추천함</sup>

**Prop names should always use camelCase during declaration, but kebab-case in templates and [JSX](../guide/render-function.html#JSX).**

We're simply following the conventions of each language. Within JavaScript, camelCase is more natural. Within HTML, kebab-case is.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
props: {
  'greeting-text': String
}
```

``` html
<WelcomeMessage greetingText="hi"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
{% raw %}</div>{% endraw %}



### 다중 속성 엘리먼트 <sup data-p="b">매우 추천함</sup>

**Elements with multiple attributes should span multiple lines, with one attribute per line.**

In JavaScript, splitting objects with multiple properties over multiple lines is widely considered a good convention, because it's much easier to read. Our templates and [JSX](../guide/render-function.html#JSX) deserve the same consideration.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
{% raw %}</div>{% endraw %}



### 템플릿에서 단순한 표현식 <sup data-p="b">매우 추천함</sup>

**Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.**

Complex expressions in your templates make them less declarative. We should strive to describe _what_ should appear, not _how_ we're computing that value. Computed properties and methods also allow the code to be reused.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<!-- In a template -->
{{ normalizedFullName }}
```

``` js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```
{% raw %}</div>{% endraw %}



### 단순한 계산된 속성 <sup data-p="b">매우 추천함</sup>

**Complex computed properties should be split into as many simpler properties as possible.**

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

Simpler, well-named computed properties are:

- __Easier to test__

  When each computed property contains only a very simple expression, with very few dependencies, it's much easier to write tests confirming that it works correctly.

- __Easier to read__

  Simplifying computed properties forces you to give each value a descriptive name, even if it's not reused. This makes it much easier for other developers (and future you) to focus in on the code they care about and figure out what's going on.

- __More adaptable to changing requirements__

  Any value that can be named might be useful to the view. For example, we might decide to display a message telling the user how much money they saved. We might also decide to calculate sales tax, but perhaps display it separately, rather than as part of the final price.

  Small, focused computed properties make fewer assumptions about how information will be used, so require less refactoring as requirements change.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```
{% raw %}</div>{% endraw %}



### 속성 값에 따옴표 <sup data-p="b">매우 추천함</sup>

**Non-empty HTML attribute values should always be inside quotes (single or double, whichever is not used in JS).**

While attribute values without any spaces are not required to have quotes in HTML, this practice often leads to _avoiding_ spaces, making attribute values less readable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
{% raw %}</div>{% endraw %}



### 축약형 디렉티브 <sup data-p="b">매우 추천함</sup>

**Directive shorthands (`:` for `v-bind:` and `@` for `v-on:`) should be used always or never.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

``` html
<input
  @input="onInput"
  @focus="onFocus"
>
```

``` html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```
{% raw %}</div>{% endraw %}



## 우선순위 C 규칙: 추천함 (선택의 혼란 또는 판단 오버헤드 최소화)



### 컴포넌트/인스턴스 옵션 순서 <sup data-p="c">추천함</sup>

**컴포넌트/인스턴스 옵션의 순서는 언제나 일정한 순서로 정렬되어야 합니다.**

아래는 권장하는 컴포넌트 옵션 순서입니다. 유형별로 나누어 놓았으므로, 플러그인으로 추가되는 새로운 옵션들 역시 이에 맞추어 정렬하면 됩니다.

1. **사이드 이펙트(Side Effects)** (컴포넌트 외부에 효과가 미치는 옵션)
  - `el`

2. **전역 인지(Global Awareness)** (컴포넌트 바깥의 지식을 필요로 하는 옵션)
  - `name`
  - `parent`

3. **컴포넌트 유형(Component Type)** (컴포넌트의 유형을 바꾸는 옵션)
  - `functional`

4. **템플릿 변경자(Template Modifiers)** (템플릿이 컴파일되는 방식을 바꾸는 옵션)
  - `delimiters`
  - `comments`

5. **템플릿 의존성(Template Dependencies)** (템플릿에 이용되는 요소들을 지정하는 옵션)
  - `components`
  - `directives`
  - `filters`

6. **컴포지션(Composition)** (다른 컴포넌트의 속성을 가져와 합치는 옵션)
  - `extends`
  - `mixins`

7. **인터페이스(Interface)** (컴포넌트의 인터페이스를 지정하는 옵션)
  - `inheritAttrs`
  - `model`
  - `props`/`propsData`

8. **지역 상태(Local State)** (반응적인 지역 속성들을 설정하는 옵션)
  - `data`
  - `computed`

9. **이벤트(Events)** (반응적인 이벤트에 의해 실행되는 콜백을 지정하는 옵션)
  - `watch`
  - 라이프사이클 이벤트 (호출 순서대로 정렬)

10. **비반응적 속성(Non-Reactive Properties)** (시스템의 반응성과 관계 없는 인스턴스 속성을 지정하는 옵션)
  - `methods`

11. **렌더링(Rendering)** (컴포넌트 출력을 선언적으로 지정하는 옵션)
  - `template`/`render`
  - `renderError`



### 엘리먼트 속성 순서 <sup data-p="c">추천함</sup>

**엘리먼트 및 컴포넌트의 속성은 언제나 일정한 순서로 정렬되어야 합니다.**

아래는 권장하는 엘리먼트 속성 순서입니다. 유형별로 나누어 놓았으므로, 커스텀 속성이나 directive 역시 이에 맞추어 정렬하면 됩니다.

1. **정의(Definition)** (컴포넌트 옵션을 제공하는 속성)
  - `is`

2. **리스트 렌더링(List Rendering)** (같은 엘리먼트의 변형을 여러 개 생성하는 속성)
  - `v-for`

3. **조건부(Conditionals)** (엘리먼트가 렌더링되는지 혹은 보여지는지 여부를 결정하는 속성)
  - `v-if`
  - `v-else-if`
  - `v-else`
  - `v-show`
  - `v-cloak`

4. **렌더 변경자(Render Modifiers)** (엘리먼트의 렌더링 방식을 변경하는 속성)
  - `v-pre`
  - `v-once`

5. **전역 인지(Global Awareness)** (컴포넌트 바깥의 지식을 요구하는 속성)
  - `id`

6. **유일한 속성(Unique Attributes)** (유일한 값을 가질 것을 요구하는 속성)
  - `ref`
  - `key`
  - `slot`

7. **양방향 바인딩(Two-Way Binding)** (바인딩과 이벤트를 결합하는 속성)
  - `v-model`

8. **기타 속성** (따로 언급하지 않은 속성들)

9. **이벤트(Events)** (컴포넌트 이벤트 리스너를 지정하는 속성)
  - `v-on`

10. **내용(Content)** (엘리먼트의 내용을 덮어쓰는 속성)
  - `v-html`
  - `v-text`



### 컴포넌트/인스턴스 옵션간 빈 줄 <sup data-p="c">추천함</sup>

**You may want to add one empty line between multi-line properties, particularly if the options can no longer fit on your screen without scrolling.**

When components begin to feel cramped or difficult to read, adding spaces between multi-line properties can make them easier to skim again. In some editors, such as Vim, formatting options like this can also make them easier to navigate with the keyboard.

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue: function () {
    // ...
  },

  inputClasses: function () {
    // ...
  }
}
```

``` js
// No spaces are also fine, as long as the component
// is still easy to read and navigate.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue: function () {
    // ...
  },
  inputClasses: function () {
    // ...
  }
}
```
{% raw %}</div>{% endraw %}



### 싱글 파일 컴포넌트 최상위 엘리먼트 순서 <sup data-p="c">추천함</sup>

**[Single-file components](../guide/single-file-components.html) should always order `<script>`, `<template>`, and `<style>` tags consistently, with `<style>` last, because at least one of the other two is always necessary.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

``` html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}



## 우선순위 D 규칙: 주의요함 (잠재적인 위험을 내포한 패턴)



### `key`가 없는 `v-if`/`v-if-else`/`v-else` <sup data-p="d">주의요함</sup>

**It's usually best to use `key` with `v-if` + `v-else`, if they are the same element type (e.g. both `<div>` elements).**

By default, Vue updates the DOM as efficiently as possible. That means when switching between elements of the same type, it simply patches the existing element, rather than removing it and adding a new one in its place. This can have [unintended side effects](https://jsfiddle.net/chrisvfritz/bh8fLeds/) if these elements should not actually be considered the same.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<div v-if="error">
  Error: {{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<div
  v-if="error"
  key="search-status"
>
  Error: {{ error }}
</div>
<div 
  v-else 
  key="search-results"
>
  {{ results }}
</div>
```

``` html
<p v-if="error">
  Error: {{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}



### `scoped`에서 엘리먼트 셀렉터 사용 <sup data-p="d">주의요함</sup>

**Element selectors should be avoided with `scoped`.**

Prefer class selectors over element selectors in `scoped` styles, because large numbers of element selectors are slow.

{% raw %}
<details>
<summary>
  <h4>자세한 설명</h4>
</summary>
{% endraw %}

To scope styles, Vue adds a unique attribute to component elements, such as `data-v-f3f3eg9`. Then selectors are modified so that only matching elements with this attribute are selected (e.g. `button[data-v-f3f3eg9]`).

The problem is that large numbers of [element-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `button[data-v-f3f3eg9]`) will be considerably slower than [class-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `.btn-close[data-v-f3f3eg9]`), so class selectors should be preferred whenever possible.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` html
<template>
  <button>X</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### 부모-자식간 의사소통 <sup data-p="d">주의요함</sup>

**Props and events should be preferred for parent-child component communication, instead of `this.$parent` or mutating props.**

An ideal Vue application is props down, events up. Sticking to this convention makes your components much easier to understand. However, there are edge cases where prop mutation or `this.$parent` can simplify two components that are already deeply coupled.

The problem is, there are also many _simple_ cases where these patterns may offer convenience. Beware: do not be seduced into trading simplicity (being able to understand the flow of your state) for short-term convenience (writing less code).

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: '<input v-model="todo.text">'
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeTodo () {
      var vm = this
      vm.$parent.todos = vm.$parent.todos.filter(function (todo) {
        return todo.id !== vm.todo.id
      })
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}



### 전역 상태 관리 <sup data-p="d">주의요함</sup>

**전역 상태 관리에는 `this.$root` 나 글로벌 이벤트 버스(global event bus)보다는 [Vuex](https://github.com/vuejs/vuex)를 이용하는 것이 좋습니다.**

전역 상태 관리에 `this.$root`나 [글로벌 이벤트 버스](https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced)를 이용하는 것은 아주 단순한 경우에는 편리할 수 있지만 대부분의 Application에는 부적절합니다. Vuex는 상태를 관리하는 중앙 저장소를 제공하는 것만이 아니라 상태 변화를 체계화하고, 추적하며, 디버깅을 용이하게 하는 도구들을 제공합니다.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### 나쁨

``` js
// main.js
new Vue({
  data: {
    todos: []
  },
  created: function () {
    this.$on('remove-todo', this.removeTodo)
  },
  methods: {
    removeTodo: function (todo) {
      var todoIdToRemove = todo.id
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== todoIdToRemove
      })
    }
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### 좋음

``` js
// store/modules/todos.js
export default {
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

``` html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: mapActions(['removeTodo'])
}
</script>
```
{% raw %}</div>{% endraw %}



{% raw %}
<script>
(function () {
  var enforcementTypes = {
    none: '<span title="There is unfortunately no way to automatically enforce this rule.">self-discipline</span>',
    runtime: 'runtime error',
    linter: '<a href="https://github.com/vuejs/eslint-plugin-vue#eslint-plugin-vue" target="_blank">plugin:vue/recommended</a>'
  }
  Vue.component('sg-enforcement', {
    template: '\
      <span>\
        <strong>Enforcement</strong>:\
        <span class="style-rule-tag" v-html="humanType"/>\
      </span>\
    ',
    props: {
      type: {
        type: String,
        required: true,
        validate: function (value) {
          Object.keys(enforcementTypes).indexOf(value) !== -1
        }
      }
    },
    computed: {
      humanType: function () {
        return enforcementTypes[this.type]
      }
    }
  })

  // new Vue({
  //  el: '#main'
  // })
})()
</script>
{% endraw %}
