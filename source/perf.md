title: Performance Comparisons
---

Draft. Links coming soon.

## TodoMVC Benchmark

A benchmark from the [webkit performance tests](https://github.com/WebKit/webkit/tree/master/PerformanceTests/DoYouEvenBench). Add 100 todos, toggle them one by one, then delete them one by one. Tests are run on an early-2011 Macbook Pro with a Core i7-2635QM Processor (quad-core, 2 GHz) under OS X Mavericks 10.9.1.

- Chrome 32
    - Vue.js: **531ms**
    - VanillaJS: 1308ms
    - Ember.js: 2540ms
    - Backbone.js: 859ms
    - jQuery: 2363ms
    - AngularJS: 1455ms
    - React.js: 7930ms
- Firefox 26
    - Vue.js: 680ms
    - VanillaJS: **420ms**
    - Ember.js: 3627ms
    - Backbone.js: 1109ms
    - jQuery: 1338ms
    - AngularJS: 1762ms
    - React.js: 4420ms
- Safari 7
    - Vue.js: **278ms**
    - VanillaJS: 1426ms
    - Ember.js: 1670ms
    - Backbone.js: 867ms
    - jQuery: 3193ms
    - AngularJS: 1239ms
    - React.js: 2714ms
- 3-Browser Average
    - Vue.js: **496.3ms** (47.5% faster than second)
    - VanillaJS: 1051.3ms
    - Ember.js: 2612.3ms
    - Backbone.js: 945ms
    - jQuery: 2298ms
    - AngularJS: 1485.3ms
    - React.js: 5021.3ms

## Updating 100 Balls

You might have seen this [comparison](http://jsfiddle.net/jashkenas/CGSd5/) between Backbone and Ember by Jeremy Ashkenas.

Vue.js can easily update these 100 balls at an optimal 60fps.