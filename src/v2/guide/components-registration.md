---
title: 컴포넌트 등록
type: guide
order: 101
---

> 이 페이지는 여러분이 이미 [컴포넌트 기초](components.html)를 읽었다고 가정하고 쓴 내용입니다. 컴포넌트가 처음이라면 기초 문서를 먼저 읽으시기 바랍니다.

## 컴포넌트 이름

컴포넌트를 등록할 때는 항상 이름을 지어줘야 합니다. 예를 들어 우리가 살펴봤던 전역등록은 아래처럼 하죠.

```js
Vue.component('my-component-name', { /* ... */ })
```

컴포넌트의 이름은 `Vue.component`의 첫번째 인자입니다.

컴포넌트에 부여한 이름은 그 컴포넌트를 어디에 쓸 지에 따라 다를 수 있습니다. 컴포넌트를 (스트링 템플릿이나 [싱글파일 컴포넌트](single-file-components.html)로 사용하지 않고) DOM에서 바로 사용할 때는 [W3C 규칙](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)에 따라서 사용자 정의 태그의 이름처럼 쓰는 것을 추천합니다(모두 소문자로 쓰고 단어는 하이픈(-)으로 연결하는 거죠). 이렇게 하면 지금 있거나 앞으로 작성할 HTML 엘리먼트와 충돌하는 것을 피할 수 있습니다.

