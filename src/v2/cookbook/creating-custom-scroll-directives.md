---
title: Creating Custom Scroll Directives
type: cookbook
order: 5
---

## Simple Example

There are many times that we might want to add a bit of behavior, especially animation, to a scroll event on a site. There are many ways to do so, but the path with the least amount of code and dependencies is to use a custom directive to create hook for anything that fires off a particular scroll event.

``` js
Vue.directive('scroll', {
  inserted: function(el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f);
      }
    };
    window.addEventListener('scroll', f);
  },
});

// main app
new Vue({
  el: '#app',
  methods: {
   handleScroll: function(evt, el) {
    if (window.scrollY > 50) {
      el.setAttribute("style", "opacity: 1; transform: translate3d(0, -10px, 0)")
    }
    return window.scrollY > 100;
    }
  }
});
```

``` html
<div id="app">
  <h1 class="centered">Scroll me</h1>
  <div class="box" v-scroll="handleScroll">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

We'd also need a style property that will transition the intermediary values here, in this case: 

```
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="800" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Custom Scroll Directive- CSS Transition" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">Custom Scroll Directive- CSS Transition</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Or, with GreenSock(GSAP) or any other JavaScript animation library, the code becomes even more simple:

``` js
Vue.directive('scroll', {
  inserted: function(el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f);
      }
    };
    window.addEventListener('scroll', f);
  },
});

// main app
new Vue({
  el: '#app',
  methods: {
   handleScroll: function(evt, el) {
    if (window.scrollY > 50) {
      TweenMax.to(el, 1.5, {
        y: -10,
        opacity: 1,
        ease: Sine.easeOut
      })
    }
    return window.scrollY > 100;
    }
  }
});
```

Though we would remove the CSS transition from this implementation because it's now handled with JavaScript.

## The Benefit of Using Custom Directives

Vue is rich with options for directives, most of which cover very common use-cases, which can create a very productive developer experience. But even if you have an edge case not covered by the framework, it's got your back there as well, because you can quite easily create a custom directive to fit your need.

Attaching and removing scroll events to elements is a really good use case for a custom directive because, just like other directives we use, they are necessarily tied to the element and otherwise, we'd have to find the reference for it in the DOM. This pattern avoids the need for traversal, and keeps the event logic paired with the node that it's in reference to.

## Real-World Example: Using a Custom Scroll Directive for Scrollytelling

Let's say you're replacing the [now-retired Vue Resource](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4). You really enjoyed accessing request methods through `this.$http` and you want to do the same thing with Axios instead.

All you have to do is include axios in your project:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.2/axios.js"></script>

<div id="app">
  <ul>
    <li v-for="user in users">{{ user.name }}</li>
  </ul>
</div>
```

Alias `axios` to `Vue.prototype.$http`:

``` js
Vue.prototype.$http = axios
```

Then you'll be able to use methods like `this.$http.get` in any Vue instance:

``` js
new Vue({
  el: '#app',
  data: {
    users: []
  },
  created () {
    var vm = this
    this.$http.get('https://jsonplaceholder.typicode.com/users')
      .then(function (response) {
        vm.users = response.data
      })
  }
})
```

## The Context of Prototype Methods

In case you're not aware, methods added to a prototype in JavaScript gain the context of the instance. That means they can use `this` to access data, computed properties, methods, or anything else defined on the instance.

Let's take advantage of this in a `$reverseText` method:

``` js
Vue.prototype.$reverseText = function (propertyName) {
  this[propertyName] = this[propertyName].split('').reverse().join('')
}

new Vue({
  data: {
    message: 'Hello'
  },
  created: function () {
    console.log(this.message)    // => "Hello"
    this.$reverseText('message')
    console.log(this.message)    // => "olleH"
  }
})
```

Note that the context binding will __not__ work if you use an ES6/2015 arrow function, as they implicitly bind to their parent scope. That means the arrow function version:

``` js
Vue.prototype.$reverseText = propertyName => {
  this[propertyName] = this[propertyName].split('').reverse().join('')
}
```

Would throw an error:

``` log
Uncaught TypeError: Cannot read property 'split' of undefined
```

## When To Avoid This Pattern

As long as you're vigilant in scoping prototype properties, using this pattern is quite safe - as in, unlikely to produce bugs.

However, it can sometimes cause confusion with other developers. They might see `this.$http`, for example, and think, "Oh, I didn't know about this Vue feature!" Then they move to a different project and are confused when `this.$http` is undefined. Or, maybe they want to Google how to do something, but can't find results because they don't realize they're actually using Axios under an alias.

__The convenience comes at the cost of explicitness.__ When looking at a component, it's impossible to tell where `$http` came from. Vue itself? A plugin? A coworker?

So what are the alternatives?

## Alternative Patterns

### When Not Using a Module System

In applications with __no__ module system (e.g. via Webpack or Browserify), there's a pattern that's often used with _any_ JavaScript-enhanced frontend: a global `App` object.

If what you want to add has nothing to do with Vue specifically, this may be a good alternative to reach for. Here's an example:

``` js
var App = Object.freeze({
  name: 'My App',
  description: '2.1.4',
  helpers: {
    // This is a purely functional version of
    // the $reverseText method we saw earlier
    reverseText: function (text) {
      return text.split('').reverse().join('')
    }
  }
})
```

<p class="tip">If you raised an eyebrow at `Object.freeze`, what it does is prevent the object from being changed in the future. This essentially makes all its properties constants, protecting you from future state bugs.</p>

Now the source of these shared properties is more obvious: there's an `App` object defined somewhere in the app. To find it, developers can run a project-wide search.

Another advantage is that `App` can now be used _anywhere_ in your code, whether it's Vue-related or not. That includes attaching values directly to instance options, rather than having to enter a function to access properties on `this`:

``` js
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
