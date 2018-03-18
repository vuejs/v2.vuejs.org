---
title: 对比其他框架
type: guide
order: 801
---

这个页面无疑是最难编写的，但我们认为它也是非常重要的。或许你曾遇到了一些问题并且已经用其他的框架解决了。你来这里的目的是看看 Vue 是否有更好的解决方案。这也是我们在此想要回答的。

客观来说，作为核心团队成员，显然我们会更偏爱 Vue，认为对于某些问题来讲用 Vue 解决会更好。如果没有这点信念，我们也就不会整天为此忙活了。但是在此，我们想尽可能地公平和准确地来描述一切。其他的框架也有显著的优点，例如 React 庞大的生态系统，或者像是 Knockout 对浏览器的支持覆盖到了 IE6。我们会尝试着把这些内容全部列出来。

我们也希望得到**你**的帮助，来使文档保持最新状态，因为 JavaScript 的世界进步的太快。如果你注意到一个不准确或似乎不太正确的地方，请[提交问题](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide)让我们知道。

## React

React 和 Vue 有许多相似之处，它们都有：

- 使用 Virtual DOM
- 提供了响应式(reactive)和可组合的视图组件(composable view component)。
- 将注意力集中保持在核心库，同时也关注路由和负责处理全局状态管理的辅助库。

由于有着众多的相似处，我们会用更多的时间在这一块进行比较。这里我们不只保证技术内容的准确性，同时也兼顾了平衡的考量。我们需要指出 React 比 Vue 更好的地方，像是他们的生态系统和丰富的自定义渲染器。

按照这种说法，不可避免的是，对于某些 React 用户来说，这种比较似乎偏向 Vue，因为许多被探讨的主题在某种程度上是主观的。我们认同存在不同技术尝试，而这种比较主要是目的在于概述出「如果你的喜好和我们所提供的潜在相符，Vue 可能是更适合的」的理由。

