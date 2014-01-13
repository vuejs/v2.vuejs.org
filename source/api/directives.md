title: Directives
type: api
order: 6
---

# {{title}}

### v-text

Updates the element's `textContent`. &#123;&#123; Mustache &#125;&#125; style interpolations are also compiled as a `v-text` direcitve on a textNode.

### v-html

Updates the element's `innerHTML`. Use with caution and avoid binding this to a user-supplied value.

### v-show

- This directive can trigger transitions.

Set the element's display to `none` or its original value, depending on the truthy-ness of the binding's value.

### v-class

- This directive takes an optional argument.

If no argument is provided, it will add the binding's value to the element's classList, and update the class as the value changes.

If a directive argument is provided, the argument will be the class to be toggled depending on the binding value's truthy-ness.

### v-attr

- This directive requires an argument.

### v-on

- This directive requires an argument.

### v-if

- This directive can trigger transitions.

### v-model

- This directive can only be used on INPUT, SELECT, TEXTAREA and elements with `contenteditable` attribute.

### v-repeat

- This directive requires the value to be Array or falsy.
- This directive can trigger transitions.

### v-with

- This directive requires the value to be an Object or falsy.

### v-component

- This directive takes a registered asset id.

### v-component-id

- This directive takes a registered asset id.

### v-transition

- This directive takes a registered asset id.

### v-partial

- This directive takes a registered asset id.

### v-pre

- This directive is an empty direcitve (it doesn't need a keypath or expression)