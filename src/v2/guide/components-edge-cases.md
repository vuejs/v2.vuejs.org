---
title: Handling Edge Cases
type: guide
order: 106
---

> Esta página asume que ya ha leído los [ Conceptos Básicos de Componentes](components.html). Lea eso primero si los componentes son nuevos para usted.

<p class="tip">Todas las funciones en esta página documentan el manejo de casos borde, es decir, situaciones inusuales que a veces requieren doblar un poco las reglas de Vue. Sin embargo, tenga en cuenta que todas ellas tienen desventajas o situaciones en las que podrían ser peligrosas. Estos se anotan en cada caso, así que téngalos en cuenta cuando decida utilizar cada función.</p>

## Acceso a Componentes y Elementos

En la mayoría de los casos, es mejor evitar acceder a otras instancias de componentes o manipular manualmente los elementos del DOM. Sin embargo, hay casos donde puede ser apropiado.

### Acceso a la instancia Root

En cada subcomponente de una instancia `new Vue`, se puede acceder a esta instancia root (_raíz_) con la propiedad `$root`. Por ejemplo, en esta instancia root:
```js
// La instancia Root de Vue
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```
Todos los subcomponentes ahora podrán acceder a esta instancia y usarla como store global:

```js
// Obtener la data de root
this.$root.foo

// Sobreescribir la data de root
this.$root.foo = 2

// Acceder a propiedades computadas de root
this.$root.bar

// Llamar a functiones de root
this.$root.baz()
```

<p class="tip">Esto puede ser conveniente para demostraciones o aplicaciones muy pequeñas con un puñado de componentes. Sin embargo, el patrón no se adapta bien a aplicaciones de mediana o gran escala, por lo que recomendamos encarecidamente utilizar <a href="https://github.com/vuejs/vuex">Vuex</a> para manejar el estado en la mayoría de los casos.</p>


### Acceso a la instancia del componente padre

Similar a `$root`, la propiedad `$parent` se puede usar para acceder a la instancia padre desde un hijo. Esto puede ser tentador de usar como una alternativa perezosa a pasar datos como props.

<p class="tip">En la mayoría de los casos, recurrir al elemento padre hace que su aplicación sea más difícil de debuggear y comprender, especialmente si se modifica la información en el elemento padre. Cuando analice ese componente más adelante, será muy difícil averiguar de dónde provino esa modificacion. </p>


Sin embargo, hay casos, particularmente bibliotecas de componentes compartidos, cuando este recurso _puede_ ser apropiado. Por ejemplo, en los componentes abstractos que interactúan con las API de JavaScript en lugar de renderear HTML, como estos componentes hipotéticos de Google Maps:

