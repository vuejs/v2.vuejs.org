---
title: 服务端渲染
type: guide
order: 23
---

## Hello World

服务端渲染(即SSR)听起来很复杂, 不过一个简单的Node脚本只需要3步就可以实现这个功能:

``` js
// 步骤 1:创建一个Vue实例
var Vue = require('vue')
var vm = new Vue({
  render: function(h) {
    return h('p', 'hello world')
  }
})

// 步骤 2: 创建一个渲染器
var renderer = require('vue-server-renderer').createRenderer()

// 步骤 3: 将 Vue实例 渲染成 HTML
renderer.renderToString(vm, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">hello world</p>
})
```

没那么吓人，是不？在这个教程的其余部分，我们将通过最常见的示例来向你阐述服务端渲染的工作方式。一旦你理解了基础，我们将分享更多细节文档和进阶示例来帮助你处理意外情况。

## 待更...
