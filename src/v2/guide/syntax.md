---
title: Syntaxe de template
type: guide
order: 4
---

Vue.js utilise une syntaxe de template basée sur le HTML qui vous permet de lier déclarativement le DOM rendu aux données de l'instance sous-jacente de Vue. Tous les templates de Vue.js sont du HTML valide qui peut être interprété par les navigateurs et les interpréteurs HTML conformes aux spécifications.

Sous le capot, Vue compile les templates en des fonctions de rendu de DOM Virtuel. Combiné au système de réactivité, Vue est en mesure de déterminer intelligemment le nombre minimal de composants pour lesquels il faut re-déclencher le rendu et d'appliquer le nombre minimal de manipulations au DOM quand l'état de l'application change. 

Si vous êtes familiers avec les concepts de DOM Virtuel et que vous préférez la puissance du JavaScript pur, vous pouvez aussi [écrire directement des fonctions de rendu](render-function.html) à la place des templates, avec un support facultatif de JSX.

## Interpolations

### Texte

La forme la plus élémentaire de la liaison de données est l'interpolation de texte en utilisant la syntaxe "Mustache" (les doubles accolades)

``` html
<span>Message: {{ msg }}</span>
```

La balise moustache sera remplacée par la valeur de la propriété `msg` de l'objet data correspondant. Elle sera également mise à jour à chaque fois que la propriété `msg` de l'objet data changera.

