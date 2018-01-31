---
title: Unit Testing Vue Components
type: cookbook
order: 1.4
---

## Simple Example

Unit testing is a fundamental part of software development. Unit tests execute the smallest units of code in isolation, in order to increase ease of adding new features and track down bugs. Vue's [single-file components](./single-file-components.html) make it straight forward to write unit tests for components in isolation. This lets you develop new features with confidence you are not breaking existing ones, and helps other developers understand what your component does.

This simple example tests whether some text is rendered:

```html
<template>
  <div>
    <input v-model="username">
    <div 
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
        ? 'Please enter a longer username'
        : ''
    }
  }
}
</script>
```

```js
import { shallow } from 'vue-test-utils'

test('Foo', () => {
  // render the component
  const wrapper = shallow(Hello)

  // should not allow for username less than 7 characters, excludes whitespace
  wrapper.setData({ username: ' '.repeat(7) })

  // assert the error is rendered
  expect(wrapper.find('.error').exists()).toBe(true)

  // update the name to be long enough
  wrapper.setData({
    username: {
      'Lachlan'
    }
  })

  // assert the error has gone away
  expect(wrapper.find('.error').exists()).toBe(false)
})
```

The above code snippet shows how to test whether an error message is rendered based on the length of the username. It demonstrates the general idea of unit testing Vue components: render the component, and assert that the markup matches the state of the component.

## Why test?

Component unit tests have lots of benefits:
- Provide documentation on how the component should behave
- Save time over testing manually
- Reduce bugs in new features
- Improve design
- Facilitate refactoring

Automated testing allows large teams of developers to maintain complex codebases. 

#### Getting started

[vue-test-utils](https://github.com/vuejs/vue-test-utils) is the official library for unit testing Vue components. The (vue-cli)[https://github.com/vuejs/vue-cli] webpack template comes with either Karma or Jest, both well supported test runners, and there are some (guides)[https://vue-test-utils.vuejs.org/en/guides/] in the `vue-test-utils` documentation.

## Real-World Example

Unit tests should be
- Fast to run
- Easy to understand
- Only test a _single unit of work_

Let's continue building on the previous example, while introducing the idea of a [factory function](https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)) to make our test more compact and readable. The component should:

- show a 'Welcome to the Vue.js cookbook' greeting.
- prompt the user to enter their username
- if the entered username is less than seven letters, display an error

Let's take a look at the component code first:

```html
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
    Enter your username: <input v-model="usernane">
    <div 
      v-if="error"
      class="error"
    >
      Please enter a username with at least seven letters.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Foo',

  data () {
    return {
      message: 'Welcome to the Vue.js cookbook',
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
    }
  }
}
</script>
```

The things that we should test are:
- is the `message` rendered?
- if `error` is `true`, `<div class="error"`> should be present
- if `error` is `false`, `<div class="error"`> should not be present

And our first attempt at at test:

```js
import { shallow } from 'vue-test-utils'

describe('Foo', () => {
  it('renders a message and responds correctly to user input', () => {
      const wrapper = shallow(Foo, {
    data: {
      message: 'Hello World',
      username: ''
    }
  })

  // see if the message renders
  expect(wrapper.find('.message').text()).toEqual('Hello World')

  // assert the error is rendered
  expect(wrapper.find('.error').exists()).toBeTruthy()

  // update the username and assert error is longer rendered
  wrapper.setData({ username: 'Lachlan'  })
  expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

There are some problems with the above:
- a single test is making assertions about different things
- difficult to tell the different states the component can be in, and what should be rendered

The below example improves the test by:
- only making one assertion per `it` block
- having short, clear test descriptions
- providing only the minimum data requires for the test
- refactoring duplucated logic (creating the `wrapper` and setting the `username` variable) into a factory function

*Updated test*:
```js
import { shallow } from 'vue-test-utils'
import Foo from './Foo'

const factory = (values = {}) => {
  return shallow(Foo, {
    data: { ...values  }
  })
}

describe('Foo', () => {
  it('renders a welcome message', () => {
    const wrapper = factory()

    expect(wrapper.find('.message').text()).toEqual("Welcome to the Vue.js cookbook")
  })

  it('renders an error when username is less than 7 characters', () => {
    const wrapper = factory({ username: ''  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('renders an error when username is whitespace', () => {
    const wrapper = factory({ username: ' '.repeat(7)  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('does not render an error when username is 7 characters or more', () => {
    const wrapper = factory({ username: 'Lachlan'  })

    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

Points to note:

At the top, we declare the factory function which merges the `values` object into `data` and returns a new `wrapper` instance. This way, we don't need to duplicate `const wrapper = shallow(Foo)` in every test. Another great benefit to this is when more complex components with a method or computed property you might want to mock or stub in every test, you only need to declare it once. 

## Additional Context

Thee above test is fairly simple, but in practise Vue components often have other behaviors you want to test, such as:

- making API calls
- committing or dispatching mutations or actions with a `Vuex` store
- testing interaction

There are more complete examples showing such tests in the `vue-test-utils` [guides](https://vue-test-utils.vuejs.org/en/guides/).

`vue-test-utils` and the enormous JavaScript ecosystem provides plenty of tooling to facilitate almost 100% test coverage. Unit tests are only one part of the testing pyramid, though. Some other types of tests include e2e (end to end) tests, and snapshot tests. Unit tests are the smallest and most simple of tests - they make assertions on the smallest units of work, isolating each part of a single component. 

Snapshot tests save the markup of your Vue component, and compare to the new one generated each time the test runs. If something changes, the developer is notified, and can decide if the change was intentional (the component was updated) or accidentally (the component is behaving incorrectly).

End to end tests involve ensure a number of components interact together well. They are more high level. Some examples might be testing if a user can sign up, log in, and update their username. These are slowly to run than unit tests or snapshot tests.

Unit tests are most useful during development, either to help a developer think about how to design a component, or refactor an existing component, and are often run every time code is changed. 

Higher level tests, such as end to end tests, run much slower. These usually run pre-deploy, to ensure each part of the system is working together correctly.

More information about testing Vue components can be found in [Testing Vue.js Applications](https://www.manning.com/books/testing-vuejs-applications) by core team member [Edd Yerburgh](https://eddyerburgh.me/).

## When To Avoid This Pattern

Unit testing is an important part of any serious application. At first, when the vision of an application is not clear, unit testing might slow down development, but once a vision is established and real users will be interacting with the application, unit tests (and other types of automated tests) are absolutely essential to ensure the codebase is maintainable and scalable.
