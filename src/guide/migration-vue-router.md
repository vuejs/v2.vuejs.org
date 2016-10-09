---
title: 从Vue Router 0.7.x迁移
type: guide
order: 25
---

> 只有Vue Router 2与Vue 2是相互兼容的，所以如果你需要更新Vue,你也需要更新Vue Router。这也就是我们在主文档中将迁移路径的内容添加进来的原因。
如果想要进一步了解新Vue Router的使用详情，请移步 [Vue Router docs](http://router.vuejs.org/en/).

<p class="tip">以下的弃用名单应该相对完整，但是迁移助手会不定期更新以保证赶上更新的进度.</p>

## Route 定义

### `router.map` <sup>弃用</sup>

现在的路由被定义在一个数组之中[`routes` option](http://router.vuejs.org/en/essentials/getting-started.html#javascript)在这个路由实例中. 这些是路由的示例:

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

会被替代以这样的方式定义:

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

考虑到不同浏览器中遍历对象不能保证会使用相同的键值，这个数组的语法可以允许更多可预测的路由匹配。.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找示例<code>router.map</code>调用.</p>
</div>
{% endraw %}

### `router.on` <sup>弃用</sup>

如果你需要在启动你的app时从程序上确保生成的路由，你可以通过动态的向路由数组推送定义来完成这个操作。举例说明:

``` js
// 普通基本的路由
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

如果你需要在路由被实例化后增加新的路由，你可以用一个你需要新添加的路由去替换路由的匹配者:

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
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找示例<code>router.on</code>调用.</p>
</div>
{% endraw %}

### `subroutes` <sup>弃用</sup>

[重命名为`children`](http://router.vuejs.org/en/essentials/nested-routes.html)出于与Vue以及其他路由库的一致性考虑.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找示例<code>subroutes</code>的选项.</p>
</div>
{% endraw %}

### `router.redirect` <sup>弃用</sup>

这现在是一个 [路由定义的选项](http://router.vuejs.org/en/essentials/redirect-and-alias.html). 所以举例说明一下，你将会更新:

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

成像下面你的'routes'配置里定义的样子:

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找示例<code>router.redirect</code>的调用.</p>
</div>
{% endraw %}

### `router.alias` <sup>弃用</sup>

这现在是一个[路由定义的选项](http://router.vuejs.org/en/essentials/redirect-and-alias.html) 你将要进行alias操作。所以举例说明，你将会更新:

``` js
router.alias({
  '/manage': '/admin'
})
```

成像下面你的'routes'配置里定义的样子:

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

如果你需要进行多次alias操作，你也可以使用一个数组语法去实现:

``` js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找示例<code>router.alias</code>的调用.</p>
</div>
{% endraw %}

## Route 匹配

路由匹配现在使用[path-to-regexp](https://github.com/pillarjs/path-to-regexp)这个包,这将会使得工作与之前相比更加灵活.

### 一个或者更多的命名参数

语法稍微有些许改变，所以以`/category/*tags`为例，应该被更新为`/category/:tags+`.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找弃用路由语法的示例.</p>
</div>
{% endraw %}

## Links

### `v-link` <sup>弃用</sup>

`v-link`指令已经被一个新的[`<router-link>`component](http://router.vuejs.org/en/api/router-link.html)指令替代,这一部分的工作已经被Vue2中的组件完成。这将意味着无论在什么时刻，什么情况下你将会拥有这样的一个链接:

``` html
<a v-link="'/about'">About</a>
```

你需要像这样去更新:

``` html
<router-link to="/about">About</router-link>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>v-link</code>指令的示例</p>
</div>
{% endraw %}

### `v-link-active` <sup>废弃</sup>

`v-link-active`指令也因为新出现了一个用于定义隔离标签(在[`<router-link>`组件](http://router.vuejs.org/en/api/router-link.html)上)被废弃掉了。所以
举例说明，你将会以这样的方式更新:

``` html
<li v-link-active>
  <a v-link="'/about'">About</a>
</li>
```

变成了这样:

``` html
<router-link tag="li" to="/about">
  <a>About</a>
</router-link>
```

 `<a>`标签将会成为真实的链接(并且会获取到正确的跳转),但是激活的类将会被应用在外部的`<li>`标签上.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>v-link-active</code>指令的示例</p>
</div>
{% endraw %}

## 编程导航

### `router.go`

[重命名为`router.push`](http://router.vuejs.org/en/essentials/navigation.html#routerpushlocation) 出于在[HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)与语使用的一致性原则.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>router.go</code>指令被调用的示例</p>
</div>
{% endraw %}

## 路由选择：Modes

### `hashbang: false` <sup>弃用</sup>

Hashbangs将不再为谷歌需要去爬去一个网址，所以他们将不再成为哈希策略的默认选项.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>hashbang: false</code>选项的示例</p>
</div>
{% endraw %}

### `history: true` <sup>弃用</sup>

所有路由模型选项将被简化成一个单个的[`mode` 选项](http://router.vuejs.org/en/api/options.html#mode). 更新:

``` js
var router = new VueRouter({
  history: 'true'
})
```

变成:

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>history: true</code>选项的示例</p>
</div>
{% endraw %}

### `abstract: true` <sup>弃用</sup>

所有路由模型选项将被简化成一个单个的[`mode` 选项](http://router.vuejs.org/en/api/options.html#mode). 更新:

``` js
var router = new VueRouter({
  abstract: 'true'
})
```

to:

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>abstract: true</code>选项的示例.</p>
</div>
{% endraw %}

## 路由选项：Misc

### `saveScrollPosition` <sup>弃用</sup>

它已经被替换为[`scrollBehavior`option](http://router.vuejs.org/en/advanced/scroll-behavior.html)可以接受一个方法，所以滑动行为可以完全的被定制化处理 - 就算为每次路由进行定制也可以满足。这将会开启很多新的可能，但是简单的复制旧的行为:

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
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>saveScrollPosition: true</code>选项的示例.</p>
</div>
{% endraw %}

### `root` <sup>弃用</sup>

出于与[the HTML `<base>`element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)一致性重命名为`base`.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>root</code>选项的示例.</p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>弃用</sup>

由于Vue的过渡系统的存在这个选项将不再需要[`appear` transition control](transitions.html#Transitions-on-Initial-Render).

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>transitionOnLoad: true</code>选项的示例.</p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>弃用</sup>

出于简化钩子的需要被移除。如果你真的需要抑制过渡错误，你可以使用 [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)作为替代.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>suppressTransitionError: true</code>选项的示例.</p>
</div>
{% endraw %}

## 路由挂钩

### `activate` <sup>弃用</sup>

使用[`beforeRouteEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards)这一组件进行替代.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>beforeRouteEnter</code>钩子的示例.</p>
</div>
{% endraw %}

### `canActivate` <sup>弃用</sup>

使用[`beforeEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#perroute-guard) 在路由中作为替代.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>canActivate</code>钩子的示例.</p>
</div>
{% endraw %}

### `deactivate` <sup>弃用</sup>

使用[`beforeDestroy`](/api/#beforeDestroy) or [`destroyed`](/api/#destroyed) 钩子作为替代.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>deactivate</code>钩子的示例.</p>
</div>
{% endraw %}

### `canDeactivate` <sup>弃用</sup>

在组件中使用[`beforeRouteLeave`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) 作为替代.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">migration helper</a>命令去寻找<code>canDeactivate</code>钩子的示例.</p>
</div>
{% endraw %}

### `canReuse: false` <sup>弃用</sup>

在新的Vue 路由中将不再被使用.

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>canReuse: false</code>选项的示例.</p>
</div>
{% endraw %}


### `data` <sup>弃用</sup>

`$route`属性是可反应的，所有你可以就使用一个观察者去反应路由的改变，就像这样:

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
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>data</code>钩子的示例.</p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>弃用</sup>

定义你自己的属性(举例说明`isLoading`),然后在路由上的观察者中更新加载状态.举例说明，如果使用[axios](https://github.com/mzabriskie/axios)获取数据:

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
    this.isLoading = true
    this.fetchData().then(() => {
      this.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    return axios.get('/api/posts')
      .then(function (response) {
        this.posts = response.data.posts
      })
      .catch(function (error) {
        this.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级路径</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移助手</a>命令去寻找<code>$loadingRouteData</code>meta属性的示例.</p>
</div>
{% endraw %}

***

> 原文： http://vuejs.org/guide/migration-vue-router.html

***
