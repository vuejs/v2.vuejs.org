---
title: La syntaxe de template
type: guide
order: 4
---

<p class="tip">**Cette page est en cours de traduction française. Revenez une autre fois pour lire une traduction achevée ou [participez à la traduction française ici](https://github.com/vuejs-fr/vuejs.org).**</p>Vue.js utilise une syntaxe basée sur le HTML qui vous permet de lier déclarativement le DOM rendu aux données de l'instance de Vue sous-jacente. Tous les templates de Vue.js sont du HTML valide qui peut être interprété par les navigateurs conformes aux spécifications et les interpréteurs HTML.

Sous le capot, Vue compile les templates en fonctions de rendu de DOM Virtuel. Combiné au système de réactivité, Vue est en mesure de déterminer intelligemment le nombre minimum de composants pour lesquels il faut re-déclencher le rendu et d'appliquer le nombre minimales de manipulations au DOM quand l'état de l'application change. 

Si vous êtes familiers avec les concepts de DOM Virtuel et que vous préférez la puissance à l'état brut du Javascript, vous pouvez aussi [écrire directement des fonctions de rendu](render-function.html) à la place des templates, avec un support de JSX optionnel.

## Interpolations

### Texte

La forme de base de la liaison de donnée est l'interpolation de texte en utilisant la syntaxe "Moustache" (les doubes accolades)

``` html
<span>Message: {{ msg }}</span>
```

Le tag moustache sera remplacé par la valeur de la propriété `msg` de l'objet data correspondant. Il sera également mis à jour à chaque fois que la propriété `msg` de l'objet data changera.

Vous pouvez également réaliser des interpolations uniques qui ne se mettront pas à jour lors de la modification des données en utilisant la [directive v-once](../api/#v-once), mais gardez à l'esprit que cela affectera toutes les liaisons de données présentes sur le même noeud:

``` html
<span v-once>Ceci ne changera jamais: {{ msg }}</span>
```

### Raw HTML

Les doubles moustaches interprètent la donnée en tant que texte brut, pas en tant que HTML. Pour afficher réellement du HTML, vous aurez besoin d'utiliser la directive `v-html`

``` html
<div v-html="rawHtml"></div>
```

Le contenus sont alors insérés en tant que   simple HTML - les liaisons de données sont ignorées. A noter que vous ne pouvez pas utiliser `v-html` pour composer des fragments de templates, parce que Vue n'est pas un moteur de template basé sur les chaînes de caractères. A la place, les composants sont préférés en tant qu'unité de base pour la réutilisabilité et la composition de l'IU (Interface Utilisateur).

<p class="tip"> Générer dynamiquement le rendu de HTML arbitraire sur votre site peut être très dangereux car cela peut mener facilement à une [vulnérabilité XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Utilisez l'interpolation HTML uniquement sur du contenu de confiance et **jamais** sur du contenu en fourni par un utilisateur</p>

### Attributes

Les Moustaches ne peuvent pas être utilisées à l'intérieur des attributs HTML, à la place utilisez une [directive v-bind](../api/#v-bind):

``` html
<div v-bind:id="idDynamique"></div>
```

Cela fonctionne également pour les attributs booléens - l'attribut sera retiré si la condition est évaluée à faux :

``` html
<button v-bind:disabled="uneConditionDynamique">Button</button>
```

### Using JavaScript Expressions

Jusqu'ici, nous avons seulement lié de simples propriétés dans nos templates. Mais Vue.js supporte en réalité toute la puissance des expression Javascript à l'intérieur de toutes les liaisons de données.

``` html
{{ number + 1 }}

{{ ok ? 'OUI' : 'NON' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Ces expressions seront évaluées en tant que Javascript dans la portée des données de la Vue instance propriétaire. Une restriction est que chacune de ces liaisons ne peut contenir **qu'une seule expression**, donc ce qui suit ne fonctionnera **PAS**

``` html
<!-- ceci est une déclaration, pas une expression: -->
{{ var a = 1 }}

<!-- flow control won't work either, use ternary expressions -->
<!-- le contrôle de flux ne marchera pas non plus, utilisez des expressions ternaires -->
{{ if (ok) { return message } }}
```

<p class="tip">Les expressions de template sont sandboxées et ont seulement accès à une liste blanche de globales telles que `Math` et `Date`. Vous ne devriez pas tenter d'accéder à des variables globales définies par l'utilisateur dans les expressions de template</p>

## Directives

Les directives sont des attributs spéciaux avec le prefixe `v-`. Les valeurs attendues pour les attributs directives sont **une unique expression Javascript** (A l'exception de `v-for`, qui sera discuté plus loin). Le travail d'une directive est d'appliquer réactivement des effets au DOM quand la valeur de son expression change. Revenons à l'exemple vu dans l'introduction :

``` html
<p v-if="seen">Maintenant vous me voyez</p>
```

Ici, la directive `v-if` enleverait / insererait l'élement `<p>` basé sur l'évaluation à vrai de la valeur de l'expression `seen`.

### Arguments

Some directives can take an "argument", denoted by a colon after the directive name. For example, the `v-bind` directive is used to reactively update an HTML attribute:

``` html
<a v-bind:href="url"></a>
```

Here `href` is the argument, which tells the `v-bind` directive to bind the element's `href` attribute to the value of the expression `url`.

Another example is the `v-on` directive, which listens to DOM events:

``` html
<a v-on:click="doSomething">
```

Here the argument is the event name to listen to. We will talk about event handling in more detail too.

### Modifiers

Modifiers are special postfixes denoted by a dot, which indicate that a directive should be bound in some special way. For example, the `.prevent` modifier tells the `v-on` directive to call `event.preventDefault()` on the triggered event:

``` html
<form v-on:submit.prevent="onSubmit"></form>
```

We will see more use of modifiers later when we take a more thorough look at `v-on` and `v-model`.

## Filters

Vue.js allows you to define filters that can be used to apply common text formatting. Filters are usable in two places: **mustache interpolations and `v-bind` expressions**. Filters should be appended to the end of the JavaScript expression, denoted by the "pipe" symbol:

``` html
<!-- in mustaches -->
{{ message | capitalize }}

<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

<p class="tip">Vue 2.x filters can only be used inside mustache interpolations and `v-bind` expressions (the latter supported since 2.1.0), because filters are primarily designed for text transformation purposes. For more complex data transforms in other directives, you should use [Computed properties](computed.html) instead.</p>

The filter function always receives the expression's value as the first argument.

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

Filters can be chained:

``` html
{{ message | filterA | filterB }}
```

Filters are JavaScript functions, therefore they can take arguments:

``` html
{{ message | filterA('arg1', arg2) }}
```

Here, the plain string `'arg1'` will be passed into the filter as the second argument, and the value of expression `arg2` will be evaluated and passed in as the third argument.

## Shorthands

The `v-` prefix serves as a visual cue for identifying Vue-specific attributes in your templates. This is useful when you are using Vue.js to apply dynamic behavior to some existing markup, but can feel verbose for some frequently used directives. At the same time, the need for the `v-` prefix becomes less important when you are building an [SPA](https://en.wikipedia.org/wiki/Single-page_application) where Vue.js manages every template. Therefore, Vue.js provides special shorthands for two of the most often used directives, `v-bind` and `v-on`:

### `v-bind` Shorthand

``` html
<!-- full syntax -->
<a v-bind:href="url"></a>

<!-- shorthand -->
<a :href="url"></a>
```


### `v-on` Shorthand

``` html
<!-- full syntax -->
<a v-on:click="doSomething"></a>

<!-- shorthand -->
<a @click="doSomething"></a>
```

They may look a bit different from normal HTML, but `:` and `@` are valid chars for attribute names and all Vue.js supported browsers can parse it correctly. In addition, they do not appear in the final rendered markup. The shorthand syntax is totally optional, but you will likely appreciate it when you learn more about its usage later.
