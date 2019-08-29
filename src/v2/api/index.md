---
title: API
type: api
---

## Configuración Global

`Vue.config` es un objeto contenedor de las configuraciones globales de Vue. Podemos modificar sus propiedades listadas debajo antes de inicializar nuestra aplicación:

### silent

- **Tipo:** `boolean`

- **Por defecto:** `false`

- **Uso:**

  ``` js
  Vue.config.silent = true
  ```

  Suprimir todos los logs y warnings de Vue

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

  Define estrategias personalizadas de mezclado <i>(merge)</i> por opción

  La estrategia de merge recibe el valor de aquella opción definida en el padre y las instancias del hijo como primer y segundo parámetro respectivamente. El contexto de la instancia de Vue es pasado como tercer argumento.



- **Ver además:** [Custom Option Merging Strategies](../guide/mixins.html#Custom-Option-Merge-Strategies)

### devtools

- **Tipo:** `boolean`

- **Por defecto:** `true` (`false` en ambiente de produción)

- **Uso:**

  ``` js
  // asegúrese de configurarlo de forma sincronizada inmediatamente después de cargar Vue
  Vue.config.devtools = true
  ```

  Configura si se permite la inspección de [vue-devtools](https://github.com/vuejs/vue-devtools). El valor por defecto de esta opción es `true` en ambiente de desarrollo y `false` en ambiente de producción. Usted puede configurar a `true` para habilitar la inspección para el ambiente de producción.

### errorHandler

- **Tipo:** `Function`

- **Por defecto:** `undefined`

- **Uso:**

  ``` js
  Vue.config.errorHandler = function (err, vm, info) {
    // manejo de error
    // `info` es un error específico de Vue info, e.g. el cuál se engancha del ciclo de vida
    // el error fue encontrado sólo disponible en 2.2.0+
  }
  ```

  Asigna un manejador para errores no capturados durante la renderización de componentes y observadores. Los manipuladores son llamados con el el error y la instancia de Vue.

  > En 2.2.0+, este hook captura también errores en los hooks del ciclo de vida de los componentes. Además cuando este hook está `undefined`, los errores capturados serán logueados con `console.error` en vez de colapsar la aplicación.

  > En 2.4.0+ este hook también captura errores lanzados dentro de los manipuladores de eventos personalizados de Vue.

  > Servicios de traceo de errores [Sentry](https://sentry.io/for/vue/) y [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/) proveen la integración oficial usando esta opción.

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

  Asigna un manipulador personalizado para advertencias en tiempo de ejecución. Note que solo funciona durante desarrollo y es ignorado en producción.

### ignoredElements

- **Tipo:** `Array<string | RegExp>`

- **Por defecto:** `[]`

- **Uso:**

  ``` js
  Vue.config.ignoredElements = [
    'my-custom-web-component',
    'another-web-component',
    // Use una `RegExp` para ignorar todos los elementos que comienzan con "ion-"
    // 2.5+ solamente
    /^ion-/
  ]
  ```

  Hace a Vue ignorar elementos personalizados definidos fuera de Vue (e.g., usando APIs de Compoenentes Web). De otra manera lanzará una advertencia de esta forma `Unknown custom element`, asumiendo que usted olvidó registrar un componente global o escribió mal el nombre del componente.

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

  Define alias(es) de teclas personalizados para `v-on`.

### performance

> Nuevo en 2.2.0+

- **Tipo:** `boolean`

- **Por defecto:** `false (from 2.2.3+)`

- **Uso**:

  Configúralo a `true` para permitir inicializar el componente, compilarlo, renderizarlo y parchear el traceo de rendimiento en las herramientas de desarrollo del navegador y en el panel de rendimiento/línea de tiempo.

### productionTip

> Nuevo en 2.2.0+

- **Tipo:** `boolean`

- **Por defecto:** `true`

- **Uso**:

  Configúralo a `false` para prevenir los consejos de producción cuando Vue se inicializa.

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

- **Restriction:** Only accepts `Function` when used in a component definition.

- **Details:**

  The data object for the Vue instance. Vue will recursively convert its properties into getter/setters to make it "reactive". **The object must be plain**: native objects such as browser API objects and prototype properties are ignored. A rule of thumb is that data should just be data - it is not recommended to observe objects with their own stateful behavior.

  Once observed, you can no longer add reactive properties to the root data object. It is therefore recommended to declare all root-level reactive properties upfront, before creating the instance.

  After the instance is created, the original data object can be accessed as `vm.$data`. The Vue instance also proxies all the properties found on the data object, so `vm.a` will be equivalent to `vm.$data.a`.

  Properties that start with `_` or `$` will **not** be proxied on the Vue instance because they may conflict with Vue's internal properties and API methods. You will have to access them as `vm.$data._property`.

  When defining a **component**, `data` must be declared as a function that returns the initial data object, because there will be many instances created using the same definition. If we use a plain object for `data`, that same object will be **shared by reference** across all instances created! By providing a `data` function, every time a new instance is created we can call it to return a fresh copy of the initial data.

  If required, a deep clone of the original object can be obtained by passing `vm.$data` through `JSON.parse(JSON.stringify(...))`.

- **Example:**

  ``` js
  var data = { a: 1 }

  // direct instance creation
  var vm = new Vue({
    data: data
  })
  vm.a // => 1
  vm.$data === data // => true

  // must use function when in Vue.extend()
  var Component = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

  Note that if you use an arrow function with the `data` property, `this` won't be the component's instance, but you can still access the instance as the function's first argument:

  ```js
  data: vm => ({ a: vm.myProp })
  ```

- **See also:** [Reactivity in Depth](../guide/reactivity.html)

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

  Invocado justo antes de que comience el montaje: la función `render` está a punto de llamarse por primera vez.

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
      // haber procesado la vista completa
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

  Se invoca cuando se captura un error de cualquier componente descendiente. El _hook_ recibe tres argumentos: el error, la instancia del componente que activó el error y una cadena que contiene información sobre dónde se capturó el error. El _hook_ puede devolver `falso` para evitar que el error se propague aún más.

  <p class="tip">Puede modificar el estado del componente en este _hook_. Sin embargo, es importante tener condicionales en su _template_ o función de renderización que alterne otro contenido cuando se haya capturado un error; de lo contrario, el componente caerá en un bucle de renderización infinito.</p>

  **Reglas de Propagación de Errores**

  - De forma predeterminada, todos los errores aún se envían al `config.errorHandler` global si está definido, por lo que estos errores aún se pueden informar a un servicio de análisis en un solo lugar.

  - Si existen varios _hooks_ `errorCaptured` en una cadena de herencia de un componente o en la cadena principal, se invocarán todos en el mismo error.

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

  Similar a los valores por defecto de las _props_, ustede debe utilizar una función _factory_ para valores no primitivos:

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

  Las opciones de instanciación utilizadas en la instancia Vue actual. Esto es útil cuando ustede desea incluir propiedades personalizadas en las opciones:

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

## Instance Methods / Data

### vm.$watch( expOrFn, callback, [options] )

- **Arguments:**
  - `{string | Function} expOrFn`
  - `{Function | Object} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **Returns:** `{Function} unwatch`

- **Uso:**

  Watch an expression or a computed function on the Vue instance for changes. The callback gets called with the new value and the old value. The expression only accepts dot-delimited paths. For more complex expressions, use a function instead.

<p class="tip">Note: when mutating (rather than replacing) an Object or an Array, the old value will be the same as new value because they reference the same Object/Array. Vue doesn't keep a copy of the pre-mutate value.</p>

- **Example:**

  ``` js
  // keypath
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // do something
  })

  // function
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (newVal, oldVal) {
      // do something
    }
  )
  ```

  `vm.$watch` returns an unwatch function that stops firing the callback:

  ``` js
  var unwatch = vm.$watch('a', cb)
  // later, teardown the watcher
  unwatch()
  ```

- **Option: deep**

  To also detect nested value changes inside Objects, you need to pass in `deep: true` in the options argument. Note that you don't need to do so to listen for Array mutations.

  ``` js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback is fired
  ```

- **Option: immediate**

  Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression:

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // `callback` is fired immediately with current value of `a`
  ```

### vm.$set( target, key, value )

- **Arguments:**
  - `{Object | Array} target`
  - `{string | number} key`
  - `{any} value`

- **Returns:** the set value.

- **Uso:**

  This is the **alias** of the global `Vue.set`.

- **See also:** [Vue.set](#Vue-set)

### vm.$delete( target, key )

- **Arguments:**
  - `{Object | Array} target`
  - `{string | number} key`

- **Uso:**

  This is the **alias** of the global `Vue.delete`.

- **See also:** [Vue.delete](#Vue-delete)

## Instance Methods / Events

### vm.$on( event, callback )

- **Arguments:**
  - `{string | Array<string>} event` (array only supported in 2.2.0+)
  - `{Function} callback`

- **Uso:**

  Listen for a custom event on the current vm. Events can be triggered by `vm.$emit`. The callback will receive all the additional arguments passed into these event-triggering methods.

- **Example:**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'hi')
  // => "hi"
  ```

### vm.$once( event, callback )

- **Arguments:**
  - `{string} event`
  - `{Function} callback`

- **Uso:**

  Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

### vm.$off( [event, callback] )

- **Arguments:**
  - `{string | Array<string>} event` (array only supported in 2.2.2+)
  - `{Function} [callback]`

- **Uso:**

  Remove custom event listener(s).

  - If no arguments are provided, remove all event listeners;

  - If only the event is provided, remove all listeners for that event;

  - If both event and callback are given, remove the listener for that specific callback only.

### vm.$emit( eventName, [...args] )

- **Arguments:**
  - `{string} eventName`
  - `[...args]`

  Trigger an event on the current instance. Any additional arguments will be passed into the listener's callback function.

- **Examples:**

  Using `$emit` with only an event name:

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

  Using `$emit` with additional arguments:

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

## Instance Methods / Lifecycle

### vm.$mount( [elementOrSelector] )

- **Arguments:**
  - `{Element | string} [elementOrSelector]`
  - `{boolean} [hydrating]`

- **Returns:** `vm` - the instance itself

- **Uso:**

  If a Vue instance didn't receive the `el` option at instantiation, it will be in "unmounted" state, without an associated DOM element. `vm.$mount()` can be used to manually start the mounting of an unmounted Vue instance.

  If `elementOrSelector` argument is not provided, the template will be rendered as an off-document element, and you will have to use native DOM API to insert it into the document yourself.

  The method returns the instance itself so you can chain other instance methods after it.

- **Example:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // create and mount to #app (will replace #app)
  new MyComponent().$mount('#app')

  // the above is the same as:
  new MyComponent({ el: '#app' })

  // or, render off-document and append afterwards:
  var component = new MyComponent().$mount()
  document.getElementById('app').appendChild(component.$el)
  ```

- **See also:**
  - [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)
  - [Server-Side Rendering](../guide/ssr.html)

### vm.$forceUpdate()

- **Uso:**

  Force the Vue instance to re-render. Note it does not affect all child components, only the instance itself and child components with inserted slot content.

### vm.$nextTick( [callback] )

- **Arguments:**
  - `{Function} [callback]`

- **Uso:**

  Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update. This is the same as the global `Vue.nextTick`, except that the callback's `this` context is automatically bound to the instance calling this method.

  > New in 2.1.0+: returns a Promise if no callback is provided and Promise is supported in the execution environment. Please note that Vue does not come with a Promise polyfill, so if you target browsers that don't support Promises natively (looking at you, IE), you will have to provide a polyfill yourself.

- **Example:**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // modify data
        this.message = 'changed'
        // DOM is not updated yet
        this.$nextTick(function () {
          // DOM is now updated
          // `this` is bound to the current instance
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **See also:**
  - [Vue.nextTick](#Vue-nextTick)
  - [Async Update Queue](../guide/reactivity.html#Async-Update-Queue)

### vm.$destroy()

- **Uso:**

  Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives, turn off all event listeners.

  Triggers the `beforeDestroy` and `destroyed` hooks.

  <p class="tip">In normal use cases you shouldn't have to call this method yourself. Prefer controlling the lifecycle of child components in a data-driven fashion using `v-if` and `v-for`.</p>

- **See also:** [Lifecycle Diagram](../guide/instance.html#Lifecycle-Diagram)

## Directives

### v-text

- **Expects:** `string`

- **Details:**

  Updates the element's `textContent`. If you need to update the part of `textContent`, you should use `{% raw %}{{ Mustache }}{% endraw %}` interpolations.

- **Example:**

  ```html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **See also:** [Data Binding Syntax - Interpolations](../guide/syntax.html#Text)

### v-html

- **Expects:** `string`

- **Details:**

  Updates the element's `innerHTML`. **Note that the contents are inserted as plain HTML - they will not be compiled as Vue templates**. If you find yourself trying to compose templates using `v-html`, try to rethink the solution by using components instead.

  <p class="tip">Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `v-html` on trusted content and **never** on user-provided content.</p>

  <p class="tip">In [single-file components](../guide/single-file-components.html), `scoped` styles will not apply to content inside `v-html`, because that HTML is not processed by Vue's template compiler. If you want to target `v-html` content with scoped CSS, you can instead use [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html) or an additional, global `<style>` element with a manual scoping strategy such as BEM.</p>

- **Example:**

  ```html
  <div v-html="html"></div>
  ```

- **See also:** [Data Binding Syntax - Interpolations](../guide/syntax.html#Raw-HTML)

### v-show

- **Expects:** `any`

- **Uso:**

  Toggles the element's `display` CSS property based on the truthy-ness of the expression value.

  This directive triggers transitions when its condition changes.

- **See also:** [Conditional Rendering - v-show](../guide/conditional.html#v-show)

### v-if

- **Expects:** `any`

- **Uso:**

  Conditionally render the element based on the truthy-ness of the expression value. The element and its contained directives / components are destroyed and re-constructed during toggles. If the element is a `<template>` element, its content will be extracted as the conditional block.

  This directive triggers transitions when its condition changes.

  <p class="tip">When used together with v-if, v-for has a higher priority than v-if. See the <a href="../guide/list.html#v-for-with-v-if">list rendering guide</a> for details.</p>

- **See also:** [Conditional Rendering - v-if](../guide/conditional.html)

### v-else

- **Does not expect expression**

- **Restriction:** previous sibling element must have `v-if` or `v-else-if`.

- **Uso:**

  Denote the "else block" for `v-if` or a `v-if`/`v-else-if` chain.

  ```html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **See also:** [Conditional Rendering - v-else](../guide/conditional.html#v-else)

### v-else-if

> New in 2.1.0+

- **Expects:** `any`

- **Restriction:** previous sibling element must have `v-if` or `v-else-if`.

- **Uso:**

  Denote the "else if block" for `v-if`. Can be chained.

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

- **See also:** [Conditional Rendering - v-else-if](../guide/conditional.html#v-else-if)

### v-for

- **Expects:** `Array | Object | number | string`

- **Uso:**

  Render the element or template block multiple times based on the source data. The directive's value must use the special syntax `alias in expression` to provide an alias for the current element being iterated on:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  The default behavior of `v-for` will try to patch the elements in-place without moving them. To force it to reorder elements, you need to provide an ordering hint with the `key` special attribute:

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  <p class="tip">When used together with v-if, v-for has a higher priority than v-if. See the <a href="../guide/list.html#v-for-with-v-if">list rendering guide</a> for details.</p>

  The detailed usage for `v-for` is explained in the guide section linked below.

- **See also:**
  - [List Rendering](../guide/list.html)
  - [key](../guide/list.html#key)

### v-on

- **Shorthand:** `@`

- **Expects:** `Function | Inline Statement | Object`

- **Argument:** `event`

- **Modifiers:**
  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyCode | keyAlias}` - only trigger handler on certain keys.
  - `.native` - listen for a native event on the root element of component.
  - `.once` - trigger handler at most once.
  - `.left` - (2.2.0+) only trigger handler for left button mouse events.
  - `.right` - (2.2.0+) only trigger handler for right button mouse events.
  - `.middle` - (2.2.0+) only trigger handler for middle button mouse events.
  - `.passive` - (2.3.0+) attaches a DOM event with `{ passive: true }`.

- **Uso:**

  Attaches an event listener to the element. The event type is denoted by the argument. The expression can be a method name, an inline statement, or omitted if there are modifiers present.

  When used on a normal element, it listens to [**native DOM events**](https://developer.mozilla.org/en-US/docs/Web/Events) only. When used on a custom element component, it listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

  Starting in 2.4.0+, `v-on` also supports binding to an object of event/listener pairs without an argument. Note when using the object syntax, it does not support any modifiers.

- **Example:**

  ```html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter">

  <!-- key modifier using keyCode -->
  <input @keyup.13="onEnter">

  <!-- the click event will be triggered at most once -->
  <button v-on:click.once="doThis"></button>

  <!-- object syntax (2.4.0+) -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- inline statement -->
  <my-component @my-event="handleThis(123, $event)"></my-component>

  <!-- native event on component -->
  <my-component @click.native="onClick"></my-component>
  ```

- **See also:**
  - [Event Handling](../guide/events.html)
  - [Components - Custom Events](../guide/components.html#Custom-Events)

### v-bind

- **Shorthand:** `:`

- **Expects:** `any (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers:**
  - `.prop` - Bind as a DOM property instead of an attribute ([what's the difference?](https://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028)). If the tag is a component then `.prop` will set the property on the component's `$el`.
  - `.camel` - (2.1.0+) transform the kebab-case attribute name into camelCase.
  - `.sync` - (2.3.0+) a syntax sugar that expands into a `v-on` handler for updating the bound value.

- **Uso:**

  Dynamically bind one or more attributes, or a component prop to an expression.

  When used to bind the `class` or `style` attribute, it supports additional value types such as Array or Objects. See linked guide section below for more details.

  When used for prop binding, the prop must be properly declared in the child component.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Example:**

  ```html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc">

  <!-- shorthand -->
  <img :src="imageSrc">

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName">

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- DOM attribute binding with prop modifier -->
  <div v-bind:text-content.prop="text"></div>

  <!-- prop binding. "prop" must be declared in my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- pass down parent props in common with a child component -->
  <child-component v-bind="$props"></child-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  The `.camel` modifier allows camelizing a `v-bind` attribute name when using in-DOM templates, e.g. the SVG `viewBox` attribute:

  ``` html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` is not needed if you are using string templates, or compiling with `vue-loader`/`vueify`.

- **See also:**
  - [Class and Style Bindings](../guide/class-and-style.html)
  - [Components - Props](../guide/components.html#Props)
  - [Components - `.sync` Modifier](../guide/components.html#sync-Modifier)

### v-model

- **Expects:** varies based on value of form inputs element or output of components

- **Limited to:**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **Modifiers:**
  - [`.lazy`](../guide/forms.html#lazy) - listen to `change` events instead of `input`
  - [`.number`](../guide/forms.html#number) - cast valid input string to numbers
  - [`.trim`](../guide/forms.html#trim) - trim input

- **Uso:**

  Create a two-way binding on a form input element or a component. For detailed usage and other notes, see the Guide section linked below.

- **See also:**
  - [Form Input Bindings](../guide/forms.html)
  - [Components - Form Input Components using Custom Events](../guide/components.html#Form-Input-Components-using-Custom-Events)

### v-pre

- **Does not expect expression**

- **Uso:**

  Skip compilation for this element and all its children. You can use this for displaying raw mustache tags. Skipping large numbers of nodes with no directives on them can also speed up compilation.

- **Example:**

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
   ```

### v-cloak

- **Does not expect expression**

- **Uso:**

  This directive will remain on the element until the associated Vue instance finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the Vue instance is ready.

- **Example:**

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

  The `<div>` will not be visible until the compilation is done.

### v-once

- **Does not expect expression**

- **Details:**

  Render the element and component **once** only. On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

- **See also:**
  - [Data Binding Syntax - interpolations](../guide/syntax.html#Text)
  - [Components - Cheap Static Components with `v-once`](../guide/components.html#Cheap-Static-Components-with-v-once)

## Special Attributes

### key

- **Expects:** `number | string`

  The `key` special attribute is primarily used as a hint for Vue's virtual DOM algorithm to identify VNodes when diffing the new list of nodes against the old list. Without keys, Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed/destroyed.

  Children of the same common parent must have **unique keys**. Duplicate keys will cause render errors.

  The most common use case is combined with `v-for`:

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  It can also be used to force replacement of an element/component instead of reusing it. This can be useful when you want to:

  - Properly trigger lifecycle hooks of a component
  - Trigger transitions

  For example:

  ``` html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  When `text` changes, the `<span>` will always be replaced instead of patched, so a transition will be triggered.

### ref

- **Expects:** `string`

  `ref` is used to register a reference to an element or a child component. The reference will be registered under the parent component's `$refs` object. If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be component instance:

  ``` html
  <!-- vm.$refs.p will be the DOM node -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child will be the child component instance -->
  <child-component ref="child"></child-component>
  ```

  When used on elements/components with `v-for`, the registered reference will be an Array containing DOM nodes or component instances.

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you cannot access them on the initial render - they don't exist yet! `$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **See also:** [Child Component Refs](../guide/components.html#Child-Component-Refs)

### slot

- **Expects:** `string`

  Used on content inserted into child components to indicate which named slot the content belongs to.

  For detailed usage, see the guide section linked below.

- **See also:** [Named Slots](../guide/components.html#Named-Slots)

### slot-scope

> New in 2.5.0+

- **Expects:** `function argument expression`

- **Uso:**

  Used to denote an element or component as a scoped slot. The attribute's value should be a valid JavaScript expression that can appear in the argument position of a function signature. This means in supported environments you can also use ES2015 destructuring in the expression. Serves as a replacement for [`scope`](#scope-replaced) in 2.5.0+.

  This attribute does not support dynamic binding.

- **See also:** [Scoped Slots](../guide/components.html#Scoped-Slots)

### scope <sup>replaced</sup>

Used to denote a `<template>` element as a scoped slot, which is replaced by [`slot-scope`](#slot-scope) in 2.5.0+.

- **Uso:**

  Same as [`slot-scope`](#slot-scope) except that `scope` can only be used on `<template>` elements.

### is

- **Expects:** `string | Object (component’s options object)`

  Used for [dynamic components](../guide/components.html#Dynamic-Components) and to work around [limitations of in-DOM templates](../guide/components.html#DOM-Template-Parsing-Caveats).

  For example:

  ``` html
  <!-- component changes when currentView changes -->
  <component v-bind:is="currentView"></component>

  <!-- necessary because `<my-row>` would be invalid inside -->
  <!-- a `<table>` element and so would be hoisted out      -->
  <table>
    <tr is="my-row"></tr>
  </table>
  ```

  For detailed usage, follow the links in the description above.

- **See also:**
  - [Dynamic Components](../guide/components.html#Dynamic-Components)
  - [DOM Template Parsing Caveats](../guide/components.html#DOM-Template-Parsing-Caveats)

## Built-In Components

### component

- **Props:**
  - `is` - string | ComponentDefinition | ComponentConstructor
  - `inline-template` - boolean

- **Uso:**

  A "meta component" for rendering dynamic components. The actual component to render is determined by the `is` prop:

  ```html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>

  <!-- can also render registered component or component passed as prop -->
  <component :is="$options.components.child"></component>
  ```

- **See also:** [Dynamic Components](../guide/components.html#Dynamic-Components)

### transition

- **Props:**
  - `name` - string, Used to automatically generate transition CSS class names. e.g. `name: 'fade'` will auto expand to `.fade-enter`, `.fade-enter-active`, etc. Defaults to `"v"`.
  - `appear` - boolean, Whether to apply transition on initial render. Defaults to `false`.
  - `css` - boolean, Whether to apply CSS transition classes. Defaults to `true`. If set to `false`, will only trigger JavaScript hooks registered via component events.
  - `type` - string, Specify the type of transition events to wait for to determine transition end timing. Available values are `"transition"` and `"animation"`. By default, it will automatically detect the type that has a longer duration.
  - `mode` - string, Controls the timing sequence of leaving/entering transitions. Available modes are `"out-in"` and `"in-out"`; defaults to simultaneous.
  - `enter-class` - string
  - `leave-class` - string
  - `appear-class` - string
  - `enter-to-class` - string
  - `leave-to-class` - string
  - `appear-to-class` - string
  - `enter-active-class` - string
  - `leave-active-class` - string
  - `appear-active-class` - string

- **Events:**
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
  - `leave-cancelled` (`v-show` only)
  - `appear-cancelled`

- **Uso:**

  `<transition>` serve as transition effects for **single** element/component. The `<transition>` only applies the transition behavior to the wrapped content inside; it doesn't render an extra DOM element, or show up in the inspected component hierarchy.

  ```html
  <!-- simple element -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- dynamic component -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- event hooking -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">toggled content</div>
    </transition>
  </div>
  ```

  ``` js
  new Vue({
    ...
    methods: {
      transitionComplete: function (el) {
        // for passed 'el' that DOM element as the argument, something ...
      }
    }
    ...
  }).$mount('#transition-demo')
  ```

- **See also:** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### transition-group

- **Props:**
  - `tag` - string, defaults to `span`.
  - `move-class` - overwrite CSS class applied during moving transition.
  - exposes the same props as `<transition>` except `mode`.

- **Events:**
  - exposes the same events as `<transition>`.

- **Uso:**

  `<transition-group>` serve as transition effects for **multiple** elements/components. The `<transition-group>` renders a real DOM element. By default it renders a `<span>`, and you can configure what element it should render via the `tag` attribute.

  Note every child in a `<transition-group>` must be **uniquely keyed** for the animations to work properly.

  `<transition-group>` supports moving transitions via CSS transform. When a child's position on screen has changed after an update, it will get applied a moving CSS class (auto generated from the `name` attribute or configured with the `move-class` attribute). If the CSS `transform` property is "transition-able" when the moving class is applied, the element will be smoothly animated to its destination using the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **See also:** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### keep-alive

- **Props:**
  - `include` - string or RegExp or Array. Only components with matching names will be cached.
  - `exclude` - string or RegExp or Array. Any component with a matching name will not be cached.
  - `max` - number. The maximum number of component instances to cache.

- **Uso:**

  When wrapped around a dynamic component, `<keep-alive>` caches the inactive component instances without destroying them. Similar to `<transition>`, `<keep-alive>` is an abstract component: it doesn't render a DOM element itself, and doesn't show up in the component parent chain.

  When a component is toggled inside `<keep-alive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly.

  > In 2.2.0+ and above, `activated` and `deactivated` will fire for all nested components inside a `<keep-alive>` tree.

  Primarily used to preserve component state or avoid re-rendering.

  ```html
  <!-- basic -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- multiple conditional children -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- used together with `<transition>` -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Note, `<keep-alive>` is designed for the case where it has one direct child component that is being toggled. It does not work if you have `v-for` inside it. When there are multiple conditional children, as above, `<keep-alive>` requires that only one child is rendered at a time.

- **`include` and `exclude`**

  > New in 2.1.0+

  The `include` and `exclude` props allow components to be conditionally cached. Both props can be a comma-delimited string, a RegExp or an Array:

  ``` html
  <!-- comma-delimited string -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (use `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (use `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  The match is first checked on the component's own `name` option, then its local registration name (the key in the parent's `components` option) if the `name` option is not available. Anonymous components cannot be matched against.

- **`max`**

  > New in 2.5.0+

  The maximum number of component instances to cache. Once this number is reached, the cached component instance that was least recently accessed will be destroyed before creating a new instance.

  ``` html
  <keep-alive :max="10">
    <component :is="view"></component>
  </keep-alive>
  ```

<p class="tip">`<keep-alive>` does not work with functional components because they do not have instances to be cached.</p>

- **See also:** [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### slot

- **Props:**
  - `name` - string, Used for named slot.

- **Uso:**

  `<slot>` serve as content distribution outlets in component templates. `<slot>` itself will be replaced.

  For detailed usage, see the guide section linked below.

- **See also:** [Content Distribution with Slots](../guide/components.html#Content-Distribution-with-Slots)

## VNode Interface

- Please refer to the [VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js).

## Server-Side Rendering

- Please refer to the [vue-server-renderer package documentation](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer).
