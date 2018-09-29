---
title: computed와 watch
type: guide
order: 5
---

## computed 속성

템플릿 내에 표현식을 넣으면 편리합니다. 하지만 간단한 연산일 때만 이용하는 것이 좋습니다. 너무 많은 연산을 템플릿 안에서 하면 코드가 비대해지고 유지보수가 어렵습니다. 아래의 예를 봅시다.

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

이 템플릿은 더 이상 간단하고 명료하지 않습니다. `message`를 역순으로 표시한다는 것을 알려면 찬찬히 살펴봐야 하겠죠. 템플릿에 메시지를 역순으로 표시할 일이 더 있으면 문제는 더 악화될 것입니다.

복잡한 로직이라면 반드시 **computed 속성** 을 사용해야 하는 이유입니다.

### 기본 예제

``` html
<div id="example">
  <p>원본 메시지: "{{ message }}"</p>
  <p>역순으로 표시한 메시지: "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '안녕하세요'
  },
  computed: {
    // 계산된 getter
    reversedMessage: function () {
      // `this` 는 vm 인스턴스를 가리킵니다.
      return this.message.split('').reverse().join('')
    }
  }
})
```

결과:

{% raw %}
<div id="example" class="demo">
  <p>원본 메시지: "{{ message }}"</p>
  <p>역순으로 표시한 메시지: "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: '안녕하세요'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

이 예제에서는 computed 속성인 `reversedMessage`를 선언했습니다. 우리가 작성한 함수는 `vm.reversedMessage`속성에 대한 getter 함수로 사용됩니다.

``` js
console.log(vm.reversedMessage) // => '요세하녕안'
vm.message = 'Goodbye'
console.log(vm.reversedMessage) // => 'eybdooG'
```

콘솔에서 이 예제를 직접 해볼 수 있습니다. `vm.reversedMessage`의 값은 항상 `vm.message`의 값에 의존합니다.

일반 속성처럼 computed 속성에도 템플릿에서 데이터 바인딩 할 수 있습니다. Vue는 `vm.reversedMessage`가 `vm.message`에 의존하는 것을 알고 있기 때문에 `vm.message`가 바뀔 때 `vm.reversedMessage`에 의존하는 바인딩을 모두 업데이트할 것입니다. 그리고 가장 중요한 것은 우리가 선언적으로(역자 주: 선언형 패러다임에 따라서, 즉 이 데이터의 정의는 이러하다라고 해서) 의존 관계를 만들었다는 것입니다. computed 속성의 getter 함수는 사이드 이펙트가 없어 코드를 테스트하거나 이해하기 쉽습니다.

### computed 속성의 캐싱 vs 메소드

표현식에서 메소드를 호출하여 같은 결과를 얻을 수도 있습니다.

``` html
<p>뒤집힌 메시지: "{{ reversedMessage() }}"</p>
```

``` js
// 컴포넌트 내부
methods: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

computed 속성 대신 메소드와 같은 함수를 정의할 수도 있습니다. 최종 결과에 대해 두 가지 접근 방식은 서로 동일합니다. 차이점은 **computed 속성은 종속 대상을 따라 저장(캐싱)된다는 것**  입니다. computed 속성은 해당 속성이 종속된 대상이 변경될 때만 함수를 실행합니다. 즉 `message`가 변경되지 않는 한, computed 속성인 `reversedMessage`를 여러 번 요청해도 계산을 다시 하지 않고 계산되어 있던 결과를 즉시 반환합니다.

또한 `Date.now()`처럼 아무 곳에도 의존하지 않는 computed 속성의 경우 절대로 업데이트되지 않는다는 뜻입니다.

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

이에 비해 메소드를 호출하면 렌더링을 다시 할 때마다 **항상** 함수를 실행합니다.

캐싱이 왜 필요할까요? 계산에 시간이 많이 걸리는 computed 속성인 **A**를 가지고 있다고 해봅시다. 이 속성을 계산하려면 거대한 배열을 반복해서 다루고 많은 계산을 해야 합니다. 그런데 **A** 에 의존하는 다른 computed 속성값도 있을 수 있습니다. 캐싱을 하지 않으면 **A** 의 getter 함수를 꼭 필요한 것보다 더 많이 실행하게 됩니다! 캐싱을 원하지 않는 경우 메소드를 사용하십시오.

### computed 속성 vs watch 속성

Vue는 Vue 인스턴스의 데이터 변경을 관찰하고 이에 반응하는 보다 일반적인 **watch 속성**을 제공합니다. 다른 데이터 기반으로 변경할 필요가 있는 데이터가 있는 경우, 특히 AngularJS를 사용하던 경우 `watch`를 남용하는 경우가 있습니다. 하지만 명령적인 `watch` 콜백보다 계산된 속성을 사용하는 것이 더 좋습니다.(역자 주: watch 속성은 감시할 데이터를 지정하고 그 데이터가 바뀌면 이런 함수를 실행하라는 방식으로 소프트웨어 공학에서 이야기하는 '명령형 프로그래밍' 방식. computed 속성은 계산해야 하는 목표 데이터를 정의하는 방식으로 소프트웨어 공학에서 이야기하는 '선언형 프로그래밍' 방식.) 다음 예제를 살펴봅시다.

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

위의 코드는 명령형이고 또 코드를 반복합니다. computed 속성을 사용하는 방식과 비교해 보세요.

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

더 낫지 않나요?(역자 주: 일반적으로 선언형 프로그래밍이 명령형 프로그래밍보다 코드 반복이 적은 등 우수하다고 평가하는 경향이 있음.)

### computed 속성의 setter 함수

computed 속성은 기본적으로 getter 함수만 가지고 있지만, 필요한 경우 setter 함수를 만들어 쓸 수 있습니다.

``` js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },/
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

