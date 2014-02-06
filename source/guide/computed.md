title: Computed Properties
type: guide
order: 8
---

# {{title}}

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
            $get: function () {
                return this.firstName + ' ' + this.lastName
            },
            // the setter is optional
            $set: function (newValue) {
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

## Dependency Collection Gotcha

Like inline expressions, Vue.js automatically collects dependencies for computed properties and refreshes them when their dependencies change. There's one thing to keep in mind though: since Vue.js collects dependencies by monitoring which properties are accessed inside a getter, you need to be careful when there is conditional logic within your getters. Consider this example:

``` js
// ...
status: function () {
    return this.validated
        ? this.okMsg
        : this.errMsg
}
// ...
```

If `validated` is true in the beginning, then `errMsg` will not be accessed and therefore not collected as a dependency. Vice-versa for `okMsg`. To get around this you can simply manually access potentially unreachable properties in your getter:

``` js
// ...
status: function () {
    // access dependencies explicitly
    this.okMsg
    this.errMsg
    return this.validated
        ? this.okMsg
        : this.errMsg
}
// ...
```

<p class="tip">You don't need to worry about this in inline expressions because Vue.js' expression parser takes care of it for you.</p>

Next: [Adding Transition Effects](/guide/transitions.html)