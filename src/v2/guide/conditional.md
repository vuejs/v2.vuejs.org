---
title: Conditional Rendering
type: guide
order: 7
---

## `v-if`

In string templates, for example Handlebars, we would write a conditional block like this:

``` html
<!-- Handlebars template -->
{{#if ok}}
  <h1>Yes</h1>
{{/if}}
```

In Vue, we use the `v-if` directive to achieve the same:

``` html
<h1 v-if="ok">Yes</h1>
```

It is also possible to add an "else block" with `v-else`:

``` html
<h1 v-if="ok">Yes</h1>
<h1 v-else>No</h1>
```

### Conditional Groups with `v-if` on `<template>`

Because `v-if` is a directive, it has to be attached to a single element. But what if we want to toggle more than one element? In this case we can use `v-if` on a `<template>` element, which serves as an invisible wrapper. The final rendered result will not include the `<template>` element.

``` html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `v-else`

You can use the `v-else` directive to indicate an "else block" for `v-if`:

``` html
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
```

A `v-else` element must immediately follow a `v-if` or a `v-else-if` element - otherwise it will not be recognized.

### `v-else-if`

> New in 2.1.0+

The `v-else-if`, as the name suggests, serves as an "else if block" for `v-if`. It can also be chained multiple times:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

Similar to `v-else`, a `v-else-if` element must immediately follow a `v-if` or a `v-else-if` element.

### Controlling Reusable Elements with `key`

Vue tries to render elements as efficiently as possible, often re-using them instead of rendering from scratch. Beyond helping make Vue very fast, this can have some useful advantages. For example, if you allow users to toggle between multiple login types:

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

Then switching the `loginType` in the code above will not erase what the user has already entered. Since both templates use the same elements, the `<input>` is not replaced - just its `placeholder`.

Check it out for yourself by entering some text in the input, then pressing the toggle button:

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

This isn't always desirable though, so Vue offers a way for you to say, "These two elements are completely separate - don't re-use them." Add a `key` attribute with unique values:

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

Now those inputs will be rendered from scratch each time you toggle. See for yourself:

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username" key="username-input">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Note that the `<label>` elements are still efficiently re-used, because they don't have `key` attributes.

## `v-show`

Another option for conditionally displaying an element is the `v-show` directive. The usage is largely the same:

``` html
<h1 v-show="ok">Hello!</h1>
```

The difference is that an element with `v-show` will always be rendered and remain in the DOM; `v-show` only toggles the `display` CSS property of the element.

<p class="tip">Note that `v-show` doesn't support the `<template>` element, nor does it work with `v-else`.</p>

## `v-if` vs `v-show`

`v-if` is "real" conditional rendering because it ensures that event listeners and child components inside the conditional block are properly destroyed and re-created during toggles.

`v-if` is also **lazy**: if the condition is false on initial render, it will not do anything - the conditional block won't be rendered until the condition becomes true for the first time.

In comparison, `v-show` is much simpler - the element is always rendered regardless of initial condition, with CSS-based toggling.

Generally speaking, `v-if` has higher toggle costs while `v-show` has higher initial render costs. So prefer `v-show` if you need to toggle something very often, and prefer `v-if` if the condition is unlikely to change at runtime.

## `v-if` with `v-for`

When used together with `v-if`, `v-for` has a higher priority than `v-if`. See the <a href="../guide/list.html#V-for-and-v-if">list rendering guide</a> for details.
