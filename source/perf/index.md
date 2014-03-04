title: Performance Comparisons
---

## TodoMVC Benchmark

> *Last Updated: 2014-03-04*

> This is a benchmark found in the [webkit performance tests](https://github.com/WebKit/webkit/tree/master/PerformanceTests/DoYouEvenBench) based on the [TodoMVC](http://todomvc.com/) project. For each framework implementation, add 100 todos, toggle them one by one, then delete them one by one. In addition to the most popular MV* libraries, I also included [Om](https://github.com/swannodette/om) (a ClojureScript interface on top of React which boasts of performance) and [Ractive](http://www.ractivejs.org/) (very similar in terms of use case and API).

> **Disclaimer**: the original benchmark was written to compare the performance of different browsers rather than that of the frameworks. The results here are merely for technical reference and do not reflect the user experience in real products.

### Compared libraries

- Vue (v0.9.3)
- Backbone (v1.1.2) + jQuery (v2.0.3)
- Knockout (v3.0.0)
- Ember (v1.4.0 production) + Handlebars (v1.3.0) + jQuery (v2.1.0)
- Angular (v1.2.14)
- React (v0.9.0)
- Om (version unknown) + React (v0.8.0)
- Ractive (v0.3.9)

### Results

10 runs average, faster is better. Data collected on an <span id="_machine"></span> with a <span id="_cpu"></span> Processor under <span id="_os"></span>.

<ul id="benchmark-results"></ul>

You can run these benchmarks in your browser [here](/perf/todomvc-benchmark/). You can also check out the source [here](https://github.com/vuejs/vuejs.org/tree/master/perf/todomvc-benchmark).

<script src="/js/benchmark.js"></script>
<link rel="stylesheet" type="text/css" href="/css/benchmark.css">

## Animating 100 Instances

You might have seen [this performance comparison](http://jsfiddle.net/jashkenas/CGSd5/) made by Jeremy Ashkenas long time ago between Backbone.js and Ember.js. Here is a new version which compares the same implementation with latest Backbone.js, Ember + HTMLBars, React.js and Vue.js:

<iframe width="100%" height="500" src="http://jsfiddle.net/yyx990803/uv4Jn/embedded/result,js,html,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>