이제 `vm.fullName = 'John Doe'`를 실행하면 설정자가 호출되고 `vm.firstName`과 `vm.lastName`이 그에 따라 업데이트 됩니다.

## watch 속성

대부분의 경우 computed 속성이 더 적합하지만 사용자가 만든 감시자가 필요한 경우가 있습니다. 그래서 Vue는 `watch` 옵션을 통해 데이터 변경에 반응하는 보다 일반적인 방법을 제공합니다. 이는 데이터 변경에 대한 응답으로 비동기식 또는 시간이 많이 소요되는 조작을 수행하려는 경우에 가장 유용합니다.

예제 입니다.

``` html
<div id="watch-example">
  <p>
    yes/no 질문을 물어보세요:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- 이미 Ajax 라이브러리의 풍부한 생태계와 범용 유틸리티 메소드 컬렉션이 있기 때문에, -->
<!-- Vue 코어는 다시 만들지 않아 작게 유지됩니다. -->
<!-- 이것은 이미 익숙한 것을 선택할 수 있는 자유를 줍니다. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: '질문을 하기 전까지는 대답할 수 없습니다.'
  },
  watch: {
    // 질문이 변경될 때 마다 이 기능이 실행됩니다.
    question: function (newQuestion) {
      this.answer = '입력을 기다리는 중...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce는 lodash가 제공하는 기능으로
    // 특히 시간이 많이 소요되는 작업을 실행할 수 있는 빈도를 제한합니다.
    // 이 경우, 우리는 yesno.wtf/api 에 액세스 하는 빈도를 제한하고,
    // 사용자가 ajax요청을 하기 전에 타이핑을 완전히 마칠 때까지 기다리길 바랍니다.
    // _.debounce 함수(또는 이와 유사한 _.throttle)에 대한
    // 자세한 내용을 보려면 https://lodash.com/docs#debounce 를 방문하세요.
    getAnswer: _.debounce(
      function () {
        if (this.question.indexOf('?') === -1) {
          this.answer = '질문에는 일반적으로 물음표가 포함 됩니다. ;-)'
          return
        }
        this.answer = '생각중...'
        var vm = this
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = '에러! API 요청에 오류가 있습니다. ' + error
          })
      },
      // 사용자가 입력을 기다리는 시간(밀리세컨드) 입니다.
      500
    )
  }
})
</script>
```

Result:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    yes/no 질문을 물어보세요:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: '질문을 하기 전까지는 대답할 수 없습니다'
  },
  watch: {
    question: function (newQuestion, oldQuestion) {
      this.answer = '입력을 기다리는 중...'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = '질문에는 일반적으로 물음표가 포함 됩니다. ;-)'
          return
        }
        vm.answer = '생각중...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = '에러! API 요청에 오류가 있습니다. ' + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}


이 경우 `watch` 옵션을 사용하면 비동기 연산 (API 엑세스)를 수행하고, 우리가 그 연산을 얼마나 자주 수행하는지 제한하고, 최종 응답을 얻을 때까지 중간 상태를 설정할 수 있습니다. 계산된 속성은 이러한 기능을 수행할 수 없습니다.

`watch` 옵션 외에도 명령형 [vm.$watch API](../api/#vm-watch)를 사용할 수 있습니다.
