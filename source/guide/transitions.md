title: Adding Transition Effects
type: guide
order: 9
---

With Vue.js' transition hooks you can apply automatic transition effects when elements are inserted into or removed from the DOM. There are three options to implement transitions with Vue.js: CSS transitions, CSS animations, and JavaScript functions.

<p class="tip">All Vue.js transitions are triggered only if the DOM manipulation was applied by Vue.js, either through built-in directives, e.g. `v-if`, or through ViewModel instance methods, e.g. `vm.$appendTo()`.</p>

## CSS Transitions

To enable CSS transitions on an element, simply give it an empty `v-transition` directive:

``` html
<p class="msg" v-if="show" v-transition>Hello!</p>
```

You will also need to provide CSS rules for `v-enter` and `v-leave` classes (the class names can be configured with `Vue.config()`):

``` css
.msg {
    transition: all .3s ease;
    height: 30px;
    padding: 10px;
    background-color: #eee;
    overflow: hidden;
}
.msg.v-enter, .msg.v-leave {
    height: 0;
    padding: 0 10px;
    opacity: 0;
}
```

<div id="demo"><p class="msg" v-if="show" v-transition>Hello!</p><button v-on="click: show = !show">Toggle</button></div>

<style>
.msg {
    transition: all .5s ease;
    height: 30px;
    background-color: #eee;
    overflow: hidden;
    padding: 10px;
    margin: 0 !important;
}
.msg.v-enter, .msg.v-leave {
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

Now when the `show` property changes, Vue.js will insert or remove the `<p>` element accordingly, and apply transition classes as specified below:

- When `show` becomes false, Vue.js will:
    1. Apply `v-leave` class to the element to trigger the transition;
    2. Wait for the transition to finish; (listening to a `transitionend` event)
    3. Remove the element from the DOM and remove `v-leave` class.

- When `show` becomes true, Vue.js will:
    1. Apply `v-enter` class to the element;
    2. Insert it into the DOM;
    3. Force a CSS layout so `v-enter` is actually applied;
    4. Remove the `v-enter` class to trigger a transition back to the elements original state.

<p class="tip">It is important to ensure that the target element's CSS transition rules are properly set and it will fire a `transitionend` event. Otherwise Vue.js will not be able to determine when the transition is finished.</p>

## CSS Animations

CSS animations are applied in a similar fashion with transitions, but using the `v-animation` directive. The difference is that `v-enter` is not removed immediately after the element is inserted, but on an `animationend` callback.

**Example:** (omitting prefixed CSS rules here)

``` html
<p class="animated" v-if="show" v-animation>Look at me!</p>
```

``` css
.animated {
    display: inline-block;
}

.animated.v-enter {
    animation: fadein .5s;
}

.animated.v-leave {
    animation: fadeout .5s;
}

@keyframes fadein {
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

@keyframes fadeout {
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

<div id="anim" class="demo"><span class="animated" v-if="show" v-animation>Look at me!</span><br><button v-on="click: show = !show">Toggle</button></div>

<style>
    .animated {
        display: inline-block;
    }
    .animated.v-enter {
        -webkit-animation: fadein .5s;
        animation: fadein .5s;
    }
    .animated.v-leave {
        -webkit-animation: fadeout .5s;
        animation: fadeout .5s;
    }
    @keyframes fadein {
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
    @keyframes fadeout {
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
    @-webkit-keyframes fadein {
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
    @-webkit-keyframes fadeout {
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

Vue.js provides a way to call arbitrary JavaScript functions during element insertion/removal. To do that you first need to register your effect functions:

``` js
Vue.effect('my-effect', {
    enter: function (el, insert, timeout) {
        // insert() will actually insert the element
    },
    leave: function (el, remove, timeout) {
        // remove() will actually remove the element
    }
})
```

The third argument, `timeout`, is a wrapped version of `setTimeout`. You should use it in place of `setTimeout` so that when an effect is cancelled, its associated timers can be cleared.

Then you can use it by providing the effect id to `v-effect`:

``` html
<p v-effect="my-effect"></p>
```

Next: [Composing ViewModels](/guide/composition.html).