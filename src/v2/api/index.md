---
title: API
type: api
---

## Configuración Global

`Vue.config` es un objeto que contiene las configuraciones globales de Vue. Podemos modificar sus propiedades listadas debajo antes de inicializar nuestra aplicación:

### silent

- **Tipo:** `boolean`

- **Por defecto:** `false`

- **Uso:**

  ``` js
  Vue.config.silent = true
  ```

  Suprime todos los logs y warnings de Vue

### optionMergeStrategies

- **Tipo:** `{ [key: string]: Function }`

- **Por defecto:** `{}`

- **Uso:**

  ``` js
  Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
    return child + 1
  }

  const Profile = Vue.extend({
    _my_option: 1
  })

  // Profile.options._my_option = 2
  ```

  Define estrategias personalizadas de fusión (_merge_) para opciones.

  La estrategia de fusión recibe el valor de aquella opción definida en el padre y las instancias del hijo como primer y segundo parámetro respectivamente. El contexto de la instancia de Vue es pasado como tercer argumento.

- **Ver además:** [Estrategias personalizadas de fusión de opciones](../guide/mixins.html#Custom-Option-Merge-Strategies)

### devtools

- **Tipo:** `boolean`

- **Por defecto:** `true` (`false` en ambiente de producción)

- **Uso:**

  ``` js
  // asegúrese de configurarlo de forma sincronizada inmediatamente después de cargar Vue
  Vue.config.devtools = true
  ```

  Establece si se permite la inspección de [vue-devtools](https://github.com/vuejs/vue-devtools). El valor por defecto de esta opción es `true` en ambiente de desarrollo y `false` en ambiente de producción. Usted puede establecerlo en `true` para habilitar la inspección para el ambiente de producción.

### errorHandler

- **Tipo:** `Function`

- **Por defecto:** `undefined`

- **Uso:**

  ``` js
  Vue.config.errorHandler = function (err, vm, info) {
    // manejo de errores
    // `info` es información específica de Vue, por ejemplo, en cual
    // _hook_ del ciclo de vida fue encontrado el error.
    // Esto se encuentra disponible en 2.2.0+
  }
  ```

  Asigna un manejador (_handler_) para errores no capturados durante la renderización de componentes y observadores (_watchers_). El manejador es invocado con el error y la instancia de Vue.

  > En 2.2.0+, este hook captura también errores en los hooks del ciclo de vida de los componentes. Además cuando este hook es `undefined`, los errores capturados serán logueados con `console.error` en vez de colapsar la aplicación.

  > En 2.4.0+, este hook también captura errores lanzados dentro de los manejadores de eventos personalizados de Vue.

  > En 2.6.0+, este hook también captura errores lanzados dentro de los listeners DOM `v-on`. Además, si alguno de los _hooks_ o _handlers_ cubiertos devuelve una Promesa en cadena (como las funciones asíncronas), ese error de la Promesa también se manejará.

  > Los servicios de seguimiento de errores [Sentry](https://sentry.io/for/vue/) y [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/) proporcionan integraciones oficiales utilizando esta opción.

### warnHandler

> Nuevo en 2.4.0+

- **Tipo:** `Function`

- **Por defecto:** `undefined`

- **Uso:**

  ``` js
  Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` es la traza de la jerarquía de componentes.
  }
  ```

  Asigna un manejador personalizado para advertencias en tiempo de ejecución. Note que solo funciona en desarrollo y es ignorado en producción.

### ignoredElements

- **Tipo:** `Array<string | RegExp>`

- **Por defecto:** `[]`

- **Uso:**

  ``` js
  Vue.config.ignoredElements = [
    'my-custom-web-component',
    'another-web-component',
    // Use una `RegExp` para ignorar todos los elementos que comienzan
    // con "ion-". En 2.5+ solamente
    /^ion-/
  ]
  ```

  Hace que Vue ignore elementos personalizados definidos fuera de Vue (por ejemplo, utilizando las API de componentes web). De otra manera lanzará una advertencia `Unknown custom element`, asumiendo que usted olvidó registrar un componente global o escribió mal el nombre de un componente.

### keyCodes

- **Tipo:** `{ [key: string]: number | Array<number> }`

- **Por defecto:** `{}`

- **Uso:**

  ``` js
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    // camelCase no funcionará
    mediaPlayPause: 179,
    // en su lugar usted puede usar kebab-case con comillas dobles
    "media-play-pause": 179,
    up: [38, 87]
  }
  ```

  ```html
  <input type="text" @keyup.media-play-pause="method">
  ```

  Define alias personalizados para `v-on`.

### performance

> Nuevo en 2.2.0+

- **Tipo:** `boolean`

- **Por defecto:** `false (from 2.2.3+)`

- **Uso**:

  Establezca en `true` para habilitar el seguimiento del rendimiento de inicio, compilación, procesamiento y actualización del componente en la línea de tiempo de inspección del navegador. Solo funciona en modo de desarrollo y navegadores que admiten la API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

### productionTip

> Nuevo en 2.2.0+

- **Tipo:** `boolean`

- **Por defecto:** `true`

- **Uso**:

  Establezca en `false` para prevenir sugerencias en modo de producción al iniciar Vue.

## API Global

### Vue.extend( opciones )

- **Argumentos:**
  - `{Object} options`

- **Uso:**

  Crea una "subclase" del constructor base de Vue. El argumento debería ser un objeto que contenga opciones del componente

  El caso especial a tener en cuenta es la opción `data` - la cuál tiene que ser una función cuando se usa `Vue.extend()`.

  ``` html
  <div id="mount-point"></div>
  ```

  ``` js
  // crear el constructor
  var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
    data: function () {
      return {
        firstName: 'Walter',
        lastName: 'White',
        alias: 'Heisenberg'
      }
    }
  })

  // crea una instancia de Profile y la monta en el elemento
  new Profile().$mount('#mount-point')
  ```

  Dará como resultado:

  ``` html
  <p>Walter White conocido como Heisenberg</p>
  ```

- **Ver además:** [Componentes](../guide/components.html)

### Vue.nextTick( [callback, context] )

- **Argumentos:**
  - `{Function} [callback]`
  - `{Object} [context]`

- **Uso:**

  Aplaza el callback para ser ejecutado después del siguiente ciclo de actualización del DOM. Úselo inmediatamente después de que usted haya cambiado algún dato para esperar por la actualización del DOM.

  ``` js
  // modificación de datos
  vm.msg = 'Hello'
  // DOM no actualizado todavía
  Vue.nextTick(function () {
    // DOM actualizado
  })

  // usado cómo promesa (2.1.0+, ver la nota debajo)
  Vue.nextTick()
    .then(function () {
      // DOM actualizado
    })
  ```

  > Nuevo en 2.1.0+: retorna una promesa si no se provee un callback y Promise es soportado en el entorno de ejecución. Por favor tenga en cuenta que Vue no incluye un polyfill para Promise, asi que si su navegador destino no soporta Promesas de forma nativa (te estoy mirando a ti IE), deberá proveer un polyfill usted mismo.

- **Vea también:** [Cola de actualización Asíncrona](../guide/reactivity.html#Async-Update-Queue)

### Vue.set( target, key, value )

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key`
  - `{any} value`

- **Retorna:** el valor asignado.

- **Uso:**

  Agrega una propiedad a un objeto reactivo, asegurando que la nueva propiedad es también reactiva, de manera que dispara actualizaciones en la vista. Esto debe ser usado para agregar nuevas propiedades a objetos reactivos, ya que Vue no puede detectar adiciones de propiedades de la forma usual (ej: `this.myObject.newProperty = 'hi'`).

  <p class="tip">El objeto destino no puede ser una instancia de Vue, o el objeto raíz data de una instancia de Vue.</p>

- **Vea también:** [Reactividad en profundidad](../guide/reactivity.html)

