---
title: Conventions
type: style-guide
---

Ceci est le guide des conventions officielles pour du code spécifique à Vue. Si vous utilisez Vue dans vos projets, c'est la référence pour éviter les erreurs, les discussions futiles ou les mauvais usages de code. Nous ne pensons cependant pas qu'un guide de conventions soit pertinent pour toutes les équipes ou tous les projets, aussi nous encourageons les écarts pourvu qu'ils soient éclairés et basés sur vos expériences passées, les technologies que vous côtoyez ainsi que vos valeurs personnelles.

Nous allons en grande partie éviter les conventions à propos du JavaScript ou du HTML en eux-mêmes. Nous ne nous soucions pas de votre utilisation des points-virgules ou de la place de la virgule en début de ligne. Nous ne nous soucierons pas non plus de savoir si votre HTML utilise des apostrophes ou des guillemets pour les valeurs des attributs. Quelques exceptions seront faites cependant, quand nous trouvons qu'une utilisation de code spécifique est utile dans le contexte de Vue.

> **Bientôt, nous fournirons des astuces pour la mise en application.** Même si certains points sont une simple question de discipline, nous essayerons de vous montrer comment utiliser ESLint et d'autres processus automatisés pour mettre simplement en place ces conventions.

Nous avons donc divisé les règles en quatre catégories :



## Catégories de règle

### Priorité A : essentiel

Ces règles aident à éviter les erreurs, donc apprenez-les et respectez-les à tout prix. Des exceptions peuvent exister, mais elles devraient être rares et seulement faites par ceux qui ont une connaissance experte à la fois de JavaScript et de Vue.

### Priorité B : fortement recommandé

Ces règles ont été établies pour améliorer la lisibilité et / ou l'expérience des développeurs dans la majorité des projets. Votre code fonctionnera toujours si vous ne les suivez pas, mais ces écarts doivent être rares et justifiés.

### Priorité C : recommandé

Là où de multiples et équivalentes options existent, un choix arbitraire a été fait pour assurer la consistance. Dans ces règles, nous décrivons chaque option acceptable et suggérons un choix par défaut. Cela signifie que vous pouvez faire des choix différents sur votre propre base de code, aussi longtemps que vous êtes cohérent et avez de bonnes raisons. Mais gardez toujours les bonnes raisons à l'esprit ! En vous alignant sur les standards de la communauté vous :

1. pourrez améliorer votre cerveau à analyser plus facilement la plupart des codes communautaires rencontrés,
2. serez capable de copier et coller la plupart des exemples de code sans modifications,
3. trouverez de nouvelles recrues déjà habituées à votre style de codage préféré, au moins en ce qui concerne Vue.

### Priorité D : faire attention

Certaines fonctionnalités de Vue existent pour régler des cas exceptionnels ou rendre la migration d'une vieille version de code plus simple. Mais utiliser avec excès, elles rendront votre code difficile à maintenir et même deviendront une source de bogues. Ces règles mettent en lumière des fonctionnalités potentiellement risquées, décrivant quand et pourquoi elles doivent être évitées.



## Règles de priorité A : essentiel (prévenir les erreurs)



### Nom de composant à mots multiples <sup data-p="a">essentiel</sup>

**Les noms de composant devraient toujours être des mots multiples, à l'exception du composant racine `App`.**

Ceci afin de [prévenir les conflits](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name) avec des éléments HTML futurs ou existant car toutes les balises HTML n'ont qu'un seul mot.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
Vue.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
Vue.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Données du composant <sup data-p="a">essentiel</sup>

**La propriété `data` doit être une fonction.**

Quand vous utilisez la propriété `data` dans un composant (par ex. partout sauf sur `new Vue`), la valeur doit être une fonction qui retourne un objet.

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Quand la valeur de la propriété `data` est un objet, elle est partagée à travers toutes les instances du composant. Imaginez, par exemple, un composant `TodoList` avec ces données :

``` js
data: {
  listTitle: '',
  todos: []
}
```

Nous pourrions vouloir réutiliser ce composant pour permettre aux utilisateurs de maintenir plusieurs listes (par ex. une liste de course, une liste de souhait, une liste de tâche, etc.). Il y a cependant un problème. Comme toutes les instances du composant font référence au même objet de donnée, changer le titre de l'une des listes va aussi changer le titre de toutes les autres. Et c'est également vrai pour l'ajout, l'édition ou la suppression dans la liste.

À la place, nous voulons que chaque composant instancie ses données pour soi. Pour que cela soit possible, chaque instance doit générer un objet de données unique. En JavaScript, ceci peut être accompli en retournant l'objet depuis une fonction :

``` js
data: function () {
  return {
    listTitle: '',
    todos: []
  }
}
```
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

``` js
export default {
  data: {
    foo: 'bar'
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé
``` js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

