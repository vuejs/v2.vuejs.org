---
title: Propiedades
type: guide
order: 102
---

> Esta página asume que usted ya ha leído [Conceptos Básicos de Componentes](components.html). Lea eso primero si usted es nuevo con respecto a componentes.

## Formateando las "Props" (camelCase vs kebab-case)

Los nombres de atributos HTML no distinguen entre mayúsculas y minúsculas, por lo que los navegadores interpretarán los caracteres en mayúscula como en minúscula. Eso significa que cuando usa plantillas del DOM, los nombres de propiedades en formato camelCase necesitan usar sus equivalentes en formato kebab (delimitados por guiones):

``` js
Vue.component('blog-post', {
  // formato camelCase en JavaScript
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

``` html
<!-- forato kebab en HTML -->
<blog-post post-title="hola!"></blog-post>
```

Nuevamente, si está utilizando plantillas de cadenas de texto, esta limitación no se aplica.

## Tipos de propiedades

Hasta ahora, solo hemos visto los accesorios listados como un arreglo de cadenas de texto:

```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

Sin embargo, por lo general, querrá que cada propiedad sea un tipo específico de valor. En estos casos, puede enumerar las propiedades como un objeto, donde los nombres y valores de las propiedades contienen los nombres y tipos de datos, respectivamente:

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object
}
```

Esto no solo documenta su componente, sino que también advertirá a los usuarios en la consola de JavaScript del navegador si se está pasando el tipo incorrecto. Aprenderá mucho más sobre [verificaciones de tipos y otras validaciones de propiedades](#Prop-Validation) más adelante en esta página.

## Pasando propiedades estáticas o dinámicas

Hasta ahora, ha visto que las propiedades pasaban un valor estático, como en:

```html
<blog-post title="Mi viaje con Vue"></blog-post>
```

También ha visto propiedades asignadas dinámicamente con `v-bind`, como en:

```html
<!-- Asigna dinámicamente el valor de una variable -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- Asigna dinámicamente el valor de una expresión compleja. -->
<blog-post
  v-bind:title="post.title + ' por ' + post.author.name"
></blog-post>
```

En los dos ejemplos anteriores, pasamos valores de tipo cadena de texto, pero _cualquier_ tipo de valor se puede pasar a una propiedad.

### Pasando un número

```html
<!-- Aunque `42` es estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de texto. -->
<blog-post v-bind:likes="42"></blog-post>

<!-- Asigna dinámicamente el valor de una variable -->
<blog-post v-bind:likes="post.likes"></blog-post>
```

### Pasando un booleano

```html
<!-- Incluir la propiedad sin valor implicará `true` -->
<blog-post is-published></blog-post>

<!-- Aunque `false` es estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de texto. -->
<blog-post v-bind:is-published="false"></blog-post>

<!-- Asigna dinámicamente el valor de una variable. -->
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```

### Pasando un Arreglo

```html
<!-- Aunque el arreglo sea estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de texto. -->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- Asigna dinámicamente el valor de una variable -->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```

### Pasando un Objecto

```html
<!-- Aunque el objeto es estático, necesitamos v-bind para decirle a Vue que -->
<!-- es una expresión de JavaScript en vez de una cadena de texto. -->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- Asigna dinámicamente el valor de una variable -->
<blog-post v-bind:author="post.author"></blog-post>
```

### Pasando las propiedades de un objeto

Si desea pasar todas las propiedades de un objeto como props, puede usar `v-bind` sin un argumento (`v-bind` en lugar de `v-bind: prop-name`). Por ejemplo, dado un objeto `post`:

``` js
post: {
  id: 1,
  title: 'Mi viaje con vue'
}
```

La siguiente plantilla:

``` html
<blog-post v-bind="post"></blog-post>
```

Será equivalente a:

``` html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

## Flujo de datos unidireccional

Todas las `props` forman un **enlace unidireccional** entre la propiedad hija y su padre: cuando la propiedad padre se actualice, fluirá hacia la hija, pero no al revés. Esto evita que los componentes hijos muten accidentalmente el estado de los padres, lo que puede hacer que los datos de su aplicación sean más difíciles de entender.

Además, cada vez que se actualice el componente padre, todas las propiedades del componente hijo se actualizarán con el último valor. Esto significa que usted **no** debe intentar mutar una propiedad dentro de un componente hijo. Si lo haces, Vue desplegará una advertencia en la consola.

Normalmente hay dos casos en los que es tentador mutar un propiedad:

1. **La propiedad es usada para pasar en un valor inicial; el componente hijo desea usarlo como una propiedad de datos local más adelante.** En este caso, es mejor definir una propiedad de datos local que use la propiedad como su valor inicial:

  ``` js
  props: ['initialCounter'],
  data: function () {
    return {
      counter: this.initialCounter
    }
  }
  ```

2. **La propiedad se pasa como un valor crudo que debe transformarse.** En este caso, es mejor definir una propiedad computada utilizando el valor de la propiedad:

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">
  Tenga en cuenta que los objetos y las matrices en JavaScript se pasan por referencia, por lo que si la propiedad es una matriz u objeto, mutar el objeto o la matriz dentro del componente hijo **afectará** el estado del padre principal.
