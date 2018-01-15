---
title: TypeScript 支持
type: guide
order: 404
---

在 Vue 2.5.0+ 中，我们极大改善了类型声明，以使用默认的基于对象(object-based)的 API。同时也引入了一些变化，需要进行相应的升级操作。阅读[博客文章](https://medium.com/the-vue-point/upcoming-typescript-changes-in-vue-2-5-e9bd7e2ecf08)了解更多详情。


## 发布于 NPM 包中的官方声明

静态类型系统(static type system)可以辅助防止许多潜在的运行时错误，特别是随着应用程序的增长。这就是为什么 Vue 使用 [TypeScript](https://www.typescriptlang.org/) [官方的类型声明](https://github.com/vuejs/vue/tree/dev/types) - 不仅是用在 Vue 核心本身，也用在 [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) 和 [vuex](https://github.com/vuejs/vuex/tree/dev/types)。

由于这些声明文件[发布于 NPM](https://cdn.jsdelivr.net/npm/vue/types/)，并且最新版的 TypeScript 知道如何从 NPM 包中解析类型声明，这意味着，通过NPM 安装后，你甚至不需要任何额外工具，就可以对 Vue 使用 TypeScript：

我们还计划在不久的将来在 `vue-cli` 中提供一个集成 Vue + TypeScript 项目的脚手架。

## 推荐配置

``` js
// tsconfig.json
{
  "compilerOptions": {
    // 与 Vue 的浏览器支持保持一致
    "target": "es5",
    // 可以对 `this` 上的 data 属性进行更严格的推断
    "strict": true,
    // 如果使用 webpack 2+ 或 rollup，可以利用 tree shaking 特性：
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

请注意，必须包含 `strict: true`（或至少 `noImplicitThis: true`，这是 `strict` 模式的一部分），以便利用组件方法中 `this` 的类型检查，否则会把它视为 `any` 类型。

有关更多详细信息，请查看 [TypeScript 编译器(compiler)选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

## 开发工具

为了使用 TypeScript 开发 Vue 应用程序，我们强烈建议使用 [Visual Studio Code](https://code.visualstudio.com/)，它为 TypeScript 提供了开箱即用的良好支持。

如果你正在使用[单文件组件](./single-file-components.html)(SFC)，请使用酷炫的 [Vetur 扩展](https://github.com/vuejs/vetur)，它提供了在单文件组件中进行 TypeScript 推断和许多其他强大的功能。

[WebStorm](https://www.jetbrains.com/webstorm/) 也为 TypeScript 和 Vue.js 提供了开箱即用的良好支持。

## 基本用法

为了让 TypeScript 正确地推断 Vue 组件选项中的类型，你需要使用 `Vue.component` 或 `Vue.extend` 定义组件：

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // 启用类型推断
})

const Component = {
  // 这里无法类型推断
  // 因为 TypeScript 不知道这是 Vue 组件的选项
}
```

## class 风格的 Vue 组件(Class-Style Vue Components)

如果你在声明组件时，更喜欢基于类(class-based)的 API，则可以使用官方维护的 [vue-class-component](https://github.com/vuejs/vue-class-component) 装饰器：

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

## 扩充类型以配合插件使用(Augmenting Types for Use with Plugins)

插件(plugins)可能会添加 Vue 的全局/实例属性和组件选项。在这种情况下，为了使插件可以在 TypeScript 中正常编译，需要类型声明。幸运的是，TypeScript 有一个名为[模块补充(module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)的特性，可以扩充现有的类型。

例如，如果想要声明一个 `string` 类型的实例属性 `$myProperty`：

``` ts
// 1. 请确保在声明扩充的类型之前 import 'vue'
import Vue from 'vue'

// 2. 为想要扩充的类型指定一个文件
//    在 types/vue.d.ts 中有 Vue 构造函数的类型
declare module 'vue/types/vue' {
  // 3. 为 Vue 声明扩充属性
  interface Vue {
    $myProperty: string
  }
}
```

在你的项目中，使用上面作为声明文件（例如 `my-property.d.ts`）的代码后，你就可以在 Vue 实例上使用 `$myProperty` 了。

```ts
var vm = new Vue()
console.log(vm.$myProperty) // 这里可以成功编译
```

还可以声明额外的全局属性和组件选项：

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $myGlobal: string
  }
}

// 在 types/options.d.ts 中声明 ComponentOptions
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

以上声明，可以使下面的代码成功编译：

```ts
// 全局属性
console.log(Vue.$myGlobal)

// 额外的组件选项
var vm = new Vue({
  myOption: 'Hello'
})
```

## 标注返回类型

由于 Vue 声明文件的循环特性，TypeScript 可能很难推断某些方法的类型。因此，你可能需要为 `render` 方法和 `computed` 对象上的方法标注返回类型。

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    // 由于返回对象中有 `this`，所以需要标注返回类型
    greet (): string {
      return this.msg + ' world'
    }
  },
  computed: {
    // 需要标注
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement` 是可推断的，但是 `render` 需要标注返回值类型
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

如果你发现类型推断或成员补齐无法正常使用，标注某些方法可能有助于解决这些问题。使用 `--noImplicitAny` 选项，会有助于找出这些未标注的方法。

***

> 原文：https://vuejs.org/v2/guide/typescript.html

***
