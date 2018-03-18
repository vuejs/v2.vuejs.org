---
title: 模板语法
type: guide
order: 4
---

Vue.js 使用基于 HTML 的模板语法，允许声明式地将要渲染的 DOM 和 Vue 实例中的 data 数据绑定。所有 Vue.js 的模板都是有效的 HTML，能够被遵循规范的浏览器和 HTML 解析器解析。

在底层的实现上，Vue 将模板编译为虚拟 DOM 渲染函数。结合响应式系统，在应用程序状态改变时，Vue 能够智能地找出重新渲染的最小数量的组件，并应用最少量的 DOM 操作。

如果你熟悉虚拟 DOM 的概念，并且倾向于使用原生 JavaScript，还可以不使用模板，而是[直接编写渲染函数(render function)](render-function.html)，具备可选的 JSX 语法支持。

## 插值(Interpolations)

### 文本(Text)

数据绑定最基本的形式，就是使用 "mustache" 语法（双花括号）的文本插值(text interpolation)：

``` html
<span>Message: {{ msg }}</span>
```

mustache 标签将会被替换为 data 对象上对应的 `msg` 属性的值。只要绑定的数据对象上的 `msg` 属性发生改变，插值内容也会随之更新。

也可以通过使用 [v-once 指令](../api/#v-once)，执行一次性插值，也就是说，在数据改变时，插值内容不会随之更新。但是请牢记，这也将影响到同一节点上的其他所有绑定：

``` html
<span v-once>这里的值永远不会改变：{{ msg }}</span>
```

### 原始 HTML(Raw HTML)

双花括号语法，会将数据中的 HTML 转为纯文本后再进行插值。为了输出真正的 HTML，你需要使用 `v-html` 指令：

``` html
<p>使用双花括号语法：{{ rawHtml }}</p>
<p>使用 v-html 指令：<span v-html="rawHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>使用双花括号语法：{{ rawHtml }}</p>
  <p>使用 v-html 指令：<span v-html="rawHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
    return {
      rawHtml: '<span style="color: red">This should be red.</span>'
    }
  }
})
</script>
{% endraw %}

`span` 中的内容，将会被替换为 `rawHtml` 属性的值，并且作为原始 HTML 插入 - 会忽略解析属性值中的数据绑定。请注意，无法使用 `v-html` 来组合局部模板，这是因为 Vue 不是基于字符串(string-based)的模板引擎。反之，对于用户界面(UI)，组件更适合作为可重用和可组合的基本单位。

<p class="tip">在网站中动态渲染任意的 HTML 是非常危险的，因为这很容易导致网站受到 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。请只对可信内容使用 HTML 插值，**绝对不要**对用户提供的内容使用 HTML 插值。</p>

### 属性(Attributes)

不能在 Vue 模板中的 HTML 属性上使用双花括号语法(mustache)。而是应该使用 [v-bind 指令](../api/#v-bind)：

``` html
<div v-bind:id="dynamicId"></div>
```

在属性是布尔类型的一些情况中，`v-bind` 的作用有点不同，只要值存在就会隐含为 `true`。在这个例子中：

``` html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

如果 `isButtonDisabled` 的值为 `null`, `undefined` 或 `false`，`disabled` 属性甚至不会被包含在渲染后的 `<button>` 元素中。

### 使用 JavaScript 表达式

到目前为止，我们只实现了将模板绑定到基本的属性键上。然而，Vue.js 实际上能够支持通过完整的 JavaScript 表达式，将模板与任意的数据绑定在一起：

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

这些表达式，将在所属的 Vue 实例的数据作用域下，作为 JavaScript 取值。有个限制是，每个绑定都只能包含**单个表达式**，所以以下示例都**无法运行**：

``` html
<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也无法运行，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

<p class="tip">模板表达式放置在沙盒中，只能访问全局变量的一个白名单列表，如 `Math` 和 `Date`。在模板表达式中，你不应该试图访问用户定义的全局变量。</p>

## 指令(Directives)

指令(directive)是带有 `v-` 前缀的特殊属性。指令属性的值期望接收的是**单个 JavaScript 表达式**（`v-for` 是例外情况，稍后我们再讨论）。指令的职责是，当表达式的值改变时，将其产生的影响效果，响应式地作用于 DOM。回顾我们在介绍中看到的例子：

``` html
<p v-if="seen">Now you see me</p>
```

这里，`v-if` 指令将根据表达式 `seen` 的值的真假来移除/插入 `<p>` 元素。

### 参数(Arguments)

一些指令能够接收一个“参数”，在指令名称之后以 `:` 表示。例如，`v-bind` 指令可以用于响应式地更新 HTML 属性：

``` html
<a v-bind:href="url"> ... </a>
```

这里 `href` 是参数，告知 `v-bind` 指令将元素的 `href` 属性与表达式 `url` 的值绑定在一起。

另一个示例是 `v-on` 指令，用于监听 DOM 事件：

``` html
<a v-on:click="doSomething"> ... </a>
```

这里，参数是要监听事件的名称。稍后我们会详细地讨论事件处理。

### 修饰符(Modifiers)

修饰符(modifier)是以 `.` 表示的特殊后缀，表明应当以某种特殊方式绑定指令。例如，`.prevent` 修饰符告诉 `v-on` 指令，在触发事件后调用 `event.preventDefault()`：

``` html
<form v-on:submit.prevent="onSubmit"> ... </form>
```

稍后我们在探索这些特性时，你就会看到其他修饰符的相关示例，例如 [`v-on`](events.html#Event-Modifiers) 和 [`v-model`](forms.html#Modifiers)。

## 简写(Shorthands)

在模板中，`v-` 前缀作为非常符合直觉的提示，能够十分有效地标识出 Vue 特定(Vue-specific)属性。当你在使用 Vue.js 为现有标签添加动态行为(dynamic behavior)时，`v-` 前缀很有帮助，然而，对于一些频繁用到的指令来说，就会感到使用繁琐。同时，在构建由 Vue.js 管理所有模板的[单页面应用程序(SPA - single page application)](https://en.wikipedia.org/wiki/Single-page_application)时，`v-` 前缀也变得没那么重要了。因此，Vue.js 为 `v-bind` 和 `v-on` 这两个最常用的指令，提供了特定简写：

### `v-bind` 简写

``` html
<!-- 完整语法 -->
<a v-bind:href="url"> ... </a>

<!-- 简写 -->
<a :href="url"> ... </a>
```

### `v-on` 简写

``` html
<!-- 完整语法 -->
<a v-on:click="doSomething"> ... </a>

<!-- 简写 -->
<a @click="doSomething"> ... </a>
```

它们看起来可能与通常我们见到的 HTML 属性略有不同，但是，其实 `:` 和 `@` 都是符合属性名称(attribute name)相关标准的有效字符，并且所有支持 Vue.js 的浏览器都能够正确解析它们。此外，它们并不会出现在最终渲染的 HTML 标记中。简写语法是完全可选的书写方式，然而，随着你深入地了解它们的用法之后，你会领会到这种简单直接的简写方式，是非常赏心悦目的用法。

***

> 原文：https://vuejs.org/v2/guide/syntax.html

***
