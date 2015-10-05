title: Component System
type: guide
order: 11
---

## Using Components

### Registration

We've learned in the previous sections that we can create a component constructor using `Vue.extend()`:

``` js
var MyComponent = Vue.extend({
  // options...
})
```

To use this constructor as a component, you need to **register** it with `Vue.component(tag, constructor)`:

``` js
// Globally register the component with tag: my-component
Vue.component('my-component', MyComponent)
```

Once registered, the component can now be used in a parent instance's template as a custom element, `<my-component>`. Make sure the component is registered **before** you instantiate your root Vue instance. Here's the full example:

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// define
var MyComponent = Vue.extend({
  template: '<div>A custom component!</div>'
})

// register
Vue.component('my-component', MyComponent)

// create a root instance
new Vue({
  el: '#example'
})
```

Which will render:

``` html
<div id="example">
  <div>A custom component!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

Note the component's template **replaces** the custom element, which only serves as a **mounting point**. This behavior can be configured using the `replace` instance option.

### Local Registration

You don't have to register every component globally. You can make a component available only in the scope of another component by registering it with the `components` instance option:

``` js
var Child = Vue.extend({ /* ... */ })

var Parent = Vue.extend({
  template: '...',
  components: {
    // <my-component> will only be available in Parent's template
    'my-component': Child
  }
})
```

The same encapsulation applies for other assets types such as directives, filters and transitions.

### Registration Sugar

To make things easier, you can directly pass in the options object instead of an actual constructor to `Vue.component()` and the `component` option. Vue.js will automatically call `Vue.extend()` for you under the hood:

``` js
// extend and register in one step
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})

// also works for local registration
var Parent = Vue.extend({
  components: {
    'my-component': {
      template: '<div>A custom component!</div>'
    }
  }
})
```

### Component Option Caveats

Most of the options that can be passed into the Vue constructor can be used in `Vue.extend()`, with two special cases: `data` and `el`. Imagine we simply pass an object as `data` to `Vue.extend()`:

``` js
var data = { a: 1 }
var MyComponent = Vue.extend({
  data: data
})
```

The problem with this is that the same `data` object will be shared across all instances of `MyComponent`! This is most likely not what we want, so we should use a function that returns a fresh object as the `data` option:

``` js
var MyComponent = Vue.extend({
  data: function () {
    return { a: 1 }
  }
})
```

The `el` option also requires a function value when used in `Vue.extend()`, for exactly the same reason.

### `is` attribute

Some HTML elements, for example `<table>`, has restrictions on what elements can appear inside it. Custom elements that are not in the whitelist will be hoisted out and thus not render properly. In such cases you should use the `is` special attribute to indicate a custom element:

``` html
<table>
  <tr is="my-component"></tr>
</table>
```

## Props

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
  <child my-message="{{parentMsg}}"></child>
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

### Prop Validation

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

In addition, `type` can also be a custom constructor function and the assertion will be made with an `instanceof` check.

When a prop validation fails, Vue will refuse to set the value on the child component, and throw a warning if using the development build.

## Parent-Child Communication

### Parent Chain

### Custom Events

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

### Child Component Refs

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

## Content Distribution with Slots

When creating reusable components, we often need to access and reuse the original content in the hosting element, which are not part of the component (similar to the Angular concept of "transclusion".) Vue.js implements a content insertion mechanism that is compatible with the current Web Components spec draft, using the special `<content>` element to serve as insertion points for the original content.

### Compilation Scope

Every Vue.js component is a separate Vue instance with its own scope. It's important to understand how scopes work when using components. The rule of thumb is:

> If something appears in the parent template, it will be compiled in parent scope; if it appears in child template, it will be compiled in child scope.

A common mistake is trying to bind a directive to a child property/method in the parent template:

``` html
<div id="demo">
  <!-- does NOT work -->
  <child-component v-on="click: childMethod"></child-component>
</div>
```

If you need to bind child-scope directives on a component root node, you should do so in the child component's own template:

