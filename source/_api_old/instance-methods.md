---
title: Instance Methods
type: api
order: 4
---

## Data

> You can observe data changes on a Vue instance. Note that all watch callbacks fire asynchronously. In addition, value changes are batched within an event loop. This means when a value changes multiple times within a single event loop, the callback will be fired only once with the latest value.

### vm.$watch( expOrFn, callback, [options] )

- **expOrFn** `String|Function`
- **callback( newValue, oldValue )** `Function`
- **options** `Object` *optional*
  - **deep** `Boolean`
  - **immediate** `Boolean`
  - **sync** `Boolean`

Watch an expression or a computed function on the Vue instance for changes. The expression can be a single keypath or actual expressions:

``` js
vm.$watch('a + b', function (newVal, oldVal) {
  // do something
})
// or
vm.$watch(
  function () {
    return this.a + this.b
  },
  function (newVal, oldVal) {
    // do something
  }
)
```

To also detect nested value changes inside Objects, you need to pass in `deep: true` in the options argument. Note that you don't need to do so to listen for Array mutations.

``` js
vm.$watch('someObject', callback, {
  deep: true
})
vm.someObject.nestedValue = 123
// callback is fired
```

Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression:

``` js
vm.$watch('a', callback, {
  immediate: true
})
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

### vm.$add( key, value )

- **key** `String`
- **value** `*`

Add a root level property to the Vue instance (and also its `$data`). Due to the limitations of ES5, Vue cannot detect properties directly added to or deleted from an Object, so use this method and `vm.$delete` when you need to do so. Make sure to use this only when necessary, because this method forces a dirty check of all watchers in the current vm.

### vm.$delete( key )

- **key** `String`

Delete a root level property on the Vue instance (and also its `$data`).

### vm.$eval( expression )

- **expression** `String`

Evaluate an expression that can also contain filters.

``` js
// assuming vm.msg = 'hello'
vm.$eval('msg | uppercase') // -> 'HELLO'
```

### vm.$interpolate( templateString )

- **templateString** `String`

Evaluate a piece of template string containing mustache interpolations. Note that this method simply performs string interpolation; attribute directives are not compiled.

``` js
// assuming vm.msg = 'hello'
vm.$interpolate('{{msg}} world!') // -> 'hello world!'
```

### vm.$log( [keypath] )

- **keypath** `String` *optional*

Log the current instance data as a plain object, which is more console-inspectable than a bunch of getter/setters. Also accepts an optional key.

``` js
vm.$log() // logs entire ViewModel data
vm.$log('item') // logs vm.item
```

## Events

> Each vm is also an event emitter. When you have multiple nested ViewModels, you can use the event system to communicate between them.

### vm.$dispatch( event, [args...] )

- **event** `String`
- **args...** *optional*

Dispatch an event from the current vm that propagates all the way up to its `$root`. If a callback returns `false`, it will stop the propagation at its owner instance.

### vm.$broadcast( event, [args...] )

- **event** `String`
- **args...** *optional*

Emit an event to all children vms of the current vm, which gets further broadcasted to their children all the way down. If a callback returns `false`, its owner instance will not broadcast the event any further.

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

## DOM

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

### vm.$nextTick( callback )

- **callback** `Function`

Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update. This is the same as the global `Vue.nextTick`, except that the callback's `this` context is automatically bound to the instance calling this method.

## Lifecycle

### vm.$mount( [element|selector] )

- **element** `HTMLElement` | **selector** `String` *optional*

If the Vue instance didn't get an `el` option at instantiation, you can manually call `$mount(el)` to start the compilation phase. By default, the mounted element will be replaced by the instance's template. When the `replace` option is set to `false`, the template will be inserted into the mounted element and overwrite any existing inner content, unless the template contains `<content>` outlets.

If no argument is provided, the template will be created as an out-of-document element, and you will have to use other DOM instance methods to insert it into the document yourself. If `replace` option is set to `false`, then an empty `<div>` will be automatically created as the wrapper element. Calling `$mount()` on an already mounted instance will have no effect. The method returns the instance itself so you can chain other instance methods after it.

### vm.$destroy( [remove] )

- **remove** `Boolean` *optional* (Default: `false`)

Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives and optionally remove its `$el` from the DOM. Also, all `$on` and `$watch` listeners will be automatically removed.

### vm.$compile( element )

- **element** `HTMLElement`

Partially compile a piece of DOM (Element or DocumentFragment). The method returns a `decompile` function that tearsdown the directives created during the process. Note the decompile function does not remove the DOM. This method is exposed primarily for writing advanced custom directives.

### vm.$addChild( [options, constructor] )

- **options** `Object` *optional*
- **constructor** `Function` *optional*

Adds a child instance to the current instance. The options object is the same in manually instantiating an instance. Optionally you can pass in a constructor created from `Vue.extend()`.

There are three implications of a parent-child relationship between instances:

1. The parent and child can communicate via [the event system](#Events).
2. The child has access to all parent assets (e.g. custom directives).
3. The child, if inheriting parent scope, has access to parent scope data properties.
