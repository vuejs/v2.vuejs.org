title: Displaying a List
type: guide
order: 5
---

You can use the `v-repeat` directive to repeat a template element based on an Array of objects on the ViewModel. For every object in the Array, the directive will create a child Vue instance using that object as its `$data` object. These child instances inherit all data on the parent, so in the repeated element you have access to properties on both the repeated instance and the parent instance. In addition, you get access to the `$index` property, which will be the corresponding Array index of the rendered instance.

**Example:**

``` html
<ul id="demo">
  <li v-repeat="items" class="item-{{$index}}">
    {{$index}} - {{parentMsg}} {{childMsg}}
  </li>
</ul>
```

``` js
var demo = new Vue({
  el: '#demo',
  data: {
    parentMsg: 'Hello',
    items: [
      { childMsg: 'Foo' },
      { childMsg: 'Bar' }
    ]
  }
})
```

**Result:**

<ul id="demo"><li v-repeat="items" class="item-{&#123;$index&#125;}">{&#123;$index&#125;} - {&#123;parentMsg&#125;} {&#123;childMsg&#125;}</li></ul>
<script>
var demo = new Vue({
  el: '#demo',
  data: {
    parentMsg: 'Hello',
    items: [
      { childMsg: 'Foo' },
      { childMsg: 'Bar' }
    ]
  }
})
</script>

## Block Repeat

Sometimes you might want to repeat a block of more than one nodes - in that case, you can use a `<template>` tag to wrap the repeat block. The `<template>` tag here merely serves as a semantic wrapper. For example:

``` html
<ul>
  <template v-repeat="list">
    <li>{{msg}}</li>
    <li class="divider"></li>
  </template>
</ul>
```

## Arrays of Primitive Values

For Arrays containing primitive values, you can access the value simply as `$value`:

``` html
<ul id="tags">
  <li v-repeat="tags">
    {{$value}}
  </li>
</ul>
```

``` js
new Vue({
  el: '#tags',
  data: {
    tags: ['JavaScript', 'MVVM', 'Vue.js']
  }
})
```

**Result:**
<ul id="tags" class="demo"><li v-repeat="tags">{&#123;$value&#125;}</li></ul>
<script>
new Vue({
  el: '#tags',
  data: {
    tags: ['JavaScript', 'MVVM', 'Vue.js']
  }
})
</script>

## Using an identifier

Sometimes we might want to have more explicit variable access instead of implicitly falling back to parent scope. You can do that by providing an argument to the `v-repeat` directive and use it as the identifier for the item being iterated:

``` html
<ul id="users">
  <!-- think of this as "for each user in users" -->
  <li v-repeat="user: users">
    {{user.name}} - {{user.email}}
  </li>
</ul>
```

``` js
new Vue({
  el: '#users',
  data: {
    users: [
      { name: 'Foo Bar', email: 'foo@bar.com' },
      { name: 'John Doh', email: 'john@doh.com' }
    ]
  }
})
```

**Result:**
<ul id="users" class="demo"><li v-repeat="user: users">{&#123;user.name&#125;} - {&#123;user.email&#125;}</li></ul>
<script>
new Vue({
  el: '#users',
  data: {
    users: [
      { name: 'Foo Bar', email: 'foo@bar.com' },
      { name: 'John Doh', email: 'john@doh.com' }
    ]
  }
})
</script>

## Mutation Methods

Under the hood, Vue.js intercepts an observed Array's mutating methods (`push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()` and `reverse()`) so they will also trigger View updates.

``` js
// the DOM will be updated accordingly
demo.items.unshift({ childMsg: 'Baz' })
demo.items.pop()
```

## Augmented Methods

Vue.js augments observed Arrays with two convenience methods: `$set()` and `$remove()`.

You should avoid directly setting elements of a data-bound Array with indices, because those changes will not be picked up by Vue.js. Instead, use the augmented `$set()` method:

``` js
// same as `demo.items[0] = ...` but triggers view update
demo.items.$set(0, { childMsg: 'Changed!'})
```

`$remove()` is just syntax sugar for `splice()`. It will remove the element at the given index. When the argument is not a number, `$remove()` will search for that value in the array and remove the first occurrence.

``` js
// remove the item at index 0
demo.items.$remove(0)
```

## Replacing an Array

When you are using non-mutating methods, e.g. `filter()`, `concat()` or `slice()`, the returned Array will be a different instance. In that case, you can just replace the old Array with the new one:

``` js
demo.items = demo.items.filter(function (item) {
  return item.childMsg.match(/Hello/)
})
```

You might think this will blow away the existing DOM and re-build everything. But worry not - Vue.js recognizes array elements that already have an associated Vue instance and will reuse those instances whenever possible.

## Using `track-by`

In some cases, you might need to replace the Array with completely new objects - e.g. ones returned from an API call. If your data objects have a unique id property, then you can use a `track-by` attribute to give Vue.js a hint so that it can reuse an existing instance with data that has the same id.

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
<div v-repeat="items" track-by="_uid">
  <!-- content -->
</div>
```

## Iterating Through An Object

You can also use `v-repeat` to iterate through the properties of an Object. Each repeated instance will have a special property `$key`. For primitive values, you also get `$value` which is similar to primitive values in Arrays.

``` html
<ul id="repeat-object">
  <li v-repeat="primitiveValues">{{$key}} : {{$value}}</li>
  <li>===</li>
  <li v-repeat="objectValues">{{$key}} : {{msg}}</li>
</ul>
```

``` js
new Vue({
  el: '#repeat-object',
  data: {
    primitiveValues: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    },
    objectValues: {
      one: {
        msg: 'Hello'
      },
      two: {
        msg: 'Bye'
      }
    }
  }
})
```

**Result:**
<ul id="repeat-object" class="demo"><li v-repeat="primitiveValues">{&#123;$key&#125;} : {&#123;$value&#125;}</li><li>===</li><li v-repeat="objectValues">{&#123;$key&#125;} : {&#123;msg&#125;}</li></ul>
<script>
new Vue({
  el: '#repeat-object',
  data: {
    primitiveValues: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    },
    objectValues: {
      one: {
        msg: 'Hello'
      },
      two: {
        msg: 'Bye'
      }
    }
  }
})
</script>

<p class="tip">In ECMAScript 5 there is no way to detect when a new property is added to an Object, or when a property is deleted from an Object. To deal with that, observed objects will be augmented with three methods: `$add(key, value)`, `$set(key, value)` and `$delete(key)`. These methods can be used to add / delete properties from observed objects while triggering the desired View updates. The difference between `$add` and `$set` is that `$add` will return early if the key already exists on the object, so just calling `obj.$add(key)` won't overwrite the existing value with `undefined`.</p>

## Iterating Over a Range

`v-repeat` can also take an integer Number. In this case it will repeat the template that many times.

``` html
<div id="range">
    <div v-repeat="val">Hi! {{$index}}</div>
</div>
```

``` js
new Vue({
  el: '#range',
  data: {
    val: 3
  }
});
```
**Result:**
<ul id="range" class="demo"><li v-repeat="val">Hi! {&#123;$index&#125;}</li></ul>
<script>
new Vue({
  el: '#range',
  data: { val: 3 }
});
</script>

## Array Filters

Sometimes we only need to display a filtered or sorted version of the Array without actually mutating or resetting the original data. Vue provides two built-in filters to simplify such usage: `filterBy` and `orderBy`. Check out their [documentations](/api/filters.html#filterBy) for more details.

Next up: [Listening for Events](/guide/events.html).
