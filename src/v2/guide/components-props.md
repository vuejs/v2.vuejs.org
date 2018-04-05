---
title: props
type: guide
order: 102
---

> 本页面会假定你已经阅读过 [组件基础](components.html)。如果你还不熟悉组件，请先阅读组件基础后再阅读本页面。

##  prop 命名方案（驼峰式和串联式）

HTML 属性名称对大小写不敏感，因此浏览器会将所有大写字符解释为小写字符。也就是说。当你在你 DOM 模板中书写 prop 时，你应当将驼峰式(camelCase)转写为等价的（连字符分割的）串联式(kebab-case)：

``` js
Vue.component('blog-post', {
  // 在 JavaScript 中使用驼峰式(camelCase)
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

``` html
<!-- 在 HTML 中使用串联式(kebab-case) -->
<blog-post post-title="hello!"></blog-post>
```

再次申明，如果是在使用字符串模板的场景，则没有这些限制。

## 静态 props 和动态 props

到目前为止，你已经见过向 props传递一个静态值，就像这样：

```html
<blog-post title="我的 Vue 旅程"></blog-post>
```

还可以通过 `v-bind` 给 props 分配动态值，就像这样：

```html
<blog-post v-bind:title="post.title"></blog-post>
```

在上面两个示例中，我们传递字符串值，然而，实际上可以给一个 prop 传递_任意_类型的值。

### 传递一个 Number 类型值

```html
<!-- `42` 是静态的，这就需要我们使用 v-bind， -->
<!-- 来告诉 Vue 它是以 JavaScript 表达式表现，而不是一个字符串 -->
<blog-post v-bind:likes="42"></blog-post>

<!-- 将一个变量，动态地分配到属性值上 -->
<blog-post v-bind:likes="post.likes"></blog-post>
```

### 传递一个 Boolean 类型值

```html
<!-- Including the prop with no value will imply `true`. -->
<blog-post favorited></blog-post>

<!-- `false` 是静态的，这就需要我们使用 v-bind， -->
<!-- 来告诉 Vue 它是以 JavaScript 表达式表现，而不是一个字符串 -->
<base-input v-bind:favorited="false">

<!-- 将一个变量，动态地分配到属性值上 -->
<base-input v-bind:favorited="post.currentUserFavorited">
```

### 传递一个 Array 类型值

```html
<!-- array 是静态的，这就需要我们使用 v-bind， -->
<!-- 来告诉 Vue 它是以 JavaScript 表达式表现，而不是一个字符串 -->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- 将一个变量，动态地分配到属性值上 -->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```

### 传递一个 Object 类型值

```html
<!-- object 是静态的，这就需要我们使用 v-bind， -->
<!-- 来告诉 Vue 它是以 JavaScript 表达式表现，而不是一个字符串 -->
<blog-post v-bind:comments="{ id: 1, title: '我的 Vue 旅程' }"></blog-post>

<!-- 将一个变量，动态地分配到属性值上 -->
<blog-post v-bind:post="post"></blog-post>
```

### 传递一个对象的所有属性

如果你想要向 props 传递一个对象所有属性，你可以使用不带参数的 `v-bind`（即 `v-bind` 来替换 `v-bind:prop-name`）。例如，给定一个 `post` 对象：

``` js
post: {
  id: 1,
  title: '我的 Vue 旅程'
}
```

以下模板：

``` html
<blog-post v-bind="post"></blog-post>
```

等价于：

``` html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

## 单向数据流

所有 props 都在子组件和父组件之间形成一个**单向往下流动的数据绑定**：当父组件中的属性更新时，数据就会向下流动到子组件，但是反过来，子组件属性更新时，父组件并不会感知到子组件的数据变化。这种机制可以防止子组件意外地修改了父组件的状态，造成应用程序的数据流动变得难于理解。

此外，每次父组件更新时，子组件中所有的 props 都会更新为最新值。也就是说，你**不应该**试图在子组件内部修改 prop。如果你这么做，Vue 就会在控制台给出警告。

诱使我们修改 prop 的原因，通常有两种：

1. **prop 用于传递初始值(initial value)；之后子组件需要将 prop 转为一个局部数据属性。**在这种情况中，最好定义一个局部的 data 属性，然后将 prop 的值，作为局部属性初始值。

  ``` js
  props: ['initialCounter'],
  data: function () {
    return {
      counter: this.initialCounter
    }
  }
  ```

2. **prop 用于传递一个需要转换的未加工值(raw value)。**在这种情况中，最好预先定义一个 computed 属性，然后在其函数内部引用 prop 的值：

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">注意，JavaScript 中的对象和数组都是通过引用(reference)传递的，因此，如果 prop 是一个数组或对象，则在子组件内部改变对象或数组本身，**仍然会**影响到父组件状态。</p>

