---
title: 0.11 Component Tips
date: 2014-12-08 15:02:14
tags:
---

<p class="tip">Note: this post contains information for the outdated 0.11 version. Please refer to the [0.12 release notes](https://github.com/yyx990803/vue/releases) for the changes in the API.</p>

The release of 0.11 introduced [many changes](https://github.com/yyx990803/vue/blob/master/changes.md), but the most important one is how the new component scope works. Previously in 0.10.x, components have inherited scope by default. That means in a child component template you can reference parent scope properties. This often leads to tightly-coupled components, where a child component assumes knowledge of what properties are present in the parent scope. It is also possible to accidentally refer to a parent scope property in a child component.

<!-- more -->

### Isolated Scope and Data Passing

Starting in 0.11, all child components have isolated scope by default, and the recommended way to control component data access is via [Explicit Data Passing](/guide/components.html#Explicit_Data_Passing) using [`v-with`](/api/directives.html#v-with) or [`paramAttributes`](/api/options.html#paramAttributes).

`paramAttributes` enables us to write Web Component style templates:

``` js
Vue.component('my-component', {
  paramAttributes: ['params'],
  compiled: function () {
    console.log(this.params) // passed from parent
  }
})
```

``` html
<my-component params="{{params}}"></my-component>
```

### Where Does It Belong?

Previously in 0.10, all directives on a component's container element are compiled in the child component's scope. Because it inherited parent scope, this worked in most situations. Starting in 0.11.1, we want to provide a cleaner separation between component scopes. The rule of thumbs is: if something appears in the parent template, it will be compiled in parent scope; if it appears in child template, it will be compiled in child scope. For example:

``` html
<!-- parent template -->
<div v-component="child" v-on="click:onParentClick">
  <p>{{parentMessage}}</p>
</div>
```

``` html
<!-- child template, with replace: true -->
<div v-on="click:onChildClick">
  <h1>{{childMessage}}</h1>
  <content></content>
</div>
```

Everything in the parent template will be compiled in the parent's scope, including the content that's going to be inserted into the child component.

The only exception to the rule is `v-with` (and `paramAttributes` which compiles down to `v-with`), which works in both places - so you don't need to worry about it too much.

### Cleaner Event Communication

Previously the standard way for a child component to communicate to its parent is via dispatching events. However, with this approach, the event listeners on the parent component are not guaranteed to be listening on the desired child component only. It's also possible to trigger undesired listners further up the chain if we do not cancel the event.

The most common use case is for a parent to react to the events from a specific, direct child component. So in 0.11.4, [a new directive `v-events`](/api/directives.html#v-events) has been introduced to enable exactly this behavior.

0.11.4 has already been released, go try it out!
