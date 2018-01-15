---
title: 根据条件进行渲染
type: guide
order: 7
---

## `v-if`

在字符串模板中，例如 Handlebars，我们会像这样去写条件块(conditional block)：

``` html
<!-- Handlebars 模板 -->
{{#if ok}}
  <h1>是</h1>
{{/if}}
```

在 Vue 中，我们使用 `v-if` 指令实现同样的功能：

``` html
<h1 v-if="ok">Yes</h1>
```

还可以用 `v-else` 添加一个 "else 块"：

``` html
<h1 v-if="ok">是</h1>
<h1 v-else>否</h1>
```

### 在 `<template>` 上使用 `v-if` 进行条件分组

由于 `v-if` 是一个指令，因此必须将其附加到一个单独的元素上。但是如果我们想要切换多个元素呢？在这种场景中，我们可以将 `<template>` 元素，作为多个元素的无形容器(invisible wrapper)，然后在这个容器上使用 `v-if`。最终渲染结果将不会包含 `<template>` 元素。

``` html
<template v-if="ok">
  <h1>标题</h1>
  <p>段落 1</p>
  <p>段落 2</p>
</template>
```

### `v-else`

可以使用 `v-else` 指令来表示和 `v-if` 对应的“else 块”：

``` html
<div v-if="Math.random() > 0.5">
  现在你可以看到我
</div>
<div v-else>
  现在你看不到我
</div>
```

`v-else` 元素必须紧跟在 `v-if` 或 `v-else-if` 元素之后 - 否则无法识别它。

### `v-else-if`

> 2.1.0+ 新增

`v-else-if`，顾名思义，就是 `v-if` 之后的“else-if 块”。可以多次链式地调用：

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
  非 A/B/C
</div>
```

和 `v-else` 类似，`v-else-if` 元素必须紧跟在 `v-if` 或 `v-else-if` 元素之后。

### 使用 `key` 控制元素是否可复用

Vue 会尽可能高效地渲染元素，通常会复用已渲染元素，而不是从头重新渲染。这样的实现方式，除了有助于使 Vue 变得非常快之外，还具有一些额外的优势。举例说明，如果你想要根据多种登录类型，来切换用户界面：

``` html
<template v-if="loginType === 'username'">
  <label>用户名</label>
  <input placeholder="请输入用户名">
</template>
<template v-else>
  <label>邮箱</label>
  <input placeholder="请输入邮箱">
</template>
```

然后，在上面的代码中，切换 `loginType` 不会清除用户已经输入的内容。这是由于两个模板使用的是相同的元素，所以 `<input>` 并不会被替换 - 替换的只是元素的 `placeholder`。

不妨自己动手测试一下，在 input 中输入一些文本，然后按下切换按钮：

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>用户名</label>
      <input placeholder="请输入用户名">
    </template>
    <template v-else>
      <label>邮箱</label>
      <input placeholder="请输入邮箱">
    </template>
  </div>
  <button @click="toggleLoginType">切换登录类型</button>
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

但是这样有时并不符合实际需求，所以 Vue 为如下所述的情况提供了一种方式：“这两个元素是完全独立的 - 请不要复用它们”。那就是为它们添加一个具有不同值的 `key` 属性：

``` html
<template v-if="loginType === 'username'">
  <label>用户名</label>
  <input placeholder="请输入用户名" key="username-input">
</template>
<template v-else>
  <label>邮箱</label>
  <input placeholder="请输入邮箱" key="email-input">
</template>
```

现在，这些 input 将会在每次切换时从头重新渲染。自己动手测试一下：

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>用户名</label>
      <input placeholder="请输入用户名" key="username-input">
    </template>
    <template v-else>
      <label>邮箱</label>
      <input placeholder="请输入邮箱" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">切换登录类型</button>
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

注意，`<label>` 元素仍然被有效地复用，因为它们没有 `key` 属性。

## `v-show`

另一个根据条件展示元素的选项是 `v-show` 指令。用法大致相同：

``` html
<h1 v-show="ok">Hello!</h1>
```

不同之处在于，具有 `v-show` 的元素会始终渲染并保留在 DOM 中。`v-show` 只会切换元素的 `display` 这个 CSS 属性。

<p class="tip">注意，`v-show` 和 `v-else` 都不支持 `<template>` 元素。</p>

## `v-if` 和 `v-show`

`v-if` 是“真实”的条件渲染，因为它会确保条件块(conditional block)在切换的过程中，完整地销毁(destroy)和重新创建(re-create)条件块内的事件监听器和子组件。

`v-if` 是**惰性的(lazy)**：如果在初始渲染时条件为 false，它不会执行任何操作 - 在条件第一次变为 true 时，才开始渲染条件块。

相比之下，`v-show` 要简单得多 - 不管初始条件如何，元素始终渲染，并且只是基于 CSS 的切换。

通常来说，`v-if` 在切换时有更高的性能开销，而 `v-show` 在初始渲染时有更高的性能开销。因此，如果需要频繁切换，推荐使用 `v-show`，如果条件在运行时改变的可能性较少，推荐使用 `v-if`。

## `v-if` 与 `v-for` 一起使用

当与 `v-if` 一起使用时，`v-for` 具有比 `v-if` 更高的优先级。更多详细信息，请查看<a href="../guide/list.html#%E5%B8%A6%E6%9C%89-v-if-%E7%9A%84-v-for">列表渲染指南</a>。

***

> 原文：https://vuejs.org/v2/guide/conditional.html

***
