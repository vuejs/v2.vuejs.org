---
title: Vue.js 0.10 is here!
date: 2014-03-22 19:00:13
type: '{{type}}'
yield: '{{>yield}}'
---

Vue.js 0.10.0 (Blade Runner) has been released! This release comes with many useful additions based on the suggestions from the users, notably interpolation in literal directives, dynamic components with the new `v-view` directive, array filters, and the option to configure interpolation delimiters. Internally, the codebase has received many refactoring and improvements which makes Vue.js [even faster](http://vuejs.org/perf/).

<!-- more -->

See the [Installation](/guide/installation.html) page for the latest builds.

### New

- Literal directives can now contain interpolation tags. These tags will be evaluated only once at compile time. An example usage is conditionally decide which component to instantiate with `v-component="{{type}}"`. [Doc](/guide/directives.html#Literal_Directives).
- Attributes listed in the `paramAttributes` option now accept mustache interpolations too. They will also only be evaluated once.
- `v-repeat` now accepts an argument which will be used as the identifier for the wrapped object. This allows more explicit property access in repeaters. [Doc](/guide/list.html#Using_an_Identifier).
- Added `v-view` directive which binds to a string value and dynamically instantiate different components using that string as the component ID. [Doc](/api/directives.html#v-view).
- Added `filterBy` and `orderBy` filters for `v-repeat`. [Doc](/api/filters.html#filterBy).
- Custom filters that access properties on its `this` context will be considered **computed filters**. [Doc](/guide/custom-filter.html#Filter_Context).
- You can now access the event in `v-on` handler expressions as `$event`. Example: `<a v-on="click:handle('hello', $event)">Hello</a>`
- Interpolation delimiters can now be customized via the `delimiters` global config option. Example: `Vue.config({ delimiters: ["[", "]"] })` will change the matched interpolation tags to `[[ ]]` for text bindings and `[[[ ]]]` for html bindings.

### Changed

- `{{yield}}` syntax has been deprecated. A Web Components spec compatible content insertion mechanism using `<content>` elements has been introduced. [Doc](/guide/components.html#Content_Insertion).
- To use a component as a custom element, the component ID must now contain a hyphen (`-`). This is consistent with the current custom element spec draft.
- `v-repeat` Arrays' augmented methods have been renamed from `set` to `$set(index, value)` and `remove` to `$remove(index | value)`. The prefix better differentiates them from native methods. The `replace` method has been removed.
- When iterating over an Object with `v-repeat`, the object no longer gets a `$repeater` array. Instead, the object is now augmented with two methods: `$add(key, value)` and `$delete(key)`, which will trigger corresponding view updates.
- `v-if` now creates and destroys a child ViewModel instance when the binding value changes, instead of simply removing/inserting the DOM node. In addition, it can no longer be used with `v-repeat`. Use `v-show` or the new built-in array filters instead.
- `v-with` can no longer be used alone. It now must be used with either `v-component` or `v-view`. `v-component` can also be used as an empty directive just to create a child VM using the default `Vue` constructor.
- Production build now strips all warnings and debug logs. To leverage `debug: true`, use the development version. The development version now has more detailed warning messages.

### Fixed

- `event.stopPropagation()` and `event.preventDefault()` inside `v-on` handlers now work as expected.
- `parent` option now works properly when used in `Vue.extend`
- Mustache bindings inside `<textarea>` are now properly interpolated before being set as value.

### Internal

- `v-component`, `v-with` and `v-if` have been re-written for a cleaner compile flow.
- `v-repeat` has been re-written to use refined diff algorithm which triggers minimum DOM manipulations when the array is set to a different instance containing overlapping elements. This makes it efficient to pipe an Array through filters.
- `template` option now directly clones native `<template>`'s content when available.
- Overall performance improvements for both initialization and rendering.
