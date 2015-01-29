title: Filters
type: api
order: 7
---

### capitalize

*'abc' => 'Abc'*

### uppercase

*'abc' => 'ABC'*

### lowercase

*'ABC' => 'abc'*

### currency

- 这个 filter 接受一个可选参数

*12345 => $12,345.00*

你可以传递一个用作货币符号的可选参数

### pluralize

- 这个 filter 必须传递至少一个参数

根据要处理的值来将参数转换为复数。当只有一个参数时，其复数形式就是在其后加上“s”。当参数多于一个时，所有的参数将会以字符串数组的形式对应要被转换为复数的单词的“一倍”、“两倍”、“三倍”......的形式。当复数的数量超过参数个数时，会使用最后一个参数。

**例子：**

``` html
{&#123;count&#125;} {&#123;count | pluralize item&#125;}
```

*1 => '1 item'*  
*2 => '2 items'*

``` html
{&#123;date&#125;}{&#123;date | pluralize st nd rd th&#125;}
```

结果为:

*1 => '1st'*  
*2 => '2nd'*
*3 => '3rd'*
*4 => '4th'*
*5 => '5th'*

### json

- 这个 filter 接受一个可选参数

使用 `JSON.stringify()` 来处理值而不是将其字符串化（如 `[object Object]`)。这个 filter 支持一个可选参数来指定缩进级别（默认是 2）。

``` html
<pre>{&#123;$data | json 4&#125;}</pre>
```

### key

- 这个 filter 只工作于 `v-on`
- 这个 filter 接收一个参数

包裹一个 handler 使得其仅在 keyCode 是指定的参数时才被调用。你也可以使用几个常用键值的别名：

- enter
- tab
- delete
- esc
- up
- down
- left
- right

**例子：**

``` html
<input v-on="keyup:doSomething | key enter">
```

只有按回车键（enter）时才会调用 `doSomething` 。

### filterBy

**语法：** `filterBy searchKey [in dataKey]`.

- 这个 filter 只工作于 `v-repeat`
- 这是一个 computed filter

使得 `v-repeat` 只显示数组过滤后的结果。`searchKey` 参数是当前 ViewModel 的一个属性名。这个属性的值会被用作查找的目标：

``` html
<input v-model="searchText">
<ul>
  <li v-repeat="users | filterBy searchText">{&#123;name&#125;}</li>
</ul>
```

当使用这个 filter 时，这个 filter 将递归遍历 `users` 数组的每一个元素来寻找 `searchText` 的当前值从而过滤该数组。举例来说，如果一个元素是 `{ name: 'Jack', phone: '555-123-4567' }`，而 `searchText` 的值是 `'555'`，这个条目就被认为是符合条件。

可选地，你可以通过 `in dataKey` 参数来指定具体要查找哪个属性：

``` html
<input v-model="searchText">
<ul>
  <li v-repeat="users | filterBy searchText in name">{&#123;name&#125;}</li>
</ul>
```

现在只有当条目的 `name` 属性包含 `searchText` 时这个条目才符合条件。所以当 `searchText` 的值是 `'555'` 时这个条目将不符合条件，而当值是 `'Jack'` 时即符合。

最后，你可以使用引号来表示字面量参数：

``` html
<ul>
  <li v-repeat="users | filterBy '555' in 'phone'">{&#123;name&#125;}</li>
</ul>
```

### orderBy

**语法：** `orderBy sortKey [reverseKey]`.

- 这个 filter 只工作于 `v-repeat`
- 这是一个 computed filter

将 `v-repeat` 的结果排序。`sortKey`参数是当前 ViewModel 的一个属性名。这个属性的值是用来排序的键名。可选的 `reverseKey` 参数也是当前 ViewModel 的一个属性名，如果这个属性值为真则数组会被倒序排列。

``` html
<ul>
  <li v-repeat="users | orderBy field reverse">{&#123;name&#125;}</li>
</ul>
```

``` js
new Vue({
  /* ... */
  data: {
    field: 'name',
    reverse: false
  }
})
```

你可以使用引号来表示字面量的排序键名。使用 `-1` 来表示字面量的 `reverse` 参数。

``` html
<ul>
  <li v-repeat="users | orderBy 'name' -1">{&#123;name&#125;}</li>
</ul>
```
