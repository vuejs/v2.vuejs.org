---
title: Server-Side Rendering
type: guide
order: 23
---

## Hello World

Server-side rendering (i.e. SSR) sounds complex, but a simple node script demoing the feature requires only 3 steps:

``` js
// Step 1: Create a Vue instance
var Vue = require('vue')
var vm = new Vue({
  render: function(h) {
    return h('p', 'hello world')
  }
})

// Step 2: Create a renderer
var renderer = require('vue-server-renderer').createRenderer()

// Step 3: Render the Vue instance to HTML
renderer.renderToString(vm, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">hello world</p>
})
```

Not so scary, right? In the rest of this guide, we'll give you a broad overview of how SSR works with the most common use cases. Once you understand the basics, we'll share some more detailed documentation and advanced examples to help you handle any edge cases.

## !!TODO: Finish this guide
