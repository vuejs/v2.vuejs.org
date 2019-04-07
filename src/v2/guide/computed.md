---
title: Berekende eigenschappen en 'watchers'
type: guide
order: 5
---

## Berekende eigenschappen

Expressies in de 'template' zijn handig, maar zijn bedoeld voor simpele bewerkingen. Te veel logica in een 'template' maakt het onoverzichtelijk en moeilijk te onderhouden. Bijvoorbeeld:

``` html
<div id="voorbeeld">
  {{ bericht.split('').reverse().join('') }}
</div>
```

Op dit moment is de 'template' niet langer eenvoudig en declaratief. Er is enige tijd nodig om de code te bekijken en te snappen dat het een `bericht` omgekeerd zal weergeven. Het probleem wordt erger wanneer het omgekeerde bericht meer dan eens wordt weergegeven in de 'template'. 

Het is hierdoor dat er voor alle complexe logica gebruik gemaakt wordt van **berekende eigenschappen**.

### Simpel voorbeeld

``` html
<div id="voorbeeld">
  <p>Origineel bericht: "{{ bericht }}"</p>
  <p>Berekend omgekeerd bericht: "{{ omgekeerdBericht }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#voorbeeld',
  data: {
    bericht: 'Hallo'
  },
  computed: {
    // een berekende eigenschap
    omgekeerdBericht: function () {
      // `this` wijst naar de Vue-instantie
      return this.bericht.split('').reverse().join('')
    }
  }
})
```

Resultaat:

