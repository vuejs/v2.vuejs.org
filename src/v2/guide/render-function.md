---
title: Render Functions & JSX
type: guide
order: 303
---

## Basics

Vue recommends using templates to build your HTML in the vast majority of cases. There are situations however, where you really need the full programmatic power of JavaScript. That's where you can use the **render function**, a closer-to-the-compiler alternative to templates.

Let's dive into a simple example where a `render` function would be practical. Say you want to generate anchored headings:

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

For the HTML above, you decide you want this component interface:

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

When you get started with a component that only generates a heading based on the `level` prop, you quickly arrive at this:

``` html
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
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

That template doesn't feel great. It's not only verbose, but we're duplicating `<slot></slot>` for every heading level and will have to do the same when we add the anchor element.

While templates work great for most components, it's clear that this isn't one of them. So let's try rewriting it with a `render` function:

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name
      this.$slots.default // array of children
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

Much simpler! Sort of. The code is shorter, but also requires greater familiarity with Vue instance properties. In this case, you have to know that when you pass children without a `slot` attribute into a component, like the `Hello world!` inside of `anchored-heading`, those children are stored on the component instance at `$slots.default`. If you haven't already, **it's recommended to read through the [instance properties API](../api/#Instance-Properties) before diving into render functions.**

## Nodes, Trees, and the Virtual DOM

Before we dive into render functions, it’s important to know a little about how browsers work. Take this HTML for example:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline  -->
</div>
```

When a browser reads this code, it builds a [tree of "DOM nodes"](https://javascript.info/dom-nodes) to help it keep track of everything, just as you might build a family tree to keep track of your extended family.

The tree of DOM nodes for the HTML above looks like this:

![DOM Tree Visualization](/images/dom-tree.png)

Every element is a node. Every piece of text is a node. Even comments are nodes! A node is just a piece of the page. And as in a family tree, each node can have children (i.e. each piece can contain other pieces).

Updating all these nodes efficiently can be difficult, but thankfully, you never have to do it manually. Instead, you tell Vue what HTML you want on the page, in a template:

```html
<h1>{{ blogTitle }}</h1>
```

Or a render function:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

And in both cases, Vue automatically keeps the page updated, even when `blogTitle` changes.

### The Virtual DOM

Vue accomplishes this by building a **virtual DOM** to keep track of the changes it needs to make to the real DOM. Taking a closer look at this line:

``` js
return createElement('h1', this.blogTitle)
```

What is `createElement` actually returning? It's not _exactly_ a real DOM element. It could perhaps more accurately be named `createNodeDescription`, as it contains information describing to Vue what kind of node it should render on the page, including descriptions of any child nodes. We call this node description a "virtual node", usually abbreviated to **VNode**. "Virtual DOM" is what we call the entire tree of VNodes, built by a tree of Vue components.

## `createElement` Arguments

The next thing you'll have to become familiar with is how to use template features in the `createElement` function. Here are the arguments that `createElement` accepts:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // An HTML tag name, component options, or async
  // function resolving to one of these. Required.
  'div',

  // {Object}
  // A data object corresponding to the attributes
  // you would use in a template. Optional.
  {
    // (see details in the next section below)
  },

  // {String | Array}
  // Children VNodes, built using `createElement()`,
  // or using strings to get 'text VNodes'. Optional.
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

### The Data Object In-Depth

One thing to note: similar to how `v-bind:class` and `v-bind:style` have special treatment in templates, they have their own top-level fields in VNode data objects. This object also allows you to bind normal HTML attributes as well as DOM properties such as `innerHTML` (this would replace the `v-html` directive):

``` js
{
  // Same API as `v-bind:class`, accepting either
  // a string, object, or array of strings and objects.
  class: {
    foo: true,
    bar: false
  },
  // Same API as `v-bind:style`, accepting either
  // a string, object, or array of objects.
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Normal HTML attributes
  attrs: {
    id: 'foo'
  },
  // Component props
  props: {
    myProp: 'bar'
  },
  // DOM properties
  domProps: {
    innerHTML: 'baz'
  },
  // Event handlers are nested under `on`, though
  // modifiers such as in `v-on:keyup.enter` are not
  // supported. You'll have to manually check the
  // keyCode in the handler instead.
  on: {
    click: this.clickHandler
  },
  // For components only. Allows you to listen to
  // native events, rather than events emitted from
  // the component using `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Custom directives. Note that the `binding`'s
  // `oldValue` cannot be set, as Vue keeps track
  // of it for you.
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
  // Scoped slots in the form of
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // The name of the slot, if this component is the
  // child of another component
  slot: 'name-of-slot',
  // Other special top-level properties
  key: 'myKey',
  ref: 'myRef'
}
```

### Complete Example

With this knowledge, we can now finish the component we started:

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

### Constraints

#### VNodes Must Be Unique

All VNodes in the component tree must be unique. That means the following render function is invalid:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Yikes - duplicate VNodes!
    myParagraphVNode, myParagraphVNode
  ])
}
```

If you really want to duplicate the same element/component many times, you can do so with a factory function. For example, the following render function is a perfectly valid way of rendering 20 identical paragraphs:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Replacing Template Features with Plain JavaScript

### `v-if` and `v-for`

Wherever something can be easily accomplished in plain JavaScript, Vue render functions do not provide a proprietary alternative. For example, in a template using `v-if` and `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

This could be rewritten with JavaScript's `if`/`else` and `map` in a render function:

``` js
props: ['items'],
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

There is no direct `v-model` counterpart in render functions - you will have to implement the logic yourself:

``` js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

This is the cost of going lower-level, but it also gives you much more control over the interaction details compared to `v-model`.

### Event & Key Modifiers

For the `.passive`, `.capture` and `.once` event modifiers, Vue offers prefixes that can be used with `on`:

| Modifier(s) | Prefix |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` or<br>`.once.capture` | `~!` |

For example:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

For all other event and key modifiers, no proprietary prefix is necessary, because you can use event methods in the handler:

| Modifier(s) | Equivalent in Handler |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Keys:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (change `13` to [another key code](http://keycode.info/) for other key modifiers) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (change `ctrlKey` to `altKey`, `shiftKey`, or `metaKey`, respectively) |

Here's an example with all of these modifiers used together:

```javascript
on: {
  keyup: function (event) {
    // Abort if the element emitting the event is not
    // the element the event is bound to
    if (event.target !== event.currentTarget) return
    // Abort if the key that went up is not the enter
    // key (13) and the shift key was not held down
    // at the same time
    if (!event.shiftKey || event.keyCode !== 13) return
    // Stop event propagation
    event.stopPropagation()
    // Prevent the default keyup handler for this element
    event.preventDefault()
    // ...
  }
}
```

### Slots

You can access static slot contents as Arrays of VNodes from [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

And access scoped slots as functions that return VNodes from [`this.$scopedSlots`](../api/#vm-scopedSlots):

``` js
props: ['message'],
render: function (createElement) {
  // `<div><slot :text="message"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.message
    })
  ])
}
```

To pass scoped slots to a child component using render functions, use the `scopedSlots` field in VNode data:

``` js
render: function (createElement) {
  return createElement('div', [
    createElement('child', {
      // pass `scopedSlots` in the data object
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

If you're writing a lot of `render` functions, it might feel painful to write something like this:

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

Especially when the template version is so simple in comparison:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

That's why there's a [Babel plugin](https://github.com/vuejs/babel-plugin-transform-vue-jsx) to use JSX with Vue, getting us back to a syntax that's closer to templates:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Aliasing `createElement` to `h` is a common convention you'll see in the Vue ecosystem and is actually required for JSX. If `h` is not available in the scope, your app will throw an error.</p>

For more on how JSX maps to JavaScript, see the [usage docs](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Functional Components

The anchored heading component we created earlier is relatively simple. It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's only a function with some props.

In cases like this, we can mark components as `functional`, which means that they're stateless (no [reactive data](../api/#Options-Data)) and instanceless (no `this` context). A **functional component** looks like this:

``` js
Vue.component('my-component', {
  functional: true,
  // Props are optional
  props: {
    // ...
  },
  // To compensate for the lack of an instance,
  // we are now provided a 2nd context argument.
  render: function (createElement, context) {
    // ...
  }
})
```

> Note: in versions before 2.3.0, the `props` option is required if you wish to accept props in a functional component. In 2.3.0+ you can omit the `props` option and all attributes found on the component node will be implicitly extracted as props.

In 2.5.0+, if you are using [single-file components](single-file-components.html), template-based functional components can be declared with:

``` html
<template functional>
</template>
```

Everything the component needs is passed through `context`, which is an object containing:

- `props`: An object of the provided props
- `children`: An array of the VNode children
- `slots`: A function returning a slots object
- `data`: The entire [data object](#The-Data-Object-In-Depth), passed to the component as the 2nd argument of `createElement`
- `parent`: A reference to the parent component
- `listeners`: (2.3.0+) An object containing parent-registered event listeners. This is an alias to `data.on`
- `injections`: (2.3.0+) if using the [`inject`](../api/#provide-inject) option, this will contain resolved injections.

After adding `functional: true`, updating the render function of our anchored heading component would require adding the `context` argument, updating `this.$slots.default` to `context.children`, then updating `this.level` to `context.props.level`.

Since functional components are just functions, they're much cheaper to render. However, the lack of a persistent instance means they won't show up in the [Vue devtools](https://github.com/vuejs/vue-devtools) component tree.

They're also very useful as wrapper components. For example, when you need to:

- Programmatically choose one of several other components to delegate to
- Manipulate children, props, or data before passing them on to a child component

Here's an example of a `smart-list` component that delegates to more specific components, depending on the props passed to it:

``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  },
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
  }
})
```

### Passing Attributes and Events to Child Elements/Components

On normal components, attributes not defined as props are automatically added to the root element of the component, replacing or [intelligently merging with](class-and-style.html) any existing attributes of the same name.

Functional components, however, require you to explicitly define this behavior:

```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // Transparently pass any attributes, event listeners, children, etc.
    return createElement('button', context.data, context.children)
  }
})
```

By passing `context.data` as the second argument to `createElement`, we are passing down any attributes or event listeners used on `my-functional-button`. It's so transparent, in fact, that events don't even require the `.native` modifier.

If you are using template-based functional components, you will also have to manually add attributes and listeners. Since we have access to the individual context contents, we can use `data.attrs` to pass along any HTML attributes and `listeners` _(the alias for `data.on`)_ to pass along any event listeners.

```html
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot/>
  </button>
</template>
```

### `slots()` vs `children`

You may wonder why we need both `slots()` and `children`. Wouldn't `slots().default` be the same as `children`? In some cases, yes - but what if you have a functional component with the following children?

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

For this component, `children` will give you both paragraphs, `slots().default` will give you only the second, and `slots().foo` will give you only the first. Having both `children` and `slots()` therefore allows you to choose whether this component knows about a slot system or perhaps delegates that responsibility to another component by passing along `children`.

## Template Compilation

You may be interested to know that Vue's templates actually compile to render functions. This is an implementation detail you usually don't need to know about, but if you'd like to see how specific template features are compiled, you may find it interesting. Below is a little demo using `Vue.compile` to live-compile a template string:

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
