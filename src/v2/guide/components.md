---
title: Conceptos Básicos de Componentes
type: guide
order: 11
---

## Ejemplo base

Aquí un ejemplo de un componente Vue:

``` js
// Definir un nuevo componente llamado button-counter
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">Me ha pulsado {{ count }} veces.</button>'
})
```
Los componentes son instancias reutilizables de Vue con un nombre: en este caso, `<button-counter>`.
Podemos usar este componente como un elemento personalizado dentro de una instancia de Vue raíz creada con `new Vue`:

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
new Vue({ el: '#components-demo' })
```

{% raw %}
<div id="components-demo" class="demo">
  <button-counter></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">Ha hecho click {{ count }} veces.</button>'
})
new Vue({ el: '#components-demo' })
</script>
{% endraw %}

Dado que los componentes son instancias reutilizables de Vue, aceptan las mismas opciones como `new Vue`, como `data`, `computed`, `watch`, `methods`, y *hooks* de ciclo de vida.
Las únicas excepciones son algunas opciones específicas de la raíz como `el`.

## Reutilizando Componentes

Los componentes se pueden reutilizar tantas veces como se desee:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

{% raw %}
<div id="components-demo2" class="demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
<script>
new Vue({ el: '#components-demo2' })
</script>
{% endraw %}

Tenga en cuenta que al hacer clic en los botones, cada uno mantiene su propio `count` por separado.
Esto se debe a que cada vez que utiliza un componente, se  crea una nueva **instancia** del mismo.

### `data` Debe ser una función

Cuando definimos el componente `<button-counter>`, es posible que haya notado que `data` no devuelve directamente un objeto, como este:

```js
data: {
  count: 0
}
```

En lugar de eso, **la opción `data` de un componente debe ser una función**, de modo que cada instancia pueda mantener una copia independiente del objeto de datos devuelto:

```js
data: function () {
  return {
    count: 0
  }
}
```
Si Vue no tuviera esta regla, hacer clic en un botón afectaría los datos de _todas las demás instancias_, como a continuación:

{% raw %}
<div id="components-demo3" class="demo">
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
</div>
<script>
var buttonCounter2Data = {
  count: 0
}
Vue.component('button-counter2', {
  data: function () {
    return buttonCounter2Data
  },
  template: '<button v-on:click="count++">Ha hecho click {{ count }} veces.</button>'
})
new Vue({ el: '#components-demo3' })
</script>
{% endraw %}

## Organización de Componentes

Es común que una aplicación se organice en un árbol de componentes anidados:

![Component Tree](/images/components.png)

Por ejemplo, puede tener componentes para un encabezado, una barra lateral y un área de contenido, cada uno de los cuales generalmente contiene otros componentes para enlaces de navegación, publicaciones de blog, etc.

Para usar estos componentes en *templates*, deben registrarse para que Vue los conozca. Existen dos tipos de registro de componentes: **global** y **local**. Hasta ahora, solo hemos registrado componentes globalmente, usando `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... opciones ...
})
```
Los componentes registrados globalmente se pueden usar en el *template* de cualquier instancia de Vue raíz (`new Vue`) creada posteriormente, e incluso dentro de todos los subcomponentes del árbol de componentes de esa instancia de Vue.

Eso es todo lo que necesita saber sobre el registro por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa de [Registro de Componentes](components-registration.html).

## Pasando datos a componentes secundarios con Props

Anteriormente, mencionamos la creación de un componente para publicaciones de blog. El problema es que ese componente no será útil a menos que puedas pasarle datos, como el título y el contenido de la publicación específica que queremos mostrar. Ahí es donde entran las __props__.

Las __props__ son atributos personalizados que usted puede registrar en un componente. Cuando se pasa un valor a un atributo __prop__, se convierte en una propiedad en esa instancia de componente. Para pasar un título a nuestro componente de publicación de blog, podemos incluirlo en la lista de __props__ que este componente acepta, usando la opción `props`:

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

Un componente puede tener tantas props como se desee, y se puede pasar cualquier valor a cualquier prop de forma predeterminada. En el *template* anterior, verá que podemos acceder a este valor en la instancia del componente, al igual que con `data`.

Una vez que se registra un prop, puede pasarle datos como un atributo personalizado, de la siguiente manera:

```html
<blog-post title="Mi viaje con Vue"></blog-post>
<blog-post title="Blogging con Vue"></blog-post>
<blog-post title="Por qué Vue es tan divertido?"></blog-post>
```

{% raw %}
<div id="blog-post-demo" class="demo">
  <blog-post1 title="Mi viaje con Vue"></blog-post1>
  <blog-post1 title="Blogging con Vue"></blog-post1>
  <blog-post1 title="Por qué Vue es tan divertido?"></blog-post1>
</div>
<script>
Vue.component('blog-post1', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#blog-post-demo' })
</script>
{% endraw %}

En una aplicación típica, sin embargo, es probable que tenga un *array* de *post* en `data`:

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'Mi viaje con Vue' },
      { id: 2, title: 'Blogging con Vue' },
      { id: 3, title: 'Por qué Vue es tan divertido?' }
    ]
  }
})
```
Entonces querrá renderizar un componente para cada uno:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

