---
title: Les composants monofichier
type: guide
order: 19
---

## Introduction

<p class="tip">**Cette page est en cours de traduction française. Revenez une autre fois pour lire une traduction achevée ou [participez à la traduction française ici](https://github.com/vuejs-fr/vuejs.org).**</p>In many Vue projects, global components will be defined using `Vue.component`, followed by `new Vue({ el: '#container' })` to target a container element in the body of every page.


Cela pourra très bien fonctionner pour des petits projets ou des projets de taille moyenne, pour lesquels Javascript est utilisé uniquement pour améliorer certains templates. Cependant, pour des projets plus complexes, ou bien quand votre front-end est entièrement généré par Javascript, des inconvénients vont se manifester :

- **Les définitions globales** force à avoir un nom unique pour chacun des composants
- **Les templates sous forme de chaîne de caractère** ne bénéficie pas de la coloration syntaxique du html et requiert l'usage de slashes pour le multilignes.
- **Le css non supporté** ne vous permet pas d'injecter du css dans vos composants, seulement du Javascript et du html
- **L'absence d'étape de build** ne nous permet pas d'utiliser des preprocesseurs tels que Babel ou Pug (précédemment Jade).


Tous ces désavantages sont résolus par les composants monofichier avec une extension `.vue`, dont l'existence est rendue possible grâce aux outils de build tels que Webpack ou Browserify.

Voici un exemple simple de fichier que nous appelerons `Hello.vue` :

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

Maintenant nous avons :

- [Une coloration syntaxique complète](https://github.com/vuejs/awesome-vue#syntax-highlighting)
- [Des modules CommonJS](https://webpack.github.io/docs/commonjs.html)
- [Du css avec portée limitée au composant](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

Et comme promis, nous pouvons maintenant utiliser des preprocesseurs tels que Jade, Babel (avec les modules ES2015), et Stylus pour obtenir des composants plus lisibles et avec plus de fonctionnalités.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

Ces languages spécifiques ne sont que des exemples; vous pourriez tout aussi aisément utiliser Bublé, Typescript, SCSS, PostCSS - tout tout autre preprocesseur qui vous rend plus productif. Du fait de l'utilisation de Webpack avec le loader `vue-loader`, vous obtenez en même temps un outil de premier choix pour les modules CSS.

### Qu'en est-il de la séparation des responsabilités ?

Une chose importante à souligner est que **la séparation des responsabilités n'est pas la séparation des fichiers**. Dans le développement des interfaces utilisateurs modernes, nous avons constaté que plutôt que de diviser tout notre code en trois grosses couches distinctes, il était plus intuitif de le diviser en petits composants découplés, puis de composer l'interface utilisateur en les combinant. Au sein d'un même composant, son template, sa logique et ses styles sont interdépendants, et les regrouper rend le composant plus cohérent et facile à maintenir.

Si toutefois vous n'aimez vraiment pas l'idée des composants monofichier, vous pouvez toujours mettre à profit le hot-reloading et la pre-compilation pour mettre le css et le javascript dans des fichiers séparés.


``` html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Bien commencer

### Pour les utilisateurs qui ne connaissent les systemes de modules en Javascript

Avec les composants `.vue`, we're entering the realm of advanced JavaScript applications. That means learning to use a few additional tools if you haven't already:
Avec les composants `.vue`, nous entrons de plein-pied dans les domaines des applications javascripts avancées. Cela implique d'apprendre à utiliser quelques nouveaux outils si vous ne les connaissez pas déjà :

- **Node Package Manager (NPM)**: Lisez le [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) through section _10: Uninstalling global packages_.

- **Modern JavaScript with ES2015/16**: Lisez le guide Babel [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). Vous n'avez pas besoin de mémoriser chacune des fonctionnalités, mais gardez cette page pour pouvoir y revenir quand vous en aurez besoin.

Une fois que vous aurez pris une journée pour vous familiariser avec ces ressources, nous vous recommandons d'essayer le template de projet [webpack-simple](https://github.com/vuejs-templates/webpack-simple). Suivez les instructions et vous devriez avoir en un clin d'oeil un projet Vue avec des composants `.vue` , ES2015 et du hot-reloading.

Ce template de projet utilise [Webpack](https://webpack.github.io/), un packager qui rassemble vos différents "modules" pour créer votre fichier d'application final. Pour en apprendre plus sur Webpack, [cette vidéo](https://www.youtube.com/watch?v=WQue1AN93YU) est une bonne introduction. Une fois que vous aurez les bases, vous pourrez aussi parcourir [ce cours sur Egghead.io](https://egghead.io/courses/using-webpack-for-production-javascript-applications).

Dans Webpack, chaque module peut être transformé par un "loader" avant d'être inclus dans le bundle, et Vue propose le plugin [vue-loader](https://github.com/vuejs/vue-loader) pour traduire les composants monofichier `.vue`. Le template de projet [webpack-simple](https://github.com/vuejs-templates/webpack-simple) configure tout pour vous, mais si vous souhaitez en apprendre sur le fonctionnement des composants `.vue` avec Webpack, vous pouvez lire [la documentation pour vue-loader](https://vue-loader.vuejs.org).

### Pour les utilisateur avancés

Que vous préfériez Webpack ou Browserify, nous avons des templates pour les projets simples comme pour les projets complexes. Nous vous invitons à explorer [github.com/vuejs-templates](https://github.com/vuejs-templates), choisir un template qui vous convient et suivre les instructions du README pour générer un nouveau projet avec [vue-cli](https://github.com/vuejs/vue-cli).

