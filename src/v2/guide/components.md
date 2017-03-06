---
title: Composants
type: guide
order: 11
---

## Les composants, qu’est-ce que c’est ?

Les composants sont l'une des plus puissantes fonctionnalités de Vue. Ils vous aident à étendre les éléments de base du HTML en encapsulant du code ré-utilisable. À un haut niveau, les composants sont des éléments personnalisables auxquels le compilateur de Vue attache un comportement. Dans plusieurs cas, ils peuvent apparaître comme des éléments HTML natif étendu avec l'attribut spécial `is`.

## Utilisation des composants

### Enregistrement

Nous avons appris dans les sections précédentes que nous pouvions créer une nouvelle instance de Vue avec :

``` js
new Vue({
  el: '#some-element',
  // options
})
```

Pour enregistrer un composant global, vous pouvez utiliser `Vue.component(tagName, options)`. Par exemple :

``` js
Vue.component('my-component', {
  // options
})
```

<p class="tip">Notez que Vue ne force pas l'utilisation des [règles du W3C](http://www.w3.org/TR/custom-elements/#concepts) en ce qui concerne les noms de balises personnalisées (tout-minuscule, avec obligation de contenir un trait d'union) cependant suivre cette convention est considéré comme une bonne pratique.</p>

Une fois enregistré, un composant peut être utilisé dans une instance de template en tant qu'élément personnalisé, `<my-component></my-component>`. Assurez-vous que le composant soit enregistré **avant** l'instanciation de l'instance racine de Vue. Voici un exemple complet :

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// enregistrer
Vue.component('my-component', {
  template: '<div>Un élément personnalisé !</div>'
})

// créer une instance racine
new Vue({
  el: '#example'
})
```

Ce qui va faire le rendu :

``` html
<div id="example">
  <div>Un élément personnalisé !</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>Un élément personnalisé !</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### Enregistrement local

Vous n'avez pas à enregistrer chaque composant de manière global. Vous pouvez rendre un composant disponible dans la portée d'un(e) autre instance/composant en l'enregistrant avec l'option d'instanciation `components` :

``` js
var Child = {
  template: '<div>Un élément personnalisé !</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> ne sera disponible que dans le template parent
    'my-component': Child
  }
})
```

La même encapsulation est appliqué pour les autres fonctionnalités enregistrables de Vue, comme les directives.

### Limitations d'analyse d'un template à partir du DOM

Quand vous utilisez le DOM en tant que template (ex. : en utilisant l'option `el` pour monter un élément avec du contenu existant), vous êtes sujets à plusieurs restrictions dépendante de la façon de fonctioner du HTML, car Vue peut uniquement récupérer le contenu du template **après** qu'il ai été analysé et normalisé. Des éléments tels que `<ul>`, `<ol>`, `<table>` et `<select>` ont notablement des restrictions sur les éléments que l'on peut trouver à l'intérieur, et plusieurs éléments comme `<option>` ne peuvent apparaitre qu'à l'intérieur de certain éléments.

Ceci est problématique quand on utilise des composants personnalisés avec des éléments qui ont ces restrictions, par exemple :

``` html
<table>
  <my-row>...</my-row>
</table>
```

Le composant personnalisé `<my-row>` va être évalué comme un contenu invalide, ce qui va causer des erreurs dans les éventuels rendus de sortie. Une solution de contournement est d'utiliser l'attribut spécial `is` :

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**Il est a noter que ces limitations n'existe pas si vous utiliser des templates sous forme de chaîne de caractère en provenance d'une des sources suivantes** :

- `<script type="text/x-template">`
- Template de chaîne de caractère littérale JavaScript
- composants `.vue`

Donc, préférez les templates basés sur une chaîne de caractère chaque fois que possible.

### `data` doit être une fonction

La plupart des options qui peuvent être passé dans le constructeur de Vue constructor peuvent être utilisé dans un composant, avec un cas particulier : `data` doit être une fonction. En fait, si vous essayez ça :

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'bonjour'
  }
})
```

Alors Vue va s'arrêter et lancer des avertissement dans la console, vous indiquant que `data` doit être une fonction pour les instances de composant. Cependant, il serait bien de comprendre pourquoi cette règle existe, alors trichons.

``` html
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
```

``` js
var data = { counter: 0 }

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // data est techniquement une fonction, donc Vue ne va
  // pas se plaindre, mais nous allons retourner la même
  // réference d'objet pour chaque instance de composant
  data: function () {
    return data
  }
})

