---
title: 条件渲染
type: guide
order: 7
---

## v-if

在字符串模板中，如 Handlebars ，我们得像这样写一个条件块：

``` html
<!-- Handlebars 模板 -->
{{#if ok}}
  <h1>Yes</h1>
{{/if}}
```

在 Vue.js ，我们使用 `v-if` 指令实现同样的功能：

``` html
<h1 v-if="ok">Yes</h1>
```

也可以用 `v-else` 添加一个 "else" 块：

``` html
<h1 v-if="ok">Yes</h1>
<h1 v-else>No</h1>
```

### template v-if

因为 `v-if` 是一个指令，需要将它添加到一个元素上。但是如果我们想切换多个元素呢？此时我们可以把一个 `<template>` 元素当做包装元素，并在上面使用 `v-if`，最终的渲染结果不会包含它。

``` html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### v-else

可以用 `v-else` 指令给 `v-if` 或 `v-show` 添加一个 "else" 块：

``` html
<div v-if="Math.random() > 0.5">
  Sorry
</div>
<div v-else>
  Not sorry
</div>
```

`v-else` 元素必须紧跟在 `v-if` 或 `v-show` 元素的后面——否则它不能被识别。

### v-show

另一个根据条件展示元素的选项是 `v-show` 指令。用法大体上一样：

``` html
<h1 v-show="ok">Hello!</h1>
```

不同的是有 `v-show` 的元素会始终渲染并保持在 DOM 中。`v-show` 是简单的切换元素的 CSS 属性 `display` 。

<p class="tip">注意 `v-show` 不支持 `<template>` 语法。</p>


## v-if vs. v-show

`v-if` 是真实的条件渲染，因为它会确保条件块在切换当中适当地销毁与重建条件块内的事件监听器和子组件。

`v-if` 也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——在条件第一次变为真时才开始局部编译（编译会被缓存起来）。

相比之下， `v-show` 简单得多——元素始终被编译并保留，只是简单地基于 CSS 切换。

一般来说， `v-if` 有更高的切换消耗而 `v-show` 有更高的初始渲染消耗。因此，如果需要频繁切换使用 `v-show` 较好，如果在运行时条件不大可能改变则使用 `v-if` 较好。


***

> 原文：http://vuejs.org/guide/conditional.html

***
