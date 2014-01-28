title: Installation
type: guide
order: 1
---

# {{title}}

> **Compatibility Note:** Vue.js does not support IE8 and below. For IE9, the [classList polyfill](https://github.com/remy/polyfills/blob/master/classList.js) is needed.

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable.

- <a style="font-size:1.25em" href="https://raw.github.com/yyx990803/vue/v0.8.0/dist/vue.js" download>Development Version</a> <br> - 87.75kb, plenty of comments

- <a style="font-size:1.25em" href="https://raw.github.com/yyx990803/vue/v0.8.0/dist/vue.min.js" download>Production Version</a> <br> - 30.81kb minified / 10.57kb minified + gzipped

## Component

``` bash
$ component install yyx990803/vue
```
```js
var Vue = require('vue')
```

## Browserify

``` bash
$ npm install vue
```
```js
var Vue = require('vue')
```

## Bower

``` bash
$ bower install vue
```

``` html
<script src="bower_components/vue/dist/vue.js">
```

## Module Loaders

e.g. RequireJS, SeaJS: Built versions in `/dist` or installed via Bower is wrapped with UMD so it can be used directly as a CommonJS or AMD module.

## Ready?

[Let's Get Started](/guide/).