---
title: Production Deployment Tips
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

Use Webpack's [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) to indicate a production environment, so that warning blocks can be automatically dropped by UglifyJS during minification. Example config:

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

- Run your bundling command with the actual `NODE_ENV` environment variable set to `"production"`. This tells `vueify` to avoid including hot-reload and development related code.

- Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle. This allows the minifier to strip out all the warnings in Vue's source code wrapped in env variable conditional blocks. For example:

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

#### Rollup

Use [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

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

When using in-DOM templates or in-JavaScript template strings, the template-to-render-function compilation is performed on the fly. This is usually fast enough in most cases, but is best avoided if your application is performance-sensitive.

The easiest way to pre-compile templates is using [Single-File Components](./single-file-components.html) - the associated build setups automatically performs pre-compilation for you, so the built code contains the already compiled render functions instead of raw template strings.

If you are using Webpack, and prefer separating JavaScript and template files, you can use [vue-template-loader](https://github.com/ktsn/vue-template-loader), which also transforms the template files into JavaScript render functions during the build step.

## Extracting Component CSS

When using Single-File Components, the CSS inside components are injected dynamically as `<style>` tags via JavaScript. This has a small runtime cost, and if you are using server-side rendering it will cause a "flash of unstyled content". Extracting the CSS across all components into the same file and avoid these issues, and also result in better CSS minification and caching.

Refer to the respective build tool documentations to see how it's done:

- [Webpack + vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack template has this pre-configured)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue#options)

## Tracking Runtime Errors

If a runtime error occurs during a component's render, it will be passed to the global `Vue.config.errorHandler` config function if it has been set. It might be a good idea to leverage this hook together with an error-tracking service like [Sentry](https://sentry.io), which provides [an official integration](https://sentry.io/for/vue/) for Vue.
