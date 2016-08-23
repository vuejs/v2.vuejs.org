---
title: Unit Testing
type: guide
order: 22
---

## Setup and Tooling

Anything compatible with a module-based build system will work, but if you're looking for a specific recommendation, try the [Karma](http://karma-runner.github.io/0.12/index.html) test runner. It has a lot of community plugins, including support for [Webpack](https://github.com/webpack/karma-webpack) and [Browserify](https://github.com/Nikku/karma-browserify). For detailed setup, please refer to each project's respective documentation, though these example Karma configurations for [Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js) and [Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js) may help you get started.

## Simple Assertions

In terms of code structure for testing, you don't have to do anything special in your components to make them testable. Just export the raw options:

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```

When you test that component, all you have to do is import the object along with Vue to make many common assertions:

``` js
// Import Vue and the component being tested
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Here are some Jasmine 2.0 tests, though you can
// use any assertion library you prefer
describe('MyComponent', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // Inspect the component instance on mount
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // Inspect the generated HTML on mount
  it('renders the correct message', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Asserting Asynchronous Updates

Since Vue performs DOM updates asynchronously, some assertions will have to be made in a `Vue.nextTick` callback:

``` js
// Inspect the generated HTML after a state update
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```
