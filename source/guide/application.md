title: Building Larger Apps
type: guide
order: 11
---

# {{title}}

Vue.js is designed to be as flexible as possible - it's just an interface library that doesn't enforce any architectural decisions. While this can be very useful for rapid prototyping, it could be a challenge for those with less experience to build larger scale applications with it. The following is an opinionated perspective on how to organize larger projects when using Vue.js.

## Build with Component

Vue.js is built with [Component](https://github.com/component/component), a front-end package manager and build tool. With Component you can write your browser code in the format of CommonJS modules (the same format Node.js uses), and publish packages simply by pushing them to public GitHub repositories. This helps greatly with both code modularization and reusability. For a boilerplate of using Vue.js with Component, see the [vue-component-example](https://github.com/vuejs/vue-component-example).

There are already [a great number of components](https://github.com/component/component/wiki/Components) available that deal with common problems in front-end applications. For a larger scale application, you can use Vue.js as the interface layer and fill in the missing pieces with other components.

## Modularization

Component as a built tool not only deals with JavaScript; it can also build CSS, templates and other assets. With builder hooks it can also pre-process files written in non-native formats, e.g. CoffeeScript, SASS and Stylus. Therefore it is possible to deliver highly self-contained components that encapsulates template structure, JavaScript logic and CSS presentation at the same time. A simple example can be found [here](https://github.com/vuejs/vue-component-example/tree/master/src/components/a).

## Routing

You can implement some rudimentary routing logic by manually updating a state object on hashchange. An example can be found [here](https://github.com/yyx990803/vue/blob/master/test/functional/fixtures/routing.html).

It is also possible to implement something more robust with the help of routing components such as [page.js](https://github.com/visionmedia/page.js). There is plan to provide a vue-router component that integrates with Vue.js for easier routing and deep linking.

## Communication with Server

All Vue.js ViewModels and their raw `$data` can be serialized with `JSON.stringify()` with no additional effort. You can use any Ajax component you like, for example [superagent](https://github.com/visionmedia/superagent). It also plays nicely with no-backend services such as Firebase. In addition there is plan to provide a vue-resource component that resembles Angular's `$resource`, to make interfacing with a REST API easier.