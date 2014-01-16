title: Listening for Events
type: guide
order: 4
---

# {{title}}

You can bind `v-on` to either a function on the ViewModel or an expression:

``` html
<a v-on="click: addOne">Add one</a>
<a v-on="click: n++">Also add one</a>
```

The event listener is automatically delegated when you use `v-on` together with `v-repeat`. The handler function will get the original DOM event as the argument. Since `v-repeat` creates a child ViewModel for every item in the list, the handler's event argument comes with two extra properties: `el` and `targetVM`, pointing to those of the particular list item the event was triggered on. This could be useful when you are using a handler function on the parent ViewModel but need to manipulate the data of list items.

**Example:**

``` html
<ul id="list">
    <li v-repeat="items" v-on="click: toggle">{{text}}</li>
</ul>
```

``` js
new Vue({
    el: '#list',
    data: {
        items: [
            { text: 'one', done: true },
            { text: 'two', done: false }
        ]
    },
    methods: {
        toggle: function (e) {
            e.targetVM.done = !e.targetVM.done
        }
    }
})
```