---
title: A clickoutside directive
type: cookbook
order: 2.1
---

## What we are building

Many UI elements need to react to clicks that happen *outside* of them. Common use cases are:

* Modals
* Dropdown menus
* Popovers
* Image Lightboxes

We will build a small [Custom Directive](https://vuejs.org/v2/guide/custom-directive.html) that we can use in any component in need of this behaviour. One such component is the [modal example](https://vuejs.org/v2/examples/modal.html) from the Vue.js website, so we will use this as a base component to demonstrate the usage of our new directive.

> If you haven't already read the our Vue.js Guide about custom directives, we recommend you change this now. [Click here](../guide/custom-directive.html) to got to the relevant section in the guide.

Ready? Great. So this is what the endresult of our efforts will look like:

```html
<modal v-clickoutside="handler">
  <!--  
    "handler" should be a method in your component.
    It will be called when the user clicks outside of the modal window
   -->
</modal>
```

## bind(): Adding the desired behavior

The basic functionality is easy enough to achive. We register a new directive with Vue, and use the `bind()` hook to register an event listener on the document:

```javascript
Vue.directive('clickoutside', {
  bind(el, binding) {
    // get the "handler" function that gets passed to the directive.
    const handler = binding.value
    // some error checking
    if (typof handler !== 'functionality') {
      console.warn('[vue-clickoutside]: bind value must be a function.')
      return
    }

    setTimeout(function() {
      document.addEventListener('click', function(event) {
        const target = event.target
        // check weither the click happened outside of el
        if (!el.contains(target) && el !== target) {
          handler(event)
        }
      })
    }, 0)
  }
})
```

So what happened here?

* When the directive is bound to the element, its `bind()` hook is called.
* In this hook, we add an Event listener to the document, which will call the handler of the component for *any* click happening on our page.
* We use `setTimeout()` because if we didn't, then a `click` event from a button that is responsible to make our modal appear could trigger our directive's handler immediatly, and we don't want that, of course.
* And to make sure that this handler is only called when the click actually happened outside of out element `el`, we first check that the event's target wasn't `el` or one of its child nodes.

## unbind(): Cleaning up after ourselves

Our directive does the job, but it still has a flaw: We have no mechanism in place to remove the listener again if `el` is removed from the DOM. This is problematic because the usual usecase of our directive on a `<modal>`will be to close a modal, for example, so our directive will be gone after this too - and so should the listener.

We can correct that with the `unbind()` hook, but there's a catch we have to work around: since directives don't have instances, we can't save the handler method on it. To solve this challenge, we have two possibilities: we can either cache the hander on the element, or we can use a ES6 [Map](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map). Using the latter is much cleaner because we don't have to touch the element, but requires a polyfill for older browsers. We will show you both ways here.

#### Saving the handler on the element

```JavaScript
Vue.directive('clickoutside', {
  bind(el, binding) {
    const handler = binding.value

    // create a named function for the handler
    function wrappedHandler(event) {
      const target = event.target
      if (!el.contains(target) && el !== target) {
        handler(event)
      }
    }

    // and save it in a property on the element
    el.__vueClickOutside__ = wrappedHandler

    setTimeout(function() {
      document.addEventListener('click', wrappedHandler)
    }, 0)
  },

  unbind(el) {

    if (el.__vueClickOutside__) {
      // retrieve the handler from the element
      const handler = el.__vueClickOutside__
      // and remove it from the document's click listeners
      document.removeEventListener('click', handler)
    }

  }
})
```

#### Using a ES6 Map to cache the handler

```JavaScript

// we create the map outside of the directive,
// because we only need one.
// We don't have to create one for each instance of our directive.
var handlerCache = new Map()

Vue.directive('clickoutside', {
  bind(el, binding) {
    // ...
    // el.__vueClickOutside__ = wrappedHandler
    handlerCache.set(el, wrappedHandler)
    // ...
  },
  unbind(el) {

    if (handlerCache.has(el)) {
      // get the handler from the Map
      const hander = handlerCache.get(el)
      document.removeEventListener('click', handler)
    }
    // ...
  }
})
```
## Argument: Using different event types.

So far, your directive will only listen for `click` events. But there might be situations where we want to listen to other events, like `doubleclick` or `mousedown`.

For this, we can use an argument on our directive. This is what this looks like in our HTML:
```html
<modal v-clickoutside:dblclick="handler">

</modal>
```

To use the argument in our directive, we only have to change the first argument of our `addEventListener()` and `removeEventListener()` calls to use the argument, if present:

```JavaScript
bind(el, binding) {
  // ...
  const eventName = binding.arg || 'click'
  document.addEventListener(eventName, /*...*/)
}

unbind(el, binding) {
  // ...
  const eventName = binding.arg || 'click'
  document.removeEventListener(eventName, /*...*/)
}
```

## The Final Result

<iframe width="100%" height="500" src="https://jsfiddle.net/Linusborg/g5sh3rcu/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
<script async src="//"></script>

## Limitations

#### Doesn't work with v-show

`v-show` does not remove the element from the DOM, so `unbind()` is not triggered when `v-show` hides an element. This means that our clickoutside event is still active even if your modal is not visible, and would still fire for each click outside of the modal (which now, is basically *everywhere*)

#### No inline expressions

We can't use an inline expression instead of a handler function. The following will **not** work, because it will be run immediately, not on `click`:

```html
<modal v-clickoutside="showModal= false">

</modal>
```
