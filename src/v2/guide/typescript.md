---
title: TypeScript 지원
type: guide
order: 403
---

> [Vue CLI](https://cli.vuejs.org) 는 TypeScript 툴링 지원을 포함하여 제공됩니다.

## NPM 패키지 공식 선언

A static type system can help prevent many potential runtime errors, especially as applications grow. That's why Vue ships with [official type declarations](https://github.com/vuejs/vue/tree/dev/types) for [TypeScript](https://www.typescriptlang.org/) - not only in Vue core, but also for [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) and [vuex](https://github.com/vuejs/vuex/tree/dev/types) as well.

Since these are [published on NPM](https://cdn.jsdelivr.net/npm/vue/types/), and the latest TypeScript knows how to resolve type declarations in NPM packages, this means when installed via NPM, you don't need any additional tooling to use TypeScript with Vue.

## 추천 설정

``` js
// tsconfig.json
{
  "compilerOptions": {
    // Vue의 브라우저 지원과 같습니다.
    "target": "es5",
    // 이러면 `this`에 대한 데이터 속성에 대한 더 엄격한 추측이 가능합니다.
    "strict": true,
    // webpack 2 이상 또는 rollup을 사용하여 트리셰이킹을 하려면,
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

컴포넌트 메소드에서 `this`의 타입 체크를 활용하려면 `strict: true` (또는 적어도 `strict` 플래그의 일부인 `noImplicitThis: true`)를 포함해야합니다. 그렇지 않으면 항상 `any` 타입으로 처리됩니다.

[TypeScript 컴파일러 옵션 문서](https://www.typescriptlang.org/docs/handbook/compiler-options.html)에서 자세한 내용을 확인하세요

## 개발시 도구 활용

### 프로젝트 생성

[Vue CLI 3](https://github.com/vuejs/vue-cli) can generate new projects that use TypeScript. To get started:

```bash
# 1. Install Vue CLI, if it's not already installed
npm install --global @vue/cli

# 2. Create a new project, then choose the "Manually select features" option
vue create my-project-name
```

### 에디터 서포트

TypeScript를 사용해 Vue를 개발하려면 [Visual Studio Code](https://code.visualstudio.com/)를 사용하세요. TypeScript에 대한 기본적인 지원이 포함되어 있습니다.

[싱글 파일 컴포넌트](./single-file-components.html) (SFCs)를 사용하는 경우 훌륭한 [Vetur extension](https://github.com/vuejs/vetur)를 사용해 TypeScript 유추를 제공합니다. 싱글 파일 컴포넌트 및 기타 많은 훌륭한 기능을 제공합니다.

또한 [WebStorm](https://www.jetbrains.com/webstorm/)은 타입스크립트와 Vue.js를 모두 지원합니다.

## 기본 사용법

Vue 컴포넌트 옵션안에서 TypeScript를 사용하려면 `Vue.component` 또는 `Vue.extend`로 컴포넌트를 정의해야합니다.

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // 타입 유추기능 사용
})

const Component = {
  // 이 방식은 타입 유추가 되지 않습니다.
  // TypeScript가 Vue 컴포넌트에 대한 옵션을 알 수 없기 때문입니다.
}
```

## 클래스 스타일 Vue 컴포넌트

컴포넌트를 선언할 때 클래스 기반 API를 선호하는 경우 공식 [vue-class-component](https://github.com/vuejs/vue-class-component) 데코레이터를 사용할 수 있습니다.

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

## 플러그인과 함께 사용하기 위한 타입 확장

플러그인은 Vue에 전역 혹은 인스턴스 property와 컴포넌트 옵션을 추가할 수 있습니다. 이러한 경우 TypeScript에서 플러그인을 컴파일하려면 유형 선언이 필요합니다. 다행스럽게도 TypeScript에는 이미 존재하는 타입을 보충하기 위한 [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)이라는 기능이 있습니다.

예를 들어, instance property인 `$myProperty`를 `string` 타입으로 선언하고자 하는 경우:

``` ts
// 1. 'vue'를 보충된 타입 선언 전에 import해야 합니다.
import Vue from 'vue'

// 2. 보충하고자 하는 타입이 있는 파일을 지정하세요.
//    Vue의 constructor type은 types/vue.d.ts에 있습니다.
declare module 'vue/types/vue' {
  // 3. Vue에 보강할 내용을 선언하세요.
  interface Vue {
    $myProperty: string
  }
}
```

위의 코드를 선언 파일 형태로 (`my-property.d.ts` 처럼) include하면, `$myProperty`를 Vue 인스턴스 내에서 사용할 수 있습니다.

```ts
var vm = new Vue()
console.log(vm.$myProperty) // This should compile successfully
```

추가적인 전역 property나 컴포넌트 옵션을 선언할 수도 있습니다.

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // `VueConstructor` 인터페이스에서
  // 전역 속성을 선언할 수 있습니다
  interface VueConstructor {
    $myGlobal: string
  }
}

// ComponentOptions는 types/options.d.ts에 선언되어 있습니다.
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

위 선언들을 통해 다음과 같은 코드를 컴파일할 수 있게 됩니다.

```ts
// 전역 property
console.log(Vue.$myGlobal)

// 추가적인 component option
var vm = new Vue({
  myOption: 'Hello'
})
```

## 반환 타입 어노테이팅

Vue의 선언 파일의 순환 특성때문에 TypeScript는 특정 메서드의 타입을 추론하는데 어려움이 있을 수 있습니다. 이런 이유로 `render`와 같은 메소드와 `computed`의 메소드에 리턴 타입에 어노테이팅이 필요가 있습니다.

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    // `this` 때문에 리턴 타입에 어노테이션이 필요합니다.
    greet (): string {
      return this.msg + ' world'
    }
  },
  computed: {
    // 어노테이션 필요
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement`가 유추되었지만 `render`는 리턴 타입을 필요로 합니다.
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

타입 유추를 찾거나 멤버 자동완성이 효과가 없다면 특정 방법에 주석을 달아 이러한 문제를 해결하는데 도움이 될 수 있습니다. `--noImplicitAny` 옵션을 사용하면 많은 주석을 달지 않은 메소드를 찾을 수 있습니다.
