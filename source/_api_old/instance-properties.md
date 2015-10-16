---
title: Instance Properties
type: api
order: 3
---

### vm.$el

- **Type:** `HTMLElement`
- **Read only**

The DOM element that the Vue instance is managing. Note that for [Fragment Instances](/guide/best-practices.html#Fragment_Instance), `vm.$el` will return an anchor node that indicates the starting position of the fragment.

### vm.$data

- **Type:** `Object`

The data object that the Vue instance is observing. You can swap it with a new object. The Vue instance proxies access to the properties on its data object.

### vm.$options

- **Type:** `Object`

The instantiation options used for the current Vue instance. This is useful when you want to include custom properties in the options:

``` js
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // -> 'foo'
  }
})
```

### vm.$parent

- **Type:** `Vue`
- **Read only**

The parent instance, if the current instance has one.

### vm.$root

- **Type:** `Vue`
- **Read only**

The root Vue instance of the current component tree. If the current instance has no parents this value will be itself.

### vm.$children

- **Type:** `Array<Vue>`
- **Read only**

The direct child components of the current instance.

### vm.$

- **Type:** `Object`
- **Read only**

An object that holds child components that have `v-ref` registered. For more details see [v-ref](/api/directives.html#v-ref).

### vm.$$

- **Type:** `Object`
- **Read only**

An object that holds DOM elements that have `v-el` registered. For more details see [v-el](/api/directives.html#v-el).

### Meta Properties

Instances created by `v-repeat` will also have some meta properties, e.g. `vm.$index`, `vm.$key` and `vm.$value`. For more details, see [the guide on using `v-repeat`](/guide/list.html).
