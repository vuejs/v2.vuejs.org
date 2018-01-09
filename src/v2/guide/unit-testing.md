---
title: 단위 테스팅
type: guide
order: 403
---

## 설치와 사용 도구

모듈 기반 빌드 시스템과 호환되는 모든 것과 잘 작동하지만 특정한 권장사항을 찾으려면 [Karma](http://karma-runner.github.io) 테스트 러너를 사용해 보십시오. [Webpack](https://github.com/webpack/karma-webpack) 과 [Browserify](https://github.com/Nikku/karma-browserify)를 포함한 많은 커뮤니티 플러그인을 가지고 있습니다. 자세한 설정은 [Webpack](https://github.com/vuejs-templates/webpack/blob/master/template/test/unit/karma.conf.js)과 [Browserify](https://github.com/vuejs-templates/browserify/blob/master/template/karma.conf.js)에 대한 Karma 구성 예제를 통해 각 프로젝트의 관련 문서를 참조하십시오. 시작하는데 도움이 될 것입니다.

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

해당 컴포넌트를 테스트할 때 Vue와 함께 객체를 가져와 공통된 많은 테스트를 작성하면 됩니다.

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
// 상태 갱신 후 생선된 HTML을 검사합니다.
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
