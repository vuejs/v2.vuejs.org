---
title: Enlace Clases y Estilos
type: guide
order: 6
---

Una necesidad común de data binding es manipular la lista de clases de un elemento y sus estilos en línea. Como ambos son atributos, podemos usar `v-bind` para manejarlos: solo necesitamos crear una cadena de texto con nuestras expresiones. Sin embargo, concatenar cadenas de texto puede llegar a ser incómodo y propenso a errores. Por esta razón, Vue proporciona mejoras cuando se utiliza `v-bind` con` class` y `style`. Además de las cadenas de texto, las expresiones también pueden evaluar objetos o matrices.

## Enlace de clases HTML

### Sintaxis de Objeto

Podemos pasar un objeto a `v-bind:class` para la asignación dinámica de clases:

``` html
<div v-bind:class="{ active: isActive }"></div>
```

La sintaxis de arriba tiene como resultado la clase `active` según el valor booleano(https://developer.mozilla.org/en-US/docs/Glossary/Truthy) de la propiedad `isActive`.

Puede hacer multiple asingación de clases al tener más campos en el objeto. Además, la directiva `v-bind:class` también puede ser utilizada con el atributo `class`. De modo que con la siguiente plantilla:

``` html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```

Y el siguiente objeto `data`:

``` js
data: {
  isActive: true,
  hasError: false
}
```

Se rendizará:

``` html
<div class="static active"></div>
```

Cuando `isActive` o `hasError` cambien, la lista de clases se actualizará consecuentemente. Por ejemplo, si `hasError` se convierte en `true`, la lista de clases se convertirá en `"static active text-danger"`.

El objecto no tiene por qué estar inline:

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

Esto renderizará el mismo resultado. También podemos enlazar una [propiedad computada](computed.html) que retorna un objeto. Esto es un patrón común y poderoso:

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
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### Sintaxis de colección

Pasamos una colección a `v-bind:class` para aplicar una lista de clases:

``` html
<div v-bind:class="[activeClass, errorClass]"></div>
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

Que renderizará:

``` html
<div class="active text-danger"></div>
```

Si le gustaría activar una clase en la lista de manera condicional, usted puede hacerlo con una expresión ternaria:

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

Esto siempre aplicará `errorClass`, pero solo aplicará `activeClass` cuando `isActive` sea verdadero.

Sin embaro, esto puede ser un poco verboragico si usted tiene multiple clases condicionales. Por eso también es posible utilizar la sintaxis de objeto dentro de la sintaxis de colección:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### Con Componentes

> Esta sección asume que usted tiene conocimientos sobre [Componentes de Vue](components.html). Siéntase libre de saltearla y volver más tarde.

Cuando usa el atributo `class` en un componente personalziado, estas clases se agregarán al elemento raíz del componente. Las clases existentes en este elemento no serán sobreescritas.

Por ejemplo, si declara este componente:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

Y agrega algunas clases al usarlo:

``` html
<my-component class="baz boo"></my-component>
```

El HTML renderizado será:

``` html
<p class="foo bar baz boo">Hi</p>
```

Lo mismo aplica para el enlace de clases:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Cuando `isActive` es verdadero, el HTML renderizado será:

``` html
<p class="foo bar active">Hi</p>
```

## Enlace de Estilos inline

### Sintaxis de objeto

La sintaxis de objeto para `v-bind:style` es muy sencilla - es similar a CSS, excepto que es un objecto JavaScript. Puede usar tanto camelCase como kebab-case (use comillas con kebab-case) para los nombres de propiedades CSS:

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

A menudo es una buena idea enlazar directamente un objeto de estilo para que la plantilla sea más limpia:

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

Nuevamente, la sintaxis de objeto es a menudo usada en conjunción con propiedades computadas que retornan objetos.

### Sintaxis de Array

La sintaxis de array `v-bind:style` permite aplicar multimple objetos de estilo al mimsmo elemento:

``` html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### Auto-prefijado

Cuando utilice una propiedad CSS que requiere [vendor prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) en `v-bind:style`, como por ejemplo `transform`, Vue detectará automaticamente y agregará los correspondientes prefijos a los estilos aplicados.

### Valores múltiples

> 2.3.0+

Desde la versión 2.3.0+ usted puede proveer un array de valores múltiples (de prefijos) a una propiedad de estilo, por ejemplo:

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Esto solo renderizará el ultimo valor en el array que el navegador soporte. En este ejemplo, se renderizará `display: flex` para los navegadores que soportan la versión sin prefijo de flexbox.
