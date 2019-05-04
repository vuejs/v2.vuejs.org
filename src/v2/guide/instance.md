---
title: La instancia Vue
type: guide
order: 3
---

## Creando una instancia de Vue

Cada aplicación de Vue se comienza creando una nueva **Instancia de Vue** con la función `Vue`:

```js
var vm = new Vue({
  // options
})
```

Aunque no extrictamente asociado con el [patrón MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), el diseño de Vue fue en parte inspirado por él.
Como una convención, solemos usar la variable `vm` (abreviación de ViewModel) para hacer referencia a nuestra instancia de Vue.

Cuando usted crea una instancia de Vue, lo pasa en un **objeto options**. La mayor parte de esta guía describe cómo usted puede usar estas opciones para crear el comportamiento deseado.
Como referencia, usted puede visitar también la lista completa de opciones en la [documentación de la API](../api/#Options-Data).

Una aplicación Vue está conformada por una **instancia Vue raíz** creada con `new Vue`, opcionalmente organizada dentro de un árbol de componentes reusables anidados. Por ejemplo, el árbol de una aplicación TO-DO podría verse así:

```
Root Instance
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

Hablaremos sobre [el sistema de componentes](components.html) en detalle después. Por ahora, solo es necesario saber que todos los componentes de Vue son también instancias de Vue, por lo tanto aceptan el mismo objeto options (excepto para unas pocas específicas opciones de raíz).

## Datos y Métodos

Cuando una instancia Vue es creada, agrega todas las propiedades encontradas en su objeto `data` al **sistema de reactividad** de Vue. Cuando los valores de estas propiedades cambian, la vista "reaccionará", actualizándose para coincidir con los nuevos valores.

```js
// Our data object
var data = { a: 1 }

// The object is added to a Vue instance
var vm = new Vue({
  data: data
})

// Getting the property on the instance
// returns the one from the original data
vm.a == data.a // => true

// Setting the property on the instance
// also affects the original data
vm.a = 2
data.a // => 2

// ... and vice-versa
data.a = 3
vm.a // => 3
```

Cuando estos datos cambian, la vista volverá a renderizarse. Es preciso señalar que las propiedades en `data` solo son **reactivas** si ya existían cuando se creó la instancia. Eso significa que si usted agrega una nueva propiedad, como:

```js
vm.b = 'hola'
```

Entonces los cambios de `b` no producirán ninguna actualización en la vista. Si sabe que necesitará una propiedad más adelante, pero comienza vacía o inexistente, necesitará setear un valor inicial. Por ejemplo:

```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

La unica excepción a esto es el uso de `Object.freeze()`, lo que evita que se modifiquen las propiedades existentes, lo que también significa que el sistema de reactividad no puede rastrear cambios.

```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- this will no longer update `foo`! -->
  <button v-on:click="foo = 'baz'">Cámbialo</button>
</div>
```

Además de las propiedades de datos, las instancias de Vue exponen una serie de métodos y propiedades de instancia útiles. Estos tienen el prefijo `$` para diferenciarlos de las propiedades definidas por el usuario. Por ejemplo:

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch is an instance method
vm.$watch('a', function (newValue, oldValue) {
  // This callback will be called when `vm.a` changes
})
```

En el futuro, puede consultar la [documentación de la API](../api/#Instance-Properties) para una lista completa de propiedades y métodos de instancia.

## Hooks del Ciclo de vida de la Instancia

Cada instancia de Vue pasa a través de una serie de pasos de inicialización cuando es creada - por ejemplo, se necesita configurar la observación de datos, compilar la plantilla, montar la instancia en el DOM y actualizar el DOM cuando cambian los datos. A lo largo del camino, también se ejecutan funciones llamadas **hooks del ciclo de vida**, lo que brinda a los usuarios la oportunidad de agregar su propio código en etapas específicas.

Por ejemplo, el hook [`created`](../api/#created) puede ser utilizado para ejecutar código después que una instancia es creada:

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` points to the vm instance
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

También hay otros hooks que se llamarán en diferentes etapas del ciclo de vida de la instancia, como [`mounted`](../api/#mounted), [`updated`](../api/#updated), y [`destroyed`](../api/#destroyed). Todos los hooks del ciclo de vida se llaman en el contexto `this` apuntando a la instancia de Vue que lo invoca.

<p class="tip">No usar [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) en una propiedad de opciones o respuesta, como `created: () => console.log(this.a)` or `vm.$watch('a', newValue => this.myMethod())`. Dado que las arrow functions están vinculadas al contexto padre, `this` no será la instancia de Vue como lo esperaría, lo que suele producir errores, como 'Uncaught TypeError: Cannot read property of undefined` o `Uncaught TypeError: this.myMethod is not a function`.</p>

## Diagrama del Ciclo de vida

La imagen de abajo es un diagrama para el ciclo de vida de una instancia. No es necesario que entienda como funciona todo en este momento, pero a medida que aprenda y construya más, será una referencia útil.

![Ciclo de vida de una Instancia de Vue](/images/lifecycle.png)
