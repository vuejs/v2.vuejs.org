---
title: 组件
type: guide
order: 11
---

## 什么是组件？

组件(component)是 Vue 最强大的功能之一。组件可以帮助你扩展基本的 HTML 元素，以封装可重用代码。在较高层面上，组件是 Vue 编译器附加行为后的自定义元素。在某些情况下，组件也可以是原生 HTML 元素的形式，以特定的 `is` 特性扩展。

## 使用组件

### 注册

在之前的章节我们了解到，通过以下方式可以创建一个新的 Vue 实例：

``` js
new Vue({
  el: '#some-element',
  // 选项
})
```

要注册一个全局组件，你可以使用 `Vue.component(tagName, options)`。例如：

``` js
Vue.component('my-component', {
  // 选项
})
```

<p class="tip">注意，对于自定义标签的名称，Vue 不强制要求遵循 [W3C 规则](https://www.w3.org/TR/custom-elements/#concepts)（全部小写，必须包含连字符(-)），但是尽量遵循 W3C 规则的约定是比较推荐的做法。</p>

组件在注册过之后，就可以在实例的模板中，以自定义元素 `<my-component></my-component>` 的方式使用。要确保在 Vue 根实例(root Vue instance)实例化之前，就已经将组件注册完成。

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// 注册
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})

// 创建一个根实例
new Vue({
  el: '#example'
})
```

将会渲染为：

``` html
<div id="example">
  <div>A custom component!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### 局部注册

没有必要将每个组件都注册在全局。你可以通过实例的 `components` 选项，将组件注册在局部，可以使组件只能从其他实例/组件的作用域范围中访问到。

``` js
var Child = {
  template: '<div>A custom component!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> 将只在父级模板中可用
    'my-component': Child
  }
})
```

其他可注册的 Vue 功能，也可以使用与此相同的封装方式，例如指令。

### DOM 模版解析说明

当使用 DOM 作为模板时（例如，使用 `el` 选项，将现有内容挂载到一个元素上），你会受到一些源自 HTML 运行机制的限制，因为 Vue 只有在浏览器解析和标准化 HTML **之后**，才可以获取到模板内容。尤其是像 `<ul>`, `<ol>`, `<table>` 和 `<select>` 这样的元素，限制了出现在其中的元素，而像 `<option>` 这样的元素，只能出现在相应的元素中。

在这些受限制的元素中使用自定义元素，会导致一些问题，例如：

``` html
<table>
  <my-row>...</my-row>
</table>
```

自定义组件 `<my-row>` 将会被当作无效内容，提升到 table 之外，从而导致最终渲染输出后的错误。解决方案是使用特殊的 `is` 属性：

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**应当注意，在使用以下字符串模板之一的场景中，这些限制将不再适用**：

- `<script type="text/x-template">`
- JavaScript 内联模版字符串
- `.vue` 组件

因此，尽可能使用字符串模板。

### `data` 必须是一个函数

在组件中，多数的组件选项可以传递给 Vue 构造函数，然后共享于多个组件实例，然而有一个特例：`data` 必须是一个函数。实际上，如果你这么做：

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
```

Vue 就会停下来，并且在控制台中触发警告，提醒你，`data` 返回的数据会用在每个组件实例当中，因此 `data` 必须是一个函数。最好理解这种规则存在的意义，那么让我们想办法绕过这种限制。

``` html
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
```

``` js
var data = { counter: 0 }

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // 严格来看 data 是一个函数，
  // 因此 Vue 不会警告，但是我们为每个组件实例
  // 返回同一个对象的引用
  data: function () {
    return data
  }
})

