---
title: Editable SVG Icon Systems
type: cookbook
order: 2
---

## Base Example

There are many ways to create an SVG Icon System, but one method that takes advantage of Vue's capabilities is to create editable inline icons as components. Some of the advantages of this way of working is:

* They are easy to edit on the fly
* They are animatable
* You can use standard props and defaults to keep them to a typical size or alter them if you need to
* They are inline, so no HTTP requests are necessary
* They can be made accessible dynamically

First, we'll create a folder for all of the icons, and name them in a standardized fashion for easy retrieval:

> components/icons/IconBox.vue
> components/icons/IconCalendar.vue
> components/icons/IconEnvelope.vue

Here's an example repo to get you going, where you can see the entire setup: [https://github.com/sdras/vue-sample-svg-icons/](https://github.com/sdras/vue-sample-svg-icons/)

![Documentation site](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/screendocs.jpg "Docs demo")

We'll create a base icon (`iconBase.vue`) that will be a component that's uses a scoped slot.

```html
<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title :id="iconName" lang="en">{{iconName}} icon</title>
    <g fill="currentColor">
      <slot />
    </g>
  </svg>
</template>
```

You can use this base icon as is- the only thing you might need to update is the viewBox depending on the viewBox of your icons. In the base, we're making the width, height and name of the icon props so that it can be dynamically updated with props. The name will be used for both the title id for accessibility, and the title.

The currentColor property on the fill will make the icon inherit the color of whatever text surrounds it. This could also be used as a bound property, if you'd like to change it up.

Our script will look like this, we'll have some defaults so that our icon will be rendered consistently unless we state otherwise:

```js
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    }
  }
}
```

Then we can use it like so, with the only contents of IconWrite.vue containing the paths inside the icon:

```html
<icon-base icon-name="write"><icon-write /></icon-base>
```

Now, if we'd like to make many sizes for the icon, we can do so very easily:

```html
<p>
  <!--you can pass in a smaller width and height as props-->
  <icon-base width="12" height="12" icon-name="write"><icon-write /></icon-base>
  <!--or you can use the default, which is 18-->
  <icon-base icon-name="write"><icon-write /></icon-base>
  <!--or make it a little bigger too :) -->
  <icon-base width="30" height="30" icon-name="write"><icon-write /></icon-base>
</p>
```

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
