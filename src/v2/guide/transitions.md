---
title: 进入、离开和列表的过渡
type: guide
order: 13
---

## 概述

当从 DOM 中插入、更新或移除项目时，Vue 提供多种应用过渡效果的方式。包括以下工具：

- 在 CSS 过渡和动画中自动处理 class
- 可以配合使用第三方 CSS 动画库，如 Animate.css
- 在过渡钩子函数中使用 JavaScript 直接操作 DOM
- 可以配合使用第三方 JavaScript 动画库，如 Velocity.js

本页面中，我们只会涉及到进入、离开和列表的过渡，然而你也可以查看下一章节[管理过渡状态](transitioning-state.html).

## 单元素/组件的过渡

Vue 提供了 `transition` 外层包裹容器组件(wrapper component)，可以给下列情形中的任何元素和组件添加进入/离开(enter/leave)过渡

- 条件渲染（使用 `v-if`）
- 条件展示（使用 `v-show`）
- 动态组件
- 组件根节点

这是一个常见行为的简单示例：

``` html
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
```

``` css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
  opacity: 0;
}
```

{% raw %}
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="demo-transition">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>
<style>
.demo-transition-enter-active, .demo-transition-leave-active {
  transition: opacity .5s
}
.demo-transition-enter, .demo-transition-leave-to {
  opacity: 0
}
</style>
{% endraw %}

当插入或删除包含在 `transition` 组件中的元素时，Vue 将会做以下处理：

1. 自动嗅探目标元素是否使用了 CSS 过渡或动画，如果使用，会在合适的时机添加/移除 CSS 过渡 class。

