---
title: Single File Components
type: guide
order: 402
---

## Introduction

In many Vue projects, global components will be defined using `Vue.component`, followed by `new Vue({ el: '#container' })` to target a container element in the body of every page.

This can work very well for small to medium-sized projects, where JavaScript is only used to enhance certain views. In more complex projects however, or when your frontend is entirely driven by JavaScript, these disadvantages become apparent:

- **Global definitions** force unique names for every component
- **String templates** lack syntax highlighting and require ugly slashes for multiline HTML
- **No CSS support** means that while HTML and JavaScript are modularized into components, CSS is conspicuously left out
- **No build step** restricts us to HTML and ES5 JavaScript, rather than preprocessors like Pug (formerly Jade) and Babel

All of these are solved by **single-file components** with a `.vue` extension, made possible with build tools such as Webpack or Browserify.

Here's an example of a file we'll call `Hello.vue`:

<img src="/images/vue-component.png" style="display: block; margin: 30px auto;">

Now we get:

- [Complete syntax highlighting](https://github.com/vuejs/awesome-vue#source-code-editing)
- [CommonJS modules](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [Component-scoped CSS](https://vue-loader.vuejs.org/en/features/scoped-css.html)

As promised, we can also use preprocessors such as Pug, Babel (with ES2015 modules), and Stylus for cleaner and more feature-rich components.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto;">

These specific languages are only examples. You could as easily use Bublé, TypeScript, SCSS, PostCSS - or whatever other preprocessors that help you be productive. If using Webpack with `vue-loader`, it also has first-class support for CSS Modules.

### What About Separation of Concerns?

One important thing to note is that **separation of concerns is not equal to separation of file types.** In modern UI development, we have found that instead of dividing the codebase into three huge layers that interweave with one another, it makes much more sense to divide them into loosely-coupled components and compose them. Inside a component, its template, logic and styles are inherently coupled, and collocating them actually makes the component more cohesive and maintainable.

Even if you don't like the idea of Single-File Components, you can still leverage its hot-reloading and pre-compilation features by separating your JavaScript and CSS into separate files:

``` html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Getting Started

### Example Sandbox

If you want to dive right in and start playing with single-file components, check out [this simple todo app](https://codesandbox.io/s/o29j95wx9) on CodeSandbox.

### For Users New to Module Build Systems in JavaScript

With `.vue` components, we're entering the realm of advanced JavaScript applications. That means learning to use a few additional tools if you haven't already:

- **Node Package Manager (NPM)**: Read the [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) through section _10: Uninstalling global packages_.

- **Modern JavaScript with ES2015/16**: Read through Babel's [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). You don't have to memorize every feature right now, but keep this page as a reference you can come back to.

After you've taken a day to dive into these resources, we recommend checking out the [webpack](https://vuejs-templates.github.io/webpack) template. Follow the instructions and you should have a Vue project with `.vue` components, ES2015, and hot-reloading in no time!

To learn more about Webpack itself, check out [their official docs](https://webpack.js.org/configuration/) and [Webpack Academy](https://webpack.academy/p/the-core-concepts). In Webpack, each file can be transformed by a "loader" before being included in the bundle, and Vue offers the [vue-loader](https://vue-loader.vuejs.org) plugin to translate single-file (`.vue`) components.

### For Advanced Users

Whether you prefer Webpack or Browserify, we have documented templates for both simple and more complex projects. We recommend browsing [github.com/vuejs-templates](https://github.com/vuejs-templates), picking a template that's right for you, then following the instructions in the README to generate a new project with [vue-cli](https://github.com/vuejs/vue-cli).
