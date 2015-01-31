title: 指令
type: api
order: 6
---

## 响应式指令 
 
> Directive 可以将自己与一个 Vue 实例的属性绑定，也可以与一个运行在实例上下文中的表达式绑定。当底层属性或表达式的值发生改变时，指令的`update()`方法会在下个 tick 异步地调用。
### v-text

更新元素的`textContent`

本质上来说，&#123;&#123; Mustache &#125;&#125; 的插值也被当做文字节点上的`v-text`指令进行编译。
### v-html

更新元素的`innerHTML`

<p class="tip">
  在用户产生的数据中使用`v-html`比较危险。使用`v-html`时应确保数据的安全性，或通过自定义过滤器将不被信任的 HTML 内容进行处理。
</p>

### v-show

- 本指令可以触发动画效果。

根据绑定的真实值将元素的 display 属性设置为`none`或它的原始值。

### v-class

- 本元素接受配置参数

如果没有提供参数名，将会直接将绑定值加入到元素的 classList 中，当绑定值改变时更新元素的 class.
 
如果提供了参数名，则会根据绑定值的变化触发元素 class 的改变。多条合并使用会很方便。

``` html
<span v-class="
  red    : hasError,
  bold   : isImportant,
  hidden : isHidden
"></span>
```

### v-attr

- 本指令需要一个参数

更新元素的指定属性（更新的属性由参数指定）
**例子:**

``` html
<canvas v-attr="width:w, height:h"></canvas>
```


本质上，普通属性中的 &#123;&#123; Mustache &#125;&#125; 插值会被编译到`v-attr`指令当中。
 
<p class="tip">
  在为`<img>`元素设置`src`属性时，应该使用`v-attr`绑定而不是 mustache 模板绑定。浏览器会先于 Vue.js 对你的模板进行解析。所以当浏览器试图获取图片 URL 时，使用 &#123;&#123;mustache&#125;&#125; 模板绑定的数据会导致404错误。
</p>

### v-style


- 本指令接受一个配置参数

将CSS属性以内联的形式应用到元素上。

如果没有参数名，绑定值也可以使一个字符串或者一个对象。

- 如果参数值为字符串，则会将该元素的`style.cssText`属性设置为参数的值。
- 如果参数值为对象，则每一对 key/value 都会被设置到元素的`style`对象上。

**例子:**

``` html
<div v-style="myStyles"></div>
```

``` js
// myStyles can either be a String:
"color:red; font-weight:bold;"
// or an Object:
{
  color: 'red',
  // both camelCase and dash-case works
  fontWeight: 'bold',
  'font-size': '2em'
}
```

如果有参数名的话，参数名会被当作 CSS 属性名使用。可以通过合并多个参数的方式同时设置多个属性。

**例子:**

``` html
<div v-style="
  top: top + 'px',
  left: left + 'px',
  background-color: 'rgb(0,0,' + bg + ')'
"></div>
```

`v-style`也可以智能的查找 CSS 属性是否需要浏览器前缀，所以你可以放心的使用无前缀版本的 CSS 属性。

``` html
<!-- will use -webkit-transform if needed, for example -->
<div v-style="transform: 'scale(' + scale + ')'"></div>
```

<p class=“tip”>
	因为 IE 浏览器的原因，这里推荐使用`v-style`指令来代替直接在 style 属性中使用 &#123;&#123;mustache&#125;&#125; 插值，这是因为在 IE 的所有版本中，都会在解析 HTML 时将非法的内联样式删除掉。
</p>

### v-on

- 本指令需要一个参数名。
- 本指令所需的值应该是一个函数或者声明。


为元素添加一个事件监听器。事件的类型由参数名来表示。这也是唯一可以和`key`过滤器一起使用的指令。详细请见[Listening for Events](../guide/events.html)。


### v-model

- 本指令只能用在`<input>`, `<select>` 或 `<textarea>` 元素上。
- 指令的参数有：`lazy`, `number`, `options`


在表单输入元素上创建双向绑定。默认情况下，每一个`input`事件都会让数据同步。详情请见[Handling Forms](../guide/forms.html).

### v-if

- 本指令可以触发动画效果。

以绑定值为基础条件插入或删除元素。如果元素为`<template>`元素，则它的内容将会被提取出来作为条件块。

**例子:**

``` html
<template v-if="test">
  <p>hello</p>
  <p>world</p>
</template>
```

渲染结果:

``` html
<!--v-if-start-->
<p>hello</p>
<p>world</p>
<!--v-if-end-->
```

### v-repeat

- 本指令会创建子 Vue 实例。
- 本指令的值应为一个数组、对象或数字。
- 本指令可以触发动画效果。
- 本指令接受一个配置参数。
- 指令的参数：`trackby`


为每一个绑定的数组或对象中的项创建一个子 ViewModel 。如果值是整数，则创建多个子 ViewModel 。当数组或对象的变质方法（ mutating method ）被调用，如`push()`方法，或者当数字值有增加或减少时，子 ViewModel 都会自动被创建或删除。

