---
title: 对比其他框架
type: guide
order: 26
---
这个页面无疑是最难编写的，但也是非常重要的。或许你遇到了一些问题并且先前用其他的框架解决了。来这里的目的是看看Vue是否有更好的解决方案。那么你就来对了。

客观来说，作为核心团队成员，显然我们会更偏爱Vue，对于某些问题用Vue来解决会更好，如果没有这点信念，我们也就不会整天为此忙活了。但是，我们想尽可能地公平和准确地来讲述。其他的框架也有显著的优点，比如 Rect 的生态系统，或者 Knockout 对浏览器支持到 IE6 。我们把这些也都会全列出来。

我们希望得到**你们**的帮助，来使文档保持更新，因为 JavaScript 的世界进步的太快。如果你注意到一个不准确或似乎不太正确的地方，请[提交问题](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide)让我们知道。

## React

React 和 Vue 有许多相似之处，它们都有：

- 使用 Virtual DOM
- 提供了响应式（Reactive）和组件化（Composable）的视图组件。
- 保持注意力集中在核心库，伴随于此，有配套的路由和负责处理全局状态管理的库。

相似的作用域，我们会用更多的时间来讲这一块的比较。不仅我们要保持技术的准确性，同时兼顾平衡。我们指出React比Vue更好的地方，例如，他们的生态系统和丰富的自定义渲染器。