Vous pouvez également réaliser des interpolations à usage unique (qui ne se mettront pas à jour lors de la modification des données) en utilisant la [directive v-once](../api/#v-once), mais gardez à l'esprit que cela affectera toutes les liaisons de données présentes sur le même noeud :

``` html
<span v-once>Ceci ne changera jamais : {{ msg }}</span>
```

### Interpétation du HTML

Les doubles moustaches interprètent la donnée en tant que texte brut, pas en tant que HTML. Pour afficher réellement du HTML, vous aurez besoin d'utiliser la directive `v-html`

``` html
<div v-html="rawHtml"></div>
```

Le contenu de cette `div` sera alors remplacée par la valeur de la propriété `rawHtml` en tant que HTML classique. Les liaisons de données sont ignorées. À noter que vous ne pouvez pas utiliser `v-html` pour composer des fragments de templates, parce que Vue n'est pas un moteur de template basé sur les chaînes de caractères. À la place, les composants sont préférés en tant qu'unité fondamentale pour la réutilisabilité et la composition de l'interface utilisateur.

<p class="tip">Générer dynamiquement du HTML arbitraire sur votre site peut être très dangereux car cela peut mener facilement à des [vulnérabilités XSS](https://fr.wikipedia.org/wiki/Cross-site_scripting). Utilisez l'interpolation HTML uniquement sur du contenu de confiance et **jamais** sur du contenu fourni par l'utilisateur</p>

### Attributs

Les moustaches ne peuvent pas être utilisées à l'intérieur des attributs HTML, à la place utilisez une [directive v-bind](../api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

Cela fonctionne également pour les attributs booléens - l'attribut sera retiré si la condition est évaluée fausse :

``` html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

### Utilisation des expressions JavaScript

Jusqu'ici, nous avons seulement lié de simples clés de propriétés dans nos templates. Mais Vue.js supporte en réalité toute la puissance des expressions JavaScript à l'intérieur de toutes les liaisons de données :

``` html
{{ number + 1 }}

{{ ok ? 'OUI' : 'NON' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Ces expressions seront évaluées en tant que JavaScript au sein de la portée des données de l'instance de Vue propriétaire. Il y a une restriction : chacune de ces liaisons ne peut contenir **qu'une seule expression**, donc ce qui suit **NE** fonctionnera **PAS**

``` html
<!-- ceci est une déclaration, pas une expression: -->
{{ var a = 1 }}

<!-- le contrôle de flux ne marchera pas non plus, utilisez des expressions ternaires -->
{{ if (ok) { return message } }}
```

<p class="tip">Les expressions de template sont isolées et ont seulement accès à une liste blanche de globales telles que `Math` et `Date`. Vous ne devriez pas tenter d'accéder à des variables globales définies par l'utilisateur dans les expressions de template.</p>

## Directives

Les directives sont des attributs spéciaux avec le prefixe `v-`. Les valeurs attendues pour les attributs de directives sont **une unique expression JavaScript** (A l'exception de `v-for`, qui sera expliquée plus loin). Le travail d'une directive est d'appliquer réactivement des effets secondaires au DOM quand la valeur de son expression change. Revenons à l'exemple vu dans l'introduction :

``` html
<p v-if="seen">Maintenant vous me voyez</p>
```

Ici, la directive `v-if` retirerait / insérerait l'élement `<p>` selon que l'expression `seen` soit considérée comme fausse / vraie.

### Arguments

Certaines directives peuvent prendre un "argument", indiqué par un deux-points après le nom de la directive. Par exemple, la directive `v-bind` est utilisée pour mettre à jour réactivement un attribut HTML :

``` html
<a v-bind:href="url"></a>
```

Ici `href` est un argument, qui dit à la directive `v-bind` de lier l'attribut `href` de l'élément à la valeur de l'expression `url`.

Un autre exemple est la directive `v-on`, qui écoute les évènements du DOM :

``` html
<a v-on:click="doSomething">
```

Ici l'argument est le nom de l'évènement à écouter. Nous parlerons aussi plus en détail de la gestion des évènements.

### Modificateurs

Les modificateurs sont des suffixes spéciaux indiqués par un point, qui indique qu'une directive devrait être liée d'une manière spécifique. Par exemple, le modificateur `.prevent` dit à la directive `v-on` d'appeler `event.preventDefault()` lorsque l'évènement survient.

``` html
<form v-on:submit.prevent="onSubmit"></form>
```

Nous verrons plus de cas d'utilisation des modificateurs plus loin quand nous porterons un regard plus attentif sur `v-on` et `v-model`

## Filtres

Vue.js permet de définir des filtres qui peuvent être utilisés pour appliquer des formatages de textes courants. Les filtres sont utilisables à deux endroits : **les interpolations à moustaches et les expressions de v-bind**. Les filtres doivent être ajoutés à la fin de l'expression JavaScript, indiqués par le symbole de la barre verticale : 

``` html
<!-- dans les moustaches -->
{{ message | capitalize }}

<!-- dans les v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

<p class="tip">Les filtres de Vue 2.x peuvent être seulement utilisés à l'intérieur des interpolations de moustaches et des expressions de `v-bind` (ces dernières étant supportées depuis la 2.1.0+) car les filtres ont été conçus à la base dans le but de transformer du texte. Pour des cas plus complexes de transformation de données dans d'autres directives, vous devriez utiliser les [propriétés calculées](computed.html) à la place.</p>

La fonction de filtre reçoit toujours la valeur de l'expression (le résultat de la chaîne) comme premier argument. Dans cet exemple, la fonction de filtre `capitalize` va recevoir la valeur de `message` dans son argument.

``` js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

Les filtres peuvent être chaînés :

``` html
{{ message | filterA | filterB }}
```

Dans ce cas, `filterA`, définie avec un seul argument, va recevoir la valeur de `message`. Puis la fonction `filterB` va être appelée avec le résultat de `filterA` passé dans `filterB` en tant que simple argument.

Les filtres sont des fonctions JavaScript et peuvent donc recevoir des arguments :

``` html
{{ message | filterA('arg1', arg2) }}
```

Ici `filterA` est définie comme une fonction prenant trois arguments. La valeur de `message` va être passée en premier argument. La chaîne de caractères `'arg1'` sera passée au filtre `filterA` en tant que second argument, et la valeur de l'expression `arg2` sera évaluée et passée en tant que troisième argument.

## Abréviations

Le préfixe `v-` sert d'indicateur visuel pour identifier les attributs spécifiques à Vue dans vos templates. C'est pratique lorsque vous utilisez Vue.js pour appliquer des comportements dynamiques sur un balisage existant, mais peut sembler verbeux pour des directives utilisées fréquemment. Par ailleurs, le besoin d'un préfixe `v-`devient moins important quand vous développez une [application monopage](https://fr.wikipedia.org/wiki/Application_web_monopage) où Vue.js gère tous les templates. C'est pourquoi Vue.js fournit des abréviations pour deux des directives les plus utilisées, `v-bind` et `v-on`:

### Abréviation pour `v-bind`

``` html
<!-- syntaxe complète -->
<a v-bind:href="url"></a>

<!-- abréviation -->
<a :href="url"></a>
```


### Abréviation pour `v-on` 

``` html
<!-- syntaxe complète -->
<a v-on:click="doSomething"></a>

<!-- abréviation -->
<a @click="doSomething"></a>
```

Cela peut paraître un peu différent du HTML classique mais `:` et `@` sont des caractères valides pour des noms d'attributs et tous les navigateurs supportés par Vue.js peuvent l'interpréter correctement. De plus, ils n'apparaissent pas dans le balisage final. La syntaxe abrégée est totalement optionnelle, mais vous allez probablement l'apprécier quand vous en apprendrez plus sur son utilisation plus loin.
