---
title: 表单 input 绑定
type: guide
order: 10
---

## 基础用法

可以通过使用 `v-model` 指令，在表单 input 和 textarea 元素上创建双向数据绑定。`v-model` 指令可以根据 input 的 type 类型，自动地以正确的方式更新元素。虽然略显神奇，然而本质上 `v-model` 不过是「通过监听用户的 input 事件来更新数据」的语法糖，以及对一些边界情况做特殊处理。

<p class="tip">`v-model` 会忽略所有表单元素中 `value`, `checked` 或 `selected` 属性上初始设置的值，而总是将 Vue 实例中的 data 作为真实数据来源。因此你应该在 JavaScript 端的组件 `data` 选项中声明这些初始值，而不是 HTML 端。</p>

<p class="tip" id="vmodel-ime-tip">对于需要使用[输入法](https://zh.wikipedia.org/wiki/%E8%BE%93%E5%85%A5%E6%B3%95)的语言（中文、日文、韩文等），你会发现，在输入法字母组合窗口输入时，`v-model` 并不会触发数据更新。如果你想在此输入过程中，满足更新数据的需求，请使用 `input` 事件。</p>

### 单行文本(text)

``` html
<input v-model="message" placeholder="编辑">
<p>message 是：{{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="编辑">
  <p>message 是：{{ message }}</p>
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

### 多行文本(multiple text)

``` html
<span>多行 message 是：</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="添加多行"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>多行 message 是：</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="添加多行"></textarea>
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
<p class="tip">在 textarea 中插值（<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>）并不会生效。使用 <code>v-model</code> 来替代。</p>
{% endraw %}

### checkbox

单选 checkbox，绑定到布尔值：

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

多选 checkbox，绑定到同一个数组：

``` html
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>勾选的名字是：{{ checkedNames }}</span>
</div>
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
  <span>勾选的名字是：{{ checkedNames }}</span>
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

### radio

``` html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>选中的是：{{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>选中的是：{{ picked }}</span>
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

### select

单选 select：

``` html
<select v-model="selected">
  <option disabled value="">请选择其中一项</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>选中的是：{{ selected }}</span>
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
    <option disabled value="">请选择其中一项</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>选中的是：{{ selected }}</span>
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

<p class="tip">如果 `v-model` 表达式的初始值，不能与任何 option 选项匹配，`<select>` 元素将会渲染为“未选中”状态。在 iOS 中，这会导致用户无法选中第一项，因为在这种“未选中”状态的情况下，iOS 不会触发 change 事件。因此，推荐按照上面的示例，预先提供一个 value 为空字符串的禁用状态的 option 选项。</p>

多选 select（绑定到一个数组）：

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>选中的是：{{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>选中的是：{{ selected }}</span>
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

使用 `v-for` 渲染动态的 option：

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>选中的是：{{ selected }}</span>
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
  <span>选中的是：{{ selected }}</span>
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

## 与 value 属性绑定

对于 radio, checkbox 和 select 的 option 选项，通常可以将 `v-model` 与值是静态字符串的 value 属性关联在一起（或者，在 checkbox 中，绑定到布尔值）：

``` html
<!-- 当选中时，`picked` 的值是字符串 "a"（译者注：如果没有 value 属性，选中时值是 null） -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` 的值是 true 或 false -->
<input type="checkbox" v-model="toggle">

<!-- 当选中第一个选项时，`selected` 的值是字符串 "abc"（译者注：如果没有 value 属性，选中时 selected 值是 option 元素内的文本） -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

然而，有时可能需要把 value 与 Vue 实例上的一个动态属性绑定在一起。这时我们可以通过 `v-bind` 来实现。`v-bind` 还允许我们将 input 元素的值绑定到非字符串值。

### checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>
```

``` js
// 选中时：
vm.toggle === 'yes'
// 没有选中时：
vm.toggle === 'no'
```

<p class="tip">`true-value` 和 `false-value` 属性不会影响到 input 元素的 `value` 属性，这是因为浏览器在提交表单时，并不会包含未被选中的 checkbox 的值。如果要确保表单中，这两个值的一个能够被提交（例如 "yes" 或 "no"），请换用类型是 radio 的 input 元素。</p>

### radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// 选中时
vm.pick === vm.a
```

### select 选项

``` html
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// 选中时：
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## 修饰符(modifiers)

### `.lazy`

默认情况下，`v-model` 会在每次 `input` 事件触发之后，将数据同步至 input 元素中（除了[上述](#vmodel-ime-tip)提到的输入法组合文字时不会）。可以添加 `lazy` 修饰符，从而转为在触发 `change` 事件后同步：

``` html
<!-- 在触发 "change" 事件后同步，而不是在触发 "input" 事件后更新 -->
<input v-model.lazy="msg" >
```

### `.number`

如果想要将用户的输入，自动转换为 Number 类型（译注：如果转换结果为 NaN 则返回字符串类型的输入值），可以在 `v-model` 之后添加一个 `number` 修饰符，来处理输入值：

``` html
<input v-model.number="age" type="number">
```

这通常很有用，因为即使是在 `type="number"` 时，HTML 中 input 元素也总是返回一个字符串类型的值。

### `.trim`

如果想要将用户的输入，自动过滤掉首尾空格，可以在 `v-model` 之后添加一个 `trim` 修饰符，来处理输入值：

```html
<input v-model.trim="msg">
```

## 在组件上使用 `v-model`

> 如果你还不熟悉 Vue 组件，现在先跳过此处。

HTML 内置的几种 input 类型有时并不总能满足需求。幸运的是，使用 Vue 可以创建出可复用的输入框组件，并且能够完全自定义组件的行为。这些输入框组件甚至可以使用 `v-model`！想要了解更多信息，请阅读组件指南中[自定义输入框](components.html#使用自定义事件的表单输入组件(Form Input Components using Custom Events))。

***

> 原文：https://vuejs.org/v2/guide/forms.html

***
