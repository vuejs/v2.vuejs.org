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

![Documentation site](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/screendocs.jpg 'Docs demo')

We'll create a base icon (`IconBase.vue`) component that uses a scoped slot.

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
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
```

You can use this base icon as is- the only thing you might need to update is the `viewBox` depending on the `viewBox` of your icons. In the base, we're making the `width`, `height`, `color`, and name of the icon props so that it can be dynamically updated with props. The name will be used for both the title `id` for accessibility, and the `title`.

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
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
```

The currentColor property that's the default on the fill will make the icon inherit the color of whatever text surrounds it. We could also pass in a different color as a prop if we wish.

We can use it like so, with the only contents of IconWrite.vue containing the paths inside the icon:

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

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/Screen%20Shot%202018-01-01%20at%204.51.40%20PM.png" width="450" />

## Animatable Icons

Keeping icons in components comes in very handy when you'd like to animate them, especially on an interaction. Inline SVGs have the highest support for interaction of any method. Here's a very basic example of an icon that's animated on click:

```html
<template>
  <svg @click="startScissors"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    aria-labelledby="scissors"
    role="presentation"
    >
    <title id="scissors" lang="en">Scissors Animated Icon</title>
    <path id="bk" fill="#fff" d="M0 0h100v100H0z"/>
    <g ref="leftscissor">
      <path d="M..."/>
      ...
    </g>
    <g ref="rightscissor">
      <path d="M..."/>
      ...
    </g>
  </svg>
</template>
```

```js
import { TweenMax, Sine } from 'gsap'

export default {
  methods: {
    startScissors() {
      this.scissorAnim(this.$refs.rightscissor, 30)
      this.scissorAnim(this.$refs.leftscissor, -30)
    },
    scissorAnim(el, rot) {
      TweenMax.to(el, 0.25, {
        rotation: rot,
        repeat: 3,
        yoyo: true,
        svgOrigin: '50 45',
        ease: Sine.easeInOut
      })
    }
  }
}
```

We're applying `refs` to the groups of paths we need to move, and as both sides of the scissors have to move in tandem, we'll create a funciton we can reuse where we'll pass in the `refs`. The use of GreenSock helps resolve animation support and transform-origin issues across browser.

<p data-height="300" data-theme-id="0" data-slug-hash="dJRpgY" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Editable SVG Icon System: Animated icon" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/dJRpgY/">Editable SVG Icon System: Animated icon</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

<p style="margin-top:-30px">Pretty easily accomplished! And easy to update on the fly.</p>

You can see more animated examples in the repo [here](https://github.com/sdras/vue-sample-svg-icons/)

## Additional Notes

Designers may change their minds. Product requirements change. Keeping the logic for the entire icon system in one base component means you can quickly update all of your icons and have it propogate through the whole system. Even with the use of an icon loader, some situations require you to recreate or edit every SVG to make global changes. This method can save you that time and pain.

## When To Avoid This Pattern

This type of SVG icon system is really useful when you have a number of icons that are used in different ways throughout your site. If you're repeating the same icon many times on one page (e.g. a giant table a delete icon in each row), it might make more sense to have all of the sprites compiled into a sprite sheet and use `use` tags to load them.

## Alternative Patterns

Other tooling to help manage SVG icons includes:

* [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)
* [svgo-loader](https://github.com/rpominov/svgo-loader)

These tools bundle SVGs at compile time, but make them a little harder to edit during runtime, because `use` tags can have strange cross-browser issues when doing anything more complex. They also leave you with two nested `viewBox` properties and thus two coordinate systems. This makes the implementation a little more complex.
