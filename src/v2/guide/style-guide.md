---
title: Style Guide
type: guide
order: 402
---

This is the official style guide for Vue-specific code. If you use Vue in a project, it's a great reference to avoid errors, bikeshedding, and anti-patterns. However, we don't believe that any style guide is ideal for all teams or projects, so mindful deviations are encouraged based on past experience, the surrounding tech stack, and personal values.

For the most part, we also avoid suggestions about JavaScript or HTML in general. We don't mind whether you use semicolons or trailing commas. We don't mind whether your HTML uses single-quotes or double-quotes for attribute values. Some exceptions will exist however, where we've found that a particular pattern is helpful in the context of Vue.

> **Soon, we'll also provide tips for enforcement.** Sometimes you'll simply have to be disciplined, but wherever possible, we'll try to show you how to use ESLint and other automated processes to make enforcement simpler.

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




### Multi-word component names

**Component names should always be multi-word.**

This prevents conflicts with existing and future HTML elements, since all HTML elements are a single word.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
Vue.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` js
Vue.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Component data

**Component `data` must be a function.**

When using the `data` property on a component (i.e. anywhere except on `new Vue`), the value must be a function that returns an object.

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

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

``` js
export default {
  data: {
    foo: 'bar'
  }
}
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
// It's OK to use an object directly in a root
// Vue instance, since only a single instance
// will ever exist.
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}



### Prop definitions

**Prop definitions should be as detailed as possible.**

In committed code, prop definitions should always be as detailed as possible, specifying at least type(s).

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
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}



### Keyed `v-for`

**Always use `key` with `v-for`.**

