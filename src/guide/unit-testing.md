---
title: 单元测试
type: guide
order: 22
---

## 配置和工具

Anything compatible with a module-based build system will work, but if you're looking for a specific recommendation, try the [Karma](http://karma-runner.github.io) test runner. It has a lot of community plugins, including support for [Webpack](https://github.com/webpack/karma-webpack) and [Browserify](https://github.com/Nikku/karma-browserify). For detailed setup, please refer to each project's respective documentation, though these example Karma configurations for [Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js) and [Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js) may help you get started.

## 简单的断言

In terms of code structure for testing, you don't have to do anything special in your components to make them testable. Just export the raw options:
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

A lot of components' render output are primarily determined by the props they receive. In fact, if a component's render output solely depends on its props, it becomes quite straightforward to test, similar to asserting the return value of a pure function with different arguments. Take an contrived example:

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

You can assert its render output with different props using the `propsData` option:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// helper function that mounts and returns the rendered text
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

由于Vue进行[异步更新DOM]((/guide/reactivity.html#Async-Update-Queue))的情况，一些断言必须在` Vue nexttick `回调中进行：

``` js
// 在状态更新后检查生成的HTML
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // wait a "tick" after state change before asserting DOM updates
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

We are planning to work on a collection of common test helpers that makes it even simpler to render components with different constraints (e.g. shallow rendering that ignores child components) and assert their output.
