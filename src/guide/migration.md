---
title: 从 Vue1.x 迁移
type: guide
order: 24
---

## FAQ

> 哇，非常长的一页！是否意味着 Vue2.0 已经完全不同了呢，是否需要从头学起呢，Vue1.0 的项目是不是没法迁移了？

非常开心地告诉你，并不是！ 几乎90%的 API 和核心概念都没有变。因为本节包含了很多详尽的阐述以及许多迁移的例子，所以显得有点长。不用担心，__你也不必从头到尾把本节读一遍！__

> 怎么开始做项目迁移？

1. 就从运行 [migration helper](https://github.com/vuejs/vue-migration-helper) 这个工具开始吧。我们非常谨慎地把一个高级 Vue 开发工具简化并重新编译成了一个命令行工具。当这个工具发现了一个弃用的用法之后，就会给出通知和建议，并附上关于详细信息的链接。

2. 然后，看看侧边栏给出的关于这一页的内容。如果你发现有的地方有影响，而该工具没有给出提示的，请检查并解决一下该项。

3. 如果有测试的话，测试一边看看还有什么问题。如果没有测试的话，打开 app，随机翻一下，看一下有什么报错或者警告信息。

4. 至此，你的 app 基本已经迁移完毕了。如果你有更多想了解的，可以阅读一下本节剩下的部分。

> 从1.0 迁移到2.0要花多长时间？

取决于以下几个方面：

- 要迁移的 app 的规模。（小到中型的基本上一天内就可以搞定）

- 为了耍耍 Vue2.0 的新功能分心了多少次。 😉 &nbsp;不是说你们，我们构建 Vue2.0 的时候经常发生这种事。

- 使用了哪些弃用的功能。基本上大部分弃用的功能可以通过 find-and-replace 来实现升级，但有一些还是要花点时间。如果你没有遵循最佳实践，那么 Vue2.0 会强迫你去遵循。这有利于项目的长期运行，但是也意味着重构（也许有些需要重构的东西已经过时）。

> 迁移到 Vue 2 ，我也需要更新 Vuex 和 Vue-Router ?

只有 Vue-Router 2 是可编译的，可以遵循  [Vue-Router 迁移路径](migration-vue-router.html) 来处理。幸运地是， 大多数应用不含有许多路由代码，所以迁移不用超过一小时。

对于 Vuex ， 甚至 0.8 版本和 Vue 2 一起都是可以编译的，所以不必强制更新。 促使你立即更新的理由是 Vuex 2 有更先进的功能，比如模块和减少的样板文件。

## 模板

### 片段实例 <sup>弃用</sup>

每个组件有且仅有一个根节点。不再支持片段实例，如果你有这样的模板：

``` html
<p>foo</p>
<p>bar</p>
```

最好把它包裹到一个简单的容器里面去：

``` html
<div>
  <p>foo</p>
  <p>bar</p>
</div>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>升级后，为你的 app 运行端对端测试 ，并关注关于多个根节点的<strong>console warnings</strong>。
</div>
{% endraw %}

## 生命周期钩子

### `beforeCompile` <sup>弃用</sup>

用 `created` 钩子来代替。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到所有使用这个钩子的实例</p>
</div>
{% endraw %}

### `compiled` <sup>弃用</sup>

用 `mounted` 钩子来代替。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到所有使用这个钩子的实例</p>
</div>
{% endraw %}

### `attached` <sup>弃用</sup>

依赖其它钩子使用自定义的 dom 内部方法，例如：

``` js
attached: function () {
  doSomething()
}
```

现在可以这样做：

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到所有使用这个钩子的实例</p>
</div>
{% endraw %}

### `detached` <sup>弃用</sup>

用自定义的 dom 内部的其他钩子代替，例如：

``` js
detached: function () {
  doSomething()
}
```

可以用以下方式代替：

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到所有使用这个钩子的实例</p>
</div>
{% endraw %}

### `init` <sup>弃用</sup>

用新的 `beforeCreate` 钩子代替，他们本质上是一样的。为了与其他生命周期的钩子命名保持一致性，所以重新命名了这个钩子。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到所有使用这个钩子的实例</p>
</div>
{% endraw %}

### `ready` <sup>弃用</sup>

使用新的 `mounted` 钩子代替，应该注意的是，通过使用 `mounted` 钩子，并不能保证该实例已经插入文档。所以还应该在钩子函数中包含 `Vue.nextTick`/`vm.$nextTick` 例如：

``` js
mounted: function () {
  this.$nextTick(function () {
    // 保证 this.$el 已经插入文档
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到所有使用这个钩子的实例</p>
</div>
{% endraw %}

## `v-for`

### `v-for` 数组参数的顺序

当含有 `index` 时，以前传递的参数顺序是：`(index, value)`。现在变成了：`(value, index)` ，这样可以与js的新数组方法：`forEach`，`map` 保持一致。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 来找到使用弃用参数顺序的实例。注意，该工具将不会标记以 <code>position</code> 或者 <code>num</code> 来命名 index 参数。</p>
</div>
{% endraw %}

### `v-for` 对象参数的顺序

当包含 `key` 时，对象的参数顺序是 `(key, value)`。现在改为了 `(value, key)`，这样可以和通用的对象迭代器（比如 lodash 的迭代器）保持一致。

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 来找到使用弃用参数顺序的实例。注意，该工具将不会标记以 <code>name</code> 或者 <code>property</code> 来命名 key 参数。</p>
</div>
{% endraw %}

### `$index` and `$key` <sup>弃用</sup>

隐式申明的 `$index` 的 `$key` 两个变量在新版里面已经弃用了，取代的是在 `v-for` 中显式地申明。这可以使无经验的 Vue 开发者更好地理解代码，同样也可以使得在处理嵌套循环时更加清晰。
{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 来找到使用弃用变量的实例。如果有些没有找到，也可以参考<strong>控制台警告信息</strong> 比如 <code>Uncaught ReferenceError: $index is not defined</code></p>
</div>
{% endraw %}

### `track-by` <sup>弃用</sup>

`track-by` 被 `key`取代，和其他参数一样，如果没有 `v-bind`或者`:` 前缀，它将被作为一个字符串。大多数情况下， 我们想要能够动态绑定完整的表达式，而不是一个 key。例如：

``` html
<div v-for="item in items" track-by="id">
```

现在应该写成：

``` html
<div v-for="item in items" v-bind:key="item.id">
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到含 <code>track-by</code>的实例。</p>
</div>
{% endraw %}

### `v-for` 排序值

显然 `v-for="number in 10"` 将使得 `number` 从0到9迭代，现在变成了从1到10.

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>以正则 <code>/\w+ in \d+/</code>搜索整个代码，当出现在 <code>v-for</code>里面时，检查一下，对你是否有影响。</p>
</div>
{% endraw %}

## Props

### `coerce` Prop的参数 <sup>弃用</sup>

如果需要检查 prop 的值，创建一个内部的 computed 值，而不再在 props 内部去定义，例如：

``` js
props: {
  username: {
    type: String,
    coerce: function (value) {
      return value
        .toLowerCase()
        .replace(/\s+/, '-')
    }
  }
}
```

现在应该写为：

``` js
props: {
  username: String,
},
computed: {
  normalizedUsername: function () {
    return this.username
      .toLowerCase()
      .replace(/\s+/, '-')
  }
}
```

这样有一些好处：

- 你可以对保持原始 prop 值的操作权限。
- 通过给予验证后的值一个不同的命名，强制开发者使用显式申明。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找出包含 <code>coerce</code> 选项的实例。</p>
</div>
{% endraw %}

### `twoWay` Prop 的参数 <sup>弃用</sup>

Props 现在只能单项传递。为了对父组件产生反向影响，子组件需要显式地传递一个事件而不是依赖于隐式地双向绑定。详见：

- [自定义组件事件](components.html#Custom-Events)
- [自定义输入组件](components.html#Form-Input-Components-using-Custom-Events) (使用组件事件)
- [全局状态管理](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>工具，找出含有 <code>twoWay</code> 参数的实例。</p>
</div>
{% endraw %}

### `v-bind` 的 `.once`和`.sync` 修饰符 <sup>弃用</sup>

Props 现在只能单向传递。为了对父组件产生反向影响，子组件需要显式地传递一个事件而不是依赖于隐式地双向绑定。详见：

- [自定义组件事件](components.html#Custom-Events)
- [自定义输入组件](components.html#Form-Input-Components-using-Custom-Events) (使用组件事件)
- [全局状态管理](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到使用 <code>.once</code> 和 <code>.sync</code> 修饰符的实例。</p>
</div>
{% endraw %}

### 修改 Props <sup>弃用</sup>

组件内修改 prop 是反模式（不推荐的）的。比如，先声明一个 prop ，然后在组件中通过 `this.myProp = 'someOtherValue'` 改变 prop 的值。根据渲染机制，当父组件重新渲染时，子组件的内部 prop 值也将被覆盖。

大多数情况下，改变 prop 值可以用以下选项代替：

- 通过 data 属性，用prop去设置一个data属性的默认值。
- 通过 computed 属性。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端对端测试，查看关于 prop 修改的<strong>控制台警告信息</strong>。</p>
</div>
{% endraw %}

### 根实例的 Props <sup>弃用</sup>

对于一个根实例来说 (比如：用 `new Vue({ ... })` 创建的实例)，只能用 `propsData` 而不是 `props`.

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端对端测试，将会弹出 <strong>failed tests</strong> 来通知你使用 <code>props</code> 的根实例已经失效。</p>
</div>
{% endraw %}

## Built-In 指令

### `v-bind` 真/假值

在2.0中使用 `v-bind` 时, 只有 `null`, `undefined` , 和 `false` 被看作是假。这意味着，`0` 和空字符串将被作为真值渲染。比如 `v-bind:draggable="''"` 将被渲染为 `draggable="true"`。

对于枚举属性，除了以上假值之外，字符串 `"false"` 也会被渲染为 `attr="false"`。

<p class="tip">注意，对于其它钩子 (如 `v-if` 和 `v-show`)， 他们依然遵循 js 对真假值判断的一般规则。</p>

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端到端测试，如果你app的任何部分有可能被这个升级影响到，将会弹出<strong>failed tests</strong></p>
</div>
{% endraw %}

### 用 `v-on` 监听原生事件

  现在在组件上使用 `v-on` 只会监听自定义事件（组件用 `$emit` 触发的事件）。如果要监听根元素的原生事件，可以使用 `.native` 修饰符，比如：

``` html
<my-component v-on:click.native="doSomething"></my-component>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端对端测试，如果你app的任何部分有可能被这个升级影响到，将会弹出<strong>failed tests</strong> </p>
</div>
{% endraw %}

### 带有 `debounce` 的 `v-model`<sup>弃用</sup>

Debouncing 曾经被用来控制 Ajax 请求及其它高耗任务的频率。 Vue 中`v-model`的 `debounce` 属性参数使得在一些简单情况下非常容易实现这种控制。但实际上，这是控制了 __状态更新__ 的频率，而不是控制高耗时任务本身。这是个微小的差别，但是会随着应用增长而显现出局限性。

例如在设计一个搜索提示时的局限性：

{% raw %}
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo" class="demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
<script>
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
</script>
{% endraw %}

使用 `debounce` 参数，便无法观察 "Typing" 的状态。因为无法对输入状态进行实时检测。然而，通过将 `debounce` 与 Vue 解耦，可以仅仅只延迟我们想要控制的操作，从而避开这些局限性：

``` html
<!--
通过使用lodash或者其它库的debounce函数，
我们相信 debounce 实现是一流的，
并且可以随处使用它，不仅仅是在模板中。
-->
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
```

``` js
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    // 这是 debounce 实现的地方。
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
```

这种方式的另外一个优点是：当包裹函数执行时间与延时时间相当时，将会等待较长时间。比如，当给出搜索建议时，要等待用户输入停止一段时间后才给出建议，这个体验非常差。其实，这时候更适合用 __throttling__ 函数。因为现在你可以自由的使用类似 lodash 之类的库，所以很快就可以用 throttling 重构项目。

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找出使用 <code>debounce</code> 参数的 实例。</p>
</div>
{% endraw %}

### 使用 `lazy` 或者 `number` 参数的 `v-model` 。 <sup>弃用</sup>

`lazy` 和 `number` 参数现在以修饰符的形式使用，这样看起来更加清晰，而不是这样：

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

现在写成这样：

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>工具找到这些弃用参数。</p>
</div>
{% endraw %}

### 使用内联 `value`的`v-model`  <sup>弃用</sup>

`v-model` 不再以内联 `value` 方式初始化的初值了，显然他将以实例的 data 相应的属性作为真正的初值。

这意味着以下元素：

``` html
<input v-model="text" value="foo">
```

在data选项中有下面写法的：

``` js
data: {
  text: 'bar'
}
```

将渲染 model 为 'bar' 而不是 'foo' 。同样，对 `<textarea>` 已有的值来说：

``` html
<textarea v-model="text">
  hello world
</textarea>
```

必须保证 `text` 初值为 "hello world"

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>升级后运行端对端测试，注意关于<code>v-model</code>内联参数的 <strong>console warnings</strong></p>
</div>
{% endraw %}

### `v-model` with `v-for` Iterated Primitive Values <sup>弃用</sup>

像这样的写法将失效：

``` html
<input v-for="str in strings" v-model="str">
```

因为 `<input>` 将被编译成类似下面的 js 代码：

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

这样，`v-model` 的双向绑定在这里就失效了。把 `str` 赋值给迭代器里的另一个值也没有用，因为它仅仅是函数内部的一个变量。

替代方案是，你可以使用对象数组，这样`v-model` 就可以同步更新对象里面的字段了，例如：

``` html
<input v-for="obj in objects" v-model="obj.str">
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行测试，如果你的 app 有地方被这个更新影响到的话将会弹出<strong>failed tests</strong>提示。</p>
</div>
{% endraw %}

### 带有 `!important` 的`v-bind:style`  <sup>弃用</sup>

这样写将失效：

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hello</p>
```

如果确实需要覆盖其它的 `!important`，最好用字符串形式去写：

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hello</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper"> 迁移帮助工具。</a>找到含有 <code>!important</code> 的style绑定对象。</p>
</div>
{% endraw %}

### `v-el` 和`v-ref` <sup>弃用</sup>

简单起见， `v-el` 和 `v-ref` 合并为一个 `ref` 属性了，可以在组件实例中通过 `$refs` 来调用。这意味着 `v-el:my-element` 将写成这样： `ref="myElement"`， `v-ref:my-component` 变成了这样： `ref="myComponent"`。绑定在一般元素上时，`ref` 指DOM元素，绑定在组件上时，`ref` 为一组件实例。
因为 `v-ref` 不再是一个指令了而是一个特殊的属性，它也可以被动态定义了。这样在和`v-for` 结合的时候是很有用的：

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

以前 `v-el`/`v-ref` 和 `v-for` 一起使用将产生一个DOM数组或者组件数组，因为没法给每个元素一个特定名字。现在你还仍然可以这样做，给每个元素一个同样的`ref`：

``` html
<p v-for="item in items" ref="items"></p>
```

和 1.x 中不同， `$refs` 不是响应的，因为它们在渲染过程中注册/更新。只有监听变化并重复渲染才能使它们响应。

另一方面，设计`$refs`主要是提供给 js 程序访问的，并不建议在模板中过度依赖使用它。因为这意味着在实例之外去访问实例状态，违背了 Vue 数据驱动的思想。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找出实例中的 <code>v-el</code> 和 <code>v-ref</code>.</p>
</div>
{% endraw %}

### `v-show`后面使用`v-else` <sup>弃用</sup>

`v-else` 不能再跟在 `v-show`后面使用。请在`v-if`的否定分支中使用`v-show`来代替。例如：

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">Not foo, but bar</p>
```

现在应该写出这样：

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">Not foo, but bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找出实例中存在的 <code>v-else</code> 以及 <code>v-show</code>。</p>
</div>
{% endraw %}

## 自定义指令

在新版中，指令的使用范围已经大大减小了：现在指令仅仅被用于低级的 DOM 操作。大多数情况下，最好是把模板作为代码复用的抽象层。

显要的改变有如下几点：

- 指令不再拥有实例。意思是，在指令的钩子函数中不再拥有实例的 `this` 。替代的是，你可以在参数中接受你需要的任何数据。如果确实需要，可以通过 `el` 来访问实例。
- 类似 `acceptStatement` ，`deep` ， `priority` 等都已被弃用。为了替换`双向`指令，见 [示例](#Two-Way-Filters-deprecated)。
- 现在有些钩子的意义和以前不一样了，并且多了两个钩子函数。

幸运的是，新钩子更加简单，更加容易掌握。详见 [自定义指令指南](custom-directive.html)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到定义指令的地方。在 helper 工具会把这些地方标记出来，因为很有可能这些地方需要重构。</p>
</div>
{% endraw %}

### 指令 `.literal` 修饰符 <sup>弃用</sup>

`.literal` 修饰符已经被移除，为了获取一样的功能，可以简单地提供字符串修饰符作为值。

示例，如下更改：

``` js
<p v-my-directive.literal="foo bar baz"></p>
```

to just:

``` html
<p v-my-directive="'foo bar baz'"></p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到实例中使用 `.literal` 修饰符的地方。</p>
</div>
{% endraw %}

## 过渡

### `transition` 参数 <sup>弃用</sup>

Vue 的过渡系统有了彻底的改变，现在通过使用 `<transition>` 和 `<transition-group>` 来包裹元素实现过渡效果，而不再使用 `transition` 属性。详见 [Transitions guide](transitions.html)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到使用 <code>transition</code> 属性的地方。</p>
</div>
{% endraw %}

### 可复用的过渡 `Vue.transition` <sup>弃用</sup>

在新的过渡系统中，可以[通过模板复用过渡效果](http://rc.vuejs.org/guide/transitions.html#Reusable-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到使用 <code>transition</code> 属性的地方。</p>
</div>
{% endraw %}

### 过渡的 `stagger` 参数 <sup>弃用</sup>

如果希望在列表渲染中使用渐近过渡，可以通过设置元素的 `data-index` （或类似属性）来控制时间。 请参考[这个例子](transitions.html#Staggering-List-Transitions)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到使用 <code>transition</code> 属性的地方。升级期间，你可以“过渡”到新的过渡策略。</p>
</div>
{% endraw %}

## 事件

### `events` 选项 <sup>弃用</sup>

`events` 选项被弃用。事件处理器现在在 `created` 钩子中被注册。参考详细示例 [`$dispatch` and `$broadcast` 迁移指南](#dispatch-and-broadcast-deprecated)

### `Vue.directive('on').keyCodes` <sup>弃用</sup>

新的简明配置 `keyCodes` 的方式是通过 `Vue.config.keyCodes`例如：

``` js
// v-on:keyup.f1 不可用
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到过时的 <code>keyCode</code> 配置</p>
</div>
{% endraw %}

### `$dispatch` 和 `$broadcast` <sup>弃用</sup>

`$dispatch` 和 `$broadcast` 已经被弃用。请使用更多简明清晰的组件间通信和更好的状态管理方案，如：[Vuex](https://github.com/vuejs/vuex).

因为基于组件树结构的事件流方式实在是让人难以理解，并且在组件结构扩展的过程中会变得越来越脆弱。这种事件方式确实不太好，我们也不希望在以后让开发者们太痛苦。并且`$dispatch` 和 `$broadcast` 也没有解决兄弟组件间的通信问题。

对于`$dispatch` 和 `$broadcast`最简单的升级方式就是：通过使用事件中心，允许组件自由交流，无论组件处于组件树的哪一层。由于Vue 实例实现了一个事件分发接口，你可以通过实例化一个空的Vue实例来实现这个目的。

One of the most common uses for these methods is to communicate between a parent and its direct children. In these cases, you can actually [listen to an `$emit` from a child with `v-on`](http://vuejs.org/guide/components.html#Form-Input-Components-using-Custom-Events). This allows you to keep the convenience of events with added explicitness.

However, when communicating between distant descendants/ancestors, `$emit` won't help you. Instead, the simplest possible upgrade would be to use a centralized event hub. This has the added benefit of allowing you to communicate between components no matter where they are in the component tree - even between siblings! Because Vue instances implement an event emitter interface, you can actually use an empty Vue instance for this purpose.

比如，假设我们有个 todo 的应用结构如下：

```
Todos
|-- NewTodoInput
|-- Todo
    |-- DeleteTodoButton
```

可以通过单独的事件中心管理组件间的通信：

``` js
// 将在各处使用该事件中心
// 组件通过它来通信
var eventHub = new Vue()
```

然后再组件中，可以使用 `$emit`, `$on`, `$off` 分别来分发、监听、取消监听事件：

``` js
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
```

``` js
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```

``` js
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// 最好在组件销毁前
// 清除事件监听
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

在简单的情况下这样做可以代替 `$dispatch` 和 `$broadcast`，但是对于大多数复杂情况，更推荐使用一个专用的状态管理层如：[Vuex](https://github.com/vuejs/vuex).

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找出使用 <code>$dispatch</code> 和 <code>$broadcast</code>的实例。</p>
</div>
{% endraw %}

## 过滤器

### 插入文本之外的过滤器 <sup>弃用</sup>

现在过滤器只能用在插入文本中 (`{% raw %}{{ }}{% endraw %}` tags)。我们发现在指令（如：`v-model`， `v-on`等）中使用过滤器使事情变得更复杂。像`v-for` 这样的列表过滤器最好把处理逻辑作为一个计算属性放在js里面，这样就可以在整个模板中复用。

总之，能在原生js中实现的东西，我们尽量避免引入一个新的符号去重复处理同样的问题。下面是如何替换 Vue 内置过滤器：

#### 替换 `debounce` 过滤器

不再这样写

``` html
<input v-on:keyup="doStuff | debounce 500">
```

``` js
methods: {
  doStuff: function () {
    // ...
  }
}
```

请使用 [lodash's `debounce`](https://lodash.com/docs/4.15.0#debounce) (也有可能是 [`throttle`](https://lodash.com/docs/4.15.0#throttle)) 来直接控制高耗任务。可以这样来实现上面的功能：

``` html
<input v-on:keyup="doStuff">
```

``` js
methods: {
  doStuff: _.debounce(function () {
    // ...
  }, 500)
}
```

这种写法的更多优点详见： [the example here with `v-model`](#v-model-with-debounce-deprecated).

#### 替换 `limitBy` 过滤器

不再这样写：

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

在 computed 属性中使用js内置方法： [`.slice` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples)：

``` html
<p v-for="item in filteredItems">{{ item }}</p>
```

``` js
computed: {
  filteredItems: function () {
    return this.items.slice(0, 10)
  }
}
```

#### 替换 `filterBy` 过滤器

不再这样写：

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

在 computed 属性中使用js内置方法 [`.filter` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples)：

``` html
<p v-for="user in filteredUsers">{{ user.name }}</p>
```

``` js
computed: {
  filteredUsers: function () {
    return this.users.filter(function (user) {
      return user.name.indexOf(this.searchQuery)
    })
  }
}
```

js原生的 `.filter` 同样能实现很多复杂的过滤器操作，因为可以在计算 computed 属性中使用所有js方法。比如，想要通过匹配用户名字和电子邮箱地址（不区分大小写）找到用户：

``` js
this.users.filter(function (user) {
  var searchRegex = new RegExp(this.searchQuery, 'i')
  return user.isActive && (
    searchRegex.test(user.name) ||
    searchRegex.test(user.email)
  )
})
```

#### 替换 `orderBy` 过滤器

不这样写：

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

而是在 computed 属性中使用 [lodash's `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (or possibly [`sortBy`](https://lodash.com/docs/4.15.0#sortBy))：

``` html
<p v-for="user in orderedUsers">{{ user.name }}</p>
```

``` js
computed: {
  orderedUsers: function () {
    return _.orderBy(this.users, 'name')
  }
}
```

甚至可以字段排序：

``` js
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到指令中使用的过滤器。如果有些没找到，看看<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

### 过滤器参数符号

现在过滤器参数形式可以更好地与js函数调用方式一致，因此不用再用空格分隔参数：

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

现在用圆括号括起来并用逗号分隔：

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到老式的调用符号，如果有遗漏，请看<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

### 内置文本过滤器 <sup>弃用</sup>

尽管插入文本内部的过滤器依然有效，但是所有内置过滤器已经移除了。取代的是，推荐在每个区域使用更专业的库来解决。(比如用 [`date-fns`](https://date-fns.org/) 来格式化日期，用 [`accounting`](http://openexchangerates.github.io/accounting.js/) 来格式化货币).

对于每个内置过滤器，我们大概总结了下该怎么替换。代码示例可能写在自定义 helper 函数，方法或计算属性中。

#### 替换 `json` 过滤器

不用一个个改，因为Vue已经帮你自动格式化好了，无论是字符串，数字还是数组，对象。如果想用js的 `JSON.stringify` 功能去实现，你也可以把它写在方法或者计算属性里面。

#### 替换 `capitalize` 过滤器

``` js
text[0].toUpperCase() + text.slice(1)
```

#### 替换 `uppercase` 过滤器

``` js
text.toUpperCase()
```

#### 替换 `lowercase` 过滤器

``` js
text.toLowerCase()
```

#### 替换 `pluralize` 过滤器

NPM 上的 [pluralize](https://www.npmjs.com/package/pluralize) 库可以很好的实现这个功能。如果仅仅想将特定的词格式化成复数形式或者想给特定的值（'0'）指定特定的输出，也可以很容易地自定义复数格式化过滤器：

``` js
function pluralizeKnife (count) {
  if (count === 0) {
    return 'no knives'
  } else if (count === 1) {
    return '1 knife'
  } else {
    return count + 'knives'
  }
}
```

#### Replacing the `currency` Filter

对于简单的问题,可以这样做：

``` js
'$' + price.toFixed(2)
```

大多数情况下，仍然会有奇怪的现象(比如 `0.035.toFixed(2)` 向上舍入得到 `0.4`,但是 `0.045` 向下舍入却也得到 `0.4`)。解决这些问题可以使用 [`accounting`](http://openexchangerates.github.io/accounting.js/) 库来实现更多货币格式化。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到舍弃的过滤器。如果有些遗漏，请参考<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

### Two-Way Filters <sup>deprecated</sup>

Some users have enjoyed using two-way filters with `v-model` to create interesting inputs with very little code. While _seemingly_ simple however, two-way filters can also hide a great deal of complexity - and even encourage poor UX by delaying state updates. Instead, components wrapping an input are recommended as a more explicit and feature-rich way of creating custom inputs.

As an example, we'll now walk the migration of a two-way currency filter:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

It mostly works well, but the delayed state updates can cause strange behavior. For example, click on the `Result` tab and try entering `9.999` into one of those inputs. When the input loses focus, its value will update to `$10.00`. When looking at the calculated total however, you'll see that `9.999` is what's stored in our data. The version of reality that the user sees is out of sync!

To start transitioning towards a more robust solution using Vue 2.0, let's first wrap this filter in a new `<currency-input>` component:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This allows us add behavior that a filter alone couldn't encapsulate, such as selecting the content of an input on focus. Now the next step will be to extract the business logic from the filter. Below, we pull everything out into an external [`currencyValidator` object](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e):

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This increased modularity not only makes it easier to migrate to Vue 2, but also allows currency parsing and formatting to be:

- unit tested in isolation from your Vue code
- used by other parts of your application, such as to validate the payload to an API endpoint

Having this validator extracted out, we've also more comfortably built it up into a more robust solution. The state quirks have been eliminated and it's actually impossible for users to enter anything wrong, similar to what the browser's native number input tries to do.

We're still limited however, by filters and by Vue 1.0 in general, so let's complete the upgrade to Vue 2.0:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You may notice that:

- Every aspect of our input is more explicit, using lifecycle hooks and DOM events in place of the hidden behavior of two-way filters.
- We can now use `v-model` directly on our custom inputs, which is not only more consistent with normal inputs, but also means our component is Vuex-friendly.
- Since we're no longer using filter options that require a value to be returned, our currency work could actually be done asynchronously. That means if we had a lot of apps that had to work with currencies, we could easily refactor this logic into a shared microservice.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters used in directives like <code>v-model</code>. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Slots

### 重名的 Slots <sup>弃用</sup>

同一模板中的重名 `<slot>` 已经弃用。当一个 slot 已经被渲染过了，那么就不能在同一模板其它地方被再次渲染了。如果要在不同位置渲染同一内容，可一用prop来传递。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>更新后运行测试，查看 <strong>控制台警告信息</strong> 关于重名slots的提示 <code>v-model</code>。</p>
</div>
{% endraw %}

### `slot` 样式参数 <sup>弃用</sup>

通过具名 `<slot>` 插入的片段不再保持 `slot` 的参数。请用一个包裹元素来控制样式。或者用更高级方法：通过编程方式修改内容 ：[render functions](render-function.html).

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到选择slots标签CSS选择器(例如： <code>[slot="my-slot-name"]</code>).</p>
</div>
{% endraw %}

## 特殊属性

### `keep-alive` 属性 <sup>弃用</sup>

`keep-alive` 不再是一个特殊属性而是一个包裹组件，类似于  `<transition>`比如：

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

这样可以在含多种状态子组件中使用 `<keep-alive>` ：

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">当 `<keep-alive>`含有不同子组件时，应该分别影响到每一个子组件。不仅是第一个而是所有的子组件都将被忽略。</p>

和 `<transition>`一起使用时，确保把内容包裹在内：

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到<code>keep-alive</code> 属性。</p>
</div>
{% endraw %}

## 计算插值//todaymark

### 属性内部的计算插值 <sup>弃用</sup>

属性内部的计算插值已经不能再使用了：

``` html
<button class="btn btn-{{ size }}"></button>
```

应该写成行内表达式：

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

或者计算属性：

``` html
<button v-bind:class="buttonClasses"></button>
```

``` js
computed: {
  buttonClasses: function () {
    return 'btn btn-' + size
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到属性内部的计算插值</p>
</div>
{% endraw %}

### HTML 计算插值 <sup>deprecated</sup>

HTML 的计算插值 (`{% raw %}{{{ foo }}}{% endraw %}`) 已经弃用，取代的是 [`v-html` 指令](/api/#v-html).

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到 HTML 计算插值。</p>
</div>
{% endraw %}

### 单次绑定<sup>弃用</sup>

单次绑定 (`{% raw %}{{* foo }}{% endraw %}`) 已经弃用取代的是 [`v-once` directive](/api/#v-once).

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>工具找到单次绑定使用位置。</p>
</div>
{% endraw %}

## 响应

### `vm.$watch`

通过 `vm.$watch`创建的观察器现在将在组件渲染时被激活。这样可以让你在组件渲染前更新状态，不用做不必要的更新。比如可以通过观察组件的prop变化来更新组件本身的值。

如果以前通过 `vm.$watch` 在组件更新后与 DOM 交互，现在就可以通过`updated`生命周期钩子来做这些。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行测试，如果有依赖于老方法的观察器将弹出 <strong>failed tests</strong>。</p>
</div>
{% endraw %}

### `vm.$set`

曾经的 `vm.$set` 方法已经弃用，现在这样写： [`Vue.set`](/api/#Vue-set).

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到过时的用法</p>
</div>
{% endraw %}

### `vm.$delete`

曾经的 `vm.$delete` 方法已经弃用，现在这样写： [`Vue.delete`](/api/#Vue-delete)

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到过时的用法</p>
</div>
{% endraw %}

### `Array.prototype.$set`  <sup>弃用</sup>

用 Vue.set 代替

(console error, migration helper)

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到数组上的<code>.$set</code>。如有遗漏请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>弃用</sup>

用 `Array.prototype.splice` 代替，例如：

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

或者更好的方法，直接给除去的方法一个index参数：

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到数组上的<code>.$remove</code>。如有遗漏请参考<strong>控制台错误信息</strong></p>
</div>
{% endraw %}

### Vue实例上的`Vue.set` 和 `Vue.delete`<sup>弃用</sup>

Vue.set 和 Vue.delete在实例上将不再起作用。现在都强制在实例的data选项中声明所有顶级响应值。如果删除实例属性或实例`$data`上的某个值，直接将它设置为null即可。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到实例中的 <code>Vue.set</code> 或 <code>Vue.delete</code> 。如有遗漏请参考<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

### 替换 `vm.$data` <sup>弃用</sup>

现在禁止替换实例的 $data。这样防止了响应系统的一些极端情况并且让组件状态更加可控可预测（特别是对于存在类型检查的系统）。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到覆盖 <code>vm.$data</code>的位置。如有遗漏请参考<strong>控制台警告信息</strong>。</p>
</div>
{% endraw %}

### `vm.$get` <sup>弃用</sup>

可以直接取回响应数据。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>工具找到<code>vm.$get</code>。如有遗漏请参考 <strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

## 围绕 DOM 的实例方法

### `vm.$appendTo` <sup>弃用</sup>

使用 DOM 原生方法:

``` js
myElement.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到 <code>vm.$appendTo</code>。如果有遗漏可以参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `vm.$before` <sup>弃用</sup>

使用 DOM 原生方法：

``` js
myElement.parentNode.insertBefore(vm.$el, myElement)
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>工具找到 <code>vm.$before</code>。如有遗漏，请参考 <strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `vm.$after` <sup>弃用</sup>

使用 DOM 原生方法：

``` js
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
```

如果 `myElement` 是最后一个节点也可以这样写：

``` js
myElement.parentNode.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到<code>vm.$after</code>。如有遗漏，请参考<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

### `vm.$remove` <sup>弃用</sup>

使用 DOM 原生方法：

``` js
vm.$el.remove()
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>找到<code>vm.$remove</code>。如有遗漏，请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

## 底层实例方法

### `vm.$eval` <sup>弃用</sup>

尽量不要使用，如果必须使用该功能并且不肯定如何使用请参考 [the forum](http://forum.vuejs.org/)。

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$eval</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>弃用</sup>

尽量不要使用，如果必须使用该功能并且不肯定如何使用请参考 [the forum](http://forum.vuejs.org/)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到<code>vm.$interpolate</code>。如有遗漏请参考<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

### `vm.$log` <sup>弃用</sup>

请使用 [Vue Devtools](https://github.com/vuejs/vue-devtools) 感受最佳debug体验。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到 <code>vm.$log</code>。如有遗漏请参考<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

## 实例 DOM 选项

### `replace: false` <sup>弃用</sup>

现在组件总是会替换掉他们被绑定的元素。为了模仿`replace: false`的行为，可以用一个和将要替换元素类似的元素将根组件包裹起来：

``` js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

或者使用渲染函数：

``` js
new Vue({
  el: '#app',
  render: function (h) {
    h('div', {
      attrs: {
        id: 'app',
      }
    }, /* ... */)
  }
})
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到 <code>replace: false</code>使用的位置。</p>
</div>
{% endraw %}

## 全局配置

### `Vue.config.debug` <sup>弃用</sup>

不再需要，因为警告信息将默认在堆栈信息里输出。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 找到包含<code>Vue.config.debug</code>的地方。</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>弃用</sup>

Async is now required for rendering performance.

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>工具找到使用<code>Vue.config.async</code>的实例。</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>弃用</sup>

以 [模板选项](/api/#delimiters)的方式使用。这样可以 可以在使用自定义分隔符时避免影响第三方模板。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到使用<code>Vue.config.delimiters</code>的实例。</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>弃用</sup>

HTML interpolation [替换为 `v-html`](#HTML-Interpolation-deprecated).

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到 <code>Vue.config.unsafeDelimiters</code>。然后 helper 工具也会找到HTML插入的实例，可以用`v-HTML`来替换。</p>
</div>
{% endraw %}

## Global API

### `Vue.extend` with `el` <sup>弃用</sup>

el 选项不再在 `Vue.extend`中使用。仅在实例创建参数中可用。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>更新后运行测试在<strong>控制台警告信息</strong>中找到关于带有<code>Vue.extend</code>的<code>el</code>。</p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>弃用</sup>

用组件来代替

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到包含<code>Vue.elementDirective</code>的实例。</p>
</div>
{% endraw %}

### `Vue.partial` <sup>弃用</sup>

Partials have been deprecated in favor of more explicit data flow between components, using props. Unless you're using a partial in a performance-critical area, the recommendation is to simply use a [normal component](components.html) instead. If you were dynamically binding the `name` of a partial, you can use a [dynamic component](http://vuejs.org/guide/components.html#Dynamic-Components).

If you happen to be using partials in a performance-critical part of your app, then you should upgrade to [functional components](render-function.html#Functional-Components). They must be in a plain JS/JSX file (rather than in a `.vue` file) and are stateless and instanceless, just like partials. This makes rendering extremely fast.

A benefit of functional components over partials is that they can be much more dynamic, because they grant you access to the full power of JavaScript. There is a cost to this power however. If you've never used a component framework with render functions before, they may take a bit longer to learn.


{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> 工具找到包含 <code>Vue.partial</code>的实例</p>
</div>
{% endraw %}

***

> 原文： http://vuejs.org/guide/migration.html

***
