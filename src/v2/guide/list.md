---
title: Renderizado de lista
type: guide
order: 8
---

## Mapeando una matriz a elementos con `v-for`

Podemos usar la directiva `v-for` para representar una lista de elementos basada en una matriz. La directiva `v-for` requiere una sintaxis especial en forma de `item in items`, donde los `items` son la matriz de datos de origen y el `item` es un **alias** para el elemento de matriz que se está iterando en:

``` html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.mensaje }}
  </li>
</ul>
```

``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { mensaje: 'Foo' },
      { mensaje: 'Bar' }
    ]
  }
})
```

Resultado:

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.mensaje}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { mensaje: 'Foo' },
      { mensaje: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-1'))
    }
  }
})
</script>
{% endraw %}

Dentro de los bloques `v-for` tenemos acceso completo a las propiedades del ámbito principal. `v-for` también admite un segundo argumento opcional para el índice del elemento actual.

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    m{ MensajePadre }} - {{ index }} - {{ item.mensaje }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    mensajePadre: 'Padre',
    items: [
      { mensaje: 'Foo' },
      { mensaje: 'Bar' }
    ]
  }
})
```

Resultado:

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ mensajePadre }} - {{ index }} - {{ item.mensaje }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    mensajePadre: 'Padre',
    items: [
      { mensaje: 'Foo' },
      { mensaje: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(document.querySelector('#example-2'))
    }
  }
})
</script>
{% endraw %}

También puede usar `of` como delimitador en lugar de `in`, de modo que esté más cerca de la sintaxis de JavaScript para los iteradores:

``` html
<div v-for="item of items"></div>
```

## `v-for` con un Objecto

También puede usar `v-for` para iterar a través de las propiedades de un objeto.

``` html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      primerNombre: 'John',
      apellido: 'Doe',
      edad: 30
    }
  }
})
```

Resultado:

{% raw %}
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      primerNombre: 'John',
      apellido: 'Doe',
      edad: 30
    }
  }
})
</script>
{% endraw %}

También puede proporcionar un segundo argumento para la clave:

``` html
<div v-for="(value, key) in object">
  {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key" class="demo">
  <div v-for="(value, key) in object">
    {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key',
  data: {
    object: {
      primerNombre: 'John',
      apellido: 'Doe',
      edad: 30
    }
  }
})
</script>
{% endraw %}

Y otro para el índice:

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key-index" class="demo">
  <div v-for="(value, key, index) in object">
    {{ index }}. {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key-index',
  data: {
    object: {
      primerNombre: 'John',
      apellido: 'Doe',
      edad: 30
    }
  }
})
</script>
{% endraw %}

<p class="tip">Al iterar sobre un objeto, el orden se basa en el orden de enumeración de claves de `Object.keys()`, que no se garantiza que sea consistente en todas las implementaciones del motor de JavaScript.</p>

## `key`

Cuando Vue está actualizando una lista de elementos representados con `v-for`, por defecto utiliza una estrategia de "parche in situ". Si el orden de los elementos de datos ha cambiado, en lugar de mover los elementos DOM para que coincidan con el orden de los elementos, Vue aplicará parches a cada elemento en el lugar y se asegurará de que refleje lo que se debe representar en ese índice en particular. Esto es similar al comportamiento de `track-by="$index"` en Vue 1.x.

Este modo predeterminado es eficiente, pero solo es adecuado **cuando la salida de renderizado de su lista no se basa en el estado del componente secundario o el estado temporal de DOM (por ejemplo, valores de entrada de formulario)**.

Para proporcionar a Vue una sugerencia para que pueda rastrear la identidad de cada nodo y, por lo tanto, reutilizar y reordenar los elementos existentes, debe proporcionar un atributo `key` único para cada elemento. Un valor ideal para `key` sería el ID único de cada elemento. Este atributo especial es un equivalente aproximado a `track-by` en 1.x, pero funciona como un atributo, por lo que necesita usar `v-bind` para enlazarlo con valores dinámicos (usando el modo abreviado aquí):

``` html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

Se recomienda proporcionar una `key` con `v-for` siempre que sea posible, a menos que el contenido DOM iterado sea simple, o esté confiando intencionalmente en el comportamiento predeterminado para obtener ganancias en el rendimiento.

Como Vue es un mecanismo genérico para identificar nodos, la `key` también tiene otros usos que no están específicamente vinculados a `v-for`, como veremos más adelante en la guía.

## Deteccion del cambios en Array