``` js
// Dans un fichier `.vue`
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

``` js
// Par contre l'utilisation directe d'un objet est possible dans
// l'instance racine de Vue, car il n'y a qu'une
// instance racine qui existe
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}



### Définitions de prop <sup data-p="a">essentiel</sup>

**Les définitions de prop devraient être aussi détaillées que possible.**

Dans du code acté, les définitions de prop devraient être toujours aussi détaillées que possible, en spécifiant au moins le(s) type(s).

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Les [définitions de prop](https://vuejs.org/v2/guide/components.html#Prop-Validation) détaillées ont deux avantages :

- Elles documentent l'API du composant, il est ainsi possible de voir comment le composant est prévu d'être utilisé.
- En développement, Vue vous avertira si le composant fournit un type de prop incorrectement formaté, vous aidant ainsi à trouver des sources potentielles d'erreur.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
// Ceci est uniquement bon pour le prototypage
props: ['status']
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
props: {
  status: String
}
```

``` js
// Même mieux !
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}



### Des clés pour `v-for` <sup data-p="a">essentiel</sup>

**Toujours utiliser `key` avec `v-for`.**

`key` avec `v-for` est _toujours_ requis sur les composants afin de maintenir l'état des composants internes aligné aux sous-arbres. Même pour les éléments, c'est une bonne pratique pour garder un comportement prédictible pour de la [stabilité d'objet](https://bost.ocks.org/mike/constancy/) dans les animations.

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Imaginons que nous ayons une liste de tâches :

``` js
data: function () {
  return {
    todos: [
      {
        id: 1,
        text: 'Apprendre à utiliser `v-for`'
      },
      {
        id: 2,
        text: 'Apprendre à utiliser `key`'
      }
    ]
  }
}
```

Puis nous les trions par ordre alphabétique. Quand le DOM est mis à jour, Vue optimisera le rendu en exécutant les mutations les moins couteuses possibles dans le DOM. Cela signifie de supprimer le premier élément de la liste, puis de l'ajouter de nouveau à la fin de la liste.

Le problème est qu'il y a des cas où il est important de ne pas supprimer les éléments qui resteront dans le DOM. Par exemple, vous pourriez utiliser `<transition-group>` pour animer un tri de liste, ou garder le focus si l'élément rendu était un `<input>`. Dans ces cas, ajouter une clé unique pour chaque élément (par ex. `:key="todo.id"`) va dire à Vue comment être plus prédictif.

De notre expérience, il est toujours mieux de _toujours_ ajouter une clé unique. De cette manière vous et votre équipe n'aurez jamais à vous soucier des effets de bord. Ensuite, dans les rares scénarios critiques de performances où la stabilité des objets n'est pas nécessaire, vous pourrez faire une exception en connaissance de cause.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}



### Éviter `v-if` avec `v-for` <sup data-p="a">essentiel</sup>

**N'utilisez jamais `v-if` sur le même élément que `v-for`.**

Il y a deux utilisations courantes qui seraient tentantes :

- Pour filtrer des éléments dans une liste (par ex. `v-for="user in users" v-if="user.isActive"`). Dans ce cas, remplacez `users` par ure nouvelle propriété calculée qui retourne votre liste filtrée (par ex. `activeUsers`).

- Pour ne pas faire le rendu d'une liste si elle ne doit pas être affichée (par ex. `v-for="user in users" v-if="shouldShowUsers"`). Dans ce cas, déplacez `v-if` dans un élément englobant (par ex. `ul` ou `ol`).

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Quand Vue transforme les directives, `v-for` a une priorité plus élevée que `v-if`. Ce template :

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

est évalué de manière similaire à :

``` js
this.users.map(function (user) {
  if (user.isActive) {
    return user.name
  }
})
```

Donc même si nous faisons le rendu pour une petite portion d'utilisateurs, nous allons devoir itérer sur la liste à chaque nouveau rendu, que l'état actif de l'utilisateur ait changé ou non.

Ou alors, en itérant sur une propriété calculée, comme ici :

``` js
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
      return user.isActive
    })
  }
}
```

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

nous obtenons les bénéfices suivants :

- La liste filtrée sera _seulement_ réévaluée s'il y a un changement dans le tableau `users`, rendant le filtrage plus performant.
- En utilisant `v-for="user in activeUsers"`, nous itérons sur les utilisateurs _seulement_ pendant le rendu, le rendant plus performant.
- La partie logique est maintenant découplée de la couche présentation, rendant la maintenance (changement, ajout de logique) plus facile.

Nous obtenons des bénéfices similaires en changeant :

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

par :

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

En déplaçant le `v-if` sur un élément englobant, nous ne vérifions plus `shouldShowUsers` pour _chaque_ utilisateur dans la liste. À la place, nous le vérifions une fois et n'évaluons pas  `v-for` si `shouldShowUsers` est `false`.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}



