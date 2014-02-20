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
    <li v-repeat="tags">{&#123;$value&#125;}</li>
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


## Mutation Methods

Under the hood, Vue.js intercepts an observed Array's mutating methods (`push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()` and `reverse()`) so they will also trigger View updates.

``` js
demo.items.push({ childMsg: 'Baz' })
```
<p><a href="#demo" onclick="demoPush()">Execute this</a></p>

``` js
demo.items.pop()
```
<p><a href="#demo" onclick="demo.items.pop()">Execute this</a></p>

<p class="tip">You should avoid directly setting elements of a data-bound Array with indices, because those changes will not be picked up by Vue.js. Instead, use the agumented `set()` method.</p>

## Augmentations: set(), remove() and replace()

In addition, Vue.js also augments data-bound Arrays with three custom mutating methods: `set()`, `remove()` and `replace()`.

Their signatures:

- `set(index | value | function [, value])`
- `remove(index | value | function)`
- `replace` is simply an alias of `set`.

### set()

Setting a value in the Array is self-explanatory:

``` js
// set a random element to a new value
var i = Math.floor(Math.random() * demo.items.length)
// .set() also returns the original value
var replaced = demo.items.set(i, { childMsg: 'Changed!'})
```
<p><a href="#demo" onclick="demoSet()">Execute this</a></p>

### replace()

When the first argument is not a number, `set()` and `replace()` searches for that value in the Array and replaces it with the new value:

``` js
demo.items.replace(demo.items[0], { childMsg: 'Replaced!' })
```
<p><a href="#demo" onclick="demoReplace()">Execute this</a></p>

You can also replace with a function. Returning undefined will skip that item, returning any other value will cause the item interated upon to be replaced with the return value. Also note that when using `replace()` with a function, it will replace **ALL** items that gets a valid return value.

``` js
demo.items.replace(function (item) {
    if (item.childMsg === 'Replaced!') {
        return { childMsg: 'Replaced again!' }
    }
})
```
<p><a href="#demo" onclick="demoReplace2()">Execute this</a></p>

### remove()

`remove()` also can take either an index, a target value or a function as the argument. It will also remove **ALL** items that return `true`.

``` js
// remove all replaced items
demo.items.remove(function (item) {
    return item.childMsg === 'Changed!'
        || item.childMsg === 'Replaced!'
        || item.childMsg === 'Replaced again!'
})
```
<p><a href="#demo" onclick="demoRemove()">Execute this</a></p>

Next up: [Listening for Events](/guide/events.html).

<script>
function demoPush () {
    demo.items.push({ childMsg: 'Baz' })
}

function demoRemove () {
    demo.items.remove(function (item) {
        return item.childMsg === 'Changed!'
            || item.childMsg === 'Replaced!'
            || item.childMsg === 'Replaced again!'
    })
}

function demoSet () {
    var i = Math.floor(Math.random() * demo.items.length)
    demo.items.set(i, { childMsg: 'Changed!'})
}

function demoReplace () {
    demo.items.replace(demo.items[0], { childMsg: 'Replaced!' })
}

function demoReplace2 () {
    demo.items.replace(function (item) {
        if (item.childMsg === 'Replaced!') {
            return { childMsg: 'Replaced again!'}
        }
    })
}
</script>
