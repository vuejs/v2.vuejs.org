---
title: Migration from v1.x
type: guide
order: 24
---

If you're upgrading an existing application or just want tips on replacing deprecated features, you're in the right place.

How things are ordered:

1. Likelihood that you're using the feature
2. Likelihood of the change breaking your in a subtle way, rather than very obvious way with great warnings

## Templates

### Single root node (console warning)

## Global Config

### ~~`Vue.config.debug`~~ (migration helper)

deprecated, no longer useful since warnings come with stack traces by default now

### ~~`Vue.config.async`~~ (migration helper)

deprecated, async is required for rendering performance

### ~~`Vue.config.delimiters`~~ (migration helper)

reworked as a component-level option

### ~~`Vue.config.unsafeDelimiters`~~ (migration helper)

deprecated, use v-html

## Global API

### ~~`Vue.elementDirective`~~ (migration helper)

deprecated, just use components

### ~~`Vue.partial`~~ (migration helper)

deprecated, use functional components

### `Vue.extend` with `el` (console warning)

The el option can no longer be used in Vue.extend. It can now only be used as an instance creation option.

### `Vue.set` and `Vue.delete` on Vue instances (migration helper, console warning)

Vue.set and Vue.delete cannot work on Vue instances. It is now mandatory to properly declare all top-level reactive properties in the data option.

Avoid deleting properties on a Vue instance or its root $data - just set it to null.

## Instance DOM Options

### `replace` (migration helper)

deprecated, components now must have exactly one root element.

## Props

### `coerce` (migration helper)

deprecated. If you want to convert a prop, setup a local computed value based on it.

### `twoWay` (migration helper)

deprecated (v-model can work on components)

### `v-bind.once` and `v-bind.sync` (migration helper)

are deprecated. Props are now always one-way down. To produce side effects in the parent scope, a component needs to explicitly emit an event instead of relying on implicit binding.

### Prop Mutation (console warning)

Mutating a prop locally is now considered an anti-pattern, e.g. declaring a prop a and then set this.a = someOtherValue in the component. Due to the new rendering mechanism, whenever the parent component re-renders, the child component's local changes will be overwritten. In general, in 2.0 you should treat props as immutable. Most use cases of mutating a prop can be replaced by either a data property or a computed property.

### `props` on root instance (NOTHING)

root instance can no longer use template props (use propsData instead)

## Lifecycle Hooks

### ~~`beforeCompile`~~ -> `created` (migration helper)

deprecated, use created

### ~~`compiled`~~ -> `mounted` (migration helper)

deprecated, use mounted

### `attached` (migration helper)

deprecated, use custom in-dom check in other hooks

### `detached` (migration helper)

deprecated, use custom in-dom check in other hooks

### ~~`init`~~ --> `beforeCreate` (migration helper)

### ~~`ready`~~ -> `mounted` (migration helper)

