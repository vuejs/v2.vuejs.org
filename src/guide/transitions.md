---
title: Transitions and Animations
type: guide
order: 11
---

## Overview

Vue provides a variety of ways to apply transition effects when items are inserted, updated, or removed from the DOM. This includes tools to:

- automatically apply classes for CSS transitions and animations
- integrate 3rd-party CSS animation libraries, such as Animate.css
- use JavaScript to directly manipulate the DOM or component state
- integrate 3rd-party JavaScript animation libraries, such as Tween.js or Velocity.js

We'll also demonstrate how you can combine transitions with some of Vue's other features for fine-grained control in complex scenarios and edge cases.

## Entering/Leaving Transitions

Vue provides `transition` directive, allowing you to easily animate entering/leaving transitions for:

- `v-if`
- `v-show`
- `v-for` (triggered for insertion and removal only, for animating changes of order
  [use vue-animated-list plugin](https://github.com/vuejs/vue-animated-list))
- dynamic components (introduced in the [next section](components.html#Dynamic-Components))
- component root nodes

To use transitions on an element/component, a `transition` attribute must be added:

``` html
<div v-if="shouldRender" transition></div>
```

This defaults to the transition name `v`, but a custom transition name may be specified by providing a value:

``` html
<div v-if="shouldRender" transition="my-transition"></div>
```

When an element with `transition` is inserted or removed, this is what happens:

1. If a transition name is provided, try to find JavaScript transition hooks registered either through `Vue.transition(name, hooks)` or passed in with the `transitions` option. If one is found, it will call the appropriate hooks at different stages of the transition.

2. Automatically sniff whether the target element has CSS transitions or CSS animations applied, and add/remove the CSS classes at the appropriate times.

3. If no JavaScript hooks are provided and no CSS transitions/animations are detected, the DOM operation (insertion/removal) is executed immediately on next frame.

### Transitioning CSS

There are four classes applied for enter/leave transitions.

1. `v-enter`: Starting state for enter. Applied before element is inserted, removed after 1 tick.
2. `v-enter-active`: Active and ending state for enter. Applied before element is inserted, removed when transition/animation finishes.
3. `v-leave`: Starting state for leave. Applied when leave transition is triggered, removed after 1 tick.
4. `v-leave-active`: Active and ending state for leave. Applied when leave transition is triggered, removed when the transition/animation finishes.


For each of these classes, the `v` prefix is the name of the transition. If you use `transition="my-transition"` for example, then the `v-enter` class would instead be `my-transition-enter`.

`v-enter-active` and `v-leave-active` give you the ability to specify different easing curves for enter/leave transitions.

#### CSS Transitions

One of the most common transition types uses CSS transitions. Here's a simple example:

``` html
<div id="example-1">
  <button @click="showHello = !showHello">
    Toggle render
  </button>
  <p v-if="showHello" transition="example-transiton-1">hello</p>
</div>
```

``` js
new Vue({
  el: '#example-1',
  data: {
    showHello: true
  }
})
```

``` css
/* enter and leave animations can use different */
/* durations and timing functions               */
.example-transiton-1-enter-active {
  transition: all .3s ease;
}
.example-transiton-1-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.example-transiton-1-enter, .example-transiton-1-leave-active {
  padding-left: 10px;
  opacity: 0;
}
```

{% raw %}
<div id="example-1" class="demo">
  <button @click="showHello = !showHello">
    Toggle render
  </button>
  <p v-if="showHello" transition="example-transiton-1">hello</p>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    showHello: true
  }
})
</script>
<style>
.example-transiton-1-enter-active {
  transition: all .3s ease;
}
.example-transiton-1-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.example-transiton-1-enter, .example-transiton-1-leave-active {
  padding-left: 10px;
  opacity: 0;
}
</style>
{% endraw %}

#### CSS Animations

CSS animations are applied in the same way as CSS transitions, the difference being that `v-enter` is not removed immediately after the element is inserted, but on an `animationend` event.

Here's an example, omitting prefixed CSS rules for the sake of brevity:

``` html
<div id="example-2">
  <button @click="shouldShow = !shouldShow">Toggle show</button>
  <p v-show="shouldShow" transition="bounce">Look at me!</p>
</div>
```

``` js
new Vue({
  el: '#example-2',
  data: {
    shouldShow: true
  }
})
```

``` css
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-out .5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}
```

{% raw %}
<div id="example-2" class="demo">
  <button @click="shouldShow = !shouldShow">Toggle show</button>
  <p v-show="shouldShow" transition="bounce">Look at me!</p>
</div>

<style>
  .bounce-enter-active {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    -webkit-animation: bounce-out .5s;
    animation: bounce-out .5s;
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @keyframes bounce-out {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-out {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }
</style>
<script>
new Vue({
  el: '#example-2',
  data: {
    shouldShow: true
  }
})
</script>
{% endraw %}

#### Custom Transition Classes

You can also specify custom transition classes by registering a transition with `Vue.transition` and providing the following options:

- `enterClass`
- `enterActiveClass`
- `leaveClass`
- `leaveActiveClass`

These will override the conventional class names. This is especially useful when you want to combine Vue's transition system with an existing CSS animation library, such as [Animate.css](https://daneden.github.io/animate.css/).

Here's an example:

``` html
<link href="https://npmcdn.com/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="shouldRender = !shouldRender">
    Toggle render
  </button>
  <p v-if="shouldRender" transition="example-transition-2">hello</p>
</div>
```

``` js
Vue.transition('example-transition-2', {
  enterActiveClass: 'animated tada',
  leaveActiveClass: 'animated bounceOutRight'
})

new Vue({
  el: '#example-3',
  data: {
    shouldRender: true
  }
})
```

{% raw %}
<link href="https://npmcdn.com/animate.css@3.5.1" rel="stylesheet" type="text/css">
<div id="example-3" class="demo">
  <button @click="shouldRender = !shouldRender">
    Toggle render
  </button>
  <p v-show="shouldRender" transition="example-transition-2">hello</p>
</div>
<script>
Vue.transition('example-transition-2', {
  enterActiveClass: 'animated tada',
  leaveActiveClass: 'animated bounceOutRight'
})
new Vue({
  el: '#example-3',
  data: {
    shouldRender: true
  }
})
</script>
{% endraw %}

#### Using Transitions and Animations Together

Vue needs to attach event listeners in order to know when a transition has ended. It can either be `transitionend` or `animationend`, depending on the type of CSS rules applied. If you are only using one or the other, Vue can automatically detect the correct type. However, in some cases you may want to have both on the same element, for example having a CSS animation triggered by Vue, along with a CSS transition effect on hover. In these cases, you will have to explicitly declare the type you want Vue to care about:

``` js
Vue.transition('my-transition-name', {
  // Vue will now only care about `animationend` events
  // for this transition
  type: 'animation'
})
```

### JavaScript Hooks

You can also define JavaScript hooks in transition options:

``` js
beforeEnter: function (el) {
  // ...
},
// the done callback is optional when
// used in combination with CSS
onEnter: function (el, done) {
  // ...
  done()
},
afterEnter: function (el) {
  // .
},
enterCancelled: function (el) {
  // ...
},

beforeLeave: function (el) {
  // ...
},
// the done callback is optional when
// used in combination with CSS
onLeave: function (el, done) {
  // ...
  done()
},
afterLeave: function (el) {
  // ...
},
// leaveCancelled only available with v-show
leaveCancelled: function (el) {
  // ...
}
```

These hooks can be used in combination with CSS transitions/animations or on their own.

<p class="note">When using JavaScript-only transitions, **the `done` callbacks are required for the `onEnter` and `onLeave` hooks**. Otherwise, they will be called synchronously and the transition will finish immediately.</p>

It's also a good idea to explicitly declare `css: false` for JavaScript-only transitions so that Vue can skip the CSS detection. This also prevents CSS rules from accidentally interfering with the transition.

Now let's dive into an example. Here's a simple, JavaScript transition using Velocity.js:

``` html
<!--
Velocity works very much like jQuery.animate and is
a great option for JavaScript animations
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="example-4">
  <button @click="shouldRender = !shouldRender">
    Toggle
  </button>
  <p v-if="shouldRender" transition="example-transition-4">
    Demo
  </p>
</div>
```

``` js
Vue.transition('example-transition-4', {
  beforeEnter: function (el) {
    el.style.opacity = 0
  },
  onEnter: function (el, done) {
    Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
    Velocity(el, { fontSize: '1em' }, { complete: done })
  },
  onLeave: function (el, done) {
    Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
    Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
    Velocity(el, {
      rotateZ: '45deg',
      translateY: '30px',
      translateX: '30px',
      opacity: 0
    }, { complete: done })
  }
})

new Vue({
  el: '#example-4',
  data: {
    shouldRender: true
  }
})
```

``` css
.example-transition-4-enter-active, .example-transition-4-leave-active {
  transform-origin: left;
}
```

{% raw %}
<div id="example-4" class="demo">
  <button @click="shouldRender = !shouldRender">
    Toggle
  </button>
  <p v-if="shouldRender" transition="example-transition-4">Demo</p>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script>
Vue.transition('example-transition-4', {
  beforeEnter: function (el) {
    el.style.opacity = 0
  },
  onEnter: function (el, done) {
    Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
    Velocity(el, { fontSize: '1em' }, { complete: done })
  },
  onLeave: function (el, done) {
    Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
    Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
    Velocity(el, {
      rotateZ: '45deg',
      translateY: '30px',
      translateX: '30px',
      opacity: 0
    }, { complete: done })
  }
})
new Vue({
  el: '#example-4',
  data: {
    shouldRender: true
  }
})
</script>
<style>
.example-transition-4-enter-active, .example-transition-4-leave-active {
  transform-origin: left;
}
</style>
{% endraw %}

#### Staggering Transitions

By communicating with JavaScript transitions through data attributes, it's also possible to stagger transitions in a `v-for` list:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="example-5">
  <input v-model="query">
  <ul>
    <li
      v-for="(item, index) in computedList"
      transition="staggered-fade"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </ul>
</div>
```

``` js
Vue.transition('staggered-fade', {
  css: false,
  beforeEnter: function (el) {
    el.style.opacity = 0
    el.style.height = 0
  },
  onEnter: function (el, done) {
    var delay = el.dataset.index * 50
    setTimeout(function () {
      Velocity(
        el,
        { opacity: 1, height: '1.6em' },
        { complete: done }
      )
    }, delay)
  },
  onLeave: function (el, done) {
    var delay = el.dataset.index * 150
    setTimeout(function () {
      Velocity(
        el,
        { opacity: 0, height: 0 },
        { complete: done }
      )
    }, delay)
  }
})

new Vue({
  el: '#example-5',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  }
})
```

{% raw %}
<div id="example-5" class="demo">
  <input v-model="query">
  <ul>
    <li
      v-for="(item, index) in computedList"
      transition="staggered-fade"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </ul>
</div>
<script>
Vue.transition('staggered-fade', {
  css: false,
  beforeEnter: function (el) {
    el.style.opacity = 0
    el.style.height = 0
  },
  onEnter: function (el, done) {
    var delay = el.dataset.index * 50
    setTimeout(function () {
      Velocity(
        el,
        { opacity: 1, height: '1.6em' },
        { complete: done }
      )
    }, delay)
  },
  onLeave: function (el, done) {
    var delay = el.dataset.index * 150
    setTimeout(function () {
      Velocity(
        el,
        { opacity: 0, height: 0 },
        { complete: done }
      )
    }, delay)
  }
})
new Vue({
  el: '#example-5',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  }
})
</script>
{% endraw %}

### Alternative Transition Definitions

Up until now, all we've seen are global transition definitions via `Vue.transition`. There are also a few other ways of defining transitions that can be helpful in specific circumstances.

- Instance/Component-Scoped Transition
- Dynamic Transition Name
- Dynamic Inline Transition Object

#### Instance/Component-Scoped Transition

For transitions very specific to a single instance/component, you can define them in a `transitions` option on the instance/component:

``` js
new Vue({
  // ...
  transitions: {
    'my-transition-name': {
      // transition options
    }
  }
})
```

#### Dynamic Transition Name

You can dynamically assign transitions binding:

```html
<div v-if="shouldRender" v-bind:transition="transitionName">hello</div>
```

```js
new Vue({
  el: '...',
  data: {
    shouldRender: false,
    transitionName: 'my-transition-name'
  }
})
```

#### Dynamic Inline Transition Object

You can also dynamically assign individual transition options by binding `transition` to an object:

``` html
<p v-if="shouldRender" v-bind:transition="transitionObject"></p>
```

``` js
new Vue({
  // ...
  data: {
    transitionObject: {
      // transition options
    }
  }
})
```

If you provide a `name` option for your dynamic transition object, that name will not only be used to prefix CSS classes, but can also be used to extend an existing transition:

``` html
<p v-if="shouldRender" v-bind:transition="transitionObject"></p>
```

``` js
new Vue({
  // ...
  data: {
    transitionObject: {
      name: 'my-transition-name',
      // overriding transition options
    },
    transitions: {
      'my-transition-name': {
        // original transition options
      }
    }
  }
})
```

## State Transitions

Vue's transition system offers many simple ways to animate entering and leaving, but what about when the data behind your view simply changes? This data is often used to display:

- numbers and calculations
- the positions of SVG nodes
- the sizes and other properties of elements
- colors displayed

All of these are either already stored as raw numbers or can be converted into numbers. Once we do that, we can animate these state changes using 3rd-party libraries to tween state, in combination with Vue's reactivity and component systems.

### Animating State with Watchers

With watchers, we can animate changes of any numerical property into another property. That may sound complicated in the abstract, so let's dive into an example using Tween.js:

``` html
<script src="https://npmcdn.com/tween.js@16.3.4"></script>

<div id="example-6">
  <input v-model.number="number" type="number">
  <p>{{ animatedNumber }}</p>
</div>
```

``` js
new Vue({
  el: '#example-6',
  data: {
    number: 0,
    animatedNumber: 0
  },
  watch: {
    number: function(newValue, oldValue) {
      var vm = this
      function animate (time) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 500)
        .onUpdate(function () {
          vm.animatedNumber = this.tweeningNumber.toFixed(0)
        })
        .start()
      animate()
    }
  }
})
```

{% raw %}
<script src="https://npmcdn.com/tween.js@16.3.4"></script>
<div id="example-6" class="demo">
  <input v-model.number="number" type="number">
  <p>{{ animatedNumber }}</p>
</div>
<script>
new Vue({
  el: '#example-6',
  data: {
    number: 0,
    animatedNumber: 0
  },
  watch: {
    number: function(newValue, oldValue) {
      var vm = this
      function animate (time) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 500)
        .onUpdate(function () {
          vm.animatedNumber = this.tweeningNumber.toFixed(0)
        })
        .start()
      animate()
    }
  }
})
</script>
{% endraw %}

When you update the number, the change is animated below the input. This makes for a nice demo, but what about something that isn't directly stored as a number, like any valid CSS color for example? Here's how we could accomplish this with the addition of Color.js:

``` html
<script src="https://npmcdn.com/tween.js@16.3.4"></script>
<script src="https://npmcdn.com/color-js@1.0.3/color.js"></script>

<div id="example-7">
  <input
    v-model="colorQuery"
    v-on:keyup.enter="updateColor"
    placeholder="Enter a color"
  >
  <button v-on:click="updateColor">Update</button>
  <p>Preview:</p>
  <span
    v-bind:style="{ backgroundColor: tweenedCSSColor }"
    class="example-7-color-preview"
  ></span>
  <p>{{ tweenedCSSColor }}</p>
</div>
```

``` js
var Color = net.brehaut.Color

new Vue({
  el: '#example-7',
  data: {
    colorQuery: '',
    color: {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1
    },
    tweenedColor: {}
  },
  created: function () {
    this.tweenedColor = Object.assign({}, this.color)
  },
  watch: {
    color: function () {
      function animate (time) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      new TWEEN.Tween(this.tweenedColor)
        .to(this.color, 750)
        .start()
      animate()
    }
  },
  computed: {
    tweenedCSSColor: function () {
      return new Color({
        red: this.tweenedColor.red,
        green: this.tweenedColor.green,
        blue: this.tweenedColor.blue,
        alpha: this.tweenedColor.alpha
      }).toCSS()
    }
  },
  methods: {
    updateColor: function () {
      this.color = new Color(this.colorQuery).toRGB()
      this.colorQuery = ''
    }
  }
})
```

``` css
.example-7-color-preview {
  display: inline-block;
  width: 50px;
  height: 50px;
}
```

{% raw %}
<script src="https://npmcdn.com/tween.js@16.3.4"></script>
<script src="https://npmcdn.com/color-js@1.0.3/color.js"></script>
<div id="example-7" class="demo">
  <input
    v-model="colorQuery"
    v-on:keyup.enter="updateColor"
    placeholder="Enter a color"
  >
  <button v-on:click="updateColor">Update</button>
  <p>Preview:</p>
  <span
    v-bind:style="{ backgroundColor: tweenedCSSColor }"
    class="example-7-color-preview"
  ></span>
  <p>{{ tweenedCSSColor }}</p>
</div>
<script>
var Color = net.brehaut.Color
new Vue({
  el: '#example-7',
  data: {
    colorQuery: '',
    color: {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1
    },
    tweenedColor: {}
  },
  created: function () {
    this.tweenedColor = Object.assign({}, this.color)
  },
  watch: {
    color: function () {
      function animate (time) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      new TWEEN.Tween(this.tweenedColor)
        .to(this.color, 750)
        .start()
      animate()
    }
  },
  computed: {
    tweenedCSSColor: function () {
      return new Color({
        red: this.tweenedColor.red,
        green: this.tweenedColor.green,
        blue: this.tweenedColor.blue,
        alpha: this.tweenedColor.alpha
      }).toCSS()
    }
  },
  methods: {
    updateColor: function () {
      this.color = new Color(this.colorQuery).toRGB()
      this.colorQuery = ''
    }
  }
})
</script>
<style>
.example-7-color-preview {
  display: inline-block;
  width: 50px;
  height: 50px;
}
</style>
{% endraw %}

### Organizing Transitions into Components

Managing many state transitions can quickly increase the complexity of a Vue instance or component. Fortunately, many animations can be extracted out into dedicated child components. Let's do this with the animated integer from our earlier example:

``` html
<script src="https://npmcdn.com/tween.js@16.3.4"></script>

<div id="example-8">
  <input v-model.number="firstNumber" type="number"> +
  <input v-model.number="secondNumber" type="number"> =
  {{ result }}
  <p>
    <animated-integer v-bind:value="firstNumber"></animated-integer> +
    <animated-integer v-bind:value="secondNumber"></animated-integer> =
    <animated-integer v-bind:value="result"></animated-integer>
  </p>
</div>
```

``` js
// This complex tweening logic can now be reused between
// any integers we may wish to animate in our application.
// Components also offer a clean interface for configuring
// more dynamic transitions and complex transition
// strategies.
Vue.component('animated-integer', {
  template: '<span>{{ tweeningValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      var vm = this
      function animate (time) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      new TWEEN.Tween({ tweeningValue: startValue })
        .to({ tweeningValue: endValue }, 500)
        .onUpdate(function () {
          vm.tweeningValue = this.tweeningValue.toFixed(0)
        })
        .start()
      animate()
    }
  }
})

