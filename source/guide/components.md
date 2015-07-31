title: Component System
type: guide
order: 11
---

## Using Components

Vue.js allows you to treat extended Vue subclasses as reusable components that are conceptually similar to [Web Components](http://www.w3.org/TR/components-intro/), without requiring any polyfills. To create a component, just create a subclass constructor of Vue using `Vue.extend()`:

``` js
// Extend Vue to get a reusable constructor
var MyComponent = Vue.extend({
  template: '<p>A custom component!</p>'
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
  template: '<p>A custom component!</p>'
})
```

Then you can use the registered component in a parent instance's template (make sure the component is registered **before** you instantiate your root Vue instance):

``` html
<!-- inside parent template -->
<my-component></my-component>
```

Which will render:

``` html
<p>A custom component!</p>
```

You don't have to register every component globally. You can limit a component's availability to another component and its descendents by passing it in with the `components` option (this encapsulation also applies to other assets such as directives and filters):

``` js
var Parent = Vue.extend({
  components: {
    child: {
      // child will only be available to Parent
      // and Parent's descendent components
    }
  }
})
```

It is important to understand the difference between `Vue.extend()` and `Vue.component()`. Since `Vue` itself is a constructor, `Vue.extend()` is a **class inheritance method**. Its task is to create a sub-class of `Vue` and return the constructor. `Vue.component()`, on the other hand, is an **asset registration method** similar to `Vue.directive()` and `Vue.filter()`. Its task is to associate a given constructor with a string ID so Vue.js can pick it up in templates. When directly passing in options to `Vue.component()`, it calls `Vue.extend()` under the hood.

Vue.js supports two API styles for using components: the imperative, constructor-based API, and the declarative, template-based API. If you are confused, think about how you can create an image element with `new Image()`, or with an `<img>` tag. Each is useful in its own right and Vue.js provides both for maximum flexibility.

<p class="tip">The `table` element has restrictions on what elements can appear inside it, so custom elements will be hoisted out and not render properly. In those cases you can use the component directive syntax: `<tr v-component="my-component"></tr>`.</p>

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

### camelCase vs. Hyphenated

HTML attributes are case-insensitive. When using camelCased prop names as attributes, you need to use their hyphenated equivalents:

``` js
Vue.component('child', {
  props: ['myMessage'],
  template: '<span>{{myMessage}}</span>'
})
```

``` html
<!-- important: use hyphenated names! -->
<child my-message="hello!"></child>
```

### Dynamic Props

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

<p class="tip">It is also possible to expose `$data` as a prop. The passed in value must be an Object and will replace the component's default `$data`.</p>

### Passing Callbacks as Props

It is also possible to pass down a method or a statement as a callback to a child component. This enables declarative, decoupled parent-child communication:

``` js
Vue.component('parent', {
  // ...
  methods: {
    onChildLoaded: function (msg) {
      console.log(msg)
    }
  }
})

Vue.component('child', {
  // ...
  props: ['onLoad'],
  ready: function () {
    this.onLoad('message from child!')
  }
})
```

``` html
<!-- in parent's template -->
<child on-load="{{onChildLoaded}}"></child>
```

### Prop Binding Types

By default, all props form a **one-way-down** binding between the child property and the parent one: when the parent property updates, it will be synced down to the child, but not the other way around. This default is meant to prevent child components from accidentally mutating the parent's state, which can make your app's data flow harder to reason about. However, it is also possible to explicitly enforce a two-way or a one-time binding:

Compare the syntax:

``` html
<!-- default, one-way-down binding -->
<child msg="{{parentMsg}}"></child>
<!-- explicit two-way binding -->
<child msg="{{@ parentMsg}}"></child>
<!-- explicit one-time binding -->
<child msg="{{* parentMsg}}"></child>
```

The two-way binding will sync the change of child's `msg` property back to the parent's `parentMsg` property. The one-time binding, once set up, will not sync future changes between the the parent and the child.

<p class="tip">Note that if the prop being passed down is an Object or an Array, it is passed by reference. Mutating the Object or Array itself inside the child will affect parent state, regardless of the binding type you are using.</p>

### Prop Specification

It is possible for a component to specify the requirements for the props it is receiving. This is useful when you are authoring a component that is intended to be used by others, as these prop validation requirements essentially constitute your component's API, and ensure your users are using your component correctly. Instead of defining the props as strings, you can use Objects that contain validation requirements:

``` js
Vue.component('example', {
  props: {
    // basic type check (`null` means accept any type)
    onSomeEvent: Function,
    // check presence
    requiredProp: {
      type: String,
      required: true
    },
    // with default value
    propWithDefault: {
      type: Number,
      default: 100
    },
    // object/array defaults should be returned from a
    // factory function
    propWithObjectDefault: {
      type: Object,
      default: function () {
        return { msg: 'hello' }
      }
    },
    // a two-way prop. will throw warning if binding type
    // does not match.
    twoWayProp: {
      twoWay: true
    },
    // custom validator function
    greaterThanTen: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

The `type` can be one of the following native constructors:

- String
- Number
- Boolean
- Function
- Object
- Array

In addition, `type` can also be a custom constructor function and the the assertion will be made with an `instanceof` check.

When a prop validation fails, Vue will refuse the set the value on the child component, and throw a warning if using the development build.

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

Read more details on [Component Scope](/guide/best-practices.html#Component_Scope).

## Component Lifecycle

Every component, or Vue instance, has its own lifecycle: it will be created, compiled, attached or detached, and finally destroyed. At each of these key moments the instance will emit corresponding events, and when creating an instance or defining a component, we can pass in lifecycle hook functions to react to these events. For example:

``` js
var MyComponent = Vue.extend({
  created: function () {
    console.log('An instance of MyComponent has been created!')
  }
})
```

Check out the API reference for a [full list of lifecycle hooks](/api/options.html#Lifecycle) that are available.

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

## Transition Control

There are two additional param attributes that allows advanced control of how components should be rendered / transitioned.

### `wait-for`

An event name to wait for on the incoming child component before inserting it into the DOM. This allows you to wait for asynchronous data to be loaded before triggering the transition and avoid displaying empty content.

This attribute can be used both on static and dynamic components. Note: for dynamic components, all components that will potentially get rendered must `$emit` the awaited event, otherwise they will never get inserted.

**Example:**

``` html
<!-- static -->
<my-component wait-for="data-loaded"></my-component>

<!-- dynamic -->
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

### `transition-mode`

The `transition-mode` param attribute allows you to specify how the transition between two dynamic components should be executed.

By default, the transitions for incoming and outgoing components happen simultaneously. This attribute allows you to configure two other modes:

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
      template: '<li>{{name}} {{email}}</li>'
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
      template: '<li>{&#123;name&#125;} - {&#123;email&#125;}</li>'
    }
  }
})
</script>

