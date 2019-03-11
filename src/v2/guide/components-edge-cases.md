---
title: Gérer les cas limites
type: guide
order: 106
---

> Cette page suppose que vous avez déjà lu les principes de base des [composants](components.html). Lisez-les en premier si les composants sont quelque chose de nouveau pour vous.

<p class="tip">Toutes les fonctionnalités sur cette page documentent la gestion de cas limites, c'est-à-dire des situations peu ordinaires qui requièrent parfois de contourner légèrement les règles de Vue. Notez cependant qu'elles ont toutes des inconvénients ou des situations où elles peuvent s'avérer dangereuses. Celles-si sont décrites dans chaque cas, donc gardez-les en tête quand vous décidez d'utiliser chaque fonctionnalité.</p>

## Élément et accès au composant

Dans la plupart des cas, il vaut mieux éviter d'accéder à d'autres instances de composant ou de manipuler manuellement des éléments du DOM. Cependant, il y a des cas où cela peut être approprié.

### Accéder à l'instance racine

Dans chaque sous-composant d'une nouvelle instance de Vue (`new Vue`), on peut accéder à cette instance racine via la propriété `$root`. Par exemple, dans cette instance racine :

```js
// l'instance Vue racine
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

Tous les sous-composants pourront accéder à cette instance et l'utiliser comme un espace de stockage global :

```js
// Récupérer une donnée de la racine
this.$root.foo

// Affecter une donnée de la racine
this.$root.foo = 2

// Accéder aux propriétés calculées de la racine
this.$root.bar

