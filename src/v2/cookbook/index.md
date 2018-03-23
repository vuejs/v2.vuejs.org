---
title: Introduction
type: cookbook
order: 0
---

## Les tutoriels versus le guide

<p>Cette page est en cours de traduction. Pour nous aider, vous pouvez participer sur <a href="https://github.com/vuejs-fr/vuejs.org" target="_blank">le dépôt GitHub dédié de Vuejs-FR</a>.</p><p>En quoi les tutoriels sont-ils différent du guide ? Pourquoi est-ce nécessaire ?</p>

* **Plus focalisé** : Dans le guide, nous racontons essentiellement une histoire. Chaque section se construit sur la base des précédentes et présume la connaissance de celles-ci. Dans les tutoriels, chaque tutoriel peut et devrait se suffire à lui-même. Cela signifie que les tutoriels peuvent se focaliser sur un aspect spécifique de Vue, plutôt que d'avoir à donner un aperçu global.

* **Plus de profondeur** : Pour éviter de rendre le guide trop long, nous essayons d'inclure seulement les exemples les plus simples possible pour vous aider à comprendre chaque fonctionnalité. Puis nous passons à autre chose. Dans les tutoriels, nous pouvons inclure des exemples plus complexes, combinant les fonctionnalités de façon intéressante. Chaque tutoriel peut être aussi long et détaillé que besoin, afin de pleinement explorer son sujet.

* **Enseigner JavaScript** : Dans le guide, nous supposons que le lecteur est au moins moyennement familier avec la norme ES5 de JavaScript. Par exemple, nous n'expliquerons pas comment `Array.prototype.filter` fonctionne au sein d'une propriété calculée qui filtre une liste. Dans les tutoriels en revanche, des fonctionnalités essentielles de JavaScript (y-compris ES6/2015+) peuvent être explorées et expliquées pour montrer comment elles nous aident à construire de meilleures applications Vue.

* **Explorer l'écosystème** : Pour les fonctionnalités avancées, nous supposons que le lecteur a quelques connaissances sur l'écosystème. Par exemple, si vous voulez utiliser des composants monofichiers avec webpack, nous n'expliquerons pas comment configurer les parties qui ne concernent pas Vue dans la configuration de webpack. Dans les tutoriels, nous avons l'espace suffisant pour explorer plus en profondeur ces bibliothèques de l'écosystème - au moins dans la mesure où cela est universellement utile aux développeurs Vue.

## Contributions au tutoriels

### What we're looking for

The Cookbook gives developers examples to work off of that both cover common or interesting use cases, and also progressively explain more complex detail. Our goal is to move beyond a simple introductory example, and demonstrate concepts that are more widely applicable, as well as some caveats to the approach.

If you're interested in contributing, please initiate collaboration by filing an issue under the tag **cookbook idea** with your concept so that we can help guide you to a successful pull request. After your idea has been approved, please follow the template below as much as possible. Some sections are required, and some are optional. Following the numerical order is strongly suggested, but not required.

Les tutoriels doivent généralement :

> * Résoudre un problème spécifique et commun
> * Commencer avec l'exemple le plus simple possible
> * Introduire une complexité à la fois
> * Comporter des liens vers d'autres sections de la documentation, plutôt que de réexpliquer les concepts
> * Décrire le problème plutôt que de supposer que le lecteur est familier avec
> * Expliquer le processus au-delà du simple résultat final
> * Expliquer le pour et le contre de votre approche, en indiquant dans quels cas elle est appropriée ou non
> * Mentionner des solutions alternatives si c'est pertinent, mais garder les explications en profondeur pour une autre recette.

We request that you follow the template below. We understand, however, that there are times when you may necessarily need to deviate for clarity or flow. Either way, all recipes should at some point discuss the nuance of the choice made using this pattern, preferably in the form of the alternative patterns section.

### Base Example

_required_

1.  Articulate the problem in a sentence or two.
2.  Explain the simplest possible solution in a sentence or two.
3.  Show a small code sample.
4.  Explain what this accomplishes in a sentence.

### Details about the Value

_required_

1.  Address common questions that one might have while looking at the example. (Blockquotes are great for this)
2.  Show examples of common missteps and how they can be avoided.
3.  Show very simple code samples of good and bad patterns.
4.  Discuss why this may be a compelling pattern. Links for reference are not required but encouraged.

### Real-World Example

_required_

Demonstrate the code that would power a common or interesting use case, either by:

1.  Walking through a few terse examples of setup, or
2.  Embedding a codepen/jsfiddle example

If you choose to do the latter, you should still talk through what it is and does.

### Additional Context

_optional_

It's extremely helpful to write a bit about this pattern, where else it would apply, why it works well, and run through a bit of code as you do so or give people further reading materials here.

### When To Avoid This Pattern

_optional_

This section is not required, but heavily recommended. It won't make sense to write it for something very simple such as toggling classes based on state change, but for more advanced patterns like mixins it's vital. The answer to most questions about development is ["It depends!"](https://codepen.io/rachsmith/pen/YweZbG), this section embraces that. Here, we'll take an honest look at when the pattern is useful and when it should be avoided, or when something else makes more sense.

### Alternative Patterns

_required_

This section is required when you've provided the section above about avoidance. It's important to explore other methods so that people told that something is an antipattern in certain situations are not left wondering. In doing so, consider that the web is a big tent and that many people have different codebase structures and are solving different goals. Is the app large or small? Are they integrating Vue into an existing project, or are they building from scratch? Are their users only trying to achieve one goal or many? Is there a lot of asynchronous data? All of these concerns will impact alternative implementations. A good cookbook recipe gives developers this context.

## Thank you

It takes time to contribute to documentation, and if you spend the time to submit a PR to this section of our docs, you do so with our gratitude.
