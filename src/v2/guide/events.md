---
title: 事件处理
type: guide
order: 9
---

## 监听事件

我们可以使用 `v-on` 指令监听 DOM 事件，并在事件被触发时执行一些 JavaScript 代码。

例如：

``` html
<div id="example-1">
  <button v-on:click="counter += 1">增加 1</button>
  <p>上面的按钮被点击了 {{ counter }} 次。</p>
</div>
```
``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

结果：

{% raw %}
<div id="example-1" class="demo">
  <button v-on:click="counter += 1">增加 1</button>
  <p>上面的按钮被点击了 {{ counter }} 次。</p>
</div>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
</script>
{% endraw %}

## 定义在 methods 对象中的事件处理器

由于许多事件处理器的逻辑很复杂，所以把 JavaScript 代码都保存在 `v-on` 属性的值中是不可行的做法。这就是为什么 `v-on` 还可以接收要调用的方法名。

示例：

``` html
<div id="example-2">
  <!-- `greet` 是在下面 methods 中定义的方法名 -->
  <button v-on:click="greet">Greet</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // 在 `methods` 对象中定义方法
  methods: {
    greet: function (event) {
      // methods 里的方法中的 `this` 指 Vue 实例
      alert('Hello ' + this.name + '!')
      // `event` 是原始 DOM 事件对象
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// 也可以在 JavaScript 中通过 Vue 实例直接调用方法
example2.greet() // => 'Hello Vue.js!'
```

结果：

{% raw %}
<div id="example-2" class="demo">
  <button v-on:click="greet">Greet</button>
