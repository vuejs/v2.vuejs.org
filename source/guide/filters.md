title: Filters
type: guide
order: 4
---

## Synopsis

Vue.js 필터는 기본적으로 값을 받아, 처리하고, 처리된 값을 반환하는 함수입니다. 마크업에서는 단일 파이프 (`|`)로 표현되며, 한개 이상의 인자가 붙을 수 있습니다.

``` html
<element directive="expression | filterId [args...]"></element>
```

## Examples

필터는 directive의 값의 끝에 붙어야 합니다.

``` html
<span v-text="message | capitalize"></span>
```

mustache 스타일의 바인딩 안에서도 사용할 수 있습니다.

``` html
<span>{{message | uppercase}}</span>
```

여러 필터를 체이닝하는 것도 가능합니다.

``` html
<span>{{message | lowercase | reverse}}</span>
```

## Arguments

어떤 필터는 선택적인 인자를 받을 수 있습니다. 인자는 공백에 의해 구별합니다.

``` html
<span>{{order | pluralize 'st' 'nd' 'rd' 'th'}}</span>
```

``` html
<input v-on="keyup: submitForm | key 'enter'">
```

일반 문자열 인자는 홀따옴표로 감쌀 필요가 있습니다. 감싸지 않은 인자는 현재
데이터 스코프에서 동적으로 평가됩니다. 여기에 대한 더 자세한 이야기는 사용자정의 필터에서 다시 다루겠습니다.

위의 예제에 사용된 필터들의 자세한 설명은 [full list of built-in filters](/api/filters.html)를 참조하세요.

이제 directives와 filters를 알았으니 어려운 일을 해보도록 합시다. [아이템의 목록을 표시](/guide/list.html)해 보세요.
