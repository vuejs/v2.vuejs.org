---
title: V-bind en Clases y Estilos
type: guide
order: 6
---

Una necesidad común para usar `v-bind` con los datos es manipular la lista de clases de un elemento, así como sus estilos en línea. Como ambos son atributos, podemos usar `v-bind` para controlarlos: sólo debemos calcular un string final con nuestras expresiones. Sin embargo, trabajar con concatenaciones de strings es molesto y propenso a errores. Por esta razón, Vue ofrece mejoras especiales cuando `v-bind` es usado junto con `class` and `style`. En adición a strings, las expresiones pueden también ser evaluadas a objetos o arrays.

## V-bind en Clases HTML

### Sintaxis de Objeto

Podemos pasar un objeto a `v-bind:class` para intercambiar dinámicamente las clases:

``` html
<div v-bind:class="{ active: isActive }"></div>
```

La anterior sintaxis ilustra que la presencia de la clase `active` será determinada por el [thrutiness](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) de la propiedad `isActive`.

Puede intercambiar múltiples clases si tiene más campos en el objeto. Adicionalmente, la directiva `v-bind:class` puede coexistir con el atributo común `class`. De modo que en la siguiente plantilla:

``` html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```

Y los siguientes datos:

``` js
data: {
  isActive: true,
  hasError: false
}
```

Se va a renderizar:

``` html
<div class="static active"></div>
```

Siempre que `isActive` o `hasError` cambie, la lista de clases será actualizada acordemente. Por ejemplo, si `hasError` toma el valor `true`, la lista de clases cambiará a `"static active text-danger".`

El objeto asignado a `v-bind` no necesariamente debe ser en líenea:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

Esto mostrará el mismo resultado. También podemos usar `v-bind` con una [propiedad calculada](computed.html) que retorne un objeto. Esto es un patrón muy común y poderoso:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal',
    }
  }
}
```

### Sintaxis de Array

Podemos pasar un array a `v-bind:class` para aplicar una lista de clases:

``` html
<div v-bind:class="[activeClass, errorClass]">
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

Lo cual renderizará:

``` html
<div class="active text-danger"></div>
```

Si quisiera también intercambiar una clase en el listado de clases condicionalmente, lo puede hacer con una expresión ternaria:

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]">
```

Esto siempre aplicará `errorClass`, pero solo aplicará `activeClass` cuando `isActive` tenga valor `true`.

Sin embargo, esto puede ser un poco extenso si tiene múltiples clases condicionales. Por esto también es posible usar la sintaxis de objeto dentro de la sintaxis de array:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]">
```

### Con Componentes

> Esta sección asume conocimientos previos de [Componentes Vue](components.html). Sé libre de saltar ésta sección y regresar más adelante.

Cuando usa el atributo `class` en un componente personalizado, aquellos cambios serán adicionados al elemento raíz del componente. Las clases existentes de dicho elemento no serán sobreescritas.

Por ejemplo, si declara este componente:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

Luego agrega algunas clases mientras lo usa:

``` html
<my-component class="baz boo"></my-component>
```

El HTML renderizado será:

``` html
<p class="foo bar baz boo">Hi</p>
```

Lo mismo aplica para uso de `v-bind` en clases:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Cuando `isActive` es verdadero, el HTML renderizado será:

``` html
<p class="foo bar active"></p>
```

## V-bind en estilos en línea

### Sintaxis de objeto

La sintaxis de objetos para `v-bind:style` es bastante sencillo - casi parece CSS, excepto que es un objeto javascript. Puede usar camelCase o kebab-case para los nombres de propiedades:

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

Es a menudo una buena idea usar `v-bind` con un objeto de estilos directamente para que la plantilla sea más limpia:

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

De nuevo, la sintaxis de objeto es comúnmente usado junto con propiedades calculadas que retornan objetos.

### Sintaxis de Array

La sintaxis de array para `v-bind:style` le permite aplicar múltiples objetos de estilo al mismo elemento:

``` html
<div v-bind:style="[baseStyles, overridingStyles]">
```

### Prefijos automáticos

Cuando usa una propiedad CSS que requiera prefijos de navegador en `v-bind:style`, por ejemplo `transform`, Vue automáticamente detectará y agregará los prefijos apropiados a los estilos aplicados.
