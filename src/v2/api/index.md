---
type: api (En)
---

## Configuration globale

<p class="tip">**Cette page est en cours de traduction française. Revenez une autre fois pour lire une traduction achevée ou [participez à la traduction française ici](https://github.com/vuejs-fr/vuejs.org).**</p><p>`Vue.config` est un objet contenant les configurations globales de Vue. Vous pouvez modifier les propriétés listées ci-dessous avant de mettre en place votre application :</p>

### silent

- **Type :** `boolean`

- **Par défaut :** `false`

- **Utilisation :**

  ``` js
  Vue.config.silent = true
  ```

  Supprime tous les logs et warnings de Vue.js.

### optionMergeStrategies

- **Type :** `{ [key: string]: Function }`

- **Par défaut :** `{}`

- **Utilisation :**

  ``` js
  Vue.config.optionMergeStrategies._mon_option = function (parent, enfant, vm) {
    return enfant + 1
  }

  const Profil = Vue.extend({
    _mon_option: 1
  })

  // Profil.options._mon_option = 2
  ```

  Définit des stratégies personnalisées de fusion pour les options.

  La stratégie de fusion reçoit en arguments la valeur de cette option définie dans le parent et les instances enfants en tant que premier et second argument, respectivement. L'instance de Vue est passée en troisième argument.

- **Voir aussi** : [Stratégies personnalisées de fusion d'options](../guide/mixins.html#Custom-Option-Merge-Strategies)

### devtools

- **Type :** `boolean`

- **Par défaut :** `true` (`false` dans les versions de production)

- **Utilisation :**

  ``` js
  // assurez-vous d'assigner ça de manière synchrone immédiatement après avoir chargé Vue
  Vue.config.devtools = true
  ```

  Autorise ou non l'inspection des [vue-devtools](https://github.com/vuejs/vue-devtools). Cette option a comme valeur par défaut `true` dans les versions de développement et `false` dans les versions de production. Vous pouvez l'assigner à `true` pour activer l'inspection avec les versions de production.

### errorHandler

- **Type :** `Function`

- **Par défaut :** `undefined`

- **Utilisation :**

  ``` js
  Vue.config.errorHandler = function (err, vm, info) {
    // gérer le cas d'erreur
    // `info` est une information spécifique à Vue sur l'erreur,
    // par exemple dans quel hook du cycle de vie l'erreur a été trouvée
    // Disponible uniquement en 2.2.0+
  }
  ```

  Définit un gestionnaire pour les erreurs non interceptées pendant le rendu d'un composant et les appels aux observateurs. Ce gestionnaire sera appelé avec comme arguments l'erreur et l'instance de Vue associée.

  > En 2.2.0, ce hook capture également les erreurs dans les hooks du cycle de vie des composants. De plus, quand ce hook est `undefined`, les erreurs capturées seront loguées avec `console.error` plutôt qu'avoir un crash de l'application.

  > In 2.4.0 this hook also captures errors thrown inside Vue custom event handlers.

  > [Sentry](https://sentry.io), un service de traçage d'erreur, fournit une [intégration officielle](https://sentry.io/for/vue/) utilisant cette option.

### warnHandler

> New in 2.4.0

- **Type:** `Function`

- **Default:** `undefined`

- **Usage:**

  ``` js
  Vue.config.warnHandler = function (msg, vm, trace) {
    // trace is the component hierarchy trace
  }
  ```

  Assign a custom handler for runtime Vue warnings. Note this only works during development and is ignored in production.

### ignoredElements

- **Type :** `Array<string>`

- **Par défaut :** `[]`

- **Utilisation :**

  ``` js
  Vue.config.ignoredElements = [
    'mon-web-component', 'un-autre-web-component'
  ]
  ```

  Indique à Vue d'ignorer les éléments personnalisés définis en dehors de Vue (ex. : en utilisant les API Web Components). Autrement, un message d'avertissement `Unknown custom element` sera affiché, supposant que vous avez oublié d'inscrire un composant global ou fait une faute de frappe dans son nom.

### keyCodes

- **Type :** `{ [key: string]: number | Array<number> }`

- **Par défaut :** `{}`

- **Utilisation :**

  ```js
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    // camelCase won`t work
    mediaPlayPause: 179,
    // instead you can use kebab-case with double quotation marks
    "media-play-pause" : 179,
    up: [38, 87]
  }
  ```

  ```html
  <input type="text" @keyup.media-play-pause="method">
  ```

  Définit des alias pour les touches avec `v-on`.

### performance

> Nouveau en 2.2.0

- **Type :** `boolean`

- **Par défaut :** `false` (à partir de la 2.2.3)

- **Utilisation :**

  Assignez ceci à `true` pour activer le suivi des performances pour l'initialisation, la compilation, le rendu et la mise à jour des composants dans la timeline des outils développeur des navigateurs. Fonctionne uniquement en mode développement et dans les navigateurs supportant l'API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

### productionTip

> Nouveau en 2.2.0

- **Type :** `boolean`

- **Par défaut :** `true`

- **Utilisation :**

  Assignez ceci à `false` pour ne plus avoir la notification de production au démarrage de Vue.

## API globale

<h3 id="Vue-extend">Vue.extend( options )</h3>

- **Arguments :**
  - `{Object} options`

- **Utilisation :**

  Crée une « sous-classe » du constructeur de base Vue. L'argument doit être un objet contenant les options du composant.

  Le cas spécial à noter ici est l'option `data` - il doit s'agir d'une fonction quand utilisé avec `Vue.extend()`.

  ``` html
  <div id="point-de-montage"></div>
  ```

  ``` js
  // crée un constructeur réutilisable
  var Profil = Vue.extend({
    template: '<p>{{prenom}} {{nom}} alias {{alias}}</p>',
    data: function () {
      return {
        prenom: 'Walter',
        nom: 'White',
        alias: 'Heisenberg'
      }
    }
  })
  // crée une instance de Profil et la monte sur un élément
  new Profil().$mount('#point-de-montage')
  ```

  Cela donnera comme résultat :

  ``` html
  <p>Walter White aka Heisenberg</p>
  ```

- **Voir aussi :** [Composants](../guide/components.html)

<h3 id="Vue-nextTick">Vue.nextTick( [callback, contexte] )</h3>

- **Arguments :**
  - `{Function} [callback]`
  - `{Object} [contexte]`

- **Utilisation :**

  Reporte l'exécution du callback au prochain cycle de mise à jour du DOM. Utilisez-le immédiatement après avoir changé des données afin d'attendre la mise à jour du DOM.

  ``` js
  // modification de données
  vm.msg = 'Salut'
  // le DOM n'a pas encore été mis à jour
  Vue.nextTick(function () {
    // le DOM est à jour
  })
  ```

  > Nouveauté  de la 2.1.0: retourne une Promise si aucune fonction de callback n'est fournie et si Promise est supporté par l'environnement d'exécution.

- **Voir aussi :** [File de mise à jour asynchrone](../guide/reactivity.html#Async-Update-Queue)

<h3 id="Vue-set">Vue.set( cible, clé, valeur )</h3>

- **Arguments :**
  - `{Object | Array} cible`
  - `{string | number} clé`
  - `{any} valeur`

- **Retourne:** la valeur assignée.

- **Utilisation :**

  Assigne une propriété à un objet cible. Si l'objet est réactif, cette méthode s'assure que la propriété est créée en tant que propriété réactive et déclenche les mises à jour de la vue. Ceci est principalement utilisé pour passer outre la limitation de Vue qui est de ne pas pouvoir détecter automatiquement l'ajout de nouvelles propriétés.

  **Notez que l'objet ne peut pas être une instance de Vue, ou l'objet de données à la racine d'une instance de Vue.**

- **Voir aussi :** [Réactivité en détail](../guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( cible, clé )</h3>

- **Arguments :**
  - `{Object | Array} cible`
  - `{string | number} clé`

- **Utilisation :**

  Supprime une propriété d'un objet cible. Si l'objet est réactif, cette méthode s'assure que la suppression déclenche les mises à jour de la vue. Ceci est principalement utilisé pour passer outre la limitation de Vue qui est de ne pas pouvoir détecter automatiquement la suppression de propriétés, mais vous devriez rarement en avoir besoin.

  > Fonctionne aussi avec un `Array` + index en 2.2.0+.

  <p class="tip">L'objet cible ne peut pas être une instance de Vue, ou l'objet de données à la racine d'une instance de Vue.</p>

- **Voir aussi :** [Réactivité en détail](../guide/reactivity.html)

<h3 id="Vue-directive">Vue.directive( id, [définition] )</h3>

- **Arguments :**
  - `{string} id`
  - `{Function | Object} [définition]`

- **Utilisation :**

  Inscrit ou récupère une directive globale.

  ``` js
  // inscrit une directive
  Vue.directive('ma-directive', {
    bind: function () {},
    inserted: function () {},
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {}
  })

  // inscrit une directive comme simple fonction
  Vue.directive('ma-directive', function () {
    // cette fonction sera appelée comme `bind` et `update` ci-dessus
  })

  // accesseur, retourne la définition de la directive si inscrite
  var maDirective = Vue.directive('ma-directive')
  ```

- **Voir aussi :** [Directives personnalisées](../guide/custom-directive.html)

<h3 id="Vue-filter">Vue.filter( id, [définition] )</h3>

- **Arguments :**
  - `{string} id`
  - `{Function} [définition]`

- **Utilisation :**

  Inscrit ou récupère un filtre global.

  ``` js
  // inscrit un filtre
  Vue.filter('mon-filtre', function (value) {
    // retourne la valeur modifiée
  })

  // accesseur, retourne le filtre si inscrit
  var monFiltre = Vue.filter('mon-filtre')
  ```

<h3 id="Vue-component">Vue.component( id, [définition] )</h3>

- **Arguments :**
  - `{string} id`
  - `{Function | Object} [définition]`

- **Utilisation :**

  Inscrit ou récupère un composant global. L'inscription assigne aussi automatiquement la propriété `name` du composant au paramètre `id` donné.

  ``` js
  // inscrit un constructeur étendu
  Vue.component('mon-composant', Vue.extend({ /* ... */ }))

  // inscrit un composant avec un objet options (appelle automatiquement Vue.extend)
  Vue.component('mon-composant', { /* ... */ })

  // récupère un composant inscrit (retourne toujours le constructeur)
  var MonComposant = Vue.component('mon-composant')
  ```

- **Voir aussi :** [Composants](../guide/components.html).

<h3 id="Vue-use">Vue.use( plugin )</h3>

- **Arguments :**
  - `{Object | Function} plugin`

- **Utilisation :**

  Installe un plugin Vue.js. Si l'argument plugin est de type Object, il doit exposer une méthode  `install`. S'il s'agit d'une fonction, elle sera utilisée comme méthode d'installation. Cette méthode d'installation sera appelée avec Vue en tant qu'argument.

  Quand cette méthode est appelée avec le même plugin plusieurs fois, le plugin ne sera installée qu'une seule fois.

- **Voir aussi :** [Plugins](../guide/plugins.html).

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **Arguments :**
  - `{Object} mixin`

- **Utilisation :**

  Applique une mixin globale, qui affecte toutes les instances de Vue créées par la suite. Cela peut être utilisé par les créateurs de plugins pour injecter un composant personnalisé dans les composants. **Non recommandé dans le code applicatif**.

- **Voir aussi :** [Mixins globales](../guide/mixins.html#Global-Mixin)

<h3 id="Vue-compile">Vue.compile( template )</h3>

- **Arguments :**
  - `{string} template`

- **Utilisation :**

  Compile une string template en une fonction de rendu. **Disponible uniquement sur la version complète.**

  ``` js
  var res = Vue.compile('<div><span>{{ msg }}</span></div>')

  new Vue({
    data: {
      msg: 'salut'
    },
    render: res.render,
    staticRenderFns: res.staticRenderFns
  })
  ```

- **Voir aussi :** [Fonctions de rendu](../guide/render-function.html)
 
<h3 id="Vue-version">Vue.version</h3>

- **Détails :** Donne la version de Vue installée sous forme de `String`. C'est particulièrement utile pour les plugins et les composants de la communauté, où vous pouvez être amenés à utiliser différentes stratégies pour différentes versions.

- **Utilisation :**

```js
var version = Number(Vue.version.split('.')[0])

if (version === 2) {
  // Vue v2.x.x
} else if (version === 1) {
  // Vue v1.x.x
} else {
  // Versions non supportées de Vue
}
```

## Options / Data

### data

- **Type :** `Object | Function`

- **Restriction :** accepte uniquement une fonction lorsqu'utilisé dans une définition de composant.

- **Détails :**

  L'objet de données pour l'instance de Vue. Vue va de manière récursive convertir ses propriétés en des accesseurs/mutateurs (*getter/setters*) afin de les rendre "réactives". **L'objet doit être un simple objet de base**: les objets natifs tels que les API du navigateur et les propriétés issues du prototype sont ignorées. Une règle d'or est que la donnée doit juste être de la donnée - il n'est pas recommandé d'observer des objets ayant leur propre comportement avec états.

  Une fois observé, vous ne pouvez plus ajouter de propriétés réactives à l'objet de données racine. C'est pourquoi il est recommandé de déclarer dès le départ toutes les propriétés réactives à la racine de l'objet de données, avant de créer l'instance.

  Après que l'instance ait été créée, l'objet de données initial peut être accédé via `vm.$data`. L'instance de Vue servira également de proxy pour toutes les propriétés trouvées dans l'objet de données, donc `vm.a` sera l'équivalent de `vm.$data.a`.

  Les propriétés commençant par `_` ou `$` ne seront **pas** proxyfiées par l'instance de Vue car elles pourraient entrer en conflit avec certaines propriétés internes et méthodes d'API de Vue. Vous devrez y accéder via `vm.$data._propriete`.

  Lors de la définition d'un **composant**, la propriété `data` doit être déclarée en tant que fonction retournant l'objet de données initial, car il y aura plusieurs instances créées utilisant la même définition. Si nous utilisons un objet classique pour `data`, le même objet sera **partagé par référence** à toutes les instances créées! En fournissant une fonction `data` , chaque fois qu'une nouvelle instance est créée, nous l'appelons simplement afin de récupérer une copie fraîche des données initiales.

  Si nécessaire, un clône profond de l'objet original peut être obtenu en passant `vm.$data` à travers `JSON.parse(JSON.stringify(...))`.

- **Exemple :**

  ``` js
  var data = { a: 1 }

  // création directe d'instance
  var vm = new Vue({
    data: data
  })
  vm.a // -> 1
  vm.$data === data // -> true

  // data doit être une fonction lorsqu'utilisée dans Vue.extend()
  var Composant = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

  <p class="tip">Notez que __vous ne devriez pas utiliser de fonctions fléchées pour la propriété `data`__ (exemple: `data: () => { return { a: this.maPropriete }}`). La raison est que les fonctions fléchées sont liées au contexte parent, donc `this` ne correspondra pas à l'instance de Vue et  `this.maPropriete` vaudra `undefined`.</p>

- **Voir aussi :** [Réactivité en détail](../guide/reactivity.html).

### props

- **Type :** `Array<string> | Object`

- **Détails :**

  Une liste ou un objet décrivant les attributs exposés par le composant afin de passer des données depuis le composant parent. Ce paramètre a une syntaxe simple basée sur un tableau (`Array`) et une syntaxe alternative basée sur un `Object` qui permet une configuration avancée telle qu'une vérification de typage, des contrôles de validation personnalisés et des valeurs par défaut.

- **Exemple :**

  ``` js
  // syntaxe simple
  Vue.component('props-démo-simple', {
    props: ['taille', 'monMessage']
  })

  // syntaxe avancée avec validation
  Vue.component('props-démo-avancée', {
    props: {
      // juste une vérification de type
      hauteur: Number,
      // vérification du type ainsi que d'autres validations
      âge: {
        type: Number,
        default: 0,
        required: true,
        validator: function (valeur) {
          return valeur >= 0
        }
      }
    }
  })
  ```

- **Voir aussi :** [Attributs](../guide/components.html#Props)

### propsData

- **Type :** `{ [key: string]: any }`

- **Restriction :** utilisé uniquement si l'instance est créée via `new`.

- **Détails :**

  Passe des valeurs d'attribut à l'instance durant sa création. Cette propriété a pour but principal de faciliter les tests unitaires.

- **Exemple :**

  ``` js
  var Comp = Vue.extend({
    props: ['msg'],
    template: '<div>{{ msg }}</div>'
  })

  var vm = new Comp({
    propsData: {
      msg: 'salut'
    }
  })
  ```

### computed

- **Type :** `{ [key: string]: Function | { get: Function, set: Function } }`

- **Détails :**

  Les propriétés calculées qui seront ajoutées à l'instance de Vue. Tous les accesseurs (*getters*) et mutateurs (*setters*) ont leur contexte `this` automatiquement lié à l'instance de Vue.

  <p class="tip">Notez que __vous ne devriez pas utiliser de fonctions fléchées pour définir une propriété calculée__ (exemple: `aDouble: () => this.a * 2`). La raison est que les fonctions fléchées sont liées au contexte parent, donc `this` ne correspondra pas à l'instance de Vue et `this.a` vaudra `undefined`.</p>

  Les propriétés calculées sont mises en cache, et réévaluées uniquement lorsque leurs dépendances réactives changent. Notez que si une certaine dépendance est en dehors de la portée de l'instance (et donc non réactive), la propriété calculée ne sera __pas__ mise à jour.

- **Exemple :**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // accesseur uniquement, on a juste besoin d'une fonction
      aDouble: function () {
        return this.a * 2
      },
      // accesseur et mutateur à la fois
      aPlus: {
        get: function () {
          return this.a + 1
        },
        set: function (v) {
          this.a = v - 1
        }
      }
    }
  })
  vm.aPlus   // -> 2
  vm.aPlus = 3
  vm.a       // -> 2
  vm.aDouble // -> 4
  ```

- **Voir aussi :**
  - [Propriétés calculées](../guide/computed.html)

### methods

- **Type :** `{ [key: string]: Function }`

- **Détails :**

  Les méthodes qui seront ajoutées à l'instance de Vue. Vous pouvez accéder à ces méthodes directement depuis l'instance VM ou les utiliser à travers des expressions de directives. Toutes les méthodes ont leur contexte d'appel `this` automatiquement assigné à l'instance de Vue.
  
  <p class="tip">Notez que __vous ne devriez pas utiliser de fonctions fléchées pour définir une méthode__ (exemple: `plus: () => this.a++`). La raison est que les fonctions fléchées sont liées au contexte parent, donc `this` ne correspondra pas à l'instance de Vue et `this.a` vaudra `undefined`.</p>

- **Exemple :**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    methods: {
      plus: function () {
        this.a++
      }
    }
  })
  vm.plus()
  vm.a // 2
  ```

