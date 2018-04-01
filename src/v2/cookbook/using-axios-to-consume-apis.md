---
title: Using Axios to Consume APIs
type: cookbook
order: 9
---

## Base Example

There are many times when building application for the web that you may want to consume and display data from an API. There are several ways to do so, but a very popular approach is to use [axios](https://github.com/axios/axios), a promise-based HTTP client.

In this exercise, we'll use the [CoinDesk API](https://www.coindesk.com/api/) to walk through displaying Bitcoin prices, updated every minute. First, we'd install axios with either npm/yarn or through a CDN link.

There are a number of ways we can request information from the API, but it's nice to first find out what the shape of the data looks like, in order to know what to display. In order to do so, we'll make a call to the API endpoint and output it so we can see it. We can see in the CoinDesk API documentation, that this call will be made to `https://api.coindesk.com/v1/bpi/currentprice.json`. So first, we'll create a data property that will eventually house our information, and we'll retrieve the data and assign it using the `mounted` lifecycle hook:

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null
    }
  },
  mounted () {
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

This is a lot easier for us to display, so we can now update our HTML to display only the information we need from the data we've received, and we'll create a [filter](../api/#Vue-filter) to make sure that the decimal is in the appropriate place as well.

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
  currencydecimal (value) {
    return value.toFixed(2)
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Third Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Third Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Dealing with Errors

There are times when we might not get the data we need from the API. There are several reasons that our axios call might fail, including but not limited to:

* The API is down.
* The request was made incorrectly.
* The API isn't giving us the information in the format that we anticipated.

When making this request, we should be checking for just such circumstances, and giving ourselves information in every case so we know how to handle the problem. In an axios call, we'll do so by using `catch`.

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

This will let us know if something failed during the API request, but what if the data is mangled or the API is down? Right now the user will just see nothing. We might want to build a loader for this case, and then tell the user if we're not able to get the data at all.

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null,
      loading: true,
      errored: false
    }
  },
  filters: {
    currencydecimal (value) {
      return value.toFixed(2)
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
})
```

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>

  <section v-if="errored">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>

  <section v-else>
    <div v-if="loading">Loading...</div>

    <div v-else v-for="currency in info" class="currency">
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

You can hit the rerun button on this pen to see the loading status briefly while we gather data from the API:

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Fourth Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Fourth Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

This can be even further improved with the use of components for different sections and more distinct error reporting, depending on the API you're using and the complexity of your application.

## Alternative Patterns

### Fetch API

The [Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) is a powerful native API for these types of requests. You may have heard that one of the benefits of the Fetch API is that you don't need to load an external resource in order to use it, which is true! Except... that it's not fully supported yet, so you will still need to use a polyfill. There are also some gotchas when working with this API, which is why many prefer to use axios for now. This may very well change in the future though.

If you're interested in using the Fetch API, there are some [very good articles](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api) explaining how to do so.

## Wrapping Up

There are many ways to work with Vue and axios beyond consuming and displaying an API. You can also communicate with Serverless Functions, post/edit/delete from an API where you have write access, and many other benefits. Due to the straightforward integration of these two libraries, it's become a very common choice for developers who need to integrate HTTP clients into their workflow.
