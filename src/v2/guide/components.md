---
title: 组件
type: guide
order: 11
---

## 什么是组件？

组件(component)是 Vue 最强大的功能之一。组件可以帮助你扩展基本的 HTML 元素，以封装可重用代码。在较高层面上，组件是 Vue 编译器附加行为后的自定义元素。在某些情况下，组件也可以是原生 HTML 元素的形式，以特定的 `is` 特性扩展。

所有的 Vue 组件都是 Vue 的实例，所以接收相同的选项对象（除了一些特定于根的选项）并提供相同的生命周期钩子。

## 使用组件

### 全局注册

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
    // 只能在父级模板中使用 <my-component>
    'my-component': Child
  }
})
```

其他可注册的 Vue 功能，也可以使用与此相同的封装方式，例如指令。

### DOM 模板解析注意事项

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
- JavaScript 内联模板字符串
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

<p style="text-align: center;">
  <img style="width: 300px;" src="/images/props-events.png" alt="props down, events up">
</p>

## Props

### 使用 Props 传递数据

每个组件实例都有自己的**孤立隔离作用域**。也就是说，不能（也不应该）直接在子组件模板中引用父组件数据。要想在子组件模板中引用父组件数据，可以使用 **props** 将数据向下传递到子组件。

每个 prop 属性,都可以控制是否从父组件的自定义属性中接收数据。子组件需要使用 [`props` 选项](../api/#props)显式声明 props，以便它可以从父组件接收到期望的数据。

``` js
Vue.component('child', {
  // 声明 props
  props: ['message'],
  // 像 data 一样，prop 可以在组件模板内部使用，
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

### 驼峰式命名 vs. 串联式命名(camelCase vs. kebab-case)

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
<div id="prop-example-2">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

``` js
new Vue({
  el: '#prop-example-2',
  data: {
    parentMsg: 'Message from parent'
  }
})
```

还可以使用 `v-bind` 简写语法，通常看起来更简洁：

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
      template: '<span>{{ myMessage }}</span>'
    }
  }
})
</script>
{% endraw %}

如果你想要将一个对象中的所有属性都作为 props 传递，可以使用不带参数的 `v-bind`（将 `v-bind:prop-name` 替换为 `v-bind`）。例如，给定一个 `todo` 对象：

``` js
todo: {
  text: 'Learn Vue',
  isComplete: false
}
```

然后：

``` html
<todo-item v-bind="todo"></todo-item>
```

等同于如下：

``` html
<todo-item
  v-bind:text="todo.text"
  v-bind:is-complete="todo.isComplete"
></todo-item>
```

### 字面量传值 vs. 动态传值(Literal vs. Dynamic)

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

所有的 props 都是在子组件属性和父组件属性之间绑定的，按照**自上而下单向流动**方式构成：当父组件属性更新，数据就会向下流动到子组件，但是反过来却并非如此。这种机制可以防止子组件意外地修改了父组件的状态，会造成应用程序的数据流动变得难于理解。

此外，每次父组件更新时，子组件中所有的 props 都会更新为最新值。也就是说，你**不应该**试图在子组件内部修改 prop。如果你这么做，Vue 就会在控制台给出警告。

诱使我们修改 prop 的原因，通常有两种：

1. prop 用于传递初始值；之后子组件需要将 prop 作为一个局部数据的属性。

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

为了给日期选择器插件指定一个主题，我们可能需要向组件添加一个特定的 class 类名，就像这样：

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
- 使用 `$emit(eventName, optionalPayload)` 触发一个事件

<p class="tip">注意，Vue 事件系统，不同于浏览器的 [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)。虽然它们之间具有类似的事件机制，但是 `$on` 和 `$emit` __并非__ `addEventListener` 和 `dispatchEvent` 的别名</p>

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
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
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
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
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

在这个示例中，需要注意的要点是，子组件仍然是与组件外部环境发生的变化之间完全解耦的。它需要做的就是将自身内部的信息全部通知到父组件中，以防止父组件主动关注子组件内部信息造成耦合。


这里有一个如何使用载荷(payload)数据的示例：

``` html
<div id="message-event-example" class="demo">
  <p v-for="msg in messages">{{ msg }}</p>
  <button-message v-on:message="handleMessage"></button-message>
</div>
```