### Style des composants à portée limitée <sup data-p="a">essentiel</sup>

**Pour les applications, le style du niveau `App` au sommet et des composants de mises en page doivent être globaux, mais tous les autres styles des composants devraient être avec une portée limitée au composant.**

Ceci n'est pertinent que pour les [composants monofichiers](../guide/single-file-components.html). Cela _ne_ nécessite _pas_ l'ajout de [l'attribut `scoped`](https://vue-loader.vuejs.org/en/features/scoped-css.html). La portée limitée peut être faite avec les [modules CSS](https://vue-loader.vuejs.org/en/features/css-modules.html), une stratégie basée sur les classes comme [BEM](http://getbem.com/) ou d'autres bibliothèques / conventions du même genre.

**Les composants de bibliothèques, cependant, devraient utiliser une stratégie basée sur les classes plutôt que d'utiliser l'attribut `scoped`.**

Cela permet de surcharger les styles internes facilement, avec des noms de classes lisibles par les humains avec un niveau de spécificité peu élevé qui entre en conflit vraiment très rarement.

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Si vous développez un grand projet, et travaillez avec d'autres développeurs, ou que parfois vous incluez du HTML / CSS tiers (par ex. de Auth0), une portée limitée consistante assurera une application de vos styles uniquement aux composants souhaités.

Au-delà de l'attribut `scoped`, utiliser des noms de classe uniques vous assure que les CSS des bibliothèques tierces ne soient pas appliquées à votre propre HTML. Par exemple, beaucoup de projets utilisent les classes de nom `button`, `btn` ou `icon` donc même si vous n'utilisez pas de stratégie comme BEM, ajouter un préfixe dédié à l'application ou au composant (par ex. `ButtonClose-icon`) peut vous apporter une certaine protection.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<template>
  <button class="button button-close">X</button>
</template>

<!-- Utilisez l'attribut `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">X</button>
</template>

<!-- Utilisez les modules CSS -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">X</button>
</template>

<!-- Utilisez des conventions BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Noms de propriété privé <sup data-p="a">essentiel</sup>

**Utilisez toujours le préfixe `$_` pour les propriétés privées personnalisées dans un plugin, mixin, etc. Cela permet d'éviter les conflits avec le code d'autres développeurs. Il est également possible d’inclure un nom de portée (par ex. `$_yourPluginName_`).**

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Vue utilise le préfixe `_` pour définir ses propres propriétés privées. Aussi utiliser le même préfixe comme (par ex. `_update`) risque d'écraser les propriétés d'instance. Même si vous vérifiez que Vue n'utilise pas actuellement un nom de propriété particulier, il n'y a aucune garantie que le conflit n'apparaisse pas dans des versions futures.

Concernant le préfixe `$`, il est réservé dans l'écosystème Vue à des propriétés spéciales d'instance exposées à l'utilisateur. L'utiliser pour des propriétés _privées_ ne serait pas approprié.

À la place, nous recommandons de combiner les deux préfixes en un `$_`, comme une convention pour définir des propriétés personnelles privées et garantir qu'il n'y ait aucun conflit avec Vue.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
var myGreatMixin = {
  // ...
  methods: {
    update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    _update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_update: function () {
      // ...
    }
  }
}
```

{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update: function () {
      // ...
    }
  }
}
```
{% raw %}</div>{% endraw %}



## Règles de priorité B : fortement recommandé (améliorer la lisibilité)



### Fichier composants <sup data-p="b">fortement recommandé</sup>

**Chaque fois qu'un système de build est disponible pour concaténer les fichiers, chaque composant devrait être dans son propre fichier.**

Ceci aide à trouver plus rapidement un composant quand vous avez besoin de l'éditer ou de vérifier comment il fonctionne.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
{% raw %}</div>{% endraw %}



### Casse des noms de fichier des composants monofichiers <sup data-p="b">fortement recommandé</sup>

**Les noms de fichier des [composants monofichiers](../guide/single-file-components.html) devraient toujours être écrits en PascalCase ou en kebab-case.**

La PascalCase fonctionne mieux avec l'autocomplétion dans des éditeurs de code. Comme ils sont consistants avec la manière dont nous référençons les composants avec du JS(X) et des templates, utilisez-le si possible. Cependant, les casses de noms mixtes (majuscules et minuscules) peuvent parfois créer des problèmes sur des systèmes de fichier non sensibles à la casse. C'est pourquoi la kebab-case est aussi parfaitement acceptable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
{% raw %}</div>{% endraw %}



### Base de nom de composant <sup data-p="b">fortement recommandé</sup>

**Les composants de base (c.-à-d. les composants de présentation, de support ou purement fonctionnels) qui appliquent un style et des conventions spécifiques à l'application devraient tous commencer avec un même préfixe, comme par exemple `Base`, `App`, ou `V`.**

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Ces composants sont les fondations d'un système de style et de comportement consistant pour votre application. Ils doivent **seulement** contenir :

- des éléments HTML,
- d'autres composants préfixés par une base de nom et
- des composants d'interface utilisateur tiers.

Mais ils ne doivent **jamais** contenir un état global (par ex. depuis un store Vuex).

Leurs noms incluent souvent le nom d'un des éléments qu'ils englobent (par ex. `BaseButton`, `BaseTable`), sauf quand aucun élément n'existe pour la tâche qu'ils accomplissent (par ex. `BaseIcon`). Si vous construisez des composants similaires pour un contexte plus spécifique, ils devront toujours utiliser ces composants (par ex. `BaseButton` pourrait être utilisé dans `ButtonSubmit`).

Plusieurs avantages à ces conventions :

- Quand ils sont listés alphabétiquement dans des éditeurs, vos composants de base sont tous listés ensemble, les rendant plus simples à identifier.

- Comme un nom de composant devrait toujours être un nom multiple, cette convention vous aide à ne pas choisir un préfixe arbitraire comme nom de composant encapsulant (par ex. `MyButton`, `VueButton`).

- Et parce que ces composants sont très fréquemment utilisés, vous pourriez vouloir simplement tous les importer pour y avoir accès partout. Un préfixe rend cela possible avec webpack :

  ``` js
  var requireComponent = require.context("./src", true, /^Base[A-Z]/)
  requireComponent.keys().forEach(function (fileName) {
    var baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    var baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    Vue.component(baseComponentName, baseComponentConfig)
  })
  ```

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
{% raw %}</div>{% endraw %}



### Nom des composants à une seule instance <sup data-p="b">fortement recommandé</sup>

**Les composants qui devraient uniquement avoir une seule instance active devraient commencer par le préfixe `The` pour indiquer qu'il ne peut y en avoir qu'un.**

Cela ne signifie pas que le composant doit être utilisé uniquement sur une seule page, mais qu'il ne peut y en avoir qu'_un par page_. Ces composants n'acceptent jamais de props car ils sont spécifiques à votre application et n'ont pas leur propre contexte dans l'application. Si vous ressentez le besoin d'ajouter des props c'est une bonne indication que c'est en fait un composant réutilisable qui n'est utilisé qu'une fois par page _pour le moment_.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

```
components/
|- Heading.vue
|- MySidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
{% raw %}</div>{% endraw %}



### Noms de composants fortement couplés <sup data-p="b">fortement recommandé</sup>

**Les composants qui sont fortement liés à leur parent devraient inclure le nom du parent en tant que préfixe.**

Si un composant n'a de sens que dans le contexte d'un composant parent, cette relation devrait être évidente dans son nom. Puisque les éditeurs organisent les fichiers par ordre alphabétique, cela permet de garder ses fichiers proches les uns des autres.

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Vous pourriez être tenté de résoudre ce problème en rangeant les composants dans des sous-dossiers nommés d'après leur parent. Par exemple :

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

ou :

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Cela n'est pas recommandé car :

- Plusieurs fichiers pourraient avoir des noms similaires, rendant la navigation entre fichiers au sein de l'éditeur de code plus difficile.
- Plusieurs sous dossiers imbriqués augmentent le temps de navigation pour trouver un composant dans la barre de navigation.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
{% raw %}</div>{% endraw %}



### Ordre des mots dans un nom de composant <sup data-p="b">fortement recommandé</sup>

**Les noms de composant devraient commencer avec le mot le plus important en premier et se décliner avec des mots descriptifs.**

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Vous pourriez vous demander :

> « Pourquoi ne pas utiliser l'ordre des mots dans un langage naturel ? »

En anglais natif, les adjectifs et les autres descripteurs apparaissent généralement avant les noms à l'exception des mots de connexion. Par exemple :

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

Vous pouvez inclure ces connecteurs dans le nom de vos composants si vous le souhaitez, mais l'ordre reste important.

Notez également que **ce qui va être considéré comme le mot le plus important est relatif à votre application**. Par exemple, imaginez une application avec un formulaire de recherche. Elle pourrait inclure les composants comme suit :

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Comme vous pouvez le remarquer, il est difficile de voir quels composants sont spécifiques à la recherche. Maintenant, renommons les composants en suivant notre règle :

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Puisque les éditeurs organisent généralement les fichiers par ordre alphabétique, toutes les relations importantes entre les composants sont maintenant évidentes.

Vous pourriez être tenté de résoudre le problème différemment, en imbriquant tous les composants de recherche sous le dossier « search » et tous les composants de paramétrage sous le sous-dossier « settings ». Nous recommandons cette approche seulement pour les applications vraiment très grandes (par ex. avec plus de 100 composants) pour les raisons suivantes :

- Cela prend généralement plus de temps de naviguer à travers des sous-répertoires imbriqués que de défiler à travers un seul répertoire de composants.
- Les conflits de nom (par ex. de multiple composant `ButtonDelete.vue`) rendent la navigation plus difficile pour un composant spécifique dans un éditeur de texte.
- La refactorisation devient plus difficile car le remplacement par recherche n'est pas la seule action requise pour mettre à jour les références vers des composants qui auraient bougé.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
{% raw %}</div>{% endraw %}



### Les composants autofermants <sup data-p="b">fortement recommandé</sup>

**Les composants sans contenu devraient être autofermants dans les [composants monofichiers](../guide/single-file-components.html), les templates de chaine de caractères, et le [JSX](../guide/render-function.html#JSX) : mais jamais dans les templates du DOM.**

Les composants qui sont autofermants n'indiquent pas seulement qu'ils n'ont pas de contenu, mais qu'ils sont **faits** pour ne pas en avoir. C'est la différence entre une page blanche dans un livre et une qui indiquerait « Cette page est intentionnellement vide ». Votre code est aussi plus clair sans balises fermantes inutiles.

Malheureusement, le HTML ne permet pas aux éléments personnalisés d'être autofermant. Seuls les [éléments vides officiels](https://www.w3.org/TR/html/syntax.html#void-elements) peuvent l'être. C'est pourquoi il est possible d'utiliser cette stratégie seulement quand les templates Vue sont compilés avant qu'ils soient injectés dans le DOM. Ensuite du code HTML valide aux spécifications est fourni au DOM.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<!-- Dans les composants monofichiers, les templates avec chaine de caractères et en JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- Dans les templates du DOM -->
<my-component/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<!-- Dans les composants monofichiers, les templates avec chaine de caractères et en JSX -->
<MyComponent/>
```

``` html
<!-- Dans les templates du DOM -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Casse des noms de composant dans les templates <sup data-p="b">fortement recommandé</sup>

**Dans la plupart des projets, les noms de composant devraient toujours être écrits en PascalCase dans les [composants monofichiers](../guide/single-file-components.html) mais en kebab-case pour les templates dans le DOM.**

La PascalCase a plusieurs avantages comparés à la kebab-case :

- Les éditeurs peuvent autocompléter un nom de composant dans les templates car la PascalCase est également utilisée en JavaScript.
- `<MyComponent>` est visuellement plus distinct qu'un élément HTML d'un seul mot comme `<my-component>` car il y a deux caractères de différenciation (les deux capitales) plutôt que juste un (le trait d'union).
- Si vous utilisez des composants personnalisés qui ne sont pas des éléments Vue dans vos templates, comme les Web Composants, la PascalCase vous assure que les composants Vue restent bien différentiables.

Malheureusement, du fait de l'insensibilité à la casse du HTML, les templates du DOM doivent rester en kebab-case.

Notez également que si vous avez déjà largement utilisé la kebab-case de manière consistante avec vos conventions HTML à travers tous vos projets, cela peut être plus important que les avantages listés plus haut. Dans de tels cas, **utiliser la kebab-case partout est également acceptable.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<!-- Dans les composants monofichiers, les templates avec chaine de caractères -->
<mycomponent/>
```

``` html
<!-- Dans les composants monofichiers, les templates avec chaine de caractères -->
<myComponent/>
```

``` html
<!-- Dans les templates du DOM -->
<MyComponent></MyComponent>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<!-- Dans les composants monofichiers, les templates avec chaine de caractères -->
<MyComponent/>
```

``` html
<!-- Dans les templates du DOM -->
<my-component></my-component>
```

OU

``` html
<!-- Partout -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Casse des noms de composant en JS / JSX <sup data-p="b">fortement recommandé</sup>

**Les noms de composant en JS / [JSX](../guide/render-function.html#JSX) devraient toujours être en PascalCase, cependant ils peuvent être en kebab-case à l'intérieur des chaines de caractères pour de simples applications qui utilisent seulement des composants globaux avec `Vue.component`.**

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

En JavaScript, la PascalCase est la convention pour les classes et les prototypes, c.-à-d. tout ce qui peut avoir des instances distinctes. Les composants Vue ont également des instances, donc cela est logique d'utiliser également la PascalCase. De plus, utiliser la PascalCase dans le JSX (et les templates) permet une lecture de code plus simple pour la distinction avec des éléments HTML.

Cependant, pour les applications qui n'utilisent **que** des composants globaux via `Vue.component`, nous recommandons la kebab-case à la place. Les raisons sont :

- Il est rare que les composants globaux soient référencés en JavaScript, donc suivre les conventions du JavaScript a moins de sens.
- Ces applications incluent beaucoup de templates depuis le DOM, où la [kebab-case **doit** être utilisée](#Casse-des-noms-de-composant-dans-les-templates-fortement-recommande).

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
Vue.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
Vue.component('MyComponent', {
  // ...
})
```

``` js
Vue.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Nom de composant avec mot complet <sup data-p="b">fortement recommandé</sup>

**Les noms de composant devraient préférer des mots complets à des abréviations.**

L'autocomplétion dans les éditeurs rend le cout d'un long nom de composant insignifiant alors que la clarté qu'il amène est sans valeur. Les abréviations non communes, en particulier, sont à éviter.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
{% raw %}</div>{% endraw %}



### Casse des noms de prop <sup data-p="b">fortement recommandé</sup>

**Les noms de prop devraient toujours utiliser la camelCase lors de leur déclaration, mais la kebab-case dans les templates et les [JSX](../guide/render-function.html#JSX).**

Nous suivons simplement les conventions de chaque langage. Dans le JavaScript, la camelCase est plus naturelle. Dans le HTML, c'est la kebab-case.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
props: {
  'greeting-text': String
}
```

``` html
<WelcomeMessage greetingText="hi"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
{% raw %}</div>{% endraw %}



### Éléments avec attributs multiples <sup data-p="b">fortement recommandé</sup>

**Des éléments avec de multiples attributs devraient occuper plusieurs lignes, avec un attribut par ligne.**

En JavaScript, scinder les objets avec de multiples propriétés sur plusieurs lignes est largement considéré comme une bonne convention, car cela rend le code plus facile à lire. Nos templates et [JSX](../guide/render-function.html#JSX) suivent les mêmes règles.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
{% raw %}</div>{% endraw %}



### Expressions simples dans les templates <sup data-p="b">fortement recommandé</sup>

**Les templates de composant devraient seulement inclure de simples expressions, avec les expressions les plus complexes refactorisées dans des propriétés calculées ou des méthodes.**

Les expressions complexes dans vos templates les rendent moins déclaratifs. Nous devrions voir _ce qui_ devrait apparaitre, et non _comment_ cette valeur est calculée. Les propriétés calculées et les méthodes permettent également de rendre le code réutilisable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<!-- In a template -->
{{ normalizedFullName }}
```

``` js
// L'expression complexe a été bougée dans une propriété calculée
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```
{% raw %}</div>{% endraw %}



### Propriétés calculées simples <sup data-p="b">fortement recommandé</sup>

**Les propriétés calculées complexes devraient être scindées en plusieurs propriétés plus simples autant que possible.**

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Les propriétés calculées simples et bien nommées sont :

- __Plus facile à tester__

  Quand chaque propriété calculée contient seulement une expression simple, avec peu de dépendances, il est plus facile d'écrire des tests pour confirmer qu'elles fonctionnent correctement.

- __Plus facile à lire__

  Simplifier les propriétés calculées vous force à donner à chaque valeur un nom descriptif, même si elle ne sera pas réutilisée. Cela permet aux autres développeurs (et vous dans le futur) de plus facilement vous concentrer sur le code qui vous intéresse et de ne pas vous soucier du reste.

- __Plus adaptable aux changements__

  N'importe quelle valeur qui peut être nommée pourra être utile pour la vue. Par exemple, nous pourrions décider d'afficher un message expliquant à l'utilisateur combien d'argent ils ont économisé. Nous pourrions décider de calculer les taxes de vente associées, mais peut-être de les afficher indépendamment au lieu qu'elle soit une partie du prix final.

  Des propriétés calculées courtes et spécifiques permettent plus de liberté sur la manière dont les informations seront utilisées ce qui nécessite moins de refactorisation en cas de changements.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```
{% raw %}</div>{% endraw %}



### Valeur d'attribut entre guillemets <sup data-p="b">fortement recommandé</sup>

**Les attributs HTML non vides devraient toujours être entre guillemets (ou apostrophe, celui qui n'est pas utilisé dans le JS).**

Alors que les valeurs d'attributs sans espaces ne sont pas requises en HTML, cela les mène à ne _jamais_ mettre d'espace, laissant place à des valeurs moins lisibles.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
{% raw %}</div>{% endraw %}



### Abréviations de directive <sup data-p="b">fortement recommandé</sup>

**Les abréviations de directive (`:` pour `v-bind:` et `@` pour `v-on:`) devraient toujours être utilisées ou jamais.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

``` html
<input
  @input="onInput"
  @focus="onFocus"
>
```

``` html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```
{% raw %}</div>{% endraw %}




## Règles de priorité C : recommandé (minimiser les choix arbitraires et la surcharge cognitive)



### Ordre des options de composants / instances <sup data-p="c">recommandé</sup>

**Les options des instances / composants devraient être ordonnées avec consistance.**

Voici l'ordre par défaut que nous recommandons pour les options de composant. Elles sont séparées en catégories ainsi vous saurez où ajouter vos nouvelles propriétés pour vos plugins.

1. **Effets de bord** (créer des effets en dehors du composant)
  - `el`

2. **Informations globales** (nécessite des connaissances au-delà du composant)
  - `name`
  - `parent`

3. **Type de composant** (change le type du composant)
  - `functional`

4. **Modificateurs de template** (change la manière dont les templates sont compilés)
  - `delimiters`
  - `comments`

5. **Dépendances des templates** (les ressources utilisées dans le template)
  - `components`
  - `directives`
  - `filters`

6. **Composition** (fusionner des propriétés dans les options)
  - `extends`
  - `mixins`

7. **Interface** (interface du composant)
  - `inheritAttrs`
  - `model`
  - `props` / `propsData`

8. **État local** (propriétés réactives locales)
  - `data`
  - `computed`

9. **Évènements** (fonctions de rappel déclenchées par des évènements réactifs)
  - `watch`
  - Évènements du cycle de vie (dans leur ordre d'appel)
    - `beforeCreate`
    - `created`
    - `beforeMount`
    - `mounted`
    - `beforeUpdate`
    - `updated`
    - `activated`
    - `deactivated`
    - `beforeDestroy`
    - `destroyed`

10. **Propriétés non réactives** (propriétés d'instance indépendantes du système de réactivité)
  - `methods`

11. **Rendu** (description déclarative de la sortie du composant)
  - `template` / `render`
  - `renderError`



### Ordre des attributs des éléments <sup data-p="c">recommandé</sup>

**Les attributs d'éléments (incluant les composants) devraient être ordonnés avec consistance.**

Voici l'ordre par défaut que nous recommandons pour les options de composant. Elles sont séparées en catégories, ainsi vous saurez où ajouter vos attributs et directives personnalisées.

1. **Définition** (fournit les options du composant)
  - `is`

2. **Rendu de liste** (crée des variations multiples du même élément)
  - `v-for`

3. **Conditions** (comment l'élément est rendu / affiché)
  - `v-if`
  - `v-else-if`
  - `v-else`
  - `v-show`
  - `v-cloak`

4. **Modificateurs de rendu** (change la manière de faire le rendu de l'élément)
  - `v-pre`
  - `v-once`

5. **Attention globale** (nécessite des connaissances au-delà du composant)
  - `id`

6. **Attributs uniques** (attributs nécessitant une valeur unique)
  - `ref`
  - `key`
  - `slot`

7. **Liaison bidirectionnelle** (combiner les liaisons descendantes et les évènements montants)
  - `v-model`

8. **Autres attributs** (tous les attributs qui sont liés ou non liés)

9. **Évènements** (gestionnaire d'évènement de composant)
  - `v-on`

10. **Contenu** (écrase le contenu d'un élément)
  - `v-html`
  - `v-text`



### Ligne vide dans les options d'instance / de composant <sup data-p="c">recommandé</sup>

**Vous pourriez ajouter une ligne vide entre de multiples propriétés, en particulier si la longueur de votre option dépasse la taille de l'écran.**

Quand les composants commencent à devenir difficile à lire, ajouter des espaces entre des propriétés sur plusieurs lignes peut les rendre de nouveau simples à lire. Dans divers éditeurs, comme Vim, formater les options ainsi peut rendre la navigation plus simple avec le clavier.

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue: function () {
    // ...
  },

  inputClasses: function () {
    // ...
  }
}
```

``` js
// Sans espaces, c'est bien aussi, du moment que le composant
// reste simple à lire et à parcourir.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue: function () {
    // ...
  },
  inputClasses: function () {
    // ...
  }
}
```
{% raw %}</div>{% endraw %}



### Ordre des balises principales des composants monofichiers <sup data-p="c">recommandé</sup>

**[Les composants monofichiers](../guide/single-file-components.html) devraient toujours ordonner de manière consistante les balises `<script>`, `<template>`, et `<style>`, avec `<style>` en dernier, car au moins l'un des deux autres est toujours nécessaire.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

``` html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}



## Règles de priorité D : faire attention (potentiellement dangereux)



### `v-if` / `v-else-if`/ `v-else` sans `key` <sup data-p="d">faire attention</sup>

**Il est généralement préférable d'utiliser `key` avec `v-if` + `v-else`, si les éléments sont de même type (c.-à-d. avec deux éléments `<div>` par ex.).**

Par défaut, Vue met à jour le DOM aussi efficacement que possible. Cela signifie que quand il commute entre deux éléments de même type, il va simplement modifier l'élément existant, plutôt que de l'enlever et d'en ajouter un nouveau à la place. Cela peut avoir des [effets non souhaités](https://jsfiddle.net/chrisvfritz/bh8fLeds/) si ces éléments ne doivent pas être considérés comme les mêmes.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<div v-if="error">
  Error: {{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<div
  v-if="error"
  key="search-status"
>
  Error: {{ error }}
</div>
<div
  v-else
  key="search-results"
>
  {{ results }}
</div>
```

``` html
<p v-if="error">
  Error: {{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}



### Sélecteurs par nom de balise avec `scoped` <sup data-p="d">faire attention</sup>

**Les sélecteurs par nom de balise devraient être évités avec `scoped`.**

Préférez les sélecteurs de classes plutôt que les sélecteurs de nom dans des styles `scoped` car utiliser un nombre important de sélecteurs par nom de balise est lent.

{% raw %}
<details>
<summary>
  <h4>Explication détaillée</h4>
</summary>
{% endraw %}

Dans les styles avec portée, Vue ajoute un attribut unique à l'élément du composant, comme `data-v-f3f3eg9`. Les sélecteurs sont ainsi modifiés afin qu'ils ne concordent qu'avec les éléments dont l'attribut est sélectionné (par ex. `button[data-v-f3f3eg9]`).

Le problème est qu'utiliser un grand nombre de [sélecteur par nom]((http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (par ex. `button[data-v-f3f3eg9]`) va être considérablement plus lent que [par attribut classe](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (par ex. `.btn-close[data-v-f3f3eg9]`) et donc les sélecteurs par classes devraient être préférés autant que possible.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` html
<template>
  <button>X</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Communication parent-enfant implicite <sup data-p="d">faire attention</sup>

**Les évènements et props devraient être préférés pour la communication entre composants parent-enfant, au lieu de l'utilisation de `this.$parent` ou la mutation des props.**

Une application Vue idéale est une application où les props descendent et où les évènements remontent. Rester dans cette convention rend vos composants plus simples à comprendre. Cependant, il y a quelques cas où la mutation des props ou `this.$parent` peut simplifier l'utilisation de deux composants qui sont fortement couplés.

Le problème est qu'il y a beaucoup de _cas simples_ où leur utilisation offre de la facilité. Attention : ne vous laissez pas séduire par une apparente simplicité (être capable de comprendre le flux de votre état) pour une vision court-termiste (écrire moins de code).

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: '<input v-model="todo.text">'
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeTodo () {
      var vm = this
      vm.$parent.todos = vm.$parent.todos.filter(function (todo) {
        return todo.id !== vm.todo.id
      })
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}



### Non-gestion de l'état par flux <sup data-p="d">faire attention</sup>

**[Vuex](https://github.com/vuejs/vuex) devrait être préféré pour une gestion globale d'état à la place de `this.$root` ou d'un canal global d'évènement.**

Gérer l'état avec `this.$root` et / ou utiliser un [canal d'évènement global](https://fr.vuejs.org/v2/guide/migration.html#dispatch-et-broadcast-remplaces) peut faciliter la tâche dans des cas vraiment simples. Cependant cela n'est pas approprié pour la plupart des applications. Vuex n'offre pas seulement une place centrale pour gérer l'état mais également des outils pour organiser, tracer et déboguer les changements d'états.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### À éviter

``` js
// main.js
new Vue({
  data: {
    todos: []
  },
  created: function () {
    this.$on('remove-todo', this.removeTodo)
  },
  methods: {
    removeTodo: function (todo) {
      var todoIdToRemove = todo.id
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== todoIdToRemove
      })
    }
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Recommandé

``` js
// store/modules/todos.js
export default {
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

``` html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: mapActions(['removeTodo'])
}
</script>
```
{% raw %}</div>{% endraw %}



{% raw %}
<script>
(function () {
  var enforcementTypes = {
    none: '<span title="Il n\'y a malheureusement aucun moyen de forcer ces règles.">auto discipline</span>',
    runtime: 'runtime error',
    linter: '<a href="https://github.com/vuejs/eslint-plugin-vue#eslint-plugin-vue" target="_blank" rel="noopener noreferrer">plugin:vue/recommended</a>'
  }
  Vue.component('sg-enforcement', {
    template: '\
      <span>\
        <strong>Forçage</strong>:\
        <span class="style-rule-tag" v-html="humanType"/>\
      </span>\
    ',
    props: {
      type: {
        type: String,
        required: true,
        validate: function (value) {
          Object.keys(enforcementTypes).indexOf(value) !== -1
        }
      }
    },
    computed: {
      humanType: function () {
        return enforcementTypes[this.type]
      }
    }
  })

  // new Vue({
  //  el: '#main'
  // })
})()
</script>
{% endraw %}