### Repeat Component with alias

The alias syntax also works when using a component, and the repeated data will be set as a property on the component using the alias as the key:

``` html
<ul id="list-example">
  <!-- data available inside component as `this.user` -->
  <user-profile v-repeat="user in users"></user-profile>
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
  template: '<div><child></child></div>',
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
}).$mount()
```

<script>
var parent = new Vue({
  template: '<div><child></child></div>',
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
}).$mount()
</script>

## Private Assets

Sometimes a component needs to use assets such as directives, filters and its own child components, but might want to keep these assets encapsulated so the component itself can be reused elsewhere. You can do that using the private assets instantiation options. Private assets will only be accessible by the instances of the owner component, components that inherit from it, and its child components in the view hierarchy.

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

<p class="tip">You can prohibit child components from accessing a parent component's private assets by setting `Vue.config.strict = true`.</p>

Alternatively, you can add private assets to an existing Component constructor using a chaining API similar to the global asset registration methods:

``` js
MyComponent
  .directive('...', {})
  .filter('...', function () {})
  .component('...', {})
  // ...
```

### Asset Naming Convention

Some assets, such as components and directives, appear in templates in the form of HTML attributes or HTML custom tags. Since HTML attribute names and tag names are **case-insensitive**, we often need to name our assets using dash-case instead of camelCase. **Starting in 0.12.9**, it is now supported to name your assets using camelCase, and use them in templates with dash-case.

**Example**

``` js
// in a component definition
components: {
  // register using camelCase
  myComponent: { /*... */ }
}
```

``` html
<!-- use dash case in templates -->
<my-component></my-component>
```

This works nicely with [ES6 object literal shorthand](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_6):

``` js
import compA from './components/a';
import compB from './components/b';

export default {
  components: {
    // use in templates as <comp-a> and <comp-b>
    compA,
    compB
  }
}
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

In large applications, we may need to divide the app into smaller chunks, and only load a component from the server when it is actually needed. To make that easier, Vue.js allows you to define your component as a factory function that asynchronously resolves your component definition. Vue.js will only trigger the factory function when the component actually needs to be rendered, and will cache the result for future re-renders. For example:

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
