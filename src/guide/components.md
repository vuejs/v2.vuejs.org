---
title: 组件
type: guide
order: 11
---

## 什么是组件？

组件（Component）是 Vue.js 最强大的功能之一。组件可以扩展 HTML 元素，封装可重用的代码。在较高层面上，组件是自定义元素， Vue.js 的编译器为它添加特殊功能。在有些情况下，组件也可以是原生 HTML 元素的形式，以 is 特性扩展。

## 使用组件

### 注册

之前说过，我们可以通过以下方式创建一个Vue实例:

``` js
new Vue({
  el: '#some-element',
  // 选项
})
```

要注册一个全局组件，你可以使用 `Vue.component(tagName, options)`。 例如：

``` js
Vue.component('my-component', {
  // 选项
})
```

<p class="tip">对于自定义标签名，Vue.js 不强制要求遵循 [W3C规则](https://www.w3.org/TR/custom-elements/#concepts) （小写，并且包含一个短杠），尽管遵循这个规则比较好。</p>

组件在注册之后，便可以在父实例的模块中以自定义元素 `<my-component></my-component>` 的形式使用。要确保在初始化根实例 **之前** 注册了组件：

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

// 创建根实例
new Vue({
  el: '#example'
})
```

渲染为:

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

不需要全局注册每个组件。可以让组件只能用在其它组件内，用实例选项 `components` 注册:

``` js
var Child = {
  template: '<div>A custom component!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> 将只在父模板可用
    'my-component': Child
  }
})
```

这种封装也适用于其它可注册的功能，如指令。

### DOM 模版解析说明

当使用 DOM 作为模版时 (例如，将 `el` 选项挂载到一个已存在的元素上), 你会受到 HTML 的一些限制, 因为 Vue 只有在浏览器解析 HTML 后才能检索模版。尤其像这些元素 `<ul>` ， `<ol>`， `<table>` ， `<select>` 限制了能被它包裹的元素， `<option>` 只能出现在其它元素内部。

在自定义组件中使用这些受限制的元素时会导致一些问题，例如：

``` html
<table>
  <my-row>...</my-row>
</table>
```

自定义组件 `<my-row>` 被认为是无效的内容，因此在渲染的时候会导致错误。变通的方案是使用特殊的 `is` 属性：

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**需要注意的是这些限制不适用于在以下场景中使用字符串模版时**

- `<script type="text/x-template">`
- JavaScript内联模版字符串
- `.vue` 组件

因此，有必要的话请使用字符串模版。

### `data` 必须是函数

使用组件时，大多数选项可以被传入到Vue构造器中，有一个例外: `data` 必须是函数。 实际上，如果你这么做：

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
```

那么 Vue 会在控制台发出警告, 告诉你在组件中 `data` 必须是一个函数。最好理解这种规则的存在意义。

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
  // data 是一个函数，因此 Vue 不会警告，
  // 但是我们为每一个组件返回了同一个对象引用
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

由于这三个组件共享了同一个 `data` ， 因此增加一个 counter 会影响所有组件！我们可以通过为每个组件返回新的 data 对象来解决这个问题:

``` js
data: function () {
  return {
    counter: 0
  }
}
```

现在每个 counter 都有它自己内部的状态了：

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

### 组合组件

组件意味着协同工作，通常父子组件会是这样的关系：组件 A 在它的模版中使用了组件 B 。它们之间必然需要相互通信：父组件要给子组件传递数据，子组件需要将它内部发生的事情告知给父组件。然而，在一个良好定义的接口中尽可能将父子组件解耦是很重要的。这保证了每个组件可以在相对隔离的环境中书写和理解，也大幅提高了组件的可维护性和可重用性。

在 Vue.js 中，父子组件的关系可以总结为 **props down, events up** 。父组件通过 **props** 向下传递数据给子组件, 子组件通过 **events** 给父组件发送消息。看看它们是怎么工作的。

<p style="text-align: center">
  <img style="width:300px" src="/images/props-events.png" alt="props down, events up">
</p>

## Props

### 使用Props传递数据

组件实例的作用域是**孤立的**。这意味着不能并且不应该在子组件的模板内直接引用父组件的数据。可以使用 props 把数据传给子组件。

