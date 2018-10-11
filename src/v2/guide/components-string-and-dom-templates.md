---
title: String and DOM templates
type: guide
order: 107
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

In Vue, there are two different 'types' of templates. They differenciate in how they are being defined and how they are treated by Vue. Namely those two are DOM and string templates. 

## DOM templates
A template defined directly inside your HTML document, without being processed by any kind of module bundler (i.e. Webpack). This is usually the case, when you import Vue directly into your `.html` file.

You might define a template inside the `<body>` tag of your `.html` file like this:
```html
<template id="my-template">
  Hello, Vue!
</template>
```

Now you can create a new Vue instance (or even a component) and use the previously created `<template></template>` tag as the instance's template by passing the according `id` to the `template` property:
```js
new Vue({
  el: '#app',
  template: '#my-template'
})
```

## String templates
A template, which has been parsed by some bundler (i.e. Webpack) or has been defined as a string literal directly on the Vue instance. This also includes the `<template></template>` sections of a `.vue` files, as they are are being processed by Webpack before effectively making their way into the user's browser.

*some-component.vue*
```html
<template>
  Hello, Vue!
</tempalte>

<script>
export default {
  name: 'my-app'
}
</script>
```

## Caveats
Now there are a few things you need to consider when using one or the other.

### Case sensitivity
HTML is case insensitive by default. This means, that using a template like `<my-component :myProperty="someprop"/>` would have as a result, that when expecting a property named `myProperty` inside the `<my-component></my-component>`, it would actually be empty, as only `myproperty` is being passed the value of `someprop`, but not `myProperty`. That's because of HTML's case insensitivity.

On the other hand, using the same template in a template string would be perfectly valid and would work as expected, as the template is being handled by Vue directly and isn't affected by the HTML limitations. 
