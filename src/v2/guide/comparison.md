---
title: Comparison with Other Frameworks
type: guide
order: 801
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

### Runtime Performance

Both React and Vue are exceptionally and similarly fast, so speed is unlikely to be a deciding factor in choosing between them. For specific metrics though, check out this [3rd party benchmark](http://www.stefankrause.net/js-frameworks-benchmark7/table.html), which focuses on raw render/update performance with very simple component trees.

#### Optimization Efforts

In React, when a component's state changes, it triggers the re-render of the entire component sub-tree, starting at that component as root. To avoid unnecessary re-renders of child components, you need to either use `PureComponent` or implement `shouldComponentUpdate` whenever you can. You may also need to use immutable data structures to make your state changes more optimization-friendly. However, in certain cases you may not be able to rely on such optimizations because `PureComponent/shouldComponentUpdate` assumes the entire sub tree's render output is determined by the props of the current component. If that is not the case, then such optimizations may lead to inconsistent DOM state.

In Vue, a component's dependencies are automatically tracked during its render, so the system knows precisely which components actually need to re-render when state changes. Each component can be considered to have `shouldComponentUpdate` automatically implemented for you, without the nested component caveats.

Overall this removes the need for a whole class of performance optimizations from the developer's plate, and allows them to focus more on building the app itself as it scales.

### HTML & CSS

In React, everything is just JavaScript. Not only are HTML structures expressed via JSX, the recent trends also tend to put CSS management inside JavaScript as well. This approach has its own benefits, but also comes with various trade-offs that may not seem worthwhile for every developer.

Vue embraces classic web technologies and builds on top of them. To show you what that means, we'll dive into some examples.

#### JSX vs Templates

In React, all components express their UI within render functions using JSX, a declarative XML-like syntax that works within JavaScript.

Render functions with JSX have a few advantages:

- You can leverage the power of a full programming language (JavaScript) to build your view. This includes temporary variables, flow controls, and directly referencing JavaScript values in scope.

- The tooling support (e.g. linting, type checking, editor autocompletion) for JSX is in some ways more advanced than what's currently available for Vue templates.

In Vue, we also have [render functions](render-function.html) and even [support JSX](render-function.html#JSX), because sometimes you do need that power. However, as the default experience we offer templates as a simpler alternative. Any valid HTML is also a valid Vue template, and this leads to a few advantages of its own:

- For many developers who have been working with HTML, templates feel more natural to read and write. The preference itself can be somewhat subjective, but if it makes the developer more productive then the benefit is objective.

-  HTML-based templates make it much easier to progressively migrate existing applications to take advantage of Vue's reactivity features.

- It also makes it much easier for designers and less experienced developers to parse and contribute to the codebase.

- You can even use pre-processors such as Pug (formerly known as Jade) to author your Vue templates.

Some argue that you'd need to learn an extra DSL (Domain-Specific Language) to be able to write templates - we believe this difference is superficial at best. First, JSX doesn't mean the user doesn't need to learn anything - it's additional syntax on top of plain JavaScript, so it can be easy for someone familiar with JavaScript to learn, but saying it's essentially free is misleading. Similarly, a template is just additional syntax on top of plain HTML and thus has very low learning cost for those who are already familiar with HTML. With the DSL we are also able to help the user get more done with less code (e.g. `v-on` modifiers). The same task can involve a lot more code when using plain JSX or render functions.

On a higher level, we can divide components into two categories: presentational ones and logical ones. We recommend using templates for presentational components and render function / JSX for logical ones. The percentage of these components depends on the type of app you are building, but in general we find presentational ones to be much more common.

#### Component-Scoped CSS

Unless you spread components out over multiple files (for example with [CSS Modules](https://github.com/gajus/react-css-modules)), scoping CSS in React is often done via CSS-in-JS solutions (e.g. [styled-components](https://github.com/styled-components/styled-components), [glamorous](https://github.com/paypal/glamorous), and [emotion](https://github.com/emotion-js/emotion)). This introduces a new component-oriented styling paradigm that is different from the normal CSS authoring process. Additionally, although there is support for extracting CSS into a single stylesheet at build time, it is still common that a runtime will need to be included in the bundle for styling to work properly. While you gain access to the dynamism of JavaScript while constructing your styles, the tradeoff is often increased bundle size and runtime cost.

If you are a fan of CSS-in-JS, many of the popular CSS-in-JS libraries support Vue (e.g. [styled-components-vue](https://github.com/styled-components/vue-styled-components) and [vue-emotion](https://github.com/egoist/vue-emotion)). The main difference between React and Vue here is that the default method of styling in Vue is through more familiar `style` tags in [single-file components](single-file-components.html).

[Single-file components](single-file-components.html) give you full access to CSS in the same file as the rest of your component code.

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

Lastly, the styling in Vue's single-file component's is very flexible. Through [vue-loader](https://github.com/vuejs/vue-loader), you can use any preprocessor, post-processor, and even deep integration with [CSS Modules](https://vue-loader.vuejs.org/en/features/css-modules.html) -- all within the `<style>` element.

### Scale

#### Scaling Up

For large applications, both Vue and React offer robust routing solutions. The React community has also been very innovative in terms of state management solutions (e.g. Flux/Redux). These state management patterns and [even Redux itself](https://github.com/egoist/revue) can be easily integrated into Vue applications. In fact, Vue has even taken this model a step further with [Vuex](https://github.com/vuejs/vuex), an Elm-inspired state management solution that integrates deeply into Vue that we think offers a superior development experience.

Another important difference between these offerings is that Vue's companion libraries for state management and routing (among [other concerns](https://github.com/vuejs)) are all officially supported and kept up-to-date with the core library. React instead chooses to leave these concerns to the community, creating a more fragmented ecosystem. Being more popular though, React's ecosystem is considerably richer than Vue's.

Finally, Vue offers a [CLI project generator](https://github.com/vuejs/vue-cli) that makes it trivially easy to start a new project using your choice of build system, including [webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), or even [no build system](https://github.com/vuejs-templates/simple). React is also making strides in this area with [create-react-app](https://github.com/facebookincubator/create-react-app), but it currently has a few limitations:

- It does not allow any configuration during project generation, while Vue's project templates allow [Yeoman](http://yeoman.io/)-like customization.
- It only offers a single template that assumes you're building a single-page application, while Vue offers a wide variety of templates for various purposes and build systems.
- It cannot generate projects from user-built templates, which can be especially useful for enterprise environments with pre-established conventions.

It's important to note that many of these limitations are intentional design decisions made by the create-react-app team and they do have their advantages. For example, as long as your project's needs are very simple and you never need to "eject" to customize your build process, you'll be able to update it as a dependency. You can read more about the [differing philosophy here](https://github.com/facebookincubator/create-react-app#philosophy).

#### Scaling Down

React is renowned for its steep learning curve. Before you can really get started, you need to know about JSX and probably ES2015+, since many examples use React's class syntax. You also have to learn about build systems, because although you could technically use Babel Standalone to live-compile your code in the browser, it's absolutely not suitable for production.

While Vue scales up just as well as, if not better than React, it also scales down just as well as jQuery. That's right - all you have to do is drop a single script tag into a page:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Then you can start writing Vue code and even ship the minified version to production without feeling guilty or having to worry about performance problems.

Since you don't need to know about JSX, ES2015, or build systems to get started with Vue, it also typically takes developers less than a day reading [the guide](./) to learn enough to build non-trivial applications.

### Native Rendering

React Native enables you to write native-rendered apps for iOS and Android using the same React component model. This is great in that as a developer, you can apply your knowledge of a framework across multiple platforms. On this front, Vue has an official collaboration with [Weex](https://weex.apache.org/), a cross-platform UI framework created by Alibaba Group and being incubated by the Apache Software Foundation (ASF). Weex allows you to use the same Vue component syntax to author components that can not only be rendered in the browser, but also natively on iOS and Android!

At this moment, Weex is still in active development and is not as mature and battle-tested as React Native, but its development is driven by the production needs of the largest e-commerce business in the world, and the Vue team will also actively collaborate with the Weex team to ensure a smooth experience for Vue developers.

Another option Vue developers will soon have is [NativeScript](https://www.nativescript.org/), via a [community-driven plugin](https://github.com/rigor789/nativescript-vue).

### With MobX

MobX has become quite popular in the React community and it actually uses a nearly identical reactivity system to Vue. To a limited extent, the React + MobX workflow can be thought of as a more verbose Vue, so if you're using that combination and are enjoying it, jumping into Vue is probably the next logical step.

## AngularJS (Angular 1)

Some of Vue's syntax will look very similar to AngularJS (e.g. `v-if` vs `ng-if`). This is because there were a lot of things that AngularJS got right and these were an inspiration for Vue very early in its development. There are also many pains that come with AngularJS however, where Vue has attempted to offer a significant improvement.

### Complexity

Vue is much simpler than AngularJS, both in terms of API and design. Learning enough to build non-trivial applications typically takes less than a day, which is not true for AngularJS.

### Flexibility and Modularity

AngularJS has strong opinions about how your applications should be structured, while Vue is a more flexible, modular solution. While this makes Vue more adaptable to a wide variety of projects, we also recognize that sometimes it's useful to have some decisions made for you, so that you can just start coding.

That's why we offer a [webpack template](https://github.com/vuejs-templates/webpack) that can set you up within minutes, while also granting you access to advanced features such as hot module reloading, linting, CSS extraction, and much more.

### Data binding

AngularJS uses two-way binding between scopes, while Vue enforces a one-way data flow between components. This makes the flow of data easier to reason about in non-trivial applications.

### Directives vs Components

Vue has a clearer separation between directives and components. Directives are meant to encapsulate DOM manipulations only, while components are self-contained units that have their own view and data logic. In AngularJS, there's a lot of confusion between the two.

### Runtime Performance

Vue has better performance and is much, much easier to optimize because it doesn't use dirty checking. AngularJS becomes slow when there are a lot of watchers, because every time anything in the scope changes, all these watchers need to be re-evaluated again. Also, the digest cycle may have to run multiple times to "stabilize" if some watcher triggers another update. AngularJS users often have to resort to esoteric techniques to get around the digest cycle, and in some situations, there's no way to optimize a scope with many watchers.

Vue doesn't suffer from this at all because it uses a transparent dependency-tracking observation system with async queueing - all changes trigger independently unless they have explicit dependency relationships.

Interestingly, there are quite a few similarities in how Angular and Vue are addressing these AngularJS issues.

## Angular (Formerly known as Angular 2)

We have a separate section for the new Angular because it really is a completely different framework from AngularJS. For example, it features a first-class component system, many implementation details have been completely rewritten, and the API has also changed quite drastically.

### TypeScript

Angular essentially requires using TypeScript, given that almost all its documentation and learning resources are TypeScript-based. TypeScript has its benefits - static type checking can be very useful for large-scale applications, and can be a big productivity boost for developers with backgrounds in Java and C#.

However, not everyone wants to use TypeScript. In many smaller-scale use cases, introducing a type system may result in more overhead than productivity gain. In those cases you'd be better off going with Vue instead, since using Angular without TypeScript can be challenging.

Finally, although not as deeply integrated with TypeScript as Angular is, Vue also offers [official typings](https://github.com/vuejs/vue/tree/dev/types) and [official decorator](https://github.com/vuejs/vue-class-component) for those who wish to use TypeScript with Vue. We are also actively collaborating with the TypeScript and VSCode teams at Microsoft to improve the TS/IDE experience for Vue + TS users.

### Runtime Performance

Both frameworks are exceptionally fast, with very similar metrics on benchmarks. You can [browse specific metrics](http://www.stefankrause.net/js-frameworks-benchmark7/table.html) for a more granular comparison, but speed is unlikely to be a deciding factor.

### Size

Recent versions of Angular, with [AOT compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) and [tree-shaking](https://en.wikipedia.org/wiki/Tree_shaking), have been able to get its size down considerably. However, a full-featured Vue 2 project with Vuex + Vue Router included (~30KB gzipped) is still significantly lighter than an out-of-the-box, AOT-compiled application generated by `angular-cli` (~130KB gzipped).

### Flexibility

Vue is much less opinionated than Angular, offering official support for a variety of build systems, with no restrictions on how you structure your application. Many developers enjoy this freedom, while some prefer having only one Right Way to build any application.

### Learning Curve

To get started with Vue, all you need is familiarity with HTML and ES5 JavaScript (i.e. plain JavaScript). With these basic skills, you can start building non-trivial applications within less than a day of reading [the guide](./).

Angular's learning curve is much steeper. The API surface of the framework is huge and as a user you will need to familiarize yourself with a lot more concepts before getting productive. The complexity of Angular is largely due to its design goal of targeting only large, complex applications - but that does make the framework a lot more difficult for less-experienced developers to pick up.

## Ember

Ember is a full-featured framework that is designed to be highly opinionated. It provides a lot of established conventions and once you are familiar enough with them, it can make you very productive. However, it also means the learning curve is high and flexibility suffers. It's a trade-off when you try to pick between an opinionated framework and a library with a loosely coupled set of tools that work together. The latter gives you more freedom but also requires you to make more architectural decisions.

That said, it would probably make a better comparison between Vue core and Ember's [templating](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/) and [object model](https://guides.emberjs.com/v2.10.0/object-model/) layers:

- Vue provides unobtrusive reactivity on plain JavaScript objects and fully automatic computed properties. In Ember, you need to wrap everything in Ember Objects and manually declare dependencies for computed properties.

- Vue's template syntax harnesses the full power of JavaScript expressions, while Handlebars' expression and helper syntax is intentionally quite limited in comparison.

- Performance-wise, Vue outperforms Ember [by a fair margin](http://www.stefankrause.net/js-frameworks-benchmark7/table.html), even after the latest Glimmer engine update in Ember 2.x. Vue automatically batches updates, while in Ember you need to manually manage run loops in performance-critical situations.

## Knockout

Knockout was a pioneer in the MVVM and dependency tracking spaces and its reactivity system is very similar to Vue's. Its [browser support](http://knockoutjs.com/documentation/browser-support.html) is also very impressive considering everything it does, with support back to IE6! Vue on the other hand only supports IE9+.

Over time though, Knockout development has slowed and it's begun to show its age a little. For example, its component system lacks a full set of lifecycle hooks and although it's a very common use case, the interface for passing children to a component feels a little clunky compared to [Vue's](components.html#Content-Distribution-with-Slots).

There also seem to be philosophical differences in the API design which if you're curious, can be demonstrated by how each handles the creation of a [simple todo list](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). It's definitely somewhat subjective, but many consider Vue's API to be less complex and better structured.

## Polymer

Polymer is yet another Google-sponsored project and in fact was a source of inspiration for Vue as well. Vue's components can be loosely compared to Polymer's custom elements and both provide a very similar development style. The biggest difference is that Polymer is built upon the latest Web Components features and requires non-trivial polyfills to work (with degraded performance) in browsers that don't support those features natively. In contrast, Vue works without any dependencies or polyfills down to IE9.

In Polymer 1.0, the team has also made its data-binding system very limited in order to compensate for the performance. For example, the only expressions supported in Polymer templates are boolean negation and single method calls. Its computed property implementation is also not very flexible.

Polymer custom elements are authored in HTML files, which limits you to plain JavaScript/CSS (and language features supported by today's browsers). In comparison, Vue's single file components allows you to easily use ES2015+ and any CSS preprocessors you want.

When deploying to production, Polymer recommends loading everything on-the-fly with HTML Imports, which assumes browsers implementing the spec, and HTTP/2 support on both server and client. This may or may not be feasible depending on your target audience and deployment environment. In cases where this is not desirable, you will have to use a special tool called Vulcanizer to bundle your Polymer elements. On this front, Vue can combine its async component feature with webpack's code-splitting feature to easily split out parts of the application bundle to be lazy-loaded. This ensures compatibility with older browsers while retaining great app loading performance.

It is also totally feasible to offer deeper integration between Vue with Web Component specs such as Custom Elements and Shadow DOM style encapsulation - however at this moment we are still waiting for the specs to mature and be widely implemented in all mainstream browsers before making any serious commitments.

## Riot

Riot 3.0 provides a similar component-based development model (which is called a "tag" in Riot), with a minimal and beautifully designed API. Riot and Vue probably share a lot in design philosophies. However, despite being a bit heavier than Riot, Vue does offer some significant advantages:

- Better performance. Riot [traverses a DOM tree](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding) rather than using a virtual DOM, so suffers from the same performance issues as AngularJS.
- More mature tooling support. Vue provides official support for [webpack](https://github.com/vuejs/vue-loader) and [Browserify](https://github.com/vuejs/vueify), while Riot relies on community support for build system integration.
