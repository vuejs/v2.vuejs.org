---
title: Instalacja
type: guide
order: 1
vue_version: 2.5.16
gz_size: "30.90"
---

### Informacja o kompatybilności

Vue **nie** obsługuje IE8 i starszych, ponieważ korzysta z funkcji ECMAScript 5 niemożliwych do odtworzenia w IE8. Obsługuje jednak wszystkie [przeglądarki zgodne z ECMAScript 5](https://caniuse.com/#feat=es5).

### Informacje o wydaniu

Najnowsza stabilna wersja: {{vue_version}}

Szczegółowe informacje o wydaniu dla każdej wersji znajdują się na [GitHubie](https://github.com/vuejs/vue/releases).

## Vue Devtools

Jeżeli korzystasz z Vue, zalecamy również instalację w przeglądarce [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools), pozwalających na zbadanie i debugowanie aplikacji Vue z poziomu bardziej przyjaznego interfejsu.

## Bezpośrednie użycie `<script>`

Po prostu pobierz i uwzględnij tag script. `Vue` zostanie zarejestrowane jako zmienna globalna.

<p class="tip">Nie korzystaj ze zminifikowanej wersji w fazie tworzenia. Stracisz wszystkie ostrzeżenia o częstych pomyłkach!</p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>Wersja deweloperska</a><span class="light info">Ze wszystkimi ostrzeżeniami i trybem debugowania</span>

  <a class="button" href="/js/vue.min.js" download>Wersja produkcyjna</a><span class="light info">Ostrzeżenia nie są uwzględnione, {{gz_size}}KB min+gzip</span>
</div>

### CDN

Aby zacząć tworzyć prototypy lub uczyć się, możesz użyć najnowszej wersji z:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Na produkcji, zalecamy użycie określonego numeru wersji i kompilacji, aby uniknąć przeszkód po wydaniu nowej wersji:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.js"></script>
```

Jeżeli korzystasz z natywnych modułów ES, istnieje też kompilacja kompatybilna z nimi:

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js'
</script>
```

Możesz przejrzeć źródło lakieru NPM na [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue jest także dostępne na [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) i [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (na cdnjs synchronizacja do najnowszej wersji zajmuje trochę czasu, więc może być jeszcze niedostępna).

Pamiętaj o przeczytaniu o [różnicach pomiędzy różnymi kompilacjami Vue](#Objaśnienie-różnych-kompilacji) i korzystaniu z **wersji produkcyjnej** na publikowanej stronie, zastępując`vue.js` na `vue.min.js`. Jest to mniejsza kompilacja zoptymalizowana pod kątem wydajności, zamiast doświadczenia przy programowaniu.

## NPM

NPM jest zalecaną metodą instalacji podczas tworzenia aplikacji na większą skalę z użyciem Vue. Działa ona dobrze z bundlerami takimi jak [Webpack](https://webpack.js.org/) czy [Browserify](http://browserify.org/). Vue dostarcza również narzędzia pozwalające na korzystanie z [jednoplikowych komponentów](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

## CLI

Vue dostarcza również [oficjalne CLI](https://github.com/vuejs/vue-cli) przeznaczone do szybkiego tworzenia szkieletów dla bardziej ambitnych aplikacji single page. Tworzy ono konfiguracje zawierające dodatkowe narzędzia do pracy nad front-endem. W kilka minut uzyskasz hot-reloading, lintowanie przy zapisie i kompilacje gotowe na produkcję. Zajrzyj do [dokumentacji Vue CLI](https://cli.vuejs.org) po więcej szczegółów.

<p class="tip">CLI zaklada znajomość Node.js i związanych z nim narzędzi. Jeżeli jesteś nowy(-a) w Vue lub narzędziach do kompilacji front-endu, zalecamy przejście przez <a href="./">przewodnik</a> bez korzystania z żadnych narzędzi do kompilacji, zanim zaczniesz używać CLI.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="noopener" title="Vue CLI">Obejrzyj film wyjaśniający na Vue Mastery</a></div>

## Objaśnienie różnych kompilacji

W [katalogu `dist/` pakietu NPM](https://cdn.jsdelivr.net/npm/vue/dist/) znajdziesz wiele kompilacji Vue.js. Oto omówienie różnic między nimi:

| | UMD | CommonJS | Moduły ES (dla bundlerów) | moduły ES (dla przeglądarek) |
| --- | --- | --- | --- | --- |
| **Pełna** | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| **Tylko środowisko uruchomieniowe** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| **Pełna (produkcyjna)** | vue.min.js | - | - | vue.esm.browser.min.js |
| **Tylko środowisko uruchomieniowe (produkcja)** | vue.runtime.min.js | - | - | - |

### Terminy

- **Pełna**: kompilacja zawierającą zarówno kompilator, jak i środowisko uruchomieniowe.

- **Kompilator**: kod odpowiedzialny za kompilację szablonów na funkcje renderowania w JavaScript.

- **Środowisko uruchomieniowe**: kod odpowiedzialny za tworzenie instancji Vue, renderowanie i aktualizację wirtualnego DOM itd. W zasadzie wszystko poza kompilatorem.

- **[UMD](https://github.com/umdjs/umd)**: kompilacje UMD mogą być używane w przeglądarce bezpośrednio w tagu `<script>`. Domyślny plik z CDN jsDelivr na [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) to kompilacja UMD środowiska uruchomieniowego i kompilatora (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: kompilacje CommonJS są przeznaczone dla starszych bundlerów takich jak [browserify](http://browserify.org/) czy [webpack 1](https://webpack.github.io). Głównym plikiem dla tych bundlerów (`pkg.main`) jest kompilacja CommonJS zawierająca tylko środowisko uruchomieniowe (`vue.runtime.common.js`).

- **[Moduł ES](http://exploringjs.com/es6/ch_modules.html)**: od wersji 2.6, Vue dostarcza dwie kompilacja modułów ES (ESM):

  - ESM dla bundlerów — przeznaczony do wykorzystania przez nowoczesne bundlery, takie jak [webpack 2](https://webpack.js.org) czy [Rollup](https://rollupjs.org/). Format ESM jest zaprojektowany tak, aby była możliwa statyczna analiza, pozwalając bundlerom na „tree-shaking” i usunięcie niepotrzebnego kodu z końcowego zestawu. Domyślnym plikiem dla tych bundlerów (`pkg.module`) jest kompilacja modułu ES zawierająca tylko środowisko uruchomieniowe (`vue.runtime.esm.js`).

  - ESM dla przeglądarek (tylko 2.6+): przeznaczony do bezpośredniego importowania w nowoczesnych przeglądarkach z użyciem `<script type="module">`.

### Środowisko uruchomieniowe + kompilator vs. samo środowisko uruchomieniowe

Jeżeli potrzebujesz kompilować szablony po stronie klienta (np. przekazując ciąg znaków w opcji `template` lub montując do elementu używając jego HTML w DOM jako szablonu), będziesz potrzebować kompilatora, więc również pełnej kompilacji:

``` js
// to wymaga użycia kompilatora
new Vue({
  template: '<div>{{ hi }}</div>'
})

// a to nie
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

Jeżeli korzystasz z `vue-loader` lub `vueify`, szablony wewnątrz plików `*.vue` są kompilowane do JavaScript w procesie budowania. Nie potrzebujesz wtedy kompilatora w końcowym zestawie, więc możesz używać kompilacji zawierającej samo środowisko uruchomieniowe.

Ponieważ kompilacje zawierające tylko środowisko uruchomieniowe są ok. 30% lżejsze od ich pełnych odpowiedników, powinieneś(-naś) używać ich kiedy tylko możesz. Jeżeli mimo tego wolisz korzystać z pełnych kompilacji, musisz skonfigurować alias w swoim bundlerze:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' dla webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': require.resolve('vue/dist/vue.esm.js')
    })
  ]
})
```

#### Browserify

Dodaj do `package.json` projektu:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Dodaj do `package.json` projektu:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Tryb programisty/produkcyjny

Tryby produkcyjny i programisty są trwale zapisane dla kompilacji UMD — niezminifikowane pliki przeznaczone są do programowania, a zminifikowane — na produkcję.

Kompilacje CommonJS i modułów ES są przeznaczone dla bundlerów, więc nie dostarczamy ich zminifikowanych wersji. Będziesz odpowiedzialny(-a) za zminifikowanie końcowej wersji samodzielnie.

Kompilacje CommonJS i modułów ES sprawdzają również `process.env.NODE_ENV`, aby określić w jakim trybie powinny zostać uruchomione. Musisz użyć odpowiedniej konfiguracji bundlera aby zamienić te zmienne, aby kontrolować w jakim trybie zostanie uruchomiony Vue. Zamiana `process.env.NODE_ENV` na ciąg znaków pozwala minifikatorom takim jak UglifyJS na całkowite pominięcie kodu tylko dla programisty, zmniejszając rozmiar końcowego pliku.

#### Webpack

W Webpacku 4+, możesz użyć opcji `mode`:

``` js
module.exports = {
  mode: 'production'
}
```

W Webpacku 3 i starszych, musisz użyć [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

Użyj [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
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

Zastosuj globalną transformację [envify](https://github.com/hughsk/envify) w swoim zestawie.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Przeczytaj także [Wskazówki dotyczące wdrażania na produkcji](deployment.html).

### Środowiska CSP

Niektóre środowiska, takie jak aplikacje Google Chrome, wymuszają Politykę Bezpieczeństwa Treści (ang. *Content Security Policy*, **CSP), uniemożliwiającą wykorzystywanie `new Function()` do wykonywania wyrażeń. Pełna kompilacja używa tej funkcji, aby kompilować szablony, więc nie może być użyta w takich środowiskach.

Z drugiej strony, kompilacja zawierającą tylko środowisko uruchomieniowe jest w oleju zgodna z CSP. Jeżeli używasz tej kompilacji z [Webpackiem + vue-loader](https://github.com/vuejs-templates/webpack-simple) lub [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), szablony zostaną wcześniej skompilowane do funkcji `render`, działających bez problemów w środowiskach CSP.

## Kompilacja dla programisty

**Ważne** — pliki kompilacji z katalogu `/dist` na GitHubie są aktualizowane tylko przy wydaniach. Aby używać Vue z najnowszego kodu z GitHuba, musisz skompilować je samodzielnie.

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Tylko kompilacje UMD są dostępne z Bowera.

``` bash
# latest stable
$ bower install vue
```

## Loadery modułów AMD

Wszystkie kompilacje UMD mogą być wykorzystywane bezpośrednio jako moduły AMD.