{% raw %}
<div id="voorbeeld" class="demo">
  <p>Origineel bericht: "{{ bericht }}"</p>
  <p>Berekend omgekeerd bericht: "{{ omgekeerdBericht }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#voorbeeld',
  data: {
    bericht: 'Hallo'
  },
  computed: {
    omgekeerdBericht: function () {
      return this.bericht.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Er is een berekende eigenschap `omgekeerdBericht` gedeclareerd. De functie zal gebruikt worden als 'getter'-functie (een functie die de waarde 'get', een waarde ophaalt) voor de eigenschap `vm.omgekeerdBericht`:

``` js
console.log(vm.omgekeerdBericht) // => 'ollaH'
vm.bericht = 'Vaarwel'
console.log(vm.omgekeerdBericht) // => 'lewraaV'
```

Door het openen van de console kan er gespeeld worden met het 'vm'-voorbeeld. De waarde van `vm.omgekeerdBericht` is altijd afhankelijk van de waarde van `vm.bericht`.

De berekende eigenschappen kunnen gekoppeld worden aan de 'template', net zoals gewone eigenschappen gekoppeld kunnen worden. Vue weet dat `vm.omgekeerdBericht` afhankelijk is van `vm.bericht`, het zal `vm.omgekeerdBericht` bijwerken wanneer `vm.bericht` wijzigt. Het beste aan de berekende eigenschap is dat de afhankelijkheid declaratief aangemaakt is: de berekende 'getter'-functie heeft geen bijwerkingen, dit zorgt dat het makkelijker te begrijpen en te testen is.

### Berekende caching vs methoden

Het is mogelijk hetzelfde resultaat te bekomen door een methode aan te roepen in de expressie:

``` html
<p>Omgekeerd bericht: "{{ berichtOmkeren() }}"</p>
```

``` js
// in component
methods: {
  berichtOmkeren: function () {
    return this.bericht.split('').reverse().join('')
  }
}
```

In plaats van een berekende eigenschap, is het mogelijk dezelfde functionaliteit te definiëren als een methode. Het eindresultaat is hetzelfde. Het verschil is dat **berekende eigenschappen gecachet worden op basis van de reactieve afhankelijkheid**. Een berekende eigenschap wordt alleen maar opnieuw geëvalueerd wanneer een van de reactieve afhankelijkheden wijzigt. Dit betekent dat zolang `bericht` niet wijzigt en de waarde van de berekende eigenschap `omgekeerdBericht` wordt meerdere keren opgevraagd, dan zal onmiddellijk het vorige berekende resultaat teruggeven worden zonder dat de functie opnieuw uitgevoerd wordt.

Dit betekent ook dat onderstaande berekende eigenschap nooit zal wijzigen, aangezien `Date.now()` geen reactieve afhankelijkheid is:

``` js
computed: {
  nu: function () {
    return Date.now()
  }
}
```

Ter vergelijking, het oproepen van een methode zal **altijd** de functie uitvoeren wanneer een wijziging uitgevoerd wordt.

Waarom is caching nodig? Stel, er is een berekende eigenschap **A** waarin er veel handelingen gebeuren. Er wordt doorheen een grote 'array' gelopen waarin er veel berekeningen gedaan worden. Er zijn vervolgens meerdere berekende eigenschappen die gebruik maken van **A**. Zonder caching zal de 'getter' van **A** veel vaker uitgevoerd worden dan nodig is! Indien er effectief geen caching nodig is, dan kan een methode gebruikt worden.

### Berekende eigenschap vs 'watched' eigenschap

Vue voorziet een meer generieke manier om wijzigingen in data te observeren en hierop te reageren: **'watch'-eigenschappen** (letterlijk vertaald: eigenschappen die 'bekeken' worden). Wanneer er data is die moet veranderen op basis van andere data, is het verleidelijk om `'watch'` te veel te gebruiken, zeker wanneer er voorkennis is van AngularJS. Vaak is het beter om een berekende eigenschap te gebruiken. Bijvoorbeeld: 

``` html
<div id="demo">{{ volledigeNaam }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    voornaam: 'John',
    achternaam: 'Duck',
    volledigeNaam: 'John Duck'
  },
  watch: {
    voornaam: function (waarde) {
      this.volledigeNaam = waarde + ' ' + this.achternaam
    },
    achternaam: function (waarde) {
      this.volledigeNaam = this.voornaam + ' ' + waarde
    }
  }
})
```

Bovenstaande code zorgt ervoor dat bij elke verandering van de voornaam en bij elke verandering van de achternaam, de volledige naam gezet wordt. Vergelijk dit met de versie voor een berekende eigenschap waarbij het aanroepen van de berekende eigenschap `volledigeNaam` zorgt voor het teruggeven van de voornaam en achternaam:

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    voornaam: 'John',
    achternaam: 'Duck'
  },
  computed: {
    volledigeNaam: function () {
      return this.voornaam + ' ' + this.achternaam
    }
  }
})
```

Beter, niet?

### Berekende 'setter'

Berekende eigenschappen zijn standaard 'getter-only' (een waarde kan alleen opgevraagd worden), maar het is ook mogelijk een 'setter' (een waarde toekennen) te voorzien indien nodig:

``` js
// ...
computed: {
  volledigeNaam: {
    // getter
    get: function () {
      return this.voornaam + ' ' + this.achternaam
    },
    // setter
    set: function (nieuweWaarde) {
      var namen = nieuweWaarde.split(' ')
      this.voornaam = namen[0]
      this.achternaam = namen[namen.length - 1]
    }
  }
}
// ...
```

Wanneer `vm.volledigeNaam = 'John Duck'` uitgevoerd wordt, dan zal de 'setter' aangeroepen worden en `vm.voornaam` en `vm.achternaam` zullen gewijzigd worden.

## 'Watchers'

Ook al zijn berekende eigenschappen vaak de geschikte oplossing, er zijn momenten wanneer een 'watcher' nodig is. Daarom voorziet Vue een generieke manier om te reageren op wijzigingen in data via de `watch`-optie. Dit is vooral nuttig wanneer er asynchrone of ingewikkelde operaties uitgevoerd moeten worden als reactie op het wijzigen van data.

Bijvoorbeeld:

``` html
<div id="watch-voorbeeld">
  <p>
    Stel een ja/nee-vraag:
    <input v-model="vraag">
  </p>
  <p>{{ antwoord }}</p>
