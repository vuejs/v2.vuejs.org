---
title: Gestionnaire des événements
type: guide
order: 9
---

## Ecoute des événements  

Nous pouvons utiliser l'instruction `v-on` pour écouter les événements du DOM afin d'éxécuter du JavaScript lorsque ces événements surviennent.

Par exemple:

``` html
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>Le bouton ci-dessus a été cliqué {{ counter }} fois.</p>
</div>
```
``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

Résultat:

{% raw %}
<div id="example-1" class="demo">
  <button v-on:click="counter += 1">Add 1</button>
  <p>Le bouton ci-dessus a été cliqué {{ counter }} fois.</p>
</div>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
</script>
{% endraw %}

## Les méthodes de gestion d'évènement

La logique pour beaucoup des gestionnaires d'événements sera très certainement plus complexe, par conséquence, garder votre JavaScript dans la valeur de l'attribut v-on ne sera tout simplement pas possible. C'est pourquoi v-on peut aussi accepter le nom d'une méthode que vous voudriez appeler.

Par exemple:

``` html
<div id="example-2">
  <!-- `greet` est le nom de la méthode definie ci-dessous-->
  <button v-on:click="greet">Greet</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // Définissez les méthodes de l'objet
  methods: {
    greet: function (event) {
      // `this` fait référence à l'instance de Vue à l'intérieur de `methods`..
      alert('Hello ' + this.name + '!')
      // `event` est l'événement natif du DOM
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// vous pouvez également invoquer ces méthodes en JavaScript
example2.greet() // -> 'Hello Vue.js!'
```

Résultat :

{% raw %}
<div id="example-2" class="demo">
  <button v-on:click="greet">Dire bonjour</button>
</div>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
      alert('Bonjour ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
{% endraw %}

## Méthode d'écoute dans les attributs :

Au lieu de lier directement la méthode par son nom dans l'attribut, nous pouvons également utiliser la méthode avec une instruction JavaScript :

``` html
<div id="example-3">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
```
``` js
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

Résultat:
{% raw %}
<div id="example-3" class="demo">
  <button v-on:click="say('salut')">Dire salut</button>
  <button v-on:click="say('quoi')">Dire quoi</button>
</div>
<script>
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
</script>
{% endraw %}

Parfois nous avons également besoin d'accéder à l'événement original du DOM depuis l'instruction dans l'attribut. Vous pouvez le passer à une méthode en utilisant la variable spéciale $event :

``` html
<button v-on:click="warn('Le formulaire ne peut être soumis pour le moment.', $event)">Soumettre</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // now we have access to the native event
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## Modificateurs d'événements

C'est un besoin courant que de faire appel ā `event.preventDefault()` ou `event.stopPropagation()` à l'intérieur d'une déclaration de gestionnaire d'évènement. Bien que nous puissions réaliser ceci aisément à l'intérieur de " methods " ,  il serait préférable que les méthodes restent purement dediées à la logique des données au lieu d'avoir à gérer les détails des évènements du DOM.

Pour résoudre ce problème, Vue propose des modificateurs d'événement pour `v-on`. Rappelez-vous que les modificateurs sont des suffixes de directives indiqués par un point.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

``` html
<!-- la propagation de l'événement du clic sera stoppée -->
<a v-on:click.stop="doThis"></a>

<!-- l'événement « submit » ne rechargera plus la page -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- les modificateurs peuvent être chainés -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- seulement le modificateur -->
<form v-on:submit.prevent></form>

<!-- utilise le mode « capture » lorsque l'événement écouteur est ajouté -->
<div v-on:click.capture="doThis">...</div>

<!-- seulement déclenché si l'instruction « event.target » est l'élément lui même.-->
<!-- c-à-d : ne s'applique pas aux éléments "enfant" -->
<div v-on:click.self="doThat">...</div>
```

> New in 2.1.4

``` html
<!-- l'événement « click » sera déclenché au moins une fois -->
<a v-on:click.once="DoThis"></a>
```

Au contraire des autres modificateurs, qui sont exclusifs aux événements natifs du DOM, le modificateur `.once` peut également être utilisé pour les [événements  des composants](components.html#Using-v-on-with-Custom-Events). Si vous n'avez pas encore lu la section concernant les composants, ne vous en inquiétez pas pour le moment.

## Modificateurs "key" (Touches)

Lorsque nous écoutons les événements du clavier, nous avons régulièrement besoin de s'assurer des codes des touches. Vue permet également d'ajouter un modificateur de touches pour `v-on`:

``` html
<!-- faire appel à « vm.submit() » uniquement quand le code de la touche est 13 -->
<input v-on:keyup.13="submit">
```

Se rappeler de tous les codes des touches est compliqué, c'est pourquoi Vue propose des alias pour les touches les plus couramment employées :

``` html
<!-- même exemple que le précédent -->
<input v-on:keyup.enter="submit">

<!-- fonctionne également pour les raccourcis -->
<input @keyup.enter="submit">
```

Voici la liste complète des raccourcis de modificateur pour les touches :

- `.enter`
- `.tab`
- `.delete` (fonctionne pour les touches "Suppression" et "Retour arrière")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

Vous pouvez également [définir des raccourcis personnalisés pour vos modificateurs ](../api/#keyCodes) grâce à l'objet global `config.keyCodes`:

``` js
// active v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

## Modificateurs de touches

> New in 2.1.0

Vous pouvez utiliser les modificateurs suivants pour déclencher un événement du clavier ou de la souris seulement lorsque la touche du modificateur correspondante est appuyé :

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Note: Sur les claviers Macintosh, meta est la touche commande (⌘). Sur Windows, meta est la touche windows (⊞). Sur les claviers Sun Microsystems, meta est symbolisé par un diamant plein (◆). Sur certains claviers, spécifiquement sur les claviers des machines MIT et Lisp et leurs successeurs, comme le clavier « Knight » et « space-cadet », meta est ecrit « META ». Sur les claviers Symboliques, meta est etiqueté « META » ou « Meta ».

Par exemple:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

## Pourquoi des écouteurs dans le HTML ?

Vous pourriez être inquiets du fait que l'ensemble de cette approche d'écouteurs d'évènements viole la bonne vieille règle de la séparation des préoccupations.
Rassurez-vous - puisque toutes les fonctions et expressions sont strictement liées à « ViewModel »  qui gère la vue courante, cela ne causera aucune difficulté de maintenance. En realité, il y a plusieurs bénéfices à utiliser `v-on` :

1. Il est plus facile de localiser l'implémentation des fonctions de gestion du code JS en survolant le code HTML.

2. Comme vous n'avez pas à attacher manuellement les écouteurs dans votre JS, le code du « ViewModel » peut-être purement logique et sans DOM. Ceci rend plus facile les tests.

3. Quand un « ViewModel » est détruit, tout les événements écouteurs sont automatiquenemt retiré. Vous n'avez pas à vous soucier de le faire vous-même.
