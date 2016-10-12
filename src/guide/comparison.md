---
title: 对比其他框架
type: guide
order: 26
---
这个页面无疑是最难编写的，但我们认为它也是非常重要的。或许你曾遇到了一些问题并且已经用其他的框架解决了。你来这里的目的是看看 Vue 是否有更好的解决方案。这也是我们在此想要回答的。

客观来说，作为核心团队成员，显然我们会更偏爱 Vue，认为对于某些问题来讲用 Vue 解决会更好。如果没有这点信念，我们也就不会整天为此忙活了。但是在此，我们想尽可能地公平和准确地来描述一切。其他的框架也有显著的优点，例如 React 庞大的生态系统，或者像是 Knockout 对浏览器的支持覆盖到了 IE6。我们会尝试着把这些内容全部列出来。

我们也希望得到**你**的帮助，来使文档保持最新状态，因为 JavaScript 的世界进步的太快。如果你注意到一个不准确或似乎不太正确的地方，请[提交问题](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide)让我们知道。

## React

React 和 Vue 有许多相似之处，它们都有：

- 使用 Virtual DOM
- 提供了响应式（Reactive）和组件化（Composable）的视图组件。
- 将注意力集中保持在核心库，伴随于此，有配套的路由和负责处理全局状态管理的库。

由于有着众多的相似处，我们会用更多的时间在这一块进行比较。这里我们不只保证技术内容的准确性，同时也兼顾了平衡的考量。我们需要指出 React 比 Vue 更好的地方，像是他们的生态系统和丰富的自定义渲染器。

