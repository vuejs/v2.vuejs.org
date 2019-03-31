---
title: De Vue-instantie
type: guide
order: 3
---

## Een Vue-instantie maken

Alle Vue-applicaties beginnen met het aanmaken van een nieuwe **Vue-instantie** met de `Vue`-functie:

```js
var vm = new Vue({
  // opties
})
```

Ook al is het niet strikt geassocieerd met het [MVVM-patroon](https://en.wikipedia.org/wiki/Model_View_ViewModel), het design van Vue is er wel deels door geïnspireerd. Als conventie wordt er vaak gebruik gemaakt van de variabele `vm` (afkorting voor ViewModel) om te verwijzen naar de Vue-instantie.

Bij het aanmaken van een Vue-instantie, wordt er een **object met opties** doorgegeven aan de instantie. Het overgrote deel van deze gids beschrijft hoe deze opties gebruikt kunnen worden om een gewenst resultaat te bekomen. Ter referentie is de volledige lijst met opties terug te vinden in de [API-referentie](../api/#Opties-Data).

Een Vue-applicatie bestaat uit een **root Vue-instantie** gemaakt met `new Vue`, optioneel georganiseerd in een boomstructuur van geneste, herbruikbare componenten. Bijvoorbeeld, een boomstructuur van een todo-applicatie zou er zo uit kunnen zien:

```
Root Instance
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

Later wordt er in detail over [het componentensysteem](components.html) gesproken. Voorlopig is het voldoende om te weten dat alle Vue-componenten ook Vue-instanties zijn en zullen hetzelfde object met opties accepteren (op een paar root-specifieke opties na).

## Data en methoden

Wanneer een Vue-instantie gemaakt is, voegt het alle eigenschappen die terug te vinden zijn in het `data`-object toe aan het **reactief systeem** van Vue. Wanneer de waarden van deze eigenschappen wijzigen, zal de view reageren op deze wijzigingen en zorgen dat de wijzigingen doorgevoerd worden.

```js
// Het data-object
var data = { a: 1 }

// Het object wordt toegevoegd aan de Vue-instantie
var vm = new Vue({
  data: data
})

// Opvragen van de eigenschap op de instantie
// geeft de waarde van de originele data terug
vm.a == data.a // => true

// Een nieuwe waarde zetten op de instantie
// beïnvloedt ook de originele data
vm.a = 2
data.a // => 2

// ... en vice-versa
data.a = 3
vm.a // => 3
```

Wanneer deze data wijzigt, zal de 'view' wijzigen. Een belangrijke opmerking is dat de eigenschappen in `data` alleen **reactief** zijn indien ze bestaan op het moment dat de instantie wordt aangemaakt. Dit betekent dat het aanmaken van een nieuwe eigenschap, zoals:

```js
vm.b = 'hi'
```

De wijzigingen aan `b` zullen niet zorgen voor het wijzigen van de 'view'. Wanneer een eigenschap nodig gaat zijn in de toekomst, maar initieel leeg of onbestaand is, dan kan een initiële waarde meegegeven worden. Bijvoorbeeld:

```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

De enige uitzondering hierop is het gebruik van `Object.freeze()`, dit voorkomt wijzigingen van bestaande eigenschappen, dit betekent ook dat het reactief systeem geen wijzigingen kan _opvolgen_.

```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- `foo` wordt niet bijgewerkt! -->
  <button v-on:click="foo = 'baz'">Wijzigen</button>
</div>
```

Bovenop data-eigenschappen worden er verschillende nuttige instantie-eigenschappen en -methoden blootgesteld. Deze worden voorafgegaan door een `$` om een verschil weer te geven met eigenschappen gedefinieerd door gebruikers. Bijvoorbeeld:

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch is een methode van de instantie
vm.$watch('a', function (newValue, oldValue) {
  // Deze 'callback' wordt uitgevoerd wanneer `vm.a` wijzigt
})
```

Later is het mogelijk om de [API-referentie](../api/#Instance-Properties) te raadplegen voor een volledige lijst van instantie-eigenschappen en -methoden.

## 'Lifecycle hooks' van de instantie

Alle Vue-instanties gaan door een reeks van initialisatiestappen wanneer ze aangemaakt worden. Bijvoorbeeld, opzetten van data-observatie, 'template' compileren, de instantie aan het DOM koppelen, het DOM wijzigen wanneer de data wijzigt. Gedurende het bestaan van de instantie worden er functies uitgevoerd, genaamd **lifecycle hooks**, hiermee kan een gebruiker eigen code toevoegen op specifieke momenten.

Bijvoorbeeld, de '[`created`](../api/#created) hook' kan gebruikt worden om code uit te voeren nadat een instantie gemaakt is:

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` verwijst naar een Vue-instantie
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

Er bestaan ook andere 'hooks' die op verschillende momenten van de levensduur van een instantie worden opgeroepen, zoals [`mounted`](../api/#mounted), [`updated`](../api/#updated), en [`destroyed`](../api/#destroyed). Alle 'lifecycle hooks' worden opgeroepen waarbij `this` verwijst naar de context van de Vue-instantie die de functie aanroept.

<p class="tip">Gebruik geen ['arrow'-functies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) op een eigenschap van een optie of 'callback', zoals `created: () => console.log(this.a)` of `vm.$watch('a', newValue => this.myMethod())`. Een 'arrow'-functie heeft geen `this`, `this` zal behandeld worden als alle andere variabelen en opgezocht worden via 'parent scopes' totdat het gevonden wordt. Dit resulteert vaak in foutmeldingen zoals `Uncaught TypeError: Cannot read property of undefined` of `Uncaught TypeError: this.myMethod is not a function`.</p>

## 'Lifecycle'-diagram

Hieronder is een diagram te zien voor de levenscyclus van een instantie. Het is niet nodig om op dit moment alles te begrijpen, het is een goede referentie voor later.

![De levenscyclus van een Vue-instantie](/images/lifecycle.png)
