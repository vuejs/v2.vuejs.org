---
title: 리스트 렌더링
type: guide
order: 8
---

## `v-for`

`v-for` 디렉티브를 사용하여 배열을 기반으로 리스트를 렌더링 할 수 있습니다. `v-for` 디렉티브는 `item in items` 형태로 특별한 문법이 필요합니다. 여기서 `items`는 원본 데이터 배열이고 `item`은 반복되는 배열 엘리먼트의 **별칭** 입니다.

### 기본 사용방법

``` html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

결과:

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.message}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-1'))
    }
  }
})
</script>
{% endraw %}

`v-for` 블록 안에는 부모 범위 속성에 대한 모든 권한이 있습니다. `v-for`는 또한 현재 항목의 인덱스에 대한 두 번째 전달인자 옵션을 제공합니다.

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

결과:

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-2'))
    }
  }
})
</script>
{% endraw %}

`in` 대신에 `of`를 구분자로 사용할 수 있습니다. 그래서 JavaScript의 이터레이터에 대한 자바스크립트 구문과 유사합니다.


``` html
<div v-for="item of items"></div>
```

### `v-for` 템플릿

템플릿 `v-if`와 마찬가지로, `v-for`와 함께 `<template>` 태그를 사용하여 여러 엘리먼트의 블럭을 렌더링 할 수 있습니다. 예를 들어,

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

### `v-for`와 객체

`v-for`를 사용하여 객체의 속성을 반복할 수도 있습니다.

``` html
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
```

결과:

{% raw %}
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

키의 두번째 전달 인자를 제공할 수도 있습니다.

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

그리고 또 인덱스도 제공합니다

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">객체를 반복할 때 순서는 `Object.keys()`의 키 나열 순서에 따라 결정됩니다. 이 순서는 JavaScript 엔진 구현간에 **일관적이지는 않습니다.**</p>

### Range `v-for`

`v-for`는 정수를 사용할 수 있습니다. 이 경우 템플릿을 여러번 반복 합니다.

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

결과:

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
new Vue({ el: '#range' })
</script>
{% endraw %}

### 컴포넌트와 `v-for`


> 이 섹션에서는 [컴포넌트](components.html)에 대한 지식이 있다고 가정합니다. 나중에 읽어도 좋습니다.

일반 엘리먼트 처럼 사용자 정의 컴포넌트에서 `v-for`를 직접 사용할 수 있습니다.

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> 2.2.0버전 이후로, `v-for`를 사용할 때 [`key`](list.html#key)가 반드시 있어야 합니다.

그러나 컴포넌트에서는 그 범위가 분리되어 있기 때문에 컴포넌트에 데이터를 자동으로 전달하지 않습니다. 반복된 데이터를 컴포넌트를 전달하려면 props를 사용해야 합니다.

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id">
</my-component>
```

컴포넌트에 `item`을 자동으로 주입하지 않는 이유는 컴포넌트가 `v-for` 작동 방식과 밀접하게 결합되기 때문입니다. 데이터의 출처를 명시적으로 표현하면 다른 상황에서는 컴포넌트를 재사용할 수 있습니다.

간단한 할일 목록 예제를 보겠습니다.

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="index"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="index"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}

### `v-for`와 `v-if`

같은 노드에 존재할 때, `v-for`는 `v-if`보다 더 높은 우선 순위를 가집니다. 즉,`v-if`는 루프의 각 반복마다 실행될 것입니다. 이는 다음과 같이 _일부_ 항목 만 노드를 렌더링하려는 경우 매우 유용합니다.


``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

위의 경우에만 완료되지 않은 todo가 렌더링 됩니다.

