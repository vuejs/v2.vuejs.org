title: Class: Vue
type: api
order: 1
---

The `Vue` Class is the core of vue.js. It is a constructor that allows you to create ViewModel instances. Creating a ViewModel instance is straightforward:

``` js
var vm = new Vue({ /* options */ })
```

When you instantiate a ViewModel instance, it compiles the DOM element it is assigned to and creates data bindings that keep the DOM and the data in sync. It takes an option object that can include options about the DOM element, data object, mixin methods, lifecycle hooks and more. See the full list of [Instantitation Options](/api/instantiation-options.html).

Each ViewModel instance has an associated DOM element `$el`, which is essentially the V in MVVM. It also has an associated JavaScript object `$data`, which is essentially the M in MVVM. Changing the M results in updates in the V. For two-way bindings, inputs in the V results in changes in the M. For more details check out [Instance Properties](/api/instance-properties.html).

ViewModel instances proxies access to their `$data` objects, so if you have `vm.$data.msg` you can also access it as `vm.msg`. This might look a bit magical, but is totally optional. You can stick to `vm.$data.msg` for more explicit data access. However it is still important to notice the difference between `vm` and `vm.$data`, since the former cannot be observed by other ViewModels as data.

Each ViewModel instance also has a number of [Instance Methods](/api/instance-methods.html) which covers data observation, event communication and dom manipulation.

`Vue` also holds several [Global Methods](/api/global-methods.html), which allow you to extend the `Vue` class, configure global settings and register global custom assets such as components, directives, filters and more.