Arriba, verá que podemos usar `v-bind` para pasar *props* dinámicamente. Esto es especialmente útil cuando no se conoce el contenido exacto que se va a renderizar con anticipación, como cuando [se obtienen posts de una API](https://jsfiddle.net/chrisvfritz/sbLgr0ad).

Esto es todo lo que necesita saber sobre *props* por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa de [Props](components-props.html).

## Un elemento de una sola raíz

Al crear un componente `<blog-post>`, su *template* eventualmente contendrá más que solo el título:

```html
<h3>{{ title }}</h3>
```
Como mínimo, querrá incluir el contenido del post:

```html
<h3>{{ title }}</h3>
<div v-html="content"></div>
```
Sin embargo, si intenta esto en su plantilla, Vue mostrará un error, explicando que **cada componente debe tener un solo elemento raíz**. Puede corregir este error envolviendo el *template* en un elemento principal de la siguiente manera:

```html
<div class="blog-post">
  <h3>{{ title }}</h3>
  <div v-html="content"></div>
</div>
```

A medida que nuestro componente crezca, es probable que no solo necesitemos el título y el contenido de una publicación, sino también la fecha de publicación, los comentarios y más. Definir una *prop* para cada pieza de información relacionada podría volverse muy molesto:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
  v-bind:content="post.content"
  v-bind:publishedAt="post.publishedAt"
  v-bind:comments="post.comments"
></blog-post>
```

Por lo tanto, este podría ser un buen momento para refactorizar el componente `<blog-post>` para que acepte una única `prop` post:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:post="post"
></blog-post>
```

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <div v-html="post.content"></div>
    </div>
  `
})
```
<p class="tip">El ejemplo anterior y algunos que veremos más adelante, utilizan [*template literals*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) de JavaScript para hacer que los *templates* multilínea sean más legibles. Internet Explorer (IE) no los admite, por lo tanto, si debe ser compatible con IE y no está transpilando (por ejemplo, con Babel o TypeScript), usa [escapes de nueva línea](https://css-tricks.com/snippets/javascript/multiline-string-variables-in-javascript/) en su lugar</p>.

Ahora, cada vez que se agreguen nuevas propiedadaes al objeto `post`, estarán automáticamente disponible dentro de `<blog-post>`.

## Enviando mensajes a componentes padre con eventos

A medida que desarrollamos nuestro componente `<blog-post>`, es posible que algunas funciones requieran la comunicación hacia el componente padre. Por ejemplo, podemos decidir incluir una función de accesibilidad para ampliar el texto de las publicaciones del blog, dejando el resto de la página en su tamaño por defecto:

En el padre, podemos admitir esta función agregando una propiedad `postFontSize` en `data`:

```js
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [/* ... */],
    postFontSize: 1
  }
})
```
Esta propiedad puede ser usada en el *template* para controlar el tamaño de la fuente de todas las publicaciones del blog:

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
    ></blog-post>
  </div>
</div>
```

Ahora agreguemos un botón para ampliar el texto justo antes del contenido de cada publicación:

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button>
        Agrandar texto
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
```
El problema es que este botón no hace nada:

```html
<button>
  Agrandar texto
</button>
```

Cuando hacemos clic en el botón, debemos comunicar al componente padre que debe agrandar el texto de todas las publicaciones. Afortunadamente, las instancias de Vue proporcionan un sistema de eventos personalizados para resolver este problema. Para emitir un evento a los padres, podemos llamar al método [**`$emit`**](../api/#vm-emit), pasando el nombre del evento:

```html
<button v-on:click="$emit('enlarge-text')">
  Agrandar texto
</button>
```

Luego, en nuestro blog post, podemos escuchar este evento con `v-on`, tal como lo haríamos con un evento DOM nativo:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

{% raw %}
<div id="blog-posts-events-demo" class="demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
      v-on:enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
<script>
Vue.component('blog-post', {
  props: ['post'],
  template: '\
    <div class="blog-post">\
      <h3>{{ post.title }}</h3>\
      <button v-on:click="$emit(\'enlarge-text\')">\
        Agrandar texto\
      </button>\
      <div v-html="post.content"></div>\
    </div>\
  '
})
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [
      { id: 1, title: 'Mi viaje con Vue', content: '...contenido...' },
      { id: 2, title: 'Blogging con Vue', content: '...contenido...' },
      { id: 3, title: 'Por qué Vue es tan divertido?', content: '...contenido...' }
    ],
    postFontSize: 1
  }
})
</script>
{% endraw %}

