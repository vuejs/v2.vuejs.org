title: 列表展示
type: guide
order: 5
---

你可以使用 `v-repeat` 指令基于ViewModel上的对象数组来重复显示模板元素。对于数组中的每个对象，该指令将创建一个以该对象作为其 `$data` 对象的子Vue实例。这些子实例继承父实例的所有数据，因此在重复的模板元素中你既可以访问子实例的属性，也可以访问父实例的属性。此外,你还可以访问 `$index` 属性，其表示所呈现的实例在对象数组中对应的索引。.

**示例:**

``` html
<ul id="demo">
  <li v-repeat="items" class="item-{&#123;$index&#125;}">
    {&#123;$index&#125;} - {&#123;parentMsg&#125;} {&#123;childMsg&#125;}
  </li>
</ul>
```

``` js
var demo = new Vue({
  el: '#demo',
  data: {
    parentMsg: 'Hello',
    items: [
      { childMsg: 'Foo' },
      { childMsg: 'Bar' }
    ]
  }
})
```

**结果:**

<ul id="demo"><li v-repeat="items" class="item-{&#123;$index&#125;}">{&#123;$index&#125;} - {&#123;parentMsg&#125;} {&#123;childMsg&#125;}</li></ul>
<script>
var demo = new Vue({
  el: '#demo',
  data: {
    parentMsg: 'Hello',
    items: [
      { childMsg: 'Foo' },
      { childMsg: 'Bar' }
    ]
  }
})
</script>

## 简单值数组

对于包含简单值的数组，你可用 `$value` 直接访问值:

``` html
<ul id="tags">
  <li v-repeat="tags">
    {&#123;$value&#125;}
  </li>
</ul>
```

``` js
new Vue({
  el: '#tags',
  data: {
    tags: ['JavaScript', 'MVVM', 'Vue.js']
  }
})
```

**结果:**
<ul id="tags" class="demo"><li v-repeat="tags">{&#123;$value&#125;}</li></ul>
<script>
new Vue({
  el: '#tags',
  data: {
    tags: ['JavaScript', 'MVVM', 'Vue.js']
  }
})
</script>

## 使用标识符

有时我们可能想要更明确地访问变量而不是隐式地回退到父作用域。你可以通过提供一个参数给 `v-repeat` 指令并用它作为将被迭代项的标识符:

``` html
<ul id="users">
  <!-- think of this as "for each user in users" -->
  <li v-repeat="user: users">
    {&#123;user.name&#125;} - {&#123;user.email&#125;}
  </li>
</ul>
```

``` js
new Vue({
  el: '#users',
  data: {
    users: [
      { name: 'Foo Bar', email: 'foo@bar.com' },
      { name: 'John Doh', email: 'john@doh.com' }
    ]
  }
})
```

**结果:**
<ul id="users" class="demo"><li v-repeat="user: users">{&#123;user.name&#125;} - {&#123;user.email&#125;}</li></ul>
<script>
new Vue({
  el: '#users',
  data: {
    users: [
      { name: 'Foo Bar', email: 'foo@bar.com' },
      { name: 'John Doh', email: 'john@doh.com' }
    ]
  }
})
</script>

## 修改方法

在内部，Vue.js截获一个观察数组的修改方法（`unshift()`, `splice()`, `sort()` 和`reverse()`），因此它们也将触发视图更新。

``` js
// the DOM will be updated accordingly
demo.items.unshift({ childMsg: 'Baz' })
demo.items.pop()
```

## 增加的方法

Vue.js 给观察数组添加了两个便捷方法：`$set()` 和 `$remove()` 。

你应该避免直接通过索引来设置数据绑定数组中的元素，因为这些改变将不能被Vue.js检出，而应该使用增加的 `$set()` 方法:

``` js
// same as `demo.items[0] = ...` but triggers view update
demo.items.$set(0, { childMsg: 'Changed!'})
```

`$remove()` 只不过是 `splice()`方法的语法糖。它将移除给定索引处的元素。当参数不是数值时，`$remove()` 将在数组中搜索该值并删除第一个发现的数组项.

``` js
// remove the item at index 0
demo.items.$remove(0)
```

## 替换数组

当你使用非修改方法，比如`filter()`, `concat()` 或 `slice()`，返回的数组将是一个不同的实例。在此情况下，你可以用新数组替换旧的数组W:

``` js
demo.items = demo.items.filter(function (item) {
  return item.childMsg.match(/Hello/)
})
```

你可能会认为这将失去已有的DOM并重建一切。但别担心，Vue.js能够识别一个数组元素是否已有关联的Vue实例， 并只要有可能就会重用那些实例。

## 使用 `track-by`

在某些情况下，你可能需要以全新的对象（比如API调用所返回的对象）去替换数组。如果你的数据对象有一个值唯一的id属性，那么你可以使 `track-by` 属性给Vue.js一个提示，那样它可以重用已有的具有相同id的数据实例。

例如，如果你的数据像这样:

``` js
{
  items: [
    { _uid: 88f869d, ... },
    { _uid: 7496c10, ... }
  ]
}
```

那么你可以像这样给出提示:

``` html
<div v-repeat="items" track-by="_uid">
  <!-- content -->
</div>
```

## 遍历对象

你也可以使用 `v-repeat` 遍历一个对象的所有属性。每个重复的实例会有一个特殊的属性 `$key`。对于简单值，你也可以象访问数组中的简单值那样使用 `$value` 属性。

``` html
<ul id="repeat-object">
  <li v-repeat="primitiveValues">{&#123;$key&#125;} : {&#123;$value&#125;}</li>
  <li>===</li>
  <li v-repeat="objectValues">{&#123;$key&#125;} : {&#123;msg&#125;}</li>
</ul>
```

``` js
new Vue({
  el: '#repeat-object',
  data: {
    primitiveValues: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    },
    objectValues: {
      one: {
        msg: 'Hello'
      },
      two: {
        msg: 'Bye'
      }
    }
  }
})
```

**结果:**
<ul id="repeat-object" class="demo"><li v-repeat="primitiveValues">{&#123;$key&#125;} : {&#123;$value&#125;}</li><li>===</li><li v-repeat="objectValues">{&#123;$key&#125;} : {&#123;msg&#125;}</li></ul>
<script>
new Vue({
  el: '#repeat-object',
  data: {
    primitiveValues: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    },
    objectValues: {
      one: {
        msg: 'Hello'
      },
      two: {
        msg: 'Bye'
      }
    }
  }
})
</script>

<p class="tip">在ECMAScript 5中，当一个新属性添加到对象中时，或者从对象中删除一个属性时，没有办法检测到。要解决这个问题，观察对象将被添加两个方法：`$add(key, value)` 和 `$delete(key)`。这些方法可以被用于在添加、删除观察对象的属性时触发期望的视图更新。</p>

## 迭代值域

`v-repeat` 也可以接受一个整数。在这种情况下，它将重复显示一个模板多次.

``` html
<div id="range">
    <div v-repeat="val">Hi! {&#123;$index&#125;}</div>
</div>
```

``` js
new Vue({
  el: '#range',
  data: {
    val: 3
  }
});
```
**结果:**
<ul id="range" class="demo"><li v-repeat="val">Hi! {&#123;$index&#125;}</li></ul>
<script>
new Vue({
  el: '#range',
  data: { val: 3 }
});
</script>

## 数组过滤器

有时候我们只需要显示一个数组的过滤或排序过的版本，而不需要实际改变或重置原始数据。Vue提供了两个内置的过滤器来简化此类需求： `filterBy` 和 `orderBy`。可查看[方法文档](../api/filters.html#filterBy)获得更多细节。

接下来进入: [事件监听](../guide/events.html)部分。
