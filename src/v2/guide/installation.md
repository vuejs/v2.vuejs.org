---
title: Встановлення
type: guide
order: 1
vue_version: 2.6.10
gz_size: "33.30"
---

### Сумісність

Vue **не** підтримує IE8 та нижче, оскільки він використовує властивості ECMAScript 5, які неможливо емулювати в IE8. Разом з тим, Vue підтримує всі [браузери, що підтримують ECMAScript 5](https://caniuse.com/#feat=es5).

### Примітки щодо випуску

Остання стабільня версія: {{vue_version}}

Деталізована інформація щодо випуску кожної версії доступна на [GitHub](https://github.com/vuejs/vue/releases).

## Інструменти Vue Devtools

Якщо ви використовуєте Vue, ми радимо також встановити [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) у Вашому браузері, що дозволить Вам оглядати та відлагоджувати Ваші додатки на Vue за допомогою приємного інтерфейсу.

## Додавання напряму через `<script>`

Завантажте Vue та додайте шлях до файлу через тег script. `Vue` буде доступним як глобальна змінна.

<p class="tip">Не використовуйте мінімізовану версію під час зрозробки. Ви втратите цінні попередження про найбільш поширювані помилки!</p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>Версія для розробки</a><span class="light info">З усіма попередженнями та режимом відлагодження</span>

  <a class="button" href="/js/vue.min.js" download>Продакшн-версія</a><span class="light info">Без попереджень, мінімізована та стиснута, {{gz_size}}KБ</span>
</div>

### CDN

Для прототипування або навчання, Ви можете використовувати найсвіжішу версію наступним чином:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

Для продакшн-середовища, ми рекомендуємо зафіксуватися на певній конкретній версії, щоб уникнути раптових поломок при виході нових версій:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0"></script>
```

Якщо ж Ви використовуєте нативні ES модулі, в такому разі існує відповідна сумісна збірка: 

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.js'
</script>
```

Ви можете переглядати джерело NPM пакунку на [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue також доступний і на [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) та [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (у випадку з cdnjs синхронізація з новими релізами може зайняти певний час).

Перегляньте [різні збірки Vue](#Explanation-of-Different-Builds) та використовуйте **продакшн-версію** для Вашого опублікованого сайту, замінивши `vue.js` на `vue.min.js`. Це суттєво зменшена збірка, яка оптивізована на швидкість, а не на зручності для розробника.

## NPM

Використання NPM є рекомендованим способом при розробці масштабовних додатків на Vue. Він доволі гарно працює із так званими збірниками модулів, такими як [Webpack](https://webpack.js.org/) чи [Browserify](http://browserify.org/). Vue також надає допоміжні інструменти для створення [Однофайлових компонентів](single-file-components.html).

``` bash
# остання стабільна версія
$ npm install vue
```

## CLI

Vue пропонує [офіційний інтерфейс командного рядка (CLI)](https://github.com/vuejs/vue-cli) для швидкого риштування амбітних так званих односторінкових додатків (SPA). Він забезпечує збірку додатків сучасними методами, надаючи числені варіанти налаштувань. Процес триває всього кілька хвилин для готового середовища з підтримкою "гарячого" перезавантаження, автоматичного аналізу помилок при збереженні та збірок, готових до продакшну. Перегляньте [документацію по CLI](https://cli.vuejs.org), щоб отримати більше деталей.

<p class="tip">The CLI assumes prior knowledge of Node.js and the associated build tools. If you are new to Vue or front-end build tools, we strongly suggest going through <a href="./">the guide</a> without any build tools before using the CLI.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="sponsored noopener" title="Vue CLI">Переглянути пояснення на відео від Vue Mastery</a></div>

## Роз'яснення різних видів збірок

In the [`dist/` directory of the NPM package](https://cdn.jsdelivr.net/npm/vue/dist/) you will find many different builds of Vue.js. Here's an overview of the difference between them:

| | UMD | CommonJS | ES Module (for bundlers) | ES Module (for browsers) |
| --- | --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| **Full (production)** | vue.min.js | - | - | vue.esm.browser.min.js |
| **Runtime-only (production)** | vue.runtime.min.js | - | - | - |

### Terms

- **Full**: builds that contain both the compiler and the runtime.

- **Compiler**: code that is responsible for compiling template strings into JavaScript render functions.

- **Runtime**: code that is responsible for creating Vue instances, rendering and patching virtual DOM, etc. Basically everything minus the compiler.

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from jsDelivr CDN at [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) is the Runtime + Compiler UMD build (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: starting in 2.6 Vue provides two ES Modules (ESM) builds:

  - ESM for bundlers: intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [Rollup](https://rollupjs.org/). ESM format is designed to be statically analyzable so the bundlers can take advantage of that to perform "tree-shaking" and eliminate unused code from your final bundle. The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`vue.runtime.esm.js`).

  - ESM for browsers (2.6+ only): intended for direct imports in modern browsers via `<script type="module">`.

### Runtime + Compiler vs. Runtime-only

If you need to compile templates on the client (e.g. passing a string to the `template` option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:

``` js
// this requires the compiler
new Vue({
  template: '<div>{{ hi }}</div>'
})

// this does not
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

When using `vue-loader` or `vueify`, templates inside `*.vue` files are pre-compiled into JavaScript at build time. You don't really need the compiler in the final bundle, and can therefore use the runtime-only build.

Since the runtime-only builds are roughly 30% lighter-weight than their full-build counterparts, you should use it whenever you can. If you still wish to use the full build instead, you need to configure an alias in your bundler:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
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
      'vue': require.resolve('vue/dist/vue.esm.js')
    })
  ]
})
```

#### Browserify

Add to your project's `package.json`:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Add to your project's `package.json`:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Development vs. Production Mode

Development/production modes are hard-coded for the UMD builds: the un-minified files are for development, and the minified files are for production.

CommonJS and ES Module builds are intended for bundlers, therefore we don't provide minified versions for them. You will be responsible for minifying the final bundle yourself.

CommonJS and ES Module builds also preserve raw checks for `process.env.NODE_ENV` to determine the mode they should run in. You should use appropriate bundler configurations to replace these environment variables in order to control which mode Vue will run in. Replacing `process.env.NODE_ENV` with string literals also allows minifiers like UglifyJS to completely drop the development-only code blocks, reducing final file size.

#### Webpack

In Webpack 4+, you can use the `mode` option:

``` js
module.exports = {
  mode: 'production'
}
```

But in Webpack 3 and earlier, you'll need to use [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

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

Use [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

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

Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Also see [Production Deployment Tips](deployment.html).

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The full build depends on this feature to compile templates, so is unusable in these environments.

On the other hand, the runtime-only build is fully CSP-compliant. When using the runtime-only build with [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) or [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), your templates will be precompiled into `render` functions which work perfectly in CSP environments.

## Dev Build

**Important**: the built files in GitHub's `/dist` folder are only checked-in during releases. To use Vue from the latest source code on GitHub, you will have to build it yourself!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Only UMD builds are available from Bower.

``` bash
# latest stable
$ bower install vue
```

## AMD Module Loaders

All UMD builds can be used directly as an AMD module.
