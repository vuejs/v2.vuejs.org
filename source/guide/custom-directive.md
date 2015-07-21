title: 自定义指令
type: guide
order: 9
---

## 基础

Vue.js允许你注册自定义指令，实质上是让你教Vue一些新技巧：怎样将数据的变化映射成DOM的行为。你可以使用`Vue.directive(id, definition) `的方法传入**指令名称**和**定义对象**来注册一个全局自定义指令。定义对象要能提供一些钩子函数（全都可选）：

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

一旦注册好自定义指令，你就可以在Vue.js模板中像这样来使用它（你需要提前加上Vue.js）：

``` html
<div v-my-directive="someValue"></div>
```

当你只用到`update`函数，你就可以只传入一个函数，而不用传定义对象：

``` js
Vue.directive('my-directive', function (value) {
  // this function will be used as update()
})
```

所有的钩子函数会被复制到实际的**指令对象**中，而指令对象就是访问这些函数时的 `this`上下文环境。指令对象有一些有用的公开属性：

- **el**: 指令绑定的元素
- **vm**: 拥有该指令的上下文视图模型
- **expression**: 绑定的表达式，不包括参数和过滤器
- **arg**: 当前参数
- **raw**: 未被解析的原始表达式
- **name**: 不带前缀的指令名

<p class="tip"> 你应该把所有的这些属性看成是只读的，并且限制它们发生改变。你也可以给指令对象附加自定义的属性，但是注意不要重写已有的内部属性。

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

## 直接指令

如果在创建自定义指令的时候传入 `isLiteral: true` ，那么属性值就会被看成直接字符串，并被指定为该指令的`表达式`。指令不会试图建立数据监视。

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

### 动态直接量

然而，在直接指令含有mustache标签的情形下，指令的行为如下所示：

- 指令实例会有一个标记，`this._isDynamicLiteral` 被设为 `true`

- 如果没有提供 `update` 函数，mustache表达式只会被计算一次，并将值赋给 `this.expression` 。不会对表达式进行数据监视。

- 如果提供了 `update` 函数，指令**将**会为表达式建立一个数据监视，并且在计算结果变化的时候调用 `update` 


## 双向指令

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

## 内联声明

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

但是要聪明地使用它，因为通常情况下你是想避免它在你的模板中产生副作用。

## 深度监视

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

## 指令优先级

你可以选择给指令提供一个优先级数（默认是0）。同一个元素上优先级越高的指令会比其他的指令处理得早一些。优先级一样的指令会按照其在元素属性列表中出现的顺序依次处理，但是不能保证这个顺序在不同的浏览器中是一致的。

你可以去[API reference](../api/directives.html)看一些内置指令的优先级。另外，`v-repeat`, `v-if` 以及 `v-component` 被视为“终端指令”，它们在编译过程中始终拥有最高的优先级。

下面，我们来看怎样写一个[自定义过滤器](../guide/custom-filter.html)。
