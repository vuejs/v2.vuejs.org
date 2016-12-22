---
title: TypeScript Support
type: guide
order: 25
---

## 官方的声明文件

静态类型系统可以帮助防止许多潜在的运行时错误，特别是随着应用程序的增长. 这就是为什么Vue使用 [TypeScript](https://www.typescriptlang.org/) 的正式类型声明 - 不仅在Vue-core，也为 [Vue-router](https://github.com/vuejs/vue/tree/dev/types) 和 [Vuex](https://github.com/vuejs/vue/tree/dev/types)。

由于这些[声明文件](https://unpkg.com/vue/types/)是在 NPM 上发布的，你甚至不需要像 `Typings` 这样的外部工具，因为声明是用Vue自动导入的。 这意味着你需要的是简单的引入 Vue:

``` ts
import Vue = require('vue')
```

然后所有的方法，属性和参数将被检查类型。 例如，如果拼写 `template` 组件选项为t empate（缺少 l ）， TypeScript 编译器将在编译时打印一条错误消息。 如果你使用可以验证TypeScript的编辑器，如 [Visual Studio Code](https://code.visualstudio.com/)，你甚至可以在编译之前捕获这些错误：


![TypeScript Type Error in Visual Studio Code](/images/typescript-type-error.png)

### 编译选项

Vue的声明文件需要 `--lib DOM,ES2015.Promise` [编译选项](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。 您可以将此选项传递到 `tsc` 命令或将等效内容添加到 `tsconfig.json` 文件。

### 访问Vue的类型声明

如果你想注释自己的代码与Vue的类型,您可以访问在Vue的出口对象。例如,注释一个组件的选择对象(例如在一个 `vue` 文件):

``` ts
import Vue = require('vue')

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as Vue.ComponentOptions<Vue>
```

## 类-样式Vue组件

Vue 组件选项可以很容易地注释类型:

``` ts
import Vue = require('vue')

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
} as Vue.ComponentOptions<MyComponent>
```

不幸的是,这里有一些限制：

- __TypeScript 不能从 Vue 推断出所有类型的 API。__例如,它不知道 `data` 返回的  `message` 属性将被添加到 `MyComponent` 实例。这意味着如果我们指定一个数字或布尔值信息,验证器和编译器不能抛出一个错误,提示它应该是一个字符串。


- 因为之前的限制,__这样可以详细的注释类型__。我们不得不手动声明 `message` 作为字符串的唯一原因,是因为 `TypeScript` 不能推断类型。

幸运的是, [vue-class-component](https://github.com/vuejs/vue-class-component) 可以解决这两个问题。这是一个官方的库,允许您用 @component 装饰器，像原生 JavaScript 类那样声明组件库。让我们重写上述组件作为一个示例:

``` ts
import Vue = require('vue')
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

