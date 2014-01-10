title: Performance Comparisons
---

## TodoMVC Benchmark

This is a benchmark found in the [webkit performance tests](https://github.com/WebKit/webkit/tree/master/PerformanceTests/DoYouEvenBench) based on the [TodoMVC](http://todomvc.com/) project. For each framework implementation, add 100 todos, toggle them one by one, then delete them one by one.

### Compared libraries

- Vue (v0.7.3)
- Backbone (v1.1.0) + jQuery (v2.0.3)
- Knockout (v3.0.0)
- Ember (v1.0.0) + Handlebars (v1.0.0) + jQuery (v1.9.1)
- Angular (v1.2.7)
- React (v0.8.0)
- Om (version unknown) + React (v0.8.0)

### Results

10 runs average, faster is better. Data collected on an early-2011 Macbook Pro with a Core i7-2635QM Processor (quad-core, 2 GHz) under OS X Mavericks 10.9.1.

<ul id="benchmark-results"></ul>

Please note these numbers only reflect one very specific use case and the outcome could be drastically different depending on implementation and interactions measured. However, this could at least provide some perspective in terms of general performance.

[Run the Benchmark Yourself](/perf/todomvc-benchmark/)

<script src="/js/benchmark.js"></script>
<link rel="stylesheet" type="text/css" href="/css/benchmark.css">