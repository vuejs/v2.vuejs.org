---
title: 单元测试
type: guide
order: 22
---

## 配置和工具

任何兼容基于模块的构建系统都可以正常使用，但如果你需要一个具体的建议，可以使用[Karma](http://karma-runner.github.io)进行自动化测试。它有很多社区版的插件，包括对[Webpack](https://github.com/webpack/karma-webpack)和[Browserify](https://github.com/Nikku/karma-browserify)的支持。更多详细的安装步骤，请参考各项目的安装文档，通过这些Karma配置的例子可以快速帮助你上手（[Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js)配置，[Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js)配置）。 

## 简单的断言

在测试的代码结构方面，你不必在你的组件中做任何特殊的事情使它们可测试。主要导出原始设置就可以了：

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```

当测试的组件时，所要做的就是导入对象和Vue然后使用许多常见的断言：

``` js
// 导入Vue.js和组件，进行测试
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// 这里是一些Jasmine 2.0的测试，你也可以使用你喜欢的任何断言库或测试工具。

describe('MyComponent', () => {
  // 检查原始组件选项
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // 评估原始组件选项中的函数的结果
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // 检查mount中的组件实例
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // 创建一个实例并检查渲染输出
  it('renders the correct message', () => {
    const Ctor = Vue.extend(MyComponent)
    const vm = new Ctor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## 编写可被测试的组件

很多组件的渲染输出由它的props决定。事实上，如果一个组件的渲染输出完全取决于它的props，那么它会让测试变得简单, 就好像断言不同参数的纯函数的返回值。看下面这个例子:

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

你可以在不同的props中，通过 `propsData` 选项断言它的渲染输出:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// 挂载元素并返回已渲染的文本的工具函数 
function getRenderedText (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('render correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

## 主张异步更新

由于Vue进行[异步更新DOM](/guide/reactivity.html#Async-Update-Queue)的情况，一些依赖DOM更新结果的断言必须在` Vue nexttick `回调中进行：

``` js
// 在状态更新后检查生成的HTML
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // 在状态改变后和断言DOM更新前等待一刻
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

我们计划做一个通用的测试工具集，让不同策略的渲染输出(例如忽略子组件的基本渲染)和断言变得更简单。

***

> 原文： http://vuejs.org/guide/unit-testing.html

***
