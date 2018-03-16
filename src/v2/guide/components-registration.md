---
title: Component Registration
type: guide
order: 101
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

## Component Names

When registering a component, it will always be given a name. For example, in the global registration we've seen so far:

```js
Vue.component('my-component-name', { /* ... */ })
```

The component's name is the first argument of `Vue.component`.

The name you give a component may depend on where you intend to use it. When using a component directly in the DOM (as opposed to in a string template or [single-file component](single-file-components.html)), we strongly recommend following the [W3C rules](https://www.w3.org/TR/custom-elements/#concepts) for custom tag names (all-lowercase, must contain a hyphen). This helps you avoid conflicts with current and future HTML elements.

You can see other recommendations for component names in the [Style Guide](../style-guide/#Base-component-names-strongly-recommended).

## Global Registration

So far, we've only created components using `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

These components are **globally registered**. That means they can be used in the template of any root Vue instance (`new Vue`) created after registration. For example:

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-a>
  <component-c></component-c>
</div>
```

This even applies to all subcomponents, meaning all three of these components will also be available _inside each other_.

## Local Registration

Global registration often isn't ideal. For example, if you're using a build system like Webpack, globally registering all components means that even if you stop using a component, it could still be included in your final build. This unnecessarily increases the amount of JavaScript your users have to download.

In these cases, you can define your components as plain JavaScript objects:

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

Then define the components you'd like to use in a `components` option:

```js
new Vue({
  el: '#app'
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

For each property in the `components` object, the key will be the name of the custom element, while the value will contain the options object for the component.

Note that **locally registered components are _not_ also available in subcomponents**. For example, if you wanted `ComponentA` to be available in `ComponentB`, you'd have to use:

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

## Module Systems

If you're not using a module system with `import`/`require`, you can probably skip this section for now. If you are, we have some special instructions and tips just for you.

### Local Registration in a Module System

If your still here, then it's likely you're using a module system, we recommend creating a `components` folder to keep your components in, with each component in its own file.

Then you'll need to import each component you'd like to use, before you locally register it. For example, in a hypothetical `CompononentB.js` file:

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

> Note that in ES2015+, placing a variable name like `ComponentA` inside an object is shorthand for `ComponentA: ComponentA`, meaning the name of the variable is both:
>
> - the custom element name to use in the template, and
> - the name of the variable containing the component options

### Automatic Global Registration of Base Components

Many of your components will be relatively generic, possibly only wrapping an an element like an input or a button. We sometimes refer to these as [base components](../style-guide/#Base-component-names-strongly-recommended) and they tend to be used very frequently across your components.

The result is that many components may include long lists of base components:

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

Just to support relatively little markup in a template:

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

Fortunately, if you're using Webpack (or [Vue CLI 3+](https://github.com/vuejs/vue-cli), which uses Webpack internally), you can use `require.context` to globally register only these very common base components. Here's an example of the code you might use:

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      fileName
        // Strip the leading `'./` from the filename
        .replace(/^\.\//, '')
        // Strip the extension from the filename
        .replace(/\.\w+$/, '')
    )
  )

  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
```

Remember that **global registration must take place before the root Vue instance is created (with `new Vue`)**. [Here's an example](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js) of this pattern in a real project context.