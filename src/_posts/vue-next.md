---
title: Vue.js 0.10.6, and what's next
date: 2014-07-29 00:04:55
---

## 0.10.6

Vue.js 0.10.6 has been released! This is another small bug-fix release and will be the last maintenance version before the next major release.

<!-- more -->

- fix `v-style` error when value is falsy or a number. ( thanks to [@dmfilipenko](https://github.com/dmfilipenko) )
- fix the built-in `currency` filter error when value is a string ( thanks to [@dmfilipenko](https://github.com/dmfilipenko) )
- fix `Vue.require` for building with Component v1.0+ ( thanks to [@kewah](https://github.com/kewah) )
- Allow template nodes to be passed as a template option ( thanks to [@jordangarcia](https://github.com/jordangarcia) )
- `vm.$destroy()` now accepts an optional argument `noRemove`. When passed in as `true` it will leave the vm's DOM node intact after the vm is destroyed.

## Vue-next

Some of you might have noticed there is a [next](https://github.com/yyx990803/vue/tree/next) branch in the repo. And yes, I am re-writing Vue.js from scratch. There are two main reasons:

- Fix some issues that are caused by design flaws in the current version. Because these changes affect the design of some core modules, it is actually easier to rewrite than to apply on the current codebase.
- Improve general code quality (in particular, `compiler.js` as of now is a big pile of mess, and comments are not consistent across the codebase.)

Take note that the `next` branch is still in **very** early stage. The internals will change a lot, and when it comes out it **will** break current applications. Despite that I will try to keep the API changes to a minimum. Major differences with current 0.10 branch are documented in [`changes.md`](https://github.com/yyx990803/vue/blob/next/changes.md). The list is obviously incomplete and subject to change, some of them are simply ideas, but it at least gives you a taste of what to expect, and I'd appreciate your feedback on any of the topics.

Share your thoughts at [vuejs/Discussion](https://github.com/vuejs/Discussion/issues).