React社区[在这里](https://github.com/vuejs/vuejs.org/issues/364)非常积极地帮助我们实现这一平衡，特别感谢来自 React 团队的 Dan Abramov 。他非常慷慨的花费时间来贡献专业知识，来帮我们完善这个文件，直到我们都[满意](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740)。

这么说，就是希望你能对这两个库的比较的公平性感到放心。

### 性能简介

到目前为止，在现实的测试中，Vue 是优于 React 的（通常至少快20%-50%，尽管在某些情况下还要更快）。我们可以提供一个到这个参照项目的链接，但是坦率的说，所有的参照在某些方面是有缺陷的，很少有像你所写的一个真实应用。相反，让我们详细了解下。

#### 渲染性能

在渲染用户界面的时候，DOM的操作是最昂贵，不幸的是没有库可以让这些原始操作变得更快。
我们能做的最好的就是：

1. 尽量减少的DOM操作。Vue 和 React 都使用虚拟DOM来实现，并且两者工作一样好。
2.  尽量减少除DOM操作以外的其他操作。这是 Vue 和 React的一个不同的地方。

在React中，渲染一个元素的额外开销是1，而平均渲染一个组件的开销是2。在Vue中，一个元素的开销更像0.1，但是平均组件的开销将是4由于安装所需要的反应系统的设置。

这意味着，在典型的应用中，需要渲染的元素比组件的数量是更多的，因为Vue的性能表现将会远优于React。然而，在极端情况下，比如每个组件渲染一个元素，Vue 将通常会较慢。显然这还没有说完。

Vue 和 React 也提供提供功能性组件，这些组件都是没有声明，没有实例化，因此需要更少的开销。当这些都用于性能的关键位置，Vue会更快。为了证明这点，我们建立一个简单的[参照项目](https://github.com/chrisvfritz/vue-render-performance-comparisons)，它只是渲染 10,000 个列表项 100次。我们鼓励你自己去试一下，实际上，由于浏览器和硬件的原因，结果会有所不同，由于 JavaScript 引擎的不同，结果也会有很大不同。

如果你懒得去做，下面的数字数字从一个运行在 Chrome 52 在一个 2014年产的 MacBook Air上。为了避免偶然性，每个参照项目都分开运行20次，和包含的最好的结果：

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

在React中，你需要在每个地方去实现 `shouldComponentUpdate` ，并且用immutable数据结构才能实现完全完全优化的 re-renders 。在 Vue 中，组件的依赖被自动追踪，所以当这些依赖项变动时，它才会更新。在长列表中，有时候需要进一步优化的话，只需要在每项上添加 `key` 属性。

这意味着，由于Vue内改进过的渲染性能，更新未经优化的Vue回避未经优化的React要快的多。甚至全面优化过的React通常也会慢于未加处理的Vue。

#### 开发中

显然，在生产中的性能是最重要的，并且也是到目前为止我们所讨论的。开发过程中的表现也是很重要的。好消息是用 Vue 和 React 开发大多数应用的速度都是足够快的。

然而，加入你要开发一个对性能要求比较高的数据可视化或者动画的应用时，这将会很有用。在开发中， Vue 每秒最高处理10帧，而 React 每秒最高处理不到1帧。

这是由于 React 有大量的检查机制，这能让它提供许多有用的警告和错误提示信息。我们同意那些很重要的，但在我们实现这些检查时候，也更加密切地关注着性能。

### HTML & CSS

在React中，所有的都是 JavaScript，听起来十分简单和优雅。不幸的事实是，JavaScript 内的 HTML 和 CSS 会引起很多痛苦。在 Vue 中我们采用的 Web 技术并在其上面扩展。接下来将通过一些实例向你展示这所意味的是什么。

#### JSX vs Templates

在 React 中，所有的组件的渲染功能使用的都是JSX。JSX 是使用 XML 语法编写 Javascript 的一种语法糖。这有一个[通过React社区审核过的](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684)例子：

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

JSX的渲染功能有一些优势：

- 你可以使用的完整的编程语言JavaScript来构建你的视图页面。
- 工具对JSX的支持相比于现有可用的其他Vue模板还是比较先进的（比如，linting、类型检查、编辑器的自动完成）。

在 Vue 中，由于有时需要用那些功能，我们也提供了[渲染功能](render-function.html) 并且[ 支持JSX ](render-function.html#JSX)。然而，对于大多数组件来说，渲染功能是不推荐使用了。

在这方面，我们提供的是个更简单的模板：

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

有点如下：

- 在写模板的过程中，样式风格已定和涉及更少的功能实现。
- 一个模板总是被声明的。
- 模板中任何 HTML 都是有效的。
- 阅读起来更像英语（比如，for each item in items）。
- 高级版本的 JavaScript 不需要增加可读性。

这样，不仅开发人员更容易编写代码，设计人员和开发人员也可以更容易的分析代码和贡献代码。

还没有结束。Vue拥抱HTML，而不是用JavaScript重塑它。在模板内，Vue也允许你用预处理器比如Pub（原名 Jade） 。

React 生态也有一个[项目](https://wix.github.io/react-templates/)允许你写摸吧，但是有一些缺点：

- 功能远没有 Vue 模板系统的丰富。
- 需要从组件文件中分离出HTML代码。
-  这是个第三方库，而非官方支持，可能未来核心库更新就不再支持。

#### CSS的组件作用域

除非你把组件分布在多个文件上(例如 [CSS Modules](https://github.com/gajus/react-css-modules)),要不作用域内的CSS就会暴警告。非常简单的CSS还可以工作，但是稍微复杂点的，比如悬停状态、媒体查询、伪类选择符要么会被修改要么就不能用。

Vue让你可以完全访问[ 单文件组件 ](single-file-components.html)。

``` html
	<style scoped>
	    @media (min-width: 250px) {
	        .list-container:hover {
	            background: orange;
	        }
	    }
	</style>
```

这个可选 `scoped` 属性自动添加一个唯一的属性（比如 `data-v-1` ）为组件内CSS指定作用范围，编译的时候 `.list-container:hover` 会被编译成类似`.list-container[data-v-1]:hover`。

最后，你可以选择自己偏爱的CSS预处理器编写CSS。这可以让你围绕设计为中心展开工作，而不是引入库来增加你应用的容量和复杂度。

### 规模

#### 扩大

Vue和React都提供了强大的路由来应对对于大型应用。React社区在状态管理方面非常有创新精神（比如Flux、Redux），而这些状态管理模式甚至[ Redux本身 ](https://github.com/egoist/revue)也是非常容易能够集成在Vue应用中的。实际上，Vue更进一步地采用了这种模式（[Vuex](https://github.com/vuejs/vuex)），把Vuex集成进Vue能带来更好的开发体验。

两者另一个重要差异是，Vue伴随的路由库和状态管理库都是由官方支持维护且和核心库同步更新的。React 生态更成熟，选择是把这些问题交给社区维护。

最后，Vue 提供了一个[Vue-cli 脚手架](https://github.com/vuejs/vue-cli)，能让你非常容易地构建项目，可以包含 [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), 或者 [no build system](https://github.com/vuejs-templates/simple)。React在这方面也提供了[create-react-app](https://github.com/facebookincubator/create-react-app)，但是现在还有一些局限性：

- 它不允许在项目生成时进行任何配置，而Vue运行Yeoman-like定制。
- 它只提供一个构建单页面应用的单一模板，而Vue 提供各种用途的多种模板。
- 它不能用用户自建的模板构建项目，而这对企业环境预先建立协议是很有用。

注意这些限制是故意设计的，这有它的优势。例如，如果你的项目需求非常简单，你就不需要自定义生成过程。你能把它作为一个依赖来更新。如果阅读更多关于[不同的设计理念]()。

#### 缩小

React学习曲线陡峭，在你开始学 React 前，你需要知道 JSX 和 ES2015，因为许多示例用的是这些语法。你需要学习构建系统，虽然你可以在技术上可以用 Babel Standalone 来编译代码，但是不推荐用于生产。

Vue样扩大后就像React，缩小后就像 Jquery。你需要做的就是把如下标签放到页面就行：


`<script src="https://unpkg.com/vue/dist/vue.js"></script>`


然后就可编写Vue代码并应用到生产中，而不用担心性能问题。

由于起步阶段不需学JSX，ES2015 或构建系统，所以建立应用花的时间会更少。

### 本地渲染


ReactNative能使你用相同的组件模型编写有本地渲染能力的APP（IOS或Android）。能同时跨多平台开发，对开发者是非常棒的。相应地，Vue和Weex会进行官方合作，Weex是阿里的跨平台用户界面开发框架，Weex 的 JavaScript 框架运行时用的就是Vue。这以为着不仅在浏览器，在 IOS 和 Android 上面也可以用 Vue 来进行开发。

在现在，Weex 还在积极发展，成熟度也不能和 ReactNative 相抗衡。但是，Weex的发展是由世界上最大的电子商务企业的需求在驱动，Vue 团队也会和 Weex 团队积极合作确保为开发者带来良好的开发体验。

### MobX

Mobx 在 React 社区很流行，实际上在Vue也采用了几乎相同的反应系统。在有限程度上，React + Mobx 也可以被认为是更繁琐的 Vue，所以如果你习惯组合使用它们，那么选择 Vue 会更合理。

## Angular 1

Due的一些语法和Angular的很相似（例如 `v-if` vs  `ng-if`）。因为Angular是Vue早期开发的灵感来源。然而，Augular中存在许多问题，在Vue中已经得到解决。

### 复杂性

在 API 与设计两方面上 Vue.js 都比 Angular 1 简单得多，因此你可以快速地掌握它的全部特性并投入开发。

### 灵活性和模块化

Vue.js 是一个更加灵活开放的解决方案。它允许你以希望的方式组织应用程序，而不是在任何时候都必须遵循 Angular 1 制定的规则，这使让Vue能适用于各种项目。我们知道把决定权交给你，是非常必要的，就是是为什么提供[Webpack template](https://github.com/vuejs-templates/webpack)，让你用几分钟，去选择是否用高级特性，比如热模块加载、linting 、
 Css extraction 等等。

### 数据绑定

Angular 1 使用双向绑定，Vue在不同组件间强制适用单向数据流。这使应用中的数据流清晰易懂。

### 指令与组件

在 Vue 中指令和组件分得更清晰。指令只封装 DOM 操作，而组件代表一个自给自足的独立单元 —— 有自己的视图和数据逻辑。在 Angular 中两者有不少相混的地方。 

### 性能

Vue.js 有更好的性能，并且非常非常容易优化，因为它不使用脏检查。

在Angular 1中，当 watcher 越来越多时会变得越来越慢，因为作用域内的每一次变化，所有 watcher 都要重新计算。并且，如果一些 watcher 触发另一个更新，脏检查循环（digest cycle）可能要运行多次。 Angular 用户常常要使用深奥的技术，以解决脏检查循环的问题。有时没有简单的办法来优化有大量 watcher 的作用域。

Vue.js 则根本没有这个问题，因为它使用基于依赖追踪的观察系统并且异步列队更新，所有的数据变化都是独立地触发，除非它们之间有明确的依赖关系。

有意思的是，Angular 2 和 Vue 用相似的设计解决了一些 Angular 1 中存在的问题。

## Angular 2

Augluar 2完全是一个全新的框架。例如,它具有优秀的组件系统，并且许多实现已经完全重写，API也完全改变了。

### TypeScript

Angular 1面向的较小的应用程序，Angular 2已转移焦点，面向的是大型企业应用。TypeScript被引用，这对那些喜欢用Java或者C#等类型安全的语言的人是非常有用的。

Vue也适合[企业应用](https://github.com/vuejs/awesome-vue#enterprise-usage)，也可以使用TypeScript来支持[官方类型](https://github.com/vuejs/vue/tree/dev/types)和[用户贡献的类型](https://github.com/itsFrank/vue-typescript)，尽管这是可选的。

### 尺寸和性能

在性能方面，这两个框架都是非常快。但是如果你查看[第三方参照]()，就可以得出 Vue 2 比 Angular2 要快的。

在尺寸方面，虽然 Angular 2 使用 tree-shaking 技术和编译技术能使代码尺寸减小。 

即便包含编译器和全部功能 Vue2(23kb)比起 Angular 2(50kb)还是小的多。但是要注意，用 Angular 的 App 的尺寸缩减是用 tree-shaking 移除了那些框架中没有用到的功能，当随着引入功能的增多，尺寸会越来越大。

### 灵活性

Vue 官方提供了构建工具，但没限制你如何构建。有人喜欢用统一的方式构建，也有很多开发者喜欢这种灵活自由的方式。

### 学习曲线

开始使用Vue，你使用的是熟悉的HTML、符合ES5规则的JavaScript（也就是纯JavaScript）。有了这些基本的技能，你可以快速地掌握它([指南](/guide))并投入开发 。

Angular 2 的学习曲线是非常陡峭的。即使不包括TypeScript，它们[开始指南](https://angular.io/docs/js/latest/quickstart.html)中所用的就有ES2015标准的JavaScript，18个NPM依赖包，4个文件和超过3千多字介绍，这一切都是为了完成个Hello World。而[Vue's Hello World](index.html#Hello-World)就非常简单。

## Ember

Ember 是一个全能框架。它提供大量的约定，一旦你熟悉了它们，开发会很高效。不过，这也意味着学习曲线较高，而且不灵活。在框架和库（加上一系列松散耦合的工具）之间权衡选择。后者更自由，但是也要求你做更多的架构决定。

也就是说，最好比较 Vue.js 内核和 Ember 的模板与数据模型层：
* Vue 在普通 JavaScript 对象上建立响应，提供自动化的计算属性。在 Ember 中需要将所有东西放在 Ember 对象内，并且手工为计算属性声明依赖。

* Vue 的模板语法可以用全功能的 JavaScript 表达式，而 Handlebars 的语法和帮助函数语法相比之下非常受限。

* 在性能上，Vue 甩开 Ember 几条街，即使是 Ember2.0 的最新Glimmer引擎。Vue自动批量更新，Ember 当性能关键处需要手动管理。

## Knockout

Knockout 是MVVM领域内的先驱，并且追踪依赖。它的响应系统和Vue相似。它对[浏览器支持](http://knockoutjs.com/documentation/browser-support.html)以及所有的表现也是让人印象深刻的。它能最低支持到IE6，而Vue最低只能支持到IE9。

随着时间的推移，Knockout的发展已有所放缓，并且略显有点老旧了。比如，它的组件系统缺少完备的生命周期事件方法，尽管这些在现在是非常常见。以及相比[Vue](components.html#Content-Distribution-with-Slots)调用子组件的接口显得有点笨重。

如果你有兴趣研究，会发现它们在接口设计的构思理念上是不同的。这些通过各自创建的 [ simple Todo List ](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89)可以体现出来。或许有点主观，但是很多人认为Vue的API接口更简单结构更优雅。

## Polymer

Polymer 是另一个由谷歌赞助的项目，事实上也是Vue的一个灵感来源。Vue的组件可以粗略的类比于Polymer的自定义元素，并且两者具有相似的开发风格。最大的不同之处在于，Polymer是构建于最新版的Web Components标准之上的，并且需要非凡的polyfills来工作（性能下降），浏览器本身不支持这些功能。相比而言，Vue不需要依赖polyfills来工作，最低到IE9。
 
在 Polymer 1.0版本中，为了弥补性能，团队非常有限的使用数据绑定系统。例如，在Ploymer中支持的唯一表达式只有布尔值否定和单一的方法的调用，它的computed方法的实现也不是很灵活。

Polymer 自定义的元素是用HTML文件来创建的，这回限制你的普通的JavaScript/CSS（和被现代浏览器普遍支持的语言特性）。相比之下，Vue的单文件允许你非常容易的使用ES2015和你想用的Css的预编译处理器。

当部署到生产环境的时候，Polymer建议使用HTML Imports加载所有资源。而这要求服务器和客户端都支持Http 2.0协议，且浏览器实现了标准。这是否可行就取决于你的目标用户和部署环境了。如果状况不佳，你必须用Vulcanizer工具来来打包Polymer元素。在这方面，Vue 可以结合异步组件的特性和Webpack的代码分割特性来实现懒加载（lazy-loaded）。这同时确保了对旧浏览器的兼容且又能更快加载。 

对Vue和Web Component标准之间进行深层次的整合，也是完全可行的，比如Custom Elements、Shadow DOM的样式封装。然而现在在我们做出严肃的承诺之前，我们仍在等待标准成熟，进而广泛应用于主流的浏览器中。

## Riot

Riot 2.0 提供了一个类似于基于组件的开发模型（在Riot中称之为”Tag”），提供小巧精美的API。Riot 和 Vue 可能共享一些设计理念。即使相比Roit重一点，Vue还是有很多显著优势的：

- 根据真实条件来渲染，Roit根据是否有分支简单显示或隐藏所有内容。
- 功能更加强大的路由机制，Roit的路由功能的API是极少的。
- 更多成熟工具的支持。Vue 提供官方支持[Webpack](https://github.com/vuejs/vue-loader)、[Browserify](https://github.com/vuejs/vueify)和[SystemJS](https://github.com/vuejs/systemjs-plugin-vue)，而 Roit 是依靠社区来建立集成系统。
- [过渡效果系统](transitions.html)。Riot现在没有提供。
- 更好的性能。Roit [尽管广告称](https://github.com/vuejs/vuejs.org/issues/346)用虚拟DOM，实际上用的还是脏检查机制，因此和Angular 1患有相同的性能问题。


***

> 原文：http://vuejs.org/guide/comparison.html

***