- **Voir aussi :** [Méthodes et gestion d'évènements](../guide/events.html)

### watch

- **Type :** `{ [key: string]: string | Function | Object }`

- **Détails :**

  Un objet où les clés sont des expressions à surveiller et où la valeur associée est la fonction de callback exécutée quand cette expression change. On parle alors d'observateur ou *watcher* pour décrire ce lien. La valeur peut également être une `String` correspondant au nom d'une méthode de l'instance, ou un objet avec des options avancées. L'instance de Vue appelera `$watch()` pour chaque clé de l'objet à l'initialisation.

- **Exemple :**

  ``` js
  var vm = new Vue({
    data: {
      a: 1,
      b: 2,
      c: 3
    },
    watch: {
      a: function (valeur, ancienneValeur) {
        console.log('nouveau: %s, ancien: %s', valeur, ancienneValeur)
      },
      // nom d'une méthode
      b: 'uneMéthode',
      // observateur profond (deep watcher)
      c: {
        handler: function (valeur, ancienneValeur) { /* ... */ },
        deep: true
      }
    }
  })
  vm.a = 2 // -> nouveau: 2, ancien: 1
  ```
  
  <p class="tip">Notez que __vous ne devriez pas utiliser de fonctions fléchées pour définir un observateur__ (exemple: `saisie: nouvelleValeur => this.actualiserSuggestions(nouvelleValeur)`). La raison est que les fonctions fléchées sont liées au contexte parent, donc `this` ne correspondra pas à l'instance de Vue et `this.actualiserSuggestions` vaudra `undefined`.</p>

- **Voir aussi :** [Méthodes d'instance - vm.$watch](#vm-watch)

## Options / DOM

### el

- **Type :** `string | HTMLElement`

- **Restriction :** uniquement respecté quand l'instance est créée via `new`.

- **Détails :**

  Fournit à l'instance de Vue un élément existant du DOM sur lequel se monter. Cela peut être une `String` représentant un sélecteur CSS ou une référence à un `HTMLElement`.

  Une fois l'instance montée, l'élément correspondant sera accessible via `vm.$el`.

  Si cette option est disponible à l'instanciation, l'instance sera immédiatement compilée; sinon, l'utilisateur devra explicitement appeler `vm.$mount()` pour démarrer manuellement la compilation.

  <p class="tip">L'élément fourni sert seulement de point de montage. Contrairement à Vue 1.x, l'élément monté sera remplacé par le DOM généré par Vue dans tous les cas. C'est pourquoi il n'est pas recommandé de monter l'instance racine sur `<html>` ou `<body>`.</p>

  <p class="tip">Si ni la fonction `render` ni l'option `template` ne sont présentes, le code HTML de l'élément du DOM sur lequel le composant est monté sera extrait et défini comme template de ce composant. Dans ce cas, la version "Runtime + Compilateur" de Vue doit être utilisée.</p>

- **Voir aussi :**
  - [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)
  - [Runtime + Compilateur vs. Runtime uniquement](../guide/installation.html#Runtime-Compiler-vs-Runtime-only)

### template

- **Type :** `string`

- **Détails :**

  Un template sous forme de chaîne de caractères qui sera utilisé comme balisage HTML pour l'instance de Vue. Le template viendra **remplacer** l'élément monté. Tout code HTML existant à l'intérieur de l'élément monté sera ignoré, à moins que des emplacements de distribution de contenu (slots) soient présents dans le template.

  Si la chaîne de caractères commence par `#`, elle sera évaluée comme `querySelector` et le `innerHTML` de l'élément sélectionné sera utilisé comme template. Cela permet d'utiliser l'astuce du `<script type="x-template">` pour inclure des templates.

  <p class="tip">D'un point de vue sécurité, vous devriez uniquement utiliser des templates Vue auxquels vous pouvez faire confiance. N'utilisez jamais du contenu généré côté utilisateur comme template.</p>

  <p class="tip">Si la fonction `render` est présente comme option de l'instance de Vue, le template sera ignoré.</p>

- **Voir aussi :**
  - [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)
  - [Distribution de Contenu](../guide/components.html#Content-Distribution-with-Slots)

### render

  - **Type :** `(createElement: () => VNode) => VNode`

  - **Détails :**

    Une alternative aux templates en chaîne de caractères vous permettant d'exploiter toute la puissance programmatique de JavaScript. La fonction de rendu `render` reçoit une méthode `createElement` comme premier argument servant à créer des `VNode`s.

    Si le composant est un composant fonctionnel, la fonction `render` recevra aussi un argument supplémentaire `context`, qui donne accès aux données contextuelles puisque les composants fonctionnels sont sans instance.
    
    <p class="tip">La fonction `render` a la priorité par rapport à la fonction de rendu compilée à partir de l'option `template`, ou par rapport au template HTML de l'élément d'ancrage dans le DOM qui est spécifié par l'option `el`.</p>

  - **Voir aussi :**
    - [Fonctions de Rendu](../guide/render-function)

### renderError

> Nouveau en 2.2.0

  - **Type :** `(createElement: () => VNode, error: Error) => VNode`

  - **Détails :**

    **Fonctionne uniquement en mode développement.**

    Fournit un rendu alternatif en sortie quand la fonction `render` par défaut rencontre une erreur. L'erreur sera passée à `renderError` comme second argument. C'est particulièrement appréciable quand utilisé conjointement avec du rechargement à chaud (hot-reload).

  - **Exemple :**

    ``` js
    new Vue({
      render (h) {
        throw new Error('oups')
      },
      renderError (h, err) {
        return h('pre', { style: { color: 'red' }}, err.stack)
      }
    }).$mount('#app')
    ```

  - **Voir aussi ::**
    - [Fonctions de Rendu](../guide/render-function)


## Options / Hooks du cycle de vie

Tous les hooks du cycle de vie ont automatiquement leur contexte `this` rattaché à l'instance, afin que vous puissiez accéder aux données, propriétés calculées et méthodes. Cela signifie que __vous ne devriez pas utiliser une fonction fléchée pour définir une méthode du cycle de vie__  (p. ex. `created: () => this.fetchTodos()`). La raison est que les fonctions fléchées utilisent le contexte parent, donc `this` ne sera pas l'instance de Vue comme vous pouvez vous y attendre et `this.fetchTodos` sera `undefined`.

### beforeCreate

- **Type :** `Function`

- **Détails :**

  Appelé de manière synchrone juste après que l'instance ait été initialisée, et avant l'observation des données et l'installation des évènements/observateurs.

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

### created

- **Type :** `Function`

- **Détails :**

  Appelé de manière synchrone après que l'instance ait été créée. À ce stade, l'instance a fini de traiter les options, ce qui signifie que les éléments suivants ont été installés: observation des données, propriétés calculées, méthodes, fonctions de retour des observateurs et évènements. Cependant, la propriété `$el` n'est pas encore disponible.

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

### beforeMount

- **Type :** `Function`

- **Détails :**

  Appelé juste avant que le montage commence: la fonction `render` est sur le point d'être appelée pour la première fois.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

### mounted

- **Type :** `Function`

- **Détails :**

  Appelé juste après que l'instance ait été montée, là où `el` est remplacé par le nouvellement créé `vm.$el`. Si l'instance à la racine est montée sur un élément du document, alors `vm.$el` sera aussi dans le document quand `mounted` est appelé.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

### beforeUpdate

- **Type :** `Function`

- **Détails :**

  Appelé quand les données changent, avant le nouveau rendu et le patch du DOM virtuel.

  Vous pouvez effectuer d'autres changements d'état dans ce hook et ils ne déclencheront pas de rendus additionnels.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

### updated

- **Type :** `Function`

- **Détails :**

  Appelé après qu'un changement d'une donnée ait causé un nouveau rendu et patch du DOM virtuel.

  Le DOM du composant aura été mis à jour quand ce hook est appelé, donc vous pouvez effectuer des opérations dépendantes du DOM ici. Cependant, dans la plupart des cas, vous devriez éviter de changer l'état dans ce hook. Pour réagir à des changements d'état, il vaut généralement mieux utiliser une [propriété calculée](#computed) ou un [observateur](#watch) à la place.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

### activated

- **Type :** `Function`

- **Détails :**

  Appelé quand un composant gardé en vie (`keep-alive`) est activé.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :**
  - [Composants intégrés de base - keep-alive](#keep-alive)
  - [Composants dynamiques - keep-alive](../guide/components.html#keep-alive)

### deactivated

- **Type :** `Function`

- **Détails :**

  Appelé quand un composant gardé en vie (`keep-alive`) est désactivé.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :**
  - [Composants intégrés de base - keep-alive](#keep-alive)
  - [Composants dynamiques - keep-alive](../guide/components.html#keep-alive)

### beforeDestroy

- **Type :** `Function`

- **Détails :**

  Appelé juste avant qu'une instance de Vue ne soit détruite. À ce stade, l'instance est toujours pleinement fonctionnelle.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

### destroyed

- **Type :** `Function`

- **Détails :**

  Appelé après qu'une instance de Vue ait été détruite. Quand ce hook est appelé, toutes les directives de l'instance de Vue ont été détachées, tous les écouteurs d'évènements ont été supprimés et toutes les instances de Vue enfants ont également été détruites.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

## Options / Ressources

### directives

- **Type :** `Object`

- **Détails :**

  Un objet de mappage des directives à mettre à disposition de l'instance de Vue.

- **Voir aussi :**
  - [Directives Personnalisées](../guide/custom-directive.html)

### filters

- **Type :** `Object`

- **Détails :**

  Un objet de mappage des filtres à mettre à disposition de l'instance de Vue.

- **Voir aussi :**
  - [`Vue.filter`](#Vue-filter)

### components

- **Type :** `Object`

- **Détails :**

  Un objet de mappage des composants à mettre à disposition de l'instance de Vue.

- **Voir aussi :**
  - [Components](../guide/components.html)

## Options / Divers

### parent

- **Type :** `Instance de Vue`

- **Détails :**

  Spécifie l'instance parente pour l'instance qui va être crée. Établit une relation parent-enfant entre les deux. Le parent sera accessible via `this.$parent` pour l'enfant, et l'enfant sera ajouté à la liste `$children` du parent.

  <p class="tip">Utilisez `$parent` et `$children` avec parcimonie - ils servent surtout comme écoutille de secours. Préférez l'utilisation de propriétés et d'évènements pour la communication parent-enfant.</p>

### mixins

- **Type :** `Array<Object>`

- **Détails :**

  L'option `mixins` accepte une liste d'objets *mixin*. Ces objets *mixin* peuvent contenir des options d'instance tout comme des objets d'instance normaux, et elles seront fusionnées avec les éventuelles options existantes en utilisant la même stratégie de fusion que dans `Vue.extend()`. Par exemple, si votre *mixin* contient un hook `created` et que le composant lui-même en a égélement un, les deux fonctions seront appelées.

  Les hooks de *mixin* sont appelés dans l'ordre dans lequel ils sont fournis, et appelés avant les propres hooks du composant.

- **Exemple :**

  ``` js
  var mixin = {
    created: function () { console.log(1) }
  }
  var vm = new Vue({
    created: function () { console.log(2) },
    mixins: [mixin]
  })
  // -> 1
  // -> 2
  ```

- **Voir aussi :** [Mixins](../guide/mixins.html)

### extends

- **Type :** `Object | Function`

- **Détails :**

  Permet d'étendre déclarativement un autre composant (qui peut être un simple objet d'options ou un constructeur) sans avoir à utiliser `Vue.extend`. C'est destiné en premier lieu à rendre plus facile les extensions entre composants monofichiers.

  Cette option est similaire à `mixins`, la différence étant que les propres options du composant ont la priorité sur celles du composant source à étendre.

- **Exemple :**

  ``` js
  var CompA = { ... }

  // étend CompA sans avoir à appeler Vue.extend sur l'un ou l'autre
  var CompB = {
    extends: CompA,
    ...
  }
  ```

### provide / inject

> Nouveau en 2.2.0

- **Type :**
  - **provide :** `Object | () => Object`
  - **inject :** `Array<string> | { [key: string]: string | Symbol }`

- **Détails :**

  <p class="tip">`provide` et `inject` sont fournis principalement pour des cas d'utilisation avancés dans les bibliothèques de plugins / composants. Il n'est PAS recommandé de les utiliser dans du code applicatif générique.</p>

  Ces deux options sont utilisées ensemble pour permettre à un composant parent de servir d'injecteur de dépendances pour tous ses descendants, peu importe la profondeur de la hiérarchie de composants, tant qu'ils sont dans la même chaîne parente. Si vous êtes familiers avec React, c'est très similaire à la fonctionnalité de contexte dans React.

  L'option `provide` doit être un objet ou une fonction retournant un objet. Cet objet contient les propriétés qui sont disponibles pour l'injection dans ses descendants. Vous pouvez utiliser des `Symbol` ES2015 comme clés dans cet objet, mais seulement dans les environnements supportant nativement `Symbol` et `Reflect.ownKeys`.

  L'option `inject` doit être soit un `Array` de `String`, soit un objet où les clés sont les noms des liaisons locales et où les valeurs sont les clés (`String` ou `Symbol`) à rechercher dans les injections disponibles.

  > Note : les liaisons `provide` et `inject` ne sont PAS réactives. C'est intentionnel. Cependant, si vous passez un objet observé, les propriétés sur cet objet resteront réactives.

- **Exemple :**

  ``` js
  var Provider = {
    provide: {
      foo: 'bar'
    },
    // ...
  }

  var Enfant = {
    inject: ['foo'],
    created () {
      console.log(this.foo) // -> "bar"
    }
    // ...
  }
  ```

  Avec les `Symbol` ES2015, la fonction `provide` et l'objet `inject` :
  ``` js
  const s = Symbol()

  const Provider = {
    provide () {
      return {
        [s]: 'foo'
      }
    }
  }

  const Enfant = {
    inject: { s },
    // ...
  }
  ```

  > Les deux prochains exemples fonctionnent seulement avec Vue > 2.2.1. En dessous de cette version, les valeurs injectées étaient résolues après l'initialisation des `props` et de `data`.

  En utilisant une valeur injectée comme valeur par défaut pour une prop :
  ```js
  const Enfant = {
    inject: ['foo'],
    props: {
      bar: {
        default () {
          return this.foo
        }
      }
    }
  }
  ```

  En utilisant une valeur injectée comme entrée de données :
  ```js
  const Enfant = {
    inject: ['foo'],
    data () {
      return {
        bar: this.foo
      }
    }
  }
  ```

## Options / Divers

### name

- **Type :** `string`

- **Restriction :** respecté uniquement lorsqu'utilisé comme option du composant.

- **Détails :**

  Permet au composant de s'invoquer lui-même récursivement dans son template. Notez que lorsqu'un composant est déclaré globalement avec `Vue.component()`, l'identifiant global est automatiquement assigné à sa propriété `name`.

  Un autre bénéfice du fait de spécifier une option `name` est le débogage. Les composants nommés donnent des messages d'avertissement plus utiles. De plus, lorsque vous inspectez une application via les [vue-devtools](https://github.com/vuejs/vue-devtools), les composants non nommés s'afficheront en tant que `<AnonymousComponent>`, ce qui n'est pas très instructif. En fournissant une option `name`, vous obtiendrez bien plus d'informations dans l'arbre de composants.


### delimiters

- **Type :** `Array<string>`

- **Default:** `{% raw %}["{{", "}}"]{% endraw %}`

- **Détails :**

  Change les délimiteurs d'interpolation de texte. **Cette option est uniquement disponible en version complète.**

- **Exemple :**

  ``` js
  new Vue({
    delimiters: ['${', '}']
  })

  // Les délimiteurs ont été changés pour suivre le style des templates ES6
  ```

### functional

- **Type :** `Boolean`

- **Détails :**

  Rend le composant sans état (pas de propriété `data`) et sans instance (pas de contexte `this`). Il s'agit simplement d'une fonction `render` qui retourne des nœuds virtuels, ce qui réduit fortement les coûts en performance au rendu pour ce type de composants.

- **Voir aussi :** [Composants Fonctionnels](../guide/render-function.html#Functional-Components)

### model

> Nouveau en 2.2.0

- **Type :** `{ prop?: string, event?: string }`

- **Détails :**

  Permet à un composant personnalisé de définir la prop et l'événement utilisé quand il est utilisé avec `v-model`. Par défaut, `v-model` sur un composant utilise `value` comme prop et `input` comme événement, mais certains types de champs de saisie comme les cases à cocher et les boutons radio peuvent vouloir utiliser la prop `value` à d'autres fins. Utiliser l'option `model` peut éviter le conflit dans ce genre de cas.

- **Exemple :**

  ``` js
  Vue.component('ma-checkbox', {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      // cela permet d'utiliser la prop `value` à d'autres fins
      value: String,
      // utilise `checked` comme prop qui prend la place de `value`
      checked: {
        type: Number,
        default: 0
      }
    },
    // ...
  })
  ```

  ``` html
  <ma-checkbox v-model="foo" value="une certaine valeur"></ma-checkbox>
  ```

  Le code ci-dessus est équivalent à :

  ``` html
  <ma-checkbox
    :checked="foo"
    @change="val => { foo = val }"
    value="une certaine valeur">
  </ma-checkbox>
  ```

### inheritAttrs

> New in 2.4.0

- **Type:** `boolean`

- **Default:** `true`

- **Details:**

  By default, parent scope attribute bindings that are not recognized as props will "fallthrough" and be applied to the root element of the child component as normal HTML attributes. When authoring a component that wraps a target element or another component, this may not always be the desired behavior. By setting `inheritAttrs` to `false`, this default behavior can be disabled. The attributes are available via the `$attrs` instance property (also new in 2.4) and can be explicitly bound to a non-root element using `v-bind`.

### comments

> New in 2.4.0

- **Type:** `boolean`

- **Default:** `false`

- **Details:**

  When set to `true`, will preserve and render HTML comments found in templates. The default behavior is discarding them.

## Propriétés d'instance

### vm.$data

- **Type :** `Object`

- **Détails :**

  L'objet `data` est ce que l'instance de Vue observe. L'instance de Vue agit comme un proxy pour l'accès aux propriétés de cet objet `data`.

- **Voir aussi :** [Options - data](#data)

### vm.$props

> Nouveau en 2.2.0

- **Type :** `Object`

- **Détails :**

  Un objet représentant les props actuelles qu'un composant a reçu. L'instance de Vue agit comme un proxy pour accéder aux propriétés sur son objet `props`.

### vm.$el

- **Type :** `HTMLElement`

- **Accessible uniquement en lecture**

- **Détails :**

  L'élément racine du DOM que gère l'instance de Vue.

### vm.$options

- **Type :** `Object`

- **Accessible uniquement en lecture**

- **Détails :**

  Les options d'instanciation utilisées pour cette instance de Vue. C'est utile lorsque vous voulez inclure des propriétés personnalisées dans les options:

  ``` js
  new Vue({
    optionPersonnalisée: 'foo',
    created: function () {
      console.log(this.$options.optionPersonnalisée) // -> 'foo'
    }
  })
  ```

### vm.$parent

- **Type :** `Instance de Vue`

- **Accessible uniquement en lecture**

- **Détails :**

  L'instance parente, si l'instance actuelle en a une.

### vm.$root

- **Type :** `Instance de Vue`

- **Accessible uniquement en lecture**

- **Détails :**

  L'instance de Vue à la racine de l'arbre de composants actuel. Si l'instance actuelle n'a pas de parents, la valeur sera l'instance elle-même.

### vm.$children

- **Type :** `Array<Instance de Vue>`

- **Accessible uniquement en lecture**

- **Détails :**

  Les composants enfants directs de l'instance actuelle. **Notez que l'ordre des enfants n'est pas garanti pour `$children`, et que cette propriété n'est pas réactive.** Si vous vous retrouvez à essayer d'utiliser `$children` pour de la liaison de données, optez plutôt pour un `Array` et `v-for` pour générer les composants enfants, en utilisant l'`Array` comme unique source fiable.

### vm.$slots

- **Type :** `{ [name: string]: ?Array<VNode> }`

- **Accessible uniquement en lecture**

- **Détails :**

  Utilisé pour accéder programmatiquement à du contenu [distribué par slots](../guide/components.html#Content-Distribution-with-Slots). Chaque [slot nommé](../guide/components.html#Named-Slots) a sa propriété correspondante (p. ex. le contenu de `slot="foo"` sera trouvé dans `vm.$slots.foo`). La propriété `default` contient tous les noeuds non inclus dans un slot nommé.

  Accéder à `vm.$slots` est plus utile lorsque vous écrivez un composant avec une [fonction `render`](../guide/render-function.html).

- **Exemple :**

  ```html
  <blog-post>
    <h1 slot="header">
      À propos de moi
    </h1>

    <p>Voici du contenu pour la page, qui sera inclus dans vm.$slots.default, car il n'est pas à l'intérieur d'un slot nommé.</p>

    <p slot="footer">
      Copyright 2016 Evan You
    </p>

    <p>Si j'ai du contenu ici, il sera aussi inclus dans vm.$slots.default.</p>
  </blog-post>
  ```

  ```js
  Vue.component('blog-post', {
    render: function (createElement) {
      var header = this.$slots.header
      var body   = this.$slots.default
      var footer = this.$slots.footer
      return createElement('div', [
        createElement('header', header),
        createElement('main', body),
        createElement('footer', footer)
      ])
    }
  })
  ```

- **Voir aussi :**
  - [`Composant <slot>`](#slot-1)
  - [Distribution de Contenu avec des Slots](../guide/components.html#Content-Distribution-with-Slots)
  - [Fonctions de Rendu: Slots](../guide/render-function.html#Slots)

### vm.$scopedSlots

> Nouveauté en 2.1.0

- **Type :** `{ [name: string]: props => VNode | Array<VNode> }`

- **Accessible uniquement en lecture**

- **Détails :**

  Utilisé pour accéder programmatiquement aux [slots à portée](../guide/components.html#Scoped-Slots). Pour chaque slot, y-compris celui par défaut `default`, l'objet contient une fonction correspondante qui retourne des nœuds virtuels `VNode`.

  Accéder à `vm.$scopedSlots` est surtout utile lors de l'écriture d'un composant avec une [fonction render](../guide/render-function.html).

- **Voir aussi :**
  - [Composant `<slot>`](#slot-1)
  - [Slots à portée](../guide/components.html#Scoped-Slots)
  - [Fonctions Render : Slots](../guide/render-function.html#Slots)

### vm.$refs

- **Type :** `Object`

- **Accessible uniquement en lecture**

- **Détails :**

  Un objet contenant les composants enfants ayant une référence `ref` enregistrée.

- **Voir aussi :**
  - [Références aux Composants Enfants](../guide/components.html#Child-Component-Refs)
  - [ref](#ref)

### vm.$isServer

- **Type :** `boolean`

- **Accessible uniquement en lecture**

- **Détails :**

  Vaut `true` si l'instance actuelle de Vue s'exécute côté serveur.

- **Voir aussi :** [Rendu côté serveur](../guide/ssr.html)

### vm.$attrs

- **Type:** `{ [key: string]: string }`

- **Read only**

- **Details:**

  Contains parent-scope attribute bindings that are not recognized (and extracted) as props. When a component doesn't have any declared props, this essentially contains all parent-scope bindings except for `class` and `style`, and can be passed down to an inner component via `v-bind="$attrs"` - useful when creating higher-order components.

### vm.$listeners

- **Type:** `{ [key: string]: Function | Array<Function> }`

- **Read only**

- **Details:**

  Contains parent-scope `v-on` event listeners (without `.native` modifiers). This can be passed down to an inner component via `v-on="$listeners"` - useful when creating higher-order components.

## Méthodes et données d'instance

<h3 id="vm-watch">vm.$watch( expOuFn, callback, [options] )</h3>

- **Arguments :**
  - `{string | Function} expOrFn`
  - `{Function | Object} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **Retourne :** `{Function} unwatch`

- **Utilisation :**

  Observe les changements sur l'instance de Vue à partir d'une expression ou d'une fonction calculée. La fonction `callback` est appelée avec la nouvelle et l'ancienne valeur. L'expression accepte uniquement les chemins simples délimités par des points. Pour des expressions plus complexes, utilisez plutôt une fonction.

<p class="tip">Note: lors de la modification (et non la réassignation) d'un <code>Object</code> ou d'un <code>Array</code>, l'ancienne valeur sera la même que la nouvelle valeur car ils référencient le même <code>Object</code>/<code>Array</code>. Vue ne conserve pas de copie de la valeur avant modification.</p>

- **Exemple :**

  ``` js
  // keypath
  vm.$watch('a.b.c', function (nouvelleValeur, ancienneValeur) {
    // fait quelque-chose
  })

  // fonction
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (nouvelleValeur, ancienneValeur) {
      // fait quelque-chose
    }
  )
  ```

  `vm.$watch` retourne une fonction `unwatch` qui une fois exécutée stoppe le déclenchement de la fonction `callback` :

  ``` js
  var unwatch = vm.$watch('a', cb)
  // plus tard, démonte l'observateur
  unwatch()
  ```

- **Option: deep**

  Pour aussi détecter les changements des valeurs imbriquées dans les objets, vous devez passer `deep: true` dans l'argument des options. Notez que vous n'avez pas besoin de cela pour observer les modifications d'un `Array`.

  ``` js
  vm.$watch('monObjet', callback, {
    deep: true
  })
  vm.monObjet.valeurImbriquée = 123
  // la fonction callback est déclenchée
  ```

- **Option: immediate**

  Passer `immediate: true` dans les options déclenchera immédiatement la fonction `callback` avec la valeur actuelle de l'expression :

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // la fonction callback est immédiatement déclenchée avec la valeur actuelle de `a`
  ```

<h3 id="vm-set">vm.$set( cible, clé, valeur )</h3>

- **Arguments :**
  - `{Object | Array} cible`
  - `{string | number} clé`
  - `{any} valeur`

- **Retourne :** la valeur assignée

- **Utilisation :**

  C'est un **alias** à la fonction globale `Vue.set`.

- **Voir aussi :** [Vue.set](#Vue-set)

<h3 id="vm-delete">vm.$delete( cible, clé )</h3>

- **Arguments :**
  - `{Object | Array} cible`
  - `{string | number} clé`

- **Utilisation :**

  C'est un **alias** à la fonction globale `Vue.delete`.

- **Voir aussi :** [Vue.delete](#Vue-delete)

## Méthodes et Événements d'Instance

<h3 id="vm-on">vm.$on( événement, callback )</h3>

- **Arguments :**
  - `{string | Array<string>} événement` (`Array` supportée unique depuis la 2.2.0)
  - `{Function} callback`

- **Utilisation :**

  Écoute un événement personnalisé sur l'instance `vm`. Les événements peuvent être déclenchés avec `vm.$emit`. La fonction de callback recevra tous les arguments additionnels passés dans ces méthodes de déclenchement d'événement.

- **Exemple :**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'salut')
  // -> "salut"
  ```

<h3 id="vm-once">vm.$once( événement, callback )</h3>

- **Arguments :**
  - `{string} événement`
  - `{Function} callback`

- **Utilisation :**

  Écoute un événement personnalisé, mais qu'une seule fois. L'écouteur sera supprimé une fois déclenché pour la première fois.

<h3 id="vm-off">vm.$off( [événement, callback] )</h3>

- **Arguments :**
  - `{string} [événement]`
  - `{Function} [callback]`

- **Utilisation :**

  Supprime un ou des écouteurs d'événements.

  - Si aucun argument n'est fourni, supprime tous les écouteurs d'événements;

  - Si seul l'argument événément est fourni, supprime tous les écouteurs de cet événement;

  - Si l'événement et le callback sont fournis, supprime l'écouteur uniquement pour cet événément et ce callback spécifique.

<h3 id="vm-emit">vm.$emit( événement, [...arguments] )</h3>

- **Arguments :**
  - `{string} événement`
  - `[...arguments]`

  Déclenche un événement sur l'instance actuelle. Tous les arguments additionnels sont passés à la fonction callback de l'écouteur.

## Méthodes d'Instance / Cycle de Vie

<h3 id="vm-mount">vm.$mount( [élémentOuSelecteur] )</h3>

- **Arguments :**
  - `{Element | string} [élémentOuSelecteur]`
  - `{boolean} [hydratation]`

- **Retourne :** `vm` - l'instance elle-même

- **Utilisation :**

  Si une Instance de Vue n'a pas reçu l'option `el` à l'instanciation, il sera dans un état "non monté", sans élément du DOM associé. `vm.$mount()` peut être utilisé pour démarrer manuellement le montage d'une Instance de Vue non montée.

  Si l'argument `élémentOuSelecteur` n'est pas fourni, le rendu du template se fera dans un élément hors du document, et vous devrez utiliser les API natives du DOM pour l'insérer vous-même dans le document.

  La méthode retourne l'instance elle-même afin que vous puissiez chaîner d'autres méthodes d'instance ensuite.

- **Exemple :**

  ``` js
  var MonComposant = Vue.extend({
    template: '<div>Salut!</div>'
  })

  // crée et monte sur #app (remplacera #app)
  new MonComposant().$mount('#app')

  // le code ci-dessus est l'équivalent de :
  new MonComposant({ el: '#app' })

  // ou bien, fait le rendu hors du document et l'insère par la suite
  var composant = new MonComposant().$mount()
  document.getElementById('app').appendChild(composant.$el)
  ```

- **Voir aussi :**
  - [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)
  - [Rendu côté serveur](../guide/ssr.html)

<h3 id="vm-forceUpdate">vm.$forceUpdate()</h3>

- **Utilisation :**

  Force l'Instance de Vue à refaire son rendu. Notez que cela n'affecte pas tous les composants enfants, seulement l'instance elle-même et les composants enfants avec un contenu de slot inséré.

<h3 id="vm-nextTick">vm.$nextTick( [callback] )</h3>

- **Arguments :**
  - `{Function} [callback]`

- **Utilisation :**

  Reporte l'éxécution de la fonction `callback` au prochain cycle de mise à jour du DOM. Utilisez ceci immédiatement après avoir changé des données pour attendre la mise à jour du DOM. C'est la même chose que la fonction globale `Vue.nextTick`, sauf que le contexte `this` dans la fonction `callback` est automatiquement lié à l'instance appelant cette méthode.

  > Nouveau en 2.1.0: retourne une Promise si aucun callback n'est fourni et si les Promise sont supportés dans l'environnement d'exécution.

- **Exemple :**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      exemple: function () {
        // modifie des données
        this.message = 'changé'
        // le DOM n'est pas encore mis à jour
        this.$nextTick(function () {
          // le DOM est maintenant à jour
          // `this` est lié à l'instance courante
          this.faireAutreChose()
        })
      }
    }
  })
  ```

- **Voir aussi :**
  - [Vue.nextTick](#Vue-nextTick)
  - [File de mise à jour asynchrone](../guide/reactivity.html#Async-Update-Queue)

<h3 id="vm-destroy">vm.$destroy()</h3>

- **Utilisation :**

  Détruit complètement une instance de Vue `vm`. Supprime ses connexions avec d'autres instances de Vue, détache toutes ses directives, désactive tous les écouteurs d'événements.

  Déclenche les hooks `beforeDestroy` et `destroyed`.

  <p class="tip">Dans les cas d'utilisation normaux, vous ne devriez pas avoir à appeler cette méthode vous-même. Contrôlez plutôt le cycle de vie de vos composants enfants de manière pilotée par les données, en utilisant `v-if` et `v-for`.</p>

- **Voir aussi :** [Diagramme du Cycle de Vie](../guide/instance.html#Lifecycle-Diagram)

## Directives

### v-text

- **Expects :** `string`

- **Détails :**

  Updates the element's `textContent`. If you need to update the part of `textContent`, you should use `{% raw %}{{ Mustache }}{% endraw %}` interpolations.

- **Exemple :**

  ```html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **Voir aussi :** [Data Binding Syntax - interpolations](../guide/syntax.html#Text)

### v-html

- **Expects:** `string`

- **Détails :**

  Updates the element's `innerHTML`. **Note that the contents are inserted as plain HTML - they will not be compiled as Vue templates**. If you find yourself trying to compose templates using `v-html`, try to rethink the solution by using components instead.

  <p class="tip">Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `v-html` on trusted content and **never** on user-provided content.</p>

- **Exemple:**

  ```html
  <div v-html="html"></div>
  ```
- **Voir aussi :** [Data Binding Syntax - interpolations](../guide/syntax.html#Raw-HTML)

### v-show

- **Expects:** `any`

- **Utilisation :**

  Toggle's the element's `display` CSS property based on the truthy-ness of the expression value.

  This directive triggers transitions when its condition changes.

- **Voir aussi :** [Conditional Rendering - v-show](../guide/conditional.html#v-show)

### v-if

- **Expects:** `any`

- **Utilisation :**

  Conditionally render the element based on the truthy-ness of the expression value. The element and its contained directives / components are destroyed and re-constructed during toggles. If the element is a `<template>` element, its content will be extracted as the conditional block.

  This directive triggers transitions when its condition changes.

<p class="tip">Quand utilisé avec v-if, v-for a une plus grande priorité par rapport à v-if. Voir le <a href="../guide/list.html#v-for-with-v-if">guide sur le rendu de listes</a> pour plus de détails.</p>

- **Voir aussi :** [Conditional Rendering - v-if](../guide/conditional.html)

### v-else

- **Does not expect expression**

- **Restriction :** previous sibling element must have `v-if` or `v-else-if`.

- **Utilisation :**

  Denote the "else block" for `v-if` or a `v-if`/`v-else-if` chain.

  ```html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **Voir aussi :**
  - [Conditional Rendering - v-else](../guide/conditional.html#v-else)

### v-else-if

> New in 2.1.0

- **Expects:** `any`

- **Restriction :** previous sibling element must have `v-if` or `v-else-if`.

- **Utilisation :**

  Denote the "else if block" for `v-if`. Can be chained.

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
    Not A/B/C
  </div>
  ```

- **Voir aussi :** [Conditional Rendering - v-else-if](../guide/conditional.html#v-else-if)

### v-for

- **Expects:** `Array | Object | number | string`

- **Utilisation :**

  Render the element or template block multiple times based on the source data. The directive's value must use the special syntax `alias in expression` to provide an alias for the current element being iterated on:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  The default behavior of `v-for` will try to patch the elements in-place without moving them. To force it to reorder elements, you need to provide an ordering hint with the `key` special attribute:

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  <p class="tip">When used together with v-if, v-for has a higher priority than v-if. See the <a href="../guide/list.html#v-for-with-v-if">list rendering guide</a> for details.</p>

  The detailed usage for `v-for` is explained in the guide section linked below.

- **Voir aussi :**
  - [List Rendering](../guide/list.html)
  - [key](../guide/list.html#key)

### v-on

- **Shorthand:** `@`

- **Expects:** `Function | Inline Statement | Object`

- **Argument:** `event`

- **Modifiers:**
  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyCode | keyAlias}` - only trigger handler on certain keys.
  - `.native` - listen for a native event on the root element of component.
  - `.once` - trigger handler at most once.
  - `.left` - (2.2.0+) only trigger handler for left button mouse events.
  - `.right` - (2.2.0+) only trigger handler for right button mouse events.
  - `.middle` - (2.2.0+) only trigger handler for middle button mouse events.
  - `.passive` - (2.3.0+) attaches a DOM event with `{ passive: true }`.

- **Utilisation :**

  Attaches an event listener to the element. The event type is denoted by the argument. The expression can either be a method name or an inline statement, or simply omitted when there are modifiers present.

  Starting in `2.4.0`, `v-on` also supports binding to an object of event/listener pairs without an argument. Note when using the object syntax, it does not support any modifiers.

  When used on a normal element, it listens to **native DOM events** only. When used on a custom element component, it also listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

- **Exemple :**

  ```html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- object syntax (2.4.0+) -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter">

  <!-- key modifier using keyCode -->
  <input @keyup.13="onEnter">

  <!-- the click event will be triggered at most once -->
  <button v-on:click.once="doThis"></button>
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- inline statement -->
  <my-component @my-event="handleThis(123, $event)"></my-component>

  <!-- native event on component -->
  <my-component @click.native="onClick"></my-component>
  ```

- **Voir aussi :**
  - [Methods and Event Handling](../guide/events.html)
  - [Components - Custom Events](../guide/components.html#Custom-Events)

### v-bind

- **Shorthand:** `:`

- **Expects:** `any (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers:**
  - `.prop` - Bind as a DOM property instead of an attribute ([what's the difference?](http://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028)). If the tag is a component then `.prop` will set the property on the component's `$el`.

  - `.camel` - (2.1.0+) transform the kebab-case attribute name into camelCase.
  - `.sync` - (2.3.0+) a syntax sugar that expands into a `v-on` handler for updating the bound value.

- **Utilisation :**

  Dynamically bind one or more attributes, or a component prop to an expression.

  When used to bind the `class` or `style` attribute, it supports additional value types such as Array or Objects. See linked guide section below for more details.

  When used for prop binding, the prop must be properly declared in the child component.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Exemple :**

  ```html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc">

  <!-- shorthand -->
  <img :src="imageSrc">

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName">

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- DOM attribute binding with prop modifier -->
  <div v-bind:text-content.prop="text"></div>

  <!-- prop binding. "prop" must be declared in my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- pass down parent props in common with a child component -->
  <child-component v-bind="$props"></child-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  The `.camel` modifier allows camelizing a `v-bind` attribute name when using in-DOM templates, e.g. the SVG `viewBox` attribute:

  ``` html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` is not needed if you are using string templates, or compiling with `vue-loader`/`vueify`.

- **Voir aussi :**
  - [Class and Style Bindings](../guide/class-and-style.html)
  - [Components - Component Props](../guide/components.html#Props)
  - [Components - `.sync` Modifier](../guide/components.html#sync-Modifier)

### v-model

- **Expects:** varies based on value of form inputs element or output of components

- **Limited to:**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **Modifiers:**
  - [`.lazy`](../guide/forms.html#lazy) - listen to `change` events instead of `input`
  - [`.number`](../guide/forms.html#number) - cast input string to numbers
  - [`.trim`](../guide/forms.html#trim) - trim input

- **Utilisation :**

  Create a two-way binding on a form input element or a component. For detailed usage and other notes, see the Guide section linked below.

- **Voir aussi :**
  - [Form Input Bindings](../guide/forms.html)
  - [Components - Form Input Components using Custom Events](../guide/components.html#Form-Input-Components-using-Custom-Events)

### v-pre

- **Does not expect expression**

- **Utilisation :**

  Skip compilation for this element and all its children. You can use this for displaying raw mustache tags. Skipping large numbers of nodes with no directives on them can also speed up compilation.

- **Exemple :**

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
   ```

### v-cloak

- **Does not expect expression**

- **Utilisation :**

  This directive will remain on the element until the associated Instance de Vue finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the Instance de Vue is ready.

- **Exemple :**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.

### v-once

- **Does not expect expression**

- **Détails :**

  Render the element and component **once** only. On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  <!-- v-for directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

- **Voir aussi :**
  - [Data Binding Syntax - interpolations](../guide/syntax.html#Text)
  - [Components - Cheap Static Components with v-once](../guide/components.html#Cheap-Static-Components-with-v-once)

## Special Attributes

### key

- **Expects:** `string`

  The `key` special attribute is primarily used as a hint for Vue's virtual DOM algorithm to identify VNodes when diffing the new list of nodes against the old list. Without keys, Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed/destroyed.

  Children of the same common parent must have **unique keys**. Duplicate keys will cause render errors.

  The most common use case is combined with `v-for`:

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  It can also be used to force replacement of an element/component instead of reusing it. This can be useful when you want to:

  - Properly trigger lifecycle hooks of a component
  - Trigger transitions

  For example:

  ``` html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  When `text` changes, the `<span>` will always be replaced instead of patched, so a transition will be triggered.

### ref

- **Expects:** `string`

  `ref` is used to register a reference to an element or a child component. The reference will be registered under the parent component's `$refs` object. If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be component instance:

  ``` html
  <!-- vm.$refs.p will be the DOM node -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child will be the child comp instance -->
  <child-comp ref="child"></child-comp>
  ```

  When used on elements/components with `v-for`, the registered reference will be an Array containing DOM nodes or component instances.

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you cannot access them on the initial render - they don't exist yet! `$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **Voir aussi :** [Child Component Refs](../guide/components.html#Child-Component-Refs)

### slot

- **Expects:** `string`

  Used on content inserted into child components to indicate which named slot the content belongs to.

  For detailed usage, see the guide section linked below.

- **Voir aussi :** [Named Slots](../guide/components.html#Named-Slots)

### is

- **Expects:** `string`

  Used for [dynamic components](../guide/components.html#Dynamic-Components) and to work around [limitations of in-DOM templates](../guide/components.html#DOM-Template-Parsing-Caveats).

  For example:

  ``` html
  <!-- component changes when currentView changes -->
  <component v-bind:is="currentView"></component>

  <!-- necessary because <my-row> would be invalid inside -->
  <!-- a <table> element and so would be hoisted out      -->
  <table>
    <tr is="my-row"></tr>
  </table>
  ```

  For detailed usage, follow the links in the description above.

- **See also:**
  - [Dynamic Components](../guide/components.html#Dynamic-Components)
  - [DOM Template Parsing Caveats](../guide/components.html#DOM-Template-Parsing-Caveats)

## Built-In Components

### component

- **Props:**
  - `is` - string | ComponentDefinition | ComponentConstructor
  - `inline-template` - boolean

- **Utilisation :**

  A "meta component" for rendering dynamic components. The actual component to render is determined by the `is` prop:

  ```html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>

  <!-- can also render registered component or component passed as prop -->
  <component :is="$options.components.child"></component>
  ```

- **Voir aussi :** [Dynamic Components](../guide/components.html#Dynamic-Components)

### transition

- **Props:**
  - `name` - string, Used to automatically generate transition CSS class names. e.g. `name: 'fade'` will auto expand to `.fade-enter`, `.fade-enter-active`, etc. Defaults to `"v"`.
  - `appear` - boolean, Whether to apply transition on initial render. Defaults to `false`.
  - `css` - boolean, Whether to apply CSS transition classes. Defaults to `true`. If set to `false`, will only trigger JavaScript hooks registered via component events.
  - `type` - string, Specify the type of transition events to wait for to determine transition end timing. Available values are `"transition"` and `"animation"`. By default, it will automatically detect the type that has a longer duration.
  - `mode` - string, Controls the timing sequence of leaving/entering transitions. Available modes are `"out-in"` and `"in-out"`; defaults to simultaneous.
  - `enter-class` - string
  - `leave-class` - string
  - `appear-class` - string
  - `enter-to-class` - string
  - `leave-to-class` - string
  - `appear-to-class` - string
  - `enter-active-class` - string
  - `leave-active-class` - string
  - `appear-active-class` - string

- **Events:**
  - `before-enter`
  - `before-leave`
  - `before-appear`
  - `enter`
  - `leave`
  - `appear`
  - `after-enter`
  - `after-leave`
  - `after-appear`
  - `enter-cancelled`
  - `leave-cancelled` (`v-show` only)
  - `appear-cancelled`

- **Utilisation :**

  `<transition>` serve as transition effects for **single** element/component. The `<transition>` does not render an extra DOM element, nor does it show up in the inspected component hierarchy. It simply applies the transition behavior to the wrapped content inside.

  ```html
  <!-- simple element -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- dynamic component -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- event hooking -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">toggled content</div>
    </transition>
  </div>
  ```

  ``` js
  new Vue({
    ...
    methods: {
      transitionComplete: function (el) {
        // for passed 'el' that DOM element as the argument, something ...
      }
    }
    ...
  }).$mount('#transition-demo')
  ```

- **Voir aussi :** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### transition-group

- **Props:**
  - `tag` - string, defaults to `span`.
  - `move-class` - overwrite CSS class applied during moving transition.
  - exposes the same props as `<transition>` except `mode`.

- **Events:**
  - exposes the same events as `<transition>`.

- **Utilisation :**

  `<transition-group>` serve as transition effects for **multiple** elements/components. The `<transition-group>` renders a real DOM element. By default it renders a `<span>`, and you can configure what element is should render via the `tag` attribute.

  Note every child in a `<transition-group>` must be **uniquely keyed** for the animations to work properly.

  `<transition-group>` supports moving transitions via CSS transform. When a child's position on screen has changed after an updated, it will get applied a moving CSS class (auto generated from the `name` attribute or configured with the `move-class` attribute). If the CSS `transform` property is "transition-able" when the moving class is applied, the element will be smoothly animated to its destination using the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **Voir aussi :** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### keep-alive

- **Props:**
  - `include` - string or RegExp or Array. Only components matched by this will be cached.
  - `exclude` - string or RegExp or Array. Any component matched by this will not be cached.

- **Utilisation :**

  When wrapped around a dynamic component, `<keep-alive>` caches the inactive component instances without destroying them. Similar to `<transition>`, `<keep-alive>` is an abstract component: it doesn't render a DOM element itself, and doesn't show up in the component parent chain.

  When a component is toggled inside `<keep-alive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly.

  > In 2.2.0 and above, `activated` and `deactivated` will fire for all nested components inside a `<keep-alive>` tree.

  Primarily used with preserve component state or avoid re-rendering.

  ```html
  <!-- basic -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- multiple conditional children -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- used together with <transition> -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Note, `<keep-alive>` is designed for the case where it has one direct child component that is being toggled. It does not work if you have `v-for` inside it. When there are multiple conditional children, as above, `<keep-alive>` requires that only one child is rendered at a time.


- **`include` and `exclude`**

  > New in 2.1.0

  The `include` and `exclude` props allow components to be conditionally cached. Both props can be a comma-delimited string, a RegExp or an Array:

  ``` html
  <!-- comma-delimited string -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (use v-bind) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (use v-bind) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  The match is first checked on the component's own `name` option, then its local registration name (the key in the parent's `components` option) if the `name` option is not available. Anonymous components cannot be matched against.

  <p class="tip">`<keep-alive>` does not work with functional components because they do not have instances to be cached.</p>

- **Voir aussi :** [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### slot

- **Props:**
  - `name` - string, Used for named slot.

- **Utilisation :**

  `<slot>` serve as content distribution outlets in component templates. `<slot>` itself will be replaced.

  For detailed usage, see the guide section linked below.

- **Voir aussi :** [Content Distribution with Slots](../guide/components.html#Content-Distribution-with-Slots)

## VNode Interface

- Please refer to the [VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js).

## Server-Side Rendering

- Please refer to the [vue-server-renderer package documentation](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer).
