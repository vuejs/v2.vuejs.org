title: Getting Started
type: guide
order: 2
---

# {{title}}

## Introduction

Vue.js is a library for building interactive web interfaces.

Technically, Vue.js is focused on the [ViewModel](#ViewModel) layer of the MVVM pattern. It connects the [View](#View) and the [Model](#Model) via two way data bindings. Actual DOM manipulations and output formatting are abstracted away into [Directives](#Directives) and [Filters](#Filters).

Philosophically, the goal is to provide the benefits of MVVM data binding with an API that is as simple as possible. Modularity and composability are also important design considerations. It is not a full-blown framework - it is designed to be simple and flexible. You can use it alone for rapid prototyping, or mix and match with other libraries for a custom front-end stack. It's also a natural fit for no-backend services such as Firebase.

Vue.js' API is heavily influenced by [AngularJS], [KnockoutJS], [Ractive.js] and [Rivets.js]. Despite the similarities, I believe Vue.js offers a valuable alternative to these existing libraries by finding a sweetspot between simplicity and functionality.

If you are confused by some of the terms mentioned above, read on for a brief overview of what they mean. Otherwise, you can jump right to [the quick example](#A_Quick_Example).

## Concepts Overview

### ViewModel

An object that syncs the Model and the View. In Vue.js, ViewModels are instantiated with the `Vue` constructor or its sub-classes:

```js
var vm = new Vue(options)
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

In Vue.js, models are simply plain JavaScript objects, or **data objects**. You can manipulate their properties and ViewModels that are observing them will be notified of the changes. Vue.js converts the properties on data objects into ES5 getter/setters, which allows direct manipulation without the need for dirty checking. For technical details see [Instantiation Options: data](/api/instantiation-options.html#data).

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

In addition, you can use triple mustaches for unescaped HTML, which translate  to `v-html` internally. However, since this can open up window for potential XSS attacks, it is suggested that you only use triple mustaches when you are certain about the security of the data source.

### Filters

Functions that are used to process the raw values before updating the View. They are denoted by a "pipe" inside directives or bindings:

```html
<div>&#123;&#123;message | capitalize&#125;&#125;</div>
```

Now before the div's textContent is updated, the `message` value will first be passed through the `capitalize` function. For more details see [Filters in Depth](/guide/filters.html).

## A Quick Example

``` html
<div id="demo">
    <h1>&#123;&#123;title | uppercase&#125;&#125;</h1>
    <ul>
        <li
            v-repeat="todos"
            v-on="click: done = !done"
            class="&#123;&#123;done ? 'done' : ''&#125;&#125;"
        >
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
                content: 'Learn vue.js'
            }
        ]
    }
})
```

**Result**

<div id="demo"><h1>&#123;&#123;title | uppercase&#125;&#125;</h1><ul><li v-repeat="todos" v-on="click: done = !done" class="&#123;&#123;done ? 'done' : ''&#125;&#125;">&#123;&#123;content&#125;&#125;</li></ul></div>
<script src="/js/vue.min.js"></script>
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
                content: 'Learn vue.js'
            }
        ]
    }
})
</script>

You can click on a todo to toggle it, or you can open your Browser's console and play with the `demo` object - for example, change `demo.title`, push a new object into `demo.todos`, or toggle a todo's `done` state.

You probably have a few questions in mind now - don't worry, we'll cover them soon. Next up: [Directives in Depth](/guide/directives.html).

[AngularJS]: http://angularjs.org
[KnockoutJS]: http://knockoutjs.com
[Ractive.js]: http://ractivejs.org
[Rivets.js]: http://www.rivetsjs.com