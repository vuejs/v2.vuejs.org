---
title: Работа с Формами
type: guide
order: 10
---

## Базовое использование

Вы можете использовать директиву `v-model` для создания двунаправленного связывания с элементами форм input и textarea. Корректный способ обновления элемента выбирается автоматически основываясь на типе элемента. Несмотря на слегка волшебный вид, `v-model` в действительности является лишь синтаксическим сахаром для обновления данных в элементах ввода данных пользователем, с некоторыми поправками в ряде пограничных случаев.

<p class="tip">Для `v-model` не имеет значение изначальное значение элемента input или textarea. В качестве источника истины всегда рассматриваются данные инстанса Vue.</p>

### Текст

``` html
<input v-model="message" placeholder="edit me">
<p>Введённое сообщение: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="отредактируй меня">
  <p>Введённое сообщение: {{ message }}</p>
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

### Многострочный текст

``` html
<span>Введённое многострочное сообщение:</span>
<p style="white-space: pre">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="добавь ко мне несколько строчек"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Введённое многострочное сообщение:</span>
  <p style="white-space: pre">{{ message }}</p><br>
  <textarea v-model="message" placeholder="добавь ко мне несколько строчек"></textarea>
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
<p class="tip">Интерполяция внутри тега textarea (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) не будет работать. Используйте вместо этого директиву <code>v-model</code></p>
{% endraw %}

### Чекбоксы

Одиночный чекбокс, булево значение:

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

Множество чекбоксов, привязанных к одному и тому же массиву:

``` html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Отмеченные имена: {{ checkedNames }}</span>
```

``` js
new Vue({
  el: '...',
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
  <span>Отмеченные имена: {{ checkedNames }}</span>
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

### Радиокнопки


``` html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Выбрано: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Выбрано: {{ picked }}</span>
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

### Выпадающие списки выбора

Выбор единственной возможности:

``` html
<select v-model="selected">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Выбрано: {{ selected }}</span>
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Выбрано: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: null
  }
})
</script>
{% endraw %}

Выбор нескольких возможностей (с привязкой к массиву):

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Выбрано: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Выбрано: {{ selected }}</span>
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

Динамическое отображение опций посредством `v-for`:

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Выбрано: {{ selected }}</span>
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
  <span>Выбрано: {{ selected }}</span>
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

## Связывание значений

Для радиокнопок, чекбоксов и выпадающих списков выбора, в качестве параметров `v-model` обычно указываются статические строки (или булевы значения, для чекбоксов):

``` html
<!-- `picked` получает строковое значение "a" при клике -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` может иметь значение true или false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` при выборе становится равным строке "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Но иногда нам хотелось бы связать значение с динамическим свойством инстанса Vue. Мы можем использовать `v-bind` для этого. Кроме того, использование `v-bind` позволяет нам связать значение поля ввода с не-строковыми величинами.

### Чекбокс

``` html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b">
```

``` js
// если отмечено:
vm.toggle === vm.a
// если отметка снята:
vm.toggle === vm.b
```

### Радиокнопки

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// если отмечено:
vm.pick === vm.a
```

### Списки выбора

``` html
<select v-model="selected">
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// когда выбрано:
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

## Модификаторы

### `.lazy`

По умолчанию, `v-model` синхронизирует ввод с данными на каждое событие `input`. Вы можете указать модификатор `lazy` чтобы вместо этого использовать для синхронизации события `change`:

``` html
<!-- синхронизируется после "change", а не "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Если вы хотите автоматически приводить пользовательский ввод к числу, добавьте модификатор `number`:

``` html
<input v-model.number="age" type="number">
```

Зачастую это оказывается полезным, так как даже при указанном аттрибуте `type="number"` значением HTML input'а всегда является строка.

### `.trim`

Если вы хотите автоматически обрезать пробелы в начале и в конце введённой строки, используйте модификатор `trim`:

```html
<input v-model.trim="msg">
```