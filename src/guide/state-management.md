---
title: State Management
type: guide
order: 22
---

## Official Flux-Like Implementation

Large applications can often grow in complexity, due to multiple pieces of state scattered across many components and the interactions between them. To solve this problem, Vue offers [vuex](https://github.com/vuejs/vuex): our own Elm-inspired state management library. It even integrates into [vue-devtools](https://github.com/vuejs/vue-devtools), providing zero-setup access to time travel.

### Information for React Developers

If you're coming from React, you may be wondering how vuex compares to [redux](https://github.com/reactjs/redux), the most popular Flux implementation in that ecosystem. Redux is actually view-layer agnostic, so it can easily be used with Vue via some [simple bindings](https://github.com/egoist/revue). Vuex is different in that it _knows_ it's in a Vue app. This allows it to better integrate with Vue, offering a more intuitive API and improved development experience.

## Simple State Management from Scratch

It is often overlooked that the source of truth in Vue applications is the raw `data` object - a Vue instance simply proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you can simply share it by identity:

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Now whenever `sourceOfTruth` is mutated, both `vmA` and `vmB` will update their views automatically. Subcomponents within each of these instances would also have access via `this.$root.$data`. We have a single source of truth now, but debugging would be a nightmare. Any piece of data could be changed by any part of our app at any time, without leaving a trace.

To help solve this problem, we can adopt a simple **store pattern**:

``` js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    this.debug && console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    this.debug && console.log('clearMessageAction triggered')
    this.state.message = 'action B triggered'
  }
}
```

Notice all actions that mutate the store's state are put inside the store itself. This type of centralized state management makes it easier to understand what type of mutations could happen and how are they triggered. When something goes wrong, we'll also now have a log of what happened leading up to the bug.

In addition, each instance/component can still own and manage its own private state:

``` js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![State Management](/images/state.png)

<p class="tip">It's important to note that you should never replace the original state object in your actions - the components and the store need to share reference to the same object in order for mutations to be observed.</p>

As we continue developing the convention where components are never allowed to directly mutate state that belongs to a store, but should instead dispatch events that notify the store to perform actions, we eventually arrive at the [Flux](https://facebook.github.io/flux/) architecture. The benefit of this convention is we can record all state mutations happening to the store and implement advanced debugging helpers such as mutation logs, snapshots, and history re-rolls / time travel.

This brings us full circle back to [vuex](https://github.com/vuejs/vuex), so if you've read this far it's probably time to try it out!
