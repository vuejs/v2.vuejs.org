title: Instantiation Options
type: api
order: 2
---

## Data & Logic

### data

- **Type:** `Object`

The data object for the ViewModel. The ViewModel will proxy access to all its properties. The object it self can be accessed as `vm.$data`.

```js
var data = { a: 1 }
var vm = new Vue({
    data: data
})
vm.a // 1
vm.a = 2
data.a // 2
data.a = 3
vm.a // 3
vm.$data === data // true
var a = "fesfsef"
```

### methods

- **Type:** `Object`

Methods to be copied to the ViewModel. All methods will have their `this` context automatically bound to the ViewModel.

```js
var vm = new Vue({
    data: { a: 1 },
    methods: {
        plus: function () {
            this.a++
        }
    }
})
vm.plus()
vm.a // 2
```

## DOM Element

### el

- **Type:** `String` or `HTMLElement`
- **Restriction:** only respected as an instantiation option, i.e. not in `Vue.extend()`

Provide the ViewModel with an existing DOM node. It can be either a `querySelector()` selector or an actual node. The element will be accessible as `vm.$el`. If this option is omitted, a detached node will be automatically created.

### template

- **Type:** `String`

A raw template string which will be converted into a DOM fragment and cloned into `vm.$el`. It will overwrite `vm.$el`'s existing inner content.

### replace

- **Type:** `Boolean`  
- **Default:** `false`
- **Restriction:** only respected if the **template** option is present and the template contains exactly 1 top level element.

Whether to replace `vm.$el` with the template's top level element.

### tagName

- **Type:** `String`  
- **Default:** `'div'`
- **Restriction:** only respected when the **el** option is omitted and the **replace** option is `false`.

The tag name to be used when creating `vm.$el`.

### id

- **Type:** `String`

Set as `vm.$el.id`.

### className

- **Type:** `String`

Set as `vm.$el.className`.

### attributes

- **Type:** `Object`

A hash of HTML attributes to be set on `vm.$el`.

## Lifecycle Hooks

All lifecycle hooks have their `this` context bound to the ViewModel they belong to.

### beforeCompile
  
- **Type:** `Function`
- Alias: `created`

Called before the compilation starts. Can be used to attach additional data to be observed on the ViewModel.

### afterCompile

- **Type:** `Function`
- Alias: `ready`

Called after the compilation has ended and the ViewModel is ready.

### enteredView

- **Type:** `Function`

Called when `vm.$el` is attached to DOM by a VueJS directive. Direct manipulation of `vm.$el` will **not** trigger this hook.

### leftView

- **Type:** `Function`

Called when `vm.$el` is removed from the DOM by a VueJS directive. Direct manipulation of `vm.$el` will **not** trigger this hook.

### beforeDestroy

- **Type:** `Function`

Called before a ViewModel is destroyed.

### afterDestroy

- **Type:** `Function`

Called after a ViewModel has been destroyed.

## Private Assets

These are private assets that will be available only to this ViewModel and its children during compilation.

### directives

- **Type:** `Object`

An hash of directives to be made available to the ViewModel. For details on how to write a custom directive, see [Writing Custom Directives](/guide/custom-directive.html).

### filters

- **Type:** `Object`

A hash of filters to be made available to the ViewModel. For details on how to write a custom filter, see [Writing Custom Filters](/guide/custom-filter.html).

### components

- **Type:** `Object`

A hash of components to be made available to the ViewModel. For details on how to extend and compose ViewModels, see [Composing ViewModels](/guide/composition.html).

### partials

- **Type:** `Object`

A hash of partials to be made available to the ViewModel. Also see [v-partial](/api/directives.html#v-partial).

## Misc

### lazy

- **Type:** `Boolean`

Whether to trigger `v-model` updates only on `change` event (hit enter or lose focus) or on every `input` event (on every keystroke).