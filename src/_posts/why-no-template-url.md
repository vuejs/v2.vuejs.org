---
title: "Why Vue.js doesn't support templateURL"
date: 2015-10-28 10:56:00
---

A very common question from new Vue users, especially those who used Angular before, is "can I have `templateURL`?". I have answered this so many times and I figure it's better to write something about it.

<!-- more -->

In Angular, `templateURL` or `ng-include` allows the user to dynamically load a remote template file at runtime. This seems pretty convenient as a built-in feature, but let's rethink what problem it solves.

First, it allows us to write our template in a separate HTML file. This gives us proper syntax highlighting in editors, which is probably why many prefer to do so. But is splitting your JavaScript code and the template really the best way? For a Vue.js component, its template and its JavaScript is tightly coupled by nature - it's in fact much simpler if things are just in the same file. The context switching of jumping back and forth between two files actually makes the development experience much worse. Conceptually, components are the basic building block of a Vue.js app, not templates. Every Vue.js template is coupled to an accompanying JavaScript context - there's no point in splitting them further apart.

Second, because `templateURL` loads the template via Ajax at runtime, you don't need a build step in order to split up your files. This is convenient during development, but comes at a serious cost when you want to deploy it to production. Before HTTP/2 is universally supported, the number of HTTP requests is still probably the most critical factor in your app's initial load performance. Now imagine you use `templateURL` for every component in your app - the browser needs to perform dozens of HTTP requests before even being able to display anything! In case you don't know, most browsers limit the number of parallel requests it can perform to a single server. When you exceed that limit, your app's initial rendering will suffer for every extra round trip the browser has to wait for. Sure, there are build tools that can help you pre-register all those templates in `$templateCache` - but that shows us a build step is, in fact, inevitable for any serious frontend development.

So, without `templateURL`, how do we deal with the development experience problem? Writing templates as inline JavaScript strings is terrible, faking templates with `<script type="x/template">` also feels like a hack. Well, maybe it's time to up the game a bit and use a proper module bundler like [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). It might seem daunting if you've never dealt with them before, but trust me it's worth it to take the leap. Proper modularization is a necessity if you want to build anything large and maintainable. More importantly, you get to write your [Vue components in a single file](http://vuejs.org/guide/single-file-components.html), with proper syntax highlighting and the extra benefits of custom pre-processors, hot-reloading, ES2015 by default, autoprefixing and scoped CSS, which makes the development experience 10 times better.

Finally, Vue does allow you to [lazy load your components](http://vuejs.org/guide/components.html#Async-Components), and with Webpack it is trivially easy. Although this is only a concern when your initial bundle is so large that you are better off splitting it apart.

Think in components, not templates.
