---
title: 组件基础
type: guide
order: 11
---

## 基本示例

这里是一个 Vue 组件示例：

``` js
// 定义一个新的组件，名称为 button-counter
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">你点击了 {{ count }} 次。</button>'
})
```

组件(component)，是具有 name 名称的可复用 Vue 实例：当前示例中是 `<button-counter>`。我们可以使用 `new Vue` 创建出一个 Vue 根实例，然后将这个组件作为其中的一个自定义元素(custom element)：

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
new Vue({ el: '#components-demo' })
```

{% raw %}
<div id="components-demo" class="demo">
  <button-counter></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">你点击了 {{ count }} 次。</button>'
})
new Vue({ el: '#components-demo' })
</script>
{% endraw %}

由于组件是可复用的 Vue 实例，它们接收的选项，和在 `new Vue` 时候的选项相同，例如 `data`, `computed`, `watch`, `methods` 和生命周期钩子。唯一的例外是，类似 `el` 这样，根实例上特有(root-specific)的选项。

## 重复使用组件

可以根据需要，多次重复使用组件：

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

{% raw %}
<div id="components-demo2" class="demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
<script>
new Vue({ el: '#components-demo2' })
</script>
{% endraw %}

注意，当点击按钮时，每个按钮都维护彼此独立的 `count`。这是因为每次使用组件时，都会创建出一个新的**组件实例**。

### `data` 必须是一个函数

当我们定义 `<button-counter>` 组件时，你可能已经注意到，提供给组件定义对象的 `data`，并不是如下所示的一个对象：

```js
data: {
  count: 0
}
```

相反，**组件的 `data` 选项必须是一个函数**，以便每个实例都可以维护「函数返回的数据对象」的彼此独立的数据副本：

```js
data: function () {
  return {
    count: 0
  }
}
```

如果 Vue 没有遵循这个规定，点击其中一个按钮，会影响其他所有用到此 data 的_组件实例_，如下所示：

{% raw %}
<div id="components-demo3" class="demo">
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
</div>
<script>
var buttonCounter2Data = {
  count: 0
}
Vue.component('button-counter2', {
  data: function () {
    return buttonCounter2Data
  },
  template: '<button v-on:click="count++">你点击了 {{ count }} 次。</button>'
})
new Vue({ el: '#components-demo3' })
</script>
{% endraw %}

## 将组件组合在一起

通常都会将一个应用程序，组织为一个嵌套的组件树：

![组件树](/images/components.png)

例如，你的组件可能有 header，sidebar 和 content 三个区域，每个组件都包含导航链接、博客文章等其他组件。

想要在模板中使用这些组件，就必须先进行注册，以便 Vue 能够找到它们。组件注册有两种方式：**全局注册**和**局部注册**。到目前为止，我们只通过 `Vue.component` 在全局注册组件：

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

全局方式注册的组件，可以用于之后创建的所有（通过 `new Vue` 创建的）Vue 根实例，以及 Vue 实例组件树中所有子组件的内部。

现在，你仅需要知道组件注册的这些相关知识，等到你阅读完这个页面，并且能够很好适应这些内容，我们建议你稍后回到这里，继续深入阅读 [组件注册](components-registration.html) 的完整指南。

## 使用 props 向子组件传递数据

前面我们提到过，创建一个博客文章组件。问题来了，如果无法向组件传递数据（例如向传入我们想要展示的文章的标题和内容），那这个组件也很难派上用场。props 就是为此而设计的。

props 是指注册在组件选项上的自定义属性。当一个值，被放置在 props 中，作为其中一个 prop，这个值就会成为组件实例上，一个可访问的属性。想要向我们的文章组件传递一个标题，我们需要在此组件接收 props 的 list 清单中将其置入，通过使用一个 `props` 来进行：

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

一个组件可以有很多 prop，并且默认情况下，任何类型的值都可以传递给 prop。在上面的 template 模板中，你可以看到我们可以在组件实例上访问到 title 这个值，就像我们访问 `data` 上的 title 一样。

在预先注册好一个 prop 属性之后，就可以将数据作为自定义属性传递给这个 prop 属性，如下所示：

```html
<blog-post title="我的 Vue 旅程"></blog-post>
<blog-post title="用 Vue 写博客"></blog-post>
<blog-post title="Vue 如此有趣"></blog-post>
```

{% raw %}
<div id="blog-post-demo" class="demo">
  <blog-post1 title="我的 Vue 旅程"></blog-post1>
  <blog-post1 title="用 Vue 写博客"></blog-post1>
  <blog-post1 title="Vue 如此有趣"></blog-post1>
</div>
<script>
Vue.component('blog-post1', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#blog-post-demo' })
</script>
{% endraw %}

然而，在一个应用程序中，你常常会将 `data` 中的 posts 设为一个数组：

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: '我的 Vue 旅程' },
      { id: 2, title: '用 Vue 写博客' },
      { id: 3, title: 'Vue 如此有趣' },
    ]
  }
})
```

