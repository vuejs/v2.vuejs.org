---
title: Lijst
type: guide
order: 8
---

## 'Array' koppelen aan elementen met `v-for`

Het is mogelijk om de 'directive' `v-for` te gebruiken om een lijst van items weer te geven gebaseerd op een 'array'. De 'directive' `v-for` vereist een speciale syntax in de vorm van `item in items`, waar `items` de oorsprong van de data is en `item` is een **alias** voor het element waarover momenteel geïtereerd wordt:

``` html
<ul id="voorbeeld-1">
  <li v-for="item in items">
    {{ item.bericht }}
  </li>
</ul>
```

``` js
var voorbeeld1 = new Vue({
  el: '#voorbeeld-1',
  data: {
    items: [
      { bericht: 'John' },
      { bericht: 'Duck' }
    ]
  }
})
```

Resultaat:

{% raw %}
<ul id="voorbeeld-1" class="demo">
  <li v-for="item in items">
    {{item.bericht}}
  </li>
</ul>
<script>
var voorbeeld1 = new Vue({
  el: '#voorbeeld-1',
  data: {
    items: [
      { bericht: 'John' },
      { bericht: 'Duck' }
    ]
  }
})
</script>
{% endraw %}

In een `v-for`-blok is er volledige toegang tot de eigenschappen van het element dat `v-for` implementeert. `v-for` ondersteunt een optioneel tweede argument voor de index van het huidige item.

``` html
<ul id="voorbeeld-2">
  <li v-for="(item, index) in items">
    {{ berichtVanBovenliggendElement }} - {{ index }} - {{ item.bericht }}
  </li>
</ul>
```

``` js
var voorbeeld2 = new Vue({
  el: '#voorbeeld-2',
  data: {
    berichtVanBovenliggendElement: 'Bericht van bovenliggend element',
    items: [
      { bericht: 'John' },
      { bericht: 'Duck' }
    ]
  }
})
```

Resultaat:

{% raw%}
<ul id="voorbeeld-2" class="demo">
  <li v-for="(item, index) in items">
    {{ berichtVanBovenliggendElement }} - {{ index }} - {{ item.bericht }}
  </li>
</ul>
<script>
var voorbeeld2 = new Vue({
  el: '#voorbeeld-2',
  data: {
    berichtVanBovenliggendElement: 'Bericht van bovenliggend element',
    items: [
      { bericht: 'John' },
      { bericht: 'Duck' }
    ]
  }
})
</script>
{% endraw %}

Er kan ook gebruik gemaakt worden van `of` in plaats van `in`, dit sluit dichter aan bij de syntax voor 'iterators' in JavaScript:

``` html
<div v-for="item of items"></div>
```

## `v-for` met een object

Het is mogelijk om met `v-for` te itereren door de eigenschappen van een object.

``` html
<ul id="v-for-object" class="demo">
  <li v-for="eigenschap in object">
    {{ eigenschap }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      voornaam: 'John',
      achternaam: 'Duck',
      leeftijd: 30
    }
  }
})
```

Resultaat:

{% raw %}
<ul id="v-for-object" class="demo">
  <li v-for="eigenschap in object">
    {{ eigenschap }}
  </li>
</ul>
<script>
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      voornaam: 'John',
      achternaam: 'Duck',
      leeftijd: 30
    }
  }
})
</script>
{% endraw %}

Het tweede argument kan gebruikt worden voor de sleutel:

``` html
<div v-for="(eigenschap, sleutel) in object">
  {{ sleutel }}: {{ eigenschap }}
</div>
```

{% raw %}
<div id="v-for-object-eigenschap-sleutel" class="demo">
  <div v-for="(eigenschap, sleutel) in object">
    {{ sleutel }}: {{ eigenschap }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-eigenschap-sleutel',
  data: {
    object: {
      voornaam: 'John',
      achternaam: 'Duck',
      leeftijd: 30
    }
  }
})
</script>
{% endraw %}

En een derde argument voor de index:

``` html
<div v-for="(eigenschap, sleutel, index) in object">
  {{ index }}. {{ sleutel }}: {{ eigenschap }}
</div>
```

{% raw %}
<div id="v-for-object-eigenschap-sleutel-index" class="demo">
  <div v-for="(eigenschap, sleutel, index) in object">
    {{ index }}. {{ sleutel }}: {{ eigenschap }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-eigenschap-sleutel-index',
  data: {
    object: {
      voornaam: 'John',
      achternaam: 'Duck',
      leeftijd: 30
    }
  }
})
</script>
{% endraw %}

