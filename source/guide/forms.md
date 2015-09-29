title: Handling Forms
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
    {{msg}}
  </p>
  <!-- checkbox -->
  <p>
    <input type="checkbox" v-model="checked">
    {{checked ? "yes" : "no"}}
  </p>
  <!-- radio buttons -->
  <p>
    <input type="radio" name="picked" value="one" v-model="picked">
    <input type="radio" name="picked" value="two" v-model="picked">
    {{picked}}
  </p>
  <!-- select -->
  <p>
    <select v-model="selected">
      <option>one</option>
      <option>two</option>
    </select>
    {{selected}}
  </p>
  <!-- multiple select -->
  <p>
    <select v-model="multiSelect" multiple>
      <option>one</option>
      <option>two</option>
      <option>three</option>
    </select>
    {{multiSelect}}
  </p>
  <p><pre>data: {{$data | json 2}}</pre></p>
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

## Bind to Expressions

> ^0.12.12 only

When using `v-model` on checkbox and radio inputs, the bound value is either a boolean or a string:

``` html
<!-- toggle is either true or false -->
<input type="checkbox" v-model="toggle">

<!-- pick is "red" when this radio box is selected -->
<input type="radio" v-model="pick" value="red">
```

This can be a bit limiting - sometimes we may want to bind the underlying value to something else. Here's how you can do that:

**Checkbox**

``` html
<input type="checkbox" v-model="toggle" true-exp="a" false-exp="b">
```

``` js
// when checked:
vm.toggle === vm.a
// when unchecked:
vm.toggle === vm.b
```

**Radio**

``` html
<input type="radio" v-model="pick" exp="a">
```

``` js
// when checked:
vm.pick === vm.a
```

## Dynamic Select Options

When you need to dynamically render a list of options for a `<select>` element, it's recommended to use an `options` attribute together with `v-model` so that when the options change dynamically, `v-model` is properly synced:

``` html
<select v-model="selected" options="myOptions"></select>
```

In your data, `myOptions` should be an keypath/expression that points to an Array to use as its options.

The options Array can contain plain strings:

``` js
options = ['a', 'b', 'c']
```

Or, it can contain objects in the format of `{text:'', value:''}`. This object format allows you to have the option text displayed differently from its underlying value:

``` js
options = [
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

The `value` can also be Objects:

> 0.12.11+ only

``` js
options = [
  { text: 'A', value: { msg: 'hello' }},
  { text: 'B', value: { msg: 'bye' }}
]
```

### Option Groups

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

### Options Filter

It's quite likely that your source data does not come in this desired format, and you will have to transform the data in order to generate dynamic options. In order to DRY-up the transformation, the `options` param supports filters, and it can be helpful to put your transformation logic into a reusable [custom filter](/guide/custom-filter.html):

``` js
Vue.filter('extract', function (value, keyToExtract) {
  return value.map(function (item) {
    return item[keyToExtract]
  })
})
```

``` html
<select
  v-model="selectedUser"
  options="users | extract 'name'">
</select>
```

The above filter transforms data like `[{ name: 'Bruce' }, { name: 'Chuck' }]` into `['Bruce', 'Chuck']` so it becomes properly formatted.

### Static Default Option

> 0.12.10+ only

You can provide one static default option in addition to the dyanmically generated options:

``` html
<select v-model="selectedUser" options="users">
  <option value="">Select a user...</option>
</select>
```

Dynamic options created from `users` will be appended after the static option. The static option will be selected by default if the `v-model` value is falsy (excluding `0`).

## Input Debounce

The `debounce` param allows you to set a minimum delay after each keystroke before the input's value is synced to the model. This can be useful when you are performing expensive operations on each update, for example making an Ajax request for type-ahead autocompletion.

``` html
<input v-model="msg" debounce="500">
```

**Result**

<div id="debounce-demo" class="demo">{&#123;msg&#125;}<br><input v-model="msg" debounce="500"></div>
<script>
new Vue({
  el:'#debounce-demo',
  data: { msg: 'edit me' }
})
</script>

Note that the `debounce` param does not debounce the user's input events: it debounces the "write" operation to the underlying data. Therefore you should use `vm.$watch()` to react to data changes when using `debounce`. For debouncing real DOM events you should use the [debounce filter](/api/filters.html#debounce).

Next: [Computed Properties](/guide/computed.html).
