---
title: Single File Components
type: guide
order: 19
---

## Introduction

In many Vue projects, global components will be defined using `Vue.component`, followed by `new Vue({ el: '#container '})` to target a container element in the body of every page.

This can work very well for small to medium-sized projects, where JavaScript is only used to enhance certain views. In more complex projects however, or when your frontend is entirely driven by JavaScript, these disadvantages become apparent:

- **Global definitions** force unique names for every component
- **String templates** lack syntax highlighting and require ugly slashes for multiline HTML
- **No CSS support** means that while HTML and JavaScript are modularized into components, CSS is conspicuously left out
- **No build step** restricts us to HTML and ES5 JavaScript, rather than preprocessors like Pug (formerly Jade) and Babel

All of these are solved by **single-file components** with a `.vue` extension, made possible with build tools such as Webpack or Browserify.

Here's a simple example of a file we'll call `Hello.vue`:

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

Now we get:

- [Complete syntax highlighting](https://github.com/vuejs/awesome-vue#syntax-highlighting)
- [CommonJS modules](https://webpack.github.io/docs/commonjs.html)
- [Component-scoped CSS](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

As promised, we can also use preprocessors such as Jade, Babel (with ES2015 modules), and Stylus for cleaner and more feature-rich components.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

These specific languages are just examples. You could just as easily use Buble, TypeScript, SCSS, PostCSS - or whatever other preprocessors that help you be productive.

<!-- TODO: include CSS modules once it's supported in vue-loader 9.x -->

## Getting Started

### For Users New to Module Build Systems in JavaScript

With `.vue` components, we're entering the realm of advanced JavaScript applications. That means learning to use a few additional tools if you haven't already:

- **Node Package Manager (NPM)**: Read the [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) through section _10: Uninstalling global packages_.

- **Modern JavaScript with ES2015/16**: Read through Babel's [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). You don't have to memorize every feature right now, but keep this page as a reference you can come back to.

After you've taken a day to dive into these resources, we recommend checking out the [webpack-simple](https://github.com/vuejs-templates/webpack-simple) template. Follow the instructions and you should have a Vue project with `.vue` components, ES2015 and hot-reloading running in no time!

The template uses [Webpack](https://webpack.github.io/), a module bundler that takes a number of "modules" and then bundle them into your final application. To learn more about Webpack itself, [this video](https://www.youtube.com/watch?v=WQue1AN93YU) offers a good intro. Once you get past the basics, you might also want to check out [this advanced Webpack course on Egghead.io](https://egghead.io/courses/using-webpack-for-production-javascript-applications).

In Webpack, each module can be transformed by a "loader" before being included in the bundle, and Vue offers the [vue-loader](https://github.com/vuejs/vue-loader) plugin to take care of translating `.vue` single-file components. The [webpack-simple](https://github.com/vuejs-templates/webpack-simple) template has already set up everything for you, but if you'd like to learn more about how `.vue` components work with Webpack, you can read [the docs for vue-loader](https://vue-loader.vuejs.org).

### For Advanced Users

Whether you prefer Webpack or Browserify, we have documented templates for both simple and more complex projects. We recommend browsing [github.com/vuejs-templates](https://github.com/vuejs-templates), picking a template that's right for you, then following the instructions in the README to generate a new project with [vue-cli](https://github.com/vuejs/vue-cli).
