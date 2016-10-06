---
type: api
---

## Configuration globale

`Vue.config` est un objet contenant les configurations globales de Vue. Vous pouvez modifier les propriétés listées ci-dessous avant de mettre en place votre application:

### debug

- **Type:** `Boolean`

- **Par défaut:** `false`

- **Utilisation:**

  ``` js
  Vue.config.debug = true
  ```

  En mode debug:

  1. Vue affiche les stack traces pour tous les warnings.

  2. Tous les noeuds de type ancre sont visibles dans le DOM en tant que noeuds commentaires. Cela facilite l'inspection de la structure en sortie.

  <p class="tip">Le mode debug est disponible uniquement sur la version de développement.</p>

### delimiters

- **Type:** `Array<String>`

- **Par défaut:** `{% raw %}["{{", "}}"]{% endraw %}`

- **Utilisation:**

  ``` js
  // ES6 template string style
  Vue.config.delimiters = ['${', '}']
  ```

  Change les caractères délimiteurs d'interpolation.

### unsafeDelimiters

- **Type:** `Array<String>`

- **Par défaut:** `{% raw %}["{{{", "}}}"]{% endraw %}`

- **Utilisation:**

  ``` js
  // make it look more dangerous
  Vue.config.unsafeDelimiters = ['{!!', '!!}']
  ```

  Change les caractères délimiteurs d'interpolation de HTML brut sans échappement.

### silent

- **Type:** `Boolean`

- **Par défaut:** `false`

- **Utilisation:**

  ``` js
  Vue.config.silent = true
  ```

  Supprime tous les logs et warnings de Vue.js.

### async

- **Type:** `Boolean`

- **Par défaut:** `true`

- **Utilisation:**

  ``` js
  Vue.config.async = false
  ```

  Lorsque le mode async est désactivé, Vue effectuera toutes les mises à jour du DOM de manière synchrone après la détection de changements dans les données. Cela peut aider au débogage dans certains scénarios, mais causera aussi des performances dégradées et peut affecter l'ordre dans lequel les callbacks des watchers sont appelés. **`async: false` n'est pas recommandé en production.**

### devtools

- **Type:** `Boolean`

- **Par défaut:** `true` (`false` dans les versions de production)

- **Utilisation:**

  ``` js
  // assurez-vous d'assigner ça de manière synchrone immédiatement après avoir chargé Vue
  Vue.config.devtools = true
  ```

  Autorise ou non l'inspection des [vue-devtools](https://github.com/vuejs/vue-devtools). Cette option a comme valeur par défaut `true` dans les versions de développement et `false` dans les versions de production. Vous pouvez l'assigner à `true` pour activer l'inspection avec les versions de production.

## Global API

<h3 id="Vue-extend">Vue.extend( options )</h3>

- **Arguments:**
  - `{Object} options`

- **Utilisation:**

  Crée une "sous-classe" du constructeur de base Vue. L'argument doit être un objet contenant les options du composant.

  Les cas spéciaux à noter ici sont les options `el` et `data` - elles doivent être des fonctions quand utilisé avec `Vue.extend()`.

  ``` html
  <div id="mount-point"></div>
  ```

  ``` js
  // crée un constructeur réutilisable
  var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>'
  })
  // crée une instance de Profile
  var profile = new Profile({
    data: {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  })
  // montage sur un élément
  profile.$mount('#mount-point')
  ```

  Cela donnera comme résultat:

  ``` html
  <p>Walter White aka Heisenberg</p>
  ```

- **Voir aussi:** [Composants](/guide/components.html)

<h3 id="Vue-nextTick">Vue.nextTick( callback )</h3>

- **Arguments:**
  - `{Function} callback`

- **Utilisation:**

  Reporte l'exécution du callback au prochain cycle de mise à jour du DOM. Utilisez-le immédiatement après avoir changé des données afin d'attendre la mise à jour du DOM.

  ``` js
  // modification de données
  vm.msg = 'Hello'
  // le DOM n'a pas encore été mis à jour
  Vue.nextTick(function () {
    // le DOM est à jour
  })
  ```

