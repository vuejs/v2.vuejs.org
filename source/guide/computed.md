title: 可推导的属性
type: guide
order: 8
---

Vue.js 的内联表达式非常方便，但它最好的用武之地其实是简单的布尔操作或字符串拼接。如果涉及更复杂的逻辑，你应该使用**可推导的属性**。

在 Vue.js 中，你可以通过 `computed` 选项定义可推导的属性：

``` js
var demo = new Vue({
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: {
      // the getter should return the desired value
      get: function () {
        return this.firstName + ' ' + this.lastName
      },
      // the setter is optional
      set: function (newValue) {
        var names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
      }
    }
  }
})

demo.fullName // 'Foo Bar'
```

当你只需要 getter 的时候，你可以用一个简单的函数替代该对象：

``` js
// ...
computed: {
  fullName: function () {
    return this.firstName + ' ' + this.lastName 
  }    
}
// ...
```

一个可推导的属性本质上是一个被 getter/setter 函数定义了的属性。可推导的属性使用起来和一般属性一样，只是在访问它的时候，你会得到 getter 函数返回的值，改变它的时候，你会触发 setter 函数并接收新赋的值。

<p class="tip">在 Vue.js 0.11 之前的版本中，曾经有依赖收集机制，需要用户在条件语句中显性列出依赖关系。而在 0.11 之后你已经无需这样做了。</p>

接下来，我们学一学如何[撰写一个自定义的指令](../guide/custom-directive.html).