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

- this filter takes one optional argument

*12345 => $12,345.00*

You can pass an optional argument which will be used as the currency symbol (default is $).

### pluralize

- this filter takes at least one argument

*1 => '1 item'*  
*2 => '2 items'*

When there is exactly one arg, plural forms simply add an "s" at the end. When there are more than one argument, the arguments will be used as array of strings corresponding to the single, double, triple ... forms of the word to be pluralized. When the number to be pluralized exceeds the length of the args, it will use the last entry in the array.

**Example:**

``` html
<span v-text="date | st nd rd th"></span>
```

Will result in:

*1 => '1 st'*  
*2 => '2 nd'*
*3 => '3 rd'*
*4 => '4 th'*
*5 => '5 th'*

### key

- this filter only works in `v-on`
- this filter takes exactly one argument

Wrap the handler so it only gets called when the keyCode matches the argument. You can also use string aliases for a few commonly-used keys:

- enter
- tab
- delete
- esc
- up
- down
- left
- right

**Example:**

``` html
<input v-on="keyup:doSomething | key enter">
```

`doSomething` will only be called when the Enter key is pressed.