대신 루프의 실행을 조건부로 건너뛰는 것이 목적이면 `v-if`를 래퍼 엘리먼트로 옮기면(또는 [`<template>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt)사용) 됩니다.

``` html
<ul v-if="shouldRenderTodos">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
```

## `key`

Vue가 `v-for`에서 렌더링된 엘리먼트 목록을 갱신할 때 기본적으로 "in-place patch" 전략을 사용합니다. 데이터 항목의 순서가 변경된 경우 항목의 순서와 일치하도록 DOM 요소를 이동하는 대신 Vue는 각 요소를 적절한 위치에 패치하고 해당 인덱스에서 렌더링할 내용을 반영하는지 확인합니다. 이것은 Vue 1.x의 `track-by=$index`의 동작과 유사하다.

이 기본 모드는 효율적이지만 **목록의 출력 결과가 하위 컴포넌트 상태 또는 임시 DOM 상태(예: 폼 input)에 의존하지 않는 경우에** 적합합니다.

Vue가 각 노드의 ID를 추적하고 기존 엘리먼트를 재사용하고 재정렬할 수 있도록 힌트를 제공하려면 각 항목에 고유한 `key` 속성을 제공해야 합니다. `key`에 대한 이상적인 값은 각 항목의 고유한 ID입니다. 이 특별한 속성은 1.x 버전의 `track-by`와 거의 비슷하지만 속성처럼 작동하기 떄문에 `v-bind`를 사용하여 동적 값에 바인딩 해야합니다. (여기서는 약어를 이용합니다.)

``` html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

반복되는 DOM 내용이 단순하지 않거나 의도적인 성능 향상을 위해 기본 동작에 의존하지 않는한 가능하면 언제나 `v-for`에 `key`를 추가하는 것이 좋습니다.

`key`는 Vue가 노드를 식별하는 일반적인 메커니즘이기 때문에 `v-for`에 특별히 연관되지 않은 다른 용도로 사용합니다.

## 배열 변경 감지

### 변이 메소드

Vue는 감시중인 배열의 변이 메소드를 래핑하여 뷰 갱신을 트리거합니다. 래핑된 메소드는 다음과 같습니다.

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

콘솔을 열고 이전 예제의 `items` 배열로 변이 메소드를 호출하여 재생할 수 있습니다. 예: `example1.items.push({ message: 'Baz' })`

### 배열 대체

이름에서 알 수 있듯 변이 메소드는 호출된 원본 배열을 변형합니다. 이와 비교하여 변형을 하지 않는 방법도 있습니다. 바로 `filter()`, `concat()` 와 `slice()` 입니다. 이 방법을 사용하면 원본 배열을 변형하지 않고 **항상 새 배열을 반환합니다.** 변형이 없는 방법으로 작업할 때 이전 배열을 새 배열로 바꿀 수 있습니다.

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

이렇게 하면 Vue가 기존 DOM을 버리고 전체 목록을 다시 렌더링 한다고 생각할 수 있습니다. 다행히도, 그렇지는 않습니다. Vue는 DOM 요소 재사용을 극대화하기 위해 몇가지 똑똑한 구현을 하므로 배열을 겹치는 객체가 포함된 다른 배열로 대체하여 효율적입니다.

### 주의 사항

JavaScript의 제한으로 인해 Vue는 배열에 대해 다음과 같은 변경 사항을 감지할 수 **없습니다.**

1. 인덱스로 배열에 있는 항목을 직접 설정하는 경우, 예: `vm.items[indexOfItem] = newValue`
2. 배열 길이를 수정하는 경우, 예: `vm.items.length = newLength`

주의 사항 중 1번을 극복하기 위해 다음 두 경우 모두 `vm.items[indexOfItem] = newValue` 와 동일하게 수행하며, 반응형 시스템에서도 상태 변경을 트리거 합니다.

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
example1.items.splice(indexOfItem, 1, newValue)
```

주의 사항 중 2번을 극복하기 위해 `splice`를 사용해야 합니다.

``` js
example1.items.splice(newLength)
```

## 필터링 / 정렬 된 결과 표시하기

때로 원본 데이터를 실제로 변경하거나 재설정하지 않고 배열의 필터링 된 버전이나 정렬된 버전을 표시해야 할 필요가 있습니다. 이 경우 필터링 된 배열이나 정렬된 배열을 반환하는 계산된 속성을 만들 수 있습니다.

예:

``` html
<li v-for="n in evenNumbers">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

계산된 속성을 실행할 수 없는 상황(예: 중첩 된 `v-for` 루프 내부)에서는 다음 방법을 사용할 수 있습니다.

``` html
<li v-for="n in even(numbers)">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```
