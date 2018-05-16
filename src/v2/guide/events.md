---
title: Gestion des évènements
type: guide
order: 9
---

## Écouter des évènements

Nous pouvons utiliser l'instruction `v-on` pour écouter les évènements du DOM afin d'exécuter du JavaScript lorsque ces évènements surviennent.

Par exemple :

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

Résultat :

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

## Méthodes des gestionnaires d'évènements

La logique avec beaucoup de gestionnaires d'évènements sera très certainement plus complexe, par conséquent, garder votre JavaScript dans la valeur de l'attribut `v-on` ne sera tout simplement pas faisable. C'est pourquoi `v-on` peut aussi accepter le nom d'une méthode que vous voudriez appeler.

Par exemple :

``` html
<div id="example-2">
  <!-- `greet` est le nom de la méthode définie ci-dessous -->
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
      // `this` fait référence à l'instance de Vue à l'intérieur de `methods`
      alert('Bonjour ' + this.name + ' !')
      // `event` est l'évènement natif du DOM
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// vous pouvez également invoquer ces méthodes en JavaScript
example2.greet() // -> 'Bonjour Vue.js !'
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
      alert('Bonjour ' + this.name + ' !')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
{% endraw %}

## Méthodes appelées dans les valeurs d'attributs

Au lieu de lier directement la méthode par son nom dans l'attribut, nous pouvons également utiliser des méthodes dans une instruction JavaScript :

``` html
<div id="example-3">
  <button v-on:click="say('salut')">Dire salut</button>
  <button v-on:click="say('quoi')">Dire quoi</button>
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

Parfois nous avons également besoin d'accéder à l'évènement original du DOM depuis l'instruction dans l'attribut. Vous pouvez le passer à une méthode en utilisant la variable spéciale `$event` :

``` html
<button v-on:click="warn('Le formulaire ne peut être soumis pour le moment.', $event)">
  Soumettre
</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // maintenant nous avons accès à l'évènement natif
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## Modificateurs d'évènements

C'est un besoin courant que de faire appel ā `event.preventDefault()` ou `event.stopPropagation()` à l'intérieur d'une déclaration de gestionnaire d'évènements. Bien que nous puissions réaliser ceci aisément à l'intérieur des méthodes, il serait préférable que les méthodes restent purement dédiées à la logique des données au lieu d'avoir à gérer les détails des évènements du DOM.

Pour résoudre ce problème, Vue propose des modificateurs d'évènements pour `v-on`. Rappelez-vous que les modificateurs sont des suffixes de directives indiqués par un point.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`
- `.passive`

``` html
<!-- la propagation de l'évènement `click` sera stoppée -->
<a v-on:click.stop="doThis"></a>

<!-- l'évènement `submit` ne rechargera plus la page -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- les modificateurs peuvent être chainés -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- seulement le modificateur -->
<form v-on:submit.prevent></form>

<!-- utilise le mode « capture » lorsque l'écouteur d'évènements est ajouté -->
<!-- c.-à-d. qu'un évènement destiné à un élément interne est géré ici avant d'être géré par ses éléments parents -->
<div v-on:click.capture="doThis">...</div>

<!-- seulement déclenché si l'instruction `event.target` est l'élément lui-même -->
<!-- c.-à-d. que cela ne s'applique pas aux éléments enfants -->
<div v-on:click.self="doThat">...</div>
```

<p class="tip">L'ordre a de l'importance quand vous utilisez des modificateurs car le code est généré dans le même ordre. Aussi utiliser `v-on:click.prevent.self` va empêcher **tous les clics** alors que `v-on:click.self.prevent` va uniquement empêcher le clic sur l'élément lui-même.</p>

> Nouveau dans la 2.1.4+

``` html
<!-- l'évènement « click » sera déclenché au plus une fois -->
<a v-on:click.once="doThis"></a>
```

