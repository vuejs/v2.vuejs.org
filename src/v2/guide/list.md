---
title: 列表渲染
type: guide
order: 8
---

## `v-for`

我们可以使用 `v-for` 指令，将一个数组渲染为列表项。`v-for` 指令需要限定格式为 `item in items` 的特殊语法，其中，`items` 是原始数据数组(source data array)，而 `item` 是数组中每个迭代元素的**指代别名(alias)**：

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
      { message: 'Foo' },
      { message: 'Bar' }
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
      smoothScroll.animateScroll(document.querySelector('#example-1'))
    }
  }
})
</script>
{% endraw %}

在 `v-for` 代码块中，我们可以完全地访问父级作用域下的属性。`v-for` 还支持可选的第二个参数，作为当前项的索引。

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

结果：

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
      smoothScroll.animateScroll(document.querySelector('#example-2'))
    }
  }
})
</script>
{% endraw %}

你还可以不使用 `in`，而是使用 `of` 作为分隔符，因为它更加接近 JavaScript 迭代器语法：

``` html
<div v-for="item of items"></div>
```

### 在 template 元素上使用 `v-for`

类似模板中的 `v-if`，你还可以对 `<template>` 标签使用 `v-for`，来渲染多个元素块。例如：

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

### 使用 `v-for` 遍历对象

也可以使用 `v-for` 来遍历对象的属性。

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
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
```

结果：

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
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

还可以提供第二个参数，作为对象的键名(key)：

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

然后第三个参数作为索引(index)：

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">在遍历一个对象时，是按照 `Object.keys()` 得出 key 的枚举顺序来遍历，**无法**保证在所有 JavaScript 引擎实现中完全一致。</p>

### 使用 `v-for` 在整数值范围内迭代

`v-for` 也可以在整数值范围内迭代。在这种情况下，会将模板重复多次。

``` html
<div>
  <span v-for="n in 10">{{ n }}</span>
</div>
```

结果：

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
new Vue({ el: '#range' })
</script>
{% endraw %}

### 组件与 `v-for`

> 此节假定已具备[组件](components.html)相关知识。可以先跳过本节内容，了解组件后再回来。

在自定义组件上，你可以直接使用 `v-for`，就像其他普通元素：

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> 现在，在 2.2.0+ 版本，当对组件使用 `v-for` 时，必须设置 [`key`](list.html#key) 属性。

然而，这里无法自动向组件中传入数据，这是因为组件有自己的独立作用域。为了将组件外部的迭代数据传入组件，我们还需要额外使用 props：

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

没有通过 v-for 将 `item` 自动注入到组件中的原因是，一旦自动注入，就会使得组件与 `v-for` 指令的运行方式紧密耦合(tightly coupled)在一起。通过显式声明组件数据来源，可以使得组件可重用于其他场景。

这里是一个 todo list 的完整示例：

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
      v-bind:key="todo.id"
      v-bind:title="todo.title"
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
      {
        id: 1,
        title: 'Do the dishes',
      },
      {
        id: 2,
        title: 'Take out the trash',
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
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
      {
        id: 1,
        title: 'Do the dishes',
      },
      {
        id: 2,
        title: 'Take out the trash',
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}

### 带有 `v-if` 的 `v-for`

当它们都处于同一节点时，`v-for` 的优先级高于 `v-if`。这意味着，`v-if` 将分别在循环中的每次迭代上运行。当你只想将_某些_项渲染为节点时，这会非常有用，如下：

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

以上只渲染 todos 中未完成的项。

如果你的意图与此相反，是根据条件跳过执行循环，可以将 `v-if` 放置于包裹元素上（或放置于 [`<template>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt) 上）。例如：

``` html
<ul v-if="shouldRenderTodos">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
```

## `key`

