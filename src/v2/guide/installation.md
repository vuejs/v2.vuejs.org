---
title: Installatie
type: guide
order: 1
vue_version: 2.5.16
gz_size: "30.90"
---

### Opmerking over compatibiliteit

Vue ondersteunt IE8 en lager **niet** omdat Vue ECMAScript 5-functionaliteit gebruikt die niet ondersteund wordt in IE8. Vue ondersteunt alle [ECMAScript 5 compatibele browsers](https://caniuse.com/#feat=es5).

### Uitgaveopmerkingen

Laatst stabiele versie: {{vue_version}}

Gedetailleerde notities voor elke versie zijn beschikbaar op [GitHub](https://github.com/vuejs/vue/releases).

## Vue Devtools

Wanneer Vue gebruikt wordt, is het aangeraden om de [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) te installeren in de browser. Hiermee kunnen Vue-applicaties geïnspecteerd en gedebugd worden met een gebruiksvriendelijke interface.

## Vue toevoegen via `<script>`

Downloaden en toevoegen via een script-tag. `Vue` zal geregistreerd worden als een globale variabele.

<p class="tip">Gebruik de versie voor productie niet tijdens het ontwikkelen. Met de versie voor het ontwikkelen worden er waarschuwingen voor veel voorkomende fouten getoond!</p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>Versie voor ontwikkelen</a><span class="light info">Met waarschuwingen en debugmodus</span>

<a class="button" href="/js/vue.min.js" download>Versie voor productie</a><span class="light info">Geen waarschuwingen, {{gz_size}}KB min+gzip</span>

</div>

### CDN

Voor het maken van prototypes of voor leerdoeleinden kan gebruik gemaakt worden van de laatste versie via:

```html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Voor productie is het aangeraden om te verwijzen naar een specifiek versienummer, zo wordt er voorkomen dat code geschreven in vorige versies breekt door nieuwe functionaliteit in de latere versies:

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.js"></script>
```

Bij gebruik van ES Modules is er een compatibele versie:

```html
<script type="module">
  import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js";
</script>
```

De broncode van de NPM-pakketten kan bekeken worden op [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue is ook beschikbaar op [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) en [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (cdnjs heeft mogelijk niet de laatste versie beschikbaar doordat het langer duurt om te synchroniseren).

Lees over [de verschillende versies van Vue](#Uitleg-van-verschillende-versies) en gebruik de **versie voor productie** in gepubliceerde websites, vervang `vue.js` met `vue.min.js`. Dit is een voor snelheid geoptimaliseerde versie.

## NPM

Bij het maken van grootschalige applicaties met Vue is NPM de aangeraden manier om Vue te installeren. Het werkt goed samen met modulebundelaars zoals [Webpack](https://webpack.js.org/) of [Browserify](http://browserify.org/). Vue voorziet ook hulpmiddelen voor het maken van ['Single File Components'](single-file-components.html), dit zijn bestanden waarin alle code voorzien wordt voor een componenten.

```bash
# laatste stabiele versie
$ npm install vue
```

## CLI

Vue voorziet een [officiële CLI](https://github.com/vuejs/vue-cli) voor het snel opzetten van 'Single Page Applications'. Het voorziet alles wat nodig is om voor een moderne frontendworkflow. In enkele minuten is het opgezet en klaar voor gebruik, inclusief het compileren bij elke aanpassingen, het uitvoeren van 'linting' wanneer er opgeslagen wordt en het maken van productiewaardige versies van het project. Bekijk [de Vue CLI-documentatie](https://cli.vuejs.org) voor meer details.

<p class="tip">De CLI gaat uit van voorkennis over Node.js en de bijhorende hulpmiddelen. Indien er geen voorkennis is, wordt er aangeraden om eerst door <a href="./">de gids</a> te gaan zonder hulpmiddelen voor er gebruik wordt gemaakt van de CLI.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="noopener" title="Vue CLI">Bekijk een uitleg in videoformaat op Vue Mastery</a></div>

## Uitleg van verschillende versies

In de [`dist/`-folder van het NPM-pakket](https://cdn.jsdelivr.net/npm/vue/dist/) kunnen veel verschillende versies van Vue teruggevonden worden. Een overzicht van de verschillen tussen de versies:

|                               | UMD                | CommonJS              | ES Module (for bundlers) | ES Module (for browsers) |
| ----------------------------- | ------------------ | --------------------- | ------------------------ | ------------------------ |
| **Full**                      | vue.js             | vue.common.js         | vue.esm.js               | vue.esm.browser.js       |
| **Runtime-only**              | vue.runtime.js     | vue.runtime.common.js | vue.runtime.esm.js       | -                        |
| **Full (production)**         | vue.min.js         | -                     | -                        | vue.esm.browser.min.js   |
| **Runtime-only (production)** | vue.runtime.min.js | -                     | -                        | -                        |

### Terms

- **Full**: versies met zowel de compiler als de runtime.

- **Compiler**: code verantwoordelijk voor het compileren van 'template strings' in JavaScript-weergavefuncties.

- **Runtime**: code verantwoordelijk voor het maken van Vue-instanties, weergeven en verversen van het 'virtual DOM' ... In principe alles, behalve de taken van de compiler.

- **[UMD](https://github.com/umdjs/umd)**: UMD-versies kunnen rechtstreeks in de browser gebruikt worden via een `<script>`-tag. Het standaardbestand van de jsDelivr CDN [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) is de runtime + compiler UMD-versie (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS-versies zijn bedoeld om te gebruiken met oudere bundelaars, zoals [browserify](http://browserify.org/) of [webpack 1](https://webpack.github.io). Het standaardbestand voor deze bundelaars (`pkg.main`) is de CommonJS-versie met alleen de runtime (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: vanaf 2.6 voorziet Vue twee ES Modules-versies (ESM):

  - ESM voor bundelaars: dit is bedoeld voor het gebruik met moderne bundelaars zoals [webpack 2](https://webpack.js.org) of [Rollup](https://rollupjs.org/). Het ESM-formaat is gemaakt om statisch geanalyseerd te kunnen worden zodat bundelaars 'tree-shaking' kunnen uitvoeren. 'Tree-shaking' elimineert ongebruikte code uit de gecompileerde code. Het standaardbestand voor deze bundelaars (`pkg.module`) is de ES Modules-versie met alleen de runtime (`vue.runtime.esm.js`).

  - ESM voor browsers (alleen 2.6+): dit is bedoeld voor het direct importeren in moderne browsers via `<script type="module">`.

### Runtime + compiler vs. alleen de Runtime

Wanneer de 'templates' gecompileerd moeten worden op de 'client' (bv. het doorgeven van een 'string' aan de `template`-optie of het 'mounten' aan een element door de HTML van de DOM als 'template' te gebruiken), dan is de compiler nodig en dus is een van de 'full'-versies nodig.:

```js
// dit vereist de compiler
new Vue({
  template: "<div>{{ hi }}</div>"
});

// dit vereist de compilet niet
new Vue({
  render(h) {
    return h("div", this.hi);
  }
});
```

Wanneer `vue-loader` of `vueify` gebruikt wordt, 'templates' in `*.vue`-bestanden zijn voorgecompileerd in JavaScript wanneer het project gebouwd wordt. Hierdoor is er geen nood voor de compiler in de uiteindelijke gecompileerde code. Dit maakt het mogelijk om een versie met alleen de runtime te gebruiken.

Aangezien de versies met alleen de runtime ongeveer 30% kleiner zijn dan de 'full'-versies, is het verstandig om deze te gebruiken wanneer mogelijk. Om toch gebruik te maken van de 'full'-versie moet er een alias geconfigureerd worden in de bundelaar:

#### Webpack

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js" // 'vue/dist/vue.common.js' voor webpack 1
    }
  }
};
```

#### Rollup

```js
const alias = require("rollup-plugin-alias");

rollup({
  // ...
  plugins: [
    alias({
      vue: require.resolve("vue/dist/vue.esm.js")
    })
  ]
});
```

#### Browserify

Toevoegen aan de `package.json` in het project:

```js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Toevoegen aan de  `package.json` in het project:

```js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Versie voor ontwikkelen vs. versie voor productie

Beide versies zijn voorgedefinieerd voor de UMD-versies: de kleinere versies zijn voor productie, de grotere versies voor het ontwikkelen.

CommonJS- en ES Module-versies zijn bedoeld voor bundelaars, hierdoor zijn er geen verkleinde versies voorzien. De verantwoordelijkheid ligt bij de ontwikkelaar om de uiteindelijke versie van het project te verkleinen.

CommonJS- en ES Module-versies voorzien 'raw checks' voor `process.env.NODE_ENV` om te bepalen in welke modus gedraaid moet worden. Bundelaars moeten correct geconfigureerd worden om te bepalen in welke modus Vue moet draaien. Het vervangen van `process.env.NODE_ENV` met 'string literals' zorgt er voor dat 'minifiers' zoals UglifyJS de code die alleen voor ontwikkeling bedoeld is, uit de uiteindelijke versie van het project weggelaten kan worden.

#### Webpack

In Webpack 4+ kan er gebruik gemaakt worden van de `mode`-optie:

```js
module.exports = {
  mode: "production"
};
```

In Webpack 3 en lager moet er gebruik gemaakt worden van [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js
var webpack = require("webpack");

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
};
```

#### Rollup

Gebruik [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

```js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Pas een globale [envify](https://github.com/hughsk/envify)-transformatie toe op de uiteindelijke versie van het project.

```bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Bekijk ook [tips voor productie](deployment.html).

### CSP-omgevingen

Sommige omgevingen, zoals Google Chrome Apps, forceren Content Security Policy (CSP). Dat verbiedt het gebruik van `new Function()` voor het evalueren van uitdrukkingen. De 'full'-versie hangt af van deze functionaliteit om de 'templates' te compileren en deze zijn dus onbruikbaar in CSP-omgevingen.

De versie met alleen de runtime is volledig CSP-compatibel. Bij het gebruik van deze versie met [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) of [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), worden 'templates' vooraf gecompileerd in weergavefuncties en deze werken perfect in CSP-compatibele omgevingen.

## Dev-versie

**Belangrijk**: de bestanden in de `/dist`-folder op GitHub worden alleen tijdens het uitbrengen van een nieuwe versie van Vue toegevoegd. Om Vue te kunnen gebruiken vanuit de laatste broncode op GitHub, zal de ontwikkelaar zelf de code moeten compileren!

```bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

alleen UMD-versies zijn beschikbaar op Bower.

```bash
# laatst stabiele versie
$ bower install vue
```

## AMD Module Loaders

Alle UMD-versies kunnen direct gebruikt worden als een AMD-module.
