---
title: Conditionele weergave
type: guide
order: 7
---

## `v-if`

De 'directive' `v-if` wordt gebruikt om een blok van code conditioneel weer te geven. Het blok zal alleen weergegeven worden wanneer de expressie van de 'directive' 'truthy' is.

``` html
<h1 v-if="geweldig">Vue is geweldig!</h1>
```

Het is ook mogelijk om een 'else'-blok toe te voegen met `v-else`:

``` html
<h1 v-if="geweldig">Vue is geweldig!</h1>
<h1 v-else>Oh nee!</h1>
```

### Conditionele groepen met `v-if` en `<template>`

Omdat `v-if` een 'directive' is, moet het aan één element gekoppeld worden. Wat als er meerdere elementen wel of niet weergegeven moeten worden? Dan is het mogelijk om `v-if` te gebruiken op een `<template>`-element, dit dient als een onzichtbare verpakking rondom alle elementen. Het uiteindelijk weergegeven resultaat zal geen `<template>`-element bevatten.

``` html
<template v-if="ok">
  <h1>Titel</h1>
  <p>Paragraaf 1</p>
  <p>Paragraaf 2</p>
</template>
```

### `v-else`

Met de 'directive' `v-else` kan een 'else'-blok aangegeven worden voor `v-if`:

``` html
<div v-if="Math.random() > 0.5">
  Nu is het zichtbaar
</div>
<div v-else>
  Nu is het niet zichtbaar
</div>
```

Een `v-else`-element moet direct geplaatst worden na een `v-if`- of een `v-else-if`-element, anders zal het niet herkend worden.

### `v-else-if`

> Nieuw in 2.1.0+

De `v-else-if`, zoals de naam doet vermoeden, dient als een 'else if'-blok voor `v-if`. Het kan meerdere keren na elkaar gebruikt worden:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Niet A/B/C
</div>
```

Net zoals `v-else` moet een `v-else-if`-element direct geplaatst worden na een `v-if`- of een `v-else-if`-element.

### Beheren van herbruikbare elementen met `key`

Vue probeert elementen zo efficiënt mogelijk weer te geven, vaak worden elementen hergebruikt in plaats van alles vanaf nul op te bouwen. Buiten dat het helpt om Vue zeer snel te maken, kan dit nuttige voordelen hebben. Bijvoorbeeld, als gebruikers de keuze hebben uit meerdere logintypes:

``` html
<template v-if="loginType === 'gebruikersnaam'">
  <label>Gebruikersnaam</label>
  <input placeholder="John Duck">
</template>
<template v-else>
  <label>E-mail</label>
  <input placeholder="vuejs@bartduisters.com">
</template>
```

Wanneer `loginType` gewisseld wordt, dan zal de ingevoerde waarde behouden blijven aangezien beide 'template'-elementen dezelfde elementen bevatten. Het `<input>`-element wordt niet vervangen, alleen de `placeholder`.

Bekijk het door tekst in te voeren en op de knop 'Logintype wisselen' te klikken:

{% raw %}
<div id="geen-key-voorbeeld" class="demo">
  <div>
    <template v-if="loginType === 'gebruikersnaam'">
      <label>Gebruikersnaam</label>
      <input placeholder="John Duck">
    </template>
    <template v-else>
      <label>E-mail</label>
      <input placeholder="vuejs@bartduisters.com">
    </template>
  </div>
  <button @click="wisselLoginType">Logintype wisselen</button>
</div>
<script>
new Vue({
  el: '#geen-key-voorbeeld',
  data: {
    loginType: 'gebruikersnaam'
  },
  methods: {
    wisselLoginType: function () {
      return this.loginType = this.loginType === 'gebruikersnaam' ? 'e-mail' : 'gebruikersnaam'
    }
  }
})
</script>
{% endraw %}

Dit is niet altijd het gewenste resultaat. Vue voorziet een manier om aan te geven dat twee elementen volledig verschillend zijn (en hierdoor zullen de elementen niet hergebruikt worden). Dit kan door een `key`-attribuut met een unieke waarde toe te voegen:

``` html
<template v-if="loginType === 'gebruikersnaam'">
  <label>Gebruikersnaam</label>
  <input placeholder="John Duck" key="gebruikersnaam-input">
</template>
<template v-else>
  <label>E-mail</label>
  <input placeholder="vuejs@bartduisters.com" key="e-mail-input">
</template>
```

In dit voorbeeld zullen beide elementen altijd van nul af aan opgebouwd worden:

{% raw %}
<div id="key-voorbeeld" class="demo">
  <div>
    <template v-if="loginType === 'gebruikersnaam'">
      <label>Gebruikersnaam</label>
      <input placeholder="John Duck" key="gebruikersnaam-input">
    </template>
    <template v-else>
      <label>E-mail</label>
      <input placeholder="vuejs@bartduisters.com" key="email-input">
    </template>
  </div>
  <button @click="wisselLoginType">Logintype wisselen</button>
</div>
<script>
new Vue({
  el: '#key-voorbeeld',
  data: {
    loginType: 'gebruikersnaam'
  },
  methods: {
    wisselLoginType: function () {
      return this.loginType = this.loginType === 'gebruikersnaam' ? 'e-mail' : 'gebruikersnaam'
    }
  }
})
</script>
{% endraw %}

Merk op dat de `<label>`-elementen nog steeds efficiënt hergebruikt worden, aangezien de elementen geen `key`-attribuut hebben.

## `v-show`

Een andere optie om een element conditioneel weer te geven is de 'directive' `v-show`. Het gebruik is grotendeels hetzelfde:

``` html
<h1 v-show="ok">Hallo!</h1>
```

Het verschil is dat `v-show` het element altijd zal weergeven en het element zal altijd in het DOM blijven. `v-show` wisselt alleen de `display`-eigenschap van het element.

<p class="tip">Merk op dat `v-show` geen ondersteuning heeft voor het `<template>`-element, het is ook niet compatibel met `v-else`.</p>

## `v-if` vs `v-show`

`v-if` is een "echte" conditionele weergave, aangezien het zorgt dat 'event listeners' en 'child'-componenten in het conditionele blok effectief verwijdert worden en opnieuw opgebouwd worden bij het wisselen van de zichtbaarheid.

`v-if` is **'lazy'**: als de conditie 'false' is bij de initiële weergave, dan zal het niks doen. Het conditionele blok zal niet weergegeven worden tot de conditie 'true' wordt.

Ter vergelijking, `v-show` is veel eenvoudiger. Het element wordt altijd weergegeven ongeacht van de initiële conditie.

Over het algemeen, `v-if` heeft een hogere kost terwijl `v-show` een hogere initiële kost heeft. Verkies `v-show` als iets vaak gewisseld moet worden qua zichtbaarheid en verkies `v-if` wanneer het onwaarschijnlijk is dat de conditie gaat wisselen nadat de applicatie gestart is.

## `v-if` met `v-for`

<p class="tip">Het gebruik van `v-if` en `v-for` tegelijkertijd is **niet aangeraden**. Bekijk de [stijlgids](/v2/style-guide/#Vermijd-v-if-met-v-for-essentieel) voor meer informatie.</p>

Wanneer `v-if` en `v-for` samen gebruikt worden, dan heeft `v-if` een hogere prioriteit. Bekijk de <a href="../guide/list.html#v-for-met-v-if">gids voor het weergeven van een lijst</a> voor meer informatie.
