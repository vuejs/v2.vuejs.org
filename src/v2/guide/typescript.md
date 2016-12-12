---
title: TypeScript
type: guide
order: 25
---

If you develop a large application, using a language having static type checking would be helpful. If your code seems to cause unexpected behavior, it provides useful errors before you run it on browsers. You can easily use [TypeScript](https://www.typescriptlang.org/) (one of popular AltJS having static type checking) with Vue since Vue officially provides its declaration files.

## Official Declaration Files

There are official declaration files for Vue, vue-router and vuex. You do not have to use external tools like `typings` to use them since they are published via npm. You can install Vue's declarations with `npm install vue`. Then, all declarations can be imported with `import` statement.

Example of component definition with TypeScript:

``` ts
// we cannot write `import Vue from 'vue'` in TypeScript
// because of the difference of module resolution strategy
// against the other AltJS and module bundlers
import Vue = require('vue')

Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
```

Note that `Vue` is already typed, so all methods, properties and parameters will be type checked. For example, if you typo `template` option, TypeScript compiler will print an error message on a compile time.

If you want to use Vue's types explicitly, they belong to the `Vue` object. In case you create a component on a separated file (e.g. [single file component](single-file-components.html)), you can annotate a type with the component option object:

``` ts
import Vue = require('vue')

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'

// annotate ComponentOptions with `as` operator
} as Vue.ComponentOptions<Vue>
```

You can see all available types on the corresponding repository ([here are Vue's types](https://github.com/vuejs/vue/blob/dev/types/index.d.ts)).

<p class="tip">The declaration files of Vue requires `--lib DOM,ES2015` as compiler option. So you need to pass the option via `tsc` command or `tsconfig.json`. For more details of compiler options, please see [Compiler Options · TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)</p>

## vue-class-component and Decorators

Sometimes it would be verbose to write components with TypeScript. For example, you may need to declare component properties and methods explicitly and annotate the type to component options while it is initialized in `data` hook:

``` ts
import Vue = require('vue')

// declare the component type
interface MyComponent extends Vue {
  message: string
  onClick (): void
}

export default {
  template: '<button @click="onClick">Click!</button>',
  data: function () {
    // initialize component data
    // TypeScript cannot infer the data type
    return {
      message: 'Hello!'
    }
  },
  methods: {
    onClick: function () {
      // `this` is declarated as MyComponent
      window.alert(this.message)
    }
  }

// annotate MyComponent type explicitly
} as Vue.ComponentOptions<MyComponent>
```

This is because TypeScript cannot infer the component type from the Vue API. To avoid unnecessary type annotation, we can use [vue-class-component](https://github.com/vuejs/vue-class-component). vue-class-component let us write a component like a native JavaScript class. For example, if we write the above component with vue-class-component:

``` ts
import Vue = require('vue')
import Component from 'vue-class-component'

// ECMAScript Decorator syntax
// @Component indicates the class will be
// defined as a Vue component
@Component({
  // all component options are allowed in here
  template: '<button @click="onClick">Click!</button>'
})
export default MyComponent extends Vue {
  // initial data can be declared as class instance properties
  message: string = 'Hello!'

  // component methods can be declared as class instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
```

With vue-class-component, the Vue component's data and methods can be declared by the class syntax. So that TypeScript infers their types without explicit interface declarations.

If you want to extend the functionallity of vue-class-component for your use cases, you can make additional decorators for class components by using the `createDecorator` helper (See [the README of vue-class-component](https://github.com/vuejs/vue-class-component#create-custom-decorators)).
