title: 处理表单
type: guide
order: 7
---

## 基本用法

你可以在表单的 input 元素上使用 `v-model` 指令来创建双向数据绑定。它会根据 input type 自动选取正确的方式更新元素。

**示例**

``` html
<form id="demo">
  <!-- text -->
  <p>
    <input type="text" v-model="msg">
    {&#123;msg&#125;}
  </p>
  <!-- checkbox -->
  <p>
    <input type="checkbox" v-model="checked">
    {&#123;checked ? &quot;yes&quot; : &quot;no&quot;&#125;}
  </p>
  <!-- radio buttons -->
  <p>
    <input type="radio" name="picked" value="one" v-model="picked">
    <input type="radio" name="picked" value="two" v-model="picked">
    {&#123;picked&#125;}
  </p>
  <!-- select -->
  <p>
    <select v-model="selected">
      <option>one</option>
      <option>two</option>
    </select>
    {&#123;selected&#125;}
  </p>
  <!-- multiple select -->
  <p>
    <select v-model="multiSelect" multiple>
      <option>one</option>
      <option>two</option>
      <option>three</option>
    </select>
    {&#123;multiSelect&#125;}
  </p>
  <p><pre>data: {&#123;$data | json 2&#125;}</pre></p>
</form>
```

``` js
new Vue({
  el: '#demo',
  data: {
    msg      : 'hi!',
    checked  : true,
    picked   : 'one',
    selected : 'two',
    multiSelect: ['one', 'three']
  }
})
```

**效果**

<form id="demo"><p><input type="text" v-model="msg"> {&#123;msg&#125;}</p><p><input type="checkbox" v-model="checked"> {&#123;checked ? &quot;yes&quot; : &quot;no&quot;&#125;}</p><p><input type="radio" v-model="picked" name="picked" value="one"><input type="radio" v-model="picked" name="picked" value="two"> {&#123;picked&#125;}</p><p><select v-model="selected"><option>one</option><option>two</option></select> {&#123;selected&#125;}</p><p><select v-model="multiSelect" multiple><option>one</option><option>two</option><option>three</option></select>{&#123;multiSelect&#125;}</p><p>data:<pre style="font-size:13px;background:transparent;line-height:1.5em">{&#123;$data | json 2&#125;}</pre></p></form>
<script>
new Vue({
  el: '#demo',
  data: {
    msg      : 'hi!',
    checked  : true,
    picked   : 'one',
    selected : 'two',
    multiSelect: ['one', 'three']
  }
})
</script>

## 懒更新

默认情况下，`v-model` 会在每个 `input` 事件之后同步输入的数据。你可以添加一个 `lazy` 特性，将其改变为在每个 `change` 事件之后才完成同步。

``` html
<!-- synced after "change" instead of "input" -->
<input v-model="msg" lazy>
```

## 当做数来处理

如果你希望用户的输入自动处理为一个数，你可以在 `v-model` 所在的 input 上添加一个 `number` 特性。

``` html
<input v-model="age" number>
```

## 动态 select 选项

当你需要为一个 `<select>` 元素动态渲染列表选项时，我们推荐 `options` 和 `v-model` 特性配合使用：

``` html
<select v-model="selected" options="myOptions"></select>
```

在你的数据里，`myOptions` 应该是一个代表选项数组的路径/表达式。该数组可以包含普通字符串或对象。

该数组里对象的格式可以是 `{text:'', value:''}`。这允许你把展示的文字和其背后对应的值区分开来。

``` js
[
  { text: 'A', value: 'a' },
  { text: 'B', value: 'b' }
]
```

会渲染成：

``` html
<select>
  <option value="a">A</option>
  <option value="b">B</option>
</select>
```

<!-- Alternatively, the object can be in the format of `{ label:'', options:[...] }`. In this case it will be rendered as an `<optgroup>`:
-->另外，该数组里对象的格式也可以是 `{label:'', options:[...]}`。这样的数据会被渲染成为一个 `<optgroup>`：

``` js
[
  { label: 'A', options: ['a', 'b']},
  { label: 'B', options: ['c', 'd']}
]
```

会渲染成：

``` html
<select>
  <optgroup label="A">
    <option value="a">a</option>
    <option value="b">b</option>
  </optgroup>
  <optgroup label="B">
    <option value="c">c</option>
    <option value="d">d</option>
  </optgroup>
</select>
```

接下来：[可推导的属性](../guide/computed.html).