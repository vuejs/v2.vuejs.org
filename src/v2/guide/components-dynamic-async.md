---
title: 动态组件和异步组件
type: guide
order: 105
---

> 本页面会假定你已经阅读过 [组件基础](components.html)。如果你还不熟悉组件，请先阅读组件基础后再阅读本页面。

## 对动态组件使用 `keep-alive`

前面，我们使用 `is` 特性，在标签页式界面中切换组件：

```html
<component v-bind:is="currentTabComponent"></component>
```

有时在这些组件之间切换，需要保留切换前的状态，或者需要考虑重新渲染造成的性能问题，而尽量避免重新渲染。举例说明，稍微扩展下我们的标签页式界面：

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-posts', {
  data: function () {
    return {
      posts: [
        {
          id: 1,
          title: 'Cat Ipsum',
          content: '<p>Dont wait for the storm to pass, dance in the rain kick up litter decide to want nothing to do with my owner today demand to be let outside at once, and expect owner to wait for me as i think about it cat cat moo moo lick ears lick paws so make meme, make cute face but lick the other cats. Kitty poochy chase imaginary bugs, but stand in front of the computer screen. Sweet beast cat dog hate mouse eat string barf pillow no baths hate everything stare at guinea pigs. My left donut is missing, as is my right loved it, hated it, loved it, hated it scoot butt on the rug cat not kitten around</p>'
        },
        {
          id: 2,
          title: 'Hipster Ipsum',
          content: '<p>Bushwick blue bottle scenester helvetica ugh, meh four loko. Put a bird on it lumbersexual franzen shabby chic, street art knausgaard trust fund shaman scenester live-edge mixtape taxidermy viral yuccie succulents. Keytar poke bicycle rights, crucifix street art neutra air plant PBR&B hoodie plaid venmo. Tilde swag art party fanny pack vinyl letterpress venmo jean shorts offal mumblecore. Vice blog gentrify mlkshk tattooed occupy snackwave, hoodie craft beer next level migas 8-bit chartreuse. Trust fund food truck drinking vinegar gochujang.</p>'
        },
        {
          id: 3,
          title: 'Cupcake Ipsum',
          content: '<p>Icing dessert soufflé lollipop chocolate bar sweet tart cake chupa chups. Soufflé marzipan jelly beans croissant toffee marzipan cupcake icing fruitcake. Muffin cake pudding soufflé wafer jelly bear claw sesame snaps marshmallow. Marzipan soufflé croissant lemon drops gingerbread sugar plum lemon drops apple pie gummies. Sweet roll donut oat cake toffee cake. Liquorice candy macaroon toffee cookie marzipan.</p>'
        }
      ],
      selectedPost: null
    }
  },
  template: '\
    <div class="dynamic-component-demo-posts-tab">\
      <ul class="dynamic-component-demo-posts-sidebar">\
        <li\
          v-for="post in posts"\
          v-bind:key="post.id"\
          v-bind:class="{ \'dynamic-component-demo-active\': post === selectedPost }"\
          v-on:click="selectedPost = post"\
        >\
          {{ post.title }}\
        </li>\
      </ul>\
      <div class="dynamic-component-demo-post-container">\
        <div \
          v-if="selectedPost"\
          class="dynamic-component-demo-post"\
        >\
          <h3>{{ selectedPost.title }}</h3>\
          <div v-html="selectedPost.content"></div>\
        </div>\
        <strong v-else>\
          Click on a blog title to the left to view it.\
        </strong>\
      </div>\
    </div>\
  '
})
Vue.component('tab-archive', {
  template: '<div>Archive component</div>'
})
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button.dynamic-component-demo-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
.dynamic-component-demo-posts-tab {
  display: flex;
}
.dynamic-component-demo-posts-sidebar {
  max-width: 40vw;
  margin: 0 !important;
  padding: 0 10px 0 0 !important;
  list-style-type: none;
  border-right: 1px solid #ccc;
}
.dynamic-component-demo-posts-sidebar li {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.dynamic-component-demo-posts-sidebar li:hover {
  background: #eee;
}
.dynamic-component-demo-posts-sidebar li.dynamic-component-demo-active {
  background: lightblue;
}
.dynamic-component-demo-post-container {
  padding-left: 10px;
}
.dynamic-component-demo-post > :first-child {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style>
{% endraw %}

然后你会注意到，如果选中某篇文章(post)，切换到 _Archive_ 标签页，再切换回 _Posts_ 标签页，而选取的文章则不会再次展现。这是因为，每次你切换到一个新的标签页后，Vue 都会创建 `currentTabComponent` 所对应组件的一个全新实例。

重新创建动态组件是一种常规用法，但是在这个场景中，我们确实希望这些标签页组件的实例，在第一次创建之后就缓存起来。为了解决这个问题，我们可以使用一个 `<keep-alive>` 元素将动态组件包裹起来：

``` html
<!-- Inactive components will be cached! -->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

查看下面结果：

{% raw %}
<div id="dynamic-component-keep-alive-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <keep-alive>
    <component
      v-bind:is="currentTabComponent"
      class="dynamic-component-demo-tab"
    ></component>
  </keep-alive>
</div>
<script>
new Vue({
  el: '#dynamic-component-keep-alive-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
{% endraw %}

现在 _Posts_ 标签页并未渲染，而是保持它先前（选中那篇文章）的状态。完整代码请查看 [fiddle](https://jsfiddle.net/chrisvfritz/Lp20op9o/)。

<p class="tip">注意，`<keep-alive>` 要求被切换的组件都要具有 name，要么是使用组件的 `name` 选项，要么就是通过局部/全局注册。</p>

更多细节请查看 [API 参考](../api/#keep-alive) 中 `<keep-alive>` 部分。

## 异步组件

在大型应用程序中，我们可能需要将应用程序拆分为多个小的分块(chunk)，并且只在实际用到时，才从服务器加载某个组件。为了简化异步按需加载组件机制，Vue 能够将组件定义为一个工厂函数(factory function)，此函数可以异步地解析(resolve)组件定义对象(component definition)。Vue 只在真正需要渲染组件时，才会去触发工厂函数，并且将解析后的结果缓存，用于将来再次渲染。例如：

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 将组件定义对象(component definition)传递给 resolve 回调函数
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

就像你看到的那样，工厂函数接收一个 `resolve` 回调函数，在从服务器获取到组件定义对象时，会调用此回调函数。也可以调用 `reject(reason)` 来表明加载失败。这里的 `setTimeout` 只是为了用于演示；如果获取组件定义对象，取决于你的实际情况。使用异步组件，比较推荐的方式是配合 [webpack 代码分离功能](https://doc.webpack-china.org/guides/code-splitting/)

``` js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法
  // 将指示 webpack 自动将构建后的代码，
  // 拆分到不同的 bundle 中，然后通过 Ajax 请求加载。
  require(['./my-async-component'], resolve)
})
```

还可以在工厂函数中返回一个 `Promise`，所以配合 webpack 2 + ES2015 语法，你可以这样实现：

``` js
Vue.component(
  'async-webpack-example',
  // `import` 函数返回一个 Promise.
  () => import('./my-async-component')
)
```

当使用 [局部注册](components.html#Local-Registration) 时，你也可以直接提供一个返回 `Promise` 的函数：

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">如果你是想要使用异步组件的 <strong>Browserify</strong> 用户，不幸的是，它的作者已经 [明确表示](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) Browserify 是不支持异步加载的。虽然官方如此表示，然而 Browserify 社区还是找到 [一些解决方案](https://github.com/vuejs/vuejs.org/issues/620)，这可能有助于现有的复杂应用程序实现异步组件。对于所有其他场景，我们推荐使用 webpack 内置和优先支持的异步支持。</p>

### 处理加载状态

> 2.3.0+ 新增

异步组件工厂函数，还可以返回一个以下格式的对象：

``` js
const AsyncComponent = () => ({
  // 加载组件（最终应该返回一个 Promise）
  component: import('./MyComponent.vue'),
  // 异步组件加载中(loading)，展示为此组件
  loading: LoadingComponent,
  // 加载失败，展示为此组件
  error: ErrorComponent,
  // 展示 loading 组件之前的延迟时间。默认：200ms。
  delay: 200,
  // 如果提供 timeout，并且加载用时超过此 timeout，
  // 则展示错误组件。默认：Infinity。
  timeout: 3000
})
```

> 注意，如果你想要在路由组件中使用以上语法，必须使用 [Vue Router](https://github.com/vuejs/vue-router) 2.4.0+ 版本。

***

> 原文：http://vuejs.org/v2/guide/components-dynamic-async.html

***
