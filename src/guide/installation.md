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
