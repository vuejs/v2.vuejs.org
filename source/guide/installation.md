title: Installation
type: guide
order: 1
vue_version: 0.10.4
dev_size: 121.11
min_size: 40.74
gz_size: 13.96
---

> **Compatibility Note:** Vue.js does not support IE8 and below.

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable.

<a class="button" href="https://raw.github.com/yyx990803/vue/v{{vue_version}}/dist/vue.js" download>Development Version</a><br><span class="light">{{dev_size}}kb, plenty of comments and debug/warning messages.</span>

<a class="button" href="https://raw.github.com/yyx990803/vue/v{{vue_version}}/dist/vue.min.js" download>Production Version</a><br><span class="light">{{min_size}}kb minified / {{gz_size}}kb gzipped</span>

Also available on [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet).

## Component

``` bash
$ component install yyx990803/vue
```
```js
var Vue = require('vue')
```

For edge version (unstable branch, use at your own risk!):

``` bash
$ component install yyx990803/vue@dev
```

## Browserify

``` bash
$ npm install vue
```
```js
var Vue = require('vue')
```

For edge version:

``` bash
$ npm install yyx990803/vue#dev
```

<p class="tip">The built version in `dist/` doesn't work with Browserify because it assumes it's loaded in global scope and comes with its own `require` mechanism. Always directly use source version when using Vue with Browserify.</p>

## Bower

``` bash
$ bower install vue
```

``` html
<script src="bower_components/vue/dist/vue.js">
```

## AMD Module Loaders

e.g. RequireJS, SeaJS: Built versions in `/dist` or installed via Bower is wrapped with UMD so it can be used directly as an AMD module.

## Ready?

[Let's Get Started](/guide/).