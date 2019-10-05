---
title: Migración desde Vue 1.x
type: guide
order: 701
---

## Preguntas frecuentes

> Woah - ¡esta página es súper larga! ¿Eso significa que la versión 2.0 es completamente diferente y tendré que aprender los conceptos básicos una y otra vez y la migración será prácticamente imposible?

¡Me alegra que lo pregunte! La respuesta es no. Alrededor del 90% de la API es la misma y los conceptos básicos no han cambiado. Es largo porque nos gusta ofrecer explicaciones muy detalladas e incluir muchos ejemplos. Quédese tranquilo, __¡esto no es algo que tenga que leer de arriba abajo!__

> ¿Por dónde debería comenzar una migración?

1. Comience ejecutando el [asistente de migración](https://github.com/vuejs/vue-migration-helper) en un proyecto actual. Hemos minimizado y comprimido cuidadosamente un desarrollo de Vue superior en una interfaz de línea de comando simple. Así, cada vez que se reconoce una característica obsoleta, le informa, ofrece sugerencias y proporciona enlaces a más información.

2. Después de eso, navegue por la tabla de contenido de esta página en la barra lateral. Si ve un tema que puede afectarle, pero que el asistente de migración no captó, compruébelo.

3. Si usted tiene algunos tests, ejecútelos y vea lo que aún falla. Sino tiene test, solo abra la aplicación en su navegador y esté atento a las advertencias o errores mientras navega.

4. En este punto, su aplicación debería estar migrada por completo. Si aún tiene ganas de más, puede leer el resto de esta página [desde el principio](index.html). Muchas partes serán demasiado fáciles, ya que ya está familiarizado con los conceptos básicos.

> ¿Cuánto tiempo me llevará migrar una aplicación de Vue 1.x a 2.0?

Depende de algunos factores:

- El tamaño de su aplicación (en las aplicaciones pequeñas y medianas probablemente será menos de un día)

- Cuantas veces se distrae y comienza a jugar con una nueva función genial.😉 &nbsp;No le juzgamos, ¡a nosotros también nos pasó mientras construíamos 2.0!

- Las funciones obsoletas que esté usando. La mayoría se pueden actualizar con Buscar y Reemplazar, pero otras pueden tardar unos minutos. Si actualmente no está siguiendo las mejores prácticas, Vue 2.0 también intentará forzarle más a hacerlo. Esto es algo bueno a largo plazo, pero también podría significar una actualización (aunque posiblemente le retrase) significativa.

> Si actualizo a Vue 2, ¿también tendré que actualizar Vuex y Vue Router?

Solo Vue Router 2 es compatible con Vue 2, así que sí, también tendrá que seguir la [ruta de migración de Vue Router](migration-vue-router.html). Afortunadamente, la mayoría de aplicaciones no tienen mucho código de rutas, por lo que probablemente no le tome más de una hora.

En cuanto a Vuex, incluso la versión 0.8 es compatible con Vue 2, por lo que no está obligado a actualizar. La única razón por la que es posible que desee actualizar de inmediato es aprovechar las nuevas funciones de Vuex 2, como los módulos y el _boilerplate_ reducido.

## Plantillas

### Fragmentos de instancias <sup>quitada</sup>

Cada componente debe tener exactamente un elemento raíz. Las instancias de fragmentos ya no están permitidas. Si tienes una plantilla como esta:

``` html
<p>foo</p>
<p>bar</p>
```

Se recomienda envolver todo el contenido en un nuevo elemento, como este:

``` html
<div>
  <p>foo</p>
  <p>bar</p>
</div>
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute sus pruebas de extremo a extremo o su después de la actualización y busque <strong>advertencias en la consola</strong> sobre varios elementos raíz en una plantilla.</p>
</div>
{% endraw %}

## Hooks del ciclo de vida

### `beforeCompile` <sup>quitado</sup>

Utilice el hook `created` en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migraciones</a> en su código base para encontrar usos de este hook.</p>
</div>
{% endraw %}

### `compiled` <sup>sustituido</sup>

En cambio use el nuevo hook `mounted`.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el  <a href="https://github.com/vuejs/vue-migration-helper">asistente de migraciones</a> en su código base para encontrar usos de este hook.</p>
</div>
{% endraw %}

### `attached` <sup>quitado</sup>

Utilice un chequeo personalizado en el DOM en otros hooks. Por ejemplo, para reemplazar:

``` js
attached: function () {
  doSomething()
}
```

Usted podría usar:

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el  <a href="https://github.com/vuejs/vue-migration-helper">asistente de migraciones</a> en su código base para encontrar usos de este hook.</p>
</div>
{% endraw %}

### `detached` <sup>quitado</sup>

Utilice un chequeo personalizado en el DOM en otros hooks. Por ejemplo, para reemplazar:

``` js
detached: function () {
  doSomething()
}
```

Usted podría usar:

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el  <a href="https://github.com/vuejs/vue-migration-helper">asistente de migraciones</a> en su código base para encontrar usos de este hook.</p>
</div>
{% endraw %}

### `init` <sup>renombrado</sup>

Use el hook `beforeCreate` hook en su lugar, que es esencialmente lo mismo. Se cambió su nombre por coherencia con otros métodos de ciclo de vida.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el  <a href="https://github.com/vuejs/vue-migration-helper">asistente de migraciones</a> en su código base para encontrar usos de este hook.</p>
</div>
{% endraw %}

### `ready` <sup>sustituido</sup>

Use el nuevo hook `mounted` en su lugar. Se debe tener en cuenta que con `mounted`, no hay garantía de estar en el documento. Para eso, también incluya `Vue.nextTick`/`vm.$NextTick`. Por ejemplo:

``` js
mounted: function () {
  this.$nextTick(function () {
    // código que asume this.$el está en el documento
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el  <a href="https://github.com/vuejs/vue-migration-helper">asistente de migraciones</a> en su código base para encontrar usos de este hook.</p>
</div>
{% endraw %}

## `v-for`

### `v-for` Orden de argumento para Arreglos <sup>cambiado</sup>

Cuando se incluye un `índice`, el orden de los argumentos para los arreglos solía ser `(índice, valor)`. Ahora es `(valor, índice)` para ser más coherente con los métodos de matriz nativos de JavaScript, como `forEach` y` map`.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> para encontrar ejemplos del orden de argumentos obsoleto. Tenga en cuenta que si nombra su argumento de índice con algún nombre inusual como <code>position</code> o <code>num</code>, el asistente no los encontrará.</p>
</div>
{% endraw %}

### `v-for` Orden de argumento para Objetos <sup>cambiado</sup>

Cuando se incluye una `clave`, el orden de los argumentos para los objetos solía ser `(clave, valor)`. Ahora es `(valor, clave)` para ser más consistente con iteradores de objetos comunes como lodash.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> para encontrar ejemplos del orden de argumento obsoleto. Tenga en cuenta que si nombra sus argumentos clave como <code>name</code> o <code>property</code>, el asistente no los encontrará.</p>
</div>
{% endraw %}

### `$index` y `$key` <sup>removido</sup>

Las variables implícitamente asignadas `$index` y `$key` se han eliminado a favor de definirlas explícitamente en `v-for`. Esto hace que el código sea más fácil de leer para los desarrolladores con menos experiencia en Vue y también da como resultado un comportamiento mucho más claro cuando se trata de bucles anidados.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> para encontrar ejemplos de estas variables removidas en su código. Si usted se pierde de alguna, también debería ver los <strong>errores de consola</strong> como: <code>Uncaught ReferenceError: $index is not defined</code></p>
</div>
{% endraw %}

### `track-by` <sup>reemplazado</sup>

`track-by` ha sido reemplazado por `key`, que funciona como cualquier otro atributo: sin el prefijo `v-bind:` o `:`, se trata como una cadena de texto literal. En la mayoría de los casos, usted desearía utilizar un enlace dinámico que espera una expresión completa en lugar de una clave. Por ejemplo, en lugar de:

```html
<div v-for="item in items" track-by="id">
```

Usted debería escribir:

```html
<div v-for="item in items" v-bind:key="item.id">
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> para encontrar ejemplos de <code>track-by</code> en su código.</p>
</div>
{% endraw %}

### `v-for` Valores de rango <sup>cambiado</sup>

Previamente, `v-for="number in 10"` tenía `number` empezando en 0 y terminando en 9. Ahora, comienza en 1 y termina en 10.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Busque en su código con la expresión regular <code>/\w+ in \d+/</code>. Donde sea que aparezca en un <code>v-for</code>, verifique si puede verse afectado.</p>
</div>
{% endraw %}

## Props

### Opción `coerce` de Props <sup>removido</sup>

Si usted quiere forzar una propiedad a retonar un valor diferente, configure un valor local computado basado en esta. Por ejemplo, en lugar de:

``` js
props: {
  username: {
    type: String,
    coerce: function (value) {
      return value
        .toLowerCase()
        .replace(/\s+/, '-')
    }
  }
}
```

Usted podría escribir:

``` js
props: {
  username: String,
},
computed: {
  normalizedUsername: function () {
    return this.username
      .toLowerCase()
      .replace(/\s+/, '-')
  }
}
```

Hay algunas ventajas:

- Usted todavía tiene acceso al valor original de la propiedad.
- Usted se ve forzado a ser más explícito, dándole a su valor un nombre que lo diferencie del valor pasado en la propiedad.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar casos de la opción <code>coerce</code>.</p>
</div>
{% endraw %}

### Opción `twoWay` de Props <sup>removido</sup>

Las propiedades ahora son siempre en un sentido. Para producir efectos colaterales en el _scope_ del padre, un componente debe emitir un evento explícitamente en vez de depender de una vinculación implícita. Por más información, vea:

- [Eventos Personalizados](components.html#Custom-Events)
- [Componentes `input` personalizados](components.html#Form-Input-Components-using-Custom-Events) (utilizando eventos de componentes)
- [Administración del Estado](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar casos de la opción <code>twoWay</code>.</p>
</div>
{% endraw %}

### Modifcadores `.once` y `.sync` en `v-bind` <sup>removido</sup>

Las propiedades ahora son siempre en un sentido. Para producir efectos colaterales en el _scope_ del padre, un componente debe emitir un evento explícitamente en vez de depender de una vinculación implícita. Por más información, vea:

- [Eventos Personalizados](components.html#Custom-Events)
- [Componentes `input` personalizados](components.html#Form-Input-Components-using-Custom-Events) (utilizando eventos de componentes)
- [Administración del Estado](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar casos de los modificadores <code>.once</code> y <code>.sync</code>.</p>
</div>
{% endraw %}

### Mutación de Propiedades <sup>deprecado</sup>

Ahora, mutar una propiedad local es considerado un anti-patrón. por ejemplo, declarar una propiedad y luego mutar la misma mediante `this.myProp = someOtherValue` en el componente. Dado el nuevo mecanismo de renderizado, siempre que el componente padre se re-renderize, los cambios locales de los componentes hijo se sobreescribirán.

La mayoría de los casos de uso que requieren mutar una propiedad pueden ser reemplazados por una de las siguientes opciones:

- una propiedad `data`, con la propiedad utilizada para indicar su valor por defecto
- una propiedad computada

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute sus <i>tests</i> de punta a punta y luego de la actualización busque por <strong>advertencias en consola</strong> sobre mutación de propiedades.</p>
</div>
{% endraw %}

### Props on a Root Instance <sup>reemplazado</sup>

En las instancias raíz de Vue (creadas con `new Vue({ ... })`), usted debe utilizar `propsData` en vez de `props`.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute sus <i>tests</i> de punta a punta, si tiene. Los <strong><i>tests</i> fallidos</strong> deberían alertarle que las propiedades pasadas a la instancia raíz ya no funcionan.</p>
</div>
{% endraw %}

## Propiedades computadas

### `cache: false` <sup>obsoleta</sup>

La invalidación del almacenamiento en caché de las propiedades computadas se eliminará en futuras versiones principales de Vue. Reemplace las propiedades computadas no almacenadas en caché con métodos, que tendrán el mismo resultado.

Por ejemplo:

``` js
template: '<p>message: {{ timeMessage }}</p>',
computed: {
  timeMessage: {
    cache: false,
    get: function () {
      return Date.now() + this.message
    }
  }
}
```

O con métodos de componentes:

``` js
template: '<p>message: {{ getTimeMessage }}</p>',
methods: {
  getTimeMessage: function () {
    return Date.now() + this.message
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración </a> en su código para encontrar ejemplos de <code>cache: false</code>.</p>
</div>
{% endraw %}

## Directivas incorporadas

### Veracidad/falsedad con `v-bind` <sup>cambiado</sup>

Cuando se usa con `v-bind`, los únicos valores falsos son ahora: `null`, `undefined` y `false`. Esto significa `0` y las cadenas de texto vacías evaluarán como verdaderas y se renderizarán. Entonces, por ejemplo, `v-bind:draggable="''"` se representará como `draggable="true"`.

Para los atributos enumerados, además de los valores falsos anteriores, la cadena `"false"` también se representará como `attr="false"`.

<p class="tip">
  Tenga en cuenta que para otras directivas (por ejemplo, `v-if` y `v-show`), la veracidad normal de JavaScript aún se aplica.
</p>

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute sus pruebas de extremo a extremo, si tiene una. Las <strong>pruebas fallidas</strong> le alertarán sobre cualquier parte de su aplicación que pueda ser afectada por este cambio.
  </p>
</div>
{% endraw %}

### Escuchar eventos nativos en componentes con `v-on` <sup>cambiado</sup>

Cuando se usa en un componente, `v-on` ahora solo escucha eventos personalizados (`$emit`) emitidos por ese componente. Para escuchar un evento del DOM nativo en el elemento raíz, usted puede usar el modificador `.native`. Por ejemplo:

``` html
<my-component v-on:click.native="doSomething"></my-component>
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute sus pruebas de extremo a extremo, si tiene una. Las <strong>pruebas fallidas</strong> le alertarán sobre cualquier parte de su aplicación que pueda ser afectada por este cambio.
  </p>
</div>
{% endraw %}

### `debounce` Atributo de parámetro para `v-model` <sup>eliminado</sup>

_Debouncing_ se usa para limitar la frecuencia con la que ejecutamos _requests_ Ajax y otras operaciones costosas. El parámetro de atributo `debounce` de Vue para `v-model` lo hizo fácil para casos muy simples, pero en realidad no dio lugar a __actualizaciones de estado__ en lugar de las costosas operaciones en sí mismas. Es una diferencia sutil, pero viene con limitaciones a medida que aumenta la complejidad de la aplicación.

Estas limitaciones se hacen evidentes al diseñar un indicador de búsqueda, como este, por ejemplo:

{% raw %}
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo" class="demo">
  <input v-model="searchQuery" placeholder="Escriba algo">
  <strong>{{ searchIndicator }}</strong>
</div>
<script>
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Trayendo nuevos resultados'
      } else if (this.searchQueryIsDirty) {
        return '... Escribiendo'
      } else {
        return '✓ Listo'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
</script>
{% endraw %}

Usando el atributo `debounce`, no habría forma de detectar el estado "Escribiendo", porque perdemos el acceso al estado en tiempo real de la entrada. Sin embargo, al desacoplar la función _debunce_ de Vue, solo podemos eliminar la operación que queremos limitar, eliminando los límites de las funciones que podemos desarrollar:

```html
<!--
Mediante el uso de la función _debounce_ de lodash u otra librería dedicada,
sabemos que la implementación específica de _debounce_ que usamos será la mejor-en-su-clase,
y podemos usarla EN CUALQUIER LUGAR. No solo
en nuestra plantilla
-->
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo">
  <input v-model="searchQuery" placeholder="Escriba algo">
  <strong>{{ searchIndicator }}</strong>
</div>
```

``` js
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Trayendo nuevos resultados'
      } else if (this.searchQueryIsDirty) {
        return '... Escribiendo'
      } else {
        return '✓ Listo'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    // This is where the debounce actually belongs.
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
```

Otra ventaja de este enfoque es que habrá momentos en que _debouncing_ no será la función de envoltura correcta. Por ejemplo, al llamar a una API para buscar sugerencias, esperar para ofrecer sugerencias hasta después de que el usuario haya dejado de escribir por un período de tiempo no es una experiencia ideal. Lo que probablemente quieras es una función de  __throttling__. Ahora, como ya está utilizando una biblioteca de utilidades como lodash, la refactorización para usar su función `throttle` en su lugar solo lleva unos segundos.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código fuente para encontrar usos de <code>debounce</code>.
  </p>
</div>
{% endraw %}

### `lazy` or `number` Param Attributes for `v-model` <sup>replaced</sup>

The `lazy` and `number` param attributes are now modifiers, to make it more clear what That means instead of:

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

You would use:

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the these param attributes.</p>
</div>
{% endraw %}

### `value` Attribute with `v-model` <sup>removed</sup>

`v-model` no longer cares about the initial value of an inline `value` attribute. For predictability, it will instead always treat the Vue instance data as the source of truth.

That means this element:

``` html
<input v-model="text" value="foo">
```

backed by this data:

``` js
data: {
  text: 'bar'
}
```

will render with a value of "bar" instead of "foo". The same goes for a `<textarea>` with existing content. Instead of:

``` html
<textarea v-model="text">
  hello world
</textarea>
```

You should ensure your initial value for `text` is "hello world".

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about inline value attributes with <code>v-model</code>.</p>
</div>
{% endraw %}

### `v-model` with `v-for` Iterated Primitive Values <sup>removed</sup>

Cases like this no longer work:

``` html
<input v-for="str in strings" v-model="str">
```

The reason is this is the equivalent JavaScript that the `<input>` would compile to:

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

As you can see, `v-model`'s two-way binding doesn't make sense here. Setting `str` to another value in the iterator function will do nothing because it's only a local variable in the function scope.

Instead, you should use an array of __objects__ so that `v-model` can update the field on the object. For example:

``` html
<input v-for="obj in objects" v-model="obj.str">
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your test suite, if you have one. The <strong>failed tests</strong> should alert to you to any parts of your app that may be affected by this change.</p>
</div>
{% endraw %}

### `v-bind:style` with Object Syntax and `!important` <sup>removed</sup>

This will no longer work:

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hello</p>
```

If you really need to override another `!important`, you must use the string syntax:

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hello</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of style bindings with <code>!important</code> in objects.</p>
</div>
{% endraw %}

### `v-el` and `v-ref` <sup>replaced</sup>

For simplicity, `v-el` and `v-ref` have been merged into the `ref` attribute, accessible on a component instance via `$refs`. That means `v-el:my-element` would become `ref="myElement"` and `v-ref:my-component` would become `ref="myComponent"`. When used on a normal element, the `ref` will be the DOM element, and when used on a component, the `ref` will be the component instance.

Since `v-ref` is no longer a directive, but a special attribute, it can also be dynamically defined. This is especially useful in combination with `v-for`. For example:

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

Previously, `v-el`/`v-ref` combined with `v-for` would produce an array of elements/components, because there was no way to give each item a unique name. You can still achieve this behavior by given each item the same `ref`:

``` html
<p v-for="item in items" ref="items"></p>
```

Unlike in 1.x, these `$refs` are not reactive, because they're registered/updated during the render process itself. Making them reactive would require duplicate renders for every change.

On the other hand, `$refs` are designed primarily for programmatic access in JavaScript - it is not recommended to rely on them in templates, because that would mean referring to state that does not belong to the instance itself. This would violate Vue's data-driven view model.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>v-el</code> and <code>v-ref</code>.</p>
</div>
{% endraw %}

### `v-else` with `v-show` <sup>removed</sup>

`v-else` no longer works with `v-show`. Use `v-if` with a negation expression instead. For example, instead of:

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">Not foo, but bar</p>
```

You can use:

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">Not foo, but bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>v-else</code> with <code>v-show</code>.</p>
</div>
{% endraw %}

## Directivas personalizadas <sup>simplificado</sup>

Las directivas tienen un alcance de responsabilidad muy reducido: ahora solo se usan para aplicar manipulaciones del DOM de bajo nivel. En la mayoría de los casos, debería preferir usar componentes como la abstracción principal de reutilización de código.

Algunas de las diferencias más notables incluyen:

- Las directivas ya no tienen instancias. Esto significa que no hay más `this` dentro de los hooks de la directiva. En cambio, reciben todo lo que puedan necesitar como argumentos. Si realmente debe persistir el estado a través de los hooks, puede hacerlo en el elemento `el`.
- Opciones como `acceptStatement`, `deep`, `priority`, etc han sido removidas. Para reemplazar directivas `twoWay`, vea [este ejemple](#Two-Way-Filters-replaced).
- Algunos de los hooks actuales tienen un comportamiento diferente y también algunos hooks nuevos.

Afortunadamente, dado que las nuevas directivas son mucho más simples, puede dominarlas más fácilmente. Lea la nueva [Guía de directivas personalizadas](custom-directive.html) para obtener más información.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de directivas definidas. El asistente las marcará a todas, ya que es probable que en la mayoría de los casos desee refactorizar a un componente.
  </p>
</div>
{% endraw %}

### Directiva `.literal` Modificador <sup>removido</sup>

Se ha eliminado el modificador `.literal`, ya que se puede lograr fácilmente proporcionando una cadena de texto como valor.

Por ejemplo, puede cambiar:

``` js
<p v-my-directive.literal="foo bar baz"></p>
```

por:

``` html
<p v-my-directive="'foo bar baz'"></p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos del modificador `.literal` en una directiva.</p>
</div>
{% endraw %}

## Transiciones

### Atributo `transition` <sup>reemplazado</sup>

El sistema de transición de Vue ha cambiado drásticamente y ahora usa elementos de envoltura `<transition>` y `<transition-group>`, en lugar del atributo `transition`. Se recomienda leer la nueva [Guía de transiciones](transitions.html) para obtener más información.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos del atributo <code>transition</code>.</p>
</div>
{% endraw %}

### `Vue.transition` para transiciones reutilizables <sup>reemplazado</sup>

Con el nuevo sistema de transición, ahora puede [usar componentes para transiciones reutilizables](transitions.html#Reusable-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplose de <code>Vue.transition</code>.</p>
</div>
{% endraw %}

### Atributo de Transición `stagger` <sup>removido</sup>

Si necesita escalonar las transiciones de la lista, puede controlar el tiempo configurando y accediendo a un `data-index` (o atributo similar) en un elemento. Vea [un ejemplo aquí](transitions.html#Staggering-List-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos del atributo <code>transition</code>. Durante su actualización, usted puede hacer la transición (juego de palabras muy intencionado) a la nueva estrategia asombrosa también.
  </p>
</div>
{% endraw %}

## Eventos

### Opción `events` <sup>removido</sup>

La opción `events` ha sido removida. Ahora, Los manejadores de eventos deben ser registrados en el _hook_ `created`. Vea la [guía de migración de `$dispatch` y `$broadcast`](#dispatch-and-broadcast-replaced) para un ejemplo detallado.

### `Vue.directive('on').keyCodes` <sup>reemplazado</sup>

La nueva forma más concisa de configurar `keyCodes` es a través de `Vue.config.keyCodes`. Por ejemplo:

``` js
// habilitar v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de la vieja sintaxis de configuración de <code>keyCode</code>.</p>
</div>
{% endraw %}

### `$dispatch` y `$broadcast` <sup>reemplazado</sup>

`$dispatch` y `$broadcast` han sido removidos en favor de una comunicación más explícita entre componentes y soluciones de manejo de estado más mantenibles, así como [Vuex](https://github.com/vuejs/vuex).

El problema son los flujos de eventos que dependen de la estructura del árbol de componentes, pueden ser difíciles de razonar y muy frágiles cuando el árbol se vuelve grande. No escala bien y no queremos prepararnos para sufrir luego. `$dispatch` y `$broadcast` tampoco resuelven la comunicación entre componentes hermanos.

Uno de los casos de uso más común para estos métodos es para la comunicación directa entre un componente padre y sus hijos. En estos casos, usted pueden [escuchar a un `$emit` desde un componente hijo con `v-on`](components.html#Form-Input-Components-using-Custom-Events). Esto le permite mantener la conveniencia de los eventos.

Sin embargo, cuando se quiere comunicar descendientes/antepasados distantes, `$emit` no le será de ayuda. En cambio, la forma más simple de resolver este problema sería utilizando un _event hub_ centralizado. Esto tiene la ventaja de que permite comunicar componente sin importar dónde estén en el árbol de componentes - ¡incluso si son hermanos! Dado que las instancias de Vue implementan una interfaz de emisión de eventos, usted puede utilizar una instancia de Vue vacía para este propósito.

Por ejemplo, digamos que tenemos una aplicación de _todo_ estructurada de la siguiente manera:

```
Todos
|-- NewTodoInput
|-- Todo
    |-- DeleteTodoButton
```

Podríamos manejar la comunicación entre componentes con un simple _event hub_:

``` js
// Este es el event hub que usaremos en cada
// componente para comunicarlos entre sí.
var eventHub = new Vue()
```

Luego, en nuestros componentes, podemos utilizar `$emit`, `$on`, `$off` para emitir eventos, escuchar por eventos y para limpiar _listeners_ respectivamente:

``` js
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
```

``` js
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```

``` js
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// Es bueno limpiar los listeners antes
// de que un componente sea destruido.
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

Este patrón puede servir como reemplazo para `$dispatch` y `$broadcast` en escenarios simples, pero para casos más complejos, se recomienda el uso de una capa dedicada al manejo de estado, tal como [Vuex](https://github.com/vuejs/vuex).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>$dispatch</code> y <code>$broadcast</code>.</p>

</div>
{% endraw %}

## Filters

### Filters Outside Text Interpolations <sup>removed</sup>

Filters can now only be used inside text interpolations (`{% raw %}{{ }}{% endraw %}` tags). In the past we've found using filters within directives such as `v-model`, `v-on`, etc led to more complexity than convenience. For list filtering on `v-for`, it's also better to move that logic into JavaScript as computed properties, so that it can be reused throughout your component.

In general, whenever something can be achieved in plain JavaScript, we want to avoid introducing a special syntax like filters to take care of the same concern. Here's how you can replace Vue's built-in directive filters:

#### Replacing the `debounce` Filter

Instead of:

``` html
<input v-on:keyup="doStuff | debounce 500">
```

``` js
methods: {
  doStuff: function () {
    // ...
  }
}
```

Use [lodash's `debounce`](https://lodash.com/docs/4.15.0#debounce) (or possibly [`throttle`](https://lodash.com/docs/4.15.0#throttle)) to directly limit calling the expensive method. You can achieve the same as above like this:

``` html
<input v-on:keyup="doStuff">
```

``` js
methods: {
  doStuff: _.debounce(function () {
    // ...
  }, 500)
}
```

For more on the advantages of this strategy, see [the example here with `v-model`](#debounce-Param-Attribute-for-v-model-removed).

#### Replacing the `limitBy` Filter

Instead of:

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

Use JavaScript's built-in [`.slice` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples) in a computed property:

``` html
<p v-for="item in filteredItems">{{ item }}</p>
```

``` js
computed: {
  filteredItems: function () {
    return this.items.slice(0, 10)
  }
}
```

#### Replacing the `filterBy` Filter

Instead of:

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

Use JavaScript's built-in [`.filter` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples) in a computed property:

``` html
<p v-for="user in filteredUsers">{{ user.name }}</p>
```

``` js
computed: {
  filteredUsers: function () {
    var self = this
    return self.users.filter(function (user) {
      return user.name.indexOf(self.searchQuery) !== -1
    })
  }
}
```

JavaScript's native `.filter` can also manage much more complex filtering operations, because you have access to the full power of JavaScript within computed properties. For example, if you wanted to find all active users and case-insensitively match against both their name and email:

``` js
var self = this
self.users.filter(function (user) {
  var searchRegex = new RegExp(self.searchQuery, 'i')
  return user.isActive && (
    searchRegex.test(user.name) ||
    searchRegex.test(user.email)
  )
})
```

#### Replacing the `orderBy` Filter

Instead of:

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

Use [lodash's `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (or possibly [`sortBy`](https://lodash.com/docs/4.15.0#sortBy)) in a computed property:

``` html
<p v-for="user in orderedUsers">{{ user.name }}</p>
```

``` js
computed: {
  orderedUsers: function () {
    return _.orderBy(this.users, 'name')
  }
}
```

You can even order by multiple columns:

``` js
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters being used inside directives. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Filter Argument Syntax <sup>changed</sup>

Filters' syntax for arguments now better aligns with JavaScript function invocation. So instead of taking space-delimited arguments:

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

We surround the arguments with parentheses and delimit the arguments with commas:

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the old filter syntax. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Built-In Text Filters <sup>removed</sup>

Although filters within text interpolations are still allowed, all of the filters have been removed. Instead, it's recommended to use more specialized libraries for solving problems in each domain (e.g. [`date-fns`](https://date-fns.org/) to format dates and [`accounting`](http://openexchangerates.github.io/accounting.js/) for currencies).

For each of Vue's built-in text filters, we go through how you can replace them below. The example code could exist in custom helper functions, methods, or computed properties.

#### Replacing the `json` Filter

You actually don't need to for debugging anymore, as Vue will nicely format output for you automatically, whether it's a string, number, array, or plain object. If you want the exact same functionality as JavaScript's `JSON.stringify` though, then you can use that in a method or computed property.

#### Replacing the `capitalize` Filter

``` js
text[0].toUpperCase() + text.slice(1)
```

#### Replacing the `uppercase` Filter

``` js
text.toUpperCase()
```

#### Replacing the `lowercase` Filter

``` js
text.toLowerCase()
```

#### Replacing the `pluralize` Filter

The [pluralize](https://www.npmjs.com/package/pluralize) package on NPM serves this purpose nicely, but if you only want to pluralize a specific word or want to have special output for cases like `0`, then you can also easily define your own pluralize functions. For example:

``` js
function pluralizeKnife (count) {
  if (count === 0) {
    return 'no knives'
  } else if (count === 1) {
    return '1 knife'
  } else {
    return count + 'knives'
  }
}
```

#### Replacing the `currency` Filter

For a very naive implementation, you could do something like this:

``` js
'$' + price.toFixed(2)
```

In many cases though, you'll still run into strange behavior (e.g. `0.035.toFixed(2)` rounds up to `0.04`, but `0.045` rounds down to `0.04`). To work around these issues, you can use the [`accounting`](http://openexchangerates.github.io/accounting.js/) library to more reliably format currencies.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete text filters. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Two-Way Filters <sup>replaced</sup>

Some users have enjoyed using two-way filters with `v-model` to create interesting inputs with very little code. While _seemingly_ simple however, two-way filters can also hide a great deal of complexity - and even encourage poor UX by delaying state updates. Instead, components wrapping an input are recommended as a more explicit and feature-rich way of creating custom inputs.

As an example, we'll now walk the migration of a two-way currency filter:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

It mostly works well, but the delayed state updates can cause strange behavior. For example, click on the `Result` tab and try entering `9.999` into one of those inputs. When the input loses focus, its value will update to `$10.00`. When looking at the calculated total however, you'll see that `9.999` is what's stored in our data. The version of reality that the user sees is out of sync!

To start transitioning towards a more robust solution using Vue 2.0, let's first wrap this filter in a new `<currency-input>` component:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This allows us add behavior that a filter alone couldn't encapsulate, such as selecting the content of an input on focus. Now the next step will be to extract the business logic from the filter. Below, we pull everything out into an external [`currencyValidator` object](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e):

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This increased modularity not only makes it easier to migrate to Vue 2, but also allows currency parsing and formatting to be:

- unit tested in isolation from your Vue code
- used by other parts of your application, such as to validate the payload to an API endpoint

Having this validator extracted out, we've also more comfortably built it up into a more robust solution. The state quirks have been eliminated and it's actually impossible for users to enter anything wrong, similar to what the browser's native number input tries to do.

We're still limited however, by filters and by Vue 1.0 in general, so let's complete the upgrade to Vue 2.0:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You may notice that:

- Every aspect of our input is more explicit, using lifecycle hooks and DOM events in place of the hidden behavior of two-way filters.
- We can now use `v-model` directly on our custom inputs, which is not only more consistent with normal inputs, but also means our component is Vuex-friendly.
- Since we're no longer using filter options that require a value to be returned, our currency work could actually be done asynchronously. That means if we had a lot of apps that had to work with currencies, we could easily refactor this logic into a shared microservice.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters used in directives like <code>v-model</code>. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Slots

### Slots Duplicados <sup>removido</sup>

Ya no se admite tener `<slot>`s con el mismo nombre en la misma plantilla. Cuando se renderiza un slot, se "agota" y no se puede procesar en otro lugar del mismo árbol de procesamiento. Si debe representar el mismo contenido en varios lugares, pase ese contenido como propiedad.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute su suite o aplicación de prueba de extremo a extremo después de la actualización y busque <strong>advertencias en la consola</strong> sobre slots <code>v-model</code> duplicados.</p>
</div>
{% endraw %}

### `slot` Atributo de Estilo<sup>removido</sup>


El contenido insertado mediante el nombre `<slot>` ya no conserva el atributo `slot`. Utilice un elemento contenedor para aplicarles estilo, o para casos de uso avanzados, modifique el contenido insertado mediante programación utilizando [funciones de renderizado](render-function.html).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar selectores CSS haciendo referencia a slots con nombres (ej: <code>[slot="mi-nombre -de-slot"]</code>).</p>
</div>
{% endraw %}

## Atributos especiales

### Atributo `keep-alive` <sup>reemplazado</sup>

`keep-alive` ya no es un atributo especial, sino más bien un componente contenedor, similar a `<transition>`.
Por ejemplo:

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

Esto hace posible usar `<keep-alive>` en múltiples hijos condicionales:

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">Cuando `<keep-alive>` tiene varios hijos, eventualmente debería evaluar a un solo hijo. Cualquier hijo que no sea el primero será ignorado.</p>

Cuando se usa junto con `<transition>`, asegúrese de anidarlo dentro:

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecutar el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar atributos <code>keep-alive</code>.</p>
</div>
{% endraw %}

## Interpolaciones

### Interpolaciones dentro de Atributos <sup>removido</sup>

La interpolación dentro de atributos ya no es válida. Por ejemplo:

``` html
<button class="btn btn-{{ size }}"></button>
```

Debería actualizarse para utilizar una expresión _inline_:

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

O una propiedad _data_ o computada:

``` html
<button v-bind:class="buttonClasses"></button>
```

``` js
computed: {
  buttonClasses: function () {
    return 'btn btn-' + size
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de interpolaciones dentro de atributos.</p>
</div>
{% endraw %}


### Interpolación HTML <sup>removido</sup>

Las interpolaciones HTML (`{% raw %}{{{ foo }}}{% endraw %}`) han sido removidas en favor de la [directiva `v-html`](../api/#v-html).


{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar interpolaciones HTML.</p>
</div>
{% endraw %}

### Enlaces _One-Time_ <sup>reemplazado</sup>

Los enlaces _one-time_ (`{% raw %}{{* foo }}{% endraw %}`) han sido reemplazados por la nueva [directiva `v-once`](../api/#v-once).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar enlaces <i>one-time</i>.</p>
</div>
{% endraw %}

## Reactivity

### `vm.$watch` <sup>changed</sup>

Watchers created via `vm.$watch` are now fired before the associated component rerenders. This gives you the chance to further update state before the component rerender, thus avoiding unnecessary updates. For example, you can watch a component prop and update the component's own data when the prop changes.

If you were previously relying on `vm.$watch` to do something with the DOM after a component updates, you can instead do so in the `updated` lifecycle hook.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to the fact that a watcher was relying on the old behavior.</p>
</div>
{% endraw %}

### `vm.$set` <sup>changed</sup>

`vm.$set` is now an alias for [`Vue.set`](../api/#Vue-set).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `vm.$delete` <sup>changed</sup>

`vm.$delete` is now an alias for [`Vue.delete`](../api/#Vue-delete).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `Array.prototype.$set` <sup>removed</sup>

Use `Vue.set` instead.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$set</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>removed</sup>

Use `Array.prototype.splice` instead. For example:

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

Or better yet, pass removal methods an index:

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$remove</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Vue.set` and `Vue.delete` on Vue instances <sup>removed</sup>

`Vue.set` and `Vue.delete` can no longer work on Vue instances. It is now mandatory to properly declare all top-level reactive properties in the data option. If you'd like to delete properties on a Vue instance or its `$data`, set it to null.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.set</code> or <code>Vue.delete</code> on a Vue instance. If you miss any, they'll trigger <strong>console warnings</strong>.</p>
</div>
{% endraw %}

### Replacing `vm.$data` <sup>removed</sup>

It is now prohibited to replace a component instance's root $data. This prevents some edge cases in the reactivity system and makes the component state more predictable (especially with type-checking systems).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of overwriting <code>vm.$data</code>. If you miss any, <strong>console warnings</strong> will be emitted.</p>
</div>
{% endraw %}

### `vm.$get` <sup>removed</sup>

Instead, retrieve reactive data directly.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$get</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Métodos de instancia centrados en el DOM

### `vm.$appendTo` <sup>removido</sup>

Use la API nativa del DOM:

```js
myElement.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>vm.$appendTo</code>. En caso de omitir alguno, verá <strong>errores en la consola</strong>.
  </p>
</div>
{% endraw %}

### `vm.$before` <sup>removido</sup>

Use la API nativa del DOM:

```js
myElement.parentNode.insertBefore(vm.$el, myElement)
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>vm.$before</code>. En caso de omitir alguno, verá <strong>errores en la consola</strong>.
  </p>
</div>
{% endraw %}

### `vm.$after` <sup>removido</sup>

Use la API nativa del DOM:

```js
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
```

O si `myElement` es el último hijo:

```js
myElement.parentNode.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>vm.$after</code>. En caso de omitir alguno, verá <strong>errores en la consola</strong>.
  </p>
</div>
{% endraw %}

### `vm.$remove` <sup>removido</sup>

Use la API nativa del DOM:

```js
vm.$el.remove()
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>vm.$remove</code>. En caso de omitir alguno, verá <strong>errores en la consola</strong>.
  </p>
</div>
{% endraw %}

## Métodos de meta instancia

### `vm.$eval` <sup>removida</sup>

Sin uso real. Si de alguna manera confía en esta característica y no está seguro de cómo solucionarla, publique en el [foro](https://forum.vuejs.org/) para obtener ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>vm.$eval</code>. En caso de omitir alguno, usted verá <strong>errores en la consola</strong>.
  </p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>removida</sup>

Sin uso real. Si de alguna manera confía en esta característica y no está seguro de cómo solucionarla, publique en el [foro](https://forum.vuejs.org/) para obtener ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>vm.$interpolate</code>. En caso de omitir alguno, usted verá <strong>errores en la consola</strong>.
  </p>
</div>
{% endraw %}

### `vm.$log` <sup>removida</sup>

Use las [Vue Devtools](https://github.com/vuejs/vue-devtools) para obtener una experiencia de depuración óptima.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>vm.$log</code>. En caso de omitir alguno, usted verá <strong>errores en la consola</strong>.
  </p>
</div>
{% endraw %}

## Opciones de la instancia DOM

### `replace: false` <sup>removido</sup>

Los componentes ahora siempre reemplazan al elemento al que están vinculados. Para simular el comportamiento de `replace: false`, usted puede ajustar su componente raíz con un elemento similar al que está reemplazando. Por ejemplo:

```js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

O con una función de renderizado:

```js
new Vue({
  el: '#app',
  render: function (h) {
    h('div', {
      attrs: {
        id: 'app',
      }
    }, /* ... */)
  }
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>replace: false</code>.
  </p>
</div>
{% endraw %}

## Global Config

### `Vue.config.debug` <sup>removed</sup>

No longer necessary, since warnings come with stack traces by default now.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.debug</code>.</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>removed</sup>

Async is now required for rendering performance.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.async</code>.</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>replaced</sup>

This has been reworked as a [component-level option](../api/#delimiters). This allows you to use alternative delimiters within your app without breaking 3rd-party components.

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.delimiters</code>.</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>removed</sup>

HTML interpolation has been [removed in favor of `v-html`](#HTML-Interpolation-removed).

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.unsafeDelimiters</code>. After this, the helper will also find instances of HTML interpolation so that you can replace them with `v-html`.</p>
</div>
{% endraw %}

## API Global

### `Vue.extend` con `el` <sup>removido</sup>

La opción `el` ya no se puede usar en `Vue.extend`. Solo es válido como una opción de creación de instancia.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute su suite o aplicación de prueba de extremo a extremo después de la actualización y busque <strong>advertencias en la consola</strong> sobre <code>el</code> con <code>Vue.extend</code>.
  </p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>removido</sup>

Use componentes en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>Vue.elementDirective</code>.
  </p>
</div>
{% endraw %}

### `Vue.partial` <sup>removido</sup>

Se han eliminado los parciales a favor de un flujo de datos más explícito entre los componentes, utilizando propiedades. A menos que esté usando un parcial en un área de rendimiento crítico, la recomendación es usar un [componente normal](components.html) en su lugar. Si usted vinculaba dinámicamente el `nombre (name)` de un parcial, puede usar un [componente dinámico](components.html#Dynamic-Components).

Si utiliza parciales en una parte crítica de su aplicación, entonces debe actualizar a [componentes funcionales](render-function.html#Functional-Components). Deben estar en un archivo JS/JSX simple (en lugar de en un archivo `.vue`) y no tienen estado ni instancia, como los parciales. Esto hace que el renderizado sea extremadamente rápido.

Una ventaja de los componentes funcionales sobre los parciales es que pueden ser mucho más dinámicos, ya que le otorgan acceso a todo el poder de JavaScript. Sin embargo, hay un costo para este poder. Si nunca antes ha usado un framework de componentes con funciones de renderizado, puede tardar un poco más en aprender.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>Vue.partial</code>.
  </p>
</div>
{% endraw %}
