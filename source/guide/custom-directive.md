title: 自定义指令
type: guide
order: 9
---

## The Basics
## 基础
Vue.js allows you to register custom directives, essentially enabling you to teach Vue new tricks on how to map data changes to DOM behavior. You can register a global custom directive with the `Vue.directive(id, definition)` method, passing in a **directive id** followed by a **definition object**. A definition object can provide several hook functions (all optional):

Vue.js允许你注册自定义指令，实质上是让你教Vue一些新技巧：怎样将数据的变化映射成DOM的行为。你可以使用`Vue.directive(id, definition) `的方法传入**指令名称**和**定义对象**来注册一个全局自定义指令。定义对象要能提供一些钩子函数（全都可选）：

- **bind**: called only once, when the directive is first bound to the element.
- **update**: called for the first time immediately after `bind` with the initial value, then again whenever the binding value changes. The new value and the previous value are provided as the argument.
- **unbind**: called only once, when the directive is unbound from the element.

- **bind**:仅调用一次，当指令第一次绑定元素的时候。
-	**update**: 第一次调用是在 bind之后，用的是初始值；以后每当绑定的值发生变化就会被调用，新值与旧值作为参数。
-	**unbind**：仅调用一次，当指令解绑元素的时候。

**Example**

``` js
Vue.directive('my-directive', {
  bind: function () {
    // do preparation work
    // e.g. add event listeners or expensive stuff
    // that needs to be run only once
  },
  update: function (newValue, oldValue) {
    // do something based on the updated value
    // this will also be called for the initial value
  },
  unbind: function () {
    // do clean up work
    // e.g. remove event listeners added in bind()
  }
})
```

Once registered, you can use it in Vue.js templates like this (you need to add the Vue.js prefix to it):

一旦注册好自定义指令，你就可以在Vue.js模板中像这样来使用它（你需要提前加上Vue.js）：

``` html
<div v-my-directive="someValue"></div>
```

When you only need the `update` function, you can pass in a single function instead of the definition object:

当你只用到`update`函数，你就可以只传入一个函数，而不用传定义对象：

``` js
Vue.directive('my-directive', function (value) {
  // this function will be used as update()
})
```

All the hook functions will be copied into the actual **directive object**, which you can access inside these functions as their `this` context. The directive object exposes some useful properties:

所有的钩子函数会被复制到实际的**指令对象**中，而指令对象就是访问这些函数时的 `this`上下文环境。指令对象有一些有用的公开属性：

- **el**: the element the directive is bound to.
- **vm**: the context ViewModel that owns this directive.
- **expression**: the expression of the binding, excluding arguments and filters.
- **arg**: the argument, if present.
- **raw**: the raw, unparsed expression.
- **name**: the name of the directive, without the prefix.

- **el**: 指令绑定的元素
- **vm**: 拥有该指令的上下文视图模型
- **expression**: 绑定的表达式，不包括参数和过滤器
- **arg**: 当前参数
- **raw**: 未被解析的原始表达式
- **name**: 不带前缀的指令名

<p class="tip">You should treat all these properties as read-only and refrain from changing them. You can attach custom properties to the directive object too, but be careful not to accidentally overwrite existing internal ones.</p>

<p class="tip">你应该把所有的这些属性看成是只读的，并且限制它们发生改变。你也可以给指令对象附加自定义的属性，但是注意不要重写已有的内部属性。

An example of a custom directive using some of these properties:

下面是自定义指令使用其中一些属性的例子：

``` html
<div id="demo" v-demo="LightSlateGray : msg"></div>
```

``` js
Vue.directive('demo', {
  bind: function () {
    this.el.style.color = '#fff'
    this.el.style.backgroundColor = this.arg
  },
  update: function (value) {
    this.el.innerHTML =
      'name - '       + this.name + '<br>' +
      'raw - '        + this.raw + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - '   + this.arg + '<br>' +
      'value - '      + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
```

**Result**

