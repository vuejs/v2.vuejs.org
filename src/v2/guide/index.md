---
title: 介绍
type: guide
order: 2
---

## Vue.js 是什么？

Vue.js（读音 /vjuː/，类似于 **view** 的读音）是一套构建用户界面(user interface)的**渐进式框架**。与其他重量级框架不同的是，Vue 从根本上采用最小成本、渐进增量(incrementally adoptable)的设计。Vue 的核心库只专注于视图层，并且很容易与其他第三方库或现有项目集成。另一方面，当与[单文件组件](single-file-components.html)和 [Vue 生态系统支持的库](https://github.com/vuejs/awesome-vue#components--libraries)结合使用时，Vue 也完全能够为复杂的单页应用程序提供有力驱动。

如果你想在深入学习 Vue 之前了解更多信息，我们<a id="modal-player" href="#">创建了一个视频</a>，完整地梳理了 Vue 的核心理念，以及配合一个示例项目讲解。

如果你是有经验的前端开发人员，想知道 Vue.js 与其它库/框架(library/framework)之间的对比，请查看[对比其它框架](comparison.html)。

## 起步

<p class="tip">官方指南会预先假定你已具有 HTML、CSS 和 JavaScript 的中级知识水平。如果你刚开始学习前端开发，跳过基础知识，将框架作为你的起步可能不是最好的主意 - 掌握好基础知识再来！之前有其他框架的使用经验，对于学习 Vue.js 会有所帮助，但这不是必需的。</p>

尝试 Vue.js 最简单的方法是使用 [JSFiddle Hello World 示例](https://jsfiddle.net/chrisvfritz/50wL7mdz/)。你可以在浏览器新标签页中打开它，跟着基础示例学习一些基本用法。或者你也可以在本地<a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html">创建一个 <code>index.html</code> 文件，然后通过如下方式引入 Vue：

``` html
<!-- 开发版本，包含有用的控制台警告 -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

或：

``` html
<!-- 生成版本，对于体积和速度进行优化 -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

查看[安装](installation.html)页面来了解安装 Vue 的其他选项。注意：我们**不推荐**新手从 `vue-cli` 开始项目，特别是当你对基于 Node.js 的构建工具不够熟悉时。

## 声明式渲染

Vue.js 的核心是，可以采用简洁的模板语法来声明式的将数据渲染为 DOM：

``` html
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

我们已经生成了第一个 Vue 应用程序！这看起来和渲染一个字符串模板非常类似，但是 Vue 在背后做了大量工作。现在数据和 DOM 已经被关联在一起，所有的数据和 DOM 都是**响应式**的。我们如何对这一切清晰领会？打开你的浏览器的 JavaScript 控制台（现在，就在当前页面打开），然后设置 `app.message` 的值，你将看到上面的示例所渲染的 DOM 元素会相应地更新。

除了文本插值(text interpolation)，我们还可以采用这样的方式绑定 DOM 元素属性：

``` html
<div id="app-2">
  <span v-bind:title="message">
    鼠标悬停此处几秒，
    可以看到此处动态绑定的 title！
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: '页面加载于 ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    鼠标悬停此处几秒，可以看到此处动态绑定的 title！
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: '页面加载于 ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

这里我们遇到一些新内容。你看到的 `v-bind` 属性被称为**指令**。指令带有前缀 `v-`，表示是由 Vue 提供的专用属性。可能你已经猜到了，它们会在渲染的 DOM 上产生专门的响应式行为。简而言之，这里该指令的作用就是：“将此元素的 `title` 属性与 Vue 实例的 `message` 属性保持关联更新”。

如果你再次打开浏览器的 JavaScript 控制台，并输入 `app2.message = '一些新的 message'`，就会再次看到，绑定了 `title` 属性的 HTML 已经进行了更新。

## 条件与循环

控制切换一个元素的显示也很简单：

``` html
<div id="app-3">
  <span v-if="seen">现在你可以看到我</span>
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
  <span v-if="seen">现在你可以看到我</span>
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

继续在控制台输入 `app3.seen = false`，你应该会看到 span 消失。

这个示例表明，我们不只是可以将数据绑定到文本和属性，也可以将数据绑定到 DOM **结构**。而且，Vue 也提供一个强大的过渡效果系统，可以在 Vue 插入/更新/删除元素时，自动使用[过渡效果](transitions.html)。

还有其它一些指令，每个都具有各自不同的特殊功能。例如，`v-for` 指令，可以使用数组中的数据来展示一个项目列表：

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: '学习 JavaScript' },
      { text: '学习 Vue' },
      { text: '创建激动人心的代码' }
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
      { text: '学习 JavaScript' },
      { text: '学习 Vue' },
      { text: '创建激动人心的代码' }
    ]
  }
})
</script>
{% endraw %}

在控制台，输入 `app4.todos.push({ text: '新的 item' })`，你会看到列表中追加了一个新的 item。

## 处理用户输入

为了让用户和你的应用程序进行交互，我们可以使用 `v-on` 指令 来增加事件监听器，触发事件后会调用 Vue 实例中 methods 下定义的方法：

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">翻转 message</button>
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
  <button v-on:click="reverseMessage">翻转 message</button>
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

注意，在 `reverseMessage` 方法中，我们更新了应用程序的状态，而无需触及 DOM - 所有的 DOM 操作都由 Vue 来处理，你所编写的代码只需要关注于底层逻辑。

Vue 还提供了 `v-model` 指令，使得表单输入和应用程序状态之间的双向绑定变得轻而易举：

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

## 由组件组合而成的应用程序

组件系统是 Vue 的另一个重要概念，因为它是一种抽象，可以让我们使用小型、自成体系和通常可复用的组件，把这些组合来构建大型应用程序。仔细想想，几乎任意类型的应用程序界面，都可以抽象为一个组件树：

![Component Tree](/images/components.png)

在 Vue 中，一个组件本质上是一个被预先定义选项的 Vue 实例，在 Vue 中注册组件很简单：

``` js
// 定义一个被命名为 todo-item 的新组件
Vue.component('todo-item', {
  template: '<li>这是一个 todo 项</li>'
})
```

现在你可以在另一个组件模板中组合使用它：

``` html
<ol>
  <!-- 创建一个 todo-item 组件的实例 -->
  <todo-item></todo-item>
</ol>
```

但是这样会将每个 todo 项都为渲染相同的文本，这看起来并不炫酷。我们应该要将数据从父作用域传到子组件。让我们来修改下组件的定义，使它可以接受一个 [prop](components.html#Props)：

``` js
Vue.component('todo-item', {
  // todo-item 组件现在接受一个 "prop"，
  // 类似于一个自定义属性。
  // 此 prop 名为 todo。
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

现在，我们可以使用 `v-bind` 指令将 todo 传入每个重复的组件中：

``` html
<div id="app-7">
  <ol>
    <!--
      现在我们为每个 todo-item 提供了 todo 对象，
      其中它的内容是动态的。
      我们还需要为每个组件提供一个 "key"，
      这将在之后详细解释。
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id">
    </todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: '蔬菜' },
      { id: 1, text: '奶酪' },
      { id: 2, text: '其他人类食物' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: '蔬菜' },
      { id: 1, text: '奶酪' },
      { id: 2, text: '其他人类食物' }
    ]
  }
})
</script>
{% endraw %}

这是一个假想的例子，然而，我们已经努力将应用程序分为两个更小的单位，子组件通过 props 接口，与父组件之间形成了相当合理的解耦。我们现在可以进一步对 `<todo-item>` 组件进行更复杂的模板配置和逻辑方面的改进，而不会影响到父组件。

在一个大型应用中，有必要将整个应用程序划分为组件，以便开发时可维护管理。在[之后的组件指南](components.html)中我们将深入探讨组件，不过这里有一个（想象中的）使用了组件的应用的模板示例：

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### 与自定义元素的关系

你可能已经注意到，Vue 组件非常类似于 [Web 组件规范](https://www.w3.org/wiki/WebComponents/)中的**自定义元素(Custom Element)**。这是因为 Vue 的组件语法不加限制地效仿参照了此规范。例如 Vue 组件实现了 [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) 和 `is` 特殊属性。然而，还是有一些关键区别：

1. Web 组件规范仍然处于草案阶段，而且尚未被浏览器原生实现。相比之下，Vue 组件不需要任何 polyfill 修补，并且在所有支持的浏览器（IE9 及更高版本）之下表现一致。必要时，Vue 组件也能够包含于原生自定义元素规范之内。

2. Vue 组件提供了普通自定义元素所不具备的一些重要功能，最突出的是跨组件数据流(cross-component data flow)，自定义事件通信(custom event communication)以及构建工具集成(build tool integration)。

## 准备好了吗？

我们刚才简单介绍了 Vue 核心的最基本功能 — 本指南的其余部分将涵盖剩余功能和其他高级功能的详尽细节，所以请务必完整阅读整个指南！

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"></div><script src="https://player.vimeo.com/api/player.js"></script></div>


***

> 原文：https://vuejs.org/v2/guide/

***
