---
title: Render 函数
type: guide
order: 14
---

## 基础

Vue 推荐使用在绝大多数情况下使用 template 来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力，这就是 ** render 函数**，它比 template 更接近编译器。

让我们先深入一个使用 `render` 函数的简单例子，假设你想生成一个带锚链接的标题：


``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

在 HTML 层， 我们决定这样定义组件接口：

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

当我们开始写一个通过 `level` prop 动态生成heading 标签的组件，你可很快能想到这样实现：

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

template 在这种场景中就表现的有些冗余了。虽然我们重复使用 `<slot></slot>` 来接收每一个级别的标题标签，在标题标签中添加相同的锚点元素。但是些都会被包裹在一个无用的 `div` 中，因为组件必须有根节点。

虽然模板在大多数组件中都非常好用，但是在这里它就不是很简洁的了。那么，我们来尝试使用 `render` 函数重写上面的例子：

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name 标签名称
      this.$slots.default // 子组件中的阵列
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

简单清晰很多！简单来说，这样代码精简很多，但是需要非常熟悉 Vue 的实例属性。在这个例子中，你需要知道当你不使用 `slot`  属性向组件中传递内容时，比如 `anchored-heading` 中的 `Hello world!`, 这些子元素被存储在组件实例中的 `$slots.default`中。如果你还不了解，** 在深入 render 函数之前推荐阅读 [instance properties API](/api/#vm-slots)。**


## `createElement` 参数

第二件你需要熟悉的是如何在 `createElement` 函数中生成模板。这里是 `createElement` 接受的参数：

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签，组件设置，或一个函数
  // 必须 Return 上述其中一个
  'div',

  // {Object}
  // 一个对应属性的数据对象
  // 您可以在 template 中使用.可选项.
  {
    // (下一章，将详细说明相关细节)
  },

  // {String | Array}
  // 子节点(VNodes). 可选项.
  [
    createElement('h1', 'hello world'),
    createElement(MyComponent, {
      props: {
        someProp: 'foo'
      }
    }),
    'bar'
  ]
)
```

### 完整数据对象

有一件事要注意：在 templates 中，`v-bind:class` 和  `v-bind:style` ，会有特别的处理，他们在 VNode 数据对象中，为最高级配置。


``` js
{
  // 和`v-bind:class`一样的 API
  'class': {
    foo: true,
    bar: false
  },
  // 和`v-bind:style`一样的 API
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 正常的 HTML 特性
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
  // 事件监听器基于 "on"
  // 所以不再支持如 v-on:keyup.enter 修饰器
  // 需要手动匹配 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅对于组件，用于监听原生事件，而不是组件使用 vm.$emit 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令. 注意事项：不能对绑定的旧值设值
  // Vue 会为您持续追踨
  directives: [
    {
      name: 'my-custom-directive', 
      value: '2'
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 如果子组件有定义 slot 的名称
  slot: 'name-of-slot'
  // 其他特殊顶层属性
  key: 'myKey',
  ref: 'myRef'
}
```

### 完整示例

有了这方面的知识，我们现在可以完成我们最开始想实现的组件：

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

### 约束

#### VNodes 必须唯一

所有组件树中的 VNodes 必须唯一。这意味着，下面的 render function 是无效的：

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Yikes - duplicate VNodes!
    myParagraphVNode, myParagraphVNode
  ])
}
```

如果你真的需要重复很多次的元素/组件，你可以使用工厂函数来实现。例如，下面这个例子 render 函数完美有效地渲染了 20 个重复的段落：

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## 使用 JavaScript 代替模板功能

无论什么都可以使用原生的 JavaScript 来实现，Vue 的 render 函数不会提供专用的 API。比如， template 中的 `v-if` 和 `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```
这些都会在 render 函数中被 JavaScript 的 `if`/`else` 和 `map` 重写：

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
<p class="tip">将 `h` 作为 `createElement` 的别名是一个通用惯例，你会发现在 Vue 生态系统中，实际上必须用到 JSX，如果在作用域中 `h` 失去作用， 在应用中会触发报错。</p>

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

组件需要的一切都是通过上下文传递，包括：

- `props`: 提供props 的对象
- `children`: VNode 子节点的数组
- `slots`: slots 对象
- `data`: 传递给组件的 data 对象
- `parent`: 对父组件的引用


在添加 `functional: true` 之后，锚点标题组件的 render 函数之间简单更新增加 `context` 参数，`this.$slots.default` 更新为 `context.children`，之后`this.level` 更新为 `context.props.level`。

函数化组件只是一个函数，所以渲染开销也低很多。但同样它也有完整的组件封装，你需要知道这些， 比如：


- 程序化地在多个组件中选择一个
- 在将 children, props, data 传递给子组件之前操作它们。 



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
  <h1>I\'m a template!</h1>\n\
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

}
</style>
{% endraw %}

***

> 原文： http://vuejs.org/guide/render-function.html

***
