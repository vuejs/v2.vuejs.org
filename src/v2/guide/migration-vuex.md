---
title: Migración de Vuex 0.6.x a 1.0
type: guide
order: 703
---

> Se liberó Vuex 2.0, pero esta guía solo cubre la migración a 1.0? ¿Es eso un error tipográfico? Además, parece que Vuex 1.0 y 2.0 se lanzaron simultáneamente. ¿Que está pasando? ¿Cuál debo usar y cuál es compatible con Vue 2.0?

Tanto Vuex 1.0 y 2.0:

- Son totalmente compatibles con Vue 1.0 y 2.0
- Serán mantenidos en el futuro previsible

Sin embargo, tienen un objetivo de usuarios ligeramente diferentes.

__Vuex 2.0__ es un rediseño y simplificación radical de la API para aquellos que están comenzando nuevos proyectos o desean estar a la vanguardia en el manejo de estado _client-side_. __No está cubierto por esta guía de migración.__, por lo que debe revisar [la documentación de Vuex 2.0](https://vuex.vuejs.org/en/index.html) si quiere aprender más sobre esto.

__Vuex 1.0__ En su mayoría es compatible con versiones anteriores, por lo que requiere muy pocos cambios para migrar. Se recomienda para aquellos con grandes cantidades de códigoo que desean una migración suave en pequeños pasos antes de Vue 2.0. Esta guía está dedicada a facilitar ese proceso, pero solo incluye notas de migración. Para la guía de uso completa, vea [la documentación de Vuex 1.0](https://github.com/vuejs/vuex/tree/1.0/docs/en).

## `store.watch` con Propiedad String <sup>sustituido</sup>

`store.watch` Ahora solo acepta funciones. Entonces, por ejemplo, tendrías que sustituir:

``` js
store.watch('user.notifications', callback)
```

por:

``` js
store.watch(
  // Cuando el resultado devuelto cambia...
  function (state) {
    return state.user.notifications
  },
  // Ejecutar este callback
  callback
)
```

Esto le da un control más completo sobre las propiedades reactivas que le gustaría observar.

{% raw %}
<div class="upgrade-path">
  <h4>Cómo proceder?</h4>
  <p>Ejecutar el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar casos de<code>store.watch</code> con un string como primer argumento.</p>
</div>
{% endraw %}

## Emisor de Eventos del Store <sup>removido</sup>

La instancia del _store_ ya no expone la interfaz del emisor de eventos (`on`, `off`, `emit`). Si anteriormente estaba usando la tienda como un bus de eventos global, [vea esta sección](migration.html#dispatch-and-broadcast-removed) para instrucciones de migración.

En lugar de utilizar esta interfaz para observar los eventos emitidos por el propio _store_ (ej: `store.on('mutation', callback)`), un nuevo método `store.subscribe` es presentado. El uso típico dentro de un plugin sería:

``` js
var myPlugin = store => {
  store.subscribe(function (mutation, state) {
    // Hacer algo...
  })
}

```

Ver ejemplo [the plugins docs](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md) para más información.

{% raw %}
<div class="upgrade-path">
  <h4>Cómo proceder?</h4>
  <p>Ejecutar el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar casos de<code>store.on</code>, <code>store.off</code>, y <code>store.emit</code>.</p>
</div>
{% endraw %}

## Middlewares <sup>sustituidos</sup>

Los _middlewares_ fueron sustituidos por _plugins_. Un _plugin_ es una función que recibe el _store_ como único argumento y puede suscribirse al evento de mutación en el _store_:

``` js
const myPlugins = store => {
  store.subscribe('mutation', (mutation, state) => {
    // Hacer algo...
  })
}
```

Para más detalles, ver [la documentación de plugins](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md).

{% raw %}
<div class="upgrade-path">
  <h4>Cómo proceder?</h4>
  <p>Ejecutar el <a href="https://github.com/vuejs/vue-migration-helper">asistente de migración</a> sobre su código para encontrar casos donde se utilizó <code>middlewares</code> en un store.</p>
</div>
{% endraw %}
