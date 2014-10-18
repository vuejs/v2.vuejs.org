title: Building Larger Apps
type: guide
order: 13
---

Vue.js is designed to be as flexible as possible - it's just an interface library that doesn't enforce any architectural decisions. While this can be very useful for rapid prototyping, it could be a challenge for those with less experience to build larger scale applications with it. The following is an opinionated perspective on how to organize larger projects when using Vue.js.

## Build with Component

<img src="http://component.io/boot/images/logo.png">

Vue.js is built with [Component](https://github.com/component/component), a front-end package manager and build tool. With Component you can write your browser code in the format of CommonJS modules (the same format Node.js uses), and publish packages simply by pushing them to public GitHub repositories. This helps greatly with both code modularization and reusability. For a boilerplate of using Vue.js with Component, see the [vue-component-example](https://github.com/vuejs/vue-component-example).

There are already [a great number of public components](https://github.com/component/component/wiki/Components) available that deal with common problems in front-end applications. For a larger scale application, you can use Vue.js as the interface layer and fill in the missing pieces with other components.

Alternatively, [Browserify](http://browserify.org/) is another excellent CommonJS based build system for browser JavaScript. Instead of GitHub repos, Browserify leverages NPM as its package manager and also has a thriving community.

## Modularization

Component as a build tool not only deals with JavaScript; it can also build CSS, templates and other assets. With builder hooks it can also pre-process files written in non-native formats, e.g. CoffeeScript, SASS and Stylus. Therefore it is possible to deliver highly self-contained components that encapsulate template structure, JavaScript logic and CSS presentation at the same time. A simple example can be found [here](https://github.com/vuejs/vue-component-example/tree/master/src/components/a).

Similar modularization can be achieved in Browserify too, with transform plugins such as [partialify](https://github.com/bclinkinbeard/partialify). A simple setup example can be found [here](https://github.com/vuejs/vue-browserify-example).

## Routing

You can implement some rudimentary routing logic by manually listening on hashchange and utilizing the `v-view` direcitve. The `v-view` directive is essentially a dynamic component loader: it binds to a string value and creates a new VM instance using that string as the Component ID (and destroys the old VM if it exists). Example:

``` html
<div id="app">
    <div v-view="currentView"></div>
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
```

The `home` component will be rendered in place of `v-view`. When `currentView`'s value changes to `page1`, the existing `home` component will be destroyed and replaced by the new `page1` component. The full, more detailed example can be found [here](https://github.com/yyx990803/vue/blob/master/test/functional/fixtures/routing.html).

<p class="tip">`v-view` will replace the element it's bound to with the new instantiated VM's element, so avoid using it on your root element.</p>

With `v-view` it's very easy to leverage standalone routing libraries such as [Page.js](https://github.com/visionmedia/page.js) and [Director](https://github.com/flatiron/director). See [basic example with Page.js](https://github.com/collinglass/page-vue-example). There is a plan to provide a vue-router component that integrates with Vue.js for easier routing and deep linking.

## Communication with Server

All Vue.js ViewModels can have their raw `$data` directly serialized with `JSON.stringify()` with no additional effort. You can use any Ajax component you like, for example [SuperAgent](https://github.com/visionmedia/superagent). It also plays nicely with no-backend services such as Firebase. In addition there is a plan to provide a vue-resource component that resembles Angular's `$resource`, to make interfacing with a REST API easier.

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