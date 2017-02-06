---
title: Event Handling
type: guide
order: 9
---

## Ecoute des événements

Nous pouvons utiliser l'instruction `v-on` pour écouter les événements du DOM afin d'éxécuter des scripts Javascript lorsque ces événements surviennent.

Par example:

``` html
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>Le boutton ci-dessus à été cliqué {{ counter }} fois.</p>
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

Resultat:

{% raw %}
<div id="example-1" class="demo">
  <button v-on:click="counter += 1">Add 1</button>
  <p>Le boutton ci-dessus à été cliqué {{ counter }} fois.</p>
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

## Gestionnaire de Méthodes pour "les Evénements"

La logique pour beaucoup des gestionnaires d'événements sera très certainement plus compliqué, par consequence, garder vos valeurs dans l'attribu `v-on` ne sera pas possible. C'est pour cette raison que `v-on` peut également accepter que vous nommiez vos méthodes comme vous le souhaitez.      

For exemple:

``` html
<div id="example-2">
  <!-- `greet` est le nom de la méthode defini ce-dessous-->
  <button v-on:click="greet">Greet</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // defini les méthodes sous l'objet `methods`
  methods: {
    greet: function (event) {
      // `this` à l'intérieur de l'objet methods se réfère à l'instance de Vue.
      alert('Hello ' + this.name + '!')
      // `event` est un événement natif du DOM
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// vous pouvez également invoqué ces méthodes en Javscript
example2.greet() // -> 'Hello Vue.js!'
```

Resultat:

{% raw %}
<div id="example-2" class="demo">
  <button v-on:click="greet">Salutation</button>
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

## Gestionnaire de Méthodes "En-ligne":

Au lieu de lier directement la méthode à un nom, nous pouvons également utiliser la méthode avec une declaration Javascript dans la ligne:

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

Result:
{% raw %}
<div id="example-3" class="demo">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
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

Parfois, nous avons également besoin, avec les déclarations en ligne, d'accéder aux événements du DOM. Vous pouvez réaliser ceci en utilisant la variable speciale `$event`:

``` html
<button v-on:click="avertissement('Le formulaire ne peut être soumit pour le moment.', $event)">Soumettre</button>
```

``` js
// ...
methods: {
  avertissement: function (message, event) {
    // now we have access to the native event
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## Modifieurs "Events"

C'est un besoin courant que de faire appel ā `event.preventDefault()` ou `event.stopPropagation()` à l'intérieur d'une déclaration d'événements. Bien que nous puissions realiser ceci aisément à l'intérieur de "Methods", il aurait été préférable que "Methods" reste purement dedié à la logique des données au lieu d'avoir à prendre en charge les éléments du DOM>

Pour resoudre ce problème, Vue propose des modifieurs d'événement à `v-on`. Evoquer ces modifieurs se fait grâce aux extensions d'instruction, ceux-ci commençant par un point.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

``` html
<!-- la propagation de l'événement du clic sera stoppé -->
<a v-on:click.stop="faisCeci"></a>

<!-- l'événement submit, ne rechargera plus la page -->
<form v-on:submit.prevent="Soumettre"></form>

<!-- les modifieurs peuvent être chainés -->
<a v-on:click.stop.prevent="faisCela"></a>

<!-- seulement le modifieur -->
<form v-on:submit.prevent></form>

<!-- utilise le mode "capture" lorsque l'événement d'écoute est ajouté -->
<div v-on:click.capture="faisCeci">...</div>

<!-- seulement déclanché si l'instruction "event.target" est l'élément lui même.-->
<!-- note : ne s'applique pas aux éléments "enfant" -->
<div v-on:click.self="faisCeci">...</div>
```

> New in 2.1.4

``` html
<!-- l'événement "click" sera déclenché au moins une fois -->
<a v-on:click.once="faisCeci"></a>
```

Au contraire des autres modifieurs, qui sont exclusifs aux événement natif du DOM, le modifieur `.once` peut également être utilisé pour les [component events](components.html#Using-v-on-with-Custom-Events). Si vous n'avez pas encore lu la section concernant les composants, ne vous en inquitez pas pour le moment.

## Modifieurs "key" (Touches)
Lorsque nous écoutons les événements du clavier, nous avons regulièrement besoin de s'assurer des codes des touches. Vue permet également d'ajouter un modifieur de touches pour `v-on`:

``` html
<!-- faire appel à vm.submit() quand le code touche est 13 seulement -->
<input v-on:keyup.13="submit">
```

Rappelez vous que les codes des touches sont disputés, c'est pourquoi Vue propose des alias pour ceux courament employés.

``` html
<!-- même exemple que le précédent -->
<input v-on:keyup.enter="submit">

<!-- fonctionne également pour les raccourcis -->
<input @keyup.enter="submit">
```

Voici une liste complète des raccourci clavier "modifieurs"

- `.enter`
- `.tab`
- `.delete` (fonctionne pour les touches "Suppression" et "retour-arrière")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

Vous pouvez également [definir des raccourci personnalisé pour vos "modifieurs" ](../api/#keyCodes) grâce à l'objet global `config.keyCodes`:

``` js
// active v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

## Modifieurs "key" (Touches)

> New in 2.1.0

Vous pouvez utiliser les modifieurs suivants pour déclancher un événement du clavier ou de la souris seulement lorsque la touche du modifieur est appuyé :

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Note: Sur les claviers Macintosh, meta est la touche commande (⌘). Sur Windows, meta est la touche windows (⊞). Sur les claviers Sun Microsystems, meta est symbolisé par un diamant plein (◆). Sur certain clavier, spécifiquement sur les claviers des machines MIT et Lisp et leurs successeurs, comme le clavier "Knight" et "space-cadet", meta est ecrit "META". Sur les claviers Symboliques, meta est etiqueté "META" ou "Meta".

Par exemple:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

## Pourquoi des écoutes dans le code HTML ?

Vous pouriez être preoccupé que tous ces événements d'écoutes viole la bonne vieille règle de la separation des problèmes.
Rassurez-vous - depuis que le gestionnaire de fonctions et d'expressions est strictement lié à "ViewModel"  qui gère la vue courante, cela ne causera aucune difficulté de maintenance. En realité, il y a plusieurs bénéfices à utiliser `v-on` :

1. Il est plus facile de localiser l'implementation des functions dans le gestionnaire de code JS en survolant le code HTML.

2. Comme vous n'avez pas à attacher manuellement les écoutes dans votre JS, le code du "ViewModel" peut-être purement logique et sans DOM. Ceci rend plus facile les tests.

3. Quand un "ViewModel est detruit, tout les evenements d'ecoutes sont automatiquenemt retiré". Vous n'aveez pas à vous soucier de le faire vous meme.