当 Vue 更新已使用 `v-for` 渲染的元素列表时，默认会采用“就地填充”策略。如果数据项的顺序发生了变化，不是移动 DOM 元素来匹配列表项的顺序，Vue 会直接将每个元素填充到恰当的位置，并且确保最终反映为，在该特定索引处放置应该呈现的内容。这与 Vue 1.x 中的 `track-by="$index"` 的行为类似。

这个默认模式是高效率的，但是只适用于**当你的列表渲染输出，不依赖于子组件状态或临时 DOM 状态（例如，表单输入值）时**。

为了便于 Vue 跟踪每个节点的身份，从而重新复用(reuse)和重新排序(reorder)现有元素，你需要为每项提供唯一的 `key` 属性，从而给 Vue 一个提示。理想的 `key` 值是每项都有唯一的 id。这个特殊属性和 Vue 1.x 中的 `track-by` 粗略相同，但是它会类似于属性运行，所以你需要使用 `v-bind` 将其与动态值绑定在一起（这里使用简写）：

``` html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

推荐，在使用 `v-for` 时，尽可能提供一个 `key`，除非迭代的 DOM 内容足够简单，或者你是故意依赖于默认行为来获得性能提升。

由于这是 Vue 识别节点的通用机制，因此 `key` 并不是仅限于与 `v-for` 关联，我们将在之后的指南中看到，`key` 还可以其他场景使用。

## 数组变化检测(Array Change Detection)

### 变化数组方法(Mutation Methods)

Vue 将观察数组(observed array)的变化数组方法(mutation method)包裹起来，以便在调用这些方法时，也能够触发视图更新。这些包裹的方法如下：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

可以打开控制台，然后对前面示例中的 `items` 数组调用变化数组方法。例如：`example1.items.push({ message: 'Baz' })`。

### 替换一个数组(Replacing an Array)

变化数组方法(mutation method)，顾名思义，在调用后会改变原始数组。相比之下，还有非变化数组方法(non-mutating method)，例如 `filter()`, `concat()` 和 `slice()`，这些方法都不会直接修改操作原始数组，而是**返回一个新数组**。当使用非变化数组方法时，可以直接将旧数组替换为新数组：

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

你可能会认为这将导致 Vue 丢弃现有 DOM 并重新渲染(re-render)整个列表 - 幸运的是，情况并非如此。Vue 实现了一些智能启发式方法(smart heuristic)来最大化 DOM 元素重用(reuse)，因此将一个数组替换为包含重叠对象的另一个数组，会是一种非常高效的操作。

### 注意事项(Caveats)

由于 JavaScript 的限制，Vue 无法检测到以下数组变动：

1. 当你使用索引直接设置一项时，例如 `vm.items[indexOfItem] = newValue`
2. 当你修改数组长度时，例如 `vm.items.length = newLength`

为了解决第 1 个问题，以下两种方式都可以实现与 `vm.items[indexOfItem] = newValue` 相同的效果，但是却可以通过响应式系统出发状态更新：

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
example1.items.splice(indexOfItem, 1, newValue)
```

为了解决第 2 个问题，你可以使用 `splice`：

``` js
example1.items.splice(newLength)
```

## 显示过滤/排序结果(Displaying Filtered/Sorted Results)

有时，我们想要显示一个数组过滤或排序后(filtered or sorted)的副本，而不是实际改变或重置原始数据。在这种情况下，可以创建一个返回过滤或排序数组的计算属性。

例如：

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

在计算属性不适用的情况下（例如，在嵌套的 `v-for` 循环内），可以使用一个 method 方法：

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

> 译注：

- 变化数组方法：会对原数组操作的数组方法，如 `pop()`, `shift()`, `unshift()`, `splice()`, `sort()` 和 `reverse()`。
- 非变化数组方法：不会对原数组操作、返回新数组的数组方法，如 `filter()`, `concat()` 和 `slice()`。
- 变异方法：Vue 将观察数组(observed array)的变化数组方法(mutation method)包裹起来，以便在调用这些方法时，也能够触发视图更新。

***

***

> 原文：https://vuejs.org/v2/guide/list.html

***
