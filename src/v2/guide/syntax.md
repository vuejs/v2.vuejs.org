---
title: Syntaxe de template
type: guide
order: 4
---

Vue.js utilise une syntaxe de template basée sur le HTML qui vous permet de lier déclarativement le DOM rendu aux données de l'instance sous-jacente de Vue. Tous les templates de Vue.js sont du HTML valide qui peut être interprété par les navigateurs et les interpréteurs HTML conformes aux spécifications.

Sous le capot, Vue compile les templates en des fonctions de rendus de DOM virtuel. Combiné au système de réactivité, Vue est en mesure de déterminer intelligemment le nombre minimal de composants pour lesquels il faut redéclencher le rendu et d'appliquer le nombre minimal de manipulations au DOM quand l'état de l'application change.

Si vous êtes familiers avec les concepts de DOM virtuel et que vous préférez la puissance du JavaScript pur, vous pouvez aussi [écrire directement des fonctions de rendu](render-function.html) à la place des templates, avec un support facultatif de JSX.

## Interpolations

### Texte

La forme la plus élémentaire de la liaison de données est l'interpolation de texte en utilisant la syntaxe "Mustache" (les doubles accolades)

``` html
<span>Message: {{ msg }}</span>
```

La balise moustache sera remplacée par la valeur de la propriété `msg` de l'objet data correspondant. Elle sera également mise à jour à chaque fois que la propriété `msg` de l'objet data changera.