### Vue.delete( target, key )

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key/index`

  > Solamente en 2.2.0+: También funciona con Array + index.

- **Uso:**

  Borra una propiedad de un objeto. Si el objeto es reactivo, asegura que el borrado dispara actualizaciones en la vista. Esto es unado principalmente para sortear las limitaciones de Vue que no puede detectar la eliminación de propiedades, pero usted raramente necesitará usarlo.

  <p class="tip">El objeto destino no puede ser una instancia de Vue, o el objeto raíz data de una instancia de Vue.</p>

- **Vea también:** [Reactividad en profundidad](../guide/reactivity.html)

### Vue.directive( id, [definition] )

- **Argumentos:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Uso:**

  Registrar u obtener una directiva global.

  ``` js
  // registrar
  Vue.directive('my-directive', {
    bind: function () {},
    inserted: function () {},
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {}
  })

  // registrar (directiva funcional)
  Vue.directive('my-directive', function () {
    // esto sera llamado como `bind` y `update`
  })

  // retorna la definición de la directiva si esta registrada
  var myDirective = Vue.directive('my-directive')
  ```

- **Vea también:** [Directivas personalizadas](../guide/custom-directive.html)

### Vue.filter( id, [definition] )

- **Argumentos:**
  - `{string} id`
  - `{Function} [definition]`

- **Uso:**

̊  Registrar u obtener un filtro global.

  ``` js
  // registrar
  Vue.filter('my-filter', function (value) {
    // retorna el valor procesado
  })

  // retorna el filtro si esta registrado
  var myFilter = Vue.filter('my-filter')
  ```

- **Vea también:** [Filtros](../guide/filters.html)

### Vue.component( id, [definition] )

- **Argumentos:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Uso:**

  Registra u obtiene un componente global. El registro también establece automáticamente la propiedad `name` del componente igual al `id` especificado.

  ``` js
  // registra un constructor extendido
  Vue.component('my-component', Vue.extend({ /* ... */ }))

  // registra un objeto de opciones (invoca Vue.extend automáticamente)
  Vue.component('my-component', { /* ... */ })

  // Obtiene un componente registrado (siempre retorna un constructor)
  var MyComponent = Vue.component('my-component')
  ```

- **Vea también:** [Componentes](../guide/components.html)

### Vue.use( plugin )

- **Argumentos:**
  - `{Object | Function} plugin`

- **Uso:**

  Instala un plugin de Vue.js. Si el plugin es un Objeto, debe exponer un método `install`. Si el mismo es una función, sera tratado como el método install. El método install sera invocado con Vue como el argumento.

  Este método debe ser invocado antes de invocar `new Vue()`

  Cuando este método es invocado en el mismo plugin multiples veces, el plugin sera instalado solo una vez.

- **Vea también:** [Plugins](../guide/plugins.html)

### Vue.mixin( mixin )

- **Argumentos:**
  - `{Object} mixin`

- **Uso:**

  Aplica un mixin de forma global, el cual afecta cada instancia de Vue creada posteriormente. Esto puede ser usado por los creadores de plugins para inyectar comportamiento personalizado en componentes. **No recomendado en el código de aplicación**.

- **Vea también:** [Mixin Global](../guide/mixins.html#Global-Mixin)

### Vue.compile( template )

- **Argumentos:**
  - `{string} template`

- **Uso:**

  Compila un template string a una función render. **Solo disponible en la distribución completa.**

  ``` js
  var res = Vue.compile('<div><span>{{ msg }}</span></div>')

  new Vue({
    data: {
      msg: 'hello'
    },
    render: res.render,
    staticRenderFns: res.staticRenderFns
  })
  ```

- **Vea también:** [Funciones Render](../guide/render-function.html)

### Vue.version

- **Detalles**: Provee la version instalada de Vue como una cadena. Esto es especialmente util para plugins y componentes creados por la comunidad, donde usted puede usar diferentes estrategias para diferentes versiones.

- **Uso**:

  ```js
  var version = Number(Vue.version.split('.')[0])

  if (version === 2) {
    // Vue v2.x.x
  } else if (version === 1) {
    // Vue v1.x.x
  } else {
    // Version no soportada de Vue
  }
  ```

## Options / Data

### data

- **Tipo:** `Object | Function`

- **Restricción:** Sólo acepta `Function` cuando es usado en la definición del componente.

- **Detalles:**

  El objeto de datos para la instancia de Vue. Vue convertirá recursivamente sus propiedades en getters/setters para hacerlas reactivas. **El objeto debe ser plano**: los objetos nativos como cada objeto de la API del navegador y propiedades proptotipadas son ignoradas. Una regla de oro es que estos datos solo deberían ser datos - no es recomendado observar objetos con sus propios comportamientos de estado.

  Una vez observado, usted puede no volver a adicionar propiedades a la raíz del objeto de datos. Se recomienda por lo tanto declarar todos las propiedades reactivas por adelantado a nivel de raíz, antes de de crear la instancia.

  Después que se crea la instancia se puede acceder al objeto original de los datos como `vm.$data`. La instancia de Vue también actúa como proxy a todas las propiedades encontradas en el objeto de los datos, así que `vm.a` será el equivalente a `vm.$data.a`.

  Las propiedades que comienzan con `_` o `$` **no** serán proxiadas en la instancia de Vue debido a que pueden causar conflicto con las propiedades internas de Vue y los métodos de la API. Usted tendrá que acceder a ellas como `vm.$data._property`.

  Al definir un **componente**, `data` debe ser declarada como una función que devuelve los datos del objeto inicial, porque habrán muchas instancias creadas usando la misma definición. Si usamos un objeto plano para `data`, este mismo objeto será **compartido por referencia** a través de todas las instancias creadas! Al proporcionar una función `data`, cada vez que una nueva instancia es creada podemos llamarla para devolver una copia reciente de los datos iniciales.

  Si fuera necesario un clon en profundidad del objeto original lo podemos obtener al pasar `vm.$data` mediante `JSON.parse(JSON.stringify(...))`.

- **Ejemplo:**

  ``` js
  var data = { a: 1 }

  // instancia directa de creación
  var vm = new Vue({
    data: data
  })
  vm.a // => 1
  vm.$data === data // => true

  // debe usar la funcion cuando esta en Vue.extend()
  var Component = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

  Note que si usted usa una función flecha con la propiedad `data`, `this` no será la instancia del componente, pero usted puede seguir accediendo a la instancia por el primer argumento de la función:

  ```js
  data: vm => ({ a: vm.myProp })
  ```

- **Ver también:** [Reactividad en profundidad](../guide/reactivity.html)

### props

- **Tipo:** `Array<string> | Object`

- **Details:**

  A list/hash of attributes that are exposed to accept data from the parent component. It has an Array-based simple syntax and an alternative Object-based syntax that allows advanced configurations such as type checking, custom validation and default values.

- **Example:**

  ``` js
  // simple syntax
  Vue.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // object syntax with validation
  Vue.component('props-demo-advanced', {
    props: {
      // type check
      height: Number,
      // type check plus other validations
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: function (value) {
          return value >= 0
        }
      }
    }
  })
  ```

- **See also:** [Props](../guide/components.html#Props)

### propsData

- **Tipo:** `{ [key: string]: any }`

- **Restriction:** only respected in instance creation via `new`.

- **Details:**

  Pass props to an instance during its creation. This is primarily intended to make unit testing easier.

- **Example:**

  ``` js
  var Comp = Vue.extend({
    props: ['msg'],
    template: '<div>{{ msg }}</div>'
  })

  var vm = new Comp({
    propsData: {
      msg: 'hello'
    }
  })
  ```

### computed

- **Tipo:** `{ [key: string]: Function | { get: Function, set: Function } }`

- **Details:**

  Computed properties to be mixed into the Vue instance. All getters and setters have their `this` context automatically bound to the Vue instance.

  Note that if you use an arrow function with a computed property, `this` won't be the component's instance, but you can still access the instance as the function's first argument:

  ```js
  computed: {
    aDouble: vm => vm.a * 2
  }
  ```

  Computed properties are cached, and only re-computed on reactive dependency changes. Note that if a certain dependency is out of the instance's scope (i.e. not reactive), the computed property will __not__ be updated.

- **Example:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // get only
      aDouble: function () {
        return this.a * 2
      },
      // both get and set
      aPlus: {
        get: function () {
          return this.a + 1
        },
        set: function (v) {
          this.a = v - 1
        }
      }
    }
  })
  vm.aPlus   // => 2
  vm.aPlus = 3
  vm.a       // => 2
  vm.aDouble // => 4
  ```

- **See also:** [Computed Properties](../guide/computed.html)

### methods

- **Tipo:** `{ [key: string]: Function }`

- **Details:**

  Methods to be mixed into the Vue instance. You can access these methods directly on the VM instance, or use them in directive expressions. All methods will have their `this` context automatically bound to the Vue instance.

  <p class="tip">Note that __you should not use an arrow function to define a method__ (e.g. `plus: () => this.a++`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.a` will be undefined.</p>

- **Example:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    methods: {
      plus: function () {
        this.a++
      }
    }
  })
  vm.plus()
  vm.a // 2
  ```

- **See also:** [Event Handling](../guide/events.html)

### watch

- **Tipo:** `{ [key: string]: string | Function | Object | Array}`

- **Details:**

  An object where keys are expressions to watch and values are the corresponding callbacks. The value can also be a string of a method name, or an Object that contains additional options. The Vue instance will call `$watch()` for each entry in the object at instantiation.

- **Example:**

  ``` js
  var vm = new Vue({
    data: {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: {
        f: {
          g: 5
        }
      }
    },
    watch: {
      a: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
      // string method name
      b: 'someMethod',
      // deep watcher
      c: {
        handler: function (val, oldVal) { /* ... */ },
        deep: true
      },
      // the callback will be called immediately after the start of the observation
      d: {
        handler: function (val, oldVal) { /* ... */ },
        immediate: true
      },
      e: [
        'handle1',
        function handle2 (val, oldVal) { /* ... */ },
        {
          handler: function handle3 (val, oldVal) { /* ... */ },
          /* ... */
        }
      ],
      // watch vm.e.f's value: {g: 5}
      'e.f': function (val, oldVal) { /* ... */ }
    }
  })
  vm.a = 2 // => new: 2, old: 1
  ```

  <p class="tip">Note that __you should not use an arrow function to define a watcher__ (e.g. `searchQuery: newValue => this.updateAutocomplete(newValue)`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.updateAutocomplete` will be undefined.</p>

