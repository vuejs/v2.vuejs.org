---
title: 列表渲染
type: guide
order: 8
---

## `v-for`

我们用 `v-for` 指令根据一组数组的选项列表进行渲染。 `v-for` 指令需要以 `item in items` 形式的特殊语法， `items` 是源数据数组并且 `item` 是数组元素迭代的别名。

### 基本用法

``` html
<ul id="example-1">
	<li v-for="item in items">
	  {{ item.message }}
	</li>
</ul>
```

``` js
var example1 = new Vue({
	el: '#example-1',
	data: {
		items: [
			{message: 'foo' },
			{message: 'Bar' }
		]	
	}
})
```

结果：

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.message}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-1')
    }
  }
})
</script>
{% endraw %}

在 `v-for` 块内部，我们有完全访问父作用域的属性。 `v-for` 还支持一个可选的第二个参数为当前项的索引。

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

结果:

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-2')
    }
  }
})
</script>
{% endraw %}

你也可以用 `of` 替代 `in` 作为分隔符, 所以它是最接近 JavaScript 迭代器的语法：

``` html
<div v-for="item of items"></div>
```

### Template v-for

如同 `v-if` 模板，你也可以用带有 `v-for` 的 `<template>` 标签来渲染多个元素块。例如： 

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

### 对象迭代 v-for

你也可以用 `v-for` 通过一个对象的属性来迭代。

``` html
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
```

结果:

{% raw %}
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
</script>
{% endraw %}

你也可以提供第二个的参数为键名:

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

第三个参数为索引:

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">当遍历一个对象时，顺序是根据 `Object.keys()` 可枚举键名排列，不保证和 JavaScript 引擎实现是一致的。</p>

### 整数迭代 v-for 

`v-for` 也可以取整数。在这种情况下，它将重复多次模板。

``` html
<div>
  <span v-for="n in 10">{{ n }}</span>
</div>
```

结果:

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
new Vue({ el: '#range' })
</script>
{% endraw %}

### 组件 和 v-for

> 了解组件相关知识，查看 [组件](/guide/components.html) 。

在自定义组件里，你可以像任何普通元素一样用 `v-for` 。

``` html
<my-component v-for="item in items"></my-component>
```

然而他不能自动传递数据到组件里，因为组件有自己独立的作用域。为了传递迭代数据到组件里，我们要用 `props` ：

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index">
</my-component>
```

不自动注入 `item` 到组件里是因为这样能让组件紧密耦合 `v-for` 怎么运作的。在一些情况下，明确了数据的来源让其组件可重复使用。

下面是一个简单的 todo list 完整的例子:

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <input
    v-model="newTodoText" v
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}

## key

当 Vue.js 用 `v-for` 正在更新已渲染过的元素列表时，它默认用 “就地复用” 策略。如果数据项的顺序被改变，而不是移动 DOM 元素来匹配列表的顺序， Vue 将简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。这个类似 Vue 1.X 的 `track-by="$index"` 。

这个默认的模式是有效的，但是只适合你的列表渲染输出时不依赖子组件状态或临时 DOM 状态（例如：表单输入框的值）。

给 Vue 一个提示以便它能跟踪每个节点身份，并且因此重新使用和重新排序现有元素，你需要为每项提供一个唯一 `key` 属性。一个有效的 `key` 值是每项唯一 ID. 这个特殊的属性相当于 Vue 1.x 的 `track-by` ，但它像一个变量，所以你需要用 `v-bind` 来绑定动态值（简洁写法如下）：

``` html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

它建议尽可能用 `v-for` 时提供一个 `key` ，除非迭代 DOM 内容很简单，或者你有意要依赖于对性能提升的默认行为。

因为它是 Vue 识别节点的通用的机制， `key` 还具有并不特别依赖于 `v-for` 的其他用途，我们将在后面的指南中看到其他用途。

## 数组更新检测

### 突变方法

Vue 包含一组观察数组的突变方法，所以它们也将会触发视图更新。这些方法如下：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

你打开控制台，然后用前面例子的 `items` 数组调用突变方法：`example1.items.push({ measage: 'Baz' })` 。

### 重塑数组

重塑数组，顾名思义，改变原始数组的称呼。相比之下，也有不改变原组数的方法，例如： `filter()` ， `concat()` ， `slice()` 。这些不会改变原始数组，但总是返回一个新的数组。当用不改变原数组的方法时，你只需替换旧数组用新的：

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

你可能认为这将导致 Vue 丢掉现有 DOM 并重新渲染整个列表。幸运的是，事实并非如此。 Vue 实现了一些智能化去最大化的重用 DOM 元素，所以用另外含有重叠对象的数组替换数组是非常高效的操作。

### 注意事项

由于 JavaScript 的限制， Vue 不能检测以下变动的数组：

1. 当你直接设置一个项的索引时, 例如： `vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时, 例如： `vm.items.length = newLength`

为了避免第一种情况, 以下两种方式将达到像 `vm.items[indexOfItem] = newValue` 的效果， 同时也将触发状态更新:

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice`
example1.items.splice(indexOfItem, 1, newValue)
```

避免第二种情况, 使用 `splice`:

``` js
example1.items.splice(newLength)
```

## 显示过滤/排序结果

有时我们无需实际改变或重置原始数据对数组进行过滤或排序。在这种情况下，你可以创建计算的属性返回过滤或排序的数组。

例如:

``` html
<li v-for="n in evenNumbers">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

此外, 你也可以只使用一种方法计算 (例如： 嵌套在 `v-for` 里循环)，但是性能是低效的:

``` html
<li v-for="n in even(numbers)">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

***

> 原文： http://vuejs.org/guide/list.html

***
