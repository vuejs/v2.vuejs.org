title: Computed Properties
type: guide
order: 4
---

In-template expressions are very convenient, but they are really meant for simple operations only. Templates are meant to describe the structure of your view. Putting too much logic into your templates can make them bloated and hard to maintain. This is why Vue.js limits binding expressions to one expression only. For any logic that requires more than one expression, you should use a **computed property**.

### Basic Example

``` html
<div id="example">
  a={{ a }}, b={{ b }}
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    a: 1
  },
  computed: {
    b: function () {
      return this.a + 1
    }
  }
})
```

Result:

{% raw %}
<div id="example" class="demo">
  a={{ a }}, b={{ b }}
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    a: 1
  },
  computed: {
    b: function () {
      return this.a + 1
    }
  }
})
</script>
{% endraw %}

Here we have declared a computed property `b`. The function we provided will be used as the getter function for the property `vm.b`:

``` js
console.log(vm.b) // -> 2
vm.a = 2
console.log(vm.b) // -> 3
```

You can open the console and play with the example vm yourself. The value of `vm.b` is always dependent on the value of `vm.a`.

You can data-bind to computed properties in templates just like a normal property. Vue is aware that `vm.b` depends on `vm.a`, so it will update any bindings that depends on `vm.b` when `vm.a` changes. And the best part is that we've created this dependency relationship declaratively: the computed getter function is pure and has no side effects, which makes it easy to test and reason about.

### Computed Property vs. $watch

Vue.js does provide an API method called `$watch` that allows you to observe data changes on a Vue instance. When you have some data that needs to change based on some other data, it is tempting to use `$watch` - espeically if you are coming from an AngularJS background. However, it is often a better idea to use a computed property rather than an imperative `$watch` callback. Consider this example:

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

The above code is imperative and repetitive. Compare it with a computed property version:

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

Much better, isn't it?

### Computed Setter

Computed properties are by default get-only, but you can also provide a setter when you need it:

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

### Computed Property Caching

You may think that computed properties behave just like getters - every time you access it, the getter function is re-evaluated. That is not the case. Vue.js computed properties are cached by default and lazily re-evaluated only when one of its reactive dependencies have changed.

Imagine we have an expensive computed property A, which requires looping through a huge Array and doing a lot of computations. Then, we may have other computed properties that in turn depend on A. Without caching, we'd be calling A's getter many more times than necessary and this could potentially cause performance issues. With caching, A's value will be cached as long as its dependencies haven't changed, and accessing it many times will not trigger unnecessary computations.

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

In the example above, the computed property relies on `vm.msg`. Because this is an observed data property on the Vue instance, it is considered a reactive dependency. Whenever `vm.msg` is changed, `vm.example`'s value will be re-evaluated.

However, `Date.now()` is **not** a reactive dependency, because it has nothing to do with Vue's data observation system. Therefore, when you programatically access `vm.example`, you will find the timestamp to remain the same unless `vm.msg` triggered a re-evaluation.

Sometimes you may want to preserve the simple getter-like behavior, where every time you access `vm.example` it is simply re-evaluated. You can do that by turning off caching for a specific computed property:

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

Now, every time you access `vm.example`, the timestamp will be up-to-date. **However, note this only affects programmatic access inside JavaScript; data-bindings are still dependency-driven.** When you bind to a computed property in the template as `{% raw %}{{example}}{% endraw %}`, the DOM will only be updated when a reactive dependency has changed.

Enough about computed properties! Next, let's learn about [Class and Style Bindings](class-and-style.html).
