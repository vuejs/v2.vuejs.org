---
title: Installation
type: guide
order: 1
vue_version: 1.0.0-rc.1
dev_size: "237.15"
min_size: "71.70"
gz_size: "23.52"
---

> **Compatibility Note:** Vue.js does not support IE8 and below.

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable.

<div id="downloads">
<a class="button" href="https://raw.github.com/vuejs/vue/{{vue_version}}/dist/vue.js" download>Development Version</a><span class="light info">With full warnings and debug mode</span>

<a class="button" href="https://raw.github.com/vuejs/vue/{{vue_version}}/dist/vue.min.js" download>Production Version</a><span class="light info">Warnings stripped, {{gz_size}}kb min+gzip</span>
</div>

### CDN

Available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet).

### CSP-compliant build

Some environments, such as Google Chrome Apps, enforces Content Security Policy (CSP) and does not allow the use of `new Function()` for evaluating expressions. In these cases you can use the [CSP-compliant build](https://github.com/vuejs/vue/tree/csp/dist) instead.

## NPM

``` bash
$ npm install vue
# for csp-compliant version:
$ npm install vue@csp
# for dev build (from GitHub):
$ npm install vuejs/vue#dev
```

## Bower

``` bash
# only stable version is available through Bower
$ bower install vue
```

## AMD Module Loaders

The standalone downloads or versions installed via Bower are wrapped with UMD so they can be used directly as an AMD module.
