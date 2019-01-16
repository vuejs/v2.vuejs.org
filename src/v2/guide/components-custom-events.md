---
title: Eventos personalizados
type: guide
order: 103
---

> Esta página asume que usted ya ha leído [Components Basics](components.html). Léa primero esto si usted es nuevo con respecto a componentes.

## Nombre de Eventos

A diferencia de los componentes y props, los nombres de eventos no proporcionan ninguna transformación automática de cases. En su lugar, el nombre de un evento emitido debe coincidir exactamente con el nombre utilizado para escuchar ese evento. Por ejemplo, si está emitiendo un nombre de evento camelCased:

```js
this.$emit('myEvent')
```

Escuchando la versión kebab-cased no tendrá efecto:

```html
<my-component v-on:my-event="doSomething"></my-component>
```

A diferencia de los componentes y props, los nombres de eventos nunca serán usados como variables o nombres de propiedad en JavaScript, entonces no hay razón para usar camelCase o PascalCase. Además, utilizando `v-on` para los listeners de eventos dentro del DOM de la plantilla, será automáticamente transformada a minúsculas (debido a la falta de sensibilidad entre mayúsculas y minúsculas de HTML), entonces `v-on:myEvent` se convertiría en `v-on:myevent` -- haciendo que `myEvent` sea imposible de escuchar.

Por estas razones, recomendamos **usar siempre kebab-case para nombres de eventos**.

## Perzonalización de componente `v-model`

> Nuevo en la versión 2.2.0+

Por defecto, `v-model` en un componente usa `value` como una prop e `input` como el evento, pero algunos tipos de entrada como los checkboxes y radio buttons puden querer usar el atributo `value` para un [propósito diferente](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value). Usando la opción `model` puede evitar conflictos en estos casos:

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

Ahora cuando se use `v-model` en este componente:

```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```

el valor de `lovingVue` será pasado a la prop `checked`. La propiedad `lovingVue` entonces será actualizada cuando `<base-checkbox>` emita un evento `change` con un nuevo valor.

<p class="tip">Note que aún debe declarar la prop <code>checked</code> en las opciones <code>props</code> del componente.</p>

## Enlace de Eventos nativos a componentes

Puede haber ocasiones en las que desee escuchar directamente a un event nativo en el elmento raíz de un componente. En estos casos, puede utilizar el modificador `.native` para `v-on`:

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

Esto puede ser util a veces, pero no es una buena idea cuando está probando escuchar un elemento muy específico, como un `<input>`. Por ejemplo, el comonente `<base-input>` de arriba podría ser refactoriado de modo tal que el elemento raíz sea en realidad un elemento `<label>`:

```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

En este caso, el listener `.native` rompería silenciosamente. No habría errores pero el handler `onFocus` no sería llamado cuando esperamos que lo haga.

Para resolver este problema, Vue provee una propiedad `$listeners` que contiene un objeto de listeners siendo usado en el componente. Por ejemplo:

```js
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

Usando la propiedad `$listeners`, puede reenviar todos los listeners de eventos en el componentes a un elemento hijo específico con `v-on="$listeners"`. Para elementos como `<input>`, donde quisiera utilizar `v-model`, es a menudo útil para crear una nueva propiedad computada para listeners, como `inputListeners`:

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` merges objects together to form a new object
      return Object.assign({},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

Ahora el componente `<base-input>` es un **wrapper completamente transparenter**, lo que significa que puede ser usado exactamente como un elemento `<input>` normal: todos los mismos atributos y listeners funcionaran, sin el modificador `.native`.

## Modificador `.sync`

> New in 2.3.0+

En algunos casos, necesitamos "two-way binding" para una prop. Desafortunadamente, el verdadero two-way binding puede crear problemas de mantenimiento, porque los componentes hijos pueden alterar al padre sin que la fuente de esa mutation sea obvia tanto en el padre como en el niño

Por eso en cambio, recomendamos emitir eventos en el patrón `update:myPropName`. Por ejemplo, en un hipotético componente con una prop `title`, podríamos comunicar la intención de asignar un nuevo valor con:

```js
this.$emit('update:title', newTitle)
```

Entonces el padre puede escuchar ese evento y actualizar una propiedad de datos local, si así lo desea. Por ejemplo:

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

Por conveniencia, ofrecemos un shorthand para este patrón con el modificador `.sync`:

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

El modificador `.sync` puede también ser usado con `v-bind` cuando se usa un objeto para configurar múltiples props a la vez:

```html
<text-document v-bind.sync="doc"></text-document>
```

Esto pasa cada propiedad en el objeto `doc` (ej: `title`) como una prop individual, luego agrega listeners de actualización `v-on` para cada uno.

<p class="tip">Usando <code>v-bind.sync</code> con un objeto literal, como por ejemplo <code>v-bind.sync="{ title: doc.title }"</code>, no funcionará, porque hay demasiados casos borde para considerar al analizar una expresión compleja como esta.</p>
