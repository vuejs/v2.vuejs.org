title: Component System
type: guide
order: 11
---

## Using Components

Vue.js allows you to treat extended Vue subclasses as reusable components that are conceptually similar to [Web Components](http://www.w3.org/TR/components-intro/), without requiring any polyfills. To create a component, just create a subclass constructor of Vue using `Vue.extend()`:

``` js
// Extend Vue to get a reusable constructor
var MyComponent = Vue.extend({
  template: 'A custom component!'
})
```

Most of the options that can be passed into the Vue constructor can be used in `Vue.extend()`, however, there are two special cases, `data` and `el`. Since each Vue instance should have its own `$data` and `$el`, we obviously don't want the value we passed into `Vue.extend()` to be shared across all instances created from that constructor. So when you want to define how a component should initalize its default data or element, you should pass in a function instead:

``` js
var ComponentWithDefaultData = Vue.extend({
  data: function () {
    return {
      title: 'Hello!'
    }
  }
})
```

Then, you can **register** that constructor with `Vue.component()`:

``` js
// Register the constructor with id: my-component
Vue.component('my-component', MyComponent)
```

To make things easier, you can also directly pass in the option object instead of an actual constructor. `Vue.component()` will implicitly call `Vue.extend()` for you if it receives an object:

``` js
// Note: this method returns the global Vue,
// not the registered constructor.
Vue.component('my-component', {
  template: 'A custom component!'
})
```

Then you can use the registered component in a parent instance's template (make sure the component is registered **before** you instantiate your root Vue instance):

``` html
<!-- inside parent template -->
<my-component></my-component>
```

It is important to understand the difference between `Vue.extend()` and `Vue.component()`. Since `Vue` itself is a constructor, `Vue.extend()` is a **class inheritance method**. Its task is to create a sub-class of `Vue` and return the constructor. `Vue.component()`, on the other hand, is an **asset registration method** similar to `Vue.directive()` and `Vue.filter()`. Its task is to associate a given constructor with a string ID so Vue.js can pick it up in templates. When directly passing in options to `Vue.component()`, it calls `Vue.extend()` under the hood.

Vue.js supports two API styles for using components: the imperative, constructor-based API, and the declarative, template-based API. If you are confused, think about how you can create an image element with `new Image()`, or with an `<img>` tag. Each is useful in its own right and Vue.js provides both for maximum flexibility.

<p class="tip">The `table` element has restrictions on what elements can appear inside it, so custom elements will be hoisted out and not render properly. In those cases you can use the component directive syntax: `<tr v-component="my-component"></tr>`. Note this syntax is only available on table elements.</p>

## Data Flow

### Passing Data with Props

By default, components have **isolated scope**. This means you cannot reference parent data in a child component's template. In order to pass data to child components with isolated scope, we need to use `props`.

A "prop" is a field on a component's data that is expected to be received from its parent component. A child component needs to explicitly declare the props it expects to receive using the [`props` option](/api/options.html#props):

``` js
Vue.component('child', {
  // declare the props
  props: ['msg'],
  // the prop can be used inside templates, and will also
  // be set as `this.msg`
  template: '<span>{{msg}}</span>'
})
```

Then, we can pass data to it like so:

``` html
<child msg="hello!"></child>
```

**Result:**

<div id="prop-example-1" class="demo"><child msg="hello!"></child></div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['msg'],
      template: '<span>{&#123;msg&#125;}</span>'
    }
  }
})
</script>

#### Dynamic Props

