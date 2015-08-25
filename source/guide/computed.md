title: Computed Properties
type: guide
order: 8
---

Vue.js' inline expressions are very convenient, but the best use cases for them are simple boolean operations or string concatenations. For more complicated logic, you should use **computed properties**.

A computed property is used to declaratively describe a value that depends on other values. When you data-bind to a computed property inside the template, Vue knows when to update the DOM when any of the values depended upon by the computed property has changed. This can be very power and makes your code more declarative, data-driven and thus easier to maintain.

It is often a better idea to use a computed property rather than an imperative `$watch` callback. Consider this example:

``` html
<div id="demo">{{fullName}}</div>
```

``` js
var vm = new Vue({
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  }
})

vm.$watch('firstName', function (val) {
  this.fullName = val + ' ' + this.lastName
})

vm.$watch('lastName', function (val) {
  this.fullName = this.firstName + ' ' + val
})
```

The above code is imperative and cumbersome. Compare it with a computed property version:

``` js
var vm = new Vue({
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

Much better. In addition, you can also provide a setter for a computed property:

``` js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

### Computed Poperty Caching

Before 0.12.8, computed properties behave just like getters - every time you access it, the getter function is re-evaluated. In 0.12.8 this has been improved - computed properties are cached and lazily re-evaluated only when one of its reactive dependencies have changed.

Imagine we have an expensive computed property A, which requires looping through a huge Array and doing a lot of computations. Then, we may have other computed properties that depend on A. Without caching, we'd be calling A's getter many more times than necessary and this could potentially cause performance issues. With caching, A's value will be cached as long as its dependencies haven't changed, and accessing it many times will not trigger unnecessary computations.

However, it is important to understand what is considered a "reactive dependency":

``` js
var vm = new Vue({
  data: {
    msg: 'hi'
  },
  computed: {
    example: {
      return Date.now() + this.msg
    }
  }
})
```

In the example above, the computed property relies on `vm.msg`. Because this is an observed data property on the Vue instance, it is considered a reactive dependency. Whenever `vm.msg` is changed, `vm.example`'s value will be re-evaludated.

However, `Date.now()` is **not** a reactive dependency, because it has nothing to do with Vue's data observation system. Therefore, when you programatically access `vm.computed`, you will find the timestamp to remain the same unless `vm.msg` triggered a re-evaluation.

Sometimes you may want to preserve the simple getter-like behavior, where every time you access `vm.example` it is simply re-evaluated. Starting in 0.12.11, it's possible to turn off caching for a specific computed property:

``` js
computed: {
  example: {
    cache: false,
    get: function () {
      return Date.now() + this.msg
    }
  }
}
```

Now, every time you access `vm.example`, the timestamp will be up-to-date. However, note this only affects programmatic access inside JavaScript; data-bindings are still dependency-drive. When you bind to a computed property in the template as {% raw %}`{{example}}`{% endraw %}, the DOM will only be updated when a reactive dependency has changed.

Next, let's learn about how to [write a custom directive](/guide/custom-directive.html).
