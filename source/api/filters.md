title: Filters
type: api
order: 7
---

# {{title}}

### capitalize

*'abc' => 'Abc'*

### uppercase

*'abc' => 'ABC'*

### lowercase

*'ABC' => 'abc'*

### currency

*12345 => $12,345.00*

### pluralize

- this filter takes at least one argument

*'item' => 'item' or 'items'*

The arguments can be an array of strings corresponding to the single, double, triple ... forms of the word to be pluralized. When the number to be pluralized exceeds the length of the args, it will use the last entry in the array.

### key

- this filter only works in `v-on`
- this filter takes exactly one argument

Wrap the handler so it only gets called when the keyCode matches the argument.