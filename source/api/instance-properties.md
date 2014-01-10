title: Instance Properties
type: api
order: 3
---

# {{title}}

### vm.$el

- **Type:** `HTMLElement`
- **Read only**

The DOM node that the ViewModel is managing.

### vm.$data

- **Type:** `Object`

The data object that the ViewModel is observing. You can swap it with a new object. The ViewModel proxies access to the properties on its data object.

### vm.$

- **Type:** `Object`
- **Read only**

An object that holds child ViewModels that has `v-component-id` registered. For more details see [v-component-id](/api/directives.html#v-component-id).

### vm.$index

- **Type:** `Number`

The Array index of a child ViewModel created by `v-repeat`. For more details see [v-repeat](/api/directives.html#v-repeat).

### vm.$parent

- **Type:** `Object ViewModel`
- **Read only**

The parent ViewModel, if the current ViewModel has one.

### vm.$root

- **Type:** `Object ViewModel`
- **Read only**

The root ViewModel. It the current ViewModel has no parents this value will be itself.

### vm.$compiler

- **Type:** `Object Compiler`
- **Read only**

The Compiler instance of the ViewModel. This object maintains some internal state of the ViewModel such as data bindings and in most cases you should avoid touching it.