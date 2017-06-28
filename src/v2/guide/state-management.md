---
title: Gestion des états
type: guide
order: 22
---

## Implémentation officielle à la Flux

Les grosses applications peuvent souvent augmenter en complexité du fait des multiples parties d'états disséminés à travers divers composants et les interactions entre eux. Pour résoudre ce problème, Vue offre [Vuex](https://github.com/vuejs/vuex) : sa propre bibliothèque de gestion d'état inpiré par Elm. Il est même intégré à [vue-devtools](https://github.com/vuejs/vue-devtools), fournissant une possibilité de voir l'état dans le temps sans aucune configuration préalable.

### Information pour les développeurs React

Si vous venez de React, vous vous demanderez probablement quels sont les points de comparaisons entre Vuex et [Redux](https://github.com/reactjs/redux) (l'implémentation de Flux la plus populaire dans cet écosystème). Redux est actuellement une couche de vue agnostique, il peut donc être facilement utilisé avec Vue à l'aide de plusieurs [liaisons simples](https://github.com/egoist/revue). Vuex est différent dans le sens où il _sait_ ce qu'il y a dans une application Vue. Cela lui permet d'être mieux intégré à Vue, offrant une API plus intuitive et une meilleure expérience de développement.

## Gestion d'état simple à partir de rien

Nous n'avons pas assez insisté sur le fait que, dans des applications Vue, c'est l'objet `data` qui fait office de « source de vérité ». Une instance de Vue ne fait que proxifier l'accès à cet objet. Par conséquent, si vous avez une partie d'état qui doit être partagée par plusieurs instances, vous pouvez simplement la partager par référence :

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Maintenant, quelque soit la manière dont `sourceOfTruth` sera mutée, les instances vmA` et `vmB` mettrons à jour leurs vues automatiquement. Les sous-composants à l'intérieur de chacune de ces instances y auront aussi accès via la propriété `this.$root.$data`. Maintenant, nous avons une unique source de vérité, mais le débogue pourrait être un vrai cauchemar. N'importe quel fragment de donnée pourrait être changé par n'importe quelle partie de notre application, à n'importe quel moment, et sans laisser de trace.

Pour nous aider à résoudre ce problème, nous allons adopter un simple **modèle de stockage (« store »)** :

``` js
var store = {
  debug: true,
  state: {
    message: 'Bonjour !'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction déclenchée avec', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction déclenchée')
    this.state.message = ''
  }
}
```

Notez que toutes les actions qui changent l'état du store sont mises à l'intérieur du store lui-même. Ce type de gestion d'état centralisé permet de comprendre plus facilement quelles types de mutations sont faites et comment elles sont déclenchées. Maintenant, quand quelque chose se passera mal, nous auront des logs sur ce qui a conduit à ce bogue.

De plus, chaque instance/composant peut gérer lui-même sont propre état privé :

``` js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![Gestion des états](/images/state.png)

<p class="tip">Il est important de noter que vous ne devriez jamais remplacer l'objet d'état original dans vos actions. Les composants et le store ont besoin de partager une référence sur le même objet pour que les mutations puissent être observées.</p>

En élargissant notre convention au fait qu'il ne serait jamais permis à un composant de directement muter un état qui appartient au store, mais que l'on devrait à la place propager des évènements pour notifier le store qu'une action a été entreprise ; nous arriverions éventuellement à une architecture [Flux](https://facebook.github.io/flux/). Le bénéfice de cette convention est que nous pouvons enregistrer toutes les mutations de l'état qui apparaissent dans le store et implémenter des fonctions utilitaires avancées de débogage comme des logs de mutations, des instantanés, des rejouabilités d'historique ou de l'observation dans le temps.

Nous avons fait le tour de la présentation de [Vuex](https://github.com/vuejs/vuex), aussi si vous êtes arrivé jusqu'ici, il est probablement temps de l'essayer !
