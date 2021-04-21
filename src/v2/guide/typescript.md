---
title: TypeScript Support
type: guide
order: 403
---

> [Vue CLI](https://cli.vuejs.org) provides built-in TypeScript tooling support.

## Official Declaration in NPM Packages

A static type system can help prevent many potential runtime errors, especially as applications grow. That's why Vue ships with [official type declarations](https://github.com/vuejs/vue/tree/dev/types) for [TypeScript](https://www.typescriptlang.org/) - not only in Vue core, but also for [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) and [vuex](https://github.com/vuejs/vuex/tree/dev/types) as well.

Since these are [published on NPM](https://cdn.jsdelivr.net/npm/vue@2/types/), and the latest TypeScript knows how to resolve type declarations in NPM packages, this means when installed via NPM, you don't need any additional tooling to use TypeScript with Vue.

## Recommended Configuration

``` js
// tsconfig.json
{
  "compilerOptions": {
    // this aligns with Vue's browser support
    "target": "es5",
    // this enables stricter inference for data properties on `this`
    "strict": true,
    // if using webpack 2+ or rollup, to leverage tree shaking:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Note that you have to include `strict: true` (or at least `noImplicitThis: true` which is a part of `strict` flag) to leverage type checking of `this` in component methods otherwise it is always treated as `any` type.

See [TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html) for more details.

## Development Tooling

### Project Creation

[Vue CLI 3](https://github.com/vuejs/vue-cli) can generate new projects that use TypeScript. To get started:

```bash
# 1. Install Vue CLI, if it's not already installed
npm install --global @vue/cli

# 2. Create a new project, then choose the "Manually select features" option
vue create my-project-name
```

### Editor Support

For developing Vue applications with TypeScript, we strongly recommend using [Visual Studio Code](https://code.visualstudio.com/), which provides great out-of-the-box support for TypeScript. If you are using [single-file components](./single-file-components.html) (SFCs), get the awesome [Vetur extension](https://github.com/vuejs/vetur), which provides TypeScript inference inside SFCs and many other great features.

[WebStorm](https://www.jetbrains.com/webstorm/) also provides out-of-the-box support for both TypeScript and Vue.

## Basic Usage

To let TypeScript properly infer types inside Vue component options, you need to define components with `Vue.component` or `Vue.extend`:

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // type inference enabled
})

const Component = {
  // this will NOT have type inference,
  // because TypeScript can't tell this is options for a Vue component.
}
```

## Class-Style Vue Components

If you prefer a class-based API when declaring components, you can use the officially maintained [vue-class-component](https://github.com/vuejs/vue-class-component) decorator:

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



## Annotating Props

```ts
import Vue, { PropType } from 'vue'

interface ComplexMessage {
  title: string,
  okMessage: string,
  cancelMessage: string
}
const Component = Vue.extend({
  props: {
    name: String,
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    message: {
      type: Object as PropType<ComplexMessage>,
      required: true,
      validator (message: ComplexMessage) {
        return !!message.title;
      }
    }
  }
})
```
If you find validator not getting type inference or member completion isn't working, annotating the argument with the expected type may help address these problems.



## Annotating `$refs`

The type of [$refs](../api#refs) cannot be inferred automatically, as they can refer both to `HTMLElement`s and child components. To solve this, you can add a type assertion.

Either inline:

```ts
const Component = Vue.extend({
  mounted(): void {
    (this.$refs.checkbox as HTMLInputElement).indeterminate = true
  }
})
```

Or on the `Vue` object:

```ts
import Vue, { VueConstructor } from 'vue'

import MyChildComponent from './MyChildComponent.vue'

interface Refs {
  $refs: {
    checkbox: HTMLInputElement;
    child: InstanceType<typeof MyChildComponent>;
  }
}

const Component = (Vue as VueConstructor<
  Vue & Refs
>).extend({
  mounted(): void {
    this.$refs.checkbox.indeterminate = child.indeterminateState
  }
})
```



## Annotating Mixins

Likewise, TypeScript cannot automatically infer the types of properties and methods provided by [mixins](./Mixins).

To solve this, you can add a type assertion on the `Vue` object:

```ts
import Vue, { VueConstructor } from 'vue'

import MyMixin from './MyMixin.vue'

const Component = (Vue as VueConstructor<
  Vue & InstanceType<typeof MyMixin>
>).extend({
  mixins [MyMixin],
  computed: {
    message(): string {
      return this.methodProvidedByMixin("hello")
    }
  }
})
```

This also works for multiple mixins:

```ts
const Component = (Vue as VueConstructor<
  Vue & InstanceType<typeof MixinA> & InstanceType<typeof MixinB>
>).extend({
  // ...
})
```



## Wrapped methods

TypeScript cannot infer the type of `this` in the body of wrapped methods:

```ts
import Vue from "vue"
import { debounce } from "lodash"

const Component = Vue.extend({
  methods: {
    update: debounce(() => {
      this.$emit('input', this.value)
    }, 1000)
  }
})
```

However, you can define the method as is and wrap it in the `created()` hook:

```ts
import Vue from "vue"
import { debounce } from "lodash"

const Component = Vue.extend({
  created() {
    this.update = debounce(this.update, 1000)
  }
  methods: {
    update() {
      this.$emit('input', this.value)
    }
  }
})
```

> If you want to wrap a `computed` setter or a `watch` handler, you will have to extract a `method` and apply this pattern to that method.



## Limitations

Please note the following limitations when migrating a Vue project to TypeScript:

- You cannot use TypeScript inside the `<template>…</template>` section.
- When importing Single File Components, you have to include the `.vue` file extension in the import declaration.
- Components defined with `Vue.extend` always have the name `"VueComponent"`. This might cause "duplicate key" issues when using `component.name` in the [`key` special attribute](../api/#key).