2. 如果过渡组件设置了 [JavaScript 钩子函数](#JavaScript-Hooks)，这些钩子函数将在合适的时机调用。

3. 如果没有检测到 CSS 过渡/动画，并且也没有设置 JavaScript 钩子函数，插入和/或删除 DOM 的操作会在下一帧中立即执行。（注意：这里的帧是指浏览器逐帧动画机制，和 Vue 的 `nextTick` 概念不同）

### 过渡类名(Transition Classes)

有 6 种 class 类名会在进入/离开(enter/leave)过渡中处理

1. `v-enter`：进入式过渡(entering transition)的开始状态。在插入元素之前添加，在插入元素之后一帧移除。

2. `v-enter-active`：进入式过渡的激活状态。应用于整个进入式过渡时期。在插入元素之前添加，过渡/动画(transition/animation)完成之后移除。此 class 可用于定义进入式过渡的 duration, delay 和 easing 曲线。

3. `v-enter-to`：**仅适用于版本 2.1.8+。**进入式过渡的结束状态。在插入元素之后一帧添加（同时，移除 `v-enter`），在过渡/动画完成之后移除。

4. `v-leave`：离开式过渡(leaving transition)的开始状态。在触发离开式过渡时立即添加，在一帧之后移除。

5. `v-leave-active`：离开式过渡的激活状态。应用于整个离开式过渡时期。在触发离开式过渡时立即添加，在过渡/动画(transition/animation)完成之后移除。此 class 可用于定义离开式过渡的 duration, delay 和 easing 曲线。

6. `v-leave-to`：**仅适用于版本 2.1.8+。**离开式过渡的结束状态。在触发离开式过渡之后一帧添加（同时，移除 `v-leave`），在过渡/动画完成之后移除。

![Transition Diagram](/images/transition.png)

对于这些过渡中切换 class，每个都以过渡的 name 作为前缀。当你使用没有 name 的 `<transition>` 元素时，会默认前缀为 `v-`。举个例子，如果你使用 `<transition name="my-transition">`，那么默认的 `v-enter` class 将会被替换为 `my-transition-enter`。

`v-enter-active` 和 `v-leave-active` 可以指定不同的进入/离开过渡 easing 曲线，下面章节可以看到一个示例。

### CSS 过渡(CSS Transitions)

最常用到的过渡类型是使用 CSS 过渡。下面是一个示例：

``` html
<div id="example-1">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
```

``` css
/* 进入和离开动画可以分别 */
/* 设置不同的持续时间(duration)和动画函数(timing function) */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 在低于 2.1.8 版本中 */ {
  transform: translateX(10px);
  opacity: 0;
}
```

{% raw %}
<div id="example-1" class="demo">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
{% endraw %}

### CSS 动画(CSS Animations)

CSS 动画用法和 CSS 过渡相同，区别是在动画中 `v-enter` 类名在元素插入 DOM 后不会立即删除，而是在 `animationend` 事件触发时删除。

这里是一个示例，为了简洁省略了 CSS 规则的前缀：

``` html
<div id="example-2">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
```

``` css
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

{% raw %}
<div id="example-2" class="demo">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-show="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>

<style>
  .bounce-enter-active {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    -webkit-animation: bounce-in .5s reverse;
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
<script>
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### 自定义过渡的 class 类名(Custom Transition Classes)

你也可以通过提供一下属性来指定自定义过渡类名

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

它们将覆盖默认约定的类名，这对于将 Vue 的过渡系统和其他现有的第三方 CSS 动画库（如 [Animate.css](https://daneden.github.io/animate.css/)）集成使用会非常有用。

这里是一个示例：

``` html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
```

{% raw %}
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
<div id="example-3" class="demo">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### 同时使用过渡和动画(Using Transitions and Animations Together)

Vue 为了知道过渡何时完成，必须附加相应的事件监听器。它可以是 `transitionend` 或 `animationend`，这取决于给元素应用的 CSS 规则。如果你使用其中任何一种，Vue 能自动识别正确的类型并设置相应的事件监听器。

但是，在一些情况下，你可能需要给同一个元素同时设置过渡和动画，比如由 Vue 触发 CSS 动画，同时在鼠标悬停时触发 CSS 过渡。在这种情况下，你可能需要通过 `type` 属性，来显式声明需要 Vue 监听的类型，值可以是 `animation` 或 `transition`。

### 显式过渡持续时间(Explicit Transition Durations)

> 2.2.0+ 新增

在大多数情况下，Vue 可以自动推断出过渡完成时间。默认情况下，Vue 会过渡根元素的第一个 `transitionend` 或 `animationend` 事件触发所需的等待时间。然而，这可能并不总是我们想要的 - 例如，我们可能具有设计安排的过渡序列(transition sequence)：其中一些嵌套的内部元素（在根元素过渡完成后）还具有延续的过渡效果，或比过渡根元素更长的过渡持续时间。

在这种情况下，你可以使用 `<transition>` 组件上的 `duration` 属性 ，来指定一个显式的过渡持续时间（以毫秒为单位）：

``` html
<transition :duration="1000">...</transition>
```

你还可以为进入式和离开式持续时间指定不同的值：

``` html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### JavaScript 钩子函数

可以在属性中声明 JavaScript 钩子

``` html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

``` js
// ...
methods: {
  // --------
  // 进入时
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // 在与 CSS 结合使用时
  // 此回调函数 done 是可选项
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 在与 CSS 结合使用时
  // 此回调函数 done 是可选项
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只能配合 v-show 使用
  leaveCancelled: function (el) {
    // ...
  }
}
```

这些钩子函数可以结合 CSS 过渡/动画使用，也可以单独使用。

<p class="tip">当仅使用 JavaScript 式过渡的时候， **在 `enter` 和 `leave` 钩子函数中，必须有 `done` 回调函数**。否则，这两个钩子函数会被同步调用，过渡会立即完成。</p>

<p class="tip">推荐对于仅使用 JavaScript 的过渡显式添加 `v-bind:css="false"`，以便 Vue 可以跳过 CSS 侦测。这也可以防止 CSS 规则意外干涉到过渡。</p>

现在我们深入来看一个示例。这里是一个使用 Velocity.js 的 JavaScript 式过渡：

``` html
<!--
Velocity works very much like jQuery.animate and is
a great option for JavaScript animations
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="example-4">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
```

{% raw %}
<div id="example-4" class="demo">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script>
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
</script>
{% endraw %}

## 在初始渲染时过渡

如果你还想在节点初始渲染时应用过渡，可以添加 `appear` 属性：

``` html
<transition appear>
  <!-- ... -->
</transition>
```

默认情况下，对于进入和离开，会使用特定过渡。但是，如果你有需要，也可以指定自定义 CSS 类名：

``` html
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class"（仅 >= 2.1.8 支持）
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```

以及指定自定义 JavaScript 钩子函数：

``` html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

## 多个元素之间切换过渡

我们将在下面讨论[多个元素之间切换过渡](#多个元素之间切换过渡)，但是还是可以使用 `v-if`/`v-else`，来对初始元素之间进行切换过渡。最常见的是，一个列表容器和描述列表为空的消息，这两个元素间的切换过渡：

``` html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```

可以这样使用，但是有一点事项需要注意：

<p class="tip">当在具有**相同标签名称**的元素之间切换时，需要通过给它们分配唯一的 `key` 属性，以使 Vue 感知它们是不同的元素。否则 Vue 的编译器将因为效率，只会替换元素内部的内容。即使在技术上没有必要，但是，**给 `<transition>` 组件中的多个元素设置 key，被认为是一个最佳实践。**</p>

示例:

``` html
<transition>
  <button v-if="isEditing" key="save">
    Save
  </button>
  <button v-else key="edit">
    Edit
  </button>
</transition>
```

在上面这种场景中，也通过给同一元素的 `key` 属性，设置不同的状态来进行过渡。而无需使用 `v-if` 和 `v-else`，所以上面的示例可以重写为：

``` html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Save' : 'Edit' }}
  </button>
</transition>
```

实际上，使用 `v-if` 的多个元素之间的过渡，还可以改为在单个元素上绑定动态属性的方式，来在任意数量的元素之间进行转换。例如：

``` html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

可以重写为：

``` html
<transition>
  <button v-bind:key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

``` js
// ...
computed: {
  buttonMessage: function () {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```

### 过渡模式

这里还有一个问题，试着点击下面的按钮：

{% raw %}
<div id="no-mode-demo" class="demo">
  <transition name="no-mode-fade">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#no-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-fade-enter-active, .no-mode-fade-leave-active {
  transition: opacity .5s
}
.no-mode-fade-enter, .no-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

在 "on" 按钮和 "off" 按钮之间过渡时，这两个按钮会同步渲染 - 当一个过渡进入时，另一个过渡离开。这是 `<transition>` 的默认行为 - 进入和离开同时发生。

有时这样做是非常合理的，比如，在过渡的条目都是绝对定位时：

{% raw %}
<div id="no-mode-absolute-demo" class="demo">
  <div class="no-mode-absolute-demo-wrapper">
    <transition name="no-mode-absolute-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-absolute-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-absolute-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-absolute-demo-wrapper button {
  position: absolute;
}
.no-mode-absolute-fade-enter-active, .no-mode-absolute-fade-leave-active {
  transition: opacity .5s;
}
.no-mode-absolute-fade-enter, .no-mode-absolute-fade-leave-active {
  opacity: 0;
}
</style>
{% endraw %}

