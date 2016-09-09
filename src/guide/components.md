---
title: Components
type: guide
order: 11
---

## What are Components?

Components are one of the most powerful features of Vue. They help you extend basic HTML elements to encapsulate reusable code. At a high level, components are custom elements that Vue's compiler attaches behavior to. In some cases, they may also appear as a native HTML element extended with the special `is` attribute.

## Using Components

### Registration

We've learned in the previous sections that we can create a new Vue instances with:

``` js
new Vue({
  el: '#some-element',
  // options
})
```

To register a global component, you can use `Vue.component(tagName, options)`. For example:

``` js
Vue.component('my-component', {
  // options
})
```

<p class="tip">Note that Vue does not enforce the [W3C rules](http://www.w3.org/TR/custom-elements/#concepts) for custom tag names (all-lowercase, must contain a hyphen) though following this convention is considered good practice.</p>

Once registered, a component can be used in an instance's template as a custom element, `<my-component></my-component>`. Make sure the component is registered **before** you instantiate the root Vue instance. Here's the full example:

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// register
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})

// create a root instance
new Vue({
  el: '#example'
})
```

Which will render:

``` html
<div id="example">
  <div>A custom component!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### Local Registration

You don't have to register every component globally. You can make a component available only in the scope of another instance/component by registering it with the `components` instance option:

``` js
var Child = {
  template: '<div>A custom component!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> will only be available in parent's template
    'my-component': Child
  }
})
```

The same encapsulation applies for other registerable Vue features, such as directives.

### Component Option Caveats

Most of the options that can be passed into the Vue constructor can be used in a component, with two special cases: `data` and `el` must be functions. In fact, if you try this:

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
```

Then Vue will halt and emit warnings in the console, telling you that `data` must be a function for component instances. It's good to understand why the rules exist though, so let's cheat.

``` html
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
```

``` js
var data = { counter: 0 }

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // data is technically a function, so Vue won't
  // complain, but we return the same object
  // reference for each component instance
  data: function () {
    return data
  }
})

new Vue({
  el: '#example-2'
})
```

{% raw %}
<div id="example-2" class="demo">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
<script>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
</script>
{% endraw %}

Since all three component instances share the same `data` object, incrementing one counter increments them all! Ouch. Let's fix this by instead returning a fresh data object:

``` js
data: function () {
  return {
    counter: 0
  }
}
```

Now all our counters each have their own internal state:

{% raw %}
<div id="example-2-5" class="demo">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  }
})
new Vue({
  el: '#example-2-5'
})
</script>
{% endraw %}

The `el` option also requires a function value when used in a component instance, for exactly the same reason.

### Template Parsing Caveats

As long as you use string templates ([`<script type="text/x-template">`](#X-Templates), inline template strings, or [`.vue` components](single-file-components.html)), you are not subject to many of the restrictions inherent to HTML elements. However, if you use the `el` option to mount to an element with existing content as the template:

- `a` can not contain other interactive elements (e.g. buttons and other links)
- `li` should be a direct child of `ul` or `ol`, and both `ul` and `ol` can only contain `li`
- `option` should be a direct child of `select`, and `select` can only contain `option` (and `optgroup`)
- `table` can only contain `thead`, `tbody`, `tfoot` and `tr`, and these elements should be direct children of `table`
- `tr` can only contain `th` and `td`, and these elements should be direct children of `tr`

In practice these restrictions can cause unexpected behavior. Although in simple cases it might appear to work, you can not rely on custom elements being expanded before browser validation. E.g. `<my-select><option>...</option></my-select>` is not a valid template even if `my-select` component eventually expands to `<select>...</select>`.

Another consequence is that you can not use custom tags (including custom elements and special tags like `<component>`, `<template>` and `<partial>`) inside of `ul`, `select`, `table` and other elements with similar restrictions. Custom tags will be hoisted out and thus not render properly.

In case of a custom element you should use the `is` special attribute:

``` html
<table>
  <tr is="my-component"></tr>
</table>
```

In case of a `<template>` inside of a `<table>` you should use `<tbody>`, as tables are allowed to have multiple `tbody`:

``` html
<table>
  <tbody v-for="item in items">
    <tr>Even row</tr>
    <tr>Odd row</tr>
  </tbody>
