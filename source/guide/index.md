title: Installation
type: guide
order: 1
---

# {{title}}

## Standalone

Simply download and include with a script tag:

- <a style="font-size:1.25em" href="https://raw2.github.com/yyx990803/vue/master/dist/vue.js" download>Development Version</a> <br> - 88.88kb, plenty of comments

- <a style="font-size:1.25em" href="https://raw2.github.com/yyx990803/vue/master/dist/vue.min.js" download>Production Version</a> <br> - 31.43kb minified / 10.70kb minified + gzipped

`Vue` will be registered as a global variable.

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

[Let's Get Started](/guide/getting-started.html).