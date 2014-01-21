title: Filters in Depth
type: guide
order: 8
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