---
title: Template Syntax
type: guide
order: 4
---

<p class="tip">**Cette page est en cours de traduction française. Revenez une autre fois pour lire une traduction achevée ou [participez à la traduction française ici](https://github.com/vuejs-fr/vuejs.org).**</p>Vue.js utilise une syntaxe basée sur le HTML vous permettant de lier déclarativement le DOM rendu aux données de l'instance de Vue sous-jacente. Tous les templates de Vue.js sont du HTML valide qui peut être parsé par les navigateurs conformes aux spécifications et les parseurs HTML.

Sous le capot, Vue compile les templates en fonctions de rendu de DOM Virtuel. Combiné au système de réactivité, Vue est en mesure de déterminer judicieusement le nombre minimum de composants dont il doit re-déclencher le rendu et d'appliquer un nombre minimal de manipulation du DOM lorsque l'état de l'application change. 

Si vous êtes familiers avec les concepts de DOM Virtuel et que vous préférez la puissance à l'état brut de Javascript, vous pouvez aussi [écrire directement des fonctions de rendu](render-function.html) à la place des templates, avec un support de JSX optionnel.

## Interpolations

### Texte

La forme la plus basique de liaison de donnée est l'interpolation de texte en utilisant la syntaxe "Moustache" (les accolades doubles)

``` html
<span>Message: {{ msg }}</span>
```

Le tag moustache sera remplacé par la valeur de la propriété `msg` sur l'objet data correspondant. Il sera également mis à jour à chaque fois que la propriété `msg` de l'objet data changera.

Vous pouvez également réaliser des interpolations uniques qui ne se mettront pas à jour lors du changement des données en utilisant la directive [v-once directive](../api/#v-once), mais gardez à l'esprit que cela affectera toutes les liaisons données présente sur le même noeud:

``` html
<span v-once>Ceci ne changera jamais: {{ msg }}</span>
```

### Raw HTML

The double mustaches interprets the data as plain text, not HTML. In order to output real HTML, you will need to use the `v-html` directive:

``` html
<div v-html="rawHtml"></div>
```

Le contenu sont insérés en tant que HTML - les liaisons de données sont ignorées. Notez que vous ne pouvez pas utiliser `v-html` pour composer des templates partiels, parce que Vue n'est pas un moteur de template basé sur les chaînes de caractères. A la place, les composants sont à préférer en tant qu'unité fondamentale pour la réutilisabilité de l'IU et la composition.

<p class="tip"> Générer dynamiquement le rendu d'HTML arbitraire sur votre site peut être très dangereux car cela peut mener facilement à une [vulnérabilité XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Utilisez l'interpolation HTML uniquement sur du contenu de confiance et **jamais** sur du contenu en provenance d'un utilisateur</p>

### Attributes

Les Moustaches ne peuvent pas être utilisées à l'intérieur des attributs HTML, à la place utilisez une [directive v-bind](../api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

Cela fonctionne également pour les attributs booléens - l'attribut sera supprimé si la condition est évaluée à faux :

``` html
<button v-bind:disabled="someDynamicCondition">Button</button>
```

### Using JavaScript Expressions

So far we've only been binding to simple property keys in our templates. But Vue.js actually supports the full power of JavaScript expressions inside all data bindings:

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

These expressions will be evaluated as JavaScript in the data scope of the owner Vue instance. One restriction is that each binding can only contain **one single expression**, so the following will **NOT** work:

``` html
<!-- this is a statement, not an expression: -->
{{ var a = 1 }}

<!-- flow control won't work either, use ternary expressions -->
{{ if (ok) { return message } }}
```

<p class="tip">Template expressions are sandboxed and only have access to a whitelist of globals such as `Math` and `Date`. You should not attempt to access user defined globals in template expressions.</p>

## Directives

Directives are special attributes with the `v-` prefix. Directive attribute values are expected to be **a single JavaScript expression** (with the exception for `v-for`, which will be discussed later). A directive's job is to reactively apply side effects to the DOM when the value of its expression changes. Let's review the example we saw in the introduction:

``` html
<p v-if="seen">Now you see me</p>
```

Here, the `v-if` directive would remove/insert the `<p>` element based on the truthiness of the value of the expression `seen`.

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
