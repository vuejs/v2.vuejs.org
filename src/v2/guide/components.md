---
title: Composants
type: guide
order: 11
---

## Les composants, qu’est-ce que c’est ?

Les composants sont l'une des plus puissantes fonctionnalités de Vue. Ils vous permettent d'étendre les éléments de base du HTML pour encapsuler du code réutilisable. À un haut niveau, les composants sont des éléments personnalisables auxquels le compilateur de Vue attache un comportement. Dans certains cas, ils peuvent aussi apparaître comme des éléments HTML natifs étendus avec l'attribut spécial `is`.

## Utilisation des composants

### Inscription

Nous avons appris dans les sections précédentes que nous pouvions créer une nouvelle instance de Vue avec :

``` js
new Vue({
  el: '#some-element',
  // options
})
```

Pour inscrire un composant global, vous pouvez utiliser `Vue.component(tagName, options)`. Par exemple :

``` js
Vue.component('my-component', {
  // options
})
```

<p class="tip">Notez que Vue ne vous force pas à respecter les [règles du W3C](http://www.w3.org/TR/custom-elements/#concepts) en ce qui concerne les noms de balises personnalisées (tout en minuscules, obligation de contenir un trait d'union) bien que suivre cette convention est considéré comme une bonne pratique.</p>

Une fois inscrit, un composant peut être utilisé dans le template d'une instance en tant qu'élément personnalisé, `<my-component></my-component>`. Assurez-vous que le composant soit inscrit **avant** l'instanciation de l'instance racine de Vue. Voici un exemple complet :

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// inscrire
Vue.component('my-component', {
  template: '<div>Un composant personnalisé !</div>'
})

// créer une instance racine
new Vue({
  el: '#example'
})
```

Ce qui donnera comme rendu :

``` html
<div id="example">
  <div>Un composant personnalisé !</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>Un composant personnalisé !</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### Inscription locale

Vous n'êtes pas obligé d'inscrire chaque composant de manière globale. Vous pouvez rendre un composant disponible dans la portée d'un(e) autre composant/instance en l'inscrivant avec l'option `components` lors de l'instanciation :

``` js
var Child = {
  template: '<div>Un composant personnalisé !</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> ne sera disponible que dans le template parent
    'my-component': Child
  }
})
```

La même encapsulation s’applique pour les autres fonctionnalités de Vue pouvant être inscrites, comme les directives.

### Limitations de l'analyse d'un template à partir du DOM

Quand vous utilisez le DOM en tant que template (ex. : en utilisant l'option `el` pour monter un élément avec du contenu existant), vous êtes sujet à plusieurs restrictions dépendantes de la façon dont fonctionne le HTML, car Vue peut uniquement récupérer le contenu du template **après** qu'il ait été analysé et normalisé. Des éléments tels que `<ul>`, `<ol>`, `<table>` et `<select>` ont notamment des restrictions sur les éléments que l'on peut trouver à l'intérieur, et plusieurs éléments comme `<option>` ne peuvent apparaître qu'à l'intérieur de certains éléments.

Ceci est problématique quand on utilise des composants personnalisés avec des éléments qui ont ces restrictions, par exemple :

``` html
<table>
  <my-row>...</my-row>
</table>
```

Le composant personnalisé `<my-row>` sera évalué comme du contenu invalide, ce qui causera des erreurs dans les éventuels rendus en sortie. Une solution de contournement est d'utiliser l'attribut spécial `is` :

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**Il est à noter que ces limitations n'existent pas si vous utilisez des templates sous forme de chaîne de caractères en provenance d'une des sources suivantes** :

- les balises `<script type="text/x-template">`
- les templates de chaîne de caractères littérales en JavaScript
- les composants `.vue`

Donc, préférez l'utilisation des templates de chaîne de caractères lorsque c'est possible.

### `data` doit être une fonction

La plupart des options qui peuvent être passées dans le constructeur de Vue peuvent être utilisées dans un composant, avec un cas particulier : `data` doit être une fonction. En fait, si vous essayez ça :

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'bonjour'
  }
})
```

Alors Vue s'arrêtera et lancera des avertissements dans la console, vous indiquant que `data` doit être une fonction pour les instances de composant. Cependant, il serait bien de comprendre pourquoi cette règle existe, alors trichons.

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

Puisque nos trois instances de composant partagent le même objet `data`, l'incrémentation d'un compteur les incrémentera tous ! Aie. Corrigeons cela en retournant un nouvel objet de données :

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

Les composants sont destinés à être utilisés ensemble, le plus souvent dans une relation parent-enfant : le composant A peut utiliser le composant B dans son propre template. Ils vont inévitablement avoir besoin de communiquer les uns avec les autres : le parent peut avoir besoin de passer des données à l'enfant, et l'enfant peut avoir besoin d'informer le parent que quelque chose s'est produit à l'intérieur. Cependant, il est également très important de garder le parent et l'enfant aussi découplés que possible via une interface clairement définie. Cela assure que le code de chaque composant peut être écrit de manière relativement isolée, cela les rend plus maintenables et potentiellement plus simples à ré-utiliser.

Dans Vue.js, la relation parent-enfant peut être résumée ainsi : **descente de props, remontée d'événements**. Le parent passe les données à l'enfant via les **props**, et l'enfant envoie des messages à son parent via les **événements**. Voyons comment cela fonctionne ci-dessous.


<div class="composition"><div class="composition--parent"><span>Parent</span></div><div class="composition--child"><span>Enfant</span></div><div class="composition--events"><span>Remonter des évènements</span></div><div class="composition--props"><span>Passer des props</span></div><p style="text-align: center"><img style="width:300px" src="/images/props-events.png" alt="descente de props, remontée d'événements"></p></div>


## Props

### Passer des données avec props

Chaque instance de composant a sa propre **portée isolée**. Cela signifie qu'on ne peut (et ne devrait) pas directement référencer des données du parent dans un template de composant enfant. Les données doivent être passées aux composants enfants en utilisant **props**.

Une prop est un attribut personnalisé permettant de passer des informations depuis des composants parents. Un composant enfant a besoin de déclarer explicitement quelles sont les props qu'il s'attend à recevoir en utilisant [l'option `props`](../api/#props) : 

``` js
Vue.component('child', {
  // déclarer les props
  props: ['message'],
  // tout comme les data, une prop peut être utilisée à l'intérieur de templates
  // et est également disponible dans la vm via this.message
  template: '<span>{{ message }}</span>'
})
```

Alors nous pouvons lui passer une simple chaîne de caractères comme suit :

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

Les attributs HTML sont insensibles à la casse, donc quand vous utilisez des templates qui ne sont pas des chaînes de caractères, le nom de la prop en camelCase a besoin de son équivalent en kebab-case (délimité par des traits d'union) :

``` js
Vue.component('child', {
  // camelCase en JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case en HTML -->
<child my-message="bonjour !"></child>
```

Encore une fois, si vous utilisez les templates sous forme de chaîne de caractères, ces limitations ne s'appliquent pas.

### Props dynamiques

Tout comme la liaison d'un attribut ordinaire avec une expression, nous pouvons aussi utiliser `v-bind` pour dynamiquement lier les props aux données de leurs parents. À chaque fois que les données sont mises à jour dans le parent, elles seront également mises à jour dans l'enfant :

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

C'est souvent plus simple d'utiliser la syntaxe abrégée pour `v-bind` :

``` html
<child :my-message="parentMsg"></child>
```

Résultat :

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
    parentMsg: 'Message venant du parent'
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

### Littérale vs. Dynamique

Une erreur répandue chez les débutants est d'essayer de passer un nombre en utilisant la syntaxe littérale :

``` html
<!-- ceci passe une simple chaîne de caractères "1" -->
<comp some-prop="1"></comp>
```

Cependant, puisque c'est une prop littérale, sa valeur est passée en tant que simple chaîne de caractères `"1"` au lieu d'être un nombre. Si nous voulons passer un nombre JavaScript, nous avons besoin d'utiliser `v-bind` ainsi sa valeur est évaluée en tant qu'expression JavaScript :

``` html
<!-- ceci passe un nombre -->
<comp v-bind:some-prop="1"></comp>
```

### Flux de données unidirectionnel

Toutes les props forment une liaison **descendante unidirectionnelle** entre la propriété de l'enfant et celle du parent : quand la propriété parente est mise à jour, cela est signalé à l'enfant, mais pas dans l'autre sens. Cela empêche les composants enfants de modifier accidentellement l'état du parent, ce qui rendrait le flux de données de votre application difficile à appréhender.

De plus, chaque fois que le composant parent est mis à jour, toutes les props dans le composant enfant vont être rafraîchis avec les dernières valeurs. Cela signifie qu'il **ne** faut **pas** essayer de changer une prop à l'intérieur d'un composant enfant. Si vous le faites, Vue vous avertira dans la console.

Il y a habituellement deux cas où il est tentant de changer une prop :

1. La prop est utilisée uniquement pour passer une valeur d'initialisation, le composant enfant veut simplement l'utiliser par la suite comme une propriété de donnée locale à partir de ce moment ;

2. La prop est passée comme une valeur brute qui doit être transformée.

Les réponses correctes pour ces cas d'utilisation sont :

1. Définir une propriété de donnée locale qui utilise la valeur initiale de la prop comme une valeur d'initialisation :

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. Définir une propriété calculée qui est calculée à partir de la valeur de la prop :

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

Il est possible pour un composant de spécifier les conditions à remplir pour les props qu'il reçoit. Si une condition n'est pas satisfaite, Vue émettra des alertes. C'est particulièrement utile quand vous créez un composant qui a pour vocation d'être utilisé par d'autres.

Au lieu de définir les props en tant que tableau de chaîne de caractères, vous pouvez utiliser un objet avec des conditions de validation :

``` js
Vue.component('example', {
  props: {
    // vérification basique du type (`null` signifie l'acceptation de n'importe quel type)
    propA: Number,
    // plusieurs types possibles
    propB: [String, Number],
    // une chaîne de caractères est obligatoire
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
    // par une fabrique de fonctions
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

Le `type` peut être l'un des constructeurs natifs suivants :

- String
- Number
- Boolean
- Function
- Object
- Array

De plus, `type` peut également être une fonction constructeur personnalisée et ainsi l'assertion sera faite avec une vérification `instanceof`.

Quand une validation de prop échoue, Vue produira un avertissement dans la console (si vous utilisez le *build* de développement).

## Événements personnalisés

Nous avons appris que le parent peut passer des données à l'enfant en utilisant les props, mais comment allons-nous informer le parent quand quelque-chose survient ? C'est là que le système d'événement personnalisé de Vue entre en jeu.

### Utilisation de `v-on` avec les événements personnalisés

Chaque instance de Vue implémente une [interface d'événements](../api/#Instance-Methods-Events), cela signifie qu'elle peut :

- Écouter un événement en utilisant `$on(eventName)`
- Déclencher un événement en utilisant `$emit(eventName)`

<p class="tip">Notez que le système d'événement de Vue est différent de celui du navigateur [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget). Bien qu'il fonctionne de manière similaire, `$on` et `$emit` __ne__ sont __pas__ des alias pour `addEventListener` et `dispatchEvent`.</p>

De plus, un composant parent peut écouter des événements émis depuis un composant enfant en utilisant `v-on` directement sur le template où le composant enfant est utilisé.

<p class="tip">Vous ne pouvez pas utiliser `$on` pour écouter les événements émis par les enfants. Vous devez utiliser `v-on` directement dans le template, comme dans l'exemple ci-dessous.</p>

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
  }
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

Dans cet exemple, il est important de noter que le composant enfant est toujours complètement découplé de ce qui se passe en dehors de celui-ci. Tout ce qu'il fait, c'est rapporter des informations sur sa propre activité, juste au cas où le composant parent écouterait.

#### Lier des événements natifs aux composants

Il y a des fois où vous souhaitez écouter un événement natif sur l'élément racine d'un composant. Dans ce cas, vous devez utiliser le modificateur `.native` sur `v-on`. Par exemple :

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### Composants de champ de formulaire utilisant les événements personnalisés

Les événements personnalisés peuvent aussi être utilisés pour créer des champs personnalisés qui fonctionnent avec `v-model`. Rappelez-vous :

``` html
<input v-model="something">
```

est juste du sucre syntaxique pour :

``` html
<input 
  v-bind:value="something" 
  v-on:input="something = $event.target.value">
```

Quand il est utilisé avec un composant, cela peut être simplifié par :

``` html
<custom-input 
  :value="something" 
  @input="value => { something = value }">
</custom-input>
```

Donc pour qu'un composant fonctionne avec `v-model`, il doit :

- accepter une `value` prop
- émettre un événement `input` avec la nouvelle valeur.

Voyons cela par l'exemple avec une simple saisie de devise :

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
    // Au lieu de mettre à jour directement la valeur, cette
    // méthode est utilisée pour formater et mettre des 
    // contraintes sur la valeur en entrée
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

L'implémentation ci-dessus est plutôt naïve cependant. Par exemple, les utilisateurs peuvent toujours saisir plusieurs points et même parfois des lettres (beurk) ! Donc pour ceux qui souhaiteraient voir un exemple non trivial, voici un filtre de devise plus robuste :

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Personnalisation de composant avec `v-model`
 
> Nouveau dans la 2.2.0

Par défaut, `v-model` sur un composant utilise `value` en tant que prop et peuvent vouloir utiliser `input` en tant qu'événement, mais plusieurs types de champ comme les cases à cocher et les boutons radio pourraient utiliser `value` pour un usage différent. Utiliser l'option `model` permet d'éviter les conflits dans ce genre de situations :

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
<my-checkbox v-model="foo" value="une valeur"></my-checkbox>
```

La partie ci-dessus sera équivalente à :

``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="une valeur">
</my-checkbox>
```

### Communication non parent-enfant

Parfois deux composants peuvent avoir besoin de communiquer entre eux mais ne sont pas parent et enfant l'un de l'autre. Dans les scénarios simples, vous pouvez utiliser une instance de Vue vide comme canal d'événements central.

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

Quand on utilise des composants, il est souvent souhaitable de les composer comme ceci :

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

Il y a deux choses à noter ici :

1. Le composant `<app>` ne sait pas quel contenu peut être présent à l'intérieur de sa cible de montage. Ceci est défini par n'importe quel composant parent qui utilise `<app>`.

2. Le composant `<app>` a vraisemblablement son propre template.

Pour faire fonctionner la composition, nous avons besoin d'un moyen pour entremêler le « contenu » du parent et le template de son propre composant. C'est un processus appelé **distribution de contenu** (ou « transclusion » si vous êtes familier avec Angular). Vue.js implémente une API de distribution de contenu modélisée à partir du brouillon [brouillon de spécification sur les Web Components](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), en utilisant l'élément spécial `<slot>` pour servir de points de distribution pour le contenu original.

### Portée de compilation

Avant de rentrer plus profondément dans l'API, clarifions dans quelle portée le contenu va être compilé. Imaginez un template comme celui-ci :

``` html
<child-component>
  {{ message }}
</child-component>
```

`message` devrait-il être lié aux données du parent ou aux données de l'enfant ? La réponse est : au parent. Une règle simple pour la portée du composant est :

> Tout ce qui se trouve dans le template parent est compilé dans la portée du parent ; tout ce qui se trouve dans le template enfant est compilé dans la portée de l'enfant.

Une erreur répandue est d'essayer de lier une directive à une propriété/méthode enfant dans le template du parent :

``` html
<!-- NE fonctionne PAS -->
<child-component v-show="someChildProperty"></child-component>
```

En admettant que `someChildProperty` est une propriété du composant enfant, l'exemple ci-dessus ne fonctionnerait pas. Le template parent n'est pas au courant de l'état du composant enfant.

Si vous avez besoin de lier des directives enfants sur un composant du nœud racine, vous devriez faire cela sur le template du composant enfant :

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

De façon similaire, le contenu distribué sera compilé dans la portée parente.

### Slot unique

Le contenu parent sera **évincé** si le template du composant enfant contient au moins une balise `<slot>`. Quand il n'y a qu'un seul slot sans attributs, tout le fragment de contenu sera inséré à sa position dans le DOM, remplaçant le slot lui-même.

Tout ce qui était contenu à la base dans les balises `<slot>` est considéré comme **du contenu par défaut**. Le contenu par défaut est compilé dans la portée enfant et ne sera affiché que si l'élément l'incluant est vide et qu'il n'y a pas de contenu à insérer.

Supposons que nous ayons un composant appelé `my-component` avec le template suivant :

``` html
<div>
  <h2>Je suis le titre de l'enfant</h2>
  <slot>
    Ceci ne sera affiché que s'il n'y a pas de contenu
    à distribuer.
  </slot>
</div>
```

Et un parent qui utilise le composant :

``` html
<div>
  <h1>Je suis le titre du parent</h1>
  <my-component>
    <p>Ceci est le contenu original</p>
    <p>Ceci est encore du contenu original</p>
  </my-component>
</div>
```

Le résultat du rendu sera :

``` html
<div>
  <h1>Je suis le titre du parent</h1>
  <div>
    <h2>Je suis le titre de l'enfant</h2>
    <p>Ceci est le contenu original</p>
    <p>Ceci est encore du contenu original</p>
  </div>
</div>
```

### Slots nommés

Les éléments `<slot>` on un attribut spécial, `name`, qui peut être utilisé pour personnaliser la façon dont le contenu doit être distribué. Vous pouvez avoir de multiples slots avec des noms différents. Un slot nommé ira avec n'importe quel élément possédant l'attribut `slot` correspondant dans le fragment de contenu.

Il peut encore y avoir un slot non nommé, c'est le **slot par défaut**  qui va servir de fourre-tout pour tout le contenu ne concordant avec aucun nom. S'il n'y a pas de slot par défaut, le contenu ne concordant pas est évincé.

Par exemple, avec un composant `app-layout` avec le template suivant :

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

Le balisage du parent :

``` html
<app-layout>
  <h1 slot="header">Voici un titre de page</h1>

  <p>Un paragraphe pour le contenu principal.</p>
  <p>Et un autre.</p>

  <p slot="footer">Ici plusieurs informations de contact</p>
</app-layout>
```

Le résultat du rendu sera :

``` html
<div class="container">
  <header>
    <h1>Voici un titre de page</h1>
  </header>
  <main>
    <p>Un paragraphe pour le contenu principal.</p>
    <p>Et un autre.</p>
  </main>
  <footer>
    <p>Ici plusieurs informations de contact</p>
  </footer>
</div>
```

L'API de distribution de contenu est un mécanisme vraiment utile lors de la conception de composants qui sont censés être composés ensemble.

### Slots avec portée

> Nouveau dans la 2.1.0

Un slot avec portée est un type de slot spécial qui fonctionne comme un template réutilisable (auquel on peut passer des données) au lieu d'éléments déjà rendus.

Dans un composant enfant, passez simplement les données via le slot de la même manière que vous passeriez des props dans un composant :

``` html
<div class="child">
  <slot text="bonjour de l'enfant"></slot>
</div>
```

Dans le parent, un élément `<template>` avec un attribut spécial `scope` indique que c'est un template pour un slot avec portée. La valeur de `scope` est le nom de la variable temporaire qui contient l'objet des props passé à l'enfant :

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

Si nous faisons le rendu de ce qui précède, la sortie sera :

``` html
<div class="parent">
  <div class="child">
    <span>bonjour du parent</span>
    <span>bonjour de l'enfant</span>
  </div>
</div>
```

Un cas d'utilisation plus typique des slots avec portée serait un composant de liste qui permettrait à l'utilisateur du composant de personnaliser la manière de faire le rendu de chaque élément de la liste :

``` html
<my-awesome-list :items="items">
  <!-- le slot avec portée peut également être nommé -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```

Et le template pour le composant de liste :

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

Vous pouvez utiliser le même point de montage et dynamiquement permuter entre de multiples composants en utilisant l'élément réservé `<component>` et en les liant dynamiquement à son attribut `is` :

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
  <!-- les composants changent quand vm.currentView change ! -->
</component>
```

Si vous préférez, vous pouvez aussi les lier directement à des composants objets :

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

Si vous voulez garder en mémoire les composants à enlever et ainsi préserver son état ou éviter d'en faire le rendu à nouveau, vous pouvez encapsuler un composant dynamique dans un élément `<keep-alive>` :

``` html
<keep-alive>
  <component :is="currentView">
    <!-- les composants inactifs vont être mis en cache ! -->
  </component>
</keep-alive>
```

Obtenez plus de détails sur `<keep-alive>` dans la [référence de l'API](../api/#keep-alive).

## Divers

### Création de composants réutilisables

Lors de la création de composants, il est bon de garder à l’esprit que vous avez l’intention plus tard de les réutiliser ailleurs. Il est acceptable que les composants utilisés qu'une seule fois soient fortement couplés, mais des composants réutilisables doivent définir une interface publique claire et n'émettre aucune hypothèse sur le contexte dans lequel ils sont utilisés.

L'API pour les composants de Vue se découpe en trois parties : les props, les événements et les slots :

- Les **props** permettent à l'environnement extérieur de passer des données dans le composant

- Les **événements** permettent au composant de déclencher des effets de bord dans l'environnement extérieur

- Les **slots** permettent à l'environnement extérieur de composer le composant avec du contenu additionnel.

les syntaxes abrégées dédiées à `v-bind` et `v-on`, l'intention peut être clairement et succinctement communiquée dans le template :

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

### Les refs des composants enfants

Malgré l'existence des props et des événements, parfois vous aurez toujours besoin d'accéder directement à un composant enfant en JavaScript. Pour parvenir à cela vous pouvez assigner un ID de référence au composant enfant en utilisant `ref`. Par exemple :

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

Quand `ref` est utilisé conjointement avec `v-for`, la référence que vous obtenez sera un tableau ou un objet contenant les composants enfants reflétant la source de donnée.

<p class="tip">Les `$refs` sont seulement renseignés après le rendu du composant, et ne sont pas réactives. Elles sont seulement destinées à servir de porte dérobée pour la manipulation directe d'enfant (vous devriez éviter d'utiliser `$refs` dans vos templates et propriétés calculées).</p>

### Composants asynchrones

Dans de grosses applications, nous avons parfois besoin de diviser la structure en de plus petits fragments et uniquement charger le composant depuis le serveur quand c'est vraiment nécessaire. Pour rendre ça plus simple, Vue permet de définir votre composant comme une fabrique de fonctions qui résoudra de manière asynchrone la définition de votre composant. Vue déclenchera la fabrique de fonctions uniquement lorsque le rendu du composant est vraiment nécessaire sur le composant et mettra ce rendu en cache pour le resservir lors de futures demandes de rendu. Par exemple :

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Passer la définition du composant à la fonction de retour `resolve`
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

La fabrique de fonctions reçoit une fonction de retour `resolve` qui devra être appelée quand vous aurez récupéré la définition de votre composant depuis le serveur. Vous pouvez également appeler `reject(reason)` pour indiquer que le chargement a échoué. La fonction `setTimeout` est simplement là en tant qu'exemple ; la manière de récupérer le composant est entièrement à votre charge. Une approche recommandée est d'utiliser les composants asynchrones conjointement avec [la fonctionnalité de découpage de code de Webpack](https://webpack.js.org/guides/code-splitting-require/) :

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Cette syntaxe de `require` va indiquer à Webpack
  // de découper automatiquement votre code après build dans
  // des bundles qui seront chargés par des requêtes Ajax.
  require(['./my-async-component'], resolve)
})
```

Vous pouvez également retourner une `Promise` (promesse) dans la fabrique de fonctions ainsi avec Webpack 2 et la syntaxe ES2015 vous pouvez faire :

``` js
Vue.component(
  'async-webpack-example',
  () => import('./my-async-component')
)
```

Quand vous utilisez une [inscription locale](components.html#Local-Registration), vous pouvez également fournir une fonction qui retourne une `Promise` :

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">Si vous êtes un utilisateur de <strong>Browserify</strong> et que vous souhaitez utiliser ldes composants asynchrones, son créateur a malheureusement [été clair](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) sur le fait que le chargement asynchrone « n'est pas quelque chose que Browserify supportera un jour. ». Officiellement, du moins. La communauté Browserify a trouvé [plusieurs solutions de contournement](https://github.com/vuejs/vuejs.org/issues/620), qui peuvent être utiles pour des applications complexes déjà existantes. Pour tous les autres scénarios, nous vous recommandons simplement d'utiliser Webpack pour un support de première classe des composants asynchrones, intégré par défaut.</p>

### Conventions de nommage d'un composant

Quand vous inscrivez un composant (ou des props), vous pouvez utiliser la kebab-case, camelCase, ou TitleCase. Vue n'en tient pas rigueur.

``` js
// dans une définition de composant
components: {
  // inscription utilisant la kebab-case
  'kebab-cased-component': { /* ... */ },
  // inscription utilisant la camelCase
  'camelCasedComponent': { /* ... */ },
  // inscription utilisant la TitleCase
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

Quand vous utilisez des template basés sur les _chaînes de caractères_, vous n'avez pas les restrictions liées à la sensibilité à la casse du HTML. Cela signifie que même dans le template, vous pouvez référencer vos composants et props en utilisant les camelCase, TitleCase, ou kebab-case :

``` html
<!-- utilisez ce que vous voulez dans les chaînes de caractères de templates ! -->
<my-component></my-component>
<myComponent></myComponent>
<MyComponent></MyComponent>
```

Si votre composant ne passe pas de contenu via des éléments `slot` vous pouvez même utiliser la syntaxe d'auto-fermeture `/` après le nom :

``` html
<my-component/>
```

Encore une fois, cela fonctionne _seulement_ dans les templates sous forme de chaîne de caractères. Les éléments auto-fermants ne sont pas du HTML valide et l'analyseur HTML natif de votre navigateur ne le comprendra pas.

### Composants récursifs

Les composants peuvent s'invoquer récursivement dans leur propre template. Cependant, ils peuvent uniquement le faire avec l'option `name` :

``` js
name: 'unique-name-of-my-component'
```

Quand vous inscrivez un composant de manière globale en utilisant `Vue.component`, l'ID global est automatiquement défini en tant qu'option `name` du composant.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

Si vous n'êtes pas prudent, les composants récursifs peuvent conduire à des boucles infinies :

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

Un composant comme celui ci-dessus conduira à une erreur « taille maximale de pile dépassée »  ("max stack size exceeded"), donc assurez-vous que les invocations récursives soient conditionnelles (c-à-d utilisent un `v-if` qui vaudra éventuellement `false`).

### Références circulaires entre les composants

Imaginons que vous construisiez une arborescence de fichiers, comme Finder ou File Explorer. Vous pouvez avoir un composant `tree-folder` avec ce template :

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

En regardant attentivement, vous verrez que ces composants seront en fait l'ancêtre _et_ le descendant l'un de l'autre dans l'arbre de rendu — un paradoxe ! Quand vous inscrivez un composant de manière globale avec `Vue.component`, ce paradoxe est résolu pour vous automatiquement. Si c'est votre cas, vous pouvez arrêter de lire ici.

Cependant, si vous réclamez/importez des composants en utilisant un __système de module__, c-à-d via Webpack ou Browserify, vous obtiendrez une erreur « Échec de montage du composant : un template ou une fonction de rendu n'est pas défini. » :

```
Failed to mount component: template or render function not defined
```

Pour expliquer ce qui arrive, je vais appeler nos composants A et B. Le système de module voit de quoi A a besoin, d'abord A a besoin de B, mais B à besoin de A, mais A a besoin de B, etc, etc. Ça tourne en boucle, ne sachant pas comment complètement résoudre l'un ou l'autre des composants sans en résoudre un avant l'autre. Pour régler ça, nous avons besoin de donner au système de module un moyen de dire, « A a _éventuellement_ besoin de B, mais il n'y a pas de raison de résoudre B en premier. ».

Dans notre cas, je ferais cela avec le composant `tree-folder`. Nous savons que l'enfant crée un paradoxe dans le composant `tree-folder-contents`, nous allons donc attendre le *hook* `beforeCreate` du cycle de vie pour l'inscrire :

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

Problème résolu !

### Templates avec `inline-template`

Quand l'attribut spécifique `inline-template` est présent sur le composant enfant, il va utiliser son contenu interne en tant que template, plutôt que de le traiter comme un contenu distribué. Cela permet une création de template plus flexible.

``` html
<my-component inline-template>
  <div>
    <p>Ceci est traité comme le template du composant lui-même.</p>
    <p>Il n'y aura pas de transclusion de contenu.</p>
  </div>
</my-component>
```

Cependant, la propriété `inline-template` rend la portée de votre template difficile à appréhender. Pour une bonne pratique, optez plutôt pour définir vos templates à l'intérieur du composant en utilisant l'option `template` ou un élément `template` dans un fichier `.vue`.

### X-Templates

Un autre moyen de définir des templates est de le faire à l'intérieur d'un élément `script` avec le type `text/x-template`, quand vous référencez le template par son id. Par exemple :

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

Cela peut être pratique pour des démos avec de gros templates ou dans des applications extrêmement petites, mais cela devrait être évité dans tous les autres cas, car cela sépare les templates du reste de la définition du composant.

### Composants statiques peu coûteux avec `v-once`

Faire le rendu d'éléments HTML est vraiment rapide avec Vue, mais parfois vous pouvez avoir un composant qui contient **beaucoup** de contenu statique. Dans ces cas, vous pouvez vous assurer qu'il n'est évalué qu'une seule fois puis mis en cache avec la directive `v-once` sur l'élément racine, comme cela :

``` js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Conditions d'utilisation</h1>
      ... beaucoup de contenu statique ...
    </div>
  `
})
```
