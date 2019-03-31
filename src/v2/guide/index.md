---
title: Introductie
type: guide
order: 2
---

## Wat is Vue?

Vue (uitgesproken /vjuː/) is een **progressief 'framework'** voor het bouwen van gebruikersinterfaces. In tegenstelling tot andere monolithische 'frameworks', is Vue vanaf de grond af aan opgebouwd om incrementeel aanpasbaar te zijn. De kernfunctionaliteit is alleen geconcentreerd op de weergavelaag en is makkelijk op te pikken en te integreren met bestaande projecten. Aan de andere kant is Vue ook perfect in staat om geavanceerde 'Single-Page Applications' aan te drijven in combinatie met [moderne 'tooling'](single-file-components.html) en [ondersteunende 'libraries'](https://github.com/vuejs/awesome-vue#components--libraries).

Er is een <a id="modal-player"  href="#">video gemaakt</a> om door de basisprincipes en een voorbeeldproject te gaan om eerst meer te leren over Vue.

Om te weten hoe Vue werkt vergeleken met andere 'libraries'/'frameworks', bekijk [vergelijking met andere 'frameworks'](comparison.html).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Gratis Vue.js-cursus">Bekijk een gratis videocursus op Vue Mastery</a></div>

## Aan de slag

<p class="tip">De officiële gids gaat uit van een intermediair niveau van kennis over HTML, CSS en JavaScript. Indien er volledig vanaf nul gestart wordt met frontendontwikkeling, dan is het misschien niet het beste idee om direct met een 'framework' te beginnen als eerste stap — zorg dat er een basiskennis is en kom dan terug! Ervaring met andere 'frameworks' helpt, maar is niet noodzakelijk.</p>

De makkelijkste manier om Vue uit te proberen is door [JSFiddle 'Hello World'-voorbeeld](https://jsfiddle.net/chrisvfritz/50wL7mdz/) te gebruiken. Meevoglen kan door het in een ander tabblad te openen terwijl er door de basisvoorbeelden gegaan wordt. Of maak <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer">een <code>index.html</code>-bestand</a> en voeg Vue toe door:

``` html
<!-- ontwikkelaarsversie, bevat behulpzame consolewaarschuwingen (Engels) -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

of:

``` html
<!-- productieversie, geoptimaliseerd qua grootte en snelheid -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

De [Installatie](installation.html)-pagina bevat meer manieren om Vue te installeren. Let op: Het is **niet** aangeraden dat beginners starten met `vue-cli`, zeker wanneer er nog geen ervaring is met Node.js gebaseerde 'tooling' om applicaties te bouwen.

## Declaratieve weergave

De kern van Vue is een systeem dat het mogelijk maakt om declaratief data weer te geven naar het DOM met duidelijke 'template'-syntax:

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hallo Vue!'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hallo Vue!'
  }
})
</script>
{% endraw %}

De eerste Vue-applicatie is gemaakt! Dit lijkt veel op het weergeven van een 'string template', maar Vue heeft veel werk gedaan dat niet zichtbaar is. De data en het DOM zijn gelinkt aan elkaar en alles is **reactief**. Hoe kun je dit testen? Open in deze browser de JavaScript-console (F12) en zet `app.message` naar een andere waarde. Het voorbeeld vanboven zal de wijziging meteen doorvoeren.


Bovenop tekstinterpolatie (dit is het gebruik van de dubbele gekrulde haakjes '{' '}' om een variabele te koppelen aan de HTML), kunnen we ook attributen van elementen koppelen:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Hang met de cursor boven dit element voor een paar seconden om de dynamisch gekoppelde titel te zien!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Deze pagina is geladen op ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Hang met de cursor boven dit element voor een paar seconden om de dynamisch gekoppelde titel te zien!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Deze pagina is geladen op ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Dit toont iets nieuw. Het `v-bind`-attribuut wordt een **'directive'** genoemd. 'Directives' worden altijd voorafgegaan met `v-` om aan te geven dat het gaat om een speciaal attribuut dat voorzien wordt door Vue. Dit voorziet reactief gedrag naar de weergegeven DOM. Wat hier getoond wordt kan gelezen worden als "hou de `title` van dit attribuut up-to-date met de `message`-eigenschap van de Vue-instantie".

