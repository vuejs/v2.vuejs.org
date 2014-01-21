title: Directives In Depth
type: guide
order: 7
---

# {{title}}

## Synopsis

A Vue.js directive is an HTML attribute that takes the following format:

``` js
prefix-directiveId="[arg:] ( keypath | expression ) [filters...]"
```

## A Simple Example

``` html
<div v-text="message"></div>
```

Here the prefix is `v` which is the default. The directive ID is `text` and the the keypath is `message`. This directive instructs Vue.js to update the div's `textContent` whenever the `message` property on the ViewModel changes.

## Expressions

``` html
<div v-text="'hello ' + user.firstName + ' ' + user.lastName"></div>
```

Here we are using a computed expression instead of a single property key.  Vue.js automatically tracks the properties an expression depends on and refreshes the directive whenever a dependency changes. Thanks to async batch updates, even when multiple dependencies change, an expression will only be updated once every event loop. Note that inside expressions you can only access properties and methods present on the current ViewModel for security reasons.

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