---
title: 过滤器
type: guide
order: 305
---

在 Vue.js 中，可以定义过滤器(filter)，常用于格式化文本。过滤器可以在两种场景中使用：**双花括号插值(mustache interpolation)和 `v-bind` 表达式（后者在 2.1.0+ 版本支持）**。过滤器应该追加到 JavaScript 表达式的末尾，以“管道符号(pipe symbol)”表示：

``` html
<!-- in mustaches -->
{{ message | capitalize }}

<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

你可以在组件的选项中定义局部过滤器：

``` js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

或者在创建 Vue 示例之前，定义一个全局的过滤器：

``` js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

以下这个示例，我们将使用 `capitalize` 过滤器：

{% raw %}
<div id="example_1" class="demo">
  <input type="text" v-model="message">
  <p>{{ message | capitalize }}</p>
</div>
<script>
  new Vue({
    el: '#example_1',
    data: function () {
      return {
        message: 'john'
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  })
</script>
{% endraw %}

过滤器函数总是接收表达式的值（值的结果是，过滤器链中的上一个过滤器返回的值），作为第一个参数。在上面这个例子中 `capitalize` 过滤器函数，将 `message` 的值作为参数接收。

可以如下链式调用过滤器：

``` html
{{ message | filterA | filterB }}
```

在这个例子中，`filterA` 被定义为接收单个参数的过滤器函数，表达式 `message` 的值将作为参数传入到函数中，然后继续调用同样被定义为接收单个参数的过滤器函数 `filterB`，将 `filterA` 的结果传递到 `filterB` 中。

由于过滤器函数是 JavaScript 函数，也因此可以接收多个参数：

``` html
{{ message | filterA('arg1', arg2) }}
```

这里，`filterA` 被定义为接收三个参数的过滤器函数。其中 `message` 的值作为第一个参数，普通字符串 `'arg1'` 作为第二个参数，表达式 `arg2` 取值后的值作为第三个参数。

***

> 原文：https://vuejs.org/v2/guide/filters.html

***
