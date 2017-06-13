---
title: TypeScript 支持
type: guide
order: 25
---

## 向 TS + webpack 2 用户通知 Vue 2.2 的重要修改

在 Vue 2.2 中，我们引进了暴露为 ES 模块的 dist 文件，默认情况下配合 webpack 2 使用。不幸的是，由于使用了TypeScript + webpack 2，`import Vue = require('vue')` 返回一个合成的 ES 模块对象而不是 Vue 本身

我们计划今后所有的官方声明，都将转为使用 ES 风格导出(ES-style export)。请参阅下面长期有效设置的[推荐配置](#Recommended-Configuration)。

## NPM package 中官方声明文件

静态类型系统可以帮助防止许多潜在的运行时错误，特别是随着应用程序的增长. 这就是为什么Vue使用带 [TypeScript](https://www.typescriptlang.org/) 的官方的类型声明 - 不仅是用在Vue-core，也用在 [Vue-router](https://github.com/vuejs/vue/tree/dev/types) 和 [Vuex](https://github.com/vuejs/vue/tree/dev/types)。

由于这些[声明文件](https://unpkg.com/vue/types/)是在 NPM 上发布的，你甚至不需要像 `Typings` 这样的外部工具，因为声明是用Vue自动导入的。 这意味着你需要的是简单的引入 Vue:

## 推荐的配置

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ... other options omitted
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015.promise"
    ]
  }
}
```

Note the `allowSyntheticDefaultImports` option allows us to use the following:

``` js
import Vue from 'vue'
```

instead of:

``` js
import Vue = require('vue')
```

The former (ES module syntax) is recommended because it is consistent with recommended plain ES usage, and in the future we are planning to move all official declarations to use ES-style exports.

In addition, if you are using TypeScript with webpack 2, the following is also recommended:

``` js
{
  "compilerOptions": {
    // ... other options omitted
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

This tells TypeScript to leave the ES module import statements intact, which in turn allows webpack 2 to take advantage of ES-module-based tree-shaking.

See [TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html) for more details.

### 访问 Vue 的类型声明

Vue 的类型定义导出许多有用的[类型声明](https://github.com/vuejs/vue/blob/dev/types/index.d.ts)。例如,注释一个组件的选择对象(例如在一个 `.vue` 文件):

``` ts
import Vue, { ComponentOptions } from 'vue'

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as ComponentOptions<Vue>
```

## 类-样式Vue组件

Vue 组件选项可以很容易地注释类型:

``` ts
import Vue, { ComponentOptions }  from 'vue'

// Declare the component's type
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
      // TypeScript knows that `this` is of type MyComponent
      // and that `this.message` will be a string
      window.alert(this.message)
    }
  }
// We need to explicitly annotate the exported options object
// with the MyComponent type
} as ComponentOptions<MyComponent>
```

不幸的是,这里有一些限制：

- __TypeScript 不能从 Vue 推断出所有类型的 API。__例如,它不知道 `data` 返回的  `message` 属性将被添加到 `MyComponent` 实例。这意味着如果我们指定一个数字或布尔值信息,验证器和编译器不能抛出一个错误,提示它应该是一个字符串。

- 因为之前的限制,__这样可以详细的注释类型__。我们不得不手动声明 `message` 作为字符串的唯一原因,是因为 `TypeScript` 不能推断类型。

幸运的是, [vue-class-component](https://github.com/vuejs/vue-class-component) 可以解决这两个问题。这是一个官方的库,允许您用 @component 装饰器，像原生 JavaScript 类那样声明组件库。让我们重写上述组件作为一个示例:

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// The @Component decorator indicates the class is a Vue component
@Component({
  // All component options are allowed in here
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Initial data can be declared as instance properties
  message: string = 'Hello!'

  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
```

由于这种语法的替代,我们的组件定义不仅更短,而且 `TypeScript` 也可以推断出 `message` 和 `onClick` 的类型没有显式接口声明。这种策略甚至允许您处理类型为计算属性,生命周期钩子和渲染功能。完整的使用细节,请参阅[vue-class-component](https://github.com/vuejs/vue-class-component#vue-class-component)文档。

***

> 原文：https://vuejs.org/v2/guide/typescript.html

***