기타 컴포넌트 이름을 지을 때 숙지할 내용은 [스타일 가이드](../style-guide/#베이스-컴포넌트-이름-매우-추천함)를 참고해주세요.


### 이름 표기법

컴포넌트 이름을 지을 때는 두 가지 방법이 있습니다.


#### 케밥-표기법

```js
Vue.component('my-component-name', { /* ... */ })
```

케밥-표기법으로 컴포넌트를 정의할 때는 사용자 정의 엘리먼트를 부를 때에도 `<my-component-name>`와 같이 반드시 케밥-표기법을 사용해야 합니다.


#### 파스칼표기법

```js
Vue.component('MyComponentName', { /* ... */ })
```

파스칼표기법으로 컴포넌트를 정의할 때는 자용자 정의 엘리먼트를 부를 때 두 가지 표기법 모두 사용할 수 있습니다. 즉 `<my-component-name>`와 `<MyComponentName>` 모두 괜찮습니다. 단, DOM에 바로 쓸 때는 케밥-표기법 이름만 가능합니다.


## 전역 등록

지금까지 우리는 `Vue.component`를 이용해서만 컴포넌트를 만들었습니다.

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

이런 컴포넌트를 **전역 등록**되었다고 합니다. 즉 어떤 루트 Vue 인스턴스(`new Vue`)에서도 사용할 수 있는 거죠.

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

이렇게 등록한 컴포넌트들은 모든 하위 컴포넌트에도 사용가능합니다. 즉 위의 3개 컴포넌트들은 _각각의 컴포넌트 안에서도_ 사용할 수 있습니다.


## 지역 등록

전역 등록이 썩 좋기만 한 건 아닙니다. 예를 들어 웹팩같은 빌드 시스템을 사용하고 모든 컴포넌트를 전역 등록했으면 설사 어떤 컴포넌트를 더 이상 사용하지 않더라도 최종 빌드에는 들어가 있게 됩니다. 사용자가 내려받아야 하는 자바스크립트의 양이 불필요하게 커지는 거죠.

이 경우에 컴포넌트를 일반 자바스크립트 객체로 정의할 수 있습니다.

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

그러면 사용할 컴포넌트들만 `components` 옵션을 통해 쓸 수 있습니다.

```js
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

`components` 객체의 각 속성에서 키가 커스텀 엘리먼트의 이름이 되고 밸류가 사용할 컴포넌트 객체를 지정합니다.

**지역 등록된 컴포넌트는 하위컴포넌트에서는 사용이 _불가능하다_**는 점을 유의해야 합니다. 예를 들어 `ComponentA`를 `ComponentB`에서 쓰고 싶다면 아래와 같이 해야 합니다.

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

바벨이나 웹팩을 이용해서 ES2015를 적용하고 있다면 싱글파일 컴포넌트를 이용해서 이렇게 할 수도 있습니다.

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

ES2015 이상에서는 객체 내의 `components` 옵션에서 `ComponentA: ComponentA`라고 하지 않고 `ComponentA`라고만 해도 됩니다. 즉 키로 아래의 두 가지가 모두 가능합니다.(역자 주: `component-a: ComponentA`, `ComponentA: ComponentA`, `ComponentA`가 모두 가능합니다.)

- 템플릿에서 사용할 사용자정의 엘리먼트 이름
- 컴포넌트 옵션에 들어갈 변수명


## 모듈 시스템

`import`/`require`를 이용한 모듈 시스템을 쓰지 않으면 이번 내용은 넘어가도 괜찮습니다. 만약 모듈 시스템을 쓴다면 특별한 소개와 팁을 드리도록 할게요.


### 모듈 시스템에서 컴포넌트를 다른 컴포넌트에 지역적으로 등록하기

지금 읽고 있다면 당신은 모듈 시스템을 쓴다는 뜻이겠죠. 바벨이나 웹팩같은 것과 함께 말입니다. 이 경우에는 `components` 디렉토리를 만들고 각 컴포넌트들을 그 자체로 하나의 파일에 관리하는 것을 추천합니다.

그러면 어떤 컴포넌트를 다른 컴포넌트에 지역적으로 등록하기 전에 사용할 컴포넌트를 가져와야 합니다. 예를 들면 `ComponentB.js`나 `ComponentB.vue`같은 파일에서 아래처럼 다른 컴포넌트를 가져오는 거죠.

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

이제 `ComponentA`와 `ComponentC 모두 `ComponentB`의 템플릿에서 사용할 수 있습니다.


### 기본 컴포넌트를 자동으로 전역 등록하기

많은 컴포넌트들은 여기저기서 쓰이고 입력값이나 버튼 하나로 구성될 수도 있습니다. 이런 컴포넌트는 [기본 컴포넌트](../style-guide/#베이스-컴포넌트-이름-매우-추천함)라고 하고 여러 컴포넌트들에서 매우 빈번하게 사용합니다.

그래서 많은 컴포넌트에서 긴 기본 컴포넌트 목록을 보게 되죠.

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

템플릿에서는 좀 더 짧은 마크업을 사용할 수 있습니다.

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

다행히 웹팩을 쓴다면([Vue CLI 3+](https://github.com/vuejs/vue-cli), which uses Webpack internally)을 쓴다면 그 안에 내장하고 있어요) `require.context`를 써서 자주 쓰는 기본 컴포넌트들을 전역 등록할 수 있습니다. 아래의 예시는 어플리케이션의 엔트리 파일(e.g. `src/main.js`)에 기본 컴포넌트들을 전역적으로 불러오는 코드입니다.

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // 컴포넌트들이 있는 폴더
  './components',
  // 하위 폴더까지 포함할 지 여부
  false,
  // 기본 컴포넌트를 찾는데 사용할 정규표현식
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 컴포넌트 설정 가져오기
  const componentConfig = requireComponent(fileName)

  // 컴포넌트의 파스칼표기법 이름 가져오기
  const componentName = upperFirst(
    camelCase(
      // 폴더 위치와 무관하게 파일이름 추출
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 컴포넌트를 전역적으로 등록
  Vue.component(
    componentName,
    // `export default`를 이용한 컴포넌트는 `.default`로 컴포넌트
    // 옵션을 추출하고 그렇지 않은 컴포넌트는 모듈의 루트를 호출
    componentConfig.default || componentConfig
  )
})
```

** 전역 등록은 (`new Vue`로) 루트 Vue 인스턴스가 만들어지기 전에 반드시 이뤄져야 한다는 것**을 기억해주시기 바랍니다. 실제 프로젝트에서 이 패턴이 어떻게 이뤄지는지 [이 예시](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js)를 참고해주세요.