new Vue({
  el: '#example-2'
})
```

{% raw %}
<div id="example-2" class="demo">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
<script>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
</script>
{% endraw %}

由于三个组件实例共享的是同一个对象，因此增加一个计数器，就会增加全部！嗯。让我们通过改为返回一个全新的数据对象，来解决下这个问题：

``` js
data: function () {
  return {
    counter: 0
  }
}
```

现在所有的计数器，都已经具有它们自己内部的状态：

{% raw %}
<div id="example-2-5" class="demo">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  }
})
new Vue({
  el: '#example-2-5'
})
</script>
{% endraw %}

### 将组件组合在一起

组件，意味着组合在一起使用的元件，多数场景是父子关系：组件 A 可以在自己的模板中使用组件 B。这就必然的需要彼此相互通信：父组件可能会向下传递数组给子组件，然后子组件也可能会将自身发生的变化通知到父组件。然而，重要的是，为了尽可能将父子组件解耦，需要有一个定义清晰的接口。定义清晰的通信方式，可以确保组件可以相对隔离地组织代码，以及合乎逻辑易于推断，从而使它们更加易于维护，并且可能更加易于复用。

在 Vue 中，父子组件之间的关系可以概述为：**props 向下，events 向上**。父组件通过 **props** 向下传递数据给子组件，子组件通过 **events** 发送消息给父组件。让我们来看下它们是如何运行的。

<p style="text-align: center">
  <img style="width:300px" src="/images/props-events.png" alt="props down, events up">
</p>

## Props

### 使用 Props 传递数据

每个组件实例都有自己的**孤立隔离作用域**。也就是说，不能（也不应该）直接在子组件模板中引用父组件数据。要想在子组件模板中引用父组件数据，可以使用 **props** 将数据向下传递到子组件。

每个 prop 属性,都可以控制是否从父组件的自定义属性中接收数据。子组件需要使用 [`props` 选项](../api/#props)显式声明 props，以便它可以从父组件接收到期望的数据。

``` js
Vue.component('child', {
  // 声明 props
  props: ['message'],
  // 就像 data 一样，prop 可以在组件模板内部使用，
  // 并且，还可以在 vm 实例中通过 this.message 访问
  template: '<span>{{ message }}</span>'
})
```

然后我们可以像这样，传入一个普通字符串：

``` html
<child message="hello!"></child>
```

结果：

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="hello!"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['message'],
      template: '<span>{{ message }}</span>'
    }
  }
})
</script>
{% endraw %}

### 驼峰式命名(camelCase) vs. 串联式命名(kebab-case)

HTML 属性会忽略大小写(case-insensitive)，因此，在使用非字符串模板(non-string template)时，驼峰式命名的 prop 名称，需要转换为同等相应的串联式命名（连字符分隔）：

``` js
Vue.component('child', {
  // camelCase in JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- HTML 中的串联式命名 -->
<child my-message="hello!"></child>
```

再次申明，如果是在使用字符串模板的场景，则没有这些限制。

### 动态 Props

类似于将一个普通属性绑定到一个表达式，我们还可以使用 `v-bind` 将 props 属性动态地绑定到父组件中的数据。无论父组件何时更新数据，都可以将数据向下流入到子组件中：

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

使用 `v-bind` 简写语法，通常看起来更简洁：

``` html
<child :my-message="parentMsg"></child>
```

结果：

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Message from parent'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

### 字面量传值 vs. 动态传值

一个初学者易于常犯的错误是，试图通过字面量语法向下传递一个数值：

``` html
<!-- 这会向下传递一个普通字符串 "1" -->
<comp some-prop="1"></comp>
```

然而，由于这是一个字面量 prop 属性，其值会作为普通字符串 `"1"` 向下传递，而不是一个真正的数值。如果想要向下传递真正的 JavaScript 数值，我们就需要使用 `v-bind`，从而将 prop 属性作为一个 JavaScript 表达式来取值：

``` html
<!-- 这会向下传递一个真正的数值 -->
<comp v-bind:some-prop="1"></comp>
```

### 单向数据流(One-Way Data Flow)

所有的 props 都是在子组件属性和父组件属性之间绑定的，按照**自上而下单向流动**方式构成：当父组件属性更新，数据就会向下流动到子组件，但是反过来却并非如此。这种机制可以防止子组件意外地修改了父组件的状态，会造成应用程序的数据流动变得难于推断。

此外，每次父组件更新时，子组件中所有的 props 都会更新为最新值。也就是说，你**不应该**试图在子组件内部修改 prop。如果你这么做，Vue 就会在控制台给出警告。

诱使我们修改 prop 的原因，通常有两种：

1. prop 只是用于传递初始值，之后子组件想要直接将 prop 作为一个局部数据的属性；

2. prop 作为一个需要转换的原始值传入。

这些场景中，比较合适的应对方式是：

1. 定义一个局部数据的属性，将 prop 属性的初始值作为局部属性的初始值：

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. 定义一个计算属性，从 prop 传入的值来取值：

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">注意，在 JavaScript 中对象和数组会作为引用类型传入，因此，如果 prop 是一个对象或数组，在子组件内部修改对象或数组自身，**将会影响**父组件的状态。</p>

### Prop 验证

可以为组件接收到的 props 指定一些要求条件。如果某个要求条件未满足验证，Vue 就会触发警告。当你创建一个组件，并将这个组件提供给他人使用时，验证机制是很有帮助的。

除了将 props 定义为一个数组或字符串，你还可以将其定义为一个带有验证要求条件的对象：

``` js
Vue.component('example', {
  props: {
    // 基本类型检查（`null` 表示接受所有类型）
    propA: Number,
    // 多种可能的类型
    propB: [String, Number],
    // 必须传递，一个的字符串
    propC: {
      type: String,
      required: true
    },
    // 数字类型，有一个默认值
    propD: {
      type: Number,
      default: 100
    },
    // 数组/对象类型，
    // 应该默认返回一个工厂函数
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

`type` 可以是以下原生构造函数之一：

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

除了以上这些，`type` 还可以是一个自定义构造函数，在通过 `instanceof` 检测时，此构造函数会被用于进行类型推断。

当 prop 验证失败，（如果使用的是开发构建版本，）Vue 就会在控制台抛出警告。注意，props 会在组件实例创建__之前__进行验证，因此在 `default` 或 `validator` 函数中，像 `data`, `computed` 或 `methods` 这些组件实例上的属性还无法访问。

## 非 Prop 属性(Non-Prop Attributes)

非 prop 属性，就是指无需符合 prop 属性的定义规则，而是可以直接传入到组件的属性。

虽然，我们推荐通过显式定义 props，将信息数据从父组件传递给子组件，然而组件库的创建者，并无法完全预知到，他们编写的组件可能会被用于什么样的上下文环境(context)中。这也就是为什么组件可以接收任意属性，并且这些属性将会被添加到组件的根元素中。

例如，假设我们使用一个名为 `bs-date-input`，用到 BootStrap 插件的第三方组件，并且需要向此组件内的 `input` 传入一个 `data-3d-date-picker` 属性。我们可以将这个属性添加到我们的组件实例中：

``` html
<bs-date-input data-3d-date-picker="true"></bs-date-input>
```

然后，`data-3d-date-picker="true"` 属性就会自动添加到 `bs-date-input` 组件的根元素上。

### 替换/合并现有的属性(Replacing/Merging with Existing Attributes)

假设这是 `bs-date-input` 组件的模板：

``` html
<input type="date" class="form-control">
```

为了给日期选择器插件添加一个指定的主题，我们可能需要向组件添加一个指定的 class 类名，就像这样：

``` html
<bs-date-input
  data-3d-date-picker="true"
  class="date-picker-theme-dark"
></bs-date-input>
```

在这种场景中，定义了两个不同的 `class` 值：

- `form-control`，是在组件模板中设置的 class 类名
- `date-picker-theme-dark`，是从父组件传入的 class 类名

对于大多数属性，传给组件的值将会替换掉组件自身设置的值。因此，例如，向组件传入 `type="large"`，将会替换掉组件自身设置的 `type="date"`，这就很可能破坏组件的一些预设功能！幸运的是，`class` 和 `style` 属性会略微智能，这两个值会被合并，而非替换，而最终的值是：`form-control date-picker-theme-dark`。

## 自定义事件

之前我们已经了解到，父组件可以使用 props 向下传递 data 数据给子组件，然而，如何将子组件内部发生的一些变化向上通知到父组件呢？这就是 Vue 自定义事件的用途。

### 使用 `v-on` 的自定义事件

每个 Vue 实例都接入了一个[事件接口(events interface)](../api/#Instance-Methods-Events)，也就是说，这些 Vue 实例可以做到：

- 使用 `$on(eventName)` 监听一个事件
- 使用 `$emit(eventName)` 触发一个事件

<p class="tip">注意，Vue 事件系统，与浏览器的 [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) 毫无关联。虽然它们之间具有类似的事件机制，但是 `$on` 和 `$emit` __并非__ `addEventListener` 和 `dispatchEvent` 的别名</p>

除此之外，父组件可以直接在模板中调用子组件的地方，使用 `v-on` 监听子组件触发的事件。

<p class="tip">无法在父组件或父实例中使用 `$on` 来监听子组件触发的事件。必须直接在模板中使用 `v-on`，就像下面的例子：</p>

这里是一个示例：

``` html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

``` js
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

{% raw %}
<div id="counter-event-example" class="demo">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  }
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
</script>
{% endraw %}

在这个例子中，需要注意的要点是，子组件仍然是与组件外部环境发生的变化之间完全解耦的。它需要做的就是将自身内部的行为全部通知到父组件中，以防止父组件主动关注子组件信息造成耦合。

#### 为组件绑定原生事件(Binding Native Events to Components)

有时候，你可能希望某个组件的根元素能够监听到原生事件。在这种场景中，你可以在 `v-on` 后面添加 `.native` 修饰符。例如：

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### `.sync` 修饰符

> 2.3.0+

In some cases we may need "two-way binding" for a prop - in fact, in Vue 1.x this is exactly what the `.sync` modifier provided. When a child component mutates a prop that has `.sync`, the value change will be reflected in the parent. This is convenient, however it leads to maintenance issues in the long run because it breaks the one-way data flow assumption: the code that mutates child props are implicitly affecting parent state.

This is why we removed the `.sync` modifier when 2.0 was released. However, we've found that there are indeed cases where it could be useful, especially when shipping reusable components. What we need to change is **making the code in the child that affects parent state more consistent and explicit.**

In 2.3 we re-introduced the `.sync` modifier for props, but this time it is just syntax sugar that automatically expands into an additional `v-on` listener:

The following

``` html
<comp :foo.sync="bar"></comp>
```

is expanded into:

``` html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

For the child component to update `foo`'s value, it needs to explicitly emit an event instead of mutating the prop:

``` js
this.$emit('update:foo', newValue)
```

### 使用自定义事件的表单输入组件

自定义事件也可以用来创建自定义的表单输入组件，使用 `v-model` 来进行数据双向绑定。牢记：

``` html
<input v-model="something">
```

仅仅是一个语法糖：

``` html
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

所以在组件中使用时，它相当于下面的简写：

``` html
<custom-input
  :value="something"
  @input="value => { something = value }">
</custom-input>
```

所以要让组件的 `v-model` 生效，它应该（这可以在 2.2.0以上版本配置）：

- 接受一个 `value` 属性
- 在有新的 value 时触发 `input` 事件

一个非常简单的货币输入：

``` html
<currency-input v-model="price"></currency-input>
```

``` js
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)">\
    </span>\
  ',
  props: ['value'],
  methods: {
    // 不是直接更新值，而是使用此方法来对输入值进行格式化和位数限制
    updateValue: function (value) {
      var formattedValue = value
        // 删除两侧的空格符
        .trim()
        // 保留 2 小数位
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      // 如果值不统一，
      // 手动覆盖以保持一致
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // 通过 input 事件发出数值
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

{% raw %}
<div id="currency-input-example" class="demo">
  <currency-input v-model="price"></currency-input>
</div>
<script>
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    updateValue: function (value) {
      var formattedValue = value
        .trim()
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      this.$emit('input', Number(formattedValue))
    }
  }
})
new Vue({
  el: '#currency-input-example',
  data: { price: '' }
})
</script>
{% endraw %}

上面的实现方式太过理想化了。 比如，用户甚至可以输入多个小数点或句号 - 哦哦！因此我们需要一个更有意义的例子，下面是一个更加完善的货币过滤器：

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Customizing Component `v-model`

> New in 2.2.0

By default, `v-model` on a component uses `value` as the prop and `input` as the event, but some input types such as checkboxes and radio buttons may want to use the `value` prop for a different purpose. Using the `model` option can avoid the conflict in such cases:

``` js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    // this allows using the `value` prop for a different purpose
    value: String
  },
  // ...
})
```

``` html
<my-checkbox v-model="foo" value="some value"></my-checkbox>
```

The above will be equivalent to:

``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```

<p class="tip">Note that you still have to declare the `checked` prop explicitly.</p>

### 非父子组件通信

有时候非父子关系的组件也需要通信。在简单的场景下，使用一个空的 Vue 实例作为中央事件总线：

``` js
var bus = new Vue()
```
``` js
// 触发组件 A 中的事件
bus.$emit('id-selected', 1)
```
``` js
// 在组件 B 创建的钩子中监听事件
bus.$on('id-selected', function (id) {
  // ...
})
```

在更多复杂的情况下，你应该考虑使用专门的 [状态管理模式](state-management.html).

## 使用 Slot 分发内容

在使用组件时，常常要像这样组合它们：

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

注意两点：

1. `<app>` 组件不知道它会接收到什么内容。内容是由使用 `<app>` 的父组件决定的。

2. `<app>` 组件很可能有它自己的模版。

为了让组件可以组合，我们需要一种方式来混合父组件的内容与子组件自己的模板。这个过程被称为 **内容分发** (或 "transclusion" 如果你熟悉 Angular)。Vue.js 实现了一个内容分发 API ，参照了当前 [Web 组件规范草案](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，使用特殊的 `<slot>` 元素作为原始内容的插槽。

### 编译作用域

在深入内容分发 API 之前，我们先明确内容的编译作用域。假定模板为：

``` html
<child-component>
  {{ message }}
</child-component>
```

`message` 应该绑定到父组件的数据，还是绑定到子组件的数据？答案是父组件。组件作用域简单地说是：

父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译。

一个常见错误是试图在父组件模板内将一个指令绑定到子组件的属性/方法：

``` html
<!-- 无效 -->
<child-component v-show="someChildProperty"></child-component>
```

假定 `someChildProperty` 是子组件的属性，上例不会如预期那样工作。父组件模板不应该知道子组件的状态。

如果要绑定子组件内的指令到一个组件的根节点，应当在它的模板内这么做：

``` js
Vue.component('child-component', {
  // 有效，因为是在正确的作用域内
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

类似地，分发内容是在父组件作用域内编译。

### 单个 Slot

除非子组件模板包含至少一个 `<slot>` 插口，否则父组件的内容将会被**丢弃**。当子组件模板只有一个没有属性的 slot 时，父组件整个内容片段将插入到 slot 所在的 DOM 位置，并替换掉 slot 标签本身。

最初在 `<slot>` 标签中的任何内容都被视为**备用内容**。备用内容在子组件的作用域内编译，并且只有在宿主元素为空，且没有要插入的内容时才显示备用内容。

假定 `my-component` 组件有下面模板：

``` html
<div>
  <h2>我是子组件的标题</h2>
  <slot>
    只有在没有要分发的内容时才会显示。
  </slot>
</div>
```

父组件模版：

``` html
<div>
  <h1>我是父组件的标题</h1>
  <my-component>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </my-component>
</div>
```

渲染结果：

``` html
<div>
  <h1>我是父组件的标题</h1>
  <div>
    <h2>我是子组件的标题</h2>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </div>
</div>
```

### 具名 Slot

`<slot>` 元素可以用一个特殊的属性 `name` 来配置如何分发内容。多个 slot 可以有不同的名字。具名 slot 将匹配内容片段中有对应 `slot` 特性的元素。

仍然可以有一个匿名 slot ，它是**默认 slot** ，作为找不到匹配的内容片段的备用插槽。如果没有默认的 slot ，这些找不到匹配的内容片段将被抛弃。

例如，假定我们有一个 `app-layout` 组件，它的模板为：

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

父组件模版：

``` html
<app-layout>
  <h1 slot="header">这里可能是一个页面标题</h1>

  <p>主要内容的一个段落。</p>
  <p>另一个主要段落。</p>

  <p slot="footer">这里有一些联系信息</p>
</app-layout>
```

渲染结果为：

``` html
<div class="container">
  <header>
    <h1>这里可能是一个页面标题</h1>
  </header>
  <main>
    <p>主要内容的一个段落。</p>
    <p>另一个主要段落。</p>
  </main>
  <footer>
    <p>这里有一些联系信息</p>
  </footer>
</div>
```

在组合组件时，内容分发 API 是非常有用的机制。

### 作用域插槽

> 2.1.0 新增

作用域插槽是一种特殊类型的插槽，用作（可以传入数据的）可重用模板,而不是已渲染元素。

在子组件中，只需将数据传递到插槽，就像你将 prop 传递给组件一样：

``` html
<div class="child">
  <slot text="hello from child"></slot>
</div>
```

在父级中，必须存在具有特殊属性 `scope` 的 `<template>` 元素，表示它是作用域插槽的模板。`scope` 的值对应一个临时变量名，此变量接收从子组件中传递的 prop 对象：

``` html
<div class="parent">
  <child>
    <template scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```

如果我们渲染以上结果，得到的输出会是：

``` html
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>
```

作用域插槽更具代表性的用例是列表组件，允许组件自定义应该如何渲染列表每一项：

``` html
<my-awesome-list :items="items">
  <!-- 作用域插槽也可以被命名 -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```

列表组件的模板：

``` html
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- 这里是备用内容 -->
  </slot>
</ul>
```

## 动态组件

多个组件可以使用同一个挂载点，然后动态地在它们之间切换。使用保留的 `<component>` 元素，动态地绑定到它的 `is` 特性：

``` js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
</component>
```

也可以直接绑定到组件对象上：

``` js
var Home = {
  template: '<p>Welcome home!</p>'
}

var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

### `keep-alive`

如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 `keep-alive` 指令参数：

``` html
<keep-alive>
  <component :is="currentView">
    <!-- 非活动组件将被缓存！ -->
  </component>
</keep-alive>
```

在[API 参考](../api/#keep-alive)查看更多 `<keep-alive>` 的细节。

## 杂项

### 编写可复用组件

在编写组件时，记住是否要复用组件有好处。一次性组件跟其它组件紧密耦合没关系，但是可复用组件应当定义一个清晰的公开接口。

Vue 组件的 API 来自三部分 - props, events 和 slots ：

- **Props** 允许外部环境传递数据给组件

- **Events** 允许组件触发外部环境的副作用

- **Slots** 允许外部环境将额外的内容组合在组件中。

使用 `v-bind` 和 `v-on` 的简写语法，模板的缩进清楚且简洁：

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

### 子组件索引

尽管有 props 和 events ，但是有时仍然需要在 JavaScript 中直接访问子组件。为此可以使用 `ref` 为子组件指定一个索引 ID 。例如：

``` html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// 访问子组件
var child = parent.$refs.profile
```

当 `ref` 和 `v-for` 一起使用时， ref 是一个数组，包含相应的子组件。

<p class="tip">`$refs` 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案——应当避免在模版或计算属性中使用 `$refs` 。</p>

### 异步组件

在大型应用程序中，我们可能需要将应用拆分为更小的模块，并且只在实际需要时才从服务器加载组件。为了让异步按需加载组件这件事变得简单，Vue.js 允许将组件定义为一个异步解析组件定义的工厂函数。Vue.js 只在组件实际需要渲染时触发工厂函数，并将缓存结果，用于将来再次渲染。例如：

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Pass the component definition to the resolve callback
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

工厂函数接收 `resolve` 回调函数，在从服务器接收到组件定义时调用。也可以调用 `reject(reason)` 表明加载失败。这里的 `setTimeout` 只是为了用于演示；怎么获取组件完全取决于你。比较推荐的方式是配合 [webpack 代码分割功能](https://doc.webpack-china.org/guides/code-splitting/)来使用异步组件：

``` js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法将指示 webpack 自动将构建的代码，拆分成通过 Ajax 请求加载的 bundle。
  require.ensure(['./my-async-component'], resolve)
})
```

可以在工厂函数中返回一个 `Promise`，所以使用 webpack 2 + ES2015 语法后你可以这么做：

``` js
Vue.component(
  'async-webpack-example',
  () => import('./my-async-component')
)
```

When using [local registration](components.html#Local-Registration), you can also directly provide a function that returns a `Promise`:

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">如果你是需要使用异步组件的 <strong>Browserify</strong> 用户，可能就无法使用异步组件了，它的作者已经[明确表示](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224)很不幸 Browserify 是不支持异步加载的。Browserify 社区找到了 [一些解决方法](https://github.com/vuejs/vuejs.org/issues/620)，这可能对现有的和复杂的应用程序有所帮助。对于所有其他场景，我们推荐简单地使用 webpack 所内置的一流异步支持。</p>

### Advanced Async Components

> New in 2.3.0

Starting in 2.3 the async component factory can also return an object of the following format:

``` js
const AsyncComp = () => ({
  // The component to load. Should be a Promise
  component: import('./MyComp.vue'),
  // A component to use while the async component is loading
  loading: LoadingComp,
  // A component to use if the load fails
  error: ErrorComp,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

Note that when used as a route component in `vue-router`, these properties will be ignored because async components are resolved upfront before the route navigation happens. You also need to use `vue-router` 2.4.0+ if you wish to use the above syntax for route components.

### 组件命名约定

当注册组件（或者 props）时，可以使用 kebab-case ，camelCase ，或 PascalCase 。Vue 不关心这个。

``` js
// 在组件定义中
components: {
  // 使用 kebab-case 形式注册
  'kebab-cased-component': { /* ... */ },
  // register using camelCase
  'camelCasedComponent': { /* ... */ },
  // register using PascalCase
  'PascalCasedComponent': { /* ... */ }
}
```

在 HTML 模版中，请使用 kebab-case 形式：

``` html
<!-- 在HTML模版中始终使用 kebab-case -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<title-cased-component></title-cased-component>
```

当使用字符串模式时，可以不受 HTML 的 case-insensitive 限制。这意味实际上在模版中，你可以使用 camelCase 、 TitleCase 或者 kebab-case 来引用：

- kebab-case
- camelCase or kebab-case if the component has been defined using camelCase
- kebab-case, camelCase or PascalCase if the component has been defined using PascalCase

``` js
components: {
  'kebab-cased-component': { /* ... */ },
  camelCasedComponent: { /* ... */ },
  PascalCasedComponent: { /* ... */ }
}
```

``` html
<kebab-cased-component></kebab-cased-component>

<camel-cased-component></camel-cased-component>
<camelCasedComponent></camelCasedComponent>

<pascal-cased-component></pascal-cased-component>
<pascalCasedComponent></pascalCasedComponent>
<PascalCasedComponent></PascalCasedComponent>
```

This means that the PascalCase is the most universal _declaration convention_ and kebab-case is the most universal _usage convention_.

如果组件未经 `slot` 元素传递内容，你甚至可以在组件名后使用 `/` 使其自闭合：

``` html
<my-component/>
```

当然，这只在字符串模版中有效。因为自闭的自定义元素是无效的 HTML ，浏览器原生的解析器也无法识别它。

### 递归组件

组件在它的模板内可以递归地调用自己，不过，只有当它有 name 选项时才可以：

``` js
name: 'unique-name-of-my-component'
```

当你利用`Vue.component`全局注册了一个组件, 全局的ID作为组件的 `name` 选项，被自动设置.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

如果你不谨慎, 递归组件可能导致死循环:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

上面组件会导致一个错误 “max stack size exceeded” ，所以要确保递归调用有终止条件 (比如递归调用时使用 `v-if` 并让他最终返回 `false` )。

### 组件之间的循环引用

假设您正在构建一个文件目录树，像是 Mac 下的 Finder 或是 Windows 下的文件资源管理器。您可能有一个使用此模板的 `tree-folder` 组件：

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

然后有一个使用此模板的 `tree-folder-contents` 组件：

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

仔细观察后，你就会发现：在渲染树中，这些组件实际上都是彼此的后代和祖先，这是矛盾且相悖的！当使用 `Vue.component` 全局注册组件后，这个问题会自动解决。如果以上已经解决你的问题，你可以在这里停止阅读。

然而，如果你使用了模块系统（例如通过 webpack 或 Browserify 等模块化工具），并通过 require/import 导入组件的话，你就会看到一个错误：


```
Failed to mount component: template or render function not defined.（无法挂载组件：模板或 render 函数未定义。）
```

为了解释这是如何产生的，我将称我们的组件为 A 和 B。模块系统看到它需要导入 A，但是首先 A 需要导入 B，但是 B 又需要导入 A，A 又需要导入 B，等等，如此形成了一个死循环，模块系统并不知道在先不解析一个组件的情况下，如何解析另一个组件。为了修复这个问题，我们需要给模块系统一个切入点，我们可以告诉它，A 需要导入 B，但是没有必要先解析 B。

在我们的例子中，将 `tree-folder` 组件做为切入起点。我们知道制造矛盾的是 `tree-folder-contents` 子组件，所以我们在 `tree-folder` 组件的生命周期钩子函数 `beforeCreate` 中去注册 `tree-folder-contents` 组件：

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

这样问题就解决了！

### 内联模版

如果子组件有 inline-template 特性，组件将把它的内容当作它的模板，而不是把它当作分发内容。这让模板更灵活。

``` html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

但是 inline-template 让模板的作用域难以理解。最佳实践是使用 template 选项在组件内定义模板或者在 `.vue` 文件中使用 `template` 元素。

### X-Templates

另一种定义模版的方式是在 JavaScript 标签里使用 `text/x-template` 类型，并且指定一个id。例如：

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

这在有很多模版或者小的应用中有用，否则应该避免使用，因为它将模版和组件的其他定义隔离了。

### 使用 `v-once` 的低开销静态组件

尽管在 Vue 中渲染 HTML 很快，不过当组件中包含**大量**静态内容时，可以考虑使用 `v-once` 将渲染结果缓存起来，就像这样：

``` js
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Terms of Service</h1>\
      ... a lot of static content ...\
    </div>\
  '
})
```

***

> 原文：https://vuejs.org/v2/guide/components.html

***

***

> 译注（如有错误，请[在此](https://github.com/vuefe/vuejs.org/issues)指出）：

- 字符串模板(string template)和非字符串模板(non-string template)

  参考[本章节 - DOM 模版解析说明](#DOM-模版解析说明)：
  1. 字符串模板(string template)

    - `<script type="text/x-template">`
    - JavaScript 内联模版字符串
    - `.vue` 组件

  1. 非字符串模板(non-string template)

    - DOM 模版

***
