---
title: 安装
type: guide
order: 1
vue_version: 2.0.1
dev_size: "184.49"
min_size: "61.72"
gz_size: "22.58"
---

### 兼容性

Vue.js 不支持 IE8 及其以下版本，因为 Vue.js 使用了 IE8 不能实现的 ECMAScript 5 特性。 Vue.js 支持所有[兼容 ECMAScript 5 的浏览器](http://caniuse.com/#feat=es5)。

### 更新日志

每个版本的更新日志见 [GitHub](https://github.com/vuejs/vue/releases)。

## 独立版本

直接下载并用 `<script>` 标签引入，`Vue` 会被注册为一个全局变量。**重要提示：在开发时请用开发版本，遇到常见错误它会给出友好的警告。**

<p class="tip">开发环境不要用最小压缩版，不然就失去了错误提示和警告!</p>

<div id="downloads">
<a class="button" href="http://rc.vuejs.org/js/vue.js" download>开发版本</a><span class="light info">包含完整的警告和调试模式</span>

<a class="button" href="http://rc.vuejs.org/js/vue.min.js" download>生产版本</a><span class="light info">删除了警告，{{gz_size}}kb min+gzip</span>
</div>

### CDN

Recommended: [unpkg](https://unpkg.com/vue/dist/vue.js), which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at [unpkg.com/vue/](https://unpkg.com/vue/).

Also available on [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) or [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), but these two services take some time to sync so the latest release may not be available yet.

## NPM

在用 Vue.js 构建大型应用时推荐使用 NPM 安装，NPM 能很好地和诸如 [Webpack](http://webpack.github.io/) 或 [Browserify](http://browserify.org/) 模块打包器配合使用。Vue.js 也提供配套工具来开发[单文件组件](single-file-components.html)。

``` bash
# 最新稳定版
$ npm install vue
```

### Standalone vs. Runtime-only Build

There are two builds available, the standalone build and the runtime-only build.

- The standalone build includes the compiler and supports the `template` option. **It also relies on the presence of browser APIs so you cannot use it for server-side rendering.**

- The runtime-only build does not include the template compiler, and does not support the `template` option. You can only use the `render` option when using the runtime-only build, but it works with single-file components, because single-file components' templates are pre-compiled into `render` functions during the build step. The runtime-only build is roughly 30% lighter-weight than the standalone build, weighing only 16kb min+gzip.

By default, the NPM package exports the **runtime-only** build. To use the standalone build, add the following alias to your webpack config:

``` js
resolve: {
  alias: {
    vue: 'vue/dist/vue.js'
  }
}
```

对于Browserify,可以用 [aliasify](https://github.com/benbria/aliasify) 

<p class="tip">Do NOT do `import Vue from 'vue/dist/vue.js'` - since some tools or 3rd party libraries may import vue as well, this may cause the app to load both the runtime and standalone builds at the same time and lead to errors.</p>

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The standalone build depends on this feature to compile templates, so is unusable in these environments.

On the other hand, the runtime-only build is fully CSP-compliant. When using the runtime-only build with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

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

**Important**: the built files in GitHub's `/dist` folder are only checked-in during releases. To use Vue from the latest source code on GitHub, you will have to build it yourself!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# 最新稳定版本
$ bower install vue
```

## AMD 模块加载器

独立下载版本或通过 Bower 安装的版本已用 UMD包装，因此它们可以直接用作 AMD 模块。

***

> 原文：http://rc.vuejs.org/guide/installation.html

***
