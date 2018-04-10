---
title: slot
type: guide
order: 104
---

> 本页面会假定你已经阅读过 [组件基础](components.html)。如果你还不熟悉组件，请先阅读组件基础后再阅读本页面。

## 插槽内容(slot content)

Vue 基于现有 [Web Components 规范草案](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，实现一个 内容分发(content distribution) API 模型，使用 `<slot>` 元素，作为内容分发的位置。

内容分发机制，可以帮助你以如下方式构成组件：

``` html
<navigation-link url="/profile">
  Your Profile
</navigation-link>
```

然后，在 `<navigation-link>` 模板中，可能是：

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

在组件渲染时，`<slot>` 元素就会被替换为 "Your Profile"。在 slot 位置，可以包含任何模板代码，也包括 HTML：

``` html
<navigation-link url="/profile">
  <!-- 添加一个 Font Awesome 图标 -->
  <span class="fa fa-user"></span>
  Your Profile
</navigation-link>
```

甚至，slot 位置也能包含其他组件：

``` html
<navigation-link url="/profile">
  <!-- 使用一个组件添加一个图标 -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Your Profile
</navigation-link>
```

如果 `<navigation-link>` **完全没有** `<slot>` 元素，则 slot 位置传递的所有内容都会被直接丢弃。

## 命名插槽(named slot)

在某些场景中，需要用到多个插槽。例如，在一个假想的 `base-layout` 组件中，需要传入以下模板：

``` html
<div class="container">
  <header>
    <!-- 在这里我们需要 header 内容 -->
  </header>
  <main>
    <!-- 在这里我们需要 main 内容 -->
  </main>
  <footer>
    <!-- 在这里我们需要 footer 内容 -->
  </footer>
</div>
```

对于这种场景，`<slot>` 元素有一个特殊的 `name` 特性，可以用于定义除默认插槽以外的多余插槽：

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

为了给命名插槽提供内容，我们可以在父组件模板的 `<template>` 元素上使用 `slot` 特性（译注：这样可以将父组件模板中 slot 位置，和子组件 slot 元素产生关联，便于插槽内容对应传递）：

```html
<base-layout>
  <template slot="header">
    <h1>这里是一个页面标题</h1>
  </template>

  <p>main 内容的一个段落。</p>
  <p>main 内容的另一个段落。</p>

  <template slot="footer">
    <p>这里是一些联系信息</p>
  </template>
</base-layout>
```

或者，也可以对某个普通元素，直接使用 `slot` 特性：

``` html
<base-layout>
  <h1 slot="header">这里是一个页面标题</h1>

  <p>main 内容的一个段落。</p>
  <p>main 内容的另一个段落。</p>

  <p slot="footer">这里是一些联系信息</p>
</base-layout>
```

还有一个未命名插槽(unnamed slot)，这是**默认插槽**，它是用于放置所有不匹配内容的插槽位置。在以上这两个示例中，最终渲染的 HTML 是：

``` html
<div class="container">
  <header>
    <h1>这里是一个页面标题</h1>
  </header>
  <main>
    <p>main 内容的一个段落。</p>
    <p>main 内容的另一个段落。</p>
  </main>
  <footer>
    <p>这里是一些联系信息</p>
  </footer>
</div>
```

## 默认插槽内容(default slot content)

在某些场景中，需要插槽预先提供默认内容。例如，一个 `<submit-button>` 组件，可能想要将按钮文本内容，默认地设置为 "Submit"，然而也允许用户传入 "Save", "Upload" 或其他文本，来覆盖默认文本。

为了实现这个效果，我们可以在 `<slot>` 元素内部指定一个默认内容。

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

如果父组件模板中，向 slot 位置提供了内容，子组件 slot 元素的默认内容就会被替换。

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

***

> 原文：http://vuejs.org/v2/guide/components-slots.html

***
