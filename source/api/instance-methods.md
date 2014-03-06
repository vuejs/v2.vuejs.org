title: Instance Methods
type: api
order: 4
---

## Data

> You can observe data changes on a ViewModel. Note that all watch callbacks fire asynchronously. In addition, value changes are batched within an event loop. This means when a value changes multiple times within a single event loop, the callback will be fired only once with the latest value.

### vm.$watch( keypath, callback )

- **keypath** `String`
- **callback( newValue )** `Function`

Watch a keypath on the vm's data object for changes and call the callback with the new value.

### vm.$unwatch( keypath, [callback] )

- **keypath** `String`
- **callback** `Function` *optional*

Stop watching the given keypath. If a callback is given only that callback gets unwatched.

### vm.$get( keypath )

- **keypath** `String`

Retrieve a data value from the vm given a keypath. Non-existent paths always return `undefined`.

### vm.$set( keypath, value )

- **keypath** `String`
- **value** `*`

Set a data value on the vm given a keypath. If the path doesn't exist it will be created.

## Cross-ViewModel Events

> Each vm is also an event emitter. When you have multiple nested ViewModels, you can use the event system to communicate between them.

### vm.$dispatch( event, [args...] )

- **event** `String`
- **args...** *optional*

Dispatch an event from the current vm that propagates all the way up to its `$root`.

### vm.$broadcast( event, [args...] )

- **event** `String`
- **args...** *optional*

Emit an event to all children vms of the current vm, which gets further broadcasted to their children all the way down.

### vm.$emit( event, [args...] )

- **event** `String`
- **args...** *optional*

Trigger an event on this vm only.

### vm.$on( event, callback )

- **event** `String`
- **callback** `Function`

Listen for an event on the current vm.

### vm.$once( event, callback )

- **event** `String`
- **callback** `Function`

Attach a one-time only listener for an event.

### vm.$off( [event, callback] )

- **event** `String` *optional*
- **callback** `Function` *optional*

If no arguments are given, stop listening for all events; If only the event is given, remove all callbacks for that event; If both event and callback are given, remove that specific callback only.

## DOM Manipulation

> All vm DOM manipulation methods work like their jQuery counterparts - except they also trigger vue.js transitions if there are any declared on vm's `$el`. For more details on transitions see [Adding Transition Effects](/guide/transitions.html).

### vm.$appendTo( element | selector )

- **element** `HTMLElement` | **selector** `String`

Append the vm's `$el` to target element. The argument can be either an element or a querySelector string.

### vm.$before( element | selector )

- **element** `HTMLElement` | **selector** `String`

Insert the vm's `$el` before target element.

### vm.$after( element | selector )

- **element** `HTMLElement` | **selector** `String`

Insert the vm's `$el` after target element.

### vm.$remove()

Remove the vm's `$el` from the DOM.

## Misc

### vm.$destroy()

Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives and remove its `$el` from the DOM.