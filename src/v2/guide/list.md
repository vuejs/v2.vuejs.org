---
title: Renderização de Listas
type: guide
order: 8
---

## `v-for`

Podemos utilizar a diretiva `v-for` para renderizar uma lista de itens baseada em um Array. A diretiva `v-for` requer uma sintaxe especial na forma `item in items`, onde `items` é uma fonte de dados vetorial e `item` é um **apelido** para o elemento do Array sendo iterado:

### Utilização Básica

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

Resultado:

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
      smoothScroll.animateScroll(document.querySelector('#example-1'))
    }
  }
})
</script>
{% endraw %}

Dentro de blocos `v-for`, temos acesso completo a propriedades do escopo pai. A diretiva também suporte um segundo argumento opcional para o índice do item corrente.

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

Resultado:

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
      smoothScroll.animateScroll(document.querySelector('#example-2'))
    }
  }
})
</script>
{% endraw %}

Também é possível utilizar `of` como delimitador ao invés de `in`, de forma que fique mais próximo da sintaxe de *iterators* do JavaScript:

``` html
<div v-for="item of items"></div>
```

<<<<<<< HEAD:src/guide/list.md
### Template com v-for
=======
### Template `v-for`
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/list.md

Similar ao template `v-if`, você também pode utilizar a tag `<template>` com a diretiva `v-for` para renderizar um bloco de múltiplos elementos sem a necessidade de repetição de um *container*. Por exemplo:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

<<<<<<< HEAD:src/guide/list.md
### Objetos no v-for
=======
### Object `v-for`
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/list.md

É possível utilizar `v-for` para iterar através dos valores das propriedades de um objeto.

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
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
```

Resultado:

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
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

Também é possível utilizar um segundo argumento para a chave da propriedade:

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

E ainda outro para o índice da iteração:

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">Ao iterar por um objeto, a ordenação padrão é baseada na ordem da enumeração das chaves oferecida por `Object.keys()`, a qual **não** é garantidamente consistente entre implementações de motores JavaScript distintos.</p>

<<<<<<< HEAD:src/guide/list.md
### Intervalo de Números
=======
### Range `v-for`
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/list.md

A diretiva `v-for` também pode ser um número inteiro. Neste caso, a repetição ocorrerá de acordo com este número de vezes definido.

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

<<<<<<< HEAD:src/guide/list.md
### Componentes e v-for

> Esta seção assume conhecimento sobre [Componentes](/guide/components.html). Sinta-se livre para pulá-la agora e voltar depois.
=======
### Components and `v-for`

> This section assumes knowledge of [Components](components.html). Feel free to skip it and come back later.
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/list.md

É possível usar `v-for` diretamente em componentes personalizados, assim como ocorre com elementos comuns:

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

<<<<<<< HEAD:src/guide/list.md
Entretanto, isto não passa automaticamente qualquer dado ao componente, uma vez que componentes possuem escopos isolados independentes. Para passar dados iterados ao componente, precisamos utilizar a sintaxe de props:
=======
> In 2.2.0+, when using `v-for` with a component, a [`key`](list.html#key) is now required.

However, this won't automatically pass any data to the component, because components have isolated scopes of their own. In order to pass the iterated data into the component, we should also use props:
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/list.md

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id">
</my-component>
```

A razão pela qual `item` não é injetado automaticamente no componente se deve ao fato de que isto faria o componente se tornar fortemente acoplado a como o `v-for` funciona. Sendo explícito sobre de onde os dados vêm, garante-se que o componente seja reutilizável em outras situações.

