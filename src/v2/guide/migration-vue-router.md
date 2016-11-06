---
title: Migration from Vue Router 0.7.x
type: guide
order: 26
---

> Only Vue Router 2 is compatible with Vue 2, so if you're updating Vue, you'll have to update Vue Router as well. That's why we've included details on the migration path here in the main docs. For a complete guide on using the new Vue Router, see the [Vue Router docs](http://router.vuejs.org/en/).

## Router Initialization

### `router.start` <sup>replaced</sup>

There is no longer a special API to initialize an app with Vue Router. That means instead of:

``` js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

You'll just pass a router property to a Vue instance:

``` js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

Or, if you're using the runtime-only build of Vue:

``` js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>router.start</code> being called.</p>
</div>
{% endraw %}

## Route Definitions

### `router.map` <sup>replaced</sup>

Routes are now defined as an array on a [`routes` option](http://router.vuejs.org/en/essentials/getting-started.html#javascript) at router instantiation. So these routes for example:

``` js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

Will instead be defined with:

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

The array syntax allows more predictable route matching, since iterating over an object is not guaranteed to use the same key order across browsers.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>router.map</code> being called.</p>
</div>
{% endraw %}

### `router.on` <sup>removed</sup>

If you need to programmatically generate routes when starting up your app, you can do so by dynamically pushing definitions to a routes array. For example:

``` js
// Normal base routes
var routes = [
  // ...
]

// Dynamically generated routes
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

If you need to add new routes after the router has been instantiated, you can replace the router's matcher with a new one that includes the route you'd like to add:

``` js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>router.on</code> being called.</p>
</div>
{% endraw %}

### `subRoutes` <sup>renamed</sup>

[Renamed to `children`](http://router.vuejs.org/en/essentials/nested-routes.html) for consistency within Vue and with other routing libraries.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>subRoutes</code> option.</p>
</div>
{% endraw %}

### `router.redirect` <sup>replaced</sup>

This is now an [option on route definitions](http://router.vuejs.org/en/essentials/redirect-and-alias.html). So for example, you will update:

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

to a definition like below in your `routes` configuration:

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>router.redirect</code> being called.</p>
</div>
{% endraw %}

### `router.alias` <sup>replaced</sup>

This is now an [option on the definition for the route](http://router.vuejs.org/en/essentials/redirect-and-alias.html) you'd like to alias to. So for example, you will update:

``` js
router.alias({
  '/manage': '/admin'
})
```

to a definition like below in your `routes` configuration:

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

If you need multiple aliases, you can also use an array syntax:

``` js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>router.alias</code> being called.</p>
</div>
{% endraw %}

### Arbitrary Route Properties <sup>replaced</sup>

Arbitrary route properties must now be scoped under the new meta property, to avoid conflicts with future features. So for example, if you had defined:

``` js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

Then you would now update it to:

``` js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```

Then when later accessing this property on a route, you will still go through meta. For example:

``` js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of arbitrary route properties not scoped under meta.</p>
</div>
{% endraw %}

## Route Matching

Route matching now uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) under the hood, making it much more flexible than previously.

### One or More Named Parameters <sup>changed</sup>

The syntax has changed slightly, so `/category/*tags` for example, should be updated to `/category/:tags+`.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete route syntax.</p>
</div>
{% endraw %}

## Links

### `v-link` <sup>replaced</sup>

The `v-link` directive has been replaced with a new [`<router-link>` component](http://router.vuejs.org/en/api/router-link.html), as this sort of job is now solely the responsibility of components in Vue 2. That means whenever wherever you have a link like this:

``` html
<a v-link="'/about'">About</a>
```

You'll need to update it like this:

``` html
<router-link to="/about">About</router-link>
```

Note that `target="_blank"` is not supported on `<router-link>`, so if you need to open a link in a new tab, you have to use `<a>` instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>v-link</code> directive.</p>
</div>
{% endraw %}

### `v-link-active` <sup>replaced</sup>

The `v-link-active` directive has also been replaced by the `tag` attribute on [the `<router-link>` component](http://router.vuejs.org/en/api/router-link.html). So for example, you'll update this:

``` html
<li v-link-active>
  <a v-link="'/about'">About</a>
</li>
```

to this:

``` html
<router-link tag="li" to="/about">
  <a>About</a>
</router-link>
```

The `<a>` will be the actual link (and will get the correct href), but the active class will be applied to the outer `<li>`.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>v-link-active</code> directive.</p>
</div>
{% endraw %}

## Programmatic Navigation

### `router.go` <sup>changed</sup>

For consistency with the [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API), `router.go` is now only used for [back/forward navigation](https://router.vuejs.org/en/essentials/navigation.html#routergon), while [`router.push`](http://router.vuejs.org/en/essentials/navigation.html#routerpushlocation) is used to navigate to a specific page.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>router.go</code> being used where <code>router.push</code> should be used instead.</p>
</div>
{% endraw %}

## Router Options: Modes

### `hashbang: false` <sup>removed</sup>

Hashbangs are no longer required for Google to crawl a URL, so they are no longer the default (or even an option) for the hash strategy.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>hashbang: false</code> option.</p>
</div>
{% endraw %}

### `history: true` <sup>replaced</sup>

All routing mode options have been condensed into a single [`mode` option](http://router.vuejs.org/en/api/options.html#mode). Update:

``` js
var router = new VueRouter({
  history: 'true'
})
```

to:

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>history: true</code> option.</p>
</div>
{% endraw %}

### `abstract: true` <sup>replaced</sup>

All routing mode options have been condensed into a single [`mode` option](http://router.vuejs.org/en/api/options.html#mode). Update:

``` js
var router = new VueRouter({
  abstract: 'true'
})
```

to:

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>abstract: true</code> option.</p>
</div>
{% endraw %}

## Route Options: Misc

### `saveScrollPosition` <sup>replaced</sup>

This has been replaced with a [`scrollBehavior` option](http://router.vuejs.org/en/advanced/scroll-behavior.html) that accepts a function, so that the scroll behavior is completely customizable - even per route. This opens many new possibilities, but to simply replicate the old behavior of:

``` js
saveScrollPosition: true
```

You can replace it with:

``` js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>saveScrollPosition: true</code> option.</p>
</div>
{% endraw %}

### `root` <sup>renamed</sup>

Renamed to `base` for consistency with [the HTML `<base>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>root</code> option.</p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>removed</sup>

This option is no longer necessary now that Vue's transition system has explicit [`appear` transition control](transitions.html#Transitions-on-Initial-Render).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>transitionOnLoad: true</code> option.</p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>removed</sup>

Removed due to hooks simplification. If you really must suppress transition errors, you can use [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>suppressTransitionError: true</code> option.</p>
</div>
{% endraw %}

## Route Hooks

### `activate` <sup>replaced</sup>

Use [`beforeRouteEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) in the component instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>beforeRouteEnter</code> hook.</p>
</div>
{% endraw %}

### `canActivate` <sup>replaced</sup>

Use [`beforeEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#perroute-guard) in the route instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>canActivate</code> hook.</p>
</div>
{% endraw %}

### `deactivate` <sup>removed</sup>

Use the component's [`beforeDestroy`](../api/#beforeDestroy) or [`destroyed`](../api/#destroyed) hooks instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>deactivate</code> hook.</p>
</div>
{% endraw %}

### `canDeactivate` <sup>replaced</sup>

Use [`beforeRouteLeave`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) in the component instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>canDeactivate</code> hook.</p>
</div>
{% endraw %}

### `canReuse: false` <sup>removed</sup>

There's no longer a use case for this in the new Vue Router.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>canReuse: false</code> option.</p>
</div>
{% endraw %}

### `data` <sup>replaced</sup>

The `$route` property is now reactive, so you can just use a watcher to react to route changes, like this:

``` js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>data</code> hook.</p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>removed</sup>

Define your own property (e.g. `isLoading`), then update the loading state in a watcher on the route. For example, if fetching data with [axios](https://github.com/mzabriskie/axios):

``` js
data: function () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': function () {
    var self = this
    self.isLoading = true
    self.fetchData().then(function () {
      self.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    var self = this
    return axios.get('/api/posts')
      .then(function (response) {
        self.posts = response.data.posts
      })
      .catch(function (error) {
        self.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>$loadingRouteData</code> meta property.</p>
</div>
{% endraw %}