### Emitiendo un valor con un Evento

A veces es útil emitir un valor específico con un evento. Por ejemplo, podemos querer que el componente `<blog-post>` se encargue de cuánto agrandar el texto. En esos casos, podemos usar el segundo parámetro de `$emit` para proporcionar este valor:

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Agrandar texto
</button>
```

Luego, cuando escuchamos el evento en el componente padre, podemos acceder al valor del evento emitido con `$event`:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```
O, si el controlador de eventos es un método:

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```
Entonces el valor se pasará como el primer parámetro de ese método:

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```
### Usando `v-model` en Componentes

Los eventos personalizados también se pueden usar para crear *inputs* personalizados que funcionan con `v-model`. Recuerde que:

```html
<input v-model="searchText">
```
hace lo mismo que:

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```
Cuando se usa en un componente, `v-model` en su lugar hace esto:

``` html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```
Para que esto realmente funcione, el `<input>` dentro del componente debe:

- Enlazar el atributo `value` a un `value` prop
- En el `input`, emitir su propio evento `input` personalizado con el nuevo valor

Aquí está en acción:

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```
Ahora `v-model` debería funcionar perfectamente con este componente:

```html
<custom-input v-model="searchText"></custom-input>
```

Eso es todo lo que necesita saber sobre los eventos de componentes personalizados por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa sobre [Eventos Personalizados](components-custom-events.html).

## Distribución de contenido con Slots

Al igual que con los elementos HTML, a menudo es útil poder pasar contenido a un componente, como este:

``` html
<alert-box>
  Algo ha ocurrido mal.
</alert-box>
```
Lo cual podría renderizar algo como:

{% raw %}
<div id="slots-demo" class="demo">
  <alert-box>
    Algo ha ocurrido mal.
  </alert-box>
</div>
<script>
Vue.component('alert-box', {
  template: '\
    <div class="demo-alert-box">\
      <strong>Error!</strong>\
      <slot></slot>\
    </div>\
  '
})
new Vue({ el: '#slots-demo' })
</script>
<style>
.demo-alert-box {
  padding: 10px 20px;
  background: #f3beb8;
  border: 1px solid #f09898;
}
</style>
{% endraw %}

