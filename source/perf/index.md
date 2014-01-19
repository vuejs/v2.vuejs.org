title: Performance Comparisons
---

# {{title}}

## TodoMVC Benchmark

This is a benchmark found in the [webkit performance tests](https://github.com/WebKit/webkit/tree/master/PerformanceTests/DoYouEvenBench) based on the [TodoMVC](http://todomvc.com/) project. For each framework implementation, add 100 todos, toggle them one by one, then delete them one by one. In addition to the most popular MV* libraries, I also included [Om](https://github.com/swannodette/om) (a ClojureScript interface on top of React which boasts of performance) and [Ractive](http://www.ractivejs.org/) (very similar in terms of use case and API).

### Compared libraries

- Vue (v0.7.3)
- Backbone (v1.1.0) + jQuery (v2.0.3)
- Knockout (v3.0.0)
- Ember (v1.0.0) + Handlebars (v1.0.0) + jQuery (v1.9.1)
- Angular (v1.2.7)
- React (v0.8.0)
- Om (version unknown) + React (v0.8.0)
- Ractive (v0.3.8)

### Results

10 runs average, faster is better. Data collected on an <span id="_machine"></span> with a <span id="_cpu"></span> Processor under <span id="_os"></span>.

<ul id="benchmark-results"></ul>

Please note these numbers only reflect one very specific use case and the outcome could be drastically different depending on implementation and interactions measured. However, this could at least provide some perspective in terms of general performance.

You can run these benchmarks in your browser [here](/perf/todomvc-benchmark/).

<script src="/js/benchmark.js"></script>
<link rel="stylesheet" type="text/css" href="/css/benchmark.css">

## Animating 100 Instances

You might have seen [this performance comparison](http://jsfiddle.net/jashkenas/CGSd5/) made by Jeremy Ashkenas long time ago between Backbone.js and Ember.js. Here is a [new version](http://jsfiddle.net/yyx990803/h7rjy/4/) which compares latest Backbone.js and Vue.js instead with an FPS meter. On my machine in Chrome, Backbone runs at ~30fps while Vue at ~50fps.

In addition, here's [another version](http://jsfiddle.net/yyx990803/h7rjy/5/) of the same comparison, but using a single, centralized Model for all the Views/ViewModels. The performance difference is more obvious with Backbone at ~40fps and Vue reaching ~80fps (due to `_.defer` firing faster than `requestAnimationFrame`).