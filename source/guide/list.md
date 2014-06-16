title: Displaying a List
type: guide
order: 5
---

You can use the `v-repeat` directive to repeat a template element based on an Array of objects on the ViewModel. For every object in the Array, the directive will create a child ViewModel using that object as the data object. On and inside the template element you have access to properties of both the child ViewModel and the parent ViewModel. In addition, you also have access to the current child ViewModel's `$index` property, which is the index of its data object in the Array.

**Example:**

``` html
<ul id="demo">
    <li v-repeat="items" class="item-{&#123;$index&#125;}">
        {&#123;$index&#125;} - {&#123;parentMsg&#125;} {&#123;childMsg&#125;}
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

## Arrays of Primitive Values

For Arrays containing primitive values, you can access the value simply as `$value`:

``` html
<ul id="tags">
    <li v-repeat="tags">
        {&#123;$value&#125;}
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
        {&#123;user.name&#125;} {&#123;user.email&#125;}
    </li>
</ul>
```

## Mutation Methods

Under the hood, Vue.js intercepts an observed Array's mutating methods (`push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()` and `reverse()`) so they will also trigger View updates.

``` js
// the DOM will be updated accordingly
demo.items.unshift({ childMsg: 'Baz' })
demo.items.pop()
```

You should avoid directly setting elements of a data-bound Array with indices, because those changes will not be picked up by Vue.js. Instead, use the agumented `$set()` method. Vue.js augments observed Arrays with two convenience methods: `$set()` and `$remove()`:

### $set( index, value )

Setting a value in the Array is self-explanatory:

``` js
// same as `demo.items[0] = ...` but triggers view update
demo.items.$set(0, { childMsg: 'Changed!'})
```

### $remove( index | value )

`$remove()` is just syntax sugar for `splice()`. will remove the element at the given index. When the argument is not a number, `$remove()` will search for that value in the array and remove the first occurrence.

``` js
// remove the item at index 0
demo.items.$remove(0)
```

## Setting a new Array

When you are using non-mutating methods, e.g. `filter()`, `concat()` or `slice()`, the returned Array will be a different instance. In that case, you can just set the value to the new Array:

``` js
demo.items = demo.items.filter(function (item) {
    return item.childMsg.match(/Hello/)
})
```

You might think this will blow away the existing DOM and re-build everything. But worry not - Vue.js uses some smart algorithms internally that reuses existing ViewModels and DOM nodes, and incurrs the least amount of DOM manipulations possible. Also, because of update batching, multiple changes to an Array in the same event loop will only trigger one comparison.

## Array Filters

Sometimes we only need to display a filtered or sorted version of the Array without actually mutating or resetting the original data. Vue provides two built-in filters to simplify such usage: `filterBy` and `orderBy`. Check out their [documentations](/api/filters.html#filterBy) for more details.

## Iterating Through An Object

Starting in Vue.js v0.8.8, you can also use `v-repeat` to iterate through the properties of an Object. Each repeated instance will have a special property `$key`. For primitive values, you also get `$value` which is similar to primitive values in Arrays.

``` html
<ul id="repeat-object">
    <li v-repeat="primitiveValues">{&#123;$key&#125;} : {&#123;$value&#125;}</li>
    <li>===</li>
    <li v-repeat="objectValues">{&#123;$key&#125;} : {&#123;msg&#125;}</li>
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

## $add() and $delete()

In ECMAScript 5 there is no way to detect when a new property is added to an Object, or when a property is deleted from an Object. To counter for that, observed objects will be augmented with two methods: `$add(key, value)` and `$delete(key)`. These methods can be used to add / delete properties from observed objects while triggering the desired View updates.

Next up: [Listening for Events](/guide/events.html).