We can also pass down dynamic data from the parent. For example:

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child msg="{{parentMsg}}"></child>
</div>
```

**Result:**

<div id="demo-2" class="demo"><input v-model="parentMsg"><br><child msg="{&#123;parentMsg&#125;}"></child></div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Inherited message'
  },
  components: {
    child: {
      props: ['msg'],
      template: '<span>{&#123;msg&#125;}</span>'
    }
  }
})
</script>

#### One-Way Props

By default, all props form a two-way binding between the child property and the parent one: when the parent property updates, it will be synced down to the child, and vice-versa. However, it is also possible to enforce a one-way binding that only syncs from the parent to the child by adding `*` at the beginning of the mustache:

``` html
<!-- explicit one-way binding -->
<child msg="{{* parentMsg}}"></child>
```

In addition, if a parent prop expression is not "settable", the binding will automatically be one-way. For example:

``` html
<!-- automatic one-way binding -->
<child msg="{{a + b}}"></child>
```

### Inheriting Parent Scope

If you want, you can also use the `inherit: true` option for your child component to make it prototypally inherit all parent properties:

``` js
var parent = new Vue({
  data: {
    a: 1
  }
})
// $addChild() is an instance method that allows you to
// programatically create a child instance.
var child = parent.$addChild({
  inherit: true,
  data: {
    b: 2
  }
})
console.log(child.a) // -> 1
console.log(child.b) // -> 2
parent.a = 3
console.log(child.a) // -> 3
```

Note this comes with a caveat: because data properties on Vue instances are getter/setters, setting `child.a = 2` will change `parent.a` instead of creating a new property on the child shadowing the parent one:

``` js
child.a = 4
console.log(parent.a) // -> 4
console.log(child.hasOwnProperty('a')) // -> false
```

### A Note on Scope

When a component is used in a parent template, e.g.:

``` html
<!-- parent template -->
<my-component v-show="active" v-on="click:onClick"></my-component>
```

The directives here (`v-show` and `v-on`) will be compiled in the parent's scope, so the value of `active` and `onClick` will be resolved against the parent. Any directives/interpolations inside the child's template will be compiled in the child's scope. This ensures a cleaner separation between parent and child components.

This rule also applies to [content insertion](#Content_Insertion), as explained later in this guide.

## Component Lifecycle

Every component, or Vue instance, has its own lifecycle: it will be created, compiled, attached or detached, and finally destroyed. At each of these key moments the instance will emit corresponding events, and when creating an instance or defining a component, we can pass in lifecycle hook functions to react to these events. For example:

``` js
var MyComponent = Vue.extend({
  created: function () {
    console.log('An instance of MyComponent has been created!')
  }
})
```

Check out the API reference for a [full list of lifecycle hooks](/api/options.html#Lifecycle) that are availble.

## Dynamic Components

You can dynamically switch between components to achieve "page swapping" by using the reserved `<component>` element:

``` js
new Vue({
  el: 'body',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component is="{{currentView}}">
  <!-- content changes when vm.currentview changes! -->
</component>
```

If you want to keep the switched-out components alive so that you can preserve its state or avoid re-rendering, you can add a `keep-alive` directive param:

``` html
<component is="{{currentView}}" keep-alive>
  <!-- inactive components will be cached! -->
</component>
```

### Transition Control

There are two additional attribute parameters that allows advanced control of how dynamic components should transition from one to another.

#### `wait-for`

An event name to wait for on the incoming child component before switching it with the current component. This allows you to wait for asynchronous data to be loaded before triggering the transition to avoid unwanted flash of emptiness in between.

**Example:**

``` html
<component is="{{view}}" wait-for="data-loaded"></component>
```
``` js
// component definition
{
  // fetch data and fire the event asynchronously in the
  // compiled hook. Using jQuery just for example.
  compiled: function () {
    var self = this
    $.ajax({
      // ...
      success: function (data) {
        self.$data = data
        self.$emit('data-loaded')
      }
    })
  }
}
```

#### `transition-mode`

By default, the transitions for incoming and outgoing components happen simultaneously. This param allows you to configure two other modes:

- `in-out`: New component transitions in first, current component transitions out after incoming transition has finished.
- `out-in`: Current component transitions out first, new componnent transitions in after outgoing transition has finished.

**Example**

``` html
<!-- fade out first, then fade in -->
<component
  is="{{view}}"
  v-transition="fade"
  transition-mode="out-in">
</component>
```

## List and Components

For an Array of Objects, you can combine a component with `v-repeat`. In this case, for each Object in the Array, a child component will be created using that Object as its `$data`, and the specified component as the constructor.

``` html
<ul id="list-example">
  <user-profile v-repeat="users"></user-profile>
</ul>
```

``` js
new Vue({
  el: '#list-example',
  data: {
    users: [
      {
        name: 'Chuck Norris',
        email: 'chuck@norris.com'
      },
      {
        name: 'Bruce Lee',
        email: 'bruce@lee.com'
      }
    ]
  },
  components: {
    'user-profile': {
      template: '<li>{{name}} {{email}}</li>',
      replace: true
    }
  }
})
```

**Result:**

<ul id="list-example" class="demo"><user-profile v-repeat="users"></user-profile></ul>
<script>
var parent2 = new Vue({
  el: '#list-example',
  data: {
    users: [
      {
        name: 'Chuck Norris',
        email: 'chuck@norris.com'
      },
      {
        name: 'Bruce Lee',
        email: 'bruce@lee.com'
      }
    ]
  },
  components: {
    'user-profile': {
      template: '<li>{&#123;name&#125;} - {&#123;email&#125;}</li>',
      replace: true
    }
  }
})
</script>

### Repeat Component with Identifier

The identifier syntax also works when using a component, and the repeated data will be set as a property on the component using the identifier as the key:

``` html
<ul id="list-example">
  <!-- data available inside component as `this.user` -->
  <user-profile v-repeat="user:users"></user-profile>
</ul>
```

<p class="tip">Note that once you use a component with `v-repeat`, the same scoping rules apply to the other directives on the component container element. As a result, you won't be able to access `$index` in the parent template; it will become only available inside the component's own template.<br><br>Alternatively, you can use a `<template>` block repeat to create an intermediate scope, but in most cases it's better to use `$index` inside the component.</p>

## Child Reference

Sometimes you might need to access nested child components in JavaScript. To enable that you have to assign a reference ID to the child component using `v-ref`. For example:

``` html
<div id="parent">
  <user-profile v-ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// access child component
var child = parent.$.profile
```

When `v-ref` is used together with `v-repeat`, the value you get will be an Array containing the child components mirroring the data Array.

## Event System

Although you can directly access a Vue instance's children and parent, it is more convenient to use the built-in event system for cross-component communication. It also makes your code less coupled and easier to maintain. Once a parent-child relationship is established, you can dispatch and trigger events using each component's [event instance methods](/api/instance-methods.html#Events).

``` js
var parent = new Vue({
  template: '<child></child>',
  created: function () {
    this.$on('child-created', function (child) {
      console.log('new child created: ')
      console.log(child)
    })
  },
  components: {
    child: {
      created: function () {
        this.$dispatch('child-created', this)
      }
    }
  }
})
```

<script>
var parent = new Vue({
  template: '<child></child>',
  created: function () {
    this.$on('child-created', function (child) {
      console.log('new child created: ')
      console.log(child)
    })
  },
  components: {
    child: {
      created: function () {
        this.$dispatch('child-created', this)
      }
    }
  }
})
</script>

## Private Assets

Sometimes a component needs to use assets such as directives, filters and its own child components, but might want to keep these assets encapsulated so the component itself can be reused elsewhere. You can do that using the private assets instantiation options. Private assets will only be accessible by the instances of the owner component and its child components.

``` js
// All 5 types of assets
var MyComponent = Vue.extend({
  directives: {
    // id : definition pairs same with the global methods
    'private-directive': function () {
      // ...
    }
  },
  filters: {
    // ...
  },
  components: {
    // ...
  },
  partials: {
    // ...
  },
  effects: {
    // ...
  }
})
```

Alternatively, you can add private assets to an existing Component constructor using a chaining API similar to the global asset registration methods:

``` js
MyComponent
  .directive('...', {})
  .filter('...', function () {})
  .component('...', {})
  // ...
```

## Content Insertion

When creating reusable components, we often need to access and reuse the original content in the hosting element, which are not part of the component (similar to the Angular concept of "transclusion".) Vue.js implements a content insertion mechanism that is compatible with the current Web Components spec draft, using the special `<content>` element to serve as insertion points for the original content.

<p class="tip">**Important**: transcluded contents are compiled in the parent component's scope, not in the child's scope.</p>

### Single Insertion Point

When there is only one `<content>` tag with no attributes, the entire original content will be inserted at its position in the DOM and replaces it. Anything originally inside the `<content>` tags is considered **fallback content**. Fallback content will only be displayed if the hosting element is empty and has no content to be inserted. For example:

Template for `my-component`:

``` html
<h1>This is my component!</h1>
<content>This will only be displayed if no content is inserted</content>
```

Parent markup that uses the component:

``` html
<my-component>
  <p>This is some original content</p>
  <p>This is some more original content</p>
</my-component>
```

The rendered result will be:

``` html
<my-component>
  <h1>This is my component!</h1>
  <p>This is some original content</p>
  <p>This is some more original content</p>
</my-component>
```

### Multiple Insertion Points

`<content>` elements have a special attribute, `select`, which expects a CSS selector. You can have multiple `<content>` insertion points with different `select` attributes, and each of them will be replaced by the elements matching that selector from the original content.

<p class="tip">Starting in 0.11.6, `<content>` selectors can only match top-level children of the host node. This keeps the behavior consistent with the Shadow DOM spec and avoids accidentally selecting unwanted nodes in nested transclusions.</p>

For example, suppose we have a `multi-insertion` component with the following template:

``` html
<content select="p:nth-child(3)"></content>
<content select="p:nth-child(2)"></content>
<content select="p:nth-child(1)"></content>
```

Parent markup:

``` html
<multi-insertion>
  <p>One</p>
  <p>Two</p>
  <p>Three</p>
</multi-insertion>
```

The rendered result will be:

``` html
<multi-insertion>
  <p>Three</p>
  <p>Two</p>
  <p>One</p>
</multi-insertion>
```

The content insertion mechanism provides fine control over how original content should be manipulated or displayed, making components extremely flexible and composable.

## Inline Template

In 0.11.6, a special param attribute for components is introduced: `inline-template`. When this param is present, the component will use its inner content as its template rather than transclusion content. This allows more flexible template-authoring.

``` html
<my-component inline-template>
  <p>These are compiled as the component's own template</p>
  <p>Not parent's transclusion content.</p>
</my-component>
```

## Async Components

<p class="tip">Async Components are only supported in Vue ^0.12.0.</p>

In large applications, we may need to divide the app into smaller chunks, and only load a component from the server when it is actually needed. To make that easier, Vue.js allows you to define your component as a factory function that asynchronously resolves your component definition. For example:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

The factory function receives a `resolve` callback, which should be called when you have retrived your component definition from the server. You can also call `reject(reason)` to indicate the load has failed. The `setTimeout` here is simply for demonstration; How to retrieve the component is entirely up to you. One recommended approach is to use async components together with [Webpack's code-splitting feature](http://webpack.github.io/docs/code-splitting.html):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // this special require syntax will instruct webpack to
  // automatically split your built code into bundles which
  // are automatically loaded over ajax requests.
  require(['./my-async-component'], resolve)
})
```

Next: [Applying Transition Effects](/guide/transitions.html).
