---
title: Building Large-Scale Apps
type: guide
order: 18
---

> **NEW:** Get up and running with single file Vue components, hot-reload, lint-on-save and unit testing in minutes with [vue-cli](https://github.com/vuejs/vue-cli)!

The Vue.js core library is designed to be focused and flexible - it's just a view layer library that doesn't enforce any application-level architecture. While this can be great for integrating with existing projects, it could be a challenge for those with less experience to build larger scale applications from scratch.

The Vue.js ecosystem provides a set of tools and libraries on how to build large SPAs with Vue. This part is where we start to get a bit "framework"-ish, but it's really just an opinionated list of recommendations; you still get to pick what to use for each part of the stack.

## Modularization

For large projects it's necessary to utilize a modularized build system to better organize your code. The recommended approach of doing so is by writing your source code in CommonJS or ES6 modules and bundle them using [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/).

Webpack and Browserify are more than just module bundlers, though. They both provide source transform APIs that allow you to transform your source code with other pre-processors. For example, you can write your code with future ES2015/2016 syntax using [babel-loader](https://github.com/babel/babel-loader) or [babelify](https://github.com/babel/babelify).

If you've never used them before, I highly recommend going through a few tutorials to get familiar with the concept of module bundlers, and start writing JavaScript using the latest ECMAScript features.

## Single File Components

In a typical Vue.js project we will be dividing our interface into many small components, and it would be nice to have each component encapsulate its CSS styles, template and JavaScript definition in the same place. As mentioned above, when using Webpack or Browserify, with proper source transforms we can write our components like this:

<img src="/images/vue-component.png">

If you are into pre-processors, you can even do this:

<img src="/images/vue-component-with-pre-processors.png">

You can build these single-file Vue components with Webpack + [vue-loader](https://github.com/vuejs/vue-loader) or Browserify + [vueify](https://github.com/vuejs/vueify). You can also play with it online at [Webpackbin.com](http://www.webpackbin.com/vue)!

Which build tool to choose is largely dependent on your experience and needs. Webpack-based setup offers more powerful features such as code splitting, processing static assets as module dependencies and extracting component CSS into a separate file, but can be a bit more complex to configure. Browserify can be easier to setup in scenarios where you don't need the advanced features that Webpack offers.

The fastest way to get up and running with a pre-configured build setup is using the official [vue-cli](https://github.com/vuejs/vue-cli). You can also find the official scaffold templates on GitHub:

- [Webpack + vue-loader](https://github.com/vuejs-templates/webpack)
- [Browserify + vueify](https://github.com/vuejs-templates/browserify)

## Routing

For Single Page Applications, it is recommended to use the [official vue-router library](https://github.com/vuejs/vue-router), which is currently in technical preview. For more details, please refer to vue-router's [documentation](http://vuejs.github.io/vue-router/).

If you just need some very simple routing logic, you can also implement it by manually listening on `hashchange` and utilizing a dynamic component:

**Example:**

``` html
<div id="app">
  <component :is="currentView"></component>
</div>
```

``` js
Vue.component('home', { /* ... */ })
Vue.component('page1', { /* ... */ })
var app = new Vue({
  el: '#app',
  data: {
    currentView: 'home'
  }
})
// Switching pages in your route handler:
app.currentView = 'page1'
```

With this mechanism it's also very easy to leverage external routing libraries such as [Page.js](https://github.com/visionmedia/page.js) or [Director](https://github.com/flatiron/director).

## Communication with Server

All Vue instances can have their raw `$data` directly serialized with `JSON.stringify()` with no additional effort. The community has contributed the [vue-resource](https://github.com/vuejs/vue-resource) plugin, which provides an easy way to work with RESTful APIs. You can also use any Ajax library you like, e.g. `$.ajax` or [SuperAgent](https://github.com/visionmedia/superagent). Vue.js also plays nicely with no-backend services such as Firebase and Parse.

## State Management

In large applications, state management often becomes complex due to multiple pieces of state scattered across many components and the interactions between them. It is often overlooked that the source of truth in Vue.js applications is the raw data object - a Vue instance simply proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you should avoid duplicating it. Instead, share it by identity:

``` js
var sourceOfTruth = {}

var vmA = new Vue({
  data: sourceOfTruth
})

var vmB = new Vue({
  data: sourceOfTruth
})
```

Now whenever `sourceOfTruth` is mutated, both `vmA` and `vmB` will update their views automatically. Extending this idea further, we would arrive at the **store pattern**:

``` js
var store = {
  state: {
    message: 'Hello!'
  },
  actionA: function () {
    this.state.message = 'action A triggered'
  },
  actionB: function () {
    this.state.message = 'action B triggered'
  }
}

var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

Notice we are putting all actions that mutate the store's state inside the store itself. This type of centralized state management makes it easier to understand what type of mutations could happen to the state, and how are they triggered. Each component can still own and manage its private state.

![State Management](/images/state.png)

One thing to take note is that you should never replace the original state object in your actions - the components and the store need to share reference to the same object in order for the mutations to be observed.

If we enforce a convention where components are never allowed to directly mutate state that belongs to a store, but should instead dispatch events that notify the store to perform actions, we've essentially arrived at the [Flux](https://facebook.github.io/flux/) architecture. The benefit of this convention is we can record all state mutations happening to the store, and on top of that we can implement advanced debugging helpers such as mutation logs, snapshots, history re-rolls, etc.

The Flux architecture is commonly used in React applications, but it can be applied to Vue.js application as well. For example, [Vuex](https://github.com/vuejs/vuex/) is a Flux-inspired application architecture that is designed specifically for managing state inside large Vue.js applications. [Redux](https://github.com/rackt/redux/), the most popular Flux implementation for React, is view-layer agnostic and can also easily work with Vue via some [simple bindings](https://github.com/egoist/revue).

## Unit Testing

Anything compatible with a module-based build system works. A recommendation is using the [Karma](http://karma-runner.github.io/0.12/index.html) test runner. It has a lot of community plugins, including support for [Webpack](https://github.com/webpack/karma-webpack) and [Browserify](https://github.com/Nikku/karma-browserify). For detailed setup, please refer to each project's respective documentation.

In terms of code structure for testing, the best practice is to export raw options / functions in your component modules. Consider this example:

``` js
// my-component.js
module.exports = {
  template: '<span>{{msg}}</span>',
  data: function () {
    return {
      msg: 'hello!'
    }
  },
  created: function () {
    console.log('my-component created!')
  }
}
```

You can use that file in your entry module like this:

``` js
// main.js
var Vue = require('vue')
var app = new Vue({
  el: '#app',
  data: { /* ... */ },
  components: {
    'my-component': require('./my-component')
  }
})
```

And you can test that module like this:

``` js
// Some Jasmine 2.0 tests
describe('my-component', function () {
  // require source module
  var myComponent = require('../src/my-component')
  it('should have a created hook', function () {
    expect(typeof myComponent.created).toBe('function')
  })
  it('should set correct default data', function () {
    expect(typeof myComponent.data).toBe('function')
    var defaultData = myComponent.data()
    expect(defaultData.msg).toBe('hello!')
  })
})
```

There are example Karma configurations for both [Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js) and [Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js).

<p class="tip">Since Vue.js directives perform updates asynchronously, when you are asserting DOM state after changing the data, you will have to do so in a `Vue.nextTick` callback.</p>

## Deploying for Production

The minified standalone build of Vue.js has already stripped out all the warnings for you for a smaller file size, but when you are using tools like Browserify or Webpack to build Vue.js applications, you will need some additional configuration to achieve this.

### Webpack

Use Webpack's [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) to indicate a production environment, so that warning blocks can be automatically dropped by UglifyJS during minification. Example config:

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
```

### Browserify

Just run your bundling command with `NODE_ENV` set to `"production"`. Vue automatically applies [envify](https://github.com/hughsk/envify) transform to itself and makes warning blocks unreachable. For example:

``` bash
NODE_ENV=production browserify -e main.js | uglifyjs -c -m > build.js
```

## An App Example

The [Vue.js Hackernews Clone](https://github.com/vuejs/vue-hackernews) is an example application that uses Webpack + vue-loader for code organization, vue-router for routing, and HackerNews' official Firebase API as the backend. It's by no means a big application, but it demonstrates the combined usage of the concepts discussed on this page.