### Methods de Mutacion

Vue envuelve los métodos de mutación de una matriz observada para que también activen las actualizaciones de vista. Los métodos envueltos son:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Puede abrir la consola y probar con la matriz de `items` de los ejemplos anteriores llamando a sus métodos de mutación. Por ejemplo: `example1.items.push ({mensaje: 'Baz'})`.

### Replacing an Array

Los métodos de mutación, como sugiere su nombre, mutan la matriz original a la que se llama. En comparación, también hay métodos no mutantes, p. Ej. `filter()`, `concat()` y `slice()`, que no mutan la matriz original pero **siempre devuelven una nueva matriz**. Cuando trabaje con métodos no mutantes, puede reemplazar la matriz anterior por la nueva:

``` js
example1.items = example1.items.filter(function (item) {
  return item.mensaje.match(/Foo/)
})
```

Podría pensar que esto hará que Vue elimine el DOM existente y vuelva a renderizar la lista completa; afortunadamente, ese no es el caso. Vue implementa algunas heurísticas inteligentes para maximizar la reutilización de elementos DOM, por lo tanto, reemplazar una matriz con otra matriz que contenga objetos superpuestos es una operación muy eficiente.

### Cuidados

Debido a las limitaciones en JavaScript, Vue **no puede** detectar los siguientes cambios en una matriz:

1. Cuando configura directamente un elemento con el índice, por ejemplo, `vm.items[indexOfItem] = newValue`

2. Cuando modifica la longitud de la matriz, por ejemplo, `vm.items.length = newLength`

Por ejemplo:

``` js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // NO es reactivo
vm.items.length = 2 //  NO es reactivo
```

Para superar la advertencia 1, ambos de los siguientes lograrán lo mismo que `vm.items [indexOfItem] = newValue`, pero también activarán actualizaciones de estado en el sistema de reactividad:

``` js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

También puede usar el método de instancia [`vm.$Set`](https://vuejs.org/v2/api/#vm-set), que es un alias para el `Vue.set` global:

``` js
vm.$set(vm.items, indexOfItem, newValue)
```

Para tratar con la advetencia 2, puede usar `splice`:

``` js
vm.items.splice(newLength)
```

## Cuidados con la Deteccion de Cambios en Objectos 

Una vez más, debido a las limitaciones del JavaScript moderno, **Vue no puede detectar la adición o eliminación de propiedades**. Por ejemplo:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` ahora es reactivo

vm.b = 2
// `vm.b` NO es reactivo
/
```

Vue no permite agregar dinámicamente nuevas propiedades reactivas a nivel de raíz a una instancia ya creada. Sin embargo, es posible agregar propiedades reactivas a un objeto anidado usando el método `Vue.set (objeto, clave, valor)`. Por ejemplo, dado:

``` js
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})
```

Podría agregar una nueva propiedad de `edad` al objeto de `userProfile` anidado con:
You could add a new `edad` property to the nested `userProfile` object with:

``` js
Vue.set(vm.userProfile, 'edad', 27)
```

También puede usar el método de instancia vm. `$Set`, que es un alias para el `Vue.setz global:
You can also use the `vm.$set` instance method, which is an alias for the global `Vue.set`:

``` js
vm.$set(vm.userProfile, 'edad', 27)
```

En ocasiones, es posible que desee asignar varias propiedades nuevas a un objeto existente, por ejemplo, utilizando `Object.assign()` o `_.extend()`. En tales casos, debe crear un objeto nuevo con propiedades de ambos objetos. Así que en lugar de:

``` js
Object.assign(vm.userProfile, {
  edad: 27,
  favoriteColor: 'Vue Green'
})
```
Puedria agregar nuevas propiedades reactivas con:

``` js
vm.userProfile = Object.assign({}, vm.userProfile, {
  edad: 27,
  favoriteColor: 'Vue Green'
})
```

## Mostrando Resultados Filtrados/Ordenados

A veces, queremos mostrar una versión filtrada o ordenada de una matriz sin mutar o restablecer los datos originales. En este caso, puede crear una propiedad computada que devuelva la matriz filtrada o ordenada.

Por ejemplo:

``` html
<li v-for="n in numerosImpares">{{ n }}</li>
```

``` js
data: {
  numeros: [ 1, 2, 3, 4, 5 ]
},
computed: {
  numerosImpares: function () {
    return this.numeros.filter(function (numero) {
      return numero % 2 === 0
    })
  }
}
```

