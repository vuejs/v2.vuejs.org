title: Computed Properties
type: guide
order: 8
---

Vue.js' inline expressions are very convenient, but the best use cases for them are simple boolean operations or string concatenations. For more complicated logic, you should use **computed properties**.

In Vue.js, you define computed properties with the `computed` option:

``` js
var demo = new Vue({
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: {
      // the getter should return the desired value
      get: function () {
        return this.firstName + ' ' + this.lastName
      },
      // the setter is optional
      set: function (newValue) {
        var names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
      }
    }
  }
})

demo.fullName // 'Foo Bar'
```

When you only need the getter, you can provide a single function instead of an object:

``` js
// ...
computed: {
  fullName: function () {
    return this.firstName + ' ' + this.lastName 
  }    
}
// ...
```

A computed property is essentially a property defined with getter/setter functions. You can use a computed property just like a normal property, but when you access it, you get the value returned by the getter function; when you change its value, you trigger the setter function passing in the new value as its argument.

<p class="tip">Before Vue.js 0.11 there used to be a dependency collection gotcha which requires users to explicitly list dependencies when conditional statements are involved. Starting with 0.11 it is no longer necessary to do so.</p>

Next, let's learn about how to [write a custom directive](/guide/custom-directive.html).