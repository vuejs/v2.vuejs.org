---
title: Componentes Dinámicos & Asíncronos
type: guide
order: 105
---

> Esta página asume que usted ya ha leído [Conceptos Básicos de Componentes](components.html). Lea eso primero si usted es nuevo con respecto a componentes.

## `keep-alive` con Componentes Dinámicos

Anteriormente, usamos el atributo `is` para cambiar entre componentes en una interfaz con pestañas:

```html
<component v-bind:is="currentTabComponent"></component>
```

Sin embargo, al cambiar entre estos componentes, a veces querrá mantener su estado o evitar la renderización múltiple por motivos de rendimiento. Por ejemplo, al expandir nuestra interfaz con pestañas:

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-publicaciones', {
  data: function () {
    return {
      posts: [
        {
          id: 1,
          title: 'Gato Ipsum',
          content: '<p>No espere a que pase la tormenta, bailen bajo la lluvia, patéen la basura, decidan no querer nada que ver con mi dueño. Hoy exijan que nos dejen salir de inmediato, y esperen que el dueño me espere mientras pienso en eso gato gato moo moo lick las orejas lamen las patas, así que hagan memes, hagan una cara bonita pero lamen los otros gatos. Kitty Poochy persigue errores imaginarios, pero se para frente a la pantalla de la computadora. Dulce bestia, perro, perro, odio, ratón, comer, cuerdas, barf, almohada, baños, odio, todo, mirar fijamente, cobayas. Falta la rosquilla de la izquierda, como la de mi derecha, la amó, la odió, la amó, la odió, se deslizó a tope sobre la alfombra, no el gatito.</p>'
        },
        {
          id: 2,
          title: 'Hipster Ipsum',
          content: '<p>Bushwick botella azul scenester helvetica ugh, meh cuatro loko. Ponga un pájaro en él lumbersexual franzen shabby chic, arte callejero fondo de fideicomiso chamán scenester live-edge mixtape taxidermy viral yuccie succulents. Keytar atraviesa los derechos de la bicicleta, crucifijo arte callejero neutra aire planta PBR y B sudadera con capucha a cuadros venmo. Tilde swag art party fanny pack vinilo tipografía venmo jean shorts mumblecore. Vice blog gentrify mlkshk tatuado ocupa snackwave, cerveza artesanal con capucha en el siguiente nivel migas chartreuse de 8 bits. Fideicomiso de alimentos de camiones de consumo de vinagre gochujang.</p>'
        },
        {
          id: 3,
          title: 'Magdalena Ipsum',
          content: '<p>Glaseado de postre soufflé paleta de chocolate dulce tarta tarta chupa chups. Soufflé marzipan jelly beans croissant toffee mazapán magdalena glaseado de frutas. Pastel de muffin pudín soufflé oblea jalea oso garra sésamo encaje malvavisco. Mazapán soufflé croissant gotas de limón pan de jengibre azúcar ciruela gotas de limón pastel de manzana gomitas. Rollo dulce pastel de avena pastel toffee pastel. Regaliz caramelo macarrones toffee galleta de mazapán.</p>'
        }
      ],
      selectedPost: null
    }
  },
  template: '\
    <div class="dynamic-component-demo-posts-tab">\
      <ul class="dynamic-component-demo-posts-sidebar">\
        <li\
          v-for="post in posts"\
          v-bind:key="post.id"\
          v-bind:class="{ \'dynamic-component-demo-active\': post === selectedPost }"\
          v-on:click="selectedPost = post"\
        >\
          {{ post.title }}\
        </li>\
      </ul>\
      <div class="dynamic-component-demo-post-container">\
        <div \
          v-if="selectedPost"\
          class="dynamic-component-demo-post"\
        >\
          <h3>{{ selectedPost.title }}</h3>\
          <div v-html="selectedPost.content"></div>\
        </div>\
        <strong v-else>\
          Haga clic en el título de una publicación a la izquierda para verlo.\
        </strong>\
      </div>\
    </div>\
  '
})
Vue.component('tab-archivo', {
  template: '<div>Componente de archivo</div>'
})
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Publicaciones',
    tabs: ['Publicaciones', 'Archivo']
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
.dynamic-component-demo-tab-button.dynamic-component-demo-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
.dynamic-component-demo-posts-tab {
  display: flex;
}
.dynamic-component-demo-posts-sidebar {
  max-width: 40vw;
  margin: 0 !important;
  padding: 0 10px 0 0 !important;
  list-style-type: none;
  border-right: 1px solid #ccc;
}
.dynamic-component-demo-posts-sidebar li {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.dynamic-component-demo-posts-sidebar li:hover {
  background: #eee;
}
.dynamic-component-demo-posts-sidebar li.dynamic-component-demo-active {
  background: lightblue;
}
.dynamic-component-demo-post-container {
  padding-left: 10px;
}
.dynamic-component-demo-post > :first-child {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style>
{% endraw %}

Notará que si selecciona una publicación, cambie a la pestaña _Archivo_, luego vuelva a _Publicaciones_, ya no se muestra la publicación que seleccionó. Esto se debe a que cada vez que cambia a una nueva pestaña, Vue crea una nueva instancia de `currentTabComponent`.

La recreación de componentes dinámicos suele ser un comportamiento útil, pero en este caso, nos gustaría que esas instancias de componentes de pestañas se almacenen en caché una vez que se crean por primera vez. Para resolver este problema, podemos envolver nuestro componente dinámico con un elemento `<keep-alive>`:

``` html
<!-- Inactive components will be cached! -->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

Eche un vistazo a los resultados a continuación:

{% raw %}
<div id="dynamic-component-keep-alive-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <keep-alive>
    <component
      v-bind:is="currentTabComponent"
      class="dynamic-component-demo-tab"
    ></component>
  </keep-alive>
</div>
<script>
new Vue({
  el: '#dynamic-component-keep-alive-demo',
  data: {
    currentTab: 'Publicaciones',
    tabs: ['Publicaciones', 'Archivo']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
{% endraw %}

Ahora la pestaña _Publicaciones_ mantiene su estado (la publicación seleccionada) incluso cuando no está renderizada. Vea [este fiddle](https://jsfiddle.net/chrisvfritz/Lp20op9o/) para ver el código completo.

<p class="tip">Tenga en cuenta que `<keep-alive>` requiere que los componentes se cambien para que todos tengan nombres, ya sea utilizando la opción de `nombre` en un componente o mediante el registro local/global.</p>

Por más detalles sobre `<keep-alive>` eche un vistazo a [Referencia en la API](../api/#keep-alive).

## Componentes asíncronos

En aplicaciones grandes, es posible que tengamos que dividir la aplicación en partes más pequeñas y solo cargar un componente del servidor cuando sea necesario. Para facilitarlo, Vue le permite definir su componente como una función de fábrica que resuelve de forma asíncrona su definición de componente. Vue solo activará la función de fábrica cuando el componente necesita ser procesado y almacenará el resultado en caché para futuras repeticiones. Por ejemplo:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Pasa la definición del componente a la función callback `resolve`
    resolve({
      template: '<div>¡Soy asíncrono!</div>'
    })
  }, 1000)
})
```

Como puede ver, la función de fábrica recibe una función callback `resolve`, que debe llamarse cuando haya recuperado su definición de componente del servidor. También puede llamar a `reject(motivo)` para indicar que la carga ha fallado. El `setTimeout` aquí es para demostración; Cómo recuperar el componente depende de usted. Un enfoque recomendado es utilizar componentes asíncronos junto con [la funcionalidad de división de código de Webpack](https://webpack.js.org/guides/code-splitting/):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Esta sintaxis de requerimiento especial le indicará a Webpack que
  // divida automáticamente su código construido en paquetes
  // que se cargan a través de solicitudes Ajax.
  require(['./my-async-component'], resolve)
})
```

También puedes devolver una `Promesa` en la función de fábrica, así que con la sintaxis de Webpack 2 y ES2015 puede hacer:

``` js
Vue.component(
  'async-webpack-example',
  // La función `import` devuelve una Promesa.
  () => import('./my-async-component')
)
```

Al usar [registro local](components-registration.html#Local-Registration), también es posible proporcionar directamente una función que devuelva una `Promesa`:

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">Si usted es un usuario de <strong>Browserify</strong> que quiere usar componentes asíncronos, su creador desafortunadamente [dejó en claro](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) que la carga asíncrona "no es algo que Browserify nunca apoyará." oficialmente, al menos. La comunidad Browserify ha encontrado [algunas soluciones](https://github.com/vuejs/vuejs.org/issues/620), que pueden ser útiles para aplicaciones existentes y complejas. Para todos los demás escenarios, recomendamos el uso de Webpack para el soporte asíncrono integrado de primera clase.</p>

### Manejo del estado de carga

> Nuevo en 2.3.0+

La fábrica de componentes asíncronos también puede devolver un objeto con el siguiente formato:

``` js
const AsyncComponent = () => ({
  // El componente a cargar (debe ser una Promesa)
  component: import('./MyComponent.vue'),
  // Un componente para usar mientras se carga el componente asíncrono
  loading: LoadingComponent,
  // Un componente para usar si la carga falla.
  error: ErrorComponent,
  // Retraso antes de mostrar el componente de carga. Predeterminado: 200ms.
  delay: 200,
  // El componente de error se mostrará si se proporciona un tiempo de espera
  // excedido. Predeterminado: Infinito.
  timeout: 3000
})
```

> Observe que debe usar [Vue Router](https://github.com/vuejs/vue-router) 2.4.0+ si desea usar la sintaxis previa para componentes de ruta.
