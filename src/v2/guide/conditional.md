---
title: Rendu conditionnel
type: guide
order: 7
---

## `v-if`

La directive `v-if` est utilisée pour conditionnellement faire le rendu d'un bloc. Le rendu du bloc sera effectué uniquement si l'expression de la directive retourne une valeur évaluée à vrai.

``` html
<h1 v-if="awesome">Vue est extraordinaire !</h1>
```

Il est également possible d’ajouter une structure « sinon » avec `v-else` :

``` html
<h1 v-if="awesome">Vue est extraordinaire !</h1>
<h1 v-else>Oh non 😢</h1>
```

### Groupes conditionnels avec `v-if` dans un `<template>`

Comme `v-if` est une directive, elle doit être attachée à un seul élément. Mais comment faire si nous voulons permuter plusieurs éléments ? Dans ce cas, nous pouvons utiliser `v-if` sur un élément `<template>`, qui sert d'enveloppe invisible. Le résultat final rendu n’inclura pas l’élément `<template>`.

``` html
<template v-if="ok">
  <h1>Titre</h1>
  <p>Paragraphe 1</p>
  <p>Paragraphe 2</p>
</template>
```

### `v-else`

Vous pouvez utiliser la directive `v-else` pour indiquer une « structure sinon » pour `v-if` :

``` html
<div v-if="Math.random() > 0.5">
  Maintenant vous me voyez
</div>
<div v-else>
  Maintenant vous ne me voyez pas
</div>
```

Un élément `v-else` doit immédiatement suivre un élément `v-if` ou un élément `v-else-if` (sinon il ne sera pas reconnu).

### `v-else-if`

> Nouveau dans la 2.1.0+

Le `v-else-if`, comme le nom le suggère, sert comme une « structure sinon si » pour `v-if`. Il peut également être enchainé plusieurs fois :

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
  Ni A, ni B et ni C
</div>
```

Semblable à `v-else`, un élément `v-else-if` doit immédiatement suivre un élément `v-if` ou un élément `v-else-if`.

### Contrôle des éléments réutilisables avec `key`

Vue tente de restituer les éléments aussi efficacement que possible, en les réutilisant souvent au lieu de faire de la restitution à partir de zéro. En plus de permettre à Vue d'être très rapide, cela peut avoir quelques avantages utiles. Par exemple, si vous autorisez les utilisateurs à choisir entre plusieurs types de connexion :

``` html
<template v-if="loginType === 'username'">
  <label>Nom d'utilisateur</label>
  <input placeholder="Entrez votre nom d'utilisateur">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Entrez votre adresse email">
</template>
```

Le fait de changer de `loginType` dans le code ci-dessus n'effacera pas ce que l'utilisateur a déjà saisi. Puisque les deux templates utilisent les mêmes éléments, le `<input>` n'est pas remplacé (juste son `placeholder`).

Vérifiez-le par vous-même en entrant un texte dans la zone de saisie, puis en appuyant sur le bouton de permutation :

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Nom d'utilisateur</label>
      <input placeholder="Entrez votre nom d'utilisateur">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Entrez votre adresse email">
    </template>
  </div>
  <button @click="toggleLoginType">Changer de type de connexion</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Ce n'est pas toujours souhaitable cependant, c'est pourquoi Vue vous offre un moyen de dire, « Ces deux éléments sont complètement distincts, ne les réutilise pas ». Ajoutez juste un attribut `key` avec des valeurs uniques :

``` html
<template v-if="loginType === 'username'">
  <label>Nom d'utilisateur</label>
  <input placeholder="Entrez votre nom d'utilisateur" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Entrez votre adresse email" key="email-input">
</template>
```

Maintenant ces zones de saisie seront restituées à partir de zéro à chaque fois que vous permuterez. Voyez par vous-même :

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Nom d'utilisateur</label>
      <input placeholder="Entrez votre nom d'utilisateur" key="username-input">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Entrez votre adresse email" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Changer de type de connexion</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Remarquez que les éléments `<label>` sont réutilisés efficacement, car ils n'ont pas d'attributs `key`.

## `v-show`

Une autre option pour afficher conditionnellement un élément est la directive `v-show`. L'utilisation est en grande partie la même :

``` html
<h1 v-show="ok">Bonjour !</h1>
```

La différence est qu'un élément avec `v-show` sera toujours restitué et restera dans le DOM ; `v-show` permute simplement la propriété CSS `display` de l'élément.

<p class="tip">Notez que `v-show` ne prend pas en charge la syntaxe de l'élément `<template>` et ne fonctionne pas avec `v-else`.</p>

## `v-if` vs `v-show`

`v-if` est un « vrai » rendu conditionnel car il garantit que les écouteurs d'évènements et les composants enfants à l'intérieur de la structure conditionnelle sont correctement détruits et recréés lors des permutations.

`v-if` est également **paresseux** : si la condition est fausse sur le rendu initial, il ne fera rien (la structure conditionnelle sera rendue quand la condition sera vraie pour la première fois).

En comparaison, `v-show` est beaucoup plus simple. L'élément est toujours rendu indépendamment de la condition initiale, avec juste une simple permutation basée sur du CSS.

D'une manière générale, `v-if` a des couts à la permutation plus élevés alors que `v-show` a des couts au rendu initial plus élevés. Donc préférez `v-show` si vous avez besoin de permuter quelque chose très souvent et préférez `v-if` si la condition ne change probablement pas à l'exécution.

## `v-if` avec `v-for`

<p class="tip">Utiliser `v-if` et `v-for` ensemble n'est **pas recommandé**. Consultez le [guide des conventions](/v2/style-guide/#Eviter-v-if-avec-v-for-essentiel) pour plus d'informations.</p>

Lorsqu'il est conjointement utilisé avec `v-for`, `v-for` a une priorité plus élevée que `v-if`. Consultez le <a href="../guide/list.html#v-for-avec-v-if">guide du rendu de liste</a> pour plus de détails.
