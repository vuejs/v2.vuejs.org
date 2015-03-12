title: 组件系统
type: guide
order: 11
---

## 使用组件

Vue.js 支持把扩展而来的 Vue 的子类用作概念上与 [Web Components](http://www.w3.org/TR/components-intro/) 类似的可复用组件，无需任何 polyfill。要创建组件，只需借助 `Vue.extend()` 创建一个 Vue 的子类构造函数：

``` js
// 扩展 Vue 得到一个可复用的构造函数
var MyComponent = Vue.extend({
  template: 'A custom component!'
})
```

Vue 的构造函数可接收的大部分选项都能在 `Vue.extend()` 中使用，不过也有两个特例：`data` 和 `el`。由于每个 Vue 的实例都应该有自己的 `$data` 和 `$el`，我们显然不希望传递给 `Vue.extend()` 的值被所有通过这个构造函数创建的实例所共享。因此如果要定义组件初始化默认数据和元素的方式，应该传入一个函数：

``` js
var ComponentWithDefaultData = Vue.extend({
  data: function () {
    return {
      title: 'Hello!'
    }
  }
})
```

接下来，就可以用 `Vue.component()` 来**注册**这个构造函数了：

``` js
// 把构造函数注册到 my-component 这个 id
Vue.component('my-component', MyComponent)
```

为了更简单，也可以直接传入 option 对象来代替构造函数。如果接收到的是一个对象，`Vue.component()` 会为你隐式调用 `Vue.extend()`：

``` js
// 注意：该方法返回全局 Vue 对象，
// 而非注册的构造函数
Vue.component('my-component', {
  template: 'A custom component!'
})
```

之后就能在父级实例的模板中使用注册过的组件了（确保在初始化根实例**之前**已经注册了组件）：

``` html
<!-- 父级模板 -->
<div v-component="my-component"></div>
```

如果你愿意，也能以自定义元素标签的形式使用组件：

``` html
<my-component></my-component>
```

<p class="tip">为了避免与本地元素发生命名冲突，也为了与 W3C 自定义元素规范一致，组件的 ID **必须**包含一个连字符 `-` 才能作为自定义标签使用。</p>

理解 `Vue.extend()` 和 `Vue.component()` 的区别至关重要。由于 `Vue` 本身是一个构造函数， `Vue.extend()` 是一个**类继承方法**。它用来创建一个 `Vue` 的子类并返回其构造函数。而另一方面，`Vue.component()` 是一个类似 `Vue.directive()` 和 `Vue.filter()` 的**资源注册方法**。它作用是建立指定的构造函数与 ID 字符串间的关系，从而让 Vue.js 能在模板中使用它。直接向 `Vue.component()` 传递 options 时，它会在内部调用 `Vue.extend()`。

Vue.js 支持两种不同的 API 规范：基于类的命令式的 Backbone 风格 API，以及基于标记的声明式的 Web Components 风格 API。如果你感到困惑，想一下通过 `new Image()` 和通过 `<img>` 标签这两种创建图片元素的方式。它们都在各自的适用场景下发挥着作用，为了尽可能灵活，Vue.js 同时提供这两种方式。

## 数据继承

### 显式数据传递

默认情况下，组件有**独立作用域**。这意味着你无法在子组件的模板中引用父级的数据。可以通过 `v-with` 命令把数据显式传递给拥有独立作用域的子组件。

#### 向下传递子 `$data` 对象

只给出 keypath 而不传递参数时，父级上相应的数据会传递给子级作为 `$data` 对象。这意味着传递的数据必须是一个对象，并且它会覆盖子组件可能包含的默认 `$data` 对象。

**示例：**

``` html
<div id="demo-1">
  <p v-component="user-profile" v-with="user"></p>
</div>
```

``` js
// 先注册组件
Vue.component('user-profile', {
  template: '{&#123;name&#125;}<br>{&#123;email&#125;}'
})
// `user` 对象会传递给子级
// 作为 $data
var parent = new Vue({
  el: '#demo-1',
  data: {
    user: {
      name: 'Foo Bar',
      email: 'foo@bar.com'
    }
  }
})
```

**结果：**

<div id="demo-1" class="demo"><p v-component="user-profile" v-with="user"></p></div>
<script>
  Vue.component('user-profile', {
    template: '{&#123;name&#125;}<br>{&#123;email&#125;}'
  })
  var parent = new Vue({
    el: '#demo-1',
    data: {
      user: {
        name: 'Foo Bar',
        email: 'foo@bar.com'
      }
    }
  })
</script>

#### 向下传递单个属性

`v-with` 也能以 `v-with="childProp: parentProp"` 的形式传入一个参数来使用。也就是把 `parent[parentProp]` 向下传递给子级，作为子级的属性 `child[childProp]`。从 0.11.5 版本开始，这将会在两者之间建立一个双向的数据绑定（0.11 的更早版本此绑定是单向的）。

**示例：**

``` html
<div id="demo-2">
  <input v-model="parentMsg">
  <p v-component="child" v-with="childMsg : parentMsg">
    <!-- 实际上表示 "把 `parentMsg` 绑定到我的 `childMsg` 属性上" -->
  </p>
</div>
```

``` js
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Inherited message'
  },
  components: {
    child: {
      template: '<span>{&#123;childMsg&#125;}</span>'
    }
  }
})
```

**结果**

<div id="demo-2" class="demo"><input v-model="parentMsg"><p v-component="child" v-with="childMsg:parentMsg"></p></div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Inherited message'
  },
  components: {
    child: {
      template: '<span v-text="childMsg"></span>'
    }
  }
})
</script>

