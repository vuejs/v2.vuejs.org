---
title: TypeScript 지원
type: guide
order: 25
---

## Webpack 2 사용자를 위한 2.2.0이상 버전의 타입스크립트의 중요 변경사항

Vue 2.2.0+에서 우리는 ES모듈로 노출 된 dist파일을 Webpack 2에서 기본적으로 사용하기 시작합니다.
불행히도 TypeScript + webpack 2를 사용하면 `import Vue = require('vue')`는 이제 Vue 자체 대신 ES 모듈 객체를 반환합니다.

[NPM에 배포](https://unpkg.com/vue/types/) 되어 있기 때문에, Vue로 선언을 자동으로 가져오므로 `Typings`와 같은 외부 도구조차 필요하지 않습니다. 즉, 더 추가할것이 별로 없습니다.
## TypeScript와 Webpack 2 사용자에게 중요한 2.2버전의 변화

Vue 2.2에서 ES 모듈로 내보내진 dist파일을 webpack 2를 기본적으로 사용하기 위해 도입했습니다. 안타깝게도 TypeScript + webpack 2에서 `import Vue = require ('vue ')`가 이제는 Vue 파일 자체를 반환하지 않고 조합된 ES 모듈 객체를 반환합니다.

미래에 모든 공식 선언문을 ES 스타일로 옮길 계획입니다. 미래를 위한 설정을 위해 [구성에 관한 권장사항](#Recommended-Configuration)을 참조하십시오.

## NPM 패키지 공식 선언

정적 타이핑 시스템에서 런타임에러를 방지해야 했습니다. 특히 애플리케이션이 점점 커지는 경우에 발생할 수 있습니다.
이는 TypeScript를 위해 [공식 타입 선언](https://github.com/vuejs/vue/tree/dev/types)을 Vue에 포함한 이유입니다. Vue 코어뿐 아니라 [vue-router](https://github.com/vuejs/vue-router/tree/dev/types)와 [vuex](https://github.com/vuejs/vuex/tree/dev/types)도 마찬가지 입니다.

[NPM에 배포](https://unpkg.com/vue/types/)하였으며 TypeScript를 NPM을 통해 설치하면 Vue와 함께 사용하는데 필요한 다른 것들이 필요하지 않습니다.

## 구성에 관한 권장 사항

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ... 다른 옵션 생략
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015.promise"
    ]
  }
}
```

`allowSyntheticDefaultImports`을 사용하면 다음과 같이 쓸 수 있습니다.

``` js
import Vue = require('vue')
```

대신 아래와 같이 씁니다.

``` js
import Vue from 'vue'
```


이전의 (ES 모듈 구문)은 권장하는 일반 ES 사용법과 일치하기 때문에 앞으로는 모든 공식 선언을 ES 스타일의 내보내기를 사용하도록 계획 중 입니다.

또한 webpack 2와 함께 TypeScript를 사용하는 경우 다음을 권장합니다.

``` js
{
  "compilerOptions": {
    // ... 다른 옵션 생략
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

이렇게하면 TypeScript에서 ES 모듈 가져오기 구문을 그대로 남겨두고 webpack 2가 ES 모듈 기반의 트리 셰이킹을 활용할 수 있게 만듭니다.

[TypeScript 컴파일러 옵션 문서](https://www.typescriptlang.org/docs/handbook/compiler-options.html)에서 자세한 내용을 확인하세요

## Vue의 타입 정의

Vue의 타입정의는 많은 유용한 [타입 정의](https://github.com/vuejs/vue/blob/dev/types/index.d.ts)를 내보내기할 수 있습니다. 예를 들어, 내보내기한 컴포넌트 옵션 객체에 주석(annotate)를 하려면 (예 :`.vue` 파일의 경우)

``` ts
import Vue, { ComponentOptions } from 'vue'

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as ComponentOptions<Vue>
```

## 고전적인 스타일의 Vue 컴포넌트

Vue 컴포넌트 옵션은 타입에 대해 쉽게 주석을 추가할 수 있습니다.

``` ts
import Vue, { ComponentOptions }  from 'vue'

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
} as ComponentOptions<MyComponent>
```

안타깝게도, 약간의 제약 사항이 있습니다:

- __TypeScript는 Vue의 API에서 모든 타입을 유추할 수 없습니다.__ 예를 들어 `data` 함수에서 반환 된 `message` 속성이 `MyComponent` 인스턴스에 추가된다는 것을 모릅니다. 즉, 만약 number 나 boolean 값을 `message`에 대입하면, linter와 컴파일러는 문자열이어야 한다는 판단을 하여 오류를 발생시킬 수 없습니다.

- 위의 제약 사항 때문에 이와 같은 __주석이 장황해 질 수 있습니다.__ TypeScript는 이 경우, 타입을 추론할 수 없기 때문에 수동으로 `message`를 문자열로 선언해야하는 유일한 이유가 있습니다.

다행히 [vue-class-component](https://github.com/vuejs/vue-class-component)는 이 두 가지 문제를 모두 해결할 수 있습니다. 공식 컴패니언 라이브러리로, 컴포넌트를 네이티브 JavaScript 클래스로 선언할 수있게 해주며, `@Component` 데코레이터를 사용합니다. 예를 들어 위의 컴포넌트를 다시 작성해 보겠습니다.

``` ts
import Vue from 'vue'
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
