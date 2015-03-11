title: 选项
type: api
order: 2
---

## Data

### data

- **类型：** `Object | Function`
- **局限：** `Vue.extend()`只接受`Function`.

Vue实例的数据对象. 可以通过`vm.$data`访问:

```js
var data = { a: 1 }
var vm = new Vue({
  data: data
})
vm.$data === data // -> true
```

Vue实例会通过代理方法访问它的所有属性，因此你可以给Vue实例添加属性，然后这些变化会同步到数据对象里：

```js
vm.a   // -> 1
vm.a = 2
data.a // -> 2
data.a = 3
vm.a   // -> 3
```

数据对象必须是JSON格式 (不能有循环引用). 就像普通对象一样使用，而且支持`JSON.stringify`并可以在不同Vue实例中分享.

这里有一个特殊的情况，就是传递`data`参数到`Vue.extend()`时. 因为我们不想让嵌套对象被所有通过`Vue.extend()`扩展而生成实例共享，所以必须提供一个函数来返回一个数据对象的副本:

``` js
var MyComponent = Vue.extend({
  data: function () {
    return {
      message: 'some default data.',
      object: {
        fresh: true
      }
    }
  }
})
```

<p class="tip">在内部, Vue.js会创建一个隐藏属性`__ob__`， 然后通过递归循环转换所有可枚举的属性到getters和setters开实现依赖收集. 以`$`和`_`开头的属性会被跳过.</p>

### methods

- **类型：** `Object`

Methods是被mixed到Vue实例. 你可以通过VM实例访问这些方法，或者在指令表达式里使用他们. 所有方法的`this`就是Vue实例本身.

**例子：**

```js
var vm = new Vue({
  data: { a: 1 },
  methods: {
    plus: function () {
      this.a++
    }
  }
})
vm.plus()
vm.a // 2
```

### computed

- **类型：** `Object`

Computed的属性是被mixed到Vue实例. 所有getters和setters的`this`就是Vue实例本身.

**例子：**

```js
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // get only, just need a function
    aDouble: function () {
      return this.a * 2
    },
    // both get and set
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // -> 2
vm.aPlus = 3
vm.a       // -> 2
vm.aDouble // -> 4
```

### paramAttributes

- **类型：** `Array`

paramAttributes是一个数组。每个成员会被创建在Vue实例作为初始数据. 一般用来传递数据到一个组件.

**例子：**

``` js
Vue.component('param-demo', {
  paramAttributes: ['size', 'message'],
  compiled: function () {
    console.log(this.size)    // -> 100
    console.log(this.message) // -> 'hello!'
  }
})
```

