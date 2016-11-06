---
title: Form Input Bindings
type: guide
order: 10
---

## Basic Usage

You can use the `v-model` directive to create two-way data bindings on form input and textarea elements. It automatically picks the correct way to update the element based on the input type. Although a bit magical, `v-model` is essentially syntax sugar for updating data on user input events, plus special care for some edge cases.

<p class="tip">`v-model` doesn't care about the initial value provided to an input or a textarea. It will always treat the Vue instance data as the source of truth.</p>

### Text

``` html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="edit me">
  <p>Message is: {{ message }}</p>
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

### Multiline text

``` html
<span>Multiline message is:</span>
<p style="white-space: pre">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Multiline message is:</span>
  <p style="white-space: pre">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="add multiple lines"></textarea>
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
<p class="tip">Interpolation on textareas (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) won't work. Use <code>v-model</code> instead.</p>
{% endraw %}

### Checkbox

Single checkbox, boolean value:

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

Multiple checkboxes, bound to the same Array:

``` html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ checkedNames }}</span>
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
  <span>Checked names: {{ checkedNames }}</span>
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

### Radio


``` html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Picked: {{ picked }}</span>
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

### Select

Single select:

``` html
<select v-model="selected">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {{ selected }}</span>
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
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
    selected: null
  }
})
</script>
{% endraw %}

Multiple select (bound to Array):

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
  <select v-model="selected" multiple style="width: 50px">
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

Dynamic options rendered with `v-for`:

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

## Value Bindings

For radio, checkbox and select options, the `v-model` binding values are usually static strings (or booleans for checkbox):

``` html
<!-- `picked` is a string "a" when checked -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` is either true or false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` is a string "abc" when selected -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

But sometimes we may want to bind the value to a dynamic property on the Vue instance. We can use `v-bind` to achieve that. In addition, using `v-bind` allows us to bind the input value to non-string values.

### Checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b"
>
```

``` js
// when checked:
vm.toggle === vm.a
// when unchecked:
vm.toggle === vm.b
```

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// when checked:
vm.pick === vm.a
```

### Select Options

``` html
<select v-model="selected">
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// when selected:
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

## Modifiers

### `.lazy`

By default, `v-model` syncs the input with the data after each `input` event. You can add the `lazy` modifier to instead sync after `change` events:

``` html
<!-- synced after "change" instead of "input" -->
<input v-model.lazy="msg" >
```

### `.number`

If you want user input to be automatically typecast as a number, you can add the `number` modifier to your `v-model` managed inputs:

``` html
<input v-model.number="age" type="number">
```

This is often useful, because even with `type="number"`, the value of HTML input elements always returns a string.

### `.trim`

If you want user input to be trimmed automatically, you can add the `trim` modifier to your `v-model` managed inputs:

```html
<input v-model.trim="msg">
```

## `v-model` with Components

> If you're not yet familiar with Vue's components, just skip this for now.

HTML's built-in input types won't always meet your needs. Fortunately, Vue components allow you to build reusable inputs with completely customized behavior. These inputs even work with `v-model`! To learn more, read about [custom inputs](components.html#Form-Input-Components-using-Custom-Events) in the Components guide.







