---
title: Vue Route Change Handling
type: cookbook
order: 10
---

## Simple Example

While using [vue-router](https://router.vuejs.org/en/) we often need to refresh the data when a route or query changes, to do so we can use a `:key` trick to force Vue to always re-create the components:

```js
Vue.component('OrderIndex', {
  created() {
    this.loadData();
  },
  methods: {
    loadData() { /* logic to load data */ },
  },
});
```

```html
<router-view :key="$route.fullPath"></router-view>
```

This will assure that when going from `/orders` to `/orders?page=2` or from `/orders?page=2` to `/orders?page=1`, a fresh instance of `OrderIndex` component will be provided, which will trigger the `created` method and download fresh data each time. There also is a subtle alternative to it:

```html
<router-view :key="$route.path"></router-view>
```

The difference is that `/orders` and `/orders?page=2` would not reload re-create the components and data would not be reloaded, but going from `/orders` to `/invoices` with the same `OrdersIndex` component used, it would be re-created.

The former aren't widely known so the most commonly used way is the plain `router-view`:

```html
<router-view></router-view>
```

and adding a watcher for the `$route` object:

```js
Vue.component('OrderIndex', {
  watch: {
    $route: {
      immediate: true,
      handler: 'loadData',
    },
  },
  methods: {
    loadData() { /* logic to load data */ },
  },
});
```

Now each time the route changes, components will reload their data.

<p class="tip">Remember! Don't modify `$route.query` directly - it will not be persisted to the url and components will not reload, use `$router.push` or `$router.replace` instead.</p>

## Simple, but not good enough
While both methods work, there are some drawbacks to each one. Lets start with:

```html
<router-view :key="$route.fullPath"></router-view>
```

The `$route.fullPath` returns the full url including the query e.g. `/orders?page=2&filter=search`, so what happens when you visit from `/orders` to `/orders?page=1`? The page is re-created with new instances of components and the data is reloaded, yet the route is technically the same as before. At this point the only possible workaround would be to cache the results using something like [VueX](https://vuex.vuejs.org) or plain object. There are more complex examples why this could introduce more reloads than necessary which we'll cover further.

<p class="tip">Note! While watching `$route` and using `:key="$route.fullPath"` the watcher will never fire unless the component is in another `router-view` scope without `key`.</p>

Next we have the watch `$route` path. This gives us more freedom when to reload the data, but it also introduces the chore to do it.  Taking the `/orders` to `/orders?page=1` example, you now can decide if the page query parameter exists and then reload the data:

```js
$route(to, from) {
  if (to.query.page === from.query.page) {
    // Page did not change
    return;
  } else if (to.query.page && !from.query.page) {
    // We went from /orders to /order?page=#
    
    if (to.query.page === '1') {
	  // Technically the same page
	  return;
    }
    
    // We have something like /order?page=2
    this.loadData();
  } else {
    // Our current page and previous page doesn't match
    this.loadData();
  }
}
```

While the snippet could be optimized, it's still quite something just for a `page` query parameter, imagine how it would grow if you have 2 or more similar fields or `page` parameter should reset to `1` when `filter` is changed.

## Resetting query value when necessary
Let's say there is a paginated list that reads `page` from the query, and a search input - `filter` query. When search term changes (aka. the `filter` query parameter changes), the page should reset to `1` because there might not be any results if you're on page 50. Now while this doesn't seem too complicated at first glance, think about the order it should happen - user enters text into the search field, and a code snippet updates the route (preferrably [debounced](https://davidwalsh.name/javascript-debounce-function) method):

```js
searchUpdated: debounce(function (event) {  
  this.$router.push({ 
    query: {
      ...this.$route.query, // Keep existing query values
      filter: event.target.value, // Add or replace old filter value
    }
  });
}, 300),
```

Only issue now is the `page` stays the same, so the logical way would be to tweak it a bit:

```js
searchUpdated: debounce(function (event) {  
  this.$router.push({ 
    query: {
      ...this.$route.query,
      page: 1, // Reset the page
      filter: event.target.value,
    }
  });
}, 300),
```

And we're done, we can leave work early and go celebrate! But not quite. What happens if the user changes the `filter` in the url directly? The answer is - whatever the `$route` watcher does. In this case we technically lost the page reset functionality, while it's arguable whether or not this is a valid case as the user can change the `page` into invalid value and it breaks all the same, it would still be preferable that by changing the `filter` query (maybe it happened programmatically with `$router.push/replace`) the component would deal with resetting `page` itself. While the latter would be ideal, it would require writing an advanced navigation interceptor to combine multiple component query requirements and patch the destination route to avoid multiple update triggers and history entries.

<p class="tip">Note! There is no way to reset query values or know if they're invalid if the user entered the page with already invalid query parameters until the data is downloaded or known before hand.</p>

```js
$route(to, from) {
  // Ommited for the sake of sanity...
  // Because of the complexity only 2 fields introduce,
  // you can easily fall into infinite redirect loop and
  // just hang the users browser.
}
```

Going back to the order it all happens - user changes search query, a code snippet updates the query with new search term (let's omit the `page` reset), a `$route` watcher fires that resets the `page` parameter in similar way as `searchUpdated` except uses `$router.replace`, the watcher fires again to make sure everything is in order this time (and maybe again... and again... and so on if there's even a small mistake).

So at this point you'd rather deal with reloading most of the data and be happy with your life, if only you weren't a developer and this wouldn't haunt you that is... and it just keeps piling on - what if the query parameter is a `tab` name, it should not reload anything on the page, just switch the active tab; what if I have index view, and the edit is a modal on top of the view with it's unique route (e.g. `order.edit`), why opening it reloads the list, and so on... these are the things that the `<router-view :key="$route.fullPath"/>` prevents you from achieving, that and the insane amounts of code and logic required to handle the `$route` watcher.

## Partial solution
While advanced solution could be invented, for most of the use cases a more linear approach is sufficient, so in spite of that, the current solution has limitations:

 - if the user changes url query directly, it will not reset query values (without navigation interception this could cause multiple history entries added when values are being reset);
 - query values are reset that are only specified in the component that updates the query via `setQuery` method;

The mixin snippet is available at this [gist](https://gist.github.com/donnysim/19669db010f7973b6ddcc3dc43190b25).

This mixin allows you to specify what query parameters you are interested in. To use it, save it in your project and import it as a mixin into the component that would deal with query changes:

```js
import Query from './Query';

Vue.component('OrderIndex', {
  mixins: [Query],
});
```

It will work only if two conditions are met: the `query` config is provided and `queryUpdated` handler is added:

```js
Vue.component('OrderIndex', {
  mixins: [Query],
  query: { // can also be a function
    page: {
      default: 1,
    },
    filter: {},
  },
  queryUpdated(newQuery, oldQuery) {
    this.loadData();
  },
  created() {
    this.loadData();
  },
});
```

All configured values from the query can be accessed via `this.$query` and changes to the query should be done using `this.setQuery(name, value)` method. How it all looks is when the route is `/orders`, `$query` is `{ page: '1', filter: null }`, when route is `/orders?filter=search&tab=main` - `{ page: '1', filter: 'search' }`. Note how `tab` parameter was omitted because it was not declared in query configuration, yet you can still access it through `$route.query` if needed.
 
The provided configuration example ensures that any non registered query values are ignored - going from `/orders` to `/orders?page=1` will not trigger `queryUpdated`, because the `page` is already of a value `1` by default even if it is not in the query.

Now going back to the search example, the page should reset when the filter is changed, we can do that with slight addition to the `page` configuration:

```js
page: {
  default: 1,
  resetOnChange: true,
},
```

The `resetOnChange` makes sure that if any defined query values change, it will be reset to default value, so calling `this.setQuery('filter', 'search')`  would change current query from  `/orders?page=2` to `/orders?page=1&filter=search`. In the same way the query can be removed by providing a falsy value, e.g. `this.setQuery('filter', '')` will remove the `filter` parameter from the query.
On a side note, sometimes there's a need to reset value when specific query field changes, so there are couple of options:

```js
page: {
  default: 1,
  resetOnChange: ['filter'], // reset only when filter changes
},
expanded: {
  default: null,
  resetOnChange: {
    except: ['page'], // reset on anything else, except when only page has changed
  },
},
```

You can also convert the values to number or boolean:

```js
page: {
  default: 1,
  type: Number,
  resetOnChange: true,
},
active: {
  default: false, // default if conversion to boolean failed
  type: Boolean, // will return true if value is '1' or 'true' and false if '0' or 'false'
},
```

In addition when converting values, going to `/orders?page=invalidNumber` will not trigger any updates because the conversion to number failed and a default value is used instead.

Now how about the example with the tabs mentioned earlier, where the user can switch the tab and it's name is persisted into the query, but no component should re-load their data? There's also a handler for it:

```js
tab: {
  triggerChange: false,
},
```

If only the `tab` query changes, the query update won't be triggered. 

So now multiple components on the same page can have their query parameters and act only when they need to. This also works in situations like opening a modal with it's own route while displaying a list, to avoid component data reloads you would need to pass the existing query to the new route:

```js
this.$router.push({ 
  name: 'orders.edit', 
  params: { id: 1 }, 
  query: this.$route.query,
});
```

Now the modal can watch and change some queries that it needs without intervening with the list (this depends if they don't have common query parameters). Now while the possible solution is not for every edge case, could be improved and expanded upon, it should prove as an example for dealing with more complex situations.

## Browser history and navigation

Persisting state into the query can provide an easy way for the user to link to specific view on page load or tab, but doing so without `$router.replace` adds additional browser history entries which sometimes is desired. While this is not a problem in most cases, let's take user profile page as an example: there are tabs to group user information and the tab is persisted into the query using `$router.push` when switching tabs so a new history entry is created and browser back button switches the tabs back. At the same time there is a separate back button at the bottom of the page that should bring the user back to the page from which the user got to the profile page. Because we're using `$router.push`, we cannot trust `$router.back` to bring us where we need.

Let's make a helper class to hold our router state:

```js
class History {
  constructor(router) {
    this._router = router; // router
    this._lastUniqueRoute = null; // last unique route state
    this._currentRoute = null; // current route state
    this._tracking = true; // state to skip tracking `replace` calls

    // Register route interception
    this._router.afterEach(to => {
      if (!this.current) {
        this._setCurrent(to);
        return;
      }

      if (this._tracking) {
        this._registerRoute(to);
      }

      this._setCurrent(to);
    });
  }

  get current() {
    return this._currentRoute;
  }

  get lastUnique() {
    return this._lastUniqueRoute;
  }

  push(config, track = true) {
    this._tracking = track;
    this._router.push(config, () => this._resetTracking(), () => this._resetTracking());
  }

  replace(config) {
    this._tracking = false;
    this._router.replace(config, () => this._resetTracking(), () => this._resetTracking());
  }

  backToUnique(defaultConfig) {
    if (this.lastUnique) {
      this._router.push(this.lastUnique);
    } else {
      this._router.push(defaultConfig);
    }
  }

  _registerRoute(route) {
    if (route.name !== this._currentRoute.name) {
      this._lastUniqueRoute = this._cloneRoute(this._currentRoute);
    }
  }

  _setCurrent(route) {
    this._currentRoute = this._cloneRoute(route);
  }

  _resetTracking() {
    this._tracking = true;
  }

  _cloneRoute(route) {
    return {
      name: route.name,
      params: route.params,
      query: route.query,
      path: route.path,
    };
  }
}
```

The whole logic is quite simple, when creating the History we pass our router instance where we bind our global `afterEach` hook. We also provide our version of `push` and `replace` to be able to control when the change should be tracked - e.g. `replace` should never be tracked. Additionally there's a `backToUnique` helper to go back to the last unique page the user visited. 

The basic setup to get up and going with basic history tracking:

```js
import Vue from 'vue';
import Router from 'vue-router';
import History from './History';

const router = new Router(/* your route config */);
const history = new History(router);

Object.defineProperty(Vue.prototype, '$history', {
    get() {
      return history;
    },
});

new Vue({
  el: '#app',
  router,
});
```

Some differences for navigating would be to use `$history.push` and `$history.replace` instead of `$router` equivalent. Now on the profile page, for the back button instead of having something like:

```js
goBack() {
  this.$router.back();
  // or
  this.$router.push({ name: 'user.index' });
}
```

We would switch them to the `$history` instance:

```js
goBack() {
  this.$history.backToUnique({ name: 'user.index' });
}
```

In this instance, if the user got here through a bookmark or new tab, then there is no last unique route and we fall back to `user.index` route, otherwise the user will go back to wherever he was before - `blog.index`, `news.view` etc..

While there are many ways of achieving the same result, this should provide you with some insights and ideas on how something like this could be solved.

## Summary
All solutions come back to the simple term `it depends`. Every application has different needs, different structure and requirements, for example maybe the route is being tracked in VueX; maybe component data is loaded/resolved before the page transition happens... there are endless factors that determine what tools we use to achieve our goal and they should be chosen depending on those factors.
