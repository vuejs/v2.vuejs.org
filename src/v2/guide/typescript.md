---
title: TypeScript 支持
type: guide
order: 25
---

## 向 TS + webpack 2 用户通知 Vue 2.2.0+ 的重要修改

在 Vue 2.2.0+ 中，我们引入了暴露为 ES 模块的 dist 文件，默认情况下配合 webpack 2 使用。不幸的是，由于使用了TypeScript + webpack 2，`import Vue = require('vue')` 返回一个合成的 ES 模块对象而不是 Vue 本身

我们计划今后所有的官方声明，都将转为使用 ES 风格导出(ES-style export)。请参阅下面长期有效设置的[推荐配置](#推荐配置)。

## 发布于 NPM 包中的官方声明

静态类型系统(static type system)可以辅助防止许多潜在的运行时错误，特别是随着应用程序的增长。这就是为什么 Vue 使用 [TypeScript](https://www.typescriptlang.org/) [官方的类型声明](https://github.com/vuejs/vue/tree/dev/types) - 不仅是用在 Vue 核心本身，也用在 [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) 和 [vuex](https://github.com/vuejs/vuex/tree/dev/types)。

由于这些声明文件[发布于 NPM](https://unpkg.com/vue/types/)，并且最新版的 TypeScript 知道如何从 NPM 包中解析类型声明，这意味着，通过NPM 安装后，你甚至不需要任何额外工具，就可以对 Vue 使用 TypeScript：

## 推荐配置

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ……忽略的其他选项
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015.promise"
    ]
  }
}
```

请注意，`allowSyntheticDefaultImports` 选项允许我们使用以下内容：

``` js
import Vue from 'vue'
```

替代：

``` js
import Vue = require('vue')
```

推荐使用前者（ES 模块语法），因为它与推荐的纯 ES 用法一致，并且我们计划今后所有的官方声明，都将转为使用 ES 风格导出(ES-style export)。

此外，如果你通过 webpack 2 使用 TypeScript，以下也是推荐设置：

``` js
{
  "compilerOptions": {
    // ……忽略的其他选项
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

这告诉 TypeScript 保持原封不动 ES 模块中的 import 语句，反过来，这也让 webpack 2 能够利用基于 ES 模块(ES-module-based)的 tree-shaking。

有关更多详细信息，请查看 [TypeScript 编译器(compiler)选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

### 使用 Vue 的类型声明

Vue 的类型定义导出许多有用的[类型声明](https://github.com/vuejs/vue/blob/dev/types/index.d.ts)。例如，要标注一个导出组件的选项对象（比如，在 `.vue` 文件中）：

``` ts
import Vue, { ComponentOptions } from 'vue'

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as ComponentOptions<Vue>
```

## class 风格的 Vue 组件(Class-Style Vue Components)

Vue 组件选项可以很容易地标注类型:

``` ts
import Vue, { ComponentOptions }  from 'vue'

// 声明组件类型
interface MyComponent extends Vue {
  message: string
  onClick (): void
}

export default {
  template: '<button @click="onClick">Click!</button>',
  data: function () {
    return {
      message: 'Hello!'
    }
  },
  methods: {
    onClick: function () {
      // TypeScript 知道 `this` 是 MyComponent 类型，
      // 并且 `this.message` 是一个字符串
      window.alert(this.message)
    }
  }
// 我们需要使用显式标注导出的选项对象
// 为 MyComponent 类型
} as ComponentOptions<MyComponent>
```

遗憾的是，这里有一些限制：

- __TypeScript 不能从 Vue 的 API 中推断出所有类型。__例如，它不知道 `data` 函数返回的 `message` 属性将被添加到 `MyComponent` 实例。这意味着如果我们为 `message` 设定一个数字或布尔值，验证器(linter)和编译器(compiler)无法抛出一个错误，提示它应该是一个字符串。

- 因为之前的限制，__这样详细标注类型可能变得非常繁琐__。我们必须手动将 `message` 声明为字符串的唯一原因是，因为在这种情况下 TypeScript 不能推断类型。

幸运的是，[vue-class-component](https://github.com/vuejs/vue-class-component) 可以解决这两个问题。这是一个官方的辅助库，允许你通过使用一个 `@Component` 装饰器，实现像原生 JavaScript class 那样声明组件。举个例子，让我们重写上述组件:

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// @Component 装饰器表明此 class 是一个 Vue 组件
@Component({
  // 这里允许所有组件选项
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // 可以将初始数据声明为实例属性
  message: string = 'Hello!'

  // 可以将组件方法声明为实例方法
  onClick (): void {
    window.alert(this.message)
  }
}
```

由于这种语法替代方案，我们的组件定义不仅更简短，而且无需显式接口声明，`TypeScript` 也可以推断出 `message` 和 `onClick` 的类型。这种策略甚至允许你处理计算属性(computed property) 、生命周期钩子函数(lifecycle hook)和渲染函数(render function)的类型。完整的使用细节，请查看 [vue-class-component 文档](https://github.com/vuejs/vue-class-component#vue-class-component)。

***

> 原文：https://vuejs.org/v2/guide/typescript.html

***
