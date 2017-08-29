---
title: Vue 1.x에서 마이그레이션
type: guide
order: 601
---

## FAQ

>  우와... - 이 페이지는 매우 깁니다! 그 말은 2.0이 완전히 다르다는 것을 의미합니까? 기초를 다시 배워야 할 것이며, 마이그레이션은 실제로 불가능한 것입니까?

질문해 주어서 기쁩니다. 대답은 '아니오' 입니다. API의 약 90%가 동일하고 핵심 개념이 변경되지 않았습니다. 매우 자세한 설명을 제공하고 많은 예제를 포함하기 때문에 문서의 길이가 깁니다. 안심하십시오. __이 것은 위에서 아래로 읽어야하는 것이 아닙니다!__

> 마이그레이션을 하려면 어디서부터 시작해야 하나요?

1. 현재 프로젝트에서 [마이그레이션 도우미](https://github.com/vuejs/vue-migration-helper)를 실행하여 시작하십시오. 우리는 조심스럽게 크기를 줄이고 시니어 Vue 개발자가 간단한 커맨드라인 인터페이스로 압축했습니다. 쓸모없는 기능을 인식 할 때마다 알려주고 제안을 제공하며 자세한 정보에 대한 링크를 제공합니다.

2. 그런 다음 사이드 바에서 이 페이지의 목차를 훑어 보십시오. 영향이 있겠지만 마이그레이션 도우미가 파악하지 못한 항목이 있으면 확인 하십시오.

3. 테스트가 있으면 실행하고 실패한 것을 확인하십시오. 테스트가 없는 경우 브라우저에서 앱을 열고 확인할 때 경고 또는 오류가 발생하지 않도록 주의하십시오.

4. 이제, 앱이 완전히 마이그레이션 되어야합니다. 그래도 아직 허전하다면 이 페이지의 나머지 부분을 읽거나 [처음부터](index.html) 새롭고 향상된 가이드를 읽어보십시오. 이미 핵심 개념을 잘 알고 있으므로 많은 부분을 대강 훑어보는 것이 가능합니다.

> Vue 1.x 버전을 2버전으로 마이그레이션 하는데 얼마나 걸릴까요?

그것은 몇 가지 사항에 달려 있습니다.

- 앱 크기 (중소 규모 앱의 경우 하루 미만)

- 몇 번이나 산만해지고 멋진 새로운 기능으로 시작하십시오. 😉, 우리도 2.0으로 빌드하는 동안 동일하게 발생했습니다!

- 사용중인 오래된 기능. 대부분은 찾기 및 교체로 업그레이드 할 수 있지만 나머지는 몇 분이 걸릴 수 있습니다. 현재 베스트 프랙티스를 따르지 않는다면 Vue 2.0가 당신에게 강요하려고 할 것입니다. 이것은 장기적으로는 좋은 일이지만 중요한(비록 기한을 넘길 수 있지만) 리펙터링를 의미 할 수도 있습니다.

> Vue 2로 업그레이드 하면, Vuex와 Vue-Router도 업그레이드 해야합니까?

Vue-Router2만 Vue 2와 호환되므로 Vue-Router의 [마이그레이션 방법](migration-vue-router.html)을 따라야합니다. 다행히도 대부분의 응용 프로그램에는 라우터 코드가 많지 않으므로 1시간 이상 걸리지는 않습니다.

Vuex는 버전 0.8도 Vue 2와 호환되므로 업그레이드하지 않아도됩니다. 즉시 업그레이드 하기를 원하는 유일한 이유는 모듈 및 감소 된 상용구와 같은 Vuex 2의 새로운 기능을 이용하는 것입니다.

## 템플릿

### 파편화된 인스턴스 <sup>제거됨</sup>

모든 컴포넌트에는 정확히 하나의 루트 요소가 있어야합니다. 파편화된 인스턴스는 더 이상 허용되지 않습니다. 다음과 같은 템플릿이있는 경우,

``` html
<p>foo</p>
<p>bar</p>
```

다음과 같이 전체 내용을 새 엘리먼트로 간단하게 래핑하는 것이 좋습니다.

``` html
<div>
  <p>foo</p>
  <p>bar</p>
</div>
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>업그레이드 후 엔드 투 엔드 테스트 스위트 또는 앱을 실행하고 템플릿의 여러 루트 엘리먼트에 대한 <strong>콘솔 경고</strong>를 찾습니다.</p>
</div>
{% endraw %}

## 라이프사이클 훅

### `beforeCompile` <sup>제거됨</sup>

`created` 훅을 대신 사용하세요.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이 훅의 모든 예를 찾으십시오.</p>
</div>
{% endraw %}

### `compiled` <sup>대체</sup>

`mounted` 훅을 대신 사용하세요

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이 훅의 모든 예를 찾으십시오.</p>
</div>
{% endraw %}

### `attached` <sup>제거됨</sup>

다른 훅에서 사용자 정의 DOM 체크를 사용하십시오. 예를 들어 다음을 대체합니다.

``` js
attached: function () {
  doSomething()
}
```

이렇게 사용하셔야 합니다.

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이 훅의 모든 예를 찾으십시오.</p>
</div>
{% endraw %}

### `detached` <sup>제거됨</sup>

다른 훅에서 사용자 정의 DOM 체크를 사용하십시오. 예를 들어 다음을 대체합니다.

``` js
detached: function () {
  doSomething()
}
```

You could use:

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이 훅의 모든 예를 찾으십시오.</p>
</div>
{% endraw %}

### `init` <sup>이름 변경</sup>

대신에 새로운 `beforeCreate` 훅을 사용하십시오. 이것은 본질적으로 동일합니다. 다른 라이프사이클 메소드와의 일관성을 위해 이름이 변경되었습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이 훅의 모든 예를 찾으십시오.</p>
</div>
{% endraw %}

### `ready` <sup>대체</sup>

새로운 `mounted` 훅을 대신 사용하십시오. `mounted`를 사용하면 문서 안에 있을 것이라는 보장이 없다는 것을 주의해야 합니다. 이를 위해서 `Vue.nextTick`/`vm. $ nextTick`도 포함시키십시오. 예:

``` js
mounted: function () {
  this.$nextTick(function () {
    // $el은 문서 안에 있음을 가정하는 코드.
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이 훅의 모든 예를 찾으십시오.</p>
</div>
{% endraw %}

## `v-for`

### `v-for` 배열의 전달인자 순서 <sup>변경</sup>

`index`를 포함 할 때, 배열의 인수 순서는 `(index, value)` 이었습니다. `forEach` 나 `map` 과 같은 JavaScript의 네이티브 배열 메소드와의 일관성을 유지하기 위해서 `(value, index)` 가 되었습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 더 이상 사용되지 않는 전달인자를 찾으십시오. <code>position</code> 또는 <code>num</code>과 같이 인덱스 인수의 이름을 비정상적으로 지정하면 도우미가 플래그를 지정하지 않습니다.</p>
</div>
{% endraw %}

### `v-for` 객체 전달인자 순서 <sup>변경</sup>

`key`를 포함 할 때, 객체의 절단일자 순서는 `(key, value)` 였습니다. lodash와 같은 공통 객체 iterator와 보다 일관성을 유지하는 것으로 이제 `(value, key)`를 사용합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 더 이상 사용되지 않는 전달인자를 찾으십시오. 키 인수의 이름을 <code>name</code> 또는 <code>property </code>와 같이 지정하면 도우미가 플래그를 지정하지 않습니다.</p>
</div>
{% endraw %}

### `$index` and `$key` <sup>제거됨</sup>

암묵적으로 할당 된 `$index` 와 `$key` 변수는 `v-for` 에서 명시적으로 정의하기 위해 제거되었습니다. 이렇게하면 Vue에 익숙하지 않은 개발자도 코드를 더 쉽게 읽을 수 있으며 중첩 루프를 처리 할 때 훨씬 명확한 동작을 얻을 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 제거 된 변수를 찾으십시오. </p>
</div>
{% endraw %}

### `track-by` <sup>대체</sup>

`track-by`는 다른 속성과 마찬가지로 `key` 로 대체되었습니다. `v-bind:` 또는 `:` 접두사가 없으면 리터럴 문자열로 취급됩니다. 대부분의 경우, 키 대신 완전 표현식을 기대하는 동적 바인딩을 사용하고자 할 것입니다. 예를 들어, 대신 :

``` html
<div v-for="item in items" track-by="id">
```

이제 이렇게 쓸 수 있습니다.

``` html
<div v-for="item in items" v-bind:key="item.id">
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>track-by</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `v-for` 범위 값 <sup>변경</sup>

이전에 `v-for="number in 10"`의 `number`는 0부터 9까지였습니다. 이제는 1부터 10까지 입니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 정규 표현식 <code>/\w+ in \d+/</code>을 검색하십시오. <code>v-for</code>에 나타날 때마다 영향을받을 수 있는지 확인하십시오.</p>
</div>
{% endraw %}

## Props

### `coerce` Prop Option <sup>제거됨</sup>

props을 `coerce` 하고 싶다면 대신에 지역적으로 계산된 값을 설정하십시오. 예를 들어,

``` js
props: {
  username: {
    type: String,
    coerce: function (value) {
      return value
        .toLowerCase()
        .replace(/\s+/, '-')
    }
  }
}
```

아래처럼 작성해야 합니다.

``` js
props: {
  username: String,
},
computed: {
  normalizedUsername: function () {
    return this.username
      .toLowerCase()
      .replace(/\s+/, '-')
  }
}
```

이렇게 사용하는 것에 대한 장점입니다.

- 당신은 여전히 prop의 원래 값에 접근 할 수 있습니다.
- coerce한 값에 prop에서 전달 된 값과 구별되는 이름을 부여하여 더 명확해 집니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미 </a>를 실행하여 <code>coerce</code> 옵션의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `twoWay` Prop 옵션 <sup>제거됨</sup>

props는 항상 단방향입니다. 상위 범위에서 사이드이펙트를 생성하려면 컴포넌트가 암묵적 바인딩에 의존하지 않고 이벤트를 명시적으로 내보내야합니다. 자세한 내용은 다음을 참조하십시오.

- [사용자 정의 컴포넌트 이벤트](components.html#Custom-Events)
- [사용자 정의 입력 컴포넌트](components.html#Form-Input-Components-using-Custom-Events) (컴포넌트 이벤트를 사용하세요)
- [전역 상태 관리](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper"> 마이그레이션 도우미 </a>를 실행하여 <code>twoWay</code> 옵션의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `v-bind` 와 함께 사용하던 `.once` 와 `.sync` 수정자 <sup>제거됨</sup>

props는 항상 단방향입니다. 상위 범위에서 사이드이펙트를 생성하려면 컴포넌트가 암묵적 바인딩에 의존하지 않고 이벤트를 명시적으로 내보내야합니다. 자세한 내용은 다음을 참조하십시오.

- [사용자 정의 컴포넌트 이벤트](components.html#Custom-Events)
- [사용자 정의 입력 컴포넌트](components.html#Form-Input-Components-using-Custom-Events) (컴포넌트 이벤트를 사용하세요)
- [전역 상태 관리](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper"> 마이그레이션 도우미 </a>를 실행하여 <code>.once</code> 및 <code>.sync</code> 수정자에 대한 예를 찾아봅니다.
</div>
{% endraw %}

### Prop 변이 <sup>사용안함</sup>

props 변이의 대부분의 사용 방법은 다음 옵션 중 하나로 대체 할 수 있습니다.

props를 지역적 변경 시키는 것은 이제 안티 패턴입니다. prop을 선언하고 컴포넌트에 `this.myProp = 'someOtherValue'`를 설정하십시오. 새로운 렌더링 메커니즘으로 인해 부모 컴포넌트가 다시 렌더링 될 때마다 하위 컴포넌트의 로컬 변경 사항을 덮어 씁니다.

prop 변이의 대부분의 사용 사례는 다음 중 하나로 대체 할 수 있습니다.

- 기본값을 설정하는 데 사용되는 prop가 있는 데이터 속성
- 계산된 속성

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>업그레이드 후 엔드 투 엔드 테스트 스위트 또는 앱을 실행하고 소품 변이에 대한 <strong>console warnings</strong>를 찾으십시오.</p>
</div>
{% endraw %}

### 루트 인스턴스의 props <sup>대체</sup>

루트 Vue 인스턴스 (즉,`new Vue ({...})` 로 생성 된 인스턴스)에서는 `props` 대신 `propsData`를 사용해야합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>보유하고있는 엔드 투 엔드 테스트 스위트를 실행하십시오. <strong>실패한 테스트 </strong>는 루트 인스턴스로 전달 된 prop가 더 이상 작동하지 않는다는 사실을 알려줍니다.</p>
</div>
{% endraw %}

## 계산된 속성

### `cache: false` <sup>사용안함</sup>

계산된 속성의 캐싱 무효화는 향후 주요 버전의 Vue에서 제거 될 예정입니다. 캐시 되지 않은 계산된 속성을 같은 결과를 갖는 메소드로 대체하십시오.

예제:

``` js
template: '<p>message: {{ timeMessage }}</p>',
computed: {
  timeMessage: {
    cache: false,
    get: function () {
      return Date.now() + this.message
    }
  }
}
```

또는 컴포넌트 메소드를 사용합니다

``` js
template: '<p>message: {{ getTimeMessage }}</p>',
methods: {
  getTimeMessage: function () {
    return Date.now() + this.message
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>cache: false</code> option.</p>
</div>
{% endraw %}

## 내장 디렉티브

### `v-bind`의 참/거짓 <sup>변경</sup>

`v-bind`와 함께 사용되면, 유일한 거짓 값은 `null`,`undefined`,`false` 입니다. 이것은 `0`을 의미하고 빈 문자열은 참으로로 렌더링됩니다. 예를 들어 `v-binddraggable="''"`는 `draggable="true" `로 렌더링 할 것입니다.

열거된 속성의 경우 위의 위조 된 값 외에도`'false'` 문자열은 `attr="false"` 로 렌더링됩니다.

<p class="tip">다른 지시어 (예: `v-if` 및`v-show`)의 경우 JavaScript의 일반적인 참 거짓이 여전히 적용됩니다.</p>

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>보유하고 있는 엔드 투 엔드 테스트 스위트를 실행하십시오. <strong>실패한 테스트</strong>는 이 변경의 영향을 받을 수 있는 앱의 모든 부분을 알려줍니다.</p>
</div>
{% endraw %}

### `v-on`의 컴포넌트에 있는 네이티브 이벤트 리스닝 <sup>변경</sup>

컴포넌트에서 사용될 때,`v-on`은 그 컴포넌트에 의해 `$emit`된 사용자 지정 이벤트를 받습니다. 루트 요소에서 네이티브 DOM 이벤트를 받으려면 `.native` 한정자를 사용할 수 있습니다. 예:

``` html
<my-component v-on:click.native="doSomething"></my-component>
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>보유하고 있는 엔드 투 엔드 테스트 스위트를 실행하십시오. <strong>실패한 테스트</strong>는이 변경의 영향을 받을 수 있는 앱의 모든 부분을 알려줍니다.</p>
</div>
{% endraw %}

### `v-model`를 위한 `debounce` 매개 변수 <sup>제거됨</sup>

디바운싱은 Ajax 요청 및 기타 무거운 작업을 실행하는 빈도를 제한하는 데 사용됩니다. `v-model`에 대한 Vue의 `debounce` 매개 변수은 매우 단순한 경우에 이것을 쉽게 만들었지만, 무거운 작업 자체보다는 __상태 갱신__ 에 실제로 사용했습니다. 미묘한 차이점이 있지만 애플리케이션이 커짐에 따라 한계가 있습니다.

이러한 제한 사항은 예를 들어 다음과 같은 검색 표시기를 설계할 때 분명 해집니다.

{% raw %}
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo" class="demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
<script>
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
</script>
{% endraw %}

`debounce` 속성을 사용하면 입력의 실시간 상태에 액세스할 수 없으므로 "입력" 상태를 감지 할 수 없습니다. 그러나 Vue에서 디바운스 기능을 분리하면 제한하려는 작업만 디버깅할 수 있으므로 개발할 수있는 기능의 한계가 사라집니다.

``` html
<!--
lodash 또는 다른 유틸리티 라이브러리의 debounce 기능을 사용하여
우리가 사용하는 특정 debounce 가장 좋은 사례인 것을 알 수 있습니다.
이 템플릿 에서뿐만 아니라 어디에서나 사용할 수 있습니다.
-->
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
```

``` js
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    // debounce가 실제로 작동하는 곳 입니다.
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
```

이 접근법의 또 다른 장점은 디바운싱 (debouncing)이 올바른 래퍼 함수가 아닌 경우입니다. 예를 들어 추천 검색어 용 API를 사용하는 경우 사용자가 일정 기간 동안 입력을 중지 할 때까지 제안을 기다리는 것이 이상적인 방법이 아닙니다. 대신 __throttling__ 함수가 필요합니다. 이제 lodash와 같은 유틸리티 라이브러리를 사용하는 경우 `throttle` 함수로 리팩토링하면 몇 초 밖에 걸리지 않습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여the <code>debounce</code> attribute.</p>
</div>
{% endraw %}

### `v-model`에 대한 `lazy` 또는`number` 매개 변수 <sup>대체</sup>

`lazy`와`number` 매개 변수는 이제 수정자입니다.

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

이렇게 사용해야 합니다.

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper"> 마이그레이션 도우미 </a>를 실행하여 이러한 매개 변수 속성의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `v-model`의 `value` 속성  <sup>제거됨</sup>

`v-model`은 더 이상 인라인 `value` 속성의 초기 값을 신경 쓰지 않습니다. 예측 가능성을 위해, 대신 Vue 인스턴스 데이터를 항상 원본 소스로 취급합니다.

즉, 이 엘리먼트를 의미합니다.

``` html
<input v-model="text" value="foo">
```

이 데이터를 바탕으로

``` js
data: {
  text: 'bar'
}
```

"foo "대신 "bar" 값으로 렌더링됩니다. 기존 내용이 있는 `<textarea>`도 마찬가지입니다.

``` html
<textarea v-model="text">
  hello world
</textarea>
```

`text`의 초기 값이 "hello world"인지 확인해야합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>업그레이드 후 엔드 투 엔드 테스트 스위트 또는 앱을 실행하고 <code>v-model</code>을 사용하여 인라인 값 속성에 대한 <strong>console warnings</ strong>를 찾습니다.</p>
</div>
{% endraw %}

### `v-for`를 사용하는 `v-model`이 반복 된 기본 값 <sup>제거됨</sup>

이와 같은 사례는 더 이상 작동하지 않습니다.

``` html
<input v-for="str in strings" v-model="str">
```

왜냐하면 `<input>` 이 컴파일할 수 있는 것과 동등한 JavaScript이기 때문입니다.

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

보시다시피, `v-model`의 양방향 바인딩은 여기서 의미가 없습니다. iterator 함수에서 `str`을 다른 값으로 설정하면 함수 범위에 있는 지역 변수이기 때문에 아무 일도 하지 않습니다.

대신,`v-model`이 객체의 필드를 업데이트 할 수 있도록 __objects__ 배열을 사용해야합니다.

``` html
<input v-for="obj in objects" v-model="obj.str">
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>Run your test suite, if you have one. The <strong>failed tests</strong> should alert to you to any parts of your app that may be affected by this change.</p>
</div>
{% endraw %}

### 객체 문법과 `!important`를 가지는 `v-bind:style` <sup>제거됨</sup>

더 이상 작동하지 않습니다.

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hello</p>
```

정말로 `!important`를 오버라이드 할 필요가 있다면, 다음과 같이 문자열 구문을 사용해야합니다.

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hello</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여style bindings with <code>!important</code> in objects.</p>
</div>
{% endraw %}

### `v-el` 와 `v-ref` <sup>대체</sup>

단순화를 위해,`v-el` 과 `v-ref`는 `ref` 속성으로 병합되었습니다. 이 속성은 `$refs`를 통해 컴포넌트 인스턴스에서 접근 가능합니다. 이는 `v-el:my-element`가 `ref="myElement"`가되고 `v-ref:my-component`가 `ref="myComponent"`가된다는 것을 의미합니다. 일반 요소에서 사용될 때,`ref`는 DOM 요소가 될 것이고, 컴포넌트에서 사용될 때,`ref`는 컴포넌트 인스턴스가 될 것입니다.

`v-ref`는 더 이상 디렉티브가 아니며 특별한 속성이기 때문에 동적으로 정의 될 수도 있습니다. 이것은 `v-for`와 함께 사용할 때 특히 유용합니다.

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

이전에 `v-el`/`v-ref` 와 `v-for`를 조합하면 각 항목에 고유한 이름을 부여 할 방법이 없었기 때문에 엘리먼트/컴포넌트 배열을 생성합니다. 각 항목에 같은 `ref`를 주면 여전히 이 동작을 할 수 있습니다.

``` html
<p v-for="item in items" ref="items"></p>
```

1.x와는 달리 이 `$refs`는 렌더링 프로세스 자체에서 등록/갱신 되기 때문에 반응형이지 않습니다. 이를 반응형으로 만드려면 모든 변경에 대해 중복 렌더링이 필요합니다.

반면에 `$refs`는 주로 JavaScript에서의 프로그래밍 방식 접근을 위해 고안되었습니다. 인스턴스 자체에 속하지 않는 상태를 가리키는 것이므로 템플릿에서 의존하지 않는 것이 좋습니다. 이는 Vue의 데이터 기반 뷰 모델을 위반하게됩니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p><code>v-el</code>과 <code>v-ref</code>를 찾기 위해 코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하기.</p>
</div>
{% endraw %}

### `v-show`의 `v-else` <sup>제거됨</sup>

`v-else`는 더 이상`v-show`와 함께 작동하지 않습니다. 대신에`v-if`를 부정식으로 사용하십시오. 대신에,

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">Not foo, but bar</p>
```

You can use:

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">Not foo, but bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여the <code>v-else</code> with <code>v-show</code>.</p>
</div>
{% endraw %}

## 사용자 지정 디렉티브 <sup>단순화</sup>

지시어는 책임 범위를 크게 줄였습니다. 이제는 하위 수준의 직접 DOM 조작을 적용하는 경우만 사용됩니다. 대부분의 경우 컴포넌트를 주 코드 재사용 추상화로 사용하는 것이 좋습니다.

가장 주목할만한 차이점은 다음과 같습니다.

- 디렉티브에 더 이상 인스턴스가 없습니다. 이것은 디렉티브 훅 안에 `this`가 없다는 것을 의미합니다. 대신 필요한 모든 것을 전달인자로 받습니다. 실제로 훅을 가로채는 상태를 유지해야한다면 `el` 에서 그렇게 할 수 있습니다.
- `acceptStatement`, `deep`, `priority` 등의 옵션은 모두 제거되었습니다. `twoWay` 지시어를 대체하려면 [이 예제](#Two-Way-Filters-replaced)를 참조하십시오.
- 현재의 훅 중 일부는 다른 동작을 하며 몇 가지 새로운 후크가 있습니다.

다행스럽게도 새로운 디렉티브가 훨씬 간단하기 때문에 보다 쉽게 마스터 할 수 있습니다. 자세한 내용은 새로운 [사용자 지정 디렉티브 가이드](custom-directive.html)를 읽어보십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>
  코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 정의 된 디렉티브의 예를 찾으십시오. 도우미는 모든 엘리먼트에 플래그를 지정합니다. 대부분의 경우 엘리먼트로 리팩토링하려는 경우가 많기 때문입니다.</p>
</div>
{% endraw %}

### 디렉티브 `.literal` 수정자 <sup>제거됨</sup>

`.literal` 수정자는 제거되었습니다. 문자열 리터럴을 값으로 제공하는 것만으로 쉽게 달성 할 수 있습니다.

예를 들어 다음을 변경 할 수 있습니다.

```js
<p v-my-directive.literal="foo bar baz"></p>
```

는 단순히

```html
<p v-my-directive="'foo bar baz'"></p>
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 `.literal` 수정자의 예를 찾으십시오.</p>
</div>
{% endraw %}

## 전환 효과

### `transition` 속성 <sup>대체</sup>

Vue의 전환 시스템은 상당히 크게 변경되어 이제 `transition` 속성보다는 `<transition>` 과 `<transition-group>` 래퍼 요소를 사용합니다. 자세한 내용은 새 [전환 안내](transitions.html)를 읽는 것이 좋습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>transition</code> 속성의 예를 찾으십시오..</p>
</div>
{% endraw %}

### `Vue.transition`의 재사용 가능한 전환 <sup>대체</sup>

새로운 전환 시스템을 사용하면 [재사용 가능한 전환을 위해 컴포넌트를 사용](transitions.html#Reusable-Transitions)할 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>Vue.transition</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

### 전환 `stagger` 속성 <sup>제거됨</sup>

리스트 전환을 엇갈리게 할 필요가있는 경우, 요소의 `data-index` (또는 유사한 속성)를 설정하고 액세스하여 타이밍을 제어 할 수 있습니다. [예제](transitions.html#Staggering-List-Transitions)를 보십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여the <code>transition</code> 속성의 예를 찾으십시오. 업데이트 하는 동안, 전환이 매우 요동칠 수 있습니다.</p>
</div>
{% endraw %}

## 이벤트

### `events` 옵션 <sup>제거됨</sup>

`events` 옵션이 삭제되었습니다. 이제 이벤트 핸들러는 `created` 훅에 등록해야 합니다. 자세한 예제는 [`$dispatch` 와 `$broadcast` 마이그레이션 가이드](# dispatch-and-broadcast-replaced)를 확인하십시오.

### `Vue.directive('on').keyCodes` <sup>대체</sup>

`keyCodes`를 구성하는 새롭고 더 간결한 방법은 `Vue.config.keyCodes`를 사용하는 것 입니다. 예 :

``` js
// enable v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이전<code>keyCode</code> 구성 문법의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `$dispatch` 와 `$broadcast` <sup>대체</sup>

`$dispatch`와 `$broadcast`는 [Vuex](https://github.com/vuejs/vuex)와 같이 보다 명확한 컴포넌트간 통신과 보다 유지 보수가 가능한 상태 관리 솔루션을 위해 제거되었습니다.

문제는 컴포넌트의 트리 구조에 의존하는 이벤트 흐름이 트리가 커질 때 추론하기 어려울 수 있으며 매우 취약하다는 것입니다. 그것은 단순히 잘 확장되지 않으며 우리는 나중에 고통을 주고 싶지 않습니다. `$dispatch` 와 `$broadcast` 도 형제 컴포넌트 간의 커뮤니케이션을 해결하지 못합니다.

이 방법의 가장 보편적 인 사용법 중 하나는 부모와 그 직접 자식 사이의 커뮤니케이션입니다. 이 경우, 실제로 [`v-on`을 가진 자식으로부터 `$emit`을 감지](components.html#Form-Input-Components-using-Custom-Events).할 수 있습니다. 이렇게하면 이벤트의 편리성을 유지할 수 있습니다.

그러나 멀리 떨어진 자손 / 조상간에 의사 소통을 할 때 `$emit` 이 도움이되지 않습니다. 대신 가장 간단한 방안은 중앙 집중화 된 이벤트 허브를 사용하는 것입니다. 컴포넌트 트리에 상관없이 컴포넌트간에 통신 할 수있는 추가 이점이 있습니다 - 형제 사이에서도 가능합니다! Vue 인스턴스는 이벤트 이미 인터페이스를 구현하기 때문에 이 목적으로 빈 Vue 인스턴스를 실제로 사용할 수 있습니다.

예를 들어 다음과 같이 Todo 앱을 구성했다고 가정 해 보겠습니다.

```
Todos
|-- NewTodoInput
|-- Todo
    |-- DeleteTodoButton
```

이 단일 이벤트 허브를 사용하여 컴포넌트 간의 통신을 관리 할 수 있습니다.

``` js
// 이 이벤트 허브는
// 컴포넌트 사이에서 통신 할 수 있습니다.
var eventHub = new Vue()
```

그런 다음 우리의 컴포넌트에서 `$emit`, `$on`, `$off`를 사용하여 이벤트를 내보내고, 이벤트를 수신하고, 이벤트 리스너를 각각 정리할 수 있습니다.

``` js
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
```

``` js
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```

``` js
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// 컴포넌트가 파괴되기 전에 이벤트 리스너를 정리하는 것이 좋습니다.
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

이 패턴은 단순한 시나리오에서 `$dispatch` 와 `$broadcast`를 대체 할 수 있지만 더 복잡한 경우에는 [Vuex](https://github.com/vuejs/vuex)와 같은 전용 상태 관리 레이어를 사용하는 것이 좋습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>$dispatch</code> and <code>$broadcast</code>.</p>
</div>
{% endraw %}

## 필터

### 외부 텍스트 보간 필터 <sup>제거됨</sup>

이제 필터는 텍스트 보간(`{% raw %}{{ }}{% endraw %}`)태그 내에서만 사용할 수 있습니다. 과거에 우리는`v-model`, `v-on` 등과 같은 디렉티브 내에서 필터를 사용하는 것이 편리함보다 더 복잡하다는 것을 발견했습니다. `v-for`에 대한 목록 필터링의 경우 논리를 JavaScript로 계산된 속성으로 이동하여 컴포넌트 전체에서 재사용할 수 있습니다.

일반적으로 자바 스크립트에서 무언가를 얻을 수 있을 때마다 필터와 같은 특별한 구문을 사용하지 않아도 되므로 동일한 관심사를 처리할 수 있습니다. Vue의 기본 제공 디렉티브 필터를 대체하는 방법은 다음과 같습니다.

#### `debounce` 필터 변경

아래 코드 대신에

``` html
<input v-on:keyup="doStuff | debounce 500">
```

``` js
methods: {
  doStuff: function () {
    // ...
  }
}
```

[lodash의 `debounce`](https://lodash.com/docs/4.15.0#debounce) (또는 가능하면 [`throttle`](https://lodash.com/docs/4.15.0#throttle)) 고사양의 방법을 직접적으로 제한하는 것. 위와 같이 다음과 같이 할 수 있습니다.

``` html
<input v-on:keyup="doStuff">
```

``` js
methods: {
  doStuff: _.debounce(function () {
    // ...
  }, 500)
}
```

이 전략의 장점에 대해서는 [여기에`v-model` 예제가 있습니다.](#debounce-Param-Attribute-for-v-model-removed)

#### `limitBy` 필터 교체

아래 코드 대신에

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

계산 된 속성에서 JavaScript의 내장 된 `.slice` 메서드를 사용하십시오.

``` html
<p v-for="item in filteredItems">{{ item }}</p>
```

``` js
computed: {
  filteredItems: function () {
    return this.items.slice(0, 10)
  }
}
```

#### `filterBy` 필터 교체

아래 코드 대신에

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

JavaScript에 내장된 [`.filter` 메소드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples)를 계산된 속성에서 사용하십시오.

``` html
<p v-for="user in filteredUsers">{{ user.name }}</p>
```

``` js
computed: {
  filteredUsers: function () {
    var self = this
    return self.users.filter(function (user) {
      return user.name.indexOf(self.searchQuery) !== -1
    })
  }
}
```

JavaScript의 네이티브 `.filter`는 계산된 속성 내에서 JavaScript의 모든 기능에 액세스할 수 있으므로 훨씬 더 복잡한 필터링 작업도 관리 할 수 있습니다. 예를 들어 모든 활성 사용자를 찾고 이름과 이메일 모두와 대소 문자를 구분하지 않으려면 다음을 수행하십시오.

``` js
var self = this
self.users.filter(function (user) {
  var searchRegex = new RegExp(self.searchQuery, 'i')
  return user.isActive && (
    searchRegex.test(user.name) ||
    searchRegex.test(user.email)
  )
})
```

#### `orderBy` 필터 교체

아래 코드 대신에

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

계산된 속성에서 [lodash의 `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (또는 [`sortBy`](https://lodash.com/docs/4.15.0#sortBy))를 사용하십시오.

``` html
<p v-for="user in orderedUsers">{{ user.name }}</p>
```

``` js
computed: {
  orderedUsers: function () {
    return _.orderBy(this.users, 'name')
  }
}
```

여러개의 열을 정렬할 수도 있습니다.

``` js
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 디렉티브 내에서 사용되는 필터의 예를 찾으십시오. 빠뜨린 경우 <strong>console errors</strong>도 표시되어야합니다.</p>
</div>
{% endraw %}

### 필터 전달인자 구문 <sup>변경</sup>

이제 필터 함수의 전달인자 구문이 JavaScript함수 호출과 더 잘 일치합니다. 따라서 공백으로 구분 된 전달인자를 취하는 대신

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

전달인자를 괄호로 묶고 쉼표로 구분합니다.

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이전 필터 구문의 예를 찾으십시오. 빠뜨린 경우 <strong>console errors</strong>도 표시되어야합니다.</p>
</div>
{% endraw %}

### 내장 텍스트 필터 <sup>제거됨</sup>

텍스트 보간 내의 필터는 여전히 허용되지만 모든 필터가 제거 되었습니다. 대신 각 도메인의 문제를 해결하기 위해보다 전문화된 라이브러리를 사용하는 것이 좋습니다 (예 : 날짜 형식을 지정하는 [date-fns](https://date-fns.org/)및 통화를 위한 [`accounting`](http://openexchangerates.github.io/accounting.js/)).

Vue에 내장 된 텍스트 필터 각각에 대해 아래에서 어떻게 대체 할 수 있는지 살펴 보겠습니다. 예제 코드는 사용자 지정 헬퍼 함수, 메서드 또는 계산 된 속성에 있을 수 있습니다.

#### `json` 필터 변경

Vue는 문자열, 숫자, 배열 또는 일반 객체 등 사용자가 자동으로 출력 형식을 지정하기 때문에 실제로는 더 이상 디버깅 할 필요가 없습니다. 그래도 JavaScript의 `JSON.stringify`와 같은 기능을 원한다면 메소드나 계산 된 속성에서 사용할 수 있습니다.

#### `capitalize` 필터 변경

``` js
text[0].toUpperCase() + text.slice(1)
```

#### `uppercase` 필터 변경

``` js
text.toUpperCase()
```

#### `lowercase` 필터 변경

``` js
text.toLowerCase()
```

#### `pluralize` 필터 변경

NPM의 [pluralize](https://www.npmjs.com/package/pluralize) 패키지는 이 목적을 훌륭하게 처리하지만, 특정 단어를 복수화하거나 '0'과 같은 특수 출력을 원하면 사용자 고유의 복수화 함수를 쉽게 정의 할 수 있습니다. 예 :

``` js
function pluralizeKnife (count) {
  if (count === 0) {
    return 'no knives'
  } else if (count === 1) {
    return '1 knife'
  } else {
    return count + 'knives'
  }
}
```

#### `currency` 필터 변경

매우 조악한 구현을 위해 다음과 같이 할 수 있습니다.

``` js
'$' + price.toFixed(2)
```

하지만 대부분의 경우 여전히 이상한 동작을 보일 것입니다 (예 : `0.035.toFixed(2)` 는 `0.04` 까지 반올림합니다, 그러나 `0.045`는`0.04`로 반올림됩니다). 이러한 문제를 해결하기 위해 [`accounting`](http://openexchangerates.github.io/accounting.js/) 라이브러리를 사용하여 보다 안정적으로 통화를 형식화 할 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 오래된 텍스트 필터의 예를 찾으십시오. 빠뜨린 경우 <strong>console errors</strong>도 표시되어야합니다.</p>
</div>
{% endraw %}

### 양방향 필터 <sup>대체</sup>

일부 사용자는 `v-model`과 함께 양방향 필터를 사용하여 매우 적은 코드로 흥미로운 입력을 사용하였습니다. 그러나 단순하지만 양방향 필터는 많은 복잡성을 숨길 수 있으며 심지어 상태 업데이트를 지연시켜 빈약한 UX를 만들 수 있습니다. 대신 입력을 래핑하는 컴포넌트는 사용자 지정 입력을 만드는 보다 명확하고 기능이 풍부한 방법으로 권장됩니다.

예를 들어 양방향 통화 필터의 마이그레이션을 살펴 보겠습니다.

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

대부분 잘 작동하지만 지연된 상태 업데이트로 인해 이상한 동작이 발생할 수 있습니다. 예를 들어,`Result` 탭을 클릭하고 그 입력 중 하나에 `9.999`를 입력하십시오. 입력 값이 사라지면 값은 `$ 10.00`으로 업데이트됩니다. 그러나 계산 된 합계를 보면 `9.999`가 데이터에 저장 되어 있는 것을 볼 수 있습니다. 사용자가 보는 현실의 버전이 동기화되지 않았습니다!
Vue 2.0을 사용하여 좀 더 강력한 솔루션으로 전환하려면 먼저이 필터를 새로운 `<currency-input>` 컴포넌트로 둘러 쌉시다.

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

이렇게하면 포커스가 있는 입력 내용을 선택하는 것 처럼 필터만으로는 캡슐화할 수 없는 동작을 추가할 수 있습니다. 이제 다음 단계는 필터에서 비즈니스 로직을 추출하는 것입니다. 아래에서는 모든 것을 [currencyValidator](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e)객체 외부로 가져옵니다.

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


이처럼 모듈성이 높아지면 Vue 2로 마이그레이션하는 것이 더 쉬워질 뿐만 아니라 통화 구문 분석 및 서식 지정이 가능합니다.

- Vue 코드와 분리 된 단위 테스트
- 애플리케이션의 다른 부분 (예: API 엔드 포인트에 대한 페이로드의 유효성 검사)에서 사용됩니다.

이 유효성 검사기를 추출한 결과 우리는 더욱 편안하게 이 솔루션을 더욱 강력하게 구축했습니다. 주 상태에 대한 단점이 제거되었고 사용자가 잘못 입력 한다는 것은 사실상 불가능합니다. 브라우저의 기본 숫자 입력이 시도하는 것과 유사합니다.

필터는 Vue 1.0에 대해서는 여전히 제한적이므로 Vue 2.0으로의 업그레이드를 마무리 하겠습니다.

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

다음 사항을 알 수 있습니다.

- 양방향 필터의 숨겨진 동작 대신 라이프 사이클 훅 및 DOM 이벤트를 사용하여 입력의 모든 측면을 보다 명확하게 설명합니다.
- 우리는 이제`v-model`을 사용자 지정 입력에 직접 사용할 수 있습니다. 이는 일반적인 입력과 일관성이 있을뿐만 아니라 Vuex 친화적이라는 것을 의미합니다.
- 값을 반환해야하는 필터 옵션을 더 이상 사용하지 않으므로 실제로 통화 작업을 비동기 적으로 수행 할 수 있습니다. 즉, 통화로 작업 해야하는 앱이 많이 있다면이 로직을 공유 마이크로 서비스로 쉽게 리팩토링 할 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>
  코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>v-model</code>과 같은 디렉티브에 사용되는 필터의 예를 찾으십시오. 빠뜨린 경우 <strong>console errors</strong>도 표시되어야합니다.</p>
</div>
{% endraw %}

## 슬롯

### 중복 슬롯 <sup>제거됨</sup>

같은 템플릿 안에 같은 이름을 가진 `<slot>`을 더 이상 지원하지 않습니다. 슬롯이 렌더링 될 때 "사용"되고 같은 렌더링 트리의 다른 위치로 렌더링 될 수 없습니다. 여러 장소에서 같은 내용을 렌더링해야하는 경우 해당 내용을 prop로 전달하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>업그레이드 후 엔드 투 엔드 테스트 스위트 또는 앱을 실행하고 중복 슬롯 <code>v-model</code>에 대한 <strong>console warnings</strong>를 찾습니다.</p>
</div>
{% endraw %}

### `slot` 속성 스타일링 <sup>제거됨</sup>

이름이 `<slot>`인 삽입 된 내용은 더 이상 `slot` 속성을 유지하지 않습니다. 래퍼 요소를 사용하여 스타일을 지정하거나 고급 사용 사례의 경우 [렌더 함수](render-function.html)를 사용하여 프로그래밍 방식으로 삽입 된 내용을 수정하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 명명된 슬롯을 대상으로하는 CSS 선택자를 찾습니다 (예 : <code>[slot="my-slot-name"]</code>).</p>
</div>
{% endraw %}

## 특수 속성

### `keep-alive` 속성 <sup>대체</sup>

`keep-alive`는 더 이상 특별한 속성이 아니라 `<transition>`과 비슷한 래퍼 컴포넌트입니다.

예:

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

이렇게 하면 여러 조건부 하위에서 `<keep-alive>`를 사용할 수 있습니다.

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">`<keep-alive>`에 자식이 여러 개 있을 때, 그들은 결국 하나의 자식으로 계산 되어야합니다. 첫 번째 자식이 아닌 다른 자식은 무시됩니다.</p>

`<transition>`과 함께 사용하는 경우, 내부에 중첩시켜야합니다 :

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p><code>keep-alive</code> 속성을 찾으려면 코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하십시오.</p>
</div>
{% endraw %}

## 보간

### 속성을 이용한 보간 <sup>제거됨</sup>

속성을 이용한 보간은 이제 지원하지 않습니다.

``` html
<button class="btn btn-{{ size }}"></button>
```

인라인 구문을 사용하도록 변경 해야 합니다.

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

또는 데이터/계산 된 속성:

``` html
<button v-bind:class="buttonClasses"></button>
```

``` js
computed: {
  buttonClasses: function () {
    return 'btn btn-' + size
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 속성 내에서 사용되는 보간 예제를 찾으십시오.</p>
</div>
{% endraw %}

### HTML 보간 <sup>제거됨</sup>

HTML 보간은 (`{% raw %}{{{ foo }}}{% endraw %}`) 삭제되었습니다 [`v-html` 디렉티브](../api/#v-html)을 사용하세요.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>HTML 보간법을 찾으려면 코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하십시오.</p>
</div>
{% endraw %}

### 일회용 바인딩 <sup>대체</sup>

일회용 바인딩 (`{% raw %}{{* foo }}{% endraw %}`)은 [`v-once` 디렉티브](../api/#v-once)으로 변경되었습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>일회성 바인딩을 찾으려면 코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하십시오.</p>
</div>
{% endraw %}

## 반응형

### `vm.$watch` <sup>변경</sup>

`vm.$watch`를 통해 생성된 감시자는 이제 연결된 컴포넌트가 재 렌더링되기 전에 시작됩니다. 이렇게 하면 컴포넌트가 다시 렌더링되기 전에 상태를 추가로 업데이트하여 불필요한 업데이트를 피할 수 있습니다. 예를 들어, prop이 보이면 컴포넌트 prop를 보고 컴포넌트의 자체 데이터를 업데이트 할 수 있습니다.

이전에 컴포넌트 업데이트 후에 DOM을 사용하여 `vm.$watch`에 의존 하고 있었다면, 대신 `updated` 라이프 사이클 훅에서 그렇게 할 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>보유하고있는 엔드 투 엔드 테스트 스위트를 실행하십시오. <strong>실패한 테스트</strong>는 감지사가 이전 동작을 사용하고 있다는 사실을 알려줍니다.</p>
</div>
{% endraw %}

### `vm.$set` <sup>변경</sup>

`vm.$set` 는 이제 [`Vue.set`](../api/#Vue-set) 별칭입니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 이전 사용법의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `vm.$delete` <sup>변경</sup>

`vm.$delete` 는 이제 [`Vue.delete`](../api/#Vue-delete)의 별칭입니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper"> 마이그레이션 도우미 </a>를 실행하여 이전 사용법의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `Array.prototype.$set` <sup>제거됨</sup>

`Vue.set`을 사용하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 배열에서 <code>.$set</code>의 예를 찾으십시오. 누락 된 경우 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>제거됨</sup>

`Array.prototype.splice`을 사용하십시오

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

아니면, 더 나은 방법은 색인 제거 방법을 전달하는 것입니다.

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 배열에서 <code>.$remove</ code>의 예를 찾으십시오. 누락 된 경우 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### Vue 인스턴스의 `Vue.set` 와 `Vue.delete` <sup>제거됨</sup>

`Vue.set` 과 `Vue.delete`는 Vue 인스턴스에서 더 이상 작동하지 않습니다. 이제 데이터 옵션의 모든 최상위 반응형 특성을 올바르게 선언 해야 합니다. Vue 인스턴스 또는 `$data`에서 속성을 삭제하려면 null로 설정하면됩니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>Vue.set</code> 또는 <code>Vue.delete</code>를 참조하십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `vm.$data` 변경 <sup>제거됨</sup>

이제는 구성 요소 인스턴스의 루트 $data를 바꿀 수 없습니다. 이렇게하면 반응형 시스템의 일부 엣지 케이스를 방어하고 컴포넌트 상태를 보다 예측 가능하게 만듭니다 (특히 타입 체킹 시스템의 경우).

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>vm.$data</ code>를 덮어 쓴 예를 찾으십시오. 빠뜨리면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `vm.$get` <sup>제거됨</sup>

반응성 데이터를 직접 검색하면됩니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper"> 마이그레이션 도우미 </a>를 실행하여 <code>vm.$get</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

## DOM 중심 인스턴스 메소드

### `vm.$appendTo` <sup>제거됨</sup>

기본 DOM API 사용 :

``` js
myElement.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>vm.$appendTo</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `vm.$before` <sup>제거됨</sup>

기본 DOM API 사용 :

``` js
myElement.parentNode.insertBefore(vm.$el, myElement)
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>vm.$before</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `vm.$after` <sup>제거됨</sup>

기본 DOM API 사용 :

``` js
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
```

또는 `myElement`가 마지막 자식 인 경우 :

``` js
myElement.parentNode.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>
  코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>vm.$after</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `vm.$remove` <sup>제거됨</sup>

기본 DOM API 사용 :

``` js
vm.$el.remove()
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>vm.$remove</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

## 메타 인스턴스 메소드

### `vm.$eval` <sup>제거됨</sup>

실제로 사용하지 마십시오. 이 기능을 어떻게든 사용하고 문제를 해결하는 방법을 모르는 경우 [포럼](http://forum.vuejs.org/)에 문의하세요.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>vm.$eval</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>제거됨</sup>

실제로 사용하지 마십시오. 이 기능을 어떻게든 사용하고 문제를 해결하는 방법을 모르는 경우 [포럼](http://forum.vuejs.org/)에 문의하세요.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>vm.$interpolate</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

### `vm.$log` <sup>제거됨</sup>

최적의 디버깅 환경을 얻으려면 [Vue Devtools](https://github.com/vuejs/vue-devtools)를 사용하십시오.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper"> 마이그레이션 도우미 </a>를 실행하여 <code>vm.$log</code>의 예를 찾으십시오. 무엇이든 놓치면 <strong>console errors</strong>가 표시됩니다.</p>
</div>
{% endraw %}

## 인스턴스 DOM 옵션들

### `replace: false` <sup>제거됨</sup>

이제 컴포넌트는 바인딩 된 요소를 항상 바꿉니다. `replace:false` 의 동작을 시뮬레이트하기 위해, 당신은 대체하려는 것과 비슷한 엘리먼트로 루트 컴포넌트를 래핑 할 수 있습니다. 예:

``` js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

또는 렌더 함수와 함께:

``` js
new Vue({
  el: '#app',
  render: function (h) {
    h('div', {
      attrs: {
        id: 'app',
      }
    }, /* ... */)
  }
})
```

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>replace: false</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

## 전역 설정

### `Vue.config.debug` <sup>제거됨</sup>

더 이상 필요하지 않습니다. 경고는 기본적으로 스택 트레이서로 제공됩니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>Vue.config.debug</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>제거됨</sup>

렌더링 성능에 비동기가 필요합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>Vue.config.async</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>대체</sup>

이것은 [컴포넌트 수준 옵션](../api/#delimiters)으로 재 작성되었습니다. 이를 통해 타사 컴포넌트를 손상시키지 않으면 서 앱 내에서 다른 구분 기호를 사용할 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>Vue.config.delimiters</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>제거됨</sup>

HTML 보간은 [제거 되고 `v-html`를 사용합니다](#HTML-Interpolation-removed).

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>Vue.config.unsafeDelimiters</code>의 예를 찾으십시오. 그런 다음 도우미는 HTML 보간의 인스턴스를 찾아 `v-html`로 대체 할 수 있습니다.</p>
</div>
{% endraw %}

## 전역 API

### `Vue.extend` with `el` <sup>제거됨</sup>

el 옵션은 `Vue.extend` 에서 더 이상 사용할 수 없습니다. 인스턴스 생성 옵션으로 만 유효합니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>업그레이드 후 엔드 투 엔드 테스트 스위트 또는 앱을 실행하고 <code>Vue.extend</code>를 사용하여 <code>el</code> 옵션에 대한 <strong>console errors</strong>를 찾습니다.</p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>제거됨</sup>

대신 컴포넌트를 사용하세요

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>Vue.elementDirective</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}

### `Vue.partial` <sup>제거됨</sup>

컴포넌트 간의 더 명확한 데이터 흐름을 위해 파셜이 제거되었습니다. 성능이 중요한 영역에서 파셜을 사용하지 않는한, 대신 [일반 컴포넌트](components.html)를 사용하는 것이 좋습니다. 동적으로 파셜의 `name`  바인딩하는 경우 [동적 구성 요소](components.html#Dynamic-Components)를 사용할 수 있습니다.

앱의 성능이 중요한 부분에서 부분적으로 사용하는 경우 [함수형 컴포넌트](render-function.html#Functional-Components)로 업그레이드 해야 합니다. 그것들은 (`.vue` 파일 대신에) 일반 JS/JSX 파일에 있어야하며 파셜과 마찬가지로 상태가없고 인스턴스도 없습니다. 이것은 렌더링을 매우 빠르게 만듭니다.

파셜에 비해 함수형 컴포넌트의 이점은 JavaScript의 모든 기능에 대한 액세스 권한을 부여하기 때문에 훨씬 더 동적 일 수 있다는 것입니다. 그러나 이에는 따르는 비용이 있습니다. 이전에 렌더링 기능이있는 컴포넌트를 사용한 적이 없다면 배우기까지 조금 더 시간이 걸릴 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여<code>Vue.partial</code>의 예를 찾으십시오.</p>
</div>
{% endraw %}
