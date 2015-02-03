title: 过渡效果
type: guide
order: 12
---

通过Vue.js的过渡系统，在节点插入/移除DOM的过程中，你可以轻松的运用自动过渡效果。这里有两个方式可以使用过渡系统：定义带有过渡效果/动画的css class，或者注册一个包含自定义JavaScript钩子函数的对象。

通过使用`v-transition="my-transition"`指令的运用，Vue将会：

1. 试着找到一个id为`"my-transition"`,并且通过`Vue.transition(id, def)`或经过`transitions`选项处理的Javascript过渡定义。当找到时，Vue将会使用该定义对象执行自定义的JavaScript过渡。

2. 如果没有找到自定义的Javacript过渡定义，那么Vue将会自动发现使用了CSS过渡/动画效果的目标元素，并在适当的时机添加/移除CSS class。

3. 如果没有检测到过渡/动画，那么就会在下一帧直接执行DOM操作

<p class="tip">所有的Vue.js过渡效果只会在Vue.js执行DOM操作时才会被触发；或者通过内建指令集，例如`v-if`；或者通过Vue实例方法，例如`vm.$appendTo()`</p>

## CSS 过渡效果

一个典型的CSS过渡效果定义如下：

``` html
<p class="msg" v-if="show" v-transition="expand">Hello!</p>
```

你需要给`.expand-enter` 和 `.expand-leave`定义CSS规则：

``` css
.msg {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
.msg.expand-enter, .msg.expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
```

<div id="demo"><p class="msg" v-if="show" v-transition="expand">Hello!</p><button v-on="click: show = !show">Toggle</button></div>

<style>
.msg {
  transition: all .5s ease;
  height: 30px;
  background-color: #eee;
  overflow: hidden;
  padding: 10px;
  margin: 0 !important;
}
.msg.expand-enter, .msg.expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
</style>

<script>
new Vue({
  el: '#demo',
  data: { show: true }
})
</script>

这些class根据`v-transition`指令指定的值进行触发。在指定`v-transition="fade"`这个例子中，通过`.fade-enter`和`.fade-leave`来触发class变换。当未指定值的时候，则使用默认`.v-enter`和`.v-leave`

当`show`属性发生变化，Vue.js依据其变化来插入/移除`<p>`元素，并使用过渡class，具体如下：

- 当`show`为false时，Vue.js将会：
  1. 将`v-leave`类应用于元素并触发过渡效果；
  2. 等待过渡效果执行完毕； (通过监听一个`transitionend`事件)
  3. 从DOM中移除节点并移除class `v-leave`.

- 当`show`为true时，Vue.js将会：
  1. 将class`v-enter`应用于节点上；
  2. 将节点插入DOM；
  3. 触发CSS布局变化，`v-enter`定义的效果将会被自动应用；
  4. 移除class`v-enter`，触发节点过渡效果，回到节点默认状态。

<p class="tip">当多个节点同时触发过渡效果时，Vue.js将会进行批量处理，只触发一次布局修改</p>

## CSS 动画

CSS 动画通过与CSS过渡效果一样的方式进行调用，区别就是动画中`v-enter`并不会在节点插入DOM后马上移除，而是在`animationend`回调中移除

**示例：** (省略了css前缀的规则)

``` html
<p class="animated" v-if="show" v-transition="bounce">Look at me!</p>
```

``` css
.animated {
  display: inline-block;
}
.animated.bounce-enter {
  animation: bounce-in .5s;
}
.animated.bounce-leave {
  animation: bounce-out .5s;
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
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}
```

<div id="anim" class="demo"><span class="animated" v-if="show" v-transition="bounce">Look at me!</span><br><button v-on="click: show = !show">Toggle</button></div>

<style>
  .animated {
    display: inline-block;
  }
  .animated.bounce-enter {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .animated.bounce-leave {
    -webkit-animation: bounce-out .5s;
    animation: bounce-out .5s;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    50% {
      transform: scale(1.5);
      -webkit-transform: scale(1.5);
    }
    100% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
  @keyframes bounce-out {
    0% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
    50% {
      transform: scale(1.5);
      -webkit-transform: scale(1.5);
    }
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-out {
    0% {
      -webkit-transform: scale(1);
    }
    50% {
      -webkit-transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(0);
    }
  }
</style>

<script>
new Vue({
  el: '#anim',
  data: { show: true }
})
</script>

## Javascript 方法

以下的例子中，使用了jQuery注册一个自定义Javascript的过渡效果：

``` js
Vue.transition('fade', {
  beforeEnter: function (el) {
    // a synchronous function called right before the
    // element is inserted into the document.
    // you can do some pre-styling here to avoid
    // FOC (flash of content).
  },
  enter: function (el, done) {
    // element is already inserted into the DOM
    // call done when animation finishes.
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
    // optionally return a "cancel" function
    // to clean up if the animation is cancelled
    return function () {
      $(el).stop()
    }
  },
  leave: function (el, done) {
    // same as enter
    $(el).animate({ opacity: 0 }, 1000, done)
    return function () {
      $(el).stop()
    }
  }
})
```
之后你就可以通过给`v-transition`指定过渡ID来应用。注意，通过Javascript声明的过渡比CSS过渡优先级高。

``` html
<p v-transition="fade"></p>
```
下一节：[创建大型应用](../guide/application.html).