It's _always_ required on components, in order to maintain internal component state down the subtree. Even for elements though, it's a good practice to maintain predictable behavior, such as [object constancy](https://bost.ocks.org/mike/constancy/) in animations.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </td>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </td>
</ul>
```
{% raw %}</div>{% endraw %}



### Component style scoping

**For applications, styles in a top-level `App` component and in layout components may be global, but all other components should always be scoped.**

This is only relevant for single-file components. It does _not_ require that the [`scoped` attribute](https://vue-loader.vuejs.org/en/features/scoped-css.html) be used. Scoping could be through [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html), a class-based strategy such as [BEM](http://getbem.com/), or another library/convention.

**Component libraries should prefer a class-based strategy, instead of using the `scoped` attribute.**

This makes overriding internal styles easier, with human-readable class names that don't have too high specificity, but are still very unlikely to result in a conflict.

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

If you are developing a large project, working with other developers, or sometimes include 3rd-party HTML/CSS (e.g. from Auth0), consistent scoping will ensure that your styles only apply to the components they are meant for.

Beyond the `scoped` attribute, using unique class names can help ensure that 3rd-party CSS does not apply to your own HTML. For example, many projects use the `button`, `btn`, or `icon` class names, so even if not using a strategy such as BEM, adding an app-specific and/or component-specific prefix (e.g. `ButtonClose-icon`) can provide some protection.

{% raw %}</details>{% endraw %}

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
  <button class="button button-close">X</button>
</template>

<!-- Using the scoped attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">X</button>
</template>

<!-- Using CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">X</button>
</template>

<!-- Using the BEM convention -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



## Priority B Rules: Strongly Recommended (Improving Readability)


### Component files

**Whenever a build system is available to concatenate files, each component should be in its own file.**

This helps you to more quickly find a component when you need to edit it or review how to use it.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
{% raw %}</div>{% endraw %}



### SFC filename casing

**Filenames of single-file components should either be always PascalCase or always kebab-case.**

PascalCase works best with autocompletion in code editors, as it's consistent with how we reference components in JS(X) and templates, wherever possible. However, mixed case filenames can sometimes create issues on case-insensitive filesystems, which is why kebab-case is also perfectly acceptable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
{% raw %}</div>{% endraw %}



### Generic component names

**Generic components that apply app-specific styling and conventions should begin with the `App` prefix.**

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

These components lay the foundation for consistent styling and behavior in your application. They can only contain:

- HTML elements,
- other `App`-prefixed components, and
- 3rd-party UI components.

They'll often contain the name of the element they wrap (e.g. `AppButton`, `AppTable`), unless no element exists for their specific purpose (e.g. `AppIcon`). If you build similar components for a more specific context, they will almost always consume these components (e.g. `AppButton` may be used in `ButtonSubmit`).

Some advantages of this convention:

- When organized alphabetically in editors, your app's base components are all listed together, making them easier to identify.

- Since these components are so frequently used, you may want to simply make them global instead of importing them everywhere. The `App` prefix makes this simple in Webpack:

  ``` js
  function globalizeAppComponents () {
    const requireComponent = require.context("./src", true, /^App[A-Z]/)
    requireComponent.keys().forEach(file => {
      const appComponentConfig = requireComponent(file)
      Vue.component(appComponentConfig.name, appComponentConfig)
    })
  }
  ```

- Since component names should always be multi-word, this convention prevents you from having to add an arbitrary prefix to simple component wrappers (e.g. `MyButton`, `VueButton`).

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```
{% raw %}</div>{% endraw %}



### Single-instance component names

**Components that should only ever have a single active instance should begin with the `The` prefix, to denote that there can be only one.**

This does not mean the component is only used in a single page, but it will only be used once _per page_. These components never accept any props, since they are specific to your app, not their context within your app. If you find the need to add props, it's a good indication that this is actually a reusable component that is only used once per page _for now_.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

```
components/
|- Heading.vue
|- MySidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
{% raw %}</div>{% endraw %}



### Tightly coupled component names

**Child components that are tightly coupled with their parent should include the parent component name as a prefix.**

If a component only makes sense in the context of a single parent component, that relationship should be evident in its name. Since editors typically organize files alphabetically, this also keeps these related files next to each other.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
{% raw %}</div>{% endraw %}



### Order of words in component names

**Component names should start with the least specific word and end with the most specific, generally including nouns before adjectives.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

```
components/
|- CheckboxInput.vue
|- DeleteButton.vue
|- EditableTodoList.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

```
components/
|- InputCheckbox.vue
|- ButtonDelete.vue
|- TodoListEditable.vue
```
{% raw %}</div>{% endraw %}



### Self-closing components

**Components with no content should be self-closing in single-file components, string templates, and JSX - but never in DOM templates.**

Components that self-close communicate that they not only have no content, but are **meant** to have no content. It's the difference between a blank page in a book and one labeled "This page intentionally left blank." Your code is also cleaner without the unnecessary closing tag.

Unfortunately, HTML doesn't allow custom elements to be self-closing - only [official "void" elements](https://www.w3.org/TR/html/syntax.html#void-elements). That's why the strategy is only possible when Vue's template compiler can reach the template before the DOM, then serve the DOM spec-compliant HTML.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- In DOM templates -->
<my-component/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent/>
```

``` html
<!-- In DOM templates -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Component name casing in templates

**Component names should always be PascalCase in single-file components and string templates - but kebab-case in DOM templates.**

PascalCase in templates improves readability, because it's easier to tell at a glance what's an element and what's a component. Unfortunately, PascalCase is invalid for a custom element in HTML, so a DOM template must still use kebab-case.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<!-- In single-file components and string templates -->
<mycomponent/>
```

``` html
<!-- In single-file components and string templates -->
<my-component/>
```

``` html
<!-- In single-file components and string templates -->
<myComponent/>
```

``` html
<!-- In DOM templates -->
<MyComponent/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<!-- In single-file components and string templates -->
<MyComponent/>
```

``` html
<!-- In DOM templates -->
<my-component/>
```
{% raw %}</div>{% endraw %}



### Component name casing in JS/JSX

**Component names in JS/JSX should always be PascalCase, though may be kebab-case inside strings for simpler applications that only use global component registration through `Vue.component`.**

{% raw %}
<details>
<summary>
  <h4>Detailed Explanation</h4>
</summary>
{% endraw %}

In JavaScript, PascalCase is the convention for classes and prototype constructors - essentially, anything that can have distinct instances. Vue components also have instances, so it makes sense to also use PascalCase. As an added benefit, using PascalCase within JSX (and templates) allows readers of the code to more easily distinguish between components and HTML elements.

However, for applications that use **only** global component definitions via `Vue.component`, we recommend kebab-case instead. The reasons are:

- It's rare that global components are ever referenced in JavaScript, so following a convention for JavaScript makes less sense.
- These applications always include many in-DOM components, where kebab-case [**must** be used](#Component-name-casing-in-templates).
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
Vue.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` js
Vue.component('MyComponent', {
  // ...
})
```

``` js
Vue.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Abbreviations in component names

**Component names should prefer full words over abbreviations.**

The autocompletion in editors make the cost of writing longer names very low, while the clarity they provide is invaluable. Uncommon abbreviations, in particular, should always be avoided.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
{% raw %}</div>{% endraw %}



### Prop name casing

**Prop names should always use camelCase during declaration, but kebab-case in templates and JSX.**

We're simply following the conventions of each language. Within JavaScript, camelCase is more natural. Within HTML, kebab-case is.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` js
props: {
  'greeting-text': String
}
```

``` html
<WelcomeMessage greetingText="hi"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
{% raw %}</div>{% endraw %}

### Multi-attribute elements

**Elements with multiple attributes should span multiple lines, with one attribute per line.**

In JavaScript, splitting objects with multiple properties over multiple lines is generally considered a good convention, because it's much easier to read. Our templates and JSX deserve the same consideration.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
{% raw %}</div>{% endraw %}



### Complex expressions in templates

**Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.**

Complex expressions in your templates make them less declarative. We should strive to describe _what_ should appear, not _how_ we're computing that value. Computed properties and methods also allow the code to be reused.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
{{
  fullName.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1)
  ).join(' ')
}}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
{{ normalizedFullName }}
```

``` js
computed: {
  normalizedFullName () {
    return this.fullName.split(' ').map(word =>
      word[0].toUpperCase() + word.slice(1)
    ).join(' ')
  }
}
```
{% raw %}</div>{% endraw %}



### Complex computed properties

**Complex computed properties should be split into as many simpler properties as possible.**

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



### Quoted attribute values

**Non-empty HTML attribute values should always be inside quotes (single or double, whichever is not used in JS).**

While attribute values without any spaces are not required to have quotes in HTML, this practice often leads to _avoiding_ spaces, making attribute values less readable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<input type=text>
```

