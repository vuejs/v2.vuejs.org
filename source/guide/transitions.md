title: Transitions
type: guide
order: 12
---

With Vue.js' transition system you can apply automatic transition effects when elements are inserted into or removed from the DOM. There are two options to do so: defining CSS classes with transitions/animations, or by registering a definition object containing custom JavaScript hook functions.

With the directive `v-transition="my-transition"` applied, Vue will:

1. Try to find a JavaScript transtion definition registered either through `Vue.transition(id, def)` or passed in with the `transitions` option, with the id `"my-transition"`. If it finds it, it will use that definition object to perform the custom JavaScript based transition.

2. If no custom JavaScript transition is found, it will automatically sniff whether the target element has CSS transitions or CSS animations applied, and add/remove the CSS classes at the appropriate times.

3. If no transitions/animations are detected, the DOM manipulation is executed on next frame.

<p class="tip">All Vue.js transitions are triggered only if the DOM manipulation was applied by Vue.js, either through built-in directives, e.g. `v-if`, or through Vue instance methods, e.g. `vm.$appendTo()`.</p>

## CSS Transitions

A typical CSS transition looks like this:

``` html
<p class="msg" v-if="show" v-transition="expand">Hello!</p>
```

You also need to define CSS rules for `.expand-enter` and `.expand-leave` classes:

``` css
.msg {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
.msg.expand-enter, .msg.expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
```

<div id="demo"><p class="msg" v-if="show" v-transition="expand">Hello!</p><button v-on="click: show = !show">Toggle</button></div>

<style>
.msg {
  transition: all .5s ease;
  height: 30px;
  background-color: #eee;
  overflow: hidden;
  padding: 10px;
  margin: 0 !important;
}
.msg.expand-enter, .msg.expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
</style>

<script>
new Vue({
  el: '#demo',
  data: { show: true }
})
</script>

The classes being toggled are based on the value of your `v-transition` directive. In the case of `v-transition="fade"`, the classes being toggled will be `.fade-enter` and `.fade-leave`. When no value is provided they will default to `.v-enter` and `.v-leave`.

When the `show` property changes, Vue.js will insert or remove the `<p>` element accordingly, and apply transition classes as specified below:

- When `show` becomes false, Vue.js will:
  1. Apply `v-leave` class to the element to trigger the transition;
  2. Wait for the transition to finish; (listening to a `transitionend` event)
  3. Remove the element from the DOM and remove `v-leave` class.

- When `show` becomes true, Vue.js will:
  1. Apply `v-enter` class to the element;
  2. Insert it into the DOM;
  3. Force a CSS layout so `v-enter` is actually applied;
  4. Remove the `v-enter` class to trigger a transition back to the element's original state.

<p class="tip">When multiple elements are being transitioned together, Vue.js batches them and only applies one forced layout.</p>

## CSS Animations

CSS animations are applied in the same way with CSS transitions, the difference being that `v-enter` is not removed immediately after the element is inserted, but on an `animationend` callback.

**Example:** (omitting prefixed CSS rules here)

``` html
<p class="animated" v-if="show" v-transition="bounce">Look at me!</p>
```

``` css
.animated {
  display: inline-block;
}
.animated.bounce-enter {
  animation: bounce-in .5s;
}
.animated.bounce-leave {
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

<div id="anim" class="demo"><span class="animated" v-if="show" v-transition="bounce">Look at me!</span><br><button v-on="click: show = !show">Toggle</button></div>

<style>
  .animated {
    display: inline-block;
  }
  .animated.bounce-enter {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .animated.bounce-leave {
    -webkit-animation: bounce-out .5s;
    animation: bounce-out .5s;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    50% {
      transform: scale(1.5);
      -webkit-transform: scale(1.5);
    }
    100% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
  @keyframes bounce-out {
    0% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
    50% {
      transform: scale(1.5);
      -webkit-transform: scale(1.5);
    }
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-out {
    0% {
      -webkit-transform: scale(1);
    }
    50% {
      -webkit-transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(0);
    }
  }
</style>

<script>
new Vue({
  el: '#anim',
  data: { show: true }
})
</script>

## JavaScript Functions

The following example registers a custom JavaScript transition definition using jQuery:

``` js
Vue.transition('fade', {
  beforeEnter: function (el) {
    // a synchronous function called right before the
    // element is inserted into the document.
    // you can do some pre-styling here to avoid
    // FOC (flash of content).
  },
  enter: function (el, done) {
    // element is already inserted into the DOM
    // call done when animation finishes.
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
    // optionally return a "cancel" function
    // to clean up if the animation is cancelled
    return function () {
      $(el).stop()
    }
  },
  leave: function (el, done) {
    // same as enter
    $(el).animate({ opacity: 0 }, 1000, done)
    return function () {
      $(el).stop()
    }
  }
})
```

Then you can use it by providing the transition id to `v-transition`. Note this has higher priority than CSS transitions.

``` html
<p v-transition="fade"></p>
```

Next: [Building Larger Apps](/guide/application.html).