Open de JavaScript-console opnieuw en geef `app2.message = 'nieuw bericht'` in, dit zal het `title`-attribuut bijwerken (ga boven het element hangen met de cursor om de aangepaste waarde te zien).

## 'Conditionals' en 'loops'

'Conditionals' zijn voorwaarden waar aan voldaan moet worden. 'Loops' zijn lussen, code die uitgevoerd blijft worden zolang er aan een bepaalde voorwaarde voldaan wordt.

Het is makkelijk om de aanwezigheid van een element aan te passen:

``` html
<div id="app-3">
  <span v-if="seen">Nu is het zichtbaar</span>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Nu is het zichtbaar</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Voer `app3.seen = false` in de console in. Het bericht zou nu moeten verdwijnen. `app3.seen = true` zal het bericht terug doen verschijnen.

Dit voorbeeld toont aan dat er niet alleen data gekoppeld kan worden aan tekst en attributen, maar ook aan de **structuur** van het DOM. Vue voorziet ook een krachtig systeem van overgangseffecten dat automatisch [overgangseffecten](transitions.html) kan toepassen wanneer elementen toegevoegd/bijgewerkt/verwijderd worden door Vue.

Er zijn verschillende andere 'directives', elk met eigen speciale functialiteit. Bijvoorbeeld, de 'directive' `v-for` kan gebruikt worden om een lijst van items weer te geven:

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Leer JavaScript' },
      { text: 'Leer Vue' },
      { text: 'Leer John Duck kennen' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Leer JavaScript' },
      { text: 'Leer Vue' },
      { text: 'Leer John Duck kennen' }
    ]
  }
})
</script>
{% endraw %}

In de console, voer `app4.todos.push({ text: 'New item' })` in. Er zou een nieuw item toegevoegd moeten worden aan de lijst.

## Omgaan met gebruikersinput

Om gebruikers interactie met de applicatie te laten voeren, kan gebruik gemaakt worden van de 'directive' `v-on` om te luisteren naar evenementen. De evenementen zullen methoden oproepen op de Vue-instantie:

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Bericht omkeren</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hallo Vue!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Bericht omkeren</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hallo Vue!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Merk op dat in de methode de staat van de applicatie wordt bijgewerkt zonder dat het DOM aangeraakt wordt. Alle DOM-manipulaties worden verwerkt door Vue en de code die geschreven wordt, focust op de onderliggende logica.

Vue voorziet ook de 'directive' `v-model` dat 'two-way binding' (een aanpassing aan een variabele zal doorgevoerd worden naar de HTML, een aanpassing in de HTML zal doorgevoerd worden naar de variabele) makkelijk maakt:

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hallo Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hallo Vue!'
  }
})
</script>
{% endraw %}

## Componeren met componenten

Het componentsysteem is een belangrijkt concept in Vue. Deze abstractie zorgt ervoor dat het bouwen van grootschalige applicaties, bestaande uit kleine, autonome en vaak herbruikbare componenten. Wanneer er naar een interface van een applicatie gekeken wordt, kan bijna alles geabstraheerd worden naar een boom van componenten:

![componentenboom](/images/components.png)

In Vue, een component is in essentie een Vue-instantie met voorgedefinieerde opties. Een component registreren in Vue: 

``` js
// Maak een nieuwe componenten, genaamd 'todo-item'
Vue.component('todo-item', {
  template: '<li>Dit is een todo</li>'
})
```

Dit kan gebruikt worden in de 'template' van een ander component:

``` html
<ol>
  <!-- Maak een instantie aan van de 'todo-item'-component -->
  <todo-item></todo-item>
