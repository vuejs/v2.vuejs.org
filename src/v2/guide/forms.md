---
title: 폼 입력 바인딩
type: guide
order: 10
---

## 기본 사용법

`v-model` 디렉티브를 사용하여 폼 input과 textarea 엘리먼트에 양방향 데이터 바인딩을 생성할 수 있습니다. 입력 유형에 따라 엘리먼트를 업데이트 하는 올바른 방법을 자동으로 선택합니다. 약간 이상하지만 `v-model`은 기본적으로 사용자 입력 이벤트에 대한 데이터를 업데이트하는 "syntax sugar"이며 일부 경우에 특별한 주의를 해야합니다.

<p class="tip">
`v-model`은 모든 form 엘리먼트의 초기 `value`와 `checked` 그리고 `selected` 속성을 무시합니다. 항상 Vue 인스턴스 데이터를 원본 소스로 취급합니다. 컴포넌트의 `data` 옵션 안에 있는 JavaScript에서 초기값을 선언해야합니다.
</p>

<p class="tip" id="vmodel-ime-tip">[IME](https://en.wikipedia.org/wiki/Input_method) (중국어, 일본어, 한국어 등)가 필요한 언어의 경우 IME 중 `v-model`이 업데이트 되지 않습니다. 이러한 업데이트를 처리하려면 `input` 이벤트를 대신 사용하십시오.</p>

### 문자열

``` html
<input v-model="message" placeholder="여기를 수정해보세요">
<p>메시지: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="여기를 수정해보세요">
  <p>메시지: {{ message }}</p>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

### 여러줄을 가진 문장

``` html
<span>여러 줄을 가지는 메시지:</span>
<p style="white-space: pre-line">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="여러줄을 입력해보세요"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>여러 줄을 가지는 메시지:</span>
  <<p style="white-space: pre-line">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="여러줄을 입력해보세요"></textarea>
</div>
<script>
new Vue({
  el: '#example-textarea',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

{% raw %}
<p class="tip">텍스트 영역의 보간 (<code>&lt;textarea&gt;{{ text }}&lt;/textarea&gt;</code>)은 작동하지 않습니다. 대신 <code>v-model</code>를 사용하십시오.</p>
{% endraw %}

### 체크박스

하나의 체크박스는 단일 boolean 값을 가집니다.

``` html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```
{% raw %}
<div id="example-2" class="demo">
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">{{ checked }}</label>
</div>
<script>
new Vue({
  el: '#example-2',
  data: {
    checked: false
  }
})
</script>
{% endraw %}

여러개의 체크박스는 같은 배열을 바인딩 할 수 있습니다

``` html
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>체크한 이름: {{ checkedNames }}</span>
<div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>체크한 이름: {{ checkedNames }}</span>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
</script>
{% endraw %}

### 라디오

``` html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>선택: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
</div>
<script>
new Vue({
  el: '#example-4',
  data: {
    picked: ''
  }
})
</script>
{% endraw %}

### 셀렉트

하나의 셀렉트

``` html
<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>선택함: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: ''
  }
})
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: ''
  }
})
</script>
{% endraw %}

<p class="tip">`v-model` 표현식의 초기 값이 어떤 옵션에도 없으면, `<select>` 엘리먼트는 "선택없음" 상태로 렌더링됩니다. iOS에서는 이 경우 변경 이벤트가 발생하지 않아 사용자가 첫 번째 항목을 선택할 수 없게됩니다. 따라서 위 예제처럼 사용하지 않는 옵션에 빈 값을 넣는 것이 좋습니다.</p>

다중 셀렉트 (배열을 바인딩 합니다):


``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selected: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-6',
  data: {
    selected: []
  }
})
</script>
{% endraw %}

`v-for`를 이용한 동적 옵션 렌더링

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
```
{% raw %}
<div id="example-7" class="demo">
  <select v-model="selected">
    <option v-for="option in options" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## 값 바인딩하기

라디오, 체크박스 및 셀렉트 옵션의 경우, `v-model` 바인딩 값은 보통 정적인 문자열(또는 체크 박스의 boolean) 입니다.

``` html
<!-- `picked` 는 선택시 문자열 "a" 입니다 -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` 는 true 또는 false 입니다 -->
<input type="checkbox" v-model="toggle">

<!-- `selected`는 "ABC" 선택시 "abc" 입니다 -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

그러나 때로 값을 Vue 인스턴스에 동적 속성에 바인딩 해야할 수 있습니다. `v-bind`를 사용할 수 있습니다. `v-bind`를 사용하면 입력 값을 문자열이 아닌 값에 바인딩 할 수도 있습니다.

### 체크박스

``` html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b"
>
```

``` js
// 체크 하면:
vm.toggle === vm.a
// 체크하지 않으면:
vm.toggle === vm.b
```

### 라디오

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// 체크 하면:
vm.pick === vm.a
```

### 셀렉트 옵션

``` html
<select v-model="selected">
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// 선택 하면:
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

## 수식어

### `.lazy`

기본적으로, `v-model`은 각 입력 이벤트 후 입력과 데이터를 동기화 합니다. (단 [앞에서 설명](#vmodel-ime-tip)한 IME 구성은 제외됩니다.) `.lazy` 수식어를 추가하여 `change` 이벤트 이후에 동기화 할 수 있습니다.

``` html
<!-- "input" 대신 "change" 이후에 동기화 됩니다. -->
<input v-model.lazy="msg" >
```

### `.number`

사용자 입력이 자동으로 숫자로 형변환 되기를 원하면, `v-model`이 관리하는 input에 `number` 수식어를 추가하면 됩니다.

``` html
<input v-model.number="age" type="number">
```

`type="number"`를 사용하는 경우에도 HTML 입력 엘리먼트의 값은 항상 문자열을 반환하기 때문에 이것은 종종 유용하게 사용할 수 있습니다.

### `.trim`

`v-model`이 관리하는 input을 자동으로 trim 하기 원하면, `trim` 수정자를 추가하면 됩니다.

```html
<input v-model.trim="msg">
```

## `v-model` 과 컴포넌트

> Vue의 컴포넌트에 익숙하지 않으면 지금은 보지 않아도 괜찮습니다.

HTML의 기본 제공 input 유형이 항상 사용자의 요구를 만족시킬 수는 없습니다. 다행히 Vue 컴포넌트를 사용하면 완전히 사용자 정의 된 동작으로 재사용 가능한 input을 만들 수 있습니다. 이 input은 `v-model`에도 작동합니다! 자세한 컴포넌트 가이드의 [사용자 정의 입력](components.html#Form-Input-Components-using-Custom-Events)을 참조하십시오.
