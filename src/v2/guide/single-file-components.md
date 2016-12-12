---
title: 单文件组件
type: guide
order: 19
---

## 介绍

 
在很多Vue项目中，我们使用 `Vue.component` 来定义全局组件，紧接着用 `new Vue({ el: '#container '})` 在每个页面内指定一个容器元素。

- **全局定义(Global definitions)**  强制要求每个 component 中的命名不得重复
- **字符串模板(String templates)**  缺乏语法高亮，在 HTML 有多行的时候，需要用到丑陋的 `\`
- **不支持CSS(No CSS support)**  意味着当 HTML 和 JavaScript 组件化时，CSS 明显被遗漏
- **没有构建步骤(No build step)**  限制只能使用 HTML 和 ES5 JavaScript,  而不能使用预处理器，如 Pug (formerly Jade) 和 Babel

文件扩展名为 `.vue` 的 **single-file components(单文件组件)** 为以上所有问题提供了解决方法，并且还可以使用 Webpack 或 Browserify 等构建工具。

这是一个文件名为 `Hello.vue` 的简单实例：

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

现在我们获得：

- [完整语法高亮](https://github.com/vuejs/awesome-vue#syntax-highlighting)
- [CommonJS 模块](https://webpack.github.io/docs/commonjs.html)
- [组件化的 CSS](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

正如我们说过的，我们可以使用预处理器来构建简洁和功能更丰富的组件，比如 Jade，Babel (with ES2015 modules)，和 Stylus。

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

这些特定的语言只是例子，你可以只是简单地使用 Buble，TypeScript，SCSS，PostCSS - 或者其他任何能够帮助你提高生产力的预处理器。

<!-- TODO: include CSS modules once it's supported in vue-loader 9.x -->

## 起步

### 针对刚接触 JavaScript 模块开发系统的用户

有了 `.vue` 组件，我们就进入了高级 JavaScirpt 应用领域。如果你没有准备好的话，意味着还需要学会使用一些附加的工具：

- **Node Package Manager (NPM)**: 阅读 [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) 直到 _10: Uninstalling global packages_章节.

- **Modern JavaScript with ES2015/16**: 阅读 Babel 的 [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). 你不需要立刻记住每一个方法，但是你可以保留这个页面以便后期参考。

在你花一些时日了解这些资源之后，我们建议你参考 [webpack-simple](https://github.com/vuejs-templates/webpack-simple) 。只要遵循指示，你就能很快的运行一个用到 `.vue` 组件，ES2015 和  热重载( hot-reloading ) 的Vue项目!

这个模板使用 [Webpack](https://webpack.github.io/)，一个能将多个模块打包成最终应用的模块打包工具。 [这个视频](https://www.youtube.com/watch?v=WQue1AN93YU) 介绍了Webpack的更多相关信息。 学习了这些基础知识后， 你可能想看看 [这个在 Egghead.io上的 高级 Webpack 课程](https://egghead.io/courses/using-webpack-for-production-javascript-applications).

在 Webpack中，每个模块被打包到 bundle 之前都由一个相应的 "loader" 来转换，Vue 也提供 [vue-loader](https://github.com/vuejs/vue-loader) 插件来执行 `.vue` 单文件组件 的转换. 这个 [webpack-simple](https://github.com/vuejs-templates/webpack-simple) 模板已经为你准备好了所有的东西，但是如果你想了解更多关于 `.vue` 组件和 Webpack 如何一起运转的信息，你可以阅读 [vue-loader 的文档](https://vue-loader.vuejs.org)。

### 针对高级用户

无论你更钟情 Webpack 或是 Browserify，我们为简单的和更复杂的项目都提供了一些文档模板。我们建议浏览 [github.com/vuejs-templates](https://github.com/vuejs-templates)，找到你需要的部分，然后参考 README 中的说明，使用 [vue-cli](https://github.com/vuejs/vue-cli) 工具生成新的项目。

模板中使用 [Webpack](https://webpack.github.io/) ，一个模块加载器加载多个模块然后构建成最终应用。为了进一步了解 Webpack, 可以看 [官方介绍视频](https://www.youtube.com/watch?v=WQue1AN93YU)。如果你有基础，可以看 [在 Egghead.io 上的 Webpack 进阶教程](https://egghead.io/courses/using-webpack-for-production-javascript-applications)。

***

> 原文： http://vuejs.org/guide/single-file-components.html

***
