---
title: 单文件组件
type: guide
order: 19
---

## 介绍
 
在很多Vue项目中，全局组件使用 `Vue.component` 来定义，紧接着用 `new Vue({ el: '#container '})` 在每个页面内指定一个容器元素。

当 JavaScript 只是用来增强某个视图的时候，这种方案在中小型项目中工作得很好。然而在更复杂的项目中，或者当你的前端完全采用 JavaScript 驱动的时候，以下弊端就显现出来：

- **全局定义(Global definitions)**  强制要求每个 component 中的命名不得重复
- **字符串模板(String templates)**  缺乏语法高亮，在 HTML 有多行的时候，需要用到丑陋的 `/`
- **不支持CSS(No CSS support)**  意味着当 HTML 和 JavaScript 在组件中都是模块化时，CSS 明显被遗漏
- **没有构建步骤(No build step)**  限制只能使用 HTML 和 ES5 JavaScript,  而不能使用预处理器，如 Pug (formerly Jade) 和 Babel

文件扩展名为 `.vue` 的 **single-file components(单文件组件)** 正是用来解决以上所有的问题，并且还可以使用 Webpack 或 Browserify 等开发工具。

这是一个文件名为 `Hello.vue` 的简单实例：

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

现在我们获得：

- [完整语法高亮](https://github.com/vuejs/awesome-vue#syntax-highlighting)
- [CommonJS 模块](https://webpack.github.io/docs/commonjs.html)
- [Component-scoped CSS](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

正如我们说过的，我们可以使用预处理器来完成简洁和功能更丰富的组件，比如 Jade，Babel (with ES2015 modules)，和 Stylus。

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

这些特定的语言只是例子，你可以只是简单地使用 Buble，TypeScript，SCSS，PostCSS - 或者一些其他的能够帮助你提高生产力的预处理器。

<!-- TODO: include CSS modules once it's supported in vue-loader 9.x -->

## 启程

### 针对刚接触 JavaScript 模块开发系统的用户

使用 `.vue` 组件，我们就进入了高级 JavaScirpt 应用领域。如果你没有准备好的话，意味着还需要学会使用一些附加的工具：

- **Node Package Manager (NPM)**: 阅读 [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) 直到 _10: Uninstalling global packages_章节.

- **Modern JavaScript with ES2015/16**: 阅读 Babel 的 [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). 你现在不需要记住所有的细节特征，但是保留这个页面作为以后可以快速找到的参考。

在你花一些时日了解这些资源之后，我们推荐你切换到 [webpack-simple](https://github.com/vuejs-templates/webpack-simple) 模板参考。跟着这些指示，你应该有一个Vue 项目用到 `.vue` 组件, ES2015 和 任意时间 热重载( hot-reloading ) 运行!

这个模板使用 [Webpack](https://webpack.github.io/)，一个模块打包工具，将多个模块打包成最终的应用。要学习更多的关于 Webpack 的内容， [这个视频](https://www.youtube.com/watch?v=WQue1AN93YU) 提供了很好的介绍。 当你学会这些基础， 你可能想切换到 [这个在 Egghead.io上的 高级 Webpack 课程](https://egghead.io/courses/using-webpack-for-production-javascript-applications).

在 Webpack中，每个模块被包含到 bundle 之前都由相应的一个 "loader" 来转换，Vue 也提供 [vue-loader](https://github.com/vuejs/vue-loader) 插件来保证 `.vue` 单文件组件 的转换. 这个 [webpack-simple](https://github.com/vuejs-templates/webpack-simple) 模板已经为你准备好了所以的东西，但是如果你想了解更多关于 `.vue` 组件和 Webpack 一起时是如何工作的，你可以阅读 [vue-loader 的文档](https://vue-loader.vuejs.org)。

### 针对高级用户

无论你喜欢 Webpack 或是 Browserify，我们为简单的和更复杂的项目都提供了一些文档模板。我们建议浏览 [github.com/vuejs-templates](https://github.com/vuejs-templates)，找到你需要的部分，然后参考 README 中的说明，使用 [vue-cli](https://github.com/vuejs/vue-cli) 工具生成新的项目。

## 产品部署

Vue 的压缩独立构建(minified standalone build)版本为了更小的文件体积已经为你移除了所有的警告，但是当你使用 Webpack 或是 Browserify 这样的工具的时候，你需要一些附加的配置来实现。

### Webpack

使用 Webpack 的 [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) 指明产品环境，使得警告信息在压缩期间可以通过 UglifyJS 自动丢弃。配置实例:

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
```

### Browserify

- 运行你的打包命令，并将 `NODE_ENV` 设置为 `"production"`，这会告诉 `vueify` 避免包含 hot-reload 和 相关开发代码。
- 应用全局 [envify](https://github.com/hughsk/envify) 转换到你的 bundle 中。在环境变量条件块中添加，允许压缩工具从折叠的 Vue 的源代码中移除所有的警告信息，例如：

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

- 使用 vueify 中的 extract-css 插件提取 样式(styles) 到一个独立的 css 文件中。

``` bash
NODE_ENV=production browserify -g envify -p [ vueify/plugins/extract-css -o build.css ] -e main.js | uglifyjs -c -m > build.js
```

***

> 原文： http://vuejs.org/guide/single-file-components.html

***
