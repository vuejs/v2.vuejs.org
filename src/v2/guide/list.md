---
title: Renderização de Listas
type: guide
order: 8
---

## Array em Elementos com `v-for`

Podemos utilizar a diretiva `v-for` para renderizar uma lista de elementos com base nos dados de um Array. A diretiva requer uma sintaxe especial na forma de `item in items`, onde `items` é a fonte de dados e `item` é um **apelido** para o elemento que estiver sendo iterado:

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
      { message: 'Algo' },
      { message: 'Outro' }
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
      { message: 'Algo' },
      { message: 'Outro' }
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

Dentro de blocos `v-for` temos acesso completo às propriedades do escopo pai. Também há suporte a um segundo argumento opcional para o índice do item atual.

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
    parentMessage: 'Pai',
    items: [
      { message: 'Algo' },
      { message: 'Outro' }
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
    parentMessage: 'Pai',
    items: [
      { message: 'Algo' },
      { message: 'Outro' }
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

Também é possível utilizar `of` como delimitador, ao invés de `in`, de forma que fique mais próximo da sintaxe de iteradores do JavaScript:

``` html
<div v-for="item of items"></div>
```

## Objetos em `v-for`

Você pode utilizar `v-for` para iterar através das propriedades de um objeto.

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
      firstName: 'Zé',
      lastName: 'Ninguém',
      age: 30
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
      firstName: 'Zé',
      lastName: 'Ninguém',
      age: 30
    }
  }
})
</script>
{% endraw %}

Você também pode oferecer um segundo argumento para a chave:

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
      firstName: 'Zé',
      lastName: 'Ninguém',
      age: 30
    }
  }
})
</script>
{% endraw %}

E ainda um terceiro para o índice:

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
      firstName: 'Zé',
      lastName: 'Ninguém',
      age: 30
    }
  }
})
</script>
{% endraw %}

<p class="tip">Quando estiver iterando sobre um objeto, a ordem das chaves é baseada na enumeração oferecida por `Object.keys()`, a qual **não** é garantidamente consistente entre implementações distintas de motores JavaScript.</p>

## `key`

Quando Vue está atualizando uma lista de elementos renderizados com `v-for`, por padrão se utiliza de uma estratégia de "remendo local". Se a ordem dos itens de dados tiver mudado, ao invés de mover os elementos DOM para combinar com a nova ordem, Vue remendará o conteúdo de cada elemento em seu local atual, garantindo que o resultado reflita o que precisa ser renderizado em cada índice em particular. Isto é similar ao comportamento oferecido por `track-by="$index"` no Vue 1.x.

Este modo padrão é eficiente, mas adequado apenas **quando seu resultado de renderização não se apoiar em estado de componentes filhos ou estado de DOM temporário (como valores de campos de formulário)**.

Vue precisa de uma dica para que possa rastrear a identidade de cada nó e assim reutilizar e reordenar elementos existentes. Para tanto, defina um atributo `key` único para cada item. Um valor ideal para `key` poderia ser um _id_ exclusivo de cada item. Ele é um equivalente a grosso modo do `track-by` do 1.x, mas funciona como atributo, portanto deve-se utilizar `v-bind` para vinculá-lo a valores dinâmicos (neste exemplo, usando a sintaxe abreviada):

``` html
<div v-for="item in items" :key="item.id">
  <!-- conteúdo -->
</div>
```

De fato, é recomendado oferecer um `key` para `v-for` sempre que possível, a menos que esteja iterando conteúdo DOM simples, ou esteja intencionalmente se apoiando no comportamento padrão para ganho de desempenho.

Por ser um mecanismo genérico do Vue para identificar nós, `key` também tem outras utilidades não especificamente associadas ao `v-for`, como veremos futuramente neste guia.

## Detectando Mudanças em Arrays

### Métodos de Mutação

Vue envolve automaticamente os métodos de mutação de um Array observado, de forma que dispare alterações na interface. Os métodos englobados são:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Você pode abrir o _console_ e brincar com os `items` dos exemplos anteriores, chamando seus métodos de mutação. Por exemplo: `example1.items.push({ message: 'Novo' })`.

### Substituindo um Array

Métodos de mutação, como o nome sugere, mudam o Array original no qual são chamados. Em comparação, também há métodos sem mutação, como `filter()`, `concat()` e `slice()`, que não modificam o Array original, mas sim **retornam um novo Array**. Ao trabalhar com métodos sem mutação, você pode substituir o Array antigo pelo novo:

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Algo/)
})
```

Você pode pensar que isto fará o Vue jogar fora todo o DOM existente e "re-renderizar" a lista toda - por sorte, não é o caso. Vue implementa algumas heurísticas inteligentes para maximizar a reutilização dos elementos DOM, assim sobrescrever um Array com outro, contendo elementos subjacentes, é uma operação muito eficiente.

### Limitações

Por limitações no JavaScript, Vue **não pode** detectar as seguintes mudanças em um Array:

1. Quando se define diretamente um item em um índice: `vm.items[indexOfItem] = newValue`
2. Quando se modifica diretamente o tamanho do Array: `vm.items.length = newLength`

Para contornar a limitação 1, há duas alternativas ao `vm.items[indexOfItem] = newValue` que causam atualização de estado no sistema de reatividade:

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
example1.items.splice(indexOfItem, 1, newValue)
```

