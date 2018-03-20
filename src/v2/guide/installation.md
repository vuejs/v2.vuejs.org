---
title: 安装
type: guide
order: 1
vue_version: 2.5.13
gz_size: "30.67"
---

### 兼容性

Vue.js **不支持** IE8 及其以下版本，因为 Vue.js 使用的 ECMAScript 5 特性在 IE8 无法模拟。Vue.js 支持所有[兼容 ECMAScript 5 的浏览器](https://caniuse.com/#feat=es5)。

### 更新日志

最新稳定版本：{{vue_version}}

每个版本的详细更新日志见 [GitHub](https://github.com/vuejs/vue/releases)。

## Vue Devtools

在使用 Vue 时，我们推荐你在浏览器中安装 [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) ，可以通过更加友好的用户界面，来审查和调试你的 Vue 应用程序。

## 直接引入 `<script>` 标签

通过 script 标签直接下载并引入，`Vue` 会被注册为一个全局变量。

<p class="tip">在开发环境，不要使用最小压缩版本。因为开发版本中，所有常见错误的警告会更加友好！</p>

<div id="downloads">
<a class="button" href="http://vuejs.org/js/vue.js" download>开发环境版本</a><span class="light info">包含完整的警告和调试模式</span>

<a class="button" href="http://vuejs.org/js/vue.min.js" download>生产环境版本</a><span class="light info">删除警告，{{gz_size}}KB min+gzip</span>
</div>

### CDN

我们比较推荐的方式是，链接到可以手动修改的指定版本上：

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js"></script>
```

你可以在 [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/) 浏览 npm 包的源码。

还可以使用 [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) 和 [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) 来获取 Vue（cdnjs 需要一段时间才能同步，所以可能会无法获取最新版本）。

请务必阅读 [Vue 不同构建版本的解释说明](#%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A%E8%AF%B4%E6%98%8E)，并且在你发布的网站中使用**生产环境版本**，也就是将 `vue.js` 替换为 `vue.min.js`。
这是一个为了更快速的执行，而进行更小体积优化的构建版本，并不是为了好的开发体验。

## NPM

在用 Vue 构建大型应用程序时，推荐使用 NPM 安装方式。它可以很好地与模块打包器(module bundler)（例如 [ webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/)）配合使用。Vue 还提供用于创建[单文件组件](single-file-components.html)的配套工具。

``` bash
# 最新稳定版本
$ npm install vue
```

## 命令行接口工具

Vue.js 提供一个[官方的命令行接口工具](https://github.com/vuejs/vue-cli)，用于快速搭建大型单页面应用程序。能够为现代前端开发的工作流程，带来持久强力的基础架构。只需几分钟，就可以建立并运行一个带有「热重载、保存时代码检查以及可直接用于生产环境的构建配置」的项目：

``` bash
# 安装 vue-cli
$ npm install --global vue-cli
# 使用 "webpack" 模板创建一个新项目
$ vue init webpack my-project
# 安装依赖，然后开始！
$ cd my-project
$ npm run dev
```

<p class="tip">CLI 工具假定用户对 Node.js 和相关构建工具预先有一定程度的了解。如果你是初次接触 Vue，或者刚开始了解前端构建工具，我们强烈建议你不要使用任何构建工具，来完成<a href="./">指南</a>中的示例。</p><p class="tip">对于大陆用户，建议将 npm 的注册表源[设置为国内的镜像](http://riny.net/2014/cnpm/)，可以大幅提升安装速度。</p>

## 不同构建版本的解释说明

在 [NPM 包的 `dist/` 目录下](https://cdn.jsdelivr.net/npm/vue/dist/)，你会找到许多不同构建版本的 Vue.js。以下是它们之间差异的概述：

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **完整版本(Full)** | vue.js | vue.common.js | vue.esm.js |
| **只含有运行时版本(Runtime-only)** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **完整版本（生产环境）** | vue.min.js | - | - |
| **只含有运行时版本（生产环境）** | vue.runtime.min.js | - | - |

### 术语说明

- **完整版本(Full)**：包含编译器(compiler)和运行时(runtime)的构建版本。

- **编译器(Compiler)**：负责将模板字符串编译成 JavaScript 渲染函数(render function)的代码。

- **运行时(Runtime)**：负责创建 Vue 实例(creating Vue instances)、渲染(rendering)和修补虚拟 DOM(patching virtual DOM) 等的代码。基本上，等同于完整版本减去编译器。

- **[UMD](https://github.com/umdjs/umd)**：UMD 构建版本能够直接在浏览器中通过 `<script>` 标签使用。jsDelivr CDN 提供的默认文件 [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue)，是运行时+编译器(Runtime + Compiler)的 UMD 构建版本（`vue.js`）。

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**：CommonJS 版本用于较早期的打包器(bundler)（例如 [browserify](http://browserify.org/) 或 [webpack 1](https://webpack.github.io) 等）中。用于这些打包器的默认文件(`pkg.main`)，是只含有运行时(Runtime only)的 CommonJS 构建版本(`vue.runtime.common.js`)。

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**：ES 模块版本构建用于现代打包器（例如 [webpack 2](https://webpack.js.org) 或 [rollup](https://rollupjs.org/) 等）中。用于这些打包器的默认文件(`pkg.module`)，是只含有运行时(Runtime only)的 ES Module 构建版本(`vue.runtime.esm.js`)。

### 运行时+编译器(Runtime + Compiler)版本 vs 只含有运行时版本(Runtime-only)

如果你需要在客户端编译模板（例如，向 `template` 选项传入一个字符串，或者需要将模板中的非 DOM 的 HTML 挂载到一个元素），你需要带有编译器的版本，因而需要完整构建版本。

``` js
// 这种情况需要编译器(compiler)
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 这种情况不需要
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

在使用 `vue-loader` 或 `vueify` 时，`*.vue` 文件中的模板会 在构建时(build time)预编译(pre-compile)为 JavaScript。最终生成的 bundle 中你不再需要编译器(compiler)，因此可以直接使用只含有运行时的构建版本(runtime-only)。

由于只含有运行时构建版本(runtime-only)比完整构建版本(full-build)轻量大约 30%，你应该尽可能使用只含有运行时的构建版本。如果你还是希望使用完整构建版本，则需要在打包器中配置别名：

由于运行时版本的构建比其全面版本的重量轻约30％，因此你可以随时使用它。如果你仍然希望使用完整版本，则需要在捆绑程序中配置别名：

#### webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 在 webpack 1 中使用 'vue/dist/vue.common.js'
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

在项目的 `package.json` 文件中添加：

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### 开发环境模式 vs 生产环境模式

对于 UMD 构建版本，开发环境/生产环境模式是必须配置的选项(hard-coded)，未压缩版本文件用于开发环境，压缩文件用于生产环境。

CommonJS 和 ES 模块构建版本适用于打包器，因此我们不需要为它们提供压缩版本。你需要自己负责对最终的 bundle 进行压缩。

CommonJS 和 ES 模块构建版本也可以保留初始环境 `process.env.NODE_ENV` 变量检测，以在打包器运行时的决定具体使用的模式。你应该使用合适的打包器配置来替换这些环境变量，以在打包器运行时控制 Vue 使用哪种模式。将 `process.env.NODE_ENV` 替换为字符串字面量，可以允许像 UglifyJS 的压缩工具将那些仅开发环境(development-only)用到的代码块全部删除，以减少最终文件的大小。

#### webpack

使用 webpack 的 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)：

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

使用 [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)：

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

使用 [envify](https://github.com/hughsk/envify) 来全局替换 bundle。

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

另请参阅[生产环境部署](deployment.html)。

### CSP 环境

某些环境（例如 Google Chrome Apps）强制执行内容安全策略(Content Security Policy - CSP)，禁止使用 `new Function()` 对表达式求值。完整构建版本在编译模板时，会依赖于此功能，因此在这些环境下无法使用。

另一方面，只含有运行时的构建版本(runtime-only build)可以完全兼容 CSP(fully CSP-compliant)。当你在 [webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple)  或 [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple) 中使用只含有运行时的构建版本(runtime-only build)时，模板将会预编译为 `render` 函数，最终的 `render` 函数能够完美的运行于 CSP 环境。

## 在开发时进行构建

**重要**：GitHub 的 `/dist` 文件夹中的构建文件，仅在版本正式发布时才提交更新。要使用 GitHub 的最新源代码构建的 Vue 版本，你必须自行构建它！

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

只能从 Bower 获取构建为 UMD 版本的 Vue.js。

``` bash
# 最新稳定版本
$ bower install vue
```

## AMD 模块加载器

所有构建为 UMD 版本的 Vue.js 都可以直接当作 AMD 模块使用。

***

> 原文：https://vuejs.org/v2/guide/installation.html

***
