---
title: Migration depuis Vue 1.x
type: guide
order: 26
---

## F.A.Q.

> Wow ! C'est une super longue page ! Est-ce que ça veut dire que la version 2.0 est complètement différente, que je vais devoir ré-apprendre les bases depuis le début, et que la migration est pratiquement impossible ?

<p>Ravi que vous posiez la question ! La réponse est non. Environ 90% de l'API reste la même et le cœur des concepts reste inchangé. C'est long car nous avons voulu offrir des explications très détaillées et inclure beaucoup d'exemples. Et soyez rassuré(e), __cette page n'est pas quelque chose que vous devez lire complètement de haut en bas !__</p>

> Comment dois-je m'y prendre pour commencer ma migration ?

1. Commencez par lancer l'[outil d'aide à la migration](https://github.com/vuejs/vue-migration-helper) sur un projet courant. Nous avons soigneusement minifié et compressé un développement Vue dans une simple interface en ligne de commande. À chaque fois qu'il va reconnaître une fonctionnalité obsolète, il va vous le faire savoir, vous offrir des suggestions et vous fournir des liens pour plus d'informations.

2. Après cela, naviguez à travers la table de contenu de cette page dans la barre de navigation. Si vous voyez un sujet qui vous concerne, mais que l'outil d'aide à la migration n'a pas repéré, occupez-vous en.

3. Si vous avez des cas de test, exécutez les et voyez ce qui ne fonctionne plus et échoue. Si vous n'avez pas de cas de test, ouvrez simplement votre application dans votre navigateur et garder un œil sur les avertissements et erreurs que vous trouverrez en faisant un tour de l'application.

4. Maintenant, votre application devrait être pleinement migrée. Si vous n'êtes toujours pas satisfait de divers points, vous pouvez lire le reste de cette page (ou juste plonger dans le nouveau [guide de démarrage](index.html)). Beaucoup de partie seront vite parcourue puisque vous êtes familier aux concepts de base.

> Combien de temps va prendre la migration d'une application Vue 1.x vers une application Vue 2.0 ?

Cela dépend de plusieurs critères comme :

- de la taille de votre application (de petite à moyenne, cela vous prendra probablement moins d'un jour),

- de combien de fois vous êtes distrait et que vous commencez à jouer avec une nouvelle fonctionnalité cool (😉 Pas de jugement, ça nous est arrivé à nous pendant la construction de la version 2.0),

- du nombre de fonctionnalités obsolètes que vous utilisez. La plupard d'entre elles peuvent être corrigé avec une action de type trouver-remplacer (« find-and-replace »), mais d'autres peuvent prendre quelques minutes. Si vous ne suivez actuellement pas les meilleures pratiques, Vue 2.0 vous forcera encore plus à les respecter. Cela est une bonne chose sur le long terme, mais signifie également de refactoriser (un peu tard) des parties.

> Si je mets à jour vers Vue 2, dois-je aussi mettre à jour Vuex et Vue-Router ?

Seul Vue-Router 2 est compatible avec Vue 2, donc oui, vous allez devoir suivre le [guide de migration pour Vue-Router](migration-vue-router.html) également. Heureusement, un grand nombre d'applications n'ont pas beaucoup de code en lien avec le routeur, cela ne devrait donc pas prendre plus d'une heure.

En ce qui concerne Vuex, la version 0.8 est compatible avec Vue 2, vous n'êtes donc pas obligé de le mettre à jour. La seule raison pour que vous souhaitiez faire la mise à jour dès maintenant serait de tirer partie des nouvelles fonctionnalités de Vuex 2, comme les modules ou des codes pré-conçus (« boilerplate ») moins verbeux.

## Templates

### Instances fragmentées <sup>retirées</sup>

Tous les composants doivent avoir seulement un seul élément racine. Les instances fragmentées ne sont plus permises. Si vous aviez un template comme ceci :

``` html
<p>foo</p>
<p>bar</p>
```

Il est recommandé de simplement d'entourer le contenu complet dans un nouvel élément, comme cela :

``` html
<div>
  <p>foo</p>
  <p>bar</p>
</div>
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez votre suite de test ou votre application après mise à jour et vérifiez les <strong>avertissements de console</strong> à propos d'éléments multiple à la racine dans un template.</p>
</div>
{% endraw %}

## Hooks de cycle de vie

### `beforeCompile` <sup>retiré</sup>

Utilisez le hook `created` à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver toutes les occurences de ce hook.</p>
</div>
{% endraw %}

### `compiled` <sup>remplacé</sup>

Utilisez le hook `mounted` à la place.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver toutes les occurences de ce hook.</p>
</div>
{% endraw %}

### `attached` <sup>retiré</sup>

Utiliser une vérification du DOM dans les autres hooks. Par exemple, remplacez :

``` js
attached: function () {
  doSomething()
}
```

par :

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver toutes les occurences de ce hook.</p>
</div>
{% endraw %}

### `detached` <sup>retiré</sup>

Utiliser une vérification du DOM dans les autres hooks. Par exemple, remplacez :

``` js
detached: function () {
  doSomething()
}
```

par :

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver toutes les occurences de ce hook.</p>
</div>
{% endraw %}

### `init` <sup>renommé</sup>

Utilisez le nouveau hook `beforeCreate` à la place. Il fait la même chose. Il a été renommé pour plus de consistence avec les autres méthodes du cycle de vie.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver toutes les occurences de ce hook.</p>
</div>
{% endraw %}

### `ready` <sup>remplacé</sup>

Utilisez le hook `mounted` à la place. Il est a noté qu'avec `mounted`, il n'y a aucune garanti de présence dans le document (DOM réel). Pour s'en assurer, il faut inclure `Vue.nextTick` / `vm.$nextTick`. Par exemple :

``` js
mounted: function () {
  this.$nextTick(function () {
    // code vous assurant que `this.$el` est dans le document.
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver toutes les occurences de ce hook.</p>
</div>
{% endraw %}

## `v-for`

### Ordre des arguments de `v-for` pour les tableaux <sup>changé</sup>

Quand vous utilisiez un `index`, l'ordre des arguments pour les tableaux était `(index, value)`. Cet ordre est maintenant `(value, index)` pour plus de consistance avec les méthodes natives des tableaux JavaScript comme `forEach` et `map`.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'ordre des arguments obsolètes. Notez que si le nom de votre index est quelque chose de non habituel comme <code>position</code> ou <code>num</code>, l'outil d'aide ne les trouvera pas.</p>
</div>
{% endraw %}

### Ordre des arguments de `v-for` pour les objets <sup>changé</sup>

Quand vous utilisez une `key`, l'ordre des arguments pour les objets était `(key, value)`. Cet ordre est maintenant `(value, key)` pour plus de consistance avec les itérateurs d'objet communs comme lodash.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples d'ordre des arguments obsolètes. Notez que si le nom de votre clé est quelque chose comme <code>name</code> ou <code>property</code>, l'outil d'aide ne les trouvera pas.</p>
</div>
{% endraw %}

### `$index` et `$key` <sup>retirés</sup>

Les variables implicites `$index` et `$key` ont été enlevée à la faveur de leur définition explicite dans `v-for`. Ceci rend le code plus simple à lire pour les développeurs moins expérimentés avec Vue. Il en résulte également des comportements plus prévisible dans les cas de boucles imbriquées.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences de ces variables retirées. Si vous en oubliez certaine, vous devriez voir des <strong>erreurs console</strong> comme <code>Uncaught ReferenceError: $index is not defined</code>.</p>
</div>
{% endraw %}

### `track-by` <sup>remplacé</sup>

`track-by` a été remplacé par `key`. Il fonctionne comme n'importe quel autre attribut : avec ou sans les préfixes `v-bind:` ou `:` il est traité comme une chaîne de caractères standard. Dans la plupard des cas, vous souhaiterez une liaison dynamique demandant une expression à la place d'une clé. Par exemple, à la place de :

``` html
<div v-for="item in items" track-by="id">
```

vous aurez maintenant :

``` html
<div v-for="item in items" v-bind:key="item.id">
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences de <code>track-by</code>.</p>
</div>
{% endraw %}

### `v-for` et nombres <sup>changé</sup>

Précedemment, `v-for="number in 10"` devait avoir `number` qui commençait à `0` et qui finissait à `9`. Maintenant il commence à `1` et finit à `10`.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Cherchez dans votre code avec l'expression régulière <code>/\w+ in \d+/</code>. Partout ou cette expression sort dans du code <code>v-for</code>, vérifiez si cela vous affecte.</p>
</div>
{% endraw %}

## Props

### Option de prop `coerce` <sup>retirée</sup>

Si vous voulez coercer une prop, mettez en place une propriété calculée basée dessus. Par exemple au lieu de :

``` js
props: {
  username: {
    type: String,
    coerce: function (value) {
      return value
        .toLowerCase()
        .replace(/\s+/, '-')
    }
  }
}
```

utilisez plutôt :

``` js
props: {
  username: String,
},
computed: {
  normalizedUsername: function () {
    return this.username
      .toLowerCase()
      .replace(/\s+/, '-')
  }
}
```

Cela a plusieurs avantages :

- Vous avez toujours accès à la valeur originale de la prop.
- Vous êtes obligé d'être plus explicite en donnant à la valeur coercée un nom différent de la valeur passée dans la prop.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences de l'option <code>coerce</code>.</p>
</div>
{% endraw %}

### Option de prop `twoWay` <sup>retirée</sup>

Les props sont maintenant toujours unidirectionnelle et descendante. Pour produire une modification dans la portée parente, un composant a besoin d'explicitement emettre un évènement au lieu de créer une liaison implicite. Pour plus d'informations, consultez :

- [Événements de composant personnalisés](components.html#Evenements-personnalises)
- [Composants de champ de formulaire personnalisés](components.html#Composants-de-champ-de-formulaire-utilisant-les-evenements-personnalises) (utilisant les événements de composant)
- [Gestion de l'état global](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences de l'option <code>twoWay</code>.</p>
</div>
{% endraw %}

### Modificateur `.once` et `.sync` de `v-bind` <sup>retiré</sup>

Les props sont maintenant toujours unidirectionnelle et descendante. Pour produire une modification dans la portée parente, un composant a besoin d'explicitement emettre un évènement au lieu de créer une liaison implicite. Pour plus d'informations, consultez :

- [Événements de composant personnalisés](components.html#Evenements-personnalises)
- [Composants de champ de formulaire personnalisés](components.html#Composants-de-champ-de-formulaire-utilisant-les-evenements-personnalises) (utilisant les événements de composant)
- [Gestion de l'état global](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences des modificateurs <code>.once</code> et <code>.sync</code>.</p>
</div>
{% endraw %}

### Mutation de prop <sup>déprécié</sup>

Muter une prop localement est maintenant considéré comme un anti-pattern, c.-à-d. déclarer une prop et l'affecter ainsi `this.myProp = 'someOtherValue'` dans le composant. À cause du nouveau mécanisme de rendu, à chaque nouveau rendu du composant parent, les variables locales du composant enfant seront ré-écrites.

Dans la majorité des cas, muter une prop peut être remplacé par une de ces solutions :

- une propriété de donnée, avec la valeur de la prop utilisée comme valeur par défaut
- une propriété calculée

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez votre suite de test ou votre application après mise à jour et vérifiez les <strong>avertissements de console</strong> à propos des mutations du prop.</p>
</div>
{% endraw %}

### `props` sur l'instance racine <sup>remplacée</sup>

Sur une instance racine de Vue (c.-à-d. crée avec `new Vue({ ... })`), vous devez utilisez `propsData` à la place de `props`.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez votre suite de test si vous en avez. Les <strong>tests en échec</strong> devraient vous alerter du fait que les props de l'instance racine ne sont plus passées.</p>
</div>
{% endraw %}

## Propriétés calculées

### `cache: false` <sup>dépréciée</sup>

L'invalidation de cache pour les propriétés calculées va être retiré dans les futures versions majeures de Vue. Remplacez toute les propriétés calculées non avec invalidation de cache par des méthodes, cela produira le même résultat.

Pan exemple :

``` js
template: '<p>message : {{ timeMessage }}</p>',
computed: {
  timeMessage: {
    cache: false,
    get: function () {
      return Date.now() + this.message
    }
  }
}
```

Devient dans une méthode :

``` js
template: '<p>message : {{ getTimeMessage }}</p>',
methods: {
  getTimeMessage: function () {
    return Date.now() + this.message
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences de l'option <code>cache: false</code>.</p>
</div>
{% endraw %}

## Directives pré-conçues

### Évaluation à vrai ou faux avec `v-bind` <sup>changée</sup>

Quand elles sont utilisées dans `v-bind`, seule les valeurs `null`, `undefined` et `false` sont évaluées à `false`. Cela signifie que `0` ou une chaîne vide sera rendue à vrai. Donc par exemple `v-bind:draggable="''"` va donner  `draggable="true"`.

Pour les attributs énumérés, en plus des valeurs précédentes évaluées à `false`, la chaîne de caractères `"false"` sera aussi rendue comme `attr="false"`.

<p class="tip">Notez que pour les autres directives (par ex. `v-if` et `v-show`), l'évaluation JavaScript normale est utilisée.</p>

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez votre suite de test si vous en avez. Les <strong>tests en échec</strong> devraient vous alerter si des parties de votre application sont affectée par ce changement.</p>
</div>
{% endraw %}

### Écoute des évènements natifs sur les composants avec `v-on` <sup>changé</sup>

Quand vous utilisez un composant, `v-on` n'écoutera que les évènements `$emit` émis par ce composant. Pour écouter les évènements natifs du DOM sur l'élément racine, vous devez utiliser le modificateur `.native`. Par exemple :

``` html
<my-component v-on:click.native="doSomething"></my-component>
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez votre suite de test si vous en avez. Les <strong>tests en échec</strong> devraient vous alerter si des parties de votre application sont affectée par ce changement.</p>
</div>
{% endraw %}

### Paramètre d'attribut `debounce` pour `v-model` <sup>retiré</sup>

Une fonction de rétention (« debounce ») est utilisée pour limiter le nombre de fois qu'une fonction a opérations lourdes est exécutée a une fois. L'attribut `debounce` pour le paramètre `v-model` est taillé pour des cas simples, mais en fait il fait la rétention des __mises à jour d'état__ plutôt que des opérations lourdes elles-même. C'est une différence subtile, mais cela amène des limitations quand l'application grandit.

Ces limitations peuvent être mise en évidence avec un indicateur de recherche, comme celui de cet exemple :

{% raw %}
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo" class="demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
<script>
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Recheche de nouveaux résultats'
      } else if (this.searchQueryIsDirty) {
        return '... Frappe en cours'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
</script>
{% endraw %}

Utiliser l'attribut `debounce` ne donne aucun moyen de détecter l'état « ... Frappe en cours » car nous perdons l'accès à l'état en temps réel du champ. En découplant la fonction `debounce` de Vue cependant, nous sommes capable de faire la rétention seulement des opérations que nous souhaitons limiter, enlevant ainsi l'utilité de la fonctionnalité interne :

``` html
<!--
En utilisant la fonction `debounce` de loadash ou d'une autre
bibliothèque dédiée, nous savons que l'implémentation spécifique
de `debounce` sera la meilleure possible et sera utilisable partout.
Pas seulement dans nos templates.
-->
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
```

``` js
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    // C'est ici que la fonction `debounce` est actuellement utilisée.
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
```

Un autre avantage de cette approche est que parfois la rétention n'est pas la méthode de limitation d'exécution la plus appropriée. Par exemple, quand vous intérogez une API pour des suggestions de recherche, attendre que l'utilisateur se soit arrêter de taper pour commencer à lui offrir des sugestions n'est pas une expérience utilisateur idéale. Ce que vous souhaiteriez probablement à la place est une fonction de découplage (« throttle »). Maintenant, avec l'utilisation d'une bibliothèque comme loadash, refactoriser le code en utilasant la fonction `throttle` ne prend que quelques secondes.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences du paramètre d'attribut <code>debounce</code>.</p>
</div>
{% endraw %}

### Paramètre d'attribut `lazy` ou `number` pour `v-model` <sup>remplacé</sup>

Les paramètres d'attribut `lazy` et `number` sont maintenant des modifcateurs, pour rendre cela plus clair. Cela signifie que au lieu de :

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

Nous utiliserons :

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences des paramètres d'attributs <code>lazy</code> ou <code>number</code>.</p>
</div>
{% endraw %}

### Attribut `value` avec `v-model` <sup>retiré</sup>

`v-model` ne se préoccupe plus de la valeur initiale de l'attribut `value`. Pour plus de prédictabilité, il utilisera toujours la donnée utilisée dans l'instnace de Vue comme source de vérité.

Cela signifie que cet élément :

``` html
<input v-model="text" value="foo">
```

lié par cette donnée :

``` js
data: {
  text: 'bar'
}
```

va être rendu avec une valeur à `"bar"` au lieu de `"foo"`. La même chose se passe pour les `<textarea>` avec du contenu existant. Au lieu de :

``` html
<textarea v-model="text">
  hello world
</textarea>
```

vous devrez vous assurer que la valeur initiale pour `text` est `"hello world"`.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez votre suite de test ou votre application après mise à jour et vérifiez les <strong>avertissements de console</strong> à propos d'éléments des valeurs de l'attribut <code>value</code> avec <code>v-model</code>.</p>
</div>
{% endraw %}

### Itération de valeur primitive avec `v-model` et `v-for` <sup>retiré</sup>

Les cas de figure comme celui-ci ne fonctionnent plus :

``` html
<input v-for="str in strings" v-model="str">
```

La raison est que le JavaScript équivalent après compilation de `<input>` est :

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

Comme vous pouvez le voir, la liaison bidirectionnelle de `v-model` n'a plus de sens ici. Définir `str` avec une autre valeur dans une fonction itérateur ne fera rien car ça ne sera qu'une variable locale dans la portée de la fonction.

À la place, vous pouriez utiliser un tableau d'__objet__ et ainsi `v-model` poura mettre à jour le champ avec l'objet. Par exemple :

``` html
<input v-for="obj in objects" v-model="obj.str">
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez votre suite de test si vous en avez. Les <strong>tests en échec</strong> devraient vous alerter si des parties de votre application sont affectée par ce changement.</p>
</div>
{% endraw %}

### `v-bind:style` avec la syntaxe objet et `!important` <sup>retiré</sup>

Ceci ne fonctionne plus :

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hello</p>
```

Si vous voulez vraiment ré-écrire un autre `!important`, vous devrez utiliser la syntaxe de chaîne de caratères :

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hello</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences des liaisons de style avec <code>!important</code>.</p>
</div>
{% endraw %}

### `v-el` et `v-ref` <sup>remplacés</sup>

Pour plus de simplicité, `v-el` et `v-ref` ont été fusionné en l'attribut `ref`, accessible depuis l'instnace d'un composant via `$refs`. Cela signifie que `v-el:my-element` devient `ref="myElement"` et que `v-ref:my-component` devient `ref="myComponent"`. Quand il est utilisé sur un élément normal, le `ref` se réfère à l'élément du DOM, et quand il est utilisé sur un composant, le `ref` se réfère à l'instance du composant.

Puisque `v-ref` n'est plus une directive, mais un attribut spéciale, il peut également être défini dynamiquement. Cela spécialement utile avec `v-for`. Par exemple :

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

Précédemment, `v-el` / `v-ref` utilisé avec un `v-for` produisait un tableau d'éléments ou de composants, car il n'y avait aucun moyen de donner un nom unique à chaque élément. Vous pouvez toujours reproduire ce comportement en donnant à chaque élément la même `ref` :

``` html
<p v-for="item in items" ref="items"></p>
```

À la diférence de la 1.x, les `$refs` ne sont pas réactive, car elles sont enregistrées / mises à jour durant le processus de rendu lui-même. Les rendres ré-active demanderait de dupliquer le rendu à chaque changement.

D'un autre côté, `$refs` est conçu avant tout pour un accès programmatique en JavaScript, il n'est donc pas recommandé de les relier dans les templates, car cela signifierait de se référer à un état qui n'est plus en phase avec l'instance elle même. Cela violerait le vue-modèle piloté par les données de Vue.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences de <code>v-el</code> ou de <code>v-ref</code>.</p>
</div>
{% endraw %}

### `v-else` avec `v-show` <sup>retiré</sup>

`v-else` n'est plus supporté avec `v-show`. Utilisez `v-if` avec une expression négative à la place. Par exemple, au lieu de :

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">Pas foo, mais bar</p>
```

You can use:

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">Pas foo, mais bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des occurences de <code>v-else</code> avec <code>v-show</code>.</p>
</div>
{% endraw %}

## Directives pesonnalisées <sup>simplifiée</sup>

Les directives ont une portée de responsabilité grandement réduite : elles sont maintenant uniquement utilisée pour appliquer des manipulation de DOM à bas niveau. Dans la plupard des cas, vous devriez préférez des composants comme abstraction principale de code réutilisable.

Certaine des différences les plus notables inclues :

- Les directives n'ont plus d'instances. Cela signifie qu'il n'y a plus de `this` dans les hooks des directives. À la place, elles reçoivent tout ce dont elles ont besoin en tant qu'arguments. Si vraiment vous devez faire persister des états à travers les hooks, vous pouvez le faire avec `el`.
- Les options comme `acceptStatement`, `deep`, `priority`, etc. ont toutes été retirées. Pour remplacer les directives `twoWay`, consultez [cette exemple](#filtres-bidirectionnelles-replacés).
- Certains des hooks ont un comportement différent. D'autres hooks sont nouveaux.

Heureusement, puisque les nouvelles directives sont plus simples, vous pouvez les maîtriser plus facilement. Lisez le nouveau [guide des directives](custom-directive.html) pour en apprendre plus.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de directives définies. L'outil d'aide va toutes vous les pointers, comme dans la plupard des cas vous allez devoir les refactoriser dans un composant.</p>
</div>
{% endraw %}

### Modificateur de directive `.literal` <sup>retiré</sup>

Le modificateur `.literal` a été supprimé, la même chose peut être facilement réalisée en fournissant une chaine de caractères litérale en tant que valeur.

Par exemple, vous pouvez mettre à jour :

``` js
<p v-my-directive.literal="foo bar baz"></p>
```

avec :

``` html
<p v-my-directive="'foo bar baz'"></p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver des exemples de modificateur <code>.literal</code> sur les directives.</p>
</div>
{% endraw %}

## Transitions

### `transition` Attribute <sup>remplacé</sup>

Vue's transition system has changed quite drastically and now uses `<transition>` and `<transition-group>` wrapper elements, rather than the `transition` attribute. It's recommended to read the new [Transitions guide](transitions.html) to learn more.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>transition</code> attribute.</p>
</div>
{% endraw %}

### `Vue.transition` for Reusable Transitions <sup>remplacé</sup>

With the new transition system, you can now just [use components for reusable transitions](transitions.html#Reusable-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.transition</code>.</p>
</div>
{% endraw %}

### Transition `stagger` Attribute <sup>retiré</sup>

If you need to stagger list transitions, you can control timing by setting and accessing a `data-index` (or similar attribute) on an element. See [an example here](transitions.html#Staggering-List-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>transition</code> attribute. During your update, you can transition (pun very much intended) to the new staggering strategy as well.</p>
</div>
{% endraw %}

## Events

### `events` option <sup>retiré</sup>

The `events` option has been removed. Event handlers should now be registered in the `created` hook instead. Check out the [`$dispatch` and `$broadcast` migration guide](#dispatch-and-broadcast-replaced) for a detailed example.

### `Vue.directive('on').keyCodes` <sup>remplacé</sup>

The new, more concise way to configure `keyCodes` is through `Vue.config.keyCodes`. For example:

``` js
// enable v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the the old <code>keyCode</code> configuration syntax.</p>
</div>
{% endraw %}

### `$dispatch` and `$broadcast` <sup>remplacé</sup>

`$dispatch` and `$broadcast` have been removed in favor of more explicitly cross-component communication and more maintainable state management solutions, such as [Vuex](https://github.com/vuejs/vuex).

The problem is event flows that depend on a component's tree structure can be hard to reason about and very brittle when the tree becomes large. It simply doesn't scale well and we don't want to set you up for pain later. `$dispatch` and `$broadcast` also do not solve communication between sibling components.

One of the most common uses for these methods is to communicate between a parent and its direct children. In these cases, you can actually [listen to an `$emit` from a child with `v-on`](components.html#Form-Input-Components-using-Custom-Events). This allows you to keep the convenience of events with added explicitness.

However, when communicating between distant descendants/ancestors, `$emit` won't help you. Instead, the simplest possible upgrade would be to use a centralized event hub. This has the added benefit of allowing you to communicate between components no matter where they are in the component tree - even between siblings! Because Vue instances implement an event emitter interface, you can actually use an empty Vue instance for this purpose.

For example, let's say we have a todo app structured like this:

```
Todos
|-- NewTodoInput
|-- Todo
    |-- DeleteTodoButton
```

We could manage communication between components with this single event hub:

``` js
// This is the event hub we'll use in every
// component to communicate between them.
var eventHub = new Vue()
```

Then in our components, we can use `$emit`, `$on`, `$off` to emit events, listen for events, and clean up event listeners, respectively:

``` js
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
```

``` js
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```

``` js
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// It's good to clean up event listeners before
// a component is destroyed.
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

This pattern can serve as a replacement for `$dispatch` and `$broadcast` in simple scenarios, but for more complex cases, it's recommended to use a dedicated state management layer such as [Vuex](https://github.com/vuejs/vuex).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>$dispatch</code> and <code>$broadcast</code>.</p>
</div>
{% endraw %}

## Filters

### Filters Outside Text Interpolations <sup>retiré</sup>

Filters can now only be used inside text interpolations (`{% raw %}{{ }}{% endraw %}` tags). In the past we've found using filters within directives such as `v-model`, `v-on`, etc led to more complexity than convenience. For list filtering on `v-for`, it's also better to move that logic into JavaScript as computed properties, so that it can be reused throughout your component.

In general, whenever something can be achieved in plain JavaScript, we want to avoid introducing a special syntax like filters to take care of the same concern. Here's how you can replace Vue's built-in directive filters:

#### Replacing the `debounce` Filter

Instead of:

``` html
<input v-on:keyup="doStuff | debounce 500">
```

``` js
methods: {
  doStuff: function () {
    // ...
  }
}
```

Use [lodash's `debounce`](https://lodash.com/docs/4.15.0#debounce) (or possibly [`throttle`](https://lodash.com/docs/4.15.0#throttle)) to directly limit calling the expensive method. You can achieve the same as above like this:

``` html
<input v-on:keyup="doStuff">
```

``` js
methods: {
  doStuff: _.debounce(function () {
    // ...
  }, 500)
}
```

For more on the advantages of this strategy, see [the example here with `v-model`](#debounce-Param-Attribute-for-v-model-removed).

#### Replacing the `limitBy` Filter

Instead of:

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

Use JavaScript's built-in [`.slice` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples) in a computed property:

``` html
<p v-for="item in filteredItems">{{ item }}</p>
```

``` js
computed: {
  filteredItems: function () {
    return this.items.slice(0, 10)
  }
}
```

#### Replacing the `filterBy` Filter

Instead of:

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

Use JavaScript's built-in [`.filter` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples) in a computed property:

``` html
<p v-for="user in filteredUsers">{{ user.name }}</p>
```

``` js
computed: {
  filteredUsers: function () {
    var self = this
    return self.users.filter(function (user) {
      return user.name.indexOf(self.searchQuery) !== -1
    })
  }
}
```

JavaScript's native `.filter` can also manage much more complex filtering operations, because you have access to the full power of JavaScript within computed properties. For example, if you wanted to find all active users and case-insensitively match against both their name and email:

``` js
var self = this
self.users.filter(function (user) {
  var searchRegex = new RegExp(self.searchQuery, 'i')
  return user.isActive && (
    searchRegex.test(user.name) ||
    searchRegex.test(user.email)
  )
})
```

#### Replacing the `orderBy` Filter

Instead of:

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

Use [lodash's `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (or possibly [`sortBy`](https://lodash.com/docs/4.15.0#sortBy)) in a computed property:

``` html
<p v-for="user in orderedUsers">{{ user.name }}</p>
```

``` js
computed: {
  orderedUsers: function () {
    return _.orderBy(this.users, 'name')
  }
}
```

You can even order by multiple columns:

``` js
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters being used inside directives. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Filter Argument Syntax <sup>changé</sup>

Filters' syntax for arguments now better aligns with JavaScript function invocation. So instead of taking space-delimited arguments:

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

We surround the arguments with parentheses and delimit the arguments with commas:

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the old filter syntax. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Built-In Text Filters <sup>retiré</sup>

Although filters within text interpolations are still allowed, all of the filters have been removed. Instead, it's recommended to use more specialized libraries for solving problems in each domain (e.g. [`date-fns`](https://date-fns.org/) to format dates and [`accounting`](http://openexchangerates.github.io/accounting.js/) for currencies).

For each of Vue's built-in text filters, we go through how you can replace them below. The example code could exist in custom helper functions, methods, or computed properties.

#### Replacing the `json` Filter

You actually don't need to for debugging anymore, as Vue will nicely format output for you automatically, whether it's a string, number, array, or plain object. If you want the exact same functionality as JavaScript's `JSON.stringify` though, then you can use that in a method or computed property.

#### Replacing the `capitalize` Filter

``` js
text[0].toUpperCase() + text.slice(1)
```

#### Replacing the `uppercase` Filter

``` js
text.toUpperCase()
```

#### Replacing the `lowercase` Filter

``` js
text.toLowerCase()
```

#### Replacing the `pluralize` Filter

The [pluralize](https://www.npmjs.com/package/pluralize) package on npm serves this purpose nicely, but if you only want to pluralize a specific word or want to have special output for cases like `0`, then you can also easily define your own pluralize functions. For example:

``` js
function pluralizeKnife (count) {
  if (count === 0) {
    return 'no knives'
  } else if (count === 1) {
    return '1 knife'
  } else {
    return count + 'knives'
  }
}
```

#### Replacing the `currency` Filter

For a very naive implementation, you could just do something like this:

``` js
'$' + price.toFixed(2)
```

In many cases though, you'll still run into strange behavior (e.g. `0.035.toFixed(2)` rounds up to `0.04`, but `0.045` rounds down to `0.04`). To work around these issues, you can use the [`accounting`](http://openexchangerates.github.io/accounting.js/) library to more reliably format currencies.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete text filters. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Filtres bidirectionnelles <sup>remplacés</sup>

Some users have enjoyed using two-way filters with `v-model` to create interesting inputs with very little code. While _seemingly_ simple however, two-way filters can also hide a great deal of complexity - and even encourage poor UX by delaying state updates. Instead, components wrapping an input are recommended as a more explicit and feature-rich way of creating custom inputs.

As an example, we'll now walk the migration of a two-way currency filter:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

It mostly works well, but the delayed state updates can cause strange behavior. For example, click on the `Result` tab and try entering `9.999` into one of those inputs. When the input loses focus, its value will update to `$10.00`. When looking at the calculated total however, you'll see that `9.999` is what's stored in our data. The version of reality that the user sees is out of sync!

To start transitioning towards a more robust solution using Vue 2.0, let's first wrap this filter in a new `<currency-input>` component:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This allows us add behavior that a filter alone couldn't encapsulate, such as selecting the content of an input on focus. Now the next step will be to extract the business logic from the filter. Below, we pull everything out into an external [`currencyValidator` object](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e):

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This increased modularity not only makes it easier to migrate to Vue 2, but also allows currency parsing and formatting to be:

- unit tested in isolation from your Vue code
- used by other parts of your application, such as to validate the payload to an API endpoint

Having this validator extracted out, we've also more comfortably built it up into a more robust solution. The state quirks have been eliminated and it's actually impossible for users to enter anything wrong, similar to what the browser's native number input tries to do.

We're still limited however, by filters and by Vue 1.0 in general, so let's complete the upgrade to Vue 2.0:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You may notice that:

- Every aspect of our input is more explicit, using lifecycle hooks and DOM events in place of the hidden behavior of two-way filters.
- We can now use `v-model` directly on our custom inputs, which is not only more consistent with normal inputs, but also means our component is Vuex-friendly.
- Since we're no longer using filter options that require a value to be returned, our currency work could actually be done asynchronously. That means if we had a lot of apps that had to work with currencies, we could easily refactor this logic into a shared microservice.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters used in directives like <code>v-model</code>. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Slots

### Duplicate Slots <sup>retiré</sup>

It is no longer supported to have `<slot>`s with the same name in the same template. When a slot is rendered it is "used up" and cannot be rendered elsewhere in the same render tree. If you must render the same content in multiple places, pass that content as a prop.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about duplicate slots <code>v-model</code>.</p>
</div>
{% endraw %}

### `slot` Attribute Styling <sup>retiré</sup>

Content inserted via named `<slot>` no longer preserves the `slot` attribute. Use a wrapper element to style them, or for advanced use cases, modify the inserted content programmatically using [render functions](render-function.html).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find CSS selectors targeting named slots (e.g. <code>[slot="my-slot-name"]</code>).</p>
</div>
{% endraw %}

## Special Attributes

### `keep-alive` Attribute <sup>remplacé</sup>

`keep-alive` is no longer a special attribute, but rather a wrapper component, similar to `<transition>`. For example:

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

This makes it possible to use `<keep-alive>` on multiple conditional children:

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">When `<keep-alive>` has multiple children, they should eventually evaluate to a single child. Any child other than the first one will simply be ignored.</p>

When used together with `<transition>`, make sure to nest it inside:

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find <code>keep-alive</code> attributes.</p>
</div>
{% endraw %}

## Interpolation

### Interpolation within Attributes <sup>retiré</sup>

Interpolation within attributes is no longer valid. For example:

``` html
<button class="btn btn-{{ size }}"></button>
```

Should either be updated to use an inline expression:

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

Or a data/computed property:

``` html
<button v-bind:class="buttonClasses"></button>
```

``` js
computed: {
  buttonClasses: function () {
    return 'btn btn-' + size
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of interpolation used within attributes.</p>
</div>
{% endraw %}

### HTML Interpolation <sup>retiré</sup>

HTML interpolations (`{% raw %}{{{ foo }}}{% endraw %}`) have been removed in favor of the [`v-html` directive](../api/#v-html).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find HTML interpolations.</p>
</div>
{% endraw %}

### One-Time Bindings <sup>remplacé</sup>

One time bindings (`{% raw %}{{* foo }}{% endraw %}`) have been replaced by the new [`v-once` directive](../api/#v-once).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find one-time bindings.</p>
</div>
{% endraw %}

## Reactivity

### `vm.$watch` <sup>changé</sup>

Watchers created via `vm.$watch` are now fired before the associated component rerenders. This gives you the chance to further update state before the component rerender, thus avoiding unnecessary updates. For example, you can watch a component prop and update the component's own data when the prop changes.

If you were previously relying on `vm.$watch` to do something with the DOM after a component updates, you can instead do so in the `updated` lifecycle hook.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to the fact that a watcher was relying on the old behavior.</p>
</div>
{% endraw %}

### `vm.$set` <sup>changé</sup>

`vm.$set` is now just an alias for [`Vue.set`](../api/#Vue-set).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `vm.$delete` <sup>changé</sup>

`vm.$delete` is now just an alias for [`Vue.delete`](../api/#Vue-delete).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `Array.prototype.$set` <sup>retiré</sup>

Use `Vue.set` instead.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$set</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>retiré</sup>

Use `Array.prototype.splice` instead. For example:

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

Or better yet, just pass removal methods an index:

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$remove</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Vue.set` and `Vue.delete` on Vue instances <sup>retiré</sup>

`Vue.set` and `Vue.delete` can no longer work on Vue instances. It is now mandatory to properly declare all top-level reactive properties in the data option. If you'd like to delete properties on a Vue instance or its `$data`, just set it to null.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.set</code> or <code>Vue.delete</code> on a Vue instance. If you miss any, they'll trigger <strong>console warnings</strong>.</p>
</div>
{% endraw %}

### Replacing `vm.$data` <sup>retiré</sup>

It is now prohibited to replace a component instance's root $data. This prevents some edge cases in the reactivity system and makes the component state more predictable (especially with type-checking systems).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of overwriting <code>vm.$data</code>. If you miss any, <strong>console warnings</strong> will be emitted.</p>
</div>
{% endraw %}

### `vm.$get` <sup>retiré</sup>

Just retrieve reactive data directly.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$get</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## DOM-Focused Instance Methods

### `vm.$appendTo` <sup>retiré</sup>

Use the native DOM API:

``` js
myElement.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$appendTo</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$before` <sup>retiré</sup>

Use the native DOM API:

``` js
myElement.parentNode.insertBefore(vm.$el, myElement)
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$before</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$after` <sup>retiré</sup>

Use the native DOM API:

``` js
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
```

Or if `myElement` is the last child:

``` js
myElement.parentNode.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$after</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$remove` <sup>retiré</sup>

Use the native DOM API:

``` js
vm.$el.remove()
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$remove</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Meta Instance Methods

### `vm.$eval` <sup>retiré</sup>

No real use. If you do happen to rely on this feature somehow and aren't sure how to work around it, post on [the forum](http://forum.vuejs.org/) for ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$eval</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>retiré</sup>

No real use. If you do happen to rely on this feature somehow and aren't sure how to work around it, post on [the forum](http://forum.vuejs.org/) for ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$interpolate</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$log` <sup>retiré</sup>

Use the [Vue Devtools](https://github.com/vuejs/vue-devtools) for the optimal debugging experience.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$log</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Instance DOM Options

### `replace: false` <sup>retiré</sup>

Components now always replace the element they're bound to. To simulate the behavior of `replace: false`, you can wrap your root component with an element similar to the one you're replacing. For example:

``` js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

Or with a render function:

``` js
new Vue({
  el: '#app',
  render: function (h) {
    h('div', {
      attrs: {
        id: 'app',
      }
    }, /* ... */)
  }
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>replace: false</code>.</p>
</div>
{% endraw %}

## Global Config

### `Vue.config.debug` <sup>retiré</sup>

No longer necessary, since warnings come with stack traces by default now.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.debug</code>.</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>retiré</sup>

Async is now required for rendering performance.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.async</code>.</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>remplacé</sup>

This has been reworked as a [component-level option](../api/#delimiters). This allows you to use alternative delimiters within your app without breaking 3rd-party components.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.delimiters</code>.</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>retiré</sup>

HTML interpolation has been [removed in favor of `v-html`](#HTML-Interpolation-removed).

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.unsafeDelimiters</code>. After this, the helper will also find instances of HTML interpolation so that you can replace them with `v-html`.</p>
</div>
{% endraw %}

## Global API

### `Vue.extend` with `el` <sup>retiré</sup>

The el option can no longer be used in `Vue.extend`. It's only valid as an instance creation option.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about the <code>el</code> option with <code>Vue.extend</code>.</p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>retiré</sup>

Use components instead.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.elementDirective</code>.</p>
</div>
{% endraw %}

### `Vue.partial` <sup>retiré</sup>

Partials have been removed in favor of more explicit data flow between components, using props. Unless you're using a partial in a performance-critical area, the recommendation is to simply use a [normal component](components.html) instead. If you were dynamically binding the `name` of a partial, you can use a [dynamic component](components.html#Dynamic-Components).

If you happen to be using partials in a performance-critical part of your app, then you should upgrade to [functional components](render-function.html#Functional-Components). They must be in a plain JS/JSX file (rather than in a `.vue` file) and are stateless and instanceless, just like partials. This makes rendering extremely fast.

A benefit of functional components over partials is that they can be much more dynamic, because they grant you access to the full power of JavaScript. There is a cost to this power however. If you've never used a component framework with render functions before, they may take a bit longer to learn.

{% raw %}
<div class="upgrade-path">
  <h4>Mise en évidence</h4>
  <p>Run the <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.partial</code>.</p>
</div>
{% endraw %}
