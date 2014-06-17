title: Class: Vue
type: api
order: 1
---

The `Vue` Class is the core of Vue.js. It is a constructor that allows you to create ViewModel instances. Creating a ViewModel instance is straightforward:

``` js
var vm = new Vue({ /* options */ })
```

When you instantiate a ViewModel instance, it compiles the DOM element it is assigned to and creates data bindings that keep the DOM and the data in sync. It takes an option object that can include options about the DOM element, data object, mixin methods, lifecycle callbacks and more. See the full list of [Instantitation Options](/api/instantiation-options.html).

During the compilation phase, Vue.js walks through the DOM and compiles the directives it runs into. Once compiled, these DOM nodes are now said to be managed by the ViewModel. A DOM node can only be managed by one ViewModel, and once compiled, it should not be compiled again because the original binding information would have been lost. For templates, Vue.js caches them as un-compiled DocumentFragments and simply does `cloneNode(true)` when reusing them, which is highly efficient.

Each ViewModel instance has an associated DOM element `$el`, which is essentially the V in MVVM. It also has an associated JavaScript object `$data`, which is essentially the M in MVVM. Changing the M results in updates in the V. For two-way bindings, inputs in the V results in changes in the M. For more details check out [Instance Properties](/api/instance-properties.html).

ViewModel instances proxy access to their `$data` objects, so if you have `vm.$data.msg` you can also access it as `vm.msg`. This might look a bit magical, but is totally optional. You can stick to `vm.$data.msg` for more explicit data access. However it is still important to notice the difference between `vm` and `vm.$data`, since the former cannot be observed by other ViewModels as data.

It's also worth noting that data objects do not necessarily belong to a single ViewModel - multiple ViewModels can observe the same piece of data, whether directly as `$data` or nested under it. This is useful when multiple components need to react to a shared global state object.

Each ViewModel instance also has a number of [Instance Methods](/api/instance-methods.html) which cover data observation, event communication and DOM manipulation.

Finally, the `Vue` constructor itself also holds several [Global Methods](/api/global-methods.html), which allow you to extend the `Vue` class, configure global settings and register global custom assets such as components, directives, filters and more.