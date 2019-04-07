---
title: Koppelingen met 'class' en 'style'
type: guide
order: 6
---

Een vaak voorkomend scenario is de nood om de stijl van een element aan te passen. Aangezien zowel 'class' als 'style' attributen zijn, kan `v-bind` gebruikt worden: met een expressie moet een 'string' berekent worden om te koppelen. Omdat het aan elkaar koppelen van meerdere 'strings' vervelend en foutgevoelig is, voorziet Vue speciale verbeteringen wanneer `v-bind` gebruikt wordt met `'class'` en `'style'`. Bovenop 'strings', kan de expressie ook evalueren naar objecten of 'arrays'.

## Koppelen van HTML 'classes'

### Object-syntax

Het is mogelijk om een object mee te geven aan `v-bind:class` om dynamisch te wisselen tussen 'classes':

``` html
<div v-bind:class="{ actief: isActief }"></div>
```

Bovenstaande syntax betekent dat de aanwezigheid van de 'class' `actief` bepaalt zal worden door de ['truthiness'](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) van de data-eigenschap `isActief`.

Er kunnen meerdere 'classes' aan- en uitgezet worden door meer velden te hebben in het object. De `v-bind:class` 'directive' kan samen met het gewone `class`-attribuut bestaan op een element. Gegeven is deze 'template':

``` html
<div
  class="statisch"
  v-bind:class="{ actief: isActief, 'tekst-gevaar': heeftError }"
></div>
```

En deze data:

``` js
data: {
  isActief: true,
  heeftError: false
}
```

Zal het volgende eindresultaat opleveren:

``` html
<div class="statisch actief"></div>
```

Wanneer `isActief` of `heeftError` wijzigt, dan zal de lijst met 'classes' bijgewerkt worden. Bijvoorbeeld, als `heeftError` de waarde `true` krijgt, dan zal de lijst met 'classes' `"statisch actief tekst-gevaar"` worden.

Het gekoppelde object hoeft niet in de HTML te staan:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    actief: true,
    'tekst-gevaar': false
  }
}
```

Dit geeft hetzelfde resultaat. Het is ook mogelijk om een [berekende eigenschap](computed.html) te koppelen dat een object teruggeeft. Dit is een veelvoorkomend en krachtig patroon:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActief: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      actief: this.isActief && !this.error,
      'tekst-gevaar': this.error && this.error.type === 'fataal'
    }
  }
}
```

### 'Array'-syntax

Het is mogelijk een 'array' door te geven aan `v-bind:class` om een lijst van 'classes' toe te passen:

``` html
<div v-bind:class="[actiefClass, errorClass]"></div>
```
``` js
data: {
  actiefClass: 'actief',
  errorClass: 'tekst-gevaar'
}
```

Wat resulteert in:

``` html
<div class="actief tekst-gevaar"></div>
```

Het is mogelijk om conditioneel te bepalen of een 'class' wel of niet toegepast moet worden, dit kan door een ternaire expressie te gebruiken:

``` html
<div v-bind:class="[isActief ? actiefClass : '', errorClass]"></div>
```

Dit zal `errorClass` altijd toepassen, maar zal `actiefClass` alleen toepassen wanneer `isActief` 'truthy' is.

Aangezien dit voor redelijk langdradig kan worden, is het mogelijk om een object te gebruiken in de 'array':

``` html
<div v-bind:class="[{ actief: isActief }, errorClass]"></div>
```

### Met componenten

> Deze sectie gaat uit van voorkennis van [Vue-componenten](components.html).

Wanneer het `class`-attribuut gebruikt wordt op een component, dan worden de 'classes' toegevoegd aan het 'root'-element van het component. Bestaande 'classes' zullen niet overschreven worden.

Bijvoorbeeld, als dit component gedeclareerd is:

``` js
Vue.component('my-component', {
  template: '<p class="een twee">Hallo</p>'
})
```

Vervolgens worden er 'classes' toegevoegd wanneer het component gebruikt wordt:

``` html
<my-component class="drie vier"></my-component>
```

Het resultaat is:

``` html
<p class="een twee drie vier">Hallo</p>
```

Hetzelfde geldt voor de koppelingen met `v-bind:class`:

``` html
<my-component v-bind:class="{ actief: isActief }"></my-component>
```

Wanneer `isActief` 'truthy' is, dan is het resultaat:

``` html
<p class="een twee actief">Hallo</p>
```

## Koppelen van 'inline styles'

### Object-syntax

De syntax om een object te koppelen met `v-bind:style` is duidelijk, het lijkt op CSS, maar in de plaats van CSS is het een JavaScript-object. Het is mogelijk om camelCase of kebab-case (voeg quotes toe wanneer kebab-case gebruikt wordt) te gebruiken voor de namen van CSS-eigenschappen:

``` html
<div v-bind:style="{ color: actiefKleur, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  actiefKleur: 'red',
  fontSize: 30
}
```

Het is vaak een goed idee om een 'style'-object direct te koppelen zodat een 'template' duidelijk is:

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

Opnieuw, de object-syntax wordt vaak samen gebruikt met berekende eigenschappen dat objecten teruggeeft.

### 'Array'-syntax

De 'array'-syntax voor `v-bind:style` laat toe om meerdere 'style'-objecten toe te passen op hetzelfde element:

``` html
<div v-bind:style="[basisStyles, overschrijvendeStyles]"></div>
```

### Automatische voorvoegsels

Wanneer er gebruik gemaakt wordt van een CSS-eigenschap dat ['vendor'-voorvoegsels](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) vereist in `v-bind:style`, bijvoorbeeld `transform`, dan zal Vue dit automatisch detecteren en het correcte voorvoegsel toevoegen.

### Meerdere waarden

> 2.3.0+

Vanaf 2.3.0+ is het mogelijk een 'array' met meerdere waarden (met voorvoegsel) te koppelen aan een 'style'-eigenschap, bijvoorbeeld:

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Dit zal enkel de laatste waarde van de 'array' weergeven dat de browser ondersteunt. In dit voorbeeld zal `display: flex` weergegeven worden voor browsers die 'flexbox' ondersteunen zonder voorvoegsel.
