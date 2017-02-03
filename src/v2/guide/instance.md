---
title: L'instance de Vue
type: guide
order: 3
---

## Constructeur

Chaque Vue vm est initialisée en créant une **instance racine de Vue** avec le constructeur de la fonction `Vue`

``` js
var vm = new Vue({
  // options
})
```

Bien que n'étant pas strictement associée au patron d'architecture [MVVM pattern](https://en.wikipedia.org/wiki/Model_View_ViewModel), la conception de Vue s'en est en partie inspirée. Par convention, nous utilisons souvent la variable `vm` (abréviation pour ViewModel) pour faire référence à nos instances de Vue.

Quand vous créez une instance de Vue, vous devez passer un **objet d'options** qui contient les options pour les données, le template, l'element de montage, les méthodes, les fonctions de retour du cycle de vie etc... La liste des options peut être trouvée [dans la documentation de l'API](../api).

Le constructeur de `Vue` peut être étendu pour créer des **constructeurs de composants** réutilisables avec des options prédéfinies.

``` js
var MyComponent = Vue.extend({
  // options d'extension
})

// toutes les instances de `MyComponent` sont créées avec
// les options d'extension prédéfinies
var myComponentInstance = new MyComponent()
```

Bien qu'il soit possible de créer des instances étendues de manière impérative, la plupart du temps il est recommandé de les composer de manière déclarative dans les templates en tant qu'éléments personnalisés. Nous parlerons du [système de composants](components.html) en détail plus loin. Pour le moment, vous avez juste besoin de savoir que tous les composants de Vue sont fondamentalement des instances de Vue étendues. 

## Propriétés et méthodes

Chaque instance de vue **« proxifie »** toutes les propriétés contenues dans son objet `data`

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// assigner la propriété affecte également la donnée originale
vm.a = 2
data.a // -> 2

// ... et vice-versa
data.a = 3
vm.a // -> 3
```

Soulignons que seuls ces propriétés proxifiées sont **réactives**. Si vous attachez une nouvelle propriété à l'instance après sa création, elle ne déclenchera aucune mise à jour de la vue. Nous parlerons plus loin du système de réactivité en détail.

En plus des propriétés de data, les instances de Vue exposent de nombreuses méthodes et propriétés utiles. Ces propriétés et méthodes sont préfixées par `$` pour les différencier des propriétés proxifiées de data. Par exemple :

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch est une méthode de l'instance
vm.$watch('a', function (newVal, oldVal) {
  // cette fonction de retour sera appelée quand `vm.a` changera
})
```

<p class="tip">N'utilisez pas les [fonctions fléchées](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/Fonctions_fl%C3%A9ch%C3%A9es) sur une propriété ou fonction de retour d'une instance  (par exemple `vm.$watch('a', newVal => this.myMethod())`). Comme les fonctions fléchées sont liées au contexte parent, `this` ne sera pas l'instance de Vue comme vous pourriez vous y attendre et `this.myMethod` sera indéfini.</p>

Consultez [l'API](../api) pour une liste complète des propriétés et méthodes d'une instance. 

## Les *hooks* de cycle de vie d'une instance

Chaque instance de vue traverse une série d'étapes d'initialisation au moment de sa création - par exemple, elle doit mettre en place l'observation des données, compiler le template, monter l'instance sur le DOM et mettre à jour le DOM quand les données changent. En cours de route, elle va aussi invoquer des **_hooks_ de cycle de vie**, qui nous donnent l'opportunité d'exécuter une logique personnalisée. Par exemple, le hook [`created`](../api/#created) est appelé une fois l'instance créée.

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` est une référence à l'instance de vm
    console.log('a is: ' + this.a)
  }
})
// -> "a is: 1"
```

Il y aussi d'autres hooks qui seront appelés à différentes étapes du cycle de vie d'une instance, par exemple [`mounted`](../api/#mounted), [`updated`](../api/#updated) et [`destroyed`](../api/#destroyed). Tous ces hooks de cycle de vie sont appelés avec leur `this` pointant sur l'instance de la vue qui les invoque. Vous vous êtes peut-être demandé où se trouvait le concept de « contrôleur » dans le monde de Vue et la réponse est : il n'y pas de contrôleurs. Votre logique personnalisée pour un composant sera répartie entre ces hooks de cycle de vie.

## Diagramme de cycle de vie

Ci-dessous se trouve le diagramme d'un cycle de vie d'une instance. Vous n'avez pas besoin de tout comprendre de A à Z à ce stade, mais ce diagramme pourra vous être utile dans le futur.

![Lifecycle](/images/lifecycle.png)
