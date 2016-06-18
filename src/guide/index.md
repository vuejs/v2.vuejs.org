---
title: Getting Started
type: guide
order: 1
---

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
