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

You can define local filters in a component's options:

``` js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

or define a filter globally before creating the Vue instance:

``` js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

Below is an example of our `capitalize` filter being used:

{% raw %}
<div id="example_1" class="demo">
  <input type="text" v-model="message">
  <p>{{ message | capitalize }}</p>
</div>
<script>
  new Vue({
    el: '#example_1',
    data: function () {
      return {
        message: 'john'
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  })
</script>
{% endraw %}

The filter's function always receives the expression's value (the result of the former chain) as its first argument. In the above example, the `capitalize` filter function will receive the value of `message` as its argument.

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
