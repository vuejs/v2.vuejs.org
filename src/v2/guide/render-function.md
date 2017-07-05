---
title: Render 函数
type: guide
order: 15
---

## 基础

在绝大多数情况下，Vue 推荐你使用模板来组织构建 HTML。然而在一些场景下，你确实需要完整的 JavaScript 编程能力。作为模板的替代增强，你可以使用**render 函数**，它更接近编译器。

让我们深入一个例子，其中，使用 `render` 函数是比较推荐的方式。假设你要生成固定的标题：

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

对于以上 HTML，你决定要使用如下组件接口：

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

当你开始创建一个组件，并且根据 `level` prop 生成标题时，你会很快想到这样实现：

``` html
<script type="text/x-template" id="anchored-heading-template">
  <div>
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-if="level === 6">
      <slot></slot>
    </h6>
  </div>
</script>
```

``` js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

在这种场景中，并不适合使用模板。不仅会很繁琐，而且要在每个不同级的 h 标签中重复 `<slot></slot>`，并且在其中添加固定元素时也必须做同样的事。由于组件必须包含一个根节点，因此整个内容也要包裹在一个无用的 `div` 中。

虽然大多数组件中都非常适合使用模板，但是在这里明显是一种特殊场景。因此，让我们尝试使用 `render` 函数来重写上面的示例：

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 由子节点构成的数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

现在显得简单清晰！一定程度上。代码变得简短很多，但是需要更加熟悉 Vue 实例属性。在这种情况下，你必须知道在不使用 `slot` 属性向组件中传递内容时（比如 `anchored-heading` 中的 `Hello world!`），这些子节点会被存储到组件实例的 `$slots.default` 中。如果你对此还不够了解，**在深入 render 函数之前，建议先阅读[实例属性 API](../api/#vm-slots)。**

## `createElement` 参数

第二件你必须熟悉的事情是，如何在 `createElement` 函数中使用模板功能。以下是 `createElement` 接受的参数：

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // HTML 标签名称，或组件选项对象，或一个函数，
  // 其中函数会返回 HTML 标签名称或组件选项对象。必选参数。
  'div',

  // {Object}
  // 一个数据对象，
  // 和模板中用到的属性相对应。可选参数。
  {
    // （详情请看下一节）
  },

  // {String | Array}
  // 子虚拟 DOM 节点(children VNode)组成，或使用 `createElement()` 生成，
  // 或直接使用字符串的'文本虚拟 DOM 节点(text VNode)'。可选参数。
  [
    'Some text comes first.',
    createElement('h1', 'A headline'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### 深入了解数据对象(The Data Object In-Depth)

需要注意的一点：类似于 `v-bind:class` 和 `v-bind:style` 在模板中有着特殊的处理，下面这些字段(field)都处于 VNode 数据对象的顶层(top-level)。此对象还允许绑定普通的 HTML 属性和 DOM 属性，如 `innerHTML`（这将替换为 `v-html` 指令）：

``` js
{
  // 和 `v-bind:class` 的 API 相同
  'class': {
    foo: true,
    bar: false
  },
  // 和 `v-bind:style` 的 API 相同
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML 属性
  attrs: {
    id: 'foo'
  },
  // 组件 props
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件处理程序嵌套在 `on` 字段下，
  // 然而不支持在 `v-on:keyup.enter` 中的修饰符。
  // 因此，你必须手动检查
  // 处理函数中的 keyCode 值是否为 enter 键值。
  on: {
    click: this.clickHandler
  },
  // 仅对于组件，
  // 用于监听原生事件，而不是组件内部
  // 使用 `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。
  // 注意，由于 Vue 会追踪旧值，
  // 所以不能对绑定的旧值设值
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽(scoped slot)的格式如下
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果此组件是另一个组件的子组件，
  // 需要为插槽(slot)指定名称
  slot: 'name-of-slot',
  // 其他特殊顶层(top-level)属性
  key: 'myKey',
  ref: 'myRef'
}
```

### 完整示例

有了这些知识，我们现在就可以完成开始想实现的组件：

``` js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // create kebabCase id
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^\-|\-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### 限制(Constraints)

