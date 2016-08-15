---
title: Comparison with Other Frameworks
type: guide
order: 24
---

This is definitely the most difficult page in the guide to write, but we do feel it's important. Odds are, you've had problems you tried to solve and you've used another library to solve them. You're here because you want to know if Vue can solve your specific problems better. That's what we hope to answer for you.

We also try very hard to avoid bias. As the core team, we obviously like Vue a lot. There are some problems we think it solves better than anything else out there. If we didn't believe that, we wouldn't be working on it. We do want to be fair and accurate though. Where other libraries offer significant advantages, such as React's vast ecosystem of alternative renderers or Knockout's browser support back to IE6, we try to list these as well.

We'd also like **your** help keeping this document up-to-date because the JavaScript world moves fast! If you notice an inaccuracy or something that doesn't seem quite right, please let us know by [opening an issue](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React and Vue share many similarities. They both:

- utilize a virtual DOM
- provide reactive and composable view components
- maintain focus in the core library, with concerns such as routing and global state management handled by companion libraries

There are, of course, many differences as well:

### Performance Profiles

In every real-world scenario that we've tested so far, Vue outperforms React by a fair margin (usually at least 20-50% faster, though in some cases much more than that). We could now link to benchmarks - but frankly, all benchmarks are flawed in some way and very few resemble what you'd write in a real application. Instead, let's break it down.

#### Render Performance

Here's a simplified way to think about it. In React, let's say the cost of rendering an element is 1 and the cost of an average component is 2. In Vue, the cost of an element would be more like 0.1, but the cost of an average component would be 4, due to the setup required for our reactivity system.

In extreme cases, such as using 1 normal component to render each element, Vue will probably be slower. However, both Vue and React offer functional components that would typically be preferred in a situation like this. As of writing, React plans to offer performance improvements for functional components, making them roughly the cost of elements. Vue's functional components already offer that optimization, so that when using functional components, Vue should then perform about 20 times as fast in this scenario, but only 10 times as fast after React optimizes their functional components.

#### Update Performance

In React, you need to implement `shouldComponentUpdate` everywhere and use immutable data structures to achieve fully optimized re-renders. In Vue, a component's dependencies are automatically tracked so that it only updates when one of those dependencies change. The only further optimization that sometimes can be helpful in Vue is adding a `key` attribute to items in long lists.

This means updates in unoptimized Vue will be much faster than unoptimized React and actually, due to the improved render performance in Vue, even optimized React will usually be slower than Vue is out-of-the-box.

#### In Development

Obviously, performance in production is the most important and that's what we've been discussing so far. Performance in development still matters though. Both Vue and React remain fast enough in development for most normal applications.

However, if you're prototyping any high-performance data visualizations or animations, you may find it useful to know that in scenarios where Vue can't handle more than 20 frames per second in development, we've seen React slow down to 2 frames per second.

This is due to React's many heavy invariant checks, which help it provide many excellent warnings and error messages. We agree that these are important in Vue, but have also kept an eye on performance while we implement these checks.

### HTML & CSS

In React, everything is Just JavaScript, which sounds very simple and elegant - until you dig deeper. The unfortunate reality is that reinventing HTML and CSS within JavaScript can cause a lot of pain. In Vue, we instead embrace web technologies and build on top of them. To show you what that means, we'll dive into some examples.

#### JSX vs Templates

With React's JSX, there are minor differences from HTML, such as using `className` instead of `class`, but that's really not too bad. What feels really awkward is constantly switching back and forth between JavaScript and JSX, especially since not everything is an expression in JavaScript.

Take this example below:

``` jsx
render () {
  const { items } = this.props

  return (
    <div className='list-container'>
      {items.length
        ? <ul>
            {items.map(item => <li key={item.id}>{item.name}</li>)}
          </ul>
        : <p>No items found.</p>
      }
    </div>
  )
}
```

This is an extremely common use case, but using JSX, there are a few problems that may not be immediately obvious:

- __Syntax Noise__: All the curly braces add visual noise, but what's worse is that while writing it, you have to frequently make decisions about how to minimize their visual impact, slowing development.

- __Cajoling JavaScript into Expressions__: The example uses a ternary rather than an if statement here, which arguably makes the code less readable, but is still possibly the best of bad options. The only alternatives include hoisting this logic out of its context or wrapping an if statement in an immediately-invoked function expression. Do expressions will help a little when they're a more stable feature, but they're currently at stage 0.

- __Readability to Non-React Developers__: Imagine having a designer that's familiar with HTML and CSS look at this. They'd be paralyzed with confusion at every single line. While the JSX will look somewhat similar to HTML, `className` replaces `class`, the ternary will be meaningless, and parentheses and curly braces are everywhere. It'd be difficult for them to make simple modifications or even understand what this code is doing.

In Vue, we also have [render functions](render-function.html) and even [support JSX](render-function.html#JSX), because sometimes it is useful to have the power of a full programming language. Render functions are not recommended for most components however.

Instead, we offer templates as a simpler alternative:

``` html
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ul>
    <p v-else>No items found</p>
  </div>
</template>
```

A few advantages here:

- Any valid HTML is valid in a template
- Many fewer implementation and stylistic decisions have to be made while writing a template
- There's much less visual noise
- It reads more like English (e.g. for each item in items)

This is not only much easier for the developer that's writing it, but designers, junior developers, or those newer to JavaScript are also much more likely to be able to understand what's going on and even contribute code.

It doesn't end there though. By embracing HTML rather than trying to reinvent it, Vue also allows you to use preprocessors such as Pug (formerly known as Jade) in your templates.

#### Component-Scoped CSS

Unless you're OK spreading components out over multiple files (for example with [CSS Modules](https://github.com/gajus/react-css-modules)), it's difficult to find a good solution for scoping CSS in React. Very basic CSS works fine, but common features such as hover states, media queries, and pseudo-selectors all either require heavy dependencies to reinvent what CSS already does - or they simply don't work. And no matter what you end up using in the end, it'll have involved a lot of research before you can even get a simple hover state to work.

Vue on the other hand, gives you full access to CSS within [single-file components](single-file-components.html):

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

The optional `scoped` attribute automatically scopes this CSS to your component by adding a unique attribute (such as `data-v-1`) to elements and compiling `.list-container:hover` to something like `.list-container[data-v-1]:hover`.

Finally, just as with HTML, you also have the option of writing your CSS using any preprocessors you'd like. This allows you to perform design-centric operations such as color manipulation during your build process, rather than importing specialized JavaScript libraries that would increase the size of your build and complexity of your application.

### Scale

#### Scaling Up

For large applications, both Vue and React offer robust routing solutions. The React community has also been very innovative in terms of state management solutions (e.g. Flux/Redux). These state management patterns and [even Redux itself](https://github.com/egoist/revue) can be easily integrated into Vue applications. In fact, Vue has even taken this model a step further with [Vuex](https://github.com/vuejs/vuex), an Elm-inspired state management solution that integrates deeply into Vue that we think offers a superior development experience.

Another important difference between these offerings is that Vue's companion libraries for state management and routing (among [other concerns](https://github.com/vuejs)) are all officially supported and kept up-to-date with the core library. React instead chooses to leave these concerns to the community, creating a more fragmented ecosystem.

Finally, Vue offers a [CLI project generator](https://github.com/vuejs/vue-cli) that makes it trivially easy to start a new project using your choice of build system, including [Webpack](github.com/vuejs-templates/webpack), [Browserify](github.com/vuejs-templates/browserify), or even [no build system](https://github.com/vuejs-templates/simple). React is also making strides in this area with [create-react-app](https://github.com/facebookincubator/create-react-app), but it currently has a few limitations:

- It does not allow any configuration during project generation, while Vue's project templates allow Yeoman-like customization.
- It only offers a single template that assumes you're building a single-page application, while Vue offers a wide variety of templates for various purposes and build systems.
- It cannot generate projects from user-built templates, which can be especially useful for enterprise environments with pre-established conventions.

It's important to note though that many of these limitations are intentional design decisions made by the create-react-app team and they do have their advantages. For example, as long your project's needs are very simple and you never need to "eject" to customize your build process, you'll be able to update it as a dependency. You can read more about the [differing philosophy here](https://github.com/facebookincubator/create-react-app#philosophy).

#### Scaling Down

React is renowned for its steep learning curve. Before you can really get started, you need to know about JSX and probably ES2015+, since many examples use React's class syntax. You also have to learn about build systems, because although you could technically use Babel Standalone to live-compile your code, it's not recommended for production.

While Vue scales up just as well as, if not better than React, it also scales down just as well as jQuery. That's right - all you have to do is drop a single script tag into a page:

``` html
<script src="https://npmcdn.com/vue@next/dist/vue.js"></script>
```

Then you can start writing Vue code and even ship the minified version to production without feeling guilty or having to worry about performance problems.

Since you don't need to know about JSX, ES2015, or build systems to get started with Vue, it also typically takes developers less than a day reading [the guide](/guide) to learn enough to build non-trivial applications.

### Custom Renderers

The React team has been ambitious in making React a platform-agnostic UI development paradigm, with custom renderers for mobile platforms, Canvas, and many more. While custom renderers can theoretically also be written for Vue, we are currently focused on the web.

### With MobX

MobX has become quite popular in the React community and it actually uses a nearly identical reactivity system to Vue. To a limited extent, the React + MobX workflow can be thought of as a more verbose Vue, so if you're using that combination and are enjoying it, jumping into Vue is probably the next logical step.

## Angular 1

Some of Vue's syntax will look very similar to Angular (e.g. `v-if` vs `ng-if`). This is because there were a lot of things that Angular got right and these were an inspiration for Vue very early in its development. There are also many pains that come with Angular however, where Vue has attempted to offer a significant improvement.

### Complexity

Vue is much simpler than Angular 1, both in terms of API and design. Learning enough to build non-trivial applications typically takes less than a day, which is not true for Angular 1.

### Flexibility and Modularity

Angular 1 has strong opinions about how your applications should be structured, while Vue is a more flexible, modular solution. While this makes Vue more adaptable to a wide variety of projects, we also recognize that sometimes it's useful to have some decisions made for you, so that you can just get started coding.

That's why we offer a [Webpack template](https://github.com/vuejs-templates/webpack) that can set you up within minutes, while also granting you access to advanced features such as hot module reloading, linting, CSS extraction, and much more.

### Data binding

Angular 1 uses two-way binding between scopes, while Vue enforces a one-way data flow between components. This makes the flow of data easier to reason about in non-trivial applications.

### Directives vs Components

Vue has a clearer separation between directives and components. Directives are meant to encapsulate DOM manipulations only, while components are self-contained units that have their own view and data logic. In Angular, there's a lot of confusion between the two.

### Performance

Vue has better performance and is much, much easier to optimize because it doesn't use dirty checking. Angular 1 becomes slow when there are a lot of watchers, because every time anything in the scope changes, all these watchers need to be re-evaluated again. Also, the digest cycle may have to run multiple times to "stabilize" if some watcher triggers another update. Angular users often have to resort to esoteric techniques to get around the digest cycle, and in some situations, there's simply no way to optimize a scope with many watchers.

Vue doesn't suffer from this at all because it uses a transparent dependency-tracking observation system with async queueing - all changes trigger independently unless they have explicit dependency relationships.

Interestingly, there are quite a few similarities in how Angular 2 and Vue are addressing these Angular 1 issues.

## Angular 2

We have a separate section for Angular 2 because it really is a completely new framework. For example, it features a first-class component system, many implementation details have been completely rewritten, and the API has also changed quite drastically.

While Angular 1 could be used for smaller applications, Angular 2 has shifted focus to best facilitate large enterprise applications. As part of this, it almost requires TypeScript, which can be very useful for developers that desire the type safety of languages such as Java and C#.

Vue is also well-suited to [enterprise environments](https://github.com/vuejs/awesome-vue#enterprise-usage) and can even be used [with TypeScript](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/vue), though it's definitely optional in our case.

It can be difficult to make many more comparisons as of writing though, as Angular 2 has yet to be released and still has over 1,000 open issues on GitHub. However, while performance characteristics and implementation details are still likely to change, the API is stable at this point, so we can safely compare the flexibility and learning curve of the two libraries - two areas where they differ significantly.

### Flexibility

Vue is much less opinionated than Angular 2, offering official support for a variety of build systems, with no restrictions on how you structure your application. Many developers enjoy this freedom, while some prefer having only one Right Way to build any application.

### Learning Curve

To get started with Vue, all you need is familiarity with HTML and ES5 JavaScript (i.e. plain JavaScript). With these basic skills, you can start building non-trivial applications within less than a day of reading [the guide](/guide).

Angular 2's learning curve is much steeper. Even without TypeScript, their [Quickstart guide](https://angular.io/docs/js/latest/quickstart.html) starts out with an app that uses ES2015 JavaScript, NPM with 18 dependencies, 4 files, and over 3,000 words to explain it all - just to say Hello World. It's an understatement to say that [Vue's Hello World](index.html#Hello-World) is considerably simpler. It's so trivial in fact, that we don't even dedicate a whole page in the guide to it.

## Ember

Ember is a full-featured framework that is designed to be highly opinionated. It provides a lot of established conventions and once you are familiar enough with them, it can make you very productive. However, it also means the learning curve is high and flexibility suffers. It's a trade-off when you try to pick between an opinionated framework and a library with a loosely coupled set of tools that work together. The latter gives you more freedom but also requires you to make more architectural decisions.

That said, it would probably make a better comparison between Vue core and Ember's [templating](https://guides.emberjs.com/v2.7.0/templates/handlebars-basics/) and [object model](https://guides.emberjs.com/v2.7.0/object-model/) layers:

- Vue provides unobtrusive reactivity on plain JavaScript objects and fully automatic computed properties. In Ember, you need to wrap everything in Ember Objects and manually declare dependencies for computed properties.

- Vue's template syntax harnesses the full power of JavaScript expressions, while Handlebars' expression and helper syntax is quite limited in comparison.

- Performance-wise, Vue outperforms Ember by a fair margin, even after the latest Glimmer engine update in Ember 2.0. Vue automatically batches updates, while in Ember you need to manually manage run loops in performance-critical situations.

## Knockout

Knockout was a pioneer in the MVVM and dependency tracking spaces and its reactivity system is very similar to Vue's. Its [browser support](http://knockoutjs.com/documentation/browser-support.html) is also very impressive considering everything it does, with support back to IE6! Vue on the other hand only supports IE9+.

Over time though, Knockout development has slowed and it's begun to show its age a little. For example, its component system lacks a full set of lifecycle hooks and although it's a very common use case, the interface for passing children to a component feels a little clunky compared to [Vue's](components.html#Content-Distribution-with-Slots).

There also seem to be philosophical differences in the API design which if you're curious, can be demonstrated by how each handles the creation of a [simple todo list](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). It's definitely somewhat subjective, but many consider Vue's API to be less complex and better structured.

## Polymer

Polymer is yet another Google-sponsored project and in fact was a source of inspiration for Vue as well. Vue's components can be loosely compared to Polymer's custom elements and both provide a very similar development style. The biggest difference is that Polymer is built upon the latest Web Components features and requires non-trivial polyfills to work (with degraded performance) in browsers that don't support those features natively. In contrast, Vue works without any dependencies or polyfills down to IE9.

In Polymer 1.0, the team has also made its data-binding system very limited in order to compensate for the performance. For example, the only expressions supported in Polymer templates are boolean negation and single method calls. Its computed property implementation is also not very flexible.

Finally, when deploying to production, Polymer elements need to be bundled via a Polymer-specific tool called vulcanizer. In comparison, Vue's [single-file components](single-file-components.html) can leverage everything the Webpack/Browserify/SystemJS ecosystems have to offer. This allows you to easily use ES2015+ and any CSS preprocessors you want in your Vue components.

## Riot

Riot 2.0 provides a similar component-based development model (which is called a "tag" in Riot), with a minimal and beautifully designed API. Riot and Vue probably share a lot in design philosophies. However, despite being a bit heavier than Riot, Vue does offer some significant advantages:

- True conditional rendering. Riot renders all if branches and simply shows/hides them.
- A far more powerful router. Riot’s routing API is extremely minimal.
- More mature tooling support. Vue provides official support for [Webpack](https://github.com/vuejs/vue-loader), [Browserify](https://github.com/vuejs/vueify), and [SystemJS](https://github.com/vuejs/systemjs-plugin-vue), while Riot relies on community support for build system integration.
- [Transition effect system](transitions.html). Riot has none.
- Better performance. [Despite advertising](https://github.com/vuejs/vuejs.org/issues/346) use of a virtual DOM, Riot in fact uses dirty checking and thus suffers from the same performance issues as Angular 1.
