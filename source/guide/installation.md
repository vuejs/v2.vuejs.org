title: 安装
type: guide
order: 1
vue_version: 0.11.4
dev_size: 177.28
min_size: 55.18
gz_size: 18.11
---

> **兼容性提示：**Vue.js 不支持 IE8 及其以下版本。

## 直接下载

直接下载并写入一个 script 标签中，`Vue` 就会被注册为一个全局变量。

<div id="downloads">
<a class="button" href="https://raw.github.com/yyx990803/vue/{{vue_version}}/dist/vue.js" download>开发者版本</a><span class="light info">{{dev_size}}kb, plenty of comments and debug/warning messages.</span>

<a class="button" href="https://raw.github.com/yyx990803/vue/{{vue_version}}/dist/vue.min.js" download>生产版本</a><span class="light info">{{min_size}}kb minified / {{gz_size}}kb gzipped</span>
</div>

也可以在 [cdnjs](http://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) 使用 (版本更新会略滞后)。

## NPM

``` bash
$ npm install vue
# 获得尖端版本：
$ npm install yyx990803/vue#dev
```

## Bower

``` bash
# Bower 只能够获得稳定版本
$ bower install vue
```

## Duo

```js
var Vue = require('yyx990803/vue')
// 获得尖端版本：
var Vue = require('yyx990803/vue@dev')
```

## Component

``` bash
$ component install yyx990803/vue
# 获得尖端版本：
$ component install yyx990803/vue@dev
```

## AMD 模块加载器

直接下载或通过 Bower 安装的版本可以用 UMD 包裹起来直接作为 AMD 模块使用。

## 准备好了吗？

[走起！](../guide/)