En situaciones donde las propiedades computadas no son factibles (por ejemplo, dentro de los bucles `v-for` anidados), puede usar un método:

``` html
<li v-for="n in even(numeros)">{{ n }}</li>
```

``` js
data: {
  numeros: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numeros) {
    return numeros.filter(function (numero) {
      return numero % 2 === 0
    })
  }
}
```

## `v-for` con un Rango

`v-for` también puede tomar un entero. En este caso repetirá la plantilla muchas veces.

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

Resultado:

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
  new Vue({ el: '#range' })
</script>
{% endraw %}

## `v-for` en una `<template>`

De forma similar a la plantilla `v-if`, también puede usar una etiqueta `<template>` con `v-for` para renderizar un bloque de varios elementos. Por ejemplo:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` con `v-if`

Cuando existen en el mismo nodo, `v-for` tiene una prioridad más alta que `v-if`. Eso significa que el `v-if` se ejecutará en cada iteración del bucle por separado. Esto puede ser útil cuando desea representar nodos solo para _algunos_ elementos, como a continuación:

``` html
<li v-for="porhacer in todos" v-if="!porhacer.isComplete">
  {{ porhacer }}
</li>
```

Lo anterior  hace que todos los que no estén completos.

Si, por el contrario, su intención es omitir condicionalmente la ejecución del bucle, puede colocar el `v-if` en un elemento de envoltura (o [`<plantilla>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt)). Por ejemplo:

``` html
<ul v-if="todos.length">
  <li v-for="porhacer in todos">
    {{ porhacer }}
  </li>
</ul>
<p v-else>No quedan todos !</p>
```

## `v-for` con un Componente

> Esta sección asume el conocimiento de [Componentes](components.html). Siéntase libre de saltearlo y volver más tarde.

Puede usar `v-for` directamente en un componente personalizado, como cualquier elemento normal:

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> En 2.2.0+, cuando se usa `v-for` con un componente, ahora se requiere una [`key`](list.html#key).

Sin embargo, esto no pasará automáticamente ningún dato al componente, porque los componentes tienen sus propios ámbitos aislados. Para pasar los datos iterados al componente, también debemos usar props:

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

La razón para no inyectar automáticamente el `item` en el componente es porque hace que el componente esté estrechamente acoplado a cómo funciona `v-for`. Ser explícito acerca de dónde provienen sus datos hace que el componente sea reutilizable en otras situaciones.

Aquí hay un ejemplo completo de una lista de porhacer simple:

``` html
<div id="porhacer-list-example">
  <form -on:submit.prevent="addNewTodo">
    <label for="new-porhacer">Agregar a hacer</label>
    <input
      v-="newTodoText"
      id="new-porhacer"
      placeholder=E.g. Feed the cat"
    >
    <button>Agregar</button>
  </form>
  <ul>
    <li
      is="porhacer-item"
      v-for="(porhacer, index) in todos"
      v-bind:key="porhacer.id"
      v-bind:title="porhacer."
      v-on:remove="todos.splice(, 1)"
    ></li>
  </ul></div>
  ```

<p class="tip">Note el atributo `is = "porhacer-item"`. Esto es necesario en las plantillas DOM, porque solo un elemento `<li>` es válido dentro de un `<ul>`. Hace lo mismo que `<porhacer-item>`, pero funciona alrededor de un error potencial de análisis del navegador. Ver las [advertencias de análisis de plantillas DOM](components.html#Cuidados-en-Parseo-de-Plantillas-DOM) aprender más.</p>

``` js
.component('porhacer-item', {
  template: '\
    <li>\
      {{ title }}\
      <button -on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#porhacer-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Do the dishes'
      },
      {
        id: 2,
        title: 'Take out the trash'
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="porhacer-list-example" class="demo">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-porhacer">Agregar a porhacer</label>
    <input
      v-="newTodoText"
      id="new-porhacer"
      placeholder="E.g. Feed the cat"
    >
    <button>Agregar</button>
  </form>
  <ul>
    <li
      is="porhacer-item"
      v-for="(porhacer, index) in todos"
      v-bind:key="porhacer.id"
      v-bind:title="porhacer.title"
      v-on:remove="todos.splice(, 1)"
    ></li>
  </ul></div>
<script>
.component('porhacer-item', {
  template: '\
    <li>\
      {{ title }}\
      <button -on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#porhacer-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Do the dishes'
      },
      {
        id: 2,
        title: 'Take out the trash'
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}
