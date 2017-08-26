---
title: Renderizado de Listas
type: guide
order: 8
---

## `v-for`

Podemos usar la directiva `v-for` para renderizar una lista de elementos usando un array. La directiva `v-for` requiere de una sintaxis especial de la forma `item in items`, dónde `items` es el array de datos fuente, e `item` es un **alias** para el elemento del array sobre el cuál se está iterando. 

### Uso Básico

``` html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Resulta en:

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.message}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-1')
    }
  }
})
</script>
{% endraw %}

Dentro de los bloques `v-for` tenemos acceso completo a las propiedades del ámbito del padre. `v-for` también soporta un segundo argumento opcional para el índice del elemento actual.

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Resulta en:

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-2')
    }
  }
})
</script>
{% endraw %}

También puede usar `of` como el delimitador en vez de `in`, de forma que sea similar al sintaxis de JavaScript para iteradores:

``` html
<div v-for="item of items"></div>
```

### v-for en template

Similar a usar `v-if` en un `<template>`, también se puede usar la directiva `v-for` para renderizar un bloque de múltiples elementos. Por ejemplo:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

### v-for en objetos

También puede usar `v-for` para iterar sobre las propiedades de un objeto.

``` html
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
```

Resulta en:

{% raw %}
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
</script>
{% endraw %}

También puede usar un segundo parámetro para la clave:

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

Y otro para el índice

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">Cuando itere sobre un objeto, el orden es basado en el orden de enumeración de claves de `Object.keys()`, el cual **no** tiene garantía de ser consistente a través de implementaciones de JavaScript.</p>

### v-for de rango

`v-for` puede también tomar un entero. En este caso se repetirá la plantilla ésa cantidad de veces.

``` html
<div>
  <span v-for="n in 10">{{ n }}</span>
</div>
```

Resulta en:

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
new Vue({ el: '#range' })
</script>
{% endraw %}

### Componentes y v-for

> Esta sección asume conocimiento en [Componentes](components.html). Siéntase de libre de saltarla y regresar más adelante.

Puede usar directamente `v-for` en un componente a medida, como en cualquier elemento normal:

``` html
<my-component v-for="item in items"></my-component>
```

Sin embargo, esto no pasa automáticamente datos al componente, ya que los componentes tienen ámbitos aislados propios. Para poder transferir los datos iterados al componente, debemos usar los props:

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index">
</my-component>
```

La razón para no inyectar automáticamente `item` en el componente, es por que haría que el componente sea muy acoplado a cómo funciona `v-for`. Siendo explícito sobre de dónde vienen sus datos hace que el componente sea reusable en otras situaciones.

Aquí tenemos un ejemplo completo de una lista de tareas:

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <input
    v-model="newTodoText" v
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}

## key (clave)

Cuando Vue.js está actualizando una lista de elementos renderizados con `v-for`, por defecto usa una estrategia "in-place patch". Si el orden de los elementos de datos cambia, en vez de mover los elementos DOM para ajustar el orden de los elementos, Vue sencillamente arregla cada elemento en su lugar y se asegura que refleje lo que debe ser renderizado en ése índice particular. Ésto es similar al comportamiento de `track-by="$index"` en Vue 1.x.

Este modo por defecto es eficiente, pero sólo recomendable **cuando el renderizado de la lista no dependa del estado de componentes hijos o estado temporal DOM (p.e. valores de campos de formulario)**.

Para darle a Vue una indicación para que pueda rastrear la identidad de cada nodo, y así re-usar y re-ordenar elementos existentes, necesita poveer un atributo único `key` para cada elemento. Un valor ideal para `key` sería el id único de cada elemento. Este atributo especial es un equivalente similar a `track-by` de la versión 1.x, pero funciona como un atributo, de modo que necesita usar `v-bind` para asignar valores dinámicos (usando una versión corta aquí):

``` html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

Es recomendable usar `key` con `v-for` siempre que sea posible, a menos que el contenido DOM iterado sea sencillo, o intencionalmente dependa del funcionamiento por defecto para aprovechar la eficiencia.

Como es un mecanismo genérico para que Vue identifique nodos, `key` también tiene otros usos que no están específicamente amarrados a `v-for`, como veremos más adelante en la guía.

## Detección de cambio de array

### Métodos de mutación

Vue envuelve los métodos de mutación de un array observado, de modo que dispare actualizaciones de vista. Los métodos de envoltura son:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Puede abrir la consola y jugar con los arrays `items` de los ejemplos anteriores llamando sus métodos de mutación. Por ejemplo: `example1.items.push({ message: 'Baz' })`.

### Reemplazando un Array

Los métodos de mutación, como su nombre lo sugiere, mutan el array original del cuál han sido llamados. En comparación, también hay métodos no-mutadores, p.e. `filter()`, `concat()` y `slice()`, los cuales no cambian el array original pero **siempre retornan un nuevo array**. Cuando trabaje con métodos no mutadores, simplemente puede reemplazar el array viejo con el nuevo:

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Puede estar inclinado a pensar que esto causará que Vue deseche el DOM existente y re-renderice la lista completa - por suerte, ese no es el caso. Vue implementa heurística inteligente para maximizar el re-uso de elementos DOM, de modo que reemplazar un array con otro que contenga algunos elementos en común es una operación muy eficiente.

### Problemas

Debido a las limitaciones en JavaScript, Vue **no puede** detectar los siguientes cambios en un array:

1. Cuando directamente se cambia un elemento con el índice, p.e. `vm.items[indexOfItem] = newValue`
2. Cuando se modifica el tamaño del array, p.e. `vm.items.length = newLength`

Para solventar el problema 1, los siguientes arreglos pueden lograr lo mismo que `vm.items[indexOfItem] = newValue`, pero a su vez activan actualizaciones de estado en el sistema reactivo:

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice`
example1.items.splice(indexOfItem, 1, newValue)
```

Para circunvenir el problema 2, puede usar `splice`:

``` js
example1.items.splice(newLength)
```

## Mostrando Resultados Filtrados/Ordenados

A veces queremos mostrar una versión filtrada u ordenada de un array sin mutarlo o cambiando los datos originales. En este caso, podemos crear una propiedad calculada que retorne el array filtrado u ordenado.

Por ejemplo:

``` html
<li v-for="n in evenNumbers">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

Alternativamente, puede sencillamente usar un método si las propiedades calculadas no son la mejor opción (p.e. anidadadas en ciclos `v-for`):

``` html
<li v-for="n in even(numbers)">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```
