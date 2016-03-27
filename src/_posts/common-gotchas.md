---
title: Common Beginner Gotchas
date: 2016-02-06 10:00:00
---

There are few types of questions that we frequently see from users who are new to Vue.js. Although they are all mentioned somewhere in the guide, they are easy to miss and can be hard to find when you do get bitten by the gotchas. Therefore we are aggregating them in this post and hopefully it can save you some time!

<!-- more -->

### Why isn't the DOM updating?

Most of the time, when you change a Vue instance's data, the view updates. But there are two edge cases:

1. When you are **adding a new property** that wasn't present when the data was observed. Due to the limitation of ES5 and to ensure consistent behavior across browsers, Vue.js cannot detect property addition/deletions. The best practice is to always declare properties that need to be reactive upfront. In cases where you absolutely need to add or delete properties at runtime, use the global [`Vue.set`](/api/#Vue-set) or [`Vue.delete`](/api/#Vue-delete) methods.

2. When you modify an Array by directly setting an index (e.g. `arr[0] = val`) or modifying its `length` property. Similarly, Vue.js cannot pickup these changes. Always modify arrays by using an Array instance method, or replacing it entirely. Vue provides a convenience method `arr.$set(index, value)` which is just syntax sugar for `arr.splice(index, 1, value)`.

Further reading: [Reactivity in Depth](/guide/reactivity.html) and [Array Change Detection](http://vuejs.org/guide/list.html#Array-Change-Detection).

### When is the DOM updated?

Vue.js uses an asynchronous queue to batch DOM updates. This means when you modify some data, the DOM updates do not happen instantly: they are applied asynchronously when the queue is flushed. So how do you know when the DOM has been updated? Use `Vue.nextTick` right after you modify the data. The callback function you pass to it will be called once the queue has been flushed.

Further reading: [Async Update Queue](/guide/reactivity.html#Async-Update-Queue).

### Why does `data` need to be a function?

In the basic examples, we declare the `data` directly as a plain object. This is because we are creating only a single instance with `new Vue()`. However, when defining a **component**, `data` must be declared as a function that returns the initial data object. Why? Because there will be many instances created using the same definition. If we still use a plain object for `data`, that same object will be **shared by reference** across all instance created! By providing a `data` function, every time a new instance is created, we can simply call it to return a fresh copy of the initial data.

Further reading: [Component Option Caveats](/guide/components.html#Component-Option-Caveats).

### HTML case insensitivity

All Vue.js templates are valid, parsable HTML markup, and Vue.js relies on spec-compliant parsers to process its templates. However, as specified in the standard, HTML is case-insensitive when matching tag and attribute names. This means camelCase attributes like `:myProp="123"` will be matched as `:myprop="123"`. As a rule of thumb, you should use camelCase in JavaScript and kebab-case in templates. For example a prop defined in JavaScript as `myProp` should be bound in templates as `:my-prop`.

Further reading: [camelCase vs. kebab-case](http://vuejs.org/guide/components.html#camelCase-vs-kebab-case).

We are also discussing the possibility of eliminating this inconsistency by resolving props and components in a case-insensitive manner. Join the conversation [here](https://github.com/vuejs/vue/issues/2308).