``` html
<AppSidebar :style={background:sidebarWidth+'px'}>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ background: sidebarWidth + 'px' }">
```
{% raw %}</div>{% endraw %}



## Priority C Rules: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)



### Component options order

**Component options should be ordered consistently.**

The specific order is

- Side effects
  - el

- Config
  - name
  - functional
  - delimiters
  - inheritAttrs
  - comments
  - parent

- Composition
  - extends
  - mixins

- Assets
  - components
  - directives
  - filters

- Interface
  - model
  - props/propsData

- Local Properties
  - data
  - computed
  - methods

- Events
  - watch
  - Lifecycle (in the order they are called)

- Rendering
  - template/render
  - renderError


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




### Keyed v-if, v-else

Always use `key` with `v-if` + `v-else`, if they are the same element type (e.g. both `<div>` elements).

<sg-enforcement type=""></sg-enforcement>

By default, Vue updates the DOM as efficiently as possible. That means when switching between elements of the same type, it simply patches the existing element, rather than removing it and adding a new one in its place. This can have [unintended side effects](https://jsfiddle.net/chrisvfritz/bh8fLeds/) if these elements should not actually be considered the same.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Bad

``` html
<div v-if="error">
  Error: {{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Good

``` html
<div v-if="error" key="search-status">
  Error: {{ error }}
</div>
<div v-else key="search-results">
  {{ results }}
</div>
```

``` html
<p v-if="error">
  Error: {{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}




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

**Props should prefer simple types (i.e. `String`, `Number`, `Boolean`) or custom prototypes over complex objects.**

This is in the spirit of being as explicity as possible




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

  // new Vue({
  //  el: '#main'
  // })
})()
</script>
{% endraw %}
