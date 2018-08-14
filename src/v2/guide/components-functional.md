---
title: Functional Components
type: guide
order: 105
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

## Introduction

Consider a simple anchored heading component, whose output might look like:

``` html
<h1>
  <a name="anchor-1" href="#endnote-1">
    Hello world!
  </a>
</h1>
```

It doesn't need to manage any state, or watch any state passed to it, and it has no lifecycle methods. It only needs to accept a couple of props, `name` and  `href`.

In cases like this, we can mark components as `functional`, which means that they're stateless (no [reactive data](../api/#Options-Data)) and instanceless (no `this` context). Since functional components are just functions, they're much cheaper to render.

> Note: The lack of a persistent instance also means they won't show up in the [Vue devtools](https://github.com/vuejs/vue-devtools) component tree.

There are two common use-cases for functional components:

* **Presentational** components: frequently-used pieces of a user interface, like our linked heading above, simple buttons, form inputs, etc.
* **Higher-order** or **wrapper** components: components that will delegate to other components

A **functional component** can use a template (since 2.5.0+) in a [single-file component](single-file-components.html):

``` html
<template functional>
// slots, template logic, etc (v-if and v-for) are all usable here
</template>

<script>
  export default {
    name: 'my-component',
    props: {
    // ...
    }
  }
</script>
```

or a [render function](render-function.html):

``` js
Vue.component('my-component', {
  functional: true,
  props: {
    // ...
  },
  render: function (createElement, context) {
    // ...
  }
})
```

> Note: in versions before 2.3.0, the `props` option is required if you wish to accept props in a functional component. In 2.3.0+ you can omit the `props` option and all attributes found on the component node will be implicitly extracted as props.

 <a id="context-object"></a> Each of these approaches is explained in more detail below. In both cases, everything the component needs is passed through `context`, which is an object containing:

- `props`: An object of the provided props
- `children`: An array of the VNode children
- `slots`: A function returning a slots object
- `data`: The entire [data object](render-function.html#The-Data-Object-In-Depth), passed to the component as the 2nd argument of `createElement`
- `parent`: A reference to the parent component
- `listeners`: (2.3.0+) An object containing parent-registered event listeners. This is an alias to `data.on`
- `injections`: (2.3.0+) if using the [`inject`](../api/#provide-inject) option, this will contain resolved injections.

## Presentational Functional Components

### As Single-File Components

If you're using single-file components for the rest of your app, it may be convenient to use this pattern for presentational functional components too. Building them is much the same as building normal single-file components: 

``` html
<template functional>
  <h1>
    <a name="props.name" href="props.href">
      <slot></slot>
    </a>
  </h1>
</template>

<script>
  export default {
    name: 'my-functional-component',
    props: {
      name: {
        required: true;
        type: String;
      },
      href: {
        required: true,
        type: String
      }
    }
  }
</script>
```

The `functional` keyword on the `<template>` element makes this a functional compontent. Rather than having access to the `name` and `href` props directly, we have access to the `context` object and its `props` property.

This component can be used just as any standard component:

```
<my-functional-component name="anchor-1" href="#endnote-1">
  My anchored heading
</my-functional-component>
```

### With Render Functions

In some cases we may use pure Javascript, in the form of a render function, rather than a template, to define component output. There's a lot to learn about render functions, and you can [read about them on their own page](render-function.html).

A presentational functional component can be written with a render function. Consider our anchored heading again, first as a **standard** component:

``` js
Vue.component('my-component', {
  props: {
    name: {
      required: true,
      type: String
    },
    href: {
      required: true,
      type: String
    }
  },
  render: function (createElement) {
    return createElement( 
      'h1',
      [ 
        createElement(
          'a',
          {
            attrs: {
              name: this.name,
              href: this.href
            }
          },
          this.$slots.default
        )
      ]
    )
  }
})
```

And now as a **functional** component, with `functional: true`:

``` js
Vue.component('my-functional-component', {
  functional: true,
  props: {
    name: {
      required: true,
      type: String
    },
    href: {
      required: true,
      type: String
    }
  },
  render: function (createElement, context) {
    return createElement( 
      'h1',
      [ 
        createElement(
          'a',
          {
            attrs: {
              name: context.props.name,
              href: context.props.href
            }
          },
          context.slots().default
        )
      ]
    )
  }
})
```

After adding `functional: true`, updating the render function of our anchored heading component requires:

* adding the `context` argument
* updating references to props like: `context.props.name`
* updating `this.$slots.default` to `context.slots().default` (See the [section below](#slots-vs-children) on `slots().default` vs `children`).

### `slots()` vs `children`

You may wonder why the [context object](#context-object) provides both `slots()` and `children`. Wouldn't `slots().default` be the same as `children`? In some cases, yes - but what if you have a functional component with the following children?

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

For this component, `children` will give you an array of both paragraphs, `slots().default` will give you only the second, and `slots().foo` will give you only the first. Having both `children` and `slots()` therefore allows you to choose whether this component knows about a slot system or perhaps delegates that responsibility to another component by passing along `children`.


## Wrapper Components

Functional components can also be useful as wrapper components. For example, when you need to:

- Programmatically choose one of several other components to delegate to
- Manipulate children, props, or data before passing them on to a child component

Here's an example of a `smart-list` component that delegates to more specific components, depending on the props passed to it:

``` js

/* The first argument of createElement can take a component options object, 
or a function that resolves to one */

var EmptyList = { /* component options */ }
var TableList = function(items) { 
                  return { /* component options */ }
                }
var OrderedList = function(items) { 
                  return { /* component options */ }
                }
var UnorderedList = function(items) { 
                  return { /* component options */ }
                }

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
      if (typeof items[0] === 'object') return TableList(items)
      if (context.props.isOrdered)      return OrderedList(items)

      return UnorderedList(items)
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  }
})
```

### Passing Attributes and Events to Child Elements or Components

On normal components, attributes *not* defined as props are automatically added to the root element of the component, replacing or [intelligently merging with](class-and-style.html) any existing attributes of the same name.

For example, given this component:

```html
<template>
  <button>
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'my-standard-button'
  }
</script>
```

the following usage will produce a `button` element with `aria-role="button"`, and a click handler that calls `sayHelloWorld`:

```
<my-standard-button @click="sayHelloWorld" aria-role="button">
  Click me
</my-standard-button>
```

Functional components, however, require you to explicitly define this behavior:

```html
<template functional>
  <button
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'my-functional-button'
  }
</script>
```

Since we have access to the `context` object, we can use `data.attrs` to pass along any HTML attributes and `listeners` (the alias for `data.on`) to pass along any event listeners.

When using a render function, we can pass `context.data` (the entire [data object](render-function.html#The-Data-Object-In-Depth)) as the second argument to `createElement`. In doing so, we are transparently passing down any attributes or event listeners used on `my-functional-button`. It's so transparent, in fact, that events don't even require the `.native` modifier.

```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // Transparently pass any attributes, event listeners, children, etc.
    return createElement('button', context.data, context.children)
  }
})
```
