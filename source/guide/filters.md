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

Muliple filters can be chained together:

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

You can register a custom filter with the global `Vue.filter()` method, passing in a **filterID** and a **filter function**. The filter function takes a value as the argument and return the transformed value:

``` js
Vue.filter('reverse', function (value) {
    return value.split('').reverse().join('')
})
```

``` html
<!--
    'abc' => 'cba'
-->
<span v-text="message | reverse"></span>
```

The filter function also receives any inline arguments:

``` js
Vue.filter('wrap', function (value, begin, end) {
    return begin + value + end
})
```

``` html
<!--
    'hello' => 'before hello after'
-->
<span v-text="message | wrap before after"></span>
```

## Computed Filters

When a filter is invoked, its `this` context are set to the ViewModel instance that is invoking it. This allows it to output dynamic results based on the state of the owner ViewModel. In such case, we need to track these accessed properties so that when they change, directives that are using this filter will be re-evaluated.

For example:

``` js
Vue.filter('concat', function (value, key) {
    // `this` points to the VM invoking the filter
    return value + this[key]
})
```
``` html
<input v-model="userInput">
<span>{&#123;msg | concat userInput&#125;}</span>
```

Filters that relies on the state of the ViewModel that is calling it are referred to as **computed filters**. For this simple example above, you can achieve the same result with just an expression, but for more complicated procedures that need more than one statements, you need to put them either in a computed property or a computed filter.

For example, the built-in `filterBy` and `orderBy` filters are both computed filters that performs non-trivial work on the Array being passed in. For custom filters, Vue.js checks for computed filters by looking for references to `this` in a filter's function body. Any directive that uses a computed filter will be automatically compiled as an expression so its filters are included in the dependency collection process.

If you find the concept of computed filters confusing at the moment, don't worry. It is handled automatically by Vue.js and you don't really need to know how it works to leverage it. As you get familiar with more related concepts, it will all make sense.

Now that you know everything about directives and filters, let's talk about how to [display a list of items](/guide/list.html).