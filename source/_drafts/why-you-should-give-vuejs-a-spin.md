title: Why You Should Give Vue.js a Spin
date: 2014-02-07 22:34:12
---

## It's Simple

## It's Expressive

## It's Composable

## It's Flexible

## It's Fast

## It's not for everyone, I know

The Right Level of Abstraction... does not exist. Or it is different for different use cases. If we think of the level of abstraction as a spectrum, on one end we have full-blown convention-over-configuration frameworks like Ember; on the other end we have some Component heavy users who would publish a package for a 3-line function and have an application made up of hundreds of tiny modules. These are all valid choices and there is not an absolutely best way to do this. But the fact is, my preference falls somewhere in between, and I believe there are others who feel the same.

## Comparison with Other Libraries

I think the only serious users right now are us here at Google Creative Lab, but hey, I just launched it to public this week! Speed is actually not the major selling point of Vue - simplicity is. Also, Vue is only an interface library, not a framework. For larger projects it's intended to be used with a modular build system e.g. Component or Browserify. That said, here's why you'd want to give Vue a shot over several common frameworks:

### Angular

If you like everything about Angular you should definitely stick with it. But it's not perfect for everyone. Vue.js tries to provide the benefits of MVVM data binding while being overall much simpler, so you don't have to bend your mind around $digest vs. $apply, preLink vs. postLink, or how dependency injection works. The core API is just a constructor that can be extended with a bunch of options. Vue is also much less opinionated, giving you the flexibility to use it as the view layer in a custom front-end stack.

### Backbone

Backbone has a simple and friendly API, but it has no data binding and your View will be cluttered with lots of DOM manipulation. You'd have to resort to third party libs such as KnockBack or Rivets.js to achieve that, then it suddenly requires a lot of boilerplate and becomes not that simple. Also, hard dependency on jQuery... which you might not need if you are targeting modern browsers.

### Knockout

In modern browsers, using ES5 getter/setters gets rid of Knockout's awkward syntax of initializing everything with ko.observable() and getting/setting as invoking functions. Vue.js also provides a declarative way to nest and compose your ViewModels, which can be tricky in Knockout.

### Ember

Ember is philosophically almost the exact opposite of Vue: heavy, opnionated, all-encompassing, convention over configuration... if you are into that then Vue is probably not for you.

### React

React is probably the closest to Vue among all these libs in terms of areas covered and position in the stack. It is a great lib, but I'm not a fan of constructing all the HTML in JavaScript - I prefer to write actual HTML and work with the actual DOM, which is what Vue does. Since I'm also a designer, I find Vue's approach makes it easier to work with CSS. Finally, in React the DOM is almost completely abstracted away, but in Vue you still have the flexibility to reach down in custom directives.
Take note these are my personal opinions and I'm most likely biased, but you are more than welcome to do your own research and see if you agree with me.

### Ractive

Very very similar. But Vue.js allows you to easily extend the vocabulary with custom directives and filters, a feature which Ractive doesn't seem to offer. Since both libraries