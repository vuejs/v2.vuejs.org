title: Getting Started
type: guide
order: 2
---

# {{title}}

## Introduction

Vue.js is a library that aims to simplify the development of interactive interfaces.

Technically, it provides the [ViewModel](#ViewModel) layer of the MVVM pattern, which connects the [View](#View) and the [Model](#Model) via two way data bindings.

Philosophically, the primary goal is to allow the developer to embrace an extremely simple mental model when dealing with interfaces - there's only one type of object you need to worry about: the ViewModel. It is where all the view logic happens, and manipulating the ViewModel will automatically keep the View and the Model in sync. You can roughly think of them as composable components. Actuall DOM manipulations and output formatting are abstracted away into [Directives](#Directives) and [Filters](#Filters).

API-wise vue.js is heavily influenced by [AngularJS], [Ractive.js] and [Rivets.js]. If you have used any of these before, you will find vue.js very easy to pick up. If you are unfamiliar with some of the terms mentioned above, read on for a brief overview of what they mean. Otherwise, you can jump right to [the quick example](#A_Quick_Example).

## Concepts Overview

### ViewModel

An object that syncs the Model and the View. In vue.js, ViewModels are instantiated with the `Vue` constructor or its sub-classes:

```js
var vm = new Vue(options)
```

This is the primary object that you will be interacting with as a developer when using vue.js. See [Class: Vue](/api/) for more details.

### View

The actual HTML/DOM that the user sees.

```js
vm.$el // The View
```

When using vue.js, you rarely have to touch the View yourself except in custom directives (explained later). View updates will be automatically triggered when the data changes.

### Model

A slightly modified plain JavaScript object.

```js
vm.$data // The Model
```

In vue.js, models are simply plain JavaScript objects, or **data objects**. You can manipulate their properties and ViewModels that are observing them will be notified of the changes. For technical details see [Instantiation Options: data](/api/instantiation-options.html#data).

### Directives

Prefixed HTML attributes that tell vue.js to do something about a DOM node.

```html
<div v-text="message"></div>
```

Here the div element has a `v-text` directive with the value `message`. What it does is telling vue.js to keep the div's textContent in sync with the ViewModel's `message` property.

You can also use mustache-style bindings:

```html
<div id="person-&#123;&#123;id&#125;&#125;">Hello &#123;&#123;name&#125;&#125;!</div>
```

Directives can encapsulate arbitrary DOM manipulations. Check out the full list of [built-in directives](/api/directives.html#List_of_Built-in_Directives). You can also [write your custom directives](/guide/directives.html#Writing_a_Custom_Directive).

### Filters

Functions that are used to process the raw values before updating the View. They are denoted by a "pipe" inside directives or bindings:

```html
<div>&#123;&#123;message | capitalize&#125;&#125;</div>
```

Now before the div's textContent is updated, the `message` value will first be passed through the `capitalize` function. You can chain multiple filters together. Check out the full list of [built-in filters](/api/filters.html) and how to [write custom filters](/guide/filters.html#Writing_a_Custom_Filter).

## A Quick Example

**HTML**

``` html
<div id="demo">
    <p v-text="hello"></p>
</div>
```

**JavaScript**

``` js
var demo = new Vue({
    el: '#demo',
    data: {
        hello: 'Hello World!',
    }
})
```

## Computed Properties

## Repeated Items

## Registering Handlers

## Using Templates / Partials

[AngularJS]: http://angularjs.org
[Ractive.js]: http://ractivejs.org
[Rivets.js]: http://www.rivetsjs.com