---
title: Installation
type: guide
order: 0
vue_version: 1.0.13
dev_size: "244.48"
min_size: "69.37"
gz_size: "23.85"
---

> **Compatibility Note:** Vue.js does not support IE8 and below.

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

NPM is the recommended installation method when building large scale apps with Vue.js. It pairs nicely with a CommonJS module bundler such as [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). Vue.js also provides accompanying tools for authoring [Single File Components](application.html#Single_File_Components).

``` bash
# latest stable
$ npm install vue
# latest stable + CSP-compliant
$ npm install vue@csp
```

## Dev Build

**Important**: the CommonJS bundle distributed on NPM (`vue.common.js`) is **not** checked into source control, therefore to use Vue from the latest source code on GitHub, you will have to build it yourself!

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
