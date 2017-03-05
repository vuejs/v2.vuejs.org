---
title: La réactivité dans le détail
type: guide
order: 12
---

Nous avons couvert la plupart des principes fondamentaux, maintenant il est temps de plonger dans les méandres ! L'une des caractéristiques les plus évidentes de Vue est le système de réactivité discret. Les modèles sont simplement des objets JavaScript. Lorsque vous les modifiez, la vue est mise à jour. Cela rend le gestionnaire d'état très simple et intuitive, mais il est également important de comprendre comment cela fonctionne pour éviter quelques erreurs habituelles. Dans cette section, nous allons creuser certains détails de bas niveau du système de réactivité de Vue.

## Comment les modifications sont suivies ?

Lorsque vous passez un simple objet JavaScript à une instance de Vue comme son option `data`, Vue parcourra toutes ses propriétés et les convertira en accesseurs/mutateurs (getters/setters) en utilisant [Object.defineProperty](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/defineProperty). Il s'agit d'une fonctionnalité ES5 uniquement et qui ne peut pas être émulée, c'est pourquoi Vue ne prend pas en charge IE8 et les versions antérieures.

Les accesseurs/mutateurs sont invisibles pour l'utilisateur, mais sous le capot, ils permettent à Vue d'effectuer le suivi des dépendances et la notification de changement quand les propriétés sont accédées ou modifiées. Une des limitations est que les consoles des navigateurs formatent les accesseurs/mutateurs différemment lorsque les objets de données converties sont affichés, vous pouvez donc installer [vue-devtools](https://github.com/vuejs/vue-devtools) pour avoir une interface plus sympathique lors de l'inspection.

Chaque instance de composant a une instance d'**observateur** correspondante, qui enregistre toutes les propriétés « impactées » pendant le rendu du composant sous forme de dépendances. Plus tard, lorsque le mutateur d'une dépendance est déclenché, il en avertit l'observateur, ce qui provoque à son tour un nouveau rendu du composant.

![Reactivity Cycle](/images/data.png)

## Limitations sur la détection de changement

En raison des limites du JavaScript moderne (et l'abandon de `Object.observe`), Vue **ne peut pas détecter l'ajout et la suppression de propriété**. Étant donné que Vue effectue le processus de conversion de l'accesseur/mutateur lors de l'initialisation de l'instance, une propriété doit être présente dans l'objet `data` afin que Vue puisse le convertir et le rendre réactif. Par exemple :

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` est maintenant réactif

vm.b = 2
// `vm.b` N'est PAS réactif
```

Vue n'autorise pas l'ajout dynamique de nouvelles propriétés réactives au niveau de la racine dans une instance déjà créée. Toutefois, il est possible d'ajouter des propriétés réactives à un objet imbriqué à l'aide de la méthode `Vue.set(object, key, value)` :

``` js
Vue.set(vm.someObject, 'b', 2)
```

Vous pouvez aussi utiliser la méthode d'instance `vm.$set`, qui est juste un alias à la méthode globale `Vue.set` :

``` js
this.$set(this.someObject, 'b', 2)
```

Parfois vous pouvez affecter un certain nombre de propriétés à un objet existant, par exemple à l'aide de `Object.assign()` ou `_.extend()`. Pourtant, les nouvelles propriétés ajoutées à l'objet ne déclencheront pas de changements. Dans de tels cas, créez un objet vide avec des propriétés à la fois de l'objet d'origine et de l'objet à intégrer :

``` js
// Au lieu de `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

Il y a également quelques limitations liées aux tableaux, qui ont été expliqués précédemment dans la [section rendu de liste](list.html#Limitations).

## Déclaration de propriétés réactives

Étant donné que Vue ne permet pas d'ajouter dynamiquement des propriétés réactives au niveau de la racine, vous devez initialiser les instances de Vue en déclarant toutes les propriétés des données réactives au niveau de la racine, même avec juste une valeur vide :

``` js
var vm = new Vue({
  data: {
    // déclare message avec une valeur vide
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// définit plus tard `message`
vm.message = 'Bonjour !'
```

Si vous ne déclarez pas `message` dans l'option data, Vue vous avertira que la fonction de rendu tente d'accéder à une propriété qui n'existe pas.

Il y a des raisons techniques derrière cette restriction (ça élimine tout une partie de cas particuliers dans le système de suivi, et permet également aux instances de Vue de mieux jouer avec les systèmes de vérification de type). Mais il y a aussi une considération importante en termes de maintenance de code : l'objet `data` est comme le schéma de l'état de votre composant. La déclaration de toutes les propriétés réactives dès le départ rend le code du composant plus facile à comprendre lorsqu'il sera re-visité ou lu par un autre développeur.

## File d'attente de mise à jour asynchrone

Au cas où vous ne l'auriez pas encore remarqué, Vue effectue les mises à jour du DOM de façon **asynchrone**. Chaque fois qu'un changement de données est observé, cela ouvrira une file d'attente et mettra en mémoire toutes les modifications de données qui se sont produites dans la même boucle d'événement. Si le même observateur est déclenché plusieurs fois, il ne sera envoyé qu'une seule fois dans la file d'attente. Cette suppression des doublons en mémoire est primordiale car elle évite des calculs et des manipulations du DOM inutiles. Puis, lors du prochain « tour » (tick) de la boucle d'événement, Vue vide la file d'attente et effectue le travail (la suppression des doublons est déjà faite). Intérieurement Vue essaye les fonctions natives `Promise.then` et `MutationObserver` pour la file d'attente asynchrone et se rabat sur `setTimeout(fn, 0)` si ça ne fonctionne pas. 

Par exemple, lorsque vous définissez `vm.someData = 'nouvelle valeur'`, le composant ne sera pas rendu de nouveau immédiatement. Il se mettra à jour dans le prochain « tour » (tick), lorsque la file d'attente sera vidée. La plupart du temps nous n'avons pas besoin de nous en soucier, mais cela peut être délicat lorsque vous voulez faire quelque chose qui dépend de l'état du DOM après sa mise à jour. Bien que Vue.js encourage généralement les développeurs à penser d'un axe de « diriger par les données » (« data-driven ») en évitant de toucher le DOM directement, parfois il peut être nécessaire de se salir les mains. Pour attendre que Vue.js ait terminé la mise à jour du DOM après un changement de données, vous pouvez utiliser `Vue.nextTick (callback)` immédiatement après la modification des données. La fonction de retour sera appelée après que le DOM ait été mis à jour. Par exemple :

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'nouveau message' // change les données
vm.$el.textContent === 'nouveau message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'nouveau message' // true
})
```

Il y a aussi la méthode d'instance `vm.$nextTick()`, qui est particulièrement pratique à l'intérieur des composants, car il n'a pas besoin de la variable globale de `Vue` et le contexte `this` de sa fonction de retour sera automatiquement lié à l'instance courante de Vue :

``` js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: 'pas mis à jour'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = 'mis à jour'
      console.log(this.$el.textContent) // => 'pas mis à jour'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'mis à jour'
      })
    }
  }
})
```