<p class="tip">Bij het itereren over een object is de volgorde gebaseerd op de volgorde van de sleutels van `Object.keys()`, dit is **niet** gegarandeerd consistent over verschillende implementaties van JavaScript-'engines'.</p>

## `key`

Bij het bijwerken van een lijst van elementen die weergegeven worden door een `v-for` wordt standaard gebruik gemaakt van een 'in-place patch'-strategie. Wanneer de volgorde van de items wijzigt, dan zal niet het element in het DOM verplaatst worden, maar dan zal elk element ter plaatse wijzigen in de correcte waarde om weer te geven. Dit is gelijkaardige functionaliteit dat `track-by="$index"` voorziet in Vue 1.x.

Deze standaard functionaliteit is efficiënt, maar alleen bruikbaar **wanneer het weergegeven resultaat niet afhankelijk is van 'child'-componenten of een tijdelijke staat in het DOM (bv. waarden van een formulierveld)**.

Om aan Vue aan te geven dat het mogelijk is om alle 'nodes' individueel te volgen om vervolgens bestaande elementen te herbruiken en herschikken, moet er voor elk item een uniek `key`-attribuut toegekend worden. Een ideale waarde voor deze `key` is het unieke 'id' van elk item. Dit speciale attribuut is een ruw equivalent van `track-by` in 1.x, maar het werkt zoals een attribuut, er moet dus gebruik gemaakt worden van `v-bind` om de dynamische waarde te koppelen (er wordt hier gebruik gemaakt van de verkorte notatie):

``` html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

Het is aangeraden om een `key` te voorzien wanneer `v-for` gebruikt wordt. Tenzij dat de geïtereerde content in het DOM eenvoudig is van structuur of wanneer er met opzet vertrouwd wordt op het standaardgedrag voor betere prestaties.

Aangezien het een generiek mechanisme voor Vue is om 'nodes' te indentificieren, heeft `key` meerdere toepassingen die niet specifiek gekoppeld zijn aan `v-for`. Dit wordt later besproken.

<p class="tip">Gebruik geen niet-primitieve waarden zoals objecten en 'arrays' als sleutels voor `v-for`. Gebruik 'string'- of numerieke waarden in de plaats.</p>

## 'Array'-wijzigingsdetectie

### Mutatiemethodes

Vue omvat de mutatiemethodes van een geobserveerde 'array' zodat ze ook activeren bij het wijzigen van de weergave. De verpakte methodes zijn:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

De console kan geopend worden om met de `items` van de vorige voorbeelden te spelen. Bijvoorbeeld: `voorbeeld1.items.push({ bericht: 'Barry' })`.

### Een 'array' vervangen

Mutatiemethodes, zoals de naam doet vermoeden, muteert/wijzigt de originele 'array' waarop ze opgeroepen worden. Er zijn ook methodes die de 'array' niet muteren, bv. `filter()`, `concact()` en `slice()`, deze methodes **geven altijd een nieuwe 'array' terug**. Wanneer er met niet-muterende methodes gewerkt wordt, kan de oude 'array' altijd vervangen worden door de nieuwe 'array':

``` js
voorbeeld1.items = voorbeeld1.items.filter(function (item) {
  return item.bericht.match(/John/)
})
```

Sommigen zullen denken dat Vue het bestaande DOM weggooit en vervolgens de volledige lijst opnieuw zal genereren. Dit is gelukkig niet het geval. Vue implementeert enkele slimme heuristieken om het hergebruik van DOM-elementen te maximaliseren, het vervangen van een 'array' door een andere 'array' met overlappende objecten is dus een zeer efficiënte operatie.

### Valkuilen

Door de limitaties in JavaScript is Vue **niet capabel** om volgende wijzigen aan een 'array' te detecteren:

1. Wanneer een item direct toegekend wordt via de index, bv. `vm.items[indexVanItem] = nieuweWaarde`
2. Wanneer de lengte van de 'array' gewijzigd wordt, bv. `vm.items.length = nieuweLengte`

Bijvoorbeeld:

``` js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // is NIET reactief
vm.items.length = 2 // is NIET reactief
```

Om de eerste valkuil te voorkomen, kan onderstaande code gebruikt worden. Dit heeft hetzelfde resultaat als `vm.items[indexVanItem] = nieuweWaarde`, maar heeft als voordeel dat het reactief systeem de wijziging zal opmerken:

``` js
// Vue.set
Vue.set(vm.items, indexVanItem, nieuweWaarde)
```
``` js
// Array.prototype.splice
vm.items.splice(indexVanItem, 1, nieuweWaarde)
```

Het is ook mogelijk om de instantiemethode [`vm.$set`](https://vuejs.org/v2/api/#vm-set) te gebruiken, wat een alias is voor de globale `Vue.set`:

``` js
vm.$set(vm.items, indexVanItem, nieuweWaarde)
```

Om de tweede valkuil te voorkomen, kan gebruik gemaakt worden van `splice`:

``` js
vm.items.splice(nieuweLengte)
```

## Valkuilen van wijzigingsdetectie van een object

Opnieuw door limitaties van moderne JavaScript **kan Vue geen toevoegingen of verwijdering van eigenschappen detecteren**. Bijvoorbeeld:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` is reactief