</table>
```

Again, it should be noted that these limitations do **not** apply with string templates via:

- `<script type="text/x-template">`
- inline template strings
- `.vue` components

## Props

### Passing Data with Props

Every component instance has its own **isolated scope**. This means you cannot (and should not) directly reference parent data in a child component's template. Data can be passed down to child components using **props**.

A prop is a custom attribute for passing information from parent components. A child component needs to explicitly declare the props it expects to receive using the [`props` option](/api/#props):

``` js
Vue.component('child', {
  // declare the props
  props: ['message'],
  // just like data, the prop can be used inside templates
  // and is also made available in the vm as this.message
  template: '<span>{{ message }}</span>'
})
```

Then we can pass a plain string to it like so:

``` html
<child message="hello!"></child>
```

Result:

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="hello!"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['message'],
      template: '<span>{{ message }}</span>'
    }
  }
})
</script>
{% endraw %}

### camelCase vs. kebab-case

HTML attributes are case-insensitive, so when using non-string templates, camelCased prop names need to use their kebab-case (hyphen-delimited) equivalents:

``` js
Vue.component('child', {
  // camelCase in JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case in HTML -->
<child my-message="hello!"></child>
```

Again, if you're using string templates, then this limitation does not apply.

### Dynamic Props

Similar to binding a normal attribute to an expression, we can also use `v-bind` for dynamically binding props to data on the parent. Whenever the data is updated in the parent, it will also flow down to the child:

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

It's often simpler to use the shorthand syntax for `v-bind`:

``` html
<child :my-message="parentMsg"></child>
```

Result:

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Message from parent'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

### Literal vs. Dynamic

A common mistake beginners tend to make is attempting to pass down a number using the literal syntax:

``` html
<!-- this passes down a plain string "1" -->
<comp some-prop="1"></comp>
```

However, since this is a literal prop, its value is passed down as a plain string `"1"` instead of an actual number. If we want to pass down an actual JavaScript number, we need to use `v-bind` so that its value is evaluated as a JavaScript expression:

``` html
<!-- this passes down an actual number -->
<comp v-bind:some-prop="1"></comp>
```

### One-Way Data Flow

All props form a **one-way-down** binding between the child property and the parent one: when the parent property updates, it will flow down to the child, but not the other way around. This prevents child components from accidentally mutating the parent's state, which can make your app's data flow harder to reason about.

This means you should never mutate props. If you do, Vue will slap your hand with a warning in the console. If you feel the need to mutate a prop, you can instead use it in a computed property or to define the initial value for a data property.

<p class="tip">Note that objects and arrays in JavaScript are passed by reference, so if the prop is an array or object, mutating the object or array itself inside the child **will** affect parent state.</p>

Here's an example:

``` html
<div id="parent-object-mutation-demo">
  <p>Parent: {{ message.text }}</p>
  <p>Child: <my-component v-bind:parent-message="message"></my-component></p>
</div>
```

``` js
Vue.component('my-component', {
  template: '<input v-model="message.text">',
  props: ['parentMessage'],
  data: function () {
    return {
      message: this.parentMessage
    }
  }
})

new Vue({
  el: '#parent-object-mutation-demo',
  data: {
    message: {
      text: 'hello'
    }
  }
})
```

{% raw %}
<div id="parent-object-mutation-demo" class="demo">
  <p>Parent: {{ message.text }}</p>
  <p>Child: <my-component v-bind:parent-message="message"></my-component></p>
</div>
<script>
Vue.component('my-component', {
  template: '<input v-model="message.text">',
  props: ['parentMessage'],
  data: function () {
    return {
      message: this.parentMessage
    }
  }
})
new Vue({
  el: '#parent-object-mutation-demo',
  data: {
    message: {
      text: 'hello'
    }
  }
})
</script>
{% endraw %}

To fix this, you can clone the object with:

``` js
data: function () {
  return {
    message: JSON.parse(JSON.stringify(this.parentMessage))
  }
}
```

Or if you're using Babel with ES2015, the much simpler:

``` js
data () {
  return {
    message: { ...this.parentMessage }
  }
}
```

### Prop Validation

It is possible for a component to specify requirements for the props it is receiving. If a requirement is not meant, Vue will emit warnings. This is especially useful when you are authoring a component that is intended to be used by others.

Instead of defining the props as an array of strings, you can use an object with validation requirements:

``` js
Vue.component('example', {
  props: {
    // basic type check (`null` means accept any type)
    propA: Number,
    // multiple possible types
    propB: [String, Number],
    // a required string
    propC: {
      type: String,
      required: true
    },
    // a number with default value
    propD: {
      type: Number,
      default: 100
    },
    // object/array defaults should be returned from a
    // factory function
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // custom validator function
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

The `type` can be one of the following native constructors:

- String
- Number
- Boolean
- Function
- Object
- Array

In addition, `type` can also be a custom constructor function and the assertion will be made with an `instanceof` check.

When a prop validation fails, Vue will refuse to set the value on the child component and throw a warning if using the development build.

## Parent-Child Communication

### Parent Chain

A child component holds access to its parent component as `this.$parent`. A root Vue instance will be available to all of its descendants as `this.$root`. Each parent component has an array, `this.$children`, which contains all its child components.

When you'd like to access a specific child, you can give that component a `ref` attribute (e.g. `ref="myChild"`), which makes the component instance available via `this.$refs.myChild`.

<p class="tip">These properties are made available as an escape hatch to accomodate extreme edge cases. They are not the correct way to access and mutate components in the vast majority of circumstances and if abused, can make your components much more difficult to reason about.</p>

Instead, prefer passing data down explicitly using props. Where data must be shared and mutated by multiple components, a parent component can be used to manage state in a single location. To mutate parent state, custom events can be emitted that parents may choose to listen to or mutation methods can be passed to child components.

For managing state in more complex applications, [vuex](https://github.com/vuejs/vuex/) is recommended as an officially supported companion library.

### Custom Events

You can use a pattern similar to the EventEmitter in Node.js: a centralized event hub that allows components to communicate, no matter where they are in the component tree. Because Vue instances implement the event emitter interface, you can actually use an empty Vue instance for this purpose:

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

As you can see, the event system can:

- Listen to events using `$on()`
- Trigger events using `$emit()`

The example above looks pretty simple, but when looking at component B's code, it's not so obvious where the `"id-selected"` event comes from. That's why when possible, it's better to use custom events for explicit communication between parent and children using `v-on`.

Here's a simple example:

``` html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

``` js
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

{% raw %}
<div id="counter-event-example" class="demo">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
</script>
{% endraw %}

In this example, it's important to note that the child component is still completely decoupled from what happens outside of it. All it does is report information about its own activity, just in case a parent component might care.

#### Binding Native Events to Components

There may be times when you want to listen for a native event on the root element of a component. In these cases, you can use the `.native` modifier for `v-on`. For example:

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### Form Input Components using Custom Events

This strategy can also be used to create custom form inputs that work with `v-model`. Remember:

``` html
<input v-model="something">
```

is just syntactic sugar for:

``` html
<input v-bind:value="something" v-on:input="something = $event.target.value">
```

When used with a component, this simplifies to:

``` html
<input v-bind:value="something" v-on:input="something = arguments[0]">
```

So for a component to work with `v-model`, it must:

- accept a `value` prop
- emit an `input` event with the new value

Let's see it in action:

``` html
<div id="v-model-example">
  <p>{{ message }}</p>
  <my-input
    label="Message"
    v-model="message"
  ></my-input>
</div>
```

``` js
Vue.component('my-input', {
  template: '\
    <div class="form-group">\
      <label v-bind:for="randomId">{{ label }}:</label>\
      <input v-bind:id="randomId" v-bind:value="value" v-on:input="onInput">\
    </div>\
  ',
  props: ['value', 'label'],
  data: function () {
    return {
      randomId: 'input-' + Math.random()
    }
  },
  methods: {
    onInput: function (event) {
      this.$emit('input', event.target.value)
    }
  },
})

new Vue({
  el: '#v-model-example',
  data: {
    message: 'hello'
  }
})
```

{% raw %}
<div id="v-model-example" class="demo">
  <p>{{ message }}</p>
  <my-input
    label="Message"
    v-model="message"
  ></my-input>
</div>
<script>
Vue.component('my-input', {
  template: '\
    <div class="form-group">\
      <label v-bind:for="randomId">{{ label }}:</label>\
      <input v-bind:id="randomId" v-bind:value="value" v-on:input="onInput">\
    </div>\
  ',
  props: ['value', 'label'],
  data: function () {
    return {
      randomId: 'input-' + Math.random()
    }
  },
  methods: {
    onInput: function (event) {
      this.$emit('input', event.target.value)
    }
  },
})
new Vue({
  el: '#v-model-example',
  data: {
    message: 'hello'
  }
})
</script>
{% endraw %}

This interface can be used not only to connect with form inputs inside a component, but also to easily integrate input types that you invent yourself. Imagine these possibilities:

``` html
<voice-recognizer v-model="question"></voice-recognizer>
<webcam-gesture-reader v-model="gesture"></webcam-gesture-reader>
<webcam-retinal-scanner v-model="retinalImage"></webcam-retinal-scanner>
```

### Child Component Reference

Despite the existence of props and events, sometimes you might still need to directly access a child component in JavaScript. To achieve this you have to assign a reference ID to the child component using `ref`. For example:

``` html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// access child component instance
var child = parent.$refs.profile
```

When `ref` is used together with `v-for`, the ref you get will be an array or an object containing the child components mirroring the data source.

## Content Distribution with Slots

When using components, it is often desired to compose them like this:

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

There are two things to note here:

1. The `<app>` component does not know what content may be present inside its mount target. It is decided by whatever parent component that is using `<app>`.

2. The `<app>` component very likely has its own template.

To make the composition work, we need a way to interweave the parent "content" and the component's own template. This is a process called **content distribution** (or "transclusion" if you are familiar with Angular). Vue.js implements a content distribution API that is modeled after the current [Web Components spec draft](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), using the special `<slot>` element to serve as distribution outlets for the original content.

### Compilation Scope

Before we dig into the API, let's first clarify which scope the contents are compiled in. Imagine a template like this:

``` html
<child-component>
  {{ message }}
</child-component>
```

Should the `message` be bound to the parent's data or the child data? The answer is the parent. A simple rule of thumb for component scope is:

> Everything in the parent template is compiled in parent scope; everything in the child template is compiled in child scope.

A common mistake is trying to bind a directive to a child property/method in the parent template:

``` html
<!-- does NOT work -->
<child-component v-show="someChildProperty"></child-component>
```

Assuming `someChildProperty` is a property on the child component, the example above would not work. The parent's template is not aware of the state of a child component.

If you need to bind child-scope directives on a component root node, you should do so in the child component's own template:

``` js
Vue.component('child-component', {
  // this does work, because we are in the right scope
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

Similarly, distributed content will be compiled in the parent scope.

### Single Slot

Parent content will be **discarded** unless the child component template contains at least one `<slot>` outlet. When there is only one slot with no attributes, the entire content fragment will be inserted at its position in the DOM, replacing the slot itself.

Anything originally inside the `<slot>` tags is considered **fallback content**. Fallback content is compiled in the child scope and will only be displayed if the hosting element is empty and has no content to be inserted.

Suppose we have a component called `my-component` with the following template:

``` html
<div>
  <h2>I'm the child title</h2>
  <slot>
    This will only be displayed if there is no content
    to be distributed.
  </slot>
</div>
```

And a parent that uses the component:

``` html
<div>
  <h1>I'm the parent title</h1>
  <my-component>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </my-component>
</div>
```

The rendered result will be:

``` html
<div>
  <h1>I'm the parent title</h1>
  <div>
    <h2>I'm the child title</h2>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </div>
</div>
```

### Named Slots

`<slot>` elements have a special attribute, `name`, which can be used to further customize how content should be distributed. You can have multiple slots with different names. A named slot will match any element that has a corresponding `slot` attribute in the content fragment.

There can still be one unnamed slot, which is the **default slot** that serves as a catch-all outlet for any unmatched content. If there is no default slot, unmatched content will be discarded.

For example, suppose we have an `app-layout` component with the following template:

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Parent markup:

``` html
<app-layout>
  <h1 slot="header">Here might be a page title</h1>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</app-layout>
```

The rendered result will be:

``` html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

The content distribution API is a very useful mechanism when designing components that are meant to be composed together.

## Dynamic Components

You can use the same mount point and dynamically switch between multiple components using the reserved `<component>` element and dynamically bind to its `is` attribute:

``` js
new Vue({
  el: 'body',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component v-bind:is="currentView">
  <!-- component changes when vm.currentView changes! -->
</component>
```

If you prefer, you can also bind directly to component objects:

``` js
var Home = {
  template: '<p>Welcome home!</p>'
}

new Vue({
  el: 'body',
  data: {
    currentView: Home
  }
})
```

### `keep-alive`

If you want to keep the switched-out components in memory so that you can preserve their state or avoid re-rendering, you can wrap a dynamic component in a `keep-alive` element:

``` html
<keep-alive>
  <component :is="currentView">
    <!-- inactive components will be cached! -->
  </component>
</keep-alive>
```

## Misc

### Components and v-for

You can directly use `v-for` on a custom component, like any normal element:

``` html
<my-component v-for="item in items"></my-component>
```

However, this won't automatically pass any data to the component, because components have isolated scopes of their own. In order to pass the iterated data into the component, we should also use props:

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index">
</my-component>
```

The reason for not automatically injecting `item` into the component is because that makes the component tightly coupled to how `v-for` works. Being explicit about where its data comes from makes the component reusable in other situations.

Here's a complete example of a simple todo list:

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    <\li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <input
    v-model="newTodoText" v
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    <\li>\
  ',
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}


### Authoring Reusable Components

When authoring components, it's good to keep in mind whether you intend to reuse it somewhere else later. It's OK for one-off components to be tightly coupled, but reusable components should define a clean public interface and make no assumptions about the context it's used in.

The API for a Vue component comes in three parts - props, events, and slots:

- **Props** allow the external environment to feed data to the component

- **Events** allow the component to trigger actions in the external environment

- **Slots** allow the external environment to insert content into the component

With the dedicated shorthand syntaxes for `v-bind` and `v-on`, the intents can be clearly and succinctly conveyed in the template:

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

### Async Components

In large applications, we may need to divide the app into smaller chunks and only load a component from the server when it's actually needed. To make that easier, Vue allows you to define your component as a factory function that asynchronously resolves your component definition. Vue will only trigger the factory function when the component actually needs to be rendered and will cache the result for future re-renders. For example:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

The factory function receives a `resolve` callback, which should be called when you have retrieved your component definition from the server. You can also call `reject(reason)` to indicate the load has failed. The `setTimeout` here is simply for demonstration; How to retrieve the component is entirely up to you. One recommended approach is to use async components together with [Webpack's code-splitting feature](http://webpack.github.io/docs/code-splitting.html):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // This special require syntax will instruct Webpack to
  // automatically split your built code into bundles which
  // are loaded over Ajax requests.
  require(['./my-async-component'], resolve)
})
```

### Component Naming Conventions

When registering components (or props), you can use kebab-case, camelCase, or TitleCase. Vue doesn't care.

``` js
// in a component definition
components: {
  // register using camelCase
  'kebab-cased-component': { /* ... */ },
  'camelCasedComponent': { /* ... */ },
  'TitleCasedComponent': { /* ... */ }
}
```

Within HTML templates though, you have to use the kebab-case equivalents:

``` html
<!-- alway use kebab-case in HTML templates -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<title-cased-component></title-cased-component>
```

When using _string_ templates however, we're not bound by HTML's case-insensitive restrictions. That means even in the template, you reference your components and props using camelCase, PascalCase, or kebab-case:

``` html
<!-- use whatever you want in string templates! -->
<my-component></my-component>
<myComponent></myComponent>
<MyComponent></MyComponent>
```

If your component isn't passed content via `slot` elements, you can even make it self-closing with a `/` after the name:

``` html
<my-component/>
```

Again, this _only_ works within string templates, as self-closing custom elements are not valid HTML and your browser's native parser will not understand them.

### Recursive Component

Components can recursively invoke themselves in their own template. However, they can only do so with the `name` option:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

A component like the above will result in a "max stack size exceeded" error, so make sure recursive invocation is conditional (i.e. uses a `v-if` that will eventually be false). When you register a component globally using `Vue.component`, the global ID is automatically set as the component's `name` option.

### Inline Templates

When the `inline-template` special attribute is present on a child component, the component will use its inner content as its template, rather than treating it as distributed content. This allows more flexible template-authoring.

``` html
<my-component inline-template>
  <p>These are compiled as the component's own template.</p>
  <p>Not parent's transclusion content.</p>
</my-component>
```

However, `inline-template` makes the scope of your templates harder to reason about. As a best practice, prefer defining templates inside the component using the `template` option or in a `template` element in a `.vue` file.

### X-Templates

Another way to define templates is inside of a script element with the type `text/x-template`, then referencing the template by an id. For example:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

These can be useful for demos with large templates or in extremely small applications, but should otherwise be avoided, because they separate templates from the rest of the component definition.

### Cheap Static Components with `v-once`

Rendering plain HTML elements is very fast in Vue, but sometimes you might have a component that contains **a lot** of static content. In these cases, you can ensure that it's only evaluated once and then cached by adding the `v-once` directive to the root element, like this:

``` js
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Terms of Service</h1>\
      ... a lot of static content ...\
    </div>\
  '
})
```
