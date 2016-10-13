---
title: 模板语法
type: guide
order: 4
---

Vue.js 使用了基于 HTML 的模版语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML ，所以能被遵循规范的浏览器和 HTML 解析器解析。

在底层的实现上， Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，在应用状态改变时， Vue 能够智能地计算出重新渲染组件的最小代价并应用到 DOM 操作上。

如果你熟悉虚拟 DOM 并且偏爱 JavaScript 的原始力量，你也可以不用模板，[直接写渲染（render）函数](/guide/render-function.html)，使用可选的 JSX 语法。

## 插值

### 文本

数据绑定最常见的形式就是使用 “Mustache” 语法（双大括号）的文本插值：

``` html
<span>Message: {{ msg }}</span>
```

Mustache 标签将会被替代为对应数据对象上 `msg` 属性的值。无论何时，绑定的数据对象上 `msg` 属性发生了改变，插值处的内容都会更新。

通过使用 [v-once 指令](/api/#v-once)，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。但请留心这会影响到该节点上所有的数据绑定：

``` html
<span v-once>This will never change: {{ msg }}</span>
```

### 纯 HTML

双大括号会将数据解释为纯文本，而非 HTML 。为了输出真正的 HTML ，你需要使用 `v-html` 指令：

``` html
<div v-html="rawHtml"></div>
```

被插入的内容都会被当做 HTML —— 数据绑定会被忽略。注意，你不能使用 `v-html` 来复合局部模板，因为 Vue 不是基于字符串的模板引擎。组件更适合担任 UI 重用与复合的基本单元。

<p class="tip">你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。请只对可信内容使用 HTML 插值，**绝不要**对用户提供的内容插值。</p>

### 属性

Mustache 不能在 HTML 属性中使用，应使用 [v-bind 指令](/api/#v-bind)：

``` html
<div v-bind:id="dynamicId"></div>
```

这对布尔值的属性也有效 —— 如果条件被求值为 false 的话该属性会被移除： 

``` html
<button v-bind:disabled="someDynamicCondition">Button</button>
```

### 使用 JavaScript 表达式

迄今为止，在我们的模板中，我们一直都只绑定简单的属性键值。但实际上，对于所有的数据绑定， Vue.js 都提供了完全的 JavaScript 表达式支持。

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

这些表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析。有个限制就是，每个绑定都只能包含**单个表达式**，所以下面的例子都**不会**生效。

``` html
<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

<p class="tip">模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 `Math` 和 `Date` 。你不应该在模板表达式中试图访问用户定义的全局变量。</p>

### 过滤器

Vue.js 允许你自定义过滤器，被用作一些常见的文本格式化。过滤器应该被添加在 **mustache 插值**的尾部，由“管道符”指示：

``` html
{{ message | capitalize }}
```

<p class="tip">Vue 2.x 中，过滤器只能在 mustache 绑定中使用。为了在指令绑定中实现同样的行为，你应该使用[计算属性](/guide/computed.html)。</p>

过滤器函数总接受表达式的值作为第一个参数。

``` js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

过滤器可以串联：

``` html
{{ message | filterA | filterB }}
```

过滤器是 JavaScript 函数，因此可以接受参数：

``` html
{{ message | filterA('arg1', arg2) }}
```

这里，字符串 `'arg1'` 将传给过滤器作为第二个参数， `arg2` 表达式的值将被求值然后传给过滤器作为第三个参数。

## 指令

指令（Directives）是带有 `v-` 前缀的特殊属性。指令属性的值预期是**单一 JavaScript 表达式**（除了 `v-for`，之后再讨论）。指令的职责就是当其表达式的值改变时相应地将某些行为应用到 DOM 上。让我们回顾一下在介绍里的例子：

``` html
<p v-if="seen">Now you see me</p>
```

这里， `v-if` 指令将根据表达式 `seen` 的值的真假来移除/插入 `<p>` 元素。

### 参数

一些指令能接受一个“参数”，在指令后以冒号指明。例如， `v-bind` 指令被用来响应地更新 HTML 属性：

``` html
<a v-bind:href="url"></a>
```

在这里 `href` 是参数，告知 `v-bind` 指令将该元素的 `href` 属性与表达式 `url` 的值绑定。

另一个例子是 `v-on` 指令，它用于监听 DOM 事件：

``` html
<a v-on:click="doSomething">
```

在这里参数是监听的事件名。我们也会更详细地讨论事件处理。

### 修饰符

修饰符（Modifiers）是以半角句号 `.` 指明的特殊后缀，用于指出一个指定应该以特殊方式绑定。例如，`.prevent` 修饰符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()`：

``` html
<form v-on:submit.prevent="onSubmit"></form>
```

之后当我们更深入地了解 `v-on` 与 `v-model`时，会看到更多修饰符的使用。

## 缩写

`v-` 前缀可作为一种模板中标识 Vue 特性的视觉暗示。当你使用 Vue.js 为现有的标记添加动态行为时，它会很有用，但对于一些频繁使用的指令来说略显冗余。同时，当搭建 Vue.js 管理所有模板的 [SPA](https://en.wikipedia.org/wiki/Single-page_application) 时，`v-` 前缀也变得没那么重要了。因此，Vue.js 为两个最为常用的指令提供了特别的缩写：

### `v-bind` 缩写

``` html
<!-- 完整语法 -->
<a v-bind:href="url"></a>

<!-- 缩写 -->
<a :href="url"></a>
```

### `v-on` 缩写

``` html
<!-- 完整语法 -->
<a v-on:click="doSomething"></a>

<!-- 缩写 -->
<a @click="doSomething"></a>
```

它们看起来可能与普通的 HTML 略有不同，但 `:` 与 `@` 对于属性名来说都是合法字符，在所有支持 Vue.js 的浏览器都能被正确地解析。而且，它们不会出现在最终渲染的标记。缩写语法是完全可选的，但随着你更深入地了解它们的作用，你会庆幸拥有它们。

***

> 原文： http://vuejs.org/guide/syntax.html

***