React 社区为我们准确进行平衡的考量提供了[非常积极地帮助](https://github.com/vuejs/vuejs.org/issues/364)，特别感谢来自 React 团队的 Dan Abramov 。他非常慷慨地花费时间来贡献专业知识，帮助我们完善这篇文档，最后我们对最终结果[都十分满意](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740)。

### 运行时性能

Both React and Vue are exceptionally and similarly fast, so speed is unlikely to be a deciding factor in choosing between them. For specific metrics though, check out this [3rd party benchmark](http://www.stefankrause.net/js-frameworks-benchmark7/table.html), which focuses on raw render/update performance with very simple component trees.

#### 优化效果

In React, when a component's state changes, it triggers the re-render of the entire component sub-tree, starting at that component as root. To avoid unnecessary re-renders of child components, you need to either use `PureComponent` or implement `shouldComponentUpdate` whenever you can. You may also need to use immutable data structures to make your state changes more optimization-friendly. However, in certain cases you may not be able to rely on such optimizations because `PureComponent/shouldComponentUpdate` assumes the entire sub tree's render output is determined by the props of the current component. If that is not the case, then such optimizations may lead to inconsistent DOM state.

In Vue, a component's dependencies are automatically tracked during its render, so the system knows precisely which components actually need to re-render when state changes. Each component can be considered to have `shouldComponentUpdate` automatically implemented for you, without the nested component caveats.

Overall this removes the need for a whole class of performance optimizations from the developer's plate, and allows them to focus more on building the app itself as it scales.

### HTML & CSS

In React, everything is just JavaScript. Not only are HTML structures expressed via JSX, the recent trends also tend to put CSS management inside JavaScript as well. This approach has its own benefits, but also comes with various trade-offs that may not seem worthwhile for every developer.

Vue embraces classic web technologies and builds on top of them. To show you what that means, we'll dive into some examples.

#### JSX vs Templates

在 React 中，所有的组件的渲染功能都依靠 JSX。JSX 是使用 XML 语法编写 Javascript 的一种语法糖。

JSX 的渲染功能有下面这些优势：

- 你可以充分利用完整的编程语言（JavaScript）来构建你的视图。这包括临时变量、流程控制，和直接引用作用域内的 JavaScript 值。

- 工具对 JSX 的支持相比于现有可用的其他 Vue 模板还是比较先进的（比如，linting、类型检查、编辑器的自动完成）。

在 Vue 中，由于有时需要用到这些功能，我们也提供了[渲染功能](render-function.html)并且[支持了 JSX](render-function.html#JSX)。然而，作为默认体验功能，我们提供模板作为一个更简单的选择。任何有效的 HTML 也是一个有效的 Vue 模板，这会具备一些优点：

- For many developers who have been working with HTML, templates feel more natural to read and write. The preference itself can be somewhat subjective, but if it makes the developer more productive then the benefit is objective.

-  HTML-based templates make it much easier to progressively migrate existing applications to take advantage of Vue's reactivity features.

- It also makes it much easier for designers and less experienced developers to parse and contribute to the codebase.

- You can even use pre-processors such as Pug (formerly known as Jade) to author your Vue templates.

Some argue that you'd need to learn an extra DSL (Domain-Specific Language) to be able to write templates - we believe this difference is superficial at best. First, JSX doesn't mean the user doesn't need to learn anything - it's additional syntax on top of plain JavaScript, so it can be easy for someone familiar with JavaScript to learn, but saying it's essentially free is misleading. Similarly, a template is just additional syntax on top of plain HTML and thus has very low learning cost for those who are already familiar with HTML. With the DSL we are also able to help the user get more done with less code (e.g. `v-on` modifiers). The same task can involve a lot more code when using plain JSX or render functions.

On a higher level, we can divide components into two categories: presentational ones and logical ones. We recommend using templates for presentational components and render function / JSX for logical ones. The percentage of these components depends on the type of app you are building, but in general we find presentational ones to be much more common.

#### CSS 的组件作用域

除非你把组件分布在多个文件上（例如 [CSS Modules](https://github.com/gajus/react-css-modules)），要不在 React 中作用域内的 CSS 就会产生警告(e.g. [styled-components](https://github.com/styled-components/styled-components), [glamorous](https://github.com/paypal/glamorous), and [emotion](https://github.com/emotion-js/emotion)). This introduces a new component-oriented styling paradigm that is different from the normal CSS authoring process. Additionally, although there is support for extracting CSS into a single stylesheet at build time, it is still common that a runtime will need to be included in the bundle for styling to work properly. While you gain access to the dynamism of JavaScript while constructing your styles, the tradeoff is often increased bundle size and runtime cost.

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

这个可选 `scoped` 属性会自动添加一个唯一的属性（比如 `data-v-21e5b78`）为组件内 CSS 指定作用域，编译的时候 `.list-container:hover` 会被编译成类似 `.list-container[data-v-21e5b78]:hover`。

Lastly, the styling in Vue's single-file component's is very flexible. Through [vue-loader](https://github.com/vuejs/vue-loader), you can use any preprocessor, post-processor, and even deep integration with [CSS Modules](https://vue-loader.vuejs.org/en/features/css-modules.html) -- all within the `<style>` element.

### 扩展

#### 扩展升级

Vue 和 React 都提供了强大的路由来应对大型应用。React 社区在状态管理方面非常有创新精神（比如 Flux、Redux），而这些状态管理模式甚至 [Redux 本身](https://github.com/egoist/revue)也可以非常容易的集成在 Vue 应用中。实际上，Vue 更进一步地采用了这种模式（[Vuex](https://github.com/vuejs/vuex)），相信更加深入集成 Vue 的状态管理解决方案 Vuex 能为你带来更好的开发体验。

两者另一个重要差异是，Vue 的路由库和状态管理库都是由官方维护支持且与核心库同步更新的。React 则是选择把这些问题交给社区维护，因此创建了一个更分散的生态系统。但相对的，React 的生态系统相比 Vue 更加繁荣。

最后，Vue 提供了 [Vue-cli 脚手架](https://github.com/vuejs/vue-cli)，能让你非常容易地构建项目，包含了 [webpack](https://github.com/vuejs-templates/webpack)、[Browserify](https://github.com/vuejs-templates/browserify)、甚至 [no build system](https://github.com/vuejs-templates/simple)。React 在这方面也提供了 [create-react-app](https://github.com/facebookincubator/create-react-app)，但是现在还存在一些局限性：

- 它不允许在项目生成时进行任何配置，而 Vue 支持 [Yeoman](http://yeoman.io/)-like 定制。
- 它只提供一个构建单页面应用的单一模板，而 Vue 提供了各种用途的模板。
- 它不能用用户自建的模板构建项目，而自建模板对企业环境下预先建立协议是特别有用的。

要注意的是这些限制是故意设计的，这有它的优势。例如，如果你的项目需求非常简单，你就不需要自定义生成过程。你能把它作为一个依赖来更新。如果阅读更多关于[不同的设计理念](https://github.com/facebookincubator/create-react-app#philosophy)。

#### 向下扩展

React 学习曲线陡峭，在你开始学 React 前，你需要知道 JSX 和 ES2015，因为许多示例用的是这些语法。你需要学习构建系统，虽然你在技术上可以用 Babel 来实时编译代码，但是这并不推荐用于生产环境。

就好比 Vue 向上扩展像是 React，Vue 向下扩展后就类似于 jQuery。你只要把如下标签放到页面就可以运行：

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

然后你就可以编写 Vue 代码并应用到生产环境中，你只要用 min 版 Vue 文件替换掉就不用担心其他的性能问题。

由于起步阶段不需学 JSX、ES2015 以及构建系统，所以开发者只需不到一天的时间阅读[指南](./)就可以建立简单的应用程序。

### 原生渲染

React Native 能使你用相同的组件模型编写有本地渲染能力的 APP (iOS 和 Android)。能同时跨多平台开发，对开发者是非常棒的。相应地，Vue 和 Weex 会进行官方合作，[Weex](https://weex.apache.org/) 是阿里巴巴发起的跨平台用户界面开发框架，同时也正在 Apache 基金会进行项目孵化，Weex 允许你使用 Vue 语法开发不仅仅可以运行在浏览器端，还能被用于开发 iOS 和 Android 上的原生应用的组件。

在现在，Weex 还在积极发展，成熟度也不能和 ReactNative 相抗衡。但是，Weex 的发展是由世界上最大的电子商务企业的需求在驱动，Vue 团队也会和 Weex 团队积极合作确保为开发者带来良好的开发体验。

很快 Vue 开发人员将能够通过由[社区驱动的 NativeScript Vue Plugin 插件](https://github.com/rigor789/nativescript-vue)，来使用 [NativeScript](https://www.nativescript.org/)。

### MobX

Mobx 在 React 社区很流行，实际上在 Vue 也采用了几乎相同的反应系统。在有限程度上，React + Mobx 也可以被认为是更繁琐的 Vue，所以如果你习惯组合使用它们，那么选择 Vue 会更合理。

## AngularJS (Angular 1)

Vue 的一些语法和 AngularJS 的很相似（例如 `v-if` vs `ng-if`）。因为 AngularJS 是 Vue 早期开发的灵感来源。然而，AngularJS 中存在的许多问题，在 Vue 中已经得到解决。

### 复杂性

在 API 与设计两方面上 Vue.js 都比 AngularJS 1 简单得多，因此你可以快速地掌握它的全部特性并投入开发。

### 灵活性和模块化

AngularJS has strong opinions about how your applications should be structured, while Vue is a more flexible, modular solution. While this makes Vue more adaptable to a wide variety of projects, we also recognize that sometimes it's useful to have some decisions made for you, so that you can just start coding.

这也就是为什么我们提供 [webpack template](https://github.com/vuejs-templates/webpack)，让你可以用几分钟，去选择是否启用高级特性，比如热模块加载、linting、CSS 提取等等。

### 数据绑定

AngularJS 使用双向绑定，Vue 在不同组件间强制使用单向数据流。这使应用中的数据流更加清晰易懂。

### 指令与组件

在 Vue 中指令和组件分得更清晰。指令只封装 DOM 操作，而组件代表一个自给自足的独立单元 — 有自己的视图和数据逻辑。在 AngularJS 中，每件事都由指令来做，而组件只是一种特殊的指令。

### 运行时性能

Vue 有更好的性能，并且非常非常容易优化，因为它不使用脏检查。在 AngularJS 中，当 watchers 越来越多时会变得越来越慢，因为作用域内的每一次变化，所有 watchers 都要重新计算。并且，如果一些 watchers 触发另一个更新，脏检查循环（digest cycle）可能要运行多次。Angular 用户常常要使用深奥的技术，以解决脏检查循环的问题。有时没有办法来优化有大量 watchers 的作用域。

Vue 则根本没有这个问题，因为它使用基于依赖追踪的观察系统并且异步队列更新，所有的数据变化都是独立触发，除非它们之间有明确的依赖关系。

有意思的是，AngularJS 2 和 Vue 用相似的设计解决了一些 AngularJS 1 中存在的问题。

## Angular (Formerly known as Angular 2)

We have a separate section for the new Angular because it really is a completely different framework from AngularJS. 例如：它具有优秀的组件系统，并且许多实现已经完全重写，API 也完全改变了。

### TypeScript

Angular essentially requires using TypeScript, given that almost all its documentation and learning resources are TypeScript-based. TypeScript has its benefits - static type checking can be very useful for large-scale applications, and can be a big productivity boost for developers with backgrounds in Java and C#.

However, not everyone wants to use TypeScript. In many smaller-scale use cases, introducing a type system may result in more overhead than productivity gain. In those cases you'd be better off going with Vue instead, since using Angular without TypeScript can be challenging.

Finally, although not as deeply integrated with TypeScript as Angular is, Vue also offers [official typings](https://github.com/vuejs/vue/tree/dev/types) and [official decorator](https://github.com/vuejs/vue-class-component) for those who wish to use TypeScript with Vue. We are also actively collaborating with the TypeScript and VSCode teams at Microsoft to improve the TS/IDE experience for Vue + TS users.

### 运行时性能

Both frameworks are exceptionally fast, with very similar metrics on benchmarks. You can [browse specific metrics](http://www.stefankrause.net/js-frameworks-benchmark7/table.html) for a more granular comparison, but speed is unlikely to be a deciding factor.

### Size

Recent versions of Angular, with [AOT compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) and [tree-shaking](https://en.wikipedia.org/wiki/Tree_shaking), have been able to get its size down considerably. However, a full-featured Vue 2 project with Vuex + Vue Router included (~30KB gzipped) is still significantly lighter than an out-of-the-box, AOT-compiled application generated by `angular-cli` (~130KB gzipped).

### 灵活性

Vue 相比于 Angular 则更加灵活，Vue 官方提供了构建工具来协助你构建项目，但它并不限制你去如何构建。有人可能喜欢用统一的方式来构建，也有很多开发者喜欢这种灵活自由的方式。

### 学习曲线

开始使用 Vue，你使用的是熟悉的 HTML、符合 ES5 规则的 JavaScript（也就是纯 JavaScript）。有了这些基本的技能，你可以快速地掌握它（[指南](./)）并投入开发 。

Angular's learning curve is much steeper. The API surface of the framework is huge and as a user you will need to familiarize yourself with a lot more concepts before getting productive. The complexity of Angular is largely due to its design goal of targeting only large, complex applications - but that does make the framework a lot more difficult for less-experienced developers to pick up.

## Ember

Ember 是一个全能框架。它提供了大量的约定，一旦你熟悉了它们，开发会变得很高效。不过，这也意味着学习曲线较高，而且并不灵活。这就类似于在框架和库（加上一系列松散耦合的工具）之间做权衡选择。后者会更自由，但是也要求你做更多架构上的决定。

也就是说，我们最好比较的是 Vue 内核和 Ember 的[模板](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/)与[数据模型](https://guides.emberjs.com/v2.10.0/object-model/)层：

* Vue 在普通 JavaScript 对象上建立响应，提供自动化的计算属性。在 Ember 中需要将所有东西放在 Ember 对象内，并且手工为计算属性声明依赖。

* Vue 的模板语法可以用全功能的 JavaScript 表达式，而 Handlebars 的语法和帮助函数相比来说非常受限。

* 在性能上，Vue 比 Ember [具有优势](http://www.stefankrause.net/js-frameworks-benchmark7/table.html)，即使是 Ember 2.x 的最新 Glimmer 引擎。Vue 能够自动批量更新，而 Ember 在关键性能场景时需要手动管理。

## Knockout

Knockout 是 MVVM 领域内的先驱，并且追踪依赖。它的响应系统和 Vue 也很相似。它在[浏览器支持](http://knockoutjs.com/documentation/browser-support.html)以及其他方面的表现也是让人印象深刻的。它最低能支持到 IE6，而 Vue 最低只能支持到 IE9。

随着时间的推移，Knockout 的发展已有所放缓，并且略显有点老旧了。比如，它的组件系统缺少完备的生命周期事件方法，尽管这些在现在是非常常见的。以及相比于 [Vue](components.html#Content-Distribution-with-Slots) 调用子组件的接口它的方法显得有点笨重。

如果你有兴趣研究，你还会发现二者在接口设计的理念上是不同的。这可以通过各自创建的 [simple Todo List](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89) 体现出来。或许有点主观，但是很多人认为 Vue 的 API 接口更简单结构更优雅。

## Polymer

Polymer 是另一个由谷歌赞助的项目，事实上也是 Vue 的一个灵感来源。Vue 的组件可以粗略的类比于 Polymer 的自定义元素，并且两者具有相似的开发风格。最大的不同之处在于，Polymer 是基于最新版的 Web Components 标准之上，并且需要重量级的 polyfills 来帮助工作（性能下降），浏览器本身并不支持这些功能。相比而言，Vue 在支持到 IE9 的情况下并不需要依赖 polyfills 来工作。

在 Polymer 1.0 版本中，为了弥补性能，开发团队限制了数据绑定系统的使用。例如，在 Polymer 中唯一支持的表达式只有布尔值否定和单一的方法调用，它的 computed 方法的实现也并不是很灵活。

Polymer 自定义的元素是在 HTML 文件中创建的，这限制了 JavaScript/CSS（以及被现代浏览器普遍支持的语言特性）的使用。相比之下，Vue 的单文件组件允许你非常容易的使用 ES2015 和你想用的 CSS 预编译处理器。

在部署生产环境时，Polymer 建议使用 HTML Imports 加载所有资源。而这要求服务器和客户端都支持 Http 2.0 协议，并且浏览器实现了此标准。这是否可行就取决于你的目标用户和部署环境了。如果状况不佳，你必须用 Vulcanizer 工具来打包 Polymer 元素。而在这方面，Vue 可以结合异步组件的特性和 webpack 的代码分割特性来实现懒加载（lazy-loaded）。这确保了对旧浏览器的兼容，同时保留了良好的加载速度。

而 Vue 和 Web Component 标准进行深层次的整合也是完全可行的，比如使用 Custom Elements、Shadow DOM 的样式封装。然而在我们做出严肃的实现承诺之前，我们目前仍在等待相关标准成熟，进而再广泛应用于主流的浏览器中。

## Riot

Riot 3.0 提供了一个类似于基于组件的开发模型（在 Riot 中称之为 Tag），它提供了小巧精美的 API。Riot 和 Vue 在设计理念上可能有许多相似处。尽管相比 Riot ，Vue 要显得重一点，Vue 还是有很多显著优势的：

- 更好的性能。Riot 使用了[遍历 DOM 树](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding)而不是 Virtual DOM，但实际上用的还是脏检查机制，因此和 AngularJS 患有相同的性能问题。
- 更多成熟工具的支持。Vue 提供官方的 [webpack](https://github.com/vuejs/vue-loader) 和 [Browserify](https://github.com/vuejs/vueify) 支持，而 Riot 依赖社区支持来构建系统集成。

***

> 原文：http://vuejs.org/guide/comparison.html

***
