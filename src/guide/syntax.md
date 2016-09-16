---
title: 模板语法
type: guide
order: 4
---

<<<<<<< HEAD

Vue.js 使用一个极简的虚拟DOM实现组件渲染和插值变量。
=======
Vue.js uses an HTML-based template syntax that allows you to declaratively bind the rendered DOM to the underlying Vue instance's data. All Vue.js templates are valid HTML that can be parsed by spec-compliant browsers and HTML parsers.

Under the hood, Vue compiles the templates into Virtual DOM render functions. Combined with the reactivity system, Vue is able to intelligently figure out the minimal amount of components to re-render and apply the minimal amount of DOM manipulations when the app state changes.

If you are familiar with Virtual DOM concepts and prefer the raw power of JavaScript, you can also [directly write render functions](/guide/render-function.html) instead of templates, with optional JSX support.
>>>>>>> 2.0

Vue.js 的模板是基于 DOM 实现的。这意味着所有的 Vue.js 模板都是可解析的有效的 HTML，且通过一些特殊的特性做了增强。Vue 模板因而从根本上不同于基于字符串的模板，请记住这点。

## 插值

### 文本

数据绑定最基础的形式是文本插值，使用 "Mustache" 语法（双大括号）：

``` html
<span>Message: {{ msg }}</span>
```

Mustache 标签会被相应数据对象的 `msg` 属性的值替换。每当这个属性变化时它也会更新。

