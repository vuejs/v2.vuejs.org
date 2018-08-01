---
title: Functional Components
type: guide
order: 105
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

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
