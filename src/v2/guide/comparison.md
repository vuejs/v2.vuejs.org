---
title: Comparaison avec les autres frameworks
type: guide
order: 801
---

C'est définitivement la page du guide la plus difficile à écrire, mais nous avons le sentiment que c'est important. Il y a de fortes chances pour que vous ayez des problèmes à résoudre et que vous utilisiez une autre bibliothèque pour les résoudre. Vous êtes ici parce que vous voulez savoir si Vue peut encore mieux résoudre vos problèmes spécifiques. C'est la réponse que nous espérons pouvoir vous apporter.

Nous voudrions également essayer d'être objectif. En tant que mainteneurs, nous aimons énormément Vue. Il y a certains problèmes que nous pensons pouvoir être résolus avec Vue. Nous travaillons dessus car nous y croyons. Cependant nous voulons être juste et précis. Les autres bibliothèques offrent des avantages significatifs, comme React et son vaste écosystème de rendu alternatif ou pour Knockout le support des navigateurs jusqu'à IE6 ; nous allons essayer de prendre en compte cela correctement.

Nous apprécierions également **votre** aide pour garder ce document à jour car le monde de JavaScript bouge rapidement ! Si vous remarquez une imprécision ou quelque chose qui ne semble pas tout à fait être juste, faites-le nous savoir en [ouvrant un ticket](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React et Vue ont beaucoup en commun. Tous les deux :

- utilisent un DOM virtuel,
- fournissent des composants de vue réactifs et composables,
- restent concentrés sur le cœur de la bibliothèque, en déléguant le routage et la gestion d'état à des bibliothèques connexes.

Ayant un champ d'action similaire, nous avons passé plus de temps à affiner cette comparaison que les autres. Nous voulons être surs non seulement de nos précisions techniques, mais aussi de leur neutralité. Nous soulignons là où React brille par rapport à Vue, par exemple dans la richesse de son écosystème et l'abondance de ses moteurs de rendu personnalisés.

Ceci étant dit, il est inévitable que la comparaison puisse paraitre biaisée en faveur de Vue pour certains utilisateurs de React, puisque beaucoup des sujets explorés sont subjectifs dans une certaine mesure. Nous reconnaissons l'existence de préférences techniques différentes, et cette comparaison va avoir pour principal but de décrire pourquoi vous pourriez potentiellement préférer Vue s'il s'avère que vos préférences coïncident avec les nôtres.

Plusieurs des sections plus bas peuvent être incorrectes du fait de la récente mise à jour de React 16+. Nous avons planifié de travailler avec la communauté React pour retravailler ces sections dans un futur proche.

### Performance à l'exécution

Vue comme React offrent des performances similaires et incroyables. La rapidité est un facteur de décision entre les deux assez minime. Pour le détail exacte des chiffres, vous pouvez regarder ce [benchmark tier](http://www.stefankrause.net/js-frameworks-benchmark7/table.html) se focalisant sur les performances brutes de rendu et de mise à jour avec de simples arbres de composant.

#### Efforts d'optimisation

Avec React, quand l'état d'un composant change, cela enclenche de nouveau le rendu de tous ses sous-composants, en partant de ce composant comme racine. Pour éviter les rendus inutiles de composants enfants, vous avez besoin d'un `PureComponent` ou d'implémenter `shouldComponentUpdate` chaque fois que possible. Vous pouvez également utiliser des structures de données immuables pour rendre vos changements d'état facilement optimisés. Cependant, dans certains cas, vous ne pourrez pas faire de telles optimisations car l'utilisation de `PureComponent` ou `shouldComponentUpdate` présuppose que la sortie de votre arbre de rendu complet soit déterminée par l'utilisation des props. Si cela n'est pas pris en compte, certaines optimisations mèneront à un état inconsistant du DOM.

Avec Vue, les dépendances d'un composant sont automatiquement tracées durant le rendu, ainsi le système sait précisément quels composants ont besoin d'être rafraichis. Chaque composant peut être considéré comme ayant déjà `shouldComponentUpdate` d'implémenté automatiquement pour vous, sans se soucier des exceptions pour les composants imbriqués.

Au final cela permet d'éviter l'utilisation d'un large éventail d'optimisation de la part du développeur, et lui permet de se concentrer davantage sur l'architecture de l'application pièce par pièce.

### HTML & CSS

Avec React tout est JavaScript. Pas seulement la structure HTML exprimée via JSX, mais également le CSS qui tend également à être géré avec du JavaScript. Cette approche a ses propres bénéfices, mais vient également avec son lot de compromis qui ne devraient pas mériter tant d'attention de la part de chaque développeur.

Vue adopte les technologies classiques du Web et construit par-dessus celles-ci. Pour vous montrer ce que cela signifie, nous allons nous plonger dans plusieurs exemples.

#### JSX vs Templates

Avec React, tous les composants expriment leur UI à travers des fonctions de rendu utilisant JSX, une syntaxe déclarative comme XML qui fonctionne au sein de JavaScript.

Les fonctions de rendu de JSX ont quelques avantages :

- Vous pouvez utiliser la puissance d'un langage de programmation complet (JavaScript) pour créer vos vues. Cela inclut les variables temporaires, le contrôle de flux et les valeurs JavaScript directement référencées dans la portée.

- Les outils d'aide (par ex. : analyse des erreurs, vérifications de typage, autocomplétion) pour JSX sont en bien des points plus avancés que ce qui est actuellement disponible dans les templates de Vue.

Dans Vue, nous avons également des [fonctions de rendu](render-function.html) et même [un support de JSX](render-function.html#JSX), car parfois, nous avons besoin de cette puissance. Cependant, pour une expérience par défaut nous offrons les templates comme une alternative simple. N'importe quel HTML valide est également un template Vue valide, ce qui mène à ces quelques avantages induits :

- Pour beaucoup de développeurs qui travaillent en HTML, les templates semblent tout simplement plus naturels à écrire. La préférence en elle-même est quelque chose de subjectif, mais si cela rend les développeurs plus productifs alors le bénéfice est objectif.

- Les templates basés sur du HTML sont plus simples à migrer progressivement depuis une application existante qui souhaiterait tirer avantage des fonctionnalités de réactivités de Vue.

- Cela est également plus simple pour les designers et les développeurs moins expérimentés de comprendre et contribuer au code de base.

- Vous pouvez même utiliser des préprocesseurs comme Pug (anciennement connu en tant que Jade) pour créer vos templates de Vue.

Beaucoup de personnes argumentent sur le fait que vous devez apprendre un langage spécifique pour écrire vos templates. Nous pensons que cette différence est superficielle. Premièrement, JSX ne signifie pas que les utilisateurs ne doivent rien apprendre en plus. Cette syntaxe additionnelle au-dessus du JavaScript à beau être simple à apprendre pour quiconque connait le JavaScript, il n'est pas vrai de dire qu'elle ne nécessite pas un apprentissage supplémentaire. De la même manière, les templates sont juste une syntaxe additionnelle au-dessus du HTML et qui ont un cout d'apprentissage assez bas pour ceux connaissant déjà le HTML. Avec cet autre langage spécifique, nous sommes aussi capables d'aider les utilisateurs à faire plus de choses avec moins de code (par ex. les modificateurs `v-on`). La même tache demanderait bien plus de code en utilisant une syntaxe JSX ou des fonctions de rendu.

À un haut niveau, nous pouvons diviser les composants en deux catégories : ceux de présentation et ceux de logique. Nous recommandons d'utiliser les templates pour les composants de présentation et les fonctions de rendu (ou JSX) pour les composants de logique. Le pourcentage de chaque type dépend du type d'application que vous construisez, bien qu'en général nous trouvions plus de composants de présentation.

#### CSS à portée limitée au composant

À moins que vous ne répartissiez les composants dans plusieurs fichiers (par exemple avec les [Modules CSS](https://github.com/gajus/react-css-modules)), limiter la portée du CSS dans React est souvent fait par des solutions « CSS-in-JS » (par ex : [styled-components](https://github.com/styled-components/styled-components), [glamorous](https://github.com/paypal/glamorous) et [emotion](https://github.com/emotion-js/emotion)). Ceci introduit un nouveau paradigme de style orienté composant qui est différent du processus de création de CSS normal. De plus, bien qu'il y ait une option pour extraire le CSS dans un seul fichier de style lors de la phase de build, il est encore courant qu'une exécution doive être faite niveau paquetage pour que le style fonctionne correctement. Alors que vous avez l'avantage du JavaScript pendant la construction de vos styles, la contrepartie est souvent un paquetage plus lourd et un coup d'exécution JavaScript.

Si vous êtes un grand fan de « CSS-in-JS », beaucoup de bibliothèques supportent Vue (par ex. [styled-components-vue](https://github.com/styled-components/vue-styled-components) et [vue-emotion](https://github.com/egoist/vue-emotion)). La grande différence entre React et Vue ici est que la méthode de style par défaut de Vue est plus familière avec l'utilisation d'une balise `<style>` dans [un composant monofichier](single-file-components.html).

[Un composant monofichier](single-file-components.html) vous donne l'accès complet au CSS au sein d'un même fichier comme le reste du code du composant.

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

L'attribut optionnel `scoped` encapsule automatiquement ce CSS dans votre composant en ajoutant un unique attribut (par exemple `data-v-21e5b78`) à l'élément en compilant `.list-container:hover` en `.list-container[data-v-21e5b78]:hover`.

Enfin, le style dans un composant monofichier Vue est vraiment flexible. Avec [vue-loader](https://github.com/vuejs/vue-loader), vous pouvez utiliser n'importe quel préprocesseur, postprocesseur et même une intégration profonde avec les [Modules CSS](https://vue-loader.vuejs.org/en/features/css-modules.html) ; le tout dans un élément `<style>`.

### Adaptabilité

#### Utilisation avancée

Pour de larges applications, Vue et React offrent des solutions de routage robustes. La communauté React a également été très innovante en matière de solutions de gestion d'état (par ex. : Flux/Redux). Ces modèles de gestion d'état et [même Redux lui-même](https://yarnpkg.com/en/packages?q=redux%20vue&p=1) peuvent être facilement intégrés dans une application Vue. En fait, Vue a même poussé ce modèle un cran plus loin avec [Vuex](https://github.com/vuejs/vuex), une solution de gestion d'état inspirée par Elm qui s'intègre profondément dans Vue et qui, nous pensons, offre une expérience de développement supérieure.

Une autre différence importante entre ces offres est que les bibliothèques accompagnant Vue pour la gestion d'état et le routage (parmi [d'autres concernées](https://github.com/vuejs)) sont toutes officiellement supportées et gardées à jour avec le cœur de la bibliothèque. React préfère en revanche laisser cette partie à la communauté, créant un écosystème plus fragmenté. Toutefois, étant plus populaire, l'écosystème de React est considérablement plus riche que celui de Vue.

Pour finir, Vue offre un [outil de génération de projet en ligne de commande](https://github.com/vuejs/vue-cli) qui rend trivial le démarrage d'un nouveau projet en utilisant le système de système de build de votre choix, incluant [webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), ou même sans [système de création](https://github.com/vuejs-templates/simple). React fait aussi des progrès de ce côté-là avec [create-react-app](https://github.com/facebookincubator/create-react-app), mais a pour le moment quelques limitations :

- Il ne permet aucune configuration durant la génération du projet, là où les templates de projet Vue permettent une personnalisation à la façon [Yeoman](http://yeoman.io/).
- Il ne propose qu'un seul template qui présume que vous concevez une application web monopage, là où Vue offre une large variété de templates pour différents objectifs et outils de build.
- Il ne permet pas la génération de projets depuis des templates faits par les utilisateurs, ce qui peut être particulièrement utile en entreprise avec des conventions préétablies.

Il est important de noter que beaucoup de ces limitations sont des choix d'architecture intentionnels pris par l'équipe de create-react-app et qui ont également leurs avantages. Par exemple, tant que les besoins de votre projet sont très simples et que vous n'avez jamais besoin d' « éjecter » des choses pour personnaliser votre chaîne de build, vous aurez la possibilité de le mettre à jour en tant que dépendance. Vous pouvez en lire plus à propos de [la différence de philosophie ici](https://github.com/facebookincubator/create-react-app#philosophy).

#### Utilisation minimale

React est renommé pour sa courbe d'apprentissage abrupte. Avant de pouvoir réellement commencer, vous devez connaitre JSX et probablement ES2015+, puisque beaucoup d'exemples utilisent la syntaxe React pour les classes. Vous devez également vous former aux outils de build, car bien que vous puissiez techniquement utiliser le compilateur Babel de manière autonome pour compiler à la volée le code dans le navigateur, cela n'est absolument pas envisageable en production.

Bien que Vue s'élève au niveau d'utilisation de React, il peut tout aussi bien se réduire au niveau d'utilisation de jQuery. C'est exact — tout ce que vous avez à faire est de placer une balise script dans une page :

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Ensuite vous pouvez commencer à écrire du code Vue et même livrer la version minifiée sans vous sentir coupable ou vous soucier des problèmes de performance.

Puisque vous n'avez pas besoin de connaitre JSX, ES2015 ou les outils de build pour commencer à travailler avec Vue, il faut généralement moins d'un jour à un développeur pour lire [le guide](./) et en savoir assez pour concevoir des applications complexes.

### Rendu natif

React Native vous permet d'écrire des applications natives iOS et Android en utilisant le même modèle de composant que React. C'est génial car en tant que développeur, vous pouvez appliquer vos connaissances d'un framework sur de multiples plateformes. De ce côté, Vue a une collaboration officielle avec [Weex](https://weex.apache.org/), un framework de développement d'UI multiplateforme développé par le groupe Alibaba et incubé par la Apache Software Foundation (ASF). Veex vous permet d'utiliser la même syntaxe de composant Vue pour concevoir des composants qui peuvent non seulement être utilisés sur navigateur mais également nativement sur iOS ou Android !

Actuellement, Weex est toujours activement en développement et n'est pas aussi mature et bien testé que React Native, son développement est soutenu par les besoins en production du plus gros business e-commerce au monde, et l'équipe de Vue est aussi en étroite collaboration avec l'équipe de Weex pour assurer un passage en douceur pour les développeurs depuis Vue.

Une autre option que les développeurs Vue auront bientôt est l'utilisation de [NativeScript](https://www.nativescript.org/), via un [plugin communautaire](https://github.com/rigor789/nativescript-vue).

### Avec MobX

MobX est devenu populaire dans la communauté React et utilise actuellement un système de réactivité identique à Vue. Dans une certaine mesure, le workflow React + MobX peut être considéré comme plus verbeux que Vue. Donc si vous utilisez cette combinaison et qu'elle vous plait, passer sur Vue est probablement la prochaine étape logique.

### Preact et les autres bibliothèques de type React

Les bibliothèques de type React essayent généralement de partager le plus possible leur API et leur écosystème avec React. Pour cette raison, la grande majorité des comparaisons ci-dessus leur seront également applicables. La principale différence sera généralement un écosystème réduit, souvent de manière significative, par rapport à React. Étant donné que ces bibliothèques ne peuvent pas être 100% compatibles dans l'écosystème React, certaines bibliothèques d'outils et de compagnons ne peuvent pas être utilisables. Ou, même s'ils semblent fonctionner, ils peuvent se bloquer à tout moment à moins que votre bibliothèque spécifique de type React ne soit officiellement supportée par React.

### Preact and Other React-Like Libraries

React-like libraries usually try to share as much of their API and ecosystem with React as is feasible. For that reason, the vast majority of comparisons above will also apply to them. The main difference will typically be a reduced ecosystem, often significantly, compared to React. Since these libraries cannot be 100% compatible with everything in the React ecosystem, some tooling and companion libraries may not be usable. Or, even if they appear to work, they could break at any time unless your specific React-like library is officially supported on par with React.

## AngularJS (Angular 1)

Une partie de la syntaxe de Vue ressemblera très fortement à celle de AngularJS (ex : `v-if` vs `ng-if`). Cela est dû au fait qu'il y a beaucoup de choses pour lesquelles AngularJS a vu juste et que cela a été une source d'inspiration pour Vue très tôt dans son développement. Cependant, AngularJS vient également avec de nombreux soucis. C'est là que Vue a tenté d'apporter une amélioration significative.

### Complexité

Vue est bien plus simple que AngularJS, autant en termes d'API que d'architecture. En apprendre assez pour créer une application complexe prend généralement moins d'un jour, ce qui n'est pas vrai pour AngularJS.

### Flexibilité et modularité

AngularJS impose fortement la manière dont votre application doit être structurée, là où Vue offre une solution plus flexible, modulaire. Cela permet de rendre Vue plus adaptable à une large variété de projets, bien que nous reconnaissons également qu'il peut être utile de prendre des décisions pour vous afin que vous puissiez juste commencer à développer.

C'est pourquoi nous offrons un [template webpack](https://github.com/vuejs-templates/webpack) qui peut être mis en place en en quelques minutes, tout en vous donnant accès à des fonctionnalités avancées comme le rechargement de module à chaud, l'analyse syntaxique, l'extraction CSS et bien plus.

### Liaison de données

AngularJS utilise la liaison de données bidirectionnelle entre les *scopes*, tandis que Vue impose un flux de données unidirectionnel entre les composants. Cela rend le flux de données plus facile à appréhender dans des applications non triviales.

### Directives vs. Composants

Vue fait une distinction plus claire entre directives et composants. Les directives sont conçues pour encapsuler uniquement des manipulations du DOM, tandis que les composants sont des unités indépendantes ayant leur propre vue et logique de données. Dans AngularJS, les directives peuvent faire un peu tout alors que les composants sont un type  plus spécifique de directive.

### Runtime Performance

Vue a de meilleures performances et il est bien plus optimisé car il n'utilise pas de *dirty checking*. AngularJS devient lent quand il y a un grand nombre d'observateurs, car chaque fois que quelque chose change dans le *scope*, tous les observateurs ont besoin d'être réévalués. De plus, le *digest cycle* peut avoir besoin de s'exécuter plusieurs fois pour se « stabiliser » si un observateur déclenche une autre mutation. Les utilisateurs d'AngularJS ont parfois recours à des techniques ésotériques pour contourner le *digest cycle*, et dans certaines situations, il n'y a simplement aucun moyen pour optimiser un *scope* avec beaucoup d'observateurs.

Vue ne souffre pas de tout ça car il utilise un système transparent de suivi de dépendances avec mise en file d'attente asynchrone — tous les changements se déclenchent indépendamment à moins qu'ils aient des relations de dépendance explicites.

Il est intéressant de noter qu'il y a quelques similitudes dans la manière dont Angular et Vue corrigent ces problèmes propres à AngularJS.

## Angular (Plus connu sous le nom de Angular 2)

Nous avons une section dédiée pour le nouvel Angular car c'est vraiment un framework complètement différent de AngularJS. Par exemple, il comporte un système de composants de première classe, beaucoup de détails d'implémentation ont été complètement réécrits, et l'API a également changé assez drastiquement.

### TypeScript

Angular demande essentiellement l'utilisation de TypeScript, basant toute sa documentation et son apprentissage sur des ressources en TypeScript. TypeScript a ses propres bénéfices ; la vérification de type peut-être très utile dans de grosses applications, et peut-être un grand gain de productivité pour les développeurs Java ou C#.

Cependant, tout le monde ne souhaite pas utiliser TypeScript. Dans beaucoup de cas d'usage simples, introduire un système de typage ajoute une plus grande complexité qu'il n'offre un gain de productivité. Dans ces cas, vous vous en sortirez mieux avec Vue, car utiliser Angular sans TypeScript peut être un vrai challenge.

Pour finir, sans être profondément intégré à TypeScript comme peut l'être Angular, Vue offre également un [typage officiel](https://github.com/vuejs/vue/tree/dev/types) et des [décorateurs officiels](https://github.com/vuejs/vue-class-component) à ceux qui souhaiteraient utiliser TypeScript avec Vue. Nous collaborons également activement avec les équipes de TypeScript et de VSCode chez Microsoft pour améliorer l'expérience de TS/IDE pour les utilisateurs de TS et de Vue.

### Performance à l'exécution

Les deux frameworks sont exceptionnellement rapides avec des métriques similaires au benchmark. Utilisez les métriques spécifiques du [benchmark tier](http://www.stefankrause.net/js-frameworks-benchmark7/table.html) pour une comparaison plus granulaire, mais la rapidité n'est pas un facteur de décision.

### Taille

Les versions récentes d'Angular, avec une [compilation anticipée](https://fr.wikipedia.org/wiki/Compilation_anticip%C3%A9e) et du [tree-shaking](https://en.wikipedia.org/wiki/Tree_shaking), sont capables de diminuer considérablement leurs tailles en sortie. Cependant, un projet complet Vue 2, avec Vuex et Vue Router inclus (~30ko gzippé), est toujours significativement plus léger qu'une application avec compilation anticipée et générée par `angular-cli` (~65ko gzippée).

### Flexibilité

Vue impose beaucoup moins de choix comparé à Angular, offrant un support officiel pour divers systèmes de build, avec aucune restriction sur la manière dont vous devez structurer votre application. Beaucoup de développeurs apprécient cette liberté, quand d'autres préfèrent avoir l'unique « bonne façon » de concevoir une application.

### Courbe d'apprentissage

Pour commencer avec Vue, vous avez seulement besoin de connaissances en HTML et JavaScript ES5 (c.-à-d. JavaScript de base). Avec ces compétences de base, vous pouvez commencer à construire des applications complexes sans perdre des jours à lire [la documentation](https://vuejs.org/v2/guide/).

La courbe d'apprentissage de Angular est plus raide. La surface API du framework est simplement plus grosse et les utilisateurs ont besoin de se familiariser eux-mêmes avec beaucoup de concepts avant d'être productifs. Manifestement, la complexité d'Angular est largement due au fait que son design est conçu uniquement pour répondre à de grandes et complexes applications rendant ainsi le framework bien plus difficile à utiliser pour des développeurs moins expérimentés.

## Ember

Ember est un framework plein de fonctionnalités qui a été conçu pour prendre beaucoup de décisions à la place du développeur. Il fournit beaucoup de conventions et une fois que vous êtes assez familiers avec celles-ci, il peut vous rendre réellement productif. Cependant, cela signifie que la courbe d'apprentissage est élevée et la flexibilité en pâtit. C'est un compromis lorsque vous essayez de choisir entre un framework avec des opinions tranchées et une bibliothèque avec un ensemble d'outils à couplage faible qui travaillent ensemble. Ces derniers vous offrent la liberté mais également vous laissent prendre plus de décisions d'architecture.

Cela dit, il serait probablement plus judicieux de faire une comparaison entre le cœur de Vue et le système de [template](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/) d'Ember et les couches de [modèles d'objet](https://guides.emberjs.com/v2.10.0/object-model/) :

- Vue fournit une réactivité discrète sur de purs objets JavaScript et des propriétés calculées automatiquement. Avec Ember, vous devez encapsuler le tout dans des objets Ember et manuellement déclarer toutes les dépendances des propriétés calculées.

- La syntaxe des templates de Vue exploite toute la puissance des expressions JavaScript alors que les expressions Handlebars et les aides à la syntaxe sont intentionnellement limitées en comparaison.

- Côté performance, Vue surpasse Ember [avec une bonne avance](http://www.stefankrause.net/js-frameworks-benchmark7/table.html), même après la dernière mise à jour du moteur Glimmer dans Ember 2.x. Vue regroupe automatiquement les rafraichissements des vues par lot, alors que dans Ember, vous devez gérer manuellement les boucles d'exécution dans les situations où la performance est critique.

## Knockout

Knockout fut un pionnier dans le domaine du MVVM et du suivi de dépendances, et son système de réactivité est vraiment très similaire à Vue. C'est son [support des navigateurs](http://knockoutjs.com/documentation/browser-support.html) qui est vraiment impressionnant considérant tout ce qu'il permet de faire avec un support jusqu'à IE6 ! Vue d'un autre côté ne supporte que IE9+.

Avec le temps cependant, le développement de Knockout a ralenti et il commence à se montrer un peu âgé. Par exemple, son système de composant manque d'un ensemble complet de hooks au cycle de vie et même si c'est un cas d'utilisation commun, l'interface pour passer des composants enfants à un composant est quelque peu laborieuse en comparaison de Vue.

Il semble aussi y avoir une différence de philosophie dans le design des APIs qui, si vous êtes curieux, peut être démontrée en étudiant comment chacun gère la création [d'une simple liste de tâches](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). C'est assurément quelque chose de subjectif, mais beaucoup considèrent l'API de Vue moins complexe et mieux structurée.

## Polymer

Polymer est encore un autre projet sponsorisé par Google qui a également été une source d'inspiration pour Vue. Les composants de Vue peuvent être grosso modo comparés à ceux des éléments personnalisés de Polymer et les deux fournissent un style de développement vraiment similaire. La plus grosse différence est que Polymer est construit sur la base des dernières fonctionnalités de Web Components et requiert donc des polyfills complexes pour fonctionner (avec des performances dégradées) dans les navigateurs qui ne supportent pas ces fonctionnalités nativement. En revanche, Vue fonctionne sans aucune dépendance dans tous les navigateurs après IE9.

Avec Polymer, l'équipe a également créé un système de liaison de données vraiment limité afin de compenser les performances. Par exemple, les seules expressions supportées dans les templates Polymer sont les négations booléennes et l'appel de simples méthodes. Son implémentation des propriétés calculées n'est pas non plus très flexible.

## Riot

Riot 3.0 fournit un modèle de développement similaire orienté composant (cela est appelé un « tag » dans Riot), avec une API minimaliste mais conçue de manière élégante. Riot et Vue partagent probablement beaucoup de choses dans leur philosophie d'architecture. Cependant, bien qu'étant un peu plus lourd que Riot, Vue offre certains avantages significatifs :

- De meilleures performances. Riot [utilise le DOM](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding) plutôt qu'un DOM virtuel, et par conséquent il souffre des mêmes problèmes de performances que AngularJS.
- Le support d'un outillage plus mature. Vue fournit un support officiel pour [webpack](https://github.com/vuejs/vue-loader) et [Browserify](https://github.com/vuejs/vueify), là où Riot s'appuie sur le soutien de la communauté pour l'intégration de systèmes de build.
