---
title: Special Elements
type: api
order: 8
---

> The following is a list of abstract elements that serve special purposes in Vue.js templates.

### component

Alternative syntax for invoking components. Primarily used for dynamic components with the `is` attribute:

``` html
<!-- a dynamic component controlled by -->
<!-- the `componentId` property on the vm -->
<component is="{{componentId}}"></component>
```

### content

`<content>` tags serve as content insertion outlets in component templates. The `<content>` element itself will be replaced. It optionally accepts a `select` attribute, which should be a valid CSS selector to be used to match a subset of inserted content to be displayed:

``` html
<!-- only display <li>'s in the inserted content -->
<content select="li"></content>
```

The select attribute can also contain mustache expressions. For more details, see [Content Insertion](/guide/components.html#Content_Insertion).

### partial

`<partial>` tags serve as outlets for registered partials. Partial contents are also compiled by Vue when inserted. The `<partial>` element itself will be replaced. It requires a `name` attribute to be provided. For example:

``` js
// registering a partial
Vue.partial('my-partial', '<p>This is a partial! {{msg}}</p>')
```

``` html
<!-- a static partial -->
<partial name="my-partial"></partial>

<!-- a dynamic partial -->
<partial name="{{partialId}}"></partial>
```
