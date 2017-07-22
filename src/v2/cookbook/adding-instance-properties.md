---
title: Ajouter des propriétés aux instances
type: cookbook
order: 1.1
---

## Exemple simple

Il peut y avoir des données/utilitaires que vous aimeriez utiliser dans de nombreux composants, mais vous ne voulez pas [polluer la portée globale](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch3.md). Dans ces cas-là, vous pouvez les rendre accessibles dans chaque instance de Vue en les définissant dans le prototype :

``` js
Vue.prototype.$appName = 'Mon App'
```

Maintenant, `$appName` sera accessible dans toutes les instances de Vue, même avant leur création. Si nous exécutons :

``` js
new Vue({
  beforeCreate: function () {
    console.log(this.$appName)
  }
})
```

Alors `"Mon App"` sera affiché en console. C'est aussi simple !

## L'importance de la portée des propriétés d'instances

Il se peut que vous vous demandiez :

> "Pourquoi `appName` commence par un `$` ? Est-ce important ? Qu'est-ce que ça fait ?

Aucune magie n'a lieu ici. `$` est simplement une convention que Vue utilise pour les propriétés qui sont accessibles dans toutes les instances. Cela évite les conflits avec toutes les autres données définies, propriétés calculées ou méthodes.

> "Conflits ? Qu'est-ce que ça signifie ?"

Une autre bonne question ! Si vous faites juste :

``` js
Vue.prototype.appName = 'My App'
```

Alors qu'est-ce qui sera affiché ci-dessous d'après vous ?

``` js
new Vue({
  data: {
    // Oups - appName est *aussi* le nom de la
    // propriété d'instance que nous venons de définir !
    appName: "Le nom d'une autre app"
  },
  beforeCreate: function () {
    console.log(this.appName)
  },
  created: function () {
    console.log(this.appName)
  }
})
```

Cela sera `"Le nom d'une autre app"`, puis `"Mon App"`, car `this.appName` est écrasée ([en quelques sortes](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md)) par `data` quand l'instance est créée. Nous limitons la portée des propriétés avec `$` pour éviter ça. Vous pouvez même utiliser votre propre convention si vous préférez, comme `$_appName` ou `ΩappName`, pour en plus prévenir les conflits avec les plugins et les fonctionnalités futures.

## Un exemple en situation réelle : Remplacer Vue Resource par Axios

Disons que vous remplacez le [maintenant déprécié Vue Resource](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4) ; vous aimiez vraiment accéder aux méthodes de requête avec `this.$http` et vous voulez faire la même chose avec Axios à la place.

Tout ce que vous avez à faire est inclure axios dans votre projet :

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.2/axios.js"></script>

<div id="app">
  <ul>
    <li v-for="user in users">{{ user.name }}</li>
  </ul>
</div>
```

Puis assigner `axios` à `Vue.prototype.$http` :

``` js
Vue.prototype.$http = axios
```

Alors vous serez capables d'utiliser des méthodes comme `this.$http.get` dans n'importe quelle instance de Vue :

``` js
new Vue({
  el: '#app',
  data: {
    users: []
  },
  created () {
    var vm = this
    this.$http.get('https://jsonplaceholder.typicode.com/users')
      .then(function (response) {
        vm.users = response.data
      })
  }
})
```

## Le contexte des méthodes du prototype

Au cas où vous ne seriez pas au courant, les méthodes ajoutées au prototype en JavaScript obtiennent le contexte de l'instance. Cela signifie qu'elles peuvent utiliser `this` pour accéder aux data, propriétés calculées, méthodes ou toute autre chose définie dans l'instance.

Profitons de ceci dans une méthode `$reverseText` :

``` js
Vue.prototype.$reverseText = function (propertyName) {
  this[propertyName] = this[propertyName].split('').reverse().join('')
}

new Vue({
  data: {
    message: 'Hello'
  },
  created: function () {
    console.log(this.message)    // => "Hello"
    this.$reverseText('message')
    console.log(this.message)    // => "olleH"
  }
})
```

Notez que la liaison du contexte ne fonctionnera __pas__ si vous utiliez une fonction fléchée ES6/2015, puisqu'elles gardent implicitement le contexte parent. Cela signifie que la version avec une fonction fléchée :

``` js
Vue.prototype.$reverseText = propertyName => {
  this[propertyName] = this[propertyName].split('').reverse().join('')
}
```

Rejettera une exception :

``` log
Uncaught TypeError: Cannot read property 'split' of undefined
```

## Quand éviter ce *pattern*

Tant que vous êtes vigilants sur la portée des propriétés du prototype, utiliser ce *pattern* est plutôt sûr - c'est-à-dire, peu probable de produire des bugs.

Cependant, il peut parfois semer la confusion auprès des autres développeurs. Ils peuvent voir `this.$http`, par exemple, et penser, "Oh, je ne savais pas qu'il s'agissait d'une fonctionnalité de Vue !". Ensuite ils vont sur un projet différent et sont confus quand `this.$http` est non défini. Ou alors ils cherchent sur Google comment faire quelque-chose, mais ne trouvent pas de résultats car ils ne réalisent pas qu'ils utilisent Axios sous un alias.

__C'est certes plus commode mais moins explicite.__ En regardant simplement un composant, il est impossible de dire d'où `$http` vient. Vue lui-même ? Un plugin ? Un collègue ?

Alors quelles sont les alternatives ?

## *Patterns* Alternatifs

### Quand ne pas utiliser un système de modules

Dans les applications __sans__ systèmes de modules (ex. via webpack ou Browserify), il y a un *pattern* souvent utilisé dans _n'importe quel_ *frontend* amélioré en JavaScript : un objet global `App`.

Si ce que vous voulez ajouter n'a rien à voir avec Vue spécifiquement, cela peut être une bonne alternative à étudier. Voici un exemple :

``` js
var App = Object.freeze({
  name: 'Mon App',
  description: '2.1.4',
  helpers: {
    // Ceci est une version purement fonctionnelle
    // de la méthode $reverseText décrite plus haut
    reverseText: function (text) {
      return text.split('').reverse().join('')
    }
  }
})
```

<p class="tip">Si vous avez levé un sourcil à `Object.freeze`, cela sert à empêcher l'objet d'être modifié dans le futur. Il s'agit essentiellement de rendre toutes ses propriétés constantes, les protégeant de futurs bugs d'état.</p>

Maintenant la source de ces propriétés partagées est bien plus évidente : il y a un objet `App` défini quelque-part dans l'application. Pour le trouver, les développeurs ont seulement besoin de rechercher la référence dans le projet.

Un autre avantage est que `App` peut maintenant être utilisé _n'importe où_ dans le code, qu'il soit lié à Vue ou non. Cela inclue les valeurs attachées directement aux options des instances, plutôt qu'avoir à entrer dans une fonction pour accéder aux propriétés avec `this` :

``` js
new Vue({
  data: {
    appVersion: App.version
  },
  methods: {
    reverseText: App.helpers.reverseText
  }
})
```

### Quand utiliser un système de modules

Quand vous avez accès à un système de modules, vous pouvez facilement organiser le code partagé à travers des modules, puis `require`/`import` ces modules partout où ils sont nécessaires. C'est l'approche la plus explicite car chaque fichier obtient alors une liste de dépendances. Vous savez _exactement_ d'où vient chacune d'entre elles.

Bien que certainement plus verbeux, cette approche est assurément la plus maintenable, particulièrement quand vous travaillez avec d'autres développeurs et/ou construisez une grosse application.
