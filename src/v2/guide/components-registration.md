---
title: 组件注册
type: guide
order: 101
---

> 本页面会假定你已经阅读过 [组件基础](components.html)。如果你还不熟悉组件，请先阅读组件基础后再阅读本页面。

## 组件名称

在注册一个组件时，通常会给定一个名称。例如，在迄今为止我们所见过的全局注册中：

```js
Vue.component('my-component-name', { /* ... */ })
```

`Vue.component` 的第一个参数，是组件的名称。

你传给组件的名称，可能取决于将来使用它的位置。（不同于模板字符串或 [单文件组件](single-file-components.html)，）当直接在 DOM 中使用组件时，我们强烈推荐你的自定义标签名称遵循 [W3C 规则](https://www.w3.org/TR/custom-elements/#concepts)。这有助于避免你的组件注册名称，与现有和未来的 HTML 元素名称产生冲突。

你可以在 [风格指南](../style-guide/#Base-component-names-strongly-recommended) 中，看到关于组件名称的推荐用法。

### 命名方案

可以通过两种可选方式，定义组件名称：

#### 串联式命名(kebab-case)

```js
Vue.component('my-component-name', { /* ... */ })
```

使用串联式命名(kebab-case)定义一个组件，在引用其自定义元素时，你必须也使用串联式命名(kebab-case)，例如 `<my-component-name>`。

#### Pascal 式命名(PascalCase)

```js
Vue.component('MyComponentName', { /* ... */ })
```

使用 Pascal 式命名(PascalCase)定义一个组件，在引用其自定义元素时，两种方式都可以使用。也就是说 `<my-component-name>` 和 `<MyComponentName>` 都是可以接受的。然而要注意，直接在 DOM 中（即，非字符串模板）引用自定义元素，串联式命名(kebab-case)是唯一有效的命名方式。

## 全局注册方式(global registration)

到目前为止，我们只是用到 `Vue.component` 来创建组件：

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

这些组件都是**全局注册**。也就是说，全局注册的组件，可以在之后（通过 `new Vue`）创建的 Vue 根实例的模板中引用。例如：

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

这甚至可以应用于所有子组件，这意味着，这三个组件还可以在每个其他组件_内部_使用。

## 局部注册方式(local registration)

全局注册方式并不是很合适。例如，如果你使用一个类似 webpack 的模块构建系统，全局注册所有组件，意味着就算你不引用某个组件，它仍然会打包到最终的构建 bundle 中。这会增加 JavaScript 的体积，让用户下载多余的代码。

在下面这些示例中，可以将你的组件定义为纯 JavaScript 对象：

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

然后，在 `components` 选项中，定义你需要用到的组件：

```js
new Vue({
  el: '#app'
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

对于 `components` 对象的每个属性，对象的 key 是自定义元素的名称，而 value 包含着组件的选项对象。

注意，**局部注册的组件在子组件中_无法访问_**。例如，如果你想要 在 `ComponentB` 中访问 `ComponentA`，你必须使用：

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

或者，如果使用 ES2015 模块（例如，通过 Babel 和 webpack 进行转译），则看起来可能类似这样：

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

注意，在 ES2015+ 中，在一个对象放置类似 `ComponentA` 这样的变量名称，其实是 `ComponentA: ComponentA` 的简写形式，也就是说，变量的名称：

- 既是在模板中引用的自定义元素的名称
- 而且，也是包含组件选项对象的变量的引用名

## 模块系统

如果你未使用 `import`/`require` 模块系统，你可以跳过这一部分。如果你用到模块系统，我们为你准备了一些特殊的指导和提示。

### 在模块系统中的局部注册方式

如果你还在阅读，那么你可能正在使用一个模块系统（例如，通过 Babel 和 webpack 进行转译）。在这种场景中，我们推荐你创建一个 `components` 选项，并在这个组件中引用每个组件。

然后，在局部注册这些组件之前，你需要预先导入每个需要用到的组件。例如，在假想的 `ComponentB.js` 或 `ComponentB.vue` 文件中：

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

现在，可以在 `ComponentB` 组件的模板内部引用 `ComponentA` 和 `ComponentC` 这两个组件。

### 自动化全局注册基本组件

许多相对通用的组件，例如，内部可能只含有一个 input 或 button 元素。我们有时将这些组件归为 [基础组件](../style-guide/#%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90)，并且往往在其他组件中频繁使用这类组件。

结果就是，许多组件可能会列出一个很长的基础组件清单，然后在 components 选项中进行逐个引用：

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

这么麻烦的操作，也只是为了在模板中，支持相对很少用到的组件标签：

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

幸运的是，如果你正在使用 webpack（或者内置 webpack 的 [Vue CLI 3+](https://github.com/vuejs/vue-cli)），你就可以只通过 `require.context` 来全局注册这些常用基础组件。在你的应用程序入口文件（例如 `src/main.js`）中，你可能会通过全局方式导入基础组件，下面是一些示例代码：

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // components 文件夹的相对路径
  './components',
  // 是否查找子文件夹
  false,
  // 用于匹配组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 取得组件的 Pascal 式命名
  const componentName = upperFirst(
    camelCase(
      // 将文件名前面的 `'./` 和扩展名剥离
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  // 以全局方式注册组件
  Vue.component(
    componentName,
    // 如果组件是通过 `export default` 导出，
    // 则在 `.default` 中，查找组件选项，
    // 否则回退至模块根对象中，查找组件选项
    componentConfig.default || componentConfig
  )
})
```

切记，**全局注册方式必须在（通过 `new Vue` 创建的）Vue 根实例创建之前置入组件**。这里是按照以上所述的，一个真实项目环境[示例](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js).

***

> 原文：http://vuejs.org/v2/guide/components-registration.html

***
