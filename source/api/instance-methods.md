title: Instance Methods
type: api
order: 4
---

## Data

<!-- You can observe data changes on a Vue instance. Note that all watch callbacks fire asynchronously. In addition, value changes are batched within an event loop. This means when a value changes multiple times within a single event loop, the callback will be fired only once with the latest value.-->

> 你可以在Vue运行实例中监视数据的变化。你会注意到所有的watch回调都是异步发生的。而且，结果是在事件循环中被分批处理的。这就意味着一个结果假设在一次事件循环中改变多次，回调只会发生一次并直接变到最后的结果。

### vm.$watch( expression, callback, [deep, immediate] )

- **expression** `String`
- **callback( newValue, oldValue )** `Function`
- **deep** `Boolean` *optional*
- **immdediate** `Boolean` *optional*

<!--Watch an expression on the Vue instance for changes. The expression can be a single keypath or actual expressions:-->

监听在Vue实例中改变的一个表达式。表达式可以是一个单独的路径或者是一个实际的表达式：

``` js
vm.$watch('a + b', function (newVal, oldVal) {
  // do something
})
```

<!--To also detect nested value changes inside Objects, you need to pass in `true` for the third `deep` argument. Note that you don't need to do so to listen for Array mutations.-->

也可以监视在对象中的属性，你需要为第三个变量 `deep` 赋一个 `true` 。

请注意你不可以这么监视用来数组中元素的变化。

``` js
vm.$watch('someObject', callback, true)
vm.someObject.nestedValue = 123
// 回调被触发
```

<!--Passing in `true` for the fourth `immediate` argument will trigger the callback immediately with the current value of the expression:-->

如果传递一个 `true` 到第四个变量 `immediate` , 那么回调会带着现在表达式的结果被立即触发。

``` js
vm.$watch('a', callback, false, true)
// 回调使用现在表达式的结果 `a` 被立刻触发
```

<!--Finally, `vm.$watch` returns an unwatch function that stops firing the callback:-->
最后，还需要使用 `vm.$watch` 来返回一个停止监视的函数用来停止继续触发回调。

``` js
var unwatch = vm.$watch('a', cb)
// 最后，停止监制
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

- **keypath** `String`
- **value** `*`

Add a root level property to the Vue instance (and also its `$data`). Due to the limitations of ES5, Vue cannot detect properties directly added to or deleted from an Object, so use this method and `vm.$delete` when you need to do so. Additionally, all observed objects are augmented with these two methods too.

### vm.$delete( keypath )

- **keypath** `String`

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
vm.$interpolate('{&#123;msg&#125;} world!') // -> 'hello world!'
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

> All vm DOM manipulation methods work like their jQuery counterparts - except they also trigger Vue.js transitions if there are any declared on vm's `$el`. For more details on transitions see [Adding Transition Effects](../guide/transitions.html).

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

If the Vue instance didn't get an `el` option at instantiation, you can manually call `$mount()` to assign an element to it and start the compilation. If no argument is provided, an empty `<div>` will be automatically created. Calling `$mount()` on an already mounted instance will have no effect. The method returns the instance itself so you can chain other instance methods after it.

### vm.$destroy( [remove] )

- **remove** `Boolean` *optional*

Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives and remove its `$el` from the DOM. Also, all `$on` and `$watch` listeners will be automatically removed.

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