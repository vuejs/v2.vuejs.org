---
title: Gestion de l'état
type: guide
order: 502
---

## Implémentation officielle semblable à Flux

Les grosses applications peuvent souvent augmenter en complexité du fait des multiples parties d'état disséminées à travers divers composants et les interactions entre eux. Pour résoudre ce problème, Vue offre [vuex](https://github.com/vuejs/vuex) : notre propre bibliothèque de gestion d'état inspiré par Elm. Il est même intégré à [vue-devtools](https://github.com/vuejs/vue-devtools), permettant [le voyage dans le temps](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif) sans aucune configuration préalable.

### Information pour les développeurs React

Si vous venez de React, vous pouvez vous demander comment Vuex se compare à [Redux](https://github.com/reactjs/redux), l'implémentation de Flux la plus populaire dans cet écosystème. Redux est en fait agnostique de la couche vue, et peut donc être facilement utilisé avec Vue à l'aide de plusieurs [liaisons simples](https://yarnpkg.com/en/packages?q=redux%20vue&p=1). Vuex est différent dans le sens où il _sait_ qu'il est dans une application Vue. Cela lui permet de mieux s'intégrer avec Vue, offrant une API plus intuitive et une meilleure expérience de développement.

## Gestion d'état simple à partir de rien

On n'insiste souvent pas assez sur le fait que, dans des applications Vue, c'est l'objet `data` qui fait office de « source de vérité ». Une instance de Vue ne fait que proxifier l'accès à cet objet. Par conséquent, si vous avez une partie d'état qui doit être partagée par plusieurs instances, vous pouvez simplement la partager par référence :

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Maintenant, quelle que soit la manière dont `sourceOfTruth` sera mutée, les instances `vmA` et `vmB` mettront à jour leurs vues automatiquement. Les sous-composants à l'intérieur de chacune de ces instances y auront aussi accès via la propriété `this.$root.$data`. Maintenant, nous avons une unique source de vérité, mais le débogage serait un cauchemar. N'importe quel fragment de donnée pourrait être changé par n'importe quelle partie de notre application, à n'importe quel moment, et sans laisser de trace.

Pour nous aider à résoudre ce problème, nous pouvons adopter un simple **modèle de stockage** appelé le store :

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

Notez que toutes les actions qui changent l'état du store sont mises à l'intérieur du store lui-même. Ce type de gestion d'état centralisé permet de comprendre plus facilement quel type de mutations peuvent survenir et comment elles sont déclenchées. Maintenant, quand quelque chose tourne mal, nous aurons également un log sur ce qui a conduit à ce bogue.

De plus, chaque instance/composant peut gérer lui-même son propre état privé :

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

![Gestion de l'état](/images/state.png)

<p class="tip">Il est important de noter que vous ne devriez jamais remplacer l'objet d'état original dans vos actions. Les composants et le store ont besoin de partager une référence au même objet pour que les mutations puissent être observées.</p>

Alors que nous continuons à développer la convention selon laquelle il n'est jamais permis à un composant de directement muter un état qui appartient au store, mais devrait à la place propager des évènements pour notifier le store qu'une action a été entreprise ; nous arriverons éventuellement à une architecture [Flux](https://facebook.github.io/flux/). Le bénéfice de cette convention est que nous pouvons enregistrer toutes les mutations d'état survenant sur le store et implémenter des fonctions utilitaires avancées de débogage telles que des logs de mutations, des clichés instantanés, et du voyage dans le temps sur l'historique des actions.

Nous avons fait le tour de la présentation de [vuex](https://github.com/vuejs/vuex), aussi si vous êtes arrivé jusqu'ici, il est probablement temps de l'essayer !
