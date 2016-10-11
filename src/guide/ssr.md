---
title: Server-Side Rendering
type: guide
order: 24
---

## Do You Need SSR?

Before diving into SSR, let's explore what it actually does for you and when you might need it.

### SEO

Google and Bing can index synchronous JavaScript applications just fine. _Synchronous_ being the key word there. If your app starts with a loading spinner, then fetches content via Ajax, the crawler will not wait for you to finish.

This means if you have content fetched asynchronously on pages where SEO is important, SSR might be necessary.

### Clients with a Slow Internet

Users might come to your site from a remote area with slow Internet - or just with a bad cell connection. In these cases, you'll want to minimize the number and size of requests necessary for users to see basic content.

You can use [Webpack's code splitting](https://webpack.github.io/docs/code-splitting.html) to avoid forcing users to download your entire application to view a single page, but it still won't be as performant as downloading a single, pre-rendered HTML file.

### Clients with an Old (or Simply No) JavaScript Engine

For some demographics or areas of the world, using a computer from 1998 to access the Internet might be the only option. While Vue only works with IE9+, you may still want to deliver basic content to those on older browsers - or to hipster hackers using [Lynx](http://lynx.browser.org/) in the terminal.

### SSR vs Prerendering

If you're only investigating SSR to improve the SEO of a handful of marketing pages (e.g. `/`, `/about`, `/contact`, etc), then you probably want __prerendering__ instead. Rather than using a web server to compile HTML on-the-fly, prerendering simply generates static HTML files for specific routes at build time. The advantage is setting up prerendering is much simpler and allows you to keep your frontend as a fully static site.

If you're using Webpack, you can easily add prerendering with the [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin). It's been extensively tested with Vue apps - and in fact, the creator is a member of the Vue core team.

## Hello World

If you've gotten this far, you're ready to see SSR in action. It sounds complex, but a simple node script demoing the feature requires only 3 steps:

``` js
// Step 1: Create a Vue instance
var Vue = require('vue')
var app = new Vue({
  render: function (h) {
    return h('p', 'hello world')
  }
})

// Step 2: Create a renderer
var renderer = require('vue-server-renderer').createRenderer()

// Step 3: Render the Vue instance to HTML
renderer.renderToString(app, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">hello world</p>
})
```

Not so scary, right? Of course, this example is much simpler than most applications. We don't yet have to worry about:

- A Web Server
- Response Streaming
- Component Caching
- A Build Process
- Routing
- Vuex State Hydration

In the rest of this guide, we'll walk through how to work with some of these features. Once you understand the basics, we'll then direct you to more detailed documentation and advanced examples to help you handle edge cases.

## Simple SSR with the Express Web Server

It's kind of a stretch to call it "server-side rendering" when we don't actually have a web server, so let's fix that. We'll build a very simple SSR app, using only ES5 and without any build step or Vue plugins.

We'll start off with an app that just tells the user how many seconds they've been on the page:

``` js
new Vue({
  template: '<div>You have been here for {{ counter }} seconds.</div>',
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

To adapt this for SSR, there are a few modifications we'll have to make, so that it will work both in the browser and within node:

- When in the browser, add an instance of our app to the global context (i.e. `window`), so that we can mount it.
- When in node, export a factory function so that we can create a fresh instance of the app for every request.

Accomplishing this requires a little boilerplate:

``` js
// assets/app.js
(function () { 'use strict'
  var createApp = function () {
    // ---------------------
    // BEGIN NORMAL APP CODE
    // ---------------------

    // Main Vue instance must be returned and have a root
    // node with the id "app", so that the client-side
    // version can take over once it loads.
    return new Vue({
      template: '<div id="app">You have been here for {{ counter }} seconds.</div>',
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
    // END NORMAL APP CODE
    // -------------------
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createApp
  } else {
    this.app = createApp()
  }
}).call(this)
```

Now that we have our application code, let's put together an `index.html` file:

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

As long as the referenced `assets` directory contains the `app.js` file we created earlier, as well as a `vue.js` file with Vue, we should now have a working single-page application!

Then to get it working with server-side rendering, there's just one more step - the web server:

``` js
// server.js
'use strict'

var fs = require('fs')
var path = require('path')

// Define global Vue for server-side app.js
global.Vue = require('vue')

// Get the HTML layout
var layout = fs.readFileSync('./index.html', 'utf8')

// Create a renderer
var renderer = require('vue-server-renderer').createRenderer()

// Create an express server
var express = require('express')
var server = express()

// Serve files from the assets directory
server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

// Handle all GET requests
server.get('*', function (request, response) {
  // Render our Vue app to a string
  renderer.renderToString(
    // Create an app instance
    require('./assets/app')(),
    // Handle the rendered result
    function (error, html) {
      // If an error occurred while rendering...
      if (error) {
        // Log the error in the console
        console.error(error)
        // Tell the client something went wrong
        return response
          .status(500)
          .send('Server Error')
      }
      // Send the layout with the rendered app's HTML
      response.send(layout.replace('<div id="app"></div>', html))
    }
  )
})

// Listen on port 5000
server.listen(5000, function (error) {
  if (error) throw error
  console.log('Server is running at localhost:5000')
})
```

And that's it! Here's [the full application](https://github.com/chrisvfritz/vue-ssr-demo-simple), in case you'd like to clone it and experiment further. Once you have it running locally, you can confirm that server-side rendering really is working by right-clicking on the page and selecting `View Page Source` (or similar). You should see this in the body:

``` html
<div id="app" server-rendered="true">You have been here for 0 seconds&period;</div>
```

instead of:

``` html
<div id="app"></div>
```

## Response Streaming

Vue also supports rendering to a __stream__, which is preferred for web servers that support streaming. This allows HTML to be written to the response _as it's generated_, rather than all at once at the end. The result is requests are served faster, with no downsides!

To adapt our app from the previous section for streaming, we can simply replace the `server.get('*', ...)` block with the following:

``` js
// Split the layout into two sections of HTML
var layoutSections = layout.split('<div id="app"></div>')
var preAppHTML = layoutSections[0]
var postAppHTML = layoutSections[1]

// Handle all GET requests
server.get('*', function (request, response) {
  // Render our Vue app to a stream
  var stream = renderer.renderToStream(require('./assets/app')())

  // Write the pre-app HTML to the response
  response.write(preAppHTML)

  // Whenever new chunks are rendered...
  stream.on('data', function (chunk) {
    // Write the chunk to the response
    response.write(chunk)
  })

  // When all chunks are rendered...
  stream.on('end', function () {
    // Write the post-app HTML to the response
    response.end(postAppHTML)
  })

  // If an error occurs while rendering...
  stream.on('error', function (error) {
    // Log the error in the console
    console.error(error)
    // Tell the client something went wrong
    return response
      .status(500)
      .send('Server Error')
  })
})
```

As you can see, it's not much more complicated than the previous version, even if streams may be conceptually new to you. We just:

1. Set up the stream
2. Write the HTML that comes before the app to the response
3. Write the app HTML to the response as it becomes available
4. Write the HTML that comes after the app to the response and end it
5. Handle any errors

## Component Caching

Vue's SSR is very fast by default, but you can further improve performance by caching rendered components. This should be considered an advanced feature however, as caching the wrong components (or the right components with the wrong key) could lead to misrendering your app. Specifically:

<p class="tip">You should not cache a component containing child components that rely on global state (e.g. from a vuex store). If you do, those child components (and in fact, the entire sub-tree) will be cached as well. Be especially wary with components that accept slots/children.</p>

### Setup

With that warning out of the way, here's how you cache components.

First, you'll need to provide your renderer with a [cache object](https://www.npmjs.com/package/vue-server-renderer#cache). Here's a simple example using [lru-cache](https://github.com/isaacs/node-lru-cache):

``` js
var createRenderer = require('vue-server-renderer').createRenderer
var lru = require('lru-cache')

var renderer = createRenderer({
  cache: lru(1000)
})
```

That will cache up to 1000 unique renders. For other configurations that more closely align to memory usage, see [the lru-cache options](https://github.com/isaacs/node-lru-cache#options).

Then for components you want to cache, you must provide them with:

- a unique `name`
- a `serverCacheKey` function, returning a unique key scoped to the component

For example:

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

### Ideal Components for Caching

Any "pure" component can be safely cached - that is, any component that is guaranteed to generate the same HTML given the same props. Common examples of these include:

- Static components (i.e. they always generate the same HTML, so the `serverCacheKey` function can just return `true`)
- List item components (when part of large lists, caching these can significantly improve performance)
- Generic UI components (e.g. buttons, alerts, etc - at least those that accept content through props rather than slots/children)

## Build Process, Routing, and Vuex State Hydration

By now, you should understand the fundamental concepts behind server-side rendering. However, as you introduce a build process, routing, and vuex, each introduces its own considerations.

To truly master server-side rendering in complex applications, we recommend a deep dive into the following resources:

- [vue-server-renderer docs](https://www.npmjs.com/package/vue-server-renderer#api): more details on topics covered here, as well as documentation of more advanced topics, such as [preventing cross-request contamination](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) and [adding a separate server build](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): the definitive example of integrating all major Vue libraries and concepts in a single application
