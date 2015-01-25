title: 起步
type: guide
order: 2
---

## 介绍

<!--
Vue.js is a library for building interactive web interfaces.
-->Vue.js 是一个用于创建 web 交互界面的库。

<!--
Technically, Vue.js is focused on the [ViewModel](#ViewModel) layer of the MVVM pattern. It connects the [View](#View) and the [Model](#Model) via two way data bindings. Actual DOM manipulations and output formatting are abstracted away into [Directives](#Directives) and [Filters](#Filters).
-->从技术角度讲，Vue.js 专注于 MVVM 模型的 [ViewModel](#ViewModel) 层。它通过双向数据绑定把 [View](#View) 层和 [Model](#Model) 层连接了起来。实际的 DOM 封装和输出格式都被抽象为了 [Directives](#Directives) 和 [Filters](#Filters)。

<!--
Philosophically, the goal is to provide the benefits of reactive data binding and composable view components with an API that is as simple as possible. It is not a full-blown framework - it is designed to be a view layer that is simple and flexible. You can use it alone for rapid prototyping, or mix and match with other libraries for a custom front-end stack. It's also a natural fit for no-backend services such as Firebase.
-->从哲学角度讲，我们希望创造的价值，在于通过一个尽量简单的 API 产生可反映的数据绑定和可组合的视图组件。它不是一个大而全的框架——它为简单灵活的视图层而生。您可以独立使用它快速开发原型、也可以混合别的库做更多的事情。它同时天然的适用于诸如 Firebase 的 no-backend 服务。

<!--
Vue.js' API is heavily influenced by [AngularJS], [KnockoutJS], [Ractive.js] and [Rivets.js]. Despite the similarities, I believe Vue.js offers a valuable alternative to these existing libraries by finding a sweetspot between simplicity and functionality.
-->Vue.js 的 API 设计深受 [AngularJS]、[KnockoutJS]、[Ractive.js] 和 [Rivets.js] 的影响。尽管有不少雷同，但我们相信 Vue.js 能够通过在简约和功能两者之间的巧妙契合，体现出其特殊的价值。

<!--
Even if you are already familiar with some of these terms, it is recommended that you go through the following concepts overview because your notion of these terms might be different from what they mean in the Vue.js context.
-->即便您已经熟悉了一些这类的库或框架，我们还是推荐您继续阅读接下来的概览，因为您对它们的认识也许和 Vue.js 中的情景不尽相同。

## 概览

### ViewModel

<!--
An object that syncs the Model and the View. In Vue.js, every Vue instance is a ViewModel. They are instantiated with the `Vue` constructor or its sub-classes:
-->一个同步 Model 和 View 的对象。在 Vue.js 中，每个 Vue 实例都是一个 ViewModel。它们是通过构造函数 `Vue` 或其子类被初始化出来的。

```js
var vm = new Vue({ /* options */ })
```

<!--
This is the primary object that you will be interacting with as a developer when using Vue.js. For more details see [The Vue Constructor](/api/).
-->这是您作为一个开发者在使用 Vue.js 时主要打交道的对象。更多的细节请移步至[Vue 构造函数](/api/)。

### 视图 (View)

<!--
The actual DOM that is managed by Vue instances.
-->实际被 Vue 实例管理的 DOM。

```js
vm.$el // The View
```

<!--
Vue.js uses DOM-based templating. Each Vue instance is associated with a corresponding DOM element. When a Vue instance is created, it recursively walks all child nodes of its root element while setting up the necessary data bindings. After the View is compiled, it becomes reactive to data changes.
-->Vue.js 使用基于 DOM 的模板。每个 Vue 实例都关联着一个相应的 DOM 元素。当一个 Vue 实例被创建时，它会递归便利根元素的所有子结点，同时完成必要的数据绑定。当这个视图被编译之后，它就会自动反映数据的变化。

<!--
When using Vue.js, you rarely have to touch the DOM yourself except in custom directives (explained later). View updates will be automatically triggered when the data changes. These view updates are highly granular with the precision down to a textNode. They are also batched and executed asynchronously for greater performance.
-->在使用 Vue.js 时，除了自定义的指令 (directives) 您几乎不必直接接触 DOM (稍后会有解释)。当数据发生变化时，视图将会自动触发更新。这些更新的颗粒度是精确到 textNode 的。同时为了更好的性能，这些更新是批量异步执行的。

### 模型 (Model)

<!--
A slightly modified plain JavaScript object.
-->一个轻微改动过的普通 JavaScript 对象。

```js
vm.$data // The Model
```

<!--
In Vue.js, models are simply plain JavaScript objects, or **data objects**. You can manipulate their properties and Vue instances that are observing them will be notified of the changes. Vue.js achieves transparent reactivity by converting the properties on data objects into ES5 getter/setters. There's no need for dirty checking, nor do you have to explicitly signal Vue to update the View. Whenever the data changes, the View is updated on the next frame.
-->Vue.js 中的模型就是普通的 JavaScript 对象——也可以称为**数据对象**。你可以操作它们的属性，同时 Vue 实例观察到这些属性的变化时也会被提示。Vue.js 把数据对象的属性都转换成了 ES5 中的 getter/setters，以此达到无副作用的数据观察效果。无需 dirty checking，也不需要刻意给 Vue 任何更新视图的信号。每当数据变化时，视图都会在下一帧自动更新。

<!--
Vue instances proxy all properties on data objects they observe. So once an object `{ a: 1 }` has been observed, both `vm.$data.a` and `vm.a` will return the same value, and setting `vm.a = 2` will modify `vm.$data`.
-->Vue 实例代理了它们观察到的数据对象的所有属性。所以一旦一个对象 `{ a: 1 }` 被观察，那么 `vm.$data.a` 和 `vm.a` 将会返回相同的值，而设置 `vm.a = 2` 则也会修改 `vm.$data`。

<!--
The data objects are mutated in place, so modifying it by reference has the same effects as modifying `vm.$data`. This makes it possible for multiple Vue instances to observe the same piece of data. In larger applications it is also recommended to treat Vue instances as pure views, and externalize the data manipulation logic into a more discrete store layer.
-->数据对象有时是突变的，所以修改数据的引用和修改 `vm.$data` 具有相同的效果。这也意味着多个 Vue 实例可以观察同一份数据。在较大型的应用程序中，我们也推荐将 Vue 实例作为纯粹的视图看待，同时把数据处理逻辑放在更独立的外部数据层。

<!--
One caveat here is that once the observation has been initiated, Vue.js will not be able to detect newly added or deleted properties. To get around that, observed objects are augmented with `$add` and `$delete` methods.
-->值得提醒的是，一旦数据被观察，Vue.js 就不会再侦测到新加入或删除的属性了。作为弥补，我们会为被观察的对象增加 `$add` 和 `$delete` 方法。

### 指令 (Directives)

<!--
Prefixed HTML attributes that tell Vue.js to do something about a DOM element.
-->带特殊前缀的 HTML 特性，可以让 Vue.js 对一个 DOM 元素做各种处理。

```html
<div v-text="message"></div>
```

<!--
Here the div element has a `v-text` directive with the value `message`. What it does is telling Vue.js to keep the div's textContent in sync with the Vue instance's `message` property.
-->这里的 div 元素有一个 `v-text` 指令，其值为 `message`。Vue.js 会让该 div 的文本内容是和 Vue 实例中的 `message` 属性值保持一致。

<!--
Directives can encapsulate arbitrary DOM manipulations. For example `v-attr` manipulates an element's attributes, `v-repeat` clones an element based on an Array, `v-on` attaches event listeners... we will cover them later.
-->Directives 可以封装任何 DOM 操作。比如 `v-attr` 会操作一个元素的特性；`v-repeat` 会基于一个数组克隆某个元素；`v-on` 会绑定事件等。稍后会有更多的介绍。

### Mustache 风格的绑定

<!--
You can also use mustache-style bindings, both in text and in attributes. They are translated into `v-text` and `v-attr` directives under the hood. For example:
-->你也可以使用 mustache 风格的绑定，不管在文本中还是在特性中。它们在底层会被转换成 `v-text` 和 `v-attr` 的指令。比如：

```html
<div id="person-&#123;&#123;id&#125;&#125;">Hello &#123;&#123;name&#125;&#125;!</div>
```

<!--
Although it is convenient, there are a few things you need to be aware of:
-->这很方便，不过有一些注意事项：

<!--p class="tip">The `src` attribute on an `<image>` element makes an HTTP request when a value is set, so when the template is first parsed it will result in a 404. In this case `v-attr` is preferred.</p-->
<p class="tip">一个 `<image>` 的 `src` 特性在赋值时会产生一个 HTTP 请求，所以当模板在第一次被解析时会产生一个 404 请求。这种情况下更适合用 `v-attr`。</p>

<!--p class="tip">Internet Explorer will remove invalid inline `style` attributes when parsing HTML, so always use `v-style` when binding inline CSS if you want to support IE.</p-->
<p class="tip">Internet Explorer 在解析 HTML 时会移除非法的内联 `style` 特性，所以如果你想支持 IE，请在绑定内联 CSS 的时候始终使用 `v-style`。</p>


<!--
You can use triple mustaches for unescaped HTML, which translates to `v-html` internally:
-->你可以使用三对花括号来回避 HTML 代码，而这种写法会在底层转换为 `v-html`：

``` html
{&#123;&#123; safeHTMLString &#125;&#125;}
```

<!--
However, this can open up windows for potential XSS attacks, therefore it is suggested that you only use triple mustaches when you are absolutely sure about the security of the data source, or pipe it through a custom filter that sanitizes untrusted HTML.
-->不过这种用法会留下 XSS 攻击的隐患，所以建议只对绝对信任的数据来源使用三对花括号的写法，或者先通过自定义的过滤器 (filter) 对不可信任的 HTML 进行过滤。

<!--
Finally, you can add `*` to your mustache bindings to indicate a one-time only interpolation, which does not react to data changes:
-->最后，你可以在你的 mustache 绑定里加入 `*` 来注明这是一个一次性撰写的数据，这样的话它就不会反应后续的数据变化：

``` html
{&#123;* onlyOnce &#125;}
```

### 过滤器 (Filters)

<!--
Filters are functions used to process the raw values before updating the View. They are denoted by a "pipe" inside directives or bindings:
-->过滤器是用于在更新视图之前处理原始值的函数。它们通过一个“管道”在指令或绑定中进行处理：

```html
<div>&#123;&#123;message | capitalize&#125;&#125;</div>
```

<!--
Now before the div's textContent is updated, the `message` value will first be passed through the `capitalize` function. For more details see [Filters in Depth](/guide/filters.html).
-->这样在 div 的文本内容被更新之前，`message` 的值会先传给 `capitalizie` 函数处理。更多内容可移步至[深入了解过滤器 (Filters)](/guide/filters.html)。

### 组件 (Components)

<!--
In Vue.js, every component is simply a Vue instance. Components form a nested tree-like hierarchy that represents your application interface. They can be instantiated by a custom constructor returned from `Vue.extend`, but a more declarative approach is registering them with `Vue.component(id, constructor)`. Once registered, they can be declaratively nested in other Vue instance's templates with the `v-component` directive:
-->在 Vue.js，每个组件都是一个简单的 Vue 实例。一个树形嵌套的各种组件就代表了你的应用程序的各种接口。通过 `Vue.extend` 返回的自定义构造函数可以把这些组件实例化，不过更声明式的建议是通过 `Vue.component(id, constructor)` 注册这些组件。一旦组件被注册，它们就可以在 Vue 实例的模板中以声明的形式嵌套使用了。

``` html
<div v-component="my-component">
  <!-- internals handled by my-component -->
</div>
```

<!--
This simple mechanism enables declarative reuse and composition of Vue instances in a fashion similar to [Web Components](http://www.w3.org/TR/components-intro/), without the need for latest browsers or heavy polyfills. By breaking an application into smaller components, the result is a highly decoupled and maintainable codebase. For more details, see [Component System](/guide/components.html).
-->这个简单的机制使得我们可以以类似 [Web Components](http://www.w3.org/TR/components-intro/) 的声明形式对 Vue 实例进行复用和组合，无需最新版的浏览器或笨重的 polyfills。通过将一个应用程序拆分成简单的组件，代码库可以被尽可能的解耦，同时更易于维护。更多内容可移步至[组件系统](/guide/components.html)。

## 一个简单的例子

``` html
<div id="demo">
  <h1>&#123;&#123;title | uppercase&#125;&#125;</h1>
  <ul>
    <li
      v-repeat="todos"
      v-on="click: done = !done"
      class="&#123;&#123;done ? 'done' : ''&#125;&#125;">
      &#123;&#123;content&#125;&#125;
    </li>
  </ul>
</div>
```

``` js
var demo = new Vue({
  el: '#demo',
  data: {
    title: 'todos',
    todos: [
      {
        done: true,
        content: 'Learn JavaScript'
      },
      {
        done: false,
        content: 'Learn Vue.js'
      }
    ]
  }
})
```

**Result**

<div id="demo"><h1>&#123;&#123;title | uppercase&#125;&#125;</h1><ul><li v-repeat="todos" v-on="click: done = !done" class="&#123;&#123;done ? 'done' : ''&#125;&#125;">&#123;&#123;content&#125;&#125;</li></ul></div>
<script>
var demo = new Vue({
  el: '#demo',
  data: {
    title: 'todos',
    todos: [
      {
        done: true,
        content: 'Learn JavaScript'
      },
      {
        done: false,
        content: 'Learn Vue.js'
      }
    ]
  }
})
</script>

<!--
Also available on [jsfiddle](http://jsfiddle.net/yyx990803/yMv7y/).
-->也可以通过 [jsfiddle](http://jsfiddle.net/yyx990803/yMv7y/) 查看。

<!--
You can click on a todo to toggle it, or you can open your Browser's console and play with the `demo` object - for example, change `demo.title`, push a new object into `demo.todos`, or toggle a todo's `done` state.
-->你可以点击一个 todo 来开关它，也可以打开你的浏览器命令行直接操作 `demo` 对象：比如改变 `demo.title`、向 `demo.todos` 里放入一个新的对象、或开关某个 todo 的 `done` 状态值。

<!--
You probably have a few questions in mind now - don't worry, we'll cover them soon. Next up: [Directives in Depth](/guide/directives.html).
-->也许你脑海中还有一些问题，别担心，我们稍后都会提到的。接下来可移步至：[深入了解指令 (Directives)](/guide/directives.html)。

[AngularJS]: http://angularjs.org
[KnockoutJS]: http://knockoutjs.com
[Ractive.js]: http://ractivejs.org
[Rivets.js]: http://www.rivetsjs.com
