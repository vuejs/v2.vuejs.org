title: Form Input Bindings
type: guide
order: 9
---

## The Basics

You can use the `v-model` directive to create two-way data bindings on form input elements. It automatically picks the correct way to update the element based on the input type.

### Text

### Checkbox

### Radio

### Select

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

## Binding Non-String Values

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

## Param Attributes

### lazy

By default, `v-model` syncs the input with the data after each `input` event. You can add a `lazy` attribute to change the behavior to sync after `change` events:

``` html
<!-- synced after "change" instead of "input" -->
<input v-model="msg" lazy>
```

### number

If you want user input to be automatically persisted as numbers, you can add a `number` attribute to your `v-model` managed inputs:

``` html
<input v-model="age" number>
```

### debounce

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

We've covered a lot of ground so far. By now you should already be able to build some simple, dynamic interfaces with Vue.js, but you may still feel that the whole reactive system is a bit like magic. It is time that we talk about it in more details. Next up: [Reactivity In Depth](reactivity.html).
