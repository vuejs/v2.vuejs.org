title: 创建大型应用
type: guide
order: 13
---

Vue.js 会设计得尽量灵活——它只是一个接口库，不迁就于任何架构决策。尽管它在快速原型开发中显得非常有用，但对于经验较少的人来说，用它来构建大规模应用程序会有一定的难度。接下来我们会在如何使用 Vue.js 组织大型项目这方面提供一些的观点。

## 模块化

虽然独立构建的 Vue.js 可以被用作一个全局变量，但是它通常更适合应用在一个模块化系统中，以便更好的组织你的代码。我们建议你在 CommonJS 的模块下撰写源代码 (这是 Node.js 使用的格式，也是 Vue.js 源代码使用的格式)，并通过 [Browserify](http://browserify.org/) 或 [Webpack](http://webpack.github.io/) 把它们捆绑起来。

Github上有一些构建的示例：

- [Vue + Browserify](https://github.com/vuejs/vue-browserify-example)
- [Vue + Webpack](https://github.com/vuejs/vue-webpack-example)

## 一个文件对应一个组件

在一个典型的 Vue.js 项目里，我们将会打散我们的代码，变成若干小的组件，如果能够根据组件划分把 CSS 样式也独立封装起来就更好了。刚才提过的2个构建工具都有一个额外的机制，那就是在把源代码捆绑在一起之前可以对其进行转换。再结合一些预处理，我们就可以这样撰写组件了：

![](../images/vueify.png)

如果你有预处理程序，你甚至可以这样写：

![](../images/vueify_with_pre.png)

它已经通过 [Vueify](https://github.com/vuejs/vueify) 为 Browserify 进行转换，或通过 [Vue-loader](https://github.com/vuejs/vue-loader) 为 Webpack 进行转换。

## 路由

你可以手动监听 hashchange 并利用一个动态的 `v-component` 实现一些基本的路由逻辑。

**Example:**

``` html
<div id="app">
  <div v-component="{&#123;currentView&#125;}"></div>
</div>
```

``` js
Vue.component('home', { /* ... */ })
Vue.component('page1', { /* ... */ })
var app = new Vue({
  el: '#app',
  data: {
    currentView: 'home'
  }
})
// Switching pages in your route handler:
app.currentView = 'page1'
```

利用这种机制很容易接入独立的路由库，如 [Page.js](https://github.com/visionmedia/page.js) 或 [Director](https://github.com/flatiron/director)。

## 服务器通信

所有的 Vue 实例都可以通过 `JSON.stringify()` 得到它们原始的 `$data`，没有任何副作用。你可以使用任何你喜欢的 Ajax 组件，比如 [SuperAgent](https://github.com/visionmedia/superagent)。也可以和诸如 Firebase 这样的 no-backend 服务完美配合。

## 单元测试

任何兼容 Common-JS 的构建系统都可以。建议使用 [Karma](http://karma-runner.github.io/0.12/index.html) test runner 结合 [CommonJS pre-processor](https://github.com/karma-runner/karma-commonjs) 对你的代码进行模块化测试。

最佳实践是暴露出模块内的原始选项/函数。考虑一下这个示例：

``` js
// my-component.js
module.exports = {
  created: function () {
    this.message = 'hello!'
  }
}
```

你可以在你的入口模块中如下使用这个文件：

``` js
// main.js
var Vue = require('vue')
var app = new Vue({
  el: '#app',
  data: { /* ... */ },
  components: {
    'my-component': require('./my-component')
  }
})
```

然后你可以如下测试该模块：

``` js
// Some Jasmine 2.0 tests
describe('my-component', function () {  
  // require source module
  var myComponent = require('../src/my-component')
  it('should have a created hook', function () {
    expect(typeof myComponent.created).toBe('function')
  })
  it('should set correct default data', function () {
    expect(typeof myComponent.data).toBe('function')
    var defaultData = myComponent.data()
    expect(defaultData.message).toBe('hello!')
  })
})
```

<p class="tip">因为 Vue.js 指令异步反映数据的更新，当你需要在改变数据之后断言 DOM 的状态时，你需要在一个 `Vue.nextTick` 回调里完成断言。另外你可以在测试中设置 `Vue.config.async = false`，这样你就可以在数据改变之后同步断言 DOM 的状态了。</p>

## 一个示例

[Vue.js Hackernews Clone](https://github.com/yyx990803/vue-hackernews) 是一个应用的例子，它把 Browserify + Vueify 用来代码组织、Director.js 用来做路由、HackerNews 官方的 Firebase API 为后端。这不算什么特别大的应用，但它结合并展示了本页面讨论到的各方面概念。