```html
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```
El componente `<google-map>` puede definir una propiedad `map` a la que todos los subcomponentes necesitan acceso. En este caso, `<google-map-markers>` podría querer acceder a ese mapa con algo como `this.$Parent.getMap`, para agregarle un conjunto de marcadores. Puede ver este patrón [en acción aquí](https://jsfiddle.net/chrisvfritz/ttzutdxh/).

Tenga en cuenta, sin embargo, que los componentes construidos con este patrón todavía son inherentemente frágiles. Por ejemplo, imagine que agregamos un nuevo componente `<google-map-region>` y cuando `<google-map-markers>` aparezca dentro de el, solo debería representar los marcadores que caen dentro de esa región:

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```
Luego, dentro de `<google-map-markers>` es posible que te encuentres utilizando un truco como este:

```js
var map = this.$parent.map || this.$parent.$parent.map
```
Esto se ha ido rápidamente de las manos. Es por eso que para proporcionar información de contexto a los componentes hijos arbitrariamente profundos, en su lugar recomendamos usar [inyección de dependencia](#Inyección-de-dependencia).


### Acceso a instancias de componentes y elementos hijos

A pesar de la existencia de props y eventos, a veces es posible que aún necesite acceder directamente a un componente hijo en JavaScript. Para lograr esto, puede asignar un ID de referencia al componente secundario utilizando el atributo `ref`. Por ejemplo:

```html
<base-input ref="usernameInput"></base-input>
```

Ahora en el componente donde ha definido este `ref`, puede usar:

```js
this.$refs.usernameInput
```

para acceder a la instancia de `<base-input>`. Esto puede ser útil cuando, por ejemplo, desea enfocar esta entrada desde un elemento padre programáticamente. En ese caso, el componente `<base-input>` también puede usar un `ref` para proporcionar acceso a elementos específicos dentro de él, como:

```html
<input ref="input">
```

E incluso definir métodos para su uso por el padre:

```js
methods: {
  // Se usa para enfocar la entrada desde el padre
  focus: function () {
    this.$refs.input.focus()
  }
}
```

De este modo, se permite al componente principal enfocar la entrada dentro de `<base-input>` con:

```js
this.$refs.usernameInput.focus()
```

Cuando `ref` se usa junto con `v-for`, la referencia que obtendrás será un array que contiene los componentes hijos que reflejan la fuente de datos.

<p class = "tip"> Los <code>$refs</code> solo se populan después de que el componente se haya rendereado, y no son reactivos. Solo están pensado como un salida de escape para la manipulación directa de los hijos: debe evitar acceder a <code> $refs </code> desde templates o propiedades computadas. </p>

### Inyección de dependencia

Antes, cuando describimos [Acceso a la instancia del componente padre](#Acceso-a-la-instancia-del-componente-padre), mostramos un ejemplo como este:

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

En este componente, todos los descendientes de `<google-map>` necesitaban acceso a un método `getMap` para saber con qué mapa interactuar. Desafortunadamente, el uso de la propiedad `$parent` no se ajustó bien a componentes más profundamente anidados. Ahí es donde la inyección de dependencia puede ser útil, utilizando dos nuevas opciones de instancia: `provide` e `inject`.

Las opciones de `provide` nos permiten especificar los datos/métodos que queremos ** proporcionar ** (_provide en inglés_) a los componentes descendientes. En este caso, ese es el método `getMap` dentro de `<google-map>`:

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

Luego, en cualquier descendiente, podemos usar la opción `inject` para recibir propiedades específicas que nos gustaría agregar a esa instancia:

```js
inject: ['getMap']
```

Puede ver el [ejemplo completo aquí](https://jsfiddle.net/chrisvfritz/tdv8dt3s/). La ventaja sobre el uso de `$parent` es que podemos acceder a `getMap` en cualquier componente descendiente, sin exponer la instancia completa de `<google-map>`. Esto nos permite seguir desarrollando ese componente de manera más segura, sin temor a que podamos cambiar/eliminar algo en lo que un componente hijo depende. La interfaz entre estos componentes permanece claramente definida, al igual que con `props`.

De hecho, puede pensar en la inyección de dependencia como una especie de "props de largo alcance", excepto que:

* los componentes de los ancestros ​​no necesitan saber qué descendientes usan las propiedades que proporciona
* los componentes descendientes no necesitan saber de dónde vienen las propiedades inyectadas

<p class = "tip"> Sin embargo, hay desventajas en la inyección de dependencia. Combina los componentes de su aplicación con la forma en que están organizados actualmente, lo que dificulta la refactorización. Las propiedades proporcionadas tampoco son reactivas. Esto es por diseño, porque usarlos para crear un almacén de datos central escala tan mal como <a href="#Accessing-the-Root-Instance"> usar <code>$root</code> </a>para el mismo propósito. Si las propiedades que desea compartir son específicas de su aplicación, en lugar de genéricas, o si alguna vez desea actualizar los datos proporcionados dentro de los antepasados, es una buena señal de que probablemente necesite una solución de administración de estado real como <a href="https://github.com/vuejs/vuex "> Vuex </a> en su lugar.</p>

Obtenga más información sobre la inyección de dependencia en [API doc](https://vuejs.org/v2/api/#provide-inject).

## Oyentes programáticos de eventos

Hasta ahora, ha visto usos de `$emit` escuchados con` v-on`, pero las instancias de Vue también ofrecen otros métodos en su interfaz de eventos. Podemos:

- Escuchar un evento con `$on(eventName, eventHandler)`
- Escuchar un evento solo una vez con `$once(eventName, eventHandler)`
- Dejar de escuchar un evento con `$off(eventName, eventHandler)`

Normalmente no tendrá que usarlos, pero están disponibles para los casos en los que necesita escuchar manualmente los eventos en una instancia de componente. También pueden ser útiles como herramienta de organización de código. Por ejemplo, a menudo puede ver este patrón para integrar una biblioteca de terceros:

```js
// Adjuntar el datepicker a un input una vez
//  que está montado en el DOM.

mounted: function () {
  // Pikaday es una libreria de terceros para Datepickers
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// Justo antes de que el componente sea destruido,
// también destruye el selector de fechas.

beforeDestroy: function () {
  this.picker.destroy()
}
```

Esto tiene dos problemas potenciales:

- Requiere guardar el `picker` en la instancia del componente, cuando es posible que solo los hooks del ciclo de vida necesiten acceso a él. Esto no es terrible, pero podría considerarse desorden.
- Nuestro código de configuración se mantiene separado de nuestro código de limpieza, lo que dificulta la limpieza programática de todo lo que configuramos.

Podría resolver ambos problemas con un oyente programático:

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

Usando esta estrategia, incluso podríamos usar Pikaday con varios elementos de entrada, con cada nueva instancia limpiando automáticamente después de sí mismo:

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

Vea [este fiddle](https://jsfiddle.net/chrisvfritz/1Leb7up8/) para el código completo. Sin embargo, tenga en cuenta que si tiene que realizar muchas tareas de configuración y limpieza dentro de un solo componente, la mejor solución será crear más componentes modulares. En este caso, recomendamos la creación de un componente `<input-datepicker>` reutilizable.

Para obtener más información sobre los oyentes programáticos, consulte la API para [Métodos de instancia de eventos](https://vuejs.org/v2/api/#Instance-Methods-Events).

<p class="tip"> Tenga en cuenta que el sistema de eventos de Vue es diferente del <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget"> API de EventTarget </a>. Aunque funcionan de manera similar, <code>$emit</code>, <code>$on</code> y <code>$off</code> <strong>no</strong> son alias para <code>dispatchEvent</code>, <code>addEventListener</code> y <code>removeEventListener</code>.</p>

## Referencias circulares

### Componentes recursivos

Los componentes pueden invocarse recursivamente en su propio template. Sin embargo, solo pueden hacerlo con la opción `name`:

``` js
name: 'unique-name-of-my-component'
```

Cuando registra un componente globalmente con `Vue.component`, el ID global se establece automáticamente como la opción `nombre` del componente.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

Si no tiene cuidado, los componentes recursivos también pueden llevar a bucles infinitos:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```
Un componente como el anterior generará un error de tipo "max stack size exceeded"(_"tamaño de pila máximo excedido"_), así que asegúrese de que la invocación recursiva sea condicional (es decir, use un `v-if` que eventualmente será` falso`).

### Referencias circulares entre componentes


Digamos que está creando un árbol para un directorios de archivos, como en Finder o File Explorer. Es posible que tenga un componente `tree-folder` con este template:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```
Luego un componente `tree-folder-contents` con este template:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

Si observa detenidamente, verá que estos componentes serán realmente el descendiente __y__ el ancestro del otro en el árbol de renderización (_render tree_), ¡una paradoja! Al registrar componentes globalmente con `Vue.component`, esta paradoja se resuelve automáticamente. Si eres tú, puedes dejar de leer aquí.

Sin embargo, si está haciendo `require` /`import` de componentes usando un __module system__ (_sistema de modulos_), por ejemplo. A través de Webpack o Browserify, obtendrás un error:

```
Failed to mount component: template or render function not defined.
```

Para explicar lo que está sucediendo, llamemos a nuestros componentes A y B. El sistema de módulos ve que necesita A, pero primero A necesita B, pero B necesita A, pero A necesita B, etc. Está atascado en un bucle, sin saber cómo resolver completamente cualquiera de los componentes sin resolver primero el otro. Para solucionar esto, debemos darle al sistema de módulos un punto en el que pueda decir: "A necesita B _eventualmente_, pero no hay necesidad de resolver B primero".

En nuestro caso, vamos a hacer de ese punto el componente `tree-folder`. Sabemos que el elemento secundario que crea la paradoja es el componente `tree-folder-contents`, por lo que esperaremos hasta el hook del ciclo de vida` beforeCreate` para registrarlo:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

O alternativamente, puede usar el `import` asincronico de Webpack cuando registra el componente localmente:

``` js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```
¡Problema resuelto!

## Definiciones alternativas de templates

### Templates inline


Cuando el atributo especial `inline-template` está presente en un componente secundario, el componente utilizará su contenido interno como su template, en lugar de tratarlo como contenido distribuido. Esto permite una creación de templates más flexible.

``` html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

<p class = "tip"> Sin embargo, <code>inline-template</code> hace que sea más difícil razonar sobre el scope de sus templates. Como práctica recomendada, es preferido definir templates dentro del componente utilizando la opción <code>template</code> o en un elemento <code> &lt;template&gt; </code>en un archivo <code>.vue</code>.</p>


### X-Templates

Otra forma de definir templates es dentro de un elemento `script` con el tipo `text/x-template`, y luego referenciar al template mediante un id. Por ejemplo:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

<p class = "tip"> Pueden ser útiles para demostraciones con templates grandes o en aplicaciones extremadamente pequeñas, de lo contrario deben ser evitados, porque separan los templates del resto de la definición del componente. </p>

## Controlando Actualizaciones

Gracias al sistema de reactividad de Vue, siempre sabe cuándo actualizar (si lo usa correctamente). Sin embargo, hay casos extremos en los que es posible que desee forzar una actualización, a pesar del hecho de que no se ha modificado ningún dato reactivo. Luego hay otros casos en los que es posible que desee evitar actualizaciones innecesarias.

### Forzando una actualización

<p class = "tip"> Si necesita forzar una actualización en Vue, en el 99.99% de los casos, ha cometido un error en alguna parte. </p>

Es posible que no haya tenido en cuenta las advertencias de detección de cambios [con matrices](https://vuejs.org/v2/guide/list.html#Caveats) u [objetos](https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats), o puede estar confiando en un estado que no es rastreado por el sistema de reactividad de Vue, por ejemplo con `datos`.

Sin embargo, si ha descartado lo anterior y se encuentra en esta situación extremadamente rara de tener que forzar manualmente una actualización, puede hacerlo con [`$forceUpdate`](../api/#vm-forceUpdate).


### Componentes estáticos _baratos_ con `v-once`

Renderear elementos HTML simples es muy rápido en Vue, pero a veces es posible que tenga un componente que contenga **mucho** contenido estático. En estos casos, puede asegurarse de que solo se evalúe una vez y luego se almacene en caché agregando la directiva `v-once` al elemento root, así:

``` js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```

<p class = "tip"> Una vez más, intente no abusar de este patrón. Si bien es conveniente en aquellos casos raros en los que tiene que generar una gran cantidad de contenido estático, simplemente no es necesario a menos que realmente note una renderización lenta, además, podría causar mucha confusión más adelante. Por ejemplo, imagine a otro desarrollador que no está familiarizado con <code>v-once</code> o simplemente no lo ve en el template. Pueden pasar horas tratando de averiguar por qué el template no se actualiza correctamente.</p>