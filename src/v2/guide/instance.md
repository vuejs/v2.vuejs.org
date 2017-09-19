---
title: L'instance de Vue
type: guide
order: 3
---

## Créer une instance de Vue

Chaque application Vue est initialisée en créant une nouvelle **instance de Vue** avec la fonction `Vue` :

``` js
var vm = new Vue({
  // options
})
```

Bien que n'étant pas strictement associée au patron d'architecture [MVVM pattern](https://fr.wikipedia.org/wiki/Mod%C3%A8le-vue-vue_mod%C3%A8le), la conception de Vue s'en est en partie inspirée. Par convention, nous utilisons souvent la variable `vm` (abréviation pour ViewModel) pour faire référence à nos instances de Vue.

Quand vous créez une instance de Vue, vous devez passer un **objet d'options**. Ce guide décrit en majorité comment vous pouvez utiliser ces options pour créer les comportements que vous souhaitez. Vous pouvez également parcourir la liste complète de référence [dans la documentation de l'API](../api/#Options-Data).

Une application Vue consiste en une **instance racine de Vue** créée avec `new Vue` et optionnellement organisée en un arbre de composants imbriqués et réutilisables. Par exemple, l'arbre d'une application de liste de tâches pourrait ressembler à cela :

```
Instance racine
|- TodoList
   |- TodoItem
      |- DeleteTodoButton
      |- EditTodoButton
   |- TodoListFooter
      |- ClearTodosButton
      |- TodoListStatistics
```

Nous parlerons du [système de composant](components.html) en détail plus loin. Pour le moment, sachez simplement que tous les composants de Vue sont également des instances de Vue et qu'ils acceptent donc le même objet d'option (à l'exception de quelques options spécifiques à l'instance racine).

## Données et méthodes

Quand une instance de Vue est créée, cela ajoute toutes les propriétés trouvées dans son objet `data` au **système réactif** de Vue. Quand une valeur de ces propriétés change, la vue va « réagir », se mettant à jour pour concorder avec les nouvelles valeurs.

``` js
// Notre objet de données
var data = { a: 1 }

// L'objet est ajouté à une instance de Vue
var vm = new Vue({
  data: data
})

// Ces propriétés font référence au même objet !
vm.a === data.a // => true

// assigner la propriété à une instance
// affecte également la donnée originale
vm.a = 2
data.a // => 2

// ... et vice-versa
data.a = 3
vm.a // => 3
```

Quand ces données changent, le rendu de la vue est refait. Il est à noter que les propriétés dans `data` sont **réactives** si elles existaient quand l'instance a été créée. Cela signifie que si vous ajoutez une nouvelle propriété ainsi :

``` js
vm.b = 'salut'
```

les changements de `b` ne déclencheront aucune mise à jour. Si vous savez que vous aller avoir besoin d'une propriété plus tard qui n'a pas de valeur dès le début, vous avez juste besoin de la créer avec n'importe quelle valeur initiale. Par exemple :

``` js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

En plus des propriétés de données, les instances de Vue exposent de nombreuses méthodes et propriétés utiles. Ces propriétés et méthodes sont préfixées par `$` pour les différencier des propriétés proxifiées de data. Par exemple :

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch est une méthode de l'instance
vm.$watch('a', function (newVal, oldVal) {
  // cette fonction de rappel sera appelée quand `vm.a` changera
})
```

Consultez [l'API](../api#Proprietes-dinstance) pour une liste complète des propriétés et méthodes d'une instance.

## Les hooks de cycle de vie d'une instance

Chaque instance de vue traverse une série d'étapes d'initialisation au moment de sa création - par exemple, elle doit mettre en place l'observation des données, compiler le template, monter l'instance sur le DOM et mettre à jour le DOM quand les données changent. En cours de route, elle va aussi invoquer des **_hooks_ de cycle de vie**, qui nous donnent l'opportunité d'exécuter une logique personnalisée à chaque niveau.

Par exemple, le hook [`created`](../api/#created) est appelé une fois l'instance créée :

``` js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` est une référence à l'instance de vm
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

Il y a aussi d'autres hooks qui seront appelés à différentes étapes du cycle de vie d'une instance, par exemple [`mounted`](../api/#mounted), [`updated`](../api/#updated) et [`destroyed`](../api/#destroyed). Tous ces hooks de cycle de vie sont appelés avec leur `this` pointant sur l'instance de la vue qui les invoque.

<p class="tip">N'utilisez pas les [fonctions fléchées](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/Fonctions_fl%C3%A9ch%C3%A9es) sur une propriété ou fonction de rappel d'une instance  (par exemple `vm.$watch('a', newVal => this.myMethod())`). Comme les fonctions fléchées sont liées au contexte parent, `this` ne sera pas l'instance de Vue comme vous pourriez vous y attendre et `this.myMethod` sera indéfinie.</p>

## Diagramme du cycle de vie

Ci-dessous se trouve le diagramme d'un cycle de vie d'une instance. Vous n'avez pas besoin de tout comprendre de A à Z à ce stade, mais ce diagramme pourra vous être utile dans le futur.

![Le cycle de vie d'une instance de Vue](/images/lifecycle.png)
