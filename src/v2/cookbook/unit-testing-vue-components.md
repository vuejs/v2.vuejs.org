---
title: Unit Testing Vue Components
type: cookbook
order: 1.2
---

## Simple Example

_required_

Unit testing is a fundamental part of software developmenet. The underlying idea is tests the smallest units of code, in isolation from others. This makes it easy to refactor, add new features, or track down bugs. Vue's [single-file components](./single-file-components.html), it is straight forward to write unit tests for components in isolation. This lets you develop new features with confidence you are not breaking existing ones, and helps other people to understand what your component does.

This simple example tests whether some text is rendered:

```html
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      message: 'Hello World!'
    }
  }
}
</script>
```

```js
// render the component
const wrapper = shallow(Hello)
// assert the text is rendered
expect(wrapper.text()).toEqual('Hello World!')
```

This contrived example isn't very useful, but it demonstrates the general idea of unit testing Vue components: render the component, and make assertions to check if the markup matches the state of the component.

## Details about the Value

_required_

1. Address common questions that one might have while looking at the example. (Blockquotes are great for this)
2. Show examples of common missteps and how they can be avoided.
3. Show very simple code samples of good and bad patterns.
4. Discuss why this may be a compelling pattern. Links for reference are not required but encouraged.

## Real-World Example

_required_

Demonstrate the code that would power a common or interesting use case, either by:
1. Walking through a few terse examples of setup, or
2. Embedding a codepen/jsfiddle example

If you choose to do the latter, you should still talk through what it is and does.

## Additional Context

_optional_

It's extremely helpful to write a bit about this pattern, where else it would apply, why it works well, and run through a bit of code as you do so or give people further reading materials here.

## When To Avoid This Pattern

_optional_

This section is not required, but heavily recommended. It won't make sense to write it for something very simple such as toggling classes based on state change, but for more advanced patterns like mixins it's vital. The answer to most questions about development is ["It depends!"](https://codepen.io/rachsmith/pen/YweZbG), this section embraces that. Here, we'll take an honest look at when the pattern is useful and when it should be avoided, or when something else makes more sense.

## Alternative Patterns

_optional, except when the section above is provided_

This section is required when you've provided the section above about avoidance. It's important to explore other methods so that people told that something is an antipattern in certain situations are not left wondering. In doing so, consider that the web is a big tent and that many people have different codebase structures and are solving different goals. Is the app large or small? Are they integrating Vue into an existing project, or are they building from scratch? Are their users only trying to achieve one goal or many? Is there a lot of asynchronous data? All of these concerns will impact alternative implementations. A good cookbook recipe gives developers this context.

## Thank you

It takes time to contribute to documentation, and if you spend the time to submit a PR this section of our docs, you do so with our gratitude.