Para lidar com a limitação 2, é possível usar `splice`:

``` js
example1.items.splice(newLength)
```

## Detectando Mudanças em Objetos

Novamente por limitações no JavaScript moderno, **Vue não pode detectar adição e remoção de propriedades**. Por exemplo:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` é reativo

vm.b = 2
// `vm.b` NÃO é reativo
```

Vue não permite dinamicamente adicionar novas propriedades reativas em nível raiz para uma instância já criada. Entretanto, é possível adicionar propriedades reativas a objetos internos usando o método `Vue.set(object, key, value)`. Por exemplo, dado o código:

``` js
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Zé Ninguém'
    }
  }
})
```

Você poderia adicionar uma nova propriedade `age` ao objeto interno `userProfile` com:

``` js
Vue.set(vm.userProfile, 'age', 30)
```

Também é possível usar o método de instância `vm.$set`, um atalho para o global `Vue.set`:

``` js
this.$set(this.userProfile, 'age', 30)
```

Às vezes, você pode querer adicionar várias novas propriedades a um objeto existente, utilizando por exemplo `Object.assign()` ou `_.extend()`. Nestes casos, você pode criar um objeto novo com propriedades mescladas de ambos os objetos. Então, ao invés de:

``` js
Object.assign(this.userProfile, {
  age: 30,
  favoriteColor: 'Verde Vue'
})
```

Você poderia adicionar novas propriedades reativas com:

``` js
this.userProfile = Object.assign({}, this.userProfile, {
  age: 30,
  favoriteColor: 'Verde Vue'
})
```

## Mostrando Resultados Filtrados/Ordenados

Às vezes, queremos exibir uma versão filtrada ou ordenada de um Array sem efetivamente mutar ou reiniciar seus dados originais. Neste caso, você pode criar um [dado computado](computed.html#Dados-Computados) que retorna um Array filtrado ou ordenado.

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

Em situações onde dados computados não são factíveis (por exemplo, em repetições `v-for` aninhadas), você pode usar um método:

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

## Intervalo Numérico no `v-for`

O `v-for` pode aceitar um número inteiro. O _template_ se repetirá este número de vezes.

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

## Utilizando `<template>` com `v-for`

Similar ao uso de _template_ com `v-if`, você pode usar `<template>` com `v-for` para renderizar blocos de múltiplos elementos sem um elemento pai repetitivo. Exemplo:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

## Utilizando `v-if` com `v-for`

Quando existentes em um mesmo nó, `v-for` tem maior prioridade que `v-if`. Isto significa que `v-if` será executado separadamente a cada iteração da repetição. Isto pode ser útil se quiser renderizar nós condicionalmente para apenas _alguns_ itens, como abaixo:

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

Este exemplo renderizaria apenas as tarefas não marcadas como completas.

Se, ao invés disso, sua intenção for condicionalmente pular toda a execução da repetição, você pode colocar o `v-if` em um elemento envolvendo o bloco (ou [`<template>`](conditional.html#Grupos-Condicionais-com-lt-template-gt)). Por exemplo:

``` html
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>Não há tarefas a fazer!</p>
```

## Componentes com `v-for`

> Caso ainda não tenha lido sobre [Componentes](components.html), sinta-se livre para pular e voltar depois.

Você pode usar `v-for` diretamente em componentes personalizados de maneira comum:

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> Em 2.2.0+, ao usar `v-for` com um componente, um atributo [`key`](list.html#key) é obrigatório.

Observe, entretanto, que isto não passa automaticamente qualquer dado ao componente, pois componentes possuem seus próprios escopos isolados. Para passar dados iterados para dentro do componente, devemos utilizar [Propriedades](components.html#Propriedades):

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

A razão para não injetarmos automaticamente `item` dentro do componente é evitar que ele fique fortemente acoplado ao funcionamento do `v-for`. Sendo explícito sobre quais dados especificamente são introduzidos, tornamos o componente reutilizável em outras situações.

Aqui temos um exemplo de uma lista de tarefas simples usando componentes:

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Adicionar uma tarefa"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

<p class="tip">Note the `is="todo-item"` attribute. This is necessary in DOM templates, because only an `<li>` element is valid inside a `<ul>`. It does the same thing as `<todo-item>`, but works around a potential browser parsing error. See [DOM Template Parsing Caveats](components.html#DOM-Template-Parsing-Caveats) to learn more.</p>

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
      {
        id: 1,
        title: 'Lavar os pratos',
      },
      {
        id: 2,
        title: 'Tirar o lixo',
      },
      {
        id: 3,
        title: 'Cortar a grama'
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
<div id="todo-list-example" class="demo">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Adicionar uma tarefa"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
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
      {
        id: 1,
        title: 'Lavar os pratos',
      },
      {
        id: 2,
        title: 'Tirar o lixo',
      },
      {
        id: 3,
        title: 'Cortar a grama'
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
