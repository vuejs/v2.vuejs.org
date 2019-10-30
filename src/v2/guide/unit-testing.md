---
title: 단위 테스팅
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/) 는 [Jest](https://github.com/facebook/jest), 혹은 [Mocha](https://mochajs.org/) 를 사용해 어려운 설정 없이 유닛테스트를 진행하기 위한 옵션이 있습니다. 커스텀 셋업의 가이드가 되는 [Vue Test Utils](https://vue-test-utils.vuejs.org/)도 있습니다.


## 간단한 테스트하기

테스팅을 위한 코드 구성 측면에서, 특별히 추가로 해야할 작업이 없습니다. 원시 옵션들만 내보내면 됩니다.

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```

해당 컴포넌트를 테스트할 때 Vue와 함께 options의 객체를 Import해 테스트를 실행합니다. (여기서는 예로 Jasmine/Jest스타일의 `expect`어서션을 사용하고 있습니다).

``` js
// Vue 및 테스트할 컴포넌트 가져오기
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Jasmine 2.0 테스트는 다음과 같습니다.
// 원하는 테스트 러너 / 테스트 라이브러리를 사용하십시오
describe('MyComponent', () => {
  // 원시 컴포넌트 옵션을 검사합니다.
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // 원시 컴포넌트 옵션에서 함수 결과를 테스트합니다.
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // 마운트 할 때 컴포넌트 인스턴스를 검사합니다.
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // 인스턴스를 마운트하고 출력된 결과를 검사합니다.
  it('renders the correct message', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## 테스트 가능한 컴포넌트 작성

많은 컴포넌트 렌더링 출력은 주로 받은 props에 의해 결정됩니다. 사실, 컴포넌트의 렌더링 출력이 그 props에만 의존하는 경우 다른 전달인자를 가지는 순수한 함수의 반환 값을 검사하는 것과 마찬가지로 테스트하기가 매우 쉽습니다. 아래 예를 보십시오.

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

`propsData` 옵션을 사용해 다른 props로 렌더링 출력을 지정할 수 있습니다.

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// 렌더링 된 텍스트를 마운트하고 반환하는 헬퍼 함수
function getRenderedText (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('renders correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

## 비동기 업데이트 검사

Vue는 [DOM 업데이트를 비동기적으로 수행](reactivity.html#Async-Update-Queue)하기 때문에, 상태 변경으로 인한 DOM 업데이트에 대한 검사는 `Vue.nextTick` 콜백에서 수행해야 합니다.

``` js
// 상태 갱신 후 생성된 HTML을 검사합니다.
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // DOM 변경을 검사하기 전에 상태가 변경된 후 "tick"을 기다립니다.
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

우리는 다른 제약 조건 (예: 자식 컴포넌트를 무시하는 얕은 렌더링)을 사용하여 컴포넌트를 렌더링 하는 것이 훨씬 간단하고 결과를 나타낼 수 있는 공통 테스트 모음을 개발할 계획 입니다.

Vue의 유닛 테스트에 관한 상세 정보는 [Vue Test Utils](https://vue-test-utils.vuejs.org/) 와 쿡북 엔트리 [unit testing vue components](https://vuejs.org/v2/cookbook/unit-testing-vue-components.html)를 확인해주세요.
