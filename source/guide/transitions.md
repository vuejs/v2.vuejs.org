title: Transition System
type: guide
order: 12
---

With Vue.js' transition system you can apply automatic transition effects when elements are inserted into or removed from the DOM. Vue.js will automatically add/remove CSS classes at appropriate times to trigger CSS transitions or animations for you, and you can also provide JavaScript hook functions to perform custom DOM manipulations during the transition.

With the directive `v-transition="my-transition"` applied, Vue will:

1. Try to find a JavaScript transition hooks object registered either through `Vue.transition(id, hooks)` or passed in with the `transitions` option, using the id `"my-transition"`. If it finds it, it will call the appropriate hooks at different stages of the transition.

2. Automatically sniff whether the target element has CSS transitions or CSS animations applied, and add/remove the CSS classes at the appropriate times.

3. If no JavaScript hooks are provided and no CSS transitions/animations are detected, the DOM operation (insertion/removal) is executed immediately on next frame.

<p class="tip">All Vue.js transitions are triggered only if the DOM manipulation was applied through Vue.js, either by a built-in directive, e.g. `v-if`, or by one of Vue's instance methods, e.g. `vm.$appendTo()`.</p>

## CSS Transitions

A typical CSS transition looks like this:

``` html
<div v-if="show" v-transition="expand">hello</div>
```

You also need to define CSS rules for `.expand-transition`, `.expand-enter` and `.expand-leave` classes:

``` css
.expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
```

In addition, you can provide JavaScript hooks:

``` js
Vue.transition('expand', {

  beforeEnter: function (el) {
    el.textContent = 'beforeEnter'
  },
  enter: function (el) {
    el.textContent = 'enter'
  },
  afterEnter: function (el) {
    el.textContent = 'afterEnter'
  },
  enterCancelled: function (el) {
    // handle cancellation
  },

  beforeLeave: function (el) {
    el.textContent = 'beforeLeave'
  },
  leave: function (el) {
    el.textContent = 'leave'
  },
  afterLeave: function (el) {
    el.textContent = 'afterLeave'
  },
  leaveCancelled: function (el) {
    // handle cancellation
  }
})
```

<div id="demo"><div v-if="show" v-transition="expand">hello</div><button v-on="click: show = !show">Toggle</button></div>

<style>
.expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
</style>

<script>
new Vue({
  el: '#demo',
  data: {
    show: true,
    transitionState: 'Idle'
  },
  transitions: {
    expand: {
      beforeEnter: function (el) {
        el.textContent = 'beforeEnter'
      },
      enter: function (el) {
        el.textContent = 'enter'
      },
      afterEnter: function (el) {
        el.textContent = 'afterEnter'
      },
      beforeLeave: function (el) {
        el.textContent = 'beforeLeave'
      },
      leave: function (el) {
        el.textContent = 'leave'
      },
      afterLeave: function (el) {
        el.textContent = 'afterLeave'
      }
    }
  }
})
</script>

The classes being added and toggled are based on the value of your `v-transition` directive. In the case of `v-transition="fade"`, the class `.fade-transition` will be always present, and the classes `.fade-enter` and `.fade-leave` will be toggled automatically at the right moments. When no value is provided they will default to `.v-transition`, `.v-enter` and `.v-leave`.

When the `show` property changes, Vue.js will insert or remove the `<p>` element accordingly, and apply transition classes as specified below:

- When `show` becomes false, Vue.js will:
  1. Call `beforeLeave` hook;
  2. Apply `v-leave` class to the element to trigger the transition;
  3. Call `leave` hook;
  4. Wait for the transition to finish; (listening to a `transitionend` event)
  5. Remove the element from the DOM and remove `v-leave` class.
  6. Call `afterLeave` hook.

- When `show` becomes true, Vue.js will:
  1. Call `beforeEnter` hook;
  2. Apply `v-enter` class to the element;
  3. Insert it into the DOM;
  4. Call `enter` hook;
  5. Force a CSS layout so `v-enter` is actually applied, then remove the `v-enter` class to trigger a transition back to the element's original state.
  6. Wait for the transition to finish;
  7. Call `afterEnter` hook.

In addition, if you remove an element when its enter transition is in progress, the `enterCancelled` hook will be called to give you the opportunity to clean up changes or timers created in `enter`. Vice-versa for leaving transitions.

All of the above hook functions are called with their `this` contexts set to the associated Vue instances. If the element is the root node of a Vue instance, that instance will be used as the context. Otherwise, the context will be the owner instance of the transition directive.

Finally, the `enter` and `leave` can optionally take a second callback argument. When you do so, you are indicating that you want to explicitly control when the transition should end, so instead of waiting for the CSS `transitionend` event, Vue.js will expect you to eventually call the callback to finish the transition. For example:

``` js
enter: function (el) {
  // no second argument, transition end
  // determined by CSS transitionend event
}
```

vs.

``` js
enter: function (el, done) {
  // with the second argument, the transition
  // will only end when `done` is called.
}
```

<p class="tip">When multiple elements are being transitioned together, Vue.js batches them and only applies one forced layout.</p>

## CSS Animations

CSS animations are applied in the same way with CSS transitions, the difference being that `v-enter` is not removed immediately after the element is inserted, but on an `animationend` callback.

**Example:** (omitting prefixed CSS rules here)

``` html
<span v-show="show" v-transition="bounce">Look at me!</span>
```

``` css
.bounce-enter {
  animation: bounce-in .5s;
}
.bounce-leave {
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

<div id="anim" class="demo"><span v-show="show" v-transition="bounce">Look at me!</span><br><button v-on="click: show = !show">Toggle</button></div>

<style>
  .bounce-enter {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave {
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

## JavaScript Only Transitions

You can also use just the JavaScript hooks without defining any CSS rules. When using JavaScript only transitions, the `done` callbacks are required for the `enter` and `leave` hooks, otherwise they will be called synchronously and the transition will finish immediately. The following example registers a custom JavaScript transition using jQuery:

``` js
Vue.transition('fade', {
  enter: function (el, done) {
    // element is already inserted into the DOM
    // call done when animation finishes.
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
  },
  enterCancelled: function (el) {
    $(el).stop()
  },
  leave: function (el, done) {
    // same as enter
    $(el).animate({ opacity: 0 }, 1000, done)
  },
  leaveCancelled: function (el) {
    $(el).stop()
  }
})
```

Then you can use it by providing the transition id to `v-transition`, same deal:

``` html
<p v-transition="fade"></p>
```

<p class="tip">If the element with a JavaScript-only transition happens to have other CSS transitions or animations applied, it may intefere with Vue's transition detection. In such cases you can add `css: false` to your transition object to explicitly disable Vue from sniffing CSS-related transitions.</p>

## Staggering Transitions

It's possible to create staggering transitions when using `v-transition` with `v-repeat`. You can do this either by adding a `stagger`, `enter-stagger` or `leave-stagger` attribute to your transitioned element:

``` html
<div v-repeat="list" v-transition stagger="100"></div>
```

Or, you can provide a `stagger`, `enterStagger` or `leaveStagger` hook for finer-grained control:

``` js
Vue.transition('stagger', {
  stagger: function (index) {
    // increase delay by 50ms for each transitioned item,
    // but limit max delay to 300ms
    return Math.min(300, index * 50)
  }
})
```

Example:

<iframe width="100%" height="200" style="margin-left:10px" src="http://jsfiddle.net/yyx990803/ujqrsu6w/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Next: [Building Larger Apps](/guide/application.html).
