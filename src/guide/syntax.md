---
title: 数据绑定语法
type: guide
order: 4
---


Vue.js 使用一个极简的虚拟DOM实现组件渲染和插值变量。

Vue.js 的模板是基于 DOM 实现的。这意味着所有的 Vue.js 模板都是可解析的有效的 HTML，且通过一些特殊的特性做了增强。Vue 模板因而从根本上不同于基于字符串的模板，请记住这点。

## 插值

### 文本

数据绑定最基础的形式是文本插值，使用 "Mustache" 语法（双大括号）：

``` html
<span>Message: {{ msg }}</span>
```

Mustache 标签会被相应数据对象的 `msg` 属性的值替换。每当这个属性变化时它也会更新。

你也可以使用[`v-once指令`](http://rc.vuejs.org/guide/!!TODO)只处理单次插值，今后的数据变化就不会再引起插值更新了,但是请记住这会影响所绑定节点中所有变化

``` html
<span v-once>This will never change: {{ msg }}</span>
```

### 原始的 HTML

双 Mustache 标签将数据解析为纯文本而不是 HTML。为了输出真的 HTML 字符串，需要用`v-html`指令：

``` html
<div v-html="rawHtml"></div>
```

内容以 HTML 字符串插入——数据绑定将被忽略。如果需要复用模板片断，应当使用 [`functional component`](http://rc.vuejs.org/guide/!!TODO)。

<p class="tip">在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。记住，只对可信内容使用 HTML 插值，**永不**用于用户提交的内容。</p>

### HTML 特性

Mustache 标签不可以用在 HTML 特性 (Attributes) 内，用一个[v-bind指令](http://rc.vuejs.org/guide/!!TODO)替换它


## 绑定表达式

放在 Mustache 标签内的文本称为**绑定表达式**。在 Vue.js 中，一段绑定表达式由一个简单的 JavaScript 表达式和一个可选的额外的[过滤器语法糖](http://rc.vuejs.org/guide/syntax.html#Filters)组成。

### JavaScript 表达式

到目前为止，我们的模板只绑定到简单的属性键。不过实际上 Vue.js 在数据绑定内支持全功能的 JavaScript 表达式：

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}
```

这些表达式将在所属的 Vue 实例的作用域内计算。一个限制是每个绑定只能包含**单个表达式**，因此下面的语句是**无效**的：

``` html
<!-- 这是一个语句，不是一个表达式： -->
{{ var a = 1 }}

<!-- 流程控制也不可以，可改用三元表达式 -->
{{ if (ok) { return message } }}
```

### 过滤器

Vue.js 允许在表达式后添加可选的“过滤器 (Filter) ”，以“管道符”指示：

``` html
{{ message | capitalize }}
```

<p class="tip">Vue 2 的过滤器只可以被用在mustache绑定中。为了获得在其它绑定表达式中一样的行为，你可以使用[计算属性](http://rc.vuejs.org/guide/!!TODO)替代它</p>

过滤器函数总是接受表达式只做为第一个参数

```
new Vue({
  ...
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

过滤器也是javascript函数,也可以接受参数：

``` html
{{ message | filterA 'arg1' arg2 }}
```

过滤器函数始终以表达式的值作为第一个参数。带引号的参数视为字符串，而不带引号的参数按表达式计算。这里，字符串 `'arg1'` 将传给过滤器作为第二个参数，表达式 `arg2` 的值在计算出来之后作为第三个参数。

## 指令

指令 (Directives) 是特殊的带有前缀 `v-` 的特性。指令的值限定为**绑定表达式**，因此上面提到的 JavaScript 表达式及过滤器规则在这里也适用。指令的职责就是当其表达式的值改变时把某些特殊的行为应用到 DOM 上。我们来回头看下“概述”里的例子：

``` html
<p v-if="greeting">Hello!</p>
```

这里 `v-if` 指令将根据表达式 `greeting` 值的真假删除/插入 `<p>` 元素。

### 参数

有些指令可以在其名称后面带一个“参数” (Argument)，中间放一个冒号隔开。例如，`v-bind` 指令用于响应地更新 HTML 特性：

``` html
<a v-bind:href="url"></a>
```

这里 `href` 是参数，它告诉 `v-bind` 指令将元素的 `href` 特性跟表达式 `url` 的值绑定。可能你已注意到可以用特性插值 `{% raw %}href="{{url}}"{% endraw %}` 获得同样的结果：这样没错，并且实际上在内部特性插值会转为 `v-bind` 绑定。

另一个例子是 `v-on` 指令，它用于监听 DOM 事件：

``` html
<a v-on:click="doSomething">
```

这里参数是被监听的事件的名字。我们也会详细说明事件绑定。

### 修饰符

修饰符 (Modifiers) 是以半角句号 `.` 开始的特殊后缀，用于表示指令应当以特殊方式绑定。例如 `.literal` 修饰符告诉指令将它的值解析为一个字面字符串而不是一个表达式：

``` html
<a v-bind:href.literal="/a/b/c"></a>
```

当然，这似乎没有意义，因为我们只需要使用 `href="/a/b/c"` 而不必使用一个指令。这个例子只是为了演示语法。后面我们将看到修饰符更多的实践用法。

## 缩写

`v-` 前缀是一种标识模板中特定的 Vue 特性的视觉暗示。当你需要在一些现有的 HTML 代码中添加动态行为时，这些前缀可以起到很好的区分效果。但你在使用一些常用指令的时候，你会感觉一直这么写实在是啰嗦。而且在构建单页应用（[SPA](https://en.wikipedia.org/wiki/Single-page_application) ）时，Vue.js 会管理所有的模板，此时 `v-` 前缀也没那么重要了。因此Vue.js 为两个最常用的指令 `v-bind` 和 `v-on` 提供特别的缩写：

### `v-bind` 缩写

``` html
<!-- 完整语法 -->
<a v-bind:href="url"></a>

<!-- 缩写 -->
<a :href="url"></a>

<!-- 完整语法 -->
<button v-bind:disabled="someDynamicCondition">Button</button>

<!-- 缩写 -->
<button :disabled="someDynamicCondition">Button</button>
```

### `v-on` 缩写

``` html
<!-- 完整语法 -->
<a v-on:click="doSomething"></a>

<!-- 缩写 -->
<a @click="doSomething"></a>
```

它们看起来跟“合法”的 HTML 有点不同，但是它们在所有 Vue.js 支持的浏览器中都能被正确地解析，并且不会出现在最终渲染的标记中。缩写语法完全是可选的，不过随着一步步学习的深入，你会庆幸拥有它们。

***

> 原文： http://rc.vuejs.org/guide/syntax.html

***


