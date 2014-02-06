title: Adding Transition Effects
type: guide
order: 9
---

# {{title}}

You can add transition effects when elements are inserted into or removed from the DOM using the `v-transition` directive. There are two types of transitions: CSS-based and JavaScript-based. All Vue.js transitions are triggered only if the DOM manipulation was applied by Vue.js, either through built-in directives, e.g. `v-if`, or through ViewModel instance methods, e.g. `vm.$appendTo()`.

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

<script src="/js/vue.min.js"></script>
<script>
    var demo = new Vue({
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

## JavaScript Transitions

Vue.js provides a way to call arbitrary JavaScript functions during element insertion/removal. To do that you first need to register your transition functions:

``` js
Vue.transition('my-transition', {
    enter: function (el, insert) {
        // insert() will actually insert the element
    },
    leave: function (el, remove) {
        // remove() will actually remove the element
    }
})
```

Then you can use it by providing the transition id to `v-transition`:

``` html
<p v-transition="my-transition"></p>
```

Next: [Composing ViewModels](/guide/composition.html).