prop 是父组件用来传递数据的一个自定义属性。子组件需要显式地用 [`props` 选项](/api/#props) 声明 “prop”：

``` js
Vue.component('child', {
  // 声明 props
  props: ['message'],
  // 就像 data 一样, prop 可以用在模板内
  // 同样也可以在 vm 实例中像 “this.message” 这样使用
  template: '<span>{{ message }}</span>'
})
```

然后向它传入一个普通字符串:

``` html
<child message="hello!"></child>
```

结果:

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

### camelCase vs. kebab-case

HTML 特性不区分大小写。当使用非字符串模版时，名字形式为 camelCase 的 prop 用作特性时，需要转为 kebab-case（短横线隔开）:

``` js
Vue.component('child', {
  // camelCase in JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case in HTML -->
<child my-message="hello!"></child>
```

再次说明，如果你使用字符串模版，不用在意这些限制。

### 动态 Props

类似于用 `v-bind` 绑定 HTML 特性到一个表达式，也可以用 `v-bind` 绑定动态 props 到父组件的数据。每当父组件的数据变化时，也会传导给子组件：

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

使用 `v-bind` 的缩写语法通常更简单:

``` html
<child :my-message="parentMsg"></child>
```

结果:

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

### 字面量语法 vs 动态语法

初学者常犯的一个错误是使用字面量语法传递数值:

``` html
<!-- 传递了一个字符串"1" -->
<comp some-prop="1"></comp>
```

因为它是一个字面 prop ，它的值以字符串 `"1"` 而不是以实际的数字传下去。如果想传递一个实际的 JavaScript 数字，需要使用 `v-bind` ，从而让它的值被当作 JavaScript 表达式计算:

``` html
<!-- 传递实际的数字 -->
<comp v-bind:some-prop="1"></comp>
```

### 单向数据流

prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解.

另外，每次父组件更新时，子组件的所有 prop 都会更新为最新值。这意味着你**不应该**在子组件内部改变 prop 。如果你这么做了，Vue 会在控制台给出警告。

通常有两种改变 prop 的情况：

1. prop 作为初始值传入，子组件之后只是将它的初始值作为本地数据的初始值使用;

2. prop 作为需要被转变的原始值传入。

更确切的说这两种情况是:

1. 定义一个本地数据，并且将 prop 的初始值设为本地数据的初始值。

2. 定义一个基于 prop 值的计算属性。

<p class="tip">注意在 JavaScript 中对象和数组是通过引用传递的，如果 prop 是一个对象或数组，在子组件内部改变它**会影响**父组件的状态。</p>

### Prop 验证

组件可以为 props 指定验证要求。如果未指定验证要求，Vue会发出警告。当组件给其他人使用时这很有用。

prop 是一个对象而不是字符串数组时，它包含验证要求:

``` js
Vue.component('example', {
  props: {
    // 基础类型检测 （`null` 意思是任何类型都可以）
    propA: Number,
    // 多种类型
    propB: [String, Number],
    // 必须且是字符串
    propC: {
      type: String,
      required: true
    },
    // 数字，有默认值
    propD: {
      type: Number,
      default: 100
    },
    // 数组／对象的默认值应当由一个工厂函数返回
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

`type` 可以是下面原生构造器:

- String
- Number
- Boolean
- Function
- Object
- Array

`type` 也可以是一个自定义构造器，使用 `instanceof` 检测。

当 prop 验证失败了， Vue 将拒绝在子组件上设置此值，如果使用的是开发版本会抛出一条警告。

## 自定义事件

父组件可以使用 props 给子组件传递数据, 那么反过来呢？该自定义事件出场了！

### 使用 `v-on` 绑定自定义事件

每个 Vue 实例都实现了事件接口 [Events interface](/api/#Instance-Methods-Events)，即：

- 使用 `$on(eventName)` 监听事件
- 使用 `$emit(eventName)` 触发事件

另外，父组件可以在使用子组件的地方直接用 `v-on` 来监听子组件触发的事件。

下面是一个例子:

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
</script>
{% endraw %}

在本例中，子组件已经和它外部完全解耦了。它所做的只是触发一个父组件关心的内部事件。

#### 给组件绑定原生事件

有时候，你可能想在某个组件的根元素上监听一个原生事件。可以使用 `.native` 修饰 `v-on` 。例如：

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### 使用自定义事件的表单输入组件

自定义事件也可以用来创建自定义的表单输入组件，使用 `v-model` 来进行数据双向绑定。记住，表单控件进行数据绑定时的语法：

``` html
<input v-model="something">
```

仅仅是一个语法糖：

``` html
<input v-bind:value="something" v-on:input="something = $event.target.value">
```

所以在组件中使用时, 它相当于下面的简写：

``` html
<input v-bind:value="something" v-on:input="something = arguments[0]">
```

所以要让组件的 `v-model` 生效，它必须：

- 接受一个 `value` 属性
- 在有新的 value 时触发 `input` 事件

实战看看：

``` html
<div id="v-model-example">
  <p>{{ message }}</p>
  <my-input
    label="Message"
    v-model="message"
  ></my-input>
</div>
```

``` js
Vue.component('my-input', {
  template: '\
    <div class="form-group">\
      <label v-bind:for="randomId">{{ label }}:</label>\
      <input v-bind:id="randomId" v-bind:value="value" v-on:input="onInput">\
    </div>\
  ',
  props: ['value', 'label'],
  data: function () {
    return {
      randomId: 'input-' + Math.random()
    }
  },
  methods: {
    onInput: function (event) {
      this.$emit('input', event.target.value)
    }
  },
})

new Vue({
  el: '#v-model-example',
  data: {
    message: 'hello'
  }
})
```

{% raw %}
<div id="v-model-example" class="demo">
  <p>{{ message }}</p>
  <my-input
    label="Message"
    v-model="message"
  ></my-input>
</div>
<script>
Vue.component('my-input', {
  template: '\
    <div class="form-group">\
      <label v-bind:for="randomId">{{ label }}:</label>\
      <input v-bind:id="randomId" v-bind:value="value" v-on:input="onInput">\
    </div>\
  ',
  props: ['value', 'label'],
  data: function () {
    return {
      randomId: 'input-' + Math.random()
    }
  },
  methods: {
    onInput: function (event) {
      this.$emit('input', event.target.value)
    }
  },
})
new Vue({
  el: '#v-model-example',
  data: {
    message: 'hello'
  }
})
</script>
{% endraw %}

这个接口不仅仅可以用来连接组件内部的表单输入，也很容易集成你自己创造的输入类型。想象一下：

``` html
<voice-recognizer v-model="question"></voice-recognizer>
<webcam-gesture-reader v-model="gesture"></webcam-gesture-reader>
<webcam-retinal-scanner v-model="retinalImage"></webcam-retinal-scanner>
```

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

在更多复杂的情况下，你应该考虑使用专门的 [状态管理模式](/guide/state-management.html).

## 使用 Slots 分发内容

在使用组件时，常常要像这样组合它们：

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

注意两点:

1. `<app>` 组件不知道它的挂载点会有什么内容。挂载点的内容是由`<app>`的父组件决定的。

2. `<app>` 组件很可能有它自己的模版。

为了让组件可以组合，我们需要一种方式来混合父组件的内容与子组件自己的模板。这个处理称为 **内容分发** (或 "transclusion" 如果你熟悉 Angular)。Vue.js 实现了一个内容分发 API ，参照了当前 [Web组件规范草稿](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，使用特殊的 `<slot>` 元素作为原始内容的插槽。

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

父组件的内容将被**抛弃**，除非子组件模板包含 `<slot>` 。如果子组件模板只有一个没有特性的 slot，父组件整个内容片段 将插到 slot 所在的 DOM 位置并替换掉 slot 标签。

`<slot>` 标签的内容视为**回退内容**。回退内容在子组件的作用域内编译，当宿主元素为空并且没有内容供插入时显示这个回退内容。

假定 `my-component` 组件有下面模板：

``` html
<div>
  <h2>I'm the child title</h2>
  <slot>
    如果没有分发内容则显示我。
  </slot>
</div>
```

父组件模版:

``` html
<div>
  <h1>I'm the parent title</h1>
  <my-component>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </my-component>
</div>
```

渲染结果：

``` html
<div>
  <h1>I'm the parent title</h1>
  <div>
    <h2>I'm the child title</h2>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </div>
</div>
```

### 具名Slots

`<slot>` 元素可以用一个特殊特性， `name` ，配置如何分发内容。多个 slot 可以有不同的名字。具名 slot 将匹配内容片段中有对应 `slot` 特性的元素。

仍然可以有一个匿名 slot ，它是**默认 slot** ，作为找不到匹配的内容片段的回退插槽。如果没有默认的 slot ，这些找不到匹配的内容片段将被抛弃。

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
  <h1 slot="header">Here might be a page title</h1>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</app-layout>
```

渲染结果为：

``` html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

在组合组件时，内容分发 API 是非常有用的机制。

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

在[API reference](/api/#keep-alive)查看更多 `<keep-alive>` 的细节。

## 杂项

### 编写可复用组件

在编写组件时，记住是否要复用组件有好处。一次性组件跟其它组件紧密耦合没关系，但是可复用组件应当定义一个清晰的公开接口。

Vue 组件 API 来自三部分—— props , events ,和 slots ：

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

当 `ref` 和 `v-for` 一起使用时， ref 是一个数组或对象，包含相应的子组件。

<p class="tip">`$refs` 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案——应当避免在模版或计算属性中使用 `$refs` 。</p>

### 异步组件

在大型应用中，我们可能需要将应用拆分为多个小模块，按需从服务器下载。为了让事情更简单， Vue.js 允许将组件定义为一个工厂函数，动态地解析组件的定义。Vue.js 只在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。例如：

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

工厂函数接收一个 `resolve` 回调，在收到从服务器下载的组件定义时调用。也可以调用 `reject(reason)` 指示加载失败。这里 `setTimeout` 只是为了演示。怎么获取组件完全由你决定。推荐配合使用 ：[Webpack 的代码分割功能](http://webpack.github.io/docs/code-splitting.html):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./my-async-component'], resolve)
})
```

你可以使用 Webpack 2 + ES2015 的语法返回一个 `Promise` resolve 函数：

``` js
Vue.component(
  'async-webpack-example',
  () => System.import('./my-async-component')
)
```

<p class="tip">如果你是<strong>Browserify</strong>用户,可能就无法使用异步组件了,它的作者已经[表明](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) Browserify 是不支持异步加载的。如果这个功能对你很重要，请使用 Webpack。</p>

### 组件命名约定

当注册组件时（或者 props ），可以使用 kebab-case ，camelCase ，或 TitleCase 。Vue 不关心这个。

``` js
// 在组件定义中
components: {
  // 使用 camelCase 形式注册
  'kebab-cased-component': { /* ... */ },
  'camelCasedComponent': { /* ... */ },
  'TitleCasedComponent': { /* ... */ }
}
```

在 HTML 模版中，请使用 kebab-case形式：

``` html
<!-- 在HTML模版中始终使用 kebab-case -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<title-cased-component></title-cased-component>
```

当使用字符串模式时，可以不受 HTML 的 case-insensitive 限制。这意味即使是在模版中，引用、组件和 prop 可以使用 camelCase 、 PascalCase 或者 kebab-case：

``` html
<!-- 在字符串模版中可以用任何你喜欢的方式! -->
<my-component></my-component>
<myComponent></myComponent>
<MyComponent></MyComponent>
```

如果组件未经 `slot` 元素传递内容，你甚至可以在组件名后使用 `/` 使其自闭合：

``` html
<my-component/>
```

当然，这只在字符串模版中有效。因为自闭的自定义元素是无效的 HTML ，浏览器原生的解析器也无法识别它。

### 递归组件

组件在它的模板内可以递归地调用自己，不过，只有当它有 name 选项时才可以：

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

上面组件会导致一个错误 “max stack size exceeded” ，所以要确保递归调用有终止条件 (比如递归调用时使用 `v-if` 并让他最终返回 false )。当使用 `Vue.component()` 全局注册一个组件时，全局的组件 ID 自动设置为该组件的 `name` 选项。

### 内联模版

如果子组件有 inline-template 特性，组件将把它的内容当作它的模板，而不是把它当作分发内容。这让模板更灵活。

``` html
<my-component inline-template>
  <p>These are compiled as the component's own template.</p>
  <p>Not parent's transclusion content.</p>
</my-component>
```

但是 inline-template 让模板的作用域难以理解。最佳实践是使用 template 选项在组件内定义模板或者在 `.vue` 文件中使用 `template` 元素。

### X-Templates

另一种定义模版的方式是在 JavaScript 标签里使用 `text/x-template` 类型, 并且指定一个id。例如:

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

### Cheap Static Components with `v-once`

尽管在 Vue 中渲染 HTML 很快，不过当组件中包含**大量**静态内容时, 可以考虑使用 `v-once` 将渲染结果缓存起来, 就像这样:

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

> 原文：http://vuejs.org/guide/components.html

***
