---
title: Template-syntax
type: guide
order: 4
---

Vue gebruikt een op HTML gebaseerde 'template'-syntax dat toelaat om declaratief het weergegeven DOM te koppelen aan de onderliggende data van de Vue-instantie. Alle Vue-'templates' zijn geldige HTML dat geparst kan worden door HTML-parsers en browsers die voldoen aan de specificaties.

Op de achtergrond compileert Vue alle 'templates' in virtuele DOM-weergavefuncties. Gecombineerd met het reactief systeem is Vue slim genoeg het minimale aantal componenten om te verversen te bepalen en het minimale aantal van DOM-manipulaties uit te voeren wanneer de staat van de applicatie wijzigt.

Indien er genoeg kennis is omtrent de concepten van het virtuele DOM en de voorkeur gaat naar de ruwe kracht van JavaScript, dan is het mogelijk om [direct weergavefuncties te schrijven](render-function.html) in plaats van 'templates', met optionele JSX-support.

## Interpolatie

### Tekst

De meest eenvoudige vorm van datakoppeling is tekstinterpolatie door gebruik van de 'Mustache'-syntax (dubbele gekrulde haakjes):

``` html
<span>Bericht: {{ msg }}</span>
```

De 'mustache'-tag zal vervangen worden met de waarde van de `msg`-eigenschap op het bijhorende data-object. Het zal ook bijgewerkt worden wanneer de `msg`-eigenschap van het data-object wijzigt.