</div>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
      alert('Hello ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
{% endraw %}

## 定义在行内的事件处理器

除了直接绑定到方法名，我们还可以在行内 JavaScript 语句中使用 methods 方法：

``` html
<div id="example-3">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
```
``` js
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

结果：
{% raw %}
<div id="example-3" class="demo">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
<script>
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
</script>
{% endraw %}

在行内语句的事件处理器中，有时我们也需要访问原始 DOM 事件对象。可以使用特殊的 `$event` 变量将它传递给一个方法：

``` html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // 现在，我们可以访问原始事件对象
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## 事件修饰符(Event Modifiers)

在事件处理程序中调用 `event.preventDefault()` 或 `event.stopPropagation()` 是非常常见的需求。尽管我们可以在 methods 中轻松实现这点，但更好的方式是：methods 只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。

为了解决这个问题， Vue.js 为 `v-on` 提供了**事件修饰符**。回想一下，修饰符是以点(.)开头的指令后缀来表示。

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

``` html
<!-- 停止点击事件冒泡 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重新载入页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以链式调用 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时，使用事件捕获模式 -->
<!-- 也就是说，内部元素触发的事件先在此处处理，然后才交给内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只有在 event.target 是元素自身时，才触发处理函数。 -->
<!-- 也就是说，event.target 是子元素时，不触发处理函数 -->
<div v-on:click.self="doThat">...</div>
```

<p class="tip">使用修饰符时的顺序会产生一些影响，因为相关的代码会以相同的顺序生成。所以，使用 `v-on:click.prevent.self` 会阻止**所有点击**，而 `v-on:click.self.prevent` 只阻止元素自身的点击。</p>

> 2.1.4+ 新增

``` html
<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>
```

和其他只能处理 DOM 事件的修饰符不同，`.once` 修饰符还可以用于处理[组件事件](components.html#使用-v-on-的自定义事件)。如果你还没有阅读过组件的相关内容，现在也无须担心。

> 2.3.0+ 新增

Vue 还提供了 `.passive `修饰符，对应 [`addEventListener` 的 `passive` 选项](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)。

``` html
<!-- 滚动事件的默认行为（滚动）将立即发生， -->
<!-- 而不是等待 `onScroll` 完成后才发生， -->
<!-- 以防在滚动事件的处理程序中含有 `event.preventDefault()` 调用 -->
<div v-on:scroll.passive="onScroll">...</div>
```

`.passive` 修饰符对于提高移动设备的性能尤其有用。

<p class="tip">不要将 `.passive` 和 `.prevent` 放在一起使用，因为 `.prevent` 将被忽略，并且浏览器可能会显示一条警告。记住，`.passive` 会向浏览器传达的意思是，你_并不_希望阻止事件的默认行为。</p>

## 按键修饰符(Key Modifiers)

在监听键盘事件时，我们经常需要查找常用按键对应的 code 值。Vue 可以在 `v-on` 上添加按键修饰符，用于监听按键事件：

``` html
<!-- 只在 `keyCode` 是 13 时，调用 `vm.submit()` -->
<input v-on:keyup.13="submit">
```

记住所有 `keyCode` 是非常麻烦的事，所以 Vue 提供一些最常用按键的别名：

``` html
<!-- 和上面的示例相同 -->
<input v-on:keyup.enter="submit">

<!-- 也可用于简写语法 -->
<input @keyup.enter="submit">
```

这里列出所有的按键修饰符别名：

- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

还可以[自定义按键修饰符别名](../api/#keyCodes)，通过全局 `config.keyCodes` 对象设置：

``` js
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

### 自动对应按键修饰符(Automatic Key Modifers)

> 2.5.0+ 新增

也可以直接使用 [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) 暴露出来的所有合法按键名作为修饰符，但是要将它们转换为串联式命名(kebab-case)：

``` html
<input @keyup.page-down="onPageDown">
```

在上面的示例中，只会在 `$event.key === 'PageDown'`时，调用处理函数。

<p class="tip">在 IE9 中，一些按键（`.esc` 和所有箭头按键）有着不一致的 `key` 值，如果你需要支持 IE9，它们的内置别名应该是首选。</p>

## 系统辅助按键(System Modifier Keys)

> 2.1.0+ 新增

仅在以下修饰符对应的按键被按下时，才会触发鼠标或键盘事件监听器：

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> 注意：在 Macintosh 键盘中，meta 对应是 command 键(⌘)。在 Windows 键盘中，meta 对应是 windows 键(⊞)。在 Sun Microsystems 键盘中，meta 对应是实心宝石键(◆)。在一些键盘中，特别是 MIT 和 Lisp 机键盘和后续键盘（例如 Knight 键盘、space-cadet 键盘）中，meta 对应是 “META” 键。在 Symbolics 键盘中，meta 对应是 “META” 或 “Meta” 键。

例如：

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">做一些操作</div>
```

<p class="tip">注意，在使用 `keyup` 事件时，辅助按键和常规按键之间的差异，在事件触发时，辅助按键必须是按下状态。也就是说，只有在按下 `ctrl` 键，同时释放一个按键时，才会触发 `keyup.ctrl` 事件。如果你单独释放 `ctrl` 键，则无法触发事件。如果你确实需要这样的行为，请使用 `keyCode` 替代 `ctrl`：`keyup.17`。</p>

### `.exact` 修饰符(.exact Modifier)

> 2.5.0+ 新增

`.exact` 修饰符可以控制触发事件所需的系统辅助按键的准确组合。

``` html
<!-- 如果 Alt 键或 Shift 键与  Ctrl 键同时按下，也会触发事件 -->
<button @click.ctrl="onClick">A</button>

<!-- 只在 Ctrl 按键按下，其他按键未按下时，触发事件 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 只在系统辅助按键按下时，触发事件 -->
<button @click.exact="onClick">A</button>
```

### 鼠标按键修饰符(Mouse Button Modifiers)

> 2.2.0+ 新增

- `.left`
- `.right`
- `.middle`

这些修饰符会限制处理函数，仅响应特定的鼠标按键触发的事件。

## 为什么监听器会放在 HTML 中？(Why Listeners in HTML?)

你可能会担心，所有这些事件监听方式违背了原先的“关注点分离(separation of concern)”原则。还请放心 - 因为所有 Vue 事件处理器函数和表达式，都严格绑定在处理当前视图(view)的 ViewModel 上，所以不会造成任何维护上的困难。实际上，使用 `v-on` 有几个好处：

1. 通过浏览 HTML 模板，就能很方便地找到在 JavaScript 代码里对应的处理函数。

2. 由于无须在 JavaScript 里手动绑定事件，你的 ViewModel 代码可以是非常纯粹的逻辑，并且和 DOM 完全解耦，更易于测试。

3. 当一个 ViewModel 被销毁时，所有的事件监听器都会被自动删除。你无须担心如何自己清理它们。

***

> 原文：https://vuejs.org/v2/guide/events.html

***
