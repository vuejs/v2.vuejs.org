---
title: 服务端渲染
type: guide
order: 23
---

## 需要服务端渲染（SSR）吗？

在开始服务端渲染前，我们先看看它能给我们带来什么，以及什么时候需要用它。

### SEO（搜索引擎优化）

谷歌和Bing可以很好地索引同步的JavaScript应用。_同步_在这里是个关键词。如果应用启动时有一个加载动画，然后内容通过ajax获取，那爬虫不会等待他们加载完成。

这意味着在异步获取内容的页面上很需要进行搜索引擎优化的时候，服务端渲染就很重要。

### 客户端的网络比较慢

用户可能在网络比较慢的情况下从远处访问网站 - 或者通过比较差的带宽。 这些情况下，尽量减少页面请求数量，来保证用户尽快看到基本的内容。

可以用 [Webpack的代码拆分](https://webpack.github.io/docs/code-splitting.html) 避免强制用户下载整个单页面应用，但是，这样也远没有下载个单独的预先渲染过的HTML文件性能高。

### 客户端运行在老的(或者直接没有)JavaScript引擎上

对于世界上的一些地区人，可能只能用1998年产的电脑访问互联网的方式使用计算机。而Vue只能运行在IE9以上的浏览器，你可以也想为那些老式浏览器提供基础内容 - 或者是在命令行中使用 [Lynx](http://lynx.browser.org/)的时髦的黑客。

### 服务端渲染 对比 预渲染(Prerendering)

如果你只是用服务端渲染来改善一个少数的营销页面（如 首页，关于，联系 等等）的SEO，那你可以用__预渲染__替换。预渲染不像服务器渲染那样即时编译HTML,预渲染只是在构建时为了特定的路由生成特定的几个静态页面。其优势是预渲染的设置更加简单，可以保持前端是一个完整的静态站。

你用webpack可以很简单地通过[prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)来添加预渲染，它被广泛地用在Vue应用上 - 事实上，创建者也是Vue核心团队成员之一。

## Hello World

准备在行动中体验服务端渲染吧。服务端渲染(即SSR)听起来很复杂, 不过一个简单的Node脚本只需要3步就可以实现这个功能:

``` js
// 步骤 1:创建一个Vue实例
var Vue = require('vue')
var app = new Vue({
  render: function (h) {
    return h('p', 'hello world')
  }
})

// 步骤 2: 创建一个渲染器
var renderer = require('vue-server-renderer').createRenderer()

// 步骤 3: 将 Vue实例 渲染成 HTML

renderer.renderToString(app, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">hello world</p>
})
```

这并不困难。当然这个示例比大部分应用都简单。我们不必担心：

- 一个Web服务器
- 流式响应
- 组件缓存
- 构建过程
- 路由
- Vuex状态管理

这个指南的其余部分，我们将探讨这些功能怎样运作。一旦你理解了基础，我们会提供更多细节和进一步的示例来帮助你解决意外情况。

## 通过Express Web服务器实现简单的服务端渲染

如果没有一个Web服务器，很难说是服务端渲染，所以我们来补充它。我们将构建一个非常简单的服务端渲染应用，只用ES5，也不带其他构建步骤或Vue插件。

启动一个应用告诉用户他们在一个页面上花了多少时间。


``` js
new Vue({
  template: '<div>你已经在这花了 {{ counter }} 秒。</div>',
  data: {
    counter: 0
  },
  created: function () {
    var vm = this
    setInterval(function () {
      vm.counter += 1
    }, 1000)
  }
})
```

为了适应服务端渲染，我们需要进行一些修改，让它可以在浏览器和Node中渲染：

- 在浏览器中，将我们的应用实例添加到全局上下文（ `window`）上,我们可以安装它。
- 在Node中，导出一个工厂函数让我们可以为每个请求创建应用实例。

实现这个需要一点模板：

``` js
// assets/app.js
(function () { 'use strict'
  var createApp = function () {
    // ---------------------
    // 开始常用的应用代码
    // ---------------------

    // 主要的Vue实例必须返回，并且有一个根节点在id "app"上，这样客户端可以加载它。

    return new Vue({
      template: '<div id="app">你已经在这花了 {{ counter }} 秒。</div>',
      data: {
        counter: 0
      },
      created: function () {
        var vm = this
        setInterval(function () {
          vm.counter += 1
        }, 1000)
      }
    })

    // -------------------
    // 结束常用的应用代码
    // -------------------
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createApp
  } else {
    this.app = createApp()
  }
}).call(this)
```

现在有了应用代码，接着加一个 html文件。

``` html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>My Vue App</title>
  <script src="/assets/vue.js"></script>
</head>
<body>
  <div id="app"></div>
  <script src="/assets/app.js"></script>
  <script>app.$mount('#app')</script>
</body>
</html>
```

主要引用`assets`文件夹中我们先前创建的`app.js`，以及`vue.js`文件，我们就有了一个可以运行的单页面应用

然后为了实现服务端渲染，在服务端需要加一个步骤。

``` js
// server.js
'use strict'

var fs = require('fs')
var path = require('path')

// 定义全局的Vue为了服务端的app.js
global.Vue = require('vue')

// 获取HTML布局
var layout = fs.readFileSync('./index.html', 'utf8')

// 创建一个渲染器
var renderer = require('vue-server-renderer').createRenderer()

// 创建一个Express服务器
var express = require('express')
var server = express()

// 部署静态文件夹为 "assets"文件夹
server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

// 处理所有的Get请求
server.get('*', function (request, response) {
  // 渲染我们的Vue应用为一个字符串
  renderer.renderToString(
    // 创建一个应用实例
    require('./assets/app')(),
    // 处理渲染结果
    function (error, html) {
      // 如果渲染时发生了错误
      if (error) {
        // 打印错误到控制台
        console.error(error)
        // 告诉客户端错误
        return response
          .status(500)
          .send('Server Error')
      }
      // 发送布局和HTML文件
      response.send(layout.replace('<div id="app"></div>', html))
    }
  )
})

// 监听5000端口
server.listen(5000, function (error) {
  if (error) throw error
  console.log('Server is running at localhost:5000')
})
```

这样就完成了。[整个示例](https://github.com/chrisvfritz/vue-ssr-demo-simple)，克隆下来深度实验。一旦它在本地运行时，你可以通过在页面右击选择`页面资源`（或类似操作）确认服务选渲染真的运行了。可以在body中看到：

``` html
<div id="app" server-rendered="true">You have been here for 0 seconds&period;</div>
```

代替:

``` html
<div id="app"></div>
```

## 流式响应

Vue还支持__流式__渲染，优先选择适用于支持流的Web服务器。允许HTML一边生成一般写入相应流，而不是在最后一次全部写入。其结果是请求服务速度更快，没有缺点！

为了使上一节应用代码适用流式渲染，可以简单的替换 `server.get('*',...)`为下面的代码：

``` js
// 拆分布局成两段HTML
var layoutSections = layout.split('<div id="app"></div>')
var preAppHTML = layoutSections[0]
var postAppHTML = layoutSections[1]

// 处理所有的Get请求
server.get('*', function (request, response) {
  // 渲染我们的Vue实例作为流
  var stream = renderer.renderToStream(require('./assets/app')())

  // 将预先的HTML写入响应
  response.write(preAppHTML)

  // 每当新的块被渲染
  stream.on('data', function (chunk) {
    // 将块写入响应
    response.write(chunk)
  })

  // 当所有的块被渲染完成
  stream.on('end', function () {
    // 将post-app HTML写入响应
    response.end(postAppHTML)
  })

  // 当渲染时发生错误
  stream.on('error', function (error) {
    // 打印错误到控制台
    console.error(error)
    // 告诉客服端发生了错误
    return response
      .status(500)
      .send('Server Error')
  })
})
```

这不比之前的版本复杂，甚至这对你来说都不是个新概念。我们做了：
1. 建立流
2. 在应用响应前写入HTML
3. 在可获得时将应用HTML写入响应
4. 在响应最后写入HTML
5. 处理任何错误

## 组件缓存

Vue的服务端渲染默认非常快，但是你可以通过缓存渲染好的组件进一步提高性能。这被认为是一种先进的功能，但是，如果缓存了错误的组件（或者正确的组件带有错误的内容）将导致应用渲染出错。特别注意：

<p class="tip">不应该缓存组件包含子组件依赖全局状态（例如来自vuex的状态）。如果这么做，子组件（事实上是整个子树）也会被缓存。所以要特别注意带有slots片段或者子组件的情况。</p>

### 设置

在警告情况之外的，我们可以用下面的方法缓存组件。

首先，你需要提供给渲染器一个 [缓存对象](https://www.npmjs.com/package/vue-server-renderer#cache)。这有个简单的示例使用 [lru-cache](https://github.com/isaacs/node-lru-cache)

``` js
var createRenderer = require('vue-server-renderer').createRenderer
var lru = require('lru-cache')

var renderer = createRenderer({
  cache: lru(1000)
})
```

这将缓存高达1000个独立的渲染。对于更进一步缓存到内容中的配置，看[lru-cache设置](https://github.com/isaacs/node-lru-cache#options)

然后对于你想缓存的组件，你可以为他们提供：

- 一个唯一的`名字`
- 一个 `serverCacheKey`函数，返回一个唯一的组件作用域

例如:

``` js
Vue.component({
  name: 'list-item',
  template: '<li>{{ item.name }}</li>',
  props: ['item'],
  serverCacheKey: function (props) {
    return props.item.type + '::' + props.item.id
  }
})
```

### 缓存的理想组件

任何纯组件可以被安全缓存 -  这是保证给任何组件传递一样的数据产生相同的HTML。这些场景的例子包括：

- 静态的组件 (例如 总是尝试一样的HTML,所以 `serverCacheKey` 函数可以被返回 `true`)
- 列表组件（当有大量列表，缓存他们可以改善性能）
- 通用UI组件 (例如 buttons, alerts, 等等 - 至少他们通过props获取数据而不是 slots或者子组件)

## 构建过程，路由，和Vuex状态管理

现在，应该理解服务端渲染背后的基本概念了。但是，构建过程、路由、Vuex每一个都有自己的注意事项。

要真正掌握复杂应用下的服务端渲染，我们推荐深度熟悉以下资源：

- [vue-server-renderer 文档](https://www.npmjs.com/package/vue-server-renderer#api):更多细节在这里，和更多先进的主题一起的文档。 例如 [preventing cross-request contamination](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) 和 [添加独立的服务构建](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): 明确整合了  所有主要的Vue库和概念在单个应用中

***

> 原文: http://vuejs.org/guide/ssr.html

***
