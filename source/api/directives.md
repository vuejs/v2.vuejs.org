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

Updates the element's `innerHTML`.

<p class="tip">Using `v-html` with user-supplied data can be dangerous. It is suggested that you only use `v-html` when you are absolutely sure about the security of the data source, or pipe it through a custom filter that sanitizes untrusted HTML.</p>

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

Internally, &#123;&#123; Mustache &#125;&#125; interpolations inside attributes are compiled into computed `v-attr` directives.

<p class="tip">You should use `v-attr` instead of mustache binding when setting the `src` attribute on `<img>` elements. Your templates are parsed by the browser before being compiled by Vue.js, so the mustache binding will cause a 404 when the browser tries to fetch it as the image's URL.</p>

### v-style

- This directive requires one optional argument.

Apply inline CSS styles to the element.

When there is no argument, Vue.js will use the value to set `el.style.cssText`.

When there is an argument, it will be used as the CSS property to apply. Combined with multiple clause you can set multiple properties together:

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

### v-repeat

- This directive requires the value to be Array or falsy.
- This directive creates child ViewModels.
- This directive can trigger transitions.

Create a child ViewModel for every item in the binding Array. These child ViewModels will be automatically created / destroyed when mutating methods, e.g. `push()`, are called on the Array. For more details see [Displaying a List](/guide/list.html).

### v-with

- This directive creates child ViewModels.
- This directive accepts only keypaths, no expressions.

Compile this element as a child ViewModel, inheriting data from the parent. You can either pass in an Object which will be used as the `data` option, or bind individual parent properties to the child with different keys. This directive can be used in combination with `v-component`.

Example inheriting an object:

``` js
// parent data looks like this
{
    user: {
        name: 'Foo Bar',
        email: 'foo@bar.com'
    }
}
```

``` html
<div v-with="user">
    <!-- you can access properties without `user.` -->
    {&#123;name&#125;} {&#123;email&#125;}
</div>
```

Example inehriting individual properties (using the same data):

``` 
<div v-with="myName : user.name, myEmail: user.email">
    <!-- you can access properties with the new keys -->
    {&#123;myName&#125;} {&#123;myEmail&#125;}
</div>
```

### v-view

- This directive creates child ViewModels.
- This directive can trigger transitions.

Conditionally instantiate ViewModels, using the bound value as the Component ID to look up constructors with. When the bound value changes, existing ViewModel will be destroyed and a new ViewModel will be created. When a ViewModel is created, the original element will be replaced, but all attributes will be copied to the new element. For more details, see [Routing](/guide/application.html#routing).

## Literal Directives

> Literal directives treat their attribute value as a plain string; they do not attempt to bind themselves to anything. All they do is executing the `bind()` function with the string value once. Literal directives accept mustache expressions inside their value, but these expressions will be evaludated only once on first compile and do not react to data changes.

### v-component

Compile this element as a child ViewModel with a registered component constructor. This can be used with `v-with` to inehrit data from the parent. For more details see [Composing ViewModels](/guide/composition.html).

### v-ref

Only respected when used in combination with `v-component`, `v-with` or `v-repeat`. The ViewModel will be accessible in its parent's `$` object, e.g. `parent.$[id]`. When used with `v-repeat`, the value will be an Array containing the child ViewModel instances corresponding to the Array they are bound to. For examples see [Accessing Child Components](/guide/composition.html#accessing-child-components).

### v-partial

Replace the element's innerHTML with a registered partial. Partials can be registered with `Vue.partial()` or passed inside the `partials` option. You can also use this syntax (which doesn't support expressions):

``` html
<div>&#123;&#123;> my-partial&#125;&#125;</div>
```

### v-effect

Apply a registered JavaScript effect to the element. JavaScript effects can be registered with `Vue.effect()` or passed inside the `effects` option.

For details, see [the guide](/guide/transitions.html#javascript-functions).

## Empty Directives

> Empty directives do not require and will ignore their attribute value.

### v-transition

Notify Vue.js to apply transition CSS classes to this element. The transition classes are applied when certain transition-triggering directives modifies the element, or when the ViewModel's DOM manipulation methods are called.

For details, see [the guide](/guide/transitions.html#css-transitions).

### v-animation

Notify Vue.js to apply animation CSS classes to this element. The order of CSS class application is different from `v-transition`.

For details, see [the guide](/guide/transitions.html#css-animations).

### v-pre

Skip compilation for this element and all its children. Skipping large amount of nodes with no directives on them can speed up compilation.

### v-cloak

This property remains on the element until the associated ViewModel finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the ViewModel is ready.