Het uitvoeren van eenmalige interpolaties die niet bijgewerkt worden wanneer data wijzigt, is mogelijk door gebruik te maken van de [v-once directive](../api/#v-once). Dit kan invloed hebben op andere gekoppelde data op dezelfde 'node':

``` html
<span v-once>Dit zal nooit wijzigen: {{ msg }}</span>
```

### Raw HTML

De dubbele gekrulde haakjes interpreteert de data als gewone tekst, niet als HTML, de `v-html` 'directive' moet hier gebruikt worden om de HTML in de eigenschap 'rawHtml' correct te interpreteren:

``` html
<p>Met 'mustaches': {{ rawHtml }}</p>
<p>Met 'v-html'-directive: <span v-html="rawHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>Met 'mustaches': {{ rawHtml }}</p>
  <p>Met 'v-html'-directive: <span v-html="rawHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
    return {
      rawHtml: '<span style="color: red">Dit zou rood moeten zijn.</span>'
    }
  }
})
</script>
{% endraw %}

De inhoud van de `span` zal vervangen worden met de waarde van de `rawHtml`-eigenschap, geïnterpreteerd als normale HTML en gekoppelde data wordt genegeerd. Merk op dat `v-html` niet gebruikt kan worden om 'template partials' te maken, aangezien Vue geen 'string'-gebaseerde 'template engine' is. Componenten krijgen de voorkeur als basiseenheid voor hergebruik en opbouw van de gebruikersinterface.

<p class="tip">Dynamisch weergeven van willekeurige HTML op de website kan zeer gevaarlijk zijn, het kan leiden tot [XSS-zwakheden](https://en.wikipedia.org/wiki/Cross-site_scripting). Gebruik HTML-interpolatie (v-html) alleen op betrouwbare inhoud en **nooit** op inhoud voorzien door een gebruiker.</p>

### Attributen

'Mustaches' kunnen niet gebruikt worden in HTML-attributen. Om data te koppelen, gebruik een [v-bind 'directive'](../api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

In geval van een attribuut van het type 'boolean', waarbij het bestaan ervan `true` betekent, werkt `v-bind` anders. In dit voorbeeld:

``` html
<button v-bind:disabled="isKnopUitgeschakeld">Knop</button>
```

Als `isKnopUitgeschakeld` de waarde `null`, `undefined`, of `false` heeft, dan zal het `disabled`-attribuut niet worden inbegrepen in het `<button>`-element.

### JavaScript-expressies gebruiken

Tot nu toe zijn er alleen simpele eigenschappen gekoppeld aan de 'template'. Vue laat toe om alle JavaScript-expressies te gebruiken in alle koppelingen met data:

``` html
{{ nummer + 1 }}

{{ ok ? 'JA' : 'NEE' }}

{{ boodschap.split('').reverse().join('') }}

<div v-bind:id="'lijst-' + id"></div>
```

Deze expressie zal geëvalueerd worden als JavaScript in de in de 'scope' van de Vue-instantie waarin de expressie zich bevindt. Een beperking is dat elke koppeling **één expressie** kan bevatten, het volgende zal **NIET** werken:

``` html
<!-- dit is een 'statement', geen expressie: -->
{{ var a = 1 }}

<!-- gebruik van een if-'statement' werkt niet, gebruik een ternaire expressie 
     een ternaire expressie is het gebruik van '?' en ':' i.p.v. 'if' en 'else'
     zie het voorbeeld bovenaan met 'JA' en 'NEE' -->
{{ if (ok) { return boodschap } }}
```

<p class="tip">'Template'-expressies hebben alleen toegang tot globale logica zoals `Math` en `Date`. Het is niet mogelijk om zelf gedefinieerde globale logica te koppelen aan `template`-expressies.</p>

## 'Directives'

'Directives' zijn speciale attributen met een `v-`-voorvoegsel. Waarden van een 'directive'-attribuut worden verwacht **een enkele JavaScript-expressie** te zijn (met als uitzondering `v-for`, dit wordt later bekeken). De taak van een 'directive' is om aanpassingen door te voeren aan het DOM wanneer de waarde van de expressie wijzigt. Een voorbeeld uit de introductie:

``` html
<p v-if="gezien">Nu is het zichtbaar</p>
```

De `v-if` 'directive' zal op basis van de waarde van `gezien` het `<p>`-element verwijderen of toevoegen.

### Argumenten

Sommige 'directives' accepteren een argument, aangegeven door een dubbelpunt achter de naam van de 'directive'. Bijvoorbeeld, de `v-bind` 'directive' wordt gebruikt om een HTML-attribuut reactief bij te werken:

``` html
<a v-bind:href="url"> ... </a>
```

Het argument `href` vertelt de `v-bind` 'directive' om het `href`-attribuut van het element te koppelen aan de waarde van de `url`-expressie.

De `v-on` 'directive' is een ander voorbeeld dat naar DOM-'event'en luistert:

``` html
<a v-on:click="doIets"> ... </a>
```

Het argument `click` is de naam van het 'event' waar naar geluisterd wordt. Later wordt het afhandelen van 'event'en behandelt.

### Dynamische argumenten

> Nieuw in 2.6.0+

Vanaf versie 2.6.0 is het mogelijk om JavaScript-expressies te gebruiken in het argument van een 'directive' door vierkante haken rondom het argument te plaatsen:

``` html
<a v-bind:[attribuutNaam]="url"> ... </a>
```

`attribuutNaam` zal dynamisch geëvalueerd worden als een JavaScript-expressie en de waarde na evaluatie zal gebruikt worden als waarde voor het argument. Bijvoorbeeld, als de Vue-instantie een data-eigenschap heeft `attribuutNaam`, waarvan de waarde `"href"` is, dan zal het resultaat gelijk zijn aan `v-bind:href`.

Op deze manier is het ook mogelijk om functies te koppelen aan een dynamisch 'event':

``` html
<a v-on:[eventNaam]="doIets"> ... </a>
```

Wanneer de waarde van `eventNaam` gelijk is aan `"focus"`, dan zal `v-on:[eventNaam]` gelijk zijn aan `v-on:focus`.

#### Beperkingen voor de waarde van een dynamisch argument

Dynamische argumenten worden verwacht te evalueren naar een 'string', met als uitzondering `null`. The speciale waarde `null` kan gebruikt worden om expliciet de koppeling te verwijderen. Elke andere niet-'null'-koppeling zal een waarschuwing activeren.

#### Beperkingen voor de expressies van een dynamisch argument

<p class="tip">Expressies van een dynamisch argument hebben beperkingen qua syntax. Bepaalde karakters zijn ongeldig in de naam van een HTML-attribuut, zoals spaties en aanhalingstekens. Er moet ook rekening gehouden worden met het gebruik van hoofdletters in de naam van het HTML-attribuut wanneer het gebruikt wordt in DOM-'templates'.</p>

Bijvoorbeeld, het volgende is ongeldig:

``` html
<!-- Dit activeert een waarschuwing van de compiler. -->
<a v-bind:['iets' + anders]="waarde"> ... </a>
```

Er kan omheen gewerkt worden door gebruik van een expressie zonder spaties of aanhalingstekens of door de complexe expressie te vervangen met een berekende eigenschap.

Indien er gebruik gemaakt wordt van 'templates' die rechtstreeks in een HTML-bestand geschreven zijn, dan moet er rekening gehouden worden dat browsers de namen forceren naar kleine letters:

``` html
<!-- Dit wordt omgezet naar v-bind:[eenattr] in rechtstreekse DOM-'templates'. -->
<a v-bind:[eenAttr]="waarde"> ... </a>
```

### Modificaties

Modificaties zijn speciale achtervoegsels aangegeven door een punt dat aangeeft dat een 'directive' op een speciale manier gekoppeld moet worden. Bijvoorbeeld, de `.prevent`-modificatie zegt tegen de `v-on` 'directive dat `event.preventDefault()` aangeroepen moet worden op het geactiveerde 'event':

``` html
<form v-on:submit.prevent="bijSubmit"> ... </form>
```

Er worden later andere moficaties bekeken bij het verkennen van andere functionaliteit. [`v-on`](events.html#'Event'-modificaties) en [`v-model`](forms.html#Modificaties).

## Verkorte schrijfwijze

Het `v-`-voorvoegsel dient als visuele hint om Vue-specifieke attributen te indentificeren in de 'template'. Dit is nuttig wanneer Vue gebruikt wordt om dynamisch gedrag toe te passen op bestaande opmaak. Het kan overbodig aanvoelen voor sommige veelgebruikte 'directives'. Bij het bouwen van een [SPA](https://en.wikipedia.org/wiki/Single-page_application) is het `v-`-voorvoegsel minder belangrijk aangezien Vue alle 'templates' beheert. Daarom zijn er speciale verkote schrijfwijze voorzien voor de twee meeste gebruikte 'directives', `v-bind` en `v-on`:

### Verkorte schrijfwijze `v-bind`

``` html
<!-- volledige syntax -->
<a v-bind:href="url"> ... </a>

<!-- verkorte schrijfwijze -->
<a :href="url"> ... </a>

<!-- verkorte schrijfwijze met dynamisch argument (2.6.0+) -->
<a :[sleutel]="url"> ... </a>
```

### Verkorte schrijfwijze `v-on`

``` html
<!-- volledige syntax -->
<a v-on:click="doeIets"> ... </a>

<!-- verkorte schrijfwijze -->
<a @click="doeIets"> ... </a>

<!-- verkorte schrijfwijze met dynamisch argument (2.6.0+) -->
<a @[event]="doeIets"> ... </a>
```

Dit lijkt misschien anders dan normale HTML, maar `:` en `@` zijn geldige karakters voor attribuutnamen en alle browsers die Vue ondersteunt, kunnen het correct parsen. Bovendien verschijnen ze niet in de uiteindelijk weergegeven opmaak. De verkorte schrijfwijze is volledig optioneel, maar zal waarschijnlijk gewaardeerd worden wanneer er later meer over het gebruik gekend is.