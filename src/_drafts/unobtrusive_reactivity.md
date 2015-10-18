title: Unobtrusive Reactivity
date: 2014-12-08 15:02:14
tags:
---

- Simplicity as a Feature
- Powerful Computed Properties
  - compare
- State management is flexible
  - Two-way binding is optional
  - Vuex
  - Redux
  - NuclearJS
- Performance
  - best hot update performance

Ref

- Immutable Data Structure: interop issue
  - http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript
- Global or local state - it is all about Identity
  - https://twitter.com/floydophone/status/649786438330945536
  - https://twitter.com/sebmarkbage/status/647866515308449792
- [Ember Object](http://guides.emberjs.com/v2.0.0/object-model/)
  - Cumbersome wrapper with additional syntax
  - Manually listed dependency for computed properties
- [Angular $apply](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply)
  - must know when to call $apply
  - performance directly related to watcher count and hard to optimize
  - stabilization problem
- React
  - "dirty checking at the DOM structure layer"
  - must call `setState` or, remember to call render!
  - performance is not free
    - `shouldComponentUpdate`
    - Immutable + Flux
- Polymer
  - weak reactivity due to limitations of Object.observe
- [Mobservable](http://survivejs.com/blog/mobservable-interview/)
