---
title: Props
type: guide
order: 102
---

> Cette page suppose que vous avez déjà lu les principes de base des [composants](components.html). Lisez-les en premier si les composants sont quelque chose de nouveau pour vous.

## Casse des props (camelCase vs. kebab-case)

Les noms d'attributs HTML sont insensibles à la casse, aussi les navigateurs interprèteront de la même manière les majuscules et les minuscules. Cela signifie que pour l'utilisation des templates directement dans le DOM, les props en camelCase doivent utiliser leur équivalent kebab-case (délimités par des tirets) :

``` js
Vue.component('blog-post', {
  // camelCase en JavaScript
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

``` html
<!-- kebab-case en HTML -->
<blog-post post-title="Hello !"></blog-post>
```

Cependant, si vous utilisez les templates de chaine de caractères directement dans le JavaScript, il n'y a pas cette limitation.

## Types des props

Pour l'instant, nous n'avons vu que les props listées dans des tableaux de chaines de caractères :

```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

Plus fréquemment, vous souhaiterez que chaque prop possède un type de valeur spécifique. Dans ce cas, vous pouvez lister vos propriétés comme un objet, où les noms et les valeurs de propriétés sont respectivement les noms et types de props :

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object
}
```

Cela ne documente pas seulement votre composant mais va également permettre à l'utilisateur d'être averti par la console JavaScript du navigateur s'il passe le mauvais type. Vous pourrez en apprendre plus à propos des [validateurs de types](#Validation-des-props) plus bas dans cette page.

## Passage de props statiques ou dynamiques

Plus tôt, vous avez vu comment passer des props de manière statique comme ceci :

```html
<blog-post title="Mon initiation avec Vue"></blog-post>
```

Vous avez également vu qu'il était possible d'affecter des props dynamiquement avec `v-bind` comme ceci :

```html
<!-- Affecter dynamiquement la valeur d'une variable -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- Affecter dynamiquement la valeur d'une expression complexe -->
<blog-post v-bind:title="post.title + ' par ' + post.author.name"></blog-post>
```

Dans les deux exemples précédents, nous passons en fait une valeur sous forme de chaine de caractère mais _tous_ les types de valeur peuvent en fait être passées à la prop.

### Passer un Number

```html
<!-- Même si `42` est statique, nous avons besoin de `v-bind` pour dire à Vue -->
<!-- que c'est une expression JavaScript et non pas une chaine de caractères. -->
<blog-post v-bind:likes="42"></blog-post>

<!-- Affecter dynamiquement la valeur d'une variable. -->
<blog-post v-bind:likes="post.likes"></blog-post>
```

### Passer un Boolean

```html
<!-- Inclure une prop sans valeur signifie passer `true`. -->
<blog-post is-published></blog-post>

<!-- Même si `false` est statique, nous avons besoin de `v-bind` pour dire à Vue -->
<!-- que c'est une expression JavaScript et non pas une chaine de caractères. -->
<blog-post v-bind:is-published="false"></blog-post>

<!-- Affecter dynamiquement la valeur d'une variable. -->
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```

### Passer un Array

```html
<!-- Même si le tableau est statique, nous avons besoin de `v-bind` pour dire à Vue -->
<!-- que c'est une expression JavaScript et non pas une chaine de caractères. -->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- Affecter dynamiquement la valeur d'une variable. -->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```

### Passer un Object

```html
<!-- Même si un objet est statique, nous avons besoin de `v-bind` pour dire à Vue -->
<!-- que c'est une expression JavaScript et non pas une chaine de caractères. -->
<blog-post v-bind:author="{ name: 'Veronica', company: 'Veridian Dynamics' }"></blog-post>

<!-- Affecter dynamiquement la valeur d'une variable. -->
<blog-post v-bind:author="post.author"></blog-post>
```

### Passage des propriétés d'un objet

Si vous souhaitez passer toutes les propriétés d'un objet en tant que props, vous devez utiliser `v-bind` sans l'argument (`v-bind` au lieu de `v-bind:prop-name`). Par exemple, avec un objet `post` :

``` js
post: {
  id: 1,
  title: 'Mon initiation avec Vue'
}
```

le template suivant :

``` html
<blog-post v-bind="post"></blog-post>
```

sera équivalent à :

``` html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

## Flux de données unidirectionnel

Toutes les données forment **un flux de donnée descendant unidirectionnel (« one-way-down binding »)** entre la propriété enfant et la propriété parente : quand la propriété du parent est mise à jour, cela va mettre à jour celle de l'enfant mais pas l'inverse. Cela empêche un composant enfant de muter accidentellement l'état du parent, ce qui rendrait le flux de données de votre application difficile à appréhender.

De plus, chaque fois que le composant parent est mis à jour, toutes les props du composant enfant vont être mises à jour avec les dernières valeurs. Cela signifie que vous ne devriez **pas** essayer du muter une prop depuis l'intérieur d'un composant. Si vous le faites, Vue lancera un avertissement dans la console.

Il y a couramment deux cas où vous seriez tenté de muter une prop :

1. **La prop est seulement utilisée pour passer une valeur initiale ; le composant enfant doit seulement l'utiliser comme donnée de propriété local.** Dans ce cas, le mieux est de définir une propriété locale qui utilise la prop comme valeur initiale :

  ``` js
  props: ['initialCounter'],
  data: function () {
    return {
      counter: this.initialCounter
    }
  }
  ```

