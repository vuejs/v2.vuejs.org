---
title: Filters
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
<span>{{message | uppercase}}</span>
```

Multiple filters can be chained together:

``` html
<span>{{message | lowercase | reverse}}</span>
```

## Arguments

Some filters can take optional arguments. Arguments are separated by spaces:

``` html
<span>{{order | pluralize 'st' 'nd' 'rd' 'th'}}</span>
```

``` html
<input v-on="keyup: submitForm | key 'enter'">
```

Plain string arguments need to be enclosed in quotes. Non-quoted arguments will be evaluated dynamically against the current data scope, and we will discuss them in more details later when we talk about custom filters.

For their specific use of the above examples see the [full list of built-in filters](/api/filters.html).

Now that you know what directives and filters are, let's get our hands dirty and try to [display a list of items](/guide/list.html).
