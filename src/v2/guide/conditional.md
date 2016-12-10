---
title: 条件渲染
type: guide
order: 7
---

## `v-if`

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

### `<template>` 中 `v-if` 条件组 

因为 `v-if` 是一个指令，需要将它添加到一个元素上。但是如果我们想切换多个元素呢？此时我们可以把一个 `<template>` 元素当做包装元素，并在上面使用 `v-if`，最终的渲染结果不会包含它。

``` html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `v-else`

可以用 `v-else` 指令给 `v-if` 添加一个 "else" 块：

``` html
<div v-if="Math.random() > 0.5">
  Sorry
</div>
<div v-else>
  Not sorry
</div>
```

`v-else` 元素必须紧跟在 `v-if` 元素或者 `v-else-if`的后面——否则它不能被识别。

### `v-else-if`

> 2.1.0 新增

`v-else-if`，顾名思义，用作 `v-if` 的 `else-if` 块。可以链式的多次使用：

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

与 `v-else` 相似,，`v-else-if` 必须跟在 `v-if` 或者 `v-else-if`之后。

### 使用 `key` 控制元素的可重用

Vue 尝试尽可能高效的渲染元素，通常会复用已有元素而不是从头开始渲染。这么做除了使 Vue 更快之外还可以得到一些好处。如下例，当允许用户在不同的登录方式之间切换:

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

在代码中切换 `loginType` 不会删除用户已经输入的内容，两个模版由于使用了相同的元素，`<input>` 会被复用，仅仅是替换了他们的 `placeholder`。

自己动手试一试,输入一些文本，然后点击 「Toggle login type」 进行切换

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

这样也不总是符合实际需求，所以 Vue 提供一种方式让你可以自己决定是否要复用元素。你要做的是添加一个属性 `key` ，`key` 必须带有唯一的值。

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

现在输入文本将会在每次切换时重新渲染。自动动手试一试。

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username" key="username-input">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

注意, `<label>` 元素仍然会被复用，因为没有被添加了 `key` 属性。

## `v-show`

另一个根据条件展示元素的选项是 `v-show` 指令。用法大体上一样：

``` html
<h1 v-show="ok">Hello!</h1>
```

不同的是有 `v-show` 的元素会始终渲染并保持在 DOM 中。`v-show` 是简单的切换元素的 CSS 属性 `display` 。

<p class="tip">注意 `v-show` 不支持 `<template>` 语法。</p>


## `v-if` vs `v-show`

`v-if` 是真实的条件渲染，因为它会确保条件块在切换当中适当地销毁与重建条件块内的事件监听器和子组件。

`v-if` 也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——在条件第一次变为真时才开始局部编译（编译会被缓存起来）。

相比之下， `v-show` 简单得多——元素始终被编译并保留，只是简单地基于 CSS 切换。

一般来说， `v-if` 有更高的切换消耗而 `v-show` 有更高的初始渲染消耗。因此，如果需要频繁切换使用 `v-show` 较好，如果在运行时条件不大可能改变则使用 `v-if` 较好。


***

> 原文：http://vuejs.org/guide/conditional.html

***
