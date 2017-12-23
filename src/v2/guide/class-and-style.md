---
title: class 和 style 绑定
type: guide
order: 6
---

在数据绑定中，一个常见需求是，将数据与元素的 class 列表，以及元素的 style 内联样式的操作绑定在一起。由于它们都是属性(attribute)，因此我们可以使用 `v-bind` 来处理它们：只需从表达式中计算出最终的字符串。然而，处理字符串拼接，既麻烦又容易出错。为此，在使用 `v-bind` 指令来处理 `class` 和 `style` 时，Vue 对此做了特别的增强。表达式除了可以是字符串，也能够是对象和数组。

## 与 HTML 的 class 绑定(Binding HTML Classes)

### 对象语法

我们可以向 `v-bind:class` 传入一个对象，来动态地切换 class：

``` html
<div v-bind:class="{ active: isActive }"></div>
```

上述语法意味着，`active` 这个 class 的存在与否，取决于 `isActive` 这个 data 属性的 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值。

这样，可以通过在对象中添加多个字段，来切换多个 class。此外，`v-bind:class` 指令也可以和普通 `class` 属性共存。所以，给定以下模板：

``` html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```

然后，给定以下 data：

``` js
data: {
  isActive: true,
  hasError: false
}
```

将会渲染为：

``` html
<div class="static active"></div>
```

每当 `isActive` 或 `hasError` 发生变化，class 列表就会相应地更新。例如，如果 `hasError` 值是 `true`，class 列表会变为 `"static active text-danger"`。

绑定对象，也可以无需内联，而是外部引用 data：

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

（内联、外部引用）这两种方式的渲染结果相同。我们还可以将 class 和 style 与某个 [computed 属性](computed.html)绑定在一起，此 computed 属性所对应的 getter 函数需要返回一个对象。这是一种常用且强大的用法：

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### 数组语法

我们可以向 `v-bind:class` 传入一个数组，来与 class 列表对应：

``` html
<div v-bind:class="[activeClass, errorClass]"></div>
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

会被渲染为：

``` html
<div class="active text-danger"></div>
```

如果你还想根据条件，切换 class 列表中某个 class，可以通过三元表达式(ternary expression)来实现：

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

这里会直接添加 `errorClass`，但是只有在 `isActive` 值是 truthy 时，才会添加 `activeClass`。

然而，如果有多个条件  class 时，就会显得有些繁琐。这也就是为什么还可以在数组语法中使用对象语法：

``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### 在组件中使用

> 本章节假设你已经对 [Vue 组件](components.html)有一定的了解。你可以根据自己的情况选择是否跳过，稍后回来再看。

当你在自定义组件中使用 `class` 属性，这些 class 会被添加到组件的根元素上。根元素上已经存在的 class 不会被覆盖。

例如，如果你这样声明组件：

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

然后，在调用组件时，再添加一些 class：

``` html
<my-component class="baz boo"></my-component>
```

那么，最终渲染的 HTML 就是：

``` html
<p class="foo bar baz boo">Hi</p>
```

同样，class 绑定也是如此：

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

当 `isActive` 值是 truthy，最终渲染的 HTML 就是：

``` html
<p class="foo bar active">Hi</p>
```

## 与内联 style 绑定(Binding Inline Styles)

### 对象语法

`v-bind:style` 的对象语法是非常简单直接的 - 看起来非常像 CSS，其实它是一个 JavaScript 对象。CSS 属性名称可以使用驼峰式(camelCase)或串联式(kebab-case)（使用串联式需要加引号）：

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

通常，一个比较好的做法是，直接与 data 中的 style 对象绑定，这样模板看起来更清晰：

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

再次申明，`v-bind:style` 的对象语法，通常也会和 computed 属性结合使用，此 computed 属性所对应的 getter 函数需要返回一个对象。

### 数组语法

`v-bind:style` 的数组语法，可以在同一个元素上，使用多个 style 对象：

``` html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### 自动添加前缀

在 `v-bind:style` 中使用具有[浏览器厂商前缀(vendor prefixes)](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)的 CSS 属性时（例如 `transform`），Vue 会自动检测并向 style 添加合适的前缀。

### 多个值

> 2.3.0+

从 2.3.0+ 起，你可以为每个 style 属性提供一个含有多个（前缀）值的数组，例如：

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

最终，这只会从数组中找出「最后一个浏览器所支持的值」进行渲染。在这个示例中，对于支持「无需前缀版本的 flexbox」的浏览器，最终将渲染为 `display: flex`。

***

> 原文：https://vuejs.org/v2/guide/class-and-style.html

***
