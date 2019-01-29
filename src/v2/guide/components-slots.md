---
title: Slots
type: guide
order: 104
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

> In 2.6.0, we introduced a new unified syntax (the `v-slot` directive) for named slots and scoped slots. It replaces the `slot` and `slot-scope` syntax which is still documented [here](#Legacy-Syntax). The rationale for introducing the new syntax is described in this [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md).

## Slot Content

Vue implements a content distribution API inspired by the [Web Components spec draft](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), using the `<slot>` element to serve as distribution outlets for content.

This allows you to compose components like this:

``` html
<navigation-link url="/profile">
  Your Profile
</navigation-link>
```

Then in the template for `<navigation-link>`, you might have:

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

When the component renders, the `<slot>` element will be replaced by "Your Profile". Slots can contain any template code, including HTML:

``` html
<navigation-link url="/profile">
  <!-- Add a Font Awesome icon -->
  <span class="fa fa-user"></span>
  Your Profile
</navigation-link>
```

Or even other components:

``` html
<navigation-link url="/profile">
  <!-- Use a component to add an icon -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Your Profile
</navigation-link>
```

If `<navigation-link>` did **not** contain a `<slot>` element, any content passed to it would simply be discarded.

## Compilation Scope

When you want to use data inside a slot, such as in:

``` html
<navigation-link url="/profile">
  Logged in as {{ user.name }}
</navigation-link>
```

That slot has access to the same instance properties (i.e. the same "scope") as the rest of the template. The slot does **not** have access to `<navigation-link>`'s scope. For example, trying to access `url` would not work. As a rule, remember that:

> Everything in the parent template is compiled in parent scope; everything in the child template is compiled in the child scope.

## Fallback Content

There are cases when it's useful to provide a slot with fallback content, which is rendered when the parent did not provide content for the slot. For example, a `<submit-button>` component might want the content of the button to be "Submit" by default, but also allow users to override with "Save", "Upload", or anything else.

To achieve this, specify the fallback content in between the `<slot>` tags in your component's template:

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

The fallback content "Submit" only gets rendered if the parent did not provide any slot content.

## Named Slots

There are times when it's useful to have multiple slots. For example, in a hypothetical `base-layout` component with the following template:

``` html
<div class="container">
  <header>
    <!-- We want header content here -->
  </header>
  <main>
    <!-- We want main content here -->
  </main>
  <footer>
    <!-- We want footer content here -->
  </footer>
</div>
```

For these cases, the `<slot>` element has a special attribute, `name`, which can be used to define additional slots:

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

A `<slot>` outlet without `name` implicitly has the name "default".

To provide content to named slots, we can use the `v-slot` directive on a `<template>` element in the parent, using the directive argument to indicate which named slot the content is being passed to:

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

Note that unlike the legacy `slot` attribute, `v-slot` must appear on a `<template>` wrapper when being used to denote named slots. The only exception is when used directly on a component tag to denote a [default slot with props](#Default-Slot-with-Props).

### Named Slots Shorthand

Similar to `v-on` and `v-bind`, `v-slot` also has a shorthand, replacing everything before the argument with the special symbol `#`. The above example can also be written as:

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

### Dynamic Slot Names

Dynamic directive arguments also work on `v-slot`:

``` html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- shorthand equivalent -->
  <template #[anotherSlotName]>
    ...
  </template>
</base-layout>
```

## Slot Props

So far we have seen that the slot feature allows a child component to compose content passed from the parent with its own template. However, in some cases the child component may wish to customize the slot content based on its own data, which the parent has no access to. It would be great if the child can pass props to `<slot>` outlets. Imagine we have a `<slot-example>` component with the following template:

``` html
<!-- slot-example -->
<span>
  <slot v-bind:msg="myMessage"></slot>
</span>
```

In order to receive and make use of the props being passed to a slot, the parent component declares the props received using the attribute value of the `v-slot` directive:

``` html
<slot-example>
  <template v-slot:default="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

Here you can name `slotProps` anything you like, just like declaring a function argument in JavaScript. The declared variable will become available inside the scope of the slot's `<template>`.

Slots that expect props are also known as "scoped slots", as they create a "scope" within which the received props can be used.

<p class="tip">The `v-slot` syntax is introduced in 2.6.0 and is not supported in older versions. The legacy `slot` and `slot-scope` syntax is still supported in 2.6, and is documented [here](#Legacy-Syntax).</p>

### Default Slot with Props

When there is only the default slot, the `v-slot` directive can be placed directly on the component itself, and the `default` argument can also be omitted. The above example can thus be simplified to:

``` html
<slot-example v-slot="slotProps">
  {{ slotProps.msg }}
</slot-example>
```

### Slot Props Destructuring

The value of `v-slot` can actually accept any valid JavaScript expression that can appear in the argument position of a function definition. This means in supported environments ([single-file components](single-file-components.html) or [modern browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)) you can also use [ES2015 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) in the expression, like so:

``` html
<slot-example v-slot="{ msg }">
  {{ msg }}
</slot-example>
```

This can make the template much cleaner when the slot expects a lot of props.

Conceptually, the syntax is similar to argument destructuring in JavaScript:

``` js
function CustomText({ text }) {
  return text
}
```

### Todo List Example

**Slot props allow us to turn slots into reusable templates that can render different content based on input props.** This is most useful when you are designing a reusable component that encapsulates data logic while allowing the consuming parent component to customize part of its layout.

For example, we are implementing a `<todo-list>` component that contains the layout and filtering logic for a list:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

Instead of hard-coding how each todo looks like, we can let the parent component take control by making each todo a slot, and passing in the `todo` as a slot prop:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!-- We have a slot for each todo, passing it the -->
    <!-- `todo` object as a slot prop.                -->
    <slot name="todo" v-bind:todo="todo">
      <!-- Fallback content -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

Now when we use the `<todo-list>` component, we can optionally define an alternative `<template>` for todo items, but with access to data from the child:

```html
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

Admitted, the above example is still contrived. A more real-world use case would be a reusable list component that encapsulates the logic of fetching items from an API with infinite scroll, and lets the parent customize how each fetched item should be rendered:

``` html
<infinite-scroll endpoint="/api/posts" :fetch-count="20">
  <template v-slot:item="{ data }">
    <div class="post">
      <h2>{{ data.title }}</h2>
      <p>by {{ data.author }} on {{ data.date }}</p>
      <p>{{ data.content }}</p>
    </div>
  </template>
</infinite-scroll>
```

## Legacy Syntax

The `v-slot` directive was introduced in Vue 2.6.0, replacing the legacy `slot` + `slot-scope` syntax. The rationale for introducing the new syntax is described in this [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md). The legacy syntax is still supported in 2.6 and will continue to be supported in all future 2.x releases, but is marked for deprecation and will eventually be removed in a future major release.

### Named Slots with `slot`

To pass content to named slots from the parent, use the special `slot` attribute on `<template>` (Using the `<base-layout>` component described [here](#Named-Slots) as example):

```html
<base-layout>
  <template slot="header">
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template slot="footer">
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

Or, the `slot` attribute can also be used directly on a normal element:

``` html
<base-layout>
  <h1 slot="header">Here might be a page title</h1>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</base-layout>
```

There can still be one unnamed slot, which is the **default slot** that serves as a catch-all outlet for any unmatched content. In both examples above, the  rendered HTML would be:

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

### Scoped Slots with `slot-scope`

To receive props passed to a slot, the parent component can use `<template>` with the `slot-scope` special attribute (Using the `<slot-example>` described [here](#Slot-Props) as example):

``` html
<slot-example>
  <template slot="default" slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

Here `slot-scope` declares the received props object as the `slotProps` variable, and makes it available inside the `<template>` scope. You can name `slotProps` anything you like similar to naming function arguments in JavaScript.

Here `slot="default"` can be omitted as it is implied:

``` html
<slot-example>
  <template slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

`slot-scope` can also be used directly on a non `<template>` element (including components):

``` html
<slot-example>
  <span slot-scope="slotProps">
    {{ slotProps.msg }}
  </span>
</slot-example>
```

The value of `slot-scope` can accept any valid JavaScript expression that can appear in the argument position of a function definition. This means in supported environments ([single-file components](single-file-components.html) or [modern browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)) you can also use [ES2015 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) in the expression, like so:

``` html
<slot-example>
  <span slot-scope="{ msg }">
    {{ msg }}
  </span>
</slot-example>
```

Using the `<todo-list>` described [here](#Todo-List-Example) as example, here's the equivalent usage using `slot-scope`:

```html
<todo-list v-bind:todos="todos">
  <template slot="todo" slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```
