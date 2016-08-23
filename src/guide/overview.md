---
title: Overview
type: guide
order: 2
---

Vue (pronounced /vjuː/, like **view**) is a library for building interactive web interfaces. The goal is to provide the benefits of **reactive data binding** and **composable view components** with an API that is as simple as possible.

Vue itself is not a full-blown framework - it is focused on the view layer only. It is therefore [very easy](index.html) to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications, when used in combination with [modern tooling](application.html) and [supporting libraries](https://github.com/vuejs/awesome-vue#libraries--plugins).

If you are an experienced frontend developer and want to know how Vue compares to other libraries/frameworks, check out the [Comparison with Other Frameworks](comparison.html).

## Reactive Data Binding

At the core of Vue is a reactive data-binding system that makes it extremely simple to keep your data and the DOM in sync. When using jQuery to manually manipulate the DOM, the code we write is often imperative, repetitive, and error-prone. Vue embraces the concept of a **data-driven view**. We use special syntax in our normal HTML templates to "bind" the DOM to the underlying data. Once the bindings are created, the DOM will then be kept in sync with the data. Whenever you modify the data, the DOM updates accordingly. As a result, most of our application logic is now directly manipulating data, rather than messing around with DOM updates. This makes our code much easier to write and maintain.

![MVVM](/images/mvvm.png)

For the simplest possible example:

``` html
<!-- this is our View -->
<div id="example-1">
  Hello {{ name }}!
</div>
```
``` js
// this is our Model
var exampleData = {
  name: 'Vue.js'
}

// create a Vue instance, or, a "ViewModel"
// which links the View and the Model
var exampleVM = new Vue({
  el: '#example-1',
  data: exampleData
})
```

Result:
{% raw %}
<div id="example-1" class="demo">Hello {{ name }}!</div>
<script>
var exampleData = {
  name: 'Vue.js'
}
var exampleVM = new Vue({
  el: '#example-1',
  data: exampleData
})
</script>
{% endraw %}

This looks pretty similar to just rendering a template, but Vue has done a lot of work under the hood. The data and the DOM are now linked, and everything is now **reactive**. How do we know? Just open up your browser's JavaScript console and modify `exampleData.name`. You should see the rendered example above update accordingly.

Note that we didn't have to write any DOM-manipulating code. Our view is entirely data-driven: the HTML template, enhanced with bindings, is a declarative mapping of the underlying state of our data - and that data is just a plain JavaScript object.

Let's look at a second example:

``` html
<div id="example-2">
  <p v-if="greeting">Hello!</p>
</div>
```

``` js
var exampleVM2 = new Vue({
  el: '#example-2',
  data: {
    greeting: true
  }
})
```

{% raw %}
<div id="example-2" class="demo">
  <span v-if="greeting">Hello!</span>
</div>
<script>
var exampleVM2 = new Vue({
  el: '#example-2',
  data: {
    greeting: true
  }
})
</script>
{% endraw %}

Here we are encountering something new. The `v-if` attribute you are seeing is called a **directive**. Directives are prefixed with `v-` to indicate that they are special attributes provided by Vue, and as you may have guessed, they apply special reactive behavior to the rendered DOM. Go ahead and set `exampleVM2.greeting` to `false` in the console. You should see the "Hello!" message disappear.

This second example demonstrates that we can not only bind DOM text to the data, but we can also bind the **structure** of the DOM to the data. Moreover, Vue also provides a powerful transition effect system that can automatically apply [transition effects](transitions.html) when elements are inserted/updated/removed by Vue.

There are quite a few other directives, each with its own special functionality. For example, the [`v-for` directive](/api/#v-for) for displaying items in an Array, or the [`v-bind` directive](/api/#v-bind) for binding HTML attributes. We will discuss the full [data-binding syntax](syntax.html) with more details later.

## Component System

The component system is another important concept in Vue, because it's an abstraction that allows us to build large-scale applications composed of small, self-contained, and often reusable components. If we think about it, almost any type of application interface can be abstracted into a tree of components:

![Component Tree](/images/components.png)

In fact, a typical large application built with Vue would form exactly what is on the right - a tree of components. We will talk a lot more about components later in the guide, but here's an (imaginary) example of what an app's template might look like with components:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

You may have noticed that Vue components are very similar to **Custom Elements**, which are part of the [Web Components Spec](http://www.w3.org/wiki/WebComponents/). That's because Vue's component syntax is loosely modeled after the spec. For example, Vue components implement the [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) and the `is` special attribute. However, there are a few key differences:

1. The Web Components Spec is still very much a work in progress, and is not natively implemented in every browser. In comparison, Vue components don't require any polyfills and work consistently in all supported browsers (IE9 and above). When needed, Vue components can also be wrapped inside a native custom element.

2. Vue components provide important features that are not available in plain custom elements, most notably cross-component data flow, custom event communication, and dynamic component switching with transition effects.

The component system is the foundation for building large apps with Vue. The Vue ecosystem also provides advanced tooling and officially supported companion libraries that can be combined to create a more framework-like system. The responsibilities of these libraries include [routing](https://github.com/vuejs/vue-router), [flux-like state management](https://github.com/vuejs/vuex), and [more](https://github.com/vuejs).