vm.b = 2
// `vm.b` is NIET reactief
```

Vue staat niet toe om dynamisch nieuwe reactieve eigenschappen toe te voegen op de bestaande instantie. Het is wel mogelijk reactieve eigenschappen toe te kennen aan een genest object door gebruik te maken van `Vue.set(object, sleutel, eigenschap)`. Bijvoorbeeld:

``` js
var vm = new Vue({
  data: {
    profielVanGebruiker: {
      name: 'Anika'
    }
  }
})
```

Om een nieuwe eigenschap `leeftijd` toe te voegen aan het geneste object `profielVanGebruiker`, kan gebruik gemaakt worden van:

``` js
Vue.set(vm.profielVanGebruiker, 'leeftijd', 27)
```

Of met de alias `vm.$set`:

``` js
vm.$set(vm.profielVanGebruiker, 'leeftijd', 27)
```

Soms komt het voor dat er meerdere nieuwe eigenschappen toegekend moeten worden aan een bestaand object. Dit kan door gebruik te maken van `Object.assign()` of `_.extend()`. In deze gevallen is het best om een nieuwe object te maken met alle eigenschappen van beide objecten. Dus in plaats van:

``` js
Object.assign(vm.profielVanGebruiker, {
  leeftijd: 27,
  favorieteKleur: 'Vue groen'
})
```

Kunnen reactieve eigenschappen toegevoegd worden met:

``` js
vm.profielVanGebruiker = Object.assign({}, vm.profielVanGebruiker, {
  leeftijd: 27,
  favorieteKleur: 'Vue groen'
})
```

## Gefilterde/gesorteerde resultaten weergeven

Soms is het gewenst om een gefilterde of een gesorteerde versie van een 'array' weer te geven, zonder de 'array' te wijzigen of de originele data te resetten.

Bijvoorbeeld:

``` html
<li v-for="n in evenNummers">{{ n }}</li>
```

``` js
data: {
  nummers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNummers: function () {
    return this.nummers.filter(function (nummer) {
      return nummer % 2 === 0
    })
  }
}
```

In situaties waar berekende eigenschappen niet mogelijk zijn (bv. in een geneste `v-for`-loop), is het mogelijk een methode te gebruiken:

``` html
<li v-for="n in even(nummers)">{{ n }}</li>
```

``` js
data: {
  nummers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (nummers) {
    return nummers.filter(function (nummer) {
      return nummer % 2 === 0
    })
  }
}
```

## `v-for` met een bereik

`v-for` kan ook een geheel getal accepteren. In dit geval zal het de 'template' net zo vaak herhalen als de grootte van het getal.

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

Resultaat:

{% raw %}
<div id="bereik" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
  new Vue({ el: '#bereik' })
</script>
{% endraw %}

## `v-for` op een `<template>`

Net zoals `v-if` op een template, is het mogelijk om een `v-for` op een template te gebruiken om een blok van meerdere elementen weer te geven. Bijvoorbeeld:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="verdeler" role="presentation"></li>
  </template>
</ul>
```

## `v-for` met `v-if`