Afortunadamente, esta tarea se hace muy simple con el elemento personalizado `<slot>` de Vue:

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```
Como verá más arriba, solo agregamos la ranura a la que queremos que el contenido vaya -- y eso es todo. Hemos terminado!

Eso es todo lo que necesita saber acerca de slots por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos que regrese más tarde para leer la guía completa de [Slots](components-slots.html).

## Componentes dinámicos

A veces, es útil cambiar dinámicamente entre componentes, como en una interfaz con pestañas:

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    class="dynamic-component-demo-tab-button"
    v-bind:class="{ 'dynamic-component-demo-tab-button-active': tab === currentTab }"
    v-on:click="currentTab = tab"
  >
    {{ tab }}
  </button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-inicio', { template: '<div>Componente de Inicio</div>' })
Vue.component('tab-publicaciones', { template: '<div>Componente de Publicaciones</div>' })
Vue.component('tab-archivo', { template: '<div>Componente de Archivo</div>' })
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Inicio',
    tabs: ['Inicio', 'Publicaciones', 'Archivo']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
{% endraw %}

Lo anterior es posible gracias al elemento `<component>` de Vue con el atributo especial `is`:

```html
<!-- El componente cambia cuando currentTabComponent cambia -->
<component v-bind:is="currentTabComponent"></component>
```
En el ejemplo anterior, `currentTabComponent` puede contener:

- el nombre de un componente registrado, o
- un objeto de opciones de un componente

Vea [este fiddle](https://jsfiddle.net/chrisvfritz/o3nycadu/) para experimentar con el código completo, o [esta versión](https://jsfiddle.net/chrisvfritz/b2qj69o1/) para un ejemplo de enlace o *binding* al objeto de opciones de un componente, en lugar de su nombre registrado.

Eso es todo lo que necesita saber sobre los componentes dinámicos por ahora, pero una vez que haya terminado de leer esta página y se sienta cómodo con su contenido, le recomendamos volver más tarde para leer la guía completa sobre [Componentes Dinámicos y Asíncronos](components-dynamic-async.html).

## Casos especiales de análisis de templates DOM.

Algunos elementos HTML, como `<ul>`, `<ol>`, `<table>` y `<select>` tienen restricciones sobre qué elementos pueden aparecer dentro de ellos, y algunos elementos como `<li>`, `<tr>` y `<option>` solo pueden Aparecen dentro de ciertos otros elementos.

Esto conducirá a problemas cuando se utilizan componentes con elementos que tienen tales restricciones. Por ejemplo:

``` html
<table>
  <blog-post-row></blog-post-row>
</table>
```

El componente personalizado `<blog-post-row>` se colocará como contenido no válido, lo que provocará errores en el resultado final. Afortunadamente, el atributo especial `is` ofrece una solución alternativa:

``` html
<table>
  <tr is="blog-post-row"></tr>
</table>
```
Debe tenerse en cuenta que **esta limitación no se aplica si está utilizando template strings de una de las siguientes fuentes**:

- *Template Strings* (ej: `template: '...'`)
- [Componentes Single-file](single-file-components.html) (`.vue`)
- [`<script type="text/x-template">`](components-edge-cases.html#X-Templates)

Eso es todo lo que necesita saber sobre los casos especiales de análisis de templates DOM por ahora, y en realidad, el final de los aspectos _esenciales_ de Vue. ¡Felicidades! Todavía hay más que aprender, pero primero, recomendamos tomar un descanso para practicar con Vue usted mismo y construir algo divertido.

Una vez que se sienta cómodo con el conocimiento que acaba de digerir, le recomendamos que regrese para leer la guía completa de [Componentes Dinámicos y Asíncronos](components-dynamic-async.html), así como las otras páginas en la sección *Componentes en Profundidad* de la barra lateral.