</ol>
```

Dit zou dezelfde tekst weergeven voor elke todo. Om dit te voorkomen moet er data doorgegeven worden van de 'parent scope' naar de 'child'-componenten. Pas de definitie van de component aan zodat het een [prop](components.html#Props) accepteert:

``` js
Vue.component('todo-item', {
  // De 'todo-item'-component accepteert nu een
  // "prop", dit kan vergeleken worden met een speciaal attribuut.
  // Deze prop noemt 'todo'.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Dit maakt het mogelijk om per todo verschillende tekst mee te geven door gebruik te maken van `v-bind`:

``` html
<div id="app-7">
  <ol>
    <!--
      Elk 'todo-item' wordt voorzien van het object dat het
      moet voorstellen. Dit maakt de inhoud dynamisch.
      Elke component moet ook voorzien worden van een "key",
      dit wordt later uitgelegd.
    -->
    <todo-item
      v-for="item in boodschappenlijst"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    boodschappenlijst: [
      { id: 0, text: 'Groenten' },
      { id: 1, text: 'Kaas' },
      { id: 2, text: 'Wat John Duck graag eet' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in boodschappenlijst" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    boodschappenlijst: [
      { id: 0, text: 'Groenten' },
      { id: 1, text: 'Kaas' },
      { id: 2, text: 'Wat John Duck graag eet' }
    ]
  }
})
</script>
{% endraw %}

Dit is een geforceerd voorbeeld, maar het is gelukt om de applicatie op te delen in twee kleinere onderdelen. De 'child'-component is redelijk goed ontkoppeld van de 'parent'-component door gebruik te maken van de 'props'-interface. De `<todo-item>`-component kan verder ontwikkeld worden met ingewikkeldere logica zonder de 'parent'-applicatie te beïnvloeden.

In een grote applicatie is het nodig om de volledige applicatie op te delen in componenten om te zorgen dat het ontwikkelen handelbaar blijft. Er zal [later in de gids](components.html) nog meer gesproken worden over componenten, maar dit toont een (verzonnen) voorbeeld van hoe een 'template' van een applicatie er uit zou kunnen zien met verschillende componenten:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Relatie tot 'custom elements'

Vue-componenten zijn zeer gelijkend op **'Custom Elements'**, deze maken uit van de ['Web Components Spec'](https://www.w3.org/wiki/WebComponents/). Dit komt omdat de componenten van Vue lichtjes gemodelleerd zijn naar de 'spec'. Bijvoorbeeld, Vue-componenten implementeren de [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) en het speciale `is`-attribuut. Er zijn wel belangrijke verschillen:

1. De 'Web Components Spec' is gefinaliseerd, maar is niet geïmplementeerd in elke browser. Safari 10.1+, Chrome 54+ en Firefox 63+ ondersteunen webcomponenten. Ter vergelijking, Vue-componenten vereisen geen 'polyfills' en hebben hetzelfde gedrag in alle ondersteunde browsers (IE9 en hoger). Indien nodig kan een Vue-component in een 'custom element' gestoken worden.

2. Vue-componenten voorzien belangrijke functionaliteit die niet beschikbaar is in 'custom elements', zoals de 'cross-component data flow', 'custom event'-communicatie en 'buid tool'-integraties.

Hoewel Vue intern geen gebruik maakt van 'custom elements', het heeft wel [grote interoperabiliteit](https://custom-elements-everywhere.com/#vue) als het aankomt op het consumeren of verdelen van 'custom elements'. Vue CLI biedt ook ondersteuning voor het maken van Vue-componenten die zichzelf registreren als 'custom elements'.

## Klaar voor meer?

Dit was de korte introductie van de basisfunctionaliteit voor de kern van Vue, de rest van de gids zal deze en meer geavanceerde functionaliteit omschrijven in groter detail. Lees zeker alle documentatie!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Video door <a href="https://www.vuemastery.com" target="_blank" rel="noopener" title="Vue.js-cursussen op Vue Mastery">Vue Mastery</a>. Bekijk de gratis <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Vue.js-cursussen op Vue Mastery">Intro to Vue course</a> van Vue Mastery.</div>