new Vue({
  el: '#example-2'
})
```

{% raw %}
<div id="example-2" class="demo">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
<script>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
</script>
{% endraw %}

Puisque nos trois instances de composant partage le même objet `data`, incrémenter un compteur les incrémentera tous ! Aïl. Réglons ça en retournant plutôt un objet de donnée tout frai :

``` js
data: function () {
  return {
    counter: 0
  }
}
```

Maintenant tous nos compteurs ont leur propre état interne :

{% raw %}
<div id="example-2-5" class="demo">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  }
})
new Vue({
  el: '#example-2-5'
})
</script>
{% endraw %}

### Composition de composants

Les composants sont destinés à être utilisés ensemble, le plus souvent dans une relation parent-enfant : le composant A peut utiliser le composant B dans son propre template. Ils vont inévitablement avoir besoin de communiquer les uns avec les autres : le parent peut avoir besoin de passer des données à son enfant, et l'enfant peut avoir besoin d'informer le parent que quelque chose c'est produit à l'intérieur. Cependant, il est également très important de garder le parent et l'enfant aussi découplé que possible via une interface clairement définie. Cela assure que le code de chaque composant peut être écrit et raisonner à propos de sa propre isolation relative [se suffire à lui même], cela les rends plus maintenable et potentiellement plus simple à ré-utiliser.

Dans Vue.js, la relation parent-enfant peut être résumé ainsi comme **descente de props, remonté d'événements**. Le parent passe les données à l'enfant via les **props**, et l'enfant envoi des messages à son parent via les **événements**. Voyez comment cela fonctionne ci-dessous.

<p style="text-align: center">
  <img style="width:300px" src="/images/props-events.png" alt="descente de props, remonté d'événements">
</p>

## Props

### Passer des données avec props

Chaque instance de composant a sa propre **portée isolée**. Cela signifie qu'on ne peut (et ne devrait pas) directement référencer des données dans un template de composant enfant. Les données doivent être passée aux composants enfant en utilisant **props**.

Une prop est un attribut personnalisé pour passer des informations depuis un composant parent. Un composant enfant a besoin de déclarer spécifiquement quels sont les props qu'il s'attend à recevoir en utilisant [l'option `props`](../api/#props) : 

``` js
Vue.component('child', {
  // declarer les props
  props: ['message'],
  // tout comme les data, une prop peut être utilisée à l'intérieur de templates
  // et est également disponible dans le vm en tant que this.message
  template: '<span>{{ message }}</span>'
})
```

Alors nous pouvons lui passer une chaîne de caractère littérale comme suit :

``` html
<child message="bonjour !"></child>
```

Résultat :

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="bonjour !"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['message'],
      template: '<span>{{ message }}</span>'
    }
  }
})
</script>
{% endraw %}

### camelCase vs. kebab-case

Les attributs HTML sont insensible à la casse, donc quand vous utiliser des templates qui ne sont pas des chaînes de caractère, le nom de prop camelCased a besoin de son équivalent kebab-case (délimité par des traits d'union) :

``` js
Vue.component('child', {
  // camelCase en JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case in HTML -->
<child my-message="bonjour !"></child>
```

Encore une fois, si vous utiliser les templates sous forme de chaîne de caractère, ces limitations ne s'appliquent pas.

### Props dynamique

Similaire à une liaison par attribut normal avec une expression, nous pouvons aussi utiliser `v-bind` pour dynamiquement lier les props aux données de leurs parent. À chaque fois que les données sont mise à jour dans le parent, elles seront également mises à jour dans l'enfant :

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

C'est souvent plus simple d'utiliser la syntaxe d'abréviation pour `v-bind` :

``` html
<child :my-message="parentMsg"></child>
```

Resultat :

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Message de la part du parent'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

### Littéral vs. Dynamique

Une erreur répandu chez les débutants est qu'ils essaient de passer un nombre en utilisant la syntaxe littéral :

``` html
<!-- ceci passe une chaîne de caractère littérale "1" -->
<comp some-prop="1"></comp>
```

Cependant, puisque c'est une prop littérale, sa valeur est passé en tant que chaîne de caractère littérale `"1"` au lieu d'être un nombre. Si nous voulons passer un nombre JavaScript, nous avons besoin d'utiliser `v-bind` ainsi sa valeur est évaluée en tant qu'expression JavaScript :

``` html
<!-- ceci passe un nombre -->
<comp v-bind:some-prop="1"></comp>
```

### Flux de données unidirectionnel

Toutes les props forme une liaison **descendante unidirectionnelle** entre la propriété de l'enfant et celle du parent : quand la propriété parente est mise à jour, cela est signalé à l'enfant, mais d'aucune autre façon. Cela empêche l'enfant de changer l'état du parent, ce qui rendrait le flux de données de votre application difficile à appréhender.

De plus, chaque fois que le composant parent est mis à jour, toutes les props dans le composant enfant vont être rafraîchis avec les dernières valeurs. Cela signifie qu'il **ne** faut **pas** essayer de changer une prop à l'intérieur d'un composant enfant. Si vous le faites, Vue va vous en avertir dans la console.

Il y a habituellement deux cas où il est possible de changer une prop :

1. La prop est utilisée uniquement pour passer une valeur d'initialisation, le composant veut simplement l'utiliser comme une propriété local à partir de ce moment ;

2. La prop est passé en tant que valeur dans un état qui à besoin d'être transformé.

La réponse correcte pour ces cas d'utilisation sont :

1. Définir une propriété locale qui utilise la valeur initial de prop en tant que valeur d'initialisation :

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. Définir une propriété calculée qui est calculée à partir de la valeur de prop :

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Notez que les objets et tableaux en JavaScript sont passés par référence, aussi si la prop est un tableau ou un objet, modifier l'objet ou le tableau lui-même à l'intérieur de l'enfant **va** affecter l'état du parent.</p>

### Validation de prop

Il est possible pour un composant de spécifier les conditions à remplir pour les props qu'il reçoit. Si une condition n'est pas satisfaite, Vue va émettre des alertes. C'est spécialement utile quand vous créer un composant qui a pour vocation d'être utiliser par les autres.

Au lieu de définir les props en tant que tableau de chaîne de caractère, vous pouvez utiliser un objet en tant que validateur de conditions requises :

``` js
Vue.component('example', {
  props: {
    // vérification basique du type (`null` signifie l'acceptation de n'importe quel type)
    propA: Number,
    // types multiple possible
    propB: [String, Number],
    // nécéssite une chaîne de caractère
    propC: {
      type: String,
      required: true
    },
    // un nombre avec une valeur par défaut
    propD: {
      type: Number,
      default: 100
    },
    // les objets et tableaux par défaut doivent être retournés 
    // depuis un retour de fonction
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // fonction de validation personnalisée
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

Le `type` peut être l'un des constructeurs natifs suivant :

- String
- Number
- Boolean
- Function
- Object
- Array

En plus, `type` peut également être une fonction constructeur personnalisée et ainsi l'assertion sera faites avec une vérification `instanceof`.

Quand une validation de prop échoue, Vue va produire un avertissement dans la console (si vous utilisez le *build* de développement).

## Événements personnalisés

Nous avons appris que le parent peut passer des données à l'enfant en utilisant les props, mais comment allons nous informer le parent quand quelque chose arrive ? C'est là que le système d'événement personnalisé de Vue entre en jeu.

### Utilisation de `v-on` avec les événements personnalisés

Chaque instance de Vue implémente une [interface d'événements](../api/#Instance-Methods-Events), cela signifie qu'il peut :

- Écouter un événement en utilisant `$on(eventName)`
- Déclencher un événement en utilisant `$emit(eventName)`

<p class="tip">Notez que le système d'événement de Vue est différent de celui du navigateur [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget). Bien qu'il fonctionne de manière similaire, `$on` and `$emit` __ne__ sont __pas__ des alias pour `addEventListener` et `dispatchEvent`.</p>

De plus, un composant parent peut écouter des événements émis depuis un composant enfant en utilisant `v-on` directement sur le template où le composant enfant est utilisé.

<p class="tip">Vous ne pouvez pas utiliser `$on` pour écouter les événements émis par les enfants. Vous devez utiliser `v-on` directement sur le template, comme dans l'exemple ci-dessous.</p>

Voici un exemple :

``` html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

``` js
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

{% raw %}
<div id="counter-event-example" class="demo">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
</script>
{% endraw %}

Dans cet exemple, il est important de noter que le composant enfant est toujours complètement découplé de ce qui peut se passer à l'extérieur de lui. Tout ce qu'il rapporte comme information concerne sa propre activité, juste au cas où le composant parent écoutait.

#### Lié des événements natifs aux composants

Il y a parfois des fois où vous souhaitez écouter un événement natif sur l'élément racine d'un composant. Dans ce cas, vous devez utiliser le modificateur `.native` sur `v-on`. Par exemple :

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### Champ de formulaire des composants utilisant les événements personnalisés

Les événements personnalisés peuvent aussi être utilisés pour créer des champs personnalisés qui fonctionne avec `v-model`. Rappeler vous :

``` html
<input v-model="something">
```

est juste un sucre syntaxique pour :

``` html
<input 
  v-bind:value="something" 
  v-on:input="something = $event.target.value">
```

Quand il est utilisé avec un composant, cela peut-être simplifié par :

``` html
<custom-input 
  :value="something" 
  @input="something = arguments[0]">
</custom-input>
```

Donc pour qu'un composant fonctionne avec `v-model`, il doit :

- accepter une `value` prop.
- émettre un événement `input` avec la nouvelle valeur.

Voyons cela par l'exemple avec un simple champ de devise :

``` html
<currency-input v-model="price"></currency-input>
```

``` js
Vue.component('currency-input', {
  template: `
    <span>
      $
      <input
        ref="input"
        v-bind:value="value"
        v-on:input="updateValue($event.target.value)">
    </span>
  `,
  props: ['value'],
  methods: {
    // Au lieu de mettre à jour directement la valeur,
    // cette méthode est utilisée pour formater et mettre des contrainte
    // sur la valeur d'entrée
    updateValue: function (value) {
      var formattedValue = value
        // Retirer les espaces de part et d'autre
        .trim()
        // Tronquer à deux chiffres après la virgule
        .slice(0, value.indexOf('.') + 3)
      // Si la valeur n'est pas déjà dans le bon format,
      // la réécrire manuellement pour qu'elle le soit
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // Émettre la valeur du nombre à travers l'événement input
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

{% raw %}
<div id="currency-input-example" class="demo">
  <currency-input v-model="price"></currency-input>
</div>
<script>
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    updateValue: function (value) {
      var formattedValue = value
        .trim()
        .slice(0, value.indexOf('.') + 3)
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      this.$emit('input', Number(formattedValue))
    }
  }
})
new Vue({
  el: '#currency-input-example',
  data: { price: '' }
})
</script>
{% endraw %}

L'implémentation ci-dessus est un peu candide tout de même, Par exemple, les utilisateurs peuvent toujours entrer de multiple périodes [???] et même parfois des lettres (beurk) ! Donc pour ce qui souhaiterait voir un exemple non trivial, voici un filtre de devise plus costaux :

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Personnalisation de composant avec `v-model`
 
 > Nouveau dans la 2.2.0
 
 Par défaut, `v-model` sur un composant utilise `value` en tant que prop et de `input` en tant qu'événement, mais plusieurs types de champ comme les cases à cocher et les boutons radio pourrait utiliser `value` pour un usage différent. Utiliser l'option `model` permet d'éviter se genre de conflit :
 
 ``` js
 Vue.component('my-checkbox', {
   model: {
     prop: 'checked',
     event: 'change'
   },
   props: {
     // ceci permet d'utiliser la prop `value` pour un usage différent
     value: String
   },
   // ...
 })
 ```

``` html
<my-checkbox v-model="foo" value="plusieurs valeurs"></my-checkbox>
```

La partie ci-dessus serait équivalente à :

``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="plusieurs valeurs">
</my-checkbox>
```

### Non communication parent-enfant

Parfois deux composants peuvent avoir besoin de communiquer l'un et l'autre mais ne sont pas parent/enfant l'un de l'autre. Dans un simple scénario, vous pouvez utiliser une instance de Vue vide comme bus d'événements central.

``` js
var bus = new Vue()
```
``` js
// dans la méthode du composant A
bus.$emit('id-selected', 1)
```
``` js
// dans le hook de création de B
bus.$on('id-selected', function (id) {
  // ...
})
```

Dans des cas plus complexes, vous pouvez envisager l'utilisation d'un [*pattern* de management d'état](state-management.html).

## Distribution de contenu avec des slots

Quand on utilise des composants, il est souvent souhaité de les composer comme ceci :

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

Il y a deux choses à noter ici :

1. Le composant `<app>` ne sais pas quel contenu peut être présent à l'intérieur de sa [cible de montage]. Ceci est défini par n'importe quel composant parent qui utilise `<app>`.

2. Le composant `<app>` à vraisemblablement sont propre template.

Pour faire fonctionner la composition, nous avons besoin d'un moyen d'entremêler le « contenu » du parent et le template de son propre composant. C'est un processus appelé **distribution de contenu** (ou « transclusion » si vous êtes familier à Angular). Vue.js implémente une API de distribution de contenu construite après le [brouillon de spécification sur les Web Components](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), en utilisant l'élément spécial `<slot>` pour servir de zone d'atterrissage pour le contenu original.

### Portée de compilation

Avant de rentrer plus profondément dans l'API, clarifions dans quel portée le contenu va être compilé. Imaginez un template comme celui-ci :

``` html
<child-component>
  {{ message }}
</child-component>
```

`message` devrait t-il être lié aux données du parent ou aux données de l'enfant ? La réponse est au parent. Une règle simple pour la portée de composant est :

> Tout dans le template parent est compilé dans la porté parente ; tout dans le template enfant est compilé dans la portée enfant.

Une erreur répandu est d'essayer de lié la directive à une propriété/méthode du template parent :

``` html
<!-- NE marche PAS -->
<child-component v-show="someChildProperty"></child-component>
```

En admettant que `someChildProperty` est une propriété du composant enfant, l'exemple ci-dessus ne fonctionnerait pas. Le template parent n'est pas au courant de l'état du composant enfant.

Si vous avez besoin de lié la portée enfant des directives sur un composant de nœud racine, vous devriez faire cela sur le template du composant lui-même :

``` js
Vue.component('child-component', {
  // ceci fonctionne, car nous sommes dans la bonne portée
  template: '<div v-show="someChildProperty">Enfant</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

De façon similaire, le contenu distribué est compilé dans la portée parente.

### Slot unique

Le contenu parent va être **évincé** si le template du composant enfant contient au moins un `<slot>` d’atterrissage. Quand il n'y a qu'un slot sans aucun attributs, le fragment de contenu entier va être insérer à sa position exact dans le DOM, remplaçant le slot lui-même.

Tout ce qui était contenu à la base dans les balises `<slot>` est considéré comme **du contenu par défaut**. Le contenu par défaut est compilé dans la portée enfant et ne sera affiché que si l'élément incluant est vide et qu'il n'y a pas de contenu à insérer.

Supposons que nous aillons un composant appelé `my-component` avec le template suivant :

``` html
<div>
  <h2>Je suis un titre enfant</h2>
  <slot>
    Ceci ne sera affiché que si il n'y a pas de contenu
    à distribuer.
  </slot>
</div>
```

Et un parent qui utilise le composant :

``` html
<div>
  <h1>Je suis le titre parent</h1>
  <my-component>
    <p>Ceci est le contenu original</p>
    <p>Ceci est encore du contenu original</p>
  </my-component>
</div>
```

Le résultat du rendu serait :

``` html
<div>
  <h1>Je suis le titre parent</h1>
  <div>
    <h2>Je suis un titre enfant</h2>
    <p>Ceci est le contenu original</p>
    <p>Ceci est encore du contenu original</p>
  </div>
</div>
```

### Slots nommés

Les éléments `<slot>` on un attribut spécial, `name`, qui peut être utiliser pour personnaliser la façon dont le contenu doit être distribué. Vous pouvez avoir de multiples slots avec des noms différents. Un slot nommé va concorder avec n'importe quel élément possédant l'attribut `slot` correspondant au sein de son fragment de contenu.

Il reste encore un slot non nommé, c'est le **slot par défaut**  qui va servir de zone d'atterrissage four-tout pour tout contenu ne concordant avec aucun nom. S'il n'y a pas de slot par défaut, le contenu ne concordant pas est évincé.

Par exemple, supposons que nous ayons un composant `app-layout` avec le template suivant :

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

La balise parente :

``` html
<app-layout>
  <h1 slot="header">Ici il devrait y avoir le titre de page</h1>

  <p>Un paragraphe pour le contenu principal.</p>
  <p>En un autre.</p>

  <p slot="footer">Ici plusieurs informations de contact</p>
</app-layout>
```

Le résultat du rendu serait :

``` html
<div class="container">
  <header>
    <h1>Ici il devrait y avoir le titre de page</h1>
  </header>
  <main>
    <p>Un paragraphe pour le contenu principal.</p>
    <p>En un autre.</p>
  </main>
  <footer>
    <p>Ici plusieurs informations de contact</p>
  </footer>
</div>
```

L'API de distribution de contenu est un mécanisme vraiment utile quand les composants structuré son destiné à être composé ensemble.

### Slots avec portée

> Nouveau en 2.1.0

Un slot avec portée est un type spéciale de slot dont that functions as a reusable template (that can be passed data to) instead of already-rendered-elements.

Dans un composant enfant, passez simplement les données via le slot de la même manière que vous passeriez des props dans un composant :

``` html
<div class="child">
  <slot text="bonjour de l'enfant"></slot>
</div>
```

Dans le parent, un élément `<template>` avec un attribut spécial `scope` indique que c'est un template pour un slot avec portée. La valeur de `scope` est le de la variable temporaire qui contient l'objet des props passé à l'enfant :

``` html
<div class="parent">
  <child>
    <template scope="props">
      <span>bonjour du parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```

Si nous faisons le rendu ci-avant, la sortie serait :

``` html
<div class="parent">
  <div class="child">
    <span>bonjour du parent</span>
    <span>bonjour de l'enfant</span>
  </div>
</div>
```

Un usage plus typique des slots avec porté serait une liste de composant qui permettrait le composant utilisateur de personnaliser comment chaque élément de liste devrait être rendu :

``` html
<my-awesome-list :items="items">
  <!-- le slot avec portée peut être nommé aussi -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```

Et le template pour la liste de composant :

``` html
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- contenu par défaut ici -->
  </slot>
</ul>
```

## Composants dynamiques

Vous pouvez utiliser le même point de montage et dynamiquement permuter entre de multiples composants en utilisant l'élément réservé `<component>` et les liées dynamiquement à leurs attribut `is` :

``` js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component v-bind:is="currentView">
  <!-- les composants changes quand vm.currentView changes ! -->
</component>
```

Si vous préférez, vous pouvez aussi les lié directement à des composants objets :

``` js
var Home = {
  template: '<p>Bienvenue chez toi !</p>'
}

var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

### `keep-alive`

Si vous voulez garder un composant précédemment affiché avant permutation en mémoire et ainsi préserver son état ou éviter d'en faire le rendu à nouveau, vous pouvez inclure un composant dynamique dans un élément `<keep-alive>` :

``` html
<keep-alive>
  <component :is="currentView">
    <!-- les composant inactifs vont être mis en cache ! -->
  </component>
</keep-alive>
```

Obtenez plus de détails sur `<keep-alive>` dans la [référence de l'API](../api/#keep-alive).

## Divers

### Créer des composants réutilisables

Quand on créé des composants, c'est une bonne chose de garder à l'esprit la manière dont vous souhaitez le réutiliser plus tard. C'est acceptable qu'un composant ai un couplage fort, mais un composant réutilisable devrait définir une interface publique clair et ne laisser aucun doutes sur son contexte d'utilisation.

L'API pour les composant de Vue se découpe en trois parties : les props, les événements et les slots :

- Les **props** permettent à l'environnement extérieur de passer des données dans au composant

- Les **événements** permettent au composant de déclencher des effets de bord [bizarre c'est péjoratif pour moi] dans l'environnement extérieur

- Les **slots** permettent aux environnements extérieur de composer le composant avec du contenu additionnel.

Avec les syntaxes d'abréviation correspondante de `v-bind` et `v-on`, l'intention peut être clairement et succinctement communiqué dans le template :

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

### Les composants enfants par références

Malgré l’existence des props et des événements, parfois vous auriez toujours besoin d'accéder directement à un composant enfant en JavaScript. Pour parvenir à cela vous pouvez assigner un ID de référence au composant enfant en utilisant `ref`. Par exemple :

``` html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// accès au composant enfant
var child = parent.$refs.profile
```

Quand `ref` est utilisé conjointement avec `v-for`, la référence que vous obtiendrez sera un tableau ou un objet contenant les composant enfant en tant que miroir de la source de donnée.

<p class="tip">`$refs` sont seulement pris en compte après le rendu du composant, et il n'est pas réactif. Il est seulement destiné à servir de porte de secours pour la manipulation directe d'enfant (vous devriez éviter d'utiliser `$refs` dans vos templates et propriétés calculées).</p>

### Composants asynchrones

Dans de grosses applications, nous avons parfois besoin de diviser la structure en plus petits morceaux et uniquement charger le composant depuis le serveur quand cela devient nécessaire. Pour rendre ça plus simple, Vue permet de définir votre composant comme une fonction génératrice qui complétera de manière asynchrone la définition de votre composant. Vue fera appel à la fonction de génération quand un rendu aura besoin d'être fait sur le composant et mettra se rendu en cache pour le resservir lors de futures demandes de rendu. Par exemple :

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Passer la définition du composant à la fonction de retour de complétion
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

La fonction génératrice reçoit une fonction de retour `resolve` qui devra être appelée quand vous aurez récupérer la définition de votre composant depuis le serveur. Vous pouvez également appeler `reject(reason)` pour indiquer que le chargement a échoué. La fonction `setTimeout` est simplement là en tant qu'exemple ; la manière de récupérer le composant est entièrement à votre charge. Une approche recommandée est d'utiliser les composants asynchrones conjointement à [la fonctionnalité de découpage de code de Webpack](https://webpack.js.org/guides/code-splitting-require/) :

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Cette syntaxe de requièrement va informer Webpack
  // d'automatiquement découper votre code de *built* dans
  // des *bundles* qui seront chargés par des requêtes Ajax.
  require(['./my-async-component'], resolve)
})
```

Vous pouvez également retourner une `Promise` (promesse) dans la fonction génératrice ainsi avec Webpack 2 et la syntaxe ES2015 vous pourriez faire :

``` js
Vue.component(
  'async-webpack-example',
  () => import('./my-async-component')
)
```

<p class="tip">Si vous êtes un utilisateur de <strong>Browserify</strong> et que vous souhaitez utiliser les composants asynchrones, le créateur a [malheureusement été clair](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) sur le fait que le chargement asynchrone « n'est pas quelque chose que Browserify supportera un jour. ». Officiellement, du moins. La communauté Browserify a trouvé [plusieurs solutions de contournement](https://github.com/vuejs/vuejs.org/issues/620), qui peuvent être utile pour des applications complexes déjà existantes. Pour tous les autres scénarios, nous vous recommandons simplement d'utiliser Webpack pour générer des premières classes de support asynchrone.</p>

### Conventions de nommage d'un composant

Quand vous enregistrez un composant (ou des props), vous pouvez utiliser la kebab-case, camelCase, ou TitleCase. Vue s'en moque.

``` js
// dans une définition de composant
components: {
  // enregistrement utilisant la kebab-case
  'kebab-cased-component': { /* ... */ },
  // enregistrement utilisant la camelCase
  'camelCasedComponent': { /* ... */ },
  // enregistrement utilisant la TitleCase
  'TitleCasedComponent': { /* ... */ }
}
```

À l'intérieur des templates HTML cependant, vous devez utiliser les équivalences kebab-case :

``` html
<!-- toujours utiliser kebab-case dans les templates -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<title-cased-component></title-cased-component>
```

Quand vous utilisez des template de _chaîne de caractère_ cependant vous n'êtes pas restreint à la sensibilité HTML à la casse. Cela signifie que même dans le template, vous pouvez référencer vos composants et props en utilisant les camelCase, TitleCase, ou kebab-case :

``` html
<!-- utilisez ce que vous voulez dans les chaîne de caractère de templates ! -->
<my-component></my-component>
<myComponent></myComponent>
<MyComponent></MyComponent>
```

Si votre composant ne passe pas de contenu via des éléments `slot` vous pouvez même utiliser la syntaxe d'auto-fermeture `/` après le nom :

``` html
<my-component/>
```

Encore une fois, cela ne fonctionne _que_ dans les templates sous forme de chaîne de caractère, les éléments auto-fermants ne sont pas valide HTML et les analyseur de HTML natif ne les comprennent pas.

### Composants récursifs

Les composants peuvent s'invoquer récursivement dans leur propre template. Cependant, il peuvent uniquement le faire avec l'option `name` :

``` js
name: 'unique-name-of-my-component'
```

Quand vous enregistrez un composant de manière globale en utilisant `Vue.component`, l'ID global est automatiquement défini en tant que l'option `name` du composant.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

Si vous n'êtes pas prudent, les composants récursifs peuvent conduire à des boucles infinis :

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

Un composant comme celui ci dessus va conduire à une erreur « pile d'appel maximum dépassée », donc assurez-vous que les invocations récursives soient conditionnelles (c-à-d utilisent un `v-if` qui vaudra éventuellement `false`).

### Références circulaire entre les composants

Imaginons que vous construisiez une arborescence de fichier, comme Finder ou File Explorer. Vous auriez un composant `tree-forder` avec ce template :

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Puis un composant `tree-folder-contents` avec ce template :

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

Quand vous regardez attentivement, vous voyez que ces composants sont des descendants _et_ des ancêtres l'un de l'autre dans l'arbre de rendu — un paradoxe ! Quand vous enregistrez un composant de manière globale avec `Vue.component`, ce paradoxe est résolue pour vous automatiquement. Si c'est votre cas, vous pouvez arrêter de lire ici.

Cependant, si vous réclamez/importez des composants en utilisant un __système de module__, c-à-d via Webpack ou Browserify, vous obtiendrez une erreur :

```
Échec de montage du composant : un template ou une fonction de rendu n'est pas défini.
```

Pour expliquer ce qui arrive, je vais appeler nos composants A et B. Le système de module voit de quoi A a besoin, d'abord A a besoin de B, mais B à besoin de A, mais A a besoin de B, etc, etc. Çà continue en boucle, et ne sais comment complètement résoudre l'un ou l'autre des composant sans en résoudre un avant l'autre. Pour régler ça, nous avons besoin de donner au système de module un moyen de dire, « A a _éventuellement_ besoin de B, mais il n'y a pas de raison de résoudre B en premier. ».

Dans notre cas, il faut que le composant `tree-folder` le signifie. Nous savons que l'enfant créer un paradoxe dans le composant `tree-folder-contents`, aussi nous allons attendre que le *hook* `beforeCreate` du cycle de vie pour l'enregistrer :

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

Problème résolu !

### Templates avec `inline-template`

Quand l'attribut spécifique `inline-template` est présent sur le composant enfant, il va utiliser son contenu interne en tant que template, plutôt que de le traiter comme comme un contenu distribué. Cela permet une création de template plus flexible.

``` html
<my-component inline-template>
  <div>
    <p>Ceci est traité comme le template du composant lui-même.</p>
    <p>Il n'y aura pas de transclusion de contenu.</p>
  </div>
</my-component>
```

Cependant, la propriété `inline-template` rend la portée de votre template difficile à appréhender. Pour une bonne pratique, préférez définir vos templates à l'intérieur du composant en utilisant l'option `template` ou un élément `template` dans un fichier `.vue`.

### X-Templates

Un autre moyen de définir des templates à l'intérieur d'un élément `script` avec le type `text/x-template`, quand vous référencez le template par son id. Par exemple :

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Bonjour bonjour bonjour</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

Cela peut être pratique pour des démos avec de gros templates ou dans une application extrêmement petites, mais devrait être éviter dans tous les autres cas, car cela sépare les templates du reste de la définition du composant.

### Cheap Static Components with `v-once`

Faire le rendu d'éléments HTML est vraiment rapide avec Vue, mais parfois vous aurez un composant qui contient **beaucoup** de contenu statique. Dans ces cas, vous pouvez vous assurez qu'il est évalué qu'une seul fois puis mis en cache avec la directive `v-once` sur l'élément racine, comme cela :

``` js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Termes et conditions</h1>
      ... beaucoup de contenu statique ...
    </div>
  `
})
```
