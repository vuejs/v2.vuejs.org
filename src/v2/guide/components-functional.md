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
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's only a function with some props.

In cases like this, we can mark components as `functional`, which means that they're stateless (no [reactive data](../api/#Options-Data)) and instanceless (no `this` context). Since functional components are just functions, they're much cheaper to render.

> Note: The lack of a persistent instance also means they won't show up in the [Vue devtools](https://github.com/vuejs/vue-devtools) component tree.

There are two common use-cases for functional components:

* **Presentational** components: frequently-used pieces of a user interface like our linked heading above, simple buttons, form inputs, etc.
* **Higher-order** or **wrapper** components: components that will delegate to other components

A **functional component** can use a template (since 2.5.0+) in a [single file component](single-file-components.html):

``` html
<template functional>
// slots, template logic, etc (v-if and v-for) are all usable here
</template>

<script>
  export default {
    name: 'MyComponent',
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

Each of these is explained in more detail below. In both cases, everything the component needs is passed through `context`, which is an object containing:

- `props`: An object of the provided props
- `children`: An array of the VNode children
- `slots`: A function returning a slots object
- `data`: The entire [data object](render-function.html#The-Data-Object-In-Depth), passed to the component as the 2nd argument of `createElement`
- `parent`: A reference to the parent component
- `listeners`: (2.3.0+) An object containing parent-registered event listeners. This is an alias to `data.on`
- `injections`: (2.3.0+) if using the [`inject`](../api/#provide-inject) option, this will contain resolved injections.

## Presentational Functional Components

### As Single File Components

If you're using single file components for the rest of your app, it may be convenient to use this pattern for presentational functional components too. Building them is much the same as building normal single file components: 

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
    name: 'MyComponent',
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

The `functional` keyword on the `<template>` element makes this a functional compontent. Rather than having access to `name` and `href` props directly, you have access to the `context` object and its `props` property.

You can use this component just as you would any standard component:

```
<my-component name="anchor-1" href="#endnote-1">
  My anchored heading
</my-component>
```

### With Render Functions

In some cases you want to use pure Javascript, in the form of a render function, rather than a template to define your component output. There's a lot to learn about render functions, and you can [read about them on their own page](render-function.html).

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
      [ createElement(
        'a',
        {
          attrs: {
            name: this.name,
            href: this.href
          }
        },
        this.$slots.default
        ) ]
    )
  }
})
```

And now as a functional component, with `functional: true`:

``` js
Vue.component('my-component', {
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
      [ createElement(
        'a',
        {
          attrs: {
            name: context.props.name,
            href: context.props.href
          }
        },
        context.slots().default
        ) ]
    )
  }
})
```

After adding `functional: true`, updating the render function of our anchored heading component requires:

* adding the `context` argument
* updating references to props like: `context.props.name`
* updating `this.$slots.default` to `context.slots().default` (See the [section below](#slots-vs-children) on `slots().default` vs `children`.

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


## Wrapper Components

Functional components can also be useful as wrapper components. For example, when you need to:

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