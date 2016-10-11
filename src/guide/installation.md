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
<a class="button" href="http://vuejs.org/js/vue.js" download>开发版本</a><span class="light info">包含完整的警告和调试模式</span>

<a class="button" href="http://vuejs.org/js/vue.min.js" download>生产版本</a><span class="light info">删除了警告，{{gz_size}}kb min+gzip</span>
</div>

### CDN


推荐：[unpkg](https://unpkg.com/vue/dist/vue.js), 会保持和 npm 发布的最新的版本一致。可以在 [unpkg.com/vue/](https://unpkg.com/vue/) 浏览 npm 包资源。

也可以从 [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) 或 [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) 获取，不过这两个服务版本更新可能略滞后。

## NPM


在用 Vue.js 构建大型应用时推荐使用 NPM 安装， NPM 能很好地和诸如 [Webpack](http://webpack.github.io/) 或 [Browserify](http://browserify.org/) 模块打包器配合使用。 Vue.js 也提供配套工具来开发[单文件组件](single-file-components.html)。


``` bash
# 最新稳定版
$ npm install vue
```

### 独立构建 vs 运行时构建

有两种构建方式，独立构建和运行构建。

- 独立构建包括编译和支持 `template` 选项。 **它也依赖于浏览器的接口的存在，所以你不能使用它来为服务器端渲染。**

- 运行时构建不包括模板编译，不支持 `template` 选项。运行时构建，可以用 `render` 选项，但它只在单文件组件中起作用，因为单文件组件的模板是在构建时预编译到 `render` 函数中，运行时构建只有独立构建大小的30%，只有 16Kb min+gzip大小。

默认 NPM 包导出的是 **运行时** 构建。为了使用独立构建，在 webpack 配置中添加下面的别名：

``` js
resolve: {
  alias: {
    vue: 'vue/dist/vue.js'
  }
}
```

对于Browserify，可以用 [aliasify](https://github.com/benbria/aliasify)

<p class="tip">不要用 `import Vue from 'vue/dist/vue.js'` - 用一些工具或第三方库引入 Vue ，这可能会导致应用程序在同一时间加载运行时和独立构建并造成错误。</p>

### CSP 环境

有些环境，如 Google Chrome Apps ，强制应用内容安全策略 (CSP) ，不能使用 new Function() 对表达式求值。这时可以用 CSP 兼容版本。独立的构建取决于该功能编译模板，所以无法使用这些环境。


另一方面，运行时构建的是完全兼容 CSP 的。当通过 [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) 或者 [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple) 构建时，在 CSP 环境中模板将被完美预编译到 `render` 函数中。

## 命令行工具

Vue.js 提供一个[官方命令行工具](https://github.com/vuejs/vue-cli)，可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需一分钟即可启动带热重载、保存时静态检查以及可用于生产环境的构建配置的项目：

``` bash
# 全局安装 vue-cli
$ npm install --global vue-cli
# 创建一个基于 webpack 模板的新项目
$  vue init webpack my-project
# 安装依赖，走你
$ cd my-project
$ npm install
$ npm run dev
```

## 开发版本

**重要**: 在发布后构建的文件在 Github 仓库的 `/dist` 文件夹。为了使用 Github 上 Vue 最新的资源，你得自己构建。 

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

独立下载版本或通过 Bower 安装的版本已用 UMD 包装，因此它们可以直接用作 AMD 模块。

***

> 原文：http://vuejs.org/guide/installation.html

***
