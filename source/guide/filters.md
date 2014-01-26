title: Filters in Depth
type: guide
order: 4
---

# {{title}}

## Synopsis

A Vue.js filter is denoted by a single pipe (`|`) and can be followed by one or more arguments:

``` js
| filterId [args...]
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

The filter function also takes a second argument, which is an Array of optional arguments.

``` js
Vue.filter('wrap', function (value, args) {
    return args[0] + value + args[1]
})
```

``` html
<!--
    'hello' => 'before hello after'
-->
<span v-text="message | wrap before after"></span>
```

Now that you know everything about directives and filters, let's talk about how to [display a list of items](/guide/list.html).