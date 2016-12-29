---
title: 生产环境部署
type: guide
order: 20
---

## Turn on Production Mode

During development, Vue provides a lot of warnings to help you with common errors and pitfalls. However, these warning strings become useless in production and bloat your app's payload size. In addition, some of these warning checks have small runtime costs that can be avoided in production mode.


### Without Build Tools

If you are using the standalone build, i.e. directly including Vue via a script tag without a build tool, make sure to use the minified version (`vue.min.js`) for production.

### With Build Tools

When using a build tool like Webpack or Browserify, the production mode will be determined by `process.env.NODE_ENV` inside Vue's source code, and it will be in development mode by default. Both build tools provide ways to overwrite this variable to enable Vue's production mode, and warnings will be stripped by minifiers during the build. All `vue-cli` templates have these pre-configured for you, but it would be beneficial to know how it is done:

#### Webpack

使用 Webpack 的 [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) 来指定生产环境，以便在压缩时可以让 UglifyJS 自动删除代码块内的警告语句。例如配置：

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

## Pre-Compiling Templates

When using in-DOM templates or in-JavaScript template strings, the template-to-render-function compilation is performed on the fly. This is usually fast enough in most cases, but is best avoided if your application is performance-sensitive. The easiest way to pre-compile templates is using [Single-File Components](./single-file-components.html) - the associated build setups automatically performs pre-compilation for you, so the built code contains the already compiled render functions instead of raw template strings.

## 提取 CSS

使用[单文件组件](./single-file-components.html)时，`<style>` 标签在开发运行过程中会被动态实时注入。This has a small runtime cost, and if you are using server-side rendering it will cause a "flash of unstyled content". Extracting the CSS across all components into the same file and avoid these issues, and also result in better CSS minification and caching.


Refer to the respective build tool documentations to see how it's done:

- [Webpack + vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack template has this pre-configured)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue#options)

## 跟踪运行时错误

如果在组件渲染时出现运行错误，错误将会被传递至全局 `Vue.config.errorHandler` 配置函数（如果已设置）。利用这个钩子函数和错误跟踪服务（如 [Sentry](https://sentry.io)，它为 Vue 提供[官方集成](https://sentry.io/for/vue/)），可能是个不错的主意。


