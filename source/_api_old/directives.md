---
title: Directives
type: api
order: 6
---

## Reactive Directives

> These directives can bind themselves to a property on the Vue instance, or to an expression which is evaluated in the context of the instance. When the value of the underlying property or expression changes, the `update()` function of these directives will be called asynchronously on next tick.

### v-text

Updates the element's `textContent`.

Internally, &#123;&#123; Mustache &#125;&#125; interpolations are also compiled as a `v-text` directive on a textNode.

### v-html

Updates the element's `innerHTML`.

<p class="tip">Using `v-html` with user-supplied data can be dangerous. It is suggested that you only use `v-html` when you are absolutely sure about the security of the data source, or pipe it through a custom filter that sanitizes untrusted HTML.</p>

### v-show

- This directive can trigger transitions.

Set the element's display to `none` or its original value, depending on the truthy-ness of the binding's value.

### v-class

- This directive accepts an optional argument.

If no argument is provided, it will add the binding's value to the element's classList, and update the class as the value changes.

If a directive argument is provided, the argument will be the class to be toggled depending on the binding value's truthy-ness. Combined with multiple clauses this can be pretty useful:

``` html
<span v-class="
  red    : hasError,
  bold   : isImportant,
  hidden : isHidden
"></span>
```

Alternatively, you can bind the directive directly to an Object. The keys of the object will be the list of classes to toggle based on corresponding values.

### v-attr

- This directive requires an argument.

Updates the element's given attribute (indicated by the argument).

**Example:**

``` html
<canvas v-attr="width:w, height:h"></canvas>
```

Falsy values except 0 will remove the attribute.

Alternatively, you can bind the directive directly to an Object. The keys of the object will be the list of attributes to set based on corresponding values.

Internally, &#123;&#123; Mustache &#125;&#125; interpolations inside attributes are compiled into computed `v-attr` directives.

Starting in 0.12.9, when used on input elements' `value` attribute, `v-attr` now updates the corresponding `value` property on the element instead of the attribute. For example, `<input value="{% raw %}{{val}}{% endraw %}">` will update the underlying JavaScript property instead of the attribute.

<p class="tip">You should use `v-attr` instead of mustache binding when setting the `src` attribute on `<img>` elements. Your templates are parsed by the browser before being compiled by Vue.js, so the mustache binding will cause a 404 when the browser tries to fetch it as the image's URL.</p>

### v-style

- This directive accepts an optional argument.

Apply inline CSS styles to the element.

When there is no argument, the bound value can either be a String or an Object.

- If it's a String, it will be set as the element's `style.cssText`.
- If it's an Object, each key/value pair will be set on the element's `style` object.

**Example:**

``` html
<div v-style="myStyles"></div>
```

``` js
// myStyles can either be a String:
"color:red; font-weight:bold;"
// or an Object:
{
  color: 'red',
  // both camelCase and dash-case works
  fontWeight: 'bold',
  'font-size': '2em'
}
```

When there is an argument, it will be used as the CSS property to apply. Combined with multiple clauses you can set multiple properties together:

**Example:**

``` html
<div v-style="
  top: top + 'px',
  left: left + 'px',
  background-color: 'rgb(0,0,' + bg + ')'
"></div>
```

`v-style` is also smart to detect any required browser vendor prefixes, so you can just use the un-prefixed version:

``` html
<!-- will use -webkit-transform if needed, for example -->
<div v-style="transform: 'scale(' + scale + ')'"></div>
```

<p class="tip">It is recommended to use `v-style` instead of mustache bindings inside `style` attribute because Internet Explorer, regardless of version, will remove invalid inline styles when parsing the HTML.</p>

### v-on

- This directive requires an argument.
- This directive requires the value to be a Function or a statement.

Attaches an event listener to the element. The event type is denoted by the argument. It is also the only directive that can be used with the `key` filter. For more details see [Listening for Events](/guide/events.html).

### v-model