你也可以使用[`v-once指令`](/api/#v-once)只处理单次插值，今后的数据变化就不会再引起插值更新了,但是请记住这会影响所绑定节点中所有变化。

``` html
<span v-once>This will never change: {{ msg }}</span>
```

### 原始的 HTML

双 Mustache 标签将数据解析为纯文本而不是 HTML。为了输出真的 HTML 字符串，需要用`v-html`指令：

``` html
<div v-html="rawHtml"></div>
```

The contents are inserted as plain HTML - data bindings are ignored. Note that you cannot use `v-html` to compose template partials, because Vue is not a string-based templating engine. Instead, components are preferred as the fundamental unit for UI reuse and composition.

### HTML 特性

Mustache 标签不可以用在 HTML 特性 (Attributes) 内，用一个[v-bind指令](http://rc.vuejs.org/guide/!!TODO)替换它

<<<<<<< HEAD

## 绑定表达式

放在 Mustache 标签内的文本称为**绑定表达式**。在 Vue.js 中，一段绑定表达式由一个简单的 JavaScript 表达式和一个可选的额外的[过滤器语法糖](http://rc.vuejs.org/guide/syntax.html#Filters)组成。

### JavaScript 表达式

到目前为止，我们的模板只绑定到简单的属性键。不过实际上 Vue.js 在数据绑定内支持全功能的 JavaScript 表达式：
=======
Mustaches cannot be used inside HTML attributes, instead use a [v-bind directive](/api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

It also works for boolean attributes - the attribute will be removed if the condition evaluates to a falsy value:

``` html
<button v-bind:disabled="someDynamicCondition">Button</button>
```

### Using JavaScript Expressions

So far we've only been binding to simple property keys in our templates. But Vue.js actually supports the full power of JavaScript expressions inside all data bindings:
>>>>>>> 2.0

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

<<<<<<< HEAD
这些表达式将在所属的 Vue 实例的作用域内计算。一个限制是每个绑定只能包含**单个表达式**，因此下面的语句是**无效**的：
=======
These expressions will be evaluated as JavaScript in the data scope of the owner Vue instance. One restriction is that each binding can only contain **one single expression**, so the following will **NOT** work:
>>>>>>> 2.0

``` html
<!-- 这是一个语句，不是一个表达式： -->
{{ var a = 1 }}

<!-- 流程控制也不可以，可改用三元表达式 -->
{{ if (ok) { return message } }}
```

<<<<<<< HEAD
### 过滤器

Vue.js 允许在表达式后添加可选的“过滤器 (Filter) ”，以“管道符”指示：
=======
<p class="tip">Template expressions are sandboxed and only have access to a whitelist of globals such as `Math` and `Date`. You should not attempt to access user defined globals in template expressions.</p>

### Filters

Vue.js allows you to define filters that can be used to apply common text formatting. Filters should be appended to the end of a **mustache interpolation**, denoted by the "pipe" symbol:
>>>>>>> 2.0

``` html
{{ message | capitalize }}
```

<<<<<<< HEAD
<p class="tip">Vue 2 的过滤器只可以被用在mustache绑定中。为了获得在其它绑定表达式中一样的行为，你可以使用[计算属性](http://rc.vuejs.org/guide/!!TODO)替代它</p>
=======
<p class="tip">Vue 2.x filters can only be used inside mustache bindings. To achieve the same behavior inside directive bindings, you should use [Computed properties](/guide/computed.html) instead.</p>
>>>>>>> 2.0

过滤器函数总是接受表达式只做为第一个参数

```
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

过滤器也是javascript函数,也可以接受参数：

``` html
{{ message | filterA 'arg1' arg2 }}
```

<<<<<<< HEAD
过滤器函数始终以表达式的值作为第一个参数。带引号的参数视为字符串，而不带引号的参数按表达式计算。这里，字符串 `'arg1'` 将传给过滤器作为第二个参数，表达式 `arg2` 的值在计算出来之后作为第三个参数。
=======
Here, the plain string `'arg1'` will be passed into the filter as the second argument, and the value of expression `arg2` will be evaluated and passed in as the third argument.
>>>>>>> 2.0

## 指令

<<<<<<< HEAD
指令 (Directives) 是特殊的带有前缀 `v-` 的特性。指令的值限定为**绑定表达式**，因此上面提到的 JavaScript 表达式及过滤器规则在这里也适用。指令的职责就是当其表达式的值改变时把某些特殊的行为应用到 DOM 上。我们来回头看下“概述”里的例子：
=======
Directives are special attributes with the `v-` prefix. Directive attribute values are expected to be **a single JavaScript expression** (with the exception for `v-for`, which will be discussed later). A directive's job is to reactively apply side effects to the DOM when the value of its expression changes. Let's review the example we saw in the introduction:
>>>>>>> 2.0

``` html
<p v-if="seen">Now you see me</p>
```

这里 `v-if` 指令将根据表达式 `seen` 值的真假删除/插入 `<p>` 元素。

### 参数

有些指令可以在其名称后面带一个“参数” (Argument)，中间放一个冒号隔开。例如，`v-bind` 指令用于响应地更新 HTML 特性：

``` html
<a v-bind:href="url"></a>
```

这里 `href` 是参数，它告诉 `v-bind` 指令将元素的 `href` 特性跟表达式 `url` 的值绑定。

另一个例子是 `v-on` 指令，它用于监听 DOM 事件：

``` html
<a v-on:click="doSomething">
```

这里参数是被监听的事件的名字。我们也会详细说明事件绑定。

### 修饰符

修饰符 (Modifiers) 是以半角句号 `.` 开始的特殊后缀，用于表示指令应当以特殊方式绑定。例如 `.prevent` 修饰符告诉`v-on`指令触发`event.preventDefault()`事件：

``` html
<form v-on:submit.prevent="onSubmit"></form>
```

后面我们将看到修饰符更多的实践用法例如`v-on`和 `v-model`。

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

它们看起来跟“合法”的 HTML 有点不同，但是 `:` 和 `@`在所有 Vue.js 支持的浏览器中都能被正确地解析，并且不会出现在最终渲染的标记中。缩写语法完全是可选的，不过随着一步步学习的深入，你会庆幸拥有它们。

***

> 原文： http://rc.vuejs.org/guide/syntax.html

***