- **Voir aussi:** [File de mise à jour asynchrone](/guide/reactivity.html#Async-Update-Queue)

<h3 id="Vue-set">Vue.set( object, key, value )</h3>

- **Arguments:**
  - `{Object} object`
  - `{String} key`
  - `{*} value`

- **Retourne:** la valeur assignée.

- **Utilisation:**

  Assigne une propriété à un objet. Si l'objet est réactif, cette méthode s'assure que la propriété est créée en tant que propriété réactive et déclenche les mises à jour de la vue. Ceci est principalement utilisé pour passer outre la limitation de Vue qui est de ne pas pouvoir détecter automatiquement l'ajout de nouvelles propriétés.

- **Voir aussi:** [Réactivité en détail](/guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( object, key )</h3>

- **Arguments:**
  - `{Object} object`
  - `{String} key`

- **Utilisation:**

  Supprime une propriété d'un objet. Si l'objet est réactif, cette méthode s'assure que la suppression déclenche les mises à jour de la vue. Delete a property on an object. If the object is reactive, ensure the deletion triggers view updates. Ceci est principalement utilisé pour passer outre la limitation de Vue qui est de ne pas pouvoir détecter automatiquement la suppression de propriétés, mais vous devriez rarement en avoir besoin.

- **Voir aussi:** [Réactivité en détail](/guide/reactivity.html)

<h3 id="Vue-directive">Vue.directive( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Function | Object} [definition]`

- **Utilisation:**

  Enregistre ou récupère une directive globale.

  ``` js
  // enregistre une directive
  Vue.directive('my-directive', {
    bind: function () {},
    update: function () {},
    unbind: function () {}
  })

  // enregistre une directive comme simple fonction
  Vue.directive('my-directive', function () {
    // cette fonction sera appelée comme `update` ci-dessus
  })

  // getter, retourne la définition de la directive si enregistrée
  var myDirective = Vue.directive('my-directive')
  ```

- **Voir aussi:** [Directives personnalisées](/guide/custom-directive.html)

<h3 id="Vue-elementDirective">Vue.elementDirective( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Object} [definition]`

- **Utilisation:**

  Enregistre ou récupère une directive d'élément globale.

  ``` js
  // enregistre une directive d'élément
  Vue.elementDirective('my-element', {
    bind: function () {},
    // les directives d'élément n'utilisent pas `update`
    unbind: function () {}
  })

  // getter, retourne la définition de la directive si enregistrée
  var myDirective = Vue.elementDirective('my-element')
  ```

- **Voir aussi:** [Directives d'élement](/guide/custom-directive.html#Element-Directives)

<h3 id="Vue-filter">Vue.filter( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Function | Object} [definition]`

- **Utilisation:**

  Enregistre ou récupère un filtre global.

  ``` js
  // enregistre un filtre
  Vue.filter('my-filter', function (value) {
    // retourne la valeur modifiée
  })

  // enregistre un filtre à double sens
  Vue.filter('my-filter', {
    read: function () {},
    write: function () {}
  })

  // getter, retourne le filtre si enregistré
  var myFilter = Vue.filter('my-filter')
  ```

- **Voir aussi:** [Filtres personnalisés](/guide/custom-filter.html)

<h3 id="Vue-component">Vue.component( id, [definition] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Function | Object} [definition]`

- **Utilisation:**

  Enregistre ou récupère un composant global.

  ``` js
  // enregistre un constructeur étendu
  Vue.component('my-component', Vue.extend({ /* ... */ }))

  // enregistre un composant avec un objet options (appelle automatiquement Vue.extend)
  Vue.component('my-component', { /* ... */ })

  // récupère un composant enregistré (retourne toujours le constructeur)
  var MyComponent = Vue.component('my-component')
  ```

- **Voir aussi:** [Composants](/guide/components.html).

<h3 id="Vue-transition">Vue.transition( id, [hooks] )</h3>

- **Arguments:**
  - `{String} id`
  - `{Object} [hooks]`

- **Utilisation:**

  Enregistre ou récupère l'objet hooks qui regroupe les points d'accrochage d'une transition globale.

  ``` js
  // enregistre une transition
  Vue.transition('fade', {
    enter: function () {},
    leave: function () {}
  })

  // récupère les hooks de la transition enregistrée
  var fadeTransition = Vue.transition('fade')
  ```

- **Voir aussi:** [Transitions](/guide/transitions.html).

<h3 id="Vue-partial">Vue.partial( id, [partial] )</h3>

- **Arguments:**
  - `{String} id`
  - `{String} [partial]`

- **Utilisation:**

  Enregistre ou récupère un template partiel global sous la forme d'une chaîne de caractères.

  ``` js
  // enregistre un template partiel
  Vue.partial('my-partial', '<div>Hi</div>')

  // récupère le template partiel enregistré
  var myPartial = Vue.partial('my-partial')
  ```

- **Voir aussi:** [Elements spéciaux - &lt;partial&gt;](#partial).

<h3 id="Vue-use">Vue.use( plugin, [options] )</h3>

- **Arguments:**
  - `{Object | Function} plugin`
  - `{Object} [options]`

- **Utilisation:**

  Installe un plugin Vue.js. Si l'argument plugin est de type Object, il doit exposer une méthode  `install`. S'il s'agit d'une fonction, elle sera utilisée comme méthode d'installation. Cette méthode d'installation sera appelée avec Vue en tant qu'argument.

- **Voir aussi:** [Plugins](/guide/plugins.html).

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **Arguments:**
  - `{Object} mixin`

- **Utilisation:**

  Applique une mixin globale, qui affecte toutes les instances de Vue créées par la suite. Cela peut être utilisé par les créateurs de plugins pour injecter un composant personnalisé dans les composants. **Non recommandé dans le code applicatif**.

- **Voir aussi:** [Mixins globales](/guide/mixins.html#Global-Mixin)

## Options / Data

### data

- **Type:** `Object | Function`

- **Restriction:** accepte uniquement une `Function` quand utilisé dans une définition de composant.

- **Détails:**

  C'est l'objet de données de l'instance Vue. Vue.js va convertir de manière récursive ses propriétés en getter/setters afin de les rendre "réactives". **L'objet doit être un objet littéral classique**: les objets natifs, les getter/setters existants et les propriétés issues du prototype seront ignorées. Il n'est pas recommandé d'observer des objets complexes.

  Une fois l'instance créée, l'objet de données initial sera accessible via `vm.$data`. L'instance Vue sert également de proxy pour toutes les propriétés trouvées dans cet objet de données.

  Les propriétés commençant par `_` ou `$` ne seront **pas** proxyfiées par l'instance Vue car elles pourraient entrer en conflit avec certaines propriétés internes et méthodes d'API de Vue. Vous devrez y accéder via `vm.$data._property`.

  Lors de la définition d'un **composant**, la propriété `data` doit être déclarée en tant que fonction retournant l'objet de données initial, car il y aura plusieurs instances créées utilisant la même définition. Si nous utilisons un objet classique pour `data`, le même objet sera **partagé par référence** à toutes les instances créées! En fournissant une fonction `data` , chaque fois qu'une nouvelle instance est créée, nous l'appelons simplement afin de récupérer une copie fraîche des données initiales.

  Si nécessaire, un clône profond de l'objet original peut être obtenu en passant `vm.$data` à travers `JSON.parse(JSON.stringify(...))`.

- **Exemple:**

  ``` js
  var data = { a: 1 }

  // création directe d'instance
  var vm = new Vue({
    data: data
  })
  vm.a // -> 1
  vm.$data === data // -> true

  // data doit être une fonction avec Vue.extend()
  var Component = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

- **Voir aussi:** [Réactivité en détail](/guide/reactivity.html).

### props

- **Type:** `Array | Object`

- **Détails:**

  Une liste ou un objet décrivant les attributs exposés par le composant afin de passer des données depuis le composant parent. Ce paramètre a une syntaxe simple basée sur une `Array` et une syntaxe alternative basée sur un `Object` qui permet une configuration avancée telle qu'une vérification de typage, des contrôles de validation personnalisés et des valeurs par défaut.

- **Exemple:**

  ``` js
  // syntaxe simple
  Vue.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // syntaxe avancée avec validation
  Vue.component('props-demo-advanced', {
    props: {
      // juste une vérification de type
      size: Number,
      // type checking ainsi que d'autres validations
      name: {
        type: String,
        required: true
      }
    }
  })
  ```

- **Voir aussi:** [Attributs](/guide/components.html#Props)

### computed

- **Type:** `Object`

- **Détails:**

  Les propriétés calculées qui seront ajoutées à l'instance Vue. Tous les getters et setters ont leur contexte `this` automatiquement lié à l'instance Vue.

- **Exemple:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // getter uniquement, on a juste besoin d'une fonction
      aDouble: function () {
        return this.a * 2
      },
      // getter et setter à la fois
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

- **Voir aussi:**
  - [Propriétés calculées](/guide/computed.html)
  - [Réactivité en détail: les propriétés calculées](/guide/reactivity.html#Inside-Computed-Properties)

### methods

- **Type:** `Object`

- **Détails:**

  Les méthodes qui seront ajoutées à l'instance Vue. Vous pouvez accéder à ces méthodes directement depuis l'instance VM ou les utiliser à travers des expressions de directives. Toutes les méthodes ont leur contexte d'appel `this` automatiquement assigné à l'instance Vue.

- **Exemple:**

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

- **Voir aussi:** [Méthodes et gestion d'évènements](/guide/events.html)

### watch

- **Type:** `Object`

- **Détails:**

  Un objet où les clés sont des expressions à surveiller et où la valeur associée est la fonction de callback exécutée quand cette expression change. La valeur peut également être une `String` correspondant au nom d'une méthode de l'instance, ou un `Object` avec des options avancées. L'instance Vue appelera `$watch()` pour chaque entrée dans l'objet à l'initialisation.

- **Exemple:**

  ``` js
  var vm = new Vue({
    data: {
      a: 1
    },
    watch: {
      'a': function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
      // nom d'une méthode
      'b': 'someMethod',
      // watcher profond
      'c': {
        handler: function (val, oldVal) { /* ... */ },
        deep: true
      }
    }
  })
  vm.a = 2 // -> new: 2, old: 1
  ```

- **Voir aussi:** [Méthodes d'instance - vm.$watch](#vm-watch)

## Options / DOM

### el

- **Type:** `String | HTMLElement | Function`

- **Restriction:** only accepts type `Function` when used in a component definition.

- **Détails:**

  Provide the Vue instance an existing DOM element to mount on. It can be a CSS selector string, an actual HTMLElement, or a function that returns an HTMLElement. Note that the provided element merely serves as a mounting point; it will be replaced if a template is also provided, unless `replace` is set to false. The resolved element will be accessible as `vm.$el`.

  When used in `Vue.extend`, a function must be provided so each instance gets a separately created element.

  If this option is available at instantiation, the instance will immediately enter compilation; otherwise, the user will have to explicitly call `vm.$mount()` to manually start the compilation.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### template

- **Type:** `String`

- **Détails:**

  A string template to be used as the markup for the Vue instance. By default, the template will **replace** the mounted element. When the `replace` option is set to `false`, the template will be inserted into the mounted element instead. In both cases, any existing markup inside the mounted element will be ignored, unless content distribution slots are present in the template.

  If the string starts with `#` it will be used as a querySelector and use the selected element's innerHTML as the template string. This allows the use of the common `<script type="x-template">` trick to include templates.

  Note that under certain situations, for example when the template contains more than one top-level element, or contains only plain text, the instance will become a fragment instance - i.e. one that manages a list of nodes rather than a single node. Non flow-control directives on the mount point for fragment instances are ignored.

- **Voir aussi:**
  - [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)
  - [Content Distribution](/guide/components.html#Content-Distribution-with-Slots)
  - [Fragment Instance](/guide/components.html#Fragment-Instance)

### replace

- **Type:** `Boolean`

- **Par défaut:** `true`

- **Restriction:** only respected if the **template** option is also present.

- **Détails:**

  Determines whether to replace the element being mounted on with the template. If set to `false`, the template will overwrite the element's inner content without replacing the element itself.

- **Example**:

  ``` html
  <div id="replace"></div>
  ```

  ``` js
  new Vue({
    el: '#replace',
    template: '<p>replaced</p>'
  })
  ```

  Will result in:

  ``` html
  <p>replaced</p>
  ```

  In comparison, when `replace` is set to `false`:

  ``` html
  <div id="insert"></div>
  ```

  ``` js
  new Vue({
    el: '#insert',
    replace: false,
    template: '<p>inserted</p>'
  })
  ```

  Will result in:

  ``` html
  <div id="insert">
    <p>inserted</p>
  </div>
  ```

## Options / Lifecycle Hooks

### init

- **Type:** `Function`

- **Détails:**

  Called synchronously after the instance has just been initialized, before data observation and event / watcher setup.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### created

- **Type:** `Function`

- **Détails:**

  Called synchronously after the instance is created. At this stage, the instance has finished processing the options which means the following have been set up: data observation, computed properties, methods, watch/event callbacks. However, DOM compilation has not been started, and the `$el` property will not be available yet.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### beforeCompile

- **Type:** `Function`

- **Détails:**

  Called right before the compilation starts.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### compiled

- **Type:** `Function`

- **Détails:**

  Called after the compilation is finished. At this stage all directives have been linked so data changes will trigger DOM updates. However, `$el` is not guaranteed to have been inserted into the document yet.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### ready

- **Type:** `Function`

- **Détails:**

  Called after compilation **and** the `$el` is **inserted into the document for the first time**, i.e. right after the first `attached` hook. Note this insertion must be executed via Vue (with methods like `vm.$appendTo()` or as a result of a directive update) to trigger the `ready` hook.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### attached

- **Type:** `Function`

- **Détails:**

  Called when `vm.$el` is attached to DOM by a directive or a VM instance method such as `$appendTo()`. Direct manipulation of `vm.$el` will **not** trigger this hook.

### detached

- **Type:** `Function`

- **Détails:**

  Called when `vm.$el` is removed from the DOM by a directive or a VM instance method. Direct manipulation of `vm.$el` will **not** trigger this hook.

### beforeDestroy

- **Type:** `Function`

- **Détails:**

  Called right before a Vue instance is destroyed. At this stage the instance is still fully functional.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

### destroyed

- **Type:** `Function`

- **Détails:**

  Called after a Vue instance has been destroyed. When this hook is called, all bindings and directives of the Vue instance have been unbound and all child Vue instances have also been destroyed.

  Note if there is a leaving transition, the `destroyed` hook is called **after** the transition has finished.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

## Options / Assets

### directives

- **Type:** `Object`

- **Détails:**

  A hash of directives to be made available to the Vue instance.

- **Voir aussi:**
  - [Custom Directives](/guide/custom-directive.html)
  - [Assets Naming Convention](/guide/components.html#Assets-Naming-Convention)

### elementDirectives

- **Type:** `Object`

- **Détails:**

  A hash of element directives to be made available to the Vue instance.

- **Voir aussi:**
  - [Element Directives](/guide/custom-directive.html#Element-Directives)
  - [Assets Naming Convention](/guide/components.html#Assets-Naming-Convention)

### filters

- **Type:** `Object`

- **Détails:**

  A hash of filters to be made available to the Vue instance.

- **Voir aussi:**
  - [Custom Filters](/guide/custom-filter.html)
  - [Assets Naming Convention](/guide/components.html#Assets-Naming-Convention)

### components

- **Type:** `Object`

- **Détails:**

  A hash of components to be made available to the Vue instance.

- **Voir aussi:**
  - [Components](/guide/components.html)

### transitions

- **Type:** `Object`

- **Détails:**

  A hash of transitions to be made available to the Vue instance.

- **Voir aussi:**
  - [Transitions](/guide/transitions.html)

### partials

- **Type:** `Object`

- **Détails:**

  A hash of partial strings to be made available to the Vue instance.

- **Voir aussi:**
  - [Special Elements - partial](#partial)

## Options / Misc

### parent

- **Type:** `Vue instance`

- **Détails:**

  Specify the parent instance for the instance to be created. Establishes a parent-child relationship between the two. The parent will be accessible as `this.$parent` for the child, and the child will be pushed into the parent's `$children` array.

- **Voir aussi:** [Parent-Child Communication](/guide/components.html#Parent-Child-Communication)

### events

- **Type:** `Object`

- **Détails:**

  An object where keys are events to listen for and values are the corresponding callbacks. Note these are Vue events rather than DOM events. The value can also be a string of a method name. The Vue instance will call `$on()` for each entry in the object at instantiation.

- **Exemple:**

  ``` js
  var vm = new Vue({
    events: {
      'hook:created': function () {
        console.log('created!')
      },
      greeting: function (msg) {
        console.log(msg)
      },
      // can also use a string for methods
      bye: 'sayGoodbye'
    },
    methods: {
      sayGoodbye: function () {
        console.log('goodbye!')
      }
    }
  }) // -> created!
  vm.$emit('greeting', 'hi!') // -> hi!
  vm.$emit('bye')             // -> goodbye!
  ```

- **Voir aussi:**
  - [Instance Methods - Events](#Instance-Methods-Events)
  - [Parent-Child Communication](/guide/components.html#Parent-Child-Communication)

### mixins

- **Type:** `Array`

- **Détails:**

  The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options just like normal instance objects, and they will be merged against the eventual options using the same option merging logic in `Vue.extend()`. e.g. If your mixin contains a created hook and the component itself also has one, both functions will be called.

  Mixin hooks are called in the order they are provided, and called before the component's own hooks.

- **Exemple:**

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

- **Voir aussi:** [Mixins](/guide/mixins.html)

### name

- **Type:** `String`

- **Restriction:** only respected when used in `Vue.extend()`.

- **Détails:**

  Allow the component to recursively invoke itself in its template. Note that when a component is registered globally with `Vue.component()`, the global ID is automatically set as its name.

  Another benefit of specifying a `name` option is console inspection. When inspecting an extended Vue component in the console, the default constructor name is `VueComponent`, which isn't very informative. By passing in an optional `name` option to `Vue.extend()`, you will get a better inspection output so that you know which component you are looking at. The string will be camelized and used as the component's constructor name.

- **Exemple:**

  ``` js
  var Ctor = Vue.extend({
    name: 'stack-overflow',
    template:
      '<div>' +
        // recursively invoke self
        '<stack-overflow></stack-overflow>' +
      '</div>'
  })

  // this will actually result in a max stack size exceeded
  // error, but let's assume it works...
  var vm = new Ctor()

  console.log(vm) // -> StackOverflow {$el: null, ...}
  ```

## Instance Properties

### vm.$data

- **Type:** `Object`

- **Détails:**

  The data object that the Vue instance is observing. You can swap it with a new object. The Vue instance proxies access to the properties on its data object.

### vm.$el

- **Type:** `HTMLElement`

- **Read only**

- **Détails:**

  The DOM element that the Vue instance is managing. Note that for [Fragment Instances](/guide/components.html#Fragment-Instance), `vm.$el` will return an anchor node that indicates the starting position of the fragment.

### vm.$options

- **Type:** `Object`

- **Read only**

- **Détails:**

  The instantiation options used for the current Vue instance. This is useful when you want to include custom properties in the options:

  ``` js
  new Vue({
    customOption: 'foo',
    created: function () {
      console.log(this.$options.customOption) // -> 'foo'
    }
  })
  ```

### vm.$parent

- **Type:** `Vue instance`

- **Read only**

- **Détails:**

  The parent instance, if the current instance has one.

### vm.$root

- **Type:** `Vue instance`

- **Read only**

- **Détails:**

  The root Vue instance of the current component tree. If the current instance has no parents this value will be itself.

### vm.$children

- **Type:** `Array<Vue instance>`

- **Read only**

- **Détails:**

  The direct child components of the current instance.

### vm.$refs

- **Type:** `Object`

- **Read only**

- **Détails:**

  An object that holds child components that have `v-ref` registered.

- **Voir aussi:**
  - [Child Component Refs](/guide/components.html#Child-Component-Refs)
  - [v-ref](#v-ref).

### vm.$els

- **Type:** `Object`

- **Read only**

- **Détails:**

  An object that holds DOM elements that have `v-el` registered.

- **Voir aussi:** [v-el](#v-el).

## Instance Methods / Data

<h3 id="vm-watch">vm.$watch( expOrFn, callback, [options] )</h3>

- **Arguments:**
  - `{String | Function} expOrFn`
  - `{Function} callback`
  - `{Object} [options]`
    - `{Boolean} deep`
    - `{Boolean} immediate`

- **Retourne:** `{Function} unwatch`

- **Utilisation:**

  Watch an expression or a computed function on the Vue instance for changes. The callback gets called with the new value and the old value. The expression can be a single keypath or any valid binding expressions.

<p class="tip">Note: when mutating (rather than replacing) an Object or an Array, the old value will be the same as new value because they reference the same Object/Array. Vue doesn't keep a copy of the pre-mutate value.</p>

- **Exemple:**

  ``` js
  // keypath
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // do something
  })

  // expression
  vm.$watch('a + b', function (newVal, oldVal) {
    // do something
  })

  // function
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (newVal, oldVal) {
      // do something
    }
  )
  ```

  `vm.$watch` returns an unwatch function that stops firing the callback:

  ``` js
  var unwatch = vm.$watch('a', cb)
  // later, teardown the watcher
  unwatch()
  ```

- **Option: deep**

  To also detect nested value changes inside Objects, you need to pass in `deep: true` in the options argument. Note that you don't need to do so to listen for Array mutations.

  ``` js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback is fired
  ```

- **Option: immediate**

  Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression:

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // callback is fired immediately with current value of `a`
  ```

<h3 id="vm-get">vm.$get( expression )</h3>

- **Arguments:**
  - `{String} expression`

- **Utilisation:**

  Retrieve a value from the Vue instance given an expression. Expressions that throw errors will be suppressed and return `undefined`.

- **Exemple:**

  ``` js
  var vm = new Vue({
    data: {
      a: {
        b: 1
      }
    }
  })
  vm.$get('a.b') // -> 1
  vm.$get('a.b + 1') // -> 2
  ```

<h3 id="vm-set">vm.$set( keypath, value )</h3>

- **Arguments:**
  - `{String} keypath`
  - `{*} value`

- **Utilisation:**

  Set a data value on the Vue instance given a valid keypath. In most cases you should prefer setting properties using plain object syntax, e.g. `vm.a.b = 123`. This method is only needed in two scenarios:

  1. When you have a keypath string and want to dynamically set the value using that keypath.

  2. When you want to set a property that doesn't exist.

  If the path doesn't exist it will be recursively created and made reactive. If a new root-level reactive property is created due to a `$set` call, the Vue instance will be forced into a "digest cycle", during which all its watchers are re-evaluated.

- **Exemple:**

  ``` js
  var vm = new Vue({
    data: {
      a: {
        b: 1
      }
    }
  })

  // set an existing path
  vm.$set('a.b', 2)
  vm.a.b // -> 2

  // set a non-existent path, will force digest
  vm.$set('c', 3)
  vm.c // ->
  ```

- **Voir aussi:** [Reactivity in Depth](/guide/reactivity.html)

<h3 id="vm-delete">vm.$delete( key )</h3>

- **Arguments:**
  - `{String} key`

- **Utilisation:**

  Delete a root level property on the Vue instance (and also its `$data`). Forces a digest cycle. Not recommended.

<h3 id="vm-eval">vm.$eval( expression )</h3>

- **Arguments:**
  - `{String} expression`

- **Utilisation:**

  Evaluate a valid binding expression on the current instance. The expression can also contain filters.

- **Exemple:**

  ``` js
  // assuming vm.msg = 'hello'
  vm.$eval('msg | uppercase') // -> 'HELLO'
  ```

<h3 id="vm-interpolate">vm.$interpolate( templateString )</h3>

- **Arguments:**
  - `{String} templateString`

- **Utilisation:**

  Evaluate a piece of template string containing mustache interpolations. Note that this method simply performs string interpolation; attribute directives are ignored.

- **Exemple:**

  ``` js
  // assuming vm.msg = 'hello'
  vm.$interpolate('{{msg}} world!') // -> 'hello world!'
  ```

<h3 id="vm-log">vm.$log( [keypath] )</h3>

- **Arguments:**
  - `{String} [keypath]`

- **Utilisation:**

  Log the current instance data as a plain object, which is more inspection-friendly than a bunch of getter/setters. Also accepts an optional key.

  ``` js
  vm.$log() // logs entire ViewModel data
  vm.$log('item') // logs vm.item
  ```

## Instance Methods / Events

<h3 id="vm-on">vm.$on( event, callback )</h3>

- **Arguments:**
  - `{String} event`
  - `{Function} callback`

- **Utilisation:**

  Listen for a custom event on the current vm. Events can be triggered by `vm.$emit`, `vm.$dispatch` or `vm.$broadcast`. The callback will receive all the additional arguments passed into these event-triggering methods.

- **Exemple:**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'hi')
  // -> "hi"
  ```

<h3 id="vm-once">vm.$once( event, callback )</h3>

- **Arguments:**
  - `{String} event`
  - `{Function} callback`

- **Utilisation:**

  Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

<h3 id="vm-off">vm.$off( [event, callback] )</h3>

- **Arguments:**
  - `{String} [event]`
  - `{Function} [callback]`

- **Utilisation:**

  Remove event listener(s).

  - If no arguments are provided, remove all event listeners;

  - If only the event is provided, remove all listeners for that event;

  - If both event and callback are given, remove the listener for that specific callback only.

<h3 id="vm-emit">vm.$emit( event, [...args] )</h3>

- **Arguments:**
  - `{String} event`
  - `[...args]`

  Trigger an event on the current instance. Any additional arguments will be passed into the listener's callback function.

<h3 id="vm-dispatch">vm.$dispatch( event, [...args] )</h3>

- **Arguments:**
  - `{String} event`
  - `[...args]`

- **Utilisation:**

  Dispatch an event, first triggering it on the instance itself, and then propagates upward along the parent chain. The propagation stops when it triggers a parent event listener, unless that listener returns `true`. Any additional arguments will be passed into the listener's callback function.

- **Exemple:**

  ``` js
  // create a parent chain
  var parent = new Vue()
  var child1 = new Vue({ parent: parent })
  var child2 = new Vue({ parent: child1 })

  parent.$on('test', function () {
    console.log('parent notified')
  })
  child1.$on('test', function () {
    console.log('child1 notified')
  })
  child2.$on('test', function () {
    console.log('child2 notified')
  })

  child2.$dispatch('test')
  // -> "child2 notified"
  // -> "child1 notified"
  // parent is NOT notified, because child1 didn't return
  // true in its callback
  ```

- **Voir aussi:** [Parent-Child Communication](/guide/components.html#Parent-Child-Communication)

<h3 id="vm-broadcast">vm.$broadcast( event, [...args] )</h3>

- **Arguments:**
  - `{String} event`
  - `[...args]`

- **Utilisation:**

  Broadcast an event that propagates downward to all descendants of the current instance. Since the descendants expand into multiple sub-trees, the event propagation will follow many different "paths". The propagation for each path will stop when a listener callback is fired along that path, unless the callback returns `true`.

- **Exemple:**

  ``` js
  var parent = new Vue()
  // child1 and child2 are siblings
  var child1 = new Vue({ parent: parent })
  var child2 = new Vue({ parent: parent })
  // child3 is nested under child2
  var child3 = new Vue({ parent: child2 })

  child1.$on('test', function () {
    console.log('child1 notified')
  })
  child2.$on('test', function () {
    console.log('child2 notified')
  })
  child3.$on('test', function () {
    console.log('child3 notified')
  })

  parent.$broadcast('test')
  // -> "child1 notified"
  // -> "child2 notified"
  // child3 is NOT notified, because child2 didn't return
  // true in its callback
  ```

## Instance Methods / DOM

<h3 id="vm-appendTo">vm.$appendTo( elementOrSelector, [callback] )</h3>

- **Arguments:**
  - `{Element | String} elementOrSelector`
  - `{Function} [callback]`

- **Retourne:** `vm` - the instance itself

- **Utilisation:**

  Append the Vue instance's DOM element or fragment to target element. The target can be either an element or a querySelector string. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-before">vm.$before( elementOrSelector, [callback] )</h3>

- **Arguments:**
  - `{Element | String} elementOrSelector`
  - `{Function} [callback]`

- **Retourne:** `vm` - the instance itself

- **Utilisation:**

  Insert the Vue instance's DOM element or fragment before target element. The target can be either an element or a querySelector string. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-after">vm.$after( elementOrSelector, [callback] )</h3>

- **Arguments:**
  - `{Element | String} elementOrSelector`
  - `{Function} [callback]`

- **Retourne:** `vm` - the instance itself

- **Utilisation:**

  Insert the Vue instance's DOM element or fragment after target element. The target can be either an element or a querySelector string. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-remove">vm.$remove( [callback] )</h3>

- **Arguments:**
  - `{Function} [callback]`

- **Retourne:** `vm` - the instance itself

- **Utilisation:**

  Remove the Vue instance's DOM element or fragment from the DOM. This method will trigger transitions if present. The callback is fired after the transition has completed (or immediately if no transition has been triggered).

<h3 id="vm-nextTick">vm.$nextTick( callback )</h3>

- **Arguments:**
  - `{Function} [callback]`

- **Utilisation:**

  Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update. This is the same as the global `Vue.nextTick`, except that the callback's `this` context is automatically bound to the instance calling this method.

- **Exemple:**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // modify data
        this.message = 'changed'
        // DOM is not updated yet
        this.$nextTick(function () {
          // DOM is now updated
          // `this` is bound to the current instance
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **Voir aussi:**
  - [Vue.nextTick](#Vue-nextTick)
  - [Async Update Queue](/guide/reactivity.html#Async-Update-Queue)

## Instance Methods / Lifecycle

<h3 id="vm-mount">vm.$mount( [elementOrSelector] )</h3>

- **Arguments:**
  - `{Element | String} [elementOrSelector]`

- **Retourne:** `vm` - the instance itself

- **Utilisation:**

  If a Vue instance didn't receive the `el` option at instantiation, it will be in "unmounted" state, without an associated DOM element or fragment. `vm.$mount()` can be used to manually start the mounting/compilation of an unmounted Vue instance.

  If no argument is provided, the template will be created as an out-of-document fragment, and you will have to use other DOM instance methods to insert it into the document yourself. If `replace` option is set to `false`, then an empty `<div>` will be automatically created as the wrapper element.

  Calling `$mount()` on an already mounted instance will have no effect. The method returns the instance itself so you can chain other instance methods after it.

- **Exemple:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // create and mount to #app (will replace #app)
  new MyComponent().$mount('#app')

  // the above is the same as:
  new MyComponent({ el: '#app' })

  // or, compile off-document and append afterwards:
  new MyComponent().$mount().$appendTo('#container')
  ```

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

<h3 id="vm-destroy">vm.$destroy( [remove] )</h3>

- **Arguments:**
  - `{Boolean} [remove] - default: false`

- **Utilisation:**

  Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives, turn off all event listeners and, if the `remove` argument is true, remove its associated DOM element or fragment from the DOM.

  Triggers the `beforeDestroy` and `destroyed` hooks.

- **Voir aussi:** [Lifecycle Diagram](/guide/instance.html#Lifecycle-Diagram)

## Directives

### v-text

- **Expects:** `String`

- **Détails:**

  Updates the element's `textContent`.

  Internally, `{% raw %}{{ Mustache }}{% endraw %}` interpolations are also compiled as a `v-text` directive on a textNode. The directive form requires a wrapper element, but offers slightly better performance and avoids FOUC (Flash of Uncompiled Content).

- **Exemple:**

  ``` html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

### v-html

- **Expects:** `String`

- **Détails:**

  Updates the element's `innerHTML`. The contents are inserted as plain HTML - data bindings are ignored. If you need to reuse template pieces, you should use [partials](#partial).

  Internally, `{% raw %}{{{ Mustache }}}{% endraw %}` interpolations are also compiled as a `v-html` directive using anchor nodes. The directive form requires a wrapper element, but offers slightly better performance and avoids FOUC (Flash of Uncompiled Content).

  <p class="tip">Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `v-html` on trusted content and **never** on user-provided content.</p>

- **Exemple:**

  ``` html
  <div v-html="html"></div>
  <!-- same as -->
  <div>{{{html}}}</div>
  ```

### v-if

- **Expects:** `*`

- **Utilisation:**

  Conditionally render the element based on the truthy-ness of the expression value. The element and its contained data bindings / components are destroyed and re-constructed during toggles. If the element is a `<template>` element, its content will be extracted as the conditional block.

- **Voir aussi:** [Conditional Rendering](/guide/conditional.html)

### v-show

- **Expects:** `*`

- **Utilisation:**

  Toggle's the element's `display` CSS property based on the truthy-ness of the expression value. Triggers transitions if present.

- **Voir aussi:** [Conditional Rendering - v-show](/guide/conditional.html#v-show)

### v-else

- **Does not expect expression**

- **Restriction:** previous sibling element must have `v-if` or `v-show`.

- **Utilisation:**

  Denote the "else block" for `v-if` and `v-show`.

  ``` html
  <div v-if="Math.random() > 0.5">
    Sorry
  </div>
  <div v-else>
    Not sorry
  </div>
  ```

- **Voir aussi:** [Conditional Rendering - v-else](/guide/conditional.html#v-else)

### v-for

- **Expects:** `Array | Object | Number | String`

- **Param Attributes:**
  - [`track-by`](/guide/list.html#track-by)
  - [`stagger`](/guide/transitions.html#Staggering-Transitions)
  - [`enter-stagger`](/guide/transitions.html#Staggering-Transitions)
  - [`leave-stagger`](/guide/transitions.html#Staggering-Transitions)

- **Utilisation:**

  Render the element or template block multiple times based on the source data. The directive's value must use the special syntax `alias (in|of) expression` to provide an alias for the current element being iterated on:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Note using `of` as the delimiter is only supported in 1.0.17+.

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ``` html
  <div v-for="(index, item) in items"></div>
  <div v-for="(key, val) in object"></div>
  ```

  The detailed usage for `v-for` is explained in the guide section linked below.

- **Voir aussi:** [List Rendering](/guide/list.html).

### v-on

- **Shorthand:** `@`

- **Expects:** `Function | Inline Statement`

- **Argument:** `event (required)`

- **Modifiers:**
  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyCode | keyAlias}` - only trigger handler on certain keys.

- **Utilisation:**

  Attaches an event listener to the element. The event type is denoted by the argument. The expression can either be a method name or an inline statement, or simply omitted when there are modifiers present.

  When used on a normal element, it listens to **native DOM events** only. When used on a custom element component, it also listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

  **1.0.11+** When listening the custom events, inline statements have access to the special `$arguments` property, which is an array of the additional arguments passed to the child components' `$emit` call.

- **Exemple:**

  ``` html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

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
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ``` html
  <my-component @my-event="handleThis"></my-component>

  <!-- inline statement -->
  <my-component @my-event="handleThis(123, $arguments)"></my-component>
  ```

- **Voir aussi:** [Methods and Event Handling](/guide/events.html)

### v-bind

- **Shorthand:** `:`

- **Expects:** `* (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers:**
  - `.sync` - make the binding two-way. Only respected for prop bindings.
  - `.once` - make the binding one-time. Only respected for prop bindings.
  - `.camel` - convert the attribute name to camelCase when setting it. Only respected for normal attributes. Used for binding camelCase SVG attributes.

- **Utilisation:**

  Dynamically bind one or more attributes, or a component prop to an expression.

  When used to bind the `class` or `style` attribute, it supports additional value types such as Array or Objects. See linked guide section below for more details.

  When used for prop binding, the prop must be properly declared in the child component. Prop bindings can specify a different binding type using one of the modifiers.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Exemple:**

  ``` html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc">

  <!-- shorthand -->
  <img :src="imageSrc">

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop binding. "prop" must be declared in my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- two-way prop binding -->
  <my-component :prop.sync="someThing"></my-component>

  <!-- one-time prop binding -->
  <my-component :prop.once="someThing"></my-component>
  ```

- **Voir aussi:**
  - [Class and Style Bindings](/guide/class-and-style.html)
  - [Component Props](/guide/components.html#Props)

### v-model

- **Expects:** varies based on input type

- **Limited to:**
  - `<input>`
  - `<select>`
  - `<textarea>`

- **Param Attributes:**
  - [`lazy`](/guide/forms.html#lazy)
  - [`number`](/guide/forms.html#number)
  - [`debounce`](/guide/forms.html#debounce)

- **Utilisation:**

  Create a two-way binding on a form input element. For detailed usage, see guide section linked below.

- **Voir aussi:** [Form Input Bindings](/guide/forms.html)

### v-ref

- **Does not expect expression**

- **Limited to:** child components

- **Argument:** `id (required)`

- **Utilisation:**

  Register a reference to a child component on its parent for direct access. Does not expect an expression. Must provide an argument as the id to register with. The component instance will be accessible on its parent's `$refs` object.

  When used on a component together with `v-for`, the registered value will be an Array containing all the child component instances corresponding to the Array they are bound to. If the data source for `v-for` is an Object, the registered value will be an Object containing key-instance pairs mirroring the source Object.

- **Note:**

  Because HTML is case-insensitive, camelCase usage like `v-ref:someRef` will be converted to all lowercase. You can use `v-ref:some-ref` which properly sets `this.$refs.someRef`.

- **Exemple:**

  ``` html
  <comp v-ref:child></comp>
  <comp v-ref:some-child></comp>
  ```

  ``` js
  // access from parent:
  this.$refs.child
  this.$refs.someChild
  ```

  With `v-for`:

  ``` html
  <comp v-ref:list v-for="item in list"></comp>
  ```

  ``` js
  // this will be an array in parent
  this.$refs.list
  ```

- **Voir aussi:** [Child Component Refs](/guide/components.html#Child-Component-Refs)

### v-el

- **Does not expect expression**

- **Argument:** `id (required)`

- **Utilisation:**

  Register a reference to a DOM element on its owner Vue instance's `$els` object for easier access.

- **Note:**

  Because HTML is case-insensitive, camelCase usage like `v-el:someEl` will be converted to all lowercase. You can use `v-el:some-el` which properly sets `this.$els.someEl`.

- **Exemple:**

  ``` html
  <span v-el:msg>hello</span>
  <span v-el:other-msg>world</span>
  ```
  ``` js
  this.$els.msg.textContent // -> "hello"
  this.$els.otherMsg.textContent // -> "world"
  ```

### v-pre

- **Does not expect expression**

- **Usage**

  Skip compilation for this element and all its children. You can use this for displaying raw mustache tags. Skipping large numbers of nodes with no directives on them can also speed up compilation.

- **Exemple:**

  ``` html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

### v-cloak

- **Does not expect expression**

- **Utilisation:**

  This directive will remain on the element until the associated Vue instance finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the Vue instance is ready.

- **Exemple:**

  ``` css
  [v-cloak] {
    display: none;
  }
  ```

  ``` html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.

## Special Elements

### component

- **Attributes:**
  - `is`

- **Param Attributes:**
  - [`keep-alive`](/guide/components.html#keep-alive)
  - [`transition-mode`](/guide/components.html#transition-mode)

- **Utilisation:**

  Alternative syntax for invoking components. Primarily used for dynamic components with the `is` attribute:

  ``` html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>
  ```

- **Voir aussi:** [Dynamic Components](/guide/components.html#Dynamic-Components)

### slot

- **Attributes:**
  - `name`

- **Utilisation:**

  `<slot>` elements serve as content distribution outlets in component templates. The slot element itself will be replaced.

  A slot with the `name` attribute is called a named slot. A named slot will distribute content with a `slot` attribute that matches its name.

  For detailed usage, see the guide section linked below.

- **Voir aussi:** [Content Distribution with Slots](/guide/components.html#Content-Distribution-with-Slots)

### partial

- **Attributes:**
  - `name`

- **Utilisation:**

  `<partial>` elements serve as outlets for registered template partials. Partial contents are also compiled by Vue when inserted. The `<partial>` element itself will be replaced. It requires a `name` attribute which will be used to resolve the partial's content.

- **Exemple:**

  ``` js
  // registering a partial
  Vue.partial('my-partial', '<p>This is a partial! {{msg}}</p>')
  ```

  ``` html
  <!-- a static partial -->
  <partial name="my-partial"></partial>

  <!-- a dynamic partial -->
  <!-- renders partial with id === vm.partialId -->
  <partial v-bind:name="partialId"></partial>

  <!-- dynamic partial using v-bind shorthand -->
  <partial :name="partialId"></partial>
  ```

## Filters

### capitalize

- **Exemple:**

  ``` html
  {{ msg | capitalize }}
  ```

  *'abc' => 'Abc'*

### uppercase

- **Exemple:**

  ``` html
  {{ msg | uppercase }}
  ```

  *'abc' => 'ABC'*

### lowercase

- **Exemple:**

  ``` html
  {{ msg | lowercase }}
  ```

  *'ABC' => 'abc'*

### currency

- **Arguments:**
  - `{String} [symbol] - default: '$'`

- **Exemple:**

  ``` html
  {{ amount | currency }}
  ```

  *12345 => $12,345.00*

  Use a different symbol:

  ``` html
  {{ amount | currency '£' }}
  ```

  *12345 => £12,345.00*

### pluralize

- **Arguments:**
  - `{String} single, [double, triple, ...]`

- **Utilisation:**

  Pluralizes the argument based on the filtered value. When there is exactly one argument, plural forms simply add an "s" at the end. When there are more than one argument, the arguments will be used as array of strings corresponding to the single, double, triple ... forms of the word to be pluralized. When the number to be pluralized exceeds the length of the arguments, it will use the last entry in the array.

- **Exemple:**

  ``` html
  {{count}} {{count | pluralize 'item'}}
  ```

  *1 => '1 item'*
  *2 => '2 items'*

  ``` html
  {{date}}{{date | pluralize 'st' 'nd' 'rd' 'th'}}
  ```

  Will result in:

  *1 => '1st'*
  *2 => '2nd'*
  *3 => '3rd'*
  *4 => '4th'*
  *5 => '5th'*

### json

- **Arguments:**
  - `{Number} [indent] - default: 2`

- **Utilisation:**

  Output the result of calling `JSON.stringify()` on the value instead of outputting the `toString()` value (e.g. `[object Object]`).

- **Exemple:**

  Print an object with 4-space indent:

  ``` html
  <pre>{{ nestedObject | json 4 }}</pre>
  ```

### debounce

- **Limited to:** directives that expect `Function` values, e.g. `v-on`

- **Arguments:**
  - `{Number} [wait] - default: 300`

- **Utilisation:**

  Wrap the handler to debounce it for `x` milliseconds, where `x` is the argument. Default wait time is 300ms. A debounced handler will be delayed until at least `x` ms has passed after the call moment; if the handler is called again before the delay period, the delay period is reset to `x` ms.

- **Exemple:**

  ``` html
  <input @keyup="onKeyup | debounce 500">
  ```

### limitBy

- **Limited to:** directives that expect `Array` values, e.g. `v-for`

- **Arguments:**
  - `{Number} limit`
  - `{Number} [offset]`

- **Utilisation:**

  Limit the array to the first N items, as specified by the argument. An optional second argument can be provided to set a starting offset.

  ``` html
  <!-- only display first 10 items -->
  <div v-for="item in items | limitBy 10"></div>

  <!-- display items 5 to 15 -->
  <div v-for="item in items | limitBy 10 5"></div>
  ```

### filterBy

- **Limited to:** directives that expect `Array` values, e.g. `v-for`

- **Arguments:**
  - `{String | Function} targetStringOrFunction`
  - `"in" (optional delimiter)`
  - `{String} [...searchKeys]`

- **Utilisation:**

  Return a filtered version of the source Array. The first argument can either be a string or a function.

  When the first argument is a string, it will be used as the target string to search for in each element of the Array:

  ``` html
  <div v-for="item in items | filterBy 'hello'">
  ```

  In the above example, only items that contain the target string `"hello"` will be displayed.

  If the item is an object, the filter will recursively search every nested property of the object for the target string. To narrow down the search scope, additional search keys can be specified:

  ``` html
  <div v-for="user in users | filterBy 'Jack' in 'name'">
  ```

  In the above example, the filter will only search for `"Jack"` in the `name` field of each user object. **It is a good idea to always limit the search scope for better performance.**

  The examples above are using static arguments - we can, of course, use dynamic arguments as target string or search keys. Combined with `v-model` we can easily implement type-ahead filtering:

  ``` html
  <div id="filter-by-example">
    <input v-model="name">
    <ul>
      <li v-for="user in users | filterBy name in 'name'">
        {{ user.name }}
      </li>
    </ul>
  </div>
  ```

  ``` js
  new Vue({
    el: '#filter-by-example',
    data: {
      name: '',
      users: [
        { name: 'Bruce' },
        { name: 'Chuck' },
        { name: 'Jackie' }
      ]
    }
  })
  ```

  {% raw %}
  <div id="filter-by-example" class="demo">
    <input v-model="name">
    <ul>
      <li v-for="user in users | filterBy name in 'name'">
        {{ user.name }}
      </li>
    </ul>
  </div>
  <script>
  new Vue({
    el: '#filter-by-example',
    data: {
      name: '',
      users: [{ name: 'Bruce' }, { name: 'Chuck' }, { name: 'Jackie' }]
    }
  })
  </script>
  {% endraw %}

- **Additional Examples:**

  Multiple search keys:

  ``` html
  <li v-for="user in users | filterBy searchText in 'name' 'phone'"></li>
  ```

  Multiple search keys with a dynamic Array argument:

  ``` html
  <!-- fields = ['fieldA', 'fieldB'] -->
  <div v-for="user in users | filterBy searchText in fields">
  ```

  Use a custom filter function:

  ``` html
  <div v-for="user in users | filterBy myCustomFilterFunction">
  ```

### orderBy

- **Limited to:** directives that expect `Array` values, e.g. `v-for`

- **Arguments:**
  - `{String} sortKey`
  - `{String} [order] - default: 1`

- **Utilisation:**

  Return a sorted version of the source Array. The `sortKey` is the key to use for the sorting. The optional `order` argument specifies whether the result should be in ascending (`order >= 0`) or descending (`order < 0`) order.

  For arrays of primitive values, any truthy `sortKey` will work.

- **Exemple:**

  Sort users by name:

  ``` html
  <ul>
    <li v-for="user in users | orderBy 'name'">
      {{ user.name }}
    </li>
  </ul>
  ```

  In descending order:

  ``` html
  <ul>
    <li v-for="user in users | orderBy 'name' -1">
      {{ user.name }}
    </li>
  </ul>
  ```

  Sort primitive values:

  ``` html
  <ul>
    <li v-for="n in numbers | orderBy true">
      {{ n }}
    </li>
  </ul>
  ```

  Dynamic sort order:

  ``` html
  <div id="orderby-example">
    <button @click="order = order * -1">Reverse Sort Order</button>
    <ul>
      <li v-for="user in users | orderBy 'name' order">
        {{ user.name }}
      </li>
    </ul>
  </div>
  ```

  ``` js
  new Vue({
    el: '#orderby-example',
    data: {
      order: 1,
      users: [{ name: 'Bruce' }, { name: 'Chuck' }, { name: 'Jackie' }]
    }
  })
  ```

  {% raw %}
  <div id="orderby-example" class="demo">
    <button @click="order = order * -1">Reverse Sort Order</button>
    <ul>
      <li v-for="user in users | orderBy 'name' order">
        {{ user.name }}
      </li>
    </ul>
  </div>
  <script>
  new Vue({
    el: '#orderby-example',
    data: {
      order: 1,
      users: [{ name: 'Bruce' }, { name: 'Chuck' }, { name: 'Jackie' }]
    }
  })
  </script>
  {% endraw %}

## Array Extension Methods

Vue.js extends `Array.prototype` with two additional methods that makes it easier to perform some common Array operations while ensuring reactive updates are properly triggered.

### array.$set(index, value)

- **Arguments**
  - `{Number} index`
  - `{*} value`

- **Usage**

  Set an element in the array to a value by index and trigger view updates.

  ``` js
  vm.animals.$set(0, { name: 'Aardvark' })
  ```

- **Voir aussi:** [Array Detection Caveats](/guide/list.html#Caveats)

### array.$remove(reference)

- **Arguments**
  - `{Reference} reference`

- **Usage**

  Remove an element from an array by reference and trigger view updates. This is a sugar method for first searching for the element in the array, and then if found, calling `array.splice(index, 1)`.

  ``` js
  var aardvark = vm.animals[0]
  vm.animals.$remove(aardvark)
  ```

- **Voir aussi:** [Mutation Methods](/guide/list.html#Mutation-Methods)