``` js
Vue.component('button-message', {
  template: `<div>
    <input type="text" v-model="message" />
    <button v-on:click="handleSendMessage">Send</button>
  </div>`,
  data: function () {
    return {
      message: 'test message'
    }
  },
  methods: {
    handleSendMessage: function () {
      this.$emit('message', { message: this.message })
    }
  }
})

new Vue({
  el: '#message-event-example',
  data: {
    messages: []
  },
  methods: {
    handleMessage: function (payload) {
      this.messages.push(payload.message)
    }
  }
})
```

{% raw %}
<div id="message-event-example" class="demo">
  <p v-for="msg in messages">{{ msg }}</p>
  <button-message v-on:message="handleMessage"></button-message>
</div>
<script>
Vue.component('button-message', {
  template: `<div>
    <input type="text" v-model="message" />
    <button v-on:click="handleSendMessage">Send</button>
  </div>`,
  data: function () {
    return {
      message: 'test message'
    }
  },
  methods: {
    handleSendMessage: function () {
      this.$emit('message', { message: this.message })
    }
  }
})
new Vue({
  el: '#message-event-example',
  data: {
    messages: []
  },
  methods: {
    handleMessage: function (payload) {
      this.messages.push(payload.message)
    }
  }
})
</script>
{% endraw %}

在第二个示例中，需要注意的要点是，子组件仍然是与组件外部环境发生的变化之间完全解耦的。它需要做的就是将自身内部的信息（包括报告给事件触发器(event emitter)的载荷数据）全部通知到父组件中，以防止父组件主动关注子组件内部信息造成耦合。

### 为组件绑定原生事件(Binding Native Events to Components)

有时候，你可能希望某个组件的根元素能够监听到原生事件。在这种场景中，你可以在 `v-on` 后面添加 `.native` 修饰符。例如：

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### `.sync` 修饰符

> 2.3.0+

在某些场景中，我们可能需要对一个 prop 进行「双向绑定」 - 事实上，这个功能在 Vue 1.x 中已经由 `.sync` 修饰符实现。当一个子组件修改带有 `.sync` 修饰符的 prop 时，设置的值就会反向映射(reflect)到父组件中。这很方便，然而长远来看会造成维护上的问题，因为这种双向绑定的机制，破坏了单向数据流(one-way data flow)的设计：在修改子组件的 props 后，这些代码隐式的，也会影响到父组件状态，父组件的状态来源很难从代码中显式推断。

这也就是为什么我们要在 2.0 发布时，移除 `.sync` 修饰符的原因。然而，我们发现确实在某些场景中还是需要双向绑定，尤其有助于数据往返于可重用组件。我们需要做出的改进是，**将子组件影响父组件状态的代码，能够和单向数据流保持一致，以及变得更加清晰明确**。

在 2.3.0+ 中，我们为 props 重新引入了 `.sync` 修饰符，但是这次只是原有语法的语法糖(syntax sugar)包装而成，其背后实现原理是，在组件上自动扩充一个额外的 `v-on` 监听器：

以下

``` html
<comp :foo.sync="bar"></comp>
```

会被扩充为：

``` html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

对于子组件，如果想要更新 `foo` 的值，则需要显式地触发一个事件，而不是直接修改 prop：

``` js
this.$emit('update:foo', newValue)
```

当使用对象一次性设置多个属性时，也可以将 `v-bind` 与 `.sync` 修饰符组合在一起使用：

```html
<comp v-bind.sync="{ foo: 1, bar: 2 }"></comp>
```

这会为 `foo` 和 `bar` 同时添加用于更新的 `v-on` 监听器。

### 使用自定义事件的表单输入组件(Form Input Components using Custom Events)

自定义事件，还可以用于辅助自定义输入框实现 `v-model`。回顾下：

``` html
<input v-model="something">
```

其实是下面的语法糖包装而成：

``` html
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

在一个组件上使用 v-model 时，会简化为：

``` html
<custom-input
  :value="something"
  @input="value => { something = value }">
</custom-input>
```

因此，对于一个带有 `v-model` 的组件，它应该如下（在 2.2.0+ 这是可配置的）：

- 接收一个 `value` prop
- 触发 `input` 事件，并传入新值

