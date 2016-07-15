---
title: Render Functions
type: guide
order: 12.5
---

## Basics

Let's say you want to create a component for anchored headings, like this:

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

For the HTML above, you decide you want an interface like this:

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

While templates work great for most components, it's clear that this isn't one of them. We need the full programmatic power of JavaScript, which Vue offers in an alternative to templates: the **render function**.

Rewriting that component with a render function looks like this:

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
  // An HTML tag name, component options, or function returning one of these. Required.
  'div',

  // {Object}
  // An options object corresponding to the attributes you would use in a template. Optional.
  {
    // Normal HTML attributes and component props
    attrs: {
      id: 'foo'
    },
    // DOM properties
    props: {
      innerHTML: 'bar'
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

  // {Array | Function => Array | String}
  // Children VNodes. When the first argument is a component definition, children must be a function returning an array. When the first argument is an HTML tag name, you can just use an array of VNodes directly. Optional.
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
      ? getTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render (createElement) {
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
        attrs: {
          level: 1
        }
      },
      // Here's the thunk
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

<p class="tip">If you do not use a thunk </p>

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

## Higher-Order Components

A few template features compile to higher-order components instead of being passed through the options object.

### `keep-alive`

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

### `transition-mode`

``` html
<my-component transition-mode="out-in"></my-component>
```

compiles to:

``` js
h('transition-control', {
  props: {
    child: h(MyComponent),
    mode: 'out-in'
  }
})
```
