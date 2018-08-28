---
title: Server-Side Rendering
type: guide
order: 503
---

## The Complete SSR Guide

We have created a standalone guide for creating server-rendered Vue applications. This is a very in-depth guide for those who are already familiar with client-side Vue development, server-side Node.js development and webpack. Check it out at [ssr.vuejs.org](https://ssr.vuejs.org/).

## Nuxt.js

Properly configuring all the discussed aspects of a production-ready server-rendered app can be a daunting task. Luckily, there is an excellent community project that aims to make all of this easier: [Nuxt.js](https://nuxtjs.org/). Nuxt.js is a higher-level framework built on top of the Vue ecosystem which provides an extremely streamlined development experience for writing universal Vue applications. Better yet, you can even use it as a static site generator (with pages authored as single-file Vue components)! We highly recommend giving it a try.

## Razzle
[Razzle](https://github.com/jaredpalmer/razzle): SSR Without The Framework. [Watch a presentation explaining Razzle](https://www.youtube.com/watch?v=2Vhy5188Msc). As of Razzle 2.0, you can create SSR Vue apps via a [Vue plugin](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-vue). You can also configure Razzle with any Node framework without the need for plugins or third-party packages.

Universal JavaScript applications are tough to setup. Either you buy into a framework like Next.js or react-server, fork a boilerplate, or set things up yourself. Aiming to fill this void, Razzle is a tool that abstracts all complex configuration needed for SSR into a single dependency--giving you the awesome developer experience of create-react-app, but then leaving the rest of your app's architectural decisions about frameworks, routing, and data fetching up to you. With this approach, Razzle not only works with React, but also Reason, Elm, Vue, Angular, and most importantly......whatever comes next.

## Ream
[Ream](https://ream.js.org/) is a minimal framework for building server-rendered or static website using Vue.js under the hood. Unlike other popular SSR frameworks, Ream is designed to be more low-level, which means it does not enforce a specific folder structure. In other words, it's pretty similar to a normal SPA, it's possible to migrate a vue-cli or [Poi](https://poi.js.org/) app to Ream in minutes!
