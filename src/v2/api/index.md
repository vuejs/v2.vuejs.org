---
type : api
---

## Configuration globale

`Vue.config` est un objet contenant les configurations globales de Vue. Vous pouvez modifier les propriétés listées ci-dessous avant de mettre en place votre application :

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

- **Voir aussi :** [Stratégie de fusion des options personnalisées](../guide/mixins.html#Strategie-de-fusion-des-options-personnalisees)

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
    // gérer le cas d'erreur `info` est une information spécifique
    // à Vue sur l'erreur, par exemple dans quel hook du cycle de vie
    // l'erreur a été trouvée. Disponible uniquement en 2.2.0+
  }
  ```

  Définit un gestionnaire pour les erreurs non interceptées pendant le rendu d'un composant et les appels aux observateurs. Ce gestionnaire sera appelé avec comme arguments l'erreur et l'instance de Vue associée.

  > En 2.2.0+, ce hook capture également les erreurs dans les hooks du cycle de vie des composants. De plus, quand ce hook est `undefined`, les erreurs capturées seront loguées avec `console.error` plutôt qu'avoir un crash de l'application.

  > En 2.4.0+ ce hook capture également les erreurs lancées depuis un gestionnaire d'évènement Vue personnalisé.

  > [Sentry](https://sentry.io), un service de traçage d'erreur, fournit une [intégration officielle](https://sentry.io/for/vue/) utilisant cette option.

### warnHandler

> Nouveau dans la 2.4.0+

- **Type :** `Function`

- ***Par défaut :** `undefined`

- **Utilisation :**

  ``` js
  Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` est la trace de hierarchie de composant
  }
  ```

  Assigne un gestionnaire personnalisé pour les avertissements à l'exécution de Vue. Notez que cela n'est fonctionnel qu'en développement et est ignoré en production.

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
    // La camelCase ne marche pas
    mediaPlayPause: 179,
    // à la place vous devez utiliser la kebab-case avec des guillemets doubles
    "media-play-pause": 179,
    up: [38, 87]
  }
  ```

  ```html
  <input type="text" @keyup.media-play-pause="method">
  ```

  Définit des alias pour les touches avec `v-on`.

### performance

> Nouveau dans la 2.2.0+

- **Type :** `boolean`

- **Par défaut :** `false` (à partir de la 2.2.3+)

- **Utilisation :**

  Assignez ceci à `true` pour activer le suivi des performances pour l'initialisation, la compilation, le rendu et la mise à jour des composants dans la timeline des outils développeur des navigateurs. Fonctionne uniquement en mode développement et dans les navigateurs supportant l'API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

### productionTip

> Nouveau dans la 2.2.0+

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

  Reporte l'exécution de la fonction de rappel au prochain cycle de mise à jour du DOM. Utilisez-le immédiatement après avoir changé des données afin d'attendre la mise à jour du DOM.

  ``` js
  // modification de données
  vm.msg = 'Salut'
  // le DOM n'a pas encore été mis à jour
  Vue.nextTick(function () {
    // le DOM est à jour
  })
  ```

  > Nouveauté de la 2.1.0+ : retourne une Promise si aucune fonction de rappel n'est fournie et si Promise est supporté par l'environnement d'exécution.

- **Voir aussi :** [File d’attente de mise à jour asynchrone](../guide/reactivity.html#File-d’attente-de-mise-a-jour-asynchrone)

<h3 id="Vue-set">Vue.set( cible, clé, valeur )</h3>

- **Arguments :**
  - `{Object | Array} cible`
  - `{string | number} clé`
  - `{any} valeur`

- **Retourne:** la valeur assignée.

- **Utilisation :**

  Assigne une propriété à un objet cible. Si l'objet est réactif, cette méthode s'assure que la propriété est créée en tant que propriété réactive et déclenche les mises à jour de la vue. Ceci est principalement utilisé pour passer outre la limitation de Vue qui est de ne pas pouvoir détecter automatiquement l'ajout de nouvelles propriétés.

  **Notez que l'objet ne peut pas être une instance de Vue, ou l'objet de données à la racine d'une instance de Vue.**

- **Voir aussi :** [Réactivité dans le détail](../guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( cible, clé )</h3>

- **Arguments :**
  - `{Object | Array} cible`
  - `{string | number} clé`

  > Seulement dans la 2.2.0+ : fonctionne aussi avec Array + index.

- **Utilisation :**

  Supprime une propriété d'un objet cible. Si l'objet est réactif, cette méthode s'assure que la suppression déclenche les mises à jour de la vue. Ceci est principalement utilisé pour passer outre la limitation de Vue qui est de ne pas pouvoir détecter automatiquement la suppression de propriétés, mais vous devriez rarement en avoir besoin.

  <p class="tip">L'objet cible ne peut pas être une instance de Vue, ou l'objet de données à la racine d'une instance de Vue.</p>

- **Voir aussi :** [Réactivité dans le détail](../guide/reactivity.html)

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

- **Voir aussi :** [Composants](../guide/components.html)

<h3 id="Vue-use">Vue.use( plugin )</h3>

- **Arguments :**
  - `{Object | Function} plugin`

- **Utilisation :**

  Installe un plugin Vue.js. Si l'argument plugin est de type Object, il doit exposer une méthode  `install`. S'il s'agit d'une fonction, elle sera utilisée comme méthode d'installation. Cette méthode d'installation sera appelée avec Vue en tant qu'argument.

  Quand cette méthode est appelée avec le même plugin plusieurs fois, le plugin ne sera installée qu'une seule fois.

- **Voir aussi :** [Plugins](../guide/plugins.html)

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **Arguments :**
  - `{Object} mixin`

- **Utilisation :**

  Applique une mixin globale, qui affecte toutes les instances de Vue créées par la suite. Cela peut être utilisé par les créateurs de plugins pour injecter un composant personnalisé dans les composants. **Non recommandé dans le code applicatif**.

- **Voir aussi :** [Mixin global](../guide/mixins.html#Mixin-global)

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

  L'objet de données pour l'instance de Vue. Vue va de manière récursive convertir ses propriétés en des accesseurs/mutateurs (*getter/setters*) afin de les rendre « réactives ». **L'objet doit être un simple objet de base**: les objets natifs tels que les API du navigateur et les propriétés issues du prototype sont ignorées. Une règle d'or est que la donnée doit juste être de la donnée - il n'est pas recommandé d'observer des objets ayant leur propre comportement avec états.

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
  vm.a // => 1
  vm.$data === data // => true

  // data doit être une fonction lorsqu'utilisée dans Vue.extend()
  var Composant = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

  <p class="tip">Notez que __vous ne devriez pas utiliser de fonctions fléchées pour la propriété `data`__ (exemple: `data: () => { return { a: this.maPropriete }}`). La raison est que les fonctions fléchées sont liées au contexte parent, donc `this` ne correspondra pas à l'instance de Vue et  `this.maPropriete` vaudra `undefined`.</p>

- **Voir aussi :** [Réactivité dans le détail](../guide/reactivity.html)

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
        type : Number,
        default: 0,
        required: true,
        validator: function (valeur) {
          return valeur >= 0
        }
      }
    }
  })
  ```

