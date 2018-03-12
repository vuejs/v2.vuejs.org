---
title: Component Registration
type: guide
order: 101
---

## Component Names

When registering a component, it will always be given a name. When using a component directly in the DOM (as opposed to in a string template or single-file component), we strongly recommend following the [W3C rules](https://www.w3.org/TR/custom-elements/#concepts) for custom tag names (all-lowercase, must contain a hyphen).

You can see other recommendations for component names [in the Style Guide](../style-guide/#Base-component-names-strongly-recommended).

## Global Registration

So far, we've only created components using `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

These components are **globally registered**. That means they can be used in the template of any root Vue instance (`new Vue`) created after registration. For example:

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-a>
  <component-c></component-c>
</div>
```

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

This also applies to all subcomponents. That means all three of these components will be available _inside each other_.

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

Note that **locally registered components are _not_ automatically available in subcomponents**. For example, if you want `ComponentA` to be available in `ComponentB`, you have to use:

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

### Local Registration in a Module System

If you're not using a build tool like Webpack, or module system with `import`/`require`, you can probably stop reading now. this will more likely look like:

```html
<template>
  <div>
    <ComponentA/>
    <ComponentB/>
  </div>
</template>

<script>
import ComponentA from './ComponentA'

export default {
  components: {
    ComponentA
  },
  // ...
}
<script>
```

## Tips

<p class="tip">Note that Vue does not enforce the [W3C rules](https://www.w3.org/TR/custom-elements/#concepts) for custom tag names (all-lowercase, must contain a hyphen) though following this convention is considered good practice.</p>

### Programmatic Regis
