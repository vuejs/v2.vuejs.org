---
title: Creating Custom Scroll Directives
type: cookbook
order: 7
---

## Base Example

There are many times that we might want to add a bit of behavior, especially animation, to a scroll event on a site. There are many ways to do so, but the path with the least amount of code and dependencies is perhaps to use a [custom directive](/v2/guide/custom-directive.html) to create a hook for anything that fires off a particular scroll event.

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// main app
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        el.setAttribute(
          'style',
          'opacity: 1; transform: translate3d(0, -10px, 0)'
        )
      }
      return window.scrollY > 100
    }
  }
})
```

```html
<div id="app">
  <h1 class="centered">Scroll me</h1>
  <div
    v-scroll="handleScroll"
    class="box"
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

<p class="tip">Remember! The directive must be registered before the Vue instance.</p>

We'd also need a style property that will transition the intermediary values here, in this case:

```css
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="450" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Custom Scroll Directive- CSS Transition" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">Custom Scroll Directive- CSS Transition</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Or, with GreenSock(GSAP) or any other JavaScript animation library, the code becomes even more simple:

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// main app
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        TweenMax.to(el, 1.5, {
          y: -10,
          opacity: 1,
          ease: Sine.easeOut
        })
      }
      return window.scrollY > 100
    }
  }
})
```

Though we would remove the previous CSS transition from this implementation because it's now handled with JavaScript.

## The Benefit of Using Custom Directives

Vue is rich with options for directives, most of which cover very common use-cases, which can create a very productive developer experience. But even if you have an edge case not covered by the framework, it's got you covered in this case as well, because you can quite easily create a custom directive to fit your needs.

Attaching and removing scroll events to elements is a really good use case for this technique because just like other directives we use, they are necessarily tied to the element and otherwise, we'd have to find the reference for it in the DOM. This pattern avoids the need for traversal, and keeps the event logic paired with the node that it's in reference to.

## Real-World Example: Using a Custom Scroll Directive for Cascading Animations

In the course of creating a cohesive site, you may find that you're reusing the same type of animation logic in several areas. It seems simple, we would then create a very specific custom directive, right? Well, typically if you're reusing it, you will need to change it _just_ slightly for each use.

To help keep our code concise and legible, we would want to pass in some predefined arguments such as the beginning point and ending of the animation as we scroll down the page.

**This example is better viewed in the [full screen version](https://s.codepen.io/sdras/debug/078c19f5b3ed7f7d28584da450296cd0).**

<p data-height="500" data-theme-id="5162" data-slug-hash="c8c55e3e0bba997350551dd747119100" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Scrolling Example- Using Custom Directives in Vue" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/c8c55e3e0bba997350551dd747119100/">Scrolling Example- Using Custom Directives in Vue</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

In the demo above, each of the sections has two different types of animation triggered from the scroll: a morphing animation, and a drawing animation that animates the individual paths in the SVG. We reuse those two animations, so we can create a custom directive for each. The arguments we'll pass in will help keep everything simple and reusable.

To show how we do this, we'll take a look at the morphing shape example, where we'll need to state the start and finish, as well as pass in a path value that we'll create a morph to. These arguments are each defined as `binding.value.foo`:

```js
Vue.directive('clipscroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      var hasRun = false
      if (!hasRun && window.scrollY > binding.value.start) {
        hasRun = true
        TweenMax.to(el, 2, {
          morphSVG: binding.value.toPath,
          ease: Sine.easeIn
        })
      }
      if (window.scrollY > binding.value.end) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})
```

We can then use this animation in our template, in this case we're attaching the directive to the `clipPath` element, and pass all of our arguments to the directives in an object.

```html
<clipPath id="clip-path">
  <path
    v-clipscroll="{ start: '50', end: '100', toPath: 'M0.39 0.34H15.99V22.44H0.39z' }"
    id="poly-shapemorph"
    d="M12.46 20.76L7.34 22.04 3.67 18.25 5.12 13.18 10.24 11.9 13.91 15.69 12.46 20.76z"
  />
</clipPath>
```

## Alternative Patterns

Custom directives are extremely useful, but you may find some situations where you need something very specific that already exists in scrolling libraries that you don't wish to rebuild from scratch yourself.

[Scrollmagic](http://scrollmagic.io/) has a very rich ecosystem of offerings to work with, as well as good documentation and demos to explore. This includes, but is not limited to things like [parallax](http://scrollmagic.io/examples/advanced/parallax_scrolling.html), [cascading pinning](http://scrollmagic.io/examples/expert/cascading_pins.html), [section wipes](http://scrollmagic.io/examples/basic/section_wipes_natural.html), and [responsive duration](http://scrollmagic.io/examples/basic/responsive_duration.html).
