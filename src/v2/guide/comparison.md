---
title: Comparaison avec les autres Frameworks
type: guide
order: 29
---

C'est définitivement la page du guide la plus difficile à écrire, mais nous avons le sentiment que c'est important. Fortes sont les chances pour que vous ayez des problèmes à résoudre et que vous utilisiez une autre bibliothèque pour les résoudres. Vous êtes ici parce que vous voulez savoir si Vue peut encore mieux résoudre vos problèmes spécifiques. C'est la réponse que nous espérons pouvoir vous apporter.

Nous voudrions également essayer d'être objectif. En tant que mainteneurs, nous aimons énormément Vue. Il y a certains problèmes que nous pensons pouvoir être résolu avec Vue. Si nous n'y croyions pas, nous ne travaillerions pas dessus. Cependant nous voulons être juste et précis. Les autres bibliothèques offrent des avantages significatifs, comme React et son vaste écosystème de rendu alternatif ou le support de Knockout des navigateurs jusqu'à IE6 ; nous allons essayer de prendre en compte cela correctement.

Nous apprécierions également **votre** aide pour garder ce document à jour car le monde de JavaScript bouge rapidement ! Si vous remarquez une imprécision ou quelque chose qui ne semble pas tout à fait être juste, faites-le nous savoir en [ouvrant un ticket](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React et Vue ont beaucoup en commun. Tous les deux :

- utilisent un DOM virtuel,
- fournissent des composants de vue réactifs et composables,
- restent concentrés sur le cœur de la bibliothèque, en déléguant le routage et la gestion d'état à des bibliothèques connexes.

Ayant un champ d'action similaire, nous avons passé plus de temps à affiner cette comparaison que les autres. Nous voulons être sûrs non seulement de nos précisions techniques, mais aussi de leur neutralité. Nous soulignons là où React brille par rapport à Vue, par exemple dans la richesse de son écosystème et l'abondance de ses moteurs de rendu personnalisés.

Ceci étant dit, il est inévitable que la comparaison puisse paraître biaisée envers Vue pour certains utilisateurs de React, puisque beaucoup des sujets explorés sont subjectifs dans une certaine mesure. Nous reconnaissons l'existence de préférences techniques différentes, et cette comparaison va avoir pour principal but de décrire pourquoi vous pourriez potentiellement préférer Vue s'il s'avère que vos préférences coïncident avec les nôtres.

La communauté React [a été sollicitée](https://github.com/vuejs/vuejs.org/issues/364) pour nous aider à atteindre cette neutralité, avec des remerciements en particulier à Dan Abramov de l'équipe React. Il a été extrêmement généreux en accordant son temps et son expertise pour nous aider à remanier ce document jusqu'à ce que le résultat final [convienne](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740) aux deux parties.

### Profils de performance

Dans tous les scénarios en situation réelle que nous avons testés à ce jour, Vue surpasse React avec une bonne marge. Si vos sourcils viennent tout juste de se relever, lisez plus loin. Nous allons décortiquer pourquoi (et même inclure un benchmark développé en collaboration avec l'équipe de React).

#### Performance de rendu

Quand on fait le rendu d'une UI, la manipulation du DOM est en général l'opération la plus coûteuse et malheureusement, aucune bibliothèque ne peut rendre ces opérations plus rapides. Le mieux que nous puissions faire est :

1. Minimiser le nombre de changements nécessaires dans le DOM. React et Vue utilisent tous les deux un DOM virtuel pour accomplir cela et les deux implémentations fonctionnent aussi bien l'une que l'autre.

2. Ajouter une surcharge minimale (en purs calculs JavaScript) par-dessus ces manipulations du DOM. C'est là que Vue et React sont différents.

La surcharge JavaScript est directement reliée aux mécanismes calculant les opérations nécessaires sur le DOM. Vue et React utilisent un DOM Virtuel pour y parvenir, mais l'implémentation du DOM Virtuel par Vue (un fork de [snabbdom](https://github.com/snabbdom/snabbdom)) est bien plus légère et par conséquent introduit moins de surcharge que celle de React.

Vue comme React offrent également des composants fonctionnels, qui sont sans état et sans instanciation — et donc, requièrent moins de ressources. Quand ils sont utilisés dans des situations où la performance est critique, Vue est là encore plus rapide. Pour le démontrer, nous avons créé un simple [projet de benchmark](https://github.com/chrisvfritz/vue-render-performance-comparisons) qui fait le rendu de 10000 éléments de liste 100 fois. Nous vous encourageons à l'essayer vous-même, sachant que les résultats varient en fonction de la machine et du navigateur utilisé — et en réalité, ils varient même entre chaque exécution du fait de la nature des moteurs JavaScript.

Si vous n'en avez pas le courage, voici ci-dessous les résultats d'une des exécutions avec Chrome 52 sur un MacBook Air 2014. Pour éviter des résultats triés sur le volet, les deux benchmarks ont été exécutés à 20 reprises séparément, et nous affichons ci-dessous les meilleurs résultats d'exécution :

{% raw %}
<table class="benchmark-table">
  <thead>
    <tr>
      <th></th>
      <th>Vue</th>
      <th>React</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Plus rapide</th>
      <td>23ms</td>
      <td>63ms</td>
    </tr>
    <tr>
      <th>Médiane</th>
      <td>42ms</td>
      <td>81ms</td>
    </tr>
    <tr>
      <th>Moyenne</th>
      <td>51ms</td>
      <td>94ms</td>
    </tr>
    <tr>
      <th>à 95 %</th>
      <td>73ms</td>
      <td>164ms</td>
    </tr>
    <tr>
      <th>Plus lent</th>
      <td>343ms</td>
      <td>453ms</td>
    </tr>
  </tbody>
</table>
{% endraw %}

#### Taux de rafraîchissement

Avec React, quand l'état d'un composant change, cela enclenche de nouveau le rendu de tous ses sous-composants, en partant de ce composant comme racine. Pour éviter les rendus inutiles de composants enfants, vous devez implémenter `shouldComponentUpdate` partout et utiliser des structures de données immuables. Avec Vue, les dépendances d'un composant sont automatiquement tracées durant le rendu, ainsi le système sait précisément quels composants ont besoin d'être rafraîchis.

Cela signifie que les rafraîchissements dans un composant Vue non optimisé seront plus rapides que ceux d'un composant React non optimisé. En fait, grâce au rendu performant de Vue, même un React pleinement optimisé est plus lent que Vue sans optimisations.

#### En développement

Bien que la performance en production soit la métrique la plus importante car directement en corrélation avec l'expérience de l'utilisateur final, la performance en développement est aussi importante car associée à l'expérience du développeur.

Vue et React restent suffisamment rapides en développement pour la plupart des applications normales. Cependant, quand vous avez besoin d'un taux de rafraîchissement élevé pour de la visualisation de données ou de l'animation, nous avons observé des cas où Vue supportait 10 images par seconde en développement là où React tombait à environ 1 image par seconde.

Cela est dû aux nombreuses et lourdes vérifications faites régulièrement par React en mode développement qui aident à fournir d'excellents messages d'avertissement et d'erreur. Nous sommes d'accord pour dire que cela est aussi important pour Vue, mais nous avons essayé de garder un œil sur la performance pendant que nous implémentions ces vérifications.

### HTML & CSS

Avec React tout est JavaScript, ce qui paraît simple et élégant — jusqu'à ce que vous creusiez plus profondément. La réalité, malheureusement, est que réinventer HTML et CSS en JavaScript résout certains problèmes du modèle traditionnel, mais en créé également d'autres. Avec Vue, nous préférons adopter les technologies du Web et construire par-dessus celles-ci. Pour vous montrer ce que cela signifie, nous allons nous plonger dans plusieurs exemples.

#### JSX vs Templates

Avec React, tous les composants expriment leur UI à travers des fonctions de rendu utilisant JSX, une syntaxe déclarative comme XML qui fonctionne au sein de JavaScript. En voici un exemple ici, [approuvé par la communauté React](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684).

``` jsx
render () {
  let { items } = this.props

  let children
  if (items.length > 0) {
    children = (
      <ul>
        {items.map(item =>
          <li key={item.id}>{item.name}</li>
        )}
      </ul>
    )
  } else {
    children = <p>No items found.</p>
  }

  return (
    <div className='list-container'>
      {children}
    </div>
  )
}
```

Les fonctions de rendu de JSX ont quelques avantages :

- Vous pouvez utiliser la puissance d'un langage de programmation complet (JavaScript) pour créer vos vues.
- Les outils d'aide (ex : analyse des erreurs, vérifications de typage, auto-complétion...) pour JSX sont en bien des points plus avancés que ce qui est actuellement disponible dans les templates de Vue.

Dans Vue, nous avons également des [fonctions de rendu](https://vuejs.org/v2/guide/render-function.html) et même [un support de JSX](https://vuejs.org/v2/guide/render-function.html#JSX), car parfois, nous avons besoin de cette puissance. Cependant, pour une expérience par défaut nous offrons les templates comme une alternative simple :

``` html
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ul>
    <p v-else>No items found.</p>
  </div>
</template>
```

Quelques avantages ici :

- Moins d'implémentations et de décisions sur le style doivent être faites lors de l'écriture du template.
- Un template est toujours déclaratif.
- Tout HTML valide est un template valide.
- Cela se lit plus comme en anglais (ex : for each item in items).
- Une version avancée de JavaScript n'est pas requise pour accroître la lisibilité.

Non seulement c'est bien plus facile pour le développeur qui les écrit, mais les designers et développeurs moins expérimentés trouveront également bien plus facile d'analyser et de contribuer au code.

Un autre bénéfice des templates respectant le HTML est que vous pouvez utiliser des préprocesseurs comme Pug (anciennement Jade) pour créer vos templates Vue :

``` pug
div.list-container
  ul(v-if="items.length")
    li(v-for="item in items") {{ item.name }}
  p(v-else) No items found.
```

#### CSS à portée limitée au composant

À moins que vous ne répartissiez les composants dans plusieurs fichiers (par exemple avec les [Modules CSS](https://github.com/gajus/react-css-modules)), limiter la portée du CSS dans React est souvent fait par des solutions « CSS-in-JS ». Il y a beaucoup de solutions en compétition, chacune avec leurs propres inconvénients. Un problème courant est que les fonctionnalités comme les états de survol, les media queries, et les pseudo-sélecteurs requièrent soit de lourdes dépendances pour réinventer ce que le CSS fait déjà — soit ne sont simplement pas supportées. S'il n'est pas optimisé avec précaution, le « CSS-in-JS » peut aussi impacter de manière non négligeable les performances à l'exécution. Plus important encore, cela change l'expérience première offerte par du CSS standard.

Vue, en revanche, vous donne l'accès complet au CSS au sein de [simples fichiers composants](https://vuejs.org/v2/guide/single-file-components.html) :

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

L'attribut optionnel `scoped` encapsule automatiquement ce CSS dans votre composant en ajoutant un unique attribut (comme par exemple `data-v-21e5b78`) à l'élément en compilant `.list-container:hover` en `.list-container[data-v-21e5b78]:hover`.

Si vous êtes déjà familier avec les Modules CSS, les fichiers de composants Vue ont également un [support de première classe pour ceux-ci](http://vue-loader.vuejs.org/en/features/css-modules.html).

Enfin, exactement comme en HTML, vous avez également la possibilité d'écrire votre CSS en utilisant les préprocesseurs ou post-processeurs de votre choix, vous permettant de tirer parti des bibliothèques existantes dans ces écosystèmes. Vous pouvez aussi effectuer des opérations centrées sur le design comme la manipulation de couleur durant votre chaîne de build, au lieu d'importer des bibliothèques JavaScript spécialisées qui vont augmenter le poids de votre build et complexifier votre application.

### Adaptabilité

#### Utilisation avancée

Pour de larges applications, Vue et React offrent des solutions de routage robustes. La communauté React a également été très innovante en matière de solutions de gestion d'état (ex : Flux/Redux). Ces modèles de gestion d'état et [même Redux lui-même](https://github.com/egoist/revue) peuvent être facilement intégrés dans une application Vue. En fait, Vue a même poussé ce modèle un cran plus loin avec [Vuex](https://github.com/vuejs/vuex), une solution de gestion d'état inspirée par Elm qui s'intègre profondément dans Vue et qui, nous pensons, offre une expérience de développement supérieure.

Une autre différence importante entre ces offres est que les bibliothèques accompagnant Vue pour la gestion d'état et le routage (parmi [d'autres concernées](https://github.com/vuejs)) sont toutes officiellement supportées et gardées à jour avec le cœur de la bibliothèque. React préfère en revanche laisser cette partie à la communauté, créant un écosystème plus fragmenté. Toutefois, étant plus populaire, l'écosystème de React est considérablement plus riche que celui de Vue.

Pour finir, Vue offre un [outil de génération de projet en ligne de commande](https://github.com/vuejs/vue-cli) qui rend trivial le démarrage d'un nouveau projet en utilisant le système de système de build de votre choix, incluant [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), ou même sans [système de création](https://github.com/vuejs-templates/simple). React fait aussi des progrès de ce côté là avec [create-react-app](https://github.com/facebookincubator/create-react-app), mais a pour le moment quelques limitations :

- Il ne permet aucune configuration durant la génération du projet, là où les templates de projet Vue permettent une personnalisation à la façon Yeoman.
- Il ne propose qu'un seul template qui présume que vous concevez une application web monopage, là où Vue offre une large variété de templates pour différents objectifs et outils de build.
- Il ne permet pas la génération de projets depuis des templates faits par les utilisateurs, ce qui peut être particulièrement utile en entreprise avec des conventions pré-établies.

Il est important de noter que beaucoup de ces limitations sont des choix d'architecture intentionnels pris par l'équipe de create-react-app et qui ont également leurs avantages. Par exemple, tant que les besoins de votre projet sont très simples et que vous n'avez jamais besoin d' « éjecter » des choses pour personnaliser votre chaîne de build, vous aurez la possibilité de le mettre à jour en tant que dépendance. Vous pouvez en lire plus à propos de [la différence de philosophie ici](https://github.com/facebookincubator/create-react-app#philosophy).

#### Utilisation minimale

React est renommé pour sa courbe d'apprentissage abrupte. Avant de pouvoir réellement commencer, vous devez connaître JSX et probablement ES2015+, puisque beaucoup d'exemples utilisent la syntaxe React pour les classes. Vous devez également vous former aux outils de build, car bien que vous puissiez techniquement utiliser le compilateur Babel de manière autonome pour compiler à la volée le code dans le navigateur, cela n'est absolument pas envisageable en production.

Bien que Vue s'élève au niveau d'utilisation de React, voire le dépasse, il peut tout aussi bien se réduire au niveau d'utilisation de jQuery. C'est exact — tout ce que vous avez à faire est de placer une balise script dans une page :

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

Ensuite vous pouvez commencer à écrire du code Vue et même livrer la version minifiée sans vous sentir coupable ou vous soucier des problèmes de performance.

Puisque vous n'avez pas besoin de connaître JSX, ES2015 ou les outils de build pour commencer à travailler avec Vue, il faut généralement moins d'un jour à un développeur pour lire [le guide](./) et en savoir assez pour concevoir des applications complexes.

### Rendu natif

ReactNative vous permet d'écrire des applications natives iOS et Android et Android en utilisant le même modèle de composant que React. Cela est génial pour un développeur, vous pouvez appliquer vos connaissances d'un framework sur de multiple plateformes. De ce côté, Vue a une collaboration officielle avec [Weex](https://alibaba.github.io/weex/), un framework de développement d'UI multiplateforme développé par le groupe Alibaba, qui utilise Vue en tant que framework JavaScript d'exécution. Cela signifie qu'avec Weex, vous pouvez utiliser la même syntaxe de composant Vue pour concevoir des composants qui peuvent non seulement être utilisés sur navigateur mais également nativement sur iOS ou Android !

Actuellement, Weex est toujours activement en développement et n'est pas aussi mature et bien testé que ReactNative, son développement est soutenu par les besoins en production du plus gros business e-commerce au monde, et l'équipe de Vue est aussi en étroite collaboration avec l'équipe de Weex pour assurer un passage en douceur pour les développeurs depuis Vue.

### Avec MobX

MobX est devenu populaire dans la communauté React et utilise actuellement un système de réactivité identique à Vue. Dans une certaine mesure, le workflow React + MobX peut être considéré comme plus verbeux que Vue. Donc si vous utilisez cette combinaison et qu'elle vous plaît, passer sur Vue est probablement la prochaine étape logique.

## Angular 1

Une partie de la syntaxe de Vue ressemblera très fortement à celle de Angular (ex : `v-if` vs `ng-if`). Cela est dû au fait qu'il y a beaucoup de choses pour lesquelles Angular a vu juste et que cela a été une source d'inspiration pour Vue très tôt dans son développement. Cependant, Angular vient également avec de nombreux soucis. C'est là que Vue a tenté d'apporter une amélioration significative.

### Complexité

Vue est bien plus simple que Angular 1, autant en termes d'API que d'architecture. En apprendre assez pour créer une application complexe prend généralement moins d'un jour, ce qui n'est pas vrai pour Angular 1.

### Flexibilité et modularité

Angular 1 impose fortement la manière dont votre application doit être structurée, là où Vue offre une solution plus flexible, modulaire. Cela premet de rendre Vue plus adaptable à une large variété de projets, bien que nous reconnaissons également qu'il peut être utile de prendre des décisions pour vous afin que vous puissiez juste commencer à développer.

C'est pourquoi nous offrons un [template Webpack](https://github.com/vuejs-templates/webpack) qui peut être mis en place en en quelques minutes, tout en vous donnant accès à des fonctionnalités avancées comme le rechargement de module à chaud, l'analyse syntaxique, l'extraction CSS et bien plus.

### Liaison de données

Angular 1 utilise la liaison de données bidirectionnelle entre les *scopes*, tandis que Vue impose un flux de données unidirectionnel entre les composants. Cela rend le flux de données plus facile à appréhender dans des applications non triviales.

### Directives vs Composants

Vue fait une distinction plus claire entre directives et composants. Les directives sont conçues pour encapsuler uniquement des manipulations du DOM, tandis que les composants sont des unités indépendantes ayant leur propre vue et logique de données. Avec Angular, il y a beaucoup de confusion entre les deux.

### Performance

Vue a de meilleures performances et il est bien plus optimisé car il n'utilise pas le *dirty checking*. Angular 1 devient lent quand il y a un grand nombre d'observateurs, car chaque fois que quelque-chose change change dans le *scope*, tous les observateurs ont besoin d'être réévalués. De plus, le *digest cycle* peut avoir besoin de s'exécuter plusieurs fois pour se « stabiliser » si un observateur déclenche une autre mutation. Les utilisateurs d'Angular ont parfois recourt a des techniques ésotériques pour contourner le *digest cycle*, et dans certaines situations, il n'y a simplement aucun moyen pour optimiser un *scope* avec beaucoup d'observateurs.

Vue ne souffre pas de tout ça car il utilise un système transparent de suivi de dépendances avec mise en file d'attente asynchrone — tous les changements se déclenchent indépendamment à moins qu'ils aient des relations de dépendance explicites.

Il est intéressant de noter qu'il y a quelques similitudes dans la manière dont Angular 2 et Vue corrigent ces problèmes propres à Angular 1.

## Angular 2

Nous avons une section dédiée à Angular 2 car c'est vraiment un framework complètement nouveau. Par exemple, il comporte un système de composants de première classe, beaucoup de détails d'implémentation ont été complètement réécrits, et l'API a également changé assez drastiquement.

### TypeScript

Alors que Angular 1 pouvait être utilisé pour de petite applications, Angular 2 a changé de point de vue pour faciliter la réalisation de large applications d'entreprise. Une conséquence de cela, est qu'il requière TypeScript, qui peut être réellement utile au développeurs qui désirent du typage fort comme c'est le cas avec Java ou C#.

Vue est aussi bien fourni pour l'[environnement d'entreprise](https://github.com/vuejs/awesome-vue#enterprise-usage) et peut également être utilisé avec TypeScript via notre [typage officiel](https://github.com/vuejs/vue/tree/dev/types) et les [décorateurs officiels](https://github.com/vuejs/vue-class-component), bien que ce soit définitivement une option dans notre cas.

### Taille et performance

En terme de performance, les deux frameworks sont exceptionnellement rapides et il n'y a pas assez de données de cas réelles pour ce faire une idée tranchée. Cependant, si vous êtes déterminez à comparer des valeurs, Vue 2.0 semble devant Angular 2 selon le [benchmark de cette partie tierce](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

D'une taille raisonnable, Angular 2 avec sa compilation hors-ligne et le retrait de fonctionalités non utilisés est capable d'offrir une taille considérablement basse. Un Vue 2.0 avec la totalité des fonctionnalités compilées inclus (23kb) est toujours plus léger que le bare-bone exemple de Angular 2 (50kb). Notons que la taille d'une app Angular 2 est petite grâce au retrait des fonctionnalités non utilisées qui enlève le code des fonctionnalités qui ne sont pas utilisées. Il va donc éventuellement encore plus grossir à mesure que vous importez et utilisez plus de fonctionnalités du framework.

### Flexibilité

Vue est moins contraignant que Angular 2, offrant un support officiel pour une variété de système de génération, avec aucune restrictions sur la manière dont vous devez structurer votre application. Beaucoup de développeur apprécie cette liberté, quand d'autres préfèrent avoir seulement une seule bonne route pour créer une application.

### Courbe d'apprentissage

Pour commercer avec Vue, tout ce dont vous avez besoin sont des connaissances en HTML et JavaScript ES5 (c-à-d JavaScript de base). Avec ces compétences de base, vous pouvez commencer à construire des applications complexes sans perdre des jours à lire [la documentation](https://vuejs.org/v2/guide/).

La courbe d'apprentissage de Angular 2 est plus raide. Même sans TypeScript, le [Guide de démarrage rapide](https://angular.io/docs/js/latest/quickstart.html) commence avec une app qui utilise JavaScript ES2015, npm avec 18 dépendances, 4 fichiers, et plus de 3000 mots pour expliquer le fonctionnement global — juste pour dire Hello World. Il ne serait donc pas exagéré de dire que le [Hello World de Vue](https://jsfiddle.net/chrisvfritz/50wL7mdz/) est bien plus simple. Il est si simple, qu'il n'est pas nécessaire de consacrer une page dédiée dans le guide pour ça.

## Ember

Ember est un framework plein de fonctionalités qui a été construit pour être hautement opiniâtre. Il fournit beaucoup de conventions et une fois que vous êtes assez familié avec elles, il vous rend réellement productif. Cependant cela signifie que la courbe d'apprentissage est élevée et souffre de flexibilité. C'est un compromis lorsque vous essayez de choisir entre un cadre opiniâtre et une bibliothèque avec un ensemble d'outils mal couplés qui travaillent ensemble. Ces derniers vous offre la liberté mais également vous laisse prendre plus de décisions d'architecture.

Cela dit, il serait problement plus judicieux de faire une comparaison entre le cœur de Vue et le système de [template](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/) d'Ember et les couches de [modèles d'objet](https://guides.emberjs.com/v2.10.0/object-model/) :

- Vue fournit une réactivité discrète sur des objets plainement JavaScript et des propriétés calculées automatiquement. Dans Ember, vous devez encapsuler tout dans des objets Ember et manuellement déclarer toutes les dépendances entre les propriétés calculées.

- La syntaxe des templates de Vue exploite toute la puissance des expressions JavaScript alors que les expressions Handlebars et les aides à la syntaxe sont intentionnellement limité en comparaison.

- Côté performance, Vue surpasse Ember avec une bonne avance, même après la dernière mise à jour du moteur Glimmer dans Ember 2.0. Vue regroupe les mises à jour, alors que dans Ember, vous devez gérer manuellement les boucles d'exécution dans des situations critiques.

## Knockout

Knockout fut un pionnier en MVVM et son espace de suivi de dépendence et son système réactif est vraiment très similaire à Vue. C'est son [support des navigateurs](http://knockoutjs.com/documentation/browser-support.html) qui est vraiment impressionnant considérant tout ce qu'il permet de faire avec un support jusqu'à IE6 ! Vue d'un autre côté ne supporte que IE9+.

Avec le temps cependant, le développement de Knockout a ralenti et il commence a se montrer un peu agé. Par exemple, son système de composant manque d'un ensemble complet d'accroche au cycle de vie et même si c'est un cas d'utilisation commun, l'interface pour passer des composants enfants à un composant est quelque peu maladroit en comparaison de Vue.

Il semble aussi y avoir une différence de philosophie dans le design des APIs et cela peut être démontrer en étudiant comment chacun gére la création [d'une simple todo list](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). C'est définitivement quelque chose de subjectif, mais beaucoup considère l'API de Vue moins complexe et mieux structurée.

## Polymer

Polymer est encore un projet sponsorisé par Google et est également une source d'inspiration pour Vue. Les composants de Vue peuvent être grosso modo comparés à ceux des éléments personnalisés de Polymer et les deux fournissent un style de développement vraiment similaire. La plus grosse différence est que Polymer est construit au dessus des dernières fonctionnalités de Composant Web et requière donc des polyfills complexes pour fonctionner (avec des performances dégradées) dans les navigateurs qui ne supportent pas ses fonctionnalités nativement. Par contraste, Vue fonctionne sans aucunes dépendances dans tous les navigateurs après IE9.

Dans Polymer 1.0, l'équipe a également créé un système de liaison de donnée vraiment limité pour compenser les performances. Par exemple, la seule expression supportée dans les templates Polymer sont les négations booléennes et l'appel de simples méthodes. Son implémentation des propriétés calculées n'est pas non plus très flexible.

Les éléments personnalisés sont créé dans des fichiers HTML, avec comme limite du JavaScript et CSS natif (et les fonctionnalités supportés par les navigateurs actuels). En comparaison, les fichiers de composant unique de Vue vous permettent facilement d'utiliser ES2015+ et n'importe quel préprocesseur CSS de votre choix.

Quand vous déployez en production, Polymer recommande de tout charger à la volé avec des imports HTML, en s'appuyant sur l'implémentation dans les navigateurs de la spec, et du support de HTTP/2 côté client et côté serveur. Cela peut ne pas être possible en fonction de l'audience ciblée ou de l'environnement serveur. Au cas où vous ne souhaiteriez pas cela, vous pouvez utiliser un outil appelé Vulcanizer pour empaqueter vos éléments Polymer. De ce côté, Vue peut combiner ses fonctionnalités de composant async avec la fonctionnalité de découpe de code de Webpack pour facilement découper des parties de l'application empaquetée pour du chargement à la volée. Cela assure l'entière compatibilité avec les vieux navigateurs en conservant une excellente performance de chargement.

Il est également totallement possible d'offrir une intégration profonde entre Vue et ses specs de Composant Web tels que les Éléments Personnalisés et l'Encapsulation Discrète du DOM — Cependant, nous sommes actuellement en attente que les specs mûrissent et soit largement implémenté dans tous les navigateurs majeurs avant de sérieusement nous pencher sur la question.

## Riot

Riot 2.0 fournit un modèle de développement basé sur les composants similaire (cela est appelé un « tag » dans Riot), avec une minimal mais magnifique API. Riot et Vue partage beaucoup en matière de philosophie d'architecture. Cependant, bien qu'il soit un peu plus lourd que Riot, Vue offre beaucoup d'avantages significatifs :

- [Les effets de transitions](transitions.html). Riot n'en a pas.
- Un système de route bien plus puissant. Le routage de l'API Riot est vraiment minimal.
- Meilleures performances. Riot [utilise le DOM](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding) plutôt qu'un DOM Virtuel, et par conséquent il souffre des mêmes problèmes de performances que Angular 1.
- Plus d'outils de support mûrs. Vue fournit un support officiel pour [Webpack](https://github.com/vuejs/vue-loader) et [Browserify](https://github.com/vuejs/vueify), là où Riot s'appuie sur le soutien de la communauté pour l'intégration d'un système de création.
