---
title: Props
type: guide
order: 102
---

<script>
const __pageRedirects = {
  '#Non-Prop-Attributes': '/guide/components/attrs.html'
}
</script>

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

<div class="vueschool"><a href="https://vueschool.io/lessons/reusable-components-with-props?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how component props work with Vue School">Learn how component props work with a free lesson on Vue School</a></div>

## Prop Casing (camelCase vs kebab-case)

HTML attribute names are case-insensitive, so browsers will interpret any uppercase characters as lowercase. That means when you're using in-DOM templates, camelCased prop names need to use their kebab-cased (hyphen-delimited) equivalents:

``` js
Vue.component('blog-post', {
  // camelCase in JavaScript
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

``` html
<!-- kebab-case in HTML -->
<blog-post post-title="hello!"></blog-post>
```

Again, if you're using string templates, this limitation does not apply.

## Prop Types

So far, we've only seen props listed as an array of strings:

```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

Usually though, you'll want every prop to be a specific type of value. In these cases, you can list props as an object, where the properties' names and values contain the prop names and types, respectively:

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

This not only documents your component, but will also warn users in the browser's JavaScript console if they pass the wrong type. You'll learn much more about [type checks and other prop validations](#Prop-Validation) further down this page.

## Passing Static or Dynamic Props

So far, you've seen props passed a static value, like in:

```html
<blog-post title="My journey with Vue"></blog-post>
```

You've also seen props assigned dynamically with `v-bind`, such as in:

```html
<!-- Dynamically assign the value of a variable -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- Dynamically assign the value of a complex expression -->
<blog-post
  v-bind:title="post.title + ' by ' + post.author.name"
></blog-post>
```

In the two examples above, we happen to pass string values, but _any_ type of value can actually be passed to a prop.

### Passing a Number

```html
<!-- Even though `42` is static, we need v-bind to tell Vue that -->
<!-- this is a JavaScript expression rather than a string.       -->
<blog-post v-bind:likes="42"></blog-post>

<!-- Dynamically assign to the value of a variable. -->
<blog-post v-bind:likes="post.likes"></blog-post>
```

### Passing a Boolean

```html
<!-- Including the prop with no value will imply `true`. -->
<blog-post is-published></blog-post>

<!-- Even though `false` is static, we need v-bind to tell Vue that -->
<!-- this is a JavaScript expression rather than a string.          -->
<blog-post v-bind:is-published="false"></blog-post>

<!-- Dynamically assign to the value of a variable. -->
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```

### Passing an Array

```html
<!-- Even though the array is static, we need v-bind to tell Vue that -->
<!-- this is a JavaScript expression rather than a string.            -->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- Dynamically assign to the value of a variable. -->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```

### Passing an Object

```html
<!-- Even though the object is static, we need v-bind to tell Vue that -->
<!-- this is a JavaScript expression rather than a string.             -->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- Dynamically assign to the value of a variable. -->
<blog-post v-bind:author="post.author"></blog-post>
```

### Passing the Properties of an Object

If you want to pass all the properties of an object as props, you can use `v-bind` without an argument (`v-bind` instead of `v-bind:prop-name`). For example, given a `post` object:

``` js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

The following template:

``` html
<blog-post v-bind="post"></blog-post>
```

Will be equivalent to:

``` html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

## One-Way Data Flow

All props form a **one-way-down binding** between the child property and the parent one: when the parent property updates, it will flow down to the child, but not the other way around. This prevents child components from accidentally mutating the parent's state, which can make your app's data flow harder to understand.

In addition, every time the parent component is updated, all props in the child component will be refreshed with the latest value. This means you should **not** attempt to mutate a prop inside a child component. If you do, Vue will warn you in the console.

There are usually two cases where it's tempting to mutate a prop:

1. **The prop is used to pass in an initial value; the child component wants to use it as a local data property afterwards.** In this case, it's best to define a local data property that uses the prop as its initial value:

  ``` js
  props: ['initialCounter'],
  data: function () {
    return {
      counter: this.initialCounter
    }
  }
  ```

2. **The prop is passed in as a raw value that needs to be transformed.** In this case, it's best to define a computed property using the prop's value:

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Note that objects and arrays in JavaScript are passed by reference, so if the prop is an array or object, mutating the object or array itself inside the child component **will** affect parent state.</p>

## Prop Validation

Components can specify requirements for their props, such as the types you've already seen. If a requirement isn't met, Vue will warn you in the browser's JavaScript console. This is especially useful when developing a component that's intended to be used by others.

To specify prop validations, you can provide an object with validation requirements to the value of `props`, instead of an array of strings. For example:

``` js
Vue.component('my-component', {
  props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    propA: Number,
    // Multiple possible types
    propB: [String, Number],
    // Required string
    propC: {
      type: String,
      required: true
    },
    // Number with a default value
    propD: {
      type: Number,
      default: 100
    },
    // Object with a default value
    propE: {
      type: Object,
      // Object or array defaults must be returned from
      // a factory function
      default: function () {
        return { message: 'hello' }
      }
    },
    // Custom validator function
    propF: {
      validator: function (value) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].includes(value)
      }
    }
  }
})
```

When prop validation fails, Vue will produce a console warning (if using the development build).

<p class="tip">Note that props are validated **before** a component instance is created, so instance properties (e.g. `data`, `computed`, etc) will not be available inside `default` or `validator` functions.</p>

### Type Checks

The `type` can be one of the following native constructors:

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

In addition, `type` can also be a custom constructor function and the assertion will be made with an `instanceof` check. For example, given the following constructor function exists:

```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

You could use:

```js
Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

to validate that the value of the `author` prop was created with `new Person`.

## Non-Prop Attributes

A non-prop attribute is an attribute that is passed to a component, but does not have a corresponding prop defined.

While explicitly defined props are preferred for passing information to a child component, authors of component libraries can't always foresee the contexts in which their components might be used. That's why components can accept arbitrary attributes, which are added to the component's root element.

For example, imagine we're using a 3rd-party `bootstrap-date-input` component with a Bootstrap plugin that requires a `data-date-picker` attribute on the `input`. We can add this attribute to our component instance:

``` html
<bootstrap-date-input data-date-picker="activated"></bootstrap-date-input>
```

And the `data-date-picker="activated"` attribute will automatically be added to the root element of `bootstrap-date-input`.

### Replacing/Merging with Existing Attributes

Imagine this is the template for `bootstrap-date-input`:

``` html
<input type="date" class="form-control">
```

To specify a theme for our date picker plugin, we might need to add a specific class, like this:

``` html
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>
```

In this case, two different values for `class` are defined:

- `form-control`, which is set by the component in its template
- `date-picker-theme-dark`, which is passed to the component by its parent

For most attributes, the value provided to the component will replace the value set by the component. So for example, passing `type="text"` will replace `type="date"` and probably break it! Fortunately, the `class` and `style` attributes are a little smarter, so both values are merged, making the final value: `form-control date-picker-theme-dark`.

### Disabling Attribute Inheritance

If you do **not** want the root element of a component to inherit attributes, you can set `inheritAttrs: false` in the component's options. For example:

```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```

This can be especially useful in combination with the `$attrs` instance property, which contains the attribute names and values passed to a component, such as:

```js
{
  required: true,
  placeholder: 'Enter your username'
}
```

With `inheritAttrs: false` and `$attrs`, you can manually decide which element you want to forward attributes to, which is often desirable for [base components](../style-guide/#Base-component-names-strongly-recommended):

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

<p class="tip">Note that `inheritAttrs: false` option does **not** affect `style` and `class` bindings.</p>

This pattern allows you to use base components more like raw HTML elements, without having to care about which element is actually at its root:

```html
<base-input
  label="Username:"
  v-model="username"
  required
  placeholder="Enter your username"
></base-input>
```
