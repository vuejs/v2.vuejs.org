title: Filters in Depth
type: guide
order: 6
---

# {{title}}

## Synopsis

```
filterId [args...]
```

## Examples

Filters can be appended to directive keypath or expressions. They are denoted by a single pipe (`|`) as in shell scripts:

``` html
<span v-text="message | capitalize"></span>
```

You can also use them inside interpolations:

``` html
<span>&#123;&#123;message | uppercase&#125;&#125;</span>
```

You can chain muliple filters together:

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