---
title: Introduction
type: guide
order: 2
---

## Vue.js, qu'est-ce que c'est ?

Vue (prononcé /vjuː/, comme le terme anglais **view**) est un **framework évolutif** pour construire des interfaces utilisateurs. À la différence des autres frameworks monolithiques, Vue est conçu pour partir d'une base simple qu'il convient de faire évoluer progressivement. Le cœur de la bibliothèque est concentré uniquement sur la partie vue, et il est vraiment simple de l'intégrer avec d'autres bibliothèques ou projets existants. D'un autre côté, Vue est tout à fait capable de propulser des applications web mono-page quand il est couplé avec [des outils modernes](single-file-components.html) et [des bibliothèques officiellement supportées](https://github.com/vuejs/awesome-vue#libraries--plugins).

Si vous êtes un développeur frontend confirmé et que vous souhaitez comparer Vue avec les autres bibliothèques/frameworks, jettez un œil à la [Comparaison avec les autres frameworks](comparison.html).

## Pour commencer

<p class="tip">Ce guide officiel présuppose que vous ayez un certain niveau de connaissance en HTML, CSS et JavaScript. Si vous êtes complètement nouveau dans le développement frontend, ce n'est peut-être pas la solution la plus judicieuse de vous lancer dans un framework pour vos premiers pas — aussi complétez vos bases avant de revenir ! Bien qu'une première expérience avec d'autres frameworks puisse être utile, cela n'est pas obligatoire.</p>

La manière la plus simple d'essayer Vue.js est d'utiliser [le Hello World d'exemple JSFiddle](https://jsfiddle.net/chrisvfritz/50wL7mdz/). Ouvrez le dans un nouvel onglet si vous le souhaitez et gardez le tout au long des exemples de base. Vous pouvez aussi simplement créer un fichier `.html` et ajouter Vue avec :

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

La page d'[installation](installation.html) vous offre d'autres manière d'installer Vue. Notez que nous **ne** recommandons **pas** aux débutants de commencer avec `vue-cli`, surtout si vous n'êtes pas encore familier avec les outils fournis avec Node.js.

## Rendu déclaratif

Au cœur de Vue.js il y a un système qui va nous permettre de rendre les données déclarativement dans le DOM en utilisant simplement cette syntaxe :

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue !'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue !'
  }
})
</script>
{% endraw %}

Nous venons tout juste de créer notre première application Vue ! Ça ressemble sacrément à du simple rendu dans un template, mais Vue effectue un réel travail dans l'ombre. Les données et le DOM sont maintenant couplés, et tout est à présent **réactif**. Comment s'en rendre compte ? Ouvrez juste la console JavaScript de votre navigateur (là maintenant, sur cette page) et attribuez à `app.message` différentes valeurs. Vous devriez voir le rendu de l'exemple en cours se mettre à jour en concordance.

En plus de l'interpolation de texte, nous pouvons également lier les éléments par attributs comme ceci :

``` html
<div id="app-2">
  <span v-bind:title="message">
    Passez votre souris sur moi pendant quelques secondes pour voir mon titre lié dynamiquement !
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Vous avez affiché cette page à ' + new Date()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Passez votre souris sur moi pendant quelques secondes pour voir mon titre lié dynamiquement !
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Vous avez affiché cette page à ' + new Date()
  }
})
</script>
{% endraw %}

Ici nous venons de rencontrer quelque chose de nouveau. L'attribut `v-bind` que vous venez de croiser est appelé une **directive**. Les directives sont préfixées par `v-` pour indiquer que ce sont des attributs spéciaux fournis par Vue, et comme vous pouvez le deviner, elles appliques le comportement réactif au rendu du DOM. Ici nous avons un simple « garde l'attribut `title` de cet élément à jour avec la propriété `message` de l'instance de Vue ».

Si vous ouvrez votre console JavaScript une nouvelle fois et entrez `app2.message = 'un nouveau message'`, de nouveau vous verrez le HTML lié — dans notre cas l'attribut `title` — se mettre à jour.

## Conditions et boucles

Il est également simple de permuter la présence d'un élément : 

``` html
<div id="app-3">
  <p v-if="seen">Maintenant vous me voyez</p>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Maintenant vous me voyez</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Côté console entrez `app3.seen = false`. Vous devriez voir le message disparaître.

Cet exemple démontre que nous pouvons lier des données non seulement aux textes et attributs, mais également à la **structure** du DOM. De plus, Vue fournit un puissant système d'effets de transition qui peut automatiquement appliquer des [effets de transition](transitions.html) quand des éléments sont insérés/mis à jour/enlevés par Vue.

Il existe quelques autres directives, chacune avec leur propre fonction spécifique. Par exemple, la directive `v-for` peut être utilisée pour afficher une liste d'élément en provenance d'un tableau de données.

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Apprendre JavaScript' },
      { text: 'Apprendre Vue' },
      { text: 'Créer un truc top' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Apprendre JavaScript' },
      { text: 'Apprendre Vue' },
      { text: 'Créer un truc top' }
    ]
  }
})
</script>
{% endraw %}

