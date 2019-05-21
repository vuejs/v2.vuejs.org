---
title: Migración desde Vue Router 0.7.x
type: guide
order: 702
---

Solo Vue Router 2 es compatible con Vue 2, por lo que si está actualizando Vue, también deberá actualizar Vue Router. Es por eso que hemos incluido detalles sobre la migración aquí en los documentos principales. Para obtener una guía completa sobre el uso del nuevo Vue Router, consulte la [documentación de Vue Router](https://router.vuejs.org/en/).

## Inicialización de Router

### `router.start` <sup>reemplazado</sup>

Ya no hay una API especial para inicializar una aplicación con Vue Router. Eso significa que en lugar de:

```js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

Se pasa una propiedad `router` a una instancia de Vue:

```js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

O, si está utilizando la versión de Vue solo en tiempo de ejecución:

```js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">ayudante de migración</a> en su código base para encontrar ejemplos de llamadas a <code>router.start</code>.
  </p>
</div>
{% endraw %}

## Definiciones de ruta

### `router.map` <sup>reemplazado</sup>

Las rutas ahora se definen como una matriz en una [opción `routes`](https://router.vuejs.org/en/essentials/getting-started.html#javascript) en la instanciación del `router`. Así que estas rutas por ejemplo:

```js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

Serán en cambio definidas de la siguiente forma:

```js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

La sintaxis de arreglo permite una coincidencia de ruta más predecible, ya que no se garantiza que la iteración sobre un objeto use el mismo orden de claves en los navegadores.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en código base para encontrar ejemplos de cómo se llama a <code>router.map</code>.
  </p>
</div>
{% endraw %}

### `router.on` <sup>removido</sup>

Si necesita generar rutas mediante programación al iniciar su aplicación, puede hacerlo agregando dinámicamente las definiciones a un arreglo de rutas. Por ejemplo:

```js
// Rutas base normales
var routes = [
  // ...
]

// Rutas generadas dinámicamente
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

Si necesita agregar nuevas rutas después de que se haya creado una instancia del `router`, puede reemplazar el emparejador del `router` por uno nuevo que incluya la ruta que desea agregar:

```js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de llamadas a <code>router.on</code>.
  </p>
</div>
{% endraw %}

### `router.beforeEach` <sup>cambió</sup>

`router.beforeEach` ahora funciona de forma asíncrona y toma una función `next` como tercer argumento.

```js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

```js
router.beforeEach(function (to, from, next) {
  if (to.path === '/forbidden') {
    next(false)
  } else {
    next()
  }
})
```

### `subRoutes` <sup>renombrado</sup>

[Renombrado a `children`](https://router.vuejs.org/en/essentials/nested-routes.html) por consistencia entre Vue y cualquier otra librería de ruteo.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>subRoutes</code>.
  </p>
</div>
{% endraw %}

### `router.redirect` <sup>reemplazado</sup>

Esto es ahora una [opción en la definición de la ruta](https://router.vuejs.org/en/essentials/redirect-and-alias.html). Por ejemplo deberá actualizar:

```js
router.redirect({
  '/tos': '/terms-of-service'
})
```

a una definición como la siguiente, en la configuración de las rutas:

```js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de llamadas a <code>router.redirect</code>.
  </p>
</div>
{% endraw %}

### `router.alias` <sup>reemplazado</sup>

Esta es ahora una [opción en la definición de la ruta](https://router.vuejs.org/en/essentials/redirect-and-alias.html) a la cual desaría hacerle un alias. Por ejemplo, debería actualizar:

```js
router.alias({
  '/manage': '/admin'
})
```

a una definición como la que se muestra a continuación en su configuración de `rutas`:

```js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

Si necesita varios alias, también puede usar una sintaxis de arreglo:

```js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de llamadas a <code>router.alias</code>.
  </p>
</div>
{% endraw %}

### Propiedades arbitrarias de ruta <sup>reemplazado</sup>

Las propiedades de ruta arbitrarias ahora deben tener un alcance bajo la nueva propiedad `meta`, para evitar conflictos con características futuras. Así por ejemplo, si usted ha definido:

```js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

Deberá actualizarlo a:

```js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```

Luego, cuando más tarde acceda a esta propiedad en una ruta, todavía pasará por `meta`. Por ejemplo:

```js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de propiedades de ruta arbitrarias no incluidas en el metadatos.
  </p>
</div>
{% endraw %}

### [] Sintaxis para arreglos en consultas <sup>removido</sup>

Cuando se pasan arreglos como parámetros de consultas, la sintaxis `QueryString` ya no es `/foo?users[]=Tom&users[]=Jerry`, en cambio, la nueva sintaxis es `/foo?users=Tom&users=Jerry`. Internamente, `$route.query.users` seguirá siendo un arreglo, pero si solo hay un parámetro en la consulta:` /foo?users=Tom`, al acceder directamente a esta ruta, no hay forma de que el router sepa si esperábamos que los 'usuarios' fueran un arreglo. Debido a esto, considere agregar una propiedad computada y reemplazar cada referencia de `$ route.query.users` con ella:

```js
export default {
  // ...
  computed: {
    // los usuarios siempre serán un arreglo
    users () {
      const users = this.$route.query.users
      return Array.isArray(users) ? users : [users]
    }
  }
}
```

## Comparación/coincidencia de Ruta

La comparación/coincidencia de ruta ahora usa [path-to-regexp](https://github.com/pillarjs/path-to-regexp) debajo del capó, lo que lo hace mucho más flexible que antes.

### Uno o más parámetros con nombre <sup>cambió</sup>

La sintaxis ha cambiado ligeramente, por ejemplo `/category/*tags`, deben actualizarse a `/category/:tags+`.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de sintaxis de rutas obsoletas.
  </p>
</div>
{% endraw %}

## Links

### `v-link` <sup>reemplazado</sup>

La directiva `v-link` ha sido reemplazada por un nuevo [componente `<router-link>`](https://router.vuejs.org/en/api/router-link.html), como este tipo de trabajo ahora es responsabilidad exclusiva de los componentes en Vue 2. Eso significa que siempre que tenga un enlace como este:

```html
<a v-link="'/about'">Acerca de</a>
```

Tendrá que actualizarlo así:

```html
<router-link to="/about">Acerca de</router-link>
```

Tenga en cuenta que `target ="_blank"` no es compatible con `<router-link>`, así que si necesita abrir un enlace en una nueva pestaña, debe usar `<a>` en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la directiva <code>v-link</code>.
  </p>
</div>
{% endraw %}

### `v-link-active` <sup>reemplazado</sup>

La directiva `v-link-active` también ha sido reemplazada por el atributo` tag` en [el componente `<router-link>`](https://router.vuejs.org/en/api/router-link.html). Entonces por ejemplo, usted necesitará actualizar:

```html
<li v-link-active>
  <a v-link="'/about'">Acerca de</a>
</li>
```

a:

```html
<router-link tag="li" to="/about">
  <a>Acerca de</a>
</router-link>
```

El `<a>` será el enlace real (y obtendrá el href correcto), pero la clase activa se aplicará al `<li>` externo.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la directiva <code>v-link-active</code>.
  </p>
</div>
{% endraw %}

## Navegación Programática

### `router.go` <sup>cambió</sup>

Por consistencia con la [API History de HTML5](https://developer.mozilla.org/en-US/docs/Web/API/History_API), `router.go` ahora es solamente usado por [navegación hacia atrás/adelante](https://router.vuejs.org/en/essentials/navigation.html#routergon), mientras que [`router.push`](https://router.vuejs.org/en/essentials/navigation.html#routerpushlocation) es usado para navegar a una página específica.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de <code>router.go</code> siendo usado donde <code>router.push</code> debería ser utilizado.
  </p>
</div>
{% endraw %}

## Opciones de las Rutas: modos

### `hashbang: false` <sup>removido</sup>

Los Hashbangs ya no son necesario para que Google rastree una URL, por lo que ya no es el valor predeterminado (o incluso una opción) para la estrategia de hash.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>hashbang: false</code>.
  </p>
</div>
{% endraw %}

### `history: true` <sup>reemplazado</sup>

Todas las opciones de modo de enrutamiento se han condensado en una sola [opción `mode`](https://router.vuejs.org/en/api/options.html#mode). Actualizar:

```js
var router = new VueRouter({
  history: 'true'
})
```

a:

```js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>history: true</code>.
  </p>
</div>
{% endraw %}

### `abstract: true` <sup>reemplazado</sup>

Todas las opciones de modo de enrutamiento se han condensado en una sola [opción `mode`](https://router.vuejs.org/en/api/options.html#mode). Actualizar:

```js
var router = new VueRouter({
  abstract: 'true'
})
```

a:

```js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>abstract: true</code>.
  </p>
</div>
{% endraw %}

## Opciones de las Rutas: Misceláneo

### `saveScrollPosition` <sup>reemplazado</sup>

Esto ha sido reemplazado por la [opción `scrollBehavior`](https://router.vuejs.org/en/advanced/scroll-behavior.html) que acepta una función, por lo que el comportamiento de scroll es completamente personalizable, incluso por ruta. Esto abre muchas nuevas posibilidades, pero para replicar el antiguo comportamiento de:

```js
saveScrollPosition: true
```

Usted puede sustituirlo por:

```js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>saveScrollPosition: true</code>.
  </p>
</div>
{% endraw %}

### `root` <sup>renombrado</sup>

Renombrado a `base` por consistencia con el [elemento HTML `<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>root</code>.
  </p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>removido</sup>

Esta opción ya no es necesaria ahora que el sistema de transición de Vue tiene explícito [`appear' control de transición](transitions.html#Transitions-on-Initial-Render).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>transitionOnLoad: true</code>.
  </p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>removido</sup>

Eliminado debido a la simplificación de los hooks. Si realmente debe suprimir los errores de transición, puede utilizar [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción <code>suppressTransitionError: true</code>.
  </p>
</div>
{% endraw %}

## Hooks de la Ruta

### `activate` <sup>reemplazado</sup>

Use [`beforeRouteEnter`](https://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) en el componente en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos del hook <code>beforeRouteEnter</code>.
  </p>
</div>
{% endraw %}

### `canActivate` <sup>reemplazado</sup>

Use [`beforeEnter`](https://router.vuejs.org/en/advanced/navigation-guards.html#perroute-guard) en la ruta en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos del hook <code>canActivate</code>.
  </p>
</div>
{% endraw %}

### `deactivate` <sup>removido</sup>

Use los hooks [`beforeDestroy`](../api/#beforeDestroy) o [`destroyed`](../api/#destroyed) en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos del hook <code>deactivate</code>.
  </p>
</div>
{% endraw %}

### `canDeactivate` <sup>reemplazado</sup>

Use [`beforeRouteLeave`](https://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) en el componente en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos del hook <code>canDeactivate</code>.
  </p>
</div>
{% endraw %}

### `canReuse: false` <sup>removido</sup>

Ya no hay un caso de uso para esto en el nuevo `Vue Router`.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la opción<code>canReuse: false</code>.
  </p>
</div>
{% endraw %}

### `data` <sup>reemplazado</sup>

La propiedad `$route` ahora es reactiva, por lo que usted puede usar un `watcher` para reaccionar a los cambios de ruta, como esto:

```js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos del hook <code>data</code>.
  </p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>removido</sup>

Defina su propia propiedad (por ejemplo, `isLoading`), luego actualice el estado de carga en un `watcher` en la ruta. Por ejemplo, si va a buscar datos con [axios](https://github.com/mzabriskie/axios):

```js
data: function () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': function () {
    var self = this
    self.isLoading = true
    self.fetchData().then(function () {
      self.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    var self = this
    return axios.get('/api/posts')
      .then(function (response) {
        self.posts = response.data.posts
      })
      .catch(function (error) {
        self.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de la propiedad metadatos <code>$loadingRouteData</code>.
  </p>
</div>
{% endraw %}