``` html
<param-demo size="100" message="hello!"></param-demo>
```
参数属性也可以包含interpolation标签。Interpolation标签将以父组件为实例来解析，这实际是由[`v-with`](../api/directives.html#v-with)完成的，也就是意味着如果interpolation表达式的值改变了，组件相关联的属性也会被更新：

``` html
<param-demo message="{&#123;parentMessage&#125;}"></param-demo>
```

#### `-` 属性注意事项

HTML属性名是不区分大小写的，所以我们用`-`而不是camel case。使用带`-`的`paramAttributes`，这里有一些特殊情况：

1. 如果属性是一个数据属性，`data-`前缀会自动去掉；

2. 如果属性还包含`-`，它将会被camelized，这是因为在模板中访问带`-`的顶级属性是不方便的：表达式`my-param`将会解析成一个减法操作的表达式，除非你使用这种语法`this['my-param']`。

这意味着参数属性`data-hello`将会被设置在vm的`vm.hello`对象上；然后`my-param`将会变成`vm.myParam`。

## DOM

### el

- **类型：** `String | HTMLElement | Function`
- **限制：** 使用`Vue.extend()`时只接受`Function`类型。

给Vue实例提供一个DOM元素。它可以是一个CSS选择器，一个HTMLElement，或一个返回HTMLElement的函数。处理过的元素可以通过`vm.$el`访问.

当用`Vue.extend`，必须使用函数返回一个有效值，来保证每个实例得到一个独立的元素。

如果初始化的时候就提供了，那就马上进行编译；否则，只有执行了`vm.$mount()`才开始编译。

### template

- **类型：** `String`

一个被插入到`vm.$el`的字符串模板。任何`vm.$el`的内容都会被覆盖，除非模板里有[内容插入点](../guide/components.html#Content_Insertion)。如果**replace**选项是`true`，模板会完全替换`vm.$el`。

如果它以`#`开头将会被当做(DOM)选择器处理，使用被选取元素的`innerHTML`和模板字符串。这样允许使用公共的`<script type="x-template">`方式包含模板。

<p class="tip">Vue.js使用基于DOM的模板体系。编译器走遍所有DOM元素去找指令描述来绑定数据。这就意味着所有的Vue.js模板都是可以转成浏览器可以识别的DOM元素。Vue.js转化字符串模板到DOM fragments，所以他们可以被复制在创建更多Vue实例的时候。如果你想你的模板是有效的HTML，你可以设置指令表达式的前缀是`data-`。</p>

### replace

- **类型：** `Boolean`  
- **缺省值：** `false`
- **限制：** 只有提供**template**选项的时候

是否用模板内容替换原始的`vm.$el`而不是附加上。

## Lifecycle

所有的生命周期的`this`都Vue实例。Vue实例也有对应的事件，以`"hook:<hookName>"`的形式。例如为`created`触发一个`hook:created`。

### created

- **类型：** `Function`

在实例被创建的时候同步调用。在这个阶段，实例完成了包含以下内容的预处理：数据健康，数据监控，计算属性，方法，监控事件回调。但DOM编译还没开始，`$el`还不可用。

### beforeCompile

- **类型：** `Function`

在编译之前调用。

### compiled

- **类型：** `Function`

编译完成后调用，在这个阶段，所有的指令都绑定，数据变化会触发DOM更新。但不能保证`$el`已经被插入到DOM中。

### ready

- **类型：** `Function`

当完成编译**而且**`$el`也第一次的插入到DOM中了之后调用。注意这个插入必须要通过Vue完成的(例如`vm.$appendTo()`的方法或者是一个指令更新的结果)来触发的`ready`事件。

### attached

- **类型：** `Function`

当`vm.$el`被一个指令或是VM实例方法（例如`$appendTo()`）添加到DOM里的时候调用。直接操作`vm.$el`**不会**触发这个事件。

### detached

- **类型：** `Function`

当`vm.$el`被一个指令或是VM实例方法从DOM里删除的时候调用。直接操作`vm.$el`**不会**触发这个事件。

### beforeDestroy

- **类型：** `Function`

在一个Vue实例被销毁之前调用。这个时候，实例的绑定和指令仍工作正常。

### destroyed

- **类型：** `Function`

在一个Vue实例被销毁之后调用。如果被执行，所有的Vue实例的绑定和指令都会被解除绑定，所有子组件也会被销毁.

注意如果有一个leaving transition，`destroyed`被执行在transition结束**之后**.

## Assets

这里有一些Vue实例和它的子实例在编译期有效的私有的资源。

### directives

- **类型：** `Object`

一个指令的哈希表。参看[Writing Custom Directives](../guide/custom-directive.html).

### filters

- **类型：** `Object`

一个过滤器的哈希表。参看[Writing Custom Filters](../guide/custom-filter.html).

### components

- **类型：** `Object`

一个组件的哈希表。参看[Component System](../guide/components.html).

### partials

- **类型：** `Object`

一个partial的哈希表。参看[v-partial](../api/directives.html#v-partial)。

### transitions

- **类型：** `Object`

一个transition的哈希表。详细查看[Transitions](../guide/transitions.html)。

## Others

### inherit

- **类型：** `Boolean`
- **Default:** `false`

是否继承父组件的数据. 如果你想从父组件继承数据，就设成`true`。`inherit`是`true`的时候你可以：

1. 在当先组件模板里绑定父组件的数据属性；
2. 直接访问父组件的属性（通过prototypal继承）。

重要的是，当用`inherit: true`，**子组件也可以改变父组件的属性值**，因为所有Vue实例的数据都是getter/setters。

**例子：**

``` js
var parent = new Vue({
  data: { a: 1 }
})
var child = parent.$addChild({
  inherit: true,
  data: { b: 2 }
})
child.a  // -> 1
child.b  // -> 2
// the following line modifies parent.a
// instead of creating a new property on child:
child.a = 2
parent.a // -> 2
```

### events

Events对象的key是事件名，值就是相应的回调函数值。注意,这是Vue的事件不是DOM事件。值也可以是一个方法名。Vue实例会在初始化的时候对每一个events对象的属性执行`$on()`。

**例子：**

``` js
var vm = new Vue({
  events: {
    'hook:created': function () {
      console.log('created!')
    },
    greeting: function (msg) {
      console.log(msg)
    },
    // can also use a string for methods
    bye: 'sayGoodbye'
  },
  methods: {
    sayGoodbye: function () {
      console.log('goodbye!')
    }
  }
}) // -> created!
vm.$emit('greeting', 'hi!') // -> hi!
vm.$emit('bye')             // -> goodbye!
```

### watch

- **类型**: `Object`

Watch对象的key是表达式，值就是相应的回调函数值。值也可以是个方法名。Vue实例会在初始化的时候对每一个watch对象的属性执行`$watch()`。

**例子：**

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  watch: {
    'a': function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    }
  }
})
vm.a = 2 // -> new: 2, old: 1
```

### mixins

- **类型**: `Array`

`mixins`接受一个mixin对象数组. 就像正常的实例对象一样，这些mixin对象包含实例选项，而且他们也会被合并到最终的选项。e.g. 如果你加了一个created hook ，那么这个组件就会执行所有的created hook。

**例子：**

``` js
var mixin = {
  created: function () { console.log(2) }
}
var vm = new Vue({
  created: function () { console.log(1) },
  mixins: [mixin]
})
// -> 1
// -> 2
```

### name

- **类型**: `String`
- **限制:** 仅限使用 `Vue.extend()`的时候。

当在console里监视一个扩展过的Vue组件的时候，缺省构造函数名是`VueComponent`，但它并不是很有用。但你可以传一个可选项`name`到`Vue.extend()`，这样你就能知道你正在看哪个组件。这个字符串或被camelized并作为组件的构造函数的名字使用。

**例子：**

``` js
var Ctor = Vue.extend({
  name: 'cool-stuff'
})
var vm = new Ctor()
console.log(vm) // -> CoolStuff {$el: null, ...}
```