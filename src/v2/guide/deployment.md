---
title: Triển khai cho môi trường production
type: guide
order: 401
---

## Bật chế độ production

Trong quá trình phát triển, Vue cung cấp rất nhiều cảnh báo nhằm giúp bạn tránh những lỗi và nguy cơ tiềm ẩn thường gặp. Tuy nhiên, những dòng cảnh báo này lại trở nên vô ích trong môi trường production và làm phình to kích thước ứng dụng. Thêm vào đó, một vài trong số những kiểm tra cảnh báo này có phí tổn vận hành (runtime cost, bao gồm bộ nhớ và CPU) mà chúng ta có thể tránh được trong chế độ production.

### Không sử dụng build tool

Nếu bạn đang sử dụng bản đầy đủ, nghĩa là chèn trực tiếp Vue bằng thẻ script thay vì sử dụng build tool (công cụ build), hãy đảm bảo đó là `vue.min.js` – bản đã được minify (thu nhỏ) cho môi trường production. Bạn có thể tìm thấy cả hai phiên bản ở phần [Hướng dẫn cài đặt](installation.html#Direct-lt-script-gt-Include).

### Sử dụng build tool

Nếu bạn đang sử dụng một build tool như Webpack hoặc Browserify, chế độ production sẽ được xác định bởi biến môi trường `process.env.NODE_ENV` bên trong mã nguồn của Vue, với giá trị mặc định là `development` (đang phát triển). Cả hai build tool đều cung cấp các cách thức để ghi đè giá trị của biến này nhằm bật chế độ production của Vue, khi đó các plugin minify sẽ bỏ đi các cảnh báo trong quá trình build. Tất cả các template của `vue-cli` đều đã được cấu hình sẵn theo cách này, dù vậy vẫn sẽ có ích nếu bạn hiểu cách thức hoạt động, như mô tả dưới đây:

#### Webpack

Sử dụng [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) của Webpack để xác định môi trường production, những dòng cảnh báo sẽ được UglifyJS tự động bỏ đi trong quá trình minify. Dưới đây là một ví dụ:

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

- Chạy lệnh bundle (đóng gói) với giá trị biến môi trường `NODE_ENV` là `"production"`. Cách này sẽ thông báo để `vueify` bỏ qua hot-reload và các phần mã liên quan đến chế độ development.

- Áp dụng [envify](https://github.com/hughsk/envify) ở cấp global (toàn cục) cho bundle. Cách này sẽ giúp plugin minify lược đi toàn bộ những cảnh báo trong mã nguồn của Vue được gói trong các conditional block (khối điều kiện) dùng để kiểm tra biến môi trường. Ví dụ:

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- Hoặc, khi dùng [envify](https://github.com/hughsk/envify) với Gulp:

  ``` js
  // dùng module envify/custom để chỉ định biến môi trường
  var envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // cần thiết để xử lí các file trong node_modules
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

Dùng [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

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

## Biên dịch trước template

Khi sử dụng template trong DOM hoặc chuỗi template trong JavaScript, việc biên dịch template thành hàm render được thực hiện ngay trong quá trình chạy ứng dụng. Công đoạn biên dịch này thường là đủ nhanh cho đa số các trường hợp, nhưng tốt nhất vẫn nên tránh nếu ứng dụng của bạn cần đặt nặng về performance (hiệu suất).

Cách dễ nhất để biên dịch trước template là sử dụng [Single-File Component](single-file-components.html). Những cài đặt build liên quan sẽ tự động thực hiện việc biên dịch trước, nhờ đó mã sau khi build sẽ bao gồm những hàm render đã được biên dịch thay vì chuỗi template thô (raw template string).

Nếu bạn dùng Webpack và muốn tách biệt giữa JavaScript và các file template, có thể sử dụng [vue-template-loader](https://github.com/ktsn/vue-template-loader). Công cụ này cũng sẽ chuyển hoá các file template thành hàm render của JavaScript trong quá trình build.

## Trích xuất CSS của component

Khi sử dụng Single-File Component, CSS bên trong component được chèn động vào các thẻ `<style>` bằng JavaScript. Cách này có chi phí vận hành không đáng kể, và nếu bạn sử dụng server-side rendering (SSR – render từ phía server) thì sẽ gây ra hiện tượng "flash of unstyled content" (FOUC – hiển thị nội dung không có định dạng trong giây lát). Trích xuất CSS ở tất cả các components và gom vào một file sẽ tránh được những vấn đề nêu trên, ngoài ra việc caching và thu nhỏ CSS cũng sẽ tốt hơn.

Tham khảo tài liệu của từng build tool dưới đây để hiểu cách thức hoạt động:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (template webpack của `vue-cli` đã cấu hình sẵn cho cách này)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## Theo dõi lỗi vận hành

Một lỗi vận hành (runtime error) xảy ra trong quá trình render component sẽ được truyền đến hàm global config (cấu hình toàn cục) `Vue.config.errorHandler` nếu hàm này đã được thiết lập từ trước. Chúng ta có thể kết hợp hook này với một dịch vụ theo dõi lỗi (error tracking service) như Sentry – dịch vụ này còn cung cấp sẵn một [giải pháp tích hợp chính thức dành cho Vue](https://sentry.io/for/vue/).
