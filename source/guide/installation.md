title: Installation
type: guide
order: 1
vue_version: 0.12.6
dev_size: 219.64
min_size: 67.73
gz_size: 22.00
---

> **Compatibility Note:** Vue.js does not support IE8 and below.

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable.

<div id="downloads">
<a class="button" href="https://raw.github.com/yyx990803/vue/{{vue_version}}/dist/vue.js" download>Development Version</a><span class="light info">{{dev_size}}kb, plenty of comments and debug/warning messages.</span>

<a class="button" href="https://raw.github.com/yyx990803/vue/{{vue_version}}/dist/vue.min.js" download>Production Version</a><span class="light info">{{min_size}}kb minified / {{gz_size}}kb gzipped</span>
</div>

Also available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet).

## NPM

``` bash
$ npm install vue
# for edge version:
$ npm install yyx990803/vue#dev
```

## Bower

``` bash
# only stable version is available through Bower
$ bower install vue
```

## Duo

```js
var Vue = require('yyx990803/vue')
// for edge version:
var Vue = require('yyx990803/vue@dev')
```

## AMD Module Loaders

The standalone downloads or versions installed via Bower are wrapped with UMD so they can be used directly as an AMD module.

## Ready?

[Let's Get Started](/guide/).