Aqui está um exemplo completo com uma lista de tarefas simples:

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="O que precisa ser feito?"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```
``` js
Vue.component('todo-item', {
  template: `
    <li>
      {{ title }}
      <button v-on:click="$emit('remove')">X</button>
    </li>
  `,
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Lavar os pratos',
      'Tirar o lixo',
      'Cortar a grama'
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
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="O que precisa ser feito?"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: `
    <li>
      {{ title }}
      <button v-on:click="$emit('remove')">X</button>
    </li>
  `,
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Lavar os pratos',
      'Tirar o lixo',
      'Cortar a grama'
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

### `v-for` with `v-if`

When they exist on the same node, `v-for` has a higher priority than `v-if`. That means the `v-if` will be run on each iteration of the loop separately. This is very useful when you want to render nodes for only _some_ items, like below:

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

The above only renders the todos that are not complete.

If instead, your intent is to conditionally skip execution of the loop, you can place the `v-if` on a wrapper element (or [`<template>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt)). For example:

``` html
<ul v-if="shouldRenderTodos">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
```

## `key`

<<<<<<< HEAD:src/guide/list.md
Quando o Vue está atualizando uma lista de elementos renderizada com `v-for`, ele usa por padrão uma estratégia de "remendo no local". Se a ordem dos itens nos dados mudar, ao invés de mover os elementos DOM para corresponder com a ordem dos dados, Vue simplesmente atualiza cada elemento no local garante que isso reflita o que deveria ser renderizado naquele índice em particular. Isto é similar ao comportamento de `track-by="$index"` no Vue 1.x.
=======
When Vue is updating a list of elements rendered with `v-for`, it by default uses an "in-place patch" strategy. If the order of the data items has changed, instead of moving the DOM elements to match the order of the items, Vue will simply patch each element in-place and make sure it reflects what should be rendered at that particular index. This is similar to the behavior of `track-by="$index"` in Vue 1.x.
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/list.md

Este padrão é eficiente, mas adequado somente **quando a renderização da lista não depende de estado de componentes filhos ou estado temporário do DOM (como valores de inputs)**.

Para dar ao Vue uma dica de que ele pode acompanhar a identidade de cada nó, e portanto reusar e reordenar elementos existentes, você deve prover uma chave para cada item através do atributo `key`. Um valor ideal para `key` poderia ser o id único de cada item. Este atributo especial é um equivalente aproximado do `track-by` do Vue 1.x, mas funciona como outros atributo, ou seja, necessita de `v-bind` para interligar com valores dinâmicos (usando a sintaxe abreviada aqui):

``` html
<div v-for="item in items" :key="item.id">
  <!-- Conteúdo -->
</div>
```

É recomendado prover `key` no `v-for` sempre que possível, a menos que o conteúdo DOM iterado seja simples, ou se você estiver intencionalmente aproveitando o comportamento padrão para ganhar desempenho.

Por ser um mecanismo genérico do Vue para identificar nós, o atributo `key` também possui outros usos não necessariamente ligados ao `v-for`, como veremos futuramente no guia.

## Detectando Mudanças em Arrays

### Métodos de Mutação

Vue envolve métodos de mutação nos Arrays observados de forma que estes também acionem mudanças na *view*. Os métodos afetados são:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Você pode abrir o console e brincar com o vetor `items` dos exemplos anteriores chamando seus métodos de mutação. Por exemplo: `example1.items.push({ message: 'Baz' })`.

### Substituindo um Array

<<<<<<< HEAD
Métodos de mutação, como o nome sugere, modificam o Array original que os chamou. Em comparação, há também métodos que não causam mutação, como `filter()`, `concat()` e `slice()`, os quais não modificam o Array original, **sempre retornam um novo Array**. Ao trabalhar com estes métodos, você pode simplesmente substituir o Array antigo pelo novo:
=======
Mutation methods, as the name suggests, mutate the original array they are called on. In comparison, there are also non-mutating methods, e.g. `filter()`, `concat()` and `slice()`, which do not mutate the original array but **always return a new array**. When working with non-mutating methods, you can just replace the old array with the new one:
>>>>>>> refs/remotes/vuejs/master

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Você pode pensar que isso faria o Vue jogar fora todo o DOM existente e voltar a renderizar toda a lista - felizmente, que não é o caso. Vue implementa algumas heurísticas inteligentes para maximizar o reuso de elementos DOM. Deste modo, substituir um Array por outro contendo objetos sobrepostos é uma operação muito eficiente.

### Limitações

Devido a limitações no JavaScript, Vue **não pode** detectar as seguintes modificações em um Array:

1. Quando modifica-se um item através do índice: `vm.items[indexOfItem] = newValue`
2. Quando modifica-se diretamente o tamanho do Array: `vm.items.length = newLength`

Para contornar a limitação 1, o mesmo que `vm.items[indexOfItem] = newValue` pode ser obtido nas duas opções abaixo, mas ambas desencadearão corretamente as atualizações de estado no sistema de reatividade:

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
example1.items.splice(indexOfItem, 1, newValue)
```

Para contornar a limitação 2, também é possível utilizar `splice`:

``` js
example1.items.splice(newLength)
```

## Exibindo Dados Filtrados/Ordenados

Às vezes desejamos exibir uma versão filtrada ou ordenada de um Array sem realmente o modificar e perder seus dados originais. Neste caso, é possível criar uma propriedade computada que retorna uma versão filtrada ou ordenada do Array.

Por exemplo:

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

<<<<<<< HEAD
Alternativamente, também é possível simplesmente utilizar um método em casos onde propriedades computadas não são viáveis (por exemplo, dentro de um laços `v-for`):
=======
In situations where computed properties are not feasible (e.g. inside nested `v-for` loops), you can just use a method:
>>>>>>> refs/remotes/vuejs/master

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
