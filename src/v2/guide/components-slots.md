---
title: Slots
type: guide
order: 104
---

> Esta página asume que usted ya ha leído [Conceptos Básicos de Componentes](components.html). Lea eso primero si usted es nuevo con respecto a componentes.

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

## Slots Nombrados

Hay ocasiones en que es útil tener múltiples slots. Por ejemplo, en un componente hipotético `base-layout` con la siguiente plantilla:

``` html
<div class="container">
  <header>
    <!-- Queremos contenido de la cabecera aquí. -->
  </header>
  <main>
    <!-- Queremos contenido principal aquí. -->
  </main>
  <footer>
    <!-- Queremos contenido de pie de página aquí. -->
  </footer>
</div>
```

Para estos casos, el elemento `<slot>` tiene un atributo especial, `name`, el cual puede ser usado para definir slots adicionales:

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

Para proporcionar contenido a los slots nombrados, se puede usar el atributo `slot` en un elemento `<template>` en el padre:

```html
<base-layout>
  <template slot="header">
    <h1>Aquí podría haber un título de página.</h1>
  </template>

  <p>Un párrafo para el contenido principal.</p>
  <p>Y otro más.</p>

  <template slot="footer">
    <p>Aquí hay alguna información de contacto</p>
  </template>
</base-layout>
```

O, el atributo `slot` también se puede usar directamente en un elemento normal:

``` html
<base-layout>
  <h1 slot="header">Aquí podría haber un título de página.</h1>

  <p>Un párrafo para el contenido principal.</p>
  <p>Y otro más.</p>

  <p slot="footer">Aquí hay alguna información de contacto</p>
</base-layout>
```

Todavía puede haber un slot sin nombre, que es el **slot predeterminado** que sirve como una salida para todos los contenidos no coincidentes. En los dos ejemplos anteriores, el HTML representado sería:

``` html
<div class="container">
  <header>
    <h1>Aquí podría haber un título de página.</h1>
  </header>
  <main>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </main>
  <footer>
    <p>Aquí hay alguna información de contacto</p>
  </footer>
</div>
```

## Contenido del slot por defecto

Hay casos en los que es útil proporcionar un slot con contenido predeterminado. Por ejemplo, un componente `<submit-button>` puede querer que el contenido del botón sea "Enviar" de forma predeterminada, pero también permite a los usuarios anular el contenido con "Guardar", "Cargar" o cualquier otra cosa.

Para lograr esto, especifique el contenido predeterminado entre las etiquetas `<slot>` en la plantilla de su componente:

```html
<button type="submit">
  <slot>Enviar</slot>
</button>
```

Si el contenido del slot es proporcionada por el padre, reemplazará el contenido predeterminado.

## Scope de compilación

Cuando desee utilizar datos dentro de un slot, como en:

``` html
<navigation-link url="/profile">
  Conectado como {{ user.name }}
</navigation-link>
```

Ese slot tiene acceso a las mismas propiedades de instancia (es decir, el mismo "scope") que el resto de la plantilla. El slot **no** no tiene acceso al scope de `<navigation-link>` '. Por ejemplo, intentar acceder a `url` no funcionaría. Como regla general, recuerda que:

> Todo en la plantilla padre se compila en el scope del padre; todo en la plantilla hija se compila en el scope del hijo.

## Slots con Scope

> Nuevo en 2.1.0+

A veces querrá crear un componente con un slot reutilizable que pueda acceder a los datos del componente hijo. Por ejemplo, un simple componente `<todo-list>` puede contener lo siguiente en su plantilla:

```html
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

Pero en algunas partes de nuestra aplicación, queremos que los elementos individuales de la lista de `todo` realicen algo diferente al `todo.text`. Aquí es donde los slots con scope entran en juego.

Para hacer que la funcionalidad sea posible, todo lo que tenemos que hacer es envolver el contenido del elemento todo en un elemento `<slot>`, luego pasar al slot cualquier dato relevante a su contexto: en este caso, el objeto `todo`:

```html
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    <!-- Tenemos un slot para cada "todo", pasandolo al -->
    <!-- objeto `todo` como una propiedad del slot -->
    <slot v-bind:todo="todo">
      <!-- Contenido alternativo -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

Ahora, cuando usamos el componente `<todo-list>`, opcionalmente podemos definir un `<template>` alternativo para todos los elementos, pero con acceso a los datos del hijo a través del atributo `slot-scope`:

```html
<todo-list v-bind:todos="todos">
  <!-- Defina `slotProps` como el nombre de nuestro slot con scope -->
  <template slot-scope="slotProps">
    <!-- Defina una plantilla personalizada para elementos de la lista de todo, -->
    <!-- utilizando `slotProps` para personalizar cada elemento. -->
    <span v-if="slotProps.todo.isComplete">✓</span>
    {{ slotProps.todo.text }}
  </template>
</todo-list>
```

> En 2.5.0+, `slot-scope` ya no está limitado al elemento` <template> `, sino que puede usarse en cualquier elemento o componente en el slot.

### Destructurando al `slot-scope`

El valor de `slot-scope` puede aceptar cualquier expresión válida de JavaScript que pueda aparecer en la posición del argumento de una definición de función. Esto significa en entornos compatibles ([componentes de un solo archivo](single-file-components.html) o [navegadores modernos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)) usted también puede usar [destructuración ES2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) en la expresión, al igual que:

```html
<todo-list v-bind:todos="todos">
  <template slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

Esta es una gran manera de hacer que los slots con scope sean un poco más limpios.
