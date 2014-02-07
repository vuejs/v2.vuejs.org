title: Directives In Depth
type: guide
order: 3
---

# {{title}}

## Synopsis

If you have not used AngularJS before, you probably don't know what a directive is. Essentially, a directive is some special token in the markup that tells the library to do something to a DOM element. In Vue.js, the concept of directive is drastically simpler than that in Angular. A Vue.js directive can only appear in the form of a prefixed HTML attribute that takes the following format:

``` html
<element prefix-directiveId="[arg:] ( keypath | expression ) [filters...]"></element>
```

## A Simple Example

``` html
<div v-text="message"></div>
```

Here the prefix is `v` which is the default. The directive ID is `text` and the the keypath is `message`. This directive instructs Vue.js to update the div's `textContent` whenever the `message` property on the ViewModel changes.

## Inline Expressions

``` html
<div v-text="'hello ' + user.firstName + ' ' + user.lastName"></div>
```

Here we are using a computed expression instead of a single property key. Vue.js automatically tracks the properties an expression depends on and refreshes the directive whenever a dependency changes. Thanks to async batch updates, even when multiple dependencies change, an expression will only be updated once every event loop.

You should use expressions wisely and avoid putting too much logic in your templates, especially statements with side effects (with the exception of event listener expressions). For bindings that require more complicated operations, use [Computed Properties](/guide/computed.html) instead.

<p class="tip">For security reasons, in inline expressions you can only access properties and methods present on the current context ViewModel and its parents.</p>

## Argument

``` html
<div v-on="click : clickHandler"></div>
```

Some directives require an argument before the keypath or expression. In this example the `click` argument indicates we want the `v-on` directive to listen for a click event and then call the `clickHandler` method of the ViewModel instance.

## Filters

Filters can be appended to directive keypaths or expressions to further process the value before updating the DOM. Filters are denoted by a single pipe (`|`) as in shell scripts. For more details see [Filters in Depth](/guide/filters.html).

## Multiple Clauses

You can create multiple bindings of the same directive in a single attribute, separated by commas:

``` html
<div v-on="
    click   : onClick,
    keyup   : onKeyup,
    keydown : onKeydown
">
</div>
```

## Empty Directive

Some direcitves don't create data bindings - they simply do something to the element once and do not require a keypath or expression at all, for example the `v-pre` directive:

``` html
<div v-pre>
    <!-- markup in here will not be compiled -->
</div>
```

## Writing a Custom Directive

You can register a global custom directive with the `Vue.directive()` method, passing in a **directiveID** followed by a **definition object**. A definition object can provide several hook functions (all optional):

- **bind**: called only once, when the directive is first bound to the element.
- **update**: called when the binding value changes. The new value is provided as the argument.
- **unbind**: called only once, when the directive is unbound from the element.

**Example**

``` js
Vue.directive('my-directive', {
    bind: function () {
        // do preparation work
        // e.g. add event listeners or expensive stuff
        // that needs to be run only once
    },
    update: function (value) {
        // do something based on the updated value
        // this will also be called for the initial value
    },
    unbind: function () {
        // do clean up work
        // e.g. remove event listeners added in bind()
    }
})
```

Once registered, you can use it in Vue.js templates like this (you need to add the Vue.js prefix to it):

``` html
<div v-my-directive="someValue"></div>
```

When you only need the `update` function, you can pass in a single function instead of the definition object:

``` js
Vue.directive('my-directive', function (value) {
    // this function will be used as update()
})
```

All the hook functions will be copied into the actual **directive object**, which you can access inside these functions as their `this` context. The directive object exposes some useful properties:

- **el**: the element the directive is bound to.
- **key**: the keypath of the binding, excluding arguments and filters.
- **arg**: the argument, if present.
- **vm**: the context ViewModel that owns this directive.
- **value**: the current binding value.

<p class="tip">You should treat all these properties as read-only and refrain from changing them. You can attach custom properties to the directive object too, but be careful not to accidentally overwrite existing internal ones.</p>

An example of a custom directive using some of these properties:

``` html
<div id="demo" v-demo="LightSlateGray : msg"></div>
```

``` js
Vue.directive('demo', {
    bind: function () {
        this.el.style.color = '#fff'
        this.el.style.backgroundColor = this.arg
    },
    update: function (value) {
        this.el.innerHTML =
            'argument - ' + this.arg + '<br>' +
            'key - ' + this.key + '<br>' +
            'value - ' + value
    }
})
var demo = new Vue({
    el: '#demo',
    data: {
        msg: 'hello!'
    }
})
```

**Result**

<div id="demo" v-demo="LightSlateGray : msg"></div>
<script>
Vue.directive('demo', {
    bind: function () {
        this.el.style.color = '#fff'
        this.el.style.backgroundColor = this.arg
    },
    update: function (value) {
        this.el.innerHTML =
            'argument - ' + this.arg + '<br>' +
            'key - ' + this.key + '<br>' +
            'value - ' + value
    }
})
var demo = new Vue({
    el: '#demo',
    data: {
        msg: 'hello!'
    }
})
</script>

For more complicated examples, checkout `src/directives/` in the source code.
Next: [Filters in Depth](/guide/filters.html).