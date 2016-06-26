---
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

When you instantiate a Vue instance, you need to pass in an **options object** which can contain options for data, template, element to mount on, methods, lifecycle callbacks and more. The full list of options can be found in the [API reference](/api).

The `Vue` constructor can be extended to create reusable **component constructors** with pre-defined options:

``` js
var MyComponent = Vue.extend({
  // extension options
})

// all instances of `MyComponent` are created with
// the pre-defined extension options
var myComponentInstance = new MyComponent()
```

Although you can create extended instances imperatively, in most cases you will be registering a component constructor as a custom element and composing them in templates declaratively. We will talk about the component system in detail later. For now, you just need to know that all Vue.js components are essentially extended Vue instances.

## Properties and Methods

Each Vue instance **proxies** all the properties found in its `data` object:

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

It should be noted that only these proxied properties are **reactive**. If you attach a new property to the instance after it has been created, it will not trigger any view updates. We will discuss the reactivity system in detail later.

In addition to data properties, Vue instances expose a number of useful instance properties and methods. These properties and methods are prefixed with `$` to differentiate from proxied data properties. For example:

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

Consult the [API reference](/api) for the full list of instance properties and methods.

## Instance Lifecycle

Each Vue instance goes through a series of initialization steps when it is created - for example, it needs to set up data observation, compile the template, and create the necessary data bindings. Along the way, it will also invoke some **lifecycle hooks**, which give us the opportunity to execute custom logic. For example, the `created` hook is called after the instance is created:

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` points to the vm instance
    console.log('a is: ' + this.a)
  }
})
// -> "a is: 1"
```

There are also other hooks which will be called at different stages of the instance's lifecycle, for example `compiled`, `ready` and `destroyed`. All lifecycle hooks are called with their `this` context pointing to the Vue instance invoking it. Some users may have been wondering where the concept of "controllers" lives in the Vue.js world, and the answer is: there are no controllers in Vue.js. Your custom logic for a component would be split among these lifecycle hooks.

## Lifecycle Diagram

Below is a diagram for the instance lifecycle. You don't need to fully understand everything going on right now, but this diagram will be helpful in the future.

![Lifecycle](/images/lifecycle.png)