Dans la console, entrez `app4.todos.push({ text: 'Nouvel élément' })`. Vous devriez le voir ajouter à la liste.

## Gestion des entrées utilisateur

Afin de permettre aux utilisateurs d’interagir avec votre application, nous pouvons utiliser la directive `v-on` pour attacher des écouteurs d’événements qui appels des méthodes de vos instances de Vue :

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Message retourné</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js !'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Message retourné</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js !'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Notez que dans la méthode nous avons seulement mis à jour l'état de l'application sans toucher au DOM — toutes les manipulations de DOM sont prises en charge par Vue ainsi le code que vous écrivez se concentre exclusivement sur la partie logique.

Vue fournit aussi la directive `v-model` qui permet une liaison de données bidirectionnelle simple entre les champs d'un formulaire et l'état de l'application :

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue !'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue !'
  }
})
</script>
{% endraw %}

## Composer avec des composants

Le système de composant est un autre concept important de Vue, car c'est une abstraction qui nous permet de construire de larges applications composées de plus petits composants réutilisables et auto-gérés. Si vous y pensez bien, presque n'importe quelle interface d'application peut être abstrait avec un arbre de composants.

![Arbre de composants](/images/components.png)

Dans Vue, un composant est essentiellement une instance de Vue avec des options pré-définies. Enregistrer un composant avec Vue est très rapide :

``` js
// Défini un nouveau composant appelé todo-item
Vue.component('todo-item', {
  template: '<li>Ceci est une liste</li>'
})
```

Maintenant nous pouvons composer avec le template d'un autre composant :

``` html
<ol>
  <!-- Créé une instance du composant todo-list -->
  <todo-item></todo-item>
</ol>
```

Mais cela rendrait le même texte pour toutes les listes, ce qui n'est pas vraiment intéressant. Nous devrions être capable de passer les données du scope parent dans le composant enfant. Modifions la définition du composant pour lui permettre d'accepter une [*prop*](components.html#Props) :

``` js
Vue.component('todo-item', {
  // Le composant todo-item accepte maintenant une
  // « prop », ceci est comme un attribut personnalisé.
  // Cette prop est appelée todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Maintenant nous pouvons passer la liste dans chaque composant répété en utilisant `v-bind` :

``` html
<div id="app-7">
  <ol>
    <!-- Maintenant nous fournissons chaque todo-item avec l'objet todo -->
    <!-- Le contenu est à présent dynamique -->
    <todo-item v-for="item in groceryList" v-bind:todo="item"></todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { text: 'Légumes' },
      { text: 'Fromage' },
      { text: 'Tout ce que les humains sont supposés manger' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { text: 'Légumes' },
      { text: 'Fromage' },
      { text: 'Tout ce que les humains sont supposés manger' }
    ]
  }
})
</script>
{% endraw %}

Ceci n'est qu'un exemple grossier, mais nous avons séparé notre application en deux plus petites unités, et chaque enfant est convenablement découplé de son parent via l'utilisation des props. Nous pouvons maintenant améliorer notre `<todo-item>` avec un template et une logique plus conséquente sans affecter l'application parente.

Dans une large application, il est nécessaire de diviser l'application entière en composants afin de rendre le développement plus abordable. Nous parlerons des composants plus précisément [plus tard dans le guide](components.html), mais en attendant voici un exemple (imaginaire) de ce a quoi un template d'application pourrait ressemblé avec des composants :

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Parallèle avec les Custom Elements

Vous avez peut-être remarqué que les composants de Vue sont très similaire aux **Custom Elements**, qui sont une part de la [spécification des Web Components](http://www.w3.org/wiki/WebComponents/). C'est parce que la syntaxe de Vue s'en est librement inspiré après les spécifications. Par exemple, les composants de Vue implémente la [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) et l'attribut spécial `is`. Cependant, il y a quelques différences clés :

1. La spécification des Web Components est toujours à l'état de brouillon, et n'est pas implémentée nativement dans tous les navigateurs. En comparaison, les composants de Vue n'ont besoin d'aucuns polyfills et fonctionnent de la même manière dans tous les navigateurs supportés (IE9 et supérieurs). Quand cela est nécessaire, les composants de Vue peuvent également être implémentés à l'intérieur d'un custom element natif.

2. Les composants de Vue fournissent des fonctionnalités importantes qui ne sont pas disponible dans les custom elements standard, comme notablement le flux de données multi-composant, la communication événementielle personnalisée et les outils de build intégrés.

## Prêt pour la suite ?

Nous venons juste d'introduire brièvement les fonctionnalités les plus basiques du cœur de Vue.js — le reste de ce guide va les traiter, ainsi que des fonctionnalités plus avancées, plus en détails. Donc assurez-vous de ne rien rater !