然后，将每条数据渲染为一个组件：

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

以上，你就会看到我们使用 `v-bind` 来动态地传递属性。对于预先不知道确切内容的渲染，这是很有用的功能，例如，当我们[从一个 API 接口获取文章](https://jsfiddle.net/chrisvfritz/sbLgr0ad)时。

现在，你仅需要知道 props 的这些相关知识，等到你阅读完整个页面，并且能够很好适应这些内容，我们建议你稍后回到这里，继续深入阅读 [props](components-props.html) 的完整指南。

## 单个根元素

在创建 `<blog-post>` 组件时，最终的模板中，不仅要包含标题：

```html
<h3>{{ post.title }}</h3>
```

至少，还需要包含文章的内容：

```html
<h3>{{ post.title }}</h3>
<div v-html="post.content"></div>
```

如果你试图在 template 模板中按照以上方式书写，Vue 将会显示一个错误，并解释为 **every component must have a single root element**（译注：每个组件都必须有一个根元素）。你可以通过为以上模板包裹一个父元素，来修复这个错误，例如：

```html
<div class="blog-post">
  <h3>{{ post.title }}</h3>
  <div v-html="post.content"></div>
</div>
```

## 使用 events 向父组件发送消息

在我们开发 `<blog-post>` 组件时，有些功能可能恰好与 props 相反，需要子组件反过来和父组件进行通信。例如，我们可能会决定添加能放大文章文本字号的辅助功能，而将页面的其余部分保留为默认大小：

在父组件中，我们可以通过在 data 中添加一个 `postFontSize` 属性来支持这种功能：

```js
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [/* ... */],
    postFontSize: 1
  }
})
```

以便控制博客组件 template 模板中，所有博客文章的字号大小：

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
    ></blog-post>
  </div>
</div>
```

现在，我们在每篇文章的内容前面添加一个可以加大文本字号的按钮：

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button>
        放大文本
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
```

<p class="tip">上面的示例，还有接下来的一些示例，都用到了 JavaScript 的 [模板字面量(template literal)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)，以便多行模板更加具备可读性。Internet Explorer (IE) 不支持此语法，因此如果你必须支持 IE，而又不想转译代码（例如，使用 Babel 或 TypeScript 进行转译），使用 [新行转义(newline escapes)](https://css-tricks.com/snippets/javascript/multiline-string-variables-in-javascript/) 替代模板字面量语法。</p>

现在的问题是，这里的 button 无法实现这个功能：

```html
<button>
  放大文本
</button>
```

当我们点击 button 时，我们需要和父组件通信，告知它加大所有文章的文本字号。幸运的是，Vue 实例为我们提供了一个自定义事件(custom event)系统，来解决这个问题。想要向父组件发送事件，我们可以调用实例中内置的 [**`$emit`** 方法](../api/#Instance-Methods-Events)，传递事件名称：

```html
<button v-on:click="$emit('enlarge-text')">
  放大文本
</button>
```

然后在我们的博客文章组件上，我们可以通过 `v-on` 监听这个事件，就如同我们使用原生 DOM 事件一样：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

{% raw %}
<div id="blog-posts-events-demo" class="demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
      v-on:enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
<script>
Vue.component('blog-post', {
  props: ['post'],
  template: '\
    <div class="blog-post">\
      <h3>{{ post.title }}</h3>\
      <button v-on:click="$emit(\'enlarge-text\')">\
        放大文本\
      </button>\
      <div v-html="post.content"></div>\
    </div>\
  '
})
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [
      { id: 1, title: '我的 Vue 旅程', content: '...内容...' },
      { id: 2, title: '用 Vue 写博客', content: '...内容...' },
      { id: 3, title: 'Vue 如此有趣', content: '...内容...' }
    ],
    postFontSize: 1
  }
})
</script>
{% endraw %}

### 在 event 事件中发送一个值

有时，想在 event 事件中发送一个特定的值。例如，我们可能想要在 `<blog-post>` 组件自身内部，去控制放大文本字号的间隔。在这种情况下，我们可以使用 `$emit` 的第二个参数来提供字号间隔值：

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  放大文本
</button>
```

然后，当我们在父实例中监听这个事件时，我们可以通过 `$event` 来访问这次发送事件的值：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

或者，如果事件处理函数是一个方法：

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

然后，这个值会被传入到方法中，作为第一个参数：

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### 在组件中使用 `v-model`

自定义事件(custom event)，还可以用来创建出「实现 `v-model` 机制的自定义输入框(custom input)」。回顾前面章节中：

```html
<input v-model="searchText">
```

等同于如下：

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

而用于一个组件时，`v-model` 则可以替换为如下：

``` html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

为了组件内部能够有效运行，组件内的 `<input>` 必须：