</div>
```

``` html
<!-- Vue core kan klein blijven qua grootte door het wiel niet  -->
<!-- opnieuw uit te vinden. Dit zorgt ervoor dat er gekozen kan -->
<!-- worden wat gebruikt wordt.                                 -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchVoorbeeldVM = new Vue({
  el: '#watch-voorbeeld',
  data: {
    vraag: '',
    antwoord: 'Het is niet mogelijk om te antwoorden zonder vraag: stel een vraag!'
  },
  watch: {
    // wanneer een vraag gesteld wordt, zal deze functie uitgevoerd worden
    vraag: function (nieuweVraag, oudeVraag) {
      this.antwoord = 'Wachten tot er niet meer getypt wordt ...'
      this.debouncedAntwoord()
    }
  },
  created: function () {
    // _.debounce is een functie voorzien door lodash (tweede script bovenaan)
    // om te beperken hoe vaak een complexe operatie uitgevoerd kan worden.
    // In dit geval wordt er een limiet geplaatst op het aantal keer dat
    // yesno.wtf/api wordt aangeroepen door te wachten tot de gebruiker klaar
    // is met typen voordat het asynchrone verzoek naar de API wordt ingediend.
    // Om meer te leren over de functie _.debounce (en het broertje _.throttle),
    // bezoek: https://lodash.com/docs#debounce
    this.debouncedAntwoord = _.debounce(this.getAntwoord, 500)
  },
  methods: {
    getAntwoord: function () {
      if (this.vraag.indexOf('?') === -1) {
        this.antwoord = 'Vragen bevatten meestal een vraagteken. ;-)'
        return
      }
      this.antwoord = 'Aan het nadenken ...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (reactie) {
          vm.antwoord = _.capitalize(reactie.data.antwoord)
        })
        .catch(function (error) {
          vm.antwoord = 'Error! Kan de API niet bereiken. ' + error
        })
    }
  }
})
</script>
```

Resultaat:

{% raw %}
<div id="watch-voorbeeld" class="demo">
  <p>
    Stel een ja/nee-vraag:
    <input v-model="vraag">
  </p>
  <p>{{ antwoord }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchVoorbeeldVM = new Vue({
  el: '#watch-voorbeeld',
  data: {
    vraag: '',
    antwoord: 'Het is niet mogelijk om te antwoorden zonder vraag: stel een vraag!'
  },
  watch: {
    vraag: function (nieuweVraag, oudeVraag) {
      this.antwoord = 'Wachten tot er niet meer getypt wordt ...'
      this.debouncedAntwoord()
    }
  },
  created: function () {
    this.debouncedAntwoord = _.debounce(this.getAntwoord, 500)
  },
  methods: {
    getAntwoord: function () {
      if (this.vraag.indexOf('?') === -1) {
        this.antwoord = 'Vragen bevatten meestal een vraagteken. ;-)'
        return
      }
      this.antwoord = 'Aan het nadenken ...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (reactie) {
          vm.antwoord = _.capitalize(reactie.data.antwoord)
        })
        .catch(function (error) {
          vm.antwoord = 'Error! Kan de API niet bereiken. ' + error
        })
    }
  }
})
</script>
{% endraw %}

In dit geval maakt het gebruik van de `watch`-optie het mogelijk om een asynchrone operatie (praten met een API) uit te voeren. Het limiteert hoe vaak de operatie uitgevoerd kan worden. Het laat toe om tussentijdse resultaten te tonen tot het uiteindelijke antwoord van de API verkregen is. Dit zou niet mogelijk zijn met een berekende eigenschap.

Bovenop de `watch`-optie is het ook mogelijk om de [vm.$watch API](../api/#vm-watch) te gebruiken.
