---
title: Announcing vue-cli
date: 2015-12-28 00:00:00
---

Recently there has been a lot of [discussion around the tooling hurdle](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4#.chg95e5p6) when you start a React project. Luckily for Vue.js, all you need to do to start with a quick prototype is including it from a CDN via a `<script>` tag, so we've got that part covered. However, that's not how you'd build a real world application. In real world applications we inevitably need a certain amount of tooling to give us modularization, transpilers, pre-processors, hot-reload, linting and testing. These tools are necessary for the long-term maintainability and productivity of large projects, but the initial setup can be a big pain. This is why we are announcing [vue-cli](https://github.com/vuejs/vue-cli), a simple CLI tool to help you quickly scaffold Vue.js projects with opinionated, battery-included build setups.

<!-- more -->

### Just The Scaffolding

The usage looks like this:

``` bash
npm install -g vue-cli
vue init webpack my-project
# answer prompts
cd my-project
npm install
npm run dev # tada!
```

All the CLI does is pulling down templates from the [vuejs-templates](https://github.com/vuejs-templates) organization on GitHub. Dependencies are handled via NPM, and build tasks are simply NPM scripts.

### Official Templates

The purpose of official Vue project templates is providing opinionated, battery-included development tooling setups so that users can get started with actual app code as fast as possible. However, these templates are un-opinionated in terms of how you structure your app code and what libraries you use in addition to Vue.js.

All official project templates are repos in the [vuejs-templates organization](https://github.com/vuejs-templates). When a new template is added to the organization, you will be able to run `vue init <template-name> <project-name>` to use that template. You can also run `vue list` to see all available official templates.

Current available templates include:

- [browserify](https://github.com/vuejs-templates/browserify) - A full-featured Browserify + vueify setup with hot-reload, linting & unit testing.

- [browserify-simple](https://github.com/vuejs-templates/browserify-simple) - A simple Browserify + vueify setup for quick prototyping.

- [webpack](https://github.com/vuejs-templates/webpack) - A full-featured Webpack + vue-loader setup with hot reload, linting, testing & css extraction.

- [webpack-simple](https://github.com/vuejs-templates/webpack-simple) - A simple Webpack + vue-loader setup for quick prototyping.

### Bring Your Own Setup

If you are not happy with the official templates, you can fork these templates, modify them to fit your specific needs (or even create your own from scratch), and use them via `vue-cli` too, because `vue-cli` can work directly on GitHub repos:

``` bash
vue init username/repo my-project
```

### Vue Components Everywhere

There are different templates for different purposes: simple setups for quick prototyping, and full-featured setups for ambitious applications. A common feature among these templates though, is that they all support `*.vue` single file components. This means any third party Vue components written as valid `*.vue` files can be shared among projects using these setups, and simply be distributed over NPM - let's create more reusable components!
