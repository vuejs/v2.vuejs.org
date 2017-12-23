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

## Augmenting Types for Use with Plugins

Plugins may add to Vue's global/instance properties and component options. In these cases, type declarations are needed to make plugins compile in TypeScript. Fortunately, there's a TypeScript feature to augment existing types called [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

For example, to declare an instance property `$myProperty` with type `string`:

``` ts
// 1. Make sure to import 'vue' before declaring augmented types
import Vue from 'vue'

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $myProperty: string
  }
}
```

After including the above code as a declaration file (like `my-property.d.ts`) in your project, you can use `$myProperty` on a Vue instance.

```ts
var vm = new Vue()
console.log(vm.$myProperty) // This should compile successfully
```

You can also declare additional global properties and component options:

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $myGlobal: string
  }
}

// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

The above declarations allow the following code to be compiled:

```ts
// Global property
console.log(Vue.$myGlobal)

// Additional component option
var vm = new Vue({
  myOption: 'Hello'
})
```

## Annotating Return Types

Because of the circular nature of Vue's declaration files, TypeScript may have difficulties inferring the types of certain methods. For this reason, you may need to annotate the return type on methods like `render` and those in `computed`.

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    // need annotation due to `this` in return type
    greet (): string {
      return this.msg + ' world'
    }
  },
  computed: {
    // need annotation
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement` is inferred, but `render` needs return type
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

If you find type inference or member completion isn't working, annotating certain methods may help address these problems. Using the `--noImplicitAny` option will help find many of these unannotated methods.

***

> 原文：https://vuejs.org/v2/guide/typescript.html

***