// All complexity has now been removed from the main Vue instance!
new Vue({
  el: '#example-8',
  data: {
    firstNumber: 23,
    secondNumber: 17
  },
  computed: {
    result: function () {
      return this.firstNumber + this.secondNumber
    }
  }
})
```

{% raw %}
<script src="https://npmcdn.com/tween.js@16.3.4"></script>
<div id="example-8" class="demo">
  <input v-model.number="firstNumber" type="number"> +
  <input v-model.number="secondNumber" type="number"> =
  {{ result }}
  <p>
    <animated-integer v-bind:value="firstNumber"></animated-integer> +
    <animated-integer v-bind:value="secondNumber"></animated-integer> =
    <animated-integer v-bind:value="result"></animated-integer>
  </p>
</div>
<script>
Vue.component('animated-integer', {
  template: '<span>{{ tweeningValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      var vm = this
      function animate (time) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      new TWEEN.Tween({ tweeningValue: startValue })
        .to({ tweeningValue: endValue }, 500)
        .onUpdate(function () {
          vm.tweeningValue = this.tweeningValue.toFixed(0)
        })
        .start()
      animate()
    }
  }
})
new Vue({
  el: '#example-8',
  data: {
    firstNumber: 23,
    secondNumber: 17
  },
  computed: {
    result: function () {
      return this.firstNumber + this.secondNumber
    }
  }
})
</script>
{% endraw %}

Within child components, we can use any combination of transition strategies that have been covered on this page. Together, there are very few limits to what can be accomplished.
