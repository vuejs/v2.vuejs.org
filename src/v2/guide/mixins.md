---
title: 믹스인
type: guide
order: 301
---

## 기초

Mixins는 Vue 컴포넌트에 재사용 가능한 기능을 배포하는 유연한 방법입니다. mixin 객체는 모든 구성 요소 옵션을 포함 할 수 있습니다. 구성 요소가 mixin을 사용하면 해당 mixin의 모든 옵션이 컴포넌트의 고유 옵션에 "혼합"됩니다.

Example:

``` js
// mixin 객체 생성
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// mixin을 사용할 컴포넌트 정의
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

## 옵션 병합
mixin과 컴포넌트 자체에 중첩 옵션이 포함되어 있으면 적절한 전략을 사용하여 "병합"됩니다. 예를 들어, 같은 이름의 훅 함수가 배열에 병합되어 모든 함수가 호출됩니다. 또한 믹스 인 훅은 컴포넌트 자체의 훅 **이 전에** 호출됩니다.

``` js
var mixin = {
  created: function () {
    console.log('mixin hook called')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('component hook called')
  }
})

// => "mixin hook called"
// => "component hook called"
```

`methods`,`components`,`directives`와 같은 객체 값을 요구하는 옵션은 같은 객체에 병합됩니다. 이러한 객체에 충돌하는 키가있을 경우 컴포넌트의 옵션이 우선 순위를 갖습니다.

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

같은 병합 전략이`Vue.extend()`에서 사용된다는 것에주의하십시오.

## 전역 Mixin

mixin은 전역으로 적용 할 수 있습니다. 주의하세요! mixin을 전역으로 적용하면 이후에 생성 된 **모든 Vue 인스턴스** 에 영향을 미칩니다. 적절히 사용하면 사용자 정의 옵션에 대한 처리 로직을 주입하는 데 사용할 수 있습니다.

``` js
// `myOption` 사용자 정의 옵션을 위한 핸들러 주입
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

<p class="tip">글로벌 mixin은 써드파티 컴포넌트를 포함하여 생성 된 모든 단일 Vue 인스턴스에 영향을 주기 때문에 적게 이용하고 신중하게 사용하십시오. 대부분의 경우 위 예제에서와 같이 사용자 지정 옵션 처리에만 사용해야합니다. 중복 적용을 피하기 위해 [Plugins](plugins.html)로 제공하는 것도 좋은 생각입니다.</p>

## 사용자 정의 옵션 병합 전략

사용자 지정 옵션을 병합 할 때 기본 옵션을 사용하면 기존 값을 덮어 씁니다. 커스텀 로직을 사용해 커스텀 옵션을 병합하려면,`Vue.config.optionMergeStrategies`에 함수를 추가 할 필요가 있습니다.

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return 병합된 값
}
```

대부분의 객체 기반 옵션에서 `methods`에서 사용한 것과 같은 전략을 간단하게 사용할 수 있습니다 :

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

더 고급 예제는 [Vuex](https://github.com/vuejs/vuex)의 1.x 병합 전략에서 확인하실 수 있습니다.

``` js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
  if (!toVal) return fromVal
  if (!fromVal) return toVal
  return {
    getters: merge(toVal.getters, fromVal.getters),
    state: merge(toVal.state, fromVal.state),
    actions: merge(toVal.actions, fromVal.actions)
  }
}
```
