title: Installation
type: guide
order: 1
vue_version: 0.8.3
dev_size: 91.37
min_size: 32.20
gz_size: 11.00
---

# {{title}}

> **Compatibility Note:** Vue.js does not support IE8 and below.

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable.

<a class="button" href="https://raw.github.com/yyx990803/vue/v{{vue_version}}/dist/vue.js" download>Development Version</a><br><span class="light">{{dev_size}}kb, plenty of comments</span>

<a class="button" href="https://raw.github.com/yyx990803/vue/v{{vue_version}}/dist/vue.min.js" download>Production Version</a><br><span class="light">{{min_size}}kb minified / {{gz_size}}kb gzipped</span>

Also available on [cdnjs](http://cdnjs.com) (takes 4 hours to sync so might not work for latest version):
```
<script src="//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js"></script>
```

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