</p>

## Validación de la propiedad

Los componentes pueden especificar requisitos para sus propiedades, como los tipos que ya ha visto. Si no se cumple un requisito, Vue le avisará en la consola de JavaScript del navegador. Esto es especialmente útil cuando se desarrolla un componente que está destinado a ser utilizado por otros.

Para especificar validaciones de propiedades, puede proporcionar un objeto con requisitos de validación al valor de `props`, en lugar de una matriz de cadenas de texto. Por ejemplo:

``` js
Vue.component('my-component', {
  props: {
    // Comprobación de tipo básico (`null` coincide con cualquier tipo)
    propA: Number,
    // Múltiples tipos posibles
    propB: [String, Number],
    // Cadena de texto obligatoria
    propC: {
      type: String,
      required: true
    },
    // Número con un valor por defecto
    propD: {
      type: Number,
      default: 100
    },
    // Objeto con un valor por defecto
    propE: {
      type: Object,
      // Los valores predeterminados del objeto o matriz deben devolverse desde
      // una función de fábrica
      default: function () {
        return { message: 'hola' }
      }
    },
    // Función de validación personalizada
    propF: {
      validator: function (value) {
        // El valor debe coincidir con una de estas cadenas de texto
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

Cuando falla la validación de propiedades, Vue producirá una advertencia de consola (si se usa la versión de desarrollo).

<p class="tip">
  Tenga en cuenta que las propiedades se validan **antes** de que se cree una instancia de componente, por lo que las propiedades de la instancia (por ejemplo, `data`, `computed`, etc.) no estarán disponibles dentro de las funciones `default` o `validator`.
</p>

### Tipos de la validación

El tipo (`type`) puede ser uno de los siguientes constructores nativos:

- String (Cadena de Texto)
- Number (Número)
- Boolean (Booleano)
- Array (Arreglo)
- Object (Objeto)
- Date (Fecha)
- Function (Función)
- Symbol (Símbolo)

Además, `type` también puede ser una función constructora personalizada y la aserción se realizará con una comprobación` instanceof`. Por ejemplo, dada la siguiente función constructora existe:

```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

Usted podría usar:

```js
Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

para validar que el valor de la propiedad `author` fue creado con `new Person`.

## Atributos no propiedades

Un atributo que no es de propiedad es un atributo que se pasa a un componente, pero no tiene definida una propiedad correspondiente.

Si bien las propiedades definidas explícitamente se prefieren para pasar información a un componente hijo, los autores de las librerías de componentes no siempre pueden prever los contextos en los que se pueden usar sus componentes. Es por eso que los componentes pueden aceptar atributos arbitrarios, que se agregan al elemento raíz del componente.

Por ejemplo, imagine que estamos usando un componente `bootstrap-date-input` de terceros con un complemento Bootstrap que requiere un atributo` data-date-picker` en el `input`. Podemos agregar este atributo a nuestra instancia de componente:

``` html
<bootstrap-date-input data-date-picker="activated"></bootstrap-date-input>
```

Y el atributo `data-date-picker="activated"` automáticamente será agregado al elemento raíz `bootstrap-date-input`.

### Reemplazando/fusionando con atributos existentes

Imagine esta es la plantilla para `bootstrap-date-input`:

``` html
<input type="date" class="form-control">
```

Para especificar un tema para nuestro complemento de selector de fecha, podríamos necesitar agregar una clase específica, como esta:

``` html
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>
```

En este caso, se definen dos valores diferentes para `class`:

- `form-control`, que se establece por el componente en su plantilla
- `date-picker-theme-dark`, que se pasa al componente por su padre

Para la mayoría de los atributos, el valor proporcionado al componente reemplazará el valor establecido por el componente. Entonces, por ejemplo, pasar `type="text"` reemplazará a `type ="date"` y probablemente lo rompa! Afortunadamente, los atributos `class` y` style` son un poco más inteligentes, por lo que ambos valores se fusionan, haciendo que el valor final sea: `form-control date-picker-theme-dark`.

### Deshabilitar la herencia de atributos

Si **no** quiere que el elemento raíz de un componente herede los atributos, puede establecer `inheritAttrs: false` en las opciones del componente. Por ejemplo:

```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```

Esto puede ser especialmente útil en combinación con la propiedad de instancia `$attrs`, que contiene los nombres de atributos y valores pasados a un componente, como:

```js
{
  class: 'username-input',
  placeholder: 'Ingrese su nombre de usuario'
}
```

Con `inheritAttrs: false` y` $attrs`, puede decidir manualmente a qué elemento desea enviar los atributos, lo que a menudo es deseable para [componentes básicos](../style-guide/#Base-component-names-strongly-recommended):

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

Este patrón le permite usar componentes básicos más como elementos HTML crudos, sin tener que preocuparse por qué elemento está realmente en su raíz:

```html
<base-input
  v-model="username"
  class="username-input"
  placeholder="Ingrese su nombre de usuario"
></base-input>
```
