---
title: Migration from Vuex 0.6.x to 1.0
type: guide
order: 27
---

> Vuex 2.0 is released, but this guide only covers the migration to 1.0? Is that a typo? Also, it looks like Vuex 1.0 and 2.0 were released simultaneously. What's going on? Which one should I use and what's compatible with Vue 2.0?

Both Vuex 1.0 and 2.0:

- fully support both Vue 1.0 and 2.0
- will be maintained for the forseeable future

They have slightly different target users however.

__Vuex 2.0__ is a radical redesign and simplification of the API, for those who are starting new projects or want to be on the cutting edge of client-side state management. __It is not covered by this migration guide__, so you should check out [the Vuex 2.0 docs](https://vuex.vuejs.org/en/index.html) if you'd like to learn more about it.

__Vuex 1.0__ is mostly backwards-compatible, so requires very few changes to upgrade. It is recommended for those with large existing codebases or who just want the smoothest possible upgrade path to Vue 2.0. This guide is dedicated to facilitating that process, but only includes migration notes. For the complete usage guide, see [the Vuex 1.0 docs](https://github.com/vuejs/vuex/tree/1.0/docs/en).

## `store.watch` with String Property Path <sup>replaced</sup>

`store.watch` now only accept functions. So for example, you would have to replace:

``` js
store.watch('user.notifications', callback)
```

with:

``` js
store.watch(
  // When the returned result changes...
  function (state) {
    return state.user.notifications
  },
  // Run this callback
  callback
)
```

This gives you more complete control over the reactive properties you'd like to watch.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>store.watch</code> with a string as the first argument.</p>
</div>
{% endraw %}

## Store's Event Emitter <sup>removed</sup>

The store instance no longer exposes the event emitter interface (`on`, `off`, `emit`). If you were previously using the store as a global event bus, [see this section](migration.html#dispatch-and-broadcast-removed) for migration instructions.

Instead of using this interface to watch events emitted by the store itself (e.g. `store.on('mutation', callback)`), a new method `store.subscribe` is introduced. Typical usage inside a plugin would be:

``` js
var myPlugin = store => {
  store.subscribe(function (mutation, state) {
    // Do something...
  })
}

```

See example [the plugins docs](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md) for more info.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>store.on</code>, <code>store.off</code>, and <code>store.emit</code>.</p>
</div>
{% endraw %}

## Middlewares <sup>replaced</sup>

Middlewares are replaced by plugins. A plugin is simply a function that receives the store as the only argument, and can listen to the mutation event on the store:

``` js
const myPlugins = store => {
  store.subscribe('mutation', (mutation, state) => {
    // Do something...
  })
}
```

For more details, see [the plugins docs](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>middlewares</code> option on a store.</p>
</div>
{% endraw %}
