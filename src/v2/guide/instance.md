---
title: The Vue Instance
type: guide
order: 3
---

## Constructor

Every Vue vm is bootstrapped by creating a **root Vue instance** with the `Vue` constructor function:

``` js
var vm = new Vue({
  // options
})
```

Although not strictly associated with the [MVVM pattern](https://en.wikipedia.org/wiki/Model_View_ViewModel), Vue's design was no doubt inspired by it. As a convention, we often use the variable `vm` (short for ViewModel) to refer to our Vue instances.

When you instantiate a Vue instance, you need to pass in an **options object** which can contain options for data, template, element to mount on, methods, lifecycle callbacks and more. The full list of options can be found in the [API reference](../api).

The `Vue` constructor can be extended to create reusable **component constructors** with pre-defined options:

``` js
var MyComponent = Vue.extend({
  // extension options
})

// all instances of `MyComponent` are created with
// the pre-defined extension options
var myComponentInstance = new MyComponent()
```

Although it is possible to create extended instances imperatively, most of the time it is recommended to compose them declaratively in templates as custom elements. We will talk about [the component system](components.html) in detail later. For now, you just need to know that all Vue components are essentially extended Vue instances.

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

In addition to data properties, Vue instances expose a number of useful instance properties and methods. These properties and methods are prefixed with `$` to differentiate them from proxied data properties. For example:

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

<p class="tip">Don't use [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) on an instance property or callback (e.g. `vm.$watch('a', newVal => this.myMethod())`). As arrow functions are bound to the parent context, `this` will not be the Vue instance as you'd expect and `this.myMethod` will be undefined.</p>

Consult the [API reference](../api) for the full list of instance properties and methods.

## Instance Lifecycle Hooks

Each Vue instance goes through a series of initialization steps when it is created - for example, it needs to set up data observation, compile the template, mount the instance to the DOM, and update the DOM when data changes. Along the way, it will also invoke some **lifecycle hooks**, which give us the opportunity to execute custom logic. For example, the `created` hook is called after the instance is created:

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

There are also other hooks which will be called at different stages of the instance's lifecycle, for example `mounted`, `updated`, and `destroyed`. All lifecycle hooks are called with their `this` context pointing to the Vue instance invoking it. You may have been wondering where the concept of "controllers" lives in the Vue world and the answer is: there are no controllers. Your custom logic for a component would be split among these lifecycle hooks.

## Lifecycle Diagram

Below is a diagram for the instance lifecycle. You don't need to fully understand everything going on right now, but this diagram will be helpful in the future.

![Lifecycle](/images/lifecycle.png)
