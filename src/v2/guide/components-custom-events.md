---
title: Custom Events
type: guide
order: 103
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

## Emitting and Listening to Custom Events

Before we take a deeper dive, let's briefly review by upgrading our `button-counter` component from earlier:

{% raw %}
<div id="counter-remember-demo" class="demo">
  <simple-button-counter></simple-button-counter>
</div>
<script>
Vue.component('simple-button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">{{ count }}</button>',
})
new Vue({
  el: '#counter-remember-demo',
  data: {
    total: 0
  }
})
</script>
{% endraw %}

Right now, it just adds 1 to an internal `count` data property every time we click on it:

```js
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">{{ count }}</button>',
})
```

But what if, when we have several buttons, we want to keep track of the _total_ number of button clicks, like this:

{% raw %}
<div id="counter-event-demo" class="demo">
  <p>You've clicked buttons {{ total }} times.</p>
  <button-counter v-on:add-one="total += 1"></button-counter>
  <button-counter v-on:add-one="total += 1"></button-counter>
  <button-counter v-on:add-one="total += 1"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  methods: {
    addOne: function () {
      this.count += 1
      this.$emit('add-one')
    }
  },
  template: '<button v-on:click="addOne">{{ count }}</button>',
})
new Vue({
  el: '#counter-event-demo',
  data: {
    total: 0
  }
})
</script>
{% endraw %}

To make that possible, we'd have to emit an event every time we add 1 to the `button-counter`'s internal `count` property:

```js
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  methods: {
    addOne: function () {
      this.count += 1
      // Let the parent know we added one
      this.$emit('add-one')
    }
  },
  template: '<button v-on:click="addOne">{{ count }}</button>',
})
```

Then use a `total` data property in the parent to keep track of the total number of times the user has clicked a button:

``` js
new Vue({
  el: '#counter-event-demo',
  data: {
    total: 0
  }
})
```

```html
<div id="counter-event-demo" class="demo">
  <p>You've clicked buttons {{ total }} times.</p>
  <button-counter v-on:add-one="total += 1"></button-counter>
  <button-counter v-on:add-one="total += 1"></button-counter>
  <button-counter v-on:add-one="total += 1"></button-counter>
</div>
```

```js
Vue.component('button-counter', {
  data: function () {
    return {
      count: Math.floor(Math.random() * 10) + 1
    }
  },
  methods: {
    addOne: function () {
      this.count += 1
      // Let the parent know we added one
      this.$emit('add-one')
    }
  },
  template: '<button v-on:click="addOne">{{ count }}</button>',
})
```

In this example, it's important to note that the `button-counter` component is still completely decoupled from what happens outside of it. All it does is report information about its own activity, just in case a parent component might care.

If you'd like to see (and experiment with) an evolved example, check out this game called Cupcake Clicker below. It's not very original, but may help you gain a better understanding of how props and events can work together.

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/wbuov3d0/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Programmatically Listening with `$on`

In a template, we'll always use `v-on`

```html
<div id="counter-event-demo" class="demo">
  <p>You've clicked buttons {{ total }} times.</p>
  <button-counter v-on:add-one="total += 1"></button-counter>
  <button-counter v-on:add-one="total += 1"></button-counter>
  <button-counter v-on:add-one="total += 1"></button-counter>
</div>
```

```js
<div id="counter-event-demo" class="demo">
  <p>You've clicked buttons {{ total }} times.</p>
  <button-counter
    v-for="1 in 10"
    ref="buttons"
  ></button-counter>
</div>
```

## Binding Native Events to Components

There may be times when you want to listen for a native event on the root element of a component. In these cases, you can use the `.native` modifier for `v-on`. For example:

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

## `.sync` Modifier

> 2.3.0+

In some cases we may need "two-way binding" for a prop - in fact, in Vue 1.x this is exactly what the `.sync` modifier provided. When a child component mutates a prop that has `.sync`, the value change will be reflected in the parent. This is convenient, however it leads to maintenance issues in the long run because it breaks the one-way data flow assumption: the code that mutates child props are implicitly affecting parent state.

This is why we removed the `.sync` modifier when 2.0 was released. However, we've found that there are indeed cases where it could be useful, especially when shipping reusable components. What we need to change is **making the code in the child that affects parent state more consistent and explicit.**

In 2.3.0+ we re-introduced the `.sync` modifier for props, but this time it is only syntax sugar that automatically expands into an additional `v-on` listener:

The following

``` html
<comp :foo.sync="bar"></comp>
```

is expanded into:

``` html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

For the child component to update `foo`'s value, it needs to explicitly emit an event instead of mutating the prop:

``` js
this.$emit('update:foo', newValue)
```

The `.sync` modifier can also be used with `v-bind` when using an object to set multiple properties at once:

```html
<comp v-bind.sync="{ foo: 1, bar: 2 }"></comp>
```

This has the effect of adding `v-on` update listeners for both `foo` and `bar`.

## Customizing Component `v-model`

> New in 2.2.0+

By default, `v-model` on a component uses `value` as the prop and `input` as the event, but some input types such as checkboxes and radio buttons may want to use the `value` prop for a different purpose. Using the `model` option can avoid the conflict in such cases:

``` js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    // this allows using the `value` prop for a different purpose
    value: String
  },
  // ...
})
```

``` html
<my-checkbox v-model="foo" value="some value"></my-checkbox>
```

The above will be equivalent to:

``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```

<p class="tip">Note that you still have to declare the `checked` prop explicitly.</p>

## Non Parent-Child Communication

Sometimes two components may need to communicate with one-another but they are not parent/child to each other. In simple scenarios, you can use an empty Vue instance as a central event bus:

``` js
var bus = new Vue()
```
``` js
// in component A's method
bus.$emit('id-selected', 1)
```
``` js
// in component B's created hook
bus.$on('id-selected', function (id) {
  // ...
})
```

In more complex cases, you should consider employing a dedicated [state-management pattern](state-management.html).
