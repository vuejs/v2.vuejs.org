---
title: Style Guide
type: guide
order: 30
---

This is an official style guide for Vue-specific code. If you use Vue in a project, it's a great reference to avoid errors, bikeshedding, and anti-patterns. However, we don't believe that any style guide is ideal for all teams or projects, so mindful deviations are encouraged based on past experience, the surrounding tech stack, and personal values.

For the most part, we also avoid suggestions about JavaScript or HTML in general. We don't care whether you use semicolons or trailing commas. We don't care whether your HTML uses single-quotes or double-quotes for attribute values. Some exceptions will exist however, where we've found that a particular pattern is helpful in the context of Vue.

For every rule, we'll also provide tips for enforcement. Sometimes, you'll simply have to be disciplined, but wherever possible, we'll show you how to use ESLint and other automated processes to make enforcement simpler.

Finally, we've split rules into four categories:




## Rule Categories

### Priority A: Essential

These rules help prevent errors, so learn and abide by them at all costs. Exceptions may exist, but should be very rare and only be made by those with expert knowledge of both JavaScript and Vue.

### Priority B: Strongly Recommended

These rules have been found to vastly improve readability in most projects. If you violate them, your code will still run, but other developers may give you the evil eye [at conferences](https://conf.vuejs.org/).

[![Fry from Futurama glaring](https://i.imgur.com/PcOnLxn.jpg)](http://futurama.wikia.com/wiki/Template:FOX_Image)

### Priority C: Recommended

Where multiple, equally good options exist, an arbitrary choice has to be made. In these rules, we describe each acceptable option and then suggest a default choice. That means you can feel free to make a different choice in your own codebase, as long as you're consistent and have a good reason. Please do have a good reason though! By adapting to the community standard, you will:

1. train your brain to more easily parse most of the community code you encounter
2. be able to copy and paste most community code examples without modification
2. often find new hires are already accustomed to your preferred coding style, at least in regards to Vue

### Priority D: Use with Caution

Some features of Vue exist to accommodate rare edge cases or smoother migrations from a legacy code base. When overused however, they can make your code more difficult to maintain or even become a source of bugs. These rules shine a light on potentially risky features, describing when and why they should be avoided.

[![goto from xkcd.com](https://imgs.xkcd.com/comics/goto.png)](https://xkcd.com/292/)




## Priority A Rules: Essential (Error Prevention)

### Keyed v-if, v-else

Always use `key` with `v-if` + `v-else`, if they are the same element.

### Keyed v-for

Always use `key` with `v-for`.

### Component data

Component `data` must be a function.

<sg-enforcement type="runtime"></sg-enforcement>

When using the `data` property on a component (i.e. anywhere except on `new Vue`), the value must be a function that returns an object.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good
``` js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

``` js
// In a .vue file
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

``` js
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

When the value of `data` is an object, it's shared across all instances of a component. In a component that lazy-loads images, we might start with this object:

``` js
data: {
  displayedImageUrl: '/images/loading.gif',
  status: 'off-screen',
  isLoaded: false
}
```

Now let's say we're using this component to list user profile images:

``` html
<lazy-image
  v-for="user in users"
  url="user.profile.image"
></lazy-image>
```

There might be 100 images, but they won't all fit on screen at the same time, which is why we're using our `lazy-image` component to only download an image once it's visible. The problem is, the component won't work correctly with a shared `data` object. As soon as the first image comes into view and its `status` is updated to `'on-screen'`, _all_ images will think they're on screen and they'll all be fetched at once.

To instead generate a unique object for each component instance, an object must be returned in a function:

``` js
data: function () {
  return {
    url: '/images/loading.jpg',
    status: 'off-screen',
    isLoaded: false
  }
}
```
{% raw %}</details>{% endraw %}

### Prop definitions should be detailed

**Enforcement**: <a href="https://github.com/vuejs/eslint-plugin-vue/issues/19" target="_blank"><span class="style-rule-tag">linting rule (in progress)</span></a>

In committed code, prop definitions should always be as detailed as possible, specifying at least type(s).

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
// This is only OK when prototyping
props: ['status']
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` js
props: {
  status: String
}
```

``` js
// Even better!
props: {
  status: {
    type: String,
    required: true,
    validate: function (value) {
      return ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Detailed [prop definitions](https://vuejs.org/v2/guide/components.html#Prop-Validation) have two advantages:

- They document the API of the component, so that it's easy to see how the component is meant to be used.
- In development, Vue will warn you if a component is ever provided incorrectly formatted props, helping you catch potential sources of error.

{% raw %}</details>{% endraw %}

### Component style scoping

For applications, styles in the top-level `App` component and in layout components may be global, but all other components should always be scoped. This may be through Vue's `scoped` attribute in a single-file component, or via a class-based strategy such as [BEM](http://getbem.com/).

3rd-party libraries should prefer a class-based strategy, instead of using the `scoped` attribute.

<sg-enforcement type="none"></sg-enforcement>

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-ButtonClose c-ButtonClose">
    <i class="c-ButtonClose__icon c-ButtonClose__icon--icon-close"></i>
  </button>
</template>

<!--
The scoped attribute may be excluded if you use
another scoping strategy, such as BEM.
-->
<style scoped>
.c-ButtonClose {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

If you are developing a large project, working with other developers, or sometimes include 3rd-party HTML/CSS (e.g. from Auth0), consistent scoping will ensure that your styles only apply to the components they are meant for.

Beyond the `scoped` attribute, using unique class names can help ensure that 3rd-party CSS does not apply to your own HTML. For example, many projects use the `button`, `btn`, or `icon` class names, so even if not using a strategy such as BEM, adding an app-specific and/or component-specific prefix (e.g. `ButtonClose-icon`) can provide some protection.

{% raw %}</details>{% endraw %}

### Multi-word component names

Component names should always be multi-word (containing at least one hyphen), to avoid conflicts with existing and future HTML elements.





## Priority B Rules: Strongly Recommended (Improving Readability)

### Self-closing components

Components with no content should be self-closing in single-file component or string templates, but never in DOM templates.

### Component name casing in JS/JSX

Component names in JS/JSX should always be PascalCase.

### Component name casing in templates

Component names should always be PascalCase in single-file component templates, kebab-case in DOM templates.

### SFC filename casing

Filenames of single-file components should always be PascalCase.

### Tightly coupled component names

Child components that are tightly coupled with their parent should include the parent component name as a prefix.

### Abbreviations in component names

Component names should prefer full words over uncommon abbreviations.

### Multi-attribute elements

Elements with multiple attributes should span multiple lines, with one attribute per line.

### Complex expressions in templates

Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.

### Complex computed properties

Complex computed properties should be split into as many simpler properties as possible.

<sg-enforcement type="none"></sg-enforcement>

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

Simpler, well-named computed properties are:

- __Easier to test__

  When each computed property contains only a very simple expression, with very few dependencies, it's much easier to write tests confirming that it works correctly.

- __Easier to read__

  Simplifying computed properties forces you to give each value a descriptive name, even if it's not reused. This makes it much easier for other developers (and future you) to focus in on the code they care about and figure out what's going on.

- __More adaptable to changing requirements__

  Any value that can be named might be useful to the view. For example, we might decide to display a message telling the user how much money they saved. We might also decide to calculate sales tax, but perhaps display it separately, rather than as part of the final price.

  Small, focused computed properties make fewer assumptions about how information will be used, so require less refactoring as requirements change.

{% raw %}</details>{% endraw %}

### Quoted attribute values

Non-empty HTML attribute values should always be inside quotes (single or double), whichever is not used in JS.





## Priority C Rules: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

### Component options order

Component options should be ordered consistently.

### Element attribute order

The attributes of elements (including components) should be ordered consistently.

### Directive shorthands

Directive shorthands (`:` for `v-bind:` and `@` for `v-on:`) should be used always or never.

### SFC top-level element order

Single file components should always order `template`, `script`, and `style` consistently.

### Component method order

Component methods should always be ordered alphabetically.

### Computed property order

Computed properties should be ordered first by dependency, then alphabetically.





## Priority D Rules: Use with Caution (Potentially Dangerous Patterns)

### Scoped element selectors

Scoped element selectors should be avoided.

**Enforcement**: <span class="style-rule-tag">self-discipline</span>

Prefer class selectors over element selectors in scoped styles, because large numbers of scoped element selectors have poor performance.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<template>
  <button>X</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

To scope styles, Vue adds a unique attribute to component elements, such as `data-v-f3f3eg9`. Then selectors are modified so that only matching elements with this attribute are selected (e.g. `button[data-v-f3f3eg9]`).

The problem is that large numbers of [element-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `button[data-v-f3f3eg9]`) will be considerably slower than [class-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `.btn-close[data-v-f3f3eg9]`), so class selectors should be preferred whenever possible.

{% raw %}</details>{% endraw %}

### Complex prop types

Props should prefer simple types (i.e. `String`, `Number`, `Boolean`) over complex objects.

### Parent-child communication

Props and events should be preferred for parent-child component communication (avoid `this.$parent` and mutating props).

### Global state management

Vuex should be preferred for global state management (avoid `this.$root` or using global event bus)





{% raw %}
<script>
(function () {
  var enforcementTypes = {
    none: '<span title="There is unfortunately no way to automatically enforce this rule.">self-discipline</span>',
    runtime: 'runtime error',
    linter: '<a href="https://github.com/vuejs/eslint-plugin-vue#eslint-plugin-vue" target="_blank">plugin:vue/recommended</a>'
  }
  Vue.component('sg-enforcement', {
    template: '\
      <span>\
        <strong>Enforcement</strong>:\
        <span class="style-rule-tag" v-html="humanType"/>\
      </span>\
    ',
    props: {
      type: {
        type: String,
        required: true,
        validate: function (value) {
          Object.keys(enforcementTypes).indexOf(value) !== -1
        }
      }
    },
    computed: {
      humanType: function () {
        return enforcementTypes[this.type]
      }
    }
  })

  new Vue({
    el: '#main'
  })
})()
</script>
{% endraw %}
