---
title: Introducción
type: guide
order: 2
---

## Qué es Vue.js?

Vue (pronunciado /vjuː/, como **view**) es un **framework progresivo** para construir interfaces de usuario. A diferencia de otros _frameworks_ monolíticos, Vue está diseñado desde cero para ser utilizado incrementalmente. La librería central está enfocada solo en la capa de visualización, y es fácil de utilizar e integrar con otras librerias o proyectos existentes. Por otro lado, Vue también es perfectamente capaz de impulsar sofisticadas _Single-Page Applications_ cuando se utiliza en combinación con [herramientas modernas](single-file-components.html) y [librerías de apoyo](https://github.com/vuejs/awesome-vue#components--libraries).

Si desea obtener más información sobre Vue antes de profundizar, <a id="modal-player"  href="#">creamos un video</a> paseando a través de los principios básicos, con un proyecto de ejemplo.

Si usted es un desarrollador frontend experimentado y desea saber cómo Vue se compara con otras librerias/frameworks, consulte la [Comparación con Otros Frameworks](comparison.html).

## Empezando

<p class="tip">La guía oficial asume conocimientos de nivel intermedio de HTML, CSS y JavaScript. Si usted es totalmente nuevo en el desarrollo frontend, puede que no sea la mejor idea saltar directamente a un _framework_ como su primer paso - ¡capte lo básico y luego vuelva! La experiencia previa con otros _frameworks_ ayuda, pero no es necesaria.</p>

La forma más fácil de probar Vue.js es usando el [el ejemplo Hola Mundo en JSFiddle](https://jsfiddle.net/chrisvfritz/50wL7mdz/). Siéntase libre de abrirlo en otra pestaña y seguirlo mientras analizamos algunos ejemplos básicos. O puede <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html">crear un archivo <code>index.html</code></a> e incluir Vue con:

``` html
<!-- development version, includes helpful console warnings -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

o con:

``` html
<!-- production version, optimized for size and speed -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

La [página de instalación](installation.html) proporciona más opciones de instalación de Vue. Nota: **No** recomendamos que los principiantes comiencen con `vue-cli`, especialmente si aún no están familiarizados con las herramientas de _build_ basadas en Node.js.

Si prefiere algo más interactivo, también puede ver [esta serie de tutoriales en Scrimba](https://scrimba.com/playlist/pXKqta), que le ofrece una combinación de _screencast_ y _playground_ de código con los que puede pausar y jugar en cualquier momento.

## Renderización Declarativa

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank">Pruebe esta lección en Scrimba</a></div>

En el núcleo de Vue.js se encuentra un sistema que nos permite procesar datos de forma declarativa al DOM mediante una sintaxis de plantilla sencilla:

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hola Vue!'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hola Vue!'
  }
})
</script>
{% endraw %}

¡Ya hemos creado nuestra primera aplicación Vue! Esto parece bastante similar a la representación de un _template string_, pero Vue ha hecho mucho trabajo por debajo. Los datos y el DOM ahora están vinculados, y todo ahora es **reactivo**. ¿Cómo sabemos? Abra la consola de JavaScript de su navegador (ahora mismo, en esta página) y cambie el valor de `app.message` a un valor diferente. Debería ver que el ejemplo se ha renderizado con el nuevo valor que acaba de ingresar.

Además de la interpolación de texto, también podemos enlazar atributos de elementos como este:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Mueva el mouse sobre mí durante unos segundos 
    para ver mi título enlazado dinámicamente.
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Usted cargó esta página el ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Mueva el mouse sobre mí durante unos segundos para ver mi título enlazado dinámicamente.
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Usted cargó esta página el ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Aquí nos encontramos con algo nuevo. El atributo `v-bind` que está viendo se llama **directiva**. Las directivas tienen el prefijo `v-` para indicar que son atributos especiales proporcionados por Vue, y como puede haber adivinado, aplican un comportamiento reactivo especial al DOM representado. Aquí, básicamente se dice "mantener el atributo `title` de este elemento actualizado con la propiedad `message` en la instancia de Vue".

Si vuelve a abrir la consola de JavaScript e ingresa `app2.message = 'some new message'`, verá una vez más que el HTML enlazado, en este caso el atributo `title`, se ha actualizado.

## Condicionales y Bucles

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank">Pruebe esta lección en Scrimba</a></div>

También es fácil alternar la presencia de un elemento:

``` html
<div id="app-3">
  <span v-if="seen">Ahora me ves</span>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Ahora me ves</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Continúa y escribe `app3.seen = false` en la consola. Deberías ver el mensaje desaparecer.

Este ejemplo demuestra que podemos vincular datos no solo con el texto y los atributos, sino también con la **estructura** del DOM. Además, Vue también proporciona un potente sistema de efectos de transición que puede aplicar automáticamente [efectos de transición](transitions.html) cuando los elementos son insertados, actualizados o eliminados por Vue.

Hay bastantes otras directivas, cada una con su propia funcionalidad especial. Por ejemplo, la directiva `v-for` se puede usar para mostrar una lista de elementos utilizando los datos de un Array:

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Aprender JavaScript' },
      { text: 'Aprender Vue' },
      { text: 'Construir algo increíble' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Aprender JavaScript' },
      { text: 'Aprender Vue' },
      { text: 'Construir algo increíble' }
    ]
  }
})
</script>
{% endraw %}

En la consola, ingrese `app4.todos.push ({text: 'Nuevo elemento'})`. Debería ver un nuevo elemento agregado a la lista.

## Manejando Interacciones del Usuario

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank">Pruebe esta lección en Scrimba</a></div>

Para permitir que los usuarios interactúen con su aplicación, podemos usar la directiva `v-on` para adjuntar escuchas de eventos que invocan métodos en nuestras instancias de Vue:

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Mensaje invertido</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hola Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Mensaje invertido</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hola Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Tenga en cuenta que en este método, actualizamos el estado de nuestra aplicación sin tocar el DOM: Vue maneja todas las manipulaciones del DOM y el código que usted escribe se enfoca en la lógica subyacente.

Vue también proporciona la directiva `v-model` que hace que el enlace bidireccional entre los controles de los formularios y el estado de la aplicación sea muy sencilla:

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hola Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hola Vue!'
  }
})
</script>
{% endraw %}

## Composición con Componentes

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank">Pruebe esta lección en Scrimba</a></div>

El sistema de componentes es otro concepto importante en Vue, porque es una abstracción que nos permite crear aplicaciones a gran escala compuestas de componentes pequeños, independientes y, a menudo, reutilizables. Si lo pensamos, casi cualquier tipo de interfaz de aplicación se puede abstraer en un árbol de componentes:

![Árbol de componentes](/images/components.png)

En Vue, un componente es esencialmente una instancia de Vue con opciones predefinidas. Registrar un componente en Vue es sencillo:

``` js
// Define a new component called todo-item
Vue.component('todo-item', {
  template: '<li>Esta es una tarea.</li>'
})
```

Ahora puedes incluirlo en el _template_ de otro componente:

``` html
<ol>
  <!-- Create an instance of the todo-item component -->
  <todo-item></todo-item>
</ol>
```

Pero esto supondría tener el mismo texto para cada tarea, que no es muy interesante. Es posible que se pueda pasar datos de un _scope_ o contexto padre a uno secundario en los componentes hijos. Modifique la configuración del componente para que acepte una [propiedad](components.html#Props):

``` js
Vue.component('todo-item', {
  // The todo-item component now accepts a
  // "prop", which is like a custom attribute.
  // This prop is called todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Ahora podemos pasar la tarea a cada componente repetido usando `v-bind`:

``` html
<div id="app-7">
  <ol>
    <!--
      Now we provide each todo-item with the todo object
      it's representing, so that its content can be dynamic.
      We also need to provide each component with a "key",
      which will be explained later.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id">
    </todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Vegetales' },
      { id: 1, text: 'Queso' },
      { id: 2, text: 'Cualquier otra cosa que se supone que los humanos coman' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Vegetales' },
      { id: 1, text: 'Queso' },
      { id: 2, text: 'Cualquier otra cosa que se supone que los humanos coman' }
    ]
  }
})
</script>
{% endraw %}

Este es un ejemplo ficticio, pero hemos logrado separar nuestra aplicación en dos unidades más pequeñas, y el componente hijo está razonablemente bien desacoplado del componente padre a través de la interfaz de propiedades. Ahora podemos mejorar aún más nuestro componente `<todo-item>` con un _template_ y lógica más complejas sin afectar la aplicación principal.

En una aplicación grande, es necesario dividir toda la aplicación en componentes para que el desarrollo sea manejable. Hablaremos mucho más sobre los componentes [más adelante en la guía](components.html), pero aquí hay un ejemplo (imaginario) de cómo se vería el _template_ de una aplicación con componentes:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Relación con Elementos Personalizados

Es posible que haya notado que los componentes de Vue son muy similares a **Elementos personalizados**, que forman parte de las [Especificaciones de Componentes Web](https://www.w3.org/wiki/WebComponents/). Esto se debe a que la sintaxis de los componentes de Vue está modelada de forma flexible según la especificación. Por ejemplo, los componentes de Vue implementan la [API de Slot](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) y el atributo especial `is`. Sin embargo, hay algunas diferencias clave:

1. La especificación de componentes web se ha finalizado, pero no se implementa de forma nativa en todos los navegadores. Safari 10.1+, Chrome 54+ y Firefox 63+ soportan de forma nativa los componentes web. En comparación, los componentes de Vue no requieren polyfills y funcionan de manera consistente en todos los navegadores compatibles (IE9 y superiores). Cuando sea necesario, los componentes de Vue también se pueden envolver dentro de un elemento personalizado nativo.

2. Los componentes de Vue proporcionan características importantes que no están disponibles en elementos personalizados sencillos, especialmente el flujo de datos de componentes cruzados, la comunicación de eventos personalizados y las integraciones de herramientas de construcción.

## ¿Listo para más?

Hemos presentado brevemente las funciones más básicas del núcleo de Vue.js. El resto de esta guía tratará estas y otras funciones avanzadas con detalles mucho más precisos, ¡así que asegúrese de leer todo esto!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script></div>
