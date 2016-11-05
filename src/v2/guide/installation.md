---
title: Installation
type: guide
order: 1
vue_version: 2.0.5
dev_size: "194.65"
min_size: "64.28"
gz_size: "23.55"
ro_gz_size: "16.39"
---

### Compatibility Note

Vue does **not** support IE8 and below, because it uses ECMAScript 5 features that are un-shimmable in IE8. However it supports all [ECMAScript 5 compliant browsers](http://caniuse.com/#feat=es5).

### Release Notes

Detailed release notes for each version are available on [GitHub](https://github.com/vuejs/vue/releases).

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable.

<p class="tip">Don't use the minified version during development. You will miss out all the nice warnings for common mistakes!</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Development Version</a><span class="light info">With full warnings and debug mode</span>

<a class="button" href="/js/vue.min.js" download>Production Version</a><span class="light info">Warnings stripped, {{gz_size}}kb min+gzip</span>
</div>

### CDN

Recommended: [unpkg](https://unpkg.com/vue/dist/vue.js), which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at [unpkg.com/vue/](https://unpkg.com/vue/).

Also available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), but these two services take some time to sync so the latest release may not be available yet.

## NPM

NPM is the recommended installation method when building large scale applications with Vue. It pairs nicely with module bundlers such as [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). Vue also provides accompanying tools for authoring [Single File Components](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

### Standalone vs. Runtime-only Build

There are two builds available, the standalone build and the runtime-only build. The difference being that the former includes the **template compiler** and the latter does not.

The template compiler is responsible for compiling Vue template strings into pure JavaScript render functions. If you want to use the `template` option, then you need the compiler.

- The standalone build includes the compiler and supports the `template` option. **It also relies on the presence of browser APIs so you cannot use it for server-side rendering.**

- The runtime-only build does not include the template compiler, and does not support the `template` option. You can only use the `render` option when using the runtime-only build, but it works with single-file components, because single-file components' templates are pre-compiled into `render` functions during the build step. The runtime-only build is roughly 30% lighter-weight than the standalone build, weighing only {{ro_gz_size}}kb min+gzip.

By default, the NPM package exports the **runtime-only** build. To use the standalone build, add the following alias to your Webpack config:

``` js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.js'
  }
}
```

For Browserify, you can use [aliasify](https://github.com/benbria/aliasify) to achieve the same.

<p class="tip">Do NOT do `import Vue from 'vue/dist/vue.js'` - since some tools or 3rd party libraries may import vue as well, this may cause the app to load both the runtime and standalone builds at the same time and lead to errors.</p>

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The standalone build depends on this feature to compile templates, so is unusable in these environments.

On the other hand, the runtime-only build is fully CSP-compliant. When using the runtime-only build with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

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

<p class="tip">The CLI assumes prior knowledge of Node.js and the associated build tools. If you are new to Vue or front-end build tools, we strongly suggest going through <a href="./">the guide</a> without any build tools before using the CLI.</p>

## Dev Build

**Important**: the built files in GitHub's `/dist` folder are only checked-in during releases. To use Vue from the latest source code on GitHub, you will have to build it yourself!

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
