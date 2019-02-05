---
title: Composants monofichiers
type: guide
order: 401
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

<a href="https://gist.github.com/chrisvfritz/e2b6a6110e0829d78fa4aedf7cf6b235" target="_blank" rel="noopener noreferrer"><img src="/images/vue-component.png" alt="Exemple d'un composant pour un seul fichier (cliquez pour voir le code sous forme de texte)" style="display: block; margin: 30px auto;"></a>

Maintenant nous avons :

- [Une coloration syntaxique complète](https://github.com/vuejs/awesome-vue#source-code-editing)
- [Des modules CommonJS](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [Du CSS dont la portée est limitée au composant](https://vue-loader.vuejs.org/en/features/scoped-css.html)

Et comme promis, nous pouvons aussi utiliser des préprocesseurs tels que Pug, Babel (avec les modules ES2015), et Stylus pour obtenir des composants plus lisibles et plus riches en fonctionnalités.

<a href="https://gist.github.com/chrisvfritz/1c9f2daea9bc078dcb47e9a82e5f7587" target="_blank" rel="noopener noreferrer"><img src="/images/vue-component-with-preprocessors.png" alt="Exemple d'un composant pour un seul fichier avec des préprocesseurs (cliquez pour voir le code sous forme de texte)" style="display: block; margin: 30px auto;"></a>

Ces langages spécifiques ne sont que des exemples; vous pourriez tout aussi aisément utiliser Bublé, Typescript, SCSS, PostCSS - ou tout autre préprocesseur qui vous aide à être productif. Si vous utilisez webpack avec `vue-loader`, vous aurez aussi un outil de premier choix pour les modules CSS.

### Qu'en est-il de la séparation des préoccupations ?

Une chose importante à souligner est que **la séparation des préoccupations (« Separation of concerns ») n'est pas identique à la séparation des fichiers**. Dans le développement des interfaces utilisateur modernes, nous avons constaté que plutôt que de diviser tout notre code en trois grosses couches distinctes interdépendantes, il était plus intuitif de le diviser en petits composants faiblement couplés, et de les combiner. Au sein d'un composant, son template, sa logique et ses styles sont intrinsèquement couplés, et les réunir rend en réalité le composant plus cohérent et facile à maintenir.

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

### Exemple bac à sable

Si vous voulez dès maintenant commencer à jouer avec des composants monofichiers, consultez [cette simple application de liste de tâches](https://codesandbox.io/s/o29j95wx9) sur CodeSandbox.

### Pour les utilisateurs qui ne connaissent pas les systèmes de *build* de modules en JavaScript

Avec les composants `.vue`, nous entrons de plain-pied dans le domaine des applications JavaScript avancées. Cela implique d'apprendre à utiliser quelques nouveaux outils si vous ne les connaissez pas déjà :

- **Node Package Manager (npm)**: lisez le guide npm [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) section _10: Uninstalling global packages_.

- **JavaScript moderne avec ES2015/16**: lisez le guide Babel [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). Vous n'avez pas besoin de mémoriser chacune des fonctionnalités maintenant, mais gardez cette page en référence pour pouvoir y revenir.

Une fois que vous aurez pris une journée pour vous plonger dans ces ressources, nous vous recommandons d'essayer [Vue CLI 3](https://cli.vuejs.org/). Suivez les instructions et vous devriez avoir en un clin d’œil un projet Vue avec des composants `.vue` , ES2015 et le rechargement à chaud !

### Pour les utilisateurs avancés

La CLI prend soin de la configuration de la plupard des outils pour vous, mais vous permet tout de même une optimisation granulaire avec vos propres [options de configuration](https://cli.vuejs.org/config/).

Dans le cas ou vous preferiez créer votre installation depuis le dépard, vous pourrez configurer manuellement webpack avec [vue-loader](https://vue-loader.vuejs.org). Pour en apprendre plus à propos de webpack en lui même, consultez la [documentation officielle](https://webpack.js.org/configuration/) et la [Webpack Academy](https://webpack.academy/p/the-core-concepts).
