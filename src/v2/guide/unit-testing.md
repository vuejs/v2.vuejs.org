---
title: Unit Testing
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/) has built-in options for unit testing with [Jest](https://github.com/facebook/jest) or [Mocha](https://mochajs.org/) that works out of the box. We also have the official [Vue Test Utils](https://vue-test-utils.vuejs.org/) which provides more detailed guidance for custom setups.

## Simple Assertions

You don't have to do anything special in your components to make them testable. Export the raw options:

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

Then import the component along with [Vue Test Utils](https://vue-test-utils.vuejs.org/), and you can make many common assertions (here we are using Jest-style `expect` assertions just as an example):

``` js
// Import `shallowMount` from Vue Test Utils and the component being tested
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// Mount the component
const wrapper = shallowMount(MyComponent)

// Here are some Jest tests, though you can
// use any test runner/assertion library combo you prefer
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
    expect(wrapper.vm.$data.message).toBe('bye!')
  })

  // Mount an instance and inspect the render output
  it('renders the correct message', () => {
    expect(wrapper.text()).toBe('bye!')
  })
})
```

## Writing Testable Components

A component's render output is primarily determined by the props it receives. If a component's render output solely depends on its props it becomes straightforward to test, similar to asserting the return value of a pure function with different arguments. Take a simplified example:

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

You can assert its render output with different props using [Vue Test Utils](https://vue-test-utils.vuejs.org/):

``` js
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// helper function that mounts and returns the rendered component
function getMountedComponent(Component, propsData) {
  return shallowMount(Component, {
    propsData
  })
}

describe('MyComponent', () => {
  it('renders correctly with different props', () => {
    expect(
      getMountedComponent(MyComponent, {
        msg: 'Hello'
      }).text()
    ).toBe('Hello')

    expect(
      getMountedComponent(MyComponent, {
        msg: 'Bye'
      }).text()
    ).toBe('Bye')
  })
})
```

## Asserting Asynchronous Updates

Since Vue [performs DOM updates asynchronously](reactivity.html#Async-Update-Queue), assertions on DOM updates resulting from state change will have to be made after `vm.$nextTick()` has resolved:

``` js
// Inspect the generated HTML after a state update
it('updates the rendered message when wrapper.message updates', async () => {
  const wrapper = shallowMount(MyComponent)
  wrapper.setData({ message: 'foo' })

  // Wait a "tick" after state change before asserting DOM updates
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toBe('foo')
})
```

For more in-depth information on unit testing in Vue, check out [Vue Test Utils](https://vue-test-utils.vuejs.org/) and our cookbook entry about [unit testing vue components](https://vuejs.org/v2/cookbook/unit-testing-vue-components.html).