<p class="tip">Merk op dat het **niet** aangeraden is om `v-if` en `v-for` samen te gebruiken. Bekijk de [stijlgids](/v2/style-guide/#Vermijd-v-if-met-v-for-essentieel) voor meer details.</p>

Wanneer `v-for` en `v-if` op dezelfde 'node' bestaan, dan heeft `v-for` een hogere prioriteit dan `v-if`. Dit betekent dat de `v-if` op elke iteratie van de 'loop' toegepast zal worden, wat handig kan zijn in het geval dat er alleen iets weergegeven moet worden voor sommige items, zoals hieronder:

``` html
<li v-for="todo in todos" v-if="!todo.isVoltooid">
  {{ todo }}
</li>
```

Bovenstaande zal alleen de todos weergeven die nog niet voltooid zijn.

Wanneer het de bedoeling is om conditioneel een 'loop' over te slaan, dan kan een `v-if` geplaatst worden op een omvattend element (of [`<template>`](conditional.html#Conditionele-groepen-met-v-if-en-lt-template-gt)). Bijvoorbeeld:

``` html
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>Er zijn geen todos meer!</p>
```

## `v-for` met een component

> Deze sectie gaat uit van kennis over [componenten](components.html). Het is mogelijk om dit over te slaan en later terug te komen.

Het is mogelijk om `v-for` direct op een component te plaatsen, zoals bij alle normale elementen:

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> In 2.2.0+, wanneer `v-for` gebruikt wordt met een component, is het gebruik van een [`sleutel`](list.html#sleutel) vereist.

Dit zal niet automatisch data doorgeven aan de component. Componenten hebben een eigen geïsoleerde 'scope'. Om de geïtereerde data door te geven aan de component zullen eigenschappen gebruikt moeten worden:

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

De reden dat `item` niet automatisch geïnjecteerd wordt in de component is dat het zorgt voor een strikte koppeling tussen de component en hoe `v-for` werkt. Expliciet zijn over waar de data vandaan komt, maakt de component herbruikbaar in andere situaties.

Dit is een compleet voorbeeld van een simpele todolijst:

``` html
<div id="todo-lijst-voorbeeld">
  <form v-on:submit.prevent="nieuweTodoToevoegen">
    <label for="nieuwe-todo">Todo toevoegen</label>
    <input
      v-model="nieuweTodoTekst"
      id="nieuwe-todo"
      placeholder="bv. Kat eten geven"
    >
    <button>Toevoegen</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:sleutel="todo.id"
      v-bind:title="todo.titel"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

<p class="tip">Merk op dat het `is="todo-item"`-attribuut nodig is in DOM 'templates'. Dit is omdat alleen een `<li>`-element geldig is in een `<ul>`. Het doet hetzelfde als `<todo-item>`, maar werkt om een potentieel probleem heen. Bekijk [Valkuilen van DOM 'template parsing'](components.html#Valkuilen-van-DOM-'template'-'parsing') om meer te leren.</p>

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ titel }}\
      <button v-on:click="$emit(\'verwijderen\')">Verwijderen</button>\
    </li>\
  ',
  props: ['titel']
})

new Vue({
  el: '#todo-lijst-voorbeeld',
  data: {
    nieuweTodoTekst: '',
    todos: [
      {
        id: 1,
        titel: 'Afwas doen',
      },
      {
        id: 2,
        titel: 'Vuilnis buitenzetten',
      },
      {
        id: 3,
        titel: 'Grasmaaien'
      }
    ],
    volgendTodoId: 4
  },
  methods: {
    nieuweTodoToevoegen: function () {
      this.todos.push({
        id: this.volgendTodoId++,
        titel: this.nieuweTodoTekst
      })
      this.nieuweTodoTekst = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-voorbeeld" class="demo">
  <form v-on:submit.prevent="nieuweTodoToevoegen">
    <label for="nieuwe-todo">Todo toevoegen</label>
    <input
      v-model="nieuweTodoTekst"
      id="nieuwe-todo"
      placeholder="bv. Kat eten geven"
    >
    <button>Toevoegen</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:sleutel="todo.id"
      v-bind:title="todo.titel"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ titel }}\
      <button v-on:click="$emit(\'verwijderen\')">Verwijderen</button>\
    </li>\
  ',
  props: ['titel']
})

new Vue({
  el: '#todo-list-voorbeeld',
  data: {
    nieuweTodoTekst: '',
    todos: [
      {
        id: 1,
        titel: 'Afwas doen',
      },
      {
        id: 2,
        titel: 'Vuilnis buitenzetten',
      },
      {
        id: 3,
        titel: 'Grasmaaien'
      }
    ],
    volgendTodoId: 4
  },
  methods: {
    nieuweTodoToevoegen: function () {
      this.todos.push({
        id: this.volgendTodoId++,
        title: this.nieuweTodoTekst
      })
      this.nieuweTodoTekst = ''
    }
  }
})
</script>
{% endraw %}
