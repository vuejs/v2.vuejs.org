title: 过滤器
type: guide
order: 4
---

## 摘要

一个 Vue.js 的过滤器本质上是一个函数，这个函数会接收一个值，将其处理并返回。它被标记在一个竖线 (`|`) 之后，并可以跟随一个或多个参数：

``` html
<element directive="expression | filterId [args...]"></element>
```

## 示例

过滤器必须放置在一个指令的值的最后：

``` html
<span v-text="message | capitalize"></span>
```

你也可以用在 mustache 风格的绑定的内部：

``` html
<span>&#123;&#123;message | uppercase&#125;&#125;</span>
```

可以把多个过滤器链在一起：

``` html
<span>&#123;&#123;message | lowercase | reverse&#125;&#125;</span>
```

## 参数

一些过滤器是可以附带参数的。只需用空格分隔开：

``` html
<span>&#123;&#123;order | pluralize st nd rd th&#125;&#125;</span>
```

``` html
<input v-on="keyup: submitForm | key enter">
```

上述示例的具体用法参见[完整的内建过滤器列表](/api/filters.html)。

现在你已经了解了指令和过滤器，接下来我们趁热打铁[展示一个列表](/guide/list.html)吧。