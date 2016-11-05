---
title: Unit Testing
type: guide
order: 23
---

## Setup and Tooling

Anything compatible with a module-based build system will work, but if you're looking for a specific recommendation, try the [Karma](http://karma-runner.github.io) test runner. It has a lot of community plugins, including support for [Webpack](https://github.com/webpack/karma-webpack) and [Browserify](https://github.com/Nikku/karma-browserify). For detailed setup, please refer to each project's respective documentation, though these example Karma configurations for [Webpack](https://github.com/vuejs-templates/webpack/blob/master/template/test/unit/karma.conf.js) and [Browserify](https://github.com/vuejs-templates/browserify/blob/master/template/karma.conf.js) may help you get started.

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
// use any test runner / assertion library combo you prefer
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

  // Mount an instance and inspect the render output
  it('renders the correct message', () => {
    const Ctor = Vue.extend(MyComponent)
    const vm = new Ctor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Writing Testable Components

A lot of components' render output are primarily determined by the props they receive. In fact, if a component's render output solely depends on its props, it becomes quite straightforward to test, similar to asserting the return value of a pure function with different arguments. Take an contrived example:

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

You can assert its render output with different props using the `propsData` option:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// helper function that mounts and returns the rendered text
function getRenderedText (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('render correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

## Asserting Asynchronous Updates

Since Vue [performs DOM updates asynchronously](reactivity.html#Async-Update-Queue), assertions on DOM updates resulting from state change will have to be made in a `Vue.nextTick` callback:

``` js
// Inspect the generated HTML after a state update
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // wait a "tick" after state change before asserting DOM updates
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

We are planning to work on a collection of common test helpers that makes it even simpler to render components with different constraints (e.g. shallow rendering that ignores child components) and assert their output.