- 将 `value` 属性绑定到 `value` prop
- 在 `input` 输入框中，在自定义的 `input` 事件中，发送一个新的值

这里就是上面所描述的：

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

现在，我们的 custom-input 组件，应该可以实现 `v-model` 的完美运行：

```html
<custom-input v-model="searchText"></custom-input>
```

现在，你仅需要知道组件的自定义事件的这些相关知识，等到你阅读完整个页面，并且能够很好适应这些内容，我们建议你稍后回到这里，继续深入阅读 [自定义事件(custom event)](components-custom-events.html) 的完整指南。

## 使用 slots 进行内容分发

如同在 HTML 元素中传入内容，我们也经常会向组件传入内容，就像这样：

``` html
<alert-box>
  发生一些错误。
</alert-box>
```

会被渲染为如下结果：

{% raw %}
<div id="slots-demo" class="demo">
  <alert-box>
    发生一些错误。
  </alert-box>
</div>
<script>
Vue.component('alert-box', {
  template: '\
    <div class="demo-alert-box">\
      <strong>Error!</strong>\
      <slot></slot>\
    </div>\
  '
})
new Vue({ el: '#slots-demo' })
</script>
<style>
.demo-alert-box {
  padding: 10px 20px;
  background: #f3beb8;
  border: 1px solid #f09898;
}
</style>
{% endraw %}

幸运的是，通过 Vue 的 `<slot>` 自定义元素，可以非常简单的实现这个任务：

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

就像你看到的，我们只是将其插入到我们想要它在的位置 - 就像这样。我们已经实现了预期！

现在，你仅需要知道 slot(插槽) 的这些相关知识，等到你阅读完整个页面，并且能够很好适应这些内容，我们建议你稍后回到这里，继续深入阅读 [slot(插槽)](components-slots.html) 的完整指南。

## 动态组件

有时，在组件之间进行动态切换非常有用，例如在标签式界面中：

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    class="dynamic-component-demo-tab-button"
    v-bind:class="{ 'dynamic-component-demo-tab-button-active': tab === currentTab }"
    v-on:click="currentTab = tab"
  >
    {{ tab }}
  </button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-home', { template: '<div>Home 组件</div>' })
Vue.component('tab-posts', { template: '<div>Posts 组件</div>' })
Vue.component('tab-archive', { template: '<div>Archive 组件</div>' })
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Home',
    tabs: ['Home', 'Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
{% endraw %}

通过向 Vue 的 `<component>` 元素传入 `is` 特性，可以实现以上效果：

```html
<!-- Component changes when currentTabComponent changes -->
<component v-bind:is="currentTabComponent"></component>
```

在上面的示例中，`currentTabComponent` 也可以是以下之一：

- 已注册组件的注册名称(registered name)
- 或者是一个组件选项对象(options object)

在 [fiddle](https://jsfiddle.net/chrisvfritz/o3nycadu/) 中查看 注册名称方式 的完整代码并体验效果，或者在 [这个 fiddle](https://jsfiddle.net/chrisvfritz/b2qj69o1/) 中查看 选项对象方式。

现在，你仅需要知道 动态组件 的这些相关知识，等到你阅读完整个页面，并且能够很好适应这些内容，我们建议你稍后回到这里，继续深入阅读 [动态组件和异步组件](components-dynamic-async.html) 的完整指南。

## DOM 模板解析注意事项

有些　HTML 元素，例如 `<ul>`, `<ol>`, `<table>` 和 `<select>` 这些元素，会对于出现在其内部的元素有所限制；而另一些　HTML 元素，例如 `<li>`, `<tr>` 和 `<option>` 这些元素，只可以出现在前面那些元素的内部。

由于这种 HTML 运行机制，在这些受限制的元素内部使用组件，会导致一些问题。例如：

``` html
<table>
  <blog-post-row></blog-post-row>
</table>
```

自定义组件 `<blog-post-row>` 会被当作无效内容，提升到 table 元素之外，从而导致最终渲染输出后的错误。幸运的是，`is` 特性提供了一种解决方案：

``` html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

应当注意，**在使用以下字符串模板之一的场景中，这些限制将_不再适用_**：

- 字符串模板（例如 `template: '...'`）
- [单文件 (`.vue`) 组件](single-file-components.html)
- [`<script type="text/x-template">`](components-edge-cases.html#X-Templates)

现在，你仅需要知道 DOM 模板解析 的这些相关知识 - 实际上，Vue _基础指南部分_已经结束。为此值得祝贺！虽然还有很多要学习的知识点，但是现在，我们推荐你在此休息一下，开始熟悉并享受使用 Vue 构建项目的乐趣。

如果你能够很好适应这些内容，并且已经完全消化这些知识点，我们建议你稍后回到这里，继续深入阅读 [动态组件和异步组件](components-dynamic-async.html) 的完整指南，以及侧边栏中深入组件部分的其他页面。

***

> 原文：http://vuejs.org/v2/guide/components.html

***
