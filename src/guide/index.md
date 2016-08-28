---
title: 起步
type: guide
order: 1
---

我们以 Vue 数据绑定的快速导览开始。如果你对高级概述更感兴趣，可查看这篇[博文](http://blog.evanyou.me/2015/10/25/vuejs-re-introduction/)。如果你已经对Vue 1.0非常熟悉，这篇[迁移指南](http://rc.vuejs.org/guide/!!TODO:%20MIGRATION%20GUIDE%20FROM%201.0%20to%202.0)可能是个很好的开端。

尝试 Vue.js 最简单的方法是使用 [JSFiddle Hello World 例子](https://jsfiddle.net/chrisvfritz/ng41aepx/)。在浏览器新标签页中打开它，跟着我们查看一些基础示例。如果你喜欢用包管理器下载/安装，查看[安装](/guide/installation.html)教程。

### Hello World

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
<div id="app11" class="demo">
  {{ message }}
</div>
<script>
new Vue({
  el: '#app11',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

### 双向绑定

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
<div id="app12">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
new Vue({
  el: '#app12',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}


### 渲染列表

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
<div id="app13" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
new Vue({
  el: '#app13',
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

### 处理用户输入

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
<div id="app14" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
<script>
new Vue({
  el: '#app14',
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

### 综合

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
<div id="app15" class="demo">
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
  el: '#app15',
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