#### VNodes 必须唯一

组件树中的所有 VNode 必须是唯一的。也就是说，以下 render 函数无效：

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 哟 - VNode 重复！
    myParagraphVNode, myParagraphVNode
  ])
}
```

如果你真的需要多次重复相同的元素/组件，你可以使用工厂函数来实现。例如，下面的 render 函数，完美有效地渲染了 20 个相同的段落。

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## 使用原生 JavaScript 的替换模板功能(Replacing Template Features with Plain JavaScript)

### `v-if` and `v-for`

无论什么功能，都可以在原生 JavaScript 中轻松实现，所以 Vue 的 render 函数无需提供专用的替代方案。例如，在模板中使用 `v-if` 和 `v-for`：

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

这可以在 render 函数中，通过重写为 JavaScript 的 `if`/`else` 和 `map` 来实现：

``` js
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

### `v-model`

在 render 函数中没有直接和 `v-model` 对标的功能 - 你必须自己实现逻辑：

``` js
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.value = event.target.value
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

这就是深入底层实现需要付出的代价，但是和 `v-model` 相比较，这也可以更好地控制交互细节。

### 事件 & 按键修饰符(Event & Key Modifiers)

对于 `.passive`, `.capture` 和 `.once` 这样的事件修饰符, Vue 提供了用于 `on` 的前缀:

| 修饰符 | 前缀 |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` 或<br>`.once.capture` | `~!` |