- **See also:** [Instance Methods / Data - vm.$watch](#vm-watch)

## Opciones / DOM

### el

- **Tipo:** `string | HTMLElement`

- **Restricción:** solamente respetado al crear instancias usando `new`.

- **Detalles:**

  Proporciona a la instancia de Vue un elemento del DOM existente para montarse. Puede ser un selector CSS o un HTMLElement.

  Una vez que se haya montado la instancia, el elemento resultante estará accesible como `vm.$el`.

  Si esta opción está disponible en la instanciación, la instancia ejecutará inmediatamente la compilación; de lo contrario, el usuario tendrá que llamar explícitamente a `vm.$mount()` para iniciar manualmente la compilación.

  <p class="tip">El elemento proporcionado sirve simplemente como punto de montaje. A diferencia de Vue 1.x, el elemento montado se reemplazará con el DOM generado por Vue en todos los casos. Por lo tanto, no se recomienda montar la instancia raíz en `<html>` o `<body>`.</p>

  <p class="tip">Si no está presente la función `render` ni la opción `template`, el HTML en el DOM del elemento de montaje se extraerá como el *template*. En este caso, se debe utilizar el Runtime + Compilador de Vue.</p>

- **Vea También:**
  - [Diagrama del ciclo de vida](../guide/instance.html#Lifecycle-Diagram)
  - [Runtime + Compilador vs. Solo Runtime](../guide/installation.html#Runtime-Compiler-vs-Runtime-only)

### template

- **Tipo:** `string`

- **Detalles:**

  Un *string* que se usa como plantilla para la instancia de Vue. La plantilla **reemplazará** el elemento montado. Cualquier HTML existente dentro del elemento montado será ignorado, a menos que los *slots* de distribución de contenido estén presentes en la plantilla.

  Si el *string* comienza con `#`, se usará como `querySelector` y usará el `innerHTML` del elemento seleccionado como la plantilla. Esto permite el uso del "truco" `<script type ="x-template ">` para incluir plantillas.

  <p class="tip"> Desde una perspectiva de seguridad, solo debe usar plantillas de Vue en las que pueda confiar. Nunca use contenido generado por el usuario como su plantilla. </p>

  <p class="tip">Si la función de `render` está presente en las opciones de Vue, la plantilla se ignorará. </p>

- **Vea también:**
  - [Diagrama del ciclo de vida](../guide/instance.html#Lifecycle-Diagram)
  - [Distribución de contenido con Slots](../guide/components.html#Content-Distribution-with-Slots)

### render

  - **Tipo:** `(createElement: () => VNode) => VNode`

  - **Detalles:**

    Es una alternativa a las plantillas que le permiten aprovechar todo el poder programático de JavaScript. La función de renderización recibe un método `createElement` como primer argumento utilizado para crear `VNode`s.

    Si el componente es un componente funcional, la función de procesamiento también recibe un argumento `context` adicional, que proporciona acceso a los datos contextuales, ya que los componentes funcionales no tienen instancia.

    <p class="tip">La función `render` tiene prioridad sobre la función de procesamiento compilada desde la opción `template` o la plantilla HTML en el DOM del elemento de montaje que se especifica con la opción `el`. </p>

  - **Vea También:** [Función Render](../guide/render-function.html)

### renderError

> Nuevo en 2.2.0+

  - **Tipo:** `(createElement: () => VNode, error: Error) => VNode`

  - **Detalles:**

    **Solo funciona en modo desarrollo.**

    Proporciona una salida de render alternativa cuando la función predeterminada de `render` encuentra un error. El error se pasará a `renderError` como el segundo argumento. Esto es particularmente útil cuando se usa junto con la recarga *hot-reload*.

  - **Ejemplo:**

    ``` js
    new Vue({
      render (h) {
        throw new Error('ups')
      },
      renderError (h, err) {
        return h('pre', { style: { color: 'red' }}, err.stack)
      }
    }).$mount('#app')
    ```

  - **Vea También:** [Función Render](../guide/render-function.html)

## Opciones / Hooks de Ciclo de Vida

<p class="tip">Todos los _hooks_ de ciclo de vida tienen automáticamente su contexto `this` vinculado a la instancia, de modo que usted puede acceder a datos, propiedades computadas y métodos. Esto significa que __no debe usar una _arrow function_ para definir un método de ciclo de vida__ (por ejemplo, `created: () => this.fetchTodos ()`). La razón es que las _arrow functions_ vinculan el contexto principal, por lo que `this` no será la instancia de Vue como espera y `this.fetchTodos` no estará definido.</p>

### beforeCreate

- **Tipo:** `Function`

- **Detalles:**

  Es invocado sincrónicamente, inmediatamente después de que se ha inicializado la instancia, antes de la observación de datos y la configuración de eventos y observadores.

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### created

- **Tipo:** `Function`

- **Detalles:**

  Se invoca sincrónicamente después de crear la instancia. En este punto, la instancia ha terminado de procesar las opciones, lo que significa que se ha configurado: observación de datos, propiedades computadas, métodos, _callbacks_ de observadores y eventos. Sin embargo, la fase de montaje no ha comenzado y la propiedad `$el` aún no estará disponible.

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### beforeMount

- **Tipo:** `Function`

- **Detalles:**

  Invocado justo antes de que comience el montaje: la función `render` está a punto de ser llamada por primera vez.

  **Este _hook_ no se invoca durante la renderización del lado del servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### mounted

- **Tipo:** `Function`

- **Detalles:**

  Es invocado después de que se ha montado la instancia, donde `el` se reemplaza por el recién creado `vm.$el`. Si la instancia raíz está montada en un elemento en el documento, `vm.$el` también estará en el documento cuando se llame a `mounted`.

  Tenga en cuenta que `mounted` **no** garantiza que todos los componentes secundarios también se hayan montado. Si desea esperar hasta que se haya procesado toda la vista, puede usar [vm.$nextTick](#vm-nextTick) dentro de `mounted`:

  ``` js
  mounted: function () {
    this.$nextTick(function () {
      // Código que se ejecutará solo después de
      // haber renderizado la vista completa
    })
  }
  ```

  **Este _hook_ no se invoca durante la renderización del lado del servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### beforeUpdate

- **Tipo:** `Function`

- **Detalles:**

  Es invocado cuando los datos cambian, antes de que se actualize el DOM. Este es un buen lugar para acceder al DOM existente antes de una actualización, por ejemplo para eliminar _listeners_ de eventos agregados manualmente.

  **Este _hook_ no se invoca durante la renderización del lado del servidor, porque solo la renderización inicial se realiza del lado del servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### updated

- **Tipo:** `Function`

- **Detalles:**

  Invocado después de que un cambio de datos hace que el DOM virtual se vuelva a procesar y actualizar.

  El DOM del componente se habrá actualizado cuando se llame a este _hook_, por lo que puede realizar operaciones dependientes del DOM aquí. Sin embargo, en la mayoría de los casos, debe evitar cambiar el estado dentro del _hook_. Para reaccionar a los cambios de estado, generalmente es mejor usar una [propiedad computada](#computed) o un [watcher](#watch) en su lugar.

  Tenga en cuenta que `updated` **no** garantiza que todos los componentes secundarios también se hayan vuelto a renderizar. Si desea esperar hasta que se haya vuelto a renderizar toda la vista, puede usar [vm.$nextTick](#vm-nextTick) dentro de `updated`:

  ``` js
  updated: function () {
    this.$nextTick(function () {
      // Código que se ejecutará solo después
      // de que se haya vuelto a renderizar toda la vista
    })
  }
  ```

  **Este _hook_ no se invoca durante la renderización del lado del servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### activated

- **Tipo:** `Function`

- **Detalles:**

  Se invoca cuando se activa un componente _kept-alive_

  **Este _hook_ no se invoca durante la renderización del lado del servidor.**

- **Vea también:**
  - [Componentes Built-in - keep-alive](#keep-alive)
  - [Componentes Dinámicos - keep-alive](../guide/components.html#keep-alive)

### deactivated

- **Tipo:** `Function`

- **Detalles:**

  Se invoca cuando se desactiva un componente _kept-alive_

  **Este _hook_ no se invoca durante la renderización del lado del servidor.**

- **Vea también:**
  - [Componentes Built-in - keep-alive](#keep-alive)
  - [Componentes Dinámicos - keep-alive](../guide/components.html#keep-alive)

### beforeDestroy

- **Tipo:** `Function`

- **Detalles:**

  Invocado justo antes de que se destruya una instancia de Vue. En esta etapa, la instancia todavía es completamente funcional.

  **Este _hook_ no se invoca durante la renderización del lado del servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### destroyed

- **Tipo:** `Function`

- **Detalles:**

  Invocado después de que una instancia de Vue ha sido destruida. Cuando se llama a este _hook_, todas las directivas de la instancia de Vue se han desvinculado, todos los _listeners_ de eventos se han eliminado y todas las instancias de Vue secundarias también se han destruido.

  **Este _hook_ no se invoca durante la renderización del lado del servidor.**

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Lifecycle-Diagram)

### errorCaptured

> Nuevo en 2.5.0+

- **Tipo:** `(err: Error, vm: Component, info: string) => ?boolean`

- **Detalles:**

  Se invoca cuando se captura un error de cualquier componente descendiente. El _hook_ recibe tres argumentos: el error, la instancia del componente que disparó el error y una cadena que contiene información sobre dónde se capturó el error. El _hook_ puede devolver `falso` para evitar que el error se propague aún más.

  <p class="tip">Puede modificar el estado del componente en este _hook_. Sin embargo, es importante tener condicionales en su _template_ o función de renderización que alterne otro contenido cuando se haya capturado un error; de lo contrario, el componente caerá en un bucle de renderización infinito.</p>

  **Reglas de Propagación de Errores**

  - De forma predeterminada, todos los errores aún se envían al `config.errorHandler` global si está definido, por lo que estos errores aún se pueden informar a un servicio de análisis en un solo lugar.

  - Si existen múltiples _hooks_ `errorCaptured` en una cadena de herencia de componentes, todos serán invocados por el mismo error.

  - Si el _hook_ `errorCaptured` dispara un error, tanto este error como el error original se capturan y se envían al `config.errorHandler` global.

  - Un _hook_ `errorCaptured` puede devolver `falso` para evitar que el error continúe propagándose. Esto esencialmente diría "este error ya ha sido manejado y debe ignorarse". Evitará cualquier _hook_ adicional de `ErrorCaptured` y el error invocará el `config.errorHandler` global.

## Opciones / Recursos

### directives

- **Tipo:** `Object`

- **Detalles:**

  Un conjunto de directivas que se pondrán a disposición para la instancia Vue.

- **Vea también:** [Directivas Personalizadas](../guide/custom-directive.html)

### filters

- **Tipo:** `Object`

- **Detalles:**

  Un conjunto de filtros que se pondrán a disposición para la instancia Vue.

- **Vea también:** [`Vue.filter`](#Vue-filter)

### components

- **Tipo:** `Object`

- **Detalles:**

  Un conjunto de componentes que se pondrán a disposición para la instancia Vue.

- **Vea también:** [Componentes](../guide/components.html)

## Opciones / Composición

### parent

- **Tipo:** `Vue instance`

- **Detalles:**

  Especifica la instancia padre para la instancia que será creada. Establece la relación padre-hijo entre ambas. El padre será accesible como `this.$parent` para el hijo, y el hijo será insertado en el arreglo `$children` del padre.

  <p class="tip">Use `$parent` y `$children` con moderación. Prefiera el uso de _props_ y eventos para la comunicación entre padre y hijo.</p>

### mixins

- **Tipo:** `Array<Object>`

- **Detalles:**

  La opción `mixins` acepta un arreglo de objetos _mixin_. Estos objetos pueden contener opciones de instancia, así como instancias de objetos normales, y luego serán combinados con las eventuales opciones utilizando la misma lógica de combinación que en `Vue.extend()`. Por ejemplo, sí su `mixin` contiene el _hook_ _created_ y su componente también lo tiene, ambas funciones serán invocadas.

  Los _hooks_ de _mixin_ son invocados en el orden que son proporcionados, e invocados antes que los _hooks_ del componente.

- **Ejemplo:**

  ``` js
  var mixin = {
    created: function () { console.log(1) }
  }
  var vm = new Vue({
    created: function () { console.log(2) },
    mixins: [mixin]
  })
  // => 1
  // => 2
  ```

- **Vea también:** [Mixins](../guide/mixins.html)

### extends

- **Tipo:** `Object | Function`

- **Detalles:**

  Permite extender declarativamente otro componente (puede ser tanto un objeto plano con opciones como un constructor) sin tener que utilizar `Vue.extend`. Esto está destinado principalmente a facilitar la extensión entre componente _single-file_.

  Esto es similar a los `mixinis`.

- **Ejemplo:**

  ``` js
  var CompA = { ... }

  // extiende CompA sin tener que invocar `Vue.extend`
  var CompB = {
    extends: CompA,
    ...
  }
  ```

### provide / inject

> Nuevo en 2.2.0+

- **Tipo:**
  - **provide:** `Object | () => Object`
  - **inject:** `Array<string> | { [key: string]: string | Symbol | Object }`

- **Detalles:**

  <p class="tip">`provide` e `inject` se proporcionan principalmente para casos de uso avanzados en _plugins_ / componentes. NO es recomendado su uso en código de una aplicación genérica.</p>

  Este par de opciones son utilizadas conjuntamente para hacer posible que un componente padre sirva como un inyector de dependencias para todos sus descendientes, independientemente de la profunidad de la jerarquía de componentes, siempre que esten en la misma cadena "familiar". Si usted está familiarizado con React, esto es muy similar a la funcionalidad _context_ de React.

  La opción `provide` debe ser un objeto o una función que retorna un objeto. Este objeto contiene las propiedades que están disponibles para ser inyectadas en sus descendientes. Usted puede usar _ES2015 Symbols_ como claves en este objeto, pero solo en ambientes que soportan nativamente `Symbol` y `Reflect.ownKeys`.

  La opción `inject` debe ser una de las siguientes opciones:

  - un arreglo de _string_, o
  - un objeto cuyas claves hacen referencia a los nombres de _bind_ locales y los valores son:
    - la clave (_string_ o _Symbol_) para buscar en las inyecciones disponibles, o
    - un objeto donde:
      - la propiedad `from` es la clave (_string_ o _Symbol_) para buscar en las inyecciones disponibles, y
      - la propiedad `default` es utilizada como valor por defecto

  > Nota: los _binds_ `provide` e `inject` NO son reactivos. Esto es intencional. Sin embargo, si usted provee un objeto _observed_, las propiedades en ese objeto se mantienen reactivas.

- **Ejemplo:**

  ``` js
  // componente padre proporcionando 'foo'
  var Provider = {
    provide: {
      foo: 'bar'
    },
    // ...
  }

  // componente hijo inyectando 'foo'
  var Child = {
    inject: ['foo'],
    created () {
      console.log(this.foo) // => "bar"
    }
    // ...
  }
  ```

  Con _ES2015 Symbols_, función `provide` y objeto `inject`:
  ``` js
  const s = Symbol()

  const Provider = {
    provide () {
      return {
        [s]: 'foo'
      }
    }
  }

  const Child = {
    inject: { s },
    // ...
  }
  ```

  > Los próximos dos ejemplos funcionan con Vue 2.2.1+. En versiones anteriores, los valores inyectados eran resueltos luego de la inicilización de las `props` y `data`.

  Utilizando un valor inyectado como el valor por defecto de una _prop_:
  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default () {
          return this.foo
        }
      }
    }
  }
  ```

  Utilizando un valor inyectado como una entrada para `data`:
  ```js
  const Child = {
    inject: ['foo'],
    data () {
      return {
        bar: this.foo
      }
    }
  }
  ```

  > En 2.5.0+ las inyecciones pueden ser opcionales con un valor por defecto:

  ``` js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Si necesita ser inyectado desde una propiedad con un nombre diferente, utilize `from` para denotar la propiedad de origen:

  ``` js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Similar a los valores por defecto de las _props_, usted debe utilizar una función _factory_ para valores no primitivos:

  ``` js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

## Opciones / Misceláneas

### name

- **Tipo:** `string`

- **Restricción:** solo se respeta cuando es utilizada como opción de componente.

- **Detalles:**

  Permite al componente invocarse recursivamente en su propia plantilla. Note que cuando un componente se registra globalmente con `Vue.component()`, el ID global se configura automáticamente como su nombre.

  Otro beneficio de especificar la opción `name` es para el depurado. Componentes con nombre resultan en mensajes de advertencia más útiles. También, al inspeccionar una aplicación con las [vue-devtools](https://github.com/vuejs/vue-devtools), componentes sin nombre se mostrarán como `<AnonymousComponent>`, lo cual no es muy informativo. Al proveer la opción `name`, usted obtendrá un árbol de componentes mucho más informativo.

### delimiters

- **Tipo:** `Array<string>`

- **Por defecto:** `{% raw %}["{{", "}}"]{% endraw %}`

- **Restricciones:** solo disponible en la distribución completa, con compilación en el navegador.

- **Detalles:**

  Cambia los delimitadores para la interpolación de texto.

- **Ejemplo:**

  ``` js
  new Vue({
    delimiters: ['${', '}']
  })

  // Cambia los delimitadores al estilo de plantillas de string de ES6
  ```

### functional

- **Tipo:** `boolean`

- **Detalles:**

  Causa que un componente sea sin estado (sin `data`) y sin instancia (no tendrá contexto `this`). Son simplemente una función de renderizado que retorna nodos virtuales, lo cual las hace mucho más baratas de renderizar.

- **Vea también:** [Componente Funcionales](../guide/render-function.html#Functional-Components)

### model

> New in 2.2.0

- **Tipo:** `{ prop?: string, event?: string }`

- **Detalles:**

  Permite en un componente personalizado customizar la propiedad y el evento al utilizarlo con `v-model`. Por defecto, `v-model` en un componente utiliza `value` como la propiedad e `input` como el evento. Pero en algunos tipos de inputs como _checkboxes_ y _radio buttons_ usted podría desear utilizar la propiedad `value` para un propósito diferente. Utilizar la opción `model` puede evitar conflictos en dichos casos.

- **Ejemplo:**

  ``` js
  Vue.component('my-checkbox', {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      // esto permite utilizar la propiedad `value` para un propósito diferente
      value: String,
      // utiliza `checked` como la propiedad que toma el lugar de `value`
      checked: {
        type: Number,
        default: 0
      }
    },
    // ...
  })
  ```

  ``` html
  <my-checkbox v-model="foo" value="some value"></my-checkbox>
  ```

  Esto será equivalente a:

  ``` html
  <my-checkbox
    :checked="foo"
    @change="val => { foo = val }"
    value="some value">
  </my-checkbox>
  ```

### inheritAttrs

> New in 2.4.0+

- **Tipo:** `boolean`

- **Por defecto:** `true`

- **Detalles:**

  Por defecto, atributos _binded_ en el _scope_ del componente padre que no son reconocidos como _props_ serán aplicados al elemento raíz del componente hijo como atributos normales de HTML. Al implementar un componente con el objetivo de envolver otro elemento y otro componente, este podría no ser el comportamiento deseado. Asignando el valor `false` a la opción `inheritAttrs`, este comportamiento por defecto puede ser deshabilitado. Los atributos estarán disponibles en la propiedad de instancia `$attrs` (también nueva en la versión 2.4) y pueden ser explícitamente vinculados a un elemento que no es la raíz utilizando `v-bind`.

  Nota: esta opción **no** afecta los _bindings_ de `class` y `style`.

### comments

> New in 2.4.0+

- **Tipo:** `boolean`

- **Por defecto:** `false`

- **Restricciones:** solo disponible en la distribución completa, con compilación en el navegador.

- **Detalles:**

  Cuando es `true`, se preservarán y renderizarán los comentarios HTML encontrados en la plantilla. El comportamiento por defecto es descartarlos.

## Propiedades de Instancia

### vm.$data

- **Tipo:** `Object`

- **Detalles:**

  El objeto _data_ que la instancia Vue está observando. La instancia Vue provee acceso a estas propiedades en su objeto _data_.

- **Vea también:** [Opciones / Data - data](#data)

### vm.$props

> Nuevo en 2.2.0+

- **Tipo:** `Object`

- **Detalles:**

  Un objeto representando las propiedades actuales que un componente recibió. La instancia Vue provee acceso a estas propiedades en su objeto _props_.

  An object representing the current props a component has received. The Vue instance proxies access to the properties on its props object.

### vm.$el

- **Tipo:** `HTMLElement`

- **Solamente lectura**

- **Detalles:**

  Elemento raíz del DOM que gestiona la instancia Vue.

### vm.$options

- **Tipo:** `Object`

- **Solamente lectura**

- **Detalles:**

  Las opciones de instanciación utilizadas en la instancia Vue actual. Esto es útil cuando usted desea incluir propiedades personalizadas en las opciones:

  ``` js
  new Vue({
    customOption: 'foo',
    created: function () {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

### vm.$parent

- **Tipo:** `Vue instance`

- **Solamente lectura**

- **Detalles:**

  La instancia padre, si la instancia actual tiene una.

### vm.$root

- **Tipo:** `Vue instance`

- **Solamente lectura**

- **Detalles:**

  La instancia Vue raíz del árbol de componentes actual. Sí la instancia actual no tiene un padre, este valor será el componente mismo.

### vm.$children

- **Tipo:** `Array<Vue instance>`

- **Solamente lectura**

- **Detalles:**

  Los componentes hijos directos de la instancia actual. **Note que no hay garantía de orden para `$children`, y que esta propiedad no es reactiva.** Si usted encuentra la necesidad de utilizar `$children` para _binding_ de datos, considre utilizar un arreglo y `v-for` para generar los componentes hijos y utilize ese arreglo como la fuente de la verdad.

### vm.$slots

- **Tipo:** `{ [name: string]: ?Array<VNode> }`

- **Solamente lectura**

- **Detalles:**

  Utilizado para acceder programaticamente al contenido [distribuido por los _slots_](../guide/components.html#Content-Distribution-with-Slots). Cada [_slot_ con nombre](../guide/components.html#Named-Slots) tiene su propia propiedad correspondiente (por ejemplo, el contenido de `slot=foo` se encontrará en `vm.$slots.foo`). La propiedad `default` contiene cualquier nodo que no esté incluido en un _slot_ con nombre.

  Acceder a `vm.$slots` es útil cuando se está implementando un componente con [función de renderizado](../guide/render-function.html).

- **Ejemplo:**

  ```html
  <blog-post>
    <h1 slot="header">
      About Me
    </h1>

    <p>Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.</p>

    <p slot="footer">
      Copyright 2016 Evan You
    </p>

    <p>If I have some content down here, it will also be included in vm.$slots.default.</p>.
  </blog-post>
  ```

  ```js
  Vue.component('blog-post', {
    render: function (createElement) {
      var header = this.$slots.header
      var body   = this.$slots.default
      var footer = this.$slots.footer
      return createElement('div', [
        createElement('header', header),
        createElement('main', body),
        createElement('footer', footer)
      ])
    }
  })
  ```

- **Vea también:**
  - [Componente `<slot>`](#slot-1)
  - [Distribución de contendo con Slots](../guide/components.html#Content-Distribution-with-Slots)
  - [Funciones de Renderizado - Slots](../guide/render-function.html#Slots)

### vm.$scopedSlots

> Nuevo en 2.1.0+

- **Tipo:** `{ [name: string]: props => VNode | Array<VNode> }`

- **Solamente lectura**

- **Detalles:**

  Utilizado para acceder programaticamente a [scoped slots](../guide/components.html#Scoped-Slots). Para cada _slot_, incluyendo el _slot_ `default`, el objeto contiene una función correspondiente que retorna _VNodes_.

  Acceder a `vm.$scopedSlots` es útil cuando se está implementando un componente con [función de renderizado](../guide/render-function.html).

- **Vea también:**
  - [Componente `<slot>`](#slot-1)
  - [Distribución de contendo con Slots](../guide/components.html#Content-Distribution-with-Slots)
  - [Funciones de Renderizado - Slots](../guide/render-function.html#Slots)

### vm.$refs

- **Tipo:** `Object`

- **Solamente lectura**

- **Detalles:**

  Un objeto de elementos del DOM e instancias de componentes, registrados con [atributos `ref`](#ref).

- **Vea también:**
  - [Referencias a Componentes Hijos](../guide/components.html#Child-Component-Refs)
  - [Atributos Especiales - ref](#ref)

### vm.$isServer

- **Tipo:** `boolean`

- **Solamente lectura**

- **Detalles:**

  Retorna si la instancia Vue actual está siendo ejecutada en un servidor.

- **Vea también:** [Renderizado del lado de Servidor](../guide/ssr.html)

### vm.$attrs

> Nuevo en 2.4.0+

- **Tipo:** `{ [key: string]: string }`

- **Solamente lectura**

- **Detalles:**

  Contiene _bindings_ de atributos del _scope_ del componente padre (excepto para `class` y `style`) que no son reconocidos como _props_. Cuando un componente no tiene _props_ declaradas, esta propiedad contiene todos los _bindings_ de atributos del _scope_ del componente padre (excepto `class` y `style`), y puede ser pasada a un componente interno vía `v-bind="$attrs"` - útil cuando se quiere implementar componentes de orden superior.

### vm.$listeners

> Nuevo en 2.4.0+

- **Tipo:** `{ [key: string]: Function | Array<Function> }`

- **Solamente lectura**

- **Detalles:**

  Contiene escucha de eventos (_event listeners_) de `v-on` en el _scope_ del componente padre (sin modificadores `.native`). Esta propiedad puede ser pasada a un componente interno vía `v-on="$listeners"` - útil cuando se quiere implementer componentes envolventes transparentes.

## Métodos de Instancia / Datos

### vm.$watch( expOrFn, callback, [options] )

- **Argumentos:**
  - `{string | Function} expOrFn`
  - `{Function | Object} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **Retorna:** `{Function} unwatch`

- **Uso:**

  Observa por cambios en una expresión o función computada en la instancia de Vue. La función _callback_ es llamada con el nuevo y el antiguo valor. La expresión solamente acepta caminos delimitados por puntos. Para expresiones más complejas, utilice una función.

<p class="tip">Nota: cuando se está alterando (en vez de reemplazando) un Objeto o un Arreglo, el antiguo valor será igual al nuevo, ya que estos referencian al mismo Objeto/Arreglo. Vue no mantiene una copia del valores antes de que estos sean mutados.</p>

- **Ejemplo:**

  ``` js
  // camino de la clave
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // hacer algo
  })

  // función
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (newVal, oldVal) {
      // hacer algo
    }
  )
  ```

  `vm.$watch` retorna una función _unwatch_ que para de lanzar la función _callback_:

  ``` js
  var unwatch = vm.$watch('a', cb)
  // luego, destruir el `watcher`
  unwatch()
  ```

- **Opción: deep**

  Para también detectar valores anidados dentro de Objetos, usted debe pasar `deep: true` en las opciones. Note que usted no necesita realizar esto para mutaciones de Arreglos.

  ``` js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // se disparará la función `callback`
  ```

- **Opción: immediate**

  Pasar `immediate: true` en las opciones disparará la función _callback_ inmediatamente con el nuevo valor de la expresión:

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // se disparará el `callback` inmediatamente con el nuevo valor de `a`
  ```

### vm.$set( target, key, value )

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key`
  - `{any} value`

- **Retorna:** el valor asignado.

- **Uso:**

  Este es un **alias** para la función global `Vue.set`.

- **Vea también:** [Vue.set](#Vue-set)

### vm.$delete( target, key )

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key`

- **Uso:**

  Este es un **alias** para la función global `Vue.delete`.

- **See also:** [Vue.delete](#Vue-delete)

## Métodos de Instancia / Eventos

### vm.$on( event, callback )

- **Argumentos:**
  - `{string | Array<string>} event` (arreglo solamente es soportado en 2.2.0+)
  - `{Function} callback`

- **Uso:**

  Escucha un evento personalizado en la _vm_ actual. Los eventos pueden ser disparados utilizado `vm.$emit`. La función _callback_ recibirá todos los argumentos adicionales en los métodos que disparan eventos.

- **Ejemplo:**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'hi')
  // => "hi"
  ```

### vm.$once( event, callback )

- **Argumentos:**
  - `{string} event`
  - `{Function} callback`

- **Uso:**

  Escucha un evento personalizado, pero solamente una vez. El _listener_ será removido una vez que es disparado por primera vez.

### vm.$off( [event, callback] )

- **Argumentos:**
  - `{string | Array<string>} event` (arreglo solamente es soportado en 2.2.2+)
  - `{Function} [callback]`

- **Uso:**

  Remover escuchas (_listeners_) de evento(s) personalizado(s).

  - Si ningún argumento es proporcionado, remueve todas las escuchas (_listeners_) a eventos.

  - Si solamente el evento es proporcionado, remueve todas las escuchas (_listeners_) para ese evento.

  - Si tanto el evento como la función _callback_ son proporcionados, remueve solamente la escucha (_listener_) para esa función _callback_ específica.

### vm.$emit( eventName, [...args] )

- **Argumentos:**
  - `{string} eventName`
  - `[...args]`

  Dispara un evento en la instancia actual. Cualquier argumento adicional será pasado a la función _callback_ de escucha (_listener_).

- **Ejemplos:**

  Utilizar `$emit` solamente con un nombre de evento:

  ```js
  Vue.component('welcome-button', {
    template: `
      <button v-on:click="$emit('welcome')">
        Click me to be welcomed
      </button>
    `
  })
  ```
  ```html
  <div id="emit-example-simple">
    <welcome-button v-on:welcome="sayHi"></welcome-button>
  </div>
  ```
  ```js
  new Vue({
    el: '#emit-example-simple',
    methods: {
      sayHi: function () {
        alert('Hi!')
      }
    }
  })
  ```
  {% raw %}
  <div id="emit-example-simple" class="demo">
    <welcome-button v-on:welcome="sayHi"></welcome-button>
  </div>
  <script>
    Vue.component('welcome-button', {
      template: `
        <button v-on:click="$emit('welcome')">
          Click me to be welcomed
        </button>
      `
    })
    new Vue({
      el: '#emit-example-simple',
      methods: {
        sayHi: function () {
          alert('Hi!')
        }
      }
    })
  </script>
  {% endraw %}

  Utilizar `$emit` con argumentos adicionales:

  ```js
  Vue.component('magic-eight-ball', {
    data: function () {
      return {
        possibleAdvice: ['Yes', 'No', 'Maybe']
      }
    },
    methods: {
      giveAdvice: function () {
        var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length)
        this.$emit('give-advice', this.possibleAdvice[randomAdviceIndex])
      }
    },
    template: `
      <button v-on:click="giveAdvice">
        Click me for advice
      </button>
    `
  })
  ```

  ```html
  <div id="emit-example-argument">
    <magic-eight-ball v-on:give-advice="showAdvice"></magic-eight-ball>
  </div>
  ```

  ```js
  new Vue({
    el: '#emit-example-argument',
    methods: {
      showAdvice: function (advice) {
        alert(advice)
      }
    }
  })
  ```

  {% raw %}
  <div id="emit-example-argument" class="demo">
    <magic-eight-ball v-on:give-advice="showAdvice"></magic-eight-ball>
  </div>
  <script>
    Vue.component('magic-eight-ball', {
      data: function () {
        return {
          possibleAdvice: ['Yes', 'No', 'Maybe']
        }
      },
      methods: {
        giveAdvice: function () {
          var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length)
          this.$emit('give-advice', this.possibleAdvice[randomAdviceIndex])
        }
      },
      template: `
        <button v-on:click="giveAdvice">
          Click me for advice
        </button>
      `
    })
    new Vue({
      el: '#emit-example-argument',
      methods: {
        showAdvice: function (advice) {
          alert(advice)
        }
      }
    })
  </script>
  {% endraw %}

## Métodos de Instancia / Ciclo de vida

### vm.$mount( [elementOrSelector] )

- **Argumentos:**
  - `{Element | string} [elementOrSelector]`
  - `{boolean} [hydrating]`

- **Retorna:** `vm` - la propia instancia

- **Uso:**

  Si la instancia de Vue no recibió la opción `el` durante la instanciación, ella estará en el estado "no montada" sin un elemento del DOM asociado. `vm.$mount()` puede ser utilizado para comenzar a montar una instancia de Vue no montada.

  Si el argumento `elementOrSelector` no es provisto, la plantilla será renderizará como un elemento "fuera del documento", y usted deberá utilizar la API nativa del DOM para insertarla en el documento.

  El método retorna la propia instancia para que usted pueda encadenar otros métodos de instancia luego.

- **Ejemplo:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // crea y monta en #app (reemplazará #app)
  new MyComponent().$mount('#app')

  // el ejemplo de arriba es equivalente a:
  new MyComponent({ el: '#app' })

  // o, renderizar "fuera del documento" y agregarla luego:
  var component = new MyComponent().$mount()
  document.getElementById('app').appendChild(component.$el)
  ```

- **Vea también:**
  - [Diagrama de Ciclo de Vida](../guide/instance.html#Diagrama-del-Ciclo-de-vida)
  - [Renderizado del lado de Servidor](../guide/ssr.html)

### vm.$forceUpdate()

- **Uso:**

  Fuerza a la instancia de Vue a renderizarse nuevamente. Note que esto no afecta a todos sus componentes hijos, solamente a la propia instancia y componentes hijos con contenido insertado en _slot_.

### vm.$nextTick( [callback] )

- **Argumentos:**
  - `{Function} [callback]`

- **Uso:**

  Pospone la ejecución de la función _callback_ para luego del próximo ciclo de actualización del DOM. Utilice este método inmediatamente luego de modificar datos para esperar por la actualización del DOM. Este método es el mismo que el método global `Vue.nextTick`, excpeto que el contexto `this` de la función _callback_ es automáticamente vinculado a la instancia que invoco este método.

  > Nuevo en 2.1.0+: retorna una promesa (_Promise_) si no fue provista una función _callback_ y estas son soportadas en el entorno de ejecución. Note que Vue no trae un _polyfill_ para promesas, por lo tanto, si su navegador no soporta promesas de forma nativa (mirándote, IE), usted deberá agregar un _polyfill_ por su cuenta.

- **Ejemplo:**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // modificar datos
        this.message = 'changed'
        // el DOM no está actualizado todavía
        this.$nextTick(function () {
          // el DOM está actualizado
          // `this` está vinculado a la instancia actual
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **Vea también:**
  - [Vue.nextTick](#Vue-nextTick)
  - [Cola de actualización asíncrona](../guide/reactivity.html#Cola-de-actualizacion-asincrona)

### vm.$destroy()

- **Uso:**

  Destruir completamente una `vm`. Limpia todas sus conexiones con otras `vms` existentes, desvincula todas sus directivas y apaga todas sus escuchas (_listeners_) a eventos.

  Dispara los `hooks` `beforeDestroy` y `destroyed`.

  <p class="tip">En casos de uso normales no debería necesitar llamar a este método. Prefiera controlar el ciclo de vida de componentes hijos de una forma orientada a datos utilizando `v-if` y `v-for`</p>

- **Vea también:** [Diagrama de Ciclo de Vida](../guide/instance.html#Diagrama-del-Ciclo-de-vida)

## Directivas

### v-text

- **Espera:** `string`

- **Detalles:**

  Actualiza el `textContent` del elemento. Si usted necesita actualizar parte del `textContent`, usted debe utilizar interpolaciones `{% raw %}{{ Mustache }}{$ endraw %}`.

- **Ejemplo:**

  ```html
  <span v-text="msg"></span>
  <!-- es equivalente a -->
  <span>{{msg}}</span>
  ```

- **Vea también:** [Sintaxis de Template - Interpolaciones](../guide/syntax.html#Texto)

### v-html

- **Espera:** `string`

- **Detalles:**

  Actualiza el `innerHTML` del elemento. **Note que los contenidos son insertados como HTML puro - no serán compilados como pantillas (_templates_) de Vue**. Si usted se encuentra intentando componer plantillas utilizando `v-html`, intente pensar una solución utilizando componentes.

  <p class="tip">Renderizar dinámicamente HTML arbitrario en su sitio web puede ser muy peligroso porque puede conducir fácilmente a [ataques XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Solo use `v-html` en contenido confiable y **nunca** en contenido provisto por el usuario.</p>

  <p class="tip">En [Componentes de un solo archivo](../guide/single-file-components.html), los estilos `scoped` no aplicarán al contenido dentro de `v-html`, porque el HTML no será procesado por el compilador de pantillas de Vue. Si usted quiere aplicar estilos _scoped_ al contendio `v-html`, puede utilizar [módulos CSS](https://vue-loader.vuejs.org/en/features/css-modules.html) o un elemento `<style>` global adicional, con una estrategia como BEM por ejemplo. </div>

- **Ejemplo:**

  ```html
  <div v-html="html"></div>
  ```

- **Vea también:** [Sintaxis de Template - Interpolaciones](../guide/syntax.html#HTML-Puro)

### v-show

- **Espera:** `any`

- **Uso:**

  Cambia la propiedad CSS `display` del elemento basado en la veracidad del valor de la expresión.

  La directiva dispara transiciones cuando su condición cambia.

- **Vea también:** [Renderización condicional - v-show](../guide/conditional.html#v-show)

### v-if

- **Espera:** `any`

- **Uso:**

  Renderiza condicionalmente el elemento basado en la veracidad del valor de la expresión. El elemento y sus directivas / componentes son destruidas y re-construidas al cambiar el valor de la expresión. Si el elemento es un `<template>`, su contenido será extraído como un bloque condicional.

  Esta directiva dispara transiciones cuando su condición cambia.

  <p class="tip">Cuando se utiliza en conjunto con v-if, v-for tiene una prioridad mayor. Vea <a href="../guide/list.html#v-for-with-v-if">guía de renderizado de listas</a> para más detalles.</p>

- **Vea también:** [Renderización condicional - v-if](../guide/conditional.html)

### v-else

- **No espera una expresión**

- **Restricción:** el elemento hermano previo deb ser `v-if` o `v-else-if`.

- **Uso:**

  Denota el "bloque _else_" para `v-if` o una cadena `v-if`/`v-else-if`.

  ```html
  <div v-if="Math.random() > 0.5">
    Ahora me ve
  </div>
  <div v-else>
    Ahora no
  </div>
  ```

- **Vea también:** [Renderización condicional - v-else](../guide/conditional.html#v-else)

### v-else-if

> Nuevo en 2.1.0+

- **Espera:** `any`

- **Restricción:** el elemento hermano previo deb ser `v-if` o `v-else-if`.

- **Uso:**

  Denota el "bloque _else if_" para `v-if` . Puede ser encadenado.

  ```html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **Vea también:** [Renderización condicional - v-else-if](../guide/conditional.html#v-else-if)

### v-for

- **Espera:** `Array | Object | number | string`

- **Uso:**

  Renderiza el elemento o plantilla mutiples veces basado en la fuente de información. El valor de la directiva debe utilizar la sintaxis especial `alias in expresion` para proveer un alias para el elemento actual en el cual se está iterando:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```
  Alternativamente, usted también puede especificar un alias para índice (o la clave si es utilizado con un Objeto):

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  El comportamiento por defecto de `v-for` intentará corregir los elementos _in-place_ sin moverlos. Para forzar un reordanamiento de elementos, usted debe proveer una pista de ordenamiento con el atributo especial `key`:

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```
  <p class="tip">Cuando se utiliza en conjunto con v-if, v-for tiene una prioridad mayor. Vea <a href="../guide/list.html#v-for-with-v-if">guía de renderizado de listas</a> para más detalles.</p>

  El uso detallado de `v-for` se explica en la sección de guía referenciada abajo.

- **Vea también:**
  - [Renderizado de lista](../guide/list.html)
  - [key](../guide/list.html#key)

### v-on

- **Abreviación:** `@`

- **Espera:** `Function | Inline Statement | Object`

- **Argumento:** `event`

- **Modificadores:**
  - `.stop` - invoca `event.stopPropagation()`.
  - `.prevent` - invoca `event.preventDefault()`.
  - `.capture` - agrega escucha de eventos (_event listeners_) en modo de captura.
  - `.self` -  invoca el manejador solo si el evento fue disparada por este elemento.
  - `.{keyCode | keyAlias}` - invoca el manejador solo con algunas teclas.
  - `.native` - escucha por un evento nativo en el elemento raíz del componente.
  - `.once` - invoca el manejador a lo sumo una vez.
  - `.left` - (2.2.0+) invoca el manejador solo para _clicks_ izquierdos del mouse.
  - `.right` - (2.2.0+) invoca el manejador solo para _clicks_ derechos del mouse.
  - `.middle` - (2.2.0+) invoca el manejador solo para _clicks_ del botón del medio del mouse.
  - `.passive` - (2.3.0+) agrega un evento al DOM con `{ passive: true }`.

- **Uso:**

  Agrega una escucha de evento (_event listener_) al elemento. El tipo del evento es denotado por el argumento. La expresión puede ser el nombre de un método, una declaración _inline_ u omitida cuando hay modificadores.

  Cuando es utilizada en un elemento normal, escucha solo por [**evento nativos del DOM**](https://developer.mozilla.org/en-US/docs/Web/Events). Cuando es utilizada en un componente, escucha por **evento personalizados** emitidos por ese componente hijo.

  Cuando se escucha por eventos nativos del DOM, el método recibe el evento nativo como único argumento. Si se utiliza una declaración _inline_, la declaración tiene acceso a la propiedad especial `$event`: `v-on:click="handle('ok', $event)"`.

  A partir de 2.4.0+, `v-on` también soporta vinculación a un objeto de pares de _event/listener_ sin argumentos. Note que cuando se utliza la sintaxis de objeto, esta no soporta ningún modificador.

- **Ejemplo:**

  ```html
  <!-- método como manejador -->
  <button v-on:click="doThis"></button>

  <!-- declaración en línea (inline) -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- abreviación -->
  <button @click="doThis"></button>

  <!-- detener la propagación -->
  <button @click.stop="doThis"></button>

  <!-- prevenir el comportamiento por defecto -->
  <button @click.prevent="doThis"></button>

  <!-- prevenir el comportamiento por defecto sin expresión alguna -->
  <form @submit.prevent></form>

  <!-- modificadores en cadena -->
  <button @click.stop.prevent="doThis"></button>

  <!-- modificador de tecla utilizando keyAlias -->
  <input @keyup.enter="onEnter">

  <!-- modificador de tecla utilizando keyCode -->
  <input @keyup.13="onEnter">

  <!-- el evento click será lanzado a lo sumo una vez -->
  <button v-on:click.once="doThis"></button>

  <!-- sintaxis de objeto (2.4.0+) -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Escucha a eventos personalizados en un componente hijo (el manejador es invocado cuando "my-event" es emitido en el hijo):

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- declaración inline -->
  <my-component @my-event="handleThis(123, $event)"></my-component>

  <!-- evento nativo en el componenete -->
  <my-component @click.native="onClick"></my-component>
  ```

- **Vea también:**
  - [Manejo de eventos](../guide/events.html)
  - [Componentes - Eventos Personalizados](../guide/components-custom-events.html)

### v-bind

- **Abreviación:** `:`

- **Espera:** `any (con argumento) | Object (sin argumento)`

- **Argumento:** `attrOrProp (opcional)`

- **Modificadores:**
  - `.prop` - Enlazar como una propiedad del DOM en vez de como un atributo ([¿cuál es la diferencia?](https://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028)). Si la etiqueta es un componente, entonces `.prop` asignara la propiedad en el `$el` del componente.
  - `.camel` - (2.1.0+) transforma el nombre del atributo de kebab-case a camelCase.
  - `.sync` - (2.3.0+) un "azúcar sintáctico: que se expande en un `v-on` para actualizar el valor enlazado.

- **Uso:**

  Enlaza dinámicamente uno o más atributos, o una propiedad de un componente a una expresión.

  Cuando se utiliza para enlazar el atributo `class` o `style`, soporta atributos adicionales tales como Arreglos u Objetos. Vea la sección de guía referenciada abajo para más detalles.

  Cuando se utiliza para enlazar una propiedad, la propiedad debe ser declarada en el componente hijo de forma acorde.

  Cuando se utiliza sin argumento, puede ser utilizado para enlazar un objeto que contega pares nombre-valor de atributos. Note que en este modo los atributos `class` y `style` no soportan Arreglo u Objetos.

- **Ejemplo:**

  ```html
  <!-- enlazar un atributo -->
  <img v-bind:src="imageSrc">

  <!-- abreviación -->
  <img :src="imageSrc">

  <!-- con concatenación en línea de string -->
  <img :src="'/path/to/images/' + fileName">

  <!-- enlace del atributo class -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- enlace del atributo style -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- enlazar un objeto a un atributo -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- enlazar un atributo del DOM con el modificador .prop -->
  <div v-bind:text-content.prop="text"></div>

  <!-- enlace de una propiedad (prop). "prop" debe ser decalrada en my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- pasar las propiedad en común al componente hijo -->
  <child-component v-bind="$props"></child-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  El modificador `.camel` permite transformar a camelCase el nombre de un atributo `v-bind` al usar en plantillas _in-DOM_, por ejemplo el atributo `viewBox` de SVG:

  ``` html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` no es necesario si usted utiliza plantillas de _string_, o compila utilizando `vue-loader`/`vuetify`.

- **Vea también:**
  - [Enlace Clases y Estilos](../guide/class-and-style.html)
  - [Componentes - Propiedades](../guide/components.html#Props)
  - [Componentes - Modificador `.sync`](../guide/components.html#sync-Modifier)

### v-model

- **Espera:** varía basado en el valor del input del formulario o salida de componentes

- **Limitado a:**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - componentes

- **Modificadores:**
  - [`.lazy`](../guide/forms.html#lazy) - escucha un evento `change` en vez de `input`
  - [`.number`](../guide/forms.html#number) - castea input válido de _string_ a número
  - [`.trim`](../guide/forms.html#trim) - recorte automático

- **Uso:**

  Crea un enlace bidireccional (_two way binding_) en un elemento de formulario o componente. Por más detalles de su uso y otras notas, vea la sección de guía referenciada abajo.

- **Vea también:**
  - [Binding en Formularios](../guide/forms.html)
  - [Componentes - Form Input Components using Custom Events](../guide/components.html#Form-Input-Components-using-Custom-Events)

### v-pre

- **No espera una expresión**

- **Uso:**

  Saltea la compilación para este elemento y todos sus hijos. Usted puede utilizar esto para mostrar _mustache tags_ sin conversión (_raw_). Saltear una gran cantidad de nodos sin directivas en ellos también puede acelerar el tiempo de compilación.

- **Ejemplo:**

  ```html
  <span v-pre>{{ esto no será compilado }}</span>
   ```

### v-cloak

- **No espera una expresión**

- **Uso:**

  Esta directiva permanecerá en el elemento hasta que la instancia Vue asociada termine su compilación. Combinada con reglas de CSS tal como `[v-cloak] { display: none }`, esta directiva puede ser utilizada para esconder _mustache bindings_ no compilados hasta que la instancia de Vue este lista.

- **Ejemplo:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```
  El `<div>` no será visible hasta que la compilación haya terminado.

### v-once

- **No espera una expresión**

- **Detalles:**

  Renderizará el elemento/componente solo **una** vez. En renderizaciones posteriores, el elemento/componente y todos sus hijos serán tratados como contenido estático, y por lo tanto, salteados. Esto puede ser utilizado para optimizar la _performance_ de actualización.

  ```html
  <!-- un solo elemento -->
  <span v-once>Esto nunca cambiará: {{msg}}</span>
  <!-- un elemento con hijos -->
  <div v-once>
    <h1>comentario</h1>
    <p>{{msg}}</p>
  </div>
  <!-- componente -->
  <my-component v-once :comment="msg"></my-component>
  <!-- directiva `v-for` -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

- **Vea también:**
  - [Sintaxis de Plantilla - interpolaciones](../guide/syntax.html#Texto)
  - [Componentes - Componente estáticos "baratos" con `v-once`](../guide/components.html#Cheap-Static-Components-with-v-once)

## Atributos Especiales

### key

- **Espera:** `number | string`

  El atributo especial `key` es utilizado principalmente como una pista para el algoritmo del DOM virtual de Vue para identificar _VNodes_ cuando se compara nuevas listas de nodos contra listas antiguas. Sin claves, Vue utiliza un algoritmo que minimiza el movimiento de elementos e intenta parchear/reusar elementos del mismo tipo lo más posible. Con claves, este reordenará elementos basado en el orden de cambio de las claves, y los elementos con claves que ya no estén presentes, siempre serán removidos/destruidos.

  Hijos de un mismo padre en común simpre deben tener **claves únicas**. Claves duplicadas causarán errores de renderizado.

  El caso de uso más común es combinado con `v-for`:

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  También puede ser utilizado para forzar el reemplazo de un elemento/componente en vez de reusar el mismo. Esto puede ser útil cuando usted desee:

  - Lanzar apropiadamente funciones de ciclo de vida de un componente
  - Lanzar transiciones

  Por ejemplo:

  ``` html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Cuando `text` cambie, el `<span>` siempre será reemplazado en vez de parchaedo, por lo cual, una transición será lanzada.

### ref

- **Espera:** `string`

  `ref` es utilizado para registrar una referencia a un elemento o a un componente hijo. La referencia será registrada bajo el objeto `$refs` del componente padre. Si se utiliza en un elemento "plano" del DOM, la referncia será a dicho elemento; si se utiliza en un componente hijo, la referencia será a la instancia de dicha componente:

  ``` html
  <!-- vm.$refs.p será el nodo del DOM -->
  <p ref="p">hola</p>

  <!-- vm.$refs.child será la intancia del componente hijo -->
  <child-component ref="child"></child-component>
  ```

  Cuando se utiliza con elementos/componentes con `v-for`, la referencia registrada será un arreglo que contendrá nodos del DOM o instancias de componentes.

  Una nota importante sobre el tiempo de registro de referencias: dado que las mismas son creadas como resultado de la función de renderizado, usted no puede acceder a las mismas en la renderización inicial - estas no existen todavía! También, `refs` no es reactivo, por lo tanto, no intente utilizarlo en plantillas para enlace de datos (_data-binding_).

- **Vea también:** [Referencias a Componentes Hijos](../guide/components.html#Child-Component-Refs)

### slot

- **Espera:** `string`

  Utilizado en el contenido insertado dentro de componentes hijo para indicar a que _slot_ con nombre pertenece el contenido.

  Para su uso detallado, vea la guía referenciada abajo.

- **Vea también:** [Slots con Nombre](../guide/components.html#Named-Slots)

### slot-scope

> Nuevo en 2.5.0+

- **Espera:** `function argument expression`

- **Uso:**

  Utilizado para denotar que un elemento o componente es un _scopet slot_. El valor del atributo debe ser una expresión JavaScript válida que pueda aparecer en la posición del argumento de la firma de una función. Esto quiere decir que, en ambientes soportados, usted puede utilizar desestructuración ES2015 en la expresión. Sirve como un reemplazo para [`scope`](#scope-replaced) en 2.5.0+.

  Este atributo no soporte enlace dinámico.

- **Vea también:** [Slots con Scope](../guide/components.html#Scoped-Slots)

### scope <sup>reemplazado</sup>

Utilizado para denotar un elemento `<template>` como un slot con _scope_, el cual es reemplazado por [`slot-scope`](#slot-scope) en 2.5.0+.

- **Uso:**

  Mismo uso que [`slot-scope`](#slot-scope) excepto que `scope` solo puede ser usado en elementos `<template>`.

### is

- **Espera:** `string | Object (component’s options object)`

  Utilizado para [componente dinámicos](../guide/components.html#Dynamic-Components) y como un atajo para [limitaciones en templates en el DOM](../guide/components.html#DOM-Template-Parsing-Caveats).

  Por ejemplo:

  ``` html
  <!-- el componente cambia cuando currentView cambia -->
  <component v-bind:is="currentView"></component>

  <!-- necesario porque `<my-row>` sería invalido dentro -->
  <!-- del elemento `<table>` y sería izado para fuera (hoisted out) -->
  <table>
    <tr is="my-row"></tr>
  </table>
  ```

  Para su uso detallado, vea la guía referenciada abajo.

- **Vea también:**
  - [Components Dinámicos](../guide/components.html#Dynamic-Components)
  - [Casos especiales de análisis de templates DOM](../guide/components.html#DOM-Template-Parsing-Caveats)

## Componentes Integrados

### component

- **Propiedades:**
  - `is` - string | ComponentDefinition | ComponentConstructor
  - `inline-template` - boolean

- **Uso:**

Un metacomponente para representar componentes dinámicos. El componente que se renderizará está determinado por la propiedad `is`:

  ```html
  <!-- un componente dinámico controlado por -->
  <!-- la propiedad `componentId` en el vm -->
  <component :is="componentId"></component>

  <!-- Además puede renderizar un componente registrado o un componente -->
  <!-- pasado como propiedad -->
  <component :is="$options.components.child"></component>
  ```

- **Vea además:** [Componentes Dinámicos](../guide/components.html#Dynamic-Components)

### transition

- **Propiedades:**

  - `name` - string, Se utiliza para generar automáticamente nombres de clases de transición CSS. Por ejemplo, `name: 'fade'` se expandirá automáticamente a `.fade-enter`, `.fade-enter-active`, etc. El valor predeterminado es `"v"`.
  - `appear` - boolean, Establece si se aplicará la transición en el renderizado inicial. El valor predeterminado es `false`.
  - `css` - boolean, Aplica clases de transición CSS. El valor predeterminado es `true`. Si se establece en `false`, solo se habilitarán los enlaces de JavaScript registrados en eventos de componentes.
  - `type` - string, Especifica los tipos de eventos de transición a esperar para determinar el tiempo de finalización de la transición. Los valores disponibles son `"transition"` y `"animation"`. Por defecto, detectará automáticamente el tipo que tiene una mayor duración.
  - `mode` - string, Controla la secuencia de tiempo de las transiciones de entrada/salida. Los modos disponibles son `"out-in"` e `"in-out"`. Por defecto es en simultáneo.
  - `duration` - number | { enter: number, leave: number }. Especifica la duración de la transición. De forma predeterminada, Vue espera el primer evento de `transitionend` o `animationend` en el elemento de transición raíz.
  - `enter-class` - string
  - `leave-class` - string
  - `appear-class` - string
  - `enter-to-class` - string
  - `leave-to-class` - string
  - `appear-to-class` - string
  - `enter-active-class` - string
  - `leave-active-class` - string
  - `appear-active-class` - string

- **Eventos:**
  - `before-enter`
  - `before-leave`
  - `before-appear`
  - `enter`
  - `leave`
  - `appear`
  - `after-enter`
  - `after-leave`
  - `after-appear`
  - `enter-cancelled`
  - `leave-cancelled` (`v-show` solamente)
  - `appear-cancelled`

- **Uso:**

  `<transition>` sirven como efectos de transición para ***un solo*** elemento/componente. La `<transition>` solo aplica el comportamiento de transición al contenido envuelto en el interior; no representa un elemento del DOM adicional ni aparece en la jerarquía de componentes inspeccionados.

  ```html
  <!-- elemento simple -->
  <transition>
    <div v-if="ok">contenido alternado</div>
  </transition>

  <!-- componente dinámico -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- enlace de eventos -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">contenido alternado</div>
    </transition>
  </div>
  ```

  ``` js
  new Vue({
    ...
    methods: {
      transitionComplete: function (el) {
        // para el elemento 'el' del DOM pasado como argumento, haga algo...
      }
    }
    ...
  }).$mount('#transition-demo')
  ```

- **Vea además:** [Transiciones de Entrada/Salida en Listas](../guide/transitions.html#Transiciones-de-Entrada-Salida-en-Listas)

### transition-group

- **Propiedades:**
  - `tag` - string, por defecto es `span`.
  - `move-class` - sobrescribir la clase CSS aplicada durante la transición de movimiento.
  - expone las mismas propiedades que `<transition>` excepto `mode`.

- **Eventos:**
  - expone los mismos eventos que `<transition>`.

- **Uso:**

  `<transition-group>` sirve como efectos de transición para **múltiples** elementos/componentes. `<transition-group>` representa un elemento del DOM real. Por defecto, muestra un `<span>`, se puede configurar qué elemento debe representar a través del atributo `tag`.

  Tenga en cuenta que cada hijo en un `<transition-group>` debe tener **una clave única** para que las animaciones funcionen correctamente.

  `<transition-group>` admite transiciones en movimiento a través de la transformación CSS. Cuando la posición de un hijo en la pantalla ha cambiado después de una actualización, se aplicará una clase CSS en movimiento (generada automáticamente desde el atributo `name` o configurada con el atributo `move-class`). Si la propiedad CSS `transform` es "capaz de transición" cuando se aplica la clase en movimiento, el elemento se animará suavemente a su destino utilizando la [técnica FLIP](https://aerotwist.com/blog/flip-your-animaciones/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **Vea además:** [Transiciones de Entrada/Salida en Listas](../guide/transitions.html#Transiciones-de-Entrada-Salida-en-Listas)

### keep-alive

- **Propiedades:**
  - `include` - string o RegExp o Array. Solo los componentes con nombres coincidentes se almacenarán en caché.
  - `exclude` - string o RegExp o Array. Cualquier componente con un nombre coincidente no se almacenará en caché.
  - `max` - number. El número máximo de instancias de componentes para almacenar en caché.

- **Uso:**

  Cuando se envuelve alrededor de un componente dinámico, `<keep-alive>` almacena en caché las instancias de componentes inactivos sin destruirlas. Similar a `<transition>`, `<keep-alive>` es un componente abstracto: no representa un elemento del DOM en sí mismo, y no aparece en la cadena padre del componente.

  Cuando un componente se alterna dentro de `<keep-alive>`, los _hooks_ del ciclo de vida `activated` y `deactivated` se invocarán en consecuencia.

  > En 2.2.0+ y posteriores, `activated` y `deactivated` se dispararán para todos los componentes anidados dentro de un árbol `<keep-alive>`.

  Se utiliza principalmente para preservar el estado de los componentes o evitar la re-renderización.

  ```html
  <!-- básico -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- varios hijos condicionales -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- usado junto con `<transition>` -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Note que, `<keep-alive>` está diseñado para el caso en que tiene un componente secundario directo que se está alternando. No funciona si usted tiene un `v-for` dentro de este. Cuando hay varios hijos condicionales, como arriba, `<keep-alive>` requiere que solo se renderize un hijo a la vez.

- **`include` y `exclude`**

  > Nuevo en 2.1.0+

  Las propiedades `include` y `exclude` permiten que los componentes se almacenen en caché condicionalmente. Ambas propiedades pueden ser una cadena de texto delimitada por comas, una RegExp o un Array:

  ``` html
  <!-- cadena delimitada por comas -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- Expresión regular (usar `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (usar `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  La coincidencia se verifica primero en la propia opción `name` del componente, luego su nombre de registro local (la clave en la opción `components` del padre) si la opción `name` no está disponible. Los componentes anónimos no se pueden comparar.

- **`max`**

  > Nuevo en 2.5.0+

  El número máximo de instancias de componentes para almacenar en caché. Una vez que se alcanza este número, la instancia del componente en caché a la que se accedió menos recientemente se destruirá antes de crear una nueva instancia.

  ``` html
  <keep-alive :max="10">
    <component :is="view"></component>
  </keep-alive>
  ```

<p class="tip">`<keep-alive>` no funciona con componentes funcionales porque no tienen instancias para almacenar en caché.</p>

- **Vea además:** [Componentes Dinámicos - keep-alive](../guide/components.html#keep-alive)

### slot

- **Propiedades:**
  - `name` - string, utilizado para _slots_ con nombre.

- **Uso:**

  `<slot>` sirve los puntos de distribución de contenido en plantillas de componentes. `<slot>` en sí será reemplazado.

  Para un uso detallado, consulte la sección de la guía vinculada a continuación.

- **Vea además:** [Distribución de contenido con Slots](../guide/components.html#Distribucion-de-contenido-con-Slots)

## Interfaz VNode

- Por favor, consulte la [declaración de la clase VNode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js).

## Renderización del lado del Servidor

- Por favor, consulte la [documentación del paquete vue-server-renderer](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer).
