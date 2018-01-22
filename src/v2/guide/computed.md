---
title: computed 属性和 watcher
type: guide
order: 5
---

## computed 属性

在模板中使用表达式是非常方便直接的，然而这只适用于简单的操作。在模板中放入太多的逻辑，会使模板过度膨胀和难以维护。例如：

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

在这个地方，模板不再简洁和如声明式直观。你必须仔细观察一段时间才能意识到，这里是想要显示变量 `message` 的翻转字符串。当你想要在模板中多次引用此处的翻转字符串时，就会更加难以处理。

这就是为什么对于所有复杂逻辑，你都应该使用 **computed 属性(computed property)**。

### 基础示例

``` html
<div id="example">
  <p>初始 message 是："{{ message }}"</p>
  <p>计算后的翻转 message 是："{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 一个 computed 属性的 getter 函数
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

结果：

{% raw %}
<div id="example" class="demo">
  <p>初始 message 是："{{ message }}"</p>
  <p>计算后的翻转 message 是："{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

这里我们声明了一个 computed 属性 `reversedMessage`。然后为 `vm.reversedMessage` 属性提供一个函数，作为它的 getter 函数：

``` js
console.log(vm.reversedMessage) // => 'olleH'
vm.message = 'Goodbye'
console.log(vm.reversedMessage) // => 'eybdooG'
```

你可以打开浏览器的控制台，然后如示例中操作 vm。会发现 `vm.reversedMessage` 的值总是依赖于 `vm.message` 的值。

你可以像绑定普通属性一样，将 computed 属性的数据，绑定(data-bind)到模板中的表达式上。Vue 能够意识到 `vm.reversedMessage` 依赖于 `vm.message`，也会在 `vm.message` 修改后，更新所有依赖于 `vm.reversedMessage` 的数据绑定。最恰到好处的部分是，我们是通过声明式来创建这种依赖关系：computed 属性的 getter 函数并无副作用(side effect)，因此也更加易于测试和理解。

### computed 缓存 vs method 方法

你可能已经注意到，我们可以在表达式中通过调用 method 方法的方式，也能够实现与 computed 属性相同的结果：

``` html
<p>翻转 message 是："{{ reverseMessage() }}"</p>
```

``` js
// 在组件中
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

这里不使用 computed 属性，而是在 methods 中定义一个相同的函数。对于最终结果，这两种方式确实恰好相同。然而，细微的差异之处在于，**computed 属性会基于它所依赖的数据进行缓存。**每个 computed 属性，只有在它所依赖的数据发生变化时，才会重新取值(re-evaluate)。这就意味着，只要 `message` 没有发生变化，多次访问 computed 属性 `reversedMessage`，将会立刻返回之前计算过的结果，而不必每次都重新执行函数。

这也同样意味着，如下的 computed 属性永远不会更新，因为 `Date.now()` 不是一个响应式的依赖数据：

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

相比之下，每当触发重新渲染(re-render)时，method 调用方式将**总是**再次执行函数。

为什么我们需要将依赖数据缓存起来？假设一种场景，我们有一个高性能开销(expensive)的 computed 属性 **A**，在 computed 属性的 getter 函数内部，需要遍历循环一个巨大数组，并进行大量计算。然后还有其他 computed 属性直接或间接依赖于 **A**。如果没有缓存，我们将不可避免地多次执行 **A** 的 getter 函数，这远多余实际需要执行的次数！然而在某些场景下，你可能不希望有缓存，请使用 method 方法替代。

### computed 属性和 watch 属性

Vue 其实还提供了一种更加通用的方式，来观察和响应 Vue 实例上的数据变化：**watch 属性**。`watch` 属性是很吸引人的使用方式，然而，当你有一些数据需要随着另外一些数据变化时，过度滥用 watch 属性会造成一些问题 - 尤其是那些具有 AngularJS 开发背景的开发人员。因此，更推荐的方式是，使用 computed 属性，而不是命令式(imperative)的 `watch` 回调函数。思考下面这个示例：

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

以上代码是命令式和重复的。对比 computed 属性实现的版本：

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

这样显得更优雅，对吗？

### computed 属性中设置 setter

computed 属性默认只设置 getter 函数，不过在需要时，还可以提供 setter 函数：

``` js
// ...
computed: {
  fullName: {
    // getter 函数
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter 函数
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

现在当你运行 `vm.fullName = 'John Doe'`，将会调用 setter，然后会对应更新 `vm.firstName` 和 `vm.lastName`。

## watcher

虽然在大多数情况下，更适合使用 computed 属性，然而有些时候，还是需要一个自定义 watcher。这就是为什么 Vue 要通过 `watch` 选项，来提供一个更加通用的响应数据变化的方式。当你需要在数据变化响应时，执行异步操作，或高性能消耗的操作，自定义 watcher 的方式就会很有帮助。

例如：

``` html
<div id="watch-example">
  <p>
    问一个答案是 yes/no 的问题：
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- 对于 ajax 库(ajax libraries)和通用工具方法的集合(collections of general-purpose utility methods)来说， -->
<!-- 由于已经存在大量与其相关的生态系统， -->
<!-- 因此 Vue 核心无需重新创造，以保持轻量的文件体积。 -->
<!-- 同时这也可以使你自由随意地选择自己最熟悉的。 -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: '你要先提出问题，我才能给你答案！'
  },
  watch: {
    // 只要 question 发生改变，此函数就会执行
    question: function (newQuestion, oldQuestion) {
      this.answer = '等待输入停止……'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce 是由 lodash 提供的函数，
    // 在运行特别消耗性能的操作时，
    // 可以使用 _.debounce 来限制频率。
    // 在下面这种场景中，我们需要限制访问 yesno.wtf/api 的频率，
    // 等到用户输入完毕之后，ajax 请求才会发出。
    // 想要了解更多关于 _.debounce 函数（以及与它类似的 _.throttle）的详细信息，
    // 请访问：https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        if (this.question.indexOf('？') === -1) {
          this.answer = '问题通常需要包含一个中文问号。;-)'
          return
        }
        this.answer = '思考中……'
        var vm = this
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = '错误！API 无法处理。' + error
          })
      },
      // 这是用户停止输入操作后所等待的毫秒数。
      // （译者注：500毫秒之内，用户继续输入，则重新计时）
      500
    )
  }
})
</script>
```

结果：

{% raw %}
<div id="watch-example" class="demo">
  <p>
    问一个答案是 yes/no 的问题：
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: '你要先提出问题，我才能给你答案！'
  },
  watch: {
    question: function (newQuestion, oldQuestion) {
      this.answer = '等待输入停止……'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('？') === -1) {
          vm.answer = '问题通常需要包含一个中文问号。;-)'
          return
        }
        vm.answer = '思考中……'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}

在这个场景中，使用 `watch` 选项，可以使我们执行一个限制执行频率的（访问一个 API 的）异步操作，并且不断地设置中间状态，直到我们获取到最终的 answer 数据之后，才真正执行异步操作。而 computed 属性无法实现。

除了 `watch` 选项之外，还可以使用命令式(imperative)的 [vm.$watch](../api/#vm-watch) API。

***

> 原文：https://vuejs.org/v2/guide/computed.html

***

