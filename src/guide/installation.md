---
title: Installation
type: guide
order: 0
vue_version: 1.0.24
dev_size: "264.56"
min_size: "74.51"
gz_size: "25.79"
---

### Compatibility Note

Vue.js does **not** support IE8 and below, because Vue.js uses ECMAScript 5 features that are un-shimmable in IE8. However Vue.js supports all [ECMAScript 5 compliant browsers](http://caniuse.com/#feat=es5).

### Release Notes

Detailed release notes for each version are available on [GitHub](https://github.com/vuejs/vue/releases).

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable. **Pro tip: don't use the minified version during development. you will miss out all the nice warnings for common mistakes.**

<div id="downloads">
<a class="button" href="/js/vue.js" download>Development Version</a><span class="light info">With full warnings and debug mode</span>

<a class="button" href="/js/vue.min.js" download>Production Version</a><span class="light info">Warnings stripped, {{gz_size}}kb min+gzip</span>
</div>

### CDN

Available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet).

### CSP-compliant build

Some environments, such as Google Chrome Apps, enforces Content Security Policy (CSP) and does not allow the use of `new Function()` for evaluating expressions. In these cases you can use the [CSP-compliant build](https://github.com/vuejs/vue/tree/csp/dist) instead.

## NPM

NPM is the recommended installation method when building large scale apps with Vue.js. It pairs nicely with a CommonJS module bundler such as [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). Vue.js also provides accompanying tools for authoring [Single File Components](application.html#Single-File-Components).

``` bash
# latest stable
$ npm install vue
# latest stable + CSP-compliant
$ npm install vue@csp
```

## CLI

Vue.js provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides battery-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save and production-ready builds:

``` bash
# install vue-cli
$ npm install -g vue-cli
# create a new project using the "webpack" boilerplate
$ vue init webpack my-project
# install dependencies and go!
$ cd my-project
$ npm install
$ npm run dev
```

## Dev Build

**Important**: the CommonJS bundle distributed on NPM (`vue.common.js`) is only checked-in during releases on the `master` branch, so the file in the `dev` branch is the same as the stable release. To use Vue from the latest source code on GitHub, you will have to build it yourself!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# latest stable
$ bower install vue
```

## AMD Module Loaders

The standalone downloads or versions installed via Bower are wrapped with UMD so they can be used directly as an AMD module.