// Appeler des méthodes de la racine
this.$root.baz()
```

<p class="tip">Cela peut être pratique pour des démos ou des applications très petites avec une poignée de composants. Cependant, ce pattern se prête mal aux applications de moyenne à grande échelle, c'est pourquoi nous recommandons fortement d'utiliser <a href="https://github.com/vuejs/vuex">Vuex</a> pour gérer l'état dans la plupart des cas.</p>

### Accéder à l'instance de composant parente

Comme `$root`, la propriété `$parent` peut être utilisée pour accéder à l'instance parente à partir d'un enfant. Il peut être tentant de l'utiliser par fainéantise plutôt que de passer les données via une prop.

<p class="tip">Dans la plupart des cas, accéder au parent rend votre application plus difficile à déboguer et à comprendre, surtout si vous mutez des données dans le parent. En regardant ce composant plus tard, il sera très difficile de découvrir d'où vient cette mutation.</p>

Il y a des cas cependant où cela _pourrait_ être approprié, notamment dans des bibliothèques de composants liés entre eux. Par exemple, dans des composants abstraits qui interagissent avec des APIs JavaScript plutôt que de produire du HTML, tels que ces composants Google Maps :

```html
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```

Le composant `<google-map>` peut définir une propriété `map` à laquelle tous les sous-composants ont besoin d'accéder. Dans ce cas, `<google-map-markers>` peut vouloir accéder à cette carte avec quelque-chose comme `this.$parent.getMap`, afin d'ajouter des marqueurs dessus. Vous pouvez voir ce pattern [en démonstration ici](https://jsfiddle.net/chrisvfritz/ttzutdxh/).

Gardez en tête, toutefois, que les composants conçus avec ce pattern sont toujours intrinsèquement fragiles. Par exemple, imaginons que nous ajoutons un nouveau composant `<google-map-region>` et que lorsque `<google-map-markers>` apparaît à l'intérieur, il affiche uniquement les marqueurs de cette région :

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

Alors, à l'intérieur de `<google-map-markers>`, vous pourriez vous retrouver à devoir recourir à des bricolages comme ceci:

```js
var map = this.$parent.map || this.$parent.$parent.map
```

Cela a rapidement mal tourné. C'est pourquoi nous recommandons plutôt d'utiliser l'[injection de dépendances](#Dependency-Injection) pour fournir des informations contextuelles à des composants enfants à un niveau de profondeur arbitraire.

### Accéder à des instances de composants enfants et des éléments enfants

Malgré l'existence des props et des événements, parfois vous pouvez toujours avoir besoin d'accéder directement à un composant enfant en JavaScript. Pour y parvenir, vous pouvez assigner un ID référence au composant enfant en utilisant l'attribut `ref`. Par exemple :

```html
<base-input ref="usernameInput"></base-input>
```

Ensuite, dans le composant où vous avez défini cette `ref`, vous pouvez utiliser :

```js
this.$refs.usernameInput
```

pour accéder à l'instance `<base-input>`. Cela peut être utile si vous voulez, par exemple, donner programmatiquement le focus à ce champ depuis le parent. Dans ce cas, le composant `<base-input>` peut de la même façon utiliser une `ref` pour fournir l'accès à des éléments spécifiques à l'intérieur, tels que :

```html
<input ref="input">
```

Et même définir des méthodes à utiliser par le parent :

```js
methods: {
  // utilisé pour mettre le focus sur ce champ à partir du parent
  focus: function () {
    this.$refs.input.focus()
  }
}
```

Et ainsi permettre au composant parent de mettre le focus sur le champ à l'intérieur de `<base-input>` avec :

```js
this.$refs.usernameInput.focus()
```

Quand `ref` est utilisé conjointement avec `v-for`, la ref que vous obtenez sera un `Array` contenant les composants enfants reflétant les données source.

<p class="tip">Les références <code>$refs</code> sont renseignées seulement après le rendu initial du composant, et elles ne sont pas réactives. Il s'agit seulement d'une trappe de sortie pour faire de la manipulation directe d'enfants - vous devriez éviter d'accéder aux <code>$refs</code> depuis l'intérieur de templates ou depuis des propriétés calculées.</p>

### Injection de dépendances

Précédemment, quand nous avons décrit l'[accès à l'instance de composant parente](#Acceder-a-l’instance-de-composant-parente), nous avons montré un exemple comme ceci :

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

Dans ce composant, tous les descendants de `<google-map>` avaient besoin d'accéder à une méthode `getMap`, afin de savoir avec quelle carte interagir. Malheusement, utiliser la propriété `$parent` s'adapte mal avec des composants imbriqués plus profondément. C'est là où l'injection de dépendances peut s'avérer utile, en utilisant deux nouvelles options d'instance : `provide` et `inject`.

Les options `provide` nous permettent de spécifier quelles données/méthodes nous voulons **fournir** aux composants descendants. Dans ce cas, il s'agit de la méthode `getMap` à l'intérieur de `<google-map>`:

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

Ensuite, dans n'importe quel descendant, nous pouvons utiliser l'option `inject` pour récupérer des propriétés spécifiques que nous voulons ajouter à cette instance :

```js
inject: ['getMap']
```

Vous pouvez voir l'[exemple complet ici](https://jsfiddle.net/chrisvfritz/tdv8dt3s/). L'avantage par rapport à `$parent` est que nous pouvons accéder à `getMap` dans _n'importe quel_ composant descendant, sans avoir à exposer l'instance entière de `<google-map>`. Cela nous permet de continuer à développer ce composant de façon plus sûre, sans crainte de devoir changer/supprimer quelque-chose sur lequel repose un composant enfant. L'interface entre ces composants reste clairement définie, tout comme avec les `props`.

En fait, vous pouvez vous représenter l'injection de dépendances comme une sorte de « props à longue distance », sauf que :

* les composants ancêtres n'ont pas besoin de connaître quels descendants utilisent les propriétés qu'ils fournissent
* les composants descendants n'ont pas besoin de savoir d'où proviennent les propriétés injectées

<p class="tip">Cependant, il y a des inconvénents à l'injection de dépendances. Cela vient entériner la manière dont les composants sont actuellement organisés dans votre application, rendant plus difficile le remaniement de code. De plus, les propriétés fournies avec `provide` ne sont pas réactives. Cela a été intentionnellement conçu de cette façon, car les utiliser pour créer un espace de stockage global est tout aussi peu évolutif que <a href="#Acceder-a-l’instance-de-composant-parente">d'utiliser <code>$root</code></a> dans le même but. Si les propriétés que vous voulez partager sont spécifiques à votre application et non génériques, ou si jamais vous voulez mettre à jour des données fournies par des ancêtres, alors c'est un signe que vous avez probablement besoin d'une réelle solution de gestion d'état telle que <a href="https://github.com/vuejs/vuex">Vuex</a> à la place.</p>

Apprenez-en plus sur l'injection de dépendances dans [la documentation de l'API](https://vuejs.org/v2/api/#provide-inject).

## Écouteurs d'événements programmatiques

Jusqu'à présent, vous avez vu des utilisations de `$emit`, écoutés avec `v-on`, mais les instances de Vue proposent aussi d'autres méthodes dans leur interface d'événements. Nous pouvons :

- Écouter un événement avec `$on(eventName, eventHandler)`
- Écouter un événement une seule fois avec `$once(eventName, eventHandler)`
- Arrêter d'écouter un événement avec `$off(eventName, eventHandler)`

Vous n'aurez pas à les utiliser normalement, mais ils sont disponibles dans les cas où vous avez besoin d'écouter manuellement des événements sur une instance de composant. Ils peuvent aussi être utiles comme outil d'organisation de code. Par exemple, vous pouvez souvent voir ce pattern pour intégrer une bibliothèque tierce :

```js
// Attache un sélecteur de date à un champ
// une fois celui-ci monté sur le DOM.
mounted: function () {
  // Pikaday est une bibliothèque tierce de sélecteur de date
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// Juste avant que le composant soit détruit,
// on détruit également le sélecteur de date.
beforeDestroy: function () {
  this.picker.destroy()
}
```

Il y a deux problèmes potentiels :

- Cela requiert d'enregistrer le `picker` dans l'instance de composant, alors qu'il est possible que seuls les hooks de cycle de vie aient besoin d'y accéder. Ce n'est pas très grave, mais cela peut être considéré comme de l'encombrement.
- Notre code de montage du composant est séparé du code de nettoyage, ce qui rend plus difficile de nettoyer programmatiquement tout ce que nous avons mis en place avant.

Vous pouvez résoudre ces deux problèmes avec un écouteur programmatique :

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

En utilisant cette stratégie, nous pouvons même utiliser Pikaday sur plusieurs champs, avec chaque nouvelle instance qui nettoiera automatiquement après son passage :

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

Consultez [ce fiddle](https://jsfiddle.net/chrisvfritz/1Leb7up8/) pour le code complet. Notez cependant que si vous vous trouvez à devoir faire beaucoup de code de montage et de nettoyage au sein d'un seul composant, la meilleure solution sera souvent de créer des composants plus modulaires. Dans le cas présent, nous recommanderions de créer un composant réutilisable `<input-datepicker>`.

Pour en apprendre plus sur les écouteurs programmatiques, allez voir l'API des [méthodes d'événements d'une instance](https://vuejs.org/v2/api/#Instance-Methods-Events).

<p class="tip">Notez que le système d'événements de Vue est différent de celui de <a href="https://developer.mozilla.org/fr/docs/Web/API/EventTarget">l'API EventTarget</a> du navigateur. Bien qu'ils fonctionnent de façon similaire, <code>$emit</code>, <code>$on</code>, et <code>$off</code> ne sont <strong>pas</strong> des alias pour <code>dispatchEvent</code>, <code>addEventListener</code>, et <code>removeEventListener</code>.</p>

## Références circulaires

### Composants récursifs

Les composants peuvent récursivement s'invoquer eux-mêmes dans leur propre template. Cependant, ils peuvent seulement le faire avec l'option `name` :

``` js
name: 'nom-unique-de-mon-composant'
```

Quand vous inscrivez globalement un composant en utilisant `Vue.component`, l'ID global est automatiquement assigné comme option `name` du composant.

``` js
Vue.component('nom-unique-de-mon-composant', {
  // ...
})
```

Si vous n'êtes pas prudents, les composants récursifs peuvent mener à des boucles infinies :

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

Un composant comme ci-dessus résultera en une erreur « Taille maximale de la pile dépassée », donc assurez-vous de rendre conditionnelle l'invocation récursive (par ex. avec un `v-if` qui sera `false` à la fin).

### Références circulaires entre composants

Supposons que vous construisez un arbre de répertoires de fichiers, comme le Finder ou l'explorateur de fichiers. Vous pourriez avoir un composant `tree-folder` avec ce template :

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Puis un composant `tree-folder-contents` avec ce template:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

Si vous regardez de plus près, vous verrez que ces composants sont en fait les descendants __et__ ancêtres l'un de l'autre dans l'arbre de rendu - un paradoxe ! Quand vous inscrivez des composants globalement avec `Vue.component`, ce paradoxe est résolu automatiquement pour vous. Si c'est votre cas, vous pouvez arrêter de lire ici.

Cependant, si vous importez des composants en utilisant un __système de modules__, p.ex. via Webpack ou Browserify, vous aurez une erreur :

```
Failed to mount component: template or render function not defined.
```

Pour expliquer ce qui se passe, appelons nos composants A et B. Le système de modules sait qu'il a besoin de A, mais A a d'abord besoin de B, mais B a besoin de A, mais A a besoin de B, etc. Il est alors bloqué dans une boucle, ne sachant pas comment résoudre un composant sans devoir d'abord résoudre l'autre. Pour corriger cela, nous devons donner au système de modules un point où il peut dire, "A aura _prochainement_ besoin de B, mais il n'y a pas besoin de résoudre B en premier."

Dans notre cas, faisons de ce point le composant `tree-folder`. Nous savons que l'enfant qui crée le paradoxe est le composant `tree-folder-contents`, donc nous allons attendre le hook de cycle de vie `beforeCreate` avant de l'inscrire :

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

Ou comme alternative, vous pouvez utiliser l'`import` asynchrone de Webpack lorsque vous inscrivez le composant localement :

``` js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

Problème résolu !

## Définitions alternatives de template

### Templates inline

Quand l'attribut spécial `inline-template` est présent sur un composant enfant, le composant utilisera son contenu interne comme template, plutôt que de le traiter comme contenu distribué. Cela permet plus de flexibilité dans la création de templates.

``` html
<my-component inline-template>
  <div>
    <p>Ces éléments sont compilés en tant que propre template du composant.</p>
    <p>Et non le contenu du parent par transclusion.</p>
  </div>
</my-component>
```

Votre template inline a besoin d'être défini à l'intérieur de l'élément du DOM pour être attaché à Vue.

<p class="tip">Cependant, <code>inline-template</code> rend la portée de vos templates plus difficile à appréhender. Une bonne pratique est de préférer la définition de templates à l'intérieur du composant en utilisant l'option <code>template</code> ou dans un élément <code>&lt;template&gt;</code> dans un fichier <code>.vue</code>.</p>

### X-Templates

Une autre façon de définir des templates est à l'intérieur d'un élément script avec le type `text/x-template`, puis en référencant le template par un id. Par exemple :

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

Votre x-template a besoin d'être défini à l'extérieur de l'élément du DOM pour être attaché à Vue.

<p class="tip">Ce type de templates peut être utile pour des démos avec de gros templates ou dans des applications extrêmements petites, mais sinon il doit être évité, car ils séparent les templates du reste de la définition du composant.</p>

## Contrôler les mises à jour

Grâce au système de réactivité de Vue, le framework sait toujours quand mettre à jour la vue (si vous l'utilisez correctement). Il y a des cas particuliers, cependant, où vous pouvez vouloir forcer une mise à jour, malgré le fait qu'aucune donnée réactive n'a changé. De plus, il y a d'autres cas où vous voudrez empêcher des mises à jour non nécessaires.

### Forcer une mise à jour

<p class="tip">Si vous vous trouvez à vouloir forcer une mise à jour dans Vue, dans 99,99% des cas, vous avez fait une erreur quelque-part.</p>

Vous n'avez peut-être pas pris en compte les avertissements pour la détection des changements [avec des `Array`](https://vuejs.org/v2/guide/list.html#Caveats) ou [des objets](https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats), ou alors vous vous reposez sur des propriétés d'état qui ne sont pas traquées par le système de réactivité de Vue, c-à-d. dans `data`.

Cependant, si vous avez exclu toutes les options précédentes et que vous vous trouvez dans cette situation extrêmement rare où vous avez à forcer manuellement une mise à jour, vous pouvez le faire avec [`$forceUpdate`](../api/#vm-forceUpdate).

### Composants statiques économes avec `v-once`

Faire le rendu d'éléments HTML statiques est très rapide dans Vue, mais parfois vous pouvez avoir un composant qui contient **une grande quantité** de contenu statique. Dans ces cas, vous pouvez vous assurer qu'il ne sera évalué qu'une seule fois puis mis en cache en ajoutant la directive `v-once` à l'élément racine, comme ceci :

``` js
Vue.component('conditions-d-utilisation', {
  template: `
    <div v-once>
      <h1>Conditions d'utilisation</h1>
      ... un tas de contenu statique ...
    </div>
  `
})
```

<p class="tip">Encore une fois, essayez de ne pas surutiliser ce pattern. Bien qu'il soit pratique dans les rares cas où vous avez à faire le rendu de beaucoup de contenu statique, il n'est simplement pas nécessaire à moins que vous constatez effectivement un temps de rendu plutôt long - de plus, il peut causer beaucoup de confusion plus tard. Par exemple, imaginez un autre développeur qui n'est pas familier avec <code>v-once</code> ou simplement qui ne l'a pas remarqué dans le template. Il peut passer des heures à essayer de comprendre pourquoi le template ne se met pas à jour correctement.</p>
