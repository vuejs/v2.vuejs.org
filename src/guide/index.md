---
title: 起步
type: guide
order: 2
---

## Vue.js是什么？

Vue.js（读音 /vjuː/, 类似于 **view**）是一个构建数据驱动的 web 界面的库。Vue.js 的目标是通过尽可能简单的 API 实现**响应的数据绑定**和**组合的视图组件**。

Vue.js 自身不是一个全能框架——它只聚焦于视图层。因此它非常容易学习，`非常容易`与其它库或已有项目整合。另一方面，在与[相关工具](application.html)和[支持库](https://github.com/vuejs/awesome-vue#libraries--plugins)一起使用时，Vue.js 也能完美地驱动复杂的单页应用。

如果你是有经验的前端开发者，想知道 Vue.js 与其它库/框架的区别，查看[对比其它框架](comparison.html)。

## 起步

尝试 Vue.js 最简单的方法是使用  [JSFiddle Hello World example](https://jsfiddle.net/chrisvfritz/4tpzm3e1/) 。在浏览器新标签页中打开它，跟着我们查看一些基础示例。如果你喜欢用包管理器下载/安装，查看[安装](/guide/installation.html)教程。

## 声明式渲染

Vue.js的核心系统使我们能以声明的方式使用简单的模板语法渲染数据到DOM中:


```html
<div id="app">
  {{ message }}
</div>
```

``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

我们已经创建了第一个Vue应用！直接渲染字一个模板非常简单，但Vue.js在背后做了大量工作。DOM 会自动响应数据的变化。怎么确定？我们如何知道？打开你的浏览器的控制台,修改`app.message`,你将看到上例相应地更新。

除了文本插值，也可以绑定元素属性像这样：

``` html
<div id="app-2">
  <span v-bind:id="id">Inspect me</span>
</div>
```

``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    id: 'inspect-me'
  }
})
```

{% raw %}
<div id="app-2" class="demo">
  <span v-bind:id="id">Inspect me</span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    id: 'inspect-me'
  }
})
</script>
{% endraw %}

这里我们遇到新东西。你看到的 `v-bind` 属性是一个***指令***。指令带有前缀 v-，以指示它们是 Vue.js 提供的特殊特性。并且如你所想象的，它们会对绑定的目标元素添加响应式的特殊行为。这里基本上可以看作“绑定这个元素的`id`”属性为Vue实例中的`id`。

使用浏览器调试工具定位再元素上 - 可以看到这有个id`inspect-me`。同样，可以在控制台修改 `app2.id`。

## 条件和循环

切换显示元素也是相当简单：

``` html
<div id="app-3">
  <p v-if="seen">Now you see me</p>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Now you see me</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

在控制台设置 `app3.seen = false`，可以看到消息消失了。


第二个示例演示了我们不仅可以绑定数据到文本和属性，也可以绑定到DOM结构上。甚至，Vue还提供一套强力的过渡系统在元素通过Vue插入/更新/移除自动应用[过渡效果](transitions.html)。

这里有一些其他指令，每一个都有自己独特的函数。例如，`v-for`指令可以被用来从数组数据中展示列表元素。

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ul>
</div>
```

``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})
```

{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})
</script>
{% endraw %}

在控制台输入 `app4.todos.push({ text: 'New item' })`。可以看到新元素进了列表中。

## 处理用户输入

为了让用户与应用互动，我们用`v-on`指令加上事件监听来触发Vue实例中的方法：

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```

``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```

{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

注意在方法中我们没有触碰DOM简单地更新了我们应用状态 - 所有DOM操作都由Vue来处理，我们可以聚焦在潜在的逻辑代码上。

Vue还提供了`v-model` 指令 很轻巧地实现输入和应用状态间的双向数据绑定。

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```

``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue!'
  }
})
```

{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

## 构建组件

组件系统是Vue中另一个重要的概念，因为它是一个抽象，使我们能够通过建立一些小型的，独立的，经常可复用的组件组成大型应用。几乎任何类型的应用界面都可以抽象成一棵组件树🌲:

![组件树](/images/components.png)

Vue中，一个组件基本上是一个预定义了设置的Vue实例。在Vue注册组件也很简单：

``` js
Vue.component('todo', {
  template: '<li>This is a todo</li>'
})
```

现在可以在另一个组件模板中使用它：

``` html
<ul>
  <todo v-for="todo in todos"></todo>
</ul>
```

不过每个Todo都渲染一样的文本并不有趣。我们可以从父组件传递数据到子组件中。让我们修改组件定义，使它可以结构一个 [prop](/guide/components.html#Props)：

``` js
Vue.component('todo', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

现在我们可以通过`v-bind`传递todo进入每个可重用的组件中：

``` html
<div id="app-7">
  <ol>
    <todo v-for="todo in todos" v-bind:todo="todo"></todo>
  </ol>
</div>
```
``` js
var app7 = new Vue({
  el: '#app-7',
  data: {
  todos: [{ /* ... */}]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo v-for="todo in todos" v-bind:todo="todo"></todo>
  </ol>
</div>
<script>
Vue.component('todo', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})
</script>
{% endraw %}

这只是一个例子，不过我们已经成功将应用分成两个更小的单元，并且子组件可以与父组件通过props很好地解耦。我们现在可以进一步使用复杂的模板和不影响父组件的逻辑改良`<todo>`组件

在大型应用中，很有必要把整个应用拆分使开发更好管理。更多关于组件的内容在[后面的指南](/guide/components.html),这里有个类似的示例展示应用的模板可以像这样：

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### 关于自定义元素

可以注意到Vue组件很类似于**自定义元素**，遵循了[Web组件规范](http://www.w3.org/wiki/WebComponents/)。这是因为Vue的组件语法模仿了规范。例如，Vue组件实现的[Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)和`is`特性。不过也有些关键不同点：

1.Web 组件规范仍然远未完成，并且没有浏览器实现。相比之下，Vue.js 组件不需要任何补丁，并且在所有支持的浏览器（IE9 及更高版本）之下表现一致。必要时，Vue.js 组件也可以放在原生自定义元素之内。

2.Vue.js 组件提供了原生自定义元素所不具备的一些重要功能，比如组件间的数据流，自定义事件系统，以及构建工具的继承。


## 准备好了吗?

我们才简要介绍了Vue核心最基本的功能 - 其余指南将涵盖它们，并提供进一步的功能细节，所以请确保读完全部内容。
