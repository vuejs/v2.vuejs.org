title: Filters in Depth
type: guide
order: 4
---

## Synopsis

A Vue.js filter is essentially a function that takes a value, processes it, and then returns the processed value. In the markup it is denoted by a single pipe (`|`) and can be followed by one or more arguments:

``` html
<element directive="expression | filterId [args...]"></element>
```

## Examples

Filters must be placed at the end of a directive's value:

``` html
<span v-text="message | capitalize"></span>
```

You can also use them inside mustache-style bindings:

``` html
<span>&#123;&#123;message | uppercase&#125;&#125;</span>
```

Multiple filters can be chained together:

``` html
<span>&#123;&#123;message | lowercase | reverse&#125;&#125;</span>
```

## Arguments

Some filters can take optional arguments. Simply add arguments separated by spaces:

``` html
<span>&#123;&#123;order | pluralize st nd rd th&#125;&#125;</span>
```

``` html
<input v-on="keyup: submitForm | key enter">
```

For their specific use of the above examples see the [full list of built-in filters](/api/filters.html).

## Writing a Custom Filter

You can register a custom filter with the global `Vue.filter()` method, passing in a **filterID** and a **filter function**. The filter function takes a value as the argument and returns the transformed value:

``` js
Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
```

``` html
<!-- 'abc' => 'cba' -->
<span v-text="message | reverse"></span>
```

The filter function also receives any inline arguments:

``` js
Vue.filter('wrap', function (value, begin, end) {
  return begin + value + end
})
```

``` html
<!-- 'hello' => 'before hello after' -->
<span v-text="message | wrap before after"></span>
```

### Two-way Filters

Up till now we have used filters to transform values coming from the model and before displaying them in the view. But it is also possible to define a filter that transforms the value before it is written back to the model from the view (input elements):

``` js
Vue.filter('check-email', {
  // read is optional in this case, it's here
  // just for demo purposes.
  read: function (val) {
    return val
  },
  // this will be invoked before writing to
  // the model.
  write: function (val, oldVal) {
    return isEmail(val) ? val : oldVal
  }
})
```

### Filter Context

When a filter is invoked, its `this` context is set to the Vue instance that is invoking it. This allows it to output dynamic results based on the state of the owner Vue instance.

For example:

``` js
Vue.filter('concat', function (value, key) {
  // `this` points to the Vue instance invoking the filter
  return value + this[key]
})
```
``` html
<input v-model="userInput">
<span>{&#123;msg | concat userInput&#125;}</span>
```

For this simple example above, you can achieve the same result with just an expression, but for more complicated procedures that need more than one statements, you need to put them either in a computed property or a custom filter.

The built-in `filterBy` and `orderBy` filters are both filters that perform non-trivial work on the Array being passed in and relies on the current state of the owner Vue instance.

Now that you know everything about directives and filters, let's talk about how to [display a list of items](/guide/list.html).