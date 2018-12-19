---
title: Introduction (EN)
type: cookbook
order: 0
---

## Les tutoriels versus le guide

<p>En quoi les tutoriels sont-ils différents du guide ? Pourquoi est-ce nécessaire ?</p>

* **Plus focalisé** : Dans le guide, nous racontons essentiellement une histoire. Chaque section se construit sur la base des précédentes et présume la connaissance de celles-ci. Dans les tutoriels, chaque tutoriel peut et devrait se suffire à lui-même. Cela signifie que les tutoriels peuvent se focaliser sur un aspect spécifique de Vue, plutôt que d'avoir à donner un aperçu global.

* **Plus de profondeur** : Pour éviter de rendre le guide trop long, nous essayons d'inclure seulement les exemples les plus simples possible pour vous aider à comprendre chaque fonctionnalité. Puis nous passons à autre chose. Dans les tutoriels, nous pouvons inclure des exemples plus complexes, combinant les fonctionnalités de façon intéressante. Chaque tutoriel peut être aussi long et détaillé que besoin, afin de pleinement explorer son sujet.

* **Enseigner JavaScript** : Dans le guide, nous supposons que le lecteur est au moins moyennement familier avec la norme ES5 de JavaScript. Par exemple, nous n'expliquerons pas comment `Array.prototype.filter` fonctionne au sein d'une propriété calculée qui filtre une liste. Dans les tutoriels en revanche, des fonctionnalités essentielles de JavaScript (y-compris ES6/2015+) peuvent être explorées et expliquées pour montrer comment elles nous aident à construire de meilleures applications Vue.

* **Explorer l'écosystème** : Pour les fonctionnalités avancées, nous supposons que le lecteur a quelques connaissances sur l'écosystème. Par exemple, si vous voulez utiliser des composants monofichiers avec webpack, nous n'expliquerons pas comment configurer les parties qui ne concernent pas Vue dans la configuration de webpack. Dans les tutoriels, nous avons l'espace suffisant pour explorer plus en profondeur ces bibliothèques de l'écosystème - au moins dans la mesure où cela est universellement utile aux développeurs Vue.

## Contributions aux tutoriels

### Ce que nous attendons

Les tutoriels apportent aux développeurs des exemples à utiliser pour couvrir des cas d'utilisation courants ou intéressants, et expliquent progressivement des points plus complexes. Notre but est d'aller au-delà d'un simple exemple d'introduction et de mettre en avant des concepts qui sont plus largement utilisables, avec les avertissements et restrictions inhérents à leurs utilisations.

Si vous êtes intéressé par l'idée de contribuer, vous pouvez ouvrir une *issue* sur le github sous le tag **cookbook idea** avec votre idée afin que nous puissions vous guider dans la création d'une *pull request* qui sera acceptée. Après que votre idée ait été validée, merci de suivre le plan ci-dessous autant que possible. Certaines sections sont obligatoires, d'autres sont optionnelles. Suivre l'ordre chronologique est fortement conseillé mais non obligatoire.

Les tutoriels doivent généralement :

> * Résoudre un problème spécifique et commun
> * Commencer avec l'exemple le plus simple possible
> * Introduire une complexité à la fois
> * Comporter des liens vers d'autres sections de la documentation, plutôt que de réexpliquer les concepts
> * Décrire le problème plutôt que de supposer que le lecteur est familier avec
> * Expliquer le processus au-delà du simple résultat final
> * Expliquer le pour et le contre de votre approche, en indiquant dans quels cas elle est appropriée ou non
> * Mentionner des solutions alternatives si c'est pertinent, mais garder les explications en profondeur pour une autre recette.

Nous exigeons que vous suiviez le plan ci-dessous. Cependant nous comprenons que parfois vous ayez besoin de vous en écarter pour conserver une certaine clarté dans vos explications. Malgré tout, chaque exemple doit à un certain moment discuter les raisons de l'utilisation du modèle proposé, de préférence dans la section des modèles alternatifs.

### Exemple de base

_obligatoire_

1.  Exprimer le problème en une à deux phrases.
2.  Expliquer la plus simple solution en une à deux phrases.
3.  Montrer un court extrait de code.
4.  Expliquer ce que cela réalise en une phrase.

### Détails sur le contenu

_obligatoire_

1.  Anticiper les questions que pourrait se poser une personne découvrant l'exemple. (les Blockquotes sont très bien pour ça)
2.  Mettre en avant les erreurs classiques et comment elles peuvent être évitées.
3.  Montrer de courts extraits de code de bon et mauvais patterns.
4.  Argumenter sur le fait que c'est un bon pattern. L'utilisation de liens et références n'est pas obligatoire mais conseillée.

### Cas d'utilisation concret

_obligatoire_

Démontrer que le code répond à un cas d'utilisation commun ou intéressant soit en:

1.  détaillant quelques exemples simples ou
2.  en utilisant un exemple dans codepen/jsfiddle

Si vous choisissez le dernier, vous devrez quand même décrire ce que c'est et
ce que cela fait.

### Contexte additionnel

_optionnel_

Il est toujours utile d'écrire au sujet de ce pattern, quand / où il doit s'appliquer, pourquoi c'est une bonne solution tout en illustrant avec des morceaux de code ou en présentant des sources de lectures additionnelles.

### Quand éviter ce pattern

_optionnel_

Cette section n'est pas obligatoire mais fortement recommandée. Il n'y a pas lieu de l'écrire pour des cas simples comme le changement de classes basées sur un changement d'état, mais pour des patterns plus avancés comme les "mixins", cela s'impose. La réponse pour la plupart des questions sur le développement est ["Cela dépend!"](https://codepen.io/rachsmith/pen/YweZbG), c'est le rôle de cette section. C'est ici que l'on va regarder objectivement quand ce pattern est utile, quand il doit être évité ou tout autre chose plus utile.

### Pattern alternatifs

_obligatoire_

Cette section est requise quand vous avez écrit une section sur la nécessité d'éviter ce pattern dans certains cas. Il est important d'explorer d'autres méthodes pour que les lecteurs ne soient pas laissés dans l'expectative, alors qu'ils ont pu lire que dans certains cas c'est un antipattern. Considérez que les utilisateurs ont différentes bases de code et qu'ils résolvent différents problèmes. Est-ce que l'application est grosse ou petite ? Intègrent-ils Vue dans un projet existant, ou est-ce qu'ils construisent leur application à partir de rien ? Est-ce que leurs utilisateurs essaient de résoudre un problème ou plusieurs ? Y'a-t-il beaucoup de données asynchrones ? Toutes ces considérations vont avoir un impact sur les implémentations alternatives. Une bonne liste de tutoriels fournit aux développeurs ce contexte.

## Merci

Contribuer à de la documentation prend du temps et si vous prenez le temps de soumettre une PR à cette section de notre documentation, vous aurez toute notre gratitude.
