title: Reactivity in Depth
type: guide
order: 12
---

One of Vue.js' most distinct features is the unobtrusive reactive system - models are just plain JavaScript objects, modify it and the view updates. It makes state management very simple and intuitive, but it's also important to understand how it works to avoid some common gotchas. In this section, we are going to dig into some of the lower-lvel details of Vue.js' reactivity system.

## How Changes Are Tracked

![data](/images/data.png)

## Initialize Your Data!

## Async Update Queue

## Inside Computed Properties

It should be noted that Vue.js computed properties are **not** simple getters. Each computed property keeps track of its own reactive dependencies. When a computed property is evaluated, Vue.js updates its denpendency list and caches the result value. The cached value is only invalidated when one of the tracked dependencies have changed. Therefore, as long as the depdendencies did not change, accessing the computed property will directly return the cached value instead of calling the getter.

Why do we need caching? Imagine we have an expensive computed property **A**, which requires looping through a huge Array and doing a lot of computations. Then, we may have other computed properties that in turn depend on **A**. Without caching, we’d be calling **A**’s getter many more times than necessary!

Because of computed property caching, the getter function is not always called when you access a computed property. Consider the following example:

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

The computed property `example` has only one dependency: `vm.msg`. `Date.now()` is **not** a reactive dependency, because it has nothing to do with Vue's data observation system. Therefore, when you programatically access `vm.example`, you will find the timestamp to remain the same unless `vm.msg` triggers a re-evaluation.

In some use cases you may want to preserve the simple getter-like behavior, where every time you access `vm.example` it simply calls the getter again. You can do that by turning off caching for a specific computed property:

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

Next: [Custom Directives](custom-directive.html)
