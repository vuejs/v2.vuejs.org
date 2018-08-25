---
title: Événements personnalisés
type: guide
order: 103
---

> Cette page suppose que vous avez déjà lu les principes de base des [composants](components.html). Lisez [cette partie](components.html) en premier si les composants sont quelque chose de nouveau pour vous.

## Noms d'événements

Contrairement aux composants et aux props, les noms d'événements ne fournissent pas de conversion kebab-case/camelCase. Le nom de l'événement émis doit correspondre exactement au nom utilisé pour écouter cet événement. Par exemple, si l'on émet un nom d'événement en camelCase :

```js
this.$emit('monEvenement')
```

Alors écouter la version kebab-case n'aura pas d'effet :

```html
<my-component v-on:mon-evenement="doSomething"></my-component>
```

Contrairement aux composants et aux props, les noms d'événements ne seront jamais utilisés comme noms de variables ou de propriétés en JavaScript, donc il n'y a pas de raison d'utiliser camelCase ou PascalCase. De plus, les écouteurs d'événements  `v-on` à l'intérieur de templates DOM seront automatiquement transformées en minuscules (à cause de l'insensibilité à la casse de HTML), donc `v-on:monEvenement` deviendra `v-on:monevenement` -- rendant `monEvenement` impossible à écouter.

Pour ces raisons, nous recommandons de **toujours utiliser la kebab-case pour les noms d'événements**.

## Personnaliser le `v-model` du composant

> Nouveauté de la 2.2.0+

Par défaut, `v-model` sur un composant utilise `value` comme prop et `input` comme événement, mais certains types de champs input tels que les cases à cocher et les boutons radio peuvent vouloir utiliser l'attribut `value` à [d'autres fins](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value). Utiliser l'option `model` permet d'éviter un conflit dans ce genre de cas :

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

À présent, quand vous utilisez `v-model` sur ce composant :

```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```

la valeur de `lovingVue` sera passée à la prop `checked`. La propriété `lovingVue` sera ensuite mise à jour quand `<base-checkbox>` émettra un événement `change` avec une nouvelle valeur.

<p class="tip">Notez que vous avez toujours besoin de déclarer la prop <code>checked</code> dans l'option <code>props</code> du composant.</p>

## Relier des événements natifs aux composants

Il peut y avoir des fois où vous voudrez écouter directement un événement natif sur l'élément racine d'un composant. Dans ces cas-là, vous pouvez utiliser le modificateur `.native` pour `v-on` :

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

Cela peut être utile parfois, mais ce n'est pas une bonne idée quand vous essayez d'écouter l'événement sur un élément bien spécifique tel qu'un `<input>`. Par exemple, le composant `<base-input>` pourrait être revu de façon à ce que l'élément racine soit en fait un élément `<label>` :

```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

Dans ce cas, l'écouteur `.native` dans le parent ne fonctionnera plus et vous ne serez pas prévenus. Il n'y aura pas d'erreurs, mais le gestionnaire d'événement `onFocus` ne sera pas appelé quand vous vous y attendrez.

Pour résoudre ce problème, Vue fournit une propriété `$listeners` contenant un objet avec les écouteurs utilisés sur votre composant. Par exemple :

```js
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

En utilisant la propriété `$listeners`, vous pouvez renvoyer tous les écouteurs d'événements sur le composant vers un élément enfant spécifique avec `v-on="$listeners"`. Pour les éléments tels que `<input>`, pour lesquels vous voulez aussi que `v-model` fonctionne, il est souvent utile de créer une nouvelle propriété calculée pour les écouteurs, tels que la propriété `inputListeners` ci-dessous:

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` fusionne les objets ensemble pour en former un nouveau
      return Object.assign({},
        // Nous ajoutons tous les écouteurs du parent
        this.$listeners,
        // Puis nous pouvons ajouter des écouteurs personnalisés
        // ou surcharger le comportement de certains écouteurs.
        {
          // Cela garantit que le composant fonctionne avec v-model
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

À présent, le composant `<base-input>` est une **enveloppe complètement transparente**, c'est-à-dire qu'il peut être utilisé comme un élément `<input>` normal : tous les mêmes attributs et écouteurs d'événements fonctionneront, sans le modificateur `.native`.

## Modificateur `.sync`

> Nouveauté de la 2.3.0+

Dans certains cas, nous pouvons avoir besoin d'une « liaison à double sens » (*two-way binding*) pour une prop. Malheureusement, une vraie liaison à double sens peut créer des problèmes de maintenance, car les composants enfant peuvent faire muter le parent sans que la source de cette mutation soit explicite que ce soit dans le parent ou l'enfant.

C'est pourquoi à la place, nous recommandons d'émettre des événements en suivant le modèle `update:myPropName`. Par exemple, dans un composant hypothétique avec une prop `title`, nous pourrions communiquer l'intention d'assigner une nouvelle valeur avec :

```js
this.$emit('update:title', nouveauTitre)
```

Ensuite le parent peut écouter cet événement et mettre à jour une propriété de donnée locale s'il le désire. Par exemple :

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

Pour plus de commodité, nous proposons un raccourci pour cette technique avec le modificateur `.sync` :

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

Le modificateur `.sync` peut également être utilisé avec `v-bind` quand on utilise un objet pour assigner plusieurs props à la fois :

```html
<text-document v-bind.sync="doc"></text-document>
```

Cela passe chaque propriété dans l'objet `doc` (p. ex. `title`) en tant que prop individuelle, puis ajoute des écouteurs `v-on` de mise à jour pour chacune.

<p class="tip">Utiliser <code>v-bind.sync</code> avec un objet littéral, par exemple <code>v-bind.sync="{ title: doc.title }"</code>, ne fonctionnera pas. En effet, il y a trop de cas particuliers à considérer pour pouvoir analyser une telle expression.</p>
