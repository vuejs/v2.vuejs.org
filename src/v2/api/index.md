---
type: api
---

## 전역 설정

`Vue.config` 은 Vue의 전역 설정을 가지고 있는 객체입니다. 앱이 실행하기 전에 아래의 속성들을 변경할 수 있습니다:

### silent

- **타입:** `boolean`

- **기본값:** `false`

- **사용방법:**

  ``` js
  Vue.config.silent = true
  ```

  모든 Vue의 로그와 경고를 출력하지 않습니다.

### optionMergeStrategies

- **타입:** `{ [key: string]: Function }`

- **기본값:** `{}`

- **사용방법:**

  ``` js
  Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
    return child + 1
  }

  const Profile = Vue.extend({
    _my_option: 1
  })

  // Profile.options._my_option = 2
  ```

  사용자 정의 병합 전략을 설정할 수 있습니다.

  병합 전략은 부모 및 자식 인스턴스에 정의된 해당 옵션의 값을 첫번째와 두번째 인자로 전달 받습니다. 컨텍스트 Vue 객체는 세번째 인자로 전달 받습니다.

- **참고:** [사용자 정의 병합 전략](../guide/mixins.html#Custom-Option-Merge-Strategies)

### devtools

- **타입:** `boolean`

- **기본값:** `true` (`false` in production builds)

- **사용방법:**

  ``` js
  // Vue를 불러온 후 동기적으로 설정됩니다
  Vue.config.devtools = true
  ```

  [vue-devtools](https://github.com/vuejs/vue-devtools)를 사용할 수 있게 합니다. 개발용 빌드시 `true`, 배포용 빌드는 `false`가 기본 값입니다. `true`로 설정하면 통해 배포용 빌드에서 사용할 수 있습니다.

### errorHandler

- **타입:** `Function`

- **기본값:** `undefined`

- **사용방법:**

  ``` js
  Vue.config.errorHandler = function (err, vm, info) {
    // 에러 핸들링
    // `type`은 Vue의 에러 타입입니다. 예: 라이프사이클 훅
    // 2.2.0+ 이상에서 사용할 수 있습니다
  }
  ```
  컴포넌트 렌더 함수 및 감시자 중에 잡히지 않은 오류에 대한 핸들러를 할당합니다. 핸들러는 오류 및 Vue 인스턴스와 함께 호출됩니다.

  > 2.2.0에서 이 훅은 컴포넌트 라이프사이클 훅의 오류를 캡처합니다. 또한, 이 훅이 `undefined`일 때, 캡쳐 된 에러는 어플리케이션을 실행 불능으로 만드는 대신에 `console.error` 로그를 출력 합니다.

  
  > 2.4.0에서 이 훅은 Vue의 사용자 정의 이벤트 핸들러가 발생하는 에러를 감지합니다.

  > 오류 추적 서비스인 [Sentry](https://sentry.io)에서 [공식 사용 설명서](https://sentry.io/for/vue/)를 제공합니다.

### warnHandler

> 2.4.0 이후 추가됨

- **타입:** `Function`

- **기본값:** `undefined`

- **사용방법:**

  ``` js
  Vue.config.warnHandler = function (msg, vm, trace) {
    // trace는 컴포넌트 계층 구조를 추적합니다.
  }
  ```

  런타임 Vue 경고에 대한 사용자 정의 핸들러를 할당하십시오. 이는 개발 중에만 작동하며 배포시 무시됩니다.

### ignoredElements

- **타입:** `Array<string>`

- **기본값:** `[]`

- **사용방법:**

  ``` js
  Vue.config.ignoredElements = [
    'my-custom-web-component', 'another-web-component'
  ]
  ```

  Vue가 외부에서 정의된 사용자 정의 엘리먼트(예를 들어, Web Components API)를 무시하도록 합니다. 전역 컴포넌트를 등록하지 않았거나, `알수 없는 사용자 정의 엘리먼트`에 대한 경고를 표시합니다.

### keyCodes

- **타입:** `{ [key: string]: number | Array<number> }`

- **기본값:** `{}`

- **사용방법:**

  ``` js
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    // camelCase는 작동하지 않습니다.
    mediaPlayPause: 179,
    // 쌍따옴표로 감싸진 kebab-case를 사용하세요
    "media-play-pause" : 179,
    up: [38, 87]
  }
  ```

  ```html
  <input type="text" @keyup.media-play-pause="method">
  ```

  v-on에 사용자 정의 키를 할당합니다.

### performance

> 2.2.0에서 추가됨

- **타입:** `boolean`
- **기본값:** `false (from 2.2.3)`
- **사용방법:**

  `true`로 설정하면 브라우저 devtool의 타임라인에서 컴포넌트 초기화, 컴파일, 렌더링 및 패치 성능 추적을 활성화할 수 있습니다. 개발 모드 및 [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API를 지원하는 브라우저에서만 작동합니다.


### productionTip

> 2.2.0에서 추가됨

- **타입:** `boolean`

- **기본값:** `true`

- **사용방법:**

  `false`로 설정하면 배포에 대한 팁을 출력하지 않습니다.

## 전역 API

<h3 id="Vue-extend">Vue.extend( options )</h3>

- **전달인자:**
  - `{Object} options`

- **사용방법:**

  Vue 생성자의 "하위 클래스"를 만듭니다. 전달인자는 컴포넌트 옵션을 포함하는 객체이어야 합니다.

  특별히 중요해야 할 경우는 `data` 옵션입니다. `Vue.extend()`와 함께 사용하는 경우 반드시 함수여야 합니다.

  ``` html
  <div id="mount-point"></div>
  ```

  ``` js
  // 생성자를 만듭니다.
  var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
    data: function () {
      return {
        firstName: 'Walter',
        lastName: 'White',
        alias: 'Heisenberg'
      }
    }
  })
  // Profile 인스턴스를 만들고, 엘리먼트에 마운트 합니다.
  new Profile().$mount('#mount-point')
  ```

  아래처럼 출력됩니다:

  ``` html
  <p>Walter White aka Heisenberg</p>
  ```

- **참고:** [컴포넌트](../guide/components.html)

<h3 id="Vue-nextTick">Vue.nextTick( [callback, context] )</h3>

- **전달인자:**
  - `{Function} [callback]`
  - `{Object} [context]`

- **사용방법:**

  다음 DOM 업데이트 사이클 이후 실행하는 콜백을 연기합니다. DOM 업데이트를 기다리기 위해 일부 데이터를 변경한 직후 사용해야 합니다.

  ``` js
  // 데이터를 변경합니다
  vm.msg = 'Hello'
  // 아직 DOM 업데이트가 되지 않았습니다
  Vue.nextTick(function () {
    // DOM이 업데이트 되었습니다
  })
  ```

  > 2.1.0에 새로 생겼습니다: 콜백이 없고, Promise를 지원하는 환경에서 Promise를 반환합니다.

- **참고:** [비동기 갱신 큐](../guide/reactivity.html#Async-Update-Queue)

<h3 id="Vue-set">Vue.set( target, key, value )</h3>

- **전달인자:**
  - `{Object | Array} target`
  - `{string | number} key`
  - `{any} value`

- **반환 값:** 설정한 값.

- **사용방법:**

  객체에 대한 속성을 설정합니다. 객체가 반응형이면, 속성이 반응형 속성으로 만들어지고 뷰 업데이트를 발생시킵니다.
  이는 Vue가 속성 추가를 감지하지 못하는 한계를 넘기 위해 사용합니다

  **객체는 Vue 인스턴스 또는 Vue 인스턴스의 루트 객체일 수 없습니다.**

- **참고:** [반응형에 대해 깊이 알기](../guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( target, key )</h3>

- **전달인자:**
  - `{Object | Array} target`
  - `{string | number} key/index`

  > Only in 2.2.0+: Also works with Array + index.

- **사용방법:**

  객체의 속성을 삭제합니다. 객체가 반응형이면, 뷰 업데이트를 발생시킵니다. 주로 Vue가 속성 삭제를 감지하지 못하는 한계를 극복하기 위해 사용하지만 거의 사용하지 않아야 합니다.
  ** 객체는 Vue 인스턴스 또는 Vue 인스턴스의 루트 데이터 객체일 수 없습니다. **

  > 2.2.0버전 이후에서 배열과 인덱스를 사용할 수 있습니다.

  <p class="tip">목표 객체는 Vue 인스턴스이거나 인스턴스의 루트 데이터 객체일 수 없습니다.</p>

- **참고:** [반응형에 대해 깊이 알기](../guide/reactivity.html)

<h3 id="Vue-directive">Vue.directive( id, [definition] )</h3>

- **전달인자:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **사용방법:**

  전역 디렉티브를 등록하거나 검색합니다.

  ``` js
  // 등록
  Vue.directive('my-directive', {
    bind: function () {},
    inserted: function () {},
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {}
  })

  // 등록 (간단한 함수 디렉티브)
  Vue.directive('my-directive', function () {
    // `bind`와 `update`를 호출합니다.
  })

  // getter, 등록된 지시어의 경우 반환합니다.
  var myDirective = Vue.directive('my-directive')
  ```

- **참고:** [사용자 정의 디렉티브](../guide/custom-directive.html)

<h3 id="Vue-filter">Vue.filter( id, [definition] )</h3>

- **전달인자:**
  - `{string} id`
  - `{Function} [definition]`

- **사용방법:**

  전역 필터를 등록하거나 검색합니다.

  ``` js
  // 등록
  Vue.filter('my-filter', function (value) {
    // 처리된 값을 반환합니다
  })

  // getter, 필터가 등록된 경우 반환합니다
  var myFilter = Vue.filter('my-filter')
  ```

<h3 id="Vue-component">Vue.component( id, [definition] )</h3>

- **전달인자:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **사용방법:**

  전역 컴포넌트를 등록하거나 검색합니다. 등록 시 자동으로 컴포넌트의 `name`을 주어진 `id`로 설정합니다.

  ``` js
  // 확장된 생성자를 등록합니다
  Vue.component('my-component', Vue.extend({ /* ... */ }))

  // 옵션 객체를 등록합니다 (자동으로 Vue.extend를 호출합니다)
  Vue.component('my-component', { /* ... */ })

  // 등록된 컴포넌트를 검색합니다 (항상 생성자를 반환합니다)
  var MyComponent = Vue.component('my-component')
  ```

- **참고:** [컴포넌트](../guide/components.html)

<h3 id="Vue-use">Vue.use( plugin )</h3>

- **전달인자:**
  - `{Object | Function} plugin`

- **사용방법:**

  Vue.js 플러그인을 설치합니다. 플러그인이 Object인 경우 `install` 메소드를 가져야 합니다. 플러그인이 함수 그 자체이면 install 메소드로 처리됩니다. install 메소드는 Vue를 인자로 사용해 호출합니다.

  이 메소드가 동일한 플러그인에서 여러번 호출되면 한번만 설치합니다.

- **참고:** [플러그인](../guide/plugins.html)

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **전달인자:**
  - `{Object} mixin`

- **사용방법:**

  전역으로 mixin을 적용합니다. 생성된 모든 Vue 인스턴스에 영향을 줍니다. 플러그인 작성자가 컴포넌트에 사용자 정의 동작을 주입하는데 플러그인을 사용할 수 있습니다. **애플리케이션 코드**에서는 추천하지 않습니다.

- **See also:** [Global Mixin](../guide/mixins.html#Global-Mixin)

<h3 id="Vue-compile">Vue.compile( template )</h3>

- **전달인자:**
  - `{string} template`

- **사용방법:**

  템플릿 문자열을 렌더링 함수로 컴파일합니다. **전체 빌드에서만 가능합니다.**

  ``` js
  var res = Vue.compile('<div><span>{{ msg }}</span></div>')

  new Vue({
    data: {
      msg: 'hello'
    },
    render: res.render,
    staticRenderFns: res.staticRenderFns
  })
  ```


- **참고:** [렌더 함수](../guide/render-function.html)

<h3 id="Vue-version">Vue.version</h3>

- **상세**: 설치된 Vue 버전을 가져올 수 있습니다. 버전을 이용해서 커뮤니티 플러그인과 컴포넌트 또는 버전마다 다른 처리를 하는데 유용하게 사용할 수 있습니다.

- **사용법**:

```js
var version = Number(Vue.version.split('.')[0])

if (version === 2) {
  // Vue v2.x.x
} else if (version === 1) {
  // Vue v1.x.x
} else {
  // 지원하지 않는 버전의 경우..
}
```

## 옵션 / 데이터

### data

- **타입:** `Object | Function`

- **제한:** 컴포넌트에서 사용될 때만 `함수`를 승인합니다.

- **상세:**

  Vue 인스턴스의 데이터 객체입니다. Vue는 속성을 getter/setter로 재귀적으로 변환해 "반응형"으로 만듭니다. **객체는 반드시 기본 객체이어야 합니다**: 브라우저 API 객체 및 프로토타입 속성과 같은 기본 객체는 무시됩니다. 데이터는 데이터일 뿐이며 객체 자체의 상태를 유지하는 동작은 관찰하지 않는 것이 좋습니다.

  일단 관찰되어지면, 루트 데이터 객체에 반응형 속성을 추가할 수 없습니다. 따라서 인스턴스 생성 이전에 모든 루트 수준의 반응형 속성을 미리 선언해야 합니다.

  인스턴스가 생성된 이후 원래 데이터 객체는 `vm.$data`로 접근할 수 있습니다. Vue 인스턴스는 데이터 객체에 있는 모든 속성을 프록시하므로 `vm.a`는 `vm.$data.a`와 동일합니다.

  `_` 또는 `$`로 시작하는 속성은 Vue의 내부 속성 및 API 메소드와 충돌할 수 있으므로 Vue 인스턴스에서 **프록시 되지 않습니다**. `vm.$data._property`로 접근 해야 합니다.

  **컴포넌트**를 정의할 때 `data`는 데이터를 반환하는 함수로 선언해야합니다. `data`를 위해 일반 객체를 사용하면 생성된 모든 인스턴스에서 동일한 객체가 **참조로 공유**됩니다. `data` 함수를 제공함으로써 새로운 인스턴스가 생성될 때마다 호출하여 초기 데이터의 새 복사본을 반환할 수 있습니다.

  필요한 경우, `vm.$data`를 `JSON.parse(JSON.stringify(...))`를 통해 전달함으로써 원본 객체의 복사본을 얻을 수 있습니다.

- **예제:**

  ``` js
  var data = { a: 1 }

  // 직접 객체 생성
  var vm = new Vue({
    data: data
  })
  vm.a // => 1
  vm.$data === data // => true

  // Vue.extend()에서 반드시 함수를 사용해야 합니다.
  var Component = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

  <p class="tip">__화살표 함수를 `data`에서 사용하면 안됩니다__ (예를 들어, `data: () => { return { a: this.myProp }}`) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 `this`는 예상과 달리 Vue 인스턴스가 아니며, `this.myProp`는 정의되지 않습니다.</p>

- **참고:** [반응형에 대해 깊이 알기](../guide/reactivity.html)

### props

- **타입:** `Array<string> | Object`

- **상세:**

  부모 컴포넌트의 데이터를 받을 수 있게 노출된 속성의 리스트/해시 입니다. 단순한 배열 기반 구문과 사용자 지정 유효성 검사 및 기본값과 같은 고급 구성을 허용하는 Object 기반 구문이 있습니다.

- **예제:**

  ``` js
  // 단순한 구문
  Vue.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // 유효성 검사를 포함한 객체 구문
  Vue.component('props-demo-advanced', {
    props: {
      // 타입 체크만 합니다.
      height: Number,
      // 타입 체크와 유효성 검사를 합니다.
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: function (value) {
          return value >= 0
        }
      }
    }
  })
  ```

- **참고:** [Props](../guide/components.html#Props)

### propsData

- **타입:** `{ [key: string]: any }`

- **제한:** `new`를 이용한 인스턴스 생성때만 사용됩니다.

- **상세:**

  인스턴스를 생성하는 동안 속성을 전달합니다. 이것은 단위 테스트를 쉽게 하기 위한 것 입니다.

- **예제:**

  ``` js
  var Comp = Vue.extend({
    props: ['msg'],
    template: '<div>{{ msg }}</div>'
  })

  var vm = new Comp({
    propsData: {
      msg: 'hello'
    }
  })
  ```

### computed

- **타입:** `{ [key: string]: Function | { get: Function, set: Function } }`

- **상세:**

  Vue 인스턴스에 추가되는 계산된 속성입니다. 모든 getter와 setter는 자동으로 `this` 컨텍스트를 Vue 인스턴스에 바인딩 합니다.

  <p class="tip">__계산된 속성을 정의 할 때 화살표 함수를 사용하면 안됩니다.__ 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 `this`는 Vue 인스턴스가 아니며 `this.a`는 정의되지 않습니다.</p>

  계산된 속성은 캐시 되며 의존하고 있는 반응형 속성이 변경되는 경우 다시 평가됩니다. 특정한 의존성이 인스턴스의 범위를 벗어나는 경우(반응형이지 않은 경우)에 계산된 속성은 갱신되지 않습니다. 그러나 여전히 반응형 속성을 갖지 않고 있기 때문에 이를 수정하는 경우 DOM 갱신을 발생시키지 않습니다.

  대부분의 상황에서 `cache: false`를 사용하는 것은 이상적인 방법이 아닙니다. 가능할 때마다 외부 데이터를 반응형 시스템 안으로 가져오는 것이 훨씬 좋습니다. 예를 들어, 계산된 속성이 윈도우 크기에 의존하는 경우 이 정보를 `data` 에 저장한 다음 `resize` 이벤트를 사용하여 데이터를 최신 상태로 유지할 수 있습니다. 이것 또한 반응형입니다!

- **예제:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // get만 가능합니다.
      aDouble: function () {
        return this.a * 2
      },
      // get과 set 입니다.
      aPlus: {
        get: function () {
          return this.a + 1
        },
        set: function (v) {
          this.a = v - 1
        }
      }
    }
  })
  vm.aPlus   // => 2
  vm.aPlus = 3
  vm.a       // => 2
  vm.aDouble // => 4
  ```

- **참고:**
  - [계산된 속성](../guide/computed.html)

### methods

- **타입:** `{ [key: string]: Function }`

- **상세:**

  Vue 인스턴스에 추가할 메소드입니다. VM 인스턴스를 통해 직접 접근하거나 디렉티브 표현식에서 사용할 수 있습니다. 모든 메소드는 자동으로 `this` 컨텍스트를 Vue 인스턴스에 바인딩합니다.

  <p class="tip">__화살표 함수를 메소드를 정의하는데 사용하면 안됩니다.__ 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 `this`는 Vue 인스턴스가 아니며 `this.a`는 정의되지 않습니다.</p>

- **예제:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    methods: {
      plus: function () {
        this.a++
      }
    }
  })
  vm.plus()
  vm.a // 2
  ```

- **참고:** [메소드와 이벤트 핸들링](../guide/events.html)

### watch

- **타입:** `{ [key: string]: string | Function | Object }`

- **상세:**

  키가 표시되는 표현식이고 값이 콜백입니다. 값은 메서드 이름이 문자열이거나 추가 옵션이 포함된 Object가 될 수도 있습니다. Vue 인스턴스는 인스턴스 생성시 객체의 각 항목에 대해 `$watch()`를 호출합니다.

- **예제:**

  ``` js
  var vm = new Vue({
    data: {
      a: 1,
      b: 2,
      c: 3
    },
    watch: {
      a: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
      // 문자열 메소드 이름
      b: 'someMethod',
      // 깊은 감시자
      c: {
        handler: function (val, oldVal) { /* ... */ },
        deep: true
      }
    }
  })
  vm.a = 2 // => new: 2, old: 1
  ```

  <p class="tip">__화살표 함수를 감시자에 사용하면 안됩니다.__ (예를 들어, `searchQuery: newValue => this.updateAutocomplete(newValue)`) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 `this`는 Vue 인스턴스가 아니며 `this.updateAutocomplete`는 정의되지 않습니다. </p>

- **참고:** [인스턴스 메소드 - vm.$watch](#vm-watch)

## 옵션들 / DOM

### el

- **타입:** `string | HTMLElement`

- **제한:** `new`를 이용한 인스턴스 생성때만 사용됩니다.

- **상세:**

  Vue 인스턴스에 마운트 할 기존 DOM 엘리먼트 필요합니다. CSS 선택자 문자열 또는 실제 HTMLElement 이어야 합니다.

  인스턴스가 마운트 된 이후, 그 엘리먼트는 `vm.$el`로 액세스 할 수 있습니다.

  인스턴스화 할 때 옵션을 사용할 수 있는 경우 인스턴스는 즉시 컴파일을 시작합니다. 그렇지 않으면 컴파일을 수동으로 하기 위해 `vm.$mount()`를 명시적으로 호출해야합니다.

  <p class="tip">제공된 엘리먼트는 설치 지점으로 사용합니다. Vue 1.x와 달리 마운트 된 엘리먼트는 모든 경우에 Vue가 생성한 DOM으로 대체됩니다. 그러므로 루트 인스턴스를 `<html>` 또는 `<body>`에 마운트 하는 것을 권장하지 않습니다.</p>


  <p class="tip">`render`함수 또는 `template` 옵션 둘 다 없으면, 마운트할 DOM 요소의 내부 DOM이 템플릿으로 추출 될 것입니다. 이 경우, Vue의 런타임 + 컴파일러 빌드를 사용해야합니다.</p>

- **참고:**
  - [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)
  - [Runtime + Compiler vs. Runtime-only](../guide/installation.html#Runtime-Compiler-vs-Runtime-only)

### template

- **타입:** `string`

- **상세:**

  Vue 인스턴스의 마크업으로 사용할 문자열 템플릿 입니다. 템플릿은 마운트 된 엘리먼트를 **대체** 합니다. 템플릿에 컨텐츠 배포 슬롯이 없는 경우 마운트 된 엘리먼트의 기존 마크업은 무시됩니다.

  문자열이 `#`로 시작하면 querySelector로 사용되며 선택된 엘리먼트의 innerHTML을 템플릿 문자열로 사용합니다. 이렇게 하면 일반적인 `<script type="x-template">` 트릭을 사용하여 템플릿을 포함할 수 있습니다.

  <p class="tip">보안 관점에서 신뢰할 수 있는 Vue 템플릿만 사용해야 합니다. 사용자 생성 콘텐츠를 템플릿으로 사용하면 안됩니다.</p>

  <p class="tip">Vue 옵션에 렌더 함수가 있으면 템플릿 속성은 무시됩니다</p>

  - **참고:**
    - [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)
    - [Slot을 이용한 컨텐츠 배포](../guide/components.html#Content-Distribution-with-Slots)

### render

  - **타입:** `(createElement: () => VNode) => VNode`

  - **상세:**

    문자열 템플릿 대신 자바스크립트의 완전한 프로그래밍 기능을 활용할 수 있습니다. render 함수는 `VNode`를 생성하는데 사용되는 첫번째 인자인 `createElement` 메소드를 받습니다.

    함수형 컴포넌트의 경우 렌더링 함수는 컴포넌트에 인스턴스가 없기 때문에 컨텍스트에 대한 액세스를 제공하는 추가적인 `context`를 전달합니다

    <p class="tip">
    `render` 함수는 `template` 옵션 또는 `el` 옵션으로 지정된 마운트된 엘리먼트의 템플릿에서 컴파일된 렌더링 함수보다 높은 우선 순위를 가집니다.
    </p>

  - **참고:**
    - [렌더 함수](../guide/render-function)

### renderError

> 2.2.0에서 추가됨

  - **타입:** `(createElement: () => VNode, error: Error) => VNode`

  - **상세:**

    **개발 모드에서만 작동합니다**

    기본 `render` 함수가 에러를 만나면, 대체되는 렌더 결과를 제공합니다. 오류는 두 번째 전달인자로 `renderError` 입니다. 핫 리로드와 함께 사용될 때 특히 유용합니다.

  - **예제:**

    ``` js
    new Vue({
      render (h) {
        throw new Error('oops')
      },
      renderError (h, err) {
        return h('pre', { style: { color: 'red' }}, err.stack)
      }
    }).$mount('#app')
    ```

  - **참고:**
    - [Render Functions](../guide/render-function)

## 옵션 / 라이프사이클 훅

모든 라이프사이클 훅은 자동으로 `this` 컨텍스트를 인스턴스에 바인딩하므로 데이터, 계산된 속성 및 메소드에 접근할 수 있습니다. __즉, 화살표 함수를 사용해 라이프사이클 메소드를 정의하면 안됩니다.(예: `created: () => this.fetchTodos()`)__ 이유는 화살표 함수가 부모 컨텍스트를 바인딩 하기 때문에 `this`는 예상대로 Vue 인스턴스가 아니며 `this.fetchTodos`는 정의되지 않습니다.

### beforeCreate

- **타입:** `Function`

- **상세:**

  인스턴스가 방금 초기화 된 후 데이터 관찰 및 이벤트 / 감시자 설정 전에 동기적으로 호출 됩니다.

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

### created

- **타입:** `Function`

- **상세:**

  인스턴스가 작성된 후 동기적으로 호출됩니다. 이 단계에서 인스턴스는 데이터 처리, 계산된 속성, 메서드, 감시/이벤트 콜백 등과 같은 옵션 처리를 완료합니다. 그러나 마운트가 시작되지 않았으므로 `$el` 속성을 아직 사용할 수 없습니다.

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

### beforeMount

- **타입:** `Function`

- **상세:**

  마운트가 시작되기 바로 전에 호출됩니다. `render` 함수가 처음으로 호출 됩니다.

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

### mounted

- **타입:** `Function`

- **상세:**

  `el`이 새로 생성된 `vm.$el`로 대체된 인스턴스가 마운트 된 직후 호출됩니다. 루트 인스턴스가 문서 내의 엘리먼트에 마운트 되어 있으면, `mounted`가 호출 될 때 `vm.$el`도 문서 안에 있게 됩니다.

  `mounted`는 모든 자식 컴포넌트가 마운트 된 상태를 보장하지 **않습니다**. `mounted` 내부에서 [vm.$nextTick](#vm-nextTick)를 사용하면 전체가 렌더링된 상태를 보장합니다.
  ``` js
  mounted: function () {
    this.$nextTick(function () {
      // 모든 화면이 렌더링된 후 실행합니다.
    })
  }
  ```

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

### beforeUpdate

- **타입:** `Function`

- **상세:**

  데이터가 변경되면, 가상 DOM 재 렌더링과 패치가 이뤄지기 전에 호출됩니다.
  이 훅에서 더 많은 상태 변경을 수행할 수 있으며 추가로 재 렌더링을 트리거하지 않습니다.

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

### updated

- **타입:** `Function`

- **상세:**

  데이터가 변경되어 가상 DOM이 재 렌더링되고 패치되면 호출됩니다.

  이 훅이 호출되면 엘리먼트의 DOM이 업데이트 된 상태가 되어 이 훅에서 DOM 종속적인 연산을 할 수 있습니다. 그러나 대부분의 경우 무한루프가 발생할 수 있으므로 훅에서 상태를 변경하면 안됩니다. 상태 변화에 반응하기 위해서 [계산된 속성](#computed) 또는 [감시자(#watch)를 사용하는 것이 더 좋습니다.

  `updated`는 모든 자식 컴포넌트가 재-렌더링 된 상태를 보장하지 **않습니다**. `updated` 내부에서 [vm.$nextTick](#vm-nextTick)를 사용하면 전체가 업데이트된 상태를 보장합니다.
  
  ``` js
  updated: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
    })
  }
  ```

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

### activated

- **타입:** `Function`

- **상세:**

  keep-alive 인 컴포넌트가 활성화 될 때 호출됩니다.

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:**
  - [내장 컴포넌트 - keep-alive](#keep-alive)
  - [동적 컴포넌트 - keep-alive](../guide/components.html#keep-alive)

### deactivated

- **타입:** `Function`

- **상세:**

  keep-alive인 컴포넌트가 비활성화 될 때 호출됩니다.

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:**
  - [내장 컴포넌트 - keep-alive](#keep-alive)
  - [동적 컴포넌트 - keep-alive](../guide/components.html#keep-alive)

### beforeDestroy

- **타입:** `Function`

- **상세:**

  Vue 인스턴스가 제거되기 전에 호출됩니다. 이 단계에서 인스턴스는 아직 완벽하게 작동합니다.

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

### destroyed

- **타입:** `Function`

- **상세:**

  Vue 인스턴스가 제거된 후 호출됩니다. 이 훅이 호출되면 Vue 인스턴스의 모든 디렉티브가 바인딩 해제 되고 모든 이벤트 리스너가 제거되며 모든 하위 Vue 인스턴스도 삭제됩니다.

  **이 훅은 서버측 렌더링 중 호출되지 않습니다**

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

## 옵션 / 에셋

### directives

- **타입:** `Object`

- **상세:**

  Vue 인스턴스에서 사용할 수 있도록 만들어진 디렉티브의 해시

- **참고:**
  - [사용자 정의 디렉티브](../guide/custom-directive.html)

### filters

- **타입:** `Object`

- **상세:**

  Vue 인스턴스에서 사용할 수 있도록 만들어진 필터의 해시

- **참고:**
  - [`Vue.filter`](#Vue-filter)

### components

- **타입:** `Object`

- **상세:**

  Vue 인스턴스에서 사용할 수 있도록 만들어진 컴포넌트의 해시

- **참고:**
  - [컴포넌트](../guide/components.html)

### parent

- **타입:** `Vue instance`

- **상세:**

  작성 할 인스턴스의 상위 인스턴스를 지정해야 합니다. 부모-자식 관계를 설정합니다. 부모는 자식에 대해 `this.$parent`로 접근할 수 있고 자식은 부모의 `$children`배열로 추가 됩니다.

  <p class="tip">`$parent`와 `$children`은 적당히 사용해야합니다. 대부분 escape-hatch로 사용합니다. 부모와 자식 간 의사소통은 props와 이벤트 사용을 권장합니다.</p>

### mixins

- **타입:** `Array<Object>`

- **상세:**

  `mixins` 옵션은 mixin 객체 배열을 받아들입니다. 이러한 mixin 객체는 일반 인스턴스 객체와 마찬가지로 인스턴스 옵션을 포함할 수 있으며, `Vue.extend()`에서 같은 옵션 병합 로직을 사용하여 최종 옵션과 병합됩니다. 예: mixin에 생성된 훅이 포함되어 있고 컴포넌트 자체에도 하나가 있으면 두 함수가 모두 호출 됩니다.

  Mixin 훅은 제공된 순서대로 호출되며 컴포넌트의 훅보다 먼저 호출됩니다.

- **예제:**

  ``` js
  var mixin = {
    created: function () { console.log(1) }
  }
  var vm = new Vue({
    created: function () { console.log(2) },
    mixins: [mixin]
  })
  // => 1
  // => 2
  ```

- **참고:** [Mixins](../guide/mixins.html)

### extends

- **타입:** `Object | Function`

- **상세:**

  `Vue.extend`를 사용하지 않고 선언적으로 다른 컴포넌트를 확장할 수 있습니다. (일반 옵션 객체 또는 생성자 일 수 있습니다.) 이것은 주로 단일 파일 컴포넌트 사이를 쉽게 확장할 수 있도록 하기 위함입니다.

  이것은 `mixins`와 유사합니다. 차이점은 컴포넌트의 자체 옵션이 확장되는 원본 컴포넌트보다 우선순위가 높다는 것 입니다.

- **예제:**

  ``` js
  var CompA = { ... }

  // Vue.extend를 호출하지 않고도 CompA를 확장할 수 있습니다.
  var CompB = {
    extends: CompA,
    ...
  }
  ```

### provide / inject

> 2.2.0에서 추가됨

- **타입:**
  - **provide:** `Object | () => Object`
  - **inject:** `Array<string> | { [key: string]: string | Symbol }`

- **상세:**

  <p class="tip">
  `provide`와 `inject`는 주로 고급 플러그인/컴포넌트 라이브러리를 위해 제공됩니다. 일반 애플리케이션 코드에서는 사용하지 않는 것이 좋습니다.
  </p>

  이 옵션 쌍은 함께 사용하여 상위 컴포넌트가 컴포넌트 계층 구조의 깊이에 관계없이 모든 하위 항목에 대한 종속성을 주입하는 역할을 하도록 허용합니다. React에 익숙하다면 이것은 React의 컨텍스트 기능과 매우 유사합니다.

  `provide` 옵션은 객체 또는 객체를 반환하는 함수여야합니다. 이 객체에는 하위 항목에 삽입할 수있는 속성이 포함되어 있습니다. ES2015 심볼을 이 객체의 키로 사용할 수 있지만 `Symbol`과 `Reflect.ownKeys`를 기본적으로 지원하는 환경에서만 가능합니다.

  `inject` 옵션은 문자열의 배열이거나 키가 로컬 바인딩 이름을 나타내는 객체이고 사용 가능한 주입에서 검색할 키 (문자열 또는 기호)값이어야합니다.

  > 주의 : `provide`와 `inject` 바인딩은 반응형이 아닙니다. 이는 의도적한 것입니다. 그러나 감시중인 객체를 전달하면 해당 객체의 속성은 계속 반응형입니다.

- **예제:**

  ``` js
  var Provider = {
    provide: {
      foo: 'bar'
    },
    // ...
  }

  var Child = {
    inject: ['foo'],
    created () {
      console.log(this.foo) // => "bar"
    }
    // ...
  }
  ```

  ES2015의 Symbol을 사용하여 `provide` 함수와 `inject` 객체를 사용하세요:
  ``` js
  const s = Symbol()

  const Provider = {
    provide () {
      return {
        [s]: 'foo'
      }
    }
  }

  const Child = {
    inject: { s },
    // ...
  }
  ```

  > 다음 두 예제는 Vue 2.2.1 버전 이후에서만 작동합니다 이전 버전에서는 `props`와 `data`를 초기화한 후 사용할 수 있습니다

주입한 값을 속성의 기본값으로 사용
  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default () {
          return this.foo
        }
      }
    }
  }
  ```

  주입한 값을 data로 사용
  ```js
  const Child = {
    inject: ['foo'],
    data () {
      return {
        bar: this.foo
      }
    }
  }
  ```

## 옵션 / 기타

### name

- **타입:** `string`

- **제한:** 컴포넌트 옵션으로 사용될 때만 사용할 수 있습니다.

- **상세:**

  컴포넌트가 템플릿을 반복적으로 자체 호출 할 수 있게 합니다. 컴포넌트가 `Vue.component()`로 전역으로 등록되면 전역 ID가 자동으로 이름으로 설정됩니다.

  `name` 옵션을 지정하는 또 다른 이점은 디버깅 입니다. 명명된 컴포넌트는 보다 유용한 경고 메시지를 만듭니다. 또한 [vue-devtools](https://github.com/vuejs/vue-devtools)에서 응용 프로그램을 살펴볼 때 익명의 컴포넌트는 매우 유용하지 않은 `<AnonymousComponent>`로 표시됩니다. `name` 옵션을 제공함으로써 훨씬 더 쓸모있는 컴포넌트 트리를 얻을 수 있습니다.

### delimiters

- **타입:** `Array<string>`

- **기본값:** `{% raw %}["{{", "}}"]{% endraw %}`

- **제한사항:** 이 옵션은 전체 빌드에서만 사용할 수 있습니다.

- **상세:**

  일반 텍스트 보간 구분 기호를 변경하십시오.

- **예제:**

  ``` js
  new Vue({
    delimiters: ['${', '}']
  })

  // 구분 기호가 ES6 템플릿 문자열 스타일로 변경되었습니다.
  ```

### functional

- **타입:** `boolean`

- **상세:**

  컴포넌트에 상태를 저장하지 않는(`data`가 없음) 및 인스턴스가 없도록 (`this` 컨텍스트가 없음) 만듭니다. 단순히 가상 노드를 반환하는 `render` 함수로 렌더링을 훨씬 더 가볍게 만듭니다.

- **참고:** [Functional Components](../guide/render-function.html#Functional-Components)

### model

> 2.2.0에서 추가됨

- **타입:** `{ prop?: string, event?: string }`

- **상세:**

  커스텀 컴포넌트가 `v-model`과 함께 사용될 때 prop와 이벤트를 커스터마이징 할 수 있도록 합니다. 기본적으로 컴포넌트의 `v-model`은 `value`를 보조 변수로 사용하고 `input`을 이벤트로 사용하지만 체크 박스와 라디오 버튼과 같은 일부 입력 타입은 다른 목적으로 `value` 속성을 사용하려고 할 수 있습니다. `model` 옵션을 사용하면 이 경우 충돌을 피할 수 있습니다.

- **예제:**

  ``` js
  Vue.component('my-checkbox', {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      // 다른 목적을 위해 `value` prop를 사용할 수 있습니다.
      value: String,
      // `value`를 대신 `checked`를 prop으로 사용하십시오.
      checked: {
        type: Number,
        default: 0
      }
    },
    // ...
  })
  ```

  ``` html
  <my-checkbox v-model="foo" value="some value"></my-checkbox>
  ```

  위의 내용은 아래와 같습니다.

  ``` html
  <my-checkbox
    :checked="foo"
    @change="val => { foo = val }"
    value="some value">
  </my-checkbox>
  ```

### inheritAttrs

> 2.4.0 이후 추가됨

- **타입:** `boolean`

- **기본값:** `true`

- **상세:**

  기본적으로 props로 인식되지 않는 상위 스코프의 속성 바인딩은 "흘러내려가" 일반 HTML 속성으로 하위 컴포넌트의 루트 엘리먼트에 적용됩니다.
  타겟 엘리먼트 또는 다른 컴포넌트를 래핑하는 컴포넌트를 제작할 때 항상 원하는 동작을 하지 않을 수 있습니다.
  `inheritAttrs` 속성을 `false`로 지정하면 기본적인 동작이 중지됩니다.
  속성은 `$attrs` 인스턴스 속성(2.4에서 새로 추가됨)로 사용할 수 있으며 `v-bind`로 루트 엘리먼트에 명시적으로 바인딩할 수 있습니다.

  Note: this option does **not** affect `class` and `style` bindings.

### comments

> 2.4.0 이후 추가됨

- **타입:** `boolean`

- **기본값:** `false`

- **제한사항:** 이 옵션은 전체 빌드에서만 사용할 수 있습니다.

- **상세:**

  `true`로 설정하면 템플릿에 있는 HTML 주석을 보존하고 렌더링합니다. 기본값은 동작은 주석을 유지합니다.

## 인스턴스 속성

### vm.$data

- **타입:** `Object`

- **상세:**

  Vue 인스턴스가 관찰하는 데이터 객체입니다. Vue 인스턴스는 데이터 객체의 속성에 대한 엑세스를 프록시 합니다.

- **참고:** [옵션 - data](#data)

### vm.$props

> 2.2.0에서 추가됨

- **타입:** `Object`

- **상세:**

  컴포넌트가 전달 받은 속성을 나타내는 객체입니다. Vue 인스턴스는 해당 props 객체의 속성에 대한 접근을 프록시합니다.

### vm.$el

- **타입:** `HTMLElement`

- **읽기 전용**

- **상세:**

  Vue 인스턴스가 관리하는 루트 DOM 엘리먼트 입니다.

### vm.$options

- **타입:** `Object`

- **읽기 전용**

- **상세:**

  인스턴스화 옵션은 현재 Vue 인스턴스에 사용됩니다. 이 옵션은 옵션에 사용자 정의 속성을 포함해야할 경우 유용합니다.

  ``` js
  new Vue({
    customOption: 'foo',
    created: function () {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

### vm.$parent

- **타입:** `Vue instance`

- **읽기 전용**

- **상세:**

  현재 인스턴스에 부모 인스턴스가 있는 경우, 부모 인스턴스 입니다.

### vm.$root

- **타입:** `Vue instance`

- **읽기 전용**

- **상세:**

  현재 컴포넌트 트리의 루트 Vue 인스턴스입니다. 현재 인스턴스에 부모가 없으면 이 값이 그 자체로 사용됩니다.
### vm.$children

- **타입:** `Array<Vue instance>`

- **읽기 전용**

- **상세:**

   현재 인스턴스가 가지고 있는 바로 하위의 컴포넌트 입니다. **`$children`에 대한 순서 보장은 없으며, 반응형이 아닙니다.** 데이터 바인딩을 위해 `$children`을 사용하려면, Array와 `v-for`를 사용하여 자식 컴포넌트를 생성하는 것을 고려하세요. Array를 원본으로 사용하세요.

### vm.$slots

- **타입:** `{ [name: string]: ?Array<VNode> }`

- **읽기 전용**

- **상세:**

  프로그래밍으로 접근 가능한 컨텐트 [슬롯 별 배포](../guide/components.html#Content-Distribution-with-Slots)에 사용합니다. 각 [명명된 슬롯](../guide/components.html#Named-Slots)은 고유한 속성을 가지고 있습니다. (예: `slot=foo` 는 `vm.$slots.foo`에서 찾을 수 있습니다.) `default` 속성은 명명된 슬롯에 포함되지 않은 노드를 포함합니다.

  `vm.$slots`에 접근하는 것은 [렌더 함수](../guide/render-function.html)로 컴포넌트를 작성할 때 가장 유용합니다.

- **예제:**

  ```html
  <blog-post>
    <h1 slot="header">
      About Me
    </h1>

    <p>Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.</p>

    <p slot="footer">
      Copyright 2016 Evan You
    </p>

    <p>If I have some content down here, it will also be included in vm.$slots.default.</p>.
  </blog-post>
  ```

  ```js
  Vue.component('blog-post', {
    render: function (createElement) {
      var header = this.$slots.header
      var body   = this.$slots.default
      var footer = this.$slots.footer
      return createElement('div', [
        createElement('header', header),
        createElement('main', body),
        createElement('footer', footer)
      ])
    }
  })
  ```

- **참고:**
  - [`<slot>` 컴포넌트](#slot-1)
  - [Slot을 이용한 컨텐트 배포](../guide/components.html#Content-Distribution-with-Slots)
  - [렌더 함수: Slots](../guide/render-function.html#Slots)

### vm.$scopedSlots

> 2.1.0의 새로운 기능

- **타입:** `{ [name: string]: props => VNode | Array<VNode> }`

- **읽기 전용**

- **상세:**

  [범위가 지정된 슬롯](../guide/components.html#Scoped-Slots)에 프로그래밍으로 액세스하는데 사용됩니다. `default`를 포함하여 각 슬롯에 대해 객체는 VNode를 반환하는 해당 함수를 포함합니다.

  `vm.$scopedSlots`에 접근하는 것은 [렌더 함수](../guide/render-function.html)로 컴포넌트를 작성할 때 가장 유용합니다.

- **참고:**
  - [`<slot>` 컴포넌트](#slot-1)
  - [범위가 지정된 슬롯](../guide/components.html#Scoped-Slots)
  - [렌더 함수: Slots](../guide/render-function.html#Slots)

### vm.$refs

- **타입:** `Object`

- **읽기 전용**

- **상세:**

  `ref`가 등록된 자식 컴포넌트를 보관하는 객체입니다.

- **참고:**
  - [자식 컴포넌트 참조](../guide/components.html#Child-Component-Refs)
  - [ref](#ref)

### vm.$isServer

- **타입:** `boolean`

- **읽기 전용**

- **상세:**

  현재 Vue 인스턴스가 서버에서 실행중인지 여부.

- **참고:** [서버측 렌더링](../guide/ssr.html)

### vm.$attrs

- **타입:** `{ [key: string]: string }`

- **읽기 전용**

- **상세:**

  props로 인식(및 추출)되지 않는 부모 범위 속성 바인딩입니다. 컴포넌트에 선언된 props가 없을 때 `class`와 `style`을 제외하고 모든 부모 범위 바인딩을 기본적으로 포함하며 `v-bind="$attrs"`를 통해 내부 컴포넌트로 전달할 수 있습니다 - 하이 오더 컴포넌트(HOC)를 작성할 때 유용합니다.

### vm.$listeners

- **타입:** `{ [key: string]: Function | Array<Function> }`

- **읽기 전용**

- **상세:**

  부모 스코프 `v-on` 이벤트 리스너를 포함합니다 (`.native` 수식어 없음). `v-on="$listeners"`를 통해 내부 컴포넌트로 전달할 수 있습니다 - 하이 오더 컴포넌트(HOC)를 생성 할 때 유용합니다.

## 인스턴스 메소드 / 데이터

<h3 id="vm-watch">vm.$watch( expOrFn, callback, [options] )</h3>

- **전달인자:**
  - `{string | Function} expOrFn`
  - `{Function | Object} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **반환 값:** `{Function} unwatch`

- **사용방법:**

  변경을 위해 Vue 인스턴스에서 표현식이나 계산된 함수를 감시합니다. 콜백은 새 값과 이전 값을 인자로 호출됩니다. 표현식은 점으로 구분된 경로를 허용합니다. 더 복잡한 표현식을 사용하려면 함수를 사용하세요.

  <p class="tip">참고: Object 또는 Array를 변경하는 대신 변형하는 경우 동일한 Object / Array를 참조하므로 이전 값은 새 값과 같습니다. Vue는 사전 변이된 값의 사본을 보관하지 않습니다.</p>

- **예제:**

  ``` js
  // keypath
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // 필요한 코드를 작성하세요
  })

  // function
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (newVal, oldVal) {
      // 필요한 코드를 작성하세요
    }
  )
  ```

  `vm.$watch`는 콜백을 호출하지 않는 unwatch 함수를 반환합니다.

  ``` js
  var unwatch = vm.$watch('a', cb)
  // 나중에, 감시자를 제거해야합니다
  unwatch()
  ```

- **옵션: deep**


  Objects 내부의 중첩된 값 변경을 감지하려면 options 인자에 `deep: true`를 전달해야 합니다. Array 변이를 수신하기 위해 그렇게 할 필요는 없습니다.

  ``` js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // 콜백이 호출됩니다
  ```

- **옵션: immediate**

  옵션에서 `immediate: true`를 전달하면 표현식의 현재 값으로 즉시 콜백을 호출합니다.

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // 콜백은`a`의 현재 값으로 즉시 시작됩니다.
  ```

<h3 id="vm-set">vm.$set( target, key, value )</h3>

- **전달인자:**
  - `{Object | Array} target`
  - `{string | number} key`
  - `{any} value`

- **반환 값:** 설정된 값

- **사용방법:**

  전역 `Vue.set`의 **별칭** 입니다.

- **참고:** [Vue.set](#Vue-set)

<h3 id="vm-delete">vm.$delete( target, key )</h3>

- **전달인자:**
  - `{Object | Array} target`
  - `{string | number} key`

- **사용방법:**

  전역 `Vue.delete`의 **별칭** 입니다.

- **참고:** [Vue.delete](#Vue-delete)

## 인스턴스 메소드 / 이벤트

<h3 id="vm-on">vm.$on( event, callback )</h3>

- **전달인자:**
  - `{string | Array<string>} event` (객체는 2.2.0버전 이상에서만 지원)
  - `{Function} callback`

- **사용방법:**

  현재 VM에서 사용자 정의 이벤트를 듣습니다. 이벤트는 `vm.$emit`에 의해 호출될 수 있습니다. 콜백은 이러한 이벤트 트리거 메소드에 전달 된 모든 추가 인수를 수신합니다.

- **예제:**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'hi')
  // => "hi"
  ```

<h3 id="vm-once">vm.$once( event, callback )</h3>

- **전달인자:**
  - `{string} event`
  - `{Function} callback`

- **사용방법:**

  사용자 이벤트를 한번만 듣습니다. 리스너는 한번 호출되면 제거됩니다.

<h3 id="vm-off">vm.$off( [event, callback] )</h3>

- **전달인자:**
  - `{string} [event]`
  - `{Function} [callback]`

- **Usage:**

  사용자 정의 이벤트 리스너를 제거합니다.

  - 인자가 없으면 모든 이벤트 리스너를 제거합니다.
  - 이벤트만 인자로 전달 받는 경우 해당 이벤트의 모든 리스너를 제거합니다.
  - 이벤트와 콜백을 전달 받으면 특정 콜백에 대한 리스너만 제거합니다.

<h3 id="vm-emit">vm.$emit( event, [...args] )</h3>

- **전달인자:**
  - `{string} event`
  - `[...args]`

  현재 인스턴스에서 이벤트를 트리거 합니다. 추가 인자는 리스너의 콜백 함수로 전달됩니다ㅣ.

## 인스턴스 메소드 / 라이프사이클

<h3 id="vm-mount">vm.$mount( [elementOrSelector] )</h3>

- **전달인자:**
  - `{Element | string} [elementOrSelector]`
  - `{boolean} [hydrating]`

- **반환 값:** `vm` - 인스턴스 그 자체

- **사용방법:**

  Vue 인스턴스가 인스턴스화 할 때 `el` 옵션이 없으면 연결된 DOM 엘리먼트 없이 "unmounted" 상태가 됩니다. `vm.$mount()`는 unmounted 된 Vue인스턴스의 마운트를 수동으로 시작하는데 사용할 수 있습니다.

  `elementOrSelector` 인자가 제공되지 않으면, 템플릿은 문서가 아닌 엘리먼트로 렌더링 될 것이므로 DOM API를 사용하여 문서에 직접 삽입해야 합니다.

  이 메소드는 다른 인스턴스 메소드를 체이닝 할 수 있도록 인스턴스 그 자체를 반환 합니다.

- **예제:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // 생성하고 #app에 마운트 합니다.(#app을 대체합니다)
  new MyComponent().$mount('#app')

  // 위와 같습니다.
  new MyComponent({ el: '#app' })

  // 또는 문서를 렌더링하고 나중에 추가할 수 있습니다.
  var component = new MyComponent().$mount()
  document.getElementById('app').appendChild(component.$el)
  ```

- **참고:**
  - [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)
  - [서버측 렌더링](../guide/ssr.html)

<h3 id="vm-forceUpdate">vm.$forceUpdate()</h3>

- **사용방법:**

  Vue 인스턴스를 강제로 다시 렌더링합니다. 모든 하위 컴포넌트에는 영향이 미치지 않으며, 슬롯 그 자체가 삽입된 슬롯 자체 및 하위 컴포넌트에만 영향을 미칩니다.

<h3 id="vm-nextTick">vm.$nextTick( [callback] )</h3>

- **전달인자:**
  - `{Function} [callback]`

- **사용방법:**

  다음 DOM 업데이트 사이클 이후 실행될 콜백을 연기합니다. DOM 업데이트를 기다리기 위해 일부 데이터를 변경한 직후 사용하십시오. 이 것은 콜백의 `this`컨텍스트가 이 메소드를 호출하는 인스턴스에 자동으로 바인딩되는 점을 제외하고 전역 `Vue.nextTick`과 같습니다.

  > 2.1.0의 새로운 기능 : 콜백이 제공되지 않고 Promise가 실행 환경에서 지원되는 경우 Promise를 반환합니다.

- **예제:**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // 데이터 수정
        this.message = 'changed'
        // 아직 DOM 이 갱신되지 않음
        this.$nextTick(function () {
          // DOM이 이제 갱신됨
          // `this` 가 현재 인스턴스에 바인딩 됨
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **참고:**
  - [Vue.nextTick](#Vue-nextTick)
  - [비동기 업데이트 큐](../guide/reactivity.html#Async-Update-Queue)

<h3 id="vm-destroy">vm.$destroy()</h3>

- **사용방법:**

  vm을 완전히 제거합니다. 다른 기존 VM과의 연결을 정리하고 모든 디렉티브를 바인딩 해제하고 모든 이벤트 리스너를 제거합니다.

  `beforeDestroy`와 `destroyed` 훅을 호출합니다.

  <p class="tip">일반적인 사용에서는 이 메소드를 직접 호출하면 안됩니다. `v-if`와 `v-for`를 사용하여 데이터 기반 방식으로 하위 컴포넌트의 라이프사이클을 제어하는 것이 좋습니다.</p>

- **참고:** [라이프사이클 다이어그램](../guide/instance.html#Lifecycle-Diagram)

## 디렉티브

### v-text

- **예상됨:** `string`

- **상세:**

  엘리먼트의 `textContent`를 업데이트 합니다. `textContent`의 일부를 갱신해야 하면 `{% raw %}{{ Mustache }}{% endraw %}`를 사용해야 합니다.
- **예제:**

  ```html
  <span v-text="msg"></span>
  <!-- 같습니다 -->
  <span>{{msg}}</span>
  ```

- **참고:** [데이터 바인딩 문법 - 보간](../guide/syntax.html#Text)

### v-html

- **예상됨:** `string`

- **상세:**

  엘리먼트의 `innerHTML`을 업데이트 합니다. **내용은 일반 HTML으로 삽입되므로 Vue 템플릿으로 컴파일 되지 않습니다.** `v-html`을 사용하여 템플릿을 작성하려는 경우 컴포넌트를 사용하여 솔루션을 다시 생각해 보십시오.

  <p class="tip">  웹사이트에서 임의의 HTML을 동적으로 렌더링하면 [XSS 공격](https://en.wikipedia.org/wiki/Cross-site_scripting)으로 이어질 수 있으므로 매우 위험할 수 있습니다. 신뢰할 수 있는 컨텐츠에만 `v-html`을 사용하고 사용자가 제공한 컨텐츠에는 **절대로** 사용하지 마십시오</p>

- **예제:**

  ```html
  <div v-html="html"></div>
  ```
- **참고:** [데이터 바인딩 문법 - 보간](../guide/syntax.html#Raw-HTML)

### v-show

- **예상됨:** `any`

- **사용방법:**

  토글은 표현식 값의 참에 기반을 둔 `display` CSS 속성입니다.

  이 디렉티브는 조건이 바뀌면 전환이 호출 됩니다.

- **참고:** [조건부 렌더링 - v-show](../guide/conditional.html#v-show)

### v-if

- **예상됨:** `any`

- **사용방법:**

  표현식 값의 참 거짓을 기반으로 엘리먼트를 조건부 렌더링 합니다. 엘리먼트 및 포함된 디렉티브 / 컴포넌트는 토글하는 동안 삭제되고 다시 작성됩니다. 엘리먼트가 `<template>`엘리먼트인 경우 그 내용은 조건부 블록이 됩니다.

  조건이 변경될 때 전환이 호출 됩니다.

<p class="tip">v-if와 함께 사용하는 경우, v-for는  v-if보다 높은 우선순위를 갖습니다. 자세한 내용은 <a href="../guide/list.html#v-for-with-v-if">리스트 렌더링 가이드</a>를 확인하십시오.</p>

- **참고:** [조건부 렌더링 - v-if](../guide/conditional.html)

### v-else

- **표현식이 필요 없습니다.**

- **제한:** 이전 형제 엘리먼트가 `v-if`또는 `v-else-if`이어야 합니다.

- **사용방법:**

  `v-if` 또는`v-if` /`v-else-if` 체인을위한 "else 블록"을 나타냅니다.

  ```html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **참고:**
  - [조건부 렌더링 - v-else](../guide/conditional.html#v-else)

### v-else-if

> 2.1.0의 새로운 기능

- **예상됨:** `any`

- **제한:** 이전 형제 엘리먼트가 `v-if` 또는 `v-else-if` 이어야 합니다.

- **사용방법:**


  `v-if`에 대한 "else if 블록"을 나타냅니다. 체이닝 가능합니다.

  ```html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **참고:** [조건부 렌더링 - v-else-if](../guide/conditional.html#v-else-if)

### v-for

- **예상됨:** `Array | Object | number | string`

- **사용방법:**

  원본 데이터를 기반으로 엘리먼트 또는 템플릿 블록을 여러번 렌더링합니다. 디렉티브의 값은 반복되는 현재 엘리먼트에 대한 별칭을 제공하기 위해 특수 구문인 `alias in expression`을 사용해야 합니다.

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  또는, 인덱스(아니면 객체의 경우 키)의 별칭을 지정할 수 있습니다.

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  `v-for`의 기본 동작은 엘리먼트를 이동하지 않고 그 자리에서 패치를 시도합니다. 강제로 엘리먼트의 순서를 바꾸려면 특수 속성 `key`를 설정해야 합니다.

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

<p class="tip">v-if와 함께 사용하는 경우, v-for는  v-if보다 높은 우선순위를 갖습니다. 자세한 내용은 <a href="../guide/list.html#v-for-with-v-if">리스트 렌더링 가이드</a>를 확인하십시오.</p>

`v-for`에 대한 자세한 사용법은 아래 링크된 가이드에서 설명합니다.


- **참고:**
  - [리스트 렌더링](../guide/list.html)
  - [key](../guide/list.html#key)

### v-on

- **약어:** `@`

- **예상됨:** `Function | Inline Statement | Object`

- **전달인자:** `event`

- **수식어:**
  - `.stop` - `event.stopPropagation()` 을 호출합니다.
  - `.prevent` - `event.preventDefault()` 을 호출합니다.
  - `.capture` - 캡처 모드에서 이벤트 리스너를 추가합니다.
  - `.self` - 이벤트가 이 엘리먼트에서 전달된 경우에만 처리 됩니다
  - `.{keyCode | keyAlias}` - 특정 키에 대해서만 처리 됩니다.
  - `.native` - 컴포넌트의 루트 엘리먼트에서 네이티브 이벤트를 수신합니다.
  - `.once` - 단 한번만 처리됩니다.
  - `.left` - (2.2.0) 왼쪽 버튼 마우스 이벤트 트리거 처리기.
  - `.right` - (2.2.0) 오른쪽 버튼 마우스 이벤트 트리거 처리기.
  - `.middle` - (2.2.0) 가운데 버튼 마우스 이벤트 트리거 처리기.
  - `.passive` - (2.3.0+) DOM 이벤트를 `{ passive: true }`와 연결합니다.

- **사용방법:**

  엘리먼트에 이벤트 리스너를 연결합니다. 이벤트 유형은 전달인자로 표시됩니다. 표현식은 메소드 이름 또는 인라인 구문일 수 있으며, 수식어가 있으면 생략할 수 있습니다.

  `2.4.0`부터 `v-on`도 인수없이 이벤트/리스너 쌍의 객체에 바인딩을 지원합니다. 객체 구문을 사용할 때는 수식어를 지원하지 않습니다.

  일반 엘리먼트에 사용되면 **기본 DOM 이벤트**만 받습니다. 사용자 정의 컴포넌트에서 사용될 때 해당 하위 컴포넌트에서 생성된 **사용자 정의 이벤트**를 받습니다.

  네이티브 DOM 이벤트를 수신하면 메소드는 네이티브 이벤트를 유일한 전달인자로 받습니다. 인라인 구문을 사용하는 경우 명령문은 특별한 `$event` 속성에 접근할 수 있습니다: `v-on: click = "handle('ok', $event)"`

- **예제:**

  ```html
  <!-- 메소드 핸들러 -->
  <button v-on:click="doThis"></button>

  <!-- 객체 구문 (2.4.0+) -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>

  <!-- 인라인 구문 -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- 약어 -->
  <button @click="doThis"></button>

  <!-- 전파 금지 -->
  <button @click.stop="doThis"></button>

  <!-- 기본 동작 방지 -->
  <button @click.prevent="doThis"></button>

  <!-- 표현식이 없는 기본 동작 방지 -->
  <form @submit.prevent></form>

  <!-- 수식어 체이닝 -->
  <button @click.stop.prevent="doThis"></button>

  <!-- 키 별칭을 이용한 키 입력 수식어 -->
  <input @keyup.enter="onEnter">

  <!-- 키 코드를 이용한 키 입력 수식어 -->
  <input @keyup.13="onEnter">

  <!-- the click event will be triggered at most once -->
  <button v-on:click.once="doThis"></button>
  ```

  하위 컴포넌트에서 사용자 지정 이벤트를 수신합니다. (자식에서 "my-event"가 생성될 때 처리기가 호출 됩니다.)

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- 인라인 구문 -->
  <my-component @my-event="handleThis(123, $event)"></my-component>

  <!-- 컴포넌트의 기본 이벤트 -->
  <my-component @click.native="onClick"></my-component>
  ```

- **참고:**
  - [메소드와 이벤트 핸들링](../guide/events.html)
  - [컴포넌트 - 사용자 정의 이벤트](../guide/components.html#Custom-Events)

### v-bind

- **약어:** `:`

- **예상됨:** `any (with argument) | Object (without argument)`

- **전달인자:** `attrOrProp (optional)`

- **수식어:**
  - `.prop` - 속성 대신 DOM 속성으로 바인딩 ([무슨 차이가 있습니까?](http://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028)). 만약 태그가 컴포넌트라면 `.props`는 컴포넌트의 `$el`에 속성을 추가합니다.
  - `.camel` - (2.1.0+) kebab-case 속성 이름을 camelCase로 변환합니다.
  - `.sync` - (2.3.0+) 바인딩 된 값을 업데이트하기 위한 `v-on`를 확장하는 신택스 슈가입니다

- **사용방법:**

  동적으로 하나 이상의 컴포넌트 속성 또는 표현식을 바인딩 합니다.

  `class`또는 `style` 속성을 묶는 데 사용될 때, Array나 Objects와 같은 추가 값 유형을 지원합니다. 자세한 내용은 아래 링크된 섹션을 참조하십시오.

  속성 바인딩에 사용할 때 속성은 하위 컴포넌트에서 올바르게 선언되어야 합니다.

  전달인자 없이 사용하면 속성 이름 - 값 쌍을 포함하는 객체를 바인딩 하는데 사용할 수 있습니다. 이 모드에서는 `class`와 `style`은 Array나 Objects를 지원하지 않습니다.

- **예제:**

  ```html
  <!-- 속성을 바인딩 합니다. -->
  <img v-bind:src="imageSrc">

  <!-- 약어 -->
  <img :src="imageSrc">

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName">

  <!-- 클래스 바인딩 -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- 스타일 바인딩 -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- 속성 객체 바인딩 -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop 수식어를 사용하는 DOM 속성 바인딩 -->
  <div v-bind:text-content.prop="text"></div>

  <!-- 속성 바인딩. 컴포넌트에서 "prop"를 선언 해야 합니다.  -->
  <my-component :prop="someThing"></my-component>

  <!-- 자식 컴포넌트와 공통으로 사용하는 부모 props를 전달합니다 -->
  <child-component v-bind="$props"></child-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  `.camel` 수식어는 DOM 템플릿을 사용할 때 `v-bind` 속성 이름을 camelCase화 할수 있습니다. (예: SVG `viewBox`속성)

  ``` html
  <svg :view-box.camel="viewBox"></svg>
  ```

  문자열 템플릿을 사용하거나 `vue-loader`/`vueify` 로 컴파일 하는 경우 `.camel`은 필요 없습니다.

- **참고:**
  - [클래스 및 스타일 바인딩](../guide/class-and-style.html)
  - [컴포넌트 - 컴포넌트 속성](../guide/components.html#Props)
  - [컴포넌트 - `.sync` 수식어](../guide/components.html#sync-Modifier)

### v-model

- **예상됨:** 컴포넌트 폼 인풋 엘리먼트 또는 출력 값에 따라 다릅니다.

- **제한사항:**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **수식어:**
  - [`.lazy`](../guide/forms.html#lazy) - `input`대신 `change` 이벤트를 듣습니다.
  - [`.number`](../guide/forms.html#number) - 문자열을 숫자로 변경합니다.
  - [`.trim`](../guide/forms.html#trim) - 입력에 대한 trim 을 합니다.

- **사용방법:**

  폼 인풋 엘리먼트 또는 컴포넌트에 양방향 바인딩을 만듭니다. 자세한 사용법은 아래 링크된 가이드 섹션을 참조하십시오.

- **참고:**
  - [폼 인풋 바인딩](../guide/forms.html)
  - [컴포넌트 - 사용자 정의 이벤트를 이용하는 폼 인풋 컴포넌트](../guide/components.html#Form-Input-Components-using-Custom-Events)

### v-pre

- **표현식이 필요하지 않습니다**

- **사용방법:**

  이 엘리먼트와 모든 자식 엘리먼트에 대한 컴파일을 건너 뜁니다. 원시 mustache 태그를 표시하는데 사용할 수 있습니다. 디렉티브가 없는 많은 수의 노드를 뛰어 넘으면 컴파일 속도가 빨라집니다.

- **예제:**

  ```html
  <span v-pre>{{ 이 부분은 컴파일 되지 않습니다 }}</span>
   ```

### v-cloak

- **표현식이 필요하지 않습니다**

- **사용방법:**

  이 디렉티브는 Vue 인스턴스가 컴파일을 완료할 때까지 엘리먼트에 남아있습니다. `[v-cloak] { display: none }`와 같은 CSS규칙과 함께 이 디렉티브는 Vue인스턴스가 준비될 때까지 컴파일되지 않은 mustache 바인딩을 숨기는데 사용할 수 있습니다.

- **예제:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  `<div>`는 컴파일이 끝날 때까지 보이지 않습니다.

### v-once

- **표현식이 필요하지 않습니다**

- **상세:**

  엘리먼트 및 컴포넌트를 **한번만** 렌더링 합니다. 후속 렌더링에서 엘리먼트 / 컴포넌트와 모든 하위 엘리먼트는 정적으로 처리되어 건너 뜁니다. 이는 업데이트 성능을 최적화하는데 사용합니다.

  ```html
  <!-- 단일 엘리먼트 -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- 자식 엘리먼트를 포함하는 엘리먼트 -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- 컴포넌트 -->
  <my-component v-once :comment="msg"></my-component>
  <!-- v-for 디렉티브 -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

- **참고:**
  - [데이터 바인딩 문법 - 보간](../guide/syntax.html#Text)
  - [컴포넌트 - v-once를 이용한 가벼운 정적 컴포넌트](../guide/components.html#Cheap-Static-Components-with-v-once)

## 특별한 속성들

### key

- **예상됨:** `string`

  `key` 특수 속성은 Vue의 가상 DOM 알고리즘이 새로운 노드 목록을 이전 목록과 비교할 때 VNode를 식별하기 위한 힌트로 주로 사용됩니다. 키가 없으면 Vue는 엘리먼트 이동을 최소화하고 같은 유형의 엘리먼트를 최대한 많이 패치 / 재사용하려고 하는 알고리즘을 사용합니다. 키를 사용하면 키의 순서 변경을 기반으로 엘리먼트가 재정렬되고 더 이상 존재하지 않는 키가 있는 엘리먼트는 항상 제거 / 삭제 됩니다.

  동일한 부모의 자식 엘리먼트는 **고유 키** 가 있어야 합니다. 키가 중복되면 렌더링 오류가 발생합니다.

  가장 일반적인 이용 사례는 `v-for`와 결합합니다.

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  엘리먼트 / 컴포넌트를 재사용하지 않고 강제로 대체하는데에도 사용할 수 있습니다. 이것은 다음과 같은 경우 유용할 수 있습니다.

  - 컴포넌트의 라이프사이클 훅을 올바르게 트리거합니다.
  - 전환효과 호출

예제:

  ``` html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

`text`가 변경되면 `<span>`는 패치가 아닌 교체되므로 트랜지션이 트리거됩니다.

### ref

- **예상됨:** `string`

  `ref` 엘리먼트 또는 자식 컴포넌트에 대한 참조를 등록하는데 사용합니다. 참조는 부모 컴포넌트의 `$refs` 객체 아래에 등록됩니다. 일반 DOM 엘리먼트에서 사용되는 경우 참조는 해당 엘리먼트입니다. 하위 컴포넌트에서 사용되는 경우 참조는 컴포넌트 인스턴스 입니다.

  ``` html
  <!-- vm.$refs.p는 DOM 노드가 됩니다 -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child는 자식 컴포넌트 인스턴스가 됩니다. -->
  <child-comp ref="child"></child-comp>
  ```

  `v-for`를 사용하여 엘리먼트 / 컴포넌트에 사용되는 경우 등록된 참조는 DOM 노드 또는 컴포넌트 인스턴스가 포함된 배열입니다.

  참조 등록 타이밍에 대한 중요한 참고 사항: 참조 자체는 렌더링 함수의 결과로 생성되기 때문에 초기 렌더링에서 참조 자체를 액세스 할 수 없습니다. 아직 존재하지 않습니다! `$refs`는 또한 반응이 없으므로 데이터 바인딩을 위해 템플릿에서 사용해서는 안됩니다.

- **참고:** [자식 컴포넌트 참조](../guide/components.html#Child-Component-Refs)

### slot

- **예상됨:** `string`

  컨텐츠가 있는 슬롯의 이름을 위해 자식 컴포넌트에 삽입된 컨텐츠에 사용됩니다.

  자세한 사용법은 아래 링크 된 가이드 섹션을 참조하십시오.

- **참고:** [명명된 슬롯](../guide/components.html#Named-Slots)

### is

- **예상됨:** `string`

  [동적 컴포넌트](../guide/components.html#Dynamic-Components) 및 [DOM 내부 템플릿의 한계](../guide/components.html#DOM-Template-Parsing-Caveats)를 해결하는데 사용합니다.

  예제:

  ``` html
  <!-- currentView가 변경되면 컴포넌트가 변경됩니다. -->
  <component v-bind:is="currentView"></component>

  <!-- <my-row>는 <table> 엘리먼트에서 사용할 수 없으므로  -->
  <!-- 아래처럼 사용해야합니다     -->
  <table>
    <tr is="my-row"></tr>
  </table>
  ```

  자세한 사용 방법은 위에 적힌 설명의 링크에 있습니다.

- **참고:**
  - [동적 컴포넌트](../guide/components.html#Dynamic-Components)
  - [DOM 템플릿 파싱 주의사항](../guide/components.html#DOM-Template-Parsing-Caveats)



## 내장 컴포넌트

### component

- **Props:**
  - `is` - 문자열 | ComponentDefinition | ComponentConstructor
  - `inline-template` - boolean

- **사용방법:**

  동적 컴포넌트 렌더링을 위한 "메타 컴포넌트"입니다. 렌더링할 실제 컴포넌트는 `is` prop에 의해 결정됩니다.

  ```html

  <!-- vm 의 `componentId` 속성에 의해   -->
  <!-- 제어되는 동적 컴포넌트 -->
  <component :is="componentId"></component>

  <!-- 등록된 컴포넌트 또는 컴포넌트를 prop로 전달할 수 있습니다. -->
  <component :is="$options.components.child"></component>
  ```

- **참고:** [동적 컴포넌트](../guide/components.html#Dynamic-Components)

### transition

- **Props:**
  - `name` - string, 전환 CSS 클래스 이름을 자동으로 생성하는데 사용됩니다. 예: `name: 'fade'`는 자동으로 `.fade-enter`, `.fade-enter-active`로 확장됩니다. 기본값은 `"v"`입니다.
  - `appear` - boolean, 초기 렌더링에서 전환 적용 여부를 정합니다. 기본값은 `false` 입니다.
  - `css` - boolean, CSS 전환 클래스를 적용할 여부입니다. 기본 값은 `true`입니다. `false`로 설정하면 컴포넌트 이벤트를 통해 등록된 자바스크립트 훅만 호출됩니다.
  - `type` - string, 전환 종료 타이밍을 결정하기 위해 대기할 전환 이벤트의 유형을 지정합니다. 사용 가능한 값은 `"transition"`과 `"animation"`입니다. 기본적으로 더 긴 지속시간을 갖는 유형을 자동으로 감지합니다.
  - `mode` - string, Controls the timing sequence of leaving/entering transitions. Available modes are `"out-in"` and `"in-out"`; defaults to simultaneous.
  - `mode` - string, 트랜지션을 나가거나 들어가는 타이밍 순서를 제어합니다. 사용 가능한 모드는 `"out-in"`과 `"in-out"`입니다. 기본값은 동시에 발생합니다.
  - `enter-class` - string
  - `leave-class` - string
  - `appear-class` - string
  - `enter-to-class` - string
  - `leave-to-class` - string
  - `appear-to-class` - string
  - `enter-active-class` - string
  - `leave-active-class` - string
  - `appear-active-class` - string

- **이벤트:**
  - `before-enter`
  - `before-leave`
  - `before-appear`
  - `enter`
  - `leave`
  - `appear`
  - `after-enter`
  - `after-leave`
  - `after-appear`
  - `enter-cancelled`
  - `leave-cancelled` (`v-show` only)
  - `appear-cancelled`

- **사용방법:**

  `<transition>`은 **단일** 엘리먼트 / 컴포넌트에 대한 전환 효과로 사용됩니다. `<transition>`은 추가 DOM 엘리먼트를 렌더링 하지 않으며 컴포넌트 계층에도 나타나지 않습니다. 내부의 래핑된 컨텐츠에 단순히 전환 효과를 적용합니다.

  ```html
  <!-- 단일 엘리먼트 -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- 동적 컴포넌트 -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- 이벤트 훅 -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">toggled content</div>
    </transition>
  </div>
  ```

  ``` js
  new Vue({
    ...
    methods: {
      transitionComplete: function (el) {
        // 전달된 'el'에 대해 DOM 엘리먼트를 전달인자로 사용하는 경우..
      }
    }
    ...
  }).$mount('#transition-demo')
  ```

- **참고:** [Transitions: 진입, 진출, 그리고 리스트](../guide/transitions.html)

### transition-group

- **Props:**
  - `tag` - string, 기본값은 `span` 입니다.
  - `move-class` - 이동 전환 중에 적용된 CSS클래스를 덮어 씁니다.
  - `mode`를 제외한 `<transition>`과 동일한 prop를 노출합니다.

- **이벤트:**
  - `<transition>`과 같은 이벤트를 노출합니다.

- **사용방법:**

  `<transition-group>`은 **여러** 엘리먼트 / 컴포넌트에 대한 전환 효과로 사용합니다. `<transition-group>`은 실제 DOM 엘리먼트를 렌더링 합니다. 기본값으로 `<span>`을 렌더링하고 `tag` 속성을 통해 렌더링 해야하는 엘리먼트를 설정할 수 있습니다.
  애니메이션이 제대로 작동되게 하려면 `<transition-group>`에 있는 모든 자식이 **유일 키** 가 되어야 합니다.

  `<transition-group>`은 CSS transform을 통해 장면 전환을 지원합니다. 스크린에서 자식의 위치가 변경된 후 움직이는 CSS클래스 (`name` 속성에서 자동 생성되거나 `move-class` 속성으로 설정됨)가 적용됩니다. 움직이는 클래스가 적용될 때 CSS `transform` 속성이 "전환가능"하면, 엘리먼트는 [FLIP technique](https://aerotwist.com/blog/flip-your-animations/)을 사용하여 목적지로 부드럽게 움직입니다.

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **참고:** [Transitions: 진입, 진출, 그리고 리스트](../guide/transitions.html)

### keep-alive

- **Props:**
  - `include` - string 또는 RegExp 또는 Array . 일치하는 컴퍼넌트만 캐시됩니다.
  - `exclude` - string 또는 RegExp 또는 Array. 일치하는 컴퍼넌트는 캐시되지 않습니다.

- **사용방법:**

  동적 컴포넌트를 감싸는 경우 `<keep-alive>`는 비활성 컴포넌트 인스턴스를 파괴하지 않고 캐시합니다. `<transition>`과 비슷하게 `<keep-alive>`는 추상 엘리먼트입니다. DOM 엘리먼트 자체는 렌더링 하지 않고 컴포넌트 부모 체인에는 나타나지 않습니다.

  컴포넌트가 `<keep-alive>`내에서 토글 될 때, `activated`와 `deactivated` 라이프사이클 훅이 그에 따라 호출됩니다.


  > 2.2.0 이상에서는 `<keep-alive>` 트리 안에 있는 모든 중첩 된 컴포넌트에서`activated`와 `deactivated`가 실행됩니다.

  주로 컴포넌트 상태를 보존하거나 재 렌더링을 피하는데 사용합니다.

  ```html
  <!-- 기본 사용 -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- 여러개의 조건부 자식 컴포넌트 -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- <transition>과 함께 사용합니다. -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

`<keep-alive>`는 한개의 자식 컴포넌트가 토글되고 있는 경우를 위해 설계된 것에 주의해야합니다. 내부에 `v-for`가 있으면 작동하지 않습니다. 우와 같이 조건부 자식 컴포넌트가 여러개인 경우 `<keep-alive>`는 한번에 하나의 자식만 렌더링도록 요청됩니다.

- **`include` 와 `exclude`**

  > 2.1.0의 새로운 기능

  `include`와`exclude` prop는 컴포넌트를 조건부 캐시 할 수 있습니다. 두 prop는 쉼표로 분리 된 문자열이거나 RegExp 또는 배열입니다.

  ``` html
  <!-- 콤마로 구분된 문자열 -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (v-bind 사용) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (use `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  `name` 옵션을 사용할 수없는 경우, 컴포넌트 자신의`name` 옵션에서 일치하는 항목을 먼저 확인한 다음 로컬 등록 이름 (부모의`components` 옵션에서 키)을 확인합니다. 익명의 컴포넌트는 일치시킬 수 없습니다.

  <p class="tip">`<keep-alive>`는 캐시 될 인스턴스가 없으므로 함수형 컴포넌트에서 작동하지 않습니다.</p>

- **참고:** [동적 컴포넌트 - keep-alive](../guide/components.html#keep-alive)

### slot

- **Props:**
  - `name` - string, 명명된 슬롯으로 사용합니다

- **사용방법:**

  `<slot>` 은 컴포넌트 템플릿의 컨텐츠 배포 역할을 합니다. `<slot>`은 대체됩니다

  자세한 사용법은 아래 링크된 가이드 섹션을 참조하십시오.

- **참고:** [Slot을 이용한 컨텐트 배포](../guide/components.html#Content-Distribution-with-Slots)

## VNode 인터페이스

- [VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js)를 참조하십시오.

## 서버측 렌더링

- [vue-server-renderer 패키지 문서](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer)를 참조하십시오.
