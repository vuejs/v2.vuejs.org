---
title: Unit Testing
type: guide
order: 20
---

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
