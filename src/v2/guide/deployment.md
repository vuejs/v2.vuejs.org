---
title: 生产环境部署
type: guide
order: 20
---

## 删除警告

为了减少文件大小，Vue 精简独立版本已经删除了所有警告，但是当你使用 Webpack 或 Browserify 等工具时，你需要一些额外的配置实现这点。

### Webpack

If you are using the standalone build, i.e. directly including Vue via a script tag without a build tool, make sure to use the minified version (`vue.min.js`) for production.

### With Build Tools

When using a build tool like Webpack or Browserify, the production mode will be determined by `process.env.NODE_ENV` inside Vue's source code, and it will be in development mode by default. Both build tools provide ways to overwrite this variable to enable Vue's production mode, and warnings will be stripped by minifiers during the build. All `vue-cli` templates have these pre-configured for you, but it would be beneficial to know how it is done:

#### Webpack

使用 Webpack 的 [DefinePlugin](https://doc.webpack-china.org/plugins/define-plugin/) 来指定生产环境，以便在压缩时可以让 UglifyJS 自动删除代码块内的警告语句。例如配置：

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

- 运行打包命令，设置 `NODE_ENV` 为 `"production"`。等于告诉 `vueify` 避免引入热重载和开发相关代码。
- 使用一个全局 [envify](https://github.com/hughsk/envify) 转换你的 bundle 文件。这可以精简掉包含在 Vue 源码中所有环境变量条件相关代码块内的警告语句。例如：


``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

### Rollup

用 [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)

```
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

When using in-DOM templates or in-JavaScript template strings, the template-to-render-function compilation is performed on the fly. This is usually fast enough in most cases, but is best avoided if your application is performance-sensitive.

The easiest way to pre-compile templates is using [Single-File Components](single-file-components.html) - the associated build setups automatically performs pre-compilation for you, so the built code contains the already compiled render functions instead of raw template strings.

If you are using Webpack, and prefer separating JavaScript and template files, you can use [vue-template-loader](https://github.com/ktsn/vue-template-loader), which also transforms the template files into JavaScript render functions during the build step.

## 提取组件 CSS

使用[单文件组件](./single-file-components.html)时，`<style>` 标签在开发运行过程中会被动态实时注入。在生产环境中，你可能需要从所有组件中提取样式到单独的 CSS 文件中。有关如何实现的详细信息，请查阅 [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) 和 [vueify](https://github.com/vuejs/vueify#css-extraction) 相应文档。

- Webpack + vue-loader (`vue-cli` 已经配置好了官方的 `webpack` 模板)
- Browserify + vueify
- Rollup + rollup-plugin-vue

## 跟踪运行时错误

如果在组件渲染时出现运行错误，错误将会被传递至全局 `Vue.config.errorHandler` 配置函数（如果已设置）。利用这个钩子函数和错误跟踪服务（如 [Sentry](https://sentry.io)，它为 Vue 提供[官方集成](https://sentry.io/for/vue/)），可能是个不错的主意。

***

> 原文：http://vuejs.org/v2/guide/deployment.html

***

