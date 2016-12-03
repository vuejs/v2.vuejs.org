---
title: A clickoutside directive
type: cookbook
order: 1.2
---

## What we are building

Many UI elements require to have to clicks that happen outside of them. Common usecases are:

* Modals
* Dropdown menus
* Popovers
* Image Lightboxes

We will build a small [Custom Directive](https://vuejs.org/v2/guide/custom-directive.html) that we can use in any component that needs this behaviour. One such component is the [modal example](https://vuejs.org/v2/examples/modal.html) from the Vue.js Website, so we will use this as a base component to demonstrate the usage of our new custom directive.

The result will look like this:

``` html
<modal v-clickoutside="handler">
  <!--  
    "handler" should be a method in your component.
    It will be called when the user clicks outside of the modal window
   -->
</modal>
```

## Starting simple

The basic functionality is easy enough to achive. We register a new directive with Vue, and use
the `bind()` hook to register an event listener on the document:

```JavaScript
Vue.directive('clickoutside', {
  bind(el, binding) {
    const handler = binding.value // this gives us the "handler" function the component passed to the directive.
    document.addEventListener('click', function(event) {
      const target = event.target
      if (!el.contains(target) && el === target) {
        handler(event)
      }
    })
  }
})
```

So what happened here? When the directive is bound to the element we defined it on, its `bind()` hook is called.

In this hook, we add an Event listener to the document, which will call the handler of the component on click.

And to make sure that this handler is only called when the click actually happened outside of out element `el`, we first weither the event's target was `el` or one of its child nodes.

## Cleaning up after ourselves: Removing the Listener

Our directive does the job, but it still has a flaw: We have no mechanism in place to remove the listener again if `el` is removed from the DOM. This is problematic because the usual usecase of our directive on a `<modal>`will be to close a modal, for example, so the listener should be gone after that, too.

We can correct that with the `unbind()` hook, but there's a catch we have to work around: since directives don't have instances, we can't save the handler method on it. To solve this challenge, we have two possibilities: we can either cache the hander on the element, or we can use a ES6 [Map](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map). Using the latter is much cleaner, but requires a polyfill for older browsers. We will show you both ways here.

#### Saving the handler on the element

```JavaScript
Vue.directive('clickoutside', {
  bind(el, binding) {
    const handler = binding.value

    // create a named function for the handler
    function handler(event) {
      const target = event.target
      if (!el.contains(target) && el === target) {
        handler(event)
      }
    }

    // and save it in a property on the element
    el.__vueClickOutside__ = handler

    document.addEventListener('click', handler)
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

#### Using a Map() to cache the handler

```JavaScript

var handlerCache = new Map()

Vue.directive('clickoutside', {
  bind(el, binding) {
    // ...
    // el.__vueClickOutside__ = handler
    handlerCache.set(el, handler)
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
