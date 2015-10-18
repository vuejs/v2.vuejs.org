---
title: Vue.js 0.12 released!
date: 2015-06-11 17:37:30
---

I'm really excited to announce that [Vue.js 0.12: Dragon Ball](https://github.com/yyx990803/vue/releases/tag/0.12.0) is finally here! Thanks to everyone who tried out the beta/rc versions and provided feedback / bug reports along the way.

There's a lot to cover in this release, and we will talk about a few highlights below. However, it is still recommended to carefully go through the [Full Release Note](https://github.com/yyx990803/vue/releases/tag/0.12.0) and updated docs if you are upgrading from 0.11. You can report bugs on GitHub, send questions to [vuejs/Discussion](https://github.com/vuejs/Discussion/issues), or join us in the [Gitter chat channel](https://gitter.im/yyx990803/vue).

<!-- more -->

### More Consistent Component Syntax

Previously in 0.11 you have two ways to use a Vue.js component: using the `v-component` directive, or using custom elements. There are also two ways to pass data down to child components: using the `v-with` directive, or using the `paramAttributes` option. Although both custom elements and param attributes get compiled down to directives eventually, it is confusing and redundant to have two sets of syntax for the same functionality.

In addition, it should be noted that the component system is a first-class concept in Vue.js, even more important than directives. It defines how we encapsulate our higher-level view logic and compose our application. In the meanwhile, having a clear and declarative way to pass data into child components is also very important. Components and param attributes really deserve their own dedicated syntax to differentiate from other directives.

As a result, `v-component` and `v-with` have been deprecated in 0.12. `paramAttributes` has also been renamed to `props`, which is shorter and cleaner. From now on, most Vue.js components will look like this:

``` html
<my-component prop="{{parentData}}"></my-component>
```

There are also additional props-related improvements such as explicit one-time or one-way props, expression as props, methods as prop callbacks and more. You can find out more details in the 0.12 release notes linked above and the updated [Component System](/guide/components.html) section of the guide.

### Filter Arguments Improvements

In 0.11, filters always receive their arguments as plain strings. An argument can be enclosed in quotes to include whitespace, but the quotes are not automatically stripped when passed into the filter function. Some users were also confused about how to retrive a dynamic value on the vm instead of a plain string.

In 0.12, the filter argument syntax now follows a simple rule: if an argument is enclosed in quotes, it will be passed in as a plain string; otherwise, it will be evaluated against the current vm as a dynamic value.

This means the usage of some existing filters will have to change:

``` html
<a v-on="keyup: onKeyUp | key 'enter'"></a>
{{ items.length | pluralize 'item' }}
```

But it would make custom filters that rely on dynamic values much easier to write:

``` html
{{ msg | concat otherMsg }}
```

Here the first argument to the `concat` filter will be the value of `this.otherMsg`.

### Asynchronous Components

It is common practice to bundle all the JavaScript into one file when building large single page applications. But when the file becomes too large, we may want to defer loading parts of our application for a faster initial load. However, this does pose some constraints on how the application architecture should be designed. It could be very tricky to figure out how to properly split up your JavaScript bundles.

Well, with Vue.js we can already build our applications as decoupled components. If we can lazily load a dynamic component only when it is needed, wouldn't it be awesome? As a matter of fact, in 0.12 this would be trivially easy with the new Asynchronous Component feature.

In 0.12, you can define a component as a factory function that asynchronously resolves a component definition (can be just a plain options object). Vue.js will only trigger the factory function when the component actually needs to be rendered, and will cache the result for future re-renders:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

It is up to you to decide how to load the component from the server, e.g. `$.getScript()` or require.js; but the recommended usage is to pair it up with Webpack's [Code Splitting feature](http://webpack.github.io/docs/code-splitting.html):

``` js
Vue.component('async-webpack-example', function (resolve, reject) {
  // In Webpack AMD like syntax indicates a code split point
  require(['./my-async-component'], resolve)
})
```

That's all you need to do. You can use the component just like before, without even thinking about it being async. Webpack will automatically split your final JavaScript into separate bundles with correct dependencies, and automatically load a bundle via Ajax when it is required. You can check out a fully functional example [here](https://github.com/vuejs/vue-webpack-example).

### Improved Transition System

Vue.js' transition system is really easy to use, but in the past it has the limitation that you cannot mix CSS and JavaScript-based transitions together. In 0.12 that is no longer the case! The improved transition system now allows you to add JavaScript hooks to a CSS-based transition for additional control. The amount of hooks exposed have also been expanded to give you finer-grained control at every stage of the transition.

`v-repeat` now also ships with built-in support for staggering transitions. It is as simple as adding `stagger="100"` to your repeated element. It is also possible to define separate staggering for enter and leaving, or even dynamically calculate the staggering delay in a JavaScript hook.

For full details on the new transition system, check out the [updated guide](/guide/transitions.html).

### Performance Tuning

Vue.js' precise dependency tracking makes it the one of the most efficient view layer for small hot updates, but there's always room for improvement. In 0.12, internal instance creation and compilation refactors have improved first-render performance for large lists by up to 40%. With proper `track-by` usage, [re-rendering with large, brand new dataset](http://vuejs.github.io/js-repaint-perfs/vue/) is also comparable to, or even faster than other Virtual-DOM based frameworks.

### One More Thing...

With 0.12 out of the door, more efforts will now be spent on the official vue-router, a dedicated routing library for Vue.js with nested view matching, full transition support, and asynchronous data hooks. I have expressed that Vue.js core intends to stay as a no-frills, drop-in view layer library, and that will not change. The vue-router will be shipped separately and is totally optional, however you can expect it to work seamlessly with Vue.js core when you need it.
