title: 实例方法
type: api
order: 4
---

## Data

> 你可以在Vue运行实例中监视数据的变化。你会注意到所有的watch回调都是异步发生的。而且，结果是在事件循环中被分批处理的。这就意味着一个结果假设在一次事件循环中改变多次，回调只会发生一次并直接变到最后的结果。

### vm.$watch( expression, callback, [deep, immediate] )

- **expression** `String`
- **callback( newValue, oldValue )** `Function`
- **deep** `Boolean` *optional*
- **immdediate** `Boolean` *optional*

监听在Vue实例中改变的一个表达式。表达式可以是一个单独的路径或者是一个实际的表达式：

``` js
vm.$watch('a + b', function (newVal, oldVal) {
  // do something
})
```

也可以监视在对象中的属性，你需要为 `deep` 传递一个 `true` 来使用此功能 。

请注意你不可以这么监视用来数组中元素的变化。

``` js
vm.$watch('someObject', callback, true)
vm.someObject.nestedValue = 123
// 回调被触发
```

如果传递一个 `true` 到第四个变量 `immediate` , 那么回调会带着现在表达式的结果被立即触发。

``` js
vm.$watch('a', callback, false, true)
// 回调使用现在表达式的结果 `a` 被立刻触发
```

最后，还需要使用 `vm.$watch` 来返回一个停止监视的函数用来停止继续触发回调。

``` js
var unwatch = vm.$watch('a', cb)
// 最后，停止监制
unwatch()
```

### vm.$get( expression )

- **expression** `String`

为 Vue 实例传递一个表达式来获得结果，如果这个表达式带有错误，那么错误不会被报告并且返回一个 `undefined` 。

### vm.$set( keypath, value )

- **keypath** `String`
- **value** `*`

通过给 Vue 实例传递一个可用的路径来设置结果，如果路径不存在那么会被创建。 

### vm.$add( keypath, value )

- **keypath** `String`
- **value** `*`

添加一个根等级（root level property）的属性到 Vue 实例（或者也可以说是它自己的 `$data`）。由于 ES5 的限制，Vue 不可以直接监视对象中属性的增加或者删除，所以当你需要做这些的时候请使用这个方法和 `vm.$delete`。另外，所以被监视的对象也都由这两个方法增大。

### vm.$delete( keypath )

- **keypath** `String`

在 Vue 实例中删除一个根等级属性(或者是它的 `$data`)。

### vm.$eval( expression )

- **expression** `String`

求一个表达式的值，它可以包含数个筛选器。

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

记录当前的实例数据保存在一个空白的对象，这种是比很多取值方法/设值方法都更有可检查性(console-inspectable)。当然也可以传递一个路径(可选)进去。

``` js
vm.$log() // logs entire ViewModel data
vm.$log('item') // logs vm.item
```

## Events

> 每个 vm 都是一个事件的emitter。当你有很多的视图模型时，你可以用这种事件系统去在他们之间沟通数据。

### vm.$dispatch( event, [args...] )

- **event** `String`
- **args...** *optional*

从当前的 vm 处理一个事件，这个 vm 一直传播到它的 `$root` 。如果其中一个回调返回了 `false` ，那么在它自己的实例中停止传播。

### vm.$broadcast( event, [args...] )

- **event** `String`
- **args...** *optional*

为当前 vm 的所有子 vm 注册该事件，这个 vm 会一直传播到到他的子vm。当一个回调返回 `false` 。当一个回调返回了 `false`，那么它的所有者实例就不会广播这个事件了。

### vm.$emit( event, [args...] )

- **event** `String`
- **args...** *optional*

只在这个 vm 里面触发被传递的事件。 

### vm.$on( event, callback )

- **event** `String`
- **callback** `Function`

在当前 vm 中监听事件。

### vm.$once( event, callback )

- **event** `String`
- **callback** `Function`

为一个事件注册一个一次性的监听器。

### vm.$off( [event, callback] )

- **event** `String` *optional*
- **callback** `Function` *optional*

如果没有传递变量，那么停止监视所有时间；如果传递了一个事件，那么移除该事件的所有回调；如果事件和回调都被传递，则只移除该回调。

## DOM

> 所有 vm 的操作 DOM 的方法都是类似于jQuery中相同功能一样 - 除了被声明为 vm 的 `$el` 会触发 Vue.js 的转换。对于转化的更多细节可以看 [Adding Transition Effects](../guide/transitions.html) 。

### vm.$appendTo( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

在目标元素后面添加 vm 的 `$el` ,变量可以是一个元素或者是一个被选择器选中的字符串。

### vm.$before( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

在目标元素之前插入 vm 的 `$el` 。

### vm.$after( element|selector, [callback] )

- **element** `HTMLElement` | **selector** `String`
- **callback** `Function` *optional*

在目标元素之后插入 vm 的 `$el` 。

### vm.$remove( [callback] )

- **callback** `Function` *optional*

从 DOM 中移除 vm 的 `$el` 。

## Lifecycle

### vm.$mount( [element|selector] )

- **element** `HTMLElement` | **selector** `String` *optional*

如果 Vue 实例在实例化的时候没有被传递一个 `el` 的选项,你可以自己调用 `$mount()` 赋一个元素给它并且开始编译。如果没有变量提供，就会自动生成一个空的 `<div>` 。在已经被挂在的实例上调用 `$mount()` 上是没有作用的。这个方法会返回实例本身所以如果你可以在它后面连锁一些其他的实例方法。

### vm.$destroy( [remove] )

- **remove** `Boolean` *optional*

完全销毁一个 vm。清空它对其他存在的 vm 的连接，释放它的所有中间件并且从DOM中移除它的 `$el`。并且所有的 `$on` 和 `$watch` 监听器也都会被自动移除。

### vm.$compile( element )

- **element** `HTMLElement`

局部编译一个 DOM (元素或者是文档的片段)。这个方法返回一个 `decompile` 函数会关闭所有过程中已经被创建的中间件。请注意 decompile 函数不会移除DOM，这个方法对于写入高级自定义中间件来说根本上就是暴露的(exposed)。


### vm.$addChild( [options, constructor] )

- **options** `Object` *optional*
- **constructor** `Function` *optional*

为当前的实例增加一个子实例。选项对象和手动实例化一个实例是相同的。传递一个用 `Vue.extend()` 创造的构造器进去也是可以的。

对于实例间父子关系有三种含义：

1. 父实例和子实例可以通过[the event system](#Events)来沟通
2. 子实例有对父实例所有资源的许可。（例子： 自定义中间件）
3. 如果是继承了父实例作用域的子实例，那么对父实例作用域的数据属性也有许可