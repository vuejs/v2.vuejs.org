---
title: Avoiding Memory Leaks
type: cookbook
order: 10
---

## Introduction

If you are developing applications with Vue, then you need to watch out for memory leaks. This issue is especially important in Single Page Applications (SPAs) because by design, users should not have to refresh their browser when using an SPA, so it is up to the JavaScript application to clean up components and make sure that garbage collection takes place as expected.

Memory leaks in Vue applications do not typically come from Vue itself, rather they can happen when incorporating other libraries into an application.

## Simple Example

The following example shows a memory leak caused by using the [Choices.js](https://github.com/jshjohnson/Choices) library in a Vue component and not properly cleaning it up. Later, we will show how to remove the Choices.js footprint and avoid the memory leak.

In the example below, we load up a select with a lot of options and then we use a show/hide button with a [v-if](/v2/guide/conditional.html) directive to add it and remove it from the virtual DOM. The problem with this example is that the `v-if` directive removes the parent element from the DOM, but we did not clean up the additional DOM pieces created by Choices.js, causing a memory leak.

```html
<link rel='stylesheet prefetch' href='https://joshuajohnson.co.uk/Choices/assets/styles/css/choices.min.css?version=3.0.3'>
<script src='https://joshuajohnson.co.uk/Choices/assets/scripts/dist/choices.min.js?version=3.0.3'></script>

<div id="app">
  <button
    v-if="showChoices"
    @click="hide"
  >Hide</button>
  <button
    v-if="!showChoices"
    @click="show"
  >Show</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>
```

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      // lets load up our select with many choices
      // so it will use a lot of memory
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      this.showChoices = false
    }
  }
})
```

To see this memory leak in action, open this [CodePen example](https://codepen.io/freeman-g/pen/qobpxo) using Chrome and then open the Chrome Task Manager. To open the Chrome Task Manager on Mac, choose Chrome Top Navigation > Window > Task Manager or on Windows, use the Shift+Esc shortcut. Now, click the show/hide button 50 or so times. You should see the memory usage in the Chrome Task Manager increase and never be reclaimed.

![Memory Leak Example](/images/memory-leak-example.png)

## Resolving the Memory Leak

In the above example, we can use our `hide()` method to do some clean up and solve the memory leak prior to removing the select from the DOM. To accomplish this, we will keep a property in our Vue instance’s data object and we will use the [Choices API’s](https://github.com/jshjohnson/Choices) `destroy()` method to perform the clean up.

Check the memory usage again with this [updated CodePen example](https://codepen.io/freeman-g/pen/mxWMor).

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true,
      choicesSelect: null
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      // Set a reference to our choicesSelect in our Vue instance's data object
      this.choicesSelect = new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      // now we can use the reference to Choices to perform clean up here
      // prior to removing the elements from the DOM
      this.choicesSelect.destroy()
      this.showChoices = false
    }
  }
})
```

## Details about the Value

Memory management and performance testing can easily be neglected in the excitement of shipping quickly, however, keeping a small memory footprint is still important to your overall user experience.

Consider the types of devices your users may be using and what their normal flow will be. Could they use memory constrained laptops or mobile devices? Do your users typically do lots of in-application navigation? If either of these are true, then good memory management practices can help you avoid the worst case scenario of crashing a user’s browser. Even if neither of these are true, you can still potentially have degradation of performance over extended usage of your app if you are not careful.

## Real-World Example

In the above example, we used a `v-if` directive to illustrate the memory leak, but a more common real-world scenario happens when using [vue-router](https://router.vuejs.org/en/) to route to components in a Single Page Application.

Just like the `v-if` directive, `vue-router` removes elements from the virtual DOM and replaces those with new elements when a user navigates around your application. The Vue `beforeDestroy()` [lifecycle hook](/v2/guide/instance.html#Lifecycle-Diagram) is a good place to solve the same sort of issue in a `vue-router` based application.

We could move our clean up into the `beforeDestroy()` hook like this:

```js
beforeDestroy: function () {
    this.choicesSelect.destroy()
}
```

## Alternative Patterns

We have discussed managing memory when removing elements, but what if you intentionally want to preserve state and keep elements in memory? In this case, you can use the built-in component [keep-alive](/v2/api/#keep-alive).

When you wrap a component with `keep-alive`, its state will be preserved and therefore kept in memory.

```html
<button @click="show = false">Hide</button>
<keep-alive>
  <!-- my-component will be intentionally kept in memory even when removed -->
  <my-component v-if="show"></my-component>
</keep-alive>
```
This technique can be useful to improve user experience. For example, imagine a user starts entering comments into a text input and then decides to navigate away. If the user then navigated back, their comments would still be preserved.

Once you use keep-alive, then you have access to two more lifecycle hooks: `activated` and `deactivated`. If you do want to clean up or change data when a keep-alive component is removed, you can do so in the `deactivated` hook.

```js
deactivated: function () {
  // remove any data you do not want to keep alive
}
```

## Wrapping Up

Vue makes it very easy to develop amazing, reactive JavaScript applications, but you still need to be careful about memory leaks. These leaks will often occur when using additional 3rd Party libraries that manipulate the DOM outside of Vue. Make sure to test your application for memory leaks and take appropriate steps to clean up components where necessary.