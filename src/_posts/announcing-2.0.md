---
title: Announcing Vue.js 2.0
date: 2016-04-27 13:33:00
---

Today I am thrilled to announce the first public preview of Vue.js 2.0, which brings along many exciting improvements and new features. Let's take a peek at what's in store!

<!-- more -->

## Even Leaner, Even Faster

Vue.js has always focused on staying light and fast, but 2.0 pushes it even further. The rendering layer is now based on a lightweight virtual-DOM implementation (based on [Snabbdom](https://github.com/paldepind/snabbdom)) that improves initial rendering speed and memory consumption by up to 2~4x in most scenarios (check out [these benchmarks](https://github.com/vuejs/vue/tree/next/benchmarks)). The template-to-virtual-DOM compiler and the runtime can be separated, so you can pre-compile templates and ship your app with only the runtime, which is less than 12kb min+gzip (as a reference, React 15 is 44kb min+gzip). The compiler also works in the browser, which means you can still drop in one script tag and start hacking, just like before. Even with the compiler included, the build is sitting at 17kb min+gzip, still lighter than the current 1.0 build.

## Not Your Average Virtual-DOM

Now, just virtual-DOM sounds boring because there are so many implementations out there - but this one is different. Combined with Vue's reactivity system, it provides optimized re-rendering out of the box without you having to do anything. Each component keeps track of its reactive dependencies during its render, so the system knows precisely when to re-render, and which components to re-render. No need for `shouldComponentUpdate` or immutable data structures - **it just works**.

In addition, Vue 2.0 applies some advanced optimizations during the template-to-virtual-DOM compilation phase:

1. It detects static class names and attributes so that they are never diffed after the initial render.

2. It detects the maximum static sub trees (sub trees with no dynamic bindings) and hoist them out of the render function. So on each re-render, it directly reuses the exact same virtual nodes and skips the diffing.

These advanced optimizations can usually only be achieved via Babel plugins when using JSX, but with Vue 2.0 you can get them even using the in-browser compiler.

The new rendering system also allows you to disable reactive conversions by simply freezing your data and manually force updates, essentially giving you full control over the re-rendering process.

With these techniques combined, Vue 2.0 ensures blazing fast performance in every possible scenario while requiring minimal optimization efforts from the developer.

## Templates, JSX, or Hyperscript?

Developers tend to have strong opinions on templates vs. JSX. On the one hand, templates are closer to HTML - they map better to the semantic structure of your app and make it much easier to think visually about the design, layout and styling. On the other hand, templates are limited to the DSL while the programmatic nature of JSX/hyperscript provides the full expressive power of a turing-complete language.

Being a designer/developer hybrid, I prefer writing most of my interfaces in templates, but in certain cases I do miss the flexibility of JSX/hyperscript. An example would be writing a component that programmatically handles its children, something not feasible with just the template-based slot mechanism.

Well, why not have both? In Vue 2.0, you can keep using the familiar template syntax, or drop down to the virtual-DOM layer whenever you feel constrained by the template DSL. Instead of the `template` option, just replace it with a `render` function. You can even embed render functions in your templates using the special `<render>` tag! The best of both worlds, in the same framework.

## Streaming Server-side Rendering

With the migration to virtual-DOM, Vue 2.0 naturally supports server-side rendering with client-side hydration. One pain point of current mainstream server rendering implementations, such as React's, is that the rendering is synchronous so it can block the server's event loop if the app is complex. Synchronous server-side rendering may even adversely affect time-to-content on the client. Vue 2.0 provides built-in streaming server-side rendering, so that you can render your component, get a readable stream back and directly pipe it to the HTTP response. This ensures your server is responsive, and gets the rendered content to your users faster.

## Unlocking More Possibilities

With the new architecture, there are even more possibilities to explore - for example, rendering to native interfaces on mobile. Currently, we are exploring a port of Vue.js 2.0 that uses [weex](http://alibaba.github.io/weex/) as a native rendering backend, a project maintained by engineers at Alibaba Group, the biggest tech enterprise of China. It is also technically feasible to adapt Vue 2.0's virtual-DOM to run inside ReactNative. We are excited to see how it goes!

## Compatibility and What to Expect Next

Vue.js 2.0 is still in pre-alpha, but you can checkout the source code [here](https://github.com/vuejs/vue/tree/next/). Despite being a full rewrite, the API is largely compatible with 1.0 with the exception of some intentional deprecations. Check out [the same official examples written in 2.0](https://github.com/vuejs/vue/tree/next/examples) - you will see that not much has changed!

The feature deprecations are part of our continued effort to provide the simplest API possible for maximum developer productivity. You can check out a 1.0 vs. 2.0 feature comparison [here](https://github.com/vuejs/vue/wiki/2.0-features). This does mean that it will take some effort to migrate an existing app if you happen to use some of these deprecated features heavily, but we will provide detailed upgrade guides in the future.

There is still much work left to be done. We will be releasing the first alpha once we reach satisfactory test coverage, and we are aiming for beta by end of May / early June. In addition to more tests, we also need to update the supporting libraries (vue-router, Vuex, vue-loader, vueify...). Currently only Vuex works with 2.0 out of the box, but we will make sure that everything works smoothly together when 2.0 ships.

We are also not forgetting about 1.x! 1.1 will be released alongside 2.0 beta, with an LTS period of 6-month critical bug fixes and 9-month security updates. It will also ship with optional deprecation warnings to get you prepared for upgrading to 2.0. Stay tuned!
