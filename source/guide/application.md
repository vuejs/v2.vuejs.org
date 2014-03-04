title: Building Larger Apps
type: guide
order: 11
---

Vue.js is designed to be as flexible as possible - it's just an interface library that doesn't enforce any architectural decisions. While this can be very useful for rapid prototyping, it could be a challenge for those with less experience to build larger scale applications with it. The following is an opinionated perspective on how to organize larger projects when using Vue.js.

## Build with Component

<img src="http://component.io/boot/images/logo.png">

Vue.js is built with [Component](https://github.com/component/component), a front-end package manager and build tool. With Component you can write your browser code in the format of CommonJS modules (the same format Node.js uses), and publish packages simply by pushing them to public GitHub repositories. This helps greatly with both code modularization and reusability. For a boilerplate of using Vue.js with Component, see the [vue-component-example](https://github.com/vuejs/vue-component-example).

There are already [a great number of public components](https://github.com/component/component/wiki/Components) available that deal with common problems in front-end applications. For a larger scale application, you can use Vue.js as the interface layer and fill in the missing pieces with other components.

Alternatively, [Browserify](http://browserify.org/) is another excellent CommonJS based build system for browser JavaScript. Instead of GitHub repos, Browserify leverages NPM as its package manager and also has a thriving community.

## Modularization

Component as a built tool not only deals with JavaScript; it can also build CSS, templates and other assets. With builder hooks it can also pre-process files written in non-native formats, e.g. CoffeeScript, SASS and Stylus. Therefore it is possible to deliver highly self-contained components that encapsulates template structure, JavaScript logic and CSS presentation at the same time. A simple example can be found [here](https://github.com/vuejs/vue-component-example/tree/master/src/components/a).

Similar modularization can be achieved in Browserify too, with transform plugins such as [partialify](https://github.com/bclinkinbeard/partialify). A simple setup example can be found [here](https://github.com/vuejs/vue-browserify-example).

## Routing

You can implement some rudimentary routing logic by manually updating a state object on hashchange. An example can be found [here](https://github.com/yyx990803/vue/blob/master/test/functional/fixtures/routing.html).

It is also possible to implement something more robust with the help of routing components such as [Page.js](https://github.com/visionmedia/page.js) or [Director](https://github.com/flatiron/director). There is plan to provide a vue-router component that integrates with Vue.js for easier routing and deep linking.

## Communication with Server

All Vue.js ViewModels and their raw `$data` can be serialized with `JSON.stringify()` with no additional effort. You can use any Ajax component you like, for example [SuperAgent](https://github.com/visionmedia/superagent). It also plays nicely with no-backend services such as Firebase. In addition there is plan to provide a vue-resource component that resembles Angular's `$resource`, to make interfacing with a REST API easier.

## Unit Testing

By using Component, Vue.js entities (ViewModel constructors, directives, filters) within a large project can be split into separate CommonJS modules. When a Component-based project is built without the `standalone` flag, it will expose its `require()` method, granting access to all these internal modules. This makes it quite easy to write browser unit tests - just include the test build and require the module you want to test.

The best practice is to export raw options / functions inside modules. Consider this example:

``` js
// my-component.js
module.exports = {
    created: function () {
        this.message = 'hello!'
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
// Some Mocha tests
// using a non-standalone build of the project
describe('my-component', function () {
    
    // require exposed internal module
    var myComponent = require('my-project/src/my-component')

    it('should have a created hook', function () {
        assert.equal(typeof myComponent.created, 'function')
    })

    it('should set message in the created hook', function () {
        var mock = {}
        myComponent.created.call(mock)
        assert.equal(mock.message, 'hello!')
    })

})
```

<p class="tip">Since Vue.js bindings update asynchronously, you should use `Vue.nextTick()` when asserting DOM updates after changing the data.</p>