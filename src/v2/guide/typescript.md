---
title: TypeScript 지원
type: guide
order: 25
---

## 공식 선언 파일

정적 타이핑 시스템은 특히 애플리케이션이 커짐에 따라 생기는 많은 잠재적 런타임 오류를 예방할 수 있습니다. 이것이 Vue가 [TypeScript](https://www.typescriptlang.org/)에 대해 [공식 타입 선언](https://github.com/vuejs/vue/tree/dev/types)을 제공하는 이유입니다. Vue 코어뿐 아니라 [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types)와 [Vuex](https://github.com/vuejs/vuex/tree/dev/types)도 마찬가지입니다.

[NPM에 배포](https://unpkg.com/vue/types/) 되어 있기 때문에, Vue로 선언을 자동으로 가져오므로 `Typings`와 같은 외부 도구조차 필요하지 않습니다. 즉, 더 추가할것이 별로 없습니다.

``` ts
import Vue = require('vue')
```

<<<<<<< HEAD
그런 다음 모든 메소드, 특성 및 매개 변수의 타입을 검사합니다. 예를 들어, `template` 컴포넌트 옵션을 `tempate` (`l`이 없음)으로 잘못 입력하면, TypeScript 컴파일러는 컴파일시 오류 메시지를 출력합니다. [Visual Studio Code](https://code.visualstudio.com/)와 같은 TypeScript를 사용할 수 있는 에디터를 사용하는 경우 컴파일 전에 이러한 에러를 발견할 수도 있습니다.
=======
<p class="tip">In Vue 2.2.0 we introduced dist files exposed as ES modules, which will be used by default by webpack 2. However, this means if you are using TypeScript with webpack 2, `import Vue = require('vue')` will return an ES module object instead of Vue itself.

In the near future, we will update all core typings to use ES-style exports so there usage will be identical to importing ES modules; before these changes land, the temporary workaround is configuring webpack to alias `vue` back to `vue/dist/vue[.runtime].common.js`. You will also need to do the same for `vue-router` and `vuex` if you are using them.</p>

Then all methods, properties, and parameters will be type checked. For example, if you misspell the `template` component option as `tempate` (missing the `l`), the TypeScript compiler will print an error message at compile time. If you're using an editor that can lint TypeScript, such as [Visual Studio Code](https://code.visualstudio.com/), you'll even be able to catch these errors before compilation:
>>>>>>> vuejs/master

![Visual Studio Code의 타입 에러](/images/typescript-type-error.png)

### 컴파일 옵션

Vue의 선언 파일에는 `--lib DOM, ES2015.Promise` [컴파일러 옵션](https://www.typescriptlang.org/docs/handbook/compiler-options.html)이 필요합니다. 이 옵션을 `tsc` 커맨드에 전달하거나`tsconfig.json` 파일에 해당 옵션을 추가 할 수 있습니다.

### Vue의 타입 선언에 접근하기

자신의 코드에 Vue 타입을 주석으로 추가하려면 Vue의 내보낸 객체에서 해당 코드에 액세스 할 수 있습니다. 예를 들어, 내보낸 컴포넌트 옵션 객체 (예: `.vue` 파일)에 주석을 추가하려면,

``` ts
import Vue = require('vue')

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as Vue.ComponentOptions<Vue>
```

## 고전적인 스타일의 Vue 컴포넌트

Vue 컴포넌트 옵션은 타입에 대해 쉽게 주석을 추가할 수 있습니다.

``` ts
import Vue = require('vue')

// 컴포넌트 타입 선언
interface MyComponent extends Vue {
  message: string
  onClick (): void
}

export default {
  template: '<button @click="onClick">Click!</button>',
  data: function () {
    return {
      message: 'Hello!'
    }
  },
  methods: {
    onClick: function () {
      // TypeScript는 `this`가 MyComponent 타입이고
      // `this.message`가 문자열이라고 알고 있습니다.
      window.alert(this.message)
    }
  }

// 내보낸 옵션 객체에 MyComponent 타입으로 명시적인 주석을 추가해야합니다.
} as Vue.ComponentOptions<MyComponent>
```

안타깝게도, 약간의 제약 사항이 있습니다:

- __TypeScript는 Vue의 API에서 모든 타입을 유추할 수 없습니다.__ 예를 들어 `data` 함수에서 반환 된 `message` 속성이 `MyComponent` 인스턴스에 추가된다는 것을 모릅니다. 즉, 만약 number 나 boolean 값을 `message`에 대입하면, linter와 컴파일러는 문자열이어야 한다는 판단을 하여 오류를 발생시킬 수 없습니다.

- 위의 제약 사항 때문에 이와 같은 __주석이 장황해 질 수 있습니다.__ TypeScript는 이 경우, 타입을 추론할 수 없기 때문에 수동으로 `message`를 문자열로 선언해야하는 유일한 이유가 있습니다.

다행히 [vue-class-component](https://github.com/vuejs/vue-class-component)는 이 두 가지 문제를 모두 해결할 수 있습니다. 공식 컴패니언 라이브러리로, 컴포넌트를 네이티브 JavaScript 클래스로 선언할 수있게 해주며, `@Component` 데코레이터를 사용합니다. 예를 들어 위의 컴포넌트를 다시 작성해 보겠습니다.

``` ts
import Vue = require('vue')
import Component from 'vue-class-component'

// @Component 데코레이터는 클래스가 Vue 컴포넌트임을 나타냅니다.
@Component({
  // 모든 컴포넌트 옵션이 이곳에 허용됩니다.
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // 초기 데이터는 인스턴스 속성으로 선언할 수 있습니다.
  message: string = 'Hello!'

  // 컴포넌트 메소드는 인스턴스 메소드로 선언할 수 있습니다.
  onClick (): void {
    window.alert(this.message)
  }
}
```

이렇게 다른 문법을 사용하여 컴포넌트 정의가 더 짧을뿐만 아니라 TypeScript도 명시적인 인터페이스 선언없이 `message` 및 `onClick` 타입을 판단 할 수 있습니다. 이를 통해 계산된 속성, 라이프 사이클 훅 및 렌더링 함수의 타입을 처리 할 수 있습니다. 자세한 사용법은 [vue-class-component 문서](https://github.com/vuejs/vue-class-component#vue-class-component)를 참조하세요.