<div id="demo" v-demo="LightSlateGray : msg"></div>
<script>
Vue.directive('demo', {
  bind: function () {
    this.el.style.color = '#fff'
    this.el.style.backgroundColor = this.arg
  },
  update: function (value) {
    this.el.innerHTML =
      'name - ' + this.name + '<br>' +
      'raw - ' + this.raw + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - ' + this.arg + '<br>' +
      'value - ' + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
</script>

## Literal Directives
## 直接指令

If you pass in `isLiteral: true` when creating a custom directive, the attribute value will be taken as a literal string and assigned as that directive's `expression`. The directive will not attempt to setup data observation.

如果在创建自定义指令的时候传`入isLiteral: true` ，那么属性值就会被看成直接字符串，并被指定为该指令的`表达式`。指令不会试图建
立数据监视。

Example:

``` html
<div v-literal-dir="foo"></div>
```

``` js
Vue.directive('literal-dir', {
  isLiteral: true,
  bind: function () {
    console.log(this.expression) // 'foo'
  }
})
```

### Dynamic Literal
### 动态直接量

However, in the case that the literal directive contains mustache tags, the behavior is as follows:

然而，在直接指令含有mustache标签的情形下，指令的行为如下所示：

- The directive instance will have a flag `this._isDynamicLiteral` set to `true`;

- 指令实例会有一个标记，`this._isDynamicLiteral` 被设为 `true`

- If no `update` function is provided, the mustache expression will be evaluated only once and assigned to `this.expression`. No data observation happens.

- 如果没有提供 `update` 函数，mustache表达式只会被计算一次，并将值赋给 `this.expression` 。不会对表达式进行数据监视。

- If an `update` function is provided, the directive **will** setup data observation for that expression and call `update` when the evaluated result changes.

- 如果提供了 `update` 函数，指令**将**会为表达式建立一个数据监视，并且在计算结果变化的时候调用 `update` 

## Two-way Directives
## 双向指令

If your directive expects to write data back to the Vue instance, you need to pass in `twoWay: true`. This option allows the use of `this.set(value)` inside the directive:

如果你的指令想向 Vue 实例写回数据，你需要传入 `twoWay: true` 。该选项允许在指令中使用 `this.set(value)`

``` js
Vue.directive('example', {
  twoWay: true,
  bind: function () {
    this.handler = function () {
      // set data back to the vm.
      // If the directive is bound as v-example="a.b.c",
      // this will attempt to set `vm.a.b.c` with the
      // given value.
      this.set(this.el.value)
    }.bind(this)
    this.el.addEventListener('input', this.handler)
  },
  unbind: function () {
    this.el.removeEventListener('input', this.handler)
  }
})
```

## Inline Statements
## 内联声明

Passing in `acceptStatement:true` enables your custom directive to accept inline statements like `v-on` does:

传入 `acceptStatement:true` 可以让自定义指令像 `v-on` 一样接受内联声明：

``` html
<div v-my-directive="a++"></div>
```

``` js
Vue.directive('my-directive', {
  acceptStatement: true,
  update: function (fn) {
    // the passed in value is a function which when called,
    // will execute the "a++" statement in the owner vm's
    // scope.
  }
})
```

Use this wisely though, because in general you want to avoid side-effects in your templates.

但是要聪明地使用它，因为通常情况下你是想避免它在你的模板中产生副作用。

## Deep Observation
## 深度监视

If your custom directive is expected to be used on an Object, and it needs to trigger `update` when a nested property inside the object changes, you need to pass in `deep: true` in your directive definition.

如果你希望在一个 `Object` 上使用自定义指令，并且当对象的内嵌属性发生变化时触发指令的 `update` 函数，那么你就要在指令的定义中传入 `deep: true` 。

``` html
<div v-my-directive="obj"></div>
```

``` js
Vue.directive('my-directive', {
  deep: true,
  update: function (obj) {
    // will be called when nested properties in `obj`
    // changes.
  }
})
```

## Directive Priority
## 指令优先级

You can optionally provide a priority number for your directive (defaults to 0). A directive with a higher priority will be processed earlier than other directives on the same element. Directives with the same priority will be processed in the order they appear in the element's attribute list, although that order is not guaranteed to be consistent in different browsers.

你可以选择给指令提供一个优先级数（默认是0）。同一个元素上优先级越高的指令会比其他的指令处理得早一些。优先级一样的指令会按照其在元素属性列表中出现的顺序依次处理，但是不能保证这个顺序在不同的浏览器中是一致的。

You can checkout the priorities for some built-in directives in the [API reference](../api/directives.html). Additionally, `v-repeat`, `v-if` and `v-component` are considered "terminal directives" and they always have the highest priority in the compilation process.

你可以去[API reference](../api/directives.html)看一些内置指令的优先级。另外，`v-repeat`, `v-if` 以及 `v-component` 被视为“终端指令”，它们在编译过程中始终拥有最高的优先级。

Next, we'll see how to [write a custom filter](../guide/custom-filter.html).

下面，我们来看怎样写一个[自定义过滤器](../guide/custom-filter.html)。