- This directive can only be used on `<input>`, `<select>` or `<textarea>` elements.
- Directive params: [`lazy`](/guide/forms.html#Lazy_Updates), [`number`](/guide/forms.html#Casting_Value_as_Number), [`options`](/guide/forms.html#Dynamic_Select_Options), [`debounce`](/guide/forms.html#Input_Debounce)

Create a two-way binding on a form input element. Data is synced on every `input` event by default. For detailed examples see [Handling Forms](/guide/forms.html).

### v-if

- This directive can trigger transitions.

Conditionally insert / remove the element based on the truthy-ness of the binding value. If the element is a `<template>` element, its content will be extracted as the conditional block.

**Example:**

``` html
<template v-if="test">
  <p>hello</p>
  <p>world</p>
</template>
```

Will render:

``` html
<!--v-if-start-->
<p>hello</p>
<p>world</p>
<!--v-if-end-->
```

### v-repeat

- This directive creates child Vue instances.
- This directive requires the value to be an Array, Object or Number.
- This directive can trigger transitions.
- This directive accepts an optional argument.
- Directive params: [`track-by`](/guide/list.html#Using_track-by), [`stagger`](/guide/transitions.html#Staggering_Transitions), [`enter-stagger`](/guide/transitions.html#Staggering_Transitions), [`leave-stagger`](/guide/transitions.html#Staggering_Transitions)

Create a child ViewModel for every item in the binding Array or Object. If the value is a whole Number then that many child ViewModels are created. These child ViewModels will be automatically created / destroyed when mutating methods, e.g. `push()`, are called on the Array or Object, or the number is increased or decreased.

When no argument is provided, the child ViewModel will directly use the assigned element in the Array as its `$data`. If the value is not an object, a wrapper data object will be created and the value will be set on that object using the alias key `$value`.

**Example:**

``` html
<ul>
  <li v-repeat="users">
    {{name}} {{email}}
  </li>
</ul>
```

If an argument is provided, a wrapper data object will always be created, using the argument string as the alias key. This allows for more explicit property access in templates:

``` html
<ul>
  <li v-repeat="user : users">
    {{user.name}} {{user.email}}
  </li>
</ul>
```

Starting in 0.12.8, a special alternative is available to make the syntax more natural:

``` html
<ul>
  <li v-repeat="user in users">
    {{user.name}} {{user.email}}
  </li>
</ul>
```

For detailed examples, see [Displaying a List](/guide/list.html).

## Literal Directives

> Literal directives treat their attribute value as a plain string; they do not attempt to bind themselves to anything. All they do is executing the `bind()` function once. Literal directives can also accept mustache expressions inside their value - please refer to [Dynamic Literal](/guide/custom-directive.html#Dynamic_Literal) for more details.

### v-transition

- Can be made reactive with mustaches

Notify Vue.js to apply transitions to this element. The transition classes are applied when certain transition-triggering directives modify the element, or when the Vue instance's DOM manipulation methods are called.

For details, see [the guide on transitions](/guide/transitions.html).

### v-ref

Register a reference to a child component on its parent for easier access. Only respected when used on a component or with `v-repeat`. The component instance will be accessible on its parent's `$` object. For an example, see [child reference](/guide/components.html#Child_Reference).

When used with `v-repeat`, the value will be an Array containing all the child Vue instances corresponding to the Array they are bound to.

New in 0.12: If the `v-repeat`'s source data is an Object, then `v-ref` will return an Object with instances matching each key in the Object.

### v-el

Register a reference to a DOM element on its owner Vue instance for easier access. e.g. `<div v-el="hi">` will be accessible as `vm.$$.hi`.

## Empty Directives

> Empty directives do not require and will ignore their attribute value.

### v-pre

Skip compilation for this element and all its children. Skipping large numbers of nodes with no directives on them can speed up compilation.

### v-cloak

This property remains on the element until the associated ViewModel finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the ViewModel is ready.
