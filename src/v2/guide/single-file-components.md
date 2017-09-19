---
title: Composants monofichiers
type: guide
order: 402
---

## Introduction

Dans beaucoup de projets Vue, des composants globaux seront définis en utilisant `Vue.component`, suivi de `new Vue({ el: '#container' })` pour cibler un élément conteneur dans le corps de chaque page.

Cela peut très bien fonctionner pour des petits projets ou des projets de taille moyenne, pour lesquels JavaScript est utilisé uniquement pour améliorer certaines vues. Cependant, pour des projets plus complexes, ou bien quand votre front-end est entièrement généré par JavaScript, des désavantages se manifestent :

- **Les définitions globales** forcent à avoir un nom unique pour chaque composant
- **Les templates sous forme de chaines de caractères** ne bénéficient pas de la coloration syntaxique et requièrent l'usage de slashes disgracieux pour le HTML multiligne.
- **L'absence de support pour le CSS** signifie que le CSS ne peut pas être modularisé comme HTML et JavaScript
- **L'absence d'étape de build** nous restreint au HTML et à JavaScript ES5, sans pouvoir utiliser des préprocesseurs tels que Babel ou Pug (anciennement Jade).

Tous ces désavantages sont résolus par les **composants monofichiers** avec une extension `.vue`, rendus possibles par les outils de *build* tels que webpack ou Browserify.

Voici un exemple simple de fichier que nous appellerons `Hello.vue` :

<img src="/images/vue-component.png" style="display: block; margin: 30px auto;">

Maintenant nous avons :

- [Une coloration syntaxique complète](https://github.com/vuejs/awesome-vue#source-code-editing)
- [Des modules CommonJS](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [Du CSS à la portée limitée au composant](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

Et comme promis, nous pouvons aussi utiliser des préprocesseurs tels que Pug, Babel (avec les modules ES2015), et Stylus pour obtenir des composants plus lisibles et plus riches en fonctionnalités.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto;">

Ces langages spécifiques ne sont que des exemples; vous pourriez tout aussi aisément utiliser Bublé, Typescript, SCSS, PostCSS - ou tout autre préprocesseur qui vous aide à être productif. Si vous utilisez webpack avec `vue-loader`, vous aurez aussi un outil de premier choix pour les modules CSS.

### Qu'en est-il de la séparation des préoccupations (Separation of concerns) ?

Une chose importante à souligner est que **la séparation des préoccupations n'est pas identique à la séparation des fichiers**. Dans le développement des interfaces utilisateur modernes, nous avons constaté que plutôt que de diviser tout notre code en trois grosses couches distinctes interdépendantes, il était plus intuitif de le diviser en petits composants faiblement couplés, et de les combiner. Au sein d'un composant, son template, sa logique et ses styles sont intrinsèquement couplés, et les réunir rend en réalité le composant plus cohérent et facile à maintenir.

Si vous n'aimez pas l'idée des composants monofichiers, vous pouvez toujours tirer parti du rechargement à chaud et la précompilation pour mettre le CSS et le JavaScript dans des fichiers séparés.

``` html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Bien commencer

### Pour les utilisateurs qui ne connaissent pas les systèmes de *build* de modules en JavaScript

Avec les composants `.vue`, nous entrons de plain-pied dans le domaine des applications JavaScript avancées. Cela implique d'apprendre à utiliser quelques nouveaux outils si vous ne les connaissez pas déjà :

- **Node Package Manager (npm)**: lisez le guide npm [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) section _10: Uninstalling global packages_.

- **JavaScript moderne avec ES2015/16**: lisez le guide Babel [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). Vous n'avez pas besoin de mémoriser chacune des fonctionnalités maintenant, mais gardez cette page en référence pour pouvoir y revenir.

Une fois que vous aurez pris une journée pour vous plonger dans ces ressources, nous vous recommandons d'essayer le template de projet [webpack-simple](https://github.com/vuejs-templates/webpack-simple). Suivez les instructions et vous devriez avoir en un clin d’œil un projet Vue avec des composants `.vue` , ES2015 et le rechargement à chaud !

Ce template de projet utilise [webpack](https://webpack.js.org/), un empaqueteur de modules qui prend des « modules » et les empaquète dans votre application finale. Pour en apprendre plus sur webpack, consultez [la documentation officielle](https://webpack.js.org/configuration/) et la [Webpack Academy](https://webpack.academy/p/the-core-concepts).

Dans webpack, chaque module peut être transformé par un « loader » avant d'être inclus dans le paquetage, et Vue offre le plugin [vue-loader](https://github.com/vuejs/vue-loader) pour traduire les composants monofichiers `.vue`. Le template de projet [webpack-simple](https://github.com/vuejs-templates/webpack-simple) a déjà tout configuré pour vous, mais si vous souhaitez en apprendre plus sur le fonctionnement des composants `.vue` avec webpack, vous pouvez lire [la documentation de vue-loader](https://vue-loader.vuejs.org).

### Pour les utilisateurs avancés

Que vous préfériez webpack ou Browserify, nous avons des templates documentés à la fois pour les projets simples et les projets plus complexes. Nous vous recommandons d'explorer [github.com/vuejs-templates](https://github.com/vuejs-templates), de choisir un template qui vous convient et de suivre les instructions du README pour générer un nouveau projet avec [vue-cli](https://github.com/vuejs/vue-cli).
