---
title: List Rendering
type: guide
order: 8
---

## `v-for`

We can use the `v-for` directive to render a list of items based on an array. The `v-for` directive requires a special syntax in the form of `item in items`, where `items` is the source data array and `item` is an **alias** for the array element being iterated on:

### Simple example

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

Result:

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
      smoothScroll.animateScroll(null, '#example-1')
    }
  }
})
</script>
{% endraw %}

Inside `v-for` blocks we have full access to parent scope properties. `v-for` also supports an optional second argument for the index of the current item.

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

Result:

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
      smoothScroll.animateScroll(null, '#example-2')
    }
  }
})
</script>
{% endraw %}

You can also use `of` as the delimiter instead of `in`, so that it is closer to JavaScript's syntax for iterators:

``` html
<div v-for="item of items"></div>
```

## Template v-for

Similar to template `v-if`, you can also use a `<template>` tag with `v-for` to render a block of multiple elements. For example:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

## Array Change Detection

### Mutation Methods

Vue wraps an observed array's mutation methods so they will also trigger view updates. The wrapped methods are:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

You can open the console and play with the previous examples' `items` array by calling their mutation methods. For example: `example1.items.push({ message: 'Baz' })`.

### Replacing an Array

Mutation methods, as the name suggests, mutate the original array they are called on. In comparison, there are also non-mutating methods, e.g. `filter()`, `concat()` and `slice()`, which do not mutate the original Array but **always return a new array**. When working with non-mutating methods, you can just replace the old array with the new one:

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

You might think this will cause Vue to throw away the existing DOM and re-render the entire list - luckily, that is not the case. Vue implements some smart heuristics to maximize DOM element reuse, so replacing an array with another array containing overlapping objects is a very efficient operation.

### `key`

In some cases, you might need to replace the array with completely new objects - e.g. ones created from an API call. Since by default `v-for` determines the reusability of existing scopes and DOM elements by tracking the identity of its data object, this could cause the entire list to be re-rendered. However, if each of your data objects has a unique property, then you can use a `key` special attribute to give Vue a hint so that it can reuse existing instances as much as possible.

For example, if your data looks like this:

``` js
{
  items: [
    { _uid: '88f869d', ... },
    { _uid: '7496c10', ... }
  ]
}
```

Then you can give the hint like this:

``` html
<div v-for="item in items" v-bind:key="item._uid">
  <!-- content -->
</div>
```

Later on, when you replace the `items` array and Vue encounters a new object with `_uid: '88f869d'`, it knows it can reuse the existing scope and DOM elements associated with the same `_uid`.

### `v-bind:key="index"`

If you don't have a unique key to track by, you can also use `v-bind:key="index"`, which will force `v-for` into in-place update mode: fragments are no longer moved around, they simply get flushed with the new value at the corresponding index. This mode can also handle duplicate values in the source array.

<p class="tip">This can make array replacement extremely efficient, but it comes at a trade-off. Because DOM nodes are no longer moved to reflect the change in order, **temporary state like DOM input values and component private state can become out of sync**. Keep this in mind when using `v-bind:key="index"` if the `v-for` block contains form input elements or child components.</p>

### Caveats

Due to limitations in JavaScript, Vue **cannot** detect the following changes to an array:

1. When you directly set an item with the index, e.g. `vm.items[indexOfItem] = newValue`
2. When you modify the length of the array, e.g. `vm.items.length = newLength`

To overcome caveat 1, both of the following will accomplish the same as `vm.items[indexOfItem] = newValue`, but will also trigger state updates in the reactivity system:

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice`
example1.items.splice(indexOfItem, 1, newValue)
```

To deal with caveat 2, you can also use `splice`:

``` js
example1.items.splice(newLength)
````

#### Using `Object.freeze()`

When iterating over an array of objects frozen with `Object.freeze()`, you need to explicitly use `key`. A warning will be displayed in this scenario when Vue is unable to track objects automatically.

## Object `v-for`

You can also use `v-for` to iterate through the properties of an object.

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
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
```

Result:

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
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
</script>
{% endraw %}

You can also provide a second argument for the key:

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

And another for the index:

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">When iterating over an object, the order is based on the key enumeration order of `Object.keys()`, which is **not** guaranteed to be consistent across JavaScript engine implementations.</p>

## Range v-for

`v-for` can also take an integer. In this case it will repeat the template that many times.

``` html
<div>
  <span v-for="n in 10">{{ n }}</span>
</div>
```

Result:

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
new Vue({ el: '#range' })
</script>
{% endraw %}

## Displaying Filtered/Sorted Results

Sometimes we want to display a filtered or sorted version of an array without actually mutating or resetting the original data. In this case, you can create a computed property that returns the filtered or sorted array.

For example:

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