让我们通过一个简单的货币输入框，看看带有 v-model 的组件的表现：

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
    // 此方法不是用来直接更新 value，
    // 而是用于对 input 的 value
    // 进行格式化和位数限制
    updateValue: function (value) {
      var formattedValue = value
        // 移除两侧的空白符
        .trim()
        // 保留 2 位小数
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      // 如果 value 还不是标准格式，
      // 手动将其覆盖以符合规范
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // 向上触发 input 事件，并传递数字值
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

以上实现有点太简陋了。例如，用户可以输入多个句号，有时甚至可以输入字母 - 哦哦！为此我们要找一个足够复杂的例子，下面是一个更加健壮的货币过滤器：

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### 定制组件 `v-model`

> 2.2.0+ 新增

在一个组件中，`v-model` 默认使用 `value` 作为 prop，以及默认使用 `input` 作为监听事件，但是一些输入框类型，例如 checkbox 和 radio，可能会用到 value。在这种情况下，为了避免冲突，就会需要使用组件的 `model` 选项：

``` js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    // 这样可以将 `value` prop 释放出来，用作其他用途
    value: String
  },
  // ...
})
```

``` html
<my-checkbox v-model="foo" value="some value"></my-checkbox>
```

以上等同于：

``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```

<p class="tip">注意，仍然需要显式声明 `checked` prop 属性。</p>

### 非父子组件通信(Non Parent-Child Communication)

有时候两个组件之间需要进行通信，但是它们彼此不是父子组件的关系。在一些简单场景，你可以使用一个空的 Vue 实例作为一个事件总线中心(central event bus)：

``` js
var bus = new Vue()
```
``` js
// 在组件 A 的 methods 方法中触发事件
bus.$emit('id-selected', 1)
```
``` js
// 在组件 B 的 created 钩子函数中监听事件
bus.$on('id-selected', function (id) {
  // ...
})
```

在复杂场景中，你应该考虑使用专门的[状态管理模式](state-management.html)。

## 使用 slot 分发内容(Content Distribution with Slots)

在使用组件时，常常要像这样组合它们：

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

这里有两点需要注意：

1. `<app>` 组件不知道它会接收到什么内容。内容是由调用 `<app>` 的组件决定的。

2. `<app>` 组件极有可能有它自己的模板。

为了能够使合成组件正常运行，我们需要一种组织方式，将父组件的“内容”和子组件自身的模板掺杂在一起。这个过程被称为**内容分发(content distribution)**（或着，如果你熟悉 Angular，也可以叫作“互相嵌入(transclusion)”）。Vue.js 实现了一个内容分发 API，参照了当前 [Web 组件规范草案](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，使用特殊的 `<slot>` 元素，作为原始内容的插槽。

### 编译作用域

在深入内容分发 API 之前，我们先明确内容是在哪个作用域下编译。假定模板为：

``` html
<child-component>
  {{ message }}
</child-component>
```

`message` 应该与父组件的 data 数据绑定，还是与子组件的 data 数据绑定？答案是父组件。组件作用域的规则，简单来说：

父组件模板的内容，全部在父组件作用域内编译；子组件模板的内容，全部在子组件作用域内编译。

一个常见的错误是，试图在父组件模板中，将一个指令绑定到子组件的属性/方法：

``` html
<!-- 无法运行 -->
<child-component v-show="someChildProperty"></child-component>
```

假定 `someChildProperty` 是子组件的一个属性，以上示例将无法按照预期正常运行。因为父组件模板，无法感知到子组件的状态。

如果想要将子组件作用域中的指令，绑定到一个组件的根节点，那么你就应该在子组件自身的模板中这么做：

``` js
Vue.component('child-component', {
  // 正常运行，因为指令的表达式 someChildProperty 处于正确的作用域内
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

类似如上示例，分发内容会在父组件作用域内编译。

### 单个 Slot

除非子组件模板中，包含至少一个 `<slot>` 插口，否则父组件的内容将会被**丢弃**。当子组件模板中只有一个没有属性的 slot 时，父组件的内容片段将会整个插入到子组件中 slot 所在的 DOM 位置，并替换掉 slot 标签本身。

最初在 `<slot>` 标签中的任何内容，都被视为**备用内容**。备用内容在子组件作用域内编译，并且只有在宿主元素为空，且没有要插入的内容时才显示备用内容。

假定 `my-component` 组件具有以下模板：

``` html
<div>
  <h2>我是子组件的标题</h2>
  <slot>
    只有在没有要分发的内容时
    才会显示。
  </slot>
</div>
```

然后是，一个调用子组件的父组件：

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

`<slot>` 元素有一个特殊的 `name` 属性，可以用于深度定制如何分发内容。可以给多个 slot 分配不同的名字。一个具有名称的 slot，会匹配内容片段中有对应 `slot` 属性的元素。

还是可以有一个没有名称的 slot 作为**默认 slot**，这个插口用于将那些未匹配到的内容全部接收进来。如果没有默认的 slot，这些未匹配到的内容将直接丢弃。

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

父组件模板：

``` html
<app-layout>
  <h1 slot="header">这里可能是一个页面标题</h1>

  <p>主要内容的一个段落。</p>
  <p>另一个主要段落。</p>

  <p slot="footer">这里是一些联系信息</p>
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
    <p>这里是一些联系信息</p>
  </footer>
</div>
```

在设计如何将组件组合在一起时，内容分发 API 是极其有用的机制。

### 作用域插槽

> 2.1.0+ 新增

作用域插槽是一种特殊类型的插槽，用于将要渲染的元素(already-rendered-elements)，替换为一个（能够传递数据的）可重用模板。

在子组件中，将数据传递到插槽，就像你将 props 传递给组件一样：

``` html
<div class="child">
  <slot text="hello from child"></slot>
</div>
```

在父级中，必须存在具有特殊属性 `slot-scope` 的 `<template>` 元素，表示它是作用域插槽的模板。`slot-scope` 的值对应一个临时变量名，此变量接收从子组件中传递的 props 对象：

``` html
<div class="parent">
  <child>
    <template slot-scope="props">
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

> 在 2.5.0+ 中，`slot-scope` 不再局限于 `<template>`，可以在任何元素或组件上使用。

作用域插槽更具代表性的用例是列表组件，允许组件自定义应该如何渲染列表每一项：

``` html
<my-awesome-list :items="items">
  <!-- 作用域插槽也可以是具名的 -->
  <li
    slot="item"
    slot-scope="props"
    class="my-fancy-item">
    {{ props.text }}
  </li>
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

#### 解构

`slot-scope` 的值实际上是一个有效的 JavaScript 表达式，可以出现在函数签名中的参数所在位置。这意味着在支持的环境中（在单个文件组件或在现代浏览器），表达式中也可以使用 ES2015 解构：

``` html
<child>
  <span slot-scope="{ text }">{{ text }}</span>
</child>
```

## 动态组件

可以让多个组件使用同一个挂载点，然后动态地在它们之间切换。要实现此效果，我们可以使用 Vue 保留的 `<component>` 元素，将多个组件动态地绑定到 `<component>` 元素的 `is` 属性上：

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

- **Events** 允许组件对外部环境产生副作用(side effects)

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

尽管有 props 和 events，但是有时仍然需要在 JavaScript 中直接访问子组件。为此可以使用 `ref` 为子组件指定一个索引 ID。例如：

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

当 `ref` 和 `v-for` 一起使用时，ref 是一个数组，包含相应的子组件。

<p class="tip">`$refs` 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案 - 应当避免在模板或计算属性中使用 `$refs`。</p>

### 异步组件

在大型应用程序中，我们可能需要将应用程序拆分为多个小的分块(chunk)，并且只在实际用到时，才从服务器加载组件。为了让异步按需加载组件这件事变得简单，Vue 允许将组件定义为一个异步解析组件定义的工厂函数。Vue 只在实际需要渲染组件时，才触发调用工厂函数，并且会将结果缓存起来，用于将来再次渲染。例如

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

工厂函数接收一个 `resolve` 回调函数，在从服务器接收到组件定义时调用。也可以调用 `reject(reason)` 表明加载失败。这里的 `setTimeout` 是为了用于演示；如何异步获取组件定义完全取决于你的实现。要使用异步组件，一个比较推荐的方式是配合 [webpack 代码分离功能](https://doc.webpack-china.org/guides/code-splitting/)：

``` js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法
  // 将指示 webpack 自动将构建完成的代码，
  // 拆分到不同的 bundle 中，然后通过 Ajax 请求加载。
  require(['./my-async-component'], resolve)
})
```

还可以在工厂函数中返回一个 `Promise`，所以配合 webpack 2 + ES2015 语法，你可以这样实现：

``` js
Vue.component(
  'async-webpack-example',
  // `import` 函数返回一个 `Promise`.
  () => import('./my-async-component')
)
```

当使用[局部注册](components.html#局部注册)时，你也可以直接提供一个返回 `Promise` 的函数：

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">如果你是需要使用异步组件的 <strong>Browserify</strong> 用户，可能就无法使用异步组件了，它的作者已经[明确表示](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224)很不幸 Browserify 是不支持异步加载的。Browserify 社区找到[一些解决方案](https://github.com/vuejs/vuejs.org/issues/620)，这可能有助于现有的复杂应用程序实现异步加载。对于所有其他场景，我们推荐使用 webpack 所内置的表现优异异步支持。</p>

### 高级异步组件

> 2.3.0+ 新增

自 2.3 起，异步组件的工厂函数也可以返回一个如下的对象：

``` js
const AsyncComp = () => ({
  // 需要加载的组件. 应当是一个 Promise
  component: import('./MyComp.vue'),
  // loading 时应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染 loading 组件前的等待时间。默认：200ms.
  delay: 200,
  // 最长等待时间。超出此时间
  // 则渲染 error 组件。默认：Infinity
  timeout: 3000
})
```

注意，当一个异步组件被作为 `vue-router` 的路由组件使用时，这些高级选项都是无效的，因为在路由切换前就会提前加载所需要的异步组件。另外，如果你要在路由组件中上述写法，需要使用 `vue-router` 2.4.0+。

### 组件命名约定

当注册组件（或者 props）时，可以使用 kebab-case，camelCase，或 PascalCase。

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

在 HTML 模板中，请使用 kebab-case 形式：

``` html
<!-- 在HTML模板中始终使用 kebab-case -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<pascal-cased-component></pascal-cased-component>
```

当使用_字符串_模式时，可以不受 HTML 的 case-insensitive 限制。这意味实际上在模板中，你可以使用下面的方式来引用你的组件：

- kebab-case
- camelCase 或 kebab-case 如果组件已经被定义为 camelCase
- kebab-case，camelCase 或 PascalCase 如果组件已经被定义为 PascalCase

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

这意味着 PascalCase 是最通用的 _声明约定_ 而 kebab-case 是最通用的 _使用约定_。

如果组件未经 `slot` 元素传递内容，你甚至可以在组件名后使用 `/` 使其自闭合：

``` html
<my-component/>
```

当然，这只在字符串模板中有效。因为自闭的自定义元素是无效的 HTML，浏览器原生的解析器也无法识别它。

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

上面组件会导致一个错误 “max stack size exceeded”，所以要确保递归调用有终止条件 (比如递归调用时使用 `v-if` 并让他最终返回 `false` )。

### 组件之间的循环引用

假设你正在构建一个文件目录树，像是 Mac 下的 Finder 或是 Windows 下的文件资源管理器。你可能有一个使用此模板的 `tree-folder` 组件：

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
Failed to mount component: template or render function not defined.（译注：无法挂载组件：模板或 render 函数未定义。）
```

为了解释这是如何产生的，我们可以将组件称为 A 和 B。模块系统看到它需要导入 A，但是首先 A 需要导入 B，但是 B 又需要导入 A，A 又需要导入 B，等等，如此形成了一个死循环，模块系统并不知道在先不解析一个组件的情况下，如何解析另一个组件。为了修复这个问题，我们需要给模块系统一个切入点，我们可以告诉它，A 需要导入 B，但是没有必要先解析 B。

在我们的例子中，将 `tree-folder` 组件做为切入起点。我们知道制造矛盾的是 `tree-folder-contents` 子组件，所以我们在 `tree-folder` 组件的生命周期钩子函数 `beforeCreate` 中去注册 `tree-folder-contents` 组件：

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

这样问题就解决了！

### 内联模板

如果子组件有 `inline-template` 特性，组件将把它的内容当作它的模板，而不是把它当作分发内容。这让模板更灵活。

``` html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

但是 `inline-template` 让模板的作用域难以理解。最佳实践是使用 `template` 选项在组件内定义模板或者在 `.vue` 文件中使用 `template` 元素。

### X-Templates

另一种定义模板的方式是在 JavaScript 标签里使用 `text/x-template` 类型，并且指定一个 id。例如：

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

这在有很多模板或者小的应用中有用，否则应该避免使用，因为它将模板和组件的其他定义隔离了。

### 对低开销的静态组件使用 `v-once`

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

> 译注（如有错误，请[在此](https://github.com/vuefe/vuejs.org/issues)指出）：

- 字符串模板(string template)和非字符串模板(non-string template)

  参考[本章节 - DOM 模板解析注意事项](#DOM-模板解析注意事项)：
  1. 字符串模板(string template)

    - `<script type="text/x-template">`
    - JavaScript 内联模板字符串
    - `.vue` 组件

  1. 非字符串模板(non-string template)

    - DOM 模板

***

***

> 原文：https://vuejs.org/v2/guide/components.html

***
