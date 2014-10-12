title: Installation
type: guide
order: 1
vue_version: 0.11.0
dev_size: 160.39
min_size: 50.49
gz_size: 16.47
---

> **Compatibility Note:** Vue.js does not support IE8 and below.

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable.

<div id="downloads">
<a class="button" href="https://raw.github.com/yyx990803/vue/{{vue_version}}/dist/vue.js" download>Development Version</a><span class="light info">{{dev_size}}kb, plenty of comments and debug/warning messages.</span>

<a class="button" href="https://raw.github.com/yyx990803/vue/{{vue_version}}/dist/vue.min.js" download>Production Version</a><span class="light info">{{min_size}}kb minified / {{gz_size}}kb gzipped</span>
</div>

Also available on [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet).

## NPM

``` bash
$ npm install vue
```

For edge version:

``` bash
$ npm install yyx990803/vue#dev
```

## Bower

``` bash
$ bower install vue
```

## Component

``` bash
$ component install yyx990803/vue
```

For edge version:

``` bash
$ component install yyx990803/vue@dev
```

## Duo

```js
var Vue = require('yyx990803/vue')
```

## AMD Module Loaders

e.g. RequireJS, SeaJS: Built versions in `/dist` or installed via Bower is wrapped with UMD so it can be used directly as an AMD module.

## Ready?

[Let's Get Started](/guide/).