---
title: Introduction
type: guide
order: 2
---

## Vue.js, qu'est-ce que c'est ?

Vue (prononcé /vjuː/, comme le terme anglais _**view**_) est un **framework évolutif** pour construire des interfaces utilisateur. À la différence des autres frameworks monolithiques, Vue a été conçu et pensé pour pouvoir être adopté de manière incrémentale. Le cœur de la bibliothèque est concentré uniquement sur la partie vue, et il est vraiment simple de l'intégrer avec d'autres bibliothèques ou projets existants. D'un autre côté, Vue est tout à fait capable de faire tourner des applications web monopages quand il est couplé avec [des outils modernes](single-file-components.html) et [des bibliothèques complémentaires](https://github.com/vuejs/awesome-vue#components--libraries).

Si vous êtes un développeur *frontend* confirmé et que vous souhaitez comparer Vue avec les autres bibliothèques/frameworks, jetez un œil à la [Comparaison avec les autres frameworks](comparison.html).

## Pour commencer

<p class="tip">Ce guide officiel présuppose que vous ayez un niveau intermédiaire de connaissance en HTML, CSS et JavaScript. Si vous êtes complètement nouveau dans le développement *frontend*, ce n'est peut-être pas la solution la plus judicieuse de vous lancer dans un framework pour vos premiers pas — aussi complétez vos bases avant de revenir ! Bien qu'une première expérience avec d'autres frameworks puisse être utile, cela n'est pas obligatoire.</p>

