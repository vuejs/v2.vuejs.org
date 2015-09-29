title: Listening for Events
type: guide
order: 5
---

You can use the `v-on` directive to bind event listeners to DOM events. It can be bound to either an event handler function (without the invocation parentheses) or an inline expression. If a handler function is provided, it will get the original DOM event as the argument. The event also comes with an extra property: `targetVM`, pointing to the particular ViewModel the event was triggered on:

``` html
<div id="demo">
  <a v-on="click: onClick">Trigger a handler</a>
  <a v-on="click: n++">Trigger an expression</a>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    n: 0
  },
  methods: {
    onClick: function (e) {
      console.log(e.target.tagName) // "A"
      console.log(e.targetVM === this) // true
    }
  }
})
```

## Invoke Handler with Expression

`targetVM` could be useful when `v-on` is used with `v-repeat`, since the latter creates a lot of child ViewModels. However, it is often more convenient and explicit to use an invocation expression passing in the current alias, which equals the current data object being iterated on:

``` html
<ul id="list">
  <li v-repeat="item in items" v-on="click: toggle(item)">
    {{item.text}}
  </li>
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
    toggle: function (item) {
      item.done = !item.done
    }
  }
})
```

When you want to access the original DOM event in an expression handler, you can pass it in as `$event`:

``` html
<button v-on="click: submit('hello!', $event)">Submit</button>
```

``` js
/* ... */
{
  methods: {
    submit: function (msg, e) {
      e.stopPropagation()
    }
  }
}
/* ... */
```

## The Special `key` Filter

When listening for keyboard events, we often need to check for common key codes. Vue.js provides a special `key` filter that can only be used with `v-on` directives. It takes a single argument that denotes the key code to check for:

``` html
<!-- only call vm.submit() when the keyCode is 13 -->
<input v-on="keyup:submit | key 13">
```

It also has a few presets for commonly used keys:

``` html
<!-- same as above -->
<input v-on="keyup:submit | key 'enter'">
```

Check the API reference for a [full list of key filter presets](/api/filters.html#key).

## Why Listeners in HTML?

You might be concerned that this whole event listening approach violates the good old rules about "separation of concern". Rest assured - since all Vue.js handler functions and expressions are strictly bound to the ViewModel that's handling the current View, it won't cause any maintainance difficulty. In fact, there are several benefits in using `v-on`:

1. It makes it easier to locate the handler function implementations within your JS code by simply skimming the HTML template.
2. Since you don't have to manually attach event listeners in JS, your ViewModel code can be pure logic and DOM-free. This makes it easier to test.
3. When a ViewModel is destroyed, all event listeners are automatically removed. You don't need to worry about cleaning it up yourself.

Next up: [Handling Forms](/guide/forms.html).
