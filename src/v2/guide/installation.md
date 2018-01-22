---
title: Cài đặt
type: guide
order: 1
vue_version: 2.5.13
gz_size: "30.67"
---

### Khả năng tương thích

Do sử dụng một số tính năng ECMAScript 5 không được hỗ trợ trên IE8, Vue **không** hỗ trợ IE8 và các phiên bản thấp hơn. Tuy nhiên Vue hỗ trợ [mọi trình duyệt tương thích với ECMAScript 5](http://caniuse.com/#feat=es5).

### Ghi chú phát hành

Phiên bản ổn định mới nhất: {{vue_version}}

Mọi ghi chú chi tiết về các bản phát hành của mỗi phiên bản đều có trên [GitHub](https://github.com/vuejs/vue/releases).

## Vue Devtools

Chúng tôi khuyên bạn nên cài add-on [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) vào trình duyệt. Add-on này giúp bạn kiểm tra và debug (kiểm lỗi) ứng dụng Vue với giao diện thân thiện.

## Dùng thẻ `<script>` trực tiếp

Chỉ cần tải file thư viện về rồi sử dụng nó trong thẻ script. `Vue` sẽ được đăng ký thành một biến toàn cục.

<p class="tip">Nếu đang phát triển ứng dụng, đừng dùng bản rút gọn vì bạn sẽ không thấy cảnh báo về những lỗi thường gặp.</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Bản development</a><span class="light info">Với đầy đủ cảnh báo và chế độ debug</span>

<a class="button" href="/js/vue.min.js" download>Bản production</a><span class="light info">Không có các cảnh báo, {{gz_size}}KB min+gzip</span>
</div>

### CDN

Chúng tôi khuyến khích trỏ đến một phiên bản cụ thể mà bạn có thể tự thay đổi nếu cần:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js"></script>
```

Bạn có thể xem mã nguồn của package trên npm tại [https://cdn.jsdelivr.net/npm/vue/](https://cdn.jsdelivr.net/npm/vue/).

Ngoài ra, bạn cũng có thể sử dụng [unpkg](https://unpkg.com/vue) hoặc [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (cdnjs cần nhiều thời gian để đồng bộ nên có thể nó chưa phải phiên bản mới nhất).

Nhớ đọc thêm về [các bản build khác nhau của Vue](#giai-thich-ve-cac-ban-build) và sử dụng bản Vue production khi publish bản production cho trang web hoặc app của bạn, thay `vue.js` bằng `vue.min.js`. Đây là bản nhỏ hơn, được tối ưu về tốc độ. 

## NPM

Chúng tôi khuyên bạn nên sử dụng NPM khi muốn xây dựng một ứng dụng lớn với Vue. NPM hoạt động rất tốt với các module bundler (các công cụ đóng gói module) như [Webpack](https://webpack.js.org/) hoặc [Browserify](http://browserify.org/). Vue cũng cung cấp công cụ hỗ trợ để viết các [single file component](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

## CLI

Vue.js cung cấp một [CLI](https://github.com/vuejs/vue-cli) giúp nhanh chóng khởi tạo nền tảng (scaffolding) cho các ứng dụng một trang. Vue-CLI chuẩn bị sẵn các cài đặt phong phú cho một quy trình front-end hiện đại. Chỉ mất vài phút, bạn đã có thể bắt đầu xây dựng ứng dụng với các tính năng như hot-reload, tinh chỉnh code khi save (lint-on-save), và các bản build sẵn sàng để deploy lên production:

``` bash
# cài đặt vue-cli
$ npm install --global vue-cli
# tạo một dự án mới với template "webpack"
$ vue init webpack my-project
# cài đặt các thư viện phụ thuộc và bắt tay vào việc!
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">CLI yêu cầu nhiều kiến thức về Node.js và các công cụ hỗ trợ. Nếu bạn mới làm quen với Vue hoặc các công cụ build, chúng tôi đề nghị bạn nên xem qua <a href="./">hướng dẫn</a> mà không sử dụng các công cụ build sau đó mới quay lại sử dụng CLI.</p>

## Giải thích về các bản build

Trong thư mục [`dist/` của gói trên NPM](https://cdn.jsdelivr.net/npm/vue/dist/) bạn sẽ thấy nhiều bản build khác nhau của Vue.js. Dưới đây là các điểm khác biệt cơ bản giữa các phiên bản này:

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | - | - |
| **Runtime-only (production)** | vue.runtime.min.js | - | - |

### Ý nghĩa

- **Full**: các bản build có cả trình biên dịch và runtime.

- **Trình biên dịch**: code có trách nhiệm biên dịch các chuỗi template ra thành các hàm render JavaScript.

- **Runtime**: code có trách nhiệm khởi tạo đối tượng Vue, render và cập nhật virtual DOM v.v.. Cơ bản là tất cả mọi thứ ngoại trừ trình biên dịch.

- **[UMD](https://github.com/umdjs/umd)**: các bản build UMD có thể được sử dụng trực tiếp trong trình duyệt thông qua thẻ `<script>`. Mặc định thì file trên CDN jsDelivr - [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) là bản runtime + Compiler UMD (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: các bản build CommonJS được dành cho các bundler cũ như [browserify](http://browserify.org/) hoặc [webpack 1](https://webpack.github.io). File mặc định dành cho các bundler này (`pkg.main`) là bản chỉ có runtime CommonJS (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: các bản build ES Module được dành cho các bundler hiện đại như [webpack 2](https://webpack.js.org) hoặc [rollup](https://rollupjs.org/). File mặc định cho các bundler này (`pkg.module`) là bản chỉ có runtime ES Module (`vue.runtime.esm.js`).

### Runtime + trình biên dịch so với runtime-only

Nếu bạn cần biên dịch các template ở phía client (ví dụ như truyền chuỗi vào option `template`, hoặc gắn Vue vào element và sử dụng DOM của nó làm template), bạn sẽ cần trình biên dịch có trong bản build đầy đủ (full):

``` js
// cần compiler
new Vue({
  template: '<div>{{ hi }}</div>'
})

// không cần compiler
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

Khi sử dụng `vue-loader` hoặc `vueify`, template trong các file `*.vue` sẽ được biên dịch thành JavaScript ngay lúc build. Bạn không cần đóng gói compiler kèm theo ứng dụng thành phẩm, do đó bạn có thể sử dụng bản build chỉ có runtime.

Vì bản build chỉ có runtime nhẹ hơn 30% so với bản đầy đủ, bạn nên sử dụng nó bất cứ khi nào có thể. Nếu bạn vẫn muốn sử dụng bản đầy đủ, bạn cần phải cấu hình một alias (tên khác) trong bundler:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // sử dụng 'vue/dist/vue.common.js' nếu là webpack 1
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
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

Thêm vào file `package.json`:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### Chế độ development và production

Chế độ development/production đã được định sẵn trong các bản build UMD: bản chưa minify dành cho development, bản đã minify dành cho production.

Các bản build CommonJS và ES Module được dùng cho các bundler, vì vậy chúng không có bản đã minify. Bạn phải tự minify nếu cần.

Các bản build CommonJS và ES Module này cũng dựa vào giá trị `process.env.NODE_ENV` để xác định chế độ chạy. Bạn nên cấu hình bundler phù hợp để thay thế biến môi trường này nhằm điều khiển chế độ chạy của Vue. Thay `process.env.NODE_ENV` bằng một chuỗi ký tự (string literals) như `'production'` cũng sẽ cho phép các công cụ minify như UglifyJS loại bỏ các đoạn code vốn chỉ sử dụng trong chế độ development, giúp giảm dung lượng file.

#### Webpack

Sử dụng [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) của Webpack:

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

Sử dụng plugin [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

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

Sử dụng [envify](https://github.com/hughsk/envify).

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Đọc thêm [các lời khuyên khi deploy lên production](deployment.html).

### Môi trường CSP

Một số môi trường như Google Chrome Apps áp dụng Content Security Policy (CSP, chính sách bảo mật nội dung), không cho sử dụng lệnh `new Function()`. Bản build đầy đủ sử dụng lệnh này để biên dịch template, nên sẽ không hoạt động được trong các môi trường kể trên.

Mặt khác, bản build chỉ có runtime có thể tương thích với CSP. Khi sử dụng bản build này với [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) hoặc [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), template của bạn sẽ được biên dịch thành hàm `render` và sẽ hoạt động hoàn hảo trong các môi trường CSP.

## Bản build dev

**Quan trọng**: các file đã được build trong thư mục `/dist` trên GitHub chỉ được tạo ra khi phát hành một phiên bản mới. Bạn sẽ phải tự build lấy nếu muốn dùng phiên bản từ mã nguồn gần nhất. 

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Chỉ có bản build UMD là khả dụng trong Bower.

``` bash
# latest stable
$ bower install vue
```

## AMD Module Loader

Tất cả các bản build UMD có thể được sử dụng trực tiếp như một module AMD.
