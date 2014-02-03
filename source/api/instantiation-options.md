title: Instantiation Options
type: api
order: 2
---

# {{title}}

## Data & Logic

### data

- **Type:** `Object`

The data object for the ViewModel. It can be accessed as `vm.$data`:

```js
var data = { a: 1 }
var vm = new Vue({
    data: data
})
vm.$data === data // true
```

The ViewModel will proxy access to all its properties, therefore you can manipulate the properties on the ViewModel and the changes get synced back to the actual data object:

```js
vm.a // 1

vm.a = 2
data.a // 2

data.a = 3
vm.a // 3
```

The object must be JSON-compliant (no circular references). You can use it just like an ordinary object, and it will look exactly the same when serialized with `JSON.stringify`. You can also share it between multiple ViewModels.

<p class="tip">Under the hood, vue.js attaches an hidden property `__observer__` and recursively converts the object's non-function properties into getters and setters that trigger events when called. Properties with keys that starts with `$` or `_` are skipped.</p>

### methods

- **Type:** `Object`

Methods to be mixed into the ViewModel. You can access these methods directly on the VM instance, or use them in directive expressions. All methods will have their `this` context automatically bound to the ViewModel instance.

**Example:**

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

### computed

- **Type:** `Object`

Computed properties to be mixed into the ViewModel. All getters and setters have their `this` context automatically bound to the ViewModel instance.

**Example:**

```js
var vm = new Vue({
    data: { a: 1 },
    computed: {
        aplus: {
            $get: function () {
                return this.a + 1
            },
            $set: function (v) {
                this.a = v - 1
            }
        }
    }
})
vm.aplus // 2
vm.aplus = 3
vm.a // 2
```

## DOM Element

### el

- **Type:** `String` or `HTMLElement`
- **Restriction:** only respected as an instantiation option, i.e. not in `Vue.extend()`

Provide the ViewModel with an existing DOM element. It can be either a `querySelector()` selector or an actual node. The element will be accessible as `vm.$el`. If this option is omitted, a detached node will be automatically created.

### template

- **Type:** `String`

A string template to be inserted into `vm.$el`. Any existing markup inside `vm.$el` will be overwriiten. If the **replace** option is `true`, the template will replace `vm.$el` entirely.

If it starts with `#` it will be used as a querySelector and use the selected element's innerHTML and the template string. This allows the use of the common `<script type="x-template">` trick to include templates.

<p class="tip">Vue.js uses DOM-based templating. The compiler walks through DOM elements and looks for directives and creates data bindings. This means all vue.js templates are parsable HTML that can be converted into actual DOM elements by the browser. Vue.js converts string templates into DOM fragments so they can be cloned when creating more ViewModel instances. If you want your templates to be valid HTML, you can configure the directive prefix to start with `data-`.</p>

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

### created
  
- **Type:** `Function`
- **Alias:** `beforeCompile`

Called before the compilation starts. Can be used to attach additional data to be observed on the ViewModel.

### ready

- **Type:** `Function`
- **Alias:** `afterCompile`

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

An hash of directives to be made available to the ViewModel. For details on how to write a custom directive, see [Writing Custom Directives](/guide/directives.html#Writing_a_Custom_Directive).

### filters

- **Type:** `Object`

A hash of filters to be made available to the ViewModel. For details on how to write a custom filter, see [Writing Custom Filters](/guide/filters.html#Writing_a_Custom_Filter).

### components

- **Type:** `Object`

A hash of components to be made available to the ViewModel. For details on how to extend and compose ViewModels, see [Composing ViewModels](/guide/composition.html).

### partials

- **Type:** `Object`

A hash of partials to be made available to the ViewModel. Also see [v-partial](/api/directives.html#v-partial).

### transitions

- **Type:** `Object`

A hash of transitions to be made available to the ViewModel. For details see [Using Transition Effects](/guide/transitions.html).

## Misc

### lazy

- **Type:** `Boolean`
- **Default:** `false`

Whether to trigger `v-model` updates only on `change` event (hit enter or lose focus) or on every `input` event (on every keystroke).