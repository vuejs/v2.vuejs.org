---
title: 安装
type: guide
order: 0
vue_version: 2.0.0-rc.1
dev_size: "187.07"
min_size: "60.65"
gz_size: "22.06"
---

### 兼容性

Vue.js 不支持 IE8 及其以下版本，因为 Vue.js 使用了 IE8 不能实现的 ECMAScript 5 特性。 Vue.js 支持所有[兼容 ECMAScript 5 的浏览器](http://caniuse.com/#feat=es5)。

### 更新日志

每个版本的更新日志见 [GitHub](https://github.com/vuejs/vue/releases)。

## 独立版本

直接下载并用 `<script>` 标签引入，`Vue` 会被注册为一个全局变量。**重要提示：在开发时请用开发版本，遇到常见错误它会给出友好的警告。**

<div id="downloads">
<a class="button" href="http://rc.vuejs.org/js/vue.js" download>开发版本</a><span class="light info">包含完整的警告和调试模式</span>

<a class="button" href="http://rc.vuejs.org/js/vue.min.js" download>生产版本</a><span class="light info">删除了警告，{{gz_size}}kb min+gzip</span>
</div>

### CDN

可以从 [jsdelivr](http://cdn.jsdelivr.net/vue/2.0.0-rc.1/vue.min.js) 或 [cdnjs](http://cdnjs.cloudflare.com/ajax/libs/vue/2.0.0-rc.1/vue.min.js) 获取（版本更新可能略滞后）。

也可以使用 [npmcdn](https://npmcdn.com/vue@1.0.26/dist/vue.min.js)，这个链接指向发布到 npm 上的最新稳定版本。 可以在 [npmcdn.com/vue/](https://npmcdn.com/vue/) 上查看包的源码。
### CSP 兼容版本

有些环境，如 Google Chrome Apps，强制应用内容安全策略 (CSP) ，不能使用 `new Function()` 对表达式求值。独立构建编译模板时依赖这个特性，所以不能在这类环境下使用。

然而，有个解决方案，当用webpack+vue-loader或者Browserify+vueify构建vue应用时，你的模板将被编译进`render`函数实现完美运作在CSP环境中。

## NPM

在用 Vue.js 构建大型应用时推荐使用 NPM 安装，NPM 能很好地和诸如 [Webpack](http://webpack.github.io/) 或 [Browserify](http://browserify.org/) 的 CommonJS 模块打包器配合使用。Vue.js 也提供配套工具来开发[单文件组件](application.html#单文件组件)。

``` bash
# 最新稳定版
$ npm install vue@next
```

## 命令行工具

Vue.js 提供一个[官方命令行工具](https://github.com/vuejs/vue-cli)，可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需一分钟即可启动带热重载、保存时静态检查以及可用于生产环境的构建配置的项目：

``` bash
# 全局安装 vue-cli
$ npm install --global vue-cli
# 创建一个基于 "webpack" 模板的新项目
# !!要做的：这个模板还不存在
$ vue init webpack-2.0 my-project
# 安装依赖，走你
$ cd my-project
$ npm install
$ npm run dev
```

## 开发版本

**重要**：发布到 NPM 上的 CommonJS 包 (`vue.common.js`) 只在发布新版本时签入 `next` 分支，想使用 GitHub 上最新的源码，需要自己编译：

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
git checkout next
npm install
npm run build
```

## Bower

``` bash
# 最新稳定版本
$ bower install vue#next
```

## AMD 模块加载器

独立下载版本或通过 Bower 安装的版本已用 UMD包装，因此它们可以直接用作 AMD 模块。

***

> 原文：http://rc.vuejs.org/guide/installation.html

***

# Installation

### Compatibility Note

Vue does **not** support IE8 and below, because it uses ECMAScript 5 features that are un-shimmable in IE8. However it supports all [ECMAScript 5 compliant browsers](http://caniuse.com/#feat=es5).

### Release Notes

Detailed release notes for each version are available on [GitHub](https://github.com/vuejs/vue/releases).

## Standalone

Simply download and include with a script tag. `Vue` will be registered as a global variable. **Pro tip: Don't use the minified version during development. You will miss out all the nice warnings for common mistakes.**

<div id="downloads">
<a class="button" href="/js/vue.js" download>Development Version</a><span class="light info">With full warnings and debug mode</span>

<a class="button" href="/js/vue.min.js" download>Production Version</a><span class="light info">Warnings stripped, {{gz_size}}kb min+gzip</span>
</div>

### CDN

Available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) (takes some time to sync so the latest version might not be available yet).

Also available on [npmcdn](https://npmcdn.com/vue/dist/vue.min.js), which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at [npmcdn.com/vue/](https://npmcdn.com/vue/).

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The standalone build depends on this feature to compile templates, so is unusable in these environments.

There _is_ a solution however. When using Vue in a build system with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple-2.0) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple-2.0), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

## NPM

NPM is the recommended installation method when building large scale applications with Vue. It pairs nicely with module bundlers such as [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). Vue also provides accompanying tools for authoring [Single File Components](application.html#Single-File-Components).

``` bash
# latest stable
$ npm install vue@next
```

## CLI

Vue.js provides an [official CLI](https://github.com/vuejs/vue-cli) for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds:

``` bash
# install vue-cli
$ npm install --global vue-cli
# create a new project using the "webpack" boilerplate
# !!TODO: THIS TEMPLATE DOES NOT EXIST YET
$ vue init webpack-2.0 my-project
# install dependencies and go!
$ cd my-project
$ npm install
$ npm run dev
```

## Dev Build

**Important**: the CommonJS bundle distributed on NPM (`vue.common.js`) is only checked in during releases on the `next` branch. To use Vue from the latest source code on GitHub, you will have to build it yourself!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
git checkout next
npm install
npm run build
```

## Bower

``` bash
# latest stable
$ bower install vue#next
```

## AMD Module Loaders

The standalone downloads or versions installed via Bower are wrapped with UMD so they can be used directly as an AMD module.
