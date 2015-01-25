title: 处理表单
type: guide
order: 7
---

## The Basics

You can use the `v-model` directive to create two-way data bindings on form input elements. It automatically picks the correct way to update the element based on the input type.

**Example**

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

**Result**

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

## Lazy Updates

By default, `v-model` syncs the input with the data after each `input` event. You can add a `lazy` attribute to change the behavior to sync after `change` events:

``` html
<!-- synced after "change" instead of "input" -->
<input v-model="msg" lazy>
```

## Casting Value as Number

If you want user input to be automatically persisted as numbers, you can add a `number` attribute to your `v-model` managed inputs:

``` html
<input v-model="age" number>
```

## Dynamic Select Options

When you need to dynamically render a list of options for a `<select>` element, it's recommended to use an `options` attribute together with `v-model`:

``` html
<select v-model="selected" options="myOptions"></select>
```

In your data, `myOptions` should be an keypath/expression that points to an Array to use as its options. The Array can contain plain strings, or contain objects.

The object can be in the format of `{text:'', value:''}`. This allows you to have the option text displayed differently from its underlying value:

``` js
[
  { text: 'A', value: 'a' },
  { text: 'B', value: 'b' }
]
```

Will render:

``` html
<select>
  <option value="a">A</option>
  <option value="b">B</option>
</select>
```

Alternatively, the object can be in the format of `{ label:'', options:[...] }`. In this case it will be rendered as an `<optgroup>`:

``` js
[
  { label: 'A', options: ['a', 'b']},
  { label: 'B', options: ['c', 'd']}
]
```

Will render:

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

Next: [Computed Properties](/guide/computed.html).