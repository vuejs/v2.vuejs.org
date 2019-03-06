---
title: Handling Edge Cases
type: guide
order: 106
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

<p class="tip">All the features on this page document the handling of edge cases, meaning unusual situations that sometimes require bending Vue's rules a little. Note however, that they all have disadvantages or situations where they could be dangerous. These are noted in each case, so keep them in mind when deciding to use each feature.</p>

## Element & Component Access

In most cases, it's best to avoid reaching into other component instances or manually manipulating DOM elements. There are cases, however, when it can be appropriate.

### Accessing the Root Instance

In every subcomponent of a `new Vue` instance, this root instance can be accessed with the `$root` property. For example, in this root instance:

```js
// The root Vue instance
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

All subcomponents will now be able to access this instance and use it as a global store:

```js
// Get root data
this.$root.foo

// Set root data
this.$root.foo = 2

// Access root computed properties
this.$root.bar

// Call root methods
this.$root.baz()
```

<p class="tip">This can be convenient for demos or very small apps with a handful of components. However, the pattern does not scale well to medium or large-scale applications, so we strongly recommend using <a href="https://github.com/vuejs/vuex">Vuex</a> to manage state in most cases.</p>

### Accessing the Parent Component Instance

Similar to `$root`, the `$parent` property can be used to access the parent instance from a child. This can be tempting to reach for as a lazy alternative to passing data with a prop.

<p class="tip">In most cases, reaching into the parent makes your application more difficult to debug and understand, especially if you mutate data in the parent. When looking at that component later, it will be very difficult to figure out where that mutation came from.</p>

There are cases however, particularly shared component libraries, when this _might_ be appropriate. For example, in abstract components that interact with JavaScript APIs instead of rendering HTML, like these hypothetical Google Maps components:

```html
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```

The `<google-map>` component might define a `map` property that all subcomponents need access to. In this case `<google-map-markers>` might want to access that map with something like `this.$parent.getMap`, in order to add a set of markers to it. You can see this pattern [in action here](https://jsfiddle.net/chrisvfritz/ttzutdxh/).

Keep in mind, however, that components built with this pattern are still inherently fragile. For example, imagine we add a new `<google-map-region>` component and when `<google-map-markers>` appears within that, it should only render markers that fall within that region:

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

Then inside `<google-map-markers>` you might find yourself reaching for a hack like this:

```js
var map = this.$parent.map || this.$parent.$parent.map
```

This has quickly gotten out of hand. That's why to provide context information to descendent components arbitrarily deep, we instead recommend [dependency injection](#Dependency-Injection).

### Accessing Child Component Instances & Child Elements

Despite the existence of props and events, sometimes you might still need to directly access a child component in JavaScript. To achieve this you can assign a reference ID to the child component using the `ref` attribute. For example:

```html
<base-input ref="usernameInput"></base-input>
```

Now in the component where you've defined this `ref`, you can use:

```js
this.$refs.usernameInput
```

to access the `<base-input>` instance. This may be useful when you want to, for example, programmatically focus this input from a parent. In that case, the `<base-input>` component may similarly use a `ref` to provide access to specific elements inside it, such as:

```html
<input ref="input">
```

And even define methods for use by the parent:

```js
methods: {
  // Used to focus the input from the parent
  focus: function () {
    this.$refs.input.focus()
  }
}
```

Thus allowing the parent component to focus the input inside `<base-input>` with:

```js
this.$refs.usernameInput.focus()
```

When `ref` is used together with `v-for`, the ref you get will be an array containing the child components mirroring the data source.

<p class="tip"><code>$refs</code> are only populated after the component has been rendered, and they are not reactive. It is only meant as an escape hatch for direct child manipulation - you should avoid accessing <code>$refs</code> from within templates or computed properties.</p>

### Dependency Injection

Earlier, when we described [Accessing the Parent Component Instance](#Accessing-the-Parent-Component-Instance), we showed an example like this:

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

In this component, all descendants of `<google-map>` needed access to a `getMap` method, in order to know which map to interact with. Unfortunately, using the `$parent` property didn't scale well to more deeply nested components. That's where dependency injection can be useful, using two new instance options: `provide` and `inject`.

The `provide` options allows us to specify the data/methods we want to **provide** to descendent components. In this case, that's the `getMap` method inside `<google-map>`:

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

Then in any descendants, we can use the `inject` option to receive specific properties we'd like to add to that instance:

```js
inject: ['getMap']
```

You can see the [full example here](https://jsfiddle.net/chrisvfritz/tdv8dt3s/). The advantage over using `$parent` is that we can access `getMap` in _any_ descendant component, without exposing the entire instance of `<google-map>`. This allows us to more safely keep developing that component, without fear that we might change/remove something that a child component is relying on. The interface between these components remains clearly defined, just as with `props`.

In fact, you can think of dependency injection as sort of "long-range props", except:

* ancestor components don't need to know which descendants use the properties it provides
* descendant components don't need to know where injected properties are coming from

<p class="tip">However, there are downsides to dependency injection. It couples components in your application to the way they're currently organized, making refactoring more difficult. Provided properties are also not reactive. This is by design, because using them to create a central data store scales just as poorly as <a href="#Accessing-the-Root-Instance">using <code>$root</code></a> for the same purpose. If the properties you want to share are specific to your app, rather than generic, or if you ever want to update provided data inside ancestors, then that's a good sign that you probably need a real state management solution like <a href="https://github.com/vuejs/vuex">Vuex</a> instead.</p>

Learn more about dependency injection in [the API doc](https://vuejs.org/v2/api/#provide-inject).

## Programmatic Event Listeners

So far, you've seen uses of `$emit`, listened to with `v-on`, but Vue instances also offer other methods in its events interface. We can:

- Listen for an event with `$on(eventName, eventHandler)`
- Listen for an event only once with `$once(eventName, eventHandler)`
- Stop listening for an event with `$off(eventName, eventHandler)`

You normally won't have to use these, but they're available for cases when you need to manually listen for events on a component instance. They can also be useful as a code organization tool. For example, you may often see this pattern for integrating a 3rd-party library:

```js
// Attach the datepicker to an input once
// it's mounted to the DOM.
mounted: function () {
  // Pikaday is a 3rd-party datepicker library
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// Right before the component is destroyed,
// also destroy the datepicker.
beforeDestroy: function () {
  this.picker.destroy()
}
```

This has two potential issues:

- It requires saving the `picker` to the component instance, when it's possible that only lifecycle hooks need access to it. This isn't terrible, but it could be considered clutter.
- Our setup code is kept separate from our cleanup code, making it more difficult to programmatically clean up anything we set up.

You could resolve both issues with a programmatic listener:

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

Using this strategy, we could even use Pikaday with several input elements, with each new instance automatically cleaning up after itself:

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

See [this fiddle](https://jsfiddle.net/chrisvfritz/1Leb7up8/) for the full code. Note, however, that if you find yourself having to do a lot of setup and cleanup within a single component, the best solution will usually be to create more modular components. In this case, we'd recommend creating a reusable `<input-datepicker>` component.

To learn more about programmatic listeners, check out the API for [Events Instance Methods](https://vuejs.org/v2/api/#Instance-Methods-Events).

<p class="tip">Note that Vue's event system is different from the browser's <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget API</a>. Though they work similarly, <code>$emit</code>, <code>$on</code>, and <code>$off</code> are <strong>not</strong> aliases for <code>dispatchEvent</code>, <code>addEventListener</code>, and <code>removeEventListener</code>.</p>

## Circular References

### Recursive Components

Components can recursively invoke themselves in their own template. However, they can only do so with the `name` option:

``` js
name: 'unique-name-of-my-component'
```

When you register a component globally using `Vue.component`, the global ID is automatically set as the component's `name` option.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

If you're not careful, recursive components can also lead to infinite loops:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

A component like the above will result in a "max stack size exceeded" error, so make sure recursive invocation is conditional (i.e. uses a `v-if` that will eventually be `false`).

### Circular References Between Components

Let's say you're building a file directory tree, like in Finder or File Explorer. You might have a `tree-folder` component with this template:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Then a `tree-folder-contents` component with this template:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

When you look closely, you'll see that these components will actually be each other's descendent _and_ ancestor in the render tree - a paradox! When registering components globally with `Vue.component`, this paradox is resolved for you automatically. If that's you, you can stop reading here.

However, if you're requiring/importing components using a __module system__, e.g. via Webpack or Browserify, you'll get an error:

```
Failed to mount component: template or render function not defined.
```

To explain what's happening, let's call our components A and B. The module system sees that it needs A, but first A needs B, but B needs A, but A needs B, etc. It's stuck in a loop, not knowing how to fully resolve either component without first resolving the other. To fix this, we need to give the module system a point at which it can say, "A needs B _eventually_, but there's no need to resolve B first."

In our case, let's make that point the `tree-folder` component. We know the child that creates the paradox is the `tree-folder-contents` component, so we'll wait until the `beforeCreate` lifecycle hook to register it:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

Or alternatively, you could use Webpack's asynchronous `import` when you register the component locally:

``` js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

Problem solved!

## Alternate Template Definitions

### Inline Templates

When the `inline-template` special attribute is present on a child component, the component will use its inner content as its template, rather than treating it as distributed content. This allows more flexible template-authoring.

``` html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

Your inline template needs to be defined inside the DOM element to which Vue is attached.

<p class="tip">However, <code>inline-template</code> makes the scope of your templates harder to reason about. As a best practice, prefer defining templates inside the component using the <code>template</code> option or in a <code>&lt;template&gt;</code> element in a <code>.vue</code> file.</p>

### X-Templates

Another way to define templates is inside of a script element with the type `text/x-template`, then referencing the template by an id. For example:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

Your x-template needs to be defined outside the DOM element to which Vue is attached.

<p class="tip">These can be useful for demos with large templates or in extremely small applications, but should otherwise be avoided, because they separate templates from the rest of the component definition.</p>

## Controlling Updates

Thanks to Vue's Reactivity system, it always knows when to update (if you use it correctly). There are edge cases, however, when you might want to force an update, despite the fact that no reactive data has changed. Then there are other cases when you might want to prevent unnecessary updates.

### Forcing an Update

<p class="tip">If you find yourself needing to force an update in Vue, in 99.99% of cases, you've made a mistake somewhere.</p>

You may not have accounted for change detection caveats [with arrays](https://vuejs.org/v2/guide/list.html#Caveats) or [objects](https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats), or you may be relying on state that isn't tracked by Vue's reactivity system, e.g. with `data`.

However, if you've ruled out the above and find yourself in this extremely rare situation of having to manually force an update, you can do so with [`$forceUpdate`](../api/#vm-forceUpdate).

### Cheap Static Components with `v-once`

Rendering plain HTML elements is very fast in Vue, but sometimes you might have a component that contains **a lot** of static content. In these cases, you can ensure that it's only evaluated once and then cached by adding the `v-once` directive to the root element, like this:

``` js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```

<p class="tip">Once again, try not to overuse this pattern. While convenient in those rare cases when you have to render a lot of static content, it's simply not necessary unless you actually notice slow rendering -- plus, it could cause a lot of confusion later. For example, imagine another developer who's not familiar with <code>v-once</code> or simply misses it in the template. They might spend hours trying to figure out why the template isn't updating correctly.</p>
