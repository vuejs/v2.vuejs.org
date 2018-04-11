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

## 编译时的作用域(compilation scope)

当你在 slot 内部想要使用当前作用域下的数据，例如：

``` html
<navigation-link url="/profile">
  Logged in as {{ user.name }}
</navigation-link>
```

这些插槽内容，可以访问与插槽模板之外其余部分模板，完全相同的实例属性（也就是处于同一“作用域”）。然而插槽内容**无法**访问 `<navigation-link>` 组件内部的作用域。例如，试图访问传入此组件内部的 `url`，就会无法正常运行。牢记准则：

> 父组件模板的内容，全部在父组件作用域内编译；子组件模板的内容，全部在子组件作用域内编译。

## 作用域插槽(scoped slots)

> 2.1.0+ 新增

在某些场景中，需要提供一个具有「可以访问组件内部数据的可复用插槽(reusable slot)」的组件。例如，一个简单的 `<todo-list>` 组件，可能包含如下模板：

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

但是在我们应用程序的某些部分中，我们想要将 todo items 中的每一项，都渲染为不同于 `todo.text` 的内容。这就是引入作用域插槽的原因。

为了实现此潜在功能，我们必须将 todo item 的内容，包裹到一个 `<slot>` 元素中，然后，将此 slot 内部所需的所有相关数据，都传递给它的上下文环境(context)：在当前这个场景中，其相关数据为 `todo` 对象：

```html
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    <!-- 我们为每个 todo 提供一个 slot 元素， -->
    <!-- 然后，将 `todo` 对象作为 slot 元素的一个 prop 传入。 -->
    <slot v-bind:todo="todo">
      <!-- 这里是回退内容(fallback content) -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

现在，在我们引用 `<todo-list>` 组件的位置，我们可以将 todo items 插槽内容稍作修改，定义为一个 `<template>`，并且通过 `slot-scope` 特性访问子组件数据：

```html
<todo-list v-bind:todos="todos">
  <!-- 将 `slotProps` 作为插槽内容所在作用域(slot scope)的引用名称 -->
  <template slot-scope="slotProps">
    <!-- 为 todo items 定义一个模板， -->
    <!-- 通过 `slotProps` 访问每个 todo 对象。 -->
    <span v-if="slotProps.todo.isComplete">✓</span>
    {{ slotProps.todo.text }}
  </template>
</todo-list>
```

> 在 2.5.0+，`slot-scope` 不再局限于 `<template>` 元素，而是可以在任何元素或任何组件中的插槽内容上使用。

### 解构 `slot-scope`

`slot-scope` 的值，实际上可以接收任何有效的 JavaScript 表达式，可以出现在函数定义中的参数所在位置。也就是说，在支持的环境中（在 [单个文件组件](single-file-components.html) 或在 [现代浏览器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)），可以使用 [ES2015 解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) 来对表达式进行解构，就像这样：

```html
<todo-list v-bind:todos="todos">
  <template slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

这是让作用域插槽用法，变得思路清晰的好方法。

***

> 原文：http://vuejs.org/v2/guide/components-slots.html

***
