---
title: 自定义事件
type: guide
order: 103
---

> 本页面会假定你已经阅读过 [组件基础](components.html)。如果你还不熟悉组件，请先阅读组件基础后再阅读本页面。

## 事件名称(event names)

与 components 和 props 不同，事件名称并不提供命名自动转换。反之，触发的事件名称必须与监听时的名称完全匹配。例如，如果触发事件名称是以驼峰式命名(camelCased)：

```js
this.$emit('myEvent')
```

而监听处是以串联式命名(kebab-cased)时，无法接收到事件：

```html
<my-component v-on:my-event="doSomething"></my-component>
```

与 components 和 props 不同，事件名称永远不会用作 JavaScript 变量或属性名称，所以没有理由去使用驼峰式命名(camelCase)或帕斯卡命名(PascalCase)。此外，DOM 模板中的 `v-on` 事件监听器会自动转换为小写（这是因为 HTML 属性名称不区分大小写），所以 `v-on:myEvent` 会变为 `v-on:myevent` - 由此 `myEvent` 就不可能监听到事件触发。

由于这些原因，我们建议你**总是使用串联式命名(kebab-cased)来命名事件名称**。

## 定制组件 `v-model`

> 2.2.0+ 新增

在一个组件中，`v-model` 默认使用 `value` 作为 prop，以及默认使用 `input` 作为监听事件，然而，对于某些类型的 input 元素（例如 checkbox 和 radio），由于这些类型的 input 元素本身具有 [不同用法](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)，可能会占用 `value` 特性。在这种情况下，使用组件的 `model` 选项可以避免冲突：

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

现在，在这个组件中使用 `v-model`：

```js
<base-checkbox v-model="lovingVue"></base-checkbox>
```

`lovingVue` 的值就会传递给 `checked` prop。当 `<base-checkbox>` 内部触发一个 `change` 事件，并且传递一个新值，`lovingVue` 属性就会进行更新。

<p class="tip">注意，仍然需要在组件 <code>props</code> 选项中声明 <code>checked</code> prop 属性。</p>

## 为组件绑定本地事件(binding native events to components)

有时候，你可能希望某个组件的根元素能够直接监听到组件所处位置的本地事件。在这种场景中，你可以在 `v-on` 上使用 `.native` 修饰符：

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

有时绑定本地事件会很有用，但是注意，如果你试图监听一个非常特殊的元素（例如 `<input>` 元素），则不是正确用法（译注：）。举例说明，上面的 `<base-input>` 组件或许会进行重构，因此其根元素可能实际上是一个 `<label>` 元素：

```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

在这种场景中，由于 input 不是根元素，所以与父组件中那些使用 `.native` 修饰符的监听器(listener)之间的关联被静默破坏。这没有任何错误提醒，只是 `onFocus` 处理函数并没有按照我们的预期被调用。

为了解决这个问题，Vue 提供了一个 `$listeners` 属性，它是包含组件中所有监听器的对象。例如：

```js
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

你可以将所有父组件中由 `v-on="$listeners"` 绑定的监听器，通过 `$listeners` 属性转发到子组件的特定元素。对于像 `<input>` 这样的元素，你还需要实现 `v-model` 机制，通常会创建返回一个新的 listeners 对象的 computed 属性，类似如下 `inputListeners`：

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将这些对象合并在一起，构成一个新的对象
      return Object.assign({},
        // 我们在父组件中添加的所有监听器
        this.$listeners,
        // 然后我们可以新增自定义的监听器，
        // 或覆盖掉一些监听器的行为。
        {
          // 这里确保组件能够正常运行 v-model 指令
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

现在，`<base-input>` 组件是一个**毫无疑惑的容器组件(fully transparent wrapper)**了，也就是说，可以像使用一个普通的 `<input>` 元素一样去使用它：所有的特性和监听器，都能够如同普通 input 元素一样正常运行。

## `.sync` 修饰符

> 2.3.0+ 新增

在某些场景中，我们可能需要为某个 prop 属性进行「双向绑定」。不幸的是，真正的双向绑定会产生一些维护问题，由于子组件可以修改父组件中的状态，所以无法确认修改的源头是来自父组件还是子组件。

这也就是为什么我们放弃这种机制的原因，我们更推荐通过子组件触发 `update:my-prop-name` 事件的方式，来更新父组件的状态。例如，在一个接收 `title` prop 的假想组件中，我们想要分配一个子组件的新值给父组件的意图，可以通过通信机制来实现：

```js
this.$emit('update:title', newTitle)
```

然后，父组件可以监听到这个事件，并且（如果需要的话）更新一个本地数据属性。例如：

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

为了简便，我们使用 `.sync` 修饰符，提供了这个模式的简写：

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

`.sync` 修饰符还可以用于 `v-bind`，使用一个对象一次性设置多个 prop：

```html
<text-document v-bind.sync="doc"></text-document>
```

这会传递 `doc` 对象中的每个属性（例如 `title`），作为单独的 prop，然后为每个属性添加相应的 `v-on:update` 监听器。

<p class="tip">对一个字面量对象使用 <code>v-bind.sync</code>（例如 <code>v-bind.sync="{ title: doc.title }"</code>），则不会正常运行。如果你想要在同一个 <code>v-bind.sync</code> 中，加入多个不相关的 data 属性，我们推荐你创建一个返回对象的 computed 属性。</p>

***

> 原文：http://vuejs.org/v2/guide/components-custom-events.html

***