示例:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  `~!mouseover`: this.doThisOnceInCapturingMode
}
```

对于其他的事件和关键字修饰符, 你可以在处理程序中使用事件方法实现：

| Modifier(s) | Equivalent in Handler |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Keys:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (change `13` to [another key code](http://keycode.info/) for other key modifiers) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (change `ctrlKey` to `altKey`, `shiftKey`, or `metaKey`, respectively) |

这里是所有修饰符一起使用的例子:

```javascript
on: {
  keyup: function (event) {
    // 如果触发事件的元素不是事件绑定的元素
    // 则返回
    if (event.target !== event.currentTarget) return
    // 如果按下去的不是 enter 键或者
    // 没有同时按下 shift 键
    // 则返回
    if (!event.shiftKey || event.keyCode !== 13) return
    // 阻止事件冒泡
    event.stopPropagation()
    // 阻止该元素默认的 keyup 事件
    event.preventDefault()
    // ...
  }
}
```

### Slots

使用[`this.$slots`](../api/#vm-slots)访问静态插槽内容作为 VNode 数组：

``` js
render: function (createElement) {
  // <div><slot></slot></div>
  return createElement('div', this.$slots.default)
}
```

使用[`this.$scopedSlots`](../api/#vm-scopedSlots)访问作用域插槽作为返回VNodes的函数:

``` js
render: function (createElement) {
  // <div><slot :text="msg"></slot></div>
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.msg
    })
  ])
}
```

使用render函数传递作用域插槽到子组件，使用VNode数据中的`scopedSlots`关键字：

``` js
render (createElement) {
  return createElement('div', [
    createElement('child', {
      // pass scopedSlots in the data object
      // in the form of { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## JSX

如果你写了很多 `render`  函数，可能会觉得痛苦：

``` js
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

特别是模板如此简单的情况下：

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

这就是会有一个 [Babel plugin](https://github.com/vuejs/babel-plugin-transform-vue-jsx) 插件，用于在 Vue 中使用 JSX 语法的原因，它可以让我们回到于更接近模板的语法上。


``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">将 `h` 作为 `createElement` 的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的，如果在作用域中 `h` 失去作用， 在应用中会触发报错。</p>

更多关于 JSX 映射到 JavaScript，阅读 [使用文档](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage)。


## 函数化组件

之前创建的锚点标题组件是比较简单，没有管理或者监听任何传递给他的状态，也没有生命周期方法。它只是一个接收参数的函数。

在这个例子中，我们标记组件为 `functional`， 这意味它是无状态（没有 `data`），无实例（没有 `this` 上下文）。
一个 **函数化组件** 就像这样：

``` js
Vue.component('my-component', {
  functional: true,
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  },
  // Props 可选
  props: {
    // ...
  }
})
```

> Note: in versions <=2.3.0, the `props` option is required if you wish to accept props in a functional component. In 2.3.0+ you can omit the `props` option and all attributes found on the component node will be implicitly extracted as props.

组件需要的一切都是通过 `context` 传递，包括：

- `props`: 提供props 的对象
- `children`: VNode 子节点的数组
- `slots`: slots 对象
- `data`: 传递给组件的 data 对象
- `parent`: 对父组件的引用
- `listeners`: (2.3.0+) An object containing parent-registered event listeners. This is simply an alias to `data.on`
- `injections`: (2.3.0+) if using the [`inject`](../api/#provide-inject) option, this will contain resolved injections.

在添加 `functional: true` 之后，锚点标题组件的 render 函数之间简单更新增加 `context` 参数，`this.$slots.default` 更新为 `context.children`，之后`this.level` 更新为 `context.props.level`。

函数化组件只是一个函数，所以渲染开销也低很多。However, this also mean that functional components don't show up in VueJS Chrome dev tools component tree.

They're also very useful as wrapper components.  For example, when you need to:

- Programmatically choose one of several other components to delegate to
- Manipulate children, props, or data before passing them on to a child component

下面是一个依赖传入 props 的值的 `smart-list` 组件例子，它能代表更多具体的组件：


``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  }
})
```

### `slots()` 和 `children` 对比

你可能想知道为什么同时需要 `slots()` 和 `children`。`slots().default` 不是和 `children` 类似的吗？在一些场景中，是这样，但是如果是函数式组件和下面这样的 children 呢？

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

对于这个组件，`children` 会给你两个段落标签，而 `slots().default` 只会传递第二个匿名段落标签，`slots().foo` 会传递第一个具名段落标签。同时拥有 `children` 和 `slots()` ，因此你可以选择让组件通过 `slot()` 系统分发或者简单的通过 `children` 接收，让其他组件去处理。

## 模板编译

你可能有兴趣知道，Vue 的模板实际是编译成了 render 函数。这是一个实现细节，通常不需要关心，但如果你想看看模板的功能是怎样被编译的，你会发现会非常有趣。下面是一个使用 `Vue.compile`  来实时编译模板字符串的简单 demo：

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
    <pre v-if="!result.staticRenderFns.length"><code>{{ result.staticRenderFns }}</code></pre>
  </div>
  <div v-else>
    <label>Compilation Error:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
  <header>\n\
    <h1>I\'m a template!</h1>\n\
  </header>\n\
  <p v-if="message">\n\
    {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    No message.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Enter a valid template above'
      }
      try {
        var result = Vue.compile(this.templateText.replace(/\s{2,}/g, ''))
        return {
          render: this.formatFunction(result.render),
          staticRenderFns: result.staticRenderFns.map(this.formatFunction)
        }
      } catch (error) {
        return error.message
      }
    }
  },
  methods: {
    formatFunction: function (fn) {
      return fn.toString().replace(/(\{\n)(\S)/, '$1  $2')
    }
  }
})
console.error = function (error) {
  throw new Error(error)
}
</script>
<style>
#vue-compile-demo {
  -webkit-user-select: inherit;
  user-select: inherit;
}
#vue-compile-demo pre {
  padding: 10px;
  overflow-x: auto;
}
#vue-compile-demo code {
  white-space: pre;
  padding: 0
}
#vue-compile-demo textarea {
  width: 100%;
  font-family: monospace;
}
</style>
{% endraw %}

***

> 原文：https://vuejs.org/v2/guide/render-function.html

***
