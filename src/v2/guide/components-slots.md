---
title: Slots
type: guide
order: 104
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

## Slot Content

Vue implements a content distribution API that's modeled after the current [Web Components spec draft](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), using the `<slot>` element to serve as distribution outlets for content.

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

To provide content to named slots, we can use the `slot` attribute on a `<template>` element in the parent:

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

## Default Slot Content

There are cases when it's useful to provide a slot with default content. For example, a `<submit-button>` component might want the content of the button to be "Submit" by default, but also allow users to override with "Save", "Upload", or anything else.

To achieve this, specify the default content in between the `<slot>` tags.

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

If the slot is provided content by the parent, it will replace the default content.

## Compilation Scope

When you want to use data inside a slot, such as in:

``` html
<navigation-link url="/profile">
  Logged in as {{ user.name }}
</navigation-link>
```

That slot has access to the same instance properties (i.e. the same "scope") as the rest of the template. The slot does **not** have access to `<navigation-link>`'s scope. For example, trying to access `url` would not work. As a rule, remember that:

> Everything in the parent template is compiled in parent scope; everything in the child template is compiled in the child scope.

## Scoped Slots

> New in 2.1.0+

Sometimes you'll want to provide a component with a reusable slot that can access data from the child component. For example, a simple `<todo-list>` component may contain the following in its template:

```html
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

But in some parts of our app, we want the individual todo items to render something different than just the `todo.text`. This is where scoped slots come in.

To make the feature possible, all we have to do is wrap the todo item content in a `<slot>` element, then pass the slot any data relevant to its context: in this case, the `todo` object:

```html
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    <!-- We have a slot for each todo, passing it the -->
    <!-- `todo` object as a slot prop.                -->
    <slot v-bind:todo="todo">
      <!-- Fallback content -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

Now when we use the `<todo-list>` component, we can optionally define an alternative `<template>` for todo items, but with access to data from the child via the `slot-scope` attribute:

```html
<todo-list v-bind:todos="todos">
  <!-- Define `slotProps` as the name of our slot scope -->
  <template slot-scope="slotProps">
    <!-- Define a custom template for todo items, using -->
    <!-- `slotProps` to customize each todo.            -->
    <span v-if="slotProps.todo.isComplete">✓</span>
    {{ slotProps.todo.text }}
  </template>
</todo-list>
```

> In 2.5.0+, `slot-scope` is no longer limited to the `<template>` element, but can instead be used on any element or component in the slot.

### Destructuring `slot-scope`

The value of `slot-scope` can actually accept any valid JavaScript expression that can appear in the argument position of a function definition. This means in supported environments ([single-file components](single-file-components.html) or [modern browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)) you can also use [ES2015 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) in the expression, like so:

```html
<todo-list v-bind:todos="todos">
  <template slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

This is a great way to make scoped slots a little cleaner.
