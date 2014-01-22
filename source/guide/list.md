title: Displaying a List
type: guide
order: 5
---

# {{title}}

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

Result:

<ul id="demo"><li v-repeat="items" class="item-{&#123;$index&#125;}">{&#123;$index&#125;} - {&#123;parentMsg&#125;} {&#123;childMsg&#125;}</li></ul>
<script src="/js/vue.min.js"></script>
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

## Mutation Methods

Under the hood, Vue.js intercepts the Array's mutating methods (`push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()` and `reverse()`) so they will also trigger View updates. You should avoid directly manipulating a data-bound Array with indices, as those changes will not be picked up by Vue.js.

``` js
demo.items.push({ childMsg: 'Baz' })
```
<p><a href="#demo" onclick="demoPush()">Execute this</a></p>

``` js
demo.items.pop()
```
<p><a href="#demo" onclick="demo.items.pop()">Execute this</a></p>

## Augmentations: remove() and replace()

In addition, Vue.js also augments data-bound Arrays with two custom mutating methods: `remove()` and `replace()`. These two methods are overloaded and quite versatile - they can take an index, an object in the Array, or a function.

When the argument is an index or an object in the Array, `replace()` takes an additional argument which is the object to be swappd in. In this case both methods return the removed/replaced object:

``` js
var i = Math.floor(Math.random() * demo.items.length)
demo.items.replace(i, { childMsg: 'Replaced!'})
```
<p><a href="#demo" onclick="demoReplace()">Execute this</a></p>

When the argument is a function, for `remove()` an object will be removed if the function returns true; for `replace()` an object will be replaced by the return value if the value is not undefined. Both methods return an Array of all removed/replaced objects:

``` js
demo.items.remove(function (item) {
    return item.childMsg === 'Replaced!'
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
        return item.childMsg === 'Replaced!'
    })
}

function demoReplace () {
    var i = Math.floor(Math.random() * demo.items.length)
    demo.items.replace(i, { childMsg: 'Replaced!'})
}
</script>