---
title: Filters
type: guide
order: 305
---

Vue.js allows you to define filters that can be used to apply common text formatting. Filters are usable in two places: **mustache interpolations and `v-bind` expressions** (the latter supported in 2.1.0+). Filters should be appended to the end of the JavaScript expression, denoted by the "pipe" symbol:

``` html
<!-- in mustaches -->
{{ message | capitalize }}

<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

The filter function always receives the expression's value (the result of the former chain) as its first argument. In this example, the `capitalize` filter function will receive the value of `message` as its argument.

``` js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

Filters can be chained:

``` html
{{ message | filterA | filterB }}
```

In this case, `filterA`, defined with a single argument, will receive the value of `message`, and then the `filterB` function will be called with the result of `filterA` passed into `filterB`'s single argument.

Filters are JavaScript functions, therefore they can take arguments:

``` html
{{ message | filterA('arg1', arg2) }}
```

Here `filterA` is defined as a function taking three arguments. The value of `message` will be passed into the first argument. The plain string `'arg1'` will be passed into the `filterA` as its second argument, and the value of expression `arg2` will be evaluated and passed in as the third argument.
