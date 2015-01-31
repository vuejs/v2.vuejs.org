title: 指令
type: guide
order: 3
---

## 摘要

如果你还没有使用过 AngularJS，你可能不太清楚指令 (directive) 是什么。一个指令的本质是一个特殊的标记符号，使得该库对一个 DOM 元素进行一些处理。在 Vue.js 中，指令的概念和 Angular 是完全一样的。Vue.js 中的指令就是带有特殊前缀的 HTML 特性，它会以下面的格式出现：

``` html
<element
  prefix-directiveId="[argument:] expression [| filters...]">
</element>
```

## 一个简单的例子

``` html
<div v-text="message"></div>
```

这里默认的前缀是 `v`。指令 ID 是 `text`，表达式是 `message`。该指令会在该 Vue 实例的 `message` 属性发生变化时更新这个 div 的 `textContent`。

## 内联表达式

``` html
<div v-text="'hello ' + user.firstName + ' ' + user.lastName"></div>
```

这里我们用一个可推导的表达式 (computed expression) 提到了简单的属性名。Vue.js 会自动跟踪表达式中依赖的属性并在这些依赖发生变化的时候更新指令。而且因为有异步批处理更新机制，哪怕多个依赖同时变化时，表达式也只会在时间循环里触发一次。

你应该灵活的使用表达式，以避免在你的模板里放入过多的逻辑，尤其是有边界效应的语句 (事件监听表达式除外)。为了在模板内防止逻辑被滥用，Vue.js 把内联表达式限制为**只能是一条语句**。如果需要绑定更复杂的操作，请使用[可推导的属性](../guide/computed.html)。

<p class="tip">由于安全方面的原因，在内联表达式中你只能访问当前上下文中 Vue 实例及其祖先的属性和方法。</p>

## 参数

``` html
<div v-on="click : clickHandler"></div>
```

有些指令需要在路径或表达式前加一个参数。在这个例子中 `click` 参数代表了我们希望 `v-on` 指令监听到点击事件之后调用该 ViewModel 实例的 `clickHandler` 方法。

## 过滤器

过滤器可以紧跟在指令的路径或表达式之后，在更新 DOM 之前对值进行进一步处理。过滤器会被像 shell 脚本一样表示在一个竖线 (`|`) 之后。更多内容请移步至[深入了解过滤器](../guide/filters.html)。

## 多重语句指令

你可以在同一个特性的同一个指令里创建多个绑定。这些绑定是用逗号分隔开的。它们在底层被分解为多个指令实例进行绑定。

``` html
<div v-on="
  click   : onClick,
  keyup   : onKeyup,
  keydown : onKeydown
">
</div>
```

## 字面量指令

有些指令不会创建数据绑定——它们的值只是一个字符串字面量。比如 `v-component` 指令：

``` html
<div v-component="my-component"></div>
```

这里的 `"my-component"` 并不是一个数据属性——它是一个字符串 ID，用来让 Vue.js 查找对应的组件构造函数。

你也可以在字面量指令中使用 mustache 表达式。比如，下面的代码允许你动态的解析你想要的组件类型：

``` html
<div v-component="{&#123; isOwner ? 'owner-panel' : 'guest-panel' &#125;}"></div>
```

当花括号内部的表达式改变时，渲染出来的组件也会随之改变哦！

尽管如此，值得注意的是只有 `v-component` 和 `v-partial` 这两个字面量指令有这种可响应的行为。Mustache 表达式在别的字面量指令，如 `v-ref` 中，是**只运行一次**的。在指令被编译之后，就不再响应值的变化了。

完整的字面量指令列表可以在 [API 索引](../api/directives.html#字面指令) 中找到。

## 空指令

有些指令并不需要判断特性的值——这些操作对某个元素处理且仅处理一次。比如 `v-pre` 指令：

``` html
<div v-pre>
  <!-- markup in here will not be compiled -->
</div>
```

完整的空指令列表可以在 [API 索引](../api/directives.html#空指令) 中找到。

接下来，我们来看一看[过滤器](../guide/filters.html)。