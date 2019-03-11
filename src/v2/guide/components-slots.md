---
title: Slots
type: guide
order: 104
---

> Cette page suppose que vous avez déjà lu les principes de base des [composants](components.html). Lisez-les en premier si les composants sont quelque chose de nouveau pour vous.

> En 2.6.0, nous introduisons une nouvelle syntaxe unifiée (la directive `v-slot`) pour nommé vos slots avec portée. Il remplace les attributs `slot` et `slot-scope` qui sont a présent dépréciés mais _non_ retiré et toujours documenté [ici](#Syntaxe-dépréciée). La raison à l'introduction de la nouvelle syntaxe est décrite dans cette [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md).

## Les contenus de slot

Vue implémente une API de distribution de contenu inspirée du [brouillon de spécification des WebComponents](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) utilisant l'élément `<slot>` comme zone de distribution de contenu.

Cela vous permet de composer vos composants ainsi :

``` html
<navigation-link url="/profile">
  Mon profil
</navigation-link>
```

Dans le template `<navigation-link>`, nous aurons :

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

Lors du cycle de rendu du composant, l'élément `<slot></slot>` est remplacé par « Mon profil ». Les éléments `<slot>` peuvent contenir n'importe quel code de template, incluant le HTML :

``` html
<navigation-link url="/profile">
  <!-- Mon icône -->
  <span class="fa fa-user"></span>
  Mon profil
</navigation-link>
```

Ou encore faire appel à d'autres composants :

``` html
<navigation-link url="/profile">
  <!-- Utilisation d'un composant dédié à l'ajout d'une icône -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Mon profil
</navigation-link>
```

Si `<navigation-link>` ne contient **pas** d'élément `<slot>`, n'importe quel contenu fourni entre la balise d'ouverture et de fermeture sera ignoré.

## Portée de compilation

Quand vous voulez utiliser des données à l'intérieur d'un slot, comme ici :

``` html
<navigation-link url="/profile">
  Se connnecter en tant que {{ user.name }}
</navigation-link>
```

Le slot a accès à la même propriété d'instance (c.-à-d. la même « portée ») que le reste du template. Le slot n'a **pas** accès à la portée de `<navigation-link>`. Par exemple, essayer d'accéder à `url` ne fonctionnera pas :

``` html
<navigation-link url="/profile">
  Cliquer ici vous ammènera à : {{ url }}
  <!--
  Ici `url` sera `undefined` car le contenu est passé
  _à l'intérieur de_ <navigation-link>, au lieu d'être défini _entre_ le composant <navigation-link>.
  -->
</navigation-link>
```

Souvenez vous de cette règle :

> Tout ce qui est dans le template parent est compilé dans la portée parente, tout ce qui est dans le template enfant est compilé dans la portée enfant.

## Contenu par défaut

Il y a des cas où il est utile de spécifier un contenu par défaut pour un slot qui sera rendu uniquement si aucun contenu n'est fourni. Par exemple, dans le composant `<submit-button>` :

```html
<button type="submit">
  <slot></slot>
</button>
```

Nous pourrions vouloir que le texte « Envoyer » soit rendu à l'intérieur de `<button>` la plupart du temps. Pour faire de « Envoyer » le contenu par défaut, nous pouvons le placer à l'intérieur des balises `<slot>` :

```html
<button type="submit">
  <slot>Envoyer</slot>
</button>
```

Maintenant quand nous utilisons `<submit-button>` dans le composant parent, nous ne fournissont aucuno contenu pour le slot :

```html
<submit-button></submit-button>
```

ce qui ferra le rendu du contenu par défaut « Envoyer » :

```html
<button type="submit">
  Envoyer
</button>
```

Cependant, si nous fournissons le contenu :

```html
<submit-button>
  Sauver
</submit-button>
```

Le contenu fourni sera rendu à la place :

```html
<button type="submit">
  Sauver
</button>
```

## Les slots nommés

> Mis à jour dans la 2.6.0+. [Voir ici](#Syntaxe-dépréciée) pour la syntaxe dépréciée en utilisant l'attribut `slot`.

Dans certains cas, il peut être intéressant d'avoir plusieurs éléments `<slot>`. Dans un exemple hypothétique, voici le template d'un composant `<base-layout>` :

``` html
<div class="container">
  <header>
    <!-- Ici le contenu de l'entête -->
  </header>
  <main>
    <!-- Ici le contenu courant -->
  </main>
  <footer>
    <!-- Ici le pied de page -->
  </footer>
</div>
```

Dans le cas suivant, l'élément `<slot>` à un l'attribut spécial `name` , qui peut être utilisé pour désigner des slots additionnels :

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Un `<slot>` sans `name` obtient implicitement le nom "default".

Pour fournir du contenu à des slots nommées, nous pouvons utiliser la directive `v-slot` sur un `<template>`, fournissant le nom du slot en tant qu'argument de `v-slot` :

```html
<base-layout>
  <template v-slot:header>
    <h1>Le titre de ma page</h1>
  </template>

  <p>Un paragraphe pour le slot par défaut.</p>
  <p>Un autre paragraphe.</p>

  <template v-slot:footer>
    <p>Ici les infos de contact</p>
  </template>
</base-layout>
```

Maintenant, tout a l'intérieur des éléments `<template>` sera passé aux slots correspondants. Tout contenu non inclu dans un `<template>` utilisant `v-slot` est considéré comme étant destiné au slot par défaut `default`.

Cependant, vous pouvez toujours entourée le contenu du slot par défaut dans un `<template>` si vous désirez que cela soit plus explicite :

```html
<base-layout>
  <template v-slot:header>
    <h1>Le titre de ma page</h1>
  </template>

  <template v-slot:default>
    <p>Un paragraphe pour le slot par défaut.</p>
    <p>Un autre paragraphe.</p>
  </template>

  <template v-slot:footer>
    <p>Ici les infos de contact</p>
  </template>
</base-layout>
```

Dans tous les cas, le rendu HTML sera :

``` html
<div class="container">
  <header>
    <h1>Le titre de ma page</h1>
  </header>
  <main>
    <p>Un paragraphe pour le slot par défaut.</p>
    <p>Un autre paragraphe.</p>
  </main>
  <footer>
    <p>Ici les infos de contact</p>
  </footer>
</div>
```

Notez que **`v-slot` ne peut seulement être ajouté à un `<template>`** (avec [une exception](#Abbreviated-Syntax-for-Lone-Default-Slots)) contrairement aux [attributs de `slot`](#Syntax-dépréciée) dépréciés.

## Slots avec portée

> Mis à jour dans la 2.6.0+. [Voir ici](#Syntaxe-dépréciée) pour la syntaxe dépréciée en utilisant l'attribut `slot-scope`.

Parfois, il est utile pour les contenus de slot d'avoir accès aux données uniquement disponible dans le composant enfant. Par exemple, imaginez un composant `<current-user>` avec le template suivant :

```html
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```

Nous souhaiterions remplacer le contenu par défaut pour afficher le nom de famille de l'utilisateur à la place de son prénon comme ceci :

``` html
<current-user>
  {{ user.firstName }}
</current-user>
```

Ce qui ne fonctionnera pas puisque le composant `<current-user>` n'a pas accès à `user` ni au contenu que nous avons fourni lors du rendu du parent.

Pour rendre `user` disponible dans le contenu du slot dans le parent, nous pouvons lié `user` comme un attribu de l'élément `<slot>` :

``` html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

Les attribus liés à l'élément `<slot>` sont appelé des **props de slot**. Maintenant, dans la portée parente, nous pouvons utiliser `v-slot` avec une valeur pour définir un nom pour les props de slot que nous avons fourni :

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

Dans cet exemple, nous avons choisi de nommer l'objet contenant tous nos props de slot `slotProps` mais vous pouvez choisir n'importe quel nom que vous voulez.

### Syntaxe abrégée pour les slots par défault uniques

Dans les cas comme au dessus, quand _uniquement_ le slot par défaut a un contenu fourni, la balise du composant peut utiliser le template de slot. Cela nous permet d'utiliser `v-slot` directement sur le composant :

``` html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Cela peut même être raccourci encore plus. Comme un contenu non spécifié est considéré comme étant destiné au slot par défaut, `v-slot` sans un argument est considéré comme faisant référence au slot par défaut :

``` html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Notez que la syntaxe abrégée pour le slot par défaut **ne** peut **pas** être mélangé avec les slots nommées, ce qui mênerait à une ambiguité de portée :

``` html
<!-- INVALIDE, résultera en un avertissement -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    `slotProps` n'est PAS disponible ici
  </template>
</current-user>
```

À chaque fois qu'il y a de multiples slots, utilisez la syntaxe complète pour le `<template>` pour _tous_ les slots :

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

### Décomposition de props de slot

En interne, les slots avec portée fonctionne en entourant votre contenu de slot dans une fonction avec un seul argument :

```js
function (slotProps) {
  // ... contenu du slot ...
}
```

Cela signifie que la valeur de `v-slot` peut accepté n'importe quel expression JavaScript valide pouvant apparaitre à la position d'un argument lors de la défénition d'une fonction. Également, pour les environnements qui le supportent ([composants monofichier](single-file-components.html) ou les [navigateurs modernes](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs)), vous pouvez utiliser la [décomposition ES2015](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition#Object_destructuring) pour définir une collection de props de slot comme suit :

``` html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

Cela rend les template vraiment propre, spécialement quand un slot fournit divers props. Cela agrandit les possibilités, comme le rennomage de props, par ex. `user` to `person`:

``` html
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
```

Vous pouvez même définir des valeurs par défaut à utiliser dans le cas ou les prop de slot sont `undefined` :

``` html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

## Noms de slot dynamique

> Nouveau dans la 2.6.0+

[Dynamic directive arguments](syntax.html#Dynamic-Arguments) also work on `v-slot`, allowing the definition of dynamic slot names:

``` html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## Named Slots Shorthand

> New in 2.6.0+

Similar to `v-on` and `v-bind`, `v-slot` also has a shorthand, replacing everything before the argument (`v-slot:`) with the special symbol `#`. For example, `v-slot:header` can be rewritten as `#header`:

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

However, just as with other directives, the shorthand is only available when an argument is provided. That means the following syntax is invalid:

``` html
<!-- This will trigger a warning -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
```

Instead, you must always specify the name of the slot if you wish to use the shorthand:

``` html
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
```

## Other Examples

**Slot props allow us to turn slots into reusable templates that can render different content based on input props.** This is most useful when you are designing a reusable component that encapsulates data logic while allowing the consuming parent component to customize part of its layout.

For example, we are implementing a `<todo-list>` component that contains the layout and filtering logic for a list:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

Instead of hard-coding the content for each todo, we can let the parent component take control by making every todo a slot, then binding `todo` as a slot prop:

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    We have a slot for each todo, passing it the
    `todo` object as a slot prop.
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- Fallback content -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

Now when we use the `<todo-list>` component, we can optionally define an alternative `<template>` for todo items, but with access to data from the child:

```html
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

However, even this barely scratches the surface of what scoped slots are capable of. For real-life, powerful examples of scoped slot usage, we recommend browsing libraries such as [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller), [Vue Promised](https://github.com/posva/vue-promised), and [Portal Vue](https://github.com/LinusBorg/portal-vue).

## Deprecated Syntax

> The `v-slot` directive was introduced in Vue 2.6.0, offering an improved, alternative API to the still-supported `slot` and `slot-scope` attributes. The full rationale for introducing `v-slot` is described in this [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md). The `slot` and `slot-scope` attributes will continue to be supported in all future 2.x releases, but are officially deprecated and will eventually be removed in Vue 3.

### Named Slots with the `slot` Attribute

> <abbr title="Still supported in all 2.x versions of Vue, but no longer recommended.">Deprecated</abbr> in 2.6.0+. See [here](#Named-Slots) for the new, recommended syntax.

To pass content to named slots from the parent, use the special `slot` attribute on `<template>` (using the `<base-layout>` component described [here](#Named-Slots) as example):

```html
<base-layout>
  <template slot="header">
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template slot="footer">
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

Or, the `slot` attribute can also be used directly on a normal element:

``` html
<base-layout>
  <h1 slot="header">Here might be a page title</h1>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</base-layout>
```

There can still be one unnamed slot, which is the **default slot** that serves as a catch-all for any unmatched content. In both examples above, the rendered HTML would be:

``` html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

### Scoped Slots with the `slot-scope` Attribute

> <abbr title="Still supported in all 2.x versions of Vue, but no longer recommended.">Deprecated</abbr> in 2.6.0+. See [here](#Scoped-Slots) for the new, recommended syntax.

To receive props passed to a slot, the parent component can use `<template>` with the `slot-scope` attribute (using the `<slot-example>` described [here](#Scoped-Slots) as example):

``` html
<slot-example>
  <template slot="default" slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

Here, `slot-scope` declares the received props object as the `slotProps` variable, and makes it available inside the `<template>` scope. You can name `slotProps` anything you like similar to naming function arguments in JavaScript.

Here `slot="default"` can be omitted as it is implied:

``` html
<slot-example>
  <template slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

The `slot-scope` attribute can also be used directly on a non-`<template>` element (including components):

``` html
<slot-example>
  <span slot-scope="slotProps">
    {{ slotProps.msg }}
  </span>
</slot-example>
```

The value of `slot-scope` can accept any valid JavaScript expression that can appear in the argument position of a function definition. This means in supported environments ([single-file components](single-file-components.html) or [modern browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Browser_compatibility)) you can also use [ES2015 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) in the expression, like so:

``` html
<slot-example>
  <span slot-scope="{ msg }">
    {{ msg }}
  </span>
</slot-example>
```

Using the `<todo-list>` described [here](#Other-Examples) as an example, here's the equivalent usage using `slot-scope`:

``` html
<todo-list v-bind:todos="todos">
  <template slot="todo" slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```
