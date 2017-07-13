---
title: 반응형에 대해 깊이 알아보기
type: guide
order: 12
---

우리는 대부분의 기본적인 내용을 다루었습니다. 이제 깊이 알아 볼 때 입니다! Vue의 가장 두드러진 특징 중 하나는 눈을 어지럽히지 않는 반응형 시스템 입니다. 모델은 단순한 JavaScript 객체 입니다. 수정하면 뷰가 갱신됩니다. 이것은 상태 관리를 매우 간단하고 직관적으로 만듭니다. 이를 이해하는 것은 매우 중요합니다. 이 섹션에서는 Vue의 반응 시스템에 대한 하위 수준의 세부 정보를 살펴 보겠습니다.

## 변경 내용을 추적하는 방법


일반 JavaScript 객체를 `data` 옵션으로 Vue 인스턴스에 전달하면 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)를 이용해 Vue는 모든 속성을 거쳐 getter / setter 변환합니다. 이것은 ES5 전용이며 하위 버전에 없는 기능이기 때문에 Vue가 IE8 이하를 지원하지 않습니다.

getter / setter 는 사용자에게는 보이지 않으나 속성에 액세스 하거나 수정할 때 Vue가 종속성 추적 및 변경 알림을 수행할 수 있습니다. 한가지 주의 사항은 변환된 데이터 객체가 기록될 때 브라우저가 getter / setter 형식을 다르게 처리하므로 친숙한 인터페이스를 사용하기 위해  [vue-devtools](https://github.com/vuejs/vue-devtools)를 설치하는 것이 좋습니다.

모든 컴포넌트 인스턴스에는 해당 **watcher** 인스턴스가 있으며, 이 인스턴스는 컴포넌트가 종속적으로 렌더링되는 동안 "수정"된 모든 속성을 기록합니다. 나중에 종속적인 setter가 트리거 되면 watcher에 알리고 컴포넌트가 다시 렌더링 됩니다.

![종석성 사이클](/images/data.png)

## 변경 감지 경고

최신 JavaScript의 한계 (그리고 `Object.observe`의 포기)로 인해 Vue는 **속성의 추가 제거를 감지할 수 없습니다.** Vue는 인스턴스 초기화 중에 getter / setter 변환 프로세스를 수행하기 때문에 `data` 객체에 속성이 있어야 Vue가 이를 변환하고 응답할 수 있습니다.

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` 은 이제 반응적입니다.

vm.b = 2
// `vm.b` 은 이제 반응적이지 않습니다.
```

Vue는 이미 만들어진 인스턴스에 새로운 루트 수준의 반응 속성을 동적으로 추가하는 것을 허용하지 않습니다. 그러나 `Vue.set(object, key, value)` 메소드를 사용하여 중첩 된 객체에 반응성 속성을 추가 할 수 있습니다.

``` js
Vue.set(vm.someObject, 'b', 2)
```

`Vm.$set` 인스턴스 메소드를 사용할 수도 있습니다. 이 메소드는 전역 `Vue.set` 에 대한 별칭입니다.

``` js
this.$set(this.someObject, 'b', 2)
```

때로는 예를 들어 `Object.assign()` 또는 `_.extend()`를 사용하여 기존 객체에 많은 속성을 할당 할 수 있습니다. 그러나 객체에 추가 된 새 속성은 변경 내용을 트리거하지 않습니다. 이 경우 원본 객체와 mixin 객체의 속성을 사용하여 새 객체를 만듭니다.

``` js
// `Object.assign(this.someObject, { a: 1, b: 2 })` 대신에
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

[리스트 렌더링 섹션](list.html#Caveats)에 앞서 알아보아야 할 배열 관련 참고사항이 있습니다.

## 반응형 속성 선언하기

Vue는 루트 수준의 반응성 속성을 동적으로 추가 할 수 없으므로 모든 루트 수준의 반응성 데이터 속성을 빈 값으로라도 초기에 선언하여 Vue 인스턴스를 초기화해야합니다.

``` js
var vm = new Vue({
  data: {
    // 빈 값으로 메시지를 선언 합니다.
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// 나중에 `message`를 설정합니다.
vm.message = 'Hello!'
```

data 옵션에`message`를 선언하지 않으면 Vue는 렌더 함수가 존재하지 않는 속성에 접근하려고 한다는 경고를합니다.

이 제한 사항에는 기술적인 이유가 있습니다. 종속성 추적 시스템에서 엣지 케이스 클래스를 제거하고 Vue 인스턴스를 유형 검사 시스템으로 더 멋지게 만듭니다. 그러나 코드 유지 관리 측면에서도 중요한 고려 사항이 있습니다. `data` 객체는 컴포넌트 상태에 대한 스키마와 같습니다. 모든 반응 속성을 미리 선언하면 나중에 다시 방문하거나 다른 개발자가 읽을 때 구성 요소 코드를 더 쉽게 이해할 수 있습니다.

## 비동기 갱신 큐

아직 눈치 채지 못했는지 모르겠지만, Vue는 DOM 업데이트를 **비동기식으로 수행합니다**. 데이터 변경이 관찰 될 때마다 큐를 열고 같은 이벤트 루프에서 발생하는 모든 데이터 변경을 버퍼링합니다. 같은 감시자가 여러 번 트리거되면 대기열로 한 번만 푸시됩니다. 이 버퍼 된 중복 제거는 불필요한 계산과 DOM 조작을 피하는 데 중요합니다. 그런 다음, 다음 이벤트 루프 "tick"에서 Vue는 대기열을 비우고 실제 (이미 중복 제거 된) 작업을 수행합니다. 내부적으로 Vue는 비동기 큐를 위해 네이티브 `Promise.then` 와 `MutationObserver`를 시도하고 `setTimeout (fn, 0)`으로 돌아갑니다.

예를 들어,`vm.someData = 'new value'`를 설정하면, 컴포넌트는 즉시 재 렌더링되지 않습니다. 큐가 플러시 될 때 다음 "tick" 에서 업데이트됩니다. 대개의 경우 이 작업을 신경 쓸 필요는 없지만 업데이트 후 DOM 상태에 의존하는 작업을 수행하려는 경우 까다로울 수 있습니다. Vue.js는 일반적으로 개발자가 "데이터 중심"방식으로 생각하고 DOM을 직접 만지지 않도록 권장하지만 때로는 건드려야 할 수도 있습니다. Vue.js가 데이터 변경 후 DOM 업데이트를 마칠 때까지 기다리려면 데이터가 변경된 직후에 `Vue.nextTick (콜백)`을 사용할 수 있습니다. 콜백은 DOM이 업데이트 된 후에 호출됩니다.

예:

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 데이터  변경
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

또한 `vm.$nextTick()` 인스턴스 메소드가 있습니다. 이는 내부 컴포넌트들에 특히 유용합니다. 왜냐하면 전역 `Vue`가 필요없고 콜백의 `this` 컨텍스트가 자동으로 현재 Vue 인스턴스에 바인드될 것이기 때문입니다

``` js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: '갱신 안됨'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = '갱신됨'
      console.log(this.$el.textContent) // => '갱신 안됨'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => '갱신됨'
      })
    }
  }
})
```
