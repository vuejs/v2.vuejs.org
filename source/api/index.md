title: Class: Vue
type: api
order: 1
---

# {{title}}

The `Vue` Class is the core of vue.js. It is a constructor that allows you to create ViewModel instances. Creating a ViewModel instance is straightforward:

``` js
var vm = new Vue(options)
```

When you instantiate a ViewModel instance, it compiles the DOM node it is assigned to and creates data bindings that keep the DOM and the data in sync. It takes an option object that can include options about the DOM node, data object, mixin methods, lifecycle hooks and more. See the full list of [Instantitation Options](/api/instantiation-options.html).

Each ViewModel instance has an associated DOM node `$el`, which is essentially the V in MVVM. It also has an associated JavaScript object `$data`, which is essentially the M in MVVM. Changing the M results in updates in the V. For two-way bindings, inputs in the V results in changes in the M. For more details check out [Instance Properties](/api/instance-properties.html).

Each ViewModel instance also has a number of [Instance Methods](/api/instance-methods.html) which covers data observation, event communication and dom manipulation.

`Vue` also holds several [Global Methods](/api/global-methods.html), which allow you to extend the `Vue` class, configure global settings and register global custom assets such as components, directives, filters and more.