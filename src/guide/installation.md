---
title: Installation
type: guide
order: 1
vue_version: 2.0.0-rc.1
dev_size: "187.07"
min_size: "60.65"
gz_size: "22.06"
---

### Compatibility Note

Vue does **not** support IE8 and below, because it uses ECMAScript 5 features that are un-shimmable in IE8. However it supports all [ECMAScript 5 compliant browsers](http://caniuse.com/#feat=es5).

### Release Notes

Detailed release notes for each version are available on [GitHub](https://github.com/vuejs/vue/releases).

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable. **Pro tip: Don't use the minified version during development. You will miss out all the nice warnings for common mistakes.**

<div id="downloads">
<a class="button" href="/js/vue.js" download>Development Version</a><span class="light info">With full warnings and debug mode</span>

<a class="button" href="/js/vue.min.js" download>Production Version</a><span class="light info">Warnings stripped, {{gz_size}}kb min+gzip</span>
</div>

### CDN

Available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet).

Also available on [npmcdn](https://npmcdn.com/vue/dist/vue.min.js), which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at [npmcdn.com/vue/](https://npmcdn.com/vue/).

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The standalone build depends on this feature to compile templates, so is unusable in these environments.

There _is_ a solution however. When using Vue in a build system with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple-2.0) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple-2.0), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

## NPM

NPM is the recommended installation method when building large scale applications with Vue. It pairs nicely with module bundlers such as [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). Vue also provides accompanying tools for authoring [Single File Components](application.html#Single-File-Components).

``` bash
# latest stable
$ npm install vue@next
```

## CLI

Vue.js provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds:

``` bash
# install vue-cli
$ npm install --global vue-cli
# create a new project using the "webpack" template
$ vue init webpack my-project
# install dependencies and go!
$ cd my-project
$ npm install
$ npm run dev
```

## Dev Build

**Important**: the CommonJS bundle distributed on NPM (`vue.common.js`) is only checked in during releases on the `next` branch. To use Vue from the latest source code on GitHub, you will have to build it yourself!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
git checkout next
npm install
npm run build
```

## Bower

``` bash
# latest stable
$ bower install vue#next
```

## AMD Module Loaders

The standalone downloads or versions installed via Bower are wrapped with UMD so they can be used directly as an AMD module.