然后，还可以将元素位移，使它们看起来具有滑动过渡效果：

{% raw %}
<div id="no-mode-translate-demo" class="demo">
  <div class="no-mode-translate-demo-wrapper">
    <transition name="no-mode-translate-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-translate-demo-wrapper button {
  position: absolute;
}
.no-mode-translate-fade-enter-active, .no-mode-translate-fade-leave-active {
  transition: all 1s;
}
.no-mode-translate-fade-enter, .no-mode-translate-fade-leave-active {
  opacity: 0;
}
.no-mode-translate-fade-enter {
  transform: translateX(31px);
}
.no-mode-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

同时生效的进入式和离开式过渡不能满足所有要求，所以 Vue 提供了可选的**过渡模式**：

- `in-out`：新元素先过渡进入(transition in)，过渡完成之后，当前元素过渡离开(transition out)。

- `out-in`：当前元素先过渡离开(transition out)，过渡完成之后，新元素过渡进入(transition in)。

现在，让我们用 `out-in` 模式，更新下前面的 on/off 按钮过渡：

``` html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

{% raw %}
<div id="with-mode-demo" class="demo">
  <transition name="with-mode-fade" mode="out-in">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#with-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.with-mode-fade-enter-active, .with-mode-fade-leave-active {
  transition: opacity .5s
}
.with-mode-fade-enter, .with-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

只需添加一个额外的属性，就解决了最初的过渡问题，而无需添加任何特殊样式。

`in-out` 模式不是经常用到，但对于一些稍微不同的过渡效果还是有用的。尝试将这种模式与我们之前滑动淡出过渡的示例相结合：

{% raw %}
<div id="in-out-translate-demo" class="demo">
  <div class="in-out-translate-demo-wrapper">
    <transition name="in-out-translate-fade" mode="in-out">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#in-out-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.in-out-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.in-out-translate-demo-wrapper button {
  position: absolute;
}
.in-out-translate-fade-enter-active, .in-out-translate-fade-leave-active {
  transition: all .5s;
}
.in-out-translate-fade-enter, .in-out-translate-fade-leave-active {
  opacity: 0;
}
.in-out-translate-fade-enter {
  transform: translateX(31px);
}
.in-out-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

很酷吧？

## 多个组件之间过渡

多个组件之间的过渡甚至更简单 - 我们不需要使用 `key` 属性。相反，我们需要使用[动态组件](components.html#动态组件):

``` html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
```

``` js
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
```

``` css
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active 在低于 2.1.8 版本中 */ {
  opacity: 0;
}
```

{% raw %}
<div id="transition-components-demo" class="demo">
  <input v-model="view" type="radio" value="v-a" id="a" name="view"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b" name="view"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component v-bind:is="view"></component>
  </transition>
</div>
<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
<script>
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
</script>
{% endraw %}

## 列表过渡

目前为止，关于过渡我们已经完成了：

- 单个节点
- 多个节点，其中每次只渲染一个

那么，当我们整个列表的每一项（例如使用 `v-for`）都需要同时进行渲染呢？在这种情况下，我们将使用 `<transition-group>` 组件。在我们深入示例之前，先来了解关于这个组件的一些要点：

- 不同于 `<transition>`，它会以一个真实元素渲染：默认为 `<span>`。你也可以通过 `tag` 属性更换为其他渲染元素
- 它内部的元素**必须**具有唯一的 `key` 属性

### 进入式/离开式列表过渡

现在让我们来深入一个示例，进入式过渡和离开式过渡都使用与之前相同的 CSS 类名：

``` html
<div id="list-demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
```

``` css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active 在低于 2.1.8 版本中 */ {
  opacity: 0;
  transform: translateY(30px);
}
```

{% raw %}
<div id="list-demo" class="demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
{% endraw %}

这个示例有个问题，当添加和移除项目时，其周围的项目会瞬间猛地移动到新的位置，而不是平滑过渡，我们稍后会解决这个问题。

### 列表的位移过渡

`<transition-group>` 组件还有一个暗藏玄机之处。不仅可以在进入和离开时进行动画，还可以在位置改变时进行动画。使用此功能所需要知道的唯一新的概念是，在项目位置改变时添加额外的 **`v-move` 类名**。与其他类名相同，它的前缀也和设置的 `name` 属性的值相匹配，你也可以通过 `move-class` 属性来手动指定类名。

此类名对于指定过渡时间和 easing 过渡曲线非常有用，如下所示：

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" v-bind:key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.flip-list-move {
  transition: transform 1s;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>
{% endraw %}

这个看起来很神奇，内部的实现原理是，Vue 使用了一个叫 [FLIP](https://aerotwist.com/blog/flip-your-animations/) 动画技术，可以通过使用 transform 将元素从之前的位置平滑过渡到新的位置。

我们可以将此技术与我们以前的实施相结合，为我们列表所有可能的位置变更都添加动画！

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list-complete" tag="p">
    <span
      v-for="item in items"
      v-bind:key="item"
      class="list-complete-item"
    >
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active 在低于 2.1.8 版本中 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list-complete" tag="p">
    <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
{% endraw %}

<p class="tip">需要注意的是，使用 FLIP 过渡的元素，在设置为 `display: inline` 时，无法正常运行。作为替代方案，可以将元素设置为 `display: inline-block`，或者将元素放置于 flex 上下文(flex context)中。</p>

FLIP 动画不局限于单个轴线方向(single axis)，多个维度网格(multidimensional grid)也[同样可以过渡](https://jsfiddle.net/chrisvfritz/sLrhk1bc/)：

{% raw %}
<div id="sudoku-demo" class="demo">
  <strong>Lazy Sudoku</strong>
  <p>Keep hitting the shuffle button until you win.</p>
  <button @click="shuffle">
    Shuffle
  </button>
  <transition-group name="cell" tag="div" class="sudoku-container">
    <div v-for="cell in cells" :key="cell.id" class="cell">
      {{ cell.number }}
    </div>
  </transition-group>
</div>
<script>
new Vue({
  el: '#sudoku-demo',
  data: {
    cells: Array.apply(null, { length: 81 })
      .map(function (_, index) {
        return {
          id: index,
          number: index % 9 + 1
        }
      })
  },
  methods: {
    shuffle: function () {
      this.cells = _.shuffle(this.cells)
    }
  }
})
</script>
<style>
.sudoku-container {
  display: flex;
  flex-wrap: wrap;
  width: 238px;
  margin-top: 10px;
}
.cell {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 25px;
  height: 25px;
  border: 1px solid #aaa;
  margin-right: -1px;
  margin-bottom: -1px;
}
.cell:nth-child(3n) {
  margin-right: 0;
}
.cell:nth-child(27n) {
  margin-bottom: 0;
}
.cell-move {
  transition: transform 1s;
}
</style>
{% endraw %}

### 列表的渐进过渡

通过 data 属性与 JavaScript 式过渡的通信，就可以实现列表的逐项渐进过渡：

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="staggered-list-demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#staggered-list-demo',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="example-5" class="demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
</script>
{% endraw %}

## 可复用的过渡

通过 Vue 的组件系统可以实现复用过渡。要创建一个可复用过渡，你需要做的就是将 `<transition>` 或者 `<transition-group>` 作为组件根节点，然后将全部子内容放置在 transition 组件中就可以了。

这里是使用 template 的组件的简单示例：

``` js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      v-on:before-enter="beforeEnter"\
      v-on:after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\
  ',
  methods: {
    beforeEnter: function (el) {
      // ...
    },
    afterEnter: function (el) {
      // ...
    }
  }
})
```

函数组件更适合完成这个任务：

``` js
Vue.component('my-special-transition', {
  functional: true,
  render: function (createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition',
        mode: 'out-in'
      },
      on: {
        beforeEnter: function (el) {
          // ...
        },
        afterEnter: function (el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

## 动态过渡

其实，在 Vue 中即使是过渡也是由数据驱动的！动态过渡最基本的例子是，将 `name` 属性(attribute)和动态属性(dynamic property)绑定在一起。

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

当你使用多个 Vue 过渡类名约定，来定义 CSS 过渡/动画，并在不同的类名约定之间切换时，动态过渡会非常有用。

所有的过渡属性都可以动态绑定。并且不仅是属性，由于事件钩子函数都是 Vue 的方法(methods)，所以可以从 this 上下文访问到所有数据。这意味着，根据组件的状态，JavaScript 式过渡的表现可能会有所不同。

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">hello</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Start animating</button>
  <button
    v-else
    v-on:click="stop = true"
  >Stop it!</button>
</div>
```

``` js
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="dynamic-fade-demo" class="demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">hello</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Start animating</button>
  <button
    v-else
    v-on:click="stop = true"
  >Stop it!</button>
</div>
<script>
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
</script>
{% endraw %}

最后，创建动态过渡的最终方案是，组件通过接受 prop 来动态修改之前的过渡。还是那句话，唯一限制你的是想象力。

***

> 原文：https://vuejs.org/v2/guide/transitions.html

***
