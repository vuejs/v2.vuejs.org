---
title: Enlace de Clases y Estilos
type: guide
order: 6
---

Una necesidad común para atar los datos es manipulando la lista de clases de un elemento y sus estilos en línea. Dado que ambos son atributos, podemos usar `v-bind` para manipularlos: Solo necesitamos calcular una cadena final de nuestras expresiones. Sin embargo, involucrarse con concatenación de cadenas es molesto y propenso a errores. Por esta razón, Vue brinda mejoras especiales, cuando `v-bind` es usado con `class` y `style`. Además de las cadenas, las expresiones también pueden evaluar objetos o arreglos.

## Enlace de Clases HTML

### Sintaxis de Objetos

Podemos pasar un objeto a `v-bind:class` para dinámicamente cambiar las clases:

``` html
<div v-bind:class="{ active: isActive }"></div>
```

La anterior sintaxis significa que la presencia de la clase `active` será determinada por la [truthiness](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) de la propiedad de datos `isActive`.

Puedes tener varias clases activadas teniendo más campos en el objeto. Además, la directiva `v-bind:class` puede también co-existir con el atributo plano `class`. Así que dada la siguiente plantilla:

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

Lo anterior mostrará:

``` html
<div class="static active"></div>
```

Cuándo `isActive` o `hasError` cambian, la lista de clases en consecuencia se actualizarán. Por ejemplo, si `hasError` se vuelve `true`, la lista de clases se convertirán en `"static active text-danger"`.

El objeto enlazado no tiene que estar en línea:

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

Esto va mostrar el mismo resultado. También podemos vincularlos a una [propiedad computada](computed.html) que devuelve un objeto. Esto es un patrón común y poderoso:

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

### Sintaxis de Arreglos

Podemos pasar un arreglo a `v-bind:class` para aplicar una lista de clases:

``` html
<div v-bind:class="[activeClass, errorClass]"></div>
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

Lo cual va mostrar:

``` html
<div class="active text-danger"></div>
```

Si también quieres puedes cambiar una lista de clases condicionalmente, lo puedes hacer con una expresión ternaria:

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

Esto siempre se aplicará`errorClass`, pero solo aplicará `activeClass` cuando `isActive` es `true`.

Sin embargo, esto puede ser muy detallado si varias clases condicionadas. Esto es porque también es posible usar la sintaxis de un objeto dentro de la sintaxis de un arreglo:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### Con componentes

> Esta sección asume que tienes conocimiento de [Componentes Vue](components.html). Siéntete libre de saltártela y volver después.

Cuando usas el atributo `class` en un componente personalizado, estas clases serán agregadas a el elemento raíz del componente. Clases existentes en este elemento no serán sobreescritas.

Por ejemplo, si tu declaras este componente:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

Entonces agrega algunas clases cuando uses esto:

``` html
<my-component class="baz boo"></my-component>
```

El HTML renderizado será:

``` html
<p class="foo bar baz boo">Hi</p>
```

Lo mismo pasa para enlazar clases:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Cuando `isActive` es verdadero, el HTML renderizado será:

``` html
<p class="foo bar active">Hi</p>
```

## Enlazando Estilos en Línea

### Sintaxis de Objetos

La sintaxis para el objeto `v-bind:style` es bastante sencillo - es parecido a CSS, excepto que esto es un objeto Javascript. Puedes usar CamelCase o kebab-case (usa comillas con kebab-case) para las propiedades de CSS:

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

De vez en cuando es una buena idea enlazar objetos con estilos directamente para que la plantilla este más limpia:

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

De nuevo, la sintaxis de objeto de vez en cuando es usada en conjunto con propiedades computadas que devuelven objetos.

### Sintaxis de arreglos

La sintaxis de arreglos para `v-bind:style` te permite aplicar múltiples objetos con estilos a el mismo elemento:

``` html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### Auto-prefijo

Cuando usas una propiedad de CSS que requiere [vendor prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) en `v-bind:style`, por ejemplo `transform`, Vue detectará automáticamente y agrega apropiadamente los prefijos a los estilos aplicados.

### Varios Valores

> 2.3.0+

Comenzando en 2.3.0+ puedes proporcionar un arreglo de varios valores (prefijos) a una propiedad de estilos, por ejemplo:

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Esto solo mostrará el último valor en el arreglo el cual el navegador soporta. En este ejemplo, esto mostrará `display: flex` para navegadores que soporte la versión de flexbox sin prefijo.