#### 使用 `paramAttributes` 参数标识

同样可以通过 [`paramAttributes`](../api/options.html#paramAttributes) 选项（会被编译成 `v-with` ）来暴露一个看起来更像自定义元素的接口。

``` html
<div id="demo-3">
  <input v-model="parentMsg">
  <child-component child-msg="{{parentMsg}}"></child-component>
</div>
```

``` js
new Vue({
  el: '#demo-3',
  data: {
    parentMsg: 'Inherited message'
  },
  components: {
    'child-component': {
      paramAttributes: ['child-msg'],
      // 连字符分隔的属性会被转成驼峰形式，
      // 所以“child-msg”成了“this.childMsg”
      template: '<span>{&#123;childMsg&#125;}</span>'
    }
  }
})
```

### 作用域继承

如果有需要，你也可以使用 `inherit: true` 选项来让子组件通过原型链继承父级的全部属性：

``` js
var parent = new Vue({
  data: {
    a: 1
  }
})
// $addChild() 是一个实例方法，
// 它允许你用代码创建子实例。
var child = parent.$addChild({
  inherit: true,
  data: {
    b: 2
  }
})
console.log(child.a) // -> 1
console.log(child.b) // -> 2
parent.a = 3
console.log(child.a) // -> 3
```

这里有一点需要注意：由于 Vue 示例上的数据属性都是 getter/setter，设置 `child.a = 2` 会直接改变 `parent.a` 的值，而非在子级创建一个新属性遮蔽父级中的属性：

``` js
child.a = 4
console.log(parent.a) // -> 4
console.log(child.hasOwnProperty('a')) // -> false
```

### 作用域注意事项

当组件被用在父模板中时，例如：

``` html
<!-- 父模板 -->
<div v-component v-show="active" v-on="click:onClick"></div>
```

这里的命令（ `v-show` 和 `v-on` ）会在父作用域编译，所以 `active` 和 `onClick` 的取值取决于父级。任何子模版中的命令和插值都会在子作用域中编译。这样使得上下级组件间更好地分离。

这条规则同样适用于 [内容插入](#内容插入)，这一点会在下文中详述。

## 组件生命周期

每一个组件，或者说 Vue 的实例，都有着自己的生命周期：它会被创建、编译、附加、分离，最终销毁。在这每一个关键点，实例都会触发相应的事件，而在创建实例或者定义组件时，我们可以传入生命周期钩子函数来响应这些事件。例如：

``` js
var MyComponent = Vue.extend({
  created: function () {
    console.log('An instance of MyComponent has been created!')
  }
})
```

查阅 API 文档中可用的 [生命周期钩子函数完整列表](../api/options.html#Lifecycle)。

## 动态组件

你可以通过在 `v-component` 命令中使用 Mustache 标签的方式在组件间动态切换，还能与路由一起使用实现“页面切换”：

``` js
new Vue({
  el: 'body',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<div v-component="{&#123;currentView&#125;}">
  <!-- 内容随 vm.currentview 一同改变！ -->
</div>
```

如果希望被切换出去的组件保持存活，从而保留它的当前状态或者避免反复重新渲染，你可以加上 `keep-alive` 命令参数：

``` html
<div v-component="{&#123;currentView&#125;}" keep-alive>
  <!-- 不活跃的的组件会被缓存！ -->
</div>
```

### 过渡控制

有两个额外的属性能够支持对动态组件间的切换方式进行高级控制。

#### `wait-for` 等待事件

等待即将进入的组件触发该事件后再用新组件替换当前组件。这就允许你等待数据异步加载完成后再触发过渡，避免切换过程中出现空白闪烁。

**示例：**

``` html
<div v-component="&#123;{view}&#125;" wait-for="data-loaded"></div>
```
``` js
// 组件定义
{
  // 获取数据并在编译完成钩子函数中异步触发事件。
  // 这里jQuery只是用作演示。
  compiled: function () {
    var self = this
    $.ajax({
      // ...
      success: function (data) {
        self.$data = data
        self.$emit('data-loaded')
      }
    })
  }
}
```

#### `transition-mode` 过渡模式

默认情况下，进入组件和退出组件的过渡是同时进行的。这个参数允许设置成另外两种模式：

- `in-out`：先进后出；先执行新组件过渡，当前组件在新组件过渡结束后执行过渡并退出。
- `out-in`：先出后进；当前组件首先执行过渡并退出，新组件在当前组件过渡结束后执行过渡并进入。

**示例：**

``` html
<!-- 先淡出，之后淡入 -->
<div v-component="&#123;{view}&#125;"
  v-transition="fade"
  transition-mode="out-in">
</div>
```

## 列表与组件

对于一个对象数组，你可以把 `v-component` 和 `v-repeat` 组合使用。这种场景下，对于数组中的每个对象，都以该对象为数据创建一个子 ViewModel，以指定组件作为构造函数。

``` html
<ul id="demo-4">
  <!-- 复用我们之前注册过的 user-profile 组件 -->
  <li v-repeat="users" v-component="user-profile"></li>
</ul>
```

``` js
var parent2 = new Vue({
  el: '#demo-4',
  data: {
    users: [
      {
        name: 'Chuck Norris',
        email: 'chuck@norris.com'
      },
      {
        name: 'Bruce Lee',
        email: 'bruce@lee.com'
      }
    ]
  }
})
```

**结果：**

<ul id="demo-4" class="demo"><li v-repeat="users" v-component="user-profile"></li></ul>
<script>
var parent2 = new Vue({
  el: '#demo-4',
  data: {
    users: [
      {
        name: 'Chuck Norris',
        email: 'chuck@norris.com'
      },
      {
        name: 'Bruce Lee',
        email: 'bruce@lee.com'
      }
    ]
  }
})
</script>

## 子组件引用

某些情况下需要通过 JavaScript 访问嵌套的子组件。要实现这种操作，需要使用 `v-ref` 为子组件分配一个 ID。例如：

``` html
<div id="parent">
  <div v-component="user-profile" v-ref="profile"></div>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// 访问子组件
var child = parent.$.profile
```

当 `v-ref` 与 `v-repeat` 一同使用时，会获得一个与数据数组对应的子组件数组。

## 事件系统

虽然你可以直接访问一个 ViewModel 的子级与父级，但是通过内建的事件系统进行跨组件通讯更为便捷。这还能使你的代码进一步解耦，变得更易于维护。一旦建立了上下级关系，就能使用 ViewModel 的 [事件示例方法](../api/instance-methods.html#Events) 来分发和触发事件。

``` js
var Child = Vue.extend({
  created: function () {
    this.$dispatch('child-created', this)
  }
})

var parent = new Vue({
  template: '<div v-component="child"></div>',
  components: {
    child: Child
  },
  created: function () {
    this.$on('child-created', function (child) {
      console.log('new child created: ')
      console.log(child)
    })
  }
})
```

<script>
var Child = Vue.extend({
  created: function () {
    this.$dispatch('child-created', this)
  }
})

var parent = new Vue({
  el: document.createElement('div'),
  template: '<div v-component="child"></div>',
  components: {
    child: Child
  },
  created: function () {
    this.$on('child-created', function (child) {
      console.log('new child created: ')
      console.log(child)
    })
  }
})
</script>

## 私有资源

有时一个组件需要使用类似命令、过滤器和子组件这样的资源，但是又希望把这些资源封装起来以便自己在别处复用。这一点可以用私有资源实例化选项来实现。私有资源只能被拥有该资源的组件的实例及其子组件访问。

``` js
// 全部5种类型的资源
var MyComponent = Vue.extend({
  directives: {
    // “id : 定义”键值对，与处理全局方法的方式相同
    'private-directive': function () {
      // ...
    }
  },
  filters: {
    // ...
  },
  components: {
    // ...
  },
  partials: {
    // ...
  },
  effects: {
    // ...
  }
})
```

又或者，可以用与全局资源注册方法类似的链式 API 为现有组件构造方法添加私有资源：

``` js
MyComponent
  .directive('...', {})
  .filter('...', function () {})
  .component('...', {})
  // ...
```

## 内容插入

在创建可复用组件时，我们通常需要在宿主元素中访问和重用原始数据，而它们并非组件的一部分（类似 Angular 的“transclusion”概念）。 Vue.js 实现了一套内容插入机制，它和目前的 Web Components 规范草案兼容，使用特殊的 `<content>` 元素作为原始内容的插入点。

<p class="tip">注意：“transcluded”内容在父组件的作用域中编译。</p>

### 单插入点

只有一个不带属性的 `<content>` 标签时，整个原始内容都会被插入到它在 DOM 中的位置并把它替换掉。原来在 `<content>` 标签内部的所有内容会被视为 **后备内容**。后备内容只有在宿主元素为空且没有要插入的内容时才会被显示。例如：

`my-component` 的模板：

``` html
<h1>This is my component!</h1>
<content>This will only be displayed if no content is inserted</content>
```

使用该组件的父标签：

``` html
<div v-component="my-component">
  <p>This is some original content</p>
  <p>This is some more original content</p>
</div>
```

渲染结果如下：

``` html
<div>
  <h1>This is my component!</h1>
  <p>This is some original content</p>
  <p>This is some more original content</p>
</div>
```

### 多插入点

`<content>` 元素有一个特殊属性 `select`，需要赋值为一个 CSS 选择器。可以使用多个包含不同 `select` 属性的 `<content>` 插入点，它们会被原始内容中与选择器匹配的部分所替代。

`multi-insertion-component` 的模板：

``` html
<content select="p:nth-child(3)"></content>
<content select="p:nth-child(2)"></content>
<content select="p:nth-child(1)"></content>
```

父标签：

``` html
<div v-component="multi-insertion-component">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>
</div>
```

渲染结果如下：

``` html
<div>
  <p>Three</p>
  <p>Two</p>
  <p>One</p>
</div>
```

内容插入机制能很好地控制对原始内容的操作和显示，使组件极为灵活多变易于组合。

下一节：[过渡效果](../guide/transitions.html)
