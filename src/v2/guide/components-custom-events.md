---
title: Custom Events
type: guide
order: 103
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

## Event Names

Unlike components and props, event names don't provide any automatic case transformation. Instead, the name of an emitted event must exactly match the name used to listen to that event. For example, if emitting a camelCased event name:

```js
this.$emit('myEvent')
```

Listening to the kebab-cased version will have no effect:

```html
<my-component v-on:my-event="doSomething"></my-component>
```

Unlike components and props, event names will never be used as variable or property names in JavaScript, so there's no reason to use camelCase or PascalCase. Additionally, `v-on` event listeners inside DOM templates will be automatically transformed to lowercase (due to HTML's case-insensitivity), so `v-on:myEvent` would become `v-on:myevent` -- making `myEvent` impossible to listen to.

For these reasons, we recommend you **always use kebab-case for event names**.

## Customizing Component `v-model`

> New in 2.2.0+

By default, `v-model` on a component uses `value` as the prop and `input` as the event, but some input types such as checkboxes and radio buttons may want to use the `value` attribute for a [different purpose](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value). Using the `model` option can avoid a conflict in such cases:

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

Now when using `v-model` on this component:

```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```

the value of `lovingVue` will be passed to the `checked` prop. The `lovingVue` property will then be updated when `<base-checkbox>` emits a `change` event with a new value.

<p class="tip">Note that you still have to declare the <code>checked</code> prop in component's <code>props</code> option.</p>

## Binding Native Events to Components

There may be times when you want to listen directly to a native event on the root element of a component. In these cases, you can use the `.native` modifier for `v-on`:

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

This can be useful sometimes, but it's not a good idea when you're trying to listen on a very specific element, like an `<input>`. For example, the `<base-input>` component above might refactor so that the root element is actually a `<label>` element:

```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

In that case, the `.native` listener in the parent would silently break. There would be no errors, but the `onFocus` handler wouldn't be called when we expected it to.

To solve this problem, Vue provides a `$listeners` property containing an object of listeners being used on the component. For example:

```js
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

Using the `$listeners` property, you can forward all event listeners on the component to a specific child element with `v-on="$listeners"`. For elements like `<input>`, that you also want to work with `v-model`, it's often useful to create a new computed property for listeners, like `inputListeners` below:

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` merges objects together to form a new object
      return Object.assign({},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

Now the `<base-input>` component is a **fully transparent wrapper**, meaning it can be used exactly like a normal `<input>` element: all the same attributes and listeners will work, without the `.native` modifier.

## `.sync` Modifier

> New in 2.3.0+

In some cases, we may need "two-way binding" for a prop. Unfortunately, true two-way binding can create maintenance issues, because child components can mutate the parent without the source of that mutation being obvious in both the parent and the child.

That's why instead, we recommend emitting events in the pattern of `update:my-prop-name`. For example, in a hypothetical component with a `title` prop, we could communicate the intent of assigning a new value with:

```js
this.$emit('update:title', newTitle)
```

Then the parent can listen to that event and update a local data property, if it wants to. For example:

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

For convenience, we offer a shorthand for this pattern with the `.sync` modifier:

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

The `.sync` modifier can also be used with `v-bind` when using an object to set multiple props at once:

```html
<text-document v-bind.sync="doc"></text-document>
```

This passes each property in the `doc` object (e.g. `title`) as an individual prop, then adds `v-on` update listeners for each one.

<p class="tip">Using <code>v-bind.sync</code> with a literal object, such as in <code>v-bind.sync="{ title: doc.title }"</code>, will not work, because there are too many edge cases to consider in parsing a complex expression like this.</p>
