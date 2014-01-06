title: Instance Methods
type: api
order: 4
---

## Data Changes

### vm.$watch( keypath, callback )

Watch a keypath on the vm's data object for changes and call the callback with the new value.

- **keypath** `String`
- **callback( newValue )** `Function`

### vm.$unwatch( keypath, [callback] )

Stop watching the given keypath. If a callback is given only that callback gets unwatched.

- **keypath** `String`
- **callback** `Function` *optional*

## Cross-ViewModel Events

> Each vm is also an event emitter. When you have multiple nested ViewModels, you can use the event system to communicate between them.

### vm.$emit( event, [args...] )

Emit an event from the current vm that propagates all the way up to its `$root`.

- **event** `String`
- **args...** *optional* additional arguments that will be passed to the callback.

### vm.$broadcast( event, [args...] )

Emit an event to all children vms of the current vm, which gets further broadcasted to their children all the way down.

- **event** `String`
- **args...** *optional* additional arguments that will be passed to the callback.

### vm.$on( event, callback )

Listen for an event on the current vm.

- **event** `String`
- **callback** `Function`

### vm.$off( [event, callback] )

If no arguments are given, stop listening for all events; If only the event is given, remove all callbacks for that event; If both event and callback are given, remove that specific callback only.

- **event** `String` *optional*
- **callback** `Function` *optional*

## DOM Manipulation

> All vm DOM manipulation methods work like their jQuery counterparts - except they also trigger vue.js transitions if there are any declared on vm's `$el`. For more details on transitions see [Using Transition Effects](/guide/transitions.html).

### vm.$appendTo( element | selector )

Append the vm's `$el` to target element. The argument can be either an element or a querySelector string.

- **element** `HTMLElement` | **selector** `String`

### vm.$before( element | selector )

Insert the vm's `$el` before target element.

- **element** `HTMLElement` | **selector** `String`

### vm.$after( element | selector )

Insert the vm's `$el` after target element.

- **element** `HTMLElement` | **selector** `String`

### vm.$remove()

Remove the vm's `$el` from the DOM.

## Misc

### vm.$destroy()

Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives and remove its `$el` from the DOM.