Vous pouvez également réaliser des interpolations à usage unique qui ne se mettront pas à jour lors de la modification des données en utilisant la [directive v-once](../api/#v-once), mais gardez à l'esprit que cela affectera toutes les liaisons de données présentes sur le même nœud :

``` html
<span v-once>Ceci ne changera jamais : {{ msg }}</span>
```

### Interprétation du HTML

Les doubles moustaches interprètent la donnée en tant que texte brut, pas en tant que HTML. Pour afficher réellement du HTML, vous aurez besoin d'utiliser la directive `v-html`

``` html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>En utilisant les moustaches : {{ rawHtml }}</p>
  <p>En utilisant la directive v-html : <span v-html="rawHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
    return {
      rawHtml: '<span style="color: red">Ceci devrait être rouge.</span>'
    }
  }
})
</script>
{% endraw %}

Le contenu de cette `span` sera alors remplacée par la valeur de la propriété `rawHtml` en tant que HTML classique. Les liaisons de données sont ignorées. À noter que vous ne pouvez pas utiliser `v-html` pour composer des fragments de templates, parce que Vue n'est pas un moteur de template basé sur les chaines de caractères. À la place, les composants sont préférés en tant qu'unité fondamentale pour la réutilisabilité et la composition de l'interface utilisateur.

<p class="tip">Générer dynamiquement du HTML arbitraire sur votre site peut être très dangereux car cela peut mener facilement à des [vulnérabilités XSS](https://fr.wikipedia.org/wiki/Cross-site_scripting). Utilisez l'interpolation HTML uniquement sur du contenu de confiance et **jamais** sur du contenu fourni par l'utilisateur</p>

### Attributs

Les moustaches ne peuvent pas être utilisées à l'intérieur des attributs HTML, à la place utilisez une [directive `v-bind`](../api/#v-bind) :

``` html
<div v-bind:id="dynamicId"></div>
```

Dans le cas des attributs booléens qui impliquent la présence d'une valeur évaluée à `true`, `v-bind` fonctionne un peu différemment. Dans cet exemple :

``` html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

Si `isButtonDisabled` a la valeur `null`, `undefined`, ou `false`, l'attribut `disabled` ne sera pas inclus dans l'élément `<button>` généré.

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

Les directives sont des attributs spéciaux avec le préfixe `v-`. Les valeurs attendues pour les attributs de directives sont **une unique expression JavaScript** (à l'exception de `v-for`, qui sera expliquée plus loin). Le travail d'une directive est d'appliquer réactivement des effets secondaires au DOM quand la valeur de son expression change. Revenons à l'exemple vu dans l'introduction :

``` html
<p v-if="seen">Maintenant vous me voyez</p>
```

Ici, la directive `v-if` retirerait / insèrerait l'élément `<p>` selon que l'expression `seen` soit considérée comme fausse / vraie.

### Arguments

Certaines directives peuvent prendre un "argument", indiqué par un deux-points après le nom de la directive. Par exemple, la directive `v-bind` est utilisée pour mettre à jour réactivement un attribut HTML :

``` html
<a v-bind:href="url"> ... </a>
```

Ici `href` est un argument, qui dit à la directive `v-bind` de lier l'attribut `href` de l'élément à la valeur de l'expression `url`.

Un autre exemple est la directive `v-on`, qui écoute les évènements du DOM :

``` html
<a v-on:click="doSomething"> ... </a>
```

Ici l'argument est le nom de l'évènement à écouter. Nous parlerons aussi plus en détail de la gestion des évènements.

### $todo Dynamic Arguments

> New in 2.6.0+

Starting in version 2.6.0, it is also possible to use a JavaScript expression in a directive argument by wrapping it with square brackets:

``` html
<a v-bind:[attributeName]="url"> ... </a>
```

Here `attributeName` will be dynamically evaluated as a JavaScript expression, and its evaluated value will be used as the final value for the argument. For example, if your Vue instance has a data property, `attributeName`, whose value is `"href"`, then this binding will be equivalent to `v-bind:href`.

Similarly, you can use dynamic arguments to bind a handler to a dynamic event name:

``` html
<a v-on:[eventName]="doSomething"> ... </a>
```

Similarly, when `eventName`'s value is `"focus"`, for example, `v-on:[eventName]` will be equivalent to `v-on:focus`.

#### Dynamic Argument Value Constraints

Dynamic arguments are expected to evaluate to a string, with the exception of `null`. The special value `null` can be used to explicitly remove the binding. Any other non-string value will trigger a warning.

#### Dynamic Argument Expression Constraints

<p class="tip">Dynamic argument expressions have some syntax constraints because certain characters are invalid inside HTML attribute names, such as spaces and quotes. You also need to avoid uppercase keys when using in-DOM templates.</p>

For example, the following is invalid:

``` html
<!-- This will trigger a compiler warning. -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

The workaround is to either use expressions without spaces or quotes, or replace the complex expression with a computed property.

In addition, if you are using in-DOM templates (templates directly written in an HTML file), you have to be aware that browsers will coerce attribute names into lowercase:

``` html
<!-- This will be converted to v-bind:[someattr] in in-DOM templates. -->
<a v-bind:[someAttr]="value"> ... </a>
```

### Modificateurs

Les modificateurs sont des suffixes spéciaux indiqués par un point, qui indique qu'une directive devrait être liée d'une manière spécifique. Par exemple, le modificateur `.prevent` dit à la directive `v-on` d'appeler `event.preventDefault()` lorsque l'évènement survient.

``` html
<form v-on:submit.prevent="onSubmit"> ... </form>
```

Nous verrons plus de cas d'utilisation des modificateurs plus loin quand nous porterons un regard plus attentif sur [`v-on`](events.html#Event-Modifiers) et [`v-model`](events.html#Modificateurs-d’evenements).

## Abréviations

Le préfixe `v-` sert d'indicateur visuel pour identifier les attributs spécifiques à Vue dans vos templates. C'est pratique lorsque vous utilisez Vue.js pour appliquer des comportements dynamiques sur un balisage existant, mais peut sembler verbeux pour des directives utilisées fréquemment. Par ailleurs, le besoin d'un préfixe `v-`devient moins important quand vous développez une [application monopage](https://fr.wikipedia.org/wiki/Application_web_monopage) où Vue.js gère tous les templates. C'est pourquoi Vue.js fournit des abréviations pour deux des directives les plus utilisées, `v-bind` et `v-on` :

### Abréviation pour `v-bind`

``` html
<!-- syntaxe complète -->
<a v-bind:href="url"> ... </a>

<!-- abréviation -->
<a :href="url"> ... </a>

<!-- abréviation avec argument dynamique (2.6.0+) -->
<a :[key]="url"> ... </a>
```

### Abréviation pour `v-on`

``` html
<!-- syntaxe complète -->
<a v-on:click="doSomething"> ... </a>

<!-- abréviation -->
<a @click="doSomething"> ... </a>

<!-- abréviation avec argument dynamique (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

Cela peut paraitre un peu différent du HTML classique, mais `:` et `@` sont des caractères valides pour des noms d'attributs et tous les navigateurs supportés par Vue.js peuvent l'interpréter correctement. De plus, ils n'apparaissent pas dans le balisage final. La syntaxe abrégée est totalement optionnelle, mais vous allez probablement l'apprécier quand vous en apprendrez plus sur son utilisation plus loin.
