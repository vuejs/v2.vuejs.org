---
title: 从 Vue Router 0.7.x 迁移
type: guide
order: 26
---

> 只有 Vue Router 2 是与 Vue 2 相互兼容的，所以如果你更新了 Vue ，你也需要更新 Vue Router 。这也是我们在主文档中将迁移路径的详情添加进来的原因。
有关使用 Vue Router 2 的完整教程，请参阅 [ Vue Router 文档](http://router.vuejs.org/en/)。

## Router 初始化

### `router.start` <sup>替换</sup>

不再会有一个特殊的 API 用来初始化包含 Vue Router 的 app ，这意味着不再是：

``` js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

你只需要传一个路由属性给 Vue 实例：

``` js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

或者，如果你使用的是运行时构建 (runtime-only) 方式：

``` js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>router.start</code> 被调用的示例。</p>
</div>
{% endraw %}

## Route 定义

### `router.map` <sup>替换</sup>

路由现在被定义为一个在 router 实例里的一个[`routes` 选项](http://router.vuejs.org/en/essentials/getting-started.html#javascript)数组。所以这些路由：

``` js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

会以这种方式定义：

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

考虑到不同浏览器中遍历对象不能保证会使用相同的键值，这种数组的语法可以保证更多可预测的路由匹配。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>router.map</code> 被调用的示例。</p>
</div>
{% endraw %}

### `router.on` <sup>移除</sup>

如果你需要在启动的 app 时通过代码生成路由，你可以动态地向路由数组推送定义来完成这个操作。举个例子：

``` js
// 普通的路由
var routes = [
  // ...
]

// 动态生成的路由
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

如果你需要在 router 被实例化后增加新的路由，你可以把 router 原来的匹配方式换成一个包括你新添的加路由的匹配方式：

``` js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>router.on</code> 被调用的示例。</p>
</div>
{% endraw %}

### `subRoutes` <sup>换名</sup>

出于 Vue Router 和其他路由库一致性的考虑，重命名为[`children`](http://router.vuejs.org/en/essentials/nested-routes.html)

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>subRoutes</code> 选项的示例。</p>
</div>
{% endraw %}

### `router.redirect` <sup>替换</sup>

现在用一个[路由定义的选项](http://router.vuejs.org/en/essentials/redirect-and-alias.html)作为代替。 举个例子，你将会更新：

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

成像下面的`routes`配置里定义的样子：

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>router.redirect</code> 被调用的示例。</p>
</div>
{% endraw %}

### `router.alias` <sup>替换</sup>

现在是你进行 alias 操作的[路由定义里的一个选项](http://router.vuejs.org/en/essentials/redirect-and-alias.html)。举个例子，你需要在你的`routes`定义里将：

``` js
router.alias({
  '/manage': '/admin'
})
```

配置这个样子：

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

如果你需要进行多次 alias 操作，你也可以使用一个数组语法去实现：

``` js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>找到 <code>router.alias</code> 被调用的示例。</p>
</div>
{% endraw %}

### 任意的 Route 属性 <sup>替换</sup>

现在任意的 route 属性必须在新 meta 属性的作用域内，以避免和以后的新特性发生冲突。举个例子，如果你以前这样定义：

``` js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

你现在需要把它更新成：

``` js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```


如果在一个路由上访问一个属性，你仍然会通过 meta 。举个例子：

``` js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到任意的路由不在 meta 作用域下的示例。</p>
</div>
{% endraw %}

## Route 匹配

路由匹配现在使用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 这个包，这将会使得工作与之前相比更加灵活。

### 一个或者更多的命名参数 <sup>改变</sup>

语法稍微有些许改变，所以以`/category/*tags`为例，应该被更新为`/category/:tags+`。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到弃用路由语法的示例。</p>
</div>
{% endraw %}

## 链接

### `v-link` <sup>替换</sup>

`v-link`指令已经被一个新的[`<router-link>` 组件](http://router.vuejs.org/en/api/router-link.html)指令替代，这一部分的工作已经被 Vue 2 中的组件完成。这将意味着在任何情况下，如果你拥有这样一个链接：

``` html
<a v-link="'/about'">About</a>
```

你需要把它更新成：

``` html
<router-link to="/about">About</router-link>
```

Note that `target="_blank"` is not supported on `<router-link>`, so if you need to open a link in a new tab, you have to use `<a>` instead.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>v-link</code> 指令的示例。</p>
</div>
{% endraw %}

### `v-link-active` <sup>替换</sup>

The `v-link-active` directive has also been replaced by the `tag` attribute on [the `<router-link>` component](http://router.vuejs.org/en/api/router-link.html). So for example, you'll update this:

`v-link-active`也因为指定了一个在[ `<router-link>` 组件](http://router.vuejs.org/en/api/router-link.html)上的 tag 属性而被弃用了。举个例子，你需要更新：

``` html
<li v-link-active>
  <a v-link="'/about'">About</a>
</li>
```

成这个写法:

``` html
<router-link tag="li" to="/about">
  <a>About</a>
</router-link>
```

 `<a>`标签将会成为真实的链接（并且可以获取到正确的跳转），但是激活的类将会被应用在外部的`<li>`标签上。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>v-link-active</code> 指令的示例</p>
</div>  
{% endraw %}

## 编程导航

### `router.go` <sup>改变</sup>

为了与 [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) 保持一致性，`router.go` 已经被用来作为 [后退/前进导航](https://router.vuejs.org/en/essentials/navigation.html#routergon)，[`router.push` ](http://router.vuejs.org/en/essentials/navigation.html#routerpushlocation) 用来导向特殊页面。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> ，找到 <code>router.go</code> 和 <code>router.push</code> 指令被调用的示例。</p>
</div>
{% endraw %}

## 路由选择：Modes

### `hashbang: false` <sup>移除</sup>

Hashbangs 将不再为谷歌需要去爬去一个网址，所以他们将不再成为哈希策略的默认选项。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>hashbang: false</code> 选项的示。</p>
</div>
{% endraw %}

### `history: true` <sup>替换</sup>

所有路由模型选项将被简化成一个单个的[`mode` 选项](http://router.vuejs.org/en/api/options.html#mode)。 你需要更新：

``` js
var router = new VueRouter({
  history: 'true'
})
```

成这个写法：

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>history: true</code> 选项的示。</p>
</div>
{% endraw %}

### `abstract: true` <sup>替换</sup>

所有路由模型选项将被简化成一个单个的[`mode` 选项](http://router.vuejs.org/en/api/options.html#mode)。 你需要更新：

``` js
var router = new VueRouter({
  abstract: 'true'
})
```

成这个写法：

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>abstract: true</code> 选项的示例。</p>
</div>
{% endraw %}

## 路由选项：Misc

### `saveScrollPosition` <sup>替换</sup>

它已经被替换为可以接受一个函数的[`scrollBehavior` 选项](http://router.vuejs.org/en/advanced/scroll-behavior.html)，所以滑动行为可以完全的被定制化处理 - 甚至为每次路由进行定制也可以满足。这将会开启很多新的可能，但是简单的复制旧的行为:

``` js
saveScrollPosition: true
```

你可以替换为:

``` js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移路径</a> 找到 <code>saveScrollPosition: true</code> 选项的示例。</p>
</div>
{% endraw %}

### `root` <sup>换名</sup>

为了与[HTML 的`<base>`标签](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)保持一致性，重命名为`base`。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移路径</a> 找到 <code>root</code> 选项的示例。</p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>移除</sup>

由于 Vue 的过渡系统[`appear` transition control](transitions.html#Transitions-on-Initial-Render)的存在，这个选项将不再需要。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移路径</a> 找到 <code>transitionOnLoad: true</code> 选项的示例。</p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>移除</sup>

出于简化钩子的考虑被移除。如果你真的需要抑制过渡错误，你可以使用 [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)作为替代。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移指令</a> 找到 <code>suppressTransitionError: true</code> 选项的示例。</p>
</div>
{% endraw %}

## 路由挂钩

### `activate` <sup>替换</sup>

使用[`beforeRouteEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards)这一组件进行替代。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移路径</a> 找到 <code>beforeRouteEnter</code> 钩子的示例。</p>
</div>
{% endraw %}

### `canActivate` <sup>替换</sup>

使用[`beforeEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#perroute-guard) 在路由中作为替代。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移路径</a> 找到 <code>canActivate</code> 钩子的示例。</p>
</div>
{% endraw %}

### `deactivate` <sup>移除</sup>

使用[`beforeDestroy`](../api/#beforeDestroy) 或者 [`destroyed`](../api/#destroyed) 钩子作为替代。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移路径</a> 找到 <code>deactivate</code> 钩子的示例。</p>
</div>
{% endraw %}

### `canDeactivate` <sup>替换</sup>

在组件中使用[`beforeRouteLeave`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) 作为替代。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移路径</a> 找到 <code>canDeactivate</code> 钩子的示例。</p>
</div>
{% endraw %}

### `canReuse: false` <sup>移除</sup>

在新的 Vue 路由中将不再被使用。

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>canReuse: false</code> 选项的示例。</p>
</div>
{% endraw %}

### `data` <sup>替换</sup>

`$route`属性是响应式的，所有你可以就使用一个 watcher 去响应路由的改变，就像这样：


``` js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a> 找到 <code>data</code> 钩子的示例。</p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>移除</sup>

定义你自己的属性（例如：`isLoading`），然后在路由上的 watcher 中更新加载状态。举个例子，如果使用[axios](https://github.com/mzabriskie/axios)获取数据：

``` js
data: function () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': function () {
    var self = this
    self.isLoading = true
    self.fetchData().then(function () {
      self.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    var self = this
    return axios.get('/api/posts')
      .then(function (response) {
        self.posts = response.data.posts
      })
      .catch(function (error) {
        self.fetchError = error
      })
  }
}
```


***

> 原文： http://vuejs.org/guide/migration-vue-router.html

*** 
