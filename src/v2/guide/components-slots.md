---
title: Slots
type: guide
order: 104
---

> Esta página asume que ya ha leído [Conceptos Básicos de Componentes](components.html). Léalo primero si es nuevo con respecto a componentes.

> En 2.6.0 introdujimos una nueva sintaxis unificada (la directiva `v-slot`) para los slots con nombre y scope. Esta sustituye los atributos "slot" y "slot-scope", que ahora están obsoletos, pero que _no_ han sido eliminados y todavía están documentados [aquí](#Sintaxis obsoleta). La razón para introducir la nueva sintaxis se describe en este [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md).

## Contenido del Slot

Vue implementa una API de distribución de contenido que se modela después del [Borrador de especificaciones de componentes web](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) actual, usando el elemento `<slot>` para servir como puntos de distribución para el contenido.

Esto le permite componer componentes como este:

``` html
<navigation-link url="/profile">
  Su Perfil
</navigation-link>
```

Luego en la plantilla para `<navigation-link>`, es posible que usted tenga:

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

Cuando el componente renderiza, el elemento `<slot>` será reemplazado por "Su Perfil". Los Slots pueden contener cualquier plantilla de código, incluyendo HTML:

``` html
<navigation-link url="/profile">
  <!-- Añadir un ícono de Font Awesome -->
  <span class="fa fa-user"></span>
  Su Perfil
</navigation-link>
```

O incluso otros componentes:

``` html
<navigation-link url="/profile">
  <!-- Use un componente para agregar un ícono -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Su Perfil
</navigation-link>
```

Si `<navigation-link>` **no** contiene un elemento `<slot>`, cualquier contenido que se le pase será simplemente descartado.

## Scope de compilación

Cuando desee utilizar datos dentro de un slot, como en:

```html
<navigation-link url="/profile">
  Inició sesión como {{ nombre.de.usuario }}
</navigation-link>
```

Ese slot tiene acceso a las mismas propiedades de instancia (es decir, el mismo `scope`) que el resto de la plantilla. El slot _no_ tiene acceso al _scope_ de `<navigation-link>`. Por ejemplo, intentar acceder a `url` no funcionaría:

```html
<navigation-link url="/profile">
  Haciendo clic aquí te enviará a: {{ url }}
  <!--
  La `url` estará _undefined_, porque este contenido se pasa _a_ <navigation-link>, 
  en lugar de definirlo _dentro_ del componente <navigation-link>.
  -->
</navigation-link>
```

Como regla, recuerde esto:

> Todo en la plantilla de los padres está compilado en el _scope_ de los padres; todo en la plantilla de los hijos está compilado en el _scope_ de los hijos.

## Contenido alternativo

Hay casos en que es útil especificar el contenido alternativo (es decir, por defecto) para un slot, que se renderizará solo cuando no se proporcione ningún contenido. Por ejemplo, en un componente `<submit-button>`:

```html
<button type="submit">
  <slot></slot>
</button>
```

Podríamos querer que el texto "Enviar" se muestre la mayor parte del tiempo dentro del `<button>` . Para hacer que "Enviar" sea el contenido alternativo, podemos colocarlo entre las etiquetas `<slot>`:

```html
<button type="submit">
  <slot>Enviar</slot>
</button>
```

Ahora, cuando usamos `<submit-button>` en un componente padre, sin incluir contenido en el slot:

```html
<submit-button></submit-button>
```

renderizará el contenido alternativo, "Enviar":

```html
<button type="submit">
  Enviar
</button>
```

Pero si proporcionamos contenido:

```html
<submit-button>
  Guardar
</submit-button>
```

Entonces el contenido proporcionado será presentado en su lugar:

```html
<button type="submit">
  Guardar
</button>
```

## Slots con nombre

> Actualizado en 2.6.0+. [Ver aquí](#Sintaxis-Obsoleta) para la sintaxis obsoleta usando el atributo "slot".

Hay ocasiones en que es útil tener múltiples slots. Por ejemplo, en un componente hipotético `<base-layout>` con la siguiente plantilla:

``` html
<div class="container">
  <header>
    <!-- el contenido del encabezado aquí -->
  </header>
  <main>
    <!-- el contenido principal aquí -->
  </main>
  <footer>
    <!-- el contenido del pie de página aquí -->
  </footer>
</div>
```

Para estos casos, el elemento `<slot>` tiene un atributo especial, `name`, que puede ser usado para definir slots adicionales:

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Un `<slot>` sin `nombre` tiene implícitamente el nombre "default".

Para proporcionar contenido a los slots con nombre, podemos usar la directiva `v-slot` en un `<template>`, proporcionando el nombre del slot como argumento de `v-slot`:

```html
<base-layout>
  <template v-slot:header>
    <h1>Aquí podría ir un título de página</h1>
  </template>

  <p>Un párrafo para el contenido principal.</p>
  <p>Y otro más.</p>

  <template v-slot:footer>
    <p>Aquí va alguna información de contacto</p>
  </template>
</base-layout>
```

Ahora todo lo que está dentro de los elementos de `<template>` se pasará a los slots correspondientes. Cualquier contenido que no esté envuelto en un `<template>` usando `v-slot` se asume que es para el slot por defecto.

Sin embargo, todavía puede envolver el contenido del slot por defecto en un `<template>` si quiere ser explícito:

```html
<base-layout>
  <template v-slot:header>
    <h1>Aquí podría ir un título de página</h1>
  </template>

  <template v-slot:por defecto>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </template>

  <template v-slot:footer>
    <p>Aquí va alguna información de contacto</p>
  </template>
</base-layout>
```

De cualquier manera, el HTML renderizado será:

```html
<div class="container">
  <header>
    <h1>Aquí podría ir un título de página</h1>
  </header>
  <main>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </main>
  <footer>
    <p>Aquí va alguna información de contacto</p>
  </footer>
</div>
```

Note que **`v-slot` solo puede ser agregado a un `<template>`** (con [una excepción](#Abbreviated-Syntax-for-Lone-Default-Slots)), a diferencia del atributo obsoleto [`slot`](#Deprecated-Syntax).

## Slots con Scope

> Actualizado en 2.6.0+. [Ver aquí](#Sintaxis-Obsoleta) para la sintaxis obsoleta usando el atributo "slot-scope".

A veces, es útil para el contenido del slot tener acceso a los datos solo disponibles en el componente hijo. Por ejemplo, imagine un componente `<current-user>` con la siguiente plantilla:

```html
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```

Podríamos querer reemplazar este contenido alternativo para mostrar el nombre del usuario, en lugar del apellido, así:

```html
<current-user>
  {{ user.firstName }}
</current-user>
```

No obstante eso no funcionará, porque solo el componente <current-user> tiene acceso a _user_  y el contenido que estamos proporcionando se renderiza en el padre.

Para hacer que _user_ esté disponible para el contenido del slot en el padre, podemos vincularlo como un atributo al elemento `<slot>`:

``` html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

Las propiedades ligadas a un elemento `<slot>` se llaman **slots props**. Ahora, en el scope del padre, podemos usar `v-slot` con un valor para definir un nombre para las propiedades del slot que nos han proporcionado:

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

En este ejemplo, hemos elegido nombrar al objeto que contiene todos nuestras propiedades del slot "slotProps", pero puede usar el nombre que prefiera.

### Sintaxis abreviada para los Slots Solitarios por Defecto

En casos como el anterior, cuando _solo_ el slot por defecto se proporciona como contenido, las etiquetas del componente pueden utilizarse como plantilla del slot. Esto nos permite utilizar `v-slot` directamente en el componente:

``` html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Esto puede acortarse aún más. Así como se asume que el contenido no especificado es para el slot por defecto, se asume que el `v-slot` sin un argumento se refiere al slot por defecto:

``` html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Observe que la sintaxis abreviada del slot por defecto **no** puede mezclarse con los slots con nombre, ya que ello daría lugar a una ambigüedad en el slot:

``` html
<!-- INVÁLIDO, resultará en una advertencia -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    slotProps no está disponible aquí
  </template>
</current-user>
```

Siempre que haya múltiples slots, use la sintaxis completa en el`<template>` para _todos_ los slots:

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

### Desestructuración de las propiedades del Slot

Internamente, los slots con scope funcionan envolviendo el contenido de su scope en una función que pasa un solo argumento:

```js
function (slotProps) {
  // ... contenido del slot ...
}
```

Esto significa que el valor de `v-slot` puede aceptar cualquier expresión JavaScript válida que pueda aparecer en la posición del argumento de una definición de función. Así que en los entornos compatibles ([componentes de un solo archivo](single-file-components.html) o [navegadores modernos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)), también se puede utilizar [ES2015 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) para sacar propiedades específicas del slot , tales como:

``` html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

Esto puede hacer que la plantilla sea mucho más limpia, especialmente cuando el slot proporciona muchas propiedades. También abre otras posibilidades, como renombrar las propiedades, por ejemplo, de `user` a `person`:

``` html
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
```

Incluso puede definir las alternativas, para ser usadas en caso de que un atributo del slot no esté definido:

``` html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```
## Nombre dinámicos de los slots

> Nuevo en 2.6.0+

[Argumentos dinámicos de la directiva](syntax.html#Dynamic-Arguments) también funcionan en `v-slot`, permitiendo la definición de nombres dinámicos en los slots:

``` html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```
## Nombre abreviados de slots

> Nuevo en 2.6.0+

Similar a `v-on` y `v-bind`, `v-slot` también tiene una abreviatura, reemplazando todo antes del argumento (`v-slot:`) con el símbolo especial "#". Por ejemplo, `v-slot:header` puede ser reescrito como `#header`:

```html
<base-layout>
  <template #header>
    <h1>Aquí podría ir un título de página</h1>
  </template>

  <p>Un párrafo para el contenido principal.</p>
  <p>Y otro más.</p>

  <template #footer>
    <p>Aquí va alguna información de contacto</p>
  </template>
</base-layout>
```

Sin embargo, al igual que con otras directivas, la abreviatura solo está disponible cuando se proporciona un argumento. Eso significa que la siguiente sintaxis es inválida:

``` html
<!-- Esto activará una advertencia -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
```

En cambio, siempre debe especificar el nombre del slot si desea utilizar la abreviatura:

``` html
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
```

## Otros ejemplos

**Las propiedades de slot nos permiten convertir los slots en plantillas reutilizables que pueden mostrar diferentes contenidos basados en las propiedades de los inputs.** Esto es muy útil cuando se diseña un componente reutilizable que encapsula la lógica de los datos mientras permite al componente padre consumidor personalizar parte de su diseño.

Por ejemplo, estamos implementando un componente `<todo-list>` que contiene la lógica de diseño y filtrado para una lista:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

En lugar de _hard-code_ cada _todo_, podemos dejar que el componente padre tome el control haciendo de cada _todo_ un slot, y luego vincular `todo` como una propiedad del slot:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    Tenemos un slot para cada "todo", pasando el objeto 
    `todo` como una propiedad del slot".
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- Contenido alternativo -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

Ahora, cuando usamos el componente `<todo-list>`, podemos opcionalmente definir un `<template>` alternativa para cada elemento _todo_, pero con acceso a los datos del hijo:

```html
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-lista>
```

Sin embargo, incluso esto apenas roza la superficie de lo que los slots con scope son capaces de hacer. Para ejemplos potentes y de la vida real del uso de los slots con scope, recomendamos que se busque en bibliotecas como [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller), [Vue Promised](https://github.com/posva/vue-promised), y [Portal Vue](https://github.com/LinusBorg/portal-vue).

## Sintaxis obsoleta

> La directiva `v-slot` fue introducida en la versión 2.6.0, ofreciendo una API alternativa y mejorada a los, aún soportados, atributos `slot` y `slot-scope`. El fundamento completo de la introducción del `v-slot` se describe en este [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md). Los atributos `slot` y `slot-scope` continuarán siendo soportados en todas las futuras versiones 2.x, pero están oficialmente obsoletos y serán eventualmente retirados en la versión 3.

### Slots con nombre con el atributo `slot`

> <abbr title="Todavía soportado en todas las versiones 2.x de Vue, pero ya no recomendado.">Obsoleto</abbr> en 2.6.0+. Ver [aquí](#Named-Slots) para la nueva sintaxis recomendada.

Para pasar contenido a los slots con nombre desde el padre, usa el atributo especial `slot` en el `<template>` (usando el componente `<base-layout>` descrito [aquí](#Named-Slots) como ejemplo):

```html
<base-layout>
  <template slot="header">
    <h1>Aquí podría ir un título de página</h1>
  </template>

  <p>Un párrafo para el contenido principal.</p>
  <p>Y otro más.</p>

  <template slot="footer">
    <p>Aquí va alguna información de contacto</p>
  </template>
</base-layout>
```

O, el atributo `slot` también puede ser usado directamente en un elemento normal:

```html
<base-layout>
  <h1 slot="header">Aquí podría ir un título de página</h1>
  
  <p>Un párrafo para el contenido principal.</p>
  <p>Y otro más.</p>

  <p slot="footer">Aquí va alguna información de contacto</p>

</base-layout>
```

Todavía puede haber un slot sin nombre, que es el **slot por defecto** que sirve como un comodín para cualquier contenido sin slot. En los dos ejemplos anteriores, el HTML renderizado sería:

``` html
<div class="container">
  <header>
    <h1>Aquí podría ir un título de página</h1>
  </header>
  <main>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </main>
  <footer>
    <p>Aquí va alguna información de contacto</p>
  </footer>
</div>
```

### Slots con scope con el atributo `slot-scope`

> <abbr title="Todavía soportado en todas las versiones 2.x de Vue, pero ya no recomendado.">Obsoleto</abbr> en 2.6.0+. Ver [aquí](#Scoped-Slots) para la nueva sintaxis recomendada.

Para recibir propiedades pasadas a un slot, el componente padre puede usar `<template>` con el atributo `slot-scope` (usando el `<slot-example>` descrito [aquí](#Scoped-Slots) como ejemplo):

``` html
<slot-example>
  <template slot="default" slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

Aquí, `slot-scope` declara el objeto de propiedades recibido como la variable `slotProps`, y lo hace disponible dentro del scope del `<template>`. Puedes nombrar `slotProps` como quieras, de forma similar a como se nombran los argumentos de las funciones en JavaScript.

Aquí `slot="default"` puede ser omitido al estar implícito:

``` html
<slot-example>
  <template slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

El atributo `slot-scope` también puede ser usado directamente en un elemento sin `<template>` (incluyendo componentes):

``` html
<slot-example>
  <span slot-scope="slotProps">
    {{ slotProps.msg }}
  </span>
</slot-example>
```

El valor del `slot-scope` puede aceptar cualquier expresión JavaScript válida que pueda aparecer en la posición del argumento de una definición de función. Esto significa que en los entornos soportados ([componentes de un solo archivo](single-file-components.html) o [modern browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)) también se puede utilizar [ES2015 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) en la expresión, de la siguiente forma:

``` html
<slot-example>
  <span slot-scope="{ msg }">
    {{ msg }}
  </span>
</slot-example>
```

Usando la `<todo-list>` descrita [aquí](#Otros Ejemplos) como ejemplo, aquí está el uso equivalente usando `slot-scope`:

``` html
<todo-list v-bind:todos="todos">
  <template slot="todo" slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```