``` js
Vue.component('child-component', {
  // this does work, because we are in the right scope
  template: '<div v-on="click: childMethod">Child</div>',
  methods: {
    childMethod: function () {
      console.log('child method invoked!')
    }
  }
})
```

Similarly, HTML content inside a component container are considered "transclusion content". They will not be inserted anywhere unless the child template contains at least one `<content></content>` outlet. The inserted contents are also compiled in parent scope:

``` html
<div>
  <child-component>
    <!-- compiled in parent scope -->
    <p>{{msg}}</p>
  </child-component>
</div>
```

You can use the `inline-template` attribute to indicate you want the content to be compiled in the child scope as the child's template:

``` html
<div>
  <child-component inline-template>
    <!-- compiled in child scope -->
    <p>{{msg}}</p>
  </child-component>
</div>
```

### Single Slot

When there is only one `<content>` tag with no attributes, the entire original content will be inserted at its position in the DOM and replaces it. Anything originally inside the `<content>` tags is considered **fallback content**. Fallback content will only be displayed if the hosting element is empty and has no content to be inserted. For example:

Template for `my-component`:

``` html
<div>
  <h1>This is my component!</h1>
  <content>This will only be displayed if no content is inserted</content>
</div>
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
<div>
  <h1>This is my component!</h1>
  <p>This is some original content</p>
  <p>This is some more original content</p>
</div>
```

### Multiple Slots

`<content>` elements have a special attribute, `select`, which expects a CSS selector. You can have multiple `<content>` insertion points with different `select` attributes, and each of them will be replaced by the elements matching that selector from the original content.

<p class="tip">Starting in 0.11.6, `<content>` selectors can only match top-level children of the host node. This keeps the behavior consistent with the Shadow DOM spec and avoids accidentally selecting unwanted nodes in nested transclusions.</p>

For example, suppose we have a `multi-insertion` component with the following template:

``` html
<div>
  <content select="p:nth-child(3)"></content>
  <content select="p:nth-child(2)"></content>
  <content select="p:nth-child(1)"></content>
</div>
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
<div>
  <p>Three</p>
  <p>Two</p>
  <p>One</p>
</div>
```

The content insertion mechanism provides fine control over how original content should be manipulated or displayed, making components extremely flexible and composable.

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

### `activate` Hook

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

## Misc

### Async Components

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

### Fragment Instance

When you use the `template` option, the content of the template will replace the element the Vue instance is mounted on. It is therefore recommended to always include a single root-level element in templates.

There are a few conditions that will turn a Vue instance into a **fragment instance**:

1. Template contains only another component.
2. Template contains multiple top-level elements.
3. Template contains only plain text.
4. Template contains only a `<partial>`.
5. Template root node has `v-if` or `v-for`.

The reason is that all of the above cause the instance to have an unknown number of top-level elements, so it has to manage its DOM content as a fragment. A fragment instance will still render the content correctly. However, it will **not** have a root node, and its `$el` will point to an "anchor node", which is an empty Text node (or a Comment node in debug mode).

What's more important though, is that **non-terminal directives, transitions and attributes (except for props) on the component element will be ignored**, because there is no root element to bind them to:

``` html
<!-- doesn't work due to no root element -->
<example v-show="ok" transition="fade"></example>

<!-- props work -->
<example :prop="someData"></example>

<!-- v-if and v-for work as well, but without transitions -->
<example v-if="ok"></example>
```

There are, of course, valid use cases for fragment instances, but it is in general a good idea to give your component template a single, plain root element. It ensures directives and attributes on the component element to be properly transferred, and also results in slightly better performance.

### Inline Template

When the `inline-template` special attribute is present on a child component, the component will use its inner content as its template, rather than treating it as distributed content. This allows more flexible template-authoring.

``` html
<my-component inline-template>
  <p>These are compiled as the component's own template</p>
  <p>Not parent's transclusion content.</p>
</my-component>
```

However, `inline-template` makes the scope of your templates harder to reason about, and makes the component's template compilation un-cachable. As a best practice, prefer defining templates inside the component using the `template` option.

Next: [Applying Transition Effects](/guide/transitions.html).
