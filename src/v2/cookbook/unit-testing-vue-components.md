---
title: 单元测试 Vue 组件
type: cookbook
order: 6
---

## 简单示例

单元测试是软件开发的基础部分。单元测试孤立地执行最小的代码单元，以便增加新功能的易用性和追踪错误。通过 Vue [单文件组件](./single-file-components.html)，可以直接为独立的组件编写单元测试。这使你可以在不破坏现有功能的基础上，放心地开发新功能，并帮助其他开发人员了解你的组件功能。

这个简单示例，测试是否渲染一些文本：

```html
<template>
  <div>
    <input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
        ? '请输入稍长一些的 username'
        : ''
    }
  }
}
</script>
```

```js
import { shallow } from 'vue-test-utils'

test('Foo', () => {
  // 渲染组件
  const wrapper = shallow(Hello)

  // 应当的实现效果是，去除两侧空格后，不允许 username 少于 7 个字符
  wrapper.setData({ username: ' '.repeat(7) })

  // 断言 error 被渲染
  expect(wrapper.find('.error').exists()).toBe(true)

  // 将 username 修改为足够长度
  wrapper.setData({
    username: {
      'Lachlan'
    }
  })

  // 断言 error 消失
  expect(wrapper.find('.error').exists()).toBe(false)
})
```

上面的代码片段，展示了如何根据 username 的长度，测试错误消息是否被渲染。它演示了单元测试 Vue 组件的一般思路：渲染组件，然后断言标签内容与组件状态对应。

## 为什么要做测试？

组件单元测试有很多好处：
- 提供有关组件内部机制的文档
- 节省手动测试时间
- 减少新功能中的错误
- 改进设计
- 促进重构

自动化测试，有助于大型开发团队维护复杂的代码库。

#### 起步

[vue-test-utils](https://github.com/vuejs/vue-test-utils) 是用于辅助单元测试 Vue 组件的官方库。[vue-cli](https://github.com/vuejs/vue-cli) webpack template 中带有 Karma 或 Jest，都良好支持测试运行器，`vue-test-utils` 文档中的[指南](https://vue-test-utils.vuejs.org/zh-cn/guides/)也可以参考。

## 现实示例

单元测试应该
- 快速运行
- 简单易懂
- 只测试_单个工作单元_

让我们继续构建前面的示例，同时引入一个 <a href="https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)">工厂函数(factory function)</a> 的概念，以使我们的测试更加紧凑和可读。该组件应该：

- 显示 'Welcome to the Vue.js cookbook' 的问候。
- 提示用户输入 username
- 输入的 username 少于 7 个字母，显示 error

我们先来看组件代码：

```html
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
    输入你的 username：<input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      请输入至少 7 个字母的 username
    </div>
  </div>
</template>

<script>
export default {
  name: 'Foo',

  data () {
    return {
      message: 'Welcome to the Vue.js cookbook',
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
    }
  }
}
</script>
```

我们应该测试的是：
- `message` 正确渲染了吗？
- 如果 `error` 是 `true`，`<div class="error"`> 应该存在
- 如果 `error` 是 `false`，`<div class="error"`> 不应该存在

然后，在测试代码中，我们先来尝试：

```js
import { shallow } from 'vue-test-utils'

describe('Foo', () => {
  it('renders a message and responds correctly to user input', () => {
      const wrapper = shallow(Foo, {
    data: {
      message: 'Hello World',
      username: ''
    }
  })

  // 查看 message 是否渲染
  expect(wrapper.find('.message').text()).toEqual('Hello World')

  // 断言 error 已经渲染
  expect(wrapper.find('.error').exists()).toBeTruthy()

  // 修改 username，然后断言 error 不再渲染
  wrapper.setData({ username: 'Lachlan' })
  expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

上面的示例中有一些问题：
- 单个测试，却在对不同的事物做出断言
- 很难说出组件处于哪些不同的状态，以及应该渲染什么结果

通过以下方式改进了测试：
- 只在每个 `it` 块中做单个断言
- 具有简短明确的测试说明
- 只提供测试所需的最低限度的数据
- 重构重复逻辑（创建 `wrapper` 和设置 `username` 变量）到工厂函数中

*Updated test*:
```js
import { shallow } from 'vue-test-utils'
import Foo from './Foo'

const factory = (values = {}) => {
  return shallow(Foo, {
    data: { ...values  }
  })
}

describe('Foo', () => {
  it('renders a welcome message', () => {
    const wrapper = factory()

    expect(wrapper.find('.message').text()).toEqual("Welcome to the Vue.js cookbook")
  })

  it('renders an error when username is less than 7 characters', () => {
    const wrapper = factory({ username: ''  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('renders an error when username is whitespace', () => {
    const wrapper = factory({ username: ' '.repeat(7)  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('does not render an error when username is 7 characters or more', () => {
    const wrapper = factory({ username: 'Lachlan'  })

    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

注意事项：

在代码顶部，我们声明了工厂函数，将 `values` 对象合并到 `data` 中，然后返回一个新的 `wrapper` 实例。这样，我们不需要在每个测试中都重复写 `const wrapper = shallow(Foo)`。另一个较大的好处是，如果是你可能想要在每个测试中模拟或存根的组件，而这个组件是具有一个 method 方法或 computed 计算属性的复杂组件，现在则只需要声明一次。

## 附加上下文

上面的测试示例比较简单，但实际上 Vue 组件通常还有其他需要测试的行为，例如：

- 进行 API 调用
- 通过 `Vuex` store 提交(commit)或分发(dispatch) mutations 或 actions
- 测试交互

在 `vue-test-utils` [指南](https://vue-test-utils.vuejs.org/en/guides/)中，展示了这些测试行为的更多完整示例。

`vue-test-utils` 和巨大的 JavaScript 生态系统提供了大量的工具，来促进达到接近 100％ 测试覆盖率。不过，单元测试只是测试金字塔的一部分。还有一些其他类型的测试，包括 e2e（end to end - 端到端）测试和快照测试。单元测试是最细度和最基本的测试 - 他们对最小工作单元做出断言，将单个组件的每个部分隔离开。

快照测试(snapshot test)，会保存 Vue 组件的标签，并与每次测试运行时生成的新标签进行比较。如果有变化，开发人员会得到通知，并可以确定更改是符合意图（组件已经更新）还是出于意外（组件行为不正确）。

端到端测试(end to end)，涉及到要确保许多组件良好地交互在一起。他们更高层次。一些示例可能会测试到用户是否可以注册、登录和修改其用户名。这些要比单元测试或快照测试慢得多。

单元测试，在开发过程中非常有用，既可以帮助开发人员考虑如何设计一个组件，又可以帮助开发人员重构现有组件，并且在每次修改代码时都不断地运行。

处于上层的测试，例如端到端测试，运行速度要慢得多。这些通常需要运行预先部署，以确保系统的每个部分正确地一起运行。

关于测试 Vue 组件的更多信息，可以在 [测试 Vue.js 应用程序](https://www.manning.com/books/testing-vuejs-applications) 中学习，是由核心团队成员 [Edd Yerburgh](https://eddyerburgh.me/) 编写。

## 何时我们无须进行单元测试

单元测试是所有重度应用程序的重要组成部分。首先，当应用程序的构想不明确时，单元测试可能会减缓开发速度，然而，一旦确立出构想，并且有了与应用程序交互的真实用户，单元测试（以及其他类型的自动化测试）可以保证代码库是可维护的和可扩展的。

***

> 原文：https://vuejs.org/v2/cookbook/unit-testing-vue-components.html

***
