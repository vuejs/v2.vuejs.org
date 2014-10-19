title: Common FAQs
type: guide
order: 15
---

- **Why doesn't Vue.js support IE8?**

  Vue.js is able to deliver the plain JavaScript object syntax without resorting to dirty checking by using `Object.defineProperty`, which is an ECMAScript 5 feature. It only works on DOM elements in IE8 and there's no way to polyfill it for JavaScript objects.

- **So Vue.js modifies my data?**

  Yes and No. Vue.js only converts normal properties into getters and setters so it can get notified when the properties are accessed or changed. When serialized, your data will look exactly the same. There are, of course, some caveats:

  1. When you `console.log` observed objects you will only see a bunch of getter/setters. However you can use `vm.$log()` to log a more inspectable output.

  2. You cannot define your own getter/setters on data objects. This isn't much of a problem because data objects are expected to be obtained from plain JSON and Vue.js provides computed properties.

  3. Vue.js adds a few extra properties/methods to obsesrved objects: `__ob__`, `$add` and `$delete`. These properties are inenumberable so they will not show up in `for ... in ...` loops. However if you overwrite them things will likely break.

  That's pretty much it. Accessing properties on the object is the same as before, `JSON.stringify` and `for ... in ...` loops will work as normal. 99.9% of the time you don't even need to think about it.

- **What is the current status of Vue.js? Can I use it in production?**

  Vue.js has undergone some major rewrite for the 0.11 update, and we are now working towards the 1.0 release. Vue.js is already being used in production at companies like Optimizely.

- **Is Vue.js free to use?**

  Vue.js is a personal project and fully open sourced under the MIT License.

- **What is the difference between Vue.js and AngularJS?**

  There are a few reasons to use Vue over Angular, although they might not apply for everyone:

  1. Vue.js is a more flexible, less opinionated solution. That allows you to structure your app the way you want it to be, instead of being forced to do everything the Angular way. It's only an interface layer so you can use it as a light feature in pages instead of a full blown SPA. It gives you bigger room to mix and match with other libraries. This is probably the most important distinction.

  2. Vue.js is much simpler than Angular in general, so you can learn almost everything about it really fast and get productive.

  3. Vue.js has better performance because it doesn't use dirty checking. Angular gets slow when there are a lot of watchers, because every time anything in the scope changes, all these watchers need to be re-evaluated again. Vue.js doesn't suffer from this because it uses an event based observing mechanism, so all changes trigger independently unless they have explicit dependency relationships.

  4. Vue.js has a clearer separation between directives and components. Directives are meant to encapsulate DOM manipulations only, while Components stand for a self-contained unit that has its own view and data logic. In Angular there's a lot of confusion between the two.

  But also note:

  1. Vue.js is a relatively young project and is not fully stable yet, while Angular is battle-proven and has a larger community. So if you want something for a large, serious production app you might want to pick Angular.

  2. Vue.js only supports IE9 and above while Angular supports IE8. (Angular 2.0 is dropping IE8 as well)

- **What makes Vue.js different from KnockoutJS?**

  First, Vue provides a cleaner syntax in getting and setting VM properties.

  On a higher level, Vue differs from Knockout in that Vue's component system encourages you to take a top-down, structure first, declarative design strategy, instead of imperatively build up ViewModels from bottom up. In Vue the source data are plain, logic-less objects (ones that you can directly JSON.stringify and throw into a post request), and the ViewModel simply proxies access to that data on itself. A Vue VM instance always connects raw data to a corresponding DOM element. In Knockout, the ViewModel essentially **is** the data and the line between Model and ViewModel is pretty blurry. This lack of differentiation makes Knockout more flexible, but also much more likely to result in convoluted ViewModels.

- **What makes Vue.js different from React.js?**

  React.js and Vue.js do have some similarity in that they both provide reactive & composable View components. However the internal implementation is fundamentally different. React is built upon a virtual DOM - an in-memory representation of what the actual DOM should look like. Data in React is largely immutable and DOM manipulations are calculated via diffing. On the contrary data in Vue.js is mutable and stateful by default, and changes are triggered through events. Instead of a virtual DOM, Vue.js uses the actual DOM as the template and keeps references to actual nodes for data bindings.

  The virtual-DOM approach provides a functional way to describe your view at any point of time, which is really nice. Because it doesn't use observables and re-renders the entire app on every update, the view is by definition guaranteed to be in sync with the data. It also opens up possiblities to isomorphic JavaScript applications.

  Overall I'm a big fan of React's design philosophy myself. But one issue with React is that your logic and your view are tightly knit together. For some developers this is a bonus, but for designer/developer hybrids like me, having a template makes it much easier to think visually about the design and CSS. JSX mixed with JavaScript logic breaks that visual model I need to map the code to the design. In contrast, Vue.js pays the cost of a lightweight DSL (directives) so that we have a visually scannable template and with logic encapsulated into directives and filters.

  Another issue with React is that because DOM updates are completely delegated to the Virtual DOM, it's a bit tricky when you actually **want** to control the DOM yourself (although theoretically you can, you'd be essentially working against the library when you do that). For applications that needs complex time-choreographed animations, this can become a pretty annoying restriction. On this front, Vue.js allows for more flexibility and there are [multiple FWA/Awwwards winning sites](https://github.com/yyx990803/vue/wiki/Projects-Using-Vue.js#interactive-experiences) built with Vue.js.

- **I want to help!**

    Great! Read the [contribution guide](https://github.com/yyx990803/vue/blob/master/CONTRIBUTING.md) and join discussions on IRC (#vuejs).