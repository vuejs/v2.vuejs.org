---
title: Directives personnalisées
type: guide
order: 16
---

## Introduction

En supplément de la palette de directive fournie en standard (`v-model` et `v-show`), Vue vous permet également d'enregistrer vos propres directives. Notez qu'avec Vue 2, la forme de code préféré pour la réutilisabilité et l''abstraction est le composant. Il y a cependant des cas où vous aurez juste besoin d'un accès de bas niveau aux éléments du DOM, et c'est là que les directives personnalisées vous seraient utiles. Un exemple pourrait être la prise du focus sur un élément de champ, comme celui-ci :

{% raw %}
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
{% endraw %}

Quand la page charge, cet élément prend le focus (notez que l'autofocus ne fonctionne pas sur Safari mobile). En fait, si vous n'avez cliqué sur rien du tout depuis votre arrivée sur la page, le champ ci-dessous devrait avoir le focus en ce moment même. À présent, jetons un œil à la directive qui pourrait accomplir cela :

``` js
// Enregistrer une directive globale appelée focus
Vue.directive('focus', {
  // Quand l'élément lié est inséré dans le DOM...
  inserted: function (el) {
    // L'élément prend le focus
    el.focus()
  }
})
```

Si vous préférez enregistrer la directive en local à la place, les composants acceptent également l'option `directives` :

``` js
directives: {
  focus: {
    // définition de la directive
  }
}
```

Puis dans un template, vous pouvez utiliser le nouvel attribut `v-focus` sur n'importe quel élément, comme celui-ci :

``` html
<input v-focus>
```

## Fonction de hook

Une définition d'objet directive peut fournir plusieurs fonctions de hook (toutes optionnelles) :

- `bind` : appelée une fois quand la directive est attachée à l'élément. C'est ici que vous pouvez effectuer les actions uniques d'initialisation.

- `inserted`: appelée quand l'élément lié a été inséré dans son nœud parent (cela garanti uniquement sa présence dans le nœud parent, mais pas nécessairement dans le DOM principal).

- `update`: appelée après que le composant conteneur ai été mis à jour, __mais possiblement avant que ses enfants ai été mis à jour__. La valeur de la directive peut ou pas avoir changé, mais vous pouvez passer les mises à jour non nécessaire en comparant les valeurs couramment liées avec les anciennes valeurs (voir plus bas les arguments de hook).

- `componentUpdated`: appelée après que le composant conteneur __et ses enfants__ ai été mis à jour.

- `unbind`: appelée uniquement une fois, quand la directive est déliée de l'élément.

Nous allons explorer les arguments passés à ces hooks (c.-à-d. `el`, `binding`, `vnode`, et `oldVnode`) dans la prochaine section.

## Arguments des hooks d'une directive

Les hooks d'une directive ont accès à ces arguments :

- **el**: L'élément sur lequel la directive est liée. Cela peut être utilisé pour directement manipuler le DOM.
- **binding**: Un objets contenant les propriétés suivantes.
  - **name**: Le nom de la directive, sans le préfixe `v-`.
  - **value**: La valeur passée à la directive. Par exemple dans `v-my-directive="1 + 1"`, la valeur serait `2`.
  - **oldValue**: La valeur précédente, seulement disponible dans `update` et `componentUpdated`. Elle est disponible, que la valeur ai changé ou non.
  - **expression**: L'expression liée en tant que chaîne de caractère. Par exemple dans `v-my-directive="1 + 1"`, l'expression serait `"1 + 1"`.
  - **arg**: L'argument passé à la directive, s'il y en a une. Par exemple dans `v-my-directive:foo`, l'argument serait `"foo"`.
  - **modifiers**: Un objet contenant les modificateurs, s'il y en a. Par exemple dans `v-my-directive.foo.bar`, l'objet des modificateurs serait `{ foo: true, bar: true }`.
- **vnode**: Le nœud virtuel produit par le compilateur Vue. Voir l'[API VNode](../api/#Interface-VNode) pour tous les détails.
- **oldVnode**: Le nœud virtuel précédent, seulement disponible dans les hooks `update` et `componentUpdated`.

<p class="tip">À l'exception de `el`, vous devez traiter ces arguments comme étant en lecture seule (« read-only ») et ne jamais les modifier. Si vous souhaitez partager des informations entre les hooks, il est recommandé de le faire à travers les attributs de données sur mesure de ses éléments (voir [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)).</p>

Un exemple de directive personnalisée utilisant plusieurs de ces propriétés :

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

``` js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'bonjour !'
  }
})
```

{% raw %}
<div id="hook-arguments-example" v-demo:foo.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'bonjour !'
  }
})
</script>
{% endraw %}

## Fonction abrégée

La plupart du temps, vous souhaiterez un même comportement pour les hooks `bind` et `update`, sans avoir besoin des autres hooks. Par exemple :

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Objet en tant que valeur

Si votre directive a besoin de plusieurs valeurs, vous pouvez également passer un objet JavaScript. Souvenez-vous, une directive peut accepter n'importe quelle expression JavaScript.

``` html
<div v-demo="{ color: 'white', text: 'bonjour !' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "bonjour !"
})
```
