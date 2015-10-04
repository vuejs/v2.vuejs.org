title: Mixins
type: guide
order: 16
---

Mixins are a flexible way to distribute reusable functionalities for Vue components. You can write a mixin just like a normal Vue component option object:

``` js
// mixin.js
module.exports = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```

``` js
// test.js
var myMixin = require('./mixin')
var Component = Vue.extend({
  mixins: [myMixin]
})
var component = new Component() // -> "hello from mixin!"
```
