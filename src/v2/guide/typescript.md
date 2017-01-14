---
title: TypeScript Support
type: guide
order: 25
---

## Official Declaration Files

A static type system can help prevent many potential runtime errors, especially as applications grow. That's why Vue ships with [official type declarations](https://github.com/vuejs/vue/tree/dev/types) for [TypeScript](https://www.typescriptlang.org/) - not only in Vue core, but also [for Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) and [for Vuex](https://github.com/vuejs/vuex/tree/dev/types) as well.

Since these are [published on NPM](https://unpkg.com/vue/types/), you don't even need external tools like `Typings`, as declarations are automatically imported with Vue. That means all you need is a simple:

``` ts
import Vue = require('vue')
```

Then all methods, properties, and parameters will be type checked. For example, if you misspell the `template` component option as `tempate` (missing the `l`), the TypeScript compiler will print an error message at compile time. If you're using an editor that can lint TypeScript, such as [Visual Studio Code](https://code.visualstudio.com/), you'll even be able to catch these errors before compilation:

![TypeScript Type Error in Visual Studio Code](/images/typescript-type-error.png)

### Compilation Options

Vue's declaration files require the `--lib DOM,ES5,ES2015.Promise` [compiler option](https://www.typescriptlang.org/docs/handbook/compiler-options.html). You can pass this option to the `tsc` command or add the equivalent to a `tsconfig.json` file.

### Accessing Vue's Type Declarations

If you want to annotate your own code with Vue's types, you can access them on Vue's exported object. For example, to annotate an exported component options object (e.g. in a `.vue` file):

``` ts
import Vue = require('vue')

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as Vue.ComponentOptions<Vue>
```

## Class-Style Vue Components

Vue component options can easily be annotated with types:

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

Unfortunately, there are a few limitations here:

- __TypeScript can't infer all types from Vue's API.__ For example, it doesn't know that the `message` property returned in our `data` function will be added to the `MyComponent` instance. That means if we assigned a number or boolean value to `message`, linters and compilers wouldn't be able to raise an error, complaining that it should be a string.

- Because of the previous limitation, __annotating types like this can be verbose__. The only reason we have to manually declare `message` as a string is because TypeScript can't infer the type in this case.

Fortunately, [vue-class-component](https://github.com/vuejs/vue-class-component) can solve both of these problems. It's an official companion library that allows you to declare components as native JavaScript classes, with a `@Component` decorator. As an example, let's rewrite the above component:

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

With this syntax alternative, our component definition is not only shorter, but TypeScript can also infer the types of `message` and `onClick` without explicit interface declarations. This strategy even allows you to handle types for computed properties, lifecycle hooks, and render functions. For full usage details, see [the vue-class-component docs](https://github.com/vuejs/vue-class-component#vue-class-component).
