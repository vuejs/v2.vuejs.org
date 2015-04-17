title: Building Larger Apps
type: guide
order: 13
---

Vue.js is designed to be as flexible as possible - it's just an interface library that doesn't enforce any architectural decisions. While this can be very useful for rapid prototyping, it could be a challenge for those with less experience to build larger scale applications with it. The following is an opinionated perspective on how to organize larger projects when using Vue.js.

## Modularization

Although the standalone build of Vue.js can be used as a global, it is often better to utilize a modularized build system to better organize your code. The recommended approach of doing so is by writing your source code in CommonJS modules (the format used by Node.js, and also the format used by Vue.js source code) and bundle them using [Browserify](http://browserify.org/) or [Webpack](http://webpack.github.io/).

Here are some build setup examples on GitHub:

- [Vue + Browserify](https://github.com/vuejs/vue-browserify-example)
- [Vue + Webpack](https://github.com/vuejs/vue-webpack-example)

## Single File Components

In a typical Vue.js project we will be breaking up our code into many small components, and it would be nice to have each component encapsulate its CSS styles, template and JavaScript definition in the same place. A bonus for using the previously mentioned build tools is that they both provided mechanisms to transform the source code before bundling them together, and with a bit of pre-processing we can write our components like this:

<img src="/images/vueify.png">

If you are into pre-processors, you can even do this:

<img src="/images/vueify_with_pre.png">

This is achieved via using the [Vueify](https://github.com/vuejs/vueify) transform for Browserify, or with [Vue-loader](https://github.com/vuejs/vue-loader) for Webpack.

## Routing

You can implement some rudimentary routing logic by manually listening on hashchange and utilizing a dynamic `v-component`.

**Example:**

``` html
<div id="app">
  <div v-component="{{currentView}}"></div>
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

With this mechanism it's very easy to leverage standalone routing libraries such as [Page.js](https://github.com/visionmedia/page.js) or [Director](https://github.com/flatiron/director).

## Communication with Server

All Vue instances can have their raw `$data` directly serialized with `JSON.stringify()` with no additional effort. You can use any Ajax component you like, for example [SuperAgent](https://github.com/visionmedia/superagent). It also plays nicely with no-backend services such as Firebase.

## Unit Testing

Anything compatible with a CommonJS-based build system works. A recommendation is using the [Karma](http://karma-runner.github.io/0.12/index.html) test runner together with its [CommonJS pre-processor](https://github.com/karma-runner/karma-commonjs) to test your code modularly.

The best practice is to export raw options / functions inside modules. Consider this example:

``` js
// my-component.js
module.exports = {
  template: '<span>{{msg}}</span>',
  data: function () {
    return {
      msg: 'hello!'
    }
  }
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
    expect(defaultData.message).toBe('hello!')
  })
})
```

<p class="tip">Since Vue.js directives react to data updates asynchronously, when you are asserting DOM state after changing the data, you will have to do so in a `Vue.nextTick` callback. Alternatively you can set `Vue.config.async = false` during tests, so you can assert the DOM state synchronously right after the data change.</p>

## An Example

The [Vue.js Hackernews Clone](https://github.com/yyx990803/vue-hackernews) is an example application that uses Browserify + Vueify for code organization, Director.js for routing, and HackerNews' official Firebase API as the backend. It's by no means a big application, but it demonstrates the combined usage of the concepts discussed on this page.