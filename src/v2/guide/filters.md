---
title: 필터
type: guide
order: 305
---

Vue는 텍스트 형식화를 적용할 수 있는 필터를 지원합니다. 이 필터들은 **중괄호 보간법 혹은 `v-bind`표현법** 을 이용할 때 사용가능합니다. (`v-bind` 표현법에서는 2.1.0+ 부터 사용 가능합니다.) 필터는 자바스크립트 표현식 마지막에 "파이프"심볼과 함께 추가되어야 합니다.

``` html
<!-- 중괄호 보간법 -->
{{ message | capitalize }}

<!-- v-bind 표현 -->
<div v-bind:id="rawId | formatId"></div>
```

컴포넌트 옵션에서 로컬 필터를 정의할 수 있습니다.

``` js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

or define a filter globally:

``` js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

필터의 함수는 항상 표현식의 값(이전 체이닝의 결과)를 첫번째 전달인자로 받습니다. 위의 예제에서 `capitalize` 필터 함수는 `message`가 첫번째 전달인자로 받습니다.

필터는 체이닝 할 수 있습니다.

``` html
{{ message | filterA | filterB }}
```

위와 같은 경우에, 하나의 인수를 받는 `filterA`는 `message`값을 받을 것이고 `filterA`가 `message`와 함께 실행된 결과가 `filterB`에 넘겨질 것입니다.

필터는 기본적으로 자바스크립트 함수이기 때문에 두개 이상의 인수를 받을 수 있습니다.

``` html
{{ message | filterA('arg1', arg2) }}
```

여기서 `filterA`는 세개의 인수를 받는 함수로 정의되었습니다. `message`의 값은 첫번째 인수로 전달될 것이며, 순수 문자열인 `'arg1'`은 두번째 인수로 전달될 것이며, 자바스크립트 표현식인 `arg2`는 표현식이 실행된 이후에 세번째 인수로 전달될 것입니다.
