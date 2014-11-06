title: Instance Methods
type: api
order: 4
---

## Data

> You can observe data changes on a Vue instance. Note that all watch callbacks fire asynchronously. In addition, value changes are batched within an event loop. This means when a value changes multiple times within a single event loop, the callback will be fired only once with the latest value.

### vm.$watch( expression, callback, [deep, immediate] )

- **expression** `String`
- **callback( newValue, oldValue )** `Function`
- **deep** `Boolean` *optional*
- **immdediate** `Boolean` *optional*

Watch an expression on the Vue instance for changes. The expression can be a single keypath or actual expressions:

``` js
vm.$watch('a + b', function (newVal, oldVal) {
  // do something
})
```

To also detect nested value changes inside Objects, you need to pass in `true` for the third `deep` argument. Note that you don't need to do so to listen for Array mutations.

``` js
vm.$watch('someObject', callback, true)
vm.someObject.nestedValue = 123
// callback is fired
```

Passing in `true` for the fourth `immediate` argument will trigger the callback immediately with the current value of the expression:

``` js
vm.$watch('a', callback, false, true)
// callback is fired immediately with current value of `a`
```

Finally, `vm.$watch` returns an unwatch function that stops firing the callback:

``` js
var unwatch = vm.$watch('a', cb)
// later, teardown the watcher
unwatch()
```

### vm.$get( expression )

- **expression** `String`

Retrieve a value from the Vue instance given an expression. Expressions that throw errors will be suppressed and return `undefined`.

### vm.$set( keypath, value )

- **keypath** `String`
- **value** `*`

Set a data value on the Vue instance given a valid keypath. If the path doesn't exist it will be created.

### vm.$add( keypath, value )

### vm.$delete( keypath )

### vm.$eval( directiveText )

### vm.$interpolate( templateString )

### vm.$log( [keypath] )

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

If no arguments are given, stop listening for all events; if only the event is given, remove all callbacks for that event; if both event and callback are given, remove that specific callback only.

## DOM Manipulation

> All vm DOM manipulation methods work like their jQuery counterparts - except they also trigger Vue.js transitions if there are any declared on vm's `$el`. For more details on transitions see [Adding Transition Effects](/guide/transitions.html).

### vm.$appendTo( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

Append the vm's `$el` to target element. The argument can be either an element or a querySelector string.

### vm.$before( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

Insert the vm's `$el` before target element.

### vm.$after( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

Insert the vm's `$el` after target element.

### vm.$remove( [callback] )

- **callback** `Function` *optional*

Remove the vm's `$el` from the DOM.

## Lifecycle

### vm.$mount( [element|selector] )

- **element** `HTMLElement` | **selector** `String` *optional*

### vm.$destroy( [remove] )

- **remove** `Boolean` *optional*

Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives and remove its `$el` from the DOM. Also, all `$on` and `$watch` listeners will be automatically removed.

### vm.$compile( element )

- **element** `HTMLElement`