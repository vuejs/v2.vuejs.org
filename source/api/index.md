title: "The Vue Constructor"
type: api
order: 1
---

`Vue`的构造函数是Vue.js的核心。它允许你创建Vue实例。创建一个Vue实例非常简单明了：

``` js
var vm = new Vue({ /* options */ })
```

当你初始化一个Vue实例，你需要传递一个包括DOM对象，data对象，mixin方法，生命周期回调函数等内容的option对象。完整列表见[初始化参数](../api/options.html)。

每个Vue实例本质上就是一个ViewModel (因此在本文档中你会看到好多变量名叫`vm`)。每个实例都有一个DOM对象属性叫`$el`，它大致相当于MVVM中的V。每个实例也有一个JavaScript对象属性叫`$data`，相对应的就是MVVM中的M。改变M会触发V的更新。对于双向绑定，用户对V的介入会触发M中的变化。详细请看[实例属性](../api/instance-properties.html)。

初始化的时候，如果你提供了`el`，那么这个实例就会直接进入编译阶段(compilation phase)。否则只有执行了`vm.$mount()`才会开始编译。在编译过程，Vue会走遍DOM树来收集遇到的指令(directives)，然后通过这些指令建立数据和DOM的关系。一旦完成，就可以说现在这些DOM节点是被Vue实例来管理了。一个DOM节点只能被一个Vue实例管理，而且不会被2次编译。

Vue实例通过代理方法访问他们的`$data`对象，如果你有个变量叫msg，你可以通过`vm.$data.msg`访问也可以通过`vm.msg`来访问。看起来有点神奇，但这完全是可选的。你完全可以就用`vm.$data.msg` 这种方式来访问。但不管怎样，我们仍需要注意到`vm`和`vm.$data`的区别，因为前者是不能作为数据对象被别的Vue实例监视的。

还有一点值得注意的是数据对象(data objects)并不只属于一个Vue实例，多个ViewModel可以监视同一个数据对象，不论是`$data`本身还是它的属性。当多个组件需要共享一个全局状态数据对象的时候，这个特性就非常有用。

每个Vue实例也有不少[实例方法](../api/instance-methods.html)，包括数据监视，事件通讯和DOM操作。

最后，`Vue`的构造函数本身还有几个[全局API](../api/global-api.html)，能够让你扩展`Vue`的类，配置全局属性以及注册全局自定义组件，像components，directives，filters等等。