- **Voir aussi :** [Props](../guide/components.html#Props)

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

  Les propriétés calculées qui seront ajoutées à l'instance de Vue. Tous les accesseurs (« getters ») et mutateurs (« setters ») ont leur contexte `this` automatiquement lié à l'instance de Vue.

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
  vm.aPlus   // => 2
  vm.aPlus = 3
  vm.a       // => 2
  vm.aDouble // => 4
  ```

- **Voir aussi :** [Propriétés calculées](../guide/computed.html)

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

- **Voir aussi :** [Gestion des évènements](../guide/events.html)

### watch

- **Type :** `{ [key: string]: string | Function | Object }`

- **Détails :**

  Un objet où les clés sont des expressions à surveiller et où la valeur associée est la fonction de rappel exécutée quand cette expression change. On parle alors d'observateur ou *watcher* pour décrire ce lien. La valeur peut également être une `String` correspondant au nom d'une méthode de l'instance, ou un objet avec des options avancées. L'instance de Vue appelera `$watch()` pour chaque clé de l'objet à l'initialisation.

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
  vm.a = 2 // => nouveau : 2, ancien : 1
  ```

  <p class="tip">Notez que __vous ne devriez pas utiliser de fonctions fléchées pour définir un observateur__ (exemple: `saisie: nouvelleValeur => this.actualiserSuggestions(nouvelleValeur)`). La raison est que les fonctions fléchées sont liées au contexte parent, donc `this` ne correspondra pas à l'instance de Vue et `this.actualiserSuggestions` vaudra `undefined`.</p>

- **Voir aussi :** [Méthodes et données d'instance - vm.$watch](#vm-watch)

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
  - [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)
  - [Runtime + Compiler vs. Runtime seul](../guide/installation.html#Runtime-Compiler-vs-Runtime-seul)

### template

- **Type :** `string`

- **Détails :**

  Un template sous forme de chaîne de caractères qui sera utilisé comme balisage HTML pour l'instance de Vue. Le template viendra **remplacer** l'élément monté. Tout code HTML existant à l'intérieur de l'élément monté sera ignoré, à moins que des emplacements de distribution de contenu (slots) soient présents dans le template.

  Si la chaîne de caractères commence par `#`, elle sera évaluée comme `querySelector` et le `innerHTML` de l'élément sélectionné sera utilisé comme template. Cela permet d'utiliser l'astuce du `<script type="x-template">` pour inclure des templates.

  <p class="tip">D'un point de vue sécurité, vous devriez uniquement utiliser des templates Vue auxquels vous pouvez faire confiance. N'utilisez jamais du contenu généré côté utilisateur comme template.</p>

  <p class="tip">Si la fonction `render` est présente comme option de l'instance de Vue, le template sera ignoré.</p>

- **Voir aussi :**
  - [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)
  - [Distribution de contenu avec des slots](../guide/components.html#Distribution-de-contenu-avec-des-slots)

### render

  - **Type :** `(createElement: () => VNode) => VNode`

  - **Détails :**

    Une alternative aux templates en chaîne de caractères vous permettant d'exploiter toute la puissance programmatique de JavaScript. La fonction de rendu `render` reçoit une méthode `createElement` comme premier argument servant à créer des `VNode`s.

    Si le composant est un composant fonctionnel, la fonction `render` recevra aussi un argument supplémentaire `context`, qui donne accès aux données contextuelles puisque les composants fonctionnels sont sans instance.

    <p class="tip">La fonction `render` a la priorité par rapport à la fonction de rendu compilée à partir de l'option `template`, ou par rapport au template HTML de l'élément d'ancrage dans le DOM qui est spécifié par l'option `el`.</p>

  - **Voir aussi :** [Fonctions de rendu](../guide/render-function.html)

### renderError

> Nouveau dans la 2.2.0+

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

  - **Voir aussi :** [Fonctions de rendu](../guide/render-function.html)

## Options / Cycle de vie des hooks

<p class="tip">Tous les hooks du cycle de vie ont automatiquement leur contexte `this` rattaché à l'instance, afin que vous puissiez accéder aux données, propriétés calculées et méthodes. Cela signifie que __vous ne devriez pas utiliser une fonction fléchée pour définir une méthode du cycle de vie__  (p. ex. `created: () => this.fetchTodos()`). La raison est que les fonctions fléchées utilisent le contexte parent, donc `this` ne sera pas l'instance de Vue comme vous pouvez vous y attendre et `this.fetchTodos` sera `undefined`.</p>

### beforeCreate

- **Type :** `Function`

- **Détails :**

  Appelé de manière synchrone juste après que l'instance ait été initialisée, et avant l'observation des données et l'installation des évènements/observateurs.

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

### created

- **Type :** `Function`

- **Détails :**

  Appelé de manière synchrone après que l'instance ait été créée. À ce stade, l'instance a fini de traiter les options, ce qui signifie que les éléments suivants ont été installés: observation des données, propriétés calculées, méthodes, fonctions de retour des observateurs et évènements. Cependant, la propriété `$el` n'est pas encore disponible.

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

### beforeMount

- **Type :** `Function`

- **Détails :**

  Appelé juste avant que le montage commence: la fonction `render` est sur le point d'être appelée pour la première fois.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

### mounted

- **Type :** `Function`

- **Détails :**

  Appelé juste après que l'instance ait été montée, là où `el` est remplacé par le nouvellement créé `vm.$el`. Si l'instance à la racine est montée sur un élément du document, alors `vm.$el` sera aussi dans le document quand `mounted` est appelé.

  Notez que `mounted` **ne** garantit **pas** que tous les composants aient été montés. Si vous souhaitez attendre jusqu'à ce que le rendu de la vue entière ait été fait, vous pouvez utiliser [vm.$nextTick](#vm-nextTick) à l'intérieur de `mounted` :

  ``` js
  mounted: function () {
    this.$nextTick(function () {
      // Ce code va être exécuté seulement
      // une fois le rendu de la vue entière terminé
    })
  }
  ```

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

### beforeUpdate

- **Type :** `Function`

- **Détails :**

  Appelé quand les données changent, avant le nouveau rendu et le patch du DOM virtuel.

  Vous pouvez effectuer d'autres changements d'état dans ce hook et ils ne déclencheront pas de rendus additionnels.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

### updated

- **Type :** `Function`

- **Détails :**

  Appelé après qu'un changement d'une donnée ait causé un nouveau rendu et patch du DOM virtuel.

  Le DOM du composant aura été mis à jour quand ce hook est appelé, donc vous pouvez effectuer des opérations dépendantes du DOM ici. Cependant, dans la plupart des cas, vous devriez éviter de changer l'état dans ce hook. Pour réagir à des changements d'état, il vaut généralement mieux utiliser une [propriété calculée](#computed) ou un [observateur](#watch) à la place.

  Notez que `updated` **ne** garantit **pas** que tous les composants aient été montés. Si vous souhaitez attendre jusqu'à ce que le rendu de la vue entière ait été fait, vous pouvez utiliser [vm.$nextTick](#vm-nextTick) à l'intérieur de `updated` :

  ``` js
  updated: function () {
    this.$nextTick(function () {
      // Ce code va être exécuté seulement
      // une fois le rendu de la vue entière terminé
    })
  }
  ```

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

### activated

- **Type :** `Function`

- **Détails :**

  Appelé quand un composant gardé en vie (`keep-alive`) est activé.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :**
  - [Composants intégrés par défaut - keep-alive](#keep-alive)
  - [Composants dynamiques - keep-alive](../guide/components.html#keep-alive)

### deactivated

- **Type :** `Function`

- **Détails :**

  Appelé quand un composant gardé en vie (`keep-alive`) est désactivé.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :**
  - [Composants intégrés par défaut - keep-alive](#keep-alive)
  - [Composants dynamiques - keep-alive](../guide/components.html#keep-alive)

### beforeDestroy

- **Type :** `Function`

- **Détails :**

  Appelé juste avant qu'une instance de Vue ne soit détruite. À ce stade, l'instance est toujours pleinement fonctionnelle.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

### destroyed

- **Type :** `Function`

- **Détails :**

  Appelé après qu'une instance de Vue ait été détruite. Quand ce hook est appelé, toutes les directives de l'instance de Vue ont été détachées, tous les écouteurs d'évènements ont été supprimés et toutes les instances de Vue enfants ont également été détruites.

  **Ce hook n'est pas appelé durant le rendu côté serveur.**

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

## Options / Ressources

### directives

- **Type :** `Object`

- **Détails :**

  Un objet de mappage des directives à mettre à disposition de l'instance de Vue.

- **Voir aussi :** [Directives personnalisées](../guide/custom-directive.html)

### filters

- **Type :** `Object`

- **Détails :**

  Un objet de mappage des filtres à mettre à disposition de l'instance de Vue.

- **Voir aussi :** [`Vue.filter`](#Vue-filter)

### components

- **Type :** `Object`

- **Détails :**

  Un objet de mappage des composants à mettre à disposition de l'instance de Vue.

- **Voir aussi :** [Composants](../guide/components.html)

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
  // => 1
  // => 2
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

  // étend `CompA` sans avoir à appeler `Vue.extend` sur l'un ou l'autre
  var CompB = {
    extends: CompA,
    ...
  }
  ```

### provide / inject

> Nouveau dans la 2.2.0+

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
      console.log(this.foo) // => "bar"
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

  > Les deux prochains exemples fonctionnent seulement avec Vue 2.2.1+. En dessous de cette version, les valeurs injectées étaient résolues après l'initialisation des `props` et de `data`.

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

- **Par défaut :** `{% raw %}["{{", "}}"]{% endraw %}`

- **Restrictions :** Cette option n'est disponible que dans la version complète du build, avec la compilation dans le navigateur.

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

- **Voir aussi :** [Composants fonctionnels](../guide/render-function.html#Composants-fonctionnels)

### model

> Nouveau dans la 2.2.0

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
        type : Number,
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

> Nouveau dans la 2.4.0+

- **Type :** `boolean`

- **Par défaut :** `true`

- **Détails :**

  Par défaut, les attributs de portée parente qui ne sont pas reconnu en tant que props vont « échouer » et être appliquées à l'élément racine du composant enfant en tant qu'attribut HTML normal. Quand on crée un composant qui encapsule un élément cible ou un autre composant, cela peut ne pas être le comportement souhaité. En mettant `inheritAttrs` à `false`, ce comportement par défaut peut être désactivé. Les attributs sont disponibles via la propriété d'instance `$attrs` (aussi nouvelle en 2.4) et peuvent être explicitement liée a un élément non racine en utilisant `v-bind`.

  Note : cette option n'affecte **pas** les liaisons `class` et `style`.

### comments

> Nouveau dans la 2.4.0+

- **Type :** `boolean`

- **Par défaut :** `false`

- **Restrictions :** Cette option est uniquement disponible dans le build complet, avec la compilation dans le navigateur.

- **Détails :**

  Quand mis à `true`, cela va conserver et faire le rendu HTML des commentaires trouvés dans les templates. Le comportement par défaut est de les enlever.

## Propriétés d'instance

### vm.$data

- **Type :** `Object`

- **Détails :**

  L'objet `data` est ce que l'instance de Vue observe. L'instance de Vue agit comme un proxy pour l'accès aux propriétés de cet objet `data`.

- **Voir aussi :** [Options / Data - data](#data)

### vm.$props

> Nouveau dans la 2.2.0+

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
      console.log(this.$options.optionPersonnalisée) // => 'foo'
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

  Utilisé pour accéder programmatiquement à du contenu [distribué par slots](../guide/components.html#Distribution-de-contenu-avec-des-slots). Chaque [slot nommé](../guide/components.html#Slots-nommes) a sa propriété correspondante (p. ex. le contenu de `slot="foo"` sera trouvé dans `vm.$slots.foo`). La propriété `default` contient tous les nœuds non inclus dans un slot nommé.

  Accéder à `vm.$slots` est plus utile lorsque vous écrivez un composant avec une [fonction de rendu](../guide/render-function.html).

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
  - [Composant `<slot>`](#slot-1)
  - [Distribution de contenu avec des slots](../guide/components.html#Distribution-de-contenu-avec-des-slots)
  - [Fonctions de rendu - Slots](../guide/render-function.html#Slots)

### vm.$scopedSlots

> Nouveau dans la 2.1.0+

- **Type :** `{ [name: string]: props => VNode | Array<VNode> }`

- **Accessible uniquement en lecture**

- **Détails :**

  Utilisé pour accéder programmatiquement aux [slots avec portée](../guide/components.html#Slots-avec-portee). Pour chaque slot, y-compris celui par défaut `default`, l'objet contient une fonction correspondante qui retourne des nœuds virtuels `VNode`.

  Accéder à `vm.$scopedSlots` est surtout utile lors de l'écriture d'un composant avec une [fonction de rendu](../guide/render-function.html).

- **Voir aussi :**
  - [Composant `<slot>`](#slot-1)
  - [Slots avec portée](../guide/components.html#Slots-avec-portee)
  - [Fonctions de rendu - Slots](../guide/render-function.html#Slots)

### vm.$refs

- **Type :** `Object`

- **Accessible uniquement en lecture**

- **Détails :**

  Un objet contenant les composants enfants ayant une référence `ref` enregistrée.

- **Voir aussi :**
  - [Les refs des composants enfants](../guide/components.html#Les-refs-des-composants-enfants)
  - [Attributs spéciaux - ref](#ref)

### vm.$isServer

- **Type :** `boolean`

- **Accessible uniquement en lecture**

- **Détails :**

  Vaut `true` si l'instance actuelle de Vue s'exécute côté serveur.

- **Voir aussi :** [Rendu côté serveur](../guide/ssr.html)

### vm.$attrs

- **Type :** `{ [key: string]: string }`

- **Accessible uniquement en lecture**

- **Détails :**

  Contient les attributs liés de portée parente (à l'exeption de `class` et `style`) qui ne sont pas reconnus (et extrait) en tant que props. Quand un composant n'a aucune props de déclarée, il contient essentiellement toutes les liaisons de portée parente (à l'exeption de `class` et `style`), et peut être passé à l'intérieur d'un composant enfant via `v-bind="$attrs"`. Ceci est utile pour la création de composants d'ordre supérieur.

### vm.$listeners

- **Type :** `{ [key: string]: Function | Array<Function> }`

- **Accessible uniquement en lecture**

- **Détails :**

  Contient le gestionnaire d'évènement `v-on` de portée parente (sans le modificateur `.native`). Il peut être passé à l'intérieur d'un composant enfant via `v-on="$listeners"`. Ceci est utile pour la création de composants d'ordre supérieur.

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
  // la fonction de rappel est déclenchée
  ```

- **Option: immediate**

  Passer `immediate: true` dans les options déclenchera immédiatement la fonction `callback` avec la valeur actuelle de l'expression :

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // la fonction `callback` est immédiatement déclenchée avec la valeur actuelle de `a`
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

  Écoute un événement personnalisé sur l'instance `vm`. Les événements peuvent être déclenchés avec `vm.$emit`. La fonction de rappel recevra tous les arguments additionnels passés dans ces méthodes de déclenchement d'événement.

- **Exemple :**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'salut')
  // => "salut"
  ```

<h3 id="vm-once">vm.$once( événement, callback )</h3>

- **Arguments :**
  - `{string} événement`
  - `{Function} callback`

- **Utilisation :**

  Écoute un événement personnalisé, mais qu'une seule fois. L'écouteur sera supprimé une fois déclenché pour la première fois.

<h3 id="vm-off">vm.$off( [événement, callback] )</h3>

- **Arguments :**
  - `{string | Array<string>} événement` (les tableaux sont seulement supportés dans la 2.2.2+)
  - `{Function} [callback]`

- **Utilisation :**

  Supprime un ou des écouteurs d'événements.

  - Si aucun argument n'est fourni, supprime tous les écouteurs d'événements;

  - Si seul l'argument événément est fourni, supprime tous les écouteurs de cet événement;

  - Si l'événement et la fonction de rappel sont fournis, supprime l'écouteur uniquement pour cet événément et cette fonction de rappel spécifique.

<h3 id="vm-emit">vm.$emit( événement, [...arguments] )</h3>

- **Arguments :**
  - `{string} événement`
  - `[...arguments]`

  Déclenche un événement sur l'instance actuelle. Tous les arguments additionnels sont passés à la fonction de rappel de l'écouteur.

## Méthodes d'Instance / Cycle de Vie

<h3 id="vm-mount">vm.$mount( [élémentOuSelecteur] )</h3>

- **Arguments :**
  - `{Element | string} [élémentOuSelecteur]`
  - `{boolean} [hydratation]`

- **Retourne :** `vm` - l'instance elle-même

- **Utilisation :**

  Si une Instance de Vue n'a pas reçu l'option `el` à l'instanciation, il sera dans un état « non monté », sans élément du DOM associé. `vm.$mount()` peut être utilisé pour démarrer manuellement le montage d'une Instance de Vue non montée.

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
  - [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)
  - [Rendu côté serveur](../guide/ssr.html)

<h3 id="vm-forceUpdate">vm.$forceUpdate()</h3>

- **Utilisation :**

  Force l'Instance de Vue à refaire son rendu. Notez que cela n'affecte pas tous les composants enfants, seulement l'instance elle-même et les composants enfants avec un contenu de slot inséré.

<h3 id="vm-nextTick">vm.$nextTick( [callback] )</h3>

- **Arguments :**
  - `{Function} [callback]`

- **Utilisation :**

  Reporte l'éxécution de la fonction `callback` au prochain cycle de mise à jour du DOM. Utilisez ceci immédiatement après avoir changé des données pour attendre la mise à jour du DOM. C'est la même chose que la fonction globale `Vue.nextTick`, sauf que le contexte `this` dans la fonction `callback` est automatiquement lié à l'instance appelant cette méthode.

  > Nouveau dans la 2.1.0+ : retourne une Promise si aucune fonction de rappel n'est fourni et si les Promise sont supportés dans l'environnement d'exécution.

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
  - [File d’attente de mise à jour asynchrone](../guide/reactivity.html#File-d’attente-de-mise-a-jour-asynchrone)

<h3 id="vm-destroy">vm.$destroy()</h3>

- **Utilisation :**

  Détruit complètement une instance de Vue `vm`. Supprime ses connexions avec d'autres instances de Vue, détache toutes ses directives, désactive tous les écouteurs d'événements.

  Déclenche les hooks `beforeDestroy` et `destroyed`.

  <p class="tip">Dans les cas d'utilisation normaux, vous ne devriez pas avoir à appeler cette méthode vous-même. Contrôlez plutôt le cycle de vie de vos composants enfants de manière pilotée par les données, en utilisant `v-if` et `v-for`.</p>

- **Voir aussi :** [Diagramme du cycle de vie](../guide/instance.html#Diagramme-du-cycle-de-vie)

## Directives

### v-text

- **Attend comme valeur :** `string`

- **Détails :**

  Met à jour le contenu textuel (`textContent`) de l'élément. Si vous n'avez besoin de mettre à jour qu'une partie de ce contenu, vous devriez utiliser les interpolations `{% raw %}{{ Mustache }}{% endraw %}`.

- **Exemple :**

  ```html
  <span v-text="msg"></span>
  <!-- même chose que -->
  <span>{{msg}}</span>
  ```

- **Voir aussi :** [Syntaxe de liaison de données - Interpolations](../guide/syntax.html#Texte)

### v-html

- **Attend comme valeur :** `string`

- **Détails :**

  Met à jour le contenu HTML (`innerHTML`) de l'élément. **Notez que les contenus sont insérés en pur HTML - ils ne seront pas compilés en tant que templates Vue**. Si vous vous retrouvez à vouloir composer des templates avec `v-html`, essayez de repenser la solution en utilisant des composants à la place.

  <p class="tip">Faire le rendu dynamique de code HTML arbitraire sur votre site web peut être très dangereux car cela peut mener facilement à des [attaques XSS](https://fr.wikipedia.org/wiki/Cross-site_scripting). Utilisez `v-html` uniquement avec du contenu de confiance et **jamais** avec du contenu fourni par les utilisateurs.</p>

- **Exemple:**

  ```html
  <div v-html="html"></div>
  ```

- **Voir aussi :** [Syntaxe de liaison de données - Interpolations](../guide/syntax.html#Interpetation-du-HTML)

### v-show

- **Attend comme valeur :** `any`

- **Utilisation :**

  Permute l'affichage de l'élément avec la propriété CSS `display` selon si la valeur de l'expression est [truthy](https://developer.mozilla.org/fr/docs/Glossaire/Truthy) ou non.

  Cette directive déclenche des transitions quand sa condition change.

- **Voir aussi :** [Rendu conditionnel - v-show](../guide/conditional.html#v-show)

### v-if

- **Attend comme valeur :** `any`

- **Utilisation :**

  Fait le rendu conditionnel de l'élément selon si la valeur de l'expression est [truthy](https://developer.mozilla.org/fr/docs/Glossaire/Truthy) ou non. L'element et les directives / composants qu'il contient sont détruits et reconstruits durant la permutation. Si l'élément est un `<template>`, son contenu sera extrait en tant que bloc conditionnel.

  Cette directive déclenche des transitions quand sa condition change.

<p class="tip">Quand utilisé avec v-if, v-for a une plus grande priorité par rapport à v-if. Voir le <a href="../guide/list.htmll#v-for-avec-v-if">guide sur le rendu de listes</a> pour plus de détails.</p>

- **Voir aussi :** [Rendu conditionnel - v-if](../guide/conditional.html)

### v-else

- **N'attend aucune valeur**

- **Restriction :** l'élément précédent doit avoir une directive `v-if` ou `v-else-if`.

- **Utilisation :**

  Dénote un bloc « else » pour `v-if` ou pour une chaîne `v-if` / `v-else-if`.

  ```html
  <div v-if="Math.random() > 0.5">
    Là vous me voyez
  </div>
  <div v-else>
    Là vous ne me voyez pas
  </div>
  ```

- **Voir aussi :** [Rendu conditionnel - v-else](../guide/conditional.html#v-else)

### v-else-if

> Nouveauté en 2.1.0+

- **Attend comme valeur :** `any`

- **Restriction :** l'élément précédent doit avoir une directive `v-if` or `v-else-if`.

- **Utilisation :**

  Dénote un bloc « else if » pour `v-if`. Peut être enchaîné plusieurs fois.

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
    Ni A, ni B, ni C
  </div>
  ```

- **Voir aussi :** [Rendu conditionnel - v-else-if](../guide/conditional.html#v-else-if)

### v-for

- **Attend comme valeur :** `Array | Object | number | string`

- **Utilisation :**

  Fait le rendu de l'élément ou du bloc template plusieurs fois selon les données sources. La valeur de la directive doit utiliser la syntaxe spéciale `alias in expression` pour fournir un alias à l'élément courant dans l'itération:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Comme alternative, vous pouvez aussi spécifier un alias pour l'index courant dans l'itération (ou la clé si utilisé sur un `Object`):

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  Le comportement par défaut de `v-for` est qu'il essaiera de patcher les éléments actuellement en place sans les déplacer. Pour le forcer à réordonner les éléments, vous devez fournir un indice de tri avec l'attribut spécial `key` :

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  <p class="tip">Quand utilisé conjointement avec v-if, v-for a une plus grande priorité que v-if. Consultez le <a href="../guide/list.html#v-for-with-v-if">guide de rendu de listes</a> pour plus de détails.</p>

  L'usage détaillé pour `v-for` est expliqué dans la section du guide indiquée ci-dessous.

- **Voir aussi :**
  - [Rendu de liste](../guide/list.html)
  - [key](../guide/list.html#key)

### v-on

- **Notation abrégée :** `@`

- **Attend comme valeur :** `Function | Inline Statement | Object`

- **Argument de la fonction de rappel (callback) :** `event`

- **Modificateurs :**
  - `.stop` - appelle `event.stopPropagation()`.
  - `.prevent` - appelle `event.preventDefault()`.
  - `.capture` - ajoute l'écouteur d'événement en mode capture.
  - `.self` - déclenche le gestionnaire d'événement uniquement si l'événement provient de cet élément.
  - `.{keyCode | keyAlias}` - déclenche le gestionnaire d'événement uniquement pour certaines touches du clavier.
  - `.native` - écoute un événement natif sur l'élément racine d'un composant.
  - `.once` - déclenche le gestionnaire d'événement une seule fois maximum.
  - `.left` - (2.2.0+) déclenche le gestionnaire d'événement uniquement pour les événements du bouton gauche de la souris.
  - `.right` - (2.2.0+) déclenche le gestionnaire d'événement uniquement pour les événements du bouton droit de la souris.
  - `.middle` - (2.2.0+) déclenche le gestionnaire d'événement uniquement pour les événements du bouton du milieu de la souris.
  - `.passive` - (2.3.0+) attache un événement du DOM avec `{ passive: true }`.

- **Utilisation :**

  Attache un écouteur d'événement à l'élément. Le type d'événement écouté est indiqué comme argument. L'expression peut être soit un nom de méthode, soit une ligne d'instruction, ou simplement omise si des modificateurs sont présents.

  À partir de la 2.4.0+, `v-on` supporte aussi la liaison à un objet de paires événement/écouteur sans argument. Notez que lorsque vous utilisez la syntaxe objet, elle ne supporte aucun modificateur.

  Quand utilisé sur un élément HTML standard, il écoute uniquement les **événements natifs du DOM**. Quand utilisé sur un élement personnalisé de composant, il écoute également les **événements personnalisés** émis depuis ce composant enfant.

  Lorsque des événements natifs du DOM sont écoutés, la méthode reçoit l'événement natif comme unique argument. Si la valeur de la directive est une ligne d'instruction, l'instruction a accès à la propriété spéciale `$event` : `v-on:click="handle('ok', $event)"`.

- **Exemple :**

  ```html
  <!-- nom de méthode -->
  <button v-on:click="faireCeci"></button>

  <!-- syntaxe objet (2.4.0+) -->
  <button v-on="{ mousedown: faireCeci, mouseup: faireCela }"></button>

  <!-- ligne d'instruction -->
  <button v-on:click="faireCela('hello', $event)"></button>

  <!-- notation abrégée -->
  <button @click="faireCeci"></button>

  <!-- stoppe la propagation -->
  <button @click.stop="faireCeci"></button>

  <!-- empêche le comportement par défaut -->
  <button @click.prevent="faireCeci"></button>

  <!-- empêche le comportement par défaut sans expression -->
  <form @submit.prevent></form>

  <!-- enchaîner les modificateurs -->
  <button @click.stop.prevent="faireCeci"></button>

  <!-- modificateur de touche avec un keyAlias -->
  <input @keyup.enter="onEnter">

  <!-- modificateur de touche avec un keyCode -->
  <input @keyup.13="onEnter">

  <!-- l'événement click sera déclenché une seule fois maximum -->
  <button v-on:click.once="faireCeci"></button>
  ```

  Écouter des événements personnalisés sur un composant enfant (le gestionnaire est appelé quand `mon-evenement` est émis depuis l'enfant):

  ```html
  <mon-composant @mon-evenement="faireCeci"></mon-composant>

  <!-- ligne d'instruction -->
  <mon-composant @mon-evenement="faireCeci(123, $event)"></mon-composant>

  <!-- événement natif sur le composant -->
  <mon-composant @click.native="onClick"></mon-composant>
  ```

- **Voir aussi :**
  - [Gestion des évènements](../guide/events.html)
  - [Composants - Événements personnalisés](../guide/components.html#Evenements-personnalises)

### v-bind

- **Notation abrégée :** `:`

- **Attend comme valeur :** `any (avec argument) | Object (sans argument)`

- **Argument :** `attrOuProp (optionnel)`

- **Modificateurs :**
  - `.prop` - Associe une propriété du DOM plutôt qu'un attribut. ([Quelle difference ?](http://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028)). Si le tag est un composant, alors `.prop` assignera la propriété sur l'élément `$el` du composant.
  - `.camel` - (2.1.0+) transforme un nom d'attribut en kebab-case en sa version camelCase.
  - `.sync` - (2.3.0+) du sucre syntaxique pour ajouter un un gestionnaire `v-on` qui met à jour la valeur liée.

- **Utilisation :**

  Lie dynamiquement un ou plusieurs attributs HTML ou props de composant à une expression.

  Quand utilisé pour lier un attribut `class` ou `style`, la directive supporte des types additionnels de valeur tels que `Array` ou `Object`. Consultez la section du guide en lien ci-dessous pour plus de détails.

  Quand utilisé pour lier à une prop de composant, la prop doit être bien déclarée dans le composant enfant.

  Utilisé sans argument, la directive peut lier un objet contenant des paires clé-valeur d'attributs. Notez que dans ce mode, `class` et `style` ne supportent pas les `Array` ou `Object`.

- **Exemple :**

  ```html
  <!-- lie un attribut -->
  <img v-bind:src="imageSrc">

  <!-- notation abrégée -->
  <img :src="imageSrc">

  <!-- avec de la concaténation de chaînes de caractères -->
  <img :src="'/path/to/images/' + fileName">

  <!-- liaison de classes -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- liaison de styles -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- lie un objet d'attributs -->
  <div v-bind="{ id: uneProp, 'autre-attr': uneAutreProp }"></div>

  <!-- lie un attribut du DOM avec le modificateur prop -->
  <div v-bind:text-content.prop="text"></div>

  <!-- liaison de prop. "prop" doit être déclaré dans mon-composant. -->
  <mon-composant :prop="uneValeur"></mon-composant>

  <!-- transmet les props parentes à un composant enfant -->
  <composant-enfant v-bind="$props"></composant-enfant>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  Le modificateur `.camel` permet de réécrire en camelCase un nom d'attribut de `v-bind` si vous déclarez vos templates dans le DOM, p. ex. l'attribut SVG `viewBox` :

  ``` html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` n'est pas nécessaire si vous utilisez des templates en chaîne de caractères ou si vous les compilez avec `vue-loader`/`vueify`.

- **Voir aussi :**
  - [Liaisons de classe et de style](../guide/class-and-style.html)
  - [Composants - Props de composant](../guide/components.html#Props)
  - [Composants - Modificateur `.sync`](../guide/components.html#Modificateur-sync)

### v-model

- **Attend comme valeur :** variable selon les éléments des champs de formulaire ou les valeurs en sortie de composants

- **Limité à :**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - composants

- **Modificateurs :**
  - [`.lazy`](../guide/forms.html#lazy) - écoute les événements `change` au lieu de `input`
  - [`.number`](../guide/forms.html#number) - convertit en nombres les chaînes de caractères en entrée
  - [`.trim`](../guide/forms.html#trim) - retire les blancs autour des chaînes de caractères en entrée

- **Utilisation :**

  Crée une liaison bidirectionnelle sur un élément de saisie d'un formulaire ou sur un composant. Pour une utilisation détaillée et d'autres notes, consultez la section du guide en lien ci-dessous.

- **Voir aussi :**
  - [Liaisons sur les champs de formulaire](../guide/forms.html)
  - [Composants - Composants de champ de formulaire utilisant les événements personnalisés](../guide/components.html#Composants-de-champ-de-formulaire-utilisant-les-evenements-personnalises)

### v-pre

- **N'attend aucune valeur**

- **Utilisation :**

  Omet la compilation pour cet élément et tous ses enfants. Vous pouvez utiliser ceci pour afficher à l'utilisateur des expressions `{{ moustache }}`. Utilisé sur un grand nombre de nœuds sans directives, cela peut aussi accélerer la compilation.

- **Exemple :**

  ```html
  <span v-pre>{{ ceci ne sera pas compilé }}</span>
   ```

### v-cloak

- **N'attend aucune valeur**

- **Utilisation :**

  Cette directive restera sur l'élément jusqu'à ce que l'instance de Vue associée ait fini sa compilation. Combiné avec des règles CSS telles que `[v-cloak] { display: none }`, cette directive peut être utilisée pour cacher des liaisons moustaches encore non compilées jusqu'à ce que l'instance de Vue soit prête.

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

  L'élément `<div>` ne sera pas visible jusqu'à ce que la compilation soit terminée.

### v-once

- **N'attend aucune valeur**

- **Détails :**

  Fait le rendu de l'élément ou du composant qu'**une seule fois** seulement. Lors des nouveaux rendus par la suite, l'élément/composant et tous ses enfants seront traités comme du contenu statique et ignorés. Cela peut être utilisé pour optimiser les performances à la mise à jour d'un composant.

  ```html
  <!-- sur un seul élément -->
  <span v-once>Ceci ne changera jamais : {{msg}}</span>
  <!-- l'élément a des enfants -->
  <div v-once>
    <h1>commentaire</h1>
    <p>{{msg}}</p>
  </div>
  <!-- composant -->
  <mon-composant v-once :commentaire="msg"></mon-composant>
  <!-- directive `v-for` -->
  <ul>
    <li v-for="i in liste" v-once>{{i}}</li>
  </ul>
  ```

- **Voir aussi :**
  - [Syntaxe de liaison de données - Interpolations](../guide/syntax.html#Texte)
  - [Composants - Composants statiques peu coûteux avec `v-once`](../guide/components.html#Cheap-Static-Components-with-v-once)

## Attributs spéciaux

### key

- **Attend comme valeur :** `number | string`

  L'attribut spécial `key` est principalement utilisé comme marqueur pour l'algorithme de DOM virtuel de Vue afin d'identifier les *VNodes* lors du différentiel entre la nouvelle liste des nœuds et la liste précédente. Sans clés, Vue utilise un algorithme qui minimise le déplacement de nœuds et essaie de patcher/réutiliser le plus possible les éléments présents du même type. Avec des clés, cela réordonnera les éléments en se basant sur le nouvel ordre de clés, et les éléments avec des clés qui ne sont plus présentes seront toujours supprimés/détruits.

  Les enfants d'un même parent commun doivent avoir des **clés uniques**. Des clés en doublons causeront des erreurs de rendu.

  Le cas d'utilisation le plus classique est la combinaison avec `v-for`:

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Il peut aussi être utilisé pour forcer le remplacement d'un élément/composant au lieu de le réutiliser. Cela peut être utile lorsque vous voulez :

  - Déclencher correctement les hooks de cycle de vie d'un composant
  - Déclencher des transitions

  Par exemple :

  ``` html
  <transition>
    <span :key="texte">{{ texte }}</span>
  </transition>
  ```

  Quand `texte` change, le `<span>` sera toujours remplacé plutôt que d'être patché, afin qu'une transition soit déclenchée.

### ref

- **Attend comme valeur :** `string`

  `ref` est utilisé pour inscrire une référence à un élément ou à un composant enfant. La référence sera inscrite sous l'objet `$refs` du composant parent. Lorsqu'utilisé sur un élément du DOM, la référence sera cet élément; lorsqu'utilisé sur un composant enfant, la référence sera l'instance du composant :

  ``` html
  <!-- vm.$refs.p sera le nœud du DOM -->
  <p ref="p">hello</p>

  <!-- vm.$refs.enfant sera l'instance du composant enfant -->
  <comp-enfant ref="enfant"></comp-enfant>
  ```

  Quand utilisé sur des éléments/composants avec `v-for`, la référence inscrite sera un `Array` contenant les nœuds du DOM ou les instances de composant.

  Une note importante à propos du timing de l'inscription de la référence: étant donné que les refs elles-même résultent de la fonction de rendu, vous ne pouvez pas y accéder au rendu initial - elles n'existent pas encore ! `$refs` est également non réactif, c'est pourquoi vous ne devriez pas essayer de les utiliser dans des templates pour de la liaison de données.

- **Voir aussi :** [Les refs des composants enfants](../guide/components.html#Les-refs-des-composants-enfants)

### slot

- **Attend comme valeur :** `string`

  Utilisé sur du contenu inséré dans les composants enfants afin d'indiquer à quel slot nommé le contenu doit être associé.

  Pour un usage détaillé, veuillez consulter la section du guide en lien ci-dessous.

- **Voir aussi :** [Slots nommés](../guide/components.html#Slots-nommes)

### is

- **Attend comme valeur :** `string`

  Utilisé pour les [composants dynamiques](../guide/components.html#Composants-dynamiques) et pour contourner les [limitations des templates dans le DOM](../guide/components.html#Limitations-de-l’analyse-d’un-template-a-partir-du-DOM).

  Par exemple :

  ``` html
  <!-- le composant change quand la vue actuelle change -->
  <component v-bind:is="vueActuelle"></component>

  <!-- nécessaire car `<ma-ligne>` sera invalide à l'intérieur -->
  <!-- d'un élément `<table>` et donc sera écarté -->
  <table>
    <tr is="ma-ligne"></tr>
  </table>
  ```

  Pour un usage détaillé, suivez les liens dans la description ci-dessus.

- **Voir aussi :**
  - [Composants dynamiques](../guide/components.html#Composants-dynamiques)
  - [Limitations de l’analyse d’un template à partir du DOM](../guide/components.html#Limitations-de-l’analyse-d’un-template-a-partir-du-DOM)

## Composants intégrés par défaut

### component

- **Props:**
  - `is` - string | ComponentDefinition | ComponentConstructor
  - `inline-template` - booléen

- **Utilisation :**

  Un « méta-composant » pour le rendu de composants dynamiques. Le composant réel obtenu est déterminé par la prop `is` :

  ```html
  <!-- un composant dynamique contrôlé par -->
  <!-- la propriété `idComposant` de l'instance de vue -->
  <component :is="idComposant"></component>

  <!-- peut aussi faire le rendu de composants inscrits globalement ou passés comme prop -->
  <component :is="$options.components.enfant"></component>
  ```

- **Voir aussi :** [Composants dynamiques](../guide/components.html#Composants-dynamiques)

### transition

- **Props:**
  - `name` - string, utilisé pour générer automatiquement des noms de classes CSS pour les transitions. p. ex. `name: 'fade'` donnera `.fade-enter`, `.fade-enter-active`, etc. Valeur par défaut : `"v"`.
  - `appear` - booléen, indique si la transition doit être appliquée ou non au rendu initial. Valeur par défaut: `false`.
  - `css` - booléen, indique si les classes CSS de transition doivent être appliquées ou non. Valeur par défaut: `true`. Si assigné à `false`, seuls les hooks JavaScript inscrits via les événements du composant seront déclenchés.
  - `type` - string, spécifie le type d'événement de transition à attendre pour déterminer le timing de fin de transition. Les valeurs disponibles sont `"transition"` and `"animation"`. Par défaut, il détectera automatiquement le type ayant la durée la plus longue.
  - `mode` - string, contrôle la séquence de timing des transitions entrantes/sortantes. Les modes disponibles sont `"out-in"` et `"in-out"`; par défaut en simultané.
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
  - `leave-cancelled` (`v-show` uniquement)
  - `appear-cancelled`

- **Utilisation :**

  `<transition>` sert d'effets de transition pour un  **unique** élément/composant. Le rendu de `<transition>` ne donne pas un élément supplémentaire dans le DOM, et n'apparaît pas non plus dans la hiérarchie du composant inspecté. Il applique simplement le comportement de transition au contenu imbriqué à l'intérieur.

  ```html
  <!-- élément simple -->
  <transition>
    <div v-if="ok">contenu permuté</div>
  </transition>

  <!-- composant dynamique -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- hooks d'événement -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">contenu permuté</div>
    </transition>
  </div>
  ```

  ``` js
  new Vue({
    ...
    methods: {
      transitionComplete: function (el) {
        // pour l'élément du DOM 'el' passé en argument, faire quelque-chose...
      }
    }
    ...
  }).$mount('#transition-demo')
  ```

- **Voir aussi :** [Transitions : entrantes, sortantes et de listes](../guide/transitions.html)

### transition-group

- **Props:**
  - `tag` - string, par défaut `span`.
  - `move-class` - surcharge la classe CSS appliquée durant le mouvement de transition.
  - expose les mêmes props que `<transition>` à l'exception de `mode`.

- **Événements:**
  - expose les mêmes événements que `<transition>`.

- **Utilisation :**

  `<transition-group>` sert d'effets de transition pour de **multiples** éléments/composants. Le rendu de `<transition-group>` donne un nouvel élément dans le DOM. Par défaut, il s'agit d'un `<span>`, mais vous pouvez configurer le type d'élément en sortie via l'attribut `tag`.

  Notez que chaque enfant dans un `<transition-group>` doit avoir une **clé unique** pour que les animations fonctionnent correctement.

  `<transition-group>` supporte les déplacements de transition via les transformations CSS. Quand la position à l'écran d'un élément enfant a changé après une mise à jour, une classe CSS de déplacement (auto générée à partir de l'attribut `name` ou configurée via l'attribut `move-class`) est appliquée. Si la propriété CSS `transform` permet les transitions quand la classe de déplacement est appliquée, l'élément sera animé de façon fluide jusqu'à sa destination en utilisant la [technique FLIP](https://aerotwist.com/blog/flip-your-animations/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **Voir aussi :** [Transition : entrantes, sortantes et de listes](../guide/transitions.html)

### keep-alive

- **Props:**
  - `include` - string ou RegExp. Seuls les composants correspondants seront mis en cache.
  - `exclude` - string ou RegExp. Les composants correspondants ne seront pas mis en cache.

- **Utilisation :**

  Quand il entoure un composant dynamique, `<keep-alive>` met en cache les instances de composant inactives sans les détruire. Tout comme `<transition>`, `<keep-alive>` est un composant abstrait : le rendu ne donne pas d'élément supplémentaire dans le DOM, et il n'apparaît pas dans la chaîne de composants du parent.

  Lorsqu'un composant est permuté à l'intérieur de `<keep-alive>`, ses hooks de cycle de vie `activated` et `deactivated` seront appelés en conséquence.

  > À partir de la 2.2.0+, `activated` et `deactivated` se déclencheront pour tous les composants imbriqués dans une arborescence `<keep-alive>`.

  Principalement utilisé pour préserver l'état du composant ou éviter un nouveau rendu.

  ```html
  <!-- basique -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- de multiples enfants conditionnels -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- utilisé avec `<transition>` -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Notez que `<keep-alive>` est conçu pour le cas où il a un seul composant enfant direct qui est permuté. Il ne fonctionne pas si vous avez `v-for` à l'intérieur. Quand il y a de multiples enfants condtionnels, comme ci-dessus, `<keep-alive>` requiert qu'un seul enfant soit visible à la fois.

- **`include` et `exclude`**

  > Nouveauté de la 2.1.0

  Les props `include` et `exclude` définissent les conditions de mise en cache des composants. Les deux props peuvent être soit une liste délimitée par des virgules, soit une expression régulière, soit une Array :

  ``` html
  <!-- liste délimitée par des virgules -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- expression régulière (utiliser `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (utiliser `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  La correspondance est d'abord faite avec l'option `name` propre au composant, puis avec son nom d'inscription locale (la clé dans l'option `components` du parent) si l'option `name` n'est pas disponible. Les composants anonymes ne peuvent pas être mis en correspondance.

  <p class="tip">`<keep-alive>` ne fonctionne pas avec les composants fonctionnels puisqu'ils n'ont pas d'instances à mettre en cache.</p>

- **Voir aussi :** [Composants dynamiques - keep-alive](../guide/components.html#keep-alive)

### slot

- **Props:**
  - `name` - string, utilisé pour nommer le slot.

- **Utilisation :**

  `<slot>` sert d'emplacement de distribution de contenu dans les templates de composant. L'élement `<slot>` lui-même sera remplacé par le contenu.

  Pour un usage détaillé, consultez la section du guide en lien ci-dessous.

- **Voir aussi :** [Distribution de contenu avec des slots](../guide/components.html#Distribution-de-contenu-avec-des-slots)

## Interface VNode

- Veuillez vous référer à la [déclaration de classe VNode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js).

## Rendu côté serveur

- Veuillez vous référer à la [documentation du package vue-server-renderer](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer).
