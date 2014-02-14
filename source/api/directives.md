title: Directives
type: api
order: 6
---

## Data Binding Directives

> These directives can bind themselves to a property on the ViewModel, or to an expression which is evaluated in the context of the ViewModel. When the value of the underlying property or expression changes, the `update()` function of these directives will be called asynchronously on next tick.

### v-text

Updates the element's `textContent`.

Internally, &#123;&#123; Mustache &#125;&#125; interpolations are also compiled as a `v-text` direcitve on a textNode.

### v-html

Updates the element's `innerHTML`. Use with caution and avoid binding this to a user-supplied value.

### v-show

- This directive can trigger transitions.

Set the element's display to `none` or its original value, depending on the truthy-ness of the binding's value.

### v-class

- This directive takes an optional argument.

If no argument is provided, it will add the binding's value to the element's classList, and update the class as the value changes.

If a directive argument is provided, the argument will be the class to be toggled depending on the binding value's truthy-ness. Combined with multiple clauses this can be pretty useful:

``` html
<span v-class="
    red    : hasError,
    bold   : isImportant,
    hidden : isHidden
"></span>
```

### v-attr

- This directive requires exactly one argument.

Updates the element's given attribute (indicated by the argument).

**Example:**

``` html
<canvas v-attr="width:w, height:h"></canvas>
```

Internally, &#123;&#123; Mustache &#125;&#125; interpolations inside attributes are compiled into computed `v-attr` directives. One special case you might want to use this instead of interpolation is when setting the `src` attribute on `<img>` elements. If you use interpolation for `src` and the element is inserted into the DOM before being compiled, the browser will make a failed http request trying to fetch the image.

### v-style

- This directive requires exactly one argument.

Apply inline CSS styles to the element. The argument is the CSS property to apply.

**Example:**

``` html
<div v-style="
    top: top + 'px',
    left: left + 'px',
    background-color: 'rgb(0,0,' + bg + ')'
"></div>
```

When the argument is prefixed with `$`, Vue.js will automatically apply prefixed version of the CSS rule too, so you don't have to manually write all the prefixes inline. In the following example Vue.js will apply `transform`, `webkitTransform`, `mozTransform` and `msTransform`:

``` html
<div v-style="$transform: 'scale(' + scale + ')'"></div>
```

<p class="tip">It is recommended to use `v-style` instead of mustache bindings inside `style` attribute because Internet Explorer, regardless of version, will remove invalid inline styles when parsing the HTML.</p>

### v-repeat

- This directive requires the value to be Array or falsy.
- This directive can trigger transitions.

Create a child ViewModel for every item in the binding Array. These child ViewModels will be automatically created / destroyed when mutating methods, e.g. `push()`, are called on the Array. For more details see [Displaying a List](/guide/list.html).

### v-on

- This directive requires exactly one argument.
- This directive requires the value to be a Function or an expression.

Attaches an event listener to the element. The event type is denoted by the argument. It is also the only directive that can be used with the `key` filter. For more details see [Listening for Events](/guide/events.html).

### v-model

- This directive can only be used on INPUT, SELECT, TEXTAREA and elements with `contenteditable` attribute.

Create a two-way binding on a form or editable element. Data is synced on every `input` event by default. When the ViewModel has the `lazy` option set to true, data will be synced only on `change` events. For more details see [Handling Forms](/guide/forms.html).

### v-if

- This directive can trigger transitions.

Conditionally insert / remove the element based on the truthy-ness of the binding value.

### v-with

- This directive requires the value to be an Object or falsy.
- You cannot use expressions with this directive.

Compile this element as a child ViewModel, using the binding value as the `data` option. Inside the template you can directly access properties on the binding value. This can be used in combination with `v-component`.

Suppose our data looks like this:

``` js
{
    user: {
        name: 'Foo Bar',
        email: 'foo@bar.com'
    }
}
```

You can simplify the template like this:

``` html
<div v-with="user">
    {&#123;name&#125;} {&#123;email&#125;}
</div>
```

## Literal Directives

> Literal directives treat their attribute value as a plain string; they do not attempt to bind themselves to anything. All they do is executing the `bind()` function with the string value once.

### v-component

- This directive takes a registered asset id.

Compile this element as a child ViewModel with a registered component constructor. This can be used with `v-with` to inehrit data from the parent. For more details see [Composing ViewModels](/guide/composition.html).

### v-component-id

- This directive takes a registered asset id.

Only respected when used in combination with `v-component`, `v-with` or `v-repeat`. The ViewModel will be accessible in its parent's `$` object, e.g. `parent.$[id]`. When used with `v-repeat`, the value will be an Array containing the child ViewModel instances corresponding to the Array they are bound to. For examples see [Accessing Child Components](/guide/composition.html#Accessing_Child_Components).

### v-transition

- This directive takes an optional registered asset id.

When no value is provided, Vue.js will apply CSS transition classes to this element when adding / removing this element to / from the DOM.

When an id is provided, Vue.js will execute the registered enter / leave functions before the DOM operations take place.

Transitions are applied when certain transition-triggering directives modifies the element, or when the ViewModel's DOM manipulation methods are called.

For details, see [Adding Transition Effects](/guide/transitions.html).

### v-partial

- This directive takes a registered asset id.

Replace the element's innerHTML with a registered partial. You can also use this syntax:

``` html
<div>&#123;&#123;> my-partial&#125;&#125;</div>
```

## Empty Directives

Empty directives ignore their attribute value.

### v-pre

Skip compilation for this element and all its children. Skipping large amount of nodes with no directives on them can speed up compilation.

### v-cloak

This property remains on the element until the associated ViewModel finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the ViewModel is ready.