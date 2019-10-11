---
title: Migración desde Vue 1.x
type: guide
order: 701
---

## Preguntas frecuentes

> Woah - ¡esta página es súper larga! ¿Eso significa que la versión 2.0 es completamente diferente y tendré que aprender los conceptos básicos una y otra vez y la migración será prácticamente imposible?

¡Me alegra que lo pregunte! La respuesta es no. Alrededor del 90% de la API es la misma y los conceptos básicos no han cambiado. Es largo porque nos gusta ofrecer explicaciones muy detalladas e incluir muchos ejemplos. Quédese tranquilo, __¡esto no es algo que tenga que leer de arriba abajo!__

> ¿Por dónde debería comenzar una migración?

1. Comience ejecutando el [asistente de migración](https://github.com/vuejs/vue-migration-helper) en un proyecto actual. Hemos minimizado y comprimido cuidadosamente un desarrollador de Vue senior en una interfaz de línea de comando simple. Así, cada vez que se reconoce una característica obsoleta, le informa, ofrece sugerencias y proporciona enlaces a más información.

2. Después de eso, navegue por la tabla de contenido de esta página en la barra lateral. Si ve un tema que puede afectarle, pero que el asistente de migración no captó, compruébelo.

3. Si usted tiene algunos tests, ejecútelos y vea los que aún fallan. Si no tiene tests, solo abra la aplicación en su navegador y esté atento a las advertencias o errores mientras navega.

4. En este punto, su aplicación debería estar migrada por completo. Si aún tiene ganas de más, puede leer el resto de esta página [desde el principio](index.html). Muchas partes serán demasiado fáciles, ya que ya está familiarizado con los conceptos básicos.

> ¿Cuánto tiempo me llevará migrar una aplicación de Vue 1.x a 2.0?

Depende de algunos factores:

- El tamaño de su aplicación (en las aplicaciones pequeñas y medianas probablemente será menos de un día)

- Cuantas veces se distrae y comienza a jugar con una nueva función genial.😉 &nbsp;No le juzgamos, ¡a nosotros también nos pasó mientras construíamos 2.0!

- Las funciones obsoletas que esté usando. La mayoría se pueden actualizar con Buscar y Reemplazar, pero otras pueden tardar unos minutos. Si actualmente no está siguiendo las mejores prácticas, Vue 2.0 también intentará forzarle más a hacerlo. Esto es algo bueno a largo plazo, pero también podría significar una actualización significativa (aunque posiblemente le retrase).

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
  <p>
    Ejecute sus pruebas de extremo a extremo o su aplicación después de la actualización y busque <strong>advertencias en la consola</strong> sobre varios elementos raíz en una plantilla.
  </p>
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
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> para encontrar ejemplos de estas variables removidas en su código. Si usted se olvida de alguna, debería ver <strong>errores de consola</strong> como: <code>Uncaught ReferenceError: $index is not defined</code></p>
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
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>cache: false</code>.</p>
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

_Debouncing_ se usa para limitar la frecuencia con la que ejecutamos solicitudes Ajax y otras operaciones costosas. El parámetro de atributo `debounce` de Vue para `v-model` lo hizo fácil para casos muy simples, pero en realidad no dio lugar a __actualizaciones de estado__ en lugar de las costosas operaciones en sí mismas. Es una diferencia sutil, pero viene con limitaciones a medida que aumenta la complejidad de la aplicación.

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

Usando el atributo `debounce`, no habría forma de detectar el estado "Escribiendo", porque perdemos el acceso al estado en tiempo real de la entrada. Sin embargo, al desacoplar la función _debounce_ de Vue, solo podemos eliminar la operación que queremos limitar, eliminando los límites de las funciones que podemos desarrollar:

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

### `lazy` o `number` Atributos de parámetro para `v-model` <sup>cambiado</sup>

Los atributos de parámetro `lazy` y `number` ahora son modificadores, para que quede más claro lo que eso significa, veamos el siguiente ejemplo:

En vez de:

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

Usted usará:

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código base para encontrar ejemplos de estos atributos de parámeto.
  </p>
</div>
{% endraw %}

### Atributo `value` con `v-model` <sup>eliminado</sup>

`v-model` ya no se preocupa por el valor inicial de un atributo en línea `value`. Para la previsibilidad, siempre tratará los datos de la instancia de Vue como la fuente de la verdad.

Eso significa que este elemento:

``` html
<input v-model="text" value="foo">
```

respaldado por estos datos:

``` js
data: {
  text: 'bar'
}
```

se renderizará con un valor de "bar" en lugar de "foo". Lo mismo ocurre con un `<textarea>` con contenido existente. En lugar de:

``` html
<textarea v-model="text">
  Hola mundo
</textarea>
```

Usted debe asegurarse de que su valor inicial para `text` sea "Hola mundo".

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute sus pruebas de extremo a extremo o su aplicación luego de la actualización, y busque <strong>advertencias de consola</strong> sobre valores en línea para atributos con <code>v-model</code>.
  </p>
</div>
{% endraw %}

### `v-model` con `v-for` Valores primitivos iterados <sup>eliminados</sup>

Casos como este ya no funcionan:

``` html
<input v-for="str in strings" v-model="str">
```

La razón es que este es el código JavaScript equivalente que compilaría el `<input>`:

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

Como usted puede ver, el enlace bidireccional de `v-model` no tiene sentido aquí. Establecer `str` en otro valor en la función de iterador no hará nada porque es solo una variable local en el alcance de la función.

En su lugar, usted debe utilizar un arreglo de __Objetos__ para que `v-model` pueda actualizar el campo en el objeto. Por ejemplo:

``` html
<input v-for="obj in objects" v-model="obj.str">
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute su conjunto de pruebas, si tiene uno. Las <strong>pruebas fallidas</strong> deberían alertarlo sobre cualquier parte de su aplicación que pueda verse afectada por este cambio.
  </p>
</div>
{% endraw %}


### `v-bind:style` con sintaxis de Objeto y `!important` <sup>eliminado</sup>

Esto ya no funcionará:

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hola</p>
```

Si usted realmente necesita anular otro `!Important`, debe usar la sintaxis de cadena de texto:

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hola</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de estilos unidos con <code>!important</code> en los Objetos.
  </p>
</div>
{% endraw %}

### `v-el` y `v-ref` <sup>cambiado</sup>

Para simplificar, `v-el` y `v-ref` se han fusionado en el atributo `ref`, accesible en una instancia de componente a través de `$refs`. Eso significa que `v-el:my-element` se convertiría en `ref="myElement"` y `v-ref:my-component` se convertiría en `ref="myComponent"`. Cuando se usa en un elemento normal, la `ref` será el elemento DOM, y cuando se use en un componente, la `ref` será la instancia del componente.

Como `v-ref` ya no es una directiva, sino un atributo especial, también se puede definir dinámicamente. Esto es especialmente útil en combinación con `v-for`. Por ejemplo:

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

Anteriormente, `v-el`/`v-ref` combinado con `v-for` produciría una serie de elementos/componentes, porque no había forma de darle a cada elemento un nombre único. Usted todavía puede lograr este comportamiento si le da a cada elemento la misma `ref`:

``` html
<p v-for="item in items" ref="items"></p>
```

A diferencia de 1.x, estos `$refs` no son reactivos, porque están registrados/actualizados durante el proceso de renderización. Hacerlos reactivos requeriría renders duplicados para cada cambio.

Por otro lado, los `$refs` están diseñados principalmente para el acceso programático en JavaScript; no se recomienda confiar en ellos en las plantillas, porque eso significaría referirse al estado que no pertenece a la instancia en sí. Esto violaría el modelo de vista basado en datos de Vue.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>v-el</code> y <code>v-ref</code>.
  </p>
</div>
{% endraw %}

### `v-else` con `v-show` <sup>eliminado</sup>

`v-else` ya no funciona con `v-show`. Utilice `v-if` con una expresión de negación en su lugar. Por ejemplo, en lugar de:

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">No foo, pero bar</p>
```

Usted puede usar:

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">No foo, pero bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>v-else</code> con <code>v-show</code>.
  </p>
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

## Filtros

### Filtros fuera de interpolaciones de texto <sup>removido</sup>

Los filtros ahora solo pueden usarse dentro de interpolaciones de texto (etiquetas `{% raw %}{{ }}{% endraw %}`). En el pasado, descubrimos que usar filtros dentro de directivas como `v-model`,` v-on`, etc. conducía a una mayor complejidad que conveniencia. Para el filtrado de listas en `v-for`, también es mejor mover esa lógica a JavaScript como propiedades computadas, para que pueda reutilizarse en todo su componente.

En general, cada vez que se puede lograr algo en JavaScript simple, queremos evitar la introducción de una sintaxis especial como filtros para atender la misma preocupación. Así es como puede reemplazar los filtros de directiva incorporados de Vue:

#### Reemplazando el Filtro `debounce`

En lugar de:

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

Use [el `debounce` de lodash](https://lodash.com/docs/4.15.0#debounce) (o posiblemente [`throttle`](https://lodash.com/docs/4.15.0#throttle)) para limitar directamente la llamada al método costoso. Puede lograr lo mismo que arriba así:

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

Para obtener más información sobre las ventajas de esta estrategia, consulte [el ejemplo aquí con `v-model`]
(#debounce-Param-Attribute-for-v-model-removed).

#### Reemplazando el Filtro `limitBy`

En lugar de:

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

Use el [`.slice` de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples) en una propiedad computada:

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

#### Reemplazando el Filtro `filterBy`

En lugar de:

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

Use el [`.filter` de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples) en una propiedad computada:

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

El `.filter` nativo de JavaScript también puede manejar operaciones de filtrado mucho más complejas, porque tiene acceso a todo el poder de JavaScript dentro de las propiedades computadas. Por ejemplo, si desea encontrar todos los usuarios activos, filtrando por nombre y correo electrónico sin hacer distinción entre mayúsculas y minúsculas:

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

#### Reemplazando el Filtro `orderBy`

En lugar de:

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

Use el [`orderBy` de lodash](https://lodash.com/docs/4.15.0#orderBy) (o posiblemente [`sortBy`](https://lodash.com/docs/4.15.0#sortBy)) en una propiedad computada:

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

Incluso puede ordenar por múltiples columnas:

``` js
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper"> asistente de migración </a> sobre su código para encontrar ejemplos de filtros que se utilizan dentro de las directivas. Si pierde alguno, también puede ver <strong>errores de consola </strong>.</p>
</div>
{% endraw %}

### Sintaxis de argumentos para filtros <sup>modificado</sup>

La sintaxis de los filtros para argumentos ahora se alinea mejor con la invocación de la función de JavaScript. Entonces, en lugar de tomar argumentos delimitados por espacios:

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

Rodeamos los argumentos con paréntesis y delimitamos los argumentos con comas:

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar ejemplos de la sintaxis del filtro anterior. Si usted se olvida de alguno, debería ver <strong>errores de consola</strong>.</p>
</div>
{% endraw %}

### Filtros de texto incorporados <sup>removido</sup>

Aunque los filtros dentro de las interpolaciones de texto todavía están permitidos, todos los filtros se han eliminado. En cambio, se recomienda usar librerías más especializadas para resolver problemas en cada dominio (por ejemplo, [`date-fns`](https://date-fns.org/) para formatear fechas y [`accounting`](http://openexchangerates.github.io/accounting.js/) para monedas).

Para cada uno de los filtros de texto integrados de Vue, vamos a ver cómo puede reemplazarlos a continuación. El código de ejemplo podría existir en funciones auxiliares personalizadas, métodos o propiedades computadas.

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

### Filtros bidireccionales <sup>reemplazado</sup>

Algunos usuarios han disfrutado el uso de filtros bidireccionales con `v-model` para crear entradas o _inputs_ interesantes con muy poco código. Sin embargo, aunque _aparentemente_ son simples, los filtros bidireccionales también pueden ocultar una gran complejidad e incluso fomentar una mala experiencia de usuario al retrasar las actualizaciones de estado. En cambio, los componentes que envuelven una entrada se recomiendan como una forma más explícita y rica en características de crear entradas personalizadas.

Como ejemplo, ahora veremos la migración de un filtro bidireccional de moneda:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

En su mayoría funciona bien, pero las actualizaciones de estado demoradas pueden causar un comportamiento extraño. Por ejemplo, haga clic en la pestaña `Result` e intente ingresar `9.999` en una de esas entradas. Cuando la entrada pierde el foco, su valor se actualizará a `$10.00`. Sin embargo, al observar el total calculado, verá que '9.999' es lo que se almacena en nuestros datos. ¡La versión de la realidad que ve el usuario no está sincronizada!

Para comenzar la transición hacia una solución más robusta usando Vue 2.0, primero envolvamos este filtro en un nuevo componente `<currency-input>`:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Esto nos permite agregar comportamiento que un filtro por sí solo no podría encapsular, como seleccionar el contenido de una entrada en foco. Ahora el siguiente paso será extraer la lógica de negocios del filtro. A continuación, sacamos todo a un [objeto `currencyValidator`](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e) externo:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Esta mayor modularidad no solo facilita la migración a Vue 2, sino que también permite que el análisis y el formato de moneda sean:

- probado como unidad aislada de su código Vue
- utilizado por otras partes de su aplicación, como para validar el _payload_ de un _endpoint_ de API

Una vez extraído este validador, también lo hemos convertido más cómodamente en una solución más robusta. Se han eliminado las peculiaridades del estado y en realidad es imposible que los usuarios ingresen algo incorrecto, similar a lo que intenta hacer la entrada _number_ nativa del navegador.

Sin embargo, todavía estamos limitados por los filtros y por Vue 1.0 en general, así que completemos la actualización a Vue 2.0:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Puede notar que:

- Cada aspecto de nuestra entrada es más explícito, utilizando _hooks_ de ciclo de vida y eventos DOM en lugar del comportamiento oculto de los filtros bidireccionales.
- Ahora podemos usar `v-model` directamente en nuestras entradas personalizadas, lo que no solo es más consistente con las entradas normales, sino que también significa que nuestro componente es compatible con Vuex.
- Dado que ya no usamos opciones de filtro que requieren que se devuelva un valor, nuestro trabajo de monedas podría hacerse asincrónicamente. Eso significa que si tuviéramos muchas aplicaciones que tuvieran que funcionar con monedas, podríamos refactorizar fácilmente esta lógica en un microservicio compartido.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar ejemplos de filtros usados en directivas como <code>v-model</code>. Si usted se olvida de alguno, debería ver <strong>errores de consola</strong>.</p>
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

## Reactividad

### `vm.$watch` <sup>cambiado</sup>

Los _watchers_ creados a través de `vm.$watch` ahora se disparan antes de que el componente asociado se vuelva a renderizar. Esto le brinda la oportunidad de actualizar el estado antes de que el componente vuelva a renderizarse, evitando así actualizaciones innecesarias. Por ejemplo, puede observar una propiedad y actualizar sus propios datos cuando la propiedad cambia.

Si anteriormente usted dependía de `vm.$watch` para hacer algo con el DOM después de las actualizaciones de un componente, usted puede hacerlo en el _hook_ de ciclo de vida `updated`.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute su conjunto de pruebas de extremo a extremo, si tiene uno. Las <strong>pruebas que fallen</strong> les deberían de alertar sobre el hecho que un <i>watcher</i> dependía de un comportamiento anterior.
  </p>
</div>
{% endraw %}

### `vm.$set` <sup>cambiado</sup>

`vm.$set` ahora es un alias de [`Vue.set`](../api/#Vue-set).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de uso obsoleto.
  </p>
</div>
{% endraw %}

### `vm.$delete` <sup>cambiado</sup>

`vm.$delete` ahora es un alias de [`Vue.delete`](../api/#Vue-delete).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de uso obsoleto.
  </p>
</div>
{% endraw %}

### `Array.prototype.$set` <sup>removido</sup>

Use `Vue.set` en su lugar.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>.$set</code> en un arreglo. Si usted se olvida de alguno, debería ver <strong>errores de consola</strong> en el método que falta.
  </p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>removido</sup>

Use `Array.prototype.splice` en su lugar. Por ejemplo:

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

O mejor aún, pase los métodos de eliminación a un índice:

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>.$remove</code> en un arreglo. Si usted se olvida de alguno, debería ver <strong>errores de consola</strong> en el método que falta.
  </p>
</div>
{% endraw %}

### `Vue.set` y `Vue.delete` en las instancias de Vue <sup>removido</sup>

`Vue.set` y `Vue.delete` ya no se pueden utilizar en instancias de Vue. Ahora es obligatorio declarar correctamente todas las propiedades reactivas de nivel superior en la opción de datos. Si desea eliminar propiedades en una instancia de Vue o su `$data`, configúrelo como nulo (_null_).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de <code>Vue.set</code> o <code>Vue.delete</code> en su instancia de Vue. Si usted se olvida de alguno, ellos dispararán <strong>advertencias en la consola</strong>.
  </p>
</div>
{% endraw %}

### Reemplazando `vm.$data` <sup>removido</sup>

Ahora está prohibido reemplazar los datos (_$data_) raíz de una instancia de componente. Esto evita algunos casos borde en el sistema de reactividad y hace que el estado del componente sea más predecible (especialmente con los sistemas de verificación de tipo).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> en su código para encontrar ejemplos de reemplazo de <code>vm.$data</code>.Si usted se olvida de alguno, ellos dispararán <strong>advertencias en la consola</strong>.
  </p>
</div>
{% endraw %}

### `vm.$get` <sup>removido</sup>

En cambio, recupere datos reactivos directamente.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>
    Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a>  en su código para encontrar ejemplos de reemplazo de <code>vm.$data</code>.Si usted se olvida de alguno, ellos dispararán <strong>advertencias en la consola</strong>.
  </p>
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

### `Vue.config.debug` <sup>removido</sup>

Ya no es necesario, ya que ahora las advertencias vienen con seguimiento de pila por defecto.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar ejemplos de <code>Vue.config.debug</code>.</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>removido</sup>

Ahora async es requerido para el rendimiento de la renderización.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar ejemplos de <code>Vue.config.async</code>.</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>reemplazado</sup>

Esto se ha modificado como una [opción a nivel de componente](../api/#delimiters). Esto le permite usar delimitadores alternativos dentro de su aplicación sin romper componentes de terceros.

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar ejemplos de <code>Vue.config.delimiters</code>.</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>removido</sup>

La interpolación HTML ha sido [removida en favor de `v-html`](#HTML-Interpolation-removed).

{% raw %}
<div class="upgrade-path">
  <h4>Ruta de actualización</h4>
  <p>Ejecute el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar ejemplos de  <code>Vue.config.unsafeDelimiters</code>. Después de esto, el asistente encontrará también instancias de interpolación HTML para que pueda reemplazarlas con `v-html`.</p>
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
