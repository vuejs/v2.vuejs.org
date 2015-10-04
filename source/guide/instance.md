title: The Vue Instance
type: guide
order: 3
---

## Constructor

Every Vue.js app is bootstrapped by creating a **root Vue instance** with the `Vue` constructor function:

``` js
var vm = new Vue({
  // options
})
```

A Vue instance is essentially a **ViewModel** as defined in the [MVVM pattern](https://en.wikipedia.org/wiki/Model_View_ViewModel), hence the variable name `vm` you will see throughout the docs.

When you instantiate a Vue instance, you need to pass in an **options object** which can contain options for data, template, element to mount on, methods, lifecycle callbacks and more. The full list of options can be found in the API reference.

The `Vue` constructor can be extended to create reusable **component constructors** with pre-defined options:

``` js
var MyComponent = Vue.extend({
  // extension options
})

// all instnaces of `MyComponent` are created with
// the pre-defined extension options
var myComponentInstance = new MyComponent()
```

Although you can create extended instances imperatively, in most cases you will be registering a component constructor as a custom element and composing them in templates declaratively. We will talk about the component system in details later. For now, you just need to know that all Vue.js components are essentially extended Vue instances.

## Properties and Methods

Each Vue instance proxies all the properties in its `data` object:

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// setting the property also affects original data
vm.a = 2
data.a // -> 2

// ... and vice-versa
data.a = 3
vm.a // -> 3
```

In addition, Vue instances expose a number of useful instance properties and methods. These properties and methods are prefixed with `$` to differentiate from proxied data properties. For example:

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch is an instance method
vm.$watch('a', function (newVal, oldVal) {
  // this callback will be called when `vm.a` changes
})
```

Consult the API reference for the full list of instance properties and methods.

## Instance Lifecycle

Each Vue instance goes through a series of initialization phases when it is created - for example, it needs to setup data observation, compile the template, and create the necessary data bindings. Along the way, it will invoke some **lifecycle hooks**, for example, the `created` hook:

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  // the `created` hook is called after data
  // has been observed.
  created: function () {
    // `this` points to the vm instance
    console.log(this.a) // -> 1
  }
})
```

Here's a diagram that can help you better envision the lifecycle of a Vue instance:

![Vue instance lifecycle](/images/lifecycle.png)

## Fragment Instance

When you use the `template` option, the content of the template will replace the element the Vue instance is mounted on. It is therefore recommended to always include a single root-level element in templates.

If your template contains more than one top-level element:

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
