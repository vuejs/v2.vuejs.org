---
title: Render Functions
type: guide
order: 14
---

## Basics

Vue recommends using templates to build your HTML in the vast majority of cases. There are situations however, where you really need the full programmatic power of JavaScript. That's where you can use the **render  function**, a closer-to-the-compiler alternative to templates.

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

When you get started with a component that just generates a heading based on the `level` prop, you quickly arrive at this:

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

That template doesn't feel great. It's not only verbose, but we're duplicating `<slot></slot>` for every heading level and will have to do the same when we add the anchor element. The whole thing is also wrapped in a useless `div` because components must contain exactly one root node.

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

Much simpler! Sort of. The code is shorter, but also requires greater familiarity with Vue instance properties. In this case, you have to know that when you pass children without a `slot` attribute into a component, like the `Hello world!` inside of `anchored-heading`, those children are stored on the component instance at `$slots.default`. If you haven't already, **it's recommended to read through the [instance properties API](http://localhost:4000/api/#Instance-Properties) before diving into render functions.**

## `createElement` Arguments

The second thing you'll have to become familiar with is how to use template features in the `createElement` function:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // An HTML tag name, component options, or function
  // returning one of these. Required.
  'div',

  // {Object}
  // An options object corresponding to the attributes
  // you would use in a template. Optional.
  {
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
    // Event handlers are nested under "on", though
    // modifiers such as in v-on:keyup.enter are not
    // supported. You'll have to manually check the
    // keyCode in the handler instead.
    on: {
      click: this.clickHandler
    },
    // Same API as `v-bind:class`
    class: {
      foo: true,
      bar: false
    },
    // Same API as `v-bind:style`
    style: {
      color: 'red',
      fontSize: '14px'
    },
    // Other special top-level properties
    key: 'myKey',
    ref: 'myRef'
  }

  // {String | Array | Function}
  // Children VNodes. When the first argument is a
  // component definition, children must be a function
  // returning an array. When the first argument is an
  // HTML tag name, you can just use an array of
  // VNodes directly. Optional.
  [
    createElement('h1', ['hello world'])
    createElement(MyComponent, {
      props: {
        someProp: 'foo'
      }
    }),
    'bar'
  ]
)
```

With this knowledge, we can finish the component we started:

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

## Rendering Components with Children

As mentioned above, components with children must use a thunk: i.e. a function that returns an array of children, rather than the array of children directly. This delays children creation until the component itself is rendered, allowing more efficient re-renders.

For example:

``` js
new Vue({
  el: '#demo',
  render: function (createElement) {
    return createElement(
      Vue.options.components['anchored-heading'],
      {
        props: {
          level: 1
        }
      },
      // Here's the "thunk"
      function () {
        return [
          createElement('span', 'Hello'),
          ' world!'
        ]
      }
    )
  }
})
```

## JSX

If you're writing a lot of `render` functions, it might feel painful that we're using 14 lines above in place of this much simpler and arguably more readable template:

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
  render (h) {
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

The anchored heading component we created earlier is relatively simple. It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's just a function with some props.

In cases like this, we can mark components as `functional`, which means that they're stateless (no `data`) and instanceless (no `this` context). A **functional component** looks like this:

``` js
Vue.component('my-component', {
  functional: true,
  // To compensate for the lack of an instance,
  // we are now provided a 2nd options argument.
  render: function (createElement, options) {
    // ...
  },
  // Props are optional
  props: {
    // ...
  }
})
```

Everything the component needs is passed through `options`, which is an object containing:

- `props`: An object of the provided props
- `children`: A function returning the children
- `data`: The entire data object passed to the component
- `parent`: A reference to the parent component

After adding `functional: true`, updating the render function of our anchored heading component would simply require adding the `options` argument, updating `this.$slots.default` to `options.children`, then updating `this.level` to `options.props.level`.

Since functional components are just functions, they're much cheaper to render. They're also very useful as wrapper components. For example, when you need to:

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
  render: function (createElement, options) {
    function appropriateListComponent {
      var items = options.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (options.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      options.data,
      options.children
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

## Misc

### `keep-alive`

Instead of being passed through the options object, the `keep-alive` attribute actually compiles to a higher-order component.

``` html
<my-component keep-alive></my-component>
```

compiles to:

``` js
h('keep-alive', {
  props: {
    child: h(MyComponent)
  }
})
```
