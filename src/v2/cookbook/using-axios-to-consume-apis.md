---
title: Using Axios To Consume APIs
type: cookbook
order: 9
---

## Simple Example

There are many times when building application for the web that you may want to consume and display data from an API. There are several ways to do so, but a very popular approach is to use [axios](https://github.com/axios/axios), a promise-based HTTP client.

In this exercise, we'll use the [Coindesk API](https://www.coindesk.com/api/) to walk through displaying Bitcoin prices, updated every minute. First, we'd install axios with either npm/yarn or through a CDN link.

There are a number of ways we can request information from the API, but it's nice to first find out what the shape of the data looks like, in order to know what to display. In order to do so, we'll make a call to the API endpoint and output it so we can see it. We can see in the Coindesk API documentation, that this call will be made to `https://api.coindesk.com/v1/bpi/currentprice.json`. So first, we'll create a data property that will eventually house our information, and we'll retrieve the data and assign it using the `mounted` lifecycle hook:

```js
new Vue({
  el: '#app',
  data() {
    return {
      info: null
    }
  },
  mounted() {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})
```

```html
<div id="app">
  {{ info }}
</div>
```

And what we get is this:

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="First Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">First Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Excellent! We've got some data. But it looks pretty messy right now so let's display it properly and add some error handling in case things aren't working as expected or it takes longer than we thought to get the information.

## Real-World Example: Working with the Data

### Displaying Data from an API

It's pretty typical that the information we'll need is within the response, and we'll have to traverse what we've just stored to access it properly. In our case, we can see that the price information we need lives in `response.data.bpi`. If we use this instead, our output is as follows:

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Second Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Second Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

This is a lot easier for us to display, so we can now update our html to display only the information we need from the data we've received, and we'll create a filter to make sure that the decimal is in the appropriate place as well.

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>
  <div v-for="currency in info" class="currency">
    {{ currency.description }}:
    <span class="lighten">
      <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
    </span>
  </div>
</div>
```

```js
filters: {
  currencydecimal(value) {
    return value.toFixed(2);
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Third Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Third Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Dealing with Errors

There are times when we might not get the data we need from the API. There are several reasons that our axios call might fail, including but not limited to:

* The API is down
* The request was made incorrectly
* The API isn't giving us the information in the format that we anticipated

When making this request, we should be checking for just such circumstances, and giving ourselves information in every case so we know how to handle the problem. In an axios call, we'll do so by using `catch`.

## The Context of Prototype Methods

In case you're not aware, methods added to a prototype in JavaScript gain the context of the instance. That means they can use `this` to access data, computed properties, methods, or anything else defined on the instance.

Let's take advantage of this in a `$reverseText` method:

```js
Vue.prototype.$reverseText = function(propertyName) {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}

new Vue({
  data: {
    message: 'Hello'
  },
  created: function() {
    console.log(this.message) // => "Hello"
    this.$reverseText('message')
    console.log(this.message) // => "olleH"
  }
})
```

Note that the context binding will **not** work if you use an ES6/2015 arrow function, as they implicitly bind to their parent scope. That means the arrow function version:

```js
Vue.prototype.$reverseText = propertyName => {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}
```

Would throw an error:

```log
Uncaught TypeError: Cannot read property 'split' of undefined
```

## When To Avoid This Pattern

As long as you're vigilant in scoping prototype properties, using this pattern is quite safe - as in, unlikely to produce bugs.

However, it can sometimes cause confusion with other developers. They might see `this.$http`, for example, and think, "Oh, I didn't know about this Vue feature!" Then they move to a different project and are confused when `this.$http` is undefined. Or, maybe they want to Google how to do something, but can't find results because they don't realize they're actually using Axios under an alias.

**The convenience comes at the cost of explicitness.** When looking at a component, it's impossible to tell where `$http` came from. Vue itself? A plugin? A coworker?

So what are the alternatives?

## Alternative Patterns

### When Not Using a Module System

In applications with **no** module system (e.g. via Webpack or Browserify), there's a pattern that's often used with _any_ JavaScript-enhanced frontend: a global `App` object.

If what you want to add has nothing to do with Vue specifically, this may be a good alternative to reach for. Here's an example:

```js
var App = Object.freeze({
  name: 'My App',
  description: '2.1.4',
  helpers: {
    // This is a purely functional version of
    // the $reverseText method we saw earlier
    reverseText: function(text) {
      return text
        .split('')
        .reverse()
        .join('')
    }
  }
})
```

<p class="tip">If you raised an eyebrow at `Object.freeze`, what it does is prevent the object from being changed in the future. This essentially makes all its properties constants, protecting you from future state bugs.</p>

Now the source of these shared properties is more obvious: there's an `App` object defined somewhere in the app. To find it, developers can run a project-wide search.

Another advantage is that `App` can now be used _anywhere_ in your code, whether it's Vue-related or not. That includes attaching values directly to instance options, rather than having to enter a function to access properties on `this`:

```js
new Vue({
  data: {
    appVersion: App.version
  },
  methods: {
    reverseText: App.helpers.reverseText
  }
})
```

### When Using a Module System

When you have access to a module system, you can easily organize shared code into modules, then `require`/`import` those modules wherever they're needed. This is the epitome of explicitness, because in each file you gain a list of dependencies. You know _exactly_ where each one came from.

While certainly more verbose, this approach is definitely the most maintainable, especially when working with other developers and/or building a large app.