如果没有提供参数名，子 ViewModel 会直接使用指定的数组作为`$data`。如果值不是一个对象，则会创建一个数据包装对象，而值会被设置在别名为`$value`的 key 上。
**例子:**

``` html
<ul>
  <li v-repeat="users">
    {&#123;name&#125;} {&#123;email&#125;}
  </li>
</ul>
```

如果提供了参数名，则通常会创建一个数据包装对象，用参数名字符串作为 key. 这使得模板中的属性访问更加的明确。
``` html
<ul>
  <li v-repeat="user : users">
    {&#123;user.name&#125;} {&#123;user.email&#125;}
  </li>
</ul>
```

查看详细的例子，点这里 [Displaying a List](../guide/list.html).

### v-with

- 本指令只能与`v-component`一起使用。
- 本指令只接受 keypaths, 而不是表达式。

允许一个子 ViewModel 从父 ViewModel 继承数据。你可以传入一个对象，这个对象会被作为`data`项，或者也可以将单个的父级属性通过不同的 key 绑定到子级上。本指令必须与`v-component`组合使用。

数据继承是单向的——当父级属性改变时，会去更新和改变子元素。然而当子级属性被设置为其他值时，并不会影响到父级数据，并且修改后的属性将会在父级属性的下一次修改时被覆盖掉。

继承自一个对象的例子

``` js
// parent data looks like this
{
  user: {
    name: 'Foo Bar',
    email: 'foo@bar.com'
  }
}
```

``` html
<my-component v-with="user">
  <!-- you can access properties without `user.` -->
  {&#123;name&#125;} {&#123;email&#125;}
</my-component>
```

继承自单个属性（使用相同数据）的例子。
``` 
<my-component v-with="myName: user.name, myEmail: user.email">
  <!-- you can access properties with the new keys -->
  {&#123;myName&#125;} {&#123;myEmail&#125;}
</my-component>
```

### v-events

- 本指令只能与`v-component`一起使用
- 本指令只接受 keypaths, 而不是表达式。

允许一个父 Vue 实例监听一个子 Vue 实例上的事件。不同于`v-on`的是，`v-events`监听的是通过`vm.$emit()`创建的 Vue 组件系统事件，而不是 DOM 事件。本指令让父子通信进一步解耦，不需要在父组件中“硬编写”事件监听器。需要注意的是，本指令只能与`v-component`同时使用，即只能用在子组件的根元素上。

**例子:**

``` html
<!-- inside parent template -->
<div v-component="child" v-events="change: onChildChange"></div>
```


当子组件调用 `this.$emit('change', …)`时调用父元素的`onChildChange`方法，并将传给`$emit()`方法的额外参数会传入其中。

## 字面指令

> 字面指令将它的属性值当成纯字符串来处理。字面指令不把自己绑定到任何东西上。它们只将字符串值传入到`bind()`函数中执行一次。字面指令的值接受 &#123;&#123;mustache&#125;&#125; 表达式，但这个表达式只能随着首次编译执行一次，不会随着数据变化而变化。

### v-component

- 指令参数：`keep-alive`,`wait-for`,`transition-mode`

使用一个已经注册过的组件构造器编译这个元素作为子 ViewModel. 这个指令可以使用`v-with`从父级继承数据。详细请看[Component System](../guide/components.html).

### v-ref

为了让父级更加方便的访问子级，可以在父级注册一个子组件的引用。本指令只有与`v-component`和`v-repeat`一起才能使用。在它父级的`$`对象上可以访问组件的实例。例子在[child reference](../guide/components.html#子组件引用).

当该指令与`v-repeat`一起使用时，`v-ref`的值将会是一个包含了所有子 Vue 实例的数组，这个数组与子 Vue 实例绑定的数组是相对应的。

### v-el

在一个DOM元素上注册一个更容易被自身 Vue 实例访问的引用。如， `<div v-el="hi">`可以使用`vm.$$.hi`访问到。

### v-partial

使用一个注册过的 partial 替换元素的 innerHTML 值。可以使用`Vue.partial()`或传入`partials`参数的方式来注册一个 Partials 。 

在`v-partial`中使用 {&#123; mustache&#125;} 标签可以让元素响应数据的改变。

``` html
<!-- content will change based on vm.partialId -->
<div v-partial="{&#123;partialId&#125;}"></div>
```

你也可以使用这样的语法（不支持相应数据改变）。
``` html
<div>&#123;&#123;> my-partial&#125;&#125;</div>
```

### v-transition

通知 Vue.js 为元素应用动画效果。动画 class 将会在某些能触发过渡的指令修改了元素时或当 Vue 实例中操作 DOM 的方法被调用时引用到元素上。
详情请见[the guide on transitions](../guide/transitions.html).


## 空指令

> 空指令不需要参数，并且会忽略它的属性值。

### v-pre

跳过编译此元素和此元素所有的子元素。跳过大量没有指令的节点可以加快编译速度。

### v-cloak

直到关联的 ViewModel 结束编译之前本属性都会留在元素上。与 `[v-cloak] { display: none }` 类似的样式结合，这个指令可以用来在 ViewModel 准备好之前隐藏没有被编译的 &#123;&#123; Mustache &#125;&#125; 模板。