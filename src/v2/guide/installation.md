---
title: Суулгах заавар
type: guide
order: 1
vue_version: 2.5.16
gz_size: "30.90"
---

### Нийцтэй байдалын тэмдэглэл

Vue нь IE8 аас доош хувилбартай хөтөчүүдийг **дэмжихгүй**, учир нь IE8 хөтөч нь ECMAScript 5-ийн боломжуудыг ашиглах боломжгүй. Гэсэн хэдий ч [ECMAScript 5-тай зохицдог](https://caniuse.com/#feat=es5) бүх хөтөч дээр ажиллах боломжтой.

### Хувилбарын мэдээлэл

Хамгийн сүүлийн тогтвортой хувилбар: {{vue_version}}

Хувилбар бүрийн дэлгэрэнгүй мэдээлэлтэй дараах холбоосоор танилцана уу [GitHub](https://github.com/vuejs/vue/releases).

## Vue Devtools

Vue ашиглах үед, өөрийн хөтөч дээрээ [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) суулгахыг таньд санал болгож байна, энэхүү багаж нь таны хөгжүүлж буй Vue аппликэйнийн хялбар интэрфэйс дээр inspect болон debug хийх боломжийг олгоно.

## Шууд `<script>` tag-аар нэмэх

Хамгийн энгийн татаж суулгах арга нь script tag-аар. `Vue` нь global хувьсагчаар бүртгэгдэх болно.

<p class="tip">Хөгжүүлэлтийн явцад minified хувилбаруудыг бүү ашигла. Түгээмэл алдаануудын анхааруулгуудыг харах боломжгүй болох болно.</p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>Хөгжүүлэлтийн хувилбар</a><span class="light info">Бүх анхааруулгууд болон debug хийх горим</span>

  <a class="button" href="/js/vue.min.js" download>Production хувилбар</a><span class="light info">Анхааруулгууд хасагдсан, {{gz_size}}KB min+gzip</span>
</div>

### CDN

Та prototype болон сургалтын зорилгоор хамгийн сүүлийн хувилбарыг ашиглаж болно:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Production хөгжүүлэлтийн хувьд, тусгай хувилбарын дугаарыг ашиглахыг бид зөвлөж байна. Учир нь шинэ хувилбарууд дээр ямар нэг гэнэтийн алдаа гарахаас зайлхийж байгаа юм:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.js"></script>
```

Хэрвээ native ES Module-ууд ашиглаж байгаа бол, ES Modules-д тохиромжтой хувилбар бас байдаг:

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js'
</script>
```

Та NPM багцын эх кодыг дараах холбоосоор үзэж болно [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue-ийг мөн дараах байдлаар ашиглах боломжтой [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) болон [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (cdnjs дээр сүүлийн хувилбарууд sync хийгдээгүй байж болно).

[Vue-ийн бусад builds](#Explanation-of-Different-Builds) -ийн тухай уншиж **production
хувилбар** өөрийн published сайт дээр `vue.js` болон `vue.min.js` зэргээр сольж ашиглаарай . Энэ нь илүү жижиг хэмжээтэйгээс гадна хурдан ажиллах болно.

## NPM

Том хэмжээний програмуудыг Vue-тэй хөгжүүлэхэд NPM ашиглан суулгахыг зөвлөж байна. Энэ нь [Webpack](https://webpack.js.org/) болон [Browserify](http://browserify.org/) гэх мэт module bundler-уудтай сайн зохицож ажилладаг. Vue нь мөн дагалдах багажуудыг зохиож ашиглах боломж олгодог [Single File Components](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

## CLI  

Vue нь [албан ёсны CLI](https://github.com/vuejs/vue-cli) байдаг ба энэ Single Page Application хөгжүүлэхэд маш том суурь чухал үүрэгтэй багаж болдог. Энэ нь таны frontend хөгжүүлэлтийн орчины суурь бүтцийг хялбар гаргах боломж олгодог. Та хэдхэн минут зарцуулаад hot-reload, lint-on-save, болон production болгоход бэлэн вэб програмын суурь бэлдэх боломжтой. [Vue CLI ийн заавар бичиг баримттай](https://cli.vuejs.org) дэлгэрэнгүй танилцах.

<p class="tip">Та CLI ашиглахын тулд Node.js болон түүнтэй холбоотой багаж хэрэгслүүдийн талаар мэдлэгтэй байх хэрэгтэй. Хэрэв та шинээр Vue болон front-end build tools зэргийн шинээр ашиглаж эхлэх гэж байгаа бол CLI ашиглахын өмнө эхлээд <a href="./">энэхүү зааварыг</a> ашиглахыг санал болгож байна.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="noopener" title="Vue CLI">Vue Mastery дээр тайлбар бичлэгийг үзээрэй</a></div>

## Өөр хувилбаруудын тайлбар

[NPM багцын `dist/` хавтас дотор](https://cdn.jsdelivr.net/npm/vue/dist/) Vue.js-ийн олон төрлийн хувилбар байгааг та харж болно. Тэд нарын хоорондын ялгааны тухай энд оруулав:

| | UMD | CommonJS | ES Module (for bundlers) | ES Module (for browsers) |
| --- | --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| **Full (production)** | vue.min.js | - | - | vue.esm.browser.min.js |
| **Runtime-only (production)** | vue.runtime.min.js | - | - | - |

### Нэр томьёо

- **Full**: compiler болон runtime аль алиныг нь агуулсан хувилбар.

- **Compiler**: Загвар template string-үүдийг хөрвүүлэх үүрэг бүхий JavaScript render функцуудыг агуулсан код.

- **Runtime**: Vue instance ууд үүсгэх үүрэг бүхий код, virtual DOM-ийг rendering болон patching хийх, гэх мэт. Үндсэндээ бүх compiler хэсгийг хассан.

- **[UMD](https://github.com/umdjs/umd)**: UMD нь browser дээр шууд `<script>` таг дээр дуудан ашиглах боломжтой. jsDelivr CDN буюу [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) дээрх үндсэн файл нь Runtime + Compiler UMD build (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS нь [browserify](http://browserify.org/) болон [webpack 1](https://webpack.github.io) гэх мэт хуучин bundlers дээр ашиглах зориулалттай юм. Эдгээр bundler-ийн үндсэн файл нь (`pkg.main`) зөвхөн Runtime CommonJS build (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: Vue 2.6 хувилбар эхэлсэнээс хоёр ES Modules (ESM) гаргасан:

  - ESM bundlers нь: орчин үеийн [webpack 2](https://webpack.js.org) болон [Rollup](https://rollupjs.org/) гэх мэт дээр ашиглах зориулалттай. ESM формат нь статикаар шинжлэх боломжтой байхаар зохион бүтээгдсэн бөгөөд ингэснээр холбогч нь "tree-shaking" ажиллагааг гүйцэтгэхийн тулд ашигладаггүй буюу таны сүүлчийн багцаас ашиглагдаагүй кодыг устгах болно. Эдгээр bundlers-д зориулсан үндсэн файл нь (pkg.module) энэ нь зөвхөн ES модули (vue.runtime.esm.js)

  - ESM нь вэб хөтөчүүдэд (зөвхөн 2.6+ ): Орчин үеийн вэб хөтчүүд дээр `<script type="module">` шууд дуудаж ашиглаж болно.

### Runtime + Compiler vs. Runtime-only

Хэрэв та клиент дээр template compile хийх шаардлагатай (жишээлбэл, `загвар` руу тэмдэгт дамжуулах эсвэл HTML загвар ашиглан DOM-ийн дотор элемент холбоход), та compiler болон full build хэрэгтэй болно:
``` js
// энэ нь compiler буюу хөрвүүлэгч шаарддаг
new Vue({
  template: '<div>{{ сайн уу }}</div>'
})

// энэ бол хэрэггүй
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
  