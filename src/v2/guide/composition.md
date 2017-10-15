---
title: Component Composition
type: guide
order: 301
---

Vue offers many strategies for building components and sharing functionality between them. Below, we'll provide a description of each strategy, followed by more in-depth explanations of when and how to apply them.

## Overview

- **Merging**

  - __[Extension](#Extension)__: For building more specific components, based on a generic base component.

    ``` js
    var MyComponent = {
      extends: GenericBaseComponent,
      // ... additional/overwriting config ...
    }
    ```

  - __[Mixins](#Mixins)__: For sharing functionality between mostly unrelated components.

    ``` js
    var MyComponent = {
      mixins: [sharedComponentOptions],
      // ... component config ...
    }
    ```

- __[Wrapper Components](#Wrapper-Components)__: For defining variations of a base component with some props/slots already "filled in".

  ``` js
  var MyComponent = {
    components: {
      WrappedComponent: WrappedComponent
    },
    template: `
      <WrappedComponent my-prop="filled-in prop value">
        Filled-in slot content
      </WrappedComponent>
    `,
  }
  ```

- __[Factory Functions](#Factory-Functions)__: For controlling and simplifying how component variations are created.

   ``` js
  function createMyComponent (options) {
    return {
      // ... dynamically generated component config ...
    }
  }
  ```



## Extension

### An Example Use Case

Whenever you want to build a more specific version of an existing component, you may find **extension** useful. For example, let's say you have a generic note component:

``` js
var AppNote = {
  props: {
    type: {
      type: String,
      default: 'info'
    }
  },
  template: `
    <p :class="['note', type]">
      <strong>
        <slot name="bold"/>
      </strong>
      <slot/>
    </p>
  `
}
```

You might use it to display an error like this:

``` html
<info-note type="danger">
  <span slot="bold">Error!</span>
  Something went wrong.
</info-note>
```

But there's a problem. Every time you display an error, you'll have to remember to add `type="danger"` and `Error!` in the `bold` slot. It's easy to make a mistake, resulting in inconsistent error messages.

Ideally, we'd avoid error-prone repetition with an `ErrorNote` component, where we'd simply provide the error text:

``` html
<error-note>
  Something went wrong.
</error-note>
```

Then this component would automatically prefix the content with "Error!" in bold and add the correct class.

### The Problems with Copying Component Definitions

We could create this new `ErrorNote` component by copying and pasting the definition for `AppNote`, then making a few changes:

``` js
var ErrorNote = {
  template: `
    <p class="note danger">
      <strong>
        Error!
      </strong>
      <slot/>
    </p>
  `
}
```

This is the simplest option and sometimes it's appropriate, when two components only _incidentally_ share a lot in common. In this case, however, we probably want all the notes in our application to work mostly the same. For example, if we later added a close button to `AppNote`, we'd now have to add the exact same code to `ErrorNote` and any other variations we created.

Fortunately, there's a better way.

### Merging Options with `extends`

In cases like this, the `extends` option is usually a more appropriate alternative:

``` js
var ErrorNote = {
  extends: AppNote,
  props: {
    type: {
      type: String,
      default: 'danger'
    }
  },
  beforeCreate: function () {
    if (!this.$slots.bold) {
      this.$slots.bold = this.$createElement('span', 'Error!')
    }
  }
}
```

In the above example, `extends` is telling Vue to merge our config with the `AppNote` config. In all cases, the component doing the extension (`ErrorNote`) takes priority, so that:

- The definition for the `type` prop from `AppNote` is replaced with a new definition with a default of `'danger'`.
- A `beforeCreate` hook is added to create a default of `<span>Error!</span>` for the `bold` slot.

### Merging of Instance Properties

For options that create instance properties, such as `props`, `data`, `computed`, and `methods`, Vue's merging does **not** replace the entire definition. For example, in this case:

``` js
var ComponentA = {
  props: {
    foo: String,
    bar: Number
  }
}

var ComponentB = {
  extends: ComponentA,
  props: {
    foo: {
      type: String,
      default: 'hi'
    },
    baz: Boolean
  }
}
```

The resulting options object from the `extends` in `ComponentB` would be:

``` js
{
  props: {
    foo: {
      type: String,
      default: 'hi'
    },
    bar: Number,
    baz: Boolean
  }
}
```

Nothing is removed, prop definitions with the same name are replaced, and any new props are added.

### Merging of Event Handlers

For event handlers (i.e. watchers and lifecycle hooks), merging does not replace existing hooks, but rather adds new hooks to run after the inherited ones.

For example, if both components define `created` hooks like this:

``` js
var ComponentA = {
  created: function () {
    console.log('created from ComponentA')
  }
}

var ComponentB = {
  extends: ComponentA,
  created: function () {
    console.log('created from ComponentB')
  }
}
```

The resulting log will be:

```
created from ComponentA
created from ComponentB
```

The event handler in the extended config runs directly _after_ the one we're extending from.



## Mixins

### Mixins vs Extension

**Mixins** work [like extension](#Merging-of-Instance-Properties), but allow you to define an array of configs instead of only one. For example, these two options do exactly the same thing:

``` js
extends: ComponentA
```

``` js
mixins: [ComponentA]
```

So why have both then? Technically, you _could_ get everything done just with the `mixins` option, but we provide both to best describe their exact role in relation to the component:

- **Extension is for building on a base component**, which will typically contain the template or render function. In the component we extend extending, we usually only add a few deviations from the default behavior.

- **Mixins are for adding shared functionality to many components.** Unlike extended base components, mixins are typically not complete components by themselves. They do not contain a template or render function, leaving that to the components they're used in.

### An Example Use Case

Remember the `AppNote` and `ErrorNote` components [from earlier](#An-Example-Use-Case)? In another application, we might actually want two mostly different components for these use cases:

``` js
var AppNote = {
  template: `
    <blockquote>
      <slot/>
    </blockquote>
  `
}

var ErrorNotification = {
  template: `
    <p class="error">
      <strong>Error!</strong>
      <slot/>
    </p>
  `
}
```

However, there might be some specific behavior we want to be shared, such as the ability to add a close button, which upon click, would hide the component. Then across any relevant components, we could include the mixin and add a `<CloseButton/>` wherever we want it to appear, like this:

``` js
var AppNote = {
  mixins: [closeMixin],
  template: `
    <blockquote>
      <slot/>
      <CloseButton/>
    </blockquote>
  `
}

var ErrorNotification = {
  mixins: [closeMixin],
  template: `
    <p class="error">
      <strong>Error!</strong>
      <slot/>
      <CloseButton/>
    </p>
  `
}
```

And here's mixin definition that actually makes that work:

``` js
var closeMixin = {
  // Register a close button for templates
  components: {
    CloseButton: {
      template: `
        <button v-on:click="$parent.isClosed = true">
          X
        </button>
      `
    }
  },
  // Track of whether the component is closed
  data: function () {
    return {
      isClosed: false
    }
  },
  // Simulate a v-if on the root element
  beforeCreate: function () {
    // Save the original, compiled render function
    var origRender = this._render
    // Replace the original render function
    this._render = function _render () {
      // If the element is closed...
      return this.isClosed
        // Render an empty text node
        ? this._e()
        // Otherwise call the original render
        : origRender.apply(this, arguments)
    }
  }
}
```

Looking at the mixin above, you might be thinking, "Wow, that looks complex!" You're right! Advanced component composition often requires deeper knowledge of both JavaScript and Vue's internals. To write the above mixin, you'd need to be familiar with:

- JavaScript's [`Function.prototype.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply).

- Vue's internal `_render` method, which will either reference a user-provided render function or one created from a compiled, user-provided template.

- Vue's internal `_e` method, which is used to create a placeholder node for falsy `v-if`s without a `v-else`. Internal helpers like this are not currently documented, but you can discover them by trying out the template you want to reproduce with Vue's [template compiler](https://vuejs.org/v2/guide/render-function.html#Template-Compilation).

<p class="tip">Note that <code>_</code>-prefixed methods are not considered part of the stable API, so they may be changed or removed without warning. Using render helpers is considered relatively safe, but accompanying <a href="unit-testing.html">unit tests</a> are recommended to ensure that everything still works after upgrading Vue to a new version.</p>

### Global Mixins

You can also apply a mixin globally, but do this with caution!

<p class="tip">Global mixins affect <strong>every</strong> Vue instance and component, including third-party components.</p>

One appropriate use case, however, is to inject processing logic for custom options, such as in the [VueFire plugin](https://github.com/vuejs/vuefire#usage):

``` js
// Inject handler for a `firebase` custom option
Vue.mixin({
  created: function () {
    var firebaseBindings = this.$options.firebase
    if (firebaseBindings) {
      // Add instance properties and listeners
      // for data from firebase.
    }
  }
})
```

Check out [VueFire's source](https://github.com/search?utf8=%E2%9C%93&q=%22Vue.mixin%22+repo%3Avuejs%2Fvuefire+path%3A%2Fsrc&type=Code) for a complete example.



## Custom Merge Strategies

Plugins often define custom options, which use the default strategy of overwriting any existing value. If you're the author a plugin where this is undesirable, you can define a **custom merge strategy** for your options with `Vue.config.optionMergeStrategies`.

For example, if your plugin uses a `foo` option:

``` js
Vue.config.optionMergeStrategies.foo = function (newValue, baseValue) {
  // Return the correctly merged value
}
```

For most object-based options, you can simply use the same strategy used by `methods`:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.foo = strategies.methods
```

A more advanced example can be found on [Vuex](https://github.com/vuejs/vuex)'s 1.x merging strategy:

``` js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (newValue, baseValue) {
  if (!newValue) return baseValue
  if (!baseValue) return newValue
  return {
    getters: merge(newValue.getters, baseValue.getters),
    state: merge(newValue.state, baseValue.state),
    actions: merge(newValue.actions, baseValue.actions)
  }
}
```



## Wrapper Components

As you've seen, advanced composition with extends and mixins can quickly grow complicated. One simpler alternative is creating **wrapper components**, which provide an interface for another component typically used as its root element.

For example, the `ErrorNote` component we [created earlier with extension](#An-Example-Use-Case) could be refactored to:

``` js
var ErrorNote = {
  components: {
    AppNote: AppNote
  },
  template: `
    <AppNote type="error">
      <span slot="bold">Error!</span>
      <slot/>
    </AppNote>
  `
}
```

Instead of inheriting and building on the interface of a base component, this strategy does **not** provide direct access to the wrapped component. So unlike the `ErrorNote` using extension, this one has its own props (currently none) and its own slots (currently just the default slot).

This is useful when we'd really like to _remove_ options from a base interface. For example, in the case of `ErrorNote`, it'd be very strange for it to be used like this:

``` html
<error-note type="success">
  <span slot="bold">Welcome!</span>
  Would you like to take the tour?
</error-note>
```

Above, a developer has hijacked the component for a new kind of note that is not actually an error. The wrapper version of this component more strictly controls the API, so does not allow this kind of abuse.

<p class="tip">In the example above, <code>type="success"</code> <em>would</em> actually affect the wrapped <code>AppNote</code> component, but as an attribute rather than a prop. To prevent attributes from automatically being added to the root element of a component, use the <a href="../api/#inheritAttrs"><code>inheritAttrs: false</code></a> option.</p>



## Factory Functions

**Factory functions** are functions that return component options, like this:

``` js
function createComponent (options) {
  return {
    // ... dynamically generated component config ...
  }
}
```

Factory functions allow you to better control and simplify how component variations are created. For example, it could be argued that the `ErrorNote` we [created earlier with extension](#An-Example-Use-Case) would be conceptually simpler as a factory function:

``` js
function createNote (options) {
  options = options || {}
  options.props = options.props || {}
  options.slots = options.slots || {}

  return {
    props: {
      type: {
        type: String,
        default: options.props.type || 'info'
      }
    },
    template: `
      <p :class="['note', type]">
        <strong>
          <slot name="bold">${
            options.slots.bold || ''
          }</slot>
        </strong>
        <slot>${
          options.slots.default || ''
        }</slot>
      </p>
    `
  }
}
```

Then we could create our `AppNote` and `ErrorNote` components with:

``` js
var AppNote = createNote()

var ErrorNote = createNote({
  props: {
    type: 'error'
  },
  slots: {
    bold: 'Error!'
  }
})
```

Using this strategy, all notes in the app maintain unified behavior, but _you_ control the API for creating them. This can be especially useful when you want to:

- Create many variations of a component, abstracting away the specific implementation details.
- Give designers, less experienced developers, or members of a very large team the ability to create new component variations, but strictly control what they're allowed to change.
- Dynamically build template strings at runtime, as a more familiar alternative to render functions.

We'll demonstrate the last advantage in the next section.

### Computed Components

Imagine you want a component that generates dynamic headings, with this kind of interface:

``` html
<dynamic-heading :level="headingLevel">
  {{ headingContent }}
</dynamic-heading>
```

So for example, this:

``` html
<dynamic-heading :level="2">
  My heading title
</dynamic-heading>
```

would render to:

``` html
<h2>My heading title</h2>
```

We describe how to do this (and when you might want to) on the [Render Functions](render-function.html) page, but let's imagine you want to avoid learning how to write render functions. You could achieve the same results with a computed factory function that builds a child component config:

``` js
var DynamicHeading = {
  props: {
    level: {
      type: Number,
      required: true
    }
  },
  computed: {
    HeadingComponent: function () {
      return {
        template: `<h${this.level}><slot/></h${this.level}>`
      }
    },
    template: '<component :is="HeadingComponent"><slot/></component>'
  }
}
```
