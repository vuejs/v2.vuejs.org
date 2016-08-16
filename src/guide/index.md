---
title: 起步
type: guide
order: 1
---

我们以 Vue 数据绑定的快速导览开始。如果你对高级概述更感兴趣，可查看这篇[博文](http://blog.evanyou.me/2015/10/25/vuejs-re-introduction/)。如果你已经对Vue 1.0非常熟悉，这篇[迁移指南](http://rc.vuejs.org/guide/!!TODO:%20MIGRATION%20GUIDE%20FROM%201.0%20to%202.0)可能是个很好的开端。

尝试 Vue.js 最简单的方法是使用 [JSFiddle Hello World 例子](https://jsfiddle.net/chrisvfritz/ng41aepx/)。在浏览器新标签页中打开它，跟着我们查看一些基础示例。如果你喜欢用包管理器下载/安装，查看[安装](/guide/installation.html)教程。

# Hello World

```html
<div id="app">
  {{ message }}
</div>
```

```javascript
new Vue({
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
new Vue({
  el: &#39;#app&#39;,
  data: {
    message: &#39;Hello Vue!&#39;
  }
})
</script>

 {% endraw %}

# 双向绑定

```html
<div id="app">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

{% raw %}



<div id="app2" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>



<script>
new Vue({
  el: &#39;#app2&#39;,
  data: {
    message: &#39;Hello Vue!&#39;
  }
})
</script>

 {% endraw %}

# 渲染列表

```html
<div id="app">
  <ul>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ul>
</div>
```

```javascript
new Vue({
  el: '#app',
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



<div id="app3" class="demo">
  <ul>
  <li v-for="todo in todos">
      {{ todo.text }}
    </li>
</ul>
</div>



<script>
new Vue({
  el: &#39;#app3&#39;,
  data: {
    todos: [
      { text: &#39;Learn JavaScript&#39; },
      { text: &#39;Learn Vue&#39; },
      { text: &#39;Build something awesome&#39; }
    ]
  }
})
</script>

 {% endraw %}

# 处理用户输入

```html
<div id="app">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```

```javascript
new Vue({
  el: '#app',
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



<div id="app4" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>



<script>
new Vue({
  el: &#39;#app4&#39;,
  data: {
    message: &#39;Hello Vue.js!&#39;
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split(&#39;&#39;).reverse().join(&#39;&#39;)
    }
  }
})
</script>

 {% endraw %}

# 综合

```html
<div id="app5">
  <input v-model="newTodo" v-on:keyup.enter="addTodo">
  <ul>
    <li v-for="(todo,index) in todos">
      <span>{{ todo.text }}</span>
      <button v-on:click="removeTodo(index)">X</button>
    </li>
  </ul>
</div>
```

```javascript
new Vue({
  el: '#app5',
  data: {
    newTodo: '',
    todos: [
      { text: '添加一些内容' }
    ]
  },
  methods: {
    addTodo: function () {
      var text = this.newTodo.trim()
      if (text) {
        this.todos.push({ text: text })
        this.newTodo = ''
      }
    },
    removeTodo: function (index) {
      this.todos.splice(index, 1)
    }
  }
})
```

{% raw %}
<div id="app5" class="demo">
  <input v-model="newTodo" v-on:keyup.enter="addTodo">
  <ul>
    <li v-for="(todo, index) in todos">
      <span>{{ todo.text }}</span>
      <button v-on:click="removeTodo(index)">X</button>
    </li>
  </ul>
</div>
<script>
new Vue({
  el: '#app5',
  data: {
    newTodo: '',
    todos: [
      { text: 'Add some todos' }
    ]
  },
  methods: {
    addTodo: function () {
      var text = this.newTodo.trim()
      if (text) {
        this.todos.push({ text: text })
        this.newTodo = ''
      }
    },
    removeTodo: function (index) {
      this.todos.splice(index, 1)
    }
  }
})
</script>
{% endraw %}

希望上例能让你对 Vue.js 的工作原理有一个基础概念。我知道你现在有许多疑问----继续阅读，在后面的教程将一一解答。

--------------------------------------------------------------------------------

> 原文：<http://rc.vuejs.org/guide/index.html>

***

# Getting Started


Let's start with a quick tour of Vue's data binding features. If you are more interested in a high-level overview first, check out this [blog post](!!TODO: HIGH LEVEL OVERVIEW FOR RELEASED 2.0). If you are already familiar with Vue 1.0, the [migration guide](!!TODO: MIGRATION GUIDE FROM 1.0 to 2.0) may be a good place to start.

The easiest way to try out Vue.js is using the [JSFiddle Hello World example](https://jsfiddle.net/chrisvfritz/ng41aepx/). Feel free to open it in another tab and follow along as we go through some basic examples. If you prefer downloading / installing from a package manager, check out the [Installation](/guide/installation.html) page.

### Hello World

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
new Vue({
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
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

### Two-way Binding

``` html
<div id="app">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```
{% raw %}
<div id="app2" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
new Vue({
  el: '#app2',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

### Render a List

``` html
<div id="app">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
new Vue({
  el: '#app',
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
<div id="app3" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
new Vue({
  el: '#app3',
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

### Handle User Input

``` html
<div id="app">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```
``` js
new Vue({
  el: '#app',
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
<div id="app4" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
<script>
new Vue({
  el: '#app4',
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

### All Together Now

``` html
<div id="app">
  <input v-model="newTodo" v-on:keyup.enter="addTodo">
  <ul>
    <li v-for="(todo, index) in todos">
      <span>{{ todo.text }}</span>
      <button v-on:click="removeTodo(index)">X</button>
    </li>
  </ul>
</div>
```
``` js
new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todos: [
      { text: 'Add some todos' }
    ]
  },
  methods: {
    addTodo: function () {
      var text = this.newTodo.trim()
      if (text) {
        this.todos.push({ text: text })
        this.newTodo = ''
      }
    },
    removeTodo: function (index) {
      this.todos.splice(index, 1)
    }
  }
})
```
{% raw %}
<div id="app5" class="demo">
  <input v-model="newTodo" v-on:keyup.enter="addTodo">
  <ul>
    <li v-for="(todo, index) in todos">
      <span>{{ todo.text }}</span>
      <button v-on:click="removeTodo(index)">X</button>
    </li>
  </ul>
</div>
<script>
new Vue({
  el: '#app5',
  data: {
    newTodo: '',
    todos: [
      { text: 'Add some todos' }
    ]
  },
  methods: {
    addTodo: function () {
      var text = this.newTodo.trim()
      if (text) {
        this.todos.push({ text: text })
        this.newTodo = ''
      }
    },
    removeTodo: function (index) {
      this.todos.splice(index, 1)
    }
  }
})
</script>
{% endraw %}

I hope this gives you a basic idea of how Vue works. I'm sure you also have many questions now - read along, and we will cover them in the rest of the guide.
