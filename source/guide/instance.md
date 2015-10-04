title: Vue Instances
type: guide
order: 3
---

## The Vue Constructor

The `Vue` constructor is the core of Vue.js. It is a constructor function that allows you to create Vue instances. Creating a Vue instance is straightforward:

``` js
var vm = new Vue({ /* options */ })
```

When you instantiate a Vue instance, you need to pass in an option object which can include information about the DOM element, data object, mixin methods, lifecycle callbacks and more. See the full list of [Component Options](/api/options.html).

Each Vue instance is essentially a ViewModel (hence the variable name `vm` you will see throughout the docs). It has an associated DOM element `$el`, which is roughly the V in MVVM. It also has an associated JavaScript object `$data`, which corresponds to the M in MVVM. Changing the M results in updates in the V. For two-way bindings, user inputs triggered in the V results in changes in the M. For more details on what properties are available on a Vue instance, check out [Instance Properties](/api/instance-properties.html).

Each Vue instance also has a number of [Instance Methods](/api/instance-methods.html) which cover data observation, event communication and DOM manipulation.

The `Vue` constructor itself also exposes the [Global API](/api/global-api.html), which allow you to extend the `Vue` class, configure global settings and register global custom assets such as components, directives, filters and more.

## Initialization

If you provided the `el` option at instantiation, the Vue instance will immediately enter the compilation phase. Otherwise, it will wait until `vm.$mount()` is called before it starts compilation. During the compilation phase, Vue walks through the DOM and collects the directives it runs into, and "links" the data and the DOM with these directives. Once linked, these DOM nodes are now said to be managed by the Vue instance. A DOM node can only be managed by one Vue instance, and should not be compiled more than once.

## Data Proxying

Vue instances proxy access to their `$data` objects, so if you have `vm.$data.msg` you can also access it as `vm.msg`. This might look a bit magical, but is totally optional. You can stick to `vm.$data.msg` for more explicit data access. However it is still important to notice the difference between `vm` and `vm.$data`, since the former cannot be observed by other Vue instances as data.

It's also worth noting that data objects do not necessarily belong to a single Vue instance - multiple ViewModels can observe the same piece of data, whether directly as `$data` or nested under it. This is useful when multiple components need to react to a shared global state object.

## Fragment Instance

Starting in 0.12.2, the `replace` option now defaults to `true`. This basically means:

> Whatever you put in the template will be what ends up rendered in the DOM.

So, if your template contains more than one top-level element:

``` js
Vue.component('example', {
  template:
    '<div>A</div>' +
    '<div>B</div>'
})
```

Or, if the template contains only text:

``` js
Vue.component('example', {
  template: 'Hello world'
})
```

In both cases, the instance will become a **fragment instance** which doesn't have a root element. A fragment instance's `$el` will point to an "anchor node", which is an empty Text node (or a Comment node in debug mode). What's probably more important though, is that directives, transitions and attributes (except for props) on the component element will not take any effect - because there is no root element to bind them to:

``` html
<!-- doesn't work due to no root element -->
<example v-show="ok" v-transition="fade"></example>

<!-- props work as intended -->
<example prop="{{someData}}"></example>
```

There are, of course, valid use cases for fragment instances, but it is in general a good idea to give your component template a single root element. It ensures directives and attributes on the component element to be properly transferred, and also results in slightly better performance.
