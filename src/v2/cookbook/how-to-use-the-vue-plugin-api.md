---
title: Making use of the Vue Plugin API
type: cookbook
order: 15
---

## Base Example

Vue exposes a really nifty API for creating plugins, plugins allow us to modify and add features to Vue. This cookbook is aimed at showing you how to take a simple idea and turn it into a full-fledged Vue plugin.

Let's say we want to create a simple abstraction for using Vuex within Vue components, we want to reduce the boilerplate essentially. We can first design how we want the abstraction to look.

Usually we would use Vuex like this in a Vue component:

```js
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    ...mapMutations(['UPDATE_USER']),
  },
}
```

Our abstraction would look something like this:

```js
export default {
  vuex: {
    state: {
      user: (state) => state.user,
    },
    mutations: ['UPDATE_USER'],
  },
}
```

## Let's build the plugin

### Setting up the plugin

Before we can get into the logic of the plugin, we first need to setup up the plugin in a `.js` file

```js
import Vue from 'vue'

const plugin = {
  install(LocalVue) {
    
  }
}

Vue.use(plugin)
```

You might have come across `Vue.use()` before, the method is responsible for registering plugins and it takes an object with a method named `install` which gets called.

The `install` hook exposes two parameters:

* First parameter is the Vue constructor
* Second parameter is the options that you pass to the plugin

Next step is to add a global mixin in the `install` hook, we can use the `beforeCreate` lifecycle hook to add/modify the Vue component instance

```js
import Vue from 'vue'

const plugin = {
  install(LocalVue) {
    LocalVue.mixin({
      beforeCreate() {
        this // we can access the component instance
      }
    })
  }
}

Vue.use(plugin)
```

### Writing the plugin logic

Now that we have all the plugin boilerplate setup, let's have a look at actually taking our abstraction and converting it to something that Vue understands.

Every Vue instance has a property called `$options` which contains a reference to all the options exported in the Vue component, you can read more about the [Options API](https://vuejs.org/v2/api/?#Options-Data).

#### Step 1 - Access vuex from options

```js
import Vue from 'vue'

const plugin = {
  install(LocalVue) {
    LocalVue.mixin({
      beforeCreate() {
        const { 
          vuex = {},
          methods = {},
          computed = {},
        } = this.$options
      }
    })
  }
}

Vue.use(plugin)
```

Here we are destructuring the `vuex`, `methods` and `computed` properties from the `$options` object and if it does not exist we can set a default of an empty object.

#### Step 2 - Access props from vuex

```js
import Vue from 'vue'

const plugin = {
  install(LocalVue) {
    LocalVue.mixin({
      beforeCreate() {
        const { 
          vuex = {},
          methods = {},
          computed = {},
        } = this.$options

        const {
          state = {},
          getters = {},
          mutations = {},
          actions = {},
        } = vuex
      }
    })
  }
}

Vue.use(plugin)
```

Next step is to destructure the `state`, `getters`, `mutations` and `actions` from the `vuex` property and set default objects as well.

#### Step 3 - Map vuex

```js
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const plugin = {
  install(LocalVue) {
    LocalVue.mixin({
      beforeCreate() {
        const {
          vuex = {},
          methods = {},
          computed = {},
        } = this.$options

        const {
          state = {},
          getters = {},
          mutations = {},
          actions = {},
        } = vuex

        this.$options.methods = {
          ...methods,
          ...mapMutations(mutations),
          ...mapActions(actions),
        }

        this.$options.computed = {
          ...computed,
          ...mapState(state),
          ...mapGetters(getters),
        }
      }
    })
  }
}

Vue.use(plugin)
```

This step is the most important as we now need to override and destructure all the vuex mappings to `methods` and `computed` properties. We need to destructure `methods` and `computed` so we don't break existing options that the user exports.

#### Step 4 - Import plugin

If you want to use the Vue plugin, we can just import the plugin in your `main.js` file or any entry point file of your Vue app 

```js
import Vue from 'vue'
import './plugins/vuex.js'

new Vue({
  // options
}).$mount('#app')
```

## Creating a NPM package

Creating a NPM package is a bit out of the scope of this cookbook but I believe it is a very important part of making a plugin. I would highly recommend you check out this article on how to create a package [How to make a beautiful, tiny npm package and publish it](https://www.freecodecamp.org/news/how-to-make-a-beautiful-tiny-npm-package-and-publish-it-2881d4307f78/).

In this case all we would need to do is export the `plugin` object in it's own JS file.

## Alternative solutions

In this specific case we just needed to use a mixin, so why don't we just use a mixin instead? We could do that as an alternative solution but what if we want to include `directives` or `filters` globally and make this example a helper plugin for Vue. In most cases users feel more comfortable with plugins as using custom packages is more likely to be registered with `Vue.use()`

## Wrapping up

Creating Vue plugins has always seemed like something that was not as approachable to just about any developer but once you really dig into it you will see that it is not that hard and just takes some playing around to understand what's happening under the hood.