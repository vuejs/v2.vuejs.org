---
title: 生产环境部署
type: guide
order: 401
---

## 开启生产环境模式

开发时，Vue 会提供很多警告来帮你解决常见的错误与陷阱。生产时，这些警告语句却没有用，反而会增加你的载荷量。再次，有些警告检查有小的运行时开销，生产环境模式下是可以避免的。

### 不用打包工具

如果用 Vue 完整独立版本（直接用 `<script>` 元素引入 Vue），生产时应该用精简版本（`vue.min.js`)。请查看[安装指导](installation.html#独立版本)，附有开发与精简版本。

### 用打包工具

如果用 Webpack 或 Browserify 类似的打包工具时，生产状态会在 Vue 源码中由 `process.env.NODE_ENV` 决定，默认在开发状态。Webpack 与 Browserify 两个打包工具都提供方法来覆盖此变量并使用生产状态，警告语句也会被精简掉。每一个 `vue-cli` 模板有预先配置好的打包工具，但了解怎样配置会更好。

#### webpack

使用 webpack 的 [DefinePlugin](https://doc.webpack-china.org/plugins/define-plugin/) 来指定生产环境，以便在压缩时可以让 UglifyJS 自动删除代码块内的警告语句。例如配置：

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
    })
  ]
}
```

#### Browserify

- 运行打包命令，设置 `NODE_ENV` 为 `"production"`。等于告诉 `vueify` 避免引入热重载和开发相关代码。

- 使用一个全局 [envify](https://github.com/hughsk/envify) 转换你的 bundle 文件。这可以精简掉包含在 Vue 源码中所有环境变量条件相关代码块内的警告语句。例如：

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- Or, using [envify](https://github.com/hughsk/envify) with Gulp:

  ``` js
  // Use the envify custom module to specify environment variables
  var envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Required in order to process node_modules files
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```
  
- Or, using [envify](https://github.com/hughsk/envify) with Grunt and [grunt-browserify](https://github.com/jmreidy/grunt-browserify):

  ``` js
  // Use the envify custom module to specify environment variables
  var envify = require('envify/custom')
  
  browserify: {
    dist: {
      options: {
        // Function to deviate from grunt-browserify's default order
        configure: b => b
          .transform('vueify')
          .transform(
            // Required in order to process node_modules files
            { global: true },
            envify({ NODE_ENV: 'production' })
          )
          .bundle()
      }
    }
  }
  ```

#### Rollup

使用 [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## 预编译模板

当你需要处理 DOM 内或 JavaScript 内的模板时，“从模板到渲染函数”的编译就会在线上发生。通常情况下这种处理是足够快的，但是如果你的应用对性能很敏感最好还是回避。

预编译模板最简单的方式就是使用[单文件组件](./single-file-components.html) - 相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。

如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 [vue-template-loader](https://github.com/ktsn/vue-template-loader)，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。

## 提取组件 CSS

使用[单文件组件](./single-file-components.html)时，`<style>` 标签在开发运行过程中会被动态实时注入。在生产环境中，你可能需要从所有组件中提取样式到单独的 CSS 文件中。有关如何实现的详细信息，请查阅 [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) 和 [vueify](https://github.com/vuejs/vueify#css-extraction) 相应文档。

可查阅相关构建工具文档：

- [webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack template has this pre-configured)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## 跟踪运行时错误

如果在组件渲染时出现运行错误，错误将会被传递至全局 `Vue.config.errorHandler` 配置函数（如果已设置）。利用这个钩子函数和错误跟踪服务（如 [Sentry](https://sentry.io)，它为 Vue 提供[官方集成](https://sentry.io/for/vue/)），可能是个不错的主意。

***

> 原文：http://vuejs.org/v2/guide/deployment.html

***