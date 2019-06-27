---
title: Evitando las fugas de memoria
type: cookbook
order: 10
---

## Introducción

Si está desarrollando aplicaciones con Vue, debe tener cuidado con las fugas de memoria. Este problema es especialmente importante en las aplicaciones de página única (SPAs) porque, por diseño, los usuarios no deberían tener que refrescar su navegador cuando usan una SPA, por lo que depende de la aplicación JavaScript limpiar los componentes y asegurarse que la recolección de basura se realice como es esperado.

Las fugas de memoria en las aplicaciones Vue no suelen provenir de Vue, sino que pueden ocurrir al incorporar otras librerías en una aplicación.

## Ejemplo Sencillo

El siguiente ejemplo muestra una fuga de memoria causada al usar la librería [Choices.js](https://github.com/jshjohnson/Choices) en un componente de Vue y no limpiarlo como corresponde. Luego, se muestra como remover la huella Choices.js y evitar la fuga de memoria.

En el siguiente ejemplo, se carga un select con muchas opciones y luego se usa el botón mostrar/ocultar con la directiva [v-if](/v2/guide/conditional.html) para agregarla y eliminarla del DOM virtual. El problema con este ejemplo es que la directiva `v-if` elimina el elemento padre del DOM, pero no se limpian las piezas de DOM adicionales creadas por Choices.js, lo que provoca una fuga de memoria.

```html
<link rel='stylesheet prefetch' href='https://joshuajohnson.co.uk/Choices/assets/styles/css/choices.min.css?version=3.0.3'>
<script src='https://joshuajohnson.co.uk/Choices/assets/scripts/dist/choices.min.js?version=3.0.3'></script>

<div id="app">
  <button
    v-if="showChoices"
    @click="hide"
  >Ocultar</button>
  <button
    v-if="!showChoices"
    @click="show"
  >Mostrar</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>
```

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      // se carga el select con muchas opciones para
      // que use mucha memoria
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Ítem " + i,
          value: i
        })
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      this.showChoices = false
    }
  }
})
```

Para ver esta fuga de memoria en acción, abra este [Ejemplo de CodePen](https://codepen.io/freeman-g/pen/qobpxo) usando Chrome y luego abra el Administrador de tareas de Chrome. Para abrir el Administrador de Tareas de Chrome en Mac, elija en la barra de Navegación de Chrome > Ventana > Administrador de Tareas o en Windows, use el acceso directo Shift + Esc. Ahora, haga clic en el botón mostrar/ocultar 50 veces o similar. Debería ver que el uso de la memoria en el Administrador de tareas de Chrome aumenta y nunca se reclama.

![Memory Leak Example](/images/memory-leak-example.png)

## Resolviendo la Fuga de Memoria

En el ejemplo anterior, se puede user el método `hide()` para limpiar y resolver la fuga de memoria antes de eliminar el select del DOM. Para lograr esto, mantendremos una propiedad en el objeto de datos de nuestra instancia de Vue y utilizaremos el método `destroy()` de [Choices API’s](https://github.com/jshjohnson/Choices) para ejecutar la limpieza.

Compruebe el uso de la memoria de nuevo con esta [actualización del ejemplo en CodePen](https://codepen.io/freeman-g/pen/mxWMor).

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true,
      choicesSelect: null
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Ítem " + i,
          value: i
        })
      }
      // establece una referencia a choicesSelect en el objeto de datos de nuestra instancia de Vue
      this.choicesSelect = new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      // ahora se puede usar la referencia a Choices para ejecutar la limpieza
      // antes de eliminar los elementos del DOM
      this.choicesSelect.destroy()
      this.showChoices = false
    }
  }
})
```

## Detalles sobre el valor

La gestión de la memoria y las pruebas de rendimiento se pueden descuidar fácilmente con la emoción de producir rápido, sin embargo, mantener una pequeña huella de memoria sigue siendo importante para la experiencia general del usuario.

Considere los tipos de dispositivos que pueden estar usando sus usuarios y cuál será su flujo normal. ¿Podrían usar computadoras portátiles o teléfonos móviles con memoria limitada? ¿Sus usuarios suelen hacer un montón de navegación en la aplicación? Si cualquiera de estos es cierto, entonces las buenas prácticas de administración de memoria pueden ayudar a evitar el peor de los casos, bloquear el navegador del usuario. Incluso si ninguno de estos es cierto, aún se puede tener una degradación del rendimiento en el uso extendido de su aplicación si no se tiene cuidado.

## Ejemplo en la vida real

En el ejemplo anterior, se usó una directiva `v-if` para ilustrar la fuga de memoria, sin embargo, un escenario muy común en la vida real es cuando se usa [vue-router](https://router.vuejs.org/en/)para rutear a componentes en una aplicación de una sola página (SPA).

Al igual que la directiva `v-if`, `vue-router` remueve elementos del DOM virtual y los reemplaza con nuevos elementos cuando el usuario navega a través de la aplicación. El hook de Vue `beforeDestroy()` [lifecycle hook](/v2/guide/instance.html#Lifecycle-Diagram) es un buen lugar para resolver el mismo tipo de fuga cuando la aplicación usa `vue-router`.

Se puede agregar nuestro código en el hook `beforeDestroy()` de la siguiente manera:

```js
beforeDestroy: function () {
  this.choicesSelect.destroy()
}
```

## Patrones Alternativos

Hasta el momento se presenta como manejar la memoria al remover elementos, pero ¿qué tal si intencionalmente se quiere preservar el estado y mantener elementos en memoria? En este caso, se puede usar el componente incorporado [keep-alive](/v2/api/#keep-alive).

Cuando se envuelve a un componente con `keep-alive`, su estado es preservado y por lo tanto mantenido en memoria.

```html
<button @click="show = false">Ocultar</button>
<keep-alive>
  <!-- my-component será intencionalmente mantenido en memoria incluso cuando sea removido -->
  <my-component v-if="show"></my-component>
</keep-alive>
```

Esta técnica puede ser útil para mejorar la experiencia del usuario. Por ejemplo, imagine que un usuario comienza a ingresar comentarios en una entrada de texto y luego decide alejarse. Si el usuario regresara a navegar, sus comentarios se conservarán.

Una vez que use keep-alive, tendrá acceso a dos hooks más del ciclo de vida: `activated` y` deactivated`. Si desea limpiar o cambiar datos cuando se elimina un componente bajo keep-alive, puede hacerlo usando el hook  `deactivated`.

```js
deactivated: function () {
  // eliminar cualquier dato que no se quiera conservar
}
```

## En resumen

Vue hace que sea muy fácil desarrollar aplicaciones asombrosas y reactivas en JavaScript, pero aún debe tener cuidado con las fugas de memoria. Estas fugas a menudo se producen cuando se utilizan librerías de terceros que manipulan el DOM fuera de Vue. Asegúrese de probar su aplicación para detectar fugas de memoria y siga los pasos apropiados para limpiar los componentes cuando sea necesario.
