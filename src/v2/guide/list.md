---
title: Rendu de liste
type: guide
order: 8
---

## `v-for`

Nous pouvons utiliser la directive `v-for` pour faire le rendu d'une liste d'éléments en se basant sur un tableau. La directive `v-for` utilise une syntaxe spécifique de la forme `item in items`, où `items` représente le tableau source des données et où `item` est un **alias** représentant l'élément du tableau en cours d'itération :

### Utilisation simple

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

Résultat :

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

À l'intérieur des structures `v-for`, nous avons un accès complet aux propriétés de la portée parente. `v-for` supporte également un second argument optionnel représentant l'index de l'élément courant.

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

Result:

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

Vous pouvez également utiliser `of` en tant que mot clé à la place de `in` pour être plus proche de la syntaxe JavaScript concernant l'utilisation des itérateurs :

``` html
<div v-for="item of items"></div>
```

### Template `v-for`

De la même manière qu'avec `v-if`, vous pouvez également utiliser la balise `<template>` avec `v-for` pour faire le rendu d'une structure contenant de multiples éléments. Par exemple :

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

### `v-for` avec l'objet

Vous pouvez aussi utiliser `v-for` pour itérer sur les propriétés d'un objet.

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

Result:

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

Vous pouvez également fournir un deuxième argument représentant la clé de la propriété courante :

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

Et également un troisième pour l'index :

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">Quand vous itérez sur un objet, l'ordre est basé sur l'ordre d'énumération de `Object.keys()` et il **n'**y a **aucune** garantie de cohérence à travers toutes les implémentations des moteurs JavaScript.</p>

### `v-for` et nombres

`v-for` peut également prendre un nombre entier. Dans ce cas, il répétera le template autant de fois qu'indiqué.

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

Résultat :

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
new Vue({ el: '#range' })
</script>
{% endraw %}

### Composants et `v-for`

> Cette partie suppose que vous connaissez les [Composants](components.html). Vous pouvez la passer pour le moment et y revenir plus tard.

Vous pouvez directement utiliser `v-for` sur un composant personnalisé, comme sur n'importe quel autre élément standard :

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> En 2.2.0+, lors de l'utilisation de `v-for` avec un composant, une [`key`](list.html#key) (clé) est maintenant requise.

Cependant, cela ne passera pas automatiquement les données au composant parce que les composants ont leurs propres portées isolées. Pour passer les données itérées au composant, nous devons utiliser les props en plus :

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id">
</my-component>
```

La raison pour ne pas injecter automatiquement `item` dans le composant est que cela le rendrait fortement couplé au fonctionnement de `v-for`. Être explicite sur l'endroit d'où proviennent les données rend le composant réutilisable dans d'autres situations.

Voici un exemple complet d'une simple liste de tâches :

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
      v-bind:key="todo.id"
      v-bind:title="todo.title"
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
      {
        id: 1,
        title: 'Faire la vaisselle',
      },
      {
        id: 2,
        title: 'Sortir les poubelles',
      },
      {
        id: 3,
        title: 'Tondre la pelouse'
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
        title: 'Faire la vaisselle',
      },
      {
        id: 2,
        title: 'Sortir les poubelles',
      },
      {
        id: 3,
        title: 'Tondre la pelouse'
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

### `v-for` avec `v-if`

Quand ils existent sur le même nœud, `v-for` a une priorité plus élevée que `v-if`. Cela signifie que `v-if` va être exécuté indépendamment à chaque itération de boucle. C'est très utile quand vous voulez faire le rendu de seulement certains noeuds, comme ci-dessous : 

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

La partie ci-dessus fait uniquement le rendu des tâches qui ne sont pas achevées.

Si votre intention est plutôt de sauter conditionnellement l'exécution de la boucle, vous pouvez placer le `v-if` sur l'élément parent (ou sur [`<template>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt)). Par exemple :

``` html
<ul v-if="shouldRenderTodos">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
```

## `key`