React社区为我们准确进行平衡的考量提供了[非常积极地帮助](https://github.com/vuejs/vuejs.org/issues/364)，特别感谢来自 React 团队的 Dan Abramov 。他非常慷慨的花费时间来贡献专业知识，帮助我们完善这篇文档，最后我们对最终结果[都十分满意](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740)。

有了上面这些内容，我们希望你能对下面这两个库的比较内容的公正性感到放心。

### 性能简介

到目前为止，针对现实情况的测试中，Vue 的性能是优于 React 的。如果你对此表示怀疑，请继续阅读。我们会解释为什么会这样（并且会提供一个与 React 团队共同约定的比较基准）。

#### 渲染性能

在渲染用户界面的时候，DOM 的操作成本是最高的，不幸的是没有库可以让这些原始操作变得更快。
我们能做到的最好效果就是：

1. 尽量减少 DOM 操作。Vue 和 React 都使用虚拟 DOM 来实现，并且两者工作的效果一样好。
2. 尽量减少除 DOM 操作以外的其他操作。这是 Vue 和 React 所不同的地方。

在 React 中，我们设定渲染一个元素的额外开销是 1，而平均渲染一个组件的开销是 2。那么在 Vue 中，一个元素的开销更像是 0.1，但是平均组件的开销将会是 4，这是由于我们需要设定响应系统所导致的。

这意味着：在典型的应用中，由于需要渲染的元素比组件的数量是更多的，因此 Vue 的性能表现将会远优于 React。然而，在极端情况下，比如每个组件只渲染一个元素，Vue 就会通常更慢一些。当然接下来还有其他的原因。

Vue 和 React 也提供功能性组件，这些组件因为都是没有声明，没有实例化的，因此会花费更少的开销。当这些都用于关键性能的场景时，Vue 将会更快。为了证明这点，我们建立了一个简单的[参照项目](https://github.com/chrisvfritz/vue-render-performance-comparisons)，它负责渲染 10,000 个列表项 100 次。我们鼓励你基于此去尝试运行一下。然而在实际上，由于浏览器和硬件的差异甚至 JavaScript 引擎的不同，结果都会相应有所不同。

如果你懒得去做，下面的数值是来自于一个 2014 年产的 MacBook Air 并在 Chrome 52 版本下运行所产生的。为了避免偶然性，每个参照项目都分别运行 20 次并取自最好的结果：

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

#### 更新性能

在 React 中，你需要在处处去实现 `shouldComponentUpdate`，并且用不可变数据结构才能实现最优化的渲染。在 Vue 中，组件的依赖被自动追踪，所以当这些依赖项变动时，它才会更新。唯一需要注意的可能需要进一步优化的一点是在长列表中，需要在每项上添加一个 `key` 属性。

这意味着，未经优化的 Vue 相比未经优化的 React 要快的多。由于 Vue 改进过渲染性能，甚至全面优化过的 React 通常也会慢于开箱即用的 Vue。

#### 开发中

显然，在生产环境中的性能是至关重要的，目前为止我们所具体讨论的便是针对此环境。但开发过程中的表现也不容小视。不错的是用 Vue 和 React 开发大多数应用的速度都是足够快的。

然而，假如你要开发一个对性能要求比较高的数据可视化或者动画的应用时，你需要了解到下面这点：在开发中，Vue 每秒最高处理 10 帧，而 React 每秒最高处理不到 1 帧。

这是由于 React 有大量的检查机制，这会让它提供许多有用的警告和错误提示信息。我们同样认为这些是很重要的，但是我们在实现这些检查时，也更加密切地关注了性能方面。

### HTML & CSS

在 React 中，它们都是 JavaScript 编写的，听起来这十分简单和优雅。然而不幸的事实是，JavaScript 内的 HTML 和 CSS 会产生很多痛点。在 Vue 中我们采用 Web 技术并在其上进行扩展。接下来将通过一些实例向你展示这意味的是什么。

#### JSX vs Templates

在 React 中，所有的组件的渲染功能都依靠 JSX。JSX 是使用 XML 语法编写 Javascript 的一种语法糖。这有一个[通过React社区审核过的例子](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684)：

``` jsx
  render () {
	    let { items } = this.props
	
	    let children
	    if ( items.length > 0 ) {
	        children = (
	            <ul>
	                {items.map( item =>
	                    <li key={item.id}>{item.name}</li>
	                )}
	            </ul>
	        )
	    } else {
	        children = <p>No items found.</p>
	    }
	
	    return (
	        <div className = 'list-container'>
	            {children}
	        </div>
	    )
	}
```

JSX 的渲染功能有下面这些优势：

- 你可以使用完整的编程语言 JavaScript 功能来构建你的视图页面。
- 工具对 JSX 的支持相比于现有可用的其他 Vue 模板还是比较先进的（比如，linting、类型检查、编辑器的自动完成）。

在 Vue 中，由于有时需要用这些功能，我们也提供了[渲染功能](render-function.html) 并且[支持了 JSX](render-function.html#JSX)。然而，对于大多数组件来说，渲染功能是不推荐使用了。

在这方面，我们提供的是更简单的模板：

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

优点如下：

- 在写模板的过程中，样式风格已定并涉及更少的功能实现。
- 模板总是会被声明的。
- 模板中任何 HTML 语法都是有效的。
- 阅读起来更贴合英语（比如，for each item in items）。
- 不需要高级版本的 JavaScript 语法，来增加可读性。

这样，不仅开发人员更容易编写代码，设计人员和开发人员也可以更容易的分析代码和贡献代码。

这还没有结束。Vue 拥抱 HTML，而不是用 JavaScript 去重塑它。在模板内，Vue 也允许你用预处理器比如 Pug（原名 Jade）。

React 生态也有一个[项目](https://wix.github.io/react-templates/)允许你写模板，但是存在一些缺点：

- 功能远没有 Vue 模板系统丰富。
- 需要从组件文件中分离出 HTML 代码。
- 这是个第三方库，而非官方支持，可能未来核心库更新就不再支持。

#### CSS 的组件作用域

除非你把组件分布在多个文件上(例如 [CSS Modules](https://github.com/gajus/react-css-modules))，要不在 React 中作用域内的 CSS 就会产生警告。非常简单的 CSS 还可以工作，但是稍微复杂点的，比如悬停状态、媒体查询、伪类选择符等要么通过沉重的依赖来重做要么就直接不能用。

而 Vue 可以让你在每个[单文件组件](single-file-components.html)中完全访问 CSS。

``` html
	<style scoped>
	    @media (min-width: 250px) {
	        .list-container:hover {
	            background: orange;
	        }
	    }
	</style>
```

这个可选 `scoped` 属性会自动添加一个唯一的属性（比如 `data-v-1`）为组件内 CSS 指定作用域，编译的时候 `.list-container:hover` 会被编译成类似 `.list-container[data-v-1]:hover`。

最后，就像 HTML 一样，你可以选择自己偏爱的 CSS 预处理器编写 CSS。这可以让你围绕设计为中心展开工作，而不是引入专门的库来增加你应用的体积和复杂度。

### 规模

#### 向上扩展

Vue 和 React 都提供了强大的路由来应对大型应用。React 社区在状态管理方面非常有创新精神（比如Flux、Redux），而这些状态管理模式甚至[ Redux 本身](https://github.com/egoist/revue)也可以非常容易的集成在 Vue 应用中。实际上，Vue 更进一步地采用了这种模式（[Vuex](https://github.com/vuejs/vuex)），更加深入集成 Vue 的状态管理解决方案 Vuex 相信能为你带来更好的开发体验。

两者另一个重要差异是，Vue 的路由库和状态管理库都是由官方维护支持且与核心库同步更新的。React 则是选择把这些问题交给社区维护，因此创建了一个更分散的生态系统。但相对的，React 的生态系统相比 Vue 更加繁荣。

最后，Vue 提供了[Vue-cli 脚手架](https://github.com/vuejs/vue-cli)，能让你非常容易地构建项目，包含了 [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), 甚至 [no build system](https://github.com/vuejs-templates/simple)。React 在这方面也提供了[create-react-app](https://github.com/facebookincubator/create-react-app)，但是现在还存在一些局限性：

- 它不允许在项目生成时进行任何配置，而 Vue 支持 Yeoman-like 定制。
- 它只提供一个构建单页面应用的单一模板，而 Vue 提供了各种用途的模板。
- 它不能用用户自建的模板构建项目，而自建模板对企业环境下预先建立协议是特别有用的。

而要注意的是这些限制是故意设计的，这有它的优势。例如，如果你的项目需求非常简单，你就不需要自定义生成过程。你能把它作为一个依赖来更新。如果阅读更多关于[不同的设计理念](https://github.com/facebookincubator/create-react-app#philosophy)。

#### 向下扩展

React 学习曲线陡峭，在你开始学 React 前，你需要知道 JSX 和 ES2015，因为许多示例用的是这些语法。你需要学习构建系统，虽然你在技术上可以用 Babel 来实时编译代码，但是这并不推荐用于生产环境。

就像 Vue 向上扩展好比 React 一样，Vue 向下扩展后就类似于 jQuery。你只要把如下标签放到页面就可以运行：

`<script src="https://unpkg.com/vue/dist/vue.js"></script>`


然后你就可以编写 Vue 代码并应用到生产中，你只要用 min 版 Vue 文件替换掉就不用担心其他的性能问题。

由于起步阶段不需学 JSX，ES2015 以及构建系统，所以开发者只需不到一天的时间阅读[指南](http://vuejs.org/guide/)就可以建立简单的应用程序。

### 本地渲染

ReactNative 能使你用相同的组件模型编写有本地渲染能力的 APP（IOS 和 Android）。能同时跨多平台开发，对开发者是非常棒的。相应地，Vue 和 [Weex](https://alibaba.github.io/weex/) 会进行官方合作，Weex 是阿里的跨平台用户界面开发框架，Weex 的 JavaScript 框架运行时用的就是 Vue。这意味着在 Weex 的帮助下，你使用 Vue 语法开发的组件不仅仅可以运行在浏览器端，还能被用于开发 IOS 和 Android 上的原生应用。

在现在，Weex 还在积极发展，成熟度也不能和 ReactNative 相抗衡。但是，Weex 的发展是由世界上最大的电子商务企业的需求在驱动，Vue 团队也会和 Weex 团队积极合作确保为开发者带来良好的开发体验。

### MobX

Mobx 在 React 社区很流行，实际上在 Vue 也采用了几乎相同的反应系统。在有限程度上，React + Mobx 也可以被认为是更繁琐的 Vue，所以如果你习惯组合使用它们，那么选择 Vue 会更合理。

## Angular 1

Vue 的一些语法和 Angular 的很相似（例如 `v-if` vs `ng-if`）。因为 Angular 是 Vue 早期开发的灵感来源。然而，Augular 中存在的许多问题，在 Vue 中已经得到解决。

### 复杂性

在 API 与设计两方面上 Vue.js 都比 Angular 1 简单得多，因此你可以快速地掌握它的全部特性并投入开发。

### 灵活性和模块化

Vue.js 是一个更加灵活开放的解决方案。它允许你以希望的方式组织应用程序，而不是在任何时候都必须遵循 Angular 1 制定的规则，这让 Vue 能适用于各种项目。我们知道把决定权交给你是非常必要的。
这也就是为什么我们提供[Webpack template](https://github.com/vuejs-templates/webpack)，让你可以用几分钟，去选择是否启用高级特性，比如热模块加载、linting、CSS 提取等等。

### 数据绑定

Angular 1 使用双向绑定，Vue 在不同组件间强制使用单向数据流。这使应用中的数据流更加清晰易懂。

### 指令与组件

在 Vue 中指令和组件分得更清晰。指令只封装 DOM 操作，而组件代表一个自给自足的独立单元 —— 有自己的视图和数据逻辑。在 Angular 中两者有不少相混的地方。 

### 性能

Vue 有更好的性能，并且非常非常容易优化，因为它不使用脏检查。

在 Angular 1 中，当 watcher 越来越多时会变得越来越慢，因为作用域内的每一次变化，所有 watcher 都要重新计算。并且，如果一些 watcher 触发另一个更新，脏检查循环（digest cycle）可能要运行多次。Angular 用户常常要使用深奥的技术，以解决脏检查循环的问题。有时没有简单的办法来优化有大量 watcher 的作用域。

Vue 则根本没有这个问题，因为它使用基于依赖追踪的观察系统并且异步队列更新，所有的数据变化都是独立触发，除非它们之间有明确的依赖关系。

有意思的是，Angular 2 和 Vue 用相似的设计解决了一些 Angular 1 中存在的问题。

## Angular 2

我们单独将 Augluar 2 作分类，因为它完全是一个全新的框架。例如：它具有优秀的组件系统，并且许多实现已经完全重写，API 也完全改变了。

### TypeScript

Angular 1 面向的是较小的应用程序，Angular 2 已转移焦点，面向的是大型企业应用。在这一点上 TypeScript 经常会被引用，它对那些喜欢用 Java 或者 C# 等类型安全的语言的人是非常有用的。

Vue 也十分适合制作[企业应用](https://github.com/vuejs/awesome-vue#enterprise-usage)，你也可以通过使用[官方类型](https://github.com/vuejs/vue/tree/dev/types)或[用户贡献的装饰器](https://github.com/itsFrank/vue-typescript)来支持 TypeScript，这完全是自由可选的。

### 大小和性能

在性能方面，这两个框架都非常的快。但目前尚没有足够的数据用例来具体展示。如果你一定要量化这些数据，你可以查看[第三方参照](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html)，它表明 Vue 2 相比 Angular2 是更快的。

在大小方面，虽然 Angular 2 使用 tree-shaking 和离线编译技术使代码体积减小了许多。但包含编译器和全部功能的 Vue2(23kb) 相比 Angular 2(50kb) 还是要小的多。但是要注意，用 Angular 2 的 App 的体积缩减是使用了 tree-shaking 移除了那些框架中没有用到的功能，但随着功能引入的不断增多，尺寸会变得越来越大。

### 灵活性

Vue 相比于 Angular 2 则更加灵活，Vue 官方提供了构建工具来协助你构建项目，但它并不限制你去如何构建。有人可能喜欢用统一的方式来构建，也有很多开发者喜欢这种灵活自由的方式。

### 学习曲线

开始使用 Vue，你使用的是熟悉的 HTML、符合 ES5 规则的 JavaScript（也就是纯 JavaScript）。有了这些基本的技能，你可以快速地掌握它([指南](/guide))并投入开发 。

Angular 2 的学习曲线是非常陡峭的。即使不包括 TypeScript，它的[开始指南](https://angular.io/docs/js/latest/quickstart.html)中所用的就有 ES2015 标准的 JavaScript，18个 NPM 依赖包，4 个文件和超过 3 千多字的介绍，这一切都是为了完成个 Hello World。而[Vue's Hello World](index.html#Hello-World)就非常简单。甚至我们并不用花费一整个页面去介绍它。

## Ember

Ember 是一个全能框架。它提供了大量的约定，一旦你熟悉了它们，开发会变得很高效。不过，这也意味着学习曲线较高，而且并不灵活。这意味着在框架和库（加上一系列松散耦合的工具）之间做权衡选择。后者会更自由，但是也要求你做更多架构上的决定。

也就是说，我们最好比较的是 Vue 内核和 Ember 的[模板](https://guides.emberjs.com/v2.7.0/templates/handlebars-basics/)与[数据模型](https://guides.emberjs.com/v2.7.0/object-model/)层：

* Vue 在普通 JavaScript 对象上建立响应，提供自动化的计算属性。在 Ember 中需要将所有东西放在 Ember 对象内，并且手工为计算属性声明依赖。

* Vue 的模板语法可以用全功能的 JavaScript 表达式，而 Handlebars 的语法和帮助函数相比来说非常受限。

* 在性能上，Vue 甩开 Ember 几条街，即使是 Ember 2.0 的最新 Glimmer 引擎。Vue 能够自动批量更新，而 Ember 在关键性能场景时需要手动管理。

## Knockout

Knockout 是 MVVM 领域内的先驱，并且追踪依赖。它的响应系统和 Vue 也很相似。它在[浏览器支持](http://knockoutjs.com/documentation/browser-support.html)以及其他方面的表现也是让人印象深刻的。它最低能支持到 IE6，而 Vue 最低只能支持到 IE9。

随着时间的推移，Knockout 的发展已有所放缓，并且略显有点老旧了。比如，它的组件系统缺少完备的生命周期事件方法，尽管这些在现在是非常常见的。以及相比于 [Vue](components.html#Content-Distribution-with-Slots) 调用子组件的接口它的方法显得有点笨重。

如果你有兴趣研究，你还会发现二者在接口设计的理念上是不同的。这可以通过各自创建的 [simple Todo List](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89) 体现出来。或许有点主观，但是很多人认为 Vue 的 API 接口更简单结构更优雅。

## Polymer

Polymer 是另一个由谷歌赞助的项目，事实上也是 Vue 的一个灵感来源。Vue 的组件可以粗略的类比于 Polymer 的自定义元素，并且两者具有相似的开发风格。最大的不同之处在于，Polymer 是基于最新版的 Web Components 标准之上，并且需要重量级的 polyfills 来帮助工作（性能下降），浏览器本身并不支持这些功能。相比而言，Vue 在支持到 IE9 的情况下并不需要依赖 polyfills 来工作，。
 
在 Polymer 1.0 版本中，为了弥补性能，团队非常有限的使用数据绑定系统。例如，在 Polymer 中唯一支持的表达式只有布尔值否定和单一的方法调用，它的 computed 方法的实现也并不是很灵活。

Polymer 自定义的元素是用 HTML 文件来创建的，这会限制使用 JavaScript/CSS（和被现代浏览器普遍支持的语言特性）。相比之下，Vue 的单文件组件允许你非常容易的使用 ES2015 和你想用的 CSS 预编译处理器。

在部署生产环境时，Polymer 建议使用 HTML Imports 加载所有资源。而这要求服务器和客户端都支持 Http 2.0 协议，并且浏览器实现了此标准。这是否可行就取决于你的目标用户和部署环境了。如果状况不佳，你必须用 Vulcanizer 工具来打包 Polymer 元素。而在这方面，Vue 可以结合异步组件的特性和 Webpack 的代码分割特性来实现懒加载（lazy-loaded）。这同时确保了对旧浏览器的兼容且又能更快加载。 

而 Vue 和 Web Component 标准进行深层次的整合也是完全可行的，比如使用 Custom Elements、Shadow DOM 的样式封装。然而在我们做出严肃的实现承诺之前，我们目前仍在等待相关标准成熟，进而再广泛应用于主流的浏览器中。

## Riot

Riot 2.0 提供了一个类似于基于组件的开发模型（在 Riot 中称之为 Tag），它提供了小巧精美的 API。Riot 和 Vue 在设计理念上可能有许多相似处。尽管相比 Riot ，Vue 要显得重一点，Vue 还是有很多显著优势的：

- 根据真实条件来渲染，Riot 根据是否有分支简单显示或隐藏所有内容。
- 功能更加强大的路由机制，Riot 的路由功能的 API 是极少的。
- 更多成熟工具的支持。Vue 提供官方支持[Webpack](https://github.com/vuejs/vue-loader)、[Browserify](https://github.com/vuejs/vueify)和[SystemJS](https://github.com/vuejs/systemjs-plugin-vue)，而 Riot 是依靠社区来建立集成系统。
- [过渡效果系统](transitions.html)。Riot 现在还没有提供。
- 更好的性能。Riot [尽管声称](https://github.com/vuejs/vuejs.org/issues/346)其使用了虚拟 DOM，但实际上用的还是脏检查机制，因此和 Angular 1 患有相同的性能问题。


***

> 原文：http://vuejs.org/guide/comparison.html

***