Au contraire des autres modificateurs, qui sont exclusifs aux évènements natifs du DOM, le modificateur `.once` peut également être utilisé pour les [évènements des composants](components.html#Using-v-on-with-Custom-Events). Si vous n'avez pas encore lu la section concernant les composants, ne vous en inquiétez pas pour le moment.

> Nouveau en 2.3.0+

Vue offre également un modificateur `.passive` correspondant à [l'option `passive` de `addEventListener`](https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener#Parameters).

``` html
<!-- le comportement par défaut de l'évènement de défilement se produit immédiatement, -->
<!-- au lieu d'attendre que `onScroll` soit terminé -->
<!-- au cas où il contienne `event.preventDefault()` -->
<div v-on:scroll.passive="onScroll">...</div>
```

Le modificateur `.passive` est particulièrement pratique pour améliorer les performances sur mobile.

<p class="tip">N'utilisez pas `.passive` et `.prevent` ensemble. `.passive` sera ignoré et votre navigateur va probablement vous montrer un message. Souvenez-vous, `.passive` communique au navigateur que vous _ne voulez pas_ prévenir le comportement de l'évènement par défaut.</p>

## Modificateurs de code des touches

Lorsque nous écoutons les évènements du clavier, nous avons régulièrement besoin de nous assurer du code des touches. Vue permet également d'ajouter un modificateur de touches pour `v-on`:

``` html
<!-- faire appel à +vm.submit()+ uniquement quand le code de la touche est `13` -->
<input v-on:keyup.13="submit">
```

Se rappeler tous les codes des touches est compliqué, c'est pourquoi Vue propose des alias pour les touches les plus couramment employées :

``` html
<!-- même exemple que le précédent -->
<input v-on:keyup.enter="submit">

<!-- fonctionne également pour les raccourcis -->
<input @keyup.enter="submit">
```

Voici la liste complète des raccourcis de modificateurs pour les touches :

- `.enter`
- `.tab`
- `.delete` (fonctionne pour les touches « Suppression » et « Retour arrière »)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

Vous pouvez également [définir des raccourcis personnalisés pour vos modificateurs](../api/#keyCodes) grâce à l'objet global `config.keyCodes` :

``` js
// active `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

## Modificateurs automatiques de touche clavier

> Nouveau dans la 2.5.0+

Vous pouvez également utiliser n'importe quel nom de touche clavier valide fourni par [`KeyboardEvent.key`](https://developer.mozilla.org/fr-FR/docs/Web/API/KeyboardEvent/key/Key_Values) en tant que modificateur en les écrivant au format kebab-case :

``` html
<input @keyup.page-down="onPageDown">
```

Dans l'exemple ci-dessus, le gestionnaire va uniquement être appelé si `$event.key === 'PageDown'`.

<p class="tip">Quelques raccourcis (`.esc` et les touches fléchées) ont des `key` différentes pour IE9. Vous devriez plutôt utiliser leurs alias fournis par la bibliothèque si vous souhaitez supporter IE9.</p>

## Modificateurs de touches système

> Nouveau dans la 2.1.0+

Vous pouvez utiliser les modificateurs suivants pour déclencher un évènement du clavier ou de la souris seulement lorsque la touche du modificateur correspondante est pressée :

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Note: Sur les claviers Macintosh, meta est la touche commande (⌘). Sur Windows, meta est la touche windows (⊞). Sur les claviers Sun Microsystems, meta est symbolisée par un diamant plein (◆). Sur certains claviers, spécifiquement sur les claviers des machines MIT et Lisp et leurs successeurs, comme le clavier « Knight » et « space-cadet », meta est écrit « META ». Sur les claviers Symboliques, meta est étiqueté « META » ou « Meta ».

Par exemple :

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

<p class="tip">Notez que ces modificateurs de raccourcis sont différents des modificateurs usuels utilisés avec l'évènement `keyup`, ils doivent être pressés quand l'évènement est émis. En d'autres mots, `keyup.ctrl` sera déclenché uniquement si vous relâchez une touche pendant que vous maintenez la touche `ctrl` enfoncée. Rien ne sera déclenché si vous relâchez uniquement la touche `Ctrl`. Si vous souhaitez un tel comportement, utilisez le `keyCode` pour `ctrl` à la place : `keyup.17`.</p>

### Modificateur `.exact`

> Nouveau dans la 2.5.0+

Le modificateur `.exact` permet le contrôle de la combinaison de touches système exacte requise pour déclencher le gestionnaire d'évènements.

``` html
<!-- ceci va aussi émettre un évènement si les touches Alt et Shift sont pressées -->
<button @click.ctrl="onClick">A</button>

<!-- ceci va émettre un évènement seulement si la touche Ctrl est pressée sans aucune autre touche -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- ceci va émettre un évènement si aucune touche n'est pressée -->
<button @click.exact="onClick">A</button>
```

### Modificateurs de boutons de la souris

> Nouveau dans la 2.2.0+

- `.left`
- `.right`
- `.middle`

Ces modificateurs n'autorisent la gestion de l'évènement que s'il a été déclenché par un bouton spécifique de la souris.

## Pourquoi des écouteurs dans le HTML ?

Vous pourriez être inquiet du fait que l'ensemble de cette approche d'écoute d'évènements viole la bonne vieille règle de la séparation des préoccupations. Rassurez-vous - puisque toutes les fonctions et expressions sont strictement liées au « ViewModel » qui gère la vue courante, cela ne causera aucune difficulté de maintenance. En réalité, il y a plusieurs avantages à utiliser `v-on` :

1. Il est plus facile de localiser l'implémentation des fonctions gestionnaires dans votre code JS en survolant le code HTML.

2. Comme vous n'avez pas à attacher manuellement les écouteurs dans votre JS, le code du « ViewModel » peut être purement logique et sans DOM. Ceci le rend plus facile à tester.

3. Quand un « ViewModel » est détruit, tous les écouteurs d'évènements sont automatiquement retirés. Vous n'avez pas à vous soucier de le faire vous-même.
