title: Getting Started
type: guide
order: 2
---

## Introduction

Vue.js is a library for building interactive web interfaces.

Technically, Vue.js is focused on the [ViewModel](#ViewModel) layer of the MVVM pattern. It connects the [View](#View) and the [Model](#Model) via two way data bindings. Actual DOM manipulations and output formatting are abstracted away into [Directives](#Directives) and [Filters](#Filters).

Philosophically, the goal is to provide the benefits of MVVM data binding with an API that is as simple as possible. Modularity and composability are also important design considerations. It is not a full-blown framework - it is designed to be simple and flexible. You can use it alone for rapid prototyping, or mix and match with other libraries for a custom front-end stack. It's also a natural fit for no-backend services such as Firebase.

Vue.js' API is heavily influenced by [AngularJS], [KnockoutJS], [Ractive.js] and [Rivets.js]. Despite the similarities, I believe Vue.js offers a valuable alternative to these existing libraries by finding a sweetspot between simplicity and functionality.

Even if you are already familiar with some of these terms, it is recommended that you go through the following concepts overview because your notion of these terms might be different from what they mean in the Vue.js context.

## Concepts Overview

### ViewModel

An object that syncs the Model and the View. In Vue.js, ViewModels are instantiated with the `Vue` constructor or its sub-classes:

```js
var vm = new Vue({ /* options */ })
```

This is the primary object that you will be interacting with as a developer when using Vue.js. For more details see [Class: Vue](/api/).

### View

The actual HTML/DOM that the user sees.

```js
vm.$el // The View
```

When using Vue.js, you rarely have to touch the DOM yourself except in custom directives (explained later). View updates will be automatically triggered when the data changes. These view updates are highly granular with the precision down to a textNode. They are also batched and executed asynchronously for greater performance.

### Model

A slightly modified plain JavaScript object.

```js
vm.$data // The Model
```

In Vue.js, models are simply plain JavaScript objects, or **data objects**. You can manipulate their properties and ViewModels that are observing them will be notified of the changes. Vue.js converts the properties on data objects into ES5 getter/setters, which allows direct manipulation without the need for dirty checking.

The data objects are mutated in place, so modifying it by reference has the same effects as modifying `vm.$data`. This also makes it easy for multiple ViewModel instances to observe the same piece of data.

For technical details see [Instantiation Options: data](/api/instantiation-options.html#data).

### Directives

Prefixed HTML attributes that tell Vue.js to do something about a DOM element.

```html
<div v-text="message"></div>
```

Here the div element has a `v-text` directive with the value `message`. What it does is telling Vue.js to keep the div's textContent in sync with the ViewModel's `message` property.

Directives can encapsulate arbitrary DOM manipulations. For example `v-attr` manipulates an element's attributes, `v-repeat` clones an element based on an Array, `v-on` attaches event listeners... we will cover them later.

### Mustache Bindings

You can also use mustache-style bindings, both in text and in attributes. They are translated into `v-text` and `v-attr` directives under the hood. For example:

```html
<div id="person-&#123;&#123;id&#125;&#125;">Hello &#123;&#123;name&#125;&#125;!</div>
```

Although it is convenient, there are a few things you need to be aware of:

<p class="tip">The `src` attribute on an `<image>` element makes an HTTP requests when a value is set, so when the template is first parsed it will result in a 404. In this case `v-attr` is preferred.</p>

<p class="tip">Internet Explorer will remove invalid inline `style` attributes when parsing HTML, so always use `v-style` when binding inline CSS if you want to support IE.</p>

<p class="tip">You can use triple mustaches &#123;&#123;&#123; like this &#125;&#125;&#125; for unescaped HTML, which translates to `v-html` internally. However, this can open up windows for potential XSS attacks, therefore it is suggested that you only use triple mustaches when you are absolutely sure about the security of the data source, or pipe it through a custom filter that sanitizes untrusted HTML.</p>

### Filters

Functions that are used to process the raw values before updating the View. They are denoted by a "pipe" inside directives or bindings:

```html
<div>&#123;&#123;message | capitalize&#125;&#125;</div>
```

Now before the div's textContent is updated, the `message` value will first be passed through the `capitalize` function. For more details see [Filters in Depth](/guide/filters.html).

### Components

In Vue.js, a component is simply a ViewModel constructor registered with an ID using `Vue.component(ID, constructor)`. By having an associated ID, they can be nested in other ViewModels' templates with the `v-component` directive. This simple mechanism enables declarative reuse and composition of ViewModels in a fashion similar to [Web Components](http://www.w3.org/TR/components-intro/), without the need for latest browsers or heavy polyfills. By breaking an application into smaller components, the result is a highly decoupled and maintainable codebase. For more details, see [Composing ViewModels](/guide/composition.html).

## A Quick Example

``` html
<div id="demo">
    <h1>&#123;&#123;title | uppercase&#125;&#125;</h1>
    <ul>
        <li
            v-repeat="todos"
            v-on="click: done = !done"
            class="&#123;&#123;done ? 'done' : ''&#125;&#125;">
            &#123;&#123;content&#125;&#125;
        </li>
    </ul>
</div>
```

``` js
var demo = new Vue({
    el: '#demo',
    data: {
        title: 'todos',
        todos: [
            {
                done: true,
                content: 'Learn JavaScript'
            },
            {
                done: false,
                content: 'Learn Vue.js'
            }
        ]
    }
})
```

**Result**

<div id="demo"><h1>&#123;&#123;title | uppercase&#125;&#125;</h1><ul><li v-repeat="todos" v-on="click: done = !done" class="&#123;&#123;done ? 'done' : ''&#125;&#125;">&#123;&#123;content&#125;&#125;</li></ul></div>
<script>
var demo = new Vue({
    el: '#demo',
    data: {
        title: 'todos',
        todos: [
            {
                done: true,
                content: 'Learn JavaScript'
            },
            {
                done: false,
                content: 'Learn Vue.js'
            }
        ]
    }
})
</script>

Also available on [jsfiddle](http://jsfiddle.net/yyx990803/yMv7y/).

You can click on a todo to toggle it, or you can open your Browser's console and play with the `demo` object - for example, change `demo.title`, push a new object into `demo.todos`, or toggle a todo's `done` state.

You probably have a few questions in mind now - don't worry, we'll cover them soon. Next up: [Directives in Depth](/guide/directives.html).

[AngularJS]: http://angularjs.org
[KnockoutJS]: http://knockoutjs.com
[Ractive.js]: http://ractivejs.org
[Rivets.js]: http://www.rivetsjs.com