La manière la plus simple d'essayer Vue.js est d'utiliser [l'exemple Hello World sur JSFiddle](https://jsfiddle.net/chrisvfritz/50wL7mdz/). Si vous le souhaitez, ouvrez-le dans un nouvel onglet afin de suivre pendant que nous parcourons des exemples de base. Vous pouvez aussi simplement créer un fichier `.html` et ajouter Vue avec :

``` html
<script src="https://unpkg.com/vue"></script>
```

La page d'[installation](installation.html) vous offre d'autres manières d'installer Vue. Notez que nous **ne** recommandons **pas** aux débutants de commencer avec `vue-cli`, surtout si vous n'êtes pas encore familier avec les outils de *build* basés sur Node.js.

## Rendu déclaratif

Au cœur de Vue.js, il y a un système qui va nous permettre de faire le rendu des données déclarativement dans le DOM en utilisant simplement cette syntaxe de template :

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

Nous venons tout juste de créer notre première application Vue ! Ça ressemble à un simple rendu de template en chaîne de caractères, mais sous le capot, Vue effectue un réel travail. Les données et le DOM sont maintenant couplés, et tout est à présent **réactif**. Comment s'en rendre compte ? Ouvrez juste la console JavaScript de votre navigateur (là maintenant, sur cette page) et attribuez à `app.message` différentes valeurs. Vous devriez voir le rendu de l'exemple en cours se mettre à jour en concordance.

En plus de l'interpolation de texte, nous pouvons également lier les attributs d'un élément comme ceci :

``` html
<div id="app-2">
  <span v-bind:title="message">
    Passez votre souris sur moi pendant quelques secondes 
    pour voir mon titre lié dynamiquement !
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Vous avez affiché cette page le ' + new Date()
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
    message: 'Vous avez affiché cette page le ' + new Date()
  }
})
</script>
{% endraw %}

Ici nous venons de rencontrer quelque chose de nouveau. L'attribut `v-bind` que vous voyez est appelé une **directive**. Les directives sont préfixées par `v-` pour indiquer que ce sont des attributs spéciaux fournis par Vue, et comme vous avez peut être deviné, elles appliquent un comportement réactif spécifique au DOM après rendu. Ici cela veut basiquement dire : « garde l'attribut `title` de cet élément à jour avec la propriété `message` de l'instance de Vue ».

Si vous ouvrez votre console JavaScript une nouvelle fois et entrez `app2.message = 'un nouveau message'`, de nouveau vous verrez le HTML lié — dans notre cas l'attribut `title` — se mettre à jour.

## Conditions et boucles

Il est assez simple de permuter la présence d'un élément : 

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

Il existe quelques autres directives, chacune avec leur propre fonction spécifique. Par exemple, la directive `v-for` peut être utilisée pour afficher une liste d'éléments en provenance d'un tableau de données.

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
      { text: 'Créer quelque chose de génial' }
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
      { text: 'Créer quelque chose de génial' }
    ]
  }
})
</script>
{% endraw %}

Dans la console, entrez `app4.todos.push({ text: 'Nouvel élément' })`. Vous devriez le voir ajouté à la liste.

## Gestion des entrées utilisateur

Afin de permettre aux utilisateurs d’interagir avec votre application, nous pouvons utiliser la directive `v-on` pour attacher des écouteurs d’événements qui invoquent des méthodes sur nos instances de Vue :

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

Notez que dans la méthode, nous avons seulement mis à jour l'état de l'application sans toucher au DOM — toutes les manipulations de DOM sont prises en charge par Vue, ainsi le code que vous écrivez se concentre sur la logique sous-jacente.

Vue fournit aussi la directive `v-model` qui fait de la liaison de données bidirectionnelle entre les champs d'un formulaire et l'état de l'application une simple formalité :

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

Le système de composant est un autre concept important de Vue, car c'est une abstraction qui nous permet de construire de plus grosses applications composées de plus petits composants réutilisables et autonomes. Quand on y pense, presque tous les types d'interface applicative peuvent être abstraites en un arbre de composants.

![Arbre de composants](/images/components.png)

Dans Vue, un composant est essentiellement une instance de Vue avec des options prédéfinies. Déclarer un composant avec Vue est très simple :

``` js
// Définit un nouveau composant appelé todo-item
Vue.component('todo-item', {
  template: '<li>Ceci est une liste</li>'
})
```

Maintenant nous pouvons l'insérer dans le template d'un autre composant :

``` html
<ol>
  <!-- Crée une instance du composant todo-list -->
  <todo-item></todo-item>
</ol>
```

Mais cela donnerait comme rendu le même texte, ce qui n'est pas vraiment intéressant. Nous devrions être capable de passer les données de la portée parente dans le composant enfant. Modifions la définition du composant pour lui permettre d'accepter une [*prop*](components.html#Props) :

``` js
Vue.component('todo-item', {
  // Le composant todo-item accepte maintenant une
  // « prop » qui est comme un attribut personnalisé.
  // Cette prop est appelée todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Maintenant nous pouvons passer la liste dans chaque composant répété en utilisant `v-bind` :

``` html
<div id="app-7">
  <ol>
    <!-- Maintenant nous fournissons à chaque todo-item l'objet todo qu'il -->
    <!-- représente de manière à ce que son contenu puisse être dynamique. -->
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

Ceci n'est qu'un exemple grossier, nous avons réussi à séparer notre application en deux plus petites unités, et chaque enfant est raisonnablement bien découplé de son parent via l'utilisation des props. Nous pouvons maintenant améliorer notre `<todo-item>` avec un template et une logique plus complexes sans affecter l'application parente.

Pour une grosse application, il est nécessaire de la diviser entièrement en composants afin de rendre le développement plus abordable. Nous parlerons des composants plus précisément [plus tard dans le guide](components.html), mais en attendant voici un exemple (imaginaire) de ce a quoi un template d'application pourrait ressembler avec des composants :

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

Vous avez peut-être remarqué que les composants de Vue sont très similaires aux **_Custom Elements_**, qui sont une partie de la [spécification des *Web Components*](http://www.w3.org/wiki/WebComponents/). C'est parce que la syntaxe de Vue est vaguement inspirée de cette spécification. Par exemple, les composants de Vue implémentent l'[API Slot](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) et l'attribut spécial `is`. Cependant, il y a quelques différences essentielles :

1. La spécification des *Web Components* est toujours à l'état de brouillon, et n'est pas implémentée nativement dans tous les navigateurs. En comparaison, les composants de Vue n'ont besoin d'aucun *polyfill* et fonctionnent de la même manière dans tous les navigateurs supportés (IE9 et supérieurs). Quand cela est nécessaire, les composants de Vue peuvent également être implémentés à l'intérieur d'un élément personnalisé natif.

2. Les composants de Vue fournissent des fonctionnalités importantes qui ne sont pas disponibles dans les éléments personnalisés  standards, notamment le flux de données entre composants, la communication par événements personnalisés et l'intégration avec les outils de *build*.

## Prêt pour la suite ?

Nous venons juste d'introduire brièvement les fonctionnalités les plus basiques du cœur de Vue.js — le reste de ce guide va les traiter plus en détail, ainsi que d'autres fonctionnalités avancées. Assurez-vous donc de le lire jusqu'au bout !