## prop 验证

可以为组件 props 指定一些接收条件。如果某个接收条件未满足验证，Vue 就会在浏览器 JavaScript 控制台中触发警告。当你创建一个组件，并将这个组件提供给他人使用时，验证机制是很有帮助的。

为了指定 prop 验证，你需要将 `props` 的值定义为一个带有验证接收条件的对象，而不是一个由字符串构成的数组。例如：

``` js
Vue.component('my-component', {
  props: {
    // 基本类型(base type)的检查（`null` 表示接受所有类型）
    propA: Number,
    // 多种可能的类型
    propB: [String, Number],
    // 必须传递，且 String 类型
    propC: {
      type: String,
      required: true
    },
    // Number 类型，有一个默认值
    propD: {
      type: Number,
      default: 100
    },
    // Object 类型，有一个默认值
    propE: {
      type: Object,
      // Object/Array 类型，
      // 默认必须返回一个工厂函数
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 值必须是这些字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

当 prop 验证失败，（如果使用的是开发构建版本，）Vue 就会在控制台抛出警告。

<p class="tip">注意，props 会在组件实例创建**之前**进行验证，因此在 `default` 或 `validator` 这些验证函数中，还无法访问到实例上的属性（像 `data`, `computed` 这些）。</p>

### 类型检查

`type`  可以是以下原生构造函数之一：

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

除了以上这些，`type` 还可以是一个自定义构造函数，通过 `instanceof` 对 props 值进行类型推断。

```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

你可以这样做类型推断：

```js
Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

以验证 `author` prop 的值，是由 `new Person` 创建出来的。

## 非 prop 特性(non-prop attributes)

非 prop 特性，就是指无须遵循 prop 定义规则，而是可以直接传入到组件的 HTML 属性(attribute)。

虽然，我们推荐通过显示定义 props，将信息从父组件传递给子组件，然而，组件库的创建者，无法完全预知他们编写的组件可能被用于什么样的上下文环境(context)中。这也就是为什么组件需要具有「接收最终会被添加到组件的根元素中的任意特性」的能力。

例如，假想我们使用一个第三方 `bootstrap-date-input` 组件，其内部引用一个 BootStrap 插件，现在需要我们向组件内的 `input` 元素传入一个 `data-date-picker` 特性。我们可以在组件实例上添加这个特性：

``` html
<bootstrap-date-input data-date-picker="activated"></bootstrap-date-input>
```

然后，`data-date-picker="activated"` 特性就会被自动添加到 `bootstrap-date-input` 组件的根元素上。

### 替换/合并现有的特性(replacing/merging with existing attributes)

假设这是 `bootstrap-date-input` 组件的模板：

``` html
<input type="date" class="form-control">
```

为了给日期选择器插件指定一个主题，我们可能需要向组件添加一个特定的 class 类名，就像这样：

``` html
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>
```

在这种场景中，定义了两个不同的 `class` 值：

- `form-control`，是在组件模板中设置的 class 类名
- `date-picker-theme-dark`，是从父组件传入的 class 类名

对于大多数特性，传给组件的值将会替换掉组件自身设置的值。例如，向组件传入 `type="text"`，将会替换掉组件自身设置的 type="date"，这就很可能破坏组件的一些预设功能！幸运的是，`class` 和 `style` 特性会略微智能，这两个值会被合并而非替换，而最终的值是：`form-control date-picker-theme-dark`。

### 禁用特性继承(disabling attribute inheritance)

如果你**不希望**组件根元素从父实例中继承特性(attribute)，你可以在组件选项中设置 `inheritAttrs: false` 来禁用特性继承。例如：

```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```

这对于通过子组件 `$attrs` 实例属性，合并父实例的特性来说尤其有用，其中 $attrs 对象包含父实例传入到一个组件的特性名称和特性值，类似这样：

```js
{
  class: 'username-input',
  placeholder: 'Enter your username'
}
```

通过 `inheritAttrs: false` 和 `$attrs`，你可以手动决定将特性，传送到具体的某个元素，对于 [基本组件](../style-guide/#%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90) 来说，这是符合需求的功能：

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

这种方式允许你像使用原始 HTML 元素那样去使用基本组件，而不必关心组件根元素是哪个元素：

```html
<base-input
  v-model="username"
  class="username-input"
  placeholder="Enter your username"
></base-input>
```

***

> 原文：http://vuejs.org/v2/guide/components-props.html

***
