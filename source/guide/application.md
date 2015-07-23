title: Building Larger Apps
type: guide
order: 13
---

Vue.js is designed to be as flexible as possible - it's just an interface library that doesn't enforce any architectural decisions. While this can be very useful for rapid prototyping, it could be a challenge for those with less experience to build larger scale applications with it. The following is an opinionated perspective on how to organize larger projects when using Vue.js.

## Modularization

Although the standalone build of Vue.js can be used as a global, it is often better to utilize a modularized build system to better organize your code. The recommended approach of doing so is by writing your source code in CommonJS modules (the format used by Node.js, and also the format used by Vue.js source code) and bundle them using [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/).

Webpack and Browserify are more than just module bundlers, though. They both provide source transform APIs that allow you to transform your source code with other pre-processors. For example, you can write your code with future ES6/7 syntax using [babel-loader](https://github.com/babel/babel-loader) or [babelify](https://github.com/babel/babelify).

## Single File Components

In a typical Vue.js project we will be breaking up our code into many small components, and it would be nice to have each component encapsulate its CSS styles, template and JavaScript definition in the same place. As mentioned above, when using Webpack or Browserify, with proper source transforms we can write our components like this:

<img src="/images/vueify.png">

If you are into pre-processors, you can even do this:

<img src="/images/vueify_with_pre.png">

You can build these single-file Vue components with Webpack + [vue-loader](https://github.com/vuejs/vue-loader) or Browserify + [vueify](https://github.com/vuejs/vueify). It is recommended to use the Webpack setup because Webpack's loader API enables better file dependency tracking and caching if you are using pre-processors.

You can find examples of the build setups on GitHub:

- [Webpack + vue-loader](https://github.com/vuejs/vue-loader-example)
- [Browserify + vueify](https://github.com/vuejs/vueify-example)

## Routing

<p class="tip">The official `vue-router` module is in active development and will be released soon.</p>

You can implement some rudimentary routing logic by manually listening on hashchange and utilizing a dynamic component:

**Example:**

``` html
<div id="app">
  <component is="{{currentView}}"></component>
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

All Vue instances can have their raw `$data` directly serialized with `JSON.stringify()` with no additional effort. The community has contributed the [vue-resource](https://github.com/vuejs/vue-resource) plugin, which provides an easy way to work with RESTful APIs. You can also use any Ajax library you like, e.g. `$.ajax` or [SuperAgent](https://github.com/visionmedia/superagent). Vue.js also plays nicely with no-backend services such as Firebase and Parse.

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

<p class="tip">Since Vue.js directives react to data updates asynchronously, when you are asserting DOM state after changing the data, you will have to do so in a `Vue.nextTick` callback.</p>

## Deploying for Production

The minified standalone build of Vue.js has already stripped out all the warnings for you for a smaller file size, but when you are using tools like Browserify for Webpack to build Vue.js applications, it's not so obvious how to do that.

Starting in 0.12.8, it is quite simple to configure the tools to strip out the warnings:

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

## An Example

The [Vue.js Hackernews Clone](https://github.com/yyx990803/vue-hackernews) is an example application that uses Webpack + vue-loader for code organization, Director.js for routing, and HackerNews' official Firebase API as the backend. It's by no means a big application, but it demonstrates the combined usage of the concepts discussed on this page.

Next: [Extending Vue](/guide/extending.html).