Quand Vue met à jour une liste d'éléments rendus avec `v-for`, il utilise par défaut une stratégie de « modification localisée » (*in-place patch*). Si l'ordre des éléments d'un tableau dans *data* a changé, plutôt que de déplacer les éléments du DOM pour concorder avec le nouvel ordre des éléments, Vue va simplement modifier chaque élément déjà en place et s'assurer que cela reflète ce qui aurait dû être rendu à cet index en particulier. C'est un comportement similaire au `track-by="$index"` de Vue 1.x.

Ce mode par défaut est performant, mais adapté seulement **lorsque le résultat du rendu de votre liste ne dépend pas de l'état d'un composant enfant ou de l'état temporaire du DOM (ex. : les valeurs de champs d'un formulaire)**.

Pour expliquer à Vue comment suivre l'identité de chaque nœud, afin que les éléments existants puissent être réutilisés et réordonnés, vous devez fournir un attribut unique `key` pour chaque élément. Une valeur idéale pour `key` serait l'identifiant `id` unique de chaque élément. Cet attribut spécial est en gros l'équivalent du `track-by` de la 1.x, mais il fonctionne comme un attribut, donc vous avez besoin d'utiliser `v-bind` pour le lier à des valeurs dynamiques (en utilisant ici l'abréviation de `v-bind`) :

``` html
<div v-for="item in items" :key="item.id">
  <!-- contenu -->
</div>
```

Il est recommandé de fournir une `key` avec `v-for` chaque fois que possible, à moins que le contenu itéré du DOM soit simple ou que vous utilisiez intentionnellement le comportement de base pour un gain de performance.

Comme c'est un mécanisme générique pour Vue permettant d’identifier les nœuds, la `key` a également d'autres usages et ne se limite pas seulement à son utilisation avec `v-for`, comme nous le verrons plus tard dans le guide.

## Détection de changement dans un tableau

### Méthodes de mutation

Vue surcharge les méthodes de mutation d'un tableau observé afin qu'elles déclenchent également des mises à jour de la vue. Les méthodes encapsulées sont :

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Vous pouvez ouvrir la console et jouer avec la liste des éléments `items` des exemples précédents en appelant leurs méthodes de mutation. Par exemple : `example1.items.push({ message: 'Baz' })`.

### Remplacer un tableau

Les méthodes de mutation, comme leur nom le suggère, modifient le tableau d'origine sur lequel elles sont appelées. En comparaison, il y a aussi des méthodes non-mutatives comme par ex. `filter()`, `concat()` et `slice()`, qui ne changent pas le tableau original mais **retourne toujours un nouveau tableau**. Quand vous travaillez avec des méthodes non-mutatives, vous pouvez juste remplacer l'ancien tableau par le nouveau :

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Vous pouvez penser que cela va forcer Vue à jeter le DOM existant et à faire de nouveau le rendu de la liste entière ? Par chance, cela n'est pas le cas. Vue implémente plusieurs fonctions heuristiques intelligentes pour maximiser la réutilisation du DOM existant ; ainsi remplacer un tableau par un autre contenant des objets différents à certains index est une opération très performante.

### Limitations

À cause des limitations en JavaScript, Vue **ne peut pas** détecter les changements suivants dans un tableau :

1. Quand vous affectez directement un élément à un index. Ex. : `vm.items[indexOfItem] = newValue`
2. Quand vous modifiez la longeur du tableau. Ex. : `vm.items.length = newLength`

Pour contourner la première limitation, les deux exemples suivants accomplissent la même chose que `vm.items[indexOfItem] = newValue`, mais vont également déclencher des mises à jour de l'état dans le système de réactivité :

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
example1.items.splice(indexOfItem, 1, newValue)
```

Pour gérer la seconde limitation, vous pouvez également utiliser `splice` :

``` js
example1.items.splice(newLength)
```

## Affichage de résultats filtrés/triés

Parfois nous voulons afficher une version filtrée ou triée d'un tableau sans pour autant modifier ou réassigner les données d'origine. Dans ce cas, vous pouvez créer une propriété calculée qui retourne le tableau filtré ou trié.

Par exemple :

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

Dans les situations où les propriétés calculées ne sont pas utilisables (ex. : à l'intérieur d'une boucle `v-for` imbriquée), vous pouvez juste utilisez une méthode :

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
