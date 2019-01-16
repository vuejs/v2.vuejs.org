---
title: Reactividad en profundidad
type: guide
order: 601
---

¡Ha llegado la hora de profundizar en el asunto! Una de las características que diferencian a Vue es su discreto sistema de reactividad. Los modelos simplemente son objetos de JavaScript. Cuando los modifique, se actualizará la vista. Esto hace que el gestor de estados sea simple e intuitivo, pero también es importante entender como funciona para prevenir algunos errores comunes. En esta sección, vamos a indagar en algunos detalles de bajo nivel del sistema de reactividad de Vue.

## Como se siguen los cambios

Cuando se le pasa un objeto de JavaScript a una instancia de Vue como su opción `data`, Vue irá a través de todas sus propiedades y las convertirá a un getter/setter usango [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Esto solo funciona es versiones de ES5 en adelante y es una característica un-shimable, que es por lo que Vue no soporta IE8 ni inferior.

Los getter/setter son invisibles para el usuario, pero por debajo permite a Vue realizar el seguimiento de dependencias y notificar los cambios cuando se accede a las propiedades o son modificadas. Una advertencia es que la consola de los navegadores da diferente formato a los getter/setters cuando los objetos manipulados son registrados, por lo que quizás quiera instalar [vue-devtools](https://github.com/vuejs/vue-devtools) para un resultado más amigable.

Cada instancia de componente tiene su correspondiente instancia de **watcher**, el cual graba cada propiedad "touched" durante el renderizado del componente como dependencias. Más tarde, cuando el `setter` de una dependencia es ejecutado, lo notifica al watcher, lo que provoca que el componente se vuelva a renderizar.

![Ciclo de la reactividad](/images/data.png)

## Precauciones detectando cambios

Debido a las limitaciones del JavaScript moderno (y la deprecación de `Object.observe`), Vue **no puede detectar los añadidos o eliminaciones de propiedades**. Ya que Vue ejecuta la transformación de `getters/setters` durante la inicialización de la instancia, una propiedad tiene que estar presente en el objeto `data` para que Vue pueda convertirla y hacerla reactiva. Por ejemplo:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` es ahora reactivo

vm.b = 2
// `vm.b` NO es reactivo
```

Vue no permite añadir dinámicamente en el nivel raiz nuevas propiedades reactivas a una instancia ya creada. Sim embargo, se pueden añadir propiedades reactivas a un objeto anidado usando el método `Vue.set(object, key, value)`:

``` js
Vue.set(vm.someObject, 'b', 2)
```

También puede usar el método de instancia `vm.$set`, el cual es un alias del método global `Vue.set`:

``` js
this.$set(this.someObject, 'b', 2)
```

Algunas veces quizás quiera asignar varias propiedades a un objeto existente, por ejemplo usando `object.assign()` o `_.extend()`. Sin embargo, las nuevas propiedades añadidas al objeto no ejecutarán los cambios. En esos casos, cree un nuevo objeto con las propiedades de ambos, del objeto original y el que quiera añadir:

``` js
// en vez de `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

También hay limitaciones relacionadas con los arrays, sobre los que se ha hablado antes en la [sección de renderizado de listas](list.html#Caveats).

## Declarando propiedades reactivas

Ya que Vue no permite añadir dinámicamente propiedades reactivas a la raiz, tiene que inicializar instancias de Vue declarando todas las propiedades reactivas de nivel raiz desde el principio, incluso con un valor vacío:

``` js
var vm = new Vue({
  data: {
    // declare message con un valor vacío
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// cambie `message` luego
vm.message = 'Hello!'
```

Si no declara `message` en la opción `data`, Vue le advertirá de que la función de renderizado está intentando acceder a una propiedad que no existe.

Hay razones técnicas detrás de esta restricción - esto elimina una clase de casos aislados en el sistema de seguimiento de dependencias, y también hace que las instancias de Vue tengan una mejor relación con los sistemas de comparacion de tipos. Pero también hay una consideración importante en términos de mantenimiento de código: el objeto `data` es como el esquema del estado de tu componente. Declarando todas las propiedades reactivas desde el principio hace que el código del componente sea más fácil de entender cuando sea revisado más tarde o leído por otro desarrollador.

## Cola de actualización asíncrona

En caso de que todavía no se haya dado cuenta, Vue realiza actualizaciones del DOM **asíncronamente**. Cada vez que un cambio en los datos es observado, abrirá una cola y almacenará en un buffer todos los cambios en los datos que ocurran en la misma vuelta del bucle. Si el mismo `watcher` es lanzado varias veces, será introducido en la cola solamente una vez. Este mecanismo que evita la duplicación es importante para evitar cálculos y manipulaciones del DOM innecesarias. Entonces, en la siguiente vuelta del bucle de eventos, Vue limpia la cola y ejecuta el (no repetido) trabajo actual. Internamente Vue intenta usar `Promise.then` y `MutationObserver` nativos para el encolamiento asíncrono con respaldo de `setTimeout(fn, 0)`.

Por ejemplo, cuando asigne `vm.someData = 'new value'`, el componente no se volverá a renderizar inmediatamente. Se actualizará en la siguiente vuelta, cuando la cola es limpiada. La mayoría de las veces no necesitamos preocuparnos de esto, pero puede ser difícil cuando quieras hacer algo que dependa del estado del DOM posterior a la actualización. Aunque en general Vue.js anima a los desarrolladores a pensar en modo "data-driven" y evitar tocar el DOM directamente, a veces puede ser necesario mancharse las manos. Para esperar hasta que Vue.js haya finalizado la actualización del DOM después de un cambio en los datos, puede usar `Vue.nextTick(callback)` justo después de los cambios en los datos. El _callback_ será llamado después de que el DOM haya sido actualizado. Por ejemplo:

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // cambio en el data
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

También está el método de instancia `vm.$nextTick()`, el cual es especialmente útil dentro de los componentes, porque no necesita `Vue` global y el contexto `this` del _callback_ será automáticamente ligado a la instancia Vue actual:

``` js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: 'not updated'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'updated'
      })
    }
  }
})
```
