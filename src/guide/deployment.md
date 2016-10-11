---
title: Deploying For Production
type: guide
order: 20
---

## Stripping Out Warnings

The minified standalone build of Vue has already stripped out all the warnings for you for a smaller file size, but when you are using tools like Webpack or Browserify, you will need some additional configuration to achieve this.

### Webpack

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

- Run your bundling command with `NODE_ENV` set to `"production"`. This tells `vueify` to avoid including hot-reload and development related code.
- Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle. This allows the minifier to strip out all the warnings in Vue's source code wrapped in env variable conditional blocks. For example:


``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

- To extract styles to a separate css file use a extract-css plugin which is included in vueify.

``` bash
NODE_ENV=production browserify -g envify -p [ vueify/plugins/extract-css -o build.css ] -e main.js | uglifyjs -c -m > build.js
```

## Tracking Runtime Errors

If a runtime error occurs during a component's render, it will be passed to the global `Vue.config.errorHandler` config function if it has been set. It might be a good idea to leverage this hook together with an error-tracking service like [Sentry](https://sentry.io), which provides [an official integration](https://sentry.io/for/vue/) for Vue.

## Extracting CSS

When using [Single-File Components](./single-file-components.html), the `<style>` tags are injected dynamically at runtime during development. In production you may want to extract the styles across all components into a single CSS file. For details on how to achieve this, consult the respective documentation for [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) and [vueify](https://github.com/vuejs/vueify#css-extraction).

The official `webpack` template from `vue-cli` has this already configured out of the box.