deprecated, use mounted (there's no longer the guarantee to be in-document) - for that use Vue.nextTick

## Instance Methods

### `vm.$get` (console error, migration helper)

deprecated, just retrieve values directly

### `vm.$set` (console error, migration helper)

deprecated, use Vue.set

### `vm.$delete` (console error, migration helper)

deprecated, use Vue.delete

### `vm.$eval` (console error, migration helper)

deprecated, no real use

### `vm.$interpolate` (console error, migration helper)

deprecated, no real use

### `vm.$log` (console error, migration helper)

deprecated, use devtools

### `vm.$appendTo` (console error, migration helper)

deprecated, just use native DOM API on vm.$el.

### `vm.$before` (console error, migration helper)

deprecated

### `vm.$after` (console error, migration helper)

deprecated

### `vm.$remove` (console error, migration helper)

deprecated

### `vm.$watch` (CHANGED)

User watchers created via vm.$watch are now fired before the associated component re-renders. This gives the user a chance to further update other state before the component re-render, thus avoiding unnecessary updates. For example, you can watch a component prop and update the component's own data when the prop changes.

To do something with the DOM after component updates, just use the `updated` lifecycle hook.

## `v-for`

### Argument order (migration helper)

New array syntax

value in arr
(value, index) in arr (switched order of arguments to be more consistent with JavaScript's forEach and map)

New object syntax

value in obj
(value, key) in obj (switched order of arguments, partly to be more consistent with many common object iterators, such as lodash's)
(value, key, index) in obj (index will now be available in object iteration for visual purposes, such as table striping)

### ~~`$index`~~ and ~~`$key`~~ (console error, migration helper)

## Transitions (migration helper)

changed radically

### ~~`stagger`~~

deprecated, set and access data-index on el instead

## Built-in Directives

### `v-else` with `v-show` (migration helper)

v-else no longer works with v-show - just use negation expression.

### `v-on` for native events (NOTHING - no way to warn when listening for native events that could never be )

When used on a custom component, v-on now only listens to custom events $emitted by that component. (no longer listens to DOM events)

### `v-bind` falsy/truthy binding (NOTHING)

Attribute binding behavior change: only null, undefined and false are considered falsy when binding attributes. This means 0 and empty strings will render as-is. For enumerated attributes. This means :draggable="''" will render as draggable="true".

Also, for enumerated attributes, in addition to the falsy values above, the string value of "false" will also render as attr="false".

### `v-bind:style` with `!important` (migration helper)

:style no longer supports inline !important

### `v-model` with `debounce` (migration helper)

deprecated, use v-on:input + 3rd party debounce function

Debouncing is used to limit how often we execute Ajax requests and other expensive operations. Vue's debounce attribute parameter for v-model makes this easy, but it also debounces state updates rather than the expensive operations themselves, which comes with limitations.

These limitations become apparent when designing a search indicator. Take a look at that example. Using the debounce attribute, there'd be no way to detect a dirty input before the search begins, because we'd lose access to the input's real-time state. By decoupling the debounce function from Vue, we're able to debounce only the operation we want to limit.

There will be other times when debouncing isn't quite the right wrapper function. In the very common example of hitting an API for search suggestions, waiting to offer suggestions until after the user has stopped typing isn't an ideal experience. What you probably want instead is a throttling function. Now since you're already using a utility library like lodash for debounce, refactoring to use throttle instead takes only a few seconds!

### `v-model` with `lazy` or `number` (migration helper)

The lazy and number params are now modifiers:

<input v-model.lazy="text">
New modifier: .trim - trims the input, as the name suggests.

The debounce param has been deprecated. (See upgrade tip at bottom)

v-model no longer cares about initial inline value. It will always treat the Vue instance data as the source of truth. This means the following will render with a value of 1 instead of 2:

data: {
  val: 1
}
<input v-model="val" value="2">
Same goes for <textarea> with existing content. So instead of:

<textarea v-model="val">hello world</textarea>
Do:

data () {
  return {
    val: 'hello world'
  }
}
<textarea v-model="val"></textarea>
The main idea is that the JS side should be considered the source of truth, not your templates.

v-model no longer works when used on a v-for iterated primitive value:

<input v-for="str in strings" v-model="str">
This doesn't work because it's the equivalent of this in JavaScript:

strings.map(function (str) {
  return createElement('input', ...)
})
As you can see, setting str to another value in the iterator function will do nothing because it's just a local variable in the function scope. Instead, you should use an array of objects so that v-model can update the field on the object:

<input v-for="obj in objects" v-model="obj.str">

### `v-el` and `v-ref` (migration helper)

For simplicity, `v-el` and `v-ref` have been merged into the `ref` attribute. That means `v-el:my-element` would become `ref="myElement"` and `v-ref:my-component` would become `ref="myComponent"`. This changes brings a few advantages:

v-ref is now no longer a directive: it is now a special attribute similar to key and transition:

<!-- before -->
<comp v-ref:foo></comp>

<!-- after -->
<comp ref="foo"></comp>
Dynamic ref bindings are now also supported:

<comp :ref="dynamicRef"></comp>
vm.$els and vm.$refs are merged. When used on a normal element the ref will be the DOM element, and when used on a component the ref will be the component instance.

vm.$refs are no longer reactive, because they are registered/updated during the render process itself. Making them reactive would require duplicate renders for every change.

On the other hand, $refs are designed primarily for programmatic access in JavaScript - it is not recommended to rely on $refs in templates because it entails referring to state that does not belong to the instance itself.

#### Dynamic references

Previously, `v-el`/`v-ref` combined with `v-for` would produce an array of elements/components, because there was no way to give each item a unique name. You can still achieve this behavior by given each

- `replace(/\b(?:v-el|v-ref):([\w-]+)\b/g, 'ref="$1"')`
- no longer transform to camelCase

## Custom Directives (CHANGED, migration helper)

In general, in 2.0 directives have a greatly reduced scope of responsibility: they are now only used for applying low-level direct DOM manipulations. In most cases, you should prefer using Components as the main code-reuse abstraction.

Directives no longer have instances - this means there's no more this inside directive hooks and bind, update and unbind now receives everything as arguments.

Note the binding object is immutable, setting binding.value will have no effect, and properties added to it will not be persisted. You can persist directive state on el if you absolutely need to:

<div v-example:arg.modifier="a.b"></div>
// example directive
export default {
  bind (el, binding, vnode) {
    // the binding object exposes value, oldValue, expression, arg and modifiers.
    binding.expression // "a.b"
    binding.arg // "arg"
    binding.modifiers // { modifier: true }
    // the context Vue instance can be accessed as vnode.context.
  },

  // update has a few changes, see below
  update (el, binding, vnode, oldVnode) { ... },

  // componentUpdated is a new hook that is called AFTER the entire component
  // has completed the current update cycle. This means all the DOM would
  // be in updated state when this hook is called. Also, this hook is always
  // called regardless of whether this directive's value has changed or not.
  componentUpdated (el, binding, vnode, oldVNode) { ... },

  unbind (el, binding, vnode) { ... }
}
You can use destructuring if you only care about the value:

export default {
  bind (el, { value }) {
    // ...
  }
}
In addition, the update hook has a few changes:

It no longer gets called automatically after bind.

It now always gets calls when the component is re-rendered, regardless of whether the value it's bound to has changed or not. You can compare binding.value === binding.oldValue to skip unnecessary updates, but there are also cases where you'd want to always apply updates, e.g. when the directive is bound to an Object that might have been mutated instead of replaced.

elementDirective, directive params and directive options such as acceptStatement, deep etc. are all deprecated.

## Events

### `Vue.directive('on').keyCodes` -> `Vue.config.keyCodes` (console error, migration helper)

### `$dispatch` and `$broadcast` (console error, migration helper)

The reason that we are deprecating $dispatch and $broadcast is that event flows that depend on the components tree structure can be hard to reason about when the components tree becomes large (simply put: it doesn't scale well in large apps and we don't want to set you up for pain later). $dispatch and $broadcast also do not solve the communication between sibling components. Instead, you can use a pattern similar to the EventEmitter in Node.js: a centralized event hub that allows components to communicate, no matter where they are in the components tree. Because Vue instances implement the event emitter interface, you can actually use an empty Vue instance for that purpose:

var bus = new Vue()
// in component A's method
bus.$emit('id-selected', 1)
// in component B's created hook
bus.$on('id-selected', this.someMethod)
And don't forget to use $off to unbind the event.

// in component B's destroyed hook
bus.$off('id-selected', this.someMethod)
This pattern can serve as a replacement for $dispatch and $broadcast in simple scenarios. But for more complex cases, it is recommended to introduce a dedicated state management layer using Vuex.

## Filters

### Filters Outside Text Interpolations (migration helper)

Filters can now only be used inside text interpolations ({% raw %}{{}}{% endraw %} tags). In the past we've found using filters with directives such as v-model, v-on etc. led to more complexity than convenience, and for list filtering on v-for it is more appropriate to move that logic into JavaScript as computed properties.

### Filter Argument Syntax (console error - could be migration helper)

The filter syntax has changed to be more inline with JavaScript function invocation, instead of taking space-delimited arguments:

{% raw %}{{ date | formatDate('YY-MM-DD') }}{% endraw %}

For list filtering with v-for - one of the more common usage of filters - it is now recommended to use computed properties that return a processed copy of the original Array (see updated data grid example). The benefits is that you are no longer limited by the arbitrary filter syntax/API - it's just plain JavaScript now, and you naturally have access to the filtered result because it is a computed property.

Also see this discussion thread.

### Built-In Filters

Vue 2.0 will not ship with any built-in filters. It is recommended to use standalone libraries dedicated for solving problems in a specific domain, e.g. moment.js for formatting dates and accounting.js for formatting financial currencies. You are also welcome to create your own filter pack and share it with the community!

deprecated

#### capitalize (console error - could be migration helper)

#### uppercase (console error - could be migration helper)

#### lowercase (console error - could be migration helper)

#### currency (console error - could be migration helper)

#### pluralize (console error - could be migration helper)

#### json (console error - could be migration helper)

no longer needed - output is stringified for you

#### debounce (console error, migration helper)

#### limitBy (console error, migration helper)

#### filterBy (console error, migration helper)

#### orderBy (console error, migration helper)

## Slots

### Duplicate Slots (NOTHING)

It is no longer supported to have duplicate <slot>s with the same name in the same template. When a slot is rendered it is "used up" and cannot be rendered elsewhere in the same render tree.

### Slot Attribute Styling (NOTHING - could be migraton helper)

Content inserted via named <slot> no longer preserves the slot attribute. Use a wrapper element to style them, or, for advanced use cases, modify the inserted content programmatically using render functions.

## Special Attributes

### `track-by` (migration helper)

track-by has been replaced with key. It now follows the same rule for binding an attribute: without v-bind: or : prefix, it is treated as a literal string. In most cases you'd want to use a dynamic binding, which expects a full expression instead of a string key. For example:

<!-- 1.x -->
<div v-for="item in items" track-by="id">

<!-- 2.0 -->
<div v-for="item in items" :key="item.id">

### `keep-alive` (migration helper)

keep-alive is no longer a special attribute: it is now a wrapper component, similar to <transition>:

  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
This makes it possible to use keep-alive on multiple conditional children (note the children should eventually evaluate to a single child - any child other than the first one will be ignored):

  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>
When used together with <transition>, make sure to nest it inside:

  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>

## Interpolations

### One-Time Bindings (console error, migration helper)

One time bindings ({% raw %}{{* foo }}{% endraw %}) deprecated - use v-once instead.

## Reactivity

### `Array.prototype.$set` (console error, migration helper)

use Vue.set instead

### `Array.prototype.$remove` (console error, migration helper)

use Array.prototype.splice instead

### Replacing `$data` (console warning, migration helper)

It is now also prohibited to replace a component instance's root $data. This prevents some edge cases in the reactivity system and makes the component state more predictable (especially with type-checking systems).