2. **La prop est passée dans un format qui demande d'être transformé.** Dans ce cas, le mieux est de définir une propriété calculée utilisant la valeur de la prop :

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Notez que les objets et les tableaux en JavaScript sont passés par référence, ce qui signifie que si la prop est un objet ou un tableau, muter l'objet ou le tableau lui-même dans l'enfant **va** affecter l'état du parent.</p>

## Validation des props

Les composants peuvent spécifier des conditions requises pour leurs props, comme les types que nous avons déjà vus. Si les conditions requises ne sont pas validées, Vue va vous en avertir dans la console JavaScript du navigateur. Cela est particulièrement utile quand on développe un composant destiné à être utilisé par les autres.

Pour spécifier des validations de prop, vous pouvez fournir un objet avec les conditions de validation pour les valeurs des `props` plutôt qu'un tableau de chaine de caractère. Par exemple :

``` js
Vue.component('my-component', {
  props: {
    // Vérification de type basique (`null` valide n'importe quel type)
    propA: Number,
    // Multiple types possibles
    propB: [String, Number],
    // Chaine de caractères nécéssaire
    propC: {
      type: String,
      required: true
    },
    // Nombre avec une valeur par défaut
    propD: {
      type: Number,
      default: 100
    },
    // Objet avec une valeur par défaut
    propE: {
      type: Object,
      // Les objets et tableaux par défaut doivent être retournés depuis
      // une fonction de fabrique
      default: function () {
        return { message: 'hello' }
      }
    },
    // Fonction de validation personnalisée
    propF: {
      validator: function (value) {
        // La valeur passée doit être l'une de ces chaines de caractères
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

Quand la validation de prop échoue, Vue va lancer un avertissement dans la console (si vous utilisez le Build de développement)

<p class="tip">Notez que les props sont validées **avant** que l'instance du composant soit créée. Donc les propriétés d'instances (par ex. `data`, `computed`, etc) ne seront pas disponibles dans les fonctions `default` ou `validator`.</p>

### Vérification de types

Le `type` peut être l'un des constructeurs natifs suivants :

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

De plus, `type` peut aussi être une fonction constructeur personnalisée et l'assertion pourra être testée avec `instanceof`. Par exemple, avec la fonction constructeur existante suivante :

```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

Vous pourrez utiliser :

```js
Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

pour valider que la valeur de la prop `author` est bien créée avec un `new Person`.

## Attributs non props

Un attribut non prop est un attribut passé à un composant mais qui n'a pas de prop correspondante de définie.

Bien que définir explicitement les props soit préféré pour passer des informations à un composant enfant, les auteurs de bibliothèques ne peuvent pas deviner dans quel contexte leur composant va être utilisé. C'est pourquoi il est possible qu'un composant puisse accepter des attributs arbitraires qui seront ajoutés sur l'élément racine du composant.

Par exemple, imaginez que vous utilisiez un composant tiers `bootstrap-date-input` avec un plugin Bootstrap qui nécessite un `data-date-picker` attribut sur l'`input`. Nous pouvons ajouter cet attribut à notre instance de composant :

``` html
<bootstrap-date-input data-date-picker="activated"></bootstrap-date-input>
```

et l'attribut `data-date-picker="activated"` sera automatiquement ajouté sur l'élément racine de `bootstrap-date-input`.

### Remplacement ou fusion avec des attributs existants

Imaginez que ceci est le template pour `bootstrap-date-input` :

``` html
<input type="date" class="form-control">
```

Pour spécifier un thème pour notre plugin date picker, nous allons avoir besoin d'ajouter une classe comme ceci :

``` html
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>
```

Dans ce cas, deux valeurs différentes de `class` sont définies :

- `form-control`, qui va être appliqué dans le template du composant,
- `date-picker-theme-dark`, qui va être passé au composant depuis son parent.

Pour la plupart des attributs, la valeur fournie par le composant va remplacer la valeur définie par le composant. Aussi par exemple, passer `type="text"` va remplacer `type="date"` et probablement tout casser ! Heureusement, les attributs `class` et `style` sont plus malins. Ces deux valeurs sont fusionnées, fournissant la valeur finale `form-control date-picker-theme-dark`.

### Désactiver l'héritage d'attribut

Si vous **ne** voulez **pas** que l'élément racine d'un composant hérite de tels attributs, vous pouvez mettre `inheritAttrs: false` dans les options de votre composant. Par exemple :

```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```

Cela est particulièrement utile avec l'utilisation combinée de la propriété d'instance `$attrs` qui contient les noms et valeurs passés à un composant comme ceci :

```js
{
  class: 'username-input',
  placeholder: 'Entrez votre nom d'utilisateur'
}
```

Avec `inheritAttrs: false` et `$attrs`, vous pouvez manuellement décider sur quel élément vous souhaitez déposer les attributs passés, ce qui est souvent souhaité dans le cas des [bases de composant](#Base-de-nom-de-composant-fortement-recommande) :

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

Ce modèle vous permet d'utiliser des composants de base comme des éléments HTML standard sans avoir à vous soucier de quel élément est actuellement à sa racine :

```html
<base-input
  v-model="username"
  class="username-input"
  placeholder="Entrez votre nom d'utilisateur"
></base-input>
```
