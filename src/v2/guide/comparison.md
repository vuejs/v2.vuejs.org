---
title: Comparison with Other Frameworks
type: guide
order: 28
---

This is definitely the most difficult page in the guide to write, but we do feel it's important. Odds are, you've had problems you tried to solve and you've used another library to solve them. You're here because you want to know if Vue can solve your specific problems better. That's what we hope to answer for you.

We also try very hard to avoid bias. As the core team, we obviously like Vue a lot. There are some problems we think it solves better than anything else out there. If we didn't believe that, we wouldn't be working on it. We do want to be fair and accurate though. Where other libraries offer significant advantages, such as React's vast ecosystem of alternative renderers or Knockout's browser support back to IE6, we try to list these as well.

We'd also like **your** help keeping this document up-to-date because the JavaScript world moves fast! If you notice an inaccuracy or something that doesn't seem quite right, please let us know by [opening an issue](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React and Vue share many similarities. They both:

- utilize a virtual DOM
- provide reactive and composable view components
- maintain focus in the core library, with concerns such as routing and global state management handled by companion libraries

Being so similar in scope, we've put more time into fine-tuning this comparison than any other. We want to ensure not only technical accuracy, but also balance. We point out where React outshines Vue, for example in the richness of their ecosystem and abundance of their custom renderers.

With that said, it's inevitable that the comparison would appear biased towards Vue to some React users, as many of the subjects explored are to some extent subjective. We acknowledge the existence of varying technical taste, and this comparison primarily aims to outline the reasons why Vue could potentially be a better fit if your preferences happen to coincide with ours.

The React community [has been instrumental](https://github.com/vuejs/vuejs.org/issues/364) in helping us achieve this balance, with special thanks to Dan Abramov from the React team. He was extremely generous with his time and considerable expertise to help us refine this document until we were [both happy](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740) with the final result.

### Performance Profiles

In every real-world scenario that we've tested so far, Vue outperforms React by a fair margin. If your eyebrows are raising right now, read further. We'll breakdown why (and even include a benchmark developed in collaboration with the React team).

#### Render Performance

When rendering UI, manipulating the DOM is typically the most expensive operation and unfortunately, no library can make those raw operations faster. The best we can do is:

1. Minimize the number of necessary DOM mutations. Both React and Vue use virtual DOM abstractions to accomplish this and both implementations work about equally well.

2. Add as little overhead (pure JavaScript computations) as possible on top of those DOM manipulations. This is an area where Vue and React differ.

The JavaScript overhead is directly related to the mechanisms of computing the necessary DOM operations. Both Vue and React utilizes Virtual DOM to achieve that, but Vue's Virtual DOM implementation (a fork of [snabbdom](https://github.com/snabbdom/snabbdom)) is much lighter-weight and thus introduces less overhead than React's.

Both Vue and React also offer functional components, which are stateless and instanceless - and therefore, require less overhead. When these are used in performance-critical situations, Vue is once again faster. To demonstrate this, we built a simple [benchmark project](https://github.com/chrisvfritz/vue-render-performance-comparisons) that just renders 10,000 list items 100 times. We encourage you to try it yourself, as the results will vary depending on the hardware and browser used - and actually, they'll vary even between runs due to the nature of JavaScript engines.

If you're feeling lazy though, below are the numbers from one run in Chrome 52 on a 2014 MacBook Air. To avoid cherry-picking, both benchmarks were actually run 20 separate times, with results from the best runs included below:

{% raw %}
<table class="benchmark-table">
  <thead>
    <tr>
      <th></th>
      <th>Vue</th>
      <th>React</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Fastest</th>
      <td>23ms</td>
      <td>63ms</td>
    </tr>
    <tr>
      <th>Median</th>
      <td>42ms</td>
      <td>81ms</td>
    </tr>
    <tr>
      <th>Average</th>
      <td>51ms</td>
      <td>94ms</td>
    </tr>
    <tr>
      <th>95th Perc.</th>
      <td>73ms</td>
      <td>164ms</td>
    </tr>
    <tr>
      <th>Slowest</th>
      <td>343ms</td>
      <td>453ms</td>
    </tr>
    </tr>
  </tbody>
</table>
{% endraw %}

#### Update Performance

In React, when a component's state changes, it triggers the re-render of the entire component sub-tree, starting at that component as root. To avoid unnecessary re-renders of child components, you need to implement `shouldComponentUpdate` everywhere and use immutable data structures. In Vue, a component's dependencies are automatically tracked during its render, so the system knows precisely which components actually need to re-render.

This means updates in unoptimized Vue will be much faster than unoptimized React and actually, due to the improved render performance in Vue, even fully-optimized React will usually be slower than Vue is out-of-the-box.

#### In Development

While performance in production is the more important metrics as it is directly associated with end-user experience, performance in development still matters because it is associated with the developer experience.

Both Vue and React remain fast enough in development for most normal applications. However, when prototyping high frame-rate data visualizations or animations, we've seen cases of Vue handling 10 frames per second in development while React dropping to about 1 frame per second.

This is due to React's many heavy invariant checks in development mode, which help it to provide many excellent warnings and error messages. We agree that these are also important in Vue, but have tried to keep a closer eye on performance while we implement these checks.

### HTML & CSS

In React, everything is Just JavaScript, which sounds very simple and elegant - until you dig deeper. The unfortunate reality is that reinventing HTML and CSS within JavaScript, while solving some issues of the traditional model, can also cause pain of its own. In Vue, we instead embrace web technologies and build on top of them. To show you what that means, we'll dive into some examples.

#### JSX vs Templates

In React, all components express their UI within render functions using JSX, a declarative XML-like syntax that works within Javascript. Here's an example, [vetted by the React community](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684):

``` jsx
render () {
  let { items } = this.props

  let children
  if (items.length > 0) {
    children = (
      <ul>
        {items.map(item =>
          <li key={item.id}>{item.name}</li>
        )}
      </ul>
    )
  } else {
    children = <p>No items found.</p>
  }

  return (
    <div className='list-container'>
      {children}
    </div>
  )
}
```

Render functions with JSX have a few advantages:

- You can use the power of a full programming language (JavaScript) to build your view.
- The tooling support (e.g. linting, type checking, editor autocompletion) for JSX is in some ways more advanced than what's currently available for Vue templates.

In Vue, we also have [render functions](render-function.html) and even [support JSX](render-function.html#JSX), because sometimes you need that power. However, as the default experience we offer templates as a simpler alternative:

``` html
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ul>
    <p v-else>No items found.</p>
  </div>
</template>
```

A few advantages here:

- Fewer implementation and stylistic decisions have to be made while writing a template
- A template will always be declarative
- Any valid HTML is valid in a template
- It reads more like English (e.g. for each item in items)
- Advanced versions of JavaScript are not required to increase readability

This is not only much easier for the developer that's writing it, but designers and less experienced developers will also find it much easier parsing and contributing code.

An additional benefit of HTML-compliant templates is that you can use pre-processors such as Pug (formerly known as Jade) to author your Vue templates:

``` pug
div.list-container
  ul(v-if="items.length")
    li(v-for="item in items") {{ item.name }}
  p(v-else) No items found.
```

#### Component-Scoped CSS

Unless you spread components out over multiple files (for example with [CSS Modules](https://github.com/gajus/react-css-modules)), scoping CSS in React is often done via CSS-in-JS solutions. There are many competing solutions out there, each with its own caveats. A common issue is that features such as hover states, media queries, and pseudo-selectors either require heavy dependencies to reinvent what CSS already does - or they simply are not supported. If not optimized carefully, CSS-in-JS can also introduce non-trivial runtime performance cost. Most importantly, it deviates from the experience of authoring normal CSS.

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

The optional `scoped` attribute automatically scopes this CSS to your component by adding a unique attribute (such as `data-v-21e5b78`) to elements and compiling `.list-container:hover` to something like `.list-container[data-v-21e5b78]:hover`.

Finally, just as with HTML, you also have the option of writing your CSS using any preprocessors (or post-processors) you'd like, allowing you to leverage existing libraries in those ecosystems. You can also perform design-centric operations such as color manipulation during your build process, rather than importing specialized JavaScript libraries that would increase the size of your build and complexity of your application.

### Scale

#### Scaling Up

For large applications, both Vue and React offer robust routing solutions. The React community has also been very innovative in terms of state management solutions (e.g. Flux/Redux). These state management patterns and [even Redux itself](https://github.com/egoist/revue) can be easily integrated into Vue applications. In fact, Vue has even taken this model a step further with [Vuex](https://github.com/vuejs/vuex), an Elm-inspired state management solution that integrates deeply into Vue that we think offers a superior development experience.

Another important difference between these offerings is that Vue's companion libraries for state management and routing (among [other concerns](https://github.com/vuejs)) are all officially supported and kept up-to-date with the core library. React instead chooses to leave these concerns to the community, creating a more fragmented ecosystem. Being more popular though, React's ecosystem is considerably richer than Vue's.

Finally, Vue offers a [CLI project generator](https://github.com/vuejs/vue-cli) that makes it trivially easy to start a new project using your choice of build system, including [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), or even [no build system](https://github.com/vuejs-templates/simple). React is also making strides in this area with [create-react-app](https://github.com/facebookincubator/create-react-app), but it currently has a few limitations:

- It does not allow any configuration during project generation, while Vue's project templates allow Yeoman-like customization.
- It only offers a single template that assumes you're building a single-page application, while Vue offers a wide variety of templates for various purposes and build systems.
- It cannot generate projects from user-built templates, which can be especially useful for enterprise environments with pre-established conventions.

It's important to note though that many of these limitations are intentional design decisions made by the create-react-app team and they do have their advantages. For example, as long your project's needs are very simple and you never need to "eject" to customize your build process, you'll be able to update it as a dependency. You can read more about the [differing philosophy here](https://github.com/facebookincubator/create-react-app#philosophy).

#### Scaling Down

React is renowned for its steep learning curve. Before you can really get started, you need to know about JSX and probably ES2015+, since many examples use React's class syntax. You also have to learn about build systems, because although you could technically use Babel Standalone to live-compile your code in the browser, it's absolutely not suitable for production.

While Vue scales up just as well as, if not better than React, it also scales down just as well as jQuery. That's right - all you have to do is drop a single script tag into a page:

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

Then you can start writing Vue code and even ship the minified version to production without feeling guilty or having to worry about performance problems.

Since you don't need to know about JSX, ES2015, or build systems to get started with Vue, it also typically takes developers less than a day reading [the guide](./) to learn enough to build non-trivial applications.

### Native Rendering

ReactNative enables you to write native-rendered apps for iOS and Android using the same React component model. This is great in that as a developer, you can apply your knowledge of a framework across multiple platforms. On this front, Vue has an official collaboration with [Weex](https://alibaba.github.io/weex/), a cross-platform UI framework developed by Alibaba Group, which uses Vue as its JavaScript framework runtime. This means with Weex, you can use the same Vue component syntax to author components that can not only be rendered in the Browser, but also natively on iOS and Android!

At this moment, Weex is still in active development and is not as mature and battle-tested as ReactNative, but its development is driven by the production needs of the largest e-commerce business in the world, and the Vue team will also actively collaborate with the Weex team to ensure a smooth experience for Vue developers.

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

### TypeScript

While Angular 1 could be used for smaller applications, Angular 2 has shifted focus to best facilitate large enterprise applications. As part of this, it almost requires TypeScript, which can be very useful for developers that desire the type safety of languages such as Java and C#.

Vue is also well-suited to [enterprise environments](https://github.com/vuejs/awesome-vue#enterprise-usage) and can even be used with TypeScript via our [official typings](https://github.com/vuejs/vue/tree/dev/types) and [user-contributed decorators](https://github.com/itsFrank/vue-typescript), though it's definitely optional in our case.

### Size and Performance

In terms of performance, both frameworks are exceptionally fast and there isn't enough data from real world use cases to make a verdict. However if you are determined to see some numbers, Vue 2.0 seems to be ahead of Angular 2 according to this [3rd party benchmark](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

Size wise, although Angular 2 with offline compilation and tree-shaking is able to get its size down considerably, a full-featured Vue 2.0 with compiler included (23kb) is still lighter than a tree-shaken bare-bone example of Angular 2 (50kb). And do note the Angular 2 app's size is small due to tree-shaking, which removes code for features that you are not using. It will eventually grow back to its actual size as you import and use more features from the framework.

### Flexibility

Vue is much less opinionated than Angular 2, offering official support for a variety of build systems, with no restrictions on how you structure your application. Many developers enjoy this freedom, while some prefer having only one Right Way to build any application.

### Learning Curve

To get started with Vue, all you need is familiarity with HTML and ES5 JavaScript (i.e. plain JavaScript). With these basic skills, you can start building non-trivial applications within less than a day of reading [the guide](./).

Angular 2's learning curve is much steeper. Even without TypeScript, their [Quickstart guide](https://angular.io/docs/js/latest/quickstart.html) starts out with an app that uses ES2015 JavaScript, NPM with 18 dependencies, 4 files, and over 3,000 words to explain it all - just to say Hello World. It's an understatement to say that [Vue's Hello World](https://jsfiddle.net/chrisvfritz/50wL7mdz/) is considerably simpler. It's so trivial in fact, that we don't even dedicate a whole page in the guide to it.

## Ember

Ember is a full-featured framework that is designed to be highly opinionated. It provides a lot of established conventions and once you are familiar enough with them, it can make you very productive. However, it also means the learning curve is high and flexibility suffers. It's a trade-off when you try to pick between an opinionated framework and a library with a loosely coupled set of tools that work together. The latter gives you more freedom but also requires you to make more architectural decisions.

That said, it would probably make a better comparison between Vue core and Ember's [templating](https://guides.emberjs.com/v2.7.0/templates/handlebars-basics/) and [object model](https://guides.emberjs.com/v2.7.0/object-model/) layers:

- Vue provides unobtrusive reactivity on plain JavaScript objects and fully automatic computed properties. In Ember, you need to wrap everything in Ember Objects and manually declare dependencies for computed properties.

- Vue's template syntax harnesses the full power of JavaScript expressions, while Handlebars' expression and helper syntax is intentionally quite limited in comparison.

- Performance-wise, Vue outperforms Ember by a fair margin, even after the latest Glimmer engine update in Ember 2.0. Vue automatically batches updates, while in Ember you need to manually manage run loops in performance-critical situations.

## Knockout

Knockout was a pioneer in the MVVM and dependency tracking spaces and its reactivity system is very similar to Vue's. Its [browser support](http://knockoutjs.com/documentation/browser-support.html) is also very impressive considering everything it does, with support back to IE6! Vue on the other hand only supports IE9+.

Over time though, Knockout development has slowed and it's begun to show its age a little. For example, its component system lacks a full set of lifecycle hooks and although it's a very common use case, the interface for passing children to a component feels a little clunky compared to [Vue's](components.html#Content-Distribution-with-Slots).

There also seem to be philosophical differences in the API design which if you're curious, can be demonstrated by how each handles the creation of a [simple todo list](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). It's definitely somewhat subjective, but many consider Vue's API to be less complex and better structured.

## Polymer

Polymer is yet another Google-sponsored project and in fact was a source of inspiration for Vue as well. Vue's components can be loosely compared to Polymer's custom elements and both provide a very similar development style. The biggest difference is that Polymer is built upon the latest Web Components features and requires non-trivial polyfills to work (with degraded performance) in browsers that don't support those features natively. In contrast, Vue works without any dependencies or polyfills down to IE9.

In Polymer 1.0, the team has also made its data-binding system very limited in order to compensate for the performance. For example, the only expressions supported in Polymer templates are boolean negation and single method calls. Its computed property implementation is also not very flexible.

Polymer custom elements are authored in HTML files, which limits you to plain JavaScript/CSS (and language features supported by today's browsers). In comparison, Vue's single file components allows you to easily use ES2015+ and any CSS preprocessors you want.

When deploying to production, Polymer recommends loading everything on-the-fly with HTML Imports, which assumes browsers implementing the spec, and HTTP/2 support on both server and client. This may or may not be feasible depending on your target audience and deployment environment. In cases where this is not desirable, you will have to use a special tool called Vulcanizer to bundle your Polymer elements. On this front, Vue can combine its async component feature with Webpack's code-splitting feature to easily split out parts of the application bundle to be lazy-loaded. This ensures compatibility with older browsers while retaining great app loading performance.

It is also totally feasible to offer deeper integration between Vue with Web Component specs such as Custom Elements and Shadow DOM style encapsulation - however at this moment we are still waiting for the specs to mature and be widely implemented in all mainstream browsers before making any serious commitments.

## Riot

Riot 2.0 provides a similar component-based development model (which is called a "tag" in Riot), with a minimal and beautifully designed API. Riot and Vue probably share a lot in design philosophies. However, despite being a bit heavier than Riot, Vue does offer some significant advantages:

- True conditional rendering. Riot renders all if branches and simply shows/hides them.
- A far more powerful router. Riot’s routing API is extremely minimal.
- More mature tooling support. Vue provides official support for [Webpack](https://github.com/vuejs/vue-loader) and [Browserify](https://github.com/vuejs/vueify), while Riot relies on community support for build system integration.
- [Transition effect system](transitions.html). Riot has none.
- Better performance. [Despite advertising](https://github.com/vuejs/vuejs.org/issues/346) use of a virtual DOM, Riot in fact uses dirty checking and thus suffers from the same performance issues as Angular 1.
