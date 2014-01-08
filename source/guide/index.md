title: Installation
type: guide
order: 1
---

## Standalone

Simply [download](https://github.com/yyx990803/vue/tree/master/dist) a built version and include it with a `<script>` tag.

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

`Vue` will be registered as a global variable.

## Module Loaders

e.g. RequireJS, SeaJS: Built versions in `/dist` or installed via Bower is wrapped with UMD so it can be used directly as a CommonJS or AMD module.

## Ready?

[Let's Get Started](/guide/getting-started.html).